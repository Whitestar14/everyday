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
  removeTask: (id: string) => void
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

      removeTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          error: null
        }))
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
            state.tasks = state.tasks.map((task: any) => ({
              ...task,
              createdAt: new Date(task.createdAt),
              lastCompletedAt: task.lastCompletedAt ? new Date(task.lastCompletedAt) : undefined,
              type: task.type || "task",
            }))
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
