import { describe, expect, it } from "vitest";
import { gradeSevenAdventures } from "./grade-seven-adventures";

describe("Grade 7 interactive adventure pilot", () => {
  it("keeps the five planned concept adventures available", () => {
    expect(gradeSevenAdventures.map((adventure) => adventure.id)).toEqual([
      "mountain",
      "balance",
      "shop",
      "skatepark",
      "cricket",
    ]);
  });

  it("gives every adventure a curriculum topic, subtopics and learner action", () => {
    for (const adventure of gradeSevenAdventures) {
      expect(adventure.topic.trim()).not.toBe("");
      expect(adventure.subtopics).toHaveLength(3);
      expect(adventure.action.trim()).not.toBe("");
      expect(adventure.intro.trim()).not.toBe("");
    }
  });
});
