import { Card } from "./ui/card";
import { useState, useEffect, memo } from "react";
import { TrendingUp, Bell, Zap } from "lucide-react";
import { useInView } from "./hooks/useInView";
import { useTranslations } from "./i18n/useTranslations";

export const LandingChat = memo(function ChatSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [scrollY, setScrollY] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const t = useTranslations();

  const baseMessages = [
    {
      type: "assistant",
      text: t.chat.sectionTitle,
      sender: "ARKIA"
    },
    {
      type: "user",
      text: t.chat.question1
    },
    {
      type: "assistant",
      text: t.chat.response1,
      sender: "ARKIA"
    },
    {
      type: "user",
      text: t.chat.question2
    },
    {
      type: "assistant",
      text: t.chat.response2,
      sender: "ARKIA"
    },
    {
      type: "user",
      text: t.chat.question3
    },
    {
      type: "assistant",
      text: t.chat.response3,
      sender: "ARKIA"
    }
  ];

  const messages = [...baseMessages, ...baseMessages, ...baseMessages];

  // Auto-scroll animation using requestAnimationFrame
  useEffect(() => {
    if (!isInView) return;

    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (lastTime !== 0) {
        const delta = time - lastTime;
        setScrollY((prev) => {
          const speed = 12;
          const newScroll = prev + (delta / 1000) * speed;
          const messageHeight = baseMessages.length * 100;
          if (newScroll >= messageHeight) {
            return 0;
          }
          return newScroll;
        });
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, baseMessages.length]);

  const features = [
    {
      number: "1",
      icon: Zap,
      title: t.chat.feature1Title,
      subtitle: t.chat.feature1Subtitle,
      description: t.chat.feature1Description,
      color: "#5B8DEF",
      bgColor: "#E0EDFF",
      iconColor: "#5B8DEF"
    },
    {
      number: "2",
      icon: TrendingUp,
      title: t.chat.feature2Title,
      subtitle: t.chat.feature2Subtitle,
      description: t.chat.feature2Description,
      color: "#5B8DEF",
      bgColor: "#E0EDFF",
      iconColor: "#5B8DEF"
    },
    {
      number: "3",
      icon: Bell,
      title: t.chat.feature3Title,
      subtitle: t.chat.feature3Subtitle,
      description: t.chat.feature3Description,
      color: "#5B8DEF",
      bgColor: "#E0EDFF",
      iconColor: "#5B8DEF"
    }
  ];

  return (
    <section ref={ref} className="px-4 md:px-6 py-8 sm:py-10 md:py-16 lg:py-20">
      <style>{`
        .feature-card-chat {
          transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        }

        .feature-card-chat:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(91, 141, 239, 0.16) !important;
        }

        .description-content {
          transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
        }

        .description-content.expanded {
          max-height: 500px;
          opacity: 1;
        }
        
        .chat-main-card {
          transition: transform 0.25s ease-out;
        }
        
        .chat-main-card:hover {
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .feature-card-chat:hover, .chat-main-card:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <h2 
          className={`text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight mb-2 sm:mb-3 md:mb-4 text-left lg:text-center px-2 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ color: '#5B8DEF', fontWeight: 600, lineHeight: '1.3' }}
        >
          {t.chat.sectionTitle}
        </h2>

        <p 
          className={`text-left lg:text-center mb-6 sm:mb-8 md:mb-10 lg:mb-14 max-w-3xl lg:mx-auto text-sm sm:text-base px-2 stagger-1 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
        >
          {t.chat.sectionSubtitle}
        </p>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10 items-start">
          <div
            className={`stagger-2 ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <Card 
              className="chat-main-card border-0 overflow-hidden relative rounded-[20px] lg:bg-white lg:shadow-[0_4px_24px_rgba(91,141,239,0.12)]"
              style={{
                background: 'linear-gradient(to bottom, #FFFFFF 0%, #FAFBFC 100%)',
                boxShadow: '0 8px 32px rgba(91, 141, 239, 0.15)',
                border: '1px solid rgba(91, 141, 239, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(91, 141, 239, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(91, 141, 239, 0.15)';
              }}
            >
              {/* Chat Header */}
              <div 
                className="px-4 sm:px-5 py-3 sm:py-4 border-b relative overflow-hidden lg:bg-[#5B8DEF]"
                style={{
                  background: 'linear-gradient(135deg, #5B8DEF 0%, #6B9DF7 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Patrón decorativo - solo mobile */}
                <div 
                  className="lg:hidden absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)'
                  }}
                />
                
                <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                  {/* Avatar ARKIA */}
                  <div 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 lg:bg-white lg:shadow-[0_2px_8px_rgba(0,0,0,0.1)] lg:border-0"
                    style={{ 
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F6FF 100%)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: '2px solid rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <span 
                      className="text-xs sm:text-sm lg:text-[0.85rem]"
                      style={{ 
                        color: '#5B8DEF', 
                        fontWeight: 700,
                        letterSpacing: '-0.02em'
                      }}
                    >
                      AR
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-sm sm:text-base truncate"
                      style={{ 
                        color: 'white',
                        fontWeight: 600,
                        marginBottom: '2px'
                      }}
                    >
                      ARKIA
                    </h4>
                    <p 
                      className="text-xs truncate"
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.85)'
                      }}
                    >
                      {t.chat.chatHeader}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                    <div 
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                      style={{ backgroundColor: '#4ECCA3' }}
                    />
                    <span 
                      className="text-xs hidden sm:inline"
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      {t.chat.chatStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div 
                className="p-3 sm:p-4 md:p-5 relative h-[300px] sm:h-[350px] md:h-[450px]"
                style={{ 
                  overflow: 'hidden',
                  backgroundColor: '#FAFBFC'
                }}
              >
                <div 
                  className="space-y-3.5 transition-transform"
                  style={{ 
                    transform: `translateY(-${scrollY}px)`
                  }}
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className="max-w-[85%] px-3 sm:px-4 py-2 sm:py-2.5"
                        style={{ 
                          backgroundColor: message.type === 'assistant' ? '#5B8DEF' : 'white',
                          color: message.type === 'assistant' ? 'white' : '#334155',
                          borderRadius: message.type === 'assistant' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                          boxShadow: message.type === 'assistant' 
                            ? '0 2px 8px rgba(91, 141, 239, 0.2)'
                            : '0 2px 6px rgba(0, 0, 0, 0.06)'
                        }}
                      >
                        <p 
                          className="text-xs sm:text-sm"
                          style={{ 
                            fontWeight: 400,
                            lineHeight: '1.5'
                          }}
                        >
                          {message.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div 
                className="px-3 sm:px-4 py-2.5 sm:py-3 border-t"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#E5E7EB'
                }}
              >
                <div 
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full"
                  style={{ 
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <span 
                    className="text-xs sm:text-sm flex-1 truncate"
                    style={{ 
                      color: '#9CA3AF'
                    }}
                  >
                    Escribe tu mensaje...
                  </span>
                  <div 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#5B8DEF' }}
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="relative">
            {/* Línea vertical de conexión */}
            <div 
              className="absolute left-6 lg:left-8 top-0 bottom-0 w-0.5"
              style={{ 
                backgroundColor: '#CBD5E1',
                display: 'block'
              }}
            />
            
            {/* Tarjetas */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isExpanded = expandedIndex === index;
                
                return (
                  <div
                    key={index}
                    className={`relative ${
                      isInView ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${0.2 + (index * 0.08)}s` }}
                  >
                    {/* Número en la línea */}
                    <div 
                      className="absolute left-4 lg:left-5 top-5 lg:top-6 w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 rounded-full flex items-center justify-center z-10"
                      style={{ 
                        backgroundColor: feature.color,
                        boxShadow: `0 0 0 3px ${feature.bgColor}`
                      }}
                    >
                      <span 
                        className="text-xs"
                        style={{ color: 'white', fontWeight: 600 }}
                      >
                        {feature.number}
                      </span>
                    </div>
                    
                    {/* Tarjeta */}
                    <div
                      onMouseEnter={() => setExpandedIndex(index)}
                      onMouseLeave={() => setExpandedIndex(null)}
                      className="ml-11 lg:ml-14 xl:ml-20 cursor-pointer"
                    >
                      <Card
                        className="feature-card-chat p-4 lg:p-5 xl:p-6 border-0 overflow-hidden transition-all duration-300 relative rounded-[18px] lg:rounded-[20px] lg:bg-white"
                        style={{
                          background: isExpanded 
                            ? 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FD 100%)'
                            : 'white',
                          boxShadow: isExpanded 
                            ? '0 12px 40px rgba(91, 141, 239, 0.2)'
                            : '0 4px 20px rgba(91, 141, 239, 0.1)',
                          border: '1px solid rgba(91, 141, 239, 0.08)'
                        }}
                      >
                        {/* Subtle gradient overlay en mobile */}
                        <div 
                          className="lg:hidden absolute top-0 right-0 w-16 h-16 opacity-20 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at top right, ${feature.color}40 0%, transparent 70%)`
                          }}
                        />
                        
                        <div className="flex items-start gap-2.5 lg:gap-3 xl:gap-4 relative">
                          {/* Ícono */}
                          <div
                            className="icon-wrapper flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-xl flex items-center justify-center shadow-sm lg:shadow-none lg:border-0"
                            style={{ 
                              background: `linear-gradient(135deg, ${feature.bgColor} 0%, ${feature.bgColor}CC 100%)`,
                              border: `1px solid ${feature.color}20`,
                              backgroundColor: feature.bgColor
                            }}
                          >
                            <Icon 
                              className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" 
                              style={{ 
                                color: feature.iconColor
                              }}
                              strokeWidth={2.5}
                            />
                          </div>
                          
                          {/* Contenido */}
                          <div className="flex-1 min-w-0">
                            {/* Subtítulo */}
                            <p 
                              className="mb-0.5 sm:mb-1 uppercase tracking-wide text-xs"
                              style={{ color: '#94A3D3', fontWeight: 500, letterSpacing: '0.06em' }}
                            >
                              {feature.subtitle}
                            </p>
                            
                            {/* Título */}
                            <h3 
                              className="mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg"
                              style={{ 
                                color: '#1E293B', 
                                fontWeight: 600,
                                lineHeight: '1.3'
                              }}
                            >
                              {feature.title}
                            </h3>
                            
                            {/* Descripción expandible */}
                            <div
                              className={`description-content ${isExpanded ? 'expanded' : ''}`}
                            >
                              <p 
                                className="text-xs sm:text-sm leading-relaxed"
                                style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
                              >
                                {feature.description}
                              </p>
                            </div>
                            
                            {/* Indicador de expansión - Solo visible en desktop */}
                            <div 
                              className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 hidden md:flex expand-indicator"
                              style={{ 
                                opacity: isExpanded ? 0 : 1
                              }}
                            >
                              <span 
                                className="text-xs"
                                style={{ color: feature.iconColor, fontWeight: 500 }}
                              >
                                {t.chat.hoverDetails}
                              </span>
                              <div>
                                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                                  <path d="M8 5L13 10L8 15" stroke={feature.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
