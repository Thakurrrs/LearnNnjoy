import { describe, expect, it } from "vitest";
import { curriculumMap } from "./curriculum-map";
import { getLessonStory } from "./lesson-story";
import { getSocialQuestsForGrade } from "./social-quests";

describe("Grade 4 Mapmakers’ Camp mission", () => {
  it("provides six answerable social inquiry discoveries", () => {
    const quests = getSocialQuestsForGrade(4);
    expect(quests).toHaveLength(6);
    quests.forEach((quest) => {
      expect(quest.choices).toContain(quest.answer);
      expect(quest.skill).toBe("social-inquiry");
      expect(quest.visual).toBe("map");
      expect(getLessonStory(quest).learningObjective).toContain("Maps");
    });
  });

  it("makes the Grade 4 social world available from the atlas", () => {
    expect(curriculumMap[4].social.pilotStatus).toBe("live");
    expect(getSocialQuestsForGrade(5)).toEqual([]);
  });
});
