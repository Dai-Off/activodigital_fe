import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchMe } from '../services/auth';

// Mock data para la lista de activos
const assetsData = [
  {
    id: 'ACF456',
    name: 'Hotel RIU PLAZA España',
    location: 'Madrid',
    value: '€45.000.000',
    rating: 5,
    status: 'active'
  },
  {
    id: 'ACF457',
    name: 'Residencias Milenium',
    location: 'Madrid',
    value: '€20.000.000',
    rating: 4,
    status: 'active'
  },
  {
    id: 'ACF458',
    name: 'Torre Empresarial Norte',
    location: 'Barcelona',
    value: '€35.000.000',
    rating: 5,
    status: 'active'
  },
  {
    id: 'ACF459',
    name: 'Complejo Residencial Costa',
    location: 'Valencia',
    value: '€28.000.000',
    rating: 3,
    status: 'active'
  },
  {
    id: 'ACF460',
    name: 'Centro Comercial Plaza',
    location: 'Sevilla',
    value: '€15.000.000',
    rating: 4,
    status: 'active'
  },
  {
    id: 'ACF461',
    name: 'Edificio Corporativo Sur',
    location: 'Málaga',
    value: '€22.000.000',
    rating: 5,
    status: 'active'
  }
];

// Calcular valor total de la cartera
const totalPortfolioValue = assetsData.reduce((total, asset) => {
  const value = parseInt(asset.value.replace(/[€.,]/g, ''));
  return total + value;
}, 0);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getRatingStars = (rating: number) => {
  return '⭐'.repeat(rating);
};

const getRatingGrade = (rating: number) => {
  if (rating >= 5) return 'A';
  if (rating >= 4) return 'B';
  if (rating >= 3) return 'C';
  if (rating >= 2) return 'D';
  return 'E';
};

export default function AssetsList() {
  const [me, setMe] = useState<{ full_name: string; role: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetchMe();
        if (mounted) setMe({ full_name: resp.full_name, role: resp.role });
      } catch {
        // Silencioso: si falla, no bloquea la vista
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cartera de Activos</h1>
            <p className="text-gray-600">Gestiona y monitorea todos tus activos inmobiliarios</p>
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-3">
            <Link
              to="/edificios/crear"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Crear Edificio
            </Link>
            
            <Link
              to="/libro-digital/hub"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Libro Digital (Demo)
            </Link>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mb-8" style={{animation: 'fadeInUp 0.6s ease-out 0.1s both'}}>
          {me ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5.5 20a6.5 6.5 0 0113 0" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Bienvenido</div>
                  <div className="text-base font-semibold text-gray-900 leading-tight">{me.full_name}</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm border border-gray-200 text-gray-700 capitalize bg-gray-50">{me.role}</span>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Portfolio Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8" style={{animation: 'fadeInUp 0.6s ease-out 0.1s both'}}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Valor Total de la Cartera</h2>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPortfolioValue)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total de Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{assetsData.length}</p>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{animation: 'fadeInUp 0.6s ease-out 0.2s both'}}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Listado de Activos</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {assetsData.map((asset, index) => (
              <Link
                key={asset.id}
                to={asset.id === 'ACF456' ? '/dashboard' : '#'}
                className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                  asset.id === 'ACF456' ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
                style={{animation: `fadeInUp 0.6s ease-out ${0.3 + (index * 0.1)}s both`}}
                onClick={(e) => {
                  if (asset.id !== 'ACF456') {
                    e.preventDefault();
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* ID del Activo */}
                    <div className="md:col-span-1">
                      <span className="text-sm font-mono text-gray-500">ID</span>
                      <p className="font-medium text-gray-900">{asset.id}</p>
                    </div>

                    {/* Nombre del Activo */}
                    <div className="md:col-span-1">
                      <span className="text-sm text-gray-500">Nombre</span>
                      <p className="font-medium text-gray-900">{asset.name}</p>
                    </div>

                    {/* Ubicación */}
                    <div className="md:col-span-1">
                      <span className="text-sm text-gray-500">Ubicación</span>
                      <p className="font-medium text-gray-900">{asset.location}</p>
                    </div>

                    {/* Valor */}
                    <div className="md:col-span-1">
                      <span className="text-sm text-gray-500">Valor</span>
                      <p className="font-medium text-gray-900">{asset.value}</p>
                    </div>

                    {/* Rating */}
                    <div className="md:col-span-1">
                      <span className="text-sm text-gray-500">Rating</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{getRatingGrade(asset.rating)}</span>
                        <span className="text-lg">{getRatingStars(asset.rating)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="ml-4">
                    {asset.id === 'ACF456' ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Actualmente solo el Hotel RIU PLAZA España está disponible para acceso detallado. 
                  Los demás activos están en desarrollo.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-green-800">
                  <strong>¡Nuevo!</strong> Ya puedes crear nuevos edificios con el wizard de 3 pasos: 
                  datos generales, ubicación con mapa interactivo y fotos, y resumen final. 
                  Después podrás completar el Libro Digital con 8 secciones especializadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
