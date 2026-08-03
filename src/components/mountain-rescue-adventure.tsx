"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  altitudeFromPointer,
  appendAltitudeTrail,
  formatAltitude,
  MOUNTAIN_BEACON,
  MOUNTAIN_START,
  MOUNTAIN_TOP,
  MOUNTAIN_BOTTOM,
} from "@/lib/mountain-rescue";
import {
  MOUNTAIN_QUEST_IDS,
  type MountainQuestId,
  type MountainState,
} from "@/lib/grade-seven-progress";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import { QuestStoryScene, type SceneBeat } from "./quest-story-scene";

type MountainRescueAdventureProps = {
  state: MountainState;
  onChange: (state: MountainState) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  avatar: string;
  onFinish: (state?: MountainState) => void;
};

type MountainSpeaker = "SCOUT" | "NOVA" | "YOU";
type MountainTraveller = "pod" | "hook";

const MOUNTAIN_AUDIO_ROOT = "/audio/mountain-rescue";
export const MOUNTAIN_AUDIO = {
  q1Opening01Nova: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-01-nova.mp3`,
  q1Opening02Kid: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-02-kid.mp3`,
  q1Opening03Scout: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-03-scout.mp3`,
  q1Opening04Nova: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-04-nova.mp3`,
  q1Opening05Scout: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-05-scout.mp3`,
  q1Opening06Kid: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-06-kid.mp3`,
  q1Opening07Scout: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-07-scout.mp3`,
  q1Opening08Nova: `${MOUNTAIN_AUDIO_ROOT}/q1-opening-08-nova.mp3`,
  q1LatchNova: `${MOUNTAIN_AUDIO_ROOT}/q1-latch-nova.mp3`,
  q1SignalNova: `${MOUNTAIN_AUDIO_ROOT}/q1-signal-nova.mp3`,
  q1ZeroKid: `${MOUNTAIN_AUDIO_ROOT}/q1-zero-kid.mp3`,
  q1BelowNova: `${MOUNTAIN_AUDIO_ROOT}/q1-below-nova.mp3`,
  q1FoundKid: `${MOUNTAIN_AUDIO_ROOT}/q1-found-kid.mp3`,
  q1BrushNova: `${MOUNTAIN_AUDIO_ROOT}/q1-brush-nova.mp3`,
  q1StrapNova: `${MOUNTAIN_AUDIO_ROOT}/q1-strap-nova.mp3`,
  q1RecoveredKid: `${MOUNTAIN_AUDIO_ROOT}/q1-recovered-kid.mp3`,
  q1RevealNova: `${MOUNTAIN_AUDIO_ROOT}/q1-reveal-nova.mp3`,
  q1FlagNova: `${MOUNTAIN_AUDIO_ROOT}/q1-flag-nova.mp3`,
  q2OpeningScout: `${MOUNTAIN_AUDIO_ROOT}/q2-opening-01-scout.mp3`,
  q2OpeningNova: `${MOUNTAIN_AUDIO_ROOT}/q2-opening-02-nova.mp3`,
  q2OpeningKid: `${MOUNTAIN_AUDIO_ROOT}/q2-opening-03-kid.mp3`,
  q2CompareNova: `${MOUNTAIN_AUDIO_ROOT}/q2-stage-01-nova.mp3`,
  q2OrderKid: `${MOUNTAIN_AUDIO_ROOT}/q2-stage-02-kid.mp3`,
  q2RevealNova: `${MOUNTAIN_AUDIO_ROOT}/q2-stage-03-nova.mp3`,
  q2RecapScout: `${MOUNTAIN_AUDIO_ROOT}/q2-stage-04-scout.mp3`,
  q3OpeningScout: `${MOUNTAIN_AUDIO_ROOT}/q3-opening-01-scout.mp3`,
  q3OpeningNova: `${MOUNTAIN_AUDIO_ROOT}/q3-opening-02-nova.mp3`,
  q3OpeningKid: `${MOUNTAIN_AUDIO_ROOT}/q3-opening-03-kid.mp3`,
  q3MoveNova: `${MOUNTAIN_AUDIO_ROOT}/q3-stage-01-nova.mp3`,
  q3TransferKid: `${MOUNTAIN_AUDIO_ROOT}/q3-stage-02-kid.mp3`,
  q3RevealNova: `${MOUNTAIN_AUDIO_ROOT}/q3-stage-03-nova.mp3`,
  q3RecapScout: `${MOUNTAIN_AUDIO_ROOT}/q3-stage-04-scout.mp3`,
  q4OpeningScout: `${MOUNTAIN_AUDIO_ROOT}/q4-opening-01-scout.mp3`,
  q4OpeningNova: `${MOUNTAIN_AUDIO_ROOT}/q4-opening-02-nova.mp3`,
  q4OpeningKid: `${MOUNTAIN_AUDIO_ROOT}/q4-opening-03-kid.mp3`,
  q4LowerKid: `${MOUNTAIN_AUDIO_ROOT}/q4-lower-kid.mp3`,
  q4LiftNova: `${MOUNTAIN_AUDIO_ROOT}/q4-lift-nova.mp3`,
  q4RevealNova: `${MOUNTAIN_AUDIO_ROOT}/q4-stage-03-nova.mp3`,
  q4FinalScout: `${MOUNTAIN_AUDIO_ROOT}/q4-stage-04-scout.mp3`,
  finale00Scout: `${MOUNTAIN_AUDIO_ROOT}/finale-00-scout.mp3`,
  finale01Scout: `${MOUNTAIN_AUDIO_ROOT}/finale-01-scout.mp3`,
  finale02Nova: `${MOUNTAIN_AUDIO_ROOT}/finale-02-nova.mp3`,
  finale03Kid: `${MOUNTAIN_AUDIO_ROOT}/finale-03-kid.mp3`,
  finale04Nova: `${MOUNTAIN_AUDIO_ROOT}/finale-04-nova.mp3`,
} as const;

const MOUNTAIN_QUESTS: readonly {
  id: MountainQuestId;
  title: string;
  concept: string;
  mission: string;
}[] = [
  {
    id: "signal-below-zero",
    title: "Chase the Lost Signal",
    concept: "Positive · zero · negative",
    mission: "Steer the rescue sled below Base Camp and secure the shelter’s fallen energy cell.",
  },
  {
    id: "cliff-checkpoints",
    title: "Cliff Checkpoints",
    concept: "Compare and order integers",
    mission: "Place rescue markers and work out which camp is higher.",
  },
  {
    id: "storm-moves",
    title: "Storm Moves",
    concept: "Add directed movements",
    mission: "Read the wind and track several up-and-down moves.",
  },
  {
    id: "rescue-winch",
    title: "Rescue Winch",
    concept: "Reverse and check a route",
    mission: "Lift the pod from −4 to the safe ledge at +2.",
  },
];

const OPENING_LINES: readonly {
  speaker: MountainSpeaker;
  line: string;
  voice: string;
}[] = [
  {
    speaker: "NOVA",
    line: "Pip! The ribbon goes on the shelter—not your tail!",
    voice: MOUNTAIN_AUDIO.q1Opening01Nova,
  },
  {
    speaker: "YOU",
    line: "He thinks he is the decoration.",
    voice: MOUNTAIN_AUDIO.q1Opening02Kid,
  },
  {
    speaker: "SCOUT",
    line: "The storm drained our energy cell. The shelter is getting cold.",
    voice: MOUNTAIN_AUDIO.q1Opening03Scout,
  },
  {
    speaker: "NOVA",
    line: "Hang on, Pip. We’ll get the warmth back.",
    voice: MOUNTAIN_AUDIO.q1Opening04Nova,
  },
  {
    speaker: "SCOUT",
    line: "Replacement cell launching from the Service Deck!",
    voice: MOUNTAIN_AUDIO.q1Opening05Scout,
  },
  {
    speaker: "YOU",
    line: "The pod went past us—and past Base Camp!",
    voice: MOUNTAIN_AUDIO.q1Opening06Kid,
  },
  {
    speaker: "SCOUT",
    line: "The cell is safe, but its signal is fading in the ravine.",
    voice: MOUNTAIN_AUDIO.q1Opening07Scout,
  },
  {
    speaker: "NOVA",
    line: "You steer the rescue sled. I’ll watch the signal!",
    voice: MOUNTAIN_AUDIO.q1Opening08Nova,
  },
];

const Q2_OPENING_LINES = [
  {
    speaker: "SCOUT" as const,
    line: "Four checkpoint lights are blinking out of order!",
    voice: MOUNTAIN_AUDIO.q2OpeningScout,
  },
  {
    speaker: "NOVA" as const,
    line: "Then the rescue team could climb the wrong way. Let’s rebuild the route.",
    voice: MOUNTAIN_AUDIO.q2OpeningNova,
  },
  {
    speaker: "YOU" as const,
    line: "I’ll read their height on the cliff.",
    voice: MOUNTAIN_AUDIO.q2OpeningKid,
  },
] as const;

const Q3_OPENING_LINES = [
  {
    speaker: "SCOUT" as const,
    line: "Wind burst incoming! The winch hook is swinging loose!",
    voice: MOUNTAIN_AUDIO.q3OpeningScout,
  },
  {
    speaker: "NOVA" as const,
    line: "Every gust swings it up or down. Track each move with me.",
    voice: MOUNTAIN_AUDIO.q3OpeningNova,
  },
  {
    speaker: "YOU" as const,
    line: "Call the gusts. I’ll follow the hook.",
    voice: MOUNTAIN_AUDIO.q3OpeningKid,
  },
] as const;

const Q4_OPENING_LINES = [
  {
    speaker: "SCOUT" as const,
    line: "Signal found—but the pod is still trapped at minus four!",
    voice: MOUNTAIN_AUDIO.q4OpeningScout,
  },
  {
    speaker: "NOVA" as const,
    line: "The safe ledge is at plus two. Our winch can reverse the whole fall.",
    voice: MOUNTAIN_AUDIO.q4OpeningNova,
  },
  {
    speaker: "YOU" as const,
    line: "Hook it on. I’ll bring the pod home.",
    voice: MOUNTAIN_AUDIO.q4OpeningKid,
  },
] as const;

const levels = Array.from(
  { length: MOUNTAIN_TOP - MOUNTAIN_BOTTOM + 1 },
  (_, index) => MOUNTAIN_TOP - index,
);

function integerPath(from: number, to: number) {
  const direction = to >= from ? 1 : -1;
  return Array.from(
    { length: Math.abs(to - from) + 1 },
    (_, index) => from + index * direction,
  );
}

function heroAsset(avatar: string) {
  if (avatar === "boy") return "/images/skatepark-night-run/hero-boy-active.png";
  if (avatar === "girl") return "/images/skatepark-night-run/hero-girl-active.png";
  return "/images/skatepark-night-run/hero-explorer-active.png";
}

function MountainQuestMap({
  state,
  heroName,
  avatar,
  onStart,
}: {
  state: MountainState;
  heroName: string;
  avatar: string;
  onStart: (quest: MountainQuestId) => void;
}) {
  const completed = new Set(state.completedQuests);

  return (
    <section className="mountain-quest-map" aria-label="Mountain Rescue quest map">
      <div className="mountain-map-sky" aria-hidden>
        <i className="mountain-map-ridge ridge-one" />
        <i className="mountain-map-ridge ridge-two" />
        <span className="mountain-map-signal" />
      </div>
      <header className="mountain-map-heading">
        <div>
          <p>GRADE 7 · INTEGERS</p>
          <h1>Mountain Rescue</h1>
          <span>
            One cliff. Four connected rescue quests. The pod comes home only
            after every route is understood.
          </span>
        </div>
        <div className="mountain-map-team" aria-label="Nova and your explorer are ready">
          <Image
            src="/images/skatepark-night-run/nova-curious.png"
            alt="Nova, the glowing star friend"
            width={116}
            height={116}
          />
          <Image
            src={heroAsset(avatar)}
            alt={`${heroName || "Your explorer"} ready for the mountain rescue`}
            width={104}
            height={130}
          />
        </div>
      </header>

      <div className="mountain-map-progress" aria-label={`${completed.size} of 4 quests complete`}>
        <div>
          {MOUNTAIN_QUEST_IDS.map((quest) => (
            <i key={quest} className={completed.has(quest) ? "complete" : ""} />
          ))}
        </div>
        <b>{completed.size}/4 rescue routes complete</b>
      </div>

      <div className="mountain-quest-grid">
        {MOUNTAIN_QUESTS.map((quest, index) => {
          const questComplete = completed.has(quest.id);
          const built = true;
          const unlocked = index === 0
            || completed.has(MOUNTAIN_QUESTS[index - 1].id);
          const current = state.activeQuest === quest.id && !questComplete;
          const playable = built && unlocked;

          return (
            <article
              key={quest.id}
              className={`mountain-quest-card${questComplete ? " complete" : ""}${current ? " current" : ""}${!playable ? " locked" : ""}`}
            >
              <div className="mountain-quest-card-top">
                <span>QUEST {index + 1}</span>
                <b>{questComplete ? "COMPLETE" : playable ? current ? "IN PROGRESS" : "READY" : unlocked ? "COMING NEXT" : "LOCKED"}</b>
              </div>
              <h2>{quest.title}</h2>
              <p className="mountain-quest-concept">{quest.concept}</p>
              <p>{quest.mission}</p>
              {playable ? (
                <button type="button" onClick={() => onStart(quest.id)}>
                  {questComplete ? "Play again" : current ? "Continue here" : "Start rescue"} →
                </button>
              ) : (
                <div className="mountain-quest-wait">
                  <strong>{unlocked ? "Nova is preparing this route" : `Finish Quest ${index} first`}</strong>
                  <small>{unlocked ? "It will continue on this same mountain." : "The next beacon lights after the earlier rescue."}</small>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <p className="mountain-map-note">
        {personalize("{hero}, every move is saved on this device.", heroName)}
      </p>
    </section>
  );
}

function MountainComicLine({
  speaker,
  line,
  onHear,
}: {
  speaker: MountainSpeaker;
  line: string;
  onHear: () => void;
}) {
  return (
    <div className={`mountain-comic-line speaker-${speaker.toLowerCase()}`} aria-live="polite">
      <small>{speaker}</small>
      <p>{line}</p>
      <button type="button" onClick={onHear} aria-label={`Hear ${speaker.toLowerCase()} speak`}>
        Hear line
      </button>
    </div>
  );
}

function MountainTeam({
  avatar,
  position,
  travelling,
}: {
  avatar: string;
  position: number;
  travelling: boolean;
}) {
  const top = `${((MOUNTAIN_TOP - position) / (MOUNTAIN_TOP - MOUNTAIN_BOTTOM)) * 100}%`;
  return (
    <div
      className={`mountain-travelling-team${travelling ? " travelling" : ""}`}
      style={{ top }}
      aria-hidden
    >
      <Image
        className="mountain-nova-character"
        src="/images/skatepark-night-run/nova-curious.png"
        alt=""
        width={104}
        height={104}
      />
      <Image
        className="mountain-kid-character"
        src={heroAsset(avatar)}
        alt=""
        width={92}
        height={116}
      />
    </div>
  );
}

function MountainPod({ label }: { label: string }) {
  return (
    <span className="mountain-real-pod">
      <Image
        src="/images/mountain-rescue/rescue-pod.png"
        alt=""
        width={132}
        height={100}
        priority
      />
      <strong>{label}</strong>
    </span>
  );
}

const Q1_SLED_START = 2;

function RescueSledTeam({
  avatar,
  position,
  travelling,
}: {
  avatar: string;
  position: number;
  travelling: boolean;
}) {
  const top = `${((MOUNTAIN_TOP - position) / (MOUNTAIN_TOP - MOUNTAIN_BOTTOM)) * 100}%`;
  return (
    <div
      className={`rescue-sled-team${travelling ? " travelling" : ""}`}
      style={{ top }}
      aria-hidden
    >
      <Image
        className="rescue-sled-art"
        src="/images/mountain-rescue/vertical-rescue-sled.png"
        alt=""
        width={210}
        height={315}
        priority
      />
      <Image
        className="rescue-sled-nova"
        src="/images/skatepark-night-run/nova-curious.png"
        alt=""
        width={72}
        height={72}
      />
      <Image
        className="rescue-sled-kid"
        src={heroAsset(avatar)}
        alt=""
        width={66}
        height={84}
      />
    </div>
  );
}

function SignalCliffStage({
  state,
  avatar,
  interactive,
  recapRunning = false,
  onMove,
  onBrush,
  onPull,
  onTarget,
}: {
  state: MountainState;
  avatar: string;
  interactive: boolean;
  recapRunning?: boolean;
  onMove: (position: number) => void;
  onBrush: () => void;
  onPull: () => void;
  onTarget: (target: "shelter" | "pod") => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const displayPosition = state.questStep === 2 ? MOUNTAIN_BEACON : state.position;
  const visited = new Set(state.flightPath);
  const signalDistance = Math.abs(displayPosition - MOUNTAIN_BEACON);
  const signalStrength = Math.max(.14, 1 - signalDistance / 7);
  const phase = state.questStep === 0
    ? "launch"
    : state.questStep === 1
      ? "search"
      : state.questStep === 2
        ? "recover"
        : "discover";

  function moveFromPointer(clientY: number) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = altitudeFromPointer(clientY, rect.top, rect.height);
    onMove(Math.max(MOUNTAIN_BEACON, Math.min(Q1_SLED_START, raw)));
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!interactive) return;
    draggingRef.current = true;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    moveFromPointer(event.clientY);
  }

  function drag(event: ReactPointerEvent<HTMLDivElement>) {
    if (draggingRef.current) moveFromPointer(event.clientY);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    moveFromPointer(event.clientY);
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div
      className={`signal-cliff-stage signal-rescue-stage phase-${phase}${state.signalFound ? " signal-found" : ""}${state.podRecovered ? " pod-recovered" : ""}${recapRunning ? " recap-running" : ""}`}
      style={{
        "--signal-strength": signalStrength,
        "--snow-left": `${100 - state.snowCleared}%`,
        "--recovery-progress": `${state.podRecoveryProgress}%`,
      } as React.CSSProperties}
    >
      <div className="signal-weather" aria-hidden>
        <i />
        <i />
        <span />
      </div>
      <div className="signal-ridge signal-ridge-far" aria-hidden />
      <div className="signal-ridge signal-ridge-near" aria-hidden />

      <div className="signal-stage-hud">
        <span>QUEST 1 · CHASE THE LOST SIGNAL</span>
        <b>{phase.toUpperCase()}</b>
      </div>

      <div className="signal-service-deck" aria-label="Service Deck at plus three">
        <span>SERVICE DECK</span>
        <b>+3</b>
      </div>
      <button
        type="button"
        className={`signal-story-location shelter-location${state.shelterFlagPlaced ? " flag-placed" : ""}`}
        disabled={state.questStep !== 3 || state.shelterFlagPlaced}
        onClick={() => onTarget("shelter")}
        aria-label="Ridge Shelter at plus two"
      >
        <span className="signal-shelter-building" aria-hidden>
          <i className="shelter-window" />
          <i className="shelter-heater" />
        </span>
        <span>RIDGE SHELTER</span>
        <b>+2</b>
        {state.shelterFlagPlaced && <em aria-hidden>⚑</em>}
      </button>
      <div className="signal-base-camp" aria-label="Base Camp at zero">
        <span>BASE CAMP</span>
        <b>0</b>
      </div>
      <Image
        className="signal-pip"
        src="/images/mountain-rescue/pip-snow-fox.png"
        alt="Pip waits beside the cold shelter"
        width={138}
        height={92}
      />

      <div
        ref={trackRef}
        className={`signal-altitude-track${interactive ? " interactive" : ""}`}
        aria-label="Straight rescue cable from Ridge Shelter down to the ravine"
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {levels.map((level) => (
          <span
            key={level}
            className={`signal-cable-pulse${level === 0 ? " zero" : ""}${visited.has(level) ? " visited" : ""}${level === displayPosition ? " current" : ""}`}
            style={{ top: `${((MOUNTAIN_TOP - level) / (MOUNTAIN_TOP - MOUNTAIN_BOTTOM)) * 100}%` }}
            aria-hidden
          />
        ))}
      </div>

      <RescueSledTeam
        avatar={avatar}
        position={displayPosition}
        travelling={dragging || (interactive && state.signalRunStarted)}
      />

      <div className="signal-tracker" aria-live="polite">
        <i aria-hidden />
        <span>{state.signalFound ? "SIGNAL FOUND" : "POD SIGNAL"}</span>
        <b>{state.signalFound ? "−4" : signalDistance <= 1 ? "VERY CLOSE" : signalDistance <= 3 ? "GETTING STRONGER" : "SEARCHING"}</b>
      </div>

      <button
        type="button"
        className={`signal-pod-site${state.signalFound ? " found" : ""}${state.podRecovered ? " recovered" : ""}${state.podFlagPlaced ? " flag-placed" : ""}`}
        disabled={state.questStep !== 3 || state.podFlagPlaced}
        onClick={() => onTarget("pod")}
        aria-label={
          state.podRecovered
            ? "Secured pod at minus four"
            : state.signalFound
              ? "Pod found under the snowdrift at minus four"
              : "Hidden pod signal at minus four"
        }
      >
        <span className="signal-snowdrift" aria-hidden />
        <MountainPod label="−4" />
        <span className="signal-pod-site-label">RAVINE</span>
        <b>−4</b>
        {state.podFlagPlaced && <em aria-hidden>⚑</em>}
      </button>

      {state.questStep === 2 && state.snowCleared < 100 && (
        <button
          type="button"
          className="signal-brush-zone"
          onPointerDown={onBrush}
          onPointerMove={(event) => {
            if (event.buttons === 1) onBrush();
          }}
        >
          <span aria-hidden>❄</span>
          Brush the snow
        </button>
      )}

      {state.questStep === 2 && state.snowCleared >= 100 && !state.podRecovered && (
        <button type="button" className="signal-recovery-strap pulse" onClick={onPull}>
          <b>PULL</b>
          <small>{state.podRecoveryProgress}%</small>
        </button>
      )}

      {state.questStep === 3 && state.routeRevealed && (
        <div className="signal-concept-labels" aria-label="Positive, zero and negative positions">
          <span className="positive">ABOVE BASE CAMP <b>POSITIVE +</b></span>
          <span className="zero">BASE CAMP <b>ZERO 0</b></span>
          <span className="negative">BELOW BASE CAMP <b>NEGATIVE −</b></span>
        </div>
      )}

      {state.questStep === 3 && state.routeRevealed && (
        <div className="signal-route-glow" aria-hidden>
          <span>+3</span><i /><span>0</span><i /><span>−4</span>
        </div>
      )}

      {state.questStep === 3 && state.shelterFlagPlaced && state.podFlagPlaced && (
        <div className="signal-dark-beacons" aria-label="The storm-darkened beacon route appears">
          <i /><i /><i /><i />
        </div>
      )}
    </div>
  );
}

function SignalOpening({
  state,
  onChange,
  avatar,
}: {
  state: MountainState;
  onChange: (patch: Partial<MountainState>) => void;
  avatar: string;
}) {
  return (
    <section className="mountain-story-opening" aria-label="Signal Below Zero story opening">
      <QuestStoryScene
        beats={OPENING_LINES}
        beat={state.openingBeat}
        onBeat={(openingBeat) => onChange({ openingBeat })}
        onStart={() => {
          // The very first playback attempt is the earliest real (non-render)
          // state write in the arrival act, so it's also where we mark the
          // quest as "started": activeQuest flips from null to
          // "signal-below-zero" and chapterMapOpen clears, so a deliberate
          // "Mountain quests" nav press mid-opening honors the map request
          // instead of being swallowed by the first-arrival gate.
          onChange({ activeQuest: "signal-below-zero", chapterMapOpen: false });
        }}
        onComplete={() => onChange({
          openingComplete: true,
          questStep: 0,
          activeQuest: "signal-below-zero",
          chapterMapOpen: false,
        })}
        className="mountain-opening-scene mountain-arrival-scene"
      >
        <div className="mountain-opening-ridge" aria-hidden />
        <div className="arrival-sky-tint" aria-hidden />
        <div className="arrival-snowfall" aria-hidden>
          <i /><i /><i /><i /><i /><i />
        </div>

        <div className="arrival-shelter" aria-hidden>
          <i className="arrival-shelter-window w1" />
          <i className="arrival-shelter-window w2" />
          <i className="arrival-shelter-heater" />
        </div>
        <div className="arrival-ribbon" aria-hidden />
        <Image
          className="arrival-pip"
          src="/images/mountain-rescue/pip-snow-fox.png"
          alt="Pip the snow fox plays with a ribbon outside the shelter"
          width={116}
          height={78}
        />

        <div className="arrival-service-deck" aria-hidden>
          <span>SERVICE DECK</span>
          <b>+3</b>
        </div>
        <div className="arrival-zero-line" aria-hidden>
          <span>BASE CAMP · 0</span>
        </div>
        <div className="arrival-pod" aria-hidden>
          <i className="arrival-pod-trail" />
          <MountainPod label="+3" />
        </div>
        <div className="arrival-tracker" aria-hidden>
          <i />
          <span>POD SIGNAL</span>
        </div>

        <div className="arrival-sled" aria-hidden>
          <Image
            className="arrival-sled-art"
            src="/images/mountain-rescue/vertical-rescue-sled.png"
            alt=""
            width={150}
            height={225}
          />
          <Image
            className="arrival-sled-nova"
            src="/images/skatepark-night-run/nova-curious.png"
            alt=""
            width={80}
            height={80}
          />
          <Image
            className="arrival-sled-kid"
            src={heroAsset(avatar)}
            alt=""
            width={72}
            height={92}
          />
        </div>
      </QuestStoryScene>
    </section>
  );
}

function ConnectedMountainOpening({
  label,
  lines,
  beat,
  onBeat,
  onComplete,
  avatar,
  podLabel,
  traveller = "pod",
}: {
  label: string;
  lines: readonly { speaker: MountainSpeaker; line: string; voice: string }[];
  beat: number;
  onBeat: (beat: number) => void;
  onComplete: () => void;
  avatar: string;
  podLabel: string;
  traveller?: MountainTraveller;
}) {
  return (
    <section className="mountain-story-opening" aria-label={`${label} story opening`}>
      <QuestStoryScene
        beats={lines}
        beat={beat}
        onBeat={onBeat}
        onComplete={onComplete}
        className="mountain-opening-scene"
      >
        <div className="mountain-opening-ridge" aria-hidden />
        <div className="mountain-opening-pod" aria-hidden>
          {traveller === "hook"
            ? (
              <span className="mountain-real-pod mountain-opening-hook">
                <span className="mountain-hook-glyph">⚓</span>
                <strong>{podLabel}</strong>
              </span>
            )
            : <MountainPod label={podLabel} />}
        </div>
        <Image
          className="mountain-opening-nova"
          src="/images/skatepark-night-run/nova-curious.png"
          alt={`Nova begins ${label}`}
          width={190}
          height={190}
          priority
        />
        <Image
          className="mountain-opening-kid"
          src={heroAsset(avatar)}
          alt={`Your explorer joins ${label}`}
          width={150}
          height={190}
          priority
        />
      </QuestStoryScene>
    </section>
  );
}

function MountainRouteStage({
  title,
  questNumber,
  questStep,
  position,
  trail,
  avatar,
  markers,
  travelling,
  interactive,
  onMove,
  onMarker,
  conceptLabels,
  routeRunning = false,
  traveller = "pod",
}: {
  title: string;
  questNumber: number;
  questStep: number;
  position: number;
  trail: readonly number[];
  avatar: string;
  markers: readonly {
    value: number;
    label: string;
    active?: boolean;
    complete?: boolean;
    disabled?: boolean;
  }[];
  travelling: boolean;
  interactive: boolean;
  onMove?: (position: number) => void;
  onMarker?: (position: number) => void;
  conceptLabels?: boolean;
  routeRunning?: boolean;
  traveller?: MountainTraveller;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);
  const visited = new Set(trail);

  function moveFromPointer(clientY: number) {
    if (!onMove) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    onMove(altitudeFromPointer(clientY, rect.top, rect.height));
  }

  function begin(event: ReactPointerEvent<HTMLDivElement>) {
    if (!interactive || !onMove) return;
    draggingRef.current = true;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    moveFromPointer(event.clientY);
  }

  function move(event: ReactPointerEvent<HTMLDivElement>) {
    if (draggingRef.current) moveFromPointer(event.clientY);
  }

  function end(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    moveFromPointer(event.clientY);
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className={`signal-cliff-stage mountain-route-stage mountain-route-quest-${questNumber}${routeRunning ? " route-running" : ""}`}>
      <div className="signal-weather" aria-hidden><i /><i /><span /></div>
      <div className="signal-ridge signal-ridge-far" aria-hidden />
      <div className="signal-ridge signal-ridge-near" aria-hidden />
      <div className="signal-stage-hud">
        <span>QUEST {questNumber} · {title.toUpperCase()}</span>
        <b>{questStep + 1}/4</b>
      </div>
      <div className="signal-base-camp" aria-label="Base camp is zero">
        <span>BASE CAMP</span><b>ZERO</b>
      </div>

      {markers.map((marker) => (
        <button
          key={`${marker.value}-${marker.label}`}
          type="button"
          className={`mountain-route-marker${marker.active ? " active" : ""}${marker.complete ? " complete" : ""}`}
          style={{ top: `${13 + ((MOUNTAIN_TOP - marker.value) / (MOUNTAIN_TOP - MOUNTAIN_BOTTOM)) * 79}%` }}
          disabled={marker.disabled || !onMarker}
          onClick={() => onMarker?.(marker.value)}
          aria-label={`${marker.label} at ${formatAltitude(marker.value)}`}
        >
          <span>{marker.label}</span>
          <b>{formatAltitude(marker.value)}</b>
        </button>
      ))}

      <div
        ref={trackRef}
        className={`signal-altitude-track${interactive ? " interactive" : ""}`}
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        aria-label="Mountain integer route from plus eight to minus eight"
      >
        {levels.map((level) => (
          <span
            key={level}
            className={`signal-altitude-tick${level === 0 ? " zero" : ""}${visited.has(level) ? " visited" : ""}${level === position ? " current" : ""}`}
            style={{ top: `${((MOUNTAIN_TOP - level) / (MOUNTAIN_TOP - MOUNTAIN_BOTTOM)) * 100}%` }}
          >
            <b>{formatAltitude(level)}</b>
          </span>
        ))}
        <button
          className={`signal-pod-control${dragging ? " dragging" : ""}`}
          type="button"
          disabled={!interactive}
          style={{ top: `${((MOUNTAIN_TOP - position) / (MOUNTAIN_TOP - MOUNTAIN_BOTTOM)) * 100}%` }}
          aria-label={interactive
            ? `Drag the rescue ${traveller}. It is at ${formatAltitude(position)}`
            : `Rescue ${traveller} at ${formatAltitude(position)}`}
        >
          {traveller === "hook"
            ? <span className="mountain-hook-glyph" aria-hidden>⚓</span>
            : <MountainPod label={formatAltitude(position)} />}
        </button>
      </div>

      <MountainTeam
        avatar={avatar}
        position={position}
        travelling={travelling || routeRunning}
      />

      {conceptLabels && (
        <div className="signal-concept-labels" aria-label="Integer height meaning">
          <span className="positive">HIGHER ON CLIFF <b>GREATER</b></span>
          <span className="zero">REFERENCE <b>ZERO</b></span>
          <span className="negative">LOWER ON CLIFF <b>SMALLER</b></span>
        </div>
      )}
    </div>
  );
}

function SignalBelowZeroQuest({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  playVoice,
  onComplete,
  onReplayComplete,
}: {
  state: MountainState;
  onChange: (patch: Partial<MountainState>) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  playVoice: (source: string) => void;
  onComplete: () => void;
  onReplayComplete: () => void;
}) {
  const [recapRunning, setRecapRunning] = useState(false);
  const recapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactive = state.questStep === 1 && !state.signalFound && !recapRunning;

  // podRecoveryProgress is a dep purely to restart the 6s idle timer on every
  // pull; the cleanup below hides the hint immediately whenever any of these
  // values change, i.e. the instant the player interacts again.
  const [stepHint, setStepHint] = useState<"brush" | "strap" | null>(null);
  useEffect(() => {
    if (state.questStep !== 2 || state.podRecovered) return;
    const kind = state.snowCleared < 100 ? "brush" : "strap";
    const timer = setTimeout(() => setStepHint(kind), 6000);
    return () => {
      clearTimeout(timer);
      setStepHint(null);
    };
  }, [state.questStep, state.snowCleared, state.podRecoveryProgress, state.podRecovered]);

  useEffect(() => () => {
    if (recapTimerRef.current) clearTimeout(recapTimerRef.current);
  }, []);

  function movePod(nextPosition: number) {
    if (!interactive || nextPosition === state.position) return;
    const previous = state.position;
    const signalFound = nextPosition === MOUNTAIN_BEACON;
    onChange({
      position: nextPosition,
      signalRunStarted: true,
      signalFound,
      flightPath: appendAltitudeTrail(state.flightPath, previous, nextPosition),
    });
    sound.play(signalFound ? "success" : "tap");
    if (nextPosition === 0 && previous !== 0) playVoice(MOUNTAIN_AUDIO.q1ZeroKid);
    if (signalFound) playVoice(MOUNTAIN_AUDIO.q1FoundKid);
  }

  function nudge(amount: number) {
    movePod(Math.max(MOUNTAIN_BEACON, Math.min(MOUNTAIN_START, state.position + amount)));
  }

  function playRecap() {
    if (recapRunning) return;
    if (recapTimerRef.current) clearTimeout(recapTimerRef.current);
    playVoice(MOUNTAIN_AUDIO.q1RevealNova);
    sound.play("tap");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // No pose/position/trace to play under reduced motion, so the concept
      // payoff (route glow + positive/zero/negative overlay) reveals right
      // away instead of gating on an animation that will never run.
      onChange({ recapPlayed: true, routeRevealed: true });
      sound.play("success");
      return;
    }
    setRecapRunning(true);
    recapTimerRef.current = setTimeout(() => {
      setRecapRunning(false);
      onChange({ recapPlayed: true, routeRevealed: true });
      sound.play("success");
    }, 3600);
  }

  function brushSnow() {
    if (state.questStep !== 2 || state.snowCleared >= 100) return;
    const snowCleared = Math.min(100, state.snowCleared + 20);
    sound.play("tap");
    onChange({ snowCleared });
  }

  // Story language is "secure", not "recover": the pod stays at −4 until the
  // Quest 4 winch lifts it. State field names predate this and are kept for
  // save compatibility.
  function pullPod() {
    if (state.questStep !== 2 || state.snowCleared < 100 || state.podRecovered) return;
    const podRecoveryProgress = Math.min(100, state.podRecoveryProgress + 25);
    const podRecovered = podRecoveryProgress === 100;
    sound.play(podRecovered ? "success" : "tap");
    if (podRecovered) playVoice(MOUNTAIN_AUDIO.q1RecoveredKid);
    onChange({ podRecoveryProgress, podRecovered });
  }

  function placeFlag(target: "shelter" | "pod") {
    if (state.questStep !== 3) return;
    sound.play("success");
    if (target === "shelter") onChange({ shelterFlagPlaced: true });
    else onChange({ podFlagPlaced: true });
  }

  const dialogue = state.questStep === 0
    ? "The pod crossed Base Camp and vanished below it. Pull the safety latch—we’re going after it."
    : state.questStep === 1
      ? state.signalFound
        ? "Found it—four levels below zero!"
        : state.position === 0
          ? "That gold line is zero—our halfway marker."
          : state.position < 0
            ? "We crossed zero. The pod is now below base camp."
            : "Stay with it. Pull the pod down toward base camp."
      : state.questStep === 2
        ? state.podRecovered
          ? "We secured the cell right here. Now look at where every part of the search happened."
          : state.snowCleared >= 100
            ? "There it is! Pull the rescue strap with us."
            : "The signal is under this drift. Brush the snow away."
        : state.recapPlayed
          ? "Our pod moved seven levels: plus three, through zero, to minus four."
          : "Replay the rescue path. Watch where the sign changes.";

  const speaker: MountainSpeaker = (state.questStep === 1 && (state.signalFound || state.position === 0))
    || (state.questStep === 2 && state.podRecovered)
    ? "YOU"
    : "NOVA";

  return (
    <section className="signal-below-zero-quest" aria-label="Signal Below Zero quest">
      <SignalCliffStage
        state={state}
        avatar={avatar}
        interactive={interactive}
        recapRunning={recapRunning}
        onMove={movePod}
        onBrush={brushSnow}
        onPull={pullPod}
        onTarget={placeFlag}
      />

      <div className="signal-action-deck">
        <MountainComicLine
          speaker={speaker}
          line={dialogue}
          onHear={() => playVoice(
            state.questStep === 0
              ? MOUNTAIN_AUDIO.q1LatchNova
              : state.questStep === 1
                ? state.signalFound
                  ? MOUNTAIN_AUDIO.q1FoundKid
                  : state.position === 0
                    ? MOUNTAIN_AUDIO.q1ZeroKid
                    : state.position < 0
                      ? MOUNTAIN_AUDIO.q1BelowNova
                      : MOUNTAIN_AUDIO.q1SignalNova
                : state.questStep === 2
                  ? state.podRecovered
                    ? MOUNTAIN_AUDIO.q1RecoveredKid
                    : state.snowCleared < 100
                      ? MOUNTAIN_AUDIO.q1BrushNova
                      : MOUNTAIN_AUDIO.q1StrapNova
                  : MOUNTAIN_AUDIO.q1FlagNova,
          )}
        />

        {state.questStep === 0 && (
          <div className="signal-prediction">
            <div>
              <small>YOUR FIRST MOVE</small>
              <h2>Clip the sled to the straight rescue cable.</h2>
              <p>The tracker gets brighter as you move toward the pod.</p>
            </div>
            <button
              className="signal-primary"
              type="button"
              onClick={() => {
                sound.play("success");
                playVoice(MOUNTAIN_AUDIO.q1LatchNova);
                onChange({
                  safetyLatchPulled: true,
                  questStep: 1,
                  position: MOUNTAIN_START,
                  flightPath: [MOUNTAIN_START],
                  signalRunStarted: false,
                  signalFound: false,
                });
              }}
            >
              Pull the glowing safety latch →
            </button>
          </div>
        )}

        {state.questStep === 1 && (
          <div className="signal-move-controls">
            <div>
              <small>YOUR MOVE</small>
              <h2>Move the pod from +3 to the hidden beacon.</h2>
              <p>Drag the real pod down the cliff, or move one level at a time.</p>
            </div>
            <div className="signal-nudge-row">
              <button type="button" onClick={() => nudge(-1)} disabled={state.signalFound}>Down 1</button>
              <b>{formatAltitude(state.position)}</b>
              <button type="button" onClick={() => nudge(1)} disabled={state.signalFound || state.position >= MOUNTAIN_START}>Up 1</button>
            </div>
            <button
              className="signal-primary"
              type="button"
              disabled={!state.signalFound}
              onClick={() => {
                playVoice(MOUNTAIN_AUDIO.q1FoundKid);
                onChange({ questStep: 2 });
              }}
            >
              Secure the pod →
            </button>
          </div>
        )}

        {state.questStep === 2 && (
          <div className={state.podRecovered ? "signal-concept-reveal" : "signal-prediction"}>
            <div>
              <small>{state.podRecovered ? "NOVA NAMES WHAT YOU FOUND" : "SECURE THE REAL POD"}</small>
              <h2>{state.podRecovered ? "The cliff continues on both sides of zero." : state.snowCleared < 100 ? "Brush away the snowdrift." : "Pull the rescue strap together."}</h2>
              <p>{state.podRecovered
                ? <>Positions above zero are <b>positive</b>. Positions below zero are <b>negative</b>. Zero is the reference point between them.</>
                : state.snowCleared < 100
                  ? `${state.snowCleared}% cleared`
                  : `${state.podRecoveryProgress}% secured`}</p>
            </div>
            {stepHint === "brush" && <p className="signal-hint">Brush the snowdrift near the ravine to clear it.</p>}
            {stepHint === "strap" && <p className="signal-hint">Four pulls and the cell is free.</p>}
            {!state.podRecovered && state.snowCleared < 100 && (
              <button className="signal-primary" type="button" onClick={brushSnow}>
                Brush the snow →
              </button>
            )}
            {!state.podRecovered && state.snowCleared >= 100 && (
              <button className="signal-primary" type="button" onClick={pullPod}>
                Pull the rescue strap together →
              </button>
            )}
            {state.podRecovered && <>
              <div className="signal-number-strip" aria-label="Positive three through zero to negative four">
                <span className="positive">+3</span><i /><span className="zero">0</span><i /><span className="negative">−4</span>
              </div>
              <button className="signal-primary" type="button" onClick={() => { playVoice(MOUNTAIN_AUDIO.q1FlagNova); onChange({ questStep: 3 }); }}>
                Mark the shelter and pod →
              </button>
            </>}
          </div>
        )}

        {state.questStep === 3 && (
          <div className="signal-recap">
            <div>
              <small>MARK THE REAL LOCATIONS</small>
              <h2>Place both rescue flags, then replay the route.</h2>
              <p>{state.shelterFlagPlaced && state.podFlagPlaced ? "Both locations are marked. The route is ready." : "Tap Ridge Shelter at +2 and the secured pod at −4."}</p>
            </div>
            <button
              className="signal-replay-button"
              type="button"
              disabled={recapRunning || !state.shelterFlagPlaced || !state.podFlagPlaced}
              onClick={playRecap}
            >
              {recapRunning ? "Following +3 → 0 → −4…" : state.recapPlayed ? "Play route again" : "Play the rescue route"}
            </button>
            {state.recapPlayed && (
              <div className="signal-route-proof" aria-live="polite">
                <span>START +3</span>
                <b>move down 7</b>
                <strong>3 − 7 = −4</strong>
              </div>
            )}
            <button
              className="signal-primary"
              type="button"
              disabled={!state.recapPlayed}
              onClick={replay ? onReplayComplete : onComplete}
            >
              {replay ? "Return to my journal →" : personalize("Quest complete, {hero} →", heroName)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const CHECKPOINT_ROUTE = [-5, -1, 2, 6] as const;

function CliffCheckpointsQuest({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  playVoice,
  onComplete,
  onReplayComplete,
}: {
  state: MountainState;
  onChange: (patch: Partial<MountainState>) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  playVoice: (source: string) => void;
  onComplete: () => void;
  onReplayComplete: () => void;
}) {
  const [routeRunning, setRouteRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ordered = state.checkpointOrder;
  const displayPosition = state.questStep === 0
    ? state.higherCheckpoint ?? 0
    : ordered.at(-1) ?? 0;

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function chooseHigher(value: number) {
    sound.play(value === 2 ? "success" : "tap");
    onChange({
      higherCheckpoint: value,
      checkpointRunTested: value === 2,
    });
    playVoice(MOUNTAIN_AUDIO.q2CompareNova);
  }

  function visitCheckpoint(value: number) {
    const expected = CHECKPOINT_ROUTE[ordered.length];
    if (value !== expected) {
      sound.play("tap");
      return;
    }
    const nextOrder = [...ordered, value];
    sound.play(nextOrder.length === CHECKPOINT_ROUTE.length ? "success" : "tap");
    onChange({ checkpointOrder: nextOrder });
    if (nextOrder.length === 1) playVoice(MOUNTAIN_AUDIO.q2OrderKid);
  }

  function playOrderRoute() {
    if (routeRunning) return;
    playVoice(MOUNTAIN_AUDIO.q2RecapScout);
    sound.play("tap");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      onChange({ orderRunTested: true });
      return;
    }
    setRouteRunning(true);
    timerRef.current = setTimeout(() => {
      setRouteRunning(false);
      onChange({ orderRunTested: true });
      sound.play("success");
    }, 3600);
  }

  const markers = state.questStep === 0
    ? [
        { value: -3, label: "LOW CAMP", active: state.higherCheckpoint === -3 },
        { value: 2, label: "RIDGE CAMP", active: state.higherCheckpoint === 2, complete: state.checkpointRunTested },
      ]
    : CHECKPOINT_ROUTE.map((value, index) => ({
        value,
        label: ["VALLEY", "CAVE", "LEDGE", "SUMMIT"][index],
        active: ordered.at(-1) === value,
        complete: ordered.includes(value),
      }));

  const dialogue = state.questStep === 0
    ? state.checkpointRunTested
      ? "Ridge Camp is higher on the cliff, so plus two is greater than minus three."
      : state.higherCheckpoint === -3
        ? "The pod flew lower. Look for the marker that sits higher on the cliff."
        : "Two teams called at once. Tap the checkpoint that is higher."
    : state.questStep === 1
      ? ordered.length === CHECKPOINT_ROUTE.length
        ? "Route rebuilt—valley to summit, without one backward climb!"
        : `Next, find checkpoint ${ordered.length + 1}: the lowest one still waiting.`
      : state.questStep === 2
        ? "On a vertical number path, higher numbers are greater and lower numbers are smaller."
        : state.orderRunTested
          ? "The rescue order climbs: minus five, minus one, plus two, plus six."
          : "Replay the pod’s climb from the lowest checkpoint to the highest.";

  return (
    <section className="signal-below-zero-quest mountain-connected-quest" aria-label="Cliff Checkpoints quest">
      <MountainRouteStage
        title="Cliff Checkpoints"
        questNumber={2}
        questStep={state.questStep}
        position={displayPosition}
        trail={state.questStep === 0
          ? integerPath(0, displayPosition)
          : ordered.length > 0
            ? integerPath(CHECKPOINT_ROUTE[0], displayPosition)
            : [0]}
        avatar={avatar}
        markers={markers}
        travelling={state.higherCheckpoint !== null || ordered.length > 0}
        interactive={false}
        onMarker={state.questStep === 0
          ? chooseHigher
          : state.questStep === 1
            ? visitCheckpoint
            : undefined}
        conceptLabels={state.questStep >= 2}
        routeRunning={routeRunning}
      />
      <div className="signal-action-deck">
        <MountainComicLine
          speaker={state.questStep === 1 && ordered.length === CHECKPOINT_ROUTE.length ? "YOU" : "NOVA"}
          line={dialogue}
          onHear={() => playVoice(
            state.questStep === 0
              ? MOUNTAIN_AUDIO.q2CompareNova
              : state.questStep === 1
                ? MOUNTAIN_AUDIO.q2OrderKid
                : state.questStep === 2
                  ? MOUNTAIN_AUDIO.q2RevealNova
                  : MOUNTAIN_AUDIO.q2RecapScout,
          )}
        />

        {state.questStep === 0 && (
          <div className="mountain-quest-actions">
            <div>
              <small>READ THE CLIFF</small>
              <h2>Which rescue camp is higher?</h2>
              <p>Tap a camp inside the world. The pod and team will travel there.</p>
            </div>
            <button
              className="signal-primary"
              type="button"
              disabled={!state.checkpointRunTested}
              onClick={() => onChange({ questStep: 1, checkpointOrder: [] })}
            >
              Build the full route →
            </button>
          </div>
        )}

        {state.questStep === 1 && (
          <div className="mountain-quest-actions">
            <div>
              <small>YOUR RESCUE ROUTE</small>
              <h2>Visit every checkpoint from lowest to highest.</h2>
              <p>Tap the markers in climbing order. The pod moves after every choice.</p>
            </div>
            <div className="mountain-route-progress" aria-label={`${ordered.length} of 4 checkpoints ordered`}>
              {CHECKPOINT_ROUTE.map((value, index) => (
                <span key={value} className={index < ordered.length ? "complete" : ""}>
                  {index < ordered.length ? formatAltitude(ordered[index]) : "?"}
                </span>
              ))}
            </div>
            <button
              className="signal-primary"
              type="button"
              disabled={ordered.length !== CHECKPOINT_ROUTE.length}
              onClick={() => {
                playVoice(MOUNTAIN_AUDIO.q2RevealNova);
                onChange({ questStep: 2 });
              }}
            >
              What makes the order work? →
            </button>
          </div>
        )}

        {state.questStep === 2 && (
          <div className="mountain-quest-actions">
            <div>
              <small>NOVA NAMES THE PATTERN</small>
              <h2>Higher on the number path means greater.</h2>
              <p>Negative numbers still have an order. The one closer to zero sits higher.</p>
            </div>
            <div className="mountain-order-proof">
              <span>−5</span><b>&lt;</b><span>−1</span><b>&lt;</b><span>+2</span><b>&lt;</b><span>+6</span>
            </div>
            <button className="signal-primary" type="button" onClick={() => onChange({ questStep: 3 })}>
              Replay the checkpoint climb →
            </button>
          </div>
        )}

        {state.questStep === 3 && (
          <div className="mountain-quest-actions">
            <div>
              <small>VISIBLE RECAP</small>
              <h2>Watch the pod climb in the order you built.</h2>
              <p>The route moves first. The comparison strip confirms it afterward.</p>
            </div>
            <button className="signal-replay-button" type="button" disabled={routeRunning} onClick={playOrderRoute}>
              {routeRunning ? "Climbing −5 → −1 → +2 → +6…" : state.orderRunTested ? "Play climb again" : "Run the checkpoint route"}
            </button>
            {state.orderRunTested && (
              <div className="signal-route-proof">
                <span>LOWEST −5</span><b>climb through every marker</b><strong>HIGHEST +6</strong>
              </div>
            )}
            <button
              className="signal-primary"
              type="button"
              disabled={!state.orderRunTested}
              onClick={replay ? onReplayComplete : onComplete}
            >
              {replay ? "Return to my journal →" : personalize("Quest complete, {hero} →", heroName)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const PRIMARY_GUSTS = [
  { delta: 5, label: "UP 5" },
  { delta: -4, label: "DOWN 4" },
  { delta: 2, label: "UP 2" },
] as const;
const TRANSFER_GUSTS = [
  { delta: -3, label: "DOWN 3" },
  { delta: 4, label: "UP 4" },
] as const;

function StormMovesQuest({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  playVoice,
  onComplete,
  onReplayComplete,
}: {
  state: MountainState;
  onChange: (patch: Partial<MountainState>) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  playVoice: (source: string) => void;
  onComplete: () => void;
  onReplayComplete: () => void;
}) {
  const [routeRunning, setRouteRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function rideGust() {
    if (state.questStep === 0) {
      const gust = PRIMARY_GUSTS[state.gustIndex];
      if (!gust) return;
      const nextPosition = state.stormPosition + gust.delta;
      const nextIndex = state.gustIndex + 1;
      const runComplete = nextIndex === PRIMARY_GUSTS.length;
      sound.play(runComplete ? "success" : "tap");
      onChange({
        stormPosition: nextPosition,
        stormTrail: appendAltitudeTrail(state.stormTrail, state.stormPosition, nextPosition),
        gustIndex: nextIndex,
        stormRunComplete: runComplete,
      });
      // q3MoveNova is the run's completion line ("We rode every gust...."),
      // so it must only play on the gust that finishes the run — not on
      // every gust, or the child hears a false position mid-run.
      if (runComplete) playVoice(MOUNTAIN_AUDIO.q3MoveNova);
      return;
    }
    const gust = TRANSFER_GUSTS[state.transferGustIndex];
    if (!gust) return;
    const nextPosition = state.stormPosition + gust.delta;
    const nextIndex = state.transferGustIndex + 1;
    const transferComplete = nextIndex === TRANSFER_GUSTS.length;
    sound.play(transferComplete ? "success" : "tap");
    onChange({
      stormPosition: nextPosition,
      stormTrail: appendAltitudeTrail(state.stormTrail, state.stormPosition, nextPosition),
      transferGustIndex: nextIndex,
      stormTransferComplete: transferComplete,
    });
    // Same rule for the transfer run's completion line.
    if (transferComplete) playVoice(MOUNTAIN_AUDIO.q3TransferKid);
  }

  function playStormRecap() {
    if (routeRunning) return;
    playVoice(MOUNTAIN_AUDIO.q3RecapScout);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      onChange({ stormRecapPlayed: true });
      return;
    }
    setRouteRunning(true);
    timerRef.current = setTimeout(() => {
      setRouteRunning(false);
      onChange({ stormRecapPlayed: true });
      sound.play("success");
    }, 3600);
  }

  const currentGust = state.questStep === 0
    ? PRIMARY_GUSTS[state.gustIndex]
    : TRANSFER_GUSTS[state.transferGustIndex];
  const dialogue = state.questStep === 0
    ? state.stormRunComplete
      ? "We rode every gust. The hook finished at plus one."
      : `Hook at ${formatAltitude(state.stormPosition)}. Next gust: ${currentGust?.label.toLowerCase()}.`
    : state.questStep === 1
      ? state.stormTransferComplete
        ? "New storm, same idea—the final position changed with every move."
        : `Transfer run at ${formatAltitude(state.stormPosition)}. Next gust: ${currentGust?.label.toLowerCase()}.`
      : state.questStep === 2
        ? "Adding a positive move swings the hook up. Adding a negative move swings it down."
        : state.stormRecapPlayed
          ? "The whole storm route is now one movement story."
          : "Replay each gust and watch the running position change.";

  return (
    <section className="signal-below-zero-quest mountain-connected-quest" aria-label="Storm Moves quest">
      <MountainRouteStage
        title="Storm Moves"
        questNumber={3}
        questStep={state.questStep}
        position={state.stormPosition}
        trail={state.stormTrail}
        avatar={avatar}
        markers={[
          { value: -2, label: "HOOK START", complete: state.stormTrail.includes(-2) },
          { value: 1, label: "HOOK NOW", active: state.stormPosition === 1 },
        ]}
        travelling={state.gustIndex > 0 || state.transferGustIndex > 0}
        interactive={false}
        conceptLabels={state.questStep >= 2}
        routeRunning={routeRunning}
        traveller="hook"
      />
      <div className="signal-action-deck">
        <MountainComicLine
          speaker={state.questStep === 1 ? "YOU" : "NOVA"}
          line={dialogue}
          onHear={() => playVoice(
            state.questStep === 0
              ? MOUNTAIN_AUDIO.q3MoveNova
              : state.questStep === 1
                ? MOUNTAIN_AUDIO.q3TransferKid
                : state.questStep === 2
                  ? MOUNTAIN_AUDIO.q3RevealNova
                  : MOUNTAIN_AUDIO.q3RecapScout,
          )}
        />

        {(state.questStep === 0 || state.questStep === 1) && (
          <div className="mountain-quest-actions">
            <div>
              <small>{state.questStep === 0 ? "FOLLOW THE FIRST STORM" : "TRY A CHANGED STORM"}</small>
              <h2>{currentGust ? `The next gust pushes ${currentGust.label.toLowerCase()}.` : "Every gust is tracked."}</h2>
              <p>Release one gust at a time. The hook and team move before the next gust appears.</p>
            </div>
            {currentGust && (
              <button className={`mountain-gust-button${currentGust.delta > 0 ? " up" : " down"}`} type="button" onClick={rideGust}>
                <span>{currentGust.delta > 0 ? "↑" : "↓"}</span>
                <b>{currentGust.label}</b>
                <small>Release gust</small>
              </button>
            )}
            <div className="mountain-route-progress">
              {(state.questStep === 0 ? PRIMARY_GUSTS : TRANSFER_GUSTS).map((gust, index) => (
                <span
                  key={gust.label}
                  className={index < (state.questStep === 0 ? state.gustIndex : state.transferGustIndex) ? "complete" : ""}
                >
                  {gust.label}
                </span>
              ))}
            </div>
            <button
              className="signal-primary"
              type="button"
              disabled={state.questStep === 0 ? !state.stormRunComplete : !state.stormTransferComplete}
              onClick={() => {
                if (state.questStep === 0) {
                  onChange({
                    questStep: 1,
                    stormPosition: 1,
                    stormTrail: [1],
                    transferGustIndex: 0,
                    stormTransferComplete: false,
                  });
                } else {
                  playVoice(MOUNTAIN_AUDIO.q3RevealNova);
                  onChange({
                    questStep: 2,
                    stormPosition: 1,
                    stormTrail: integerPath(-2, 1),
                  });
                }
              }}
            >
              {state.questStep === 0 ? "Try a changed storm →" : "Name the movement pattern →"}
            </button>
          </div>
        )}

        {state.questStep === 2 && (
          <div className="mountain-quest-actions">
            <div>
              <small>NOVA NAMES THE MOVES</small>
              <h2>Integer addition keeps a running position.</h2>
              <p>Up is a positive movement. Down is a negative movement. The hook’s final height includes every gust.</p>
            </div>
            <div className="mountain-storm-proof">
              <span>−2</span><b>+5</b><b>−4</b><b>+2</b><strong>= +1</strong>
            </div>
            <button className="signal-primary" type="button" onClick={() => onChange({ questStep: 3 })}>
              Replay the storm route →
            </button>
          </div>
        )}

        {state.questStep === 3 && (
          <div className="mountain-quest-actions">
            <div>
              <small>VISIBLE RECAP</small>
              <h2>Watch the running position survive every gust.</h2>
              <p>The hook never teleports to an answer—the whole route stays visible.</p>
            </div>
            <button className="signal-replay-button" type="button" disabled={routeRunning} onClick={playStormRecap}>
              {routeRunning ? "Riding up 5, down 4, up 2…" : state.stormRecapPlayed ? "Play storm again" : "Run the full storm"}
            </button>
            {state.stormRecapPlayed && (
              <div className="signal-route-proof">
                <span>START −2</span><b>+5 −4 +2</b><strong>FINISH +1</strong>
              </div>
            )}
            <button
              className="signal-primary"
              type="button"
              disabled={!state.stormRecapPlayed}
              onClick={replay ? onReplayComplete : onComplete}
            >
              {replay ? "Return to my journal →" : personalize("Quest complete, {hero} →", heroName)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function RescueWinchQuest({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  playVoice,
  onEnterFinale,
  onReplayComplete,
}: {
  state: MountainState;
  onChange: (patch: Partial<MountainState>) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  playVoice: (source: string) => void;
  onEnterFinale: () => void;
  onReplayComplete: () => void;
}) {
  const [routeRunning, setRouteRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Step 0 is the lowering leg (hook +2 → −4, tracked by winchPosition).
  // Steps 1-3 are all after the lift completed, so they must keep showing
  // the pod resting at +2 (reversePosition) — never re-descend to winchPosition.
  const position = state.questStep === 0 ? state.winchPosition : state.reversePosition;
  const interactive = (state.questStep === 0 && !state.winchReached)
    || (state.questStep === 1 && !state.reverseComplete);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function moveWinch(value: number) {
    if (!interactive) return;
    if (state.questStep === 0) {
      const next = Math.max(-4, Math.min(2, value));
      const reached = next === -4;
      onChange({
        winchPosition: next,
        winchRunStarted: true,
        winchReached: reached,
      });
      sound.play(reached ? "success" : "tap");
      if (reached) playVoice(MOUNTAIN_AUDIO.q4LowerKid);
      return;
    }
    const next = Math.max(-4, Math.min(2, value));
    const complete = next === 2;
    onChange({
      reversePosition: next,
      reverseRunStarted: true,
      reverseComplete: complete,
    });
    sound.play(complete ? "success" : "tap");
    if (complete) playVoice(MOUNTAIN_AUDIO.q4LiftNova);
  }

  function playFinalRoute() {
    if (routeRunning) return;
    playVoice(MOUNTAIN_AUDIO.q4FinalScout);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      onChange({ q4RecapPlayed: true });
      return;
    }
    setRouteRunning(true);
    timerRef.current = setTimeout(() => {
      setRouteRunning(false);
      onChange({ q4RecapPlayed: true });
      sound.play("finale");
    }, 3800);
  }

  const dialogue = state.questStep === 0
    ? state.winchReached
      ? "Hooked on! Six levels below the ledge."
      : "Lower the empty hook from plus two down to the pod at minus four."
    : state.questStep === 1
      ? state.reverseComplete
        ? "Plus two! The climb undid the whole fall—six levels up."
        : "Winch up! Lift the pod from minus four to the safe ledge."
      : state.questStep === 2
        ? "Down six and up six are inverse moves—they undo each other."
        : state.q4RecapPlayed
          ? "Every route is secure. Bring the cell home!"
          : "Replay the drop and the climb before we open the shelter.";

  return (
    <section className="signal-below-zero-quest mountain-connected-quest" aria-label="Rescue Winch quest">
      <MountainRouteStage
        title="Rescue Winch"
        questNumber={4}
        questStep={state.questStep}
        position={position}
        trail={state.questStep === 0
          ? integerPath(2, state.winchPosition)
          : integerPath(-4, state.reversePosition)}
        avatar={avatar}
        markers={[
          { value: -4, label: "SECURED POD", complete: state.winchReached },
          { value: 2, label: "SAFE LEDGE", active: state.reverseComplete, complete: state.reverseComplete },
        ]}
        travelling={state.winchRunStarted || state.reverseRunStarted}
        interactive={interactive}
        onMove={moveWinch}
        conceptLabels={state.questStep >= 2}
        routeRunning={routeRunning}
        traveller={state.questStep === 0 ? "hook" : "pod"}
      />
      <div className="signal-action-deck">
        <MountainComicLine
          speaker={state.questStep === 0 && state.winchReached ? "YOU" : "NOVA"}
          line={dialogue}
          onHear={() => playVoice(
            state.questStep === 0
              ? MOUNTAIN_AUDIO.q4LowerKid
              : state.questStep === 1
                ? MOUNTAIN_AUDIO.q4LiftNova
                : state.questStep === 2
                  ? MOUNTAIN_AUDIO.q4RevealNova
                  : MOUNTAIN_AUDIO.q4FinalScout,
          )}
        />

        {(state.questStep === 0 || state.questStep === 1) && (
          <div className="mountain-quest-actions">
            <div>
              <small>{state.questStep === 0 ? "LOWER THE EMPTY HOOK" : "YOUR RESCUE WINCH"}</small>
              <h2>{state.questStep === 0 ? "Drop +2 down to the pod at −4." : "Lift −4 up to the +2 safe ledge."}</h2>
              <p>{state.questStep === 0
                ? "Drag the hook on the cliff, or move one level at a time."
                : "Drag the real pod on the cliff, or move one level at a time."}</p>
            </div>
            <div className="signal-nudge-row">
              <button
                type="button"
                onClick={() => moveWinch(position - 1)}
                disabled={state.questStep === 1 || position <= -4 || state.winchReached}
              >
                Down 1
              </button>
              <b>{formatAltitude(position)}</b>
              <button
                type="button"
                onClick={() => moveWinch(position + 1)}
                disabled={state.questStep === 0 || position >= 2 || state.reverseComplete}
              >
                Up 1
              </button>
            </div>
            <button
              className="signal-primary"
              type="button"
              disabled={state.questStep === 0 ? !state.winchReached : !state.reverseComplete}
              onClick={() => {
                if (state.questStep === 0) {
                  onChange({
                    questStep: 1,
                    reversePosition: -4,
                    reverseRunStarted: false,
                    reverseComplete: false,
                  });
                } else {
                  playVoice(MOUNTAIN_AUDIO.q4RevealNova);
                  onChange({ questStep: 2 });
                }
              }}
            >
              {state.questStep === 0 ? "Attach and start the lift →" : "Show why the moves undo →"}
            </button>
          </div>
        )}

        {state.questStep === 2 && (
          <div className="mountain-quest-actions">
            <div>
              <small>NOVA NAMES THE INVERSE</small>
              <h2>Opposite moves can undo each other.</h2>
              <p>Down six subtracts six. Up six adds six. Running both returns to the starting position.</p>
            </div>
            <div className="mountain-inverse-proof">
              <span>+2 − 6 = −4</span>
              <b>reverse</b>
              <span>−4 + 6 = +2</span>
            </div>
            <button className="signal-primary" type="button" onClick={() => onChange({ questStep: 3 })}>
              Replay the complete rescue →
            </button>
          </div>
        )}

        {state.questStep === 3 && (
          <div className="mountain-quest-actions">
            <div>
              <small>MOUNTAIN FINALE</small>
              <h2>The pod’s whole route now makes sense.</h2>
              <p>Position, order, storm movement, and inverse movement all lived on this one cliff.</p>
            </div>
            <button className="signal-replay-button" type="button" disabled={routeRunning} onClick={playFinalRoute}>
              {routeRunning ? "Replaying the drop and the climb…" : state.q4RecapPlayed ? "Play rescue again" : "Play the full rescue"}
            </button>
            {state.q4RecapPlayed && (
              <div className="mountain-chapter-proof">
                <span><b>1</b> Find −4</span>
                <span><b>2</b> Order checkpoints</span>
                <span><b>3</b> Track gusts</span>
                <span><b>4</b> Lift the pod home</span>
              </div>
            )}
            <button
              className="signal-primary"
              type="button"
              disabled={!state.q4RecapPlayed}
              onClick={replay ? onReplayComplete : onEnterFinale}
            >
              {replay ? "Return to my journal →" : personalize("Open the shelter, {hero} →", heroName)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// This is the finale's own postcard copy — written for this scene (docked
// cell, warm shelter, Pip, aurora), not a stand-in for `finaleCopy.mountain`
// in grade-seven-adventures.tsx. It has to stay local: that module imports
// MountainRescueAdventure from *this* file, so importing back from it would
// create a circular import. Phase 5's journal work should extract a single
// shared, import-free copy module so this and `finaleCopy.mountain` can't
// drift apart.
const MOUNTAIN_POSTCARD = {
  title: "Postcard from Ridge Shelter",
  detail: "\"The cell is docked and the shelter glows warm, {hero}. Pip found his cosy corner, and the aurora came out to watch.\"",
};

// Each entry is one finale beat: the line shown (and its speaker/voice), and
// the action button that advances past it. `voice` narrates THIS beat's
// line, so `advance()` plays the line being moved to, and "Hear line" plays
// the line currently on screen — no separate index bookkeeping.
export const MOUNTAIN_FINALE_BEATS = [
  {
    speaker: "SCOUT",
    line: "The dock is open. Bring the cell home!",
    action: "Dock the energy cell →",
    voice: MOUNTAIN_AUDIO.finale00Scout,
  },
  {
    speaker: "SCOUT",
    line: "Cell docked! Power is back at Ridge Shelter!",
    action: "Watch the shelter wake →",
    voice: MOUNTAIN_AUDIO.finale01Scout,
  },
  {
    speaker: "NOVA",
    line: "Look—the windows are warming. Pip found the cosy corner.",
    action: "Trace our whole rescue →",
    voice: MOUNTAIN_AUDIO.finale02Nova,
  },
  {
    speaker: "YOU",
    line: "And the sky… the aurora came to watch.",
    action: "Save the postcard →",
    voice: MOUNTAIN_AUDIO.finale03Kid,
  },
  {
    speaker: "NOVA",
    line: "One postcard for your journal. Look—a new star just started glowing.",
    action: "Back to the star map →",
    voice: MOUNTAIN_AUDIO.finale04Nova,
  },
] as const;

// Beats 1-2 ("Cell docked!" / "Look-the windows are warming...") are pure
// watch-beats: once the child docks the cell (beat 0's action), they flow on
// their own through the shared scene engine instead of a "Watch the shelter
// wake ->" click-through. Beats 0, 3 and 4 stay action-gated (dock, save the
// postcard, return to the map) and keep the plain comic-line + button
// pattern, since the engine only owns lines that play with no action needed
// in between.
const FINALE_WATCH_BEATS: readonly SceneBeat[] = [
  {
    speaker: MOUNTAIN_FINALE_BEATS[1].speaker,
    line: MOUNTAIN_FINALE_BEATS[1].line,
    voice: MOUNTAIN_FINALE_BEATS[1].voice,
  },
  {
    speaker: MOUNTAIN_FINALE_BEATS[2].speaker,
    line: MOUNTAIN_FINALE_BEATS[2].line,
    voice: MOUNTAIN_FINALE_BEATS[2].voice,
  },
];

function MountainFinale({
  state,
  onChange,
  heroName,
  playVoice,
  onChapterComplete,
  onReplayComplete,
}: {
  state: MountainState;
  onChange: (patch: Partial<MountainState>) => void;
  heroName: string;
  playVoice: (source: string) => void;
  onChapterComplete: () => void;
  onReplayComplete?: () => void;
}) {
  const beat = state.finaleBeat;
  const current = MOUNTAIN_FINALE_BEATS[beat];
  const autoPlayedIntroRef = useRef(false);
  const isWatchPhase = beat === 1 || beat === 2;

  // Beat 0's line never plays on its own otherwise — the watch phase (beats
  // 1-2) voices itself through the engine, and savePostcard() voices beat 3
  // on the way in — so this only ever needs to fire once, and only when the
  // finale actually mounts at beat 0 (not on a replay resumed later).
  useEffect(() => {
    if (beat !== 0 || autoPlayedIntroRef.current) return;
    autoPlayedIntroRef.current = true;
    const timer = setTimeout(() => playVoice(MOUNTAIN_FINALE_BEATS[0].voice), 260);
    return () => clearTimeout(timer);
  }, [beat, playVoice]);

  function dockCell() {
    sound.play("finale");
    onChange({ finaleCellDocked: true, finaleBeat: 1 });
  }

  // Fired when the watch phase (beats 1-2) finishes playing on its own.
  function completeWatch() {
    playVoice(MOUNTAIN_FINALE_BEATS[3].voice);
    sound.play("success");
    onChange({ finaleBeat: 3 });
  }

  function savePostcard() {
    playVoice(MOUNTAIN_FINALE_BEATS[4].voice);
    sound.play("success");
    onChange({ finaleBeat: 4 });
  }

  const isLastBeat = beat >= MOUNTAIN_FINALE_BEATS.length - 1;
  const finish = isLastBeat ? (onReplayComplete ?? onChapterComplete) : undefined;
  const buttonLabel = isLastBeat && onReplayComplete
    ? "Return to my journal →"
    : personalize(current.action, heroName);

  return (
    <section
      // "mountain-finale-act": the bare "mountain-finale" class is owned by a
      // legacy overlay-card rule earlier in world.css (dead markup, live CSS)
      // that force-shrinks the section to a 500px centred card.
      className={`mountain-finale-act beat-${beat}${state.finaleCellDocked ? " cell-docked" : ""}`}
      aria-label="Mountain Rescue finale"
    >
      <div className="mountain-finale-scene" aria-hidden>
        <i className="finale-aurora band-one" />
        <i className="finale-aurora band-two" />
        <div className="finale-shelter">
          <span className="finale-window w1" />
          <span className="finale-window w2" />
          <span className="finale-dock" />
        </div>
        <img className="finale-pod" src="/images/mountain-rescue/rescue-pod.png" alt="" />
        <img className="finale-pip" src="/images/mountain-rescue/pip-snow-fox.png" alt="" />
        {beat >= 3 && (
          <svg className="finale-route" viewBox="0 0 100 100" aria-hidden>
            <polyline points="20,20 20,50 20,86 78,32" fill="none" />
          </svg>
        )}
      </div>

      {isWatchPhase ? (
        <div className="signal-action-deck">
          <QuestStoryScene
            beats={FINALE_WATCH_BEATS}
            beat={beat - 1}
            onBeat={(local) => onChange({ finaleBeat: local + 1 })}
            onComplete={completeWatch}
            skipLabel="Skip ahead"
          />
        </div>
      ) : (
        <div className="signal-action-deck">
          <MountainComicLine
            speaker={current.speaker}
            line={current.line}
            onHear={() => playVoice(current.voice)}
          />
          {beat === 3 && (
            <div className="mountain-postcard">
              <b>{MOUNTAIN_POSTCARD.title}</b>
              <p>{personalize(MOUNTAIN_POSTCARD.detail, heroName)}</p>
            </div>
          )}
          <button
            className="signal-primary"
            type="button"
            onClick={beat === 0 ? dockCell : beat === 3 ? savePostcard : finish}
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </section>
  );
}

export function MountainRescueAdventure({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  onFinish,
}: MountainRescueAdventureProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const set = (patch: Partial<MountainState>) => onChange({ ...state, ...patch });
  const playVoice = useCallback((source: string) => {
    audioRef.current?.pause();
    const audio = new Audio(source);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.muted = sound.isMuted();
    void audio.play().catch((error) => {
      // Autoplay refusals (NotAllowedError) are expected before the first
      // user gesture, so they're just debug noise; a missing or broken file
      // is not, so that stays a warning. Either way the captioned line keeps
      // the scene readable.
      const log = error instanceof DOMException && error.name === "NotAllowedError"
        ? console.debug
        : console.warn;
      log(`[mountain-rescue] voice failed for ${source}`, error);
    });
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  function startQuest(quest: MountainQuestId) {
    const questIndex = MOUNTAIN_QUEST_IDS.indexOf(quest);
    const unlocked = questIndex === 0
      || state.completedQuests.includes(MOUNTAIN_QUEST_IDS[questIndex - 1]);
    if (!unlocked) return;
    const alreadyComplete = state.completedQuests.includes(quest);
    const resuming = state.activeQuest === quest && !alreadyComplete;
    const shared: Partial<MountainState> = {
      chapterMapOpen: false,
      activeQuest: quest,
      step: questIndex,
      questStep: resuming ? state.questStep : 0,
    };
    if (resuming) {
      set(shared);
      return;
    }
    if (quest === "signal-below-zero") {
      set({
        ...shared,
        questStep: 0,
        openingBeat: 0,
        openingComplete: false,
        signalPrediction: null,
        signalRunStarted: false,
        signalFound: false,
        recapPlayed: false,
        position: MOUNTAIN_START,
        flightPath: [MOUNTAIN_START],
      });
      return;
    }
    if (quest === "cliff-checkpoints") {
      set({
        ...shared,
        q2OpeningBeat: 0,
        q2OpeningComplete: false,
        higherCheckpoint: null,
        checkpointOrder: [],
        checkpointRunTested: false,
        orderRunTested: false,
      });
      return;
    }
    if (quest === "storm-moves") {
      set({
        ...shared,
        q3OpeningBeat: 0,
        q3OpeningComplete: false,
        stormPosition: -2,
        stormTrail: [-2],
        gustIndex: 0,
        transferGustIndex: 0,
        stormRunComplete: false,
        stormTransferComplete: false,
        stormRecapPlayed: false,
      });
      return;
    }
    set({
      ...shared,
      q4OpeningBeat: 0,
      q4OpeningComplete: false,
      winchPosition: 2,
      winchRunStarted: false,
      winchReached: false,
      reversePosition: -4,
      reverseRunStarted: false,
      reverseComplete: false,
      q4RecapPlayed: false,
    });
  }

  function finishQuest(quest: MountainQuestId) {
    const completedQuests = [
      ...new Set<MountainQuestId>([
        ...state.completedQuests,
        quest,
      ]),
    ];
    const currentIndex = MOUNTAIN_QUEST_IDS.indexOf(quest);
    const nextQuest = MOUNTAIN_QUEST_IDS[currentIndex + 1];
    sound.play("success");
    if (!nextQuest) return;
    const next: Partial<MountainState> = {
      completedQuests,
      chapterMapOpen: false,
      activeQuest: nextQuest,
      step: currentIndex + 1,
      questStep: 0,
    };
    if (nextQuest === "cliff-checkpoints") {
      Object.assign(next, {
        q2OpeningBeat: 0,
        q2OpeningComplete: false,
        higherCheckpoint: null,
        checkpointOrder: [],
        checkpointRunTested: false,
        orderRunTested: false,
      });
    } else if (nextQuest === "storm-moves") {
      Object.assign(next, {
        q3OpeningBeat: 0,
        q3OpeningComplete: false,
        stormPosition: -2,
        stormTrail: [-2],
        gustIndex: 0,
        transferGustIndex: 0,
        stormRunComplete: false,
        stormTransferComplete: false,
        stormRecapPlayed: false,
      });
    } else {
      Object.assign(next, {
        q4OpeningBeat: 0,
        q4OpeningComplete: false,
        winchPosition: 2,
        winchRunStarted: false,
        winchReached: false,
        reversePosition: -4,
        reverseRunStarted: false,
        reverseComplete: false,
        q4RecapPlayed: false,
      });
    }
    set(next);
  }

  function finishMountainChapter() {
    const finalState: MountainState = {
      ...state,
      completedQuests: [...MOUNTAIN_QUEST_IDS],
      chapterMapOpen: true,
      activeQuest: null,
      step: 4,
      finaleComplete: true,
    };
    onChange(finalState);
    onFinish(finalState);
  }

  // Story before menu: a child's FIRST visit lands in the arrival act, never
  // the quest map. The map is a rest point for return visits — once the world
  // has been entered before (a quest completed, or the opening/quest already
  // under way), chapterMapOpen is honored normally, including a deliberate
  // "Mountain quests" nav request.
  const firstArrival = !replay
    && state.completedQuests.length === 0
    && !state.openingComplete
    && state.activeQuest === null;

  if (state.chapterMapOpen && !replay && !firstArrival) {
    return (
      <MountainQuestMap
        state={state}
        heroName={heroName}
        avatar={avatar}
        onStart={startQuest}
      />
    );
  }

  const activeQuest = replay
    ? MOUNTAIN_QUEST_IDS[Math.min(state.step, MOUNTAIN_QUEST_IDS.length - 1)]
    : state.activeQuest ?? "signal-below-zero";

  if (activeQuest === "signal-below-zero" && !state.openingComplete) {
    return (
      <SignalOpening
        state={state}
        onChange={set}
        avatar={avatar}
      />
    );
  }

  if (activeQuest === "cliff-checkpoints" && !state.q2OpeningComplete) {
    return (
      <ConnectedMountainOpening
        label="Cliff Checkpoints"
        lines={Q2_OPENING_LINES}
        beat={state.q2OpeningBeat}
        onBeat={(q2OpeningBeat) => set({ q2OpeningBeat })}
        onComplete={() => set({ q2OpeningComplete: true, questStep: 0 })}
        avatar={avatar}
        podLabel="0"
      />
    );
  }

  if (activeQuest === "storm-moves" && !state.q3OpeningComplete) {
    return (
      <ConnectedMountainOpening
        label="Storm Moves"
        lines={Q3_OPENING_LINES}
        beat={state.q3OpeningBeat}
        onBeat={(q3OpeningBeat) => set({ q3OpeningBeat })}
        onComplete={() => set({ q3OpeningComplete: true, questStep: 0 })}
        avatar={avatar}
        podLabel="−2"
        traveller="hook"
      />
    );
  }

  if (activeQuest === "rescue-winch" && !state.q4OpeningComplete) {
    return (
      <ConnectedMountainOpening
        label="Rescue Winch"
        lines={Q4_OPENING_LINES}
        beat={state.q4OpeningBeat}
        onBeat={(q4OpeningBeat) => set({ q4OpeningBeat })}
        onComplete={() => set({ q4OpeningComplete: true, questStep: 0 })}
        avatar={avatar}
        podLabel="−4"
      />
    );
  }

  if (activeQuest === "cliff-checkpoints") {
    return (
      <CliffCheckpointsQuest
        state={state}
        onChange={set}
        replay={replay}
        heroName={heroName}
        avatar={avatar}
        playVoice={playVoice}
        onComplete={() => finishQuest("cliff-checkpoints")}
        onReplayComplete={() => onFinish(state)}
      />
    );
  }

  if (activeQuest === "storm-moves") {
    return (
      <StormMovesQuest
        state={state}
        onChange={set}
        replay={replay}
        heroName={heroName}
        avatar={avatar}
        playVoice={playVoice}
        onComplete={() => finishQuest("storm-moves")}
        onReplayComplete={() => onFinish(state)}
      />
    );
  }

  if (activeQuest === "rescue-winch" && state.questStep === 4) {
    return (
      <MountainFinale
        state={state}
        onChange={set}
        heroName={heroName}
        playVoice={playVoice}
        onChapterComplete={finishMountainChapter}
        onReplayComplete={replay ? () => onFinish(state) : undefined}
      />
    );
  }

  if (activeQuest === "rescue-winch") {
    return (
      <RescueWinchQuest
        state={state}
        onChange={set}
        replay={replay}
        heroName={heroName}
        avatar={avatar}
        playVoice={playVoice}
        onEnterFinale={() => set({ questStep: 4, finaleBeat: 0, finaleCellDocked: false })}
        onReplayComplete={() => onFinish(state)}
      />
    );
  }

  return (
    <SignalBelowZeroQuest
      state={state}
      onChange={set}
      replay={replay}
      heroName={heroName}
      avatar={avatar}
      playVoice={playVoice}
      onComplete={() => finishQuest("signal-below-zero")}
      onReplayComplete={() => onFinish(state)}
    />
  );
}
