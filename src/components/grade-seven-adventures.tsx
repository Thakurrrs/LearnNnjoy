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

function MountainRescue({ onFinish }: { onFinish: () => void }) {
  const [position, setPosition] = useState(3);
  const complete = position === -4;
  return <>
    <p className="activity-prompt">Start at <b>+3</b>. Move Nova down <b>7</b> equal levels. Where does the rescue pod land?</p>
    <div className="number-line-lab" aria-label={`Nova is currently at ${position}`}>
      {Array.from({ length: 17 }, (_, index) => index - 8).map((value) => <button key={value} onClick={() => setPosition(value)} className={value === position ? "active" : ""} aria-label={`Move Nova to ${value}`}><i>{value === position ? "✦" : ""}</i><span>{value > 0 ? `+${value}` : value}</span></button>)}
    </div>
    <div className="activity-controls"><button onClick={() => setPosition((value) => Math.max(-8, value - 1))}>← Go down one</button><b>{position > 0 ? `+${position}` : position}</b><button onClick={() => setPosition((value) => Math.min(8, value + 1))}>Go up one →</button></div>
    {complete && <Success title="Rescue pod found!" question="What does 3 − 7 mean on this number line?" choices={["Start at +3 and move 7 steps left", "Start at +3 and move 7 steps right", "Start at −7 and move 3 steps right"]} answer="Start at +3 and move 7 steps left" onFinish={onFinish}>You moved from +3 to −4. Going down past zero keeps counting in the negative direction: <b>3 − 7 = −4</b>.</Success>}
  </>;
}

function BalanceLab({ onFinish }: { onFinish: () => void }) {
  const [removed, setRemoved] = useState(0);
  const complete = removed === 5;
  return <>
    <p className="activity-prompt">A mystery crate plus 5 blocks balances 12 blocks. Remove the <b>same</b> number of blocks from both sides.</p>
    <div className="balance-lab" aria-label="A balanced equation"><div><b>?</b>{Array.from({ length: 5 - removed }, (_, i) => <i key={i}>✦</i>)}</div><strong>⚖️</strong><div>{Array.from({ length: 12 - removed }, (_, i) => <i key={i}>✦</i>)}</div></div>
    <p className="equation-readout">? + {5 - removed} = {12 - removed}</p>
    <div className="activity-controls"><button disabled={removed === 0} onClick={() => setRemoved((value) => value - 1)}>Put one back</button><button className="primary" disabled={complete} onClick={() => setRemoved((value) => value + 1)}>Remove one from both sides</button></div>
    {complete && <Success title="The crate is worth 7!" question="Which move keeps an equation balanced?" choices={["Do the same operation to both sides", "Change only the larger side", "Move a number across without changing it"]} answer="Do the same operation to both sides" onFinish={onFinish}>You kept the scale balanced by doing the same thing to both sides. <b>? + 5 = 12</b> becomes <b>? = 7</b>.</Success>}
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
    {step === 0 && <section className="chapter-event"><p className="activity-prompt">Nova needs an expedition kit before sunset. The price is <b>₹240</b>, and the shopkeeper offers a fair <b>25% discount</b>. Before buying, let&apos;s discover what that promise means.</p><div className="market-scene"><span>🧭</span><span>🎒</span><span>🔦</span><b>₹240</b></div><button className="primary" onClick={() => setStep(1)}>Open the discount clue →</button></section>}
    {step === 1 && <section className="chapter-event"><p className="activity-prompt">A 25% discount means one of <b>four equal parts</b>. Tap one equal part of the ₹240 price tag.</p><div className="quarter-split" aria-label="A price of 240 rupees split into four equal 60 rupee parts">{[0, 1, 2, 3].map((part) => <button key={part} className={quarterChosen ? "chosen" : ""} onClick={() => setQuarterChosen(true)}><b>₹60</b><small>one quarter</small></button>)}</div>{quarterChosen && <div className="mini-discovery"><b>One of four equal ₹60 parts is 1/4 of ₹240.</b><span>25% = 1/4 = ₹60</span></div>}<button className="primary" disabled={!quarterChosen} onClick={() => setStep(2)}>Use the discount dial →</button></section>}
    {step === 2 && <section className="chapter-event"><p className="activity-prompt">Now set the discount dial to the promise: <b>25%</b>. Watch both the saving and final price change together.</p><div className="shop-lab"><div className="shop-tag">₹240</div><div className="discount-ring" style={{ "--dial": `${discount * 3.6}deg` } as React.CSSProperties}><b>{discount}%</b><small>off</small></div><div><b>Saving: ₹{saving}</b><small>New price: ₹{240 - saving}</small></div></div><input className="discount-slider" aria-label="Discount percentage" type="range" min="0" max="50" step="5" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /><div className="activity-controls"><button onClick={() => setDiscount((value) => Math.max(0, value - 5))}>− 5%</button><b>{discount}%</b><button onClick={() => setDiscount((value) => Math.min(50, value + 5))}>+ 5%</button></div>{dialReady && <div className="mini-discovery"><b>₹60 is removed from ₹240.</b><span>₹240 − ₹60 = ₹180</span></div>}<button className="primary" disabled={!dialReady} onClick={() => setStep(3)}>Compare two real offers →</button></section>}
    {step === 3 && <section className="chapter-event"><p className="activity-prompt">Two shops sell the same kit. Choose the deal that leaves Nova with the <b>lower final price</b>.</p><div className="offer-grid"><button className={offer === "trail" ? "selected" : ""} onClick={() => setOffer("trail")}><b>Trail Shop</b><span>₹300</span><strong>20% off</strong><small>Final price: ₹240</small></button><button className={offer === "explorer" ? "selected" : ""} onClick={() => setOffer("explorer")}><b>Explorer Shop</b><span>₹240</span><strong>25% off</strong><small>Final price: ₹180</small></button></div>{offer === "trail" && <p className="try-again">Look at the final prices, not only the discount label. Which one costs less?</p>}{fairOffer && <div className="mini-discovery"><b>Good comparison.</b><span>A larger percentage is useful only when you also check the final price.</span></div>}<button className="primary" disabled={!fairOffer} onClick={() => setStep(4)}>Name the percentage idea →</button></section>}
    {step === 4 && <Success title="A fair deal, calculated!" question="What is 25% of ₹240?" choices={["₹60", "₹25", "₹180"]} answer="₹60" onFinish={onFinish}>You split ₹240 into four equal ₹60 parts, used the 25% discount, and compared final prices. <b>25% = 1/4 = ₹60</b>, so the kit costs <b>₹180</b>.</Success>}
  </>;
}

function Skatepark({ onFinish }: { onFinish: () => void }) {
  const [angle, setAngle] = useState(20);
  const complete = angle === 60;
  return <>
    <p className="activity-prompt">Turn the ramp until it makes a <b>60°</b> angle with the ground. The course triangle will then lock into place.</p>
    <div className="skate-lab"><div className="ground" /><div className="ramp" style={{ transform: `rotate(${-angle}deg)` }} /><div className={complete ? "triangle-frame complete" : "triangle-frame"}>△</div><b>{angle}°</b></div>
    <input className="discount-slider" aria-label="Ramp angle" type="range" min="0" max="120" step="10" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
    <div className="activity-controls"><button onClick={() => setAngle((value) => Math.max(0, value - 10))}>Rotate back</button><b>{angle}°</b><button onClick={() => setAngle((value) => Math.min(120, value + 10))}>Rotate forward</button></div>
    {complete && <Success title="Course locked in!" question="An angle tells us the…" choices={["amount of turn between two lines", "length of the ramp", "number of wheels on the board"]} answer="amount of turn between two lines" onFinish={onFinish}>You built a 60° angle. Angles describe the amount of turn between two lines—not the length of the ramp.</Success>}
  </>;
}

const players = [
  { name: "Asha", score: 42 }, { name: "Kabir", score: 37 }, { name: "Noor", score: 35 }, { name: "Ira", score: 21 },
];

function CricketData({ onFinish }: { onFinish: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const complete = ["Asha", "Kabir", "Noor"].every((name) => picked.includes(name)) && picked.length === 3;
  function toggle(name: string) { setPicked((current) => current.includes(name) ? current.filter((item) => item !== name) : current.length < 3 ? [...current, name] : current); }
  return <>
    <p className="activity-prompt">The team needs the three highest match-score bars. Pick exactly three players using the chart.</p>
    <div className="cricket-lab">{players.map((player) => <button key={player.name} className={picked.includes(player.name) ? "picked" : ""} onClick={() => toggle(player.name)} aria-pressed={picked.includes(player.name)}><span style={{ height: `${player.score * 2.5}px` }} /><b>{player.score}</b><small>{player.name}</small></button>)}</div>
    <p className="selection-note">Squad: {picked.length ? picked.join(", ") : "choose three players"}</p>
    {complete && <Success title="Data-backed squad selected!" question="Why did those three players make the squad?" choices={["Their score bars are the three highest", "Their names are shortest", "They were chosen first"]} answer="Their score bars are the three highest" onFinish={onFinish}>The bars tell the story: Asha, Kabir, and Noor have the three highest scores. A graph helps you compare values quickly.</Success>}
  </>;
}

export function GradeSevenActivity({ id, onFinish }: { id: GradeSevenAdventureId; onFinish: () => void }) {
  const adventure = gradeSevenAdventures.find((item) => item.id === id)!;
  return <section className="activity-panel"><div className="activity-heading"><span>{adventure.icon}</span><div><p className="eyebrow">GRADE 7 · {adventure.topic.toUpperCase()}</p><h1>{adventure.topic}</h1><p className="story-world">Story world · {adventure.title}</p><p>{adventure.intro}</p><div className="subtopic-row">{adventure.subtopics.map((subtopic) => <span key={subtopic}>{subtopic}</span>)}</div></div></div>{id === "mountain" && <MountainRescue onFinish={onFinish} />}{id === "balance" && <BalanceLab onFinish={onFinish} />}{id === "shop" && <SmartShopper onFinish={onFinish} />}{id === "skatepark" && <Skatepark onFinish={onFinish} />}{id === "cricket" && <CricketData onFinish={onFinish} />}</section>;
}
