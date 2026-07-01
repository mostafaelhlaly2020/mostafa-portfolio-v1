import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface StickyCardsProps {
  /** Content items to display as sticky cards */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * Sticky cards on scroll using GSAP ScrollTrigger.
 * Each card sticks briefly while the next one overlaps it.
 * Respects prefers-reduced-motion: normal flow layout.
 * GSAP context wrapped, ctx.revert() on unmount.
 */
export default function StickyCards({
  children,
  className = '',
}: StickyCardsProps) {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    if (prefersReduced || !containerRef.current) return

    ctxRef.current = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.sticky-card-item')
      if (!cards || cards.length === 0) return

      cards.forEach((card, i) => {
        if (i > 0) {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                scrub: true,
              },
            }
          )
        }
      })
    }, containerRef)

    return () => {
      ctxRef.current?.revert()
    }
  }, [prefersReduced])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
