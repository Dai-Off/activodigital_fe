import React from 'react';

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
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#fdfdfd' }}>
    <div className="text-center">
      <AppSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  </div>
);

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
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className={`px-6 py-4 stagger-animation`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="h-4 w-20 ml-auto bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-16 ml-auto rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    ))}
  </div>
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


// Skeleton para botones
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
