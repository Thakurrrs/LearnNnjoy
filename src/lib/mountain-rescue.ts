import type { MountainState } from "@/lib/grade-seven-progress";

export const MOUNTAIN_TOP = 8;
export const MOUNTAIN_BOTTOM = -8;
export const MOUNTAIN_START = 3;
export const MOUNTAIN_BEACON = -4;
export const MOUNTAIN_SAFE_LEDGE = 2;

export const mountainBriefing = [
  "The gold camp line is zero—our reference point.",
  "One level above zero is plus one.",
  "Cross zero and the counting keeps going.",
  "One level below zero is minus one.",
] as const;

export function formatAltitude(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export function appendAltitudeTrail(path: readonly number[], from: number, to: number): number[] {
  if (from === to) return [...path];
  const direction = to > from ? 1 : -1;
  const crossed = Array.from({ length: Math.abs(to - from) }, (_, index) => from + (index + 1) * direction);
  return [...path, ...crossed].slice(-40);
}

export function clampAltitude(value: number): number {
  return Math.max(MOUNTAIN_BOTTOM, Math.min(MOUNTAIN_TOP, Math.round(value)));
}

export function altitudeFromPointer(clientY: number, top: number, height: number): number {
  if (height <= 0) return MOUNTAIN_START;
  const ratio = Math.max(0, Math.min(1, (clientY - top) / height));
  return clampAltitude(MOUNTAIN_TOP - ratio * (MOUNTAIN_TOP - MOUNTAIN_BOTTOM));
}

export function mountainDisplayPosition(state: MountainState): number {
  if (state.step === 0) return MOUNTAIN_START;
  if (state.step === 1 && state.showDemo) return [0, 1, 0, -1][state.briefingBeat] ?? 0;
  if (state.step === 1) return state.position;
  if (state.step === 4) return state.returnPosition;
  if (state.step === 5) return MOUNTAIN_SAFE_LEDGE;
  return MOUNTAIN_BEACON;
}

export function mountainNarration(state: MountainState, heroName: string): string {
  if (state.step === 0) {
    return `${heroName}, the rescue pod is holding at plus three. A storm has hidden its landing signal below base camp.`;
  }
  if (state.step === 1 && state.showDemo) return mountainBriefing[state.briefingBeat];
  if (state.step === 1) {
    if (state.position === MOUNTAIN_BEACON) return "Signal found at minus four. You moved seven levels down from plus three.";
    if (state.position === 0) return "Base camp is zero. Keep moving down and the numbers become negative.";
    if (state.position > 0) return `The pod is ${state.position} levels above zero, at plus ${state.position}.`;
    return `The pod is ${Math.abs(state.position)} levels below zero, at minus ${Math.abs(state.position)}.`;
  }
  if (state.step === 2) return "The minus sign tells the rescue team that the beacon is below base camp.";
  if (state.step === 3) return "The logbook records the fall as three minus seven equals minus four.";
  if (state.step === 4) {
    if (state.returnPosition === MOUNTAIN_SAFE_LEDGE) return "The winch climbed six levels from minus four to plus two. The pod is safe.";
    return "Now lift the pod six levels, from minus four to the safe ledge at plus two.";
  }
  return `Rescue complete. You used zero, negative positions, subtraction, and addition to save the pod, ${heroName}.`;
}
