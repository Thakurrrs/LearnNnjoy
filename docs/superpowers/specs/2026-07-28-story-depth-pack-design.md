# Story Depth Pack — Design Spec

*2026-07-28 · builds on `feature/kid-interest-pack` (kid-as-hero redesign: HeroBadge/HeroDuo, personalize, Story Bible, copy-lint).*

## 1. Vision

Kill story repetition and make Nova actually teach. Each mission becomes **one serialized adventure** — the plot advances with every question and never repeats. Nova gains two teaching moments: a tiny worked example before the kid's first try at a skill, and an in-story explanation when they get stuck. All five Grade-7 adventures get the same teaching treatment. Copy only + a small pure-function story engine; **no save-schema changes, no new activities, no new art.**

## 2. How missions actually work (grounding facts)

- A mission = the **fixed, ordered** question list for a (grade, subject): `getQuestsForGrade` / `getScienceQuestsForGrade` / `getEnglishQuestsForGrade` / `getSocialQuestsForGrade`. `questIndex` walks it linearly. Only the *support mode* (rebuild/steady/stretch) is adaptive — question order is deterministic.
- Four mission skins exist: **Lumina restoration** (maths), **Earthkeepers** (science), **Story Studio** (english), **Mapmakers' Camp** (social).
- Science missions are all `ecosystem` visuals, english all `reading`, social all `map`. Maths mixes `fraction` / `number-line` / `formula` / `coordinate` / default (ratio).
- Wrong answers today: `wrongAttemptsOnQuestion` increments, feedback = "retry", hint auto-shows. `getLessonStory(question)` supplies chapter/outcome copy per question — same story for the same visual type, forever. That is the repetition bug.

## 3. The arc system

### 3.1 Catalog — `src/lib/story-arcs.ts`

Six arcs in v1, each a complete adventure written in Story-Bible voice:

| Arc id | Title | Subject | Assigned |
|---|---|---|---|
| `sky-whale` | The Sky-Whale of Cloud Island | maths | grades where `grade % 3 === 0` |
| `comet-cup` | The Comet Cup Race | maths | `grade % 3 === 1` |
| `lighthouse` | The Lost Lighthouse of Star Harbor | maths | `grade % 3 === 2` |
| `sleeping-garden` | The Sleeping Garden | science | all science missions *(phase 6, cuttable)* |
| `runaway-book` | The Runaway Storybook | english | all english missions *(phase 6, cuttable)* |
| `lost-festival` | The Festival That Lost Its Way | social | all social missions *(phase 6, cuttable)* |

`getArcFor(subject, grade)` → deterministic pick per the table, returning `null` for subjects without an arc yet — the engine then falls back to that subject's existing template story. A kid switching grades in maths gets a *different* adventure; science/english/social each get one arc in the cuttable tail phase (their missions are shorter and single-skill).

### 3.2 Arc shape

```ts
type ArcBeat = {
  chapterTitle: string;      // "Her wing is torn."
  chapterDialogue: string;   // plot line, {hero} token, Nova first-person
  chapterAction: string;     // CTA: "Cut the patch with Nova"
  completeLabel: string;     // story-contextual: "PATCH CUT!"
  outcomeTitle: string;      // plot ADVANCES in the outcome
  outcomeDetail: string;     // "It fits! She flapped once and smiled, {hero}!"
};

type Arc = {
  id: string;
  title: string;
  subject: SubjectId;
  beats: ArcBeat[];                          // beats.length >= longest assigned mission
  bridges: Partial<Record<Visual, string>>;  // skill connector per visual type
  finaleBeat: ArcBeat;                       // always used for the LAST question
};
```

- **Beat mapping:** question `i` gets `beats[i]`; the mission's **last** question always gets `finaleBeat` (the climax lands on the finish regardless of mission length). A lint test asserts every arc has `beats.length >= missionLength - 1` for every (grade, subject) it is assigned to — no runtime cycling, no repeats, enforced at test time.
- **Bridges:** one sentence per visual type the arc's subject uses, appended to `chapterDialogue` — e.g. sky-whale `fraction`: `"Her wing patch must be two EQUAL pieces — cut it fair!"`. **Rule:** maths arcs must carry a bridge for all five maths visuals; single-visual arcs (science/english/social) use an empty bridge map — their beats are authored directly for that one skill.
- **"Lengthier" = more beats, not longer sentences.** Sentence rules stay: ≤12 words (quest arcs serve G4+ in youngest-band voice, same as today), ≤16 for G7 adventure copy.

### 3.3 Scene composition — `getArcScene`

`src/lib/arc-scene.ts`:

```ts
getArcScene(args: {
  subject: SubjectId; grade: Grade;
  questIndex: number; missionLength: number;
  question: Question;
}): LessonStory & { workedExample: WorkedExample | null }
```

Returns the same `LessonStory` shape the UI already renders (chapterTitle, chapterDialogue [beat + bridge], chapterAction, coachLine, completeLabel, outcomeTitle, outcomeDetail, outcomeIcon, videoCue, reelFrames), composed from the arc. `page.tsx` swaps `getLessonStory(current)` for `getArcScene(...)` at its single call site (line ~182). `lesson-story.ts` is **retired** along with its per-visual template stories; its type moves to the arc engine. The bespoke `g4-1/2/3` moon-fruit stories become the opening beats of the grade-4 maths arc so that content survives.

`coachLine` comes from the bridge/skill layer (it is the "how to think" line); `reelFrames`/`videoCue` are carried per-beat only where the beat needs them, with a per-visual fallback table retained from today's content.

## 4. Teaching moments

### 4.1 "Watch me first" — `src/lib/worked-examples.ts`

```ts
type WorkedExample = { intro: string; steps: string[]; punchline: string };
getWorkedExample(visual: Visual): WorkedExample
```

One per visual type (8 total), Nova doing ONE tiny example in first person: *intro* ("My turn first!"), 2–3 *steps* ("I cut my patch in two equal pieces."), *punchline* ("Each piece is one-half. Now yours, {hero}!").

**When shown:** on the chapter screen, only when `questIndex` is the **first** index in the mission's quest list with that visual type — a pure derivation from the fixed question order, **no saved state**. `getArcScene` returns `workedExample: null` otherwise. Kids who already know the skill lose ~5 seconds once per mission per skill.

### 4.2 "Help when stuck" — `src/lib/explain-moments.ts`

```ts
explainMoment(question: Question, wrongAttempts: number): string
```

- **1st wrong answer:** replaces the bare hint with Nova teaching in-fiction: a per-visual framing line + the question's existing `hint` rewritten into her speech ("Hmm — those pieces aren't the same size. Equal means EXACTLY matching. Try again!"). Never "wrong", never "incorrect".
- **2nd+ wrong answer:** the worked example panel re-appears alongside her line ("Watch mine one more time…").
- Uses the existing `wrongAttemptsOnQuestion` state; rendering slots into the existing feedback/hint area in `page.tsx`.

### 4.3 Grade-7 adventures — all five

Interaction *inputs* untouched (sliders, +/− buttons, tap-to-pick). Each activity's script in `grade-seven-adventures.tsx` gains:

1. **Setup beats:** intro becomes 2–3 short lines with concrete stakes (replacing today's single line).
2. **Concept beat** before the first interaction — Nova demonstrates the core idea once in-fiction (Mountain Rescue: "Base camp is ZERO. The pod fell 3 below — that's minus 3. Down means minus!"). Rendered as a dismissible "Nova shows you" panel (`NovaShows` component, shared).
3. **Teaching feedback:** wrong/settled moves get lines that explain the maths in-story ("You climbed UP 5 from −3… landed on 2! Minus, then plus!") instead of neutral retry text.
4. **Concept-accurate lab animations** (per decision — the animation must BE the explanation):
   - **Mountain Rescue:** the pod currently moves *horizontally* while teaching altitude. Replace with a **vertical cliff track**: levels +8…−8 stacked top-to-bottom, a gold **BASE CAMP (0)** line, and the pod flying **up/down** with a smooth transition as `position` changes. The horizontal number-line strip is retired for this lab.
   - **Skatepark:** the skater currently floats near the ramp via linear `left/bottom` approximations. Put the skater **inside the rotating ramp element** so it always sits ON the incline and tilts with it; when the angle steepens the skater **slides down** the plank (position along the plank is a function of angle, transitioned); on hitting 60° a **roll-down animation** plays — the ride proves the ramp works.
   - **Balance Lab:** the concept beat gains an interactive mini-beam that **tips** when you take from one side only and stays **level** when you take from both — the tilt is the lesson. Main lab beam unchanged (it is always balanced by design).
   - **Smart Shopper:** the discount step gains a **price bar** — ₹240 drawn as four ₹60 quarters; the shaded region grows with the dial and the first quarter visibly pops off at exactly 25%. Percentage becomes *area of the price*, not just a dial number.
   - **Cricket Data:** bar chart is already concept-accurate; copy/concept-beat pass only.
5. Finales stay; light voice-consistency pass only. Story fictions are retained (pod = altitude, ramp = angle are ideal fits); scripts around them are rewritten.

## 5. Data & save

**No `SavedProgress` changes.** Arc choice is derived from (subject, grade); worked-example display is derived from question order; stuck-flow uses existing in-memory state. Old saves need no migration.

## 6. Testing

- `story-arcs.test.ts` — every arc: beats cover longest assigned mission, finaleBeat present, maths arcs bridge all five maths visuals (single-visual arcs exempt per §3.2), no stray `{hero}` after personalize.
- `arc-scene.test.ts` — beat-to-questIndex mapping, finale lands on last question, worked example returned only at first occurrence of each visual, LessonStory shape complete.
- `explain-moments.test.ts` — 1st vs 2nd+ attempt behavior, hint woven in, no banned words ("wrong", "incorrect").
- **Copy-lint extended** to arcs, worked examples, explain templates, and the new G7 copy: banned-label list, sentence-length bands (≤12 quest / ≤16 G7), no `learningObjective` leakage into dialogue.
- Existing suite stays green; tests importing `getLessonStory` (`story-lint`, `lesson-story`, `science/english/social-quests`, `video-assets`) are migrated to the arc engine in the same task that retires `lesson-story.ts`.

## 7. Out of scope

Voice narration/TTS; journey-map animation; per-question word-problem fusion (rewriting question text itself); a G7 meta-arc connecting the five adventures; new art or illustrated scenes; parent-facing surfaces.

## 8. Coordination & build order

**Pre-condition:** merge the current `feature/kid-interest-pack` PR and land the running polish task (task_e1288637 touches `adaptive.ts` recoveryPrompt and saved-progress extraction) **before** this work starts, on a fresh branch `feature/story-depth-pack`. This avoids collisions on `page.tsx`/`adaptive.ts`.

**Priority (per decision): Grade 7 first.** G7's whole experience is the five maths adventures; it ships before any quest-arc work so the kid sees the teaching upgrade soonest.

1. **G7 rewrite: five activities** (setup beats, concept beat panel, teaching feedback) — deliverable on its own
2. `worked-examples.ts` + `explain-moments.ts` + tests (skill-keyed → covers every subject's quest flow)
3. `story-arcs.ts` types + the three **maths** arcs + arc lint tests
4. `arc-scene.ts` engine; swap into `page.tsx`; retire the maths template stories in `lesson-story.ts` (non-maths subjects keep their current stories as the engine's fallback); migrate affected tests; wire worked-example panel + stuck flow
5. Copy-lint extension + in-browser integration verify (desktop + mobile)
6. *(Cuttable tail)* the three non-maths arcs — Sleeping Garden, Runaway Storybook, Lost Festival — added only after 1–5 are verified; skip or defer freely if energy is better spent shipping.
