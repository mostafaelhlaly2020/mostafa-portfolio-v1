import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

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
 * Text scramble/decode animation using GSAP.
 * Characters randomly shuffle before resolving to the target text.
 * Respects prefers-reduced-motion: shows text instantly.
 * GSAP context wrapped, ctx.revert() on unmount.
 */
export default function TextScramble({
  text,
  trigger = 'mount',
  className = '',
  onComplete,
}: TextScrambleProps) {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState(prefersReduced ? text : '')
  const [isHovering, setIsHovering] = useState(false)
  const hasTriggered = useRef(false)

  const scramble = () => {
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
        setDisplayText(text)
        onComplete?.()
      }
    }

    gsap.ticker.add(ticker)
  }

  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(text)
      return
    }

    if (trigger === 'mount' && !hasTriggered.current) {
      hasTriggered.current = true
      scramble()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, text, prefersReduced])

  useEffect(() => {
    if (prefersReduced || trigger !== 'hover') return
    if (isHovering) {
      scramble()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering])

  if (trigger === 'hover') {
    return (
      <span
        ref={containerRef}
        className={className}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {displayText}
      </span>
    )
  }

  return (
    <span ref={containerRef} className={className}>
      {displayText}
    </span>
  )
}
