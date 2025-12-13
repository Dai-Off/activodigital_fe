export function BuildingFinancial() {
  return (
    <div className="flex-1 overflow-y-auto mt-2 pr-1">
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div
            data-slot="card"
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver información detallada sobre el valor del activo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-circle-question-mark w-3 h-3 text-blue-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-building w-4 h-4 text-blue-600"
                  aria-hidden="true"
                >
                  <path d="M12 10h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M12 6h.01"></path>
                  <path d="M16 10h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M8 10h.01"></path>
                  <path d="M8 14h.01"></path>
                  <path d="M8 6h.01"></path>
                  <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path>
                  <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                </svg>
              </div>
              <h4 className="text-xs">Valor del Activo</h4>
            </div>
            <div className="text-lg">€4.500.000</div>
            <div className="text-xs text-gray-500 mt-1">
              Tasación actualizada
            </div>
          </div>
          <div
            data-slot="card"
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100 border  border-red-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver información detallada sobre la deuda total"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-circle-question-mark w-3 h-3 text-red-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-red-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-trending-down w-4 h-4 text-red-600"
                  aria-hidden="true"
                >
                  <path d="M16 17h6v-6"></path>
                  <path d="m22 17-8.5-8.5-5 5L2 7"></path>
                </svg>
              </div>
              <h4 className="text-xs">Deuda Total</h4>
            </div>
            <div className="text-lg text-red-600">€2.945.500</div>
            <div className="text-xs text-gray-500 mt-1">
              Hipoteca + Operativa
            </div>
          </div>
          <div
            data-slot="card"
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver información detallada sobre el apalancamiento (LTV)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-circle-question-mark w-3 h-3 text-purple-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-trending-up w-4 h-4 text-purple-600"
                  aria-hidden="true"
                >
                  <path d="M16 7h6v6"></path>
                  <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                </svg>
              </div>
              <h4 className="text-xs">Apalancamiento (LTV)</h4>
            </div>
            <div className="text-lg">65.46%</div>
            <div className="text-xs px-2 py-0.5 rounded-full inline-block mt-1 bg-green-100 text-green-700 border-green-200">
              Saludable
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
        >
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            title="Ver información detallada sobre la deuda hipotecaria"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-question-mark w-3 h-3 text-orange-600"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </button>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-file-text w-4 h-4 text-orange-600"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                  <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
              </div>
              <h4 className="text-xs">Deuda Hipotecaria</h4>
            </div>
            <span className="text-xs text-gray-500">Banco Santander</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Principal Pendiente
              </div>
              <div className="text-sm">€2.850.000</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Tipo de Interés</div>
              <div className="text-sm">3.25% TIN</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Cuota Mensual</div>
              <div className="text-sm">€13.890/mes</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Años Restantes</div>
              <div className="text-sm">18 años</div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha inicio:</span>
              <span>15/03/2019</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vencimiento:</span>
              <span>15/03/2037</span>
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
        >
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-red-100 border border-red-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            title="Ver información detallada sobre la deuda operativa"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-question-mark w-3 h-3 text-red-600"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-red-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-credit-card w-4 h-4 text-red-600"
                aria-hidden="true"
              >
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="2" x2="22" y1="10" y2="10"></line>
              </svg>
            </div>
            <h4 className="text-xs">Deuda Operativa Pendiente</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">
                Proveedores por pagar
              </span>
              <span className="text-xs">€45.600</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">
                Suministros por pagar
              </span>
              <span className="text-xs">€12.300</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Impuestos por pagar</span>
              <span className="text-xs">€28.900</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Otros conceptos</span>
              <span className="text-xs">€8700</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-xs">Total Deuda Operativa</span>
              <span className="text-sm text-red-600">€95.500</span>
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
        >
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            title="Ver información detallada sobre el análisis de apalancamiento"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-question-mark w-3 h-3 text-purple-600"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-purple-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-trending-up w-4 h-4 text-purple-600"
                aria-hidden="true"
              >
                <path d="M16 7h6v6"></path>
                <path d="m22 7-8.5 8.5-5-5L2 17"></path>
              </svg>
            </div>
            <h4 className="text-xs">Análisis de Apalancamiento</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">
                  LTV (Loan to Value)
                </span>
                <span className="text-xs">65.46%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: "65.46%" }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Óptimo: &lt;70% | Precaución: 70-80% | Riesgo: &gt;80%
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">
                  DSCR (Cobertura Servicio Deuda)
                </span>
                <span className="text-xs">1.85x</span>
              </div>
              <div className="text-xs text-gray-500">
                Ratio que mide la capacidad del activo para cubrir sus
                obligaciones de deuda. Óptimo: &gt;1.5x
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
              <div className="text-xs text-blue-900 mb-1">
                💡 Interpretación
              </div>
              <div className="text-xs text-blue-700">
                El activo mantiene un nivel de apalancamiento saludable. El LTV
                del 65.5% está dentro del rango óptimo y el DSCR de 1.85x indica
                buena capacidad de pago.
              </div>
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
        >
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            title="Ver información detallada sobre los gastos mensuales del activo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-question-mark w-3 h-3 text-orange-600"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-orange-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-euro w-4 h-4 text-orange-600"
                aria-hidden="true"
              >
                <path d="M4 10h12"></path>
                <path d="M4 14h9"></path>
                <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"></path>
              </svg>
            </div>
            <h4 className="text-xs">Gastos Mensuales del Activo</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-file-text w-3 h-3 text-gray-500"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                  <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                <span className="text-xs text-gray-600">Cuota hipotecaria</span>
              </div>
              <span className="text-xs">€13.890</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-file-text w-3 h-3 text-gray-500"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                  <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                <span className="text-xs text-gray-600">Seguros</span>
              </div>
              <span className="text-xs">€1850</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-file-text w-3 h-3 text-gray-500"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                  <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                <span className="text-xs text-gray-600">
                  IBI y otros impuestos
                </span>
              </div>
              <span className="text-xs">€3200</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-wrench w-3 h-3 text-gray-500"
                  aria-hidden="true"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
                </svg>
                <span className="text-xs text-gray-600">
                  Mantenimiento preventivo
                </span>
              </div>
              <span className="text-xs">€4500</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-file-text w-3 h-3 text-gray-500"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                  <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                <span className="text-xs text-gray-600">
                  Suministros comunes
                </span>
              </div>
              <span className="text-xs">€2850</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-users w-3 h-3 text-gray-500"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <span className="text-xs text-gray-600">
                  Gestión y administración
                </span>
              </div>
              <span className="text-xs">€2200</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-file-text w-3 h-3 text-gray-500"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                  <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                <span className="text-xs text-gray-600">Fondo de reserva</span>
              </div>
              <span className="text-xs">€1500</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-file-text w-3 h-3 text-gray-500"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                  <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                <span className="text-xs text-gray-600">Otros gastos</span>
              </div>
              <span className="text-xs">€800</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-xs">Total Gastos Mensuales</span>
              <span className="text-sm text-orange-600">€30.790/mes</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Total Anual</span>
              <span>€369.480/año</span>
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
        >
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
            title="Ver información detallada sobre los gastos por unidades"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-question-mark w-3 h-3 text-green-600"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-green-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-users w-4 h-4 text-green-600"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
            <h4 className="text-xs">Gastos Comunes por Unidades</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Total Unidades</div>
              <div className="text-sm">48 locales</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">
                Unidades Ocupadas
              </div>
              <div className="text-sm">45 locales</div>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">
                Limpieza zonas comunes
              </span>
              <span className="text-xs">€3200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">
                Seguridad y vigilancia
              </span>
              <span className="text-xs">€2800</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Iluminación común</span>
              <span className="text-xs">€1850</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Jardinería</span>
              <span className="text-xs">€1200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">
                Mantenimiento ascensores
              </span>
              <span className="text-xs">€950</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Agua común</span>
              <span className="text-xs">€420</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-xs">Total Gastos Comunes</span>
              <span className="text-sm text-green-600">€10.420/mes</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-2 border border-green-200">
            <div className="text-xs text-green-900 mb-1">
              Coste por m² para repercutir
            </div>
            <div className="text-sm text-green-700">€1.93/m²/mes</div>
            <div className="text-xs text-green-600 mt-1">
              Calculado sobre superficie total del edificio
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="text-card-foreground flex flex-col gap-6 rounded-xl border p-3 bg-yellow-50 border-yellow-200"
        >
          <div className="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-triangle-alert w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <div>
              <h4 className="text-xs text-yellow-900 mb-1">
                Alertas Financieras
              </h4>
              <div className="space-y-1 text-xs text-yellow-700">
                <div>• Revisión de tipo de interés hipotecario en 6 meses</div>
                <div>• Vencimiento IBI próximo: 15/12/2025</div>
                <div>• Renovación póliza seguros en 45 días</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
