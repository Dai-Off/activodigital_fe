import { motion } from "motion/react";

const regulations = [
  {
    name: "EPBD (Energy Performance of Buildings Directive)",
    status: "100% Compliant",
    coverage: "47/47 activos",
    nextAudit: "Q4 2026",
    color: "#0ea5e9",
  },
  {
    name: "CSRD (Corporate Sustainability Reporting Directive)",
    status: "En Implementación",
    coverage: "32/47 activos",
    nextAudit: "Q2 2026",
    color: "#0ea5e9",
    areas: [
      { nombre: "Sistemas HVAC" },
      { nombre: "Envolvente térmica" },
      { nombre: "Administración" },
    ],
  },
  {
    name: "Taxonomía EU",
    status: "Cumplimiento Verificado",
    coverage: "47/47 activos",
    nextAudit: "Q3 2026",
    color: "#0ea5e9",
  },
  {
    name: "GDPR (Protección de Datos)",
    status: "Certificado",
    coverage: "Todas las operaciones",
    nextAudit: "Q1 2027",
    color: "#0ea5e9",
  },
];

const certifications = [
  {
    cert: "LEED Platinum",
    properties: 12,
    percentage: 25.5,
  },
  {
    cert: "LEED Gold",
    properties: 18,
    percentage: 38.3,
  },
  {
    cert: "BREEAM Excellent",
    properties: 10,
    percentage: 21.3,
  },
  {
    cert: "WELL Building",
    properties: 7,
    percentage: 14.9,
  },
];

export function PlataformaCompliance() {
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
              Plataforma / Compliance
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Cumplimiento <span className="font-semibold">Automatizado</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Sistema integral de gestión regulatoria y normativa. Auditoría continua, 
              reporting automático y alertas tempranas para garantizar el cumplimiento total.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Compliance Dashboard */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Estado de Cumplimiento Normativo
            </h2>
            <p className="text-gray-600">Monitorización en tiempo real de todas las regulaciones aplicables</p>
          </motion.div>

          {/* Regulatory Overview */}
          <div className="grid gap-6 mb-16">
            {regulations.map((reg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{reg.name}</h3>
                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                          Estado
                        </div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: reg.color }}
                        >
                          {reg.status}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                          Cobertura
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {reg.coverage}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                          Próxima Auditoría
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {reg.nextAudit}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: reg.color }}
                  />
                </div>
                {reg.areas && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-500">Áreas de Aplicación:</h4>
                    <ul className="list-disc list-inside">
                      {reg.areas.map((area, areaIdx) => (
                        <li key={areaIdx} className="text-sm text-gray-600">
                          {area.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Certifications Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-3xl font-light text-gray-900 mb-8">
              Certificaciones Sostenibles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-1">
                        {cert.cert}
                      </h4>
                      <div className="text-sm text-gray-500">
                        {cert.properties} propiedades ({cert.percentage}%)
                      </div>
                    </div>
                    <div className="text-3xl font-semibold text-[#0ea5e9]">
                      {cert.properties}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2">
                    <div
                      className="bg-[#0ea5e9] h-2"
                      style={{ width: `${cert.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Auditoría Continua",
                desc: "Monitorización 24/7 de más de 120 puntos de control regulatorio con alertas automáticas ante desviaciones.",
              },
              {
                title: "Reporting Automático",
                desc: "Generación de informes de cumplimiento listos para reguladores con un solo clic. Templates homologados.",
              },
              {
                title: "Registro de Evidencias",
                desc: "Blockchain-based audit trail con timestamping inmutable para trazabilidad completa de todas las acciones.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 border-l-2 border-[#0ea5e9] p-6"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EPBD Compliance Section */}
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
              Módulo EPBD Especializado
            </h2>
            <p className="text-gray-600">
              Cumplimiento Energy Performance of Buildings Directive
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
                Certificación Energética
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Clase A", count: 26, percentage: 55 },
                  { label: "Clase B", count: 14, percentage: 30 },
                  { label: "Clase C", count: 7, percentage: 15 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-900">{item.label}</span>
                      <span className="text-gray-600">
                        {item.count} activos ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-3">
                      <div
                        className="bg-[#0ea5e9] h-3 transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
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
                Plan de Renovación
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Inversión Requerida</div>
                  <div className="text-3xl font-semibold text-gray-900">€4.2M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Ahorro Energético Esperado</div>
                  <div className="text-3xl font-semibold text-[#0ea5e9]">32%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Payback Period</div>
                  <div className="text-3xl font-semibold text-gray-900">6.8 años</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* EPBD Features */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Cálculo automático de consumo energético",
              "Simulación de mejoras y ROI",
              "Generación de EPC certificates",
              "Monitorización IoT en tiempo real",
              "Reporting a autoridades locales",
              "Base de datos de proveedores certificados",
              "Tracking de incentivos y subvenciones",
              "Compliance con MEPS (Minimum Energy Performance Standards)",
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-6 hover:border-[#0ea5e9] transition-colors duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#0ea5e9] mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ESG Section */}
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
              ESG & Taxonomía Europea
            </h2>
            <p className="text-gray-600">Reporting sostenible y cumplimiento CSRD</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: "Environmental",
                score: 85,
                metrics: [
                  "Emisiones de CO2: -28% vs baseline",
                  "Consumo de agua: -15% YoY",
                  "Residuos reciclados: 82%",
                  "Energía renovable: 45%",
                ],
              },
              {
                category: "Social",
                score: 78,
                metrics: [
                  "Satisfacción inquilinos: 4.6/5",
                  "Accesibilidad universal: 100%",
                  "Espacios verdes: 12,400 m²",
                  "Certificación WELL: 7 edificios",
                ],
              },
              {
                category: "Governance",
                score: 92,
                metrics: [
                  "Transparencia financiera: AAA",
                  "Diversidad en gestión: 45%",
                  "Auditorías independientes: 3/año",
                  "Compliance GDPR: Certificado",
                ],
              },
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">{pillar.category}</h3>
                  <div className="text-4xl font-semibold text-[#0ea5e9]">
                    {pillar.score}
                  </div>
                </div>
                <ul className="space-y-3">
                  {pillar.metrics.map((metric, metricIdx) => (
                    <li key={metricIdx} className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="w-1 h-1 bg-[#0ea5e9] mt-2 flex-shrink-0" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration & Automation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-12">
              Integraciones y Automatización
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                "Catastro y Registros Públicos",
                "APIs de Organismos Reguladores",
                "Sistemas de Building Management (BMS)",
                "Plataformas IoT de Sensores",
                "ERPs de Gestión Inmobiliaria",
                "Proveedores de Certificaciones",
                "Bases de Datos Jurídicas",
                "Software de Auditoría Externa",
              ].map((integration, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-200 p-6 text-center hover:border-[#0ea5e9] transition-colors duration-300"
                >
                  <div className="text-sm text-gray-700">{integration}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}