export const GRADE_SEVEN_ADVENTURE_IDS = ["mountain", "balance", "shop", "skatepark", "cricket"] as const;

export type GradeSevenAdventureId = typeof GRADE_SEVEN_ADVENTURE_IDS[number];
export type GradeSevenActivityMode = "live" | "replay";
export type DemoMode = "level" | "tipped";

type SharedState = {
  step: number;
  showDemo: boolean;
  successChoice: string | null;
};

export type MountainState = SharedState & {
  kind: "mountain";
  position: number;
  returnPosition: number;
  briefingBeat: number;
  flightPath: number[];
  direction: string | null;
  equation: string | null;
};

export type BalanceState = SharedState & {
  kind: "balance";
  removed: number;
  rule: string | null;
  value: string | null;
  demoMode: DemoMode;
};

export type ShopState = SharedState & {
  kind: "shop";
  quarterPick: string | null;
  discount: number;
  offer: string | null;
};

export type SkateparkState = SharedState & {
  kind: "skatepark";
  angle: number;
  triangleAngle: string | null;
  meaning: string | null;
};

export type CricketState = SharedState & {
  kind: "cricket";
  picked: string[];
  topPlayer: string | null;
  reason: string | null;
};

export type GradeSevenInteractionState =
  | MountainState
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
  mountain: ["The storm signal", "Zero base camp", "Below zero", "The flight log", "The climb home"],
  balance: ["The locked crate", "The fair scale", "The balance rule", "The hidden value", "The crate opens"],
  shop: ["Two shops", "One quarter", "The price bar", "The better deal", "The saving explained"],
  skatepark: ["The rooftop plan", "The turning ramp", "The triangle secret", "Builder language", "The course opens"],
  cricket: ["The squad problem", "Reading one bar", "Choosing three", "Using evidence", "The squad decision"],
};

export function isGradeSevenAdventureId(value: unknown): value is GradeSevenAdventureId {
  return typeof value === "string" && GRADE_SEVEN_ADVENTURE_IDS.includes(value as GradeSevenAdventureId);
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, Math.floor(value)));
const stringOrNull = (value: unknown) => typeof value === "string" ? value : null;
const boolOr = (value: unknown, fallback: boolean) => typeof value === "boolean" ? value : fallback;
const numberOr = (value: unknown, fallback: number, min: number, max: number) =>
  typeof value === "number" && Number.isFinite(value) ? clamp(value, min, max) : fallback;

function integerTrail(from: number, to: number): number[] {
  const direction = to >= from ? 1 : -1;
  return Array.from({ length: Math.abs(to - from) + 1 }, (_, index) => from + index * direction);
}

function mountainTrail(value: unknown, position: number): number[] {
  if (!Array.isArray(value)) return integerTrail(3, position);
  const clean = value
    .filter((item): item is number => typeof item === "number" && Number.isInteger(item) && item >= -8 && item <= 8)
    .slice(-40);
  return clean.length > 0 ? clean : integerTrail(3, position);
}

export function createGradeSevenState(id: GradeSevenAdventureId, step = 0): GradeSevenInteractionState {
  const shared = { step: clamp(step, 0, 5), showDemo: true, successChoice: null };
  if (id === "mountain") {
    const position = step >= 2 ? -4 : 3;
    return {
      ...shared,
      kind: "mountain",
      position,
      returnPosition: -4,
      briefingBeat: 0,
      flightPath: integerTrail(3, position),
      direction: null,
      equation: null,
    };
  }
  if (id === "balance") return { ...shared, kind: "balance", removed: 0, rule: null, value: null, demoMode: "level" };
  if (id === "shop") return { ...shared, kind: "shop", quarterPick: null, discount: 0, offer: null };
  if (id === "skatepark") return { ...shared, kind: "skatepark", angle: 20, triangleAngle: null, meaning: null };
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
  if (id === "mountain") return {
    ...shared,
    kind: "mountain",
    position: numberOr(raw.position, shared.step >= 2 ? -4 : 3, -8, 8),
    returnPosition: numberOr(raw.returnPosition, -4, -8, 8),
    briefingBeat: numberOr(raw.briefingBeat, 0, 0, 3),
    flightPath: mountainTrail(raw.flightPath, numberOr(raw.position, shared.step >= 2 ? -4 : 3, -8, 8)),
    direction: stringOrNull(raw.direction),
    equation: stringOrNull(raw.equation),
  };
  if (id === "balance") return {
    ...shared,
    kind: "balance",
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
  if (id === "skatepark") return {
    ...shared,
    kind: "skatepark",
    angle: numberOr(raw.angle, 20, 0, 120),
    triangleAngle: stringOrNull(raw.triangleAngle),
    meaning: stringOrNull(raw.meaning),
  };
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
    const interactionState = sanitizeGradeSevenState(id, record.interactionState);
    const seenEvents = Array.isArray(record.seenEvents)
      ? [...new Set(record.seenEvents.filter((event): event is number => typeof event === "number" && Number.isInteger(event) && event >= 0 && event <= 4))].sort()
      : [];
    if (interactionState.step <= 4 && !seenEvents.includes(interactionState.step)) seenEvents.push(interactionState.step);
    clean[id] = {
      seenEvents: seenEvents.sort(),
      lastEvent: numberOr(record.lastEvent, Math.min(interactionState.step, 4), 0, 4),
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
  return { ...state, step: Math.max(0, state.step - 1) } as GradeSevenInteractionState;
}

export function canReplayGradeSevenEvent(progress: GradeSevenAdventureProgress | undefined, event: number): boolean {
  return !!progress && progress.seenEvents.includes(event);
}

export function shouldAwardGradeSevenCompletion(mode: GradeSevenActivityMode, alreadyCompleted: boolean): boolean {
  return mode === "live" && !alreadyCompleted;
}
