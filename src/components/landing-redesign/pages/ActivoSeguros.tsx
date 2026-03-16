import { motion } from "motion/react";

export function ActivoSeguros() {
  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Activo / Seguros</div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Control de Seguros <span className="font-semibold">del Activo</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Pólizas vigentes, alertas de vencimiento, validación de coberturas y eliminación de seguros duplicados
            </p>
          </motion.div>
        </div>
      </section>

      {/* El desastre de operar sin seguro */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-6">
            El cataclismo de operar con seguros caducados o insuficientes
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Un día sin seguro vigente puede costarte millones. Una cobertura insuficiente puede arruinar un activo.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <div className="bg-gray-100 border-l-4 border-gray-800 p-10">
              <div className="text-gray-900 text-4xl font-bold mb-4">380K€</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Siniestro sin cobertura porque el seguro caducó hace 72 horas
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Edificio residencial 6 plantas. Póliza multirriesgo vence 15 de Marzo. Gestor no tiene recordatorio. Nadie revisa. 18 de Marzo (72 horas después) hay incendio parcial en planta 4: daño estructural 280K€ + daño contenidos inquilinos 100K€ = 380K€ totales.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Llamas a la aseguradora para reclamar. Te piden número de póliza. Revisas: caducó hace 3 días. La aseguradora confirma: "Sin póliza vigente en fecha siniestro, no hay cobertura. Siniestro rechazado." Los 380K€ los pagas TÚ íntegros de capital del fondo.
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                Con alerta automática 60 días antes de vencimiento, habrías renovado con margen de 45 días. El edificio NUNCA habría quedado desprotegido. Los 380K€ los habría pagado la aseguradora.
              </p>
            </div>

            <div className="bg-gray-100 border-l-4 border-gray-800 p-10">
              <div className="text-gray-900 text-4xl font-bold mb-4">2,6M€</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Cobertura obsoleta que descubres cuando ya hay siniestro total
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Edificio de oficinas adquirido hace 8 años. Seguro multirriesgo contratado entonces con suma asegurada 3,2M€ (valor del edificio en 2016). Nadie revisa si la cobertura sigue siendo adecuada. El edificio vale ahora 5,8M€ (revalorización + mejoras capitalizadas).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Siniestro total por incendio: edificio destruido completamente. Coste de reconstrucción según peritaje: 5,1M€. Vas a reclamar a la aseguradora: "Suma asegurada en póliza es 3,2M€. Pagamos máximo esa cantidad. Los 1,9M€ restantes no están cubiertos."
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                Con validación automática que compara suma asegurada versus valoración actual, habrías recibido alerta: "Cobertura insuficiente -45% respecto valor activo. Aumentar suma asegurada a 5,8M€". Actualizar la póliza habría costado 2.800€/año adicionales. Perdiste 1,9M€ por no pagar 22.400€ durante 8 años.
              </p>
            </div>

            <div className="bg-gray-100 border-l-4 border-gray-800 p-10">
              <div className="text-gray-900 text-4xl font-bold mb-4">25K€</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Seguros duplicados durante 3 años sin detectar
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Portfolio de 12 edificios. Cada gestor contrata seguros para sus activos de forma independiente. Edificio X tiene póliza de responsabilidad civil contratada por Gestor A en 2020 (prima 2.800€/año). En 2021 cambia de gestor. Gestor B revisa y piensa que no hay RC. Contrata póliza RC adicional (prima 3.100€/año).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Resultado: edificio tiene DOS pólizas RC activas cubriendo lo mismo. Pagas 5.900€/año cuando solo necesitas 3.100€/año. Sobrecostes: 2.800€/año × 3 años = 8.400€ tirados. Nadie lo detecta hasta auditoría de seguros en 2024. Durante 3 años pagaste seguro duplicado porque no había vista consolidada de todas las pólizas del edificio.
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                Con vista centralizada de TODOS los seguros del edificio, al intentar contratar segunda póliza RC el sistema habría alertado: "Este edificio ya tiene RC vigente (póliza XYZ vence 2025). ¿Seguro que necesitas contratar otra?" Duplicación evitada.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-12">
            <h3 className="text-3xl font-semibold mb-6">El patrón destructivo: seguros sin control centralizado</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-white/90 leading-relaxed">
                <p className="mb-4">
                  <span className="font-semibold text-[#0ea5e9]">Sin sistema:</span> Pólizas en carpeta compartida
                </p>
                <p>Resultado: Operas edificios valorados en millones con seguros caducados, insuficientes, o duplicados sin saberlo.</p>
              </div>
              <div className="text-white/90 leading-relaxed">
                <p className="mb-4">
                  <span className="font-semibold text-[#0ea5e9]">Con ARKIA:</span> Todas las pólizas del edificio en vista única, alertas 60 días antes de cada vencimiento, validación automática cobertura versus valor activo, detección de duplicaciones.
                </p>
                <p>Resultado: NUNCA operas desprotegido. Coberturas siempre adecuadas. Cero seguros duplicados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué gestiona el sistema */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-5xl font-light text-gray-900 mb-6">
            Todas las pólizas del edificio consolidadas en vista única
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            ARKIA centraliza todos los seguros vigentes de cada activo con trazabilidad completa
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Información completa de cada póliza
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Para cada seguro ves: Aseguradora + Número de póliza + Tipo de seguro + Suma asegurada + Prima anual + Fecha inicio + Fecha vencimiento + Coberturas incluidas (detalle) + Exclusiones + Documentación (póliza PDF, condiciones, modificaciones).
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Estado visual inmediato: VIGENTE (verde - más de 60 días para vencimiento) | VENCE PRONTO (amarillo - entre 30-60 días) | CRÍTICO (naranja - menos de 30 días) | CADUCADO (rojo - ya venció sin renovar).
              </p>
              <div className="bg-[#0ea5e9]/10 p-6 border-l-2 border-[#0ea5e9]">
                <div className="text-sm font-semibold text-[#0ea5e9] mb-2">Alerta automática vencimiento:</div>
                <p className="text-sm text-[#0ea5e9]">
                  "Seguro multirriesgo Edificio Plaza Mayor 28 vence en 45 días (15/06/2025). Iniciar renovación o buscar alternativas." Recibes la alerta 60 días antes. Tienes tiempo de: 1) Pedir ofertas a 3-4 aseguradoras, 2) Comparar coberturas y precios, 3) Negociar mejores condiciones, 4) Renovar con 15 días de margen. NUNCA llegas al último día por urgencia.
                </p>
              </div>
            </div>

            <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Validación automática de coberturas
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                El sistema compara suma asegurada de cada póliza versus valoración actualizada del activo. Si detecta desviación {">"} 20%, genera alerta. Ejemplo: Edificio vale 6,2M€ según valoración reciente. Seguro multirriesgo cubre 4,5M€. Desviación -27% = ALERTA: "Cobertura insuficiente. Aumentar suma asegurada a 6,2M€ para protección adecuada."
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                También valida: ¿Tiene RC vigente? (obligatorio) | ¿LaTarjetas suma asegurada RC es adecuada? (mínimo 3M€ recomendado) | ¿Hay seguros específicos necesarios? (ej: si hay obra en ejecución, debe tener seguro obras).
              </p>
              <div className="bg-gray-100 p-6 border-l-2 border-gray-800">
                <div className="text-sm font-semibold text-gray-900 mb-2">Caso real evitado:</div>
                <p className="text-sm text-gray-700">
                  Edificio valorado 5,8M€ con seguro multirriesgo suma asegurada 3,2M€ (contratado hace 7 años). Sistema alertó: "Infraasegurado -45%". Gestor pidió actualización a aseguradora. Coste adicional: 2.100€/año. 2 meses después hubo incendio parcial, daños 1,8M€. Sin actualizar cobertura, aseguradora habría pagado solo 3,2M€ × (1,8M / 5,8M) = 992K€ (regla proporcional por infraaseguro). Pérdida habría sido 808K€. Al tener suma asegurada correcta, pagaron los 1,8M€ completos. Los 2.100€/año salvaron 808K€.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valor portfolio */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-5xl font-light text-gray-900 mb-12 text-center">
            El impacto real de control centralizado de seguros
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-10">
              <div className="text-4xl font-bold text-[#0ea5e9] mb-3">0</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Días operando sin seguro vigente</h3>
              <p className="text-gray-600 leading-relaxed">
                Alertas 60 días antes garantizan renovación con margen. Portfolio 20 edificios sin sistema: típicamente 2-3 edificios/año quedan temporalmente sin seguro (5-15 días) por olvido de vencimiento. Con alertas automáticas: NUNCA pasa. Riesgo eliminado 100%.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-10">
              <div className="text-4xl font-bold text-[#0ea5e9] mb-3">100%</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Edificios con cobertura adecuada</h3>
              <p className="text-gray-600 leading-relaxed">
                Validación automática detecta coberturas obsoletas. Actualizas suma asegurada según valoración real. Si hay siniestro, estás protegido por valor correcto. En portfolio de 20 edificios, típicamente encuentras 4-5 con cobertura insuficiente al implementar sistema. Los corriges antes de que haya problema.
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-10">
              <div className="text-4xl font-bold text-[#0ea5e9] mb-3">35K€</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ahorro anual eliminando duplicados</h3>
              <p className="text-gray-600 leading-relaxed">
                Vista consolidada permite detectar seguros duplicados. Portfolio 20 edificios: típicamente 2-3 pólizas duplicadas (RC duplicado, multirriesgo solapado). Eliminarlas ahorra 15-20K€/año por edificio afectado = 35-45K€ anuales totales solo por esta optimización.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 md:p-14">
            <h3 className="text-3xl font-semibold mb-6">
              El caso que arruinó un activo: siniestro con seguro caducado
            </h3>
            <p className="text-white/90 leading-relaxed mb-4">
              Un fondo tenía edificio residencial valorado 12M€ en centro urbano. Póliza multirriesgo renovación anual vencimiento 20 de Septiembre. El gestor responsable del edificio renunció en Agosto. El nuevo gestor empezó en Octubre. Durante el mes de transición, nadie revisó vencimientos de seguros.
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              25 de Septiembre (5 días después de vencimiento), incendio severo en planta 3 se propaga a plantas 4 y 5. Daños: estructura 1,8M€ + instalaciones 420K€ + contenidos inquilinos 680K€ + lucro cesante inquilinos desalojados 380K€ = 3,28M€ totales. El fondo reclama a la aseguradora.
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              Respuesta aseguradora: "Póliza venció 20/09 y no fue renovada. Fecha siniestro 25/09 está fuera de cobertura. Reclamación rechazada." El fondo contacta abogados: no hay recurso legal. Sin póliza vigente en fecha siniestro, no hay cobertura. Los 3,28M€ los pagó el fondo íntegramente de capital.
            </p>
            <p className="text-white leading-relaxed font-semibold text-lg">
              Peor aún: los inversores demandaron al gestor (GP) por negligencia grave. El caso se resolvió con indemnización del gestor de 1,2M€ adicionales. Coste total: 4,48M€. El edificio se vendió 18 meses después con descuento del 15% (1,8M€) por reputación dañada del activo tras el siniestro. Pérdida agregada: 6,28M€. Todo evitable con sistema de alertas automáticas que habría avisado 60 días antes del vencimiento. Coste del sistema: 15K€/año. Perdieron 6,28M€ por no tener sistema de 15K€.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}