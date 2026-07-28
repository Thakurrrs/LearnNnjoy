import { describe, expect, it } from "vitest";
import { adventurePlayScripts } from "./adventure-play";
import { GRADE_SEVEN_ADVENTURE_IDS } from "@/lib/grade-seven-progress";

describe("Grade 7 character mini-plays", () => {
  it("wraps every playable adventure with three opening and closing beats", () => {
    expect(Object.keys(adventurePlayScripts).sort()).toEqual([...GRADE_SEVEN_ADVENTURE_IDS].sort());
    for (const id of GRADE_SEVEN_ADVENTURE_IDS) {
      expect(adventurePlayScripts[id].opening).toHaveLength(3);
      expect(adventurePlayScripts[id].closing).toHaveLength(3);
    }
  });

  it("opens with Nova, brings in the learner, and ends together", () => {
    for (const script of Object.values(adventurePlayScripts)) {
      expect(script.opening.map((beat) => beat.speaker)).toEqual(["nova", "hero", "together"]);
      expect(script.closing.map((beat) => beat.speaker)).toEqual(["nova", "hero", "together"]);
    }
  });

  it("keeps every beat short enough for a child-paced caption", () => {
    for (const script of Object.values(adventurePlayScripts)) {
      for (const beat of [...script.opening, ...script.closing]) {
        expect(beat.line.trim().length).toBeGreaterThan(0);
        expect(beat.line.split(/\s+/).length).toBeLessThanOrEqual(16);
      }
    }
  });

  it("uses the child name in Nova's first request", () => {
    for (const script of Object.values(adventurePlayScripts)) {
      expect(script.opening[0].line).toContain("{hero}");
    }
  });
});
