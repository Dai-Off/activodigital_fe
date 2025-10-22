import { Header } from "./Header";
import Footer from "./Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Términos y Condiciones</h1>
          <p className="text-gray-600">
            Última actualización: Octubre 2024
          </p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Identificación del titular</h2>
            <div className="space-y-2">
              <p><span className="font-medium text-gray-900">Titular del sitio web:</span> Tech AI Solutions S.L.</p>
              <p><span className="font-medium text-gray-900">CIF:</span> B56350796</p>
              <p><span className="font-medium text-gray-900">Domicilio social:</span> Calle Frida Kahlo 26, 4B, 28051, Madrid, España</p>
              <p>
                <span className="font-medium text-gray-900">Correo electrónico:</span>{" "}
                <a href="mailto:adiez@daioff.com" className="text-blue-600 hover:text-blue-700 underline">
                  adiez@daioff.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Objeto de los términos</h2>
            <p>
              El presente documento regula el acceso y uso de la plataforma tecnológica de gestión inmobiliaria automatizada ofrecida por Activo Digital (en adelante, la Plataforma), a través de acceso privado concedido tras la contratación del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Funcionalidad del servicio</h2>
            <p>
              Activo Digital ofrece servicios de gestión inmobiliaria integral mediante inteligencia artificial. Los usuarios acceden a la Plataforma mediante un login individual facilitado tras la contratación. La plataforma incluye gestión de documentos, seguimiento de mantenimiento, cumplimiento normativo y análisis inteligente de carteras inmobiliarias.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Condiciones de uso de la Plataforma</h2>
            <ul className="space-y-3 list-disc ml-6">
              <li>
                El uso de la Plataforma está restringido a usuarios autorizados que hayan contratado el servicio.
              </li>
              <li>
                No está permitida la cesión, sublicencia, distribución o alteración de la tecnología ni de las licencias de acceso.
              </li>
              <li>
                Se prohíbe expresamente cualquier intento de ingeniería inversa, scraping automatizado o uso con fines ilegales.
              </li>
              <li>
                Los usuarios son responsables de mantener la confidencialidad de sus credenciales de acceso.
              </li>
              <li>
                El uso de la Plataforma debe realizarse conforme a las buenas prácticas y dentro de los límites técnicos establecidos.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Exclusión de asesoramiento profesional personalizado</h2>
            <p>
              El contenido generado por la Plataforma no constituye asesoramiento profesional individualizado en materia legal, técnica o financiera. Para decisiones importantes relacionadas con la gestión inmobiliaria, se recomienda consultar con profesionales debidamente cualificados en cada área específica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Protección de datos y privacidad</h2>
            <p>
              El tratamiento de datos personales se realiza conforme al Reglamento General de Protección de Datos (RGPD) y la normativa española aplicable. Los datos se utilizarán exclusivamente para la prestación del servicio contratado y no se cederán a terceros sin consentimiento expreso, salvo obligación legal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Propiedad intelectual</h2>
            <p>
              Todos los contenidos de la Plataforma (software, textos, estructura, diseño, código fuente, algoritmos de IA) son propiedad de Tech AI Solutions S.L. o se utilizan bajo licencia. Se prohíbe cualquier reproducción, distribución o uso no autorizado de estos elementos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Disponibilidad del servicio</h2>
            <div className="space-y-3">
              <p>
                Tech AI Solutions S.L. se esfuerza por mantener la Plataforma disponible las 24 horas del día, pero no garantiza un tiempo de funcionamiento del 100%.
              </p>
              <p>
                Se podrán realizar mantenimientos programados que serán comunicados con la debida antelación cuando sea posible.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Limitación de responsabilidad</h2>
            <div className="space-y-3">
              <p>
                Tech AI Solutions S.L. no será responsable de los daños derivados del uso indebido de la Plataforma ni de las decisiones tomadas únicamente con base en los resultados automatizados generados por el sistema.
              </p>
              <p>
                La responsabilidad se limitará al importe abonado por el servicio en los 12 meses anteriores al evento que genere la reclamación.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Modificación de los términos</h2>
            <p>
              Tech AI Solutions S.L. se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones significativas serán comunicadas a los usuarios con al menos 30 días de antelación y entrarán en vigor tras dicho periodo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Terminación del servicio</h2>
            <div className="space-y-3">
              <p>
                Cualquier parte podrá terminar el contrato de prestación de servicios conforme a lo establecido en las condiciones comerciales particulares.
              </p>
              <p>
                En caso de terminación, el usuario perderá el acceso a la Plataforma y deberá cesar cualquier uso de la misma.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Legislación aplicable y jurisdicción</h2>
            <p>
              Estos Términos se rigen por la legislación española. En caso de conflicto, las partes se someten expresamente a los juzgados y tribunales de la ciudad de Madrid, renunciando a cualquier otro fuero que pudiera corresponder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contacto</h2>
            <div className="space-y-2">
              <p>
                Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactar con nosotros en:
              </p>
              <p>
                <span className="font-medium text-gray-900">Email:</span>{" "}
                <a href="mailto:adiez@daioff.com" className="text-blue-600 hover:text-blue-700 underline">
                  adiez@daioff.com
                </a>
              </p>
              <p>
                <span className="font-medium text-gray-900">Dirección:</span> Calle Frida Kahlo 26, 4B, 28051, Madrid, España
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Última actualización: Octubre 2024
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}