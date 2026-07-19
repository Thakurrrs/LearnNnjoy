import type { Question } from "./learning";

const item = (id: string, prompt: string, choices: string[], answer: string, hint: string, explanation: string): Question => ({ id, prompt, choices, answer, hint, explanation, visual: "ecosystem", skill: "science-inquiry" });

export const grade4ScienceQuestArc: Question[] = [
  item("s4-1", "A plant is kept in sunlight but receives no water. What does it still need to grow well?", ["Water", "Only a larger pot", "A louder sound"], "Water", "Think about the basic needs of a living plant.", "Plants need water as well as light, air, and suitable conditions to grow."),
  item("s4-2", "In a simple food chain: grass → rabbit → fox, what does the rabbit eat?", ["Grass", "Fox", "Sunlight only"], "Grass", "Follow the arrow from the food to the animal that eats it.", "The rabbit eats grass; the fox can then eat the rabbit."),
  item("s4-3", "Wet clothes become dry in the sun because liquid water changes into what?", ["Water vapour", "Soil", "Ice"], "Water vapour", "Heat can change liquid water into a gas that mixes with air.", "Sunlight gives water energy to evaporate into water vapour."),
  item("s4-4", "Which animal is best adapted to a hot, dry desert?", ["Camel", "Polar bear", "Frog"], "Camel", "Think about which animal can manage heat and very little water.", "Camels have features that help them live in hot, dry deserts."),
  item("s4-5", "Which material would soak up a spill best?", ["Cotton cloth", "Glass sheet", "Steel spoon"], "Cotton cloth", "Choose a material with tiny spaces that can hold water.", "Cotton cloth is absorbent, so it can take in the spilled water."),
  item("s4-6", "Why is it important not to pour waste into a pond?", ["It can harm plants and animals living there", "It makes the pond grow taller", "It turns water into sunlight"], "It can harm plants and animals living there", "A pond is a habitat shared by many living things.", "Waste can pollute water and harm the plants, animals, and people who depend on it."),
];

export function getScienceQuestsForGrade(grade: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): Question[] {
  return grade === 4 ? grade4ScienceQuestArc : [];
}
