import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  X,
  CircleAlert,
  Building2,
  Wrench,
  TrendingUp,
  House,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Building } from "~/services/buildingsApi";
import { EnergyCertificatesService } from "~/services/energyCertificates";
import type { PersistedEnergyCertificate } from "~/services/energyCertificates";
import { getLatestRating } from "~/utils/energyCalculations";
import { generateLeePdf, buildLeeScenarios, type LeeScenario } from "~/utils/leeGenerator";
import { DocumentsApiService, type Document } from "~/services/documentsApi";

interface ModalLEEProps {
  active: boolean;
  setActive: (value: boolean) => void;
  buildingData?: Building | null;
}

const formatTypology = (t?: string) => {
  if (!t) return null;
  const map: Record<string, string> = {
    residential: "Residencial Colectivo",
    mixed: "Mixto",
    commercial: "Terciario",
  };
  return map[t] || t;
};

/** Obtiene el último CEE y su consumo primario para mostrar en el modal */
function getCeeDisplayData(certs: PersistedEnergyCertificate[]): {
  rating: string;
  kwh: number;
} | null {
  if (!certs?.length) return null;
  const sorted = [...certs].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latest = sorted[0];
  const rating = getLatestRating(certs);
  const kwh = latest?.primaryEnergyKwhPerM2Year ?? 0;
  return { rating, kwh };
}

interface IteInfo {
  name: string;
  issueDate: string;
  expiryDate?: string;
  statusLabel: string;
}

function formatDateEs(dateStr?: string | null): string | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const ModalLEE: React.FC<ModalLEEProps> = ({ active, setActive, buildingData }) => {
  const navigate = useNavigate();
  const [bloqueIIOpen, setBloqueIIOpen] = useState(false);
  const [bloqueIIIOpen, setBloqueIIIOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ceeData, setCeeData] = useState<{ rating: string; kwh: number } | null>(null);
  const [ceeLoading, setCeeLoading] = useState(false);
  const [ceeError, setCeeError] = useState<string | null>(null);
  const [iteInfo, setIteInfo] = useState<IteInfo | null>(null);
  const [iteLoading, setIteLoading] = useState(false);
  const [iteError, setIteError] = useState<string | null>(null);

  const buildingId = buildingData?.id;

  // Bloquear scroll del body y html cuando la modal está abierta
  useEffect(() => {
    if (active) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
      };
    }
  }, [active]);

  useEffect(() => {
    if (!active || !buildingId) {
      setCeeData(null);
      setCeeError(null);
      setIteInfo(null);
      setIteError(null);
      return;
    }
    setCeeLoading(true);
    setCeeError(null);
    EnergyCertificatesService.getByBuilding(buildingId)
      .then((res) => {
        const certs = res?.certificates ?? [];
        const display = getCeeDisplayData(certs);
        setCeeData(display);
      })
      .catch((err) => {
        setCeeError(err?.message ?? "Error al cargar certificados");
        setCeeData(null);
      })
      .finally(() => setCeeLoading(false));
  }, [active, buildingId]);

  useEffect(() => {
    if (!active || !buildingId) {
      setIteInfo(null);
      setIteError(null);
      return;
    }

    setIteLoading(true);
    setIteError(null);

    DocumentsApiService.getBuildingDocuments(buildingId)
      .then((res) => {
        const docs = res?.documents ?? [];
        const iteDoc: Document | undefined = docs.find((doc) => {
          const name = doc.name?.toLowerCase() || "";
          const sub = doc.subcategory?.toLowerCase() || "";
          return name.includes("ite") || sub.includes("ite");
        });

        if (!iteDoc) {
          setIteInfo(null);
          return;
        }

        const issueDate = formatDateEs(iteDoc.date) ?? iteDoc.date;
        const expiryDateFormatted = formatDateEs(iteDoc.expirationDate);

        let statusLabel = "Activo";
        if (iteDoc.expirationDate) {
          const exp = new Date(iteDoc.expirationDate);
          const today = new Date();
          if (!Number.isNaN(exp.getTime())) {
            if (exp.getTime() < today.setHours(0, 0, 0, 0)) {
              statusLabel = "Vencida";
            } else {
              statusLabel = "Vigente";
            }
          }
        }

        setIteInfo({
          name: iteDoc.name,
          issueDate,
          expiryDate: expiryDateFormatted,
          statusLabel,
        });
      })
      .catch((err) => {
        setIteError(err?.message ?? "Error al cargar ITE");
        setIteInfo(null);
      })
      .finally(() => setIteLoading(false));
  }, [active, buildingId]);

  const hasCatastro = Boolean(buildingData?.cadastralReference);
  const hasCee = Boolean(ceeData);
  const hasIte = Boolean(iteInfo);

  const direccion = buildingData?.address ?? null;
  const refCatastral = buildingData?.cadastralReference ?? null;
  const municipio = buildingData?.addressData?.municipality ?? null;
  const provincia = buildingData?.addressData?.province ?? null;
  const yearConstruccion = buildingData?.constructionYear ?? null;
  const superficie = buildingData?.squareMeters ?? null;
  const numViviendas = buildingData?.numUnits ?? null;
  const uso = formatTypology(buildingData?.typology) ?? null;

  const hasIdentificativos = direccion || refCatastral || municipio || provincia || yearConstruccion || superficie || numViviendas || uso;

  const leeScenarios: LeeScenario[] = useMemo(() => {
    if (!buildingData) return [];
    return buildLeeScenarios({
      building: buildingData,
      cee: ceeData || undefined,
      ite: iteInfo || undefined,
    });
  }, [buildingData, ceeData, iteInfo]);

  const handleGenerar = async () => {
    if (!buildingData) {
      alert("Selecciona un edificio para generar el LEE.");
      return;
    }

    setIsGenerating(true);
    try {
      await generateLeePdf({
        building: buildingData,
        cee: ceeData || undefined,
        ite: iteInfo || undefined,
      });
    } catch (error) {
      console.error("Error al generar LEE:", error);
      alert("Error al generar el LEE. Por favor, inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIrACargaITE = () => {
    if (!buildingId) return;
    navigate(`/building/${buildingId}/gestion`);
  };
 
  if (!active) return null;
 
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[90] p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90dvh] sm:max-h-[90vh] flex flex-col min-h-0">
        {/* Header */}
        <div className="bg-[#1e3a8a] px-3 sm:px-4 py-3 rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="bg-white/10 p-1.5 rounded flex-shrink-0">
                <FileText className="w-4 h-4 text-white" aria-hidden />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm text-white">Generador de LEE (RD 853/2021)</h2>
                <p className="text-[10px] sm:text-xs text-blue-200">Libro del Edificio Existente - Borrador Automático</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActive(false)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 bg-white text-xs">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Datos fuente - todo condicional */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-start gap-2">
                <CircleAlert className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden />
                <div className="flex-1">
                  <h3 className="text-xs text-blue-900 mb-2">Datos Fuente para Generación Automática</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      {hasCatastro ? (
                        <>
                          <p className="text-blue-700 font-medium">✅ API Catastro</p>
                          <p className="text-blue-600 text-xs break-all">{refCatastral}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-blue-700 font-medium text-blue-600">❌ API Catastro</p>
                          <p className="text-blue-600 text-xs">No disponible</p>
                        </>
                      )}
                    </div>
                    <div>
                      {ceeLoading ? (
                        <>
                          <p className="text-blue-700 font-medium">Certificado Energético</p>
                          <p className="text-blue-600 text-xs">Cargando…</p>
                        </>
                      ) : hasCee && ceeData ? (
                        <>
                          <p className="text-blue-700 font-medium">✅ Certificado Energético</p>
                          <p className="text-blue-600 text-xs">
                            CEE: {ceeData.rating}
                            {ceeData.kwh > 0 ? ` | ${ceeData.kwh.toLocaleString("es-ES")} kWh/m²·año` : ""}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-blue-700 font-medium text-blue-600">❌ Certificado Energético</p>
                          <p className="text-blue-600 text-xs">{ceeError || "No disponible"}</p>
                        </>
                      )}
                    </div>
                    <div>
                      {iteLoading ? (
                        <>
                          <p className="text-blue-700 font-medium">Informe ITE</p>
                          <p className="text-blue-600 text-xs">Cargando…</p>
                        </>
                      ) : hasIte && iteInfo ? (
                        <>
                          <p className="text-blue-700 font-medium">✅ Informe ITE</p>
                          <p className="text-blue-600 text-xs">
                            {iteInfo.name} · {iteInfo.statusLabel}
                            {iteInfo.issueDate
                              ? ` · ${iteInfo.issueDate}${
                                  iteInfo.expiryDate ? ` - ${iteInfo.expiryDate}` : ""
                                }`
                              : ""}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-blue-700 font-medium text-blue-600">❌ Informe ITE</p>
                          <p className="text-blue-600 text-xs">{iteError || "No disponible"}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloque I: Documentación General - solo si hay buildingData */}
            {buildingData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-full p-3 flex items-center justify-between rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Building2 className="w-4 h-4 text-blue-600" aria-hidden />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-gray-900">BLOQUE I: Documentación General</h3>
                      <p className="text-xs text-gray-600">Datos identificativos, urbanísticos y titularidad</p>
                    </div>
                  </div>
                  <ChevronUp className="w-4 h-4 text-gray-500" aria-hidden />
                </div>
                <div className="p-4 border-t border-gray-200 space-y-3">
                  {hasIdentificativos && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                        <House className="w-3.5 h-3.5 text-blue-600" aria-hidden />
                        1.1. Datos Identificativos
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg">
                        {direccion && (
                          <div className="break-words"><span className="font-semibold">Dirección:</span> {direccion}</div>
                        )}
                        {refCatastral && (
                          <div><span className="font-semibold">Ref. Catastral:</span> {refCatastral}</div>
                        )}
                        {municipio && (
                          <div><span className="font-semibold">Municipio:</span> {municipio}</div>
                        )}
                        {provincia && (
                          <div><span className="font-semibold">Provincia:</span> {provincia}</div>
                        )}
                        {yearConstruccion != null && (
                          <div><span className="font-semibold">Año Construcción:</span> {yearConstruccion}</div>
                        )}
                        {superficie != null && (
                          <div><span className="font-semibold">Superficie:</span> {superficie.toLocaleString("es-ES")} m²</div>
                        )}
                        {numViviendas != null && (
                          <div><span className="font-semibold">Nº Viviendas:</span> {numViviendas}</div>
                        )}
                        {uso && (
                          <div><span className="font-semibold">Uso:</span> {uso}</div>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 mb-2">1.2. Datos Urbanísticos</h4>
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                      No hay datos disponibles. Completa la información desde Catastro o Gestión.
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 mb-2">1.3. Titularidad y Representación</h4>
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                      No hay datos disponibles.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!buildingData && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-xs">
                Selecciona un edificio para cargar los datos del Bloque I.
              </div>
            )}

            {/* Bloque II: Diagnóstico */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                type="button"
                onClick={() => setBloqueIIOpen(!bloqueIIOpen)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-lg">
                    <Wrench className="w-4 h-4 text-orange-600" aria-hidden />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-900">BLOQUE II: Diagnóstico</h3>
                    <p className="text-xs text-gray-600">Estado de conservación y comportamiento energético</p>
                  </div>
                </div>
                {bloqueIIOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" aria-hidden />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden />
                )}
              </button>
              {bloqueIIOpen && (
                <div className="p-4 border-t border-gray-200 text-xs text-gray-600 space-y-3">
                  <p>
                    Contenido de diagnóstico (ITE, CEE, patologías) — utiliza los informes técnicos disponibles para completar este bloque del LEE.
                  </p>

                  {/* Resumen del ITE cargado desde Gestión */}
                  <div className="border border-blue-100 bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                    <div className="mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-blue-600" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      {iteLoading ? (
                        <>
                          <p className="font-semibold text-blue-900">Informe ITE</p>
                          <p className="text-blue-700 text-[11px]">Cargando informe desde Gestión…</p>
                        </>
                      ) : hasIte && iteInfo ? (
                        <>
                          <p className="font-semibold text-blue-900">Informe ITE cargado</p>
                          <p className="text-blue-800 truncate">
                            {iteInfo.name}
                          </p>
                          <p className="text-blue-700 text-[11px] mt-0.5">
                            Estado: {iteInfo.statusLabel}
                            {iteInfo.issueDate &&
                              ` · Emisión: ${iteInfo.issueDate}${
                                iteInfo.expiryDate ? ` · Vencimiento: ${iteInfo.expiryDate}` : ""
                              }`}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-blue-900">Sin Informe ITE vinculado</p>
                          <p className="text-blue-700 text-[11px]">
                            No se ha encontrado ningún documento ITE en la Gestión del activo para este edificio.
                          </p>
                          {iteError && (
                            <p className="text-red-600 text-[11px] mt-0.5">
                              {iteError}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleIrACargaITE}
                      disabled={!buildingId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-600 text-blue-700 text-xs font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText className="w-3.5 h-3.5" aria-hidden />
                      <span>{hasIte ? "Ver en Gestión" : "Cargar Informe ITE"}</span>
                    </button>
                    {!buildingId && (
                      <span className="text-[11px] text-gray-500">
                        Selecciona un edificio para poder cargar el ITE.
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Se abrirá la ruta de Gestión del activo para que puedas adjuntar o actualizar el ITE junto con el resto de documentación.
                  </p>
                </div>
              )}
            </div>

            {/* Bloque III: Plan de Actuaciones */}
            <div className="bg-white rounded-xl shadow-sm border border-green-300">
              <button
                type="button"
                onClick={() => setBloqueIIIOpen(!bloqueIIIOpen)}
                className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl bg-green-50"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" aria-hidden />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-900">BLOQUE III: Plan de Actuaciones</h3>
                    <p className="text-xs text-gray-600">Comparativa de 3 escenarios (obligatorio RD 853/2021)</p>
                  </div>
                </div>
                {bloqueIIIOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" aria-hidden />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden />
                )}
              </button>
              {bloqueIIIOpen && (
                <div className="p-4 border-t border-gray-200 text-xs text-gray-600 space-y-3">
                  <p>
                    Escenarios de rehabilitación mínimos, intermedios y óptimos estimados automáticamente a partir de los datos del edificio, CEE e ITE.
                  </p>
                  {leeScenarios.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {leeScenarios.map((scenario) => (
                        <div
                          key={scenario.id}
                          className="border border-green-100 bg-green-50 rounded-lg p-3 flex flex-col gap-1"
                        >
                          <p className="font-semibold text-gray-900 text-xs">{scenario.name}</p>
                          <p className="text-[11px] text-gray-700">
                            {scenario.description}
                          </p>
                          {scenario.capex != null && (
                            <p className="text-[11px] text-gray-800 mt-1">
                              Inversión aprox.:{" "}
                              <span className="font-semibold">
                                {new Intl.NumberFormat("es-ES", {
                                  style: "currency",
                                  currency: "EUR",
                                  maximumFractionDigits: 0,
                                }).format(scenario.capex)}
                              </span>
                            </p>
                          )}
                          {scenario.savingsPercent != null && (
                            <p className="text-[11px] text-gray-800">
                              Ahorro energético: ~{scenario.savingsPercent.toFixed(0)}%
                              {scenario.savingsKwhYear != null &&
                                ` (${scenario.savingsKwhYear.toLocaleString("es-ES")} kWh/año)`}
                            </p>
                          )}
                          {scenario.simplePaybackYears != null && (
                            <p className="text-[11px] text-gray-800">
                              Payback simple estimado: ~{scenario.simplePaybackYears.toFixed(1)} años
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500">
                      No hay datos suficientes (superficie / CEE / coste de rehabilitación) para estimar los escenarios automáticamente.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-3 sm:p-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-6xl mx-auto">
            <div className="text-xs text-gray-600 min-w-0">
              <p className="font-bold mb-0.5">Documento: Libro del Edificio Existente (LEE)</p>
              <p className="text-xs hidden sm:block">Conforme a RD 853/2021 - Anexo I | Generación automática con datos de Catastro + CEE + ITE</p>
            </div>
            <button
              type="button"
              onClick={handleGenerar}
              disabled={isGenerating}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Download className="w-4 h-4" aria-hidden />
              <span className="hidden md:inline">
                {isGenerating ? "Generando…" : "Generar LEE Completo (PDF)"}
              </span>
              <span className="md:hidden hidden sm:inline">
                {isGenerating ? "…" : "Generar LEE"}
              </span>
              <span className="sm:hidden">{isGenerating ? "…" : "LEE"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLEE;
