# LearnNnjoy Grade 7 Maths Story World Bible

**Status:** Coverage-complete world architecture; each story still requires
natural-fit approval before implementation
**Version:** 1.1 — 29 July 2026
**Applies to:** Grade 7 Mathematics
**Do tonight:** Story, curriculum, interaction, and learning design only
**Do not do tonight:** Change, remove, test, commit, push, or deploy application
code or production assets

---

## 1. The product promise

LearnNnjoy does not disguise a worksheet with characters. It creates a small,
playable adventure in which a mathematical relationship is how the world
works.

Stories are selected in this order:

```text
Child fantasy or activity
        ↓
Natural world behaviour
        ↓
Mathematical relationship
        ↓
Curriculum mapping
```

Curriculum completeness tells us which relationships still need a home. It
does not justify forcing them into the nearest existing world.

The child should first think:

> “Nova needs my help. I want to see what happens.”

Only after acting and seeing a consequence should the child think:

> “Oh—that pattern has a Maths name.”

The experience is for understanding and grasping concepts. It is not primarily
for drilling procedures, answering timed questions, or preparing for an exam.

One internal concept library supports more than one textbook progression.
Children see adventures, not labels such as “old NCERT,” “new NCERT,” “CBSE
version,” or a school name.

---

## 2. What is locked across every world

These rules are non-negotiable and supplement the
[Interactive Story Benchmarks](./INTERACTIVE-STORY-BENCHMARKS.md).

### Story

- Every world has a visible beginning, connected middle, and satisfying ending.
- The opening shows what the characters were doing before the problem began.
- An incident creates a problem the child can understand without narration.
- Each quest grows from the consequence of the previous quest.
- The ending visibly resolves the problem from the opening.
- A reward card is not an ending.
- Across the Atlas, openings vary between a surprising discovery, something
  to create, a character request, a natural event, and a malfunction. “It
  broke again” cannot become the formula for every world.
- Urgency may be exciting, but there is no injury, terror, humiliation, or
  irreversible failure.

### Child agency

- The selected child avatar appears, speaks, moves, decides, and performs.
- The main action is steering, building, arranging, testing, tracing, joining,
  measuring, or changing the story world.
- A multiple-choice answer, slider, or `Next` button cannot be the main
  learning action.
- An exploratory choice produces a useful consequence, not a red failure
  screen.
- The child can revisit a prior scene, replay it, and continue without losing
  the state they created.
- A chapter with more than three quests has a satisfying, resumable rest point
  after every two or three quests. Seamless does not mean the child must
  finish a long chapter in one sitting.

### Nova

- Nova is a curious Grade 7 teammate, not a narrator or teacher pretending to
  be friendly.
- Nova can wonder, make a prediction, be surprised, and admit a mistaken guess.
- Nova reacts before explaining.
- Most spoken lines contain 4–10 words and one idea.
- The child avatar and supporting character also speak; Nova does not carry the
  entire scene.
- Dialogue is performed beside the speaker in a calm comic bubble, with audio
  replay and captions.

### Concept reveal

Every important concept follows this rhythm:

1. The story creates a need.
2. The child performs a meaningful action.
3. The world shows the consequence.
4. Nova points to or replays the exact change.
5. Nova describes it in everyday language.
6. The formal term or symbol appears beside the same visual.
7. The child tries it in one changed situation.
8. The story continues.

Nova’s explanation is usually 10–25 seconds. It should feel like sharing a
discovery:

> “Look—both corners changed together. The across-the-crossing pair always
> matches. Maths calls them vertically opposite angles.”

### Visual learning

- The relevant quantity or relationship is the brightest, clearest object.
- World motion and mathematical motion agree. A straight line does not curve;
  a fixed whole does not silently change; equal pieces look equal.
- Story action, visual model, and notation appear together briefly before
  support is faded.
- Characters never float when the scene says they are skating, climbing, or
  carrying something.
- Reduced-motion mode preserves every concept through pose, position, trace,
  focus, and colour changes.
- Text never blocks the child’s action or the important mathematical object.

### Emotional safety and inclusion

- There are no teachers, parents, homework, exams, public ranks, or peer
  pressure in the current child experience.
- The app celebrates noticing, trying, changing a plan, and explaining—not
  speed or being “smart.”
- The child is never called wrong, slow, weak, or behind.
- Base stories are broadly relatable; future variants adapt to interests, not
  gender.
- Clothing, colour, hobbies, voices, and roles are not assigned by gender.
- The tone is playful but not babyish or full of fake teenage slang.

---

## 3. Curriculum architecture

### Primary and compatibility references

The primary reference for the Delhi ecosystem is the Directorate of
Education, GNCT of Delhi’s 2026–27 Class VII Mathematics syllabus. It assigns
both parts of NCERT’s *Ganita Prakash*, giving 15 current chapters:

**Part I**

1. Large Numbers Around Us
2. Arithmetic Expressions
3. A Peek Beyond the Point
4. Expressions using Letter-Numbers
5. Parallel and Intersecting Lines
6. Number Play
7. A Tale of Three Intersecting Lines
8. Working with Fractions

**Part II**

1. Geometric Twins
2. Operations with Integers
3. Finding Common Ground
4. Another Peek Beyond the Point
5. Connecting the Dots
6. Constructions and Tilings
7. Finding the Unknown

The compatibility reference is the earlier NCERT Class 7 progression:

1. Integers
2. Fractions and Decimals
3. Data Handling
4. Simple Equations
5. Lines and Angles
6. Triangles
7. Comparing Quantities
8. Rational Numbers
9. Perimeter and Area
10. Algebraic Expressions
11. Exponents and Powers
12. Practical Geometry, Symmetry, and Visualising Solid Shapes

The references are not identical. The application therefore maps textbook
units to small concept contracts rather than maintaining two applications or
two copies of a story.

### Internal mapping rule

```text
Textbook / school sequence
        ↓
Invisible curriculum mapping
        ↓
LearnNnjoy concept contract
        ↓
Adventure + quests + later retrieval
```

Each quest will eventually carry internal tags such as:

- concept ID;
- prerequisite concept IDs;
- current NCERT chapter;
- earlier NCERT unit;
- school sequence override;
- introduction, practice, transfer, or retrieval;
- misconception probes;
- evidence the child has produced.

The child sees only the Adventure Atlas and story names.

### Complete world map

The earlier 12-world list overloaded several stories. Two independent AI
reviews—one through a child-development lens and one through a
teaching-and-learning lens—recommended splitting the heaviest worlds.
These are design reviews, not opinions from human clinicians.

The current coverage draft has 20 reusable visual worlds and 38 allocated
story chapters. These numbers are a snapshot, not a target. A world may be
revisited for a sequel when a related concept has a naturally fitting central
action. A chapter must be split, moved, or replaced when its Mathematics has
been inserted only to close a curriculum gap.

The number is not shown all at once: the Atlas reveals only 2–3 suitable
destinations, while completed and upcoming worlds remain discoverable through
regions.

| # | Adventure | Core concept contract | Curriculum coverage |
|---|---|---|---|
| 1 | Moonbase Tenfold | large-number place value, operations, comparison, estimation, standard form | Current I-1; earlier 11 retrieval |
| 2 | Clockwork Carnival | unambiguous expressions, grouping, operation convention | Current I-2 |
| 3 | Deep-Sea Research | decimal place value and all four operations through measurement | Current I-3 and II-4; earlier 2 |
| 4 | The Invention Workshop | letter-number, expression structure, like terms, and evaluation | Current I-4; earlier 10 |
| 5 | Nova’s Night Run | parallel/intersecting/perpendicular lines and angle relationships | Current I-5; earlier 5 |
| 6 | Lumen City Patterns | parity, generated sequences, algebraic generalisation, and grid reasoning | Current I-6 |
| 7 | The Cipher Couriers | cryptarithm constraints, place value, carrying | Current I-6 |
| 8 | Triangle Trail | triangle construction/properties and geometric congruence | Current I-7 and II-1; earlier 6 and practical geometry |
| 9 | Festival Makers | fraction as quantity; multiply and divide fractions meaningfully | Current I-8; earlier 2 |
| 10 | Mountain Rescue | integer position, order, addition, subtraction, and additive inverse | Current II-2; earlier 1 |
| 11 | Balance Lab | expression/equation distinction and solving/verifying simple equations | Current II-7; earlier 4 |
| 12 | The Vanishing Glowtails | questions, collection, dot plots, bar graphs, representative values, evidence updates | Current II-5; earlier 3 |
| 13 | Chance Harbor | experimental chance and probability language | Earlier 3 |
| 14 | Smart Shopper Night Market | ratio/proportion, percentages, price change, profit/loss, simple interest | Earlier 7 |
| 15 | Orbit Rail | rational-number position, equivalence, comparison, and all four operations | Earlier 8 |
| 16 | Habitat Architect | perimeter and areas of rectangles, parallelograms, triangles, trapeziums, circles, and composite shapes | Current competencies; earlier 9 |
| 17 | Power Stack Station | exponent meaning/laws and powers-of-ten representation | Current I-1; earlier 11 |
| 18 | The Mirror Gallery | reflection and rotational symmetry | Earlier 12 |
| 19 | Foldspace Workshop | current constructions/tilings plus earlier constructions and 2D-to-3D reasoning | Current II-6; earlier 12 |
| 20 | Harmony Gardens | prime factorisation, HCF, LCM, and their relationship | Current II-3 |

This is a coverage architecture, not proof that all 38 allocated stories have
passed the natural-fit story gate, and not a requirement that one child play
them in a fixed row. The mapping selects the appropriate route for the child’s
current textbook and school sequence. Each selected story must still pass the
Interactive Story Benchmarks before its detailed storyboard or implementation
is approved.

### Curriculum-completeness audit

The first full draft covered Part I and the earlier textbook but accidentally
treated Part I as the whole current book. The final teaching audit caught the
missing Part II before implementation. The following focused chapters close
both current and compatibility gaps without overloading the primary stories:

| World revisited | Sequel story | Concepts added |
|---|---|---|
| Moonbase Tenfold | Moonbase Supply Launch | all four operations with large numbers and estimate checks |
| Deep-Sea Research | Sample Supply Run | decimal multiplication/division, ×/÷ 10, 100, 1000 |
| Invention Workshop | Component Crew | terms, factors, coefficients, like/unlike terms, monomial/binomial/trinomial, expression addition/subtraction |
| Lumen City Patterns | Gridlight Control | algebraic/nth-position rules and magic-sum grids |
| Triangle Trail | Canyon Survey Lines | medians, altitudes, and exterior-angle relation |
| Triangle Trail | Lookout Mast | special triangles and the Pythagorean/Baudhayana relationship |
| Triangle Trail | Twin Bridge Test | general figure congruence; SSS, SAS, ASA/AAS, RHS; isosceles/equilateral facts |
| Unassigned | Former Supply Lift checklist | integer multiplication/division and sign patterns; no approved story |
| Unassigned | Former Network Route checklist | identities, closure, commutative/associative/distributive properties and non-examples; no approved story |
| Smart Shopper Night Market | Colour-Mix Exchange | ratios and proportions before percentage comparison |
| Smart Shopper Night Market | Lantern Ledger | profit/loss and simple interest in a pressure-free simulation |
| Orbit Rail | Cargo Scale Route | rational multiplication/division, reciprocal, standard form, dense placement |
| Habitat Architect | The Round Garden | parallelogram/triangle/trapezium area, circumference, π, circle area |
| Power Stack Station | Star Scale Beacon | powers of ten and standard/scientific form |
| Foldspace Workshop | The Tiling Gate | perpendicular bisector, copying/bisecting angles, 60°/90°/120° constructions, tessellation |
| Foldspace Workshop | Precision Plans | earlier parallel/triangle constructions |
| Foldspace Workshop | Fold the Atlas Crate | nets, faces, edges, vertices |
| Foldspace Workshop | Shape Scanner | sketches, views, shadows, and cross-sections |
| Harmony Gardens | Mosaic Makers | prime factors, common factors, HCF, and applications |
| Harmony Gardens | Rhythm Rings | multiples, LCM, the HCF–LCM relationship, and special cases |

The sequel arcs are specified inside their worlds below. This distinction is
important: a reusable **world** is an art and character setting; a **story
chapter** owns one coherent learning arc.

---

## 4. Psychology review and resulting decisions

### Shared conclusions

Both reviews agreed on the following:

- A strong theme does not rescue an overloaded concept scope.
- Fantasy is helpful when the fantasy action visibly carries the mathematical
  relationship; decorative fantasy adds mental load.
- Ages 11–13 can reason abstractly, but concrete action and visible
  consequences still help them build the abstraction.
- Guided discovery is safer than unexplained free play: give a goal or cue,
  allow an attempt, show the result, explain the relationship, then vary it.
- Visual action must connect promptly to a diagram and notation, or the child
  may remember only the prop.
- One changed-context use and later retrieval are required; success once in
  the same scene is not evidence of conceptual transfer.
- Feedback should explain what changed, not merely say “great” or “wrong.”
- The Atlas should reveal worlds progressively so 38 designed story chapters
  do not become 38 simultaneous choices.

### Candid decisions on the original premises

| Original direction | Decision | Reason |
|---|---|---|
| Mountain Rescue | Keep, simplify danger | Signed vertical position is natural; rescue mechanics must not bury it |
| Nova’s Night Run | Keep as reference | The child’s movement and line relationships are naturally connected |
| Comet Chase / Observatory | Keep space, radically simplify | The old pitch combined too many concepts and too much mission language |
| Clockwork Carnival | Keep, tighten | Expressions can control one mechanism; avoid teaching a slogan |
| Deep-Sea Calibration | Keep, simplify | Decimal measurement fits; too many instruments would distract |
| Mystery Machine | Split | A variable and an unknown equation need different mental models |
| Pattern City Blackout | Split and remove “quiz to restore power” | Parity/sequences and cryptarithms demand different actions |
| Triangle Trail | Keep | Construction and visible constraints fit naturally |
| Skyship Supply Kitchen | Replace | Skyship and kitchen were two unrelated decorations |
| Smart Shopper | Keep, redesign | Percentages belong there, but price cards alone are a worksheet |
| Fair Play Arena | Replace | Sport/ranking is not universal and can recreate pressure |
| Habitat Architect | Keep perimeter/area; split symmetry/solids | The concepts require different representations |

### The space-world correction

The astronaut setting is not too complex. The old explanation was.

The revised pitch contains one location, one problem, one action, one central
relationship, and one payoff:

> Nova and the child are astronauts at a moonbase. A digit module has slipped
> into the wrong navigation slot, so their ship is pointing at the wrong
> comet. The child moves the module between fixed place-value slots and
> watches its value change tenfold. When the coordinate matches, their route
> lights up and the ship reaches the comet.

Large-number naming, comparison, and estimation arrive in later quests after
the place-value relationship is secure.

---

## 5. The Grade 7 Adventure Atlas

The child travels through five visual regions. The regions organise the
experience without displaying school-unit labels.

1. **Motion Peaks** — Mountain Rescue, Nova’s Night Run, Triangle Trail
2. **Discovery Frontier** — Moonbase Tenfold, Deep-Sea Research, Orbit Rail
3. **Maker District** — Clockwork Carnival, Invention Workshop, Balance Lab,
   Power Stack Station
4. **Pattern Wilds** — Lumen City Patterns, Cipher Couriers, Harmony Gardens,
   Vanishing Glowtails, Chance Harbor
5. **Everyday Worlds** — Festival Makers, Smart Shopper Night Market, Habitat
   Architect, Mirror Gallery, Foldspace Workshop

Only two or three destination cards are fully lit at a time. A locked card
shows a title, silhouette, and playful teaser without concept spoilers.

Worlds are linked by Nova’s Adventure Atlas rather than one giant plot. This
allows a school-specific sequence while preserving a familiar companion and
the feeling of a larger journey.

---

## 6. Story worlds

Each section below is a story contract. It is detailed enough to begin a deep
storyboard tomorrow, but implementation still proceeds one world at a time.

## World 1 — Moonbase Tenfold

### Short world explanation

Nova and the child are astronauts at a moonbase. A navigation digit has moved
into the wrong slot and points their ship at the wrong comet. The child
rebuilds the coordinate by moving digits and bundling route units in tens.
Every correct place makes the real flight path change, and the finale launches
them to the comet.

### Concept contract

- **Prerequisite:** read ordinary multi-digit whole numbers
- **Core relationships:** a digit’s value depends on its place; one place left
  is ten times the value; numbers can be composed, decomposed, compared, and
  estimated
- **Do not add:** fuel-rate arithmetic, timed comet danger, scientific orbital
  physics, or exponents
- **Misconceptions to expose:** a digit itself “grows”; more digits always means
  a valid larger quantity; Indian and international names describe different
  quantities

### Starting act

Nova and the child are taking a harmless practice photo of a newly discovered
comet. Their ship begins turning toward a dull rock instead. A loose digit
module is blinking between two navigation slots.

Suggested exchange:

- Child: “Nova… that is definitely not our comet.”
- Nova: “Yep. We’re beautifully aimed at a space potato.”
- Child: “The navigation panel is blinking.”
- Nova: “Then let’s put its value back.”

The child clips their boots to the navigation floor and takes the module.

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Wrong Comet | Move one digit module across fixed navigation places; the nested star-map route expands or contracts at every step | Place determines value; adjacent places differ tenfold | “Same six, different seat. One step left gives it ten times the value.” |
| 2. Rebuild the Coordinate | Bundle 10 route units into one pack, 10 packs into one crate, then dock the matching digit modules | Compose and decompose a large number | “The big number is made of smaller place-value bundles.” |
| 3. Two Mission Controls | Send the same coordinate to Delhi and an international station; separators regroup while the route stays fixed | Lakhs/crores and millions/billions are naming/grouping systems for the same quantity | “The commas changed teams. The distance didn’t move at all.” |
| 4. Catch the Comet | Compare two nearby coordinates, then set a sensible rounded launch marker; the holographic path selects the comet | Compare/order and estimate after place value is secure | “Exact gets us there. Rounded gets us ready fast.” |

Every transition comes from the previous repair: the recovered digit reveals
the full coordinate; the full coordinate must be transmitted; the two
transmissions reveal two nearby routes; choosing the route opens launch.

### Ending act

The ship follows the rebuilt route. The child controls the final camera sweep,
and the comet fills the window. Nova holds the correctly placed digit module
beside its matching navigation slot while the visual route briefly replays.
The resulting comet photograph becomes the world’s Atlas postcard.

### Learning and child-safety gate

Use nested zooms or physical ten-bundles; do not try to draw a route literally
ten times longer on one phone screen. Never say the digit grew. Say its value
changed because its place changed.

### Sequel chapter — Moonbase Supply Launch

**Short explanation:** The comet mission leaves behind millions of image
tiles that must be combined, replaced, copied across satellites, and shared
between research stations. The child operates large physical bundle bays for
each calculation and uses an estimate to catch a misplaced digit before the
archive launches.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Join the Image Bays | Roll two place-aligned bundle bays together and regroup when a place reaches ten | Large-number addition |
| 2. Replace the Blurred Tiles | Remove the blurred batch from a known total and unpack when a place needs more units | Large-number subtraction |
| 3. Copy to the Satellites | Duplicate one bundled batch across a visible number of satellites | Large-number multiplication |
| 4. Share the Archive | Partition the total bundles equally among research stations and display any remainder meaningfully | Large-number division |
| 5. Estimate Before Launch | Round first, predict the reasonable size, then locate a deliberately misplaced place-value module | Estimation as an operation check |

The same image archive causes every quest: combining reveals damaged tiles;
replacement produces the clean batch; satellites need copies; stations share
the result; the estimate approves launch. Scientific/standard form is taught
later at Star Scale Beacon and internally mapped back to this current chapter.

---

## World 2 — Clockwork Carnival

### Short world explanation

A friendly clockwork parade is rehearsing at a night carnival, but a torn
instruction ribbon makes the machines perform the right moves in the wrong
groups. The child reconnects action tiles so every performer receives one
clear instruction. When the sequence is unambiguous, the full parade begins.

### Concept contract

- **Prerequisite:** whole-number operations
- **Core relationships:** expressions describe operations; grouping changes
  meaning; shared conventions make an ungrouped instruction unambiguous
- **Do not teach:** “PEMDAS” as a magic chant or “multiplication always comes
  first” without equal-priority left-to-right cases
- **Misconceptions:** same numbers always give the same result; brackets are
  decoration; read/evaluate every expression strictly from left to right

### Starting act

Nova and the child wind a small clockwork drummer. It bows, spins, and bumps
gently into the confetti cart because its instruction ribbon has torn between
two action groups. The drummer is unharmed and indignantly taps its hat.

- Drummer: “I was promised a grand entrance.”
- Child: “You did enter the confetti.”
- Nova: “We need one instruction that can’t be misunderstood.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Two Different Shows | Place the same number and action tiles into two grouped ribbons; performers visibly produce different formations | Grouping changes an expression’s meaning | “Same pieces. Different groups. Completely different show.” |
| 2. Repair the Brackets | Wrap selected gears with a glowing bracket belt; grouped gears turn as one unit | Brackets communicate what belongs together | “Those brackets are the stage crew’s ‘do this together’ sign.” |
| 3. One Shared Rule | Test an unbracketed ribbon on two performers, compare the disagreement, and align it to the agreed operation convention | Order convention removes ambiguity; multiplication/division and addition/subtraction are each read left to right when they share precedence | “The rule doesn’t make Maths bossy—it stops two machines reading one line differently.” |
| 4. Conduct the Parade | Watch a movement sequence, build its expression, then run it on the entire parade | Translate between action, words, and expression | “You wrote the whole performance in one clear Maths sentence.” |

### Ending act

The drummer gives the child the conductor’s light baton. The child starts the
parade, and every clockwork performer completes the intended formation. A
short replay overlays brackets and operation signs on the exact movements
they controlled.

### Learning gate

The mechanism must execute the grouping visibly. If the child only drags
symbols into slots and sees a number, the world has become a worksheet.

---

## World 3 — Deep-Sea Research

### Short world explanation

Nova and the child join a calm deep-sea research pod searching for a glowing
coral bloom. Its depth display has lost the tiny place markers needed for
precise movement. The child calibrates tenths and hundredths, compares safe
depths, and combines short dives. The bloom lights the sea when the readings
finally match.

### Concept contract

- **Prerequisite:** place value and measurement
- **Core relationships:** tenths/hundredths are parts of one unit; decimal
  magnitude depends on place; like units align when adding/subtracting
- **Do not add:** decimal multiplication/division in this world
- **Misconceptions:** a longer decimal is always larger; align final digits
  instead of places; the decimal point “moves by itself”

### Starting act

The pod follows a tiny glowfish toward a coral bloom. The fish stops at a safe
ledge, but the display alternates between `7.4 m` and `7.04 m`.

- Child: “Why does the pod jump between two windows?”
- Nova: “Good catch. Four tenths and four hundredths would send us to very
  different windows.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Calibrate the Window | Fill one-metre depth strips with ten tenths, then subdivide a tenth into hundredths; pod aligns to the glowfish | Decimal places are measured parts of a fixed unit | “That tiny hundredth is small, but it still has an exact place.” |
| 2. Which Signal Is Deeper? | Slide two readings onto the same vertical scale and watch the pod windows line up | Compare by place, not number of digits | “Seven point four is seven point forty. The zero didn’t change the depth.” |
| 3. Follow the Glow Trail | Perform two short dives/rises; aligned measurement bands combine while the pod moves | Add/subtract decimal measurements with common units | “Tenths meet tenths. Hundredths meet hundredths.” |
| 4. Reach the Bloom | Use the calibrated display in a differently oriented reef tunnel; predict, move, and correct without danger | Transfer from vertical scale to numerical display and route | “Different view, same place-value map.” |

### Ending act

The pod settles at the exact observation depth. The child opens the camera
shield and the coral releases a wave of harmless light. The glowfish circles
the pod while Nova replays `7.4 = 7.40` on the real scale.

### Sequel chapter — Sample Supply Run

**Short explanation:** The coral team requests one return visit, but every
sample tube must fit a single calibrated rack. The child predicts whether each
operation should make the measured quantity larger or smaller, then builds,
partitions, and relabels that same set of supplies. The packed rack prepares
the pod for launch.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Repeated Sample Trays | Duplicate a decimal mass/length across a visible number of trays; the complete rack grows | Decimal × whole number |
| 2. A Fraction of the Rack | Predict larger/smaller, then scale one fixed area/length model by a decimal factor smaller or larger than one | Decimal × decimal and product-size sense |
| 3. Equal Reels | Predict, then partition one fixed decimal cable length among a whole number of reels | Partitive decimal division: amount in each group |
| 4. How Many Tubes Fit? | Predict, then measure how many decimal-sized tubes fit in one fixed sample quantity | Measurement decimal division: number of groups |
| 5. Change the Unit | Relabel the same physical quantity in metres, centimetres, and millimetres while place values regroup | ×/÷ powers of ten without saying the point moves by itself |

Every quest fills the same rack. It ends when the child slides that rack into
the pod and the launch light turns on. The physical quantity or unit scale
changes first; the decimal notation follows it.

---

## World 4 — The Invention Workshop

### Short world explanation

Nova and the child discover a workshop where one adjustable power module can
run many inventions. The child builds a rule that works no matter which
numbered power cell is inserted. The inventions finally perform together
when the rule predicts every output.

### Concept contract

- **Prerequisite:** arithmetic expressions
- **Core relationships:** a letter-number may vary; an expression describes a
  general rule; substitution evaluates one instance; equivalent expressions
  behave the same
- **Do not teach here:** solving for one unknown through inverse operations
- **Misconceptions:** a letter always hides one secret answer; different
  letters must mean different values; adjacency means digit concatenation

### Starting act

The child inserts a `3` power cell into a cleaning bot and it spins three
brushes. Nova swaps in a `5`; five brushes unfold. The handwritten control
card only says, “Use the number on the cell.”

- Child: “The instruction changes every time.”
- Nova: “What if one rule could handle every cell?”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. The Changing Cell | Insert several numbered cells into the same visible rule track and watch corresponding parts unfold | A letter can stand for a varying number | “Here, `n` isn’t one secret. It’s whichever cell we use.” |
| 2. Build One Rule | Join repeated component groups to the adjustable cell; the invention changes with the input | Construct an expression from a relationship | “Three groups of `n` is `3n`—not the two-digit number ‘three-n.’” |
| 3. Same Machine, New Shape | Rearrange visible parts into two forms that produce identical motion for several inputs | Equivalent expressions represent the same rule | “They look different on the bench, but they make the same thing happen.” |
| 4. Workshop Orchestra | Predict and then run several inventions from one shared general rule | Evaluate and transfer a letter-number expression | “You didn’t guess every case. You built a rule for all of them.” |

### Ending act

The child pulls the main lever. Bots, lights, and music devices respond to
different cells using the same rule. Nova pins the compact expression beside
the moving parts, and the workshop earns a new Atlas emblem.

### Sequel chapter — Component Crew

**Short explanation:** The workshop’s parade projector flickers because a
repair bot connected incompatible light-module carts to one power track. The
child opens the actual control expression, identifies what each cart
contributes, combines only interchangeable module groups, and rebuilds the
projector. The repaired image becomes the workshop’s parade finale.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Open the Broken Control | Split the projector’s expression into signed module carts, then open each into numerical and variable factors | Terms, factors, coefficients, constants |
| 2. Trace the Flicker | Run each cart alone; carts with the same variable light-module structure affect the same beam, while unlike structures affect different beams | Like and unlike terms through function and structure |
| 3. Rebuild the Beam | Physically merge or remove interchangeable module groups; the matching projector beam brightens or dims | Addition/subtraction of like terms |
| 4. Label the Control Boards | Close one-, two-, and three-term repaired boards; formal monomial/binomial/trinomial labels appear after each works | Expression classification after meaning |
| 5. Start the Parade Image | Translate one changed projector into an expression, combine its structural matches, and test several inputs | Transfer across action, structure, notation, and value |

The torn control causes the next quest: opening it reveals carts; testing carts
reveals the flicker source; combining matches repairs beams; closing the boards
reveals their term counts; the final board runs the parade image. Equivalent
forms must also be justified by visible rearrangement, not only by coinciding
for a few tested inputs.

---

## World 5 — Nova’s Night Run

### Short world explanation

Nova and the child are opening a glowing night skate course. A crossing in the
track loses its light pattern and the next sections will not open. The child
rides and rebuilds straight paths, matches angles at crossings, and finds
patterns across parallel rails. The repaired course ends with Nova and the
child riding the full route together.

### Concept contract

- **Core relationships:** straight paths, intersections, opposite/adjacent
  angle relationships, parallel and perpendicular lines, transversal patterns
- **Do not add:** triangle theorems, curved paths as lines, or skateboard jump
  physics as proof
- **Misconceptions:** longer arms make larger angles; nearby angles must match;
  properties only work in one orientation

### Connected quest chain

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Trail Meet | Nova rides one straight star trail; the child rides a second straight trail at any chosen angle | Straight paths may intersect at one point or remain separate |
| 2. Crossing Rails | Rotate one real rail, trace opposite corners, and join neighbouring light pieces | Vertically opposite angles match; a linear pair makes a straight angle |
| 3. Rails That Never Meet | Lay two same-direction rails, square a service crossing, then split one right-angle light into two pieces | Parallel/perpendicular lines and complementary angles |
| 4. Same Corner Lights | Move one coloured corner trace from the first crossing to the same relative corner at the second crossing | Corresponding angles |
| 5. Zigzag Lights | Carry one trace through the inside or outside zigzag, with location colour cues that later fade | Alternate interior and alternate exterior angles |
| 6. Inside Together | Join the two inside lights on one side of the beam into one straight half-turn | Same-side interior angles are supplementary |
| 7. Reverse Check | Start with one selected equal/supplementary relationship and physically test whether the two rails remain parallel | Converses, one relationship at a time |
| 8. Opening Ride | Recognise adjacent, complementary, supplementary, opposite, and transversal relationships in new orientations while Nova and the child ride | Transfer and visual recap |

### Starting and ending acts

The complete eight-quest sequence, dialogue direction, motion rules,
misconception handling, evidence plan, and ending are specified in
[Nova’s Night Run: Complete
Storyboard](../superpowers/specs/2026-07-29-nova-night-run-complete-storyboard.md).
This remains the reference experience. Future edits should improve
consistency, not replace the concept-native story.

---

## World 6 — Lumen City Patterns

### Short world explanation

Lumen City is preparing a night light performance, but its light creatures
have forgotten how each pattern grows. The child pairs lights, builds each new
ring from earlier rings, and tests rules by creating the next display. The
whole skyline performs the child’s completed pattern.

### Concept contract

- **Prerequisite:** multiplication and addition
- **Core relationships:** even quantities pair completely; odd quantities
  leave one; a sequence is generated by a stated rule; the Virahanka-Fibonacci
  pattern builds each term from the previous two
- **Do not add:** cryptarithms
- **Misconceptions:** even/odd are arbitrary labels; a pattern is only a visual
  decoration; a finite sequence has only one possible rule

### Starting act

Two playful light creatures arrange lanterns in pairs. One lantern keeps
rolling into the centre and changing the intended pattern.

- Light creature: “It refuses to find a partner!”
- Child: “That one keeps getting left out.”
- Nova: “Let’s make the pairing visible.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Pair the Lights | Physically pair lanterns; any leftover becomes a centre light | Parity as pairability | “Even fills pairs. Odd leaves one brilliant rebel.” |
| 2. Change the Total | Add or remove one lantern and watch the pattern switch between paired and leftover states | Parity changes predictably | “One change flips the whole pairing pattern.” |
| 3. Grow the Spiral | Combine the previous two light rings to construct the next ring | Generated sequence; previous-two rule | “This ring remembers the last two and adds them together.” |
| 4. Conduct the Skyline | Choose or invent a stated rule, connect the position number `n` to what is built there, and test a far-away position before the district follows it | Algebraic/nth-position generalisation and acknowledgment of multiple valid rules | “Your letter-rule jumps straight to any position—it doesn’t have to build every step first.” |

### Ending act

The child taps the central conductor light. Every building performs the exact
rule the child built. Nova and the light creatures dance through the visible
sequence rather than presenting a list of answers.

### Sequel chapter — Gridlight Control

**Short explanation:** The completed skyline reveals a 3×3 control plaza where
every row and column must send the same total light to the central show. The
child moves visible number-lights, tracks each row’s changing total, and uses
letter-number relationships to determine what can fit. The balanced grid
starts the city’s second performance.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Equal-Light Rows | Move number-lights freely and watch each row/column total change in place | Magic-sum constraint |
| 2. Find the Centre’s Job | Compare paired positions and express their relationship to the shared sum | Grid structure and algebraic reasoning |
| 3. Build a Possible Grid | Complete one grid from partial constraints; failed attempts highlight the exact row relationship that changed | Constraint-based reasoning, not guessing |
| 4. Make a New Rule | Transform the grid while preserving the shared sum, then explain the general change with a letter-number | Generalisation and transfer |

The same control plaza stays visible throughout. Formal algebra appears
beside the live row totals only after the child has manipulated them.

---

## World 7 — The Cipher Couriers

### Short world explanation

Friendly courier drones cannot launch because symbols on their address crates
have replaced the digits. The child stacks physical digit crates, keeps every
matching symbol consistent, and makes bundles of ten when a column overflows.
The decoded address sends the couriers on their route.

### Concept contract

- **Prerequisite:** place value and column addition
- **Core relationships:** one symbol represents one consistent digit; column
  constraints interact; different symbols use different digits in the chosen
  puzzle rules; a leading symbol is not zero; carrying is a visible bundle of
  ten
- **Do not add:** speed, competitive leaderboards, or long trial-and-error
  searches
- **Misconceptions:** the same symbol may change value; different symbols may
  automatically share a digit; a carry appears by magic

### Starting act

A courier scans an address crate. Instead of a number, three glowing symbols
appear and its compass spins.

- Courier: “I can deliver snacks across a galaxy. I cannot deliver to a
  triangle.”
- Nova: “The triangle stands for a digit. We need the one that makes every
  column work.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Same Mark, Same Crate | Attach one digit crate to every occurrence of a symbol and see all copies update | Symbol consistency |
| 2. Column Locks | Test a small constrained sum; an incompatible stack highlights the exact column relation it violates, while leading-zero and reused-digit conflicts point to their visible rule badges | Constraints eliminate possibilities |
| 3. Bundle the Carry | Ten unit crates snap into one ten-crate and move to the next column | Carrying as place-value regrouping |
| 4. Decode the Address | Coordinate two or three constraints, with optional hints that point to a column rather than reveal a digit | Guided cryptarithm reasoning |

### Ending act

The completed number illuminates a real destination on the map. The child
launches the drones and watches each parcel reach a waiting character. The
final replay highlights consistency and carrying, not the completed answer
alone.

### Learning gate

This is an optional mini-adventure for children ready for a puzzle. Hints are
always available. The child is never trapped in exhaustive guessing.

---

## World 8 — Triangle Trail

### Short world explanation

Nova and the child are exploring a canyon trail when a fold-out bridge will
not close into a stable triangle. The child chooses beams, joins hinges, and
tests how sides and corners affect one another. A correctly built triangular
bridge opens the path to a hidden sky garden.

### Concept contract

- **Prerequisite:** lines and basic angle recognition
- **Core relationships:** not every three lengths close; triangle angle sum;
  side–opposite-angle relationship; construction under constraints
- **Do not add:** lines-and-angles content already owned by Night Run
- **Misconceptions:** any three segments form a triangle; appearance proves a
  property; the longest side may face any angle; rotation changes the triangle

### Starting act

Nova unfolds three bridge beams. Two join, but the third cannot reach.

- Child: “It’s not broken. The pieces just can’t close.”
- Nova: “Then the lengths are telling us something.”

The child takes the beam grips.

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Can It Close? | Hinge three selected beams and try to close the loop; non-examples remain visibly open | Triangle inequality/existence | “The two shorter beams must reach farther than the longest one.” |
| 2. Three Corner Lights | Copy the three corner traces and rotate them together into a straight half-turn | Intuitive visual justification that interior angles total 180°; not presented as a formal proof | “Three different corners—one straight turn together.” |
| 3. The Wide Corner | Build and fully measure several valid triangles, then compare each side with its own opposite angle | Longer side faces the larger opposite angle without implying that one isolated beam change leaves everything else fixed | “The longest beam and widest opposite corner keep finding each other.” |
| 4. Build the Skybridge | Construct a bridge from a new constraint set, test it under a gentle load, and correct it | Transfer and construction reasoning |

### Ending act

The bridge locks into place and changes from flexible to stable. Nova and the
child cross it together, reaching the sky garden. The final panorama traces
the three beams and corner relationships on the real bridge.

### Sequel chapter — Canyon Survey Lines

**Short explanation:** Beyond the skybridge, the trail markers cannot tell the
middle of a ledge from the shortest drop to it. The child sends two visibly
different survey lines from triangle corners and extends an edge to open an
outside gate. The completed survey map reveals the safe position for a new
lookout.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Find the Middle Route | Join a vertex to the midpoint of the opposite side; three possible routes remain visible | Medians |
| 2. Drop the Shortest Rope | Lower a perpendicular from a vertex to the opposite line, including outside an obtuse triangle when needed | Altitudes and orientation independence |
| 3. Open the Outside Gate | Extend one side; rotate the two remote interior corner lights into the exterior opening | Exterior-angle relationship |

The midpoint route locates the centre of the plan; the altitude supplies its
true clearance; extending the boundary reveals the outside gate angle. The
finished map raises a survey flag at the exact lookout location.

### Sequel chapter — Lookout Mast

**Short explanation:** The surveyed lookout needs one triangular mast that can
stand squarely on uneven ground. The child changes side and corner
relationships, tests special triangle families, and rearranges unit-square
panels on a right-triangle frame. A stable mast lights the canyon route.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Choose the Frame Family | Change side lengths and compare equilateral, isosceles, scalene, acute, obtuse, and right frames | Triangle classification |
| 2. Match Sides and Corners | Fold an isosceles frame and overlay its base angles; repeat on an equilateral frame | Equal sides face equal angles; equilateral angles are equal and 60° |
| 3. Square the Mast | Build a right-triangle support and identify the hypotenuse opposite the right angle | Right-triangle structure |
| 4. Cover the Three Squares | Rearrange unit-square pieces on the two legs to cover the square on the hypotenuse | Intuitive area evidence for the Pythagorean/Baudhayana relationship, not a claimed general proof |
| 5. Light the Lookout | Test a changed right-triangle frame before installing the mast | Transfer |

The mast light turns on only after the area rearrangement. The formal
`a² + b² = c²` appears on the same built squares as an intuitive justification,
not as an unsupported proof claim.

### Sequel chapter — Twin Bridge Test

**Short explanation:** Two canyon bridges must carry the same replacement
panel, but they face different directions. The child overlays traces and
builds triangles from controlled information to discover when one is
guaranteed to match the other. Matching bridges open a two-way route.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Exact Overlay | Move/rotate transparent traces of several plane figures until every corresponding part coincides | Congruent figures and correspondence |
| 2. Three Locked Beams | Build from three side lengths and compare the only possible matching triangle | SSS |
| 3. The Hinged Corner | Lock two sides and their included angle before closing the triangle | SAS and why the included angle matters |
| 4. Two Corners and a Beam | Lock two angles and a corresponding side to construct the match | ASA/AAS |
| 5. Right-Bridge Check | Match a right triangle using hypotenuse and one leg | RHS and changed-orientation transfer |
| 6. Equal-Side Signal | Fold an isosceles or equilateral twin and transfer its matched side relationship to the corresponding angle pair | Equal-side/equal-angle properties in geometric twins |

`SSA` and `AAA` near-matches are allowed as informative non-examples; the
world shows why they may produce a different triangle instead of displaying
“wrong.” The child tests every bridge on a safe model before any character
crosses.

---

## World 9 — Festival Makers

### Short world explanation

A community night festival is about to open, but its single master light
ribbon arrived without the cutting map for the stage canopy. The child keeps
the whole ribbon visible, layers fractional colours, measures how many pieces
fit, and shares the remainder between arches. The completed canopy becomes
the festival finale.

### Concept contract

- **Prerequisite:** identify equal parts of a whole and basic fraction
  comparison
- **Core relationships:** fraction of a quantity; fraction multiplication as
  part of a part; proper/improper/mixed forms describe quantities; division
  asks how many groups or how much in each group
- **Representations:** length, area, set, and liquid—not food circles alone
- **Misconceptions:** the whole is optional; multiplication always makes
  larger; division always makes smaller; “invert and multiply” is an
  unexplained trick

### Starting act

Nova unfurls a light ribbon across the stage. Only three quarters illuminates;
the remaining quarter is the wrong colour. A festival maker points to crates
with fractional labels but no cutting plan.

- Maker: “If we guess, we waste the only ribbon.”
- Child: “Can we test it on the light table before we cut?”
- Nova: “And test the fractions before we cut.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Keep the Master Whole | Assemble equivalent ribbon pieces against one fixed master length, continue past one whole, and regroup between improper and mixed forms | Unit whole, equivalence, proper/improper/mixed quantities | “Five quarters is one whole and one quarter—the quantity stayed put; its outfit changed.” |
| 2. Light Part of the Stage | Take a stated fraction of the master length and see that canopy region illuminate | Fraction of a quantity as multiplication | “Three quarters of twelve means three of four equal groups.” |
| 3. Colour a Part of a Part | Overlay one fractional colour region inside another and watch the shared region remain | Fraction × fraction | “We took a part of a part. That overlap is the product.” |
| 4. How Many Sections Fit? | Predict larger/smaller, then measure how many `3/4`-length sections fit along the remaining master strip | Measurement division: number of groups | “This division asks how many three-quarter pieces fit.” |
| 5. Share the Remaining Light | Predict, then partition the remaining fractional length equally between a fixed number of arches | Partitive division: amount in each group | “Same division family, different question: how much reaches each arch?” |
| 6. Open the Festival | Apply the fraction relationship once to a changed area model in the festival art wall | Transfer beyond the ribbon model |

### Ending act

The child connects the last ribbon. Light moves through every canopy arch and
into the art wall, and the child chooses the final colour pattern. Nova’s
recap overlays the length and area fraction models on the real installation
for only a few seconds.

---

## World 10 — Mountain Rescue

### Short world explanation

A storm cuts power to a mountain wildlife shelter, and its replacement energy
pod falls past Base Camp at zero into the ravine. The child drives a rescue
sled along one straight altitude route, relights beacons, follows directed
gusts, and reverses the winch. Returning the cell lights the shelter for Pip
the snow fox and the aurora.

### Concept contract

- **Prerequisite:** whole-number position and movement
- **Core relationships:** signed position relative to zero; integer order;
  directed addition; inverse movement as subtraction
- **Do not add:** multiple rescue vehicles, dangerous falls controlled by the
  child, or free curved flight
- **Misconceptions:** negative means bad; farther from zero always means
  greater; subtraction always makes smaller; every down movement is failure

### Connected quest chain

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Chase the Lost Signal | Move the rescue team from above zero, across Base Camp, to the pod below zero | Positive, zero, and negative positions |
| 2. Relight the Beacon Chain | Travel through and connect signed altitudes from lower to higher | Compare and order integers |
| 3. Ride the Storm | Enact successive up/down gusts from the pod’s current position | Integer addition as directed change |
| 4. Bring the Power Home | Lower an empty hook, reverse it, and lift the attached pod to the shelter | Inverse movement and intuitive subtraction |

### Starting and ending acts

The approved chapter premise and detailed connected storyboard are preserved
in
[Mountain Rescue — Seamless Story Redesign](../superpowers/specs/2026-07-29-mountain-rescue-story-redesign.md).
The finale must show the energy cell returning, the shelter warming, Pip
uncurling, and the aurora appearing. No existing Mountain code is removed
while the story is refined.

### Child-development adjustment

Keep the pod unmanned and the cold stylised. Pip is briefly uncomfortable,
not endangered. “Below zero” must later transfer to a non-vertical context so
the child does not learn that negative always means physically down.

### Sequel chapter — Supply Lift Timeline

> **Natural-fit status:** rejected as a story premise. Do not implement
> further. Preserve this only as a curriculum checklist; its concepts are
> currently unassigned.

**Short explanation:** The storm erased the lift’s movement history, so its
control panel cannot tell where it was several cycles ago or where repeated
cycles will take it next. The child separates change-per-cycle from timeline
direction, scrubs forward and backward through a visible pattern, and rebuilds
the missing schedule. The recovered schedule sends identical crates to each
shelter.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. One Cycle at a Time | Set a signed change per cycle using separate magnitude and up/down controls; one lift movement creates the first log entry | Signed multiplicand as directed change |
| 2. Play Forward | Run 1, 2, 3 future cycles and connect repeated movement to multiplication by a positive cycle count | Integer multiplication as repeated directed change |
| 3. Rewind the Log | Scrub the same constant-change timeline through cycle `0` into past cycle indices; products continue the constant numerical pattern | Negative multiplier through pattern extension/time reversal, never “negative groups” |
| 4. Compare the Sign Cases | Overlay the four direction/time combinations while keeping magnitude fixed | Product sign patterns with direction and timeline roles separated |
| 5. Test a Route Mirror | Apply the discovered rule to a signed number-line machine that scales distance and reverses direction when its operator is negative | Changed, non-time context before generalising the sign rule |
| 6. Find the Missing Control | Given final change and one control, reconstruct the signed per-cycle change or signed cycle index | Integer division as inverse multiplication and sign pattern |

The notation `change per cycle × signed cycle count = total change` appears
beside the same timeline. The model’s domain is stated: the negative cycle
count means looking backward on a constant-change timeline, not owning a
negative number of crates.

### Sequel chapter — Network Route Rules

> **Natural-fit status:** rejected as a story premise. Do not implement
> further. Preserve this only as a curriculum checklist; its concepts are
> currently unassigned.

**Short explanation:** The recovered timeline starts the convoy, but a closed
pass forces the child to rearrange and split the same delivery plan without
changing what each shelter receives. Comparing route plans reveals which
integer operations survive reordering or regrouping and which do not. The
rerouted convoy completes the aurora supply network.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Swap the Stops | Exchange addends or factors and compare the same destination/result; then try subtraction/division as visible non-examples | Commutative property and limits |
| 2. Move the Transfer Point | Regroup three additions or multiplications while preserving all route pieces; contrast subtraction/division | Associative property and limits |
| 3. Split the Convoy | Send one factor across two joined delivery groups and reassemble both plans | Distributive property |
| 4. Empty and Single Runs | Add a zero-change route or multiply by one run while the convoy state stays fixed | Additive and multiplicative identities |
| 5. Check the Network Type | Perform operations and inspect whether the result remains an integer; division supplies a deliberate counterexample | Closure and operation-specific reasoning |

Every comparison uses the same real delivery plan. The chapter ends when all
shelters receive the original quantities through the safe reroute.

---

## World 11 — Balance Lab

### Short world explanation

Nova’s missing invention toolkit is locked in a capsule connected to a giant
balance. The child loads and removes matching pieces from both sides, reveals
the mystery crate, and keeps the beam level. When equality is preserved, the
capsule opens.

### Concept contract

- **Prerequisite:** arithmetic and the Invention Workshop’s variable idea
- **Core relationships:** equality is a relationship; the same change on both
  sides preserves it; inverse actions isolate an unknown
- **Do not add:** general variable patterns, which belong to the Invention
  Workshop; do not stretch the literal pan model to negative or fractional
  coefficients it cannot show faithfully
- **Misconceptions:** equals means “write the answer”; any operation may be
  moved across and magically change sign; balance means objects must look the
  same

### Starting act

Nova finds the toolkit capsule but pulls the wrong counterweight. The balance
tilts, and the lock tightens with a comic squeak.

- Child: “The lock watches both sides.”
- Nova: “Then whatever we do, we keep them equal.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Rule Card or Lock? | Compare an expression card that describes one side with an equation lock that relates both sides | Expression versus equation |
| 2. Make It Level | Load different-looking but equal-mass objects until the beam settles | Equality is balance of value, not appearance | “Equal doesn’t mean identical. It means both sides have the same value.” |
| 3. Same Move, Both Sides | Remove/add matching blocks on both pans and watch the beam remain level | Preserve equality | “Same change on both sides; the relationship survives.” |
| 4. Reveal the Crate | Undo visible extra blocks to isolate one mystery crate | Solve a one- or two-step equation through inverse actions | “We’re not moving magic symbols. We’re undoing the extra weight.” |
| 5. Open a New Lock | Use the relationship on a differently arranged balance, verify by replacing the crate with its value, then view one non-balance equation representation | Transfer, solution checking, and model fading |

### Ending act

The beam settles, the capsule opens, and Nova’s tools spring into an orderly
display rather than exploding. The child uses one recovered tool to repair a
tiny invention, connecting the solved relationship to a visible result.

---

## World 12 — The Vanishing Glowtails

### Short world explanation

A group of harmless glowing creatures is safely resting somewhere beyond its
usual forest crossing, and its observation board is scrambled. The child
chooses a useful search question, validates real sightings, builds and changes
graphs, and uses representative values to choose where to look. New evidence
updates the plan, leading Nova and the child to the resting herd.

### Concept contract

- **Prerequisite:** reading tables and simple bar graphs
- **Core relationships:** data represents observations; single/double bar
  graphs encode and compare values; range describes spread; mean/median/mode
  answer different “typical” questions; conclusions update with evidence
- **Do not add:** probability or competition
- **Misconceptions:** average always means mean; one outlier describes
  everyone; graph shape is decoration; a graph proves causation

### Starting act

Nova and the child wait at the moonlit crossing. A calm tracker message says
the Glowtails have stopped to rest in one of three safe clearings, then drops
several incomplete observation cards.

- Child: “Which sightings would actually help us choose?”
- Nova: “Let’s ask one clear question before we collect anything.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Ask, Then Observe | Choose a search question, visit safe observation points, and accept/reject cards by checking time, trail, and duplicated sightings | Question formulation, collection, and data validity |
| 2. Build the Dot Trail | Place each measured sighting on a shared number line so stacks reveal clusters and spread | Dot plot |
| 3. Compare Two Nights | Move the validated tokens into a table; bars grow from those tokens and a second night becomes a side-by-side bar | Table, bar graph, and double-bar comparison | “The graph didn’t invent anything. It made our sightings easier to see.” |
| 4. How Far Did They Spread? | Place the lowest and highest sightings on the trail and stretch a visible band between them | Range as highest minus lowest | “Range tells us the full spread, not where most Glowtails were.” |
| 5. Balance the Sightings | Redistribute the same tokens evenly without changing their total | Mean as fair-share/balance value |
| 6. Middle or Most Common? | Order the tokens to locate the median, then inspect the tallest dot stack for mode; choose which answers a stated search question | Median, mode, and representative-value choice | “There isn’t one ‘average’ for every question.” |
| 7. The Strange Signal | Add an outlier and watch each measure and honest graph axis respond | Outlier sensitivity and scale integrity | “One unusual sighting pulled the mean. The middle sighting barely moved.” |
| 8. Update the Search | Add fresh evidence; the recommended route changes, and the child chooses a justified path | Conclusions must update with data | “Changing your mind when the evidence changes is good detective work.” |

### Ending act

The chosen route leads to a clearing where the Glowtails are safely asleep
around a new food tree. The child lowers the observation light, and the
creatures wake and cross together. Nova’s recap links the physical tokens,
table, and graph without claiming the data caused their route.

---

## World 13 — Chance Harbor

### Short world explanation

At a floating harbour, a transparent route wheel sends tiny sail-bots left or
right and must be tested before the fleet opens. The child can see and change
every equal sector, runs safe trials, and compares expected chances with
actual outcomes. A final fleet launch shows that probability predicts
long-run patterns, not an exact next result.

### Concept contract

- **Prerequisite:** fractions and simple data recording
- **Core relationships:** impossible/possible/certain; equally likely outcomes;
  experimental frequency; probability predicts long-run tendency, not a
  guaranteed next event
- **Do not add:** gambling, prizes, money, or public competition
- **Misconceptions:** unlikely means impossible; a result is “due”; a short run
  must exactly match theoretical probability

### Starting act

Nova launches three sail-bots. The transparent wheel happens to send all three
left.

- Harbour bot: “The right route must be broken.”
- Child: “Can we launch a bigger group?”
- Nova: “Let’s test it before we blame the gate.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. What Can Happen? | Inspect the gate and physically trace reachable and unreachable routes | Impossible, possible, certain |
| 2. Make It Fair | Adjust equal sectors on the transparent wheel and predict which outcomes are equally likely | Theoretical fairness from a controlled sample space |
| 3. Run the Fleet | Launch many bots; a living frequency display grows with each real outcome | Experimental probability and variation | “Fair doesn’t mean perfect halves every moment. It means neither path is favoured.” |
| 4. New Wheel, New Prediction | Change the visible sector proportions, make a prediction, and compare a later batch | Transfer and long-run reasoning |

### Ending act

The child opens the harbour. Sail-bots spread across both routes, lighting
buoys as they pass. Nova points out that the exact order was surprising while
the overall pattern reflected the gate.

---

## World 14 — Smart Shopper Night Market

### Short world explanation

Nova and the child need lights, fabric, and sound parts for a community night
show, but every market stall advertises its offer differently. The child
removes visible percentage pieces from real price strips, compares final
amounts, and builds a supply plan within the show’s fictional resource tokens.
The completed plan opens the show.

### Concept contract

- **Prerequisite:** fractions, decimals, ratio language
- **Core relationships:** percent is relative to a whole; final amount depends
  on base and rate; increase/decrease must retain the reference whole
- **Do not add:** pressure about family finances, spending rewards, or “rich
  versus poor” status
- **Misconceptions:** larger percentage always means larger rupee change;
  largest discount sign means cheapest final price

### Starting act

Two stalls offer the same light strip: “30% off ₹500” and “25% off ₹400.”
Nova reaches for the bigger sign; the child notices the different wholes.

- Nova: “Thirty is bigger. Easy.”
- Child: “Wait—can we see what each one actually costs?”
- Stall keeper: “Please compare what you would actually pay.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Slice the Hundred | Partition a whole price strip into 100-linked groups and connect fraction–decimal–percent views | Percentage as part of a referenced whole | “Percent means ‘out of a hundred,’ but the hundred belongs to a real whole.” |
| 2. Lift the Discount | Remove the discount segment and carry the remaining strip to the counter | Percent of amount and final price | “The sign tells the part removed. The strip left tells what we pay.” |
| 3. Different Wholes | Apply the same rate to different wholes and different rates to the same whole | Base-rate interaction and fair comparison | “A percent without its whole tells only half the story.” |
| 4. Update the Supply Plan | Increase or decrease one whole amount by a stated percentage and compare the final resource strips | Percentage increase/decrease |

### Ending act

The child confirms the supply plan and activates the night show. Nova admits
the biggest-looking sign was not automatically the best choice. The final
visual compares actual strips, not isolated percentages.

### Prerequisite chapter — Colour-Mix Exchange

**Short explanation:** The light-show maker needs the same colour mixture in
small lanterns and a giant projector. The child keeps ingredient relationships
constant while scaling quantities, then uses proportional exchange cards to
collect the exact supplies. The final projector matches the lantern colour.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Build the Colour Relationship | Combine visible light units in a stated part-to-part and part-to-whole relationship | Meaning and language of ratio |
| 2. Same Mix, Bigger Tank | Scale both quantities together; changing only one makes the projected colour visibly drift | Equivalent ratios |
| 3. Exchange Cards | Arrange two equal ratios on balance-like exchange cards and compare cross-products as equal rectangular arrays | Proportion and cross-product reasoning |
| 4. Mix for the Main Show | Determine a missing quantity by scaling the relationship, then test the real colour | Proportional transfer before symbolic shortcut |

The story ends when the small lantern and giant projector create the same
colour. The Atlas runs this chapter before Smart Shopper unless ratio evidence
already exists. Percentages are introduced only after the ratio relationship
is clear.

### Sequel chapter — Lantern Ledger

**Short explanation:** A pressure-free market simulator invites Nova and the
child to run a fictional lantern booth for one evening. They set cost and
selling-price strips, observe a surplus or shortfall, and place the resulting
tokens into a time-lapse savings locker for a new projector lens. Completing
the simulated plan unlocks the lens; no real character’s livelihood depends
on the result.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Stock the Practice Booth | Build the cost-price strip from visible supply parts | Cost price as reference base |
| 2. Set the Selling Strip | Compare selling price to cost; the exact difference moves into surplus or shortfall trays | Profit/loss amount |
| 3. Compare Fairly | Express surplus/shortfall as a percentage of the visible cost-price base | Profit/loss percentage with explicit denominator |
| 4. Fill the Savings Locker | Label the original principal `P`, annual rate `R`, and time `T`; add one equal interest strip per period, always based on `P` | Simple interest and roles of P/R/T |
| 5. Run the Time-Lapse | Change one of P/R/T and predict which strips change before the simulated periods play | Transfer and non-compounding contrast |

The lens unlocks in the simulator and is previewed on the show. Nova points
out that every simple-interest strip used the same starting base; no
compounding is implied.

---

## World 15 — Orbit Rail

### Short world explanation

A small orbital train delivers research samples to stations placed between
whole-number beacons on both sides of Central Dock zero. The child positions
fractional stops, recognises equivalent coordinates, and combines signed
journeys. The complete route reconnects every station.

### Concept contract

- **Prerequisite:** integers and fractions
- **Core relationships:** rational numbers locate precise positions; equivalent
  forms share one point; rational numbers can be ordered and combined
- **Do not add:** speed or orbital physics
- **Misconceptions:** more denominator means larger fraction; equivalent
  fractions are different locations; negative fractions reverse numerator
  and denominator; density means there is a “next” rational number

### Starting act

The train stops between `0` and `1`, but the map shows `1/2`, `2/4`, and `3/6`
as three different stations.

- Train: “I appear to be at three stations.”
- Child: “The train didn’t move between those names.”
- Nova: “Let’s make the map agree.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Between the Beacons | Partition a fixed rail interval and dock a stop at a fraction of the distance | Rational position on a number line |
| 2. One Stop, Many Tickets | Fold/overlay equivalent partitions; tickets snap to the same station | Equivalent rational numbers |
| 3. Left of Central Dock | Extend the same partitions below/left of zero and compare signed stops | Negative rational numbers and ordering |
| 4. Complete the Route | Join directed fractional journey segments; train physically ends at the combined coordinate | Addition/subtraction through directed movement |

### Ending act

The child sends the train through the full line. Samples arrive at every
station, including those between and below whole-number beacons. A zoom-out
shows many possible stops between two neighbours, hinting that rational
numbers are densely placed without introducing a formal proof.

### Sequel chapter — Cargo Scale Route

**Short explanation:** Orbit Rail must resize sample packs and share them
among stations on opposite sides of Central Dock. The child first scales only
positive pack magnitude, then applies a separate left/right route direction,
groups fractional cargo, and standardises equivalent tickets. A complete
cargo manifest reconnects the research teams.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Standard Tickets | After the Harmony Gardens factor prerequisite, reduce common factors and keep a positive denominator while the station position stays fixed | Standard form and equivalent rational numbers |
| 2. Scale the Pack | Predict larger/smaller, then scale a positive area/length pack by a positive rational factor | Rational multiplication magnitude |
| 3. Send It Left or Right | Apply sign with a separate route-direction/reflection control after the magnitude is built | Product sign sense without “negative size” |
| 4. How Many Packs Fit? | Measure how many positive fractional packs fit in one allocation; the reciprocal emerges from grouping | Rational division and reciprocal |
| 5. Reverse the Manifest | Apply the established left/right sign layer to dividend and divisor, then verify the quotient by multiplication | Division sign sense and inverse check |

The train delivers the exact scaled packs. The reciprocal is named after the
grouping model shows why division becomes multiplication by it. Dense
placement remains in the primary Orbit Rail finale, where it is position—not
cargo size.

---

## World 16 — Habitat Architect

### Short world explanation

Nova and the child are building a safe habitat for a group of friendly
creatures. A fixed amount of fence and flooring must create enough boundary
and living space. The child reshapes pens, covers composite floors, and sees
why perimeter and area respond differently. The creatures enter the finished
habitat.

### Concept contract

- **Prerequisite:** length and multiplication
- **Core relationships:** perimeter measures boundary; area measures surface;
  same perimeter can enclose different areas; composite areas decompose;
  scaling changes length and area differently
- **Do not add:** symmetry and 3D nets
- **Misconceptions:** perimeter and area are interchangeable; same perimeter
  means same area; doubling side length only doubles area; gaps/overlaps are
  acceptable units

### Starting act

The child completes a beautiful narrow enclosure. The fence fits exactly, but
the creatures have almost no room to play.

- Creature: “Excellent fence. Tiny dance floor.”
- Child: “The fence fits. Why is the play space so tiny?”
- Nova: “So fence length and floor space are telling different stories.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Walk the Boundary | Place and walk fence segments around several shapes | Perimeter as total boundary length |
| 2. Cover the Floor | Tile rectangular and square interiors in rows and columns; gaps remain visible, units become square units, and the row×column count becomes `l×b` or `s×s` | Area as coverage and rectangle/square formulas |
| 3. Same Fence, More Room | Reshape a fixed-length flexible fence and watch area tiles change | Same perimeter, different area |
| 4. Repair the Pond Deck | Split and rearrange a composite floor into known shapes | Composite area |
| 5. Grow the Habitat | Scale a model and compare what happens to boundary and tile count | Linear versus area scaling intuition |

### Ending act

The child opens the habitat gate. The creatures move through play, rest, and
water zones that visibly fit. Nova walks the boundary once while an overhead
glow fills the area, showing the two measures without a lecture card.

### Sequel chapter — The Round Garden

**Short explanation:** The habitat’s new garden must fit triangular shade
sails, a slanted pond deck, and a circular running path. The child rearranges
shapes to reveal their area relationships, measures the path around the pond,
and discovers the constant connection between a circle’s circumference and
diameter. The garden opens as a varied, usable space.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Slide the Slanted Deck | Cut and move a triangular end to turn a parallelogram into a rectangle with the same base and perpendicular height | Area of a parallelogram |
| 2. Pair the Shade Sails | Join two congruent triangles into a parallelogram, then separate them | Area of a triangle |
| 3. Split the Trapezium Deck | Pair and rotate two congruent trapeziums into a parallelogram, then return to one | Area of a trapezium |
| 4. Roll Around the Pond | Unroll several circular boundaries against their diameters and compare the nearly constant ratio | Circumference and intuitive π |
| 5. Slice the Circle | Rearrange increasingly narrow sectors into an almost-rectangle with dimensions related to half-circumference and radius | Intuitive justification for circle area, explicitly labelled as an approximation rather than a formal proof |
| 6. Complete the Garden | Decompose a mixed-shape plan, preserve square units, and account for overlaps/gaps | Composite-area transfer |

The child sees where `2πr` and `πr²` come from before the formulas remain on
the plan.

---

## World 17 — Power Stack Station

### Short world explanation

A compact energy station uses stacks where each new layer repeats the same
factor. Its labels were flattened into long multiplication strings. The child
builds physical stacks, compresses their labels with exponents, and combines
compatible stacks. The repaired station powers a floating garden.

### Concept contract

- **Prerequisite:** multiplication and place value
- **Core relationships:** exponent notation represents repeated equal factors;
  base and exponent have different jobs; exponent rules arise from counting
  and reorganising explicit factor modules
- **Do not add:** scientific notation unless separately mapped and introduced
- **Misconceptions:** `a^n = a × n`; the exponent applies to an unstated sum;
  add exponents for every operation or unlike bases; `(-2)^4` and `-2^4` have
  identical grouping

### Starting act

Nova reads a panel containing `3 × 3 × 3 × 3 × 3` while the garden’s lift
slowly sinks.

- Child: “The station knows the pattern. The label is just too long.”
- Nova: “Five threes need a shorter name.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Build the Stack | Place repeated equal factor modules in a horizontal chain; base colour and factor count remain distinct so physical height is never the metaphor | Base versus exponent |
| 2. Compress the Label | Fold a repeated product into exponent notation, then unfold it to verify | Meaning of `a^n` |
| 3. Join Two Stacks | Physically join same-base factor rows and count the combined factors | Product rule as factor counting |
| 4. Release a Stack | Remove a same-base factor row and count what remains | Quotient rule in permitted cases |
| 5. Stack a Stack | Build equal power chains in repeated trays, then unfold and count all factors | `(a^m)^n = a^(mn)` |
| 6. Match the Chain Length | Combine or divide different bases carrying the same exponent by aligning equal-length factor rows | `(ab)^m` and `(a/b)^m` |
| 7. Cancel to Zero | Divide identical non-zero power chains until the ratio is one; a locked zero-base example makes the exclusion visible | `a^0 = 1` for non-zero `a` |
| 8. Group the Negative Base | Compare parenthesised negative-base chains with an outside minus, then pair negative factors for even/odd counts | `(-a)^n` sign parity versus `-a^n` |
| 9. Power the Garden | Translate between model, repeated product, and exponent in a changed station | Transfer |

### Ending act

The station lifts the garden into sunlight. Water moves through the plants,
and the child rotates the compact power labels to reveal the repeated factors
inside them.

### Sequel chapter — Star Scale Beacon

**Short explanation:** The station must send energy readings across enormous
and tiny scales, but its display cannot fit the long numbers. The child zooms
the place-value scale by powers of ten and compresses the same quantity into
standard form. A clear signal reaches the distant beacon.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Powers-of-Ten Zoom | Zoom the moonbase place-value display by powers of ten while the represented magnitude changes | Powers of ten and place-value relation |
| 2. Compress the Long Reading | Position one leading value between 1 and 10 and attach the exact power of ten; expand it to verify | Standard/scientific form |
| 3. Compare Two Signals | Align the powers first, then compare leading values; convert between ordinary and standard form | Comparison and representation transfer |

The child launches the compact signal and the remote beacon expands it back
to the same quantity. Scientific notation is therefore a representation, not
a different number. This chapter is mapped to current Large Numbers Around Us
as well as the earlier Exponents and Powers unit.

---

## World 18 — The Mirror Gallery

### Short world explanation

A playful gallery projects only half of each moving artwork, so its creatures
appear with missing reflections and broken spins. The child places mirror
lines, completes reflected positions, and tests rotational matches. The
gallery opens as a full moving light exhibition.

### Concept contract

- **Prerequisite:** shape recognition and angle/turn language
- **Core relationships:** reflection preserves distance and perpendicular
  relation to the mirror line; line symmetry; rotational symmetry and order
- **Do not add:** 3D solids or nets
- **Misconceptions:** reflection means copy in the same orientation; any
  diagonal is a symmetry line; a full turn counts as several different
  matches without definition

### Starting act

A projected creature waves its left hand; its supposed mirror image also
waves its left hand and bumps into the frame.

- Creature: “My reflection has forgotten reflecting.”
- Child: “Something about that movement feels off.”
- Nova: “Let’s put every point the same distance across the mirror.”

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Across the Mirror | Drag key points across a mirror; equal-distance guide lines appear perpendicular to it | Reflection relation |
| 2. Find the Mirror Line | Fold/overlay a completed artwork to test candidate lines | Line symmetry |
| 3. Turn and Match | Rotate a light sculpture through one full turn, mark every coincidence, identify the smallest matching angle, and count matches | Rotational symmetry, smallest angle, and order |
| 4. Curate the Gallery | Repair unfamiliar and non-example artworks, explaining the visible test | Transfer and prototype resistance |

### Ending act

The child opens the gallery doors. Reflections move correctly and rotating
sculptures create a coordinated light show. Nova deliberately tries one
almost-symmetry and laughs when the outlines do not coincide.

---

## World 19 — Foldspace Workshop

### Short world explanation

Nova and the child enter a workshop that turns precise flat plans into objects
needed across the Adventure Atlas. The first chapter repairs construction
guides. A separate sequel folds and studies 3D objects. Completed builds are
delivered back to earlier worlds.

### Concept contract

- **Prerequisite:** lines, angles, triangles, and basic solid names
- **Core relationships:** precise construction follows geometric constraints;
  a later chapter maps 2D nets, sketches, and views to 3D solids
- **Do not add:** symmetry as a second lesson
- **Misconceptions:** a drawing that looks close automatically satisfies the
  constraints; later, any six squares form a cube net and one view is the
  object itself

### Starting act

The workshop cutter tries to follow a smudged guide and produces a support
that almost fits but tilts away from its anchor.

- Nova: “It looks close.”
- Child: “It looked right. Why didn’t it fit?”
- Workshop bot: “Please rebuild the guide from its constraints.”

### Compatibility chapter — Precision Plans

### Connected quest chain

| Quest | Story action and consequence | Learning job | Nova reveal |
|---|---|---|---|
| 1. Parallel Through the Point | Use the transversal-angle relationship to construct a line through a given point parallel to an existing guide | Constraint-based parallel construction |
| 2. Three Locked Lengths | Swing compass-length arcs until three supplied sides meet | SSS construction |
| 3. The Hinged Measure | Lock two sides and the included angle before drawing the third side | SAS construction |
| 4. Corners First | Lock two angle rays and a supplied side, then find their meeting point | ASA/AAS construction |
| 5. Right Support | Build from a hypotenuse and one leg around a right-angle guide | RHS construction and method selection |

### Ending act

The cutter follows the repaired plans and every support fits its real anchor.
The child sends a parallel rail to the night course and a triangular support
to the canyon. The constructions are verified by their constraints, not by
visual closeness.

### Current chapter — The Tiling Gate

**Short explanation:** The workshop’s Atlas gate needs a centred hinge,
copied corner guides, and a gap-free tiled surface before it can send supplies
to other worlds. The child uses a compass and straightedge to construct the
exact guides, then tests shapes across the same gate surface. When the pattern
covers the gate without gaps or overlaps, the first delivery passes through.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Find the Exact Middle | Sweep equal-radius arcs from both ends of the gate beam; their joining line locates and verifies the midpoint at 90° | Perpendicular bisector |
| 2. Copy the Corner Guide | Transfer one angle with matching arcs rather than measuring it with a protractor | Copying an angle |
| 3. Split the Beam | Intersect equal arcs inside an angle to construct two equal openings | Angle bisector |
| 4. Build the Gate Angles | Construct 60°, derive 120° as its supplement, and construct 90° from a perpendicular guide | Standard 60°/90°/120° constructions |
| 5. Test the Tiles | Repeat triangles, squares, pentagons, or hexagons across the live surface; gaps and overlaps stay visible | Tessellation versus non-tessellation |
| 6. Open the Pattern | Design one tiling using the constructed guides and explain how the corner angles fit around a point | Tiling transfer and geometric reasoning |

The construction marks remain on the same gate that is tiled, so the chapter
does not jump from compass exercises to unrelated decoration. The finished
gate opens and sends a package to the moonbase.

### Sequel chapter — Fold the Atlas Crate

**Short explanation:** Flat supply sheets have arrived for crates and
sculptures, but the first crate folds overlap. The child identifies the
solid’s parts, tests nets, and tracks which faces meet. One correct crate is
packed for delivery across the Atlas.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Meet the Solid | Touch faces, edges, and vertices while a 3D object and its skeleton stay linked | 2D versus 3D features |
| 2. Fold the Net | Fold candidate nets; overlaps and gaps remain visible and reversible | Net-to-solid mapping |
| 3. Track the Faces | Mark faces before folding and predict adjacency/opposition | Spatial relation across representations |
| 4. Pack and Close | Choose a valid changed net, predict the top/opposite face, fold it, and pack the real object | Transfer |

The chapter ends when the real crate closes without gaps and reaches the
scanner. Its flat net briefly remains beside the folded crate.

### Sequel chapter — Shape Scanner

**Short explanation:** The correctly folded crate reaches a scanner that needs
several 2D records before delivery: a build sketch, three outside views, and
one safe scan slice. The child rotates and scans the same object rather than
switching among unrelated models. When all records agree, the crate is
delivered.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Sketch the Crate | Create an oblique sketch and a proportional isometric sketch beside the rotating model | 2D representations of a 3D solid |
| 2. Three Camera Views | Match front, side, and top views while the camera visibly moves | Viewpoint-dependent 2D views |
| 3. Cast the Shadow | Move one light and compare changing 2D shadows with the unchanged solid | Shadow as projection |
| 4. Scan the Slice | Move a visible cutting plane safely through a holographic solid and observe its cross-section | Cross-sections |
| 5. Approve the Delivery | Reconstruct/select the solid from a changed set of records and send it through the Atlas gate | Representation transfer |

The crate reaches the moonbase, and later variants send a shelter part and
gallery sculpture. Each delivery pairs its records with the real object.

---

## World 20 — Harmony Gardens

### Short world explanation

Harmony Gardens is preparing a light-and-music opening. Its mosaic needs the
largest identical square tiles that fit several panels without cuts, and its
rotating light rings must later meet on the same beat. The child reveals prime
building blocks, finds common factors and multiples, and starts the completed
garden performance.

### Concept contract

- **Prerequisite:** multiplication, division, factors, and multiples
- **Core relationships:** prime factorisation exposes multiplicative
  structure; HCF is the greatest shared factor; LCM is the least positive
  shared multiple; for two positive integers, `HCF × LCM = product`
- **Misconceptions:** prime factorisation depends on the chosen factor tree;
  HCF/LCM are selected by keyword; LCM means multiply the numbers every time;
  the HCF–LCM product relation extends unchanged to any number of inputs

### Starting act

Nova and the child place a square tile on the first garden panel. It fits one
side but leaves a thin uncovered strip on the other. Oru, the garden bot,
shows that cutting tiles would break their embedded lights.

- Oru: “Same square everywhere. No cuts, no gaps.”
- Child: “Every size we tried leaves a strip somewhere.”
- Nova: “Let’s open the numbers and see what they share.”

### Primary chapter — Mosaic Makers

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Open the Number Seeds | Split composite light bundles into factors until every final module is prime; different split paths rejoin as the same prime collection | Prime/composite numbers and prime factorisation |
| 2. What Do Both Panels Share? | Align the prime modules from two panel dimensions and physically group their common factor combinations | Common factors |
| 3. Largest No-Cut Tile | Build square candidates from common factors and tile the panels; the greatest valid side uses the fewest identical tiles | HCF through prime factorisation and application |
| 4. More Than One Panel | Find the largest equal segment/tile that fits several new lengths without remainder | HCF of a group and changed-context transfer |

The completed mosaic becomes one continuous light floor. Its final circuit
activates the garden’s rotating rings, causing the sequel problem rather than
ending on a disconnected reward.

### Sequel chapter — Rhythm Rings

**Short explanation:** Two light rings above the completed mosaic repeat every
different number of beats. The child marks each ring’s return beats and finds
the earliest positive beat when both meet. Prime modules then reveal why HCF
and LCM divide the same factor resources differently. Their shared flash
opens the garden.

| Quest | Story action and consequence | Learning job |
|---|---|---|
| 1. Mark Each Return | Run each ring separately and place beat markers at its repeated return times | Multiples as repeated cycles |
| 2. First Shared Flash | Overlay the beat tracks and choose the earliest positive shared marker | LCM as least common positive multiple |
| 3. Add the Third Ring | Extend the factor/multiple method to a new three-ring alignment | LCM application |
| 4. Share or Repeat the Factors | Place the minimum shared prime powers in a green HCF lane and the maximum required powers in a purple LCM lane before pairing the results for two inputs | Perceptually distinct HCF/LCM selections and their product relationship |
| 5. Special Ring Pairs | Test co-prime, consecutive, and one-number-is-a-multiple cases, then predict before running | Generalisation and efficient reasoning |

The rings align above the completed mosaic and send one wave of light across
the garden. The formal relation is shown only for two positive integers, with
its domain visible.

---

## 7. Cross-world retrieval without worksheets

Understanding must survive outside the original prop. Each world therefore
leaves one concept “echo” in a later adventure.

| Learned in | Retrieved later |
|---|---|
| Moonbase place value | Cipher Couriers carrying and large addresses |
| Clockwork expressions | Invention Workshop rule tracks |
| Deep-Sea decimals | Smart Shopper price strips |
| Invention variables | Balance Lab mystery crate |
| Night Run lines/angles | Triangle Trail and Foldspace constructions |
| Lumen patterns | Harmony Garden cycles and Power Stack repeated structures |
| Cipher constraints/carrying | Moonbase archive regrouping or a later Balance lock |
| Triangle Trail | Habitat roof/deck construction |
| Festival fractions | Chance Harbor probabilities and Orbit Rail positions |
| Mountain integers | Orbit Rail signed fractions |
| Balance equality | Habitat unknown-side repair in a later retrieval scene |
| Data handling | Chance Harbor trial records |
| Chance | Glowtail search-confidence update in a later retrieval scene |
| Smart Shopper percentages | Habitat scale comparison, when appropriate |
| Orbit rational positions | Foldspace scanner coordinates |
| Habitat measurement | Foldspace tiling and material plans |
| Power Stack exponents | Moonbase/Star Scale scientific notation |
| Symmetry | Foldspace face patterns, without reteaching the whole topic |
| Foldspace spatial reasoning | Habitat or Harmony construction request |
| Harmony prime factors/HCF | Orbit ticket reduction and Festival fraction simplification |

The curriculum mapping schedules each echo after its source chapter even if a
different textbook orders the worlds differently. These echoes are brief and
unscored. At least one occurs in a later session, not only during the
immediate ending, so the product can see whether the concept travels beyond
its original story.

---

## 8. Required storyboard package before development

Each world must receive the following package before production work begins:

1. **Child fantasy or activity** — what the child would genuinely want to do
   without hearing mathematical language
2. **Natural world behaviour** — the visible rule that makes the world work
3. **Natural-fit proof** — why removing the mathematical relationship would
   materially break or change the story problem
4. **One-sentence child promise** — what the child wants to accomplish
5. **Concept contract** — prerequisites, 1–3 central relationships, exclusions
6. **Coverage checklist** — quest-level concept IDs, textbook mappings, and
   where each concept is introduced, transferred, and later retrieved
7. **Misconception map** — what incorrect mental models the story will reveal
8. **Starting act** — 30–60 seconds with incident and reason to help
9. **Quest beats** — story action, child action, consequence, reveal, transfer
10. **Seamless transitions** — the visible result that causes the next quest
11. **Ending act** — visible resolution, character reaction, child-controlled
   payoff
12. **Dialogue script** — Nova, child, and supporting character; performance
   direction and text budget
13. **Interaction storyboard** — idle, attempt, informative mismatch, discovery,
   replay, reduced-motion equivalent
14. **Representation bridge** — world action ↔ diagram/model ↔ notation
15. **Evidence plan** — what the child does that demonstrates understanding
16. **Asset and audio list** — only after the story passes review
17. **Phone composition** — critical object and control on `375 × 812`
18. **Navigation states** — Home, resume, Previous, Journal replay

No world proceeds because it has four quest cards or passing tests. It proceeds
only when one deep quest passes the Interactive Story Benchmarks in a real
browser on phone and desktop.

---

## 9. Psychology and learning release gates

### Child-development gate

- Can an 11–13-year-old explain the immediate problem after the opening?
- Is the child doing something more meaningful than answering a disguised
  question?
- Does every fantasy rule have a visible and consistent cause?
- Is the tension exciting but emotionally safe?
- Does dialogue respect the child without sounding babyish?
- Can a child recover from experimentation without shame or lost progress?
- Are only the necessary characters, controls, and plot facts active at once?

### Teaching-and-learning gate

- Is the concept causally necessary to the story action?
- Is the whole, unit, zero point, scale, equality, or other reference explicit?
- Does the manipulation faithfully instantiate the mathematical relationship?
- Are action, visual model, and notation linked?
- Does Nova explain the relation that changed, not merely name a rule?
- Is at least one likely misconception made visible safely?
- Does one changed situation test transfer?
- Is there a later retrieval echo?
- Are quizzes secondary to manipulation and explanation?

### Anti-worksheet gate

Reject or redesign the scene if:

- the story freezes and a lesson panel takes over;
- the same interaction repeats with different numbers;
- the child selects an answer while characters merely watch;
- correct input triggers animation that does not explain why;
- a decorative object could be replaced with a textbook box without changing
  the learning;
- the finale is only coins, confetti, or “Quest complete.”

---

## 10. Recommended implementation order for tomorrow

Implementation remains deep, one world at a time.

1. **Finish the Mountain Rescue story decision before more code.** Preserve
   the current partial work; verify that the gentler stakes and four-quest
   concept scope are acceptable.
2. **Bring one Mountain quest to Night Run experiential parity.** Do not
   implement the other three until the first passes phone and desktop review.
3. **Complete Mountain’s connected beginning-to-ending arc.**
4. **Choose Moonbase Tenfold as the next new deep storyboard.** Its simplified
   concept makes it the best test of whether a fantasy world can remain clear.
5. **Proceed through the current Ganita Prakash route** before implementing
   compatibility-only worlds, unless the test child’s school sequence requires
   a different order.
6. **Add compatibility worlds through mappings, not a second app.**

The sequence may be reordered through curriculum mapping. The story contracts
and benchmarks do not change.

---

## 11. Morning decisions

No decision is required to understand this document. The recommended defaults
are:

- keep the space setting under the simpler **Moonbase Tenfold** premise;
- keep **Nova’s Night Run** as the quality reference;
- preserve the approved Mountain code and story materials;
- treat Mountain’s softer story as provisional until its next deep storyboard
  review;
- use 20 reusable worlds containing 38 focused story chapters, revealed
  progressively, instead of forcing all concepts into 10–12 overloaded
  adventures;
- implement deeply one adventure at a time;
- never remove existing code merely because a better story has been planned.

The first morning conversation should be:

> “Do we accept this complete world map, and do we deepen Mountain Rescue or
> Moonbase Tenfold first?”

No technical work should begin before that answer.

---

## 12. Sources and research basis

Curriculum:

- [NCERT, *Ganita Prakash*, Grade 7, Part I (2025; reprint
  2026–27)](https://ncert.nic.in/textbook/pdf/gegp1ps.pdf)
- [Directorate of Education, GNCT of Delhi, Class VII Mathematics Annual
  Syllabus 2026–27 — *Ganita Prakash* Parts I and
  II](https://edustud.nic.in/edu/Syllabus_2026_27/7/7_MATH_SYLLABUS_2026_27_EM.pdf)
- [NCERT Exemplar Problems — earlier Class 7 Mathematics unit
  list](https://ncert.nic.in/exemplar-problems.php?ln=en)

Learning design:

- [Cook, Mitchell, and Goldin-Meadow, “Gesturing makes learning
  last”](https://www.sciencedirect.com/science/article/abs/pii/S001002770700114X)
  — evidence that embodied representation can support retention when it
  expresses the relevant relation.
- [Research on simultaneous speech and gesture in mathematical
  learning](https://www.sciencedirect.com/science/article/pii/S0959475217301809)
  — supports connecting verbal and visible representations rather than
  separating them into a later lecture.
- [Research on children learning Mathematics from intelligent
  characters](https://pmc.ncbi.nlm.nih.gov/articles/PMC7818392/) — supports
  socially meaningful characters when their guidance is connected to
  learning.
- [A game-based learning
  review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11018941/) — supports
  active, feedback-rich experiences but does not justify points, stories, or
  animation without sound pedagogy.

These sources inform the principles; the specific worlds and creative
decisions are LearnNnjoy product-design judgments and must still be tested with
real Grade 7 children.

---

## 13. Final two-judge closure audit

The complete draft received two independent AI specialist reviews. One judge
used a child-development and engagement lens; the other used a
teaching-and-learning and curriculum lens. They are design checks, not a
replacement for a child psychologist, Mathematics educator, or testing with
real Grade 7 children.

| Judge | First-pass blockers found | Closure verdict |
|---|---|---|
| Child psychology and engagement | Child dialogue sometimes pre-solved discoveries; several chapters were overloaded; financial stakes could create pressure; some metaphors were misleading; the full Atlas could overwhelm | **Pass with non-blocking fixes. No architecture-level blockers.** |
| Mathematics teaching and learning | Current *Ganita Prakash* Part II was missing; HCF/LCM and current constructions/tilings were absent; integer multiplication used an unsafe model; retrieval and coverage mapping were incomplete | **Pass with non-blocking fixes. No architecture-level blockers.** |

### Fixes closed in this draft

- Current *Ganita Prakash* Parts I and II and the earlier NCERT progression are
  both mapped.
- HCF/LCM, current constructions and tilings, and the remaining Part II
  concepts have focused chapters.
- Overloaded Triangle, Mountain, Smart Shopper, Foldspace, and other worlds
  are split into coherent chapters while reusing their locations.
- Integer multiplication never uses “negative groups”; the timeline model now
  transfers to a second signed-number-line context before generalisation.
- The child’s opening lines invite investigation instead of announcing the
  mathematical strategy.
- Long chapters require natural pause-and-resume points, and the Atlas reveals
  only a few destinations at a time.
- Clockwork states the equal-precedence left-to-right convention explicitly.
- Triangle, circle, and right-triangle rearrangements are labelled intuitive
  evidence rather than claimed as complete proofs.
- Harmony Gardens visually separates minimum shared prime powers for HCF from
  maximum required powers for LCM.
- Every world has a later-session retrieval echo.

### Non-blocking checks for each deep storyboard

- Vary openings so the catalogue does not repeatedly begin with a broken
  machine or missing part.
- Make abstract chapters such as Component Crew and Network Route Rules change
  the physical story world; do not reduce them to sorting cards.
- Keep Nova as a teammate, give the child and supporting characters meaningful
  dialogue, and never let the avatar announce a discovery before the player
  makes it.
- Keep advanced routes such as Cipher Couriers and Gridlight Control optional,
  hint-supported, pausable, and free from progression pressure.
- Preserve the immediate action → consequence → everyday explanation →
  notation bridge in every sequel storyboard.
- Complete the quest-level concept-ID checklist before implementation so
  coverage can be audited directly.
- Validate the story on phone and desktop, then observe at least one real Grade
  7 child before copying its production pattern to more chapters.

### Final readiness decision

The current 20-world, 38-allocation architecture is ready for
**story-by-story discussion**. It is not blanket approval of 38 stories and the
count may grow or shrink. The next chapter must first pass the child-first
natural-fit gate, receive the full storyboard package in Section 8, have one
deeply implemented and browser-tested quest, and receive real-child feedback
before its pattern scales.
