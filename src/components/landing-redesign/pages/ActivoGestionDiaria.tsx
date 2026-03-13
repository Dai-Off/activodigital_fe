import { motion } from "motion/react";

export function ActivoGestionDiaria() {
  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">
      {/* Hero Header - IDÉNTICO A FINANCIERO */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
              Activo / Gestión Diaria
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Data Room <span className="font-semibold">Permanente</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Sistema de gestión documental estructurado que mantiene su activo siempre listo para auditoría, financiación o venta (Audit Ready).
            </p>
          </motion.div>
        </div>
      </section>

      {/* El problema REAL - TARJETAS ROJAS */}
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
                El caos del "File Server" tradicional
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
                Tener la documentación en carpetas de red compartidas o en SharePoint desestructurados convierte cada transacción en una pesadilla de recopilación manual.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 mb-16">
              {/* Pain Card 1 */}
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <div className="text-[#0ea5e9] text-4xl font-bold mb-4">RIESGO</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Caducidades Invisibles
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El seguro del edificio venció hace 3 meses. Nadie se dio cuenta porque el PDF estaba enterrado en una subcarpeta llamada "Varios".
                </p>
                <p className="text-sm text-[#0ea5e9] font-semibold">
                  Consecuencia: Ocurre un siniestro y la aseguradora rechaza la cobertura. Pérdida millonaria por falta de alerta documental.
                </p>
              </div>

              {/* Pain Card 2 */}
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <div className="text-[#0ea5e9] text-4xl font-bold mb-4">LENTITUD</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Due Diligence Eterna
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Un comprador potencial pide acceso al Data Room. Tardas 3 semanas en organizar, renombrar y subir archivos a un proveedor externo.
                </p>
                <p className="text-sm text-[#0ea5e9] font-semibold">
                  Consecuencia: El interés del comprador se enfría ("Deal fatigue"). Das imagen de descontrol sobre tu propio activo.
                </p>
              </div>

              {/* Pain Card 3 */}
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <div className="text-[#0ea5e9] text-4xl font-bold mb-4">CAOS</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Versiones Incorrectas
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Envías al banco el contrato de alquiler "final". Resulta ser el borrador v3, no el firmado v5 que tiene una cláusula de break option diferente.
                </p>
                <p className="text-sm text-[#0ea5e9] font-semibold">
                  Consecuencia: Problemas legales graves y pérdida de credibilidad institucional.
                </p>
              </div>
            </div>

            {/* Contrast Block */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-12 rounded-sm">
              <h3 className="text-3xl font-semibold mb-6">
                Liquidez Documental
              </h3>
              <div className="grid md:grid-cols-2 gap-8 text-white/90 leading-relaxed">
                <div>
                  <p className="mb-4">
                    <span className="font-semibold text-[#0ea5e9]">Pasivo:</span> Documentación desordenada que bloquea operaciones y esconde riesgos legales.
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    <span className="font-semibold text-[#0ea5e9]">Activo (ARKIA):</span> Documentación estructurada que acelera ventas y garantiza cumplimiento normativo continuo.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Qué información ves - ESTRUCTURA VISUAL AZUL */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Estructura Inteligente
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              No más carpetas vacías o duplicadas. Una taxonomía estándar aplicada a toda su cartera.
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/90 text-white p-6 md:p-14 rounded-sm mb-12">
              <h3 className="text-3xl font-semibold mb-8">
                Salud Documental (Dashboard Real)
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 p-6 rounded-sm backdrop-blur-sm border border-white/10">
                  <div className="text-4xl font-bold mb-2 text-[#0ea5e9]">98%</div>
                  <div className="text-sm uppercase tracking-wider text-white/70">Completitud</div>
                  <p className="text-xs text-white/50 mt-2">Documentos obligatorios presentes</p>
                </div>
                <div className="bg-white/10 p-6 rounded-sm backdrop-blur-sm border border-white/10">
                  <div className="text-4xl font-bold mb-2 text-[#0ea5e9]">3</div>
                  <div className="text-sm uppercase tracking-wider text-white/70">Por Vencer</div>
                  <p className="text-xs text-white/50 mt-2">Próximos 90 días</p>
                </div>
                <div className="bg-white/10 p-6 rounded-sm backdrop-blur-sm border border-white/10">
                  <div className="text-4xl font-bold mb-2 text-white">0</div>
                  <div className="text-sm uppercase tracking-wider text-white/70">Vencidos</div>
                  <p className="text-xs text-white/50 mt-2">Documentación crítica al día</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Lectura Automática de Metadatos
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Al subir un contrato o licencia, la IA de ARKIA propone automáticamente: fecha de inicio, fecha de fin, partes involucradas y alertas de renovación.
                </p>
                <div className="bg-[#0ea5e9]/10 p-6 rounded-sm border-l-2 border-[#0ea5e9]">
                  <p className="text-sm text-[#0ea5e9]">
                    Transforme PDFs muertos en datos vivos que le avisan antes de caducar.
                  </p>
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Compartir Externo Seguro
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Cuando necesites compartir documentación con auditores externos, bancos o asesores legales, el sistema genera enlaces temporales con expiración. Tú controlas: qué carpetas se comparten, por cuánto tiempo (7/15/30 días), y si permites descarga o solo visualización.
                </p>
                <div className="bg-[#0ea5e9]/10 p-6 rounded-sm border-l-2 border-[#0ea5e9]">
                  <p className="text-sm text-[#0ea5e9]">
                    Elimine el envío de adjuntos por email. Controle quién ve qué y revoque el acceso cuando termine la auditoría.
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