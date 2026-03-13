import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

const pillars = [
  {
    id: 1,
    title: "Auditoría Regulatoria",
    subtitle: "EPBD Compliance / IA",
    description: "Cumplimiento normativo europeo automatizado con análisis predictivo de eficiencia energética, certificaciones ESG y reporting CSRD.",
    features: ["Certificación Energética", "Análisis EPBD", "Reporting ESG", "Compliance Automático"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Gestión Operacional",
    subtitle: "Documentos & Contratos",
    description: "Centralización inteligente de documentación técnica, contratos de arrendamiento, mantenimiento predictivo y gestión de inquilinos.",
    features: ["Gestión Documental", "Contratos Digitales", "Mantenimiento Predictivo", "CRM Inquilinos"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Análisis Financiero IA",
    subtitle: "ROI Predictivo & Valoración",
    description: "Machine Learning aplicado a valoración de activos, predicción de flujos de caja, optimización de portfolio y benchmarking de mercado.",
    features: ["Valoración Automatizada", "Cash Flow Forecast", "Portfolio Optimization", "Market Intelligence"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
  },
];

export function ThreePillars() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section
      id="soluciones"
      ref={ref}
      className="relative min-h-screen w-full snap-start overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="relative z-20 pt-24 pb-12 px-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-sm uppercase tracking-[0.3em] text-[#9ca3af] mb-4">
            Tres Pilares
          </div>
          <h2 className="text-6xl md:text-7xl font-light text-[#0a0a0a] mb-6 leading-tight">
            Soluciones <span className="font-semibold">Integrales</span>
          </h2>
        </motion.div>
      </div>

      {/* Three Columns */}
      <div className="relative flex-1 flex">
        {pillars.map((pillar) => {
          const isHovered = hoveredId === pillar.id;
          const isOtherHovered = hoveredId !== null && !isHovered;

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      width: isHovered ? "50%" : isOtherHovered ? "25%" : "33.333%",
                    }
                  : {}
              }
              transition={{
                opacity: { duration: 0.6 },
                width: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
              }}
              onMouseEnter={() => setHoveredId(pillar.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative cursor-pointer overflow-hidden"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <motion.img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.7 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-12 text-white">
                <motion.div
                  animate={{
                    opacity: isHovered ? 1 : 0.95,
                  }}
                >
                  <div className="text-xs uppercase tracking-[0.3em] mb-4 text-white/60">
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-4xl font-light mb-6 leading-tight">
                    {pillar.title}
                  </h3>

                  {/* Description - Only on hover */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      height: isHovered ? "auto" : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <p className="text-base text-white/90 font-light mb-6 leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2">
                      {pillar.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            x: isHovered ? 0 : -20,
                          }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex items-center gap-3 text-sm text-white/80"
                        >
                          <div className="w-1 h-1 bg-white/60" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Hover Line Indicator */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] bg-[#0ea5e9]"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
                style={{ originX: 0 }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}