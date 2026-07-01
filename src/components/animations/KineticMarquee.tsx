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
  /** Accessible label describing the marquee content */
  'aria-label'?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Infinite horizontal scroll marquee using GSAP.
 * Duplicates children for seamless looping via declarative rendering.
 * Respects prefers-reduced-motion: static layout.
 * GSAP context wrapped, ctx.revert() on unmount.
 * Clone nodes are cleaned up on re-run to prevent DOM accumulation.
 */
export default function KineticMarquee({
  children,
  speed = 50,
  direction = 'rtl',
  'aria-label': ariaLabel,
  className = '',
}: KineticMarqueeProps) {
  const prefersReduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    if (prefersReduced || !trackRef.current) return

    const track = trackRef.current
    // Capture only the originally-rendered children so re-runs don't clone stale clones
    const originalChildren = Array.from(track.children)

    // Duplicate items for seamless loop
    const fragment = document.createDocumentFragment()
    originalChildren.forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement
      clone.setAttribute('aria-hidden', 'true')
      fragment.appendChild(clone)
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
      // Remove the clones so the next effect run starts from the original set
      Array.from(track.children)
        .slice(originalChildren.length)
        .forEach((clone) => clone.remove())
    }
  }, [speed, direction, prefersReduced, children])

  if (prefersReduced) {
    return (
      <div className={`overflow-hidden ${className}`} aria-label={ariaLabel}>
        <div ref={trackRef} className="flex items-center gap-8">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`} aria-label={ariaLabel}>
      <div ref={trackRef} className="flex items-center gap-8">
        {children}
      </div>
    </div>
  )
}
