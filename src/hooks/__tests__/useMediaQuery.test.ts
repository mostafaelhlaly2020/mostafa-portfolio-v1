import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from '../useMediaQuery'

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

describe('useMediaQuery', () => {
  let mql: MockMediaQueryList
  let matchMediaMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mql = new MockMediaQueryList('(max-width: 768px)', false)
    matchMediaMock = vi.fn(() => mql)
    vi.stubGlobal('matchMedia', matchMediaMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when the query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(false)
  })

  it('returns true when the query matches', () => {
    mql.matches = true
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('queries with the exact string passed in', () => {
    renderHook(() => useMediaQuery('(min-width: 1024px)'))
    expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)')
  })

  it('reacts to changes in match state', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    expect(result.current).toBe(false)

    act(() => {
      mql.setMatches(true)
    })

    expect(result.current).toBe(true)
  })

  it('removes the change listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    const addedListener = mql.addEventListener.mock.calls[0][1]

    unmount()

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', addedListener)
  })

  it('re-subscribes when the query string changes', () => {
    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(max-width: 768px)' },
    })

    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 768px)')

    rerender({ query: '(max-width: 1024px)' })

    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 1024px)')
  })
})