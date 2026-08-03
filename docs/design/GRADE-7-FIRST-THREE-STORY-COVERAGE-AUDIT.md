# LearnNnjoy — First Three Grade 7 Story Coverage Audit

**Status:** Discussion draft; no implementation approval
**Stories:** Nova’s Night Run, Mountain Rescue, Moonbase Tenfold
**Purpose:** Verify every relevant subtopic before deciding whether each story
should be kept, reshaped, split, or replaced

---

## 1. Decision summary

| Story world | Curriculum job | Verdict | Important finding |
|---|---|---|---|
| Nova’s Night Run | Current *Ganita Prakash* Part I, Chapter 5; earlier NCERT Lines and Angles | **Approved** | The eight-quest story and its balance of skating with parked course-building interactions are approved. No new story chapter is required. |
| Mountain Rescue | Current Part II, Chapter 2; earlier NCERT Integers | **Main chapter approved; sequel concepts unassigned** | Signed position, order, addition, and inverse movement fit the mountain. Replay Realm and GlitchGrid are rejected; multiplication, division, and properties remain curriculum checklist items without an approved story. |
| Moonbase Tenfold | Current Part I, Chapter 1; earlier large-number/exponent compatibility links | **Keep the main chapter; add or redesign one sequel** | Place value, naming systems, rounding, and large-number operations fit the moonbase. Efficient factor regrouping and product-size reasoning are not yet properly allocated. |

The three worlds do **not** need to be thrown away. The audit does, however,
find one real architecture decision:

> Should Moonbase gain a focused third chapter for the missing multiplication
> reasoning, taking the Grade 7 plan from 38 to 39 story chapters, or should
> Moonbase Supply Launch be redesigned and made longer?

The recommendation is a focused third chapter. Hiding the missing concepts
inside Supply Launch would save one chapter name but create a more crowded and
less enjoyable experience.

---

## 2. What “covered” means in this audit

Coverage is checked only after a story passes the permanent selection order:

```text
Child fantasy or activity → natural world behaviour
→ mathematical relationship → curriculum mapping
```

No chapter-count target can override this order.

| Status | Meaning |
|---|---|
| **Covered** | A named quest already gives the child an appropriate action, visible consequence, concept reveal, and changed use. |
| **Partial** | The concept is mentioned or implied, but the child does not yet produce enough evidence of understanding. |
| **Missing** | No quest currently owns the concept. |
| **Separate on purpose** | The concept belongs in another mapped story and should not be forced into this one. |

Textbook exercises are not all separate concepts. Repeated calculations,
puzzles, and examples are treated as ways to practise or transfer a concept.
They do not each require their own quest.

The primary references are:

- [NCERT *Ganita Prakash*, Grade 7, Part I, Chapter 1 — Large Numbers
  Around Us](https://ncert.nic.in/textbook/pdf/gegp101.pdf)
- [NCERT *Ganita Prakash*, Grade 7, Part I, Chapter 5 — Parallel and
  Intersecting Lines](https://ncert.nic.in/textbook/pdf/gegp105.pdf)
- [NCERT *Ganita Prakash*, Grade 7, Part II, Chapter 2 — Operations with
  Integers](https://ncert.nic.in/textbook/pdf/gegp202.pdf)
- [NCERT Class 7 exemplar unit list for the earlier textbook
  progression](https://ncert.nic.in/exemplar-problems.php?ln=en)

---

## 3. Nova’s Night Run

### Child-facing promise

> Help Nova repair and open a glowing skate course by riding, moving, and
> testing the track’s straight rails and crossings.

### Why the story fits

The mathematical objects are the story objects. Straight trails, crossed
rails, parallel rails, service crossings, and a transversal can all be moved
and inspected directly. The child does not need to stop skating to answer an
unrelated question.

### Detailed subtopic checklist

| Required subtopic | Planned location | Status | Required adjustment |
|---|---|---|---|
| Line, line segment, intersection point, and the idea that two straight lines cannot intersect twice | Quest 1 — Trail Meet | **Partial** | Briefly distinguish the finite glowing trail segment from the ideal straight line it represents. Let the child extend both traces and observe one meeting point at most. |
| Lines must lie in the same plane before “parallel” applies | Quests 1 and 3 | **Partial** | Use a clear top-down course plane. A raised overhead rail provides a quick non-example: it may not meet the floor rail, but it is not parallel to it in the same plane. |
| Two intersecting lines create four angles | Quest 2 — Crossing Rails | **Covered** | Preserve the current four-corner-light interaction. |
| A linear pair forms a straight angle and totals 180° | Quest 2 | **Covered** | Preserve the child joining neighbouring lights into a visible half-turn before `180°` appears. |
| Vertically opposite angles are equal | Quest 2 | **Covered** | Preserve tracing and overlay. The child must see the fit before hearing the name. |
| Reasoning versus imperfect measurement | Quest 2 | **Partial** | Let thick rails produce a slightly messy protractor reading, then reveal the thin ideal centre lines. Nova explains why the relationship is exact even when a drawing or measurement is not. |
| Perpendicular lines meet at four right angles | Quest 3 — Rails That Never Meet | **Covered** | Keep the square service crossing and show all four right-angle corners. |
| Parallel lines remain non-intersecting in a plane | Quest 3 | **Covered** | Extend the rails visually beyond the screen instead of merely saying that they “look the same.” |
| Parallel and perpendicular notation | Quest 3 | **Missing micro-beat** | After discovery, place matching arrow marks on parallel rails and the square mark at a perpendicular crossing. This is a label, not a separate lesson. |
| Transversal and the eight angles it creates | Quest 4 — Same Corner Lights | **Partial** | Show the beam crossing both rails, briefly count two groups of four corners, and only then name it a transversal. |
| Identify corresponding positions | Quest 4 | **Covered** | Preserve the same-relative-corner tracing. |
| Corresponding angles are equal when lines are parallel | Quest 4 | **Covered** | Keep the visual overlay while the rails are locked parallel. |
| Converse: equal corresponding angles can verify parallel lines | Quest 7 — Reverse Check | **Covered** | Test only one relationship at a time so the child understands what is being used as evidence. |
| Construct a parallel line through a given point | Quest 7 | **Missing action** | Add one physical rebuild: slide a rail through a marked point while preserving the corresponding corner trace. The course opens only when the relationship stays equal. |
| Alternate interior angles are equal | Quest 5 — Zigzag Lights | **Covered** | Make inside/outside location cues clear before colour support fades. |
| Alternate exterior angles | Quest 5 | **Compatibility coverage** | Retain as a later beat, not simultaneously with alternate interior angles. |
| Same-side interior angles are supplementary | Quest 6 — Inside Together | **Covered** | Preserve the straight-half-turn joining action. |
| Adjacent, complementary, and supplementary angles | Quests 2, 3, 6, and 8 | **Covered** | These support the earlier NCERT progression. Keep the terms separated across quests. |
| Determine unknown angles through a chain of relationships | Quest 8 — Opening Ride | **Partial** | Include one short route where a known corner lights the corresponding, opposite, and linear-pair corners in sequence. The child should build the reasoning chain, not choose a number from options. |
| Add an auxiliary parallel line in a changed figure | Quest 8 | **Missing transfer beat** | Let the child draw one temporary glowing guide through a turn in the course, then use it to connect the known angle relationships. |
| Recognise a parallel-line illusion or misleading visual | Quest 7 or 8 | **Missing transfer beat** | Use patterned lighting that makes parallel rails appear tilted. The child verifies them through the angle relation instead of eyesight alone. |

### Revised story structure

No ninth quest is needed. Keep the eight quests but organise them into
recoverable acts:

1. **Act 1 — The crossing:** Trail Meet and Crossing Rails
2. **Act 2 — The parallel course:** Rails That Never Meet and Same Corner
   Lights
3. **Act 3 — The full night run:** Zigzag Lights, Inside Together, Reverse
   Check, and Opening Ride

A satisfying pause/resume moment follows Acts 1 and 2.

### Story decision

**Keep Nova’s Night Run.**

It is the strongest match among the three stories. The required changes are
coverage refinements, not a premise rewrite. The separate skatepark blueprint
that described only four chapter-level quests is now retained only as the
Crossing Rails vertical-slice record. The reconciled plan is in
[Nova’s Night Run Complete
Storyboard](../superpowers/specs/2026-07-29-nova-night-run-complete-storyboard.md).

---

## 4. Mountain Rescue

### Child-facing promise

> Recover the lost energy cell and rebuild the mountain supply route so Pip
> and every shelter can enjoy aurora night.

### Why the story fits—and where it becomes risky

Signed positions relative to Base Camp, ordering altitudes, and directed
movement belong naturally on one mountain route. The main four-quest rescue
therefore fits very well.

Multiplication by a negative integer is more abstract. A “negative number of
crates” or “negative groups” would be false and confusing. The planned
timeline model is mathematically defensible, but it must be prototyped and
explained carefully before the full sequel is approved.

### Detailed subtopic checklist

| Required subtopic | Planned location | Status | Required adjustment |
|---|---|---|---|
| Positive integers, negative integers, and zero as a reference | Main Quest 1 — Chase the Lost Signal | **Covered** | Preserve Base Camp as the stable zero reference. |
| Integer position on a number line | Main Quest 1 | **Covered** | The straight altitude route must remain visually equivalent to a number line. |
| Compare and order integers, including negative integers | Main Quest 2 — Relight the Beacon Chain | **Covered** | Include at least two negative beacons so “closer to zero is greater” becomes visible. |
| Integer addition as accumulated directed change | Main Quest 3 — Ride the Storm | **Covered** | Keep the fading movement history and changed gust sequence. |
| Additive inverse and opposite movements | Main Quest 4 — Bring the Power Home | **Partial** | Explicitly pair a movement with its reverse and show that together they return to zero change. |
| Subtraction as adding the additive inverse, including subtracting a negative | Main Quest 4 | **Partial** | The child must reverse both a positive and a negative route instruction. Show `a − b = a + (−b)` only after the action. |
| Multiplier versus multiplicand | Supply Lift Quest 1 | **Covered with wording check** | Keep “change per cycle” separate from “number/direction of cycles.” Do not swap their story meanings casually even though multiplication is later shown commutative. |
| Multiplication by a positive integer as repeated directed change | Supply Lift Quest 2 | **Covered** | Preserve forward cycles and accumulated movement. |
| Multiplication by a negative integer through pattern extension | Supply Lift Quest 3 | **Covered conditionally** | The negative cycle count means looking backward in the log. It never means negative physical groups. This must pass a child explanation test. |
| All four sign combinations for multiplication | Supply Lift Quest 4 | **Covered** | Keep magnitude constant while changing the two sign roles so the sign pattern is what changes. |
| Multiplication by `0`, `1`, and `−1` | Supply Lift Quest 4 and Network Quest 4 | **Partial** | Add zero cycles, one unchanged run, and one direction-reversing run. Make `−1 × a = −a` visible. |
| Product of several integers and the effect of an even/odd count of negative factors | Supply Lift Quest 4 | **Missing micro-beat** | Join a short sequence of signed control modules and predict the final direction before it runs. |
| Integer division as inverse multiplication | Supply Lift Quest 6 | **Covered** | Reconstruct a missing signed control from the final change. |
| Division sign rules | Supply Lift Quest 6 | **Covered** | Test same-sign and different-sign cases through inverse multiplication. |
| Division by zero is undefined; the divisor must be non-zero | Supply Lift Quest 6 | **Missing safeguard** | A zero-cycle divisor cannot form equal groups or invert a multiplication. Explain this through the control’s missing inverse, not a generic error message. |
| Multiplication is commutative | Network Quest 1 — Swap the Stops | **Covered** | Keep subtraction and division as physical non-examples. |
| Multiplication is associative | Network Quest 2 — Move the Transfer Point | **Covered** | Regroup the same complete delivery, not different quantities. |
| Distributive property over addition | Network Quest 3 — Split the Convoy | **Covered** | Keep the whole load visible before and after splitting. |
| Additive/multiplicative identities and additive inverse | Network Quest 4 — Empty and Single Runs | **Partial** | Extend the quest to include `a + 0`, `a × 1`, `a × 0`, and the reverse/inverse connection. |
| Closure and operation-specific exceptions | Network Quest 5 | **Covered** | Division supplies a deliberate result that is not an integer. |
| Mixed expressions using integers | Network finale | **Partial** | Let the child assemble and run one route expression containing grouping and more than one operation. Reuse the Clockwork convention rather than reteaching it. |
| Transfer beyond vertical “up means positive/down means negative” | Route Mirror and later Orbit Rail | **Covered** | The signed horizontal route must occur before universalising the rule. |

### Revised story structure

Keep the existing three focused chapters:

1. **Mountain Rescue** — position, order, addition, subtraction, inverse
2. **Supply Lift Timeline** — multiplication and division
3. **Network Route Rules** — properties and mixed reasoning

Required refinements do not need a fourth Mountain chapter. They do require:

- explicit additive-inverse action in the main rescue;
- `0`, `1`, and `−1` cases;
- a short multiple-factor sign pattern;
- the division-by-zero safeguard;
- one mixed-operation transfer;
- natural rest points after every two or three quests.

### Story decision

**Keep the Mountain Rescue main story. Do not continue the two sequel
premises merely because their concepts were allocated there.**

The child-first reassessment leaves multiplication, division, and properties
unassigned. Replay Realm and GlitchGrid were rejected because the child would
first need to learn invented world controls. Existing code and assets remain
untouched.

---

## 5. Moonbase Tenfold

### Child-facing promise

> Repair the moonbase coordinate, reach the right comet, and prepare its huge
> image archive for a safe launch across the research network.

### Why the story fits—and what it currently misses

Navigation coordinates, nested map scales, international mission control,
image archives, satellites, and research stations naturally use large
numbers. The setting is appropriate.

The current main chapter and Supply Launch cover the obvious content: place
value, number names, comparison, rounding, and four operations. The official
chapter also develops less obvious but important reasoning:

- gaining a feel for the magnitude of a large number;
- choosing when an exact value, rounded-up value, or rounded-down value is
  appropriate;
- regrouping factors to calculate products efficiently;
- predicting the possible number of digits in a product;
- making reasonable assumptions and estimates in unfamiliar situations.

Those ideas cannot be treated as optional decoration because several are
explicit sections or summary outcomes of the chapter.

### Detailed subtopic checklist

| Required subtopic | Planned location | Status | Required adjustment |
|---|---|---|---|
| Develop a sense of one lakh and other large magnitudes through familiar comparisons | Main Quest 1 — Wrong Comet | **Partial** | Add a nested zoom comparing a route quantity with a familiar smaller bundle. The child should estimate before the exact count appears. |
| Successive places differ by a factor of ten | Main Quest 1 | **Covered** | Preserve fixed place slots and nested zooms. Never say that the digit itself grows. |
| Compose and decompose numbers in more than one way | Main Quest 2 — Rebuild the Coordinate | **Covered** | Include one non-standard decomposition before the minimum-place-value form. |
| Read and write large numbers in the Indian system | Main Quests 2 and 3 | **Covered** | Include lakhs, crores, and arab where age-appropriate. |
| Read and write large numbers in the International system | Main Quest 3 — Two Mission Controls | **Covered** | Use millions and billions while the represented quantity stays fixed. |
| Convert and compare between the two naming/grouping systems | Main Quest 3 | **Covered** | Make grouping commas change without moving the coordinate. |
| Compare and order large numbers | Main Quest 4 — Catch the Comet | **Covered** | Use close coordinates with the first differing place highlighted only after the child tries. |
| Decide when exact versus approximate values are appropriate | Main Quest 4 | **Partial** | Contrast navigation, which needs an exact coordinate, with supply preparation, which may use an estimate. |
| Round up, round down, or use the nearest thousand/lakh/crore according to context | Main Quest 4 | **Partial** | Add contextual choices at more than one place value. “Always look at the next digit” is not enough without deciding the required precision. |
| Estimate large-number sums and differences and reason about bounds | Supply Launch Quest 5 | **Partial** | Estimate before calculation and decide whether the exact result should be above or below a benchmark. |
| Add large numbers with regrouping | Supply Launch Quest 1 | **Covered** | Preserve place-aligned physical bundle bays. |
| Subtract large numbers with unpacking | Supply Launch Quest 2 | **Covered** | Preserve the visible whole and removed portion. |
| Multiply large numbers in context | Supply Launch Quest 3 | **Covered procedurally** | Duplication across satellites covers meaning, but not yet the chapter’s efficient factor regrouping. |
| Divide large numbers in context and interpret remainders | Supply Launch Quest 4 | **Covered** | Give the remainder a visible destination or meaning. |
| Factor and regroup products for efficient calculation, including structures behind ×5, ×25, and ×125 | No current owner | **Missing** | Give this a focused interaction rather than adding a rule panel to Supply Launch. |
| Predict the possible number of digits in a product | No current owner | **Missing** | Let the child select a signal-capacity bay before calculating and verify the prediction afterward. |
| Use reasonable assumptions in “could this fit/reach/happen?” problems | Main ending or new sequel | **Partial** | Add one unfamiliar mission question where the child chooses an assumption, estimates, and checks whether the conclusion is reasonable. |
| Large-number digit puzzles and open-ended investigations | Optional challenge route | **Enrichment** | Keep optional; these support flexible thinking but do not need to block story completion. |
| Scientific/standard form using powers of ten | Star Scale Beacon | **Separate on purpose** | Do not force exponents into Moonbase Tenfold. The existing separate mapping is correct. |

### Recommended focused chapter — Moonbase Signal Forge

This is the recommended way to close the two missing core ideas without
overloading Supply Launch.

**Short premise:** The comet image archive is complete, but its signal must
pass through limited-capacity transmitter bays. The child rearranges equal
packet groups so the transmitter can process them efficiently, predicts the
size of each output before running it, and estimates whether the finished
signal can reach a distant station.

| Quest | Story action | Learning job |
|---|---|---|
| 1. Same Signal, Smarter Route | Move unchanged packet groups through ×10/÷2, ×100/÷4, and ×1000/÷8 processing lanes | Explain efficient ×5, ×25, and ×125 structures without a memorised trick |
| 2. Regroup the Pipeline | Reorder and regroup visible factors while the total packet quantity stays fixed | Factorisation/regrouping for efficient multiplication |
| 3. Choose the Output Bay | Predict whether a product will have `m + n − 1` or `m + n` digits before running the transmitter | Bounds on the number of product digits |
| 4. Will the Signal Reach? | Choose reasonable rate/time assumptions and estimate a changed mission question | Magnitude sense, assumptions, and reasonableness |
| 5. Open Transmission | Combine one efficient product and estimate check to transmit the real comet image | Changed-context transfer and story payoff |

The action remains one signal-processing problem. It is not a set of
disconnected multiplication tricks.

### Story-count decision

**Recommended:** add Moonbase Signal Forge as a third Moonbase chapter.

If accepted:

- reusable worlds remain **20**;
- focused story chapters become **39**, not 38;
- Moonbase Tenfold stays conceptually clean;
- Supply Launch remains about the meanings of the four operations;
- Signal Forge owns efficient product reasoning and magnitude transfer.

**Alternative:** expand Supply Launch from five quests to eight or nine.
This preserves the number 38 on paper but is not recommended because the
chapter would combine operation meanings, algorithms, estimation, factor
regrouping, product bounds, and open-ended magnitude reasoning.

No count or Story World Bible change should be made until this decision is
approved.

---

## 6. Cross-story prerequisites and retrieval

| Story | Essential prerequisite | Later retrieval |
|---|---|---|
| Nova’s Night Run | Recognise an angle, right angle, straight direction, and basic line/ray/segment language | Triangle Trail uses line and angle relationships; Foldspace uses them to construct and verify parallel lines |
| Mountain Rescue | Whole-number order and Grade 6 introduction to integers | Orbit Rail transfers signed order and operations to rational numbers |
| Moonbase Tenfold | Read ordinary multi-digit whole numbers and know the four whole-number operations at a basic level | Cipher Couriers reuses place value/carrying; Power Stack and Star Scale later connect powers of ten and scientific form |

Retrieval should be brief, unscored, and scheduled in a later session. It
should not appear only in the ending recap.

---

## 7. Recommended discussion and implementation order

1. **Approve Nova’s Night Run’s eight-quest coverage.** Its premise is already
   strong; decide only the four added micro-beats and three-act pacing.
2. **Approve Mountain Rescue’s main chapter.** Then discuss the negative-cycle
   interaction separately before approving its multiplication sequel.
3. **Choose the Moonbase architecture.** Approve the recommended Signal Forge
   chapter or explicitly accept the tradeoff of a longer Supply Launch.
4. Only after a story decision, create its final quest-level concept IDs,
   misconception probes, evidence requirements, dialogue, interaction states,
   and phone storyboard.
5. Implement one deep quest and test it with a real Grade 7 child before
   expanding the rest of that story.

---

## 8. Decisions required from the product owner

1. **Nova’s Night Run:** keep the premise and add the four missing micro-beats?
2. **Mountain Rescue:** keep the main rescue and prototype the timeline model
   before approving both sequels?
3. **Moonbase Tenfold:** accept a third focused Moonbase chapter and revise the
   total from 38 to 39?

These are story and curriculum decisions. They do not authorise code,
production assets, or deletion of existing work.
