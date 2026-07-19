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

export function getEnglishQuestsForGrade(grade: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): Question[] {
  return grade === 4 ? grade4EnglishQuestArc : [];
}
