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

export const grade5ScienceQuestArc: Question[] = [
  item("s5-1", "Which part of a plant takes in water from the soil?", ["Roots", "Flowers", "Leaves"], "Roots", "Think about the part below the ground.", "Roots absorb water and minerals from the soil."),
  item("s5-2", "Water vapour cools and forms tiny drops in clouds. What is this called?", ["Condensation", "Melting", "Freezing"], "Condensation", "A gas cools and changes back into a liquid.", "Condensation is when water vapour cools into tiny liquid water drops."),
  item("s5-3", "Which action can help prevent the spread of many germs?", ["Washing hands with soap", "Sharing an unwashed bottle", "Sneezing into the air"], "Washing hands with soap", "Germs can move from hands to food, faces, and other people.", "Washing hands with soap removes many germs and helps reduce their spread."),
  item("s5-4", "A toy car slows down when it rolls across a rough carpet. Which force causes this?", ["Friction", "Magnetism", "Gravity disappearing"], "Friction", "A rough surface resists movement between touching objects.", "Friction between the carpet and wheels slows the car down."),
  item("s5-5", "Which material is most suitable for a raincoat?", ["Waterproof fabric", "Tissue paper", "Cotton wool"], "Waterproof fabric", "A raincoat should stop water passing through.", "Waterproof fabric resists water, helping keep the wearer dry."),
  item("s5-6", "Why should a forest habitat be protected?", ["Many plants and animals depend on it", "It makes every day colder", "It stops all rivers"], "Many plants and animals depend on it", "A habitat provides food, shelter, and space for living things.", "Forests support many living things and help keep ecosystems healthy."),
];

export const grade6ScienceQuestArc: Question[] = [
  item("s6-1", "Which nutrient mainly helps the body build and repair tissues?", ["Protein", "Water", "Fibre only"], "Protein", "Think about the nutrient linked with growth and repair.", "Protein helps the body grow and repair tissues."),
  item("s6-2", "Which method separates sand from water?", ["Filtration", "Melting", "Magnetising the water"], "Filtration", "A filter lets liquid pass while trapping insoluble solid particles.", "Filtration separates insoluble sand from water."),
  item("s6-3", "Which is a reversible change?", ["Melting ice", "Burning paper", "Cooking rice"], "Melting ice", "Ask whether the original material can be made again easily.", "Melted ice can freeze back into ice, so this change is reversible."),
  item("s6-4", "A cyclist travels 24 km in 3 hours. What is the average speed?", ["8 km/h", "21 km/h", "72 km/h"], "8 km/h", "Speed = distance ÷ time.", "24 ÷ 3 = 8, so the average speed is 8 km/h."),
  item("s6-5", "Why is a shadow formed?", ["An opaque object blocks light", "Light becomes heavier", "Air turns black"], "An opaque object blocks light", "Think about what happens when light cannot pass through an object.", "A shadow forms where an opaque object blocks light from reaching a surface."),
  item("s6-6", "Why are decomposers important in an ecosystem?", ["They break down dead material and return nutrients", "They make all animals larger", "They stop plants using sunlight"], "They break down dead material and return nutrients", "Dead material does not disappear; think about what recycles it.", "Decomposers recycle nutrients by breaking down dead plants and animals."),
];

export const grade7ScienceQuestArc: Question[] = [
  item("s7-1", "Which process lets green plants make food using sunlight?", ["Photosynthesis", "Respiration only", "Filtration"], "Photosynthesis", "Think about the plant process that uses sunlight, water, and carbon dioxide.", "Photosynthesis is the process by which green plants use sunlight to make food."),
  item("s7-2", "Heat moves from a hotter cup of tea to a cooler spoon mainly by what?", ["Conduction", "Evaporation only", "Digestion"], "Conduction", "The spoon is touching the hot tea.", "Conduction transfers heat through direct contact between the tea and spoon."),
  item("s7-3", "Why is a balanced diet important?", ["It provides different nutrients the body needs", "It contains only sugar", "It removes the need for water"], "It provides different nutrients the body needs", "Different body functions need different nutrients.", "A balanced diet provides a range of nutrients for energy, growth, repair, and health."),
  item("s7-4", "In a food web, what may happen if many insects disappear?", ["Animals that eat insects may have less food", "Every animal gets more food", "Plants stop needing sunlight"], "Animals that eat insects may have less food", "Food webs connect feeding relationships.", "If insects decline, animals that depend on them for food may be affected."),
  item("s7-5", "Which mixture can be separated using evaporation?", ["Salt dissolved in water", "Iron pins and sand", "Large stones and leaves"], "Salt dissolved in water", "The water can leave as vapour, but the dissolved solid remains.", "Evaporation removes water and leaves the dissolved salt behind."),
  item("s7-6", "Why should antibiotics not be used for a common viral cold without medical advice?", ["Antibiotics do not treat viruses", "They turn viruses into plants", "They replace sleep"], "Antibiotics do not treat viruses", "Antibiotics target bacteria, not viruses.", "A cold is usually caused by a virus, so antibiotics will not treat it."),
];

export function getScienceQuestsForGrade(grade: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): Question[] {
  return grade === 4 ? grade4ScienceQuestArc : grade === 5 ? grade5ScienceQuestArc : grade === 6 ? grade6ScienceQuestArc : grade === 7 ? grade7ScienceQuestArc : [];
}
