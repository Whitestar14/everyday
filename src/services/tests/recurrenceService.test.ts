import { describe, it, expect } from "vitest"
import {
  createRRule,
  getNextOccurrence,
  getHumanReadable,
  shouldShowToday,
} from "@/services/RecurrenceService"
import { RRule } from "rrule"

describe("RecurrenceService.createRRule", () => {
  it("creates a daily rule", () => {
    const { rule, error } = createRRule("every day")
    expect(error).toBeNull()
    expect(rule?.description).toBe("Daily")
    expect(rule?.rrule).toContain("FREQ=DAILY")
  })

  it("creates an every other day rule", () => {
    const { rule } = createRRule("every other day")
    expect(rule?.description).toBe("Every 2 days")
    expect(rule?.rrule).toContain("INTERVAL=2")
  })

  it("creates a weekly rule", () => {
    const { rule } = createRRule("weekly")
    expect(rule?.description).toBe("Weekly")
    expect(rule?.rrule).toContain("FREQ=WEEKLY")
  })

  it("creates a monthly rule", () => {
    const { rule } = createRRule("every month")
    expect(rule?.description).toBe("Monthly")
    expect(rule?.rrule).toContain("FREQ=MONTHLY")
  })

it("creates a yearly rule", () => {
  const start = new Date("2025-01-01")
  const { rule, error } = createRRule("yearly", { dtstart: start })
  expect(error).toBeNull()
  expect(rule).not.toBeNull()
  expect(rule!.description).toBe("Yearly")
  expect(rule!.rrule).toContain("FREQ=YEARLY")
})

  it("creates a weekday rule", () => {
    const { rule } = createRRule("every weekday")
    expect(rule?.description).toContain("Every weekday")
    expect(rule?.rrule).toContain("BYDAY=MO,TU,WE,TH,FR")
  })

  it("creates a weekend rule", () => {
    const { rule } = createRRule("every weekend")
    expect(rule?.description).toContain("Every weekend")
    expect(rule?.rrule).toContain("BYDAY=SA,SU")
  })

  it("creates a rule for specific weekdays list", () => {
    const { rule } = createRRule("every mon, wed, fri")
    expect(rule?.description).toContain("Monday, Wednesday, Friday")
    expect(rule?.rrule).toContain("BYDAY=MO,WE,FR")
  })

  it("creates a rule for single weekday", () => {
    const { rule } = createRRule("every Tuesday")
    expect(rule?.description).toContain("Tuesday")
    expect(rule?.rrule).toContain("BYDAY=TU")
  })

  it("creates a rule for every other week on Monday", () => {
    const { rule } = createRRule("every other week on Monday")
    expect(rule?.description).toContain("Every other week on Monday")
    expect(rule?.rrule).toContain("INTERVAL=2")
    expect(rule?.rrule).toContain("BYDAY=MO")
  })

  it("creates a rule for the first Monday of the month", () => {
    const { rule } = createRRule("first Monday of month")
    expect(rule?.description).toBe("First Monday of month")
    expect(rule?.rrule).toContain("BYDAY=MO")
    expect(rule?.rrule).toContain("BYSETPOS=1")
  })

  it("creates a rule for the last Friday of the month", () => {
    const { rule } = createRRule("last Friday of month")
    expect(rule?.description).toBe("Last Friday of month")
    expect(rule?.rrule).toContain("BYDAY=FR")
    expect(rule?.rrule).toContain("BYSETPOS=-1")
  })

  it("creates a rule for every month on the 15th", () => {
    const { rule } = createRRule("every month on the 15th")
    expect(rule?.description).toBe("Every month on the 15")
    expect(rule?.rrule).toContain("BYMONTHDAY=15")
  })

  it("returns error for unsupported pattern", () => {
    const { rule, error } = createRRule("every blue moon")
    expect(rule).toBeNull()
    expect(error).toBe("Unsupported recurrence pattern")
  })

  it("applies extra options like dtstart, until, count", () => {
    const start = new Date("2025-01-01")
    const until = new Date("2025-12-31")
    const { rule } = createRRule("daily", { dtstart: start, until, count: 5 })
    expect(rule?.rrule).toContain("COUNT=5")
    expect(rule?.rrule).toContain("UNTIL=20251231")
  })
})

describe("RecurrenceService utilities", () => {
  it("getNextOccurrence returns next occurrence after a given date", () => {
    const { rule } = createRRule("daily")
    const r = RRule.fromString(rule!.rrule)
    const after = new Date("2025-01-01T00:00:00Z")
    const next = getNextOccurrence(r, after)
    expect(next).toBeInstanceOf(Date)
    expect(next!.getTime()).toBeGreaterThan(after.getTime())
  })

it("getNextOccurrence returns same date if inclusive", () => {
  const start = new Date("2025-01-01T00:00:00Z")
  const { rule } = createRRule("daily", { dtstart: start })
  const r = RRule.fromString(rule!.rrule)
  const next = getNextOccurrence(r, start, true)
  expect(next?.toDateString()).toBe(start.toDateString())
})

  it("getHumanReadable returns human readable text", () => {
  const { rule } = createRRule("weekly")
  const r = RRule.fromString(rule!.rrule)
  const text = getHumanReadable(r)
  expect(text.toLowerCase()).toBe("every week")
})

  it("shouldShowToday returns true if today matches recurrence", () => {
    const today = new Date()
    const { rule } = createRRule("daily")
    const res = shouldShowToday(rule!.rrule, today)
    expect(res).toBe(true)
  })

  it("shouldShowToday returns false if today does not match recurrence", () => {
    const { rule } = createRRule("monthly on the 15th")
    const today = new Date()
    today.setDate(1) // not the 15th
    const res = shouldShowToday(rule!.rrule, today)
    expect(res).toBe(false)
  })
})