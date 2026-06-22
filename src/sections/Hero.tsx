import { useEffect, useRef } from 'react'
import { ArrowUpLeft } from 'lucide-react'
import gsap from 'gsap'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      tl.to(statusRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        .to(
          nameRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .to(
          imageRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
          },
          '-=0.8'
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #E6E2DD 0%, #D8D4CF 100%)' }}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Left: Status */}
          <div
            ref={statusRef}
            className="flex items-center gap-3 opacity-0 translate-y-4"
          >
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot"></span>
              <span className="text-sm font-medium text-[#1A1A1A]">
                متاح للعمل
              </span>
            </div>
          </div>

          {/* Right: CTA */}
          <a
            ref={ctaRef}
            href="#contact"
            onClick={scrollToContact}
            className="flex items-center gap-2 opacity-0 translate-y-4 text-[#1A1A1A] hover:text-[#C4A265] transition-colors duration-300 group"
          >
            <span className="text-sm font-semibold">تواصل معي</span>
            <ArrowUpLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-1" />
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-24">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-right">
            <h1
              ref={nameRef}
              className="opacity-0 translate-y-8 text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1A1A1A] leading-tight tracking-tight"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              مصطفى
              <br />
              السيد
            </h1>
            <p
              ref={titleRef}
              className="opacity-0 translate-y-6 mt-6 text-xl md:text-2xl text-[#6B6B6B] font-light"
            >
              خبير تسويق رقمي واستشارات عقارية
            </p>
          </div>

          {/* Portrait Image */}
          <div
            ref={imageRef}
            className="opacity-0 translate-x-12 order-1 lg:order-2 flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="w-64 h-80 md:w-80 md:h-[28rem] lg:w-96 lg:h-[32rem] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/hero-portrait.png"
                  alt="مصطفى السيد"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[#C4A265]/30 rounded-2xl -z-10"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#C4A265]/10 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
