import { motion } from "motion/react";

export function PlataformaUsuarios() {
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
              Plataforma / Gestión de Usuarios
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Usuarios y <span className="font-semibold">Permisos</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Sistema completo de gestión de usuarios con roles predefinidos, permisos granulares y control total sobre el acceso a cada módulo de la plataforma ARKIA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Control de Acceso */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Control de Acceso Empresarial
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              ARKIA implementa un sistema robusto de gestión de usuarios y permisos diseñado para organizaciones inmobiliarias que gestionan múltiples activos y requieren control granular sobre quién accede a qué información.
            </p>
            <p className="text-lg text-gray-600">
              El sistema permite definir roles específicos dentro de la organización, desde administradores con acceso total hasta usuarios de consulta con permisos de solo lectura. Cada rol puede ser personalizado con permisos específicos para cada módulo de la plataforma, garantizando que cada miembro del equipo tenga acceso únicamente a la información relevante para su función.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Roles Predefinidos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Roles Predefinidos
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Tres perfiles diseñados para cubrir las necesidades de cualquier organización inmobiliaria
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
                <h3 className="text-xl font-semibold mb-4">Administrador</h3>
                <p className="text-white/90 leading-relaxed">
                  Acceso completo a todas las funcionalidades de ARKIA. Puede crear y gestionar usuarios, configurar el sistema, acceder a todos los edificios del portfolio, exportar datos y modificar configuraciones globales. Rol ideal para directores de operaciones o responsables de gestión inmobiliaria.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
                <h3 className="text-xl font-semibold mb-4">Gestor de Activos</h3>
                <p className="text-white/90 leading-relaxed">
                  Gestión completa de los edificios asignados. Acceso a información financiera, contratos, mantenimiento, calendario y generación de informes de los activos bajo su responsabilidad. Puede editar datos operativos pero no tiene acceso a configuración del sistema ni gestión de otros usuarios.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12">
                <h3 className="text-xl font-semibold mb-4">Técnico de Mantenimiento</h3>
                <p className="text-white/90 leading-relaxed">
                  Enfocado en operaciones técnicas: gestión de mantenimientos preventivos y correctivos, inspecciones, actualización del Libro del Edificio, y acceso al calendario de intervenciones. Tiene acceso de solo lectura a información financiera para contexto de las operaciones.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Asignación de Edificios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Asignación de Edificios
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Control granular sobre qué usuario accede a qué activos del portfolio
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="border-l-4 border-[#0ea5e9] pl-6 mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Segmentación por edificios
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cada usuario puede tener asignados edificios específicos del portfolio, garantizando que solo acceda a los activos bajo su responsabilidad directa.
                  </p>
                </div>

                <div className="border-l-4 border-[#0ea5e9] pl-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    Equipos independientes
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Un gestor de activos puede estar asignado al portfolio de Madrid mientras otro gestiona Barcelona, sin visibilidad cruzada entre regiones.
                  </p>
                </div>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Flexibilidad organizativa
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Esta segmentación permite organizaciones complejas con múltiples equipos trabajando en paralelo sin interferencias. Los administradores y usuarios de consulta pueden tener acceso a todos los edificios o subconjuntos personalizados según las necesidades organizativas.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seguridad y Trazabilidad */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Seguridad y Trazabilidad
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Registro completo de actividad y autenticación segura
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Historial completo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  ARKIA registra automáticamente toda la actividad: quién modificó un contrato, quién actualizó datos financieros, quién generó un informe. Trazabilidad completa para auditorías.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Autenticación segura
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Doble factor (2FA), cierre de sesión automático por inactividad y control de sesiones activas. El acceso a información sensible está siempre protegido.
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cumplimiento normativo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  El registro de actividad es fundamental para auditorías internas y externas, así como para resolver discrepancias sobre cambios en la información.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Permisos Granulares */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Permisos Granulares por Módulo
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Personalización total de permisos según las necesidades de la organización
            </p>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80 text-white p-6 md:p-12 mb-8">
              <h3 className="text-2xl font-semibold mb-6">
                Roles personalizados a medida
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Más allá de los roles predefinidos, ARKIA permite crear perfiles personalizados con permisos específicos para cada módulo de la plataforma. Puede configurar, por ejemplo, un usuario que tenga acceso de edición solo a mantenimiento y calendario, pero acceso de lectura a finanzas.
              </p>
              <p className="text-white/90 leading-relaxed">
                O un perfil que gestione contratos y unidades pero sin acceso a información financiera sensible. Esta flexibilidad permite adaptar el sistema a estructuras organizativas complejas y cambiantes, sin necesidad de crear múltiples roles rígidos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Control por módulo
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Define permisos específicos para cada módulo: Edificios, Unidades, Finanzas, Contratos, Mantenimiento, Auditorías, Calendario. Lectura, edición o sin acceso.
                </p>
              </div>

              <div className="bg-[#0ea5e9]/10 border-l-4 border-[#0ea5e9] p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Adaptación continua
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Los permisos pueden modificarse en cualquier momento según evolucionen las responsabilidades del equipo, sin necesidad de crear nuevos roles desde cero.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}