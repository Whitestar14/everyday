import { useMemo } from 'react'
import { useTaskStore } from '@/stores/tasks'
import { shouldShowToday } from '@/services/RecurrenceService'
import type { Task } from '@/types/app'

const isDateToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isDatePast = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export const useInboxTasks = (): Task[] => {
  const tasks = useTaskStore((state) => state.tasks)

  return useMemo(() => {
    return tasks
      .filter((task) => !task.spaceId)
      .sort((a, b) => {
        // Sort by createdAt descending (newest first)
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
  }, [tasks])
}

export const useTodayTasks = (): Task[] => {
  const tasks = useTaskStore((state) => state.tasks)

  return useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks
      .filter((task) => {
        // Include if pinned
        if (task.isPinned) return true

        // Include if due today or past due
        if (task.dueDate && (isDateToday(task.dueDate) || isDatePast(task.dueDate))) return true

        // Include if start date is today or past
        if (task.startDate && (isDateToday(task.startDate) || isDatePast(task.startDate))) return true

        // Include if recurring and should show today
        if (task.recurrence && shouldShowToday(task)) return true

        return false
      })
      .sort((a, b) => {
        // Pinned first
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1

        // Then by due date ascending (past/today first, null last)
        const aDue = a.dueDate?.getTime() ?? Infinity
        const bDue = b.dueDate?.getTime() ?? Infinity
        if (aDue !== bDue) return aDue - bDue

        // Then by created date descending (newest first)
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
  }, [tasks])
}

export const useLibraryTasks = (spaceId?: string, projectId?: string): Task[] => {
  const tasks = useTaskStore((state) => state.tasks)

  return useMemo(() => {
    return tasks
      .filter((task) => {
        if (projectId) return task.projectId === projectId
        if (spaceId) return task.spaceId === spaceId
        return !!task.spaceId // All tasks with space if no specific space/project
      })
      .sort((a, b) => {
        // Pinned first
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1

        // Then by due date ascending (past/today first, null last)
        const aDue = a.dueDate?.getTime() ?? Infinity
        const bDue = b.dueDate?.getTime() ?? Infinity
        if (aDue !== bDue) return aDue - bDue

        // Then by created date descending (newest first)
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
  }, [tasks, spaceId, projectId])
}
