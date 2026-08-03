# Grade 7 Story Experience Panel — 2026-08-02

## Scope and method

Requested by the product owner before polishing the core journey. Three
independent judges reviewed the **current working tree** (uncommitted changes
included), each writing a full report in this folder:

- [Child engagement & developmental fit](./judge-child-engagement.md)
- [Grade 7 mathematics pedagogy](./judge-pedagogy.md)
- [Interactive narrative & game UX](./judge-narrative-ux.md)

Shared evidence: a fresh live browser walkthrough ([capture log](./capture-log.md),
desktop 1280×720/1100, onboarding → star map → Night Run Q1/Q2/Q5 → Mountain Q1
→ Moonbase Q1) plus full source inspection. Scope A: Night Run (8 quests),
Mountain Rescue, Moonbase Tenfold. Scope B: design docs for all other planned
stories. Judges scored five owner-mandated dimensions: kid interest,
interest across the journey, come-back pull, maths-through-story, and complete
chapter concept coverage.

Owner's prime directive applied throughout: **stories are replaceable; the
experience and the learning are not.**

## Panel verdict

| Experience | Child engagement | Pedagogy | Narrative/UX | Consensus |
| --- | ---: | ---: | ---: | ---: |
| Night Run Q1–4 | — (chapter-scored) | 7.4 | 7.6 | **~7.5** |
| Night Run Q5–8 | — (chapter-scored) | 4.6 | 4.6 | **4.6** |
| Night Run whole chapter | 5.8 | 6.3 | 6.1 | **6.1** |
| Mountain Rescue | 6.0 | 6.8 | 6.6 | **6.5** |
| Moonbase Tenfold | 4.6 | 5.4 | 5.4 | **5.1** |

Versus the 2026-07-29 panel: Night Run's front half holds near benchmark
(8.1 → ~7.5, dragged by a confirmed boundary bug and a false ending);
Mountain is slightly down (6.8 → 6.5) because deeper inspection found the
finale missing and continuity only fixed in card copy; Moonbase is flat
(5.3 → 5.1) — the rebuilt Quest 1 telescope is genuinely good, but Q2–4
remain weak and the openings downgraded to click-through scenes.

**No judge recommended replacing any built story premise.** All three voted
POLISH. The stories fit; the back halves of the execution don't.

## Unanimous critical findings (all three judges)

1. **Mountain Rescue has no ending act.** The chapter ends on a recap panel —
   no cell docking, warming shelter, Pip reaction, or aurora, all mandated by
   its own spec, which explicitly forbids a recap-card ending.
2. **Mountain continuity is still broken in play.** Q1 "recovers" the pod
   (copy, CTA, aria), Q3 free-drifts it, Q4 says it is "still trapped at
   minus four" — the 07-29 fix landed only on the world-page cards. Q4 also
   lowers the recovered pod back to −4 after the lift, undoing the climax.
3. **Mountain Q1 voice is silently dead.** The 17 `q1-v3-*` files the 07-29
   panel flagged are still missing; on-disk q1 files use different names, and
   `play().catch(() => undefined)` hides the failure. Still no automated
   asset-existence test. (q2–q4 filenames match.)
4. **Night Run declares victory at Quest 4 of 8.** A "chapter complete"
   celebration fires mid-chapter, then Q5 opens with a silent static scene —
   a false climax exactly where the scene system downgrades.
5. **Night Run Q5–8 assert instead of enact.** One tap of either corner badge
   sets the Q5 match flag; Q6's 180° join button is always enabled; Q8's
   "use the whole pattern" finale is one-two clicks with no angle chain.
   Contract concepts never enacted anywhere in the chapter: complementary
   angles, alternate exterior angles, and Q8's recognition transfer.
6. **Trail Meet picture/maths contradiction (confirmed in code).** The
   intersection verdict tests a zero-width modeled segment while the render
   draws an 11px stroke with a 19px glow — near-misses look crossed while
   Nova says they didn't meet. The audit-required "extend the trace" beat is
   missing.
7. **Formal concept labels appear before play everywhere** — on quest cards,
   world pages, and activity headers — against the Bible's delayed-naming
   rule.
8. **Come-back pull is the weakest dimension across the app** (3–6/10):
   endings pay coins; `finaleCopy` postcards are dead code; streaks never
   fire for Grade 7; the storyboard's "opening lap tomorrow?" hook was never
   built; no next-world tease at any finale.

## Additional majors

- **Moonbase**: telescope slider can skip rings (6 → 600 without 60) while the
  reveal claims ×10 "at every step"; Q2 bundling stops at ten-thousands while
  the coordinate reaches crores; Q3 is viewing-only; misleading 1/4-style
  counters (also in Balance Lab). Copy quality is exemplary (never implies the
  digit "grows").
- **Two scene systems coexist** — voiced auto-skits with beat counters
  (Night Run Q1–Q4) vs silent click-through "Next line →" scenes (Night Run
  Q5–8, Mountain and Moonbase openings). Panel recommendation: the voiced
  auto-skit engine (`SkateQuestStoryPlay`) becomes canonical everywhere.
- **App-voice slips**: "steer the learner", "Event 5", a11y label naming the
  wrong quest, topic stars showing school-unit names (Bible: children see
  adventures, not labels).
- **Ergonomics**: Mountain Q1's strap pull was undiscoverable in live testing
  (no hint after repeated failed attempts); several micro-interactions rely on
  small press-hold targets; keyboard alternates exist in Night Run Q1 but are
  not uniform.

## Scope B — planned-story docs (17 remaining worlds)

- **Replace premises** (concepts stay): *Moonbase Supply Launch* and
  *Component Crew* (child-engagement judge: decorated arithmetic, weakest
  natural fit).
- **Restructure**: *Power Stack Station* — nine one-rule quests is the
  catalogue's worst sag risk.
- **Re-home**: integer ×/÷ (current II-2 second half) has no assigned story
  after the Supply Lift rejection — a real coverage hole for the current
  textbook route.
- **Build-next candidates** (judges diverge; decision pending): engagement
  lens → Vanishing Glowtails, Deep-Sea Research, Habitat Architect; pedagogy
  lens → Invention Workshop, Festival Makers, Clockwork Carnival.

## Recommended polish order (panel synthesis)

1. Mountain Rescue: finale act + enacted continuity + q1 audio filenames +
   asset-existence test.
2. Night Run: remove false Q4 ending; fix Trail Meet render/model agreement
   and add the extend-the-trace beat.
3. Night Run Q5–8: rebuild interactions and scenes to front-half parity,
   closing the coverage gaps.
4. Moonbase Q2–4: real physical play per the panel's standing rebuild spec;
   per-ring telescope stepping.
5. Cross-cutting pass: one scene system, delayed concept labels, honest
   counters, come-back hooks (postcards, next-world tease, streak wiring),
   app-voice fixes.

The three judge reports contain file:line evidence for every finding.
