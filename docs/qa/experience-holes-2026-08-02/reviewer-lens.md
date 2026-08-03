# Reviewer lens — scene/visual layer holes (2026-08-02)

Systematic source-level audit of the built Grade 7 adventures' scene layer.
Method: every `className` emitted by the in-scope components (including
template-built variants, resolved to their possible values) was cross-checked
against the full CSS corpus (`src/app/world.css`, `src/app/globals.css`,
`src/components/voice-story-audition.module.css`); every scene's line texts
were cross-checked against its rendered stage children and state wiring. No
browser was used; a parallel agent owns the live pass.

Components audited: `skatepark-adventure.tsx`, `moonbase-tenfold-adventure.tsx`,
`balance-lab-adventure.tsx`, `mountain-rescue-adventure.tsx`,
`quest-story-scene.tsx`, `continuous-adventure-ui.tsx`, `adventure-play.tsx`,
`grade-seven-adventures.tsx`. Severity: **BREAKS-STORY** (a child cannot see
what the story claims is happening) / **FEELS-DEAD** (works but visibly inert
or asserted-not-enacted) / **PAPERCUT** (cosmetic or hook-only).

---

## 1. Unstyled / invisible elements (zero matching CSS rules)

Every class below is emitted by a component and has **zero** matching rules
anywhere in the CSS corpus. Because `.signal-cliff-stage` is
`position: relative; overflow: hidden` (world.css:2175), unpositioned children
fall into normal document flow at the top of the stage — they render, but not
where the story places them, and any inline `top:` on a static element is
ignored.

### Mountain Rescue — Quest 1 "signal rescue" stage (the epicentre)

| World | Element / class | Evidence (emit site) | What it is supposed to depict | Child-visible? | Severity |
| --- | --- | --- | --- | --- | --- |
| Mountain | `signal-pip` | src/components/mountain-rescue-adventure.tsx:559 | Pip the snow fox waiting beside the cold shelter — addressed by name in the opening ("Pip! The ribbon…") | Yes — named character | BREAKS-STORY |
| Mountain | `signal-service-deck` | mountain-rescue-adventure.tsx:535 | "SERVICE DECK +3" — the launch origin Scout narrates | Yes | BREAKS-STORY |
| Mountain | `signal-story-location` / `shelter-location` / `flag-placed` | mountain-rescue-adventure.tsx:541 | Ridge Shelter button at +2 — the destination of the whole chapter, tappable in step 3 | Yes — interactive | BREAKS-STORY |
| Mountain | `signal-shelter-building`, `shelter-window`, `shelter-heater` | mountain-rescue-adventure.tsx:546–548 | The shelter's little building art (window, heater) | Yes | BREAKS-STORY |
| Mountain | `signal-pod-site` (+ `found` / `recovered` variants), `signal-pod-site-label` | mountain-rescue-adventure.tsx:597–609 | The fallen pod at −4 in the ravine — the goal object, tappable in step 3 | Yes — interactive | BREAKS-STORY |
| Mountain | `signal-snowdrift` | mountain-rescue-adventure.tsx:604 | The snowdrift hiding the pod ("The signal is under this drift") | Yes | BREAKS-STORY |
| Mountain | `signal-brush-zone` | mountain-rescue-adventure.tsx:614 | The "Brush the snow" press/drag zone (step 2's main action) | Yes — interactive | BREAKS-STORY |
| Mountain | `signal-recovery-strap` (base rule; only `.pulse` keyframes exist, world.css:7772) | mountain-rescue-adventure.tsx:626 | The PULL strap — unpositioned button pulsing in flow | Yes — interactive | BREAKS-STORY |
| Mountain | `rescue-sled-team`, `rescue-sled-art`, `rescue-sled-nova`, `rescue-sled-kid`, `travelling` (in this context) | mountain-rescue-adventure.tsx:410–450, 585–589 | The rescue sled carrying Nova + the child down the cable. Inline `style={{ top }}` is dead on a static element — the sled **cannot move** | Yes — the child's own vehicle | BREAKS-STORY |
| Mountain | `signal-tracker` (+ inline `--signal-strength`, consumed nowhere) | mountain-rescue-adventure.tsx:591–595, 517 | The signal-strength meter ("GETTING STRONGER") — unpositioned; brightness var read by no rule | Yes | FEELS-DEAD |
| Mountain | `signal-cable-pulse` | mountain-rescue-adventure.tsx:578 | Per-level pulses on the rescue cable (visited/current/zero states) — the track itself is styled (world.css:2315), its pulses are invisible | Yes | FEELS-DEAD |
| Mountain | `--snow-left`, `--recovery-progress` custom props | mountain-rescue-adventure.tsx:518–519 | Snow depletion and pull progress — set every interaction, consumed by zero CSS rules | Yes (intended) | BREAKS-STORY |
| Mountain | `signal-rescue-stage`, `phase-launch/search/recover/discover`, `pod-recovered` | mountain-rescue-adventure.tsx:515 | Per-phase art direction of the Q1 stage — none exists; only HUD text changes | Yes (mood layer) | FEELS-DEAD |
| Mountain | `signal-dark-beacons` | mountain-rescue-adventure.tsx:646–650 | "The storm-darkened beacon route appears" after both flags — four bare `<i/>`, invisible | Yes | FEELS-DEAD |
| Mountain | `mountain-opening-hook`, `mountain-hook-glyph` | mountain-rescue-adventure.tsx:744–746, 899 | The winch hook (⚓) in Q3/Q4 openings and route stage — renders as plain text glyph, no size/swing | Yes | PAPERCUT |
| Mountain | `mountain-connected-quest` | mountain-rescue-adventure.tsx:1312, 1548, 1767 | Section hook for Q2–Q4 (styling arrives via sibling class) | No — plumbing | PAPERCUT |

**Dead CSS mirror (proof of the refactor gap):** world.css still styles the
*previous* generation of this scene — `.signal-beacon` and
`.signal-found .signal-beacon i` (world.css:2270, 2298, 2312) match markup no
component renders any more, and `.mountain-finale` (world.css:1707) is the
legacy overlay card the code comment at mountain-rescue-adventure.tsx:2029
explicitly dodges. The refactor renamed the world; the CSS was never renamed
with it.

### Other worlds

| World | Element / class | Evidence | What is missing | Child-visible? | Severity |
| --- | --- | --- | --- | --- | --- |
| Moonbase | `moonbase-opening-tenfold-telescope` / `-rebuild-coordinate` / `-two-mission-controls` / `-catch-the-comet` | moonbase-tenfold-adventure.tsx:151 | Per-quest theming of the opening scene — all four openings are pixel-identical | Yes | FEELS-DEAD |
| Moonbase | `moonbase-quest-<id>` (×4) | moonbase-tenfold-adventure.tsx:205 | Per-quest theming of the stage | Yes | FEELS-DEAD |
| Moonbase | `zoom-0` … `zoom-5` | moonbase-tenfold-adventure.tsx:220 | Telescope re-framing as the child zooms tenfold — only the `awake` ring borders (world.css:469) and the number react; no zoom motion at all | Yes | FEELS-DEAD |
| Moonbase | `level-0` | moonbase-tenfold-adventure.tsx:255 | Initial bundle-machine state (levels 1–4 styled, world.css:534) | No | PAPERCUT |
| Moonbase | `world-finale` | moonbase-tenfold-adventure.tsx:358 | Class has zero CSS in every world; the styled things are `.moonbase-finale`, `.night-run-finale`, etc. | No — plumbing | PAPERCUT |
| Balance | `tilt-left` / `tilt-right` / `tilt-level` (stage level) | balance-lab-adventure.tsx:412 | Stage-level tilt hooks; the actual tip lives on `.balance-world-machine.tipped[.tips-left]` (world.css:5726, 6294) so the beam does move — these are inert duplicates | No — plumbing | PAPERCUT |
| Balance | `status-left` / `status-right` | balance-lab-adventure.tsx:451 | The live-status pill only has a `.status-level` variant (world.css:6311); tipped states show the default look | Yes | PAPERCUT |
| Balance | `left-pan` / `right-pan` | balance-lab-adventure.tsx:438, 447 | Pan-side hooks (`.balance-world-pan` carries all styling) | No | PAPERCUT |
| Skatepark | `route-cyan` / `route-pink` / `route-parallel` | skatepark-adventure.tsx:605, 624, 986 | Route-colour hooks; runners animate via `.is-playing` descendants (world.css:4557–4570, 3333–3357) | No | PAPERCUT |
| Skatepark | `extension-play`, `quest-zigzag-lights` / `quest-inside-together` / `quest-reverse-check` / `quest-opening-ride` | skatepark-adventure.tsx:2457, 2485 | Per-quest theming for the four extension quests — all share the identical rooftop backdrop | Yes | FEELS-DEAD |
| Skatepark | `launched` (on `final-course`) | skatepark-adventure.tsx:2551 | Launch-state hook; only `.final-course.built` styled (world.css:7692), riders handled by conditional `.final-riders` | No | PAPERCUT |
| Skatepark | `night-run-route-test`, `beat-5` | skatepark-adventure.tsx:3335, 724/2292 | Redundant hooks (`night-run-action` and `speaker-*` rules cover them) | No | PAPERCUT |
| Shared | `quest-story-scene-bubble speaker-*` | quest-story-scene.tsx:275 | The shared engine emits a speaker class on the bubble; **no** `.quest-story-scene-bubble.speaker-*` rule exists — see §4 | Yes | FEELS-DEAD |
| Shared | `speaker-scout` | mountain-rescue-adventure.tsx:349, balance-lab-adventure.tsx:201, quest-story-scene.tsx:275 | SCOUT has zero speaker styling in any system in the app | Yes | PAPERCUT |
| Shared | `play-mountain`, `play-moonbase`, `play-opening` | adventure-play.tsx:132 | Unstyled — but `AdventurePlay` is no longer mounted for these worlds (grade-seven-adventures.tsx:96 excludes them); dead data, see §6 | No | PAPERCUT |

`StraightTrailScene` (Trail Meet) uses CSS modules; all 24 `styles.*`
references resolve — no holes in that scene's styling.

---

## 2. Static scenes (no visual state change per beat)

For each story scene: does ANY stage visual change per beat (beat-keyed CSS,
sprite swap, pose change)?

| World | Scene | Evidence | Beat-keyed visuals? | Voiced? | Severity |
| --- | --- | --- | --- | --- | --- |
| Mountain | Q1 opening (8 beats) | mountain-rescue-adventure.tsx:655–709; stage children 687–707 | **None.** Ridge, pod-at-+3, Nova, kid — all static across 8 voiced lines. `QuestStoryScene` puts `beat`/`speaker` on nothing but the bubble | Yes (8 clips) | BREAKS-STORY |
| Mountain | Q2 / Q3 / Q4 openings (3 beats each) | mountain-rescue-adventure.tsx:712–770 | **None** — same static template, only the pod label / hook glyph differs | Yes | FEELS-DEAD |
| Mountain | Finale (5 beats) | mountain-rescue-adventure.tsx:2027–2085; world.css:7742–7764 | **Yes** — aurora fade (beat 3–4), windows warm (beat ≥2), Pip pose change, pod docks, route traces. The one fully realised beat-keyed scene in the app | Yes | — (positive reference) |
| Moonbase | All 4 quest openings (3 beats each) | moonbase-tenfold-adventure.tsx:136–179 | **None** — static cast + static window; only the bubble repositions per speaker | **No voice at all** | FEELS-DEAD |
| Balance | All 4 quest openings (3 beats each) | balance-lab-adventure.tsx:304–382 | **None** — static machine + cast | No (`BALANCE_AUDIO_READY = false`, balance-lab-adventure.tsx:33) | FEELS-DEAD |
| Skatepark | Q2 opening/closing (`NightRunStoryPlay`, 6/4 beats) | skatepark-adventure.tsx:2194–2386; world.css:4107–4146 | **Yes** — speaking character raises per speaker, per-beat rider/nova/hero rules, canvas rail angle jumps at beat 3 (38°→63°, line 2213), Nova sprite swaps to parked/celebrate | Yes | — (positive) |
| Skatepark | Q3/Q4 openings/closings (`SkateQuestStoryPlay`) | skatepark-adventure.tsx:642–821; world.css:3518, 3836 | **Yes** — same speaker-raise system + one canvas-emphasis rule per variant; celebrate sprite in closings | Yes | — (positive) |
| Skatepark | Extension openings ×4 (Q5–Q8, 3 beats each) | skatepark-adventure.tsx:2453–2482 | **None** — static cast trio over rooftop; bubble repositions per speaker only (world.css:7488) | **No voice** | FEELS-DEAD |

Pattern: the two systems the panel already flagged. Everything driven by
`NightRunStoryPlay` / `SkateQuestStoryPlay` moves; everything driven by
click-through comics or the new `QuestStoryScene` is a wax museum — and
`QuestStoryScene` is the *newest* engine, so the regression is structural: it
exposes no beat/speaker hook on the stage wrapper (quest-story-scene.tsx:272)
for scene art to key off.

---

## 3. Narrated-not-shown (line references a visible event with no rendered counterpart)

| World | Scene · line | Evidence | What the child should see but cannot | Severity |
| --- | --- | --- | --- | --- |
| Mountain | Q1 opening: "Pip! The ribbon goes on the shelter—not your tail!" | mountain-rescue-adventure.tsx:129 | No Pip, no shelter, no ribbon in the opening scene (children: ridge, pod, Nova, kid — 687–707) | BREAKS-STORY |
| Mountain | Q1 opening: "The storm drained our energy cell. The shelter is getting cold." | mountain-rescue-adventure.tsx:139 | No shelter, no cell, no cold cue | BREAKS-STORY |
| Mountain | Q1 opening: "Replacement cell launching from the Service Deck!" | mountain-rescue-adventure.tsx:150 | Nothing launches; pod sits at +3 | BREAKS-STORY |
| Mountain | Q1 opening: "The pod went past us—and past Base Camp!" (the known example) | mountain-rescue-adventure.tsx:154 | Pod never moves; no Base Camp exists in the opening scene | BREAKS-STORY |
| Mountain | Q1 opening: "…its signal is fading in the ravine." | mountain-rescue-adventure.tsx:159 | No ravine, no signal | BREAKS-STORY |
| Mountain | Q1 step 2: "The signal is under this drift. Brush the snow away." | mountain-rescue-adventure.tsx:1041 | The drift is invisible (`signal-snowdrift` zero CSS; `--snow-left` unconsumed) | BREAKS-STORY |
| Mountain | Q1 step 2: "There it is! Pull the rescue strap with us." | mountain-rescue-adventure.tsx:1040 | No pod reveal (pod-site unstyled), strap unpositioned; only button-label % changes | BREAKS-STORY |
| Mountain | Q1 step 3: "Replay the rescue path. Watch where the sign changes." → button "Following +3 → 0 → −4…" | mountain-rescue-adventure.tsx:1044, 1189; world.css:2544 | Nothing replays: the recap CSS targets `.recap-running .signal-pod-control` / `.mountain-travelling-team`, neither of which Q1 renders, and the `recap-running` class is never applied to the Q1 stage (recapRunning only gates interactivity, 940–942) | BREAKS-STORY |
| Mountain | Q1 step 3: concept overlay ("ABOVE BASE CAMP POSITIVE +", route glow "+3 → 0 → −4") | mountain-rescue-adventure.tsx:632–644 | Gated on `state.routeRevealed`, which is **never set** anywhere (see §6) — the world-side payoff of "Nova names what you found" is unreachable | BREAKS-STORY |
| Mountain | Q2 opening: "Four checkpoint lights are blinking out of order!" | mountain-rescue-adventure.tsx:172 | No checkpoint lights in the opening scene | FEELS-DEAD |
| Mountain | Q3 opening: "The winch hook is swinging loose! … Every gust swings it up or down." | mountain-rescue-adventure.tsx:190–196 | Hook is a static text ⚓ (`mountain-opening-hook` unstyled); nothing swings | FEELS-DEAD |
| Mountain | Q4 opening: "Our winch can reverse the whole fall." | mountain-rescue-adventure.tsx:213 | No winch/fall visual; static pod labelled −4 | FEELS-DEAD |
| Moonbase | Q1 opening: "Beep-beep! I found the comet bloom—whoa, it is fast!" | moonbase-tenfold-adventure.tsx:59 | Comet is a static ✦ in the window; nothing is fast; Blink doesn't move | FEELS-DEAD |
| Moonbase | Q2 opening: "Bzzzt… coordinate pieces incoming!" / "They are arriving as tiny location units." | moonbase-tenfold-adventure.tsx:64–65 | Nothing arrives on stage | FEELS-DEAD |
| Moonbase | Q4 opening: "Two bright trails ahead—I can't tell which one is ours!" | moonbase-tenfold-adventure.tsx:74 | No trails in the opening (they only exist later as buttons) | FEELS-DEAD |
| Moonbase | Q1 stage: "Follow Blink's signal through the … zoom rings" / "Lock onto Blink's outer signal →" | moonbase-tenfold-adventure.tsx:35, 240 | `blink-signal` is statically placed (world.css:479); it neither recedes with zoom (`zoom-N` zero CSS) nor reacts to "lock" | FEELS-DEAD |
| Balance | Q1 opening: "The lab beam lost its balance." | balance-lab-adventure.tsx:100 | Opening machine (`balance-opening-machine`) is static decoration — not tipped, not the beam | FEELS-DEAD |
| Balance | Q3 opening: "The mystery crate is locked into the left pan with five extra blocks!" | balance-lab-adventure.tsx:137 | Opening scene shows the generic machine; no crate, no pans, no blocks | FEELS-DEAD |
| Skatepark | Q5 opening: "The beam made a secret Z across our rails!" | skatepark-adventure.tsx:2409 | Opening visual is rooftop + cast only — no beam, rails, or Z (2457–2468) | FEELS-DEAD |
| Skatepark | Q6 opening: "These two inside lights are trapped on the same side." | skatepark-adventure.tsx:2414 | No lights shown in the opening | FEELS-DEAD |
| Skatepark | Q7 opening: "…the tunnel stripes are fooling my eyes." | skatepark-adventure.tsx:2419 | No stripes/illusion in the opening (the board appears only after) | FEELS-DEAD |
| Skatepark | Q8 opening: "…eight roof lights are still dark!" | skatepark-adventure.tsx:2424 | No lights in the opening | FEELS-DEAD |

Counter-examples that DO show what they say (for calibration): mountain
finale beats (dock/windows/Pip/aurora, world.css:7747–7761), balance Q1–Q4
beam tip + block piles + recap animation (world.css:5726, 6476–6479),
skatepark Q2–Q4 route playbacks with skating runners (world.css:4557, 3333),
moonbase catch-the-comet trail choice and dome photo.

---

## 4. Speaker emphasis (does the active speaker get any visual emphasis?)

| Scene system | Evidence | Speaker emphasis | Severity |
| --- | --- | --- | --- |
| Skatepark `NightRunStoryPlay` / `SkateQuestStoryPlay` | world.css:4107–4109 (character raise + glow), 4173–4205 (bubble accent per speaker) | **Full** — speaking character lifts and brightens | — |
| `AdventurePlay` (shop/cricket) | world.css:1183–1188 | **Full** — speaker scales up, listener dims | — |
| Skatepark quest stages (`never-meet-dialogue`, `crossing-beam-dialogue`, `night-run-dialogue`) | world.css:3462–3494, 3798–3830, 4719–4733 | Bubble accent colour + tail per speaker only; the three character sprites never react | PAPERCUT |
| Moonbase `moonbase-comic` | world.css:358–363 | Bubble repositions toward the speaker; cast static; no highlight | FEELS-DEAD |
| Skatepark extension `extension-comic` | world.css:7488–7493 | Bubble repositions; cast static | FEELS-DEAD |
| **Shared `QuestStoryScene` bubble** (mountain Q1–Q4 openings + finale watch beats) | quest-story-scene.tsx:275 emits `speaker-*`; **zero** `.quest-story-scene-bubble.speaker-*` rules exist (world.css:7790–7817 style only the base bubble) | **None** — bubble identical for every speaker; only the `<small>` name changes. The stage wrapper gets no speaker class at all, so scene art cannot react either | FEELS-DEAD |
| Mountain `MountainComicLine` (all quest decks) | mountain-rescue-adventure.tsx:349; world.css:2124–2160, 2610 | **None** — one colour scheme for SCOUT, NOVA and YOU alike | FEELS-DEAD |
| Balance `BalanceComicLine` | balance-lab-adventure.tsx:201; world.css:6181–6218 | **None** | FEELS-DEAD |
| `speaker-scout` specifically | emitted at mountain-rescue-adventure.tsx:349, balance-lab-adventure.tsx:201, quest-story-scene.tsx:275 | Zero CSS anywhere in the corpus — SCOUT is the only recurring speaker with no styling in *any* system | PAPERCUT |

---

## 5. Click-through remnants ("Next line" manual advance)

Confirmed sites and beat counts:

| World | Site | Evidence | Beats behind it | Voice? |
| --- | --- | --- | --- | --- |
| Moonbase | `StoryOpening` "Next line →" / "Take control →" | moonbase-tenfold-adventure.tsx:166–176 (label 175) | 3 beats × 4 quests = **12 clicks per chapter** | None — moonbase openings have no audio wiring at all |
| Balance | `BalanceOpening` "Next line →" / "Start … →" | balance-lab-adventure.tsx:333–340, 376–378 | 3 beats × 4 quests = **12 clicks** | Disabled (`BALANCE_AUDIO_READY = false`, line 33) |
| Skatepark | `NightRunExtensionQuest` opening "Next line →" / "Build the next part →" | skatepark-adventure.tsx:2469–2479 (label 2478) | 3 beats × 4 extension quests = **12 clicks** | None |
| Shop/Cricket (shared) | `AdventurePlay` "Next scene →" | adventure-play.tsx:183–187 | 3 opening + 3 closing beats per world | None |

Not remnants (for the record): mountain uses the continuous `QuestStoryScene`
engine everywhere (openings at mountain-rescue-adventure.tsx:666, 733; finale
watch beats 2054); skatepark Q2–Q4 stories auto-advance on audio end
(skatepark-adventure.tsx:717–719, 2282) and only gate on an initial "Play"
click plus a final continue. So the manual click-per-line pattern survives in
exactly three places — moonbase openings, balance openings, and skatepark
extension openings — the same three systems that are also silent and static
(§2), i.e. the downgraded scene system the 08-02 panel called out is fully
localisable.

---

## 6. Dead / mismatched affordances

| World | Affordance | Evidence | Problem | Severity |
| --- | --- | --- | --- | --- |
| Mountain | `routeRevealed` | read at mountain-rescue-adventure.tsx:632, 640; declared/defaulted/migrated at src/lib/grade-seven-progress.ts:63, 405, 623; **no write site exists** | The Q1 concept-label overlay and route glow are unreachable UI | BREAKS-STORY |
| Mountain | Q1 recap button "Play the rescue route" | mountain-rescue-adventure.tsx:1182–1190 | Runs a 3.6 s timer + voice line, disables the stage, moves **nothing** (see §3); under reduced motion it silently sets `recapPlayed` with no pose/trace change either | BREAKS-STORY |
| Mountain | Q1 drag clamp vs copy | `Q1_SLED_START = 2` (mountain-rescue-adventure.tsx:408) clamps drag to +2 (line 488) while copy says "Move the pod from +3" (1120) and the nudge path allows +3 (978) | Drag and nudge disagree with each other and with the copy by one level | PAPERCUT |
| Mountain | `aria-label="Secured pod at minus four"` | mountain-rescue-adventure.tsx:602 | Announced as "secured" from step 0, before the child has found or secured anything | PAPERCUT |
| Mountain | Q3 marker "HOOK NOW" | mountain-rescue-adventure.tsx:1558 | Fixed marker at +1 labelled as the hook's current position; it does not follow the hook (which is the draggable control) | PAPERCUT |
| Moonbase | Stage counter `{questStep + 1}/4` | moonbase-tenfold-adventure.tsx:209 | Q1–Q3 jump `questStep` 0 → 3 (lines 240, 266, 299), so the counter reads 1/4 then 4/4 — 2/4 and 3/4 never exist (panel's "misleading counters", still true) | FEELS-DEAD |
| Moonbase | Comet trail B `selected` | moonbase-tenfold-adventure.tsx:322 | `.comet-trails button.selected` has no CSS (only `.correct`, world.css:620) — the wrong-trail tap gives zero visual feedback beyond the nudge text | PAPERCUT |
| Balance | "Voice being prepared" buttons | balance-lab-adventure.tsx:33, 206–210 | Every hear-line button in the chapter renders disabled with placeholder copy — an entire chapter of visible dead controls (intentional gate, still shipped UX) | FEELS-DEAD |
| Skatepark | Q5 zigzag corner buttons | skatepark-adventure.tsx:2502–2503 | Both "A" and "B" set the same `zigzagMatched` flag — one tap lights both corners while the copy says "Tap the two inside corners" (assert-not-enact, matches panel finding 5) | FEELS-DEAD |
| Skatepark | Q6 "Join both lights into a straight sweep" | skatepark-adventure.tsx:2528 | Button always enabled; no interaction gates it — the slider is decoration for a one-click reveal | FEELS-DEAD |
| Skatepark | `lightsAwake` | read at skatepark-adventure.tsx:502, 557, 3172; only default/migration writes (grade-seven-progress.ts:523, 791) | Never incremented; its canvas branch (step 0) is dead since Trail Meet became `StraightTrailScene` | PAPERCUT |
| Shared | `adventurePlayScripts` + `finaleCopy` for moonbase/mountain/balance/skatepark | adventure-play.tsx:21–99; grade-seven-adventures.tsx:66–73, 96 | `AdventurePlay` is mounted only for shop/cricket; four worlds of scripted dialogue and postcards are dead data (finaleCopy already flagged by panel; scripts newly confirmed) | PAPERCUT |
| Mountain (CSS side) | `.signal-beacon`, `.mountain-finale`, `.demo-beam.tipped` | world.css:2270–2312, 1707–1726, 1010 | Live CSS for markup that no longer exists — the inverse of §1's holes and the fingerprint of the same refactor | PAPERCUT |

---

## 7. Bible visual-rule violations detectable statically

Rules from docs/design/GRADE-7-MATHS-STORY-WORLD-BIBLE.md §2.

| Rule (Bible line) | Violation | Evidence | Severity |
| --- | --- | --- | --- |
| "The relevant quantity or relationship is the brightest, clearest object" (L118) | Mountain Q1: every story-relevant object (pod site, signal tracker, snowdrift, shelter, Pip, sled) has zero CSS while the decorative layer (weather, ridges, sky) is fully styled — the brightest objects on stage are scenery | world.css:2184–2246 styled vs §1 register | BREAKS-STORY |
| "Characters never float when the scene says they are skating, climbing, or carrying something" (L123) | Mountain Q1: copy says "You steer the rescue sled" while the sled/team block is unpositioned static flow content whose inline `top` cannot apply — the team neither rides the cable nor moves with the drag | mountain-rescue-adventure.tsx:410–450, 585; §1 | BREAKS-STORY |
| "An incident creates a problem the child can understand without narration" (L60) | Mountain Q1 opening: the entire incident (cell launch, overshoot past Base Camp, loss in ravine) exists only in voiced lines over a static scene; same for moonbase Q2/Q4 and skatepark Q5–Q8 openings | §3 register | BREAKS-STORY (mountain) / FEELS-DEAD (others) |
| "A multiple-choice answer, slider, or Next button cannot be the main learning action" (L75) | Skatepark Q6: slider + always-enabled button is the whole interaction; Q5 is a single tap | skatepark-adventure.tsx:2517–2531, 2502 | FEELS-DEAD |
| "Reduced-motion mode preserves every concept through pose, position, trace, focus, and colour changes" (L125) | Mountain Q1 recap under reduced motion sets `recapPlayed` with no pose/position/trace substitute — nothing existed to substitute for | mountain-rescue-adventure.tsx:986–990 | FEELS-DEAD |
| "The child avatar … performs" (L72) | Skatepark Q8 finale: performers are 🛹 emoji (`final-riders`), not the child's avatar or the character art used everywhere else | skatepark-adventure.tsx:2554; world.css:7693 | PAPERCUT |
| "Dialogue is performed beside the speaker" (L94) | Mountain and balance systems: one fixed bubble position for all speakers; no speaker art association (§4) | world.css:2124, 6181 | PAPERCUT |
| Positive compliance worth protecting | Mountain finale act ("The ending visibly resolves the problem", L62): dock, warming windows, Pip, aurora, route trace all enacted | world.css:7742–7764 | — |

---

## Summary matrix (world × hole class, entry counts)

| World | 1 Unstyled | 2 Static scenes | 3 Narrated-not-shown | 4 Speaker emphasis | 5 Click-through | 6 Dead/mismatched | 7 Bible | Worst severity |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Mountain Rescue | **16** (12 child-visible) | 4 scenes static / 1 dynamic | **13** | 2 systems with none | 0 | 5 | 4 | **BREAKS-STORY** |
| Moonbase Tenfold | 5 | 4 scenes static, all silent | 5 | bubble-position only | 12 clicks | 2 | 1 | FEELS-DEAD |
| Balance Lab | 4 | 4 scenes static, silent | 2 | none | 12 clicks | 1 | 1 | FEELS-DEAD |
| Skatepark (Q1–4) | 4 hooks | 0 (all dynamic) | 0 | full (stories) / bubble-only (stages) | 0 | 1 | 0 | PAPERCUT |
| Skatepark (Q5–8) | 2 | 4 scenes static, silent | 4 | bubble-position only | 12 clicks | 3 | 2 | FEELS-DEAD |
| Shared engines | 3 | `QuestStoryScene` structurally static | — | engine has none | 6 clicks (shop/cricket) | 1 | 1 | FEELS-DEAD |

---

## Biggest systemic cause

One pattern explains the majority of BREAKS-STORY rows: **the Mountain Q1
"signal rescue" refactor shipped its markup, state machine, copy, and audio —
but never its CSS layer.** world.css still styles the previous generation of
the same scene (`.signal-beacon`, the `.mountain-finale` overlay card,
`.demo-beam`), while the ~16 new class names the refactor introduced
(`signal-pip`, `signal-service-deck`, `signal-pod-site`, `signal-snowdrift`,
`rescue-sled-*`, `signal-tracker`, the three inline CSS custom properties, the
per-phase stage modifiers) have zero rules — so the incident is narrated, the
named character is mislaid, the child's vehicle cannot move, and the step-2/3
payoffs (drift, strap, flags, beacons, concept overlay) are invisible or
unreachable (`routeRevealed` is never set). The same release *did* finish the
finale act's CSS, which proves the intended bar and makes the Q1 gap look like
an interrupted commit rather than a design choice. The second-order cause is
the scene-engine split the panel already named, now measurable: every scene on
the voiced auto-skit engines has beat- and speaker-keyed visuals; every scene
on the click-through comics or the new `QuestStoryScene` engine has none,
because `QuestStoryScene` exposes no beat/speaker hook on its stage wrapper
for art to key off — static-ness is structural, not per-scene negligence. A
repo-level guard (a lint that fails when a component emits a class with no
matching CSS rule, plus one that greps for state fields with reads but no
writes) would have caught both classes of hole mechanically.
