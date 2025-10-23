import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signupWithInvitation, validateInvitation } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { FormLoader, useLoadingState } from './ui/LoadingSystem';
import type { ValidateInvitationResponse } from '../services/auth';

export default function RegisterWithInvitation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [invitationData, setInvitationData] = useState<ValidateInvitationResponse['invitation'] | null>(null);
  
  const { loading, error, startLoading, stopLoading } = useLoadingState();
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Validar token al cargar el componente
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenError('Token de invitación no encontrado');
        setValidatingToken(false);
        return;
      }

      try {
        const response = await validateInvitation(token);
        
        if (response.success && response.invitation) {
          setInvitationData(response.invitation);
          setEmail(response.invitation.email); // Pre-llenar email
        } else {
          setTokenError('Token de invitación inválido o expirado');
        }
      } catch (err: any) {
        console.error('Error validating invitation:', err);
        setTokenError('Error al validar la invitación');
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!token) {
      stopLoading('Token de invitación no encontrado');
      return;
    }
    
    if (password !== password2) {
      stopLoading('Las contraseñas no coinciden');
      return;
    }
    
    startLoading();
    try {
      // Registro con invitación
      const response = await signupWithInvitation({
        email,
        password,
        full_name: name,
        invitation_token: token
      });
      
      // Auto-login inmediato
      await login(response.access_token);
      
      // Guardar token en localStorage
      localStorage.setItem('access_token', response.access_token);
      
      // Redirigir según el rol
      const roleName = response.user.role.name;
      if (roleName === 'cfo') {
        navigate('/cfo-dashboard');
      } else if (roleName === 'propietario') {
        navigate('/activos');
      } else {
        navigate('/activos');
      }
      
      stopLoading();
    } catch (err: any) {
      stopLoading(err?.message || 'Error al crear la cuenta');
    }
  }

  // Mostrar loading mientras se valida el token
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validando invitación...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si el token no es válido
  if (tokenError || !invitationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fadeInUp">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{t('invalidInvitation', 'Invitación Inválida')}</h1>
            <p className="text-gray-600 mt-1">{tokenError}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fadeInUp" style={{animationDelay: '0.05s'}}>
            <p className="text-gray-600 text-center mb-6">
              {t('invitationInvalidDesc', 'La invitación no es válida, ha expirado o ya fue utilizada.')}
            </p>
            
            <div className="space-y-3">
              <Link
                to="/register"
                className="w-full inline-flex justify-center items-center gap-2 rounded-lg text-white font-semibold py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {t('registerNormally', 'Registrarse normalmente')}
              </Link>
              
              <Link
                to="/login"
                className="w-full inline-flex justify-center items-center gap-2 rounded-lg text-gray-700 font-semibold py-2.5 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar formulario de registro con invitación
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('invitedTitle', '¡Has sido invitado!')}</h1>
          <p className="text-gray-600 mt-1">{t('registerSubtitle', 'Completa tu registro para comenzar')}</p>
        </div>

        {/* Información de la invitación */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">
                Invitación para ser {invitationData.role === 'tecnico' ? 'Técnico' : 
                                   invitationData.role === 'cfo' ? 'CFO' : 'Propietario'}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Edificio:</strong> {invitationData.buildingName}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Invitado por:</strong> {invitationData.invitedBy}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fadeInUp" style={{animationDelay: '0.15s'}}>
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">{error}</div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input 
                id="name" 
                type="text" 
                autoComplete="name" 
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                placeholder="Tu nombre completo" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input 
                id="email" 
                type="email" 
                autoComplete="email" 
                className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-600" 
                value={email} 
                readOnly 
                title="El email está predefinido por la invitación"
              />
              <p className="mt-1 text-xs text-gray-500">Este email está definido por la invitación</p>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                id="password" 
                type="password" 
                autoComplete="new-password" 
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">Repetir contraseña</label>
              <input 
                id="password2" 
                type="password" 
                autoComplete="new-password" 
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                placeholder="••••••••" 
                value={password2} 
                onChange={(e) => setPassword2(e.target.value)} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full inline-flex justify-center items-center gap-2 rounded-lg text-white font-semibold py-2.5 transition-colors ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? <FormLoader message="Creando cuenta..." /> : 'Aceptar invitación y crear cuenta'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Inicia sesión</Link>
          </p>
        </div>

        <style>{`
          @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out both; }
        `}</style>
      </div>
    </div>
  );
}
