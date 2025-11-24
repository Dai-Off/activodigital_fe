// Skeleton para Panel Principal
export function MainPanelLoading() {
  return (
    <div className="space-y-6">
      {/* 4 KPIs superiores */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-3 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-7 w-12 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="p-2 bg-gray-100 rounded-lg w-9 h-9 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Bloque KPIs inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Columna izquierda (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Alertas Urgentes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="p-3 space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-100 rounded">
                  <div className="p-1.5 bg-gray-200 rounded w-6 h-6 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-gray-200 rounded mb-1 animate-pulse" />
                    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Rendimiento por Edificio */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="p-3 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full animate-pulse" style={{ width: `${60 + i * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha (1/3) */}
        <div className="flex flex-col gap-3">
          {/* Resumen del Sistema */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-3">
            <div className="h-4 w-32 bg-blue-400/50 rounded mb-3 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between pb-2 border-b border-blue-400/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-blue-400/50 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-blue-400/50 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-8 bg-blue-400/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="p-3 flex-1 overflow-auto">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200 mt-1.5 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-3 w-32 bg-gray-200 rounded mb-1 animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="p-3 space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full flex items-center justify-between p-2 rounded border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para Estadísticas
export function StatisticsLoading() {
  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 flex items-center gap-2">
        <div className="p-2 bg-gray-100 rounded-lg w-9 h-9 animate-pulse" />
        <div>
          <div className="h-5 w-40 bg-gray-200 rounded mb-1 animate-pulse" />
          <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* 4 KPIs con gradientes */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg">
            <div className="w-5 h-5 bg-white/30 rounded mb-2 animate-pulse" />
            <div className="h-3 w-20 bg-white/30 rounded mb-1 animate-pulse" />
            <div className="h-7 w-12 bg-white/30 rounded mb-1 animate-pulse" />
            <div className="h-3 w-24 bg-white/30 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Distribución por Tipo */}
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="h-4 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-24">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gray-300 h-4 rounded-full animate-pulse" style={{ width: `${20 + i * 15}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas Clave */}
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="h-4 w-28 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-2 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de 3 columnas */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="h-7 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton para Actividad Reciente
export function RecentActivityLoading() {
  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 flex items-center gap-2">
        <div className="p-2 bg-gray-100 rounded-lg w-9 h-9 animate-pulse" />
        <div>
          <div className="h-5 w-48 bg-gray-200 rounded mb-1 animate-pulse" />
          <div className="h-3 w-56 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-start gap-2 p-2 border border-gray-200 rounded">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-3 w-40 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-1 animate-pulse" />
                <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="p-2 bg-gray-100 rounded w-8 h-8 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mantener compatibilidad con el nombre anterior
export function DashboardLoading() {
  return <MainPanelLoading />;
}
