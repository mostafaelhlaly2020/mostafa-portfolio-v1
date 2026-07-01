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
 * GSAP ticker cleaned up on unmount and between triggers.
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
  const hasTriggered = useRef(false)
  const tickerRef = useRef<(() => void) | null>(null)

  const scramble = useCallback(() => {
    // Clean up any previous ticker
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

  // Cleanup ticker on unmount
  useEffect(() => {
    return () => {
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current)
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
      scramble()
    }
  }, [isHovering, trigger, prefersReduced, scramble])

  // inView trigger
  useEffect(() => {
    if (prefersReduced || trigger !== 'inView') return
    if (inView && !hasTriggered.current) {
      hasTriggered.current = true
      scramble()
    }
  }, [inView, trigger, prefersReduced, scramble])

  // Combine refs for inView + container
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
