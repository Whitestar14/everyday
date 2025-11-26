// src/services/tests/TaskFactory.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest"
import { buildTaskFromText } from "@/services/TaskFactory"
import type { Task } from "@/types/app"

// We’ll mock both ParsingService and RecurrenceService to precisely control inputs/outputs.
vi.mock("@/services/ParsingService", () => ({
  parseTaskInput: vi.fn(),
}))
vi.mock("@/services/RecurrenceService", () => ({
  createRRule: vi.fn(),
}))

import { parseTaskInput } from "@/services/ParsingService"
import { createRRule } from "@/services/RecurrenceService"

describe("TaskFactory.buildTaskFromText", () => {
  const d = (s: string) => new Date(s)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("returns clean text from parsing when available; falls back to trimmed input otherwise", () => {
    // clean text provided
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "clean text",
      dueDate: undefined,
      startDate: undefined,
      recurrence: undefined,
    })
    const r1 = buildTaskFromText("   original  ")
    expect(r1.text).toBe("clean text")

    // no clean text -> trimmed input
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "",
      dueDate: undefined,
      startDate: undefined,
      recurrence: undefined,
    })
    const r2 = buildTaskFromText("   original  ")
    expect(r2.text).toBe("original")
  })

  it("prefers explicit dueDate override over parsed dueDate", () => {
    const parsedDue = d("2025-01-10T00:00:00Z")
    const overrideDue = d("2025-01-05T00:00:00Z")

    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      dueDate: parsedDue,
      startDate: undefined,
      recurrence: undefined,
    })

    const res = buildTaskFromText("x", { dueDate: overrideDue })
    expect(res.metadata.dueDate).toEqual(overrideDue)
  })

  it("uses parsed dueDate when no override is provided", () => {
    const parsedDue = d("2025-01-10T00:00:00Z")

    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      dueDate: parsedDue,
      startDate: undefined,
      recurrence: undefined,
    })

    const res = buildTaskFromText("x")
    expect(res.metadata.dueDate).toEqual(parsedDue)
  })

  it("prefers explicit startDate override over parsed startDate", () => {
    const parsedStart = d("2025-02-01T00:00:00Z")
    const overrideStart = d("2025-01-15T00:00:00Z")

    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: parsedStart,
      dueDate: undefined,
      recurrence: undefined,
    })

    const res = buildTaskFromText("x", { startDate: overrideStart })
    expect(res.metadata.startDate).toEqual(overrideStart)
  })

  it("uses parsed startDate when no override is provided", () => {
    const parsedStart = d("2025-02-01T00:00:00Z")

    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: parsedStart,
      dueDate: undefined,
      recurrence: undefined,
    })

    const res = buildTaskFromText("x")
    expect(res.metadata.startDate).toEqual(parsedStart)
  })

  it("does not build recurrence when overrides.recurrence is present", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      dueDate: undefined,
      startDate: undefined,
      recurrence: { raw: "every day", type: "daily" },
    })

    const overrideRrule = { rrule: "FREQ=DAILY", description: "Daily" }
    const res = buildTaskFromText("x", { recurrence: overrideRrule })
    expect(createRRule).not.toHaveBeenCalled()
    expect(res.metadata.recurrence).toEqual(overrideRrule)
    expect(res.type).toBe("routine")
  })

  it("builds recurrence from parsed.recurrence.raw when overrides.recurrence is not provided", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      dueDate: undefined,
      startDate: undefined,
      recurrence: { raw: "every day", type: "daily" },
    })

    ;(createRRule as any).mockReturnValue({
      rule: { rrule: "FREQ=DAILY", description: "Daily" },
      error: null,
    })

    const res = buildTaskFromText("x")
    expect(createRRule).toHaveBeenCalledWith("every day", { dtstart: undefined })
    expect(res.metadata.recurrence).toEqual({ rrule: "FREQ=DAILY", description: "Daily" })
    expect(res.type).toBe("routine")
  })

  it("anchors recurrence dtstart to startDate when present", () => {
    const start = d("2025-03-01T00:00:00Z")

    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: start,
      dueDate: undefined,
      recurrence: { raw: "every week", type: "weekly" },
    })

    ;(createRRule as any).mockReturnValue({ rule: { rrule: "FREQ=WEEKLY" }, error: null })

    buildTaskFromText("x")
    expect(createRRule).toHaveBeenCalledWith("every week", { dtstart: start })
  })

  it("anchors recurrence dtstart to dueDate when startDate is absent", () => {
    const due = d("2025-03-05T00:00:00Z")

    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: undefined,
      dueDate: due,
      recurrence: { raw: "every month", type: "monthly" },
    })

    ;(createRRule as any).mockReturnValue({ rule: { rrule: "FREQ=MONTHLY" }, error: null })

    buildTaskFromText("x")
    expect(createRRule).toHaveBeenCalledWith("every month", { dtstart: due })
  })

  it("does not set recurrence when createRRule returns no rule", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: undefined,
      dueDate: undefined,
      recurrence: { raw: "unsupported pattern", type: "none" },
    })

    ;(createRRule as any).mockReturnValue({ rule: null, error: "Unsupported" })

    const res = buildTaskFromText("x")
    expect(res.metadata.recurrence).toBeUndefined()
    expect(res.type).toBe("task")
  })

  it("type is 'routine' when metadata.recurrence is set; otherwise 'task'", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: undefined,
      dueDate: undefined,
      recurrence: { raw: "daily", type: "daily" },
    })
    ;(createRRule as any).mockReturnValue({ rule: { rrule: "FREQ=DAILY" }, error: null })

    const r1 = buildTaskFromText("x")
    expect(r1.type).toBe("routine")

    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: undefined,
      dueDate: undefined,
      recurrence: undefined,
    })
    const r2 = buildTaskFromText("x")
    expect(r2.type).toBe("task")
  })

  it("combines parsed dates with overrides object without mutating the original overrides", () => {
    const overrides: Partial<Task> = { text: "ignored", dueDate: d("2025-01-01T00:00:00Z") }

    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: d("2025-02-01T00:00:00Z"),
      dueDate: d("2025-03-01T00:00:00Z"),
      recurrence: undefined,
    })

    const before = { ...overrides }
    const res = buildTaskFromText("x", overrides)

    // dueDate preserved from overrides; startDate added from parsed
    expect(res.metadata.dueDate).toEqual(overrides.dueDate)
    expect(res.metadata.startDate).toEqual(d("2025-02-01T00:00:00Z"))

    // original overrides untouched
    expect(overrides).toEqual(before)
  })

  it("ignores parsed additionalDates (not part of TaskFactory contract)", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "Meeting",
      startDate: undefined,
      dueDate: d("2025-01-10T09:00:00Z"),
      recurrence: undefined,
      meta: {
        additionalDates: [
          { text: "Jan 12", date: d("2025-01-12T09:00:00Z") },
          { text: "Jan 15", date: d("2025-01-15T09:00:00Z") },
        ],
      },
    })

    const res = buildTaskFromText("Meeting Jan 10 and 12")
    expect(res.metadata.dueDate).toEqual(d("2025-01-10T09:00:00Z"))
    // TaskFactory does not propagate meta.additionalDates
    expect((res.metadata as any).additionalDates).toBeUndefined()
  })

  it("works when parseTaskInput returns no dates and no recurrence", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "Just text",
      startDate: undefined,
      dueDate: undefined,
      recurrence: undefined,
    })

    const res = buildTaskFromText("Just text")
    expect(res.text).toBe("Just text")
    expect(res.metadata).toEqual({})
    expect(res.type).toBe("task")
  })

  it("trims input when ParsingService cleanText is blank", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "",
      startDate: undefined,
      dueDate: undefined,
      recurrence: undefined,
    })

    const res = buildTaskFromText("   messy text   ")
    expect(res.text).toBe("messy text")
    expect(res.type).toBe("task")
  })

  it("does not attempt recurrence creation if parsed.recurrence.raw is nullish", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: undefined,
      dueDate: undefined,
      recurrence: { raw: undefined, type: "none" },
    })

    const res = buildTaskFromText("text")
    expect(createRRule).not.toHaveBeenCalled()
    expect(res.type).toBe("task")
  })

  it("passes dtstart undefined when neither startDate nor dueDate exists", () => {
    ;(parseTaskInput as any).mockReturnValue({
      cleanText: "text",
      startDate: undefined,
      dueDate: undefined,
      recurrence: { raw: "every weekday", type: "weekday" },
    })
    ;(createRRule as any).mockReturnValue({ rule: { rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR" }, error: null })

    buildTaskFromText("text")
    expect(createRRule).toHaveBeenCalledWith("every weekday", { dtstart: undefined })
  })
})
