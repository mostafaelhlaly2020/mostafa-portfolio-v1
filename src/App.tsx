import { Routes, Route } from 'react-router';
import Layout from '@/components/layout/Layout';
import LandingPage from '@/pages/LandingPage';
import AboutPage from '@/pages/AboutPage';
import SkillsPage from '@/pages/SkillsPage';
import ProjectsPage from '@/pages/ProjectsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';
import CookiesPage from '@/pages/CookiesPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:slug" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
      </Route>
    </Routes>
  );
}