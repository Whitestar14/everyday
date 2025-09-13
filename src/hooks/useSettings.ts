import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settings'

export function useSettings() {
  const {
    buttonPosition,
    themeMode,
    setButtonPosition,
    setThemeMode,
    getButtonPositionStyles,
    loadSettings
  } = useSettingsStore()

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Apply theme
  useEffect(() => {
    const root = document.documentElement
    
    if (themeMode === 'dark') {
      root.classList.add('dark')
    } else if (themeMode === 'light') {
      root.classList.remove('dark')
    } else {
      // System preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      if (mediaQuery.matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [themeMode])

  return {
    buttonPosition,
    themeMode,
    handleButtonPositionChange: setButtonPosition,
    handleThemeChange: setThemeMode,
    getButtonPositionStyles
  }
}
