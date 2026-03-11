import { motion } from "motion/react";

export function ActivoCalendario() {
  return (
    <div className="min-h-screen overflow-y-auto bg-white pb-24 relative">
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">Activo / Calendario</div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Línea de Tiempo <span className="font-semibold">Operativa</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Todos los hitos críticos del edificio en una vista unificada: vencimientos, mantenimiento, impuestos y renovaciones
            </p>
          </motion.div>
        </div>
      </section>

      {/* El problema */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-5xl font-light text-gray-900 mb-6">
            El coste de la "gestión por memoria"
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Lo que ocurre cuando gestionas edificios complejos confiando en calendarios personales
          </p>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
              <div className="text-[#0ea5e9] text-4xl font-bold mb-4">45K€</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Renovación automática no deseada
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Contrato de mantenimiento ascensores (18K€/año). Cláusula: "Preaviso 3 meses para cancelación, sino renueva por 3 años obligatorios". Vencimiento 31 Diciembre. Fecha límite preaviso: 30 Septiembre. Gestor tenía recordatorio en Outlook personal. Se fue de vacaciones la última semana de Septiembre.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                El 2 de Octubre intenta cancelar (querían cambiar a proveedor más barato por 12K€/año). Respuesta: "Fuera de plazo. Contrato renovado hasta 2028". Sobrecoste anual 6K€ × 3 años = 18K€ + penalización salida anticipada 27K€. Pérdida total 45K€ por un olvido de 48 horas.
              </p>
            </div>
            <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
              <div className="text-[#0ea5e9] text-4xl font-bold mb-4">Inspección</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Multa por ITE caducada
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Inspección Técnica Edificio (ITE) vencía en Mayo. El arquitecto del fondo lo sabía, pero salió de la empresa en Febrero. Nadie transfirió esa fecha crítica. En Julio, inspección municipal aleatoria. Resultado: ITE caducada. Multa administrativa 6.000€ + Orden de ejecución urgente (tienes que contratar al primer técnico disponible, 30% más caro por urgencia).
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Coste real: Daño reputacional ante inquilinos (cartel municipal en puerta "EDIFICIO CON ITE CADUCADA"). Dos inquilinos premium usaron esa cláusula para rescindir contrato anticipadamente alegando "falta de mantenimiento".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solución */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-5xl font-light text-gray-900 mb-6">
            Calendario Maestro del Activo
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Centraliza automáticamente fechas de 5 fuentes distintas en una sola vista
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sincronización automática</h3>
              <p className="text-gray-700 leading-relaxed">
                No tienes que "rellenar el calendario". El calendario se alimenta solo:
                <br/><br/>
                • Cuando subes un contrato de alquiler, el sistema extrae "Fecha Fin" y crea evento.<br/>
                • Cuando registras una hipoteca, extrae "Vencimientos cuotas" y crea eventos.<br/>
                • Cuando subes póliza de seguro, extrae "Renovación" y crea evento.<br/>
                • Cuando registras activo técnico (ascensor), programa mantenimientos preventivos.
              </p>
            </div>
            <div className="bg-white border-l-4 border-[#0ea5e9] p-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Alertas escalonadas inteligentes</h3>
              <p className="text-gray-700 leading-relaxed">
                Sistema de "Semáforo de Urgencia":<br/><br/>
                • <strong>90 días antes:</strong> "Aviso informativo: Contrato vence en 3 meses. Empezar a buscar proveedores."<br/>
                • <strong>30 días antes:</strong> "Alerta amarilla: Acción requerida este mes."<br/>
                • <strong>7 días antes:</strong> "ALERTA ROJA: Vencimiento inminente. Prioridad máxima."<br/>
                <br/>
                Si el gestor asignado no marca "Visto", la alerta escala a su supervisor automáticamente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}