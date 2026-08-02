import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GradeSevenActivity } from "./grade-seven-adventures";
import { MOUNTAIN_FINALE_BEATS } from "./mountain-rescue-adventure";
import {
  SKATEPARK_QUEST_IDS,
  createGradeSevenState,
  type GradeSevenActivityMode,
  type GradeSevenAdventureId,
  type GradeSevenInteractionState,
  type MountainState,
  type SkateparkState,
} from "@/lib/grade-seven-progress";

const landmarks: Record<Exclude<GradeSevenAdventureId, "mountain">, string> = {
  moonbase: "moonbase-quest-map",
  balance: "balance-quest-map",
  shop: "bazaar-stalls",
  skatepark: "skatepark-quest-map",
  cricket: "stadium-scoreboard",
};

function renderAdventure(
  id: Exclude<GradeSevenAdventureId, "mountain">,
  step: number,
  mode: GradeSevenActivityMode = "live",
  firstTime = true,
) {
  const state = createGradeSevenState(id, step) as GradeSevenInteractionState;
  return renderToStaticMarkup(React.createElement(GradeSevenActivity, {
    id,
    state,
    mode,
    firstTime,
    heroName: "Aanya",
    avatar: "star",
    onChange: () => {},
    onFinish: () => {},
  }));
}

describe("continuous Grade 7 story worlds", () => {
  it("opens Moonbase Tenfold as one connected four-quest comet mission", () => {
    const html = renderAdventure("moonbase", 0);
    expect(html).toContain("Moonbase Tenfold");
    expect(html).toContain("The Telescope Wakes");
    expect(html).toContain("Rebuild the Coordinate");
    expect(html).toContain("Two Mission Controls");
    expect(html).toContain("Catch the Comet");
    expect(html).toContain("0<span> OF 4 QUESTS");
  });

  it("starts Moonbase with character dialogue before place-value controls", () => {
    const state = {
      ...createGradeSevenState("moonbase"),
      chapterMapOpen: false,
      activeQuest: "tenfold-telescope" as const,
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "moonbase",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    expect(html).toContain("I found the comet bloom");
    expect(html).toContain("Next line");
    expect(html).not.toContain("Telescope place-value zoom");
  });

  it("reveals tenfold language only inside the played telescope scene", () => {
    const state = {
      ...createGradeSevenState("moonbase"),
      chapterMapOpen: false,
      activeQuest: "tenfold-telescope" as const,
      openingComplete: true,
      telescopePlace: 5,
      telescopeTested: true,
      questStep: 3,
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "moonbase",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    expect(html).toContain("6,00,000");
    expect(html).toContain("ten times greater");
    expect(html).toContain("Its <b>place</b> changed");
  });

  it("opens Mountain Rescue as one world with four connected integer quests", () => {
    const state = createGradeSevenState("mountain");
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(html).toContain("Mountain Rescue");
    expect(html).toContain("Chase the Lost Signal");
    expect(html).toContain("Cliff Checkpoints");
    expect(html).toContain("Storm Moves");
    expect(html).toContain("Rescue Winch");
    expect(html).toContain("0/4 rescue routes complete");
    expect(html).not.toContain("Nova needs your help");
  });

  it("starts Signal Below Zero with character dialogue before the interaction", () => {
    const state = {
      ...createGradeSevenState("mountain"),
      chapterMapOpen: false,
      activeQuest: "signal-below-zero" as const,
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(html).toContain("Pip! The ribbon goes on the shelter—not your tail!");
    expect(html).toContain("%2Fimages%2Fmountain-rescue%2Frescue-pod.png");
    expect(html).toContain("Next line");
  });

  it("keeps formal integer words hidden until the child finds the signal", () => {
    const movingState = {
      ...createGradeSevenState("mountain"),
      chapterMapOpen: false,
      activeQuest: "signal-below-zero" as const,
      openingComplete: true,
      questStep: 1,
      signalPrediction: "below" as const,
      position: 0,
      flightPath: [3, 2, 1, 0],
    };
    const movingHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: movingState,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(movingHtml).toContain("That gold line is zero");
    expect(movingHtml).not.toContain("ABOVE ZERO <b>POSITIVE");

    const revealedHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: {
        ...movingState,
        questStep: 2,
        position: -4,
        signalFound: true,
        snowCleared: 100,
        podRecoveryProgress: 100,
        podRecovered: true,
        flightPath: [3, 2, 1, 0, -1, -2, -3, -4],
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(revealedHtml).toContain("positive");
    expect(revealedHtml).toContain("negative");
    expect(revealedHtml).toContain("The cliff continues on both sides of zero");
  });

  it("shows the compact equation only after the visual route replay", () => {
    const base = {
      ...createGradeSevenState("mountain"),
      chapterMapOpen: false,
      activeQuest: "signal-below-zero" as const,
      openingComplete: true,
      questStep: 3,
      signalPrediction: "below" as const,
      signalFound: true,
      position: -4,
      flightPath: [3, 2, 1, 0, -1, -2, -3, -4],
    };
    const beforeHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: base,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const afterHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: { ...base, recapPlayed: true },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(beforeHtml).not.toContain("3 − 7 = −4");
    expect(afterHtml).toContain("3 − 7 = −4");
  });

  it("unlocks Cliff Checkpoints on the same Mountain map after Quest 1", () => {
    const state = {
      ...createGradeSevenState("mountain"),
      completedQuests: ["signal-below-zero"] as const,
      chapterMapOpen: true,
      activeQuest: null,
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: { ...state, completedQuests: [...state.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(html).toContain("1/4 rescue routes complete");
    expect(html).toContain("Cliff Checkpoints");
    expect(html).toContain("READY");
    expect(html).toMatch(/READY[\s\S]*Cliff Checkpoints[\s\S]*Start rescue/);
  });

  it("makes Cliff Checkpoints a voiced story action before naming number order", () => {
    const openingState = {
      ...createGradeSevenState("mountain"),
      step: 1,
      chapterMapOpen: false,
      activeQuest: "cliff-checkpoints" as const,
      completedQuests: ["signal-below-zero"] as const,
    };
    const openingHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: { ...openingState, completedQuests: [...openingState.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const actionHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: {
        ...openingState,
        completedQuests: [...openingState.completedQuests],
        q2OpeningComplete: true,
        questStep: 1,
        higherCheckpoint: 2,
        checkpointRunTested: true,
        checkpointOrder: [-5, -1],
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const revealHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: {
        ...openingState,
        completedQuests: [...openingState.completedQuests],
        q2OpeningComplete: true,
        questStep: 2,
        higherCheckpoint: 2,
        checkpointRunTested: true,
        checkpointOrder: [-5, -1, 2, 6],
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(openingHtml).toContain("Four checkpoint lights are blinking out of order!");
    expect(actionHtml).toContain("Visit every checkpoint from lowest to highest");
    expect(actionHtml).toContain("mountain-route-marker");
    expect(actionHtml).not.toContain("Higher on the number path means greater");
    expect(revealHtml).toContain("Higher on the number path means greater");
    expect(revealHtml).toContain("−5");
    expect(revealHtml).toContain("−1");
  });

  it("makes Storm Moves show every gust before revealing integer addition", () => {
    const base = {
      ...createGradeSevenState("mountain"),
      step: 2,
      chapterMapOpen: false,
      activeQuest: "storm-moves" as const,
      completedQuests: ["signal-below-zero", "cliff-checkpoints"] as const,
      q3OpeningComplete: true,
    };
    const actionHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: { ...base, completedQuests: [...base.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const revealHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: {
        ...base,
        completedQuests: [...base.completedQuests],
        questStep: 2,
        stormPosition: 1,
        stormTrail: [-2, -1, 0, 1, 2, 3, 2, 1, 0, -1, 0, 1],
        gustIndex: 3,
        stormRunComplete: true,
        transferGustIndex: 2,
        stormTransferComplete: true,
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(actionHtml).toContain("Release gust");
    expect(actionHtml).toContain("UP 5");
    expect(actionHtml).not.toContain("Integer addition keeps a running position");
    expect(revealHtml).toContain("Integer addition keeps a running position");
    expect(revealHtml).toContain("−2");
    expect(revealHtml).toContain("+5");
    expect(revealHtml).toContain("= +1");
  });

  it("makes Rescue Winch prove both directions before the chapter finale", () => {
    const base = {
      ...createGradeSevenState("mountain"),
      step: 3,
      chapterMapOpen: false,
      activeQuest: "rescue-winch" as const,
      completedQuests: ["signal-below-zero", "cliff-checkpoints", "storm-moves"] as const,
      q4OpeningComplete: true,
      winchPosition: 2,
      reversePosition: -4,
    };
    const lowerHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: { ...base, completedQuests: [...base.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const revealHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: {
        ...base,
        completedQuests: [...base.completedQuests],
        questStep: 2,
        winchPosition: -4,
        winchRunStarted: true,
        winchReached: true,
        reversePosition: 2,
        reverseRunStarted: true,
        reverseComplete: true,
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const finaleLockedHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: {
        ...base,
        completedQuests: [...base.completedQuests],
        questStep: 3,
        winchPosition: -4,
        winchReached: true,
        reversePosition: 2,
        reverseComplete: true,
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(lowerHtml).toContain("Drop +2 down to the pod at −4.");
    expect(lowerHtml).not.toContain("Opposite moves can undo each other");
    expect(revealHtml).toContain("Opposite moves can undo each other");
    expect(revealHtml).toContain("+2 − 6 = −4");
    expect(revealHtml).toContain("−4 + 6 = +2");
    expect(revealHtml.indexOf("+2 − 6 = −4")).toBeLessThan(revealHtml.indexOf("−4 + 6 = +2"));
    expect(finaleLockedHtml).toContain("Play the full rescue");
    expect(finaleLockedHtml).toMatch(/signal-primary" type="button" disabled/);
    expect(finaleLockedHtml).not.toContain("+25 Lumina coins");
  });

  it("mountain finale beats gate chapter completion", () => {
    expect(MOUNTAIN_FINALE_BEATS).toHaveLength(5);
    expect(MOUNTAIN_FINALE_BEATS[0].action).toMatch(/Dock the energy cell/);
    expect(MOUNTAIN_FINALE_BEATS[3].action).toMatch(/Save the postcard/);

    const finaleBase = {
      ...createGradeSevenState("mountain"),
      step: 3,
      chapterMapOpen: false,
      activeQuest: "rescue-winch" as const,
      completedQuests: ["signal-below-zero", "cliff-checkpoints", "storm-moves"] as MountainState["completedQuests"],
      q4OpeningComplete: true,
      questStep: 4,
    };
    const openingHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: { ...finaleBase, finaleBeat: 0, finaleCellDocked: false },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    expect(openingHtml).toContain("Mountain Rescue finale");
    expect(openingHtml).toContain("Dock the energy cell");

    const postcardHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "mountain",
      state: { ...finaleBase, finaleBeat: 3, finaleCellDocked: true },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    expect(postcardHtml).toContain("Postcard from Ridge Shelter");
  });

  it("makes Keep It Level show the physical beam before the equality symbol", () => {
    const base = {
      ...createGradeSevenState("balance"),
      chapterMapOpen: false,
      activeQuest: "keep-it-level" as const,
      q1OpeningComplete: true,
    };
    const actionHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "balance",
      state: base,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const revealHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "balance",
      state: {
        ...base,
        questStep: 1,
        leftLoad: 3,
        rightLoad: 3,
        levelRunTested: true,
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(actionHtml).toContain("Load both pans until the beam settles");
    expect(actionHtml).toContain("Add left block");
    expect(actionHtml).toContain("Add right block");
    expect(actionHtml).toContain("balance-world-machine");
    expect(actionHtml).not.toContain("3 = 3");
    expect(revealHtml).toContain("A level beam makes equality visible");
    expect(revealHtml).toContain("3 = 3");
  });

  it("keeps the Balance Lab fairness and inverse concepts behind visible actions", () => {
    const q2 = {
      ...createGradeSevenState("balance", 1),
      chapterMapOpen: false,
      activeQuest: "same-move-both-sides" as const,
      completedQuests: ["keep-it-level"] as const,
      q2OpeningComplete: true,
      questStep: 1,
      oneSideRemoved: true,
      fairnessRestored: true,
      pairedRemoval: 2,
    };
    const q2Html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "balance",
      state: { ...q2, completedQuests: [...q2.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const q3 = {
      ...createGradeSevenState("balance", 2),
      chapterMapOpen: false,
      activeQuest: "reveal-the-crate" as const,
      completedQuests: ["keep-it-level", "same-move-both-sides"] as const,
      q3OpeningComplete: true,
      questStep: 1,
      cratePairsRemoved: 5,
      crateScanTested: false,
    };
    const q3Html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "balance",
      state: { ...q3, completedQuests: [...q3.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(q2Html).toContain("Remove three matching pairs");
    expect(q2Html).not.toContain("Equal changes preserve equality");
    expect(q3Html).toContain("Run the crate scanner");
    expect(q3Html).not.toContain("? + 5 − 5");
  });

  it("finishes Balance Lab only after the changed lock and replay-safe finale", () => {
    const state = {
      ...createGradeSevenState("balance", 3),
      chapterMapOpen: false,
      activeQuest: "test-another-lock" as const,
      completedQuests: ["keep-it-level", "same-move-both-sides", "reveal-the-crate"] as const,
      q4OpeningComplete: true,
      questStep: 3,
      secondLockRemoved: 3,
      secondLockOpened: true,
      q4RecapPlayed: true,
    };
    const liveHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "balance",
      state: { ...state, completedQuests: [...state.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const replayHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "balance",
      state: { ...state, completedQuests: [...state.completedQuests] },
      mode: "replay",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(liveHtml).toContain("Complete Balance Lab");
    expect(liveHtml).not.toContain("+25 Lumina coins");
    expect(replayHtml).toContain("Return to my journal");
    expect(replayHtml).not.toContain("+25 Lumina coins");
  });

  it("keeps a persistent mathematical landmark beneath every opening play", () => {
    for (const id of Object.keys(landmarks) as Array<keyof typeof landmarks>) {
      const html = renderAdventure(id, 0);
      if (id === "skatepark") {
        expect(html).toContain("ONE STORY WORLD");
        expect(html).toContain("Trail Meet");
        expect(html).toContain("Crossing Rails");
        expect(html).toContain("Rails That Never Meet");
        expect(html).toContain("Same Corner Lights");
        expect(html).toContain("Zigzag Lights");
        expect(html).toContain("Inside Together");
        expect(html).toContain("Reverse Check");
        expect(html).toContain("Opening Ride");
      } else if (id === "balance") {
        expect(html).toContain("Keep It Level");
        expect(html).toContain("Same Move, Both Sides");
        expect(html).toContain("Reveal the Crate");
        expect(html).toContain("Test Another Lock");
      } else if (id === "moonbase") {
        expect(html).toContain("Moonbase Tenfold");
        expect(html).toContain("The Telescope Wakes");
      } else {
        expect(html).toContain("Nova needs your help");
      }
      expect(html).toContain(landmarks[id]);
    }
  });

  it("keeps the chapter reward behind the full chapter, not Crossing Rails", () => {
    for (const id of Object.keys(landmarks) as Array<keyof typeof landmarks>) {
      if (id === "balance") continue;
      const html = renderAdventure(id, 5);
      expect(html).toContain("world-finale");
      if (id === "skatepark") {
        expect(html).toContain("Quest saved");
        expect(html).toContain("chapter star lights after all four rooftop quests");
        expect(html).not.toContain("+25 Lumina coins");
      } else {
        expect(html).toContain("+25 Lumina coins");
      }
    }
  });

  it("keeps journal replays reward-safe", () => {
    for (const id of Object.keys(landmarks) as Array<keyof typeof landmarks>) {
      if (id === "balance") continue;
      const html = renderAdventure(id, 5, "replay");
      expect(html).toContain("Live progress stayed safe");
      expect(html).not.toContain("+25 Lumina coins");
    }
  });

  it("restores a completed Trail Meet run inside the real Skatepark world", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      chapterMapOpen: false,
      activeQuest: "trail-meet" as const,
      trailEndpoint: { x: 0.64, y: 0.42 },
      trailOutcome: "crossed" as const,
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(html).toContain("Your straight trails met!");
    expect(html).toContain("Your trail met Nova’s at one point.");
    expect(html).toContain("Continue to the crossing");
  });

  it("makes Crossing Rails test the visible story paths before continuing", () => {
    const base = {
      ...createGradeSevenState("skatepark"),
      step: 1,
      chapterMapOpen: false,
      activeQuest: "crossing-rails" as const,
      completedQuests: ["trail-meet"] as const,
      openingComplete: true,
      movedRail: true,
      crossingRouteTested: false,
    };
    const waitingHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state: { ...base, completedQuests: [...base.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));
    const testedHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state: {
        ...base,
        completedQuests: [...base.completedQuests],
        crossingRouteTested: true,
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(waitingHtml).toContain("Test the two paths");
    expect(waitingHtml).toContain("night-run-route-playback");
    expect(waitingHtml).toContain("Next scene →");
    expect(waitingHtml).toMatch(/night-run-next" disabled/);
    expect(testedHtml).toContain("Run the two paths again");
    expect(testedHtml).toContain("two straight paths meet at one point");
    expect(testedHtml).not.toMatch(/night-run-next" disabled/);
  });

  it("renders Quest 3 as a saved interactive rail world", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "never-meet" as const,
      completedQuests: ["trail-meet", "crossing-rails"] as const,
      questStep: 1,
      parallelMatched: true,
      parallelGapMoved: false,
      q3OpeningComplete: true,
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state: { ...state, completedQuests: [...state.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(html).toContain("QUEST 3 · RAILS THAT NEVER MEET");
    expect(html).toContain("never-meet-rails");
    expect(html).toContain("Move Apart, Stay Parallel");
    expect(html).toContain("Move your rail. Watch both gap markers stay equal.");
  });

  it("makes Quest 3 prove parallel rails through a visible twin-lane run", () => {
    const base = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "never-meet" as const,
      completedQuests: ["trail-meet", "crossing-rails"] as const,
      questStep: 0,
      parallelAngle: 0,
      parallelMatched: true,
      parallelRunTested: false,
      q3OpeningComplete: true,
    };
    const waitingHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state: { ...base, completedQuests: [...base.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));
    const testedHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state: {
        ...base,
        completedQuests: [...base.completedQuests],
        parallelRunTested: true,
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(waitingHtml).toContain("Ride the twin lanes");
    expect(waitingHtml).toContain("never-meet-route-playback");
    expect(waitingHtml).toMatch(/night-run-next" disabled/);
    expect(testedHtml).toContain("Ride the twin lanes again");
    expect(testedHtml).toContain("same direction, same gap, no meeting");
    expect(testedHtml).not.toMatch(/night-run-next" disabled/);
  });

  it("opens Quest 3 with the three-character twin-lane story", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "never-meet" as const,
      completedQuests: ["trail-meet", "crossing-rails"] as SkateparkState["completedQuests"],
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(html).toContain("The twin-lane launch");
    expect(html).toContain("Nova! The twin-lane light show starts now!");
    expect(html).toContain("The friendly rooftop rider");
  });

  it("renders the final Crossing Beam quest without awarding early", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "crossing-beam" as const,
      completedQuests: ["trail-meet", "crossing-rails", "never-meet"] as SkateparkState["completedQuests"],
      questStep: 1,
      beamMoved: true,
      correspondingArmed: true,
      correspondingMatched: false,
      q4OpeningComplete: true,
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(html).toContain("QUEST 4 · CROSSING BEAM");
    expect(html).toContain("crossing-beam-transversal");
    expect(html).toContain("Find the Same Seat");
    expect(html).not.toContain("+25 Lumina coins");
  });

  it("makes Crossing Beam test both rail crossings before naming a transversal", () => {
    const base = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "crossing-beam" as const,
      completedQuests: ["trail-meet", "crossing-rails", "never-meet"] as const,
      questStep: 0,
      beamMoved: true,
      beamRunTested: false,
      q4OpeningComplete: true,
    };
    const waitingHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state: { ...base, completedQuests: [...base.completedQuests] },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));
    const testedHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state: {
        ...base,
        completedQuests: [...base.completedQuests],
        beamRunTested: true,
      },
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(waitingHtml).toContain("Test the spotlight path");
    expect(waitingHtml).toMatch(/night-run-next" disabled/);
    expect(waitingHtml).not.toContain("maths calls it a transversal");
    expect(testedHtml).toContain("Test the spotlight path again");
    expect(testedHtml).toContain("one straight beam cuts both parallel rails");
    expect(testedHtml).toContain("maths calls it a transversal");
    expect(testedHtml).not.toMatch(/night-run-next" disabled/);
  });

  it("opens Quest 4 with the three-character spotlight story", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "crossing-beam" as const,
      completedQuests: ["trail-meet", "crossing-rails", "never-meet"] as SkateparkState["completedQuests"],
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "star",
      onChange: () => {},
      onFinish: () => {},
    }));

    expect(html).toContain("The stuck spotlight");
    expect(html).toContain("One last show—the gold spotlight is stuck!");
    expect(html).toContain("The friendly rooftop rider");
  });

  it("opens Quest 5 as a character-led zigzag story instead of a detached exercise", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "zigzag-lights" as const,
      completedQuests: ["trail-meet", "crossing-rails", "never-meet", "crossing-beam"] as SkateparkState["completedQuests"],
      extensionOpeningBeat: 0,
      extensionOpeningComplete: false,
    };
    const html = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    expect(html).toContain("The beam made a secret Z");
    expect(html).toContain("nova-skateboard-v2.png");
    expect(html).toContain("Next line");
  });

  it("keeps the Night Run reward behind the eighth quest finale", () => {
    const state = {
      ...createGradeSevenState("skatepark"),
      step: 5,
      chapterMapOpen: false,
      activeQuest: "opening-ride" as const,
      completedQuests: SKATEPARK_QUEST_IDS.slice(0, 7) as SkateparkState["completedQuests"],
      extensionOpeningComplete: true,
      openingRideBuilt: true,
      openingRideLaunched: true,
    };
    const liveHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state,
      mode: "live",
      firstTime: true,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    const replayHtml = renderToStaticMarkup(React.createElement(GradeSevenActivity, {
      id: "skatepark",
      state,
      mode: "replay",
      firstTime: false,
      heroName: "Aanya",
      avatar: "explorer",
      onChange: () => {},
      onFinish: () => {},
    }));
    expect(liveHtml).toContain("NIGHT RUN COMPLETE");
    expect(liveHtml).toContain("+25 Lumina coins");
    expect(replayHtml).toContain("Live progress stayed safe");
    expect(replayHtml).not.toContain("+25 Lumina coins");
  });
});
