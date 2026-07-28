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
    return { mode: "rebuild", title: "Let's look again together", message: `Nova: "Picture first, answer second. Slow is smart."` };
  }
  if (signal.hintUsed || signal.recentAccuracy < 0.75) {
    return { mode: "steady", title: "Right on track", message: `Nova: "Nice pace! Let's keep exploring together."` };
  }
  return { mode: "stretch", title: "Bonus star ahead", message: `Nova: "Want to tell me WHY it works? Only if you like!"` };
}
