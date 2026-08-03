# Judge 1 — Child Engagement and Developmental Fit (ages 11–13)

**Panel:** 2026-08-02 · Working-tree review (uncommitted changes included)
**Evidence:** source files cited as `file:line`; live evidence cited as capture-log lines
(`docs/qa/story-panel-2026-08-02/capture-log.md`).
**Lens:** does a Grade 7 kid who dislikes studying *want* the next moment — and can she
explain the maths afterwards?

---

## 1. Scores

All scores 0–10. A chapter is scored end to end, not by its best quest.

| Dimension | Night Run (8 quests) | Mountain Rescue (4 quests) | Moonbase Tenfold (4 quests) |
|---|---:|---:|---:|
| 1. Kid's perspective and interest, moment to moment | **7** | **6** | **4** |
| 2. Interest across the journey (no mid-chapter sag) | **5** | **5** | **4** |
| 3. Come-back pull at session end | **5** | **3** | **4** |
| 4. Maths logic understood *through* the story | **7** | **8** | **5** |
| 5. Complete concept coverage in actual quest actions | **5** | **8** | **6** |
| **Overall** | **5.8** | **6.0** | **4.6** |

Reading the table: Night Run Q1–4 remains the best play in the app (would score 8+ alone)
but its own back half and a false finale drag the chapter. Mountain teaches integers
better than anything else here yet throws away its ending. Moonbase was rebuilt into a
clean concept demo, not yet an adventure.

---

## 2. Findings (ranked)

### CRITICAL

**C1. Mountain Rescue has no ending act — the emotional contract with the kid is never paid.**
The opening makes a promise a kid genuinely cares about: Pip is cold, the shelter is dark
(`mountain-rescue-adventure.tsx:114–158`). The chapter ends at Q4 step 3 with a recap
panel ("The pod's whole route now makes sense"), a replay button, and "Complete Mountain
Rescue →" (`mountain-rescue-adventure.tsx:1849–1876`). No cell docking, no shelter
warming, no Pip uncurling, no aurora — all four are required by the approved spec
(`docs/superpowers/specs/2026-07-29-mountain-rescue-story-redesign.md:328–343`), and the
spec explicitly forbids exactly this ending: "The chapter does not end with only a recap
panel and completion button" (spec:362). For a kid, this is starting a movie and cutting
the last scene. It also removes the single strongest come-back device the world has (the
aurora night payoff). Flagged Critical by the 07-29 panel; still open.

**C2. Mountain pod continuity is still broken — the story contradicts itself mid-chapter.**
Q1 ends with the pod brushed out, strap-pulled, and flagged "Recovered pod at minus four"
(`mountain-rescue-adventure.tsx:594`). Q3 then starts the pod free-drifting from **−2**
and blows it to **+1** (`:1952–1953`, `:1543–1545`, gust math `:1470–1498`). Q4's opening
declares "the pod is still trapped at minus four" (`:197–201`) and resets it to −4
(`:1966`). Q2 likewise drives the pod up and down checkpoints from −5 to +6
(`:1229–1231`, `:1280–1285`). An 11–13-year-old absolutely notices a rescued object
teleporting; it teaches her that the story is set dressing, which is precisely the
"worksheet in a costume" feeling this product exists to avoid. The 07-29 panel's Critical
change #2 (Q3 should move an empty hook/beacon, not the pod) was not implemented — only
the Q4 card copy was updated (capture-log:86–88, 118–122).

**C3. Night Run declares "CHAPTER COMPLETE" at the halfway point.**
After Q4 the kid sees "LINES AND ANGLES · CHAPTER COMPLETE — Four quests. One connected
line world." plus a reward card and "Light the Lines & Angles star →"
(`skatepark-adventure.tsx:2177–2188`) — leftover from the 4-quest era. Four quests
remain. A kid reads this as "I finished"; everything after it feels like being kept after
class. This single copy block does more damage to journey pull (dimension 2) than any
other line in the app.

**C4. Night Run Q5–8 are diagram-widget activities with degenerate interactions.**
Confirmed in source, matching capture-log:63–80:
- Q5 "match the zigzag pair": *either* corner badge alone sets `zigzagMatched: true` on
  first tap (`skatepark-adventure.tsx:2502–2503`). There is no pairing act at all — the
  advertised discovery is one tap.
- Q6: "Join both lights into a straight sweep" button is always enabled; the slider is
  optional decoration (`:2528`).
- Q7 is the only extension with a real success condition (slider to ±1°, `:2542`).
- Q8, the chapter finale, is two buttons: "Connect the eight-light course" → "Ride the
  opening route" (`:2557–2563`). The kid builds nothing; pattern chips are static text.
Characters sit as tiny `aria-hidden` decoration outside the board (`:2492–2496`), riders
become 🛹 emoji (`:2504`, `:2538`, `:2554`). The full storyboard for real versions of
these quests already exists (`2026-07-29-nova-night-run-complete-storyboard.md:432–645`)
— this is unimplemented design, not undesigned.

**C5. Night Run coverage gaps: four storyboard concepts never occur in any quest action.**
The storyboard's coverage table assigns: alternate **exterior** angles (Q5, G7-LA-14),
converse + constructing a parallel through a point (Q7, G7-LA-16), multi-step
unknown-angle chain (Q8, G7-LA-18), auxiliary parallel line (Q8, G7-LA-19)
(storyboard:102–119), and the Bible assigns complementary angles to Q3 (Bible world 5
table). None exist in `skatepark-adventure.tsx` — `grep` finds no "complementary" and no
"exterior" anywhere in the file. Q3 as built has no right-angle split; Q8 has no
reasoning chain. The quest cards still advertise the full concept list, so the chapter
claims coverage it does not deliver.

### MAJOR

**M1. Formal concept labels appear before and during play, everywhere.**
Quest cards print the formal label pre-play (`skatepark-adventure.tsx:398`,
`mountain-rescue-adventure.tsx:307`, `moonbase-tenfold-adventure.tsx:123`); the star map
shows curriculum unit names and subtopic chips ("Vertically opposite angles") before a
single beat plays (`grade-seven-adventures.tsx:29–36`; capture-log:13–18). Worst: during
Q5–8 the activity header permanently displays the concept ("Alternate interior angles",
`skatepark-adventure.tsx:2489`), and Moonbase's stage header shows the concept during
play (`moonbase-tenfold-adventure.tsx:208`). Through my lens this is doubly damaging:
(a) it spoils the one dopamine moment the rhythm is built around — the *naming* after the
discovery (Q5's reveal chip names the exact phrase already sitting in the header); (b) for
a kid who dislikes study, jargon-first framing is the smell of a textbook. The delayed-
naming inside the activities is otherwise correctly implemented — which makes the labels
pure self-sabotage.

**M2. Mountain Q2–Q4 use exactly the fallback interactions the spec forbids.**
Spec "Explicit removals": "Marker taps alone are not the primary Quest 2 interaction";
"A 'release gust' button alone is not the primary Quest 3 interaction" (spec:359–360).
Implementation: Q2 = tap markers in order (`mountain-rescue-adventure.tsx:1246–1256`);
Q3 = press the one "Release gust" button repeatedly (`:1574–1578`). Q1's four-action
chain (latch → steer → brush → pull) shows the team can do better; the chapter's
engagement decays quest by quest as the interaction budget shrinks.

**M3. Moonbase Q2–Q4 main actions are button presses, card taps, and multiple choice.**
Q2 "Rebuild the Coordinate" is the same button pressed four times
(`moonbase-tenfold-adventure.tsx:262–267`), after which the 8-digit coordinate
6,42,38,510 simply appears — the bundling never composes it (`:271`). Q3 is
tap-two-cards-then-send (`:291–299`) — the regrouping is watched, not performed (the
07-29 redesign asked for movable comma gates). Q4 is two multiple-choice screens plus two
confirm buttons (`:319–341`); the wrong-answer nudges are good ("At the lakh place, 42 is
lower than 43", `:326`) but choosing an answer is the benchmark's named anti-pattern. Q1's
zoom-ring slider is the only world-native action in the chapter — and it is genuinely
good (same digit, value ×10 per ring, `:220–246`).

**M4. No forward-looking come-back hook exists anywhere in the app.**
What exists is retrospective and works well: resume strip with exact position
(capture-log:22–25), journal replay (`page.tsx:609`), per-move save. What does not exist:
any session-end "tomorrow" beat, any finale → next-world tease, any Atlas curiosity card.
The Night Run storyboard *designed* the hook — Nova: "Opening lap tomorrow?" with a child
reply choice (storyboard:632–633) — and it was not built; the implemented ending is
"+25 Lumina coins" (`skatepark-adventure.tsx:2566`, `continuous-adventure-ui.tsx:65`).
Mountain ends into the quest map; Moonbase's dome-photo finale (the best payoff of the
three, `moonbase-tenfold-adventure.tsx:357–371`) never becomes the Bible's "Atlas
postcard" and teases nothing. Dimension 3 is the owner's explicit priority; today it is
carried entirely by "your save is safe", which is a reason it's *possible* to return, not
a reason to *want* to.

**M5. Two scene systems make the journey feel like it downgrades mid-chapter.**
Voiced auto-playing skits with "is speaking" status (NR Q1–4:
`skatepark-adventure.tsx:642–821`, `2194–2386`) versus silent click-through "Next line →"
static panels (NR Q5–8 `:2453–2481`; Moonbase `moonbase-tenfold-adventure.tsx:136–179`;
Mountain openings click-per-line with auto-voice `mountain-rescue-adventure.tsx:648–802`).
Capture-log:146–150 confirms the felt difference. A kid experiences production value as a
promise; when beats 5–8 get cheaper, she concludes the good part is over.

**M6. Avatar/rider art confusion — the kid can't find herself in the scene.**
Q5's opening shows what reads as two near-identical rider girls (capture-log:68–70).
Cause: extension openings cast `heroAsset(avatar)` (hero-girl-active) beside
`rider-skateboard-v2` (`skatepark-adventure.tsx:2459–2463`), two visually similar girl
designs. Meanwhile the voiced scenes hardcode `hero-skateboard-v2.png` regardless of the
chosen avatar (`:748–755`, `:2329–2336`) — so the kid's chosen identity appears in some
scenes and not others. Personalisation is one of the app's strongest hooks
(capture-log:151–153); inconsistency here reads as "which one is me?" — a glitch, not
twins.

**M7. Mountain Q1 ergonomics and object-identity slips.**
The adult tester could not discover the strap pull without inspecting the DOM
(capture-log:114–117); it is a small 4-click button that appears only after 100% snow
clearing (`mountain-rescue-adventure.tsx:617–623`, `pullPod :1021–1028`), with no hint
after failed attempts. And the Q1 instruction says "Move the **pod** from +3…" while the
kid is steering the *sled* toward the pod (`:1124`) — the story's central object identity
blurs at the exact moment of the main action. On a phone, with a kid, this is a stall-out
risk in the first five minutes of the world.

### MINOR

**m1. Q1 trail boundary bug — picture and maths disagree.** Strict segment intersection
(`voice-story-audition.tsx:77–95`) vs an 11px stroke with 19px glow (`:165–181`): a
near-miss looks crossed on screen but verdicts "didn't meet" (capture-log:44–49). For the
one quest whose whole point is "did the lines meet?", the world must never disagree with
the maths.

**m2. Internal jargon leaks.** Resume strip says "Event 5 is waiting" (`page.tsx:633`);
journal cards say "EVENT N" (`page.tsx:609`); intro panel says "steer **the learner**"
(capture-log:37). Kids don't have "events"; Nova doesn't call her friend "the learner".

**m3. Moonbase step counter misleads.** Header shows `questStep + 1`/4
(`moonbase-tenfold-adventure.tsx:209`) but Q1–Q3 jump questStep 0 → 3 (`:240`, `:266`,
`:299`), so the kid sees "1/4" for the whole activity, then "4/4". This is the exact
07-29 complaint, resurfaced in the rebuilt world.

**m4. Moonbase zoom slider can jump rings** (6 → 600 skipping 60; capture-log:141–144);
the range input has no per-ring stepping animation/beat, so the "ten times each step"
story can be skipped by a fast thumb.

**m5. Star map labels are curriculum units** ("Integers", "Simple Equations") rather than
adventure names (capture-log:14–18; `grade-seven-adventures.tsx:29–36`), against the
Bible's Atlas rule ("Children see adventures, not labels", Bible §1, §3).

---

## 3. Doc review — the 17 planned worlds (Scope B)

### Worst risks through the kid-engagement lens

1. **Power Stack Station (World 17) — highest sag risk in the map.** Nine quests, each
   "one exponent law" on the same stack prop (Bible:1456–1468). Quests 3–8 are the same
   join/remove/count interaction with a different rule name — the definition of "same
   screen, different numbers" the anti-worksheet gate rejects. A study-averse kid will
   clock this as a chapterised textbook by quest 4. Split or interleave with story turns
   before storyboarding.
2. **Moonbase Supply Launch (sequel, Bible:446–466) — "long division in space crates."**
   Five quests mapping 1:1 to add/subtract/multiply/divide/estimate on image-tile
   bundles. The story reason ("archive launch") is thin over pure operation drill; this is
   the premise most likely to make the kid say "this is just sums." Needs a real fantasy
   verb per quest or a replaced premise (concepts stay).
3. **Component Crew (Invention Workshop sequel, Bible:629–649).** Terms, coefficients,
   like/unlike terms as "module carts" — the Bible itself warns "do not reduce … to
   sorting cards" (Bible:1944–1945). As drafted, the child sorts carts. Highest
   abstraction-without-fantasy risk of the sequels.
4. **Twin Bridge Test (Bible:892–911).** Six quests = five congruence criteria + one
   property, each "lock these parts, close the triangle." Same-action repetition risk ≈
   Power Stack. The SSS/SAS/ASA/RHS parade is curriculum-shaped, not story-shaped.
5. **Smart Shopper Night Market + Lantern Ledger (Bible:1207–1289).** Market haggling can
   work, but "build a supply plan within resource tokens" and P/R/T interest strips read
   as adult admin chores. This is where "maths class smell" most easily returns for a kid
   who dislikes studying; the Lantern Ledger simulator especially needs its booth to feel
   like a game stall, not a ledger.
6. **Clockwork Carnival (Bible:469–517) — babyish risk at the top of the age band.** A
   wind-up drummer bowing into a confetti cart skews 8–10. Since the current curriculum
   route makes this the next Part-I chapter after Moonbase, it needs an art/tone age-up
   (night-carnival machinery, not toy parade) before build.
7. **Opening formula repetition.** Roughly 10 of 20 world openings are "a thing is
   broken/malfunctioning" (Night Run, Clockwork, Deep-Sea, Cipher, Triangle, Power Stack,
   Mirror Gallery, Foldspace, Orbit Rail, Harmony). The Bible's own rule — "'It broke
   again' cannot become the formula" (Bible §2) — is already trending toward violation.
   The strongest openings in the doc are the non-broken ones (Habitat's "Excellent fence.
   Tiny dance floor."; Chance Harbor's all-three-went-left; Smart Shopper's two signs).
8. **Location fatigue:** Triangle Trail hosts 4 chapters and Foldspace 4 chapters in one
   setting each. Sequels reuse art efficiently, but a kid returning to the same canyon a
   fourth time needs a visible reason the place changed.

### Top 3 planned worlds to build next (kid-pull ranking)

1. **The Vanishing Glowtails (World 12).** Animal mystery + detective evidence loop is
   the strongest premise in the Atlas for this exact kid: a creature search where *her*
   graph changes the route, with a designed wrong-guess-by-Nova she gets to correct
   (07-29 panel guide, README:114). Genuine story stakes without pressure; data handling
   is naturally causal here. One warning: compress the 8-quest middle (range/mean/median,
   Q4–Q7) into fewer, more physical beats or it will sag exactly like Night Run's back
   half.
2. **Deep-Sea Research (World 3).** Exploration fantasy with the best sensory payoff in
   the doc (the bloom lights the sea); one pod, one display, glowfish guide. Decimal
   place value is causally load-bearing (7.4 m vs 7.04 m sends you to different windows —
   a kid can feel that). Strong middle because each quest changes the dive, not the
   worksheet.
3. **Habitat Architect (World 16).** "Build a base for creatures" is Minecraft-adjacent
   and the opening (fence fits, dance floor tiny) creates the perimeter/area distinction
   as a *felt* surprise before any label. Reshaping a fixed fence and watching area tiles
   change is real play. Note: earlier-NCERT mapping; if the school route must stay on
   Ganita Prakash Part I, swap in **Lumen City Patterns** (light creatures + spiral
   growth, strong pull, current I-6) as the third build instead.

Honorable mention: **Cipher Couriers** as the optional puzzle side-quest ("I can deliver
snacks across a galaxy. I cannot deliver to a triangle." is the funniest line in the
Bible) — perfect as a between-chapters treat, not a mainline build.

---

## 4. Verdicts

| Chapter | Verdict | Required work through this lens |
|---|---|---|
| **Night Run Q1–4** | **KEEP AS IS** (spot-polish) | Remove the Q4 "CHAPTER COMPLETE" false finale (C3); fix Q1 boundary bug (m1); unify avatar art usage (M6). |
| **Night Run Q5–8** | **POLISH (deep rebuild of interactions, story premise stays)** | Implement the existing storyboard: real pairing action in Q5 (+ alternate exterior beat), gated join in Q6, parallel-through-a-point in Q7, the 65°→115° reasoning chain and the "Opening lap tomorrow?" ending in Q8 (C4, C5, M4). Upgrade openings to the voiced skit system (M5). |
| **Mountain Rescue** | **POLISH (Q1 is the keeper; Q2–4 + finale to spec)** | Build the ending act (cell docks, shelter warms, Pip, aurora) — non-negotiable (C1). Fix pod continuity: Q2 relights beacons, Q3 moves hook/cable, only Q4 moves the pod (C2). Replace marker-tap/gust-button-only interactions per spec (M2). Strap-pull affordance + "sled vs pod" copy (M7). |
| **Moonbase Tenfold** | **POLISH (Q1 keep; Q2–4 rebuild interactions; premise stays)** | Blink/comet premise and Q1 zoom rings are worth keeping. Q2 must physically compose the coordinate the kid later sends; Q3 needs draggable comma gates; Q4 needs an aiming/act alternative to MCQ (M3). Fix counters (m3), slider stepping (m4), give Blink a face. Turn the dome photo into the Atlas postcard and a next-world tease (M4). |
| **App shell (hub/resume/finales)** | **POLISH** | Hide concept labels until after each quest's reveal (M1); rename stars to adventure names (m5); replace "Event N" jargon (m2); add one forward hook at every chapter end (M4). |

No REPLACE STORY verdicts in Scope A: all three premises are natural fits and the kids'
reasons-to-care (opening night, Pip, Blink) are sound. The failures are execution depth
and endings, not premise. In Scope B, the premises I would replace before storyboarding
are **Moonbase Supply Launch** and **Component Crew** (concepts stay, premises go), with
**Power Stack Station** restructured rather than replaced.
