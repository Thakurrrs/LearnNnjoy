import { describe, expect, it } from "vitest";
import { finaleCopy, gradeSevenAdventures } from "./grade-seven-adventures";

describe("Grade 7 interactive adventure pilot", () => {
  it("keeps the six planned concept adventures available", () => {
    expect(gradeSevenAdventures.map((adventure) => adventure.id)).toEqual([
      "moonbase",
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

describe("finaleCopy", () => {
  it("covers every playable adventure with celebration copy", () => {
    for (const adventure of gradeSevenAdventures) {
      const copy = finaleCopy[adventure.id];
      expect(copy).toBeDefined();
      expect(copy.title.length).toBeGreaterThan(0);
      expect(copy.detail.length).toBeGreaterThan(20);
      expect(copy.art.length).toBeGreaterThan(0);
    }
  });

  it("finale details speak to the hero by name token", () => {
    for (const adventure of gradeSevenAdventures) {
      expect(finaleCopy[adventure.id].detail).toContain("{hero}");
    }
  });
});
