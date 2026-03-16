import { motion } from "motion/react";

export function ActivoMantenimiento() {
  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Activo / Mantenimiento</div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Gestión Técnica <span className="font-semibold">Preventiva</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Transforma la gestión de "apagar fuegos" en un plan de mantenimiento estructurado que alarga la vida útil del activo
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problema */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
            La espiral de la muerte del "Mantenimiento Correctivo"
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Esperar a que algo se rompa para arreglarlo es la estrategia más cara que existe
          </p>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            <div className="bg-gray-100 border-l-4 border-gray-800 p-10">
              <div className="text-gray-900 text-4xl font-bold mb-4">x4</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Coste de reparación urgente</h3>
              <p className="text-gray-700 leading-relaxed">
                Caldera central se rompe en pleno Enero. No hiciste mantenimiento preventivo (250€/año). Reparación de urgencia: Pieza (800€) + Mano de obra festivo/urgencia (1.200€) = 2.000€. Además, inquilinos sin calefacción 3 días (quejas, riesgo devolución recibos). Coste preventivo hubiera sido 250€. Coste reactivo fue 2.000€. Pagaste 8 veces más.
              </p>
            </div>
            <div className="bg-gray-100 border-l-4 border-gray-800 p-10">
              <div className="text-gray-900 text-4xl font-bold mb-4">-12%</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Vida útil del activo</h3>
              <p className="text-gray-700 leading-relaxed">
                Impermeabilización de cubierta dura 20 años SI se mantiene limpia de hojas y se revisan juntas anualmente. Sin mantenimiento, dura 12 años. Reemplazar cubierta cuesta 45.000€. Perdiste 8 años de vida útil = perdiste 18.000€ de valor amortizado por no gastar 300€/año en limpieza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solución */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
            Control de Mantenimiento 360°
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div className="bg-white p-10 shadow-lg border-t-4 border-[#0ea5e9]">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Preventivo (GMAO)</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Planificación automática de tareas recurrentes. El sistema genera órdenes de trabajo solas.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">✓ Revisión ascensor (Mensual)</li>
                <li className="flex items-center">✓ Limpieza canalones (Semestral)</li>
                <li className="flex items-center">✓ Revisión grupo presión (Trimestral)</li>
                <li className="flex items-center">✓ Purga radiadores (Anual)</li>
              </ul>
            </div>

            <div className="bg-white p-10 shadow-lg border-t-4 border-[#0ea5e9]">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Legal / Normativo</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Inspecciones obligatorias por ley que requieren técnico homologado.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">⚖ OCA Electricidad (Cada 5 años)</li>
                <li className="flex items-center">⚖ Inspección Gas (Cada 5 años)</li>
                <li className="flex items-center">⚖ Mantenimiento Protección Incendios</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 md:p-12 rounded-sm">
            <h3 className="text-3xl font-semibold mb-6">Portal del Proveedor</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-lg text-white/90 leading-relaxed mb-4">
                  Olvídate de perseguir a proveedores por teléfono. ARKIA envía la Orden de Trabajo al móvil del técnico.
                </p>
                <ol className="space-y-3 list-decimal list-inside text-white/80">
                  <li>Sistema detecta incidencia o preventivo programado</li>
                  <li>Envía email/SMS automático al proveedor asignado (ej: "Fontanería García")</li>
                  <li>Proveedor acepta el trabajo desde su móvil</li>
                  <li>Proveedor sube foto del "Antes" y "Después" + Factura al terminar</li>
                  <li>Tú validas y pagas. Histórico guardado para siempre.</li>
                </ol>
              </div>
              <div className="w-full md:w-1/3 bg-white/10 p-6 rounded border border-white/20">
                <div className="text-xs uppercase text-white/60 mb-2">Ejemplo Orden Trabajo</div>
                <div className="font-bold text-lg mb-1">OT-2025-892</div>
                <div className="text-sm mb-4">Reparación fuga agua radiador 2ºA</div>
                <div className="flex justify-between text-sm border-t border-white/20 pt-2">
                  <span>Estado:</span>
                  <span className="text-[#0ea5e9] font-bold">COMPLETADO</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span>Coste final:</span>
                  <span className="font-bold">145,00€</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span>Tiempo resolución:</span>
                  <span>4h 20min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}