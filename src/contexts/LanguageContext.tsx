import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'ES' | 'EN' | 'FR' | 'DE' | 'PT';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n, t: i18nT } = useTranslation();
  
  // Obtener idioma inicial de i18n o localStorage
  const getInitialLanguage = (): Language => {
    const stored = localStorage.getItem('arkia-language');
    if (stored && ['ES', 'EN', 'FR', 'DE', 'PT'].includes(stored)) {
      return stored as Language;
    }
    const i18nLang = (i18n.language || 'es').split('-')[0].toUpperCase();
    return (i18nLang === 'ES' || i18nLang === 'EN') ? (i18nLang as Language) : 'ES';
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  // Sincronizar con i18n cuando cambia
  useEffect(() => {
    const currentLang = (i18n.language || 'es').split('-')[0].toUpperCase() as Language;
    if (currentLang === 'ES' || currentLang === 'EN') {
      if (language !== currentLang) {
        setLanguage(currentLang);
      }
    }
  }, [i18n.language, language]);

  // Función de traducción que primero intenta usar i18n, luego devuelve el defaultValue
  const t = (key: string, defaultValue?: string): string => {
    const translated = i18nT(key);
    // Si i18n devuelve la misma key (no encontró traducción), usar defaultValue
    if (translated === key && defaultValue) {
      return defaultValue;
    }
    return translated;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    // Sincronizar con i18n
    const i18nCode = lang.toLowerCase();
    if (i18nCode === 'es' || i18nCode === 'en') {
      i18n.changeLanguage(i18nCode);
      localStorage.setItem('arkia-language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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

