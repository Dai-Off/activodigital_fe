import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';

// Interface para la respuesta del endpoint de invitación
interface InvitationResponse {
  success: boolean;
  userExists: boolean;
  redirect: string;
  message: string;
  invitation: {
    id: string;
    email: string;
    role: string;
    buildingId: string;
    buildingName: string;
    invitedBy: string;
    expiresAt: string;
  };
}

export default function InvitationHandler() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
  setError(t('invitationTokenNotFound', 'Token de invitación no encontrado'));
      setLoading(false);
      return;
    }

    const handleInvitation = async () => {
      try {
        const data: InvitationResponse = await apiFetch(`/auth/invitation/${token}`, { method: 'GET' });

        if (data.success) {
          // Redirigir según la respuesta del backend
          if (data.userExists) {
            // Usuario existe - redirigir a login con parámetros
            navigate(`/login?email=${encodeURIComponent(data.invitation.email)}&invitation=${token}&message=login`);
          } else {
            // Usuario no existe - redirigir a registro
            navigate(`/auth/register?token=${token}`);
          }
        } else {
    setError(t('invitationProcessError', 'Error al procesar la invitación'));
        }
      } catch (err: any) {
        console.error('Error procesando invitación:', err);
  setError(err.message || t('serverConnectionError', 'Error al conectar con el servidor'));
      } finally {
        setLoading(false);
      }
    };

    handleInvitation();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('processingInvitation', 'Procesando invitación...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('error', 'Error')}</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {t('goToHome', 'Ir al Inicio')}
          </button>
        </div>
      </div>
    );
  }

  return null; // No debería llegar aquí
}
