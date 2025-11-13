import { useState } from 'react'
import { useTaskStore } from '@/stores/tasks'
import { useEncouragementStore } from '@/stores/encouragement'
import { useSettingsStore } from '@/stores/settings'
import { TaskService } from '@/services/TaskService'
import { EncouragementService } from '@/services/EncouragementService'
import type { Task } from '@/types/app'

export function useTasks() {
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())

  const {
    tasks,
    isLoaded,
    error,
    addTask: storeAddTask,
    updateTask: storeUpdateTask,
    completeRoutine: storeCompleteRoutine,
    removeTask: storeRemoveTask,
    getAvailableTasks,
    loadTasks,
    clearError
  } = useTaskStore()

  const { recordCompletion, getDailyCompletions } = useEncouragementStore()
  const { newTasksOnTop } = useSettingsStore()

  const addTask = (text: string, type: 'task' | 'routine' = 'task') => {
    try {
      TaskService.validateTask(text)
      storeAddTask(text, type)
      return true
    } catch (error) {
      console.error('Failed to add task:', error)
      return false
    }
  }

  const updateTask = (id: string, updates: Partial<Pick<Task, 'text' | 'type'>>) => {
    try {
      const existingTask = tasks.find(t => t.id === id)
      if (!existingTask) return false

      TaskService.updateTask(existingTask, updates)
      storeUpdateTask(id, updates)
      return true
    } catch (error) {
      console.error('Failed to update task:', error)
      return false
    }
  }

  const deleteTask = (id: string) => {
    try {
      storeRemoveTask(id)
      return true
    } catch (error) {
      console.error('Failed to delete task:', error)
      return false
    }
  }

  const completeTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    // Start completion animation
    setCompletingTasks(prev => new Set(prev).add(taskId))

    // Record completion and handle celebration
    recordCompletion()
    const dailyCount = getDailyCompletions()
    await EncouragementService.handleTaskCompletion(task.text, dailyCount)

    // Handle task completion based on type
    setTimeout(() => {
      if (task.type === "routine") {
        // Mark routine as completed for today
        storeCompleteRoutine(taskId)
      } else {
        // Remove regular task
        storeRemoveTask(taskId)
      }

      setCompletingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }, 800)
  }

  const getFilteredTasks = (type?: 'task' | 'routine') => {
    return TaskService.filterTasksByType(tasks, type)
  }

  const getSortedTasks = (ascending: boolean = false) => {
    return TaskService.sortTasksByDate(tasks, ascending)
  }

  const availableTasks = getAvailableTasks().sort((a, b) => {
    if (newTasksOnTop) {
      // Newest first (by createdAt descending)
      return b.createdAt.getTime() - a.createdAt.getTime()
    } else {
      // Oldest first (by createdAt ascending)
      return a.createdAt.getTime() - b.createdAt.getTime()
    }
  })

  return {
    tasks,
    availableTasks,
    completingTasks,
    isLoaded,
    error,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getFilteredTasks,
    getSortedTasks,
    loadTasks,
    clearError,
  }
}
