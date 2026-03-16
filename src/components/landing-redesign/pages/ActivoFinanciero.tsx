import { motion } from "motion/react";

export function ActivoFinanciero() {
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
              Activo / Financiero
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Vista Financiera <span className="font-semibold">Completa del Activo</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deuda consolidada, análisis de apalancamiento, gastos mensuales desglosados y repercusión automática de gastos comunes
            </p>
          </motion.div>
        </div>
      </section>

      {/* El problema REAL */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-16">
              <h2 className="text-5xl font-light text-gray-900 mb-6">
                El cataclismo de no tener visibilidad financiera total
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
                Fondos institucionales que gestionan carteras de 200M€+ descubren deuda oculta de activos DESPUÉS de adquirirlos. El problema no es la deuda en sí, sino descubrirla cuando ya es tarde para renegociar precio o rechazar la operación.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 mb-16">
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <div className="text-[#0ea5e9] text-4xl font-bold mb-4">180K€</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Deuda oculta que explota 4 meses después
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Compras edificio residencial valorado en 4,8M€. Due diligence básica indica "sin cargas". Precio acordado 4,5M€. Cierre perfecto. 4 meses después aparecen facturas impagas del antiguo propietario: obras comunidad 82.000€ + suministros adeudados 34.500€ + IBI atrasado 18.200€ + honorarios gestoría 12.800€ = 147.500€ que legalmente son responsabilidad del edificio.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Los acreedores te reclaman directamente porque eres el nuevo propietario registral. Tu abogado confirma: técnicamente esa deuda "sigue al inmueble". Tienes dos opciones: pagar los 147.500€ o enfrentar embargos que bloquean el activo. Pagas. Rentabilidad del primer año destruida.
                </p>
                <p className="text-sm text-[#0ea5e9] font-semibold">
                  Con sistema que consolida TODA la deuda operativa pendiente (no solo hipotecaria), habrías detectado esto en due diligence y rebajado el precio 180K€ o rechazado la operación.
                </p>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <div className="text-[#0ea5e9] text-4xl font-bold mb-4">73% LTV</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Reventas covenants sin saberlo
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Portfolio de 12 edificios. Deuda hipotecaria agregada: 38,5M€. Valoración total: 61M€. LTV reportado a inversores: 63,1%. Dentro de límite permitido (65% máximo según regulación interna del fondo).
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Durante auditoría anual, auditores externos detectan: hay 4,2M€ adicionales de deuda operativa no incluida en cálculo (facturas pendientes de obra, préstamos puente de corto plazo, avales ejecutados). LTV REAL: 70,1%. Breach de covenants detectado por terceros antes que por ti.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Consecuencias inmediatas: 1) Los inversores exigen explicaciones formales (pérdida de credibilidad), 2) El banco acelera vencimiento de 8,2M€ de deuda exigiendo pago inmediato o aporte de garantías adicionales, 3) Tienes que vender 3 edificios en modo emergencia con descuento del 12% para cumplir covenants = pérdida de 5,8M€ de valor.
                </p>
                <p className="text-sm text-[#0ea5e9] font-semibold">
                  Con cálculo automático de LTV que incluye TODA la deuda (hipotecaria + operativa), habrías visto el 70,1% en tiempo real y actuado ANTES del breach.
                </p>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <div className="text-[#0ea5e9] text-4xl font-bold mb-4">+42%</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Gastos operativos descontrolados
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Edificio de oficinas. Presupuesto OPEX: 13.500€/mes (162K€ anuales). Business plan proyecta NOI de 385K€/año con ese OPEX. Promesa a inversores: rentabilidad neta 6,8%.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Realidad mes a mes sin control granular: Mes 1: 16.200€, Mes 2: 18.500€, Mes 3: 19.800€, Mes 4: 17.900€. Promedio: 18.100€/mes = 217.200€ anuales. Desviación: +34% versus presupuesto. NOI real: 329.800€ vs 385K€ proyectados.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Lo peor: nadie sabe POR QUÉ se dispararon los gastos porque no hay seguimiento por partida. ¿Mantenimiento? ¿Suministros? ¿Seguros? ¿Servicios? Investigar a posteriori lleva 40 horas/analista revisando facturas de 12 meses. Cuando descubres que fueron suministros (avería que consumía excesivo), ya pasó 1 año completo desperdiciando 4.500€/mes = 54K€ tirados.
                </p>
                <p className="text-sm text-[#0ea5e9] font-semibold">
                  Con desglose automático de gastos por partida + alertas cuando alguna se desvía &gt;15%, detectas la anomalía en mes 2, investigas, corriges. Pérdida limitada a 9K€ en lugar de 54K€.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-12 rounded-sm">
              <h3 className="text-3xl font-semibold mb-6">
                El patrón destructivo: gestión financiera reactiva
              </h3>
              <div className="grid md:grid-cols-2 gap-8 text-white/90 leading-relaxed">
                <div>
                  <p className="mb-4">
                    <span className="font-semibold text-[#0ea5e9]">Sin sistema centralizado:</span> Excel por edificio (mantenido por diferentes gestores), datos de deuda en email con el banco, facturas en carpeta compartida sin categorizar, gastos comunes en hoja aparte, nadie consolida TODO en vista única.
                  </p>
                  <p>
                    Resultado: Descubres problemas financieros cuando ya llevan meses desarrollándose. Reaccionas tarde. Pierdes dinero que no tenías que perder.
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    <span className="font-semibold text-[#0ea5e9]">Con ARKIA:</span> Toda la información financiera del edificio consolidada en tiempo real. Deuda total visible (hipotecaria + operativa), LTV calculado automáticamente, gastos desglosados por partida, alertas cuando algo se desvía.
                  </p>
                  <p>
                    Resultado: Detectas problemas cuando empiezan (no cuando ya son catastróficos). Actúas con tiempo. Proteges rentabilidad del activo.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Qué información ves */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Información financiera consolidada por activo
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              ARKIA centraliza TODA la información financiera del edificio en una vista única siempre actualizada
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/90 text-white p-6 md:p-14 rounded-sm mb-12">
              <h3 className="text-3xl font-semibold mb-8">
                Vista financiera completa del activo (ejemplo real)
              </h3>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-[#0ea5e9]">DEUDA CONSOLIDADA</h4>
                  <div className="space-y-4 text-white/90">
                    <div className="border-l-2 border-white/40 pl-4">
                      <div className="text-sm text-white/70 mb-1">Deuda Hipotecaria</div>
                      <div className="text-2xl font-semibold">2.850.000€</div>
                      <div className="text-xs text-white/60 mt-1">Banco Santander | Vence 2031 | Cuota 14.200€/mes</div>
                    </div>
                    <div className="border-l-2 border-[#0ea5e9] pl-4">
                      <div className="text-sm text-white/70 mb-1">Deuda Operativa Pendiente</div>
                      <div className="text-2xl font-semibold text-[#0ea5e9]">186.400€</div>
                      <div className="text-xs text-white/60 mt-1">Proveedores 92K + Suministros 34K + IBI 28K + Otros 32K</div>
                    </div>
                    <div className="border-t border-white/20 pt-4 mt-4">
                      <div className="text-sm text-white/70 mb-1">DEUDA TOTAL ACTIVO</div>
                      <div className="text-3xl font-bold">3.036.400€</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-4 text-[#0ea5e9]">ANÁLISIS APALANCAMIENTO</h4>
                  <div className="space-y-4 text-white/90">
                    <div className="border-l-2 border-white/40 pl-4">
                      <div className="text-sm text-white/70 mb-1">Valoración Activo</div>
                      <div className="text-2xl font-semibold">4.500.000€</div>
                    </div>
                    <div className="border-l-2 border-[#0ea5e9] pl-4">
                      <div className="text-sm text-white/70 mb-1">LTV Actual</div>
                      <div className="text-2xl font-semibold text-[#0ea5e9]">67,5%</div>
                      <div className="text-xs text-[#0ea5e9]/80 mt-1">⚠️ Por encima del límite 65% - Acción requerida</div>
                    </div>
                    <div className="border-l-2 border-white/40 pl-4">
                      <div className="text-sm text-white/70 mb-1">Cobertura Deuda (DSCR)</div>
                      <div className="text-2xl font-semibold">2,1x</div>
                      <div className="text-xs text-white/60 mt-1">NOI 385K€ / Servicio deuda anual 183K€</div>
                    </div>
                    <div className="border-l-2 border-[#0ea5e9] pl-4">
                      <div className="text-sm text-white/70 mb-1">Capacidad Endeudamiento Adicional</div>
                      <div className="text-2xl font-semibold text-[#0ea5e9]">-111.400€</div>
                      <div className="text-xs text-[#0ea5e9]/80 mt-1">Excedes límite - Debes reducir deuda o aportar capital</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Deuda hipotecaria: toda la información crítica
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Para cada hipoteca del edificio ves: entidad financiera, número de préstamo, principal pendiente actual (actualizado cada vez que pagas cuota), cuota mensual (principal + intereses), tipo de interés (fijo/variable + % aplicado), fecha de vencimiento, fecha próximo pago.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Si el edificio tiene múltiples hipotecas (ej: hipoteca principal + préstamo puente), el sistema las suma todas para mostrarte deuda hipotecaria total. No tienes que hacer cálculos manuales. Sabes instantáneamente cuánto debe el edificio a bancos.
                </p>
                <div className="bg-[#0ea5e9]/5 p-6 rounded-sm border-l-2 border-[#0ea5e9]">
                  <div className="text-sm font-semibold text-[#0ea5e9] mb-2">Alerta automática vencimiento</div>
                  <p className="text-sm text-[#0ea5e9]">
                    90 días antes del vencimiento de cualquier hipoteca, el sistema te alerta: "Hipoteca Santander vence 15/06/2025 - Iniciar proceso refinanciación". Tiempo suficiente para negociar con otros bancos y conseguir mejores condiciones en lugar de renovar por urgencia.
                  </p>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Deuda operativa: lo que nadie rastrea y te mata
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Esta es la deuda INVISIBLE que revienta los LTVs sin que nadie la vea venir: facturas de proveedores pendientes de pago (obras, mantenimiento, servicios), suministros adeudados (electricidad, agua, gas), impuestos atrasados (IBI, basuras, licencias), honorarios profesionales pendientes (gestoría, abogados, arquitectos), avales ejecutados, préstamos de corto plazo.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  El sistema suma TODO y te muestra deuda operativa total pendiente. Cada vez que registras un pago, se resta automáticamente. Cada vez que entra una factura nueva, se suma. Siempre sabes cuánto debes operativamente.
                </p>
                <div className="bg-gray-100 p-6 rounded-sm border-l-2 border-gray-800">
                  <p className="text-sm text-gray-900 font-semibold mb-2">Caso real:</p>
                  <p className="text-sm text-gray-700">
                    Edificio con factura electricidad promedio 1.400€/mes. Durante 8 meses nadie revisó. Factura real esos 8 meses: 3.800€/mes. Causa: el antiguo administrador había dado de alta suministro adicional por error y la compañía eléctrica cobraba doble. Sobrepago acumulado: 19.200€. Con alerta automática mes 1, lo habrían detectado. Sobrepago limitado a 2.400€.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Análisis apalancamiento automático */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
              Análisis de apalancamiento automático
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              El sistema calcula métricas financieras críticas en tiempo real sin intervención manual
            </p>

            <div className="grid md:grid-cols-3 gap-10 mb-12">
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-10 rounded-sm">
                <div className="text-6xl font-bold mb-4">LTV</div>
                <h3 className="text-2xl font-semibold mb-4">Loan-to-Value actualizado siempre</h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  Fórmula: (Deuda Total / Valoración Activo) × 100. El sistema toma deuda hipotecaria + deuda operativa pendiente, divide por valoración actualizada del activo, te da el LTV exacto.
                </p>
                <p className="text-white/90 leading-relaxed mb-4">
                  Configuras límite según regulación de tu fondo (ej: 65% máximo). El sistema compara LTV actual versus límite. Si te acercas al 80% del límite (ejemplo: llegas a 52% cuando límite es 65%), alerta automática: "Aproximándose a límite LTV - Revisar estrategia endeudamiento".
                </p>
                <div className="bg-white/10 p-4 rounded-sm mt-6">
                  <div className="text-xs font-semibold mb-1">Ejemplo alerta crítica:</div>
                  <div className="text-sm">"LTV actual 67,2% supera límite permitido 65%. BREACH COVENANTS. Acción inmediata requerida: reducir deuda 99.000€ o aumentar valoración activo."</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/80 text-white p-10 rounded-sm">
                <div className="text-6xl font-bold mb-4">DSCR</div>
                <h3 className="text-2xl font-semibold mb-4">Cobertura de servicio de deuda</h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  Fórmula: NOI anual / Servicio deuda anual (principal + intereses). Mide cuántas veces puedes pagar la deuda con los ingresos operativos del edificio. DSCR {">"} 1,25 = saludable. DSCR {"<"} 1,0 = el activo no genera suficiente para pagar deuda (insostenible).
                </p>
                <p className="text-white/90 leading-relaxed mb-4">
                  El sistema calcula automáticamente: toma ingresos del edificio, resta gastos operativos = NOI. Suma todos los pagos anuales de deuda (cuotas hipotecarias + amortizaciones). Divide NOI / Servicio deuda = DSCR.
                </p>
                <div className="bg-white/10 p-4 rounded-sm mt-6">
                  <div className="text-xs font-semibold mb-1">Alerta DSCR bajo:</div>
                  <div className="text-sm">"DSCR 0,89x - Activo no genera suficiente para cubrir deuda. Opciones: aumentar ingresos (subir rentas), reducir gastos, o refinanciar deuda con plazos más largos."</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/80 text-white p-10 rounded-sm">
                <div className="text-6xl font-bold mb-4">CAP</div>
                <h3 className="text-2xl font-semibold mb-4">Capacidad endeudamiento adicional</h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  Calcula cuánta deuda adicional puedes tomar sin exceder el LTV límite. Fórmula: (Valoración × LTV_límite) - Deuda_actual. Si sale negativo, significa que ya excedes límite y debes REDUCIR deuda.
                </p>
                <p className="text-white/90 leading-relaxed mb-4">
                  Ejemplo: Edificio valorado 6M€, límite LTV 65%, deuda actual 3,5M€. Capacidad = (6M × 0,65) - 3,5M = 3,9M - 3,5M = 400K€ adicionales que puedes endeudar sin romper covenants.
                </p>
                <div className="bg-white/10 p-4 rounded-sm mt-6">
                  <div className="text-xs font-semibold mb-1">Uso estratégico:</div>
                  <div className="text-sm">"Tienes capacidad 400K€ adicional. Puedes: 1) Financiar rehabilitación energética sin aportar equity, 2) Adquirir unidades adicionales en mismo edificio, 3) Mantener reserva para imprevistos."</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Por qué esto salva fondos de breaches millonarios
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Un breach de covenants no es "avisar al banco y ya". Tiene consecuencias devastadoras: 1) El banco puede acelerar vencimiento de TODA la deuda (exige pago inmediato de principal completo), 2) Si no puedes pagar, el banco ejecuta garantías (te quedas sin activos), 3) Los inversores pierden confianza (tu próximo fundraising se complica o fracasa), 4) Tu reputación en mercado queda dañada (institutional investors comparten información entre ellos).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Con cálculo automático de métricas + alertas tempranas cuando te acercas a límites, NUNCA llegas a breach. El sistema te avisa cuando estás al 85% del límite. Ejemplo: límite LTV 65%, sistema alerta cuando llegas a 55% (85% del límite). Tienes margen de 10 puntos porcentuales para actuar antes de romper covenant.
              </p>
              <div className="bg-[#0ea5e9]/5 p-6 rounded-sm">
                <p className="text-sm text-[#0ea5e9] font-semibold mb-2">Caso real evitado:</p>
                <p className="text-sm text-[#0ea5e9]">
                  Fondo con límite LTV 70%. Edificio en 66% LTV. Sistema alertó: "Aproximándose a límite - 4 puntos de margen restante". El gestor investigó: había 280K€ de deuda operativa acumulándose que nadie había sumado. Si esperaba 2 meses más, habría llegado a 71,5% = breach. Actuó inmediatamente: negoció pago diferido con proveedores + aportó 150K€ equity. LTV bajó a 63%. Breach evitado. Sin sistema, lo habría descubierto en auditoría semestral cuando ya era tarde.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gastos mensuales desglosados */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
              Desglose automático de gastos operativos por partida
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Sabes exactamente en qué se va cada euro del OPEX mensual con trazabilidad completa
            </p>

            <div className="bg-white border border-gray-200 p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                Categorías de gastos operativos que el sistema rastrea
              </h3>
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center font-bold text-xl mb-3">1</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Costes fijos mensuales</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Limpieza común</li>
                    <li>• Seguridad / Vigilancia</li>
                    <li>• Seguros edificio</li>
                    <li>• Mantenimiento preventivo</li>
                    <li>• Administración finca</li>
                    <li>• Gestión comunidad</li>
                    <li>• Jardinería</li>
                  </ul>
                </div>
                <div>
                  <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center font-bold text-xl mb-3">2</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Suministros variables</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Electricidad zonas comunes</li>
                    <li>• Agua edificio</li>
                    <li>• Gas calefacción</li>
                    <li>• Climatización común</li>
                    <li>• Telecomunicaciones</li>
                  </ul>
                </div>
                <div>
                  <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center font-bold text-xl mb-3">3</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mantenimiento correctivo</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Reparaciones ascensor</li>
                    <li>• Averías instalaciones</li>
                    <li>• Fontanería urgente</li>
                    <li>• Electricidad reparaciones</li>
                    <li>• Carpintería / Cerrajería</li>
                    <li>• Cristalería</li>
                  </ul>
                </div>
                <div>
                  <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center font-bold text-xl mb-3">4</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Impuestos y tasas</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• IBI anual</li>
                    <li>• Tasas basura</li>
                    <li>• Licencias actividad</li>
                    <li>• Permisos obras</li>
                    <li>• Tasas administrativas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-12">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Cómo funciona el desglose automático
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cada vez que registras un gasto del edificio, lo categorizas según tipo (limpieza, suministros, reparación, etc.). El sistema lo asigna automáticamente a la partida correspondiente. Al final del mes, sumas: Limpieza 1.200€ + Seguridad 2.800€ + Electricidad 890€ + Agua 340€ + Mantenimiento preventivo 1.500€ + Reparaciones 2.100€ + Seguros 650€ + Administración 800€ + IBI 520€ = OPEX total mes 10.800€.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema te muestra desglose visual (gráfico tipo pie chart o barras) donde ves inmediatamente qué partidas consumen más presupuesto. Ejemplo típico: mantenimiento correctivo 28% del OPEX, suministros 22%, servicios fijos 35%, impuestos 15%.
                </p>
                <div className="bg-[#0ea5e9]/10 p-6 rounded-sm border-l-2 border-[#0ea5e9]">
                  <p className="text-sm text-[#0ea5e9] font-semibold mb-2">Ahorro de tiempo:</p>
                  <p className="text-sm text-gray-700">
                    Detectas qué partidas están fuera de control. Si "Mantenimiento correctivo" consume 38% del OPEX (debería ser 15-20%), sabes que tienes instalaciones defectuosas que requieren inversión CAPEX para corregir raíz del problema en lugar de seguir parcheando.
                  </p>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Comparativa mensual automática para detectar anomalías
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema compara OPEX del mes actual versus: 1) Promedio últimos 6 meses, 2) Mismo mes año anterior (para identificar estacionalidad), 3) Presupuesto mensual aprobado. Si cualquier partida se desvía más del 20%, alerta automática.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ejemplo alerta: "Electricidad mes actual 2.890€ vs promedio 6 meses 1.650€ (+75%). Desviación anormal detectada - Investigar consumo excesivo o error facturación". Investigas y descubres: hay avería en sistema de climatización que está funcionando 24/7 consumiendo triple de lo normal. Lo reparas inmediatamente. Si no hubiera alerta, seguirías pagando triple durante 6-8 meses hasta revisión anual = 10.000€ tirados.
                </p>
                <div className="bg-gray-100 p-6 rounded-sm border-l-2 border-gray-800">
                  <p className="text-sm text-gray-900 font-semibold mb-2">Caso real:</p>
                  <p className="text-sm text-gray-700">
                    Edificio con factura electricidad promedio 1.400€/mes. Durante 8 meses nadie revisó. Factura real esos 8 meses: 3.800€/mes. Causa: el antiguo administrador había dado de alta suministro adicional por error y la compañía eléctrica cobraba doble. Sobrepago acumulado: 19.200€. Con alerta automática mes 1, lo habrían detectado. Sobrepago limitado a 2.400€.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/90 text-white p-6 md:p-12 rounded-sm">
              <h3 className="text-3xl font-semibold mb-6">
                El impacto de control granular de gastos en portfolio
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-[#0ea5e9] mb-3">-18%</div>
                  <p className="text-white/90 leading-relaxed text-sm">
                    Reducción promedio OPEX en primer año de implementación. Fondos que empiezan a rastrear gastos por partida detectan ineficiencias que llevaban años sin corregir. Portfolio 15 edificios con OPEX agregado 2,4M€/año → baja a 1,97M€/año = ahorro 430K€ anuales recurrente.
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#0ea5e9] mb-3">85%</div>
                  <p className="text-white/90 leading-relaxed text-sm">
                    De las desviaciones presupuestarias se detectan en primeros 60 días (cuando aún puedes corregir) en lugar de descubrirlas en cierre anual cuando ya gastaste todo el exceso. Intervención temprana limita pérdidas a 10-15% del potencial desperdicio versus 100% si lo descubres a final de año.
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#0ea5e9] mb-3">2,8M€</div>
                  <p className="text-white/90 leading-relaxed text-sm">
                    Ahorro agregado en 3 años para fondo con 25 edificios que implementó control granular OPEX. Combinación de: eliminar gastos innecesarios (18%), negociar mejores contratos con proveedores al tener datos (12%), y corregir averías que consumían excesivo (8%). ROI del sistema: 47x en 3 años solo por esta funcionalidad.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Repercusión gastos comunes */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
              Repercusión automática de gastos comunes por unidad
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Calcula cuánto debe pagar cada unidad por gastos comunes según coeficiente y detecta morosos inmediatamente
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 rounded-sm mb-12">
              <h3 className="text-3xl font-semibold mb-6">Ejemplo repercusión automática mes Febrero</h3>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-xl font-semibold mb-4">Gastos comunes edificio</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Limpieza zonas comunes</span>
                      <span className="font-semibold">1.200€</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Seguridad / Conserjería</span>
                      <span className="font-semibold">2.800€</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Electricidad común</span>
                      <span className="font-semibold">890€</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Agua edificio</span>
                      <span className="font-semibold">340€</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Mantenimiento ascensores</span>
                      <span className="font-semibold">650€</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Seguro comunidad</span>
                      <span className="font-semibold">420€</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Administración finca</span>
                      <span className="font-semibold">600€</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                      <span>Jardinería</span>
                      <span className="font-semibold">380€</span>
                    </div>
                    <div className="flex justify-between pt-3 text-lg font-bold">
                      <span>TOTAL MES</span>
                      <span>7.280€</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-4">Repercusión por unidad (40 unidades)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white/10 p-3 rounded">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">Unidad 1-A (Coef. 3,2%)</span>
                        <span className="text-lg font-bold">233€</span>
                      </div>
                      <div className="text-xs text-white/70">7.280€ × 3,2% = 233€</div>
                      <div className="text-xs text-[#0ea5e9] mt-1">✓ Pagado 05/02</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">Unidad 2-B (Coef. 2,8%)</span>
                        <span className="text-lg font-bold">204€</span>
                      </div>
                      <div className="text-xs text-white/70">7.280€ × 2,8% = 204€</div>
                      <div className="text-xs text-[#0ea5e9] mt-1">✓ Pagado 03/02</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded border border-white/20">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">Unidad 3-C (Coef. 2,5%)</span>
                        <span className="text-lg font-bold">182€</span>
                      </div>
                      <div className="text-xs text-white/70">7.280€ × 2,5% = 182€</div>
                      <div className="text-xs text-white/70 mt-1">✗ PENDIENTE - Debe 3 meses (546€ acumulado)</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">Unidad 4-D (Coef. 1,9%)</span>
                        <span className="text-lg font-bold">138€</span>
                      </div>
                      <div className="text-xs text-white/70">7.280€ × 1,9% = 138€</div>
                      <div className="text-xs text-[#0ea5e9] mt-1">⚠ Pagado 18/02 (13 días retraso)</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white/20 rounded">
                    <div className="text-xs mb-2">Estado cobro mes Febrero:</div>
                    <div className="flex justify-between text-sm">
                      <span>38 unidades pagaron (95%)</span>
                      <span className="font-semibold text-[#0ea5e9]">6.916€</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>2 unidades morosas (5%)</span>
                      <span className="font-semibold text-white/60">364€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-12">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Distribución automática según coeficiente propiedad
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Cada unidad del edificio tiene un coeficiente de propiedad (normalmente entre 0,8% y 5% dependiendo de tamaño). Ese coeficiente determina qué porcentaje de los gastos comunes debe pagar. El sistema hace el cálculo automáticamente cada mes:
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  1) Suma todos los gastos comunes del mes (limpieza, seguridad, suministros, mantenimiento, administración, seguros)<br/>
                  2) Para cada unidad: Gastos totales × Coeficiente = Cuota mes<br/>
                  3) Genera listado automático de cuánto debe pagar cada propietario/inquilino
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  No tienes que hacer cálculos en Excel. No hay errores humanos de fórmulas. El sistema genera el desglose completo listo para enviar a cada propietario. Incluye: total gastos mes, detalle por partidas, coeficiente aplicado, importe a pagar, fecha límite pago.
                </p>
                <div className="bg-[#0ea5e9]/10 p-6 rounded-sm border-l-2 border-[#0ea5e9]">
                  <p className="text-sm text-[#0ea5e9] font-semibold mb-2">Ahorro de tiempo:</p>
                  <p className="text-sm text-gray-700">
                    Administrador de finca tarda 4 horas/mes calculando repercusión manual en Excel para edificio de 40 unidades (riesgo de error en fórmulas). Con sistema automático: 0 minutos. El sistema lo hace instantáneamente sin errores. 48 horas anuales ahorradas por edificio. En portfolio de 20 edificios: 960 horas/año = 6 meses de trabajo de 1 persona.
                  </p>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Identificación automática de morosos
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema registra qué unidades pagaron gastos comunes cada mes y cuáles no. Marcas el pago cuando se recibe (manualmente o mediante integración bancaria). Instantáneamente ves: unidades al día (verde), unidades con 1 mes pendiente (amarillo), unidades con 2+ meses morosos (rojo).
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Para cada moroso, el sistema acumula: Unidad 3-C debe Enero 182€ + Febrero 182€ + Marzo 182€ = 546€ acumulados (3 meses). El gestor puede generar reclamación automática: "Su unidad adeuda 546€ correspondiente a gastos comunes últimos 3 meses. Regularizar antes de [fecha] para evitar acciones legales."
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Puedes filtrar: "Mostrar solo morosos con +2 meses pendiente" → ves lista de unidades problemáticas que requieren acción urgente (reclamación formal, derivar a abogado, etc.)
                </p>
                <div className="bg-gray-100 p-6 rounded-sm border-l-2 border-gray-800">
                  <p className="text-sm text-gray-900 font-semibold mb-2">Impacto morosidad no controlada:</p>
                  <p className="text-sm text-gray-700">
                    Edificio 40 unidades, gastos comunes 7.280€/mes. Si 8 unidades (20%) no pagan = pierdes 1.456€/mes que tienes que cubrir tú. Son 17.472€ anuales pagados por el fondo que deberían pagar los propietarios. Con identificación automática de morosos + reclamación inmediata, tasa de cobro sube de 80% a 96%. Recuperas 14.000€ anuales que antes perdías.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6 md:p-12">
              <h3 className="text-3xl font-semibold text-gray-900 mb-8">
                El problema estructural de gastos comunes en gestión tradicional
              </h3>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Sin sistema centralizado</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-gray-500 font-bold mr-3">✗</span>
                      <span>Administrador calcula repercusión en Excel cada mes (4 horas trabajo + riesgo error fórmulas)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 font-bold mr-3">✗</span>
                      <span>No hay seguimiento automático de quién pagó (revisar transferencias manualmente)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 font-bold mr-3">✗</span>
                      <span>Morosos se detectan cuando ya deben 4-6 meses (difícil recuperar)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 font-bold mr-3">✗</span>
                      <span>No hay histórico consolidado de pagos por unidad (si cambia administrador, se pierde información)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-500 font-bold mr-3">✗</span>
                      <span>Propietarios reclaman errores en cálculo (pierdes tiempo justificando)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-[#0ea5e9] mb-4">Con ARKIA</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#0ea5e9] font-bold mr-3">✓</span>
                      <span>Repercusión calculada automáticamente en 0 segundos sin errores</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0ea5e9] font-bold mr-3">✓</span>
                      <span>Marcas pagos recibidos → sistema actualiza instantáneamente estado cobro</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0ea5e9] font-bold mr-3">✓</span>
                      <span>Alertas automáticas día 10 de mes: "5 unidades no pagaron todavía" (reclamas cuando solo deben 1 mes)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0ea5e9] font-bold mr-3">✓</span>
                      <span>Histórico completo de pagos de cada unidad desde inicio (trazabilidad total)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0ea5e9] font-bold mr-3">✓</span>
                      <span>Cálculos transparentes y auditables (propietarios ven desglose detallado, cero reclamaciones)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valor agregado portfolio */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-light mb-12 text-center">
              El impacto real en control financiero del portfolio
            </h2>

            <div className="grid md:grid-cols-3 gap-10 mb-16">
              <div className="bg-white/10 p-10 rounded-sm backdrop-blur-sm">
                <div className="text-6xl font-bold text-[#0ea5e9] mb-4">0</div>
                <h3 className="text-2xl font-semibold mb-4">Breaches de covenants</h3>
                <p className="text-white/80 leading-relaxed">
                  Alertas automáticas cuando te acercas al 85% de cualquier límite (LTV, DSCR, capacidad endeudamiento). Actúas ANTES de romper covenant. En portfolio típico de 20 edificios, evitas 1-2 breaches anuales que costarían 500K€-2M€ cada uno en penalties, refinanciación forzada, o venta de emergencia.
                </p>
              </div>

              <div className="bg-white/10 p-10 rounded-sm backdrop-blur-sm">
                <div className="text-6xl font-bold text-[#0ea5e9] mb-4">-22%</div>
                <h3 className="text-2xl font-semibold mb-4">Reducción OPEX no presupuestado</h3>
                <p className="text-white/80 leading-relaxed">
                  Desglose por partida + alertas de desviación detectan gastos anormales cuando llevan 1-2 meses (no 8-10). Corriges rápido. Portfolio de 25 edificios con OPEX agregado 3,2M€/año típicamente tiene 700K€ anuales de gastos no presupuestados. Con control granular, reduces esos 700K€ a 546K€ = ahorro 154K€ anuales recurrente.
                </p>
              </div>

              <div className="bg-white/10 p-10 rounded-sm backdrop-blur-sm">
                <div className="text-6xl font-bold text-[#0ea5e9] mb-4">95%</div>
                <h3 className="text-2xl font-semibold mb-4">Tasa de cobro gastos comunes</h3>
                <p className="text-white/80 leading-relaxed">
                  Identificación automática de morosos + reclamación inmediata (cuando deben solo 1 mes) eleva tasa de cobro del 78-82% típico a 94-96%. Portfolio 20 edificios con 800 unidades y gastos comunes agregados 145K€/mes: recuperas 18-22K€ mensuales = 216-264K€ anuales que antes no cobrabas y cubrías tú.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border-l-4 border-white/30 p-6 md:p-12 backdrop-blur-sm">
              <h3 className="text-3xl font-semibold mb-6">
                El caso que destruyó un fondo: breach de covenant por deuda invisible
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Un fondo institucional gestionaba portfolio de 18 edificios valorados en 127M€. Deuda hipotecaria agregada: 76,2M€. LTV reportado a inversores y al banco: 60,0%. Perfectamente dentro del límite regulatorio de 65%. Control mediante Excel: cada gestor reportaba deuda hipotecaria de sus edificios, se sumaba, se dividía por valoración total.
              </p>
              <p className="text-white/90 leading-relaxed mb-6">
                Durante auditoría externa anual, los auditores pidieron confirmación de TODA la deuda (no solo hipotecaria). Descubrieron: 4,8M€ de deuda operativa no incluida en cálculo LTV: Facturas de obras pendientes 1,9M€ + Préstamos puente de corto plazo 1,6M€ + Avales ejecutados 850K€ + Honorarios profesionales adeudados 450K€.
              </p>
              <p className="text-white/90 leading-relaxed mb-6">
                LTV REAL: (76,2M + 4,8M) / 127M = 63,8%. Todavía dentro de 65%, pero el banco y los inversores consideraron que había "ocultación material de deuda". Perdieron credibilidad. El banco, en renovación de línea de crédito 6 meses después, redujo límite LTV de 65% a 60% como penalización. El fondo se vió forzado a: 1) Vender 4 edificios en modo emergencia (tuvieron solo 90 días para cerrar operaciones) con descuento promedio del 11% = pérdida de valor 5,6M€, 2) Aportar 3,2M€ equity adicional para cumplir nuevo límite 60% LTV.
              </p>
              <p className="text-white leading-relaxed font-semibold text-lg">
                Coste total del "error": 8,8M€ (pérdida venta + equity adicional). Todo evitable con sistema que consolidara automáticamente TODA la deuda (hipotecaria + operativa) y calculara LTV real en tiempo real. El director del fondo fue reemplazado. Los inversores perdieron confianza. El siguiente fundraising fracasó.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}