import { useState } from "react";
import { motion } from "motion/react";
import { sendContactEmail, type ContactFormData } from "../../../services/landingContact";

const offices = [
// ... (omitted for brevity, will use full content in actual call)
  {
    city: "Madrid",
    address: "Paseo de la Castellana, 123",
    postalCode: "28046 Madrid, España",
    phone: "+34 91 123 45 67",
    email: "madrid@arkia.io",
  },
  {
    city: "Barcelona",
    address: "Passeig de Gràcia, 45",
    postalCode: "08007 Barcelona, España",
    phone: "+34 93 234 56 78",
    email: "barcelona@arkia.io",
  },
  {
    city: "London",
    address: "1 Canary Wharf",
    postalCode: "E14 5AB London, UK",
    phone: "+44 20 1234 5678",
    email: "london@arkia.io",
  },
];

const contactReasons = [
  "Solicitar Demo Personalizada",
  "Información Comercial",
  "Soporte Técnico",
  "Partnerships",
  "Prensa y Media",
  "Careers",
];

export function Contacto() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    aumRange: "Seleccione rango",
    reason: "Seleccione una opción",
    message: "",
    privacyAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.privacyAccepted) {
      setSubmitStatus({
        type: "error",
        message: "Por favor, rellene todos los campos obligatorios y acepte la política de privacidad.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: null });

    try {
      await sendContactEmail(formData);
      setSubmitStatus({
        type: "success",
        message: "¡Gracias! Hemos recibido su solicitud. Nos pondremos en contacto en menos de 24 horas.",
      });
      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        aumRange: "Seleccione rango",
        reason: "Seleccione una opción",
        message: "",
        privacyAccepted: false,
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Hubo un error al enviar su solicitud. Por favor, inténtelo de nuevo más tarde o contáctenos directamente por email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-white relative">
      {/* Hero Header */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#0a0a0a] to-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
              Contacto
            </div>
            <h1 className="text-4xl md:text-7xl font-light text-white mb-6 leading-tight">
              Hablemos de su <span className="font-semibold">Portfolio</span>
            </h1>
            <p className="text-xl text-white/80 font-light max-w-3xl leading-relaxed">
              Nuestro equipo de especialistas está listo para ayudarle a transformar
              la gestión de sus activos inmobiliarios. Agende una demo personalizada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-light text-gray-900 mb-8">
                Formulario de Contacto
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-3">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-3">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                      placeholder="García"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-3">
                    Email Corporativo *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                    placeholder="j.garcia@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-3">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                    placeholder="+34 600 123 456"
                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-3">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                    placeholder="Nombre de su empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-3">
                    AUM Gestionados *
                  </label>
                  <select 
                    name="aumRange"
                    value={formData.aumRange}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                  >
                    <option disabled>Seleccione rango</option>
                    <option>€10M - €50M</option>
                    <option>€50M - €100M</option>
                    <option>€100M - €500M</option>
                    <option>€500M - €1B</option>
                    <option>€1B+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-3">
                    Motivo de Contacto *
                  </label>
                  <select 
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0ea5e9] transition-colors"
                  >
                    <option disabled>Seleccione una opción</option>
                    {contactReasons.map((reason, idx) => (
                      <option key={idx}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm uppercase tracking-[0.15em] text-gray-600 mb-3">
                    Mensaje
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0ea5e9] transition-colors resize-none"
                    placeholder="Cuéntenos sobre sus necesidades..."
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer">
                    Acepto la{" "}
                    <a href="#" className="text-[#0ea5e9] underline">
                      política de privacidad
                    </a>{" "}
                    y el tratamiento de mis datos personales según GDPR
                  </label>
                </div>

                {submitStatus.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 text-sm ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full bg-[#0ea5e9] text-white py-4 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-[#0ea5e9]/90 transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Solicitud"
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  Nos pondremos en contacto en menos de 24 horas laborables
                </p>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-3xl font-light text-gray-900 mb-8">
                  Información de Contacto
                </h2>
                <div className="space-y-8">
                  <div>
                    <div className="text-sm uppercase tracking-[0.15em] text-gray-400 mb-2">
                      Email General
                    </div>
                    <a
                      href="mailto:info@arkia.io"
                      className="text-xl text-gray-900 hover:text-[#0ea5e9] transition-colors"
                    >
                      info@arkia.io
                    </a>
                  </div>
                  <div>
                    <div className="text-sm uppercase tracking-[0.15em] text-gray-400 mb-2">
                      Soporte Técnico
                    </div>
                    <a
                      href="mailto:support@arkia.io"
                      className="text-xl text-gray-900 hover:text-[#0ea5e9] transition-colors"
                    >
                      support@arkia.io
                    </a>
                  </div>
                  <div>
                    <div className="text-sm uppercase tracking-[0.15em] text-gray-400 mb-2">
                      Comercial
                    </div>
                    <a
                      href="mailto:sales@arkia.io"
                      className="text-xl text-gray-900 hover:text-[#0ea5e9] transition-colors"
                    >
                      sales@arkia.io
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6">
                  Horario de Atención
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes</span>
                    <span className="font-semibold">9:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Soporte Técnico</span>
                    <span className="font-semibold">24/7</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Necesita Ayuda Inmediata?
                </h3>
                <p className="text-gray-600 mb-6">
                  Nuestro equipo de soporte está disponible 24/7 para clientes activos
                </p>
                <a
                  href="tel:+34911234567"
                  className="text-2xl font-semibold text-[#0ea5e9]"
                >
                  +34 91 123 45 67
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Nuestras Oficinas
            </h2>
            <p className="text-gray-600">Presencia internacional para servir mejor a nuestros clientes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">{office.city}</h3>
                <div className="space-y-4 text-gray-600">
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">
                      Dirección
                    </div>
                    <div>{office.address}</div>
                    <div>{office.postalCode}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">
                      Teléfono
                    </div>
                    <a
                      href={`tel:${office.phone}`}
                      className="text-[#0ea5e9] hover:underline"
                    >
                      {office.phone}
                    </a>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">
                      Email
                    </div>
                    <a
                      href={`mailto:${office.email}`}
                      className="text-[#0ea5e9] hover:underline"
                    >
                      {office.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "¿Cuánto tiempo lleva la implementación?",
                answer:
                  "El proceso de onboarding completo toma entre 4-6 semanas dependiendo del tamaño del portfolio. Incluye migración de datos, capacitación del equipo e integración con sistemas existentes.",
              },
              {
                question: "¿Qué nivel de soporte técnico ofrecen?",
                answer:
                  "Ofrecemos soporte 24/7 para clientes enterprise con SLA de respuesta de 15 minutos para incidencias críticas. Incluye un customer success manager dedicado.",
              },
              {
                question: "¿Es compatible con nuestro ERP actual?",
                answer:
                  "ARKIA cuenta con más de 50 integraciones nativas con ERPs líderes (SAP, Oracle, Microsoft Dynamics) y APIs REST para conexiones personalizadas.",
              },
              {
                question: "¿Cómo garantizan la seguridad de nuestros datos?",
                answer:
                  "Certificación ISO 27001, encriptación AES-256, hosting en AWS con replicación geográfica, auditorías externas trimestrales y cumplimiento total GDPR.",
              },
              {
                question: "¿Qué incluye la demo personalizada?",
                answer:
                  "Una sesión de 60-90 minutos con nuestro equipo técnico, análisis de sus necesidades específicas, demostración de funcionalidades clave y propuesta de valor personalizada.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="border-b border-gray-200 pb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social & Legal */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="text-sm text-gray-500 mb-2">Síguenos en</div>
              <div className="flex items-center gap-4">
                {["LinkedIn", "Twitter", "YouTube"].map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="text-gray-600 hover:text-[#0ea5e9] transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              ARKIA Asset Intelligence S.L. | NIF: B-12345678
              <br />
              © 2026 Todos los derechos reservados | <a href="#" className="underline">Aviso Legal</a> | <a href="#" className="underline">Privacidad</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}