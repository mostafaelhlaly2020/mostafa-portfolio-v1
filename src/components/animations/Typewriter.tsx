import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TypewriterProps {
  /** The text to type out character by character */
  text: string
  /** Typing speed in seconds per character (default: 0.05) */
  speed?: number
  /** Delay before typing starts in seconds (default: 0) */
  delay?: number
  /** Additional CSS classes */
  className?: string
  /** Callback when typing completes */
  onComplete?: () => void
}

/**
 * Character-by-character text reveal using GSAP.
 * Does NOT require SplitType — uses state-based character reveal.
 * Respects prefers-reduced-motion: shows text instantly.
 * GSAP context wrapped, ctx.revert() on unmount.
 */
export default function Typewriter({
  text,
  speed = 0.05,
  delay = 0,
  className = '',
  onComplete,
}: TypewriterProps) {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLSpanElement>(null)
  const [visibleCount, setVisibleCount] = useState(prefersReduced ? text.length : 0)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    if (prefersReduced) {
      setVisibleCount(text.length)
      return
    }

    ctxRef.current = gsap.context(() => {
      const proxy = { count: 0 }

      gsap.to(proxy, {
        count: text.length,
        duration: speed * text.length,
        delay,
        ease: 'none',
        onUpdate: () => {
          setVisibleCount(Math.round(proxy.count))
        },
        onComplete: () => {
          setVisibleCount(text.length)
          onComplete?.()
        },
      })
    }, containerRef)

    return () => {
      ctxRef.current?.revert()
    }
  }, [text, speed, delay, prefersReduced]) // eslint-disable-line react-hooks/exhaustive-deps -- onComplete intentionally excluded to prevent animation restart

  return (
    <span ref={containerRef} className={className}>
      {text.slice(0, visibleCount)}
      {visibleCount < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  )
}
