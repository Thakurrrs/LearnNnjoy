# LearnNnjoy Senior UX Audit

Date: 28 July 2026  
Scope: first entry, Grade 7 Home Base, Maths constellation, Story Journal, opening play, interactive story world, mobile layout, and one non-Maths chapter.

## Executive verdict

LearnNnjoy has crossed the line from “quiz with a story skin” into a recognisable adventure-learning product. Its strongest idea is that the mathematical object is inside the world: the child changes the ramp and sees the angle change. Nova gives the work a reason, the language is non-shaming, and private device-only progress is communicated well.

It is not yet ready to prove the core promise—turning a maths-disliking child into a maths-curious child—because the experience currently demonstrates engagement more strongly than durable conceptual learning. The two release blockers are the mobile interaction being hidden below a very tall visual stage, and the lack of enough transfer checks to know whether the child understood the concept rather than followed the presented pattern.

Recommended product decision: keep the current five Grade 7 Maths worlds as the pilot, fix the two Critical items, then run observed child tests before investing in AI personalisation, more grades, or richer video production.

## Journey health

1. **Welcome — Healthy, with expectation and identity friction**

   The hero statement is emotionally strong, the form is simple, and “No leaderboards—just you and Nova” clearly supports the private, low-pressure promise. The gender-labelled avatar choices conflict with the planned interest-led approach. “Grades 4–12” also creates a broad completeness expectation before the pilot has proven Grade 7 Maths.

   Evidence: `01-welcome-desktop.png`

2. **Home Base — Healthy structure, too much secondary framing on mobile**

   The resume card is excellent: it explains that the story is safe and names the exact event. Subject selection is clear. On mobile, the header wraps, the large title consumes substantial first-screen space, and the first subject action is pushed below the fold.

   Evidence: `02-home-base-desktop.png`, `10-home-base-mobile.jpg`

3. **Maths constellation — Strong metaphor, visually overloaded**

   The five playable topics are understandable and curriculum-labelled. However, ten dim “coming soon” stars compete with the five usable stars. The map communicates backlog more strongly than momentum and can make a pilot feel unfinished.

   Evidence: `03-grade7-maths-map-desktop.jpg`

4. **Story Journal — One of the best product decisions**

   Replay, live progress, hidden future scenes, and “Continue here” are clearly differentiated. This supports autonomy, review, and safe experimentation without reward farming. The event cards are readable and make progress tangible without peer pressure.

   Evidence: `04-story-journal-desktop.jpg`

5. **Opening play — Motivating, but still mostly a text panel**

   Nova and the child appear before the activity, the problem is personal, and “Skip intro” respects repeat players. The scene is visually polished, but most of the emotional work is still carried by a sentence in a dialogue box. Repeating the same three-scene rhythm across every event could become predictable.

   Evidence: `05-opening-play-desktop.jpg`

6. **Interactive Maths world — Strongest part of the product**

   The ramp, rider, angle, Nova explanation, and choices share one visual context. This is materially better than a detached quiz. The child can connect “steeper” and “flatter” to the measured turn. The weakness is assessment depth: one guided representation and a small set of choices do not yet show that the child can transfer the idea to a different shape or situation.

   Evidence: `07-active-math-interaction-desktop.jpg`

7. **Mobile story — Visually immersive, functionally risky**

   At 375 × 812, the entire first screen is the scene. The teaching text and all actions appear only after a long scroll, with no visible cue that the child must scroll. A child can reasonably believe the page is an animation that has stopped.

   Evidence: `08-interactive-world-mobile-top.jpg`, `09-interactive-world-mobile-actions.jpg`

8. **Science chapter — High visual quality and clear chapter framing**

   The chapter title, optional recap, captions promise, progress position, and single action form a strong cinematic entry. Its art quality currently exceeds the Maths world, which exposes an inconsistent production bar between subjects.

   Evidence: `11-science-chapter-desktop.jpg`

## What is genuinely great

- **The child is the helper, not the test-taker.** Nova needs the child, which creates agency without adult pressure.
- **Maths changes the world.** The ramp angle is visible in the same place where the rider reacts; this is the right pedagogical direction.
- **The tone is psychologically safe.** There are no public ranks, teacher dashboards, punishment states, or peer comparison.
- **Resume and Journal solve a real child-use problem.** Leaving, returning, replaying, and reviewing are treated as normal.
- **The worlds have memorable identities.** Skatepark Architect, Smart Shopper, Balance Lab, Mountain Rescue, and Cricket Data Room are more recallable than chapter numbers.
- **The information architecture is understandable.** Home Base → subject → topic map → story → event is a sensible growth path for a multi-subject app.
- **Semantic foundations are promising.** The inspected build uses named buttons, a labelled dialog, regions, tabs, and headings rather than making every surface an unlabelled graphic.

## What is unnecessary right now

- **“Boy explorer” and “Girl explorer” labels.** Keep the artwork, but name styles by interests or personality: Trailblazer, Stargazer, Builder, Storyteller.
- **Ten visible coming-soon stars.** Show the five pilot stories and one inviting “More constellations are forming” destination. The full syllabus can live in a curriculum view later.
- **Avatar World as a primary map action before the learning loop is validated.** Cosmetic progression can remain, but it should not compete with Continue, Journal, and Home.
- **Additional novelty systems before child evidence.** More coins, streak systems, camera/gesture controls, and AI personalisation would add complexity without resolving the current learning and mobile risks.
- **Repeating three intro slides for every replay.** Keep the intro for first play; on replay, default to the activity and offer “Watch story again.”

## Critical

### C1. The main action is hidden on a typical phone

The 375 × 812 evidence shows the world filling the viewport while the explanatory text and controls are below a long scene. There is no visible scroll cue or partial action tray.

**Required outcome:** on mobile, keep the interactive scene to roughly 45–55% of the usable viewport, show at least the activity heading and first action without scrolling, and use a sticky or immediately adjacent action tray. The child should never have to infer that the activity continues below the artwork.

### C2. The experience does not yet prove conceptual transfer

The scene helps a child recognise a 20° versus steeper ramp, but recognition inside one illustrated example is not enough evidence that the child understands angles. Completing a guided choice can look like learning even when it is pattern matching.

**Required outcome:** every five-event story should include a consistent learning arc:

1. Predict before seeing the result.
2. Manipulate the mathematical object.
3. Explain or choose why the result happened.
4. Apply the concept in a visually different situation.
5. Retrieve it again near the finale.

Completion should require at least one transfer example, not more quiz questions in the same representation.

## Must have

### M1. Simplify the phone hierarchy

Prevent wrapped navigation, reduce first-screen title height, keep primary actions visible, and ensure touch targets are at least approximately 44 × 44 CSS pixels. Home Base and story screens should each have one dominant action.

### M2. Replace gender-led onboarding with interest-led identity

Ask what the child enjoys—building, sport, stories, nature, shopping, puzzles, space—after they have tried one short adventure. Use that information for future story recommendations. Do not make gender a content proxy.

### M3. Reduce the constellation to playable value

Visually prioritise five available Grade 7 Maths stories. Move the rest into a compact syllabus/progress drawer or a single “more coming” node. A child should see possibilities, not a backlog.

### M4. Establish one visual production bar

The welcome and Science chapter use rich, cinematic illustration; the Skatepark uses stylised scene construction and emoji-like characters. Choose a repeatable art direction for the pilot and apply it to Nova, the child, world objects, and motion. Consistency matters more than expensive animation.

### M5. Make reading and audio support consistent

Every spoken/story line should have captions, replay, pause, and a child-friendly narration option. The interface must still work fully without sound. Do not rely on colour or animation alone to explain mathematical change.

### M6. Clarify first-play versus replay behaviour

First play can include the full opening and closing plays. Replay should start at the selected learning event by default and offer the story sequence as an option. This protects pace while preserving narrative.

### M7. Validate with children before expanding scope

Run five to eight observed Grade 7 sessions. Measure whether children can start without help, identify what changed, explain the concept in their own words, solve one new representation, and voluntarily choose another event. Likes/dislikes alone will measure entertainment, not learning.

## Good to have

- Interest-based story recommendations after enough real choices exist.
- A “What I discovered” card in the Journal, written in child language and represented visually.
- More expressive Nova narration once the voice direction is selected.
- Small celebration beats tied to conceptual discoveries rather than every tap.
- A lightweight session ending: “You helped Nova discover…” plus one optional next quest.
- Downloadable/offline story assets for inconsistent mobile connections.
- Reduced-motion controls and animation speed controls.
- Later, adaptive difficulty based on misconception patterns—not merely right/wrong counts.

## Accessibility evidence limits

This was a visual and interaction-flow audit using desktop and 375 × 812 browser states plus the exposed semantic structure. It did not include a screen-reader session, measured contrast audit, keyboard-only completion test, motion-sensitivity test, network/performance test, or testing with children with disabilities. The current named controls, dialog, tabs, regions, headings, captions copy, and sound toggle are positive foundations, but this report is not an accessibility certification.

## Recommended next milestone

Do not expand grades or add AI yet. Run a focused “Grade 7 child-test readiness” milestone: fix the mobile action layout, add one transfer check and one retrieval beat to each of the five Maths stories, remove the unnecessary pilot chrome, then test with real children.
