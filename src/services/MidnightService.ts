import type { Task } from '@/types/app';
import { shouldShowToday } from './RecurrenceService';

const midnightCallbacks: (() => void)[] = [];

export function setupMidnightRunner(): void {
  const checkMidnight = () => {
    const now = new Date();
    const lastCheck = localStorage.getItem('lastMidnightCheck');
    const lastDate = lastCheck ? new Date(lastCheck) : null;

    // Check if day has changed (handles timezone changes via local date string)
    if (!lastDate || now.toDateString() !== lastDate.toDateString()) {
      localStorage.setItem('lastMidnightCheck', now.toISOString());
      midnightCallbacks.forEach(callback => callback());
    }
  };

  // Check every minute as fallback for Capacitor background tasks
  setInterval(checkMidnight, 60000);
  // Initial check on setup
  checkMidnight();
}

export function calculateTimeUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

export function onMidnightTick(callback: () => void): void {
  midnightCallbacks.push(callback);
}

export function recalculateTodayTasks(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasks
    .filter(task => {
      // (isPinned deprecated) Include tasks due today

      // Include tasks due today
      if (task.dueDate && task.dueDate >= today && task.dueDate < tomorrow) return true;

  // Include tasks that started today or earlier
      if (task.startDate && task.startDate <= today) return true;

  // Include recurring tasks scheduled for today
  if (task.recurrence && shouldShowToday(task.recurrence.rrule)) return true;

      // Exclude completed one-time tasks from previous days (assuming "configured" means always for simplicity)
      if (task.lastCompletedAt && !task.recurrence && task.dueDate && task.dueDate < today) return false;

      return false;
    })
    .map(task => {
      // Update recurring task instances: if completed and recurring, reset completion for next occurrence
      if (task.recurrence && task.lastCompletedAt) {
        // Assuming we reset lastCompletedAt to allow next instance
        return { ...task, lastCompletedAt: undefined };
      }
      return task;
    });
}