import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface AssignmentData {
  success: boolean;
  message: string;
  redirect?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
  building: {
    id: string;
    name: string;
    address: string;
  };
}

export default function AcceptAssignment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = searchParams.get('email');
    const building = searchParams.get('building');

    if (!email || !building) {
      setError('Parámetros de invitación faltantes');
      setLoading(false);
      return;
    }

    // Llamar al endpoint para obtener información de la asignación
    const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:3000' 
      : 'https://activodigital-be.fly.dev';
    
    fetch(`${apiBaseUrl}/auth/auto-accept?email=${encodeURIComponent(email)}&building=${building}`)
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setAssignmentData(data);
          
          // Guardar información de asignación pendiente en localStorage
          const pendingAssignment = {
            email: email,
            buildingId: building,
            buildingName: data.building?.name,
            buildingAddress: data.building?.address,
            timestamp: Date.now()
          };
          localStorage.setItem('pendingAssignment', JSON.stringify(pendingAssignment));
          
          // SIEMPRE redirigir al login para usuarios existentes
          navigate(`/login?email=${encodeURIComponent(email)}&message=assignment`);
          return;
        } else {
          setError(data.error || 'Error al procesar la asignación');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message || 'Error al conectar con el servidor. Verifica que el backend esté funcionando.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams, navigate]);

  const handleAcceptAssignment = async () => {
    if (!assignmentData) return;

    // TODO: Implementar lógica para aceptar la asignación
    // Por ahora, redirigir al login
    navigate(`/auth/login?email=${encodeURIComponent(assignmentData.user.email)}&message=assignment`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando asignación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  if (!assignmentData) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nueva Asignación</h1>
          <p className="text-gray-600">Has sido asignado a un nuevo edificio</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Información del Edificio</h3>
          <p><strong>Nombre:</strong> {assignmentData.building.name}</p>
          <p><strong>Dirección:</strong> {assignmentData.building.address}</p>
          <p><strong>Tu rol:</strong> {assignmentData.user.role === 'tecnico' ? 'Técnico' : 'CFO'}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAcceptAssignment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Aceptar Asignación
          </button>
          
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancelar
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Al aceptar, serás redirigido al login para acceder al edificio asignado.
        </p>
      </div>
    </div>
  );
}
