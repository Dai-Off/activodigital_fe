import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CircleCheckBig,
  CircleHelp,
  FileText,
  Lightbulb,
  Scale,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import BuildingRegulatoryAuditSkeleton from "./BuildingRegulatoryAuditSkeleton";
import { regulatoryAuditApi } from "../services/regulatoryAudit";
import { type RegulatoryAuditResult } from "../types/regulatoryAudit";

export default function BuildingRegulatoryAudit() {
  const { id: buildingId } = useParams<{ id: string }>();
  const [data, setData] = useState<RegulatoryAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!buildingId) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await regulatoryAuditApi.getRegulatoryAudit(buildingId);
        setData(result);
      } catch (err) {
        console.error("Error fetching regulatory audit:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [buildingId]);

  if (isLoading || !data) {
    return <BuildingRegulatoryAuditSkeleton />;
  }

  const { current_state, target_state, gap_analysis, mevs, certificates, summary } =
    data;

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
              <CircleCheckBig
                className="w-4 h-4 md:w-6 md:h-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Normativas
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">
            {summary.normatives_compliant}/{summary.normatives_total}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Cumplidas
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
              <Sparkles
                className="w-4 h-4 md:w-6 md:h-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                MEVs
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">
            {summary.mevs_implemented}/{summary.mevs_total}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Implementadas
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg">
              <FileText
                className="w-4 h-4 md:w-6 md:h-6 text-purple-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Certificados
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">
            {summary.certificates_active}/{summary.certificates_total}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Vigentes
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
              <TriangleAlert
                className="w-4 h-4 md:w-6 md:h-6 text-orange-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Auditorías
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">
            {summary.pending_audits_count}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 truncate">
            {summary.pending_audits_text}
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
            <CircleHelp
              className="w-3 h-3 text-purple-600"
              aria-hidden="true"
            />
          </button>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-sm md:text-base">Estado Actual</h3>
            <span className="px-2 md:px-3 py-1 rounded-full text-xs flex-shrink-0 bg-orange-100 text-orange-700">
              Clase {current_state.energy_class}
            </span>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Consumo energético:
              </div>
              <div className="text-lg md:text-xl">
                {current_state.consumption_kwh_m2_year || "--"} kWh/m
                <sup>2</sup>·año
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Emisiones CO₂:</div>
              <div className="text-lg md:text-xl">
                {current_state.emissions_kg_co2_m2_year || "--"} kg CO
                <sub>2</sub>eq/m<sup>2</sup>·año
              </div>
            </div>
            {current_state.heating_demand !== undefined && current_state.heating_demand !== null && (
              <div>
                <div className="text-xs text-gray-600 mb-1">Demanda Calefacción:</div>
                <div className="text-lg md:text-xl">
                  {current_state.heating_demand} kWh/m<sup>2</sup>·año
                </div>
              </div>
            )}
            {current_state.cooling_demand !== undefined && current_state.cooling_demand !== null && (
              <div>
                <div className="text-xs text-gray-600 mb-1">Demanda Refrigeración:</div>
                <div className="text-lg md:text-xl">
                  {current_state.cooling_demand} kWh/m<sup>2</sup>·año
                </div>
              </div>
            )}
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
              Objetivo {target_state.target_class}
            </span>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Consumo objetivo:
              </div>
              <div className="text-lg md:text-xl">
                {target_state.target_consumption} kWh/m<sup>2</sup>·año
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Emisiones objetivo:
              </div>
              <div className="text-lg md:text-xl">
                {target_state.target_emissions} kg CO<sub>2</sub>eq/m
                <sup>2</sup>·año
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
              <CircleHelp
                className="w-3 h-3 text-orange-600"
                aria-hidden="true"
              />
            </button>
            <h3 className="text-sm md:text-base mb-4">
              Análisis de Brechas (Gap Analysis)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {gap_analysis.consumption_gap > 0 ? (
                      <TriangleAlert
                        className="w-4 h-4 text-orange-600"
                        aria-hidden="true"
                      />
                    ) : current_state.consumption_kwh_m2_year > 0 ? (
                      <CircleCheckBig
                        className="w-4 h-4 text-green-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <CircleHelp
                        className="w-4 h-4 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-xs">Consumo energético</span>
                  </div>
                  <span
                    className={`text-xs ${
                      gap_analysis.consumption_gap > 0
                        ? "text-orange-600"
                        : current_state.consumption_kwh_m2_year > 0
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {gap_analysis.consumption_gap > 0
                      ? `+${gap_analysis.consumption_gap}`
                      : current_state.consumption_kwh_m2_year > 0
                        ? "Cumple el objetivo"
                        : "Faltan datos"}{" "}
                    {gap_analysis.consumption_gap > 0 && "kWh/m²·año"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${gap_analysis.consumption_gap > 0 ? "bg-orange-500" : "bg-green-500"}`}
                    style={{
                      width: `${gap_analysis.consumption_progress_percent}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Actual: {current_state.consumption_kwh_m2_year || "--"}{" "}
                  kWh/m²·año → Objetivo: {target_state.target_consumption}{" "}
                  kWh/m²·año
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {gap_analysis.emissions_gap > 0 ? (
                      <TriangleAlert
                        className="w-4 h-4 text-orange-600"
                        aria-hidden="true"
                      />
                    ) : current_state.emissions_kg_co2_m2_year > 0 ? (
                      <CircleCheckBig
                        className="w-4 h-4 text-green-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <CircleHelp
                        className="w-4 h-4 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-xs">Emisiones de CO₂</span>
                  </div>
                  <span
                    className={`text-xs ${
                      gap_analysis.emissions_gap > 0
                        ? "text-orange-600"
                        : current_state.emissions_kg_co2_m2_year > 0
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {gap_analysis.emissions_gap > 0
                      ? `+${gap_analysis.emissions_gap}`
                      : current_state.emissions_kg_co2_m2_year > 0
                        ? "Cumple el objetivo"
                        : "Faltan datos"}{" "}
                    {gap_analysis.emissions_gap > 0 && "kg CO₂eq/m²·año"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${gap_analysis.emissions_gap > 0 ? "bg-orange-500" : "bg-green-500"}`}
                    style={{
                      width: `${gap_analysis.emissions_progress_percent}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Actual: {current_state.emissions_kg_co2_m2_year || "--"} kg
                  CO₂eq/m²·año → Objetivo: {target_state.target_emissions} kg
                  CO₂eq/m²·año
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
            <h3 className="text-sm md:text-base mb-3 font-medium">
              Documentación Regulatoria Clave
            </h3>
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className={`flex items-start gap-2 p-3 rounded-lg border ${
                    cert.status === "valid"
                      ? "bg-green-50 border-green-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  {cert.status === "valid" ? (
                    <CircleCheckBig
                      className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <TriangleAlert
                      className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div
                        className={`text-xs font-semibold ${
                          cert.status === "valid"
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        {cert.title}
                      </div>
                      {cert.uploaded_at && (
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                          {new Date(cert.uploaded_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        cert.status === "valid"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {cert.description}
                    </div>
                    {cert.status === "missing" && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-[10px] py-0.5 px-1.5 bg-red-100 text-red-600 rounded">
                          Documento no detectado
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
              {mevs.map((mev) => (
                <div
                  key={mev.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      {mev.status === "implementada" && (
                        <CircleCheckBig
                          className="w-4 h-4 text-green-600 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      {mev.status === "parcial" && (
                        <CircleCheckBig
                          className="w-4 h-4 text-orange-600 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      {mev.status === "no_implementada" && (
                        <TriangleAlert
                          className="w-4 h-4 text-red-600 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <div className="text-xs mb-1">
                          {mev.code}: {mev.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {mev.description}
                        </div>
                      </div>
                    </div>
                    {mev.status === "implementada" && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded whitespace-nowrap">
                        Implementada
                      </span>
                    )}
                    {mev.status === "parcial" && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded whitespace-nowrap">
                        Parcial
                      </span>
                    )}
                    {mev.status === "no_implementada" && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded whitespace-nowrap">
                        No implementada
                      </span>
                    )}
                  </div>
                  <div className="mt-2 bg-gray-50 rounded p-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-600">Estado actual</div>
                        <div
                          className={
                            mev.status === "implementada"
                              ? "text-green-600"
                              : mev.status === "parcial"
                                ? "text-orange-600"
                                : "text-red-600"
                          }
                        >
                          {mev.current_state}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">
                          {mev.status === "implementada"
                            ? "Ahorro logrado"
                            : "Ahorro potencial"}
                        </div>
                        <div>{mev.potential_savings} kWh/m²·año</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Reducción CO₂</div>
                        <div>{mev.potential_co2_reduction} kg/m²·año</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">
                    Implementadas
                  </div>
                  <div className="text-xl text-green-600">
                    {summary.mevs_implemented}
                  </div>
                  <div className="text-xs text-gray-500">
                    de {summary.mevs_total} MEVs
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="text-xs text-gray-600 mb-1">Parciales</div>
                  <div className="text-xl text-orange-600">
                    {summary.mevs_partial}
                  </div>
                  <div className="text-xs text-gray-500">Requieren mejora</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">Pendientes</div>
                  <div className="text-xl text-red-600">
                    {summary.mevs_pending}
                  </div>
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
                      {summary.total_potential_savings}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-700">
                      Reducción CO₂ posible
                    </div>
                    <div className="text-sm text-blue-900">
                      {summary.total_potential_co2_reduction}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb
                className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1">
                <h4 className="text-sm text-purple-900 mb-2">
                  Recomendación IA - Cumplimiento Normativo
                </h4>
                <p className="text-xs text-purple-700 mb-3">
                  Para alcanzar los objetivos EPBD 2030, se requiere reducir el
                  consumo en {gap_analysis.consumption_gap} kWh/m²·año y las
                  emisiones en {gap_analysis.emissions_gap} kg CO₂eq/m²·año. Se
                  recomienda priorizar intervenciones en envolvente térmica y
                  sistemas HVAC según la auditoría técnica.
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
