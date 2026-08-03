# Judge 3 — Interactive Narrative & Game UX

Panel of 2026-08-02 · Working-tree review (uncommitted changes included) ·
Evidence: live capture log (`capture-log.md`) + full source read. All paths
relative to repo root; line numbers are from the current working tree.

Prime directive applied: stories are replaceable, the experience and learning
are not. No premise below needs replacing; several experiences do not yet
deserve their premise.

---

## 1. Scores

Dimensions: (1) kid's perspective and interest, (2) interest across the
journey, (3) come-back pull, (4) maths logic understood through the story,
(5) complete chapter concept coverage. 0–10, discriminating.

| Experience | 1 Kid | 2 Journey | 3 Come-back | 4 Maths bridge | 5 Coverage | Mean |
|---|---:|---:|---:|---:|---:|---:|
| Night Run Q1–Q4 | 8.0 | 7.5 | 6.0 | 8.0 | 8.5 | **7.6** |
| Night Run Q5–Q8 | 5.0 | 4.5 | 4.0 | 5.5 | 4.0 | **4.6** |
| Mountain Rescue (4 quests) | 7.0 | 5.5 | 5.5 | 7.5 | 7.5 | **6.6** |
| Moonbase Tenfold (4 quests) | 5.5 | 5.0 | 4.5 | 6.5 | 5.5 | **5.4** |
| Balance Lab (source-only, no live capture) | 6.0 | 6.0 | 5.0 | 7.0 | 7.0 | **6.2** |
| Hub / onboarding / star map | 6.5 | 6.0 | 5.5 | — | — | **6.0** |

Reading: Night Run Q1–Q4 remains the reference and has *improved* (voiced
closings, in-activity voiced reactions, real transfer beats). The chapter's
back half is a different, much weaker product. Mountain's maths staging is
strong but its story machinery (audio, continuity, finale) is broken.
Moonbase's Quest 1 is the best single new interaction in the working tree;
Quests 2–4 regress to buttons and multiple choice.

---

## 2. Findings (ranked)

### CRITICAL

**C1 — Mountain Q1 voice is silently dead: the 17 missing `q1-v3` files from the 07-29 panel are STILL missing, and there is still no asset-existence check.**
- `src/components/mountain-rescue-adventure.tsx:42-58` references
  `q1-v3-opening-01-nova.mp3` … `q1-v3-handoff-nova.mp3` (17 files).
- `public/audio/mountain-rescue/` contains 29 files, none prefixed `q1-v3`
  (the generator `scripts/generate_qwen3_mountain_signal_story.py:12,27-114`
  writes `q1-opening-*` / `q1-stage-*` names that the component never loads).
- Verified by direct existence check: all 17 referenced Q1 paths are absent;
  every Q2–Q4 path exists.
- Failure is invisible because `audio.play().catch(() => undefined)`
  (`mountain-rescue-adventure.tsx:1898`) swallows errors — which is why the
  capture log reported "no console errors" and wrongly assumed the blocker
  was resolved. Q1 (the chapter's emotional anchor, 8 opening beats + every
  "Hear line" chip) plays silent while Q2–Q4 speak. No test in
  `src/lib/*.test.ts` or `src/components/*.test.*` checks audio existence
  (grep: zero `existsSync`/`readdirSync` in tests). Panel 07-29 critical
  change #3 is unfixed.
- Contrast: Balance Lab does this correctly with a
  `BALANCE_AUDIO_READY = false` gate (`balance-lab-adventure.tsx:28-32`).

**C2 — Mountain has no ending act; Quest 4 ends with the pod back at −4 and a recap card.**
- The approved spec is explicit
  (`docs/superpowers/specs/2026-07-29-mountain-rescue-story-redesign.md:300-343`):
  lower an *empty* hook, attach, lift to +2, then the enacted payoff — cell
  docked, heaters glow, Pip jumps up, aurora revealed. Its "Explicit
  removals" section (`:354-362`) forbids ending "with only a recap panel and
  completion button".
- Implementation (`mountain-rescue-adventure.tsx:1664-1880`): questStep 0
  lifts the pod −4→+2, questStep 1 **lowers it back to −4** to demonstrate
  the inverse, questStep 3 shows "MOUNTAIN FINALE" text + a route replay +
  "Complete Mountain Rescue →". No cell handoff, no warm shelter, no Pip, no
  aurora — the problem acted in the opening (cold shelter, curled fox,
  `:130-137`) is never visibly resolved. Benchmarks §1 "Ending act" fails;
  panel 07-29 change #2's finale requirement fails.

**C3 — Night Run declares itself finished at Quest 4 of 8.**
- Q4's closing skit ends `RIDER: "Night Run complete!"`
  (`skatepark-adventure.tsx:207-211`) and the closing continue button reads
  "See the Night Run finale →" (`:2374-2375`, beam variant `:795-805`), after
  which `markQuestComplete("crossing-beam")` (`:3098-3100`) drops the child
  into Quest 5's opening ("The beam made a secret Z…"). A false ending at the
  midpoint kills the handoff rule (each closing beat must *feed* the next
  opening) exactly where the chapter changes to its weaker scene system —
  worst possible place to sag. Also stale: Q2's finale card still says "The
  chapter star lights after all four rooftop quests" (`:3398`) in an
  eight-quest chapter.

**C4 — Trail Meet: picture and maths disagree at the boundary (capture log's observed bug, root cause confirmed).**
- Crossing is computed only on the modeled segment
  (`voice-story-audition.tsx:77-96`), but the trail renders with an 11px
  stroke + 19px glow shadow (`:155-194`, drawn `:194`), and Nova's line is
  equally thick. A shallow drag ending just short of `y = 0.48` *looks*
  crossed (two 30px-wide glow bands overlap) while Nova says "Our trails
  didn't meet this time" (`:588-591`). For the quest whose entire concept is
  "two straight paths meet at one point or not," the brightest object on
  screen contradicts the verdict. Fix options: extend the modeled line to the
  drawn ray, or clip the glow at the endpoint and place an explicit endpoint
  cap, or snap "near-miss" endpoints away from the line before verdict.

### MAJOR

**M1 — Night Run Q5–Q8 interactions do not exercise their promised concepts.**
- Q5 Zigzag Lights: *both* corner buttons set the same flag — tapping either
  single corner instantly lights the pair (`skatepark-adventure.tsx:2502-2503`);
  the child never identifies the partner corner (compare the correct
  armed→matched two-step in Q2 `:2801-2818` and Q4 `:2049-2074`). The Bible's
  Q5 also promises alternate *exterior* angles — absent entirely.
- Q6 Inside Together: "Join both lights into a straight sweep" is an
  always-enabled button that asserts 180° regardless of slider state
  (`:2528`); the child performs no joining.
- Q8 Opening Ride: "Connect the eight-light course" is one button (`:2560`),
  then one launch button. The Bible's Q8 contract — *recognise* the five
  relationships in new orientations — is never exercised. Coverage dimension
  for the chapter's second half is 4/10 because the interactions cannot
  produce evidence of understanding.
- None of Q5–Q8 has a closing skit or any voice; openings are silent 3-beat
  click-throughs (`:2404-2481`). This is precisely the "simpler popup
  pattern" the 07-29 panel said not to copy.

**M2 — Mountain continuity still contradicts itself (07-29 change #2 only partially applied).**
- Q1 copy: "Recover the pod →" (`mountain-rescue-adventure.tsx:1141`),
  "RECOVER THE REAL POD… 100% recovered" (`:1149-1155`), aria "Recovered pod
  at minus four" (`:594`), mission "…recover the shelter's energy cell"
  (`:92`). Q4 opening: "the pod is still trapped at minus four!" (`:200`).
- Q3 still moves *the pod* through the storm (spec said empty winch
  hook/beacon), starting from an unexplained −2 and finishing at +1
  (`:1543-1544`, `:1952-1953`) — then Q4 resets it to −4 (`:1966`).
- Spec "Explicit removals" violated three ways: the child drags the pod
  during the search ("Drag the real pod down the cliff", `:1125,1789`); the
  "Release gust" button *is* Q3's sole interaction (`:1574-1578`); Q2's
  primary interaction is marker taps (`:1237-1256`).

**M3 — Moonbase rebuilt in Quest 1 only; Quests 2–4 are buttons and multiple choice (07-29 change #4 partial).**
- Q1 zoom rings are genuinely the Bible's framing enacted ("SAME DIGIT 6 /
  VALUE NOW 600", `moonbase-tenfold-adventure.tsx:218-251`) — best new
  interaction in the tree. But:
- Q2 "bundle" is one button pressed four times (`:261-264`); the ten-unit
  swarm is decoration; nothing is grouped or docked by the child.
- Q3 is two tap-to-reveal cards + a confirm button (`:290-302`) — no comma
  gates moved.
- Q4 is a two-choice compare, a three-choice rounding quiz, and two aim
  buttons (`:315-355`). The feedback lines are excellent ("At the lakh place,
  42 is lower than 43") but a slider/MCQ cannot be the main learning action
  (Bible §2 child agency; anti-worksheet gate).
- Misleading counter regression (07-29 must-have #8): header shows
  `{questStep + 1}/4` (`:209`) while Q1–Q3 jump questStep 0→3 in one click
  (`:240,266,299`) — the child sees "1/4" for the whole quest, then "4/4".
- The whole chapter is silent — no audio keys exist at all (grep: zero audio
  refs in the component).

**M4 — Come-back machinery is thinner than it looks.**
- `finaleCopy` (the six "Comet captured!/Pod safe!" ending cards) is dead
  code — defined at `grade-seven-adventures.tsx:61-68`, rendered nowhere
  (only imported by `story-lint.test.ts`). Chapter completion jumps straight
  to the star map (`page.tsx:529-545`) with no postcard, no "next
  destination" tease, no session-end hook of any kind.
- Streaks never fire for Grade 7: `recordDailyQuest` is called only in the
  generic quiz `answer()` path (`page.tsx:278-280`); `finishGradeSevenAdventure`
  never records a day, and the 🔥 streak chip renders only on the non-Grade-7
  quest shell (`page.tsx:657`).
- Journal is stale versus the 8-quest chapter:
  `gradeSevenEventTitles.skatepark` still lists the legacy five Q1–Q2 scenes
  (`grade-seven-progress.ts:261`), and replay seeding
  `createGradeSevenState("skatepark", event)` (`:500-564`) can only recreate
  Trail Meet / Crossing Rails states — Quests 3–8 are unreachable from the
  journal (map "Review quest →" covers them, journal does not).
- Bible's Atlas promises (2–3 lit destinations, postcards, regions) vs
  built: 16 stars shown at once, labeled by curriculum unit
  (`constellation-map.tsx:30,34`), star detail `h2` = topic
  (`page.tsx:598`), journal tabs = topic (`page.tsx:608`). The Atlas rule
  "children see adventures, not labels" fails at every navigation surface.

**M5 — Formal concept labels appear before play everywhere (07-29 must-have #7 fails).**
- Quest cards print the concept line pre-play: `skatepark-adventure.tsx:398`
  ("Opposite angles · linear pairs" etc.), `:2489` (extension header),
  `mountain-rescue-adventure.tsx:307`, `moonbase-tenfold-adventure.tsx:123,208`,
  plus subtopic chips on the star detail (`page.tsx:598`). In-scene reveals
  are correctly late (e.g. `skatepark-adventure.tsx:3285-3289` "After the
  match: maths calls them vertically opposite angles"), so the fix is purely
  editorial: swap card concept lines for story teasers and reveal the formal
  chip on completion.

**M6 — Two interaction-critical Mountain controls have no CSS at all, and the brush has no keyboard path.**
- `.signal-recovery-strap` (`mountain-rescue-adventure.tsx:618`) and
  `.signal-brush-zone` (`:606`) match zero rules in `world.css`/`globals.css`
  (grep confirms). They render as default unstyled buttons inside a heavily
  art-directed stage — the capture log's "could not discover the strap
  without DOM inspection" is fully explained. The brush wires only
  `onPointerDown`/`onPointerMove` (`:607-610`) with no `onClick`, so keyboard
  Enter does nothing: the step is keyboard-inaccessible. (Strap has
  `onClick` and works; both need visible affordance, hint-after-idle, and
  ≥44px targets.)

### MINOR

**m1 — App-voice and jargon leaks.**
- "Watch Nova. Then steer **the learner**." (`voice-story-audition.tsx:804`);
  a11y label "Parallel Glide story scene" while playing Trail Meet
  (`:652-653`) and HUD fallback title "Parallel Glide" (`:671`);
  "the learner" inside child-facing aria strings
  (`skatepark-adventure.tsx:602,989-992`).
- "Event N" leaks: "YOUR STORY WAITS AT EVENT 5" (`page.tsx:598`), "Event 5
  is waiting exactly where you left it" (`page.tsx:633`), journal "EVENT N"
  (`page.tsx:609`), "Replay from event 1 →" (`page.tsx:598`). Children should
  see scene/quest names, never internal event indices.

**m2 — Stale/legacy content traps.**
- `adventurePlayScripts.skatepark` still tells the retired 60°-ramp/triangle
  story (`adventure-play.tsx:73-85`) — currently unused for skatepark
  (`grade-seven-adventures.tsx:91` excludes it) but one refactor away from
  resurfacing a contradicting premise; the Bible forbids triangle content in
  Night Run.
- `WorldHud` hard-codes "SCENE N OF 5" (`continuous-adventure-ui.tsx:7`) for
  the legacy shop/cricket flows.
- `public/audio/night-run/` (6 mp3s) is referenced by nothing in `src/` or
  `scripts/` — orphaned assets.

**m3 — 375 px risk areas (no live mobile capture; from CSS).**
- Night Run corner hotspots use a fixed 72px radius from a hand-tuned layer
  (`skatepark-adventure.tsx:2394-2402`; `.night-run-hotspots` top:190px
  height:340px, `world.css:4902-4909`, mobile override `:5400-5405`) while
  the canvas scales rails to `min(width*0.43, 210)` — two different
  reference geometries; corner badges can drift off the drawn angles at
  narrow widths. Hotspot size 52px is fine.
- Mountain stage keeps `min-height: 620px` at mobile (`world.css:2927`) with
  the unstyled brush/strap floating in it (see M6) — highest mobile risk in
  the tree.
- Moonbase mobile is properly covered (`world.css:660-698` collapses all
  grids to one column, hides side casts). Skatepark map/extension have
  dedicated ≤600px and ≤760px blocks (`world.css:5022+`, `:7730-7750`).
  Reduced-motion coverage is broad (30 media queries, all major animations
  guarded).

**m4 — Moonbase zoom slider can jump multiple rings in one drag (capture log 6→600).** `input type="range" min=0 max=5` (`moonbase-tenfold-adventure.tsx:227-237`)
allows skipping the "60" reading; per-ring stepped announcement (aria-live of
each intermediate value, or snap-with-tick) would keep the tenfold story
audible one step at a time.

**m5 — Night Run rest points.** With eight quests auto-chaining
(`markQuestComplete` opens the next quest directly, `skatepark-adventure.tsx:2820-2903`),
there is no designed rest beat after Q4 (the Bible requires a resumable rest
point every 2–3 quests in long chapters). Ironically C3's false ending shows
where the intended rest point should be — make Q4's closing an honest
mid-season finale ("Half the roof is lit…") that returns to the quest map
with a next-quest tease.

---

## 3. Regression checklist vs 07-29 panel

| # | 07-29 critical/must-have | Status | Evidence |
|---|---|---|---|
| 1 | Canonical 7-step quest rhythm per quest | **PARTIAL** | Night Run Q1–Q4 pass fully (acted incident, request, real change, visible reaction, late naming, transfer, closing handoff). Night Run Q5–Q8 fail steps 1, 4, 7 (static openings, widget-only consequence, no closings; `skatepark-adventure.tsx:2404-2570`). Mountain passes 1–6, fails 7 (no closing acts) and the chapter payoff. Moonbase passes 5–6 loosely, fails 1, 3 (button/MCQ actions), 7. |
| 2 | Mountain continuity (Q1 locate/secure vs Q4 lift) | **PARTIAL → FAIL in copy** | Q4 card/opening updated ("Lift the pod from −4 to +2", "still trapped", `:110,200`), but Q1 still recovers ("Recover the pod →" `:1141`, aria `:594`), Q3 still drifts the pod −2→+1 (`:1543-1544`), Q4 resets to −4 and *ends* there (`:1707-1716`). See C2/M2. |
| 3 | Mountain voice assets + automated asset check | **FAIL** | All 17 `q1-v3` files missing (C1); no asset-existence test anywhere in the repo. Capture log's "resolved" note was wrong — errors are swallowed. |
| 4 | Moonbase rebuilt as physical place-value play across ALL 4 quests | **PARTIAL (1 of 4)** | Q1 genuinely physical (zoom rings). Q2 button-press bundling, Q3 tap-to-reveal, Q4 quiz (M3). |
| 5 | Characters react inside the play space | **PARTIAL** | Night Run Q1–Q4: yes — state-driven dialogue beside the play area with voice (`skatepark-adventure.tsx:2617-2703`), sled team rides the Mountain cliff. Night Run Q5–Q8 and Moonbase: cast are `aria-hidden` sticker rows outside the widget (`:2492-2496`; `moonbase:212-216`). |
| 6 | Every quest has a closing skit whose final beat feeds the next opening | **PARTIAL** | Night Run Q2→Q3→Q4 exemplary ("Next course?", "Course four is waiting!"); Q4's closing is a false chapter ending (C3); Q5–Q8 none. Mountain: none (next opening restates a fresh incident). Moonbase: handoff exists only as button copy ("Send it to Mission Control →"). |
| 7 | Formal labels hidden until consequence | **FAIL** | Concept lines on every quest card and stage header pre-play (M5). In-scene ordering is correct. |
| 8 | Progress counters show real beats | **PARTIAL** | Night Run Q2 "N OF 4" accurate; quest map "N OF 8 QUESTS" accurate. Moonbase and Balance headers show `questStep+1/4` that jumps 1/4→4/4 (`moonbase:209`, `balance-lab-adventure.tsx:415`) — the exact misleading pattern the panel flagged. |
| 9 | Changed-transfer attempt required before completion | **PARTIAL** | Night Run Q1 (ride again optional), Q2 step-4 transfer required, Q3/Q4 transfer required; Q5 optional, Q6/Q8 absent. Mountain Q1 flags, Q3 changed storm, Q4 reverse — required. Moonbase Q1–Q3 absent; Q4's estimate→exact loosely counts. |

---

## 4. Scene-system map (quest → system)

Systems observed in source:
- **A — Voiced auto-skit**: audio per beat, auto-advance, "Play with
  sound/captions", "X is speaking" status, beat dots, Skip. Engines:
  `StraightTrailScene` (timed `say()` script), `NightRunStoryPlay`,
  `SkateQuestStoryPlay`.
- **B — Click-through static scene**: "Next line →" button, beat dots, no
  auto-advance. Variants: **B+v** auto-*attempts* one voice line per beat
  with "Hear line" replay (Mountain, Balance-gated); **B-silent** no audio
  (Night Run extensions, Moonbase).
- **C — Legacy modal play**: `AdventurePlay` dialog, click-through, no audio
  (shop, cricket only).

| Quest | Opening | In-activity dialogue | Closing |
|---|---|---|---|
| NR Q1 Trail Meet | A (StraightTrailScene, ~35s) | A (voiced verdicts) | none (result card) |
| NR Q2 Crossing Rails | A (6 beats) | A (voiced + "Hear that again") | A (4 beats) |
| NR Q3 Never Meet | A (5 beats) | A | A (4 beats) |
| NR Q4 Same Corner Lights | A (5 beats) | A | A (4 beats, false chapter ending) |
| NR Q5–Q7 | B-silent (3 beats) | text only | none (reveal chip) |
| NR Q8 Opening Ride | B-silent (3 beats) | text only | finale card |
| Mountain Q1 | B+v, 8 beats — **voice 404s (C1)** | B+v (404s) | none |
| Mountain Q2–Q4 | B+v (3 beats, working) | B+v (working) | none; Q4 recap card |
| Moonbase Q1–Q4 | B-silent (3 beats) | text only | "Nova notices" card; Q4 finale card |
| Balance Q1–Q4 | B+v gated off (`BALANCE_AUDIO_READY=false`) | B+v gated | recap cards |
| Shop / Cricket | C | legacy 5-scene HUD | C |

**Recommendation: System A is the canonical scene engine.** It is the only
one that satisfies the Bible's dialogue rules (performed beside the speaker,
audio + captions, replay, skip) and it already exists as a reusable pair of
components. Concretely: (1) port Mountain and Moonbase openings/closings onto
`SkateQuestStoryPlay` (it already accepts arbitrary beat arrays + variant
labels); (2) keep B as the *reduced-motion / muted* rendering of A, not as a
separate authoring path; (3) retire C with the shop/cricket rebuilds. One
engine also makes C1-class asset drift impossible to miss, since all beats
declare `audio:` paths in one shape that a single lint test can verify
against `public/audio` (add that test — it is ~15 lines and would have
caught C1 twice now).

---

## 5. Doc review — planned stories (Bible world contracts + specs)

Read: Bible §§5–6 (20 worlds, 38 chapters), `INTERACTIVE-STORY-BENCHMARKS.md`,
all seven files in `docs/superpowers/specs/`.

### 5.1 Worksheets in disguise (interaction storyboards where the "action" is symbol-manipulation with no world consequence)

- **Component Crew (Invention Workshop sequel), Q1/Q4** — "split the
  expression into signed module carts", "close one/two/three-term boards" is
  card sorting wearing a projector costume; the Bible itself warns about this
  chapter (§13 non-blocking checks). Gate it on: every cart merge must move a
  *beam* the child is trying to aim, and term-count labels appear only after
  a board runs.
- **Harmony Gardens · Rhythm Rings Q4** — "place minimum shared prime powers
  in a green HCF lane and maximum in a purple LCM lane" is lane-sorting;
  the ring flash is downstream reward, not intrinsic consequence. Redesign so
  choosing a wrong power visibly desyncs a running ring *while it runs*.
- **Smart Shopper Q1 "Slice the Hundred"** — partitioning an abstract strip
  into 100 groups with three linked notations is the worksheet the Bible's
  own decision table said to avoid; anchor the strip to a physical light
  strip the stall keeper is actually cutting.
- **Balance Lab Q1 "Rule Card or Lock?"** — compare-two-cards classification
  with no beam movement. (The *built* Balance Q1 wisely replaced this with
  loading real pans — keep the built version, update the Bible.)
- **Power Stack Q2 "Compress the Label"** — folding notation is the act;
  make the station's lift visibly stall until the short label fits the
  display, otherwise it is a rewriting exercise.
- Healthy counter-examples worth copying: Clockwork Carnival (grouping
  executes as a *performance*), Habitat Architect (fence/tiles), Glowtails
  Q3 (tokens → table → bars grow from the same tokens), Foldspace Tiling
  Gate (construction marks stay on the gate being tiled).

### 5.2 "It broke" openings vs the Bible's own variety rule (§2)

Openings that are a malfunction/broken/missing part: Clockwork (torn
ribbon), Deep-Sea (display lost markers), Night Run (crossing loses
pattern), Moonbase (slipped digit), Cipher Couriers (symbols replaced
digits), Mirror Gallery (broken reflection), Foldspace (smudged guide),
Power Stack (flattened labels), Orbit Rail (map glitch), Glowtails
(scrambled board) — **10 of 20 worlds**. Good variety exists elsewhere
(Chance Harbor's surprising natural run, Habitat's fence-fits-but-no-room,
Harmony's tile-leaves-a-strip, Balance's Nova-pulls-wrong-weight, Smart
Shopper's competing signs). The rule "'It broke again' cannot become the
formula" is currently unmet at catalogue level. Cheapest fixes: Deep-Sea →
the glowfish *leads* them deeper than the display can say (discovery);
Mirror Gallery → a new artwork *arrives* half-finished (something to
create); Orbit Rail → three tickets for one party trying to meet
(character request).

### 5.3 Missing rest points in long chapters

Bible §2 requires a resumable rest point every 2–3 quests in chapters with
>3 quests, but **no world contract marks one**. Highest risk: **Power Stack
Station (9 quests)** — needs two designed rest beats or a split; Glowtails
(8), Festival Makers (6), Twin Bridge Test (6), Round Garden (6), Tiling
Gate (6), and all five-quest sequels. Night Run (built, 8) demonstrates the
cost: auto-chaining with no rest beat produced the false-finale hack (C3).
Each storyboard package (Bible §8 item 10) should name its rest-point beats
explicitly.

### 5.4 Three planned chapters most production-ready (interaction lens)

1. **Balance Lab (World 11)** — engine already exists in the tree
   (`balance-lab-adventure.tsx`, storyVersion 2, four connected quests,
   audio gating done right); pan-loading is direct manipulation with
   intrinsic consequence (beam tilts); transfer + model-fading quest (Q5)
   already specified; misconception list concrete. Needs only the Q1
   card-compare swap (5.1) and the finale act.
2. **Festival Makers (World 9)** — every quest's action is cut/overlay/fit
   on one visible master ribbon with an intrinsic world consequence (canopy
   regions light); measurement-vs-partitive division staged as two different
   *story questions*; child-controlled ending (choose the colour sequence)
   is the Bible's best specified payoff. Maps cleanly onto existing
   drag + slider + tap idioms; length/area models are cheap assets.
3. **Chance Harbor (World 13)** — four quests, one reusable prop
   (transparent wheel + bot fleet), one interaction loop
   (predict → launch many → living frequency display), low asset budget,
   explicit anti-misconception finale ("order surprising, pattern faithful").
   Easiest chapter to bring to Night Run parity per unit of build effort.

Runners-up: Harmony Gardens · Mosaic Makers (gap/overlap consequence is
self-explaining) and Habitat Architect. Triangle Trail is conceptually ready
but hinge/compass constructions are the highest interaction-engineering cost
in the catalogue — do it after the scene engine consolidation, not during.

---

## 6. Verdicts

| Chapter | Verdict | Required work (if POLISH) |
|---|---|---|
| **Night Run Q1–Q4** | **KEEP AS IS** (with named polish) | Fix C4 boundary glow; fix C3 false-ending copy (make Q4 an honest mid-chapter rest point); m1 a11y label "Parallel Glide"/"steer the learner"; stale "all four rooftop quests" (`:3398`). |
| **Night Run Q5–Q8** | **POLISH (heavy)** — story premise correct, interactions rebuilt to Q1–Q4 parity | Two-step corner matching in Q5 + alternate exterior; Q6 must require the partner angle to be *made*, not asserted; Q8 becomes a real build-and-recognise ride; voiced openings/closings on the A engine; closing handoffs Q5→Q8. |
| **Mountain Rescue** | **POLISH** — premise approved and strong; implementation must catch up to its own spec | C1 audio + asset lint; C2 enacted finale (cell, heater, Pip, aurora) and Q4 re-ordered to empty-hook-down → lift; M2 continuity copy (Q1 "secure", not "recover"); M6 style + keyboard for brush/strap; Q2/Q3 primary interactions per spec removals. |
| **Moonbase Tenfold** | **POLISH** — keep Q1 exactly; rebuild Q2–Q3 actions, de-quiz Q4 | Q2: child drags/docks real bundles; Q3: child moves comma gates on the fixed digit strip; Q4: keep compare/estimate but let the choice steer the telescope visibly before confirmation; real beat counters; add voice on the A engine. |
| **Balance Lab** | **POLISH** (source-only review) | Ship or keep-gate audio (pattern is correct); real beat counters (`:415`); finale act beyond crate-open card; align Bible Q1 with the better built Q1. |
| **Hub / star map / journal** | **POLISH** | Adventure names (not curriculum units) on stars, detail, journal tabs; kill "Event N" wording; wire `finaleCopy`-class postcards into chapter completion + next-destination tease; record streaks on adventure progress; journal entries per quest for 8-quest chapters. |

No REPLACE STORY verdicts: every premise passes the child-first gate. The
gap everywhere is the same — the back halves and endings do not yet honour
what the openings promise, and the connective tissue (voice, closings,
postcards, honest counters) is where the "experience and learning" mandate
is currently being spent down.
