import type { LessonStory } from "./lesson-story";

export type ApprovedStoryVideo = NonNullable<LessonStory["videoAsset"]>;

// Keep a narrow, reviewable contract: child-facing story videos must be brief,
// captioned through a transcript, and tied to an approved lesson storyboard.
export function isApprovedStoryVideo(asset: ApprovedStoryVideo): boolean {
  return Boolean(asset.src)
    && asset.durationSeconds > 0
    && asset.durationSeconds <= 25
    && asset.transcript.trim().length >= 20;
}

export function videoProductionBrief(story: LessonStory) {
  return {
    targetDurationSeconds: 15,
    captionsRequired: true,
    frames: story.reelFrames,
    visualDirection: story.videoCue,
    learningObjective: story.learningObjective,
  };
}
