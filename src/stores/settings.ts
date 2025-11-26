import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { handleStorageError } from '@/utils/errorHandling';
import type { ThemeMode } from '@/types/app';

interface SettingsStore {
  newTasksOnTop: boolean
  themeMode: ThemeMode
  isLoaded: boolean
  error: string | null
  setNewTasksOnTop: (value: boolean) => void
  setThemeMode: (mode: ThemeMode) => void
  loadSettings: () => void
  clearError: () => void
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            newTasksOnTop: true,
            themeMode: 'system',
            isLoaded: false,
            error: null,

            setNewTasksOnTop: (value: boolean) => {
                set({ newTasksOnTop: value, error: null });
            },

            setThemeMode: (mode: ThemeMode) => {
                set({ themeMode: mode, error: null });
            },

            loadSettings: () => {
                set({ isLoaded: true, error: null });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'everyday-settings',
            partialize: (state) => ({
                newTasksOnTop: state.newTasksOnTop,
                themeMode: state.themeMode,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    try {
                        state.isLoaded = true;
                        state.error = null;
                    } catch (error) {
                        const appError = handleStorageError(error, 'onRehydrateStorage');
                        state.error = appError.message;
                        state.isLoaded = true;
                    }
                }
            },
        }
    )
);
