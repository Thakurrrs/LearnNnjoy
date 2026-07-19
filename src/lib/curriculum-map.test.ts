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

  it("keeps the initial Maths pilot clearly scoped to Grades 4 through 7", () => {
    expect(curriculumMap[4].maths.pilotStatus).toBe("live");
    expect(curriculumMap[7].maths.pilotStatus).toBe("live");
    expect(curriculumMap[8].maths.pilotStatus).toBe("mapped");
  });
});
