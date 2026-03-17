import { ArrowDownRight, ArrowUpRight, Award, ChartColumn, CircleCheckBig, CircleHelp, Euro, MapPin, Star, TrendingUp } from 'lucide-react';
export default function BuildingFinancialAudit() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-5 text-white shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Euro className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl">Auditoría Financiera</h1>
            <p className="text-sm text-green-100 hidden sm:block">
              Valoración del Activo, ROI y Potencial de Revalorización
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-shrink-0 relative group">
        <button
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          title="Ver explicación detallada de la situación financiera actual"
          aria-label="Ver explicación detallada de la situación financiera actual"
        >
          <CircleHelp className="w-4 h-4 text-green-600" aria-hidden="true" />
        </button>
        <h3 className="text-gray-900 mb-5">Situación Financiera Actual</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-l-4 border-blue-500 pl-4 relative group/metric hover:bg-blue-50 p-3 rounded-r-lg transition-colors">
            <button
              className="absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover/metric:opacity-100 transition-all shadow-sm focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Más información sobre Valor del Activo"
              aria-label="Más información sobre Valor del Activo"
            >
              <CircleHelp className="w-3 h-3 text-blue-600" aria-hidden="true" />
            </button>
            <div className="text-sm text-gray-600 mb-2">Valor del Activo</div>
            <div className="text-2xl text-gray-900 mb-1">€8.50M</div>
            <div className="text-sm text-gray-500">1574 €/m²</div>
            <div className="text-sm text-blue-600 mt-2">5400m² construidos</div>
          </div>
          <div className="border-l-4 border-orange-500 pl-4 relative group/metric hover:bg-orange-50 p-3 rounded-r-lg transition-colors">
            <button
              className="absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover/metric:opacity-100 transition-all shadow-sm focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              title="Más información sobre Deuda Pendiente"
              aria-label="Más información sobre Deuda Pendiente"
            >
              <CircleHelp className="w-3 h-3 text-orange-600" aria-hidden="true" />
            </button>
            <div className="text-sm text-gray-600 mb-2">Deuda Pendiente</div>
            <div className="text-2xl text-gray-900 mb-1">€3.20M</div>
            <div className="text-sm text-gray-500">38% LTV</div>
            <div className="text-sm text-orange-600 mt-2">
              Ratio apalancamiento
            </div>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 relative group/metric hover:bg-purple-50 p-3 rounded-r-lg transition-colors">
            <button
              className="absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover/metric:opacity-100 transition-all shadow-sm focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Más información sobre Ingresos Anuales"
              aria-label="Más información sobre Ingresos Anuales"
            >
              <CircleHelp className="w-3 h-3 text-purple-600" aria-hidden="true" />
            </button>
            <div className="text-sm text-gray-600 mb-2">Ingresos Anuales</div>
            <div className="text-2xl text-gray-900 mb-1">€680k</div>
            <div className="text-sm text-gray-500">€12.6/m²·mes</div>
            <div className="text-sm text-purple-600 mt-2">94% ocupación</div>
          </div>
          <div className="border-l-4 border-green-500 bg-green-50 pl-4 relative group/metric hover:bg-green-100 p-3 rounded-r-lg transition-colors">
            <button
              className="absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover/metric:opacity-100 transition-all shadow-sm focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Más información sobre ROI Actual"
              aria-label="Más información sobre ROI Actual"
            >
              <CircleHelp className="w-3 h-3 text-green-600" aria-hidden="true" />
            </button>
            <div className="text-sm text-green-700 mb-2">ROI Actual</div>
            <div className="text-2xl text-green-600 mb-1">8.00%</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              ROI Positivo
            </div>
            <div className="text-sm text-green-700 mt-2">
              Rentabilidad bruta
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto pr-1">
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative group">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Ver explicación detallada del análisis de mercado"
              aria-label="Ver explicación detallada del análisis de mercado"
            >
              <CircleHelp className="w-4 h-4 text-blue-600" aria-hidden="true" />
            </button>
            <h3 className="text-gray-900 mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" aria-hidden="true" />
              Análisis de Mercado - Carretera de Miraflores, Colmenar Viejo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-5 relative group/metric hover:bg-blue-100 transition-colors border border-blue-200">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Precio Medio Zona"
                >
                  <CircleHelp className="w-2.5 h-2.5 text-blue-600" aria-hidden="true" />
                </button>
                <div className="text-xs text-gray-700 mb-2">
                  Precio Medio Zona
                </div>
                <div className="text-2xl text-blue-600 mb-2">1,650 €/m²</div>
                <div className="text-xs text-gray-600 mb-3">
                  Según Idealista 2025
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <TrendingUp className="w-3 h-3" aria-hidden="true" />
                  <span>+3.2% interanual</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-gray-200 border border-gray-300 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Precio Actual Activo"
                >
                  <CircleHelp className="w-2.5 h-2.5 text-gray-600" aria-hidden="true" />
                </button>
                <div className="text-xs text-gray-700 mb-2">
                  Precio Actual Activo
                </div>
                <div className="text-2xl text-gray-900 mb-2">1574 €/m²</div>
                <div className="text-xs text-gray-600 mb-3">
                  Valoración actual
                </div>
                <div className="flex items-center gap-2 text-xs text-green-700">
                  <ArrowDownRight className="w-3 h-3" aria-hidden="true" />
                  <span>-4.6% bajo mercado</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Potencial Post-Mejora"
                >
                  <CircleHelp className="w-2.5 h-2.5 text-green-600" aria-hidden="true" />
                </button>
                <div className="text-xs text-gray-700 mb-2">
                  Potencial Post-Mejora
                </div>
                <div className="text-2xl text-green-600 mb-2">1,763 €/m²</div>
                <div className="text-xs text-gray-600 mb-3">
                  Tras rehabilitación
                </div>
                <div className="flex items-center gap-2 text-xs text-green-700">
                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                  <span>+12% revalorización</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-900 mb-2">
                Factores de Mercado Considerados:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                <div>• Ubicación: Zona comercial prime</div>
                <div>• Conectividad: Excelente acceso transporte</div>
                <div>• Demanda: Alta demanda en el área</div>
                <div>• Competencia: Escasa oferta similar</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative group">
            <button
              className="absolute top-3 right-3 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver explicación detallada de la proyección financiera"
            >
              <CircleHelp className="w-3 h-3 text-purple-600" aria-hidden="true" />
            </button>
            <h3 className="text-sm mb-4">
              Proyección Financiera Post-Rehabilitación
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-orange-200 bg-orange-50 rounded-xl p-4 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm z-10"
                  title="Más información sobre Inversión Requerida"
                >
                  <CircleHelp className="w-2.5 h-2.5 text-orange-600" aria-hidden="true" />
                </button>
                <h4 className="text-xs mb-3 text-orange-900 flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
                  Inversión Requerida
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      Valor actual del activo:
                    </span>
                    <span className="text-gray-900">€8.50M</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      Coste mejoras técnicas:
                    </span>
                    <span className="text-orange-600">€450k</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      Costes indirectos (5%):
                    </span>
                    <span className="text-gray-600">€23k</span>
                  </div>
                  <div className="pt-3 border-t-2 border-orange-300 flex justify-between">
                    <span className="text-xs text-orange-900">
                      Inversión total:
                    </span>
                    <span className="text-lg text-orange-900">€473k</span>
                  </div>
                </div>
              </div>
              <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm z-10"
                  title="Más información sobre Retorno Esperado"
                >
                  <CircleHelp className="w-2.5 h-2.5 text-green-600" aria-hidden="true" />
                </button>
                <h4 className="text-xs mb-3 text-green-900 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  Retorno Esperado
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">Valor actual:</span>
                    <span className="text-gray-900">€8.50M</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      Revalorización (+12%):
                    </span>
                    <span className="text-green-600">€1020k</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      Ahorro energético anual:
                    </span>
                    <span className="text-green-600">€69k/año</span>
                  </div>
                  <div className="pt-3 border-t-2 border-green-300 flex justify-between">
                    <span className="text-xs text-green-900">
                      Valor post-mejora:
                    </span>
                    <span className="text-lg text-green-900">€9.52M</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white relative group/metric">
              <button
                className="absolute top-2 right-2 p-0.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                title="Más información sobre Ganancia Neta Estimada"
              >
                <CircleHelp className="w-2.5 h-2.5 text-white" aria-hidden="true" />
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-100 mb-1">
                    Ganancia Neta Estimada
                  </div>
                  <div className="text-3xl">€548k</div>
                  <div className="text-xs text-blue-100 mt-2">
                    ROI de la inversión: 215.9%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-100 mb-1">
                    Período de Recuperación
                  </div>
                  <div className="text-3xl">6.5</div>
                  <div className="text-xs text-blue-100 mt-2">
                    años (promedio)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative group">
            <button
              className="absolute top-3 right-3 p-1 rounded-full bg-white hover:bg-amber-100 border border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver explicación detallada de la comparativa de escenarios"
            >
              <CircleHelp className="w-3 h-3 text-amber-600" aria-hidden="true" />
            </button>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm">
                Comparativa de Escenarios de Inversión
              </h3>
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-600" aria-hidden="true" />
                <span>Escenario óptimo destacado</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-200">
                <div className="text-center mb-3">
                  <div className="text-xs text-gray-600 mb-1">Escenario 1</div>
                  <h4 className="text-sm text-gray-900 mb-2">Sin Mejoras</h4>
                  <div className="text-xs text-gray-500">
                    Mantener estado actual
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Inversión</div>
                    <div className="text-gray-900">€0</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Valor Final</div>
                    <div className="text-gray-900">€8.50M</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Ahorro/año</div>
                    <div className="text-gray-900">€0</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Clase EPBD</div>
                    <div className="text-red-600">D</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">ROI Total</div>
                    <div className="text-gray-900">0%</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Payback</div>
                    <div className="text-gray-900">N/A</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-700">
                    <div className="mb-1">✗ No cumple EPBD 2030</div>
                    <div>✗ Depreciación del activo</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                <div className="text-center mb-3">
                  <div className="text-xs text-blue-600 mb-1">Escenario 2</div>
                  <h4 className="text-sm text-blue-900 mb-2">
                    Mejoras Básicas
                  </h4>
                  <div className="text-xs text-blue-700">
                    LED + Solar básica
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Inversión</div>
                    <div className="text-blue-700">€126k</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Valor Final</div>
                    <div className="text-blue-700">€8.84M</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Ahorro/año</div>
                    <div className="text-green-600">€32k</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Clase EPBD</div>
                    <div className="text-orange-600">C</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">ROI Total</div>
                    <div className="text-blue-700">169%</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Payback</div>
                    <div className="text-blue-700">3.9 años</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="text-xs text-blue-700">
                    <div className="mb-1">✓ Bajo riesgo</div>
                    <div>✗ No cumple EPBD 2030</div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-200">
                <div className="text-center mb-3">
                  <div className="text-xs text-purple-600 mb-1">
                    Escenario 3
                  </div>
                  <h4 className="text-sm text-purple-900 mb-2">
                    Mejoras Intermedias
                  </h4>
                  <div className="text-xs text-purple-700">
                    LED + Solar + HVAC
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Inversión</div>
                    <div className="text-purple-700">€293k</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Valor Final</div>
                    <div className="text-purple-700">€9.14M</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Ahorro/año</div>
                    <div className="text-green-600">€51k</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Clase EPBD</div>
                    <div className="text-yellow-600">B</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">ROI Total</div>
                    <div className="text-purple-700">118%</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Payback</div>
                    <div className="text-purple-700">5.7 años</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <div className="text-xs text-purple-700">
                    <div className="mb-1">✓ Equilibrio inversión/retorno</div>
                    <div>~ Cumple EPBD 2030</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg p-3 border-4 border-amber-400 relative shadow-lg">
                <div className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full p-2 shadow-lg">
                  <Award className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="text-center mb-3">
                  <div className="text-xs text-amber-700 mb-1 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-amber-700" aria-hidden="true" />
                    Escenario 4
                  </div>
                  <h4 className="text-sm text-amber-900 mb-2">
                    Mejoras Completas
                  </h4>
                  <div className="text-xs text-amber-700">
                    Plan completo 6 medidas
                  </div>
                  <div className="mt-2 bg-amber-200 text-amber-900 text-xs px-2 py-1 rounded-full inline-block">
                    RECOMENDADO
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white rounded p-2 border border-amber-200">
                    <div className="text-gray-600 mb-1">Inversión</div>
                    <div className="text-amber-900">€514k</div>
                  </div>
                  <div className="bg-white rounded p-2 border border-amber-200">
                    <div className="text-gray-600 mb-1">Valor Final</div>
                    <div className="text-amber-900">€9.52M</div>
                  </div>
                  <div className="bg-white rounded p-2 border border-amber-200">
                    <div className="text-gray-600 mb-1">Ahorro/año</div>
                    <div className="text-green-700">€82k</div>
                  </div>
                  <div className="bg-white rounded p-2 border border-amber-200">
                    <div className="text-gray-600 mb-1">Clase EPBD</div>
                    <div className="text-green-700">A+</div>
                  </div>
                  <div className="bg-white rounded p-2 border border-amber-200">
                    <div className="text-gray-600 mb-1">ROI Total</div>
                    <div className="text-amber-900">198%</div>
                  </div>
                  <div className="bg-white rounded p-2 border border-amber-200">
                    <div className="text-gray-600 mb-1">Payback</div>
                    <div className="text-amber-900">6.3 años</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-amber-300">
                  <div className="text-xs text-amber-900">
                    <div className="mb-1">✓ Máximo valor de activo</div>
                    <div className="mb-1">✓ Cumple EPBD 2030</div>
                    <div>✓ ROI óptimo 198%</div>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 border-2 border-indigo-200">
                <div className="text-center mb-3">
                  <div className="text-xs text-indigo-600 mb-1">
                    Escenario 5
                  </div>
                  <h4 className="text-sm text-indigo-900 mb-2">
                    Mejoras Premium
                  </h4>
                  <div className="text-xs text-indigo-700">
                    Completas + BREEAM
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Inversión</div>
                    <div className="text-indigo-700">€685k</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Valor Final</div>
                    <div className="text-indigo-700">€9.86M</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Ahorro/año</div>
                    <div className="text-green-600">€88k</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Clase EPBD</div>
                    <div className="text-green-700">A+</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">ROI Total</div>
                    <div className="text-indigo-700">148%</div>
                  </div>
                  <div className="bg-white rounded p-2">
                    <div className="text-gray-600 mb-1">Payback</div>
                    <div className="text-indigo-700">7.8 años</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-indigo-200">
                  <div className="text-xs text-indigo-700">
                    <div className="mb-1">✓ Certificación BREEAM</div>
                    <div>✗ Payback más largo</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-lg flex-shrink-0">
                  <Award className="w-5 h-5 text-amber-700" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-amber-900 mb-2">
                    ¿Por qué "Mejoras Completas" es el escenario óptimo?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-xs text-amber-800">
                    <div>
                      <div className="font-medium mb-1">Mejor ROI Total:</div>
                      <div>
                        Con un retorno del 198% sobre la inversión, supera
                        significativamente a todos los demás escenarios,
                        maximizando el beneficio económico.
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Equilibrio Óptimo:</div>
                      <div>
                        Logra el mejor balance entre inversión inicial (€514k),
                        payback razonable (6.3 años) y revalorización del activo
                        (+€1.02M).
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">
                        Cumplimiento Normativo:
                      </div>
                      <div>
                        Alcanza clase A+ garantizando cumplimiento de EPBD 2030
                        sin sobrecostes innecesarios como certificaciones
                        premium.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative group">
            <button
              className="absolute top-3 right-3 p-1 rounded-full bg-white hover:bg-indigo-100 border border-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver explicación detallada de las opciones de financiación"
            >
              <CircleHelp className="w-3 h-3 text-indigo-600" aria-hidden="true" />
            </button>
            <h3 className="text-sm mb-4">Opciones de Financiación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Fondos Europeos"
                >
                  <CircleHelp className="w-2.5 h-2.5 text-purple-600" aria-hidden="true" />
                </button>
                <h4 className="text-xs text-purple-900 mb-2">
                  Fondos Europeos
                </h4>
                <div className="text-xl text-purple-600 mb-1">Hasta 40%</div>
                <div className="text-xs text-purple-700 mb-2">
                  Del coste total
                </div>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• NextGeneration EU</li>
                  <li>• PREE (Rehabilitación)</li>
                  <li>• PIREP (Edificios públicos)</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Financiación ICO"
                >
                  <CircleHelp className="w-2.5 h-2.5 text-blue-600" aria-hidden="true" />
                </button>
                <h4 className="text-xs text-blue-900 mb-2">Financiación ICO</h4>
                <div className="text-xl text-blue-600 mb-1">1.5% - 2.5%</div>
                <div className="text-xs text-blue-700 mb-2">TAE anual</div>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Plazo: hasta 20 años</li>
                  <li>• Carencia: hasta 3 años</li>
                  <li>• Sin comisiones</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Línea Verde Bancos"
                >
                  <CircleHelp className="w-2.5 h-2.5 text-green-600" aria-hidden="true" />
                </button>
                <h4 className="text-xs text-green-900 mb-2">
                  Línea Verde Bancos
                </h4>
                <div className="text-xl text-green-600 mb-1">2.0% - 3.0%</div>
                <div className="text-xs text-green-700 mb-2">TAE anual</div>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Financiación específica</li>
                  <li>• Mejores condiciones</li>
                  <li>• Bonificaciones verdes</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <ChartColumn className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <h4 className="text-sm text-green-900 mb-2">
                  Análisis IA - Viabilidad Financiera
                </h4>
                <p className="text-xs text-green-700 mb-3">
                  La inversión de €473k en mejoras energéticas generará un
                  incremento de valor del 12%, alcanzando €9.52M. Con una
                  ganancia neta de €548k y un ROI actual del 8.00%, el activo
                  presenta excelente potencial de revalorización. El ahorro
                  energético anual de €69k reduce el período de recuperación a
                  6.5 años.
                </p>
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleCheckBig className="w-4 h-4 text-green-600" aria-hidden="true" />
                    <span className="text-xs text-green-900">
                      Inversión altamente recomendada
                    </span>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    <div>
                      • Solicitar subvenciones europeas (ahorro de hasta €180k)
                    </div>
                    <div>
                      • Considerar financiación ICO con carencia de 3 años
                    </div>
                    <div>
                      • El activo quedará por encima del precio medio de zona
                      (+6.8%)
                    </div>
                    <div>
                      • Incremento de renta potencial del 12% tras mejoras
                    </div>
                    <div>
                      • Mejora sustancial en atractivo comercial y
                      competitividad
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
