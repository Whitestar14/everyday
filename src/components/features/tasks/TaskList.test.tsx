import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { TaskList } from './TaskList'

// Mock TaskItem so we don’t need its full implementation
vi.mock("@/components/features/tasks/TaskItem", () => ({
  TaskItem: ({ task, onComplete, onDelete, onSelect }: any) => (
    <div data-testid="task-item">
      <span>{task.text}</span>
      <button onClick={() => onComplete?.(task.id)}>complete</button>
      <button onClick={() => onDelete?.(task.id)}>delete</button>
      <input
        type="checkbox"
        onChange={(e) => onSelect?.(e.target.checked)}
        aria-label={`select-${task.id}`}
      />
    </div>
  ),
}))

describe("TaskList", () => {
  const tasks = [
    { id: "1", text: "Task One", type: "task", createdAt: new Date() },
    { id: "2", text: "Task Two", type: "task", createdAt: new Date() },
    { id: "3", text: "Task Three", type: "task", createdAt: new Date() },
  ]

  it("renders title and tasks", () => {
    render(<TaskList tasks={tasks} />)
    expect(screen.getByText("recent tasks")).toBeInTheDocument()
    expect(screen.getAllByTestId("task-item")).toHaveLength(3)
  })

  it("limits tasks when maxTasks is provided", () => {
    render(<TaskList tasks={tasks} maxTasks={2} />)
    expect(screen.getAllByTestId("task-item")).toHaveLength(2)
  })

  it("shows view all button when hasMore and showViewAll are true", () => {
    const onViewAll = vi.fn()
    render(<TaskList tasks={tasks} maxTasks={2} onViewAll={onViewAll} />)
    const button = screen.getByRole("button", { name: /view all/i })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(onViewAll).toHaveBeenCalled()
  })

  it("calls onCompleteTask when complete button clicked", () => {
    const onComplete = vi.fn()
    render(<TaskList tasks={tasks} onCompleteTask={onComplete} />)
    fireEvent.click(screen.getAllByText("complete")[0])
    expect(onComplete).toHaveBeenCalledWith("1")
  })

  it("calls onDeleteTask when delete button clicked", () => {
    const onDelete = vi.fn()
    render(<TaskList tasks={tasks} onDeleteTask={onDelete} />)
    fireEvent.click(screen.getAllByText("delete")[1])
    expect(onDelete).toHaveBeenCalledWith("2")
  })

  it("calls onSelectTask when checkbox toggled", () => {
    const onSelect = vi.fn()
    render(<TaskList tasks={tasks} onSelectTask={onSelect} />)
    const checkbox = screen.getByLabelText("select-1")
    fireEvent.click(checkbox)
    expect(onSelect).toHaveBeenCalledWith("1", true)
  })
})
