import { describe, expect, it } from "vitest";
import { getPet, getPetStage, PET_CHOICE_LEVEL, PET_STAGE_LEVELS, petMoment, pets } from "./pets";

describe("pets catalog", () => {
  it("has five pets including the star-dolphin, each with four stage lines", () => {
    expect(pets).toHaveLength(5);
    expect(pets.map((p) => p.id)).toContain("dolphin");
    expect(new Set(pets.map((p) => p.id)).size).toBe(5);
    for (const pet of pets) expect(pet.stageLines).toHaveLength(4);
  });

  it("getPet returns null for unknown or null ids", () => {
    expect(getPet("dolphin")?.name).toBe("Splash");
    expect(getPet(null)).toBeNull();
    expect(getPet("cat")).toBeNull();
  });
});

describe("getPetStage", () => {
  it("maps levels to stages with 0 before hatching", () => {
    expect(getPetStage(1)).toBe(0);
    expect(getPetStage(2)).toBe(1);
    expect(getPetStage(3)).toBe(1);
    expect(getPetStage(4)).toBe(2);
    expect(getPetStage(7)).toBe(3);
    expect(getPetStage(10)).toBe(4);
    expect(getPetStage(99)).toBe(4);
  });
});

describe("petMoment", () => {
  it("announces the egg when crossing the choice level without a pet", () => {
    expect(petMoment(2, 3, null)).toContain("star-egg");
  });

  it("announces a stage-up line for the chosen pet", () => {
    // 32 -> 33 discoveries crosses level 6 -> 7, which is stage 2 -> 3 (Voyager)
    const line = petMoment(32, 33, "dolphin");
    expect(line).toBe(getPet("dolphin")!.stageLines[2]);
  });

  it("is quiet when no boundary is crossed", () => {
    expect(petMoment(3, 4, "dolphin")).toBeNull();
    expect(petMoment(8, 9, null)).toBeNull();
  });

  it("exposes sane constants", () => {
    expect(PET_CHOICE_LEVEL).toBe(2);
    expect(PET_STAGE_LEVELS).toEqual([2, 4, 7, 10]);
  });
});
