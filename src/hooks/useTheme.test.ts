import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTheme } from "./useTheme"

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove("dark")
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("defaults to light theme when no preference is stored", () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("light")
  })

  it("reads the saved theme from localStorage", () => {
    localStorage.setItem("theme", "dark")
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("dark")
  })

  it("toggles from light to dark", () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe("dark")
  })

  it("toggles from dark back to light", () => {
    localStorage.setItem("theme", "dark")
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe("light")
  })

  it("adds the dark class to the document root in dark mode", () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme("dark"))
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("removes the dark class from the document root in light mode", () => {
    document.documentElement.classList.add("dark")
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme("light"))
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })

  it("persists the theme to localStorage on change", () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme("dark"))
    expect(localStorage.getItem("theme")).toBe("dark")
  })
})
