import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MOUNTAIN_AUDIO } from "@/components/mountain-rescue-adventure";

describe("referenced audio assets exist on disk", () => {
  for (const [key, publicPath] of Object.entries(MOUNTAIN_AUDIO)) {
    it(`mountain: ${key} → ${publicPath}`, () => {
      expect(existsSync(join(process.cwd(), "public", publicPath))).toBe(true);
    });
  }
});
