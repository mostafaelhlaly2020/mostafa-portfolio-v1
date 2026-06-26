import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '@/lib/data'

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal')
            elements.forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 150)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const goTo = (index: number) => {
    if (isAnimating || index === current) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % testimonials.items.length)
    }, 5000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  const next = () => goTo((current + 1) % testimonials.items.length)
  const prev = () =>
    goTo((current - 1 + testimonials.items.length) % testimonials.items.length)

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-beige py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="reveal inline-block text-sm text-[#6B6B6B] mb-4 font-medium">
            {testimonials.label.ar}
          </span>
          <h2
            className="reveal text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight"
            style={{ transitionDelay: '0.15s' }}
          >
            {testimonials.heading.ar} <span className="text-[#C4A265]">{testimonials.highlight.ar}</span>
          </h2>
          <p
            className="reveal mt-4 text-base md:text-lg text-[#6B6B6B] max-w-2xl mx-auto"
            style={{ transitionDelay: '0.3s' }}
          >
            {testimonials.subtitle.ar}
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="reveal relative" style={{ transitionDelay: '0.45s' }}>
          <div className="bg-white rounded-2xl p-8 md:p-12 relative">
            {/* Quote Icon */}
            <span
              className="text-5xl md:text-6xl font-serif leading-none block mb-6"
              style={{ color: '#C4A265' }}
            >
              &#10077;
            </span>

            {/* Testimonial Content */}
            <div className="min-h-[120px]">
              <p
                key={current}
                className="text-base md:text-lg text-[#1A1A1A] leading-relaxed mb-8"
                style={{
                  animation: 'fadeIn 0.5s ease-in-out',
                }}
              >
                {testimonials.items[current].text.ar}
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: '#C4A265' }}
              >
                {testimonials.items[current].name.ar.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-[#1A1A1A]">
                  {testimonials.items[current].name.ar}
                </h4>
                <p className="text-sm text-[#6B6B6B]">
                  {testimonials.items[current].role.ar}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#2D2D2D' }}
              aria-label="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2 mx-4">
              {testimonials.items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? '24px' : '8px',
                    backgroundColor: i === current ? '#C4A265' : '#D1D1D1',
                  }}
                  aria-label={`شهادة ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: '#2D2D2D' }}
              aria-label="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Company Marquee */}
      <div className="mt-20 overflow-hidden">
        <div className="marquee-track">
          {[...testimonials.companies, ...testimonials.companies].map((company, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-8 md:mx-12"
            >
              <span
                className="text-xl md:text-2xl font-bold whitespace-nowrap"
                style={{ color: 'rgba(26, 26, 26, 0.2)' }}
              >
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
