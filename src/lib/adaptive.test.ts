import { describe, expect, it } from "vitest";
import { chooseAdaptiveNextStep } from "./adaptive";
import { getQuestsForGrade } from "./grade-quests";

const question = getQuestsForGrade(4)[0];

describe("transparent adaptive support", () => {
  it("rebuilds with visual support after repeated difficulty", () => {
    expect(chooseAdaptiveNextStep(question, { wrongAttempts: 2, hintUsed: true, recentAccuracy: 0.4 }).mode).toBe("rebuild");
  });

  it("keeps support nearby when a clue helps", () => {
    expect(chooseAdaptiveNextStep(question, { wrongAttempts: 0, hintUsed: true, recentAccuracy: 0.9 }).mode).toBe("steady");
  });

  it("offers an optional stretch only after confident evidence", () => {
    const next = chooseAdaptiveNextStep(question, { wrongAttempts: 0, hintUsed: false, recentAccuracy: 0.9 });
    expect(next.mode).toBe("stretch");
    expect(next.message).toContain("optional");
  });
});
