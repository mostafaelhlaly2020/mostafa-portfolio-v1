// LanguageProvider.tsx - Provider component (separate file for react-refresh)
import { useState, useCallback, type ReactNode } from 'react';
import { LanguageContext } from './LanguageContext';

type Language = 'ar' | 'en';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};