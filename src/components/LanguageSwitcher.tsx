import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('arkia-language', lng.toUpperCase());
    setShowLangMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!showLangMenu) return;
    const handleClick = () => setShowLangMenu(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showLangMenu]);

  const getCurrentLanguage = () => {
    const lang = (i18n.language || 'es').split('-')[0].toUpperCase();
    return lang === 'ES' || lang === 'EN' ? lang : 'ES';
  };

  return (
    <div 
      className="relative" 
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.key === 'Escape' && e.stopPropagation()}
      role="presentation"
    >
      <button
        onClick={(e) => { e.stopPropagation(); setShowLangMenu(!showLangMenu); }}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors hover:bg-blue-50"
        style={{ 
          color: '#5B8DEF',
          fontWeight: 500
        }}
        aria-label="Seleccionar idioma"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{getCurrentLanguage()}</span>
      </button>
      {showLangMenu && (
        <div 
          className="absolute right-0 mt-2 rounded-xl border-0 p-1 z-50"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(91, 141, 239, 0.15)',
            border: '1px solid rgba(91, 141, 239, 0.1)',
            minWidth: '150px'
          }}
        >
          <button 
            onClick={() => changeLanguage('es')}
            className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
            style={{ 
              color: i18n.language === 'es' ? '#5B8DEF' : '#64748B',
              fontWeight: i18n.language === 'es' ? 600 : 400
            }}
          >
            🇪🇸 Español
          </button>
          <button 
            onClick={() => changeLanguage('en')}
            className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
            style={{ 
              color: i18n.language === 'en' ? '#5B8DEF' : '#64748B',
              fontWeight: i18n.language === 'en' ? 600 : 400
            }}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
