import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { handleStorageError, handleValidationError, ValidationError } from '@/utils/errorHandling';

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
  setPreferences: (prefs: UserPreferences) => void
}

const defaultPreferences: UserPreferences = {
    name: null,
    avatar: '',
    hasCompletedOnboarding: false,
    lastVisit: null,
};

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
                            throw new ValidationError('Name must be a string', 'setName');
                        }

                        const trimmed = name.trim();
                        if (trimmed.length === 0) {
                            throw new ValidationError('Name cannot be empty', 'setName');
                        }

                        if (trimmed.length > 50) {
                            throw new ValidationError('Name cannot exceed 50 characters', 'setName');
                        }

                        set((state) => ({
                            preferences: { ...state.preferences, name: trimmed },
                            error: null,
                        }));
                    } else {
                        set((state) => ({
                            preferences: { ...state.preferences, name: null },
                            error: null,
                        }));
                    }
                } catch (error) {
                    const appError = handleValidationError(error, 'setName');
                    set({ error: appError.message });
                }
            },

            setAvatar: (avatar: string) => {
                try {
                    if (typeof avatar !== 'string' || avatar.length === 0) {
                        throw new ValidationError('Avatar must be a non-empty string', 'setAvatar');
                    }

                    set((state) => ({
                        preferences: { ...state.preferences, avatar },
                        error: null,
                    }));
                } catch (error) {
                    const appError = handleValidationError(error, 'setAvatar');
                    set({ error: appError.message });
                }
            },

            completeOnboarding: () => {
                set((state) => ({
                    preferences: { ...state.preferences, hasCompletedOnboarding: true },
                    error: null,
                }));
            },

            updateLastVisit: () => {
                set((state) => ({
                    preferences: { ...state.preferences, lastVisit: new Date() },
                    error: null,
                }));
            },

            loadPreferences: () => {
                set({ isLoaded: true, error: null });
            },

            setPreferences: (prefs: UserPreferences) => {
                try {
                    set({ preferences: prefs, error: null });
                } catch (error) {
                    const appError = handleStorageError(error, 'setPreferences');
                    set({ error: appError.message });
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'everyday-user-preferences',
            partialize: (state) => ({ preferences: state.preferences }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    try {
                        state.preferences = {
                            ...state.preferences,
                            lastVisit: state.preferences.lastVisit
                                ? new Date(state.preferences.lastVisit as string | number | Date)
                                : null,
                        };
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
