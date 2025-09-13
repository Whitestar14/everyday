import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { validateEnergyLevel, handleStorageError, handleValidationError } from '@/utils/errorHandling'

interface UserPreferences {
  name: string
  energyLevel: number
  hasCompletedOnboarding: boolean
  lastVisit: Date | null
}

interface UserStore {
  preferences: UserPreferences
  isLoaded: boolean
  error: string | null
  setName: (name: string) => void
  setEnergyLevel: (level: number) => void
  completeOnboarding: () => void
  updateLastVisit: () => void
  loadPreferences: () => void
  clearError: () => void
}

const defaultPreferences: UserPreferences = {
  name: '',
  energyLevel: 3,
  hasCompletedOnboarding: false,
  lastVisit: null
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      isLoaded: false,
      error: null,
      
      setName: (name: string) => {
        try {
          if (typeof name !== 'string') {
            throw new Error('Name must be a string')
          }
          
          set((state) => ({
            preferences: { ...state.preferences, name: name.trim() },
            error: null
          }))
        } catch (error) {
          const appError = handleValidationError(error, 'setName')
          set({ error: appError.message })
        }
      },
      
      setEnergyLevel: (energyLevel: number) => {
        try {
          validateEnergyLevel(energyLevel)
          
          set((state) => ({
            preferences: { ...state.preferences, energyLevel },
            error: null
          }))
        } catch (error) {
          const appError = handleValidationError(error, 'setEnergyLevel')
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
              lastVisit: state.preferences.lastVisit ? new Date(state.preferences.lastVisit as any) : null
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
