import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredPermission?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredPermission,
  fallback
}) => {
  const { user, isLoading, hasPermission } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Si requiere autenticación y no hay usuario (después de cargar), redirigir a login
  // Si está cargando, permitir que el componente hijo maneje su propio loading
  if (!isLoading && requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si requiere un permiso específico y no lo tiene, mostrar fallback o redirigir
  if (requiredPermission && user && !hasPermission(requiredPermission as any)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('protectedRoute.accessRestricted')}</h2>
          <p className="text-gray-600 mb-4">{t('protectedRoute.noPermission')}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('protectedRoute.goBack')}
          </button>
        </div>
      </div>
    );
  }

  // Si pasa todas las validaciones, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;