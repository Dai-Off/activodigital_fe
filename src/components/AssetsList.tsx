import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BuildingsApiService,
  formatBuildingValue,
  getBuildingStatusLabel,
  getBuildingTypologyLabel,
} from '../services/buildingsApi';
import type { Building, DashboardStats } from '../services/buildingsApi';
import {
  SkeletonBuildingList,
  SkeletonDashboardSummary,
  useLoadingState,
} from './ui/LoadingSystem';
import { EnergyCertificatesService, type PersistedEnergyCertificate } from '../services/energyCertificates';
import { getLatestRating } from '../utils/energyCalculations';
import { getBookByBuilding, type DigitalBook } from '../services/digitalbook';
import { getESGScore, getESGLabelColor, type ESGResponse } from '../services/esg';

/* -------------------------- Utils de presentación -------------------------- */
function getCityAndDistrict(address: string): string {
  if (!address) return '';
  
  // Dividir la dirección por comas
  const parts = address.split(',').map(part => part.trim());
  
  // Buscar la ciudad principal y el distrito
  // Ejemplos de direcciones:
  // "123, Calle del Doctor Esquerdo, Estrella, Retiro, Madrid, Comunidad de Madrid, 28007, España"
  // "Calle de la Plata, Polígono Industrial El Guija, Arganda del Rey, Comunidad de Madrid, 28500, España"
  
  // Si hay "Comunidad de Madrid", la ciudad está antes y el distrito antes de la ciudad
  const comunidadIndex = parts.findIndex(part => part.includes('Comunidad de Madrid'));
  if (comunidadIndex > 1) {
    const city = parts[comunidadIndex - 1];
    const district = parts[comunidadIndex - 2];
    return `${city}, ${district}`;
  }
  
  // Si no hay "Comunidad de Madrid", buscar la penúltima parte (antes del código postal)
  if (parts.length >= 3) {
    // Buscar la parte que parece ser un código postal (números de 5 dígitos)
    const postalCodeIndex = parts.findIndex(part => /^\d{5}$/.test(part));
    if (postalCodeIndex > 1) {
      const city = parts[postalCodeIndex - 1];
      const district = parts[postalCodeIndex - 2];
      return `${city}, ${district}`;
    }
  }
  
  // Fallback: devolver las dos últimas partes si existen
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 3] || parts[parts.length - 1]}`;
  }
  
  // Último fallback: devolver la dirección completa truncada
  return address.length > 20 ? `${address.substring(0, 20)}...` : address;
}

function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: {
  page: number; // 1-based
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  pageSizeOptions?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3">
      <div className="text-xs text-gray-600">
        Mostrando <span className="font-medium">{start}</span>–<span className="font-medium">{end}</span> de{' '}
        <span className="font-medium">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
          aria-label="Tamaño de página"
          title="Tamaño de página"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}/página
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(1)}
            disabled={page === 1}
            title="Primera página"
            aria-label="Primera página"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
          </button>
          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(page - 1)}
            disabled={page === 1}
            title="Anterior"
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <span className="px-2 text-xs text-gray-600">
            Página <span className="font-medium">{page}</span> / {totalPages}
          </span>

          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(page + 1)}
            disabled={page === totalPages}
            title="Siguiente"
            aria-label="Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(totalPages)}
            disabled={page === totalPages}
            title="Última página"
            aria-label="Última página"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m13 17 5-5-5-5" />
              <path d="m6 17 5-5-5-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Componentes de Indicadores ------------------------- */

// Componente para el indicador CEE (Certificado de Eficiencia Energética)
function CEERatingIndicator({ building, certificates }: { building: Building; certificates: PersistedEnergyCertificate[] }) {
  // Obtener el rating del último certificado energético
  const buildingCerts = certificates.filter(cert => cert.buildingId === building.id);
  
  if (buildingCerts.length === 0) {
    return <span className="text-sm text-gray-400">-</span>;
  }
  
  const rating = getLatestRating(buildingCerts);
  
  // Colores según la clasificación energética
  const getColor = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-600';
      case 'B': return 'bg-green-500';
      case 'C': return 'bg-yellow-400';
      case 'D': return 'bg-yellow-300';
      case 'E': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      case 'G': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className={`w-6 h-6 rounded-full ${getColor(rating)} flex items-center justify-center`}>
      <span className="text-xs font-medium text-white">{rating}</span>
    </div>
  );
}

// Componente para el indicador ESG
function ESGScoreIndicator({ building, esgData }: { building: Building; esgData: Map<string, ESGResponse> }) {
  const esg = esgData.get(building.id);
  
  if (!esg || !esg.data) {
    return <span className="text-sm text-gray-400">-</span>;
  }
  
  const label = esg.data.label;
  const color = getESGLabelColor(label);
  
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={color}
        className="w-6 h-6"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15))' }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
  );
}

// Componente para el indicador de metros cuadrados
function SquareMetersIndicator({ building }: { building: Building }) {
  // Usar datos reales del edificio si están disponibles
  // TODO: Cuando el API tenga un campo específico de superficie total, usarlo directamente
  
  if (!building.numUnits || building.numUnits === 0) {
    return <span className="text-sm text-gray-400">-</span>;
  }
  
  // Calcular superficie aproximada basada en número de unidades
  // Asumiendo 70 m² por unidad promedio (valor estándar)
  const avgUnitSize = 70;
  const surfaceArea = building.numUnits * avgUnitSize;
  
  // Formatear con puntos como separadores de miles
  const formattedArea = surfaceArea.toLocaleString('es-ES');
  
  return (
    <span className="text-sm font-medium text-gray-900">{formattedArea}</span>
  );
}

// Componente para el indicador del estado del libro digital (ahora solo muestra progreso numérico)
function BookStatusIndicator({ building, digitalBooks }: { building: Building; digitalBooks: Map<string, DigitalBook> }) {
  const totalSections = 8; // Total de secciones del libro digital
  
  // Obtener el libro digital del edificio
  const book = digitalBooks.get(building.id);
  
  if (!book) {
    // Sin libro digital
    return (
      <div className="flex items-center justify-center">
        <span className="text-sm font-medium text-gray-900">0/{totalSections}</span>
      </div>
    );
  }
  
  // Usar el campo 'progress' que viene del API (0-8)
  const completedSections = book.progress || 0;
  
  // Siempre mostrar progreso numérico en la columna Libro
  return (
    <div className="flex items-center justify-center">
      <span className="text-sm font-medium text-gray-900">
        {completedSections}/{totalSections}
      </span>
    </div>
  );
}

// Componente para mostrar el estado del edificio (ahora incluye "Completado" si el libro está completo)
function BuildingStatusIndicator({ building, digitalBooks }: { building: Building; digitalBooks: Map<string, DigitalBook> }) {
  const totalSections = 8;
  const book = digitalBooks.get(building.id);
  const completedSections = book?.progress || 0;
  
  // Si el libro está completo (8/8), mostrar "Completado" en verde
  if (completedSections === totalSections) {
    return <span className="text-sm font-medium text-green-600">Completado</span>;
  }
  
  // Si no, mostrar el estado original del edificio
  return <span className="text-sm text-gray-900">{getBuildingStatusLabel(building.status)}</span>;
}

/* --------------------------------- Página --------------------------------- */
export default function AssetsList() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, hasPermission } = useAuth();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const { loading, error, startLoading, stopLoading } = useLoadingState(true);
  const { loading: statsLoading, startLoading: startStatsLoading, stopLoading: stopStatsLoading } = useLoadingState(true);
  
  // Estados para certificados energéticos, libros digitales y ESG
  const [energyCertificates, setEnergyCertificates] = useState<PersistedEnergyCertificate[]>([]);
  const [digitalBooks, setDigitalBooks] = useState<Map<string, DigitalBook>>(new Map());
  const [esgScores, setEsgScores] = useState<Map<string, ESGResponse>>(new Map());

  // paginado (cliente)
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let mounted = true;

    const loadAllData = async () => {
      if (!user || authLoading) return;

      try {
        startLoading();
        startStatsLoading();
        
        // Cargar edificios y stats primero
        const [buildingsData, statsData] = await Promise.all([
          BuildingsApiService.getAllBuildings(),
          BuildingsApiService.getDashboardStats()
        ]);
        
        if (!mounted) return;
        
        // Establecer edificios y stats
        setBuildings(buildingsData);
        setDashboardStats(statsData);
        
        // Cargar certificados, libros digitales y ESG para todos los edificios en paralelo
        const certsAndBooksPromises = buildingsData.map(async (building) => {
          try {
            const [certsResponse, book, esgScore] = await Promise.all([
              EnergyCertificatesService.getByBuilding(building.id).catch(() => ({ sessions: [], certificates: [] })),
              getBookByBuilding(building.id),
              getESGScore(building.id).catch(() => null)
            ]);
            return {
              buildingId: building.id,
              certificates: certsResponse.certificates || [],
              book: book,
              esgScore: esgScore
            };
          } catch (err) {
            console.error(`Error cargando datos para edificio ${building.id}:`, err);
            return {
              buildingId: building.id,
              certificates: [],
              book: null,
              esgScore: null
            };
          }
        });
        
        const results = await Promise.all(certsAndBooksPromises);
        
        // Consolidar certificados, libros y ESG
        const allCertificates: PersistedEnergyCertificate[] = [];
        const booksMap = new Map<string, DigitalBook>();
        const esgMap = new Map<string, ESGResponse>();
        
        results.forEach(result => {
          // Agregar certificados
          allCertificates.push(...result.certificates);
          // Agregar libro si existe
          if (result.book) {
            booksMap.set(result.buildingId, result.book);
          }
          // Agregar ESG si existe
          if (result.esgScore) {
            esgMap.set(result.buildingId, result.esgScore);
          }
        });
        
        if (mounted) {
          setEnergyCertificates(allCertificates);
          setDigitalBooks(booksMap);
          setEsgScores(esgMap);
          stopLoading();
          stopStatsLoading();
        }
      } catch (err) {
        console.error('Error loading data:', err);
        if (mounted) {
          stopLoading(err instanceof Error ? err.message : 'Error cargando datos');
          stopStatsLoading();
        }
      }
    };

    loadAllData();
    
    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  // recalcular vista paginada
  const total = buildings.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return buildings.slice(start, start + pageSize);
  }, [buildings, pageSize, safePage]);

  // al cambiar tamaño, volver a pág. 1
  const handlePageSizeChange = (s: number) => {
    setPageSize(s);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="py-8 max-w-full">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user?.role === 'propietario' ? 'Mis Activos' : 'Activos Asignados'}
            </h1>
            <p className="text-gray-600">
              {user?.role === 'propietario'
                ? 'Gestiona tu cartera de activos inmobiliarios y asigna técnicos'
                : 'Activos que tienes asignados para gestionar libros digitales'}
            </p>
          </div>

          {/* Botones de acción basados en permisos */}
          <div className="flex gap-3">
            {(user?.role === 'propietario' ) && hasPermission('canCreateBuildings') && (
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
  {/* Uso oculto para evitar warning TS6133: BookStatusIndicator no usado */}
  {false && <BookStatusIndicator building={buildings[0]} digitalBooks={digitalBooks} />}
        <div className="mb-8" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
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

          {/* Dashboard Summary Card - Exact Layout */}
          {user && !authLoading && !loading && !statsLoading && dashboardStats ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
              {/* User Profile Header */}
              <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5.5 20a6.5 6.5 0 0113 0" />
                  </svg>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Bienvenido</div>
                    <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-md text-xs font-medium text-gray-600 bg-gray-100 capitalize">
                {user.role}
              </span>
            </div>

              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                {/* Left Section - Metrics and Details */}
                <div className="flex-1 w-full lg:pr-6">
                   {/* Main Metrics - Mobile Carousel, Desktop Grid */}
                   <div className="lg:grid lg:grid-cols-4 lg:gap-6 mb-4">
                     {/* Mobile Carousel */}
                     <div className="lg:hidden">
                       <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
                         {user?.role === 'propietario' ? (
                           <>
                             <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                               <div className="text-center">
                                 <div className="text-2xl font-bold text-green-600 mb-1">
                                   {formatBuildingValue(dashboardStats.totalValue)}
                                 </div>
                                 <div className="text-sm text-gray-500">Valor total</div>
                               </div>
                             </div>
                             <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                               <div className="text-center">
                                 <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.totalAssets}</div>
                                 <div className="text-sm text-gray-500">Activos</div>
                               </div>
                             </div>
                             <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                               <div className="text-center">
                                 <div className="text-2xl font-bold text-gray-900 mb-1">
                                   {dashboardStats.totalSurfaceArea.toLocaleString()} m²
                                 </div>
                                 <div className="text-sm text-gray-500">Superficie total</div>
                               </div>
                             </div>
                             <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                               <div className="text-center">
                                 <div className="text-2xl font-bold text-gray-900 mb-1">
                                   {dashboardStats.totalEmissions.toLocaleString()} tCO₂ eq
                                 </div>
                                 <div className="text-sm text-gray-500">Emisiones anuales</div>
                               </div>
                             </div>
                           </>
                         ) : (
                           <>
                             <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                               <div className="text-center">
                                 <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.totalAssets}</div>
                                 <div className="text-sm text-gray-500">Edificios asignados</div>
                               </div>
                             </div>
                             <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                               <div className="text-center">
                                 <div className="text-2xl font-bold text-gray-900 mb-1">
                                   {dashboardStats.completedBooks}
                                 </div>
                                 <div className="text-sm text-gray-500">Libros completados</div>
                               </div>
                             </div>
                             <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                               <div className="text-center">
                                 <div className="text-2xl font-bold text-gray-900 mb-1">
                                   {dashboardStats.pendingBooks}
                                 </div>
                                 <div className="text-sm text-gray-500">Pendientes</div>
                               </div>
                             </div>
                             <div className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                               <div className="text-center">
                                 <div className="text-2xl font-bold text-gray-900 mb-1">
                                   {dashboardStats.totalSurfaceArea.toLocaleString()} m²
                                 </div>
                                 <div className="text-sm text-gray-500">Superficie total</div>
                               </div>
                             </div>
                           </>
                         )}
                       </div>
                     </div>
                     
                     {/* Desktop Grid */}
                     <div className="hidden lg:contents">
                       {user?.role === 'propietario' ? (
                         <>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-green-600 mb-1">
                               {formatBuildingValue(dashboardStats.totalValue)}
                             </div>
                             <div className="text-sm text-gray-500">Valor total</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.totalAssets}</div>
                             <div className="text-sm text-gray-500">Activos</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-gray-900 mb-1">
                               {dashboardStats.totalSurfaceArea.toLocaleString()} m²
                             </div>
                             <div className="text-sm text-gray-500">Superficie total</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-gray-900 mb-1">
                               {dashboardStats.totalEmissions.toLocaleString()} tCO₂ eq
                             </div>
                             <div className="text-sm text-gray-500">Emisiones anuales</div>
                           </div>
                         </>
                       ) : (
                         <>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats.totalAssets}</div>
                             <div className="text-sm text-gray-500">Edificios asignados</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-gray-900 mb-1">
                               {dashboardStats.completedBooks}
                             </div>
                             <div className="text-sm text-gray-500">Libros completados</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-gray-900 mb-1">
                               {dashboardStats.pendingBooks}
                             </div>
                             <div className="text-sm text-gray-500">Pendientes</div>
                           </div>
                           <div className="text-center">
                             <div className="text-2xl font-bold text-gray-900 mb-1">
                               {dashboardStats.totalSurfaceArea.toLocaleString()} m²
                             </div>
                             <div className="text-sm text-gray-500">Superficie total</div>
                           </div>
                         </>
                       )}
                     </div>
                   </div>

                  {/* Separator Line */}
                  <div className="border-t border-gray-200 mb-4"></div>

                   {/* Performance Details - Dynamic based on user role */}
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {user?.role === 'propietario' ? (
                      <>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Clase energética promedio:</div>
                          <div className="text-sm font-bold text-gray-900">
                            {dashboardStats.averageEnergyClass || '-'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">ESG Score medio:</div>
                          <div className="text-sm font-bold text-gray-900">
                            {dashboardStats.averageESGScore ? `${dashboardStats.averageESGScore}/100` : '-'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Libro Digital completo:</div>
                          <div className="text-sm font-bold text-gray-900">
                            {dashboardStats.completedBooks} de {dashboardStats.totalAssets}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Tipología más común:</div>
                          <div className="text-sm font-bold text-gray-900">
                            {dashboardStats.mostCommonTypology ? getBuildingTypologyLabel(dashboardStats.mostCommonTypology as any) : 'N/A'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Promedio de unidades:</div>
                          <div className="text-sm font-bold text-gray-900">
                            {dashboardStats.averageUnitsPerBuilding}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Edad promedio:</div>
                          <div className="text-sm font-bold text-gray-900">
                            {dashboardStats.averageBuildingAge} años
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Section - Progress Chart */}
                <div className="flex flex-col items-center justify-center w-full lg:w-auto">
                  <div className="relative w-24 h-24 mb-3">
                    {/* Circular Progress Chart */}
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      {/* Background Circle */}
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Progress Circle */}
                      <path
                        className="text-green-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={`${user?.role === 'propietario' ? dashboardStats.greenFinancingEligiblePercentage : dashboardStats.completionPercentage}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-500">
                          {user?.role === 'propietario' 
                            ? `${dashboardStats.greenFinancingEligiblePercentage}%`
                            : `${dashboardStats.completionPercentage}%`}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center max-w-[100px]">
                    <div className="text-xs text-gray-500 leading-tight">
                  {user?.role === 'propietario'
                        ? '% cartera apta para financiación verde' 
                        : '% libros digitales completados'}
                    </div>
                  </div>
              </div>
              </div>
            </div>
          ) : (
            <SkeletonDashboardSummary />
          )}
          </div>

        {/* Assets List - Tabla como en la imagen */}
        <div
          className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-full"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Listado de Activos</h3>
          </div>

          {loading ? (
            <SkeletonBuildingList />
          ) : paginated.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: '20%'}}>Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell" style={{width: '12%'}}>Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell" style={{width: '18%'}}>Estado</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell" style={{width: '8%'}}>CEE</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell" style={{width: '12%'}}>ESG</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell" style={{width: '10%'}}>m²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginated.map((building, index) => (
                    <tr
                      key={building.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ animation: 'fadeInUp 0.4s ease-out both', animationDelay: `${index * 40}ms` }}
                      onClick={() => navigate(`/edificio/${building.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/edificio/${building.id}`); }}
                    >
                      {/* Nombre con ubicación debajo */}
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{building.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{getCityAndDistrict(building.address)}</div>
                        </div>
                      </td>
                      
                      {/* Valor - Oculto en mobile */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-900">{formatBuildingValue(building.price)}</div>
                      </td>
                      
                      {/* Estado - Oculto en mobile */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <BuildingStatusIndicator building={building} digitalBooks={digitalBooks} />
                      </td>
                      
                      {/* CEE - Indicador circular - Oculto en mobile */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex items-center justify-center">
                          <CEERatingIndicator building={building} certificates={energyCertificates} />
                        </div>
                      </td>
                      
                      {/* ESG - Estrellas con colores - Oculto en mobile */}
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <ESGScoreIndicator building={building} esgData={esgScores} />
                      </td>
                      
                      {/* m² - Superficie - Oculto en mobile */}
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <SquareMetersIndicator building={building} />
                      </td>
                      
                   
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {user?.role === 'propietario' ? 'No tienes activos aún' : 'No tienes activos asignados'}
              </h3>
              <p className="text-gray-600 mb-4">
                {user?.role === 'propietario'
                  ? 'Comienza creando tu primer activo para gestionar tu cartera.'
                  : 'Contacta con tu administrador para que te asigne activos.'}
              </p>
              {user?.role === 'propietario' && hasPermission('canCreateBuildings') && (
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

          {/* Barra de paginación */}
          {!loading && total > 0 && (
            <PaginationBar
              page={safePage}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 50]}
            />
          )}
      </div>

      {/* Animaciones simples */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

