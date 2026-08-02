# Grade 7 Story Experience Panel — 2026-07-29

## Scope

This review compares the current Mountain Rescue and Moonbase Tenfold experiences with Nova's Night Run. The intended benchmark is Night Run Quests 1–4, where the incident is acted, the child causes a story action, the world reacts, and the mathematics is named after the child sees it. Night Run Quests 5–8 do not yet meet that same bar.

Three review lenses were used:

- Child engagement and developmental fit
- Grade 7 mathematics pedagogy
- Interactive narrative and game UX

The review is based on a fresh 1440×1000 local capture of the current implementation and source/asset inspection. It is not a substitute for a child playtest.

## Panel verdict

| Experience | Child engagement | Mathematics pedagogy | Interactive story | Consensus |
| --- | ---: | ---: | ---: | ---: |
| Night Run Quests 1–4 | 8.1 | 7.8 | 8.5 | 8.1/10 |
| Mountain Rescue | 7.0 | 7.0 | 6.3 | 6.8/10 |
| Moonbase Tenfold | 5.8 | 5.2 | 4.8 | 5.3/10 |

Mountain Rescue and Moonbase Tenfold have dialogue before each quest, but a dialogue panel is not the same as an acted skit. Mountain Rescue is closer to the target and mainly needs continuity, child agency, and an enacted payoff. Moonbase needs a deeper redesign of both its openings and its learning interactions.

## Captured steps and health

1. Night Run Quest 1 acted opening — Healthy
2. Night Run Quest 2 voiced opening — Healthy
3. Night Run Quest 5 static opening — Needs work
4. Mountain Rescue Quest 1 opening — Needs work
5. Mountain Rescue Quest 3 opening — Needs work
6. Mountain Rescue Quest 3 activity — At risk
7. Mountain Rescue finale — Critical
8. Moonbase Quest 1 opening — Critical
9. Moonbase Quest 3 opening — Critical
10. Moonbase Quest 3 activity — Critical
11. Moonbase finale — Healthy payoff, but isolated from weaker preceding play

## Critical changes

### 1. Use one canonical quest rhythm

Every concept quest should follow:

1. Acted incident
2. Natural request for help
3. Child changes a real story object
4. World and characters visibly react
5. Nova names the pattern in one child-friendly sentence
6. Child tries a changed version
7. A short closing act hands off to the next quest

### 2. Repair Mountain Rescue continuity

- Quest 1 should locate and secure the pod at −4, not recover it completely.
- Quest 2 should rebuild the safe route.
- Quest 3 should operate an empty winch hook or beacon during wind gusts, not move a supposedly recovered pod.
- Quest 4 should lower the empty hook from +2 to −4, attach the pod, then reverse and lift it to +2.
- The finale should visibly dock the energy cell, warm the shelter, show Pip reacting, and reveal the aurora before Nova recaps.

The current sequence contradicts itself: Quest 1 appears to recover the pod, Quest 3 resets and moves it, and Quest 4 says it is still trapped.

### 3. Restore Mountain Rescue voice assets

The implementation references 17 `q1-v3` audio files that are not present in `public/audio/mountain-rescue`. Add the files and an automated asset-existence check.

### 4. Rebuild Moonbase as physical place-value play

- Quest 1: drag the same digit module among fixed place slots; the route or display changes because the digit moved.
- Quest 2: group ten signal packets into one bundle and dock it in a coordinate slot.
- Quest 3: move comma gates/group separators while keeping the digits and location fixed.
- Quest 4: align digit columns, choose a useful estimate through an aiming lens, then focus to the exact value.

Each opening needs four to six voiced beats with a visible incident and quest-specific character/prop states.

## Must-have improvements

- Put character reactions inside the active play space instead of leaving the cast as static decoration.
- Give every quest a short closing skit whose final beat becomes the next quest's opening.
- Hide formal concept labels until the child has seen the consequence.
- Replace misleading `1/4` counters with the real number of beats.
- Require one changed transfer attempt before completion.
- Treat Night Run Quests 1–4 as the benchmark; upgrade Night Run Quests 5–8 rather than copying their simpler popup pattern.

## Good-to-have improvements

- Build reusable layered 2D scene choreography rather than full videos.
- Direct each spoken line by emotion and intention, not only by character.
- Pair direct manipulation with accessible button and keyboard alternatives.
- Keep skits around 15–30 seconds, with captions, replay, skip, and reduced-motion support.

## Trade-offs

| Direction | Advantages | Risks and mitigation |
| --- | --- | --- |
| Voiced micro-skits | Emotion, context, lower reading burden | More audio/timing QA; keep scenes to 4–6 lines and reuse the scene engine |
| Layered 2D scenes | Free-friendly, responsive, reusable, interactive | Can resemble sliding stickers; use poses, props, reactions, and state changes |
| Direct manipulation | The child causes the concept and receives immediate evidence | Mobile/accessibility complexity; pair gestures with buttons and keyboard controls |
| Seamless handoffs | Stronger story coherence and curiosity | More state-machine work; reuse the ending beat as the next opening |
| Delayed mathematics labels | Discovery feels like play, not a lecture | Recall can weaken if delayed too long; name the pattern immediately after the consequence |

## Three future story guides

### Balance Lab — Simple Equations

Nova pulls the wrong counterweight and a supply capsule tilts and locks. The child adds or removes matching pieces from both sides. The beam visibly levels or tilts after every action. Only then does Nova name the relationship: making the same change on both sides keeps the balance. A changed arrangement verifies transfer, and the opened capsule supplies the next chapter's tools.

### Festival Makers — Fractions

A ribbon-and-light plan fails during rehearsal because the pieces do not cover equal parts of the same whole. The child keeps the whole visible, cuts or overlays fraction pieces, and shares a remainder. Each valid action lights a matching part of the canopy. Nova names the fraction relationship after the physical result. The child chooses the final color sequence and the completed canopy becomes the ending act.

### Vanishing Glowtails — Data Handling

A glowtail crossing is missing, but the sighting board contains duplicate and incomplete reports. The child validates tokens and moves the same evidence from trail markers to a table and then a graph. Nova makes a plausible wrong guess that the child corrects using the evidence. New data changes the search route, and the ending shows the herd found safely.

## Accessibility and evidence limits

Visible strengths include large comic text, captions and skip controls in the stronger Night Run scenes, and number labels in addition to color on the Mountain route. Remaining risks include misleading progress counters, visually static speakers, gesture-only interaction if accessible alternatives are omitted, and potential dependence on motion or color.

Screenshots cannot establish keyboard order, screen-reader wording, audio quality, reduced-motion behavior, mobile ergonomics, performance, or real child comprehension. Those require dedicated testing at 375px, with keyboard/screen reader/reduced motion, and with children.
