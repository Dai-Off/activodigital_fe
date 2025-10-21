import { Link } from 'react-router-dom';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation();
  const features = [
    { title: t('landing.simpleClear', 'Simple y claro'), desc: t('landing.simpleClearDesc', 'Interfaz limpia, sin ruido. Enfócate en lo importante.') },
    { title: t('landing.readyToGrow', 'Listo para crecer'), desc: t('landing.readyToGrowDesc', 'Arquitectura modular. Funciona hoy, escala mañana.') },
    { title: t('landing.secureData', 'Datos seguros'), desc: t('landing.secureDataDesc', 'Autenticación y roles gestionados por backend.') },
  ];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">LE</span>
            </div>
            <span className="text-gray-900 font-semibold">{t('appTitle', 'Activo digital')}</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900">{t('login', 'Iniciar sesión')}</Link>
            <Link to="/register" className="inline-flex items-center rounded-lg bg-blue-600 text-white text-sm font-semibold px-4 py-2 hover:bg-blue-700 transition-colors">{t('register', 'Crear cuenta')}</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(37,99,235,0.08),transparent)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Columna izquierda */}
              <div className="animate-fadeInUp">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {t('landing.platformForBuildings', 'Plataforma para edificios')}
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  {t('landing.platformTitle', 'Plataforma Gestión Activos Inmbiliarios')}
                </h1>
                <p className="mt-4 text-gray-600">
                  {t('landing.platformDesc', 'Consolida información clave del edificio y añade simulaciones financieras con IA para apoyar decisiones de inversión, rehabilitación o venta. Claridad total para propietarios, gestores e inversores.')}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    to="/register"
                    className="inline-flex items-center rounded-lg bg-blue-600 text-white font-semibold px-5 py-2.5 hover:bg-blue-700 transition-colors"
                  >
                    {t('register', 'Crear cuenta')}
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white text-gray-900 font-medium px-5 py-2.5 hover:bg-gray-50"
                  >
                    {t('login', 'Iniciar sesión')}
                  </Link>
                </div>
                <div className="mt-4 text-sm text-gray-500">{t('landing.mockupNotice', 'Mockup de producto. Las métricas mostradas son demostrativas.')}</div>
              </div>

              {/* Columna derecha: imagen + 3 items horizontales debajo */}
              <div className="lg:justify-self-end w-full animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
                  <div className="relative overflow-hidden rounded-lg h-64">
                    <img
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1280&h=720&fit=crop&crop=edges"
                      alt="Edificio"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* 🔽 Ítems en horizontal (debajo de la imagen) */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center justify-center text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-green-600/10 text-green-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="font-medium">{t('landing.financialRating', 'Rating Financiero & ESG')}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/10 text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 17h8m0 0v-8m0 8-8-8M3 7h8m0 0V3m0 4-8 8" />
                          </svg>
                        </span>
                        <span className="font-medium">{t('landing.investmentSimulator', 'Simulador de Inversiones')}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 flex items-center justify-center text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500/10 text-yellow-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M2 12h4m12 0h4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                        </span>
                        <span className="font-medium">{t('landing.smartEnvironmentalFootprint', 'Huella Ambiental Inteligente')}</span>
                      </div>
                    </div>
                  </div>
                  {/* 🔼 Fin ítems horizontales */}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Sección INTACTA (no tocar) */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow animate-fadeInUp"
                  style={{ animationDelay: `${0.05 * (i + 1)}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>


      <Footer />
      <style>{`
        @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out both; }
      `}</style>
    </div>
  );
}
