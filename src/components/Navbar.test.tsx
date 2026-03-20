import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar(theme = 'light', toggleTheme = vi.fn()) {
  return render(
    <MemoryRouter>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('renders the site logo', () => {
    renderNavbar()
    expect(screen.getByText(/hwilson/i)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('calls toggleTheme when the theme button is clicked', async () => {
    const toggleTheme = vi.fn()
    renderNavbar('light', toggleTheme)
    await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(toggleTheme).toHaveBeenCalledOnce()
  })

  it('shows the sun icon in dark mode and moon icon in light mode', () => {
    const { rerender } = renderNavbar('dark')
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <Navbar theme="light" toggleTheme={vi.fn()} />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })
})
