import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInView } from '@/hooks/useInView'

interface TextScrambleProps {
  /** The text to display and scramble */
  text: string
  /** When to trigger the scramble effect */
  trigger?: 'hover' | 'mount' | 'inView'
  /** Additional CSS classes */
  className?: string
  /** Callback when scramble completes */
  onComplete?: () => void
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

/**
 * Text scramble/decode animation using GSAP ticker.
 * Characters randomly shuffle before resolving to the target text.
 * Supports mount, hover, and inView trigger modes.
 * Respects prefers-reduced-motion: shows text instantly.
 * GSAP ticker cleaned up on unmount, between triggers, and on text changes.
 */
export default function TextScramble({
  text,
  trigger = 'mount',
  className = '',
  onComplete,
}: TextScrambleProps) {
  const prefersReduced = useReducedMotion()
  const { ref: inViewRef, inView } = useInView<HTMLElement>({ threshold: 0.3, triggerOnce: true })
  const containerRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState(prefersReduced ? text : '')
  const [isHovering, setIsHovering] = useState(false)
  // Reset hasTriggered when text changes so animation re-runs for the new text
  const hasTriggered = useRef(false)
  const tickerRef = useRef<(() => void) | null>(null)
  const prevTextRef = useRef(text)

  // FIX C: Reset hasTriggered when text changes so animation re-runs
  if (prevTextRef.current !== text) {
    prevTextRef.current = text
    hasTriggered.current = false
  }

  const scramble = useCallback(() => {
    // FIX A: Clean up any previous ticker to prevent stacking/orphan callbacks
    if (tickerRef.current) {
      gsap.ticker.remove(tickerRef.current)
      tickerRef.current = null
    }

    if (prefersReduced) {
      setDisplayText(text)
      onComplete?.()
      return
    }

    let frame = 0
    const totalFrames = text.length * 2

    const ticker = () => {
      frame++
      const progress = frame / totalFrames
      const result = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i / text.length < progress) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      setDisplayText(result)

      if (frame >= totalFrames) {
        gsap.ticker.remove(ticker)
        tickerRef.current = null
        setDisplayText(text)
        onComplete?.()
      }
    }

    tickerRef.current = ticker
    gsap.ticker.add(ticker)
  }, [text, prefersReduced, onComplete])

  // FIX A: Cleanup ticker on unmount — guaranteed no orphan callbacks
  useEffect(() => {
    return () => {
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current)
        tickerRef.current = null
      }
    }
  }, [])

  // mount trigger
  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(text)
      return
    }

    if (trigger === 'mount' && !hasTriggered.current) {
      hasTriggered.current = true
      scramble()
    }
  }, [trigger, text, prefersReduced, scramble])

  // hover trigger
  useEffect(() => {
    if (prefersReduced || trigger !== 'hover') return
    if (isHovering) {
      hasTriggered.current = false
      scramble()
    }
  }, [isHovering, trigger, prefersReduced, scramble])

  // FIX B: inView trigger — observer re-attaches via useInView when trigger changes
  // useInView manages its own IntersectionObserver lifecycle with proper cleanup
  useEffect(() => {
    if (prefersReduced || trigger !== 'inView') return
    if (inView && !hasTriggered.current) {
      hasTriggered.current = true
      scramble()
    }
  }, [inView, trigger, prefersReduced, scramble])

  // FIX B: Combine refs properly — inViewRef attaches when trigger=inView
  // Using callback ref so both containerRef and inViewRef are set correctly
  const setRefs = useCallback(
    (node: HTMLSpanElement | null) => {
      (containerRef as React.MutableRefObject<HTMLSpanElement | null>).current = node
      if (trigger === 'inView') {
        (inViewRef as React.MutableRefObject<HTMLElement | null>).current = node
      }
    },
    [trigger, inViewRef]
  )

  if (trigger === 'hover') {
    return (
      <span
        ref={setRefs}
        className={className}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {displayText}
      </span>
    )
  }

  return (
    <span ref={setRefs} className={className}>
      {displayText}
    </span>
  )
}
