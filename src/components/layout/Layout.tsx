import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { LanguageProvider } from '@/contexts/LanguageProvider';
import { useLanguage } from '@/contexts/LanguageContext';
import Preloader from '@/sections/Preloader';
import BottomNav from '@/sections/BottomNav';
import Footer from '@/sections/Footer';

const LayoutInner = () => {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'ar' ? 'ar-EG' : 'en';
  }, [language]);

  const isInitialLoad = location.pathname === '/';

  return (
    <div className="relative min-h-screen">
      {isInitialLoad && <Preloader />}
      <BottomNav />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function Layout() {
  return (
    <LanguageProvider>
      <LayoutInner />
    </LanguageProvider>
  );
}