import { useState, useEffect } from 'react'
import { useTaskStore } from '@/stores/tasks'
import { useUserStore } from '@/stores/user'
import { useMobile } from '@/hooks/useMobile'
import { useSettings } from '@/hooks/useSettings'
import { Onboarding } from '@/components/Onboarding'
import { LoadingState } from '@/components/layout/LoadingState'
import { DayDisplay } from '@/components/layout/DayDisplay'
import { DesktopNotSupported } from '@/components/layout/DesktopNotSupported'
import { MainPage } from '@/components/pages/MainPage'
import { TasksPage } from '@/components/pages/TasksPage'
import type { AppState, ViewMode } from '@/types/app'

function App() {
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())
  const [appState, setAppState] = useState<AppState>('loading')
  const [currentView, setCurrentView] = useState<ViewMode>('main')
  
  // Custom hooks
  const isMobile = useMobile()
  const {
    buttonPosition,
    themeMode,
    handleButtonPositionChange,
    handleThemeChange,
    getButtonPositionStyles
  } = useSettings()
  
  // Zustand stores
  const { tasks, isLoaded: tasksLoaded, addTask, removeTask, loadTasks } = useTaskStore()
  const { preferences, isLoaded: userLoaded, loadPreferences, updateLastVisit } = useUserStore()

  // Get current day name
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  // Load data on mount
  useEffect(() => {
    loadTasks()
    loadPreferences()
  }, [loadTasks, loadPreferences])

  // Handle app state transitions
  useEffect(() => {
    if (tasksLoaded && userLoaded) {
      setAppState('day-display')
      
      const dayTimer = setTimeout(() => {
        if (!preferences.hasCompletedOnboarding) {
          setAppState('onboarding')
        } else {
          updateLastVisit()
          setAppState('main')
        }
      }, 2000)
      
      return () => clearTimeout(dayTimer)
    }
  }, [tasksLoaded, userLoaded, preferences.hasCompletedOnboarding, updateLastVisit])

  const handleCompleteTask = (taskId: string) => {
    setCompletingTasks(prev => new Set(prev).add(taskId))
    
    setTimeout(() => {
      removeTask(taskId)
      setCompletingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }, 800)
  }

  const handleOnboardingComplete = () => {
    setAppState('main')
    updateLastVisit()
  }

  const handleViewAllTasks = () => {
    setCurrentView('tasks')
  }

  const handleBackToMain = () => {
    setCurrentView('main')
  }

  // Get time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = preferences.name
    
    let timeGreeting = 'hello'
    if (hour < 12) timeGreeting = 'good morning'
    else if (hour < 17) timeGreeting = 'good afternoon'
    else timeGreeting = 'good evening'
    
    return name ? `${timeGreeting}, ${name}` : timeGreeting
  }

  // Show desktop not supported message
  if (!isMobile) {
    return <DesktopNotSupported />
  }

  // Loading state
  if (appState === 'loading') {
    return <LoadingState />
  }

  // Day display (shown on every app load)
  if (appState === 'day-display') {
    return <DayDisplay day={currentDay} />
  }

  // Onboarding for new users
  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  // Main app interface
  if (currentView === 'tasks') {
    return (
      <TasksPage
        tasks={tasks}
        completingTasks={completingTasks}
        onCompleteTask={handleCompleteTask}
        onAddTask={addTask}
        onBack={handleBackToMain}
        buttonPosition={buttonPosition}
        themeMode={themeMode}
        onButtonPositionChange={handleButtonPositionChange}
        onThemeChange={handleThemeChange}
        getButtonPositionStyles={getButtonPositionStyles}
      />
    )
  }

  return (
    <MainPage
      tasks={tasks}
      completingTasks={completingTasks}
      onCompleteTask={handleCompleteTask}
      onAddTask={addTask}
      onViewAllTasks={handleViewAllTasks}
      greeting={getGreeting()}
      buttonPosition={buttonPosition}
      themeMode={themeMode}
      onButtonPositionChange={handleButtonPositionChange}
      onThemeChange={handleThemeChange}
      getButtonPositionStyles={getButtonPositionStyles}
    />
  )
}

export default App
