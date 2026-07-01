import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import TextScramble from '../TextScramble'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}))

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

const mockUseReducedMotion = vi.mocked(useReducedMotion)
const mockTickerAdd = vi.mocked(gsap.ticker.add)
const mockTickerRemove = vi.mocked(gsap.ticker.remove)

function runFrames(fn: () => void, times: number) {
  act(() => {
    for (let i = 0; i < times; i++) {
      fn()
    }
  })
}

describe('TextScramble', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the text immediately without scrambling when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const onComplete = vi.fn()
    const { container } = render(<TextScramble text="Hi" onComplete={onComplete} />)

    expect(container.textContent).toBe('Hi')
    expect(mockTickerAdd).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
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

  it('does not start scrambling for an unhandled trigger value like "inView"', () => {
    const { container } = render(<TextScramble text="Hi" trigger="inView" />)
    expect(container.textContent).toBe('')
    expect(mockTickerAdd).not.toHaveBeenCalled()
  })

  it('applies the provided className', () => {
    const { container } = render(<TextScramble text="Hi" className="my-class" />)
    expect(container.querySelector('span')).toHaveClass('my-class')
  })
})