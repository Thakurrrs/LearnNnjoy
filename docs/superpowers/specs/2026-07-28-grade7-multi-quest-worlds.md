# LearnNnjoy — Grade 7 Multi-Quest Story Worlds

**Status:** Skatepark is the reference experience. Mountain Rescue requires an
experience-parity redesign before Balance Lab or later worlds continue.

All implementation and review decisions in this specification must pass the
[Interactive Story Benchmarks](../../design/INTERACTIVE-STORY-BENCHMARKS.md).

## Product rule

Each Grade 7 chapter is one continuous story world containing several concept
quests. A chapter star is earned only after every quest in that world is
completed.

Every quest must follow the same learning rhythm:

1. **Story problem:** a character needs help for a reason that naturally uses the concept.
2. **Child action:** the learner changes or tests the mathematical object.
3. **Visible consequence:** characters act out the result inside the world.
4. **Concept name:** Nova names only the pattern the child has already seen.
5. **Transfer:** the same idea is used again in a changed situation.
6. **Recap:** a short visual replay explains the successful story action.

Moving a slider, tapping a choice, or entering a value is not sufficient by
itself. The world must visibly respond before the quest can finish.

## World 1 — Mountain Rescue

**Chapter idea:** Integers describe position and movement relative to zero.

| Quest | Story action | Concept evidence |
|---|---|---|
| 1. Signal Below Zero | Follow a damaged rescue pod from `+3`, through base camp, to `−4` | Positive, zero, and negative positions on one continuous vertical path |
| 2. Cliff Checkpoints | Place rescue markers at several signed altitudes and decide which is higher or lower | Comparing and ordering integers by position |
| 3. Storm Moves | Combine successive up/down wind movements and watch the pod’s final position | Integer addition as directed movement |
| 4. Rescue Winch | Reverse the fall and lift the pod from `−4` to the safe ledge at `+2` | Subtraction, inverse movement, and checking a route |

### Quest 1 deep slice

- Opening: the pod holds at `+3`; a storm knocks out the signal and it falls.
- Child predicts whether the missing signal will be above or below zero.
- Child drags the real pod down the cliff.
- The pod visibly crosses the gold base-camp line at zero.
- Nova and the learner travel alongside the pod rather than watching from a card.
- At `−4`, the beacon answers and the formal words **positive**, **zero**, and
  **negative** appear.
- A short replay shows `+3 → 0 → −4`; only then may the compact route
  `3 − 7 = −4` appear.
- The quest ends at the beacon and returns to the Mountain Rescue quest map.

## World 2 — Balance Lab

**Chapter idea:** An equation is a statement that two quantities are equal.

| Quest | Story action | Concept evidence |
|---|---|---|
| 1. Keep It Level | Load both pans until the beam settles | Equality is visible balance |
| 2. Same Move, Both Sides | Remove matching blocks while the characters watch the beam | Equal changes preserve equality |
| 3. Reveal the Crate | Undo the visible extra blocks to isolate the mystery crate | Inverse operations reveal an unknown |
| 4. Test Another Lock | Repeat the move on a different balanced lock | The balance rule transfers to a new equation |

The crate opening is the story result. Selecting `x = 7` is never the primary
experience.

## World 3 — Smart Shopper

**Chapter idea:** A percentage is a visible part of a whole; the amount paid
depends on both the whole and the part removed.

| Quest | Story action | Concept evidence |
|---|---|---|
| 1. Split the Whole | Divide a real price strip into equal pieces | Fraction and percentage as part of one whole |
| 2. Lift the Discount | Remove the discounted pieces from the price strip | Discount amount is part of the original price |
| 3. Final Price Race | Carry the remaining price to each shop counter | Compare final prices, not sign size |
| 4. Different Wholes | Apply the same percentage to differently sized wholes | Same percent can mean different rupee amounts |

## World 4 — Cricket Data Room

**Chapter idea:** A graph makes values visible and supports evidence-based
comparison.

| Quest | Story action | Concept evidence |
|---|---|---|
| 1. Build the Scoreboard | Raise each bar to match a player’s runs | Bar height represents value |
| 2. Read the Match | Move a scan line across bar tops | Values can be compared visually and numerically |
| 3. Fair Squad | Selected players walk from their bars onto the field | A data-backed choice connects chart and outcome |
| 4. Score Update | New match data reshapes the bars and changes the decision | Conclusions must update when data changes |

## Shared implementation gates

- One quest map per chapter, using the Skatepark map’s save and lock model.
- Typed, migration-safe device progress for current quest, opened quests,
  interaction state, and chapter completion.
- Real character assets; no emoji or CSS-built characters in the live story path.
- Short pre-generated character audio. No browser speech voice in the child-test path.
- Home, resume, Previous, Journal replay, and reduced-motion equivalents.
- No duplicate coins, streaks, discoveries, or completion during replay.
- Phone-first QA at `375 × 812`, then desktop QA.
- Full lint, tests, and production build before a chapter is considered ready.
