"use client";

import Image from "next/image";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SparkleBurst } from "@/components/sparkle-burst";
import { WorldReward } from "@/components/continuous-adventure-ui";
import { StraightTrailScene } from "@/components/voice-story-audition";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import {
  SKATEPARK_QUEST_IDS,
  type SkateparkQuestId,
  type SkateparkState,
} from "@/lib/grade-seven-progress";

type SkateparkAdventureProps = {
  state: SkateparkState;
  onChange: (state: SkateparkState) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  avatar: string;
  onFinish: (finalState?: SkateparkState) => void;
};

const SCENES = [
  "Trail Meet",
  "Turn the Crossing",
  "Find the Twin",
  "Build a Straight Exit",
  "Same Pattern, New Crossing",
] as const;

const DIALOGUE = [
  "Choose any direction. Your board makes one straight trail.",
  "Turn that trail. Look—all four corners move together!",
  "Wait… that corner has a twin across the crossing!",
  "Pick either side. Together, they make one straight line!",
  "Same pattern, new crossing. You’ve got this!",
  "We cracked it! Openings across the X match. Openings beside each other make a straight line.",
] as const;

type SkateStorySpeaker = "NOVA" | "YOU" | "RIDER";
type SkateStoryBeat = {
  speaker: SkateStorySpeaker;
  line: string;
  audio: string;
};

const OPENING_STORY: ReadonlyArray<SkateStoryBeat> = [
  {
    speaker: "RIDER",
    line: "Nova! Ready for the mirror crossing?",
    audio: "/audio/skatepark-story/q2-opening-01-rider.mp3",
  },
  {
    speaker: "NOVA",
    line: "Ready—but our openings have to match.",
    audio: "/audio/skatepark-story/q2-opening-02-nova.mp3",
  },
  {
    speaker: "YOU",
    line: "I’ll watch the rails.",
    audio: "/audio/skatepark-story/q2-opening-03-kid.mp3",
  },
  {
    speaker: "RIDER",
    line: "Whoa! My trail just shifted.",
    audio: "/audio/skatepark-story/q2-opening-04-rider.mp3",
  },
  {
    speaker: "NOVA",
    line: "Then all four openings changed. Help us rebuild the trick?",
    audio: "/audio/skatepark-story/q2-opening-05-nova.mp3",
  },
  {
    speaker: "YOU",
    line: "Let’s light it up!",
    audio: "/audio/skatepark-story/q2-opening-06-kid.mp3",
  },
] as const;

const CLOSING_STORY: ReadonlyArray<SkateStoryBeat> = [
  {
    speaker: "RIDER",
    line: "Same opening—now!",
    audio: "/audio/skatepark-story/q2-closing-01-rider.mp3",
  },
  {
    speaker: "YOU",
    line: "The straight exit is clear!",
    audio: "/audio/skatepark-story/q2-closing-02-kid.mp3",
  },
  {
    speaker: "NOVA",
    line: "We landed it! Across matches. Beside makes a line.",
    audio: "/audio/skatepark-story/q2-closing-03-nova.mp3",
  },
  {
    speaker: "RIDER",
    line: "Next course?",
    audio: "/audio/skatepark-story/q2-closing-04-rider.mp3",
  },
] as const;

const Q3_OPENING_STORY: ReadonlyArray<SkateStoryBeat> = [
  {
    speaker: "RIDER",
    line: "Nova! The twin-lane light show starts now!",
    audio: "/audio/skatepark-story/q3-opening-01-rider.mp3",
  },
  {
    speaker: "NOVA",
    line: "Uh-oh—the pink rail is leaning toward mine.",
    audio: "/audio/skatepark-story/q3-opening-02-nova.mp3",
  },
  {
    speaker: "YOU",
    line: "If it keeps going, your trails will meet.",
    audio: "/audio/skatepark-story/q3-opening-03-kid.mp3",
  },
  {
    speaker: "RIDER",
    line: "Can you straighten it before we launch?",
    audio: "/audio/skatepark-story/q3-opening-04-rider.mp3",
  },
  {
    speaker: "NOVA",
    line: "Then we ride side by side. Let’s roll!",
    audio: "/audio/skatepark-story/q3-opening-05-nova.mp3",
  },
] as const;

const Q3_CLOSING_STORY: ReadonlyArray<SkateStoryBeat> = [
  {
    speaker: "RIDER",
    line: "Twin lanes clear!",
    audio: "/audio/skatepark-story/q3-closing-01-rider.mp3",
  },
  {
    speaker: "YOU",
    line: "And the square exit still meets them perfectly.",
    audio: "/audio/skatepark-story/q3-closing-02-kid.mp3",
  },
  {
    speaker: "NOVA",
    line: "Parallel together. Perpendicular at the exit!",
    audio: "/audio/skatepark-story/q3-closing-03-nova.mp3",
  },
  {
    speaker: "RIDER",
    line: "Course four is waiting!",
    audio: "/audio/skatepark-story/q3-closing-04-rider.mp3",
  },
] as const;

const Q4_OPENING_STORY: ReadonlyArray<SkateStoryBeat> = [
  {
    speaker: "RIDER",
    line: "One last show—the gold spotlight is stuck!",
    audio: "/audio/skatepark-story/q4-opening-01-rider.mp3",
  },
  {
    speaker: "NOVA",
    line: "It has to sweep across both twin rails.",
    audio: "/audio/skatepark-story/q4-opening-02-nova.mp3",
  },
  {
    speaker: "YOU",
    line: "Then every crossing gets a light corner.",
    audio: "/audio/skatepark-story/q4-opening-03-kid.mp3",
  },
  {
    speaker: "RIDER",
    line: "Can we copy the same move at both crossings?",
    audio: "/audio/skatepark-story/q4-opening-04-rider.mp3",
  },
  {
    speaker: "NOVA",
    line: "Let’s test it before the finale!",
    audio: "/audio/skatepark-story/q4-opening-05-nova.mp3",
  },
] as const;

const Q4_CLOSING_STORY: ReadonlyArray<SkateStoryBeat> = [
  {
    speaker: "RIDER",
    line: "Both crossings lit!",
    audio: "/audio/skatepark-story/q4-closing-01-rider.mp3",
  },
  {
    speaker: "YOU",
    line: "Same-seat match and inside zigzag.",
    audio: "/audio/skatepark-story/q4-closing-02-kid.mp3",
  },
  {
    speaker: "NOVA",
    line: "The beam moved, but both patterns stayed!",
    audio: "/audio/skatepark-story/q4-closing-03-nova.mp3",
  },
  {
    speaker: "RIDER",
    line: "Night Run complete!",
    audio: "/audio/skatepark-story/q4-closing-04-rider.mp3",
  },
] as const;

const CROSSING_RAILS_AUDIO = {
  turnPrompt: "/audio/skatepark-story/q2-stage-01-rider.mp3",
  turnReaction: "/audio/skatepark-story/q2-stage-01-kid.mp3",
  routeNova: "/audio/skatepark-story/q2-stage-01-route-nova.mp3",
  routeKid: "/audio/skatepark-story/q2-stage-01-route-kid.mp3",
  routeResult: "/audio/skatepark-story/q2-stage-01-result-rider.mp3",
  twinPrompt: "/audio/skatepark-story/q2-stage-02-rider.mp3",
  twinReaction: "/audio/skatepark-story/q2-stage-02-nova.mp3",
  linePrompt: "/audio/skatepark-story/q2-stage-03-kid.mp3",
  lineReaction: "/audio/skatepark-story/q2-stage-03-rider.mp3",
  transferPrompt: "/audio/skatepark-story/q2-stage-04-rider.mp3",
  transferReaction: "/audio/skatepark-story/q2-stage-04-kid.mp3",
} as const;

const NEVER_MEET_AUDIO = {
  alignPrompt: "/audio/skatepark-story/q3-stage-01-rider.mp3",
  alignReaction: "/audio/skatepark-story/q3-stage-01-kid.mp3",
  alignLaunch: "/audio/skatepark-story/q3-stage-01-launch-nova.mp3",
  gapPrompt: "/audio/skatepark-story/q3-stage-02-nova.mp3",
  gapReaction: "/audio/skatepark-story/q3-stage-02-rider.mp3",
  gapLaunch: "/audio/skatepark-story/q3-stage-02-launch-rider.mp3",
  exitPrompt: "/audio/skatepark-story/q3-stage-03-kid.mp3",
  exitReaction: "/audio/skatepark-story/q3-stage-03-nova.mp3",
  exitLaunch: "/audio/skatepark-story/q3-stage-03-launch-rider.mp3",
  turnPrompt: "/audio/skatepark-story/q3-stage-04-rider.mp3",
  turnReaction: "/audio/skatepark-story/q3-stage-04-kid.mp3",
  courseLaunch: "/audio/skatepark-story/q3-stage-04-launch-nova.mp3",
} as const;

const CROSSING_BEAM_AUDIO = {
  beamPrompt: "/audio/skatepark-story/q4-stage-01-rider.mp3",
  beamReaction: "/audio/skatepark-story/q4-stage-01-kid.mp3",
  beamLaunch: "/audio/skatepark-story/q4-stage-01-launch-nova.mp3",
  seatPrompt: "/audio/skatepark-story/q4-stage-02-nova.mp3",
  seatReaction: "/audio/skatepark-story/q4-stage-02-rider.mp3",
  zigzagPrompt: "/audio/skatepark-story/q4-stage-03-kid.mp3",
  zigzagReaction: "/audio/skatepark-story/q4-stage-03-nova.mp3",
  sweepPrompt: "/audio/skatepark-story/q4-stage-04-rider.mp3",
  sweepReaction: "/audio/skatepark-story/q4-stage-04-kid.mp3",
  sweepLaunch: "/audio/skatepark-story/q4-stage-04-launch-rider.mp3",
} as const;

const SKATEPARK_QUESTS: ReadonlyArray<{
  id: SkateparkQuestId;
  title: string;
  concept: string;
  mission: string;
}> = [
  {
    id: "trail-meet",
    title: "Trail Meet",
    concept: "Straight trails · intersections",
    mission: "Choose a direction, ride one straight trail, and discover whether two paths meet.",
  },
  {
    id: "crossing-rails",
    title: "Crossing Rails",
    concept: "Opposite angles · linear pairs",
    mission: "Turn a crossing, match the openings across it, and rebuild one straight exit.",
  },
  {
    id: "never-meet",
    title: "Rails That Never Meet",
    concept: "Parallel · perpendicular",
    mission: "Compare rails that stay apart with rails that meet in a perfect square corner.",
  },
  {
    id: "crossing-beam",
    title: "Same Corner Lights",
    concept: "Transversals · corresponding angles",
    mission: "Send one beam across two rails and trace the repeating angle pattern.",
  },
  {
    id: "zigzag-lights",
    title: "Zigzag Lights",
    concept: "Alternate interior angles",
    mission: "Light the inside corners on opposite sides of the crossing beam.",
  },
  {
    id: "inside-together",
    title: "Inside Together",
    concept: "Same-side interior angles",
    mission: "Join two inside openings into one straight 180° sweep.",
  },
  {
    id: "reverse-check",
    title: "Reverse Check",
    concept: "Converse · prove lines parallel",
    mission: "Repair a deceptive rail by matching its corresponding corner.",
  },
  {
    id: "opening-ride",
    title: "Opening Ride",
    concept: "Use the whole angle pattern",
    mission: "Build and ride the final eight-light rooftop route.",
  },
] as const;

function SkateparkQuestMap({
  state,
  heroName,
  avatar,
  onStart,
}: {
  state: SkateparkState;
  heroName: string;
  avatar: string;
  onStart: (quest: SkateparkQuestId) => void;
}) {
  const completed = new Set(state.completedQuests ?? []);

  return (
    <section
      className="skatepark-quest-map"
      aria-label="Nova’s Night Run quest map"
      data-learning-landmark="skatepark-quest-map"
    >
      <Image
        className="skatepark-quest-map-bg"
        src="/images/skatepark-night-run/rooftop-night.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className="skatepark-quest-map-shade" aria-hidden="true" />
      <header className="skatepark-quest-map-heading">
        <div>
          <small>LINES AND ANGLES · ONE STORY WORLD</small>
          <h1>Nova’s Night Run</h1>
          <p>
            Eight connected quests build one opening-night ride. Each one changes the same rooftop.
          </p>
        </div>
        <strong>{completed.size} <span>OF 8 QUESTS</span></strong>
      </header>

      <div className="skatepark-quest-map-cast" aria-hidden="true">
        <Image
          src={heroAsset(avatar)}
          alt=""
          width={630}
          height={930}
          priority
        />
        <Image
          src="/images/skatepark-night-run/nova-parked-v2.png"
          alt=""
          width={630}
          height={930}
          priority
        />
      </div>

      <div className="skatepark-quest-route">
        {SKATEPARK_QUESTS.map((quest, index) => {
          const questComplete = completed.has(quest.id);
          const built = true;
          const unlocked = index === 0 || completed.has(SKATEPARK_QUESTS[index - 1].id);
          const current = state.activeQuest === quest.id && !questComplete;
          const playable = built && unlocked;
          const prerequisite = index > 0 ? SKATEPARK_QUESTS[index - 1].title : "the earlier quest";
          const action = questComplete
            ? "Review quest"
            : current
              ? "Continue here"
              : "Start quest";

          return (
            <article
              key={quest.id}
              className={`skatepark-quest-card${questComplete ? " complete" : ""}${current ? " current" : ""}${!playable ? " locked" : ""}`}
            >
              <div className="skatepark-quest-card-top">
                <Image
                  src="/images/skatepark-night-run/guide-star.png"
                  alt=""
                  width={54}
                  height={54}
                />
                <span>QUEST {index + 1}</span>
                <b>{questComplete ? "COMPLETE" : built ? unlocked ? "READY" : "LOCKED" : "COMING NEXT"}</b>
              </div>
              <h2>{quest.title}</h2>
              <p className="skatepark-quest-concept">{quest.concept}</p>
              <p>{quest.mission}</p>
              {playable ? (
                <button type="button" onClick={() => onStart(quest.id)}>
                  {action} →
                </button>
              ) : (
                <div className="skatepark-quest-wait">
                  <strong>{built ? `Finish ${prerequisite} first` : "Nova is setting up this course"}</strong>
                  <small>{built ? `The next trail lights after Quest ${index}.` : "This will stay in the same rooftop story."}</small>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <p className="skatepark-quest-map-note">
        {heroName ? `${heroName}, your` : "Your"} progress is saved on this device after every move.
      </p>
    </section>
  );
}

function NightRunCanvas({
  angle,
  step,
  lightsAwake,
  twinArmed,
  twinMatched,
  linearMatched,
  linearSelection,
}: {
  angle: number;
  step: number;
  lightsAwake: number;
  twinArmed?: boolean;
  twinMatched: boolean;
  linearMatched: boolean;
  linearSelection?: "left" | "right" | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const width = bounds.width;
      const height = bounds.height;
      const cx = width / 2;
      const cy = height * 0.53;
      const length = Math.min(width * 0.43, 210);
      const orientation = step === 4 ? 0.3 : 0;
      const crossingAngle = (angle * Math.PI) / 180;

      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(cx, cy);
      context.rotate(orientation);
      context.lineCap = "round";

      const drawRail = (rotation: number, color: string) => {
        context.save();
        context.rotate(rotation);
        context.shadowColor = color;
        context.shadowBlur = 18;
        context.strokeStyle = color;
        context.lineWidth = 14;
        context.beginPath();
        context.moveTo(-length, 0);
        context.lineTo(length, 0);
        context.stroke();
        context.shadowBlur = 0;
        context.strokeStyle = "#e9fbff";
        context.lineWidth = 3;
        context.stroke();
        context.restore();
      };

      drawRail(0, "#42f5ff");
      drawRail(-crossingAngle, "#ff49d7");

      const wedge = (start: number, end: number, color: string, active: boolean) => {
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, Math.min(width * 0.13, 58), start, end);
        context.closePath();
        context.fillStyle = active ? `${color}bb` : `${color}16`;
        context.shadowColor = color;
        context.shadowBlur = active ? 20 : 9;
        context.fill();
      };

      const cyan = "#3ff3ff";
      const pink = "#ff55dc";
      if (step === 0) {
        const revealed = Math.min(4, lightsAwake);
        if (revealed >= 1) wedge(-crossingAngle, 0, cyan, true);
        if (revealed >= 2) wedge(0, Math.PI - crossingAngle, pink, true);
        if (revealed >= 3) wedge(Math.PI - crossingAngle, Math.PI, cyan, true);
        if (revealed >= 4) wedge(Math.PI, Math.PI * 2 - crossingAngle, pink, true);
      } else if (step === 1) {
        wedge(-crossingAngle, 0, cyan, true);
        wedge(Math.PI - crossingAngle, Math.PI, cyan, true);
        wedge(0, Math.PI - crossingAngle, pink, true);
        wedge(Math.PI, Math.PI * 2 - crossingAngle, pink, true);
      } else if (step === 2) {
        const twinActive = twinArmed || twinMatched;
        wedge(-crossingAngle, 0, "#fff06b", twinActive);
        wedge(
          Math.PI - crossingAngle,
          Math.PI,
          "#fff06b",
          twinMatched,
        );
      } else if (step === 3) {
        wedge(Math.PI, Math.PI * 2 - crossingAngle, pink, true);
        wedge(
          Math.PI - crossingAngle,
          Math.PI,
          cyan,
          linearSelection === "left",
        );
        wedge(
          -crossingAngle,
          0,
          cyan,
          linearSelection === "right",
        );
      } else {
        wedge(-crossingAngle, 0, cyan, twinMatched);
        wedge(Math.PI - crossingAngle, Math.PI, cyan, twinMatched);
        wedge(0, Math.PI - crossingAngle, pink, linearMatched);
        wedge(
          Math.PI,
          Math.PI * 2 - crossingAngle,
          pink,
          linearMatched,
        );
      }

      context.shadowBlur = 15;
      context.fillStyle = "#fff7b0";
      context.beginPath();
      context.arc(0, 0, 9, 0, Math.PI * 2);
      context.fill();
      context.restore();

      for (let index = 0; index < 4; index += 1) {
        const x = width * (0.18 + index * 0.215);
        const y = height * 0.18 + Math.sin(index) * 16;
        const awake = index < lightsAwake || step > 0;
        context.beginPath();
        context.fillStyle = awake ? "#fff8a8" : "#352c66";
        context.shadowColor = awake ? "#fff06b" : "transparent";
        context.shadowBlur = awake ? 22 : 0;
        context.arc(x, y, 7, 0, Math.PI * 2);
        context.fill();
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [
    angle,
    lightsAwake,
    linearMatched,
    linearSelection,
    step,
    twinArmed,
    twinMatched,
  ]);

  return <canvas ref={canvasRef} className="night-run-canvas" aria-hidden="true" />;
}

function CrossingRoutePlayback({
  angle,
  playing,
  runKey,
  heroName,
  compact = false,
}: {
  angle: number;
  playing: boolean;
  runKey: number | string;
  heroName: string;
  compact?: boolean;
}) {
  return (
    <div
      key={runKey}
      className={`night-run-route-playback${playing ? " is-playing" : ""}${compact ? " is-compact" : ""}`}
      role="img"
      aria-label={`${heroName || "The learner"} waits for Nova to clear the blue path, then skates the straight pink path across it`}
      aria-hidden={!playing}
    >
      <div className="night-run-route route-cyan">
        <div className="night-run-route-runner route-nova-runner">
          <Image
            src="/images/skatepark-night-run/nova-skateboard-v2.png"
            alt=""
            width={630}
            height={930}
          />
        </div>
        <div className="night-run-route-runner route-nova-parked">
          <Image
            src="/images/skatepark-night-run/nova-parked-v2.png"
            alt=""
            width={630}
            height={930}
          />
        </div>
      </div>
      <div
        className="night-run-route route-pink"
        style={{ transform: `rotate(${-angle}deg)` }}
      >
        <div className="night-run-route-runner route-hero-runner">
          <Image
            src="/images/skatepark-night-run/hero-skateboard-v2.png"
            alt=""
            width={630}
            height={930}
            style={{ transform: `rotate(${angle}deg)` }}
          />
        </div>
      </div>
      <i className="night-run-route-crossing" />
    </div>
  );
}

function SkateQuestStoryPlay({
  phase,
  storyLabel,
  title,
  beats,
  beat,
  heroName,
  visual,
  variant,
  onBeatChange,
  onComplete,
}: {
  phase: "opening" | "closing";
  storyLabel: string;
  title: string;
  beats: ReadonlyArray<SkateStoryBeat>;
  beat: number;
  heroName: string;
  visual: ReactNode;
  variant: "parallel" | "beam";
  onBeatChange: (beat: number) => void;
  onComplete: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const safeBeat = Math.min(beat, beats.length - 1);
  const current = beats[safeBeat];

  useEffect(() => () => {
    audioRef.current?.pause();
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
  }, []);

  const stopPlayback = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    fallbackTimer.current = null;
    setPlaying(false);
  };

  const completeStory = () => {
    stopPlayback();
    onBeatChange(beats.length - 1);
    onComplete();
  };

  const playBeat = (index: number) => {
    if (index >= beats.length) {
      setPlaying(false);
      setFinished(true);
      sound.play(phase === "closing" ? "finale" : "success");
      return;
    }

    onBeatChange(index);
    setPlaying(true);
    setFinished(false);
    if (phase === "opening" && index === 1) sound.play("tap");
    if (phase === "closing" && index === 2) sound.play("success");

    const audio = new Audio(beats[index].audio);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.muted = sound.isMuted();
    const fallbackDuration = Math.max(1700, beats[index].line.length * 48);
    let settled = false;
    const continueStory = (delay = 220) => {
      if (settled) return;
      settled = true;
      if (audioRef.current !== audio) return;
      fallbackTimer.current = setTimeout(() => playBeat(index + 1), delay);
    };
    audio.onended = () => continueStory();
    audio.onerror = () => continueStory(fallbackDuration);
    void audio.play().catch(() => continueStory(fallbackDuration));
  };

  return (
    <section
      className={`night-run-story skate-quest-story story-${variant} phase-${phase} beat-${safeBeat} speaker-${current.speaker.toLowerCase()}${playing ? " is-playing" : ""}`}
      aria-label={`${phase === "opening" ? "Opening" : "Ending"} story for ${storyLabel}`}
    >
      <div className="night-run-story-shade" aria-hidden="true" />
      <header>
        <div>
          <small>{phase === "opening" ? "STORY OPENING" : "STORY ENDING"}</small>
          <strong>{title}</strong>
        </div>
        <span>{safeBeat + 1} <small>OF {beats.length}</small></span>
      </header>

      {visual}

      <Image
        className="night-run-story-nova"
        src={phase === "closing" && safeBeat >= 2
          ? "/images/skatepark-night-run/nova-celebrate.png"
          : "/images/skatepark-night-run/nova-skateboard-v2.png"}
        alt="Nova acting inside the skateboard story"
        width={630}
        height={930}
        priority
      />
      <Image
        className="night-run-story-hero"
        src="/images/skatepark-night-run/hero-skateboard-v2.png"
        alt={`${heroName || "The learner"} joining the skateboard story`}
        width={630}
        height={930}
        priority
      />
      <Image
        className="night-run-story-rider"
        src="/images/skatepark-night-run/rider-skateboard-v2.png"
        alt="The friendly rooftop rider joining the story"
        width={630}
        height={930}
        priority
      />

      <div className="night-run-story-bubble" aria-live="polite">
        <small>{current.speaker === "YOU" ? heroName || "YOU" : current.speaker}</small>
        <p>{personalize(current.line, heroName)}</p>
      </div>

      {!playing && !finished && (
        <div className="night-run-story-start">
          <div>
            <strong>{safeBeat === 0 ? "Play the story" : "Continue the story"}</strong>
            <small>Short character scene · voices + comic text</small>
          </div>
          <button type="button" onClick={() => playBeat(safeBeat)}>
            {sound.isMuted() ? "Play with captions" : "Play with sound"}
          </button>
        </div>
      )}

      {playing && (
        <div className="night-run-story-status" role="status">
          <i />
          {current.speaker === "YOU"
            ? heroName || "You"
            : current.speaker === "RIDER"
              ? "The rider"
              : "Nova"} is speaking
        </div>
      )}

      {finished && (
        <button
          className="night-run-story-continue"
          type="button"
          onClick={completeStory}
        >
          {phase === "opening"
            ? variant === "parallel"
              ? "Start the twin-lane run →"
              : "Launch the beam test →"
            : variant === "parallel"
              ? "Finish Quest 3 →"
              : "See the Night Run finale →"}
        </button>
      )}

      <footer>
        <div aria-label={`Story scene ${safeBeat + 1} of ${beats.length}`}>
          {beats.map((_, index) => (
            <i key={index} className={index <= safeBeat ? "lit" : ""} />
          ))}
        </div>
        <button type="button" onClick={completeStory}>
          {phase === "opening" ? "Skip story" : "Skip celebration"}
        </button>
      </footer>
    </section>
  );
}

function NeverMeetCanvas({
  questStep,
  parallelAngle,
  parallelGap,
  parallelMatched,
  perpendicularAngle,
  perpendicularMatched,
  courseTurned,
}: {
  questStep: number;
  parallelAngle: number;
  parallelGap: number;
  parallelMatched: boolean;
  perpendicularAngle: number;
  perpendicularMatched: boolean;
  courseTurned: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const width = bounds.width;
      const height = bounds.height;
      const cx = width / 2;
      const cy = height * 0.54;
      const length = Math.min(width * 0.42, 230);

      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(cx, cy);
      if (questStep === 3 && courseTurned) context.rotate(0.22);
      context.lineCap = "round";

      const glowLine = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: string,
      ) => {
        context.shadowColor = color;
        context.shadowBlur = 18;
        context.strokeStyle = color;
        context.lineWidth = 13;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.shadowBlur = 0;
        context.strokeStyle = "#eefcff";
        context.lineWidth = 2.5;
        context.stroke();
      };

      const squareCorner = (x: number, y: number) => {
        context.strokeStyle = "#fff38a";
        context.lineWidth = 5;
        context.shadowColor = "#fff06b";
        context.shadowBlur = 16;
        context.strokeRect(x + 8, y - 26, 19, 19);
        context.shadowBlur = 0;
      };

      if (questStep <= 1) {
        const gap = parallelGap * 1.35;
        const tilt = (parallelAngle * Math.PI) / 180;
        glowLine(-length, -gap / 2, length, -gap / 2, "#42f5ff");

        context.save();
        context.translate(0, gap / 2);
        context.rotate(tilt);
        glowLine(-length, 0, length, 0, "#ff49d7");
        context.restore();

        const markerXs = [-length * 0.58, length * 0.58];
        markerXs.forEach((markerX) => {
          const lowerY = gap / 2 + Math.tan(tilt) * markerX;
          context.setLineDash([6, 6]);
          context.strokeStyle = parallelMatched ? "#fff38a" : "rgba(255,255,255,.5)";
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(markerX, -gap / 2 + 7);
          context.lineTo(markerX, lowerY - 7);
          context.stroke();
          context.setLineDash([]);
        });
      } else if (questStep === 2) {
        const angle = (perpendicularAngle * Math.PI) / 180;
        glowLine(-length, 0, length, 0, "#42f5ff");
        context.save();
        context.rotate(-angle);
        glowLine(-length * .7, 0, length * .7, 0, "#fff06b");
        context.restore();
        if (perpendicularMatched) squareCorner(0, 0);
      } else {
        const gap = parallelGap * 1.2;
        glowLine(-length, -gap / 2, length, -gap / 2, "#42f5ff");
        glowLine(-length, gap / 2, length, gap / 2, "#ff49d7");
        glowLine(0, -length * .72, 0, length * .72, "#fff06b");
        if (courseTurned) {
          squareCorner(0, -gap / 2);
          squareCorner(0, gap / 2);
        }
      }

      context.restore();
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [
    courseTurned,
    parallelAngle,
    parallelGap,
    parallelMatched,
    perpendicularAngle,
    perpendicularMatched,
    questStep,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="never-meet-canvas"
      data-learning-landmark="never-meet-rails"
      aria-label="Interactive straight rails showing parallel and perpendicular line relationships"
    />
  );
}

function NeverMeetRoutePlayback({
  variant,
  parallelGap,
  courseTurned,
  playing,
  runKey,
  heroName,
}: {
  variant: "parallel" | "perpendicular" | "course";
  parallelGap: number;
  courseTurned: boolean;
  playing: boolean;
  runKey: number;
  heroName: string;
}) {
  const gap = parallelGap * (variant === "course" ? 0.6 : 0.675);
  const courseRotation = variant === "course" && courseTurned ? 12.6 : 0;

  return (
    <div
      key={runKey}
      className={`never-meet-route-playback route-${variant}${playing ? " is-playing" : ""}`}
      role="img"
      aria-label={variant === "parallel"
        ? `Nova and ${heroName || "the learner"} skate side by side on two straight paths that never meet`
        : variant === "perpendicular"
          ? `The rider clears the blue path before ${heroName || "the learner"} crosses on the square exit`
          : `Nova, ${heroName || "the learner"}, and the rider test the turned parallel lanes and square exit`}
      aria-hidden={!playing}
    >
      <div
        className="never-meet-route-course"
        style={{ transform: `rotate(${courseRotation}deg)` }}
      >
        {(variant === "parallel" || variant === "course") && (
          <>
            <div
              className="never-meet-route-runner q3-nova-runner"
              style={{ top: `calc(54% - ${gap}px)` }}
            >
              <Image
                src="/images/skatepark-night-run/nova-skateboard-v2.png"
                alt=""
                width={630}
                height={930}
                style={{ transform: `rotate(${-courseRotation}deg)` }}
              />
            </div>
            <div
              className="never-meet-route-runner q3-hero-parallel-runner"
              style={{ top: `calc(54% + ${gap}px)` }}
            >
              <Image
                src="/images/skatepark-night-run/hero-skateboard-v2.png"
                alt=""
                width={630}
                height={930}
                style={{ transform: `rotate(${-courseRotation}deg)` }}
              />
            </div>
          </>
        )}

        {(variant === "perpendicular" || variant === "course") && (
          <>
            {variant === "perpendicular" && (
              <div className="never-meet-route-runner q3-rider-cross-runner">
                <Image
                  src="/images/skatepark-night-run/rider-skateboard-v2.png"
                  alt=""
                  width={630}
                  height={930}
                />
              </div>
            )}
            <div className="never-meet-route-perpendicular">
              <div className="never-meet-route-runner q3-hero-exit-runner">
                <Image
                  src={variant === "course"
                    ? "/images/skatepark-night-run/rider-skateboard-v2.png"
                    : "/images/skatepark-night-run/hero-skateboard-v2.png"}
                  alt=""
                  width={630}
                  height={930}
                  style={{ transform: `rotate(${90 - courseRotation}deg)` }}
                />
              </div>
            </div>
            <i className="never-meet-route-crossing" />
          </>
        )}
      </div>
    </div>
  );
}

function NeverMeetQuest({
  state,
  onChange,
  heroName,
  onComplete,
  onVoice,
}: {
  state: SkateparkState;
  onChange: (patch: Partial<SkateparkState>) => void;
  heroName: string;
  onComplete: () => void;
  onVoice: (source: string) => void;
}) {
  const routeCompleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [routePlaying, setRoutePlaying] = useState(false);
  const [routeRunKey, setRouteRunKey] = useState(0);
  const scenes = [
    "Keep the Gap",
    "Move Apart, Stay Parallel",
    "Build a Square Exit",
    "Turn the Whole Course",
  ] as const;
  const step = state.questStep;
  const canContinue = step === 0
    ? state.parallelMatched && state.parallelRunTested && !routePlaying
    : step === 1
      ? state.parallelGapMoved && state.parallelGapRunTested && !routePlaying
      : step === 2
      ? state.perpendicularMatched && state.squareExitRunTested && !routePlaying
      : state.courseTurned && state.courseRunTested && !routePlaying;
  const interactionDialogue: {
    speaker: SkateStorySpeaker;
    line: string;
    voice: string;
  } = step === 0
    ? routePlaying
      ? {
          speaker: "NOVA",
          line: "Twin lanes—go!",
          voice: NEVER_MEET_AUDIO.alignLaunch,
        }
      : state.parallelRunTested
      ? {
          speaker: "YOU",
          line: "We stayed apart the whole way!",
          voice: NEVER_MEET_AUDIO.alignReaction,
        }
      : state.parallelMatched
        ? {
            speaker: "NOVA",
            line: "Twin lanes—go!",
            voice: NEVER_MEET_AUDIO.alignLaunch,
          }
      : {
          speaker: "RIDER",
          line: "The pink rail is leaning into Nova’s lane. Turn it until both point the same way.",
          voice: NEVER_MEET_AUDIO.alignPrompt,
        }
    : step === 1
      ? routePlaying
        ? {
            speaker: "RIDER",
            line: "New gap. Same direction. Run it again!",
            voice: NEVER_MEET_AUDIO.gapLaunch,
          }
        : state.parallelGapRunTested
        ? {
            speaker: "RIDER",
            line: "Nice! New gap, same direction.",
            voice: NEVER_MEET_AUDIO.gapReaction,
          }
        : state.parallelGapMoved
          ? {
              speaker: "RIDER",
              line: "New gap. Same direction. Run it again!",
              voice: NEVER_MEET_AUDIO.gapLaunch,
            }
        : {
            speaker: "NOVA",
            line: "Obstacle ahead! Slide your rail farther—but don’t turn it.",
            voice: NEVER_MEET_AUDIO.gapPrompt,
          }
      : step === 2
        ? routePlaying
          ? {
              speaker: "RIDER",
              line: "Blue rail first. Square exit after!",
              voice: NEVER_MEET_AUDIO.exitLaunch,
            }
          : state.squareExitRunTested
          ? {
              speaker: "NOVA",
              line: "Click! A perfect 90-degree corner.",
              voice: NEVER_MEET_AUDIO.exitReaction,
            }
          : state.perpendicularMatched
            ? {
                speaker: "RIDER",
                line: "Blue rail first. Square exit after!",
                voice: NEVER_MEET_AUDIO.exitLaunch,
              }
          : {
              speaker: "YOU",
              line: "We need an exit that meets the rail like a square corner.",
              voice: NEVER_MEET_AUDIO.exitPrompt,
            }
        : routePlaying
          ? {
              speaker: "NOVA",
              line: "Final course—let it roll!",
              voice: NEVER_MEET_AUDIO.courseLaunch,
            }
          : state.courseRunTested
          ? {
              speaker: "YOU",
              line: "They stayed! Parallel lanes, square exit.",
              voice: NEVER_MEET_AUDIO.turnReaction,
            }
          : state.courseTurned
            ? {
                speaker: "NOVA",
                line: "Final course—let it roll!",
                voice: NEVER_MEET_AUDIO.courseLaunch,
              }
          : {
              speaker: "RIDER",
              line: "Turn the whole rooftop course. Do the relationships stay?",
              voice: NEVER_MEET_AUDIO.turnPrompt,
            };

  useEffect(() => () => {
    if (routeCompleteTimerRef.current) clearTimeout(routeCompleteTimerRef.current);
  }, []);

  const promptStepRef = useRef<number | null>(null);
  useEffect(() => {
    if (
      !state.q3OpeningComplete
      || state.q3ClosingStarted
      || canContinue
      || promptStepRef.current === step
    ) {
      return;
    }
    promptStepRef.current = step;
    const timer = setTimeout(() => onVoice(interactionDialogue.voice), 260);
    return () => clearTimeout(timer);
  }, [
    canContinue,
    interactionDialogue.voice,
    onVoice,
    state.q3ClosingStarted,
    state.q3OpeningComplete,
    step,
  ]);

  const setParallelAngle = (value: number) => {
    const matched = Math.abs(value) <= 1;
    onChange({
      parallelAngle: matched ? 0 : value,
      parallelMatched: matched,
      parallelRunTested: false,
    });
    sound.play(matched ? "success" : "tap");
  };

  const setPerpendicularAngle = (value: number) => {
    const matched = Math.abs(value - 90) <= 2;
    onChange({
      perpendicularAngle: matched ? 90 : value,
      perpendicularMatched: matched,
      squareExitRunTested: false,
    });
    sound.play(matched ? "success" : "tap");
  };

  const setParallelGap = (value: number) => {
    const firstMove = !state.parallelGapMoved;
    onChange({
      parallelGap: Math.max(20, Math.min(42, value)),
      parallelGapMoved: true,
      parallelGapRunTested: false,
    });
    sound.play("tap");
    if (firstMove) onVoice(NEVER_MEET_AUDIO.gapLaunch);
  };

  const runRoute = () => {
    if (routePlaying) return;
    const ready = step === 0
      ? state.parallelMatched
      : step === 1
        ? state.parallelGapMoved
        : step === 2
          ? state.perpendicularMatched
          : state.courseTurned;
    if (!ready) return;

    if (routeCompleteTimerRef.current) clearTimeout(routeCompleteTimerRef.current);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const launchVoice = step === 0
      ? NEVER_MEET_AUDIO.alignLaunch
      : step === 1
        ? NEVER_MEET_AUDIO.gapLaunch
        : step === 2
          ? NEVER_MEET_AUDIO.exitLaunch
          : NEVER_MEET_AUDIO.courseLaunch;
    const resultVoice = step === 0
      ? NEVER_MEET_AUDIO.alignReaction
      : step === 1
        ? NEVER_MEET_AUDIO.gapReaction
        : step === 2
          ? NEVER_MEET_AUDIO.exitReaction
          : NEVER_MEET_AUDIO.turnReaction;
    const testedPatch = step === 0
      ? { parallelRunTested: true }
      : step === 1
        ? { parallelGapRunTested: true }
        : step === 2
          ? { squareExitRunTested: true }
          : { courseRunTested: true };

    setRouteRunKey((current) => current + 1);
    if (reduceMotion) {
      onChange(testedPatch);
      sound.play("success");
      onVoice(resultVoice);
      return;
    }

    setRoutePlaying(true);
    sound.play("tap");
    onVoice(launchVoice);
    const duration = step <= 1 ? 3300 : 4300;
    routeCompleteTimerRef.current = setTimeout(() => {
      setRoutePlaying(false);
      onChange(testedPatch);
      sound.play("success");
      onVoice(resultVoice);
    }, duration);
  };

  const advance = () => {
    if (!canContinue) return;
    sound.play("success");
    if (step === 3) onChange({ q3ClosingStarted: true, q3ClosingBeat: 0 });
    else onChange({ questStep: step + 1 });
  };

  if (!state.q3OpeningComplete) {
    return (
      <SkateQuestStoryPlay
        phase="opening"
        storyLabel="Rails That Never Meet"
        title="The twin-lane launch"
        beats={Q3_OPENING_STORY}
        beat={state.q3OpeningBeat}
        heroName={heroName}
        variant="parallel"
        visual={(
          <NeverMeetCanvas
            questStep={0}
            parallelAngle={state.parallelAngle}
            parallelGap={state.parallelGap}
            parallelMatched={state.parallelMatched}
            perpendicularAngle={state.perpendicularAngle}
            perpendicularMatched={state.perpendicularMatched}
            courseTurned={state.courseTurned}
          />
        )}
        onBeatChange={(q3OpeningBeat) => onChange({ q3OpeningBeat })}
        onComplete={() => onChange({ q3OpeningComplete: true })}
      />
    );
  }

  if (state.q3ClosingStarted) {
    return (
      <SkateQuestStoryPlay
        phase="closing"
        storyLabel="Rails That Never Meet"
        title="The twin-lane finish"
        beats={Q3_CLOSING_STORY}
        beat={state.q3ClosingBeat}
        heroName={heroName}
        variant="parallel"
        visual={(
          <NeverMeetCanvas
            questStep={3}
            parallelAngle={state.parallelAngle}
            parallelGap={state.parallelGap}
            parallelMatched
            perpendicularAngle={90}
            perpendicularMatched
            courseTurned
          />
        )}
        onBeatChange={(q3ClosingBeat) => onChange({ q3ClosingBeat })}
        onComplete={onComplete}
      />
    );
  }

  return (
    <section
      className={`never-meet-quest${routePlaying ? " route-playing" : ""}`}
      aria-label="Rails That Never Meet parallel and perpendicular quest"
    >
      <div className="never-meet-shade" aria-hidden="true" />
      <header className="night-run-hud">
        <div>
          <small>QUEST 3 · RAILS THAT NEVER MEET</small>
          <strong>{scenes[step]}</strong>
        </div>
        <span>{step + 1} <small>OF 4</small></span>
      </header>

      <NeverMeetCanvas
        questStep={step}
        parallelAngle={state.parallelAngle}
        parallelGap={state.parallelGap}
        parallelMatched={state.parallelMatched}
        perpendicularAngle={state.perpendicularAngle}
        perpendicularMatched={state.perpendicularMatched}
        courseTurned={state.courseTurned}
      />
      <NeverMeetRoutePlayback
        variant={step <= 1 ? "parallel" : step === 2 ? "perpendicular" : "course"}
        parallelGap={state.parallelGap}
        courseTurned={state.courseTurned}
        playing={routePlaying}
        runKey={routeRunKey}
        heroName={heroName}
      />

      <Image
        className="never-meet-hero"
        src="/images/skatepark-night-run/hero-skateboard-v2.png"
        alt={`${heroName || "The learner"} riding one glowing rail`}
        width={1000}
        height={1400}
        priority
      />
      <Image
        className="never-meet-nova"
        src="/images/skatepark-night-run/nova-parked-v2.png"
        alt="Nova safely watching the two glowing rails"
        width={1400}
        height={1400}
        priority
      />
      <Image
        className="never-meet-rider"
        src="/images/skatepark-night-run/rider-skateboard-v2.png"
        alt="The rooftop rider preparing for the twin-lane run"
        width={1000}
        height={1400}
        priority
      />

      <div
        className={`never-meet-dialogue dialogue-${interactionDialogue.speaker.toLowerCase()}`}
        aria-live="polite"
      >
        <small>{interactionDialogue.speaker === "YOU" ? heroName || "YOU" : interactionDialogue.speaker}</small>
        <p>{interactionDialogue.line}</p>
        {step === 0 && state.parallelRunTested && (
          <b>After the rails line up: maths calls them parallel lines.</b>
        )}
        {step === 2 && state.squareExitRunTested && (
          <b>After the exit clicks: the square marks a 90° right angle.</b>
        )}
        <button type="button" onClick={() => onVoice(interactionDialogue.voice)}>
          Hear that again
        </button>
      </div>

      <div className="never-meet-controls">
        {step === 0 && (
          <>
            <label htmlFor="parallel-angle">Turn your pink rail until both rails point the same way.</label>
            <input
              id="parallel-angle"
              type="range"
              min="-18"
              max="18"
              value={state.parallelAngle}
              disabled={routePlaying}
              onChange={(event) => setParallelAngle(Number(event.target.value))}
            />
            <div>
              <button type="button" disabled={routePlaying} onClick={() => setParallelAngle(Math.max(-18, state.parallelAngle - 3))}>Turn left</button>
              <button type="button" disabled={routePlaying} onClick={() => setParallelAngle(Math.min(18, state.parallelAngle + 3))}>Turn right</button>
            </div>
            {state.parallelMatched && (
              <button type="button" className="never-meet-run-route" disabled={routePlaying} onClick={runRoute}>
                {routePlaying ? "Nova and you are skating…" : state.parallelRunTested ? "Ride the twin lanes again" : "Ride the twin lanes"}
              </button>
            )}
            {state.parallelRunTested && !routePlaying && (
              <p className="never-meet-route-result"><strong>It worked:</strong> same direction, same gap, no meeting.</p>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <label htmlFor="parallel-gap">Move your rail. Watch both gap markers stay equal.</label>
            <input
              id="parallel-gap"
              type="range"
              min="20"
              max="42"
              value={state.parallelGap}
              disabled={routePlaying}
              onChange={(event) => setParallelGap(Number(event.target.value))}
            />
            <div>
              <button type="button" disabled={routePlaying} onClick={() => setParallelGap(state.parallelGap - 4)}>Move closer</button>
              <button type="button" disabled={routePlaying} onClick={() => setParallelGap(state.parallelGap + 4)}>Move farther</button>
            </div>
            {state.parallelGapMoved && (
              <button type="button" className="never-meet-run-route" disabled={routePlaying} onClick={runRoute}>
                {routePlaying ? "Testing the new gap…" : state.parallelGapRunTested ? "Run the new gap again" : "Run the new gap"}
              </button>
            )}
            {state.parallelGapRunTested && !routePlaying && (
              <p className="never-meet-route-result"><strong>Still parallel:</strong> the gap changed, but it stays equal all along.</p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <label htmlFor="perpendicular-angle">Turn the gold exit until it makes one perfect square corner.</label>
            <input
              id="perpendicular-angle"
              type="range"
              min="55"
              max="125"
              value={state.perpendicularAngle}
              disabled={routePlaying}
              onChange={(event) => setPerpendicularAngle(Number(event.target.value))}
            />
            <div>
              <button type="button" disabled={routePlaying} onClick={() => setPerpendicularAngle(Math.max(55, state.perpendicularAngle - 5))}>Turn left</button>
              <button type="button" disabled={routePlaying} onClick={() => setPerpendicularAngle(Math.min(125, state.perpendicularAngle + 5))}>Turn right</button>
            </div>
            {state.perpendicularMatched && (
              <button type="button" className="never-meet-run-route" disabled={routePlaying} onClick={runRoute}>
                {routePlaying ? "Testing the square crossing…" : state.squareExitRunTested ? "Test the square crossing again" : "Test the square crossing"}
              </button>
            )}
            {state.squareExitRunTested && !routePlaying && (
              <p className="never-meet-route-result"><strong>Square crossing:</strong> the paths meet at exactly 90°.</p>
            )}
          </>
        )}

        {step === 3 && (
          <button
            type="button"
            className="never-meet-turn-course"
            disabled={state.courseTurned}
            onClick={() => {
              const firstTurn = !state.courseTurned;
              onChange({ courseTurned: true, courseRunTested: false });
              sound.play("success");
              if (firstTurn) onVoice(NEVER_MEET_AUDIO.courseLaunch);
            }}
          >
            {state.courseTurned ? "Course turned" : "Turn the whole course"}
          </button>
        )}

        {step === 3 && state.courseTurned && (
          <button type="button" className="never-meet-run-route" disabled={routePlaying} onClick={runRoute}>
            {routePlaying ? "The final course is moving…" : state.courseRunTested ? "Run the whole course again" : "Run the whole course"}
          </button>
        )}

        {step === 3 && state.courseRunTested && !routePlaying && (
          <p className="never-meet-route-result"><strong>Relationships stayed:</strong> parallel lanes and a square exit.</p>
        )}

        <button
          type="button"
          className="night-run-next"
          disabled={!canContinue}
          onClick={advance}
        >
          {step === 3 ? "Land the twin-lane run →" : "Next scene →"}
        </button>
      </div>
    </section>
  );
}

function CrossingBeamCanvas({
  questStep,
  beamAngle,
  correspondingArmed,
  correspondingMatched,
  alternateArmed,
  alternateMatched,
  beamTransferred,
}: {
  questStep: number;
  beamAngle: number;
  correspondingArmed: boolean;
  correspondingMatched: boolean;
  alternateArmed: boolean;
  alternateMatched: boolean;
  beamTransferred: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const width = bounds.width;
      const height = bounds.height;
      const cx = width / 2;
      const cy = height * 0.54;
      const length = Math.min(width * 0.43, 235);
      const gap = 72;
      const angle = ((beamTransferred ? 62 : beamAngle) * Math.PI) / 180;
      const beamRotation = -angle;
      const xUpper = (gap / 2) / Math.tan(angle);
      const xLower = -xUpper;

      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(cx, cy);
      context.lineCap = "round";

      const glowLine = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: string,
      ) => {
        context.shadowColor = color;
        context.shadowBlur = 18;
        context.strokeStyle = color;
        context.lineWidth = 13;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.shadowBlur = 0;
        context.strokeStyle = "#eefcff";
        context.lineWidth = 2.5;
        context.stroke();
      };

      glowLine(-length, -gap / 2, length, -gap / 2, "#42f5ff");
      glowLine(-length, gap / 2, length, gap / 2, "#ff49d7");
      context.save();
      context.rotate(beamRotation);
      glowLine(-length * .86, 0, length * .86, 0, "#fff06b");
      context.restore();

      const wedge = (
        x: number,
        y: number,
        start: number,
        end: number,
        color: string,
        active: boolean,
      ) => {
        if (!active) return;
        context.save();
        context.translate(x, y);
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, 36, start, end);
        context.closePath();
        context.fillStyle = `${color}bb`;
        context.shadowColor = color;
        context.shadowBlur = 18;
        context.fill();
        context.restore();
      };

      const showCorresponding = questStep === 1 || questStep === 3;
      const showAlternate = questStep === 2 || questStep === 3;
      if (showCorresponding) {
        wedge(xUpper, -gap / 2, -angle, 0, "#fff06b", correspondingArmed || correspondingMatched || questStep === 3);
        wedge(xLower, gap / 2, -angle, 0, "#fff06b", correspondingMatched || questStep === 3);
      }
      if (showAlternate) {
        wedge(xUpper, -gap / 2, Math.PI - angle, Math.PI, "#76f7ff", alternateArmed || alternateMatched || questStep === 3);
        wedge(xLower, gap / 2, -angle, 0, "#76f7ff", alternateMatched || questStep === 3);
      }

      [xUpper, xLower].forEach((x, index) => {
        context.fillStyle = "#fff7a6";
        context.shadowColor = "#fff06b";
        context.shadowBlur = 14;
        context.beginPath();
        context.arc(x, index === 0 ? -gap / 2 : gap / 2, 7, 0, Math.PI * 2);
        context.fill();
      });

      context.restore();
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [
    alternateArmed,
    alternateMatched,
    beamAngle,
    beamTransferred,
    correspondingArmed,
    correspondingMatched,
    questStep,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="crossing-beam-canvas"
      data-learning-landmark="crossing-beam-transversal"
      aria-label="A straight beam crossing two parallel rails and making matching angle patterns"
    />
  );
}

function beamHotspotStyle(
  angle: number,
  crossing: "upper" | "lower",
  corner: "corresponding" | "alternate",
) {
  const radians = (angle * Math.PI) / 180;
  const gap = 72;
  const baseX = crossing === "upper"
    ? (gap / 2) / Math.tan(radians)
    : -(gap / 2) / Math.tan(radians);
  const baseY = crossing === "upper" ? -gap / 2 : gap / 2;
  const xOffset = corner === "corresponding" || crossing === "lower" ? 24 : -24;
  const yOffset = corner === "alternate" && crossing === "upper" ? 20 : -20;
  return {
    left: `calc(50% + ${baseX + xOffset}px)`,
    top: `calc(54% + ${baseY + yOffset}px)`,
  };
}

function CrossingBeamQuest({
  state,
  onChange,
  heroName,
  firstTime,
  onVoice,
  onChapterFinish,
}: {
  state: SkateparkState;
  onChange: (patch: Partial<SkateparkState>) => void;
  heroName: string;
  firstTime: boolean;
  onVoice: (source: string) => void;
  onChapterFinish: () => void;
}) {
  const beamRunTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [beamRoutePlaying, setBeamRoutePlaying] = useState(false);
  const [beamRouteRunKey, setBeamRouteRunKey] = useState(0);
  const scenes = [
    "Send the Crossing Beam",
    "Find the Same Seat",
    "Trace the Inside Zigzag",
    "Same Patterns, New Beam",
  ] as const;
  const step = state.questStep;
  const shownAngle = state.beamTransferred ? 62 : state.beamAngle;
  const canContinue = step === 0
    ? state.beamMoved && state.beamRunTested && !beamRoutePlaying
    : step === 1
      ? state.correspondingMatched
      : step === 2
      ? state.alternateMatched
      : state.beamTransferred;
  const interactionDialogue: {
    speaker: SkateStorySpeaker;
    line: string;
    voice: string;
  } = step === 0
    ? beamRoutePlaying
      ? {
          speaker: "NOVA",
          line: "Lights on—ride the two rails!",
          voice: CROSSING_BEAM_AUDIO.beamLaunch,
        }
      : state.beamRunTested
      ? {
          speaker: "YOU",
          line: "It crossed both—two meeting points!",
          voice: CROSSING_BEAM_AUDIO.beamReaction,
        }
      : state.beamMoved
        ? {
            speaker: "NOVA",
            line: "Lights on—ride the two rails!",
            voice: CROSSING_BEAM_AUDIO.beamLaunch,
          }
      : {
          speaker: "RIDER",
          line: "Turn the gold beam until it cuts across both rails.",
          voice: CROSSING_BEAM_AUDIO.beamPrompt,
        }
    : step === 1
      ? state.correspondingMatched
        ? {
            speaker: "RIDER",
            line: "Same seat, same opening!",
            voice: CROSSING_BEAM_AUDIO.seatReaction,
          }
        : {
            speaker: "NOVA",
            line: "Tap one corner, then the same seat at the next crossing.",
            voice: CROSSING_BEAM_AUDIO.seatPrompt,
          }
      : step === 2
        ? state.alternateMatched
          ? {
              speaker: "NOVA",
              line: "The inside pair matches too!",
              voice: CROSSING_BEAM_AUDIO.zigzagReaction,
            }
          : {
              speaker: "YOU",
              line: "Now I’ll trace the inside zigzag.",
              voice: CROSSING_BEAM_AUDIO.zigzagPrompt,
            }
        : beamRoutePlaying
          ? {
              speaker: "RIDER",
              line: "Sweep the beam—keep rolling!",
              voice: CROSSING_BEAM_AUDIO.sweepLaunch,
            }
          : state.beamTransferred
          ? {
              speaker: "YOU",
              line: "They stayed—the whole light show works!",
              voice: CROSSING_BEAM_AUDIO.sweepReaction,
            }
          : {
              speaker: "RIDER",
              line: "Sweep the beam. Do both patterns survive?",
              voice: CROSSING_BEAM_AUDIO.sweepPrompt,
            };

  useEffect(() => () => {
    if (beamRunTimerRef.current) clearTimeout(beamRunTimerRef.current);
  }, []);

  const promptStepRef = useRef<number | null>(null);
  useEffect(() => {
    if (
      !state.q4OpeningComplete
      || state.q4ClosingStarted
      || canContinue
      || promptStepRef.current === step
    ) {
      return;
    }
    promptStepRef.current = step;
    const timer = setTimeout(() => onVoice(interactionDialogue.voice), 260);
    return () => clearTimeout(timer);
  }, [
    canContinue,
    interactionDialogue.voice,
    onVoice,
    state.q4ClosingStarted,
    state.q4OpeningComplete,
    step,
  ]);

  const turnBeam = (value: number) => {
    if (beamRoutePlaying) return;
    onChange({
      beamAngle: Math.max(28, Math.min(70, value)),
      beamMoved: true,
      beamRunTested: false,
    });
    sound.play("tap");
  };

  const runBeamRoute = (mode: "test" | "sweep") => {
    if (beamRoutePlaying || (mode === "test" && !state.beamMoved)) return;
    if (beamRunTimerRef.current) clearTimeout(beamRunTimerRef.current);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const launchVoice = mode === "test"
      ? CROSSING_BEAM_AUDIO.beamLaunch
      : CROSSING_BEAM_AUDIO.sweepLaunch;
    const resultVoice = mode === "test"
      ? CROSSING_BEAM_AUDIO.beamReaction
      : CROSSING_BEAM_AUDIO.sweepReaction;
    setBeamRouteRunKey((current) => current + 1);

    if (mode === "sweep") onChange({ beamTransferred: true });
    if (reduceMotion) {
      if (mode === "test") onChange({ beamRunTested: true });
      sound.play("success");
      onVoice(resultVoice);
      return;
    }

    setBeamRoutePlaying(true);
    sound.play("tap");
    onVoice(launchVoice);
    beamRunTimerRef.current = setTimeout(() => {
      setBeamRoutePlaying(false);
      if (mode === "test") onChange({ beamRunTested: true });
      sound.play(mode === "sweep" ? "finale" : "success");
      onVoice(resultVoice);
    }, 3400);
  };

  const selectCorresponding = () => {
    if (!state.correspondingArmed) {
      onChange({ correspondingArmed: true });
      sound.play("tap");
      return;
    }
    if (!state.correspondingMatched) {
      onChange({ correspondingMatched: true });
      sound.play("success");
      onVoice(CROSSING_BEAM_AUDIO.seatReaction);
    }
  };

  const selectAlternate = () => {
    if (!state.alternateArmed) {
      onChange({ alternateArmed: true });
      sound.play("tap");
      return;
    }
    if (!state.alternateMatched) {
      onChange({ alternateMatched: true });
      sound.play("success");
      onVoice(CROSSING_BEAM_AUDIO.zigzagReaction);
    }
  };

  const advance = () => {
    if (!canContinue || step >= 3) return;
    sound.play("success");
    onChange({
      questStep: step + 1,
      correspondingArmed: false,
      alternateArmed: false,
    });
  };

  if (!state.q4OpeningComplete) {
    return (
      <SkateQuestStoryPlay
        phase="opening"
        storyLabel="Crossing Beam"
        title="The stuck spotlight"
        beats={Q4_OPENING_STORY}
        beat={state.q4OpeningBeat}
        heroName={heroName}
        variant="beam"
        visual={(
          <CrossingBeamCanvas
            questStep={0}
            beamAngle={state.beamAngle}
            correspondingArmed={state.correspondingArmed}
            correspondingMatched={state.correspondingMatched}
            alternateArmed={state.alternateArmed}
            alternateMatched={state.alternateMatched}
            beamTransferred={state.beamTransferred}
          />
        )}
        onBeatChange={(q4OpeningBeat) => onChange({ q4OpeningBeat })}
        onComplete={() => onChange({ q4OpeningComplete: true })}
      />
    );
  }

  if (state.q4ClosingStarted && !state.q4ClosingComplete) {
    return (
      <SkateQuestStoryPlay
        phase="closing"
        storyLabel="Crossing Beam"
        title="The Night Run finale"
        beats={Q4_CLOSING_STORY}
        beat={state.q4ClosingBeat}
        heroName={heroName}
        variant="beam"
        visual={(
          <CrossingBeamCanvas
            questStep={3}
            beamAngle={state.beamAngle}
            correspondingArmed
            correspondingMatched
            alternateArmed
            alternateMatched
            beamTransferred
          />
        )}
        onBeatChange={(q4ClosingBeat) => onChange({ q4ClosingBeat })}
        onComplete={() => onChange({ q4ClosingComplete: true })}
      />
    );
  }

  return (
    <section
      className={`crossing-beam-quest${beamRoutePlaying ? " route-playing" : ""}`}
      aria-label="Crossing Beam transversal and matching angles quest"
    >
      <div className="crossing-beam-shade" aria-hidden="true" />
      <header className="night-run-hud">
        <div>
          <small>QUEST 4 · CROSSING BEAM</small>
          <strong>{scenes[step]}</strong>
        </div>
        <span>{step + 1} <small>OF 4</small></span>
      </header>

      <CrossingBeamCanvas
        questStep={step}
        beamAngle={state.beamAngle}
        correspondingArmed={state.correspondingArmed}
        correspondingMatched={state.correspondingMatched}
        alternateArmed={state.alternateArmed}
        alternateMatched={state.alternateMatched}
        beamTransferred={state.beamTransferred}
      />
      <NeverMeetRoutePlayback
        variant="parallel"
        parallelGap={53}
        courseTurned={false}
        playing={beamRoutePlaying}
        runKey={beamRouteRunKey}
        heroName={heroName}
      />

      <Image
        className="crossing-beam-hero"
        src="/images/skatepark-night-run/hero-skateboard-v2.png"
        alt={`${heroName || "The learner"} riding the lower parallel rail`}
        width={1000}
        height={1400}
        priority
      />
      <Image
        className="crossing-beam-nova"
        src="/images/skatepark-night-run/nova-parked-v2.png"
        alt="Nova safely watching the crossing-beam test"
        width={1400}
        height={1400}
        priority
      />
      <Image
        className="crossing-beam-rider"
        src="/images/skatepark-night-run/rider-skateboard-v2.png"
        alt="The rooftop rider preparing for the final light show"
        width={1000}
        height={1400}
        priority
      />

      {(step === 1 || step === 2) && (
        <div className="crossing-beam-hotspots" aria-label={step === 1 ? "Corresponding angle corners" : "Alternate interior angle corners"}>
          {step === 1 ? (
            <>
              <button
                type="button"
                className={state.correspondingArmed || state.correspondingMatched ? "selected" : ""}
                style={beamHotspotStyle(shownAngle, "upper", "corresponding")}
                aria-label="Choose one corner at the first crossing"
                onClick={selectCorresponding}
              />
              <button
                type="button"
                className={state.correspondingMatched ? "selected" : ""}
                style={beamHotspotStyle(shownAngle, "lower", "corresponding")}
                aria-label="Match the same-position corner at the next crossing"
                disabled={!state.correspondingArmed}
                onClick={selectCorresponding}
              />
            </>
          ) : (
            <>
              <button
                type="button"
                className={state.alternateArmed || state.alternateMatched ? "selected" : ""}
                style={beamHotspotStyle(shownAngle, "upper", "alternate")}
                aria-label="Choose an inside corner at the first crossing"
                onClick={selectAlternate}
              />
              <button
                type="button"
                className={state.alternateMatched ? "selected" : ""}
                style={beamHotspotStyle(shownAngle, "lower", "alternate")}
                aria-label="Complete the inside zigzag at the next crossing"
                disabled={!state.alternateArmed}
                onClick={selectAlternate}
              />
            </>
          )}
        </div>
      )}

      <div
        className={`crossing-beam-dialogue dialogue-${interactionDialogue.speaker.toLowerCase()}`}
        aria-live="polite"
      >
        <small>{interactionDialogue.speaker === "YOU" ? heroName || "YOU" : interactionDialogue.speaker}</small>
        <p>{interactionDialogue.line}</p>
        {step === 0 && state.beamRunTested && (
          <b>After the beam crosses: maths calls it a transversal.</b>
        )}
        {step === 1 && state.correspondingMatched && (
          <b>After the match: these are corresponding angles.</b>
        )}
        {step === 2 && state.alternateMatched && (
          <b>After the zigzag: these are alternate interior angles.</b>
        )}
        <button type="button" onClick={() => onVoice(interactionDialogue.voice)}>
          Hear that again
        </button>
      </div>

      <div className="crossing-beam-controls">
        {step === 0 && (
          <>
            <label htmlFor="crossing-beam-angle">Turn the gold beam. Keep it crossing both straight rails.</label>
            <input
              id="crossing-beam-angle"
              type="range"
              min="28"
              max="70"
              value={state.beamAngle}
              disabled={beamRoutePlaying}
              onChange={(event) => turnBeam(Number(event.target.value))}
            />
            <div>
              <button type="button" disabled={beamRoutePlaying} onClick={() => turnBeam(state.beamAngle - 5)}>Turn left</button>
              <button type="button" disabled={beamRoutePlaying} onClick={() => turnBeam(state.beamAngle + 5)}>Turn right</button>
            </div>
            {state.beamMoved && (
              <button
                type="button"
                className="crossing-beam-run-route"
                disabled={beamRoutePlaying}
                onClick={() => runBeamRoute("test")}
              >
                {beamRoutePlaying ? "Testing both crossings…" : state.beamRunTested ? "Test the spotlight path again" : "Test the spotlight path"}
              </button>
            )}
            {state.beamRunTested && !beamRoutePlaying && (
              <p className="crossing-beam-route-result"><strong>Two crossings:</strong> one straight beam cuts both parallel rails.</p>
            )}
          </>
        )}

        {step === 1 && (
          <p>{state.correspondingMatched ? "Same-position corners matched at both crossings." : state.correspondingArmed ? "Now tap the same-position corner at the next crossing." : "Tap one corner to begin the same-seat trail."}</p>
        )}

        {step === 2 && (
          <p>{state.alternateMatched ? "The inside zigzag matched across the beam." : state.alternateArmed ? "Cross the inside of the rails to the other side of the beam." : "Tap one inside corner to begin the zigzag."}</p>
        )}

        {step === 3 && !state.beamTransferred && (
          <button
            type="button"
            className="crossing-beam-sweep"
            disabled={beamRoutePlaying}
            onClick={() => runBeamRoute("sweep")}
          >
            {beamRoutePlaying ? "Sweeping the beam…" : "Sweep the beam"}
          </button>
        )}

        {step === 3 && state.beamTransferred && beamRoutePlaying && (
          <button type="button" className="crossing-beam-sweep" disabled>
            Sweeping the beam…
          </button>
        )}

        {step < 3 && (
          <button type="button" className="night-run-next" disabled={!canContinue} onClick={advance}>
            Next scene →
          </button>
        )}

        {step === 3 && state.beamTransferred && !beamRoutePlaying && !state.q4ClosingStarted && (
          <button
            type="button"
            className="night-run-next"
            onClick={() => onChange({ q4ClosingStarted: true, q4ClosingBeat: 0 })}
          >
            Run the finale →
          </button>
        )}

        {step === 3 && state.q4ClosingComplete && (
          <div className="crossing-beam-finale world-finale">
            <SparkleBurst playKey="crossing-beam-complete" />
            <small>LINES AND ANGLES · CHAPTER COMPLETE</small>
            <h2>Four quests. One connected line world.</h2>
            <p>Parallel rails keep corresponding and alternate angle patterns matching across a transversal.</p>
            <WorldReward replay={false} firstTime={firstTime} />
            <button type="button" className="night-run-next" onClick={onChapterFinish}>
              Light the Lines &amp; Angles star →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function NightRunStoryPlay({
  phase,
  state,
  onChange,
  heroName,
}: {
  phase: "opening" | "closing";
  state: SkateparkState;
  onChange: (state: SkateparkState) => void;
  heroName: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const beats = phase === "opening" ? OPENING_STORY : CLOSING_STORY;
  const beat = phase === "opening" ? state.openingBeat : state.closingBeat;
  const current = beats[beat];
  const railAngle = phase === "opening"
    ? [38, 38, 38, 63, 63, 63][beat]
    : 58;
  const novaSource = phase === "opening" && beat >= 4
    ? "/images/skatepark-night-run/nova-parked-v2.png"
    : phase === "closing" && beat >= 2
      ? "/images/skatepark-night-run/nova-celebrate.png"
      : "/images/skatepark-night-run/nova-skateboard-v2.png";

  useEffect(() => () => {
    audioRef.current?.pause();
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
  }, []);

  function updateBeat(index: number) {
    if (phase === "opening") onChange({ ...state, openingBeat: index });
    else onChange({ ...state, closingBeat: index });
  }

  function stopPlayback() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    fallbackTimer.current = null;
    setPlaying(false);
  }

  function completeStory() {
    stopPlayback();
    if (phase === "opening") {
      onChange({
        ...state,
        openingBeat: OPENING_STORY.length - 1,
        openingComplete: true,
      });
    } else {
      onChange({
        ...state,
        closingBeat: CLOSING_STORY.length - 1,
        closingComplete: true,
      });
    }
  }

  function playBeat(index: number) {
    if (index >= beats.length) {
      setPlaying(false);
      setFinished(true);
      sound.play(phase === "closing" ? "finale" : "success");
      return;
    }

    updateBeat(index);
    setPlaying(true);
    setFinished(false);
    if (phase === "opening" && index === 3) sound.play("tap");
    if (phase === "closing" && index === 2) sound.play("success");

    const audio = new Audio(beats[index].audio);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.muted = sound.isMuted();

    let settled = false;
    const continueStory = (delay = 220) => {
      if (settled) return;
      settled = true;
      if (audioRef.current !== audio) return;
      fallbackTimer.current = setTimeout(() => playBeat(index + 1), delay);
    };
    audio.onended = () => continueStory();
    const fallbackDuration = Math.max(1700, beats[index].line.length * 48);
    audio.onerror = () => continueStory(fallbackDuration);
    void audio.play().catch(() => {
      continueStory(fallbackDuration);
    });
  }

  return (
    <section
      className={`night-run-story phase-${phase} beat-${beat} speaker-${current.speaker.toLowerCase()}${playing ? " is-playing" : ""}`}
      aria-label={`${phase === "opening" ? "Opening" : "Ending"} story for Nova’s Night Run`}
    >
      <div className="night-run-story-shade" aria-hidden="true" />
      <header>
        <div>
          <small>{phase === "opening" ? "STORY OPENING" : "STORY ENDING"}</small>
          <strong>{phase === "opening" ? "The two-rider glow trick" : "The Night Run lands"}</strong>
        </div>
        <span>{beat + 1} <small>OF {beats.length}</small></span>
      </header>

      <NightRunCanvas
        angle={railAngle}
        step={phase === "opening" ? 1 : 4}
        lightsAwake={4}
        twinMatched={phase === "closing"}
        linearMatched={phase === "closing"}
      />
      {phase === "closing" && (
        <CrossingRoutePlayback
          angle={railAngle}
          playing={playing && beat === 0}
          runKey={`closing-${beat}-${playing}`}
          heroName={heroName}
          compact
        />
      )}

      <Image
        className="night-run-story-nova"
        src={novaSource}
        alt="Nova acting in the rooftop story"
        width={630}
        height={930}
        priority
      />
      <Image
        className="night-run-story-hero"
        src="/images/skatepark-night-run/hero-skateboard-v2.png"
        alt={`${heroName || "The learner"} arriving for the Night Run`}
        width={630}
        height={930}
        priority
      />
      <Image
        className="night-run-story-rider"
        src="/images/skatepark-night-run/rider-skateboard-v2.png"
        alt="A friendly rooftop rider joining the trick"
        width={630}
        height={930}
        priority
      />

      <div className="night-run-story-bubble" aria-live="polite">
        <small>{current.speaker === "YOU" ? heroName || "YOU" : current.speaker}</small>
        <p>{personalize(current.line, heroName)}</p>
      </div>

      {!playing && !finished && (
        <div className="night-run-story-start">
          <div>
            <strong>{beat === 0 ? "Play the story" : "Continue the story"}</strong>
            <small>Short character scene · voices + comic text</small>
          </div>
          <button type="button" onClick={() => playBeat(beat)}>
            {sound.isMuted() ? "Play with captions" : "Play with sound"}
          </button>
        </div>
      )}

      {playing && (
        <div className="night-run-story-status" role="status">
          <i />
          {current.speaker === "YOU" ? heroName || "You" : current.speaker === "RIDER" ? "The rider" : "Nova"} is speaking
        </div>
      )}

      {finished && (
        <button className="night-run-story-continue" type="button" onClick={completeStory}>
          {phase === "opening" ? "Map the glow trick →" : "See what we discovered →"}
        </button>
      )}

      <footer>
        <div aria-label={`Story scene ${beat + 1} of ${beats.length}`}>
          {beats.map((_, index) => <i key={index} className={index <= beat ? "lit" : ""} />)}
        </div>
        <button type="button" onClick={completeStory}>
          {phase === "opening" ? "Skip story" : "Skip celebration"}
        </button>
      </footer>
    </section>
  );
}

function heroAsset(avatar: string) {
  if (avatar === "boy") return "/images/skatepark-night-run/hero-boy-active.png";
  if (avatar === "girl") return "/images/skatepark-night-run/hero-girl-active.png";
  return "/images/skatepark-night-run/hero-explorer-active.png";
}

function angleHotspotStyle(
  angle: number,
  radius = 72,
) {
  return {
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    top: `calc(53% + ${Math.sin(angle) * radius}px)`,
  };
}

const EXTENSION_STORY: Record<
  Extract<SkateparkQuestId, "zigzag-lights" | "inside-together" | "reverse-check" | "opening-ride">,
  readonly { speaker: "NOVA" | "YOU" | "RIDER"; line: string }[]
> = {
  "zigzag-lights": [
    { speaker: "RIDER", line: "The beam made a secret Z across our rails!" },
    { speaker: "YOU", line: "Two inside corners sit on opposite sides of it." },
    { speaker: "NOVA", line: "Light that zigzag pair, then let’s ride through both." },
  ],
  "inside-together": [
    { speaker: "NOVA", line: "These two inside lights are trapped on the same side." },
    { speaker: "RIDER", line: "Can they join into one straight sweep?" },
    { speaker: "YOU", line: "I’ll turn one and watch what its partner needs." },
  ],
  "reverse-check": [
    { speaker: "RIDER", line: "This rail looks parallel—but the tunnel stripes are fooling my eyes." },
    { speaker: "NOVA", line: "Match one corresponding corner. The angle can prove the rails." },
    { speaker: "YOU", line: "Then we test the ride instead of trusting the picture." },
  ],
  "opening-ride": [
    { speaker: "RIDER", line: "Opening crowd is here—and eight roof lights are still dark!" },
    { speaker: "YOU", line: "We know the crossing, zigzag, same-side, and parallel patterns." },
    { speaker: "NOVA", line: "Build one final route with all of them. Then we ride together!" },
  ],
};

function NightRunExtensionQuest({
  state,
  onChange,
  heroName,
  avatar,
  replay,
  firstTime,
  onComplete,
  onChapterComplete,
}: {
  state: SkateparkState;
  onChange: (patch: Partial<SkateparkState>) => void;
  heroName: string;
  avatar: string;
  replay: boolean;
  firstTime: boolean;
  onComplete: () => void;
  onChapterComplete: () => void;
}) {
  const quest = state.activeQuest as keyof typeof EXTENSION_STORY;
  const questIndex = SKATEPARK_QUEST_IDS.indexOf(quest);
  const story = EXTENSION_STORY[quest];

  if (!state.extensionOpeningComplete) {
    const beat = Math.min(state.extensionOpeningBeat, story.length - 1);
    const line = story[beat];
    return (
      <section className={`night-run-extension extension-opening quest-${quest}`} aria-label={`${SKATEPARK_QUESTS[questIndex].title} story opening`}>
        <Image className="extension-rooftop" src="/images/skatepark-night-run/rooftop-night.png" alt="" fill priority sizes="100vw" />
        <div className="extension-opening-cast" aria-hidden>
          <Image src="/images/skatepark-night-run/nova-skateboard-v2.png" alt="" width={420} height={620} />
          <Image src={heroAsset(avatar)} alt="" width={420} height={620} />
          <Image src="/images/skatepark-night-run/rider-skateboard-v2.png" alt="" width={420} height={620} />
        </div>
        <div className={`extension-comic speaker-${line.speaker.toLowerCase()}`}>
          <small>{line.speaker}</small>
          <p>{line.line}</p>
        </div>
        <div className="extension-dots">{story.map((_, index) => <i key={index} className={index <= beat ? "lit" : ""} />)}</div>
        <button
          type="button"
          className="night-run-next"
          onClick={() => {
            sound.play("tap");
            if (beat < story.length - 1) onChange({ extensionOpeningBeat: beat + 1 });
            else onChange({ extensionOpeningComplete: true, questStep: 0 });
          }}
        >
          {beat < story.length - 1 ? "Next line →" : "Build the next part →"}
        </button>
      </section>
    );
  }

  return (
    <section className={`night-run-extension extension-play quest-${quest}`} aria-label={SKATEPARK_QUESTS[questIndex].title}>
      <Image className="extension-rooftop" src="/images/skatepark-night-run/rooftop-night.png" alt="" fill priority sizes="100vw" />
      <header className="extension-header">
        <div><small>QUEST {questIndex + 1} OF 8</small><h1>{SKATEPARK_QUESTS[questIndex].title}</h1><p>{SKATEPARK_QUESTS[questIndex].mission}</p></div>
        <span>{SKATEPARK_QUESTS[questIndex].concept}</span>
      </header>
      <div className="extension-stage">
        <div className="extension-cast" aria-hidden>
          <Image src="/images/skatepark-night-run/nova-point.png" alt="" width={280} height={410} />
          <Image src={heroAsset(avatar)} alt="" width={280} height={410} />
          <Image src="/images/skatepark-night-run/rider-skateboard-v2.png" alt="" width={280} height={410} />
        </div>

        {quest === "zigzag-lights" && (
          <div className="zigzag-board">
            <div className="parallel-rails" style={{ "--beam-angle": `${state.zigzagAngle}deg` } as React.CSSProperties}>
              <i className="rail rail-one" /><i className="rail rail-two" /><i className="zigzag-beam" />
              <button className={`angle-light light-a ${state.zigzagMatched ? "lit" : ""}`} onClick={() => { sound.play("tap"); onChange({ zigzagMatched: true }); }}>A</button>
              <button className={`angle-light light-b ${state.zigzagMatched ? "lit" : ""}`} onClick={() => { sound.play("tap"); onChange({ zigzagMatched: true }); }}>B</button>
              {state.zigzagRunTested && <span className="zigzag-rider-run">🛹</span>}
            </div>
            <div className="extension-control">
              <p>{!state.zigzagMatched ? "Tap the two inside corners that make the Z." : !state.zigzagRunTested ? "The matching inside corners are lit. Ride the zigzag once." : "The beam changed, but the alternate inside openings still match."}</p>
              <label>Turn the crossing beam<input type="range" min="35" max="75" value={state.zigzagAngle} onChange={(event) => onChange({ zigzagAngle: Number(event.target.value), zigzagRunTested: false })} /></label>
              <button disabled={!state.zigzagMatched} onClick={() => { sound.play("success"); onChange({ zigzagRunTested: true, questStep: 2 }); }}>
                {state.zigzagRunTested ? "Ride the zigzag again" : "Ride the glowing Z"}
              </button>
              {state.zigzagRunTested && <div className="extension-reveal"><b>Alternate interior angles match</b><span>Inside the rails · opposite sides of the beam</span><button onClick={onComplete}>{replay ? "Return to journal →" : "Follow the lights →"}</button></div>}
            </div>
          </div>
        )}

        {quest === "inside-together" && (
          <div className="inside-board">
            <div className="straight-angle-meter">
              <i style={{ "--inside-angle": `${state.insideAngle}deg` } as React.CSSProperties} />
              <span className="inside-first">{state.insideAngle}°</span>
              <span className="inside-second">{180 - state.insideAngle}°</span>
              <strong>{state.insideJoined ? "180°" : "?"}</strong>
            </div>
            <div className="extension-control">
              <p>Move one same-side inside opening. Its partner must finish one straight sweep.</p>
              <label>Turn the first opening<input type="range" min="30" max="150" value={state.insideAngle} onChange={(event) => onChange({ insideAngle: Number(event.target.value), insideJoined: false })} /></label>
              <button onClick={() => { sound.play("success"); onChange({ insideJoined: true, questStep: 2 }); }}>Join both lights into a straight sweep</button>
              {state.insideJoined && <div className="extension-reveal"><b>{state.insideAngle}° + {180 - state.insideAngle}° = 180°</b><span>Same-side interior angles complete a straight turn.</span><button onClick={onComplete}>{replay ? "Return to journal →" : "Check the tricky rail →"}</button></div>}
            </div>
          </div>
        )}

        {quest === "reverse-check" && (
          <div className="reverse-board">
            <div className={`illusion-rails ${state.reverseParallel ? "proved" : ""}`} style={{ "--repair-angle": `${state.reverseRailAngle}deg` } as React.CSSProperties}>
              <i className="illusion-stripe one" /><i className="illusion-stripe two" /><span className="proof-corner">62°</span><span className="repair-corner">{62 + Math.abs(state.reverseRailAngle)}°</span>
              {state.reverseRunTested && <b>🛹 ✦ 🛹</b>}
            </div>
            <div className="extension-control">
              <p>The tunnel stripes lie. Rotate the rail until its corresponding corner matches 62°.</p>
              <label>Repair the second rail<input type="range" min="-18" max="18" value={state.reverseRailAngle} onChange={(event) => { const value = Number(event.target.value); onChange({ reverseRailAngle: value, reverseParallel: Math.abs(value) <= 1, reverseRunTested: false }); }} /></label>
              <button disabled={!state.reverseParallel} onClick={() => { sound.play("success"); onChange({ reverseRunTested: true, questStep: 2 }); }}>Test both riders on the repaired rails</button>
              {state.reverseRunTested && <div className="extension-reveal"><b>Matching corresponding angles prove the rails parallel</b><span>The measurement wins over the optical illusion.</span><button onClick={onComplete}>{replay ? "Return to journal →" : "Build the opening ride →"}</button></div>}
            </div>
          </div>
        )}

        {quest === "opening-ride" && (
          <div className="opening-ride-board">
            <div className={`final-course ${state.openingRideBuilt ? "built" : ""} ${state.openingRideLaunched ? "launched" : ""}`}>
              <i className="final-parallel one" /><i className="final-parallel two" /><i className="final-beam" />
              {Array.from({ length: 8 }, (_, index) => <span key={index} className={`final-light light-${index + 1}`}>✦</span>)}
              {state.openingRideLaunched && <div className="final-riders"><b>🛹</b><b>🛹</b><b>🛹</b></div>}
            </div>
            <div className="extension-control">
              {!state.openingRideBuilt ? <>
                <p>Use the four patterns you discovered to wake all eight course lights.</p>
                <div className="pattern-chips"><span>Across matches</span><span>Beside makes 180°</span><span>Zigzag matches</span><span>Same-side makes 180°</span></div>
                <button onClick={() => { sound.play("success"); onChange({ openingRideBuilt: true, questStep: 1 }); }}>Connect the eight-light course</button>
              </> : !state.openingRideLaunched ? <>
                <p>Every light agrees. Nova, {heroName || "the rider"}, and the rooftop rider are ready.</p>
                <button onClick={() => { sound.play("finale"); onChange({ openingRideLaunched: true, questStep: 2 }); }}>Ride the opening route ✦</button>
              </> : <div className="extension-finale world-finale">
                <Image src="/images/skatepark-night-run/nova-celebrate.png" alt="Nova celebrates the opening ride" width={220} height={320} />
                <div><small>NIGHT RUN COMPLETE</small><h2>The whole rooftop moves as one glowing story.</h2><p>Nova laughs: “You didn’t memorise a list. You built every angle relationship into the ride!”</p><p>{replay ? "📖 Live progress stayed safe" : firstTime ? "🪙 +25 Lumina coins" : "✨ Star already lit"}</p><button onClick={onChapterComplete}>{replay ? "Return to my journal →" : "Complete Nova’s Night Run →"}</button></div>
              </div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function SkateparkAdventure({
  state,
  onChange,
  firstTime,
  replay,
  heroName,
  avatar,
  onFinish,
}: SkateparkAdventureProps) {
  const novaAudioRef = useRef<HTMLAudioElement | null>(null);
  const routePhaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeCompleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [routePlaying, setRoutePlaying] = useState(false);
  const [routePhase, setRoutePhase] = useState<"idle" | "nova" | "you">("idle");
  const [routeRunKey, setRouteRunKey] = useState(0);
  const set = (patch: Partial<SkateparkState>) => onChange({ ...state, ...patch });
  const sceneIndex = Math.min(state.step, 4);
  const crossingAngle = (state.railAngle * Math.PI) / 180;
  const sceneOrientation = state.step === 4 ? 0.3 : 0;
  const rightAcute = angleHotspotStyle(
    -crossingAngle / 2 + sceneOrientation,
  );
  const leftAcute = angleHotspotStyle(
    Math.PI - crossingAngle / 2 + sceneOrientation,
  );
  const lowerWide = angleHotspotStyle(
    (Math.PI - crossingAngle) / 2 + sceneOrientation,
  );
  const canContinue = state.step === 0
    ? state.trailOutcome !== null
    : state.step === 1
      ? state.crossingRouteTested && !routePlaying
      : state.step === 2
        ? state.twinMatched
        : state.step === 3
          ? state.linearPair !== null
          : state.step === 4
            ? state.transferTwinMatched && state.transferLinearMatched
            : true;
  const learnedTwin = state.twinMatched || state.step > 2;
  const learnedPair = state.linearPair !== null || state.step > 3;
  const interactionDialogue: {
    speaker: SkateStorySpeaker;
    line: string;
    voice: string | null;
  } = state.step === 1
    ? routePlaying && routePhase === "nova"
      ? {
          speaker: "NOVA",
          line: "Blue path first—watch me!",
          voice: CROSSING_RAILS_AUDIO.routeNova,
        }
      : routePlaying && routePhase === "you"
        ? {
            speaker: "YOU",
            line: "Clear! My straight path crosses next!",
            voice: CROSSING_RAILS_AUDIO.routeKid,
          }
        : state.crossingRouteTested
          ? {
              speaker: "RIDER",
              line: "Perfect! Same point, different times—no crash!",
              voice: CROSSING_RAILS_AUDIO.routeResult,
            }
          : state.movedRail
      ? {
          speaker: "YOU",
          line: "Whoa—all four openings moved with it. Let’s test the paths!",
          voice: CROSSING_RAILS_AUDIO.turnReaction,
        }
      : {
          speaker: "RIDER",
          line: "Turn my pink trail. Watch every opening.",
          voice: CROSSING_RAILS_AUDIO.turnPrompt,
        }
    : state.step === 2
      ? state.twinMatched
        ? {
            speaker: "NOVA",
            line: "Yes! The corners across the X match.",
            voice: CROSSING_RAILS_AUDIO.twinReaction,
          }
        : state.twinArmed
          ? {
              speaker: "YOU",
              line: "This one… now the opening straight across.",
              voice: null,
            }
          : {
              speaker: "RIDER",
              line: "Pick one opening. Can you find its match across the X?",
              voice: CROSSING_RAILS_AUDIO.twinPrompt,
            }
      : state.step === 3
        ? state.linearPair
          ? {
              speaker: "RIDER",
              line: "That’s it! The two beside each other make one straight line.",
              voice: CROSSING_RAILS_AUDIO.lineReaction,
            }
          : {
              speaker: "YOU",
              line: "We still need one straight way out.",
              voice: CROSSING_RAILS_AUDIO.linePrompt,
            }
        : state.step === 4
          ? state.transferTwinMatched && state.transferLinearMatched
            ? {
                speaker: "YOU",
                line: "Across matches. Beside makes a line. Got it!",
                voice: CROSSING_RAILS_AUDIO.transferReaction,
              }
            : state.transferTwinMatched
              ? {
                  speaker: "NOVA",
                  line: "Across is matched. Now choose beside it for our straight exit.",
                  voice: null,
                }
              : {
                  speaker: "RIDER",
                  line: "New crossing. Think the same trick still works?",
                  voice: CROSSING_RAILS_AUDIO.transferPrompt,
                }
          : {
              speaker: "NOVA",
              line: DIALOGUE[5],
              voice: null,
            };

  useEffect(() => () => {
    novaAudioRef.current?.pause();
    if (routePhaseTimerRef.current) clearTimeout(routePhaseTimerRef.current);
    if (routeCompleteTimerRef.current) clearTimeout(routeCompleteTimerRef.current);
  }, []);

  const playNovaVoice = useCallback((source: string) => {
    novaAudioRef.current?.pause();
    const audio = new Audio(source);
    novaAudioRef.current = audio;
    audio.preload = "auto";
    audio.muted = sound.isMuted();
    void audio.play().catch(() => undefined);
  }, []);

  const promptStepRef = useRef<number | null>(null);
  useEffect(() => {
    if (
      state.activeQuest !== "crossing-rails"
      || !state.openingComplete
      || state.step < 1
      || state.step > 4
      || canContinue
      || promptStepRef.current === state.step
      || !interactionDialogue.voice
    ) {
      return;
    }
    promptStepRef.current = state.step;
    const timer = setTimeout(
      () => playNovaVoice(interactionDialogue.voice as string),
      260,
    );
    return () => clearTimeout(timer);
  }, [
    canContinue,
    interactionDialogue.voice,
    playNovaVoice,
    state.activeQuest,
    state.openingComplete,
    state.step,
  ]);

  const moveRail = (railAngle: number) => {
    if (routePlaying) return;
    const firstMove = !state.movedRail;
    set({ railAngle, movedRail: true, crossingRouteTested: false });
    sound.play("tap");
    if (firstMove) playNovaVoice(CROSSING_RAILS_AUDIO.turnReaction);
  };

  const runCrossingRoute = () => {
    if (!state.movedRail || routePlaying) return;

    if (routePhaseTimerRef.current) clearTimeout(routePhaseTimerRef.current);
    if (routeCompleteTimerRef.current) clearTimeout(routeCompleteTimerRef.current);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRouteRunKey((current) => current + 1);

    if (reduceMotion) {
      setRoutePlaying(false);
      setRoutePhase("idle");
      set({ crossingRouteTested: true });
      sound.play("success");
      playNovaVoice(CROSSING_RAILS_AUDIO.routeResult);
      return;
    }

    setRoutePlaying(true);
    setRoutePhase("nova");
    sound.play("tap");
    playNovaVoice(CROSSING_RAILS_AUDIO.routeNova);

    routePhaseTimerRef.current = setTimeout(() => {
      setRoutePhase("you");
      playNovaVoice(CROSSING_RAILS_AUDIO.routeKid);
    }, 3250);

    routeCompleteTimerRef.current = setTimeout(() => {
      setRoutePlaying(false);
      setRoutePhase("idle");
      set({ crossingRouteTested: true });
      sound.play("success");
      playNovaVoice(CROSSING_RAILS_AUDIO.routeResult);
    }, 6350);
  };

  const advance = () => {
    if (!canContinue || state.step >= 5) return;
    sound.play("success");
    set(state.step === 4
      ? { step: 5, closingBeat: 0, closingComplete: false }
      : { step: state.step + 1, twinArmed: false });
  };

  const selectTwin = () => {
    if (state.step === 2) {
      if (state.twinMatched) return;
      if (!state.twinArmed) {
        sound.play("tap");
        set({ twinArmed: true });
        return;
      }
      sound.play("success");
      set({ twinMatched: true, twinArmed: false });
      playNovaVoice(CROSSING_RAILS_AUDIO.twinReaction);
      return;
    }
    if (state.step === 4 && !state.transferTwinMatched) {
      sound.play("success");
      set({ transferTwinMatched: true });
    }
  };

  const markQuestComplete = (quest: SkateparkQuestId) => {
    const completedQuests = [...new Set([...(state.completedQuests ?? []), quest])];
    const currentIndex = SKATEPARK_QUEST_IDS.indexOf(quest);
    const nextQuest = SKATEPARK_QUEST_IDS[currentIndex + 1];
    if (!nextQuest) {
      set({ completedQuests, chapterMapOpen: true, activeQuest: null });
      return;
    }
    const next: Partial<SkateparkState> = {
      completedQuests,
      chapterMapOpen: false,
      activeQuest: nextQuest,
      step: nextQuest === "crossing-rails" ? 1 : 5,
      questStep: 0,
    };
    if (nextQuest === "crossing-rails") {
      Object.assign(next, {
        railAngle: 46,
        movedRail: false,
        twinArmed: false,
        twinMatched: false,
        linearPair: null,
        transferTwinMatched: false,
        transferLinearMatched: false,
        crossingRouteTested: false,
        recapOpen: false,
        openingBeat: 0,
        openingComplete: false,
      });
    } else if (nextQuest === "never-meet") {
      Object.assign(next, {
        parallelAngle: 14,
        parallelGap: 30,
        parallelGapMoved: false,
        parallelMatched: false,
        parallelRunTested: false,
        parallelGapRunTested: false,
        perpendicularAngle: 64,
        perpendicularMatched: false,
        squareExitRunTested: false,
        courseTurned: false,
        courseRunTested: false,
        q3OpeningBeat: 0,
        q3OpeningComplete: false,
      });
    } else if (nextQuest === "crossing-beam") {
      Object.assign(next, {
        beamAngle: 48,
        beamMoved: false,
        beamRunTested: false,
        correspondingArmed: false,
        correspondingMatched: false,
        alternateArmed: false,
        alternateMatched: false,
        beamTransferred: false,
        q4OpeningBeat: 0,
        q4OpeningComplete: false,
      });
    } else {
      Object.assign(next, {
        extensionOpeningBeat: 0,
        extensionOpeningComplete: false,
        ...(nextQuest === "zigzag-lights" ? {
          zigzagAngle: 52,
          zigzagMatched: false,
          zigzagRunTested: false,
        } : {}),
        ...(nextQuest === "inside-together" ? {
          insideAngle: 68,
          insideJoined: false,
        } : {}),
        ...(nextQuest === "reverse-check" ? {
          reverseRailAngle: 10,
          reverseParallel: false,
          reverseRunTested: false,
        } : {}),
        ...(nextQuest === "opening-ride" ? {
          openingRideBuilt: false,
          openingRideLaunched: false,
        } : {}),
      });
    }
    set(next);
  };

  const startQuest = (quest: SkateparkQuestId) => {
    if (quest === "trail-meet") {
      set({
        chapterMapOpen: false,
        activeQuest: quest,
        step: 0,
      });
      return;
    }

    if (quest === "crossing-rails" && (state.completedQuests ?? []).includes("trail-meet")) {
      const alreadyCompleted = (state.completedQuests ?? []).includes("crossing-rails");
      const isResuming = !alreadyCompleted
        && state.activeQuest === "crossing-rails"
        && state.step >= 1
        && state.step <= 5;
      set({
        chapterMapOpen: false,
        activeQuest: quest,
        step: isResuming ? state.step : 1,
        ...(isResuming ? {} : {
          railAngle: 46,
          movedRail: false,
          twinArmed: false,
          twinMatched: false,
          linearPair: null,
          transferTwinMatched: false,
          transferLinearMatched: false,
          crossingRouteTested: false,
          recapOpen: false,
          openingBeat: 0,
          openingComplete: false,
          closingBeat: 0,
          closingComplete: false,
        }),
      });
      return;
    }

    if (quest === "never-meet" && (state.completedQuests ?? []).includes("crossing-rails")) {
      const alreadyCompleted = (state.completedQuests ?? []).includes("never-meet");
      const isResuming = !alreadyCompleted && state.activeQuest === "never-meet";
      set({
        chapterMapOpen: false,
        activeQuest: quest,
        step: 5,
        questStep: isResuming ? (state.questStep ?? 0) : 0,
        ...(isResuming ? {} : {
          parallelAngle: 14,
          parallelGap: 30,
          parallelGapMoved: false,
          parallelMatched: false,
          parallelRunTested: false,
          parallelGapRunTested: false,
          perpendicularAngle: 64,
          perpendicularMatched: false,
          squareExitRunTested: false,
          courseTurned: false,
          courseRunTested: false,
          q3OpeningBeat: 0,
          q3OpeningComplete: false,
          q3ClosingBeat: 0,
          q3ClosingStarted: false,
        }),
      });
      return;
    }

    if (quest === "crossing-beam" && (state.completedQuests ?? []).includes("never-meet")) {
      const alreadyCompleted = (state.completedQuests ?? []).includes("crossing-beam");
      const isResuming = !alreadyCompleted && state.activeQuest === "crossing-beam";
      set({
        chapterMapOpen: false,
        activeQuest: quest,
        step: 5,
        questStep: isResuming ? (state.questStep ?? 0) : 0,
        ...(isResuming ? {} : {
          beamAngle: 48,
          beamMoved: false,
          beamRunTested: false,
          correspondingArmed: false,
          correspondingMatched: false,
          alternateArmed: false,
          alternateMatched: false,
          beamTransferred: false,
          q4OpeningBeat: 0,
          q4OpeningComplete: false,
          q4ClosingBeat: 0,
          q4ClosingStarted: false,
          q4ClosingComplete: false,
        }),
      });
      return;
    }

    const extensionIndex = SKATEPARK_QUEST_IDS.indexOf(quest);
    if (extensionIndex >= 4 && state.completedQuests.includes(SKATEPARK_QUEST_IDS[extensionIndex - 1])) {
      const alreadyCompleted = state.completedQuests.includes(quest);
      const isResuming = !alreadyCompleted && state.activeQuest === quest;
      set({
        chapterMapOpen: false,
        activeQuest: quest,
        step: 5,
        questStep: isResuming ? state.questStep : 0,
        extensionOpeningBeat: isResuming ? state.extensionOpeningBeat : 0,
        extensionOpeningComplete: isResuming ? state.extensionOpeningComplete : false,
        ...(isResuming ? {} : quest === "zigzag-lights" ? {
          zigzagAngle: 52,
          zigzagMatched: false,
          zigzagRunTested: false,
        } : quest === "inside-together" ? {
          insideAngle: 68,
          insideJoined: false,
        } : quest === "reverse-check" ? {
          reverseRailAngle: 10,
          reverseParallel: false,
          reverseRunTested: false,
        } : {
          openingRideBuilt: false,
          openingRideLaunched: false,
        }),
      });
    }
  };

  if (state.chapterMapOpen && !replay) {
    return (
      <SkateparkQuestMap
        state={state}
        heroName={heroName}
        avatar={avatar}
        onStart={startQuest}
      />
    );
  }

  if (
    state.activeQuest === "zigzag-lights"
    || state.activeQuest === "inside-together"
    || state.activeQuest === "reverse-check"
    || state.activeQuest === "opening-ride"
  ) {
    return (
      <NightRunExtensionQuest
        state={state}
        onChange={set}
        heroName={heroName}
        avatar={avatar}
        replay={replay}
        firstTime={firstTime}
        onComplete={() => markQuestComplete(state.activeQuest as SkateparkQuestId)}
        onChapterComplete={() => {
          if (replay) {
            onFinish(state);
            return;
          }
          const finalState: SkateparkState = {
            ...state,
            completedQuests: [...SKATEPARK_QUEST_IDS],
            chapterMapOpen: true,
            activeQuest: null,
            openingRideLaunched: true,
          };
          onChange(finalState);
          onFinish(finalState);
        }}
      />
    );
  }

  if (state.activeQuest === "never-meet" && !replay) {
    return (
      <NeverMeetQuest
        state={state}
        heroName={heroName}
        onChange={set}
        onVoice={playNovaVoice}
        onComplete={() => {
          sound.play("finale");
          markQuestComplete("never-meet");
        }}
      />
    );
  }

  if (state.activeQuest === "crossing-beam" && !replay) {
    return (
      <CrossingBeamQuest
        state={state}
        heroName={heroName}
        firstTime={firstTime}
        onChange={set}
        onVoice={playNovaVoice}
        onChapterFinish={() => {
          markQuestComplete("crossing-beam");
        }}
      />
    );
  }

  if (
    state.activeQuest === "crossing-rails"
    && state.step === 1
    && !state.openingComplete
  ) {
    return (
      <section className="night-run" aria-label="Crossing Rails story opening">
        <NightRunStoryPlay
          phase="opening"
          state={state}
          onChange={onChange}
          heroName={heroName}
        />
      </section>
    );
  }

  if (state.step === 0) {
    return (
      <section className="night-run" aria-label="Trail Meet straight-line quest">
        <StraightTrailScene
          context="adventure"
          initialEndpoint={state.trailEndpoint}
          initialOutcome={state.trailOutcome}
          onRunChange={(trailEndpoint, trailOutcome) => {
            set({ trailEndpoint, trailOutcome });
          }}
          onContinue={() => {
            if (replay) advance();
            else {
              sound.play("success");
              markQuestComplete("trail-meet");
            }
          }}
        />
      </section>
    );
  }

  if (state.step === 5 && !state.closingComplete) {
    return (
      <section className="night-run" aria-label="Nova’s Night Run story ending">
        <NightRunStoryPlay
          phase="closing"
          state={state}
          onChange={onChange}
          heroName={heroName}
        />
      </section>
    );
  }

  return (
    <section className="night-run" aria-label="Nova’s Night Run lines and angles adventure">
      <div className={`night-run-stage${routePlaying ? " route-playing" : ""}`}>
        <div className="night-run-shade" aria-hidden="true" />
        <header className="night-run-hud">
          <div>
            <small>QUEST 2 · CROSSING RAILS</small>
            <strong>{SCENES[sceneIndex]}</strong>
          </div>
          <span>{sceneIndex} <small>OF 4</small></span>
        </header>

        <NightRunCanvas
          angle={state.railAngle}
          step={state.step}
          lightsAwake={state.lightsAwake}
          twinArmed={state.twinArmed}
          twinMatched={state.step === 4 ? state.transferTwinMatched : learnedTwin}
          linearMatched={state.step === 4 ? state.transferLinearMatched : learnedPair}
          linearSelection={state.step === 3 ? state.linearPair : null}
        />
        {state.step === 1 && (
          <CrossingRoutePlayback
            angle={state.railAngle}
            playing={routePlaying}
            runKey={routeRunKey}
            heroName={heroName}
          />
        )}

        <Image
          className="night-run-nova"
          src="/images/skatepark-night-run/nova-parked-v2.png"
          alt="Nova reacting to the crossing glow trails"
          width={630}
          height={930}
          priority
        />
        <Image
          className="night-run-hero"
          src="/images/skatepark-night-run/hero-skateboard-v2.png"
          alt={`${heroName || "The learner"} helping Nova on the rooftop`}
          width={630}
          height={930}
          priority
        />
        <Image
          className="night-run-rider"
          src="/images/skatepark-night-run/rider-skateboard-v2.png"
          alt="The rooftop rider waiting beside the crossing"
          width={630}
          height={930}
          priority
        />

        {state.step >= 2 && state.step <= 4 && (
          <div className={`night-run-hotspots scene-${state.step}`} aria-label="Glowing angle corners">
            {state.step === 2 && (
              <>
                <button
                  className={`corner-hotspot${state.twinArmed || state.twinMatched ? " selected" : ""}`}
                  style={rightAcute}
                  aria-label="Pick the glowing corner"
                  onClick={selectTwin}
                />
                <button
                  className={`corner-hotspot${state.twinMatched ? " selected" : ""}`}
                  style={leftAcute}
                  aria-label="Match the opposite corner"
                  disabled={!state.twinArmed && !state.twinMatched}
                  onClick={selectTwin}
                />
              </>
            )}
            {state.step === 3 && (
              <>
                <button
                  className={`corner-hotspot${state.linearPair === "left" ? " selected" : ""}`}
                  style={leftAcute}
                  aria-label="Slide the left corner beside it"
                  onClick={() => {
                    sound.play("success");
                    set({ linearPair: "left" });
                    playNovaVoice(CROSSING_RAILS_AUDIO.lineReaction);
                  }}
                />
                <button
                  className={`corner-hotspot${state.linearPair === "right" ? " selected" : ""}`}
                  style={rightAcute}
                  aria-label="Slide the right corner beside it"
                  onClick={() => {
                    sound.play("success");
                    set({ linearPair: "right" });
                    playNovaVoice(CROSSING_RAILS_AUDIO.lineReaction);
                  }}
                />
              </>
            )}
            {state.step === 4 && (
              <>
                <button
                  className={`corner-hotspot${state.transferTwinMatched ? " selected" : ""}`}
                  style={rightAcute}
                  aria-label={state.transferTwinMatched ? "Mirror opening matched" : "Match the mirror opening"}
                  onClick={selectTwin}
                />
                <button
                  className={`corner-hotspot${state.transferLinearMatched ? " selected" : ""}`}
                  style={lowerWide}
                  aria-label={state.transferLinearMatched ? "Straight exit planned" : "Plan the straight exit"}
                  disabled={!state.transferTwinMatched}
                  onClick={() => {
                    sound.play("success");
                    set({ transferLinearMatched: true });
                    playNovaVoice(CROSSING_RAILS_AUDIO.transferReaction);
                  }}
                />
              </>
            )}
          </div>
        )}

        <div
          className={`night-run-dialogue dialogue-${interactionDialogue.speaker.toLowerCase()}`}
          aria-live="polite"
        >
          <small>{interactionDialogue.speaker === "YOU" ? heroName || "YOU" : interactionDialogue.speaker}</small>
          <p>{personalize(interactionDialogue.line, heroName)}</p>
          {state.step === 2 && state.twinMatched && (
            <b>After the match: maths calls them vertically opposite angles.</b>
          )}
          {state.step === 3 && state.linearPair && (
            <b>After the line is built: the pair adds to 180°.</b>
          )}
          {interactionDialogue.voice && (
            <button
              className="night-run-voice"
              type="button"
              onClick={() => playNovaVoice(interactionDialogue.voice as string)}
            >
              Hear that again
            </button>
          )}
        </div>

        <div className="night-run-controls">
          {state.step === 1 && (
            <>
              <label htmlFor="night-run-rail">Aim the pink path. Keep it straight.</label>
              <input
                id="night-run-rail"
                className="night-run-range"
                type="range"
                min="25"
                max="75"
                value={state.railAngle}
                disabled={routePlaying}
                onChange={(event) => {
                  moveRail(Number(event.target.value));
                }}
              />
              <div className="night-run-choice-row">
                <button
                  disabled={routePlaying}
                  onClick={() => moveRail(Math.max(25, state.railAngle - 8))}
                >
                  Turn left
                </button>
                <button
                  disabled={routePlaying}
                  onClick={() => moveRail(Math.min(75, state.railAngle + 8))}
                >
                  Turn right
                </button>
              </div>
              {state.movedRail && (
                <button
                  type="button"
                  className="night-run-action night-run-route-test"
                  disabled={routePlaying}
                  onClick={runCrossingRoute}
                >
                  {routePlaying
                    ? routePhase === "nova"
                      ? "Nova is skating the blue path…"
                      : `${heroName || "You"} are crossing next…`
                    : state.crossingRouteTested
                      ? "Run the two paths again"
                      : "Test the two paths"}
                </button>
              )}
              {state.crossingRouteTested && !routePlaying && (
                <p className="night-run-route-result">
                  <strong>Safe crossing:</strong> two straight paths meet at one point.
                </p>
              )}
            </>
          )}

          {state.step === 2 && (
            <>
              <p>{state.twinMatched ? "The openings across the crossing glow together!" : state.twinArmed ? "Now tap the opening directly across the crossing." : "Tap one glowing opening, then find its match across the crossing."}</p>
            </>
          )}

          {state.step === 3 && (
            <>
              <p>Tap an opening beside the glow to rebuild one straight rail.</p>
            </>
          )}

          {state.step === 4 && (
            <>
              <p>{state.transferTwinMatched ? "Mirror paths matched! Now tap beside it to plan the straight exit." : "New crossing. Match the mirror paths, then build the straight exit."}</p>
            </>
          )}

          {state.step < 5 && (
            <button className="night-run-next" disabled={!canContinue} onClick={advance}>
              {state.step === 4 ? "Finish the night run →" : "Next scene →"}
            </button>
          )}

          {state.step === 5 && (
            <div className="night-run-finale world-finale">
              <SparkleBurst playKey="night-run-complete" />
              <small>{replay ? "JOURNAL REPLAY COMPLETE" : "QUEST 2 COMPLETE"}</small>
              <h2>Across matches. Beside makes a line.</h2>
              <button className="night-run-why" onClick={() => set({ recapOpen: !state.recapOpen })}>
                {state.recapOpen ? "Hide the pattern" : "Show me why"}
              </button>
              {state.recapOpen && (
                <div className="night-run-recap">
                  <p><b>Across the X:</b> vertically opposite angles are equal.</p>
                  <p><b>Along one rail:</b> a linear pair adds to 180°, a straight line.</p>
                </div>
              )}
              {replay && <WorldReward replay firstTime={firstTime} />}
              {!replay && (
                <div className="night-run-quest-save">
                  <strong>Quest saved</strong>
                  <small>The chapter star lights after all four rooftop quests.</small>
                </div>
              )}
              <button
                className="night-run-next"
                onClick={() => {
                  if (replay) onFinish();
                  else {
                    sound.play("finale");
                    markQuestComplete("crossing-rails");
                  }
                }}
              >
                {replay ? "Return to my journal →" : "Next: Rails That Never Meet →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
