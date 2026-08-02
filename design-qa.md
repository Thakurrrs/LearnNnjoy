# Nova’s Night Run — Design QA

## Target and captures

- Selected target: `docs/superpowers/visuals/nova-night-run-selected-option-1.png`
- Same-viewport comparison: `docs/superpowers/visuals/nova-night-run-design-qa-comparison.png`
- Mobile implementation: `docs/superpowers/visuals/nova-night-run-implementation-mobile.png`
- 375px implementation: `docs/superpowers/visuals/nova-night-run-implementation-375.png`
- Desktop implementation: `docs/superpowers/visuals/nova-night-run-implementation-desktop.png`

## Comparison passes

### Pass 1 — fidelity and interaction

- P1 · behavior/layout: the first implementation placed a large full-circle angle fill behind oversized characters and put the learning action in conventional bottom-panel buttons. This weakened the target’s “touch the maths in the world” intent.
- Fix: reduced the characters, moved the rail crossing into the main play area, limited the angle fills to the concept currently being explored, and placed 52px glowing semantic controls directly on the relevant corners.
- P1 · mobile navigation: the existing five-item activity navigation wrapped into two cramped rows at 390px.
- Fix: the Night Run mobile navigation now uses a single compact row with LearnNnjoy, Previous, Home, and Map; the redundant sound/avatar treatment is removed at this width.

### Pass 2 — imagery, type, color, and surfaces

- The selected purple-pink rooftop palette, cyan/magenta rails, soft white dialogue bubble, Nova, and the learner’s selected avatar are represented with real generated image assets.
- Transparent character cutouts were checked for masking artifacts; no visible green fringe remains at mobile or desktop scale.
- The dialogue hierarchy is short and readable. The formal concept name appears only after the visual discovery.
- The mission HUD, dialogue, direct-manipulation glows, and bottom action deck preserve the selected target’s rounded luminous surface language without introducing unrelated card styles.
- The implementation deliberately keeps LearnNnjoy’s live app navigation and uses tap-to-pair rather than a gesture-only drag. The mathematical action still occurs on the rails and remains keyboard/screen-reader operable.

### Pass 3 — responsive and accessibility

- Checked at 375×812, 390×844, and 1440×900.
- No content collision, horizontal overflow, broken wrapping, or unusable controls was observed.
- Mathematical hotspots meet practical mobile tap-target sizing.
- Canvas art is decorative; every learning action has a semantic button or labelled slider.
- Character images have descriptive alt text; dialogue uses a live region.
- Disabled states remain visually distinct, focusable actions use native controls, and reduced-motion CSS disables animation and transition effects.

### Pass 4 — story state and safety

- Previous Scene preserves discovered interaction state.
- Home Base resumes the exact scene and interaction after Home, refresh, and reopen.
- The Journal exposes only opened events.
- Replay of the fifth event shows the safe replay message and does not add coins or live completion credit.
- Browser console check found no errors or warnings.

## Remaining findings

No P0, P1, or P2 findings remain for this vertical slice.

final result: passed
