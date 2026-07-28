import { describe, expect, it } from "vitest";
import { getExplorerLevel, LEVEL_THRESHOLDS } from "./levels";

describe("getExplorerLevel", () => {
  it("starts at level 1 and counts toward level 2", () => {
    expect(getExplorerLevel(0)).toEqual({ level: 1, toNext: 3 });
    expect(getExplorerLevel(2)).toEqual({ level: 1, toNext: 1 });
  });

  it("levels up exactly at thresholds", () => {
    expect(getExplorerLevel(3).level).toBe(2);
    expect(getExplorerLevel(6).level).toBe(2);
    expect(getExplorerLevel(7).level).toBe(3);
    expect(getExplorerLevel(63).level).toBe(10);
  });

  it("extends +12 per level beyond the table", () => {
    expect(getExplorerLevel(74)).toEqual({ level: 10, toNext: 1 });
    expect(getExplorerLevel(75).level).toBe(11);
    expect(getExplorerLevel(87).level).toBe(12);
  });

  it("is defensive about bad input", () => {
    expect(getExplorerLevel(-5).level).toBe(1);
    expect(getExplorerLevel(2.9)).toEqual({ level: 1, toNext: 1 });
    expect(LEVEL_THRESHOLDS[0]).toBe(0);
  });
});
