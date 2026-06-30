import { useState, useEffect } from 'react'

/**
 * Detects the user's prefers-reduced-motion setting.
 * Returns true if the user has enabled reduced motion in their OS.
 * All animation components MUST check this hook and skip/disable
 * animations when it returns true.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches)
    }

    setPrefersReduced(mql.matches)
    mql.addEventListener('change', handleChange)

    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return prefersReduced
}
