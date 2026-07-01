import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface KineticMarqueeProps {
  /** Content items to scroll — render your own icons/labels */
  children: React.ReactNode
  /** Scroll speed in pixels per second (default: 50) */
  speed?: number
  /** Scroll direction — respects RTL/LTR */
  direction?: 'rtl' | 'ltr'
  /** Additional CSS classes */
  className?: string
}

/**
 * Infinite horizontal scroll marquee using GSAP.
 * Duplicates children for seamless looping.
 * Respects prefers-reduced-motion: static layout.
 * GSAP context wrapped, ctx.revert() on unmount.
 */
export default function KineticMarquee({
  children,
  speed = 50,
  direction = 'rtl',
  className = '',
}: KineticMarqueeProps) {
  const prefersReduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    if (prefersReduced || !trackRef.current) return

    const track = trackRef.current
    const items = track.children

    // Duplicate items for seamless loop
    const fragment = document.createDocumentFragment()
    Array.from(items).forEach((item) => {
      fragment.appendChild(item.cloneNode(true))
    })
    track.appendChild(fragment)

    const totalWidth = track.scrollWidth / 2
    const duration = totalWidth / speed
    const xPercent = direction === 'rtl' ? 0 : -50

    ctxRef.current = gsap.context(() => {
      gsap.fromTo(
        track,
        { xPercent },
        {
          xPercent: direction === 'rtl' ? -50 : 0,
          duration,
          ease: 'none',
          repeat: -1,
        }
      )
    }, track)

    return () => {
      ctxRef.current?.revert()
    }
  }, [speed, direction, prefersReduced])

  if (prefersReduced) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div ref={trackRef} className="flex items-center gap-8">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={trackRef} className="flex items-center gap-8">
        {children}
      </div>
    </div>
  )
}
