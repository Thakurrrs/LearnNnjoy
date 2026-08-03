# Experience-Holes Review — 2026-08-02/03

Owner request: "we think we finished but everything still has holes — check as a
kid using the app and also as the reviewer." Two independent audits over ALL six
live adventures:

- [Kid-lens](./kid-lens.md) — full live playthrough (Night Run Q1–8, Moonbase
  Q1–4, Balance Lab Q1–3, Mountain fresh-profile start→finale).
  35 holes: **8 BREAKS-STORY · 13 FEELS-DEAD · 13 PAPERCUT**.
- [Reviewer-lens](./reviewer-lens.md) — source-level sweep for systemic hole
  classes (unstyled elements, static scenes, narrated-not-shown, missing
  speaker emphasis, click-through remnants, dead affordances).

## Where both lenses agree (the merged verdict)

1. **Mountain Q1's stage is unlit** — the story and audio are now the app's
   best, but the world doesn't perform them: the pod sprite never moves while
   the counter runs +3→−4, brushing/pulling are %-meters with nothing visible,
   Pip is effectively invisible (zero-CSS story objects), and the "tap Ridge
   Shelter" flag target is physically covered by the quest-title HUD chip —
   a softlock-by-overlay. Mountain Q2–Q4 are, by contrast, the best
   interactions in the app.
2. **Night Run splits in half** — Q1–Q4 cinematic and excellent; a false
   "CHAPTER COMPLETE" fires at Q4; Q5–Q8 downgrade to a silent click-through
   worksheet with the world art gone.
3. **Balance Lab traps kids** — a gate requires exactly 3+3 while the HUD says
   "2 matches 2" and the button stays dead with no hint; "Voice being
   prepared" dev notes leak into every line.
4. **Moonbase offers no decisions until Q4**; inert tappable-looking tiles;
   counters jump 1/4→4/4.
5. **Recurring cross-world papercuts** — payoffs hidden behind the expanding
   control panel, "Play with sound" re-gates every scene, lying button labels,
   completed stars keep stale "help me!" invites.

## Proposed fix order (pending owner sign-off)

1. **Trap removal (small, urgent):** Mountain flag-tap HUD overlay; Balance
   3+3 gate/hint (or dim the Balance star); strip dev-note leaks; fix lying
   button labels + stale star invites.
2. **Light the stage (Mountain):** style the zero-CSS story objects; make the
   pod/sled visibly travel; beat-by-beat arrival-act choreography (directing
   table already agreed with owner).
3. **Phase 2 (Night Run front):** kill the false Q4 ending; trail model/render
   fix + extend-the-trace beat.
4. **Phase 3 (Night Run Q5–8 world-native rebuild)** — kid-lens confirms this
   is the app's biggest cliff.
5. **Phase 4 (Moonbase Q2–4 real play)**, then **Phase 5 cross-cutting**
   (sound re-gating, honest counters, panel layout, scene-engine migration).
6. **Owner decision:** dim not-ready stars (Balance/Shopper/cricket) to
   "coming soon" until their phases, or leave tappable.

Guard rails to add (from reviewer-lens): lint for emitted-class-without-CSS
and state-fields-read-but-never-written; an overlay/hit-target check joins the
acceptance checklist.
