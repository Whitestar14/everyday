"use client"

import { EditTaskSheet } from "@/components/tasks/EditTaskSheet"
import { AddTaskSheet } from "@/components/tasks/AddTaskSheet"
import { SettingsPanel } from "@/components/settings/SettingsPanel"
import { useModal } from "@/contexts/ModalContext"
import { useSettings } from "@/hooks/useSettings"
import { useTaskStore } from "@/stores/tasks"

export function ModalContainer() {
  const { 
    editTaskState, 
    closeEditTask, 
    addTaskState, 
    closeAddTask,
    settingsState,
    closeSettings
  } = useModal()
  
  const { buttonPosition, themeMode, handleButtonPositionChange, handleThemeChange, getButtonPositionStyles } = useSettings()
  const { updateTask, removeTask, addTask } = useTaskStore()

  return (
    <>
      {/* Edit Task Sheet */}
      <EditTaskSheet
        task={editTaskState.task}
        open={editTaskState.isOpen}
        onOpenChange={(open) => !open && closeEditTask()}
        onUpdateTask={updateTask}
        onDeleteTask={removeTask}
      />

      {/* Add Task Sheet */}
      <AddTaskSheet
        open={addTaskState.isOpen}
        onOpenChange={(open) => !open && closeAddTask()}
        onAddTask={addTask}
        buttonPositionStyles={getButtonPositionStyles()}
      />

      {/* Settings Panel */}
      <SettingsPanel
        open={settingsState.isOpen}
        onOpenChange={(open) => !open && closeSettings()}
        buttonPosition={buttonPosition}
        themeMode={themeMode}
        onButtonPositionChange={handleButtonPositionChange}
        onThemeChange={handleThemeChange}
      />
    </>
  )
}