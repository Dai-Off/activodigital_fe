import { Mail, MapPin } from "lucide-react";
const logo = "/logoArkia.png";
import { PrivacyModal, TermsModal, CookiesModal } from "./LegalModals";
import { useTranslation } from "react-i18next";

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer
      role="contentinfo"
      aria-label={t("accessibilityLabel")}
      className="relative bg-gradient-to-b from-white to-gray-50 pt-10 sm:pt-12 md:pt-14 lg:pt-16 pb-6 sm:pb-8 px-4 md:px-6 border-t border-gray-100"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <style>{`
        .footer-link {
          transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .footer-link:hover {
          color: #5B8DEF;
          transform: translateX(2px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr] gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Column */}
          <div>
            <div>
              <img 
                src={logo} 
                alt="ARKIA - Plataforma de Gestión Inteligente de Activos Inmobiliarios" 
                className="h-24 sm:h-28 md:h-32 lg:h-40 w-auto"
                style={{ objectFit: 'contain' }}
                loading="lazy"
                width="200"
                height="160"
                itemProp="logo"
              />
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#1E293B', fontWeight: 600 }}>
              {t("contactUs")}
            </h3>
            <ul className="space-y-3 sm:space-y-4" itemScope itemType="https://schema.org/Organization">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: '#5B8DEF' }} aria-hidden="true" />
                <address className="text-xs sm:text-sm leading-relaxed not-italic" style={{ color: '#64748B' }} itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="streetAddress">Paseo de la Castellana 130</span><br />
                  <span itemProp="addressLocality">Madrid</span>, <span itemProp="postalCode">28046</span>
                </address>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#5B8DEF' }} aria-hidden="true" />
                <a 
                  href="mailto:gestion@arkialabs.es"
                  className="text-xs sm:text-sm hover:underline break-all"
                  style={{ color: '#64748B' }}
                  itemProp="email"
                  aria-label={t("contactEmailAria")}
                >
                  gestion@arkialabs.es
                </a>
              </li>
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h3 className="mb-4 text-sm sm:text-base" style={{ color: '#1E293B' }}>
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              <li>
                <PrivacyModal 
                  trigger={
                    <button 
                      className="text-sm footer-link block text-left cursor-pointer"
                      style={{ color: '#64748B', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
                    >
                      {t("privacyPolicy")}
                    </button>
                  }
                />
              </li>
              <li>
                <TermsModal 
                  trigger={
                    <button 
                      className="text-sm footer-link block text-left cursor-pointer"
                      style={{ color: '#64748B', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
                    >
                      {t("termsOfUse")}
                    </button>
                  }
                />
              </li>
              <li>
                <CookiesModal 
                  trigger={
                    <button 
                      className="text-sm footer-link block text-left cursor-pointer"
                      style={{ color: '#64748B', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
                    >
                      {t("cookies")}
                    </button>
                  }
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex justify-center md:justify-start">
            <p className="text-sm text-center md:text-left" style={{ color: '#94A3B8' }}>
              {t("rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

