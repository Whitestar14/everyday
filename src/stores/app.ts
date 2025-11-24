import { create } from 'zustand'
import type { AppState, ViewMode } from '@/types/app'

interface AppStore {
  appState: AppState
  currentView: ViewMode
  setAppState: (state: AppState) => void
  setCurrentView: (view: ViewMode) => void
}

export const useAppStore = create<AppStore>((set) => ({
  appState: 'loading',
  currentView: 'inbox',
  setAppState: (state: AppState) => set({ appState: state }),
  setCurrentView: (view: ViewMode) => set({ currentView: view }),
}))