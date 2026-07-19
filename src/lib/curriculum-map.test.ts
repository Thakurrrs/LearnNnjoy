import { describe, expect, it } from "vitest";
import { curriculumMap, getGradeRoadmap } from "./curriculum-map";

describe("curriculum map", () => {
  it("covers each pilot grade and every core subject", () => {
    for (const grade of [4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
      const subjects = getGradeRoadmap(grade);
      expect(subjects.map((subject) => subject.id).sort()).toEqual(["english", "maths", "science", "social"]);
      expect(subjects.every((subject) => subject.topics.length >= 3)).toBe(true);
    }
  });

  it("marks the six-discovery Maths mission live for every learner grade", () => {
    ([4, 5, 6, 7, 8, 9, 10, 11, 12] as const).forEach((grade) => {
      expect(curriculumMap[grade].maths.pilotStatus).toBe("live");
    });
  });
});
