import { useSyncExternalStore } from 'react'

/**
 * Detects the user's prefers-reduced-motion setting.
 * Returns true if the user has enabled reduced motion in their OS.
 * All animation components MUST check this hook and skip/disable
 * animations when it returns true.
 */
export function useReducedMotion(): boolean {
  const subscribe = (callback: () => void) => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
  }

  const getSnapshot = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
