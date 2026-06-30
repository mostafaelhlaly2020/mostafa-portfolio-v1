import { useState, useEffect, useRef, type RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

interface UseInViewReturn<T> {
  ref: RefObject<T | null>
  inView: boolean
}

/**
 * Detects when an element enters the viewport via IntersectionObserver.
 * Supports triggerOnce for one-shot reveal animations.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): UseInViewReturn<T> {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setInView(isVisible)

        if (isVisible && triggerOnce) {
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, inView }
}
