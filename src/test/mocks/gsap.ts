import { vi } from 'vitest'

/**
 * Centralized GSAP mock for all animation tests.
 * Provides consistent mock implementations across test files.
 *
 * Usage in test files:
 *   import { mockGsapContext, mockGsapFromTo, mockGsapTo, mockTickerAdd, mockTickerRemove } from '@/test/mocks/gsap'
 *   vi.mock('gsap', () => gsapMockFactory)
 *   vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))
 */

// Shared mock functions
export const mockGsapContext = vi.fn(() => ({
  revert: vi.fn(),
}))

export const mockGsapFromTo = vi.fn()

export const mockGsapTo = vi.fn()

export const mockTickerAdd = vi.fn()

export const mockTickerRemove = vi.fn()

export const mockRegisterPlugin = vi.fn()

/**
 * Factory that creates a consistent gsap mock object.
 * Use as: vi.mock('gsap', () => gsapMockFactory)
 */
export const gsapMockFactory = {
  __esModule: true,
  default: {
    context: mockGsapContext,
    fromTo: mockGsapFromTo,
    to: mockGsapTo,
    registerPlugin: mockRegisterPlugin,
    ticker: {
      add: mockTickerAdd,
      remove: mockTickerRemove,
    },
  },
}

/**
 * Reset all GSAP mocks between tests.
 * Call in beforeEach() or afterEach().
 */
export function resetGsapMocks() {
  mockGsapContext.mockClear()
  mockGsapFromTo.mockClear()
  mockGsapTo.mockClear()
  mockTickerAdd.mockClear()
  mockTickerRemove.mockClear()
  mockRegisterPlugin.mockClear()

  // Reset default implementations
  mockGsapContext.mockImplementation(() => ({ revert: vi.fn() }))
}
