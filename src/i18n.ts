import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Importas los archivos JSON que acabamos de crear
import esTranslations from './locales/es.json';
import enTranslations from './locales/en.json';

// Recursos de traducción básicos
const resources = {
  es: {
    translation: {
      ...esTranslations,
    }
  },
  en: {
    translation: {
      ...enTranslations,
    } 
  }
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto
    debug: false,
    
    interpolation: {
      escapeValue: false // React ya escapa los valores
    },
    
    detection: {
      // Opciones de detección de idioma
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;

