import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionErrorBoundary } from '@/components/layout/SectionErrorBoundary';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Skills from '@/sections/Skills';
import Experience from '@/sections/Experience';
import Certifications from '@/sections/Certifications';
import Testimonials from '@/sections/Testimonials';
import Contact from '@/sections/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const headerEls = entry.target.querySelectorAll('.reveal');
            headerEls.forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section');

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { y: 80, opacity: 0 },
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
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative z-10">
      <Hero />

      <div className="reveal-section relative z-10">
        <SectionErrorBoundary fallback={<div className="py-16 text-center text-gray-500">About section failed to load</div>}>
          <About />
        </SectionErrorBoundary>
      </div>

      <div className="reveal-section relative z-20">
        <SectionErrorBoundary fallback={<div className="py-16 text-center text-gray-500">Skills section failed to load</div>}>
          <Skills />
        </SectionErrorBoundary>
      </div>

      <div className="reveal-section relative z-30">
        <SectionErrorBoundary fallback={<div className="py-16 text-center text-gray-500">Experience section failed to load</div>}>
          <Experience />
        </SectionErrorBoundary>
      </div>

      <div className="reveal-section relative z-40">
        <SectionErrorBoundary fallback={<div className="py-16 text-center text-gray-500">Certifications section failed to load</div>}>
          <Certifications />
        </SectionErrorBoundary>
      </div>

      <div className="reveal-section relative z-50">
        <SectionErrorBoundary fallback={<div className="py-16 text-center text-gray-500">Testimonials section failed to load</div>}>
          <Testimonials />
        </SectionErrorBoundary>
      </div>

      <div className="reveal-section relative z-[60]">
        <SectionErrorBoundary fallback={<div className="py-16 text-center text-gray-500">Contact section failed to load</div>}>
          <Contact />
        </SectionErrorBoundary>
      </div>
    </div>
  );
}