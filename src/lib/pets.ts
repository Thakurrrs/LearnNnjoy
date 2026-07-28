import { getExplorerLevel } from "./levels";

export type PetId = "dolphin" | "bunny" | "fox" | "turtle" | "dragon";
export type Pet = { id: PetId; name: string; species: string; emoji: string; stageLines: [string, string, string, string] };

export const PET_CHOICE_LEVEL = 2;
export const PET_STAGE_LEVELS = [2, 4, 7, 10];
export const PET_STAGE_TITLES = ["Hatchling", "Explorer", "Voyager", "Radiant"];

export const pets: readonly Pet[] = [
  { id: "dolphin", name: "Splash", species: "star-dolphin", emoji: "🐬", stageLines: ["Splash hatched — and splashed starlight everywhere!", "Splash can ride the little star-waves now!", "Splash learned to leap right through starlight!", "Splash glows — every wave turns to aurora!"] },
  { id: "bunny", name: "Comet", species: "star-bunny", emoji: "🐰", stageLines: ["Comet hatched with a sneeze of stardust!", "Comet hops higher than your head now!", "Comet can bounce across whole clouds!", "Comet leaves a trail of tiny comets!"] },
  { id: "fox", name: "Pip", species: "moon-fox", emoji: "🦊", stageLines: ["Pip hatched — and hid inside your hood!", "Pip's tail glows like a little moon!", "Pip can sniff out hidden star-paths!", "Pip's fur shimmers with moonlight!"] },
  { id: "turtle", name: "Drift", species: "cloud-turtle", emoji: "🐢", stageLines: ["Drift hatched, slow and smiley!", "Drift's shell grew a tiny cloud!", "Drift can float you over star-rivers!", "Drift's shell holds a whole sky now!"] },
  { id: "dragon", name: "Ember", species: "comet-dragon", emoji: "🐉", stageLines: ["Ember hatched with one warm little spark!", "Ember's wings finally caught the wind!", "Ember breathes comet-sparkles now!", "Ember can light the whole night sky!"] },
];

export function getPet(id: string | null): Pet | null {
  return pets.find((pet) => pet.id === id) ?? null;
}

export function getPetStage(level: number): number {
  let stage = 0;
  for (let i = 0; i < PET_STAGE_LEVELS.length; i++) {
    if (level >= PET_STAGE_LEVELS[i]) stage = i + 1;
  }
  return stage;
}

export function petMoment(prevDiscoveries: number, nextDiscoveries: number, petId: string | null): string | null {
  const before = getExplorerLevel(prevDiscoveries).level;
  const after = getExplorerLevel(nextDiscoveries).level;
  if (after === before) return null;
  if (petId === null) {
    return before < PET_CHOICE_LEVEL && after >= PET_CHOICE_LEVEL ? "A star-egg is ready to hatch! Visit your world to meet your new friend." : null;
  }
  const stageBefore = getPetStage(before);
  const stageAfter = getPetStage(after);
  if (stageAfter > stageBefore) {
    const pet = getPet(petId);
    if (pet) return pet.stageLines[stageAfter - 1];
  }
  return null;
}
