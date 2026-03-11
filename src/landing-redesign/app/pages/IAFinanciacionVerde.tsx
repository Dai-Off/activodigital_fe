import { motion } from "motion/react";

export function IAFinanciacionVerde() {
  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">
      {/* Hero Header */}
      <section className="relative py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
              Financiación / Verde
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Financiación <span className="font-semibold">Verde</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deja de perder cientos de miles de euros en ayudas que existen pero nunca supiste encontrar
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
              El dinero que está ahí pero tú no capturas
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Fondos que invierten millones en rehabilitación pero solo capturan el 20% de las ayudas disponibles
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Subvenciones invisibles que caducan
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Hay convocatorias autonómicas y municipales que valen 15.000€ por edificio. Pero están escondidas en webs oficiales imposibles de rastrear manualmente. Caducan en 45 días y nunca te enteraste que existían. Dinero dejado sobre la mesa cada mes.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Documentación que retrasa meses
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Envías la solicitud al banco para financiación verde. Te piden 12 documentos que no tenías preparados. Tardas 8 semanas en conseguirlos. Pierdes ventana de tipos bajos. Costes de bridging finance se disparan 40.000€.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No sabes cuánto vale ser verde
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El comité pregunta: "¿Cuánto valor adicional genera certificar A+ versus D?". No tienes forma de cuantificarlo con datos. Decisión basada en intuición. Inviertes demasiado o inviertes muy poco, sin forma de saberlo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detección automática */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              IA que encuentra dinero que tú nunca encontrarías manualmente
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA rastrea automáticamente todas las ayudas públicas aplicables a cada edificio específico
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                Cómo encuentra ayudas que tú no verías
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                El sistema analiza la ubicación exacta del edificio, las obras que vas a hacer, la calificación energética actual y objetivo, el tipo de uso del edificio. Cruza esos datos con bases de datos de convocatorias públicas que se actualizan cada semana: Next Generation EU, IDAE, 17 comunidades autónomas, más de 8.000 ayuntamientos, fondos sectoriales.
              </p>
              <p className="text-white/90 leading-relaxed">
                En segundos te dice qué ayudas existen para ESE edificio específico, cuánto dinero puedes solicitar exactamente, qué requisitos técnicos debes cumplir, qué documentos necesitas, y cuándo caduca el plazo. Todo automático, sin que tengas que buscar nada en BOEs imposibles de leer.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Taxonomía */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Valida si tu proyecto cumple Taxonomía Europea
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              La llave para acceder a financiación verde con tipos privilegiados
            </p>

            <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Por qué la Taxonomía vale cientos de miles de euros
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Si tu rehabilitación cumple los criterios técnicos de la Taxonomía Europea (Reglamento EU/2020/852), puedes acceder a: (1) Financiación con tipos de interés significativamente más bajos, (2) Garantías del BEI que reducen el equity necesario, (3) Emisión de Green Bonds para captar capital institucional ESG que busca desesperadamente activos elegibles.
              </p>
              <p className="text-gray-700 leading-relaxed">
                El problema: verificar manualmente si cumples los criterios técnicos requiere abogados especializados y cuesta semanas. ARKIA lo valida automáticamente en segundos y te dice si eres elegible o qué te falta para serlo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Qué valida automáticamente
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#0ea5e9] mt-2 flex-shrink-0"></div>
                    <span>Mejora mínima del 30% en eficiencia energética primaria (requisito obligatorio)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#0ea5e9] mt-2 flex-shrink-0"></div>
                    <span>Contribución sustancial a mitigación del cambio climático (reducción emisiones)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#0ea5e9] mt-2 flex-shrink-0"></div>
                    <span>Principio "No Causar Daño Significativo" (DNSH) a otros objetivos ambientales</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#0ea5e9] mt-2 flex-shrink-0"></div>
                    <span>Salvaguardas sociales mínimas (OCDE, OIT, derechos humanos)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  El beneficio real en tu cuenta de resultados
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La diferencia entre financiación convencional y financiación verde puede ser de 2-3 puntos porcentuales en tipo de interés. En una operación de 5M€ a 10 años, eso son más de 600.000€ ahorrados en costes financieros.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Además, cumplir Taxonomía te abre mercado de Green Bonds donde hay capital institucional europeo que DEBE invertir en activos elegibles por mandato regulatorio. Demanda estructural que empuja valoraciones al alza.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Green Premium */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Calcula cuánto más vale tu edificio si es verde
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Responde con datos la pregunta del comité: "¿Vale la pena invertir en A+ en lugar de cumplir solo el mínimo?"
            </p>

            <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                El Green Premium: tres efectos que multiplican el valor del activo
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                ARKIA calcula cuánto más vale tu edificio si tiene certificación A+ en lugar de D. No es una estimación: es un cálculo basado en tres efectos reales del mercado que ocurren cuando un edificio es verde y que puedes verificar en transacciones comparables.
              </p>
              <p className="text-white/90 leading-relaxed">
                Estos tres efectos se suman y amplifican. No es uno u otro, son los tres actuando simultáneamente para aumentar el valor del activo.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Yield Compression
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Los inversores aceptan menor rentabilidad (menor cap rate) en edificios verdes porque tienen menor riesgo regulatorio futuro. Menor riesgo de quedar obsoleto cuando endurezcan normativa = menor yield requerido = mayor valoración del activo.
                </p>
                <p className="text-gray-700 text-sm">
                  Efecto típico: 25-50 basis points de compresión. En un edificio que genera 500K€ NOI, eso son 1-2M€ adicionales de valoración.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ahorro OPEX Capitalizado
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El ahorro anual en gastos energéticos se capitaliza a perpetuidad. Un ahorro recurrente de 50.000€/año tiene un valor presente de más de 1M€ cuando lo capitalizas al yield del activo. Es flujo de caja adicional que sube el NOI.
                </p>
                <p className="text-gray-700 text-sm">
                  ARKIA calcula cuánto ahorras cada año en energía y cuánto vale ese ahorro futuro capitalizado hoy.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Green Rent Premium
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Edificios certificados A/B consiguen rentas 5-10% más altas porque empresas con objetivos ESG vinculantes priorizan espacios sostenibles. Ese premium de renta se capitaliza y suma directamente al valor del activo.
                </p>
                <p className="text-gray-700 text-sm">
                  No es teoría: estudios de CBRE y JLL confirman este premium en mercados core europeos desde 2019.
                </p>
              </div>
            </div>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ROI sobre inversión verde: decisión basada en retorno real
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sumando los tres efectos, ARKIA calcula el ROI específico de invertir en certificación alta versus cumplir solo el mínimo normativo. Esto permite al comité de inversión tomar decisiones basadas en retorno financiero cuantificado, no en intuición o "es lo correcto".
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                Ejemplo real: invertir 400K€ adicionales para pasar de D a A+ genera 1,8M€ de valor adicional por los tres efectos combinados. ROI del 450% que justifica ampliamente la inversión extra.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Presupuestos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Valida si los presupuestos de constructoras son razonables
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Deja de aceptar ofertas sin poder verificar si los precios están inflados
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Desglose línea a línea con precios de mercado
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  ARKIA desglosa el presupuesto de rehabilitación en partidas individuales con mediciones precisas, precios unitarios de mercado actualizados, y totales por categoría de obra. Puedes comparar ofertas de 3 constructoras línea a línea y detectar dónde te están inflando precios.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Detecta sobreprecio y negocia con datos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Los precios están basados en bases de datos oficiales (BEDEC, CYPE). Si una constructora te cobra un 40% más de lo razonable en aislamiento térmico, lo detectas inmediatamente. Puedes negociar con datos objetivos, no intuiciones.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Compara la distribución de costes entre edificios
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                El sistema agrupa las partidas en categorías estándar: envolvente térmica, instalaciones, energías renovables, gestión y honorarios. Ves de un vistazo dónde se concentra la inversión y puedes comparar la distribución entre diferentes edificios del portfolio.
              </p>
              <p className="text-gray-700 text-sm">
                Esto es especialmente útil cuando gestionas 10 rehabilitaciones simultáneas. Identificas patrones: "En los edificios de Barcelona nos cobran un 25% más en instalaciones que en Madrid. ¿Por qué?". Detectas proveedores que abusan de precios.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documentación */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Prepara toda la documentación antes de ir al banco
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Evita enviar solicitudes incompletas que retrasan aprobaciones 8 semanas
            </p>

            <div className="bg-white border-l-4 border-gray-800 p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                El coste real de documentación incompleta
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Envías la solicitud de financiación verde. A los 3 días el banco responde pidiendo 12 documentos que no tenías preparados: mandatos de representación, memoria de calidades, certificado energético objetivo, declaración responsable de obras, libro del edificio actualizado. Tardas 6-8 semanas en conseguirlos porque algunos requieren notario o técnicos externos. Durante ese tiempo, los tipos suben 50 basis points. Coste adicional: 125.000€ en intereses extra a lo largo de 10 años + 40.000€ de bridging finance mientras esperas. Total: 165.000€ tirados por no tener los papeles listos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Checklist completo antes de enviar nada
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ARKIA te dice exactamente qué documentos necesitas para solicitar financiación verde según la entidad y producto específico. Te marca cuáles son obligatorios (sin ellos te rechazan automáticamente), cuáles son importantes (mejoran condiciones), y cuáles son opcionales pero fortalecen la solicitud.
                </p>
                <p className="text-gray-700 text-sm">
                  No envías nada al banco hasta que el checklist está al 100%. Evitas rechazos, retrasos, y pérdida de ventanas favorables de tipos.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Genera automáticamente lo que se puede automatizar
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Los documentos que el sistema puede generar automáticamente (memorias técnicas, proyecciones energéticas, cálculos de ROI), los creas con un click. Los que requieren firma notarial o trámite externo, el sistema te guía paso a paso en cómo conseguirlos sin perder tiempo.
                </p>
                <p className="text-gray-700 text-sm">
                  Reduces de 8 semanas a 2 semanas el tiempo de preparación de documentación completa. Capturas ventanas de tipos favorables antes de que se cierren.
                </p>
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
              El impacto real en la cuenta de resultados del fondo
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Capturas subvenciones que no sabías que existían
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  El buscador automático encuentra ayudas municipales y autonómicas que manualmente nunca detectarías. Convocatorias poco publicitadas que valen 15-20K€ por edificio. En un portfolio de 20 edificios, son 300-400K€ adicionales que reducen el CAPEX neto real.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cierres financieros 6 semanas más rápidos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Documentación completa desde el día 1 acelera aprobaciones bancarias de 10 semanas a 4 semanas. Reduces costes de financiación puente, capturas ventanas de tipos favorables antes de que suban, ejecutas obras más rápido para empezar a generar NOI antes.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Justificas inversiones verdes con ROI calculado
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  El comité de inversión puede comparar el ROI de invertir en certificación alta versus mínima con datos objetivos. Justificas inversiones 400K€ mayores cuando el Green Premium genera 1,8M€ adicionales de valor. Decisión basada en retorno, no en feeling.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                Un caso real de medio millón perdido
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Un fondo rehabilitó 8 edificios invirtiendo 4,5M€. Capturaron solo las subvenciones Next Generation porque eran las más visibles (40% del proyecto). Después de las obras, un asesor externo les informó que había bonificaciones IBI municipales del 50% por 5 años, deducciones IRPF del 60%, y una línea ICO bonificada que podían haber solicitado. Todas caducaron.
              </p>
              <p className="text-white/90 leading-relaxed">
                Dinero dejado sobre la mesa: más de 580.000€ en ayudas y ahorros financieros que existían pero nunca detectaron. Con un sistema automatizado de búsqueda y validación, ese dinero habría sido capturado. No es que no hubiera dinero disponible. Es que no tenían forma de saberlo a tiempo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}