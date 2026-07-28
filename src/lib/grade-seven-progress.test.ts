import { describe, expect, it } from "vitest";
import {
  canReplayGradeSevenEvent,
  createGradeSevenState,
  openGradeSevenAdventure,
  previousGradeSevenEvent,
  sanitizeGradeSevenProgress,
  shouldAwardGradeSevenCompletion,
  updateGradeSevenAdventure,
} from "./grade-seven-progress";

describe("Grade 7 adventure progress", () => {
  it("starts an adventure at event one and unlocks it", () => {
    const progress = openGradeSevenAdventure({}, "mountain");
    expect(progress.mountain?.seenEvents).toEqual([0]);
    expect(progress.mountain?.lastEvent).toBe(0);
  });

  it("preserves exact interaction state and unlocks an opened event", () => {
    const start = openGradeSevenAdventure({}, "mountain");
    const state = { ...createGradeSevenState("mountain"), step: 2, position: -4, direction: "below" } as ReturnType<typeof createGradeSevenState>;
    const progress = updateGradeSevenAdventure(start, "mountain", state);
    expect(progress.mountain?.interactionState).toMatchObject({ step: 2, position: -4, direction: "below" });
    expect(progress.mountain?.seenEvents).toEqual([0, 2]);
  });

  it("moves back without clearing interaction choices", () => {
    const state = { ...createGradeSevenState("shop"), step: 3, discount: 25, offer: "explorer" } as ReturnType<typeof createGradeSevenState>;
    expect(previousGradeSevenEvent(state)).toMatchObject({ step: 2, discount: 25, offer: "explorer" });
  });

  it("keeps legacy completed stars while starting their journal empty", () => {
    const progress = sanitizeGradeSevenProgress(undefined, ["cricket"]);
    expect(progress.cricket?.completed).toBe(true);
    expect(progress.cricket?.seenEvents).toEqual([]);
  });

  it("rejects malformed state and clamps unsafe values", () => {
    const progress = sanitizeGradeSevenProgress({
      mountain: {
        seenEvents: [-1, 0, 2, 99, "three"],
        lastEvent: 99,
        completed: false,
        interactionState: { kind: "mountain", step: 99, showDemo: false, position: -999, direction: "below" },
      },
    });
    expect(progress.mountain?.seenEvents).toEqual([0, 2]);
    expect(progress.mountain?.lastEvent).toBe(4);
    expect(progress.mountain?.interactionState).toMatchObject({ step: 5, position: -8, direction: "below" });
  });

  it("unlocks only events that were opened", () => {
    const progress = openGradeSevenAdventure({}, "balance");
    expect(canReplayGradeSevenEvent(progress.balance, 0)).toBe(true);
    expect(canReplayGradeSevenEvent(progress.balance, 1)).toBe(false);
  });

  it("awards only a first live completion", () => {
    expect(shouldAwardGradeSevenCompletion("live", false)).toBe(true);
    expect(shouldAwardGradeSevenCompletion("live", true)).toBe(false);
    expect(shouldAwardGradeSevenCompletion("replay", false)).toBe(false);
  });
});
