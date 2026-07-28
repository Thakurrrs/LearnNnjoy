export type Cosmetic = { id: string; label: string; emoji: string; cost: number; detail: string };

export const cosmetics: readonly Cosmetic[] = [
  { id: "trailblazer", label: "Trailblazer pack", emoji: "🎒", cost: 0, detail: "Your first expedition companion." },
  { id: "aurora", label: "Aurora cape", emoji: "🧥", cost: 50, detail: "A warm glow for brave problem-solvers." },
  { id: "starglow", label: "Starglow companion", emoji: "🌟", cost: 75, detail: "A tiny light for the next trail." },
  { id: "compass-charm", label: "Compass charm", emoji: "🧭", cost: 40, detail: "Always points to the next discovery." },
  { id: "skate-deck", label: "Sky-skate deck", emoji: "🛹", cost: 60, detail: "For carving safe 60° turns across Lumina." },
  { id: "cricket-cap", label: "Data-room cap", emoji: "🧢", cost: 60, detail: "Worn by evidence-based squad pickers." },
];

export function getCosmetic(id: string): Cosmetic {
  return cosmetics.find((item) => item.id === id) ?? cosmetics[0];
}
