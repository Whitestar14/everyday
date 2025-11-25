import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { registerPlugin } from '@capacitor/core';

const SystemBars = registerPlugin<{
  setBarsColor(options: {
    statusColor: string;
    navColor: string;
    styles: string;
  }): Promise<void>;
}>('SystemBars');

export function UpdateSystemBars() {
  const { theme } = useTheme();

  useEffect(() => {
    SystemBars.setBarsColor({
      statusColor: theme === 'dark' ? '#0e0a09' : '#fdf7f4',
      navColor: theme === 'dark' ? '#0e0a09' : '#fdf7f4',
      styles: theme === 'dark' ? 'light' : 'dark'
    });
  }, [theme]);

  return null;
}
