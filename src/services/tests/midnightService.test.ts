import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  setupMidnightRunner,
  calculateTimeUntilMidnight,
  onMidnightTick,
  recalculateTodayTasks,
} from "@/services/MidnightService";
import { RRule } from "rrule";

describe("MidnightService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculateTimeUntilMidnight returns positive ms until midnight", () => {
    const ms = calculateTimeUntilMidnight();
    expect(ms).toBeGreaterThan(0);
    // Should be less than 24h in ms
    expect(ms).toBeLessThan(24 * 60 * 60 * 1000);
  });

  it("onMidnightTick registers callbacks and setupMidnightRunner triggers them", () => {
    const cb = vi.fn();
    onMidnightTick(cb);

    setupMidnightRunner();
    expect(cb).toHaveBeenCalled();
  });

  it("setupMidnightRunner stores lastMidnightCheck in localStorage", () => {
    setupMidnightRunner();
    const stored = localStorage.getItem("lastMidnightCheck");
    expect(stored).not.toBeNull();
  });

  it("setupMidnightRunner triggers callbacks only when day changes", () => {
    const cb = vi.fn();
    onMidnightTick(cb);

    // First run triggers
    setupMidnightRunner();
    expect(cb).toHaveBeenCalledTimes(1);

    // Simulate same day check
    const last = localStorage.getItem("lastMidnightCheck");
    expect(last).not.toBeNull();

    // Advance less than a day
    vi.advanceTimersByTime(60000); // one minute
    expect(cb).toHaveBeenCalledTimes(1);
  });

  describe("recalculateTodayTasks", () => {
    it("includes tasks due today", () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const task = { id: "1", text: "due today", type: "task", createdAt: new Date(), dueDate: today };
      const result = recalculateTodayTasks([task as any]);
      expect(result.length).toBe(1);
    });

    it("includes tasks starting today or earlier", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const task = { id: "2", text: "started earlier", type: "task", createdAt: new Date(), startDate: today };
      const result = recalculateTodayTasks([task as any]);
      expect(result.length).toBe(1);
    });

    it("includes recurring tasks scheduled for today", () => {
      const today = new Date();
      const rule = new RRule({ freq: RRule.DAILY, dtstart: today });
      const task = {
        id: "3",
        text: "recurring",
        type: "routine",
        createdAt: new Date(),
        recurrence: { rrule: rule.toString(), description: "Daily" },
      };
      const result = recalculateTodayTasks([task as any]);
      expect(result.length).toBe(1);
    });

    it("excludes completed one-time tasks from previous days", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task = {
        id: "4",
        text: "completed yesterday",
        type: "task",
        createdAt: new Date(),
        dueDate: yesterday,
        lastCompletedAt: new Date(),
      };
      const result = recalculateTodayTasks([task as any]);
      expect(result.length).toBe(0);
    });

    it("resets lastCompletedAt for recurring tasks", () => {
      const today = new Date();
      const rule = new RRule({ freq: RRule.DAILY, dtstart: today });
      const task = {
        id: "5",
        text: "recurring completed",
        type: "routine",
        createdAt: new Date(),
        recurrence: { rrule: rule.toString(), description: "Daily" },
        lastCompletedAt: new Date(),
      };
      const result = recalculateTodayTasks([task as any]);
      expect(result[0].lastCompletedAt).toBeUndefined();
    });
  });
});
