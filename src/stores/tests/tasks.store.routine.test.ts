import { describe, it, expect, beforeEach } from "vitest"
import { useTaskStore } from "@/stores/tasks"
import { RRule } from "rrule"

beforeEach(() => {
  const store = useTaskStore.getState()
  store.setTasks([]) // clear tasks
})

describe("TaskStore routine completion", () => {
  it("completing a recurring routine moves it to tomorrow without duplication", async () => {
    const store = useTaskStore.getState()

    const rule = new RRule({
      freq: RRule.DAILY,
      dtstart: new Date(),
    })

    const task = {
      id: "routine-1",
      text: "Daily Routine",
      type: "routine",
      createdAt: new Date(),
      recurrence: { rrule: rule.toString(), description: "Daily" },
      startDate: new Date(),
      completedDates: [],
    }

    store.setTasks([task])

    // Complete the routine
    store.completeTask("routine-1")

    // Wait a tick for setTimeout in completeTask to resolve
    await new Promise(res => setTimeout(res, 3100))

    const updated = useTaskStore.getState().tasks.find(t => t.id === "routine-1")

    expect(updated).toBeDefined()
    expect(updated?.dueDate).toBeInstanceOf(Date)
    expect(updated?.dueDate!.getDate()).toBe(new Date().getDate() + 1) // tomorrow
    expect(updated?.completedDates).toContain(new Date().toISOString().split("T")[0])

    const allTasks = useTaskStore.getState().tasks
    expect(allTasks.filter(t => t.id === "routine-1")).toHaveLength(1)
  })
})
