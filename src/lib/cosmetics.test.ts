import { describe, expect, it } from "vitest";
import { cosmetics, getCosmetic } from "./cosmetics";

describe("cosmetics catalog", () => {
  it("has unique ids and a free starter first", () => {
    const ids = cosmetics.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(cosmetics[0]).toMatchObject({ id: "trailblazer", cost: 0 });
    expect(cosmetics.length).toBeGreaterThanOrEqual(6);
  });

  it("every item is affordable-in-principle and fully described", () => {
    for (const item of cosmetics) {
      expect(item.cost).toBeGreaterThanOrEqual(0);
      expect(item.cost).toBeLessThanOrEqual(200);
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.emoji.length).toBeGreaterThan(0);
      expect(item.detail.length).toBeGreaterThan(0);
    }
  });

  it("getCosmetic falls back to the starter for unknown ids", () => {
    expect(getCosmetic("aurora").id).toBe("aurora");
    expect(getCosmetic("not-a-real-id").id).toBe("trailblazer");
  });
});
