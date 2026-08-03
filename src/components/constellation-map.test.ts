import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConstellationMap } from "./constellation-map";
import { gradeSevenAdventures } from "./grade-seven-adventures";

// Star buttons render one after another with no nesting, so splitting on
// "<button" isolates each star's own markup — safe to pull its class and
// aria-label without needing a real DOM.
function starButtonHtml(html: string, topic: string): string {
  const chunks = html.split("<button").slice(1).map((chunk) => `<button${chunk}`);
  const found = chunks.find((chunk) => chunk.includes(`<small>${topic}</small>`));
  expect(found, `no star button found for topic: ${topic}`).toBeTruthy();
  return found!;
}

function starNodeClass(html: string, topic: string): string {
  const button = starButtonHtml(html, topic);
  const match = button.match(/class="([^"]*)"/);
  expect(match, `no class attribute on star button for ${topic}`).not.toBeNull();
  return match![1];
}

describe("ConstellationMap", () => {
  it("dims Balance Lab, Smart Shopper and Cricket Data Room regardless of completion", () => {
    const html = renderToStaticMarkup(React.createElement(ConstellationMap, {
      chapters: gradeSevenAdventures,
      // Simulate a stale save that had completed one of the gated worlds
      // before the owner pulled it from rotation — the star must still dim.
      completedIds: ["balance"],
      selectedId: "mountain",
      onSelect: () => {},
    }));

    expect(starNodeClass(html, "Simple Equations")).toContain("dim");
    expect(starNodeClass(html, "Simple Equations")).not.toContain("lit");
    expect(starButtonHtml(html, "Simple Equations")).toContain("coming soon");
    expect(starNodeClass(html, "Comparing Quantities")).toContain("dim");
    expect(starNodeClass(html, "Data Handling")).toContain("dim");
  });

  it("leaves ready adventures playable: ready when fresh, lit once completed", () => {
    const freshHtml = renderToStaticMarkup(React.createElement(ConstellationMap, {
      chapters: gradeSevenAdventures,
      completedIds: [],
      selectedId: "mountain",
      onSelect: () => {},
    }));
    expect(starNodeClass(freshHtml, "Integers")).toContain("ready");
    expect(starNodeClass(freshHtml, "Large Numbers")).toContain("ready");
    expect(starNodeClass(freshHtml, "Lines and Angles")).toContain("ready");

    const litHtml = renderToStaticMarkup(React.createElement(ConstellationMap, {
      chapters: gradeSevenAdventures,
      completedIds: ["mountain"],
      selectedId: "mountain",
      onSelect: () => {},
    }));
    expect(starNodeClass(litHtml, "Integers")).toContain("lit");
  });
});
