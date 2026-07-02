import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface ZoomParallaxProps {
  /** Content to apply the zoom parallax effect to */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Zoom intensity multiplier (default: 0.3) */
  intensity?: number
}

/**
 * Zoom on scroll effect using GSAP ScrollTrigger.
 * Scales the container based on scroll position.
 * Respects prefers-reduced-motion: no zoom effect.
 * GSAP context wrapped, ctx.revert() on unmount.
 */
export default function ZoomParallax({
  children,
  className = '',
  intensity = 0.3,
}: ZoomParallaxProps) {
  const prefersReduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useLayoutEffect(() => {
    if (prefersReduced || !containerRef.current) return

    ctxRef.current = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { scale: 1 - intensity },
        {
          scale: 1 + intensity,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, containerRef)

    return () => {
      ctxRef.current?.revert()
    }
  }, [intensity, prefersReduced])

  return (
    <div ref={containerRef} className={className} style={{ overflow: 'hidden' }}>
      {children}
    </div>
  )
}
