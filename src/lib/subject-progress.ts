export type ActiveSubject = "maths" | "science" | "english" | "social";

export type SubjectMissionProgress = {
  questIndex: number;
  correct: number;
  attempts: number;
  hintRequests: number;
  diagnosticCorrect: number;
};

export type SubjectProgress = Partial<Record<ActiveSubject, SubjectMissionProgress>>;

export function isSubjectMissionProgress(value: unknown): value is SubjectMissionProgress {
  if (!value || typeof value !== "object") return false;
  const progress = value as Record<string, unknown>;
  return ["questIndex", "correct", "attempts", "hintRequests", "diagnosticCorrect"].every((key) => typeof progress[key] === "number" && Number.isFinite(progress[key]));
}

export function readSubjectProgress(value: unknown): SubjectProgress {
  if (!value || typeof value !== "object") return {};
  return (Object.entries(value as Record<string, unknown>) as [ActiveSubject, unknown][]).reduce<SubjectProgress>((progress, [subject, mission]) => {
    if ((subject === "maths" || subject === "science" || subject === "english" || subject === "social") && isSubjectMissionProgress(mission)) progress[subject] = mission;
    return progress;
  }, {});
}

export function snapshotSubjectMission(progress: SubjectProgress, subject: ActiveSubject, mission: SubjectMissionProgress): SubjectProgress {
  return { ...progress, [subject]: mission };
}
