import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import Hero from '../Hero'

const mockHero = {
  status: { ar: 'متاح للعمل', en: 'Available for work' },
  name: { ar: 'مصطفى\nالسيد', en: 'Mostafa\nEl-Sayed' },
  title: { ar: 'خبير تسويق رقمي', en: 'Digital Marketing Expert' },
  cta: { ar: 'تواصل معي', en: 'Get in Touch' },
  backgroundGradient: 'linear-gradient(135deg, #111111 0%, #222222 100%)',
  portraitImage: '/hero-portrait.png',
  portraitAlt: { ar: 'مصطفى السيد', en: 'Mostafa El-Sayed' },
}

vi.mock('@/lib/data', () => ({
  get hero() {
    return mockHero
  },
}))

vi.mock('@/components/animations/Typewriter', () => ({
  default: ({
    text,
    delay,
    className,
  }: {
    text: string
    delay?: number
    className?: string
  }) => (
    <span data-testid="typewriter" data-delay={delay} className={className}>
      {text}
    </span>
  ),
}))

vi.mock('@/components/animations/SpotlightBorder', () => ({
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div data-testid="spotlight-border" className={className}>
      {children}
    </div>
  ),
}))

describe('Hero', () => {
  beforeEach(() => {
    render(<Hero />)
  })

  it('renders the section with id="home" and applies the background gradient inline style', () => {
    const section = document.getElementById('home')
    expect(section).toBeInTheDocument()
    expect(section).toHaveStyle({ background: mockHero.backgroundGradient })
  })

  it('renders the availability status text', () => {
    expect(screen.getByText(mockHero.status.ar)).toBeInTheDocument()
  })

  it('does not apply legacy GSAP opacity/translate classes to the status wrapper', () => {
    const statusText = screen.getByText(mockHero.status.ar)
    const statusWrapper = statusText.closest('div.flex.items-center.gap-3')
    expect(statusWrapper).not.toBeNull()
    expect(statusWrapper?.className).not.toMatch(/opacity-0/)
    expect(statusWrapper?.className).not.toMatch(/translate-y/)
  })

  it('passes the hero name, a 0.5s delay, and the whitespace-pre-line class to Typewriter', () => {
    const typewriter = screen.getByTestId('typewriter')
    expect(typewriter.textContent).toBe(mockHero.name.ar)
    expect(typewriter).toHaveAttribute('data-delay', '0.5')
    expect(typewriter).toHaveClass('whitespace-pre-line')
  })

  it('renders the Typewriter inside an h1 heading with correct aria-label and aria-hidden wrapper', () => {
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('aria-label', mockHero.name.ar)
    const typewriter = within(heading).getByTestId('typewriter')
    expect(typewriter).toBeInTheDocument()
    expect(typewriter.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(heading.className).not.toMatch(/opacity-0/)
    expect(heading.className).not.toMatch(/translate-y/)
  })

  it('renders the hero title text', () => {
    expect(screen.getByText(mockHero.title.ar)).toBeInTheDocument()
  })

  it('renders the portrait image with the correct src and localized alt text', () => {
    const img = screen.getByAltText(mockHero.portraitAlt.ar) as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src')).toBe(mockHero.portraitImage)
  })

  it('wraps the CTA link in a SpotlightBorder with the inline-block class', () => {
    const spotlight = screen.getByTestId('spotlight-border')
    expect(spotlight).toHaveClass('inline-block')

    const link = within(spotlight).getByRole('link')
    expect(link).toHaveTextContent(mockHero.cta.ar)
    expect(link).toHaveAttribute('href', '#contact')
  })

  it('does not apply legacy GSAP opacity/translate classes to the CTA link', () => {
    const link = screen.getByRole('link', { name: new RegExp(mockHero.cta.ar) })
    expect(link.className).not.toMatch(/opacity-0/)
    expect(link.className).not.toMatch(/translate-y/)
  })

  it('smooth-scrolls to the #contact element when the CTA is clicked', () => {
    const contactSection = document.createElement('div')
    contactSection.id = 'contact'
    document.body.appendChild(contactSection)
    const scrollIntoViewMock = vi.fn()
    contactSection.scrollIntoView = scrollIntoViewMock

    const link = screen.getByRole('link', { name: new RegExp(mockHero.cta.ar) })
    fireEvent.click(link)

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1)
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('prevents the default anchor navigation when the CTA is clicked', () => {
    const link = screen.getByRole('link', { name: new RegExp(mockHero.cta.ar) })

    const notCanceled = fireEvent.click(link)

    // fireEvent returns false when the event's default action was prevented
    expect(notCanceled).toBe(false)
  })

  it('does not throw when the CTA is clicked and no #contact element exists in the DOM', () => {
    const link = screen.getByRole('link', { name: new RegExp(mockHero.cta.ar) })

    expect(() => fireEvent.click(link)).not.toThrow()
  })
})