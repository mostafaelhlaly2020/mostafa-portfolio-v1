import { vi } from 'vitest'

/**
 * Centralized useReducedMotion mock for all animation tests.
 * Provides consistent mock implementation across test files.
 *
 * Usage in test files:
 *   import { mockUseReducedMotion, setReducedMotion } from '@/test/mocks/useReducedMotion'
 *   vi.mock('@/hooks/useReducedMotion', () => useReducedMotionMockFactory)
 *   setReducedMotion(false) // or true
 */

let reducedMotionValue = false

export const mockUseReducedMotion = vi.fn(() => reducedMotionValue)

/**
 * Set the return value of useReducedMotion for the next test.
 */
export function setReducedMotion(value: boolean) {
  reducedMotionValue = value
  mockUseReducedMotion.mockReturnValue(value)
}

/**
 * Factory that creates a consistent useReducedMotion mock.
 * Use as: vi.mock('@/hooks/useReducedMotion', () => useReducedMotionMockFactory)
 */
export const useReducedMotionMockFactory = {
  useReducedMotion: mockUseReducedMotion,
}

/**
 * Reset useReducedMotion mock between tests.
 */
export function resetReducedMotionMock() {
  reducedMotionValue = false
  mockUseReducedMotion.mockReset()
  mockUseReducedMotion.mockReturnValue(false)
}
