import { useSyncExternalStore } from 'react'

// Module-scoped subscribe — stable reference, never recreated per render
function subscribe(callback: () => void): () => void {
  window.addEventListener('scroll', callback, { passive: true })
  window.addEventListener('resize', callback, { passive: true })
  return () => {
    window.removeEventListener('scroll', callback)
    window.removeEventListener('resize', callback)
  }
}

// Module-scoped getSnapshot — pure function, always returns current value
function getSnapshot(): number {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return docHeight > 0 ? scrollTop / docHeight : 0
}

function getServerSnapshot(): number {
  return 0
}

/**
 * Tracks page scroll progress from 0 (top) to 1 (bottom).
 * Uses useSyncExternalStore with module-scoped subscribe/getSnapshot
 * to guarantee stable references and prevent resubscription on every render.
 * Passive scroll + resize listeners for performance.
 */
export function useScrollProgress(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
