-- LearnNnjoy pilot foundation. Apply in a new Supabase project before enabling hosted accounts.
create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published', 'retired');
create type public.skill_status as enum ('not_started', 'practising', 'confident');

create table public.guardians (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table public.learners (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references public.guardians(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  grade smallint not null check (grade between 4 and 12),
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (guardian_id, nickname)
);

create table public.curriculum_versions (
  id uuid primary key default gen_random_uuid(),
  board text not null default 'CBSE',
  academic_year text not null,
  created_at timestamptz not null default now(),
  unique (board, academic_year)
);

create table public.skills (
  id text primary key,
  curriculum_version_id uuid not null references public.curriculum_versions(id) on delete cascade,
  label text not null,
  grade_start smallint not null check (grade_start between 4 and 12),
  grade_end smallint not null check (grade_end between grade_start and 12),
  created_at timestamptz not null default now()
);

create table public.skill_prerequisites (
  skill_id text not null references public.skills(id) on delete cascade,
  prerequisite_skill_id text not null references public.skills(id) on delete cascade,
  primary key (skill_id, prerequisite_skill_id),
  check (skill_id <> prerequisite_skill_id)
);

create table public.quests (
  id uuid primary key default gen_random_uuid(),
  skill_id text not null references public.skills(id),
  title text not null,
  age_band text not null check (age_band in ('4-6', '7-9', '10-12')),
  status public.content_status not null default 'draft',
  estimated_minutes smallint not null check (estimated_minutes between 3 and 20),
  created_by uuid references public.guardians(id),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.quest_items (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references public.quests(id) on delete cascade,
  position smallint not null check (position > 0),
  prompt text not null,
  choices jsonb not null,
  answer text not null,
  hint text not null,
  explanation text not null,
  visual_kind text not null check (visual_kind in ('fraction', 'number-line', 'ratio')),
  misconception_tag text,
  unique (quest_id, position)
);

create table public.quest_attempts (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  quest_item_id uuid not null references public.quest_items(id) on delete cascade,
  selected_answer text not null,
  is_correct boolean not null,
  hint_used boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.skill_mastery (
  learner_id uuid not null references public.learners(id) on delete cascade,
  skill_id text not null references public.skills(id) on delete cascade,
  status public.skill_status not null default 'not_started',
  confidence smallint not null default 0 check (confidence between 0 and 100),
  last_practised_at timestamptz,
  primary key (learner_id, skill_id)
);

create table public.cosmetic_catalogue (
  id text primary key,
  label text not null,
  category text not null check (category in ('avatar', 'pet', 'room', 'world')),
  coin_cost integer not null check (coin_cost >= 0),
  is_active boolean not null default true
);

create table public.learner_wallets (
  learner_id uuid primary key references public.learners(id) on delete cascade,
  coin_balance integer not null default 0 check (coin_balance >= 0),
  updated_at timestamptz not null default now()
);

create table public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners(id) on delete cascade,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.parent_feedback (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references public.guardians(id) on delete cascade,
  learner_id uuid references public.learners(id) on delete set null,
  audience text not null check (audience in ('guardian', 'learner')),
  sentiment smallint check (sentiment between 1 and 5),
  response text,
  created_at timestamptz not null default now()
);

alter table public.guardians enable row level security;
alter table public.learners enable row level security;
alter table public.quest_attempts enable row level security;
alter table public.skill_mastery enable row level security;
alter table public.learner_wallets enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.parent_feedback enable row level security;

create policy "guardian reads own profile" on public.guardians for select using (id = auth.uid());
create policy "guardian creates own profile" on public.guardians for insert with check (id = auth.uid());
create policy "guardian updates own profile" on public.guardians for update using (id = auth.uid());
create policy "guardian manages own learners" on public.learners for all using (guardian_id = auth.uid()) with check (guardian_id = auth.uid());
create policy "guardian manages learner attempts" on public.quest_attempts for all using (learner_id in (select id from public.learners where guardian_id = auth.uid())) with check (learner_id in (select id from public.learners where guardian_id = auth.uid()));
create policy "guardian manages learner mastery" on public.skill_mastery for all using (learner_id in (select id from public.learners where guardian_id = auth.uid())) with check (learner_id in (select id from public.learners where guardian_id = auth.uid()));
create policy "guardian manages learner wallet" on public.learner_wallets for all using (learner_id in (select id from public.learners where guardian_id = auth.uid())) with check (learner_id in (select id from public.learners where guardian_id = auth.uid()));
create policy "guardian sees learner ledger" on public.wallet_ledger for select using (learner_id in (select id from public.learners where guardian_id = auth.uid()));
create policy "guardian writes own feedback" on public.parent_feedback for insert with check (guardian_id = auth.uid());
create policy "guardian reads own feedback" on public.parent_feedback for select using (guardian_id = auth.uid());

-- Published curriculum is readable by everyone in the authenticated pilot. Founder-only
-- content publishing is enforced in server actions using FOUNDER_EMAILS, never by the client.
alter table public.curriculum_versions enable row level security;
alter table public.skills enable row level security;
alter table public.skill_prerequisites enable row level security;
alter table public.quests enable row level security;
alter table public.quest_items enable row level security;
alter table public.cosmetic_catalogue enable row level security;
create policy "read curriculum" on public.curriculum_versions for select to authenticated using (true);
create policy "read skills" on public.skills for select to authenticated using (true);
create policy "read prerequisites" on public.skill_prerequisites for select to authenticated using (true);
create policy "read published quests" on public.quests for select to authenticated using (status = 'published');
create policy "read items from published quests" on public.quest_items for select to authenticated using (quest_id in (select id from public.quests where status = 'published'));
create policy "read active cosmetics" on public.cosmetic_catalogue for select to authenticated using (is_active = true);
