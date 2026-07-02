import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import KineticMarquee from '../KineticMarquee'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}))

vi.mock('gsap', () => {
  const context = vi.fn((fn: () => void) => {
    fn()
    return { revert: vi.fn() }
  })
  return {
    default: {
      context,
      fromTo: vi.fn(),
      to: vi.fn(),
      ticker: { add: vi.fn(), remove: vi.fn() },
      registerPlugin: vi.fn(),
    },
  }
})

const mockUseReducedMotion = vi.mocked(useReducedMotion)
const mockContext = vi.mocked(gsap.context)
const mockFromTo = vi.mocked(gsap.fromTo)

describe('KineticMarquee', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders all children', () => {
    const { getByText } = render(
      <KineticMarquee>
        <span>Item 1</span>
        <span>Item 2</span>
      </KineticMarquee>
    )
    expect(getByText('Item 1')).toBeInTheDocument()
    expect(getByText('Item 2')).toBeInTheDocument()
  })

  it('marks the outer container as aria-hidden when motion is not reduced', () => {
    const { container } = render(
      <KineticMarquee>
        <span>Item</span>
      </KineticMarquee>
    )
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('duplicates the track children to create a seamless loop', () => {
    const { container } = render(
      <KineticMarquee>
        <span>A</span>
        <span>B</span>
        <span>C</span>
      </KineticMarquee>
    )
    const track = container.querySelector('.flex') as HTMLElement
    expect(track.children).toHaveLength(6)
  })

  it('initializes a GSAP context and animates the track with gsap.fromTo', () => {
    render(
      <KineticMarquee speed={100}>
        <span>A</span>
      </KineticMarquee>
    )
    expect(mockContext).toHaveBeenCalledTimes(1)
    expect(mockFromTo).toHaveBeenCalledTimes(1)
  })

  it('animates towards -50% xPercent for the default rtl direction', () => {
    render(
      <KineticMarquee>
        <span>A</span>
      </KineticMarquee>
    )
    const [, fromVars, toVars] = mockFromTo.mock.calls[0]
    expect(fromVars).toMatchObject({ xPercent: 0 })
    expect(toVars).toMatchObject({ xPercent: -50, repeat: -1, ease: 'none' })
  })

  it('animates from -50% to 0% xPercent when direction is ltr', () => {
    render(
      <KineticMarquee direction="ltr">
        <span>A</span>
      </KineticMarquee>
    )
    const [, fromVars, toVars] = mockFromTo.mock.calls[0]
    expect(fromVars).toMatchObject({ xPercent: -50 })
    expect(toVars).toMatchObject({ xPercent: 0 })
  })

  it('does not duplicate children or start a gsap animation when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(
      <KineticMarquee>
        <span>A</span>
        <span>B</span>
      </KineticMarquee>
    )
    const track = container.querySelector('.flex') as HTMLElement
    expect(track.children).toHaveLength(2)
    expect(mockContext).not.toHaveBeenCalled()
  })

  it('does not mark the container as aria-hidden when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(
      <KineticMarquee>
        <span>A</span>
      </KineticMarquee>
    )
    expect(container.firstChild).not.toHaveAttribute('aria-hidden')
  })

  it('reverts the gsap context on unmount', () => {
    const { unmount } = render(
      <KineticMarquee>
        <span>A</span>
      </KineticMarquee>
    )
    const revert = mockContext.mock.results[0].value.revert
    unmount()
    expect(revert).toHaveBeenCalledTimes(1)
  })

  it('applies the provided className', () => {
    const { container } = render(
      <KineticMarquee className="my-class">
        <span>A</span>
      </KineticMarquee>
    )
    expect(container.firstChild).toHaveClass('my-class', 'overflow-hidden')
  })
})