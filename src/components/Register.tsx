import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signupRequest, loginRequest } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { FormLoader, useLoadingState } from './ui/LoadingSystem';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('');
  const { loading, error, startLoading, stopLoading } = useLoadingState();
  const [success, setSuccess] = useState<string | null>(null);
  
  // Helper function para mostrar errores
  const setError = (message: string) => {
    stopLoading(message);
  };

  const availableRoles = [
    { value: 'tenedor', label: 'Tenedor' },
    { value: 'administrador', label: 'Administrador' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'cfo', label: 'CFO' }
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    
    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (!role) {
      setError('Por favor selecciona un tipo de usuario');
      return;
    }
    
    startLoading();
    try {
      await signupRequest({ email, password, full_name: name, role });
      
      // Auto-login inmediato usando el contexto de autenticación
      const resp = await loginRequest({ email, password });
      await login(resp.access_token);
      
      // Guardar token en localStorage
      localStorage.setItem('access_token', resp.access_token);
      
      // Redirigir según el rol
      if (role === 'cfo') {
        navigate('/cfo-dashboard');
      } else {
        navigate('/activos');
      }
      stopLoading();
    } catch (err: any) {
      stopLoading(err?.message || 'Error al crear la cuenta');
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
            <span className="text-white font-semibold">LE</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Crear cuenta</h1>
          <p className="text-gray-600 mt-1">Regístrate para comenzar</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-fadeInUp" style={{animationDelay: '0.05s'}}>
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-800">{success}</div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input id="name" type="text" autoComplete="name" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Tipo de usuario</label>
              <div className="relative">
                <select 
                  id="role" 
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 appearance-none bg-white pr-10 text-gray-900" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  required
                >
                  <option value="">Selecciona tu tipo de usuario</option>
                  {availableRoles.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input id="email" type="email" autoComplete="email" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input id="password" type="password" autoComplete="new-password" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">Repetir contraseña</label>
              <input id="password2" type="password" autoComplete="new-password" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="••••••••" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full inline-flex justify-center items-center gap-2 rounded-lg text-white font-semibold py-2.5 transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? <FormLoader message="Creando cuenta..." /> : 'Crear cuenta'}
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


