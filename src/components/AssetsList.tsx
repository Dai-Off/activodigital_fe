import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  BuildingsApiService,
  formatBuildingValue,
  getBuildingStatusLabel,
  getBuildingTypologyLabel,
  getBuildingStatusColor,
} from '../services/buildingsApi';
import type { Building } from '../services/buildingsApi';
import {
  SkeletonUserProfile,
  SkeletonBuildingList,
  SkeletonPortfolioSummary,
  useLoadingState,
} from './ui/LoadingSystem';

/* -------------------------- Utils de presentación -------------------------- */
function truncateMiddle(str: string, front = 3, back = 2): string {
  if (!str) return '';
  if (str.length <= front + back + 1) return str;
  return `${str.slice(0, front)}…${str.slice(-back)}`;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.preventDefault(); // evita navegar si está dentro de <Link>
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1200);
        } catch {}
      }}
      className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50 hover:border-gray-300"
      title={`Copiar ${label}`}
      aria-label={`Copiar ${label}`}
      onMouseDown={(e) => e.stopPropagation()}
      onClickCapture={(e) => e.stopPropagation()}
    >
      {ok ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
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

/* --------------------------------- Página --------------------------------- */
export default function AssetsList() {
  const { user, isLoading: authLoading, hasPermission } = useAuth();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const { loading, error, startLoading, stopLoading } = useLoadingState(true);

  // paginado (cliente)
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let mounted = true;

    const loadBuildings = async () => {
      if (!user || authLoading) return;

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
                  <div className="text-base font-semibold text-gray-900 leading-tight">{user.fullName}</div>
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
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8" style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {user?.role === 'propietario' ? 'Valor Total de la Cartera' : 'Activos Asignados'}
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  {user?.role === 'propietario'
                    ? formatBuildingValue(buildings.reduce((total, building) => total + (building.price || 0), 0))
                    : buildings.length.toString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{user?.role === 'propietario' ? 'Total de Activos' : 'Para Gestionar'}</p>
                <p className="text-2xl font-semibold text-gray-900">{buildings.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Assets List + Paginación */}
        <div
          className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-full"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          <div className="px-3 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Listado de Activos</h3>
            {/* total compacto */}
            {!loading && (
              <span className="text-xs text-gray-500">
                {total} registro{total === 1 ? '' : 's'}
              </span>
            )}
          </div>

          <div className="divide-y divide-gray-200 max-w-full overflow-x-hidden">
            {loading ? (
              <SkeletonBuildingList />
            ) : paginated.length > 0 ? (
              paginated.map((building, index) => (
                <div key={building.id} className="block px-3 sm:px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer max-w-full overflow-x-hidden" style={{ animation: 'fadeInUp 0.4s ease-out both', animationDelay: `${index * 40}ms` }}>
                  {/* Desktop: Grid layout */}
                  <div className="hidden md:flex items-center justify-between">
                    <div className="flex-1">
                      {/* Grid de columnas estilo tabla */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* ID + copiar: 132…23 */}
                        <div className="col-span-2">
                          <span className="text-[11px] font-medium text-gray-500">ID</span>
                          <div className="mt-0.5 flex items-center gap-2">
                            <code className="font-mono text-gray-900">{truncateMiddle(String(building.id), 3, 2)}</code>
                            <CopyButton value={String(building.id)} label="ID" />
                          </div>
                        </div>

                        {/* Nombre */}
                        <div className="col-span-2">
                          <span className="text-[11px] font-medium text-gray-500">Nombre</span>
                          <p className="mt-0.5 font-medium text-gray-900 truncate">{building.name}</p>
                        </div>

                        {/* Ubicación (una línea + copiar con …) */}
                        <div className="col-span-5">
                          <span className="text-[11px] font-medium text-gray-500">Ubicación</span>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="font-medium text-gray-900 truncate block" title={building.address}>
                              {building.address}
                            </span>
                            <CopyButton value={building.address} label="dirección" />
                          </div>
                        </div>

                        {/* Valor o Tipología */}
                        <div className="col-span-2">
                          <span className="text-[11px] font-medium text-gray-500">
                            {user?.role === 'propietario' ? 'Valor' : 'Tipología'}
                          </span>
                          <p className="mt-0.5 font-medium text-gray-900">
                            {user?.role === 'propietario'
                              ? formatBuildingValue(building.price)
                              : getBuildingTypologyLabel(building.typology)}
                          </p>
                        </div>

                        {/* Estado */}
                        <div className="col-span-1">
                          <span className="text-[11px] font-medium text-gray-500">Estado</span>
                          <div className="mt-0.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBuildingStatusColor(
                                building.status,
                              )}`}
                            >
                              {getBuildingStatusLabel(building.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botón para técnicos: Gestionar Libro Digital */}
                    {user?.role === 'tecnico' && (
                      <Link
                        to={{
                          pathname: `/libro-digital/hub/${building.id}`,
                        }}
                        state={{ buildingId: building.id, buildingName: building.name }}
                        className="ml-4 px-3 py-1 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700"
                      >
                        Gestionar Libro Digital
                      </Link>
                    )}

                    {/* Flecha */}
                    <div className="ml-4 shrink-0">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Mobile: Stack layout */}
                  <div className="md:hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-medium text-gray-900 text-base truncate" title={building.name}>
                          {building.name}
                        </h3>
                      </div>
                      {/* Botón móvil para técnicos */}
                      {user?.role === 'tecnico' && (
                        <Link
                          to={{
                            pathname: `/libro-digital/hub/${building.id}`,
                          }}
                          state={{ buildingId: building.id, buildingName: building.name }}
                          className="px-2 py-1 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                          Libro Digital
                        </Link>
                      )}
                      <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 sm:px-6 py-12 text-center">
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
