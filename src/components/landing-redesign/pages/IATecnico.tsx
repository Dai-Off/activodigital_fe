import { motion } from "motion/react";

export function IATecnico() {
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
              IA / Análisis Técnico
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              IA <span className="font-semibold">Técnica</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deja de sufrir averías de emergencia que cuestan 3x más porque no hiciste mantenimiento preventivo
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
              El coste brutal de mantener edificios de forma reactiva
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Fondos que solo reparan cuando algo ya se rompió, pagando 3-4x más que si hubieran prevenido
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Averías de emergencia que explotan costes
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  La caldera se rompe en pleno diciembre. Llamada de emergencia: 3.500€. Reparación urgente: 18.000€. Inquilinos sin calefacción 4 días: compensación 12.000€. Total: 33.500€. Si hubieras hecho mantenimiento preventivo por 2.800€, nunca habría pasado.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No sabes cuándo va a fallar cada instalación
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Tienes 20 edificios con 80 instalaciones críticas. No tienes forma de saber cuál va a fallar pronto. Esperas a que se rompa y reaccionas. Gastas en emergencias lo que podrías ahorrar con mantenimiento planificado.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Sustituciones prematuras por miedo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El técnico dice "esta bomba tiene 12 años, mejor cambiarla". Gastas 8.000€ en una bomba que podría haber durado 5 años más. Por miedo a averías, sustituyes instalaciones que todavía funcionan. Capital desperdiciado.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mantenimiento predictivo */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              IA que predice averías antes de que ocurran
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA analiza datos históricos de instalaciones y te avisa cuándo va a fallar cada una
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                Cómo predice fallos antes de que pasen
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                El sistema aprende de datos históricos de miles de instalaciones similares: calderas, bombas, ascensores, aires acondicionados. Sabe que una caldera marca X modelo Y instalada hace 11 años tiene un 73% de probabilidad de fallar en los próximos 6 meses basándose en patrones de fallos de calderas idénticas.
              </p>
              <p className="text-white/90 leading-relaxed">
                Te avisa: "La caldera del Edificio A tiene alta probabilidad de fallo en Q1 2025. Programa sustitución o mantenimiento preventivo profundo AHORA en noviembre, no esperes a que se rompa en enero cuando los técnicos cobran 3x más y tienes inquilinos sin calefacción."
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                  !
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Riesgo alto: actúa en 30 días
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Probabilidad de fallo superior al 60% en los próximos 3 meses. Programa intervención inmediata antes de que falle. El sistema te dice exactamente qué instalación en qué edificio necesita atención urgente.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <div className="w-12 h-12 bg-[#0ea5e9]/80 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                  ⚠
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Riesgo medio: planifica en 90 días
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Probabilidad de fallo del 30-60% en los próximos 6 meses. Incluye mantenimiento preventivo en el siguiente ciclo planificado. No es emergencia pero debes actuar pronto.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Riesgo bajo: monitorizar
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Probabilidad de fallo inferior al 30% en los próximos 12 meses. Instalación funcionando correctamente, solo mantenimiento rutinario. No gastes dinero sustituyendo algo que funciona bien.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Optimización mantenimiento */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Planifica mantenimiento cuando es barato, no cuando es urgente
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Concentra todas las intervenciones en periodos de baja demanda para negociar mejores precios
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Evita temporada alta de técnicos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El sistema te avisa en septiembre que 3 calderas tienen alto riesgo de fallo en diciembre-enero. Programas mantenimiento preventivo en octubre cuando los técnicos tienen capacidad. Pagas tarifa normal, no tarifa de emergencia que es 3x más cara en pleno invierno.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Agrupa intervenciones para descuentos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Tienes 5 edificios que necesitan revisión de ascensores en el próximo trimestre. El sistema te recomienda agruparlas la misma semana. Negocias con el proveedor descuento del 20% por volumen. Ahorras 6.000€ simplemente por coordinar timing.
                </p>
              </div>
            </div>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Presupuesto anual de mantenimiento optimizado
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                El sistema proyecta qué instalaciones van a necesitar mantenimiento o sustitución en los próximos 12 meses basándose en probabilidades de fallo. Te da un presupuesto anual realista de CAPEX mantenimiento.
              </p>
              <p className="text-gray-700 leading-relaxed">
                No es adivinar. Es calcular probabilísticamente qué va a necesitar atención este año. Puedes presupuestar con precisión en lugar de reservar un 10% genérico que siempre acaba siendo insuficiente o excesivo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vida útil instalaciones */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Extiende la vida útil de instalaciones caras
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Mantenimiento preventivo bien hecho puede añadir 5-8 años de vida a una instalación de 50K€
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                El ROI brutal del mantenimiento preventivo
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Una caldera industrial cuesta 45.000€ sustituir. Con mantenimiento preventivo riguroso (2.800€/año) dura 18-20 años. Sin mantenimiento, falla a los 12 años y tienes que cambiarla. Diferencia: 6-8 años adicionales de vida por inversión total de 22.400€ en mantenimiento.
              </p>
              <p className="text-white/90 leading-relaxed">
                ROI: gastas 22K€ en mantenimiento y evitas gastar 45K€ en sustitución prematura. Son 23K€ ahorrados por instalación. Multiplicado por 20 edificios con instalaciones similares, ahorras 460K€ en CAPEX solo extendiendo vida útil.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tracking de vida útil restante
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema estima la vida útil restante de cada instalación crítica basándose en edad, historial de mantenimiento, y patrones de fallo. Te dice: "Bomba A: 3-4 años restantes con mantenimiento adecuado. Bomba B: 1-2 años, planifica sustitución."
                </p>
                <p className="text-gray-700 text-sm">
                  Puedes planificar CAPEX de sustitución con años de antelación, no de emergencia cuando ya falló.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Detecta mantenimiento insuficiente
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Si el proveedor de mantenimiento dice que "todo está perfecto" pero el sistema detecta que una instalación de 10 años nunca ha tenido mantenimiento profundo, te alerta. El proveedor está haciendo un trabajo superficial.
                </p>
                <p className="text-gray-700 text-sm">
                  Puedes cambiar de proveedor antes de que la falta de mantenimiento real acorte vida útil de instalaciones caras.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Priorización intervenciones */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Prioriza intervenciones por impacto económico
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Cuando el presupuesto es limitado, actúa primero donde el fallo te costaría más caro
            </p>

            <div className="bg-white border-l-4 border-gray-800 p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                No todas las averías cuestan igual
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Si falla el ascensor de un edificio residencial, molestas inquilinos pero no es crítico. Si falla la caldera en pleno invierno, tienes 40 viviendas sin calefacción, inquilinos que reclaman, compensaciones obligatorias, imagen destruida. El coste real del fallo de caldera es 10x superior.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Prioridad crítica
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Instalaciones cuyo fallo genera compensaciones legales obligatorias a inquilinos, interrumpe servicio esencial, o causa daños estructurales. Calefacción, agua, electricidad. Estas van SIEMPRE primero.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Prioridad alta
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Instalaciones cuyo fallo genera molestias significativas o costes de reparación muy altos. Ascensores, aire acondicionado central, sistemas contra incendios. Van después de las críticas.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Prioridad media
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Instalaciones cuyo fallo genera molestias menores o costes moderados. Automatismos puertas, iluminación zonas comunes, sistemas de riego. Se atienden cuando hay presupuesto disponible.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valor para fondos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">
              El impacto real en costes operativos del fondo
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reduces CAPEX mantenimiento 40-50%
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Mantenimiento preventivo planificado cuesta 30-40% menos que reparaciones de emergencia. En un portfolio de 20 edificios gastando 800K€/año en mantenimiento reactivo, pasas a 450K€/año preventivo. Ahorras 350K€ anuales que van directo al NOI.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Extiendes vida útil de instalaciones 30-40%
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Instalaciones caras (calderas, ascensores, bombas) duran 6-8 años más con mantenimiento predictivo riguroso. Evitas sustituciones prematuras que en un portfolio suman 400-600K€ cada 5 años. Capital que se queda en caja.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Eliminas compensaciones por interrupciones
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Averías de calefacción, agua o electricidad obligan a compensar inquilinos. Son 50-150K€/año en compensaciones evitables. Con mantenimiento predictivo, estas averías críticas bajan un 80%. Ahorro directo que mejora rentabilidad neta.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                El caso que te va a destruir el NOI
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Un fondo gestionaba 18 edificios residenciales sin sistema predictivo. Solo reparaban cuando algo se rompía. En un año especialmente frío, 7 calderas fallaron entre diciembre y febrero (todas tenían 11-14 años sin mantenimiento profundo). Coste total: 245.000€ en reparaciones de emergencia + 82.000€ en compensaciones a inquilinos + daño reputacional que causó 12% de rotación inquilinos.
              </p>
              <p className="text-white/90 leading-relaxed">
                Si hubieran tenido IA predictiva, habrían detectado en septiembre que esas 7 calderas tenían alta probabilidad de fallo inminente. Mantenimiento preventivo profundo habría costado 19.000€ total. Las calderas habrían aguantado 3-5 años más. Ahorro: 308.000€ en un solo año. El sistema se habría pagado solo 15 veces.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}