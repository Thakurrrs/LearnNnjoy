import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  findPathIntersection,
  VoiceStoryAudition,
} from "./voice-story-audition";

describe("VoiceStoryAudition", () => {
  it("opens as a user-gated complete scene audition", () => {
    const html = renderToStaticMarkup(<VoiceStoryAudition />);

    expect(html).toContain("Parallel Glide");
    expect(html).toContain("Play the new scene");
    expect(html).toContain("Watch Nova. Then steer the learner.");
    expect(html).toContain("About 35 seconds before the playable skating turn");
    expect(html).toContain("No scores. No collisions. Just explore the trails.");
    expect(html).not.toContain("Make your trail");
  });

  it("finds where a player trail crosses Nova's trail", () => {
    expect(
      findPathIntersection([
        { x: 0.2, y: 0.7 },
        { x: 0.5, y: 0.6 },
        { x: 0.8, y: 0.4 },
      ]),
    ).toEqual({ x: 0.68, y: 0.48 });
  });

  it("keeps a separate route as a valid non-intersection", () => {
    expect(
      findPathIntersection([
        { x: 0.1, y: 0.72 },
        { x: 0.5, y: 0.7 },
        { x: 0.86, y: 0.65 },
      ]),
    ).toBeNull();
  });
});
