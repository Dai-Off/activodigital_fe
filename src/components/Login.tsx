import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loginRequest, processPendingAssignments } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FormLoader, useLoadingState } from './ui/LoadingSystem';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState<string | null>(null);
  const { loading, error, startLoading, stopLoading } = useLoadingState();
  // Mock QR step
  const [showQrStep, setShowQrStep] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [pendingRedirect, setPendingRedirect] = useState<'cfo'|'activos'|null>(null);
  const { t } = useTranslation();

  // Manejar parámetros de invitación al cargar
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const invitationParam = searchParams.get('invitation');
    const messageParam = searchParams.get('message');

    if (emailParam) {
      setEmail(emailParam);
    }

    if (invitationParam && messageParam === 'login') {
      setInvitationMessage('Tienes una invitación pendiente. Inicia sesión para completarla.');
      // Guardar token de invitación para procesar después del login
      localStorage.setItem('pendingInvitation', invitationParam);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startLoading();
    try {
      const resp = await loginRequest({ email, password });
      // Usar el contexto de autenticación para hacer login
      await login(resp.access_token);
      // Guardar en storage según preferencia del usuario
      if (remember) {
        localStorage.setItem('access_token', resp.access_token);
      } else {
        sessionStorage.setItem('access_token', resp.access_token);
      }
      // Procesar invitación pendiente si existe
      const pendingInvitation = localStorage.getItem('pendingInvitation');
      if (pendingInvitation) {
        try {
          // Obtener información de la invitación para procesar la asignación
          const invitationResponse = await fetch(`/auth/invitation/${pendingInvitation}`);
          const invitationData = await invitationResponse.json();
          if (invitationData.success && invitationData.invitation) {
            // Procesar la asignación pendiente
            await processPendingAssignments(email, invitationData.invitation.buildingId);
            localStorage.removeItem('pendingInvitation');
          }
        } catch (invitationError) {
          console.error('Error procesando invitación:', invitationError);
          // No bloquear el login por errores de invitación
        }
      }
      // MOCK: mostrar QR y pedir código antes de navegar
      setShowQrStep(true);
      setPendingRedirect(user?.role === 'cfo' ? 'cfo' : 'activos');
      stopLoading();
    } catch (err: any) {
      stopLoading(err?.message || 'Error al iniciar sesión');
    }
  }

  // Mock: función para "validar" el código QR
  function handleQrCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Solo mock: cualquier código es válido
    if (pendingRedirect === 'cfo') {
      navigate('/cfo-dashboard');
    } else {
      navigate('/activos');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
            <span className="text-white font-semibold">LE</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('loginTitle', 'Iniciar sesión')}</h1>
          <p className="text-gray-600 mt-1">{t('loginSubtitle', 'Accede a Activo Digital')}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fadeInUp" style={{animationDelay: '0.05s'}}>
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
              {error}
            </div>
          )}
          {invitationMessage && (
            <div className="mb-4 p-3 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-800">
              {invitationMessage}
            </div>
          )}

          {/* Paso de QR mockeado */}
          {showQrStep ? (
            <form className="space-y-8" onSubmit={handleQrCodeSubmit}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col items-center mb-2 animate-fadeInUp">
                  <svg className="w-8 h-8 text-blue-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"/><path d="M12 19c-4.418 0-8-1.79-8-4V7a2 2 0 012-2h12a2 2 0 012 2v8c0 2.21-3.582 4-8 4z"/></svg>
                  <span className="text-blue-900 font-semibold text-base text-center">Verificación adicional de seguridad</span>
                  <span className="text-blue-800 text-sm text-center mt-1">Para proteger tu cuenta y tus datos, te pedimos escanear este código QR y escribir el código recibido. Así evitamos accesos no autorizados y garantizamos que solo tú puedes ingresar.</span>
                </div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=mock-activo-digital" alt="QR de acceso" className="rounded-lg border-2 border-blue-200 shadow-md" />
                <span className="text-gray-700 text-base font-medium text-center">Escanea el QR con tu app y escribe el código recibido</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <label htmlFor="qr-code-input" className="text-sm font-semibold text-gray-800">Código del QR</label>
                <input
                  id="qr-code-input"
                  type="text"
                  className="w-60 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg px-4 py-3 transition-all placeholder-gray-400 tracking-widest text-center font-mono bg-blue-50 shadow-sm"
                  placeholder="Ej: 123456"
                  value={qrCodeInput}
                  onChange={e => setQrCodeInput(e.target.value)}
                  autoFocus
                  maxLength={12}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl text-white font-bold text-base py-3 transition-all bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                style={{letterSpacing: '0.03em'}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                Validar código y entrar
              </button>
              <div className="text-xs text-gray-500 text-center mt-2">¿Problemas? Asegúrate de usar la app oficial o contacta a soporte.</div>
            </form>
          ) : (
            <>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input id="email" type="email" autoComplete="email" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <Link to="#" className="text-sm text-blue-600 hover:text-blue-700">¿Olvidaste tu contraseña?</Link>
                  </div>
                  <input id="password" type="password" autoComplete="current-password" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    Recuérdame
                  </label>
                </div>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full inline-flex justify-center items-center gap-2 rounded-lg text-white font-semibold py-2.5 transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? <FormLoader message="Ingresando..." /> : 'Entrar'}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Crear cuenta</Link>
              </p>
            </>
          )}
        </div>
        <style>{`
          @keyframes fadeInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out both; }
        `}</style>
      </div>
    </div>
  );
}


