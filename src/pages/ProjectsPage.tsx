import { useParams, Link } from 'react-router';
import { SectionErrorBoundary } from '@/components/layout/SectionErrorBoundary';
import { projects } from '@/lib/data';

interface ProjectItem {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
}

export default function ProjectsPage() {
  const { slug } = useParams();

  if (slug) {
    const project = (projects.items as unknown as ProjectItem[]).find((p) => p.id === slug);
    if (!project) return <div className="text-center py-16">Project not found</div>;

    return (
      <SectionErrorBoundary fallback={<div>Project detail failed to load</div>}>
        <div className="py-24 md:py-32 max-w-4xl mx-auto px-6">
          <Link to="/projects" className="inline-block mb-8 text-[#C4A265] hover:underline">
            ← Back to Projects
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#F0EDE8' }}>
            {project.title.ar}
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(240, 237, 232, 0.7)' }}>
            {project.description.ar}
          </p>
        </div>
      </SectionErrorBoundary>
    );
  }

  return (
    <div className="py-24 md:py-32">
      <SectionErrorBoundary fallback={<div>Projects section failed to load</div>}>
        <div>Projects Index - Coming Soon</div>
      </SectionErrorBoundary>
    </div>
  );
}