import { ArrowUpLeft } from 'lucide-react'

const quickLinks = [
  { label: 'من أنا', href: '#about' },
  { label: 'المهارات', href: '#skills' },
  { label: 'الخبرات', href: '#experience' },
  { label: 'الشهادات', href: '#certifications' },
  { label: 'آراء العملاء', href: '#testimonials' },
  { label: 'التواصل', href: '#contact' },
]

const socialLinks = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'WhatsApp', href: 'https://wa.me/201118839776' },
]

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
              مصطفى السيد
            </h3>
            <p style={{ color: 'rgba(240, 237, 232, 0.6)' }}>
              خبير تسويق رقمي | استشارات عقارية
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: 'rgba(240, 237, 232, 0.4)' }}
            >
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="transition-colors duration-300 hover:text-[#C4A265]"
                    style={{ color: 'rgba(240, 237, 232, 0.7)' }}
                  >
                    {link.label}
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
              تابعني
            </h4>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      link.href.startsWith('http')
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
            &copy; 2025 مصطفى السيد. جميع الحقوق محفوظة.
          </p>
          <p
            className="text-sm"
            style={{ color: 'rgba(240, 237, 232, 0.4)' }}
          >
            صُنع بشغف في مصر
          </p>
        </div>
      </div>
    </footer>
  )
}
