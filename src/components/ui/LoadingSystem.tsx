import React from 'react';
import { useTranslation } from 'react-i18next';

// Duración estándar para todas las animaciones de carga
export const LOADING_DURATION = {
  FAST: 800,    // Para cambios rápidos (botones, forms)
  NORMAL: 1200, // Para cargas normales (listas, contenido)
  SLOW: 2000    // Para cargas pesadas (mapas, gráficos)
} as const;

// Spinner principal de la aplicación con animación profesional
export const AppSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="professional-spinner w-full h-full"></div>
    </div>
  );
};

// Loading overlay para páginas completas
export const PageLoader: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation();
  const msg = message || t('loading', 'Cargando...');
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ backgroundColor: '#fdfdfd' }}>
      <div className="text-center">
        <AppSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 text-sm font-medium">{msg}</p>
      </div>
    </div>
  );
};

// Skeleton base con animación profesional
export const SkeletonBase: React.FC<{
  className?: string;
  children?: React.ReactNode;
  animate?: boolean;
  shimmer?: boolean;
}> = ({
  className = '',
  children,
  animate = true,
  shimmer = false
}) => (
    <div
      className={`
      skeleton-element
      ${shimmer ? 'skeleton-shimmer' : 'rounded-md'}
      ${animate && !shimmer ? 'animate-pulse' : ''} 
      ${className}
    `}
      style={{
        backgroundColor: !shimmer ? '#fafafa' : undefined,
        animationDuration: animate ? '2.5s' : undefined,
        animationTimingFunction: animate ? 'cubic-bezier(0.4, 0, 0.6, 1)' : undefined,
        animationIterationCount: animate ? 'infinite' : undefined
      }}
    >
      {children}
    </div>
  );

// Skeleton para texto
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  widths?: string[];
}> = ({
  lines = 1,
  className = '',
  widths = ['w-full']
}) => (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => {
        const width = widths[index % widths.length];
        return (
          <SkeletonBase
            key={index}
            className={`h-4 ${width}`}
          />
        );
      })}
    </div>
  );

// LightSkeleton: variant with a lighter palette (used across skeletons)
// Duplicate LightSkeleton removed (already declared above).

// Skeleton para tarjetas con shimmer
export const SkeletonCard: React.FC<{ className?: string; shimmer?: boolean }> = ({
  className = '',
  shimmer = true
}) => (
  <div className={`skeleton-card ${className}`}>
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBase className="h-6 w-32" shimmer={shimmer} />
        <SkeletonBase className="h-4 w-4 rounded-full" shimmer={shimmer} />
      </div>
      <SkeletonText lines={3} widths={['w-full', 'w-3/4', 'w-1/2']} className="mb-4" />
      <SkeletonBase className="h-10 w-full rounded-lg" shimmer={shimmer} />
    </div>
  </div>
);

// Skeleton para lista de edificios con animación escalonada
export const SkeletonBuildingList: React.FC = () => (
  <div className="divide-y divide-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="px-3 sm:px-6 py-4">
        {/* Desktop: Grid layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex-1">
            <div className="grid grid-cols-5 gap-4 items-center">
              <div>
                <div className="h-[11px] w-4 bg-gray-200 rounded animate-pulse mb-0.5" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div>
                <div className="h-[11px] w-12 bg-gray-200 rounded animate-pulse mb-0.5" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-[11px] w-16 bg-gray-200 rounded animate-pulse mb-0.5" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div>
                <div className="h-[11px] w-12 bg-gray-200 rounded animate-pulse mb-0.5" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-[11px] w-10 bg-gray-200 rounded animate-pulse mb-0.5" />
                <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="ml-4 shrink-0">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Mobile: Stack layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Componente que simula una sola fila de la tabla de oportunidades
export const SkeletonOpportunityRow: React.FC = () => (
  <tr className="border-b border-gray-100 animate-pulse">
    {/* 1. Activo (Imagen + Nombre + Dirección) */}
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gray-300 flex-shrink-0"></div>
        <div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
          <div className="h-3 w-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    </td>

    {/* 2. Tipo */}
    <td className="px-4 py-3">
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
    </td>

    {/* 3. Estado Actual (Etiqueta de color) */}
    <td className="px-4 py-3 text-center">
      <div className="h-5 w-8 bg-gray-300 rounded mx-auto"></div>
    </td>

    {/* 4. Potencial (Etiqueta + Variación %) */}
    <td className="px-4 py-3 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="h-5 w-8 bg-gray-300 rounded"></div>
        <div className="h-3 w-8 bg-gray-200 rounded"></div>
      </div>
    </td>

    {/* 5. TIR */}
    <td className="px-4 py-3 text-right">
      <div className="h-4 w-12 bg-gray-300 rounded ml-auto mb-1"></div>
      <div className="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
    </td>

    {/* 6. Cash on Cash */}
    <td className="px-4 py-3 text-right">
      <div className="h-4 w-16 bg-gray-300 rounded ml-auto mb-1"></div>
      <div className="h-3 w-20 bg-gray-200 rounded ml-auto"></div>
    </td>

    {/* 7. CAPEX */}
    <td className="px-4 py-3 text-right">
      <div className="h-4 w-20 bg-gray-300 rounded ml-auto mb-1"></div>
      <div className="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
    </td>

    {/* 8. Subvención */}
    <td className="px-4 py-3 text-right">
      <div className="h-4 w-16 bg-gray-300 rounded ml-auto mb-1"></div>
      <div className="h-3 w-16 bg-gray-200 rounded ml-auto"></div>
    </td>

    {/* 9. Green Premium */}
    <td className="px-4 py-3 text-right">
      <div className="h-4 w-20 bg-gray-300 rounded ml-auto mb-1"></div>
      <div className="h-3 w-12 bg-gray-200 rounded ml-auto"></div>
    </td>

    {/* 10. Plazo */}
    <td className="px-4 py-3 text-center">
      <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
    </td>

    {/* 11. Taxonomía (Porcentaje + Barra) */}
    <td className="px-4 py-3 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="h-4 w-8 bg-gray-300 rounded"></div>
        <div className="w-16 bg-gray-200 rounded-full h-1">
          <div className="h-1 rounded-full w-10 bg-gray-300"></div>
        </div>
      </div>
    </td>

    {/* 12. Estado (Bank-Ready / Pendientes) */}
    <td className="px-4 py-3 text-center">
      <div className="flex flex-col items-center gap-1">
        <div className="h-5 w-20 bg-gray-300 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

// Componente que simula la carga de las 4 tarjetas de resumen
export const SkeletonCardsHeader: React.FC = () => (
  <>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative animate-pulse">
        {/* Botón de ayuda */}
        <div className="absolute top-2 right-2 p-1 w-5 h-5 rounded-full bg-gray-300"></div>

        {/* Etiqueta (Total Activos, CAPEX Total, etc.) */}
        <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>

        {/* Valor Principal (2xl) */}
        <div className="h-7 w-2/3 bg-gray-300 rounded mb-1"></div>

        {/* Etiqueta Secundaria (xs) */}
        <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
      </div>
    ))}
  </>
);

// Componente que simula el <tbody> con N filas de oportunidades
export const SkeletonOpportunityTableBody: React.FC<{ rows: number }> = ({ rows }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonOpportunityRow key={i} />
    ))}
  </tbody>
);

// Skeleton para perfil de usuario con shimmer
export const SkeletonUserProfile: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between loading-transition">
    <div className="flex items-center gap-3">
      <SkeletonBase className="w-10 h-10 rounded-full" shimmer />
      <div className="space-y-2">
        <SkeletonBase className="h-4 w-24" shimmer />
        <SkeletonBase className="h-3 w-16" shimmer />
      </div>
    </div>
    <SkeletonBase className="h-8 w-8 rounded-lg" shimmer />
  </div>
);

// Skeleton para resumen de cartera
export const SkeletonPortfolioSummary: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="text-right">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1 ml-auto" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
      </div>
    </div>
  </div>
);

// Skeleton para Dashboard Summary Card
export const SkeletonDashboardSummary: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
    {/* User Profile Header Skeleton */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        <div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
    </div>

    <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
      {/* Left Section - Metrics and Details */}
      <div className="flex-1 w-full lg:pr-6">
        {/* Main Metrics Skeleton - Mobile Carousel, Desktop Grid */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-6 mb-4">
          {/* Mobile Carousel Skeleton */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-200 snap-start shadow-sm">
                  <div className="text-center">
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-1 mx-auto" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid Skeleton */}
          <div className="hidden lg:contents">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1 mx-auto" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-200 mb-4"></div>

        {/* Performance Details Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1 mx-auto" />
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Progress Chart Skeleton */}
      <div className="flex flex-col items-center justify-center w-full lg:w-auto">
        <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mb-3" />
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);


// Skeleton para botones
// Skeleton para lista de edificios en el sidebar
export const SkeletonSidebarBuildings: React.FC = () => (
  <div className="space-y-1.5 px-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="mb-1">
        {/* Skeleton del botón del edificio - debe coincidir con el diseño real */}
        <div className="w-full px-3 py-3 rounded-md flex items-center gap-2.5 text-sm bg-gray-50 animate-pulse">
          <div className="w-3.5 h-3.5 bg-gray-300 rounded flex-shrink-0" style={{ animationDelay: `${index * 80}ms` }} />
          <div className="w-4 h-4 bg-gray-300 rounded flex-shrink-0" style={{ animationDelay: `${index * 80 + 20}ms` }} />
          <div className="flex-1 h-4 bg-gray-300 rounded" style={{ animationDelay: `${index * 80 + 40}ms` }} />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonButton: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  size = 'md',
  className = ''
}) => {
    const sizeClasses = {
      sm: 'h-8 w-20',
      md: 'h-10 w-24',
      lg: 'h-12 w-32'
    };

    return (
      <SkeletonBase
        className={`${sizeClasses[size]} rounded-lg ${className}`}
      />
    );
  };

// Loading state para formularios
export const FormLoader: React.FC<{ message?: string }> = ({ message = 'Procesando...' }) => (
  <div className="flex items-center justify-center gap-3 py-2">
    <AppSpinner size="sm" />
    <span className="text-sm text-gray-600">{message}</span>
  </div>
);

// Hook para manejar estados de carga consistentes
export const useLoadingState = (initialLoading = false) => {
  const [loading, setLoading] = React.useState(initialLoading);
  const [error, setError] = React.useState<string | null>(null);

  const startLoading = React.useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback((errorMessage?: string) => {
    setLoading(false);
    if (errorMessage) {
      setError(errorMessage);
    }
  }, []);

  const reset = React.useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    reset
  };
};

export const LightSkeleton: React.FC<{
  className?: string;
  children?: React.ReactNode;
  animate?: boolean;
  shimmer?: boolean;
}> = ({
  className = '',
  children,
  animate = true,
  shimmer = false
}) => (
    <div
      className={` 
      skeleton-element
      ${shimmer ? 'skeleton-shimmer' : 'rounded-md'}
      ${animate && !shimmer ? 'animate-pulse' : ''} 
      ${className}
    `}
      style={{
        backgroundColor: !shimmer ? '#fafafa' : undefined,
        animationDuration: animate ? '2.5s' : undefined,
        animationTimingFunction: animate ? 'cubic-bezier(0.4, 0, 0.6, 1)' : undefined,
        animationIterationCount: animate ? 'infinite' : undefined
      }}
    >
      {children}
    </div>
  );

// skeleton para lista de usuarios
export const SkeletonUsers: React.FC = () => (
  <div className="space-y-4">
    {/* Header skeleton */}
    <div className="bg-gray-50 rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
          <div className="flex flex-col">
            <div className="h-5 w-48 mb-2 rounded bg-gray-300 animate-pulse" />
            <div className="h-3 w-32 rounded bg-gray-300 animate-pulse" />
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="h-10 w-36 rounded-xl bg-gray-300 animate-pulse" />
        </div>
      </div>
    </div>

    {/* Search + filters skeleton */}
    <div className="bg-gray-50 p-4 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 min-w-0 flex items-center border border-gray-300 rounded-xl px-4 py-2 shadow-sm">
          <div className="w-5 h-5 mr-2 rounded bg-gray-300 animate-pulse" />
          <div className="h-4 w-full rounded bg-gray-300 animate-pulse" />
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto justify-between sm:justify-start flex-wrap">
          <div className="h-10 w-28 rounded-xl bg-gray-300 animate-pulse" />
          <div className="h-10 w-20 rounded-xl bg-gray-300 animate-pulse" />
          <div className="h-10 w-16 rounded-xl bg-gray-300 animate-pulse" />
        </div>
      </div>
    </div>

    {/* Table skeleton */}
    <div className="bg-gray-50 rounded-xl shadow-md border border-gray-100 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b text-left text-gray-600 uppercase tracking-wider">
            <th className="p-4 font-semibold"><div className="h-4 w-24 rounded bg-gray-300 animate-pulse" /></th>
            <th className="p-4 font-semibold"><div className="h-4 w-20 rounded bg-gray-300 animate-pulse" /></th>
            <th className="p-4 font-semibold"><div className="h-4 w-32 rounded bg-gray-300 animate-pulse" /></th>
            <th className="p-4 font-semibold"><div className="h-4 w-20 rounded bg-gray-300 animate-pulse" /></th>
            <th className="p-4 font-semibold"><div className="h-4 w-24 rounded bg-gray-300 animate-pulse" /></th>
            <th className="p-4 font-semibold text-center"><div className="h-4 w-20 rounded bg-gray-300 animate-pulse" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 mb-2 rounded bg-gray-300 animate-pulse" />
                  <div className="h-3 w-20 rounded bg-gray-300 animate-pulse" />
                </div>
              </td>
              <td className="p-4">
                <div className="h-4 w-20 rounded bg-gray-300 animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-48 rounded bg-gray-300 animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-24 rounded bg-gray-300 animate-pulse" />
              </td>
              <td className="p-4">
                <div className="h-4 w-28 rounded bg-gray-300 animate-pulse" />
              </td>
              <td className="p-4 text-center">
                <div className="h-8 w-16 rounded-lg bg-gray-300 animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);