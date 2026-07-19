import { describe, expect, it } from "vitest";
import { getQuestsForGrade } from "./grade-quests";
import { getLessonStory } from "./lesson-story";

describe("lesson stories", () => {
  it("binds every live pilot mission to a learning objective and a story outcome", () => {
    [4, 5, 6, 7, 8, 9, 10, 11, 12].flatMap((grade) => getQuestsForGrade(grade as 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)).forEach((question) => {
      const story = getLessonStory(question);
      expect(story.learningObjective.length).toBeGreaterThan(15);
      expect(story.chapterTitle.length).toBeGreaterThan(5);
      expect(story.outcomeDetail.length).toBeGreaterThan(10);
      expect(story.videoCue.length).toBeGreaterThan(15);
      expect(story.reelFrames).toHaveLength(4);
      expect(story.reelFrames.every((frame) => frame.length > 10)).toBe(true);
    });
  });

  it("anchors the first Grade 4 story in one whole and equal parts", () => {
    const story = getLessonStory(getQuestsForGrade(4)[0]);
    expect(story.learningObjective).toContain("one clear whole");
    expect(story.outcomeDetail).toContain("two equal parts");
  });
});
