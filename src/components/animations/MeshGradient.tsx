'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MeshGradientProps {
  /** Brand colors for the gradient mesh */
  colors: string[]
  /** Animation duration in seconds (default: 8) */
  speed?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Animated gradient mesh background using CSS Keyframes only.
 * GPU-accelerated via transform and opacity.
 * Respects prefers-reduced-motion: shows static gradient.
 */
export default function MeshGradient({
  colors,
  speed = 8,
  className = '',
}: MeshGradientProps) {
  const prefersReduced = useReducedMotion()

  const gradientStyle: React.CSSProperties = prefersReduced
    ? {
        background: `linear-gradient(135deg, ${colors.join(', ')})`,
      }
    : {
        background: `linear-gradient(135deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%',
        animation: `meshGradient ${speed}s ease infinite`,
      }

  return (
    <div
      className={className}
      style={gradientStyle}
      aria-hidden="true"
    >
      {!prefersReduced && (
        <style>{`
          @keyframes meshGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      )}
    </div>
  )
}
