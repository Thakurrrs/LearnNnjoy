import { describe, expect, it } from "vitest";
import { chooseLearningTrail, diagnostic, numberSenseSkills, recommendNextSkill } from "./learning";
import { getDiagnosticForGrade, getQuestsForGrade } from "./grade-quests";

describe("Number Sense curriculum", () => {
  it("covers every pilot grade in its foundation skill", () => {
    expect(numberSenseSkills.find((skill) => skill.id === "number-sense")?.grades).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("keeps every quest and diagnostic item answerable", () => {
    const grades = [4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
    [...diagnostic, ...grades.flatMap((grade) => [...getDiagnosticForGrade(grade), ...getQuestsForGrade(grade)])].forEach((item) => {
      expect(item.choices).toContain(item.answer);
      expect(item.hint.length).toBeGreaterThan(0);
      expect(item.explanation.length).toBeGreaterThan(0);
    });
  });

  it("uses three grade-relevant ideas for every quiet starting calibration", () => {
    ([4, 5, 6, 7, 8, 9, 10, 11, 12] as const).forEach((grade) => {
      expect(getDiagnosticForGrade(grade)).toHaveLength(3);
      expect(getDiagnosticForGrade(grade).every((item) => getQuestsForGrade(grade).includes(item))).toBe(true);
    });
  });

  it("ships six-discovery Maths missions for Grades 4 through 7", () => {
    [4, 5, 6, 7].forEach((grade) => {
      expect(getQuestsForGrade(grade as 4 | 5 | 6 | 7)).toHaveLength(6);
    });
    [8, 9, 10, 11, 12].forEach((grade) => {
      expect(getQuestsForGrade(grade as 8 | 9 | 10 | 11 | 12)).toHaveLength(3);
    });
  });

  it("uses a prerequisite before proportional reasoning", () => {
    expect(numberSenseSkills.find((skill) => skill.id === "proportion")?.prerequisite).toBe("fractions");
  });
});

describe("rules-based recommendation", () => {
  it("chooses a supportive starter trail from diagnostic evidence", () => {
    expect(chooseLearningTrail(0).id).toBe("visual");
    expect(chooseLearningTrail(2).id).toBe("guided");
    expect(chooseLearningTrail(3).id).toBe("stretch");
  });

  it("recommends a refresher when a learner is struggling", () => {
    expect(recommendNextSkill(0, 3)).toContain("fraction refresher");
  });

  it("recommends number-line practice for an emerging learner", () => {
    expect(recommendNextSkill(1, 1)).toContain("number-line");
  });

  it("recommends proportional reasoning after confident performance", () => {
    expect(recommendNextSkill(3, 3)).toContain("proportional reasoning");
  });
});
