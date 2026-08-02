"use client";

import Image from "next/image";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  SkateTrailOutcome,
  SkateTrailPoint,
} from "@/lib/grade-seven-progress";
import { sound } from "@/lib/sound";
import styles from "./voice-story-audition.module.css";

type Speaker = "NOVA" | "YOU" | "RIDER";
type Phase =
  | "idle"
  | "nova-hello"
  | "kid-hello"
  | "nova-watch"
  | "nova-demo"
  | "nova-prompt"
  | "rider-question"
  | "kid-answer"
  | "nova-clear"
  | "play"
  | "result";
type Point = SkateTrailPoint;
type RouteResult =
  | { crossed: true; point: Point }
  | { crossed: false; point: null };

export type StraightTrailSceneProps = {
  context?: "preview" | "adventure";
  initialEndpoint?: SkateTrailPoint | null;
  initialOutcome?: SkateTrailOutcome | null;
  onRunChange?: (
    endpoint: SkateTrailPoint | null,
    outcome: SkateTrailOutcome | null,
  ) => void;
  onContinue?: () => void;
};

const START_POINT: Point = { x: 0.1, y: 0.72 };
const NOVA_LINE_Y = 0.48;
const GUIDE_POINTS: readonly Point[] = [
  { x: 0.13, y: 0.7 },
  { x: 0.2, y: 0.66 },
  { x: 0.27, y: 0.62 },
  { x: 0.34, y: 0.58 },
  { x: 0.41, y: 0.54 },
  { x: 0.48, y: 0.5 },
  { x: 0.55, y: 0.46 },
  { x: 0.61, y: 0.43 },
  { x: 0.68, y: 0.39 },
];

const AUDIO = {
  novaHello: "/audio/voice-auditions/scene/qwen-nova-01-race-me.mp3",
  kidHello: "/audio/voice-auditions/scene/kid-02-try-me.mp3",
  novaWatch: "/audio/voice-auditions/scene/qwen-nova-03-watch.mp3",
  novaPrompt: "/audio/voice-auditions/scene/qwen-nova-04-your-turn.mp3",
  riderQuestion: "/audio/voice-auditions/scene/rider-08-meet-nova.mp3",
  kidAnswer: "/audio/voice-auditions/scene/kid-09-find-out.mp3",
  novaClear: "/audio/voice-auditions/scene/qwen-nova-10-stay-clear.mp3",
  crossed: "/audio/voice-auditions/scene/qwen-nova-14-met.mp3",
  didNotCross: "/audio/voice-auditions/scene/qwen-nova-14-no-meet.mp3",
} as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

export function findPathIntersection(
  path: readonly Point[],
  lineY = NOVA_LINE_Y,
): Point | null {
  for (let index = 1; index < path.length; index += 1) {
    const before = path[index - 1];
    const after = path[index];
    const beforeDistance = before.y - lineY;
    const afterDistance = after.y - lineY;

    if (beforeDistance === 0) return { x: before.x, y: lineY };
    if (beforeDistance * afterDistance > 0 || before.y === after.y) continue;

    const progress = (lineY - before.y) / (after.y - before.y);
    const x = before.x + (after.x - before.x) * progress;
    if (x >= 0.08 && x <= 0.9) return { x, y: lineY };
  }

  return null;
}

function StoryBubble({
  active,
  speaker,
  text,
}: {
  active: boolean;
  speaker: Speaker;
  text: string;
}) {
  if (!active) return null;

  return (
    <div className={styles.bubble} aria-live="polite">
      <span className={styles.srOnly}>{speaker}: </span>
      {text}
    </div>
  );
}

function TrailCanvas({
  phase,
  path,
  result,
}: {
  phase: Phase;
  path: readonly Point[];
  result: RouteResult | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frameId = 0;

    const shouldShowNovaLine = ![
      "idle",
      "nova-hello",
      "kid-hello",
      "nova-watch",
    ].includes(phase);

    const paint = (novaProgress: number) => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);

      const toCanvas = (point: Point) => ({
        x: point.x * bounds.width,
        y: point.y * bounds.height,
      });

      const drawLine = (
        points: readonly Point[],
        colour: string,
        width: number,
      ) => {
        if (points.length < 2) return;
        const first = toCanvas(points[0]);
        context.save();
        context.lineCap = "round";
        context.lineJoin = "round";
        context.shadowColor = colour;
        context.shadowBlur = 19;
        context.strokeStyle = colour;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(first.x, first.y);
        for (const point of points.slice(1)) {
          const canvasPoint = toCanvas(point);
          context.lineTo(canvasPoint.x, canvasPoint.y);
        }
        context.stroke();
        context.shadowBlur = 0;
        context.strokeStyle = "rgba(255,255,255,.86)";
        context.lineWidth = 2;
        context.stroke();
        context.restore();
      };

      if (shouldShowNovaLine) {
        drawLine(
          [
            { x: 0.08, y: NOVA_LINE_Y },
            { x: 0.08 + 0.82 * novaProgress, y: NOVA_LINE_Y },
          ],
          "#47edff",
          11,
        );
      }

      drawLine(path, "#ff65dc", 11);

      if (result?.crossed) {
        const meeting = toCanvas(result.point);
        context.save();
        context.shadowColor = "#fff1a2";
        context.shadowBlur = 38;
        context.fillStyle = "#fff4ad";
        context.beginPath();
        context.arc(meeting.x, meeting.y, 12, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = "rgba(255,255,255,.92)";
        context.lineWidth = 3;
        context.beginPath();
        context.arc(meeting.x, meeting.y, 21, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (phase === "nova-demo" && !reducedMotion) {
      const beganAt = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - beganAt) / 2600, 1);
        paint(progress);
        if (progress < 1) frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
    } else {
      paint(shouldShowNovaLine ? 1 : 0);
    }

    const observer = new ResizeObserver(() =>
      paint(shouldShowNovaLine ? 1 : 0),
    );
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [path, phase, result]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.trails}
      data-learning-landmark="straight-trail-canvas"
      aria-hidden="true"
    />
  );
}

function phaseProgress(phase: Phase) {
  if (phase === "idle") return 0;
  if (["nova-hello", "kid-hello", "nova-watch"].includes(phase)) return 1;
  if (phase === "nova-demo") return 2;
  if (
    ["nova-prompt", "rider-question", "kid-answer", "nova-clear"].includes(
      phase,
    )
  ) {
    return 3;
  }
  return 4;
}

function restoreResult(
  endpoint: SkateTrailPoint | null | undefined,
  outcome: SkateTrailOutcome | null | undefined,
): RouteResult | null {
  if (!endpoint || !outcome) return null;
  if (outcome === "separate") return { crossed: false, point: null };
  const point = findPathIntersection([START_POINT, endpoint]);
  return point ? { crossed: true, point } : null;
}

export function StraightTrailScene({
  context = "preview",
  initialEndpoint = null,
  initialOutcome = null,
  onRunChange,
  onContinue,
}: StraightTrailSceneProps) {
  const restoredResult = restoreResult(initialEndpoint, initialOutcome);
  const restoredPath = initialEndpoint
    ? [START_POINT, initialEndpoint]
    : [START_POINT];
  const stageRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runRef = useRef(0);
  const draggingRef = useRef(false);
  const pathRef = useRef<Point[]>(restoredPath);
  const [phase, setPhase] = useState<Phase>(
    restoredResult ? "result" : initialEndpoint ? "play" : "idle",
  );
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [speech, setSpeech] = useState("");
  const [player, setPlayer] = useState<Point>(
    initialEndpoint ?? START_POINT,
  );
  const [playerPath, setPlayerPath] = useState<Point[]>(restoredPath);
  const [tilt, setTilt] = useState(0);
  const [result, setResult] = useState<RouteResult | null>(restoredResult);
  const isAdventure = context === "adventure";

  const novaIsParked = [
    "nova-prompt",
    "rider-question",
    "kid-answer",
    "nova-clear",
    "play",
    "result",
  ].includes(phase);
  const riderIsPresent = ["rider-question", "kid-answer"].includes(phase);
  const isNarrating = !["idle", "play", "result"].includes(phase);
  const showGuide = [
    "nova-prompt",
    "rider-question",
    "kid-answer",
    "nova-clear",
    "play",
  ].includes(phase);

  useEffect(
    () => () => {
      runRef.current += 1;
      audioRef.current?.pause();
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  function stopCurrent() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function pause(run: number, delay: number) {
    return new Promise<boolean>((resolve) => {
      if (runRef.current !== run) {
        resolve(false);
        return;
      }
      timerRef.current = setTimeout(
        () => resolve(runRef.current === run),
        delay,
      );
    });
  }

  function playAudio(run: number, source: string, fallbackMs: number) {
    return new Promise<boolean>((resolve) => {
      if (runRef.current !== run) {
        resolve(false);
        return;
      }

      stopCurrent();
      const audio = new Audio(source);
      audioRef.current = audio;
      audio.preload = "auto";
      let settled = false;
      const finish = (delay: number) => {
        if (settled) return;
        settled = true;
        timerRef.current = setTimeout(
          () => resolve(runRef.current === run),
          delay,
        );
      };
      audio.onended = () => finish(220);
      audio.onerror = () => finish(fallbackMs);
      void audio.play().catch(() => finish(fallbackMs));
    });
  }

  async function say(
    run: number,
    nextPhase: Phase,
    nextSpeaker: Speaker,
    text: string,
    audio: string,
    fallbackMs: number,
  ) {
    if (runRef.current !== run) return false;
    setPhase(nextPhase);
    setSpeaker(nextSpeaker);
    setSpeech(text);
    return playAudio(run, audio, fallbackMs);
  }

  async function playStory() {
    stopCurrent();
    const run = runRef.current + 1;
    runRef.current = run;
    setResult(null);
    setPlayer(START_POINT);
    setTilt(0);
    pathRef.current = [START_POINT];
    setPlayerPath([START_POINT]);
    onRunChange?.(null, null);

    if (
      !(await say(
        run,
        "nova-hello",
        "NOVA",
        "There you are! Race me!",
        AUDIO.novaHello,
        1900,
      ))
    ) {
      return;
    }
    if (
      !(await say(
        run,
        "kid-hello",
        "YOU",
        "Try me!",
        AUDIO.kidHello,
        1200,
      ))
    ) {
      return;
    }
    if (
      !(await say(
        run,
        "nova-watch",
        "NOVA",
        "I’ll go first. Watch my trail!",
        AUDIO.novaWatch,
        3600,
      ))
    ) {
      return;
    }

    setSpeaker(null);
    setSpeech("");
    setPhase("nova-demo");
    sound.play("tap");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!(await pause(run, reducedMotion ? 650 : 2900))) return;

    if (
      !(await say(
        run,
        "nova-prompt",
        "NOVA",
        "Your turn! Follow the stars, or make your own path.",
        AUDIO.novaPrompt,
        4200,
      ))
    ) {
      return;
    }
    if (
      !(await say(
        run,
        "rider-question",
        "RIDER",
        "Think your trail can meet Nova’s?",
        AUDIO.riderQuestion,
        2900,
      ))
    ) {
      return;
    }
    if (
      !(await say(
        run,
        "kid-answer",
        "YOU",
        "Only one way to find out!",
        AUDIO.kidAnswer,
        2200,
      ))
    ) {
      return;
    }
    if (
      !(await say(
        run,
        "nova-clear",
        "NOVA",
        "I’ll stay clear. Go for it!",
        AUDIO.novaClear,
        2800,
      ))
    ) {
      return;
    }

    setSpeaker(null);
    setSpeech("");
    setPhase("play");
    timerRef.current = setTimeout(() => stageRef.current?.focus(), 80);
  }

  function updatePlayer(next: Point) {
    if (phase !== "play") return;
    const previous = pathRef.current[pathRef.current.length - 1] ?? START_POINT;
    const safePoint = {
      x: clamp(next.x, 0.08, 0.9),
      y: clamp(next.y, 0.34, 0.78),
    };
    const distance = Math.hypot(
      safePoint.x - previous.x,
      safePoint.y - previous.y,
    );
    if (distance < 0.008) return;

    const nextTilt = clamp((safePoint.y - START_POINT.y) * 34, -13, 13);
    const nextPath = [START_POINT, safePoint];
    pathRef.current = nextPath;
    setPlayer(safePoint);
    setPlayerPath(nextPath);
    setTilt(nextTilt);
    onRunChange?.(safePoint, null);
  }

  function pointFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    return {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      phase !== "play" ||
      (event.target as HTMLElement).closest("button")
    ) {
      return;
    }
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
    const point = pointFromPointer(event);
    if (point) updatePlayer(point);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || phase !== "play") return;
    const point = pointFromPointer(event);
    if (point) updatePlayer(point);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (phase !== "play") return;
    const step = event.shiftKey ? 0.045 : 0.025;
    const moves: Partial<Record<string, Point>> = {
      ArrowLeft: { x: player.x - step, y: player.y },
      ArrowRight: { x: player.x + step, y: player.y },
      ArrowUp: { x: player.x, y: player.y - step },
      ArrowDown: { x: player.x, y: player.y + step },
    };
    const next = moves[event.key];
    if (!next) return;
    event.preventDefault();
    updatePlayer(next);
  }

  async function finishRun() {
    if (phase !== "play" || pathRef.current.length < 2) return;
    draggingRef.current = false;
    const meetingPoint = findPathIntersection(pathRef.current);
    const nextResult: RouteResult = meetingPoint
      ? { crossed: true, point: meetingPoint }
      : { crossed: false, point: null };
    setResult(nextResult);
    setPhase("result");
    setSpeaker("NOVA");
    setSpeech(
      nextResult.crossed
        ? "There! Your trails met at one point!"
        : "Cool route! Our trails didn’t meet this time.",
    );
    onRunChange?.(
      pathRef.current[1] ?? START_POINT,
      nextResult.crossed ? "crossed" : "separate",
    );
    sound.play(nextResult.crossed ? "finale" : "success");
    const run = runRef.current;
    await playAudio(
      run,
      nextResult.crossed ? AUDIO.crossed : AUDIO.didNotCross,
      nextResult.crossed ? 2900 : 3900,
    );
  }

  function rideAgain() {
    stopCurrent();
    runRef.current += 1;
    setResult(null);
    setSpeaker(null);
    setSpeech("");
    setPlayer(START_POINT);
    setTilt(0);
    pathRef.current = [START_POINT];
    setPlayerPath([START_POINT]);
    onRunChange?.(null, null);
    setPhase("play");
    timerRef.current = setTimeout(() => stageRef.current?.focus(), 80);
  }

  function skipToSkating() {
    stopCurrent();
    runRef.current += 1;
    draggingRef.current = false;
    setResult(null);
    setSpeaker(null);
    setSpeech("");
    setPlayer(START_POINT);
    setTilt(0);
    pathRef.current = [START_POINT];
    setPlayerPath([START_POINT]);
    onRunChange?.(null, null);
    setPhase("play");
    timerRef.current = setTimeout(() => stageRef.current?.focus(), 80);
  }

  const progress = phaseProgress(phase);
  const speakerText = speaker ? speech : "";

  return (
    <section
      className={`${styles.wrapper} ${
        isAdventure ? styles.adventureWrapper : ""
      }`}
      aria-label="Playable Nova skating story"
    >
      <div
        ref={stageRef}
        className={`${styles.stage} ${styles[`phase-${phase}`]}`}
        role="group"
        aria-label={
          phase === "play"
            ? "Skate area. Drag the learner or use the arrow keys to make a trail."
            : "Parallel Glide story scene"
        }
        tabIndex={phase === "play" ? 0 : -1}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.shade} aria-hidden="true" />

        <header className={styles.hud}>
          <div>
            <small>
              {isAdventure
                ? "QUEST 1 · NOVA + YOU"
                : "PLAYABLE SCENE · QWEN NOVA"}
            </small>
            <strong>{isAdventure ? "Trail Meet" : "Parallel Glide"}</strong>
          </div>
          <div className={styles.progress}>
            <span>{progress === 0 ? "Ready" : `${progress} of 4`}</span>
            <progress
              max={4}
              value={progress}
              aria-label={`Scene step ${progress} of 4`}
            />
          </div>
        </header>

        <TrailCanvas phase={phase} path={playerPath} result={result} />

        {showGuide &&
          GUIDE_POINTS.map((point, index) => (
            <Image
              key={`${point.x}-${point.y}`}
              className={`${styles.guideStar} ${
                player.x > point.x + 0.035 ? styles.guideStarPassed : ""
              } ${index === 6 ? styles.guideStarFocus : ""}`}
              style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
              src="/images/skatepark-night-run/guide-star.png"
              alt=""
              width={64}
              height={64}
              aria-hidden="true"
            />
          ))}

        {["nova-prompt", "rider-question", "kid-answer", "nova-clear", "play", "result"].includes(
          phase,
        ) && (
          <div
            className={styles.trailLabel}
            style={{ left: "27%", top: `${NOVA_LINE_Y * 100}%` }}
          >
            Nova’s trail
          </div>
        )}

        {!novaIsParked && (
          <div className={styles.novaSkater}>
            <StoryBubble
              active={speaker === "NOVA"}
              speaker="NOVA"
              text={speakerText}
            />
            <Image
              src="/images/skatepark-night-run/nova-skateboard-v2.png"
              alt="Nova riding a skateboard and making the first glowing trail"
              width={1254}
              height={1254}
              priority
            />
          </div>
        )}

        {novaIsParked && (
          <div className={styles.novaParked}>
            <StoryBubble
              active={speaker === "NOVA"}
              speaker="NOVA"
              text={speakerText}
            />
            <Image
              src="/images/skatepark-night-run/nova-parked-v2.png"
              alt="Nova standing safely aside, holding a skateboard and pointing to the trail"
              width={1254}
              height={1254}
              priority
            />
          </div>
        )}

        <div
          className={styles.player}
          style={{
            left: `${player.x * 100}%`,
            top: `${player.y * 100}%`,
            transform: `translate(-50%, -82%) rotate(${tilt}deg)`,
          }}
        >
          <StoryBubble
            active={speaker === "YOU"}
            speaker="YOU"
            text={speakerText}
          />
          <Image
            src="/images/skatepark-night-run/hero-skateboard-v2.png"
            alt="The learner-controlled skateboarder"
            width={1134}
            height={1390}
            priority
            draggable={false}
          />
        </div>

        <div
          className={`${styles.rider} ${
            riderIsPresent ? styles.riderPresent : ""
          }`}
        >
          <StoryBubble
            active={speaker === "RIDER"}
            speaker="RIDER"
            text={speakerText}
          />
          <Image
            src="/images/skatepark-night-run/rider-skateboard-v2.png"
            alt="A second rider rolling in with a friendly trail challenge"
            width={1024}
            height={1536}
            priority
          />
        </div>

        {phase === "result" && result && (
          <div className={styles.concept} role="status">
            <strong>
              {result.crossed ? "Intersection" : "No intersection yet"}
            </strong>
            <span>
              {result.crossed
                ? "Your trail met Nova’s at one point."
                : "The two trails never met on this route."}
            </span>
          </div>
        )}

        {phase === "idle" && (
          <div className={styles.actionCard}>
            <div>
              <strong>Watch Nova. Then steer the learner.</strong>
              <small>About 35 seconds before the playable skating turn</small>
            </div>
            <button type="button" onClick={() => void playStory()}>
              Play the new scene
            </button>
          </div>
        )}

        {isNarrating && (
          <div className={styles.playing} role="status">
            <i />
            Story playing
          </div>
        )}

        {phase === "play" && (
          <div className={styles.gameControls}>
            <div>
              <strong>Make one straight trail</strong>
              <small>Choose any angle and drag in one direction. Stars guide; they do not grade.</small>
            </div>
            <button
              type="button"
              disabled={playerPath.length < 2}
              onClick={() => void finishRun()}
            >
              Finish run
            </button>
          </div>
        )}

        {phase === "result" && result && (
          <div className={styles.resultCard}>
            <div>
              <strong>
                {result.crossed
                  ? "Your straight trails met!"
                  : "Your straight trails stayed apart!"}
              </strong>
              <small>No wrong route—the picture changes with your movement.</small>
            </div>
            <div>
              {onContinue && (
                <button type="button" onClick={onContinue}>
                  Continue to the crossing
                </button>
              )}
              <button type="button" onClick={rideAgain}>
                Ride again
              </button>
              {!isAdventure && (
                <button type="button" onClick={() => void playStory()}>
                  Replay story
                </button>
              )}
            </div>
          </div>
        )}

        <footer className={styles.footer}>
          <span>
            {phase === "play"
              ? "Your board draws the maths."
              : isAdventure
                ? "Quest 1 · Straight trails"
                : "No scores. No collisions. Just explore the trails."}
          </span>
          {isNarrating && (
            <button
              type="button"
              onClick={skipToSkating}
            >
              Skip to skating
            </button>
          )}
        </footer>
      </div>
    </section>
  );
}

export function VoiceStoryAudition() {
  return <StraightTrailScene />;
}
