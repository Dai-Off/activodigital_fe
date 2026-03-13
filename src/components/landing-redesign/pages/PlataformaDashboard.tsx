import { motion } from "motion/react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts";

const roiData = [
  { month: "Ene", roi: 6.2, benchmark: 5.8 },
  { month: "Feb", roi: 6.8, benchmark: 6.1 },
  { month: "Mar", roi: 7.1, benchmark: 6.3 },
  { month: "Abr", roi: 7.5, benchmark: 6.5 },
  { month: "May", roi: 8.2, benchmark: 6.8 },
  { month: "Jun", roi: 8.5, benchmark: 7.0 },
];

const ocupacionData = [
  { mes: "Ene", ocupacion: 94.2 },
  { mes: "Feb", ocupacion: 95.1 },
  { mes: "Mar", ocupacion: 96.3 },
  { mes: "Abr", ocupacion: 97.8 },
  { mes: "May", ocupacion: 98.4 },
  { mes: "Jun", ocupacion: 99.2 },
];

export function PlataformaDashboard() {
  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">
      {/* Hero Header */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
              Plataforma / Dashboard
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Dashboard <span className="font-semibold">Inteligente</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Centro de comando unificado para la gestión de su portfolio inmobiliario. 
              Visualización en tiempo real, KPIs personalizables y alertas predictivas basadas en IA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Vista General del Portfolio
            </h2>
            <p className="text-gray-600">Métricas consolidadas de todos sus activos</p>
          </motion.div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              {
                label: "Valoración Total",
                value: "€83.2M",
                change: "+12.4%",
                positive: true,
              },
              {
                label: "ROI Promedio",
                value: "8.5%",
                change: "+1.2%",
                positive: true,
              },
              {
                label: "Ocupación",
                value: "99.2%",
                change: "+5.2%",
                positive: true,
              },
              {
                label: "Cap Rate",
                value: "5.8%",
                change: "+0.3%",
                positive: true,
              },
            ].map((kpi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-6 md:p-8"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
                  {kpi.label}
                </div>
                <div className="text-4xl font-semibold text-gray-900 mb-2">{kpi.value}</div>
                <div className={`text-sm flex items-center gap-2 ${kpi.positive ? "text-[#0ea5e9]" : "text-[#0ea5e9]"}`}>
                  <span>{kpi.positive ? "↑" : "↓"}</span>
                  <span>{kpi.change}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {/* ROI Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 p-8"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ROI vs Benchmark
                </h3>
                <p className="text-sm text-gray-500">Rendimiento comparativo 6M</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="roi"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ fill: "#0ea5e9", r: 5 }}
                    name="Su Portfolio"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Benchmark"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Ocupación Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 p-8"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tasa de Ocupación
                </h3>
                <p className="text-sm text-gray-500">Evolución mensual</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ocupacionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="mes" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} domain={[90, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0",
                    }}
                  />
                  <Bar dataKey="ocupacion" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Portfolio Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Distribución del Portfolio
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Por Tipología
                </div>
                <div className="space-y-3">
                  {[
                    { type: "Oficinas", percent: 45, value: "€37.4M" },
                    { type: "Retail", percent: 30, value: "€25.0M" },
                    { type: "Logística", percent: 25, value: "€20.8M" },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.type}</span>
                        <span className="text-gray-900 font-semibold">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2">
                        <div
                          className="bg-[#0ea5e9] h-2"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Por Ubicación
                </div>
                <div className="space-y-3">
                  {[
                    { location: "Madrid", percent: 40, value: "€33.3M" },
                    { location: "Barcelona", percent: 35, value: "€29.1M" },
                    { location: "Valencia", percent: 25, value: "€20.8M" },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.location}</span>
                        <span className="text-gray-900 font-semibold">{item.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2">
                        <div
                          className="bg-[#0ea5e9] h-2"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Por Certificación
                </div>
                <div className="space-y-3">
                  {[
                    { cert: "A-Class", percent: 55, count: "26 activos" },
                    { cert: "B-Class", percent: 30, count: "14 activos" },
                    { cert: "C-Class", percent: 15, count: "7 activos" },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.cert}</span>
                        <span className="text-gray-900 font-semibold">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2">
                        <div
                          className="bg-[#0ea5e9] h-2"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Funcionalidades Clave
            </h2>
            <p className="text-gray-600">Todo lo que necesitas en un solo lugar</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Actualización en Tiempo Real",
                desc: "Sincronización automática con fuentes de datos externas y sistemas ERP. Visualización instantánea de cambios en métricas.",
              },
              {
                title: "KPIs Personalizables",
                desc: "Configure dashboards específicos para cada stakeholder. Widgets drag & drop con más de 50 métricas disponibles.",
              },
              {
                title: "Alertas Inteligentes",
                desc: "Notificaciones predictivas basadas en IA. Detección temprana de riesgos y oportunidades de optimización.",
              },
              {
                title: "Drill-Down Completo",
                desc: "Navegación desde portfolio hasta propiedad individual. Acceso inmediato a documentación y contratos.",
              },
              {
                title: "Comparativas y Benchmarking",
                desc: "Análisis competitivo con datos de mercado. Identificación de activos con rendimiento superior o inferior.",
              },
              {
                title: "Exportación Avanzada",
                desc: "Informes automáticos en PDF, Excel y PowerPoint. Templates personalizables para inversores y reguladores.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-6 md:p-8 hover:border-[#0ea5e9] transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}