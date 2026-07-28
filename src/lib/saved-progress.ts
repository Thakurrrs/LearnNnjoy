import type { Grade } from "./learning";
import { readSubjectProgress, type ActiveSubject, type SubjectProgress } from "./subject-progress";
import {
  isGradeSevenAdventureId,
  sanitizeGradeSevenProgress,
  type GradeSevenAdventureId,
  type GradeSevenProgress,
} from "./grade-seven-progress";
import { avatars } from "./avatars";
import { pets } from "./pets";

export type Screen = "welcome" | "story" | "diagnostic" | "path" | "chapter" | "quest" | "outcome" | "world" | "map" | "adventures" | "activity" | "journal";

export type SavedProgress = {
  name: string;
  grade: Grade;
  screen: Screen;
  diagnosticIndex: number;
  diagnosticCorrect: number;
  storyBeat: number;
  storyCells: number[];
  fruitSplit: boolean;
  fruitShared: boolean;
  hintRequests: number;
  questIndex: number;
  coins: number;
  correct: number;
  attempts: number;
  ownedCosmetics: string[];
  equippedCosmetic: string;
  dailyStreak: number;
  lastCompletedDate: string | null;
  activeSubject: ActiveSubject;
  subjectProgress: SubjectProgress;
  nextSupportMode: "rebuild" | "steady" | "stretch";
  completedAdventures: GradeSevenAdventureId[];
  gradeSevenProgress: GradeSevenProgress;
  activeAdventure: GradeSevenAdventureId;
  avatar: string;
  pet: string | null;
  lifetimeDiscoveries: number;
};

export const LIFETIME_DISCOVERIES_CAP = 100000;

// Absent keys stay absent so the caller keeps its defaults; lifetimeDiscoveries
// is always present because old saves must be seeded from earned progress.
export type SanitizedProgress = Partial<SavedProgress> & { lifetimeDiscoveries: number };

export function sanitizeSavedProgress(saved: Partial<SavedProgress>): SanitizedProgress {
  const out: Partial<SavedProgress> = {};
  if (saved.name) out.name = saved.name;
  if (saved.grade && saved.grade >= 4 && saved.grade <= 12) out.grade = saved.grade as Grade;
  if (saved.activeSubject === "maths" || ((saved.activeSubject === "science" || saved.activeSubject === "english" || saved.activeSubject === "social") && typeof saved.grade === "number" && saved.grade >= 4 && saved.grade <= 12)) out.activeSubject = saved.activeSubject;
  if (saved.screen && saved.screen !== "welcome") {
    if (saved.screen === "story" && saved.grade !== 4) out.screen = "diagnostic";
    else if ((saved.screen === "activity" || saved.screen === "journal") && saved.grade !== 7) out.screen = "adventures";
    else out.screen = saved.screen;
  }
  if (typeof saved.diagnosticIndex === "number") out.diagnosticIndex = Math.min(saved.diagnosticIndex, 2);
  if (typeof saved.diagnosticCorrect === "number") out.diagnosticCorrect = Math.max(0, Math.min(3, saved.diagnosticCorrect));
  if (typeof saved.storyBeat === "number") out.storyBeat = Math.max(0, Math.min(3, saved.storyBeat));
  if (Array.isArray(saved.storyCells) && saved.storyCells.every((cell) => typeof cell === "number" && cell >= 0 && cell < 4)) out.storyCells = saved.storyCells;
  if (typeof saved.fruitSplit === "boolean") out.fruitSplit = saved.fruitSplit;
  if (typeof saved.fruitShared === "boolean") out.fruitShared = saved.fruitShared;
  if (typeof saved.hintRequests === "number") out.hintRequests = Math.max(0, saved.hintRequests);
  if (typeof saved.questIndex === "number") out.questIndex = Math.max(0, saved.questIndex);
  if (typeof saved.coins === "number") out.coins = saved.coins;
  if (typeof saved.correct === "number") out.correct = saved.correct;
  if (typeof saved.attempts === "number") out.attempts = saved.attempts;
  if (Array.isArray(saved.ownedCosmetics) && saved.ownedCosmetics.every((item) => typeof item === "string")) out.ownedCosmetics = saved.ownedCosmetics;
  if (typeof saved.equippedCosmetic === "string") out.equippedCosmetic = saved.equippedCosmetic;
  if (typeof saved.dailyStreak === "number") out.dailyStreak = saved.dailyStreak;
  if (typeof saved.lastCompletedDate === "string") out.lastCompletedDate = saved.lastCompletedDate;
  if (saved.subjectProgress) out.subjectProgress = readSubjectProgress(saved.subjectProgress);
  if (saved.nextSupportMode === "rebuild" || saved.nextSupportMode === "steady" || saved.nextSupportMode === "stretch") out.nextSupportMode = saved.nextSupportMode;
  if (Array.isArray(saved.completedAdventures) && saved.completedAdventures.every(isGradeSevenAdventureId)) out.completedAdventures = saved.completedAdventures;
  const completedAdventures = out.completedAdventures ?? [];
  if (saved.gradeSevenProgress || completedAdventures.length) out.gradeSevenProgress = sanitizeGradeSevenProgress(saved.gradeSevenProgress, completedAdventures);
  if (isGradeSevenAdventureId(saved.activeAdventure)) out.activeAdventure = saved.activeAdventure;
  else if (saved.screen === "activity") out.screen = "adventures";
  if (typeof saved.avatar === "string" && avatars.some((option) => option.id === saved.avatar)) out.avatar = saved.avatar;
  if (saved.pet === null || (typeof saved.pet === "string" && pets.some((option) => option.id === saved.pet))) out.pet = saved.pet ?? null;
  const lifetimeDiscoveries = typeof saved.lifetimeDiscoveries === "number" && saved.lifetimeDiscoveries >= 0
    ? Math.min(LIFETIME_DISCOVERIES_CAP, Math.floor(saved.lifetimeDiscoveries))
    : Math.max(0, (saved.correct ?? 0) + (saved.completedAdventures?.length ?? 0));
  return { ...out, lifetimeDiscoveries };
}
