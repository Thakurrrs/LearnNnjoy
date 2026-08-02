import { describe, expect, it } from "vitest";
import {
  canGoToPreviousGradeSevenEvent,
  canReplayGradeSevenEvent,
  createGradeSevenState,
  type MountainState,
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
    const state = {
      ...createGradeSevenState("mountain"),
      step: 2,
      position: -4,
      briefingBeat: 3,
      flightPath: [3, 2, 1, 0, -1, -2, -3, -4],
      direction: "below",
    } as ReturnType<typeof createGradeSevenState>;
    const progress = updateGradeSevenAdventure(start, "mountain", state);
    expect(progress.mountain?.interactionState).toMatchObject({ step: 2, position: -4, direction: "below" });
    expect(progress.mountain?.interactionState).toMatchObject({ briefingBeat: 3, flightPath: [3, 2, 1, 0, -1, -2, -3, -4] });
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
        interactionState: {
          kind: "mountain",
          storyVersion: 2,
          step: 99,
          showDemo: false,
          position: -999,
          direction: "below",
          activeQuest: "signal-below-zero",
          questStep: 99,
          finaleBeat: 99,
        },
      },
    });
    expect(progress.mountain?.seenEvents).toEqual([0, 2]);
    expect(progress.mountain?.lastEvent).toBe(4);
    expect(progress.mountain?.interactionState).toMatchObject({
      storyVersion: 2,
      step: 5,
      position: -8,
      direction: "below",
      activeQuest: "signal-below-zero",
      questStep: 3,
      finaleBeat: 4,
    });
  });

  it("safely restarts an older Mountain save on the new multi-quest map", () => {
    const progress = sanitizeGradeSevenProgress({
      mountain: {
        seenEvents: [0, 1],
        lastEvent: 1,
        completed: false,
        interactionState: {
          kind: "mountain",
          step: 1,
          showDemo: false,
          successChoice: null,
          position: -2,
          direction: null,
          equation: null,
        },
      },
    });
    expect(progress.mountain?.interactionState).toMatchObject({
      storyVersion: 2,
      chapterMapOpen: true,
      activeQuest: null,
      completedQuests: [],
      questStep: 0,
      position: 3,
      returnPosition: -4,
      briefingBeat: 0,
      flightPath: [3],
    });
    expect(progress.mountain?.seenEvents).toEqual([0]);
  });

  it("starts later Mountain replays on the matching connected quest", () => {
    expect(createGradeSevenState("mountain", 3)).toMatchObject({
      step: 3,
      chapterMapOpen: false,
      activeQuest: "rescue-winch",
      position: -4,
      returnPosition: -4,
      flightPath: [3, 2, 1, 0, -1, -2, -3, -4],
    });
  });

  it("restores exact Signal Below Zero interaction state", () => {
    const progress = sanitizeGradeSevenProgress({
      mountain: {
        seenEvents: [0],
        lastEvent: 0,
        completed: false,
        interactionState: {
          ...createGradeSevenState("mountain"),
          chapterMapOpen: false,
          activeQuest: "signal-below-zero",
          questStep: 1,
          openingBeat: 2,
          openingComplete: true,
          signalPrediction: "above",
          signalRunStarted: true,
          signalFound: false,
          position: -2,
          flightPath: [3, 2, 1, 0, -1, -2],
        },
      },
    });

    expect(progress.mountain?.interactionState).toMatchObject({
      chapterMapOpen: false,
      activeQuest: "signal-below-zero",
      questStep: 1,
      openingBeat: 2,
      openingComplete: true,
      signalPrediction: "above",
      signalRunStarted: true,
      signalFound: false,
      position: -2,
      flightPath: [3, 2, 1, 0, -1, -2],
    });
  });

  it("restores the exact Cliff Checkpoints route and rejects a broken order", () => {
    const progress = sanitizeGradeSevenProgress({
      mountain: {
        seenEvents: [0, 1],
        lastEvent: 1,
        completed: false,
        interactionState: {
          ...createGradeSevenState("mountain", 1),
          chapterMapOpen: false,
          activeQuest: "cliff-checkpoints",
          completedQuests: ["signal-below-zero"],
          questStep: 1,
          q2OpeningBeat: 2,
          q2OpeningComplete: true,
          higherCheckpoint: 2,
          checkpointOrder: [-5, -1, 6, 2],
          checkpointRunTested: true,
        },
      },
    });

    expect(progress.mountain?.interactionState).toMatchObject({
      activeQuest: "cliff-checkpoints",
      completedQuests: ["signal-below-zero"],
      questStep: 1,
      q2OpeningBeat: 2,
      q2OpeningComplete: true,
      higherCheckpoint: 2,
      checkpointOrder: [-5, -1],
      checkpointRunTested: true,
    });
  });

  it("restores Storm Moves from its exact gust and uses the storm start for a missing trail", () => {
    const progress = sanitizeGradeSevenProgress({
      mountain: {
        seenEvents: [0, 1, 2],
        lastEvent: 2,
        completed: false,
        interactionState: {
          ...createGradeSevenState("mountain", 2),
          chapterMapOpen: false,
          activeQuest: "storm-moves",
          completedQuests: ["signal-below-zero", "cliff-checkpoints"],
          questStep: 1,
          q3OpeningComplete: true,
          stormPosition: 1,
          stormTrail: undefined,
          gustIndex: 3,
          transferGustIndex: 1,
          stormRunComplete: true,
          stormTransferComplete: false,
        },
      },
    });

    expect(progress.mountain?.interactionState).toMatchObject({
      activeQuest: "storm-moves",
      questStep: 1,
      stormPosition: 1,
      stormTrail: [-2, -1, 0, 1],
      gustIndex: 3,
      transferGustIndex: 1,
      stormRunComplete: true,
      stormTransferComplete: false,
    });
  });

  it("clamps Rescue Winch positions to the playable route and preserves its reverse", () => {
    const progress = sanitizeGradeSevenProgress({
      mountain: {
        seenEvents: [0, 1, 2, 3],
        lastEvent: 3,
        completed: false,
        interactionState: {
          ...createGradeSevenState("mountain", 3),
          chapterMapOpen: false,
          activeQuest: "rescue-winch",
          completedQuests: ["signal-below-zero", "cliff-checkpoints", "storm-moves"],
          questStep: 2,
          q4OpeningComplete: true,
          winchPosition: 99,
          winchRunStarted: true,
          winchReached: true,
          reversePosition: -99,
          reverseRunStarted: true,
          reverseComplete: true,
        },
      },
    });

    expect(progress.mountain?.interactionState).toMatchObject({
      activeQuest: "rescue-winch",
      questStep: 2,
      winchPosition: 2,
      winchRunStarted: true,
      winchReached: true,
      reversePosition: -4,
      reverseRunStarted: true,
      reverseComplete: true,
    });
  });

  it("goes back inside Mountain quests without clearing the rescue path", () => {
    const state = {
      ...createGradeSevenState("mountain"),
      chapterMapOpen: false,
      activeQuest: "signal-below-zero" as const,
      openingComplete: true,
      questStep: 2,
      position: -4,
      signalFound: true,
      flightPath: [3, 2, 1, 0, -1, -2, -3, -4],
    };

    expect(canGoToPreviousGradeSevenEvent(state)).toBe(true);
    expect(previousGradeSevenEvent(state)).toMatchObject({
      questStep: 1,
      position: -4,
      signalFound: true,
      flightPath: [3, 2, 1, 0, -1, -2, -3, -4],
    });
  });

  it("goes back inside later Mountain quests without clearing their interaction state", () => {
    const stormState = {
      ...createGradeSevenState("mountain", 2),
      chapterMapOpen: false,
      activeQuest: "storm-moves" as const,
      q3OpeningComplete: true,
      questStep: 2,
      stormPosition: 1,
      stormTrail: [-2, -1, 0, 1, 2, 3, 2, 1],
      gustIndex: 3,
      stormRunComplete: true,
    };
    const winchState = {
      ...createGradeSevenState("mountain", 3),
      chapterMapOpen: false,
      activeQuest: "rescue-winch" as const,
      q4OpeningComplete: true,
      questStep: 2,
      winchPosition: 2,
      winchReached: true,
      reversePosition: -4,
      reverseComplete: true,
    };

    expect(previousGradeSevenEvent(stormState)).toMatchObject({
      questStep: 1,
      stormPosition: 1,
      gustIndex: 3,
      stormRunComplete: true,
    });
    expect(previousGradeSevenEvent(winchState)).toMatchObject({
      questStep: 1,
      winchPosition: 2,
      winchReached: true,
      reversePosition: -4,
      reverseComplete: true,
    });
  });

  it("safely restarts the former Balance activity on the connected quest map", () => {
    const progress = sanitizeGradeSevenProgress({
      balance: {
        seenEvents: [0, 1, 2, 3],
        lastEvent: 3,
        completed: false,
        interactionState: {
          kind: "balance",
          step: 3,
          showDemo: false,
          successChoice: null,
          removed: 5,
          rule: "Remove blocks from both sides",
          value: "7",
          demoMode: "level",
        },
      },
    });

    expect(progress.balance?.interactionState).toMatchObject({
      storyVersion: 2,
      step: 0,
      chapterMapOpen: true,
      activeQuest: null,
      completedQuests: [],
      questStep: 0,
      leftLoad: 0,
      rightLoad: 0,
    });
    expect(progress.balance?.seenEvents).toEqual([0]);
  });

  it("restores the exact Keep It Level interaction and transfer state", () => {
    const progress = sanitizeGradeSevenProgress({
      balance: {
        seenEvents: [0],
        lastEvent: 0,
        completed: false,
        interactionState: {
          ...createGradeSevenState("balance"),
          chapterMapOpen: false,
          activeQuest: "keep-it-level",
          q1OpeningBeat: 2,
          q1OpeningComplete: true,
          questStep: 2,
          leftLoad: 3,
          rightLoad: 3,
          levelRunTested: true,
          transferLoad: 3,
          q1TransferComplete: false,
        },
      },
    });

    expect(progress.balance?.interactionState).toMatchObject({
      activeQuest: "keep-it-level",
      q1OpeningBeat: 2,
      q1OpeningComplete: true,
      questStep: 2,
      leftLoad: 3,
      rightLoad: 3,
      levelRunTested: true,
      transferLoad: 3,
      q1TransferComplete: false,
    });
  });

  it("restores later Balance quest actions and Previous preserves them", () => {
    const progress = sanitizeGradeSevenProgress({
      balance: {
        seenEvents: [0, 1, 2],
        lastEvent: 2,
        completed: false,
        interactionState: {
          ...createGradeSevenState("balance", 2),
          chapterMapOpen: false,
          activeQuest: "reveal-the-crate",
          completedQuests: ["keep-it-level", "same-move-both-sides"],
          q3OpeningComplete: true,
          questStep: 2,
          cratePairsRemoved: 5,
          crateScanTested: true,
        },
      },
    });
    const state = progress.balance!.interactionState;

    expect(state).toMatchObject({
      activeQuest: "reveal-the-crate",
      completedQuests: ["keep-it-level", "same-move-both-sides"],
      questStep: 2,
      cratePairsRemoved: 5,
      crateScanTested: true,
    });
    expect(canGoToPreviousGradeSevenEvent(state)).toBe(true);
    expect(previousGradeSevenEvent(state)).toMatchObject({
      questStep: 1,
      cratePairsRemoved: 5,
      crateScanTested: true,
    });
  });

  it("starts a new Skatepark chapter on its connected quest map", () => {
    expect(createGradeSevenState("skatepark")).toMatchObject({
      chapterMapOpen: true,
      activeQuest: null,
      completedQuests: [],
    });
  });

  it("restores the exact Night Run interaction state", () => {
    const start = openGradeSevenAdventure({}, "skatepark");
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 4,
      railAngle: 63,
      lightsAwake: 4,
      movedRail: true,
      crossingRouteTested: true,
      twinMatched: true,
      linearPair: "left",
      transferTwinMatched: true,
      openingComplete: true,
    } as ReturnType<typeof createGradeSevenState>;
    const progress = updateGradeSevenAdventure(start, "skatepark", state);
    expect(progress.skatepark?.interactionState).toMatchObject({
      storyVersion: 2,
      step: 4,
      railAngle: 63,
      crossingRouteTested: true,
      twinMatched: true,
      linearPair: "left",
      transferTwinMatched: true,
      transferLinearMatched: false,
      openingComplete: true,
      closingBeat: 0,
      closingComplete: false,
    });
  });

  it("restores the exact Night Run story beat", () => {
    const start = openGradeSevenAdventure({}, "skatepark");
    const state = {
      ...createGradeSevenState("skatepark"),
      openingBeat: 2,
      openingComplete: false,
    } as ReturnType<typeof createGradeSevenState>;
    const progress = updateGradeSevenAdventure(start, "skatepark", state);
    expect(progress.skatepark?.interactionState).toMatchObject({
      step: 0,
      openingBeat: 2,
      openingComplete: false,
    });
  });

  it("keeps version-two Night Run saves working when story fields are missing", () => {
    const progress = sanitizeGradeSevenProgress({
      skatepark: {
        seenEvents: [0, 1],
        lastEvent: 1,
        completed: false,
        interactionState: {
          kind: "skatepark",
          storyVersion: 2,
          step: 1,
          showDemo: true,
          successChoice: null,
          railAngle: 52,
          lightsAwake: 4,
          movedRail: true,
        },
      },
    });
    expect(progress.skatepark?.interactionState).toMatchObject({
      step: 1,
      chapterMapOpen: false,
      activeQuest: "crossing-rails",
      completedQuests: ["trail-meet"],
      crossingRouteTested: false,
      twinArmed: false,
      trailEndpoint: null,
      trailOutcome: null,
      openingBeat: 0,
      openingComplete: true,
      closingBeat: 0,
      closingComplete: false,
    });
  });

  it("preserves the first opposite-angle tracing tap", () => {
    const progress = sanitizeGradeSevenProgress({
      skatepark: {
        seenEvents: [0, 1, 2],
        lastEvent: 2,
        completed: false,
        interactionState: {
          kind: "skatepark",
          storyVersion: 2,
          step: 2,
          showDemo: true,
          successChoice: null,
          twinArmed: true,
          twinMatched: false,
        },
      },
    });

    expect(progress.skatepark?.interactionState).toMatchObject({
      step: 2,
      twinArmed: true,
      twinMatched: false,
    });
  });

  it("restores the chapter map and completed Skatepark quests", () => {
    const progress = sanitizeGradeSevenProgress({
      skatepark: {
        seenEvents: [0, 1, 2, 3, 4],
        lastEvent: 4,
        completed: false,
        interactionState: {
          kind: "skatepark",
          storyVersion: 2,
          step: 5,
          showDemo: true,
          successChoice: null,
          chapterMapOpen: true,
          activeQuest: null,
          completedQuests: ["trail-meet", "crossing-rails", "fake-quest"],
          closingComplete: true,
        },
      },
    });

    expect(progress.skatepark?.interactionState).toMatchObject({
      chapterMapOpen: true,
      activeQuest: null,
      completedQuests: ["trail-meet", "crossing-rails"],
    });
    expect(canGoToPreviousGradeSevenEvent(progress.skatepark!.interactionState)).toBe(false);
  });

  it("restores Quest 3 rail controls and goes back inside that quest", () => {
    const progress = sanitizeGradeSevenProgress({
      skatepark: {
        seenEvents: [0, 1, 2, 3, 4],
        lastEvent: 4,
        completed: false,
        interactionState: {
          kind: "skatepark",
          storyVersion: 2,
          step: 5,
          showDemo: true,
          successChoice: null,
          chapterMapOpen: false,
          activeQuest: "never-meet",
          completedQuests: ["trail-meet", "crossing-rails"],
          questStep: 2,
          parallelAngle: 0,
          parallelGap: 38,
          parallelGapMoved: true,
          parallelMatched: true,
          parallelRunTested: true,
          parallelGapRunTested: true,
          perpendicularAngle: 86,
          perpendicularMatched: false,
          q3OpeningBeat: 4,
          q3OpeningComplete: true,
        },
      },
    });
    const state = progress.skatepark!.interactionState;

    expect(state).toMatchObject({
      activeQuest: "never-meet",
      questStep: 2,
      parallelAngle: 0,
      parallelGap: 38,
      parallelGapMoved: true,
      parallelRunTested: true,
      parallelGapRunTested: true,
      perpendicularAngle: 86,
      squareExitRunTested: false,
      courseRunTested: false,
      q3OpeningBeat: 4,
      q3OpeningComplete: true,
    });
    expect(canGoToPreviousGradeSevenEvent(state)).toBe(true);
    expect(previousGradeSevenEvent(state)).toMatchObject({
      activeQuest: "never-meet",
      questStep: 1,
      parallelGap: 38,
    });
  });

  it("returns from the Quest 3 ending to its final live scene", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "never-meet" as const,
      questStep: 3,
      courseTurned: true,
      q3OpeningComplete: true,
      q3ClosingBeat: 2,
      q3ClosingStarted: true,
    };

    expect(canGoToPreviousGradeSevenEvent(state)).toBe(true);
    expect(previousGradeSevenEvent(state)).toMatchObject({
      questStep: 3,
      courseTurned: true,
      q3ClosingStarted: false,
    });
  });

  it("restores the Crossing Beam pattern hunt", () => {
    const progress = sanitizeGradeSevenProgress({
      skatepark: {
        seenEvents: [0, 1, 2, 3, 4],
        lastEvent: 4,
        completed: false,
        interactionState: {
          kind: "skatepark",
          storyVersion: 2,
          step: 5,
          showDemo: true,
          successChoice: null,
          chapterMapOpen: false,
          activeQuest: "crossing-beam",
          completedQuests: ["trail-meet", "crossing-rails", "never-meet"],
          questStep: 2,
          beamAngle: 59,
          beamMoved: true,
          beamRunTested: true,
          correspondingMatched: true,
          alternateArmed: true,
          alternateMatched: false,
          q4OpeningBeat: 4,
          q4OpeningComplete: true,
        },
      },
    });

    expect(progress.skatepark?.interactionState).toMatchObject({
      activeQuest: "crossing-beam",
      questStep: 2,
      beamAngle: 59,
      beamMoved: true,
      beamRunTested: true,
      correspondingMatched: true,
      alternateArmed: true,
      alternateMatched: false,
      beamTransferred: false,
      q4OpeningBeat: 4,
      q4OpeningComplete: true,
    });
  });

  it("returns from the chapter finale to the final Crossing Beam scene", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "crossing-beam" as const,
      questStep: 3,
      beamTransferred: true,
      q4OpeningComplete: true,
      q4ClosingStarted: true,
      q4ClosingComplete: true,
    };

    expect(canGoToPreviousGradeSevenEvent(state)).toBe(true);
    expect(previousGradeSevenEvent(state)).toMatchObject({
      questStep: 3,
      beamTransferred: true,
      q4ClosingStarted: false,
      q4ClosingComplete: false,
    });
  });

  it("restores a saved straight-trail run inside Trail Meet", () => {
    const progress = sanitizeGradeSevenProgress({
      skatepark: {
        seenEvents: [0],
        lastEvent: 0,
        completed: false,
        interactionState: {
          kind: "skatepark",
          storyVersion: 2,
          step: 0,
          showDemo: true,
          successChoice: null,
          trailEndpoint: { x: 0.64, y: 0.42 },
          trailOutcome: "crossed",
        },
      },
    });

    expect(progress.skatepark?.interactionState).toMatchObject({
      step: 0,
      trailEndpoint: { x: 0.64, y: 0.42 },
      trailOutcome: "crossed",
    });
  });

  it("drops an incomplete Trail Meet result that has no endpoint", () => {
    const progress = sanitizeGradeSevenProgress({
      skatepark: {
        seenEvents: [0],
        lastEvent: 0,
        completed: false,
        interactionState: {
          kind: "skatepark",
          storyVersion: 2,
          step: 0,
          showDemo: true,
          successChoice: null,
          trailOutcome: "crossed",
        },
      },
    });

    expect(progress.skatepark?.interactionState).toMatchObject({
      trailEndpoint: null,
      trailOutcome: null,
    });
  });

  it("safely restarts an old ramp-and-triangle save in the new Night Run", () => {
    const progress = sanitizeGradeSevenProgress({
      skatepark: {
        seenEvents: [0, 1, 2],
        lastEvent: 2,
        completed: false,
        interactionState: {
          kind: "skatepark",
          step: 2,
          showDemo: false,
          successChoice: null,
          angle: 60,
          triangleAngle: "60°",
          meaning: "The amount of turn between two lines",
        },
      },
    });
    expect(progress.skatepark?.interactionState).toMatchObject({
      storyVersion: 2,
      step: 0,
      lightsAwake: 0,
      twinMatched: false,
      openingComplete: false,
      closingComplete: false,
    });
    expect(progress.skatepark?.lastEvent).toBe(0);
    expect(progress.skatepark?.seenEvents).toEqual([0]);
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

  describe("mountain rescue winch defaults (lower-then-lift)", () => {
    it("starts the winch hook at +2 for lowering and the lift at −4", () => {
      const progress = sanitizeGradeSevenProgress({
        mountain: {
          seenEvents: [], lastEvent: 0, completed: false,
          interactionState: { kind: "mountain", storyVersion: 2 },
        },
      });
      const s = progress.mountain!.interactionState as MountainState;
      expect(s.winchPosition).toBe(2);
      expect(s.reversePosition).toBe(-4);
    });

    it("seeds a fresh Rescue Winch replay at the same lower-then-lift positions", () => {
      const s = createGradeSevenState("mountain", 3);
      expect(s.winchPosition).toBe(2);
      expect(s.reversePosition).toBe(-4);
    });
  });

  describe("mountain finale state", () => {
    it("defaults finale fields safely for old saves", () => {
      const progress = sanitizeGradeSevenProgress({
        mountain: {
          seenEvents: [], lastEvent: 0, completed: false,
          interactionState: { kind: "mountain", storyVersion: 2 },
        },
      });
      const s = progress.mountain!.interactionState as MountainState;
      expect(s.finaleBeat).toBe(0);
      expect(s.finaleCellDocked).toBe(false);
      expect(s.finaleComplete).toBe(false);
    });
  });
});
