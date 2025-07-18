import { create } from 'zustand'

interface UserPreferences {
  name: string
  energyLevel: number
  hasCompletedOnboarding: boolean
  lastVisit: Date | null
}

interface UserStore {
  preferences: UserPreferences
  isLoaded: boolean
  setName: (name: string) => void
  setEnergyLevel: (level: number) => void
  completeOnboarding: () => void
  updateLastVisit: () => void
  loadPreferences: () => void
}

const STORAGE_KEY = 'everyday-user-preferences'

const defaultPreferences: UserPreferences = {
  name: '',
  energyLevel: 3,
  hasCompletedOnboarding: false,
  lastVisit: null
}

const saveToStorage = (preferences: UserPreferences) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.warn('Failed to save user preferences:', error)
  }
}

const loadFromStorage = (): UserPreferences => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultPreferences
    
    const parsed = JSON.parse(saved)
    return {
      ...parsed,
      lastVisit: parsed.lastVisit ? new Date(parsed.lastVisit) : null
    }
  } catch (error) {
    console.warn('Failed to load user preferences:', error)
    return defaultPreferences
  }
}

export const useUserStore = create<UserStore>((set, get) => ({
  preferences: defaultPreferences,
  isLoaded: false,
  
  setName: (name: string) => {
    const newPreferences = { ...get().preferences, name }
    set({ preferences: newPreferences })
    saveToStorage(newPreferences)
  },
  
  setEnergyLevel: (energyLevel: number) => {
    const newPreferences = { ...get().preferences, energyLevel }
    set({ preferences: newPreferences })
    saveToStorage(newPreferences)
  },
  
  completeOnboarding: () => {
    const newPreferences = { ...get().preferences, hasCompletedOnboarding: true }
    set({ preferences: newPreferences })
    saveToStorage(newPreferences)
  },
  
  updateLastVisit: () => {
    const newPreferences = { ...get().preferences, lastVisit: new Date() }
    set({ preferences: newPreferences })
    saveToStorage(newPreferences)
  },
  
  loadPreferences: () => {
    const savedPreferences = loadFromStorage()
    set({ preferences: savedPreferences, isLoaded: true })
  }
}))
