import { RRule } from 'rrule'
import type { Task, RecurrenceRule } from '../types/app'

type Options = {
  freq: number
  interval?: number
  byweekday?: number | number[] | any
  bysetpos?: number
}
export function createRRule(pattern: string): { rule: RecurrenceRule | null; error: string | null } {
  const lower = pattern.toLowerCase().trim()
  const options: Options = { freq: 0 }
  let description = ''

  if (lower === 'daily' || lower === 'every day') {
    options.freq = RRule.DAILY
    description = 'Daily'
  } else if (lower === 'weekly' || lower === 'every week') {
    options.freq = RRule.WEEKLY
    description = 'Weekly'
  } else if (lower === 'monthly' || lower === 'every month') {
    options.freq = RRule.MONTHLY
    description = 'Monthly'
  } else if (lower === 'yearly' || lower === 'every year') {
    options.freq = RRule.YEARLY
    description = 'Yearly'
  } else if (lower === 'every weekday') {
    options.freq = RRule.WEEKLY
    options.byweekday = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]
    description = 'Every weekday'
  } else if (lower.match(/^every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/)) {
    const day = lower.split(' ')[1]
    const days: { [key: string]: any } = {
      monday: RRule.MO,
      tuesday: RRule.TU,
      wednesday: RRule.WE,
      thursday: RRule.TH,
      friday: RRule.FR,
      saturday: RRule.SA,
      sunday: RRule.SU
    }
    options.freq = RRule.WEEKLY
    options.byweekday = days[day]
    description = `Every ${day}`
  } else if (lower.match(/^every other (monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/)) {
    const day = lower.split(' ')[2]
    const days: { [key: string]: any } = {
      monday: RRule.MO,
      tuesday: RRule.TU,
      wednesday: RRule.WE,
      thursday: RRule.TH,
      friday: RRule.FR,
      saturday: RRule.SA,
      sunday: RRule.SU
    }
    options.freq = RRule.WEEKLY
    options.interval = 2
    options.byweekday = days[day]
    description = `Every other ${day}`
  } else if (lower === 'every other week') {
    options.freq = RRule.WEEKLY
    options.interval = 2
    description = 'Every other week'
  } else if (lower.match(/^first (monday|tuesday|wednesday|thursday|friday|saturday|sunday) of month$/)) {
    const day = lower.split(' ')[1]
    const days: { [key: string]: any } = {
      monday: RRule.MO,
      tuesday: RRule.TU,
      wednesday: RRule.WE,
      thursday: RRule.TH,
      friday: RRule.FR,
      saturday: RRule.SA,
      sunday: RRule.SU
    }
    options.freq = RRule.MONTHLY
    options.byweekday = days[day]
    options.bysetpos = 1
    description = `First ${day} of month`
  } else {
    return { rule: null, error: 'Unsupported recurrence pattern' }
  }

  try {
    const rruleObj = new RRule(options)
    return { rule: { rrule: rruleObj.toString(), description }, error: null }
  } catch {
    return { rule: null, error: 'Invalid recurrence pattern' }
  }
}

export function getNextOccurrence(rule: RRule, after?: Date): Date {
  return rule.after(after || new Date()) || new Date()
}

export function getHumanReadable(rule: RRule): string {
  return rule.toText()
}

export function shouldShowToday(task: Task): boolean {
  if (!task.recurrence) return false
  const rule = RRule.fromString(task.recurrence.rrule)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const next = rule.after(yesterday)
  return next?.toDateString() === today.toDateString()
}
