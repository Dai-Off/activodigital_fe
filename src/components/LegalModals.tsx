import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface LegalModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function LegalModal({ trigger, title, children }: LegalModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className="max-w-3xl max-h-[85vh] p-0 gap-0 rounded-2xl border-0"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 60px rgba(91, 141, 239, 0.25)'
        }}
        aria-describedby={undefined}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(91, 141, 239, 0.1)' }}>
          <DialogTitle style={{ color: '#1E293B', fontSize: '1.5rem' }}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(85vh-100px)] px-6 py-4">
          <div className="pr-4">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function TermsModal({ trigger }: { trigger: React.ReactNode }) {
  return (
    <LegalModal trigger={trigger} title="Términos y Condiciones de Uso">
      <div className="space-y-6" style={{ color: '#334155' }}>
        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>1. Identificación del titular</h3>
          <p className="mb-2 text-sm leading-relaxed">Titular del sitio web: <strong>Tech AI Solutions S.L.</strong></p>
          <p className="mb-2 text-sm leading-relaxed">CIF: B56350796</p>
          <p className="mb-2 text-sm leading-relaxed">Domicilio social: Calle Frida Kahlo 26, 4B, 28051, Madrid, España</p>
          <p className="mb-2 text-sm leading-relaxed">Correo electrónico: gestion@arkialabs.es</p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>2. Objeto de los términos</h3>
          <p className="text-sm leading-relaxed">
            El presente documento regula el acceso y uso de la plataforma tecnológica ARKIA de gestión y optimización de activos inmobiliarios mediante inteligencia artificial (en adelante, la Plataforma), a través de acceso privado concedido tras la contratación del servicio.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>3. Funcionalidad del servicio</h3>
          <p className="text-sm leading-relaxed">
            ARKIA ofrece servicios de análisis y optimización de carteras inmobiliarias mediante inteligencia artificial, integrando análisis financiero, técnico y regulatorio con foco en cumplimiento EPBD 2024 y criterios ESG. Los usuarios acceden a la Plataforma mediante un login individual facilitado tras la contratación. No se permite el uso gratuito, salvo demostraciones expresamente habilitadas por la empresa.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>4. Condiciones de uso de la Plataforma</h3>
          <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
            <li>El uso de la Plataforma está restringido a usuarios autorizados que hayan contratado el servicio.</li>
            <li>No está permitida la cesión, sublicencia, distribución o alteración de la tecnología ni de las licencias de acceso.</li>
            <li>Se prohíbe expresamente cualquier intento de ingeniería inversa, scraping automatizado o uso con fines ilegales.</li>
            <li>El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>5. Exclusión de asesoramiento profesional personalizado</h3>
          <p className="text-sm leading-relaxed">
            El contenido generado por la Plataforma no constituye asesoramiento profesional individualizado en materia técnica, legal o financiera. Los análisis y recomendaciones generados por el Motor Prescriptivo IA son orientativos y deben ser validados por profesionales cualificados antes de tomar decisiones de inversión o ejecución de obras.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>6. Propiedad intelectual</h3>
          <p className="text-sm leading-relaxed">
            Todos los contenidos de la Plataforma (software, algoritmos, textos, estructura, diseño, código fuente, modelos de IA) son propiedad de Tech AI Solutions S.L. o se utilizan bajo licencia. Se prohíbe cualquier reproducción o uso no autorizado.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>7. Limitación de responsabilidad</h3>
          <p className="text-sm leading-relaxed">
            Tech AI Solutions S.L. no será responsable de los daños derivados del uso indebido de la Plataforma ni de las decisiones tomadas únicamente con base en los resultados automatizados generados por el sistema. El usuario asume la responsabilidad final sobre las decisiones de gestión de su cartera inmobiliaria.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>8. Protección de datos</h3>
          <p className="text-sm leading-relaxed">
            El tratamiento de datos personales se regula conforme a nuestra Política de Privacidad y el Reglamento General de Protección de Datos (RGPD). Los datos técnicos de los activos inmobiliarios son tratados con máxima confidencialidad y seguridad.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>9. Modificación de los términos</h3>
          <p className="text-sm leading-relaxed">
            Tech AI Solutions S.L. se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán publicadas en el sitio web y comunicadas a los usuarios activos, siendo aplicables desde el momento de su publicación.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>10. Legislación aplicable y jurisdicción</h3>
          <p className="text-sm leading-relaxed">
            Estos Términos se rigen por la legislación española. En caso de conflicto, las partes se someten expresamente a los juzgados y tribunales de la ciudad de Madrid, renunciando a cualquier otro fuero que pudiera corresponder.
          </p>
        </section>

        <section className="pt-4 border-t" style={{ borderColor: 'rgba(91, 141, 239, 0.1)' }}>
          <p className="text-xs" style={{ color: '#94A3B8' }}>
            Última actualización: Octubre 2024
          </p>
        </section>
      </div>
    </LegalModal>
  );
}

export function PrivacyModal({ trigger }: { trigger: React.ReactNode }) {
  return (
    <LegalModal trigger={trigger} title="Política de Privacidad">
      <div className="space-y-6" style={{ color: '#334155' }}>
        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>1. Responsable del tratamiento</h3>
          <p className="mb-2 text-sm leading-relaxed">Responsable: <strong>Tech AI Solutions S.L.</strong></p>
          <p className="mb-2 text-sm leading-relaxed">CIF: B56350796</p>
          <p className="mb-2 text-sm leading-relaxed">Domicilio: Calle Frida Kahlo 26, 4B, 28051, Madrid, España</p>
          <p className="mb-2 text-sm leading-relaxed">Contacto: gestion@arkialabs.es</p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>2. Datos que recopilamos</h3>
          <p className="mb-3 text-sm leading-relaxed">En ARKIA recopilamos los siguientes tipos de datos:</p>
          <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
            <li><strong>Datos de registro:</strong> nombre, email, empresa, teléfono</li>
            <li><strong>Datos de uso:</strong> interacciones con la plataforma, consultas al Motor Prescriptivo IA</li>
            <li><strong>Datos técnicos de activos:</strong> características de propiedades, certificaciones energéticas, datos de cumplimiento regulatorio</li>
            <li><strong>Datos de navegación:</strong> cookies técnicas, analíticas y de preferencias</li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>3. Finalidad del tratamiento</h3>
          <p className="mb-3 text-sm leading-relaxed">Utilizamos sus datos para:</p>
          <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
            <li>Gestionar su cuenta y acceso a la Plataforma</li>
            <li>Proporcionar análisis y recomendaciones mediante IA</li>
            <li>Mejorar nuestros servicios y modelos predictivos</li>
            <li>Comunicaciones relacionadas con el servicio contratado</li>
            <li>Cumplimiento de obligaciones legales y contractuales</li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>4. Base legal</h3>
          <p className="text-sm leading-relaxed">
            El tratamiento de sus datos se basa en la ejecución del contrato de servicios, el cumplimiento de obligaciones legales, y su consentimiento expreso para comunicaciones comerciales (opcional y revocable).
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>5. Conservación de datos</h3>
          <p className="text-sm leading-relaxed">
            Conservamos sus datos mientras dure la relación contractual y posteriormente durante los plazos legalmente exigibles para el cumplimiento de obligaciones fiscales y mercantiles (mínimo 6 años).
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>6. Cesión de datos</h3>
          <p className="text-sm leading-relaxed">
            No cedemos sus datos a terceros salvo obligación legal o proveedores tecnológicos necesarios para la prestación del servicio (cloud hosting, analítica), siempre bajo estrictos acuerdos de confidencialidad y cumplimiento RGPD.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>7. Derechos del usuario</h3>
          <p className="mb-3 text-sm leading-relaxed">Usted tiene derecho a:</p>
          <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
            <li>Acceder a sus datos personales</li>
            <li>Rectificar datos inexactos o incompletos</li>
            <li>Solicitar la supresión de sus datos</li>
            <li>Oponerse al tratamiento</li>
            <li>Solicitar la limitación del tratamiento</li>
            <li>Portabilidad de los datos</li>
            <li>Revocar el consentimiento en cualquier momento</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed">
            Para ejercer sus derechos, contacte con: gestion@arkialabs.es
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>8. Seguridad</h3>
          <p className="text-sm leading-relaxed">
            Implementamos medidas técnicas y organizativas de alto nivel para proteger sus datos contra acceso no autorizado, pérdida o alteración, incluyendo cifrado de comunicaciones, autenticación robusta y auditorías periódicas de seguridad.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>9. Reclamaciones</h3>
          <p className="text-sm leading-relaxed">
            Si considera que el tratamiento de sus datos vulnera la normativa, puede presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
          </p>
        </section>

        <section className="pt-4 border-t" style={{ borderColor: 'rgba(91, 141, 239, 0.1)' }}>
          <p className="text-xs" style={{ color: '#94A3B8' }}>
            Última actualización: Octubre 2024
          </p>
        </section>
      </div>
    </LegalModal>
  );
}

export function CookiesModal({ trigger }: { trigger: React.ReactNode }) {
  return (
    <LegalModal trigger={trigger} title="Política de Cookies">
      <div className="space-y-6" style={{ color: '#334155' }}>
        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>1. ¿Qué son las cookies?</h3>
          <p className="text-sm leading-relaxed">
            Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador del usuario. Se utilizan para garantizar el funcionamiento técnico del sitio, personalizar la experiencia del usuario y recopilar estadísticas sobre el uso del sitio.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>2. Uso de cookies en este sitio web</h3>
          <p className="text-sm leading-relaxed">
            Este sitio web utiliza cookies propias y de terceros. Al acceder por primera vez, el usuario puede aceptar, rechazar o configurar el uso de cookies mediante el banner de consentimiento. Puede cambiar sus preferencias en cualquier momento.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>3. Gestión del consentimiento</h3>
          <p className="text-sm leading-relaxed">
            El consentimiento del usuario se solicita al acceder al sitio web mediante un banner. Este banner permite aceptar todas las cookies, rechazarlas o configurarlas por categorías. El sistema registra y documenta las decisiones del usuario para garantizar el cumplimiento normativo.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>4. Categorías de cookies utilizadas</h3>
          <p className="mb-3 text-sm leading-relaxed">Las cookies utilizadas en este sitio web se clasifican en las siguientes categorías:</p>
          
          <div className="mb-4">
            <h4 className="mb-2" style={{ color: '#5B8DEF', fontSize: '0.95rem' }}>Necesarias</h4>
            <p className="text-sm leading-relaxed">
              Imprescindibles para el funcionamiento del sitio. Incluyen cookies de sesión, autenticación y seguridad.
            </p>
            <ul className="mt-2 space-y-1 text-sm list-disc pl-5" style={{ color: '#64748B' }}>
              <li>Gestión de sesión de usuario</li>
              <li>Preferencias de idioma</li>
              <li>Seguridad y prevención de fraude</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="mb-2" style={{ color: '#5B8DEF', fontSize: '0.95rem' }}>Preferencias</h4>
            <p className="text-sm leading-relaxed">
              Permiten recordar información que cambia la forma en que se comporta el sitio.
            </p>
            <ul className="mt-2 space-y-1 text-sm list-disc pl-5" style={{ color: '#64748B' }}>
              <li>Preferencias de visualización</li>
              <li>Configuración del dashboard</li>
              <li>Idioma y región seleccionados</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="mb-2" style={{ color: '#5B8DEF', fontSize: '0.95rem' }}>Estadísticas</h4>
            <p className="text-sm leading-relaxed">
              Ayudan a comprender cómo interactúan los usuarios con el sitio. Los datos se anonimizan.
            </p>
            <ul className="mt-2 space-y-1 text-sm list-disc pl-5" style={{ color: '#64748B' }}>
              <li>Google Analytics (anonimizado)</li>
              <li>Métricas de rendimiento y uso</li>
              <li>Análisis de comportamiento de navegación</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="mb-2" style={{ color: '#5B8DEF', fontSize: '0.95rem' }}>Marketing</h4>
            <p className="text-sm leading-relaxed">
              Se utilizan para rastrear a los visitantes y mostrar contenidos y anuncios relevantes.
            </p>
            <ul className="mt-2 space-y-1 text-sm list-disc pl-5" style={{ color: '#64748B' }}>
              <li>Seguimiento de campañas</li>
              <li>Personalización de contenidos</li>
              <li>Análisis de conversión</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>5. Cookies empleadas</h3>
          <p className="text-sm leading-relaxed">
            Las cookies activas en este sitio web pueden cambiar según la configuración y herramientas utilizadas. El listado actualizado de cookies, incluyendo nombre, duración, finalidad y proveedor, está disponible mediante el sistema de gestión de consentimiento.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>6. Desactivación desde el navegador</h3>
          <p className="mb-3 text-sm leading-relaxed">
            Además de gestionar las cookies desde el banner de consentimiento, el usuario puede eliminar o bloquear las cookies desde su navegador web. Las instrucciones varían según el navegador:
          </p>
          <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
            <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios</li>
            <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad y seguridad &gt; Cookies y datos del sitio</li>
            <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Gestionar datos de sitios web</li>
            <li><strong>Microsoft Edge:</strong> Configuración &gt; Privacidad, búsqueda y servicios &gt; Cookies</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: '#64748B' }}>
            <strong>Nota importante:</strong> Bloquear o eliminar ciertas cookies puede afectar al funcionamiento correcto de la Plataforma ARKIA.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>7. Cambios en la Política de Cookies</h3>
          <p className="text-sm leading-relaxed">
            Tech AI Solutions S.L. se reserva el derecho a modificar esta Política de Cookies cuando sea necesario por motivos técnicos, normativos o por cambios en los servicios ofrecidos. Cualquier modificación será publicada en esta misma página y comunicada a los usuarios activos.
          </p>
        </section>

        <section>
          <h3 className="mb-3" style={{ color: '#1E293B', fontSize: '1.1rem' }}>8. Responsable del tratamiento</h3>
          <p className="mb-2 text-sm leading-relaxed">Responsable: <strong>Tech AI Solutions S.L.</strong></p>
          <p className="mb-2 text-sm leading-relaxed">CIF: B56350796</p>
          <p className="mb-2 text-sm leading-relaxed">Domicilio: Calle Frida Kahlo 26, 4B, 28051, Madrid, España</p>
          <p className="mb-2 text-sm leading-relaxed">Email de contacto: gestion@arkialabs.es</p>
        </section>

        <section className="pt-4 border-t" style={{ borderColor: 'rgba(91, 141, 239, 0.1)' }}>
          <p className="text-xs" style={{ color: '#94A3B8' }}>
            Última actualización: Octubre 2024
          </p>
        </section>
      </div>
    </LegalModal>
  );
}
