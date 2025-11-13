import { useMemo } from 'react'
import { useUserStore } from '@/stores/user'
import { UserService } from '@/services/UserService'

export function useUser() {
  const {
    preferences,
    isLoaded,
    error,
    setName: storeSetName,
    completeOnboarding,
    updateLastVisit,
    loadPreferences,
    clearError
  } = useUserStore()

  const setName = (name: string) => {
    try {
      UserService.validateName(name)
      storeSetName(name)
      return true
    } catch (error) {
      console.error('Failed to set name:', error)
      return false
    }
  }

  const greeting = useMemo(() => {
    return UserService.generateGreeting(preferences.name)
  }, [preferences.name])

  const shouldShowOnboarding = useMemo(() => {
    return UserService.shouldShowOnboarding(preferences.hasCompletedOnboarding)
  }, [preferences.hasCompletedOnboarding])

  return {
    preferences,
    isLoaded,
    error,
    greeting,
    shouldShowOnboarding,
    setName,
    completeOnboarding,
    updateLastVisit,
    loadPreferences,
    clearError,
  }
}
