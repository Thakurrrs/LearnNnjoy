import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GradeSevenActivity } from "./grade-seven-adventures";
import {
  createGradeSevenState,
  type GradeSevenActivityMode,
  type GradeSevenAdventureId,
  type GradeSevenInteractionState,
} from "@/lib/grade-seven-progress";

const landmarks: Record<Exclude<GradeSevenAdventureId, "mountain">, string> = {
  balance: "balance-world-machine",
  shop: "bazaar-stalls",
  skatepark: "skate-world-ramp",
  cricket: "stadium-scoreboard",
};

function renderAdventure(
  id: Exclude<GradeSevenAdventureId, "mountain">,
  step: number,
  mode: GradeSevenActivityMode = "live",
  firstTime = true,
) {
  const state = { ...createGradeSevenState(id), step } as GradeSevenInteractionState;
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
  it("keeps a persistent mathematical landmark beneath every opening play", () => {
    for (const id of Object.keys(landmarks) as Array<keyof typeof landmarks>) {
      const html = renderAdventure(id, 0);
      expect(html).toContain("Nova needs your help");
      expect(html).toContain(landmarks[id]);
    }
  });

  it("shows an in-world result and first-time reward at every live finale", () => {
    for (const id of Object.keys(landmarks) as Array<keyof typeof landmarks>) {
      const html = renderAdventure(id, 5);
      expect(html).toContain("world-finale");
      expect(html).toContain("+25 Lumina coins");
    }
  });

  it("keeps journal replays reward-safe", () => {
    for (const id of Object.keys(landmarks) as Array<keyof typeof landmarks>) {
      const html = renderAdventure(id, 5, "replay");
      expect(html).toContain("Live progress stayed safe");
      expect(html).not.toContain("+25 Lumina coins");
    }
  });
});
