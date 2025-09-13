export type AppState = 'loading' | 'day-display' | 'onboarding' | 'main' | 'tasks'
export type ViewMode = 'main' | 'tasks'
export type ButtonPosition = 'bottom-right' | 'bottom-left' | 'bottom-center'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface Task {
  id: string
  text: string
  type: "task" | "routine"
  createdAt: Date
  lastCompletedAt?: Date
}

export interface AppSettings {
  buttonPosition: ButtonPosition
  themeMode: ThemeMode
}
