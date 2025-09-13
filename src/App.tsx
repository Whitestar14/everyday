"use client"

import { useState, useEffect } from "react"
import { useTaskStore } from "@/stores/tasks"
import { useUserStore } from "@/stores/user"
import { useEncouragementStore } from "@/stores/encouragement"
import { useMobile } from "@/hooks/useMobile"
import { showCompletionToast, showDailyProgress } from "@/components/encouragement/CompletionToast"
import { Toaster } from "@/components/ui/sonner"
import { Onboarding } from "@/components/Onboarding"
import { LoadingState } from "@/components/layout/LoadingState"
import { DayDisplay } from "@/components/layout/DayDisplay"
import { DesktopNotSupported } from "@/components/layout/DesktopNotSupported"
import { MainPage } from "@/components/pages/MainPage"
import { TasksPage } from "@/components/pages/TasksPage"
import type { AppState, ViewMode } from "@/types/app"
import { ModalProvider } from "@/contexts/ModalContext"
import { ModalContainer } from "@/components/modals/ModalContainer"

function App() {
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())
  const [appState, setAppState] = useState<AppState>("loading")
  const [currentView, setCurrentView] = useState<ViewMode>("main")

  const isMobile = useMobile()

  const { tasks, isLoaded: tasksLoaded, addTask, updateTask, removeTask, loadTasks } = useTaskStore()
  const { preferences, isLoaded: userLoaded, loadPreferences, updateLastVisit } = useUserStore()
  const { recordCompletion, getDailyCompletions } = useEncouragementStore()

  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" })

  useEffect(() => {
    loadTasks()
    loadPreferences()
  }, [loadTasks, loadPreferences])

  useEffect(() => {
    if (tasksLoaded && userLoaded) {
      setAppState("day-display")

      const dayTimer = setTimeout(() => {
        if (!preferences.hasCompletedOnboarding) {
          setAppState("onboarding")
        } else {
          updateLastVisit()
          setAppState("main")
        }
      }, 2000)

      return () => clearTimeout(dayTimer)
    }
  }, [tasksLoaded, userLoaded, preferences.hasCompletedOnboarding, updateLastVisit])

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    setCompletingTasks((prev) => new Set(prev).add(taskId))

    setTimeout(() => {
      recordCompletion()

      showCompletionToast(task?.text)

      setTimeout(() => {
        const dailyCount = getDailyCompletions()
        showDailyProgress(dailyCount)
      }, 2500)

      removeTask(taskId)
      setCompletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }, 800)
  }

  const handleOnboardingComplete = () => {
    setAppState("main")
    updateLastVisit()
  }

  const handleViewAllTasks = () => {
    setCurrentView("tasks")
  }

  const handleBackToMain = () => {
    setCurrentView("main")
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = preferences.name

    let timeGreeting = "hello"
    if (hour < 12) timeGreeting = "good morning"
    else if (hour < 17) timeGreeting = "good afternoon"
    else timeGreeting = "good evening"

    return name ? `${timeGreeting}, ${name}` : timeGreeting
  }

  if (!isMobile) {
    return <DesktopNotSupported />
  }

  if (appState === "loading") {
    return <LoadingState />
  }

  if (appState === "day-display") {
    return <DayDisplay day={currentDay} />
  }

  if (appState === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <ModalProvider>
      {currentView === "tasks" ? (
        <TasksPage
          tasks={tasks}
          completingTasks={completingTasks}
          onCompleteTask={handleCompleteTask}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={removeTask}
          onBack={handleBackToMain}
        />
      ) : (
        <MainPage
          tasks={tasks}
          completingTasks={completingTasks}
          onCompleteTask={handleCompleteTask}
          onAddTask={addTask}
          onDeleteTask={removeTask}
          onViewAllTasks={handleViewAllTasks}
          greeting={getGreeting()}
        />
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />

      <ModalContainer />
    </ModalProvider>
  )
}

export default App
