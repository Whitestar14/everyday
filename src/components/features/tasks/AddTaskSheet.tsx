'use client';

import { TaskSheet } from './TaskSheet';
import type { Task } from '@/types/app';

interface AddTaskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (text: string, type: 'task' | 'routine', metadata?: Partial<Task>) => void
}

export function AddTaskSheet({ open, onOpenChange, onAddTask }: AddTaskSheetProps) {
    return (
        <TaskSheet
            mode="add"
            open={open}
            hideClose={true}
            onOpenChange={onOpenChange}
            onSubmit={onAddTask}
        />
    );
}
