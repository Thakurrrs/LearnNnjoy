import { describe, expect, it } from "vitest";
import { getTrailPositions } from "./constellation-layout";

describe("getTrailPositions", () => {
  it("returns one in-bounds position per star", () => {
    const positions = getTrailPositions(15);
    expect(positions).toHaveLength(15);
    for (const p of positions) {
      expect(p.x).toBeGreaterThanOrEqual(5);
      expect(p.x).toBeLessThanOrEqual(95);
      expect(p.y).toBeGreaterThanOrEqual(12);
      expect(p.y).toBeLessThanOrEqual(78);
    }
  });

  it("walks left to right so the trail never doubles back", () => {
    const positions = getTrailPositions(15);
    for (let i = 1; i < positions.length; i++) expect(positions[i].x).toBeGreaterThan(positions[i - 1].x);
  });

  it("handles tiny and empty inputs", () => {
    expect(getTrailPositions(0)).toEqual([]);
    expect(getTrailPositions(1)).toHaveLength(1);
  });
});
