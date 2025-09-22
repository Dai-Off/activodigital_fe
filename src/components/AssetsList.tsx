import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BuildingsApiService, formatBuildingValue, getBuildingStatusLabel, getBuildingTypologyLabel, getBuildingStatusColor } from '../services/buildingsApi';
import type { Building } from '../services/buildingsApi';
import { SkeletonUserProfile, SkeletonBuildingList, SkeletonPortfolioSummary, useLoadingState } from './ui/LoadingSystem';


export default function AssetsList() {
  const { user, isLoading: authLoading, hasPermission } = useAuth();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const { loading, error, startLoading, stopLoading } = useLoadingState(true);

  useEffect(() => {
    let mounted = true;
    
    const loadBuildings = async () => {
      if (!user || authLoading) {
        return;
      }

      try {
        startLoading();
        
        const buildingsData = await BuildingsApiService.getAllBuildings();
        
        if (mounted) {
          setBuildings(buildingsData);
          stopLoading();
        }
      } catch (err) {
        console.error('Error fetching buildings:', err);
        if (mounted) {
          stopLoading(err instanceof Error ? err.message : 'Error cargando edificios');
        }
      }
    };

    loadBuildings();
    return () => { mounted = false };
  }, [user, authLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.role === 'tenedor' ? 'Mis Activos' : 'Activos Asignados'}
            </h1>
            <p className="text-gray-600">
              {user?.role === 'tenedor' 
                ? 'Gestiona tu cartera de activos inmobiliarios y asigna técnicos'
                : 'Activos que tienes asignados para gestionar libros digitales'
              }
            </p>
          </div>
          
          {/* Botones de acción basados en permisos */}
          <div className="flex gap-3">
            {hasPermission('canCreateBuildings') && (
              <Link
                to="/edificios/crear"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Crear Edificio
              </Link>
            )}
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mb-8" style={{animation: 'fadeInUp 0.6s ease-out 0.1s both'}}>
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-yellow-800">
                  No se pudieron cargar los datos del usuario, pero puedes continuar navegando.
                </p>
              </div>
            </div>
          )}
          
          {user && !authLoading ? (
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
                  <div className="text-base font-semibold text-gray-900 leading-tight">
                    {user.fullName}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm border border-gray-200 text-gray-700 capitalize bg-gray-50">
                {user.role}
              </span>
            </div>
          ) : (
            <SkeletonUserProfile />
          )}
        </div>

        {/* Portfolio Summary */}
        {loading ? (
          <SkeletonPortfolioSummary />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8" style={{animation: 'fadeInUp 0.6s ease-out 0.1s both'}}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {user?.role === 'tenedor' ? 'Valor Total de la Cartera' : 'Activos Asignados'}
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  {user?.role === 'tenedor' 
                    ? formatBuildingValue(buildings.reduce((total, building) => total + (building.price || 0), 0))
                    : buildings.length.toString()
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {user?.role === 'tenedor' ? 'Total de Activos' : 'Para Gestionar'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">{buildings.length}</p>
              </div>
            </div>
            
          </div>
        )}

        {/* Assets List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{animation: 'fadeInUp 0.6s ease-out 0.2s both'}}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Listado de Activos</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              <SkeletonBuildingList />
            ) : buildings.length > 0 ? (
              buildings.map((building, index) => (
                <Link
                  key={building.id}
                  to={`/edificio/${building.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer fade-in-content"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        {/* ID del Edificio */}
                        <div className="md:col-span-1">
                          <span className="text-sm font-mono text-gray-500">ID</span>
                          <p className="font-medium text-gray-900">{building.id.slice(0, 8)}...</p>
                        </div>

                        {/* Nombre del Edificio */}
                        <div className="md:col-span-1">
                          <span className="text-sm text-gray-500">Nombre</span>
                          <p className="font-medium text-gray-900">{building.name}</p>
                        </div>

                        {/* Ubicación */}
                        <div className="md:col-span-1">
                          <span className="text-sm text-gray-500">Ubicación</span>
                          <p className="font-medium text-gray-900">{building.address}</p>
                        </div>

                        {/* Valor o Tipología */}
                        <div className="md:col-span-1">
                          <span className="text-sm text-gray-500">
                            {user?.role === 'tenedor' ? 'Valor' : 'Tipología'}
                          </span>
                          <p className="font-medium text-gray-900">
                            {user?.role === 'tenedor' 
                              ? formatBuildingValue(building.price)
                              : getBuildingTypologyLabel(building.typology)
                            }
                          </p>
                        </div>

                        {/* Estado */}
                        <div className="md:col-span-1">
                          <span className="text-sm text-gray-500">Estado</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBuildingStatusColor(building.status)}`}>
                            {getBuildingStatusLabel(building.status)}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Arrow Icon */}
                    <div className="ml-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Estado vacío - aquí podríamos usar el componente reutilizable que mencionaste
              <div className="px-6 py-12 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {user?.role === 'tenedor' ? 'No tienes activos aún' : 'No tienes activos asignados'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {user?.role === 'tenedor' 
                    ? 'Comienza creando tu primer activo para gestionar tu cartera.'
                    : 'Contacta con tu administrador para que te asigne activos.'
                  }
                </p>
                {hasPermission('canCreateBuildings') && (
                  <Link
                    to="/edificios/crear"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Crear primer activo
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
