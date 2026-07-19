import { describe, expect, it } from "vitest";
import { shouldResetHostedState } from "./hosted-progress";

describe("hosted grade selection", () => {
  it("does not replace a matching grade's cloud progress", () => {
    expect(shouldResetHostedState(8, 8)).toBe(false);
  });

  it("resets old cloud progress when a guardian changes grade", () => {
    expect(shouldResetHostedState(4, 8)).toBe(true);
  });

  it("does not treat a brand-new learner as a grade change", () => {
    expect(shouldResetHostedState(undefined, 6)).toBe(false);
  });
});
