import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  id?: string
}

/**
 * ScrollReveal Component
 *
 * This component creates the "section stacking" effect where each section
 * appears to slide up from below the previous one as you scroll.
 * It's the core animation effect from the reference website (ahmedelramlawy.com).
 */
export default function ScrollReveal({
  children,
  className = '',
  id,
}: ScrollRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Wait for images to load before calculating heights
    const initAnimation = () => {
      // Set initial state
      gsap.set(section, {
        position: 'relative',
        zIndex: 1,
      })

      // Create scroll trigger for parallax slide-up effect
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        end: 'top 20%',
        scrub: 1,
        onEnter: () => {
          gsap.to(section, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
          })
        },
      })
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initAnimation, 100)

    return () => {
      clearTimeout(timer)
      if (triggerRef.current) {
        triggerRef.current.kill()
      }
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      id={id}
      className={className}
      style={{
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
