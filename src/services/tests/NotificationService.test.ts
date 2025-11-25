import { vi, test, expect } from 'vitest';
import { scheduleNotification } from '@/services/NotificationService';
import type { Task } from '@/types/app';

// Mock the Capacitor LocalNotifications plugin
vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    schedule: vi.fn(async () => ({ notifications: [] })),
    cancel: vi.fn(async () => ({})),
    checkPermissions: vi.fn(async () => ({ display: 'granted' })),
    requestPermissions: vi.fn(async () => ({ display: 'granted' })),
  },
}));

test('schedules reminder 10 minutes before due date', async () => {
  const task: Task = {
    id: '1',
    text: 'Test task',
    type: 'task',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 60 * 60 * 1000), // 1h from now
    reminderOffsetMinutes: 10,
    reminderEnabled: true,
    notificationIds: [],
  };

  const ids = await scheduleNotification(task);

  expect(ids.length).toBe(1);
  expect(ids[0]).toMatch(/\d+/); // should be a stringified number
});
