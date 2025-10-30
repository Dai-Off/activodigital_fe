import { Shield } from "lucide-react";
import { memo } from "react";
import { useInView } from "./hooks/useInView";
import { useTranslations } from "./i18n/useTranslations";

export const LandingCompliance = memo(function ComplianceSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const t = useTranslations();
  
  return (
    <section ref={ref} className="px-4 md:px-6 py-10 sm:py-12 md:py-14 lg:py-16" style={{ backgroundColor: '#F8F9FD' }}>
      <div className="max-w-6xl mx-auto">
        <div 
          className={`rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] p-5 sm:p-6 md:p-8 lg:p-12 transition-all duration-500 hover:translate-y-[-3px] hover:scale-[1.01] ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ 
            backgroundColor: 'white',
            border: '1px solid rgba(91, 141, 239, 0.12)',
            boxShadow: '0 2px 16px rgba(91, 141, 239, 0.08)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(91, 141, 239, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 16px rgba(91, 141, 239, 0.08)';
          }}
        >
          <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mb-5 sm:mb-6">
            <div 
              className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl flex-shrink-0"
              style={{ 
                backgroundColor: 'rgba(91, 141, 239, 0.1)',
              }}
            >
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#5B8DEF' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 
                className="text-lg sm:text-xl lg:text-2xl mb-1.5 sm:mb-2" 
                style={{ color: '#1E293B', fontWeight: 600 }}
              >
                {t.compliance.sectionTitle}
              </h2>
              <p 
                className="text-sm sm:text-base"
                style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
              >
                {t.compliance.sectionSubtitle}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"
                style={{ backgroundColor: '#5B8DEF' }}
              />
              <div className="flex-1 min-w-0">
                <p 
                  className="text-xs sm:text-sm lg:text-base"
                  style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.7' }}
                >
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{t.compliance.compliance1Title}</span> - {t.compliance.compliance1Description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"
                style={{ backgroundColor: '#5B8DEF' }}
              />
              <div className="flex-1 min-w-0">
                <p 
                  className="text-xs sm:text-sm lg:text-base"
                  style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.7' }}
                >
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{t.compliance.compliance2Title}</span> - {t.compliance.compliance2Description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
