import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  signupRequest,
  loginRequest,
  fetchMe,
  validateInvitation,
  signupWithInvitation,
} from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { FormLoader, useLoadingState } from './ui/LoadingSystem';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  // Soportar distintos nombres de query param por invitación
  const token =
    searchParams.get('token') ||
    searchParams.get('invitation_token') ||
    searchParams.get('invite');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const { loading, error, startLoading, stopLoading } = useLoadingState();
  const [success, setSuccess] = useState(null);
  const [hasInvitation, setHasInvitation] = useState(false);

  // Verificar y precargar datos por invitación
  useEffect(() => {
    let isMounted = true;
    if (!token) return;

    (async () => {
      try {
        const response = await validateInvitation(token);
        if (!isMounted) return;

        if (response?.success && response?.invitation) {
          setHasInvitation(true);
          if (response.invitation.email) setEmail(response.invitation.email);
        } else {
          // Token inválido/expirado
          setHasInvitation(false);
        }
      } catch (err) {
        console.error('Error validating invitation token:', err);
        setHasInvitation(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Helper para mostrar error en banner
  const setError = (message: string) => {
    stopLoading(message || t('unknownError', 'Ocurrió un error'));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);

    if (!name.trim()) return setError(t('nameRequired', 'El nombre es obligatorio'));
    if (!email.trim()) return setError(t('emailRequired', 'El correo es obligatorio'));
    if (password.length < 8)
      return setError(t('passwordMin', 'La contraseña debe tener al menos 8 caracteres'));
    if (password !== password2) return setError(t('passwordMismatch', 'Las contraseñas no coinciden'));

    startLoading();

    try {
      if (hasInvitation && token) {
        // Registro con invitación
        const response = await signupWithInvitation({
          email,
          password,
          full_name: name,
          invitation_token: token,
        });

        await login(response.access_token);
        localStorage.setItem('access_token', response.access_token);

        const roleName = response?.user?.role?.name;
        if (roleName === 'cfo') navigate('/cfo-dashboard');
        else navigate('/activos');
      } else {
        // Registro normal
        await signupRequest({ email, password, full_name: name });

        // Auto-login
        const resp = await loginRequest({ email, password });
        await login(resp.access_token);
        localStorage.setItem('access_token', resp.access_token);

        // Obtener perfil real y redirigir
        const me = await fetchMe();
        const roleName = me?.role?.name;
        if (roleName === 'cfo') navigate('/cfo-dashboard');
        else navigate('/activos');
      }

      stopLoading();
    } catch (err) {
      console.error(err);
      setError((err as any)?.message || t('signupError', 'Error al crear la cuenta'));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
            <span className="text-white font-semibold">LE</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('registerTitle', 'Crear cuenta')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('registerSubtitle', 'Regístrate para comenzar')}
          </p>
        </div>

        <div
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fadeInUp"
          style={{ animationDelay: '0.05s' }}
        >
          {hasInvitation && (
            <div className="mb-4 p-3 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-800">
              <strong>{t('inviteDetected', 'Invitación detectada')}:</strong>{' '}
              {t(
                'inviteInfo',
                'Has sido invitado a unirte a la plataforma. El email ya está predefinido y se usará el rol de la invitación.'
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('nameLabel', 'Nombre')}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder={t('namePlaceholder', 'Tu nombre')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('emailLabel', 'Correo electrónico')}
              </label>
              {hasInvitation ? (
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-600"
                  value={email}
                  readOnly
                  title={t('inviteEmailTitle', 'El email está predefinido por la invitación')}
                />
              ) : (
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
              {hasInvitation && (
                <p className="mt-1 text-xs text-gray-500">
                  {t('inviteEmailHint', 'Este email está definido por la invitación')}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('passwordLabel', 'Contraseña')}
              </label>
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
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">
                {t('repeatPasswordLabel', 'Repetir contraseña')}
              </label>
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
              {loading ? <FormLoader message={t('creating', 'Creando cuenta...')} /> : t('create', 'Crear cuenta')}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {t('haveAccount', '¿Ya tienes cuenta?')}{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              {t('login', 'Inicia sesión')}
            </Link>
          </p>
        </div>

        <style>{`
          @keyframes fadeInUp { 
            from { transform: translateY(20px); opacity: 0; } 
            to { transform: translateY(0); opacity: 1; } 
          }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out both; }
        `}</style>
      </div>
    </div>
  );
}
