import { useCallback, useSyncExternalStore } from 'react'

/**
 * Reactive media query hook. Returns true when the query matches.
 * Used for responsive breakpoint detection and animation simplification.
 *
 * subscribe and getSnapshot are memoized with useCallback keyed on `query`
 * to prevent unnecessary resubscription on every render.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    [query]
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
