import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { PrivacyModal, CookiesModal } from "./LegalModals";
import { useTranslations } from "./i18n/useTranslations";

export function LandingCookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl animate-slide-in-right"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(91, 141, 239, 0.2)',
        border: '1px solid rgba(91, 141, 239, 0.15)',
        animation: 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-110"
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" style={{ color: '#64748B' }} />
      </button>

      <div className="pr-8">
        <p className="text-sm mb-4" style={{ color: '#334155', lineHeight: '1.6' }}>
          {t.cookies.message}{" "}
          <PrivacyModal 
            trigger={
              <button 
                className="underline transition-colors hover:no-underline cursor-pointer"
                style={{ color: '#5B8DEF', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
              >
                {t.cookies.privacy}
              </button>
            }
          />
          {" "}{t.cookies.and}{" "}
          <CookiesModal 
            trigger={
              <button 
                className="underline transition-colors hover:no-underline cursor-pointer"
                style={{ color: '#5B8DEF', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
              >
                {t.cookies.cookiePolicy}
              </button>
            }
          />
          .
        </p>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleAccept}
            className="rounded-full px-5 py-2 text-sm border-0 transition-all hover:brightness-110 active:scale-95"
            style={{
              backgroundColor: '#5B8DEF',
              color: 'white',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(91, 141, 239, 0.3)'
            }}
          >
            {t.cookies.accept}
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            className="rounded-full px-5 py-2 text-sm transition-colors hover:bg-blue-50"
            style={{
              color: '#5B8DEF',
              fontWeight: 500
            }}
          >
            {t.cookies.reject}
          </Button>
        </div>
      </div>
    </div>
  );
}
