import { useState, useEffect } from 'react';

export const useDirection = () => {
  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const newDir = (mutations[0].target as HTMLElement).dir as 'rtl' | 'ltr';
      setDir((prev) => (prev !== newDir ? newDir : prev));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir'],
    });

    return () => observer.disconnect();
  }, []);

  return dir;
};