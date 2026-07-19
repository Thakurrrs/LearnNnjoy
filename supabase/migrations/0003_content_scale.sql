-- Scalable authoring contract for multi-subject, story-led missions.
-- Apply after 0001_pilot_foundation.sql and 0002_learner_state.sql.
alter table public.quests
  add column if not exists subject text not null default 'maths'
    check (subject in ('maths', 'science', 'social', 'english')),
  add column if not exists grade smallint not null default 4
    check (grade between 4 and 12),
  add column if not exists learning_objective text,
  add column if not exists story_context jsonb not null default '{}'::jsonb;

alter table public.quest_items
  drop constraint if exists quest_items_visual_kind_check;

alter table public.quest_items
  add constraint quest_items_visual_kind_check
    check (visual_kind in ('fraction', 'number-line', 'ratio', 'formula', 'coordinate', 'ecosystem')),
  add column if not exists difficulty smallint not null default 2
    check (difficulty between 1 and 5),
  add column if not exists learning_objective text,
  add column if not exists support_prompt text;

create index if not exists quests_subject_grade_published_idx
  on public.quests (subject, grade, status, created_at desc);

create index if not exists quest_attempts_learner_item_created_idx
  on public.quest_attempts (learner_id, quest_item_id, created_at desc);

-- `story_context` carries approved chapter/outcome/video metadata, e.g.
-- {"chapterTitle":"…","videoCue":"…","outcomeTitle":"…"}.
-- Keeping it on the quest lets editorial review happen before a story asset
-- is rendered in a child-facing client.
