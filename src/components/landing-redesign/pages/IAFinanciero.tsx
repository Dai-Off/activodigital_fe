import { motion } from "motion/react";

export function IAFinanciero() {
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
              IA / Análisis Financiero
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              IA <span className="font-semibold">Financiera</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deja de descubrir desviaciones de 200K€ cuando ya es tarde para corregirlas
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
              El desastre de detectar problemas financieros 6 meses tarde
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Fondos que gestionan millones sin alertas tempranas de desviaciones críticas
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Desviaciones presupuestarias invisibles
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Presupuestaste 480K€ para rehabilitar un edificio. A mitad de obra llevas gastados 380K€. Todo parece normal. Al final cierras en 680K€. Sobrecosto del 42% que nadie detectó a tiempo porque no había sistema de alertas tempranas.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Pagos duplicados que nadie ve
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El proveedor X factura dos veces la misma partida de obra con 15 días de diferencia. Finance lo paga dos veces porque no hay control cruzado. Son 28.000€ que se pierden y nadie detecta hasta la auditoría anual, cuando ya no puedes reclamar.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Proyecciones obsoletas que engañan al comité
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Proyectaste NOI de 520K€ hace 8 meses cuando compraste el edificio. Los costes OPEX subieron 18%, la ocupación bajó 12%. El NOI real va a ser 420K€. El comité sigue viendo las proyecciones antiguas y toma decisiones basadas en datos obsoletos.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alertas automáticas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              IA que detecta anomalías financieras antes de que exploten
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              El sistema marca en rojo situaciones que requieren atención antes de que se conviertan en problemas financieros reales
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                Cómo detecta problemas que tú no verías
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                El sistema aprende los patrones normales de gasto de cada edificio y cada categoría. Cuando algo se desvía significativamente del patrón histórico o del presupuesto, te alerta inmediatamente. No es un humano revisando Excels manualmente una vez al mes. Es IA analizando cada transacción en tiempo real.
              </p>
              <p className="text-white/90 leading-relaxed">
                Detecta: sobrecostes en obra antes de que revientes presupuesto, pagos duplicados el mismo día que ocurren, facturas sospechosas con importes anormalmente altos, proveedores que suben precios sin avisar, desviaciones de NOI proyectado versus real.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proyecciones actualizadas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Proyecciones financieras que se actualizan solas
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Deja de trabajar con Excel que tiene datos de hace 6 meses
            </p>

            <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                Siempre ves proyecciones basadas en datos reales actuales
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                El sistema toma los ingresos y gastos reales de los últimos meses, ajusta las proyecciones futuras con esos datos actuales, y recalcula automáticamente el NOI proyectado, el yield esperado, y el valor del activo. No tienes que actualizar manualmente ningún Excel.
              </p>
              <p className="text-white/90 leading-relaxed">
                Si los costes OPEX están subiendo sistemáticamente, las proyecciones se ajustan a la baja automáticamente. Si la ocupación mejoró, las proyecciones se ajustan al alza. El comité siempre toma decisiones con datos actualizados, no con estimaciones de hace meses que ya no reflejan la realidad.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Detecta tendencias negativas antes de que sea tarde
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El OPEX de un edificio ha subido 3% mensual los últimos 4 meses. El sistema proyecta que si la tendencia continúa, el NOI va a caer 15% este año. Te alerta AHORA para que investigues qué está pasando y corrijas antes de que se vuelva crítico.
                </p>
                <p className="text-gray-700 text-sm">
                  No esperas al cierre trimestral para descubrir que perdiste rentabilidad. Lo detectas en tiempo real.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Compara proyección versus realidad constantemente
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Proyectaste 520K€ NOI cuando compraste. El sistema compara continuamente: "Estás en track para hacer 485K€ NOI (-6,7%). La desviación viene principalmente de costes mantenimiento 22% por encima de lo presupuestado."
                </p>
                <p className="text-gray-700 text-sm">
                  Identificas exactamente dónde está el problema sin tener que investigar manualmente.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Control de obra */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Control de obra con alertas de sobrecosto tempranas
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Deja de enterarte al final que la obra costó 40% más de lo presupuestado
            </p>

            <div className="bg-white border-l-4 border-gray-800 p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                El momento crítico es a mitad de obra
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Cuando llevas 50% de la obra ejecutada y has gastado 70% del presupuesto, AHÍ es cuando todavía puedes parar, renegociar con la constructora, o ajustar alcance. Si lo detectas cuando ya gastaste el 95%, es demasiado tarde para corregir.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Seguimiento por partidas
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  El sistema compara gasto real versus presupuesto partida por partida. Detecta que "Instalaciones" lleva gastado 180K€ de 140K€ presupuestados. Te avisa de sobrecosto del 28% en esa partida específica mientras el resto va bien.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Proyección de cierre
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Basándose en el ritmo de gasto actual y el % de obra pendiente, el sistema proyecta el coste final. "Al ritmo actual vas a cerrar en 620K€ en lugar de 480K€ presupuestados." Te da tiempo de reaccionar.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Certificaciones versus pagos
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Detecta si has pagado más de lo certificado por la dirección facultativa. Si el constructor te facturó 280K€ pero solo hay 240K€ certificados, te alerta de discrepancia antes de que sea difícil recuperar.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Análisis comparativo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Compara performance entre edificios del portfolio
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Identifica qué edificios tienen costes anormalmente altos y por qué
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Benchmarking automático
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El sistema compara costes OPEX por m² entre edificios similares del portfolio. Detecta que el Edificio A tiene costes de mantenimiento 35% superiores al Edificio B siendo similares en tamaño y uso. Te permite investigar qué está pasando.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Identifica proveedores caros
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Si el proveedor de limpieza del Edificio A cobra 4,2€/m² y el del Edificio B cobra 2,8€/m² por el mismo servicio, lo ves claro. Puedes renegociar o cambiar al proveedor más barato que ya usas en otro edificio.
                </p>
              </div>
            </div>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Reducción de costes financieros
              </h3>
              <p className="text-gray-700 leading-relaxed">
                El Edificio C tiene costes energéticos 40% más bajos que edificios similares porque implementaron un sistema de gestión inteligente. El sistema te identifica esa mejor práctica. Puedes replicarla en los otros edificios y ahorrar cientos de miles en todo el portfolio.
              </p>
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
              El impacto real en el P&L del fondo
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Evitas sobrecostes de obra del 30-40%
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Alertas tempranas a mitad de obra te dan tiempo de renegociar con constructora o ajustar alcance. Reduces sobrecostes del 40% típico a 10-15% controlado. En un portfolio de 10 obras sumando 6M€, ahorras 1,5M€ en CAPEX no presupuestado.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Detectas fugas de caja antes de que sumen
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Pagos duplicados, facturas infladas, proveedores que abusan de precios. Individualmente son 5-10K€, pero acumulados en 20 edificios durante un año suman 200-300K€. El sistema detecta cada fuga el día que ocurre, no 6 meses después.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tomas decisiones con datos actuales
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  El comité decide si vender o hold basándose en proyecciones actualizadas automáticamente, no en Excels de hace 6 meses. Evitas vender activos que mejoraron performance o mantener activos cuya rentabilidad está cayendo sin saberlo.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                El caso que te va a costar tu reputación
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Un fondo rehabilitó un edificio con presupuesto aprobado de 4,2M€. A mitad de obra llevaban gastados 3,1M€. Nadie hizo seguimiento detallado porque "íbamos bien de timing". Al final la obra cerró en 6,4M€. Sobrecosto del 52% que reventó completamente el business plan del activo.
              </p>
              <p className="text-white/90 leading-relaxed">
                El IRR proyectado del 18% se convirtió en 9,2% real. El edificio que debía ser star performer del fondo acabó siendo el peor activo del portfolio. El GP tuvo que explicar al LP cómo perdieron control de una obra que parecía ir bien hasta que fue demasiado tarde. Con alertas automáticas de desviación presupuestaria a mitad de obra, habrían detectado el problema cuando todavía podían corregir.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}