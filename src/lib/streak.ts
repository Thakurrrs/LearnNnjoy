export type StreakState = { dailyStreak: number; lastCompletedDate: string | null };

function previousDate(date: string): string {
  const current = new Date(`${date}T00:00:00.000Z`);
  current.setUTCDate(current.getUTCDate() - 1);
  return current.toISOString().slice(0, 10);
}

export function recordDailyQuest(state: StreakState, today: string): StreakState {
  if (state.lastCompletedDate === today) return state;
  if (state.lastCompletedDate === previousDate(today)) return { dailyStreak: state.dailyStreak + 1, lastCompletedDate: today };
  return { dailyStreak: 1, lastCompletedDate: today };
}
