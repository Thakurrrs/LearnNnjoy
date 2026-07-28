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

export function recoveryPrompt(visual: Question["visual"]): string {
  if (visual === "fraction") return "Let's make equal pieces first. Count the pieces we're using. Then we compare them with the whole.";
  if (visual === "number-line") return "Stand with me on the starting number. We'll take one small step at a time. Watch which way we're going.";
  if (visual === "formula") return "I'll hold the rule where we can see it. Change one thing at a time. We'll check what stays balanced.";
  if (visual === "coordinate") return "Let's read the picture together first. Look for position and pattern. Then we choose.";
  if (visual === "ecosystem") return "Let's peek at the habitat clue again. What does the living thing need? What changed in its world?";
  if (visual === "reading") return "Let's go back to the exact words. What do those details tell us together?";
  if (visual === "map") return "We'll use one clue at a time. Compass, symbols, then people. What is the map showing us?";
  return "Let's build one equal group first. When it changes, its matching group changes the same way.";
}
