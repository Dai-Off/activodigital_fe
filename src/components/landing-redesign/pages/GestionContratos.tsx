import { motion } from "motion/react";

export function GestionContratos() {
  const tiposDocumentos = [
    {
      categoria: "Contratos de Arrendamiento",
      cantidad: 156,
      vigentes: 148,
      porVencer: 12,
      vencidos: 0,
      items: ["Contrato firmado", "Anexos y modificaciones", "Fianzas depositadas", "Comunicaciones inquilino", "Histórico de pagos"],
    },
    {
      categoria: "Contratos de Servicios",
      cantidad: 89,
      vigentes: 85,
      porVencer: 4,
      vencidos: 0,
      items: ["Mantenimiento HVAC", "Limpieza", "Seguridad", "Jardinería", "Telecomunicaciones"],
    },
    {
      categoria: "Pólizas de Seguros",
      cantidad: 52,
      vigentes: 50,
      porVencer: 2,
      vencidos: 0,
      items: ["Seguro continente", "Seguro contenido", "RC general", "Daños y rotura", "Impago alquileres"],
    },
    {
      categoria: "Escrituras y Registros",
      cantidad: 47,
      vigentes: 47,
      porVencer: 0,
      vencidos: 0,
      items: ["Escritura compraventa", "Nota simple registral", "Registro catastro", "Cargas y gravámenes", "Historial transmisiones"],
    },
    {
      categoria: "Licencias y Permisos",
      cantidad: 134,
      vigentes: 128,
      porVencer: 6,
      vencidos: 0,
      items: ["Licencia actividad", "Licencia obras", "Permisos municipales", "Autorizaciones especiales", "Declaraciones responsables"],
    },
    {
      categoria: "Certificados Obligatorios",
      cantidad: 267,
      vigentes: 245,
      porVencer: 18,
      vencidos: 4,
      items: ["CEE", "ITE/IEE", "Instalación eléctrica", "Gas natural", "Ascensores", "Contra incendios"],
    },
    {
      categoria: "Facturas y Recibos",
      cantidad: 2847,
      vigentes: 2847,
      porVencer: 0,
      vencidos: 0,
      items: ["Suministros (agua, luz, gas)", "Comunidad propietarios", "IBI y tasas", "Servicios contratados", "Reparaciones"],
    },
  ];

  const proximosVencimientos = [
    {
      tipo: "Contrato Arrendamiento",
      edificio: "Torre Picasso Offices - Unidad 3B",
      inquilino: "TechCorp Solutions SL",
      fechaVencimiento: "25 Ene 2026",
      diasRestantes: 7,
      valorAnual: "€48,000",
      estado: "Renovación pendiente",
      prioridad: "Alta",
    },
    {
      tipo: "Póliza Seguro",
      edificio: "Plaza Shopping Center",
      proveedor: "AXA Seguros",
      fechaVencimiento: "02 Feb 2026",
      diasRestantes: 15,
      valorAnual: "€28,500",
      estado: "Por renovar",
      prioridad: "Alta",
    },
    {
      tipo: "Certificado CEE",
      edificio: "Residencial Malasaña",
      certificador: "Certificación Energética SA",
      fechaVencimiento: "12 Feb 2026",
      diasRestantes: 25,
      valorAnual: "€1,200",
      estado: "Requiere inspección",
      prioridad: "Crítica",
    },
    {
      tipo: "Contrato Servicio",
      edificio: "Centro Logístico Norte",
      proveedor: "Limpieza Industrial Pro",
      fechaVencimiento: "20 Feb 2026",
      diasRestantes: 33,
      valorAnual: "€18,600",
      estado: "Negociación renovación",
      prioridad: "Media",
    },
    {
      tipo: "Licencia Actividad",
      edificio: "Plaza Shopping Center - Local 12",
      titular: "Restaurante La Esquina",
      fechaVencimiento: "28 Feb 2026",
      diasRestantes: 41,
      valorAnual: "€850",
      estado: "Renovación automática",
      prioridad: "Baja",
    },
  ];

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Crítica": return "#ef4444";
      case "Alta": return "#0ea5e9";
      case "Media": return "#0ea5e9";
      default: return "#0ea5e9";
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">{/* Added relative */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Gestión / Documentación</div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Contratos y <span className="font-semibold">Documentos</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Centralización completa de documentación: contratos de arrendamiento y servicios, pólizas de seguros, 
              escrituras, licencias, certificados y facturas. Con alertas de vencimiento y firma digital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Document Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Categorías de Documentos</h2>
            <p className="text-gray-600">3,592 documentos gestionados en total</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {tiposDocumentos.map((tipo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{tipo.categoria}</h3>
                    <div className="text-4xl font-bold text-[#0ea5e9] mb-1">{tipo.cantidad}</div>
                    <div className="text-sm text-gray-500">documentos totales</div>
                  </div>
                  <div className="text-right">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#0ea5e9]" />
                        <span className="text-gray-600">Vigentes: <strong>{tipo.vigentes}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#0ea5e9]" />
                        <span className="text-gray-600">Por vencer: <strong>{tipo.porVencer}</strong></span>
                      </div>
                      {tipo.vencidos > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#ef4444]" />
                          <span className="text-gray-600">Vencidos: <strong>{tipo.vencidos}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-3">Incluye</div>
                  <ul className="space-y-2">
                    {tipo.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#0ea5e9] mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full mt-6 py-3 border border-[#0ea5e9] text-[#0ea5e9] text-sm font-semibold uppercase tracking-wider hover:bg-[#0ea5e9] hover:text-white transition-colors">
                  Ver Documentos
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Expirations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Próximos Vencimientos</h2>
            <p className="text-gray-600">Contratos y documentos que requieren atención</p>
          </motion.div>

          <div className="space-y-4">
            {proximosVencimientos.map((vencimiento, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border-l-4 p-6 hover:shadow-md transition-shadow duration-300"
                style={{ borderLeftColor: getPrioridadColor(vencimiento.prioridad) }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="px-3 py-1 bg-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-700">
                        {vencimiento.tipo}
                      </div>
                      <div
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
                        style={{ backgroundColor: getPrioridadColor(vencimiento.prioridad) }}
                      >
                        {vencimiento.prioridad}
                      </div>
                      <div className="text-sm text-gray-500">
                        Vence en <strong className="text-gray-900">{vencimiento.diasRestantes} días</strong>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{vencimiento.edificio}</h3>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          {vencimiento.inquilino ? "Inquilino" : vencimiento.proveedor ? "Proveedor" : vencimiento.certificador ? "Certificador" : "Titular"}
                        </div>
                        <div className="text-gray-900 font-semibold">
                          {vencimiento.inquilino || vencimiento.proveedor || vencimiento.certificador || vencimiento.titular}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Fecha Vencimiento</div>
                        <div className="text-gray-900 font-semibold">{vencimiento.fechaVencimiento}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Valor Anual</div>
                        <div className="text-gray-900 font-semibold">{vencimiento.valorAnual}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estado</div>
                        <div className="text-gray-900 font-semibold">{vencimiento.estado}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 ml-6">
                    <button className="px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      Ver Documento
                    </button>
                    <button className="px-4 py-2 bg-[#0ea5e9] text-white text-sm font-semibold hover:bg-[#0ea5e9]/90 transition-colors">
                      Renovar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Funcionalidades de Gestión Documental</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Almacenamiento Seguro en la Nube",
                desc: "Todos los documentos encriptados y accesibles 24/7. Backup automático y redundancia geográfica.",
              },
              {
                title: "Control de Versiones",
                desc: "Mantenga historial completo de todas las versiones de cada documento con trazabilidad.",
              },
              {
                title: "Clasificación Automática",
                desc: "IA que clasifica y etiqueta documentos automáticamente por tipo, edificio y categoría.",
              },
              {
                title: "Búsqueda Inteligente",
                desc: "Encuentre cualquier documento en segundos. Búsqueda por texto, fecha, edificio o categoría.",
              },
              {
                title: "Alertas de Vencimiento",
                desc: "Notificaciones automáticas 30/15/7 días antes del vencimiento. Nunca pierda una renovación.",
              },
              {
                title: "Acceso Controlado por Roles",
                desc: "Permisos granulares. Controle quién puede ver, editar o eliminar cada tipo de documento.",
              },
              {
                title: "Firma Digital",
                desc: "Firme contratos digitalmente con validez legal. Integración con certificados digitales.",
              },
              {
                title: "Trazabilidad Completa",
                desc: "Registro de quién accedió, modificó o descargó cada documento. Auditoría completa.",
              },
              {
                title: "Exportación e Integración",
                desc: "Exporte a PDF, ZIP o integre con sistemas externos vía API. Compatible con ERPs y CRMs.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
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