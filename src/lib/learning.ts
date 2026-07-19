export type Grade = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type VisualKind = "fraction" | "number-line" | "ratio" | "formula" | "coordinate" | "ecosystem" | "reading";

export type Question = {
  id: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
  explanation: string;
  visual: VisualKind;
  skill: "fractions" | "number-sense" | "proportion" | "algebra" | "geometry" | "data" | "science-inquiry" | "language";
};

export type CurriculumSkill = {
  id: Question["skill"];
  label: string;
  grades: Grade[];
  prerequisite?: Question["skill"];
};

export const numberSenseSkills: CurriculumSkill[] = [
  { id: "number-sense", label: "Number sense", grades: [4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: "fractions", label: "Fractions as equal parts", grades: [4, 5, 6, 7], prerequisite: "number-sense" },
  { id: "proportion", label: "Proportional reasoning", grades: [6, 7, 8, 9, 10, 11, 12], prerequisite: "fractions" },
  { id: "algebra", label: "Algebraic reasoning", grades: [7, 8, 9, 10, 11, 12], prerequisite: "number-sense" },
  { id: "geometry", label: "Spatial and coordinate reasoning", grades: [8, 9, 10, 11, 12], prerequisite: "number-sense" },
  { id: "data", label: "Data and probability", grades: [8, 9, 10, 11, 12], prerequisite: "number-sense" },
];

export const diagnostic: Question[] = [
  { id: "d1", prompt: "Which picture shows one half?", choices: ["1 of 4 parts", "2 of 4 parts", "3 of 4 parts"], answer: "2 of 4 parts", hint: "A half means two equal groups.", explanation: "Two of four equal parts is the same as one half.", visual: "fraction", skill: "fractions" },
  { id: "d2", prompt: "A bottle holds 1 litre. How much do two bottles hold?", choices: ["1 litre", "2 litres", "3 litres"], answer: "2 litres", hint: "Try adding one litre two times.", explanation: "One litre + one litre = two litres.", visual: "number-line", skill: "number-sense" },
  { id: "d3", prompt: "Which fraction is greater?", choices: ["1/2", "1/4", "They are equal"], answer: "1/2", hint: "Imagine the same pizza split into different numbers of equal slices.", explanation: "When the whole is the same, one half is larger than one quarter.", visual: "fraction", skill: "fractions" },
];

export const quests: Question[] = [
  { id: "q1", prompt: "Mira shares a pizza equally with one friend. What fraction of the pizza does each person get?", choices: ["1/2", "1/3", "2/3"], answer: "1/2", hint: "There are two people and one equal whole.", explanation: "Two people share one whole equally, so each person has one of two equal parts: 1/2.", visual: "fraction", skill: "fractions" },
  { id: "q2", prompt: "A trail is 12 km long. You have walked 6 km. What part of the trail is complete?", choices: ["1/4", "1/2", "3/4"], answer: "1/2", hint: "Compare the distance walked with the whole trail.", explanation: "6 is half of 12, so half of the trail is complete.", visual: "number-line", skill: "number-sense" },
  { id: "q3", prompt: "A recipe needs 2 cups of flour for 4 people. How many cups are needed for 8 people?", choices: ["2 cups", "3 cups", "4 cups"], answer: "4 cups", hint: "The number of people doubles. What happens to the flour?", explanation: "If every person gets the same amount, doubling 4 people to 8 doubles 2 cups to 4 cups.", visual: "ratio", skill: "proportion" },
];

export type LearningTrail = {
  id: "visual" | "guided" | "stretch";
  label: string;
  message: string;
  support: string;
};

export function chooseLearningTrail(diagnosticCorrect: number): LearningTrail {
  if (diagnosticCorrect <= 1) return { id: "visual", label: "Visual Trail", message: "We will begin with pictures, touchable models, and one idea at a time.", support: "Nova will offer the first clue before you need to ask." };
  if (diagnosticCorrect === 2) return { id: "guided", label: "Explorer Trail", message: "You are ready to connect pictures to number ideas, with Nova nearby when needed.", support: "Use a clue whenever you want one—there is no penalty." };
  return { id: "stretch", label: "Pathfinder Trail", message: "You have a strong starting signal. Try explaining why your idea works as you explore.", support: "The main quest stays calm; optional stretch thinking appears after a success." };
}

export function recommendNextSkill(correctAnswers: number, attempts: number): string {
  if (correctAnswers === 0 || attempts > correctAnswers * 2) return "Take a visual fraction refresher next.";
  if (correctAnswers < 2) return "Try another number-line mission next.";
  return "You are ready for the next proportional reasoning mission.";
}
