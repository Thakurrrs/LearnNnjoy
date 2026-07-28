"use client";

import { useState } from "react";
import { sound } from "@/lib/sound";
import { HandAngleControl, supportsHandControl } from "@/components/hand-angle-control";
import { NovaShows } from "@/components/nova-shows";
import { SparkleBurst } from "@/components/sparkle-burst";
import { personalize } from "@/lib/personalize";
import type {
  BalanceState,
  CricketState,
  GradeSevenActivityMode,
  GradeSevenAdventureId,
  GradeSevenInteractionState,
  MountainState,
  ShopState,
  SkateparkState,
} from "@/lib/grade-seven-progress";

export type { GradeSevenAdventureId } from "@/lib/grade-seven-progress";

export type GradeSevenChapter = {
  id: GradeSevenAdventureId;
  icon: string;
  title: string;
  topic: string;
  subtopics: string[];
  intro: string;
  action: string;
};

export const gradeSevenAdventures: GradeSevenChapter[] = [
  { id: "mountain", icon: "🏔️", title: "Mountain Rescue", topic: "Integers", subtopics: ["Positive and negative positions", "Number-line movement", "Addition and subtraction"], intro: "{hero}! A storm knocked my rescue pod off the cliff. Help me find it?", action: "Explore integers" },
  { id: "balance", icon: "⚖️", title: "Balance Lab", topic: "Simple Equations", subtopics: ["Equality", "Inverse operations", "Solving for an unknown"], intro: "{hero}, this crate won't open until the scale balances. I can't do it alone!", action: "Explore equations" },
  { id: "shop", icon: "🛍️", title: "Smart Shopper", topic: "Comparing Quantities", subtopics: ["Percentages as fractions", "Discounts", "Comparing final prices"], intro: "{hero}, two shops claim they have the better deal. Help me check?", action: "Explore percentages" },
  { id: "skatepark", icon: "🛹", title: "Skatepark Architect", topic: "Lines, Angles and Triangles", subtopics: ["Measuring turns", "Angle pairs", "Triangle construction"], intro: "{hero}, my skate ramp needs a perfect 60° turn. Build it with me?", action: "Explore angles" },
  { id: "cricket", icon: "🏏", title: "Cricket Data Room", topic: "Data Handling", subtopics: ["Reading bar graphs", "Comparing values", "Making evidence-based choices"], intro: "{hero}, the final starts soon! Help me pick the squad—with real data.", action: "Explore data" },
];

export type GradeSevenComingSoonChapter = Omit<GradeSevenChapter, "id" | "action"> & { id: string; status: "coming" };

export const gradeSevenComingSoonChapters: GradeSevenComingSoonChapter[] = [
  { id: "fractions-decimals", status: "coming", icon: "🍲", title: "Recipe Lab", topic: "Fractions and Decimals", subtopics: ["Equivalent parts", "Decimal place value", "Comparing quantities"], intro: "Mix ingredients precisely enough to power Nova’s portable kitchen." },
  { id: "rational-numbers", status: "coming", icon: "🪐", title: "Portal Coordinates", topic: "Rational Numbers", subtopics: ["Number-line positions", "Positive and negative fractions", "Comparing rational numbers"], intro: "Plot safe portal coordinates across Nova’s sky map." },
  { id: "triangles", status: "coming", icon: "🌉", title: "Skybridge Survey", topic: "The Triangle and Its Properties", subtopics: ["Angle sums", "Kinds of triangles", "Side and angle relationships"], intro: "Design a skybridge that stays strong from every direction." },
  { id: "congruence", status: "coming", icon: "🧩", title: "Twin Temple", topic: "Congruence of Triangles", subtopics: ["Matching parts", "Congruence rules", "Proof through construction"], intro: "Match ancient temple pieces that are exactly the same shape and size." },
  { id: "practical-geometry", status: "coming", icon: "🧭", title: "Compass Forge", topic: "Practical Geometry", subtopics: ["Constructing angles", "Triangles", "Accurate measurements"], intro: "Forge precise map tools for Nova’s next expedition." },
  { id: "mensuration", status: "coming", icon: "🌿", title: "Garden Builder", topic: "Perimeter and Area", subtopics: ["Boundary length", "Area", "Composite shapes"], intro: "Build a community garden using exactly the space and fence available." },
  { id: "algebraic-expressions", status: "coming", icon: "🔐", title: "Code Garden", topic: "Algebraic Expressions", subtopics: ["Variables", "Terms and coefficients", "Simplifying expressions"], intro: "Decode a growing pattern that unlocks a hidden garden." },
  { id: "exponents", status: "coming", icon: "⚡", title: "Power Station", topic: "Exponents and Powers", subtopics: ["Repeated multiplication", "Powers of ten", "Large-number patterns"], intro: "Charge Lumina’s station with compact power codes." },
  { id: "symmetry", status: "coming", icon: "🪞", title: "Mirror Maze", topic: "Symmetry", subtopics: ["Lines of symmetry", "Rotational symmetry", "Pattern design"], intro: "Use reflections to find the true path through a shifting maze." },
  { id: "solid-shapes", status: "coming", icon: "🔭", title: "Starlight Observatory", topic: "Visualising Solid Shapes", subtopics: ["Faces, edges and vertices", "Views of solids", "Nets"], intro: "Build an observatory from 3D modules that fit together perfectly." },
];

export const conceptBeats: Record<GradeSevenAdventureId, readonly string[]> = {
  mountain: ["Watch me first!", "Base camp is ZERO.", "I fly UP one level. That is plus 1.", "I drop DOWN two. Past zero—minus 1!", "Down means MINUS. Up means PLUS."],
  balance: ["Watch the scale!", "I take a block from ONE side only.", "Crash—the beam tips! That is not fair.", "Same from BOTH sides keeps it level.", "Fair moves keep the balance true."],
  shop: ["Watch the price!", "₹240 is the WHOLE bar.", "25% means one of four equal parts.", "I shade one part—₹60 falls away!", "The rest is what we pay."],
  skatepark: ["Watch the board!", "A flat ramp barely turns it.", "I tilt the ramp UP. The turn grows.", "The board slides DOWN the steep slope!", "That turn between ramp and ground is the angle."],
  cricket: ["Watch me read a bar!", "Ira’s bar stops at 21.", "Asha’s bar climbs to 42—twice as tall!", "Taller bar means a bigger number.", "The chart never guesses."],
};

export const finaleCopy: Record<GradeSevenAdventureId, { title: string; detail: string; art: string }> = {
  mountain: { title: "Pod safe!", detail: "\"You found it, {hero}! Your number trail led us to −4. The beacons are lighting up!\"", art: "🚁⛰️☀️" },
  balance: { title: "Crate open!", detail: "\"Seven glowing blocks, {hero}! It worked because you kept both sides fair!\"", art: "📦✨⚖️" },
  shop: { title: "Deal done!", detail: "\"₹60 off, ₹180 paid—you saved us real coins, {hero}! Kit packed!\"", art: "🎒🏮🪙" },
  skatepark: { title: "Ramp ready!", detail: "\"Sixty degrees, exactly right! Look, {hero}—they're skating YOUR ramp!\"", art: "🛹🌆🔺" },
  cricket: { title: "Squad picked!", detail: "\"Asha, Kabir and Noor—chosen by your data, {hero}! Listen to that crowd!\"", art: "🏏🏟️🎉" },
};

function FinaleScene({ id, firstTime, replay, heroName, onDone }: { id: GradeSevenAdventureId; firstTime: boolean; replay: boolean; heroName: string; onDone: () => void }) {
  const copy = finaleCopy[id];
  return (
    <section className={`finale-scene finale-${id}`} aria-live="polite">
      <div className="finale-sparks" aria-hidden><i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i><i>✧</i></div>
      <div className="finale-art" aria-hidden>{copy.art}</div>
      <p className="eyebrow">{replay ? "A STORY WORTH REPLAYING" : "YOU CAME THROUGH"}</p>
      <h2>{personalize(copy.title, heroName)}</h2>
      <p>{personalize(copy.detail, heroName)}</p>
      {replay
        ? <div className="finale-reward"><span>📖</span><b>Scene replayed</b><small>your live progress stayed safe</small></div>
        : firstTime
          ? <div className="finale-reward"><span>🪙</span><b>+25 Lumina coins</b><small>banked for your explorer gear</small></div>
          : <div className="finale-reward"><span>✨</span><b>Star already lit</b><small>played again for the joy of it</small></div>}
      <button className="primary" onClick={onDone}>{replay ? "Return to my journal →" : "Return to the star map →"}</button>
    </section>
  );
}

function Success({ title, children, question, choices, answer, selected, onSelect, onFinish }: {
  title: string;
  children: React.ReactNode;
  question: string;
  choices: string[];
  answer: string;
  selected: string | null;
  onSelect: (choice: string) => void;
  onFinish: () => void;
}) {
  const correct = selected === answer;
  return (
    <div className="activity-success" aria-live="polite">
      <span>✦</span>
      <div>
        <b>{title}</b>
        <p>{children}</p>
        <div className="discovery-check">
          <small>TELL NOVA WHY IT WORKED</small>
          <strong>{question}</strong>
          <div>{choices.map((choice) => <button key={choice} className={selected === choice ? correct ? "correct" : "selected" : ""} onClick={() => { onSelect(choice); sound.play(choice === answer ? "success" : "tap"); }}>{choice}</button>)}</div>
          {selected && !correct && <p className="try-again">Look at the activity with Nova, then choose again.</p>}
          {correct && <p className="check-complete"><SparkleBurst playKey={question} />Exactly! Nova is taking notes from YOU now.</p>}
        </div>
      </div>
      {correct && <button className="primary" onClick={onFinish}>Save my discovery →</button>}
    </div>
  );
}

function ChapterProgress({ chapter, step }: { chapter: string; step: number }) {
  return <div className="chapter-event-progress" aria-label={`${chapter} event ${step + 1} of 5`}><span style={{ width: `${((step + 1) / 5) * 100}%` }} /><b>{chapter.toUpperCase()} · EVENT {step + 1} OF 5</b></div>;
}

function StoryScene({ world }: { world: "mountain" | "balance" | "shop" | "skate" | "cricket" }) {
  if (world === "mountain") return <div className="visual-story-scene mountain-scene" aria-label="A rescue helicopter flies through a storm over a mountain"><i className="scene-cloud cloud-one" /><i className="scene-cloud cloud-two" /><span className="scene-rain">╲ ╲ ╲</span><span className="scene-helicopter">🚁</span><span className="scene-mountain">⛰️</span><b>+3 → −4</b></div>;
  if (world === "balance") return <div className="visual-story-scene balance-scene" aria-label="A glowing supply crate balances energy blocks"><span className="scene-spark spark-one">✦</span><span className="scene-spark spark-two">✦</span><div className="scene-scale"><span>📦 + ✦ ✦ ✦ ✦ ✦</span><i>⚖</i><span>✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</span></div><b>Keep both sides fair</b></div>;
  if (world === "shop") return <div className="visual-story-scene shop-scene" aria-label="Two shops compare expedition kit prices"><span className="scene-awning">⌁⌁⌁⌁⌁</span><span className="scene-kit">🎒</span><span className="scene-tag">₹240</span><span className="scene-discount">25% OFF</span><b>Compare the final prices</b></div>;
  if (world === "skate") return <div className="visual-story-scene skate-scene" aria-label="A skateboard ramp rises over a city rooftop"><span className="scene-sun">☀</span><span className="scene-city">▥ ▦ ▥ ▤</span><span className="scene-board">🛹</span><i className="scene-ramp" /><span className="scene-angle">60°</span><b>Design the safe turn</b></div>;
  return <div className="visual-story-scene cricket-scene" aria-label="A cricket ball arcs over a stadium score board"><span className="scene-stadium">⌒⌒⌒⌒⌒⌒⌒</span><span className="scene-ball">●</span><div className="scene-score-bars"><i /><i /><i /><i /></div><span className="scene-bat">🏏</span><b>Let the data choose</b></div>;
}

type ControlledProps<T extends GradeSevenInteractionState> = {
  state: T;
  onChange: (state: T) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  onFinish: () => void;
};

const CLIFF_TOP = 8;
const CLIFF_BOTTOM = -8;
const LEVEL_H = 26;

function MountainRescue({ state, onChange, firstTime, replay, heroName, onFinish }: ControlledProps<MountainState>) {
  const set = (patch: Partial<MountainState>) => onChange({ ...state, ...patch });
  const complete = state.position === -4;
  const levels = Array.from({ length: CLIFF_TOP - CLIFF_BOTTOM + 1 }, (_, index) => CLIFF_TOP - index);
  const fmt = (value: number) => value > 0 ? `+${value}` : `${value}`;
  return <>
    {state.step < 5 && <ChapterProgress chapter="Mountain Rescue" step={state.step} />}
    {state.step === 0 && <section className="chapter-event"><p className="activity-prompt">{personalize("My rescue pod hung at +3. The storm knocked it 7 levels DOWN, {hero}! The cliff counts every level above and below base camp.", heroName)}</p><StoryScene world="mountain" /><button className="primary" onClick={() => set({ step: 1 })}>Open the cliff map →</button></section>}
    {state.step === 1 && state.showDemo && <NovaShows lines={conceptBeats.mountain} onDone={() => set({ showDemo: false })} />}
    {state.step === 1 && !state.showDemo && <section className="chapter-event"><p className="activity-prompt">Fly the pod DOWN seven levels from +3. Cross base camp on the way.</p><div className="cliff-lab" aria-label={`Nova's pod is at level ${fmt(state.position)}`}><div className="cliff-track" style={{ height: `${levels.length * LEVEL_H}px` }}>{levels.map((value) => <button key={value} className={`cliff-level${value === state.position ? " active" : ""}${value === 0 ? " base-camp" : ""}`} style={{ top: `${(CLIFF_TOP - value) * LEVEL_H}px` }} onClick={() => set({ position: value })} aria-label={`Move the pod to level ${fmt(value)}`}><span>{fmt(value)}</span>{value === 0 && <small>BASE CAMP</small>}</button>)}<span className="cliff-pod" style={{ top: `${(CLIFF_TOP - state.position) * LEVEL_H}px` }} aria-hidden>🚁</span></div><div className="cliff-readout"><b>Pod level: {fmt(state.position)}</b><small>{state.position > 0 ? `${state.position} above base camp` : state.position < 0 ? `${-state.position} below base camp` : "right at base camp"}</small><em className="cliff-goal">Trail: start +3 · drop 7</em>{complete && <div className="mini-discovery"><b>The pod rests at −4.</b><span>Seven levels down from +3 crosses zero.</span></div>}</div></div><div className="activity-controls"><button onClick={() => set({ position: Math.max(CLIFF_BOTTOM, state.position - 1) })}>↓ Drop one level</button><b>{fmt(state.position)}</b><button onClick={() => set({ position: Math.min(CLIFF_TOP, state.position + 1) })}>Climb one level ↑</button></div><button className="primary" disabled={!complete} onClick={() => set({ step: 2 })}>Read the rescue marker →</button></section>}
    {state.step === 2 && <section className="chapter-event"><p className="activity-prompt">The marker says <b>−4</b>. What does the minus sign tell the team?</p><StoryScene world="mountain" /><div className="offer-grid"><button className={state.direction === "below" ? "selected" : ""} onClick={() => set({ direction: "below" })}><b>Below base camp</b><small>The pod sits under zero.</small></button><button className={state.direction === "above" ? "selected" : ""} onClick={() => set({ direction: "above" })}><b>Above base camp</b><small>The pod sits over zero.</small></button></div>{state.direction === "above" && <p className="try-again">Look again. Is −4 above or below the gold base-camp line?</p>}<button className="primary" disabled={state.direction !== "below"} onClick={() => set({ step: 3 })}>Write the trail move →</button></section>}
    {state.step === 3 && <section className="chapter-event"><p className="activity-prompt">Nova opens her rescue logbook. Which line records the fall?</p><StoryScene world="mountain" /><div className="offer-grid">{["3 − 7 = −4", "3 + 7 = −4"].map((choice) => <button key={choice} className={state.equation === choice ? "selected" : ""} onClick={() => set({ equation: choice })}><b>{choice}</b></button>)}</div>{state.equation === "3 + 7 = −4" && <p className="try-again">Falling DOWN removes levels. Down means subtract.</p>}<button className="primary" disabled={state.equation !== "3 − 7 = −4"} onClick={() => set({ step: 4 })}>Save the rescue route →</button></section>}
    {state.step === 4 && <Success title="Rescue pod found!" question="What does 3 − 7 mean on the cliff?" choices={["Start at +3 and drop 7 levels", "Start at +3 and climb 7 levels", "Start at −7 and climb 3 levels"]} answer="Start at +3 and drop 7 levels" selected={state.successChoice} onSelect={(successChoice) => set({ successChoice })} onFinish={() => set({ step: 5 })}>The pod fell from +3 to −4. Crossing base camp keeps counting into minus: <b>3 − 7 = −4</b>.</Success>}
    {state.step === 5 && <FinaleScene id="mountain" firstTime={firstTime} replay={replay} heroName={heroName} onDone={onFinish} />}
  </>;
}

function BalanceDemo({ state, onChange }: { state: BalanceState; onChange: (state: BalanceState) => void }) {
  return <div className="balance-demo"><div className={`demo-beam ${state.demoMode}`}><span>✦ ✦ ✦</span><i aria-hidden>⚖️</i><span>✦ ✦ ✦</span></div><p>{state.demoMode === "level" ? "Same from BOTH sides—still fair!" : "I took from ONE side. It tips!"}</p><div className="activity-controls"><button onClick={() => onChange({ ...state, demoMode: "tipped" })}>Take from one side</button><button onClick={() => onChange({ ...state, demoMode: "level" })}>Take from both sides</button></div></div>;
}

function BalanceLab({ state, onChange, firstTime, replay, heroName, onFinish }: ControlledProps<BalanceState>) {
  const set = (patch: Partial<BalanceState>) => onChange({ ...state, ...patch });
  const complete = state.removed === 5;
  return <>
    {state.step < 5 && <ChapterProgress chapter="Balance Lab" step={state.step} />}
    {state.step === 0 && <section className="chapter-event"><p className="activity-prompt">{personalize("My supply crate opens only when the scale balances. A mystery crate plus 5 blocks matches 12 blocks. Find the secret number, {hero}!", heroName)}</p><StoryScene world="balance" /><button className="primary" onClick={() => set({ step: 1 })}>Enter the balance lab →</button></section>}
    {state.step === 1 && state.showDemo && <NovaShows lines={conceptBeats.balance} onDone={() => set({ showDemo: false })}><BalanceDemo state={state} onChange={onChange} /></NovaShows>}
    {state.step === 1 && !state.showDemo && <section className="chapter-event"><p className="activity-prompt">Remove the <b>same</b> number from both sides. Keep the scale level.</p><div className="balance-lab" aria-label="A balanced equation"><span className="lab-nova">✦</span><div><b>?</b>{Array.from({ length: 5 - state.removed }, (_, index) => <i key={index}>✦</i>)}</div><strong>⚖️</strong><div>{Array.from({ length: 12 - state.removed }, (_, index) => <i key={index}>✦</i>)}</div></div><p className="equation-readout">? + {5 - state.removed} = {12 - state.removed}</p><div className="activity-controls"><button disabled={state.removed === 0} onClick={() => set({ removed: state.removed - 1 })}>Put one back</button><button className="primary" disabled={complete} onClick={() => set({ removed: state.removed + 1 })}>Remove one from both sides</button></div>{complete && <div className="mini-discovery"><b>The crate is alone: ? = 7.</b><span>Both sides changed equally. The balance stayed true.</span></div>}<button className="primary" disabled={!complete} onClick={() => set({ step: 2 })}>Check the balance rule →</button></section>}
    {state.step === 2 && <section className="chapter-event"><p className="activity-prompt">Nova taps the stuck crate. Which move keeps its scale fair?</p><StoryScene world="balance" /><div className="offer-grid">{["Remove blocks from both sides", "Remove blocks from only one side"].map((choice) => <button key={choice} className={state.rule === choice ? "selected" : ""} onClick={() => set({ rule: choice })}><b>{choice}</b></button>)}</div>{state.rule === "Remove blocks from only one side" && <p className="try-again">Remember the demo—one-sided moves tip the scale.</p>}<button className="primary" disabled={state.rule !== "Remove blocks from both sides"} onClick={() => set({ step: 3 })}>Open the crate code →</button></section>}
    {state.step === 3 && <section className="chapter-event"><p className="activity-prompt">The final lock asks for <b>?</b> in <b>? + 5 = 12</b>.</p><StoryScene world="balance" /><div className="offer-grid">{["5", "7", "12"].map((choice) => <button key={choice} className={state.value === choice ? "selected" : ""} onClick={() => set({ value: choice })}><b>{choice}</b></button>)}</div>{state.value && state.value !== "7" && <p className="try-again">After removing five from both sides, what remains?</p>}<button className="primary" disabled={state.value !== "7"} onClick={() => set({ step: 4 })}>Unlock Nova&apos;s crate →</button></section>}
    {state.step === 4 && <Success title="The crate is worth 7!" question="Which move keeps an equation balanced?" choices={["Do the same thing to both sides", "Change only the larger side", "Move a number without changing it"]} answer="Do the same thing to both sides" selected={state.successChoice} onSelect={(successChoice) => set({ successChoice })} onFinish={() => set({ step: 5 })}>You did the same thing to both sides. <b>? + 5 = 12</b> became <b>? = 7</b>.</Success>}
    {state.step === 5 && <FinaleScene id="balance" firstTime={firstTime} replay={replay} heroName={heroName} onDone={onFinish} />}
  </>;
}

function SmartShopper({ state, onChange, firstTime, replay, heroName, onFinish }: ControlledProps<ShopState>) {
  const set = (patch: Partial<ShopState>) => onChange({ ...state, ...patch });
  const saving = 240 * state.discount / 100;
  const dialReady = state.discount === 25;
  const fairOffer = state.offer === "explorer";
  return <>
    {state.step < 5 && <ChapterProgress chapter="Smart Shopper" step={state.step} />}
    {state.step === 0 && <section className="chapter-event"><p className="activity-prompt">{personalize("I need the expedition kit before sunset, {hero}! Explorer Shop asks ₹240 with 25% off. Trail Shop asks ₹300 with 20% off. Which deal costs less?", heroName)}</p><StoryScene world="shop" /><button className="primary" onClick={() => set({ step: 1 })}>Open the discount clue →</button></section>}
    {state.step === 1 && state.showDemo && <NovaShows lines={conceptBeats.shop} onDone={() => set({ showDemo: false })} />}
    {state.step === 1 && !state.showDemo && <section className="chapter-event"><p className="activity-prompt">Pick the amount that is one quarter of ₹240.</p><div className="quarter-split" aria-label="Pick one quarter of 240 rupees">{["₹40", "₹60", "₹80", "₹120"].map((piece) => <button key={piece} className={state.quarterPick === piece ? piece === "₹60" ? "chosen" : "picked-wrong" : ""} onClick={() => set({ quarterPick: piece })}><b>{piece}</b><small>one quarter?</small></button>)}</div>{state.quarterPick === "₹60" && <div className="mini-discovery"><b>₹60 four times makes ₹240.</b><span>25% = 1/4 = ₹60</span></div>}{state.quarterPick && state.quarterPick !== "₹60" && <p className="try-again">Four equal parts must add to ₹240. Does yours?</p>}<button className="primary" disabled={state.quarterPick !== "₹60"} onClick={() => set({ step: 2 })}>Use the discount dial →</button></section>}
    {state.step === 2 && <section className="chapter-event"><p className="activity-prompt">Set Explorer Shop&apos;s discount to <b>25%</b>. Watch part of the price fall away.</p><StoryScene world="shop" /><div className="price-bar" aria-label={`₹240 price bar with ${state.discount} percent shaded`}><i className="price-shade" style={{ width: `${state.discount}%` }} />{[1, 2, 3].map((quarter) => <em key={quarter} className="quarter-mark" style={{ left: `${quarter * 25}%` }} />)}<b className={state.discount >= 25 ? "quarter-tag off" : "quarter-tag"}>₹60</b><small className="bar-total">₹240</small></div><div className="shop-lab"><span className="market-nova" style={{ transform: `translateX(${state.discount * .72}px)` }}>✦</span><div className="shop-tag">₹240</div><div className="discount-ring" style={{ "--dial": `${state.discount * 3.6}deg` } as React.CSSProperties}><b>{state.discount}%</b><small>off</small></div><div><b>Saving: ₹{saving}</b><small>New price: ₹{240 - saving}</small></div></div><input className="discount-slider" aria-label="Discount percentage" type="range" min="0" max="50" step="5" value={state.discount} onChange={(event) => set({ discount: Number(event.target.value) })} /><div className="activity-controls"><button onClick={() => set({ discount: Math.max(0, state.discount - 5) })}>− 5%</button><b>{state.discount}%</b><button onClick={() => set({ discount: Math.min(50, state.discount + 5) })}>+ 5%</button></div>{dialReady && <div className="mini-discovery"><b>₹60 leaves the ₹240 price.</b><span>₹240 − ₹60 = ₹180</span></div>}<button className="primary" disabled={!dialReady} onClick={() => set({ step: 3 })}>Compare both shops →</button></section>}
    {state.step === 3 && <section className="chapter-event"><p className="activity-prompt">{personalize("Time to choose, {hero}! Which shop leaves me with the LOWER final price?", heroName)}</p><StoryScene world="shop" /><div className="offer-grid"><button className={state.offer === "trail" ? "selected" : ""} onClick={() => set({ offer: "trail" })}><b>Trail Shop</b><span>₹300</span><strong>20% off</strong><small>Final price: ₹240</small></button><button className={state.offer === "explorer" ? "selected" : ""} onClick={() => set({ offer: "explorer" })}><b>Explorer Shop</b><span>₹240</span><strong>25% off</strong><small>Final price: ₹180</small></button></div>{state.offer === "trail" && <p className="try-again">Compare final prices. Which one costs fewer rupees?</p>}{fairOffer && <div className="mini-discovery"><b>Explorer Shop costs less.</b><span>Always compare the final prices.</span></div>}<button className="primary" disabled={!fairOffer} onClick={() => set({ step: 4 })}>Name the percentage idea →</button></section>}
    {state.step === 4 && <Success title="A real deal, calculated!" question="What is 25% of ₹240?" choices={["₹60", "₹25", "₹180"]} answer="₹60" selected={state.successChoice} onSelect={(successChoice) => set({ successChoice })} onFinish={() => set({ step: 5 })}>You found one quarter, removed ₹60, and compared both final prices. The kit costs <b>₹180</b>.</Success>}
    {state.step === 5 && <FinaleScene id="shop" firstTime={firstTime} replay={replay} heroName={heroName} onDone={onFinish} />}
  </>;
}

function Skatepark({ state, onChange, firstTime, replay, heroName, onFinish }: ControlledProps<SkateparkState>) {
  const set = (patch: Partial<SkateparkState>) => onChange({ ...state, ...patch });
  const [handMode, setHandMode] = useState(false);
  const complete = state.angle === 60;
  const skaterAlong = Math.max(16, 82 - state.angle * 0.5);
  return <>
    {state.step < 5 && <ChapterProgress chapter="Skatepark Architect" step={state.step} />}
    {state.step === 0 && <section className="chapter-event"><p className="activity-prompt">{personalize("The rooftop skatepark opens tonight, {hero}! My ramp must meet the ground at a safe 60° turn.", heroName)}</p><StoryScene world="skate" /><button className="primary" onClick={() => set({ step: 1 })}>Inspect the ramp plan →</button></section>}
    {state.step === 1 && state.showDemo && <NovaShows lines={conceptBeats.skatepark} onDone={() => set({ showDemo: false })} />}
    {state.step === 1 && !state.showDemo && <section className="chapter-event"><p className="activity-prompt">Turn the ramp to exactly <b>60°</b>. Watch the board ride the slope.</p><div className={`slope-lab${complete ? " locked" : ""}`} aria-label={`Ramp angle ${state.angle} degrees`}><div className="slope-ground" /><div className="slope-ramp" style={{ transform: `rotate(${-state.angle}deg)` }}><span className="slope-skater" style={{ left: `${skaterAlong}%` }} aria-hidden>🛹</span></div><span className="slope-wedge" style={{ ["--wedge" as string]: `${state.angle}deg` }} aria-hidden /><b className="slope-readout">{state.angle}°</b></div><input className="discount-slider" aria-label="Ramp angle" type="range" min="0" max="120" step="10" value={state.angle} onChange={(event) => set({ angle: Number(event.target.value) })} />{supportsHandControl() && !handMode && <button className="text-button" onClick={() => setHandMode(true)}>✋ Try hand control (beta)—ask a grown-up first</button>}{handMode && <HandAngleControl onAngle={(angle) => set({ angle })} onClose={() => setHandMode(false)} />}<div className="activity-controls"><button onClick={() => set({ angle: Math.max(0, state.angle - 10) })}>Rotate back</button><b>{state.angle}°</b><button onClick={() => set({ angle: Math.min(120, state.angle + 10) })}>Rotate forward</button></div>{complete && <div className="mini-discovery"><b>60°—the board rolls smoothly!</b><span>An angle measures the turn between two lines.</span></div>}<button className="primary" disabled={!complete} onClick={() => set({ step: 2 })}>Complete the triangle →</button></section>}
    {state.step === 2 && <section className="chapter-event"><div className="mini-discovery"><b>Nova&apos;s triangle secret!</b><span>The three angles in any triangle add to 180°.</span></div><p className="activity-prompt">Two angles are <b>60°</b>. How much remains to reach <b>180°</b>?</p><StoryScene world="skate" /><div className="offer-grid">{["30°", "60°", "120°"].map((choice) => <button key={choice} className={state.triangleAngle === choice ? "selected" : ""} onClick={() => set({ triangleAngle: choice })}><b>{choice}</b></button>)}</div>{state.triangleAngle && state.triangleAngle !== "60°" && <p className="try-again">60° + 60° = 120°. What reaches 180°?</p>}<button className="primary" disabled={state.triangleAngle !== "60°"} onClick={() => set({ step: 3 })}>Test the builder message →</button></section>}
    {state.step === 3 && <section className="chapter-event"><p className="activity-prompt">Nova tells the builders, “The ramp needs a 60° angle.” What does that mean?</p><StoryScene world="skate" /><div className="offer-grid">{["The amount of turn between two lines", "The length of the ramp"].map((choice) => <button key={choice} className={state.meaning === choice ? "selected" : ""} onClick={() => set({ meaning: choice })}><b>{choice}</b></button>)}</div>{state.meaning === "The length of the ramp" && <p className="try-again">The ° sign describes turning, not length.</p>}<button className="primary" disabled={state.meaning !== "The amount of turn between two lines"} onClick={() => set({ step: 4 })}>Open the skatepark →</button></section>}
    {state.step === 4 && <Success title="Course locked in!" question="An angle tells us the…" choices={["amount of turn between two lines", "length of the ramp", "number of wheels"]} answer="amount of turn between two lines" selected={state.successChoice} onSelect={(successChoice) => set({ successChoice })} onFinish={() => set({ step: 5 })}>You built a 60° turn. The triangle&apos;s three angles added to <b>180°</b>.</Success>}
    {state.step === 5 && <FinaleScene id="skatepark" firstTime={firstTime} replay={replay} heroName={heroName} onDone={onFinish} />}
  </>;
}

const players = [
  { name: "Asha", score: 42 }, { name: "Kabir", score: 37 }, { name: "Noor", score: 35 }, { name: "Ira", score: 21 },
];

function CricketData({ state, onChange, firstTime, replay, heroName, onFinish }: ControlledProps<CricketState>) {
  const set = (patch: Partial<CricketState>) => onChange({ ...state, ...patch });
  const complete = ["Asha", "Kabir", "Noor"].every((name) => state.picked.includes(name)) && state.picked.length === 3;
  function toggle(name: string) {
    set({ picked: state.picked.includes(name) ? state.picked.filter((item) => item !== name) : state.picked.length < 3 ? [...state.picked, name] : state.picked });
  }
  return <>
    {state.step < 5 && <ChapterProgress chapter="Cricket Data Room" step={state.step} />}
    {state.step === 0 && <section className="chapter-event"><p className="activity-prompt">{personalize("The final starts at sunset, {hero}! My heart says friends. The chart shows scores. Help me trust the chart!", heroName)}</p><StoryScene world="cricket" /><button className="primary" onClick={() => set({ step: 1 })}>Open the score board →</button></section>}
    {state.step === 1 && state.showDemo && <NovaShows lines={conceptBeats.cricket} onDone={() => set({ showDemo: false })} />}
    {state.step === 1 && !state.showDemo && <section className="chapter-event"><p className="activity-prompt">Find the player with the <b>highest</b> score bar.</p><div className="cricket-lab">{players.map((player) => <button key={player.name} className={state.topPlayer === player.name ? "picked" : ""} onClick={() => set({ topPlayer: player.name })}><span style={{ height: `${player.score * 2.5}px` }} /><b>{player.score}</b><small>{player.name}</small></button>)}</div>{state.topPlayer === "Asha" && <div className="mini-discovery"><b>Asha&apos;s bar reaches 42.</b><span>The tallest bar shows the greatest value.</span></div>}{state.topPlayer && state.topPlayer !== "Asha" && <p className="try-again">Compare every height and number.</p>}<button className="primary" disabled={state.topPlayer !== "Asha"} onClick={() => set({ step: 2 })}>Build the squad →</button></section>}
    {state.step === 2 && <section className="chapter-event"><p className="activity-prompt">Pick the <b>three highest</b> match-score bars.</p><StoryScene world="cricket" /><div className="cricket-lab">{players.map((player) => <button key={player.name} className={state.picked.includes(player.name) ? "picked" : ""} onClick={() => toggle(player.name)} aria-pressed={state.picked.includes(player.name)}><span style={{ height: `${player.score * 2.5}px` }} /><b>{player.score}</b><small>{player.name}</small></button>)}</div><div className="squad-field" aria-live="polite"><span>🏟️</span>{state.picked.map((name) => <b key={name}>🏏<small>{name}</small></b>)}{Array.from({ length: Math.max(0, 3 - state.picked.length) }, (_, index) => <i key={index}>?</i>)}</div>{complete && <div className="mini-discovery"><b>Asha, Kabir and Noor have the tallest bars.</b><span>Their scores are 42, 37 and 35.</span></div>}<button className="primary" disabled={!complete} onClick={() => set({ step: 3 })}>Explain the selection →</button></section>}
    {state.step === 3 && <section className="chapter-event"><p className="activity-prompt">The coach asks why. Which answer uses the chart&apos;s evidence?</p><StoryScene world="cricket" /><div className="offer-grid">{["Their score bars are the three highest", "They practised the most this week"].map((choice) => <button key={choice} className={state.reason === choice ? "selected" : ""} onClick={() => set({ reason: choice })}><b>{choice}</b></button>)}</div>{state.reason === "They practised the most this week" && <p className="try-again">Practice matters—but this chart shows match scores.</p>}<button className="primary" disabled={state.reason !== "Their score bars are the three highest"} onClick={() => set({ step: 4 })}>Send the final squad →</button></section>}
    {state.step === 4 && <Success title="Data-backed squad selected!" question="Why did those three players make the squad?" choices={["Their score bars are the three highest", "They practised the most this week", "They were chosen first"]} answer="Their score bars are the three highest" selected={state.successChoice} onSelect={(successChoice) => set({ successChoice })} onFinish={() => set({ step: 5 })}>Asha, Kabir and Noor have the three highest scores. The graph made them easy to compare.</Success>}
    {state.step === 5 && <FinaleScene id="cricket" firstTime={firstTime} replay={replay} heroName={heroName} onDone={onFinish} />}
  </>;
}

export function GradeSevenActivity({ id, state, mode, firstTime, heroName, onChange, onFinish }: {
  id: GradeSevenAdventureId;
  state: GradeSevenInteractionState;
  mode: GradeSevenActivityMode;
  firstTime: boolean;
  heroName: string;
  onChange: (state: GradeSevenInteractionState) => void;
  onFinish: () => void;
}) {
  const adventure = gradeSevenAdventures.find((item) => item.id === id)!;
  const heading = <div className="activity-heading"><span>{adventure.icon}</span><div><p className="eyebrow">{mode === "replay" ? "STORY JOURNAL REPLAY" : `GRADE 7 · ${adventure.topic.toUpperCase()}`}</p><h1>{adventure.topic}</h1><p className="story-world">Story world · {adventure.title}</p><p>{personalize(adventure.intro, heroName)}</p><div className="subtopic-row">{adventure.subtopics.map((subtopic) => <span key={subtopic}>{subtopic}</span>)}</div></div></div>;
  return <section className="activity-panel">{heading}
    {id === "mountain" && state.kind === "mountain" && <MountainRescue state={state} onChange={onChange} firstTime={firstTime} replay={mode === "replay"} heroName={heroName} onFinish={onFinish} />}
    {id === "balance" && state.kind === "balance" && <BalanceLab state={state} onChange={onChange} firstTime={firstTime} replay={mode === "replay"} heroName={heroName} onFinish={onFinish} />}
    {id === "shop" && state.kind === "shop" && <SmartShopper state={state} onChange={onChange} firstTime={firstTime} replay={mode === "replay"} heroName={heroName} onFinish={onFinish} />}
    {id === "skatepark" && state.kind === "skatepark" && <Skatepark state={state} onChange={onChange} firstTime={firstTime} replay={mode === "replay"} heroName={heroName} onFinish={onFinish} />}
    {id === "cricket" && state.kind === "cricket" && <CricketData state={state} onChange={onChange} firstTime={firstTime} replay={mode === "replay"} heroName={heroName} onFinish={onFinish} />}
  </section>;
}
