import type { Task } from '@/types/app'

export class TaskService {
  static validateTask(text: string): void {
    if (!text || typeof text !== 'string') {
      throw new Error('Task text must be a non-empty string')
    }

    const trimmed = text.trim()
    if (trimmed.length === 0) {
      throw new Error('Task text cannot be empty')
    }

    if (trimmed.length > 200) {
      throw new Error('Task text cannot exceed 200 characters')
    }
  }

  static createTask(text: string, type: 'task' | 'routine' = 'task'): Task {
    this.validateTask(text)

    return {
      id: crypto.randomUUID(),
      text: text.trim(),
      type,
      createdAt: new Date(),
    }
  }

  static updateTask(task: Task, updates: Partial<Pick<Task, 'text' | 'type'>>): Task {
    if (updates.text) {
      this.validateTask(updates.text)
    }

    return {
      ...task,
      ...updates,
      text: updates.text ? updates.text.trim() : task.text,
    }
  }

  static markTaskCompleted(task: Task): Task {
    return {
      ...task,
      lastCompletedAt: new Date(),
    }
  }

  static filterTasksByType(tasks: Task[], type?: 'task' | 'routine'): Task[] {
    if (!type) return tasks
    return tasks.filter(task => task.type === type)
  }

  static sortTasksByDate(tasks: Task[], ascending: boolean = false): Task[] {
    return [...tasks].sort((a, b) => {
      const dateA = a.createdAt.getTime()
      const dateB = b.createdAt.getTime()
      return ascending ? dateA - dateB : dateB - dateA
    })
  }
}
