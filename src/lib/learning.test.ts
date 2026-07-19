import { describe, expect, it } from "vitest";
import { diagnostic, numberSenseSkills, recommendNextSkill } from "./learning";
import { getQuestsForGrade } from "./grade-quests";

describe("Number Sense curriculum", () => {
  it("covers every pilot grade in its foundation skill", () => {
    expect(numberSenseSkills.find((skill) => skill.id === "number-sense")?.grades).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("keeps every quest and diagnostic item answerable", () => {
    [...diagnostic, ...[4, 5, 6, 7, 8, 9, 10, 11, 12].flatMap((grade) => getQuestsForGrade(grade as 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12))].forEach((item) => {
      expect(item.choices).toContain(item.answer);
      expect(item.hint.length).toBeGreaterThan(0);
      expect(item.explanation.length).toBeGreaterThan(0);
    });
  });

  it("ships a three-quest Number Sense path for every pilot grade", () => {
    [4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((grade) => {
      expect(getQuestsForGrade(grade as 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)).toHaveLength(3);
    });
  });

  it("uses a prerequisite before proportional reasoning", () => {
    expect(numberSenseSkills.find((skill) => skill.id === "proportion")?.prerequisite).toBe("fractions");
  });
});

describe("rules-based recommendation", () => {
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
