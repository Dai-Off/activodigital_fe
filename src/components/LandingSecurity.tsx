import { Card } from "./ui/card";
import { useState, useEffect, memo } from "react";
import { useInView } from "./hooks/useInView";
import { useTranslations } from "./i18n/useTranslations";

export const LandingSecurity = memo(function SecuritySection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations();

  const cards = [
    {
      number: "1",
      title: t.security.security1Title,
      subtitle: t.security.sectionSubtitle,
      description: t.security.security1Description,
      color: "#5B8DEF"
    },
    {
      number: "2",
      title: t.security.security2Title,
      subtitle: t.security.sectionSubtitle,
      description: t.security.security2Description,
      color: "#4ECCA3"
    },
    {
      number: "3",
      title: t.security.security3Title,
      subtitle: t.security.sectionSubtitle,
      description: t.security.security3Description,
      color: "#8B7FD6"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 12000);
    
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <section ref={ref} className="px-4 md:px-6 py-8 sm:py-10 md:py-16 lg:py-20 overflow-hidden">
      <style>{`
        .security-card {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-button {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dot-indicator {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <p 
          className={`text-left lg:text-center mb-2 sm:mb-3 text-xs tracking-widest uppercase px-2 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ color: '#94A3D3', fontWeight: 500, letterSpacing: '0.12em' }}
        >
          {t.security.sectionTitle.toUpperCase()}
        </p>
        
        <h2 
          className={`text-left lg:text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-lg sm:text-xl md:text-2xl lg:text-3xl px-2 stagger-1 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ color: '#1E293B', fontWeight: 600, lineHeight: '1.3' }}
        >
          {t.security.sectionSubtitle}
        </h2>
        
        {/* Stacked Deck Carousel */}
        <div className="relative mx-auto max-w-3xl h-[320px] xs:h-[340px] sm:h-[360px] md:h-[380px]">
          <div className="relative w-full h-full flex items-center justify-center">
            {cards.map((card, index) => {
              const isActive = index === activeIndex;
              const isPrev = index === (activeIndex - 1 + cards.length) % cards.length;
              const isNext = index === (activeIndex + 1) % cards.length;
              
              // Only render active and adjacent cards
              if (!isActive && !isPrev && !isNext) return null;
              
              // Calculate position based on card state
              let transform = '';
              let opacity = 1;
              let zIndex = 10;
              
              if (isActive) {
                transform = 'translateX(0) scale(1)';
                opacity = 1;
                zIndex = 30;
              } else if (isNext) {
                transform = 'translateX(200px) scale(0.88)';
                opacity = 0.35;
                zIndex = 20;
              } else if (isPrev) {
                transform = 'translateX(-200px) scale(0.88)';
                opacity = 0.35;
                zIndex = 10;
              }
              
              return (
                <div
                  key={index}
                  className={`security-card absolute ${isActive ? 'active-card' : ''}`}
                  style={{
                    transform,
                    opacity,
                    zIndex,
                    width: '100%',
                    padding: '0 8px',
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                >
                  <Card 
                    className="p-5 sm:p-6 md:p-8 border-0 mx-auto"
                    style={{ 
                      backgroundColor: 'white',
                      boxShadow: isActive 
                        ? '0 20px 60px rgba(91, 141, 239, 0.32)'
                        : '0 12px 35px rgba(91, 141, 239, 0.18)',
                      borderRadius: '18px',
                      maxWidth: '680px'
                    }}
                  >
                    <div className="text-left">
                      {/* Subtitle */}
                      <p 
                        className="mb-1.5 md:mb-2 uppercase tracking-wide"
                        style={{ color: '#94A3D3', fontWeight: 500, letterSpacing: '0.1em', fontSize: '0.7rem' }}
                      >
                        {card.subtitle}
                      </p>
                      
                      {/* Title */}
                      <h3 
                        className="mb-2.5 md:mb-3 text-lg md:text-xl lg:text-2xl"
                        style={{ 
                          color: '#1E293B', 
                          fontWeight: 600
                        }}
                      >
                        {card.title}
                      </h3>
                      
                      {/* Description */}
                      <p 
                        className="text-xs md:text-sm lg:text-base leading-relaxed"
                        style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
                      >
                        {card.description}
                      </p>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-center items-center gap-3 md:gap-4 mt-6 md:mt-8">
          {/* Previous button */}
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)}
            className="nav-button w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(91, 141, 239, 0.15)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="md:w-5 md:h-5">
              <path d="M12 15L7 10L12 5" stroke="#5B8DEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Dots */}
          <div className="flex gap-2 md:gap-3">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className="dot-indicator w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                style={{
                  backgroundColor: index === activeIndex ? '#5B8DEF' : '#CBD5E1',
                  transform: index === activeIndex ? 'scale(1.2)' : 'scale(1)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
          
          {/* Next button */}
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % cards.length)}
            className="nav-button w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(91, 141, 239, 0.15)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="md:w-5 md:h-5">
              <path d="M8 5L13 10L8 15" stroke="#5B8DEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
});
