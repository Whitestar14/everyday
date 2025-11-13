"use client"

import { TaskSheet } from "./TaskSheet"

interface AddTaskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (text: string, type: "task" | "routine") => void
  buttonPositionStyles: string
}

export function AddTaskSheet({ open, onOpenChange, onAddTask }: AddTaskSheetProps) {
  return (
    <TaskSheet
      mode="add"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onAddTask}
    />
  )
}
