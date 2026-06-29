import { useParams, Link } from 'react-router';
import { SectionErrorBoundary } from '@/components/layout/SectionErrorBoundary';
import Skills from '@/sections/Skills';
import { skills } from '@/lib/data';

export default function SkillsPage() {
  const { slug } = useParams();

  if (slug) {
    const skill = skills.items.find((s) => s.id === slug);
    if (!skill) return <div className="text-center py-16">Skill not found</div>;

    return (
      <SectionErrorBoundary fallback={<div>Skill detail failed to load</div>}>
        <div className="py-24 md:py-32 max-w-4xl mx-auto px-6">
          <Link to="/skills" className="inline-block mb-8 text-[#C4A265] hover:underline">
            ← Back to Skills
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#F0EDE8' }}>
            {skill.title.ar}
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(240, 237, 232, 0.7)' }}>
            {skill.description.ar}
          </p>
          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag, i) => (
              <span key={i} className="text-sm px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'rgba(240, 237, 232, 0.8)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </SectionErrorBoundary>
    );
  }

  return (
    <div className="py-24 md:py-32">
      <SectionErrorBoundary fallback={<div>Skills section failed to load</div>}>
        <Skills />
      </SectionErrorBoundary>
    </div>
  );
}