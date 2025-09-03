import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginRequest } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await loginRequest({ email, password });
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem('access_token', resp.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
            <span className="text-white font-semibold">LE</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Iniciar sesión</h1>
          <p className="text-gray-600 mt-1">Accede al Libro del Edificio</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fadeInUp" style={{animationDelay: '0.05s'}}>
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
              {error}
            </div>
          )}
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

            <button type="submit" disabled={loading} className={`w-full inline-flex justify-center items-center gap-2 rounded-lg text-white font-semibold py-2.5 transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Ingresando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Crear cuenta</Link>
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


