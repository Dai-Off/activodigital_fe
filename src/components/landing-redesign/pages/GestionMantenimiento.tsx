import { motion } from "motion/react";

export function GestionMantenimiento() {
  const tiposMantenimiento = [
    {
      tipo: "Preventivo",
      descripcion: "Mantenimientos programados según calendario",
      frecuencia: "Mensual / Trimestral / Anual",
      cantidad: 328,
      proximosMes: 42,
      costoPromedio: "€850",
      color: "#0ea5e9",
    },
    {
      tipo: "Correctivo",
      descripcion: "Reparaciones e incidencias puntuales",
      frecuencia: "Bajo demanda",
      cantidad: 156,
      proximosMes: 8,
      costoPromedio: "€1,240",
      color: "#0ea5e9",
    },
    {
      tipo: "Predictivo (IA)",
      descripcion: "Mantenimientos sugeridos por análisis IA",
      frecuencia: "Recomendaciones automáticas",
      cantidad: 48,
      proximosMes: 12,
      costoPromedio: "€2,100",
      color: "#0ea5e9",
    },
  ];

  const proximosMantenimientos = [
    {
      tipo: "Preventivo",
      titulo: "Revisión HVAC Trimestral",
      edificio: "Plaza Shopping Center",
      fecha: "20 Ene 2026",
      proveedor: "Clima Solutions SL",
      costo: "€1,850",
      estado: "Programado",
      prioridad: "Media",
    },
    {
      tipo: "Preventivo",
      titulo: "Mantenimiento Ascensores",
      edificio: "Torre Picasso Offices",
      fecha: "22 Ene 2026",
      proveedor: "Ascensores Otis",
      costo: "€680",
      estado: "Confirmado",
      prioridad: "Alta",
    },
    {
      tipo: "Correctivo",
      titulo: "Reparación Fuga Fontanería",
      edificio: "Residencial Malasaña - Unidad 2A",
      fecha: "19 Ene 2026",
      proveedor: "Fontanería Express",
      costo: "€420",
      estado: "Urgente",
      prioridad: "Crítica",
    },
    {
      tipo: "Predictivo IA",
      titulo: "Sustitución Bomba Calor (Predicción)",
      edificio: "Centro Logístico Norte",
      fecha: "28 Ene 2026",
      proveedor: "Clima Solutions SL",
      costo: "€3,200",
      estado: "Recomendado",
      prioridad: "Alta",
    },
    {
      tipo: "Preventivo",
      titulo: "Inspección Contra Incendios",
      edificio: "Edificio Modernista BCN",
      fecha: "30 Ene 2026",
      proveedor: "Seguridad Total SA",
      costo: "€540",
      estado: "Programado",
      prioridad: "Alta",
    },
  ];

  const proveedores = [
    {
      nombre: "Clima Solutions SL",
      especialidad: "HVAC y Climatización",
      edificiosAsignados: 18,
      intervencionesMes: 24,
      satisfaccion: 4.8,
      tiempoRespuesta: "2h",
    },
    {
      nombre: "Ascensores Otis",
      especialidad: "Ascensores",
      edificiosAsignados: 32,
      intervencionesMes: 32,
      satisfaccion: 4.9,
      tiempoRespuesta: "4h",
    },
    {
      nombre: "Fontanería Express",
      especialidad: "Fontanería y Saneamiento",
      edificiosAsignados: 28,
      intervencionesMes: 18,
      satisfaccion: 4.6,
      tiempoRespuesta: "1h",
    },
    {
      nombre: "Eléctrica Industrial",
      especialidad: "Instalaciones Eléctricas",
      edificiosAsignados: 22,
      intervencionesMes: 15,
      satisfaccion: 4.7,
      tiempoRespuesta: "3h",
    },
    {
      nombre: "Jardinería Verde",
      especialidad: "Jardinería y Paisajismo",
      edificiosAsignados: 12,
      intervencionesMes: 12,
      satisfaccion: 4.5,
      tiempoRespuesta: "24h",
    },
  ];

  const costosAnalisis = {
    totalAnual: "€1,245,000",
    preventivo: "€682,000",
    correctivo: "€428,000",
    predictivo: "€135,000",
    ahorroIA: "€89,000",
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">{/* Added relative */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Gestión / Mantenimiento</div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Mantenimiento <span className="font-semibold">Preventivo y Correctivo</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Sistema completo de gestión de mantenimiento: preventivo programado, correctivo bajo demanda 
              y predictivo con IA. Control de proveedores, costes y garantías activas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Types Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Tipos de Mantenimiento</h2>
            <p className="text-gray-600">3 categorías gestionadas en la plataforma</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiposMantenimiento.map((tipo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-2 p-8 hover:shadow-xl transition-shadow duration-300"
                style={{ borderColor: tipo.color }}
              >
                <div className="text-6xl font-bold mb-2" style={{ color: tipo.color }}>
                  {tipo.cantidad}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{tipo.tipo}</h3>
                <p className="text-sm text-gray-600 mb-6">{tipo.descripcion}</p>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frecuencia:</span>
                    <span className="font-semibold text-gray-900">{tipo.frecuencia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Próximos 30 días:</span>
                    <span className="font-semibold" style={{ color: tipo.color }}>{tipo.proximosMes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coste promedio:</span>
                    <span className="font-semibold text-gray-900">{tipo.costoPromedio}</span>
                  </div>
                </div>

                <button
                  className="w-full py-3 text-white text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: tipo.color }}
                >
                  Ver Calendario
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Maintenance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Próximos Mantenimientos</h2>
            <p className="text-gray-600">Programación de los próximos 30 días</p>
          </motion.div>

          <div className="space-y-4">
            {proximosMantenimientos.map((mant, idx) => {
              const colorMap: Record<string, string> = {
                Preventivo: "#0ea5e9",
                Correctivo: "#0ea5e9",
                "Predictivo IA": "#0ea5e9",
              };
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white border-l-4 p-6 hover:shadow-md transition-shadow duration-300"
                  style={{ borderLeftColor: colorMap[mant.tipo] }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
                          style={{ backgroundColor: colorMap[mant.tipo] }}
                        >
                          {mant.tipo}
                        </div>
                        <div
                          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                            mant.prioridad === "Crítica"
                              ? "bg-[#ef4444] text-white"
                              : mant.prioridad === "Alta"
                              ? "bg-[#0ea5e9] text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {mant.prioridad}
                        </div>
                        <div
                          className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                            mant.estado === "Urgente"
                              ? "bg-[#ef4444] text-white"
                              : mant.estado === "Confirmado"
                              ? "bg-[#0ea5e9] text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {mant.estado}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{mant.titulo}</h3>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Edificio</div>
                          <div className="text-gray-900 font-semibold">{mant.edificio}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Fecha</div>
                          <div className="text-gray-900 font-semibold">{mant.fecha}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Proveedor</div>
                          <div className="text-gray-900 font-semibold">{mant.proveedor}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Coste Estimado</div>
                          <div className="text-gray-900 font-semibold">{mant.costo}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 ml-6">
                      <button className="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        Editar
                      </button>
                      <button className="px-4 py-2 bg-[#0ea5e9] text-white text-sm font-semibold hover:bg-[#0ea5e9]/90 transition-colors">
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Suppliers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Proveedores Activos</h2>
            <p className="text-gray-600">24 proveedores gestionados en total</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {proveedores.map((proveedor, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{proveedor.nombre}</h3>
                    <p className="text-sm text-gray-500">{proveedor.especialidad}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-[#0ea5e9]">{proveedor.satisfaccion}</span>
                    <span className="text-xl text-[#0ea5e9]">★</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Edificios</div>
                    <div className="text-xl font-semibold text-gray-900">{proveedor.edificiosAsignados}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Interv./Mes</div>
                    <div className="text-xl font-semibold text-gray-900">{proveedor.intervencionesMes}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Respuesta</div>
                    <div className="text-xl font-semibold text-[#0ea5e9]">{proveedor.tiempoRespuesta}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Analysis */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Análisis de Costes</h2>
            <p className="text-gray-600">Distribución anual del presupuesto de mantenimiento</p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="bg-white border-2 border-[#0ea5e9] p-8 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Total Anual</div>
              <div className="text-4xl font-bold text-[#0ea5e9]">{costosAnalisis.totalAnual}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.05 }} viewport={{ once: true }} className="bg-white border border-gray-200 p-8 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Preventivo</div>
              <div className="text-3xl font-bold text-[#0ea5e9]">{costosAnalisis.preventivo}</div>
              <div className="text-xs text-gray-500 mt-1">55% del total</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="bg-white border border-gray-200 p-8 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Correctivo</div>
              <div className="text-3xl font-bold text-[#0ea5e9]">{costosAnalisis.correctivo}</div>
              <div className="text-xs text-gray-500 mt-1">34% del total</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }} className="bg-white border border-gray-200 p-8 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Predictivo IA</div>
              <div className="text-3xl font-bold text-[#0ea5e9]">{costosAnalisis.predictivo}</div>
              <div className="text-xs text-gray-500 mt-1">11% del total</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/80 p-8 text-center text-white">
              <div className="text-xs uppercase tracking-wider text-white/70 mb-2">Ahorro IA</div>
              <div className="text-3xl font-bold">{costosAnalisis.ahorroIA}</div>
              <div className="text-xs text-white/80 mt-1">vs correctivo puro</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Funcionalidades Destacadas</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Plan Preventivo Automatizado", desc: "Calendario automático según especificaciones de cada equipo y recomendaciones del fabricante." },
              { title: "Predicción con IA", desc: "Análisis predictivo que identifica fallos antes de que ocurran, reduciendo costes correctivos." },
              { title: "Gestión de Proveedores", desc: "Base de datos completa con ratings, tiempos de respuesta y costes históricos." },
              { title: "Historial de Incidencias", desc: "Registro completo de todas las intervenciones realizadas por edificio y equipo." },
              { title: "Control de Garantías", desc: "Alertas de garantías activas. Ahorre costes utilizando coberturas antes de que expiren." },
              { title: "Órdenes de Trabajo Digitales", desc: "Generación, asignación y seguimiento de OTs con firma digital del proveedor." },
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
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}