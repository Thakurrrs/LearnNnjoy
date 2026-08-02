"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import {
  BALANCE_QUEST_IDS,
  type BalanceQuestId,
  type BalanceState,
} from "@/lib/grade-seven-progress";

type BalanceLabAdventureProps = {
  state: BalanceState;
  onChange: (state: BalanceState) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  onFinish: (finalState?: BalanceState) => void;
};

type BalanceSpeaker = "SCOUT" | "NOVA" | "YOU";

const BALANCE_AUDIO_ROOT = "/audio/balance-lab";
// Flip only after the locally generated static clips have been reviewed and
// copied into public/audio/balance-lab. Keeping this false prevents broken
// requests while the current local-generation approval is unavailable.
const BALANCE_AUDIO_READY = false;
const BALANCE_AUDIO = {
  q1OpeningScout: `${BALANCE_AUDIO_ROOT}/q1-opening-01-scout.mp3`,
  q1OpeningNova: `${BALANCE_AUDIO_ROOT}/q1-opening-02-nova.mp3`,
  q1OpeningKid: `${BALANCE_AUDIO_ROOT}/q1-opening-03-kid.mp3`,
  q1ActionNova: `${BALANCE_AUDIO_ROOT}/q1-stage-01-nova.mp3`,
  q1LevelKid: `${BALANCE_AUDIO_ROOT}/q1-stage-02-kid.mp3`,
  q1RevealNova: `${BALANCE_AUDIO_ROOT}/q1-stage-03-nova.mp3`,
  q1RecapScout: `${BALANCE_AUDIO_ROOT}/q1-stage-04-scout.mp3`,
  q2OpeningScout: `${BALANCE_AUDIO_ROOT}/q2-opening-01-scout.mp3`,
  q2OpeningNova: `${BALANCE_AUDIO_ROOT}/q2-opening-02-nova.mp3`,
  q2OpeningKid: `${BALANCE_AUDIO_ROOT}/q2-opening-03-kid.mp3`,
  q2TipNova: `${BALANCE_AUDIO_ROOT}/q2-stage-01-nova.mp3`,
  q2PairsKid: `${BALANCE_AUDIO_ROOT}/q2-stage-02-kid.mp3`,
  q2RevealNova: `${BALANCE_AUDIO_ROOT}/q2-stage-03-nova.mp3`,
  q2RecapScout: `${BALANCE_AUDIO_ROOT}/q2-stage-04-scout.mp3`,
  q3OpeningScout: `${BALANCE_AUDIO_ROOT}/q3-opening-01-scout.mp3`,
  q3OpeningNova: `${BALANCE_AUDIO_ROOT}/q3-opening-02-nova.mp3`,
  q3OpeningKid: `${BALANCE_AUDIO_ROOT}/q3-opening-03-kid.mp3`,
  q3RemoveNova: `${BALANCE_AUDIO_ROOT}/q3-stage-01-nova.mp3`,
  q3ScanKid: `${BALANCE_AUDIO_ROOT}/q3-stage-02-kid.mp3`,
  q3RevealNova: `${BALANCE_AUDIO_ROOT}/q3-stage-03-nova.mp3`,
  q3RecapScout: `${BALANCE_AUDIO_ROOT}/q3-stage-04-scout.mp3`,
  q4OpeningScout: `${BALANCE_AUDIO_ROOT}/q4-opening-01-scout.mp3`,
  q4OpeningNova: `${BALANCE_AUDIO_ROOT}/q4-opening-02-nova.mp3`,
  q4OpeningKid: `${BALANCE_AUDIO_ROOT}/q4-opening-03-kid.mp3`,
  q4RemoveKid: `${BALANCE_AUDIO_ROOT}/q4-stage-01-kid.mp3`,
  q4OpenNova: `${BALANCE_AUDIO_ROOT}/q4-stage-02-nova.mp3`,
  q4RevealNova: `${BALANCE_AUDIO_ROOT}/q4-stage-03-nova.mp3`,
  q4FinalScout: `${BALANCE_AUDIO_ROOT}/q4-stage-04-scout.mp3`,
} as const;

const BALANCE_QUESTS: readonly {
  id: BalanceQuestId;
  title: string;
  concept: string;
  mission: string;
}[] = [
  {
    id: "keep-it-level",
    title: "Keep It Level",
    concept: "Equality is visible balance",
    mission: "Load both energy pans until the beam settles.",
  },
  {
    id: "same-move-both-sides",
    title: "Same Move, Both Sides",
    concept: "Equal changes preserve equality",
    mission: "Test one unfair move, then repair the beam with matching moves.",
  },
  {
    id: "reveal-the-crate",
    title: "Reveal the Crate",
    concept: "Inverse moves reveal an unknown",
    mission: "Remove matching energy blocks until the hidden crate stands alone.",
  },
  {
    id: "test-another-lock",
    title: "Test Another Lock",
    concept: "The same rule transfers",
    mission: "Open a changed lock without guessing its hidden value.",
  },
] as const;

const Q1_OPENING = [
  {
    speaker: "SCOUT" as const,
    line: "The lab beam lost its balance. The supply doors will not power up!",
    voice: BALANCE_AUDIO.q1OpeningScout,
  },
  {
    speaker: "NOVA" as const,
    line: "The two pans control the same energy gate. Let’s make them agree.",
    voice: BALANCE_AUDIO.q1OpeningNova,
  },
  {
    speaker: "YOU" as const,
    line: "I’ll load the pans and watch the beam.",
    voice: BALANCE_AUDIO.q1OpeningKid,
  },
] as const;

const Q2_OPENING = [
  {
    speaker: "SCOUT" as const,
    line: "The beam is level, but the repair arms need a fairness test.",
    voice: BALANCE_AUDIO.q2OpeningScout,
  },
  {
    speaker: "NOVA" as const,
    line: "Let’s change one side first, see what breaks, then fix it together.",
    voice: BALANCE_AUDIO.q2OpeningNova,
  },
  {
    speaker: "YOU" as const,
    line: "I’ll watch both pans—not just the numbers.",
    voice: BALANCE_AUDIO.q2OpeningKid,
  },
] as const;

const Q3_OPENING = [
  {
    speaker: "SCOUT" as const,
    line: "The mystery crate is locked into the left pan with five extra blocks!",
    voice: BALANCE_AUDIO.q3OpeningScout,
  },
  {
    speaker: "NOVA" as const,
    line: "Twelve blocks balance it. Matching removals can uncover the crate’s weight.",
    voice: BALANCE_AUDIO.q3OpeningNova,
  },
  {
    speaker: "YOU" as const,
    line: "Five fair moves. Then we scan what remains.",
    voice: BALANCE_AUDIO.q3OpeningKid,
  },
] as const;

const Q4_OPENING = [
  {
    speaker: "SCOUT" as const,
    line: "A backup lock just activated with a different energy code!",
    voice: BALANCE_AUDIO.q4OpeningScout,
  },
  {
    speaker: "NOVA" as const,
    line: "New numbers, same kind of beam. Let’s see if our fair move still works.",
    voice: BALANCE_AUDIO.q4OpeningNova,
  },
  {
    speaker: "YOU" as const,
    line: "No guessing. I’ll prove it on both pans.",
    voice: BALANCE_AUDIO.q4OpeningKid,
  },
] as const;

function heroAsset(avatar: string) {
  if (avatar === "girl") return "/images/skatepark-night-run/hero-girl-active.png";
  if (avatar === "boy") return "/images/skatepark-night-run/hero-boy-active.png";
  return "/images/skatepark-night-run/hero-explorer-active.png";
}

function EnergyBlocks({
  count,
  dimmed = false,
}: {
  count: number;
  dimmed?: boolean;
}) {
  return (
    <span className={`balance-energy-blocks${dimmed ? " dimmed" : ""}`} aria-label={`${count} energy blocks`}>
      {Array.from({ length: count }, (_, index) => (
        <i key={index} aria-hidden>✦</i>
      ))}
    </span>
  );
}

function BalanceComicLine({
  speaker,
  line,
  onHear,
}: {
  speaker: BalanceSpeaker;
  line: string;
  onHear: () => void;
}) {
  return (
    <div className={`balance-comic-line speaker-${speaker.toLowerCase()}`} aria-live="polite">
      <small>{speaker}</small>
      <p>{line}</p>
      <button
        type="button"
        disabled={!BALANCE_AUDIO_READY}
        onClick={onHear}
        aria-label={BALANCE_AUDIO_READY ? `Hear ${speaker.toLowerCase()} speak` : "Voice is being prepared"}
      >
        {BALANCE_AUDIO_READY ? "Hear line" : "Voice being prepared"}
      </button>
    </div>
  );
}

function BalanceQuestMap({
  state,
  heroName,
  avatar,
  onStart,
}: {
  state: BalanceState;
  heroName: string;
  avatar: string;
  onStart: (quest: BalanceQuestId) => void;
}) {
  const completed = new Set(state.completedQuests);

  return (
    <section className="balance-quest-map balance-world" aria-label="Balance Lab quest map">
      <div className="balance-map-energy" aria-hidden><i /><i /><i /></div>
      <header className="balance-map-heading">
        <div>
          <p>GRADE 7 · SIMPLE EQUATIONS</p>
          <h1>Balance Lab</h1>
          <span>
            One energy beam. Four connected repairs. The supply crate opens
            only after every fair move is proven.
          </span>
        </div>
        <div className="balance-map-team" aria-label="Nova and your explorer are ready">
          <Image
            src="/images/skatepark-night-run/nova-curious.png"
            alt="Nova, the glowing star friend"
            width={116}
            height={116}
          />
          <Image
            src={heroAsset(avatar)}
            alt={`${heroName || "Your explorer"} ready for Balance Lab`}
            width={104}
            height={130}
          />
        </div>
      </header>

      <div className="balance-map-progress" aria-label={`${completed.size} of 4 quests complete`}>
        <div>
          {BALANCE_QUEST_IDS.map((quest) => (
            <i key={quest} className={completed.has(quest) ? "complete" : ""} />
          ))}
        </div>
        <b>{completed.size}/4 lab repairs complete</b>
      </div>

      <div className="balance-quest-grid">
        {BALANCE_QUESTS.map((quest, index) => {
          const complete = completed.has(quest.id);
          const unlocked = index === 0 || completed.has(BALANCE_QUESTS[index - 1].id);
          const current = state.activeQuest === quest.id && !complete;
          return (
            <article
              key={quest.id}
              className={`balance-quest-card${complete ? " complete" : ""}${current ? " current" : ""}${!unlocked ? " locked" : ""}`}
            >
              <div>
                <span>QUEST {index + 1}</span>
                <b>{complete ? "COMPLETE" : current ? "IN PROGRESS" : unlocked ? "READY" : "LOCKED"}</b>
              </div>
              <h2>{quest.title}</h2>
              <p className="balance-quest-concept">{quest.concept}</p>
              <p>{quest.mission}</p>
              {unlocked ? (
                <button type="button" onClick={() => onStart(quest.id)}>
                  {complete ? "Play again" : current ? "Continue here" : "Start repair"} →
                </button>
              ) : (
                <div className="balance-quest-wait">
                  <strong>Finish Quest {index} first</strong>
                  <small>The next lab circuit wakes after the earlier repair.</small>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <p className="balance-map-note">
        {personalize("{hero}, every move is saved on this device.", heroName)}
      </p>
    </section>
  );
}

function BalanceOpening({
  label,
  lines,
  beat,
  onBeat,
  onComplete,
  avatar,
  playVoice,
}: {
  label: string;
  lines: readonly { speaker: BalanceSpeaker; line: string; voice: string }[];
  beat: number;
  onBeat: (beat: number) => void;
  onComplete: () => void;
  avatar: string;
  playVoice: (source: string) => void;
}) {
  const currentBeat = Math.min(beat, lines.length - 1);
  const current = lines[currentBeat];
  const autoPlayedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!BALANCE_AUDIO_READY) return;
    if (autoPlayedRef.current === currentBeat) return;
    autoPlayedRef.current = currentBeat;
    const timer = setTimeout(() => playVoice(current.voice), 260);
    return () => clearTimeout(timer);
  }, [current.voice, currentBeat, playVoice]);

  function next() {
    sound.play("tap");
    if (currentBeat < lines.length - 1) {
      onBeat(currentBeat + 1);
      return;
    }
    onComplete();
  }

  return (
    <section className="balance-story-opening balance-world" aria-label={`${label} story opening`}>
      <div className="balance-opening-scene">
        <div className="balance-opening-machine" aria-hidden>
          <span /><i /><span />
        </div>
        <Image
          className="balance-opening-nova"
          src="/images/skatepark-night-run/nova-curious.png"
          alt={`Nova begins ${label}`}
          width={190}
          height={190}
          priority
        />
        <Image
          className="balance-opening-kid"
          src={heroAsset(avatar)}
          alt={`Your explorer joins ${label}`}
          width={150}
          height={190}
          priority
        />
        <BalanceComicLine
          speaker={current.speaker}
          line={current.line}
          onHear={() => playVoice(current.voice)}
        />
      </div>
      <footer className="balance-opening-controls">
        <div aria-label={`Story line ${currentBeat + 1} of ${lines.length}`}>
          {lines.map((line, index) => (
            <i key={line.speaker + index} className={index <= currentBeat ? "lit" : ""} />
          ))}
        </div>
        <button type="button" onClick={next}>
          {currentBeat < lines.length - 1 ? "Next line →" : `Start ${label} →`}
        </button>
      </footer>
    </section>
  );
}

function BalanceStage({
  title,
  questNumber,
  questStep,
  avatar,
  leftBlocks,
  rightBlocks,
  tilt,
  crate,
  crateOpen = false,
  crateValue,
  formalEquation,
  recapRunning = false,
}: {
  title: string;
  questNumber: number;
  questStep: number;
  avatar: string;
  leftBlocks: number;
  rightBlocks: number;
  tilt: "left" | "right" | "level";
  crate?: boolean;
  crateOpen?: boolean;
  crateValue?: number;
  formalEquation?: string;
  recapRunning?: boolean;
}) {
  return (
    <div className={`balance-world-stage balance-connected-stage tilt-${tilt}${recapRunning ? " recap-running" : ""}${crateOpen ? " powered" : ""}`}>
      <div className="balance-quest-hud">
        <span>QUEST {questNumber} · {title.toUpperCase()}</span>
        <b>{questStep + 1}/4</b>
      </div>
      <div className="balance-world-glow" aria-hidden />
      <div className="balance-world-pipes" aria-hidden><i /><i /><i /><i /></div>
      <div className="balance-world-coils" aria-hidden><i>ϟ</i><i>ϟ</i></div>

      <div className="balance-stage-team" aria-hidden>
        <Image
          src="/images/skatepark-night-run/nova-curious.png"
          alt=""
          width={108}
          height={108}
        />
        <Image
          src={heroAsset(avatar)}
          alt=""
          width={100}
          height={126}
        />
      </div>

      <div className={`balance-world-machine${tilt === "level" ? "" : " tipped"}${tilt === "left" ? " tips-left" : ""}`}>
        <div className="balance-world-beam">
          <div className="balance-world-pan left-pan">
            {crate && (
              <span className={`mystery-crate${crateOpen ? " open" : ""}`}>
                <b>{crateOpen ? crateValue : "?"}</b><i />
              </span>
            )}
            <EnergyBlocks count={leftBlocks} />
          </div>
          <span className="balance-world-pivot"><i aria-hidden>◆</i></span>
          <div className="balance-world-pan right-pan">
            <EnergyBlocks count={rightBlocks} />
          </div>
        </div>
        <div className={`balance-live-status status-${tilt}`}>
          <span>{tilt === "level" ? "BEAM LEVEL" : tilt === "left" ? "LEFT SIDE LOWER" : "RIGHT SIDE LOWER"}</span>
          <b>{leftBlocks}{crate ? " + crate" : ""} {tilt === "level" ? "matches" : "does not match"} {rightBlocks}</b>
        </div>
        {formalEquation && (
          <div className="balance-equation-screen">{formalEquation}</div>
        )}
      </div>
    </div>
  );
}

function useRecap(
  onComplete: () => void,
  playVoice: (source: string) => void,
  voice: string,
  duration = 3400,
) {
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function play() {
    if (running) return;
    playVoice(voice);
    sound.play("tap");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }
    setRunning(true);
    timerRef.current = setTimeout(() => {
      setRunning(false);
      onComplete();
      sound.play("success");
    }, duration);
  }

  return { running, play };
}

function QuestDeck({
  speaker,
  line,
  voice,
  playVoice,
  children,
}: {
  speaker: BalanceSpeaker;
  line: string;
  voice: string;
  playVoice: (source: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="balance-action-deck">
      <BalanceComicLine speaker={speaker} line={line} onHear={() => playVoice(voice)} />
      <div className="balance-quest-actions">{children}</div>
    </div>
  );
}

function KeepItLevelQuest({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  playVoice,
  onComplete,
  onReplayComplete,
}: {
  state: BalanceState;
  onChange: (patch: Partial<BalanceState>) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  playVoice: (source: string) => void;
  onComplete: () => void;
  onReplayComplete: () => void;
}) {
  const recap = useRecap(
    () => onChange({ q1RecapPlayed: true }),
    playVoice,
    BALANCE_AUDIO.q1RecapScout,
  );
  const level = state.leftLoad === 3 && state.rightLoad === 3;
  const leftBlocks = state.questStep === 2
    ? state.transferLoad
    : state.questStep === 3
      ? 3
      : state.leftLoad;
  const rightBlocks = state.questStep === 2
    ? state.transferLoad
    : state.questStep === 3
      ? 3
      : state.rightLoad;
  const tilt = leftBlocks === rightBlocks
    ? "level"
    : leftBlocks > rightBlocks
      ? "left"
      : "right";

  function load(side: "left" | "right") {
    const leftLoad = side === "left" ? Math.min(3, state.leftLoad + 1) : state.leftLoad;
    const rightLoad = side === "right" ? Math.min(3, state.rightLoad + 1) : state.rightLoad;
    const complete = leftLoad === 3 && rightLoad === 3;
    onChange({ leftLoad, rightLoad, levelRunTested: complete });
    sound.play(complete ? "success" : "tap");
    playVoice(complete ? BALANCE_AUDIO.q1LevelKid : BALANCE_AUDIO.q1ActionNova);
  }

  function addTransferPair() {
    const transferLoad = Math.min(4, state.transferLoad + 1);
    onChange({
      transferLoad,
      q1TransferComplete: transferLoad === 4,
    });
    sound.play(transferLoad === 4 ? "success" : "tap");
  }

  const dialogue = state.questStep === 0
    ? level
      ? "Both pans hold three. The beam settled right in the middle!"
      : `Left has ${state.leftLoad}. Right has ${state.rightLoad}. The beam shows which side has more.`
    : state.questStep === 1
      ? "When both sides hold the same amount, the beam is level. That is equality."
      : state.questStep === 2
        ? state.q1TransferComplete
          ? "Four and four also settle the beam. Equality did not depend on the number three."
          : "New circuit: add one matching pair at a time."
        : state.q1RecapPlayed
          ? "The beam tipped, moved, and finally settled only when both sides matched."
          : "Replay the loading sequence and watch the beam find the middle.";

  return (
    <section className="balance-connected-quest balance-world" aria-label="Keep It Level quest">
      <BalanceStage
        title="Keep It Level"
        questNumber={1}
        questStep={state.questStep}
        avatar={avatar}
        leftBlocks={leftBlocks}
        rightBlocks={rightBlocks}
        tilt={tilt}
        formalEquation={state.questStep >= 1 ? state.questStep === 2 ? "4 = 4" : "3 = 3" : undefined}
        recapRunning={recap.running}
      />
      <QuestDeck
        speaker={level && state.questStep === 0 ? "YOU" : "NOVA"}
        line={dialogue}
        voice={state.questStep === 0
          ? level ? BALANCE_AUDIO.q1LevelKid : BALANCE_AUDIO.q1ActionNova
          : state.questStep === 1
            ? BALANCE_AUDIO.q1RevealNova
            : state.questStep === 2
              ? BALANCE_AUDIO.q1LevelKid
              : BALANCE_AUDIO.q1RecapScout}
        playVoice={playVoice}
      >
        {state.questStep === 0 && (
          <>
            <div>
              <small>YOUR HANDS ON THE MACHINE</small>
              <h2>Load both pans until the beam settles.</h2>
              <p>Add to either side. A tipped beam is information, not a wrong answer.</p>
            </div>
            <div className="balance-pair-controls">
              <button type="button" disabled={state.leftLoad === 3} onClick={() => load("left")}>Add left block</button>
              <button type="button" disabled={state.rightLoad === 3} onClick={() => load("right")}>Add right block</button>
            </div>
            <button
              className="balance-primary"
              type="button"
              disabled={!state.levelRunTested}
              onClick={() => {
                playVoice(BALANCE_AUDIO.q1RevealNova);
                onChange({ questStep: 1 });
              }}
            >
              What did the beam show? →
            </button>
          </>
        )}
        {state.questStep === 1 && (
          <>
            <div>
              <small>NOVA NAMES THE PATTERN</small>
              <h2>A level beam makes equality visible.</h2>
              <p>The symbol comes after the machine proves both quantities match.</p>
            </div>
            <div className="balance-concept-proof"><span>3 blocks</span><b>=</b><span>3 blocks</span></div>
            <button className="balance-primary" type="button" onClick={() => onChange({ questStep: 2, transferLoad: 0 })}>
              Test a new amount →
            </button>
          </>
        )}
        {state.questStep === 2 && (
          <>
            <div>
              <small>CHANGED CIRCUIT</small>
              <h2>Can a different amount still be equal?</h2>
              <p>Add matching pairs and let the real beam answer.</p>
            </div>
            <button className="balance-pair-action" type="button" disabled={state.q1TransferComplete} onClick={addTransferPair}>
              <span>+1</span><b>Add one to both pans</b><small>{state.transferLoad}/4 pairs loaded</small>
            </button>
            <button className="balance-primary" type="button" disabled={!state.q1TransferComplete} onClick={() => onChange({ questStep: 3 })}>
              Replay the repair →
            </button>
          </>
        )}
        {state.questStep === 3 && (
          <>
            <div>
              <small>VISIBLE RECAP</small>
              <h2>Watch the beam move before the equality appears.</h2>
              <p>The replay keeps the physical reason and the maths connected.</p>
            </div>
            <button className="balance-replay-button" type="button" disabled={recap.running} onClick={recap.play}>
              {recap.running ? "Loading left, loading right, settling…" : state.q1RecapPlayed ? "Play beam repair again" : "Run the beam replay"}
            </button>
            {state.q1RecapPlayed && (
              <div className="balance-route-proof"><span>different amounts</span><b>beam moves</b><strong>same amounts = level</strong></div>
            )}
            <button
              className="balance-primary"
              type="button"
              disabled={!state.q1RecapPlayed}
              onClick={replay ? onReplayComplete : onComplete}
            >
              {replay ? "Return to my journal →" : personalize("Quest complete, {hero} →", heroName)}
            </button>
          </>
        )}
      </QuestDeck>
    </section>
  );
}

function SameMoveQuest({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  playVoice,
  onComplete,
  onReplayComplete,
}: {
  state: BalanceState;
  onChange: (patch: Partial<BalanceState>) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  playVoice: (source: string) => void;
  onComplete: () => void;
  onReplayComplete: () => void;
}) {
  const recap = useRecap(
    () => onChange({ q2RecapPlayed: true }),
    playVoice,
    BALANCE_AUDIO.q2RecapScout,
  );
  const leftBlocks = state.questStep === 0
    ? state.oneSideRemoved && !state.fairnessRestored ? 5 : 6
    : 6 - state.pairedRemoval;
  const rightBlocks = state.questStep === 0 ? 6 : 6 - state.pairedRemoval;
  const tilt = leftBlocks === rightBlocks ? "level" : "right";

  function testOneSide() {
    onChange({ oneSideRemoved: true, fairnessRestored: false });
    sound.play("tap");
    playVoice(BALANCE_AUDIO.q2TipNova);
  }

  function restore() {
    onChange({ fairnessRestored: true });
    sound.play("success");
  }

  function removePair() {
    const pairedRemoval = Math.min(3, state.pairedRemoval + 1);
    onChange({
      pairedRemoval,
      pairedRemovalComplete: pairedRemoval === 3,
    });
    sound.play(pairedRemoval === 3 ? "success" : "tap");
    playVoice(BALANCE_AUDIO.q2PairsKid);
  }

  const dialogue = state.questStep === 0
    ? !state.oneSideRemoved
      ? "The repair arm is ready. Remove one block from only the left pan."
      : !state.fairnessRestored
        ? "The beam tipped. One side changed while the other stayed the same."
        : "Block restored. The beam is level again."
    : state.questStep === 1
      ? state.pairedRemovalComplete
        ? "Three matching pairs left. Both pans still hold three, so the beam stayed true."
        : "Now remove a matching pair. Both sides move together."
      : state.questStep === 2
        ? "Doing the same thing to both sides preserves equality."
        : state.q2RecapPlayed
          ? "One-sided change tipped the beam. Matching changes kept it level."
          : "Replay the unfair move and the fair repair.";

  return (
    <section className="balance-connected-quest balance-world" aria-label="Same Move Both Sides quest">
      <BalanceStage
        title="Same Move, Both Sides"
        questNumber={2}
        questStep={state.questStep}
        avatar={avatar}
        leftBlocks={leftBlocks}
        rightBlocks={rightBlocks}
        tilt={tilt}
        formalEquation={state.questStep >= 2 ? "6 − 3 = 6 − 3" : undefined}
        recapRunning={recap.running}
      />
      <QuestDeck
        speaker={state.questStep === 1 ? "YOU" : "NOVA"}
        line={dialogue}
        voice={state.questStep === 0
          ? BALANCE_AUDIO.q2TipNova
          : state.questStep === 1
            ? BALANCE_AUDIO.q2PairsKid
            : state.questStep === 2
              ? BALANCE_AUDIO.q2RevealNova
              : BALANCE_AUDIO.q2RecapScout}
        playVoice={playVoice}
      >
        {state.questStep === 0 && (
          <>
            <div>
              <small>SAFE EXPERIMENT</small>
              <h2>Change one side and watch what the beam does.</h2>
              <p>Nova will restore the block afterward. This experiment cannot lose progress.</p>
            </div>
            {!state.oneSideRemoved ? (
              <button className="balance-pair-action danger" type="button" onClick={testOneSide}>
                <span>−1</span><b>Remove from left only</b><small>Watch the beam</small>
              </button>
            ) : !state.fairnessRestored ? (
              <button className="balance-pair-action" type="button" onClick={restore}>
                <span>+1</span><b>Put the left block back</b><small>Repair the balance</small>
              </button>
            ) : (
              <div className="balance-route-proof"><span>one side changed</span><b>beam tipped</b><strong>restored = level</strong></div>
            )}
            <button className="balance-primary" type="button" disabled={!state.fairnessRestored} onClick={() => onChange({ questStep: 1 })}>
              Try matching moves →
            </button>
          </>
        )}
        {state.questStep === 1 && (
          <>
            <div>
              <small>YOUR FAIR REPAIR</small>
              <h2>Remove three matching pairs.</h2>
              <p>Both piles shrink in the world after every move.</p>
            </div>
            <button className="balance-pair-action" type="button" disabled={state.pairedRemovalComplete} onClick={removePair}>
              <span>−1</span><b>Remove one from both</b><small>{state.pairedRemoval}/3 pairs removed</small>
            </button>
            <button
              className="balance-primary"
              type="button"
              disabled={!state.pairedRemovalComplete}
              onClick={() => {
                playVoice(BALANCE_AUDIO.q2RevealNova);
                onChange({ questStep: 2 });
              }}
            >
              Name the fair-move rule →
            </button>
          </>
        )}
        {state.questStep === 2 && (
          <>
            <div>
              <small>NOVA NAMES THE PATTERN</small>
              <h2>Equal changes preserve equality.</h2>
              <p>Subtracting the same amount from both sides keeps a true equation true.</p>
            </div>
            <div className="balance-concept-proof"><span>6 − 3</span><b>=</b><span>6 − 3</span></div>
            <button className="balance-primary" type="button" onClick={() => onChange({ questStep: 3 })}>
              Replay both experiments →
            </button>
          </>
        )}
        {state.questStep === 3 && (
          <>
            <div>
              <small>VISIBLE RECAP</small>
              <h2>Compare the tipped move with the fair moves.</h2>
              <p>The beam explains why the rule works before the equation confirms it.</p>
            </div>
            <button className="balance-replay-button" type="button" disabled={recap.running} onClick={recap.play}>
              {recap.running ? "Tipping, restoring, removing pairs…" : state.q2RecapPlayed ? "Play fairness test again" : "Run the fairness replay"}
            </button>
            {state.q2RecapPlayed && (
              <div className="balance-route-proof"><span>one side: tips</span><b>both sides: moves together</b><strong>equality survives</strong></div>
            )}
            <button
              className="balance-primary"
              type="button"
              disabled={!state.q2RecapPlayed}
              onClick={replay ? onReplayComplete : onComplete}
            >
              {replay ? "Return to my journal →" : personalize("Quest complete, {hero} →", heroName)}
            </button>
          </>
        )}
      </QuestDeck>
    </section>
  );
}

function RevealCrateQuest({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  playVoice,
  onComplete,
  onReplayComplete,
}: {
  state: BalanceState;
  onChange: (patch: Partial<BalanceState>) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  playVoice: (source: string) => void;
  onComplete: () => void;
  onReplayComplete: () => void;
}) {
  const recap = useRecap(
    () => onChange({ q3RecapPlayed: true }),
    playVoice,
    BALANCE_AUDIO.q3RecapScout,
  );
  const remainingExtra = Math.max(0, 5 - state.cratePairsRemoved);
  const remainingRight = Math.max(7, 12 - state.cratePairsRemoved);

  function removePair() {
    const cratePairsRemoved = Math.min(5, state.cratePairsRemoved + 1);
    onChange({ cratePairsRemoved });
    sound.play(cratePairsRemoved === 5 ? "success" : "tap");
    playVoice(BALANCE_AUDIO.q3RemoveNova);
  }

  const dialogue = state.questStep === 0
    ? state.cratePairsRemoved === 5
      ? "Five matching pairs are gone. The crate now balances seven visible blocks."
      : `Fair move ${state.cratePairsRemoved + 1}: remove one extra block from each side.`
    : state.questStep === 1
      ? state.crateScanTested
        ? "Scanner confirmed it—the crate has the same weight as seven blocks!"
        : "The beam is level with only the crate and seven blocks. Run the scanner."
      : state.questStep === 2
        ? "Subtracting five undid plus five. The unknown crate value is seven."
        : state.q3RecapPlayed
          ? "The mystery disappeared because every visible extra block was undone fairly."
          : "Replay the five fair moves and the final scan.";

  return (
    <section className="balance-connected-quest balance-world" aria-label="Reveal the Crate quest">
      <BalanceStage
        title="Reveal the Crate"
        questNumber={3}
        questStep={state.questStep}
        avatar={avatar}
        leftBlocks={remainingExtra}
        rightBlocks={remainingRight}
        tilt="level"
        crate
        crateOpen={state.questStep >= 1 && state.crateScanTested}
        crateValue={7}
        formalEquation={state.questStep >= 2 ? "? + 5 − 5 = 12 − 5  →  ? = 7" : undefined}
        recapRunning={recap.running}
      />
      <QuestDeck
        speaker={state.questStep === 1 && state.crateScanTested ? "YOU" : "NOVA"}
        line={dialogue}
        voice={state.questStep === 0
          ? BALANCE_AUDIO.q3RemoveNova
          : state.questStep === 1
            ? BALANCE_AUDIO.q3ScanKid
            : state.questStep === 2
              ? BALANCE_AUDIO.q3RevealNova
              : BALANCE_AUDIO.q3RecapScout}
        playVoice={playVoice}
      >
        {state.questStep === 0 && (
          <>
            <div>
              <small>UNDO THE VISIBLE EXTRA BLOCKS</small>
              <h2>Remove five matching pairs.</h2>
              <p>The crate stays on the left pan. The beam remains level after every fair move.</p>
            </div>
            <button className="balance-pair-action" type="button" disabled={state.cratePairsRemoved === 5} onClick={removePair}>
              <span>−1</span><b>Remove one matching pair</b><small>{state.cratePairsRemoved}/5 pairs removed</small>
            </button>
            <button className="balance-primary" type="button" disabled={state.cratePairsRemoved !== 5} onClick={() => onChange({ questStep: 1 })}>
              Scan what remains →
            </button>
          </>
        )}
        {state.questStep === 1 && (
          <>
            <div>
              <small>PHYSICAL CHECK</small>
              <h2>The crate balances seven blocks.</h2>
              <p>Scan the level beam before Nova writes the hidden value.</p>
            </div>
            <button
              className="balance-pair-action scan"
              type="button"
              disabled={state.crateScanTested}
              onClick={() => {
                onChange({ crateScanTested: true });
                sound.play("success");
                playVoice(BALANCE_AUDIO.q3ScanKid);
              }}
            >
              <span>◎</span><b>Run the crate scanner</b><small>{state.crateScanTested ? "Match confirmed" : "Compare both pans"}</small>
            </button>
            <button
              className="balance-primary"
              type="button"
              disabled={!state.crateScanTested}
              onClick={() => {
                playVoice(BALANCE_AUDIO.q3RevealNova);
                onChange({ questStep: 2 });
              }}
            >
              Name the unknown value →
            </button>
          </>
        )}
        {state.questStep === 2 && (
          <>
            <div>
              <small>NOVA NAMES THE INVERSE MOVE</small>
              <h2>Subtract five to undo plus five.</h2>
              <p>The crate was not guessed. Its value was revealed by preserving the balance.</p>
            </div>
            <div className="balance-concept-proof"><span>? + 5 = 12</span><b>→</b><span>? = 7</span></div>
            <button className="balance-primary" type="button" onClick={() => onChange({ questStep: 3 })}>
              Replay the crate reveal →
            </button>
          </>
        )}
        {state.questStep === 3 && (
          <>
            <div>
              <small>VISIBLE RECAP</small>
              <h2>Watch the extras leave while the beam stays level.</h2>
              <p>The final seven appears only after the world proves it.</p>
            </div>
            <button className="balance-replay-button" type="button" disabled={recap.running} onClick={recap.play}>
              {recap.running ? "Removing five pairs and scanning…" : state.q3RecapPlayed ? "Play crate reveal again" : "Run the crate replay"}
            </button>
            {state.q3RecapPlayed && (
              <div className="balance-route-proof"><span>crate + 5</span><b>remove 5 from both</b><strong>crate = 7</strong></div>
            )}
            <button
              className="balance-primary"
              type="button"
              disabled={!state.q3RecapPlayed}
              onClick={replay ? onReplayComplete : onComplete}
            >
              {replay ? "Return to my journal →" : personalize("Quest complete, {hero} →", heroName)}
            </button>
          </>
        )}
      </QuestDeck>
    </section>
  );
}

function TestAnotherLockQuest({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  playVoice,
  onChapterComplete,
  onReplayComplete,
}: {
  state: BalanceState;
  onChange: (patch: Partial<BalanceState>) => void;
  replay: boolean;
  heroName: string;
  avatar: string;
  playVoice: (source: string) => void;
  onChapterComplete: () => void;
  onReplayComplete: () => void;
}) {
  const recap = useRecap(
    () => onChange({ q4RecapPlayed: true }),
    playVoice,
    BALANCE_AUDIO.q4FinalScout,
    3700,
  );
  const remainingExtra = Math.max(0, 3 - state.secondLockRemoved);
  const remainingRight = Math.max(5, 8 - state.secondLockRemoved);

  function removePair() {
    const secondLockRemoved = Math.min(3, state.secondLockRemoved + 1);
    onChange({ secondLockRemoved });
    sound.play(secondLockRemoved === 3 ? "success" : "tap");
    playVoice(BALANCE_AUDIO.q4RemoveKid);
  }

  const dialogue = state.questStep === 0
    ? state.secondLockRemoved === 3
      ? "Three fair moves left the backup crate balancing five blocks."
      : "New numbers, same action. Remove the visible extras from both sides."
    : state.questStep === 1
      ? state.secondLockOpened
        ? "Backup lock open! The hidden value is five."
        : "The beam proves the crate matches five. Release the lock."
      : state.questStep === 2
        ? "The same inverse move solved a different equation. That makes it a reusable rule."
        : state.q4RecapPlayed
          ? "Both crate locks are open. Every lab circuit is stable."
          : "Replay both locks and the fair-move rule that opened them.";

  return (
    <section className="balance-connected-quest balance-world" aria-label="Test Another Lock quest">
      <BalanceStage
        title="Test Another Lock"
        questNumber={4}
        questStep={state.questStep}
        avatar={avatar}
        leftBlocks={remainingExtra}
        rightBlocks={remainingRight}
        tilt="level"
        crate
        crateOpen={state.secondLockOpened}
        crateValue={5}
        formalEquation={state.questStep >= 2 ? "? + 3 − 3 = 8 − 3  →  ? = 5" : undefined}
        recapRunning={recap.running}
      />
      <QuestDeck
        speaker={state.questStep === 0 ? "YOU" : "NOVA"}
        line={dialogue}
        voice={state.questStep === 0
          ? BALANCE_AUDIO.q4RemoveKid
          : state.questStep === 1
            ? BALANCE_AUDIO.q4OpenNova
            : state.questStep === 2
              ? BALANCE_AUDIO.q4RevealNova
              : BALANCE_AUDIO.q4FinalScout}
        playVoice={playVoice}
      >
        {state.questStep === 0 && (
          <>
            <div>
              <small>CHANGED LOCK</small>
              <h2>Undo plus three without tipping the beam.</h2>
              <p>This time the right pan begins at eight. Use the action you already proved.</p>
            </div>
            <button className="balance-pair-action" type="button" disabled={state.secondLockRemoved === 3} onClick={removePair}>
              <span>−1</span><b>Remove one matching pair</b><small>{state.secondLockRemoved}/3 pairs removed</small>
            </button>
            <button className="balance-primary" type="button" disabled={state.secondLockRemoved !== 3} onClick={() => onChange({ questStep: 1 })}>
              Release the backup lock →
            </button>
          </>
        )}
        {state.questStep === 1 && (
          <>
            <div>
              <small>STORY RESULT</small>
              <h2>The beam proves the backup crate equals five.</h2>
              <p>Open it because the physical comparison is complete—not because five was selected.</p>
            </div>
            <button
              className="balance-pair-action scan"
              type="button"
              disabled={state.secondLockOpened}
              onClick={() => {
                onChange({ secondLockOpened: true });
                sound.play("success");
                playVoice(BALANCE_AUDIO.q4OpenNova);
              }}
            >
              <span>⌁</span><b>Open the balanced lock</b><small>{state.secondLockOpened ? "Supply circuit restored" : "Use the level-beam proof"}</small>
            </button>
            <button
              className="balance-primary"
              type="button"
              disabled={!state.secondLockOpened}
              onClick={() => {
                playVoice(BALANCE_AUDIO.q4RevealNova);
                onChange({ questStep: 2 });
              }}
            >
              Connect both crate repairs →
            </button>
          </>
        )}
        {state.questStep === 2 && (
          <>
            <div>
              <small>NOVA CONNECTS THE CHAPTER</small>
              <h2>Inverse moves work on changed equations.</h2>
              <p>The numbers changed from five and twelve to three and eight. The fair move stayed the same.</p>
            </div>
            <div className="balance-lock-comparison">
              <span>? + 5 = 12 <b>→ ? = 7</b></span>
              <span>? + 3 = 8 <b>→ ? = 5</b></span>
            </div>
            <button className="balance-primary" type="button" onClick={() => onChange({ questStep: 3 })}>
              Play the full lab repair →
            </button>
          </>
        )}
        {state.questStep === 3 && (
          <>
            <div>
              <small>BALANCE LAB FINALE</small>
              <h2>Every fair move now has a visible reason.</h2>
              <p>Level quantities, matching changes, inverse moves, and transfer all belong to one beam.</p>
            </div>
            <button className="balance-replay-button" type="button" disabled={recap.running} onClick={recap.play}>
              {recap.running ? "Replaying the two crate repairs…" : state.q4RecapPlayed ? "Play Balance Lab again" : "Play the full lab repair"}
            </button>
            {state.q4RecapPlayed && (
              <div className="balance-chapter-proof">
                <span><b>1</b> Make equal</span>
                <span><b>2</b> Move both sides</span>
                <span><b>3</b> Undo extras</span>
                <span><b>4</b> Reuse the rule</span>
              </div>
            )}
            <button
              className="balance-primary"
              type="button"
              disabled={!state.q4RecapPlayed}
              onClick={replay ? onReplayComplete : onChapterComplete}
            >
              {replay ? "Return to my journal →" : personalize("Complete Balance Lab, {hero} →", heroName)}
            </button>
          </>
        )}
      </QuestDeck>
    </section>
  );
}

export function BalanceLabAdventure({
  state,
  onChange,
  replay,
  heroName,
  avatar,
  onFinish,
}: BalanceLabAdventureProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const set = (patch: Partial<BalanceState>) => onChange({ ...state, ...patch });
  const playVoice = useCallback((source: string) => {
    if (!BALANCE_AUDIO_READY) return;
    audioRef.current?.pause();
    const audio = new Audio(source);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.muted = sound.isMuted();
    void audio.play().catch(() => undefined);
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  function startQuest(quest: BalanceQuestId) {
    const questIndex = BALANCE_QUEST_IDS.indexOf(quest);
    const unlocked = questIndex === 0
      || state.completedQuests.includes(BALANCE_QUEST_IDS[questIndex - 1]);
    if (!unlocked) return;
    const alreadyComplete = state.completedQuests.includes(quest);
    const resuming = state.activeQuest === quest && !alreadyComplete;
    const shared: Partial<BalanceState> = {
      chapterMapOpen: false,
      activeQuest: quest,
      step: questIndex,
      questStep: resuming ? state.questStep : 0,
    };
    if (resuming) {
      set(shared);
      return;
    }
    if (quest === "keep-it-level") {
      set({
        ...shared,
        q1OpeningBeat: 0,
        q1OpeningComplete: false,
        leftLoad: 0,
        rightLoad: 0,
        levelRunTested: false,
        transferLoad: 0,
        q1TransferComplete: false,
        q1RecapPlayed: false,
      });
      return;
    }
    if (quest === "same-move-both-sides") {
      set({
        ...shared,
        q2OpeningBeat: 0,
        q2OpeningComplete: false,
        oneSideRemoved: false,
        fairnessRestored: false,
        pairedRemoval: 0,
        pairedRemovalComplete: false,
        q2RecapPlayed: false,
      });
      return;
    }
    if (quest === "reveal-the-crate") {
      set({
        ...shared,
        q3OpeningBeat: 0,
        q3OpeningComplete: false,
        cratePairsRemoved: 0,
        crateScanTested: false,
        q3RecapPlayed: false,
      });
      return;
    }
    set({
      ...shared,
      q4OpeningBeat: 0,
      q4OpeningComplete: false,
      secondLockRemoved: 0,
      secondLockOpened: false,
      q4RecapPlayed: false,
    });
  }

  function finishQuest(quest: BalanceQuestId) {
    const completedQuests = [
      ...new Set<BalanceQuestId>([
        ...state.completedQuests,
        quest,
      ]),
    ];
    sound.play("finale");
    set({
      completedQuests,
      chapterMapOpen: true,
      activeQuest: null,
      step: BALANCE_QUEST_IDS.indexOf(quest),
    });
  }

  function finishBalanceChapter() {
    const finalState: BalanceState = {
      ...state,
      completedQuests: [...BALANCE_QUEST_IDS],
      chapterMapOpen: true,
      activeQuest: null,
      step: 4,
    };
    onChange(finalState);
    onFinish(finalState);
  }

  if (state.chapterMapOpen && !replay) {
    return (
      <BalanceQuestMap
        state={state}
        heroName={heroName}
        avatar={avatar}
        onStart={startQuest}
      />
    );
  }

  const activeQuest = replay
    ? BALANCE_QUEST_IDS[Math.min(state.step, BALANCE_QUEST_IDS.length - 1)]
    : state.activeQuest ?? "keep-it-level";

  if (activeQuest === "keep-it-level" && !state.q1OpeningComplete) {
    return (
      <BalanceOpening
        label="Keep It Level"
        lines={Q1_OPENING}
        beat={state.q1OpeningBeat}
        onBeat={(q1OpeningBeat) => set({ q1OpeningBeat })}
        onComplete={() => set({ q1OpeningComplete: true, questStep: 0 })}
        avatar={avatar}
        playVoice={playVoice}
      />
    );
  }
  if (activeQuest === "same-move-both-sides" && !state.q2OpeningComplete) {
    return (
      <BalanceOpening
        label="Same Move, Both Sides"
        lines={Q2_OPENING}
        beat={state.q2OpeningBeat}
        onBeat={(q2OpeningBeat) => set({ q2OpeningBeat })}
        onComplete={() => set({ q2OpeningComplete: true, questStep: 0 })}
        avatar={avatar}
        playVoice={playVoice}
      />
    );
  }
  if (activeQuest === "reveal-the-crate" && !state.q3OpeningComplete) {
    return (
      <BalanceOpening
        label="Reveal the Crate"
        lines={Q3_OPENING}
        beat={state.q3OpeningBeat}
        onBeat={(q3OpeningBeat) => set({ q3OpeningBeat })}
        onComplete={() => set({ q3OpeningComplete: true, questStep: 0 })}
        avatar={avatar}
        playVoice={playVoice}
      />
    );
  }
  if (activeQuest === "test-another-lock" && !state.q4OpeningComplete) {
    return (
      <BalanceOpening
        label="Test Another Lock"
        lines={Q4_OPENING}
        beat={state.q4OpeningBeat}
        onBeat={(q4OpeningBeat) => set({ q4OpeningBeat })}
        onComplete={() => set({ q4OpeningComplete: true, questStep: 0 })}
        avatar={avatar}
        playVoice={playVoice}
      />
    );
  }

  if (activeQuest === "same-move-both-sides") {
    return (
      <SameMoveQuest
        state={state}
        onChange={set}
        replay={replay}
        heroName={heroName}
        avatar={avatar}
        playVoice={playVoice}
        onComplete={() => finishQuest("same-move-both-sides")}
        onReplayComplete={() => onFinish(state)}
      />
    );
  }
  if (activeQuest === "reveal-the-crate") {
    return (
      <RevealCrateQuest
        state={state}
        onChange={set}
        replay={replay}
        heroName={heroName}
        avatar={avatar}
        playVoice={playVoice}
        onComplete={() => finishQuest("reveal-the-crate")}
        onReplayComplete={() => onFinish(state)}
      />
    );
  }
  if (activeQuest === "test-another-lock") {
    return (
      <TestAnotherLockQuest
        state={state}
        onChange={set}
        replay={replay}
        heroName={heroName}
        avatar={avatar}
        playVoice={playVoice}
        onChapterComplete={finishBalanceChapter}
        onReplayComplete={() => onFinish(state)}
      />
    );
  }
  return (
    <KeepItLevelQuest
      state={state}
      onChange={set}
      replay={replay}
      heroName={heroName}
      avatar={avatar}
      playVoice={playVoice}
      onComplete={() => finishQuest("keep-it-level")}
      onReplayComplete={() => onFinish(state)}
    />
  );
}
