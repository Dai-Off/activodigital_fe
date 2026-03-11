import { motion } from "motion/react";

export function SolucionesGestion() {
  const modules = [
    {
      title: "Gestión Financiera",
      desc: "Ingresos, gastos, ROI y cash flow mensual/anual",
      items: ["Contratos arrendamiento", "Rentas y pagos", "Gastos operativos", "IBI y tasas", "Seguros", "Suministros", "Cash flow tracking"],
    },
    {
      title: "Contratos y Documentos",
      desc: "Centralización de toda la documentación legal y técnica",
      items: ["Contratos de arrendamiento", "Pólizas de seguros", "Escrituras y registros", "Licencias y permisos", "Certificados", "Facturas y recibos", "Firma digital"],
    },
    {
      title: "Mantenimiento",
      desc: "Plan preventivo, correctivo e historial completo",
      items: ["Mantenimiento preventivo", "Incidencias correctivas", "Proveedores asignados", "Costes y presupuestos", "Garantías activas", "Calendario de actuaciones", "Manuales de equipos"],
    },
    {
      title: "Administración Pública",
      desc: "Trámites, licencias y obligaciones municipales",
      items: ["IBI y tasas municipales", "Licencia de actividad", "Cédula de habitabilidad", "Inspecciones municipales", "Expedientes administrativos", "Plazos y vencimientos", "Documentación legal"],
    },
    {
      title: "Gestión de Unidades",
      desc: "Control de todas las unidades del edificio",
      items: ["Estado ocupación", "Datos inquilinos", "Contratos vigentes", "Fianzas depositadas", "Historial de ocupación", "Rotación y vacantes", "Renta por unidad"],
    },
    {
      title: "Calendario Centralizado",
      desc: "Agenda de eventos, tareas y vencimientos",
      items: ["Mantenimientos programados", "Vencimientos contratos", "Inspecciones técnicas", "Pagos IBI/seguros", "Reuniones inquilinos", "Alertas automáticas", "Sincronización equipos"],
    },
  ];

  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">{/* Added relative */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Soluciones / Gestión Operacional</div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">Gestión <span className="font-semibold">Diaria</span></h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Centralice toda la gestión operativa: documentación financiera/contable, contratos, mantenimiento y administración pública en una única plataforma.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Módulos de Gestión</h2>
            <p className="text-gray-600">Todo lo necesario para la administración del día a día</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {modules.map((module, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-500 mb-6">{module.desc}</p>
                <ul className="space-y-2">
                  {module.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3 text-sm text-gray-600">
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

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Beneficios Clave</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Centralización Total", desc: "Toda la información en un solo lugar. Sin Excel, sin correos, sin documentación física dispersa." },
              { title: "Alertas Automáticas", desc: "Nunca más olvide un vencimiento. Sistema proactivo de notificaciones 30/15/7 días antes." },
              { title: "Acceso Móvil 24/7", desc: "Gestione desde cualquier dispositivo. Consultas, aprobaciones y firmas digitales en cualquier lugar." },
              { title: "Control de Costes", desc: "Visibilidad completa de gastos por edificio, categoría y período. Identifique desviaciones al instante." },
              { title: "Trazabilidad Completa", desc: "Historial de todas las acciones. Quién hizo qué y cuándo para auditorías y compliance." },
              { title: "Integración Contable", desc: "Exportación directa a ERPs. API para sincronización automática con sistemas de contabilidad." },
            ].map((benefit, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.1 }} viewport={{ once: true }} className="bg-white border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}