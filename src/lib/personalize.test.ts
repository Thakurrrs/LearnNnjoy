import { describe, expect, it } from "vitest";
import { personalize } from "./personalize";

describe("personalize", () => {
  it("fills every {hero} token with the name", () => {
    expect(personalize("{hero}! Help {hero} now.", "Aanya")).toBe("Aanya! Help Aanya now.");
  });

  it("uses Explorer when the name is empty or whitespace", () => {
    expect(personalize("Go, {hero}!", "")).toBe("Go, Explorer!");
    expect(personalize("Go, {hero}!", "   ")).toBe("Go, Explorer!");
  });

  it("returns token-free text unchanged and never leaves a stray token", () => {
    expect(personalize("No tokens here.", "Aanya")).toBe("No tokens here.");
    expect(personalize("Hi {hero}", "Aanya")).not.toContain("{hero}");
  });
});
