"use client"

import { useMobile } from "@/hooks/useMobile"
import { useAppState } from "@/hooks/useAppState"
import { useTasks } from "@/hooks/useTasks"
import { useUser } from "@/hooks/useUser"
import { Toaster } from "@/components/ui/sonner"
import { Onboarding } from "@/components/features/onboarding/Onboarding"
import { LoadingState } from "@/components/layout/LoadingState"
import { DayDisplay } from "@/components/layout/DayDisplay"
import { DesktopNotSupported } from "@/components/layout/DesktopNotSupported"
import { MainPage } from "@/components/pages/MainPage"
import { TasksPage } from "@/components/pages/TasksPage"
import { ManageTasksPage } from "@/components/pages/ManageTasksPage"
import { ModalProvider } from "@/contexts/ModalContext"
import { ModalContainer } from "@/components/modals/ModalContainer"

function App() {
  const isMobile = useMobile()

  const {
    currentView,
    currentDay,
    isLoading,
    isDayDisplay,
    isOnboarding,
    handleOnboardingComplete,
    navigateToTasks,
    navigateToMain,
    navigateToManage,
  } = useAppState()

  const { availableTasks, completingTasks, completeTask, addTask, updateTask, deleteTask } = useTasks()
  const { greeting } = useUser()

  if (!isMobile) {
    return <DesktopNotSupported />
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (isDayDisplay) {
    return <DayDisplay day={currentDay} />
  }

  if (isOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <ModalProvider>
      {currentView === "tasks" ? (
        <TasksPage
          tasks={availableTasks}
          completingTasks={completingTasks}
          onCompleteTask={completeTask}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onBack={navigateToMain}
        />
      ) : currentView === "manage" ? (
        <ManageTasksPage
          tasks={availableTasks}
          completingTasks={completingTasks}
          onCompleteTask={completeTask}
          onDeleteTask={deleteTask}
          onBack={navigateToMain}
        />
      ) : (
        <MainPage
          tasks={availableTasks}
          completingTasks={completingTasks}
          onCompleteTask={completeTask}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onViewAllTasks={navigateToTasks}
          onManageTasks={navigateToManage}
          greeting={greeting}
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
