import { describe, expect, it } from "vitest";
import { getQuestsForGrade } from "./grade-quests";
import { getLessonStory } from "./lesson-story";
import { isApprovedStoryVideo, videoProductionBrief } from "./video-assets";

describe("story video production contract", () => {
  it("keeps production briefs brief, captioned, and tied to a learning objective", () => {
    const brief = videoProductionBrief(getLessonStory(getQuestsForGrade(4)[0]));
    expect(brief.targetDurationSeconds).toBe(15);
    expect(brief.captionsRequired).toBe(true);
    expect(brief.frames).toHaveLength(4);
    expect(brief.learningObjective.length).toBeGreaterThan(15);
  });

  it("accepts only short, caption-ready approved assets", () => {
    expect(isApprovedStoryVideo({ src: "/videos/demo.mp4", durationSeconds: 15, transcript: "Nova notices equal pieces and uses the idea in the mission." })).toBe(true);
    expect(isApprovedStoryVideo({ src: "/videos/demo.mp4", durationSeconds: 30, transcript: "Nova notices equal pieces and uses the idea in the mission." })).toBe(false);
  });
});
