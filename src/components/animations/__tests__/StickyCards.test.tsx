import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import StickyCards from '../StickyCards'

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

vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

const mockUseReducedMotion = vi.mocked(useReducedMotion)
const mockContext = vi.mocked(gsap.context)
const mockFromTo = vi.mocked(gsap.fromTo)

describe('StickyCards', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders all children', () => {
    const { getByText } = render(
      <StickyCards>
        <div className="sticky-card-item">Card 1</div>
        <div className="sticky-card-item">Card 2</div>
      </StickyCards>
    )
    expect(getByText('Card 1')).toBeInTheDocument()
    expect(getByText('Card 2')).toBeInTheDocument()
  })

  it('animates every card except the first one', () => {
    render(
      <StickyCards>
        <div className="sticky-card-item">Card 1</div>
        <div className="sticky-card-item">Card 2</div>
        <div className="sticky-card-item">Card 3</div>
      </StickyCards>
    )
    expect(mockContext).toHaveBeenCalledTimes(1)
    expect(mockFromTo).toHaveBeenCalledTimes(2)
  })

  it('configures the scrollTrigger for each animated card', () => {
    render(
      <StickyCards>
        <div className="sticky-card-item">Card 1</div>
        <div className="sticky-card-item">Card 2</div>
      </StickyCards>
    )
    const [, fromVars, toVars] = mockFromTo.mock.calls[0]
    expect(fromVars).toMatchObject({ y: 40, opacity: 0 })
    expect(toVars).toMatchObject({
      y: 0,
      opacity: 1,
      scrollTrigger: {
        start: 'top 80%',
        end: 'top 50%',
        scrub: true,
      },
    })
  })

  it('does not animate anything when there is only a single card', () => {
    render(
      <StickyCards>
        <div className="sticky-card-item">Only card</div>
      </StickyCards>
    )
    expect(mockFromTo).not.toHaveBeenCalled()
  })

  it('does not animate when no elements match the sticky-card-item selector', () => {
    render(
      <StickyCards>
        <div>Not a sticky card</div>
      </StickyCards>
    )
    expect(mockContext).toHaveBeenCalledTimes(1)
    expect(mockFromTo).not.toHaveBeenCalled()
  })

  it('does not create a gsap context when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    render(
      <StickyCards>
        <div className="sticky-card-item">Card 1</div>
        <div className="sticky-card-item">Card 2</div>
      </StickyCards>
    )
    expect(mockContext).not.toHaveBeenCalled()
  })

  it('reverts the gsap context on unmount', () => {
    const { unmount } = render(
      <StickyCards>
        <div className="sticky-card-item">Card 1</div>
        <div className="sticky-card-item">Card 2</div>
      </StickyCards>
    )
    const revert = mockContext.mock.results[0].value.revert
    unmount()
    expect(revert).toHaveBeenCalledTimes(1)
  })

  it('applies the provided className to the container', () => {
    const { container } = render(
      <StickyCards className="my-class">
        <div className="sticky-card-item">Card</div>
      </StickyCards>
    )
    expect(container.firstChild).toHaveClass('my-class')
  })
})