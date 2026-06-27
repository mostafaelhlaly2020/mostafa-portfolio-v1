import { ArrowUpLeft } from 'lucide-react'
import { site } from '@/lib/data'

/**
 * Renders the site footer with brand information, quick links, and social links.
 *
 * Smooth-scrolls to in-page anchors when quick links point to hash targets.
 *
 * @returns The footer content.
 */
export default function Footer() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="py-16 md:py-20" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: '#F0EDE8' }}
            >
              {site.name.ar}
            </h3>
            <p style={{ color: 'rgba(240, 237, 232, 0.6)' }}>
              {site.tagline.ar}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: 'rgba(240, 237, 232, 0.4)' }}
            >
              {site.quickLinksLabel?.ar || 'روابط سريعة'}
            </h4>
            <ul className="space-y-3">
              {site.quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="transition-colors duration-300 hover:text-[#C4A265]"
                    style={{ color: 'rgba(240, 237, 232, 0.7)' }}
                  >
                    {link.label.ar}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: 'rgba(240, 237, 232, 0.4)' }}
            >
              {site.socialLabel?.ar || 'تابعني'}
            </h4>
            <ul className="space-y-3">
              {site.socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={
                      link.url.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#C4A265]"
                    style={{ color: 'rgba(240, 237, 232, 0.7)' }}
                  >
                    <span>{link.label}</span>
                    <ArrowUpLeft className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-8"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-sm"
            style={{ color: 'rgba(240, 237, 232, 0.4)' }}
          >
            {site.copyright.ar}
          </p>
          <p
            className="text-sm"
            style={{ color: 'rgba(240, 237, 232, 0.4)' }}
          >
            {site.madeWith.ar}
          </p>
        </div>
      </div>
    </footer>
  )
}
