import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import MeshGradient from '../MeshGradient'

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}))

const mockUseReducedMotion = vi.mocked(useReducedMotion)

describe('MeshGradient', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it('renders a div marked aria-hidden', () => {
    const { container } = render(<MeshGradient colors={['#fff', '#000']} />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveAttribute('aria-hidden', 'true')
  })

  it('builds a linear-gradient background from the provided colors', () => {
    const { container } = render(<MeshGradient colors={['#ff0000', '#00ff00', '#0000ff']} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.background).toBe('linear-gradient(135deg, #ff0000, #00ff00, #0000ff)')
  })

  it('applies animation and enlarged background size when motion is not reduced', () => {
    const { container } = render(<MeshGradient colors={['#fff', '#000']} speed={8} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.backgroundSize).toBe('400% 400%')
    expect(el.style.animation).toContain('meshGradient 8s ease infinite')
  })

  it('uses the default speed of 8 seconds when none is provided', () => {
    const { container } = render(<MeshGradient colors={['#fff', '#000']} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.animation).toContain('8s')
  })

  it('respects a custom speed value', () => {
    const { container } = render(<MeshGradient colors={['#fff', '#000']} speed={3} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.animation).toContain('3s')
  })

  it('applies the passed className', () => {
    const { container } = render(<MeshGradient colors={['#fff', '#000']} className="custom-class" />)
    const el = container.firstChild as HTMLElement
    expect(el).toHaveClass('custom-class')
  })

  it('disables the animation and background-size when prefers-reduced-motion is set', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<MeshGradient colors={['#fff', '#000']} speed={8} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.animation).toBe('')
    expect(el.style.backgroundSize).toBe('')
    expect(el.style.background).toBe('linear-gradient(135deg, #fff, #000)')
  })

  it('always renders the keyframes style tag regardless of reduced motion', () => {
    mockUseReducedMotion.mockReturnValue(true)
    const { container } = render(<MeshGradient colors={['#fff', '#000']} />)
    expect(container.querySelector('style')?.textContent).toContain('@keyframes meshGradient')
  })
})