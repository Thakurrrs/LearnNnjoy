# LearnNnjoy

An English-first, visual Maths adventure for Grades 4–12. The initial invite-only pilot helps learners build confidence through short guided Number Sense quests rather than timed drills or public rankings.

## Pilot experience

- Parent-supervised learner onboarding with nickname and grade only
- Gentle diagnostic that chooses a starting trail
- Visual fraction, number-line, and ratio quests
- Retry-with-explanation feedback and rules-based next steps
- Cosmetic Lumina rewards and a private parent snapshot
- Local progress persistence while hosted authentication and database services are added
- Installable web-app metadata for phone and tablet pilots

## Run locally

```bash
npm install
npm run dev
```

Run `npm run lint` and `npm run build` before sharing changes.

## Current boundary

The first implementation is intentionally a local pilot shell. The hosted data model is ready in `supabase/migrations/0001_pilot_foundation.sql`; apply it to a free Supabase project and copy its URL/anon key into `.env.local` using `.env.example` as the template. Guardian invite authentication, founder-only server actions, and production consent/data controls are the next backend delivery slice.
