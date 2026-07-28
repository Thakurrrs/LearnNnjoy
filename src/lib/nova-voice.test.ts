import { describe, expect, it } from "vitest";
import { novaVoiceDelivery, prepareNovaSpeech, rankNovaVoices } from "./nova-voice";

describe("Nova browser voice", () => {
  it("prefers a warm natural English voice over a harsh compact default", () => {
    const voices = rankNovaVoices([
      { name: "English Compact", lang: "en-US", default: true },
      { name: "Microsoft Neerja Online (Natural)", lang: "en-IN" },
      { name: "Deutsch", lang: "de-DE" },
    ]);
    expect(voices.map((voice) => voice.name)).toEqual([
      "Microsoft Neerja Online (Natural)",
      "English Compact",
    ]);
  });

  it("keeps voice order stable when candidates have the same score", () => {
    const voices = rankNovaVoices([
      { name: "Voice One", lang: "en-US" },
      { name: "Voice Two", lang: "en-US" },
    ]);
    expect(voices.map((voice) => voice.name)).toEqual(["Voice One", "Voice Two"]);
  });

  it("uses gentler pacing for explanation and retry moments", () => {
    expect(novaVoiceDelivery("explain").rate).toBeLessThan(novaVoiceDelivery("alert").rate);
    expect(novaVoiceDelivery("retry").volume).toBeLessThan(novaVoiceDelivery("celebrate").volume);
    expect(novaVoiceDelivery("celebrate").pitch).toBeGreaterThan(novaVoiceDelivery("retry").pitch);
  });

  it("turns mathematical symbols into words before narration", () => {
    expect(prepareNovaSpeech("Move from +3 to −4—slowly.")).toBe("Move from plus 3 to minus 4, slowly.");
  });
});
