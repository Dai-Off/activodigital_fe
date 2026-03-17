import { Building2, CarFront, CircleAlert, CircleCheckBig, CircleHelp, Droplets, FileCheck, Lightbulb, TrendingUp, Wrench, Zap } from 'lucide-react';
export default function BuildingTechnicalAudit() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white shadow-lg flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
            <Wrench className="w-8 h-8" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl truncate">Auditoría Técnica</h1>
            <p className="text-sm text-orange-100 hidden sm:block truncate">
              Estado del Libro del Edificio y Recomendaciones de Mejora
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Libro del Edificio</h3>
            <FileCheck className="w-6 h-6 text-blue-600 flex-shrink-0" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Completado</span>
                <span className="text-sm text-blue-700">100%</span>
              </div>
              <div className="w-full bg-white rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  role="progressbar"
                  aria-valuenow={100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progreso del Libro del Edificio"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div className="pt-3 border-t border-blue-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Tareas completadas:</span>
                <span className="text-gray-900">8/8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Última actualización:</span>
                <span className="text-gray-900">08/11/2024</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Estado Instalaciones</h3>
            <CircleCheckBig className="w-6 h-6 text-green-600 flex-shrink-0" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm hover:bg-white/50 p-2 rounded transition-colors">
              <span className="text-gray-700 capitalize truncate">
                documentacion
              </span>
              <span className="px-3 py-1 rounded-lg text-sm flex-shrink-0 bg-green-200 text-green-800">
                OK
              </span>
            </div>
            <div className="flex items-center justify-between text-sm hover:bg-white/50 p-2 rounded transition-colors">
              <span className="text-gray-700 capitalize truncate">
                certificados
              </span>
              <span className="px-3 py-1 rounded-lg text-sm flex-shrink-0 bg-green-200 text-green-800">
                OK
              </span>
            </div>
            <div className="flex items-center justify-between text-sm hover:bg-white/50 p-2 rounded transition-colors">
              <span className="text-gray-700 capitalize truncate">
                instalaciones
              </span>
              <span className="px-3 py-1 rounded-lg text-sm flex-shrink-0 bg-green-200 text-green-800">
                OK
              </span>
            </div>
            <div className="flex items-center justify-between text-sm hover:bg-white/50 p-2 rounded transition-colors">
              <span className="text-gray-700 capitalize truncate">
                mantenimiento
              </span>
              <span className="px-3 py-1 rounded-lg text-sm flex-shrink-0 bg-yellow-200 text-yellow-800">
                Pendiente
              </span>
            </div>
            <div className="flex items-center justify-between text-sm hover:bg-white/50 p-2 rounded transition-colors">
              <span className="text-gray-700 capitalize truncate">seguros</span>
              <span className="px-3 py-1 rounded-lg text-sm flex-shrink-0 bg-green-200 text-green-800">
                OK
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto pr-1">
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative group">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              title="Ver explicación detallada de las recomendaciones"
              aria-label="Ver explicación detallada de las recomendaciones"
            >
              <CircleHelp className="w-4 h-4 text-orange-600" aria-hidden="true" />
            </button>
            <h3 className="text-gray-900 mb-4">
              Recomendaciones Técnicas Prioritarias
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:bg-orange-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-200 rounded-lg mt-1 flex-shrink-0">
                    <Zap className="w-5 h-5 text-orange-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-2 text-orange-900">
                      1. Mejora Envolvente Térmica
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      Ahorro estimado: 18 kWh/m²·año
                    </p>
                    <ul className="text-sm text-orange-600 space-y-1 mb-3">
                      <li>• Aislamiento fachadas (SATE 10cm)</li>
                      <li>• Ventanas PVC doble acristalamiento</li>
                      <li>• Aislamiento cubierta</li>
                    </ul>
                    <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-sm">
                      <span className="text-orange-800">Coste: €180,000</span>
                      <span className="text-orange-900">ROI: 8 años</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:bg-orange-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-200 rounded-lg mt-1 flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-orange-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-2 text-orange-900">
                      2. Actualización Sistema HVAC
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      Ahorro estimado: 12 kWh/m²·año
                    </p>
                    <ul className="text-sm text-orange-600 space-y-1 mb-3">
                      <li>• Bomba de calor aerotérmica</li>
                      <li>• Sistema de control inteligente</li>
                      <li>• Recuperación de calor</li>
                    </ul>
                    <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-sm">
                      <span className="text-orange-800">Coste: €150,000</span>
                      <span className="text-orange-900">ROI: 7 años</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:bg-orange-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-200 rounded-lg mt-1 flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-orange-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-2 text-orange-900">
                      3. Iluminación LED Completa
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      Ahorro estimado: 6 kWh/m²·año
                    </p>
                    <ul className="text-sm text-orange-600 space-y-1 mb-3">
                      <li>• Sustitución completa a LED</li>
                      <li>• Sensores de presencia</li>
                      <li>• Control de luz natural</li>
                    </ul>
                    <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-sm">
                      <span className="text-orange-800">Coste: €45,000</span>
                      <span className="text-orange-900">ROI: 4 años</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:bg-orange-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-200 rounded-lg mt-1 flex-shrink-0">
                    <Building2 className="w-5 h-5 text-orange-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-2 text-orange-900">
                      4. Instalación Solar Fotovoltaica
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      Ahorro estimado: 22 kWh/m²·año
                    </p>
                    <ul className="text-sm text-orange-600 space-y-1 mb-3">
                      <li>• 100 kWp en cubierta</li>
                      <li>• Autoconsumo con baterías</li>
                      <li>• Sistema de monitorización</li>
                    </ul>
                    <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-sm">
                      <span className="text-orange-800">Coste: €75,000</span>
                      <span className="text-orange-900">ROI: 6 años</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:bg-orange-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-200 rounded-lg mt-1 flex-shrink-0">
                    <Droplets className="w-5 h-5 text-orange-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-2 text-orange-900">
                      5. Optimización Sistema de Aguas
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      Ahorro estimado: 35% consumo agua
                    </p>
                    <ul className="text-sm text-orange-600 space-y-1 mb-3">
                      <li>• Sistema recogida agua pluvial</li>
                      <li>• Grifería termostática bajo consumo</li>
                      <li>• Reutilización aguas grises</li>
                    </ul>
                    <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-sm">
                      <span className="text-orange-800">Coste: €28,000</span>
                      <span className="text-orange-900">ROI: 5 años</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:bg-orange-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-200 rounded-lg mt-1 flex-shrink-0">
                    <CarFront className="w-5 h-5 text-orange-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm mb-2 text-orange-900">
                      6. Electrolineras en Aparcamiento
                    </h4>
                    <p className="text-sm text-orange-700 mb-2">
                      Incremento valor: €45,000
                    </p>
                    <ul className="text-sm text-orange-600 space-y-1 mb-3">
                      <li>• 12 puntos de recarga 22 kW</li>
                      <li>• Sistema gestión inteligente</li>
                      <li>• Preparación para expansión</li>
                    </ul>
                    <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-sm">
                      <span className="text-orange-800">Coste: €36,000</span>
                      <span className="text-orange-900">ROI: 8 años</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm mb-4 text-gray-900">
              Impacto Total de Mejoras Propuestas (6 Actuaciones)
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center bg-white rounded-lg p-3 relative group">
                <button
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Ver explicación del cálculo"
                >
                  <CircleHelp className="w-3 h-3 text-blue-600" aria-hidden="true" />
                </button>
                <div className="text-xs text-gray-600 mb-2">
                  Reducción Consumo
                </div>
                <div className="text-2xl text-blue-600 mb-1">-58</div>
                <div className="text-xs text-gray-500">kWh/m²·año</div>
                <div className="text-xs text-blue-600 mt-2">Clase A → A+</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3 relative group">
                <button
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Ver explicación del cálculo"
                >
                  <CircleHelp className="w-3 h-3 text-green-600" aria-hidden="true" />
                </button>
                <div className="text-xs text-gray-600 mb-2">Reducción CO₂</div>
                <div className="text-2xl text-green-600 mb-1">-11.4</div>
                <div className="text-xs text-gray-500">kg CO₂eq/m²·año</div>
                <div className="text-xs text-green-600 mt-2">
                  -68% emisiones
                </div>
              </div>
              <div className="text-center bg-white rounded-lg p-3 relative group">
                <button
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Ver explicación del cálculo"
                >
                  <CircleHelp className="w-3 h-3 text-orange-600" aria-hidden="true" />
                </button>
                <div className="text-xs text-gray-600 mb-2">
                  Inversión Total
                </div>
                <div className="text-2xl text-orange-600 mb-1">€514k</div>
                <div className="text-xs text-gray-500">Coste completo</div>
                <div className="text-xs text-orange-600 mt-2">
                  ROI: 6.3 años
                </div>
              </div>
              <div className="text-center bg-white rounded-lg p-3 relative group">
                <button
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Ver explicación del cálculo"
                >
                  <CircleHelp className="w-3 h-3 text-purple-600" aria-hidden="true" />
                </button>
                <div className="text-xs text-gray-600 mb-2">Ahorro Anual</div>
                <div className="text-2xl text-purple-600 mb-1">€82k</div>
                <div className="text-xs text-gray-500">Por año</div>
                <div className="text-xs text-purple-600 mt-2">
                  9.3% del consumo
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm mb-3">
              Cronograma de Implementación Recomendado
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-center min-w-[70px]">
                  <div className="text-xs text-green-700">Fase 1</div>
                  <div className="text-xs text-green-900">2025 Q1-Q2</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-green-900 mb-1">
                    Iluminación LED
                  </div>
                  <div className="text-xs text-green-700">
                    ROI más corto, implementación rápida, mejora inmediata
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="text-center min-w-[70px]">
                  <div className="text-xs text-yellow-700">Fase 2</div>
                  <div className="text-xs text-yellow-900">2025 Q3-Q4</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-yellow-900 mb-1">
                    Solar Fotovoltaica
                  </div>
                  <div className="text-xs text-yellow-700">
                    Mayor ahorro energético, subvenciones disponibles
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="text-center min-w-[70px]">
                  <div className="text-xs text-orange-700">Fase 3</div>
                  <div className="text-xs text-orange-900">2026 Q1-Q3</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-orange-900 mb-1">
                    Sistema HVAC
                  </div>
                  <div className="text-xs text-orange-700">
                    Mejora integral de climatización y confort
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-center min-w-[70px]">
                  <div className="text-xs text-blue-700">Fase 4</div>
                  <div className="text-xs text-blue-900">2026 Q4 - 2027</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-blue-900 mb-1">
                    Envolvente Térmica
                  </div>
                  <div className="text-xs text-blue-700">
                    Intervención más compleja, requiere coordinación con
                    inquilinos
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-l-4 border-orange-500 bg-orange-50 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <CircleAlert className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <h4 className="text-sm text-orange-900 mb-2">
                  Análisis IA - Priorización Técnica
                </h4>
                <p className="text-xs text-orange-700 mb-3">
                  Basado en el análisis del Libro del Edificio al 100% de
                  completitud, se recomienda priorizar las actuaciones por ROI y
                  facilidad de implementación. La combinación de las 6 medidas
                  propuestas permitirá alcanzar una reducción del 68% en consumo
                  energético, optimizar el uso de agua en un 35%, mejorar la
                  movilidad sostenible y posicionar el edificio en cumplimiento
                  anticipado de EPBD 2030.
                </p>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-xs text-orange-900 mb-2">
                    Consideraciones importantes:
                  </div>
                  <ul className="space-y-1 text-xs text-orange-700">
                    <li>
                      • Completar Libro del Edificio antes de intervenciones
                      mayores
                    </li>
                    <li>
                      • Solicitar subvenciones PREE y fondos NextGeneration EU
                      (hasta 40% coste)
                    </li>
                    <li>• Coordinar obras con períodos de baja ocupación</li>
                    <li>
                      • Obtener IEE (Inspección de Eficiencia Energética)
                      actualizada
                    </li>
                    <li>
                      • Considerar certificación BREEAM/LEED para aumentar valor
                      del activo
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
