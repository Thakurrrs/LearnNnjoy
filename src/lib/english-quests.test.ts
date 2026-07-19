import { describe, expect, it } from "vitest";
import { curriculumMap } from "./curriculum-map";
import { getEnglishQuestsForGrade } from "./english-quests";
import { getLessonStory } from "./lesson-story";

describe("Grade 4 Story Studio mission", () => {
  it("provides six answerable reading and language discoveries", () => {
    const quests = getEnglishQuestsForGrade(4);
    expect(quests).toHaveLength(6);
    quests.forEach((quest) => {
      expect(quest.choices).toContain(quest.answer);
      expect(quest.skill).toBe("language");
      expect(quest.visual).toBe("reading");
      expect(getLessonStory(quest).learningObjective).toContain("Readers");
    });
  });

  it("keeps English live only where the first Story Studio mission exists", () => {
    expect(curriculumMap[4].english.pilotStatus).toBe("live");
    expect(getEnglishQuestsForGrade(5)).toEqual([]);
  });
});
