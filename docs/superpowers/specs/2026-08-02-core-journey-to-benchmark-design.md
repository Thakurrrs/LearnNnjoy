# Core Journey to Benchmark — Design

**Date:** 2026-08-02
**Status:** Approved by product owner (this session)
**Applies to:** Nova's Night Run (8 quests), Mountain Rescue, Moonbase Tenfold,
plus cross-cutting experience systems
**Driven by:** [2026-08-02 three-judge panel](../../qa/story-panel-2026-08-02/README.md)

## Context

A fresh three-lens judge panel (child engagement, Grade 7 pedagogy,
narrative/game UX) reviewed the working tree on 2026-08-02. Unanimous verdict:
**polish, don't replace** — the story premises fit, but the back halves of the
execution fail the owner's requirements. Consensus scores: Night Run Q1–4
≈ 7.5, Night Run Q5–8 4.6, Mountain 6.5, Moonbase 5.1.

### Owner requirements (the five dimensions every phase is judged on)

1. Kid's perspective and interest — each moment makes a kid want to see what
   happens next.
2. Interest across the journey — no sag mid-chapter.
3. Come-back pull — a reason to open the app again tomorrow.
4. Maths logic easily understood through the story.
5. Complete chapter concept coverage — every contract concept appears in a
   real quest action.

### Owner directives

- **Stories are replaceable; the experience and the learning are not.**
- **Story Simplicity Gate:** the story must be enjoyable and understandable to
  a Grade 6–7 kid on its own terms — never a complicated premise contrived to
  include maths. After the opening, a kid can say *what's wrong* and *what
  they're about to do* in one sentence. One location, one problem, one action
  per chapter. Dialogue 4–10 words per line, one idea per line. If the plot
  only makes sense once the maths is explained, the story is wrong.

The three core stories, held at one kid-clear sentence each:

- **Mountain:** "The shelter's power pod fell into the ravine — bring it home
  and warm Pip up."
- **Night Run:** "We're opening the night skate course — light every crossing
  so we can ride it."
- **Moonbase:** "Blink chased the comet and got lost — zoom the telescope and
  bring him home for the photo."

Rebuilds add richer *actions*, never plot complexity.

## Goal

Bring the entire core journey to the quality bar Night Run Q1–4 set, measured
on the five dimensions, with each phase independently shippable and
browser-verified before the next begins.

## Scope

**In:** the three worlds above; shared scene engine; delayed concept labels;
honest progress counters; come-back loop; app-voice cleanup; asset-existence
tests; save migration safety.

**Out (explicit):**

- Integer ×/÷ chapter — **deferred follow-up**: needs its own premise hunt
  through the natural-fit gate (the Bible forbids forcing concepts into the
  nearest world). Tracked in Follow-ups below.
- Balance Lab, Smart Shopper, cricket-data polish; new worlds.
- Mobile re-layout beyond verifying the 375×812 composition per phase.

## Phase plan

### Phase 1 — Finish Mountain Rescue

1. **Finale act** (currently a recap card, which the world's own spec
   forbids): winch docks the cell → shelter windows warm → Pip uncurls →
   aurora appears → Nova's recap traces the route on the real cliff →
   postcard mints → cliffhanger tease. This debuts the come-back loop.
2. **Enacted continuity** (07-29 panel fix landed only in card copy):
   - Q1 = locate + **secure** the pod at −4. All "recover/recovered" copy,
     CTAs, and aria labels change to secure/mark language.
   - Q3 rides gusts with the **empty hook or beacon**, never the pod.
   - Q4 lowers the empty hook +2 → −4, attaches, reverses, lifts to +2 —
     **once**, ending at +2. No re-lowering after the climax.
3. **Voice repair:** the component requests 17 `q1-v3-*` files that don't
   exist on disk while `play().catch(() => undefined)` hides the failure.
   Point the references at the on-disk files (which already follow the
   `<quest>-<beat>-<speaker>.mp3` convention, like q2–q4), reconcile any
   line/beat mismatches against the current script, and replace the silent
   catch with a logged fallback.
4. **Asset-existence test:** a vitest walks every adventure's audio/image
   constant maps and fails when a referenced file is missing from `public/`.
   This class of bug becomes unshippable, permanently.
5. **Ergonomics:** brush/strap micro-interactions get a pulsing affordance, a
   hint after two failed attempts, and a button alternative (live capture
   showed the strap pull was undiscoverable).

**Acceptance:** full chapter playthrough desktop + 375px; finale visibly
resolves the opening problem; audio audible in every scene; asset test green;
canonical 7-step rhythm present in all four quests.

### Phase 2 — Protect the Night Run benchmark

1. **Trail Meet model/render agreement** (confirmed bug: verdict tested on a
   zero-width segment while an 11px stroke + 19px glow is drawn): compute the
   verdict on the same geometry the child sees, and clip the rendered trail
   to the modeled segment.
2. **"Extend the trace" beat** (required by the coverage audit, missing):
   when trails stop short on screen, the child extends both lines to test
   "would they ever meet?" — the boundary case becomes the lesson instead of
   a contradiction.
3. **Remove the false climax:** no "chapter complete" celebration at Q4 of 8.
   One celebration, at Q8. Q4 gains a closing skit whose final beat opens Q5.

**Acceptance:** shallow-angle trails judged consistently with the picture;
Q4→Q5 handoff plays as one continuous story; regression tests for the
intersection geometry.

### Phase 3 — Night Run Q5–8 world-native rebuild (Approach A)

The maths returns to the rooftop; diagram panels appear only as brief overlay
bridges before notation. All four quests get voiced opening/closing skits on
the shared scene engine.

- **Q5 Zigzag Lights:** the child carries one trace through the inside zigzag
  on the real course; corner lights ignite only when actually traced; **both**
  corners required (today one tap of either badge completes the pair); a
  changed-beam transfer ride; alternate **exterior** variant added (coverage
  gap).
- **Q6 Inside Together:** physically join the two same-side inside lights
  into one straight half-turn on the course; the join only engages when the
  segments genuinely align (today the button is always enabled).
- **Q7 Reverse Check:** the child sets one relationship first, then
  ride-tests whether the rails stay parallel — the converse enacted, one
  relationship at a time.
- **Q8 Opening Ride:** the child builds the final eight-light route by
  recognising each relationship in new orientations, then rides the full
  opening lap with Nova (today: two clicks). Real finale + postcard +
  next-world tease.
- Verify **complementary angles** are enacted in Q3's right-angle split;
  close in this phase if absent (contract gap found by pedagogy judge).

**Acceptance:** every Q5–8 completion requires the enacted action; contract
coverage table for the chapter fully green; front-half/back-half experience
indistinguishable in a blind walkthrough.

### Phase 4 — Moonbase physical all the way through

- **Q1:** per-ring slider stepping — the value reads 6 → 60 → 600 with no
  skipped ring; copy unchanged (pedagogy judge: exemplary — never implies the
  digit "grows").
- **Q2 Rebuild the Coordinate:** physical bundling through the coordinate's
  **full magnitude** (today stops at ten-thousands while the coordinate
  reaches crores); ten-at-a-time regrouping visible; digit modules dock into
  place slots.
- **Q3 Two Mission Controls:** the child moves comma-gates across **fixed**
  digits — Indian and international grouping of the same quantity; the route
  display never moves (today the quest is viewing-only).
- **Q4 Catch the Comet:** align digit columns to compare two nearby
  coordinates; choose a rounded aim through the lens; focus to exact; finale
  mints the comet-photo postcard.

**Acceptance:** each quest's main action is manipulation, not observation;
counters reflect real beats; chapter contract fully covered.

### Phase 5 — Cross-cutting experience pass

1. **One scene engine:** generalise the Night Run voiced auto-skit component
   into a shared `QuestStoryScene`; scenes become data (speaker, line, audio,
   pose/prop state per beat). All openings/closings across the three worlds
   migrate to it. Captions, replay, skip, reduced-motion come free with the
   engine. New lines generated via existing TTS scripts.
2. **Delayed concept labels:** quest cards and world pages show each quest's
   one-sentence story promise instead of concept names; formal names appear
   only in post-reveal recaps and the journal. Star-map topic stars show
   adventure names, with the school-topic subtitle appearing after
   completion.
3. **Honest counters:** every beat counter reflects the real number of steps
   (Moonbase/Balance 1/4-style counters fixed).
4. **Come-back loop (owner-selected, curiosity-only — no streaks):**
   - Finale cliffhanger tease beat in every closing skit.
   - Postcard journal: the dead `finaleCopy` data becomes a real, replayable
     collection minted at each world finale.
   - Star-reveal cadence: finishing a session brightens the next 1–2 locked
     stars with playful silhouettes/teasers.
5. **App-voice sweep:** "steer the learner" → "steer your rider"; "Event 5" →
   the quest's name; wrong a11y labels fixed (e.g. "Parallel Glide story
   scene" on Trail Meet); jargon grep across UI strings.
6. **Story-lint upgrades:** enforce dialogue budget (≤ 10 words per line
   target), opening beat counts (≤ 6), every quest has opening + closing +
   one-sentence promise, and every closing feeds the next opening.

**Acceptance:** one scene system in the codebase; no concept label visible
before its reveal anywhere in the journey; all counters honest; come-back
loop live in all three finales; story-lint green.

## Architecture notes

- **Scene data over scene code:** `QuestStoryScene` consumes per-quest arrays
  of beats; per-world components stop owning skit logic. Poses/props are
  state changes on layered 2D sprites (per the 07-29 panel's "layered scene
  choreography" trade-off, not videos).
- **Audio convention:** `public/audio/<world>/<quest>-<beat>-<speaker>.mp3`;
  the asset-existence vitest is the single source of enforcement.
- **Save compatibility:** interaction changes bump each adventure's
  `storyVersion`; sanitizers in `grade-seven-progress.ts` map old saves
  forward. An old save never breaks and never loses completed quests; a saved
  mid-quest step that no longer exists resumes at that quest's nearest rest
  point. Unit-tested per adventure.
- **Teaser copy:** each quest's one-sentence promise lives beside its beat
  data and doubles as the card teaser — one source for both the simplicity
  gate and the delayed-label rule.

## Testing and release gates

Per phase: vitest suite (including new story-lint and asset-existence tests) +
live browser walkthrough at desktop and 375×812 + reduced-motion check +
canonical 7-step rhythm checklist per touched quest.

After Phase 5: a fresh three-judge re-score on the same five-dimension rubric
against the 2026-08-02 baseline, then a real session with the target child
before any new world is built.

## Decisions log (this session)

| Decision | Choice |
|---|---|
| Design scope | One phased spec, panel's order |
| Q5–8 / Moonbase rebuild depth | **Approach A — world-native** |
| Come-back mechanics | Cliffhanger teases + postcard journal + star-reveal cadence; **no streaks** |
| Integer ×/÷ coverage hole | Deferred to its own premise hunt |
| Canonical scene system | Voiced auto-skit engine everywhere |

## Follow-ups (out of scope, must not be forgotten)

1. **Integer ×/÷ chapter premise hunt** through the natural-fit gate
   (current textbook II-2 second half is unassigned — real coverage hole).
2. Scope B doc actions from the panel: replace *Moonbase Supply Launch* and
   *Component Crew* premises; restructure *Power Stack Station* (nine
   one-rule quests = sag risk).
3. Build-next world decision (judges split: Glowtails/Deep-Sea/Habitat vs
   Invention Workshop/Festival Makers/Clockwork) — owner call after the
   polish ships.
4. Balance Lab counter fixes if not naturally absorbed by Phase 5.
