import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import SystemBars from '@/plugins/SystemBars'

export function UpdateSystemBars() {
  const { theme } = useTheme()

  useEffect(() => {
    const statusColor = theme === 'dark' ? '#0e0a09' : '#fdf7f4'
    const navColor = theme === 'dark' ? '#0e0a09' : '#fdf7f4'
    const styles = theme === 'dark' ? 'light' : 'dark'

      SystemBars.setBarsColor({ statusColor, navColor, styles })
  }, [theme])

  return null
}
