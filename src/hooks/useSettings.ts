import { useState, useEffect } from 'react'
import type { ButtonPosition, ThemeMode } from '@/types/app'

export function useSettings() {
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition>('bottom-right')
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')

  // Load settings from localStorage
  useEffect(() => {
    const savedButtonPosition = localStorage.getItem('everyday-button-position') as ButtonPosition
    const savedTheme = localStorage.getItem('everyday-theme') as ThemeMode
    
    if (savedButtonPosition) setButtonPosition(savedButtonPosition)
    if (savedTheme) setThemeMode(savedTheme)
  }, [])

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

  const handleButtonPositionChange = (position: ButtonPosition) => {
    setButtonPosition(position)
    localStorage.setItem('everyday-button-position', position)
  }

  const handleThemeChange = (theme: ThemeMode) => {
    setThemeMode(theme)
    localStorage.setItem('everyday-theme', theme)
  }

  const getButtonPositionStyles = () => {
    switch (buttonPosition) {
      case 'bottom-left':
        return 'bottom-6 left-6'
      case 'bottom-center':
        return 'bottom-6 left-1/2 -translate-x-1/2'
      default:
        return 'bottom-6 right-6'
    }
  }

  return {
    buttonPosition,
    themeMode,
    handleButtonPositionChange,
    handleThemeChange,
    getButtonPositionStyles
  }
}
