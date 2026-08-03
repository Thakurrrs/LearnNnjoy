# Live Capture Log — 2026-08-02 Panel Review

Fresh browser walkthrough of the current **working tree** (uncommitted changes included)
at 1280×720 and 1280×1100 desktop viewports, `npm run dev`, onboarding as
"Mira", Grade 7, Girl explorer avatar. This log is shared evidence for all three
judges. It records what was actually on screen; interpretation belongs to the
judges.

## Onboarding and navigation

1. Home page: "This world needs a hero. That's you." Nickname + grade +
   3 avatar choices (Star/Boy/Girl explorer). CTA: "Nova is waiting at the star map".
2. Grade 7 hub = "Lumina sky" constellation. 16 topic stars, 6 bright
   ("ready to play"), 10 dim ("coming soon"). Stars are **curriculum labels**
   ("Integers", "Simple Equations", "Lines and Angles"), not adventure names.
   Selecting a star opens a story teaser card, e.g. Lines and Angles →
   "Story world · Nova's Night Run — Mira! Two riders want to perform a mirrored
   glow trick. Help me map their crossing paths?" CTA "Plan the glow trick →".
3. Home Base ("Choose the world you want to explore today") lists subjects
   (Mathematics/Lumina Restoration, Science/Discovery Lab, more below fold) and a
   resume strip: "YOUR STORY IS SAFE — Resume Nova's Night Run — **Event 5** is
   waiting exactly where you left it." ("Event" is internal jargon leaking.)
4. Progress restores exactly where left (world page after reload, resume strip on
   Home). Per-move save confirmed by copy "your progress is saved on this device
   after every move."

## Nova's Night Run (Lines and Angles) — 8 quests

World page: "Eight connected quests build one opening-night ride. Each one
changes the same rooftop." Every quest card shows its **formal concept label
before play** ("Opposite angles · linear pairs", "Transversals · corresponding
angles", …). Locked cards say "Finish X first — the next trail lights after
Quest N."

### Quest 1 — Trail Meet (played fully)

- Intro panel: "Watch Nova. Then steer **the learner**." (app-voice slip; also
  a11y group label said "Parallel Glide story scene" while the quest is Trail
  Meet; mid-activity the group label is "Skate area. Drag the learner or use the
  arrow keys to make a trail." — keyboard alternative present.)
- Scene: 4 beats, Nova rides and draws a straight cyan trail with guide stars.
  Child then drags anywhere to ride a straight pink trail. Stars "guide; they do
  not grade."
- **Boundary bug observed:** a shallow drag ending near Nova's line rendered a
  pink trail that visually crossed the cyan trail, but verdict was "Cool route!
  Our trails didn't meet this time." Rendered line extends beyond the modeled
  segment → picture and maths disagree at boundary cases. A steeper drag
  produced "There! Your trails met at one point!" with a glowing intersection
  marker at the crossing.
- Post-run choices: "Continue to the crossing" / "Ride again" (exploration is
  safe, no failure screen).

### Quest 2 — Crossing Rails (opening + activity start)

- "STORY OPENING — The two-rider glow trick", 6 voiced beats with beat counter,
  a second rider character, "Nova is speaking" indicator, Play with sound / Skip
  story. Final beat: the **child avatar labeled "Mira"** says "Let's light it
  up!" → CTA "Map the glow trick →".
- Activity "Turn the Crossing" (1 of 4): rider asks "Turn my pink trail. Watch
  every opening." Slider "Aim the pink path. Keep it straight." + Turn left /
  Turn right buttons; "Hear that again" replay chip on dialogue.

### Quest 5 — Zigzag Lights (seeded save to unlock; played fully)

- Save-state seeding worked and the world page showed 4/8 complete with
  "Review quest →" replay buttons on finished quests.
- Opening: short click-through "Next line →" scene (3 beats, no auto-play, no
  "is speaking" indicator observed). Art shows Nova + **two near-identical
  copies of the rider girl** side by side. Rider: "The beam made a secret Z
  across our rails!" Nova: "Light that zigzag pair, then let's ride through
  both." CTA "Build the next part →".
- Activity: **separate abstract diagram card** (dark grid panel) with two cyan
  parallel rails, pink transversal, tappable corner badges A and B, slider
  "Turn the crossing beam", button "Ride the glowing Z" (a small skater icon
  traverses the Z inside the diagram). Characters sit tiny in the corner of the
  screen, outside the diagram.
- After riding: "The beam changed, but the alternate inside openings still
  match." Reveal chip: "**Alternate interior angles match** — inside the rails ·
  opposite sides of the beam" + "Follow the lights →". Naming comes after the
  action (rhythm correct), but the action lives in the widget, not the world.

## Mountain Rescue (Integers) — 4 quests

World page: "One cliff. Four connected rescue quests. The pod comes home only
after every route is understood." Quest 4 card: "Lift the pod from −4 to the
safe ledge at +2" (panel's continuity redesign present in copy). Concept labels
again shown on cards pre-play ("Positive · zero · negative").

### Quest 1 — Chase the Lost Signal (played fully)

- Opening: mountain scene, Nova + child + Pip the fox + helicopter at "+3".
  Voiced lines with "Hear line" replay. Nova: "Pip! The ribbon goes on the
  shelter—not your tail!" … "You steer the rescue sled. I'll watch the signal!"
  Characters are static sprites; the incident (pod falling) is not visibly
  acted in the scene — the helicopter/pod imagery does not move during the
  opening.
- Activity is a real vertical cliff world: SERVICE DECK +3, RIDGE SHELTER +2,
  BASE CAMP 0 (marked line), RAVINE −4. Child action chain within one quest:
  1. "Pull the glowing safety latch →" (causes the incident in-world)
  2. "YOUR MOVE — Move the pod from +3 to the hidden beacon. Drag the real pod
     down the cliff, or move one level at a time." [Down 1]/[Up 1] buttons;
     stepped +3→+2→+1→0→−1→−2→−3→−4; "SIGNAL FOUND −4" appears at −4.
  3. "Brush away the snowdrift" — tactile wiping, % cleared counter (40%→80%→100%).
  4. "Pull the recovery strap together" — hold/pull interaction
     (`signal-recovery-strap` button).
- Reveal AFTER all actions: "NOVA NAMES WHAT YOU FOUND — The cliff continues on
  both sides of zero. Positions above zero are positive. Positions below zero
  are negative. Zero is the reference point between them." with +3 / 0 / −4
  marks, then transfer CTA: "Mark the shelter and pod →".
- Audio: `public/audio/mountain-rescue/` holds 29 mp3s (q1–q4 openings and
  stage lines) and no console errors surfaced during the session. **Correction
  after source verification:** the component requests 17 `q1-v3-*` filenames
  (`mountain-rescue-adventure.tsx:42–58`) that do NOT exist in the folder — the
  on-disk q1 files use a different naming scheme (`q1-opening-01-scout.mp3`).
  Playback failures are swallowed by `play().catch(() => undefined)`, so Quest 1
  voice is silently dead. The 07-29 panel's missing-audio blocker is NOT
  resolved; q2–q4 filenames do match.
- Friction note: as a pointer-driven tester I could not discover the strap
  interaction without inspecting the DOM; the pull required press-hold on a
  specific small element with no observed hint after several failed drags
  (evaluate against child + touch ergonomics).
- Observed possible contradiction: Quest 1 CTA says "**Recover** the pod" and
  reveal marker says "**Recovered** pod at minus four" while Quest 4 card
  promises "Lift the pod from −4 to +2". Judges should verify quest 2–4 copy in
  source for the continuity the 07-29 panel demanded (locate/secure in Q1, lift
  only in Q4).

## Moonbase Tenfold (Large Numbers) — 4 quests (REBUILT vs 07-29 panel)

World page: "Mira, help Nova find Blink and photograph the comet bloom." New
character Blink (small drone-star). Quests: 1 The Telescope Wakes ("A place
changes a digit's value"), 2 Rebuild the Coordinate, 3 Two Mission Controls
(Indian and international grouping), 4 Catch the Comet (compare and estimate).

### Quest 1 — The Telescope Wakes (opening + core action)

- Opening: 3 beats, click-through "Next line →". Blink: "Beep-beep! I found the
  comet bloom—whoa, it is fast!" → Nova: "His signal is still blinking. Take
  the zoom wheel—we can follow it." → "Take control →". (Beat 2's visual
  change was not obvious in stills.)
- Activity: nested place-value zoom rings with Blink at centre; single slider
  "Slide the telescope through the place-value rings. Watch what the same digit
  represents." Readout: SAME DIGIT 6 / VALUE NOW 6 → slid one ring out:
  SAME DIGIT 6 / VALUE NOW 600 with the digit badge moving outward through
  rings. The digit stays the same while place changes value — the Bible's
  required framing, enacted, not quizzed.
- Note: slider moved two rings in one drag (6 → 600 skipping 60 display step in
  my capture); judges should check per-ring stepping in source.

## Cross-cutting observations

- Formal concept labels appear on quest cards and world pages **before** play
  everywhere (Bible/panel: hide until consequence is seen).
- Two scene systems coexist: auto-playing voiced skits with beat counters
  (Night Run Q1–Q2) vs click-through "Next line →" static scenes
  (Night Run Q5, Mountain opening, Moonbase opening). Different feel and pace.
- Avatar choice (girl) is reflected in scenes and the child speaks under her
  own nickname ("Mira") — strong personalisation.
- Come-back pull: resume strip + exact-position restore work well. No
  observed session-end hook ("tomorrow…" tease), no Atlas-level next-world
  curiosity card observed in-session (judges: check finale/journal code).
- Topic stars use school-unit names; Bible's Atlas rule says children see
  adventures, not curriculum labels.
- Progress counters: quest beat counters observed accurate in played scenes
  ("1 of 4", "2 of 4", "5 of 6"); no misleading "1/4" pattern seen in the
  played portion (was a 07-29 panel complaint — verify remaining quests in
  source).
- No console errors across the entire session.

## Not captured live (source review required)

- Night Run Q3, Q4, Q6, Q7, Q8 full play; Mountain Q2–Q4 + finale; Moonbase
  Q2–Q4 + finale; Balance Lab (built, modified in working tree); Smart Shopper;
  cricket data story; voice-story-audition component; journal/replay flows;
  mobile 375px layout; reduced-motion behaviour; screen-reader order.
