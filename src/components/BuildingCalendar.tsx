export function BuildingCalendar() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-white rounded-lg p-2 shadow-sm mb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
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
                className="lucide lucide-calendar w-4 h-4 text-white"
                aria-hidden="true"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xs text-gray-900">Calendario de Acciones</h2>
              <p className="text-xs text-gray-600">21 acciones programadas</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 rounded">
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
              className="lucide lucide-triangle-alert w-3.5 h-3.5 text-red-600"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <span className="text-xs text-red-700">5 Urgentes</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs text-gray-600">
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
              className="lucide lucide-funnel w-3 h-3"
              aria-hidden="true"
            >
              <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
            </svg>
            <span>Filtrar:</span>
          </div>
          <button className="px-2 py-1 text-xs rounded transition-colors bg-blue-600 text-white">
            Todas (21)
          </button>
          <button className="px-2 py-1 text-xs rounded transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
            Auditoría (10)
          </button>
          <button className="px-2 py-1 text-xs rounded transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
            Operaciones (11)
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-3">
          <div>
            <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-blue-600 px-2 py-1.5 mb-2 rounded-r shadow-sm z-10">
              <h3 className="text-xs text-gray-900 capitalize">
                diciembre de 2025
              </h3>
              <p className="text-xs text-gray-600">3 acciones</p>
            </div>
            <div className="space-y-2 ml-2">
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="relative border-l-4 border-red-500 bg-red-50 rounded shadow-sm p-2 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-100">
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
                        className="lucide lucide-wrench w-3.5 h-3.5 text-orange-600"
                        aria-hidden="true"
                      >
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5 mb-0.5">
                        <h4 className="text-xs text-gray-900">
                          Inspección Ascensores
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Próximo
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        Revisión obligatoria anual de los ascensores
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
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
                            className="lucide lucide-clock w-3 h-3"
                            aria-hidden="true"
                          >
                            <path d="M12 6v6l4 2"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                          <span>23 dic</span>
                          <span>(En 7 días)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
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
                            className="lucide lucide-building2 lucide-building-2 w-3 h-3"
                            aria-hidden="true"
                          >
                            <path d="M10 12h4"></path>
                            <path d="M10 8h4"></path>
                            <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                            <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                            <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                          </svg>
                          <span>Ascensor A y B</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex-shrink-0">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="relative  border-l-4 border-red-500 bg-red-50 rounded shadow-sm p-2 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-100">
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
                        className="lucide lucide-wrench w-3.5 h-3.5 text-orange-600"
                        aria-hidden="true"
                      >
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5 mb-0.5">
                        <h4 className="text-xs text-gray-900">
                          Revisión Sistema HVAC
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Próximo
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        Mantenimiento trimestral del sistema de climatización
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
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
                            className="lucide lucide-clock w-3 h-3"
                            aria-hidden="true"
                          >
                            <path d="M12 6v6l4 2"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                          <span>30 dic</span>
                          <span>(En 2 semanas)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
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
                            className="lucide lucide-building2 lucide-building-2 w-3 h-3"
                            aria-hidden="true"
                          >
                            <path d="M10 12h4"></path>
                            <path d="M10 8h4"></path>
                            <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                            <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                            <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                          </svg>
                          <span>Sistemas generales</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex-shrink-0">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative  border-l-4 border-red-500 bg-red-50 rounded shadow-sm p-2 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
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
                        className="lucide lucide-file-text w-3.5 h-3.5 text-blue-600"
                        aria-hidden="true"
                      >
                        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                        <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5 mb-0.5">
                        <h4 className="text-xs text-gray-900">
                          Vencimiento de Contrato - Local 101
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Urgente
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        El contrato de arrendamiento con Inditex Retail España
                        SL vence el 31/12/2025. Programar revisión y renovación.
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
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
                            className="lucide lucide-clock w-3 h-3"
                            aria-hidden="true"
                          >
                            <path d="M12 6v6l4 2"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                          <span>31 dic</span>
                          <span>(En 2 semanas)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
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
                            className="lucide lucide-building2 lucide-building-2 w-3 h-3"
                            aria-hidden="true"
                          >
                            <path d="M10 12h4"></path>
                            <path d="M10 8h4"></path>
                            <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
                            <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
                            <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
                          </svg>
                          <span>Local 101</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex-shrink-0">
                      Ver detalles
                    </button>
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
