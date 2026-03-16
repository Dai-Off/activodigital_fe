import { motion } from "motion/react";

export function PlataformaUnidades() {
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
              Plataforma / Gestión de Unidades
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Gestión <span className="font-semibold">de Unidades</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deja de gestionar 800 unidades con Excels donde no sabes qué está ocupado, qué vence, ni quién debe dinero
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
              El caos de gestionar cientos de unidades manualmente
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Property managers que no saben qué unidades están libres sin revisar Excel desactualizado
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No sabes qué unidades están libres
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Te llama un broker: "¿Tienes un local comercial libre en zona centro?". Tardas 20 minutos revisando Excel que tiene datos de hace 3 semanas. Mientras tanto, el broker alquila con tu competidor que le respondió en 2 minutos.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Vencimientos de contratos que se te escapan
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Un contrato vence en 15 días. No lo sabías porque nadie miró el Excel de contratos. El inquilino se va. Unidad vacía durante 4 meses hasta que la vuelves a alquilar. Pierdes 18.000€ de renta por falta de control.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Impagos que detectas tarde
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Inquilino de la unidad 3-B lleva 2 meses sin pagar. Nadie se dio cuenta porque el control de cobros es manual. Cuando quieres actuar ya debe 8.400€. Proceso judicial que tardará 8 meses. Pérdida casi irrecuperable.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gestión centralizada */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Base de datos completa de todas las unidades del portfolio
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA centraliza toda la información de cada unidad con estado actualizado en tiempo real
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                Cada unidad tiene su ficha completa
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                El sistema registra: identificación (edificio, planta, puerta, superficie), estado actual (ocupada/libre), inquilino actual (nombre, contacto, fecha entrada), contrato vigente (fecha inicio, fecha fin, renta mensual), histórico de inquilinos, impagos registrados, incidencias de mantenimiento específicas de esa unidad, características técnicas.
              </p>
              <p className="text-white/90 leading-relaxed">
                Toda la información actualizada automáticamente. Cuando cambias el estado de una unidad a "ocupada" y registras el nuevo contrato, se actualiza instantáneamente la ocupación del edificio, las proyecciones de ingresos, y desaparece de la lista de unidades disponibles.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Búsqueda instantánea de unidades disponibles
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Broker pregunta: "¿Tienes oficina libre 200-300m² zona Salamanca?". Abres el sistema, filtras: ubicación Salamanca + tipo oficina + estado libre + superficie 200-300m². En 5 segundos ves las 3 unidades que cumplen requisitos con renta de mercado sugerida.
                </p>
                <p className="text-gray-700 text-sm">
                  Respondes al broker en tiempo real. No pierdes oportunidades de alquiler por respuesta lenta.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Control automático de ocupación real
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema calcula automáticamente la ocupación real de cada edificio contando unidades con contrato vigente. No es manual. Si hay 80 unidades totales y 72 tienen contrato activo, la ocupación es 90%. Siempre actualizado. Siempre preciso.
                </p>
                <p className="text-gray-700 text-sm">
                  El LP pregunta ocupación y respondes con dato exacto actualizado HOY, no hace 2 semanas.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alertas vencimientos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Alertas automáticas de vencimientos de contratos
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              El sistema te avisa con 90 días de antelación de contratos próximos a vencer
            </p>

            <div className="bg-white border-l-4 border-gray-800 p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                El momento crítico es 3 meses antes del vencimiento
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Si un contrato vence en 15 días, es tarde para actuar. El inquilino probablemente ya buscó alternativa. Si te enteras con 90 días de antelación, puedes negociar renovación o empezar comercialización inmediata si no renueva. Minimizas vacancia.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <div className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                  !
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Vence en menos de 30 días
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Urgente: contacta al inquilino AHORA para negociar renovación o prepara comercialización inmediata. Si se va y no tienes sustituto, la vacancia empieza en 30 días.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-500 p-8">
                <div className="w-12 h-12 bg-gray-500 text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                  ⚠
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Vence en 30-90 días
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Momento ideal para negociar. Contacta inquilino para confirmar intención de renovar. Si no renueva, tienes tiempo de comercializar unidad y minimizar vacancia.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                  △
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Vence en más de 90 días
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Monitorizar: todavía no urgente pero mantén ojo. Si inquilino tiene historial de impago o baja satisfacción, empieza preparación temprana.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Control de impagos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Control automático de impagos antes de que escalen
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Detecta el mismo día que un inquilino no pagó su renta mensual
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Alertas de impago inmediatas
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La renta de la unidad 4-C vence día 5 de cada mes. Día 7 el sistema detecta que no se registró el cobro. Te alerta automáticamente. Contactas al inquilino ese mismo día. En muchos casos es un olvido: te paga en 48 horas. Problema resuelto sin escalar.
                </p>
                <p className="text-gray-700 text-sm">
                  Detectas impagos cuando solo deben 1 mes, no cuando ya deben 3-4 meses y es difícil recuperar.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Histórico de puntualidad por inquilino
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El sistema registra si cada inquilino paga puntual o tarde. Identificas inquilinos problemáticos: "Unidad 2-B: 8 de últimos 12 meses pagó con retraso superior a 10 días". Cuando su contrato vence, no renuevas. Evitas problemas recurrentes.
                </p>
                <p className="text-gray-700 text-sm">
                  Datos que te permiten tomar decisiones informadas sobre qué inquilinos mantener y cuáles no.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                El coste real de detectar impagos tarde
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Si detectas el impago cuando el inquilino lleva 1 mes sin pagar, todavía puedes negociar plan de pago o cortar rápido. Si lo detectas cuando ya debe 4-5 meses (16.000€), es casi irrecuperable. El proceso judicial tardará 10-12 meses. Mientras tanto sigues sin cobrar y la unidad está ocupada por moroso que no puedes sacar.
              </p>
              <p className="text-white/90 leading-relaxed">
                Coste total: 16.000€ ya debidos + 10 meses adicionales sin cobro = otros 40.000€. Son 56.000€ perdidos por una unidad porque detectaste el problema demasiado tarde. Con alertas automáticas de impago, actúas el día 3-5 cuando todavía es solucionable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Histórico unidades */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Histórico completo de cada unidad
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Sabes exactamente qué ha pasado en cada unidad desde que la gestionas
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Histórico de inquilinos
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Listado cronológico de todos los inquilinos que han ocupado esa unidad: nombre, fechas entrada/salida, renta pagada, si hubo impagos, motivo de salida. Identificas si la unidad tiene rotación anormal.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Histórico de mantenimiento
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Todas las incidencias de mantenimiento específicas de esa unidad: "3 reparaciones de fontanería en 2 años". Identificas unidades problemáticas con mantenimiento anormalmente alto que reducen rentabilidad neta.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Evolución de renta
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Renta cobrada históricamente: "2020: 1.800€/mes. 2022: 1.950€/mes. 2024: 2.100€/mes". Ves evolución real y comparas con mercado para identificar si estás por debajo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comercialización */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Reduce vacancia con comercialización proactiva
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Identifica unidades que van a quedar libres con tiempo de anticipación
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Empieza comercialización 60 días antes
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Contrato vence en 90 días. Contactas inquilino: no va a renovar. Tienes 60 días para comercializar. Publicas la unidad, contactas brokers, haces visitas. Cuando el inquilino se va, el siguiente entra en menos de 2 semanas. Vacancia mínima.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Renta de mercado sugerida por IA
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El sistema analiza rentas de unidades similares en la zona y te sugiere renta competitiva. Evitas pedir precio demasiado alto que alarga vacancia o demasiado bajo que deja dinero sobre la mesa.
                </p>
              </div>
            </div>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Minimiza días de vacancia por unidad
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Promedio de mercado: 45-60 días de vacancia por rotación de inquilino. Con comercialización proactiva y alertas tempranas, reduces a 10-15 días. En un portfolio de 800 unidades con rotación anual del 20% (160 unidades), ahorras 30 días de vacancia por unidad = 4.800 días totales de vacancia evitada = 13,2 años de rentas que NO se pierden.
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
              El impacto real en ingresos del fondo
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reduces vacancia del 8% al 3%
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Portfolio de 800 unidades con renta media 2.200€/mes. Vacancia histórica 8% = 64 unidades vacías = 140.800€/mes perdidos. Con alertas de vencimientos y comercialización proactiva, reduces vacancia a 3% = 24 unidades vacías = 52.800€/mes. Ahorras 88.000€ mensuales = 1,056M€ anuales.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Recuperas impagos antes de que escalen
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Detectas impagos cuando solo deben 1 mes. Tasa de recuperación 85% vs 20% cuando deben 4+ meses. En portfolio con 800 unidades, típicamente 2-3% tiene impagos = 20 casos/año. Recuperar 85% en lugar de 20% significa 260.000€ adicionales cobrados que sin alertas habrías perdido.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Respondes oportunidades en tiempo real
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Brokers que contactan buscando unidades disponibles. Si respondes en 5 minutos con opciones exactas, cierras. Si tardas 2 días porque tienes que revisar Excels, el broker ya alquiló con competidor. Capturas 40-50 oportunidades anuales adicionales que sin sistema perderías.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                El caso que te va a hundir la ocupación
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Un fondo gestionaba 650 unidades residenciales con control manual de contratos. No tenían alertas automáticas de vencimientos. En Q4 2024, 18 contratos vencieron sin que el equipo se diera cuenta a tiempo. Los inquilinos no renovaron (nadie les preguntó) y se fueron. Las 18 unidades quedaron vacías.
              </p>
              <p className="text-white/90 leading-relaxed">
                Tardaron 60 días promedio en volver a alquilar cada una porque no habían comercializado proactivamente. Pérdida: 18 unidades × 2.100€/mes × 2 meses vacancia = 75.600€. Multiplicado por 4 trimestres (problema recurrente), perdieron 302.400€ anuales en rentas que nunca cobraron simplemente porque no tenían sistema de alertas. Con ARKIA, habrían recibido alertas 90 días antes y minimizado vacancia a 10 días por unidad.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}