import { create } from 'zustand'

interface Task {
  id: string
  text: string
  createdAt: Date
}

interface TaskStore {
  tasks: Task[]
  isLoaded: boolean
  addTask: (text: string) => void
  removeTask: (id: string) => void
  loadTasks: () => void
}

// localStorage helpers
const STORAGE_KEY = 'everyday-tasks'

const saveToStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.warn('Failed to save tasks:', error)
  }
}

const loadFromStorage = (): Task[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    
    const parsed = JSON.parse(saved)
    // Convert dates back from strings
    return parsed.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }))
  } catch (error) {
    console.warn('Failed to load tasks:', error)
    return []
  }
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoaded: false,
  
  addTask: (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      createdAt: new Date()
    }
    
    set((state) => {
      const newTasks = [...state.tasks, newTask]
      saveToStorage(newTasks)
      return { tasks: newTasks }
    })
  },
  
  removeTask: (id: string) => {
    set((state) => {
      const newTasks = state.tasks.filter(task => task.id !== id)
      saveToStorage(newTasks)
      return { tasks: newTasks }
    })
  },
  
  loadTasks: () => {
    const savedTasks = loadFromStorage()
    set({ tasks: savedTasks, isLoaded: true })
  }
}))
