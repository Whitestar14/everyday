import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.studio.everyday',
  appName: 'Everyday',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      sound: 'gentle.wav',
      channels: [
        {
          id: 'gentle-reminders',
          name: 'Gentle Reminders',
          importance: 3
        }
      ]
    }
  }
};

export default config;