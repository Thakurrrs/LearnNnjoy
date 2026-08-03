# Panel Playbook — Every Mistake We've Made, So Nobody Makes It Twice

**Audience:** any agent or reviewer planning, implementing, or judging a
LearnNnjoy story world. This is the distilled lessons-learned register from
building the first three worlds (Mountain Rescue, Nova's Night Run, Moonbase
Tenfold) to the benchmark bar. It supplements, never replaces:
[GRADE-7-MATHS-STORY-WORLD-BIBLE.md](./GRADE-7-MATHS-STORY-WORLD-BIBLE.md),
[INTERACTIVE-STORY-BENCHMARKS.md](./INTERACTIVE-STORY-BENCHMARKS.md), the
2026-08-02 judge panel (docs/qa/story-panel-2026-08-02/), and the
experience-holes registers (docs/qa/experience-holes-2026-08-02/).

**Prime directives (owner):**
1. Stories are replaceable; the experience and the learning are not.
2. Story simplicity gate: a Grade 6–7 kid must enjoy and understand the STORY
   itself — one location, one problem, one action; after the opening the kid
   can say what's wrong and what they'll do in one sentence. If the plot only
   makes sense once the maths is explained, the story is wrong.
3. Story before menu: first entry to a world lands in a 30–40s World Arrival
   Act (the acted incident) flowing straight into Quest 1. The quest map is a
   rest-point surface for return visits only.
4. The stage performs: no static scenes. Backgrounds, characters, and props
   act out every beat (layered 2D choreography via `QuestStoryScene`'s
   `scene-beat-N` / `scene-speaker-X` hooks — see the Mountain arrival act
   and finale as exemplars). Never video files.

## A. Story & experience mistakes (all shipped once; all caught by review)

| # | Mistake | Rule now |
|---|---|---|
| A1 | Concept labels shown before the consequence (quest cards spoiled "vertically opposite angles") | Maths names appear only AFTER the kid causes and sees the change. Cards/pages carry story teasers. |
| A2 | Menu-as-front-door (card grid on first entry) | Arrival act first; map for returns. |
| A3 | Story narrated, not shown ("the pod fell" while art stood still) | Every incident is performed on stage, beat-keyed. |
| A4 | False ending ("CHAPTER COMPLETE" at quest 4 of 8) | One celebration, at the real end. Closing skits hand off to the next quest. |
| A5 | Lying UI: counters (1/4→4/4), button labels that do something else, stale "help me!" invites after completion, promises ("tomorrow") that are false | Every counter, label, and promise tells the literal truth. |
| A6 | Softlock-by-overlay (HUD chip covering a tap target) | Info chips get `pointer-events: none`; verify tap targets with elementFromPoint at their visual center; check ≥360px widths. |
| A7 | Model/render disagreement (verdict said "didn't meet" while strokes visibly crossed) | The maths verdict must match the drawn pixels. Turn near-miss ambiguity into a learning beat (e.g. extend-the-trace). |
| A8 | Assert-not-enact (one tap lit both zigzag corners; join button ungated) | The kid's action must genuinely produce the consequence; gates check real state. |
| A9 | Caption/audio/action drift after copy or order changes | The component is the canonical text; audio regenerates from it; Hear buttons play the line being displayed; speaker labels match the recorded voice. |
| A10 | Convoluted premise to close a curriculum gap | Natural-fit gate; replace the story, never the learning. |
| A11 | Kid avatar announcing the discovery before the kid makes it | Characters react and wonder; the player discovers. |
| A12 | Danger/failure framing (falling, "wrong") | Exciting but safe; exploratory choices produce useful consequences, not failure screens. |

## B. Engineering mistakes (all shipped once; all now have guards)

| # | Mistake | Guard now |
|---|---|---|
| B1 | 17 referenced audio files silently missing (`.catch(() => undefined)`) | Asset-existence test iterates every audio map (`src/lib/audio-assets.test.ts`): file exists, >1KB, no orphans on disk. Playback failures log. NEVER add an audio key without the file or a pending-list entry (see §D). |
| B2 | Emitted CSS classes with zero rules (invisible story objects — Pip, the sled) | Per-adventure css-coverage guard test (see `mountain-rescue-adventure.css-coverage.test.ts`); write one for every new world. |
| B3 | State fields read but never written (`routeRevealed`) | If a field gates a render, something must set it; reviewers grep for both directions. |
| B4 | Mobile overrides appended into an EARLIER `@media` block than new base rules → cascade-dead at 375px | New base rules first, their media overrides in a NEW media block after them. Verify computed styles at a real 375px viewport, not by reading CSS. |
| B5 | Reduced-motion gaps (flicker animations and transitions left running) | Every `animation` AND `transition` in a scene is either suppressed under `prefers-reduced-motion` or explicitly commented as essential; each beat readable as a static pose. |
| B6 | Save-format breakage risk on renames | Persisted field names never change casually; sanitizers default missing fields (fresh-quest values), clamp ranges quest-aware; `storyVersion` bumps on interaction changes; old saves resume at the nearest rest point; stale names get semantics comments. |
| B7 | Red intermediate commits (test added before assets existed) | Every commit green on its own; squash red/green pairs before merge. |
| B8 | Reviews trusting reports (a capture log claimed audio "resolved"; it wasn't) | Two-stage review per task: spec-compliance (independently verify every claim, re-run failing-first evidence) then code-quality. Then a three-lens judge panel per world (child engagement / pedagogy / narrative+UX) that REFUTES claims against code and live browser, never re-narrates them. |
| B9 | Spoken/displayed number mismatch conventions | Voice says number words ("minus four"); screens show symbols (−4). |
| B10 | Emotion-flat or teacherly voice direction | Per-line emotion directions; Nova is a teammate (wonder → reveal), never a narrator; lines 4–10 words, one idea. |

## C. The per-world process that worked (follow in order)

1. **Natural-fit story gate** — premise passes the simplicity gate and the
   Bible's §8/§9 gates; the owner approves the story BEFORE code.
2. **Storyboard package** (Bible §8) — incident, quest beats, dialogue with
   emotion directions, misconception map, evidence plan, phone composition.
3. **Plan doc** (docs/superpowers/plans/ pattern) — bite-size tasks, each
   with failing-test-first steps, exact files, and a commit message.
4. **Implement ONE deep quest to the benchmark bar first**; only then the
   rest. Each task: TDD, individually green commit, two-stage review, fixes
   folded forward.
5. **Choreograph** — arrival act + every scene beat-keyed; interactive stage
   objects styled and moving; css-coverage guard added.
6. **Verify live** — desktop AND 375×812 AND reduced-motion, real browser,
   fresh profile AND resumed save. Screenshot the beats.
7. **Judge panel** on the world (three lenses + kid-lens playthrough) before
   calling it done. Fix-first findings block.
8. **Real-kid test before the pattern scales.**

## D. Audio in cloud environments

The Qwen3-TTS pipeline (scripts/generate_qwen3_*.py) runs ONLY on the owner's
Apple-Silicon Mac (local models, `~/.venvs/learnnjoy-tts`). Cloud agents must:
- write final dialogue in the component (canonical), with per-line emotion
  directions in the generation script;
- add every new audio key to the world's generation script AND to
  `PENDING_AUDIO` in `src/lib/audio-assets.test.ts` (create the list if
  absent: keys listed there are exempted from the existence check and
  reported as pending, so suites stay green in the cloud);
- note in the PR body: "run `~/.venvs/learnnjoy-tts/bin/python scripts/<script>.py`
  locally, then remove these keys from PENDING_AUDIO."
Scenes must degrade gracefully (captions + reading-speed timers) until audio
lands — the engine already does this.

## E. Benchmark references in the codebase

- Scene engine: `src/components/quest-story-scene.tsx` (+ stub-audio tests)
- Choreographed arrival act + reactive stage: Mountain Q1
  (`mountain-rescue-adventure.tsx`, `.mountain-arrival-scene` /
  `.signal-cliff-stage` CSS)
- Finale act: `MountainFinale` (beat-keyed payoff, postcard, honest tease)
- Interaction gold standard: Night Run Q1–4
- Guards: `audio-assets.test.ts`, `*.css-coverage.test.ts`, story-lint
