import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  requestPermission,
  scheduleNotification,
  cancelNotification,
  cancelTaskNotifications,
  rescheduleRecurringNotifications,
} from "@/services/NotificationService";
import type { Task } from "@/types/app";

import { LocalNotifications } from "@capacitor/local-notifications";
import { getNextOccurrence } from "@/services/RecurrenceService";


vi.mock("@/services/RecurrenceService", () => ({
  getNextOccurrence: vi.fn(),
}));

describe("NotificationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("requestPermission", () => {
    it("returns true if checkPermissions already granted", async () => {
      ;(LocalNotifications.checkPermissions as any).mockResolvedValue({ display: "granted" });
      const res = await requestPermission();
      expect(res).toBe(true);
      expect(localStorage.getItem("notification_permission_granted")).toBe("granted");
    });

    it("returns false if previously denied in localStorage", async () => {
      localStorage.setItem("notification_permission_granted", "denied")
      ;(LocalNotifications.checkPermissions as any).mockResolvedValue({ display: "denied" });
      const res = await requestPermission();
      expect(res).toBe(false);
    });

    it("requests permission if not granted and not denied", async () => {
      ;(LocalNotifications.checkPermissions as any).mockResolvedValue({ display: "prompt" })
      ;(LocalNotifications.requestPermissions as any).mockResolvedValue({ display: "granted" });
      const res = await requestPermission();
      expect(res).toBe(true);
      expect(localStorage.getItem("notification_permission_granted")).toBe("granted");
    });

    it("sets denied if requestPermissions not granted", async () => {
      ;(LocalNotifications.checkPermissions as any).mockResolvedValue({ display: "prompt" })
      ;(LocalNotifications.requestPermissions as any).mockResolvedValue({ display: "denied" });
      const res = await requestPermission();
      expect(res).toBe(false);
      expect(localStorage.getItem("notification_permission_granted")).toBe("denied");
    });
  });

  describe("scheduleNotification", () => {
    const baseTask: Task = {
      id: "1",
      text: "Test task",
      type: "task",
      createdAt: new Date(),
    };

    it("returns [] if no dueDate and no recurrence", async () => {
      const res = await scheduleNotification(baseTask);
      expect(res).toEqual([]);
    });

    it("schedules for dueDate with offset", async () => {
      const due = new Date(Date.now() + 7200_000); // 2h later
      const task = { ...baseTask, dueDate: due }
  ;(LocalNotifications.schedule as any).mockResolvedValue(undefined);

      const res = await scheduleNotification(task);
      expect(res).toHaveLength(1);
      expect(LocalNotifications.schedule).toHaveBeenCalled();
    });

    it("schedules for recurrence using getNextOccurrence", async () => {
      const next = new Date(Date.now() + 7200_000) // 2h later
      ;(getNextOccurrence as any).mockReturnValue(next);
      const task = {
        ...baseTask,
        recurrence: { rrule: "FREQ=DAILY", description: "Daily" },
      }
      ;(LocalNotifications.schedule as any).mockResolvedValue(undefined);

      const res = await scheduleNotification(task);
      expect(res).toHaveLength(1);
      expect(LocalNotifications.schedule).toHaveBeenCalled();
    });

    it("returns [] if scheduleTime is in the past", async () => {
      const past = new Date(Date.now() - 1000);
      const task = { ...baseTask, dueDate: past };
      const res = await scheduleNotification(task);
      expect(res).toEqual([]);
    });
  });

  describe("cancelNotification", () => {
    it("calls LocalNotifications.cancel with parsed id", async () => {
      ;(LocalNotifications.cancel as any).mockResolvedValue(undefined);
      await cancelNotification("123");
      expect(LocalNotifications.cancel).toHaveBeenCalledWith({
        notifications: [{ id: 123 }],
      });
    });
  });

  describe("cancelTaskNotifications", () => {
    it("does nothing if no notificationIds", async () => {
      const task = { id: "1", text: "t", type: "task", createdAt: new Date() };
      await cancelTaskNotifications(task as any);
      expect(LocalNotifications.cancel).not.toHaveBeenCalled();
    });

    it("cancels all notificationIds", async () => {
      const task = {
        id: "1",
        text: "t",
        type: "task",
        createdAt: new Date(),
        notificationIds: ["1", "2"],
      }
      ;(LocalNotifications.cancel as any).mockResolvedValue(undefined);
      await cancelTaskNotifications(task as any);
      expect(LocalNotifications.cancel).toHaveBeenCalledWith({
        notifications: [{ id: 1 }, { id: 2 }],
      });
    });
  });

  describe("rescheduleRecurringNotifications", () => {
    it("cancels then schedules", async () => {
      const task = {
        id: "1",
        text: "t",
        type: "routine",
        createdAt: new Date(),
        recurrence: { rrule: "FREQ=DAILY", description: "Daily" },
        notificationIds: ["1"],
      }
    ;(LocalNotifications.cancel as any).mockResolvedValue(undefined)
      ;(LocalNotifications.schedule as any).mockResolvedValue(undefined)
      // Make next occurrence far enough in the future
      ;(getNextOccurrence as any).mockReturnValue(new Date(Date.now() + 7200_000));

      const res = await rescheduleRecurringNotifications(task as any);
      expect(LocalNotifications.cancel).toHaveBeenCalled();
      expect(LocalNotifications.schedule).toHaveBeenCalled();
      expect(res).toHaveLength(1);
    });
  });
});
