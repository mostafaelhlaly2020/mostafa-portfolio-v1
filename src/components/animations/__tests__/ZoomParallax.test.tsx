import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import ZoomParallax from '../ZoomParallax'

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

describe('ZoomParallax', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders its children', () => {
    const { getByText } = render(
      <ZoomParallax>
        <img alt="parallax" src="https://example.com/photo.jpg" />
        <span>caption</span>
      </ZoomParallax>
    )
    expect(getByText('caption')).toBeInTheDocument()
  })

  it('animates scale from (1 - intensity) to (1 + intensity) using the default intensity', () => {
    render(
      <ZoomParallax>
        <div>content</div>
      </ZoomParallax>
    )
    expect(mockContext).toHaveBeenCalledTimes(1)
    const [, fromVars, toVars] = mockFromTo.mock.calls[0]
    expect(fromVars).toMatchObject({ scale: 0.7 })
    expect(toVars).toMatchObject({ scale: 1.3, ease: 'none' })
  })

  it('respects a custom intensity value', () => {
    render(
      <ZoomParallax intensity={0.5}>
        <div>content</div>
      </ZoomParallax>
    )
    const [, fromVars, toVars] = mockFromTo.mock.calls[0]
    expect(fromVars).toMatchObject({ scale: 0.5 })
    expect(toVars).toMatchObject({ scale: 1.5 })
  })

  it('configures the scrollTrigger with scrub enabled across the full element height', () => {
    render(
      <ZoomParallax>
        <div>content</div>
      </ZoomParallax>
    )
    const [, , toVars] = mockFromTo.mock.calls[0]
    expect(toVars).toMatchObject({
      scrollTrigger: {
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  })

  it('does not create a gsap context when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    render(
      <ZoomParallax>
        <div>content</div>
      </ZoomParallax>
    )
    expect(mockContext).not.toHaveBeenCalled()
    expect(mockFromTo).not.toHaveBeenCalled()
  })

  it('reverts the gsap context on unmount', () => {
    const { unmount } = render(
      <ZoomParallax>
        <div>content</div>
      </ZoomParallax>
    )
    const revert = mockContext.mock.results[0].value.revert
    unmount()
    expect(revert).toHaveBeenCalledTimes(1)
  })

  it('applies the provided className to the container', () => {
    const { container } = render(
      <ZoomParallax className="my-class">
        <div>content</div>
      </ZoomParallax>
    )
    expect(container.firstChild).toHaveClass('my-class')
  })
})