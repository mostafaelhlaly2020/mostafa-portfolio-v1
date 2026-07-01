import { useSyncExternalStore } from 'react'

/**
 * Tracks page scroll progress from 0 (top) to 1 (bottom).
 * Uses useSyncExternalStore to avoid set-state-in-effect anti-pattern.
 * Passive scroll listener for performance.
 */
export function useScrollProgress(): number {
  const subscribe = (callback: () => void) => {
    window.addEventListener('scroll', callback, { passive: true })
    window.addEventListener('resize', callback, { passive: true })
    return () => {
      window.removeEventListener('scroll', callback)
      window.removeEventListener('resize', callback)
    }
  }

  const getSnapshot = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    return docHeight > 0 ? scrollTop / docHeight : 0
  }

  const getServerSnapshot = () => 0

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
