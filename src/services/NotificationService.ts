import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { RRule } from 'rrule';
import type { Task } from '../types/app';
import { createRRule, getNextOccurrence } from './RecurrenceService';

const PERMISSION_KEY = 'notification_permission_granted';

export const requestPermission = async (): Promise<boolean> => {
  if (Capacitor.getPlatform() === 'web') {
    // Capacitor handles web notifications via browser API if supported
    // For simplicity, proceed with Capacitor's requestPermissions
  }

  const { display } = await LocalNotifications.checkPermissions();
  if (display === 'granted') {
    localStorage.setItem(PERMISSION_KEY, 'granted');
    return true;
  }

  if (localStorage.getItem(PERMISSION_KEY) === 'denied') {
    return false; // Don't ask repeatedly
  }

  const result = await LocalNotifications.requestPermissions();
  if (result.display === 'granted') {
    localStorage.setItem(PERMISSION_KEY, 'granted');
    return true;
  } else {
    localStorage.setItem(PERMISSION_KEY, 'denied');
    return false;
  }
};

export const scheduleNotification = async (task: Task): Promise<string[]> => {
  if (!task.dueDate && !task.recurrence) return [];

  const now = new Date();
  let scheduleTime: Date | null = null;

  if (task.recurrence) {
    const rruleObj = RRule.fromString(task.recurrence.rrule);
    const next = getNextOccurrence(rruleObj, now);
    if (next) {
      scheduleTime = new Date(next.getTime() - 60 * 60 * 1000); // 1 hour before
    }
  } else if (task.dueDate) {
    scheduleTime = new Date(task.dueDate.getTime() - 60 * 60 * 1000);
  }

  if (!scheduleTime || scheduleTime <= now) return [];

  const id = Date.now(); // Simple unique ID generation
  await LocalNotifications.schedule({
    notifications: [{
      id,
      title: 'Gentle Reminder',
      body: `gentle reminder: ${task.text}`,
      schedule: { at: scheduleTime }
    }]
  });

  return [id.toString()];
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  await LocalNotifications.cancel({
    notifications: [{ id: parseInt(notificationId, 10) }]
  });
};

export const cancelTaskNotifications = async (task: Task): Promise<void> => {
  if (!task.notificationIds || task.notificationIds.length === 0) return;
  const ids = task.notificationIds.map(id => ({ id: parseInt(id, 10) }));
  await LocalNotifications.cancel({ notifications: ids });
};

export const rescheduleRecurringNotifications = async (task: Task): Promise<string[]> => {
  // Cancel existing notifications
  await cancelTaskNotifications(task);
  // Schedule new ones for the recurring task
  return await scheduleNotification(task);
};