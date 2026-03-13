import { motion } from "motion/react";

export function SolucionesAuditoria() {
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
              Auditorías / Regulatoria
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Auditoría <span className="font-semibold">Regulatoria EPBD</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Cumplimiento normativo europeo con análisis de brecha EPBD 2030 y seguimiento de MEVs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Monitorización Cumplimiento */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Monitorización del cumplimiento normativo EPBD
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Control centralizado del estado regulatorio de todo el portfolio inmobiliario
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ¿Qué rastrea el sistema?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700">Estado de cumplimiento de normativas aplicables al edificio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700">Nivel de implementación de MEVs según RD 390/2021</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700">Vigencia de certificados energéticos obligatorios</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700">Incidencias detectadas en inspecciones IEE/ITE</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Ventaja competitiva
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Tener visibilidad consolidada del cumplimiento normativo de decenas de edificios permite 
                  identificar rápidamente qué activos tienen riesgo regulatorio y necesitan actuación prioritaria. 
                  Esto evita sorpresas en auditorías externas y facilita el reporting ESG a inversores institucionales.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gap Analysis */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Gap Analysis: Brecha regulatoria EPBD 2030
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Análisis de la distancia exacta entre el estado actual y los objetivos obligatorios
            </p>

            <div className="bg-white border border-gray-200 p-6 md:p-12 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                ¿Qué compara el análisis de brecha?
              </h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <h4 className="text-lg font-semibold text-gray-900">Consumo energético</h4>
                  </div>
                  <p className="text-gray-700 ml-5 leading-relaxed">
                    Compara el consumo actual del edificio (expresado en kWh/m²·año) con el objetivo obligatorio 
                    establecido por la Directiva EPBD para 2030. Identifica cuántos kWh/m²·año debe reducir el 
                    edificio para alcanzar la clase D exigida.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <h4 className="text-lg font-semibold text-gray-900">Emisiones de CO₂</h4>
                  </div>
                  <p className="text-gray-700 ml-5 leading-relaxed">
                    Compara las emisiones actuales (en kg CO₂eq/m²·año) con los límites normativos. Calcula 
                    cuántos kilogramos de CO₂ por metro cuadrado debe reducir el edificio para cumplir.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] text-white p-8">
              <h3 className="text-xl font-semibold mb-4">
                ¿Por qué es crítico para fondos de inversión?
              </h3>
              <p className="leading-relaxed text-white/90">
                Conocer con años de antelación la brecha exacta permite planificar inversiones CAPEX sin 
                sorpresas. Un edificio que hoy está 20 kWh/m²·año por encima del objetivo 2030 necesitará 
                rehabilitación energética antes de esa fecha, o se depreciará y será difícil de comercializar. 
                Esta visibilidad anticipada es clave para la estrategia del fondo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Normativas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Normativas aplicables rastreadas
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Tres marcos regulatorios clave para edificios comerciales y residenciales
            </p>

            <div className="space-y-6">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Directiva UE 2024/1275 - EPBD IV
                </h3>
                <p className="text-gray-700 mb-4">
                  Eficiencia energética de edificios. Establece que para 2030 todos los edificios residenciales 
                  deben alcanzar como mínimo clase D, y para 2033 la clase D mínima.
                </p>
                <div className="bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Impacto:</strong> Define los objetivos obligatorios que ARKIA rastrea en el Gap Analysis
                  </p>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Real Decreto 390/2021
                </h3>
                <p className="text-gray-700 mb-4">
                  Procedimiento básico para la certificación energética de edificios. Define las seis MEVs 
                  (Medidas de Eficiencia de Vivienda) que deben considerarse en rehabilitaciones.
                </p>
                <div className="bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Impacto:</strong> ARKIA registra el estado de implementación de cada MEV por edificio
                  </p>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ley 7/2021 de Cambio Climático
                </h3>
                <p className="text-gray-700 mb-4">
                  Normativa climática española que fija la reducción del 23% de emisiones de gases de efecto 
                  invernadero para 2030 respecto a 1990.
                </p>
                <div className="bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Impacto:</strong> Marca objetivos de descarbonización que afectan al sector inmobiliario
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MEVs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              MEVs - Medidas de Eficiencia de Vivienda
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Seis medidas definidas por el Real Decreto 390/2021 que ARKIA rastrea por edificio
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* MEV 01 */}
              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl font-bold text-[#0ea5e9]">01</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Aislamiento Térmico de Envolvente
                  </h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Mejora del aislamiento en fachadas, cubiertas y medianerías.
                </p>
                <div className="bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <strong>El sistema registra:</strong> Estado actual del aislamiento, ahorro potencial 
                    en kWh/m²·año, reducción estimada de CO₂
                  </p>
                </div>
              </div>

              {/* MEV 02 */}
              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl font-bold text-[#0ea5e9]">02</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sustitución de Carpinterías Exteriores
                  </h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Cambio de ventanas y puertas a modelos con rotura de puente térmico.
                </p>
                <div className="bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <strong>El sistema registra:</strong> Si la carpintería es antigua, ahorro energético 
                    proyectado de sustituirla
                  </p>
                </div>
              </div>

              {/* MEV 03 */}
              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl font-bold text-[#0ea5e9]">03</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sistemas de Climatización Eficientes
                  </h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Calderas de condensación, bombas de calor, sistemas VRV.
                </p>
                <div className="bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <strong>El sistema registra:</strong> Si está implementada, ahorro real ya conseguido 
                    en consumo y emisiones
                  </p>
                </div>
              </div>

              {/* MEV 04 */}
              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl font-bold text-[#0ea5e9]">04</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Iluminación LED de Alta Eficiencia
                  </h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Sustitución completa a luminarias LED optimizadas.
                </p>
                <div className="bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <strong>El sistema registra:</strong> Porcentaje de implementación LED, ahorro 
                    energético logrado
                  </p>
                </div>
              </div>

              {/* MEV 05 */}
              <div className="bg-white border-l-4 border-gray-800 p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl font-bold text-gray-900">05</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Integración de Energías Renovables
                  </h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Instalación de fotovoltaica, solar térmica o geotermia.
                </p>
                <div className="bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <strong>El sistema registra:</strong> Potencial de ahorro significativo (20-35 kWh/m²·año) 
                    si se implementa
                  </p>
                </div>
              </div>

              {/* MEV 06 */}
              <div className="bg-white border-l-4 border-[#0ea5e9] p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl font-bold text-[#0ea5e9]">06</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sistemas de Control y Gestión Energética
                  </h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Domótica, sensores de presencia, termostatos inteligentes.
                </p>
                <div className="bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <strong>El sistema registra:</strong> Nivel de control (básico/avanzado), ahorro 
                    adicional posible
                  </p>
                </div>
              </div>
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
              ¿Por qué es crítico para fondos de inversión?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Planificación CAPEX anticipada
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Conocer con años de antelación qué edificios no cumplirán EPBD 2030 permite planificar 
                  inversiones en rehabilitación sin sorpresas presupuestarias de última hora.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Evitar depreciación de activos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Edificios que no cumplan normativa 2030 se depreciarán y serán difíciles de comercializar. 
                  La trazabilidad de MEVs documenta el valor añadido en rehabilitaciones.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#0ea5e9] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reporting ESG automatizado
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Toda la información de cumplimiento EPBD está lista para presentar a comités de inversión, 
                  reguladores y auditorías ESG sin recopilar datos manualmente.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}