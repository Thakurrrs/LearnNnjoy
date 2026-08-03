# LearnNnjoy — Nova Presence and Interactive Story Implementation Plan

**Status:** Draft for product review. No implementation should begin until the Phase 0 concept stories and visual direction are selected.

**Product:** LearnNnjoy
**Initial scope:** The five existing Grade 7 Maths adventures
**Reference principle:** Borrow Duolingo's consistent character presence and immediate emotional feedback, but retain LearnNnjoy's adventure worlds and concept-first Maths teaching.

## 1. Goal

Make Nova and the child's avatar feel alive throughout each adventure while reducing the amount of text a child must read before acting.

LearnNnjoy is a **concept-understanding application**, not a Maths problem-solving or exam-practice application. The story, characters, manipulation and animation exist to help a child form an intuitive mental model of a concept. Questions are used only as light opportunities to notice, predict, explain or demonstrate that mental model.

The finished experience should feel like:

> A character needs help, the child changes the world, the Maths becomes visible, and both characters react to what the child discovered.

It must not become:

> A sequence of ordinary questions decorated with mascot celebrations.

## 2. Product principles

1. **Maths changes the world.** Every important animation must demonstrate a mathematical relationship, show the result of a child action, guide attention, or express a story consequence.
2. **Nova is a learning companion.** Nova is curious, expressive, occasionally puzzled, and grateful. Nova never shames, threatens, begs for streaks, or looks disappointed in the child.
3. **The child is the actor.** The selected avatar appears inside the story and performs the action the child controls.
4. **Show first, explain second.** Use visible change, a short Nova line, an optional deeper explanation, and another situation where the same concept can be noticed.
5. **Emotion must be brief.** Reactions should normally last 0.4–1.5 seconds. No unskippable celebration should delay the next learning action by more than two seconds.
6. **Conceptual understanding comes before symbolic procedure.** A formula or number sentence labels something the child has already experienced visually; it must not become the main activity.
7. **Animation cannot replace teaching.** A child must still notice, predict, manipulate, describe and recognise the concept in another situation.
8. **Private and pressure-free.** No parent surfaces, leaderboards, social comparison, guilt messaging, or public profiles.
9. **Mobile is the primary constraint.** The main mathematical object and the next action must be visible together on a 375 × 812 screen.

## 3. Story selection rule

The five current stories are **provisional**, not protected. A title, plot, setting, character role or event sequence may be rewritten or replaced when a different story makes the concept easier to experience.

A story earns its place only when:

1. The core concept can be seen before Nova explains it.
2. The child's physical action mirrors the concept.
3. The story consequence changes because of that concept.
4. Nova has a believable reason to need the child's help.
5. The setting supports a second encounter with the same concept.
6. The story remains inclusive and does not assume gender.
7. Entertainment focuses attention on the concept instead of competing with it.

Before visual production, every adventure needs a one-page **Concept Story Blueprint**:

```text
Concept truth:
Common misunderstanding:
What visibly changes:
Why Nova needs help:
What the child avatar does:
What the child should notice:
When the concept is named:
Where the child sees it again:
How the story resolves:
```

If this blueprint feels forced, the story must change before animation work begins.

## 4. What the current architecture already gives us

### Keep

- `GradeSevenInteractionState` and its typed state for all five adventures.
- Device-only persistence, exact-event resume, previous-scene navigation, Journal and replay mode.
- Replay reward protection.
- The continuous-world engine and the mathematical objects that remain concept-accurate after the story review.
- `WorldHud`, sound mute state, reduced-motion foundations and semantic labels.
- World-specific palettes from the Lumina design system.
- Existing avatar portraits and personalisation by name.

### Refactor

- `AdventurePlay`: currently three text-led beats over a mostly static stage.
- `WorldNova`: currently a star icon plus a dialogue card.
- `WorldActionDeck`: currently carries too much text and sits below very tall mobile scenes.
- World stages: characters need to react to the existing mathematical state.
- `SparkleBurst`: celebration should be one part of a character reaction, not the main emotional event.
- Adventure titles, plots, stakes and event sequences when the Concept Story Blueprint exposes a weak concept fit.

### Remove or defer

- The CSS-built rabbit-like Nova mascot once final Nova assets exist.
- Emoji stand-ins for visible story characters and major world objects.
- Hand-control beta during the child-test release.
- Extra cosmetic, currency or streak features until the learning loop is validated.
- Three forced intro slides every time a child replays an event.

## 5. The shared learning-and-character loop

Every adventure will use the same six-moment structure:

| Moment | Learning purpose | Nova | Child avatar |
|---|---|---|---|
| Invite | Establish a concrete problem | Arrives with visible concern | Enters and notices the problem |
| Notice and predict | Activate intuition before instruction | Asks what the child thinks will change | Points, places or chooses an expected result |
| Manipulate | Let the child change the Maths | Watches the mathematical object | Drags, tilts, sorts, removes or selects |
| Make meaning | Connect the visible result to concept language | Names what changed in one sentence | Indicates the important relationship |
| See it again | Reveal the same concept in a different situation | Encourages the child to notice the connection | Recreates or recognises the same relationship |
| Discover | Close the story and restate the mental model | Celebrates the discovery | Performs the successful story action |

This structure maps onto the existing five saved events. It does not require turning each event into a longer lesson.

There is no “worksheet section” at the end. Evidence of understanding comes from what the child predicts, changes, notices and explains inside the story.

## 6. Nova's personality and reaction system

Nova should have seven reusable states:

```ts
export type NovaMood =
  | "idle"
  | "concerned"
  | "curious"
  | "thinking"
  | "encouraging"
  | "surprised"
  | "celebrating";
```

The child's actor should have five reusable actions:

```ts
export type HeroAction =
  | "enter"
  | "observe"
  | "point"
  | "manipulate"
  | "celebrate";
```

Shared story cues:

```ts
export type CharacterCue = {
  id: string;
  speaker: "nova" | "hero" | "together";
  novaMood: NovaMood;
  heroAction: HeroAction;
  line: string;
  focusTarget?: string;
  sound?: "notice" | "think" | "encourage" | "discover";
  importance: "ambient" | "teaching" | "story";
};
```

Rules:

- Character reactions are derived from the saved mathematical state.
- Ambient animation state is not persisted.
- No cue may determine whether an answer is correct; the existing pure Maths functions remain authoritative.
- Failed attempts use `thinking` or `encouraging`, never sadness, alarm directed at the child, or red failure styling.
- The same cue must work without audio.

## 7. Proposed component architecture

Create:

```text
src/components/characters/
  character-stage.tsx
  nova-character.tsx
  hero-actor.tsx
  speech-bubble.tsx
  discovery-reaction.tsx

src/lib/
  character-cues.ts
  grade-seven-character-scripts.ts

public/images/characters/
  nova/
  heroes/
```

### `NovaCharacter`

- Receives `mood`, `world`, `speaking` and `reducedMotion`.
- Renders a real transparent character asset.
- Uses small transforms such as float, lean, hop and recoil around that asset.
- Does not construct Nova from CSS shapes or emoji.

### `HeroActor`

- Uses the selected avatar identity.
- Shows a consistent full-body or three-quarter actor pose.
- Supports the five shared actions.
- Interest-based equipment can be layered later, but gender must not control story content.

### `CharacterStage`

- Places Nova, the hero and a speech bubble inside the active world.
- Provides a visible focus relationship between the character and mathematical object.
- Keeps character placement responsive and away from controls.
- Supports captions and reduced motion.

### `SpeechBubble`

- Shows one idea at a time.
- Target: 6–14 words, maximum 16 for Grade 7.
- Provides replay-audio control when recorded narration is available.
- Offers an optional “Why?” expansion for the deeper explanation.

### `DiscoveryReaction`

- Plays only for a concept discovery, a meaningful connection or the finale.
- Does not play for every tap.
- Has a reduced-motion replacement using pose and colour change.

## 8. Asset approach: free, reusable and achievable

The pilot will not use full animated videos or a paid animation studio.

Use a **pose-based 2D system**:

- 7 transparent Nova poses matching the Nova character sheet.
- 5 reusable hero actions for each selected avatar style.
- 1–2 world-specific prop or effect assets where an existing real asset is missing.
- Browser motion moves real assets between poses; it does not draw characters with CSS.
- Export compact WebP/PNG assets and preload only the current world's set.

Before implementation, generate exactly three image-based visual directions from the existing LearnNnjoy screenshots:

1. **Companion overlay:** Nova and the hero sit close to the learning object while the current world composition remains mostly unchanged.
2. **Actors inside the world:** Nova and the hero are visibly staged inside the environment and move around the mathematical object.
3. **Hybrid story stage:** cinematic opening/closing, compact character reactions during manipulation.

The recommendation is expected to be the hybrid, but it must be selected from rendered options rather than assumed.

## 9. Provisional adventure-by-adventure mapping

These mappings are starting hypotheses. Phase 0 may rewrite or replace any story after comparing it with the concept target.

### Mountain Rescue — Integers

- **Invite:** Nova's radio flickers; the pod visibly drops from +3.
- **Predict:** Nova asks whether the lost signal should be above or below zero.
- **Manipulate:** The child avatar operates the winch while the child drags the pod.
- **Explain:** Nova points to the zero line; moving down changes the value through zero into negatives.
- **See it again:** A second rescue marker moves in the opposite direction. Only after the movement is understood does Nova reveal `3 − 7 = −4` as a compact way to describe the journey.
- **Discover:** The child avatar pulls the pod onto the safe ledge; Nova's glow returns.

**Concept target:** negative and positive numbers represent positions and direction relative to zero. Solving integer exercises is not the goal.

### Balance Lab — Simple Equations

- **Invite:** Nova tries to open the crate; the beam visibly tips.
- **Predict:** The child chooses whether removing from one or both sides keeps it fair.
- **Manipulate:** The child avatar removes matching blocks while Nova watches the beam.
- **Explain:** Nova names equality only after the beam demonstrates it.
- **See it again:** A different pair of balanced objects changes together so the child recognises that equality survives equal changes.
- **Discover:** The crate opens and Nova reveals the hidden value.

**Concept target:** an equation behaves like a balance; changing both sides in the same way preserves equality. Producing `x = 7` is a story consequence, not the lesson's primary purpose.

### Smart Shopper — Comparing Quantities

- **Invite:** Nova looks between two competing shop signs.
- **Predict:** The child estimates which offer may be cheaper before calculating.
- **Manipulate:** The child separates the ₹240 price bar and removes one quarter.
- **Explain:** Nova connects `25%`, `1/4` and `₹60`.
- **See it again:** Another whole is divided into different equal parts so the child recognises percentage as a portion of a whole, not merely a discount formula.
- **Discover:** The child avatar pays ₹180 and hands Nova the expedition kit.

**Concept target:** a percentage is a visible part of a whole, and final price depends on both the original whole and the part removed.

### Skatepark Architect — Parallel and Intersecting Lines

The current 60° ramp and triangle sequence is replaced. The current NCERT Grade 7
progression separates *Parallel and Intersecting Lines* from the later triangle
chapter, and one short story cannot give the full line-relationships chapter
enough conceptual depth.

Skatepark becomes a three-quest chapter world:

1. **Crossing Rails:** intersecting lines, vertically opposite angles and linear pairs.
2. **Rails That Never Meet:** parallel and perpendicular lines.
3. **The Crossing Beam:** a transversal and corresponding-angle patterns.

The first vertical slice is **Nova's Night Run — Crossing Rails**:

- **Invite:** Nova and the child begin the opening ride; the glowing night course loses its light pattern at a crossed rail.
- **Predict:** The child predicts which openings change when one rail turns.
- **Manipulate:** The child rotates the rail and watches all four angles change as a connected system.
- **Explain:** A glowing angle tracing fits its opposite; Nova reacts in teammate language, then the formal term appears visually.
- **See it again:** Neighbouring light pieces join into a straight half-turn, then both relationships reappear on a differently oriented crossing during the ride.
- **Discover:** The final track lights up; Nova and the avatar ride together before a short visual recap.

**Concept target:** crossing straight lines create dependable angle relationships.
The child experiences and transfers those relationships without first solving an
unknown-angle calculation.

**Detailed blueprint:** `docs/superpowers/specs/2026-07-28-skatepark-concept-story-blueprint.md`

### Cricket Data Room — Data Handling

- **Invite:** Nova nearly chooses friends rather than using evidence.
- **Predict:** The child predicts which player has the highest score.
- **Manipulate:** The child taps bars; selected players visibly enter the field.
- **Explain:** Nova compares the bar tops and printed values.
- **See it again:** Changed match data reshapes the bars and the child notices how the visual comparison changes.
- **Discover:** The selected squad walks onto the field; Nova thanks the child for making a fair choice.

**Concept target:** a bar's height represents a value and supports an evidence-based comparison. Answering graph questions is not the primary experience.

## 10. Text-reduction rules

### Visible at one time

- One short Nova line.
- One activity instruction.
- One optional explanation.
- One primary action.

### Replace

```text
Heading + description + Nova card + embedded question + button explanation
```

with:

```text
Nova reaction + direct action + visible consequence + optional Why?
```

### Do not remove

- Mathematical vocabulary after the child has seen the concept.
- Captions.
- The explanation of why an unsuccessful attempt did not work.
- A second opportunity to recognise or recreate the concept in a new situation.
- The final retrieval statement.

## 11. Phased delivery

### Phase 0A — Lock concept stories

- Write the Concept Story Blueprint for all five Grade 7 concepts.
- Identify the exact mental model each story must create.
- Compare the current story with at least one alternative where the concept fit is questionable.
- Keep, rewrite or replace each story based on concept clarity—not sunk implementation effort.
- Convert the selected story into six beats: Invite, Notice, Manipulate, Make meaning, See it again, Discover.
- Review the five stories together for variety, inclusivity and repeated plot patterns.

**Deliverable:** five approved concept-first story blueprints.

### Phase 0B — Select the visual target

- Capture the current Skatepark desktop and mobile states.
- Generate exactly three image-based Nova/hero presence directions.
- Evaluate character visibility, Maths visibility, mobile fit and production repeatability.
- Select one direction before changing code.

**Deliverable:** selected visual reference for the vertical slice.

### Phase 1 — Build the shared character foundation

- Add real Nova and hero pose assets.
- Build `NovaCharacter`, `HeroActor`, `CharacterStage` and `SpeechBubble`.
- Add the typed cue system.
- Add reusable notice, think, encourage and discovery sound cues.
- Add reduced-motion and silent-mode equivalents.
- Keep the saved-progress schema backward compatible.

**Deliverable:** shared character components demonstrated in isolation.

### Phase 2 — Skatepark `Nova's Night Run` vertical slice

- Replace the current 60° ramp and triangle sequence with the approved
  `Nova's Night Run — Crossing Rails` concept story.
- Replace the text-led opening with a short character-led request.
- Put Nova and the selected hero into all five Skatepark events.
- Connect their reactions to the child's prediction, rail movement, tracing
  observations and concept-language reveal.
- Add a differently oriented crossing where the child recognises the same
  opposite-angle and linear-pair relationships.
- Fix the mobile scene so the action is visible without a long scroll.
- Make replays start at the activity with “Watch story again” available.

**Deliverable:** one complete, production-quality story that defines the pattern.

### Phase 3 — Validate before scaling

Run three internal/usability sessions and at least three Grade 7 child sessions.

Check:

- Can the child begin without adult explanation?
- Do they notice that characters react to their actions?
- Can they explain what happens to the four angles when two straight lines cross?
- Can they recognise an opposite matching angle and a straight-line neighbour in a differently rotated crossing?
- Do they skip the story, replay it or voluntarily continue?
- Is any animation annoying on repeat?

**Gate:** do not scale the system until the vertical slice passes the learning and usability checks.

### Phase 4 — Roll out to the remaining four adventures

Recommended order:

1. Balance Lab — reuses object reaction and fairness cues.
2. Smart Shopper — reuses pointing, comparison and item handoff.
3. Mountain Rescue — requires the most state-sensitive character placement.
4. Cricket Data Room — requires additional player entrance assets.

Each adventure receives:

- Character-led opening and closing.
- Nova and hero presence in all five events.
- State-driven reactions.
- Shortened text.
- One different situation that exposes the same concept.
- Mobile action visibility.

### Phase 5 — Voice and audio

- Keep captions and silent play complete first.
- Replace browser TTS with approved, emotionally consistent Nova recordings when the voice direction is ready.
- Map each cue to a narration clip and optional sound effect.
- Never autoplay sound before the child has interacted with the page.

### Phase 6 — Cleanup and full QA

- Remove obsolete CSS mascot and emoji character fallbacks from the Grade 7 story path.
- Hide the hand-control beta for the child-test release.
- Remove repeated or decorative animation.
- Run desktop, tablet and phone checks across live, replay, resume and previous-scene flows.
- Run lint, unit tests and production build.

## 12. State and migration

The first implementation should avoid a saved-progress migration.

- Mathematical interaction state remains in the existing per-adventure union.
- Character mood and animation frame are derived from that state.
- Opening-play progress remains presentation-only.
- Existing `seenEvents`, `lastEvent`, completion and replay safeguards remain unchanged.
- If an `introSeen` preference becomes necessary, derive it from `seenEvents` before adding a new field.

## 13. Testing plan

### Unit tests

- Every adventure and state maps to a valid character cue.
- Cue copy stays within the Grade 7 word limit.
- No cue contains shaming or pressure language.
- Correctness remains determined by the existing Maths functions.
- Replay cannot change rewards, completion or live progress.
- Existing save sanitisation remains valid.

### Component tests

- Character stage exposes useful accessible names.
- Speech updates are announced politely.
- Motion is not the only feedback.
- “Why?” explanations can be opened by keyboard and touch.
- Opening play can be skipped.
- Replay defaults to the selected event.

### Visual and interaction QA

- Desktop: 1280 × 720.
- Tablet: 768 × 1024.
- Phone: 375 × 812.
- First action visible without scrolling on phone.
- Nova never covers the mathematical object.
- Hero never covers controls.
- No unskippable post-action animation longer than two seconds.
- Reduced-motion mode remains understandable.
- Every world still has a distinct Lumina palette.

### Child-test success criteria

- At least 80% begin the first interaction without adult help.
- At least 70% explain the core concept in their own words.
- At least 70% recognise or recreate the concept in a different story situation.
- Most children notice and understand the Nova reaction.
- No repeated animation is independently described as annoying by more than one child in the pilot.
- Likes/dislikes are recorded separately from learning evidence.

## 14. Definition of done

The initiative is complete when:

- Nova behaves like one consistent character across all five adventures.
- The selected avatar is visibly responsible for the story action.
- Every story has a clear reason for existing beyond being a wrapper around content.
- Text is shorter without losing explanation or mathematical vocabulary.
- Every meaningful action changes the world and receives an immediate character response.
- Every adventure lets the child recognise or recreate the same concept in a different situation.
- Symbolic notation appears only after the child has experienced the underlying relationship.
- Completion reflects participation in the concept journey, not performance on a set of Maths problems.
- Mobile shows both the mathematical object and an available action.
- Replay, resume, Journal, rewards and device-only privacy continue to work.
- Reduced motion, captions and silent play remain complete.
- Real Grade 7 testing confirms both engagement and conceptual understanding.

## 15. Decision required before implementation

Approve or change these four recommendations:

1. Complete the **Concept Story Blueprint** review before producing character assets.
2. Use the **hybrid story stage** direction after comparing three rendered options.
3. Build the strongest approved story as the vertical slice; Skatepark remains the default only if its new blueprint is the clearest.
4. Use **free pose-based character assets and short browser motion**, not full animated videos or a paid animation platform.
