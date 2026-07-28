import { describe, expect, it } from "vitest";
import { avatars, getAvatar } from "./avatars";

describe("avatars", () => {
  it("has three unique avatars with the neutral explorer first", () => {
    expect(avatars.map((a) => a.id)).toEqual(["explorer", "boy", "girl"]);
    expect(new Set(avatars.map((a) => a.id)).size).toBe(3);
  });

  it("every avatar is fully described", () => {
    for (const avatar of avatars) {
      expect(avatar.label.length).toBeGreaterThan(0);
      expect(avatar.image).toMatch(/^\/images\/avatars\//);
      expect(avatar.fallbackEmoji.length).toBeGreaterThan(0);
      expect(avatar.alt.length).toBeGreaterThan(10);
    }
  });

  it("falls back to the star explorer for unknown ids", () => {
    expect(getAvatar("boy").id).toBe("boy");
    expect(getAvatar("unknown").id).toBe("explorer");
  });
});
