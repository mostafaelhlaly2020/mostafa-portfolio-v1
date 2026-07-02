import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Typewriter from '../Typewriter'

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
      to: vi.fn(),
      fromTo: vi.fn(),
      ticker: { add: vi.fn(), remove: vi.fn() },
      registerPlugin: vi.fn(),
    },
  }
})

const mockUseReducedMotion = vi.mocked(useReducedMotion)
const mockContext = vi.mocked(gsap.context)
const mockTo = vi.mocked(gsap.to)

interface TweenProxy {
  count: number
}

interface TweenConfig {
  onUpdate?: () => void
  onComplete?: () => void
  duration: number
  delay: number
}

describe('Typewriter', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the full text immediately when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<Typewriter text="Hello" />)
    expect(container.textContent).toBe('Hello')
    expect(container.querySelector('.animate-pulse')).toBeNull()
    expect(mockContext).not.toHaveBeenCalled()
  })

  it('renders no visible characters and a blinking cursor initially when motion is not reduced', () => {
    const { container } = render(<Typewriter text="Hello" />)
    expect(container.textContent).toBe('|')
    expect(container.querySelector('.animate-pulse')).not.toBeNull()
  })

  it('starts a gsap tween with a duration based on speed and text length', () => {
    render(<Typewriter text="Hello" speed={0.1} delay={0.2} />)
    expect(mockContext).toHaveBeenCalledTimes(1)
    expect(mockTo).toHaveBeenCalledTimes(1)
    const [proxy, config] = mockTo.mock.calls[0] as unknown as [TweenProxy, TweenConfig]
    expect(proxy).toEqual({ count: 0 })
    expect(config.duration).toBeCloseTo(0.5)
    expect(config.delay).toBe(0.2)
  })

  it('uses the default speed of 0.05s per character and no delay', () => {
    render(<Typewriter text="Hi" />)
    const [, config] = mockTo.mock.calls[0] as unknown as [TweenProxy, TweenConfig]
    expect(config.duration).toBeCloseTo(0.1)
    expect(config.delay).toBe(0)
  })

  it('reveals characters progressively as onUpdate fires', () => {
    const { container } = render(<Typewriter text="Hello" />)
    const [proxy, config] = mockTo.mock.calls[0] as unknown as [TweenProxy, TweenConfig]

    act(() => {
      proxy.count = 3
      config.onUpdate?.()
    })

    expect(container.textContent).toBe('Hel|')
  })

  it('shows the full text and removes the cursor when onComplete fires', () => {
    const onComplete = vi.fn()
    const { container } = render(<Typewriter text="Hello" onComplete={onComplete} />)
    const [, config] = mockTo.mock.calls[0] as unknown as [TweenProxy, TweenConfig]

    act(() => {
      config.onComplete?.()
    })

    expect(container.textContent).toBe('Hello')
    expect(container.querySelector('.animate-pulse')).toBeNull()
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('reverts the gsap context on unmount', () => {
    const { unmount } = render(<Typewriter text="Hello" />)
    const revert = mockContext.mock.results[0].value.revert
    unmount()
    expect(revert).toHaveBeenCalledTimes(1)
  })

  it('applies the provided className', () => {
    const { container } = render(<Typewriter text="Hello" className="my-class" />)
    expect(container.firstChild).toHaveClass('my-class')
  })
})