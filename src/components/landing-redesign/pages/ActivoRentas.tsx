import { motion } from "motion/react";

export function ActivoRentas() {
  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">
      <section className="relative py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Activo / Rentas</div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Control de Cobro <span className="font-semibold">de Rentas</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Seguimiento automático de cobro mensual por unidad, calendario visual anual y alertas de impago inmediatas
            </p>
          </motion.div>
        </div>
      </section>

      {/* El problema del control manual */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
            El desangre silencioso: morosidad sin control automatizado
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Fondos que pierden 8-12% de ingresos anuales por impagos no detectados a tiempo
          </p>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            <div className="bg-gray-100 border-l-4 border-gray-800 p-6 md:p-10">
              <div className="text-gray-900 text-4xl font-bold mb-4">156K€</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Pérdida anual por morosidad no detectada hasta fin de mes
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Edificio 45 unidades residenciales, renta promedio 1.850€/mes. Sin control automático, gestor revisa cobros manualmente día 28-30 de cada mes (revisa transferencias bancarias una por una contra listado de inquilinos en Excel). Descubre impagos cuando el mes ya terminó.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Resultado típico: 3-4 inquilinos no pagaron ese mes. Cuando envías reclamación (día 2-3 del mes siguiente), ya deben 1 mes completo. Los morosos profesionales lo saben: si nadie reclama primeros días, pueden seguir sin pagar 2-3 meses más antes de que escale a legal. Morosidad promedio sin alertas tempranas: 9,2% de unidades = 4,1 unidades × 1.850€ × 12 meses = 91.020€/año no cobrados.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Con alertas automáticas DÍA 5 (no día 30), reclamas cuando solo deben 5 días. El moroso sabe que estás encima. Paga ese mismo mes. Morosidad con alerta temprana: 2,8% = 1,3 unidades × 1.850€ × 12 meses = 28.860€/año. Recuperas 62.160€ anuales simplemente por reclamar día 5 en lugar de día 30.
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                Portfolio 20 edificios con 900 unidades totales: recuperas 1,2M€ anuales que antes perdías por reclamación tardía.
              </p>
            </div>

            <div className="bg-gray-100 border-l-4 border-gray-800 p-6 md:p-10">
              <div className="text-gray-900 text-4xl font-bold mb-4">8 meses</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Moroso que debe 14.800€ porque nadie hizo seguimiento mensual
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Inquilino unidad 4-B, renta 1.850€/mes. Paga puntualmente primeros 4 meses. Mes 5 no paga. Gestor no tiene control automatizado: revisa manualmente cobros cuando "tiene tiempo" (cada 2-3 meses). Mes 5, 6, 7 pasan sin que nadie detecte que 4-B no pagó.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Mes 8, gestor finalmente revisa. Descubre: 4-B debe 4 meses (7.400€). Envía requerimiento formal. Inquilino responde: "Estoy en problemas financieros, no puedo pagar". Inicias proceso de desahucio. Proceso legal: 6-8 meses adicionales. Durante esos meses, inquilino sigue sin pagar (estrategia dilatoria común). Al final lo desahucias. Total adeudado: 8 meses × 1.850€ = 14.800€. Recuperas 4.200€ mediante embargo de nómina en 3 años. Pérdida neta: 10.600€.
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                Si hubieras detectado impago en mes 5 día 5 y reclamado inmediatamente, inquilino habría pagado ese mes (todavía tenía recursos). Pérdida evitada: 10.600€. Con 20 edificios, evitas 2-3 casos así al año = 25-32K€ anuales ahorrados.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-12">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">Por qué el control manual de rentas SIEMPRE falla</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-white/90 leading-relaxed">
                <p className="mb-4">
                  <span className="font-semibold text-[#0ea5e9]">Proceso manual típico:</span> Gestor descarga extracto bancario fin de mes
                </p>
                <p className="mb-4">Tiempo invertido: 3-4 horas/edificio/mes para portfolio de 20 edificios = 60-80 horas mensuales = 1,5 personas full-time solo cruzando pagos.</p>
                <p>Problema: Detectas impagos 25-30 días DESPUÉS de que ocurrieron. El moroso ya tiene ventaja de 1 mes. Recovery rate baja al 78-82%.</p>
              </div>
              <div className="text-white/90 leading-relaxed">
                <p className="mb-4">
                  <span className="font-semibold text-[#0ea5e9]">Con ARKIA:</span> Sistema marca automáticamente cada unidad como "Pagada" cuando registras el cobro. Día 5 de cada mes genera alerta: "7 unidades no pagaron todavía". Reclamas inmediatamente cuando solo deben 5 días.
                </p>
                <p className="mb-4">Tiempo invertido: 0 minutos cruzando pagos. 15 minutos enviando reclamaciones solo a morosos detectados automáticamente.</p>
                <p>Resultado: Detectas impago en tiempo real (día 5-7). Recovery rate sube a 94-97%. Recuperas 180-220K€ anuales adicionales en portfolio de 20 edificios.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendario visual completo */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
            Calendario visual de cobro de rentas mensuales
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Vista mensual y anual que muestra estado de cobro de cada unidad con código de colores
          </p>

          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/90 text-white p-6 md:p-14 mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold mb-8">Cómo funciona el calendario de rentas (Vista Mensual)</h3>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-[#0ea5e9]/30 border-2 border-[#0ea5e9] p-6 rounded-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">Unidad 2-A</span>
                  <span className="text-2xl">✓</span>
                </div>
                <div className="text-sm text-white/80">Renta: 2.100€</div>
                <div className="text-sm text-white/80">Cobrado: 02/05/2025</div>
                <div className="text-xs text-[#0ea5e9] mt-2">Estado: PAGADO ✓</div>
              </div>
              <div className="bg-[#0ea5e9]/20 border-2 border-[#0ea5e9]/60 p-6 rounded-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">Unidad 2-B (Jorge M.)</span>
                  <span className="text-lg font-bold text-white">1.850€</span>
                </div>
                <div className="text-sm text-white/90">Renta: 1.850€</div>
                <div className="text-sm text-white/90">Cobrado: 18/05/2025</div>
                <div className="text-xs text-[#0ea5e9] mt-2">Estado: PAGADO CON RETRASO (13 días)</div>
              </div>
              <div className="bg-white/10 border-2 border-white/20 p-6 rounded-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Unidad 5-C</span>
                  <span className="text-2xl">✗</span>
                </div>
                <div className="text-sm text-white/70">Renta: 1.950€</div>
                <div className="text-sm text-white/70">Vencimiento: 05/05/2025</div>
                <div className="text-xs text-white/60 mt-2">Estado: IMPAGO (22 días vencido)</div>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed mb-4">
              El calendario muestra las 40 unidades del edificio con código de colores: VERDE = pagado puntual (primeros 7 días del mes) | AMARILLO = pagado con retraso (8-15 días) | ROJO = impago (más de 15 días sin cobrar).
            </p>
            <p className="text-white/90 leading-relaxed">
              Vista mensual permite identificar instantáneamente: ¿Cuántas unidades pagaron ya? (ej: 36 de 40 = 90%) | ¿Cuántas están en mora? (ej: 4 unidades = 10% morosidad) | ¿Quiénes son los morosos? (nombres + meses adeudados) | ¿Cuánto dinero falta por cobrar ese mes? (ej: 7.450€ pendientes de 4 unidades).
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white border-l-4 border-[#0ea5e9] p-6 md:p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Vista Anual: detecta patrones de impago
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                El calendario anual muestra los 12 meses del año en una cuadrícula. Seleccionas unidad 3-B y ves su historial completo: Ene ✓ | Feb ✓ | Mar ✓ | Abr ⚠ | May ✗ | Jun ✗ | Jul ✗ | Ago ✗. Identificas inmediatamente: inquilino que pagaba puntual Ene-Mar, empezó a retrasarse en Abril, dejó de pagar Mayo-Agosto.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Esto te permite: 1) Identificar inquilinos problemáticos que están entrando en mora (actúas antes de que deban 6-8 meses), 2) Ver patrones estacionales (ej: algunos inquilinos siempre se retrasan en Enero post-Navidad pero luego recuperan), 3) Documentar historial completo para proceso legal si es necesario (demuestras morosidad reiterada).
              </p>
              <div className="bg-[#0ea5e9]/5 p-6 border-l-2 border-[#0ea5e9]">
                <div className="text-sm font-semibold text-[#0ea5e9] mb-2">Caso de uso:</div>
                <p className="text-sm text-[#0ea5e9]">
                  Unidad 4-D tiene patrón: pagos puntuales 9 meses/año, retraso 3 meses/año (siempre Enero, Julio, Diciembre). Sabes que es inquilino con flujo de caja irregular pero que SIEMPRE termina pagando. No inicias proceso legal. Le das 15 días extra esos meses sabiendo que pagará. Ahorras 3.500€ en costes legales innecesarios. Mantienes buena relación con inquilino que es "buen pagador con retrasos puntuales" vs "moroso crónico".
                </p>
              </div>
            </div>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-6 md:p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Proyección de ingresos anuales versus real
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                El sistema calcula automáticamente: PROYECTADO = Suma todas las rentas vigentes × 12 meses. Ejemplo: 40 unidades con renta promedio 1.900€ × 12 = 912.000€ anuales proyectados. REAL = Suma de lo cobrado efectivamente cada mes. Ejemplo mes Mayo: 38 unidades pagaron (2 morosos) = 72.200€ cobrado versus 76.000€ proyectado = -5% desviación.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Acumulado año: Proyectado 912K€ | Real cobrado 876K€ | Diferencia -36K€ (-3,9%). Ves inmediatamente que estás perdiendo 3,9% de ingresos por morosidad + vacancia no prevista. Puedes actuar: reclamar más agresivamente a morosos, o aceptar que esa tasa de pérdida es "normal" en tu mercado y ajustar presupuesto futuro en consecuencia.
              </p>
              <div className="bg-gray-100 p-6 border-l-2 border-gray-800">
                <div className="text-sm font-semibold text-gray-900 mb-2">Alerta desviación crítica:</div>
                <p className="text-sm text-gray-700">
                  "Ingresos reales -8,2% versus proyectado últimos 3 meses. Morosidad aumentando. Acción requerida: revisar política cobros + evaluar inquilinos morosos para proceso desahucio." Sistema alerta cuando desviación supera 6% (umbral configurable). No esperas a fin de año para descubrir que perdiste 80K€.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alertas automáticas */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
            Alertas automáticas de impago para acción inmediata
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            El sistema te avisa día 5 de cada mes quién no pagó todavía para que reclames cuando solo deben 5 días
          </p>

          <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0ea5e9]/80 text-white p-6 md:p-12 mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">Flujo de alertas automáticas mensuales</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 p-6 rounded-sm">
                <div className="text-4xl font-bold mb-3">DÍA 5</div>
                <div className="text-sm font-semibold mb-2">Primera alerta</div>
                <p className="text-sm text-white/80">Sistema identifica unidades que no pagaron todavía. "7 unidades sin pagar: 2-B, 3-C, 4-A, 5-D, 7-F, 9-A, 12-B. Enviar recordatorio." Adeudo: 5 días (recuperable fácilmente).</p>
              </div>
              <div className="bg-white/10 p-6 rounded-sm">
                <div className="text-4xl font-bold mb-3">DÍA 15</div>
                <div className="text-sm font-semibold mb-2">Segunda alerta (escalado)</div>
                <p className="text-sm text-white/80">"3 unidades siguen sin pagar después de recordatorio: 3-C, 5-D, 9-A. Enviar requerimiento formal de pago. Adeudo: 15 días (entrando en mora)."</p>
              </div>
              <div className="bg-white/10 p-6 rounded-sm">
                <div className="text-4xl font-bold mb-3">DÍA 30</div>
                <div className="text-sm font-semibold mb-2">Alerta crítica</div>
                <p className="text-sm text-white/80">"2 unidades con 1 mes impago completo: 5-D, 9-A. Iniciar proceso de reclamación legal o evaluar desahucio. Pérdida acumulada: 3.750€."</p>
              </div>
              <div className="bg-white/10 p-6 rounded-sm">
                <div className="text-4xl font-bold mb-3">DÍA 60</div>
                <div className="text-sm font-semibold mb-2">Alerta desahucio</div>
                <p className="text-sm text-white/80">"Unidad 9-A adeuda 2 meses (3.800€). Moroso crónico identificado. Proceder con desahucio inmediato para evitar pérdida adicional."</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-gray-50 p-6 md:p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Por qué reclamar día 5 versus día 30 multiplica recovery rate
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Inquilino que no paga día 5: Típicamente es olvido genuino o problema temporal de liquidez. Cuando recibe recordatorio inmediato, paga esa misma semana. Recovery rate día 5: 92-95%. Solo 5-8% son morosos reales que no pagarán incluso con reclamación.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Inquilino que no paga día 30: Ya pasó todo el mes. Si no pagó en 30 días, probablemente es problema estructural (perdió empleo, problemas financieros graves). Recovery rate día 30: 68-75%. Casi 1 de cada 3 no pagará incluso con proceso legal.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Matemática simple: Portfolio con 900 unidades. Morosidad mensual típica: 45 unidades (5%). Con reclamación día 30: recuperas 68% = 30,6 unidades. Pierdes 14,4 unidades × renta media 1.850€ = 26.640€/mes = 319.680€/año. Con reclamación día 5: recuperas 93% = 41,9 unidades. Pierdes solo 3,1 unidades × 1.850€ = 5.735€/mes = 68.820€/año. Diferencia: ahorras 250.860€ anuales simplemente por reclamar 25 días antes.
              </p>
            </div>

            <div className="bg-gray-50 p-6 md:p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Histórico de comportamiento de pago por inquilino
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                El sistema acumula historial completo de cada inquilino: meses totales en propiedad, meses pagados puntual, meses pagados con retraso, meses impagados, deuda máxima acumulada, tiempo promedio de pago. Score automático: "Buen pagador" ({">"} 95% meses puntuales) | "Pagador irregular" (70-95% puntual) | "Moroso crónico" ({"<"} 70% puntual).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Uso estratégico: Cuando inquilino "buen pagador" con 24 meses historial perfecto se retrasa 1 mes, le das cortesía de 15 días extra antes de reclamar (probablemente problema puntual). Cuando inquilino "moroso crónico" se retrasa, reclamas día 6 agresivamente (sabes que no pagará sin presión).
              </p>
              <p className="text-gray-700 leading-relaxed">
                En renovaciones de contrato: rechazas renovar a "morosos crónicos" (aunque finalmente hayan pagado todo, el coste administrativo de reclamarles cada mes no vale la pena). Priorizas renovación de "buenos pagadores" incluso ofreciendo condiciones más favorables para retenerlos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valor portfolio */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-light mb-12 text-center">
            El impacto económico real de control automático de rentas
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <div className="bg-white/10 p-6 md:p-10 rounded-sm backdrop-blur-sm">
              <div className="text-4xl md:text-6xl font-bold text-[#0ea5e9] mb-4">-58%</div>
              <h3 className="text-2xl font-semibold mb-4">Reducción pérdidas por morosidad</h3>
              <p className="text-white/80 leading-relaxed">
                Portfolio 20 edificios, 900 unidades, renta media 1.850€. Sin sistema: morosidad 9,2% = pérdida 1,83M€/año. Con alertas día 5: morosidad 3,8% = pérdida 766K€/año. Recuperas 1,06M€ anuales que antes perdías. ROI sistema: 71x solo por esta funcionalidad.
              </p>
            </div>

            <div className="bg-white/10 p-6 md:p-10 rounded-sm backdrop-blur-sm">
              <div className="text-4xl md:text-6xl font-bold text-[#0ea5e9] mb-4">720h</div>
              <h3 className="text-2xl font-semibold mb-4">Ahorro tiempo gestión mensual</h3>
              <p className="text-white/80 leading-relaxed">
                Cruzar transferencias manualmente: 3-4h/edificio/mes × 20 edificios = 60-80h mensuales = 720-960h anuales = 4,5-6 meses trabajo 1 persona. Con automatización: 0 horas. Liberas 1 FTE completo que puede dedicarse a actividades de mayor valor (asset management estratégico, no admin).
              </p>
            </div>

            <div className="bg-white/10 p-6 md:p-10 rounded-sm backdrop-blur-sm">
              <div className="text-4xl md:text-6xl font-bold text-[#0ea5e9] mb-4">97%</div>
              <h3 className="text-2xl font-semibold mb-4">Tasa de cobro primer mes</h3>
              <p className="text-white/80 leading-relaxed">
                Con alertas automáticas + reclamación día 5-7, el 97% de las rentas se cobran dentro del primer mes (vs 82-85% sin sistema). Reduces drásticamente casos de morosos que acumulan 3-6 meses adeudados (casi imposible recuperar). Mejoras cash flow operativo del portfolio.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border-l-4 border-white/30 p-6 md:p-12 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">
              El caso de pérdida masiva: morosidad no detectada hasta auditoría
            </h3>
            <p className="text-white/90 leading-relaxed mb-4">
              Un fondo gestionaba portfolio de 14 edificios residenciales con 650 unidades totales. Control de rentas: Excel por edificio, revisión manual fin de mes por cada gestor. Auditoría anual descubrió: 58 unidades con morosidad entre 3-9 meses. Deuda acumulada no cobrada: 487.000€.
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              Análisis forense: ¿Por qué nadie lo detectó? Los gestores reportaban "ingresos mensuales" sumando transferencias recibidas, pero no validaban QUIÉN pagó. Inquilinos nuevos pagaban, algunos morosos históricos no pagaban, pero el total mensual parecía "razonable" porque había rotación. Nadie cruzó unidad por unidad quién debía.
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              Intentaron recuperar vía legal: proceso desahucio + embargo tomó 14 meses promedio. Recovery final: 186.000€ (38% de deuda). Pérdida neta: 301.000€ que nunca recuperaron. Costes legales adicionales: 94.000€. Pérdida total: 395.000€.
            </p>
            <p className="text-white leading-relaxed font-semibold text-lg">
              Con sistema de alertas automáticas, habrían detectado los primeros impagos en día 5-7. Habrían reclamado cuando cada moroso debía solo 1 mes (no 6-9 meses). Recovery rate habría sido 92% vs 38%. Habrían recuperado 448K€ vs 186K€. Diferencia: 262K€ adicionales cobrados + 94K€ ahorrados en legal = 356K€ impacto total. El sistema cuesta 15K€/año. Habría pagado su coste 24 veces solo con este caso.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}