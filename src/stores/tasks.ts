import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task } from "@/types/app"
import { validateTaskText, handleStorageError, handleValidationError } from "@/utils/errorHandling"

interface TaskStore {
  tasks: Task[]
  isLoaded: boolean
  error: string | null
  addTask: (text: string, type: "task" | "routine") => void
  updateTask: (id: string, updates: Partial<Pick<Task, "text" | "type">>) => void
  completeRoutine: (id: string) => void
  removeTask: (id: string) => void
  getAvailableTasks: () => Task[]
  loadTasks: () => void
  clearError: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoaded: false,
      error: null,

      addTask: (text: string, type: "task" | "routine" = "task") => {
        try {
          validateTaskText(text)

          const newTask: Task = {
            id: crypto.randomUUID(),
            text: text.trim(),
            type,
            createdAt: new Date(),
            ...(type === "routine" && { completedDates: [] }),
          }

          set((state) => ({
            tasks: [...state.tasks, newTask],
            error: null
          }))
        } catch (error) {
          const appError = handleValidationError(error, 'addTask')
          set({ error: appError.message })
        }
      },

      updateTask: (id: string, updates: Partial<Pick<Task, "text" | "type">>) => {
        try {
          if (updates.text) {
            validateTaskText(updates.text)
          }
          
          set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
            error: null
          }))
        } catch (error) {
          const appError = handleValidationError(error, 'updateTask')
          set({ error: appError.message })
        }
      },

      completeRoutine: (id: string) => {
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id && task.type === "routine"
              ? {
                  ...task,
                  lastCompletedAt: new Date(),
                  completedDates: [...(task.completedDates || []), today]
                }
              : task
          ),
          error: null
        }))
      },

      removeTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          error: null
        }))
      },

      getAvailableTasks: () => {
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

        return get().tasks.filter((task: Task) => {
          if (task.type === "task") {
            // Regular tasks are always available unless completed today
            return true
          } else {
            // Routines are available if not completed today
            return !(task.completedDates || []).includes(today)
          }
        })
      },

      loadTasks: () => {
        set({ isLoaded: true, error: null })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "everyday-tasks",
      partialize: (state) => ({ tasks: state.tasks }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Convert date strings back to Date objects
            state.tasks = state.tasks.map((task: Task & {
              createdAt: string | number | Date;
              lastCompletedAt?: string | number | Date;
              completedDates?: string[]
            }) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              lastCompletedAt: task.lastCompletedAt ? new Date(task.lastCompletedAt) : undefined,
              type: task.type || "task",
              completedDates: task.completedDates || (task.type === "routine" ? [] : undefined),
            }))

            // Reset routines if it's a new day
            const today = new Date().toISOString().split('T')[0]
            const lastVisit = localStorage.getItem('everyday-user-preferences')
            let lastVisitDate = null

            if (lastVisit) {
              try {
                const userPrefs = JSON.parse(lastVisit)
                lastVisitDate = userPrefs.state?.preferences?.lastVisit
                  ? new Date(userPrefs.state.preferences.lastVisit).toISOString().split('T')[0]
                  : null
              } catch (e) {
                // Ignore parse errors
              }
            }

            // If it's a new day, reset completed routines
            if (lastVisitDate && lastVisitDate !== today) {
              state.tasks = state.tasks.map(task => {
                if (task.type === 'routine') {
                  return {
                    ...task,
                    completedDates: [],
                    lastCompletedAt: undefined
                  }
                }
                return task
              })
            }

            state.isLoaded = true
            state.error = null
          } catch (error) {
            const appError = handleStorageError(error, 'onRehydrateStorage')
            state.error = appError.message
            state.isLoaded = true
          }
        }
      },
    }
  )
)
