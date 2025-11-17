import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchMe, processPendingAssignments } from '../services/auth';
import type { MeResponse } from '../services/auth';

// Tipos de roles del sistema
export type UserRole = 'propietario' | 'tecnico' | 'administrador' | 'cfo';

// Permisos del sistema
export interface UserPermissions {
  canCreateBuildings: boolean;
  canAssignTechnicians: boolean;
  canManageDigitalBooks: boolean;
  canViewOwnBuildings: boolean;
  canViewAssignedBuildings: boolean;
}

// Usuario autenticado
export interface AuthUser {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: UserPermissions;
}

// Estado del contexto
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Función para calcular permisos basados en el rol
// Todos los roles tienen todos los permisos por ahora
const calculatePermissions = (_role: UserRole): UserPermissions => {
  // Todos los roles tienen todos los permisos
  return {
    canCreateBuildings: true,
    canAssignTechnicians: true,
    canManageDigitalBooks: true,
    canViewOwnBuildings: true,
    canViewAssignedBuildings: true,
  };
};

// Función para transformar respuesta del backend a AuthUser
const transformMeResponseToAuthUser = (response: MeResponse): AuthUser => {
  const role = response.role?.name as UserRole || 'tecnico';
  
  return {
    id: response.id,
    userId: response.userId,
    email: response.email,
    fullName: response.fullName || 'Usuario',
    role,
    permissions: calculatePermissions(role),
  };
};

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar datos del usuario
  const loadUser = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar si hay token
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return;
      }

      // Obtener datos del usuario
      const response = await fetchMe();
      const authUser = transformMeResponseToAuthUser(response);
      setUser(authUser);
    } catch (err) {
      console.error('Error loading user:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setUser(null);
      
      // Si hay error de autenticación, limpiar token
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
    } finally {
      setIsLoading(false);
    }
  };

  // Función de login
  const login = async (token: string): Promise<void> => {
    // Guardar token
    localStorage.setItem('access_token', token);
    
    // Cargar datos del usuario
    await loadUser();
    
    // Procesar asignaciones pendientes si existen
    try {
      const pendingAssignmentData = localStorage.getItem('pendingAssignment');
      if (pendingAssignmentData) {
        const pendingAssignment = JSON.parse(pendingAssignmentData);
        
        // Verificar que la asignación no sea muy antigua (máximo 1 hora)
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        if (pendingAssignment.timestamp > oneHourAgo) {
          console.log('Procesando asignación pendiente:', pendingAssignment);
          
          const result = await processPendingAssignments(
            pendingAssignment.email,
            pendingAssignment.buildingId
          );
          
          if (result.success) {
            console.log('Asignación procesada exitosamente:', result.message);
            // Limpiar la asignación pendiente
            localStorage.removeItem('pendingAssignment');
          } else {
            console.error('Error procesando asignación:', result.message);
          }
        } else {
          // Asignación muy antigua, limpiarla
          localStorage.removeItem('pendingAssignment');
        }
      }
    } catch (error) {
      console.error('Error procesando asignaciones pendientes:', error);
      // No lanzar error para no interrumpir el login
    }
  };

  // Función de logout
  const logout = (): void => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    setUser(null);
    setError(null);
  };

  // Función para refrescar datos del usuario
  const refreshUser = async (): Promise<void> => {
    await loadUser();
  };

  // Función para verificar permisos - Todos los roles tienen todos los permisos
  const hasPermission = (_permission: keyof UserPermissions): boolean => {
    return true; // Todos los roles tienen todos los permisos
  };

  // Función para verificar rol
  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  // Cargar usuario al montar el componente
  useEffect(() => {
    loadUser();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
    hasPermission,
    isRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
