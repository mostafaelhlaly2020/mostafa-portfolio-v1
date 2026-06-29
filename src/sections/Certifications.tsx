import { useEffect, useRef } from 'react'
import { certifications, iconMap } from '@/lib/data'

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate header
            const headerEls = entry.target.querySelectorAll('.reveal')
            headerEls.forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 150)
            })

            // Animate cards with stagger
            const cards = entry.target.querySelectorAll('.cert-card')
            cards.forEach((card, i) => {
              setTimeout(() => {
                const el = card as HTMLElement
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              }, 400 + i * 80)
            })

            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="section-light py-24 md:py-32 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="reveal inline-block text-sm text-[#6B6B6B] mb-4 font-medium">
            {certifications.label.ar}
          </span>
          <h2
            className="reveal text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight"
            style={{ transitionDelay: '0.15s' }}
          >
            {certifications.heading.ar} <span className="text-[#C4A265]">{certifications.highlight.ar}</span>
          </h2>
          <p
            className="reveal mt-4 text-base md:text-lg text-[#6B6B6B] max-w-2xl mx-auto"
            style={{ transitionDelay: '0.3s' }}
          >
            {certifications.subtitle.ar}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certifications.items.map((cert, index) => {
            const Icon = iconMap[cert.icon] ?? iconMap.TrendingUp
            return (
              <div
                key={index}
                className="cert-card group relative rounded-xl p-6 transition-all duration-400"
                style={{
                  backgroundColor: '#F5F0EB',
                  border: '1px solid rgba(26, 26, 26, 0.08)',
                  opacity: 0,
                  transform: 'translateY(40px)',
                  transition:
                    'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s, box-shadow 0.4s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(196, 162, 101, 0.4)'
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(26, 26, 26, 0.08)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Year Badge */}
                <span
                  className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: '#C4A265',
                    color: '#FFFFFF',
                  }}
                >
                  {cert.year}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#2D2D2D' }}
                >
                  <Icon className="w-5 h-5 text-[#C4A265]" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">
                  {cert.title.ar}
                </h3>

                {/* Platform */}
                <p className="text-xs text-[#6B6B6B] mb-3">{cert.platform.ar}</p>

                {/* Description */}
                <p className="text-xs text-[#6B6B6B]">
                  {cert.description.ar}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
