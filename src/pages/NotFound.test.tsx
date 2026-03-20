import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from './NotFound'

describe('NotFound', () => {
  it('displays the 404 heading', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })

  it('has a link to the home page', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /go home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
