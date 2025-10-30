import { Card } from "./ui/card";
import { memo } from "react";
import { useInView } from "./hooks/useInView";
import { useTranslations } from "./i18n/useTranslations";

export const LandingHowItWorks = memo(function HowItWorksSection() {
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 });
  const t = useTranslations();

  const steps = [
    {
      number: "01",
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Description,
      color: "#5B8DEF"
    },
    {
      number: "02",
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Description,
      color: "#4ECCA3"
    },
    {
      number: "03",
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Description,
      color: "#5B8DEF"
    },
    {
      number: "04",
      title: t.howItWorks.step4Title,
      description: t.howItWorks.step4Description,
      color: "#4ECCA3"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="px-4 md:px-6 py-10 sm:py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <style>{`
        .step-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .step-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(91, 141, 239, 0.18) !important;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left lg:text-center mb-8 sm:mb-10 md:mb-14 lg:mb-16">
          <h2 
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4 px-2 lg:px-0 ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ color: '#1E293B', fontWeight: 600 }}
          >
            {t.howItWorks.sectionTitle}
          </h2>

          <p
            className={`text-sm sm:text-base max-w-3xl lg:mx-auto leading-relaxed px-2 lg:px-0 stagger-1 ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
          >
            {t.howItWorks.sectionSubtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {steps.map((step, index) => {
            return (
              <div
                key={index}
                className={isInView ? 'animate-fade-in-up' : 'opacity-0'}
                style={{ animationDelay: `${0.15 + index * 0.08}s` }}
              >
                <Card 
                  className="step-card p-4 sm:p-5 border-0 h-full flex flex-col"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    boxShadow: '0 3px 16px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Number Circle */}
                  <div 
                    className="number-circle flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4"
                    style={{ 
                      backgroundColor: `${step.color}15`,
                      border: `2px solid ${step.color}`
                    }}
                  >
                    <span 
                      className="tracking-tight text-sm sm:text-base"
                      style={{ 
                        color: step.color,
                        fontWeight: 700
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    className="mb-1.5 sm:mb-2 text-sm sm:text-base"
                    style={{ 
                      color: '#1E293B',
                      fontWeight: 600,
                      lineHeight: '1.3'
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p 
                    className="leading-relaxed text-xs sm:text-sm"
                    style={{ 
                      color: '#64748B',
                      fontWeight: 400,
                      lineHeight: '1.6',
                      fontSize: '0.8125rem'
                    }}
                  >
                    {step.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
});
