import { motion } from "motion/react";

export function ActivoInformacion() {
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
              Activo / Información
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              La Fuente de <span className="font-semibold">Verdad Única</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Ficha técnica maestra del activo: superficies certificadas, datos registrales y físicos centralizados para eliminar discrepancias.
            </p>
          </motion.div>
        </div>
      </section>

      {/* El problema REAL - ESTRUCTURA DE TARJETAS ROJAS */}
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
                El coste oculto de la "Arqueología de Datos"
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
                Los Asset Managers pierden hasta el 15% de su tiempo buscando datos básicos (referencias catastrales, superficies útiles, fechas de construcción) dispersos en Excels antiguos, PDFs y correos electrónicos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 mb-16">
              {/* Pain Card 1 */}
              <div className="bg-gray-100 border-l-4 border-gray-800 p-10">
                <div className="text-gray-900 text-4xl font-bold mb-4">ERROR DATOS</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Discrepancia de Superficies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  El Excel de Comercialización dice 12.500 m². El de Mantenimiento dice 11.900 m². Catastro dice 12.450 m². Cuando negocias la venta, el comprador hace su Due Diligence y descubre que la superficie útil real es 11.800 m².
                </p>
                <p className="text-sm text-gray-800 font-semibold">
                  Resultado: El precio de venta se ajusta a la baja en el último minuto o se pierde la confianza del comprador.
                </p>
              </div>

              {/* Pain Card 2 */}
              <div className="bg-gray-100 border-l-4 border-gray-800 p-10">
                <div className="text-gray-900 text-4xl font-bold mb-4">2 SEMANAS</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Retraso en Reporting
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Un inversor pide un informe consolidado de la cartera "antes del viernes". Necesitas datos de IBI, certificación energética y año de última reforma de 15 activos.
                </p>
                <p className="text-sm text-gray-800 font-semibold">
                  Realidad: Tardas 4 días solo en recopilar y validar esa información preguntando a 5 property managers diferentes.
                </p>
              </div>

              {/* Pain Card 3 */}
              <div className="bg-gray-100 border-l-4 border-gray-800 p-10">
                <div className="text-gray-900 text-4xl font-bold mb-4">SIN TRAZA</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Conocimiento Tribal
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  "Juan sabe dónde está la cédula de habitabilidad". Si Juan se va de la empresa, ese conocimiento desaparece. La información del activo vive en las cabezas de las personas, no en el activo.
                </p>
                <p className="text-sm text-gray-800 font-semibold">
                  Riesgo: Dependencia total del personal y pérdida de valor del activo cada vez que hay rotación.
                </p>
              </div>
            </div>

            {/* Contrast Block */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-12 rounded-sm">
              <h3 className="text-3xl font-semibold mb-6">
                El cambio de paradigma: Golden Record
              </h3>
              <div className="grid md:grid-cols-2 gap-8 text-white/90 leading-relaxed">
                <div>
                  <p className="mb-4">
                    <span className="font-semibold text-[#0ea5e9]">Antes:</span> Múltiples versiones de la verdad.
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    <span className="font-semibold text-[#0ea5e9]">Con ARKIA:</span> Un registro maestro inmutable. Si se actualiza aquí, se actualiza en todos los informes. Trazabilidad total de quién cambió qué y cuándo.
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
              Ficha Técnica Maestra
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Toda la identidad física, legal y administrativa del inmueble en una vista consolidada.
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/90 text-white p-6 md:p-14 rounded-sm mb-12">
              <h3 className="text-3xl font-semibold mb-8">
                Inventario Digital (Ejemplo Real)
              </h3>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-[#0ea5e9]">IDENTIFICACIÓN</h4>
                  <div className="space-y-4 text-white/90">
                    <div className="border-l-2 border-white/40 pl-4">
                      <div className="text-sm text-white/70 mb-1">ID Activo & Cartera</div>
                      <div className="text-2xl font-semibold">MAD-OFF-04</div>
                      <div className="text-xs text-white/60 mt-1">Portfolio Core Madrid 2025</div>
                    </div>
                    <div className="border-l-2 border-white/40 pl-4">
                      <div className="text-sm text-white/70 mb-1">Referencia Catastral</div>
                      <div className="text-2xl font-semibold">9872345 VF3498</div>
                      <div className="text-xs text-white/60 mt-1">Conectado con Sede Electrónica (Validado)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-4 text-[#0ea5e9]">METROS CUADRADOS (GLA)</h4>
                  <div className="space-y-4 text-white/90">
                    <div className="border-l-2 border-white/40 pl-4">
                      <div className="text-sm text-white/70 mb-1">Superficie Bruta (GBA)</div>
                      <div className="text-2xl font-semibold">14.250 m²</div>
                    </div>
                    <div className="border-l-2 border-[#0ea5e9] pl-4">
                      <div className="text-sm text-white/70 mb-1">Superficie Alquilable (GLA)</div>
                      <div className="text-2xl font-semibold text-[#0ea5e9]">12.100 m²</div>
                      <div className="text-xs text-[#0ea5e9] mt-1">Base para cálculo de rentas y ocupación</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Campos Personalizados Ilimitados
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Cada fondo tiene su propia tesis de inversión y métricas clave. ARKIA permite crear campos a medida que se convierten en estándar para todos sus activos.
                </p>
                <div className="bg-[#0ea5e9]/5 p-6 rounded-sm border-l-2 border-[#0ea5e9]">
                  <p className="text-sm text-[#0ea5e9]">
                    No adapte su gestión al software. Adapte el software a sus KPIs estratégicos.
                  </p>
                </div>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Histórico de Cambios (Audit Log)
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  El sistema guarda un registro inmutable de cada modificación.
                </p>
                <div className="bg-[#0ea5e9]/10 p-6 rounded-sm border-l-2 border-[#0ea5e9]">
                  <div className="text-sm font-semibold text-[#0ea5e9] mb-2">Trazabilidad Total</div>
                  <p className="text-sm text-[#0ea5e9]">
                    Registro completo de usuario, fecha, campo modificado, valores anteriores y nuevos con motivo del cambio.
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