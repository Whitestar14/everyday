import type { Task, AppSettings } from '@/types/app'
import { useTaskStore } from '@/stores/tasks'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { handleValidationError } from '@/utils/errorHandling'

export const DATA_SCHEMA_VERSION = 1

export type ExportedPreferences = {
  name: string | null
  avatar: string
  hasCompletedOnboarding: boolean
  lastVisit: string | null
}

export interface ExportedData {
  version: number
  exportedAt: string
  tasks: Task[]
  preferences: ExportedPreferences
  settings: AppSettings
}

export const DataService = {
  exportData(): ExportedData {
    const tasks = useTaskStore.getState().tasks
    const prefs = useUserStore.getState().preferences
    const settings = useSettingsStore.getState()

    const exported: ExportedData = {
      version: DATA_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      tasks: tasks.map((t) => ({ ...t })),
      preferences: {
        name: prefs.name ?? null,
        avatar: prefs.avatar ?? '',
        hasCompletedOnboarding: prefs.hasCompletedOnboarding ?? false,
        lastVisit: prefs.lastVisit ? new Date(prefs.lastVisit).toISOString() : null,
      },
      settings: {
        themeMode: settings.themeMode,
        newTasksOnTop: settings.newTasksOnTop,
      },
    }
    return exported
  },

  downloadExport(data: ExportedData, filename = 'everyday-export.json') {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },

  async importData(fileContent: string): Promise<{ success: boolean; message?: string }> {
    try {
      const parsed = JSON.parse(fileContent) as Partial<ExportedData>
      if (!parsed || typeof parsed !== 'object') return { success: false, message: 'Invalid export format' }
      if (typeof parsed.version !== 'number' || parsed.version !== DATA_SCHEMA_VERSION) return { success: false, message: 'Unsupported export version' }
      if (!Array.isArray(parsed.tasks) || !parsed.preferences) return { success: false, message: 'Missing tasks or preferences' }

      const tasks: Task[] = parsed.tasks.map((t: any) => ({
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        lastCompletedAt: t.lastCompletedAt ? new Date(t.lastCompletedAt) : undefined,
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        startDate: t.startDate ? new Date(t.startDate) : undefined,
        notificationIds: t.notificationIds || [],
      }))

      // Apply to stores
      useTaskStore.getState().setTasks(tasks)

      const prefsRaw = parsed.preferences as any
      const validatedPrefs = {
        name: typeof prefsRaw?.name === 'string' ? prefsRaw.name : null,
        avatar: typeof prefsRaw?.avatar === 'string' ? prefsRaw.avatar : '',
        hasCompletedOnboarding: Boolean(prefsRaw?.hasCompletedOnboarding),
        lastVisit: prefsRaw?.lastVisit ? new Date(prefsRaw.lastVisit) : null,
      }
      useUserStore.getState().setPreferences(validatedPrefs)

      if (parsed.settings) {
        const s = parsed.settings as Partial<AppSettings>
        if (typeof s.newTasksOnTop === 'boolean') useSettingsStore.getState().setNewTasksOnTop(s.newTasksOnTop)
        if (s.themeMode) useSettingsStore.getState().setThemeMode(s.themeMode)
      }

      return { success: true }
    } catch (error) {
      const appError = handleValidationError(error, 'importData')
      return { success: false, message: appError.message }
    }
  },
}

export default DataService
