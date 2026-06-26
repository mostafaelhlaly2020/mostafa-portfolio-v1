import { SectionErrorBoundary } from '@/components/layout/SectionErrorBoundary';
import About from '@/sections/About';
import Certifications from '@/sections/Certifications';
import Contact from '@/sections/Contact';

export default function AboutPage() {
  return (
    <div className="py-24 md:py-32">
      <SectionErrorBoundary fallback={<div>About section failed to load</div>}>
        <About />
      </SectionErrorBoundary>

      <SectionErrorBoundary fallback={<div>Certifications section failed to load</div>}>
        <Certifications />
      </SectionErrorBoundary>

      <SectionErrorBoundary fallback={<div>Contact section failed to load</div>}>
        <Contact />
      </SectionErrorBoundary>
    </div>
  );
}