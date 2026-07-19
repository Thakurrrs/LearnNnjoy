import { describe, expect, it } from "vitest";
import { getMissionChapter, getMissionChapters } from "./mission-chapters";
import type { Grade } from "./learning";

describe("mission chapters", () => {
  it("turns every six-question subject mission into its three curriculum strands", () => {
    ([4, 5, 6, 7, 8, 9, 10, 11, 12] as Grade[]).forEach((grade) => {
      (["maths", "science", "english", "social"] as const).forEach((subject) => {
        const chapters = getMissionChapters(grade, subject, 6);
        expect(chapters).toHaveLength(3);
        expect(chapters.map((chapter) => [chapter.startIndex, chapter.endIndex])).toEqual([[0, 1], [2, 3], [4, 5]]);
      });
    });
  });

  it("finds the matching strand for a quest", () => {
    expect(getMissionChapter(8, "maths", 6, 3).topic).toContain("Linear equations");
  });
});
