import { motion } from "motion/react";

export function AuditoriaTecnica() {
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
              Auditorías / Técnica
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Auditoría <span className="font-semibold">Técnica</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Libro del Edificio Digital con recomendaciones técnicas priorizadas y ROI calculado
            </p>
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
              Estado del Libro del Edificio
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Documentación técnica completa centralizada y digitalizada
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ¿Qué incluye el Libro Digital?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700">Porcentaje de completitud del libro (cuánto está documentado)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700">Número de tareas completadas vs pendientes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700">Fecha de última actualización</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700">Acceso centralizado a toda la documentación técnica</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Estado de Instalaciones
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema muestra el estado operativo de todas las instalaciones críticas del edificio.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Documentación:</strong> Planos, manuales técnicos, proyectos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Certificados:</strong> ITE, IEE, eléctrico, gas, ascensores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Instalaciones:</strong> Estado de HVAC, fontanería, electricidad</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Mantenimiento:</strong> Registro de actuaciones realizadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Seguros:</strong> Pólizas vigentes y coberturas</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Cada área tiene estado visual claro
              </h3>
              <p className="text-gray-700 leading-relaxed">
                ARKIA marca cada área como "OK" (documentación completa y vigente) o "Pendiente" (requiere 
                actualización o falta documentación). Esto permite identificar de un vistazo qué necesita 
                atención inmediata antes de una inspección o auditoría técnica.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Recomendaciones técnicas priorizadas con ROI
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Sistema inteligente de priorización basado en retorno de inversión
            </p>

            <div className="bg-white border border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ¿Cómo funciona el sistema de recomendaciones?
              </h3>
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  ARKIA analiza el estado de las instalaciones y genera automáticamente recomendaciones de mejora 
                  técnica personalizadas para cada edificio. El sistema puede recomendar cualquier tipo de actuación: 
                  desde cambios en iluminación, climatización, envolvente térmica, hasta instalaciones de energías 
                  renovables, sistemas de control, mejoras en instalaciones hidráulicas, o actualizaciones de 
                  seguridad.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  Cada recomendación generada incluye <strong>tres datos económicos clave</strong>:
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  <div className="bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Coste estimado</h4>
                    <p className="text-sm text-gray-600">
                      Inversión inicial necesaria para ejecutar la mejora, calculada según precios de mercado 
                      actualizados y dimensiones del edificio.
                    </p>
                  </div>
                  
                  <div className="bg-[#0ea5e9]/10 p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">ROI (Retorno de Inversión)</h4>
                    <p className="text-sm text-gray-600">
                      Período en años en que la inversión se recupera mediante el ahorro generado. Las 
                      recomendaciones se priorizan por ROI más favorable.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Ahorro energético proyectado</h4>
                    <p className="text-sm text-gray-600">
                      Reducción de consumo expresada en kWh/m²·año, calculada según normativa vigente y 
                      características del edificio.
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mt-6">
                  El algoritmo ordena automáticamente las recomendaciones por orden de prioridad, considerando el ROI, 
                  el impacto en la certificación energética, la urgencia técnica detectada en la inspección, y la 
                  facilidad de implementación sin afectar la operativa del edificio.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Información adicional por recomendación
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cada recomendación incluye también: descripción técnica detallada, proveedores recomendados, 
                presupuestos comparativos de diferentes opciones, plazo de ejecución estimado, impacto en la 
                certificación energética del edificio, y cálculo financiero completo con payback period y ahorro 
                anual proyectado.
              </p>
              <p className="text-gray-700 leading-relaxed">
                El sistema permite descargar fichas técnicas de cada actuación para presentar a comités de inversión 
                o incluir en estudios de viabilidad.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impacto Total */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Impacto total consolidado
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Análisis agregado de todas las recomendaciones implementadas conjuntamente
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                Cómo analiza las 6 áreas de un edificio
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold mb-1">Reducción total de consumo energético</div>
                        <div className="text-white/80 text-sm">Por ejemplo: -58 kWh/m²·año sumando todas las mejoras</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold mb-1">Reducción total de emisiones CO₂</div>
                        <div className="text-white/80 text-sm">Por ejemplo: -11.4 kg CO₂eq/m²·año (-68% emisiones)</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold mb-1">Inversión total necesaria</div>
                        <div className="text-white/80 text-sm">Suma de todas las actuaciones recomendadas</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold mb-1">Ahorro anual esperado</div>
                        <div className="text-white/80 text-sm">En euros, considerando reducción de gastos energéticos</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold mb-1">Salto de calificación energética</div>
                        <div className="text-white/80 text-sm">Por ejemplo: de clase E a clase A+</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold mb-1">ROI global del paquete</div>
                        <div className="text-white/80 text-sm">Periodo de retorno considerando todas las mejoras</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Decisión estratégica informada
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Este análisis consolidado permite al comité de inversión ver el ROI global y decidir si implementar 
                el paquete completo de actuaciones, o priorizar solo algunas medidas según la estrategia del fondo 
                (maximizar rentabilidad, cumplir normativa al mínimo coste, o priorizar rating ESG).
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cronograma */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Cronograma de implementación
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Planificación plurianual con fases lógicas de ejecución
            </p>

            <div className="bg-white border border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Criterios de priorización en el cronograma
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#0ea5e9] mb-2">1º</div>
                  <div className="font-semibold text-gray-900 mb-2">ROI más corto</div>
                  <p className="text-sm text-gray-600">Iluminación LED, optimización aguas</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#0ea5e9] mb-2">2º</div>
                  <div className="font-semibold text-gray-900 mb-2">Subvenciones disponibles</div>
                  <p className="text-sm text-gray-600">Solar fotovoltaica, renovables</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#0ea5e9] mb-2">3º</div>
                  <div className="font-semibold text-gray-900 mb-2">Mayor impacto energético</div>
                  <p className="text-sm text-gray-600">HVAC, sistemas de gestión</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-[#0ea5e9] mb-2">4º</div>
                  <div className="font-semibold text-gray-900 mb-2">Más complejas</div>
                  <p className="text-sm text-gray-600">Envolvente térmica, coordinación inquilinos</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sincronización con presupuesto CAPEX
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                El cronograma propuesto por ARKIA se puede sincronizar con el presupuesto CAPEX del fondo, 
                distribuyendo las inversiones a lo largo de varios ejercicios fiscales según la capacidad 
                financiera disponible cada año.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Esto permite planificar salidas de caja con visibilidad plurianual, evitando desviaciones 
                presupuestarias imprevistas y optimizando el timing de inversiones según las condiciones de 
                mercado y disponibilidad de financiación verde.
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
              Valor para fondos de inversión inmobiliaria
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Priorización objetiva de inversiones
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Todas las recomendaciones tienen ROI calculado, permitiendo comparar el retorno de mejoras 
                  técnicas con el ROI de otras inversiones inmobiliarias. Decisión basada en datos financieros, 
                  no solo criterios técnicos.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Visibilidad plurianual de CAPEX
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  El cronograma permite planificar salidas de caja con años de antelación. El comité de inversión 
                  conoce exactamente cuándo y cuánto deberá invertir en cada edificio del portfolio.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Documentación lista para due diligence
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  El Libro del Edificio Digital completo y actualizado facilita procesos de venta o refinanciación. 
                  Compradores institucionales valoran positivamente tener toda la documentación técnica accesible 
                  inmediatamente.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}