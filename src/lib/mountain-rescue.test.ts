import { describe, expect, it } from "vitest";
import {
  altitudeFromPointer,
  appendAltitudeTrail,
  formatAltitude,
  MOUNTAIN_BOTTOM,
  MOUNTAIN_TOP,
  mountainDisplayPosition,
  mountainNarration,
} from "./mountain-rescue";
import { createGradeSevenState, type MountainState } from "./grade-seven-progress";

function mountainState(patch: Partial<MountainState> = {}): MountainState {
  return { ...(createGradeSevenState("mountain") as MountainState), ...patch };
}

describe("Mountain Rescue adventure model", () => {
  it("fills every crossed integer into the saved flight trail", () => {
    expect(appendAltitudeTrail([3], 3, -4)).toEqual([3, 2, 1, 0, -1, -2, -3, -4]);
    expect(appendAltitudeTrail([3, 2, 1], 1, 3)).toEqual([3, 2, 1, 2, 3]);
  });

  it("maps direct pointer movement onto the vertical integer cliff", () => {
    expect(altitudeFromPointer(100, 100, 320)).toBe(MOUNTAIN_TOP);
    expect(altitudeFromPointer(260, 100, 320)).toBe(0);
    expect(altitudeFromPointer(420, 100, 320)).toBe(MOUNTAIN_BOTTOM);
  });

  it("keeps the visual pod aligned with the active story event", () => {
    expect(mountainDisplayPosition(mountainState({ step: 0 }))).toBe(3);
    expect(mountainDisplayPosition(mountainState({ step: 1, showDemo: true, briefingBeat: 3 }))).toBe(-1);
    expect(mountainDisplayPosition(mountainState({ step: 2, position: 3 }))).toBe(-4);
    expect(mountainDisplayPosition(mountainState({ step: 4, returnPosition: 2 }))).toBe(2);
    expect(mountainDisplayPosition(mountainState({ step: 5 }))).toBe(2);
  });

  it("speaks the mathematical consequence of zero crossing", () => {
    expect(mountainNarration(mountainState({ step: 1, showDemo: false, position: 0 }), "Aanya")).toContain("zero");
    expect(mountainNarration(mountainState({ step: 1, showDemo: false, position: -4 }), "Aanya")).toContain("seven levels down");
    expect(mountainNarration(mountainState({ step: 4, returnPosition: 2 }), "Aanya")).toContain("climbed six levels");
  });

  it("formats positive, zero and negative positions clearly", () => {
    expect(formatAltitude(3)).toBe("+3");
    expect(formatAltitude(0)).toBe("0");
    expect(formatAltitude(-4)).toBe("-4");
  });
});
