import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { useState, useEffect, memo, useMemo } from "react";
const buildingImg = "/heroBuilding.png";
import { useTranslations } from "./i18n/useTranslations";

const LiveStatsCard = memo(({ isMobile, liveLabel, liveTitle, liveDescription }: { isMobile: boolean; liveLabel: string; liveTitle: string; liveDescription: string }) => (
  <Card 
    className={`border-0 backdrop-blur-xl relative overflow-hidden transition-all duration-500 hover:translate-y-[-3px] hover:scale-[1.02] ${
      isMobile ? 'p-3' : 'p-5'
    }`}
    style={{ 
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      boxShadow: isMobile ? '0 6px 24px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.3)',
      borderRadius: isMobile ? '14px' : '18px',
      minWidth: 'auto',
      width: '100%',
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = isMobile ? '0 8px 28px rgba(0, 0, 0, 0.4)' : '0 10px 36px rgba(0, 0, 0, 0.4)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = isMobile ? '0 6px 24px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.3)';
    }}
  >
    <div className="relative">
      <div className={`flex items-center ${isMobile ? 'gap-1.5 mb-1' : 'gap-2 mb-2'}`}>
        <div className="flex items-center gap-1.5">
          <div
            className={`rounded-full pulse-dot ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
            style={{ backgroundColor: '#4ECCA3' }}
          />
          <span className={`uppercase tracking-wider ${isMobile ? 'text-[9px]' : 'text-xs'}`} style={{ color: '#4ECCA3', fontWeight: 600 }}>
            {liveLabel}
          </span>
        </div>
      </div>
      
      <div className={isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1'} style={{ color: '#E0EDFF', fontWeight: 600 }}>
        {liveTitle}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={`leading-tight ${isMobile ? 'text-[9px]' : 'text-xs'}`} style={{ color: '#94A3D3', fontWeight: 400 }}>
          {liveDescription}
        </span>
      </div>
    </div>
  </Card>
));

export const LandingHero = memo(function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    // Usar requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    });
  }, []);

  const badges = useMemo(() => [
    t.hero.badge1,
    t.hero.badge2,
    t.hero.badge3
  ], [t.hero.badge1, t.hero.badge2, t.hero.badge3]);

  return (
    <section className="relative px-4 md:px-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-10 sm:pb-14 md:pb-20 lg:pb-32">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="relative">
            {/* Mobile Building Image */}
            <div className={`lg:hidden mb-8 sm:mb-10 transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div className="relative" style={{ height: '280px' }}>
                <img
                  src={buildingImg}
                  alt="ARKIA Building"
                  className="w-full h-full object-contain"
            loading="eager"
            fetchPriority="high"
                />
                
                <div style={{ 
                  position: 'absolute',
                  bottom: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  maxWidth: '75%',
                  width: '100%',
                  zIndex: 30
                }}>
                  <LiveStatsCard isMobile={true} liveLabel={t.hero.liveLabel} liveTitle={t.hero.liveTitle} liveDescription={t.hero.liveDescription} />
                </div>
              </div>
            </div>
            
            {/* Title */}
            <h1 
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-3 sm:mb-4 md:mb-5 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ color: '#1E293B', fontWeight: 600, lineHeight: '1.2', transitionDelay: '0.15s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              itemProp="name headline"
            >
              {t.hero.title}
            </h1>
            
            {/* Description */}
            <p 
              className={`mb-4 sm:mb-5 md:mb-7 max-w-xl text-sm sm:text-base transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.65', transitionDelay: '0.25s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              itemProp="description"
            >
              {t.hero.description}
            </p>
            
            {/* Badges - Desktop only */}
            <div className={`hidden lg:flex flex-wrap gap-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '0.35s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              {badges.map((badge) => (
                <Badge 
                  key={badge}
                  variant="secondary" 
                  className="px-4 py-2 rounded-full text-sm"
                  style={{ 
                    backgroundColor: '#E0EDFF',
                    color: '#5B8DEF',
                    fontWeight: 500,
                    border: 'none'
                  }}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Desktop Building Image with Card */}
          <div className={`relative hidden lg:block transition-all duration-800 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-96'
          }`}
          style={{ transitionDelay: '0.2s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className="relative" style={{ height: '600px' }}>
              <img
                src={buildingImg}
                alt="ARKIA Building"
                className="w-full h-full object-contain"
            loading="eager"
            fetchPriority="high"
              />
              
              <div style={{ 
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '90%',
                width: '100%',
                zIndex: 30
              }}>
                <LiveStatsCard isMobile={false} liveLabel={t.hero.liveLabel} liveTitle={t.hero.liveTitle} liveDescription={t.hero.liveDescription} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
