import type { SupabaseClient, User } from "@supabase/supabase-js";

export type HostedProgress = {
  name: string;
  grade: number;
  state: Record<string, unknown>;
};

export type HostedLearnerState = {
  learnerId: string;
  state: Record<string, unknown>;
};

export function shouldResetHostedState(existingGrade: number | undefined, selectedGrade: number) {
  return typeof existingGrade === "number" && existingGrade !== selectedGrade;
}

async function ensureGuardian(client: SupabaseClient, user: User) {
  const { error } = await client.from("guardians").upsert(
    { id: user.id, email: user.email ?? "guardian@learnnjoy.local" },
    { onConflict: "id" },
  );

  if (error) throw error;
}

export async function loadOrCreateHostedLearner(
  client: SupabaseClient,
  user: User,
  progress: HostedProgress,
): Promise<HostedLearnerState> {
  await ensureGuardian(client, user);

  const { data: existingLearner, error: learnerReadError } = await client
    .from("learners")
    .select("id, grade")
    .eq("guardian_id", user.id)
    .eq("nickname", progress.name || "Explorer")
    .maybeSingle();

  if (learnerReadError) throw learnerReadError;

  const learnerId = existingLearner?.id ?? (
    await client
      .from("learners")
      .insert({ guardian_id: user.id, nickname: progress.name || "Explorer", grade: progress.grade })
      .select("id")
      .single()
  ).data?.id;

  if (!learnerId) throw new Error("We could not create this learner profile yet.");

  // A nickname is intentionally unique within a guardian account. When a
  // guardian changes that learner's grade, their previous grade's saved route
  // must never pull the child back into an old mission.
  const gradeChanged = shouldResetHostedState(existingLearner?.grade, progress.grade);
  if (gradeChanged) {
    const { error: gradeUpdateError } = await client
      .from("learners")
      .update({ grade: progress.grade })
      .eq("id", learnerId);
    if (gradeUpdateError) throw gradeUpdateError;
  }

  const { data: hostedState, error: stateError } = await client
    .from("learner_states")
    .select("state")
    .eq("learner_id", learnerId)
    .maybeSingle();

  if (stateError) throw stateError;

  if (!hostedState || gradeChanged) {
    const { error: insertError } = await client
      .from("learner_states")
      .upsert({ learner_id: learnerId, state: progress.state, updated_at: new Date().toISOString() }, { onConflict: "learner_id" });
    if (insertError) throw insertError;
  }

  return { learnerId, state: gradeChanged ? progress.state : (hostedState?.state as Record<string, unknown> | undefined) ?? progress.state };
}

export async function saveHostedLearnerState(
  client: SupabaseClient,
  learnerId: string,
  state: Record<string, unknown>,
) {
  const { error } = await client
    .from("learner_states")
    .upsert({ learner_id: learnerId, state, updated_at: new Date().toISOString() }, { onConflict: "learner_id" });
  if (error) throw error;
}
