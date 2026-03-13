import { motion } from "motion/react";

export function CasosFondos() {
  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">{/* Added relative */}
      {/* Hero Header */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
              Casos de Uso / Fondos de Inversión
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Gestión de <span className="font-semibold">Fondos Inmobiliarios</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Solución integral para fondos de inversión inmobiliaria que gestionan portfolios 
              de múltiples activos. Supervisión centralizada, cumplimiento normativo y reporting automático.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Client Profile */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Perfil del Cliente
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Características",
                items: [
                  "Portfolio de 50-500+ activos inmobiliarios",
                  "AUM entre €100M y €5B+",
                  "Diversificación por tipología y geografía",
                  "Equipo de 10-50+ profesionales",
                  "Estrategias value-add y core",
                ],
              },
              {
                title: "Necesidades",
                items: [
                  "Supervisar todo el portfolio en tiempo real",
                  "Cumplir normativa EPBD en todos los activos",
                  "Optimizar ROI de cada propiedad",
                  "Reporting trimestral para inversores",
                  "Identificar oportunidades de mejora",
                ],
              },
              {
                title: "Retos Actuales",
                items: [
                  "Información dispersa en múltiples sistemas",
                  "Falta de visibilidad consolidada",
                  "Cumplimiento manual de normativas",
                  "Informes costosos y lentos de generar",
                  "Dificultad para priorizar inversiones",
                ],
              },
            ].map((block, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {block.title}
                </h3>
                <ul className="space-y-3">
                  {block.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-[#0ea5e9] mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">
              Caso Real
            </div>
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Iberis Capital Partners
            </h2>
            <p className="text-gray-600">
              Fondo de inversión inmobiliaria con €850M AUM y 127 activos en España
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Situación Inicial
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong className="text-gray-900">Problema principal:</strong> Gestión 
                  descentralizada de 127 edificios con información en Excel, correos y 
                  documentación física.
                </p>
                <p>
                  <strong className="text-gray-900">Consecuencias:</strong>
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ef4444]">•</span>
                    <span>6 vencimientos de contratos perdidos (€45K/año en pérdidas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ef4444]">•</span>
                    <span>Incumplimiento EPBD en 12 edificios (riesgo de sanciones)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ef4444]">•</span>
                    <span>Informes trimestrales tardaban 15 días en prepararse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ef4444]">•</span>
                    <span>Sin visibilidad de oportunidades de mejora energética</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Solución con ARKIA
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong className="text-gray-900">Implementación:</strong> Onboarding 
                  completo de 127 activos en 5 semanas con migración de datos históricos.
                </p>
                <p>
                  <strong className="text-gray-900">Módulos activados:</strong>
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0ea5e9]">✓</span>
                    <span>Dashboard consolidado con vista de todo el portfolio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0ea5e9]">✓</span>
                    <span>Auditoría EPBD automatizada en los 127 edificios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0ea5e9]">✓</span>
                    <span>Alertas automáticas de vencimientos y renovaciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0ea5e9]">✓</span>
                    <span>Informes personalizados para inversores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0ea5e9]">✓</span>
                    <span>Análisis IA de mejoras energéticas con ROI</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 p-6 md:p-12 text-white"
          >
            <h3 className="text-3xl font-semibold mb-8">Resultados en 12 Meses</h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  value: "€280K",
                  label: "Ahorros Identificados",
                  desc: "Mejoras energéticas + optimización contratos",
                },
                {
                  value: "92%",
                  label: "Reducción Tiempo",
                  desc: "Informes trimestrales de 15 días a 1 día",
                },
                {
                  value: "100%",
                  label: "Cumplimiento EPBD",
                  desc: "Todos los activos certificados y conformes",
                },
                {
                  value: "€1.2M",
                  label: "Financiación Verde",
                  desc: "Acceso a subvenciones Next Generation EU",
                },
              ].map((result, idx) => (
                <div key={idx}>
                  <div className="text-5xl font-semibold mb-2">{result.value}</div>
                  <div className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">
                    {result.label}
                  </div>
                  <div className="text-sm text-white/80">{result.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features for Funds */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Funcionalidades Clave para Fondos
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Dashboard Consolidado Multi-Activo",
                features: [
                  "Vista de todo el portfolio en una sola pantalla",
                  "KPIs consolidados (ocupación, ROI, cash flow)",
                  "Drill-down desde portfolio hasta unidad individual",
                  "Filtros por tipología, ubicación, estrategia",
                  "Comparativas entre activos",
                  "Alertas priorizadas por impacto financiero",
                ],
              },
              {
                title: "Reporting Automático para Inversores",
                features: [
                  "Informes trimestrales/anuales automáticos",
                  "Templates personalizables con branding",
                  "Datos en tiempo real (sin desfases)",
                  "Gráficos y visualizaciones profesionales",
                  "Comparativa con período anterior",
                  "Exportación a PDF/Excel/PowerPoint",
                ],
              },
              {
                title: "Análisis Financiero Avanzado",
                features: [
                  "ROI por activo con desglose detallado",
                  "TIR calculada automáticamente",
                  "Cash flow proyectado a 12/24/36 meses",
                  "Análisis de sensibilidad (escenarios)",
                  "Comparativa con benchmarks de mercado",
                  "Identificación de activos infraperformantes",
                ],
              },
              {
                title: "Cumplimiento Normativo Centralizado",
                features: [
                  "Auditoría EPBD en todos los activos",
                  "Alertas de vencimientos (certificados, contratos)",
                  "Tracking de inspecciones obligatorias (ITE/IEE)",
                  "Gestión documental centralizada",
                  "Trazabilidad completa de compliance",
                  "Preparación automática para auditorías",
                ],
              },
              {
                title: "Inteligencia Artificial Aplicada",
                features: [
                  "Sugerencias de mejoras EPBD con ROI calculado",
                  "Priorización de rehabilitaciones por rentabilidad",
                  "Predicción de vencimientos y rotación",
                  "Detección de anomalías en gastos",
                  "Optimización de portfolio (compra/venta)",
                  "Análisis predictivo de riesgos",
                ],
              },
              {
                title: "Gestión de Equipos Distribuidos",
                features: [
                  "Roles y permisos granulares por usuario",
                  "Asignación de edificios por gestor",
                  "Calendario compartido de eventos",
                  "Notificaciones personalizadas",
                  "Log de actividad completo",
                  "Acceso móvil 24/7",
                ],
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8 hover:border-[#0ea5e9] transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {feature.title}
                </h3>
                <ul className="space-y-3">
                  {feature.features.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-[#0ea5e9] mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Retorno de Inversión Estimado
            </h2>
            <p className="text-gray-600">
              Cálculo basado en portfolio de €500M AUM con 100 activos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Inversión Anual
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Licencia ARKIA (100 activos)</span>
                  <span className="text-xl font-semibold text-gray-900">€45,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Onboarding e implementación</span>
                  <span className="text-xl font-semibold text-gray-900">€12,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Formación del equipo</span>
                  <span className="text-xl font-semibold text-gray-900">€3,000</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-semibold text-gray-900">TOTAL INVERSIÓN</span>
                  <span className="text-3xl font-bold text-[#0ea5e9]">€60,000</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 p-8"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Ahorros y Beneficios Anuales
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Reducción tiempo informes (80%)</span>
                  <span className="text-xl font-semibold text-[#0ea5e9]">€48,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Evitar sanciones compliance</span>
                  <span className="text-xl font-semibold text-[#0ea5e9]">€35,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Optimización contratos/gastos</span>
                  <span className="text-xl font-semibold text-[#0ea5e9]">€125,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Acceso financiación verde</span>
                  <span className="text-xl font-semibold text-[#0ea5e9]">€200,000</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-semibold text-gray-900">TOTAL BENEFICIOS</span>
                  <span className="text-3xl font-bold text-[#0ea5e9]">€408,000</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-8 bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/80 p-6 md:p-12 text-white text-center"
          >
            <div className="text-sm uppercase tracking-[0.3em] text-white/70 mb-2">
              ROI Neto Año 1
            </div>
            <div className="text-4xl md:text-7xl font-bold mb-4">€348,000</div>
            <div className="text-2xl font-light mb-6">
              Retorno de 580% sobre la inversión
            </div>
            <div className="text-white/80">
              Payback period: &lt; 2 meses
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-8">"</div>
            <blockquote className="text-2xl font-light text-gray-700 mb-8 leading-relaxed">
              ARKIA ha transformado completamente nuestra operativa. Pasamos de dedicar 2 semanas 
              a preparar informes trimestrales a tenerlos listos en un clic. La IA nos identificó 
              €1.2M en oportunidades de mejora que ni siquiera habíamos considerado.
            </blockquote>
            <div className="text-gray-900 font-semibold text-lg">Carlos Mendoza</div>
            <div className="text-gray-500">Director de Activos, Iberis Capital Partners</div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}