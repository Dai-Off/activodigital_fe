import { motion } from "motion/react";

export function ActivoEnergia() {
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
              Activo / Energía
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Eficiencia <span className="font-semibold">Energética</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Gestión completa de certificación energética, cumplimiento normativo, libro del edificio y plan de mejoras con ROI calculado
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
              El caos de gestionar certificados energéticos de 50 edificios
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Property managers que pierden certificados, incumplen normativa y desconocen oportunidades de mejora
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Certificados vencidos sin saberlo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Tienes 50 edificios. El certificado energético de uno venció hace 3 meses. No tienes sistema de alertas. El inquilino principal te lo comunica cuando ya estás en incumplimiento normativo. Multa: 600€ + urgencia en renovación sin comparar proveedores.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Libro del edificio incompleto
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El LP pregunta: "¿Está el Libro del Edificio actualizado?". No lo sabes. Buscas en carpetas. Encuentras versión de 2019. Faltan 4 de las 8 secciones obligatorias. Auditoría interna detecta incumplimiento. El LP cuestiona tu capacidad de gestión.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Oportunidades de mejora invisibles
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Tu edificio tiene calificación D. Podrías llegar a B con inversión de 35.000€ y ahorro de 6.500€/año (ROI 5.4 años). Hay subvenciones disponibles por 15.000€. No lo sabes porque nadie analiza el informe completo del certificador.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certificación y Calificación */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Certificación Energética Centralizada
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA consolida toda la información de certificación energética de cada edificio en una vista única
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-3xl font-semibold mb-6">
                Valor para el Portfolio
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Un edificio con certificación energética A y Libro del Edificio actualizado tiene mayor valor de mercado, menores costes operativos, mejor posicionamiento para venta o refinanciación, y cumplimiento normativo garantizado ante auditorías.
              </p>
              <p className="text-white/90 leading-relaxed">
                ARKIA te permite demostrar ante inversores que tu portfolio no solo cumple la normativa, sino que estás gestionando activamente la eficiencia energética con plan de mejoras cuantificado y retorno de inversión calculado. Esto diferencia tu gestión de la de cualquier competidor que solo archiva certificados en carpetas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cumplimiento por Tipología
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  ARKIA verifica automáticamente que el edificio cumple con los requisitos específicos de su tipología (oficinas, residencial, comercial, industrial). El sistema marca en verde si cumple 100% de los requisitos normativos o alerta en rojo las deficiencias detectadas.
                </p>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Alertas de vencimiento
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El certificado energético tiene validez de 10 años (o menos según normativa actualizada). ARKIA te alerta 6 meses antes del vencimiento para que puedas renovar con tiempo, comparar proveedores y evitar multas por incumplimiento.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Libro del Edificio */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Libro del Edificio Digitalizado
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Gestión completa del Libro del Edificio con seguimiento de tareas pendientes
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="border-l-4 border-[#0ea5e9] pl-6 mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    8 secciones obligatorias
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    El Libro del Edificio debe contener: Documentación administrativa, Certificados (energético, instalaciones), Instalaciones (electricidad, fontanería, climatización), Mantenimiento, Seguros, Contratos, Legal, Financiero. ARKIA verifica el estado de cada sección.
                  </p>
                </div>

                <div className="border-l-4 border-[#0ea5e9] pl-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Control de actualización
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    El sistema registra la última fecha de actualización del Libro del Edificio y el número de tareas completadas vs pendientes (ejemplo: 8/8 tareas). Así sabes en todo momento si el documento está al día o requiere actualizaciones.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-10">
                <h3 className="text-2xl font-semibold mb-6">
                  Estado completo en tiempo real
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-white/90">Documentación</span>
                    <span className="text-[#0ea5e9] font-semibold">OK</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-white/90">Certificados</span>
                    <span className="text-[#0ea5e9] font-semibold">OK</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-white/90">Instalaciones</span>
                    <span className="text-[#0ea5e9] font-semibold">OK</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-white/90">Mantenimiento</span>
                    <span className="text-[#0ea5e9] font-semibold">OK</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-white/90">Seguros</span>
                    <span className="text-[#0ea5e9] font-semibold">OK</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-white/90">Contratos</span>
                    <span className="text-[#0ea5e9] font-semibold">OK</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-white/90">Legal</span>
                    <span className="text-[#0ea5e9] font-semibold">OK</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/90">Financiero</span>
                    <span className="text-[#0ea5e9] font-semibold">OK</span>
                  </div>
                </div>
                <p className="text-sm text-white/70 mt-6 pt-6 border-t border-white/20">
                  Última actualización: 14/11/2024 | Tareas completadas: 8/8
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Oportunidades de Mejora */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Oportunidades de Mejora con ROI
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA analiza el informe del certificador y calcula el retorno de inversión de cada mejora propuesta
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-8 h-8 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Actualización aislamiento térmico
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Mejora del aislamiento en fachadas y cubiertas para reducir pérdidas térmicas y mejorar eficiencia energética global del edificio.
                </p>
                <div className="bg-[#0ea5e9]/10 p-4 rounded">
                  <div className="text-sm text-gray-600">Ahorro estimado</div>
                  <div className="text-2xl font-bold text-[#0ea5e9]">15% (€3,200/año)</div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-8 h-8 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Instalación paneles solares
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Sistema fotovoltaico para autoconsumo que reduce dependencia de la red eléctrica y costes energéticos operativos.
                </p>
                <div className="bg-[#0ea5e9]/10 p-4 rounded">
                  <div className="text-sm text-gray-600 mb-2">ROI: 6.5 años</div>
                  <div className="text-lg font-bold text-[#0ea5e9]">Subvención disponible: €25,000</div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-8 h-8 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Sistema gestión energética
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Plataforma de monitorización en tiempo real para detectar consumos anómalos y optimizar uso de instalaciones.
                </p>
                <div className="bg-[#0ea5e9]/10 p-4 rounded">
                  <div className="text-sm text-gray-600">Funcionalidad</div>
                  <div className="text-2xl font-bold text-[#0ea5e9]">Monitorización | Ahorro: 8%</div>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-8 h-8 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Mejora climatización HVAC
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  Sustitución de equipos obsoletos por sistemas de alta eficiencia con control inteligente por zonas y horarios.
                </p>
                <div className="bg-[#0ea5e9]/10 p-4 rounded">
                  <div className="text-sm text-gray-600">Ganancia de eficiencia</div>
                  <div className="text-2xl font-bold text-[#0ea5e9]">+20%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}