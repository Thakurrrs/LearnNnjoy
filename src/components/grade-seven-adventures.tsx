"use client";

import { useState } from "react";

export type GradeSevenAdventureId = "mountain" | "balance" | "shop" | "skatepark" | "cricket";

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
  { id: "mountain", icon: "🏔️", title: "Mountain Rescue", topic: "Integers", subtopics: ["Positive and negative positions", "Number-line movement", "Addition and subtraction"], intro: "Nova is at +3 on the cliff path. A storm pushes the rescue pod 7 levels down.", action: "Explore integers" },
  { id: "balance", icon: "⚖️", title: "Balance Lab", topic: "Simple Equations", subtopics: ["Equality", "Inverse operations", "Solving for an unknown"], intro: "A sealed crate and five energy blocks balance twelve blocks.", action: "Explore equations" },
  { id: "shop", icon: "🛍️", title: "Smart Shopper", topic: "Comparing Quantities", subtopics: ["Percentages as fractions", "Discounts", "Comparing final prices"], intro: "A ₹240 expedition kit has a fair 25% trail discount.", action: "Explore percentages" },
  { id: "skatepark", icon: "🛹", title: "Skatepark Architect", topic: "Lines, Angles and Triangles", subtopics: ["Measuring turns", "Angle pairs", "Triangle construction"], intro: "A safe ramp needs a 60° turn to join the triangle course.", action: "Explore angles" },
  { id: "cricket", icon: "🏏", title: "Cricket Data Room", topic: "Data Handling", subtopics: ["Reading bar graphs", "Comparing values", "Making evidence-based choices"], intro: "Pick a three-player squad using the match-score data—not a hunch.", action: "Explore data" },
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

function Success({ title, children, question, choices, answer, onFinish }: { title: string; children: React.ReactNode; question: string; choices: string[]; answer: string; onFinish: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const correct = selected === answer;
  return <div className="activity-success" aria-live="polite"><span>✦</span><div><b>{title}</b><p>{children}</p><div className="discovery-check"><small>PUT YOUR DISCOVERY INTO WORDS</small><strong>{question}</strong><div>{choices.map((choice) => <button key={choice} className={selected === choice ? correct ? "correct" : "selected" : ""} onClick={() => setSelected(choice)}>{choice}</button>)}</div>{selected && !correct && <p className="try-again">Look back at what changed in the activity, then choose again.</p>}{correct && <p className="check-complete">Exactly. You earned this discovery because you can explain it.</p>}</div></div>{correct && <button className="primary" onClick={onFinish}>Save my discovery →</button>}</div>;
}

function ChapterProgress({ chapter, step }: { chapter: string; step: number }) {
  return <div className="chapter-event-progress" aria-label={`${chapter} event ${step + 1} of 5`}><span style={{ width: `${((step + 1) / 5) * 100}%` }} /><b>{chapter.toUpperCase()} · EVENT {step + 1} OF 5</b></div>;
}

function StoryScene({ world }: { world: "mountain" | "balance" | "shop" | "skate" | "cricket" }) {
  if (world === "mountain") return <div className="visual-story-scene mountain-scene" aria-label="A rescue helicopter flies through a storm over a mountain"><i className="scene-cloud cloud-one" /><i className="scene-cloud cloud-two" /><span className="scene-rain">╲ ╲ ╲</span><span className="scene-helicopter">🚁</span><span className="scene-mountain">⛰️</span><b>+3 → −4</b></div>;
  if (world === "balance") return <div className="visual-story-scene balance-scene" aria-label="A glowing supply crate balances energy blocks"><span className="scene-spark spark-one">✦</span><span className="scene-spark spark-two">✦</span><div className="scene-scale"><span>📦 + ✦ ✦ ✦ ✦ ✦</span><i>⚖</i><span>✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</span></div><b>Keep both sides fair</b></div>;
  if (world === "shop") return <div className="visual-story-scene shop-scene" aria-label="Nova compares an expedition kit price in a bright market"><span className="scene-awning">⌁⌁⌁⌁⌁</span><span className="scene-kit">🎒</span><span className="scene-tag">₹240</span><span className="scene-discount">25% OFF</span><b>Find the fair deal</b></div>;
  if (world === "skate") return <div className="visual-story-scene skate-scene" aria-label="A skateboard ramp rises over a city rooftop"><span className="scene-sun">☀</span><span className="scene-city">▥ ▦ ▥ ▤</span><span className="scene-board">🛹</span><i className="scene-ramp" /><span className="scene-angle">60°</span><b>Design the safe turn</b></div>;
  return <div className="visual-story-scene cricket-scene" aria-label="A cricket ball arcs over a stadium score board"><span className="scene-stadium">⌒⌒⌒⌒⌒⌒⌒</span><span className="scene-ball">●</span><div className="scene-score-bars"><i /><i /><i /><i /></div><span className="scene-bat">🏏</span><b>Let the data choose</b></div>;
}

function MountainRescue({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [position, setPosition] = useState(3);
  const [direction, setDirection] = useState<string | null>(null);
  const [equation, setEquation] = useState<string | null>(null);
  const complete = position === -4;
  return <>
    <ChapterProgress chapter="Mountain Rescue" step={step} />
    {step === 0 && <section className="chapter-event"><p className="activity-prompt">A storm has knocked Nova&apos;s rescue pod from the <b>+3</b> cliff marker. It slides <b>7 levels down</b> into the fog. Your map uses numbers above and below sea level.</p><StoryScene world="mountain" /><button className="primary" onClick={() => setStep(1)}>Open the cliff map →</button></section>}
    {step === 1 && <section className="chapter-event"><p className="activity-prompt">Move Nova down seven equal levels. Cross zero if the trail takes you there.</p><div className="interactive-moment mountain-route"><span className="route-cloud">☁</span><span className="route-helicopter" style={{ left: `${((position + 8) / 16) * 82 + 7}%` }}>🚁</span><span className="route-mountain">⛰️</span><b>Nova&apos;s pod: {position > 0 ? `+${position}` : position}</b></div><div className="number-line-lab" aria-label={`Nova is currently at ${position}`}>{Array.from({ length: 17 }, (_, index) => index - 8).map((value) => <button key={value} onClick={() => setPosition(value)} className={value === position ? "active" : ""} aria-label={`Move Nova to ${value}`}><i>{value === position ? "✦" : ""}</i><span>{value > 0 ? `+${value}` : value}</span></button>)}</div><div className="activity-controls"><button onClick={() => setPosition((value) => Math.max(-8, value - 1))}>← Go down one</button><b>{position > 0 ? `+${position}` : position}</b><button onClick={() => setPosition((value) => Math.min(8, value + 1))}>Go up one →</button></div>{complete && <div className="mini-discovery"><b>The pod lands at −4.</b><span>Going down from +3 by 7 steps crosses zero.</span></div>}<button className="primary" disabled={!complete} onClick={() => setStep(2)}>Read the rescue marker →</button></section>}
    {step === 2 && <section className="chapter-event"><p className="activity-prompt">The marker says <b>−4</b>. Choose what the negative sign tells the rescue team.</p><div className="offer-grid"><button className={direction === "below" ? "selected" : ""} onClick={() => setDirection("below")}><b>Below zero</b><small>The pod is below the zero marker.</small></button><button className={direction === "above" ? "selected" : ""} onClick={() => setDirection("above")}><b>Above zero</b><small>The pod is still above the zero marker.</small></button></div>{direction === "above" && <p className="try-again">Look at where −4 sits compared with 0 on the map.</p>}<button className="primary" disabled={direction !== "below"} onClick={() => setStep(3)}>Write the trail move →</button></section>}
    {step === 3 && <section className="chapter-event"><p className="activity-prompt">Choose the equation that records Nova&apos;s journey from <b>+3</b> down <b>7</b> levels.</p><div className="offer-grid">{["3 − 7 = −4", "3 + 7 = −4"].map((choice) => <button key={choice} className={equation === choice ? "selected" : ""} onClick={() => setEquation(choice)}><b>{choice}</b></button>)}</div>{equation === "3 + 7 = −4" && <p className="try-again">Going down is subtraction, so the position should move left on the number line.</p>}<button className="primary" disabled={equation !== "3 − 7 = −4"} onClick={() => setStep(4)}>Save the rescue route →</button></section>}
    {step === 4 && <Success title="Rescue pod found!" question="What does 3 − 7 mean on this number line?" choices={["Start at +3 and move 7 steps left", "Start at +3 and move 7 steps right", "Start at −7 and move 3 steps right"]} answer="Start at +3 and move 7 steps left" onFinish={onFinish}>You moved from +3 to −4. Going down past zero keeps counting in the negative direction: <b>3 − 7 = −4</b>.</Success>}
  </>;
}

function BalanceLab({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [removed, setRemoved] = useState(0);
  const [rule, setRule] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const complete = removed === 5;
  return <>
    <ChapterProgress chapter="Balance Lab" step={step} />
    {step === 0 && <section className="chapter-event"><p className="activity-prompt">Nova&apos;s supply crate will open only when its energy scale is balanced. A mystery crate plus <b>5 blocks</b> matches <b>12 blocks</b>.</p><StoryScene world="balance" /><button className="primary" onClick={() => setStep(1)}>Enter the balance lab →</button></section>}
    {step === 1 && <section className="chapter-event"><p className="activity-prompt">Remove the <b>same</b> number of blocks from both sides until the mystery crate stands alone.</p><div className="balance-lab" aria-label="A balanced equation"><span className="lab-nova">✦</span><div><b>?</b>{Array.from({ length: 5 - removed }, (_, i) => <i key={i}>✦</i>)}</div><strong>⚖️</strong><div>{Array.from({ length: 12 - removed }, (_, i) => <i key={i}>✦</i>)}</div></div><p className="equation-readout">? + {5 - removed} = {12 - removed}</p><div className="activity-controls"><button disabled={removed === 0} onClick={() => setRemoved((value) => value - 1)}>Put one back</button><button className="primary" disabled={complete} onClick={() => setRemoved((value) => value + 1)}>Remove one from both sides</button></div>{complete && <div className="mini-discovery"><b>The crate is alone: ? = 7.</b><span>Both sides changed equally, so the balance stayed true.</span></div>}<button className="primary" disabled={!complete} onClick={() => setStep(2)}>Check the balance rule →</button></section>}
    {step === 2 && <section className="chapter-event"><p className="activity-prompt">Which repair keeps a balance scale fair?</p><div className="offer-grid">{["Do the same operation to both sides", "Change only the larger side"].map((choice) => <button key={choice} className={rule === choice ? "selected" : ""} onClick={() => setRule(choice)}><b>{choice}</b></button>)}</div>{rule === "Change only the larger side" && <p className="try-again">A balance tips if only one side changes.</p>}<button className="primary" disabled={rule !== "Do the same operation to both sides"} onClick={() => setStep(3)}>Open the crate code →</button></section>}
    {step === 3 && <section className="chapter-event"><p className="activity-prompt">The final lock asks for the mystery crate&apos;s value. What is <b>?</b> in <b>? + 5 = 12</b>?</p><div className="offer-grid">{["5", "7", "12"].map((choice) => <button key={choice} className={value === choice ? "selected" : ""} onClick={() => setValue(choice)}><b>{choice}</b></button>)}</div>{value && value !== "7" && <p className="try-again">Look at the value on the right after you removed five from both sides.</p>}<button className="primary" disabled={value !== "7"} onClick={() => setStep(4)}>Unlock Nova&apos;s crate →</button></section>}
    {step === 4 && <Success title="The crate is worth 7!" question="Which move keeps an equation balanced?" choices={["Do the same operation to both sides", "Change only the larger side", "Move a number across without changing it"]} answer="Do the same operation to both sides" onFinish={onFinish}>You kept the scale balanced by doing the same thing to both sides. <b>? + 5 = 12</b> becomes <b>? = 7</b>.</Success>}
  </>;
}

function SmartShopper({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [quarterChosen, setQuarterChosen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [offer, setOffer] = useState<string | null>(null);
  const saving = 240 * discount / 100;
  const dialReady = discount === 25;
  const fairOffer = offer === "explorer";
  return <>
    <div className="chapter-event-progress" aria-label={`Smart Shopper event ${step + 1} of 5`}><span style={{ width: `${((step + 1) / 5) * 100}%` }} /> <b>SMART SHOPPER · EVENT {step + 1} OF 5</b></div>
    {step === 0 && <section className="chapter-event"><p className="activity-prompt">Nova needs an expedition kit before sunset. The price is <b>₹240</b>, and the shopkeeper offers a fair <b>25% discount</b>. Before buying, let&apos;s discover what that promise means.</p><StoryScene world="shop" /><button className="primary" onClick={() => setStep(1)}>Open the discount clue →</button></section>}
    {step === 1 && <section className="chapter-event"><p className="activity-prompt">A 25% discount means one of <b>four equal parts</b>. Tap one equal part of the ₹240 price tag.</p><div className="quarter-split" aria-label="A price of 240 rupees split into four equal 60 rupee parts">{[0, 1, 2, 3].map((part) => <button key={part} className={quarterChosen ? "chosen" : ""} onClick={() => setQuarterChosen(true)}><b>₹60</b><small>one quarter</small></button>)}</div>{quarterChosen && <div className="mini-discovery"><b>One of four equal ₹60 parts is 1/4 of ₹240.</b><span>25% = 1/4 = ₹60</span></div>}<button className="primary" disabled={!quarterChosen} onClick={() => setStep(2)}>Use the discount dial →</button></section>}
    {step === 2 && <section className="chapter-event"><p className="activity-prompt">Now set the discount dial to the promise: <b>25%</b>. Watch both the saving and final price change together.</p><div className="shop-lab"><span className="market-nova" style={{ transform: `translateX(${discount * .72}px)` }}>✦</span><div className="shop-tag">₹240</div><div className="discount-ring" style={{ "--dial": `${discount * 3.6}deg` } as React.CSSProperties}><b>{discount}%</b><small>off</small></div><div><b>Saving: ₹{saving}</b><small>New price: ₹{240 - saving}</small></div></div><input className="discount-slider" aria-label="Discount percentage" type="range" min="0" max="50" step="5" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /><div className="activity-controls"><button onClick={() => setDiscount((value) => Math.max(0, value - 5))}>− 5%</button><b>{discount}%</b><button onClick={() => setDiscount((value) => Math.min(50, value + 5))}>+ 5%</button></div>{dialReady && <div className="mini-discovery"><b>₹60 is removed from ₹240.</b><span>₹240 − ₹60 = ₹180</span></div>}<button className="primary" disabled={!dialReady} onClick={() => setStep(3)}>Compare two real offers →</button></section>}
    {step === 3 && <section className="chapter-event"><p className="activity-prompt">Two shops sell the same kit. Choose the deal that leaves Nova with the <b>lower final price</b>.</p><div className="offer-grid"><button className={offer === "trail" ? "selected" : ""} onClick={() => setOffer("trail")}><b>Trail Shop</b><span>₹300</span><strong>20% off</strong><small>Final price: ₹240</small></button><button className={offer === "explorer" ? "selected" : ""} onClick={() => setOffer("explorer")}><b>Explorer Shop</b><span>₹240</span><strong>25% off</strong><small>Final price: ₹180</small></button></div>{offer === "trail" && <p className="try-again">Look at the final prices, not only the discount label. Which one costs less?</p>}{fairOffer && <div className="mini-discovery"><b>Good comparison.</b><span>A larger percentage is useful only when you also check the final price.</span></div>}<button className="primary" disabled={!fairOffer} onClick={() => setStep(4)}>Name the percentage idea →</button></section>}
    {step === 4 && <Success title="A fair deal, calculated!" question="What is 25% of ₹240?" choices={["₹60", "₹25", "₹180"]} answer="₹60" onFinish={onFinish}>You split ₹240 into four equal ₹60 parts, used the 25% discount, and compared final prices. <b>25% = 1/4 = ₹60</b>, so the kit costs <b>₹180</b>.</Success>}
  </>;
}

function Skatepark({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [angle, setAngle] = useState(20);
  const [triangleAngle, setTriangleAngle] = useState<string | null>(null);
  const [meaning, setMeaning] = useState<string | null>(null);
  const complete = angle === 60;
  return <>
    <ChapterProgress chapter="Skatepark Architect" step={step} />
    {step === 0 && <section className="chapter-event"><p className="activity-prompt">Nova is designing a rooftop skatepark for the neighbourhood. The first ramp must join the triangle course with a safe <b>60° turn</b>.</p><StoryScene world="skate" /><button className="primary" onClick={() => setStep(1)}>Inspect the ramp plan →</button></section>}
    {step === 1 && <section className="chapter-event"><p className="activity-prompt">Turn the ramp until it makes a <b>60°</b> angle with the ground. The course triangle will then lock into place.</p><div className="skate-lab"><div className="ground" /><div className="ramp" style={{ transform: `rotate(${-angle}deg)` }} /><span className="skater-nova" style={{ left: `${25 + angle * .27}%`, bottom: `${61 + angle * .31}px` }}>🛹</span><div className={complete ? "triangle-frame complete" : "triangle-frame"}>△</div><b>{angle}°</b></div><input className="discount-slider" aria-label="Ramp angle" type="range" min="0" max="120" step="10" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /><div className="activity-controls"><button onClick={() => setAngle((value) => Math.max(0, value - 10))}>Rotate back</button><b>{angle}°</b><button onClick={() => setAngle((value) => Math.min(120, value + 10))}>Rotate forward</button></div>{complete && <div className="mini-discovery"><b>The ramp turns 60° from the ground.</b><span>An angle measures a turn, not a distance.</span></div>}<button className="primary" disabled={!complete} onClick={() => setStep(2)}>Complete the triangle →</button></section>}
    {step === 2 && <section className="chapter-event"><p className="activity-prompt">The other two turns in this balanced triangle are also <b>60°</b>. What is the missing third angle?</p><div className="offer-grid">{["30°", "60°", "120°"].map((choice) => <button key={choice} className={triangleAngle === choice ? "selected" : ""} onClick={() => setTriangleAngle(choice)}><b>{choice}</b></button>)}</div>{triangleAngle && triangleAngle !== "60°" && <p className="try-again">Three equal angles share the triangle evenly.</p>}<button className="primary" disabled={triangleAngle !== "60°"} onClick={() => setStep(3)}>Test the design language →</button></section>}
    {step === 3 && <section className="chapter-event"><p className="activity-prompt">Nova tells the builders that the ramp needs a <b>60° angle</b>. What information does that give them?</p><div className="offer-grid">{["The amount of turn between two lines", "The length of the ramp"].map((choice) => <button key={choice} className={meaning === choice ? "selected" : ""} onClick={() => setMeaning(choice)}><b>{choice}</b></button>)}</div>{meaning === "The length of the ramp" && <p className="try-again">The number has a ° sign, so it describes turning.</p>}<button className="primary" disabled={meaning !== "The amount of turn between two lines"} onClick={() => setStep(4)}>Open the skatepark →</button></section>}
    {step === 4 && <Success title="Course locked in!" question="An angle tells us the…" choices={["amount of turn between two lines", "length of the ramp", "number of wheels on the board"]} answer="amount of turn between two lines" onFinish={onFinish}>You built a 60° angle and used the triangle&apos;s equal turns. Angles describe the amount of turn between two lines—not the length of the ramp.</Success>}
  </>;
}

const players = [
  { name: "Asha", score: 42 }, { name: "Kabir", score: 37 }, { name: "Noor", score: 35 }, { name: "Ira", score: 21 },
];

function CricketData({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [topPlayer, setTopPlayer] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const complete = ["Asha", "Kabir", "Noor"].every((name) => picked.includes(name)) && picked.length === 3;
  function toggle(name: string) { setPicked((current) => current.includes(name) ? current.filter((item) => item !== name) : current.length < 3 ? [...current, name] : current); }
  return <>
    <ChapterProgress chapter="Cricket Data Room" step={step} />
    {step === 0 && <section className="chapter-event"><p className="activity-prompt">The neighbourhood cricket final starts at sunset. Nova must choose a three-player practice squad using the match-score chart—not a hunch.</p><StoryScene world="cricket" /><button className="primary" onClick={() => setStep(1)}>Open the score board →</button></section>}
    {step === 1 && <section className="chapter-event"><p className="activity-prompt">First, find the player with the <b>highest</b> score bar.</p><div className="cricket-lab">{players.map((player) => <button key={player.name} className={topPlayer === player.name ? "picked" : ""} onClick={() => setTopPlayer(player.name)}><span style={{ height: `${player.score * 2.5}px` }} /><b>{player.score}</b><small>{player.name}</small></button>)}</div>{topPlayer === "Asha" && <div className="mini-discovery"><b>Asha&apos;s bar reaches 42—the highest score.</b><span>The tallest bar represents the greatest value.</span></div>}{topPlayer && topPlayer !== "Asha" && <p className="try-again">Compare the heights and the numbers at the top of every bar.</p>}<button className="primary" disabled={topPlayer !== "Asha"} onClick={() => setStep(2)}>Build the squad from data →</button></section>}
    {step === 2 && <section className="chapter-event"><p className="activity-prompt">The team needs the <b>three highest</b> match-score bars. Pick exactly three players using the chart.</p><div className="cricket-lab">{players.map((player) => <button key={player.name} className={picked.includes(player.name) ? "picked" : ""} onClick={() => toggle(player.name)} aria-pressed={picked.includes(player.name)}><span style={{ height: `${player.score * 2.5}px` }} /><b>{player.score}</b><small>{player.name}</small></button>)}</div><div className="squad-field" aria-live="polite"><span>🏟️</span>{picked.map((name) => <b key={name}>🏏<small>{name}</small></b>)}{Array.from({ length: Math.max(0, 3 - picked.length) }, (_, index) => <i key={index}>?</i>)}</div><p className="selection-note">Squad: {picked.length ? picked.join(", ") : "choose three players"}</p>{complete && <div className="mini-discovery"><b>Asha, Kabir and Noor have the three tallest bars.</b><span>Their scores are 42, 37 and 35.</span></div>}<button className="primary" disabled={!complete} onClick={() => setStep(3)}>Explain the selection →</button></section>}
    {step === 3 && <section className="chapter-event"><p className="activity-prompt">The coach asks why this squad was chosen. Pick the evidence-based answer.</p><div className="offer-grid">{["Their score bars are the three highest", "Their names are shortest"].map((choice) => <button key={choice} className={reason === choice ? "selected" : ""} onClick={() => setReason(choice)}><b>{choice}</b></button>)}</div>{reason === "Their names are shortest" && <p className="try-again">The graph shows scores, not name lengths.</p>}<button className="primary" disabled={reason !== "Their score bars are the three highest"} onClick={() => setStep(4)}>Send the final squad →</button></section>}
    {step === 4 && <Success title="Data-backed squad selected!" question="Why did those three players make the squad?" choices={["Their score bars are the three highest", "Their names are shortest", "They were chosen first"]} answer="Their score bars are the three highest" onFinish={onFinish}>The bars tell the story: Asha, Kabir, and Noor have the three highest scores. A graph helps you compare values quickly.</Success>}
  </>;
}

export function GradeSevenActivity({ id, onFinish }: { id: GradeSevenAdventureId; onFinish: () => void }) {
  const adventure = gradeSevenAdventures.find((item) => item.id === id)!;
  return <section className="activity-panel"><div className="activity-heading"><span>{adventure.icon}</span><div><p className="eyebrow">GRADE 7 · {adventure.topic.toUpperCase()}</p><h1>{adventure.topic}</h1><p className="story-world">Story world · {adventure.title}</p><p>{adventure.intro}</p><div className="subtopic-row">{adventure.subtopics.map((subtopic) => <span key={subtopic}>{subtopic}</span>)}</div></div></div>{id === "mountain" && <MountainRescue onFinish={onFinish} />}{id === "balance" && <BalanceLab onFinish={onFinish} />}{id === "shop" && <SmartShopper onFinish={onFinish} />}{id === "skatepark" && <Skatepark onFinish={onFinish} />}{id === "cricket" && <CricketData onFinish={onFinish} />}</section>;
}
