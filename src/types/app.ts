export type AppState = 'loading' | 'day-display' | 'onboarding' | 'main' | 'tasks' | 'manage'
export type ViewMode = 'inbox' | 'today' | 'library'
export type ButtonPosition = 'bottom-right' | 'bottom-left' | 'bottom-center'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface Task {
  id: string
  text: string
  type: "task" | "routine"
  createdAt: Date
  lastCompletedAt?: Date
  completedDates?: string[] // Array of dates (YYYY-MM-DD) when routine was completed
  dueDate?: Date
  startDate?: Date
  recurrence?: RecurrenceRule
  spaceId?: string
  projectId?: string
  notes?: string
  isPinned?: boolean
  parsedMetadata?: ParsedMetadata
  notificationIds?: string[]
}

export interface RecurrenceRule {
  rrule: string
  description: string
}

export interface ParsedMetadata {
  dueDateChip?: string
  recurrenceChip?: string
  errors?: string[]
}

export interface Space {
  id: string
  name: string
  color: string
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  spaceId: string
  createdAt: Date
}

export interface AppSettings {
  buttonPosition: ButtonPosition
  themeMode: ThemeMode
  newTasksOnTop: boolean
}