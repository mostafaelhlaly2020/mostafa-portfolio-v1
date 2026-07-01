import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollProgress } from '../useScrollProgress'

function setViewport({
  scrollY,
  scrollHeight,
  innerHeight,
}: {
  scrollY: number
  scrollHeight: number
  innerHeight: number
}) {
  Object.defineProperty(window, 'scrollY', { value: scrollY, writable: true, configurable: true })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  })
  Object.defineProperty(window, 'innerHeight', {
    value: innerHeight,
    writable: true,
    configurable: true,
  })
}

function fireScroll() {
  window.dispatchEvent(new Event('scroll'))
}

describe('useScrollProgress', () => {
  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 0,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: 768,
      writable: true,
      configurable: true,
    })
  })

  it('initializes progress based on the current scroll position on mount', () => {
    setViewport({ scrollY: 0, scrollHeight: 1000, innerHeight: 500 })
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBe(0)
  })

  it('computes progress as a fraction between 0 and 1 while scrolling', () => {
    setViewport({ scrollY: 0, scrollHeight: 1000, innerHeight: 500 })
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 250, writable: true, configurable: true })
      fireScroll()
    })

    expect(result.current).toBe(0.5)
  })

  it('returns 1 when scrolled all the way to the bottom', () => {
    setViewport({ scrollY: 500, scrollHeight: 1000, innerHeight: 500 })
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      fireScroll()
    })

    expect(result.current).toBe(1)
  })

  it('returns 0 when document height is not greater than viewport height', () => {
    setViewport({ scrollY: 100, scrollHeight: 500, innerHeight: 500 })
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      fireScroll()
    })

    expect(result.current).toBe(0)
  })

  it('updates progress on each scroll event', () => {
    setViewport({ scrollY: 0, scrollHeight: 1000, innerHeight: 500 })
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
      fireScroll()
    })
    expect(result.current).toBe(0.2)

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true })
      fireScroll()
    })
    expect(result.current).toBe(0.8)
  })

  it('removes the scroll listener on unmount', () => {
    setViewport({ scrollY: 0, scrollHeight: 1000, innerHeight: 500 })
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useScrollProgress())

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
})