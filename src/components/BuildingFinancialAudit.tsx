import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  ChartColumn,
  CircleCheckBig,
  CircleHelp,
  Euro,
  MapPin,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFinancialAudit } from "../services/financialAudit";
import type { FinancialAuditResult, InvestmentScenario } from "../types/financialAudit";
import BuildingFinancialAuditSkeleton from "./BuildingFinancialAuditSkeleton";

export default function BuildingFinancialAudit() {
  const { id } = useParams<{ id: string }>();
  const [auditData, setAuditData] = useState<FinancialAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await getFinancialAudit(id);
        setAuditData(response.data);
      } catch (err: any) {
        setError(err.message || "Error al cargar auditoría financiera");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return <BuildingFinancialAuditSkeleton />;
  }

  if (error || !auditData) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-600 p-8 space-y-4 text-center">
        <ChartColumn className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-medium text-gray-900">
          Validación de Datos Requerida
        </p>
        <p className="max-w-md text-gray-500">
          {error ||
            "No se encontraron datos de la auditoría financiera para este edificio. Por favor, asegúrese de haber cargado el informe financiero correspondiente."}
        </p>
      </div>
    );
  }

  const { currentState, postImprovementScenario, recommendations, scenarios } = auditData;

  const formatM = (val: number | null) =>
    val ? `€${(val / 1000000).toFixed(2)}M` : "€0.00M";
  const formatK = (val: number | null) =>
    val ? `€${Math.round(val / 1000)}k` : "€0k";
  const formatPct = (val: number | null) =>
    val ? `${val.toFixed(2)}%` : "0.00%";

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
              <CircleHelp
                className="w-3 h-3 text-blue-600"
                aria-hidden="true"
              />
            </button>
            <div className="text-sm text-gray-600 mb-2">Valor del Activo</div>
            <div className="text-2xl text-gray-900 mb-1">
              {formatM(currentState.marketValue)}
            </div>
            <div className="text-sm text-gray-500">
              {currentState.pricePerSqm ? `€${Math.round(currentState.pricePerSqm)}/m²` : "— €/m²"}
            </div>
            <div className="text-sm text-blue-600 mt-2">
              {currentState.squareMeters ? `${Math.round(currentState.squareMeters)}m² construidos` : "— m² construidos"}
            </div>
          </div>
          <div className="border-l-4 border-orange-500 pl-4 relative group/metric hover:bg-orange-50 p-3 rounded-r-lg transition-colors">
            <button
              className="absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover/metric:opacity-100 transition-all shadow-sm focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              title="Más información sobre Deuda Pendiente"
              aria-label="Más información sobre Deuda Pendiente"
            >
              <CircleHelp
                className="w-3 h-3 text-orange-600"
                aria-hidden="true"
              />
            </button>
            <div className="text-sm text-gray-600 mb-2">Deuda Pendiente</div>
            <div className="text-2xl text-gray-900 mb-1">--</div>
            <div className="text-sm text-gray-500">--% LTV</div>
            <div className="text-sm text-orange-600 mt-2">
              Sin datos de deuda registrados
            </div>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 relative group/metric hover:bg-purple-50 p-3 rounded-r-lg transition-colors">
            <button
              className="absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover/metric:opacity-100 transition-all shadow-sm focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Más información sobre Ingresos Anuales"
              aria-label="Más información sobre Ingresos Anuales"
            >
              <CircleHelp
                className="w-3 h-3 text-purple-600"
                aria-hidden="true"
              />
            </button>
            <div className="text-sm text-gray-600 mb-2">Ingresos Anuales</div>
            <div className="text-2xl text-gray-900 mb-1">
              {formatK(currentState.noi)}
            </div>
            <div className="text-sm text-gray-500">
              {currentState.rentPerSqmPerMonth ? `€${currentState.rentPerSqmPerMonth.toFixed(1)}/m²·mes` : "— €/m²·mes"}
            </div>
            <div className="text-sm text-purple-600 mt-2">
              {currentState.occupancyPct !== null ? `${Math.round(currentState.occupancyPct)}% ocupación` : "0% ocupación"}
            </div>
          </div>
          <div className="border-l-4 border-green-500 bg-green-50 pl-4 relative group/metric hover:bg-green-100 p-3 rounded-r-lg transition-colors">
            <button
              className="absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover/metric:opacity-100 transition-all shadow-sm focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Más información sobre ROI Actual"
              aria-label="Más información sobre ROI Actual"
            >
              <CircleHelp
                className="w-3 h-3 text-green-600"
                aria-hidden="true"
              />
            </button>
            <div className="text-sm text-green-700 mb-2">ROI Actual</div>
            <div className="text-2xl text-green-600 mb-1">
              {formatPct(currentState.roiPct)}
            </div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              {currentState.roiPct && currentState.roiPct > 0
                ? "ROI Positivo"
                : "ROI Negativo"}
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
              <CircleHelp
                className="w-4 h-4 text-blue-600"
                aria-hidden="true"
              />
            </button>
            <h3 className="text-gray-900 mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" aria-hidden="true" />
              Análisis de Mercado{auditData.address ? ` - ${auditData.address}` : ""}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-5 relative group/metric hover:bg-blue-100 transition-colors border border-blue-200">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Precio Medio Zona"
                >
                  <CircleHelp
                    className="w-2.5 h-2.5 text-blue-600"
                    aria-hidden="true"
                  />
                </button>
                <div className="text-xs text-gray-700 mb-2">
                  Precio Medio Zona
                </div>
                <div className="text-2xl text-blue-600 mb-2">
                  {currentState.pricePerSqm ? `€${Math.round(currentState.pricePerSqm)}/m²` : "--"}
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  {currentState.pricePerSqm ? "Basado en valor de activo" : "Dato no disponible"}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-gray-200 border border-gray-300 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Precio Actual Activo"
                >
                  <CircleHelp
                    className="w-2.5 h-2.5 text-gray-600"
                    aria-hidden="true"
                  />
                </button>
                <div className="text-xs text-gray-700 mb-2">
                  Precio Actual Activo
                </div>
                <div className="text-2xl text-gray-900 mb-2">
                  {currentState.marketValue > 0 ? formatM(currentState.marketValue) : "--"}
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  {currentState.marketValue > 0 ? `${currentState.squareMeters ? Math.round(currentState.squareMeters) + ' m²' : 'Superficie no registrada'}` : "Valor no registrado"}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Potencial Post-Mejora"
                >
                  <CircleHelp
                    className="w-2.5 h-2.5 text-green-600"
                    aria-hidden="true"
                  />
                </button>
                <div className="text-xs text-gray-700 mb-2">
                  Potencial Post-Mejora
                </div>
                <div className="text-2xl text-green-600 mb-2">
                  {postImprovementScenario.futureValue > 0 ? formatM(postImprovementScenario.futureValue) : "--"}
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  {postImprovementScenario.valueIncrease > 0 ? `+${formatK(postImprovementScenario.valueIncrease)} revalorización` : "Sin datos de mejoras"}
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
              <CircleHelp
                className="w-3 h-3 text-purple-600"
                aria-hidden="true"
              />
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
                  <CircleHelp
                    className="w-2.5 h-2.5 text-orange-600"
                    aria-hidden="true"
                  />
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
                    <span className="text-gray-900">
                      {formatM(currentState.marketValue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      Coste mejoras y rehab:
                    </span>
                    <span className="text-orange-600">
                      {formatK(postImprovementScenario.totalInvestment)}
                    </span>
                  </div>
                  <div className="pt-3 border-t-2 border-orange-300 flex justify-between">
                    <span className="text-xs text-orange-900">
                      Inversión total:
                    </span>
                    <span className="text-lg text-orange-900">
                      {formatK(postImprovementScenario.totalInvestment)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm z-10"
                  title="Más información sobre Retorno Esperado"
                >
                  <CircleHelp
                    className="w-2.5 h-2.5 text-green-600"
                    aria-hidden="true"
                  />
                </button>
                <h4 className="text-xs mb-3 text-green-900 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  Retorno Esperado
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">Valor actual:</span>
                    <span className="text-gray-900">
                      {formatM(currentState.marketValue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      Revalorización (+
                      {formatPct(postImprovementScenario.revaluationPct)}):
                    </span>
                    <span className="text-green-600">
                      {formatK(postImprovementScenario.valueIncrease)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">
                      Ahorro energético anual:
                    </span>
                    <span className="text-green-600">
                      {formatK(postImprovementScenario.annualEnergySavings)}/año
                    </span>
                  </div>
                  <div className="pt-3 border-t-2 border-green-300 flex justify-between">
                    <span className="text-xs text-green-900">
                      Valor post-mejora:
                    </span>
                    <span className="text-lg text-green-900">
                      {formatM(postImprovementScenario.futureValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white relative group/metric">
              <button
                className="absolute top-2 right-2 p-0.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                title="Más información sobre Ganancia Neta Estimada"
              >
                <CircleHelp
                  className="w-2.5 h-2.5 text-white"
                  aria-hidden="true"
                />
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-100 mb-1">
                    Ganancia Neta Estimada
                  </div>
                  <div className="text-3xl">
                    {formatK(postImprovementScenario.netProfit)}
                  </div>
                  <div className="text-xs text-blue-100 mt-2">
                    ROI de la inversión:{" "}
                    {formatPct(postImprovementScenario.projectRoiPct)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-blue-100 mb-1">
                    Período de Recuperación
                  </div>
                  <div className="text-3xl">
                    {((postImprovementScenario.paybackMonths || 0) / 12).toFixed(1)}
                  </div>
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
              <CircleHelp
                className="w-3 h-3 text-amber-600"
                aria-hidden="true"
              />
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
              {scenarios.map((scenario: InvestmentScenario) => {
                const colorSchemes: { [key: number]: { bg: string; border: string; text: string; accent: string } } = {
                  1: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-900', accent: 'text-gray-700' },
                  2: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', accent: 'text-blue-700' },
                  3: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', accent: 'text-purple-700' },
                  4: { bg: 'bg-gradient-to-br from-amber-100 to-amber-50', border: 'border-amber-400', text: 'text-amber-900', accent: 'text-amber-700' },
                  5: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', accent: 'text-indigo-700' },
                };
                const colors = colorSchemes[scenario.id] || colorSchemes[1];
                const borderWidth = scenario.isOptimal ? 'border-4' : 'border-2';
                const epbdColor = ['A', 'A+', 'B'].includes(scenario.epbdClass) ? 'text-green-700' :
                  ['C', 'D'].includes(scenario.epbdClass) ? 'text-yellow-600' : 'text-red-600';

                return (
                  <div key={scenario.id} className={`${colors.bg} rounded-lg p-3 ${borderWidth} ${colors.border} relative ${scenario.isOptimal ? 'shadow-lg' : ''}`}>
                    {scenario.isOptimal && (
                      <div className="absolute -top-3 -right-3 bg-amber-500 text-white rounded-full p-2 shadow-lg">
                        <Award className="w-4 h-4" aria-hidden="true" />
                      </div>
                    )}
                    <div className="text-center mb-3">
                      <div className={`text-xs ${colors.accent} mb-1 flex items-center justify-center gap-1`}>
                        {scenario.isOptimal && <Star className="w-3 h-3 fill-amber-700" aria-hidden="true" />}
                        Escenario {scenario.id}
                      </div>
                      <h4 className={`text-sm ${colors.text} mb-2`}>{scenario.name}</h4>
                      <div className={`text-xs ${colors.accent}`}>{scenario.description}</div>
                      {scenario.isOptimal && (
                        <div className="mt-2 bg-amber-200 text-amber-900 text-xs px-2 py-1 rounded-full inline-block">
                          RECOMENDADO
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className={`bg-white rounded p-2 ${scenario.isOptimal ? 'border border-amber-200' : ''}`}>
                        <div className="text-gray-600 mb-1">Inversión</div>
                        <div className={colors.accent}>{scenario.investment === 0 ? '€0' : formatK(scenario.investment)}</div>
                      </div>
                      <div className={`bg-white rounded p-2 ${scenario.isOptimal ? 'border border-amber-200' : ''}`}>
                        <div className="text-gray-600 mb-1">Valor Final</div>
                        <div className={colors.accent}>{formatM(scenario.futureValue)}</div>
                      </div>
                      <div className={`bg-white rounded p-2 ${scenario.isOptimal ? 'border border-amber-200' : ''}`}>
                        <div className="text-gray-600 mb-1">Ahorro/año</div>
                        <div className={scenario.annualSavings > 0 ? 'text-green-600' : colors.accent}>
                          {scenario.annualSavings === 0 ? '€0' : formatK(scenario.annualSavings)}
                        </div>
                      </div>
                      <div className={`bg-white rounded p-2 ${scenario.isOptimal ? 'border border-amber-200' : ''}`}>
                        <div className="text-gray-600 mb-1">Clase EPBD</div>
                        <div className={epbdColor}>{scenario.epbdClass}</div>
                      </div>
                      <div className={`bg-white rounded p-2 ${scenario.isOptimal ? 'border border-amber-200' : ''}`}>
                        <div className="text-gray-600 mb-1">ROI Total</div>
                        <div className={colors.accent}>{scenario.roiPct !== null ? `${scenario.roiPct.toFixed(1)}%` : '0%'}</div>
                      </div>
                      <div className={`bg-white rounded p-2 ${scenario.isOptimal ? 'border border-amber-200' : ''}`}>
                        <div className="text-gray-600 mb-1">Payback</div>
                        <div className={colors.accent}>{scenario.paybackYears !== null ? `${scenario.paybackYears} años` : 'N/A'}</div>
                      </div>
                    </div>
                    <div className={`mt-3 pt-3 border-t ${scenario.isOptimal ? 'border-amber-300' : colors.border}`}>
                      <div className={`text-xs ${colors.accent}`}>
                        {scenario.pros.map((pro, i) => (
                          <div key={i} className="mb-1">✓ {pro}</div>
                        ))}
                        {scenario.cons.map((con, i) => (
                          <div key={i}>✗ {con}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-lg flex-shrink-0">
                  <Award
                    className="w-5 h-5 text-amber-700"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-amber-900 mb-2">
                    ¿Por qué "Mejoras Completas" es el escenario óptimo?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-xs text-amber-800">
                    <div>
                      <div className="font-medium mb-1">Mejor ROI Total:</div>
                      <div>
                        Con un retorno del {formatPct(postImprovementScenario.projectRoiPct)} sobre la inversión, supera
                        significativamente a la mayoría de los escenarios conservadores,
                        maximizando el beneficio económico neto.
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Equilibrio Óptimo:</div>
                      <div>
                        Logra el mejor balance entre inversión inicial ({formatK(postImprovementScenario.totalInvestment)}),
                        payback razonable ({((postImprovementScenario.paybackMonths || 0) / 12).toFixed(1)} años) y revalorización estimada del activo
                        (+{formatK(postImprovementScenario.valueIncrease)}).
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">
                        Eficiencia Energética:
                      </div>
                      <div>
                        Alcanza una mejora sustancial garantizando el ahorro de {formatK(postImprovementScenario.annualEnergySavings)} anuales
                        sin sobrecostes innecesarios en certificaciones de lujo.
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
              <CircleHelp
                className="w-3 h-3 text-indigo-600"
                aria-hidden="true"
              />
            </button>
            <h3 className="text-sm mb-4">Opciones de Financiación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 relative group/metric">
                <button
                  className="absolute top-2 right-2 p-0.5 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover/metric:opacity-100 transition-opacity shadow-sm"
                  title="Más información sobre Fondos Europeos"
                >
                  <CircleHelp
                    className="w-2.5 h-2.5 text-purple-600"
                    aria-hidden="true"
                  />
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
                  <CircleHelp
                    className="w-2.5 h-2.5 text-blue-600"
                    aria-hidden="true"
                  />
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
                  <CircleHelp
                    className="w-2.5 h-2.5 text-green-600"
                    aria-hidden="true"
                  />
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
              <ChartColumn
                className="w-5 h-5 text-green-600 mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1">
                <h4 className="text-sm text-green-900 mb-2">
                  Análisis IA - Viabilidad Financiera
                </h4>
                <p className="text-xs text-green-700 mb-3">
                  La inversión de{" "}
                  {formatK(postImprovementScenario.totalInvestment)} en mejoras
                  estimadas generará un incremento de valor del{" "}
                  {formatPct(postImprovementScenario.revaluationPct)},
                  alcanzando {formatM(postImprovementScenario.futureValue)}. Con
                  una ganancia neta de{" "}
                  {formatK(postImprovementScenario.netProfit)} y un ROI actual
                  del {formatPct(currentState.roiPct)}, el activo presenta gran
                  potencial comercial. El ahorro energético anual de{" "}
                  {formatK(postImprovementScenario.annualEnergySavings)} aporta
                  a una ganancia neta.
                </p>
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleCheckBig
                      className="w-4 h-4 text-green-600"
                      aria-hidden="true"
                    />
                    <span className="text-xs text-green-900">
                      Recomendaciones basadas en IA
                    </span>
                  </div>
                  <div className="text-xs text-green-700 space-y-1">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec: string, i: number) => (
                        <div key={i}>• {rec}</div>
                      ))
                    ) : (
                      <div>• Sin recomendaciones en este momento.</div>
                    )}
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
