import { useState, useCallback } from 'react'
import { useTaskStore } from '@/stores/tasks'
import { useSettingsStore } from '@/stores/settings'
import { TaskService } from '@/services/TaskService'
import type { Task } from '@/types/app'

export function useTasks() {
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())
  const [undoableTasks, setUndoableTasks] = useState<Map<string, number>>(new Map())

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

  const completeTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    // Start completion animation
    setCompletingTasks(prev => new Set(prev).add(taskId))

    // Set up undo timeout
    const undoTimeout = setTimeout(() => {
      // Actually complete the task
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

      // Remove from undoable tasks
      setUndoableTasks(prev => {
        const newMap = new Map(prev)
        newMap.delete(taskId)
        return newMap
      })
    }, 3000) // 3 second undo window

    // Add to undoable tasks
    setUndoableTasks(prev => new Map(prev).set(taskId, undoTimeout))
  }, [tasks, storeCompleteRoutine, storeRemoveTask])

  const undoTaskCompletion = useCallback((taskId: string) => {
    const timeout = undoableTasks.get(taskId)
    if (timeout) {
      // Clear the completion timeout
      clearTimeout(timeout)

      // Remove from completing tasks
      setCompletingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })

      // Remove from undoable tasks
      setUndoableTasks(prev => {
        const newMap = new Map(prev)
        newMap.delete(taskId)
        return newMap
      })
    }
  }, [undoableTasks])

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
    undoableTasks,
    isLoaded,
    error,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    undoTaskCompletion,
    getFilteredTasks,
    getSortedTasks,
    loadTasks,
    clearError,
  }
}
