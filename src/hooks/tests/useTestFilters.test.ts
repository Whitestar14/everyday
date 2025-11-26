import { renderHook } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useInboxTasks, useTodayTasks } from "@/hooks/useTaskFilters"

// Mock store and recurrence service
const mockStore = {
  tasks: [] as any[],
}

vi.mock("@/stores/tasks", () => ({
  useTaskStore: (selector?: any) => {
    return selector ? selector(mockStore) : mockStore
  },
}))

vi.mock("@/services/RecurrenceService", () => ({
  shouldShowToday: vi.fn(),
}))

import { shouldShowToday } from "@/services/RecurrenceService"

describe("useTaskFilter hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.tasks = []
  })

  describe("useInboxTasks", () => {
    it("returns tasks sorted by createdAt descending", () => {
      const tasks = [
        { id: "1", text: "Old", type: "task", createdAt: new Date(2020, 1, 1) },
        { id: "2", text: "New", type: "task", createdAt: new Date(2021, 1, 1) },
      ]
      mockStore.tasks = tasks

      const { result } = renderHook(() => useInboxTasks())
      expect(result.current.map(t => t.id)).toEqual(["2", "1"])
    })
  })

  describe("useTodayTasks", () => {
    it("includes tasks due today", () => {
      const today = new Date()
      const tasks = [
        { id: "1", text: "Due Today", type: "task", createdAt: new Date(), dueDate: today },
      ]
      mockStore.tasks = tasks

      const { result } = renderHook(() => useTodayTasks())
      expect(result.current.map(t => t.text)).toContain("Due Today")
    })

    it("includes tasks past due", () => {
      const past = new Date()
      past.setDate(past.getDate() - 1)
      const tasks = [
        { id: "1", text: "Past Due", type: "task", createdAt: new Date(), dueDate: past },
      ]
      mockStore.tasks = tasks

      const { result } = renderHook(() => useTodayTasks())
      expect(result.current.map(t => t.text)).toContain("Past Due")
    })

    it("includes tasks with startDate today or past", () => {
      const today = new Date()
      const tasks = [
        { id: "1", text: "Started Today", type: "task", createdAt: new Date(), startDate: today },
      ]
      mockStore.tasks = tasks

      const { result } = renderHook(() => useTodayTasks())
      expect(result.current.map(t => t.text)).toContain("Started Today")
    })

    it("includes recurring tasks when shouldShowToday returns true", () => {
      shouldShowToday.mockReturnValue(true)
      const tasks = [
        { id: "1", text: "Recurring", type: "routine", createdAt: new Date(), recurrence: { rrule: "FREQ=DAILY" } },
      ]
      mockStore.tasks = tasks

      const { result } = renderHook(() => useTodayTasks())
      expect(result.current.map(t => t.text)).toContain("Recurring")
      expect(shouldShowToday).toHaveBeenCalledWith("FREQ=DAILY")
    })

    it("sorts tasks by dueDate ascending, then createdAt descending", () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const later = new Date(today)
      later.setDate(later.getDate() + 1)

      const tasks = [
        // Included because due today
        { id: "1", text: "Today Due", type: "task", createdAt: new Date(2021, 1, 1), dueDate: today },
        // Included because startDate is today (even though due date is tomorrow)
        { id: "2", text: "Later Due", type: "task", createdAt: new Date(2020, 1, 1), startDate: today, dueDate: later },
      ]
      mockStore.tasks = tasks

      const { result } = renderHook(() => useTodayTasks())
      // Expect due today first, then later due; if due dates equal, createdAt desc
      expect(result.current.map(t => t.text)).toEqual(["Today Due", "Later Due"])
    })

    it("excludes tasks not due, not started, and not recurring", () => {
      const tasks = [
        { id: "1", text: "Irrelevant", type: "task", createdAt: new Date() },
      ]
      mockStore.tasks = tasks

      const { result } = renderHook(() => useTodayTasks())
      expect(result.current).toEqual([])
    })
  })
})
