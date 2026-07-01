import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import SpotlightBorder from '../SpotlightBorder'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}))

const mockUseReducedMotion = vi.mocked(useReducedMotion)

describe('SpotlightBorder', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it('renders its children', () => {
    render(
      <SpotlightBorder>
        <span>card content</span>
      </SpotlightBorder>
    )
    expect(screen.getByText('card content')).toBeInTheDocument()
  })

  it('renders a plain wrapper without overlays when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(
      <SpotlightBorder className="custom">
        <span>content</span>
      </SpotlightBorder>
    )
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass('custom')
    expect(el.querySelectorAll('div')).toHaveLength(0)
  })

  it('renders spotlight overlay elements when motion is not reduced', () => {
    const { container } = render(
      <SpotlightBorder>
        <span>content</span>
      </SpotlightBorder>
    )
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass('relative', 'overflow-hidden', 'rounded-2xl')
    const overlays = el.querySelectorAll('div')
    expect(overlays).toHaveLength(2)
  })

  it('hides overlays with opacity 0 before hovering', () => {
    const { container } = render(
      <SpotlightBorder>
        <span>content</span>
      </SpotlightBorder>
    )
    const overlays = container.querySelectorAll('div > div')
    overlays.forEach((overlay) => {
      expect((overlay as HTMLElement).style.opacity).toBe('0')
    })
  })

  it('reveals overlays with opacity 1 on mouse enter', () => {
    const { container } = render(
      <SpotlightBorder>
        <span>content</span>
      </SpotlightBorder>
    )
    const wrapper = container.firstChild as HTMLElement
    fireEvent.mouseEnter(wrapper)

    const overlays = container.querySelectorAll('div > div')
    overlays.forEach((overlay) => {
      expect((overlay as HTMLElement).style.opacity).toBe('1')
    })
  })

  it('hides overlays again on mouse leave', () => {
    const { container } = render(
      <SpotlightBorder>
        <span>content</span>
      </SpotlightBorder>
    )
    const wrapper = container.firstChild as HTMLElement
    fireEvent.mouseEnter(wrapper)
    fireEvent.mouseLeave(wrapper)

    const overlays = container.querySelectorAll('div > div')
    overlays.forEach((overlay) => {
      expect((overlay as HTMLElement).style.opacity).toBe('0')
    })
  })

  it('tracks mouse position relative to the card and updates the gradient position', () => {
    const { container } = render(
      <SpotlightBorder>
        <span>content</span>
      </SpotlightBorder>
    )
    const wrapper = container.firstChild as HTMLElement
    wrapper.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 10,
          top: 20,
          right: 210,
          bottom: 120,
          width: 200,
          height: 100,
          x: 10,
          y: 20,
          toJSON: () => ({}),
        }) as DOMRect
    )

    fireEvent.mouseMove(wrapper, { clientX: 60, clientY: 45 })

    const spotlightOverlay = container.querySelector('div > div') as HTMLElement
    expect(spotlightOverlay.style.background).toContain('50px 25px')
  })

  it('does not update position when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(
      <SpotlightBorder>
        <span>content</span>
      </SpotlightBorder>
    )
    const el = container.firstChild as HTMLElement
    // No mouse handlers attached, firing mousemove should be a no-op and not throw
    expect(() => fireEvent.mouseMove(el, { clientX: 60, clientY: 45 })).not.toThrow()
  })
})