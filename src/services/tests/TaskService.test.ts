import { describe, it, expect, beforeEach, vi } from "vitest";
import { TaskService } from "@/services/TaskService";
import type { Task } from "@/types/app";

describe("TaskService", () => {
  let baseTask: Task;

  beforeEach(() => {
    // deterministic UUID for tests
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("test-uuid");
    baseTask = {
      id: "1",
      text: "Sample",
      type: "task",
      createdAt: new Date("2025-01-01T00:00:00Z"),
    };
  });

  describe("validateTask", () => {
    it("throws if text is not a string", () => {
      expect(() => TaskService.validateTask(null as any)).toThrow(/non-empty string/);
      expect(() => TaskService.validateTask(123 as any)).toThrow(/non-empty string/);
    });

    it("throws if text is empty or whitespace", () => {
      expect(() => TaskService.validateTask("")).toThrow(/cannot be empty/);
      expect(() => TaskService.validateTask("   ")).toThrow(/cannot be empty/);
    });

    it("throws if text exceeds 200 chars", () => {
      const longText = "a".repeat(201);
      expect(() => TaskService.validateTask(longText)).toThrow(/exceed 200/);
    });

    it("passes for valid text", () => {
      expect(() => TaskService.validateTask("Do homework")).not.toThrow();
    });
  });

  describe("createTask", () => {
    it("creates a task with trimmed text and default type", () => {
      const task = TaskService.createTask("  Buy milk  ");
      expect(task.text).toBe("Buy milk");
      expect(task.type).toBe("task");
      expect(task.id).toBe("test-uuid");
      expect(task.createdAt).toBeInstanceOf(Date);
    });

    it("creates a routine task when type is specified", () => {
      const task = TaskService.createTask("Jog", "routine");
      expect(task.type).toBe("routine");
    });

    it("throws for invalid text", () => {
      expect(() => TaskService.createTask("")).toThrow();
    });
  });

  describe("updateTask", () => {
    it("updates text and trims it", () => {
      const updated = TaskService.updateTask(baseTask, { text: "  New text  " });
      expect(updated.text).toBe("New text");
    });

    it("updates type", () => {
      const updated = TaskService.updateTask(baseTask, { type: "routine" });
      expect(updated.type).toBe("routine");
    });

    it("throws if new text is invalid", () => {
      expect(() => TaskService.updateTask(baseTask, { text: "" })).toThrow();
    });

    it("keeps original text if no update provided", () => {
      const updated = TaskService.updateTask(baseTask, {});
      expect(updated.text).toBe(baseTask.text);
    });
  });

  describe("markTaskCompleted", () => {
    it("adds lastCompletedAt timestamp", () => {
      const completed = TaskService.markTaskCompleted(baseTask);
      expect(completed.lastCompletedAt).toBeInstanceOf(Date);
    });
  });

  describe("filterTasksByType", () => {
    const tasks: Task[] = [
      { ...baseTask, id: "1", type: "task" },
      { ...baseTask, id: "2", type: "routine" },
    ];

    it("returns all tasks if no type specified", () => {
      expect(TaskService.filterTasksByType(tasks)).toHaveLength(2);
    });

    it("filters only tasks of given type", () => {
      const filtered = TaskService.filterTasksByType(tasks, "routine");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].type).toBe("routine");
    });
  });

  describe("sortTasksByDate", () => {
    const tasks: Task[] = [
      { ...baseTask, id: "1", createdAt: new Date("2025-01-02") },
      { ...baseTask, id: "2", createdAt: new Date("2025-01-01") },
    ];

    it("sorts descending by default", () => {
      const sorted = TaskService.sortTasksByDate(tasks);
      expect(sorted[0].id).toBe("1");
    });

    it("sorts ascending when specified", () => {
      const sorted = TaskService.sortTasksByDate(tasks, true);
      expect(sorted[0].id).toBe("2");
    });

    it("does not mutate original array", () => {
      const copy = [...tasks];
      TaskService.sortTasksByDate(copy);
      expect(copy).toEqual(tasks);
    });
  });
});
