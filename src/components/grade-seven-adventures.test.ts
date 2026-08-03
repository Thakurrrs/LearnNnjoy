import { describe, expect, it } from "vitest";
import { adventureIntroLine, finaleCopy, gradeSevenAdventures } from "./grade-seven-adventures";
import { NOT_READY_ADVENTURE_IDS } from "@/lib/grade-seven-progress";

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
      expect(adventure.revisitIntro.trim()).not.toBe("");
    }
  });

  it("marks Balance Lab, Smart Shopper and Cricket Data Room not-ready (owner quality gate)", () => {
    for (const id of NOT_READY_ADVENTURE_IDS) {
      const adventure = gradeSevenAdventures.find((item) => item.id === id);
      expect(adventure?.status, id).toBe("soon");
    }
    expect(NOT_READY_ADVENTURE_IDS).toEqual(["balance", "shop", "cricket"]);
  });

  it("leaves Mountain, Moonbase and Night Run ready — no status, unchanged launch copy", () => {
    for (const id of ["mountain", "moonbase", "skatepark"] as const) {
      const adventure = gradeSevenAdventures.find((item) => item.id === id);
      expect(adventure?.status, id).toBeUndefined();
    }
  });

  it("gives every not-ready adventure a playful teaser instead of a launch invite", () => {
    for (const id of NOT_READY_ADVENTURE_IDS) {
      const adventure = gradeSevenAdventures.find((item) => item.id === id)!;
      expect(adventure.intro).not.toMatch(/help me/i);
      expect(adventure.intro).not.toContain("{hero}");
    }
  });
});

describe("adventureIntroLine", () => {
  it("shows the pre-play invite before an adventure is completed", () => {
    for (const adventure of gradeSevenAdventures) {
      expect(adventureIntroLine(adventure, false)).toBe(adventure.intro);
    }
  });

  it("swaps to revisit copy once an adventure is completed, dropping the stale help-me invite", () => {
    for (const adventure of gradeSevenAdventures) {
      const line = adventureIntroLine(adventure, true);
      expect(line).toBe(adventure.revisitIntro);
      expect(line).not.toMatch(/help me/i);
      expect(line).not.toBe(adventure.intro);
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
