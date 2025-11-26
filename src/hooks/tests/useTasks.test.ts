import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTasks } from "@/hooks/useTasks";

// Mocks
const mockStore = {
  tasks: [] as any[],
  isLoaded: true,
  error: null as string | null,
  addTask: vi.fn(),
  updateTask: vi.fn(),
  removeTask: vi.fn(),
  getAvailableTasks: vi.fn(() => []),
  getInboxTasks: vi.fn(() => []),
  getTodayTasks: vi.fn(() => []),
  completeTask: vi.fn(),
  undoTask: vi.fn(),
  completingTasks: new Set<string>(),
  undoableTasks: new Map<string, number>(),
  isSelectionMode: false,
  selectedTasks: new Set<string>(),
  toggleSelectionMode: vi.fn(),
  selectTask: vi.fn(),
  selectAllTasks: vi.fn(),
  clearSelection: vi.fn(),
  bulkDeleteSelectedTasks: vi.fn(),
  loadTasks: vi.fn(),
  clearError: vi.fn(),
};

vi.mock("@/stores/tasks", () => ({
  useTaskStore: () => mockStore,
}));

vi.mock("@/stores/settings", () => ({
  useSettingsStore: () => ({ newTasksOnTop: true }),
}));

vi.mock("@/services/TaskService", () => ({
  TaskService: {
    validateTask: vi.fn(),
    updateTask: vi.fn((task, updates) => ({ ...task, ...updates })),
    filterTasksByType: vi.fn((tasks, type) => tasks.filter(t => !type || t.type === type)),
    sortTasksByDate: vi.fn((tasks, ascending = false) =>
      [...tasks].sort((a, b) => {
        const aT = a.createdAt.getTime();
        const bT = b.createdAt.getTime();
        return ascending ? aT - bT : bT - aT;
      })
    ),
  },
}));

// Import after mocks so the hook uses them
import { TaskService } from "@/services/TaskService";

describe("useTasks hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // reset store state
    mockStore.tasks = [];
    mockStore.getAvailableTasks.mockReturnValue([]);
    mockStore.error = null;
    mockStore.isSelectionMode = false;
    mockStore.selectedTasks = new Set();
  });

  it("exposes tasks and error state", () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("calls TaskService.validateTask and storeAddTask on addTask", () => {
    const { result } = renderHook(() => useTasks());
    const text = "New Task";
    act(() => {
      const ok = result.current.addTask(text);
      expect(ok).toBe(true);
    });
    expect(TaskService.validateTask).toHaveBeenCalledWith(text);
    expect(mockStore.addTask).toHaveBeenCalledWith(text, "task", undefined);
  });

  it("returns false when addTask validation fails", () => {
    TaskService.validateTask.mockImplementationOnce(() => {
      throw new Error("Invalid");
    });
    const { result } = renderHook(() => useTasks());
    const ok = result.current.addTask("");
    expect(ok).toBe(false);
  });

  it("calls TaskService.updateTask and storeUpdateTask on updateTask", () => {
    const fakeTask = { id: "1", text: "Old", type: "task", createdAt: new Date() };
    mockStore.tasks = [fakeTask];
    const { result } = renderHook(() => useTasks());
    act(() => {
      const ok = result.current.updateTask("1", { text: "Updated" });
      expect(ok).toBe(true);
    });
    expect(TaskService.updateTask).toHaveBeenCalledWith(fakeTask, { text: "Updated" });
    expect(mockStore.updateTask).toHaveBeenCalledWith("1", { text: "Updated" });
  });

  it("calls storeRemoveTask on deleteTask", () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      const ok = result.current.deleteTask("1");
      expect(ok).toBe(true);
    });
    expect(mockStore.removeTask).toHaveBeenCalledWith("1");
  });

  it("wraps completeTask and undoTaskCompletion with useCallback", () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.completeTask("1");
      result.current.undoTaskCompletion("1");
    });
    expect(mockStore.completeTask).toHaveBeenCalledWith("1");
    expect(mockStore.undoTask).toHaveBeenCalledWith("1");
  });

  it("filters tasks by type using TaskService", () => {
    const tasks = [
      { id: "1", text: "A", type: "task", createdAt: new Date() },
      { id: "2", text: "B", type: "routine", createdAt: new Date() },
    ];
    mockStore.tasks = tasks;
    const { result } = renderHook(() => useTasks());
    const filtered = result.current.getFilteredTasks("task");
    expect(TaskService.filterTasksByType).toHaveBeenCalledWith(tasks, "task");
    expect(filtered.map(t => t.text)).toEqual(["A"]);
  });

  it("sorts tasks by date using TaskService", () => {
    const tasks = [
      { id: "1", text: "A", type: "task", createdAt: new Date(2020, 1, 1) },
      { id: "2", text: "B", type: "task", createdAt: new Date(2021, 1, 1) },
    ];
    mockStore.tasks = tasks;
    const { result } = renderHook(() => useTasks());
    const sorted = result.current.getSortedTasks(true);
    expect(TaskService.sortTasksByDate).toHaveBeenCalledWith(tasks, true);
    expect(sorted[0].id).toBe("1");
    expect(sorted[1].id).toBe("2");
  });

  it("sorts availableTasks according to newTasksOnTop", () => {
    const tasks = [
      { id: "1", text: "A", type: "task", createdAt: new Date(2020, 1, 1) },
      { id: "2", text: "B", type: "task", createdAt: new Date(2021, 1, 1) },
    ];
    mockStore.getAvailableTasks.mockReturnValue(tasks);
    const { result } = renderHook(() => useTasks());
    const available = result.current.availableTasks;
    expect(available.map(t => t.id)).toEqual(["2", "1"]); // newest first because newTasksOnTop = true
  });
});
