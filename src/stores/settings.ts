import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { handleStorageError } from '@/utils/errorHandling'

interface SettingsStore {
  newTasksOnTop: boolean
  isLoaded: boolean
  error: string | null
  setNewTasksOnTop: (value: boolean) => void
  loadSettings: () => void
  clearError: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
  (set) => ({
      newTasksOnTop: true,
      isLoaded: false,
      error: null,

      setNewTasksOnTop: (value: boolean) => {
        set({ newTasksOnTop: value, error: null })
      },


      loadSettings: () => {
        set({ isLoaded: true, error: null })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'everyday-settings',
      partialize: (state) => ({
        newTasksOnTop: state.newTasksOnTop
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
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
