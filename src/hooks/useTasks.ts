import { useCallback } from 'react'
import { useTaskStore } from '@/stores/tasks'
import { useSettingsStore } from '@/stores/settings'
import { TaskService } from '@/services/TaskService'
import type { Task } from '@/types/app'

export function useTasks() {

  const {
    tasks,
    isLoaded,
    error,
  addTask: storeAddTask,
  updateTask: storeUpdateTask,
    removeTask: storeRemoveTask,
    getAvailableTasks,
    getInboxTasks,
    getTodayTasks,
    completeTask: storeCompleteTask,
    undoTask: storeUndoTask,
    completingTasks: storeCompletingTasks,
    undoableTasks: storeUndoableTasks,
    isSelectionMode: storeIsSelectionMode,
    selectedTasks: storeSelectedTasks,
    toggleSelectionMode: storeToggleSelectionMode,
    selectTask: storeSelectTask,
    selectAllTasks: storeSelectAllTasks,
    clearSelection: storeClearSelection,
    bulkDeleteSelectedTasks: storeBulkDeleteSelectedTasks,
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

  const completeTask = useCallback((taskId: string) => {
    storeCompleteTask(taskId)
  }, [storeCompleteTask])

  const undoTaskCompletion = useCallback((taskId: string) => {
    storeUndoTask(taskId)
  }, [storeUndoTask])

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
  completingTasks: storeCompletingTasks,
  undoableTasks: storeUndoableTasks,
    isLoaded,
    error,
    addTask,
    updateTask,
    deleteTask,
  completeTask,
  undoTaskCompletion,
  getInboxTasks,
  getTodayTasks,
    getFilteredTasks,
    getSortedTasks,
    loadTasks,
    clearError,
    // selection state & actions
    isSelectionMode: storeIsSelectionMode,
    selectedTasks: storeSelectedTasks,
    toggleSelectionMode: storeToggleSelectionMode,
    selectTask: storeSelectTask,
    selectAllTasks: storeSelectAllTasks,
    clearSelection: storeClearSelection,
    bulkDeleteSelectedTasks: storeBulkDeleteSelectedTasks,
  }
}
