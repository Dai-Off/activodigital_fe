import { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useInView } from 'motion/react';
import { CheckCircle2, Clock, TrendingUp, Bell, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { CookieConsent } from './CookieConsent';
// Imágenes del hero: usa la carpeta public
const img1 = '/imageHero.jpg';
const img2 = '/imageHero1.jpg';

// Utils
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// UI Components

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & 
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
        className,
      )}
      {...props}
    />
  );
}

// --- Components ---


const Hero = memo(function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveAssets, setLiveAssets] = useState(268);
  
  const slides = [img1, img2];
  
  const slideData = [
    {
      capital: '4.2M€',
      capitalDesc: 'Capex en operacionales activas',
      roi: '+18%',
      roiDesc: 'ROI proyectado en cartera Premium',
      assets: '27 propiedades',
      assetsDesc: 'monitorizadas en tiempo real'
    },
    {
      capital: '6.8M€',
      capitalDesc: 'Inversión total portfolio 2025',
      roi: '+22%',
      roiDesc: 'Rentabilidad anual consolidada',
      assets: '42 activos',
      assetsDesc: 'en gestión inteligente'
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveAssets((prev) => prev + 1);
    }, 40000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className='relative px-4 md:px-6 pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-12 sm:pb-16 md:pb-32 overflow-hidden'>
      <div className='relative max-w-7xl mx-auto'>
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          <div className='relative z-10'>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='mb-4 md:mb-6 lg:mb-8'
            >
              <span className='lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-full' 
                style={{ 
                  background: 'linear-gradient(135deg, rgba(78, 204, 163, 0.1) 0%, rgba(91, 141, 239, 0.1) 100%)',
                  border: '1px solid rgba(78, 204, 163, 0.2)'
                }}
              >
                <span className='text-xs tracking-widest uppercase' style={{ color: '#4ECCA3', fontWeight: 600, letterSpacing: '0.15em' }}>
                  ARKIA
                </span>
                <span className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: '#4ECCA3' }} />
              </span>
              
              <span className='hidden lg:inline text-xs tracking-widest uppercase' style={{ color: '#4ECCA3', fontWeight: 600, letterSpacing: '0.15em' }}>
                ARKIA
              </span>
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-6 lg:leading-tight'
              style={{ color: '#1E293B', fontWeight: 600, lineHeight: '1.2' }}
            >
              Gestiona Tu Cartera Inmobiliaria con Inteligencia Artificial
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className='mb-5 sm:mb-6 md:mb-8 max-w-xl leading-relaxed text-sm sm:text-base'
              style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.65' }}
            >
              La plataforma todo-en-uno para propietarios e inversores inmobiliarios. Centraliza documentación, controla mantenimientos, garantiza cumplimiento normativo y toma mejores decisiones con análisis inteligente. Todo tu portfolio bajo control desde un solo lugar.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className='flex flex-wrap gap-2'
            >
              <Badge 
                variant='secondary' 
                className='lg:hidden px-3 py-2 rounded-full text-xs shadow-sm'
                style={{ 
                  background: 'linear-gradient(135deg, #E0EDFF 0%, #F0F6FF 100%)',
                  color: '#5B8DEF',
                  fontWeight: 500,
                  border: '1px solid rgba(91, 141, 239, 0.15)'
                }}
              >
                EPBD 2024
              </Badge>
              <Badge 
                variant='secondary' 
                className='lg:hidden px-3 py-2 rounded-full text-xs shadow-sm'
                style={{ 
                  background: 'linear-gradient(135deg, #E0EDFF 0%, #F0F6FF 100%)',
                  color: '#5B8DEF',
                  fontWeight: 500,
                  border: '1px solid rgba(91, 141, 239, 0.15)'
                }}
              >
                Scoring Regulatorio
              </Badge>
              <Badge 
                variant='secondary' 
                className='lg:hidden px-3 py-2 rounded-full text-xs shadow-sm'
                style={{ 
                  background: 'linear-gradient(135deg, #E0EDFF 0%, #F0F6FF 100%)',
                  color: '#5B8DEF',
                  fontWeight: 500,
                  border: '1px solid rgba(91, 141, 239, 0.15)'
                }}
              >
                IRR/NPV
              </Badge>
              
              <Badge 
                variant='secondary' 
                className='hidden lg:inline-flex px-4 py-2 rounded-full text-sm'
                style={{ 
                  backgroundColor: '#E0EDFF',
                  color: '#5B8DEF',
                  fontWeight: 500,
                  border: 'none'
                }}
              >
                Cumplimiento EPBD 2024
              </Badge>
              <Badge 
                variant='secondary' 
                className='hidden lg:inline-flex px-4 py-2 rounded-full text-sm'
                style={{ 
                  backgroundColor: '#E0EDFF',
                  color: '#5B8DEF',
                  fontWeight: 500,
                  border: 'none'
                }}
              >
                Motor Prescriptivo IA
              </Badge>
              <Badge 
                variant='secondary' 
                className='hidden lg:inline-flex px-4 py-2 rounded-full text-sm'
                style={{ 
                  backgroundColor: '#E0EDFF',
                  color: '#5B8DEF',
                  fontWeight: 500,
                  border: 'none'
                }}
              >
                Scoring Regulatorio & ROI
              </Badge>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='relative lg:block hidden'
          >
            <div className='relative' style={{ minHeight: '600px' }}>
              <div 
                className='relative overflow-hidden'
                style={{ 
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(91, 141, 239, 0.2)',
                  height: '600px'
                }}
              >
                <AnimatePresence mode='wait'>
                  <motion.img
                    key={currentSlide}
                    src={slides[currentSlide]}
                    alt="Property2"
                    initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    transition={{ 
                      duration: 0.8,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    className='w-full h-full object-cover'
                  />
                </AnimatePresence>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5
                }}
                style={{ 
                  position: 'absolute',
                  top: '-20px',
                  right: '20px',
                  zIndex: 30
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -4
                }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <Card 
                    className='p-5 border-0 backdrop-blur-xl'
                    style={{ 
                      backgroundColor: 'rgba(248, 249, 253, 0.98)',
                      boxShadow: '0 8px 32px rgba(91, 141, 239, 0.25)',
                      borderRadius: '18px',
                      minWidth: '200px'
                    }}
                  >
                    <AnimatePresence mode='wait'>
                      <motion.div
                        key={`capital-${currentSlide}`}
                        initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: -15 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1, 
                          rotateX: 0,
                          transition: {
                            duration: 0.6,
                            ease: [0.34, 1.56, 0.64, 1],
                            delay: 0.1
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: -20, 
                          scale: 0.9,
                          rotateX: 15,
                          transition: {
                            duration: 0.3,
                            ease: [0.43, 0.13, 0.23, 0.96]
                          }
                        }}
                      >
                        <div className='text-3xl mb-1' style={{ color: '#5B8DEF', fontWeight: 700 }}>
                          {slideData[currentSlide].capital}
                        </div>
                        <div className='text-xs leading-tight' style={{ color: '#64748B', fontWeight: 400 }}>
                          {slideData[currentSlide].capitalDesc}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </Card>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.7
                }}
                style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '-40px',
                  transform: 'translateY(-50%)',
                  zIndex: 30
                }}
                whileHover={{ 
                  scale: 1.05, 
                  x: -4,
                  rotateZ: -2,
                  transition: { 
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1]
                  }
                }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 1, 0, -1, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5
                  }}
                >
                  <Card 
                    className='p-5 border-0 backdrop-blur-xl'
                    style={{ 
                      backgroundColor: 'rgba(248, 249, 253, 0.98)',
                      boxShadow: '0 8px 32px rgba(78, 204, 163, 0.25)',
                      borderRadius: '18px',
                      minWidth: '180px'
                    }}
                  >
                    <AnimatePresence mode='wait'>
                      <motion.div
                        key={`roi-${currentSlide}`}
                        initial={{ opacity: 0, x: -30, scale: 0.85, rotateY: -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          scale: 1, 
                          rotateY: 0,
                          transition: {
                            duration: 0.7,
                            ease: [0.34, 1.56, 0.64, 1],
                            delay: 0.15
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          x: 30, 
                          scale: 0.85,
                          rotateY: 20,
                          transition: {
                            duration: 0.3,
                            ease: [0.43, 0.13, 0.23, 0.96]
                          }
                        }}
                      >
                        <div className='text-3xl mb-1' style={{ color: '#4ECCA3', fontWeight: 700 }}>
                          {slideData[currentSlide].roi}
                        </div>
                        <div className='text-xs leading-tight' style={{ color: '#64748B', fontWeight: 400 }}>
                          {slideData[currentSlide].roiDesc}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </Card>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8
                }}
                style={{ 
                  position: 'absolute',
                  bottom: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  maxWidth: '90%',
                  zIndex: 30
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -4
                }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -6, 0],
                  }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1
                  }}
                >
                  <Card 
                    className='p-5 border-0 backdrop-blur-xl relative overflow-hidden'
                    style={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      borderRadius: '18px',
                      minWidth: '260px'
                    }}
                  >
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(78, 204, 163, 0.15) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        zIndex: 0
                      }}
                    />
                    
                    <div className='relative' style={{ zIndex: 1 }}>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='flex items-center gap-1.5'>
                          <motion.div
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [1, 0.6, 1]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                            className='w-2 h-2 rounded-full'
                            style={{ backgroundColor: '#4ECCA3' }}
                          />
                          <span className='text-xs uppercase tracking-wider' style={{ color: '#4ECCA3', fontWeight: 600 }}>
                            EN VIVO
                          </span>
                        </div>
                      </div>
                      
                      <div className='text-sm mb-1' style={{ color: '#E0EDFF', fontWeight: 600 }}>
                        Activos en directo
                      </div>
                      
                      <div className='flex items-baseline gap-2'>
                        <AnimatePresence mode='wait'>
                          <motion.span 
                            key={liveAssets}
                            initial={{ opacity: 0, y: 10, scale: 1.2 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className='text-xs leading-tight' 
                            style={{ color: '#94A3D3', fontWeight: 400 }}
                          >
                            {liveAssets} propiedades monitorizadas
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

const FeaturesSection = memo(function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  
  const [currentTableSlide, setCurrentTableSlide] = useState(0);
  const [currentCardsSlide, setCurrentCardsSlide] = useState(0);
  
  const tableSlides = [
    {
      type: 'documents',
      title: 'Repositorio Documental',
      documents: [
        { name: 'Manual HVAC Sistema Principal', version: 'Versión 2.1', category: 'Manual', categoryColor: '#5B8DEF', system: 'HVAC', date: '15/03/2024', status: 'complete' },
        { name: 'Certificado Eficiencia Energética', version: 'CEE-2048-001', category: 'Certificado', categoryColor: '#4ECCA3', system: 'General', date: '01/04/2024', status: 'complete' },
        { name: 'Planos As-Built Estructura', version: 'EST-AB-2024.dwg', category: 'As-Built', categoryColor: '#A78BFA', system: 'Estructura', date: '20/02/2024', status: 'pending' }
      ]
    },
    {
      type: 'maintenance',
      title: 'Plan de Mantenimiento',
      calendar: {
        month: 'Mayo 2024',
        tasks: [
          { name: 'Revisión ascensor principal', type: 'Programada', date: '24', month: 'Mayo', status: 'Programado' },
          { name: 'Limpieza filtros HVAC', type: 'Preventiva', date: '5', month: 'Junio', status: 'Programado' },
          { name: 'Inspección sistema PCI', type: 'Obligatoria', date: '12', month: 'Junio', status: 'Programado' },
          { name: 'Mantenimiento', type: 'General', date: '3', month: 'Julio', status: 'Pendiente' }
        ]
      },
      tasksList: [
        { name: 'Revisión ascensor principal', subtitle: 'Sistema AS-01 • Edificio A', status: 'urgent', dueDate: 'Vence en 5 días' },
        { name: 'Limpieza filtros HVAC', subtitle: 'Climatización • Edificios HVAC1', status: 'in-progress', dueDate: 'En progreso' },
        { name: 'Inspección sistema PCI', subtitle: 'Sistema PCI-1 • Cobertura 7/8A', status: 'programmed', dueDate: 'Programado para 22/05' }
      ]
    },
    {
      type: 'compliance',
      title: 'Cumplimiento Normativo',
      certificates: [
        { name: 'Certificado CEE', status: 'No certificado', statusColor: '#4ECCA3', expiry: '15/02/2034', calification: 'B' },
        { name: 'Revisión RITE', status: 'Programar Renovación', statusColor: '#F59E0B', expiry: '08/01/2024', type: 'Instalación climatización' },
        { name: 'Industria BT', status: 'No incluido', statusColor: '#4ECCA3', expiry: '15/05/2027', installation: 'ELECT-2024-001' },
        { name: 'Ascensor', status: 'Caducado/Urgente', statusColor: '#EF4444', expiry: '15/02/2023', type: 'Revisión ordinaria' },
        { name: 'PCI', status: 'Vigente', statusColor: '#4ECCA3', expiry: '08/12/2024', maintenance: 'ITV-SAMU-001' },
        { name: 'Acreditabilidad', status: 'Completar evaluación', statusColor: '#F59E0B', expiry: '', normative: 'CTE-ISI-4A' }
      ],
      timeline: [
        { name: 'Revisión ascensor - URGENTE', date: 'Vencimiento: 15 de abril de 2024', daysLeft: '3 días', urgency: 'urgent' },
        { name: 'Inspección RITE', date: 'Vencimiento: 02 de mayo de 2024', daysLeft: '1 mes', urgency: 'warning' },
        { name: 'Revisión PCI', date: 'Vencimiento: 08 de noviembre de 2024', daysLeft: '7 meses', urgency: 'normal' },
        { name: 'Renovación CEE', date: 'Vencimiento: 15 de marzo de 2034', daysLeft: '10 años', urgency: 'ok' }
      ]
    }
  ];
  
  const card1Slides = [
    { title: 'Documentación Centralizada', description: 'Todos tus documentos en un solo lugar. Sube y organiza planos, certificados y contratos de forma automática. Encuentra cualquier documento en segundos.' },
    { title: 'Alertas Inteligentes', description: 'Nunca pierdas una fecha importante. Recibe avisos automáticos de vencimientos de certificados, inspecciones obligatorias y renovaciones. Mantén todo al día sin esfuerzo.' },
    { title: 'Cumplimiento Normativo', description: 'Asegura el cumplimiento de todas las normativas. El sistema verifica automáticamente que tus propiedades cumplan con las regulaciones vigentes y te avisa de cambios legales.' },
    { title: 'Historial Completo', description: 'Toda la vida de cada propiedad registrada. Consulta el historial de reformas, certificaciones y mantenimientos. Información clara y siempre accesible.' }
  ];
  
  const card2Slides = [
    { title: 'Gestión de Mantenimiento', description: 'Planifica y controla todo el mantenimiento. Programa revisiones, asigna tareas y realiza seguimiento en tiempo real. Mantén tus propiedades en perfecto estado.' },
    { title: 'Vista Global del Portfolio', description: 'Controla todas tus propiedades de un vistazo. Accede a información consolidada de tu cartera completa. Identifica rápidamente qué requiere tu atención.' },
    { title: 'Certificados Energéticos', description: 'Gestiona todos tus certificados en un lugar. Consulta calificaciones energéticas, fechas de vencimiento y requisitos de mejora. Todo organizado y actualizado.' },
    { title: 'Acceso desde Cualquier Lugar', description: 'Tu información siempre disponible. Accede desde el móvil, tablet u ordenador. Comparte documentos y reportes con tu equipo de forma segura.' }
  ];
  
  const card3Slides = [
    { title: 'Informes Automáticos', description: 'Genera reportes profesionales al instante. Informes de cumplimiento, estado de la cartera y análisis de riesgo. Documentación lista para inversores y reguladores.' },
    { title: 'Panel de Control Visual', description: 'Información clara y visual. Gráficos y métricas que te ayudan a entender el estado de tu cartera. Toma decisiones informadas más rápido.' },
    { title: 'Calendario Integrado', description: 'Todas tus fechas importantes organizadas. Inspecciones, revisiones y vencimientos en un calendario fácil de usar. Planifica con anticipación.' },
    { title: 'Soporte Especializado', description: 'Ayuda cuando la necesites. Nuestro equipo de expertos te guía en el uso de la plataforma y te asesora sobre mejores prácticas de gestión inmobiliaria.' }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTableSlide((prev) => (prev + 1) % tableSlides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [tableSlides.length]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCardsSlide((prev) => (prev + 1) % card1Slides.length);
    }, 10000);
    
    return () => clearInterval(timer);
  }, [card1Slides.length]);

  return (
    <section ref={ref} className='px-4 md:px-6 py-10 sm:py-12 md:py-20'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-8 sm:mb-10 md:mb-16'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className='mb-3 lg:mb-0 lg:hidden inline-flex'
          >
            <div className='px-3 py-1.5 rounded-full' 
              style={{ 
                background: 'linear-gradient(135deg, rgba(91, 141, 239, 0.08) 0%, rgba(78, 204, 163, 0.08) 100%)',
                border: '1px solid rgba(91, 141, 239, 0.12)'
              }}
            >
              <span className='text-xs tracking-wider uppercase' style={{ color: '#5B8DEF', fontWeight: 600 }}>La Plataforma</span>
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className='text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 md:mb-4 px-2 lg:px-0'
            style={{ color: '#5B8DEF', fontWeight: 600 }}
          >
            Gestiona Toda Tu Cartera en un Solo Lugar
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            className='text-sm sm:text-base max-w-2xl mx-auto px-2 lg:px-0'
            style={{ color: '#64748B', fontWeight: 400 }}
          >
            Centraliza documentos, certificados y mantenimientos de todas tus propiedades. Control total con alertas automáticas y cumplimiento normativo garantizado
          </motion.p>
        </div>
        
        <div className='grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center'>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className='relative'
          >
            <div 
              className='relative overflow-hidden rounded-[16px] sm:rounded-[20px] shadow-[0_4px_20px_rgba(91,141,239,0.12)] lg:shadow-[0_4px_24px_rgba(91,141,239,0.15)] h-[463px] sm:h-[529px] lg:h-[520px]'
              style={{ 
                backgroundColor: 'white',
                border: '1px solid rgba(91, 141, 239, 0.08)'
              }}
            >
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentTableSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6 }}
                  className='w-full p-3 sm:p-4 md:p-5 lg:p-6 pb-10 sm:pb-8 lg:pb-6 flex flex-col h-full'
                >
                  <div className='flex items-center justify-between mb-4 sm:mb-5'>
                    <h3 className='text-sm sm:text-base' style={{ color: '#1E293B', fontWeight: 600 }}>
                      {tableSlides[currentTableSlide].title}
                    </h3>
                    {tableSlides[currentTableSlide].type === 'compliance' && (
                      <button 
                        className='px-3 py-1.5 rounded-lg text-xs'
                        style={{ backgroundColor: '#5B8DEF', color: 'white', fontWeight: 500 }}
                      >
                        + Nuevo certificado
                      </button>
                    )}
                    {tableSlides[currentTableSlide].type === 'maintenance' && (
                      <button 
                        className='px-3 py-1.5 rounded-lg text-xs'
                        style={{ backgroundColor: '#5B8DEF', color: 'white', fontWeight: 500 }}
                      >
                        + Nueva tarea
                      </button>
                    )}
                  </div>

                  {tableSlides[currentTableSlide].type === 'documents' && (
                    <div className='space-y-2 flex-1 overflow-hidden'>
                      {/* Desktop Header */}
                      <div className='hidden md:grid grid-cols-12 gap-2 px-3 py-2 text-xs' style={{ color: '#64748B', fontWeight: 500 }}>
                        <div className='col-span-4'>Documento</div>
                        <div className='col-span-2'>Categoría</div>
                        <div className='col-span-2'>Sistema</div>
                        <div className='col-span-2'>Fecha</div>
                        <div className='col-span-2'>Estado</div>
                      </div>
                      
                      {tableSlides[currentTableSlide].documents?.map((doc, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className='px-3 py-3 rounded-lg'
                          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9' }}
                        >
                          {/* Mobile Layout */}
                          <div className='md:hidden space-y-2'>
                            <div className='flex items-center gap-2'>
                              <input type='checkbox' className='w-4 h-4 rounded flex-shrink-0' style={{ accentColor: '#5B8DEF' }} />
                              <div className='flex-1 min-w-0'>
                                <p className='text-xs font-medium truncate' style={{ color: '#1E293B' }}>{doc.name}</p>
                                <p className='text-xs truncate' style={{ color: '#94A3B8' }}>{doc.version}</p>
                              </div>
                              <div className='flex-shrink-0'>
                                {doc.status === 'complete' ? (
                                  <CheckCircle2 className='w-5 h-5' style={{ color: '#4ECCA3' }} />
                                ) : (
                                  <Clock className='w-5 h-5' style={{ color: '#F59E0B' }} />
                                )}
                              </div>
                            </div>
                            <div className='flex items-center justify-between gap-2 text-xs'>
                              <span 
                                className='px-2 py-1 rounded text-xs'
                                style={{ backgroundColor: `${doc.categoryColor}15`, color: doc.categoryColor, fontWeight: 500 }}
                              >
                                {doc.category}
                              </span>
                              <div className='flex gap-4 text-xs' style={{ color: '#64748B' }}>
                                <span>{doc.system}</span>
                                <span>{doc.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Desktop Layout */}
                          <div className='hidden md:grid grid-cols-12 gap-2 items-center'>
                            <div className='col-span-4'>
                              <div className='flex items-center gap-2'>
                                <input type='checkbox' className='w-4 h-4 rounded' style={{ accentColor: '#5B8DEF' }} />
                                <div>
                                  <p className='text-xs' style={{ color: '#1E293B', fontWeight: 500 }}>{doc.name}</p>
                                  <p className='text-xs' style={{ color: '#94A3B8' }}>{doc.version}</p>
                                </div>
                              </div>
                            </div>
                            <div className='col-span-2'>
                              <span 
                                className='px-2 py-1 rounded text-xs'
                                style={{ backgroundColor: `${doc.categoryColor}15`, color: doc.categoryColor, fontWeight: 500 }}
                              >
                                {doc.category}
                              </span>
                            </div>
                            <div className='col-span-2 text-xs' style={{ color: '#64748B' }}>{doc.system}</div>
                            <div className='col-span-2 text-xs' style={{ color: '#64748B' }}>{doc.date}</div>
                            <div className='col-span-2'>
                              {doc.status === 'complete' ? (
                                <CheckCircle2 className='w-5 h-5' style={{ color: '#4ECCA3' }} />
                              ) : (
                                <Clock className='w-5 h-5' style={{ color: '#F59E0B' }} />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {tableSlides[currentTableSlide].type === 'maintenance' && (
                    <div className='space-y-4 flex-1 overflow-hidden'>
                      {/* Mobile Layout - Stack vertically */}
                      <div className='block sm:hidden space-y-4'>
                        {/* Calendar Section */}
                        <div>
                          <p className='text-xs mb-3' style={{ color: '#64748B', fontWeight: 500 }}>Calendario de Mantenimiento</p>
                          <div className='grid grid-cols-7 gap-0.5 text-center text-xs mb-2' style={{ color: '#94A3B8' }}>
                            {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(day => (
                              <div key={day} className='py-1'>{day}</div>
                            ))}
                          </div>
                          <div className='grid grid-cols-7 gap-0.5 text-center'>
                            {[...Array(35)].map((_, i) => {
                              const day = i - 2;
                              const isHighlighted = [2, 10, 24].includes(day);
                              return (
                                <div 
                                  key={i} 
                                  className='text-xs py-1'
                                  style={{ 
                                    color: isHighlighted ? 'white' : '#64748B',
                                    backgroundColor: isHighlighted ? '#5B8DEF' : 'transparent',
                                    borderRadius: '3px',
                                    fontWeight: isHighlighted ? 600 : 400,
                                    minHeight: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  {day > 0 && day <= 31 ? day : ''}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Stats Section - Mobile grid */}
                        <div>
                          <p className='text-xs mb-3' style={{ color: '#64748B', fontWeight: 500 }}>Estado de Tareas</p>
                          <div className='grid grid-cols-2 gap-2'>
                            {[
                              { label: 'Completadas', value: '24', color: '#4ECCA3' },
                              { label: 'En progreso', value: '8', color: '#5B8DEF' },
                              { label: 'Programadas', value: '12', color: '#F59E0B' },
                              { label: 'Vencidas', value: '3', color: '#EF4444' }
                            ].map((stat, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className='p-2 rounded-lg text-center'
                                style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9' }}
                              >
                                <div className='text-base font-bold mb-1' style={{ color: stat.color }}>{stat.value}</div>
                                <div className='text-xs' style={{ color: '#64748B' }}>{stat.label}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop/Tablet Layout - Side by side */}
                      <div className='hidden sm:grid grid-cols-2 gap-4'>
                        <div>
                          <p className='text-xs mb-3' style={{ color: '#64748B', fontWeight: 500 }}>Calendario de Mantenimiento</p>
                          <div className='grid grid-cols-7 gap-1 text-center text-xs mb-2' style={{ color: '#94A3B8' }}>
                            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                              <div key={day}>{day}</div>
                            ))}
                          </div>
                          <div className='grid grid-cols-7 gap-1 text-center'>
                            {[...Array(35)].map((_, i) => {
                              const day = i - 2;
                              const isHighlighted = [2, 10, 24].includes(day);
                              return (
                                <div 
                                  key={i} 
                                  className='text-xs py-1'
                                  style={{ 
                                    color: isHighlighted ? 'white' : '#64748B',
                                    backgroundColor: isHighlighted ? '#5B8DEF' : 'transparent',
                                    borderRadius: '4px',
                                    fontWeight: isHighlighted ? 600 : 400
                                  }}
                                >
                                  {day > 0 && day <= 31 ? day : ''}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <p className='text-xs mb-3' style={{ color: '#64748B', fontWeight: 500 }}>Estado de Tareas</p>
                          <div className='grid grid-cols-2 gap-2'>
                            {[
                              { label: 'Completadas', value: '24', color: '#4ECCA3' },
                              { label: 'En progreso', value: '8', color: '#5B8DEF' },
                              { label: 'Programadas', value: '12', color: '#F59E0B' },
                              { label: 'Vencidas', value: '3', color: '#EF4444' }
                            ].map((stat, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className='p-3 rounded-lg text-center'
                                style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9' }}
                              >
                                <div className='text-lg' style={{ color: stat.color, fontWeight: 700 }}>{stat.value}</div>
                                <div className='text-xs' style={{ color: '#64748B' }}>{stat.label}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Task List Section */}
                      <div>
                        <p className='text-xs mb-3' style={{ color: '#64748B', fontWeight: 500 }}>Tareas de Mantenimiento</p>
                        <div className='space-y-2'>
                          {tableSlides[currentTableSlide].tasksList?.map((task, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.15 }}
                              className='flex items-center justify-between p-2 sm:p-3 rounded-lg'
                              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9' }}
                            >
                              <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-1'>
                                <div 
                                  className='w-2 h-2 rounded-full flex-shrink-0'
                                  style={{ 
                                    backgroundColor: task.status === 'urgent' ? '#EF4444' : 
                                                   task.status === 'in-progress' ? '#5B8DEF' : '#F59E0B' 
                                  }}
                                />
                                <div className='min-w-0 flex-1'>
                                  <p className='text-xs truncate' style={{ color: '#1E293B', fontWeight: 500 }}>{task.name}</p>
                                  <p className='text-xs truncate sm:block hidden' style={{ color: '#94A3B8' }}>{task.subtitle}</p>
                                </div>
                              </div>
                              <button 
                                className='px-2 py-1 rounded text-xs flex-shrink-0 ml-2'
                                style={{ 
                                  backgroundColor: task.status === 'urgent' ? '#EF4444' : 
                                                  task.status === 'in-progress' ? '#5B8DEF' : '#F59E0B',
                                  color: 'white',
                                  fontWeight: 500
                                }}
                              >
                                {task.status === 'urgent' ? 'Urgente' : 
                                 task.status === 'in-progress' ? 'Programar' : 
                                 'Ver detalles'}
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {tableSlides[currentTableSlide].type === 'compliance' && (
                    <div className='space-y-4 flex-1 overflow-hidden'>
                      {/* Certificates Grid - Responsive */}
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
                        {tableSlides[currentTableSlide].certificates?.map((cert, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.08 }}
                            className='p-2 sm:p-3 rounded-lg relative'
                            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9' }}
                          >
                            <div 
                              className='w-2 h-2 rounded-full absolute top-2 sm:top-3 right-2 sm:right-3'
                              style={{ backgroundColor: cert.statusColor }}
                            />
                            <p className='text-xs mb-1 pr-4' style={{ color: '#1E293B', fontWeight: 600 }}>{cert.name}</p>
                            <p className='text-xs mb-1 sm:mb-2' style={{ color: '#94A3B8' }}>
                              Estado: <span style={{ color: cert.statusColor, fontWeight: 500 }}>{cert.status}</span>
                            </p>
                            <div className='space-y-0.5 text-xs' style={{ color: '#64748B' }}>
                              {cert.expiry && (
                                <p>Vencimiento: {cert.expiry}</p>
                              )}
                              {cert.calification && (
                                <p>Calificación: {cert.calification}</p>
                              )}
                              {cert.type && (
                                <p className='truncate'>Tipo: {cert.type}</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Timeline Section */}
                      <div>
                        <p className='text-xs mb-3' style={{ color: '#64748B', fontWeight: 500 }}>Cronograma de Vencimientos</p>
                        <div className='space-y-2'>
                          {tableSlides[currentTableSlide].timeline?.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className='flex items-center justify-between p-2 sm:p-3 rounded-lg gap-2'
                              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9' }}
                            >
                              <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-1'>
                                <div 
                                  className='w-2 h-2 rounded-full flex-shrink-0'
                                  style={{ 
                                    backgroundColor: item.urgency === 'urgent' ? '#EF4444' : 
                                                   item.urgency === 'warning' ? '#F59E0B' : 
                                                   item.urgency === 'normal' ? '#5B8DEF' : '#4ECCA3'
                                  }}
                                />
                                <div className='min-w-0 flex-1'>
                                  <p className='text-xs truncate' style={{ color: '#1E293B', fontWeight: 500 }}>{item.name}</p>
                                  <p className='text-xs truncate sm:block hidden' style={{ color: '#94A3B8' }}>{item.date}</p>
                                </div>
                              </div>
                              <span 
                                className='text-xs px-2 py-1 rounded flex-shrink-0'
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
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              <div className='absolute bottom-5 sm:bottom-4 lg:bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2'>
                {tableSlides.map((_, idx) => (
                  <div
                    key={idx}
                    className='w-2 h-2 rounded-full transition-all cursor-pointer'
                    style={{ 
                      backgroundColor: idx === currentTableSlide ? '#5B8DEF' : '#CBD5E1',
                      width: idx === currentTableSlide ? '24px' : '8px'
                    }}
                    onClick={() => setCurrentTableSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          <div className='space-y-3 sm:space-y-4'>
            {(() => {
              const cardRef = useRef(null);
              const cardInView = useInView(cardRef, { once: false, margin: '0px', amount: 0.2 });
              const feature = card1Slides[currentCardsSlide];
              
              return (
                <motion.div
                  key='card-1'
                  ref={cardRef}
                  initial={{ opacity: 0, x: 50 }}
                  animate={cardInView ? { opacity: 1, x: 0} : {opacity: 0,x: 50}}
                  transition={{ duration: 0.4}}
                  whileHover={{ scale: 1.02, x: -4}}
                >
                  <Card 
                    className='p-4 lg:p-7 border-0 transition-all relative overflow-hidden rounded-[18px] lg:rounded-[20px] lg:bg-[#F8F9FD] lg:shadow-[0_1px_8px_rgba(91,141,239,0.06)]'
                    style={{ 
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FD 100%)',
                      boxShadow: '0 2px 12px rgba(91, 141, 239, 0.08)',
                      border: '1px solid rgba(91, 141, 239, 0.06)'
                    }}
                  >
                    <div 
                      className='lg:hidden absolute top-0 right-0 w-20 h-20 opacity-30 pointer-events-none'
                      style={{
                        background: 'radial-gradient(circle at top right, rgba(91, 141, 239, 0.15) 0%, transparent 70%)'
                      }}
                    />
                    
                    <div className='flex items-start justify-between gap-3 lg:gap-4 relative'>
                      <div className='flex-1'>
                        <AnimatePresence mode='wait'>
                          <motion.h3 
                            key={`title-card1-${currentCardsSlide}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className='mb-1.5 lg:mb-2 text-sm lg:text-base font-semibold lg:font-medium' 
                            style={{ color: '#1E293B' }}
                          >
                            {feature.title}
                          </motion.h3>
                        </AnimatePresence>
                        <AnimatePresence mode='wait'>
                          <motion.p 
                            key={`desc-card1-${currentCardsSlide}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className='text-xs lg:text-sm leading-relaxed' 
                            style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
                          >
                            {feature.description}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })()}

            {(() => {
              const cardRef = useRef(null);
              const cardInView = useInView(cardRef, { once: false, margin: '0px', amount: 0.2 });
              const feature = card2Slides[currentCardsSlide];
              
              return (
                <motion.div
                  key='card-2'
                  ref={cardRef}
                  initial={{ opacity: 0, x: 50 }}
                  animate={cardInView ? { opacity: 1, x: 0} : {opacity: 0, x: 50}}
                  transition={{ duration: 0.4, delay: 0.1}}
                  whileHover={{ scale: 1.02, x: -4}}
                >
                  <Card 
                    className='p-4 lg:p-7 border-0 transition-all relative overflow-hidden rounded-[18px] lg:rounded-[20px] lg:bg-[#F8F9FD] lg:shadow-[0_1px_8px_rgba(91,141,239,0.06)]'
                    style={{ 
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FD 100%)',
                      boxShadow: '0 2px 12px rgba(91, 141, 239, 0.08)',
                      border: '1px solid rgba(91, 141, 239, 0.06)'
                    }}
                  >
                    <div 
                      className='lg:hidden absolute top-0 right-0 w-20 h-20 opacity-30 pointer-events-none'
                      style={{
                        background: 'radial-gradient(circle at top right, rgba(91, 141, 239, 0.15) 0%, transparent 70%)'
                      }}
                    />
                    
                    <div className='flex items-start justify-between gap-3 lg:gap-4 relative'>
                      <div className='flex-1'>
                        <AnimatePresence mode='wait'>
                          <motion.h3 
                            key={`title-card2-${currentCardsSlide}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className='mb-1.5 lg:mb-2 text-sm lg:text-base font-semibold lg:font-medium' 
                            style={{ color: '#1E293B' }}
                          >
                            {feature.title}
                          </motion.h3>
                        </AnimatePresence>
                        <AnimatePresence mode='wait'>
                          <motion.p 
                            key={`desc-card2-${currentCardsSlide}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className='text-xs lg:text-sm leading-relaxed' 
                            style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
                          >
                            {feature.description}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })()}

            {(() => {
              const cardRef = useRef(null);
              const cardInView = useInView(cardRef, { once: false, margin: '0px', amount: 0.2 });
              const feature = card3Slides[currentCardsSlide];
              
              return (
                <motion.div
                  key='card-3'
                  ref={cardRef}
                  initial={{ opacity: 0, x: 50 }}
                  animate={cardInView ? { opacity: 1, x: 0} : {opacity: 0, x: 50}}
                  transition={{ duration: 0.4, delay: 0.2}}
                  whileHover={{ scale: 1.02, x: -4}}
                >
                  <Card 
                    className='p-4 lg:p-7 border-0 transition-all relative overflow-hidden rounded-[18px] lg:rounded-[20px] lg:bg-[#F8F9FD] lg:shadow-[0_1px_8px_rgba(91,141,239,0.06)]'
                    style={{ 
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FD 100%)',
                      boxShadow: '0 2px 12px rgba(91, 141, 239, 0.08)',
                      border: '1px solid rgba(91, 141, 239, 0.06)'
                    }}
                  >
                    <div 
                      className='lg:hidden absolute top-0 right-0 w-20 h-20 opacity-30 pointer-events-none'
                      style={{
                        background: 'radial-gradient(circle at top right, rgba(91, 141, 239, 0.15) 0%, transparent 70%)'
                      }}
                    />
                    
                    <div className='flex items-start justify-between gap-3 lg:gap-4 relative'>
                      <div className='flex-1'>
                        <AnimatePresence mode='wait'>
                          <motion.h3 
                            key={`title-card3-${currentCardsSlide}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className='mb-1.5 lg:mb-2 text-sm lg:text-base font-semibold lg:font-medium' 
                            style={{ color: '#1E293B' }}
                          >
                            {feature.title}
                          </motion.h3>
                        </AnimatePresence>
                        <AnimatePresence mode='wait'>
                          <motion.p 
                            key={`desc-card3-${currentCardsSlide}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className='text-xs lg:text-sm leading-relaxed' 
                            style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}
                          >
                            {feature.description}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
});

const SecuritySection = memo(function SecuritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    {
      number: '1',
      title: 'Encriptación de Datos',
      subtitle: 'Protección total de tu información sensible',
      description: 'Todos tus documentos y datos están protegidos con encriptación de nivel bancario. Planos, certificados, contratos e información financiera se almacenan de forma segura. Tus datos están protegidos tanto en tránsito como en reposo.',
      color: '#5B8DEF'
    },
    {
      number: '2',
      title: 'Cumplimiento GDPR',
      subtitle: 'Privacidad garantizada y conforme a normativa europea',
      description: 'Cumplimos estrictamente con el Reglamento General de Protección de Datos (GDPR). Tus datos personales y los de tus inquilinos están protegidos. Control total sobre qué información compartes y con quién.',
      color: '#4ECCA3'
    },
    {
      number: '3',
      title: 'Control de Acceso',
      subtitle: 'Tú decides quién ve qué información',
      description: 'Sistema avanzado de permisos y roles. Otorga acceso específico a tu equipo, proveedores o asesores. Autenticación segura con verificación en dos pasos. Auditoría completa de accesos y cambios realizados.',
      color: '#8B7FD6'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 12000);
    
    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <section ref={ref} className='px-4 md:px-6 py-10 sm:py-12 md:py-20 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className='text-center mb-2 sm:mb-3 md:mb-4 text-xs tracking-widest uppercase px-2'
          style={{ color: '#94A3D3', fontWeight: 500, letterSpacing: '0.12em' }}
        >
          SEGURIDAD Y PRIVACIDAD
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className='text-center mb-8 sm:mb-10 md:mb-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-2'
          style={{ color: '#1E293B', fontWeight: 600, lineHeight: '1.3' }}
        >
          Tus Datos Protegidos al Máximo Nivel
        </motion.h2>
        
        <div className='relative mx-auto max-w-3xl h-[350px] sm:h-[380px] md:h-[400px]'>
          <div className='relative w-full h-full flex items-center justify-center'>
            <AnimatePresence mode='popLayout'>
              {cards.map((card, index) => {
                const isActive = index === activeIndex;
                const isPrev = index === (activeIndex - 1 + cards.length) % cards.length;
                const isNext = index === (activeIndex + 1) % cards.length;
                
                if (!isActive && !isPrev && !isNext) return null;
                
                let x = 0, opacity = 1, scale = 1, zIndex = 10, rotateZ = 0;
                
                if (isActive) {
                  x = 0; opacity = 1; scale = 1; zIndex = 30; rotateZ = 0;
                } else if (isNext) {
                  x = 280; opacity = 0.35; scale = 0.85; zIndex = 20; rotateZ = 2;
                } else if (isPrev) {
                  x = -280; opacity = 0.35; scale = 0.85; zIndex = 10; rotateZ = -2;
                }
                
                return (
                  <motion.div
                    key={index}
                    initial={{ x: 280, opacity: 0.35, scale: 0.85, rotateZ: 2 }}
                    animate={{ x, opacity, scale, rotateZ }}
                    exit={{ x: -280, opacity: 0.35, scale: 0.85, rotateZ: -2 }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    style={{ position: 'absolute', zIndex, width: '100%', padding: '0 8px', pointerEvents: isActive ? 'auto' : 'none' }}
                  >
                    <Card 
                      className='p-6 md:p-8 lg:p-10 border-0 mx-auto'
                      style={{ 
                        backgroundColor: 'white',
                        boxShadow: isActive ? '0 25px 70px rgba(91, 141, 239, 0.35)' : '0 15px 40px rgba(91, 141, 239, 0.2)',
                        borderRadius: '20px',
                        maxWidth: '680px'
                      }}
                    >
                      <div className='text-left'>
                        <p className='mb-1.5 md:mb-2 uppercase tracking-wide' style={{ color: '#94A3D3', fontWeight: 500, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{card.subtitle}</p>
                        <h3 className='mb-2.5 md:mb-3 text-lg md:text-xl lg:text-2xl' style={{ color: '#1E293B', fontWeight: 600 }}>{card.title}</h3>
                        <p className='text-xs md:text-sm lg:text-base leading-relaxed' style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}>{card.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        
        <div className='flex justify-center items-center gap-3 md:gap-4 mt-6 md:mt-8'>
          <motion.button onClick={() => setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className='w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center' style={{ backgroundColor: 'white', boxShadow: '0 4px 12px rgba(91, 141, 239, 0.15)', border: 'none', cursor: 'pointer' }}>
            <svg width='18' height='18' viewBox='0 0 20 20' fill='none' className='md:w-5 md:h-5'>
              <path d='M12 15L7 10L12 5' stroke='#5B8DEF' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
            </svg>
          </motion.button>
          <div className='flex gap-2 md:gap-3'>
            {cards.map((_, index) => (
              <motion.button key={index} onClick={() => setActiveIndex(index)} animate={{ scale: index === activeIndex ? 1.2 : 1, backgroundColor: index === activeIndex ? '#5B8DEF' : '#CBD5E1' }} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.3 }} className='w-2.5 h-2.5 md:w-3 md:h-3 rounded-full' style={{ border: 'none', cursor: 'pointer' }} />
            ))}
          </div>
          <motion.button onClick={() => setActiveIndex((prev) => (prev + 1) % cards.length)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className='w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center' style={{ backgroundColor: 'white', boxShadow: '0 4px 12px rgba(91, 141, 239, 0.15)', border: 'none', cursor: 'pointer' }}>
            <svg width='18' height='18' viewBox='0 0 20 20' fill='none' className='md:w-5 md:h-5'>
              <path d='M8 5L13 10L8 15' stroke='#5B8DEF' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
});

const ChatSection = memo(function ChatSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [scrollY, setScrollY] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const baseMessages = [
    { type: 'assistant', text: '¡Hola! Soy ARKIA, tu asistente virtual. ¿En qué puedo ayudarte hoy?', sender: 'ARKIA' },
    { type: 'user', text: '¿Qué certificados tengo próximos a vencer?' },
    { type: 'assistant', text: 'Tienes 3 certificados que vencen en los próximos 60 días: Certificado energético del edificio A (vence el 15 de marzo), Revisión de ascensor del edificio B (vence el 22 de marzo) y Certificado PCI del edificio C (vence el 5 de abril). ¿Quieres que programe las renovaciones?', sender: 'ARKIA' },
    { type: 'user', text: '¿Cuánto me costaría mejorar la eficiencia energética del edificio A?' },
    { type: 'assistant', text: 'Basándome en las características del edificio A, mejorar de calificación D a B requeriría una inversión aproximada de €85,000. El ahorro energético estimado es de €12,000 anuales, con retorno de inversión en 7 años. ¿Quieres ver un desglose detallado de las mejoras recomendadas?', sender: 'ARKIA' },
    { type: 'user', text: 'Dame un resumen del estado de toda mi cartera' },
    { type: 'assistant', text: 'Tu cartera cuenta con 27 propiedades. Estado general: 22 propiedades con todos los certificados al día, 3 con certificados próximos a vencer, 2 requieren inspecciones. Calificación energética media: C. Valor total estimado: €8.2M. 5 propiedades tienen potencial de mejora con ROI superior al 15%.', sender: 'ARKIA' }
  ];

  const messages = [...baseMessages, ...baseMessages, ...baseMessages];

  useAnimationFrame((_t, delta) => {
    if (isInView) {
      setScrollY((prev) => {
        const speed = 15;
        const newScroll = prev + (delta / 1000) * speed;
        const messageHeight = baseMessages.length * 100;
        if (newScroll >= messageHeight) return 0;
        return newScroll;
      });
    }
  });

  const features = [
    { number: '1', icon: Zap, title: 'Respuestas Instantáneas', subtitle: 'Información de tu cartera al momento', description: 'Pregunta lo que necesites sobre tus propiedades y obtén respuestas inmediatas. Consulta el estado de certificados, próximos vencimientos, historial de mantenimiento o cualquier dato de tu cartera. Como tener un experto disponible 24/7.', color: '#5B8DEF', bgColor: '#E0EDFF', iconColor: '#5B8DEF' },
    { number: '2', icon: TrendingUp, title: 'Informes Personalizados', subtitle: 'Genera reportes profesionales con un mensaje', description: 'Pide informes específicos y los generas al instante. Reportes de cumplimiento, análisis de riesgos, estado de la cartera o comparativas entre propiedades. Documentación lista para compartir con inversores o reguladores.', color: '#5B8DEF', bgColor: '#E0EDFF', iconColor: '#5B8DEF' },
    { number: '3', icon: Bell, title: 'Recomendaciones Inteligentes', subtitle: 'Consejos prácticos para mejorar tu gestión', description: 'Recibe sugerencias sobre qué acciones tomar con tus propiedades. El asistente analiza tu cartera y te recomienda mejoras, te avisa de oportunidades y te guía en la toma de decisiones para optimizar tu inversión.', color: '#5B8DEF', bgColor: '#E0EDFF', iconColor: '#5B8DEF' }
  ];

  return (
    <section ref={ref} className='px-4 md:px-6 py-10 sm:py-12 md:py-20'>
      <div className='max-w-7xl mx-auto'>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4 }} className='text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight mb-2 sm:mb-3 md:mb-4 text-center px-2' style={{ color: '#5B8DEF', fontWeight: 600, lineHeight: '1.3' }}>
          Tu Asistente Virtual Inmobiliario
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.05 }} className='text-center mb-8 sm:mb-10 md:mb-14 max-w-3xl mx-auto text-sm sm:text-base px-2' style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}>
          Pregunta lo que necesites sobre tu cartera inmobiliaria. Obtén análisis, informes y recomendaciones personalizadas al instante
        </motion.p>

        <div className='grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start'>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}>
            <Card className='border-0 overflow-hidden relative rounded-[20px] lg:bg-white lg:shadow-[0_4px_24px_rgba(91,141,239,0.12)]' style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #FAFBFC 100%)', boxShadow: '0 8px 32px rgba(91, 141, 239, 0.15)', border: '1px solid rgba(91, 141, 239, 0.08)' }}>
              <div className='px-4 sm:px-5 py-3 sm:py-4 border-b relative overflow-hidden lg:bg-[#5B8DEF]' style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #6B9DF7 100%)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className='lg:hidden absolute inset-0 opacity-10 pointer-events-none' style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
                <div className='flex items-center gap-2 sm:gap-3 relative z-10'>
                  <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 lg:bg-white lg:shadow-[0_2px_8px_rgba(0,0,0,0.1)] lg:border-0' style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F6FF 100%)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', border: '2px solid rgba(255, 255, 255, 0.5)' }}>
                    <span className='text-xs sm:text-sm lg:text-[0.85rem]' style={{ color: '#5B8DEF', fontWeight: 700, letterSpacing: '-0.02em' }}>AR</span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-sm sm:text-base truncate' style={{ color: 'white', fontWeight: 600, marginBottom: '2px' }}>ARKIA</h4>
                    <p className='text-xs truncate' style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Asistente Inmobiliario</p>
                  </div>
                  <div className='flex items-center gap-1 sm:gap-1.5 flex-shrink-0'>
                    <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full' style={{ backgroundColor: '#4ECCA3' }} />
                    <span className='text-xs hidden sm:inline' style={{ color: 'rgba(255, 255, 255, 0.9)' }}>En línea</span>
                  </div>
                </div>
              </div>
              <div className='p-3 sm:p-4 md:p-5 relative h-[300px] sm:h-[350px] md:h-[450px]' style={{ overflow: 'hidden', backgroundColor: '#FAFBFC' }}>
                <motion.div className='space-y-3.5' style={{ y: -scrollY }}>
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className='max-w-[85%] px-3 sm:px-4 py-2 sm:py-2.5' style={{ backgroundColor: message.type === 'assistant' ? '#5B8DEF' : 'white', color: message.type === 'assistant' ? 'white' : '#334155', borderRadius: message.type === 'assistant' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', boxShadow: message.type === 'assistant' ? '0 2px 8px rgba(91, 141, 239, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.06)' }}>
                        <p className='text-xs sm:text-sm' style={{ fontWeight: 400, lineHeight: '1.5' }}>{message.text}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              <div className='px-3 sm:px-4 py-2.5 sm:py-3 border-t' style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
                <div className='flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full' style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB' }}>
                  <span className='text-xs sm:text-sm flex-1 truncate' style={{ color: '#9CA3AF' }}>Escribe tu mensaje...</span>
                  <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0' style={{ backgroundColor: '#5B8DEF' }}>
                    <svg className='w-3.5 h-3.5 sm:w-4 sm:h-4' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <line x1='22' y1='2' x2='11' y2='13'></line>
                      <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className='relative'>
            <div className='absolute left-6 lg:left-8 top-0 bottom-0 w-0.5' style={{ backgroundColor: '#CBD5E1', display: 'block' }} />
            <div className='space-y-4 sm:space-y-5 md:space-y-6'>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isExpanded = expandedIndex === index;
                const cardRef = useRef(null);
                const cardInView = useInView(cardRef, { once: true, margin: '0px' });
                
                return (
                  <motion.div key={index} ref={cardRef} initial={{ opacity: 0, x: 30 }} animate={cardInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.3, delay: index * 0.1 }} className='relative'>
                    <div className='absolute left-4 lg:left-5 top-5 lg:top-6 w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 rounded-full flex items-center justify-center z-10' style={{ backgroundColor: feature.color, boxShadow: `0 0 0 3px ${feature.color}15` }}>
                      <span className='text-xs' style={{ color: 'white', fontWeight: 600 }}>{feature.number}</span>
                    </div>
                    <div onMouseEnter={() => setExpandedIndex(index)} onMouseLeave={() => setExpandedIndex(null)} className='ml-11 lg:ml-14 xl:ml-20 cursor-pointer'>
                      <Card className='p-4 lg:p-5 xl:p-6 border-0 overflow-hidden transition-all duration-300 relative rounded-[18px] lg:rounded-[20px] lg:bg-white' style={{ background: isExpanded ? 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FD 100%)' : 'white', boxShadow: isExpanded ? '0 12px 40px rgba(91, 141, 239, 0.2)' : '0 4px 20px rgba(91, 141, 239, 0.1)', border: '1px solid rgba(91, 141, 239, 0.08)' }}>
                        <div className='lg:hidden absolute top-0 right-0 w-16 h-16 opacity-20 pointer-events-none' style={{ background: `radial-gradient(circle at top right, ${feature.color}40 0%, transparent 70%)` }} />
                        <div className='flex items-start gap-2.5 lg:gap-3 xl:gap-4 relative'>
                          <motion.div animate={{ scale: isExpanded ? 1.1 : 1, rotate: isExpanded ? 5 : 0 }} transition={{ duration: 0.3 }} className='flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-xl flex items-center justify-center shadow-sm lg:shadow-none lg:border-0' style={{ background: `linear-gradient(135deg, ${feature.color}10 0%, ${feature.color}CC 100%)`, border: `1px solid ${feature.color}20`, backgroundColor: feature.bgColor }}>
                            <Icon className='w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7' style={{ color: feature.iconColor }} />
                          </motion.div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-xs mb-0.5 lg:mb-1 uppercase tracking-wider' style={{ color: '#94A3D3', fontWeight: 500, letterSpacing: '0.08em' }}>{feature.subtitle}</p>
                            <h3 className='text-sm lg:text-base xl:text-lg mb-1.5 lg:mb-2' style={{ color: '#1E293B', fontWeight: 600, lineHeight: '1.3' }}>{feature.title}</h3>
                            <motion.p animate={{ height: isExpanded ? 'auto' : '2.5rem' }} transition={{ duration: 0.3 }} className='text-xs lg:text-sm leading-relaxed overflow-hidden' style={{ color: '#64748B', fontWeight: 400, lineHeight: '1.6' }}>{feature.description}</motion.p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});


// --- Main App Component ---

export default function Landing() {
  return (
    <div className='min-h-screen overflow-x-hidden' style={{ backgroundColor: '#FFFFFF' }}>
      <Hero />
      <FeaturesSection />
      <SecuritySection />
      <ChatSection />
      <CookieConsent />
    </div>
  );
}
