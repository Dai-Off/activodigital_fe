import { motion } from "motion/react";

export function PlataformaCalendario() {
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
              Gestión / Calendario
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Calendario <span className="font-semibold">Operativo</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deja de perder fechas críticas que te cuestan multas, bloquean ventas y destrozan tu reputación profesional
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
              El coste real de gestionar 20 edificios con Excel y calendarios dispersos
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Cada mes pierdes dinero porque algo crítico se te pasó por alto
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Certificados caducados = ventas bloqueadas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El certificado energético caducó hace 3 meses. Te enteras cuando el comprador lo pide en due diligence. Resultado: retraso de 6 semanas, pérdida de confianza, rebaja de precio del 3% para compensar. 180.000€ menos por un papel que olvidaste renovar.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Mantenimientos mal coordinados = dinero tirado
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Programaste 4 inspecciones de ascensores el mismo día en edificios a 50km. El técnico solo puede hacer 2. Reprogramar cuesta 3 semanas más. Pierdes descuentos por volumen porque no agrupaste edificios cercanos el mismo mes.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Inspecciones obligatorias perdidas = multas automáticas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  La inspección periódica de gas venció hace 2 meses. Industria te pilla en una inspección aleatoria. Multa de 6.000€ + cierre temporal del edificio + costes legales. Todo porque nadie tenía visibilidad de qué vencía cuándo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solución core */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Todo lo que debe pasar en todos tus edificios, en un único lugar
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA agrupa automáticamente cada vencimiento, mantenimiento, inspección, pago y reunión de todo tu portfolio
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                Alertas automáticas de lo que es urgente
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                El sistema marca en rojo lo que vence en menos de 15 días. No tienes que revisar manualmente cada edificio para ver qué es urgente. Abres el calendario y ves inmediatamente qué certificados caducan pronto, qué mantenimientos están atrasados, qué inspecciones obligatorias necesitas programar YA.
              </p>
              <p className="text-white/90 leading-relaxed">
                Ya no dependes de acordarte. El sistema te avisa cuando algo crítico necesita acción inmediata.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Filtra por tipo cuando necesitas enfocarte
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Estás revisando presupuestos de mantenimiento para el Q3. Filtras solo mantenimientos y ves todos los del trimestre agrupados. Puedes negociar con el proveedor para que haga edificios cercanos el mismo día y conseguir descuentos por volumen.
                </p>
                <p className="text-gray-700 text-sm">
                  Necesitas asegurarte de que ningún certificado caduque en los próximos 60 días. Filtras solo vencimientos y ves todos los que están cerca. Programas renovaciones antes de que sea tarde.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tres formas de ver según lo que hagas
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Necesitas revisar rápido qué tienes hoy y mañana: vista de lista. Planificar la semana completa: vista semanal. Tener perspectiva del mes para identificar semanas saturadas: vista mensual.
                </p>
                <p className="text-gray-700 text-sm">
                  Cambias de vista en un click según lo que necesites hacer en ese momento. No estás atrapado en una única forma de ver la información.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tipos de eventos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Cada tipo de actividad tiene su código de color
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Identificas de un vistazo qué es cada cosa sin tener que leer
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Mantenimientos preventivos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Las revisiones que haces tú proactivamente para evitar averías. Revisión de calderas antes del invierno, limpieza de canalones antes de lluvias, revisión de aire acondicionado antes del verano. Te ahorran averías de emergencia que cuestan 3x más.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Mantenimientos correctivos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Las reparaciones de averías que ya ocurrieron. Ascensor averiado, fuga de agua, rotura de cristal. Están marcadas claramente para que sepas qué es urgente resolver versus qué es preventivo que puedes planificar con calma.
                </p>
              </div>

              <div className="bg-[#0ea5e9]/5 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Mantenimientos predictivos (IA)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El sistema analiza datos históricos y te avisa cuando una instalación va a fallar ANTES de que falle. Sustituyes la bomba de agua antes de que se rompa en pleno agosto, no después. Evitas emergencias costosas.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-500 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Inspecciones obligatorias
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Las inspecciones que exige la ley y que debe hacer un organismo certificado. Gas, electricidad, ascensores, contra incendios. Si se pasan de fecha, multa automática + riesgo de cierre. El sistema te avisa con antelación.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Vencimientos de certificados
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Certificados energéticos, seguros, licencias de actividad. Si caducan, no puedes vender, no puedes alquilar, pierdes cobertura de seguro. Están destacados con su propio color para que nunca se te escapen.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Pagos programados
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Cuotas de comunidad, IBI, seguros, contratos de servicios. Ves cuándo vence cada pago para tener liquidez preparada. No te pillan pagos grandes por sorpresa que descuadran tu tesorería mensual.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Responsables */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Cada tarea tiene un responsable asignado
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Si algo no se hace, sabes exactamente quién debía hacerlo
            </p>

            <div className="bg-white border-l-4 border-[#0a0a0a] p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Trazabilidad completa para mejorar procesos
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                La caldera se averió en pleno invierno. El sistema te dice que el mantenimiento preventivo estaba asignado al proveedor X, que no lo ejecutó en la fecha programada. Tienes datos objetivos para reclamarle o cambiar de proveedor.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Sin trazabilidad, era tu palabra contra la suya. Con trazabilidad, tienes evidencia clara de quién incumplió y cuándo. Eso te da poder de negociación real.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Detecta proveedores problemáticos con datos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Si un proveedor no ejecuta mantenimientos a tiempo repetidamente, lo ves claro en el histórico. No es intuición ni sensación. Son hechos objetivos que justifican cambiar de proveedor con el comité de inversión.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Identifica cuellos de botella internos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Si tu property manager aprueba presupuestos con 3 semanas de retraso sistemático, lo ves claro. Puedes cambiar procesos internos, reasignar responsabilidades o contratar más personal donde realmente hace falta.
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
              El impacto económico real de tener control operativo
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Evitas multas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Una inspección obligatoria perdida puede costarte 6.000€ de multa + cierre temporal + costes legales. Multiplicado por 20 edificios, un solo descuido puede costarte más de 100.000€. Con alertas automáticas, nunca te pilla por sorpresa.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reduces costes operativos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Cuando ves todos los mantenimientos del mes juntos, puedes negociar con proveedores para que hagan edificios cercanos el mismo día. Descuentos por volumen + menos desplazamientos = ahorro directo que va al NOI.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Desbloqueas ventas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Un certificado caducado puede bloquearte una venta durante semanas. Si el comprador usa eso para presionarte, pierdes 2-3% del precio de venta. En un edificio de 6M€, son 180.000€ tirados por un papel que olvidaste renovar.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                El caso que te va a costar caro
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Un fondo tenía un edificio residencial en proceso de venta por 6M€. Durante la due diligence, el comprador detectó que el certificado energético había caducado hace 8 meses y la inspección de gas hace 5 meses. Resultado: retraso de 6 semanas para renovar ambos, pérdida total de confianza del comprador, rebaja de precio del 3% para "compensar el riesgo de mala gestión".
              </p>
              <p className="text-white/90 leading-relaxed">
                Coste real: 180.000€ menos de venta + 12.000€ de multa administrativa por la inspección caducada. Total: 192.000€ tirados por no tener visibilidad de dos vencimientos simples. Con un calendario centralizado con alertas automáticas, esto nunca habría pasado.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}