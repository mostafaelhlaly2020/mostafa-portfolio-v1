import { useMediaQuery } from './useMediaQuery'

/**
 * Detects the user's prefers-reduced-motion setting.
 * Returns true if the user has enabled reduced motion in their OS.
 * All animation components MUST check this hook and skip/disable
 * animations when it returns true.
 *
 * Delegates to useMediaQuery to avoid duplicated matchMedia logic.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
