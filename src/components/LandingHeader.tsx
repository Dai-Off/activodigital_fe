import { Button } from "./ui/button";
import { memo, useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
const logo = "/logoArkia.png";
import { useLanguage } from "./i18n/LanguageContext";
import { useTranslations } from "./i18n/useTranslations";

export const LandingHeader = memo(function Header() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = useTranslations();

  useEffect(() => {
    // Trigger animation on mount con requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showLangMenu) return;
    const handleClick = () => setShowLangMenu(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showLangMenu]);

  return (
    <header 
      role="banner"
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{ 
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 20px rgba(91, 141, 239, 0.08)',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className={`flex items-center gap-2 sm:gap-3 cursor-pointer transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
          style={{ transitionDelay: '0.1s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <img 
            src={logo} 
            alt="ARKIA - Plataforma de Gestión Inteligente de Activos Inmobiliarios" 
            className="h-12 sm:h-14 md:h-16 w-auto"
            style={{ objectFit: 'contain' }}
            loading="eager"
            fetchPriority="high"
            width="180"
            height="64"
            itemProp="logo"
          />
        </div>
        
        <div className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 transition-all duration-600 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
        style={{ transitionDelay: '0.15s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Language Selector */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); setShowLangMenu(!showLangMenu); }}
              className="rounded-full px-2 sm:px-3 md:px-4 py-1.5 md:py-2 transition-colors hover:bg-blue-50 flex items-center gap-1 sm:gap-1.5"
              style={{ 
                color: '#5B8DEF',
                fontWeight: 500
              }}
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm md:text-base">{language}</span>
            </Button>
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
                  onClick={() => { setLanguage("ES"); setShowLangMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
                  style={{ 
                    color: language === "ES" ? '#5B8DEF' : '#64748B',
                    fontWeight: language === "ES" ? 600 : 400
                  }}
                >
                  🇪🇸 Español
                </button>
                <button 
                  onClick={() => { setLanguage("EN"); setShowLangMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
                  style={{ 
                    color: language === "EN" ? '#5B8DEF' : '#64748B',
                    fontWeight: language === "EN" ? 600 : 400
                  }}
                >
                  🇬🇧 English
                </button>
                <button 
                  onClick={() => { setLanguage("FR"); setShowLangMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
                  style={{ 
                    color: language === "FR" ? '#5B8DEF' : '#64748B',
                    fontWeight: language === "FR" ? 600 : 400
                  }}
                >
                  🇫🇷 Français
                </button>
                <button 
                  onClick={() => { setLanguage("DE"); setShowLangMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-blue-50"
                  style={{ 
                    color: language === "DE" ? '#5B8DEF' : '#64748B',
                    fontWeight: language === "DE" ? 600 : 400
                  }}
                >
                  🇩🇪 Deutsch
                </button>
              </div>
            )}
          </div>

          <Button 
            variant="ghost"
            onClick={() => navigate('/login')}
            className="inline-flex rounded-full px-3 sm:px-4 md:px-5 py-1.5 md:py-2 transition-all duration-300 text-xs sm:text-sm md:text-base hover:bg-blue-50 hover:scale-105"
            style={{ 
              color: '#5B8DEF',
              fontWeight: 500,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            aria-label="Iniciar sesión en ARKIA"
          >
            {t.header.login}
          </Button>
          {/* Botón de registro temporalmente deshabilitado */}
          {/* <Button 
            onClick={() => navigate('/register')}
            className="inline-flex rounded-full px-3 sm:px-4 md:px-5 py-1.5 md:py-2 transition-all duration-300 border-0 text-xs sm:text-sm md:text-base hover:brightness-110 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{ 
              backgroundColor: '#5B8DEF', 
              color: 'white',
              fontWeight: 500,
              boxShadow: '0 4px 14px rgba(91, 141, 239, 0.3)',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            aria-label="Solicitar demo gratuita de ARKIA"
          >
            {t.header.register}
          </Button> */}
        </div>
      </div>
    </header>
  );
});
