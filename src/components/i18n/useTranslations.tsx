import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations, type Language } from './translations';

const LANGUAGE_MAP: Record<string, Language> = {
  es: 'ES',
  en: 'EN',
  'es-es': 'ES',
  'en-us': 'EN',
};

export function useTranslations() {
  const { i18n } = useTranslation();

  const language = useMemo<Language>(() => {
    const detected = (i18n.language || 'es').toLowerCase();
    return LANGUAGE_MAP[detected] ?? LANGUAGE_MAP[detected.split('-')[0]] ?? 'ES';
  }, [i18n.language]);

  return translations[language];
}
