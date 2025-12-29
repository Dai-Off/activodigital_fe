import {
  Building2,
  Check,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export function AssetsListDashboard() {
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-white rounded-xl p-3 md:p-4 lg:p-6 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl">Gestión de Edificios</h2>
              <p className="text-xs md:text-sm text-gray-500">13 edificios</p>
            </div>
          </div>
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            + Crear Edificio
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Edificios</p>
            <p className="text-2xl text-blue-600">13</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Cumplimiento Promedio</p>
            <p className="text-2xl text-green-600">79%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Libros Completos</p>
            <p className="text-2xl text-purple-600">7</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Superficie Total</p>
            <p className="text-2xl text-orange-600">64.5k m²</p>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, dirección..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value=""
              />
            </div>
            <div className="text-xs text-gray-500">13 de 13 edificios</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="name">Nombre</option>
              <option value="surface">Superficie</option>
              <option value="year">Año</option>
              <option value="energyClass">Clase Energética</option>
              <option value="compliance">Cumplimiento</option>
              <option value="occupancy">Ocupación</option>
            </select>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              A-Z
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 border-gray-300">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto pr-1">
        <div className="bg-white w-fit rounded-xl p-6 shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <span>Imagen</span>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Edificio</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Ordenar"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          ></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                          title="Filtrar"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>ID</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Ordenar"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          ></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                          title="Filtrar"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Tipo</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Ordenar"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          ></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                          title="Filtrar"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Superficie</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Ordenar"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          ></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                          title="Filtrar"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Año</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Ordenar"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          ></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                          title="Filtrar"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Certificado</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Ordenar"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          ></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                          title="Filtrar"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Libro</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Ordenar"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          ></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                          title="Filtrar"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Cumplimiento</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Ordenar"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          ></path>
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                          title="Filtrar"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors">
                <td className="py-3 px-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1762867089896-e51054249a41?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwYnVpbGRpbmclMjBleHRlcmlvcnxlbnwxfHx8fDE3NjMyOTU4MTl8MA&amp;ixlib=rb-4.1.0&amp;q=80&amp;w=1080"
                      alt="Business Hub Pozuelo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900">
                        Business Hub Pozuelo
                      </p>
                    </div>
                    <div className="flex items-start gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Calle Empresarial 8, Pozuelo de Alarcón</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">EDI-012</td>
                <td className="py-3 px-4 text-sm text-gray-600">Comercial</td>
                <td className="py-3 px-4 text-sm text-gray-900">4500 m²</td>
                <td className="py-3 px-4 text-sm text-gray-600">2021</td>
                <td className="py-3 px-4">
                  <div className="w-7 h-7 rounded flex items-center justify-center text-white text-sm bg-green-500">
                    A
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    <Check className="w-3 h-3" />
                    Completo
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700">100%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
