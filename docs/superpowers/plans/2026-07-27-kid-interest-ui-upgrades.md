# Kid-Interest UI Upgrade Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the four engagement upgrades agreed for LearnNnjoy — cosmetics that live on Nova, a constellation progress map replacing the Grade-7 card grid, payoff-spectacle activity endings, and sound "juice" — plus quick UI bug fixes and an optional desktop hand-gesture beta.

**Architecture:** All product code stays inside the existing single-page pattern: screens in `src/app/page.tsx`, Grade-7 activities in `src/components/grade-seven-adventures.tsx`, pure logic + content in `src/lib/*` with colocated vitest tests, styling appended to `src/app/world.css`. New UI pieces are small client components (`NovaCompanion`, `ConstellationMap`, `FinaleScene`, `HandAngleControl`) consumed by the existing screens.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind v4 present but styling is hand-rolled CSS in `world.css`, vitest for tests. Task 13 only: `@mediapipe/tasks-vision`.

## Global Constraints

- Repo root: `F:\AI Stuff\AntiGravity\Projects\Claude\LearnNnjoy`. All paths below are relative to it.
- Run `npm run lint` and `npm run build` before finishing any task that touches `.tsx`/`.ts` (repo README rule). Tests: `npm run test` (vitest run) or `npx vitest run <file>` for one file.
- No new dependencies except `@mediapipe/tasks-vision` in Task 13 (optional task).
- Do not change the `SavedProgress` localStorage shape or the key `learnnjoy-pilot-progress`. New cosmetic ids flow through the existing `ownedCosmetics: string[]` validation unchanged.
- All kid-facing copy: encouraging, no pressure, no dark patterns — match the existing voice ("Not yet—and that's useful information.").
- Keep the existing class-name style (kebab-case, semantic: `.quest-card`, `.adventure-hero`). Append new CSS at the END of `src/app/world.css` under the marker comment `/* === Kid-interest upgrade pack === */` (create the marker in Task 1; later tasks append below it).
- Visual verification: dev server config `learnnjoy-dev` runs on **http://localhost:3005** (started via the workspace `.claude/launch.json`). Verify with browser tools at desktop 1280×900 and mobile 375×812.
- JSX in this codebase is written densely (long single lines). Match that style; do not reformat existing lines you aren't changing.
- Commit after every task with the message given in the task's final step.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/lib/cosmetics.ts` | create | Cosmetic catalog (6 items) + `getCosmetic(id)` fallback lookup |
| `src/lib/cosmetics.test.ts` | create | Catalog integrity + lookup tests |
| `src/components/nova-companion.tsx` | create | Renders Nova + equipped cosmetic badge at 3 sizes |
| `src/lib/constellation-layout.ts` | create | Pure trail-position math for N stars |
| `src/lib/constellation-layout.test.ts` | create | Bounds/monotonicity tests |
| `src/components/constellation-map.tsx` | create | Star-map UI: SVG trail + positioned star buttons |
| `src/lib/sound.ts` | create | WebAudio mini-synth, mute persistence, `sound` singleton |
| `src/lib/sound.test.ts` | create | Controller logic tests (no real audio) |
| `src/components/hand-angle-control.tsx` | create (Task 13) | MediaPipe hand-tracking angle input (desktop beta) |
| `src/components/grade-seven-adventures.tsx` | modify | Add `FinaleScene` + `finaleCopy`, wire finales into all 5 activities, sounds, hand-mode toggle in `Skatepark` |
| `src/components/grade-seven-adventures.test.ts` | modify | Add `finaleCopy` coverage test |
| `src/app/page.tsx` | modify | Import catalog/NovaCompanion/sound/map; topbar mute toggle; constellation "adventures" screen; Nova rendering on quest/outcome/world screens |
| `src/app/world.css` | modify (append only) | All new styles |
| `docs/design/LUMINA-DESIGN-SYSTEM.md` | create (Task 14) | Design-system spec: tokens, motion rules, per-world art directions, Nova character sheet, art pipeline |

---

## Phase 0 — Quick UI bug fixes

### Task 1: Fix topbar spacing and invisible fraction disc (CSS only)

Two visible bugs found in the UI walkthrough: (a) on the quest screen the `.quest-stats` items and text buttons run together with no gaps ("NovaSwitch gradeLearning atlasAvatar world"); (b) the tappable 4-piece fraction disc (`.pizza.interactive-pizza` rendered by `FractionVisual` in `src/app/page.tsx`) exists in the DOM but its pieces have no visible fill on the quest card, so the caption "Tap the energy pieces to explore equal parts." floats over nothing.

**Files:**
- Modify: `src/app/world.css` (append at end)

**Interfaces:**
- Consumes: existing markup — `.quest-stats` (nav container in the quest screen topbar), `.pizza button` (four `<button>` pieces, class `charged` when tapped).
- Produces: none (visual only).

- [ ] **Step 1: Append the fix CSS to `src/app/world.css`**

```css
/* === Kid-interest upgrade pack === */

/* Task 1: topbar breathing room */
.quest-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.9rem;
}

/* Task 1: make the fraction disc visible and tappable-looking */
.pizza {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 132px;
  height: 132px;
  margin: 0.5rem auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(124, 96, 232, 0.55);
  box-shadow: 0 4px 18px rgba(124, 96, 232, 0.25);
}
.pizza button {
  border: 1px solid rgba(124, 96, 232, 0.4);
  background: rgba(124, 96, 232, 0.12);
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}
.pizza button:hover { background: rgba(124, 96, 232, 0.22); }
.pizza button.charged {
  background: linear-gradient(135deg, #ffd66b, #ff9d47);
  box-shadow: inset 0 0 12px rgba(255, 214, 107, 0.8);
}
```

- [ ] **Step 2: Verify in the browser**

Start/reuse the `learnnjoy-dev` preview (port 3005). On the welcome screen enter a nickname, keep Grade 4, click through the story (or clear `localStorage` and pick Grade 5 to skip straight to the diagnostic). On the diagnostic/quest screen confirm: topbar shows `🪙 60 · 🔥 0 · ✨ Nova · Switch grade · Learning atlas · Avatar world` with clear gaps, and a visible purple-ringed four-slice disc sits above "Tap the energy pieces…", slices turning gold when clicked.

- [ ] **Step 3: Lint check**

Run: `npm run lint` — Expected: passes (CSS-only change; catches accidental file corruption).

- [ ] **Step 4: Commit**

```bash
git add src/app/world.css
git commit -m "fix: topbar spacing and visible fraction disc"
```

### Task 2: Mobile number-line overflow in Mountain Rescue

At 375px width the 17-button number line (`.number-line-lab` in `MountainRescue`, `src/components/grade-seven-adventures.tsx:67`) overflows awkwardly and the active marker can sit off-screen.

**Files:**
- Modify: `src/app/world.css` (append)
- Modify: `src/components/grade-seven-adventures.tsx:58-72` (`MountainRescue`)

**Interfaces:**
- Consumes: existing `.number-line-lab` markup — one `<button>` per integer −8…+8, class `active` on the current position.
- Produces: none.

- [ ] **Step 1: Append mobile CSS**

```css
/* Task 2: number line fits phones */
.number-line-lab {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  gap: 2px;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}
.number-line-lab button { scroll-snap-align: center; flex: 0 0 auto; min-width: 34px; }
@media (max-width: 640px) {
  .number-line-lab button { min-width: 30px; font-size: 0.72rem; }
  .mountain-route { min-height: 72px; }
  .mountain-route .route-mountain { font-size: 1.6rem; }
}
```

- [ ] **Step 2: Auto-scroll the active marker into view**

In `src/components/grade-seven-adventures.tsx`, change the React import (line 3) to:

```tsx
import { useEffect, useRef, useState } from "react";
```

Inside `MountainRescue` (after the `const complete = position === -4;` line), add:

```tsx
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    lineRef.current?.querySelector(".active")?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [position]);
```

Then attach the ref to the number line container in step 1's JSX — change `<div className="number-line-lab" aria-label={...}>` to `<div className="number-line-lab" ref={lineRef} aria-label={...}>`.

- [ ] **Step 3: Verify on mobile viewport**

At 375×812 on http://localhost:3005: pick Grade 7 → Explore integers → Open the cliff map. Tapping "← Go down one" repeatedly keeps the ✦ marker centered in view; no layout overflow outside the card.

- [ ] **Step 4: Run checks**

Run: `npm run lint` then `npm run test` — Expected: both pass (existing `grade-seven-adventures.test.ts` still green).

- [ ] **Step 5: Commit**

```bash
git add src/app/world.css src/components/grade-seven-adventures.tsx
git commit -m "fix: mobile number line scroll-snap and auto-centering"
```

---

## Phase 1 — Cosmetics live on Nova (F6)

### Task 3: Extract and expand the cosmetics catalog

The catalog currently lives inline in `src/app/page.tsx:48-52` (3 items). Move it to a lib with 3 new world-themed items and a safe lookup.

**Files:**
- Create: `src/lib/cosmetics.ts`
- Test: `src/lib/cosmetics.test.ts`
- Modify: `src/app/page.tsx:48-52`

**Interfaces:**
- Produces: `type Cosmetic = { id: string; label: string; emoji: string; cost: number; detail: string }`; `export const cosmetics: readonly Cosmetic[]` (6 items, first item id `"trailblazer"` cost 0); `export function getCosmetic(id: string): Cosmetic` (falls back to `cosmetics[0]` for unknown ids). Tasks 4, 5 import these.

- [ ] **Step 1: Write the failing test** — `src/lib/cosmetics.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cosmetics, getCosmetic } from "./cosmetics";

describe("cosmetics catalog", () => {
  it("has unique ids and a free starter first", () => {
    const ids = cosmetics.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(cosmetics[0]).toMatchObject({ id: "trailblazer", cost: 0 });
    expect(cosmetics.length).toBeGreaterThanOrEqual(6);
  });

  it("every item is affordable-in-principle and fully described", () => {
    for (const item of cosmetics) {
      expect(item.cost).toBeGreaterThanOrEqual(0);
      expect(item.cost).toBeLessThanOrEqual(200);
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.emoji.length).toBeGreaterThan(0);
      expect(item.detail.length).toBeGreaterThan(0);
    }
  });

  it("getCosmetic falls back to the starter for unknown ids", () => {
    expect(getCosmetic("aurora").id).toBe("aurora");
    expect(getCosmetic("not-a-real-id").id).toBe("trailblazer");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/cosmetics.test.ts` — Expected: FAIL ("Cannot find module './cosmetics'").

- [ ] **Step 3: Create `src/lib/cosmetics.ts`**

```ts
export type Cosmetic = { id: string; label: string; emoji: string; cost: number; detail: string };

export const cosmetics: readonly Cosmetic[] = [
  { id: "trailblazer", label: "Trailblazer pack", emoji: "🎒", cost: 0, detail: "Your first expedition companion." },
  { id: "aurora", label: "Aurora cape", emoji: "🧥", cost: 50, detail: "A warm glow for brave problem-solvers." },
  { id: "starglow", label: "Starglow companion", emoji: "🌟", cost: 75, detail: "A tiny light for the next trail." },
  { id: "compass-charm", label: "Compass charm", emoji: "🧭", cost: 40, detail: "Always points to the next discovery." },
  { id: "skate-deck", label: "Sky-skate deck", emoji: "🛹", cost: 60, detail: "For carving safe 60° turns across Lumina." },
  { id: "cricket-cap", label: "Data-room cap", emoji: "🧢", cost: 60, detail: "Worn by evidence-based squad pickers." },
];

export function getCosmetic(id: string): Cosmetic {
  return cosmetics.find((item) => item.id === id) ?? cosmetics[0];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/cosmetics.test.ts` — Expected: PASS (3 tests).

- [ ] **Step 5: Point `page.tsx` at the lib**

In `src/app/page.tsx`, delete the inline `const cosmetics = [ ... ] as const;` block (lines 48-52, the three-item array), and add to the imports at the top:

```tsx
import { cosmetics } from "@/lib/cosmetics";
```

The `world` screen's `cosmetics.map(...)` needs no change — same field names.

- [ ] **Step 6: Full check**

Run: `npm run lint` then `npm run test` then `npm run build` — Expected: all pass. Visual check: Avatar World now shows 6 cards.

- [ ] **Step 7: Commit**

```bash
git add src/lib/cosmetics.ts src/lib/cosmetics.test.ts src/app/page.tsx
git commit -m "feat: extract cosmetics catalog to lib and add world-themed items"
```

### Task 4: NovaCompanion component

A small presentational component that renders Nova (✨) wearing the equipped cosmetic, reusable at three sizes.

**Files:**
- Create: `src/components/nova-companion.tsx`
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `getCosmetic` from Task 3.
- Produces: `export function NovaCompanion({ equippedCosmetic, size = "md", showName = false }: { equippedCosmetic: string; size?: "sm" | "md" | "lg"; showName?: boolean })`. Task 5 renders it on five screens.

- [ ] **Step 1: Create `src/components/nova-companion.tsx`**

```tsx
"use client";

import { getCosmetic } from "@/lib/cosmetics";

export function NovaCompanion({ equippedCosmetic, size = "md", showName = false }: { equippedCosmetic: string; size?: "sm" | "md" | "lg"; showName?: boolean }) {
  const cosmetic = getCosmetic(equippedCosmetic);
  return (
    <span className={`nova-companion nova-${size}`} title={`Nova is wearing the ${cosmetic.label}`} aria-label={`Nova, wearing the ${cosmetic.label}`}>
      <span className="nova-star" aria-hidden>✨</span>
      <span className="nova-gear" aria-hidden>{cosmetic.emoji}</span>
      {showName && <small>Nova</small>}
    </span>
  );
}
```

- [ ] **Step 2: Append the CSS**

```css
/* Task 4: Nova wears her cosmetics */
.nova-companion {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  line-height: 1;
}
.nova-companion .nova-star { display: inline-block; }
.nova-companion .nova-gear {
  position: absolute;
  bottom: -0.35em;
  left: 0.72em;
  transform: rotate(-12deg);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
}
.nova-companion small { margin-left: 0.55em; font-weight: 600; opacity: 0.85; }
.nova-sm { font-size: 1rem; }
.nova-sm .nova-gear { font-size: 0.7rem; }
.nova-md { font-size: 1.6rem; }
.nova-md .nova-gear { font-size: 1rem; }
.nova-lg { font-size: 3rem; }
.nova-lg .nova-gear { font-size: 1.8rem; }
.nova-lg small { font-size: 1rem; display: block; }
```

- [ ] **Step 3: Compile check**

Run: `npm run lint` — Expected: passes. (Component is not yet rendered anywhere; that's Task 5.)

- [ ] **Step 4: Commit**

```bash
git add src/components/nova-companion.tsx src/app/world.css
git commit -m "feat: NovaCompanion component renders equipped cosmetic"
```

### Task 5: Render Nova + cosmetic on every screen

Close the dead reward loop: the equipped item must be visible outside the shop.

**Files:**
- Modify: `src/app/page.tsx` (five spots, all in the render sections)
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `NovaCompanion` (Task 4).
- Produces: none.

- [ ] **Step 1: Import the component** — add to `src/app/page.tsx` imports:

```tsx
import { NovaCompanion } from "@/components/nova-companion";
```

- [ ] **Step 2: Quest topbar** — in the final `return` (quest screen, original line 459), replace `<span>✨ {pet}</span>` with:

```tsx
<NovaCompanion equippedCosmetic={equippedCosmetic} size="sm" showName />
```

Then delete the now-unused `const pet = "Nova";` declaration (original line 139).

- [ ] **Step 3: Mission scene (quest sidebar)** — original line 460, replace `<div className="nova-orbit">✨</div>` with:

```tsx
<div className="nova-orbit"><NovaCompanion equippedCosmetic={equippedCosmetic} size="sm" /></div>
```

- [ ] **Step 4: Outcome screen** — in the `screen === "outcome"` block (original line 452), immediately after `<div className="outcome-icon">{lessonStory.outcomeIcon}</div>`, insert:

```tsx
<div className="outcome-nova"><NovaCompanion equippedCosmetic={equippedCosmetic} size="md" /></div>
```

- [ ] **Step 5: Avatar World preview** — in the `screen === "world"` block (original line 428), immediately BEFORE `<section className="world-balance">`, insert:

```tsx
<section className="nova-preview"><NovaCompanion equippedCosmetic={equippedCosmetic} size="lg" showName /><p>Everything Nova wears was earned by your ideas.</p></section>
```

- [ ] **Step 6: Grade-7 screens** — in the `screen === "adventures"` topbar (original line 418), change `<button className="text-button" onClick={openGradePicker}>Switch grade</button>` to:

```tsx
<div className="quest-stats"><NovaCompanion equippedCosmetic={equippedCosmetic} size="sm" showName /><button className="text-button" onClick={openGradePicker}>Switch grade</button></div>
```

And in the `screen === "activity"` topbar (original line 422), change `<button className="text-button" onClick={() => setScreen("adventures")}>Adventure map</button>` to:

```tsx
<div className="quest-stats"><NovaCompanion equippedCosmetic={equippedCosmetic} size="sm" /><button className="text-button" onClick={() => setScreen("adventures")}>Adventure map</button></div>
```

- [ ] **Step 7: Append CSS**

```css
/* Task 5: Nova preview + outcome placement */
.nova-preview {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 1.1rem 1.4rem;
  margin-bottom: 1rem;
  border-radius: 18px;
  background: rgba(124, 96, 232, 0.08);
}
.nova-preview p { margin: 0; opacity: 0.8; }
.outcome-nova { margin: 0.4rem 0 0.2rem; }
```

- [ ] **Step 8: Verify the loop end-to-end**

On http://localhost:3005 (Grade 5 flow is fastest): earn coins on two quests → Avatar world → buy "Compass charm" → Equip. Confirm 🧭 now rides on the ✨ in: Avatar World preview, quest topbar, mission scene, and the next outcome screen. Switch to Grade 7 and confirm topbar Nova on the adventure and activity screens.

- [ ] **Step 9: Run checks**

Run: `npm run lint` then `npm run test` then `npm run build` — Expected: all pass.

- [ ] **Step 10: Commit**

```bash
git add src/app/page.tsx src/app/world.css
git commit -m "feat: equipped cosmetic renders on Nova across all screens"
```

---

## Phase 2 — Constellation map (F4)

### Task 6: Trail layout helpers (pure functions)

**Files:**
- Create: `src/lib/constellation-layout.ts`
- Test: `src/lib/constellation-layout.test.ts`

**Interfaces:**
- Produces: `type StarPosition = { x: number; y: number }` (percent coords, 0–100 space); `export function getTrailPositions(count: number): StarPosition[]` — deterministic winding trail, x strictly increasing 6→94, y wave within 15–75. Task 7 consumes it.

- [ ] **Step 1: Write the failing test** — `src/lib/constellation-layout.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getTrailPositions } from "./constellation-layout";

describe("getTrailPositions", () => {
  it("returns one in-bounds position per star", () => {
    const positions = getTrailPositions(15);
    expect(positions).toHaveLength(15);
    for (const p of positions) {
      expect(p.x).toBeGreaterThanOrEqual(5);
      expect(p.x).toBeLessThanOrEqual(95);
      expect(p.y).toBeGreaterThanOrEqual(12);
      expect(p.y).toBeLessThanOrEqual(78);
    }
  });

  it("walks left to right so the trail never doubles back", () => {
    const positions = getTrailPositions(15);
    for (let i = 1; i < positions.length; i++) expect(positions[i].x).toBeGreaterThan(positions[i - 1].x);
  });

  it("handles tiny and empty inputs", () => {
    expect(getTrailPositions(0)).toEqual([]);
    expect(getTrailPositions(1)).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/constellation-layout.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/constellation-layout.ts`**

```ts
export type StarPosition = { x: number; y: number };

// Percent coordinates in a 0-100 × 0-100 space. The trail walks left to
// right with a gentle sine wave so sequential topics read as one path.
export function getTrailPositions(count: number): StarPosition[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0 : index / (count - 1);
    return {
      x: Math.round((6 + t * 88) * 10) / 10,
      y: Math.round((45 + 27 * Math.sin(index * 1.15)) * 10) / 10,
    };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/constellation-layout.test.ts` — Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/constellation-layout.ts src/lib/constellation-layout.test.ts
git commit -m "feat: constellation trail layout helper"
```

### Task 7: ConstellationMap component

**Files:**
- Create: `src/components/constellation-map.tsx`
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `getTrailPositions` (Task 6); chapter types from `src/components/grade-seven-adventures.tsx` (`GradeSevenChapter`, `GradeSevenComingSoonChapter`, `GradeSevenAdventureId` — already exported).
- Produces: `export function ConstellationMap({ chapters, completedIds, selectedId, onSelect }: { chapters: ReadonlyArray<GradeSevenChapter | GradeSevenComingSoonChapter>; completedIds: readonly GradeSevenAdventureId[]; selectedId: string; onSelect: (id: string) => void })`. Task 8 renders it.

- [ ] **Step 1: Create `src/components/constellation-map.tsx`**

```tsx
"use client";

import { getTrailPositions } from "@/lib/constellation-layout";
import type { GradeSevenAdventureId, GradeSevenChapter, GradeSevenComingSoonChapter } from "@/components/grade-seven-adventures";

export function ConstellationMap({ chapters, completedIds, selectedId, onSelect }: {
  chapters: ReadonlyArray<GradeSevenChapter | GradeSevenComingSoonChapter>;
  completedIds: readonly GradeSevenAdventureId[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const positions = getTrailPositions(chapters.length);
  return (
    <div className="constellation" role="group" aria-label="Grade 7 topic constellation. Bright stars are playable; dim stars are coming soon.">
      <svg className="constellation-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <polyline points={positions.map((p) => `${p.x},${p.y}`).join(" ")} />
      </svg>
      {chapters.map((chapter, index) => {
        const comingSoon = "status" in chapter;
        const completed = !comingSoon && completedIds.includes(chapter.id as GradeSevenAdventureId);
        const p = positions[index];
        const state = comingSoon ? "dim" : completed ? "lit" : "ready";
        return (
          <button
            key={chapter.id}
            type="button"
            className={`star-node ${state}${selectedId === chapter.id ? " selected" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            aria-pressed={selectedId === chapter.id}
            aria-label={`${chapter.topic} — ${comingSoon ? "coming soon" : completed ? "star lit, play again" : "ready to play"}`}
            onClick={() => onSelect(chapter.id)}
          >
            <i aria-hidden>✦</i>
            <small>{chapter.topic}</small>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Append CSS**

```css
/* Task 7: the Lumina constellation */
.constellation {
  position: relative;
  width: 100%;
  min-height: 340px;
  margin: 1.2rem 0;
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(1px 1px at 12% 20%, rgba(255, 255, 255, 0.7) 50%, transparent 51%),
    radial-gradient(1px 1px at 34% 68%, rgba(255, 255, 255, 0.5) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 58% 24%, rgba(255, 255, 255, 0.6) 50%, transparent 51%),
    radial-gradient(1px 1px at 76% 74%, rgba(255, 255, 255, 0.5) 50%, transparent 51%),
    radial-gradient(1px 1px at 90% 40%, rgba(255, 255, 255, 0.6) 50%, transparent 51%),
    linear-gradient(180deg, #191238 0%, #2a1f5e 60%, #3b2a72 100%);
}
.constellation-trail { position: absolute; inset: 0; width: 100%; height: 100%; }
.constellation-trail polyline {
  fill: none;
  stroke: rgba(255, 255, 255, 0.28);
  stroke-width: 0.5;
  stroke-dasharray: 2 2.4;
  stroke-linecap: round;
}
.star-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  padding: 0.4rem;
}
.star-node i { font-style: normal; font-size: 1.35rem; transition: transform 0.2s ease, filter 0.2s ease; }
.star-node small { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.02em; opacity: 0.85; max-width: 90px; text-align: center; }
.star-node.ready i { color: #ffd66b; filter: drop-shadow(0 0 6px rgba(255, 214, 107, 0.9)); animation: star-twinkle 2.6s ease-in-out infinite; }
.star-node.lit i { color: #9dffd8; filter: drop-shadow(0 0 10px rgba(157, 255, 216, 1)); animation: star-pulse 2s ease-in-out infinite; }
.star-node.dim { opacity: 0.4; }
.star-node.dim i { color: #b9b1e6; }
.star-node.selected i { transform: scale(1.45); }
.star-node.selected small { opacity: 1; text-decoration: underline; text-underline-offset: 3px; }
.star-node:focus-visible { outline: 2px solid #ffd66b; outline-offset: 2px; border-radius: 10px; }
@keyframes star-twinkle { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; transform: scale(1.12); } }
@keyframes star-pulse { 0%, 100% { filter: drop-shadow(0 0 6px rgba(157, 255, 216, 0.7)); } 50% { filter: drop-shadow(0 0 14px rgba(157, 255, 216, 1)); } }
@media (max-width: 640px) {
  .constellation { min-height: 300px; }
  .star-node small { display: none; }
  .star-node.selected small { display: block; }
}
```

- [ ] **Step 3: Compile check**

Run: `npm run lint` — Expected: passes (component not yet mounted).

- [ ] **Step 4: Commit**

```bash
git add src/components/constellation-map.tsx src/app/world.css
git commit -m "feat: ConstellationMap star-trail component"
```

### Task 8: Replace the Grade-7 card grid with the constellation

**Files:**
- Modify: `src/app/page.tsx` — the `screen === "adventures"` block (original lines 417-419) and one new piece of state
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `ConstellationMap` (Task 7); existing `gradeSevenChapters`, `completedAdventures`, `openGradeSevenAdventure`, `openGradePicker`, and (from Task 5) `NovaCompanion` in the topbar.
- Produces: none.

- [ ] **Step 1: Add imports and selection state**

Imports:

```tsx
import { ConstellationMap } from "@/components/constellation-map";
```

With the other `useState` declarations (near `const [activeAdventure, ...]`), add:

```tsx
  const [selectedChapter, setSelectedChapter] = useState<string>("mountain");
```

- [ ] **Step 2: Replace the whole `if (screen === "adventures") { ... }` block with:**

```tsx
  if (screen === "adventures") {
    const selected = gradeSevenChapters.find((chapter) => chapter.id === selectedChapter) ?? gradeSevenChapters[0];
    const selectedComingSoon = "status" in selected;
    const selectedCompleted = !selectedComingSoon && completedAdventures.includes(selected.id as GradeSevenAdventureId);
    return <main className="shell adventure-shell theme-pathfinder"><nav className="topbar"><div className="brand"><span>✦</span> LearnNnjoy</div><div className="quest-stats"><NovaCompanion equippedCosmetic={equippedCosmetic} size="sm" showName /><button className="text-button" onClick={openGradePicker}>Switch grade</button></div></nav>
      <section className="adventure-hero"><p className="eyebrow">GRADE 7 · MATHS CONSTELLATION</p><h1>Light every star in the Lumina sky.</h1><p>Each Grade 7 topic is a star on Nova&apos;s trail. Bright stars are ready to play; dim stars wait on the horizon.</p><p className="adventure-progress">{completedAdventures.length}/{gradeSevenAdventures.length} stars lit · {gradeSevenChapters.length} topics mapped</p></section>
      <ConstellationMap chapters={gradeSevenChapters} completedIds={completedAdventures} selectedId={selectedChapter} onSelect={setSelectedChapter} />
      <section className="star-detail" aria-live="polite"><span className="star-detail-icon">{selected.icon}</span><div><p className="eyebrow">{selectedComingSoon ? "NOVA IS PREPARING THIS WORLD" : selectedCompleted ? "STAR LIT · PLAY AGAIN ANYTIME" : "READY TO PLAY"}</p><h2>{selected.topic}</h2><p className="story-world">Story world · {selected.title}</p><div className="subtopic-row">{selected.subtopics.map((subtopic) => <span key={subtopic}>{subtopic}</span>)}</div><p>{selected.intro}</p>{selectedComingSoon ? <div className="coming-soon-note"><span>✦</span><b>Coming soon</b><small>This star will brighten when its interactive chapter is ready.</small></div> : <button className="primary" onClick={() => openGradeSevenAdventure(selected.id as GradeSevenAdventureId)}>{selectedCompleted ? "Explore again →" : `${(selected as GradeSevenChapter).action} →`}</button>}</div></section>
    </main>;
  }
```

Note: `GradeSevenChapter` must be imported as a type — extend the existing import from `@/components/grade-seven-adventures` (original line 17) to include `type GradeSevenChapter`.

- [ ] **Step 3: Append detail-panel CSS**

```css
/* Task 8: selected-star detail panel */
.star-detail {
  display: flex;
  gap: 1.1rem;
  align-items: flex-start;
  padding: 1.4rem 1.6rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 6px 24px rgba(25, 18, 56, 0.08);
}
.star-detail-icon { font-size: 2.2rem; line-height: 1; }
.star-detail h2 { margin: 0.15rem 0 0.3rem; }
.star-detail .primary { margin-top: 0.8rem; }
@media (max-width: 640px) { .star-detail { flex-direction: column; } }
```

- [ ] **Step 4: Verify the map**

On http://localhost:3005, Grade 7: the grid is gone; a night-sky panel shows 15 stars on a dotted trail — first 5 gold and twinkling, 10 dim on the right. Clicking any star updates the detail panel below (coming-soon stars show the "Nova is preparing" note, playable ones show the Explore button). Complete Mountain Rescue and confirm its star turns mint-green and pulses. Check mobile 375px: labels hidden except the selected star, no horizontal scroll.

- [ ] **Step 5: Run checks**

Run: `npm run lint` then `npm run test` then `npm run build` — Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/app/world.css
git commit -m "feat: constellation map replaces Grade 7 card grid"
```

---

## Phase 3 — Payoff-spectacle endings (F3)

### Task 9: FinaleScene component + finale copy

Each activity currently ends on the `Success` quiz ("Save my discovery →" → straight back to the map) — an anticlimax. Add a celebratory world-transformation scene that plays AFTER the quiz, BEFORE returning to the map. The quiz (pedagogy) stays; the ending becomes a spectacle.

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx` (add exports near the top, after the coming-soon array)
- Modify: `src/components/grade-seven-adventures.test.ts` (add one test)
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Produces: `export const finaleCopy: Record<GradeSevenAdventureId, { title: string; detail: string; art: string }>`; `export function FinaleScene({ id, onDone }: { id: GradeSevenAdventureId; onDone: () => void })`. Task 10 wires it into the five activities.

- [ ] **Step 1: Write the failing test** — append to `src/components/grade-seven-adventures.test.ts`:

```ts
import { finaleCopy, gradeSevenAdventures } from "./grade-seven-adventures";

describe("finaleCopy", () => {
  it("covers every playable adventure with celebration copy", () => {
    for (const adventure of gradeSevenAdventures) {
      const copy = finaleCopy[adventure.id];
      expect(copy).toBeDefined();
      expect(copy.title.length).toBeGreaterThan(0);
      expect(copy.detail.length).toBeGreaterThan(20);
      expect(copy.art.length).toBeGreaterThan(0);
    }
  });
});
```

(Match the existing test file's import style — if it already imports from `"./grade-seven-adventures"`, merge into that import statement.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/grade-seven-adventures.test.ts` — Expected: FAIL ("finaleCopy" is not exported).

- [ ] **Step 3: Add `finaleCopy` and `FinaleScene` to `grade-seven-adventures.tsx`** (insert after the `gradeSevenComingSoonChapters` array):

```tsx
export const finaleCopy: Record<GradeSevenAdventureId, { title: string; detail: string; art: string }> = {
  mountain: { title: "The storm clears — pod recovered!", detail: "Your number line guided the rescue team straight to −4. The cliff beacons relight one by one as the clouds roll away.", art: "🚁⛰️☀️" },
  balance: { title: "The crate bursts open!", detail: "Seven glowing energy blocks float free, and the whole lab hums back to life — because you kept both sides fair.", art: "📦✨⚖️" },
  shop: { title: "Kit packed, coins spared!", detail: "Nova buckles on the ₹180 expedition kit while the market lanterns flare to celebrate a truly fair deal.", art: "🎒🏮🪙" },
  skatepark: { title: "The course locks in!", detail: "Skaters roll down your 60° ramp as the rooftop lights trace your triangle across the night sky.", art: "🛹🌆🔺" },
  cricket: { title: "Squad takes the field!", detail: "Asha, Kabir and Noor jog out under the floodlights — picked by your data, cheered by the crowd.", art: "🏏🏟️🎉" },
};

export function FinaleScene({ id, onDone }: { id: GradeSevenAdventureId; onDone: () => void }) {
  const copy = finaleCopy[id];
  return (
    <section className={`finale-scene finale-${id}`} aria-live="polite">
      <div className="finale-sparks" aria-hidden><i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i><i>✧</i></div>
      <div className="finale-art" aria-hidden>{copy.art}</div>
      <p className="eyebrow">WORLD TRANSFORMED</p>
      <h2>{copy.title}</h2>
      <p>{copy.detail}</p>
      <div className="finale-reward"><span>🪙</span><b>+25 Lumina coins</b><small>banked for Nova&apos;s wardrobe</small></div>
      <button className="primary" onClick={onDone}>Return to the star map →</button>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/grade-seven-adventures.test.ts` — Expected: PASS (existing tests + new one).

- [ ] **Step 5: Append CSS**

```css
/* Task 9: finale spectacle */
.finale-scene {
  position: relative;
  text-align: center;
  padding: 2.2rem 1.6rem;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(180deg, #241a52 0%, #3b2a72 100%);
  color: #fff;
  animation: finale-in 0.5s ease-out;
}
.finale-scene h2 { margin: 0.3rem 0 0.5rem; font-size: 1.6rem; }
.finale-scene > p { max-width: 42ch; margin: 0 auto; opacity: 0.9; }
.finale-art { font-size: 3rem; margin-bottom: 0.6rem; animation: finale-bounce 0.9s ease-out; }
.finale-sparks { position: absolute; inset: 0; pointer-events: none; }
.finale-sparks i { position: absolute; font-style: normal; color: #ffd66b; animation: spark-rise 1.8s ease-out infinite; }
.finale-sparks i:nth-child(1) { left: 12%; bottom: 8%; animation-delay: 0s; }
.finale-sparks i:nth-child(2) { left: 28%; bottom: 4%; animation-delay: 0.35s; }
.finale-sparks i:nth-child(3) { left: 52%; bottom: 6%; animation-delay: 0.7s; }
.finale-sparks i:nth-child(4) { left: 68%; bottom: 3%; animation-delay: 0.2s; }
.finale-sparks i:nth-child(5) { left: 84%; bottom: 9%; animation-delay: 0.55s; }
.finale-sparks i:nth-child(6) { left: 40%; bottom: 2%; animation-delay: 0.9s; }
.finale-reward {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin: 1.1rem auto 1.2rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  background: rgba(255, 214, 107, 0.15);
}
.finale-reward small { opacity: 0.75; }
@keyframes finale-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes finale-bounce { 0% { transform: scale(0.6); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
@keyframes spark-rise { 0% { opacity: 0; transform: translateY(0); } 25% { opacity: 1; } 100% { opacity: 0; transform: translateY(-90px); } }
@media (prefers-reduced-motion: reduce) { .finale-art, .finale-sparks i, .finale-scene { animation: none; } }
```

- [ ] **Step 6: Commit**

```bash
git add src/components/grade-seven-adventures.tsx src/components/grade-seven-adventures.test.ts src/app/world.css
git commit -m "feat: FinaleScene world-transformation ending with copy for all five adventures"
```

### Task 10: Wire the finale into all five activities

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx` — `MountainRescue`, `BalanceLab`, `SmartShopper`, `Skatepark`, `CricketData`

**Interfaces:**
- Consumes: `FinaleScene` (Task 9).
- Produces: behavior — every activity flow becomes: steps 0-3 → step 4 `Success` quiz → step 5 `FinaleScene` → `onFinish()` (which is `finishGradeSevenAdventure` in `page.tsx`, awarding the +25 coins — unchanged).

- [ ] **Step 1: Apply the same three-part change to EACH of the five activity components.**

Using `MountainRescue` as the exact template — the other four are identical in shape:

(a) The progress bar must not render during the finale. Change `<ChapterProgress chapter="Mountain Rescue" step={step} />` to:

```tsx
    {step < 5 && <ChapterProgress chapter="Mountain Rescue" step={step} />}
```

(In `SmartShopper` the progress bar is an inline `<div className="chapter-event-progress" ...>` instead of `<ChapterProgress>` — wrap that same way: `{step < 5 && <div className="chapter-event-progress" ...>...</div>}`.)

(b) The `Success` element at step 4 currently passes `onFinish={onFinish}`. Change it to advance to the finale instead:

```tsx
onFinish={() => setStep(5)}
```

(c) Add the finale as the last line inside the fragment, before `</>`:

```tsx
    {step === 5 && <FinaleScene id="mountain" onDone={onFinish} />}
```

The `id` values per component: `MountainRescue` → `"mountain"`, `BalanceLab` → `"balance"`, `SmartShopper` → `"shop"`, `Skatepark` → `"skatepark"`, `CricketData` → `"cricket"`.

- [ ] **Step 2: Verify one full run**

On http://localhost:3005, Grade 7 → Mountain Rescue → play through all events → answer the discovery quiz → "Save my discovery" now opens the WORLD TRANSFORMED scene (sparks rising, art bouncing) → "Return to the star map" lands on the constellation with the mountain star newly lit. Spot-check a second activity (Balance Lab) the same way.

- [ ] **Step 3: Run checks**

Run: `npm run lint` then `npm run test` then `npm run build` — Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/grade-seven-adventures.tsx
git commit -m "feat: every adventure ends on a world-transformation finale"
```

---

## Phase 4 — Sound juice

### Task 11: WebAudio mini-synth with persisted mute

No audio assets — synthesize short chimes with the WebAudio API. Must be safe in tests (Node has no `window`/`AudioContext`).

**Files:**
- Create: `src/lib/sound.ts`
- Test: `src/lib/sound.test.ts`

**Interfaces:**
- Produces: `type SoundName = "tap" | "success" | "coin" | "finale"`; `export function createSoundController(storage?: Pick<Storage, "getItem" | "setItem">)` returning `{ isMuted(): boolean; toggleMuted(): boolean; play(name: SoundName): void }`; `export const sound` — a singleton bound to `window.localStorage` in the browser and inert on the server. Task 12 and 10's components import `sound`.

- [ ] **Step 1: Write the failing test** — `src/lib/sound.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createSoundController } from "./sound";

function fakeStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => { data[key] = value; },
    data,
  };
}

describe("sound controller", () => {
  it("starts unmuted by default and toggles with persistence", () => {
    const storage = fakeStorage();
    const controller = createSoundController(storage);
    expect(controller.isMuted()).toBe(false);
    expect(controller.toggleMuted()).toBe(true);
    expect(storage.data["learnnjoy-muted"]).toBe("1");
    expect(controller.toggleMuted()).toBe(false);
    expect(storage.data["learnnjoy-muted"]).toBe("0");
  });

  it("restores a persisted mute", () => {
    const controller = createSoundController(fakeStorage({ "learnnjoy-muted": "1" }));
    expect(controller.isMuted()).toBe(true);
  });

  it("play() never throws without an AudioContext (Node env)", () => {
    const controller = createSoundController(fakeStorage());
    expect(() => controller.play("tap")).not.toThrow();
    expect(() => controller.play("finale")).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/sound.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/sound.ts`**

```ts
export type SoundName = "tap" | "success" | "coin" | "finale";
type MiniStorage = Pick<Storage, "getItem" | "setItem">;

const MUTE_KEY = "learnnjoy-muted";

export function createSoundController(storage?: MiniStorage) {
  let muted = storage?.getItem(MUTE_KEY) === "1";
  let ctx: AudioContext | null = null;

  function ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = ctx ?? new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  function tone(freq: number, start: number, duration: number, peak: number) {
    const audio = ensureContext();
    if (!audio) return;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(peak, audio.currentTime + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(audio.currentTime + start);
    osc.stop(audio.currentTime + start + duration + 0.05);
  }

  const patterns: Record<SoundName, () => void> = {
    tap: () => tone(520, 0, 0.08, 0.1),
    success: () => { tone(523, 0, 0.12, 0.16); tone(659, 0.1, 0.12, 0.16); tone(784, 0.2, 0.22, 0.16); },
    coin: () => { tone(988, 0, 0.07, 0.14); tone(1319, 0.07, 0.18, 0.14); },
    finale: () => { [523, 659, 784, 1047, 1319].forEach((freq, i) => tone(freq, i * 0.09, 0.26, 0.15)); },
  };

  return {
    isMuted: () => muted,
    toggleMuted: () => {
      muted = !muted;
      storage?.setItem(MUTE_KEY, muted ? "1" : "0");
      return muted;
    },
    play: (name: SoundName) => {
      if (!muted) patterns[name]();
    },
  };
}

export const sound = createSoundController(typeof window === "undefined" ? undefined : window.localStorage);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/sound.test.ts` — Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/sound.ts src/lib/sound.test.ts
git commit -m "feat: WebAudio chime synth with persisted mute"
```

### Task 12: Wire sounds and the mute toggle into the UI

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/grade-seven-adventures.tsx`

**Interfaces:**
- Consumes: `sound` singleton (Task 11).
- Produces: none.

- [ ] **Step 1: Mute state in `page.tsx`** — add import `import { sound } from "@/lib/sound";` and, with the other state hooks:

```tsx
  const [muted, setMuted] = useState(false);
```

Sync it once after hydration — inside the EXISTING first `useEffect` (the one that loads `PILOT_PROGRESS_KEY`, original lines 213-228), add one line right before `setHydrated(true);`:

```tsx
      setMuted(sound.isMuted());
```

- [ ] **Step 2: Mute toggle button** — add this button in the quest topbar's `.quest-stats` div (original line 459), immediately after the NovaCompanion from Task 5:

```tsx
<button className="text-button" aria-label={muted ? "Turn sounds on" : "Turn sounds off"} onClick={() => setMuted(sound.toggleMuted())}>{muted ? "🔇" : "🔊"}</button>
```

Add the identical button to the `.quest-stats` divs created in Task 5 Step 6 (adventures topbar and activity topbar).

- [ ] **Step 3: Trigger sounds in `page.tsx`** — in `answer()` (original lines 236-261):

- In the correct branch, immediately after `setFeedback("correct");` add:

```tsx
      sound.play("success");
      sound.play("coin");
```

- In the wrong-answer path, immediately after `setFeedback("retry");` add:

```tsx
    sound.play("tap");
```

And on the choice buttons (original line 461), extend the existing onClick: `onClick={() => { setSelected(choice); setFeedback(null); sound.play("tap"); }}`.

In `finishGradeSevenAdventure()` (original lines 377-383), add as the first line of the function:

```tsx
    sound.play("finale");
```

- [ ] **Step 4: Sounds in the Grade-7 quiz** — in `grade-seven-adventures.tsx`, add import `import { sound } from "@/lib/sound";`. In the `Success` component's choice buttons, change `onClick={() => setSelected(choice)}` to:

```tsx
onClick={() => { setSelected(choice); sound.play(choice === answer ? "success" : "tap"); }}
```

- [ ] **Step 5: Verify by ear**

On http://localhost:3005: answering a quest correctly plays a rising chime + coin ping; wrong answers a soft tap; finishing an adventure a five-note fanfare. The 🔊 toggle silences everything, survives a page reload (localStorage), and shows 🔇 while muted.

- [ ] **Step 6: Run checks**

Run: `npm run lint` then `npm run test` then `npm run build` — Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/components/grade-seven-adventures.tsx
git commit -m "feat: sound feedback with persistent mute toggle"
```

---

## Phase 5 (OPTIONAL) — Hand-gesture beta (F1, desktop only)

### Task 13: MediaPipe hand-angle control in Skatepark

Ship gesture control as a clearly-labeled desktop beta on the one activity it fits best (setting the ramp angle), never as the default input. Capability-gated: needs `getUserMedia` + viewport ≥ 1024px. Camera permission copy tells kids to ask a grown-up first.

**Files:**
- Create: `src/components/hand-angle-control.tsx`
- Modify: `src/components/grade-seven-adventures.tsx` (`Skatepark` only)
- Modify: `src/app/world.css` (append)
- Modify: `package.json` (one dependency)

**Interfaces:**
- Consumes: `setAngle` from `Skatepark`'s existing state (`const [angle, setAngle] = useState(20)`).
- Produces: `export function supportsHandControl(): boolean`; `export function HandAngleControl({ onAngle, onClose }: { onAngle: (deg: number) => void; onClose: () => void })` — calls `onAngle` with a 0–120 value rounded to 10s, matching the slider's scale.

- [ ] **Step 1: Install the dependency**

Run: `npm install @mediapipe/tasks-vision` — Expected: added to `package.json` dependencies with no peer warnings.

- [ ] **Step 2: Create `src/components/hand-angle-control.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export function supportsHandControl(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof window !== "undefined" && window.innerWidth >= 1024;
}

export function HandAngleControl({ onAngle, onClose }: { onAngle: (deg: number) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading" | "tracking" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;
    let frame = 0;

    async function start() {
      try {
        const vision = await import("@mediapipe/tasks-vision");
        const files = await vision.FilesetResolver.forVisionTasks(WASM_BASE);
        const landmarker = await vision.HandLandmarker.createFromOptions(files, {
          baseOptions: { modelAssetPath: MODEL_URL },
          numHands: 1,
          runningMode: "VIDEO",
        });
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("tracking");
        const loop = () => {
          if (cancelled || !videoRef.current) return;
          const result = landmarker.detectForVideo(videoRef.current, performance.now());
          const hand = result.landmarks?.[0];
          if (hand) {
            const wrist = hand[0];
            const indexTip = hand[8];
            const rad = Math.atan2(wrist.y - indexTip.y, indexTip.x - wrist.x);
            const deg = Math.max(0, Math.min(120, Math.round(((rad * 180) / Math.PI) / 10) * 10));
            onAngle(deg);
          }
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onAngle]);

  return (
    <div className="hand-control" aria-live="polite">
      <video ref={videoRef} muted playsInline aria-label="Webcam preview for hand control" />
      <p>{status === "loading" ? "Warming up the hand tracker…" : status === "error" ? "Hand control needs a camera. The slider works great too." : "Point at the screen and tilt your hand to turn the ramp."}</p>
      <button className="text-button" onClick={onClose}>Use the slider instead</button>
    </div>
  );
}
```

- [ ] **Step 3: Integrate into `Skatepark`** — in `grade-seven-adventures.tsx`, add import:

```tsx
import { HandAngleControl, supportsHandControl } from "@/components/hand-angle-control";
```

Inside `Skatepark`, add state after the existing hooks:

```tsx
  const [handMode, setHandMode] = useState(false);
```

In the step 1 section, immediately AFTER the `<input className="discount-slider" ... />` slider line, add:

```tsx
{supportsHandControl() && !handMode && <button className="text-button" onClick={() => setHandMode(true)}>✋ Try hand control (beta) — ask your grown-up first, it uses the camera</button>}{handMode && <HandAngleControl onAngle={setAngle} onClose={() => setHandMode(false)} />}
```

- [ ] **Step 4: Append CSS**

```css
/* Task 13: hand-control beta */
.hand-control {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-top: 0.7rem;
  padding: 0.7rem 0.9rem;
  border-radius: 14px;
  background: rgba(25, 18, 56, 0.06);
}
.hand-control video { width: 120px; border-radius: 10px; transform: scaleX(-1); }
.hand-control p { margin: 0; font-size: 0.85rem; opacity: 0.85; }
```

- [ ] **Step 5: Verify on desktop**

At 1280×900 on http://localhost:3005: Grade 7 → Explore angles → step 1 shows the "✋ Try hand control (beta)" button below the slider. Clicking it prompts for the camera; with permission granted, tilting a hand in view moves the ramp in 10° steps and the slider/readout stay in sync; "Use the slider instead" stops the camera (browser camera indicator turns off). At 375px width the button must NOT appear. With camera denied, the panel shows the friendly error and the slider still works.

- [ ] **Step 6: Run checks**

Run: `npm run lint` then `npm run test` then `npm run build` — Expected: all pass (MediaPipe is dynamically imported, so the build stays clean and the bundle for non-users unaffected).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/components/hand-angle-control.tsx src/components/grade-seven-adventures.tsx src/app/world.css
git commit -m "feat: optional desktop hand-gesture control for Skatepark (beta)"
```

---

## Phase 6 — Visual identity (A1 + A2 + A5)

### Task 14: Lumina design-system spec

Encode the visual language once so every current and future world ships consistent. This is the A2 "design-system-as-skill-file" idea from the vault (the durable part of that bookmark), and it locks in A1's per-world art directions and A5's Nova character sheet as written spec.

**Files:**
- Create: `docs/design/LUMINA-DESIGN-SYSTEM.md`

**Interfaces:**
- Produces: the spec document. Task 15 implements its "World palettes" table in CSS; future world-building work (human or agent) follows it.

- [ ] **Step 1: Create `docs/design/LUMINA-DESIGN-SYSTEM.md` with exactly this content:**

```markdown
# Lumina Design System

The single source of truth for LearnNnjoy's visual language. Any new screen,
world, or asset must conform — or update this document first.

## Brand essence

Night-sky wonder, gentle mentorship, earned light. The app never shouts,
never pressures, never uses red-for-wrong. Progress = light spreading.

## Core tokens

| Token | Value | Use |
|---|---|---|
| `--lumina-ink` | `#191238` | Headings, dark shells |
| `--lumina-violet` | `#7c60e8` | Primary actions, focus rings |
| `--lumina-gold` | `#ffd66b` | Rewards, ready-to-play stars, coins |
| `--lumina-mint` | `#9dffd8` | Completed / mastered states |
| `--lumina-cream` | `#fdfbf4` | Light-shell backgrounds |
| Radius | 18–24px cards, 999px pills | Everything rounded, nothing sharp |
| Type scale | h1 2.4–3rem / h2 1.6rem / body 1rem / eyebrow 0.72rem caps +0.08em | Eyebrows always uppercase with letter-spacing |

## Motion rules

- Durations: micro-feedback 150–250ms; scene entrances 400–600ms; ambient
  loops (twinkle, pulse) 2–3s ease-in-out infinite.
- Motion always means something: reward, state change, or guidance. Never
  decoration-only on interactive screens.
- Every animation gets a `prefers-reduced-motion: reduce` fallback.

## Grade themes (existing)

`theme-explorer` (Grades 4–6, warm + playful), `theme-pathfinder` (7–9,
cool + adventurous), `theme-navigator` (10–12, calm + precise). Do not mix
theme accents within one screen.

## World palettes (Grade 7 — implemented in world.css by Task 15)

| World | Direction | `--world-accent` | Sky top → bottom |
|---|---|---|---|
| mountain | storm-light alpine: slate blues, ice light | `#4f7fb8` | `#eef4fb` → `#dbe7f4` |
| balance | violet energy lab: arcane glow, amber sparks | `#7c60e8` | `#f3effd` → `#e6defa` |
| shop | warm bazaar: lantern orange, dusk pink | `#e8702a` | `#fff4ea` → `#fde3cf` |
| skatepark | neon rooftop sunset: magenta + teal accents | `#d84f9a` | `#fdeef7` → `#e8e0f7` |
| cricket | floodlit stadium: pitch green, night sky | `#2f9d5f` | `#eefaf1` → `#d9f0e2` |

Rule for future worlds: pick ONE deliberate direction (name it in this
table), one accent, one two-stop sky. Never default to the generic
flat-card look — that is the failure mode this document exists to prevent.

## Nova character sheet (A5 — for consistent art generation)

- Species/form: small four-point star, warm gold `#ffd66b`, soft rounded
  points, subtle outer glow.
- Face: two simple dark oval eyes, tiny smile; no eyebrows, no limbs.
- Personality in posture: curious lean toward the learner's task; never
  hovering over the child's answer area.
- Cosmetic anchor: items sit at Nova's lower-left point, tilted −12°
  (matches `.nova-gear` in code).
- Scale: Nova ≈ 1/6 of scene height in wide scenes, 1/3 in close-ups.
- Generation prompt template: "A small friendly four-point golden star
  character with soft glow, simple dark oval eyes and a tiny smile,
  [ACTION] in [WORLD DIRECTION from the table above], children's book
  digital painting, deep purple night-sky palette with warm gold accents,
  no text" — always attach 2–3 previous Nova renders as reference images.

## Asset pipeline (per new scene)

1. Collect 2–3 reference images for the section (not whole-page refs).
2. Generate with the prompt template + Nova references; regenerate until
   Nova matches the sheet (eyes, glow, point count are the drift points).
3. Export ≤ 400KB WebP/PNG to `public/images/`, named `lumina-<world>-<scene>.png`.
4. QA rubric before shipping (from the brand-sites bookmark): typography,
   color, hierarchy, animation, mobile, copy — all six checked on-device.
```

- [ ] **Step 2: Verify the doc renders**

Open the file in a Markdown preview — tables render, no broken formatting.

- [ ] **Step 3: Commit**

```bash
git add docs/design/LUMINA-DESIGN-SYSTEM.md
git commit -m "docs: Lumina design system with per-world art directions and Nova character sheet"
```

### Task 15: Per-world visual themes for the five activity screens

Implement the "World palettes" table from Task 14. Kills the generic light-blue look: each activity screen gets its world's sky, accent, and tinted finale.

**Files:**
- Modify: `src/app/page.tsx` — the `screen === "activity"` block (original line 421-423)
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `activeAdventure` state (already exists in `page.tsx`); world palette values from Task 14's table; `.finale-<id>` classes from Task 9.
- Produces: `main.activity-shell.world-<id>` CSS custom properties consumed by appended rules.

- [ ] **Step 1: Tag the activity shell with its world** — in the `screen === "activity"` block, change `<main className="shell activity-shell theme-pathfinder">` to:

```tsx
<main className={`shell activity-shell theme-pathfinder world-${activeAdventure}`}>
```

- [ ] **Step 2: Append the theming CSS**

```css
/* Task 15: per-world visual identities (see docs/design/LUMINA-DESIGN-SYSTEM.md) */
main.activity-shell { background: linear-gradient(180deg, var(--world-sky-top, #f4f6ff) 0%, var(--world-sky-bottom, #e8ecfb) 100%); }
main.activity-shell.world-mountain { --world-accent: #4f7fb8; --world-accent-dim: #b7c9dd; --world-sky-top: #eef4fb; --world-sky-bottom: #dbe7f4; }
main.activity-shell.world-balance { --world-accent: #7c60e8; --world-accent-dim: #cfc4f5; --world-sky-top: #f3effd; --world-sky-bottom: #e6defa; }
main.activity-shell.world-shop { --world-accent: #e8702a; --world-accent-dim: #f3c5a8; --world-sky-top: #fff4ea; --world-sky-bottom: #fde3cf; }
main.activity-shell.world-skatepark { --world-accent: #d84f9a; --world-accent-dim: #f0b8d6; --world-sky-top: #fdeef7; --world-sky-bottom: #e8e0f7; }
main.activity-shell.world-cricket { --world-accent: #2f9d5f; --world-accent-dim: #b5dcc5; --world-sky-top: #eefaf1; --world-sky-bottom: #d9f0e2; }
main.activity-shell .activity-panel { border-top: 5px solid var(--world-accent, #7c60e8); }
main.activity-shell .chapter-event-progress span { background: var(--world-accent, #7c60e8); }
main.activity-shell .primary { background: var(--world-accent, #7c60e8); }
main.activity-shell .primary:disabled { background: var(--world-accent-dim, #b9c4d8); }
main.activity-shell .offer-grid button.selected, main.activity-shell .quarter-split button.chosen, main.activity-shell .cricket-lab button.picked { outline: 2px solid var(--world-accent, #7c60e8); outline-offset: 2px; }
main.activity-shell .visual-story-scene, main.activity-shell .interactive-moment, main.activity-shell .balance-lab, main.activity-shell .skate-lab, main.activity-shell .shop-lab, main.activity-shell .cricket-lab { border: 1px solid color-mix(in srgb, var(--world-accent, #7c60e8) 35%, transparent); border-radius: 18px; }
main.activity-shell .mini-discovery { border-left: 4px solid var(--world-accent, #7c60e8); }
/* Finale tints per world */
.finale-mountain { background: linear-gradient(180deg, #1d2f4a 0%, #35558033 100%), linear-gradient(180deg, #241a52, #3b2a72); }
.finale-balance { background: linear-gradient(180deg, #241a52 0%, #4b378a 100%); }
.finale-shop { background: linear-gradient(180deg, #472418 0%, #7a4a22 100%); }
.finale-skatepark { background: linear-gradient(180deg, #33124a 0%, #7a2a5c 100%); }
.finale-cricket { background: linear-gradient(180deg, #0f3524 0%, #1e5c3c 100%); }
```

- [ ] **Step 3: Verify all five worlds**

On http://localhost:3005, Grade 7 — open each of the five activities and confirm: the page background, progress bar, primary buttons, and lab borders take that world's palette (alpine blue / violet / bazaar orange / neon magenta / pitch green); disabled buttons use the dim tint; each finale shows its tinted backdrop. Confirm text contrast stays readable on every accent (buttons are white-on-accent — all five accents are dark enough).

- [ ] **Step 4: Run checks**

Run: `npm run lint` then `npm run test` then `npm run build` — Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/world.css
git commit -m "feat: per-world visual identities for all five Grade 7 activities"
```

---

## Out of scope (deliberately)

- Dark mode, cloud-save wiring (`hosted-progress.ts`), attempt analytics, screen routing/deep links — real improvements, but not part of this UI-engagement pack. Plan them separately.
- No cosmetics "unlock by completing world X" mechanic — coins-only purchases keep the economy simple (YAGNI).

## Execution notes

- Task order is dependency order: 3 → 4 → 5 within Phase 1; 6 → 7 → 8 within Phase 2; 9 → 10 within Phase 3; 11 → 12 within Phase 4. Phases 0 and 4 are independent of Phases 1–3 except that Task 12 touches topbars created in Task 5 — do Task 5 before Task 12. Task 14 is doc-only (anytime); Task 15 needs Task 9's `.finale-<id>` classes and Task 14's palette table. Task 13 is optional and last.
- Voice mode (B2) and beacon-maintenance spaced review (B5) from the original upgrade report stay out of this pack: voice scored lowest for kid interest in the judge panel, and B5 is a learning-feature (not UI) better planned with the analytics work.
- The repo has no remote-push requirement; commit locally on a feature branch (e.g. `git checkout -b feature/kid-interest-pack` before Task 1).
