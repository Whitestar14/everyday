import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ButtonPosition, ThemeMode } from '@/types/app'
import { validateButtonPosition, validateThemeMode, handleStorageError, handleValidationError } from '@/utils/errorHandling'

interface SettingsStore {
  buttonPosition: ButtonPosition
  themeMode: ThemeMode
  isLoaded: boolean
  error: string | null
  setButtonPosition: (position: ButtonPosition) => void
  setThemeMode: (theme: ThemeMode) => void
  getButtonPositionStyles: () => string
  loadSettings: () => void
  clearError: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      buttonPosition: 'bottom-right',
      themeMode: 'system',
      isLoaded: false,
      error: null,

      setButtonPosition: (position: ButtonPosition) => {
        try {
          validateButtonPosition(position)
          set({ buttonPosition: position, error: null })
        } catch (error) {
          const appError = handleValidationError(error, 'setButtonPosition')
          set({ error: appError.message })
        }
      },

      setThemeMode: (theme: ThemeMode) => {
        try {
          validateThemeMode(theme)
          set({ themeMode: theme, error: null })
        } catch (error) {
          const appError = handleValidationError(error, 'setThemeMode')
          set({ error: appError.message })
        }
      },

      getButtonPositionStyles: () => {
        const { buttonPosition } = get()
        switch (buttonPosition) {
          case 'bottom-left':
            return 'bottom-6 left-6'
          case 'bottom-center':
            return 'bottom-6 left-1/2 -translate-x-1/2'
          default:
            return 'bottom-6 right-6'
        }
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
        buttonPosition: state.buttonPosition, 
        themeMode: state.themeMode 
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
