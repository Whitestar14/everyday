import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EncouragementState {
  dailyCompletions: number
  lastCompletionDate: string
  totalCompletions: number
  
  // Actions
  recordCompletion: () => void
  resetDailyCount: () => void
  getDailyCompletions: () => number
}

export const useEncouragementStore = create<EncouragementState>()(
  persist(
    (set, get) => ({
      dailyCompletions: 0,
      lastCompletionDate: new Date().toDateString(),
      totalCompletions: 0,

      recordCompletion: () => {
        const today = new Date().toDateString()
        const state = get()
        
        // Reset daily count if it's a new day
        if (state.lastCompletionDate !== today) {
          set({
            dailyCompletions: 1,
            lastCompletionDate: today,
            totalCompletions: state.totalCompletions + 1
          })
        } else {
          set({
            dailyCompletions: state.dailyCompletions + 1,
            totalCompletions: state.totalCompletions + 1
          })
        }
      },

      resetDailyCount: () => {
        set({
          dailyCompletions: 0,
          lastCompletionDate: new Date().toDateString()
        })
      },

      getDailyCompletions: () => {
        const today = new Date().toDateString()
        const state = get()
        
        // Return 0 if it's a new day
        return state.lastCompletionDate === today ? state.dailyCompletions : 0
      }
    }),
    {
      name: 'encouragement-storage'
    }
  )
)
