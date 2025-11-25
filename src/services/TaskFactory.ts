// services/TaskFactory.ts
import { parseTaskInput } from '@/services/ParsingService';
import { createRRule } from '@/services/RecurrenceService';
import type { Task } from '@/types/app';

export function buildTaskFromText(
  text: string,
  overrides?: Partial<Task>
): { text: string; metadata: Partial<Task>; type: 'task' | 'routine' } {
  const parsed = parseTaskInput(text, { returnISO: false });
  const metadata: Partial<Task> = { ...overrides };

  // Prefer explicit overrides, otherwise use parsed dates
  if (!metadata.dueDate && parsed.dueDate) {
    metadata.dueDate = parsed.dueDate as Date;
  }
  if (!metadata.startDate && parsed.startDate) {
    metadata.startDate = parsed.startDate as Date;
  }

  // Build recurrence anchored to startDate or dueDate (dtstart)
  const recurrenceRaw = overrides?.recurrence
    ? null
    : parsed.recurrence?.raw;

  if (recurrenceRaw && !metadata.recurrence) {
    const { rule } = createRRule(recurrenceRaw, {
      dtstart: (metadata.startDate ?? metadata.dueDate) || undefined,
    });
    if (rule) metadata.recurrence = rule;
  }

  const type: 'task' | 'routine' = metadata.recurrence ? 'routine' : 'task';
  const finalText = parsed.cleanText || text.trim();

  return { text: finalText, metadata, type };
}
