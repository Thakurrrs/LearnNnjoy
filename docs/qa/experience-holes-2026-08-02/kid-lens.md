# Kid-Lens Experience Audit — 2026-08-02

Played as a curious, easily-bored 12-year-old on localhost:3000. Fresh profile ("Kavi", Grade 7) for
Nova's Night Run → Moonbase Tenfold → Balance Lab, then a second fresh profile ("Mira", Grade 7,
girl explorer) for Mountain Rescue start → finale. Every claim below was seen live in the browser;
file/line references were verified in source afterwards.

Severity key:
- **BREAKS-STORY** — the kid stops believing, gets stuck, or the promise of the story is broken.
- **FEELS-DEAD** — nothing responds, nothing moves, or the kid is a button-pressing spectator.
- **PAPERCUT** — small, but it stacks.

---

## Holes register

| # | World | Quest / Scene | What a kid sees | What a kid SHOULD see | Severity |
|---|-------|---------------|-----------------|----------------------|----------|
| 1 | Night Run | Chapter map vs Q4 ending | Map says "0 OF 8 QUESTS · Eight connected quests build one opening-night ride". After Quest 4: "CHAPTER COMPLETE — Four quests. One connected line world. +25 coins. Light the Lines & Angles star". Q2's save card even says "The chapter star lights after all four rooftop quests" (`skatepark-adventure.tsx:2181,3398`) | One consistent count. If the world is 8 quests, the chapter completes after 8; the celebration and star-lighting come at the real end | BREAKS-STORY |
| 2 | Night Run | Quest 4 copy | Q4 opens with "One last show—the gold spotlight is stuck!", ends with "STORY ENDING · The Night Run finale", "Night Run complete!", button "Run the finale" — then four more quests exist | Q4 should read as a mid-season beat, not a finale. All "final/last/complete" language belongs on Q8 | BREAKS-STORY |
| 3 | Night Run | Quests 5–8 (whole back half) | Hard engine downgrade: the rooftop world, animated riders and voices vanish. Q5–Q8 are a flat neon **diagram on a grid** with a side control panel; the three characters shrink to one static sticker group in a corner; the "ride" is a ~16px skateboard emoji sliding along a line; openings/closings are silent click-through "Next line →" cards | The same world as Q1–Q4: rooftop, voiced characters, riders actually skating what I built | BREAKS-STORY |
| 4 | Night Run | Q2–Q4, every "test/ride" moment | When I press "Test the two paths" / "Ride the twin lanes" / "Test the spotlight path", the bottom control panel **expands and covers the stage** — the riders skate BEHIND the panel. "It worked: same direction, same gap, no meeting" appears while the thing it describes is hidden. Same with the pink rail and second crossing ("two meeting points!" with one of them off-screen behind the panel) | The panel should collapse or the stage should shift up during runs; the payoff animation is the entire reward | FEELS-DEAD |
| 5 | Night Run | Q2 scene 3 "Build a Straight Exit" | Tapping anywhere that is not the two exact circles gives zero feedback (no wiggle, no sound, no hint). I tapped an in-between spot and thought the game froze | Wrong-tap wiggle + a soft "not that corner" line | FEELS-DEAD |
| 6 | Night Run | Every story scene | A "Play with sound" button gates EVERY story scene (Q2 opening, Q2 ending, Q3 opening, Q3 ending, Q4 opening…). I chose sound once; the game keeps asking | Ask once per session; auto-continue with sound after the first consent | PAPERCUT |
| 7 | Night Run | Quest-complete buttons | "Back to Skatepark quests →" does NOT go to the quest map — it launches Quest 3's story. "Finish Quest 3 →" launches Quest 4's opening. "Replay the repair →" (Balance) is actually the continue button | Labels that tell the truth ("Next: The twin-lane launch →"). Continuous flow is good — lying labels are not | PAPERCUT |
| 8 | Night Run | Q3 scene 2 "Move Apart, Stay Parallel" | Nova: "Obstacle ahead! Slide your rail farther" — there is **no obstacle anywhere on screen**, before or after | Show a crate/cone/anything on the lower lane that the wider gap avoids | FEELS-DEAD |
| 9 | Night Run | Speech bubbles | Bubbles are pinned per-speaker to fixed corners. Nova's bubble stays top-left while Nova skates on the right; label says "Kavi" while the bubble tail points at Nova; the same player is "Kavi" in quest scenes but "YOU" in Q5–8 scenes | Bubble anchored to (or pointing at) the character who is speaking; one consistent player name | PAPERCUT |
| 10 | Night Run | Post-chapter → Q5 bridge | After the big chapter-complete card, the reward is a static scene where I click "Next line →" three times while nobody moves, then a worksheet. "The beam made a secret Z across our rails!" — no Z, no rails, no beam in shot | The celebrated star lighting + the Z actually drawn across the world | FEELS-DEAD |
| 11 | Night Run | Q8 "Opening Ride" finale | "Opening crowd is here—and eight roof lights are still dark!" — no crowd, no roof, no lights; then the finale is ONE button ("Connect the eight-light course") and a text card. The 8-quest arc ends with three skateboard emojis on a diagram | A crowd, the rooftop, eight lamps lighting one by one as each learned pattern fires, riders doing the run | BREAKS-STORY |
| 12 | Night Run / all worlds | Star map return | Back on the constellation the completed star is lit, but the detail card still shows the pre-play invite ("Kavi! Two riders want to perform a mirrored glow trick. Help me map their crossing paths?") with the same "Open Skatepark quests →" CTA. No landing celebration, no "next star" nudge | "You lit Lines & Angles! ⭐ Next closest star: Data Handling →" | FEELS-DEAD |
| 13 | Star map | Tapping a star | Tapping a bright star visibly does nothing — the detail card renders below the fold with no auto-scroll. I tapped twice thinking it was broken | Scroll-into-view or grow the card beside the star | PAPERCUT |
| 14 | Moonbase | All 4 quest openings | The exact same static tableau (dome, Nova, kid, comet) for every quest's opening; manual "Next line →" clicking; no voice anywhere in this world. Lines describe things that never appear: "coordinate pieces incoming!", "Two bright trails ahead" — no pieces, no trails | Each opening changes something visible; beats auto-play like the skatepark engine | FEELS-DEAD |
| 15 | Moonbase | Q1 "The Telescope Wakes" | Slider zooms rings 6 → 6,00,000 — decent — but at max zoom the rings dim to nothing, "Blink's outer signal" is never shown on the rings, and the header jumps 1/4 → 4/4 in one slide | Blink's blip appearing at the outer ring; progress that counts 2/4, 3/4 | FEELS-DEAD |
| 16 | Moonbase | Q2 "Rebuild the Coordinate" | Ten shiny unit tiles that LOOK tappable are inert — instruction even says "Click ten matching location units", but only the side button ("Bundle ten into one tens →") works. Pressing it 5 times shows the same ten chips with new labels, then 6,42,38,510 materialises from nowhere | Tiles that respond to taps; bundles visibly merging; the coordinate digits assembling piece by piece | FEELS-DEAD |
| 17 | Moonbase | Q2 labels | "10 units → 1 ten s", "Bundle ten into one **tens** →", "one **ten-thousands**", "10 hundreds → 1 thousands" | "1 ten", "1 thousand" — grammar a 12-year-old will mock | PAPERCUT |
| 18 | Moonbase | Q3 "Two Mission Controls" | No question, no instruction visible; two panels that highlight when clicked, then one button. The whole quest is three forced clicks — zero thinking required | At least one real choice (e.g. "Which display is the bigger number?" — trick: they're equal) | FEELS-DEAD |
| 19 | Moonbase | Q4 completion | "MISSION COMPLETE — The whole moonbase lights up with your photograph" — the moonbase does not light up; the background is unchanged. Story goal was "find Blink"; no reunion is shown | The dome actually glowing, Blink landing next to Nova | FEELS-DEAD |
| 20 | Balance Lab | Q1 "Keep It Level" | **Stuck point.** Instruction: "Load both pans until the beam settles." At 2+2 the beam IS settled, HUD says "2 matches 2" — but "What did the beam show? →" stays disabled with no explanation. Gate requires exactly 3+3 (`balance-lab-adventure.tsx:560–561,628`). I only got past it by reading the source | Either any balanced pair advances, or the copy says "fill both pans (3 each)" and the button hints "keep loading…" | BREAKS-STORY |
| 21 | Balance Lab | Every dialogue card | "Voice being prepared" printed under every single line — a dev status note shipped to kids, in a world where the other flagship worlds talk | Ship the voices or hide the note | FEELS-DEAD |
| 22 | Balance Lab | All openings | "SCOUT" speaks but there is no scout on screen (only Nova + kid). Opening art contradicts the words: scout says "The beam is level" over a tipped beam; Q3 scout says "the crate is locked into the left pan with five extra blocks" over two empty pans | Show the scout (helicopter? radio?) and make opening art match the line being said | FEELS-DEAD |
| 23 | Balance Lab | Q1 scene 3 | Pans are empty ("0 matches 0") while the big equation display underneath still shows "4 = 4" from the upcoming target — two contradicting readouts stacked | Clear or grey the equation until it's proven | PAPERCUT |
| 24 | Balance Lab | Beam tipped state | When the beam tips, the lowered pan sprite covers the status pill — "5 does not match 6" is unreadable exactly when it matters | Raise the pill's z-index / move it out of the beam's arc | PAPERCUT |
| 25 | Mountain | Quest 1 "Chase the Lost Signal" | **The world never moves.** "Down 1" seven times: the level chip counts +3→−4, Nova narrates a descent, tracker text changes — but the pod sprite sits pinned at SERVICE DECK+3 the whole time. Then "brush the snowdrift" = mash a button watching "40% cleared" (no snow anywhere; the "❄Brush the snow" text is literally selectable inert text). Then "There it is!" — nothing appears. Then "pull the strap" = 4 more mashes, nothing shown | The pod sliding down the cliff line level by level, snow being scrubbed off an actual drift, the pod emerging | BREAKS-STORY |
| 26 | Mountain | Q1 "Mark the real locations" | Quest says "Tap Ridge Shelter at +2" — the Ridge Shelter tap target is **physically hidden underneath the "QUEST 1 · CHASE THE LOST SIGNAL" title chip** (`.signal-stage-hud` intercepts the click; verified with elementFromPoint). A mouse kid cannot complete this step by tapping what they can see | The HUD chip must not cover interactive world targets | BREAKS-STORY |
| 27 | Mountain | Q1 flag feedback | When a flag does get placed, the only world change is a ~10px ⚑ glyph beside "RAVINE−4" | A planted flag with a little animation at both locations | PAPERCUT |
| 28 | Mountain | Q3 "Storm Moves" | "HOOK NOW +1" label is pinned on the cliff from the very start — it spoils the final answer, and it stays "+1" even while the hook is actually at +3, then +2. Two contradicting numbers on screen | The label should track the hook (or appear only at the end) | FEELS-DEAD |
| 29 | Mountain | Quests 2–4 (for contrast) | These are the best moments in the app: tapping camps IN the world, pod + team physically travel, routes draw on the altitude rail | This is the bar. Q1 and the other worlds should feel like this | — |
| 30 | Mountain | Finale "dock" scene | After the whole rescue, the screen collapses to a near-empty dark rectangle: a small grey panel, an emoji pod, a dashed outline, a fox sprite. Looks unfinished/broken | The shelter interior, the team arriving, the dock glowing | BREAKS-STORY |
| 31 | Mountain | Postcard epilogue | Postcard names "Pip" — the white fox that sat unexplained in the corner of Q1 and reappeared at the dock. First time the kid ever hears the name | Introduce Pip in the intro ("our shelter fox") so the payoff lands | PAPERCUT |
| 32 | Mountain | Nova's last line | "One postcard for your journal. **Tomorrow**, a new star starts glowing." — but the other stars are playable right now. A literal kid closes the app and waits a day | "Another star is glowing right now — want to see?" | PAPERCUT |
| 33 | Mountain | Q1 labels | Label collisions at 1280px: "SERVICE DECK+3" clipped by the panel corner, "RIDGE…" hidden behind the quest chip, "POD SIGNAL"+"SEARCHING" strings colliding, "REFERENCE ZERO" chip overlapping the CAVE −1 chip in Q2 scene 3 | Collision-free HUD labels | PAPERCUT |
| 34 | Night Run | Q6 "Inside Together" maths | Skill chip says "Same-side interior angles" but the diagram shows ONE rail + one crossing line — 107° + 73° is a linear pair, not same-side interior (needs two parallel rails) | Draw the second rail so the name matches the picture | PAPERCUT |
| 35 | Infra | Mid-session | The dev server died mid-quest (ERR_CONNECTION_REFUSED); the app showed a solid black page with no error/reload UI. (Resume-after-reload worked perfectly once the server was back — save system is genuinely good) | A friendly "lost connection — tap to retry" screen | PAPERCUT |

---

## Top 10 things that would lose a bored 12-year-old

1. **Quests 5–8 of Night Run turn into a worksheet.** The world, the voices and the riders disappear mid-story; the "ride" becomes a tiny emoji on a grid. The back half of the flagship world feels like homework wearing the game's colors.
2. **"Chapter complete!" halfway through.** Star, coins and celebration fire after Q4 while the map still says 8 quests, and Q4 keeps calling itself "the finale". The kid either stops (thinks it's done) or feels cheated (the celebration was fake).
3. **Mountain Q1: the mountain ignores you.** Seven Down-presses, a % brush meter and a strap-pull where the only thing that ever changes is a number chip. First playable minutes of the world teach the kid "my actions don't do anything here".
4. **The Ridge Shelter tap target is under the quest-title chip.** The quest says "tap it"; the UI physically eats the tap. Softlock-by-overlay.
5. **Balance Lab's dead continue button.** Beam balanced, HUD says "2 matches 2", button stays grey, no hint that it wants 3+3. A kid mashes twice and quits.
6. **The skate runs happen behind the control panel.** Every "watch it work" payoff in Night Run Q2–Q4 is hidden by the expanding panel at the exact moment it plays.
7. **Moonbase has no decisions.** Three of four quests are "press the only enabled button N times"; the shiny tiles that look tappable are inert. First real choice arrives in Quest 4.
8. **"Voice being prepared" + an invisible SCOUT.** Balance Lab openly tells kids its voices aren't done, while a character who isn't on screen narrates.
9. **Endings that shrink instead of swell.** Night Run's 8-light finale is one button + a text card; Mountain's dock scene is a near-empty black box; Moonbase's "the whole moonbase lights up" lights nothing up.
10. **Nothing pulls you to the next star.** Completed stars keep their old "help me!" invite, no celebration on the map, and Nova literally says the next star glows "tomorrow".

---

## World verdicts (would I open this again tomorrow?)

**Nova's Night Run (Lines and Angles).** The first four quests are the real thing — I drew a line and my
skater actually rode it, the trails glowed, people talked to me by name, and I wanted the next crossing.
Then the game quietly swapped itself for a diagram with a slider and my crew became a sticker. If I only
played Q1–Q4 I'd come back tomorrow for sure; if I hit Q5 first I'd say "this turned into school" — and the
game TOLD me I was done at Q4 anyway, so I'd probably stop exactly where the good part ends. Fix the
count, keep the engine, and this is the best thing here.

**Moonbase Tenfold (Large Numbers).** Looks pretty, plays hollow. Nobody speaks out loud, every quest
starts with the same picture, and mostly I pressed the one button that wasn't grey. The zoom-rings idea is
cool for about ten seconds, and the trail-choice in Q4 was the only time my brain got asked anything. Would
I open it again tomorrow? No — I already saw everything it does, and it never once needed *me*.

**Balance Lab (Simple Equations).** Honestly the smartest teaching in the app — the crate-on-the-scale
mystery is a genuinely good "what's x?" moment, and the beam really tips and settles. But it also got me
STUCK on quest one with a grey button and no reason, every card says "Voice being prepared" like the game
isn't finished, and some invisible "Scout" keeps talking over pictures that don't match. I'd come back —
but only after someone un-sticks that button and gives Scout a body.

**Mountain Rescue (Integers).** Split personality. Quests 2–4 are the best minutes in the entire app —
tapping camps on the actual cliff, the pod flying up the number rail, storms dragging the hook — real
cause-and-effect, real climb. But the FIRST quest is numbers changing next to a frozen poster, with snow
you can't see and a shelter you can't tap, and the ENDING is an empty black box before one nice aurora
postcard from a fox I'd never been introduced to. A kid has to survive the worst quest to reach the best
ones. Fix Q1 and the dock, and this is the world I'd replay.
