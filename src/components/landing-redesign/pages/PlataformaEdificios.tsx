import { motion } from "motion/react";

export function PlataformaEdificios() {
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
              Plataforma / Gestión de Activos
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Gestión <span className="font-semibold">de Activos</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deja de gestionar 50 edificios con información desperdigada en 20 Excels y 15 carpetas compartidas
            </p>
          </motion.div>
        </div>
      </section>

      {/* El problema */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              El caos de gestionar portfolios sin sistema centralizado
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Property managers que pierden 15+ horas semanales buscando información dispersa
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Información en 20 lugares diferentes
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Certificados energéticos en un Excel del técnico. Contratos en carpeta Drive. Facturas en otro Excel. Mantenimiento en email del proveedor. Tardas 45 minutos buscando un dato que debería tomar 10 segundos.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No sabes qué pasa en cada edificio sin preguntar
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El LP te pregunta: "¿Qué certificados vencen este trimestre?". No lo sabes sin revisar 50 archivos. Llamadas a 3 personas. 2 horas perdidas. El LP piensa que no controlas tu portfolio.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Versiones obsoletas y datos contradictorios
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El Excel de Finance dice ocupación 92%. El Excel de Asset Management dice 88%. ¿Cuál es el real? Nadie lo sabe porque cada uno trabaja con su propia copia desactualizada.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ficha única centralizada */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Ficha única de cada edificio con TODA la información
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA consolida todos los datos de cada activo en una vista única de 360 grados
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                Todo sobre un edificio en una sola pantalla
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Cada edificio tiene su ficha completa que incluye: identificación y datos catastrales, financiero (ingresos, gastos, ROI), unidades y ocupación, certificados energéticos y vencimientos, contratos de arrendamiento y servicios, mantenimiento preventivo y correctivo, auditorías regulatorias y técnicas, calendario de acciones próximas, seguimiento de alertas.
              </p>
              <p className="text-white/90 leading-relaxed">
                Todo está en el mismo sitio. No tienes que abrir 10 Excels y 5 carpetas. Haces click en "Torre Picasso" y ves TODO inmediatamente. Lo que antes te costaba 30 minutos de búsqueda ahora lo tienes en 5 segundos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Vista General: snapshot completo
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Entras en un edificio y ves inmediatamente: eficiencia energética (calificación actual), ocupación (% ocupado y unidades libres), estado técnico (certificados vigentes/vencidos), costes mensuales (desglose OPEX), próximas acciones (mantenimientos, vencimientos), alertas activas (revisiones pendientes, incidencias).
                </p>
                <p className="text-gray-700 text-sm">
                  Sabes exactamente qué necesita atención en cada edificio sin tener que investigar.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Drill-down a cualquier detalle
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Desde la vista general haces click en cualquier módulo y vas al detalle. Click en "Certificados" → ves todos los certificados vigentes y próximos vencimientos. Click en "Costes" → desglose completo de gastos OPEX. Click en "Unidades" → listado con ocupación y rentas.
                </p>
                <p className="text-gray-700 text-sm">
                  Navegación intuitiva desde el resumen consolidado hasta el último detalle en segundos.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Módulos disponibles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              10 módulos especializados por edificio
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Cada área crítica de gestión tiene su módulo dedicado con toda la información necesaria
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📋 Vista General
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Snapshot del edificio con métricas clave: eficiencia energética, ocupación, estado técnico, costes, próximas acciones, alertas activas. Todo lo importante en un vistazo.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ⚡ Eficiencia Energética
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Certificados energéticos, consumos kWh/m², emisiones CO2, cumplimiento EPBD, histórico de certificaciones, plan de mejoras, simulaciones IA de rehabilitación.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💰 Financiero
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ingresos por rentas, gastos OPEX desglosados, inversiones CAPEX, ROI actual, TIR proyectada, comparativa presupuesto vs real, alertas de desviaciones financieras.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🏠 Unidades
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Listado completo de unidades, estado de ocupación, superficies, rentas actuales, contratos vigentes, histórico de inquilinos, unidades libres, próximos vencimientos.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  ✓ Certificados
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Todos los certificados obligatorios (ITE, IEE, gas, electricidad, ascensores), fechas vigencia, próximos vencimientos, alertas automáticas cuando se acerca caducidad.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🔧 Mantenimiento
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Plan preventivo planificado, mantenimientos ejecutados, incidencias correctivas, proveedores activos, histórico de intervenciones, costes acumulados, predicciones IA de fallos.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📄 Contratos
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contratos de arrendamiento con inquilinos, contratos de servicios (limpieza, seguridad), pólizas de seguro, acuerdos con proveedores, vencimientos próximos, renovaciones pendientes.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💵 Rentas
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Listado de todas las rentas activas, importe mensual, fecha cobro, inquilino, unidad, histórico de impagos, previsión de ingresos anuales, comparativa con mercado.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📅 Calendario de Acciones
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Próximas acciones obligatorias: vencimientos certificados, mantenimientos preventivos programados, renovaciones contratos, inspecciones obligatorias, pagos importantes.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🌱 ASG/ESG
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Métricas ambientales (emisiones CO2, consumo energético), sociales (accesibilidad, satisfacción inquilinos), gobernanza (cumplimiento normativo), reporting ESG para LPs.
                </p>
              </div>
            </div>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Toda la información actualizada en tiempo real
              </h3>
              <p className="text-gray-700 leading-relaxed">
                No son datos estáticos de hace 2 semanas. Todo se actualiza automáticamente cuando cambias algo. Si marcas un certificado como renovado, desaparece de la lista de vencimientos y se actualiza en el módulo de cumplimiento. Si registras un mantenimiento, se actualiza el histórico y los costes OPEX. Datos siempre sincronizados sin esfuerzo manual.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vista consolidada portfolio */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Vista consolidada de todo el portfolio
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              No solo ves edificio por edificio. Tienes vista agregada de todos los activos.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Dashboard multi-activo con filtros
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ves la lista completa de edificios con métricas clave: ocupación, certificación energética, valoración, ROI. Filtras por: tipo (residencial, comercial, logístico), ubicación geográfica, certificación energética (A/B/C/D/E), estado ocupación, alertas activas.
                </p>
                <p className="text-gray-700 text-sm">
                  Identificas rápidamente qué edificios necesitan atención: todos los que tienen alertas rojas, todos los con ocupación inferior al 80%, todos los que vencen certificados este trimestre.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Comparativas entre edificios
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Comparas automáticamente performance: ¿qué edificios tienen mejor ROI? ¿Cuáles tienen OPEX anormalmente alto por m²? ¿Cuáles tienen mejor eficiencia energética? ¿Dónde está la ocupación más estable?
                </p>
                <p className="text-gray-700 text-sm">
                  Identificas mejores prácticas que puedes replicar y edificios problemáticos que necesitan plan de acción.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                Búsqueda instantánea de cualquier cosa
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                El LP te pregunta: "¿Qué edificios tienen certificación energética E o inferior?". En lugar de revisar 50 Excels, escribes "certificación E" en el buscador. En 2 segundos ves la lista completa con todos los edificios que cumplen ese criterio.
              </p>
              <p className="text-white/90 leading-relaxed">
                Búsqueda inteligente que encuentra edificios, unidades, contratos, certificados, inquilinos, proveedores. Lo que antes te costaba 30 minutos investigar ahora lo tienes en 10 segundos.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valor para fondos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">
              El impacto real en eficiencia del equipo
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ahorras 15+ horas semanales por gestor
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Lo que antes te costaba 45 minutos buscar (un certificado, una factura, un contrato) ahora lo encuentras en 30 segundos. 3 horas diarias de búsquedas × 5 días = 15 horas semanales ahorradas por persona. Multiplicado por 5 gestores son 75 horas semanales = 3.600 horas anuales ahorradas.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Respondes a LPs en tiempo récord
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  El LP pide datos específicos de 10 edificios. En lugar de tardar 2 días consolidando información, lo tienes en 15 minutos. Generas el informe que necesita y lo envías el mismo día. Eso impresiona. Fondos que responden rápido ganan credibilidad y facilitan renovaciones de mandato.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Eliminas información contradictoria
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Todo el mundo trabaja con la misma fuente de verdad. No más versiones contradictorias. Si Finance ve ocupación 92%, Asset Management ve el mismo 92%. Si alguien actualiza un dato, todos ven la actualización inmediatamente. Cero discrepancias que generan confusión y errores.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                El caso que te va a hundir en due diligence
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Un fondo gestionaba 35 edificios con información dispersa en Excels y carpetas compartidas. Decidieron vender 12 activos. El comprador pidió due diligence completa: certificados energéticos, contratos de arrendamiento, histórico OPEX, estado técnico, ocupación detallada, licencias vigentes.
              </p>
              <p className="text-white/90 leading-relaxed">
                El equipo tardó 6 semanas consolidando toda la información. Durante ese tiempo encontraron que 4 certificados estaban vencidos sin que nadie lo supiera, 2 contratos importantes no estaban digitalizados, y los datos de OPEX de 3 edificios no cuadraban entre diferentes Excels. El comprador perdió confianza. Pidió descuento del 8% por "falta de control operativo". Pérdida de 3,2M€ en valoración porque no tenían sistema centralizado.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}