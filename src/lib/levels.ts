export const LEVEL_THRESHOLDS = [0, 3, 7, 12, 18, 25, 33, 42, 52, 63];
const BEYOND_TABLE_STEP = 12;

// Level N requires LEVEL_THRESHOLDS[N-1] lifetime discoveries; after the
// table, each level needs 12 more. Monotonic input -> monotonic level.
export function getExplorerLevel(lifetimeDiscoveries: number): { level: number; toNext: number } {
  const discoveries = Math.max(0, Math.floor(lifetimeDiscoveries));
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (discoveries >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  let nextAt = level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + BEYOND_TABLE_STEP;
  while (discoveries >= nextAt) {
    level++;
    nextAt += BEYOND_TABLE_STEP;
  }
  return { level, toNext: nextAt - discoveries };
}
