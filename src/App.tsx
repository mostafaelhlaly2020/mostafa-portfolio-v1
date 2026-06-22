import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './sections/Preloader'
import Hero from './sections/Hero'
import BottomNav from './sections/BottomNav'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Certifications from './sections/Certifications'
import Testimonials from './sections/Testimonials'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    // Global scroll reveal setup for section transitions
    // This creates the "sections sliding up from below" effect
    const sections = document.querySelectorAll('.reveal-section')

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div dir="rtl" lang="ar" className="relative">
      {/* Preloader */}
      <Preloader />

      {/* Fixed Bottom Navigation */}
      <BottomNav />

      {/* Main Content */}
      <main className="relative">
        {/* Hero - always first, no reveal animation */}
        <Hero />

        {/* About Section */}
        <div className="reveal-section relative z-10">
          <About />
        </div>

        {/* Skills Section - Dark */}
        <div className="reveal-section relative z-20">
          <Skills />
        </div>

        {/* Experience Section */}
        <div className="reveal-section relative z-30">
          <Experience />
        </div>

        {/* Certifications Section */}
        <div className="reveal-section relative z-40">
          <Certifications />
        </div>

        {/* Testimonials Section */}
        <div className="reveal-section relative z-50">
          <Testimonials />
        </div>

        {/* Contact Section */}
        <div className="reveal-section relative z-[60]">
          <Contact />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}
