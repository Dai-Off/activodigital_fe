import { Card } from "./ui/card";
import { CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { useInView } from "./hooks/useInView";
const assetSummaryImg = "/assetSummary.png";
import { useTranslations } from "./i18n/useTranslations";

export const LandingFeatures = memo(function FeaturesSection() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const t = useTranslations();
  
  // En móvil iniciar en slide 1 (documents), en desktop en slide 0
  const [currentTableSlide, setCurrentTableSlide] = useState(typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 0);
  const [cardPoints, setCardPoints] = useState([0, 0, 0]);
  
  const tableSlides = [
    {
      type: "asset-summary",
      title: "Resumen del Activo",
      image: assetSummaryImg
    },
    {
      type: "documents",
      title: "Repositorio Documental",
      documents: [
        { name: "Manual HVAC Sistema Principal", version: "Versión 2.1", category: "Manual", categoryColor: "#5B8DEF", system: "HVAC", date: "15/03/2024", status: "complete" },
        { name: "Certificado Eficiencia Energética", version: "CEE-2048-001", category: "Certificado", categoryColor: "#4ECCA3", system: "General", date: "01/04/2024", status: "complete" },
        { name: "Planos As-Built Estructura", version: "EST-AB-2024.dwg", category: "As-Built", categoryColor: "#A78BFA", system: "Estructura", date: "20/02/2024", status: "pending" }
      ]
    },
    {
      type: "maintenance",
      title: "Plan de Mantenimiento",
      calendar: {
        month: "Mayo 2024",
        tasks: [
          { name: "Revisión ascensor principal", type: "Programada", date: "24", month: "Mayo", status: "Programado" },
          { name: "Limpieza filtros HVAC", type: "Preventiva", date: "5", month: "Junio", status: "Programado" },
          { name: "Inspección sistema PCI", type: "Obligatoria", date: "12", month: "Junio", status: "Programado" },
          { name: "Mantenimiento", type: "General", date: "3", month: "Julio", status: "Pendiente" }
        ]
      },
      tasksList: [
        { name: "Revisión ascensor principal", subtitle: "Sistema AS-01 • Edificio A", status: "urgent", dueDate: "Vence en 5 días" },
        { name: "Limpieza filtros HVAC", subtitle: "Climatización • Edificios HVAC1", status: "in-progress", dueDate: "En progreso" },
        { name: "Inspección sistema PCI", subtitle: "Sistema PCI-1 • Cobertura 7/8A", status: "programmed", dueDate: "Programado para 22/05" }
      ]
    },
    {
      type: "compliance",
      title: "Cumplimiento Normativo",
      certificates: [
        { name: "Certificado CEE", status: "No certificado", statusColor: "#4ECCA3", expiry: "15/02/2034", calification: "B" },
        { name: "Revisión RITE", status: "Programar Renovación", statusColor: "#F59E0B", expiry: "08/01/2024", type: "Instalación climatización" },
        { name: "Industria BT", status: "No incluido", statusColor: "#4ECCA3", expiry: "15/05/2027", installation: "ELECT-2024-001" },
        { name: "Ascensor", status: "Caducado/Urgente", statusColor: "#EF4444", expiry: "15/02/2023", type: "Revisión ordinaria" },
        { name: "PCI", status: "Vigente", statusColor: "#4ECCA3", expiry: "08/12/2024", maintenance: "ITV-SAMU-001" },
        { name: "Acreditabilidad", status: "Completar evaluación", statusColor: "#F59E0B", expiry: "", normative: "CTE-ISI-4A" }
      ],
      timeline: [
        { name: "Revisión ascensor - URGENTE", date: "Vencimiento: 15 de abril de 2024", daysLeft: "3 días", urgency: "urgent" },
        { name: "Inspección RITE", date: "Vencimiento: 02 de mayo de 2024", daysLeft: "1 mes", urgency: "warning" },
        { name: "Revisión PCI", date: "Vencimiento: 08 de noviembre de 2024", daysLeft: "7 meses", urgency: "normal" },
        { name: "Renovación CEE", date: "Vencimiento: 15 de marzo de 2034", daysLeft: "10 años", urgency: "ok" }
      ]
    }
  ];
  
  const featureCards = [
    { 
      title: t.features.card1Title, 
      points: [
        t.features.card1Point1,
        t.features.card1Point2,
        t.features.card1Point3
      ]
    },
    { 
      title: t.features.card2Title, 
      points: [
        t.features.card2Point1,
        t.features.card2Point2,
        t.features.card2Point3
      ]
    },
    { 
      title: t.features.card3Title, 
      points: [
        t.features.card3Point1,
        t.features.card3Point2
      ]
    }
  ];
  
  useEffect(() => {
    // Solo activar carrusel en desktop (ancho > 768px)
    const isDesktop = window.innerWidth >= 768;
    
    let slideTimer: NodeJS.Timeout | undefined;
    let pointTimer: NodeJS.Timeout | undefined;
    
    if (isDesktop) {
      slideTimer = setInterval(() => {
        setCurrentTableSlide((prev) => (prev + 1) % tableSlides.length);
      }, 5000);
    }
    
    pointTimer = setInterval(() => {
      setCardPoints((prev) => prev.map((point, i) => 
        (point + 1) % featureCards[i].points.length
      ));
    }, 8000);
    
    return () => {
      if (slideTimer) clearInterval(slideTimer);
      if (pointTimer) clearInterval(pointTimer);
    };
  }, [tableSlides.length]);


  return (
    <section ref={ref} className="px-4 md:px-6 py-8 sm:py-10 md:py-16 lg:py-20">
      <style>{`
        .animate-item-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }

        .feature-card {
          transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        }

        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(91, 141, 239, 0.16) !important;
        }
        
        @media (max-width: 768px) {
          .feature-card:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="text-left lg:text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <div
            className={`mb-3 sm:mb-4 lg:mb-5 lg:inline-flex ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <div className="px-3 py-1.5 rounded-full inline-block" 
              style={{ 
                background: 'linear-gradient(135deg, rgba(91, 141, 239, 0.08) 0%, rgba(78, 204, 163, 0.08) 100%)',
                border: '1px solid rgba(91, 141, 239, 0.12)'
              }}
            >
              <span className="text-xs tracking-wider uppercase" style={{ color: '#5B8DEF', fontWeight: 600 }}>{t.features.sectionBadge}</span>
            </div>
          </div>
          
          <h2 
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 md:mb-5 px-2 lg:px-0 stagger-1 ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ color: '#5B8DEF', fontWeight: 600 }}
          >
            {t.features.sectionTitle}
          </h2>

          <p
            className={`text-sm sm:text-base max-w-4xl lg:mx-auto px-2 lg:px-0 stagger-2 ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ color: '#64748B', fontWeight: 400 }}
          >
            {t.features.sectionSubtitle}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-10 items-center">
          {/* Carrusel - Solo visible en desktop */}
          <div 
            className={`relative stagger-3 hidden sm:block ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <div 
              className="relative overflow-hidden rounded-[14px] sm:rounded-[18px] md:rounded-[20px] lg:shadow-[0_4px_24px_rgba(91,141,239,0.15)] shadow-[0_6px_28px_rgba(91,141,239,0.12)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_32px_rgba(91,141,239,0.16)]"
              style={{ 
                backgroundColor: 'white',
                border: '1px solid rgba(91, 141, 239, 0.08)',
                height: 'auto',
                minHeight: '450px',
                maxHeight: '580px'
              }}
            >
              {tableSlides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className={`absolute inset-0 w-full p-3 sm:p-5 md:p-6 flex flex-col transition-opacity ${
                    slideIndex === currentTableSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  } ${slideIndex === 0 ? 'hidden sm:flex' : slideIndex !== 1 ? 'hidden sm:flex' : ''}`}
                  style={{ minHeight: '480px', transitionDuration: '0.4s' }}
                >
                  <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                    <h3 className="text-xs sm:text-sm md:text-base truncate" style={{ color: '#1E293B', fontWeight: 600 }}>
                      {slide.title}
                    </h3>
                    {slide.type === "compliance" && (
                      <button 
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex-shrink-0 transition-all hover:brightness-110 active:scale-95"
                        style={{ backgroundColor: '#5B8DEF', color: 'white', fontWeight: 500 }}
                      >
                        <span className="hidden sm:inline">+ Nuevo certificado</span>
                        <span className="sm:hidden">+ Nuevo</span>
                      </button>
                    )}
                    {slide.type === "maintenance" && (
                      <button 
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex-shrink-0 transition-all hover:brightness-110 active:scale-95"
                        style={{ backgroundColor: '#5B8DEF', color: 'white', fontWeight: 500 }}
                      >
                        <span className="hidden sm:inline">+ Nueva tarea</span>
                        <span className="sm:hidden">+ Nueva</span>
                      </button>
                    )}
                  </div>

                  {slide.type === "asset-summary" && (
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={slide.image}
                        alt="Resumen del Activo"
                        className="w-full h-full object-contain"
                        style={{ maxHeight: '500px' }}
                      />
                    </div>
                  )}

                  {slide.type === "documents" && (
                    <>
                      {/* Desktop version */}
                      <div className="space-y-2 flex-1 overflow-hidden hidden sm:block">
                        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs" style={{ color: '#64748B', fontWeight: 500 }}>
                          <div className="col-span-4">Documento</div>
                          <div className="col-span-2">Categoría</div>
                          <div className="col-span-2">Sistema</div>
                          <div className="col-span-2">Fecha</div>
                          <div className="col-span-2">Estado</div>
                        </div>
                        
                        {slide.documents?.map((doc, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 gap-2 px-3 py-3 rounded-lg items-center animate-item-fade-in"
                            style={{ 
                              backgroundColor: '#FFFFFF', 
                              border: '1px solid #F1F5F9',
                              animationDelay: `${idx * 0.1}s`
                            }}
                          >
                            <div className="col-span-4">
                              <div className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: '#5B8DEF' }} />
                                <div>
                                  <p className="text-xs" style={{ color: '#1E293B', fontWeight: 500 }}>{doc.name}</p>
                                  <p className="text-xs" style={{ color: '#94A3B8' }}>{doc.version}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span 
                                className="px-2 py-1 rounded text-xs"
                                style={{ backgroundColor: `${doc.categoryColor}15`, color: doc.categoryColor, fontWeight: 500 }}
                              >
                                {doc.category}
                              </span>
                            </div>
                            <div className="col-span-2 text-xs" style={{ color: '#64748B' }}>{doc.system}</div>
                            <div className="col-span-2 text-xs" style={{ color: '#64748B' }}>{doc.date}</div>
                            <div className="col-span-2">
                              {doc.status === "complete" ? (
                                <CheckCircle2 className="w-5 h-5" style={{ color: '#4ECCA3' }} />
                              ) : (
                                <Clock className="w-5 h-5" style={{ color: '#F59E0B' }} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Mobile version */}
                      <div className="space-y-2 flex-1 overflow-hidden sm:hidden">
                        {slide.documents?.map((doc, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-3 rounded-lg animate-item-fade-in"
                            style={{ 
                              backgroundColor: '#FFFFFF', 
                              border: '1px solid #F1F5F9',
                              animationDelay: `${idx * 0.1}s`
                            }}
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <input type="checkbox" className="w-4 h-4 rounded mt-0.5 flex-shrink-0" style={{ accentColor: '#5B8DEF' }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs truncate" style={{ color: '#1E293B', fontWeight: 500 }}>{doc.name}</p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>{doc.version}</p>
                              </div>
                              {doc.status === "complete" ? (
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#4ECCA3' }} />
                              ) : (
                                <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap text-xs">
                              <span 
                                className="px-2 py-0.5 rounded text-xs"
                                style={{ backgroundColor: `${doc.categoryColor}15`, color: doc.categoryColor, fontWeight: 500 }}
                              >
                                {doc.category}
                              </span>
                              <span style={{ color: '#94A3B8' }}>•</span>
                              <span style={{ color: '#64748B' }}>{doc.system}</span>
                              <span style={{ color: '#94A3B8' }}>•</span>
                              <span style={{ color: '#64748B' }}>{doc.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {slide.type === "maintenance" && (
                    <div className="space-y-4 flex-1 overflow-hidden">
                      <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <div>
                          <p className="text-xs mb-3" style={{ color: '#64748B', fontWeight: 500 }}>Calendario de Mantenimiento</p>
                          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2" style={{ color: '#94A3B8' }}>
                            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((_, i) => (
                              <div key={i} className="hidden sm:block">{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][i]}</div>
                            ))}
                            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                              <div key={i} className="sm:hidden">{day}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center">
                            {[...Array(35)].map((_, i) => {
                              const day = i - 2;
                              const isHighlighted = [2, 10, 24].includes(day);
                              return (
                                <div 
                                  key={i} 
                                  className={`text-xs py-1 ${day > 0 && day <= 31 ? '' : 'opacity-0'}`}
                                  style={{ 
                                    color: isHighlighted ? 'white' : '#64748B',
                                    backgroundColor: isHighlighted ? '#5B8DEF' : 'transparent',
                                    borderRadius: '4px',
                                    fontWeight: isHighlighted ? 600 : 400,
                                    fontSize: '10px'
                                  }}
                                >
                                  {day > 0 && day <= 31 ? day : ''}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs mb-2 sm:mb-3" style={{ color: '#64748B', fontWeight: 500 }}>Estado de Tareas</p>
                          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                            {[
                              { label: 'Completadas', value: '24', color: '#4ECCA3' },
                              { label: 'En progreso', value: '8', color: '#5B8DEF' },
                              { label: 'Programadas', value: '12', color: '#F59E0B' },
                              { label: 'Vencidas', value: '3', color: '#EF4444' }
                            ].map((stat, idx) => (
                              <div
                                key={idx}
                                className="p-2 sm:p-3 rounded-lg text-center animate-item-fade-in"
                                style={{ 
                                  backgroundColor: '#FFFFFF', 
                                  border: '1px solid #F1F5F9',
                                  animationDelay: `${idx * 0.1}s`
                                }}
                              >
                                <div className="text-base sm:text-lg" style={{ color: stat.color, fontWeight: 700 }}>{stat.value}</div>
                                <div className="text-xs" style={{ color: '#64748B', fontSize: '10px' }}>{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs mb-2 sm:mb-3" style={{ color: '#64748B', fontWeight: 500 }}>Tareas de Mantenimiento</p>
                        <div className="space-y-2">
                          {slide.tasksList?.map((task, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-lg animate-item-fade-in"
                              style={{ 
                                backgroundColor: '#FFFFFF', 
                                border: '1px solid #F1F5F9',
                                animationDelay: `${idx * 0.15}s`
                              }}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div 
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ 
                                    backgroundColor: task.status === 'urgent' ? '#EF4444' : 
                                                   task.status === 'in-progress' ? '#5B8DEF' : '#F59E0B' 
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="text-xs truncate" style={{ color: '#1E293B', fontWeight: 500 }}>{task.name}</p>
                                  <p className="text-xs truncate" style={{ color: '#94A3B8' }}>{task.subtitle}</p>
                                </div>
                              </div>
                              <button 
                                className="px-2 py-1 rounded text-xs flex-shrink-0 transition-all hover:brightness-110"
                                style={{ 
                                  backgroundColor: task.status === 'urgent' ? '#EF4444' : 
                                                  task.status === 'in-progress' ? '#5B8DEF' : '#F59E0B',
                                  color: 'white',
                                  fontWeight: 500,
                                  fontSize: '10px'
                                }}
                              >
                                {task.status === 'urgent' ? 'Urgente' : 
                                 task.status === 'in-progress' ? 'Programar' : 
                                 'Detalles'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {slide.type === "compliance" && (
                    <div className="space-y-3 sm:space-y-4 flex-1 overflow-hidden">
                      <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-3">
                        {slide.certificates?.map((cert, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg relative animate-item-fade-in"
                            style={{ 
                              backgroundColor: '#FFFFFF', 
                              border: '1px solid #F1F5F9',
                              animationDelay: `${idx * 0.08}s`
                            }}
                          >
                            <div 
                              className="w-2 h-2 rounded-full absolute top-3 right-3"
                              style={{ backgroundColor: cert.statusColor }}
                            />
                            <p className="text-xs mb-1 pr-4" style={{ color: '#1E293B', fontWeight: 600 }}>{cert.name}</p>
                            <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>
                              Estado: <span style={{ color: cert.statusColor, fontWeight: 500 }}>{cert.status}</span>
                            </p>
                            {cert.expiry && (
                              <p className="text-xs" style={{ color: '#64748B' }}>Vencimiento: {cert.expiry}</p>
                            )}
                            {cert.calification && (
                              <p className="text-xs" style={{ color: '#64748B' }}>Calificación: {cert.calification}</p>
                            )}
                            {cert.type && (
                              <p className="text-xs" style={{ color: '#64748B' }}>Tipo: {cert.type}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <p className="text-xs mb-2 sm:mb-3" style={{ color: '#64748B', fontWeight: 500 }}>Cronograma de Vencimientos</p>
                        <div className="space-y-2">
                          {slide.timeline?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-lg animate-item-fade-in"
                              style={{ 
                                backgroundColor: '#FFFFFF', 
                                border: '1px solid #F1F5F9',
                                animationDelay: `${idx * 0.1}s`
                              }}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div 
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ 
                                    backgroundColor: item.urgency === 'urgent' ? '#EF4444' : 
                                                   item.urgency === 'warning' ? '#F59E0B' : 
                                                   item.urgency === 'normal' ? '#5B8DEF' : '#4ECCA3'
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="text-xs truncate" style={{ color: '#1E293B', fontWeight: 500 }}>{item.name}</p>
                                  <p className="text-xs" style={{ color: '#94A3B8', fontSize: '10px' }}>{item.date}</p>
                                </div>
                              </div>
                              <span 
                                className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0"
                                style={{ 
                                  backgroundColor: item.urgency === 'urgent' ? '#FEE2E2' : 
                                                  item.urgency === 'warning' ? '#FEF3C7' : 
                                                  item.urgency === 'normal' ? '#DBEAFE' : '#D1FAE5',
                                  color: item.urgency === 'urgent' ? '#EF4444' : 
                                        item.urgency === 'warning' ? '#F59E0B' : 
                                        item.urgency === 'normal' ? '#5B8DEF' : '#4ECCA3',
                                  fontWeight: 500
                                }}
                              >
                                {item.daysLeft}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Slide indicators - Solo en desktop */}
              <div className="hidden sm:flex absolute bottom-3 left-1/2 transform -translate-x-1/2 gap-2">
                {tableSlides.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-2 rounded-full transition-all cursor-pointer"
                    style={{ 
                      backgroundColor: idx === currentTableSlide ? '#5B8DEF' : '#CBD5E1',
                      width: idx === currentTableSlide ? '24px' : '8px'
                    }}
                    onClick={() => setCurrentTableSlide(idx)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setCurrentTableSlide(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ir a slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Feature cards */}
          <div className="space-y-2 sm:space-y-3">
            {featureCards.map((card, cardIndex) => {
              const currentPointIndex = cardPoints[cardIndex];
              
              return (
                <div 
                  key={cardIndex}
                  className={isInView ? 'animate-fade-in-up' : 'opacity-0'}
                  style={{ animationDelay: `${0.25 + (cardIndex * 0.1)}s` }}
                >
                  <Card 
                    className="feature-card p-3 sm:p-4 lg:p-5 border-0 transition-all relative overflow-hidden rounded-[16px] lg:rounded-[18px] lg:bg-[#F8F9FD] lg:shadow-[0_1px_8px_rgba(91,141,239,0.06)]"
                    style={{ 
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FD 100%)',
                      boxShadow: '0 2px 12px rgba(91, 141, 239, 0.08)',
                      border: '1px solid rgba(91, 141, 239, 0.06)',
                      minHeight: '120px'
                    }}
                  >
                    <div 
                      className="lg:hidden absolute top-0 right-0 w-20 h-20 opacity-30 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at top right, rgba(91, 141, 239, 0.15) 0%, transparent 70%)'
                      }}
                    />
                    
                    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 relative">
                      <h3 
                        className="text-sm lg:text-base" 
                        style={{ color: '#1E293B', fontWeight: 600 }}
                      >
                        {card.title}
                      </h3>
                      
                      <div className="relative" style={{ minHeight: '60px' }}>
                        {card.points.map((point, pointIndex) => (
                          <div
                            key={pointIndex}
                            className={`absolute inset-0 transition-opacity ${
                              pointIndex === currentPointIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                            style={{ transitionDuration: '0.5s' }}
                          >
                            <div className="flex items-start gap-2 text-xs lg:text-sm leading-relaxed" 
                              style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
                            >
                              <span 
                                className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                style={{ backgroundColor: '#5B8DEF' }}
                              />
                              <span>{point}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});
