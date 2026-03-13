import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="contacto"
      ref={ref}
      className="relative min-h-screen w-full snap-start bg-[#0a0a0a] flex items-center justify-center overflow-hidden py-24"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Eyebrow */}
          <div className="text-sm uppercase tracking-[0.3em] text-white/50 mb-6">
            Demo Personalizada
          </div>

          {/* Main Heading */}
          <h2 className="text-6xl md:text-8xl font-light text-white mb-6 leading-tight tracking-tight">
            ¿Listo para
            <br />
            <span className="font-semibold">Revalorizar</span>
            <br />
            su Portfolio?
          </h2>

          <p className="text-white/70 text-xl md:text-2xl font-light mb-16 max-w-3xl mx-auto leading-relaxed">
            Únase a los fondos de inversión y asset managers institucionales 
            que ya confían en ARKIA para gestionar más de €2.5B en activos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-5 bg-[#0ea5e9] text-white text-base font-semibold uppercase tracking-[0.15em] hover:bg-[#0284c7] transition-colors duration-300"
            >
              Solicitar Demo
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-5 border border-white/30 text-white text-base font-semibold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors duration-300"
            >
              Descargar Brochure
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto pt-16 border-t border-white/10"
          >
            <div className="text-left">
              <div className="text-2xl font-semibold text-white mb-2">ISO 27001</div>
              <div className="text-xs text-white/50 uppercase tracking-[0.2em]">
                Seguridad
              </div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-semibold text-white mb-2">GDPR</div>
              <div className="text-xs text-white/50 uppercase tracking-[0.2em]">
                Cumplimiento
              </div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-semibold text-white mb-2">24/7</div>
              <div className="text-xs text-white/50 uppercase tracking-[0.2em]">
                Soporte
              </div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-semibold text-white mb-2">99.9%</div>
              <div className="text-xs text-white/50 uppercase tracking-[0.2em]">
                Uptime SLA
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-white/40 text-sm"
          >
            <p>
              ARKIA Asset Intelligence S.L. | NIF: B-12345678
              <br />
              Paseo de la Castellana, 123 | 28046 Madrid | España
              <br />
              info@arkia.io | +34 91 123 45 67
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}