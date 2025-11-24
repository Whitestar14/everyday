import * as chrono from 'chrono-node';

export interface ParsedTaskInput {
  cleanText: string;
  dueDate?: Date;
  startDate?: Date;
  recurrence?: string;
  errors?: string[];
}

export function parseTaskInput(text: string): ParsedTaskInput {
  let cleanText = text;
  let dueDate: Date | undefined;
  let startDate: Date | undefined;
  let recurrence: string | undefined;
  let errors: string[] = [];

  // Detect and parse startDate (e.g., "start on monday", "starting on tomorrow")
  const startDateMatch = cleanText.match(/(start on|starting on|begin on)\s+(.+)/i);
  if (startDateMatch) {
    const startText = startDateMatch[2];
    const startResults = chrono.parse(startText);
    if (startResults.length > 0) {
      startDate = startResults[0].start.date();
      cleanText = cleanText.replace(startDateMatch[0], '').trim();
    }
  }

  // Detect and parse dueDate (e.g., "due on friday", "due tomorrow", "by monday")
  const dueDateMatch = cleanText.match(/(due on|due|by)\s+(.+)/i);
  if (dueDateMatch) {
    const dueText = dueDateMatch[2];
    const dueResults = chrono.parse(dueText);
    if (dueResults.length > 0) {
      dueDate = dueResults[0].start.date();
      cleanText = cleanText.replace(dueDateMatch[0], '').trim();
    }
  }

  // If no explicit dueDate, parse any remaining dates as dueDate (e.g., "buy milk tomorrow", "meeting at 3pm")
  if (!dueDate) {
    const results = chrono.parse(cleanText);
    if (results.length > 0) {
      dueDate = results[0].start.date();
      cleanText = cleanText.replace(results[0].text, '').trim();
    }
  }

  // Detect recurrence patterns (e.g., "every monday", "daily", "weekly")
  const recurrenceRegex = /(every\s+(day|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekday|weekend)|daily|weekly|monthly|yearly)/i;
  const recurrenceMatch = cleanText.match(recurrenceRegex);
  if (recurrenceMatch) {
    recurrence = recurrenceMatch[0];
    cleanText = cleanText.replace(recurrenceRegex, '').trim();
  }

  // Detect potential parse errors
  const dateKeywords = /(tomorrow|today|yesterday|next|in \d+ days?|at \d+:\d+|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})/i;
  const timeRegex = /\d+:\d+/;
  if ((!dueDate && !startDate) && (dateKeywords.test(text) || timeRegex.test(text))) {
    errors.push("Couldn't parse date or time");
  }

  return { cleanText, dueDate, startDate, recurrence, errors };
}