# LearnNnjoy

An English-first, visual Maths adventure for Grades 4–12. The initial invite-only pilot helps learners build confidence through short guided Number Sense quests rather than timed drills or public rankings.

## Pilot experience

- Parent-supervised learner onboarding with nickname and grade only
- Gentle diagnostic that chooses a starting trail
- Visual fraction, number-line, and ratio quests
- Retry-with-explanation feedback and rules-based next steps
- Cosmetic Lumina rewards and a private parent snapshot
- Guardian magic-link sign-in and cloud saving, with local progress as a fallback
- Installable web-app metadata for phone and tablet pilots

## Run locally

```bash
npm install
npm run dev
```

Run `npm run lint` and `npm run build` before sharing changes.

## Supabase pilot setup

Copy `.env.example` to `.env.local`, then set the Project URL and browser-facing publishable key. Do not commit `.env.local` or add a secret, service-role, or database key to it.

Apply the SQL migrations in order in the Supabase SQL Editor:

1. `supabase/migrations/0001_pilot_foundation.sql`
2. `supabase/migrations/0002_learner_state.sql`

Under **Authentication → URL Configuration**, add `http://localhost:3000` while developing. Add the production URL once deployed. The welcome screen emails a guardian a magic sign-in link; signed-in learner progress is then stored under that guardian account.

The next backend slices are founder-only content publishing, normalized attempt analytics, and production consent/data-retention controls.
