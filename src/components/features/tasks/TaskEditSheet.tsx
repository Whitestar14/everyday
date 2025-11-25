"use client"

import { TaskSheet } from './TaskSheet'
import type { Task } from '@/types/app'

interface TaskEditSheetProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskEditSheet({ task, open, onOpenChange }: TaskEditSheetProps) {
  return (
    <TaskSheet mode="edit" task={task} open={open} onOpenChange={onOpenChange} />
  )
}
