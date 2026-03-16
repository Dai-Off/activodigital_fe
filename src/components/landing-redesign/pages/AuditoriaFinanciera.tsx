import { motion } from "motion/react";

export function AuditoriaFinanciera() {
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
              Auditorías / Financiera
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Auditoría <span className="font-semibold">Financiera</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Valoración del activo, análisis LTV, ROI actual vs proyectado y escenarios de inversión
            </p>
          </motion.div>
        </div>
      </section>

      {/* Situación Actual */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Situación financiera actual del activo
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Vista consolidada de valoración, deuda, ingresos y rentabilidad
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Métricas de valoración
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700"><strong>Valor del activo:</strong> En euros totales y también en €/m² construido</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700"><strong>Deuda pendiente:</strong> Importe actual de financiación del activo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700"><strong>Ratio LTV:</strong> Loan-to-Value calculado automáticamente</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Métricas de rentabilidad
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700"><strong>Ingresos anuales:</strong> Consolidado de rentas generadas por el activo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700"><strong>Evolución trimestral:</strong> Crecimiento porcentual de ingresos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#0ea5e9] font-bold text-lg">•</span>
                    <span className="text-gray-700"><strong>ROI bruto actual:</strong> Rentabilidad sobre la inversión realizada</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Capacidad de endeudamiento
              </h3>
              <p className="text-gray-700 leading-relaxed">
                El ratio LTV indica el nivel de apalancamiento del activo. Un LTV bajo (por ejemplo, 39%) significa 
                que el activo tiene poco apalancamiento y podría refinanciarse para liberar capital. Un LTV alto 
                limita la capacidad de obtener financiación adicional. ARKIA calcula automáticamente cuánta 
                capacidad de deuda adicional tiene el activo según su valoración actual.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Análisis de Mercado */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Análisis de mercado comparado
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Posicionamiento del activo respecto al mercado de su zona
            </p>

            <div className="bg-white border border-gray-200 p-6 md:p-12 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                ¿Qué compara el análisis?
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Precio medio de mercado de la zona
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      ARKIA obtiene el precio por m² de la zona específica donde se ubica el activo (fuentes como 
                      Idealista, Fotocasa, datos oficiales). Por ejemplo: 1,650 €/m² en Carretera de Miraflores, 
                      Colmenar Viejo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Precio actual del activo
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Valoración actual expresada en €/m². El sistema compara este precio con el de mercado 
                      para identificar si el activo está infravalorado, en línea, o sobrevalorado respecto a 
                      su entorno.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Precio potencial post-mejora
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      Proyección del precio por m² que alcanzaría el activo tras implementar las mejoras energéticas 
                      recomendadas. El sistema calcula el porcentaje de revalorización esperado (típicamente 8-15% 
                      según tipología y mejoras implementadas).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Factores de mercado considerados
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Ubicación:</strong> Zona comercial, residencial, industrial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Demanda:</strong> Nivel de demanda en el área específica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Conectividad:</strong> Acceso a transporte público y carreteras</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#0ea5e9]"></div>
                    <span><strong>Competencia:</strong> Escasez o abundancia de oferta similar</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Decisión estratégica informada
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Este análisis evita sobre-invertir en zonas donde el mercado no recompensará la mejora. También 
                  identifica oportunidades donde una pequeña inversión puede generar gran revalorización porque el 
                  activo está inicialmente infravalorado respecto a su zona.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proyección Post-Rehabilitación */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Proyección financiera post-rehabilitación
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Análisis completo de inversión requerida vs retorno esperado
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Inversión requerida
                </h3>
                <div className="space-y-4">
                  <div className="pb-3 border-b border-[#0ea5e9]/30">
                    <div className="text-sm text-gray-600 mb-1">Valor actual del activo</div>
                    <p className="text-gray-700 text-sm">Base de cálculo inicial</p>
                  </div>
                  <div className="pb-3 border-b border-[#0ea5e9]/30">
                    <div className="text-sm text-gray-600 mb-1">Coste de mejoras técnicas</div>
                    <p className="text-gray-700 text-sm">Suma de todas las recomendaciones a implementar</p>
                  </div>
                  <div className="pb-3 border-b border-[#0ea5e9]/30">
                    <div className="text-sm text-gray-600 mb-1">Costes indirectos (5%)</div>
                    <p className="text-gray-700 text-sm">Gestión, permisos, costes asociados</p>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-1">Inversión total</div>
                    <p className="text-gray-700 font-semibold">Suma completa de inversión necesaria</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Retorno esperado
                </h3>
                <div className="space-y-4">
                  <div className="pb-3 border-b border-[#0ea5e9]/30">
                    <div className="text-sm text-gray-600 mb-1">Valor actual</div>
                    <p className="text-gray-700 text-sm">Valoración antes de mejoras</p>
                  </div>
                  <div className="pb-3 border-b border-[#0ea5e9]/30">
                    <div className="text-sm text-gray-600 mb-1">Revalorización</div>
                    <p className="text-gray-700 text-sm">Incremento de valor por mejora energética (8-15%)</p>
                  </div>
                  <div className="pb-3 border-b border-[#0ea5e9]/30">
                    <div className="text-sm text-gray-600 mb-1">Ahorro energético anual</div>
                    <p className="text-gray-700 text-sm">Reducción de gastos operativos en euros/año</p>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-1">Valor post-mejora</div>
                    <p className="text-gray-700 font-semibold">Valoración final del activo rehabilitado</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                Resultado: Inversión neta y periodo de recuperación
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-white/60 text-sm mb-2">Inversión neta estimada total</div>
                  <p className="text-white/90 leading-relaxed mb-4">
                    ARKIA calcula la inversión total necesaria considerando costes directos e indirectos
                  </p>
                  <div className="text-white/60 text-sm mb-2">ROI de la inversión</div>
                  <p className="text-white/90 leading-relaxed">
                    Porcentaje de retorno sobre la inversión realizada, considerando revalorización + ahorros
                  </p>
                </div>
                <div>
                  <div className="text-white/60 text-sm mb-2">Periodo de recuperación</div>
                  <p className="text-white/90 leading-relaxed mb-4">
                    Años necesarios para recuperar la inversión mediante ahorros energéticos y revalorización
                  </p>
                  <div className="text-white/60 text-sm mb-2">TIR proyectada</div>
                  <p className="text-white/90 leading-relaxed">
                    Tasa interna de retorno de la operación completa
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Escenarios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Comparativa de escenarios de inversión
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Cinco escenarios con diferente nivel de inversión y retorno esperado
            </p>

            <div className="bg-white border border-gray-200 p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                ¿Qué muestra cada escenario?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Inversión requerida</h4>
                  <p className="text-gray-600">Coste total de implementar ese paquete de mejoras</p>
                </div>
                <div className="bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Valor final proyectado</h4>
                  <p className="text-gray-600">Valoración del activo tras las mejoras</p>
                </div>
                <div className="bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Ahorro energético anual</h4>
                  <p className="text-gray-600">Reducción de gastos operativos en euros/año</p>
                </div>
                <div className="bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Clase energética EPBD</h4>
                  <p className="text-gray-600">Calificación resultante tras las actuaciones</p>
                </div>
                <div className="bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">ROI total porcentual</h4>
                  <p className="text-gray-600">Rentabilidad sobre la inversión realizada</p>
                </div>
                <div className="bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Payback en años</h4>
                  <p className="text-gray-600">Tiempo de recuperación de la inversión</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Escenario 1 */}
              <div className="bg-white border-l-4 border-gray-400 p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Escenario 1: Sin Mejoras
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Mantener el estado actual sin invertir en rehabilitación energética.
                    </p>
                    <div className="bg-gray-50 p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Características:</strong> Inversión cero, valor final igual al actual, sin ahorro 
                        energético, sin mejora de calificación EPBD, ROI 0%. <strong>Riesgo:</strong> No cumple 
                        normativa 2030, posible depreciación del activo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escenario 2 */}
              <div className="bg-white border-l-4 border-gray-400 p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Escenario 2: Mejoras Básicas
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Solo LED y solar fotovoltaica básica.
                    </p>
                    <div className="bg-gray-50 p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Características:</strong> Inversión moderada, mejora parcial de calificación, 
                        ROI positivo pero limitado. <strong>Limitación:</strong> No cumple EPBD 2030, bajo riesgo 
                        pero valor limitado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escenario 3 */}
              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Escenario 3: Mejoras Intermedias
                    </h3>
                    <p className="text-gray-700 mb-4">
                      LED, solar fotovoltaica y actualización HVAC.
                    </p>
                    <div className="bg-[#0ea5e9]/10 p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Características:</strong> Cumple EPBD 2030, equilibrio entre inversión y retorno, 
                        mejora sustancial de calificación. <strong>Estrategia:</strong> Opción conservadora que 
                        cumple normativa al mínimo coste razonable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escenario 4 - RECOMENDADO */}
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8 relative">
                <div className="absolute -top-3 right-4 bg-[#0ea5e9] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                  RECOMENDADO
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Escenario 4: Mejoras Completas
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Implementación del paquete completo de seis medidas técnicas.
                    </p>
                    <div className="bg-white p-4">
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        <strong>Características:</strong> Maximiza la revalorización del activo, consigue clase 
                        energética A+, ROI óptimo superior al 100%, mejora significativa del rating ESG.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Por qué ARKIA lo recomienda:</strong> Optimiza el balance inversión-retorno. 
                        Combina cumplimiento normativo completo con máxima revalorización del activo a medio plazo. 
                        Payback razonable (6-7 años) con retorno muy alto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escenario 5 */}
              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Escenario 5: Mejoras Premium
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Paquete completo más certificación BREEAM o LEED.
                    </p>
                    <div className="bg-gray-50 p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Características:</strong> Máxima revalorización, calificación A++, inversión muy 
                        elevada, payback más largo (7-8 años). <strong>Recomendado para:</strong> Fondos que 
                        priorizan máximo rating ESG sobre ROI a corto plazo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valor para Fondos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">
              Decisión estratégica para fondos de inversión
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Flexibilidad estratégica por activo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Los cinco escenarios permiten aplicar estrategias diferentes según el activo: un edificio en 
                  zona prime puede justificar el escenario Premium, mientras que un activo de rotación rápida 
                  puede implementar solo mejoras básicas. El fondo decide según su estrategia de inversión.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Impacto en capacidad de endeudamiento
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Una mejora energética que revaloriza el activo un 12% puede reducir el LTV del 49% al 43%, 
                  liberando capacidad de deuda adicional para nuevas adquisiciones sin necesidad de aportar 
                  más equity. Esto mejora la eficiencia de capital del fondo.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                Optimización del análisis de mercado
              </h3>
              <div className="grid md:grid-cols-2 gap-8 text-white/90">
                <div>
                  <h4 className="font-semibold text-white mb-3">Evita sobre-inversión</h4>
                  <p className="leading-relaxed">
                    En zonas donde el mercado no premia mejoras energéticas (por ejemplo, polígonos industriales 
                    con demanda muy estable), el análisis identifica que el escenario básico es suficiente. No 
                    tiene sentido invertir en Premium si el mercado no lo valorará.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Identifica oportunidades</h4>
                  <p className="leading-relaxed">
                    En zonas con alta demanda y escasa oferta certificada, incluso mejoras intermedias pueden 
                    generar revalorizaciones superiores al 15%. El análisis de mercado detecta estas oportunidades 
                    donde invertir genera máximo retorno.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}