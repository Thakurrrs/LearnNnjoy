export type NovaVoiceTone = "alert" | "explain" | "retry" | "success" | "celebrate";

export type NovaVoiceCandidate = {
  name: string;
  lang: string;
  default?: boolean;
  localService?: boolean;
};

const WARM_VOICE_NAMES = [
  "sandy",
  "flo",
  "shelley",
  "eddy",
  "ava",
  "aria",
  "jenny",
  "neerja",
  "sonia",
  "samantha",
  "tessa",
  "moira",
  "serena",
  "zoe",
  "google uk english female",
  "google us english",
];

function voiceScore(voice: NovaVoiceCandidate): number {
  const name = voice.name.toLowerCase();
  const language = voice.lang.toLowerCase();
  let score = 0;

  const warmNameIndex = WARM_VOICE_NAMES.findIndex((candidate) => name.includes(candidate));
  if (warmNameIndex >= 0) score += 80 - warmNameIndex;
  if (name.includes("natural") || name.includes("neural")) score += 45;
  if (name.includes("premium") || name.includes("enhanced")) score += 35;
  if (name.includes("google") || name.includes("microsoft")) score += 18;
  if (language === "en-in") score += 15;
  else if (language === "en-gb" || language === "en-au") score += 12;
  else if (language.startsWith("en")) score += 10;
  if (voice.default) score += 3;
  if (name.includes("compact") || name.includes("espeak") || name.includes("eloquence")) score -= 60;

  return score;
}

export function rankNovaVoices<T extends NovaVoiceCandidate>(voices: readonly T[]): T[] {
  return voices
    .filter((voice) => voice.lang.toLowerCase().startsWith("en"))
    .map((voice, index) => ({ voice, index, score: voiceScore(voice) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ voice }) => voice);
}

export function novaVoiceDelivery(tone: NovaVoiceTone): { rate: number; pitch: number; volume: number } {
  if (tone === "alert") return { rate: 0.88, pitch: 1.04, volume: 0.94 };
  if (tone === "retry") return { rate: 0.8, pitch: 1.03, volume: 0.88 };
  if (tone === "success") return { rate: 0.87, pitch: 1.11, volume: 0.93 };
  if (tone === "celebrate") return { rate: 0.91, pitch: 1.15, volume: 0.95 };
  return { rate: 0.82, pitch: 1.07, volume: 0.9 };
}

export function prepareNovaSpeech(text: string): string {
  return text
    .replaceAll("—", ", ")
    .replaceAll("−", " minus ")
    .replace(/\+(\d+)/g, " plus $1")
    .replace(/\s+/g, " ")
    .trim();
}
