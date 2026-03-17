import { CircleCheckBig, CircleHelp, FileText, Lightbulb, Scale, Sparkles, TriangleAlert } from 'lucide-react';
export default function BuildingRegulatoryAudit() {
  return (
    <div className="h-full flex flex-col gap-3 md:gap-4">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 md:p-6 text-white shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-white/20 rounded-xl flex-shrink-0">
            <Scale className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl truncate">
              Auditoría Regulatoria
            </h1>
            <p className="text-xs md:text-sm text-purple-100 hidden sm:block truncate">
              Cumplimiento Directiva EPBD y Certificación Energética Europea
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
              <CircleCheckBig className="w-4 h-4 md:w-6 md:h-6 text-green-600" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Normativas
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">5/8</div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Cumplidas
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                MEVs
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">3/8</div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Implementadas
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg">
              <FileText className="w-4 h-4 md:w-6 md:h-6 text-purple-600" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Certificados
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">2/3</div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Vigentes
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
              <TriangleAlert className="w-4 h-4 md:w-6 md:h-6 text-orange-600" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Auditorías
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">1</div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 truncate">
            Pendiente IEE
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 flex-shrink-0">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
          <button
            className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Ver explicación detallada del estado actual"
            aria-label="Ver explicación detallada del estado actual"
          >
            <CircleHelp className="w-3 h-3 text-purple-600" aria-hidden="true" />
          </button>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-sm md:text-base">Estado Actual</h3>
            <span className="px-2 md:px-3 py-1 rounded-full text-xs flex-shrink-0 bg-orange-100 text-orange-700">
              Clase D
            </span>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Consumo energético:
              </div>
              <div className="text-lg md:text-xl">
                85.42 kWh/m<sup>2</sup>·año
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Emisiones CO₂:</div>
              <div className="text-lg md:text-xl">
                16.74 kg CO<sub>2</sub>eq/m<sup>2</sup>·año
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
          <button
            className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Ver explicación detallada de la Directiva EPBD 2030"
            aria-label="Ver explicación detallada de la Directiva EPBD 2030"
          >
            <CircleHelp className="w-3 h-3 text-blue-600" aria-hidden="true" />
          </button>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-sm md:text-base">
              Directiva EPBD 2030 Objetivo
            </h3>
            <span className="px-2 md:px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex-shrink-0">
              Objetivo D
            </span>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Consumo objetivo:
              </div>
              <div className="text-lg md:text-xl">
                65 kWh/m<sup>2</sup>·año
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Emisiones objetivo:
              </div>
              <div className="text-lg md:text-xl">
                12 kg CO<sub>2</sub>eq/m<sup>2</sup>·año
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto pr-1">
        <div className="space-y-2 md:space-y-3">
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
            <button
              className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              title="Ver explicación detallada del análisis de brechas"
              aria-label="Ver explicación detallada del análisis de brechas"
            >
              <CircleHelp className="w-3 h-3 text-orange-600" aria-hidden="true" />
            </button>
            <h3 className="text-sm md:text-base mb-4">
              Análisis de Brechas (Gap Analysis)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TriangleAlert className="w-4 h-4 text-orange-600" aria-hidden="true" />
                    <span className="text-xs">Consumo energético</span>
                  </div>
                  <span className="text-xs text-orange-600">
                    +20.42 kWh/m²·año
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all bg-orange-500"
                    style={{ width: "76.0946%" }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Actual: 85.42 kWh/m²·año → Objetivo: 65 kWh/m²·año
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TriangleAlert className="w-4 h-4 text-orange-600" aria-hidden="true" />
                    <span className="text-xs">Emisiones de CO₂</span>
                  </div>
                  <span className="text-xs text-orange-600">
                    +4.74 kg CO₂eq/m²·año
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all bg-orange-500"
                    style={{ width: "71.6846%" }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Actual: 16.74 kg CO₂eq/m²·año → Objetivo: 12 kg CO₂eq/m²·año
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
            <button
              className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Ver explicación detallada de la normativa aplicable"
              aria-label="Ver explicación detallada de la normativa aplicable"
            >
              <CircleHelp className="w-3 h-3 text-blue-600" aria-hidden="true" />
            </button>
            <h3 className="text-sm md:text-base mb-3">Normativa Aplicable</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CircleCheckBig className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-blue-900">
                    Directiva (UE) 2024/1275 - EPBD IV
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Eficiencia energética de edificios - Objetivo 2030: Clase D
                    mínima
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CircleCheckBig className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-blue-900">
                    Real Decreto 390/2021
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Procedimiento básico para la certificación energética de
                    edificios
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CircleCheckBig className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-blue-900">
                    Ley 7/2021 de Cambio Climático
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Neutralidad climática 2050 - Reducción 23% emisiones para
                    2030
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base">
                MEVs - Medidas de Eficiencia de Vivienda
              </h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                RD 390/2021
              </span>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-orange-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs mb-1">
                        MEV-01: Aislamiento Térmico de Envolvente
                      </div>
                      <div className="text-xs text-gray-600">
                        Fachadas, cubiertas y medianeras
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded whitespace-nowrap">
                    Parcial
                  </span>
                </div>
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Estado actual</div>
                      <div className="text-orange-600">
                        Aislamiento insuficiente
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ahorro potencial</div>
                      <div>15-25 kWh/m²·año</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Reducción CO₂</div>
                      <div>3-5 kg/m²·año</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-orange-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs mb-1">
                        MEV-02: Sustitución de Carpinterías Exteriores
                      </div>
                      <div className="text-xs text-gray-600">
                        Ventanas y puertas con rotura de puente térmico
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded whitespace-nowrap">
                    No implementada
                  </span>
                </div>
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Estado actual</div>
                      <div className="text-red-600">Carpintería antigua</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ahorro potencial</div>
                      <div>10-18 kWh/m²·año</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Reducción CO₂</div>
                      <div>2-4 kg/m²·año</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-green-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs mb-1">
                        MEV-03: Sistemas de Climatización Eficientes
                      </div>
                      <div className="text-xs text-gray-600">
                        Calderas de condensación, bombas de calor, sistemas VRV
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded whitespace-nowrap">
                    Implementada
                  </span>
                </div>
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Estado actual</div>
                      <div className="text-green-600">Caldera condensación</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ahorro logrado</div>
                      <div>12 kWh/m²·año</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Reducción CO₂</div>
                      <div>2.5 kg/m²·año</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-green-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs mb-1">
                        MEV-04: Iluminación LED de Alta Eficiencia
                      </div>
                      <div className="text-xs text-gray-600">
                        Zonas comunes y exteriores
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded whitespace-nowrap">
                    Implementada
                  </span>
                </div>
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Estado actual</div>
                      <div className="text-green-600">100% LED</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ahorro logrado</div>
                      <div>3-5 kWh/m²·año</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Reducción CO₂</div>
                      <div>0.6-1 kg/m²·año</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <TriangleAlert className="w-4 h-4 text-red-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs mb-1">
                        MEV-05: Integración de Energías Renovables
                      </div>
                      <div className="text-xs text-gray-600">
                        Fotovoltaica, solar térmica, aerotermia
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded whitespace-nowrap">
                    No implementada
                  </span>
                </div>
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Estado actual</div>
                      <div className="text-red-600">Sin renovables</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ahorro potencial</div>
                      <div>20-35 kWh/m²·año</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Reducción CO₂</div>
                      <div>8-12 kg/m²·año</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-orange-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs mb-1">
                        MEV-06: Sistemas de Control y Gestión Energética
                      </div>
                      <div className="text-xs text-gray-600">
                        Domótica, sensores, termostatos inteligentes
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded whitespace-nowrap">
                    Parcial
                  </span>
                </div>
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Estado actual</div>
                      <div className="text-orange-600">Control básico</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ahorro potencial</div>
                      <div>5-10 kWh/m²·año</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Reducción CO₂</div>
                      <div>1-2 kg/m²·año</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <TriangleAlert className="w-4 h-4 text-red-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs mb-1">
                        MEV-07: Ventilación Mecánica con Recuperación de Calor
                      </div>
                      <div className="text-xs text-gray-600">
                        Sistemas de ventilación controlada (VMC)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded whitespace-nowrap">
                    No implementada
                  </span>
                </div>
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Estado actual</div>
                      <div className="text-red-600">Ventilación natural</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ahorro potencial</div>
                      <div>8-15 kWh/m²·año</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Reducción CO₂</div>
                      <div>1.5-3 kg/m²·año</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <CircleCheckBig className="w-4 h-4 text-orange-600 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="text-xs mb-1">
                        MEV-08: Protección Solar y Control de Radiación
                      </div>
                      <div className="text-xs text-gray-600">
                        Persianas, toldos, lamas, vidrios selectivos
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded whitespace-nowrap">
                    Parcial
                  </span>
                </div>
                <div className="mt-2 bg-gray-50 rounded p-2">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-gray-600">Estado actual</div>
                      <div className="text-orange-600">Protección básica</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ahorro potencial</div>
                      <div>3-8 kWh/m²·año</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Reducción CO₂</div>
                      <div>0.5-1.5 kg/m²·año</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">
                    Implementadas
                  </div>
                  <div className="text-xl text-green-600">3</div>
                  <div className="text-xs text-gray-500">de 8 MEVs</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="text-xs text-gray-600 mb-1">Parciales</div>
                  <div className="text-xl text-orange-600">3</div>
                  <div className="text-xs text-gray-500">Requieren mejora</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">Pendientes</div>
                  <div className="text-xl text-red-600">2</div>
                  <div className="text-xs text-gray-500">No implementadas</div>
                </div>
              </div>
              <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-900 mb-1">
                  Potencial de Mejora Total
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <div className="text-xs text-blue-700">
                      Ahorro energético posible
                    </div>
                    <div className="text-sm text-blue-900">
                      46-76 kWh/m²·año
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-700">
                      Reducción CO₂ posible
                    </div>
                    <div className="text-sm text-blue-900">13-22 kg/m²·año</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <h4 className="text-sm text-purple-900 mb-2">
                  Recomendación IA - Cumplimiento Normativo
                </h4>
                <p className="text-xs text-purple-700 mb-3">
                  Para alcanzar los objetivos EPBD 2030, se requiere reducir el
                  consumo en 20.4 kWh/m²·año y las emisiones en 4.7 kg
                  CO₂eq/m²·año. Se recomienda priorizar intervenciones en
                  envolvente térmica y sistemas HVAC según la auditoría técnica.
                </p>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-xs text-purple-900 mb-2">
                    Acciones prioritarias:
                  </div>
                  <ul className="space-y-1 text-xs text-purple-700">
                    <li>• Realizar auditoría energética completa (IEE)</li>
                    <li>• Actualizar certificado energético antes de 2025</li>
                    <li>• Planificar inversiones en mejoras antes de 2027</li>
                    <li>
                      • Considerar financiación europea (PREE, NextGeneration
                      EU)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
