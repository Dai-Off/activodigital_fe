import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const roiData = [
  { month: "Ene", roi: 6.2, ocupacion: 94 },
  { month: "Feb", roi: 6.8, ocupacion: 95 },
  { month: "Mar", roi: 7.1, ocupacion: 96 },
  { month: "Abr", roi: 7.5, ocupacion: 97 },
  { month: "May", roi: 8.2, ocupacion: 98 },
  { month: "Jun", roi: 8.5, ocupacion: 99 },
];

export function DashboardPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="plataforma"
      ref={ref}
      className="relative min-h-screen w-full snap-start bg-white flex items-center justify-center py-24 overflow-hidden"
    >
      {/* Background Geometric Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0ea5e9] opacity-[0.03]" 
        style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-sm uppercase tracking-[0.3em] text-[#9ca3af] mb-4">
            La Plataforma
          </div>
          <h2 className="text-6xl md:text-7xl font-light text-[#0a0a0a] mb-6 leading-tight">
            Dashboard <span className="font-semibold">Inteligente</span>
          </h2>
          <p className="text-xl text-[#6b7280] font-light max-w-2xl">
            Visualización en tiempo real del rendimiento de sus activos inmobiliarios 
            con predicción basada en Machine Learning y análisis predictivo avanzado.
          </p>
        </motion.div>

        {/* Dashboard Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* ROI Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white border border-gray-200 p-8 hover:shadow-2xl transition-shadow duration-500"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-2">
                  ROI Promedio
                </div>
                <div className="text-5xl font-semibold text-[#0ea5e9]">8.5%</div>
              </div>
              <div className="flex items-center gap-2 text-[#0ea5e9] text-sm">
                <span>↑</span>
                <span>+12.4%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={roiData}>
                <defs>
                  <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="roi"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRoi)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Ocupación Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white border border-gray-200 p-8 hover:shadow-2xl transition-shadow duration-500"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-2">
                  Tasa de Ocupación
                </div>
                <div className="text-5xl font-semibold text-[#0ea5e9]">99.2%</div>
              </div>
              <div className="flex items-center gap-2 text-[#0ea5e9] text-sm">
                <span>↑</span>
                <span>+5.2%</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="ocupacion" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white border border-gray-200 p-8 hover:shadow-2xl transition-shadow duration-500"
          >
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Superficie Total
                </div>
                <div className="text-3xl font-semibold text-[#0a0a0a]">142,450 m²</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Valoración
                </div>
                <div className="text-3xl font-semibold text-[#0a0a0a]">€83.2M</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Activos
                </div>
                <div className="text-3xl font-semibold text-[#0a0a0a]">47</div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Certificación
                </div>
                <div className="text-3xl font-semibold text-[#0ea5e9]">A-Class</div>
              </div>
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 p-8 text-white hover:shadow-2xl transition-shadow duration-500"
          >
            <div className="text-sm uppercase tracking-[0.2em] text-white/70 mb-4">
              AI Insights
            </div>
            <div className="text-2xl font-light mb-6 leading-relaxed">
              Predicción de revalorización del 12.3% en los próximos 6 meses basado en tendencias del mercado
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />
              <span>Actualizado hace 2 minutos</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}