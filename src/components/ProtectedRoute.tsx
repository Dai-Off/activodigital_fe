import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Si requiere autenticación y no hay usuario (después de cargar), redirigir a login
  // Si está cargando, permitir que el componente hijo maneje su propio loading
  if (!isLoading && requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;