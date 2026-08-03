"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { sound } from "@/lib/sound";

export type SceneBeat = {
  speaker: string;
  line: string;
  voice?: string | null;
};

export type QuestStorySceneProps = {
  beats: readonly SceneBeat[];
  /** Controlled: the caller owns and persists the current beat index. */
  beat: number;
  onBeat: (beat: number) => void;
  /** Fired once, after the LAST beat finishes playing (or on Skip). */
  onComplete: () => void;
  /** Fired once, the moment the scene is mounted (i.e. playback begins),
   * regardless of whether the first play() attempt is actually allowed by
   * the browser's autoplay policy. Used for state writes that must happen
   * as soon as the child lands on the scene, not gated on a click. */
  onStart?: () => void;
  /** Default "Skip story", to match the existing skit copy. */
  skipLabel?: string;
  /** Extra class name appended to the stage wrapper (art + caption), so a
   * caller can hang its own background/sizing rules off the same element
   * its scene art already expects (e.g. "mountain-opening-scene"). The
   * wrapper always also carries "scene-beat-<index>" and
   * "scene-speaker-<lowercased speaker>" (plus a matching
   * data-scene-beat attribute), updated as the controlled beat advances,
   * so a caller's scene art can be choreographed per beat/speaker purely
   * in CSS — see the Mountain arrival act for the reference usage. */
  className?: string;
  /** The scene art/stage, rendered behind the caption bubble. */
  children?: ReactNode;
  /** External hold — e.g. an action beat elsewhere on screen that must
   * finish before this scene is allowed to keep playing. */
  paused?: boolean;
};

/** Short silence between one line ending and the next one starting. */
export const SCENE_GAP_MS = 400;

/**
 * Reading-speed fallback used whenever there is no voice line to time
 * against (muted, missing, or broken audio): roughly 380ms per word, with a
 * floor so even a two-word line stays on screen long enough to read.
 */
export function readingTimeMs(line: string): number {
  const words = line.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2200, words * 380);
}

export type AdvanceDecision =
  | { kind: "beat"; index: number }
  | { kind: "complete" };

/**
 * Pure "what happens after this beat finishes" decision. Extracted so the
 * rule (advance to the next beat, or the story is over) can be unit-tested
 * without any timers, audio, or React involved.
 */
export function advanceDecision(beat: number, totalBeats: number): AdvanceDecision {
  const next = beat + 1;
  return next < totalBeats ? { kind: "beat", index: next } : { kind: "complete" };
}

/** Target beat for the "back one line" control — never rewinds past the first line. */
export function previousBeatIndex(beat: number): number {
  return Math.max(0, beat - 1);
}

type BeatPlaybackHandlers = {
  onAdvance: () => void;
  onAwaitingGesture?: () => void;
  onPlaybackStarted?: () => void;
};

/**
 * Framework-free playback for a single beat: plays its voice line, or, when
 * muted, missing, or broken, waits out a reading-speed timer instead. Kept
 * separate from React so the timing rules are directly unit-testable with
 * vitest's fake timers — this repo's test environment has no DOM (no
 * jsdom/happy-dom), so the muted/no-voice path is the one covered by unit
 * tests; the audio path is verified live in the browser.
 *
 * Returns a disposer that cancels whatever is currently in flight (used for
 * pause, beat changes, replay, and unmount).
 */
export function beginBeatPlayback(
  beat: SceneBeat,
  muted: boolean,
  handlers: BeatPlaybackHandlers,
  createAudio: (source: string) => HTMLAudioElement = (source) => new Audio(source),
): () => void {
  let disposed = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let audio: HTMLAudioElement | null = null;

  function scheduleAdvance(delayMs: number) {
    // A broken source can fire both the play() rejection handler and
    // onerror; clearing any pending timer first keeps that a single
    // scheduled advance instead of two racing ones.
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!disposed) handlers.onAdvance();
    }, delayMs);
  }

  if (muted || !beat.voice) {
    handlers.onPlaybackStarted?.();
    scheduleAdvance(readingTimeMs(beat.line));
  } else {
    audio = createAudio(beat.voice);
    audio.preload = "auto";
    audio.onended = () => {
      if (!disposed) scheduleAdvance(SCENE_GAP_MS);
    };
    audio.onerror = () => {
      if (!disposed) scheduleAdvance(readingTimeMs(beat.line));
    };
    void audio
      .play()
      .then(() => {
        if (!disposed) handlers.onPlaybackStarted?.();
      })
      .catch((error: unknown) => {
        if (disposed) return;
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          // Autoplay was refused — most likely a hard reload straight into
          // this scene, with no prior user gesture on the page. Hold here;
          // the Play control flips this back to a normal playback attempt.
          handlers.onAwaitingGesture?.();
          return;
        }
        console.warn(`[quest-story-scene] voice failed for ${beat.voice}`, error);
        handlers.onPlaybackStarted?.();
        scheduleAdvance(readingTimeMs(beat.line));
      });
  }

  return () => {
    disposed = true;
    if (timer) clearTimeout(timer);
    audio?.pause();
  };
}

/**
 * Shared continuous-playback scene engine. Lines play one after another —
 * audio ends, a short gap, then the next line — with no "Next line" click
 * in between. Pause/resume, back-one-line, replay-current-line and Skip are
 * all real buttons. Muted or failed audio falls back to a reading-speed
 * timer so the caption still carries the scene.
 *
 * Resume semantics: resuming (or replaying) always restarts the CURRENT
 * line from its start — there is no audio seek/resume-from-position. This
 * keeps the engine simple and is inaudible in practice (lines are short).
 *
 * Two more intentional nuances:
 * - Pause is UI-only state, not persisted: a reload always resumes at the
 *   saved beat in the "attempting to play" state (see the autoplay-policy
 *   note above), never still paused from a prior session. A muted scene
 *   left "playing" therefore keeps auto-advancing on its own via the
 *   reading-speed timers even though no audio is audible.
 * - Muting mid-line does not interrupt the line already in flight (audio
 *   keeps playing to its natural end); `sound.isMuted()` is only read again
 *   when the NEXT beat starts, so that is the first line the timer fallback
 *   applies to.
 */
export function QuestStoryScene({
  beats,
  beat,
  onBeat,
  onComplete,
  onStart,
  skipLabel = "Skip story",
  className,
  children,
  paused: externalPaused = false,
}: QuestStorySceneProps) {
  const safeBeat = Math.min(Math.max(beat, 0), Math.max(beats.length - 1, 0));
  const current = beats[safeBeat];

  const cancelRef = useRef<(() => void) | null>(null);
  const [internalPaused, setInternalPaused] = useState(false);
  const [awaitingGesture, setAwaitingGesture] = useState(false);
  const paused = externalPaused || internalPaused || awaitingGesture;

  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const startedOnceRef = useRef(false);
  useEffect(() => {
    if (startedOnceRef.current) return;
    startedOnceRef.current = true;
    onStart?.();
    // Fires exactly once, on mount: the scene counts as "started" the
    // moment the child lands on it, whether or not the very first play()
    // attempt is actually allowed by the browser's autoplay policy.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = useCallback(() => {
    if (pausedRef.current) return;
    const decision = advanceDecision(safeBeat, beats.length);
    if (decision.kind === "complete") onComplete();
    else onBeat(decision.index);
  }, [safeBeat, beats.length, onBeat, onComplete]);

  useEffect(() => {
    if (paused || !current) return;
    // Note: awaitingGesture is necessarily already false here — it's one of
    // the terms in `paused` above, so the early return already guards it.
    cancelRef.current?.();
    const cancel = beginBeatPlayback(current, sound.isMuted(), {
      onAdvance: advance,
      onAwaitingGesture: () => setAwaitingGesture(true),
    });
    cancelRef.current = cancel;
    return () => {
      cancelRef.current?.();
      cancelRef.current = null;
    };
  }, [current, paused, advance]);

  if (!current) return null;

  function handleBack() {
    onBeat(previousBeatIndex(safeBeat));
  }

  function handleTogglePause() {
    if (awaitingGesture) {
      setAwaitingGesture(false);
      setInternalPaused(false);
      return;
    }
    setInternalPaused((value) => !value);
  }

  function handleReplay() {
    if (paused) {
      // Paused (an explicit pause, or still awaiting a gesture): clear the
      // hold and let the driving effect start playback fresh, exactly like
      // the Play control. Also calling beginBeatPlayback here would
      // double-start the line the instant the effect reacts to `paused`
      // flipping to false — an audible stutter — and, worse, leave
      // `internalPaused` true while audio plays, so `advance()` silently
      // no-ops (via pausedRef) once the line ends and the scene stalls.
      setAwaitingGesture(false);
      setInternalPaused(false);
      return;
    }
    // Already playing: `paused` isn't changing, so the driving effect won't
    // retrigger on its own — restart the current line manually.
    cancelRef.current?.();
    cancelRef.current = beginBeatPlayback(current, sound.isMuted(), {
      onAdvance: advance,
      onAwaitingGesture: () => setAwaitingGesture(true),
    });
  }

  function handleSkip() {
    cancelRef.current?.();
    cancelRef.current = null;
    onBeat(Math.max(0, beats.length - 1));
    onComplete();
  }

  const beatClass = `scene-beat-${safeBeat}`;
  const speakerClass = `scene-speaker-${current.speaker.toLowerCase()}`;

  return (
    <>
      <div
        className={`quest-story-scene-stage ${beatClass} ${speakerClass}${className ? ` ${className}` : ""}`}
        data-scene-beat={safeBeat}
      >
        {children}
        <div
          className={`quest-story-scene-bubble speaker-${current.speaker.toLowerCase()}`}
          aria-live="polite"
        >
          <small>{current.speaker}</small>
          <p>{current.line}</p>
        </div>
      </div>
      <footer className="quest-story-scene-controls">
        <div
          className="quest-story-scene-progress"
          aria-label={`Story line ${safeBeat + 1} of ${beats.length}`}
        >
          {beats.map((_, index) => (
            <i key={index} className={index <= safeBeat ? "lit" : ""} />
          ))}
        </div>
        {awaitingGesture && (
          <p className="quest-story-scene-prompt" role="status">
            Tap play to start the scene.
          </p>
        )}
        <div className="quest-story-scene-buttons">
          <button
            type="button"
            onClick={handleBack}
            disabled={safeBeat === 0}
            aria-label="Back one line"
          >
            ⏪
          </button>
          <button
            type="button"
            onClick={handleTogglePause}
            aria-label={paused ? "Play story" : "Pause story"}
          >
            {paused ? "▶" : "⏸"}
          </button>
          <button type="button" onClick={handleReplay} aria-label="Replay this line">
            ↻
          </button>
          {/* No aria-label here: the visible text already names the button
              (skipLabel varies per caller, e.g. "Skip ahead"), and WCAG
              2.5.3 Label in Name requires the accessible name to contain the
              visible label — a mismatched hardcoded aria-label would violate
              that the moment skipLabel differs from it. */}
          <button type="button" onClick={handleSkip}>
            {skipLabel}
          </button>
        </div>
      </footer>
    </>
  );
}
