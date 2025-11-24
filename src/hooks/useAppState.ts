import { useEffect } from 'react'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTaskStore } from '@/stores/tasks'
import { UserService } from '@/services/UserService'

export function useAppState() {
  const { appState, setAppState } = useAppStore()
  const { preferences, isLoaded: userLoaded, loadPreferences, updateLastVisit } = useUserStore()
  const { isLoaded: tasksLoaded, loadTasks } = useTaskStore()

  const currentDay = UserService.getCurrentDay()

  // Initialize app
  useEffect(() => {
    loadTasks()
    loadPreferences()
  }, [loadTasks, loadPreferences])

  // Handle app state transitions
  useEffect(() => {
    if (tasksLoaded && userLoaded) {
      setAppState('day-display')

      const dayTimer = setTimeout(() => {
        if (UserService.shouldShowOnboarding(preferences.hasCompletedOnboarding)) {
          setAppState('onboarding')
        } else {
          updateLastVisit()
          setAppState('main')
        }
      }, 2000)

      return () => clearTimeout(dayTimer)
    }
  }, [tasksLoaded, userLoaded, preferences.hasCompletedOnboarding, updateLastVisit, setAppState])

  const handleOnboardingComplete = () => {
    setAppState('main')
    updateLastVisit()
  }

  return {
    appState,
    currentDay,
    isLoading: appState === 'loading',
    isDayDisplay: appState === 'day-display',
    isOnboarding: appState === 'onboarding',
    isMain: appState === 'main',
    handleOnboardingComplete,
  }
}