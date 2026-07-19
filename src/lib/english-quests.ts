import type { Question } from "./learning";

const item = (id: string, prompt: string, choices: string[], answer: string, hint: string, explanation: string): Question => ({ id, prompt, choices, answer, hint, explanation, visual: "reading", skill: "language" });

export const grade4EnglishQuestArc: Question[] = [
  item("e4-1", "A story says: ‘Mina clutched her umbrella as dark clouds gathered.’ What is Mina most likely expecting?", ["Rain", "A birthday cake", "A football match"], "Rain", "Use the umbrella and dark clouds as clues.", "An umbrella and gathering dark clouds suggest that Mina expects rain."),
  item("e4-2", "Which word is closest in meaning to ‘enormous’?", ["Tiny", "Huge", "Silent"], "Huge", "Think of something far bigger than usual.", "Enormous means very large, or huge."),
  item("e4-3", "Choose the sentence with the clearest full stop.", ["The owl flew across the sky.", "the owl flew across the sky", "The owl flew across the sky?"], "The owl flew across the sky.", "A complete statement begins with a capital letter and ends with a full stop.", "This is a statement, so it needs a capital letter and a full stop."),
  item("e4-4", "Ravi practised the flute every day. At the concert, he played confidently. Why did he play confidently?", ["He practised every day", "He lost his flute", "The concert was cancelled"], "He practised every day", "Look for the earlier detail that explains the later result.", "Regular practice helped Ravi feel confident at the concert."),
  item("e4-5", "Which describing word makes this sentence more vivid: ‘The ___ kite rose above the trees.’", ["colourful", "yesterday", "quickly"], "colourful", "A describing word tells us more about a noun.", "Colourful describes the kite, helping the reader picture it."),
  item("e4-6", "What is the best title for a paragraph about classmates collecting litter from a park?", ["A Cleaner Park", "The Sleeping Dragon", "How to Bake Bread"], "A Cleaner Park", "A title should tell readers the main idea.", "The paragraph is about caring for a park, so ‘A Cleaner Park’ fits its main idea."),
];

export const grade5EnglishQuestArc: Question[] = [
  item("e5-1", "The paragraph says: ‘The empty playground was quiet after the rain, but one puddle reflected a bright rainbow.’ What is the mood?", ["Peaceful", "Furious", "Noisy"], "Peaceful", "Notice words such as quiet and bright.", "The quiet playground and bright rainbow create a peaceful mood."),
  item("e5-2", "Which word is the best antonym for ‘ancient’?", ["Modern", "Old", "Historic"], "Modern", "An antonym has the opposite meaning.", "Modern means current or new, the opposite of ancient."),
  item("e5-3", "Which sentence uses a comma correctly?", ["After lunch, we planted seeds.", "After, lunch we planted seeds.", "After lunch we, planted seeds."], "After lunch, we planted seeds.", "A short opening phrase can be followed by a comma.", "The comma separates the opening phrase ‘After lunch’ from the rest of the sentence."),
  item("e5-4", "Leena packed an extra sandwich before the trip because she knew a classmate had forgotten theirs. What trait does this show?", ["Kindness", "Carelessness", "Impatience"], "Kindness", "Think about how Leena’s choice affects someone else.", "Packing extra food to help a classmate shows kindness."),
  item("e5-5", "Which connective best completes: ‘The path was muddy, ___ we wore boots.’", ["so", "but", "because"], "so", "The second idea is the result of the first idea.", "The path was muddy, so wearing boots was a sensible result."),
  item("e5-6", "Which opening is best for an informative paragraph about saving water?", ["Water is precious, and small daily choices can help us save it.", "Once there was a dragon with a tap.", "My favourite colour is blue."], "Water is precious, and small daily choices can help us save it.", "An informative opening should introduce the topic clearly.", "This sentence introduces saving water and gives the reader the main idea."),
];

export function getEnglishQuestsForGrade(grade: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): Question[] {
  return grade === 4 ? grade4EnglishQuestArc : grade === 5 ? grade5EnglishQuestArc : [];
}
