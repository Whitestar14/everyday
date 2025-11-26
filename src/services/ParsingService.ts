// services/ParsingService.ts
import * as chrono from 'chrono-node';

export type RecurrenceType =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'weekday'
  | 'weekend'
  | 'custom-weekly';

export interface Recurrence {
  type: RecurrenceType;
  daysOfWeek?: number[];
  raw?: string;
}

export interface ParsedTaskInput {
  cleanText: string;
  dueDate?: Date | string;
  startDate?: Date | string;
  recurrence?: Recurrence;
  errors?: string[];
  meta?: {
    extractedDueFragment?: string;
    extractedStartFragment?: string;
    additionalDates?: { text: string; date: Date | string }[];
  };
}

export interface ParseOptions {
  returnISO?: boolean;
  referenceDate?: Date;
  strict?: boolean;
}

const DEFAULT_OPTIONS: ParseOptions = {
  returnISO: true,
  referenceDate: new Date(),
  strict: false,
};

const START_PATTERN = /\b(start(?:ing)?|begin)\b(?:\s+(?:on|at))?\s+(.+?)(?=$|[.,;])/i;
const DUE_PATTERN = /\b(due|due\s+on|by)\b(?:\s+(?:on|at))?\s+(.+?)(?=$|[.,;])/i;

// IMPORTANT: detect recurrence before stripping start/due phrases
const RECURRENCE_PATTERN =
  /\b(every\s+(?:day|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekday|weekend)(?:s)?|daily|weekly|monthly|yearly)\b/i;

// Expand hints to include “tomorrowish”
const DATE_HINTS =
  /\b(tomorrow|tomorrowish|today|yesterday|next|in\s+\d+\s+(?:day|days|hour|hours|week|weeks)|\d{1,2}:\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})\b/i;

function toOut(value: Date, options: ParseOptions): Date | string {
  return options.returnISO ? value.toISOString() : value;
}

function parseFirstDate(text: string, options: ParseOptions) {
  const results = chrono.parse(text, options.referenceDate);
  if (results.length === 0) return undefined;
  const r = results[0];
  const d = r.start?.date();
  if (!d) return undefined;
  return { date: d, fragment: r.text };
}

function parseAllDates(text: string, options: ParseOptions) {
  const results = chrono.parse(text, options.referenceDate);
  return results
    .map(r => {
      const d = r.start?.date();
      return d ? { date: d, fragment: r.text } : null;
    })
    .filter(Boolean) as { date: Date; fragment: string }[];
}

function normalizeWhitespace(s: string) {
  return s.replace(/\s+/g, ' ').replace(/\s+([.,;])/, '$1').trim();
}

// Smart fragment removal: remove the fragment and optional adjacent conjunctions
function removeFragment(base: string, fragment?: string) {
  if (!fragment) return base;
  const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Optional leading/trailing conjunctions or punctuation around the fragment
  // Examples we want to clean:
  // "Report due by tomorrow" -> "Report"
  // "Meeting Jan 10 and Jan 12" -> "Meeting"
  // "Task starting on someday" -> "Task"
  const rx = new RegExp(
    // leading spaces or conjunctions
    `(?:^|\\s|[.,;])` +
      // optional "and" or comma before
      `(?:and\\s+|,\\s*)?` +
      // the fragment itself
      `${escaped}` +
      // optional "and" or comma after
      `(?:\\s*(?:and|,))?` +
      // trailing boundary
      `(?:\\s|[.,;]|$)`,
    'i'
  );

  const cleaned = base.replace(rx, ' ').replace(/\s+/g, ' ').trim();
  return cleaned;
}

function normalizeRecurrence(raw: string): Recurrence {
  const lower = raw.toLowerCase();
  if (/\bdaily\b|\bevery day\b/.test(lower)) return { type: 'daily', raw };
  if (/\bweekly\b|\bevery week\b/.test(lower)) return { type: 'weekly', raw };
  if (/\bmonthly\b|\bevery month\b/.test(lower)) return { type: 'monthly', raw };
  if (/\byearly\b|\bevery year\b/.test(lower)) return { type: 'yearly', raw };
  if (/\bweekday(s)?\b/.test(lower)) return { type: 'weekday', raw };
  if (/\bweekend(s)?\b/.test(lower)) return { type: 'weekend', raw };
  const dayMatch = lower.match(/\bevery\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
  if (dayMatch) {
    const map: Record<string, number> = {
      sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
    };
    return { type: 'custom-weekly', daysOfWeek: [map[dayMatch[1]]], raw };
  }
  return { type: 'none', raw };
}

export function parseTaskInput(text: string, userOptions: Partial<ParseOptions> = {}): ParsedTaskInput {
  const options: ParseOptions = { ...DEFAULT_OPTIONS, ...userOptions };
  const errors: string[] = [];
  let cleanText = text.trim();

  // 1) Detect recurrence FIRST so due/start removal doesn’t swallow “every …”
  let recurrence: Recurrence | undefined;
  const recMatch = cleanText.match(RECURRENCE_PATTERN);
  if (recMatch) {
    recurrence = normalizeRecurrence(recMatch[0]);
    cleanText = removeFragment(cleanText, recMatch[0]);
  }

  // 2) Extract start/due phrases (and remove them fully even if unparseable)
  let startDate: Date | string | undefined;
  let dueDate: Date | string | undefined;
  let extractedStartFragment: string | undefined;
  let extractedDueFragment: string | undefined;

  const startMatch = cleanText.match(START_PATTERN);
  if (startMatch) {
    const startText = startMatch[2].trim();
    const parsed = parseFirstDate(startText, options);
    if (parsed) {
      startDate = toOut(parsed.date, options);
      extractedStartFragment = startMatch[0];
    } else {
      errors.push(`Found start phrase but couldn't parse date: "${startText}"`);
      extractedStartFragment = startMatch[0];
    }
    // Always remove the full match cleanly
    cleanText = removeFragment(cleanText, startMatch[0]);
  }

  const dueMatch = cleanText.match(DUE_PATTERN);
  if (dueMatch) {
    const dueText = dueMatch[2].trim();
    const parsed = parseFirstDate(dueText, options);
    if (parsed) {
      dueDate = toOut(parsed.date, options);
      extractedDueFragment = dueMatch[0];
    } else {
      errors.push(`Found due/by phrase but couldn't parse date: "${dueText}"`);
      extractedDueFragment = dueMatch[0];
    }
    // Always remove the full match cleanly
    cleanText = removeFragment(cleanText, dueMatch[0]);
  }

  // 3) Additional dates (first -> dueDate, rest -> meta.additionalDates)
  const additionalDatesRaw = parseAllDates(cleanText, options);
  const additionalDates: { text: string; date: Date | string }[] = [];

  if (!dueDate && additionalDatesRaw.length > 0) {
    const first = additionalDatesRaw[0];
    dueDate = toOut(first.date, options);
    cleanText = removeFragment(cleanText, first.fragment);
    additionalDatesRaw.shift();
  }
  for (const r of additionalDatesRaw) {
    additionalDates.push({ text: r.fragment, date: toOut(r.date, options) });
    cleanText = removeFragment(cleanText, r.fragment);
  }

  // 4) Hint errors (ensure we flag fuzzy hints too, e.g., “tomorrowish”)
  if (!startDate && !dueDate && DATE_HINTS.test(text)) {
    errors.push("Couldn't parse date or time from input despite hints.");
  }

  cleanText = normalizeWhitespace(cleanText);

  return {
    cleanText,
    dueDate,
    startDate,
    recurrence,
    errors: errors.length ? errors : undefined,
    meta: {
      extractedDueFragment,
      extractedStartFragment,
      additionalDates: additionalDates.length ? additionalDates : undefined,
    },
  };
}

/* =========================
   Highlight extraction
   ========================= */

export type HighlightType = 'date' | 'recurrence' | 'start' | 'due';

export interface HighlightFragment {
  text: string;
  start: number; // inclusive
  end: number;   // exclusive
  type: HighlightType;
}

export function extractHighlightFragments(text: string, referenceDate: Date = new Date()): HighlightFragment[] {
  if (!text || !text.trim()) return [];

  const fragments: HighlightFragment[] = [];

  const RECURRENCE_RX =
    /\b(every\s+(?:day|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekday|weekend)(?:s)?|daily|weekly|monthly|yearly)\b/gi;
  const START_HDR_RX = /\b(start(?:ing)?|begin)\b(?:\s+(?:on|at))?\s+/gi;
  const DUE_HDR_RX   = /\b(due|due\s+on|by)\b(?:\s+(?:on|at))?\s+/gi;

  for (const m of text.matchAll(RECURRENCE_RX)) {
    fragments.push({ text: m[0], start: m.index!, end: m.index! + m[0].length, type: 'recurrence' });
  }
  for (const m of text.matchAll(START_HDR_RX)) {
    fragments.push({ text: m[0], start: m.index!, end: m.index! + m[0].length, type: 'start' });
  }
  for (const m of text.matchAll(DUE_HDR_RX)) {
    fragments.push({ text: m[0], start: m.index!, end: m.index! + m[0].length, type: 'due' });
  }

  // Chrono date fragments (with positions)
  try {
    const results = chrono.parse(text, referenceDate);
    for (const r of results) {
      if (typeof r.index === 'number' && r.text) {
        fragments.push({
          text: r.text,
          start: r.index,
          end: r.index + r.text.length,
          type: 'date',
        });
      }
    }
  } catch {
    // Safe fail
  }

  if (fragments.length === 0) return [];

  fragments.sort((a, b) => a.start - b.start || a.end - b.end);

  // Resolve overlaps with priority: start/due > recurrence > date
  const prio: Record<HighlightType, number> = { start: 3, due: 3, recurrence: 2, date: 1 };
  const resolved: HighlightFragment[] = [];

  for (const f of fragments) {
    if (resolved.length === 0) {
      resolved.push(f);
      continue;
    }
    const last = resolved[resolved.length - 1];
    const overlaps = !(f.end <= last.start || f.start >= last.end);

    if (!overlaps) {
      resolved.push(f);
      continue;
    }

    if (prio[f.type] > prio[last.type]) {
      if (f.start > last.start) {
        resolved.splice(resolved.length - 1, 0, { ...last, end: f.start });
      }
      resolved[resolved.length - 1] = f;
      if (last.end > f.end) {
        resolved.push({ ...last, start: f.end });
      }
    } else {
      if (f.start < last.start) {
        resolved.splice(resolved.length - 1, 0, { ...f, end: last.start });
      }
      if (f.end > last.end) {
        resolved.push({ ...f, start: last.end });
      }
    }
  }

  // Clamp + normalize
  const normalized = resolved
    .map(f => ({ ...f, start: Math.max(0, f.start), end: Math.max(f.start, f.end) }))
    .filter(f => f.end > f.start);

  // Group contiguous or touching same-type fragments (allow single-space separation)
  const grouped: HighlightFragment[] = [];
  let current: HighlightFragment | null = null;
  for (const f of normalized) {
    if (!current) {
      current = { ...f };
      continue;
    }
    const sameType = f.type === current.type;
    const contiguousOrTouching = f.start <= current.end + 1; // tolerate one space
    if (sameType && contiguousOrTouching) {
      current.end = Math.max(current.end, f.end);
    } else {
      grouped.push(current);
      current = { ...f };
    }
  }
  if (current) grouped.push(current);

  return grouped;
}
