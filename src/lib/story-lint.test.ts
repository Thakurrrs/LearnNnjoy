import { describe, expect, it } from "vitest";
import { finaleCopy, gradeSevenAdventures } from "@/components/grade-seven-adventures";
import { getLessonStory } from "./lesson-story";
import type { Question } from "./learning";

const BANNED = ["MISSION MOMENT COMPLETE", "Thoughtful stretch", "calibration", "This is not a score", "useful information", "initialise"];

const visuals: Question["visual"][] = ["fraction", "number-line", "ratio", "formula", "coordinate", "ecosystem", "reading", "map"];
const sampleQuestion = (visual: Question["visual"], id = "lint-sample"): Question => ({ id, prompt: "", choices: [], answer: "", hint: "", explanation: "", visual, skill: "fractions" });

function allStoryStrings(): string[] {
  const strings: string[] = [];
  for (const visual of visuals) {
    const story = getLessonStory(sampleQuestion(visual));
    strings.push(story.chapterTitle, story.chapterDialogue, story.coachLine, story.completeLabel, story.outcomeTitle, story.outcomeDetail, ...story.reelFrames);
  }
  for (const id of ["g4-1", "g4-2", "g4-3"]) {
    const story = getLessonStory(sampleQuestion("fraction", id));
    strings.push(story.chapterTitle, story.chapterDialogue, story.coachLine, story.completeLabel, story.outcomeTitle, story.outcomeDetail);
  }
  for (const adventure of gradeSevenAdventures) strings.push(adventure.intro, finaleCopy[adventure.id].title, finaleCopy[adventure.id].detail);
  return strings;
}

function maxSentenceWords(text: string): number {
  return Math.max(0, ...text.replaceAll("{hero}", "Aanya").split(/[.!?]+/).map((sentence) => sentence.trim().split(/\s+/).filter(Boolean).length));
}

describe("story copy lint", () => {
  it("never uses banned adult labels", () => {
    for (const text of allStoryStrings()) for (const banned of BANNED) expect(text.toLowerCase()).not.toContain(banned.toLowerCase());
  });

  it("keeps sentences kid-short (max 16 words)", () => {
    for (const text of allStoryStrings()) expect(maxSentenceWords(text), text).toBeLessThanOrEqual(16);
  });

  it("completion labels are short and story-contextual", () => {
    for (const visual of visuals) {
      const label = getLessonStory(sampleQuestion(visual)).completeLabel;
      expect(label.split(/\s+/).length).toBeLessThanOrEqual(4);
      expect(label).not.toMatch(/complete/i);
    }
  });
});
