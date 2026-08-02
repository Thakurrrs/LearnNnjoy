# Judge 2 — Grade 7 Mathematics Pedagogy — 2026-08-02

**Lens:** NCERT *Ganita Prakash* Parts I–II (current), earlier NCERT Class 7 (compatibility).
**Basis:** full source review of the working tree plus the shared capture log
(`docs/qa/story-panel-2026-08-02/capture-log.md`). All line references are to the
current working-tree files. Read-only review; no source was modified.

---

## 1. Scores

| Experience | 1. Kid perspective & interest | 2. Interest across journey | 3. Come-back pull | 4. Maths logic through story | 5. Concept coverage vs contract | Mean |
|---|---:|---:|---:|---:|---:|---:|
| Night Run Q1–4 (trail-meet → crossing-beam) | 8.0 | 7.5 | 7.0 | 7.5 | 7.0 | 7.4 |
| Night Run Q5–8 (zigzag → opening-ride) | 5.0 | 4.5 | 6.0 | 3.5 | 4.0 | 4.6 |
| Night Run — whole chapter | 7.0 | 6.0 | 7.0 | 6.0 | 5.5 | 6.3 |
| Mountain Rescue | 7.5 | 7.0 | 6.0 | 7.0 | 6.5 | 6.8 |
| Moonbase Tenfold (rebuilt) | 6.0 | 5.0 | 5.5 | 5.5 | 5.0 | 5.4 |

Dimension 3 is capped at 7 everywhere: resume/exact-restore is excellent
(capture log §Onboarding 3–4), but no experience has a session-end hook, a
"tomorrow" tease, or a scheduled retrieval echo (grep for retrieval/echo across
`src/lib` and `src/components` returns nothing).

---

## 2. Findings (ranked)

### CRITICAL

**C1 — Trail Meet boundary bug CONFIRMED: the model is a zero-width ideal segment, the render is an 11 px glowing band.**
- Model: `src/components/voice-story-audition.tsx:77-96` — `findPathIntersection`
  tests the child's two-point segment `[START_POINT, endpoint]` against the
  ideal line `y = 0.48` (`NOVA_LINE_Y`, line 48). Endpoint is clamped to
  `x∈[0.08,0.9], y∈[0.34,0.78]` (lines 507-510), so the x-window test at line 92
  never rejects; the only "didn't meet" case is an endpoint that stops short of
  `y = 0.48`.
- Render: `voice-story-audition.tsx:155-181` — both trails draw with
  `lineWidth 11`, `lineCap "round"` (extends the painted stroke ≈5.5 px past the
  modeled endpoint) and `shadowBlur 19` glow; Nova's cyan line (183-192) is the
  same thickness. Any endpoint within ~1 stroke-width below the line renders as
  visually crossing while the verdict at 580-591 says "Cool route! Our trails
  didn't meet this time."
- This violates the Bible's hard rule "World motion and mathematical motion
  agree" (Bible §2 Visual learning) exactly as the capture log reported
  (capture-log.md lines 44-49).
- **Pedagogy escalation:** the verdict sentence is only true for *segments*. Two
  non-parallel straight *lines* always meet. The coverage audit already flagged
  this and required an "extend both traces, observe one meeting point at most"
  beat (`GRADE-7-FIRST-THREE-STORY-COVERAGE-AUDIT.md:84`, status Partial). It is
  not implemented. A child who draws a shallow tilted trail is told the paths
  "didn't meet" — seeding the misconception that tilted lines can simply fail to
  meet. Fix both together: compare within the drawn window honestly (touching
  bands = met) AND add the dotted extension beat before the verdict.

**C2 — Q5 Zigzag Lights: alternate interior angles are asserted, not enacted, and the marked corners detach from the geometry.**
- Both corner buttons set the same flag on any single tap:
  `skatepark-adventure.tsx:2502-2503` — tapping A alone (or B alone) sets
  `zigzagMatched: true`. There is no pair-selection, no possible informative
  mismatch, no measurement or overlay demonstrating equality.
- The corner badges are at fixed CSS positions (`src/app/world.css:7643-7644`,
  `top:31%; left:42%` / `bottom:31%; right:39%`) while the beam rotates with
  `--beam-angle` (world.css:7627). Turn the slider and the "angles" no longer
  sit at the crossings — the same model/visual disagreement class as C1.
- The reveal copy claims a transfer that may not have happened: line 2507 shows
  "The beam changed, but the alternate inside openings still match" after riding
  the Z even if the child never touched the slider. Changing the beam is
  optional; completion (2509-2512) requires only tap + ride.
- Contrast: Quest 4's canvas does this *right* — wedges at computed
  intersections `xUpper/xLower` spanning the same angle
  (`skatepark-adventure.tsx:1596-1666`). Q5 is a step backwards from the
  chapter's own reference implementation.

**C3 — Q8 Opening Ride: the chapter's transfer quest contains zero mathematics.**
- `skatepark-adventure.tsx:2549-2570`: the entire quest is one button
  ("Connect the eight-light course") that wakes all eight lights, then a second
  button to ride. The four relationships appear only as text chips (2559). No
  recognition in new orientations, no angle-chain reasoning, no auxiliary line —
  all three of the audit's required beats for Q8 (audit lines 102-104) are
  absent. The Bible contract for Q8 ("Recognise adjacent, complementary,
  supplementary, opposite, and transversal relationships in new orientations")
  is unmet; the Bench­marks gate 2 ("a `Next` button cannot be the main learning
  action") is directly violated. The chapter currently ends without any
  evidence the child can use the pattern.

**C4 — Mountain continuity contradiction persists in Q1 (the 07-29 fix was applied to Q4 only).**
- Q1 still recovers the pod: mission "Steer the rescue sled below Base Camp and
  **recover** the shelter's energy cell" (`mountain-rescue-adventure.tsx:92`);
  CTA "Recover the pod →" (1141); aria-label "Recovered pod at minus four"
  (594); `podRecovered` set by the strap pull (1022-1027).
- Q4 then opens "Signal found—but the pod is **still trapped** at minus four!"
  (200) and its card says "Lift the pod from −4 to the safe ledge at +2" (110).
- The 07-29 panel's continuity redesign (README §Critical 2: Q1 locate/secure
  only; Q4 lowers the empty hook, attaches, lifts) is half-applied: Q4 was
  rebuilt as the winch quest, Q1's copy and state names were not changed.

**C5 — Mountain has no ending act; the last enacted move un-rescues the pod.**
- Q4's required sequence is lift −4→+2, then reverse +2→−4 to prove the inverse
  (`mountain-rescue-adventure.tsx:1693-1717`, dialogue 1740 "Down six returned
  us to minus four"). The chapter then closes from a recap panel (1849-1876)
  whose dialogue *promises* "the rescue team can bring the pod home" (1745).
  The pod is never docked; there is no shelter warming, no Pip reaction, no
  aurora — all four are mandated by the Bible (World 10: "The finale must show
  the energy cell returning, the shelter warming, Pip uncurling, and the aurora
  appearing"). Pedagogically this also inverts the story-causality of the
  inverse concept: the mathematically correct inverse demo is staged as the
  *final* physical action, so "subtraction undoes addition" is experienced as
  "we undid the rescue." The 07-29 order (empty hook down = −6 with nothing
  attached, then pod up = +6 last) teaches the same inverse with the story and
  the maths pointing the same way.

### MAJOR

**M1 — Q6 Inside Together collapses co-interior angles into a linear pair.**
`skatepark-adventure.tsx:2517-2532`: the widget is a single-vertex
"straight-angle-meter" showing `x°` and `180−x°` on one dial; there are no
rails and no transversal on screen, and the partner angle is hard-coded as
`180 − insideAngle` (2522). Two problems: (a) co-interior angles live at two
different vertices — showing them as one straight sweep at one vertex teaches
the *linear pair* again (Quest 2's concept), not "same-side interior angles
between parallel lines"; the translation that legitimises joining them is never
shown; (b) because the supplement is computed by construction, the child cannot
discover that the relationship *depends on the rails being parallel* — the one
fact that makes this a theorem. A kid asked "why 180?" can only answer "the
meter said so."

**M2 — Q7 Reverse Check: direction-infidelity in the angle readout.**
`skatepark-adventure.tsx:2537`: the corresponding corner displays
`62 + Math.abs(reverseRailAngle)` — rotating the rail in *either* direction
increases the shown angle. Physically, one direction should read 62−θ. A child
probing the slider sees the world respond non-monotonically to their action
(model/visual agreement rule). The quest's core sequence is otherwise sound
(match the corresponding corner → test the ride; measurement beats the optical
illusion — this implements the audit's requested illusion beat, line 104). The
audit's "construct a parallel through a marked point" action (line 97, Missing)
is still absent.

**M3 — Night Run contract/coverage gaps (verified by grep: 0 hits for
"exterior", 0 for "complementary" in `skatepark-adventure.tsx`).**
- Alternate **exterior** angles (Bible Q5 contract; audit line 99): missing.
- **Complementary** angles via splitting the right angle (Bible Q3 contract
  "split one right-angle light into two pieces"; audit line 101): the built Q3
  steps are Keep the Gap / Move Apart / Square Exit / Turn the Course
  (`skatepark-adventure.tsx:1077-1082`) — the split beat was dropped.
- The word "supplementary" is never introduced (linear pair is enacted and
  "adds to 180°" named at 3288-3290 — good — but the earlier-NCERT term is
  absent).
- Parallel arrow-mark notation micro-beat (audit line 92): absent. The
  perpendicular square mark is present and named (1431-1432 — good).

**M4 — Moonbase telescope: the zoom CAN skip rings; the reveal claims a
per-step ×10 the child may never see.** `moonbase-tenfold-adventure.tsx:227-237`
is a plain `<input type="range" min=0 max=5>`; clicking the track jumps
directly (capture log observed 6 → 600 with no 60). The reveal (246) says
"its value became ten times greater **at every step**" — enacted only if the
child happens to drag through each ring. Per-ring stepping (or step buttons
with the intermediate value announced) is required by the concept: "one place
left is ten times" is a claim about *adjacent* places.
**Forbidden framing check: PASS.** No copy implies the digit grows; the reveal
explicitly negates it ("The six did not grow… Its place changed", 246), matching
the Bible learning gate ("Never say the digit grew").

**M5 — Moonbase Q2/Q3 assert instead of enact; the built action does not build
the shown number.**
- Q2: composing is four identical button presses ("Bundle ten into one … →",
  `moonbase-tenfold-adventure.tsx:261-269`); bundling stops at ten-thousands
  (`bundleLevel < 4`, labels from `PLACE_LABELS` capped at index 4) while the
  docked coordinate 6,42,38,510 reaches **crores** (271, 277). The child's
  action constructs at most a 1-lakh bundle; the 8-digit number then just
  appears. Decomposition and the audit-required non-standard decomposition
  (audit line 239) are absent.
- Q3: the child taps two cards to *view* the two groupings (291-296) and one
  button to "send" (299). Nothing is manipulated; the 07-29 rebuild spec
  ("move comma gates/group separators while digits stay fixed") is not
  implemented. The maths shown is correct — 6,42,38,510 = 6 crore 42 lakh
  38 thousand 510 = 64,238,510 = 64 million 238 thousand 510 — and Blink's line
  "Both displays mean the same number" (306) lands the right idea, but the
  child produced no evidence.

**M6 — Evidence-of-understanding is inconsistent; no retrieval echo exists
anywhere.** Required changed-context attempts before completion: Mountain Q3 has
a genuine gate (`TRANSFER_GUSTS` −3/+4 must complete: 1439-1601 — the best
transfer in the app); Night Run Q2 step 4 (new crossing, 3255-3275), Q3 step 3
(turn the whole course) and Q4 step 3 (sweep the beam, `beamTransferred`
required, 1749-1755) are real. But: Q5's transfer is optional (C2), Q6/Q7 have
none, Q8 is empty (C3), Mountain Q1/Q2/Q4 have none (Q1's "Mark the shelter and
pod" at 1162 is labelling, not a changed context), and Moonbase has none in any
quest. No later-session retrieval echo is scheduled in code (Bible §7 requires
at least one per world in a *later session*).

**M7 — Formal concept labels are shown before play in all three worlds**, on
every quest card: `skatepark-adventure.tsx:265-307` ("Alternate interior
angles", "Converse · prove lines parallel"…), `mountain-rescue-adventure.tsx:
91-110`, `moonbase-tenfold-adventure.tsx:34-53`, and pre-play in stage headers
(moonbase 208). This inverts the Bible's reveal rhythm (name arrives at step 6,
after consequence) and ignores the 07-29 must-have "Hide formal concept labels
until the child has seen the consequence." The star map likewise shows
curriculum-unit names (capture log, Cross-cutting).

**M8 — Integer subtraction is only enacted as "subtract a positive, go down."**
Q4 shows `−4 + 6 = +2` / `+2 − 6 = −4` (1838-1842) — a correct and well-timed
inverse proof — but subtracting a *negative* never occurs, and the
`a − b = a + (−b)` bridge (audit line 159) is absent. Combined with "Down six
subtracts six" (1836), the chapter leaves "subtraction always makes smaller"
untouched — a listed contract misconception. "Negative means bad" is likewise
never probed (the pod being "trapped" below zero mildly reinforces it), and the
below-zero-beyond-vertical transfer has no home in this chapter (see D3).

### MINOR

**m1 — Moonbase step counter misleads:** header shows `questStep + 1`/4
(`moonbase-tenfold-adventure.tsx:209`) but Q1–Q3 use only steps 0 and 3, so the
display jumps 1/4 → 4/4 — the exact "misleading counter" complaint from 07-29.
**m2 — Q4/Q5 concept overlap:** Quest 4's step 2 already traces and *names*
"alternate interior angles" (`skatepark-adventure.tsx:2095-2096, 2141`), so
Quest 5 re-teaches the same relationship with a weaker widget instead of adding
alternate exterior (its contract job).
**m3 — Mountain Q1 strap discoverability** (capture log 114-117): press-hold on
a small element with no hint; a stuck child gets no mismatch information.
**m4 — Moonbase Q4 compare is answer-selection**, though the mismatch feedback
is properly place-based ("The crore places match. At the lakh place, 42 is
lower than 43", 326) and the rounding nudge is correct place-value reasoning
(343). The "more digits = larger" misconception is unaddressed (both trails
have 8 digits). Rounding is tested at a single place value (audit line 245
asked for more than one).
**m5 — Q1 a11y group label says "Parallel Glide story scene"** while the quest
is Trail Meet (`voice-story-audition.tsx:653`) — audition-component reuse
leaking app voice into the adventure.

---

## 3. Concept-coverage audit

### 3.1 Nova's Night Run — vs Bible World 5 contract + Ganita Prakash I-5 / earlier Lines & Angles

| Contract item | Quest | Status | Evidence |
|---|---|---|---|
| Straight paths meet at one point or stay separate | Q1 Trail Meet | **Partial — buggy at boundary** | C1; segment-vs-line beat missing (audit:84) |
| Two lines ⇒ four angles; all four move together | Q2 step 1 | **Covered** | wedge geometry `skatepark-adventure.tsx:501-511` |
| Vertically opposite angles equal | Q2 step 2 | **Covered (enacted)** | congruent opposite wedges 512-520; named after match 3285-3287 |
| Linear pair = straight angle 180° | Q2 step 3 | **Covered (enacted)** | either adjacent choice completes π, 521-534; named 3288-3290 |
| Changed-crossing transfer | Q2 step 4 | **Covered** | 3255-3275 |
| Parallel lines stay apart (gap preserved) | Q3 steps 0-1 | **Covered** | equal-gap markers 896-918; ride test required |
| Perpendicular = square 90° corner | Q3 step 2 | **Covered** | 919-926; square mark named 1431-1432 |
| Complementary angles (split the right angle) | Q3 (contract) | **MISSING** | 0 grep hits; step dropped from 1077-1082 |
| Parallel/perpendicular notation marks | Q3 | **Partial** | square mark yes; arrow marks no |
| Transversal creates two angle groups | Q4 step 0 | **Covered** | "It crossed both—two meeting points!" 1770 |
| Corresponding angles equal | Q4 step 1 | **Covered (enacted)** | computed wedges 1659-1662 |
| Alternate interior equal | Q4 step 2 + Q5 | **Covered in Q4; Q5 defective** | 1663-1666 vs C2 |
| Alternate exterior | Q5 (contract) | **MISSING** | 0 grep hits |
| Same-side interior supplementary | Q6 | **Partial — misrepresented** | M1 |
| Converse proves parallel | Q7 | **Covered with defect** | M2 |
| Construct parallel through a point | Q7 (audit) | **MISSING** | audit:97 |
| Unknown-angle chains; auxiliary line; new orientations | Q8 | **MISSING** | C3 |
| "Supplementary"/"adjacent" formal terms (earlier NCERT) | Q2/Q6 | **Partial** | enacted, never named |

### 3.2 Mountain Rescue — vs Bible World 10 contract + Ganita Prakash II-2 (first half) / earlier Integers

| Contract item | Quest | Status | Evidence |
|---|---|---|---|
| Positive / zero / negative positions; zero as reference | Q1 | **Covered** | cliff levels +3…−4; reveal after action 1147-1160 |
| Number-line equivalence of the route | Q1 | **Covered** | `MountainRouteStage` vertical strip 908, 942 |
| Compare integers (higher/greater) | Q2 step 0 | **Covered** | +2 vs −3, 1237-1292 |
| Order several integers incl. two negatives | Q2 step 1-3 | **Covered** | route −5→−1→+2→+6, 1205, 1396 |
| Integer addition as directed change | Q3 | **Covered** | gusts +5/−4/+2, 1434-1438 |
| Changed-context transfer before completion | Q3 | **Covered (best in app)** | TRANSFER_GUSTS gate 1439-1601 |
| Additive inverse; opposite moves return to start | Q4 | **Covered** | −4+6=+2 / +2−6=−4, 1838-1842 |
| Subtracting a negative; a−b = a+(−b) | Q4 (audit:159) | **MISSING** | M8 |
| Negative ≠ bad misconception probe | — | **MISSING** | M8 |
| Below-zero transfer beyond vertical context | — | **MISSING / homeless** | assigned to rejected sequel; see D3 |
| Integer ×/÷, sign rules, properties (II-2 second half) | Separate on purpose | **UNASSIGNED at Bible level** | D3 |
| Visible ending act (cell docked, Pip, aurora) | Finale | **MISSING** | C5 |

### 3.3 Moonbase Tenfold — vs Bible World 1 contract + Ganita Prakash I-1 / earlier compatibility

| Contract item | Quest | Status | Evidence |
|---|---|---|---|
| Place determines value; one step left = ×10 | Q1 | **Partial** | correct framing (246) but skippable rings (M4); no transfer with a second digit |
| Magnitude sense for lakh/crore (audit:237) | Q1 | **MISSING** | no familiar-quantity comparison |
| Compose a large number from bundles | Q2 | **Partial** | button-chain; bundling stops 3 places short of the built number (M5) |
| Decompose; non-standard decomposition (audit:239) | Q2 | **MISSING** | — |
| Indian naming (lakh/crore) | Q2-Q3 | **Covered** | 277, 292 |
| International naming (million; billions per contract) | Q3 | **Partial** | million only, 295 |
| Same quantity, two grouping systems | Q3 | **Covered (asserted)** | correct numerals; viewing-only action (M5) |
| Compare/order large numbers | Q4 step 0 | **Partial** | one pair compared, place-based nudge 326; no ordering of 3+ |
| Round in context; exact vs estimate | Q4 steps 1-2 | **Partial** | correct nearest-lakh logic 331-343; single place value; aim/focus contrast is nice |
| Misconception: more digits ⇒ larger | — | **MISSING** | m4 |
| Changed-context transfer in any quest | — | **MISSING** | M6 |
| Scientific form | — | **Separate on purpose** | correctly deferred to Star Scale Beacon |

### 3.4 Balance Lab (brief; outside mandated Scope A, modified in tree)

The model helper is faithful: `src/lib/grade-seven-worlds.ts:8-15` removes the
same count from both pans (`5−r` / `12−r`, mystery 7), and the quest ladder
(equality-as-balance → fairness test → isolate crate → transfer lock,
`balance-lab-adventure.tsx:74-92`) matches the Bible contract including the
expression/equation distinction and a Q4 transfer. Not scored; a full pass
should verify the "unfair move" mismatch is informative and that the pan model
is never stretched to negatives (per contract exclusion).

---

## 4. Doc review — remaining planned stories (Scope B)

Read: Bible worlds 2–4, 6–9, 11–20 + sequels; specs in `docs/superpowers/specs/`;
coverage audit; benchmarks.

**D1 — Manipulation fidelity: mostly strong, four watch-items.**
The contracts are unusually careful about model honesty (Lookout Mast and Round
Garden label rearrangements "intuitive evidence, not proof"; Power Stack bans
height-as-exponent metaphor; Deep-Sea bans "the point moves by itself";
Clockwork explicitly teaches equal-precedence left-to-right instead of a PEMDAS
chant; Supply Lift's negative multiplier is timeline-rewind, never "negative
groups"). Watch-items where the central manipulation could drift into
unfaithfulness at build time: (a) **Component Crew** — "carts affecting the same
beam" is a functional metaphor for like terms; unlike terms must visibly affect
*different* beams for every input or the child will infer like-ness from
adjacency (the Bible itself flags the sorting-cards risk); (b) **Gridlight
Control** Q2 "express the relationship to the shared sum" needs a concrete
representation of `centre = S/3` that the grid can actually show; (c) **Chance
Harbor** Q3 must let short runs visibly deviate (the contract says so — hold the
line in implementation); (d) **Balance Lab** contract correctly forbids negative
coefficients on pans — the Finding-the-Unknown chapter (II-7) will eventually
need equations the pan cannot host; the "non-balance equation representation"
in Q5 is the right fade and should not be cut.

**D2 — Prerequisite ordering: two real gaps.**
(a) **Balance Lab is built and reachable, but its stated prerequisite —
Invention Workshop's variable idea — is not built.** The child meets the
"mystery crate" unknown without ever meeting a letter-number that *varies*. The
Bible's own split rationale (Mystery Machine → variable vs unknown need
different mental models) is currently violated in the shipped sequence.
(b) **Cargo Scale Route Q1 depends on Harmony Gardens factors** — correctly
stated in the contract; the Atlas mapping must enforce it. Colour-Mix Exchange
before Smart Shopper is correctly specified. Night Run → Triangle Trail →
Foldspace ordering is sound.

**D3 — Coverage vs Ganita Prakash I–II: one hole, one pending decision.**
The 20-world map covers I-1…I-8 and II-1…II-7 except:
- **Integer multiplication/division and operation properties (II-2, second
  half) are UNASSIGNED.** Supply Lift Timeline and Network Route Rules are
  natural-fit **rejected** (Bible World 10 sequels), preserved only as
  checklists. This is the largest live curriculum gap: a child following the
  current-textbook route hits II-2 with only half the chapter owned. The
  timeline model itself was judged mathematically defensible (audit §4) — the
  *premise*, not the maths, was rejected. Re-homing this (e.g., inside an
  already-loved world with a time-scrubbing mechanic) is the most urgent
  story-design task in the backlog.
- **Moonbase Signal Forge** (efficient ×5/×25/×125 regrouping, product digit
  bounds, assumption-based estimation — explicit I-1 outcomes) is recommended
  by the audit (§5) but not yet accepted into the Bible. Until decided, these
  I-1 outcomes have no owner.
- Alternate exterior angles, complementary split, and the Night Run micro-beats
  are chapter-internal gaps (Section 3.1), not map gaps.

**D4 — Concept-as-decoration risk in planned chapters: low overall.** The
strongest natural fits on paper: Festival Makers (the whole-ribbon constraint
*is* the fraction), Harmony Gardens (no-cut tiling *is* HCF), Habitat Architect
(fixed fence vs floor *is* perimeter/area). Weakest causal necessity as
written: **Two Mission Controls** already demonstrated the failure mode in the
built Moonbase (viewing, not doing) — its planned siblings **Cipher Couriers**
(optional, acceptable) and **Shape Scanner Q3 (shadows)** need the child's
action to *change* the mathematical object, not the camera.

**D5 — Three highest-learning-value chapters to build next:**
1. **The Invention Workshop (I-4)** — it repairs the broken prerequisite under
   the already-shipped Balance Lab (D2a), owns the variable-as-varying-number
   idea that everything algebraic downstream needs, and its "same rule, any
   cell" mechanic is a faithful instantiation with clear misconception probes
   (`3n` vs "thirty-n").
2. **Festival Makers (I-8, earlier Fractions & Decimals)** — fractions are the
   heaviest-weighted and most misconception-dense Grade 7 topic; the contract is
   the strongest of the unbuilt ones (fixed visible whole, part-of-a-part
   overlay, both division meanings with predict-then-measure), and it feeds the
   Orbit Rail and Chance Harbor retrieval chain.
3. **Clockwork Carnival (I-2)** — it is the next chapter in the current
   textbook sequence after Moonbase, is the stated prerequisite of Invention
   Workshop, and its grouped-ribbon mechanic makes expression structure causal
   ("Same pieces. Different groups. Completely different show."). Building it
   completes the Part I spine Moonbase → Clockwork → Invention → Night Run.
   (If the owner will only fund one story-design task in parallel: re-home the
   II-2 integer ×/÷ concepts — D3 — before the school year reaches them.)

---

## 5. Verdicts

| Chapter | Verdict | Required work |
|---|---|---|
| **Night Run Q1–4** | **KEEP AS IS** (one fix) | Fix C1 (honest boundary verdict + extend-the-trace beat). Everything else in Q1–4 is the app's reference quality — the Q2 wedge/Q4 transversal geometry should be the template for all future angle work. |
| **Night Run Q5–8** | **POLISH (deep) — do not replace the premise** | Rebuild Q5 on the Q4 canvas with computed corner positions, true pair selection, and a required beam-change transfer (C2, m2 — give Q5 alternate *exterior* as its new job); redesign Q6 to show both rails + the translated angle before the 180° claim (M1); fix Q7's `abs()` readout and add the parallel-through-a-point rebuild (M2); rebuild Q8 as an angle-chain ride (known corner → child lights each next corner by naming the relationship used) with one auxiliary-line beat (C3). Add the complementary right-angle split into Q3 and the notation micro-beat (M3). |
| **Mountain Rescue** | **POLISH** | Reword Q1 to locate/secure (mission, CTA, aria, state copy — C4); reorder Q4 to hook-down-then-lift-last and build the docking/Pip/aurora ending act (C5); add one subtract-a-negative beat and the `a − b = a + (−b)` bridge (M8); keep Q3's transfer gate as the pattern for other quests. |
| **Moonbase Tenfold** | **POLISH (deep) — premise KEEP** | Q1: enforce per-ring stepping with the intermediate value spoken/shown; add a second-digit transfer (M4). Q2: make bundling reach the places the coordinate actually uses and make composition physical (dock bundles into slots); add one decomposition beat (M5). Q3: implement the comma-gate manipulation from the 07-29 spec (M5). Q4: add one 3-coordinate ordering and a second rounding context (m4). Fix the step counter (m1). The correct place-value framing already achieved in Q1's copy is a real asset — protect it. |
| **Balance Lab** (brief) | **KEEP (pending full review)** | Model is faithful; schedule its own deep review plus the Invention Workshop prerequisite repair (D2a). |
| **Bible world map (Scope B)** | **KEEP with two actions** | Re-home integer ×/÷ + properties (D3); decide Moonbase Signal Forge so I-1's efficient-multiplication outcomes have an owner. |

**Cross-cutting requirements (all worlds):** hide formal concept labels until
after the consequence (M7); make a changed-context attempt a completion gate in
every quest (M6); implement at least one later-session retrieval echo before
the fourth world ships (M6); add a session-end "tomorrow" hook to lift
dimension-3 scores.
