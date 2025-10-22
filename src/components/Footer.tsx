import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 pt-16 pb-8 px-4 md:px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 overflow-hidden" style={{ maxHeight: '100px' }}>
              <img 
                src="/logo.png" 
                alt="ARKIA" 
                className="w-auto"
                style={{ 
                  objectFit: 'contain',
                  height: '140px',
                  objectPosition: 'left center',
                  marginTop: '-10px',
                  marginBottom: '-10px'
                }}
              />
            </div>
            <p className="leading-relaxed text-sm" style={{ color: '#64748B' }}>
              Plataforma SaaS multidisciplinar con motores de IA para rehabilitación energética y cumplimiento EPBD.
            </p>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="mb-4 text-sm sm:text-base" style={{ color: '#1E293B' }}>
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#5B8DEF' }} />
                <span className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                  Paseo de la Castellana 130<br />
                  Madrid, 28046
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#5B8DEF' }} />
                <a 
                  href="mailto:gestion@arkia.global"
                  className="text-sm hover:underline"
                  style={{ color: '#64748B' }}
                >
                  gestion@arkia.global
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left" style={{ color: '#94A3B8' }}>
              © {currentYear} ARKIA Labs. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
             
              <a 
                href="/terminos" 
                className="text-sm hover:underline"
                style={{ color: '#94A3B8' }}
              >
                Términos de Servicio
              </a>
            
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}



