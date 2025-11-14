"use client"

import { useMobile } from "@/hooks/useMobile"
import { useAppState } from "@/hooks/useAppState"
import { useTasks } from "@/hooks/useTasks"
import { useUser } from "@/hooks/useUser"
import { useSettings } from "@/hooks/useSettings"
import { Toaster } from "@/components/ui/sonner"
import { Onboarding } from "@/components/features/onboarding/Onboarding"
import { LoadingState } from "@/components/layout/LoadingState"
import { DayDisplay } from "@/components/layout/DayDisplay"
import { DesktopNotSupported } from "@/components/layout/DesktopNotSupported"
import { MainPage } from "@/components/pages/MainPage"
import { TasksPage } from "@/components/pages/TasksPage"
import { ManageTasksPage } from "@/components/pages/ManageTasksPage"
import { ProfilePage } from "@/components/pages/ProfilePage"
import { ModalProvider } from "@/contexts/ModalContext"
import { ModalContainer } from "@/components/modals/ModalContainer"

function App() {
  const isMobile = useMobile()
  // Ensure theme is applied early
  useSettings()

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
    navigateToProfile,
  } = useAppState()

  const { tasks, availableTasks, completingTasks, undoableTasks, completeTask, undoTaskCompletion, addTask, updateTask, deleteTask } = useTasks()
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
          undoableTasks={undoableTasks}
          onCompleteTask={completeTask}
          onUndoTask={undoTaskCompletion}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onBack={navigateToMain}
          onManage={navigateToManage}
        />
      ) : currentView === "manage" ? (
      <ManageTasksPage
      tasks={tasks}
      onDeleteTask={deleteTask}
      onBack={navigateToMain}
      />
      ) : currentView === "profile" ? (
        <ProfilePage onBack={navigateToMain} />
      ) : (
        <MainPage
          tasks={availableTasks}
          completingTasks={completingTasks}
          undoableTasks={undoableTasks}
          onCompleteTask={completeTask}
          onUndoTask={undoTaskCompletion}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onViewAllTasks={navigateToTasks}
          onManageTasks={navigateToManage}
          onProfileClick={navigateToProfile}
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
