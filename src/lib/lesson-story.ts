import type { Question } from "./learning";

export type LessonStory = {
  learningObjective: string;
  chapterTitle: string;
  chapterDialogue: string;
  chapterAction: string;
  coachLine: string;
  completeLabel: string;
  outcomeTitle: string;
  outcomeDetail: string;
  outcomeIcon: string;
  videoCue: string;
  reelFrames: [string, string, string, string];
  videoAsset?: { src: string; transcript: string; durationSeconds: number };
};

const byQuestionId: Record<string, Partial<LessonStory>> = {
  "g4-1": {
    learningObjective: "A fraction names equal parts of one clear whole.",
    chapterTitle: "One moon-fruit. Two hungry friends.",
    chapterDialogue: "\"{hero}, Mira and I found ONE moon-fruit. We both want it. Split it fairly?\"",
    coachLine: "\"Which way gives us both the SAME size piece?\"",
    completeLabel: "FAIR SHARE MADE!",
    outcomeTitle: "Half for Nova, half for Mira.",
    outcomeDetail: "\"One whole, two equal pieces. My piece is one-half: 1/2. Thanks, {hero}!\"",
    videoCue: "Moon-fruit glows, splits cleanly into two matching halves, and one half floats gently to Nova.",
  },
  "g4-2": {
    learningObjective: "Halves must be equal parts of the same whole.",
    chapterTitle: "The beacon spots an unfair share.",
    chapterDialogue: "\"Uh oh, {hero}. Some pieces LOOK like halves but aren't. Check them for me?\"",
    coachLine: "\"Fair means equal. Are these pieces really equal?\"",
    completeLabel: "FAIR CATCH!",
    outcomeTitle: "You caught the unfair pieces.",
    outcomeDetail: "\"A half is one of two EQUAL parts. Uneven pieces can't be halves. You spotted it!\"",
    videoCue: "Uneven panels flicker softly; two matching panels lock into place and send a warm beam to the beacon.",
  },
  "g4-3": {
    learningObjective: "Equivalent fractions can name the same amount.",
    chapterTitle: "One-half wears a disguise.",
    chapterDialogue: "\"{hero}, the bridge has FOUR panels now. Can one-half still fit? I'm confused!\"",
    coachLine: "\"Count the glowing panels. Then count them all.\"",
    completeLabel: "DISGUISE SPOTTED!",
    outcomeTitle: "2/4 was one-half all along.",
    outcomeDetail: "\"Two of four equal panels is the SAME amount as one-half! Sneaky fraction!\"",
    videoCue: "Two of four panels brighten in sequence; the bridge glow joins into one half-width beam.",
  },
};

function defaultStory(question: Question): LessonStory {
  if (question.visual === "fraction") {
    return {
      learningObjective: "Fractions describe equal parts of a whole.",
      chapterTitle: "The beacon door is stuck.",
      chapterDialogue: "\"{hero}, this door only opens for equal pieces. Find them with me?\"",
      chapterAction: "Open the door with Nova",
      coachLine: "\"Look for pieces that match exactly.\"",
      completeLabel: "DOOR OPENED!",
      outcomeTitle: "The door swings open.",
      outcomeDetail: "\"Equal pieces! That was the secret. Nice one, {hero}!\"",
      outcomeIcon: "◐",
      videoCue: "Equal glowing pieces join into a balanced beam of starlight.",
      reelFrames: ["Nova finds pieces that look equal.", "The equal pieces fit together as one whole.", "Unequal pieces never fit.", "Your turn: find the equal pieces."],
    };
  }
  if (question.visual === "number-line") {
    return {
      learningObjective: "Number position and distance can be reasoned about on a path.",
      chapterTitle: "Nova is lost in the mist.",
      chapterDialogue: "\"{hero}, I can see the end of the trail but not the steps! Walk it with me?\"",
      chapterAction: "Step onto the trail",
      coachLine: "\"One step at a time. Which way are we going?\"",
      completeLabel: "TRAIL FOUND!",
      outcomeTitle: "The mist clears ahead.",
      outcomeDetail: "\"I can see every step now. You counted us home, {hero}!\"",
      outcomeIcon: "⟶",
      videoCue: "A sequence of stepping stones lights from the starting point to the chosen marker.",
      reelFrames: ["Nova marks the starting stone.", "Each step moves one place along the trail.", "Direction matters: left or right?", "Your turn: take the next step."],
    };
  }
  if (question.visual === "formula") {
    return {
      learningObjective: "A mathematical rule can be followed one visible step at a time.",
      chapterTitle: "The star machine ate Nova's snack.",
      chapterDialogue: "\"{hero}! This machine follows ONE rule. Crack it and it gives my snack back!\"",
      chapterAction: "Inspect the machine",
      coachLine: "\"Change one thing at a time. Watch what happens.\"",
      completeLabel: "MACHINE CRACKED!",
      outcomeTitle: "The machine gives up the snack.",
      outcomeDetail: "\"You followed the rule step by step and beat the machine, {hero}!\"",
      outcomeIcon: "ƒ",
      videoCue: "A clear formula assembles from glowing symbols; each operation lights in sequence until the route resolves.",
      reelFrames: ["Nova feeds the machine a number.", "The rule changes it one step at a time.", "Undo the steps to find the secret.", "Your turn: crack the rule."],
    };
  }
  if (question.visual === "coordinate") {
    return {
      learningObjective: "Position, structure, and evidence can be read from a mathematical model.",
      chapterTitle: "The star map holds a secret.",
      chapterDialogue: "\"{hero}, this map knows where to go — if we read it right. Help me look?\"",
      chapterAction: "Open the star map",
      coachLine: "\"Don't guess. The map already tells us.\"",
      completeLabel: "SECRET READ!",
      outcomeTitle: "The map gives up its secret.",
      outcomeDetail: "\"You read it instead of guessing. That's real explorer thinking, {hero}!\"",
      outcomeIcon: "⌁",
      videoCue: "A coordinate grid and its signal points illuminate one by one, revealing a clean route across the map.",
      reelFrames: ["Nova unrolls the star map.", "Every point sits in its own spot.", "The pattern points the way.", "Your turn: read the map."],
    };
  }
  if (question.visual === "ecosystem") {
    return {
      learningObjective: "Careful observation helps us understand living things, materials, and environmental change.",
      chapterTitle: "Something changed in the garden.",
      chapterDialogue: "\"{hero}, my garden looks different today. Look closely with me — what changed?\"",
      chapterAction: "Look closely with Nova",
      coachLine: "\"Look first. Then say what the clues mean.\"",
      completeLabel: "GARDEN HELPED!",
      outcomeTitle: "The garden perks up.",
      outcomeDetail: "\"You looked carefully and found what it needed. The garden says thanks, {hero}!\"",
      outcomeIcon: "🌿",
      videoCue: "A small habitat wakes gently: sunlight, water, a plant, and an animal appear as the field note records the observation.",
      reelFrames: ["Nova checks the garden every day.", "One small change affects everything.", "Clues first, answers second.", "Your turn: read the clues."],
    };
  }
  if (question.visual === "reading") {
    return {
      learningObjective: "Readers use exact details, vocabulary, and structure to make meaning from a text.",
      chapterTitle: "The storybook is hiding something.",
      chapterDialogue: "\"{hero}, the answer is hiding IN the story. Read it with me and catch it?\"",
      chapterAction: "Open the storybook",
      coachLine: "\"The exact words are the clues.\"",
      completeLabel: "CLUE CAUGHT!",
      outcomeTitle: "The hidden clue jumps out.",
      outcomeDetail: "\"The words told us everything. You're a sharp reader, {hero}!\"",
      outcomeIcon: "📚",
      videoCue: "A storybook opens; key words glow gently and connect into a small illustrated scene as the page turns.",
      reelFrames: ["Nova opens the page.", "Some words glow — they matter most.", "Connect the words to catch the meaning.", "Your turn: catch the clue."],
    };
  }
  if (question.visual === "map") {
    return {
      learningObjective: "Maps, shared spaces, and everyday choices help us understand how communities work together.",
      chapterTitle: "Nova can't find the way to the park.",
      chapterDialogue: "\"{hero}, everyone's waiting at the park and I'm LOST. Read the map with me?\"",
      chapterAction: "Unfold the map",
      coachLine: "\"Compass first. Then the symbols.\"",
      completeLabel: "WAY FOUND!",
      outcomeTitle: "Nova makes it to the park.",
      outcomeDetail: "\"The compass and the symbols got us there. Everyone cheered for you, {hero}!\"",
      outcomeIcon: "🧭",
      videoCue: "A hand-drawn map unfolds; a compass turns north and gentle route markers connect homes, parks, and shared places.",
      reelFrames: ["Nova unfolds the map.", "The compass shows the directions.", "The symbols show what's where.", "Your turn: find the way."],
    };
  }
  return {
    learningObjective: "Matching groups preserve a proportional relationship.",
    chapterTitle: "The picnic doesn't have enough packs.",
    chapterDialogue: "\"{hero}, more friends came to the picnic! Help me make matching packs for everyone?\"",
    chapterAction: "Open the picnic basket",
    coachLine: "\"When one group grows, its partner grows the same way.\"",
    completeLabel: "PICNIC SAVED!",
    outcomeTitle: "Every friend gets a matching pack.",
    outcomeDetail: "\"Every pack matches! Nobody left out. Best picnic ever, {hero}!\"",
    outcomeIcon: "✦",
    videoCue: "Supply groups multiply together and settle into balanced packs on the bridge.",
    reelFrames: ["Nova counts the friends.", "Each pack must match the others.", "Grow the groups together.", "Your turn: make them match."],
  };
}

export function getLessonStory(question: Question): LessonStory {
  const defaults = defaultStory(question);
  return { ...defaults, ...byQuestionId[question.id] };
}
