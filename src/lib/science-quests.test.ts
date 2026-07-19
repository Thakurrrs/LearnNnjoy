import { describe, expect, it } from "vitest";
import { curriculumMap } from "./curriculum-map";
import { getScienceQuestsForGrade } from "./science-quests";
import { getLessonStory } from "./lesson-story";

describe("Grade 4 Earthkeepers mission", () => {
  it("provides six answerable, evidence-led EVS discoveries", () => {
    const quests = getScienceQuestsForGrade(4);
    expect(quests).toHaveLength(6);
    quests.forEach((quest) => {
      expect(quest.choices).toContain(quest.answer);
      expect(quest.skill).toBe("science-inquiry");
      expect(quest.visual).toBe("ecosystem");
      expect(quest.hint.length).toBeGreaterThan(12);
      expect(getLessonStory(quest).learningObjective).toContain("observation");
    });
  });

  it("makes the first two EVS grade missions available from the learning atlas", () => {
    expect(curriculumMap[4].science.pilotStatus).toBe("live");
    expect(curriculumMap[5].science.pilotStatus).toBe("live");
    expect(getScienceQuestsForGrade(5)).toHaveLength(6);
  });
});
