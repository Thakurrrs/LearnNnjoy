"use client";

import { SparkleBurst } from "@/components/sparkle-burst";
import {
  WorldActionDeck,
  WorldHud,
  WorldNova,
  WorldReward,
} from "@/components/continuous-adventure-ui";
import { CRICKET_PLAYERS, topCricketPlayers } from "@/lib/grade-seven-worlds";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import type { CricketState } from "@/lib/grade-seven-progress";

type CricketDataAdventureProps = {
  state: CricketState;
  onChange: (state: CricketState) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  onFinish: () => void;
};

const DATA_REASON = "Their score bars are the three highest";
const expectedSquad = topCricketPlayers(3);

function squadComplete(picked: readonly string[]) {
  return picked.length === expectedSquad.length
    && expectedSquad.every((name) => picked.includes(name));
}

function dialogueFor(state: CricketState, heroName: string) {
  if (state.step === 0) {
    return personalize("{hero}, choosing only my friends feels unfair. Help me read the match data!", heroName);
  }
  if (state.step === 1 && state.showDemo) {
    return "Ira's bar reaches 21. Asha's reaches 42—twice as high.";
  }
  if (state.step === 1 && state.topPlayer === "Asha") {
    return "Asha's bar reaches 42. It is the tallest and shows the greatest score.";
  }
  if (state.step === 1 && state.topPlayer) {
    return "Compare every bar top. The greatest score reaches the highest point.";
  }
  if (state.step === 1) return "Tap the bar that reaches the greatest score.";
  if (state.step === 2 && squadComplete(state.picked)) {
    return "Asha, Kabir and Noor own the three highest bars. The field matches the chart.";
  }
  if (state.step === 2 && state.picked.length > 0) {
    return `${state.picked.length} squad places filled. Compare the remaining bar heights.`;
  }
  if (state.step === 2) return "Build the squad by tapping the three highest bars.";
  if (state.step === 3 && state.reason === DATA_REASON) {
    return "That reason comes directly from the chart. The choice is evidence-based.";
  }
  if (state.step === 3 && state.reason) {
    return "Practice matters, but this chart contains match scores—not practice time.";
  }
  if (state.step === 3) return "The coach asks what evidence supports the squad.";
  if (state.step === 4 && state.successChoice === DATA_REASON) {
    return "The bars, scores and squad all agree. Send the team!";
  }
  if (state.step === 4 && state.successChoice) {
    return "A reason must use information visible in this chart.";
  }
  return personalize("The squad is ready, {hero}. Your data made the decision fair!", heroName);
}

function CricketDataStage({
  state,
  heroName,
  onChange,
}: {
  state: CricketState;
  heroName: string;
  onChange: (state: CricketState) => void;
}) {
  const set = (patch: Partial<CricketState>) => onChange({ ...state, ...patch });
  const thinking = (!!state.topPlayer && state.topPlayer !== "Asha")
    || (!!state.reason && state.reason !== DATA_REASON)
    || (!!state.successChoice && state.successChoice !== DATA_REASON);

  function choosePlayer(name: string) {
    if (state.step === 1) {
      sound.play(name === "Asha" ? "success" : "tap");
      set({ topPlayer: name });
      return;
    }
    if (state.step !== 2) return;
    const alreadyPicked = state.picked.includes(name);
    const picked = alreadyPicked
      ? state.picked.filter((player) => player !== name)
      : state.picked.length < 3 ? [...state.picked, name] : state.picked;
    sound.play(squadComplete(picked) ? "success" : "tap");
    set({ picked });
  }

  return (
    <div className={`cricket-world-stage scene-${state.step}${state.step >= 5 ? " victory" : ""}`}>
      <WorldHud label="FINAL MATCH DATA ROOM" step={state.step} />
      <div className="cricket-floodlights" aria-hidden><i /><i /><i /><i /></div>
      <div className="cricket-crowd" aria-hidden>●●●●●●●●●●●●●●●●●●●●●●●●</div>
      <div className="cricket-boundary" aria-hidden />

      <WorldNova label="TEAM RADIO" thinking={thinking}>
        {dialogueFor(state, heroName)}
      </WorldNova>

      <div className="stadium-scoreboard">
        <header><span>MATCH SCORE</span><b>RUNS</b></header>
        <div className="stadium-grid-lines" aria-hidden>{[10, 20, 30, 40].map((score) => <i key={score}><small>{score}</small></i>)}</div>
        <div className="stadium-bars" aria-label="Player match score bar chart">
          {CRICKET_PLAYERS.map((player) => {
            const selected = state.step === 1
              ? state.topPlayer === player.name
              : state.picked.includes(player.name);
            const demonstrated = state.step === 1 && state.showDemo && (player.name === "Asha" || player.name === "Ira");
            return (
              <button
                key={player.name}
                className={`${selected ? "selected" : ""}${demonstrated ? " demonstrated" : ""}`}
                disabled={(state.step === 1 && state.showDemo) || (state.step !== 1 && state.step !== 2)}
                onClick={() => choosePlayer(player.name)}
                aria-pressed={selected}
              >
                <span style={{ height: `${player.score * 4.2}px` }}><b>{player.score}</b></span>
                <small>{player.name}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="cricket-squad-field" aria-live="polite">
        <small>YOUR SQUAD</small>
        <div>
          {state.picked.map((name) => <b key={name}><span>🏏</span><small>{name}</small></b>)}
          {Array.from({ length: Math.max(0, 3 - state.picked.length) }, (_, index) => <i key={index}>?</i>)}
        </div>
      </div>

      {state.step === 3 && (
        <div className="cricket-press-desk">
          <small>COACH&apos;S QUESTION</small>
          <strong>Why does the chart support this squad?</strong>
          {[DATA_REASON, "They practised the most this week"].map((choice) => (
            <button
              key={choice}
              className={state.reason === choice ? choice === DATA_REASON ? "selected correct" : "selected" : ""}
              onClick={() => { sound.play(choice === DATA_REASON ? "success" : "tap"); set({ reason: choice }); }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {state.step === 4 && (
        <div className="cricket-team-sheet">
          <small>FINAL TEAM SHEET</small>
          <strong>Which evidence belongs beside their names?</strong>
          {[DATA_REASON, "They practised the most this week", "They were chosen first"].map((choice) => (
            <button
              key={choice}
              className={state.successChoice === choice ? choice === DATA_REASON ? "selected correct" : "selected" : ""}
              onClick={() => {
                sound.play(choice === DATA_REASON ? "success" : "tap");
                set({ successChoice: choice });
              }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {state.step >= 5 && (
        <div className="cricket-world-finale" aria-live="polite">
          <SparkleBurst playKey="cricket-world-complete" />
          <span aria-hidden>🏏　🏆　🏏</span>
          <small>SQUAD ANNOUNCED</small>
          <h2>The chart made every place fair.</h2>
          <p>Asha 42 · Kabir 37 · Noor 35.</p>
        </div>
      )}
    </div>
  );
}

export function CricketDataAdventure({
  state,
  onChange,
  firstTime,
  replay,
  heroName,
  onFinish,
}: CricketDataAdventureProps) {
  const set = (patch: Partial<CricketState>) => onChange({ ...state, ...patch });
  const complete = squadComplete(state.picked);

  return (
    <section className="world-adventure cricket-world" aria-label="Cricket Data Room bar chart adventure">
      <CricketDataStage state={state} heroName={heroName} onChange={onChange} />

      {state.step === 0 && (
        <WorldActionDeck
          eyebrow="FINAL MATCH SELECTION"
          title="Four score bars must become a three-player squad."
          description="The chart shows match runs. Friendship alone cannot explain the selection."
        >
          <button className="primary" onClick={() => set({ step: 1 })}>Enter the data room →</button>
        </WorldActionDeck>
      )}

      {state.step === 1 && state.showDemo && (
        <WorldActionDeck
          eyebrow="NOVA READS THE REAL SCOREBOARD"
          title="A taller bar represents a greater number."
          description="Ira reaches 21. Asha reaches 42, which is twice as high."
        >
          <button className="primary" onClick={() => set({ showDemo: false })}>Read the bars myself →</button>
        </WorldActionDeck>
      )}

      {state.step === 1 && !state.showDemo && (
        <WorldActionDeck
          eyebrow="YOUR FIRST READ"
          title="Tap the player with the highest score bar."
          description="Compare both the bar tops and the numbers printed on them."
        >
          <button className="primary" disabled={state.topPlayer !== "Asha"} onClick={() => set({ step: 2 })}>Build the whole squad →</button>
        </WorldActionDeck>
      )}

      {state.step === 2 && (
        <WorldActionDeck
          eyebrow="SELECT THREE PLAYERS"
          title="Tap the three highest bars."
          description="Each selected player appears on the same stadium field."
        >
          <button className="primary" disabled={!complete} onClick={() => set({ step: 3 })}>Explain the selection →</button>
        </WorldActionDeck>
      )}

      {state.step === 3 && (
        <WorldActionDeck
          eyebrow="USE THE CHART'S EVIDENCE"
          title="Answer the coach inside the stadium."
          description="A strong reason must use information the graph actually displays."
        >
          <button className="primary" disabled={state.reason !== DATA_REASON} onClick={() => set({ step: 4 })}>Prepare the team sheet →</button>
        </WorldActionDeck>
      )}

      {state.step === 4 && (
        <WorldActionDeck
          eyebrow="FINAL DATA CHECK"
          title="Attach the evidence to the squad."
          description="The three tallest bars must match the three selected names."
        >
          <button className="primary" disabled={state.successChoice !== DATA_REASON} onClick={() => set({ step: 5 })}>Announce the squad →</button>
        </WorldActionDeck>
      )}

      {state.step === 5 && (
        <WorldActionDeck
          eyebrow={replay ? "JOURNAL REPLAY COMPLETE" : "DATA ROOM COMPLETE"}
          title={personalize("The final squad is ready, {hero}.", heroName)}
          description="The bar graph made four scores easy to compare fairly."
        >
          <WorldReward replay={replay} firstTime={firstTime} />
          <button className="primary" onClick={onFinish}>
            {replay ? "Return to my journal →" : "Return to the star map →"}
          </button>
        </WorldActionDeck>
      )}
    </section>
  );
}
