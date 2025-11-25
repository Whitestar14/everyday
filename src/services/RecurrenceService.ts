// services/RecurrenceService.ts
import { RRule as RRuleClass, Weekday } from 'rrule';
import type { RRule, Options as RRuleOptions } from 'rrule';

export interface RecurrenceRule {
  rrule: string;
  description: string;
}

type CreateResult = { rule: RecurrenceRule | null; error: string | null };

const DAY_MAP: Record<string, Weekday> = {
  sunday: RRuleClass.SU, sun: RRuleClass.SU,
  monday: RRuleClass.MO, mon: RRuleClass.MO,
  tuesday: RRuleClass.TU, tue: RRuleClass.TU, tues: RRuleClass.TU,
  wednesday: RRuleClass.WE, wed: RRuleClass.WE,
  thursday: RRuleClass.TH, thu: RRuleClass.TH, thurs: RRuleClass.TH,
  friday: RRuleClass.FR, fri: RRuleClass.FR,
  saturday: RRuleClass.SA, sat: RRuleClass.SA,
};

const ORDINAL_MAP: Record<string, number> = {
  first: 1, 1: 1, '1st': 1,
  second: 2, 2: 2, '2nd': 2,
  third: 3, 3: 3, '3rd': 3,
  fourth: 4, 4: 4, '4th': 4,
  fifth: 5, 5: 5, '5th': 5,
};

function parseInterval(text: string): number | null {
  const other = /\bevery\s+other\b/.test(text);
  if (other) return 2;
  const m = text.match(/\bevery\s+(\d+)\b/);
  return m ? Math.max(1, parseInt(m[1], 10)) : 1;
}

function parseDaysList(text: string): Weekday[] | null {
  const tokens = text.replace(/and/gi, ',').replace(/\s+/g, ' ').split(/[,\s]+/).filter(Boolean);
  const days: Weekday[] = [];
  for (const t of tokens) {
    const d = DAY_MAP[t.toLowerCase()];
    if (d) days.push(d);
  }
  return days.length ? dedupeWeekdays(days) : null;
}

function dedupeWeekdays(days: Weekday[]): Weekday[] {
  const set = new Map<string, Weekday>();
  for (const d of days) set.set(d.toString(), d);
  return Array.from(set.values());
}

function parseOrdinal(text: string): number | 'last' | null {
  const lower = text.toLowerCase();
  if (/\blast\b/.test(lower)) return 'last';
  const m = lower.match(/\b(first|second|third|fourth|fifth|1st|2nd|3rd|4th|5th|\d)\b/);
  if (!m) return null;
  const raw = m[1];
  if (raw === 'last') return 'last';
  const n = ORDINAL_MAP[raw];
  return n ?? null;
}

function parseMonthDay(text: string): number | null {
  const m = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= 31 ? n : null;
}

function humanizeDays(days: Weekday[]): string {
  const names: Record<string, string> = { SU: 'Sunday', MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday', TH: 'Thursday', FR: 'Friday', SA: 'Saturday' };
  return days.map(d => names[d.toString()]).join(', ');
}

/**
 * Create an RRule string + description from a natural-language pattern.
 * Accepts optional dtstart/until/count to anchor and constrain the series.
 */
export function createRRule(
  pattern: string,
  extra?: { dtstart?: Date; until?: Date; count?: number }
): CreateResult {
  const lower = pattern.toLowerCase().trim();
  const opts: Partial<RRuleOptions> = {};
  let description = '';

  // Base frequencies
  if (/\b(daily|every day)\b/.test(lower)) {
    opts.freq = RRuleClass.DAILY;
    opts.interval = parseInterval(lower) ?? 1;
    description = opts.interval! > 1 ? `Every ${opts.interval} days` : 'Daily';

  } else if (/\b(weekly|every week)\b/.test(lower)) {
    opts.freq = RRuleClass.WEEKLY;
    opts.interval = parseInterval(lower) ?? 1;
    description = opts.interval! > 1 ? `Every ${opts.interval} weeks` : 'Weekly';

  } else if (/\b(monthly|every month)\b/.test(lower)) {
    opts.freq = RRuleClass.MONTHLY;
    opts.interval = parseInterval(lower) ?? 1;
    description = opts.interval! > 1 ? `Every ${opts.interval} months` : 'Monthly';

  } else if (/\b(yearly|every year)\b/.test(lower)) {
    opts.freq = RRuleClass.YEARLY;
    opts.interval = parseInterval(lower) ?? 1;
    description = opts.interval! > 1 ? `Every ${opts.interval} years` : 'Yearly';
  }

  // Weekday groups
  if (/\bevery\s+weekday(s)?\b/.test(lower)) {
    opts.freq = RRuleClass.WEEKLY;
    opts.byweekday = [RRuleClass.MO, RRuleClass.TU, RRuleClass.WE, RRuleClass.TH, RRuleClass.FR];
    opts.interval = parseInterval(lower) ?? 1;
    description = `Every weekday${opts.interval! > 1 ? `, every ${opts.interval} weeks` : ''}`;
  } else if (/\bevery\s+weekend(s)?\b/.test(lower)) {
    opts.freq = RRuleClass.WEEKLY;
    opts.byweekday = [RRuleClass.SA, RRuleClass.SU];
    opts.interval = parseInterval(lower) ?? 1;
    description = `Every weekend${opts.interval! > 1 ? `, every ${opts.interval} weeks` : ''}`;
  }

  // Specific weekdays list
  const listMatch = lower.match(/\bevery\s+((?:mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:[,\s]+(?:mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday))*)\b/);
  if (listMatch) {
    const days = parseDaysList(listMatch[1]);
    if (days) {
      opts.freq = RRuleClass.WEEKLY;
      opts.byweekday = days;
      opts.interval = parseInterval(lower) ?? 1;
      description = `Every ${humanizeDays(days)}${opts.interval! > 1 ? `, every ${opts.interval} weeks` : ''}`;
    }
  } else {
    const singleDayMatch = lower.match(/\bevery\s+(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
    if (singleDayMatch) {
      const d = DAY_MAP[singleDayMatch[1]];
      if (d) {
        opts.freq = RRuleClass.WEEKLY;
        opts.byweekday = d;
        opts.interval = parseInterval(lower) ?? 1;
        description = `Every ${humanizeDays([d])}${opts.interval! > 1 ? `, every ${opts.interval} weeks` : ''}`;
      }
    }
  }

  // every other week on <day>
  if (/\bevery\s+other\s+week\b/.test(lower)) {
    opts.freq = RRuleClass.WEEKLY;
    opts.interval = 2;
    const dmatch = lower.match(/\bon\s+(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
    if (dmatch) {
      const d = DAY_MAP[dmatch[1]];
      if (d) {
        opts.byweekday = d;
        description = `Every other week on ${humanizeDays([d])}`;
      } else {
        description = 'Every other week';
      }
    } else {
      description = 'Every other week';
    }
  }

  // nth weekday of month
  if (/\b(first|second|third|fourth|fifth|1st|2nd|3rd|4th|5th|last)\s+(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b.*\b(of\s+month)?\b/.test(lower)) {
    const ord = parseOrdinal(lower);
    const dmatch = lower.match(/\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
    const d = dmatch ? DAY_MAP[dmatch[1]] : null;
    if (d) {
      opts.freq = RRuleClass.MONTHLY;
      if (ord === 'last') {
        opts.byweekday = d;
        opts.bysetpos = -1;
        description = `Last ${humanizeDays([d])} of month`;
      } else if (typeof ord === 'number') {
        opts.byweekday = d;
        opts.bysetpos = ord;
        const names: Record<number, string> = { 1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth' };
        description = `${names[ord] ?? `${ord}th`} ${humanizeDays([d])} of month`;
      }
    }
  }

  // every month on the <day>
  if (/\bevery\s+month\b.*\bon\b/.test(lower) || /\bon\s+the\s+\d{1,2}(st|nd|rd|th)?\b/.test(lower)) {
    const day = parseMonthDay(lower);
    if (day) {
      opts.freq = RRuleClass.MONTHLY;
      opts.bymonthday = day;
      opts.interval = parseInterval(lower) ?? 1;
      description = `Every month on the ${day}`;
    }
  }

  if (!opts.freq) {
    return { rule: null, error: 'Unsupported recurrence pattern' };
  }

  if (extra?.dtstart) opts.dtstart = extra.dtstart;
  if (extra?.until) opts.until = extra.until;
  if (typeof extra?.count === 'number') opts.count = Math.max(1, extra.count);

  try {
    const r = new RRuleClass(opts as RRuleOptions);
    return { rule: { rrule: r.toString(), description }, error: null };
  } catch {
    return { rule: null, error: 'Invalid recurrence options for pattern' };
  }
}

// Utilities
export function getNextOccurrence(rule: RRule, after?: Date): Date {
  const base = after ?? new Date();
  return rule.after(base, true) ?? base;
}

export function getHumanReadable(rule: RRule): string {
  return rule.toText();
}

export function shouldShowToday(rruleStr: string, now: Date = new Date()): boolean {
  const rule = RRuleClass.fromString(rruleStr);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const prev = new Date(today.getTime() - 1);
  const next = rule.after(prev, true);
  return next ? next.toDateString() === today.toDateString() : false;
}
