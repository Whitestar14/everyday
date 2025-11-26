import { useMemo } from 'react';
import { useUserStore } from '@/stores/user';
import { UserService } from '@/services/UserService';

export function useUser() {
    const {
        preferences,
        isLoaded,
        error,
        setName: storeSetName,
        setAvatar: storeSetAvatar,
        completeOnboarding,
        updateLastVisit,
        loadPreferences,
        clearError
    } = useUserStore();

    const setName = (name: string) => {
        try {
            UserService.validateName(name);
            storeSetName(name);
            return true;
        } catch (error) {
            console.error('Failed to set name:', error);
            return false;
        }
    };

    const greeting = useMemo(() => {
        return UserService.generateGreeting(preferences.name);
    }, [preferences.name]);

    const setAvatar = (avatar: string) => {
        try {
            storeSetAvatar(avatar);
            return true;
        } catch (error) {
            console.error('Failed to set avatar:', error);
            return false;
        }
    };

    const shouldShowOnboarding = useMemo(() => {
        return UserService.shouldShowOnboarding(preferences.hasCompletedOnboarding);
    }, [preferences.hasCompletedOnboarding]);

    return {
        preferences,
        avatar: preferences.avatar,
        isLoaded,
        error,
        greeting,
        shouldShowOnboarding,
        setName,
        setAvatar,
        completeOnboarding,
        updateLastVisit,
        loadPreferences,
        clearError,
    };
}
