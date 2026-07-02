import { ArrowUpLeft } from 'lucide-react'
import { hero } from '@/lib/data'
import Typewriter from '@/components/animations/Typewriter'
import SpotlightBorder from '@/components/animations/SpotlightBorder'

export default function Hero() {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      style={{ background: hero.backgroundGradient }}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Left: Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot"></span>
              <span className="text-sm font-medium text-[#1A1A1A]">
                {hero.status.ar}
              </span>
            </div>
          </div>

          {/* Right: CTA with spotlight border */}
          <SpotlightBorder className="inline-block">
            <a
              href="#contact"
              onClick={scrollToContact}
              className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#C4A265] transition-colors duration-300 group"
            >
              <span className="text-sm font-semibold">{hero.cta.ar}</span>
              <ArrowUpLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-1" />
            </a>
          </SpotlightBorder>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-24">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-right">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1A1A1A] leading-tight tracking-tight"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              <Typewriter
                text={hero.name.ar}
                delay={0.5}
                className="whitespace-pre-line"
              />
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-[#6B6B6B] font-light">
              {hero.title.ar}
            </p>
          </div>

          {/* Portrait Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-64 h-80 md:w-80 md:h-[28rem] lg:w-96 lg:h-[32rem] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={hero.portraitImage}
                  alt={hero.portraitAlt.ar}
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
