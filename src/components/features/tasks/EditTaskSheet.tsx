"use client"

import { TaskSheet } from "./TaskSheet"
import type { Task } from "@/types/app"

interface EditTaskSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (id: string, updates: Partial<Pick<Task, "text" | "type">>) => void
  onDeleteTask?: (id: string) => void
}

export function EditTaskSheet({ task, open, onOpenChange, onUpdateTask, onDeleteTask }: EditTaskSheetProps) {
  const handleSubmit = (text: string, type: "task" | "routine") => {
    if (task) {
      onUpdateTask(task.id, { text, type })
    }
  }

  return (
    <TaskSheet
      mode="edit"
      task={task}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      onDelete={onDeleteTask}
    />
  )
}