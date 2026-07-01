import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import StickyStack from '../StickyStack'

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
const mockTo = vi.mocked(gsap.to)

describe('StickyStack', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders all children', () => {
    const { getByText } = render(
      <StickyStack>
        <div className="sticky-stack-card">Card 1</div>
        <div className="sticky-stack-card">Card 2</div>
      </StickyStack>
    )
    expect(getByText('Card 1')).toBeInTheDocument()
    expect(getByText('Card 2')).toBeInTheDocument()
  })

  it('animates every card except the last one', () => {
    render(
      <StickyStack>
        <div className="sticky-stack-card">Card 1</div>
        <div className="sticky-stack-card">Card 2</div>
        <div className="sticky-stack-card">Card 3</div>
      </StickyStack>
    )
    expect(mockContext).toHaveBeenCalledTimes(1)
    expect(mockTo).toHaveBeenCalledTimes(2)
  })

  it('scales down and fades each card, triggered by the next card entering', () => {
    render(
      <StickyStack>
        <div className="sticky-stack-card">Card 1</div>
        <div className="sticky-stack-card">Card 2</div>
      </StickyStack>
    )
    const [, toVars] = mockTo.mock.calls[0]
    expect(toVars).toMatchObject({
      scale: 0.9,
      opacity: 0.4,
      scrollTrigger: {
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    })
  })

  it('does not animate anything when there is only a single card', () => {
    render(
      <StickyStack>
        <div className="sticky-stack-card">Only card</div>
      </StickyStack>
    )
    expect(mockTo).not.toHaveBeenCalled()
  })

  it('does not animate when no elements match the sticky-stack-card selector', () => {
    render(
      <StickyStack>
        <div>Not a stack card</div>
      </StickyStack>
    )
    expect(mockContext).toHaveBeenCalledTimes(1)
    expect(mockTo).not.toHaveBeenCalled()
  })

  it('does not create a gsap context when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    render(
      <StickyStack>
        <div className="sticky-stack-card">Card 1</div>
        <div className="sticky-stack-card">Card 2</div>
      </StickyStack>
    )
    expect(mockContext).not.toHaveBeenCalled()
  })

  it('reverts the gsap context on unmount', () => {
    const { unmount } = render(
      <StickyStack>
        <div className="sticky-stack-card">Card 1</div>
        <div className="sticky-stack-card">Card 2</div>
      </StickyStack>
    )
    const revert = mockContext.mock.results[0].value.revert
    unmount()
    expect(revert).toHaveBeenCalledTimes(1)
  })

  it('applies the provided className to the container', () => {
    const { container } = render(
      <StickyStack className="my-class">
        <div className="sticky-stack-card">Card</div>
      </StickyStack>
    )
    expect(container.firstChild).toHaveClass('my-class')
  })
})