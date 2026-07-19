import type { Question } from "./learning";

export type AdaptiveSignal = {
  wrongAttempts: number;
  hintUsed: boolean;
  recentAccuracy: number;
};

export type AdaptiveNextStep = {
  mode: "rebuild" | "steady" | "stretch";
  title: string;
  message: string;
};

// This is deliberately explainable: a child or guardian can always see why
// the next activity became more visual, stayed steady, or offered a stretch.
export function chooseAdaptiveNextStep(question: Question, signal: AdaptiveSignal): AdaptiveNextStep {
  if (signal.wrongAttempts >= 2 || signal.recentAccuracy < 0.45) {
    return { mode: "rebuild", title: "Next: rebuild the idea gently", message: `Nova will begin the next ${question.skill.replace("-", " ")} step with a visual clue and one smaller move.` };
  }
  if (signal.hintUsed || signal.recentAccuracy < 0.75) {
    return { mode: "steady", title: "Next: keep the support nearby", message: "The next discovery stays at a comfortable level, with Nova’s clue ready whenever it helps." };
  }
  return { mode: "stretch", title: "Next: try one thoughtful stretch", message: "You can choose an optional explain-why prompt after the next discovery. It never changes your reward." };
}
