export type AppState = 'loading' | 'day-display' | 'onboarding' | 'main' | 'tasks' | 'manage'
export type ViewMode = 'inbox' | 'today' | 'manage'
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
  notes?: string
  reminderOffsetMinutes?: number
  reminderEnabled?: boolean
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

// Space and Project types removed — feature deprecated

export interface AppSettings {
  themeMode: ThemeMode
  newTasksOnTop: boolean
}