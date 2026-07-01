'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

const DEFAULT_COLORS = ['#7c3aed', '#2563eb']

interface MeshGradientProps {
  /** Brand colors for the gradient mesh (minimum 2) */
  colors: string[]
  /** Animation duration in seconds (default: 8) */
  speed?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Animated gradient mesh background using CSS Keyframes only.
 * GPU-accelerated via background-position animation.
 * Respects prefers-reduced-motion: shows static gradient.
 * Keyframes defined once in global scope to avoid per-instance duplication.
 */
export default function MeshGradient({
  colors,
  speed = 8,
  className = '',
}: MeshGradientProps) {
  const prefersReduced = useReducedMotion()

  // Validate colors — need at least 2 for a valid gradient
  const safeColors = colors.length >= 2 ? colors : DEFAULT_COLORS

  const gradientStyle: React.CSSProperties = prefersReduced
    ? {
        background: `linear-gradient(135deg, ${safeColors.join(', ')})`,
      }
    : {
        background: `linear-gradient(135deg, ${safeColors.join(', ')})`,
        backgroundSize: '400% 400%',
        animation: `meshGradient ${speed}s ease infinite`,
      }

  return (
    <div
      className={className}
      style={gradientStyle}
      aria-hidden="true"
    />
  )
}
