# Content QA Report — Kid-Friendliness Audit (all grades, all subjects)

*2026-07-28 · 8 parallel review agents · read-only audit of question banks, Grade-7 adventures, and all kid-facing UI text. Criteria: understandability at grade age (copy ~2 grades below), CBSE/NCERT difficulty fit, factual correctness with one defensible answer, hint quality, story connection.*

## Executive summary

The owner's complaint is **confirmed on all three counts**, with precise causes:

1. **"Questions don't make sense"** → G7 adventures ask things never taught on screen (Skatepark demands the triangle-180° rule the activity never shows; Smart Shopper's step 3 introduces a second shop that was never in the story) and use vague instructions ("Cross zero if the trail takes you there").
2. **"Story is kind of missing"** → In 4 of 5 G7 adventures the story strips out at steps 2–3 and becomes a bare worksheet. Worse: across ALL question banks (maths G5+, all of science/english/social — 180+ questions), **zero questions reference Nova or any story**. Only maths g4-1 mentions her.
3. **"A bit hard"** → Two problems in opposite directions. The G7 *adventures* are hard where they assume untaught knowledge. The G7 maths *question bank* is the reverse — 4 of its 6 questions are recycled Grade 4–6 content, so it's too EASY and off-syllabus.

Beyond Grade 7: science and social G11–12 test the wrong content entirely (philosophy-of-science / college-register civics instead of NCERT syllabus), several grades are under-leveled, hints frequently restate answers instead of scaffolding, and the Atlas screen shows raw adult jargon ("CBSE/NCERT competency roadmap", textbook topic names).

## Verdict matrix

| Grade | Maths | Science | English | Social |
|---|---|---|---|---|
| 4 | Good | Good | Mixed | Mixed |
| 5 | Good | Good | Mixed | Good |
| 6 | Mixed | Mixed | Mixed | Good |
| 7 | **Poor** | Good | Good | Mixed |
| 8 | Mixed | Mixed | Mixed | Mixed |
| 9 | Mixed | Mixed | Good | Good |
| 10 | Mixed | Mixed | Good | Good |
| 11 | Mixed | **Poor** | Mixed | **Poor** |
| 12 | Mixed | **Poor** | Mixed | **Poor** |

**G7 adventures:** Cricket Good · Mountain Mixed · Balance Mixed · Skatepark Mixed/Poor · Smart Shopper Poor.
**UI screens:** Chapter, Avatar World, Completion Good · Welcome, Quest, Outcome, Diagnostic Mixed · **Atlas + curriculum topic names Poor**.

## Critical findings

1. **G7 maths bank recycled from G4–6** — g7-1…g7-4 are basic fraction comparison / decimal conversion / integer addition already covered in lower grades; zero Class-7 syllabus (simple equations, percentages/profit-loss, algebraic expressions) despite `algebra` unlocking at grade 7. → Rebuild against actual CBSE Class 7.
2. **Science G11 & G12 test the wrong subject** — entirely abstract "nature of science" (control groups, peer review, informed consent) instead of NCERT physics/chemistry/biology. → Rewrite both grades from syllabus.
3. **Social G11 & G12 in college register** — "political theory", "opportunity cost", "fiscal policy", "disaggregated evidence" with no kid anchors. → Rewrite down to kid register with concrete examples.
4. **Science g6-4 is a maths question** — cyclist speed/distance, mislabeled `science-inquiry`/`ecosystem`. → Cut or reframe.
5. **Skatepark step 2 assumes the untaught 180° rule** — asks the third triangle angle; activity never demonstrates the angle-sum rule. → Add a mini-discovery showing all three angles + the rule before quizzing it.
6. **Smart Shopper step 3 phantom shop** — "Trail Shop ₹300, 20% off" appears from nowhere; kid only knows the ₹240 kit. Also step 0 pre-announces the discount is "fair", killing the discovery. → Introduce both shops in step 0; remove "fair" from setup.
7. **Maths G11/G12 duplication + trivia** — G11 x²−9=0 duplicates G10's quadratic skill; G12 f(3)=x²+1 and plain %-change are 2–4 grades below Class 12. → Replace with complex roots / composition / applications of derivatives.
8. **Atlas jargon** — "CBSE/NCERT competency roadmap", "Lumina restoration", "current pilot proves the learning loop"; curriculum-map renders raw textbook headers ("Vectors, matrices and three-dimensional geometry") straight to kids. → Kid-facing display labels + rewrite 3–4 strings in page.tsx.

## Important findings (condensed)

**Question banks**
- G5 maths g5-1 duplicates g4-3 almost verbatim; G6 maths g6-1/g6-3 under-leveled (grade 3–4 difficulty); G8 maths g8-2 (3²) and g8-5 (rectangle area) are grade 5–6 level; g8-5 mistagged `coordinate`; G9 g9-4 duplicates G8's equation pattern; G10: Pythagoras (Class 7–8), √7 comparison duplicates G9, simple 10% growth (Class 7–8).
- English G8 "unreliable narrator" above grade with giveaway distractors; G11/12 college-composition register ("warrant", "coded thematic framework"); G4 "clearest full stop" phrasing awkward; G6 semicolon likely early vs NCERT.
- Social G7 "latitude" and G8 "accountability" used without definition; G4 wheelchair/languages items have no map/community link.
- Science s10-4 concave-mirror item imprecise with a nonsense distractor; s6-3 "cooking rice" reversible-change ambiguity; G9 phrased in textbook register ("chemical identity").
- **Hints pattern (all subjects):** ~a quarter of hints either restate the answer/explanation or state an abstract rule with no anchor to the question's numbers. Hints should scaffold with the actual numbers/words in play.
- **Metadata pattern:** science hardcodes `visual:"ecosystem"`/`skill:"science-inquiry"` for all 54 items; social hardcodes `visual:"map"` for all 54 — wrong illustrations for most non-ecosystem/non-map content and no per-topic remediation signal.

**G7 adventures**
- Mountain step 1 instruction unclear; step 3 loses all story (bare equation match); direct cell-click lets kids land on −4 by luck.
- Balance step 2 "Which repair…" undefined word, meta choices — use concrete "remove from both sides / only one side".
- Shopper step 1's four identical "₹60" buttons make the task illusory.
- Steps 2–3 in every adventure use identical bare `offer-grid` quiz blocks — the "worksheet feeling". Keep StoryScene + one in-world framing line on every step.
- Cricket's distractors are joke-easy ("names are shortest") — inconsistent difficulty vs. the others.

**UI wording**
- Meta-reassurance on kid screens: "No rankings, public profiles, or peer pressure", "They never make a quest easier" → move to parent surface; replace with "Just you and Nova." / "Just for fun!"
- "Private learner adventure", "Use your discovery", "For thoughtful problem solving", "topics mapped" → LMS/teacher register; rewrite to kid words.
- Adaptive-note block on outcome reads as a teacher's assessment bolted onto Nova's world → fold into Nova's dialogue.

## Positives worth keeping

- Chapter-screen writing is the best in the app (concrete, first-person Nova, playful stakes) — it's the register everything else should match.
- G4–5 maths and science are genuinely good; g7-5/g7-6 (scale model, recipe ratio) are the right template for new G7 items.
- Cricket Data's design (the task IS the story) is the model the other four adventures should follow.
- G8 probability distractor "3/2" (impossible probability) is an example of a GOOD trap.

## Remediation map

**Already covered by the Story Depth Pack plan** (`docs/superpowers/plans/2026-07-28-story-depth-pack.md`):
- Quest-flow story vanishing → serialized arcs + per-visual bridges (Tasks 11–13)
- G7 concept beats, teaching feedback, vague-instruction rewrites, concept-accurate animations (Tasks 1–7)
- Hint teaching on misses → explain-moments (Task 9)

**Needs to be ADDED to the plan (recommended amendments to Tasks 2–6):**
- Skatepark: 180°-rule mini-discovery before step 2; "balanced triangle" → precise wording
- Smart Shopper: two shops introduced in step 0; drop "fair" from setup; make step-1 quarters a real choice
- Story framing on steps 2–3 of every adventure (keep StoryScene + one Nova line on quiz steps)
- Balance step 2 concrete choices; Mountain step 3 logbook framing; Cricket distractor calibration

**New workstreams (not in any plan yet):**
1. **Question-bank repair** — rebuild G7 maths; rewrite science+social G11–12; re-level G6/G8/G10–12 maths items flagged above; de-duplicate (g5-1, G9-4, G10-2, G11-4); fix metadata tags; hint-quality pass across all subjects.
2. **UI wording pass** — 3–4 jargon strings in page.tsx, kid-facing labels for curriculum-map topics, relocate meta-reassurance to a parent surface, adaptive-note → Nova's voice.

## Priority order (aligned with "Grade 7 first")

1. G7 adventures fixes (fold into Story Depth Pack Tasks 2–6 — same files, same steps being rewritten)
2. G7 maths question bank rebuild (small file section, highest complaint relevance)
3. UI jargon pass (cheap: a handful of strings, big register win)
4. Science/social G11–12 rewrites + maths re-leveling
5. Hint-quality + metadata pass (mechanical, lint-testable)
