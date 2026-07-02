import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useInView } from '../useInView'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  callback: IntersectionObserverCallback
  options?: IntersectionObserverInit
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    MockIntersectionObserver.instances.push(this)
  }

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this
    )
  }
}

function TestComponent({ options }: { options?: UseInViewOptions }) {
  const { ref, inView } = useInView<HTMLDivElement>(options)
  return <div ref={ref} data-testid="target">{inView ? 'visible' : 'hidden'}</div>
}

describe('useInView', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = []
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts with inView false', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('target')).toHaveTextContent('hidden')
  })

  it('observes the target element on mount', () => {
    render(<TestComponent />)
    const observer = MockIntersectionObserver.instances[0]
    expect(observer.observe).toHaveBeenCalledTimes(1)
  })

  it('uses default threshold and rootMargin when none provided', () => {
    render(<TestComponent />)
    const observer = MockIntersectionObserver.instances[0]
    expect(observer.options).toEqual({ threshold: 0.1, rootMargin: '0px' })
  })

  it('passes custom threshold and rootMargin to the observer', () => {
    render(<TestComponent options={{ threshold: 0.5, rootMargin: '20px' }} />)
    const observer = MockIntersectionObserver.instances[0]
    expect(observer.options).toEqual({ threshold: 0.5, rootMargin: '20px' })
  })

  it('sets inView to true when the element intersects', () => {
    render(<TestComponent />)
    const observer = MockIntersectionObserver.instances[0]

    observer.trigger(true)

    expect(screen.getByTestId('target')).toHaveTextContent('visible')
  })

  it('sets inView back to false when the element leaves the viewport', () => {
    render(<TestComponent />)
    const observer = MockIntersectionObserver.instances[0]

    observer.trigger(true)
    expect(screen.getByTestId('target')).toHaveTextContent('visible')

    observer.trigger(false)
    expect(screen.getByTestId('target')).toHaveTextContent('hidden')
  })

  it('does not unobserve when triggerOnce is false (default)', () => {
    render(<TestComponent />)
    const observer = MockIntersectionObserver.instances[0]

    observer.trigger(true)

    expect(observer.unobserve).not.toHaveBeenCalled()
  })

  it('unobserves the element once visible when triggerOnce is true', () => {
    render(<TestComponent options={{ triggerOnce: true }} />)
    const observer = MockIntersectionObserver.instances[0]

    observer.trigger(true)

    expect(observer.unobserve).toHaveBeenCalledTimes(1)
  })

  it('does not unobserve when triggerOnce is true but not intersecting', () => {
    render(<TestComponent options={{ triggerOnce: true }} />)
    const observer = MockIntersectionObserver.instances[0]

    observer.trigger(false)

    expect(observer.unobserve).not.toHaveBeenCalled()
  })

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<TestComponent />)
    const observer = MockIntersectionObserver.instances[0]

    unmount()

    expect(observer.disconnect).toHaveBeenCalledTimes(1)
  })
})