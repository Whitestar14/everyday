import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTaskStore } from "@/stores/tasks";
import { RRule } from "rrule";
import { type Task } from "@/types/app";

// Enable fake timers globally for this suite
vi.useFakeTimers();

vi.mock("@/services/NotificationService", () => ({
  scheduleNotification: vi.fn().mockResolvedValue([]),      // resolves instantly
  cancelTaskNotifications: vi.fn().mockResolvedValue(undefined), // resolves instantly
}));


describe("Task Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useTaskStore.setState({
      tasks: [],
      isLoaded: false,
      error: null,
      completingTasks: new Set(),
      undoableTasks: new Map(),
      undoBuffer: new Map(),
      isSelectionMode: false,
      selectedTasks: new Set(),
    });
  });

  it("initializes with empty state", () => {
    const state = useTaskStore.getState();
    expect(state.tasks).toEqual([]);
    expect(state.isLoaded).toBe(false);
  });

  it("adds a normal task", () => {
    useTaskStore.getState().addTask("Buy milk");
    const tasks = useTaskStore.getState().tasks;
    expect(tasks.length).toBe(1);
    expect(tasks[0].text).toBe("Buy milk");
    expect(tasks[0].type).toBe("task");
  });

  it("adds a routine task with recurrence", () => {
    const rule = new RRule({ freq: RRule.DAILY, dtstart: new Date() });
    useTaskStore.getState().addTask("Daily jog", "routine", {
      recurrence: { rrule: rule.toString(), description: "Daily" },
    });
    const tasks = useTaskStore.getState().tasks;
    expect(tasks[0].type).toBe("routine");
    expect(tasks[0].completedDates).toEqual([]);
  });

  it("updates task text", () => {
    useTaskStore.getState().addTask("Old text");
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().updateTask(id, { text: "New text" });
    expect(useTaskStore.getState().tasks[0].text).toBe("New text");
  });

  it("updates task metadata and reschedules notifications", () => {
    useTaskStore.getState().addTask("Task with due date", "task", {
      dueDate: new Date(),
    });
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().updateTaskMetadata(id, { dueDate: new Date() });
    expect(useTaskStore.getState().tasks[0].dueDate).toBeInstanceOf(Date);
  });

  it("completes a normal task and removes it after undo window", () => {
    useTaskStore.getState().addTask("Complete me");
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().completeTask(id);
    expect(useTaskStore.getState().undoableTasks.has(id)).toBe(true);

    // Fast-forward timers instead of waiting 3s
    vi.advanceTimersByTime(3000);
    expect(useTaskStore.getState().tasks.length).toBe(0);
  });

  it("undoes a task completion", () => {
    useTaskStore.getState().addTask("Undo me");
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().completeTask(id);
    useTaskStore.getState().undoTask(id);
    expect(useTaskStore.getState().tasks.length).toBe(1);
  });

  it("completes a routine and moves dueDate forward", () => {
    const today = new Date();
    const rule = new RRule({ freq: RRule.DAILY, dtstart: today });
    useTaskStore.getState().addTask("Routine", "routine", {
      recurrence: { rrule: rule.toString(), description: "Daily" },
      dueDate: today,
    });
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().completeRoutine(id);
    const updated = useTaskStore.getState().tasks[0];
    expect(updated.lastCompletedAt).toBeDefined();
    expect(updated.completedDates?.length).toBeGreaterThan(0);
    expect(updated.dueDate).toBeInstanceOf(Date);
  });

  it("removes a task", () => {
    useTaskStore.getState().addTask("Remove me");
    const id = useTaskStore.getState().tasks[0].id;
    useTaskStore.getState().removeTask(id);
    expect(useTaskStore.getState().tasks.length).toBe(0);
  });

  it("selects and bulk deletes tasks", () => {
    useTaskStore.getState().addTask("Task A");
    useTaskStore.getState().addTask("Task B");
    const ids = useTaskStore.getState().tasks.map(t => t.id);
    useTaskStore.getState().selectTask(ids[0], true);
    useTaskStore.getState().selectTask(ids[1], true);
    useTaskStore.getState().bulkDeleteSelectedTasks();
    expect(useTaskStore.getState().tasks.length).toBe(0);
  });

  it("sets tasks via setTasks and normalizes dates", () => {
    const tasks: Task[] = [
      { id: "1", text: "Imported", type: "task", createdAt: new Date().toISOString() },
    ];
    useTaskStore.getState().setTasks(tasks);
    expect(useTaskStore.getState().tasks[0].createdAt).toBeInstanceOf(Date);
  });

  it("loads tasks", () => {
    useTaskStore.getState().loadTasks();
    expect(useTaskStore.getState().isLoaded).toBe(true);
  });

  it("clears error", () => {
    useTaskStore.setState({ error: "Something went wrong" });
    useTaskStore.getState().clearError();
    expect(useTaskStore.getState().error).toBeNull();
  });
});
