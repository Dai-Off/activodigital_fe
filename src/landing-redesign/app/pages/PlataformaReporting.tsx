import { motion } from "motion/react";

export function PlataformaReporting() {
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
              Plataforma / Informes
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Informes <span className="font-semibold">Automáticos</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Deja de perder 2 semanas cada trimestre generando informes manualmente con datos obsoletos
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
              El infierno de reportar a LPs cada trimestre
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Property managers que gastan 60-80 horas por trimestre consolidando datos dispersos en Excels
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Datos dispersos en 15 sistemas diferentes
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Certificados energéticos en un Excel, finanzas en otro, mantenimiento en un tercero. Tardas 3 días solo consolidando datos antes de poder empezar a hacer el informe. Datos de hace 2 semanas que ya están obsoletos cuando lo envías.
                </p>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Errores manuales que destrozan credibilidad
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Copias mal una fórmula de Excel. El ROI de un edificio sale 23% cuando es 18%. El LP lo detecta. Credibilidad destruida. Tienes que regenerar todo el informe. Otras 40 horas perdidas porque fue manual.
                </p>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Formato diferente cada vez
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Cada analista hace el informe a su manera. Imposible comparar Q1 con Q2 porque cambiaste el formato. El LP pide datos que no incluiste. Tienes que volver a abrir 8 Excels para buscarlo. Tiempo desperdiciado.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Informes automáticos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Informes profesionales que se generan solos con datos actualizados
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              ARKIA consolida automáticamente todos los datos del portfolio y genera informes en 3 clicks
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 mb-12">
              <h3 className="text-2xl font-semibold mb-6">
                Cómo funciona la generación automática
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                El sistema tiene todos los datos del portfolio en tiempo real: certificados energéticos, finanzas, mantenimiento, cumplimiento, ocupación. Seleccionas qué edificios incluir, qué periodo analizar, qué métricas mostrar. En 30 segundos genera un PDF profesional con branding personalizado, gráficos automáticos, y todas las tablas formateadas.
              </p>
              <p className="text-white/90 leading-relaxed">
                Los datos están siempre actualizados porque se toman directamente de la plataforma. No hay consolidación manual, no hay riesgo de errores de transcripción, no hay datos obsoletos. Lo que envías al LP es la fotografía exacta del portfolio HOY, no hace 2 semanas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Reduces tiempo de 80 horas a 2 horas
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Lo que antes te costaba 2 semanas de trabajo (consolidar datos, hacer gráficos, formatear tablas, revisar errores), ahora lo haces en 2 horas. Seleccionas edificios, generas informe, revisas que todo cuadre, envías al LP. El 98% del trabajo lo hace el sistema.
                </p>
                <p className="text-gray-700 text-sm">
                  Esas 78 horas ahorradas cada trimestre las usas en análisis de verdadero valor, no en trabajo administrativo sin valor añadido.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Formato consistente que permite comparar
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Siempre la misma estructura, las mismas métricas, el mismo formato. Puedes comparar Q1 vs Q2 vs Q3 sin esfuerzo porque el layout es idéntico. El LP puede ver evolución trimestral sin tener que descifrar formatos cambiantes.
                </p>
                <p className="text-gray-700 text-sm">
                  Esto es especialmente crítico para fondos que reportan a múltiples LPs con diferentes requisitos. Guardas plantillas personalizadas para cada LP y generas su informe específico en minutos.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tipos de informes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Genera cualquier tipo de informe que te pidan
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Los LPs piden cosas diferentes. El sistema genera todos los formatos que necesites.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Informes de Eficiencia Energética
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Certificados energéticos de cada edificio, consumos kWh/m², emisiones CO2, cumplimiento EPBD, evolución trimestral, ROI de mejoras implementadas. Todo lo que un LP ESG necesita ver para validar que cumples objetivos sostenibles.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Informes de Cumplimiento Normativo
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Estado de todas las certificaciones (ITE, IEE, gas, electricidad), próximos vencimientos, inspecciones obligatorias pendientes, licencias vigentes. Demuestras al LP que tienes control total del compliance.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-gray-400 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Informes Personalizados
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  El LP pide un informe específico con métricas custom. Seleccionas exactamente qué datos incluir, qué edificios, qué periodo. El sistema genera el informe a medida sin tener que programar nada.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparativas automáticas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Comparativas automáticas que muestran evolución
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Los LPs no quieren solo datos actuales. Quieren ver si mejoras o empeoras respecto a trimestres anteriores.
            </p>

            <div className="bg-white border-l-4 border-[#0ea5e9] p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Evolución trimestral automática
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                El sistema compara automáticamente Q4 2025 vs Q3 2025 vs Q4 2024. Muestra qué mejoró, qué empeoró, y el % de variación. Gráficos de evolución temporal que se generan solos sin que tengas que tocar Excel.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Identificas tendencias inmediatamente: "El OPEX sube 3% trimestral desde hace 4 trimestres. Investigar qué está pasando." Sin comparativas manuales que tardan horas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Benchmarking entre edificios
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Compara automáticamente performance entre edificios del portfolio. Identificas cuáles tienen mejor ROI, cuáles tienen OPEX anormalmente alto, cuáles tienen ocupación problemática. Datos que te permiten tomar acciones correctivas.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Alertas de desviaciones significativas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Si alguna métrica se desvía más del 15% respecto al trimestre anterior, el informe lo destaca automáticamente. El LP ve inmediatamente qué necesita atención sin tener que revisar 50 páginas de tablas.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Branding profesional */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Branding profesional que impresiona a LPs
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Los informes parecen hechos por una consultora top. No son Excels feos exportados a PDF.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tu logo y colores corporativos
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  El informe lleva tu logo, tus colores, tu tipografía. Parece hecho 100% por ti, no por un software genérico. Refuerza tu marca ante LPs e inversores.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Gráficos profesionales automáticos
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Gráficos de barras, líneas, tortas que se generan automáticamente con diseño profesional. No son gráficos de Excel con colores horrorosos. Son visualizaciones que parecen hechas por un diseñador.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Layout limpio y legible
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Tablas bien formateadas, márgenes adecuados, jerarquía visual clara. El LP puede leer el informe sin esfuerzo. No es un PDF generado de Excel con celdas cortadas y texto ilegible.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                Múltiples formatos según el destinatario
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                El LP quiere PDF ejecutivo para presentar al board. Finance quiere Excel para hacer análisis adicionales. El comité de inversión quiere PowerPoint para la reunión mensual. Marketing quiere CSV para dashboard web.
              </p>
              <p className="text-white/90 leading-relaxed">
                El sistema genera los 4 formatos del mismo informe con un click cada uno. Los datos son exactamente los mismos, solo cambia el formato de salida. No tienes que regenerar nada manualmente.
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
              El impacto real en eficiencia operativa del fondo
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ahorras 300+ horas de trabajo al año
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  80 horas por trimestre × 4 trimestres = 320 horas anuales ahorradas. Un analista senior a 80€/hora son 25.600€ anuales de coste laboral ahorrado. Ese analista puede dedicarse a análisis de valor, no a consolidar Excels.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Eliminas errores que destruyen credibilidad
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Un error en un informe trimestral al LP puede costarte la renovación del mandato de gestión. Con datos consolidados automáticamente, el riesgo de error humano baja 95%. Los números siempre cuadran porque vienen de la misma fuente.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Reportas a LPs en tiempo récord
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Cierre de trimestre: día 31. Informe al LP: día 2. En lugar de tardar 2 semanas, entregas en 48 horas. Eso impresiona. Los LPs valoran GPs que reportan rápido y con datos actualizados, no con 3 semanas de retraso.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">
                El caso que te va a costar el mandato
              </h3>
              <p className="text-white/90 leading-relaxed mb-4">
                Un GP gestionaba un fondo con 12 edificios. Cada trimestre tardaban 3 semanas en consolidar datos y generar el informe trimestral al LP. En Q3 2024, hubo un error en la consolidación: el NOI de uno de los edificios se copió mal. El informe reportaba 8,2M€ NOI total cuando el real era 7,4M€.
              </p>
              <p className="text-white/90 leading-relaxed">
                El LP hizo su propia verificación cruzada y detectó el error. Credibilidad destruida. En la siguiente renovación de mandato, el LP contrató a otro GP. Perdieron 180K€ anuales de management fees porque un error manual en un Excel les costó la confianza. Con informes automáticos generados de datos centralizados, ese error nunca habría pasado.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}