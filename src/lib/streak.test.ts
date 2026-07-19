import { describe, expect, it } from "vitest";
import { recordDailyQuest } from "./streak";

describe("daily quest streak", () => {
  it("starts a streak for a first quest", () => expect(recordDailyQuest({ dailyStreak: 0, lastCompletedDate: null }, "2026-07-19")).toEqual({ dailyStreak: 1, lastCompletedDate: "2026-07-19" }));
  it("does not double count a quest on the same day", () => expect(recordDailyQuest({ dailyStreak: 2, lastCompletedDate: "2026-07-19" }, "2026-07-19")).toEqual({ dailyStreak: 2, lastCompletedDate: "2026-07-19" }));
  it("extends a consecutive-day streak", () => expect(recordDailyQuest({ dailyStreak: 2, lastCompletedDate: "2026-07-18" }, "2026-07-19")).toEqual({ dailyStreak: 3, lastCompletedDate: "2026-07-19" }));
  it("soft resets after a gap", () => expect(recordDailyQuest({ dailyStreak: 8, lastCompletedDate: "2026-07-16" }, "2026-07-19")).toEqual({ dailyStreak: 1, lastCompletedDate: "2026-07-19" }));
});
