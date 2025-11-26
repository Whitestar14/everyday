import { describe, it, expect, afterEach, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useMidnightRefresh } from "@/hooks/useMidnightRefresh"

// Mock MidnightService
vi.mock("@/services/MidnightService", () => ({
  setupMidnightRunner: vi.fn(),
  onMidnightTick: vi.fn((cb: () => void) => {
    // store callback so we can trigger it in tests
    ;(globalThis as any).__midnightCb = cb
  }),
}))

describe("useMidnightRefresh", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("sets isNewDay true on first mount when no lastVisit", () => {
    const { result } = renderHook(() => useMidnightRefresh())
    expect(result.current.isNewDay).toBe(true)
    expect(localStorage.getItem("lastVisit")).toBeTruthy()
  })

  it("sets isNewDay false if lastVisit is today", () => {
    const today = new Date().toISOString()
    localStorage.setItem("lastVisit", today)
    const { result } = renderHook(() => useMidnightRefresh())
    expect(result.current.isNewDay).toBe(false)
  })

  it("sets isNewDay true if lastVisit is a previous day", () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    localStorage.setItem("lastVisit", yesterday.toISOString())
    const { result } = renderHook(() => useMidnightRefresh())
    expect(result.current.isNewDay).toBe(true)
  })

  it("updates isNewDay when midnight tick callback is invoked", () => {
    // Pretend lastVisit was today so initial check is false
    localStorage.setItem("lastVisit", new Date().toISOString())
    const { result } = renderHook(() => useMidnightRefresh())
    expect(result.current.isNewDay).toBe(false)

    // Simulate a new day by setting lastVisit to yesterday
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    localStorage.setItem("lastVisit", yesterday.toISOString())

    // Trigger the midnight callback
    const cb = (globalThis as any).__midnightCb
    act(() => {
      cb()
    })

    expect(result.current.isNewDay).toBe(true)
  })
}) 
