import { seo } from '@/lib/data';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-24 md:py-32 max-w-4xl mx-auto px-6">
      <Helmet>
        <title>{seo.metaDescription.ar} — Privacy Policy</title>
        <meta name="description" content={seo.metaDescription.en} />
      </Helmet>
      <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#F0EDE8' }}>
        Privacy Policy
      </h1>
      <div className="prose max-w-none" style={{ color: 'rgba(240, 237, 232, 0.7)' }}>
        <p>Privacy policy content will be added here.</p>
      </div>
    </div>
  );
}