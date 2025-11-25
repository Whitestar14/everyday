import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settings'

export function useSettings() {
  const {
    loadSettings
  } = useSettingsStore()

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [loadSettings])
}
