import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task } from "@/types/app";
import {
  validateTaskText,
  handleStorageError,
  handleValidationError,
} from "@/utils/errorHandling";
import {
  scheduleNotification,
  cancelTaskNotifications,
} from "@/services/NotificationService";
import {
  shouldShowToday,
  getNextOccurrence,
} from "@/services/RecurrenceService";
import { RRule } from "rrule";

interface TaskStore {
  tasks: Task[];
  isLoaded: boolean;
  error: string | null;
  completingTasks: Set<string>;
  undoableTasks: Map<string, number>;
  undoBuffer: Map<string, Task>;
  // selection state for bulk actions
  isSelectionMode: boolean;
  selectedTasks: Set<string>;
  toggleSelectionMode: (value?: boolean) => void;
  selectTask: (taskId: string, selected?: boolean) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  bulkDeleteSelectedTasks: () => void;
  addTask: (
    text: string,
    type: "task" | "routine",
    metadata?: Partial<Task>,
  ) => void;
  updateTask: (
    id: string,
    updates: Partial<Pick<Task, "text" | "type">>,
  ) => void;
  updateTaskMetadata: (id: string, metadata: Partial<Task>) => void;
  moveTaskToSpace: (taskId: string, spaceId: string) => void;
  moveTaskToProject: (taskId: string, projectId: string) => void;
  completeTask: (taskId: string) => void;
  undoTask: (taskId: string) => void;
  completeRoutine: (id: string) => void;
  removeTask: (id: string) => void;
  getAvailableTasks: () => Task[];
  getTodayTasks: () => Task[];
  getInboxTasks: () => Task[];
  loadTasks: () => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoaded: false,
      error: null,
      completingTasks: new Set<string>(),
      undoableTasks: new Map<string, number>(),
      undoBuffer: new Map<string, Task>(),
  isSelectionMode: false,
  selectedTasks: new Set<string>(),

      addTask: (
        text: string,
        type: "task" | "routine" = "task",
        metadata?: Partial<Task>,
      ) => {
        try {
          validateTaskText(text);

          const newTask: Task = {
            id: crypto.randomUUID(),
            text: text.trim(),
            type,
            createdAt: new Date(),
            ...(type === "routine" && { completedDates: [] }),
            ...metadata,
          };

          set((state) => ({
            tasks: [...state.tasks, newTask],
            error: null,
          }));

          // Schedule notifications if dueDate or recurrence
          if (metadata?.dueDate || metadata?.recurrence) {
            scheduleNotification(newTask).then((ids) => {
              set((state) => ({
                tasks: state.tasks.map((t) =>
                  t.id === newTask.id ? { ...t, notificationIds: ids } : t,
                ),
              }));
            });
          }
        } catch (error) {
          const appError = handleValidationError(error, "addTask");
          set({ error: appError.message });
        }
      },

      updateTask: (
        id: string,
        updates: Partial<Pick<Task, "text" | "type">>,
      ) => {
        try {
          if (updates.text) {
            validateTaskText(updates.text);
          }

          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task,
            ),
            error: null,
          }));
        } catch (error) {
          const appError = handleValidationError(error, "updateTask");
          set({ error: appError.message });
        }
      },

      updateTaskMetadata: (id: string, metadata: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...metadata } : task,
          ),
          error: null,
        }));

        // Handle notifications: cancel old, schedule new
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          cancelTaskNotifications(task).then(() => {
            const updatedTask = { ...task, ...metadata };
            if (updatedTask.dueDate || updatedTask.recurrence) {
              scheduleNotification(updatedTask).then((ids) => {
                set((state) => ({
                  tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, notificationIds: ids } : t,
                  ),
                }));
              });
            }
          });
        }
      },

      moveTaskToSpace: (taskId: string, spaceId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, spaceId, projectId: undefined }
              : task,
          ),
        }));
      },

      moveTaskToProject: (taskId: string, projectId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, projectId } : task,
          ),
        }));
      },

      completeTask: (taskId: string) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;

        set((state) => ({
          undoBuffer: new Map(state.undoBuffer).set(taskId, { ...task }),
        }));

        set((state) => ({
          completingTasks: new Set(state.completingTasks).add(taskId),
        }));

        const expiry = Date.now() + 5000;
        set((state) => ({
          undoableTasks: new Map(state.undoableTasks).set(taskId, expiry),
        }));

        setTimeout(() => {
          set((state) => {
            const newCompleting = new Set(state.completingTasks);
            newCompleting.delete(taskId);
            return { completingTasks: newCompleting };
          });

          // Check if task was undone; if not, complete/remove it
          const currentUndoable = get().undoableTasks;
          if (currentUndoable.has(taskId)) {
            if (task.type === "routine") {
              get().completeRoutine(taskId);
            } else {
              set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== taskId),
              }));
            }
          }

          set((state) => {
            const newUndoable = new Map(state.undoableTasks);
            newUndoable.delete(taskId);
            return { undoableTasks: newUndoable };
          });
        }, 5000);
      },

      toggleSelectionMode: (value?: boolean) => {
        set((state) => {
          const enabled = value !== undefined ? value : !state.isSelectionMode;
          return {
            isSelectionMode: enabled,
            selectedTasks: enabled ? state.selectedTasks : new Set<string>(),
          };
        });
      },

      selectTask: (taskId: string, selected?: boolean) => {
        set((state) => {
          const newSelected = new Set(state.selectedTasks);
          const isSelected = newSelected.has(taskId);
          const shouldSelect = selected !== undefined ? selected : !isSelected;
          if (shouldSelect) newSelected.add(taskId); else newSelected.delete(taskId);
          return {
            selectedTasks: newSelected,
            isSelectionMode: newSelected.size > 0 || state.isSelectionMode,
          };
        });
      },

      selectAllTasks: () => {
        set((state) => ({
          selectedTasks: new Set(state.tasks.map((t) => t.id)),
          isSelectionMode: true,
        }))
      },

      clearSelection: () => {
        set(() => ({ selectedTasks: new Set<string>(), isSelectionMode: false }))
      },

      bulkDeleteSelectedTasks: () => {
        set((state) => {
          const remaining = state.tasks.filter(task => !state.selectedTasks.has(task.id));
          return { tasks: remaining, selectedTasks: new Set<string>(), isSelectionMode: false };
        });
      },

      undoTask: (taskId: string) => {
        const originalTask = get().undoBuffer.get(taskId);
        if (!originalTask) return;

        set((state) => {
          // Remove any pending completing state for the task
          const newCompleting = new Set(state.completingTasks);
          newCompleting.delete(taskId);

          // If the task is already present, don't add (avoid duplicates)
          const alreadyExists = state.tasks.some((t) => t.id === taskId);
          const newTasks = alreadyExists
            ? state.tasks
            : [...state.tasks, originalTask];

          const newUndoable = new Map(state.undoableTasks);
          newUndoable.delete(taskId);
          const newBuffer = new Map(state.undoBuffer);
          newBuffer.delete(taskId);

          return {
            tasks: newTasks,
            completingTasks: newCompleting,
            undoableTasks: newUndoable,
            undoBuffer: newBuffer,
          };
        });
      },

      completeRoutine: (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        if (task.recurrence) {
          // Create new instance for next occurrence
          const rule = RRule.fromString(task.recurrence.rrule);
          const nextDate = getNextOccurrence(rule, new Date());
          const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            dueDate: nextDate,
            lastCompletedAt: new Date(),
            notificationIds: [],
          };
          set((state) => ({
            tasks: [...state.tasks, newTask],
          }));
          // Schedule for new task
          scheduleNotification(newTask).then((ids) => {
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === newTask.id ? { ...t, notificationIds: ids } : t,
              ),
            }));
          });
        } else {
          // Original logic
          const today = new Date().toISOString().split("T")[0];
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id && t.type === "routine"
                ? {
                    ...t,
                    lastCompletedAt: new Date(),
                    completedDates: [...(t.completedDates || []), today],
                  }
                : t,
            ),
            error: null,
          }));
        }
      },

      removeTask: (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          cancelTaskNotifications(task);
        }
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          error: null,
        }));
      },

      getAvailableTasks: () => {
        const today = new Date().toISOString().split("T")[0];

        return get().tasks.filter((task: Task) => {
          if (task.type === "task") {
            // Regular tasks are always available unless completed today
            return true;
          } else {
            // Routines are available if not completed today
            return !(task.completedDates || []).includes(today);
          }
        });
      },

      getTodayTasks: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return get()
          .tasks.filter((task) => {
            if (
              task.dueDate &&
              task.dueDate >= today &&
              task.dueDate < tomorrow
            )
              return true;
            if (task.startDate && task.startDate <= today) return true;
            if (task.recurrence && shouldShowToday(task)) return true;
            // Include undated tasks (no dueDate, startDate, recurrence)
            if (!task.dueDate && !task.startDate && !task.recurrence) return true;
            return false;
          })
          .sort((a, b) => {
            const aDue = a.dueDate ? a.dueDate.getTime() : Infinity;
            const bDue = b.dueDate ? b.dueDate.getTime() : Infinity;
            if (aDue !== bDue) return aDue - bDue;
            return a.createdAt.getTime() - b.createdAt.getTime();
          });
      },

      getInboxTasks: () => {
        return get().tasks;
      },

      // getLibraryTasks removed — library view deprecated

      loadTasks: () => {
        set({ isLoaded: true, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "everyday-tasks",
      partialize: (state) => ({ tasks: state.tasks }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Convert date strings back to Date objects
            state.tasks = state.tasks.map(
              (
                task: Task & {
                  createdAt: string | number | Date;
                  lastCompletedAt?: string | number | Date;
                  dueDate?: string | number | Date;
                  startDate?: string | number | Date;
                  completedDates?: string[];
                },
              ) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                lastCompletedAt: task.lastCompletedAt
                  ? new Date(task.lastCompletedAt)
                  : undefined,
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                startDate: task.startDate
                  ? new Date(task.startDate)
                  : undefined,
                type: task.type || "task",
                completedDates:
                  task.completedDates ||
                  (task.type === "routine" ? [] : undefined),
                notificationIds: task.notificationIds || [],
              }),
            );

            // Reset routines if it's a new day
            const today = new Date().toISOString().split("T")[0];
            const lastVisit = localStorage.getItem("everyday-user-preferences");
            let lastVisitDate = null;

            if (lastVisit) {
              try {
                const userPrefs = JSON.parse(lastVisit);
                lastVisitDate = userPrefs.state?.preferences?.lastVisit
                  ? new Date(userPrefs.state.preferences.lastVisit)
                      .toISOString()
                      .split("T")[0]
                  : null;
              } catch {
                // Ignore parse errors
              }
            }

            // If it's a new day, reset completed routines
            if (lastVisitDate && lastVisitDate !== today) {
              state.tasks = state.tasks.map((task) => {
                if (task.type === "routine") {
                  return {
                    ...task,
                    completedDates: [],
                    lastCompletedAt: undefined,
                  };
                }
                return task;
              });
            }

            state.isLoaded = true;
            state.error = null;
          } catch (error) {
            const appError = handleStorageError(error, "onRehydrateStorage");
            state.error = appError.message;
            state.isLoaded = true;
          }
        }
      },
    },
  ),
);
