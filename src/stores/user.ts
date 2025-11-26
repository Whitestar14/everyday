import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { handleStorageError, handleValidationError } from '@/utils/errorHandling'

interface UserPreferences {
  name: string | null
  avatar: string
  hasCompletedOnboarding: boolean
  lastVisit: Date | null
}

interface UserStore {
  preferences: UserPreferences
  isLoaded: boolean
  error: string | null
  setName: (name: string | null) => void
  setAvatar: (avatar: string) => void
  completeOnboarding: () => void
  updateLastVisit: () => void
  loadPreferences: () => void
  clearError: () => void
  // replace preferences directly (used by import)
  setPreferences: (prefs: UserPreferences) => void
}

const defaultPreferences: UserPreferences = {
  name: null,
  avatar: '',
  hasCompletedOnboarding: false,
  lastVisit: null
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      isLoaded: false,
      error: null,
      
      setName: (name: string | null) => {
        try {
          if (name !== null) {
            if (typeof name !== 'string') {
              throw new Error('Name must be a string')
            }

            const trimmed = name.trim()
            if (trimmed.length === 0) {
              throw new Error('Name cannot be empty')
            }

            if (trimmed.length > 50) {
              throw new Error('Name cannot exceed 50 characters')
            }

            set((state) => ({
              preferences: { ...state.preferences, name: trimmed },
              error: null
            }))
          } else {
            set((state) => ({
              preferences: { ...state.preferences, name: null },
              error: null
            }))
          }
        } catch (error) {
          const appError = handleValidationError(error, 'setName')
          set({ error: appError.message })
        }
      },

      setAvatar: (avatar: string) => {
        try {
          if (typeof avatar !== 'string' || avatar.length === 0) {
            throw new Error('Avatar must be a non-empty string')
          }

          set((state) => ({
            preferences: { ...state.preferences, avatar },
            error: null
          }))
        } catch (error) {
          const appError = handleValidationError(error, 'setAvatar')
          set({ error: appError.message })
        }
      },
      
      completeOnboarding: () => {
        set((state) => ({
          preferences: { ...state.preferences, hasCompletedOnboarding: true },
          error: null
        }))
      },
      
      updateLastVisit: () => {
        set((state) => ({
          preferences: { ...state.preferences, lastVisit: new Date() },
          error: null
        }))
      },
      
      loadPreferences: () => {
        set({ isLoaded: true, error: null })
      },

      setPreferences: (prefs: UserPreferences) => {
        try {
          set({ preferences: prefs, error: null })
        } catch (error) {
          const appError = handleStorageError(error, 'setPreferences')
          set({ error: appError.message })
        }
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'everyday-user-preferences',
      partialize: (state) => ({ preferences: state.preferences }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Convert date strings back to Date objects
            state.preferences = {
              ...state.preferences,
              lastVisit: state.preferences.lastVisit ? new Date(state.preferences.lastVisit as string | number | Date) : null
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
