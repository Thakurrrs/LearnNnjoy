# Lumina Design System

The single source of truth for LearnNnjoy's visual language. Any new screen,
world, or asset must conform — or update this document first.

## Brand essence

Night-sky wonder, gentle mentorship, earned light. The app never shouts,
never pressures, never uses red-for-wrong. Progress = light spreading.

## Core tokens

| Token | Value | Use |
|---|---|---|
| `--lumina-ink` | `#191238` | Headings, dark shells |
| `--lumina-violet` | `#7c60e8` | Primary actions, focus rings |
| `--lumina-gold` | `#ffd66b` | Rewards, ready-to-play stars, coins |
| `--lumina-mint` | `#9dffd8` | Completed / mastered states |
| `--lumina-cream` | `#fdfbf4` | Light-shell backgrounds |
| Radius | 18–24px cards, 999px pills | Everything rounded, nothing sharp |
| Type scale | h1 2.4–3rem / h2 1.6rem / body 1rem / eyebrow 0.72rem caps +0.08em | Eyebrows always uppercase with letter-spacing |

## Motion rules

- Durations: micro-feedback 150–250ms; scene entrances 400–600ms; ambient
  loops (twinkle, pulse) 2–3s ease-in-out infinite.
- Motion always means something: reward, state change, or guidance. Never
  decoration-only on interactive screens.
- Every animation gets a `prefers-reduced-motion: reduce` fallback.

## Grade themes (existing)

`theme-explorer` (Grades 4–6, warm + playful), `theme-pathfinder` (7–9,
cool + adventurous), `theme-navigator` (10–12, calm + precise). Do not mix
theme accents within one screen.

## World palettes (Grade 7 — implemented in world.css by Task 15)

| World | Direction | `--world-accent` | Sky top → bottom |
|---|---|---|---|
| mountain | storm-light alpine: slate blues, ice light | `#4f7fb8` | `#eef4fb` → `#dbe7f4` |
| balance | violet energy lab: arcane glow, amber sparks | `#7c60e8` | `#f3effd` → `#e6defa` |
| shop | warm bazaar: lantern orange, dusk pink | `#e8702a` | `#fff4ea` → `#fde3cf` |
| skatepark | neon rooftop sunset: magenta + teal accents | `#d84f9a` | `#fdeef7` → `#e8e0f7` |
| cricket | floodlit stadium: pitch green, night sky | `#2f9d5f` | `#eefaf1` → `#d9f0e2` |

Rule for future worlds: pick ONE deliberate direction (name it in this
table), one accent, one two-stop sky. Never default to the generic
flat-card look — that is the failure mode this document exists to prevent.

## Nova character sheet (A5 — for consistent art generation)

- Species/form: small four-point star, warm gold `#ffd66b`, soft rounded
  points, subtle outer glow.
- Face: two simple dark oval eyes, tiny smile; no eyebrows, no limbs.
- Personality in posture: curious lean toward the learner's task; never
  hovering over the child's answer area.
- Cosmetic anchor: items sit at Nova's lower-left point, tilted −12°
  (matches `.nova-gear` in code).
- Scale: Nova ≈ 1/6 of scene height in wide scenes, 1/3 in close-ups.
- Generation prompt template: "A small friendly four-point golden star
  character with soft glow, simple dark oval eyes and a tiny smile,
  [ACTION] in [WORLD DIRECTION from the table above], children's book
  digital painting, deep purple night-sky palette with warm gold accents,
  no text" — always attach 2–3 previous Nova renders as reference images.

## Asset pipeline (per new scene)

1. Collect 2–3 reference images for the section (not whole-page refs).
2. Generate with the prompt template + Nova references; regenerate until
   Nova matches the sheet (eyes, glow, point count are the drift points).
3. Export ≤ 400KB WebP/PNG to `public/images/`, named `lumina-<world>-<scene>.png`.
4. QA rubric before shipping (from the brand-sites bookmark): typography,
   color, hierarchy, animation, mobile, copy — all six checked on-device.
