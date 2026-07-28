import { describe, expect, it } from "vitest";
import {
  balanceEquation,
  shopFinalPrice,
  shopSaving,
  skateSkaterAlong,
  topCricketPlayers,
  triangleMissingAngle,
} from "./grade-seven-worlds";

describe("Grade 7 continuous-world maths", () => {
  it("keeps both sides equal while blocks are removed together", () => {
    for (let removed = 0; removed <= 5; removed += 1) {
      const equation = balanceEquation(removed);
      expect(equation.mysteryValue + equation.leftBlocks).toBe(equation.rightBlocks);
    }
  });

  it("turns a quarter of ₹240 into a ₹60 saving and ₹180 final price", () => {
    expect(shopSaving(240, 25)).toBe(60);
    expect(shopFinalPrice(240, 25)).toBe(180);
  });

  it("moves the skater toward the pivot as the ramp steepens", () => {
    expect(skateSkaterAlong(60)).toBeLessThan(skateSkaterAlong(20));
    expect(skateSkaterAlong(120)).toBe(22);
  });

  it("shows the triangle total before asking for the missing angle", () => {
    expect(triangleMissingAngle(60, 60)).toBe(60);
  });

  it("derives the squad from the three tallest score bars", () => {
    expect(topCricketPlayers(3)).toEqual(["Asha", "Kabir", "Noor"]);
  });
});
