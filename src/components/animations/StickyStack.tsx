import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface StickyStackProps {
  /** Content items to stack — each child becomes a sticky card */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * Sticky + stack on scroll effect using GSAP ScrollTrigger.
 * Cards stick and stack as the user scrolls through them.
 * Respects prefers-reduced-motion: normal flow layout.
 * GSAP context wrapped, ctx.revert() on unmount.
 */
export default function StickyStack({
  children,
  className = '',
}: StickyStackProps) {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useLayoutEffect(() => {
    if (prefersReduced || !containerRef.current) return

    ctxRef.current = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.sticky-stack-card')
      if (!cards || cards.length === 0) return

      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0.4,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top center',
              scrub: true,
            },
          })
        }
      })
    }, containerRef)

    return () => {
      ctxRef.current?.revert()
    }
  }, [prefersReduced, children])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
