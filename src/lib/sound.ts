export type SoundName = "tap" | "success" | "coin" | "finale";
type MiniStorage = Pick<Storage, "getItem" | "setItem">;

const MUTE_KEY = "learnnjoy-muted";

export function createSoundController(storage?: MiniStorage) {
  let muted = storage?.getItem(MUTE_KEY) === "1";
  let ctx: AudioContext | null = null;

  function ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = ctx ?? new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  function tone(freq: number, start: number, duration: number, peak: number) {
    const audio = ensureContext();
    if (!audio) return;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(peak, audio.currentTime + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(audio.currentTime + start);
    osc.stop(audio.currentTime + start + duration + 0.05);
  }

  const patterns: Record<SoundName, () => void> = {
    tap: () => tone(520, 0, 0.08, 0.1),
    success: () => { tone(523, 0, 0.12, 0.16); tone(659, 0.1, 0.12, 0.16); tone(784, 0.2, 0.22, 0.16); },
    coin: () => { tone(988, 0, 0.07, 0.14); tone(1319, 0.07, 0.18, 0.14); },
    finale: () => { [523, 659, 784, 1047, 1319].forEach((freq, i) => tone(freq, i * 0.09, 0.26, 0.15)); },
  };

  return {
    isMuted: () => muted,
    toggleMuted: () => {
      muted = !muted;
      storage?.setItem(MUTE_KEY, muted ? "1" : "0");
      return muted;
    },
    play: (name: SoundName) => {
      if (!muted) patterns[name]();
    },
  };
}

export const sound = createSoundController(typeof window === "undefined" ? undefined : window.localStorage);
