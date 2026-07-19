-- Hosted continuation for the current pilot UI.
-- Quest attempts and mastery remain available as normalized tables in 0001;
-- this table safely carries the existing learner experience between devices.
create table public.learner_states (
  learner_id uuid primary key references public.learners(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.learner_states enable row level security;

create policy "guardian manages own learner state"
  on public.learner_states
  for all
  using (
    learner_id in (select id from public.learners where guardian_id = auth.uid())
  )
  with check (
    learner_id in (select id from public.learners where guardian_id = auth.uid())
  );
