import { describe, expect, it } from "vitest";
import { readSubjectProgress, snapshotSubjectMission } from "./subject-progress";

const mathsMission = { questIndex: 3, correct: 5, attempts: 7, hintRequests: 2, diagnosticCorrect: 2 };

describe("subject mission progress", () => {
  it("keeps separate positions for each subject", () => {
    const withMaths = snapshotSubjectMission({}, "maths", mathsMission);
    const withScience = snapshotSubjectMission(withMaths, "science", { questIndex: 1, correct: 1, attempts: 1, hintRequests: 0, diagnosticCorrect: 0 });
    expect(withScience.maths).toEqual(mathsMission);
    expect(withScience.science?.questIndex).toBe(1);
  });

  it("reads only valid saved subject mission data", () => {
    expect(readSubjectProgress({ maths: mathsMission, science: { questIndex: "two" }, unknown: mathsMission })).toEqual({ maths: mathsMission });
  });
});
