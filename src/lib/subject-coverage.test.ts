import { describe, expect, it } from "vitest";
import { getEnglishQuestsForGrade } from "./english-quests";
import { getScienceQuestsForGrade } from "./science-quests";
import { getSocialQuestsForGrade } from "./social-quests";

describe("core-subject pilot coverage", () => {
  it("ships six answerable missions for Grades 4 through 6 in every core non-Maths subject", () => {
    const sources = [getScienceQuestsForGrade, getEnglishQuestsForGrade, getSocialQuestsForGrade];
    ([4, 5, 6] as const).forEach((grade) => {
      sources.forEach((getQuests) => {
        const quests = getQuests(grade);
        expect(quests).toHaveLength(6);
        quests.forEach((quest) => expect(quest.choices).toContain(quest.answer));
      });
    });
  });
});
