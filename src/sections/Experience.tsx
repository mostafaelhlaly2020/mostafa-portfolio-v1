import { useEffect, useRef } from 'react'
import { experience } from '@/lib/data'

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

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

            // Animate timeline line
            if (lineRef.current) {
              setTimeout(() => {
                lineRef.current!.style.transform = 'scaleY(1)'
              }, 300)
            }

            // Animate items
            const items = entry.target.querySelectorAll('.timeline-item')
            items.forEach((item, i) => {
              setTimeout(() => {
                const el = item as HTMLElement
                el.style.opacity = '1'
                el.style.transform = 'translateX(0)'

                // Animate dot
                const dot = el.querySelector('.timeline-dot') as HTMLElement
                if (dot) {
                  dot.style.transform = 'scale(1)'
                  dot.style.opacity = '1'
                }
              }, 500 + i * 200)
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
      id="experience"
      ref={sectionRef}
      className="section-beige py-24 md:py-32 lg:py-40"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="reveal inline-block text-sm text-[#6B6B6B] mb-4 font-medium">
            {experience.label.ar}
          </span>
          <h2
            className="reveal text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight"
            style={{ transitionDelay: '0.15s' }}
          >
            {experience.heading.ar} <span className="text-[#C4A265]">{experience.highlight.ar}</span>
          </h2>
          <p
            className="reveal mt-4 text-base md:text-lg text-[#6B6B6B] max-w-2xl mx-auto"
            style={{ transitionDelay: '0.3s' }}
          >
            {experience.subtitle.ar}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            ref={lineRef}
            className="absolute right-6 md:right-8 top-0 bottom-0 w-0.5 origin-top"
            style={{
              backgroundColor: '#C4A265',
              transform: 'scaleY(0)',
              transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Timeline Items */}
          <div className="space-y-10 md:space-y-14">
            {experience.items.map((exp, index) => (
              <div
                key={index}
                className="timeline-item relative pr-16 md:pr-20"
                style={{
                  opacity: 0,
                  transform: 'translateX(30px)',
                  transition:
                    'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Dot */}
                <div
                  className="timeline-dot absolute right-3.5 md:right-5.5 top-2 w-5 h-5 rounded-full border-4 z-10"
                  style={{
                    backgroundColor: '#C4A265',
                    borderColor: '#F5F0EB',
                    transform: 'scale(0)',
                    opacity: 0,
                    transition:
                      'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s, box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.transform = 'scale(1.3)'
                    el.style.boxShadow = '0 0 0 8px rgba(196, 162, 101, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.transform = 'scale(1)'
                    el.style.boxShadow = 'none'
                  }}
                />

                {/* Card */}
                <div
                  className="bg-white rounded-xl p-6 md:p-7 transition-all duration-400 hover:shadow-lg"
                  style={{
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  {/* Date Badge */}
                  <span
                    className="inline-block text-xs font-medium px-4 py-1.5 rounded-full mb-4"
                    style={{
                      backgroundColor: 'rgba(196, 162, 101, 0.12)',
                      color: '#C4A265',
                    }}
                  >
                    {exp.date.ar}
                  </span>

                  {/* Title & Company */}
                  <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-1">
                    {exp.title.ar}
                  </h3>
                  <p className="text-sm md:text-base text-[#6B6B6B] mb-4">
                    {exp.company}
                  </p>

                  {/* Responsibilities */}
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp, respIndex) => (
                      <li
                        key={respIndex}
                        className="flex items-start gap-2 text-sm text-[#6B6B6B]"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: '#C4A265' }}
                        />
                        <span>{resp.ar}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
