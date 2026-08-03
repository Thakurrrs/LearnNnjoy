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

// A minimal stand-in for HTMLAudioElement: this repo's test environment has
// no DOM (no jsdom/happy-dom), so `new Audio(...)` isn't available here —
// the `createAudio` injection seam lets these tests exercise the audio-path
// wiring (onended/onerror/play() rejection) without it.
type StubAudio = {
  preload: string;
  muted: boolean;
  onended: (() => void) | null;
  onerror: (() => void) | null;
  play: () => Promise<void>;
  pause: () => void;
};

function createStubAudio(play: () => Promise<void> = () => Promise.resolve()): StubAudio {
  return { preload: "", muted: false, onended: null, onerror: null, play, pause: () => {} };
}

describe("beginBeatPlayback (stub audio path)", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("advances SCENE_GAP_MS after the stub audio's onended fires", () => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    const stub = createStubAudio();
    const beat: SceneBeat = { speaker: "NOVA", line: "Hooked on!", voice: "/audio/mountain-rescue/x.mp3" };
    beginBeatPlayback(beat, false, { onAdvance }, () => stub as unknown as HTMLAudioElement);

    stub.onended?.();
    vi.advanceTimersByTime(SCENE_GAP_MS - 1);
    expect(onAdvance).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("falls back to the reading timer when the stub audio's onerror fires", () => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    const stub = createStubAudio();
    const beat: SceneBeat = {
      speaker: "NOVA",
      line: "This line's audio file failed to load on the way in.",
      voice: "/audio/mountain-rescue/broken.mp3",
    };
    beginBeatPlayback(beat, false, { onAdvance }, () => stub as unknown as HTMLAudioElement);

    stub.onerror?.();
    vi.advanceTimersByTime(readingTimeMs(beat.line) - 1);
    expect(onAdvance).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("does not double-schedule when both onerror and a play() rejection fire", () => {
    // The two paths races scheduleAdvance twice with the same delay; the
    // timer-hygiene fix (clear-before-set) must collapse that to one.
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    const rejection = new Error("network error");
    const playPromise = Promise.reject(rejection);
    const stub = createStubAudio(() => playPromise);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const beat: SceneBeat = {
      speaker: "NOVA",
      line: "This line's audio file failed to load on the way in.",
      voice: "/audio/mountain-rescue/broken.mp3",
    };
    beginBeatPlayback(beat, false, { onAdvance }, () => stub as unknown as HTMLAudioElement);

    stub.onerror?.();
    return playPromise.catch(() => {}).then(() => {
      vi.advanceTimersByTime(readingTimeMs(beat.line));
      expect(onAdvance).toHaveBeenCalledTimes(1);
      warnSpy.mockRestore();
    });
  });

  it("fires onAwaitingGesture and does not advance when play() rejects with NotAllowedError", async () => {
    const onAdvance = vi.fn();
    const onAwaitingGesture = vi.fn();
    const rejection = new DOMException("Autoplay refused", "NotAllowedError");
    const playPromise = Promise.reject(rejection);
    const stub = createStubAudio(() => playPromise);
    const beat: SceneBeat = { speaker: "NOVA", line: "Hooked on!", voice: "/audio/mountain-rescue/x.mp3" };
    beginBeatPlayback(beat, false, { onAdvance, onAwaitingGesture }, () => stub as unknown as HTMLAudioElement);

    await playPromise.catch(() => {});
    await playPromise.catch(() => {});
    expect(onAwaitingGesture).toHaveBeenCalledTimes(1);
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("falls back to the reading timer when play() rejects with a different error", async () => {
    vi.useFakeTimers();
    const onAdvance = vi.fn();
    const onAwaitingGesture = vi.fn();
    const rejection = new Error("some other playback failure");
    const playPromise = Promise.reject(rejection);
    const stub = createStubAudio(() => playPromise);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const beat: SceneBeat = {
      speaker: "NOVA",
      line: "Some other playback failure happened here.",
      voice: "/audio/mountain-rescue/x.mp3",
    };
    beginBeatPlayback(beat, false, { onAdvance, onAwaitingGesture }, () => stub as unknown as HTMLAudioElement);

    await playPromise.catch(() => {});
    await playPromise.catch(() => {});
    expect(onAwaitingGesture).not.toHaveBeenCalled();
    expect(onAdvance).not.toHaveBeenCalled();

    vi.advanceTimersByTime(readingTimeMs(beat.line));
    expect(onAdvance).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
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
    expect(html).toContain("Skip story");
  });

  it("names the Skip button from its own visible text, not a mismatched aria-label", () => {
    // WCAG 2.5.3 Label in Name: skipLabel varies by caller (e.g. "Skip
    // ahead" for the finale), so the button relies on its visible text for
    // its accessible name instead of a hardcoded aria-label that could
    // drift from it.
    const html = renderToStaticMarkup(
      React.createElement(QuestStoryScene, {
        beats: TWO_BEATS,
        beat: 0,
        onBeat: () => {},
        onComplete: () => {},
        skipLabel: "Skip ahead",
      }),
    );
    expect(html).toContain("Skip ahead");
    expect(html).not.toContain("aria-label=\"Skip");
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

describe("QuestStoryScene stage hooks (per-beat and speaker classes)", () => {
  // These are controlled props (beat is owned by the caller), so re-rendering
  // at a different `beat` value is exactly what advancing playback looks
  // like from the stage wrapper's point of view — no DOM/timers required.

  it("puts the current beat index and speaker on the stage wrapper, with a matching data attribute", () => {
    const html = renderScene(0);
    expect(html).toMatch(
      /<div class="quest-story-scene-stage scene-beat-0 scene-speaker-nova" data-scene-beat="0">/,
    );
  });

  it("updates the beat and speaker classes as the controlled beat advances", () => {
    const html = renderScene(1);
    expect(html).toMatch(
      /<div class="quest-story-scene-stage scene-beat-1 scene-speaker-you" data-scene-beat="1">/,
    );
  });

  it("keeps the speaker class matched to the current beat's speaker, not the previous one", () => {
    // TWO_BEATS is NOVA then YOU — beat 0 must never carry "scene-speaker-you"
    // and beat 1 must never carry "scene-speaker-nova".
    expect(renderScene(0)).not.toContain("scene-speaker-you");
    expect(renderScene(1)).not.toContain("scene-speaker-nova");
  });

  it("appends the caller's className after the stage hooks, keeping it backward compatible", () => {
    const html = renderToStaticMarkup(
      React.createElement(QuestStoryScene, {
        beats: TWO_BEATS,
        beat: 0,
        onBeat: () => {},
        onComplete: () => {},
        className: "mountain-opening-scene",
      }),
    );
    expect(html).toContain(
      'class="quest-story-scene-stage scene-beat-0 scene-speaker-nova mountain-opening-scene"',
    );
  });

  it("clamps the beat classes to the last beat when the controlled beat prop overshoots", () => {
    const html = renderScene(5);
    expect(html).toContain('class="quest-story-scene-stage scene-beat-1 scene-speaker-you"');
    expect(html).toContain('data-scene-beat="1"');
  });
});
