import { Link } from 'react-router-dom';

export default function Footer({
  isChatOpen,
  onToggleChat,
  showChatButton = true,
}: {
  isChatOpen?: boolean;
  onToggleChat?: () => void;
  showChatButton?: boolean;
}) {
  return (
    <footer className="border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center ring-1 ring-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">¿Necesitas ayuda con un activo o documento?</p>
            <p className="text-base font-semibold text-gray-900">Asistente IA</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
          <div>
            <div className="mb-2 font-semibold text-gray-900">Producto</div>
            <ul className="space-y-1.5">
              <li>
                <Link to="/activos" className="text-gray-600 hover:text-gray-900">
                  Activos
                </Link>
              </li>
              <li>
                <Link to="/documentos" className="text-gray-600 hover:text-gray-900">
                  Documentación
                </Link>
              </li>
              <li>
                <Link to="/mantenimiento" className="text-gray-600 hover:text-gray-900">
                  Mantenimiento
                </Link>
              </li>
              <li>
                <Link to="/cumplimiento" className="text-gray-600 hover:text-gray-900">
                  Cumplimiento
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-gray-900">Recursos</div>
            <ul className="space-y-1.5">
              <li>
                <Link to="/ayuda" className="text-gray-600 hover:text-gray-900">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="text-gray-600 hover:text-gray-900">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-gray-900">Empresa</div>
            <ul className="space-y-1.5">
              <li>
                <Link to="/sobre" className="text-gray-600 hover:text-gray-900">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-600 hover:text-gray-900">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-gray-900">
                  Trabaja con nosotros
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-gray-900">Legal</div>
            <ul className="space-y-1.5">
              <li>
                <Link to="/terminos" className="text-gray-600 hover:text-gray-900">
                  Términos
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-gray-600 hover:text-gray-900">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-gray-900">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold text-gray-900">Contacto</div>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 6 12 13 2 6" />
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                </svg>
                soporte@tudominio.com
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v.09a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h.09A2 2 0 016 3.72c.2.74.47 1.45.82 2.12a2 2 0 01-.45 2.18L5.6 9.4a16 16 0 006 6l1.38-1.38a2 2 0 012.18-.45c.67.35 1.38.62 2.12.82A2 2 0 0121.91 16H22z" />
                </svg>
                +351 210 000 000
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Activo digital</span>
            <span className="text-gray-300">•</span>
            <span>© {new Date().getFullYear()}</span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-700">Operativo</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Volver arriba"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 15-6-6-6 6" />
              </svg>
              Arriba
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}


