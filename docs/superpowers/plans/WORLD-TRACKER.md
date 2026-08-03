# Grade 7 World Tracker

Single source of truth for what's built, what's next, and what each cloud/local
run should pick up. **Rule: work the topmost row whose status is not DONE.
One row per run.** Update this file in the same PR as the work.

Process per row: follow [PANEL-PLAYBOOK.md](../../design/PANEL-PLAYBOOK.md)
§C — story gate → storyboard → plan → deep-quest-first TDD → choreography →
live verify (desktop/375px/reduced-motion) → judge panel → done.

## Queue

| # | Work item | Kind | Status | Notes |
|---|---|---|---|---|
| 1 | Phase 2 — Night Run front: trail model/render agreement + extend-the-trace beat; remove false Q4 ending; Q4→Q5 handoff skit | Fix phase | **NEXT** | Spec §Phase 2 in docs/superpowers/specs/2026-08-02-core-journey-to-benchmark-design.md |
| 2 | Phase 3 — Night Run Q5–8 world-native rebuild (zigzag trace, half-turn join, ride-test converse, opening-lap finale) + voiced skits + arrival act + choreography | Rebuild | PENDING | Kid-lens: "the app splits in half" here |
| 3 | Phase 4 — Moonbase Q2–4 physical play (bundle full magnitude, comma-gates, align-then-estimate) + finale postcard + choreography | Rebuild | PENDING | Q1 rebuilt already; keep its bar |
| 4 | Phase 5 — cross-cutting: scene-engine everywhere, delayed labels, honest counters, come-back loop (postcard journal, star-reveal cadence, cliffhanger teases), sound-gate once per session, app-voice sweep | Systems | PENDING | Spec §Phase 5 |
| 5 | Balance Lab to benchmark (exists, currently dimmed "coming soon"): arrival act, voiced scenes, fix 3+3 gate, choreography, judge panel → relight star | World | PENDING | Undims when it passes the panel |
| 6 | Smart Shopper Night Market rebuild to benchmark → relight star | World | PENDING | Old worksheet format; likely full redesign vs Bible World 14 |
| 7 | Vanishing Glowtails (Data Handling) — replaces cricket data story → relight star | World | PENDING | Bible World 12; cricket premise retired per natural-fit gate |
| 8 | Clockwork Carnival (Arithmetic Expressions) | New world | PENDING | Bible World 2 |
| 9 | Deep-Sea Research (Decimals) | New world | PENDING | Bible World 3 |
| 10 | The Invention Workshop (Letter-Numbers) | New world | PENDING | Bible World 4 |
| 11 | Lumen City Patterns (Number Play) | New world | PENDING | Bible World 6 |
| 12 | Festival Makers (Fractions) | New world | PENDING | Bible World 9 |
| 13 | Triangle Trail (Triangles) | New world | PENDING | Bible World 8 |
| 14 | Harmony Gardens (HCF/LCM) | New world | PENDING | Bible World 20 |
| 15 | Remaining Bible worlds & sequel chapters in §10 order | New worlds | PENDING | One per run; split rows as they start |

## Done

| Work item | Evidence |
|---|---|
| Phase 1 — Mountain Rescue complete: continuity, finale act, 44 voices + asset tests, arrival act, continuous scene engine (pause/rewind/subtitles), stage choreography, trap fixes | docs/superpowers/plans/2026-08-02-mountain-rescue-completion.md; docs/qa/story-panel-2026-08-02/; commits through `working` HEAD |
| Judge panel + experience-holes review (kid + reviewer lens), merged verdict | docs/qa/experience-holes-2026-08-02/README.md |
| Coming-soon star gating for not-ready worlds | `NOT_READY_ADVENTURE_IDS` in src/lib/grade-seven-progress.ts |

## Standing rules for every run

- Deliver as a PR against `working` (never push to `working`/`main` directly).
- Every commit green; two-stage review per task; judge panel before a world
  is marked DONE here.
- Audio: cloud runs follow PANEL-PLAYBOOK §D (PENDING_AUDIO convention).
- A world's star relights (remove from `NOT_READY_ADVENTURE_IDS`) only when
  its judge panel passes.
- The owner (and a real Grade 7 kid) sign off before a world's pattern
  scales to the next one.
