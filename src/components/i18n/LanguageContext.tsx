import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'ES' | 'EN' | 'FR' | 'DE';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const titlesByLanguage = {
  ES: 'ARKIA - Gestión Global de Activos Inmobiliarios',
  EN: 'ARKIA - Global Real Estate Asset Management',
  FR: 'ARKIA - Gestion Globale des Actifs Immobiliers',
  DE: 'ARKIA - Globales Immobilienverwaltung'
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to ES
    const saved = localStorage.getItem('arkia-language') as Language;
    return saved || 'ES';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('arkia-language', lang);
    // Update document title
    document.title = titlesByLanguage[lang];
    // Update HTML lang attribute for SEO
    document.documentElement.lang = lang.toLowerCase();
    // Trigger storage event for SEO component
    window.dispatchEvent(new Event('storage'));
  };

  // Update title and lang attribute on mount
  useEffect(() => {
    document.title = titlesByLanguage[language];
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
