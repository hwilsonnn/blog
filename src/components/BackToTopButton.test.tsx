import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BackToTopButton from "./BackToTopButton"

describe("BackToTopButton", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  it("renders the button by default", () => {
    render(<BackToTopButton />)
    expect(
      screen.getByRole("button", { name: /back to top/i })
    ).toBeInTheDocument()
  })

  it("does not render when enabled is false", () => {
    render(<BackToTopButton enabled={false} />)
    expect(
      screen.queryByRole("button", { name: /back to top/i })
    ).not.toBeInTheDocument()
  })

  it("scrolls to the top when clicked", async () => {
    render(<BackToTopButton />)
    await userEvent.click(screen.getByRole("button", { name: /back to top/i }))
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })
  })
})
