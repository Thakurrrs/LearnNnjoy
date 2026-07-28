import { describe, expect, it } from "vitest";
import { LIFETIME_DISCOVERIES_CAP, sanitizeSavedProgress, type SavedProgress } from "./saved-progress";

describe("sanitizeSavedProgress", () => {
  it("clamps a corrupt giant lifetimeDiscoveries so level math cannot hang", () => {
    expect(sanitizeSavedProgress({ lifetimeDiscoveries: 1e300 }).lifetimeDiscoveries).toBe(LIFETIME_DISCOVERIES_CAP);
    expect(sanitizeSavedProgress({ lifetimeDiscoveries: LIFETIME_DISCOVERIES_CAP + 1 }).lifetimeDiscoveries).toBe(LIFETIME_DISCOVERIES_CAP);
  });

  it("floors fractional lifetimeDiscoveries and keeps valid values", () => {
    expect(sanitizeSavedProgress({ lifetimeDiscoveries: 7.9 }).lifetimeDiscoveries).toBe(7);
    expect(sanitizeSavedProgress({ lifetimeDiscoveries: 42 }).lifetimeDiscoveries).toBe(42);
  });

  it("seeds old saves without lifetimeDiscoveries from correct + completedAdventures.length", () => {
    const seeded = sanitizeSavedProgress({ correct: 5, completedAdventures: ["mountain", "shop"] });
    expect(seeded.lifetimeDiscoveries).toBe(7);
  });

  it("seeds to zero when an old save has nothing earned", () => {
    expect(sanitizeSavedProgress({}).lifetimeDiscoveries).toBe(0);
    expect(sanitizeSavedProgress({ correct: -3 }).lifetimeDiscoveries).toBe(0);
    expect(sanitizeSavedProgress({ lifetimeDiscoveries: -1, correct: 2 }).lifetimeDiscoveries).toBe(2);
  });

  it("keeps avatar, pet, and lifetimeDiscoveries through a grade-switch save", () => {
    // chooseGrade resets mission state but never these three; a reload
    // mid-switch must hand them back unchanged.
    const afterSwitch: Partial<SavedProgress> = { grade: 9, correct: 0, attempts: 0, questIndex: 0, avatar: "girl", pet: "fox", lifetimeDiscoveries: 23 };
    const clean = sanitizeSavedProgress(afterSwitch);
    expect(clean.avatar).toBe("girl");
    expect(clean.pet).toBe("fox");
    expect(clean.lifetimeDiscoveries).toBe(23);
  });

  it("preserves an explicit null pet but drops unknown ids", () => {
    expect(sanitizeSavedProgress({ pet: null }).pet).toBeNull();
    expect(sanitizeSavedProgress({ pet: "unicorn" }).pet).toBeUndefined();
    expect(sanitizeSavedProgress({}).pet).toBeUndefined();
  });

  it("drops unknown avatars and out-of-range grades", () => {
    expect(sanitizeSavedProgress({ avatar: "wizard" }).avatar).toBeUndefined();
    expect(sanitizeSavedProgress({ grade: 3 as SavedProgress["grade"] }).grade).toBeUndefined();
    expect(sanitizeSavedProgress({ grade: 13 as SavedProgress["grade"] }).grade).toBeUndefined();
  });

  it("redirects a non-grade-4 story screen to the diagnostic", () => {
    expect(sanitizeSavedProgress({ screen: "story", grade: 7 }).screen).toBe("diagnostic");
    expect(sanitizeSavedProgress({ screen: "story", grade: 4 }).screen).toBe("story");
    expect(sanitizeSavedProgress({ screen: "welcome" }).screen).toBeUndefined();
  });

  it("keeps a valid Grade 7 activity resume and rejects an unsafe one", () => {
    const valid = sanitizeSavedProgress({
      grade: 7,
      screen: "activity",
      activeAdventure: "mountain",
      gradeSevenProgress: {
        mountain: {
          seenEvents: [0, 1],
          lastEvent: 1,
          completed: false,
          interactionState: {
            kind: "mountain",
            step: 1,
            showDemo: false,
            successChoice: null,
            position: -4,
            direction: null,
            equation: null,
          },
        },
      },
    });
    expect(valid.screen).toBe("activity");
    expect(valid.activeAdventure).toBe("mountain");
    expect(valid.gradeSevenProgress?.mountain?.interactionState).toMatchObject({ step: 1, position: -4 });

    expect(sanitizeSavedProgress({ grade: 7, screen: "activity" }).screen).toBe("adventures");
    expect(sanitizeSavedProgress({ grade: 6, screen: "journal" }).screen).toBe("adventures");
  });

  it("migrates old completed stars without inventing journal history", () => {
    const clean = sanitizeSavedProgress({ completedAdventures: ["shop"] });
    expect(clean.gradeSevenProgress?.shop?.completed).toBe(true);
    expect(clean.gradeSevenProgress?.shop?.seenEvents).toEqual([]);
  });

  it("clamps mission counters into their valid ranges", () => {
    const clean = sanitizeSavedProgress({ diagnosticIndex: 9, diagnosticCorrect: 8, storyBeat: -2, hintRequests: -4, questIndex: -1 });
    expect(clean.diagnosticIndex).toBe(2);
    expect(clean.diagnosticCorrect).toBe(3);
    expect(clean.storyBeat).toBe(0);
    expect(clean.hintRequests).toBe(0);
    expect(clean.questIndex).toBe(0);
  });

  it("rejects malformed arrays", () => {
    expect(sanitizeSavedProgress({ storyCells: [0, 9] }).storyCells).toBeUndefined();
    expect(sanitizeSavedProgress({ completedAdventures: ["mountain", "volcano"] as SavedProgress["completedAdventures"] }).completedAdventures).toBeUndefined();
  });
});
