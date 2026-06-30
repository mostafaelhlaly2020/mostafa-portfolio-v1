import { useState, useEffect } from 'react'

/**
 * Tracks page scroll progress from 0 (top) to 1 (bottom).
 * Uses a passive scroll listener for performance.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initialize

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}
