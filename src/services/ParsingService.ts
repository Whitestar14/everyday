// services/ParsingService.ts
import * as chrono from 'chrono-node';

/* =========================
   Types
   ========================= */

export type RecurrenceType =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'weekday'
  | 'weekend'
  | 'custom-weekly'

export interface Recurrence {
  type: RecurrenceType
  daysOfWeek?: number[]
  raw?: string
}

export interface ParsedTaskInput {
  cleanText: string
  dueDate?: Date | string
  startDate?: Date | string
  recurrence?: Recurrence
  errors?: string[]
  meta?: {
    extractedDueFragment?: string
    extractedStartFragment?: string
    additionalDates?: { text: string; date: Date | string }[]
  }
}

export interface ParseOptions {
  returnISO?: boolean
  referenceDate?: Date
  strict?: boolean
}

export type HighlightType = 'date' | 'recurrence' | 'start' | 'due'

export interface HighlightFragment {
  text: string
  start: number
  end: number
  type: HighlightType
}

/* =========================
   Precompiled patterns
   ========================= */

const DEFAULT_OPTIONS: ParseOptions = {
    returnISO: true,
    referenceDate: new Date(),
    strict: false,
};

const START_PATTERN = /\b(start(?:ing)?|begin)\b(?:\s+(?:on|at))?\s+(.+?)(?=$|[.,;])/i;
const DUE_PATTERN   = /\b(due|due\s+on|by)\b(?:\s+(?:on|at))?\s+(.+?)(?=$|[.,;])/i;

const RECURRENCE_PATTERN =
  /\b(every\s+(?:day|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekday|weekend)(?:s)?|daily|weekly|monthly|yearly)\b/i;

const RECURRENCE_RX_GLOBAL =
  /\b(every\s+(?:day|week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekday|weekend)(?:s)?|daily|weekly|monthly|yearly)\b/gi;

const START_HDR_RX = /\b(start(?:ing)?|begin)\b(?:\s+(?:on|at))?\s+/gi;
const DUE_HDR_RX   = /\b(due|due\s+on|by)\b(?:\s+(?:on|at))?\s+/gi;

const DATE_HINTS =
  /\b(tomorrow|tomorrowish|today|yesterday|next|in\s+\d+\s+(?:day|days|hour|hours|week|weeks)|\d{1,2}:\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})\b/i;

/* =========================
   Utilities
   ========================= */

function toOut(value: Date, options: ParseOptions): Date | string {
    return options.returnISO ? value.toISOString() : value;
}

function normalizeWhitespace(s: string) {
    return s.replace(/\s+/g, ' ').replace(/\s+([.,;])/, '$1').trim();
}

function removeRange(base: string, start: number, end: number) {
    if (start < 0 || end <= start) return base;
    return (base.slice(0, start) + ' ' + base.slice(end)).replace(/\s+/g, ' ').trim();
}

function removeFirstOccurrence(base: string, fragment: string) {
    if (!fragment) return base;
    const idx = base.toLowerCase().indexOf(fragment.toLowerCase());
    if (idx === -1) return base;
    return removeRange(base, idx, idx + fragment.length);
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

/* =========================
   Single-pass analysis
   ========================= */

interface Analysis {
  startHeader?: { text: string; range: [number, number]; payload: string }
  dueHeader?: { text: string; range: [number, number]; payload: string }
  recurrence?: { text: string; range: [number, number] }
  chronoResults: chrono.ParsedResult[]
}

function analyzeText(original: string, referenceDate: Date): Analysis {
    const text = original;
    let startHeader: Analysis['startHeader'];
    let dueHeader: Analysis['dueHeader'];
    let recurrence: Analysis['recurrence'];

    const recMatch = RECURRENCE_PATTERN.exec(text);
    if (recMatch && typeof recMatch.index === 'number') {
        recurrence = { text: recMatch[0], range: [recMatch.index, recMatch.index + recMatch[0].length] };
    }

    const s = text.match(START_PATTERN);
    if (s && typeof s.index === 'number') {
        const full = s[0];
        const payload = s[2]?.trim() ?? '';
        startHeader = { text: full, range: [s.index, s.index + full.length], payload };
    }

    const d = text.match(DUE_PATTERN);
    if (d && typeof d.index === 'number') {
        const full = d[0];
        const payload = d[2]?.trim() ?? '';
        dueHeader = { text: full, range: [d.index, d.index + full.length], payload };
    }

    const chronoResults = chrono.parse(text, referenceDate);
    return { startHeader, dueHeader, recurrence, chronoResults };
}

/* =========================
   Smart dangling cleanup
   ========================= */

function cleanDanglingConjunctions(text: string): string {
    return text
    // strip trailing conjunctions/punct left after fragment removal
        .replace(/\s*(?:\band\b|,|;)\s*$/i, '')
    // strip leading conjunctions/punct if left dangling
        .replace(/^(?:\s*(?:and|,|;)\s*)+/i, '')
    // fix cases like "Meeting and" after removing two date fragments
        .replace(/\s+\band\b\s+$/i, '')
    // collapse punctuation spacing
        .replace(/\s+([,;])\s*/g, '$1 ')
    // collapse spaces
        .replace(/\s+/g, ' ')
        .trim();
}

/* =========================
   Main parse
   ========================= */

export function parseTaskInput(text: string, userOptions: Partial<ParseOptions> = {}): ParsedTaskInput {
    const options: ParseOptions = { ...DEFAULT_OPTIONS, ...userOptions };
    const errors: string[] = [];
    let cleanText = text.trim();

    const analysis = analyzeText(cleanText, options.referenceDate!);

    // Recurrence
    let recurrence: Recurrence | undefined;
    if (analysis.recurrence) {
        recurrence = normalizeRecurrence(analysis.recurrence.text);
        cleanText = removeRange(cleanText, analysis.recurrence.range[0], analysis.recurrence.range[1]);
    }

    // Start/due from header payloads
    let startDate: Date | string | undefined;
    let dueDate: Date | string | undefined;
    let extractedStartFragment: string | undefined;
    let extractedDueFragment: string | undefined;

    if (analysis.startHeader) {
        const parsed = chrono.parse(analysis.startHeader.payload, options.referenceDate!);
        const date = parsed[0]?.start?.date();
        if (date) {
            startDate = toOut(date, options);
            extractedStartFragment = analysis.startHeader.text;
        } else {
            errors.push(`Found start phrase but couldn't parse date: "${analysis.startHeader.payload}"`);
            extractedStartFragment = analysis.startHeader.text;
        }
        cleanText = removeRange(cleanText, analysis.startHeader.range[0], analysis.startHeader.range[1]);
    }

    if (analysis.dueHeader) {
        const parsed = chrono.parse(analysis.dueHeader.payload, options.referenceDate!);
        const date = parsed[0]?.start?.date();
        if (date) {
            dueDate = toOut(date, options);
            extractedDueFragment = analysis.dueHeader.text;
        } else {
            errors.push(`Found due/by phrase but couldn't parse date: "${analysis.dueHeader.payload}"`);
            extractedDueFragment = analysis.dueHeader.text;
        }
        cleanText = removeRange(cleanText, analysis.dueHeader.range[0], analysis.dueHeader.range[1]);
    }

    // Additional dates (use precomputed chrono results on original text)
    const additionalDates: { text: string; date: Date | string }[] = [];
    if (!dueDate && analysis.chronoResults.length > 0) {
        const first = analysis.chronoResults[0];
        const firstDate = first.start?.date();
        if (firstDate && first.text) {
            dueDate = toOut(firstDate, options);
            cleanText = removeFirstOccurrence(cleanText, first.text);
        }
    }
    for (let i = 1; i < analysis.chronoResults.length; i++) {
        const r = analysis.chronoResults[i];
        const d = r.start?.date();
        if (d && r.text) {
            additionalDates.push({ text: r.text, date: toOut(d, options) });
            cleanText = removeFirstOccurrence(cleanText, r.text);
        }
    }

    // Hint errors
    if (!startDate && !dueDate && DATE_HINTS.test(text)) {
        errors.push('Couldn\'t parse date or time from input despite hints.');
    }

    // Post-cleanup for dangling conjunctions/punctuation, then whitespace normalize
    cleanText = cleanDanglingConjunctions(cleanText);
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
   Highlight extraction (unchanged perf profile)
   ========================= */

export function extractHighlightFragments(text: string, referenceDate: Date = new Date()): HighlightFragment[] {
    if (!text || !text.trim()) return [];

    const fragments: HighlightFragment[] = [];

    for (const m of text.matchAll(RECURRENCE_RX_GLOBAL)) {
        fragments.push({ text: m[0], start: m.index!, end: m.index! + m[0].length, type: 'recurrence' });
    }
    for (const m of text.matchAll(START_HDR_RX)) {
        fragments.push({ text: m[0], start: m.index!, end: m.index! + m[0].length, type: 'start' });
    }
    for (const m of text.matchAll(DUE_HDR_RX)) {
        fragments.push({ text: m[0], start: m.index!, end: m.index! + m[0].length, type: 'due' });
    }

    // Only invoke chrono if hints exist or we need dates
    let chronoResults: chrono.ParsedResult[] = [];
    if (fragments.length === 0 || DATE_HINTS.test(text)) {
        try {
            chronoResults = chrono.parse(text, referenceDate);
        } catch {
            chronoResults = [];
        }
    }

    for (const r of chronoResults) {
        if (typeof r.index === 'number' && r.text) {
            fragments.push({
                text: r.text,
                start: r.index,
                end: r.index + r.text.length,
                type: 'date',
            });
        }
    }

    if (fragments.length === 0) return [];

    fragments.sort((a, b) => a.start - b.start || a.end - b.end);

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

    const normalized = resolved
        .map((f) => ({ ...f, start: Math.max(0, f.start), end: Math.max(f.start, f.end) }))
        .filter((f) => f.end > f.start);

    const grouped: HighlightFragment[] = [];
    let current: HighlightFragment | null = null;
    for (const f of normalized) {
        if (!current) {
            current = { ...f };
            continue;
        }
        const sameType = f.type === current.type;
        const contiguousOrTouching = f.start <= current.end + 1;
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
