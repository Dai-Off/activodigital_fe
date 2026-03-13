import { motion, useInView } from "motion/react";
import { useRef } from "react";

const metrics = [
  {
    value: "€83.2M",
    label: "Valoración Total Portfolio",
    change: "+12.4%",
    positive: true,
  },
  {
    value: "142,450 m²",
    label: "Superficie Bajo Gestión",
    change: "+8,200 m²",
    positive: true,
  },
  {
    value: "8.5%",
    label: "ROI Promedio Anualizado",
    change: "+1.2%",
    positive: true,
    accent: true,
  },
  {
    value: "47",
    label: "Activos en Portfolio",
    change: "+3",
    positive: true,
  },
  {
    value: "A-Class",
    label: "Certificación Energética Media",
    change: "EPBD Compliant",
    accent: true,
  },
  {
    value: "99.2%",
    label: "Tasa de Ocupación",
    change: "+5.2%",
    positive: true,
    accent: true,
  },
  {
    value: "€14.8M",
    label: "Ingresos Anuales Recurrentes",
    change: "+18.3%",
    positive: true,
  },
  {
    value: "247",
    label: "Inquilinos Activos",
    change: "+12",
    positive: true,
  },
  {
    value: "4.2 años",
    label: "Permanencia Media Inquilinos",
    change: "+0.8 años",
    positive: true,
  },
];

export function MetricsGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="portfolio"
      ref={ref}
      className="relative min-h-screen w-full snap-start bg-white flex items-center justify-center py-24"
    >
      <div className="max-w-7xl mx-auto px-12 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-sm uppercase tracking-[0.3em] text-[#9ca3af] mb-4">
            En Tiempo Real
          </div>
          <h2 className="text-6xl md:text-7xl font-light text-[#0a0a0a] mb-6 leading-tight">
            Métricas <span className="font-semibold">del Portfolio</span>
          </h2>
          <p className="text-xl text-[#6b7280] font-light max-w-3xl">
            KPIs actualizados en tiempo real para decisiones basadas en datos. 
            Integración directa con sistemas de gestión y fuentes de mercado.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white p-10 hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div
                    className={`text-5xl font-semibold mb-4 transition-colors duration-300 ${
                      metric.accent 
                        ? "text-[#0ea5e9] group-hover:text-[#0284c7]" 
                        : "text-[#0a0a0a] group-hover:text-[#0ea5e9]"
                    }`}
                  >
                    {metric.value}
                  </div>
                  <div className="text-sm text-[#6b7280] uppercase tracking-[0.15em] leading-relaxed">
                    {metric.label}
                  </div>
                </div>

                {/* Change Indicator */}
                {metric.change && (
                  <div className={`mt-4 text-xs uppercase tracking-[0.2em] flex items-center gap-2 ${
                    metric.positive ? "text-[#0ea5e9]" : "text-[#9ca3af]"
                  }`}>
                    {metric.positive && <span>↑</span>}
                    <span>{metric.change}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-between mt-12 pt-12 border-t border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
            <span className="text-sm text-[#9ca3af]">Actualizado en tiempo real</span>
          </div>
          <div className="text-sm text-[#9ca3af]">
            Última sincronización: hace 2 minutos
          </div>
        </motion.div>
      </div>
    </section>
  );
}