# Kid-as-Hero Story Redesign — Design Spec

*2026-07-27 · builds on branch `feature/kid-interest-pack` (constellation map, cosmetics rendering, finales, sound, world themes).*

## 1. Vision

The learner becomes the protagonist. Nova the star stops being the main character and becomes the kid's **best friend who needs their help**. Every story beat is Nova flying to the kid — addressed by their real nickname — with a concrete problem the kid solves; the maths/science/reading IS the rescue. Coins dress the kid's avatar; levels hatch pet companions.

## 2. Identity: the kid's avatar

- **Selection.** The welcome card gains a "Choose your explorer" row after nickname/grade: three tappable portrait chips — **boy**, **girl**, **star explorer** (hooded, gender-neutral). No selection forced: default is the star explorer.
- **Save data.** `SavedProgress` gains `avatar: "boy" | "girl" | "explorer"`, validated in `applySavedProgress` like every other field. Old saves (no field) → `"explorer"`. Key and all other fields unchanged.
- **Art.** Three painted portrait busts in the Lumina style, generated per the character-sheet rules in `docs/design/LUMINA-DESIGN-SYSTEM.md` (deep-purple night sky, warm gold accents, children's-book digital painting). One ~1024px image per character in `public/images/avatars/` (≤400KB WebP/PNG: `hero-boy.png`, `hero-girl.png`, `hero-explorer.png`). Displayed inside a circular **explorer badge** (gold ring) that scales from topbar chip to story panel — one asset per character, no per-size art. Portraits are swappable files; code never depends on their content.
- **Component.** `HeroBadge({ avatar, name, size, level? })` renders the circular portrait + name + optional level star. `HeroDuo({ avatar, name, equippedCosmetic, pet? })` renders the hero badge with Nova floating beside it and the active pet (if any) — the standard identity mark for quest sidebar, story dialogue panels, outcome, finale, and topbars. Grade themes (explorer/pathfinder/navigator) restyle the ring, not the portrait.

## 3. Economy retarget: cosmetics dress the KID

- `equippedCosmetic` (existing field, existing shop, existing coins) now renders on the **hero badge**, not on Nova: the item emoji anchors to the badge ring's lower-left, tilted −12° (the exact `nova-gear` treatment, moved). Premium cosmetics additionally restyle the **ring**: `aurora` → aurora-gradient ring, `starglow` → soft glow ring; others keep the gold ring.
- Nova keeps her signature ✨ look permanently — she is a character, not a mannequin. `NovaCompanion` drops its cosmetic prop and becomes a pure Nova mark.
- Avatar World copy updates: "Everything you wear was earned by your ideas." The covenant is unchanged: cosmetics never affect gameplay.

## 4. Explorer Levels

- **A monotonic lifetime counter.** `SavedProgress.lifetimeDiscoveries: number` (default 0) increments by 1 on every correct quest discovery and every first-time adventure completion. It only ever goes up — grade switches and mission resets never touch it, so the level (and pet growth) can never regress. On first load of an old save without the field, it is seeded once from existing progress (`correct + completedAdventures.length`).
- **Thresholds, not XP.** `src/lib/levels.ts`: `LEVEL_THRESHOLDS = [0, 3, 7, 12, 18, 25, 33, 42, 52, 63]` (discoveries needed for levels 1–10; +12 per level beyond). `getExplorerLevel(lifetimeDiscoveries)` returns `{ level, toNext }` so UI can say "3 more discoveries to Level 4".
- **Display.** Small level star on the hero badge (`Lv 4`), and a progress line in Avatar World. No leaderboards, no comparison — the level is private, like everything else.

## 5. Pet — one companion, chosen once, grows forever

- **One pet per kid.** At **Level 2** a star-egg appears and hatches; the kid **chooses one pet** from the stack (permanent choice — "your forever friend"). No further pets are ever granted; all later levels grow the chosen pet. Coins never involved (pure achievement).
- **The stack** (catalog in `src/lib/pets.ts`):

| Pet | Emoji |
|---|---|
| Splash the star-dolphin | 🐬 |
| Comet the star-bunny | 🐰 |
| Pip the moon-fox | 🦊 |
| Drift the cloud-turtle | 🐢 |
| Ember the comet-dragon | 🐉 |

- **Growth stages**, reached at levels and never lost:

| Stage | At level | Title | Visual treatment |
|---|---|---|---|
| 1 | 2 | Hatchling | small emoji, soft glow |
| 2 | 4 | Explorer | full-size emoji, gold sparkle |
| 3 | 7 | Voyager | larger, starlight trail ring |
| 4 | 10 | Radiant | largest, aurora glow ring |

Each stage-up gets a celebration line in the pet's own flavor ("Splash learned to leap through starlight!") shown on the outcome/finale screen when the threshold is crossed.
- **Save data.** `SavedProgress.pet: string | null` (chosen pet id, validated; default null). Growth stage is **computed** from the Explorer Level — never stored, never regresses (see §4's monotonic counter).
- **The pet is permanent.** `chooseGrade`/`openGradePicker` reset mission progress today — they must NOT touch `pet` or `lifetimeDiscoveries`. `levels.test.ts` and `pets.test.ts` cover this reset path explicitly.
- **Display.** The pet floats beside the hero badge in `HeroDuo` at its current stage size (emoji-rendered; illustrated versions later via the art pipeline). Avatar World gains a "Star Friend" section: before Level 2 it shows the dim egg ("Hatches at Level 2"); after choosing, it shows the pet, its stage, and "grows again at Level 7".
- Rationale: two clean motivation loops — **coins = spending** (cosmetics), **levels = growing your friend** (attachment beats collection at this age).

## 6. Story reframing — the Story Bible

All kid-facing copy follows these rules (enforced in review + copy-lint test):

1. **Nova speaks first-person with feelings** — worried, amazed, silly. Sentences ≤12 words. She celebrates specifically ("Half for me, half for Mira!"), never generically ("Great job").
2. **Concrete stakes.** Every chapter: someone wants something real and can't get it without the kid. No machinery-with-requirements ("the console needs a clean rule" is banned).
3. **One metaphor per mission**, carried across chapter → quest → outcome. No prop churn.
4. **Reading level ≈ 2 grades below the learner.** The story must be easier than the maths. Copy-lint test asserts max words/sentence per grade band (G4–6: ≤12; G7–9: ≤16; G10–12: ≤20).
5. **No meta-reassurance on kid screens.** "This is not a score", "never changes your reward", caption notices → move to parent-facing surfaces or quiet corners. Kid screens carry story only.
6. **Story-contextual labels.** Completion labels name the help just given, in the mission's own fiction — rescue mission → "Pod safe!", fair-share story → "Fair and square!", shop → "Deal done!", skatepark → "Ramp ready!", cricket → "Squad picked!". Generic celebration ("MISSION MOMENT COMPLETE", even "YOU DID IT!") and LMS labels ("Thoughtful stretch" → "Bonus star", "Maths calibration" → "Nova checks your trail") are replaced everywhere; the copy-lint test carries a banned-label list.
7. **`learningObjective` never leaks into dialogue.** It stays in the data for parent/teacher surfaces; dialogue is written from the character's want, not the objective.

- **Copy architecture.** Content strings use a `{hero}` token; `personalize(text, name)` in `src/lib/personalize.ts` fills it at render (and strips gracefully if name empty). Applies to: welcome CTA, Grade-4 story beats, `lesson-story.ts` dialogues/coach lines/outcomes, quest mission copy in `page.tsx`, all five Grade-7 activity scripts, `finaleCopy`, and pet-hatch copy.
- **Scope: everything** (per decision) — both the framing flip (Nova asks {hero} for help) and the Story-Bible quality rewrite happen in one pass, file by file.

## 7. Testing

- `avatars.test.ts` — catalog integrity, `getAvatar` fallback to explorer.
- `levels.test.ts` — threshold boundaries, old-save shapes, `toNext` math.
- `pets.test.ts` — unlock-at-level correctness, no duplicate unlocks, validated ids.
- `personalize.test.ts` — token replacement, empty-name behavior, no stray `{hero}` in any exported copy table (imports the real content files and scans).
- Copy-lint test — max sentence length per grade band over the story content files.
- Existing 49 tests must stay green; `SavedProgress` backward compat verified with an old-shape fixture.

## 8. Out of scope

- Animating portraits; illustrated pets (emoji first); avatar aging by grade; voice narration; parent dashboard surface for the relocated meta-copy (copy simply moves out of kid screens now, parent surface later); dress-up art variants per cosmetic.

## 9. Build order (for the implementation plan)

1. Art generation + `avatars.ts` + `HeroBadge`/`HeroDuo` (identity foundation)
2. Welcome picker + save field + render replacement of NovaCompanion sites
3. Cosmetics retarget (badge anchor + ring styles) + Avatar World copy
4. `levels.ts` + level display
5. `pets.ts` + hatch moment + Star Friends section
6. Story rewrite: `personalize.ts`, then content files (welcome/story/lesson-story/page copy/G7 scripts/finales) under the Story Bible
7. Copy-lint + integration verification
