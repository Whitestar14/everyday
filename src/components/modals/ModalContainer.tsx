"use client"

import { TaskSheet } from "@/components/features/tasks/TaskSheet"
import type { Task } from '@/types/app'
import { AddTaskSheet } from "@/components/features/tasks/AddTaskSheet"
import { useModal } from "@/contexts/ModalContext"
import { useTaskStore } from "@/stores/tasks"

export function ModalContainer() {
  const { 
    editTaskState, 
    closeEditTask, 
    addTaskState, 
    closeAddTask
  } = useModal()

  const { addTask, updateTask, updateTaskMetadata, removeTask } = useTaskStore()

  return (
    <>
      {/* Edit Task Sheet */}
      <TaskSheet
        mode="edit"
        task={editTaskState.task}
        open={editTaskState.isOpen}
        onOpenChange={(open) => !open && closeEditTask()}
        onSave={(id, metadata) => {
          const m = metadata as Partial<Task>
          if (m.text) updateTask(id, { text: m.text })
          if (m.type) updateTask(id, { type: m.type })
          updateTaskMetadata(id, m)
          closeEditTask()
        }}
        onDelete={(id) => {
          removeTask(id)
          closeEditTask()
        }}
      />

      {/* Add Task Dialog (centralized) */}
      <AddTaskSheet
        open={addTaskState.isOpen}
        onOpenChange={(open) => !open && closeAddTask()}
  onAddTask={(text: string, type: 'task' | 'routine', metadata?: Partial<Task>) => addTask(text, type, metadata)}
      />
    </>
  )
}