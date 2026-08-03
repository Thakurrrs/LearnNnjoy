"use client";

import Image from "next/image";
import {
  MOONBASE_QUEST_IDS,
  type MoonbaseQuestId,
  type MoonbaseState,
} from "@/lib/grade-seven-progress";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";

type MoonbaseTenfoldAdventureProps = {
  state: MoonbaseState;
  onChange: (state: MoonbaseState) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  avatar: string;
  onFinish: (state?: MoonbaseState) => void;
};

const PLACE_VALUES = [1, 10, 100, 1_000, 10_000, 100_000] as const;
const PLACE_LABELS = ["ones", "tens", "hundreds", "thousands", "ten-thousands", "lakhs"] as const;

const QUESTS: readonly {
  id: MoonbaseQuestId;
  title: string;
  concept: string;
  mission: string;
}[] = [
  {
    id: "tenfold-telescope",
    title: "The Telescope Wakes",
    concept: "A place changes a digit’s value",
    mission: "Follow Blink’s signal through the telescope’s tenfold zoom rings.",
  },
  {
    id: "rebuild-coordinate",
    title: "Rebuild the Coordinate",
    concept: "Compose and decompose a large number",
    mission: "Bundle location units and rebuild Blink’s complete coordinate.",
  },
  {
    id: "two-mission-controls",
    title: "Two Mission Controls",
    concept: "Indian and international grouping",
    mission: "Send one unchanged coordinate to two stations that group its digits differently.",
  },
  {
    id: "catch-the-comet",
    title: "Catch the Comet",
    concept: "Compare and estimate large numbers",
    mission: "Choose the correct trail, aim quickly with an estimate, and capture the exact photograph.",
  },
] as const;

const OPENING_LINES: Record<MoonbaseQuestId, readonly { speaker: "NOVA" | "YOU" | "BLINK"; line: string }[]> = {
  "tenfold-telescope": [
    { speaker: "BLINK", line: "Beep-beep! I found the comet bloom—whoa, it is fast!" },
    { speaker: "YOU", line: "Blink followed it beyond the telescope map." },
    { speaker: "NOVA", line: "His signal is still blinking. Take the zoom wheel—we can follow it." },
  ],
  "rebuild-coordinate": [
    { speaker: "BLINK", line: "Bzzzt… coordinate pieces incoming!" },
    { speaker: "YOU", line: "They are arriving as tiny location units." },
    { speaker: "NOVA", line: "Let’s click every ten matching units into one bigger bundle." },
  ],
  "two-mission-controls": [
    { speaker: "NOVA", line: "Delhi Mission Control is ready for Blink’s coordinate." },
    { speaker: "YOU", line: "The world station wants the same location too." },
    { speaker: "BLINK", line: "Same comet, two display styles. Please don’t send me to two places!" },
  ],
  "catch-the-comet": [
    { speaker: "BLINK", line: "Two bright trails ahead—I can’t tell which one is ours!" },
    { speaker: "NOVA", line: "We’ll compare the coordinates before moving the telescope." },
    { speaker: "YOU", line: "Then we aim with a quick estimate and focus on the exact spot." },
  ],
};

function heroAsset(avatar: string) {
  if (avatar === "boy") return "/images/skatepark-night-run/hero-boy-active.png";
  if (avatar === "girl") return "/images/skatepark-night-run/hero-girl-active.png";
  return "/images/skatepark-night-run/hero-explorer-active.png";
}

function QuestMap({
  state,
  heroName,
  avatar,
  onStart,
}: {
  state: MoonbaseState;
  heroName: string;
  avatar: string;
  onStart: (quest: MoonbaseQuestId) => void;
}) {
  const completed = new Set(state.completedQuests);
  return (
    <section className="moonbase-map" aria-label="Moonbase Tenfold quest map" data-learning-landmark="moonbase-quest-map">
      <div className="moonbase-stars" aria-hidden="true" />
      <header className="moonbase-map-heading">
        <div>
          <small>LARGE NUMBERS · ONE COMET MISSION</small>
          <h1>Moonbase Tenfold</h1>
          <p>{personalize("{hero}, help Nova find Blink and photograph the comet bloom.", heroName)}</p>
        </div>
        <strong>{completed.size}<span> OF 4 QUESTS</span></strong>
      </header>
      <div className="moonbase-map-cast" aria-hidden="true">
        <Image src="/images/skatepark-night-run/nova-curious.png" alt="" width={360} height={530} priority />
        <Image src={heroAsset(avatar)} alt="" width={360} height={530} priority />
        <div className="blink-drone"><i /><b>✦</b><i /></div>
      </div>
      <div className="moonbase-route">
        {QUESTS.map((quest, index) => {
          const complete = completed.has(quest.id);
          const unlocked = index === 0 || completed.has(QUESTS[index - 1].id);
          const current = state.activeQuest === quest.id && !complete;
          return (
            <article key={quest.id} className={`${complete ? "complete" : ""}${current ? " current" : ""}${!unlocked ? " locked" : ""}`}>
              <div><span>QUEST {index + 1}</span><b>{complete ? "COMPLETE" : unlocked ? "READY" : "LOCKED"}</b></div>
              <h2>{quest.title}</h2>
              <p className="moonbase-concept">{quest.concept}</p>
              <p>{quest.mission}</p>
              <button type="button" disabled={!unlocked} onClick={() => onStart(quest.id)}>
                {complete ? "Replay quest" : current ? "Continue here" : unlocked ? "Start quest" : `Finish Quest ${index} first`}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StoryOpening({
  quest,
  state,
  avatar,
  onChange,
}: {
  quest: MoonbaseQuestId;
  state: MoonbaseState;
  avatar: string;
  onChange: (patch: Partial<MoonbaseState>) => void;
}) {
  const lines = OPENING_LINES[quest];
  const beat = Math.min(state.openingBeat, lines.length - 1);
  const current = lines[beat];
  return (
    <section className={`moonbase-story moonbase-opening moonbase-opening-${quest}`} aria-label={`${QUESTS.find((item) => item.id === quest)?.title} opening`}>
      <div className="moonbase-stars" aria-hidden="true" />
      <div className="moonbase-window" aria-hidden="true"><span className="comet-bloom">✦</span><span className="comet-tail" /></div>
      <div className="moonbase-opening-cast" aria-hidden="true">
        <Image className="moonbase-nova" src="/images/skatepark-night-run/nova-curious.png" alt="" width={430} height={630} priority />
        <Image className="moonbase-hero" src={heroAsset(avatar)} alt="" width={430} height={630} priority />
        <div className="blink-drone"><i /><b>✦</b><i /></div>
      </div>
      <div className={`moonbase-comic moonbase-speaker-${current.speaker.toLowerCase()}`}>
        <small>{current.speaker === "YOU" ? "YOU" : current.speaker}</small>
        <p>{current.line}</p>
      </div>
      <div className="moonbase-story-progress" aria-label={`Dialogue ${beat + 1} of ${lines.length}`}>
        {lines.map((_, index) => <i key={index} className={index <= beat ? "active" : ""} />)}
      </div>
      <button
        type="button"
        className="moonbase-next-line"
        onClick={() => {
          sound.play("tap");
          if (beat < lines.length - 1) onChange({ openingBeat: beat + 1 });
          else onChange({ openingComplete: true, questStep: 0 });
        }}
      >
        {beat < lines.length - 1 ? "Next line →" : "Take control →"}
      </button>
    </section>
  );
}

function MoonbaseStage({
  state,
  avatar,
  heroName,
  replay,
  firstTime,
  onChange,
  onQuestComplete,
  onChapterComplete,
}: {
  state: MoonbaseState;
  avatar: string;
  heroName: string;
  replay: boolean;
  firstTime: boolean;
  onChange: (patch: Partial<MoonbaseState>) => void;
  onQuestComplete: () => void;
  onChapterComplete: () => void;
}) {
  const quest = state.activeQuest ?? "tenfold-telescope";
  const questIndex = MOONBASE_QUEST_IDS.indexOf(quest);
  const value = 6 * PLACE_VALUES[state.telescopePlace];

  return (
    <section className={`moonbase-story moonbase-stage moonbase-quest-${quest}`} aria-label={QUESTS[questIndex].title}>
      <div className="moonbase-stars" aria-hidden="true" />
      <header className="moonbase-stage-header">
        <div><small>QUEST {questIndex + 1} · {QUESTS[questIndex].concept}</small><h1>{QUESTS[questIndex].title}</h1></div>
        <span>{state.questStep + 1}/4</span>
      </header>
      <div className="moonbase-scene">
        <div className="moonbase-side-cast" aria-hidden="true">
          <Image src="/images/skatepark-night-run/nova-point.png" alt="" width={280} height={410} />
          <Image src={heroAsset(avatar)} alt="" width={280} height={410} />
          <div className="blink-drone"><i /><b>✦</b><i /></div>
        </div>

        {quest === "tenfold-telescope" && (
          <div className="telescope-lab">
            <div className={`tenfold-view zoom-${state.telescopePlace}`} aria-label={`Telescope showing the digit 6 in the ${PLACE_LABELS[state.telescopePlace]} place`}>
              {PLACE_VALUES.map((place, index) => <i key={place} className={index <= state.telescopePlace ? "awake" : ""} />)}
              <div className="blink-signal">✦<span>BLINK</span></div>
              <strong>{value.toLocaleString("en-IN")}</strong>
            </div>
            <div className="moonbase-control">
              <p><b>Slide the telescope through the place-value rings.</b> Watch what the same digit represents.</p>
              <input
                aria-label="Telescope place-value zoom"
                type="range"
                min="0"
                max="5"
                value={state.telescopePlace}
                onChange={(event) => {
                  sound.play("tap");
                  onChange({ telescopePlace: Number(event.target.value), telescopeTested: true });
                }}
              />
              <div className="place-readout"><span>SAME DIGIT</span><b>6</b><span>VALUE NOW</span><strong>{value.toLocaleString("en-IN")}</strong></div>
              {state.telescopePlace === 5 && state.telescopeTested && (
                <button type="button" onClick={() => onChange({ questStep: 3 })}>Lock onto Blink’s outer signal →</button>
              )}
            </div>
            {state.questStep === 3 && (
              <div className="nova-discovery">
                <small>NOVA NOTICES</small>
                <p>“The six did not grow, {heroName || "friend"}. Its <b>place</b> changed—so its value became ten times greater at every step.”</p>
                <button type="button" onClick={onQuestComplete}>{replay ? "Return to journal →" : "Follow the coordinate pieces →"}</button>
              </div>
            )}
          </div>
        )}

        {quest === "rebuild-coordinate" && (
          <div className="coordinate-lab">
            <div className={`bundle-machine level-${state.bundleLevel}`}>
              <div className="unit-swarm">{Array.from({ length: 10 }, (_, index) => <i key={index}>✦</i>)}</div>
              <div className="bundle-core"><span>{state.bundleLevel === 0 ? "10 units" : `10 ${PLACE_LABELS[state.bundleLevel - 1]}`}</span><b>{state.bundleLevel < 4 ? "⇢" : "✓"}</b><strong>{state.bundleLevel === 0 ? "1 ten" : `1 ${PLACE_LABELS[state.bundleLevel]}`}</strong></div>
            </div>
            <div className="moonbase-control">
              <p><b>Click ten matching location units into one larger bundle.</b> Blink’s coordinate will assemble beside the real star map.</p>
              {state.bundleLevel < 4 ? (
                <button type="button" onClick={() => { sound.play("success"); onChange({ bundleLevel: state.bundleLevel + 1 }); }}>
                  Bundle ten into one {PLACE_LABELS[state.bundleLevel + 1]} →
                </button>
              ) : !state.coordinateBuilt ? (
                <button type="button" onClick={() => { sound.play("finale"); onChange({ coordinateBuilt: true, questStep: 3 }); }}>
                  Dock the coordinate modules →
                </button>
              ) : null}
              <div className={`coordinate-modules ${state.coordinateBuilt ? "built" : ""}`}>
                {[6, 4, 2, 3, 8, 5, 1, 0].map((digit, index) => <i key={index}>{digit}</i>)}
              </div>
            </div>
            {state.coordinateBuilt && (
              <div className="nova-discovery">
                <small>NOVA NOTICES</small>
                <p>“There it is: <b>6,42,38,510</b>. One large coordinate, built from the value held by every place.”</p>
                <button type="button" onClick={onQuestComplete}>{replay ? "Return to journal →" : "Send it to Mission Control →"}</button>
              </div>
            )}
          </div>
        )}

        {quest === "two-mission-controls" && (
          <div className="grouping-lab">
            <div className="grouping-coordinate" aria-label="The unchanged coordinate 64238510">
              <span>6</span><span>4</span><span>2</span><span>3</span><span>8</span><span>5</span><span>1</span><span>0</span>
              <div className="signal-thread" />
            </div>
            <div className="mission-control-cards">
              <button type="button" className={state.indiaGroupingSeen ? "seen" : ""} onClick={() => { sound.play("tap"); onChange({ indiaGroupingSeen: true }); }}>
                <small>DELHI MISSION CONTROL</small><b>6,42,38,510</b><span>6 crore 42 lakh 38 thousand 510</span>
              </button>
              <button type="button" className={state.worldGroupingSeen ? "seen" : ""} onClick={() => { sound.play("tap"); onChange({ worldGroupingSeen: true }); }}>
                <small>WORLD RESEARCH STATION</small><b>64,238,510</b><span>64 million 238 thousand 510</span>
              </button>
            </div>
            {state.indiaGroupingSeen && state.worldGroupingSeen && !state.groupingConfirmed && (
              <button className="moonbase-main-action" type="button" onClick={() => { sound.play("success"); onChange({ groupingConfirmed: true, questStep: 3 }); }}>
                Send the unchanged coordinate to both stations →
              </button>
            )}
            {state.groupingConfirmed && (
              <div className="nova-discovery">
                <small>BLINK CHECKS THE MAP</small>
                <p>“Phew! The commas changed teams, but my location did not move. Both displays mean the <b>same number</b>.”</p>
                <button type="button" onClick={onQuestComplete}>{replay ? "Return to journal →" : "Catch the comet →"}</button>
              </div>
            )}
          </div>
        )}

        {quest === "catch-the-comet" && (
          <div className="comet-lab">
            {state.questStep === 0 && (
              <>
                <p className="comet-prompt">Blink reports that the comet entered the <b>lower-numbered</b> trail. Compare from the greatest place first.</p>
                <div className="comet-trails">
                  <button type="button" className={state.cometChoice === "true" ? "selected correct" : ""} onClick={() => { sound.play("success"); onChange({ cometChoice: "true", questStep: 1 }); }}>
                    <span className="mini-comet">✦</span><small>TRAIL A</small><b>6,42,38,510</b>
                  </button>
                  <button type="button" className={state.cometChoice === "near" ? "selected" : ""} onClick={() => { sound.play("tap"); onChange({ cometChoice: "near" }); }}>
                    <span className="mini-comet">✦</span><small>TRAIL B</small><b>6,43,28,105</b>
                  </button>
                </div>
                {state.cometChoice === "near" && <p className="gentle-nudge">The crore places match. At the lakh place, 42 is lower than 43—try the other trail.</p>}
              </>
            )}
            {state.questStep === 1 && (
              <div className="rounding-console">
                <p><b>The telescope needs a quick target to the nearest lakh.</b> Which estimate keeps 6,42,38,510 nearest to its true position?</p>
                {[64_000_000, 64_200_000, 65_000_000].map((choice) => (
                  <button key={choice} type="button" onClick={() => {
                    if (choice === 64_200_000) {
                      sound.play("success");
                      onChange({ roundedChoice: choice, questStep: 2 });
                    } else {
                      sound.play("tap");
                      onChange({ roundedChoice: choice });
                    }
                  }}>{choice.toLocaleString("en-IN")}</button>
                ))}
                {state.roundedChoice !== null && state.roundedChoice !== 64_200_000 && <p className="gentle-nudge">Look at the ten-thousands digit: 3 keeps 42 lakh unchanged.</p>}
              </div>
            )}
            {state.questStep === 2 && (
              <div className="telescope-aim">
                <div className={state.telescopeAimed ? "aim-ring locked" : "aim-ring"}><span className="comet-bloom">✦</span></div>
                <p>Estimate locked at <b>6,42,00,000</b>. Now the exact coordinate sharpens the lens.</p>
                {!state.telescopeAimed ? (
                  <button type="button" onClick={() => { sound.play("success"); onChange({ telescopeAimed: true }); }}>Focus on 6,42,38,510 →</button>
                ) : (
                  <button type="button" onClick={() => { sound.play("finale"); onChange({ photoCaptured: true, questStep: 3 }); }}>Capture the comet bloom ✦</button>
                )}
              </div>
            )}
            {state.questStep === 3 && state.photoCaptured && (
              <div className="moonbase-finale world-finale">
                <div className="dome-photo" aria-label="Blink and the comet bloom projected across the moonbase dome"><span>✦</span><i /><b>BLINK’S COMET BLOOM</b></div>
                <div className="finale-cast">
                  <Image src="/images/skatepark-night-run/nova-celebrate.png" alt="Nova celebrates" width={260} height={380} />
                  <Image src={heroAsset(avatar)} alt="" width={260} height={380} />
                </div>
                <div>
                  <small>MISSION COMPLETE</small>
                  <h2>The whole moonbase lights up with your photograph.</h2>
                  <p>Nova grins: “Exact found the comet. Rounded helped us aim quickly. And every digit did its own place-value job.”</p>
                  <p className="moonbase-reward">{replay ? "📖 Live progress stayed safe" : firstTime ? "🪙 +25 Lumina coins" : "✨ Star already lit"}</p>
                  <button type="button" onClick={onChapterComplete}>{replay ? "Return to my journal →" : "Complete Moonbase Tenfold →"}</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function MoonbaseTenfoldAdventure({
  state,
  onChange,
  firstTime,
  replay,
  heroName,
  avatar,
  onFinish,
}: MoonbaseTenfoldAdventureProps) {
  const set = (patch: Partial<MoonbaseState>) => onChange({ ...state, ...patch });

  function startQuest(quest: MoonbaseQuestId) {
    const index = MOONBASE_QUEST_IDS.indexOf(quest);
    const unlocked = index === 0 || state.completedQuests.includes(MOONBASE_QUEST_IDS[index - 1]);
    if (!unlocked) return;
    const resuming = state.activeQuest === quest && !state.completedQuests.includes(quest);
    set({
      chapterMapOpen: false,
      activeQuest: quest,
      step: index,
      questStep: resuming ? state.questStep : 0,
      openingBeat: resuming ? state.openingBeat : 0,
      openingComplete: resuming ? state.openingComplete : false,
    });
  }

  function completeQuest() {
    const quest = state.activeQuest ?? "tenfold-telescope";
    if (replay) {
      onFinish(state);
      return;
    }
    const completedQuests = [...new Set<MoonbaseQuestId>([...state.completedQuests, quest])];
    const currentIndex = MOONBASE_QUEST_IDS.indexOf(quest);
    const nextQuest = MOONBASE_QUEST_IDS[currentIndex + 1];
    sound.play("success");
    if (!nextQuest) return;
    set({
      completedQuests,
      activeQuest: nextQuest,
      chapterMapOpen: false,
      step: currentIndex + 1,
      questStep: 0,
      openingBeat: 0,
      openingComplete: false,
    });
  }

  function finishChapter() {
    const finalState: MoonbaseState = {
      ...state,
      completedQuests: [...MOONBASE_QUEST_IDS],
      chapterMapOpen: true,
      activeQuest: null,
      step: 4,
      photoCaptured: true,
    };
    onChange(finalState);
    onFinish(finalState);
  }

  if (state.chapterMapOpen && !replay) {
    return <QuestMap state={state} heroName={heroName} avatar={avatar} onStart={startQuest} />;
  }

  const activeQuest = replay
    ? MOONBASE_QUEST_IDS[Math.min(state.step, MOONBASE_QUEST_IDS.length - 1)]
    : state.activeQuest ?? "tenfold-telescope";
  const playState = activeQuest === state.activeQuest ? state : { ...state, activeQuest };

  if (!playState.openingComplete) {
    return <StoryOpening quest={activeQuest} state={playState} avatar={avatar} onChange={set} />;
  }

  return (
    <MoonbaseStage
      state={playState}
      avatar={avatar}
      heroName={heroName}
      replay={replay}
      firstTime={firstTime}
      onChange={set}
      onQuestComplete={completeQuest}
      onChapterComplete={replay ? () => onFinish(state) : finishChapter}
    />
  );
}
