// Skeleton para Panel Principal
export function MainPanelLoading() {
  return (
    <div className="space-y-6">
      {/* 4 KPIs superiores */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
          >
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
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 bg-gray-50 border border-gray-100 rounded"
                >
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
                    <div
                      className="bg-gray-300 h-2 rounded-full animate-pulse"
                      style={{ width: `${60 + i * 10}%` }}
                    />
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
                <div
                  key={i}
                  className="flex items-center justify-between pb-2 border-b border-blue-400/30"
                >
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
                <div
                  key={i}
                  className="w-full flex items-center justify-between p-2 rounded border border-gray-200"
                >
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
          <div
            key={i}
            className="p-3 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg"
          >
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
                    <div
                      className="bg-gray-300 h-4 rounded-full animate-pulse"
                      style={{ width: `${20 + i * 15}%` }}
                    />
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
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
          >
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
            <div
              key={i}
              className="flex items-start gap-2 p-2 border border-gray-200 rounded"
            >
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
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-3 border border-gray-100"
          >
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

// Skeleton para certificados del edificio
export function BuildingCertificatesLoading() {
  return (
    <div className="flex-1 overflow-hidden mt-2">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-2">
            {/* Encabezado y Botón de Carga */}
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  {/* Título */}
                  <div className="h-4 w-40 bg-gray-200 rounded mb-1 animate-pulse" />
                  {/* Subtítulo (Nombre del edificio) */}
                  <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
                {/* Botón de Carga */}
                <div className="h-8 w-40 bg-blue-100 rounded-md animate-pulse" />
              </div>
            </div>

            {/* Tabla de Certificados */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                data-slot="table-container"
                className="relative w-full overflow-x-auto"
              >
                <table
                  data-slot="table"
                  className="w-full caption-bottom text-sm"
                >
                  <thead
                    data-slot="table-header"
                    className="[&amp;_tr]:border-b border-gray-200"
                  >
                    {/* Fila de Encabezados (Sustituimos el texto por placeholders) */}
                    <tr
                      data-slot="table-row"
                      className="border-b border-gray-200"
                    >
                      <th className="h-10 px-2 py-2 w-1/12">
                        <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                      </th>
                      <th className="h-10 px-2 py-2 w-2/12">
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      </th>
                      <th className="h-10 px-2 py-2 w-3/12">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                      </th>
                      <th className="h-10 px-2 py-2 w-2/12">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      </th>
                      <th className="h-10 px-2 py-2 w-2/12">
                        <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                      </th>
                      <th className="h-10 px-2 py-2 w-2/12">
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    data-slot="table-body"
                    className="[&amp;_tr:last-child]:border-0"
                  >
                    {/* Filas de Datos (Certificado Energético e Inspección Técnica) */}
                    {[1, 2].map((i) => (
                      <tr
                        key={i}
                        data-slot="table-row"
                        className="border-b border-gray-100 text-xs"
                      >
                        {/* Tipo */}
                        <td className="p-2 py-3 w-1/12">
                          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                        </td>
                        {/* Calificación */}
                        <td className="p-2 py-3 w-2/12">
                          <div className="w-7 h-7 bg-gray-200 rounded animate-pulse" />
                        </td>
                        {/* Emisiones */}
                        <td className="p-2 py-3 w-3/12">
                          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                        </td>
                        {/* Emisión */}
                        <td className="p-2 py-3 w-2/12">
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                        </td>
                        {/* Vencimiento */}
                        <td className="p-2 py-3 w-2/12">
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                        </td>
                        {/* Estado */}
                        <td className="p-2 py-3 w-2/12">
                          <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bloque de Análisis IA */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  {/* Icono */}
                  <div className="p-1.5 bg-purple-200 rounded w-7 h-7 animate-pulse" />
                  <div className="flex-1">
                    {/* Título/Etiqueta IA */}
                    <div className="h-3 w-32 bg-purple-200 rounded mb-2 animate-pulse" />
                    <div className="space-y-2">
                      {/* Puntos de Análisis */}
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-3 w-11/12 bg-purple-100 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para actividad reciente del edificio
export function BuildingActivityLoading() {
  return (
    <div className="flex-1 overflow-hidden mt-2">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          {/* Contenedor principal de la tarjeta de actividad */}
          <div className="bg-white rounded-lg p-3 shadow-sm h-full">
            {/* Título */}
            <div className="h-4 w-28 bg-gray-200 rounded mb-3 animate-pulse" />

            {/* Contenedor de la lista de actividades */}
            <div className="space-y-2">
              {/* Iteramos para simular varias entradas de actividad */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 border border-gray-200 rounded"
                >
                  {/* Icono/Punto de color */}
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gray-200 animate-pulse" />

                  <div className="flex-1 min-w-0">
                    {/* Línea de texto principal (descripción) */}
                    <div className="h-3 w-10/12 bg-gray-200 rounded mb-1 animate-pulse" />
                    {/* Línea de texto secundaria (fecha/hora) */}
                    <div className="h-3 w-5/12 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para Seguros del edificio
export function BuildingInsuranceLoading() {
  return (
    <div className="flex-1 overflow-y-auto mt-2 pr-1">
      <div className="space-y-3">
        {/* Encabezado Principal y Botón */}
        <div
          data-slot="card"
          className="flex flex-col gap-6 rounded-xl border p-4 bg-[#1e3a8a] text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icono */}
              <div className="p-2 bg-white/10 rounded-lg border border-white/20 w-10 h-10 animate-pulse" />
              {/* Títulos */}
              <div>
                <div className="h-4 w-56 bg-white/20 rounded mb-2 animate-pulse" />
                <div className="h-3 w-40 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
            {/* Botón */}
            <div className="h-9 w-40 bg-white/30 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* 4 Tarjetas de Resumen (KPIs) */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
            >
              {/* Icono y Título */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              {/* Valor Principal */}
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              {/* Etiqueta Inferior */}
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Tarjeta de Póliza 1 (Seguro Multirriesgo) */}
        <PolicyCardSkeleton />

        {/* Tarjeta de Póliza 2 (RC Adicional) */}
        <PolicyCardSkeleton />

        {/* Tarjeta de Póliza 3 (Impago de Rentas) */}
        <PolicyCardSkeleton />

        {/* Recordatorios de Seguros */}
        <div
          data-slot="card"
          className="text-card-foreground flex flex-col gap-6 rounded-xl border p-4 bg-yellow-50 border-yellow-200"
        >
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded animate-pulse mt-0.5 flex-shrink-0" />
            <div>
              <div className="h-3 w-32 bg-yellow-200 rounded mb-2 animate-pulse" />
              <div className="space-y-1 text-xs">
                <div className="h-3 w-56 bg-yellow-200 rounded animate-pulse" />
                <div className="h-3 w-44 bg-yellow-200 rounded animate-pulse" />
                <div className="h-3 w-60 bg-yellow-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para Calendario del edificio
export function BuildingCalendarLoading() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg p-2 shadow-sm mb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Icono del calendario */}
            <div className="w-7 h-7 bg-gray-200 rounded animate-pulse" />
            <div>
              {/* Título */}
              <div className="h-3 w-32 bg-gray-200 rounded mb-1 animate-pulse" />
              {/* Subtítulo */}
              <div className="h-2.5 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          {/* Alerta de urgentes placeholder */}
          <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Filtros Skeleton */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {/* Icono filtro */}
          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse mr-1" />
          {/* Botones de filtro simulados */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-6 w-20 bg-gray-100 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Lista de Eventos Skeleton */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          {/* Simulamos 2 meses de datos */}
          {[1, 2].map((monthIndex) => (
            <div key={monthIndex}>
              {/* Encabezado del Mes */}
              <div className="sticky top-0 bg-gray-50 border-l-4 border-gray-200 px-2 py-1.5 mb-2 rounded-r shadow-sm">
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Lista de eventos del mes (Simulamos 3 eventos) */}
              <div className="space-y-2 ml-2">
                {[1, 2, 3].map((eventIndex) => (
                  <div
                    key={eventIndex}
                    className="relative border-l-4 border-gray-200 rounded shadow-sm p-2 bg-white"
                  >
                    <div className="flex items-start gap-2">
                      {/* Icono de Categoría */}
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0 animate-pulse" />

                      <div className="flex-1 min-w-0">
                        {/* Título y Badges */}
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                          <div className="flex gap-1">
                            <div className="h-4 w-12 bg-gray-100 rounded-full animate-pulse" />
                            <div className="h-4 w-12 bg-gray-100 rounded-full animate-pulse" />
                          </div>
                        </div>

                        {/* Descripción (2 líneas) */}
                        <div className="space-y-1.5 mb-2">
                          <div className="h-2 w-full bg-gray-100 rounded animate-pulse" />
                          <div className="h-2 w-3/4 bg-gray-100 rounded animate-pulse" />
                        </div>

                        {/* Footer (Fecha y Asset) */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse" />
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                            <div className="h-2.5 w-24 bg-gray-100 rounded animate-pulse" />
                          </div>
                        </div>
                      </div>

                      {/* Botón Ver detalles */}
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para las tarjetas individuales de póliza
function PolicyCardSkeleton() {
  return (
    <div
      data-slot="card"
      className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-4"
    >
      {/* Encabezado de la Póliza */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icono */}
          <div className="p-2 bg-gray-100 rounded-lg w-9 h-9 animate-pulse" />
          <div>
            {/* Título */}
            <div className="h-4 w-52 bg-gray-200 rounded mb-1 animate-pulse" />
            {/* Subtítulo (Nº Póliza) */}
            <div className="h-3 w-36 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        {/* Prima Anual */}
        <div className="text-right">
          <div className="h-3 w-16 bg-gray-100 rounded mb-1 animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Datos Clave (Aseguradora, Vigencia, Pago) */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2">
            <div className="h-3 w-16 bg-gray-200 rounded mb-1 animate-pulse" />
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Sección de Coberturas */}
      <div className="border-t border-gray-200 pt-3 mb-3">
        <div className="h-4 w-36 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-3 w-20 bg-gray-100 rounded ml-5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Franquicias (Opcional, se incluye un placeholder) */}
      <div className="border-t border-gray-200 pt-3">
        <div className="h-4 w-40 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-50 rounded p-2 border border-gray-100"
            >
              <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mantener compatibilidad con el nombre anterior
export function DashboardLoading() {
  return <MainPanelLoading />;
}
