import { motion } from "motion/react";

export function PlataformaAnalytics() {
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
              IA / Análisis Energético
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              IA <span className="font-semibold">Energética</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deja de planificar rehabilitaciones a ciegas sin saber qué obras te dan el máximo retorno energético
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
              El desastre de invertir 500K€ en obras que no mueven la aguja
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Fondos que gastan fortunas en rehabilitación sin saber qué obras realmente mejoran la certificación
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Inviertes en las obras equivocadas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Gastas 200K€ cambiando todas las ventanas porque "se ve que están viejas". El técnico te dice después que el 80% de la pérdida energética venía de la cubierta sin aislar. Tiraste dinero en lo que menos impacto tenía.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No sabes cuánto vas a mejorar hasta después
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El comité aprueba 450K€ para rehabilitar. Ejecutas las obras. El nuevo certificado sale como C cuando necesitabas B para cumplir normativa. Ahora necesitas 150K€ más para llegar a B. Presupuesto reventado porque no simulaste antes.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Comparas 20 escenarios a mano durante semanas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  ¿Ventanas + cubierta? ¿O aerotermia + fachada? ¿O todo menos ventanas? Cada simulación cuesta 2 semanas del técnico. Tardas 2 meses en comparar opciones. El proyecto se retrasa, pierdes ventanas de obra.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simulación automática */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              IA que simula todos los escenarios posibles en minutos
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA calcula automáticamente qué combinación de obras te da la mejor relación coste/mejora energética
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                Cómo encuentra la combinación óptima de obras
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                El sistema toma el certificado energético actual del edificio, analiza todas las posibles intervenciones (ventanas, aislamiento cubierta, aislamiento fachada, calderas, aerotermia, fotovoltaica), calcula el coste de cada una según bases de datos oficiales, y simula TODAS las combinaciones posibles.
              </p>
              <p className="text-white/90 leading-relaxed">
                Te muestra qué escenario te lleva a certificación A con menor inversión, qué escenario maximiza ahorro energético por euro invertido, qué escenario cumple el mínimo normativo al menor coste. Comparas 50 escenarios en 3 minutos, no en 2 meses.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Simulación ANTES de gastar un euro
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Introduces las características del edificio. El sistema te dice: "Con 320K€ (ventanas + cubierta + aerotermia) llegas a B. Con 480K€ (ventanas + cubierta + aerotermia + fotovoltaica) llegas a A. Con 180K€ (solo cubierta + caldera eficiente) cumples mínimo normativo C."
                </p>
                <p className="text-gray-700 text-sm">
                  Tomas la decisión con datos exactos de coste/beneficio antes de comprometer capital. No después de gastarlo.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Identificas la obra con mayor impacto
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema te ordena las intervenciones por eficiencia: "Aislar cubierta mejora 35% la calificación por 80K€. Cambiar ventanas mejora 12% por 120K€. Fotovoltaica mejora 25% por 90K€." Ves inmediatamente que cubierta es lo prioritario.
                </p>
                <p className="text-gray-700 text-sm">
                  Empiezas por las obras que más mueven la aguja. Si te quedas sin presupuesto, al menos invertiste en lo que más impacto tenía.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparación escenarios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Compara escenarios con diferentes presupuestos
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              El comité te aprueba 300K€ en lugar de los 500K€ que pediste. Recalculas en 30 segundos qué obras hacer.
            </p>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ajusta el plan cuando cambia el presupuesto
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Habías planificado ventanas + cubierta + aerotermia por 480K€ para llegar a A. El comité solo aprueba 300K€. El sistema recalcula automáticamente: "Con 300K€ puedes hacer cubierta + aerotermia y llegas a B. Si priorizas cumplir normativa mínima, con 180K€ (solo cubierta + caldera) llegas a C que es suficiente."
              </p>
              <p className="text-gray-700 leading-relaxed">
                No tienes que volver a empezar todo el análisis desde cero. Ajustas el presupuesto y el sistema te da la mejor combinación para ese nuevo límite.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Escenario mínimo normativo
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  El sistema calcula qué obras hacer para cumplir justo el mínimo exigido por ley al menor coste posible. Útil cuando solo necesitas compliance, no maximizar eficiencia.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Escenario mejor ROI
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  El sistema identifica qué combinación maximiza ahorro energético por euro invertido. La mejor relación coste/beneficio sin llegar necesariamente a la certificación máxima.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Escenario certificación objetivo
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Necesitas llegar a A para vender a un fondo ESG. El sistema calcula la combinación más barata que te lleva exactamente a A, sin gastar más de lo necesario.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ahorro energético proyectado */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Calcula cuánto vas a ahorrar en OPEX cada año
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              No es solo certificar mejor. Es cuánto dinero ahorras en facturas energéticas cada mes durante 20 años.
            </p>

            <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                Ahorro anual proyectado por escenario
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                El sistema calcula el consumo energético actual del edificio y el consumo proyectado después de cada combinación de obras. Te dice cuántos kWh vas a ahorrar al año, a cuántos euros equivale ese ahorro según precios actuales de energía, y cuántos años tardas en recuperar la inversión.
              </p>
              <p className="text-white/90 leading-relaxed">
                Ejemplo real: inviertes 380K€ en cubierta + aerotermia + fotovoltaica. Ahorras 62.000€/año en facturas energéticas. Payback en 6,1 años. El edificio tiene vida útil de 50 años. Son 3,1M€ de ahorro acumulado en 50 años. Ese ahorro capitalizado suma directamente al valor del activo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Reducción de emisiones certificada
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema calcula cuántas toneladas de CO2 dejas de emitir al año con cada escenario. Esto es crítico para fondos con objetivos ESG vinculantes que deben reportar reducción de huella de carbono del portfolio.
                </p>
                <p className="text-gray-700 text-sm">
                  No es greenwashing: son datos certificables que puedes mostrar en informes ESG auditados.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Impacto en NOI del edificio
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El ahorro en OPEX sube directamente el NOI. Un ahorro de 50K€/año en energía es 50K€ más de NOI que se capitaliza al yield del activo. El sistema calcula cuánto sube la valoración del edificio solo por el efecto OPEX.
                </p>
                <p className="text-gray-700 text-sm">
                  Justificas la inversión en rehabilitación no solo por cumplir normativa, sino por aumento directo de valor del activo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cumplimiento EPBD */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Simula si cumples EPBD en los plazos críticos
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              La Directiva Europea te obliga a llegar a D en 2030 y E en 2033. ¿Tus obras te llevan ahí?
            </p>

            <div className="bg-gray-100 border-l-4 border-gray-800 p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                El riesgo real de no cumplir plazos
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Si tu edificio no llega a D en 2030, no podrás venderlo, alquilarlo, ni refinanciarlo. Es un activo stranded que vale CERO. Los fondos que no planifican ahora van a tener edificios bloqueados en 2030 que tendrán que malvender con descuentos del 40-50%.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Valida si cumples antes de ejecutar
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El sistema simula la certificación post-obras y te dice si llegas a D para 2030. Si tu plan solo te lleva a E, te avisa ANTES de gastar el dinero. Puedes añadir obras adicionales para llegar a D o tomar la decisión consciente de no cumplir y vender antes de 2030.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Planificación por fases hasta 2033
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  No tienes que hacer todas las obras de golpe. El sistema te permite planificar: Fase 1 (2025): cubierta + ventanas = llegas a D para 2030. Fase 2 (2031): aerotermia + fotovoltaica = llegas a B para 2033. Distribuyes CAPEX en el tiempo sin arriesgar cumplimiento.
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
              El impacto real en el IRR del fondo
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Evitas gastar en las obras equivocadas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Simulas antes de ejecutar. Identificas que cambiar ventanas aporta 12% de mejora por 120K€ mientras aislar cubierta aporta 35% por 80K€. Inviertes en cubierta primero. Ahorras 40K€ y consigues 3x más impacto. Multiplicado por 20 edificios, son 800K€ de CAPEX ahorrado.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Garantizas cumplimiento EPBD sin sorpresas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Validas que tu plan de obras te lleva a D para 2030 ANTES de ejecutar. No te arriesgas a gastar 400K€ y descubrir después que solo llegaste a E. Evitas tener que invertir 200K€ adicionales de emergencia en 2029 cuando los precios de obras se disparen por la demanda.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Justificas inversiones con ahorro OPEX
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  El comité ve que invertir 380K€ genera 62K€/año de ahorro energético = payback 6 años + sube NOI permanentemente. El ahorro capitalizado añade 1,2M€ al valor del activo. ROI del 315% que justifica aprobar la inversión sin discusión.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                El caso que te va a arruinar el exit
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Un fondo rehabilitó 12 edificios invirtiendo 5,8M€ sin simular previamente. Objetivo: llegar a C para cumplir normativa. Resultado post-obras: 8 edificios llegaron a C, pero 4 se quedaron en D porque el técnico se equivocó en el cálculo de mejora de las calderas. Coste adicional no presupuestado: 680K€ más para terminar de llevar esos 4 edificios a C.
              </p>
              <p className="text-white/90 leading-relaxed">
                Peor aún: durante la ejecución descubrieron que si hubieran añadido fotovoltaica por 90K€ por edificio, habrían llegado a B en lugar de C. Eso habría sumado 2,4M€ al valor total del portfolio por el Green Premium. Oportunidad perdida por no haber simulado todos los escenarios antes de ejecutar.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}