import { describe, expect, it } from "vitest";
import { createSoundController } from "./sound";

function fakeStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => { data[key] = value; },
    data,
  };
}

describe("sound controller", () => {
  it("starts unmuted by default and toggles with persistence", () => {
    const storage = fakeStorage();
    const controller = createSoundController(storage);
    expect(controller.isMuted()).toBe(false);
    expect(controller.toggleMuted()).toBe(true);
    expect(storage.data["learnnjoy-muted"]).toBe("1");
    expect(controller.toggleMuted()).toBe(false);
    expect(storage.data["learnnjoy-muted"]).toBe("0");
  });

  it("restores a persisted mute", () => {
    const controller = createSoundController(fakeStorage({ "learnnjoy-muted": "1" }));
    expect(controller.isMuted()).toBe(true);
  });

  it("play() never throws without an AudioContext (Node env)", () => {
    const controller = createSoundController(fakeStorage());
    expect(() => controller.play("tap")).not.toThrow();
    expect(() => controller.play("finale")).not.toThrow();
  });
});
