import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { MOUNTAIN_AUDIO } from "@/components/mountain-rescue-adventure";

const AUDIO_MAPS = { mountain: MOUNTAIN_AUDIO } as const;

describe("referenced audio assets exist on disk", () => {
  for (const [mapName, audioMap] of Object.entries(AUDIO_MAPS)) {
    for (const [key, publicPath] of Object.entries(audioMap)) {
      it(`${mapName}: ${key} → ${publicPath}`, () => {
        const p = join(process.cwd(), "public", publicPath);
        expect(existsSync(p), `missing audio asset: ${p}`).toBe(true);
        expect(statSync(p).size, `empty audio asset: ${p}`).toBeGreaterThan(1000);
      });
    }
  }
});

describe("every recorded audio file is referenced by a map", () => {
  for (const [mapName, audioMap] of Object.entries(AUDIO_MAPS)) {
    const publicPaths = Object.values(audioMap);
    const relativeDir = dirname(publicPaths[0]);
    expect(publicPaths.every((p) => dirname(p) === relativeDir), `${mapName}: map paths span more than one directory`).toBe(true);

    it(`${mapName}: no orphaned files under public${relativeDir}`, () => {
      const absoluteDir = join(process.cwd(), "public", relativeDir);
      const referenced = new Set(
        publicPaths.map((publicPath) => publicPath.slice(publicPath.lastIndexOf("/") + 1)),
      );
      const onDisk = readdirSync(absoluteDir).filter((name) => name.endsWith(".mp3"));
      const orphans = onDisk.filter((name) => !referenced.has(name));
      expect(orphans, `orphaned audio files under public${relativeDir}: ${orphans.join(", ")}`).toEqual([]);
    });
  }
});
