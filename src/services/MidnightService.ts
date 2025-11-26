import type { Task } from '@/types/app';
import { shouldShowToday } from './RecurrenceService';

const midnightCallbacks: (() => void)[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;

function checkMidnight() {
    const now = new Date();
    const lastCheck = localStorage.getItem('lastMidnightCheck');
    const lastDate = lastCheck ? new Date(lastCheck) : null;

    // Check if day has changed (handles timezone changes via local date string)
    if (!lastDate || now.toDateString() !== lastDate.toDateString()) {
        localStorage.setItem('lastMidnightCheck', now.toISOString());
        midnightCallbacks.forEach((cb) => cb());
    }
}

export function setupMidnightRunner(): void {
    // clear any existing interval before starting a new one
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(checkMidnight, 60000);
    // Initial check on setup
    checkMidnight();
}

export function teardownMidnightRunner(): void {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
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

// Expose checkMidnight for testing convenience
export { checkMidnight };

export function recalculateTodayTasks(tasks: Task[]): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks
        .filter((task) => {
            if (task.dueDate && task.dueDate >= today && task.dueDate < tomorrow) return true;
            if (task.startDate && task.startDate <= today) return true;
            if (task.recurrence && shouldShowToday(task.recurrence.rrule)) return true;
            if (task.lastCompletedAt && !task.recurrence && task.dueDate && task.dueDate < today) return false;
            return false;
        })
        .map((task) => {
            if (task.recurrence && task.lastCompletedAt) {
                return { ...task, lastCompletedAt: undefined };
            }
            return task;
        });
}
