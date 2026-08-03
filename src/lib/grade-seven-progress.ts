export const GRADE_SEVEN_ADVENTURE_IDS = ["mountain", "moonbase", "balance", "shop", "skatepark", "cricket"] as const;

export type GradeSevenAdventureId = typeof GRADE_SEVEN_ADVENTURE_IDS[number];
export type GradeSevenActivityMode = "live" | "replay";
export type DemoMode = "level" | "tipped";
export type SkateTrailOutcome = "crossed" | "separate";
export type SkateTrailPoint = { x: number; y: number };
export const MOUNTAIN_QUEST_IDS = [
  "signal-below-zero",
  "cliff-checkpoints",
  "storm-moves",
  "rescue-winch",
] as const;
export type MountainQuestId = typeof MOUNTAIN_QUEST_IDS[number];
export const MOONBASE_QUEST_IDS = [
  "tenfold-telescope",
  "rebuild-coordinate",
  "two-mission-controls",
  "catch-the-comet",
] as const;
export type MoonbaseQuestId = typeof MOONBASE_QUEST_IDS[number];
export const BALANCE_QUEST_IDS = [
  "keep-it-level",
  "same-move-both-sides",
  "reveal-the-crate",
  "test-another-lock",
] as const;
export type BalanceQuestId = typeof BALANCE_QUEST_IDS[number];
export const SKATEPARK_QUEST_IDS = [
  "trail-meet",
  "crossing-rails",
  "never-meet",
  "crossing-beam",
  "zigzag-lights",
  "inside-together",
  "reverse-check",
  "opening-ride",
] as const;
export type SkateparkQuestId = typeof SKATEPARK_QUEST_IDS[number];

type SharedState = {
  step: number;
  showDemo: boolean;
  successChoice: string | null;
};

export type MountainState = SharedState & {
  kind: "mountain";
  storyVersion: 2;
  chapterMapOpen: boolean;
  activeQuest: MountainQuestId | null;
  completedQuests: MountainQuestId[];
  questStep: number;
  openingBeat: number;
  openingComplete: boolean;
  signalPrediction: "above" | "below" | null;
  safetyLatchPulled: boolean;
  signalRunStarted: boolean;
  signalFound: boolean;
  snowCleared: number;
  podRecoveryProgress: number;
  podRecovered: boolean;
  routeRevealed: boolean;
  selectedRescueFlag: "shelter" | "pod" | null;
  shelterFlagPlaced: boolean;
  podFlagPlaced: boolean;
  recapPlayed: boolean;
  q2OpeningBeat: number;
  q2OpeningComplete: boolean;
  higherCheckpoint: number | null;
  checkpointOrder: number[];
  checkpointRunTested: boolean;
  orderRunTested: boolean;
  q3OpeningBeat: number;
  q3OpeningComplete: boolean;
  stormPosition: number;
  stormTrail: number[];
  gustIndex: number;
  transferGustIndex: number;
  stormRunComplete: boolean;
  stormTransferComplete: boolean;
  stormRecapPlayed: boolean;
  q4OpeningBeat: number;
  q4OpeningComplete: boolean;
  // Quest 4 semantics (post lower-then-lift reorder): winchPosition/winchReached
  // track LOWERING the empty hook +2→−4; reversePosition/reverseComplete track
  // the LIFT −4→+2. Names predate the reorder and are kept for save compatibility.
  winchPosition: number;
  winchRunStarted: boolean;
  winchReached: boolean;
  reversePosition: number;
  reverseRunStarted: boolean;
  reverseComplete: boolean;
  q4RecapPlayed: boolean;
  finaleBeat: number;
  finaleCellDocked: boolean;
  finaleComplete: boolean;
  position: number;
  returnPosition: number;
  briefingBeat: number;
  flightPath: number[];
  direction: string | null;
  equation: string | null;
};

export type BalanceState = SharedState & {
  kind: "balance";
  storyVersion: 2;
  chapterMapOpen: boolean;
  activeQuest: BalanceQuestId | null;
  completedQuests: BalanceQuestId[];
  questStep: number;
  q1OpeningBeat: number;
  q1OpeningComplete: boolean;
  leftLoad: number;
  rightLoad: number;
  levelRunTested: boolean;
  transferLoad: number;
  q1TransferComplete: boolean;
  q1RecapPlayed: boolean;
  q2OpeningBeat: number;
  q2OpeningComplete: boolean;
  oneSideRemoved: boolean;
  fairnessRestored: boolean;
  pairedRemoval: number;
  pairedRemovalComplete: boolean;
  q2RecapPlayed: boolean;
  q3OpeningBeat: number;
  q3OpeningComplete: boolean;
  cratePairsRemoved: number;
  crateScanTested: boolean;
  q3RecapPlayed: boolean;
  q4OpeningBeat: number;
  q4OpeningComplete: boolean;
  secondLockRemoved: number;
  secondLockOpened: boolean;
  q4RecapPlayed: boolean;
  removed: number;
  rule: string | null;
  value: string | null;
  demoMode: DemoMode;
};

export type MoonbaseState = SharedState & {
  kind: "moonbase";
  storyVersion: 1;
  chapterMapOpen: boolean;
  activeQuest: MoonbaseQuestId | null;
  completedQuests: MoonbaseQuestId[];
  questStep: number;
  openingBeat: number;
  openingComplete: boolean;
  telescopePlace: number;
  telescopeTested: boolean;
  bundleLevel: number;
  coordinateBuilt: boolean;
  indiaGroupingSeen: boolean;
  worldGroupingSeen: boolean;
  groupingConfirmed: boolean;
  cometChoice: "near" | "true" | null;
  roundedChoice: number | null;
  telescopeAimed: boolean;
  photoCaptured: boolean;
};

export type ShopState = SharedState & {
  kind: "shop";
  quarterPick: string | null;
  discount: number;
  offer: string | null;
};

export type SkateparkState = SharedState & {
  kind: "skatepark";
  storyVersion: 2;
  chapterMapOpen: boolean;
  activeQuest: SkateparkQuestId | null;
  completedQuests: SkateparkQuestId[];
  questStep: number;
  railAngle: number;
  lightsAwake: number;
  movedRail: boolean;
  crossingRouteTested: boolean;
  twinArmed: boolean;
  twinMatched: boolean;
  linearPair: "left" | "right" | null;
  transferTwinMatched: boolean;
  transferLinearMatched: boolean;
  trailEndpoint: SkateTrailPoint | null;
  trailOutcome: SkateTrailOutcome | null;
  recapOpen: boolean;
  openingBeat: number;
  openingComplete: boolean;
  closingBeat: number;
  closingComplete: boolean;
  parallelAngle: number;
  parallelGap: number;
  parallelGapMoved: boolean;
  parallelMatched: boolean;
  parallelRunTested: boolean;
  parallelGapRunTested: boolean;
  perpendicularAngle: number;
  perpendicularMatched: boolean;
  squareExitRunTested: boolean;
  courseTurned: boolean;
  courseRunTested: boolean;
  q3OpeningBeat: number;
  q3OpeningComplete: boolean;
  q3ClosingBeat: number;
  q3ClosingStarted: boolean;
  beamAngle: number;
  beamMoved: boolean;
  beamRunTested: boolean;
  correspondingArmed: boolean;
  correspondingMatched: boolean;
  alternateArmed: boolean;
  alternateMatched: boolean;
  beamTransferred: boolean;
  q4OpeningBeat: number;
  q4OpeningComplete: boolean;
  q4ClosingBeat: number;
  q4ClosingStarted: boolean;
  q4ClosingComplete: boolean;
  extensionOpeningBeat: number;
  extensionOpeningComplete: boolean;
  zigzagAngle: number;
  zigzagMatched: boolean;
  zigzagRunTested: boolean;
  insideAngle: number;
  insideJoined: boolean;
  reverseRailAngle: number;
  reverseParallel: boolean;
  reverseRunTested: boolean;
  openingRideBuilt: boolean;
  openingRideLaunched: boolean;
};

export type CricketState = SharedState & {
  kind: "cricket";
  picked: string[];
  topPlayer: string | null;
  reason: string | null;
};

export type GradeSevenInteractionState =
  | MountainState
  | MoonbaseState
  | BalanceState
  | ShopState
  | SkateparkState
  | CricketState;

export type GradeSevenAdventureProgress = {
  seenEvents: number[];
  lastEvent: number;
  completed: boolean;
  interactionState: GradeSevenInteractionState;
};

export type GradeSevenProgress = Partial<Record<GradeSevenAdventureId, GradeSevenAdventureProgress>>;

export const gradeSevenEventTitles: Record<GradeSevenAdventureId, readonly string[]> = {
  mountain: ["Signal Below Zero", "Cliff Checkpoints", "Storm Moves", "Rescue Winch", "Mountain Rescue Finale"],
  moonbase: ["The Telescope Wakes", "Rebuild the Coordinate", "Two Mission Controls", "Catch the Comet", "The Dome Photograph"],
  balance: ["Keep It Level", "Same Move, Both Sides", "Reveal the Crate", "Test Another Lock", "Balance Lab Finale"],
  shop: ["Two shops", "One quarter", "The price bar", "The better deal", "The saving explained"],
  skatepark: ["Trail Meet", "Turn the Crossing", "Find the Twin", "Build a Straight Exit", "Same Pattern, New Crossing"],
  cricket: ["The squad problem", "Reading one bar", "Choosing three", "Using evidence", "The squad decision"],
};

export function isGradeSevenAdventureId(value: unknown): value is GradeSevenAdventureId {
  return typeof value === "string" && GRADE_SEVEN_ADVENTURE_IDS.includes(value as GradeSevenAdventureId);
}

// Owner-gated (2026-08-03, docs/qa/experience-holes-2026-08-02): these three
// adventures are built and playable in code, but don't meet the quality bar
// yet. Their stars stay dim and unlaunchable everywhere in the app until
// each one's phase finishes — this is the single source of truth every
// launch guard (map, resume card, saved-progress hydration) checks against.
export const NOT_READY_ADVENTURE_IDS: readonly GradeSevenAdventureId[] = ["balance", "shop", "cricket"];

export function isGradeSevenAdventureReady(id: GradeSevenAdventureId): boolean {
  return !NOT_READY_ADVENTURE_IDS.includes(id);
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, Math.floor(value)));
const stringOrNull = (value: unknown) => typeof value === "string" ? value : null;
const boolOr = (value: unknown, fallback: boolean) => typeof value === "boolean" ? value : fallback;
const numberOr = (value: unknown, fallback: number, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value) ? clamp(value, min, max) : fallback;

function isSkateparkQuestId(value: unknown): value is SkateparkQuestId {
  return typeof value === "string" && SKATEPARK_QUEST_IDS.includes(value as SkateparkQuestId);
}

function isMountainQuestId(value: unknown): value is MountainQuestId {
  return typeof value === "string" && MOUNTAIN_QUEST_IDS.includes(value as MountainQuestId);
}

function isMoonbaseQuestId(value: unknown): value is MoonbaseQuestId {
  return typeof value === "string" && MOONBASE_QUEST_IDS.includes(value as MoonbaseQuestId);
}

function isBalanceQuestId(value: unknown): value is BalanceQuestId {
  return typeof value === "string" && BALANCE_QUEST_IDS.includes(value as BalanceQuestId);
}

function mountainCompletedQuests(
  value: unknown,
  fallback: readonly MountainQuestId[],
): MountainQuestId[] {
  if (!Array.isArray(value)) return [...fallback];
  return [...new Set(value.filter(isMountainQuestId))];
}

function moonbaseCompletedQuests(
  value: unknown,
  fallback: readonly MoonbaseQuestId[],
): MoonbaseQuestId[] {
  if (!Array.isArray(value)) return [...fallback];
  return [...new Set(value.filter(isMoonbaseQuestId))];
}

function balanceCompletedQuests(
  value: unknown,
  fallback: readonly BalanceQuestId[],
): BalanceQuestId[] {
  if (!Array.isArray(value)) return [...fallback];
  return [...new Set(value.filter(isBalanceQuestId))];
}

function skateparkCompletedQuests(
  value: unknown,
  fallback: readonly SkateparkQuestId[],
): SkateparkQuestId[] {
  if (!Array.isArray(value)) return [...fallback];
  return [...new Set(value.filter(isSkateparkQuestId))];
}

function skateTrailPoint(value: unknown): SkateTrailPoint | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.x !== "number" ||
    !Number.isFinite(raw.x) ||
    typeof raw.y !== "number" ||
    !Number.isFinite(raw.y)
  ) {
    return null;
  }
  return {
    x: Math.max(0.08, Math.min(0.9, raw.x)),
    y: Math.max(0.34, Math.min(0.78, raw.y)),
  };
}

function integerTrail(from: number, to: number): number[] {
  const direction = to >= from ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, index) => from + index * direction);
}

function mountainTrail(value: unknown, position: number, start = 3): number[] {
  if (!Array.isArray(value)) return integerTrail(start, position);
  const clean = value
    .filter((item): item is number => typeof item === "number" && Number.isInteger(item) && item >= -8 && item <= 8)
    .slice(-40);
  return clean.length > 0 ? clean : integerTrail(start, position);
}

function mountainCheckpointOrder(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const route = [-5, -1, 2, 6];
  const clean: number[] = [];
  for (const item of value) {
    if (item !== route[clean.length]) break;
    clean.push(item);
    if (clean.length === route.length) break;
  }
  return clean;
}

export function createGradeSevenState(id: "mountain", step?: number): MountainState;
export function createGradeSevenState(id: "moonbase", step?: number): MoonbaseState;
export function createGradeSevenState(id: "balance", step?: number): BalanceState;
export function createGradeSevenState(id: "shop", step?: number): ShopState;
export function createGradeSevenState(id: "skatepark", step?: number): SkateparkState;
export function createGradeSevenState(id: "cricket", step?: number): CricketState;
export function createGradeSevenState(id: GradeSevenAdventureId, step?: number): GradeSevenInteractionState;
export function createGradeSevenState(id: GradeSevenAdventureId, step = 0): GradeSevenInteractionState {
  const shared = { step: clamp(step, 0, 5), showDemo: true, successChoice: null };
  if (id === "mountain") {
    // Mirrors the moonbase finaleReady pattern: journal event 4 ("Mountain
    // Rescue Finale") must seed every quest complete and land questStep on 4
    // so the component's finale gate renders instead of replaying Quest 4.
    const finaleReady = step >= 4;
    const position = step >= 2 ? -4 : 3;
    return {
      ...shared,
      kind: "mountain",
      storyVersion: 2,
      chapterMapOpen: step === 0,
      activeQuest: step === 0
        ? null
        : MOUNTAIN_QUEST_IDS[Math.min(step, MOUNTAIN_QUEST_IDS.length - 1)],
      completedQuests: finaleReady ? [...MOUNTAIN_QUEST_IDS] : [],
      questStep: finaleReady ? 4 : 0,
      openingBeat: 0,
      openingComplete: finaleReady,
      signalPrediction: null,
      safetyLatchPulled: false,
      signalRunStarted: false,
      signalFound: false,
      snowCleared: 0,
      podRecoveryProgress: 0,
      podRecovered: false,
      routeRevealed: false,
      selectedRescueFlag: null,
      shelterFlagPlaced: false,
      podFlagPlaced: false,
      recapPlayed: false,
      q2OpeningBeat: 0,
      q2OpeningComplete: finaleReady,
      higherCheckpoint: null,
      checkpointOrder: [],
      checkpointRunTested: false,
      orderRunTested: false,
      q3OpeningBeat: 0,
      q3OpeningComplete: finaleReady,
      stormPosition: -2,
      stormTrail: [-2],
      gustIndex: 0,
      transferGustIndex: 0,
      stormRunComplete: false,
      stormTransferComplete: false,
      stormRecapPlayed: false,
      q4OpeningBeat: 0,
      q4OpeningComplete: finaleReady,
      // Lower-then-lift order: hook starts at +2, lift starts at −4.
      winchPosition: 2,
      winchRunStarted: false,
      winchReached: false,
      reversePosition: -4,
      reverseRunStarted: false,
      reverseComplete: false,
      q4RecapPlayed: false,
      finaleBeat: 0,
      finaleCellDocked: false,
      finaleComplete: false,
      position,
      returnPosition: -4,
      briefingBeat: 0,
      flightPath: integerTrail(3, position),
      direction: null,
      equation: null,
    };
  }
  if (id === "moonbase") {
    const finaleReady = step >= 4;
    return {
      ...shared,
      kind: "moonbase",
      storyVersion: 1,
      chapterMapOpen: step === 0 && !finaleReady,
      activeQuest: step === 0
        ? null
        : MOONBASE_QUEST_IDS[Math.min(step, MOONBASE_QUEST_IDS.length - 1)],
      completedQuests: finaleReady ? [...MOONBASE_QUEST_IDS] : [],
      questStep: finaleReady ? 3 : 0,
      openingBeat: 0,
      openingComplete: finaleReady,
      telescopePlace: 0,
      telescopeTested: false,
      bundleLevel: 0,
      coordinateBuilt: false,
      indiaGroupingSeen: false,
      worldGroupingSeen: false,
      groupingConfirmed: false,
      cometChoice: finaleReady ? "true" : null,
      roundedChoice: finaleReady ? 64_200_000 : null,
      telescopeAimed: finaleReady,
      photoCaptured: finaleReady,
    };
  }
  if (id === "balance") return {
    ...shared,
    kind: "balance",
    storyVersion: 2,
    chapterMapOpen: step === 0,
    activeQuest: step === 0
      ? null
      : BALANCE_QUEST_IDS[Math.min(step, BALANCE_QUEST_IDS.length - 1)],
    completedQuests: [],
    questStep: 0,
    q1OpeningBeat: 0,
    q1OpeningComplete: false,
    leftLoad: 0,
    rightLoad: 0,
    levelRunTested: false,
    transferLoad: 0,
    q1TransferComplete: false,
    q1RecapPlayed: false,
    q2OpeningBeat: 0,
    q2OpeningComplete: false,
    oneSideRemoved: false,
    fairnessRestored: false,
    pairedRemoval: 0,
    pairedRemovalComplete: false,
    q2RecapPlayed: false,
    q3OpeningBeat: 0,
    q3OpeningComplete: false,
    cratePairsRemoved: 0,
    crateScanTested: false,
    q3RecapPlayed: false,
    q4OpeningBeat: 0,
    q4OpeningComplete: false,
    secondLockRemoved: 0,
    secondLockOpened: false,
    q4RecapPlayed: false,
    removed: 0,
    rule: null,
    value: null,
    demoMode: "level",
  };
  if (id === "shop") return { ...shared, kind: "shop", quarterPick: null, discount: 0, offer: null };
  if (id === "skatepark") return {
    ...shared,
    kind: "skatepark",
    storyVersion: 2,
    chapterMapOpen: step === 0,
    activeQuest: step === 0 ? null : "crossing-rails",
    completedQuests: step > 0 ? ["trail-meet"] : [],
    questStep: 0,
    railAngle: 46,
    lightsAwake: 0,
    movedRail: false,
    crossingRouteTested: false,
    twinArmed: false,
    twinMatched: false,
    linearPair: null,
    transferTwinMatched: false,
    transferLinearMatched: false,
    trailEndpoint: null,
    trailOutcome: null,
    recapOpen: false,
    openingBeat: 0,
    openingComplete: step > 0,
    closingBeat: 0,
    closingComplete: step >= 5,
    parallelAngle: 14,
    parallelGap: 30,
    parallelGapMoved: false,
    parallelMatched: false,
    parallelRunTested: false,
    parallelGapRunTested: false,
    perpendicularAngle: 64,
    perpendicularMatched: false,
    squareExitRunTested: false,
    courseTurned: false,
    courseRunTested: false,
    q3OpeningBeat: 0,
    q3OpeningComplete: false,
    q3ClosingBeat: 0,
    q3ClosingStarted: false,
    beamAngle: 48,
    beamMoved: false,
    beamRunTested: false,
    correspondingArmed: false,
    correspondingMatched: false,
    alternateArmed: false,
    alternateMatched: false,
    beamTransferred: false,
    q4OpeningBeat: 0,
    q4OpeningComplete: false,
    q4ClosingBeat: 0,
      q4ClosingStarted: false,
      q4ClosingComplete: false,
      extensionOpeningBeat: 0,
      extensionOpeningComplete: false,
      zigzagAngle: 52,
      zigzagMatched: false,
      zigzagRunTested: false,
      insideAngle: 68,
      insideJoined: false,
      reverseRailAngle: 10,
      reverseParallel: false,
      reverseRunTested: false,
      openingRideBuilt: false,
      openingRideLaunched: false,
  };
  return { ...shared, kind: "cricket", picked: [], topPlayer: null, reason: null };
}

export function sanitizeGradeSevenState(id: GradeSevenAdventureId, value: unknown): GradeSevenInteractionState {
  const fallback = createGradeSevenState(id);
  if (!value || typeof value !== "object") return fallback;
  const raw = value as Record<string, unknown>;
  if (raw.kind !== id) return fallback;
  const shared = {
    step: numberOr(raw.step, 0, 0, 5),
    showDemo: boolOr(raw.showDemo, true),
    successChoice: stringOrNull(raw.successChoice),
  };
  if (id === "mountain") {
    // The former five-screen rescue used a different story and reward rhythm.
    // Completed stars are retained by sanitizeGradeSevenProgress, while an
    // unfinished legacy interaction safely restarts at the new chapter map.
    if (raw.storyVersion !== 2) return fallback;
    const position = numberOr(raw.position, 3, -8, 8);
    const completedQuests = mountainCompletedQuests(raw.completedQuests, []);
    const activeQuest = raw.activeQuest === null
      ? null
      : isMountainQuestId(raw.activeQuest)
        ? raw.activeQuest
        : "signal-below-zero";
    return {
      ...shared,
      kind: "mountain",
      storyVersion: 2,
      chapterMapOpen: boolOr(raw.chapterMapOpen, false),
      activeQuest,
      completedQuests,
      questStep: numberOr(raw.questStep, 0, 0, activeQuest === "rescue-winch" ? 4 : 3),
      openingBeat: numberOr(raw.openingBeat, 0, 0, 8),
      openingComplete: boolOr(raw.openingComplete, false),
      signalPrediction: raw.signalPrediction === "above" || raw.signalPrediction === "below"
        ? raw.signalPrediction
        : null,
      safetyLatchPulled: boolOr(raw.safetyLatchPulled, false),
      signalRunStarted: boolOr(raw.signalRunStarted, false),
      signalFound: boolOr(raw.signalFound, position === -4),
      snowCleared: numberOr(raw.snowCleared, 0, 0, 100),
      podRecoveryProgress: numberOr(raw.podRecoveryProgress, 0, 0, 100),
      podRecovered: boolOr(raw.podRecovered, false),
      routeRevealed: boolOr(raw.routeRevealed, false),
      selectedRescueFlag: raw.selectedRescueFlag === "shelter" || raw.selectedRescueFlag === "pod"
        ? raw.selectedRescueFlag
        : null,
      shelterFlagPlaced: boolOr(raw.shelterFlagPlaced, false),
      podFlagPlaced: boolOr(raw.podFlagPlaced, false),
      recapPlayed: boolOr(raw.recapPlayed, false),
      q2OpeningBeat: numberOr(raw.q2OpeningBeat, 0, 0, 3),
      q2OpeningComplete: boolOr(raw.q2OpeningComplete, false),
      higherCheckpoint: raw.higherCheckpoint === -3 || raw.higherCheckpoint === 2
        ? raw.higherCheckpoint
        : null,
      checkpointOrder: mountainCheckpointOrder(raw.checkpointOrder),
      checkpointRunTested: boolOr(raw.checkpointRunTested, false),
      orderRunTested: boolOr(raw.orderRunTested, false),
      q3OpeningBeat: numberOr(raw.q3OpeningBeat, 0, 0, 3),
      q3OpeningComplete: boolOr(raw.q3OpeningComplete, false),
      stormPosition: numberOr(raw.stormPosition, -2, -8, 8),
      stormTrail: mountainTrail(raw.stormTrail, numberOr(raw.stormPosition, -2, -8, 8), -2),
      gustIndex: numberOr(raw.gustIndex, 0, 0, 3),
      transferGustIndex: numberOr(raw.transferGustIndex, 0, 0, 2),
      stormRunComplete: boolOr(raw.stormRunComplete, false),
      stormTransferComplete: boolOr(raw.stormTransferComplete, false),
      stormRecapPlayed: boolOr(raw.stormRecapPlayed, false),
      q4OpeningBeat: numberOr(raw.q4OpeningBeat, 0, 0, 3),
      q4OpeningComplete: boolOr(raw.q4OpeningComplete, false),
      // Lower-then-lift order: hook starts at +2, lift starts at −4.
      winchPosition: numberOr(raw.winchPosition, 2, -4, 2),
      winchRunStarted: boolOr(raw.winchRunStarted, false),
      winchReached: boolOr(raw.winchReached, false),
      reversePosition: numberOr(raw.reversePosition, -4, -4, 2),
      reverseRunStarted: boolOr(raw.reverseRunStarted, false),
      reverseComplete: boolOr(raw.reverseComplete, false),
      q4RecapPlayed: boolOr(raw.q4RecapPlayed, false),
      finaleBeat: numberOr(raw.finaleBeat, 0, 0, 4),
      finaleCellDocked: boolOr(raw.finaleCellDocked, false),
      finaleComplete: boolOr(raw.finaleComplete, false),
      position,
      returnPosition: numberOr(raw.returnPosition, -4, -8, 8),
      briefingBeat: numberOr(raw.briefingBeat, 0, 0, 3),
      flightPath: mountainTrail(raw.flightPath, position),
      direction: stringOrNull(raw.direction),
      equation: stringOrNull(raw.equation),
    };
  }
  if (id === "moonbase") {
    if (raw.storyVersion !== 1) return fallback;
    const completedQuests = moonbaseCompletedQuests(raw.completedQuests, []);
    const activeQuest = raw.activeQuest === null
      ? null
      : isMoonbaseQuestId(raw.activeQuest)
        ? raw.activeQuest
        : "tenfold-telescope";
    return {
      ...shared,
      kind: "moonbase",
      storyVersion: 1,
      chapterMapOpen: boolOr(raw.chapterMapOpen, false),
      activeQuest,
      completedQuests,
      questStep: numberOr(raw.questStep, 0, 0, 3),
      openingBeat: numberOr(raw.openingBeat, 0, 0, 3),
      openingComplete: boolOr(raw.openingComplete, false),
      telescopePlace: numberOr(raw.telescopePlace, 0, 0, 5),
      telescopeTested: boolOr(raw.telescopeTested, false),
      bundleLevel: numberOr(raw.bundleLevel, 0, 0, 4),
      coordinateBuilt: boolOr(raw.coordinateBuilt, false),
      indiaGroupingSeen: boolOr(raw.indiaGroupingSeen, false),
      worldGroupingSeen: boolOr(raw.worldGroupingSeen, false),
      groupingConfirmed: boolOr(raw.groupingConfirmed, false),
      cometChoice: raw.cometChoice === "near" || raw.cometChoice === "true"
        ? raw.cometChoice
        : null,
      roundedChoice: typeof raw.roundedChoice === "number" && Number.isFinite(raw.roundedChoice)
        ? Math.floor(raw.roundedChoice)
        : null,
      telescopeAimed: boolOr(raw.telescopeAimed, false),
      photoCaptured: boolOr(raw.photoCaptured, false),
    };
  }
  if (id === "balance") return {
    ...shared,
    kind: "balance",
    step: raw.storyVersion === 2 ? shared.step : 0,
    storyVersion: 2,
    chapterMapOpen: raw.storyVersion === 2
      ? boolOr(raw.chapterMapOpen, false)
      : true,
    activeQuest: raw.storyVersion === 2
      ? raw.activeQuest === null
        ? null
        : isBalanceQuestId(raw.activeQuest)
          ? raw.activeQuest
          : "keep-it-level"
      : null,
    completedQuests: raw.storyVersion === 2
      ? balanceCompletedQuests(raw.completedQuests, [])
      : [],
    questStep: raw.storyVersion === 2 ? numberOr(raw.questStep, 0, 0, 3) : 0,
    q1OpeningBeat: raw.storyVersion === 2 ? numberOr(raw.q1OpeningBeat, 0, 0, 3) : 0,
    q1OpeningComplete: raw.storyVersion === 2 && boolOr(raw.q1OpeningComplete, false),
    leftLoad: raw.storyVersion === 2 ? numberOr(raw.leftLoad, 0, 0, 3) : 0,
    rightLoad: raw.storyVersion === 2 ? numberOr(raw.rightLoad, 0, 0, 3) : 0,
    levelRunTested: raw.storyVersion === 2 && boolOr(raw.levelRunTested, false),
    transferLoad: raw.storyVersion === 2 ? numberOr(raw.transferLoad, 0, 0, 4) : 0,
    q1TransferComplete: raw.storyVersion === 2 && boolOr(raw.q1TransferComplete, false),
    q1RecapPlayed: raw.storyVersion === 2 && boolOr(raw.q1RecapPlayed, false),
    q2OpeningBeat: raw.storyVersion === 2 ? numberOr(raw.q2OpeningBeat, 0, 0, 3) : 0,
    q2OpeningComplete: raw.storyVersion === 2 && boolOr(raw.q2OpeningComplete, false),
    oneSideRemoved: raw.storyVersion === 2 && boolOr(raw.oneSideRemoved, false),
    fairnessRestored: raw.storyVersion === 2 && boolOr(raw.fairnessRestored, false),
    pairedRemoval: raw.storyVersion === 2 ? numberOr(raw.pairedRemoval, 0, 0, 3) : 0,
    pairedRemovalComplete: raw.storyVersion === 2 && boolOr(raw.pairedRemovalComplete, false),
    q2RecapPlayed: raw.storyVersion === 2 && boolOr(raw.q2RecapPlayed, false),
    q3OpeningBeat: raw.storyVersion === 2 ? numberOr(raw.q3OpeningBeat, 0, 0, 3) : 0,
    q3OpeningComplete: raw.storyVersion === 2 && boolOr(raw.q3OpeningComplete, false),
    cratePairsRemoved: raw.storyVersion === 2 ? numberOr(raw.cratePairsRemoved, 0, 0, 5) : 0,
    crateScanTested: raw.storyVersion === 2 && boolOr(raw.crateScanTested, false),
    q3RecapPlayed: raw.storyVersion === 2 && boolOr(raw.q3RecapPlayed, false),
    q4OpeningBeat: raw.storyVersion === 2 ? numberOr(raw.q4OpeningBeat, 0, 0, 3) : 0,
    q4OpeningComplete: raw.storyVersion === 2 && boolOr(raw.q4OpeningComplete, false),
    secondLockRemoved: raw.storyVersion === 2 ? numberOr(raw.secondLockRemoved, 0, 0, 3) : 0,
    secondLockOpened: raw.storyVersion === 2 && boolOr(raw.secondLockOpened, false),
    q4RecapPlayed: raw.storyVersion === 2 && boolOr(raw.q4RecapPlayed, false),
    removed: numberOr(raw.removed, 0, 0, 5),
    rule: stringOrNull(raw.rule),
    value: stringOrNull(raw.value),
    demoMode: raw.demoMode === "tipped" ? "tipped" : "level",
  };
  if (id === "shop") return {
    ...shared,
    kind: "shop",
    quarterPick: stringOrNull(raw.quarterPick),
    discount: numberOr(raw.discount, 0, 0, 50),
    offer: stringOrNull(raw.offer),
  };
  if (id === "skatepark") {
    // The previous ramp-and-triangle activity taught a different concept.
    // Restart it safely instead of mixing incompatible saved interactions.
    if (raw.storyVersion !== 2) return fallback;
    const trailEndpoint = skateTrailPoint(raw.trailEndpoint);
    const trailOutcome = trailEndpoint && (
      raw.trailOutcome === "crossed" || raw.trailOutcome === "separate"
    )
      ? raw.trailOutcome
      : null;
    const legacyCompletedQuests: SkateparkQuestId[] = [];
    if (trailOutcome || shared.step > 0) legacyCompletedQuests.push("trail-meet");
    if (shared.step >= 5 || raw.closingComplete === true) legacyCompletedQuests.push("crossing-rails");
    const completedQuests = skateparkCompletedQuests(raw.completedQuests, legacyCompletedQuests);
    const activeQuest = raw.activeQuest === null
      ? null
      : isSkateparkQuestId(raw.activeQuest)
        ? raw.activeQuest
        : shared.step === 0
          ? "trail-meet"
          : "crossing-rails";
    return {
      ...shared,
      kind: "skatepark",
      storyVersion: 2,
      // Older version-two saves did not have a chapter map. Resume those
      // directly inside their exact scene instead of interrupting the child.
      chapterMapOpen: boolOr(raw.chapterMapOpen, false),
      activeQuest,
      completedQuests,
      questStep: numberOr(raw.questStep, 0, 0, 3),
      railAngle: numberOr(raw.railAngle, 46, 25, 75),
      lightsAwake: numberOr(raw.lightsAwake, 0, 0, 4),
      movedRail: boolOr(raw.movedRail, false),
      crossingRouteTested: boolOr(raw.crossingRouteTested, false),
      twinArmed: boolOr(raw.twinArmed, false),
      twinMatched: boolOr(raw.twinMatched, false),
      linearPair: raw.linearPair === "left" || raw.linearPair === "right" ? raw.linearPair : null,
      transferTwinMatched: boolOr(raw.transferTwinMatched, false),
      transferLinearMatched: boolOr(raw.transferLinearMatched, false),
      trailEndpoint,
      trailOutcome,
      recapOpen: boolOr(raw.recapOpen, false),
      openingBeat: numberOr(raw.openingBeat, 0, 0, 5),
      openingComplete: boolOr(raw.openingComplete, shared.step > 0),
      closingBeat: numberOr(raw.closingBeat, 0, 0, 3),
      closingComplete: boolOr(raw.closingComplete, shared.step >= 5),
      parallelAngle: numberOr(raw.parallelAngle, 14, -18, 18),
      parallelGap: numberOr(raw.parallelGap, 30, 20, 42),
      parallelGapMoved: boolOr(raw.parallelGapMoved, false),
      parallelMatched: boolOr(raw.parallelMatched, false),
      parallelRunTested: boolOr(raw.parallelRunTested, false),
      parallelGapRunTested: boolOr(raw.parallelGapRunTested, false),
      perpendicularAngle: numberOr(raw.perpendicularAngle, 64, 55, 125),
      perpendicularMatched: boolOr(raw.perpendicularMatched, false),
      squareExitRunTested: boolOr(raw.squareExitRunTested, false),
      courseTurned: boolOr(raw.courseTurned, false),
      courseRunTested: boolOr(raw.courseRunTested, false),
      q3OpeningBeat: numberOr(raw.q3OpeningBeat, 0, 0, 4),
      q3OpeningComplete: boolOr(raw.q3OpeningComplete, false),
      q3ClosingBeat: numberOr(raw.q3ClosingBeat, 0, 0, 3),
      q3ClosingStarted: boolOr(raw.q3ClosingStarted, false),
      beamAngle: numberOr(raw.beamAngle, 48, 28, 70),
      beamMoved: boolOr(raw.beamMoved, false),
      beamRunTested: boolOr(raw.beamRunTested, false),
      correspondingArmed: boolOr(raw.correspondingArmed, false),
      correspondingMatched: boolOr(raw.correspondingMatched, false),
      alternateArmed: boolOr(raw.alternateArmed, false),
      alternateMatched: boolOr(raw.alternateMatched, false),
      beamTransferred: boolOr(raw.beamTransferred, false),
      q4OpeningBeat: numberOr(raw.q4OpeningBeat, 0, 0, 4),
      q4OpeningComplete: boolOr(raw.q4OpeningComplete, false),
      q4ClosingBeat: numberOr(raw.q4ClosingBeat, 0, 0, 3),
      q4ClosingStarted: boolOr(raw.q4ClosingStarted, false),
      q4ClosingComplete: boolOr(raw.q4ClosingComplete, false),
      extensionOpeningBeat: numberOr(raw.extensionOpeningBeat, 0, 0, 2),
      extensionOpeningComplete: boolOr(raw.extensionOpeningComplete, false),
      zigzagAngle: numberOr(raw.zigzagAngle, 52, 35, 75),
      zigzagMatched: boolOr(raw.zigzagMatched, false),
      zigzagRunTested: boolOr(raw.zigzagRunTested, false),
      insideAngle: numberOr(raw.insideAngle, 68, 30, 150),
      insideJoined: boolOr(raw.insideJoined, false),
      reverseRailAngle: numberOr(raw.reverseRailAngle, 10, -18, 18),
      reverseParallel: boolOr(raw.reverseParallel, false),
      reverseRunTested: boolOr(raw.reverseRunTested, false),
      openingRideBuilt: boolOr(raw.openingRideBuilt, false),
      openingRideLaunched: boolOr(raw.openingRideLaunched, false),
    };
  }
  return {
    ...shared,
    kind: "cricket",
    picked: Array.isArray(raw.picked) ? raw.picked.filter((item): item is string => typeof item === "string").slice(0, 3) : [],
    topPlayer: stringOrNull(raw.topPlayer),
    reason: stringOrNull(raw.reason),
  };
}

export function sanitizeGradeSevenProgress(value: unknown, completedIds: readonly GradeSevenAdventureId[] = []): GradeSevenProgress {
  const rawProgress = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const clean: GradeSevenProgress = {};
  for (const id of GRADE_SEVEN_ADVENTURE_IDS) {
    const raw = rawProgress[id];
    if (!raw || typeof raw !== "object") {
      if (completedIds.includes(id)) {
        clean[id] = { seenEvents: [], lastEvent: 0, completed: true, interactionState: createGradeSevenState(id) };
      }
      continue;
    }
    const record = raw as Record<string, unknown>;
    const rawInteraction = record.interactionState && typeof record.interactionState === "object"
      ? record.interactionState as Record<string, unknown>
      : null;
    const legacySkatepark = id === "skatepark" && rawInteraction?.storyVersion !== 2;
    const legacyMountain = id === "mountain" && rawInteraction?.storyVersion !== 2;
    const legacyMoonbase = id === "moonbase" && rawInteraction?.storyVersion !== 1;
    const legacyBalance = id === "balance" && rawInteraction?.storyVersion !== 2;
    const interactionState = sanitizeGradeSevenState(id, record.interactionState);
    const seenEvents = !legacySkatepark && !legacyMountain && !legacyMoonbase && !legacyBalance && Array.isArray(record.seenEvents)
      ? [...new Set(record.seenEvents.filter((event): event is number => typeof event === "number" && Number.isInteger(event) && event >= 0 && event <= 4))].sort()
      : [];
    if (interactionState.step <= 4 && !seenEvents.includes(interactionState.step)) seenEvents.push(interactionState.step);
    clean[id] = {
      seenEvents: seenEvents.sort(),
      // The serialized interaction is the source of truth. Keeping these in
      // lockstep prevents a resume card from naming a different scene.
      lastEvent: Math.min(interactionState.step, 4),
      completed: record.completed === true || completedIds.includes(id),
      interactionState,
    };
  }
  return clean;
}

export function openGradeSevenAdventure(progress: GradeSevenProgress, id: GradeSevenAdventureId): GradeSevenProgress {
  const existing = progress[id];
  if (existing) {
    const currentEvent = Math.min(existing.interactionState.step, 4);
    return {
      ...progress,
      [id]: {
        ...existing,
        seenEvents: [...new Set([...existing.seenEvents, currentEvent])].sort(),
        lastEvent: currentEvent,
      },
    };
  }
  return {
    ...progress,
    [id]: { seenEvents: [0], lastEvent: 0, completed: false, interactionState: createGradeSevenState(id) },
  };
}

export function updateGradeSevenAdventure(
  progress: GradeSevenProgress,
  id: GradeSevenAdventureId,
  interactionState: GradeSevenInteractionState,
  completed = progress[id]?.completed ?? false,
): GradeSevenProgress {
  const previous = progress[id];
  const event = Math.min(interactionState.step, 4);
  return {
    ...progress,
    [id]: {
      seenEvents: [...new Set([...(previous?.seenEvents ?? []), event])].sort(),
      lastEvent: event,
      completed,
      interactionState,
    },
  };
}

export function previousGradeSevenEvent(state: GradeSevenInteractionState): GradeSevenInteractionState {
  if (state.kind === "mountain") {
    if (state.chapterMapOpen) return state;
    if (state.questStep > 0) return { ...state, questStep: state.questStep - 1 };
    if (state.activeQuest === "cliff-checkpoints") {
      if (state.q2OpeningComplete) return { ...state, q2OpeningComplete: false };
      if (state.q2OpeningBeat > 0) return { ...state, q2OpeningBeat: state.q2OpeningBeat - 1 };
      return state;
    }
    if (state.activeQuest === "storm-moves") {
      if (state.q3OpeningComplete) return { ...state, q3OpeningComplete: false };
      if (state.q3OpeningBeat > 0) return { ...state, q3OpeningBeat: state.q3OpeningBeat - 1 };
      return state;
    }
    if (state.activeQuest === "rescue-winch") {
      if (state.q4OpeningComplete) return { ...state, q4OpeningComplete: false };
      if (state.q4OpeningBeat > 0) return { ...state, q4OpeningBeat: state.q4OpeningBeat - 1 };
      return state;
    }
    if (state.openingComplete) return { ...state, openingComplete: false };
    if (state.openingBeat > 0) return { ...state, openingBeat: state.openingBeat - 1 };
    return state;
  }
  if (state.kind === "balance") {
    if (state.chapterMapOpen) return state;
    if (state.questStep > 0) return { ...state, questStep: state.questStep - 1 };
    if (state.activeQuest === "keep-it-level") {
      if (state.q1OpeningComplete) return { ...state, q1OpeningComplete: false };
      if (state.q1OpeningBeat > 0) return { ...state, q1OpeningBeat: state.q1OpeningBeat - 1 };
      return state;
    }
    if (state.activeQuest === "same-move-both-sides") {
      if (state.q2OpeningComplete) return { ...state, q2OpeningComplete: false };
      if (state.q2OpeningBeat > 0) return { ...state, q2OpeningBeat: state.q2OpeningBeat - 1 };
      return state;
    }
    if (state.activeQuest === "reveal-the-crate") {
      if (state.q3OpeningComplete) return { ...state, q3OpeningComplete: false };
      if (state.q3OpeningBeat > 0) return { ...state, q3OpeningBeat: state.q3OpeningBeat - 1 };
      return state;
    }
    if (state.activeQuest === "test-another-lock") {
      if (state.q4OpeningComplete) return { ...state, q4OpeningComplete: false };
      if (state.q4OpeningBeat > 0) return { ...state, q4OpeningBeat: state.q4OpeningBeat - 1 };
      return state;
    }
    return state;
  }
  if (state.kind === "moonbase") {
    if (state.chapterMapOpen) return state;
    if (state.questStep > 0) return { ...state, questStep: state.questStep - 1 };
    if (state.openingComplete) return { ...state, openingComplete: false };
    if (state.openingBeat > 0) return { ...state, openingBeat: state.openingBeat - 1 };
    return state;
  }
  if (state.kind === "skatepark" && state.chapterMapOpen) return state;
  if (
    state.kind === "skatepark"
    && state.activeQuest
    && state.activeQuest !== "trail-meet"
    && state.activeQuest !== "crossing-rails"
  ) {
    if (state.activeQuest === "never-meet" && state.q3ClosingStarted) {
      return { ...state, q3ClosingStarted: false };
    }
    if (
      state.activeQuest === "crossing-beam"
      && (state.q4ClosingStarted || state.q4ClosingComplete)
    ) {
      return {
        ...state,
        q4ClosingStarted: false,
        q4ClosingComplete: false,
      };
    }
    if (
      state.activeQuest !== "never-meet"
      && state.activeQuest !== "crossing-beam"
      && state.extensionOpeningComplete
    ) {
      return { ...state, extensionOpeningComplete: false };
    }
    if (
      state.activeQuest !== "never-meet"
      && state.activeQuest !== "crossing-beam"
      && state.extensionOpeningBeat > 0
    ) {
      return { ...state, extensionOpeningBeat: state.extensionOpeningBeat - 1 };
    }
    return { ...state, questStep: Math.max(0, state.questStep - 1) };
  }
  return { ...state, step: Math.max(0, state.step - 1) } as GradeSevenInteractionState;
}

export function canGoToPreviousGradeSevenEvent(state: GradeSevenInteractionState): boolean {
  if (state.kind === "mountain") {
    if (state.chapterMapOpen) return false;
    if (state.questStep > 0) return true;
    if (state.activeQuest === "cliff-checkpoints") {
      return state.q2OpeningComplete || state.q2OpeningBeat > 0;
    }
    if (state.activeQuest === "storm-moves") {
      return state.q3OpeningComplete || state.q3OpeningBeat > 0;
    }
    if (state.activeQuest === "rescue-winch") {
      return state.q4OpeningComplete || state.q4OpeningBeat > 0;
    }
    return state.openingComplete || state.openingBeat > 0;
  }
  if (state.kind === "balance") {
    if (state.chapterMapOpen) return false;
    if (state.questStep > 0) return true;
    if (state.activeQuest === "keep-it-level") {
      return state.q1OpeningComplete || state.q1OpeningBeat > 0;
    }
    if (state.activeQuest === "same-move-both-sides") {
      return state.q2OpeningComplete || state.q2OpeningBeat > 0;
    }
    if (state.activeQuest === "reveal-the-crate") {
      return state.q3OpeningComplete || state.q3OpeningBeat > 0;
    }
    if (state.activeQuest === "test-another-lock") {
      return state.q4OpeningComplete || state.q4OpeningBeat > 0;
    }
    return false;
  }
  if (state.kind === "moonbase") {
    if (state.chapterMapOpen) return false;
    return state.questStep > 0 || state.openingComplete || state.openingBeat > 0;
  }
  if (
    state.kind === "skatepark"
    && state.activeQuest
    && state.activeQuest !== "trail-meet"
    && state.activeQuest !== "crossing-rails"
  ) {
    if (state.activeQuest === "never-meet" && state.q3ClosingStarted) {
      return !state.chapterMapOpen;
    }
    if (
      state.activeQuest === "crossing-beam"
      && (state.q4ClosingStarted || state.q4ClosingComplete)
    ) {
      return !state.chapterMapOpen;
    }
    if (
      state.activeQuest !== "never-meet"
      && state.activeQuest !== "crossing-beam"
    ) {
      return !state.chapterMapOpen && (
        state.questStep > 0
        || state.extensionOpeningComplete
        || state.extensionOpeningBeat > 0
      );
    }
    return !state.chapterMapOpen && state.questStep > 0;
  }
  return state.step > 0 && !(state.kind === "skatepark" && state.chapterMapOpen);
}

export function canReplayGradeSevenEvent(progress: GradeSevenAdventureProgress | undefined, event: number): boolean {
  return !!progress && progress.seenEvents.includes(event);
}

export function shouldAwardGradeSevenCompletion(mode: GradeSevenActivityMode, alreadyCompleted: boolean): boolean {
  return mode === "live" && !alreadyCompleted;
}
