import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  advanceDecision,
  beginBeatPlayback,
  previousBeatIndex,
  QuestStoryScene,
  readingTimeMs,
  SCENE_GAP_MS,
  type SceneBeat,
} from "./quest-story-scene";

describe("readingTimeMs", () => {
  it("floors very short lines at 2200ms", () => {
    expect(readingTimeMs("Hi")).toBe(2200);
    expect(readingTimeMs("")).toBe(2200);
  });

  it("scales with word count once it exceeds the floor", () => {
    const line = "one two three four five six seven eight nine ten";
    expect(readingTimeMs(line)).toBe(10 * 380);
  });

  it("ignores stray whitespace when counting words", () => {
    expect(readingTimeMs("  Hi   there   friend  ")).toBe(Math.max(2200, 3 * 380));
  });
});

describe("advanceDecision", () => {
  it("moves to the next beat while more remain", () => {
    expect(advanceDecision(0, 3)).toEqual({ kind: "beat", index: 1 });
    expect(advanceDecision(1, 3)).toEqual({ kind: "beat", index: 2 });
  });

  it("completes once the last beat has played", () => {
    expect(advanceDecision(2, 3)).toEqual({ kind: "complete" });
  });
});

describe("previousBeatIndex", () => {
  it("steps back one beat", () => {
    expect(previousBeatIndex(2)).toBe(1);
  });

  it("never rewinds past the first beat", () => {
    expect(previousBeatIndex(0)).toBe(0);
  });
});

describe("beginBeatPlayback (muted / no-voice path — this repo's test env has no DOM/Audio)", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("advances after the reading-speed timer when the beat has no voice", () => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    const beat: SceneBeat = { speaker: "NOVA", line: "Hang on, we will get the warmth back." };
    beginBeatPlayback(beat, false, { onAdvance });

    vi.advanceTimersByTime(readingTimeMs(beat.line) - 1);
    expect(onAdvance).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("uses the reading timer instead of audio when muted, even with a voice source", () => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    const createAudio = vi.fn();
    const beat: SceneBeat = { speaker: "NOVA", line: "Hi", voice: "/audio/mountain-rescue/x.mp3" };
    beginBeatPlayback(beat, true, { onAdvance }, createAudio);

    expect(createAudio).not.toHaveBeenCalled();
    vi.advanceTimersByTime(readingTimeMs(beat.line));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("cancelling the returned disposer holds playback (pause semantics)", () => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    const beat: SceneBeat = { speaker: "NOVA", line: "Hang on, we will get the warmth back." };
    const cancel = beginBeatPlayback(beat, false, { onAdvance });

    cancel();
    vi.advanceTimersByTime(readingTimeMs(beat.line) + SCENE_GAP_MS + 1000);
    expect(onAdvance).not.toHaveBeenCalled();
  });
});

const TWO_BEATS: readonly SceneBeat[] = [
  { speaker: "NOVA", line: "First line of the scene." },
  { speaker: "YOU", line: "Second and final line." },
];

function renderScene(beat: number, paused = false) {
  return renderToStaticMarkup(
    React.createElement(QuestStoryScene, {
      beats: TWO_BEATS,
      beat,
      onBeat: () => {},
      onComplete: () => {},
      paused,
    }),
  );
}

describe("QuestStoryScene render output", () => {
  // This repo's vitest config has no DOM (no jsdom/happy-dom), matching every
  // other component test here — so these are renderToStaticMarkup snapshots
  // of the controlled `beat`/`paused` props, not simulated clicks. Effects
  // (and therefore audio/timers/onStart) never run under
  // renderToStaticMarkup; that behavior is covered above via
  // beginBeatPlayback's fake-timer tests and verified live in the browser.

  it("shows the first beat's speaker and line, with Back disabled", () => {
    const html = renderScene(0);
    expect(html).toContain("First line of the scene.");
    expect(html).toContain("<small>NOVA</small>");
    expect(html).toContain('disabled="" aria-label="Back one line"');
  });

  it("shows the second beat with Back enabled", () => {
    const html = renderScene(1);
    expect(html).toContain("Second and final line.");
    expect(html).toContain("<small>YOU</small>");
    expect(html).not.toContain('disabled="" aria-label="Back one line"');
  });

  it("renders one progress dot per beat, lit through the current beat", () => {
    const html = renderScene(1);
    expect(html).toMatch(/aria-label="Story line 2 of 2"/);
    expect((html.match(/class="lit"/g) ?? []).length).toBe(2);
  });

  it("labels the toggle as Pause by default and shows Play story while paused", () => {
    expect(renderScene(0, false)).toContain('aria-label="Pause story"');
    expect(renderScene(0, true)).toContain('aria-label="Play story"');
  });

  it("always renders Replay and Skip controls", () => {
    const html = renderScene(0);
    expect(html).toContain('aria-label="Replay this line"');
    expect(html).toContain('aria-label="Skip story"');
    expect(html).toContain("Skip story");
  });

  it("renders scene art passed as children ahead of the caption", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        QuestStoryScene,
        { beats: TWO_BEATS, beat: 0, onBeat: () => {}, onComplete: () => {} },
        React.createElement("div", { className: "test-art" }, "art"),
      ),
    );
    expect(html).toContain('class="test-art"');
    expect(html.indexOf('class="test-art"')).toBeLessThan(html.indexOf("First line of the scene."));
  });
});
