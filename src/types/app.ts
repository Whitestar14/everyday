export type AppState = 'loading' | 'day-display' | 'onboarding' | 'main' | 'tasks' | 'manage'
export type ViewMode = 'main' | 'tasks' | 'manage' | 'profile'
export type ButtonPosition = 'bottom-right' | 'bottom-left' | 'bottom-center'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface Task {
  id: string
  text: string
  type: "task" | "routine"
  createdAt: Date
  lastCompletedAt?: Date
  completedDates?: string[] // Array of dates (YYYY-MM-DD) when routine was completed
}

export interface AppSettings {
  buttonPosition: ButtonPosition
  themeMode: ThemeMode
  newTasksOnTop: boolean
}
