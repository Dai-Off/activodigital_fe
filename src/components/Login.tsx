import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loginRequest, processPendingAssignments, fetchMe, verify2FALogin } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FormLoader, useLoadingState } from './ui/LoadingSystem';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState<string | null>(null);
  const { loading, error, startLoading, stopLoading } = useLoadingState();
  
  // Estados para 2FA obligatorio
  const [show2FAVerification, setShow2FAVerification] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [error2FA, setError2FA] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  
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
      setInvitationMessage(t('invitationPendingMessage', 'Tienes una invitación pendiente. Inicia sesión para completarla.'));
      // Guardar token de invitación para procesar después del login
      localStorage.setItem('pendingInvitation', invitationParam);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startLoading();
    try {
      // Solo validamos email/password primero
      await loginRequest({ email, password });
      
      // El backend responde con requiresTwoFactor: true
      // NO intentar obtener datos del usuario todavía
      
      // Mostrar modal 2FA obligatorio
      setTempEmail(email);
      setShow2FAVerification(true);
      stopLoading();
    } catch (err: any) {
      stopLoading(err?.message || 'Error al iniciar sesión');
    }
  }

  // Verificar código 2FA y completar login
  async function handle2FAVerification(e: React.FormEvent) {
    e.preventDefault();
    
    if (twoFactorCode.length !== 6) {
      setError2FA(t('invalid2FACodeLength', 'El código debe tener 6 dígitos'));
      return;
    }

    setVerifying2FA(true);
    setError2FA('');

    try {
      const verifyResponse = await verify2FALogin({
        email: tempEmail,
        token: twoFactorCode,
        password: password,  // ← Agregar password
      });

      if (verifyResponse.success && verifyResponse.access_token) {
        // 2FA verificado correctamente, guardar token y hacer login
        const token = verifyResponse.access_token;
        
        if (remember) {
          localStorage.setItem('access_token', token);
        } else {
          sessionStorage.setItem('access_token', token);
        }
        
        await login(token);
        
        // Ahora sí podemos obtener la información del usuario
        const meResp = await fetchMe();
        const userRole = meResp?.role?.name || 'tecnico';
        
        // Procesar invitación pendiente si existe
        const pendingInvitation = localStorage.getItem('pendingInvitation');
        if (pendingInvitation) {
          try {
            await processPendingAssignments(tempEmail, pendingInvitation);
            localStorage.removeItem('pendingInvitation');
          } catch (invitationError) {
            console.error('Error procesando invitación:', invitationError);
          }
        }
        
        // Redirigir según rol
        if (userRole === 'cfo') {
          navigate('/cfo-dashboard');
        } else {
          navigate('/activos');
        }
      } else {
        // Respuesta exitosa pero sin access_token
        const errorMsg = verifyResponse.message || t('invalid2FACode', 'Código inválido. Intenta nuevamente.');
        setError2FA(errorMsg);
        console.error('verify2FALogin returned success but no access_token:', verifyResponse);
      }
    } catch (err: any) {
      console.error('Error 2FA:', err);
      const errorMessage = err?.body?.message || err?.message || t('invalid2FACode', 'Código inválido. Intenta nuevamente.');
      setError2FA(errorMessage);
    } finally {
      setVerifying2FA(false);
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

          {/* Modal de Verificación 2FA */}
          {show2FAVerification ? (
            <div className="animate-fadeInUp">
              <div className="mb-6 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t('enter2FACode', 'Introduce tu código de autenticación')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('enter2FACodeDesc', 'Abre Google Authenticator y escribe el código de 6 dígitos')}
                </p>
              </div>

              {error2FA && (
                <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
                  {error2FA}
                </div>
              )}

              <form onSubmit={handle2FAVerification} className="space-y-4">
                <div>
                  <label htmlFor="2fa-code" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    {t('codeFromAuthenticator', 'Código de 6 dígitos')}
                  </label>
                  <input
                    id="2fa-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl font-mono tracking-widest rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifying2FA || twoFactorCode.length !== 6}
                  className={`w-full py-2.5 rounded-lg text-white font-semibold transition-colors ${
                    verifying2FA || twoFactorCode.length !== 6
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {verifying2FA ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t('verifying2FA', 'Verificando código...')}
                    </span>
                  ) : (
                    t('verifyCode', 'Verificar código')
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShow2FAVerification(false);
                    setTwoFactorCode('');
                    setError2FA('');
                  }}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  ← {t('back', 'Volver')}
                </button>
              </form>

              <p className="mt-4 text-xs text-center text-gray-500">
                {t('qrProblemsHelp', '¿Problemas? Usa la app oficial o contacta a soporte.')}
              </p>
            </div>
          ) : (
            <>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('email', 'Correo electrónico')}</label>
                  <input id="email" type="email" autoComplete="email" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder={t('emailPlaceholder', 'tucorreo@ejemplo.com')} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('password', 'Contraseña')}</label>
                    <Link to="#" className="text-sm text-blue-600 hover:text-blue-700">{t('forgotPassword', '¿Olvidaste tu contraseña?')}</Link>
                  </div>
                  <input id="password" type="password" autoComplete="current-password" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder={t('passwordPlaceholder', '••••••••')} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    {t('rememberMe', 'Recuérdame')}
                  </label>
                </div>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full inline-flex justify-center items-center gap-2 rounded-lg text-white font-semibold py-2.5 transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? <FormLoader message={t('signingIn', 'Ingresando...')} /> : t('signIn', 'Entrar')}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600">
                {t('dontHaveAccount', '¿No tienes cuenta?')}{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">{t('createAccount', 'Crear cuenta')}</Link>
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


