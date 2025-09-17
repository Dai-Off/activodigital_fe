import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm tracking-tight">LE</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Activo digital</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link 
                  to="/activos" 
                  className={`nav-item pb-4 ${
                    isActive('/activos') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Activos
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`nav-item pb-4 ${
                    isActive('/dashboard') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/documentos" 
                  className={`nav-item pb-4 ${
                    isActive('/documentos') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Documentación
                </Link>
                <Link 
                  to="/mantenimiento" 
                  className={`nav-item pb-4 ${
                    isActive('/mantenimiento') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Mantenimiento
                </Link>
                <Link 
                  to="/cumplimiento" 
                  className={`nav-item pb-4 ${
                    isActive('/cumplimiento') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Cumplimiento
                </Link>
                <Link 
                  to="/unidades" 
                  className={`nav-item pb-4 ${
                    isActive('/unidades') 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Unidades
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Notificaciones">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 20a6.5 6.5 0 0113 0" />
                </svg>
              </div>
              <button
                onClick={() => {
                  try {
                    window.localStorage.removeItem('access_token');
                    window.sessionStorage.removeItem('access_token');
                  } catch {}
                  navigate('/login');
                }}
                className="group inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l3-3m0 0l-3-3m3 3H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6">
        <Outlet />
      </main>
      
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.6s ease-out; }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out both; }
      `}</style>
    </div>
  );
}
