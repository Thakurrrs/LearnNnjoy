# Story Depth Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serialized story arcs for maths quest missions, concept-accurate animations + teaching moments for all five Grade-7 adventures, and Nova teaching moments (worked example + stuck help) across every subject.

**Architecture:** Pure-function story libs (`story-arcs`, `arc-scene`, `worked-examples`, `explain-moments`, `visual-motifs`) compose a `LessonStory`-compatible scene per question; `page.tsx` swaps one call site. Grade-7 activities in `grade-seven-adventures.tsx` are rewritten in place with a shared `NovaShows` concept-beat panel and physics-honest CSS animations. No `SavedProgress` changes.

**Tech Stack:** Next.js 16 / React 19 client components, TypeScript, Vitest, CSS appended to `src/app/world.css`.

## Global Constraints

- **Story Bible:** Nova speaks first-person with feelings; sentences ≤16 words in Grade-7 copy, ≤12 words in quest-arc copy; `{hero}` token filled via `personalize(text, name)`; completion labels are story-contextual (≤4 words, never matching `/complete/i`); banned labels/words in kid copy: "MISSION MOMENT COMPLETE", "YOU DID IT", "Thoughtful stretch", "Maths calibration", "wrong", "incorrect"; no meta-reassurance on kid screens; `learningObjective` never appears in dialogue.
- **Animations must demonstrate the concept:** Mountain pod moves VERTICALLY (altitude); skater sits ON the rotating ramp and slides/climbs along it; balance demo beam TIPS when one side changes; shopper price bar shades by discount %.
- **No `SavedProgress` schema changes.** Arc choice and worked-example display are pure derivations.
- **Interaction inputs unchanged:** sliders, +/− buttons, tap-to-pick stay; only visuals/copy/feedback change.
- **All existing tests stay green** (70 at branch time). Run `npm run test` in `LearnNnjoy/` before every commit.
- **Branch:** `feature/story-depth-pack`, created from `main` AFTER `feature/kid-interest-pack` PR and the polish task (task_e1288637) are merged. Working dir: `F:\AI Stuff\AntiGravity\Projects\Claude\LearnNnjoy`.
- Grade-7 tasks (1–7) ship FIRST and are independently deliverable.

---

### Task 0: Branch setup

**Files:** none (git only)

- [ ] **Step 1: Verify preconditions**

Run: `git fetch origin && git log --oneline origin/main -5`
Expected: kid-interest-pack merge commit AND polish-task commits present on `main`. If not, STOP — report BLOCKED (preconditions unmerged).

- [ ] **Step 2: Create branch**

```bash
git checkout main && git pull && git checkout -b feature/story-depth-pack
```

Run: `npm run test` — Expected: all tests pass (baseline green).

---

### Task 1: `NovaShows` concept-beat panel (shared component)

**Files:**
- Create: `src/components/nova-shows.tsx`
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Produces: `NovaShows({ lines, cta?, onDone, children? })` — renders Nova's demonstration lines and a dismiss CTA. Used by Tasks 2–6 and Task 13.

- [ ] **Step 1: Create the component**

```tsx
// src/components/nova-shows.tsx
"use client";

export function NovaShows({ lines, cta = "My turn! →", onDone, children }: {
  lines: string[];
  cta?: string;
  onDone: () => void;
  children?: React.ReactNode;
}) {
  return (
    <aside className="nova-shows" aria-label="Nova shows you first">
      <div className="nova-shows-head"><span aria-hidden>✨</span><b>NOVA SHOWS YOU</b></div>
      {children}
      {lines.map((line) => <p key={line}>{line}</p>)}
      <button className="primary" onClick={onDone}>{cta}</button>
    </aside>
  );
}
```

- [ ] **Step 2: Append CSS to `src/app/world.css`**

```css
/* ---- Story Depth Pack: NovaShows concept beat ---- */
.nova-shows { display: grid; gap: 8px; padding: 16px 18px; border-radius: 16px; border: 1px solid rgba(255, 209, 102, .45); background: rgba(124, 96, 232, .14); }
.nova-shows-head { display: flex; align-items: center; gap: 8px; font-size: .78rem; letter-spacing: .1em; }
.nova-shows p { margin: 0; font-size: 1rem; }
.nova-shows .primary { justify-self: start; margin-top: 4px; }
```

- [ ] **Step 3: Verify build + commit**

Run: `npm run lint && npm run test` — Expected: PASS (component unused yet; no test regressions).

```bash
git add src/components/nova-shows.tsx src/app/world.css
git commit -m "feat: NovaShows concept-beat panel"
```

---

### Task 2: Mountain Rescue v2 — vertical cliff lab

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx` (replace the whole `MountainRescue` function, lines ~84–103)
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `NovaShows` from Task 1; existing `ChapterProgress`, `StoryScene`, `Success`, `FinaleScene`, `personalize`.
- Produces: unchanged external signature `MountainRescue({ firstTime, heroName, onFinish })`.

- [ ] **Step 1: Replace the `MountainRescue` function entirely with:**

```tsx
const CLIFF_TOP = 8;
const CLIFF_BOTTOM = -8;
const LEVEL_H = 26; // px per cliff level

function MountainRescue({ firstTime, heroName, onFinish }: { firstTime: boolean; heroName: string; onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [showDemo, setShowDemo] = useState(true);
  const [position, setPosition] = useState(3);
  const [direction, setDirection] = useState<string | null>(null);
  const [equation, setEquation] = useState<string | null>(null);
  const complete = position === -4;
  const levels = Array.from({ length: CLIFF_TOP - CLIFF_BOTTOM + 1 }, (_, i) => CLIFF_TOP - i);
  const fmt = (v: number) => (v > 0 ? `+${v}` : `${v}`);
  return <>
    {step < 5 && <ChapterProgress chapter="Mountain Rescue" step={step} />}
    {step === 0 && <section className="chapter-event"><p className="activity-prompt">{personalize("My rescue pod hung at the +3 ledge. The storm knocked it 7 levels DOWN, {hero}! The mountain map counts levels above and below base camp.", heroName)}</p><StoryScene world="mountain" /><button className="primary" onClick={() => setStep(1)}>Open the cliff map →</button></section>}
    {step === 1 && showDemo && <NovaShows lines={["Watch me first!", "Base camp is ZERO.", "I fly UP one level. That is plus 1.", "I drop DOWN two. Past zero — minus 1!", "Down means MINUS. Up means PLUS."]} onDone={() => setShowDemo(false)} />}
    {step === 1 && !showDemo && <section className="chapter-event"><p className="activity-prompt">Fly the pod DOWN seven levels from +3. Cross base camp if the trail goes there.</p><div className="cliff-lab" aria-label={`Nova's pod is at level ${fmt(position)}`}><div className="cliff-track" style={{ height: `${levels.length * LEVEL_H}px` }}>{levels.map((value) => <button key={value} className={`cliff-level${value === position ? " active" : ""}${value === 0 ? " base-camp" : ""}`} style={{ top: `${(CLIFF_TOP - value) * LEVEL_H}px` }} onClick={() => setPosition(value)} aria-label={`Move the pod to level ${fmt(value)}`}><span>{fmt(value)}</span>{value === 0 && <small>BASE CAMP</small>}</button>)}<span className="cliff-pod" style={{ top: `${(CLIFF_TOP - position) * LEVEL_H}px` }} aria-hidden>🚁</span></div><div className="cliff-readout"><b>Pod level: {fmt(position)}</b><small>{position > 0 ? `${position} above base camp` : position < 0 ? `${-position} below base camp` : "right at base camp"}</small>{complete && <div className="mini-discovery"><b>The pod rests at −4.</b><span>From +3, seven levels down crosses base camp.</span></div>}</div></div><div className="activity-controls"><button onClick={() => setPosition((v) => Math.max(CLIFF_BOTTOM, v - 1))}>↓ Drop one level</button><b>{fmt(position)}</b><button onClick={() => setPosition((v) => Math.min(CLIFF_TOP, v + 1))}>Climb one level ↑</button></div><button className="primary" disabled={!complete} onClick={() => setStep(2)}>Read the rescue marker →</button></section>}
    {step === 2 && <section className="chapter-event"><p className="activity-prompt">The marker says <b>−4</b>. What does the minus sign tell the rescue team?</p><div className="offer-grid"><button className={direction === "below" ? "selected" : ""} onClick={() => setDirection("below")}><b>Below base camp</b><small>The pod sits under the zero line.</small></button><button className={direction === "above" ? "selected" : ""} onClick={() => setDirection("above")}><b>Above base camp</b><small>The pod is still over the zero line.</small></button></div>{direction === "above" && <p className="try-again">Look at the pod on the cliff map. Is −4 over or under the gold base-camp line?</p>}<button className="primary" disabled={direction !== "below"} onClick={() => setStep(3)}>Write the trail move →</button></section>}
    {step === 3 && <section className="chapter-event"><p className="activity-prompt">Choose the equation that records the fall from <b>+3</b> down <b>7</b> levels.</p><div className="offer-grid">{["3 − 7 = −4", "3 + 7 = −4"].map((choice) => <button key={choice} className={equation === choice ? "selected" : ""} onClick={() => setEquation(choice)}><b>{choice}</b></button>)}</div>{equation === "3 + 7 = −4" && <p className="try-again">Falling DOWN takes away levels. Down means minus — so we subtract.</p>}<button className="primary" disabled={equation !== "3 − 7 = −4"} onClick={() => setStep(4)}>Save the rescue route →</button></section>}
    {step === 4 && <Success title="Rescue pod found!" question="What does 3 − 7 mean on the cliff map?" choices={["Start at +3 and drop 7 levels down", "Start at +3 and climb 7 levels up", "Start at −7 and climb 3 levels"]} answer="Start at +3 and drop 7 levels down" onFinish={() => setStep(5)}>The pod fell from +3 to −4. Dropping past base camp keeps counting into minus: <b>3 − 7 = −4</b>.</Success>}
    {step === 5 && <FinaleScene id="mountain" firstTime={firstTime} heroName={heroName} onDone={onFinish} />}
  </>;
}
```

Also add to the imports at the top of the file: `import { NovaShows } from "@/components/nova-shows";`

Note: the old `lineRef`/`useEffect`/`scrollIntoView` block and the horizontal `.mountain-route` / `.number-line-lab` markup are deleted with this replacement. If `useRef`/`useEffect` are then unused in the file, remove them from the React import.

- [ ] **Step 2: Append CSS to `src/app/world.css`**

```css
/* ---- Story Depth Pack: Mountain vertical cliff lab ---- */
.cliff-lab { display: flex; gap: 18px; align-items: flex-start; padding: 14px; }
.cliff-track { position: relative; width: 150px; flex: none; }
.cliff-level { position: absolute; left: 0; width: 100%; height: 26px; display: flex; align-items: center; gap: 8px; background: none; border: none; border-top: 1px dashed rgba(255, 255, 255, .14); color: inherit; cursor: pointer; font-size: .78rem; padding: 0 4px; }
.cliff-level.base-camp { border-top: 2px solid #ffd166; }
.cliff-level.base-camp small { color: #ffd166; letter-spacing: .08em; font-size: .6rem; }
.cliff-level.active span { color: #ffd166; font-weight: 700; }
.cliff-pod { position: absolute; left: 96px; height: 26px; display: flex; align-items: center; font-size: 1.45rem; transition: top .55s cubic-bezier(.45, 0, .25, 1); filter: drop-shadow(0 4px 10px rgba(0, 0, 0, .35)); pointer-events: none; }
.cliff-readout { display: grid; gap: 6px; align-content: start; }
@media (max-width: 760px) { .cliff-lab { gap: 10px; } .cliff-track { width: 128px; } .cliff-pod { left: 82px; } }
```

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run test` — Expected: PASS.

```bash
git add src/components/grade-seven-adventures.tsx src/app/world.css
git commit -m "feat: Mountain Rescue vertical cliff lab with concept beat"
```

---

### Task 3: Skatepark v2 — skater rides the ramp

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx` (replace the whole `Skatepark` function)
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `NovaShows`, `HandAngleControl`/`supportsHandControl` (kept), existing helpers.
- Produces: unchanged signature `Skatepark({ firstTime, heroName, onFinish })`.

- [ ] **Step 1: Replace the `Skatepark` function entirely with:**

```tsx
function Skatepark({ firstTime, heroName, onFinish }: { firstTime: boolean; heroName: string; onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [showDemo, setShowDemo] = useState(true);
  const [angle, setAngle] = useState(20);
  const [triangleAngle, setTriangleAngle] = useState<string | null>(null);
  const [meaning, setMeaning] = useState<string | null>(null);
  const [handMode, setHandMode] = useState(false);
  const complete = angle === 60;
  // Steeper ramp -> skater slides down toward the pivot. Percent along the plank.
  const skaterAlong = Math.max(16, 82 - angle * 0.5);
  return <>
    {step < 5 && <ChapterProgress chapter="Skatepark Architect" step={step} />}
    {step === 0 && <section className="chapter-event"><p className="activity-prompt">{personalize("The rooftop skatepark opens tonight, {hero}! My first ramp must meet the course with a safe 60° turn. Too flat is boring. Too steep is a tumble!", heroName)}</p><StoryScene world="skate" /><button className="primary" onClick={() => setStep(1)}>Inspect the ramp plan →</button></section>}
    {step === 1 && showDemo && <NovaShows lines={["Watch the board!", "Flat ramp — the board barely moves.", "I tilt the ramp UP. The turn gets bigger.", "The board slides DOWN the steep slope!", "That turn between ramp and ground IS the angle."]} onDone={() => setShowDemo(false)} />}
    {step === 1 && !showDemo && <section className="chapter-event"><p className="activity-prompt">Turn the ramp until it meets the ground at exactly <b>60°</b>. Watch the board ride the slope as you turn it.</p><div className={`slope-lab${complete ? " locked" : ""}`} aria-label={`Ramp angle ${angle} degrees`}><div className="slope-ground" /><div className="slope-ramp" style={{ transform: `rotate(${-angle}deg)` }}><span className="slope-skater" style={{ left: `${skaterAlong}%` }} aria-hidden>🛹</span></div><span className="slope-wedge" style={{ ["--wedge" as string]: `${angle}deg` }} aria-hidden /><b className="slope-readout">{angle}°</b></div><input className="discount-slider" aria-label="Ramp angle" type="range" min="0" max="120" step="10" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />{supportsHandControl() && !handMode && <button className="text-button" onClick={() => setHandMode(true)}>✋ Try hand control (beta) — ask your grown-up first, it uses the camera</button>}{handMode && <HandAngleControl onAngle={setAngle} onClose={() => setHandMode(false)} />}<div className="activity-controls"><button onClick={() => setAngle((value) => Math.max(0, value - 10))}>Rotate back</button><b>{angle}°</b><button onClick={() => setAngle((value) => Math.min(120, value + 10))}>Rotate forward</button></div>{complete && <div className="mini-discovery"><b>60° — the board rolls smooth and lands safe!</b><span>An angle measures the turn between two lines, not a length.</span></div>}<button className="primary" disabled={!complete} onClick={() => setStep(2)}>Complete the triangle →</button></section>}
    {step === 2 && <section className="chapter-event"><p className="activity-prompt">The course triangle has three equal turns. Two are <b>60°</b>. What is the third?</p><div className="offer-grid">{["30°", "60°", "120°"].map((choice) => <button key={choice} className={triangleAngle === choice ? "selected" : ""} onClick={() => setTriangleAngle(choice)}><b>{choice}</b></button>)}</div>{triangleAngle && triangleAngle !== "60°" && <p className="try-again">Three EQUAL turns share the triangle. Equal means all three match.</p>}<button className="primary" disabled={triangleAngle !== "60°"} onClick={() => setStep(3)}>Test the design language →</button></section>}
    {step === 3 && <section className="chapter-event"><p className="activity-prompt">Nova tells the builders: &quot;the ramp needs a 60° angle.&quot; What does that tell them?</p><div className="offer-grid">{["The amount of turn between two lines", "The length of the ramp"].map((choice) => <button key={choice} className={meaning === choice ? "selected" : ""} onClick={() => setMeaning(choice)}><b>{choice}</b></button>)}</div>{meaning === "The length of the ramp" && <p className="try-again">The ° sign means turning. A long ramp and a short ramp can share one angle!</p>}<button className="primary" disabled={meaning !== "The amount of turn between two lines"} onClick={() => setStep(4)}>Open the skatepark →</button></section>}
    {step === 4 && <Success title="Course locked in!" question="An angle tells us the…" choices={["amount of turn between two lines", "length of the ramp", "number of wheels on the board"]} answer="amount of turn between two lines" onFinish={() => setStep(5)}>You built a 60° turn and the board proved it rides. Angles describe the turn between two lines — never the length.</Success>}
    {step === 5 && <FinaleScene id="skatepark" firstTime={firstTime} heroName={heroName} onDone={onFinish} />}
  </>;
}
```

- [ ] **Step 2: Append CSS to `src/app/world.css`**

```css
/* ---- Story Depth Pack: Skatepark slope lab ---- */
.slope-lab { position: relative; height: 230px; padding: 12px; overflow: hidden; }
.slope-ground { position: absolute; left: 8%; right: 8%; bottom: 38px; height: 3px; background: rgba(255, 255, 255, .45); border-radius: 2px; }
.slope-ramp { position: absolute; left: 8%; bottom: 38px; width: 210px; height: 7px; background: linear-gradient(90deg, #7c60e8, #ffd166); border-radius: 4px; transform-origin: left bottom; transition: transform .5s cubic-bezier(.4, 0, .2, 1); }
.slope-skater { position: absolute; bottom: 7px; font-size: 1.5rem; transform: translateX(-50%); transition: left .6s ease; }
.slope-wedge { position: absolute; left: 8%; bottom: 38px; width: 74px; height: 74px; transform: translateY(50%); border-radius: 50%; background: conic-gradient(from 270deg, transparent calc(90deg - var(--wedge)), rgba(255, 209, 102, .32) calc(90deg - var(--wedge)), rgba(255, 209, 102, .32) 90deg, transparent 90deg); pointer-events: none; }
.slope-readout { position: absolute; right: 16px; top: 12px; font-size: 1.3rem; color: #ffd166; }
.slope-lab.locked .slope-skater { animation: slope-roll 1.3s cubic-bezier(.55, 0, .6, 1) forwards; }
@keyframes slope-roll { from { left: 82%; } to { left: 8%; } }
@media (max-width: 760px) { .slope-ramp { width: 160px; } .slope-lab { height: 200px; } }
```

- [ ] **Step 3: Verify + commit**

Run: `npm run lint && npm run test` — Expected: PASS.

```bash
git add src/components/grade-seven-adventures.tsx src/app/world.css
git commit -m "feat: Skatepark skater rides the rotating ramp, slides with angle"
```

---

### Task 4: Balance Lab v2 — the tipping demo

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx` (add `BalanceDemo` component; edit `BalanceLab` steps 0–1)
- Modify: `src/app/world.css` (append)

- [ ] **Step 1: Add `BalanceDemo` directly above the `BalanceLab` function:**

```tsx
function BalanceDemo() {
  const [mode, setMode] = useState<"level" | "tipped">("level");
  return (
    <div className="balance-demo">
      <div className={`demo-beam ${mode}`}><span>✦ ✦ ✦</span><i aria-hidden>⚖️</i><span>✦ ✦ ✦</span></div>
      <p>{mode === "level" ? "Same from BOTH sides — still fair!" : "I took from ONE side only. It tips!"}</p>
      <div className="activity-controls"><button onClick={() => setMode("tipped")}>Take from one side</button><button onClick={() => setMode("level")}>Take from both sides</button></div>
    </div>
  );
}
```

- [ ] **Step 2: In `BalanceLab`, add demo state and gate step 1**

Add after `const [step, setStep] = useState(0);`:
```tsx
const [showDemo, setShowDemo] = useState(true);
```

Replace the step 0 prompt text with:
```
Nova's supply crate opens only when the energy scale balances. A mystery crate plus 5 blocks matches 12 blocks. {hero}, help me find the crate's secret number!
```
(wrapped in `personalize(..., heroName)` exactly like Mountain step 0).

Insert between step 0 and the existing step 1 section:
```tsx
{step === 1 && showDemo && <NovaShows lines={["Watch the scale!", "I take a block from ONE side only…", "CRASH — it tips! Not fair.", "Same from BOTH sides — it stays level.", "Fair moves keep the balance true."]} onDone={() => setShowDemo(false)}><BalanceDemo /></NovaShows>}
```
and change the existing step-1 section's condition from `step === 1` to `step === 1 && !showDemo`.

Replace the step-1 try-path copy `"A balance tips if only one side changes."` (step 2 try-again) with `"Remember the demo — one-sided moves tip the scale."`

- [ ] **Step 3: Append CSS to `src/app/world.css`**

```css
/* ---- Story Depth Pack: balance tipping demo ---- */
.balance-demo { display: grid; gap: 8px; justify-items: center; padding: 8px 0; }
.demo-beam { display: flex; align-items: center; gap: 14px; font-size: 1rem; transition: transform .5s cubic-bezier(.5, 0, .4, 1.4); transform-origin: center; }
.demo-beam.tipped { transform: rotate(7deg); }
.demo-beam.tipped span:first-child { opacity: .45; }
.balance-demo p { margin: 0; font-size: .92rem; }
```

- [ ] **Step 4: Verify + commit**

Run: `npm run lint && npm run test` — Expected: PASS.

```bash
git add src/components/grade-seven-adventures.tsx src/app/world.css
git commit -m "feat: Balance Lab tipping demo concept beat"
```

---

### Task 5: Smart Shopper v2 — the price bar

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx` (`SmartShopper` steps 0–2)
- Modify: `src/app/world.css` (append)

- [ ] **Step 1: Add demo state + concept beat**

Add `const [showDemo, setShowDemo] = useState(true);` after `const [step, setStep] = useState(0);` in `SmartShopper`.

Insert before the existing step-1 section:
```tsx
{step === 1 && showDemo && <NovaShows lines={["Watch the price!", "₹240 is the WHOLE bar.", "25% means one of four equal parts.", "I shade one part — ₹60 falls away!", "The rest is what we pay."]} onDone={() => setShowDemo(false)} />}
```
and change the existing step-1 condition from `step === 1` to `step === 1 && !showDemo`.

- [ ] **Step 2: Add the price bar to step 2 (the dial step)**

Inside the step-2 section, directly ABOVE the `<input className="discount-slider" ...>` element, insert:

```tsx
<div className="price-bar" aria-label={`₹240 price bar with ${discount} percent shaded`}>
  <i className="price-shade" style={{ width: `${discount}%` }} />
  {[1, 2, 3].map((q) => <em key={q} className="quarter-mark" style={{ left: `${q * 25}%` }} />)}
  <b className={discount >= 25 ? "quarter-tag off" : "quarter-tag"}>₹60</b>
  <small className="bar-total">₹240</small>
</div>
```

- [ ] **Step 3: Append CSS to `src/app/world.css`**

```css
/* ---- Story Depth Pack: shopper price bar ---- */
.price-bar { position: relative; height: 40px; border-radius: 10px; border: 1px solid rgba(255, 209, 102, .5); background: rgba(124, 96, 232, .18); overflow: hidden; margin: 10px 0 4px; }
.price-shade { position: absolute; inset: 0 auto 0 0; background: repeating-linear-gradient(45deg, rgba(255, 209, 102, .45) 0 8px, rgba(255, 209, 102, .25) 8px 16px); transition: width .35s ease; }
.quarter-mark { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(255, 255, 255, .35); }
.quarter-tag { position: absolute; left: 4%; top: 50%; transform: translateY(-50%); font-size: .82rem; transition: transform .45s ease, opacity .45s ease; }
.quarter-tag.off { transform: translateY(-130%) rotate(-10deg); opacity: .55; }
.bar-total { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); opacity: .7; }
```

- [ ] **Step 4: Verify + commit**

Run: `npm run lint && npm run test` — Expected: PASS.

```bash
git add src/components/grade-seven-adventures.tsx src/app/world.css
git commit -m "feat: Smart Shopper price bar makes percent visible"
```

---

### Task 6: Cricket Data v2 — concept beat + copy pass

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx` (`CricketData` steps 0–1)

- [ ] **Step 1: Add demo state + concept beat**

Add `const [showDemo, setShowDemo] = useState(true);` after `const [step, setStep] = useState(0);` in `CricketData`.

Replace the step-0 prompt with (wrapped in `personalize(..., heroName)`):
```
The final starts at sunset, {hero}! I must pick a three-player squad. My heart says friends. The chart says scores. Help me trust the chart!
```

Insert before the existing step-1 section:
```tsx
{step === 1 && showDemo && <NovaShows lines={["Watch me read a bar!", "Ira's bar stops at 21.", "Asha's bar climbs to 42 — twice as tall!", "Taller bar means bigger number.", "The chart never guesses."]} onDone={() => setShowDemo(false)} />}
```
and change the existing step-1 condition from `step === 1` to `step === 1 && !showDemo`.

- [ ] **Step 2: Verify + commit**

Run: `npm run lint && npm run test` — Expected: PASS.

```bash
git add src/components/grade-seven-adventures.tsx
git commit -m "feat: Cricket Data concept beat teaches bar reading"
```

---

### Task 7: G7 concept-beat copy under lint

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx` (export the concept-beat lines as a table)
- Modify: `src/lib/story-lint.test.ts`
- Test: `src/lib/story-lint.test.ts`

**Interfaces:**
- Produces: `export const conceptBeats: Record<GradeSevenAdventureId, string[]>` consumed by the lint test.

- [ ] **Step 1: Extract the five NovaShows `lines` arrays into one exported table**

At module level in `grade-seven-adventures.tsx` (near `finaleCopy`):

```tsx
export const conceptBeats: Record<GradeSevenAdventureId, string[]> = {
  mountain: ["Watch me first!", "Base camp is ZERO.", "I fly UP one level. That is plus 1.", "I drop DOWN two. Past zero — minus 1!", "Down means MINUS. Up means PLUS."],
  balance: ["Watch the scale!", "I take a block from ONE side only…", "CRASH — it tips! Not fair.", "Same from BOTH sides — it stays level.", "Fair moves keep the balance true."],
  shop: ["Watch the price!", "₹240 is the WHOLE bar.", "25% means one of four equal parts.", "I shade one part — ₹60 falls away!", "The rest is what we pay."],
  skatepark: ["Watch the board!", "Flat ramp — the board barely moves.", "I tilt the ramp UP. The turn gets bigger.", "The board slides DOWN the steep slope!", "That turn between ramp and ground IS the angle."],
  cricket: ["Watch me read a bar!", "Ira's bar stops at 21.", "Asha's bar climbs to 42 — twice as tall!", "Taller bar means bigger number.", "The chart never guesses."],
};
```

Then replace each activity's inline `lines={[...]}` with `lines={conceptBeats.mountain}` (etc.) so component and lint share one source.

- [ ] **Step 2: Write the failing lint extension**

In `src/lib/story-lint.test.ts`, add (mirroring the file's existing banned-label/sentence-length helpers):

```ts
import { conceptBeats } from "@/components/grade-seven-adventures";

describe("G7 concept beats obey the Story Bible", () => {
  const allLines = Object.values(conceptBeats).flat();
  it("has five beat sets with at least 3 lines each", () => {
    expect(Object.keys(conceptBeats)).toHaveLength(5);
    Object.values(conceptBeats).forEach((lines) => expect(lines.length).toBeGreaterThanOrEqual(3));
  });
  it("keeps every sentence within 16 words", () => {
    allLines.forEach((line) => line.split(/[.!?…]+/).filter(Boolean).forEach((s) => {
      expect(s.trim().split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(16);
    }));
  });
  it("never uses banned words", () => {
    allLines.forEach((line) => expect(line).not.toMatch(/wrong|incorrect|thoughtful stretch|you did it/i));
  });
});
```

Run: `npm run test -- src/lib/story-lint.test.ts` — Expected: PASS (or FAIL pinpointing an over-long line — shorten the line, not the test).

- [ ] **Step 3: Full suite + commit**

Run: `npm run test` — Expected: all pass.

```bash
git add src/components/grade-seven-adventures.tsx src/lib/story-lint.test.ts
git commit -m "test: concept beats exported and linted"
```

**Grade-7 milestone: Tasks 1–7 are a shippable increment. Verify in-browser (Task 15 steps 1–3) before continuing if shipping now.**

---

### Task 8: `worked-examples` lib

**Files:**
- Create: `src/lib/worked-examples.ts`
- Test: `src/lib/worked-examples.test.ts`

**Interfaces:**
- Consumes: `Question` type from `./learning` (field `visual`).
- Produces: `type WorkedExample = { intro: string; steps: string[]; punchline: string }`, `getWorkedExample(visual: string): WorkedExample`, `isFirstOfVisual(quests: { visual: string }[], index: number): boolean`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/worked-examples.test.ts
import { describe, expect, it } from "vitest";
import { getWorkedExample, isFirstOfVisual } from "./worked-examples";

const VISUALS = ["fraction", "number-line", "formula", "coordinate", "ratio", "ecosystem", "reading", "map"];

describe("worked examples", () => {
  it("covers every visual with intro, 2-3 steps, punchline", () => {
    VISUALS.forEach((visual) => {
      const example = getWorkedExample(visual);
      expect(example.intro.length).toBeGreaterThan(0);
      expect(example.steps.length).toBeGreaterThanOrEqual(2);
      expect(example.steps.length).toBeLessThanOrEqual(3);
      expect(example.punchline).toContain("{hero}");
    });
  });
  it("falls back to ratio for unknown visuals", () => {
    expect(getWorkedExample("mystery")).toEqual(getWorkedExample("ratio"));
  });
  it("flags only the first question of each visual", () => {
    const quests = [{ visual: "fraction" }, { visual: "ratio" }, { visual: "fraction" }];
    expect(isFirstOfVisual(quests, 0)).toBe(true);
    expect(isFirstOfVisual(quests, 1)).toBe(true);
    expect(isFirstOfVisual(quests, 2)).toBe(false);
  });
});
```

Run: `npm run test -- src/lib/worked-examples.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 2: Implement**

```ts
// src/lib/worked-examples.ts
export type WorkedExample = { intro: string; steps: string[]; punchline: string };

const byVisual: Record<string, WorkedExample> = {
  fraction: { intro: "My turn first!", steps: ["I cut my piece into two parts.", "I check: both parts match exactly.", "Matching parts mean EQUAL shares."], punchline: "Each part is one-half. Now yours, {hero}!" },
  "number-line": { intro: "My turn first!", steps: ["I stand on my number.", "One step right adds one.", "One step left takes one away."], punchline: "Count the steps out loud. Your turn, {hero}!" },
  formula: { intro: "My turn first!", steps: ["I feed the machine a number.", "The rule changes it one step.", "I undo the step to check."], punchline: "One rule, one step at a time. Go, {hero}!" },
  coordinate: { intro: "My turn first!", steps: ["I read ACROSS first.", "Then I read UP.", "The point sits where they meet."], punchline: "Across, then up — every time. Try it, {hero}!" },
  ratio: { intro: "My turn first!", steps: ["I make one small group.", "I copy the group exactly.", "Both groups grow the SAME way."], punchline: "Matching groups stay fair. Your turn, {hero}!" },
  ecosystem: { intro: "My turn first!", steps: ["I look before I touch.", "I name what changed.", "The clue tells me what it needs."], punchline: "Look, then think. Now you look, {hero}!" },
  reading: { intro: "My turn first!", steps: ["I read the line slowly.", "I catch the exact words.", "The words hold the answer."], punchline: "The words never lie. Your turn, {hero}!" },
  map: { intro: "My turn first!", steps: ["I find the compass first.", "Then I match the symbols.", "The map points the way."], punchline: "Compass, then symbols. Lead us, {hero}!" },
};

export function getWorkedExample(visual: string): WorkedExample {
  return byVisual[visual] ?? byVisual.ratio;
}

export function isFirstOfVisual(quests: { visual: string }[], index: number): boolean {
  const target = quests[index]?.visual;
  return quests.findIndex((quest) => quest.visual === target) === index;
}
```

- [ ] **Step 3: Run test, expect PASS, commit**

```bash
git add src/lib/worked-examples.ts src/lib/worked-examples.test.ts
git commit -m "feat: worked-examples lib - Nova demonstrates each skill once"
```

---

### Task 9: `explain-moments` lib

**Files:**
- Create: `src/lib/explain-moments.ts`
- Test: `src/lib/explain-moments.test.ts`

**Interfaces:**
- Consumes: `Question` from `./learning` (fields `visual`, `hint`).
- Produces: `explainMoment(question: { visual: string; hint: string }, wrongAttempts: number): string`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/explain-moments.test.ts
import { describe, expect, it } from "vitest";
import { explainMoment } from "./explain-moments";

const question = { visual: "fraction", hint: "Count the equal pieces first." };

describe("explain moments", () => {
  it("weaves the hint into Nova's teaching line", () => {
    expect(explainMoment(question, 1)).toContain("Count the equal pieces first.");
  });
  it("invites a retry on the first miss", () => {
    expect(explainMoment(question, 1)).toMatch(/try again/i);
  });
  it("points back to the worked example from the second miss", () => {
    expect(explainMoment(question, 2)).toMatch(/example/i);
  });
  it("never says wrong or incorrect", () => {
    [1, 2, 3].forEach((n) => expect(explainMoment(question, n)).not.toMatch(/wrong|incorrect/i));
  });
  it("handles unknown visuals", () => {
    expect(explainMoment({ visual: "mystery", hint: "A clue." }, 1)).toContain("A clue.");
  });
});
```

Run: `npm run test -- src/lib/explain-moments.test.ts` — Expected: FAIL.

- [ ] **Step 2: Implement**

```ts
// src/lib/explain-moments.ts
const frames: Record<string, string> = {
  fraction: "Hmm — those pieces aren't equal yet.",
  "number-line": "Hmm — we stepped the other way.",
  formula: "Hmm — the machine used a different rule.",
  coordinate: "Hmm — the map says something else.",
  ratio: "Hmm — the groups don't match yet.",
  ecosystem: "Hmm — the clues point another way.",
  reading: "Hmm — the words say something different.",
  map: "Hmm — the compass disagrees.",
};

export function explainMoment(question: { visual: string; hint: string }, wrongAttempts: number): string {
  const frame = frames[question.visual] ?? frames.ratio;
  const coach = wrongAttempts >= 2 ? "Watch my example one more time. Then go!" : "Think with me, then try again!";
  return `${frame} ${question.hint} ${coach}`;
}
```

- [ ] **Step 3: Run test, expect PASS, commit**

```bash
git add src/lib/explain-moments.ts src/lib/explain-moments.test.ts
git commit -m "feat: explain-moments lib - Nova teaches on a miss"
```

---

### Task 10: `visual-motifs` lib (per-visual presentation defaults)

**Files:**
- Create: `src/lib/visual-motifs.ts`
- Test: `src/lib/visual-motifs.test.ts`

**Interfaces:**
- Produces: `getMotif(visual: string): Motif` where `type Motif = { learningObjective: string; coachLine: string; outcomeIcon: string; videoCue: string; reelFrames: [string, string, string, string] }`.
- Content: copy each visual's `learningObjective`, `coachLine`, `outcomeIcon`, `videoCue`, `reelFrames` **verbatim** from the current `defaultStory` branches in `src/lib/lesson-story.ts` (fraction, number-line, formula, coordinate, ecosystem, reading, map, and the final ratio/default branch). Unknown visuals fall back to the ratio motif.

- [ ] **Step 1: Failing test**

```ts
// src/lib/visual-motifs.test.ts
import { describe, expect, it } from "vitest";
import { getMotif } from "./visual-motifs";

describe("visual motifs", () => {
  ["fraction", "number-line", "formula", "coordinate", "ratio", "ecosystem", "reading", "map"].forEach((visual) => {
    it(`provides a complete motif for ${visual}`, () => {
      const motif = getMotif(visual);
      expect(motif.learningObjective.length).toBeGreaterThan(0);
      expect(motif.coachLine.length).toBeGreaterThan(0);
      expect(motif.outcomeIcon.length).toBeGreaterThan(0);
      expect(motif.reelFrames).toHaveLength(4);
    });
  });
  it("falls back to ratio", () => {
    expect(getMotif("mystery")).toEqual(getMotif("ratio"));
  });
});
```

- [ ] **Step 2: Implement by verbatim extraction** (open `lesson-story.ts`, copy the five fields per branch into a `Record<string, Motif>`; do not rewrite the strings). Run test → PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/visual-motifs.ts src/lib/visual-motifs.test.ts
git commit -m "feat: visual-motifs lib extracted from lesson-story defaults"
```

---

### Task 11: `story-arcs` — three maths adventures

**Files:**
- Create: `src/lib/story-arcs.ts`
- Test: `src/lib/story-arcs.test.ts`

**Interfaces:**
- Consumes: `SubjectId` from `./curriculum-map`, `Grade` from `./learning`.
- Produces: `type ArcBeat`, `type Arc`, `MATHS_ARCS: Arc[]`, `getArcFor(subject: SubjectId, grade: Grade): Arc | null`.

- [ ] **Step 1: Types + selection rule**

```ts
// src/lib/story-arcs.ts
import type { SubjectId } from "./curriculum-map";
import type { Grade } from "./learning";

export type ArcBeat = {
  chapterTitle: string;
  chapterDialogue: string; // {hero} allowed; Nova first-person
  chapterAction: string;
  completeLabel: string;   // <=4 words, story-contextual
  outcomeTitle: string;
  outcomeDetail: string;   // plot advances here
};

export type Arc = {
  id: string;
  title: string;
  subject: SubjectId;
  beats: ArcBeat[];
  bridges: Record<string, string>; // per visual type; maths arcs cover all five
  finaleBeat: ArcBeat;
};

export function getArcFor(subject: SubjectId, grade: Grade): Arc | null {
  if (subject !== "maths") return null; // non-maths arcs are a later phase
  return MATHS_ARCS[grade % 3];
}
```

- [ ] **Step 2: Author the three arcs — copy the tables verbatim**

Shared bridge sets (each arc has its own flavor; all five maths visuals covered):

```ts
export const MATHS_ARCS: Arc[] = [
  {
    id: "sky-whale",
    title: "The Sky-Whale of Cloud Island",
    subject: "maths",
    bridges: {
      fraction: "Her wing patch needs EQUAL pieces. Cut it fair!",
      "number-line": "Count her steps along the cliff path!",
      formula: "The wind machine follows one rule. Crack it!",
      coordinate: "Read the flight map. It knows the way!",
      ratio: "Pack matching food bundles for the flight!",
    },
    beats: [
      { chapterTitle: "A crash on Cloud Island.", chapterDialogue: "\"{hero}! A sky-whale crashed on Cloud Island. She can't fly home!\"", chapterAction: "Run to the whale", completeLabel: "PATCH READY!", outcomeTitle: "The first patch holds.", outcomeDetail: "\"It fits her wing! She flapped once and smiled, {hero}!\"" },
      { chapterTitle: "Her wing needs more.", chapterDialogue: "\"One patch isn't enough, {hero}. The tear is longer than my arm!\"", chapterAction: "Fix the long tear", completeLabel: "TEAR CLOSED!", outcomeTitle: "The wing is whole.", outcomeDetail: "\"The whole tear is closed! She stretched her wing wide, {hero}!\"" },
      { chapterTitle: "She is too weak to fly.", chapterDialogue: "\"She needs food, {hero}. Sky-whales eat cloudberries — LOTS of them.\"", chapterAction: "Gather cloudberries", completeLabel: "BERRIES PACKED!", outcomeTitle: "She eats and glows.", outcomeDetail: "\"She ate every berry! Her fins are glowing again, {hero}!\"" },
      { chapterTitle: "The practice glide.", chapterDialogue: "\"Time to practice, {hero}! She glides the cliff path — we guide her.\"", chapterAction: "Guide the glide", completeLabel: "GLIDE STEADY!", outcomeTitle: "She glides the whole path.", outcomeDetail: "\"She followed every step you counted! No wobbles, {hero}!\"" },
      { chapterTitle: "The storm returns.", chapterDialogue: "\"Dark clouds, {hero}! We must find the safe gap between them.\"", chapterAction: "Find the safe gap", completeLabel: "GAP FOUND!", outcomeTitle: "A path through the storm.", outcomeDetail: "\"You found the one safe gap! She squeezed right through, {hero}!\"" },
      { chapterTitle: "The wind machine wakes.", chapterDialogue: "\"The island's wind machine is blowing her backwards, {hero}!\"", chapterAction: "Calm the machine", completeLabel: "WIND CALMED!", outcomeTitle: "The machine settles.", outcomeDetail: "\"You cracked its rule and it purred quiet. She thanked you with a splash, {hero}!\"" },
      { chapterTitle: "The long climb.", chapterDialogue: "\"Home is HIGH, {hero}. She climbs level by level. Stay with her!\"", chapterAction: "Climb with her", completeLabel: "HEIGHT REACHED!", outcomeTitle: "She reaches whale height.", outcomeDetail: "\"Level by level, she made it! The high winds carry her now, {hero}!\"" },
      { chapterTitle: "Her family calls.", chapterDialogue: "\"Listen, {hero}! Whale song! The map shows where it comes from.\"", chapterAction: "Read the song map", completeLabel: "SONG TRACED!", outcomeTitle: "The song has a home.", outcomeDetail: "\"You traced the song to the North Drift! Her family is waiting, {hero}!\"" },
      { chapterTitle: "One last check.", chapterDialogue: "\"Before she goes, {hero} — supplies for the journey. Make them match!\"", chapterAction: "Pack the journey kit", completeLabel: "KIT MATCHED!", outcomeTitle: "The kit is perfect.", outcomeDetail: "\"Every bundle matches! She tucked them under her fin, {hero}!\"" },
      { chapterTitle: "The goodbye lap.", chapterDialogue: "\"She wants one goodbye lap around the island, {hero}. Guide her true!\"", chapterAction: "Fly the lap", completeLabel: "LAP FLOWN!", outcomeTitle: "A perfect circle.", outcomeDetail: "\"A perfect lap! The whole island waved, {hero}!\"" },
      { chapterTitle: "The wind test.", chapterDialogue: "\"Last test, {hero}. The crosswind pushes hard. Hold her line!\"", chapterAction: "Hold the line", completeLabel: "LINE HELD!", outcomeTitle: "Steady in the wind.", outcomeDetail: "\"She held her line in the crosswind! Nothing can stop her now, {hero}!\"" },
    ],
    finaleBeat: { chapterTitle: "Fly home, sky-whale.", chapterDialogue: "\"This is it, {hero}. The big lift-off. She trusts you!\"", chapterAction: "Launch her home", completeLabel: "SHE'S FLYING!", outcomeTitle: "The sky-whale sings.", outcomeDetail: "\"She circled the island TWICE and sang your name, {hero}! Fly safe, friend!\"" },
  },
  {
    id: "comet-cup",
    title: "The Comet Cup Race",
    subject: "maths",
    bridges: {
      fraction: "Split the racer snack into EQUAL shares!",
      "number-line": "Count the track markers, step by step!",
      formula: "The pit machine follows one rule. Beat it!",
      coordinate: "Read the course map. Every turn is plotted!",
      ratio: "Match the fuel packs to the racers!",
    },
    beats: [
      { chapterTitle: "Race day on Star Track.", chapterDialogue: "\"{hero}! Mira and I entered the Comet Cup. We race at moonrise!\"", chapterAction: "Join the crew", completeLabel: "SNACK SHARED!", outcomeTitle: "Fair fuel for two.", outcomeDetail: "\"Half for me, half for Mira! Fair racers fly faster, {hero}!\"" },
      { chapterTitle: "The starting grid.", chapterDialogue: "\"Our grid spot is marked in steps, {hero}. Walk me to it?\"", chapterAction: "Find the grid spot", completeLabel: "GRID FOUND!", outcomeTitle: "Lined up and ready.", outcomeDetail: "\"Spot twelve, exactly! The starter waved her flag at us, {hero}!\"" },
      { chapterTitle: "The pit machine jams.", chapterDialogue: "\"The tyre machine ate our spare wheel, {hero}! It follows ONE rule.\"", chapterAction: "Crack the pit rule", completeLabel: "WHEEL FREED!", outcomeTitle: "The machine gives in.", outcomeDetail: "\"You beat its rule! Wheel back, machine grumpy, crew laughing, {hero}!\"" },
      { chapterTitle: "The practice lap.", chapterDialogue: "\"Practice lap, {hero}! The course map shows every turn. Read it with me!\"", chapterAction: "Read the course", completeLabel: "COURSE READ!", outcomeTitle: "Every turn known.", outcomeDetail: "\"You called every turn before it came! Mira couldn't believe it, {hero}!\"" },
      { chapterTitle: "Fuel trouble.", chapterDialogue: "\"Three racers joined our team, {hero}! Everyone needs matching fuel packs.\"", chapterAction: "Mix the fuel", completeLabel: "FUEL MATCHED!", outcomeTitle: "Five matching packs.", outcomeDetail: "\"Every pack matches! The whole team glows the same gold, {hero}!\"" },
      { chapterTitle: "The moonrise start.", chapterDialogue: "\"BANG — we're racing, {hero}! Count us past the first markers!\"", chapterAction: "Race the markers", completeLabel: "MARKERS PASSED!", outcomeTitle: "Clean first stretch.", outcomeDetail: "\"Marker after marker, you kept us true! We're in third place, {hero}!\"" },
      { chapterTitle: "The tunnel of turns.", chapterDialogue: "\"The tunnel splits FOUR ways, {hero}. Only the map knows the fast one!\"", chapterAction: "Pick the fast fork", completeLabel: "FORK PICKED!", outcomeTitle: "The shortcut works.", outcomeDetail: "\"The map was right! We passed Comet Kai in the dark, {hero}!\"" },
      { chapterTitle: "Halfway — split the water.", chapterDialogue: "\"Water stop, {hero}! One bottle, two thirsty racers. Make it fair!\"", chapterAction: "Share the water", completeLabel: "WATER FAIR!", outcomeTitle: "Both racers refreshed.", outcomeDetail: "\"Equal sips, no arguments! Back in the race, {hero}!\"" },
      { chapterTitle: "The rival's riddle.", chapterDialogue: "\"Comet Kai left a rule-lock on the bridge, {hero}! Solve it to pass!\"", chapterAction: "Break the lock", completeLabel: "LOCK BROKEN!", outcomeTitle: "The bridge opens.", outcomeDetail: "\"The lock popped open! Kai saluted us — respect earned, {hero}!\"" },
      { chapterTitle: "The final stretch.", chapterDialogue: "\"Second place, {hero}! The last markers decide it. Count perfectly!\"", chapterAction: "Count the sprint", completeLabel: "SPRINT COUNTED!", outcomeTitle: "Wheel to wheel.", outcomeDetail: "\"You counted us wheel to wheel with the leader, {hero}! One turn left!\"" },
      { chapterTitle: "The last turn.", chapterDialogue: "\"The map shows one secret inside line, {hero}. Find it NOW!\"", chapterAction: "Take the inside line", completeLabel: "LINE TAKEN!", outcomeTitle: "Ahead at the bend.", outcomeDetail: "\"Inside line, clean pass! The finish gate is glowing, {hero}!\"" },
    ],
    finaleBeat: { chapterTitle: "The Comet Cup finish.", chapterDialogue: "\"The finish gate, {hero}! Everything we practiced — NOW!\"", chapterAction: "Cross the line", completeLabel: "CUP WON!", outcomeTitle: "The Comet Cup is ours.", outcomeDetail: "\"WE WON, {hero}! Mira held the cup up and shouted YOUR name!\"" },
  },
  {
    id: "lighthouse",
    title: "The Lost Lighthouse of Star Harbor",
    subject: "maths",
    bridges: {
      fraction: "The lens needs EQUAL glass pieces. Fit them!",
      "number-line": "Climb the tower steps — count each one!",
      formula: "The light engine follows one rule. Fix it!",
      coordinate: "Read the harbor chart. Boats trust it!",
      ratio: "Match oil jars to the lamp burners!",
    },
    beats: [
      { chapterTitle: "A dark harbor.", chapterDialogue: "\"{hero}, the lighthouse went dark! Night boats can't find Star Harbor!\"", chapterAction: "Hurry to the tower", completeLabel: "DOOR OPEN!", outcomeTitle: "Inside the tower.", outcomeDetail: "\"The old door creaked open! Dusty stairs spiral up and up, {hero}.\"" },
      { chapterTitle: "The broken lens.", chapterDialogue: "\"The great lens shattered, {hero}. Its glass pieces must fit EXACTLY.\"", chapterAction: "Rebuild the lens", completeLabel: "LENS WHOLE!", outcomeTitle: "The lens gleams.", outcomeDetail: "\"Every piece equal, every edge true! The lens catches starlight, {hero}!\"" },
      { chapterTitle: "The spiral stairs.", chapterDialogue: "\"The lamp room is HIGH, {hero}. The stairs count us up. Don't skip!\"", chapterAction: "Climb the spiral", completeLabel: "TOP REACHED!", outcomeTitle: "The lamp room door.", outcomeDetail: "\"Step by counted step — the lamp room, {hero}! The old lamp sleeps inside.\"" },
      { chapterTitle: "The sleeping engine.", chapterDialogue: "\"The light engine runs on ONE rule, {hero}. The keeper wrote it down… somewhere!\"", chapterAction: "Wake the engine", completeLabel: "ENGINE AWAKE!", outcomeTitle: "A hum in the tower.", outcomeDetail: "\"You found the rule and the engine HUMMED awake, {hero}! It wants oil.\"" },
      { chapterTitle: "Oil for the burners.", chapterDialogue: "\"Four burners, {hero}, and a shelf of oil jars. Each burner needs its match!\"", chapterAction: "Fill the burners", completeLabel: "BURNERS FED!", outcomeTitle: "Four steady flames.", outcomeDetail: "\"Matching jars, matching flames! The lamp glows soft gold, {hero}.\"" },
      { chapterTitle: "The harbor chart.", chapterDialogue: "\"The light must sweep where boats sail, {hero}. The chart shows their paths!\"", chapterAction: "Aim the beam", completeLabel: "BEAM AIMED!", outcomeTitle: "Light on the water.", outcomeDetail: "\"The beam sweeps the true channel! A fishing boat blinked thanks, {hero}!\"" },
      { chapterTitle: "The fog rolls in.", chapterDialogue: "\"Fog, {hero}! The beam must pulse on a counting pattern. Set it!\"", chapterAction: "Set the pulse", completeLabel: "PULSE SET!", outcomeTitle: "A rhythm in the fog.", outcomeDetail: "\"Flash… two… three… flash! Boats hear the rhythm with their eyes, {hero}!\"" },
      { chapterTitle: "The keeper's puzzle.", chapterDialogue: "\"The old keeper locked the storm bell with a rule, {hero}. Storms need that bell!\"", chapterAction: "Unlock the bell", completeLabel: "BELL FREED!", outcomeTitle: "The bell swings.", outcomeDetail: "\"The rule clicked, the bell swung — BONG! The tower feels alive, {hero}!\"" },
      { chapterTitle: "Supplies for winter.", chapterDialogue: "\"Winter is long, {hero}. The storeroom needs matching supply crates!\"", chapterAction: "Stock the storeroom", completeLabel: "CRATES STACKED!", outcomeTitle: "A full storeroom.", outcomeDetail: "\"Every crate matched and stacked! The tower could glow for YEARS, {hero}!\"" },
      { chapterTitle: "The night fleet.", chapterDialogue: "\"Look, {hero} — twelve boats coming home at once! The chart holds them all.\"", chapterAction: "Guide the fleet", completeLabel: "FLEET GUIDED!", outcomeTitle: "Twelve safe boats.", outcomeDetail: "\"Every boat found its dock by your light, {hero}! The harbor is singing!\"" },
      { chapterTitle: "The far rock.", chapterDialogue: "\"One old danger left, {hero} — the far rock. Mark it true on the chart!\"", chapterAction: "Mark the rock", completeLabel: "ROCK MARKED!", outcomeTitle: "No more secrets.", outcomeDetail: "\"The far rock is charted forever! No boat will ever hit it, {hero}.\"" },
    ],
    finaleBeat: { chapterTitle: "Light the great lamp.", chapterDialogue: "\"Everything is ready, {hero}. Throw the great switch WITH me!\"", chapterAction: "Light the harbor", completeLabel: "HARBOR LIT!", outcomeTitle: "Star Harbor shines.", outcomeDetail: "\"The beam reached the STARS, {hero}! Every boat horn in the harbor is cheering you!\"" },
  },
];
```

- [ ] **Step 3: Write the lint test**

```ts
// src/lib/story-arcs.test.ts
import { describe, expect, it } from "vitest";
import { MATHS_ARCS, getArcFor } from "./story-arcs";
import { getQuestsForGrade } from "./grade-quests";
import { personalize } from "./personalize";

const MATHS_GRADES = [4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const MATHS_VISUALS = ["fraction", "number-line", "formula", "coordinate", "ratio"];
const BANNED = /mission moment complete|you did it|thoughtful stretch|maths calibration|wrong|incorrect/i;

describe("story arcs", () => {
  it("assigns an arc to every maths grade and none elsewhere", () => {
    MATHS_GRADES.forEach((grade) => expect(getArcFor("maths", grade)).not.toBeNull());
    expect(getArcFor("science", 4)).toBeNull();
  });
  it("has enough beats for every assigned mission", () => {
    MATHS_GRADES.forEach((grade) => {
      const arc = getArcFor("maths", grade)!;
      const missionLength = getQuestsForGrade(grade).length;
      expect(arc.beats.length).toBeGreaterThanOrEqual(missionLength - 1);
    });
  });
  it("bridges all five maths visuals in every arc", () => {
    MATHS_ARCS.forEach((arc) => MATHS_VISUALS.forEach((visual) => {
      expect(arc.bridges[visual], `${arc.id} missing bridge for ${visual}`).toBeTruthy();
    }));
  });
  it("obeys the Story Bible in every beat", () => {
    MATHS_ARCS.forEach((arc) => [...arc.beats, arc.finaleBeat].forEach((beat) => {
      const all = [beat.chapterTitle, beat.chapterDialogue, beat.chapterAction, beat.completeLabel, beat.outcomeTitle, beat.outcomeDetail].join(" ");
      expect(all).not.toMatch(BANNED);
      expect(beat.completeLabel).not.toMatch(/complete/i);
      expect(beat.completeLabel.split(/\s+/).length).toBeLessThanOrEqual(4);
      expect(personalize(all, "Aanya")).not.toContain("{hero}");
      personalize(beat.chapterDialogue, "Aanya").split(/[.!?…]+/).filter(Boolean).forEach((sentence) => {
        expect(sentence.trim().split(/\s+/).filter(Boolean).length, `${arc.id}: "${sentence.trim()}"`).toBeLessThanOrEqual(12);
      });
    }));
  });
});
```

Run: `npm run test -- src/lib/story-arcs.test.ts` — Expected: PASS. If "enough beats" fails for a grade, add extra beats continuing that arc's plot (same voice/rules) until it passes.

- [ ] **Step 4: Commit**

```bash
git add src/lib/story-arcs.ts src/lib/story-arcs.test.ts
git commit -m "feat: three serialized maths story arcs with Story-Bible lint"
```

---

### Task 12: `arc-scene` engine + retire maths templates

**Files:**
- Create: `src/lib/arc-scene.ts`
- Test: `src/lib/arc-scene.test.ts`
- Modify: `src/lib/lesson-story.ts` (delete the maths branches: `byQuestionId` g4 entries and the fraction/number-line/formula/coordinate/ratio-default branches; KEEP ecosystem/reading/map branches and the `LessonStory` type; the default return becomes the ecosystem branch's shape? No — keep the ratio/default branch as the final fallback since non-maths callers may pass unknown visuals. Delete only `byQuestionId` and the four maths-specific `if` branches: fraction, number-line, formula, coordinate.)
- Modify: `src/lib/lesson-story.test.ts`, `src/lib/story-lint.test.ts`, `src/lib/video-assets.test.ts` (migrate maths cases to `getArcScene`)

**Interfaces:**
- Consumes: `getArcFor` (Task 11), `getMotif` (Task 10), `getWorkedExample`/`isFirstOfVisual` (Task 8), `getLessonStory` (fallback), `Question`/`Grade`, `SubjectId`.
- Produces:

```ts
export type ArcScene = LessonStory & { workedExample: WorkedExample | null };
export function getArcScene(args: {
  subject: SubjectId; grade: Grade;
  questIndex: number; quests: Question[];
  question: Question;
}): ArcScene;
```

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/arc-scene.test.ts
import { describe, expect, it } from "vitest";
import { getArcScene } from "./arc-scene";
import { getArcFor } from "./story-arcs";
import { getQuestsForGrade } from "./grade-quests";
import { getScienceQuestsForGrade } from "./science-quests";

describe("arc scene composition", () => {
  const grade = 4 as const;
  const quests = getQuestsForGrade(grade);
  const scene = (questIndex: number) => getArcScene({ subject: "maths", grade, questIndex, quests, question: quests[questIndex] });

  it("uses beat i for question i and appends the visual bridge", () => {
    const arc = getArcFor("maths", grade)!;
    const first = scene(0);
    expect(first.chapterTitle).toBe(arc.beats[0].chapterTitle);
    expect(first.chapterDialogue).toContain(arc.bridges[quests[0].visual]);
  });
  it("always lands the finale beat on the last question", () => {
    const arc = getArcFor("maths", grade)!;
    const last = scene(quests.length - 1);
    expect(last.chapterTitle).toBe(arc.finaleBeat.chapterTitle);
    expect(last.completeLabel).toBe(arc.finaleBeat.completeLabel);
  });
  it("never repeats a chapter title within a mission", () => {
    const titles = quests.map((_, i) => scene(i).chapterTitle);
    expect(new Set(titles).size).toBe(titles.length);
  });
  it("returns a worked example only at the first question of each visual", () => {
    const firstSeen = new Set<string>();
    quests.forEach((quest, i) => {
      const expected = !firstSeen.has(quest.visual);
      firstSeen.add(quest.visual);
      expect(!!scene(i).workedExample).toBe(expected);
    });
  });
  it("provides the full LessonStory shape from motifs", () => {
    const s = scene(0);
    ["learningObjective", "coachLine", "outcomeIcon", "videoCue"].forEach((key) => expect((s as Record<string, unknown>)[key]).toBeTruthy());
    expect(s.reelFrames).toHaveLength(4);
  });
  it("falls back to lesson-story for non-maths subjects", () => {
    const science = getScienceQuestsForGrade(4);
    const s = getArcScene({ subject: "science", grade: 4, questIndex: 0, quests: science, question: science[0] });
    expect(s.chapterTitle.length).toBeGreaterThan(0);
    expect(s.workedExample).not.toBeNull(); // first ecosystem question still gets Nova's example
  });
});
```

Run: expect FAIL (module not found).

- [ ] **Step 2: Implement**

```ts
// src/lib/arc-scene.ts
import type { Grade, Question } from "./learning";
import type { SubjectId } from "./curriculum-map";
import { getArcFor } from "./story-arcs";
import { getMotif } from "./visual-motifs";
import { getWorkedExample, isFirstOfVisual, type WorkedExample } from "./worked-examples";
import { getLessonStory, type LessonStory } from "./lesson-story";

export type ArcScene = LessonStory & { workedExample: WorkedExample | null };

export function getArcScene(args: { subject: SubjectId; grade: Grade; questIndex: number; quests: Question[]; question: Question }): ArcScene {
  const { subject, grade, questIndex, quests, question } = args;
  const workedExample = isFirstOfVisual(quests, questIndex) ? getWorkedExample(question.visual) : null;
  const arc = getArcFor(subject, grade);
  if (!arc) return { ...getLessonStory(question), workedExample };
  const lastIndex = quests.length - 1;
  const beat = questIndex >= lastIndex ? arc.finaleBeat : arc.beats[Math.min(questIndex, arc.beats.length - 1)];
  const bridge = arc.bridges[question.visual] ?? "";
  const motif = getMotif(question.visual);
  return {
    learningObjective: motif.learningObjective,
    chapterTitle: beat.chapterTitle,
    chapterDialogue: bridge ? `${beat.chapterDialogue} ${bridge}` : beat.chapterDialogue,
    chapterAction: beat.chapterAction,
    coachLine: motif.coachLine,
    completeLabel: beat.completeLabel,
    outcomeTitle: beat.outcomeTitle,
    outcomeDetail: beat.outcomeDetail,
    outcomeIcon: motif.outcomeIcon,
    videoCue: motif.videoCue,
    reelFrames: motif.reelFrames,
    workedExample,
  };
}
```

- [ ] **Step 3: Trim `lesson-story.ts`** — delete `byQuestionId` (all three g4 entries) and the `fraction`, `number-line`, `formula`, `coordinate` branches of `defaultStory`. Keep `ecosystem`, `reading`, `map`, and the final ratio/default return. Keep the `LessonStory` type and `getLessonStory` export.

- [ ] **Step 4: Migrate tests** — in `lesson-story.test.ts`, `story-lint.test.ts`, `video-assets.test.ts`: replace maths-visual `getLessonStory(...)` calls with `getArcScene({ subject: "maths", grade: 4, questIndex: 0, quests: getQuestsForGrade(4), question: ... })`; `science/english/social-quests.test.ts` need no change. Delete assertions that referenced the removed g4-1/2/3 stories; the moon-fruit content is superseded by the comet-cup arc.

- [ ] **Step 5: Full suite green + commit**

Run: `npm run test` — Expected: all pass.

```bash
git add src/lib/arc-scene.ts src/lib/arc-scene.test.ts src/lib/lesson-story.ts src/lib/lesson-story.test.ts src/lib/story-lint.test.ts src/lib/video-assets.test.ts
git commit -m "feat: arc-scene engine composes serialized adventures; retire maths templates"
```

---

### Task 13: Wire the engine + teaching moments into `page.tsx`

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `getArcScene` (Task 12), `explainMoment` (Task 9), `NovaShows` (Task 1).

- [ ] **Step 1: Swap the story source** (line ~182)

Replace:
```tsx
const lessonStory = getLessonStory(current);
```
with:
```tsx
const lessonStory = getArcScene({ subject: activeSubject, grade, questIndex: Math.min(questIndex, gradeQuests.length - 1), quests: gradeQuests, question: current });
```
Update imports: remove `getLessonStory`; add `import { getArcScene } from "@/lib/arc-scene";` and `import { NovaShows } from "@/components/nova-shows";` and `import { explainMoment } from "@/lib/explain-moments";`. Keep `type LessonStory` import if `StoryReel` needs it.

- [ ] **Step 2: Worked-example panel on the chapter screen**

In the `screen === "chapter"` JSX, directly BEFORE the `<button className="primary" onClick={() => setScreen("quest")}>` CTA, insert:

```tsx
{lessonStory.workedExample && <div className="worked-example"><div className="nova-shows-head"><span aria-hidden>✨</span><b>NOVA SHOWS YOU</b></div><p>{lessonStory.workedExample.intro}</p><ol>{lessonStory.workedExample.steps.map((s) => <li key={s}>{s}</li>)}</ol><p><b>{personalize(lessonStory.workedExample.punchline, name)}</b></p></div>}
```

- [ ] **Step 3: Teach on a miss (quest screen)**

In the quest screen JSX, replace the static retry feedback:
```tsx
{feedback === "retry" && <div className="feedback retry"><b>Hmm, not that one.</b><span>Nova: &quot;Want to look at the picture again with me?&quot;</span></div>}
```
with:
```tsx
{feedback === "retry" && <div className="feedback retry"><b>Nova stops and thinks.</b><span>{personalize(explainMoment(current, wrongAttemptsOnQuestion), name)}</span></div>}
{feedback === "retry" && wrongAttemptsOnQuestion >= 2 && <div className="worked-example"><div className="nova-shows-head"><span aria-hidden>✨</span><b>NOVA SHOWS YOU AGAIN</b></div><ol>{getWorkedExample(current.visual).steps.map((s) => <li key={s}>{s}</li>)}</ol></div>}
```
Add `import { getWorkedExample } from "@/lib/worked-examples";`.

- [ ] **Step 4: Append CSS**

```css
/* ---- Story Depth Pack: worked example panel ---- */
.worked-example { display: grid; gap: 6px; padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(255, 209, 102, .4); background: rgba(12, 10, 34, .5); text-align: left; }
.worked-example ol { margin: 0; padding-left: 20px; display: grid; gap: 4px; }
.worked-example p { margin: 0; }
```

- [ ] **Step 5: Verify + commit**

Run: `npm run lint && npm run test` — Expected: PASS.

```bash
git add src/app/page.tsx src/app/world.css
git commit -m "feat: wire arc scenes, worked examples and stuck-help into quest flow"
```

---

### Task 14: Copy-lint the teaching libs

**Files:**
- Modify: `src/lib/story-lint.test.ts`

- [ ] **Step 1: Add lint coverage for worked examples and explain frames**

```ts
import { getWorkedExample } from "./worked-examples";
import { explainMoment } from "./explain-moments";

describe("teaching copy obeys the Story Bible", () => {
  const visuals = ["fraction", "number-line", "formula", "coordinate", "ratio", "ecosystem", "reading", "map"];
  it("worked examples stay kid-short and clean", () => {
    visuals.forEach((visual) => {
      const example = getWorkedExample(visual);
      [example.intro, ...example.steps, example.punchline].forEach((line) => {
        expect(line).not.toMatch(/wrong|incorrect|you did it/i);
        line.split(/[.!?…]+/).filter(Boolean).forEach((s) => expect(s.trim().split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(12));
      });
    });
  });
  it("explain frames never shame", () => {
    visuals.forEach((visual) => {
      expect(explainMoment({ visual, hint: "A clue." }, 1)).not.toMatch(/wrong|incorrect/i);
    });
  });
});
```

Run: `npm run test` — Expected: all pass (fix any over-long line in the LIB, not the test).

- [ ] **Step 2: Commit**

```bash
git add src/lib/story-lint.test.ts
git commit -m "test: copy-lint covers worked examples and explain moments"
```

---

### Task 15: Integration verify (controller task — browser)

**Files:** none (verification only)

- [ ] **Step 1:** Start the dev server (existing `.claude/launch.json` config / `run-learnnjoy-dev.cmd`). Fresh profile: grade 7 → open **Skatepark**: confirm the concept beat shows once, the board sits ON the ramp at every slider value, slides toward the pivot as the angle steepens, and rolls down when 60° locks. Open **Mountain Rescue**: pod moves VERTICALLY, gold BASE CAMP line at 0, smooth transition per level.
- [ ] **Step 2:** Check Balance (demo tips), Shop (price bar shades; ₹60 tag pops at 25%), Cricket (concept beat).
- [ ] **Step 3:** Switch to grade 4 maths: chapter 1 shows the Comet Cup arc beat 1 + worked example; answer wrongly twice on a quest → Nova's explain line, then the worked example re-appears; complete two questions → chapter titles differ (plot advanced); last question shows the finale beat.
- [ ] **Step 4:** Mobile viewport (375px): cliff lab and slope lab fit without horizontal scroll; dark + light themes look right.
- [ ] **Step 5:** `npm run lint && npm run build && npm run test` — all green. Commit any CSS fixes as `fix:` commits.

---

### Deferred (not in this plan)

Phase 6 of the spec — the three non-maths arcs (Sleeping Garden, Runaway Storybook, Lost Festival) — is a separate follow-up once Tasks 0–15 are verified and the user confirms the Atlas subjects are being played.
