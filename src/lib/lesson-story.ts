import type { Question } from "./learning";

export type LessonStory = {
  learningObjective: string;
  chapterTitle: string;
  chapterDialogue: string;
  chapterAction: string;
  coachLine: string;
  outcomeTitle: string;
  outcomeDetail: string;
  outcomeIcon: string;
  videoCue: string;
};

const byQuestionId: Record<string, Partial<LessonStory>> = {
  "g4-1": {
    learningObjective: "A fraction names equal parts of one clear whole.",
    chapterTitle: "One moon-fruit needs a fair share.",
    chapterDialogue: "Nova remembers the rule from the bridge: begin with one whole, then split it into equal parts for each explorer.",
    coachLine: "“Let’s look for the one whole and its equal shares.”",
    outcomeTitle: "Nova received a fair half.",
    outcomeDetail: "The moon-fruit was one whole. Sharing it equally made two equal parts.",
    videoCue: "Moon-fruit glows, splits cleanly into two matching halves, and one half floats gently to Nova.",
  },
  "g4-2": {
    learningObjective: "Halves must be equal parts of the same whole.",
    chapterTitle: "The beacon checks whether a share is fair.",
    chapterDialogue: "Some glowing panels look almost the same, but the beacon only accepts equal parts. Nova needs your careful eyes.",
    coachLine: "“Fair shares are equal shares.”",
    outcomeTitle: "The beacon recognised the fair share.",
    outcomeDetail: "A half is one of two equal parts. Two uneven pieces do not make fair halves.",
    videoCue: "Uneven panels flicker softly; two matching panels lock into place and send a warm beam to the beacon.",
  },
  "g4-3": {
    learningObjective: "Equivalent fractions can name the same amount.",
    chapterTitle: "The bridge remembers another name for one-half.",
    chapterDialogue: "The bridge has four equal panels. Nova wonders whether two glowing panels can still make the same half you already know.",
    coachLine: "“Count the glowing equal panels and the whole set.”",
    outcomeTitle: "The bridge found the same half again.",
    outcomeDetail: "Two of four equal panels, 2/4, covers the same amount as one half, 1/2.",
    videoCue: "Two of four panels brighten in sequence; the bridge glow joins into one half-width beam.",
  },
};

function defaultStory(question: Question): LessonStory {
  if (question.visual === "fraction") {
    return {
      learningObjective: "Fractions describe equal parts of a whole.",
      chapterTitle: "The beacon doors need equal light.",
      chapterDialogue: "Nova found an energy pattern that only works when equal pieces are noticed carefully.",
      chapterAction: "Step into the energy chamber",
      coachLine: "“The beacon responds when equal pieces fit together.”",
      outcomeTitle: "The beacon doors glow in balance.",
      outcomeDetail: "The bridge has found its equal share of energy.",
      outcomeIcon: "◐",
      videoCue: "Equal glowing pieces join into a balanced beam of starlight.",
    };
  }
  if (question.visual === "number-line") {
    return {
      learningObjective: "Number position and distance can be reasoned about on a path.",
      chapterTitle: "The mist trail has lost its markers.",
      chapterDialogue: "Nova can see the destination, but not the path. Trace the steps carefully before choosing where to go.",
      chapterAction: "Follow the glowing trail",
      coachLine: "“Let’s trace the path before we decide.”",
      outcomeTitle: "The mist trail lights up ahead.",
      outcomeDetail: "Nova can see exactly where the next step belongs.",
      outcomeIcon: "⟶",
      videoCue: "A sequence of stepping stones lights from the starting point to the chosen marker.",
    };
  }
  return {
    learningObjective: "Matching groups preserve a proportional relationship.",
    chapterTitle: "The starlight bridge needs matching supplies.",
    chapterDialogue: "Every explorer needs a fair share. Help Nova build equal groups so the bridge can hold everyone.",
    chapterAction: "Open the supply satchel",
    coachLine: "“Let’s build equal groups, then see what changes.”",
    outcomeTitle: "The bridge supplies click into place.",
    outcomeDetail: "Every explorer has the matching amount they need.",
    outcomeIcon: "✦",
    videoCue: "Supply groups multiply together and settle into balanced packs on the bridge.",
  };
}

export function getLessonStory(question: Question): LessonStory {
  const defaults = defaultStory(question);
  return { ...defaults, ...byQuestionId[question.id] };
}
