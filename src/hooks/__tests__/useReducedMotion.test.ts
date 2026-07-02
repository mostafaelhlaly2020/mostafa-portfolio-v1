import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReducedMotion } from '../useReducedMotion'

type Listener = () => void

class MockMediaQueryList {
  matches: boolean
  media: string
  private listeners: Listener[] = []

  constructor(media: string, matches: boolean) {
    this.media = media
    this.matches = matches
  }

  addEventListener = vi.fn((_event: string, callback: Listener) => {
    this.listeners.push(callback)
  })

  removeEventListener = vi.fn((_event: string, callback: Listener) => {
    this.listeners = this.listeners.filter((listener) => listener !== callback)
  })

  setMatches(matches: boolean) {
    this.matches = matches
    this.listeners.forEach((listener) => listener())
  }
}

describe('useReducedMotion', () => {
  let mql: MockMediaQueryList
  let matchMediaMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mql = new MockMediaQueryList('(prefers-reduced-motion: reduce)', false)
    matchMediaMock = vi.fn(() => mql)
    vi.stubGlobal('matchMedia', matchMediaMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when prefers-reduced-motion does not match', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when prefers-reduced-motion matches', () => {
    mql.matches = true
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('queries the correct media query string', () => {
    renderHook(() => useReducedMotion())
    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('subscribes to change events on mount', () => {
    renderHook(() => useReducedMotion())
    expect(mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('updates the returned value when the media query changes', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    act(() => {
      mql.setMatches(true)
    })

    expect(result.current).toBe(true)
  })

  it('unsubscribes the change listener on unmount', () => {
    const { unmount } = renderHook(() => useReducedMotion())
    const addedListener = mql.addEventListener.mock.calls[0][1]

    unmount()

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', addedListener)
  })
})