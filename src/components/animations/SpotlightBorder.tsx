import { useRef, useState, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface SpotlightBorderProps {
  /** Content to wrap with the spotlight border */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * Spotlight border effect on hover using CSS custom properties + mouse tracking.
 * A radial gradient follows the cursor along the card border.
 * Uses CSS custom properties (set directly on DOM) for high-frequency
 * mouse position updates, avoiding React re-renders on every mousemove.
 * Respects prefers-reduced-motion: no spotlight, standard border.
 */
export default function SpotlightBorder({
  children,
  className = '',
}: SpotlightBorderProps) {
  const prefersReduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      // Set CSS custom properties directly on the DOM node — no React state update
      cardRef.current.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`)
      cardRef.current.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`)
    },
    [prefersReduced]
  )

  if (prefersReduced) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background:
            'radial-gradient(600px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), rgba(124, 58, 237, 0.15), transparent 40%)',
        }}
      />
      {/* Border spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background:
            'radial-gradient(400px circle at var(--spotlight-x, 0px) var(--spotlight-y, 0px), rgba(124, 58, 237, 0.4), transparent 40%)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      {children}
    </div>
  )
}
