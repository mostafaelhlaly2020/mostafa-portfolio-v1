import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import { mockTickerAdd, mockTickerRemove } from '@/test/mocks/gsap'
import { setReducedMotion } from '@/test/mocks/useReducedMotion'

// Use centralized mocks
vi.mock('gsap', () => {
  const ticker = { add: vi.fn(), remove: vi.fn() }
  return {
    default: {
      ticker,
      context: vi.fn(),
      to: vi.fn(),
      fromTo: vi.fn(),
      registerPlugin: vi.fn(),
    },
  }
})

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}))

vi.mock('@/hooks/useInView', () => ({
  useInView: vi.fn(() => ({
    ref: { current: null },
    inView: false,
  })),
}))

import TextScramble from '../TextScramble'

function runFrames(fn: () => void, times: number) {
  act(() => {
    for (let i = 0; i < times; i++) {
      fn()
    }
  })
}

describe('TextScramble', () => {
  beforeEach(() => {
    setReducedMotion(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the text immediately without scrambling when prefers-reduced-motion is set', () => {
    setReducedMotion(true)
    const onComplete = vi.fn()
    const { container } = render(<TextScramble text="Hi" onComplete={onComplete} />)

    expect(container.textContent).toBe('Hi')
    expect(mockTickerAdd).not.toHaveBeenCalled()
  })

  it('starts empty and registers a ticker callback on mount by default', () => {
    const { container } = render(<TextScramble text="Hi" />)
    expect(container.textContent).toBe('')
    expect(mockTickerAdd).toHaveBeenCalledTimes(1)
  })

  it('resolves to the final text and calls onComplete after enough ticker frames', () => {
    const onComplete = vi.fn()
    const { container } = render(<TextScramble text="Hi" onComplete={onComplete} />)
    const tickerFn = mockTickerAdd.mock.calls[0][0] as unknown as () => void

    runFrames(tickerFn, 'Hi'.length * 2)

    expect(container.textContent).toBe('Hi')
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(mockTickerRemove).toHaveBeenCalledWith(tickerFn)
  })

  it('preserves spaces while scrambling intermediate frames', () => {
    const { container } = render(<TextScramble text="A B" />)
    const tickerFn = mockTickerAdd.mock.calls[0][0] as unknown as () => void

    runFrames(tickerFn, 1)

    expect(container.textContent?.[1]).toBe(' ')
  })

  it('does not scramble automatically when trigger is "hover"', () => {
    render(<TextScramble text="Hi" trigger="hover" />)
    expect(mockTickerAdd).not.toHaveBeenCalled()
  })

  it('starts scrambling on mouse enter when trigger is "hover"', () => {
    const { container } = render(<TextScramble text="Hi" trigger="hover" />)
    const span = container.querySelector('span') as HTMLElement

    fireEvent.mouseEnter(span)

    expect(mockTickerAdd).toHaveBeenCalledTimes(1)
  })

  it('completes the hover-triggered scramble once enough frames run', () => {
    const onComplete = vi.fn()
    const { container } = render(<TextScramble text="Hi" trigger="hover" onComplete={onComplete} />)
    const span = container.querySelector('span') as HTMLElement

    fireEvent.mouseEnter(span)
    const tickerFn = mockTickerAdd.mock.calls[0][0] as unknown as () => void
    runFrames(tickerFn, 'Hi'.length * 2)

    expect(container.textContent).toBe('Hi')
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('waits for inView trigger — does not scramble on mount', () => {
    render(<TextScramble text="Hi" trigger="inView" />)
    // useInView returns inView=false by default, so no scramble yet
    expect(mockTickerAdd).not.toHaveBeenCalled()
  })

  it('cleans up GSAP ticker on unmount', () => {
    const { unmount } = render(<TextScramble text="Hi" />)
    const tickerFn = mockTickerAdd.mock.calls[0][0] as unknown as () => void

    unmount()

    expect(mockTickerRemove).toHaveBeenCalledWith(tickerFn)
  })

  it('re-runs animation when text prop changes', () => {
    const { rerender } = render(<TextScramble text="Hi" />)
    expect(mockTickerAdd).toHaveBeenCalledTimes(1)

    rerender(<TextScramble text="Bye" />)

    // Should re-register ticker for new text
    expect(mockTickerAdd).toHaveBeenCalledTimes(2)
  })

  it('applies the provided className', () => {
    const { container } = render(<TextScramble text="Hi" className="my-class" />)
    expect(container.querySelector('span')).toHaveClass('my-class')
  })
})
