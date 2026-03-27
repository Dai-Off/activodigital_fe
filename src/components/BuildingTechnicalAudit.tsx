import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Building2,
  CircleAlert,
  CircleCheckBig,
  Droplets,
  FileCheck,
  Lightbulb,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import { getTechnicalAudit } from "../services/technicalAudit";
import type { TechnicalAuditResult } from "../types/technicalAudit";
import BuildingTechnicalAuditSkeleton from "./BuildingTechnicalAuditSkeleton";

export default function BuildingTechnicalAudit() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TechnicalAuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group missing data by category (e.g., ESG)
  const groupedMissingData = useMemo(() => {
    const rawMissingData = data?.missingData;
    if (!rawMissingData) return [];

    const result: (string | { group: string; items: string[] })[] = [];
    const esgItems: string[] = [];

    rawMissingData.forEach((item) => {
      if (item.startsWith("Datos ESG: ")) {
        esgItems.push(item.replace("Datos ESG: ", ""));
      } else {
        result.push(item);
      }
    });

    if (esgItems.length > 0) {
      result.push({ group: "Datos ESG faltantes:", items: esgItems });
    }

    return result;
  }, [data?.missingData]);

  useEffect(() => {
    async function loadAudit() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getTechnicalAudit(id);
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Error al cargar la auditoría técnica");
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, [id]);

  if (loading) {
    return <BuildingTechnicalAuditSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-lg text-center border border-red-200 shadow-sm">
          <CircleAlert className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium mb-2">
            Error de Auditoría Técnica
          </h3>
          <p>{error || "No se pudieron cargar los datos."}</p>
        </div>
      </div>
    );
  }

  const {
    isComplete,
    missingData: rawMissingData,
    completionPercentage,
    tasks,
    energyImprovements,
    summary,
  } = data;

  // Derive "Estado Instalaciones" from pending tasks
  const hasTaskCategory = (category: string) =>
    tasks.some((t) => t.category === category);

  const facilityStatus = [
    { name: "documentacion", ok: !hasTaskCategory("documentation") },
    {
      name: "certificados",
      ok: !hasTaskCategory("energy") && !hasTaskCategory("compliance"),
    },
    { name: "instalaciones", ok: !hasTaskCategory("energy") },
    { name: "mantenimiento", ok: !hasTaskCategory("maintenance") },
    { name: "seguridad", ok: !hasTaskCategory("safety") },
  ];

  const getImprovementIcon = (type: string) => {
    switch (type) {
      case "insulation":
        return <Zap className="w-5 h-5 text-orange-700" />;
      case "windows":
        return <Wrench className="w-5 h-5 text-orange-700" />;
      case "heating":
        return <Droplets className="w-5 h-5 text-orange-700" />;
      case "lighting":
        return <Lightbulb className="w-5 h-5 text-orange-700" />;
      case "renewable":
        return <Building2 className="w-5 h-5 text-orange-700" />;
      case "hvac":
        return <TrendingUp className="w-5 h-5 text-orange-700" />;
      default:
        return <Wrench className="w-5 h-5 text-orange-700" />;
    }
  };

  const getPriorityFases = () => {
    // Generate a simple schedule based on priority
    const schedule = [];
    if (energyImprovements.some((i) => i.priority === "high")) {
      schedule.push({
        fase: "Fase 1",
        name: "Actuaciones de Alta Prioridad",
        detail: "ROI corto o impacto crítico en clase energética",
        bg: "bg-green-50 border-green-500",
        txHeader: "text-green-700",
        txTitle: "text-green-900",
        txDesc: "text-green-700",
      });
    }
    if (energyImprovements.some((i) => i.priority === "medium")) {
      schedule.push({
        fase: "Fase 2",
        name: "Actuaciones de Prioridad Media",
        detail: "Mejoras sistemáticas en instalaciones",
        bg: "bg-yellow-50 border-yellow-500",
        txHeader: "text-yellow-700",
        txTitle: "text-yellow-900",
        txDesc: "text-yellow-700",
      });
    }
    if (energyImprovements.some((i) => i.priority === "low")) {
      schedule.push({
        fase: "Fase 3",
        name: "Optimizaciones Adicionales",
        detail: "Mejoras a largo plazo y automatización",
        bg: "bg-blue-50 border-blue-500",
        txHeader: "text-blue-700",
        txTitle: "text-blue-900",
        txDesc: "text-blue-700",
      });
    }
    return schedule;
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {!isComplete && rawMissingData && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm mb-2">
          <div className="flex items-start gap-3">
            <CircleAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900">
                Datos insuficientes para auditoría completa
              </h3>
              <p className="text-xs text-amber-800 mt-1">
                Para obtener un análisis técnico y financiero 100% preciso, es
                necesario completar la siguiente información:
              </p>
              <ul className="mt-4 space-y-3">
                {groupedMissingData.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs w-full text-amber-700 bg-amber-100/40 p-3 rounded-xl border border-amber-200/50 transition-all hover:bg-amber-100/60 shadow-sm"
                  >
                    {typeof item === "string" ? (
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        <span className="leading-relaxed font-semibold">
                          {item}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                          <span className="leading-relaxed font-bold text-amber-900">
                            {item.group}
                          </span>
                        </div>
                        <ul className="ml-5 space-y-1.5 border-l-2 border-amber-200/50 pl-4 py-1">
                          {item.items.map((subItem, sidx) => (
                            <li
                              key={sidx}
                              className="flex items-start gap-2 opacity-90 transition-opacity hover:opacity-100"
                            >
                              <span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></span>
                              <span className="leading-relaxed">{subItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

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
            <FileCheck
              className="w-6 h-6 text-blue-600 flex-shrink-0"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Completado</span>
                <span className="text-sm text-blue-700">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  role="progressbar"
                  aria-valuenow={completionPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progreso del Libro del Edificio"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="pt-3 border-t border-blue-200 space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Tareas pendientes:</span>
                <span className="text-gray-900 font-medium">
                  {summary.totalTasks}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-3">
                <span>(Generadas por Análisis IA)</span>
              </div>

              {tasks && tasks.length > 0 && (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="text-xs text-gray-700 flex items-start gap-2 bg-white/60 p-2.5 rounded-lg border border-blue-200/50 shadow-sm transition-all hover:bg-white"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          task.priority === "high"
                            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                            : task.priority === "medium"
                            ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                            : "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]"
                        }`}
                        title={`Prioridad ${task.priority}`}
                      ></span>
                      <div className="min-w-0">
                        <p className="font-semibold text-blue-900 leading-tight mb-0.5">
                          {task.title}
                        </p>
                        <p className="text-[10px] text-gray-500 leading-relaxed truncate">
                          {task.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Estado Instalaciones</h3>
            <CircleCheckBig
              className="w-6 h-6 text-green-600 flex-shrink-0"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-2">
            {facilityStatus.map((status, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm hover:bg-white/50 p-2 rounded transition-colors"
              >
                <span className="text-gray-700 capitalize truncate">
                  {status.name}
                </span>
                {status.ok ? (
                  <span className="px-3 py-1 rounded-lg text-sm flex-shrink-0 bg-green-200 text-green-800">
                    OK
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg text-sm flex-shrink-0 bg-yellow-200 text-yellow-800">
                    Pendiente
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative group">
            <h3 className="text-gray-900 mb-4">
              Recomendaciones Técnicas Prioritarias (
              {summary.recommendedImprovements})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {energyImprovements.map((improvement) => (
                <div
                  key={improvement.id}
                  className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-200 rounded-lg mt-1 flex-shrink-0">
                      {getImprovementIcon(improvement.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-2 text-orange-900">
                        {improvement.title}
                      </h4>
                      <p className="text-sm text-orange-700 mb-2">
                        Ahorro: {improvement.estimatedSavingsKwhPerM2}{" "}
                        kWh/m²·año
                      </p>
                      <p className="text-xs text-orange-600 mb-3">
                        {improvement.description}
                      </p>
                      <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-sm">
                        <span className="text-orange-800">
                          Coste: €
                          {(improvement.estimatedCost || 0).toLocaleString()}
                        </span>
                        <span className="text-orange-900">
                          ROI: {improvement.estimatedRoi || "-"} años
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {energyImprovements.length === 0 && (
                <div className="col-span-full text-center p-6 text-gray-500">
                  No se han identificado recomendaciones prioritarias. El
                  edificio tiene un excelente desempeño.
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm mb-4 text-gray-900">
              Impacto Total de Mejoras Propuestas
            </h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-2">
                  Reducción Consumo
                </div>
                <div className="text-2xl text-blue-600 mb-1">
                  -{data.potentialSavingsKwhPerM2}
                </div>
                <div className="text-xs text-gray-500">kWh/m²·año</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-2">Reducción CO₂</div>
                <div className="text-2xl text-green-600 mb-1">
                  -{summary.totalCo2Reduction}
                </div>
                <div className="text-xs text-gray-500">kg CO₂eq/m²·año</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-2">
                  Inversión Total
                </div>
                <div className="text-2xl text-orange-600 mb-1">
                  €{((summary.totalInvestment || 0) / 1000).toFixed(1)}k
                </div>
                <div className="text-xs text-gray-500">Estimada</div>
              </div>
              <div className="text-center bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-2">Ahorro Anual</div>
                <div className="text-2xl text-purple-600 mb-1">
                  €{((summary.totalAnnualSavings || 0) / 1000).toFixed(1)}k
                </div>
                <div className="text-xs text-gray-500">
                  ROI: {summary.roiAggregated} años
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm mb-3">
              Cronograma de Implementación Recomendado
            </h3>
            <div className="space-y-2">
              {getPriorityFases().map((fase, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${fase.bg}`}
                >
                  <div className="text-center min-w-[70px]">
                    <div className={`text-xs ${fase.txHeader}`}>
                      {fase.fase}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs ${fase.txTitle} mb-1`}>
                      {fase.name}
                    </div>
                    <div className={`text-xs ${fase.txDesc}`}>
                      {fase.detail}
                    </div>
                  </div>
                </div>
              ))}
              {getPriorityFases().length === 0 && (
                <div className="text-sm text-gray-500 p-2">
                  No hay fases programadas.
                </div>
              )}
            </div>
          </div>

          <div className="border-l-4 border-orange-500 bg-orange-50 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <CircleAlert
                className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1">
                <h4 className="text-sm text-orange-900 mb-2">
                  Análisis IA - Priorización Técnica
                </h4>
                <p className="text-xs text-orange-700 mb-3">
                  Basado en el análisis del Libro del Edificio al{" "}
                  {completionPercentage}% de completitud, se recomienda
                  priorizar las {summary.recommendedImprovements} actuaciones
                  listadas por ROI y facilidad de implementación. El impacto
                  económico y medioambiental estimado subraya la viabilidad del
                  plan.
                </p>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-xs text-orange-900 mb-2">
                    Consideraciones activas:
                  </div>
                  <ul className="space-y-1 text-xs text-orange-700">
                    {summary.highPriorityTasks > 0 && (
                      <li>
                        • Completar las {summary.highPriorityTasks} tareas
                        urgentes pendientes en la documentación.
                      </li>
                    )}
                    <li>
                      • Solicitar subvenciones PREE y fondos NextGeneration EU
                      relacionadas con la envolvente.
                    </li>
                    <li>
                      • Actualizar los módulos del Libro en la plataforma tras
                      realizar cada mejora.
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
