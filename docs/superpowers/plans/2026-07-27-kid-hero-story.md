# Kid-as-Hero Story Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the learner the protagonist — illustrated avatar chosen at welcome, name threaded through all story copy, Nova as the best friend who asks for help, cosmetics on the kid's badge, Explorer Levels from a monotonic counter, and one pet chosen at Level 2 that grows with progress.

**Architecture:** Follows the spec at `docs/superpowers/specs/2026-07-27-kid-hero-story-design.md`. Same codebase pattern as the upgrade pack: pure libs in `src/lib` with colocated vitest tests, small client components in `src/components`, screens stay inside `src/app/page.tsx`, CSS appended to `src/app/world.css`. `NovaCompanion` is retired; `HeroBadge`/`HeroDuo` replace it everywhere.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, vitest, hand-rolled CSS in world.css. No new dependencies.

## Global Constraints

- Repo root `F:\AI Stuff\AntiGravity\Projects\Claude\LearnNnjoy`, branch `feature/kid-interest-pack` (continue on it). All paths relative to repo root.
- `npm run lint`, `npm run test`, `npm run build` must pass at the end of every code task. Current baseline: 49 tests green.
- Do not change the localStorage key `learnnjoy-pilot-progress`. New `SavedProgress` fields (`avatar`, `pet`, `lifetimeDiscoveries`) must be validated in `applySavedProgress` and default safely for old saves (avatar `"explorer"`, pet `null`, lifetimeDiscoveries seeded from `correct + completedAdventures.length`).
- `chooseGrade` and `openGradePicker` must NEVER reset `avatar`, `pet`, or `lifetimeDiscoveries`.
- All kid-facing copy follows the spec's Story Bible §6: Nova first-person ≤12-word sentences (G4–6 surfaces), concrete stakes, one metaphor per mission, story-contextual completion labels, no meta-reassurance on kid screens, `learningObjective` never phrased into dialogue.
- Copy given in this plan is FINAL copy — transcribe it verbatim (fix nothing, "improve" nothing).
- JSX in this codebase is dense single-line style — match it; never reformat untouched lines. Append CSS at the END of `src/app/world.css`.
- Visual verification runs on the `learnnjoy-dev` server (port 3005); implementers skip browser steps (controller verifies) but run all test/lint/build steps.
- Commit after every task with the message given in the task.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `public/images/avatars/hero-{boy,girl,explorer}.png` | create (Task 1) | Painted portrait busts, ≤400KB each |
| `src/lib/avatars.ts` + `.test.ts` | create | Avatar catalog + `getAvatar` fallback |
| `src/lib/personalize.ts` + `.test.ts` | create | `{hero}` token filling |
| `src/lib/levels.ts` + `.test.ts` | create | Thresholds + `getExplorerLevel` |
| `src/lib/pets.ts` + `.test.ts` | create | Pet catalog, stages, `petMoment` |
| `src/components/hero-badge.tsx` | create | `HeroBadge` + `HeroDuo` |
| `src/components/nova-companion.tsx` | delete (Task 7) | Retired |
| `src/lib/lesson-story.ts` | rewrite (Task 10) | Story-Bible dialogue + `completeLabel` |
| `src/lib/story-lint.test.ts` | create (Task 12) | Copy-lint: banned labels, sentence length |
| `src/app/page.tsx` | modify (Tasks 6,7,8,9) | Picker, counter, render swaps, copy |
| `src/components/grade-seven-adventures.tsx` | modify (Tasks 9,11) | heroName threading, G7 copy, finaleCopy |
| `src/app/world.css` | modify (append only) | Badge/duo/picker/star-friend styles |

---

## Task 1: Generate the three avatar portraits (CONTROLLER-EXECUTED)

This task needs image-generation tooling and aesthetic judgment — the session controller runs it, not a code subagent. Code tasks do NOT block on it: `HeroBadge` (Task 5) has an emoji fallback when an image is missing.

**Files:**
- Create: `public/images/avatars/hero-boy.png`, `hero-girl.png`, `hero-explorer.png`

- [ ] **Step 1: Generate candidates** with the available image tool (HF Z-Image turbo), 1024×1024, one per prompt:

Boy: `Portrait bust of a brave 10-year-old Indian boy explorer with a small backpack strap, gentle confident smile, deep purple night-sky background with soft stars, warm gold rim light, children's book digital painting, soft rounded shapes, no text`
Girl: `Portrait bust of a brave 10-year-old Indian girl explorer with a small backpack strap and braided hair, gentle confident smile, deep purple night-sky background with soft stars, warm gold rim light, children's book digital painting, soft rounded shapes, no text`
Explorer: `Portrait bust of a young explorer in a soft hooded star-cloak, face warmly lit and friendly, androgynous, deep purple night-sky background with soft stars, warm gold rim light, children's book digital painting, soft rounded shapes, no text`

- [ ] **Step 2: Curate** — pick the candidate per character that best matches the Lumina rules (`docs/design/LUMINA-DESIGN-SYSTEM.md`): purple night palette, warm gold accents, kind expression, readable at 34px when circle-cropped.

- [ ] **Step 3: Compress if needed** — if a PNG exceeds 400KB: `python -c "from PIL import Image; im=Image.open(r'IN.png'); im.save(r'OUT.png', optimize=True)"` or convert to WebP and update the catalog path in Task 2 accordingly.

- [ ] **Step 4: Commit**

```bash
git add public/images/avatars
git commit -m "art: painted avatar portraits (boy, girl, star explorer)"
```

## Task 2: Avatar catalog lib

**Files:**
- Create: `src/lib/avatars.ts`
- Test: `src/lib/avatars.test.ts`

**Interfaces:**
- Produces: `type AvatarId = "boy" | "girl" | "explorer"`; `type Avatar = { id: AvatarId; label: string; image: string; fallbackEmoji: string; alt: string }`; `export const avatars: readonly Avatar[]` (explorer FIRST — it is the default); `export function getAvatar(id: string): Avatar` (fallback `avatars[0]`).

- [ ] **Step 1: Write the failing test** — `src/lib/avatars.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { avatars, getAvatar } from "./avatars";

describe("avatars", () => {
  it("has three unique avatars with the neutral explorer first", () => {
    expect(avatars.map((a) => a.id)).toEqual(["explorer", "boy", "girl"]);
    expect(new Set(avatars.map((a) => a.id)).size).toBe(3);
  });

  it("every avatar is fully described", () => {
    for (const avatar of avatars) {
      expect(avatar.label.length).toBeGreaterThan(0);
      expect(avatar.image).toMatch(/^\/images\/avatars\//);
      expect(avatar.fallbackEmoji.length).toBeGreaterThan(0);
      expect(avatar.alt.length).toBeGreaterThan(10);
    }
  });

  it("falls back to the star explorer for unknown ids", () => {
    expect(getAvatar("boy").id).toBe("boy");
    expect(getAvatar("unknown").id).toBe("explorer");
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run src/lib/avatars.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/avatars.ts`**

```ts
export type AvatarId = "boy" | "girl" | "explorer";
export type Avatar = { id: AvatarId; label: string; image: string; fallbackEmoji: string; alt: string };

export const avatars: readonly Avatar[] = [
  { id: "explorer", label: "Star explorer", image: "/images/avatars/hero-explorer.png", fallbackEmoji: "🧑‍🚀", alt: "A young explorer in a soft hooded star-cloak, smiling warmly" },
  { id: "boy", label: "Boy explorer", image: "/images/avatars/hero-boy.png", fallbackEmoji: "👦", alt: "A brave young boy explorer with a backpack, smiling confidently" },
  { id: "girl", label: "Girl explorer", image: "/images/avatars/hero-girl.png", fallbackEmoji: "👧", alt: "A brave young girl explorer with braided hair, smiling confidently" },
];

export function getAvatar(id: string): Avatar {
  return avatars.find((avatar) => avatar.id === id) ?? avatars[0];
}
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run src/lib/avatars.test.ts` — Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/avatars.ts src/lib/avatars.test.ts
git commit -m "feat: avatar catalog with star-explorer default"
```

## Task 3: personalize lib

**Files:**
- Create: `src/lib/personalize.ts`
- Test: `src/lib/personalize.test.ts`

**Interfaces:**
- Produces: `export function personalize(text: string, name: string): string` — replaces every `{hero}` with the trimmed name, or `"Explorer"` when the name is empty/whitespace.

- [ ] **Step 1: Write the failing test** — `src/lib/personalize.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { personalize } from "./personalize";

describe("personalize", () => {
  it("fills every {hero} token with the name", () => {
    expect(personalize("{hero}! Help {hero} now.", "Aanya")).toBe("Aanya! Help Aanya now.");
  });

  it("uses Explorer when the name is empty or whitespace", () => {
    expect(personalize("Go, {hero}!", "")).toBe("Go, Explorer!");
    expect(personalize("Go, {hero}!", "   ")).toBe("Go, Explorer!");
  });

  it("returns token-free text unchanged and never leaves a stray token", () => {
    expect(personalize("No tokens here.", "Aanya")).toBe("No tokens here.");
    expect(personalize("Hi {hero}", "Aanya")).not.toContain("{hero}");
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run src/lib/personalize.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/personalize.ts`**

```ts
export function personalize(text: string, name: string): string {
  const hero = name.trim() || "Explorer";
  return text.replaceAll("{hero}", hero);
}
```

- [ ] **Step 4: Run to verify it passes** — Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/personalize.ts src/lib/personalize.test.ts
git commit -m "feat: personalize fills {hero} tokens with the learner's name"
```

## Task 4: Explorer levels lib

**Files:**
- Create: `src/lib/levels.ts`
- Test: `src/lib/levels.test.ts`

**Interfaces:**
- Produces: `export const LEVEL_THRESHOLDS = [0, 3, 7, 12, 18, 25, 33, 42, 52, 63]` (discoveries needed for levels 1–10; +12 per level after); `export function getExplorerLevel(lifetimeDiscoveries: number): { level: number; toNext: number }`.

- [ ] **Step 1: Write the failing test** — `src/lib/levels.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getExplorerLevel, LEVEL_THRESHOLDS } from "./levels";

describe("getExplorerLevel", () => {
  it("starts at level 1 and counts toward level 2", () => {
    expect(getExplorerLevel(0)).toEqual({ level: 1, toNext: 3 });
    expect(getExplorerLevel(2)).toEqual({ level: 1, toNext: 1 });
  });

  it("levels up exactly at thresholds", () => {
    expect(getExplorerLevel(3).level).toBe(2);
    expect(getExplorerLevel(6).level).toBe(2);
    expect(getExplorerLevel(7).level).toBe(3);
    expect(getExplorerLevel(63).level).toBe(10);
  });

  it("extends +12 per level beyond the table", () => {
    expect(getExplorerLevel(74)).toEqual({ level: 10, toNext: 1 });
    expect(getExplorerLevel(75).level).toBe(11);
    expect(getExplorerLevel(87).level).toBe(12);
  });

  it("is defensive about bad input", () => {
    expect(getExplorerLevel(-5).level).toBe(1);
    expect(getExplorerLevel(2.9)).toEqual({ level: 1, toNext: 1 });
    expect(LEVEL_THRESHOLDS[0]).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/levels.ts`**

```ts
export const LEVEL_THRESHOLDS = [0, 3, 7, 12, 18, 25, 33, 42, 52, 63];
const BEYOND_TABLE_STEP = 12;

// Level N requires LEVEL_THRESHOLDS[N-1] lifetime discoveries; after the
// table, each level needs 12 more. Monotonic input -> monotonic level.
export function getExplorerLevel(lifetimeDiscoveries: number): { level: number; toNext: number } {
  const discoveries = Math.max(0, Math.floor(lifetimeDiscoveries));
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (discoveries >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  let nextAt = level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + BEYOND_TABLE_STEP;
  while (discoveries >= nextAt) {
    level++;
    nextAt += BEYOND_TABLE_STEP;
  }
  return { level, toNext: nextAt - discoveries };
}
```

- [ ] **Step 4: Run to verify it passes** — Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/levels.ts src/lib/levels.test.ts
git commit -m "feat: explorer level thresholds from lifetime discoveries"
```

## Task 5: Pets lib

**Files:**
- Create: `src/lib/pets.ts`
- Test: `src/lib/pets.test.ts`

**Interfaces:**
- Produces: `type PetId = "dolphin" | "bunny" | "fox" | "turtle" | "dragon"`; `type Pet = { id: PetId; name: string; species: string; emoji: string; stageLines: [string, string, string, string] }`; `export const pets: readonly Pet[]`; `PET_CHOICE_LEVEL = 2`; `PET_STAGE_LEVELS = [2, 4, 7, 10]`; `PET_STAGE_TITLES = ["Hatchling", "Explorer", "Voyager", "Radiant"]`; `getPet(id: string | null): Pet | null`; `getPetStage(level: number): number` (0 = pre-hatch, 1–4); `petMoment(prevDiscoveries: number, nextDiscoveries: number, petId: string | null): string | null` — returns the hatch nudge or stage-up line when this discovery crossed a level boundary, else null.

- [ ] **Step 1: Write the failing test** — `src/lib/pets.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getPet, getPetStage, PET_CHOICE_LEVEL, PET_STAGE_LEVELS, petMoment, pets } from "./pets";

describe("pets catalog", () => {
  it("has five pets including the star-dolphin, each with four stage lines", () => {
    expect(pets).toHaveLength(5);
    expect(pets.map((p) => p.id)).toContain("dolphin");
    expect(new Set(pets.map((p) => p.id)).size).toBe(5);
    for (const pet of pets) expect(pet.stageLines).toHaveLength(4);
  });

  it("getPet returns null for unknown or null ids", () => {
    expect(getPet("dolphin")?.name).toBe("Splash");
    expect(getPet(null)).toBeNull();
    expect(getPet("cat")).toBeNull();
  });
});

describe("getPetStage", () => {
  it("maps levels to stages with 0 before hatching", () => {
    expect(getPetStage(1)).toBe(0);
    expect(getPetStage(2)).toBe(1);
    expect(getPetStage(3)).toBe(1);
    expect(getPetStage(4)).toBe(2);
    expect(getPetStage(7)).toBe(3);
    expect(getPetStage(10)).toBe(4);
    expect(getPetStage(99)).toBe(4);
  });
});

describe("petMoment", () => {
  it("announces the egg when crossing the choice level without a pet", () => {
    expect(petMoment(2, 3, null)).toContain("star-egg");
  });

  it("announces a stage-up line for the chosen pet", () => {
    // 32 -> 33 discoveries crosses level 6 -> 7, which is stage 2 -> 3 (Voyager)
    const line = petMoment(32, 33, "dolphin");
    expect(line).toBe(getPet("dolphin")!.stageLines[2]);
  });

  it("is quiet when no boundary is crossed", () => {
    expect(petMoment(3, 4, "dolphin")).toBeNull();
    expect(petMoment(8, 9, null)).toBeNull();
  });

  it("exposes sane constants", () => {
    expect(PET_CHOICE_LEVEL).toBe(2);
    expect(PET_STAGE_LEVELS).toEqual([2, 4, 7, 10]);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — Expected: FAIL (module not found).

- [ ] **Step 3: Create `src/lib/pets.ts`**

```ts
import { getExplorerLevel } from "./levels";

export type PetId = "dolphin" | "bunny" | "fox" | "turtle" | "dragon";
export type Pet = { id: PetId; name: string; species: string; emoji: string; stageLines: [string, string, string, string] };

export const PET_CHOICE_LEVEL = 2;
export const PET_STAGE_LEVELS = [2, 4, 7, 10];
export const PET_STAGE_TITLES = ["Hatchling", "Explorer", "Voyager", "Radiant"];

export const pets: readonly Pet[] = [
  { id: "dolphin", name: "Splash", species: "star-dolphin", emoji: "🐬", stageLines: ["Splash hatched — and splashed starlight everywhere!", "Splash can ride the little star-waves now!", "Splash learned to leap right through starlight!", "Splash glows — every wave turns to aurora!"] },
  { id: "bunny", name: "Comet", species: "star-bunny", emoji: "🐰", stageLines: ["Comet hatched with a sneeze of stardust!", "Comet hops higher than your head now!", "Comet can bounce across whole clouds!", "Comet leaves a trail of tiny comets!"] },
  { id: "fox", name: "Pip", species: "moon-fox", emoji: "🦊", stageLines: ["Pip hatched — and hid inside your hood!", "Pip's tail glows like a little moon!", "Pip can sniff out hidden star-paths!", "Pip's fur shimmers with moonlight!"] },
  { id: "turtle", name: "Drift", species: "cloud-turtle", emoji: "🐢", stageLines: ["Drift hatched, slow and smiley!", "Drift's shell grew a tiny cloud!", "Drift can float you over star-rivers!", "Drift's shell holds a whole sky now!"] },
  { id: "dragon", name: "Ember", species: "comet-dragon", emoji: "🐉", stageLines: ["Ember hatched with one warm little spark!", "Ember's wings finally caught the wind!", "Ember breathes comet-sparkles now!", "Ember can light the whole night sky!"] },
];

export function getPet(id: string | null): Pet | null {
  return pets.find((pet) => pet.id === id) ?? null;
}

export function getPetStage(level: number): number {
  let stage = 0;
  for (let i = 0; i < PET_STAGE_LEVELS.length; i++) {
    if (level >= PET_STAGE_LEVELS[i]) stage = i + 1;
  }
  return stage;
}

export function petMoment(prevDiscoveries: number, nextDiscoveries: number, petId: string | null): string | null {
  const before = getExplorerLevel(prevDiscoveries).level;
  const after = getExplorerLevel(nextDiscoveries).level;
  if (after === before) return null;
  if (petId === null) {
    return before < PET_CHOICE_LEVEL && after >= PET_CHOICE_LEVEL ? "A star-egg is ready to hatch! Visit your world to meet your new friend." : null;
  }
  const stageBefore = getPetStage(before);
  const stageAfter = getPetStage(after);
  if (stageAfter > stageBefore) {
    const pet = getPet(petId);
    if (pet) return pet.stageLines[stageAfter - 1];
  }
  return null;
}
```

- [ ] **Step 4: Run to verify it passes** — Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/pets.ts src/lib/pets.test.ts
git commit -m "feat: single growing pet - catalog, stages, and level-crossing moments"
```

## Task 6: HeroBadge + HeroDuo components

**Files:**
- Create: `src/components/hero-badge.tsx`
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `getAvatar` (Task 2), `getCosmetic` (existing), `getPet`/`getPetStage` (Task 5).
- Produces: `HeroBadge({ avatar, name, size = "md", level, equippedCosmetic }: { avatar: string; name?: string; size?: "sm" | "md" | "lg"; level?: number; equippedCosmetic?: string })`; `HeroDuo({ avatar, name, equippedCosmetic, level, pet, size = "md" }: { avatar: string; name?: string; equippedCosmetic?: string; level?: number; pet?: string | null; size?: "sm" | "md" | "lg" })`.

- [ ] **Step 1: Create `src/components/hero-badge.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { getAvatar } from "@/lib/avatars";
import { getCosmetic } from "@/lib/cosmetics";
import { getPet, getPetStage } from "@/lib/pets";

export function HeroBadge({ avatar, name, size = "md", level, equippedCosmetic }: { avatar: string; name?: string; size?: "sm" | "md" | "lg"; level?: number; equippedCosmetic?: string }) {
  const hero = getAvatar(avatar);
  const [imgFailed, setImgFailed] = useState(false);
  const cosmetic = equippedCosmetic ? getCosmetic(equippedCosmetic) : null;
  const ring = cosmetic?.id === "aurora" ? "ring-aurora" : cosmetic?.id === "starglow" ? "ring-starglow" : "ring-gold";
  return (
    <span className={`hero-badge hero-${size} ${ring}`} role="img" aria-label={name ? `${name} the explorer` : hero.alt}>
      <span className="hero-portrait" aria-hidden>
        {imgFailed ? <span className="hero-fallback">{hero.fallbackEmoji}</span> : <Image src={hero.image} alt="" width={128} height={128} onError={() => setImgFailed(true)} />}
      </span>
      {cosmetic && <span className="hero-gear" aria-hidden>{cosmetic.emoji}</span>}
      {typeof level === "number" && <span className="hero-level">Lv {level}</span>}
      {name && <small className="hero-name">{name}</small>}
    </span>
  );
}

export function HeroDuo({ avatar, name, equippedCosmetic, level, pet, size = "md" }: { avatar: string; name?: string; equippedCosmetic?: string; level?: number; pet?: string | null; size?: "sm" | "md" | "lg" }) {
  const chosen = getPet(pet ?? null);
  const stage = typeof level === "number" ? getPetStage(level) : 0;
  return (
    <span className={`hero-duo hero-duo-${size}`}>
      <HeroBadge avatar={avatar} name={name} size={size} level={level} equippedCosmetic={equippedCosmetic} />
      <span className="duo-nova" role="img" aria-label="Nova, your star friend">✨</span>
      {chosen && stage > 0 && <span className={`duo-pet pet-stage-${stage}`} role="img" aria-label={`${chosen.name} the ${chosen.species}`}>{chosen.emoji}</span>}
    </span>
  );
}
```

- [ ] **Step 2: Append CSS to `src/app/world.css`**

```css
/* Kid-hero: explorer badge + duo */
.hero-badge { position: relative; display: inline-flex; align-items: center; gap: 0.45rem; line-height: 1; }
.hero-portrait { display: inline-flex; border-radius: 50%; overflow: hidden; background: #241a52; align-items: center; justify-content: center; }
.hero-portrait img { width: 100%; height: 100%; object-fit: cover; }
.hero-fallback { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.hero-badge.ring-gold .hero-portrait { box-shadow: 0 0 0 2px #ffd66b, 0 2px 8px rgba(25, 18, 56, 0.3); }
.hero-badge.ring-aurora .hero-portrait { box-shadow: 0 0 0 2px transparent, 0 0 10px 2px rgba(157, 255, 216, 0.8); border: 2px solid; border-image: linear-gradient(135deg, #9dffd8, #7c60e8) 1; border-radius: 50%; }
.hero-badge.ring-starglow .hero-portrait { box-shadow: 0 0 0 2px #ffd66b, 0 0 14px 4px rgba(255, 214, 107, 0.75); }
.hero-gear { position: absolute; bottom: -0.3em; left: 0.1em; transform: rotate(-12deg); filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)); }
.hero-level { position: absolute; top: -0.5em; left: -0.4em; background: #7c60e8; color: #fff; font-size: 0.5em; font-weight: 800; padding: 0.2em 0.45em; border-radius: 999px; letter-spacing: 0.02em; }
.hero-name { font-weight: 700; opacity: 0.9; }
.hero-sm { font-size: 1rem; } .hero-sm .hero-portrait { width: 34px; height: 34px; } .hero-sm .hero-fallback { font-size: 1.1rem; } .hero-sm .hero-gear { font-size: 0.75rem; }
.hero-md { font-size: 1.2rem; } .hero-md .hero-portrait { width: 56px; height: 56px; } .hero-md .hero-fallback { font-size: 1.8rem; } .hero-md .hero-gear { font-size: 1rem; }
.hero-lg { font-size: 1.4rem; } .hero-lg .hero-portrait { width: 96px; height: 96px; } .hero-lg .hero-fallback { font-size: 3rem; } .hero-lg .hero-gear { font-size: 1.5rem; }
.hero-duo { display: inline-flex; align-items: center; gap: 0.4rem; }
.duo-nova { font-size: 0.95em; filter: drop-shadow(0 0 4px rgba(255, 214, 107, 0.8)); }
.duo-pet { line-height: 1; }
.pet-stage-1 { font-size: 0.85em; opacity: 0.95; }
.pet-stage-2 { font-size: 1.05em; filter: drop-shadow(0 0 3px rgba(255, 214, 107, 0.7)); }
.pet-stage-3 { font-size: 1.25em; filter: drop-shadow(0 0 6px rgba(157, 255, 216, 0.8)); }
.pet-stage-4 { font-size: 1.45em; filter: drop-shadow(0 0 9px rgba(157, 255, 216, 1)) drop-shadow(0 0 14px rgba(124, 96, 232, 0.7)); }
```

- [ ] **Step 3: Run `npm run lint`** — Expected: passes (components not yet mounted).

- [ ] **Step 4: Commit**

```bash
git add src/components/hero-badge.tsx src/app/world.css
git commit -m "feat: HeroBadge and HeroDuo identity components"
```

## Task 7: Save fields, welcome picker, counter wiring, render swap

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/nova-companion.tsx`
- Modify: `src/app/world.css` (append picker styles; delete the `/* Task 4: Nova wears her cosmetics */` block through `.nova-lg small` rule — we own that appended block)

**Interfaces:**
- Consumes: `avatars`/`getAvatar` (T2), `getExplorerLevel` (T4), `petMoment` (T5), `HeroBadge`/`HeroDuo` (T6).
- Produces: `SavedProgress` gains `avatar: string; pet: string | null; lifetimeDiscoveries: number; };` state hooks `avatar`, `pet`, `lifetimeDiscoveries`, `petNote`. Task 8 (world screen) and Task 9 (G7) rely on these exact names.

- [ ] **Step 1: Imports** — in `src/app/page.tsx` remove the `NovaCompanion` import and add:

```tsx
import { avatars } from "@/lib/avatars";
import { getExplorerLevel } from "@/lib/levels";
import { petMoment } from "@/lib/pets";
import { HeroBadge, HeroDuo } from "@/components/hero-badge";
```

- [ ] **Step 2: SavedProgress + state.** Add to the `SavedProgress` type: `avatar: string; pet: string | null; lifetimeDiscoveries: number;`. Add state hooks next to `equippedCosmetic`:

```tsx
  const [avatar, setAvatar] = useState("explorer");
  const [pet, setPet] = useState<string | null>(null);
  const [lifetimeDiscoveries, setLifetimeDiscoveries] = useState(0);
  const [petNote, setPetNote] = useState<string | null>(null);
```

And a derived value right after `gradeSevenChapters`:

```tsx
  const explorer = getExplorerLevel(lifetimeDiscoveries);
```

- [ ] **Step 3: applySavedProgress additions** (inside the function, with the other validations):

```tsx
    if (saved.avatar === "boy" || saved.avatar === "girl" || saved.avatar === "explorer") setAvatar(saved.avatar);
    if (saved.pet === null || (typeof saved.pet === "string" && ["dolphin", "bunny", "fox", "turtle", "dragon"].includes(saved.pet))) setPet(saved.pet ?? null);
    if (typeof saved.lifetimeDiscoveries === "number" && saved.lifetimeDiscoveries >= 0) setLifetimeDiscoveries(Math.floor(saved.lifetimeDiscoveries));
    else setLifetimeDiscoveries(Math.max(0, (saved.correct ?? 0) + (saved.completedAdventures?.length ?? 0)));
```

- [ ] **Step 4: Persist.** Add `avatar, pet, lifetimeDiscoveries` to the `progress` object in the save `useEffect` and to its dependency array. Do NOT add resets to `chooseGrade`/`openGradePicker` — add this comment as the first line of `chooseGrade`: `// avatar, pet, and lifetimeDiscoveries are permanent - never reset them here`.

- [ ] **Step 5: Counter + pet moments.** In `answer()`'s correct branch, immediately after `setCoins((value) => value + 25);` add:

```tsx
      setPetNote(petMoment(lifetimeDiscoveries, lifetimeDiscoveries + 1, pet));
      setLifetimeDiscoveries((value) => value + 1);
```

In `finishGradeSevenAdventure()`, inside the `if (!completedAdventures.includes(activeAdventure)) {` block add:

```tsx
      setPetNote(petMoment(lifetimeDiscoveries, lifetimeDiscoveries + 1, pet));
      setLifetimeDiscoveries((value) => value + 1);
```

- [ ] **Step 6: Welcome picker.** In the welcome card, immediately AFTER the grade `<label>...</label>` and BEFORE `<div className="grade-preview">`, insert:

```tsx
<div className="avatar-picker"><p className="eyebrow">CHOOSE YOUR EXPLORER</p><div className="avatar-chip-row">{avatars.map((option) => <button key={option.id} type="button" className={avatar === option.id ? "avatar-chip selected" : "avatar-chip"} aria-pressed={avatar === option.id} onClick={() => setAvatar(option.id)}><HeroBadge avatar={option.id} size="md" /><small>{option.label}</small></button>)}</div></div>
```

- [ ] **Step 7: Render swaps.** Replace every `NovaCompanion` usage:
- Quest topbar: `<NovaCompanion equippedCosmetic={equippedCosmetic} size="sm" showName />` → `<HeroDuo avatar={avatar} name={name} equippedCosmetic={equippedCosmetic} level={explorer.level} pet={pet} size="sm" />`
- Adventures topbar (same original JSX with `showName`) → same `HeroDuo` line as above.
- Activity topbar: `<NovaCompanion equippedCosmetic={equippedCosmetic} size="sm" />` → `<HeroDuo avatar={avatar} equippedCosmetic={equippedCosmetic} level={explorer.level} pet={pet} size="sm" />`
- Mission scene: `<div className="nova-orbit"><NovaCompanion equippedCosmetic={equippedCosmetic} size="sm" /></div>` → `<div className="nova-orbit">✨</div>`
- Outcome: `<div className="outcome-nova"><NovaCompanion equippedCosmetic={equippedCosmetic} size="md" /></div>` → `<div className="outcome-nova"><HeroDuo avatar={avatar} name={name} equippedCosmetic={equippedCosmetic} level={explorer.level} pet={pet} size="md" /></div>`
- World preview: `<section className="nova-preview"><NovaCompanion equippedCosmetic={equippedCosmetic} size="lg" showName /><p>Everything Nova wears was earned by your ideas.</p></section>` → `<section className="nova-preview"><HeroBadge avatar={avatar} name={name} size="lg" level={explorer.level} equippedCosmetic={equippedCosmetic} /><p>Everything you wear was earned by your ideas. {explorer.toNext} more {explorer.toNext === 1 ? "discovery" : "discoveries"} to Level {explorer.level + 1}.</p></section>`

Then delete `src/components/nova-companion.tsx` and remove the appended `/* Task 4: Nova wears her cosmetics */` CSS block (all `.nova-companion`/`.nova-star`/`.nova-gear`/`.nova-sm|md|lg` rules) from world.css. Keep `.nova-preview`/`.outcome-nova` layout rules.

- [ ] **Step 8: Append picker CSS**

```css
/* Kid-hero: welcome avatar picker */
.avatar-picker { margin: 0.4rem 0; }
.avatar-chip-row { display: flex; gap: 0.6rem; margin-top: 0.4rem; }
.avatar-chip { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; padding: 0.6rem 0.8rem; border: 2px solid transparent; border-radius: 16px; background: rgba(124, 96, 232, 0.07); cursor: pointer; }
.avatar-chip small { font-weight: 600; }
.avatar-chip.selected { border-color: #7c60e8; background: rgba(124, 96, 232, 0.14); }
.avatar-chip:focus-visible { outline: 2px solid #ffd66b; outline-offset: 2px; }
```

- [ ] **Step 9: Run checks** — `npm run lint`, `npm run test`, `npm run build` — Expected: all pass (old NovaCompanion references would fail the build; zero must remain).

- [ ] **Step 10: Commit**

```bash
git add -A src
git commit -m "feat: avatar picker, lifetime counter, HeroDuo replaces NovaCompanion everywhere"
```

## Task 8: Star Friend section + pet note banner

**Files:**
- Modify: `src/app/page.tsx` (world screen + adventures screen + outcome screen)
- Modify: `src/app/world.css` (append)

**Interfaces:**
- Consumes: `pets`, `getPet`, `getPetStage`, `PET_CHOICE_LEVEL`, `PET_STAGE_LEVELS`, `PET_STAGE_TITLES` (extend the Task 7 pets import); `explorer` derived value; `petNote` state.

- [ ] **Step 1: Extend the pets import** in page.tsx to: `import { getPet, getPetStage, PET_CHOICE_LEVEL, PET_STAGE_LEVELS, PET_STAGE_TITLES, petMoment, pets } from "@/lib/pets";`

- [ ] **Step 2: Star Friend section.** In the `screen === "world"` block, immediately AFTER the `</section>` of `.cosmetic-grid`, insert:

```tsx
<section className="star-friend">{pet ? (() => { const chosen = getPet(pet)!; const stage = getPetStage(explorer.level); const nextStageLevel = PET_STAGE_LEVELS.find((at) => at > explorer.level); return <><span className={`friend-face pet-stage-${Math.max(1, stage)}`}>{chosen.emoji}</span><div><p className="eyebrow">YOUR STAR FRIEND</p><b>{chosen.name} the {chosen.species} · {PET_STAGE_TITLES[Math.max(1, stage) - 1]}</b><small>{nextStageLevel ? `Grows again at Level ${nextStageLevel}` : "Fully grown — and very proud of you"}</small></div></>; })() : explorer.level >= PET_CHOICE_LEVEL ? <><span className="friend-face egg-ready">🥚</span><div><p className="eyebrow">A STAR-EGG IS HATCHING!</p><b>Choose your forever friend</b><div className="pet-choice-row">{pets.map((option) => <button key={option.id} type="button" className="pet-chip" onClick={() => { setPet(option.id); sound.play("finale"); }}><span>{option.emoji}</span><small>{option.name}</small><i>{option.species}</i></button>)}</div><small>Choose carefully — your friend stays with you forever.</small></div></> : <><span className="friend-face egg-dim">🥚</span><div><p className="eyebrow">STAR-EGG</p><b>Something is sleeping inside…</b><small>Hatches at Level {PET_CHOICE_LEVEL} · {explorer.toNext} more {explorer.toNext === 1 ? "discovery" : "discoveries"} to go</small></div></>}</section>
```

- [ ] **Step 3: Pet note on outcome + adventures.** In the outcome screen block, immediately after the `adaptive-note` div, insert:

```tsx
{petNote && <div className="pet-note" role="status">⭐ {petNote}</div>}
```

In the adventures screen block, immediately after the `<section className="adventure-hero">...</section>`, insert:

```tsx
{petNote && <button type="button" className="pet-note pet-note-dismiss" onClick={() => setPetNote(null)}>⭐ {petNote} ✕</button>}
```

- [ ] **Step 4: Append CSS**

```css
/* Kid-hero: star friend + pet notes */
.star-friend { display: flex; gap: 1.1rem; align-items: flex-start; width: min(1080px, calc(100% - 40px)); margin: 0 auto 60px; padding: 1.2rem 1.5rem; border-radius: 20px; background: rgba(124, 96, 232, 0.08); }
.friend-face { font-size: 3rem; line-height: 1; }
.friend-face.egg-dim { opacity: 0.45; filter: grayscale(0.4); }
.friend-face.egg-ready { animation: egg-wiggle 1.2s ease-in-out infinite; }
.pet-choice-row { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0.6rem 0; }
.pet-chip { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; padding: 0.6rem 0.9rem; border: 2px solid transparent; border-radius: 14px; background: #fff; cursor: pointer; }
.pet-chip span { font-size: 1.8rem; }
.pet-chip small { font-weight: 700; }
.pet-chip i { font-style: normal; font-size: 0.7rem; opacity: 0.7; }
.pet-chip:hover { border-color: #7c60e8; }
.pet-note { display: inline-flex; align-items: center; gap: 0.4rem; margin: 0.6rem 0; padding: 0.55rem 1rem; border-radius: 999px; background: rgba(255, 214, 107, 0.2); font-weight: 700; border: none; }
.pet-note-dismiss { cursor: pointer; }
@keyframes egg-wiggle { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
@media (prefers-reduced-motion: reduce) { .friend-face.egg-ready { animation: none; } }
```

- [ ] **Step 5: Run checks** — lint, test, build — Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/app/world.css
git commit -m "feat: star-friend section with egg hatch choice and growth notes"
```

## Task 9: G7 heroName threading + story-contextual G7 copy

**Files:**
- Modify: `src/components/grade-seven-adventures.tsx`
- Modify: `src/app/page.tsx` (two lines)

**Interfaces:**
- Consumes: `personalize` (T3). Produces: `GradeSevenActivity` and `FinaleScene` gain `heroName: string`.

- [ ] **Step 1: Thread heroName.** In `grade-seven-adventures.tsx`: add `import { personalize } from "@/lib/personalize";`. `GradeSevenActivity({ id, firstTime, onFinish })` → `GradeSevenActivity({ id, firstTime, heroName, onFinish }: { id: GradeSevenAdventureId; firstTime: boolean; heroName: string; onFinish: () => void })`; render the intro line as `{personalize(adventure.intro, heroName)}` and pass `heroName={heroName}` to all five activity components; each activity adds `heroName: string` to its props and forwards it to `<FinaleScene ... heroName={heroName} />`; `FinaleScene` adds `heroName: string` and renders `{personalize(copy.detail, heroName)}` for the detail and `{personalize(copy.title, heroName)}` for the title. In `page.tsx`: `<GradeSevenActivity id={activeAdventure} firstTime={...} onFinish={...} />` gains `heroName={name}`; the adventures star-detail `<p>{selected.intro}</p>` becomes `<p>{personalize(selected.intro, name)}</p>` (add `import { personalize } from "@/lib/personalize";`).

- [ ] **Step 2: Rewrite the G7 data copy.** Replace the five `intro` strings in `gradeSevenAdventures` and the whole `finaleCopy` table with EXACTLY:

```tsx
// intros (in gradeSevenAdventures, same objects, only the intro field changes):
mountain: "{hero}! A storm knocked my rescue pod off the cliff. Help me find it?"
balance: "{hero}, this crate won't open until the scale balances. I can't do it alone!"
shop: "{hero}, I need the ₹240 kit before sunset. Is the discount really fair?"
skatepark: "{hero}, my skate ramp needs a perfect 60° turn. Build it with me?"
cricket: "{hero}, the final starts soon! Help me pick the squad — with real data."
```

```tsx
export const finaleCopy: Record<GradeSevenAdventureId, { title: string; detail: string; art: string }> = {
  mountain: { title: "Pod safe!", detail: "\"You found it, {hero}! Your number line led us right to −4. The beacons are lighting up!\"", art: "🚁⛰️☀️" },
  balance: { title: "Crate open!", detail: "\"Seven glowing blocks, {hero}! It worked because you kept both sides fair!\"", art: "📦✨⚖️" },
  shop: { title: "Deal done!", detail: "\"₹60 off, ₹180 paid — you saved us real coins, {hero}! Kit packed!\"", art: "🎒🏮🪙" },
  skatepark: { title: "Ramp ready!", detail: "\"Sixty degrees, exactly right! Look, {hero} — they're skating YOUR ramp!\"", art: "🛹🌆🔺" },
  cricket: { title: "Squad picked!", detail: "\"Asha, Kabir and Noor — chosen by your data, {hero}! Listen to that crowd!\"", art: "🏏🏟️🎉" },
};
```

- [ ] **Step 3: Sweep G7 labels.** In the same file, apply exactly these replacements: `Success`'s `<small>PUT YOUR DISCOVERY INTO WORDS</small>` → `<small>TELL NOVA WHY IT WORKED</small>`; `Success`'s check-complete line `"Exactly. You earned this discovery because you can explain it."` → `"Exactly! Nova is taking notes from YOU now."`; FinaleScene eyebrow `WORLD TRANSFORMED` → `YOU CAME THROUGH`; the not-first-time reward pill copy `Star already lit` / `played again for the joy of it` stays.

- [ ] **Step 4: Update the finaleCopy test.** In `grade-seven-adventures.test.ts` the existing test asserts `detail.length > 20` — keep it, and add inside the same describe:

```ts
  it("finale details speak to the hero by name token", () => {
    for (const adventure of gradeSevenAdventures) {
      expect(finaleCopy[adventure.id].detail).toContain("{hero}");
    }
  });
```

- [ ] **Step 5: Run checks** — lint, test, build — Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/grade-seven-adventures.tsx src/app/page.tsx
git commit -m "feat: Nova asks the hero by name across Grade 7 worlds and finales"
```

## Task 10: Rewrite lesson-story.ts under the Story Bible

**Files:**
- Rewrite: `src/lib/lesson-story.ts` (full file below)
- Modify: `src/lib/lesson-story.test.ts` — existing assertions about shape stay; update any test that asserts old copy strings to the new strings.
- Modify: `src/app/page.tsx` — render sites personalize: `{lessonStory.chapterDialogue}` → `{personalize(lessonStory.chapterDialogue, name)}`; `{lessonStory.coachLine}` → `{personalize(lessonStory.coachLine, name)}`; `{lessonStory.outcomeDetail}` → `{personalize(lessonStory.outcomeDetail, name)}`; outcome eyebrow `MISSION MOMENT COMPLETE` → `{lessonStory.completeLabel}`.

**Interfaces:**
- `LessonStory` gains `completeLabel: string` (story-contextual, uppercase, ≤4 words). All existing fields keep their names — `page.tsx` and `StoryReel` keep working.

- [ ] **Step 1: Replace the entire contents of `src/lib/lesson-story.ts` with:**

```ts
import type { Question } from "./learning";

export type LessonStory = {
  learningObjective: string;
  chapterTitle: string;
  chapterDialogue: string;
  chapterAction: string;
  coachLine: string;
  completeLabel: string;
  outcomeTitle: string;
  outcomeDetail: string;
  outcomeIcon: string;
  videoCue: string;
  reelFrames: [string, string, string, string];
  videoAsset?: { src: string; transcript: string; durationSeconds: number };
};

const byQuestionId: Record<string, Partial<LessonStory>> = {
  "g4-1": {
    learningObjective: "A fraction names equal parts of one clear whole.",
    chapterTitle: "One moon-fruit. Two hungry friends.",
    chapterDialogue: "\"{hero}, Mira and I found ONE moon-fruit. We both want it. Split it fairly?\"",
    coachLine: "\"Which way gives us both the SAME size piece?\"",
    completeLabel: "FAIR SHARE MADE!",
    outcomeTitle: "Half for Nova, half for Mira.",
    outcomeDetail: "\"One whole, two equal pieces. My piece is one-half: 1/2. Thanks, {hero}!\"",
    videoCue: "Moon-fruit glows, splits cleanly into two matching halves, and one half floats gently to Nova.",
  },
  "g4-2": {
    learningObjective: "Halves must be equal parts of the same whole.",
    chapterTitle: "The beacon spots an unfair share.",
    chapterDialogue: "\"Uh oh, {hero}. Some pieces LOOK like halves but aren't. Check them for me?\"",
    coachLine: "\"Fair means equal. Are these pieces really equal?\"",
    completeLabel: "FAIR CATCH!",
    outcomeTitle: "You caught the unfair pieces.",
    outcomeDetail: "\"A half is one of two EQUAL parts. Uneven pieces can't be halves. You spotted it!\"",
    videoCue: "Uneven panels flicker softly; two matching panels lock into place and send a warm beam to the beacon.",
  },
  "g4-3": {
    learningObjective: "Equivalent fractions can name the same amount.",
    chapterTitle: "One-half wears a disguise.",
    chapterDialogue: "\"{hero}, the bridge has FOUR panels now. Can one-half still fit? I'm confused!\"",
    coachLine: "\"Count the glowing panels. Then count them all.\"",
    completeLabel: "DISGUISE SPOTTED!",
    outcomeTitle: "2/4 was one-half all along.",
    outcomeDetail: "\"Two of four equal panels is the SAME amount as one-half! Sneaky fraction!\"",
    videoCue: "Two of four panels brighten in sequence; the bridge glow joins into one half-width beam.",
  },
};

function defaultStory(question: Question): LessonStory {
  if (question.visual === "fraction") {
    return {
      learningObjective: "Fractions describe equal parts of a whole.",
      chapterTitle: "The beacon door is stuck.",
      chapterDialogue: "\"{hero}, this door only opens for equal pieces. Find them with me?\"",
      chapterAction: "Open the door with Nova",
      coachLine: "\"Look for pieces that match exactly.\"",
      completeLabel: "DOOR OPENED!",
      outcomeTitle: "The door swings open.",
      outcomeDetail: "\"Equal pieces! That was the secret. Nice one, {hero}!\"",
      outcomeIcon: "◐",
      videoCue: "Equal glowing pieces join into a balanced beam of starlight.",
      reelFrames: ["Nova finds pieces that look equal.", "The equal pieces fit together as one whole.", "Unequal pieces never fit.", "Your turn: find the equal pieces."],
    };
  }
  if (question.visual === "number-line") {
    return {
      learningObjective: "Number position and distance can be reasoned about on a path.",
      chapterTitle: "Nova is lost in the mist.",
      chapterDialogue: "\"{hero}, I can see the end of the trail but not the steps! Walk it with me?\"",
      chapterAction: "Step onto the trail",
      coachLine: "\"One step at a time. Which way are we going?\"",
      completeLabel: "TRAIL FOUND!",
      outcomeTitle: "The mist clears ahead.",
      outcomeDetail: "\"I can see every step now. You counted us home, {hero}!\"",
      outcomeIcon: "⟶",
      videoCue: "A sequence of stepping stones lights from the starting point to the chosen marker.",
      reelFrames: ["Nova marks the starting stone.", "Each step moves one place along the trail.", "Direction matters: left or right?", "Your turn: take the next step."],
    };
  }
  if (question.visual === "formula") {
    return {
      learningObjective: "A mathematical rule can be followed one visible step at a time.",
      chapterTitle: "The star machine ate Nova's snack.",
      chapterDialogue: "\"{hero}! This machine follows ONE rule. Crack it and it gives my snack back!\"",
      chapterAction: "Inspect the machine",
      coachLine: "\"Change one thing at a time. Watch what happens.\"",
      completeLabel: "MACHINE CRACKED!",
      outcomeTitle: "The machine gives up the snack.",
      outcomeDetail: "\"You followed the rule step by step and beat the machine, {hero}!\"",
      outcomeIcon: "ƒ",
      videoCue: "A clear formula assembles from glowing symbols; each operation lights in sequence until the route resolves.",
      reelFrames: ["Nova feeds the machine a number.", "The rule changes it one step at a time.", "Undo the steps to find the secret.", "Your turn: crack the rule."],
    };
  }
  if (question.visual === "coordinate") {
    return {
      learningObjective: "Position, structure, and evidence can be read from a mathematical model.",
      chapterTitle: "The star map holds a secret.",
      chapterDialogue: "\"{hero}, this map knows where to go — if we read it right. Help me look?\"",
      chapterAction: "Open the star map",
      coachLine: "\"Don't guess. The map already tells us.\"",
      completeLabel: "SECRET READ!",
      outcomeTitle: "The map gives up its secret.",
      outcomeDetail: "\"You read it instead of guessing. That's real explorer thinking, {hero}!\"",
      outcomeIcon: "⌁",
      videoCue: "A coordinate grid and its signal points illuminate one by one, revealing a clean route across the map.",
      reelFrames: ["Nova unrolls the star map.", "Every point sits in its own spot.", "The pattern points the way.", "Your turn: read the map."],
    };
  }
  if (question.visual === "ecosystem") {
    return {
      learningObjective: "Careful observation helps us understand living things, materials, and environmental change.",
      chapterTitle: "Something changed in the garden.",
      chapterDialogue: "\"{hero}, my garden looks different today. Look closely with me — what changed?\"",
      chapterAction: "Look closely with Nova",
      coachLine: "\"Look first. Then say what the clues mean.\"",
      completeLabel: "GARDEN HELPED!",
      outcomeTitle: "The garden perks up.",
      outcomeDetail: "\"You looked carefully and found what it needed. The garden says thanks, {hero}!\"",
      outcomeIcon: "🌿",
      videoCue: "A small habitat wakes gently: sunlight, water, a plant, and an animal appear as the field note records the observation.",
      reelFrames: ["Nova checks the garden every day.", "One small change affects everything.", "Clues first, answers second.", "Your turn: read the clues."],
    };
  }
  if (question.visual === "reading") {
    return {
      learningObjective: "Readers use exact details, vocabulary, and structure to make meaning from a text.",
      chapterTitle: "The storybook is hiding something.",
      chapterDialogue: "\"{hero}, the answer is hiding IN the story. Read it with me and catch it?\"",
      chapterAction: "Open the storybook",
      coachLine: "\"The exact words are the clues.\"",
      completeLabel: "CLUE CAUGHT!",
      outcomeTitle: "The hidden clue jumps out.",
      outcomeDetail: "\"The words told us everything. You're a sharp reader, {hero}!\"",
      outcomeIcon: "📚",
      videoCue: "A storybook opens; key words glow gently and connect into a small illustrated scene as the page turns.",
      reelFrames: ["Nova opens the page.", "Some words glow — they matter most.", "Connect the words to catch the meaning.", "Your turn: catch the clue."],
    };
  }
  if (question.visual === "map") {
    return {
      learningObjective: "Maps, shared spaces, and everyday choices help us understand how communities work together.",
      chapterTitle: "Nova can't find the way to the park.",
      chapterDialogue: "\"{hero}, everyone's waiting at the park and I'm LOST. Read the map with me?\"",
      chapterAction: "Unfold the map",
      coachLine: "\"Compass first. Then the symbols.\"",
      completeLabel: "WAY FOUND!",
      outcomeTitle: "Nova makes it to the park.",
      outcomeDetail: "\"The compass and the symbols got us there. Everyone cheered for you, {hero}!\"",
      outcomeIcon: "🧭",
      videoCue: "A hand-drawn map unfolds; a compass turns north and gentle route markers connect homes, parks, and shared places.",
      reelFrames: ["Nova unfolds the map.", "The compass shows the directions.", "The symbols show what's where.", "Your turn: find the way."],
    };
  }
  return {
    learningObjective: "Matching groups preserve a proportional relationship.",
    chapterTitle: "The picnic doesn't have enough packs.",
    chapterDialogue: "\"{hero}, more friends came to the picnic! Help me make matching packs for everyone?\"",
    chapterAction: "Open the picnic basket",
    coachLine: "\"When one group grows, its partner grows the same way.\"",
    completeLabel: "PICNIC SAVED!",
    outcomeTitle: "Every friend gets a matching pack.",
    outcomeDetail: "\"Every pack matches! Nobody left out. Best picnic ever, {hero}!\"",
    outcomeIcon: "✦",
    videoCue: "Supply groups multiply together and settle into balanced packs on the bridge.",
    reelFrames: ["Nova counts the friends.", "Each pack must match the others.", "Grow the groups together.", "Your turn: make them match."],
  };
}

export function getLessonStory(question: Question): LessonStory {
  const defaults = defaultStory(question);
  return { ...defaults, ...byQuestionId[question.id] };
}
```

- [ ] **Step 2: page.tsx render updates** as listed in Files above (four personalize wraps + the eyebrow swap). `chapterTitle`/`outcomeTitle` contain no tokens — leave un-wrapped.

- [ ] **Step 3: Fix `lesson-story.test.ts`** — run `npx vitest run src/lib/lesson-story.test.ts`; update any assertion that referenced old copy to the new strings (shape assertions stay untouched). All tests must pass without weakening (if a test asserted a field exists, keep it asserting).

- [ ] **Step 4: Run checks** — lint, test, build — Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/lesson-story.ts src/lib/lesson-story.test.ts src/app/page.tsx
git commit -m "feat: story-bible rewrite of all lesson stories with contextual labels"
```

## Task 11: Rewrite the Grade-4 story screens + quest copy in page.tsx

**Files:**
- Modify: `src/app/page.tsx` only

All replacements below are exact. `name` is in scope in every location — use template literals directly (no `{hero}` tokens in JSX).

- [ ] **Step 1: Welcome screen.** `<h1>Maths becomes a world you want to explore.</h1>` → `<h1>This world needs a hero. That&apos;s you.</h1>`. The `.lede` paragraph → `<p className="lede">Real adventures with Nova, your star friend — who needs your help with the maths that saves the day. Grades 4–12.</p>`. The CTA button text: `{grade === 7 ? "Nova is waiting at the star map" : grade === 4 ? "Nova needs your help — start the rescue" : \`Start your Grade ${grade} adventure\`} <span>→</span>`.

- [ ] **Step 2: Story beats (grade-4 `screen === "story"`).** Replace the four beat blocks' text content (structure, handlers, and visuals unchanged):
- Beat 0: eyebrow `CHAPTER ONE · {ageFraming.role.toUpperCase()}` → `CHAPTER ONE · YOUR ADVENTURE`; h1 → `Nova zooms down to you.`; paragraph → `{`"${name.trim() || "Hey"}! I found ONE ${ageFraming.object}. Mira and I both want it. Help us share it fairly?"`}`; button label → `I&apos;ll help you, Nova →`.
- Beat 1: the three-state h1s → `!fruitSplit ? "Here's the moon-fruit." : !fruitShared ? "Two equal pieces! Pick mine." : "Nova hugs the piece. \"One-half!\""`; the three-state paragraphs → `!fruitSplit ? "Tap it to make one fair cut through the middle." : !fruitShared ? "Both pieces match. Tap one to give it to Nova." : "One whole, split into 2 equal parts. Nova has 1 of 2: one-half, written 1/2."`; helper strings → `!fruitSplit ? "One whole · tap to split it" : !fruitShared ? "2 equal pieces · pick one for Nova" : "1 of 2 equal parts = 1/2"`; continue button → `To the bridge! →`.
- Beat 2: h1 → `The bridge wants half its panels lit.`; paragraph → `Nova whispers: "One-half can look different here. Light 2 of the 4 equal panels!"`; helper → `bridgeReady ? "2 of 4 lit — that's one-half too!" : \`${storyCells.length} of 4 panels lit\``; button → `Send the starlight →`.
- Beat 3: eyebrow `BRIDGE RESTORED` → `THE BRIDGE WAKES UP`; h1 → `You did it — Nova is dancing.`; paragraph → `{`"See, ${name.trim() || "friend"}? 1 of 2, or 2 of 4 — BOTH are one-half. You're good at this!"`}`; button → `Keep going with Nova →`.

- [ ] **Step 3: Quest sidebar copy.** Replace the `missionTitle` ternary's diagnostic branches: `grade <= 7 ? "Nova's signal is fading" : "Set your starting signal"` → `grade <= 7 ? "Nova checks your trail" : "Nova checks your trail"` (single string `"Nova checks your trail"`). Replace `missionMoment` diagnostic branches with the single string: `` `"A few quick tries, ${name.trim() || "friend"} — so I pick the right path for us." `` (template literal in the existing ternary position for both the ≤7 and >7 diagnostic cases). Non-diagnostic `missionMoment` values keep their subject-specific strings but shortened: maths → `"One idea at a time. Each one wakes up more of Lumina."` (science/english/social strings stay).

- [ ] **Step 4: Feedback + meta-copy sweep.** Exact replacements in the quest/outcome/trail screens:
- Retry feedback `<b>Not yet—and that&apos;s useful information.</b><span>Let&apos;s slow the picture down and try a new route.</span>` → `<b>Hmm, not that one.</b><span>Nova: &quot;Want to look at the picture again with me?&quot;</span>`
- Recovery card eyebrow `NOVA&apos;S SLOW-DOWN PATH` → `SLOW DOWN WITH NOVA`; its h3 `You don&apos;t have to get it quickly to get it.` → `You don&apos;t have to be fast to be right.`
- Correct feedback `<b>Beacon energy restored! +25 Lumina coins</b>` → `<b>{lessonStory.completeLabel} +25 Lumina coins</b>`
- Stretch prompt `<b>Pathfinder thought</b><span>Can you explain this answer to Nova without using the choices?</span>` → `<b>Bonus star</b><span>Nova: &quot;Tell me WHY that works — in your own words!&quot;</span>`
- Outcome adaptive-note stays (it drives support mode) but its stretch copy line in `adaptive.ts` is out of scope; only the outcome screen's `outcome-reflection` line `Pathfinder thought: could you explain this to Nova in your own words?` → `Bonus star: tell Nova WHY it worked — in your own words.`
- Trail screen small print `This is not a score. It is simply the most comfortable place to begin today.` → DELETE the `<small>` element entirely.
- Trail card support box heading `How LearnNnjoy will help` → `How Nova will help`.
- Outcome eyebrow was changed to `{lessonStory.completeLabel}` in Task 10 — verify it is in place.
- Completion screen (`completed`) eyebrow `MISSION COMPLETE` → `EVERY BEACON LIT!` and its h1 personalizes already via `{name}` — keep.

- [ ] **Step 5: Run checks** — lint, test, build — Expected: all pass.

- [ ] **Step 6: Verify in browser (controller)** — Grade 4 flow reads as Nova speaking to the named kid; no banned labels visible.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: hero-framing rewrite of welcome, story beats, and quest copy"
```

## Task 12: Copy-lint test

**Files:**
- Create: `src/lib/story-lint.test.ts`

- [ ] **Step 1: Create the test:**

```ts
import { describe, expect, it } from "vitest";
import { finaleCopy, gradeSevenAdventures } from "@/components/grade-seven-adventures";
import { getLessonStory } from "./lesson-story";
import type { Question } from "./learning";

const BANNED = ["MISSION MOMENT COMPLETE", "Thoughtful stretch", "calibration", "This is not a score", "useful information", "initialise"];

const visuals: Question["visual"][] = ["fraction", "number-line", "ratio", "formula", "coordinate", "ecosystem", "reading", "map"];
const sampleQuestion = (visual: Question["visual"], id = "lint-sample"): Question => ({ id, prompt: "", choices: [], answer: "", hint: "", explanation: "", visual, skill: "fractions" });

function allStoryStrings(): string[] {
  const strings: string[] = [];
  for (const visual of visuals) {
    const story = getLessonStory(sampleQuestion(visual));
    strings.push(story.chapterTitle, story.chapterDialogue, story.coachLine, story.completeLabel, story.outcomeTitle, story.outcomeDetail, ...story.reelFrames);
  }
  for (const id of ["g4-1", "g4-2", "g4-3"]) {
    const story = getLessonStory(sampleQuestion("fraction", id));
    strings.push(story.chapterTitle, story.chapterDialogue, story.coachLine, story.completeLabel, story.outcomeTitle, story.outcomeDetail);
  }
  for (const adventure of gradeSevenAdventures) strings.push(adventure.intro, finaleCopy[adventure.id].title, finaleCopy[adventure.id].detail);
  return strings;
}

function maxSentenceWords(text: string): number {
  return Math.max(0, ...text.replaceAll("{hero}", "Aanya").split(/[.!?]+/).map((sentence) => sentence.trim().split(/\s+/).filter(Boolean).length));
}

describe("story copy lint", () => {
  it("never uses banned adult labels", () => {
    for (const text of allStoryStrings()) for (const banned of BANNED) expect(text.toLowerCase()).not.toContain(banned.toLowerCase());
  });

  it("keeps sentences kid-short (max 16 words)", () => {
    for (const text of allStoryStrings()) expect(maxSentenceWords(text), text).toBeLessThanOrEqual(16);
  });

  it("completion labels are short and story-contextual", () => {
    for (const visual of visuals) {
      const label = getLessonStory(sampleQuestion(visual)).completeLabel;
      expect(label.split(/\s+/).length).toBeLessThanOrEqual(4);
      expect(label).not.toMatch(/complete/i);
    }
  });
});
```

- [ ] **Step 2: Run it** — `npx vitest run src/lib/story-lint.test.ts` — Expected: PASS against Tasks 9–11's copy. If any string fails, fix the STRING (tighten the copy), never the limit.

- [ ] **Step 3: Full checks** — lint, test, build — Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/story-lint.test.ts
git commit -m "test: story copy lint - banned labels and kid-short sentences"
```

## Task 13: Integration + mobile verification (CONTROLLER-EXECUTED)

- [ ] Fresh localStorage → welcome shows avatar picker; pick girl explorer, name "Aanya", Grade 4 → story beats read as Nova speaking to Aanya → diagnostic → quest shows HeroDuo (girl badge + ✨) in topbar → correct answers increment level (Lv pill) → after 3rd discovery (Level 2) outcome shows the star-egg note → Avatar World shows hatching egg → choose Splash 🐬 → dolphin appears beside the badge → buy a cosmetic → it renders on the KID's badge ring, not Nova.
- [ ] Old-save check: seed a pre-redesign save shape in localStorage (no avatar/pet/lifetimeDiscoveries) → app loads with star-explorer avatar, level seeded from progress, nothing crashes.
- [ ] Grade 7: star-detail intro reads "Aanya! A storm knocked my rescue pod…", finale reads "Pod safe!" with her name; grade-switch away and back → pet and level survive.
- [ ] Mobile 375px: picker chips wrap, HeroDuo fits the topbar, pet emoji visible (not hidden by the old nth-child rule — HeroDuo's pet is not a 2nd-child span inside .quest-stats, verify visually).
- [ ] Screenshots of: welcome+picker, story beat 0, quest with HeroDuo, egg-hatch choice, world with dolphin, G7 finale.

## Out of scope (unchanged from spec §8)

Animated portraits, illustrated pets, avatar aging, voice narration, parent dashboard surface, cosmetic art variants.
