import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Best-effort static guard suggested by the reviewer-lens experience-holes
// audit (docs/qa/experience-holes-2026-08-02/reviewer-lens.md): the Q1
// "signal rescue" refactor shipped ~16 new class names with zero matching
// CSS, while world.css kept styling the previous generation of the same
// scene. A lint that fails when a component emits a class with no matching
// CSS rule would have caught that mechanically — this is that lint, scoped
// (per the audit's own suggestion) to the three families most of the
// BREAKS-STORY findings lived in: signal-*, rescue-*, finale-*.
//
// This is deliberately a substring check, not a real CSS/JSX parser: it
// extracts every className="..."/className={`...`} attribute from the
// component source (brace-depth aware, so ternaries with nested {} inside
// an interpolation don't truncate the scan), pulls every signal-*/rescue-*/
// finale-* token out of that text with a plain regex, and checks the token
// appears somewhere in the CSS corpus. That means a handful of things it
// deliberately does NOT try to verify: that the matching rule is a real
// selector rather than an incidental substring hit (e.g. inside a comment,
// or as part of a longer selector like .mountain-finale-act containing
// "finale-act"), that the rule is reachable under the right ancestor
// classes, or that it is not itself dead. Those all still need a human (or
// the live-browser pass) — this only catches the "zero references anywhere"
// case the audit actually found.
function extractClassTokens(source: string, prefixes: readonly string[]): Set<string> {
  const tokenPattern = new RegExp(`\\b(?:${prefixes.join("|")})-[a-z][a-z0-9-]*\\b`, "g");
  const tokens = new Set<string>();
  const attrRe = /className=/g;
  let match: RegExpExecArray | null;
  while ((match = attrRe.exec(source))) {
    const start = match.index + match[0].length;
    let segment: string;
    if (source[start] === '"') {
      const end = source.indexOf('"', start + 1);
      segment = source.slice(start, end + 1);
    } else if (source[start] === "{") {
      let depth = 0;
      let i = start;
      for (; i < source.length; i++) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        }
      }
      segment = source.slice(start, i);
    } else {
      continue;
    }
    for (const tokenMatch of segment.matchAll(tokenPattern)) tokens.add(tokenMatch[0]);
  }
  return tokens;
}

describe("Mountain Rescue signal-/rescue-/finale- classes have matching CSS", () => {
  const componentPath = join(process.cwd(), "src/components/mountain-rescue-adventure.tsx");
  const cssPath = join(process.cwd(), "src/app/world.css");
  const component = readFileSync(componentPath, "utf8");
  const css = readFileSync(cssPath, "utf8");
  const tokens = extractClassTokens(component, ["signal", "rescue", "finale"]);

  it("finds at least the classes this guard is meant to police", () => {
    // Sanity check on the extractor itself, so a regression in the scan
    // (e.g. a JSX refactor that breaks the brace-depth walk) fails loudly
    // here instead of silently shrinking the token set to nothing.
    expect(tokens.size).toBeGreaterThan(30);
    expect(tokens).toContain("signal-cliff-stage");
    expect(tokens).toContain("rescue-sled-team");
  });

  for (const token of [...tokens].sort()) {
    it(`.${token} has at least one rule in world.css`, () => {
      expect(css.includes(token), `no CSS mentions "${token}" — emitted by mountain-rescue-adventure.tsx with no matching rule`).toBe(true);
    });
  }
});
