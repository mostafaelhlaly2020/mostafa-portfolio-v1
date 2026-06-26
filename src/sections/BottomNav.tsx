import { useState, useEffect } from 'react'
import { site } from '@/lib/data'

export default function BottomNav() {
  const [activeSection, setActiveSection] = useState('home')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero (80vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.6)

      // Determine active section
      const sections = site.navItems.map((item) => item.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.5) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div
        className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-3 rounded-full backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        {site.navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className={`relative px-2 md:px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 ${
              activeSection === item.href.slice(1)
                ? 'text-white'
                : 'text-[#6B6B6B] hover:text-[#C4A265]'
            }`}
          >
            {activeSection === item.href.slice(1) && (
              <span
                className="absolute inset-0 rounded-full -z-10 transition-all duration-300"
                style={{ backgroundColor: '#1A1A1A' }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{item.label.ar}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
