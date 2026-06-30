import { useState, useEffect } from 'react'

/**
 * Reactive media query hook. Returns true when the query matches.
 * Used for responsive breakpoint detection and animation simplification.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mql = window.matchMedia(query)

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    setMatches(mql.matches)
    mql.addEventListener('change', handleChange)

    return () => mql.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
