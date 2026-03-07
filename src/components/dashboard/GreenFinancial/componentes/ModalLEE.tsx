import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  X,
  CircleAlert,
  Building2,
  Wrench,
  TrendingUp,
  House,
  ChevronDown,
  ChevronUp,
  Pencil,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "~/contexts/NavigationContext";
import type { Building } from "~/services/buildingsApi";
import { EnergyCertificatesService } from "~/services/energyCertificates";
import type { PersistedEnergyCertificate } from "~/services/energyCertificates";
import { getLatestRating } from "~/utils/energyCalculations";
import {
  generateLeePdf,
  buildLeeScenarios,
  type LeeScenario,
} from "~/utils/leeGenerator";
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
  const sorted = [...certs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

const ModalLEE: React.FC<ModalLEEProps> = ({
  active,
  setActive,
  buildingData,
}) => {
  const navigate = useNavigate();
  const { setSelectedBuildingId, setActiveSection, setActiveTab, setViewMode } =
    useNavigation();
  const [bloqueIIOpen, setBloqueIIOpen] = useState(false);
  const [bloqueIIIOpen, setBloqueIIIOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ceeData, setCeeData] = useState<{
    rating: string;
    kwh: number;
  } | null>(null);
  const [ceeLoading, setCeeLoading] = useState(false);
  const [ceeError, setCeeError] = useState<string | null>(null);
  const [iteInfo, setIteInfo] = useState<IteInfo | null>(null);
  const [iteLoading, setIteLoading] = useState(false);
  const [iteError, setIteError] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<string>("minimo");

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

  const handleGoToInformation = (fieldKey?: string) => {
    if (!buildingId) return;

    setSelectedBuildingId(buildingId);
    setActiveSection("information");
    setActiveTab("information");
    setViewMode("detail");

    navigate(`/building/${buildingId}/information`, {
      state: { focusField: fieldKey },
    });
    setActive(false); // Cerrar el modal al navegar
  };

  const getEpbdStatus = () => {
    const rating = ceeData?.rating?.toUpperCase();

    // Si hay clasificación energética, toma precedencia
    if (rating) {
      if (["A", "B"].includes(rating)) return "favorable";
      if (["C", "D", "E"].includes(rating)) return "intermedio";
      if (["F", "G"].includes(rating)) return "no_cumple";
    }

    // Si no hay clasificación, analiza consumo o emisiones o demanda si existen
    const consumo = Number(buildingData?.customData?.consumoEnergia);
    const emisiones = Number(buildingData?.customData?.emisiones);

    if (consumo > 0 || emisiones > 0) {
      if (consumo > 250 || emisiones > 50) return "no_cumple";
      if (consumo > 100 || emisiones > 20) return "intermedio";
      return "favorable";
    }

    // Por defecto, muestra no cumple si no hay nada cargado
    return "no_cumple";
  };

  const getEpbdColorClasses = () => {
    const status = getEpbdStatus();
    switch (status) {
      case "favorable":
        return {
          container: "bg-green-50 border-2 border-green-300 rounded-lg p-3",
          header:
            "text-xs font-bold text-green-900 mb-2 flex items-center gap-1.5",
          ratingBox:
            "bg-white p-3 rounded-lg border-2 border-green-400 text-center flex flex-col items-center justify-center min-h-[80px]",
          ratingText: "text-3xl font-bold text-green-600 mb-0.5",
          costeText: "font-bold text-green-700",
        };
      case "intermedio":
        return {
          container: "bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3",
          header:
            "text-xs font-bold text-yellow-900 mb-2 flex items-center gap-1.5",
          ratingBox:
            "bg-white p-3 rounded-lg border-2 border-yellow-400 text-center flex flex-col items-center justify-center min-h-[80px]",
          ratingText: "text-3xl font-bold text-yellow-600 mb-0.5",
          costeText: "font-bold text-yellow-700",
        };
      case "no_cumple":
      default:
        return {
          container: "bg-red-50 border-2 border-red-300 rounded-lg p-3",
          header:
            "text-xs font-bold text-red-900 mb-2 flex items-center gap-1.5",
          ratingBox:
            "bg-white p-3 rounded-lg border-2 border-red-400 text-center flex flex-col items-center justify-center min-h-[80px]",
          ratingText: "text-3xl font-bold text-red-600 mb-0.5",
          costeText: "font-bold text-red-700",
        };
    }
  };

  const renderEpbdMessage = () => {
    const status = getEpbdStatus();

    if (status === "favorable") {
      return (
        <div className="mt-3 bg-green-100 border-l-4 border-green-600 p-3 rounded">
          <p className="text-xs font-bold text-green-900 mb-1">
            ✅ CUMPLE EPBD 2030 (Estimado)
          </p>
          <p className="text-xs text-green-800">
            Según los datos disponibles, este edificio <strong>cumple</strong>{" "}
            con los objetivos marcados por la Directiva EPBD 2030. Es un activo
            resiliente que mantiene su valor en el mercado.
          </p>
        </div>
      );
    }

    if (status === "intermedio") {
      return (
        <div className="mt-3 bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
          <p className="text-xs font-bold text-yellow-900 mb-1">
            ⚠️ ALTO RIESGO EPBD 2030
          </p>
          <p className="text-xs text-yellow-800">
            Este edificio se encuentra en <strong>riesgo</strong> respecto a los
            requisitos mínimos de la Directiva EPBD 2030. Se recomienda estudiar
            medidas de reducción de consumo.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-3 bg-red-100 border-l-4 border-red-600 p-3 rounded">
        <p className="text-xs font-bold text-red-900 mb-1">
          ⚠️ ALERTA CRÍTICA EPBD 2030
        </p>
        <p className="text-xs text-red-800">
          Este edificio <strong>NO cumplirá</strong> los requisitos mínimos de
          la Directiva EPBD 2030. Se requiere una reducción de consumo del{" "}
          <strong>45%</strong> para evitar sanciones (3.000€-9.000€) y
          restricciones a la venta/alquiler.
        </p>
      </div>
    );
  };

  if (!active) return null;

  const epbdColors = getEpbdColorClasses();

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
                <h2 className="text-xs sm:text-sm text-white">
                  Generador de LEE (RD 853/2021)
                </h2>
                <p className="text-[10px] sm:text-xs text-blue-200">
                  Libro del Edificio Existente - Borrador Automático
                </p>
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
                <CircleAlert
                  className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                  aria-hidden
                />
                <div className="flex-1">
                  <h3 className="text-xs text-blue-900 mb-2">
                    Datos Fuente para Generación Automática
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      {hasCatastro ? (
                        <>
                          <p className="text-blue-700 font-medium">
                            ✅ API Catastro
                          </p>
                          <p className="text-blue-600 text-xs break-all">
                            {refCatastral}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-blue-700 font-medium">
                            ❌ API Catastro
                          </p>
                          <p className="text-blue-600 text-xs">No disponible</p>
                        </>
                      )}
                    </div>
                    <div>
                      {ceeLoading ? (
                        <>
                          <p className="text-blue-700 font-medium">
                            Certificado Energético
                          </p>
                          <p className="text-blue-600 text-xs">Cargando…</p>
                        </>
                      ) : hasCee && ceeData ? (
                        <>
                          <p className="text-blue-700 font-medium">
                            ✅ Certificado Energético
                          </p>
                          <p className="text-blue-600 text-xs">
                            CEE: {ceeData.rating}
                            {ceeData.kwh > 0
                              ? ` | ${ceeData.kwh.toLocaleString("es-ES")} kWh/m²·año`
                              : ""}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-blue-700 font-medium">
                            ❌ Certificado Energético
                          </p>
                          <p className="text-blue-600 text-xs">
                            {ceeError || "No disponible"}
                          </p>
                        </>
                      )}
                    </div>
                    <div>
                      {iteLoading ? (
                        <>
                          <p className="text-blue-700 font-medium">
                            Informe ITE
                          </p>
                          <p className="text-blue-600 text-xs">Cargando…</p>
                        </>
                      ) : hasIte && iteInfo ? (
                        <>
                          <p className="text-blue-700 font-medium">
                            ✅ Informe ITE
                          </p>
                          <p className="text-blue-600 text-xs">
                            {iteInfo.name} · {iteInfo.statusLabel}
                            {iteInfo.issueDate
                              ? ` · ${iteInfo.issueDate}${
                                  iteInfo.expiryDate
                                    ? ` - ${iteInfo.expiryDate}`
                                    : ""
                                }`
                              : ""}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-blue-700 font-medium">
                            ❌ Informe ITE
                          </p>
                          <p className="text-blue-600 text-xs">
                            {iteError || "No disponible"}
                          </p>
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
                      <Building2
                        className="w-4 h-4 text-blue-600"
                        aria-hidden
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-gray-900">
                        BLOQUE I: Documentación General
                      </h3>
                      <p className="text-xs text-gray-600">
                        Datos identificativos, urbanísticos y titularidad
                      </p>
                    </div>
                  </div>
                  <ChevronUp className="w-4 h-4 text-gray-500" aria-hidden />
                </div>
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      <House
                        className="w-3.5 h-3.5 text-blue-600"
                        aria-hidden
                      />
                      1.1. Datos Identificativos
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Dirección:</span>{" "}
                        {direccion || (
                          <button
                            onClick={() => handleGoToInformation("address")}
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Ref. Catastral:</span>{" "}
                        {refCatastral || (
                          <button
                            onClick={() =>
                              handleGoToInformation("cadastralRef")
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Municipio:</span>{" "}
                        {municipio || (
                          <button
                            onClick={() => handleGoToInformation("city")}
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Provincia:</span>{" "}
                        {provincia || (
                          <button
                            onClick={() => handleGoToInformation("province")}
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Año Construcción:</span>{" "}
                        {yearConstruccion || (
                          <button
                            onClick={() =>
                              handleGoToInformation("buildingYear")
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Superficie:</span>{" "}
                        {superficie != null ? (
                          `${superficie.toLocaleString("es-ES")} m²`
                        ) : (
                          <button
                            onClick={() => handleGoToInformation("totalArea")}
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Nº Viviendas:</span>{" "}
                        {numViviendas || (
                          <button
                            onClick={() => handleGoToInformation("units")}
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Uso:</span>{" "}
                        {uso || (
                          <button
                            onClick={() =>
                              handleGoToInformation("buildingType")
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-800 mb-2">
                      1.2. Datos Urbanísticos
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Calificación:</span>{" "}
                        {buildingData.customData?.calificacion || (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.calificacion",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Protección:</span>{" "}
                        {buildingData.customData?.proteccion || (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.proteccion",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Ordenanza:</span>{" "}
                        {buildingData.customData?.ordenanza || (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.ordenanza",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Edificabilidad:</span>{" "}
                        {buildingData.customData?.edificabilidad != null ? (
                          `${buildingData.customData.edificabilidad} m²/m²`
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.edificabilidad",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-800 mb-2">
                      1.3. Titularidad y Representación
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Régimen:</span>{" "}
                        {buildingData.customData?.regimen || (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.regimen",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">CIF:</span>{" "}
                        {buildingData.customData?.cif || (
                          <button
                            onClick={() =>
                              handleGoToInformation("building.customData.cif")
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Presidente:</span>{" "}
                        {buildingData.customData?.presidente || (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.presidente",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Administrador:</span>{" "}
                        {buildingData.customData?.administrador || (
                          <button
                            onClick={() =>
                              handleGoToInformation("propertyManager")
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
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
                    <h3 className="text-sm font-bold text-gray-900">
                      BLOQUE II: Diagnóstico
                    </h3>
                    <p className="text-xs text-gray-600">
                      Estado de conservación y comportamiento energético
                    </p>
                  </div>
                </div>
                {bloqueIIOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" aria-hidden />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden />
                )}
              </button>

              {bloqueIIOpen && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  {/* 2.1. Estado de Conservación */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-orange-900 mb-2 flex items-center gap-1.5">
                      <CircleAlert className="w-4 h-4" aria-hidden />
                      2.1. Estado de Conservación (ITE/IEE)
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">ITE Vigente:</span>{" "}
                        {iteInfo?.issueDate ? (
                          `${iteInfo.issueDate} (válido hasta ${iteInfo.expiryDate || "---"})`
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.actuaciones_urgentes",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <span className="font-semibold">Estado Global:</span>
                        {iteInfo?.statusLabel ? (
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              iteInfo?.statusLabel?.toLowerCase() ===
                                "favorable" ||
                              iteInfo?.statusLabel?.toLowerCase() ===
                                "vigente" ||
                              iteInfo?.statusLabel?.toLowerCase() ===
                                "aceptable"
                                ? "bg-green-100 text-green-800"
                                : iteInfo?.statusLabel?.toLowerCase() ===
                                      "desfavorable" ||
                                    iteInfo?.statusLabel?.toLowerCase() ===
                                      "vencida"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {iteInfo.statusLabel.toUpperCase()}
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.actuaciones_urgentes",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="font-semibold text-xs mb-1.5">
                        Actuaciones Urgentes Detectadas:
                      </p>
                      <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                        {buildingData?.customData?.actuaciones_urgentes ? (
                          buildingData?.customData?.actuaciones_urgentes
                            .split("\n")
                            .map((act: string, idx: number) => (
                              <li key={idx}>{act}</li>
                            ))
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.actuaciones_urgentes",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex flex-col items-start gap-1 transition-colors"
                          >
                            <span className="flex items-center gap-1">
                              No disponible{" "}
                              <Pencil className="w-2.5 h-2.5 text-blue-500" />
                            </span>
                            <span className="text-[10px] text-gray-400">
                              (Ej: Reparación fisuras, impermeabilización...)
                            </span>
                          </button>
                        )}
                      </ul>
                    </div>

                    <div className="bg-white p-2 rounded border-l-4 border-orange-500">
                      <div className="text-xs font-medium flex items-center gap-1">
                        <span className="font-bold">
                          Coste reparaciones urgentes:
                        </span>{" "}
                        {buildingData?.customData?.coste_reparaciones ? (
                          `${buildingData.customData.coste_reparaciones}k€`
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.coste_reparaciones",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2.2. Comportamiento Energético */}
                  <div className={epbdColors.container}>
                    <h4 className={epbdColors.header}>
                      <Zap className="w-4 h-4" aria-hidden />
                      2.2. Comportamiento Energético (CEE)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div className={epbdColors.ratingBox}>
                        {ceeData?.rating ? (
                          <p className={epbdColors.ratingText}>
                            {ceeData.rating}
                          </p>
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation("certificate.rating")
                            }
                            className="text-slate-400 hover:text-blue-600 flex flex-col items-center gap-1 transition-colors"
                          >
                            <span className="text-sm">No disponible</span>
                            <Pencil className="w-3 h-3 text-blue-500" />
                          </button>
                        )}
                        <p className="text-xs text-gray-600">
                          Certificado Actual
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border-2 border-gray-300 text-center flex flex-col items-center justify-center min-h-[80px]">
                        {ceeData?.kwh ? (
                          <p className="text-xl font-bold text-gray-800 mb-0.5">
                            {ceeData.kwh.toLocaleString("es-ES")}
                          </p>
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "certificate.primaryEnergyKwhPerM2Year",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex flex-col items-center gap-1 transition-colors"
                          >
                            <span className="text-sm">---</span>
                            <Pencil className="w-3 h-3 text-blue-500" />
                          </button>
                        )}
                        <p className="text-xs text-gray-600">
                          kWh/m²·año (Consumo)
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border-2 border-gray-300 text-center flex flex-col items-center justify-center min-h-[80px]">
                        {buildingData?.customData?.emisiones ? (
                          <p className="text-xl font-bold text-gray-800 mb-0.5">
                            {buildingData.customData.emisiones}
                          </p>
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.emisiones",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex flex-col items-center gap-1 transition-colors"
                          >
                            <span className="text-sm">---</span>
                            <Pencil className="w-3 h-3 text-blue-500" />
                          </button>
                        )}
                        <p className="text-xs text-gray-600">
                          kgCO2/m²·año (Emisiones)
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span>Demanda Calefacción:</span>
                        {buildingData?.customData?.demandaCalefaccion ? (
                          <span className="font-bold">
                            {buildingData.customData.demandaCalefaccion}{" "}
                            kWh/m²·año
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.demandaCalefaccion",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Demanda Refrigeración:</span>
                        {buildingData?.customData?.demandaRefrigeracion ? (
                          <span className="font-bold">
                            {buildingData.customData.demandaRefrigeracion}{" "}
                            kWh/m²·año
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.demandaRefrigeracion",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between items-center border-t pt-1.5">
                        <span className={epbdColors.costeText}>
                          Coste Energético Actual:
                        </span>
                        {buildingData?.customData?.costeEnergetico ? (
                          <span className={epbdColors.costeText}>
                            {buildingData.customData.costeEnergetico} k€/año
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.costeEnergetico",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                          >
                            No disponible{" "}
                            <Pencil className="w-2.5 h-2.5 text-blue-500" />
                          </button>
                        )}
                      </div>
                    </div>

                    {renderEpbdMessage()}
                  </div>

                  {/* Diagnóstico Final (Envolvente e Instalaciones) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-bold text-xs mb-1.5">
                        Envolvente Térmica
                      </h5>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        {buildingData?.customData?.envolvente ? (
                          buildingData?.customData?.envolvente
                            .split("\n")
                            .map((line: string, idx: number) => (
                              <li key={idx}>• {line}</li>
                            ))
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.envolvente",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex flex-col items-start gap-0.5 transition-colors"
                          >
                            <span className="flex items-center gap-1">
                              No disponible{" "}
                              <Pencil className="w-2.5 h-2.5 text-blue-500" />
                            </span>
                            <span className="text-[10px] text-gray-400 text-left">
                              (Fachada, cubierta, ventanas...)
                            </span>
                          </button>
                        )}
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-bold text-xs mb-1.5">
                        Instalaciones
                      </h5>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        {buildingData?.customData?.instalaciones ? (
                          buildingData?.customData?.instalaciones
                            .split("\n")
                            .map((line: string, idx: number) => (
                              <li key={idx}>• {line}</li>
                            ))
                        ) : (
                          <button
                            onClick={() =>
                              handleGoToInformation(
                                "building.customData.instalaciones",
                              )
                            }
                            className="text-slate-400 hover:text-blue-600 flex flex-col items-start gap-0.5 transition-colors"
                          >
                            <span className="flex items-center gap-1">
                              No disponible{" "}
                              <Pencil className="w-2.5 h-2.5 text-blue-500" />
                            </span>
                            <span className="text-[10px] text-gray-400 text-left">
                              (Calefacción, ACS, ventilación...)
                            </span>
                          </button>
                        )}
                      </ul>
                    </div>
                  </div>
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
                    <TrendingUp
                      className="w-4 h-4 text-green-600"
                      aria-hidden
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-900">
                      BLOQUE III: Plan de Actuaciones
                    </h3>
                    <p className="text-xs text-gray-600">
                      Comparativa de 3 escenarios (obligatorio RD 853/2021)
                    </p>
                  </div>
                </div>
                {bloqueIIIOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" aria-hidden />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden />
                )}
              </button>
              {bloqueIIIOpen && (
                <div className="p-4 border-t border-gray-200 space-y-4">
                  <p className="text-xs text-gray-600 italic">
                    Seleccione un escenario para ver el detalle de la propuesta
                    técnica y económica:
                  </p>

                  {leeScenarios.length > 0 ? (
                    <div className="space-y-3">
                      {leeScenarios.map((scenario) => {
                        const isSelected = selectedScenarioId === scenario.id;
                        // Cálculo coherente de la letra tras actuación
                        const ratingMap = ["A", "B", "C", "D", "E", "F", "G"];
                        const currentIdx = ratingMap.indexOf(
                          ceeData?.rating || "G",
                        );

                        let jumps = 0;
                        if (scenario.id === "minimo") {
                          jumps = currentIdx <= 1 ? 0 : 1;
                        } else if (scenario.id === "intermedio") {
                          jumps =
                            currentIdx === 0 ? 0 : currentIdx <= 2 ? 1 : 2;
                        } else {
                          jumps = currentIdx; // Óptimo siempre asegura "A"
                        }

                        const nextIdx = Math.max(0, currentIdx - jumps);
                        const nextRating = ratingMap[nextIdx];

                        return (
                          <div
                            key={scenario.id}
                            onClick={() => setSelectedScenarioId(scenario.id)}
                            className={`relative cursor-pointer rounded-xl border-2 transition-all p-4 ${
                              isSelected
                                ? "border-green-500 bg-green-50 shadow-md"
                                : "border-gray-100 bg-white hover:border-green-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-green-500 bg-green-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900 leading-tight">
                                      Escenario{" "}
                                      {scenario.id === "minimo"
                                        ? "I"
                                        : scenario.id === "intermedio"
                                          ? "II"
                                          : "III"}
                                      :{" "}
                                      {scenario.id === "minimo"
                                        ? "Mínimo"
                                        : scenario.id === "intermedio"
                                          ? "Intermedio"
                                          : "Óptimo"}
                                    </h4>
                                    <p className="text-[11px] text-green-700 font-medium">
                                      {scenario.id === "minimo"
                                        ? "(Cumplimiento Normativo)"
                                        : scenario.id === "intermedio"
                                          ? "(Mejora Energética)"
                                          : "(Alta Eficiencia - Descarbonización)"}
                                    </p>
                                  </div>
                                  <div className="bg-white px-2 py-1 rounded border border-green-200">
                                    <span className="text-[10px] text-gray-500 block leading-none mb-0.5">
                                      Letra tras actuación
                                    </span>
                                    <span className="text-lg font-black text-green-600 block leading-none">
                                      {nextRating}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-3">
                                  <div className="bg-white/50 p-2 rounded-lg border border-gray-100">
                                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                                      Inversión
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                      {scenario.capex
                                        ? `${(scenario.capex / 1000).toFixed(0)}k €`
                                        : "---"}
                                    </p>
                                  </div>
                                  <div className="bg-white/50 p-2 rounded-lg border border-gray-100 text-center">
                                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                                      Ahorro
                                    </p>
                                    <p className="text-sm font-bold text-green-600">
                                      {scenario.savingsPercent
                                        ? `${scenario.savingsPercent.toFixed(0)}%`
                                        : "---"}
                                    </p>
                                  </div>
                                  <div className="bg-white/50 p-2 rounded-lg border border-gray-100 text-right">
                                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1 text-nowrap">
                                      Plazo Amortización
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">
                                      {scenario.simplePaybackYears
                                        ? `${scenario.simplePaybackYears.toFixed(0)} años`
                                        : "---"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={handleGenerar}
                        disabled={isGenerating}
                        className="w-full mt-4 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        <FileText className="w-5 h-5" />
                        {isGenerating
                          ? "GENERANDO INFORME..."
                          : "DESCARGAR INFORME LEE (PDF)"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 text-center">
                      <CircleAlert className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No hay datos suficientes para generar escenarios de
                        rehabilitación.
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Asegúrese de que el edificio tiene informada la
                        Superficie, CEE e ITE.
                      </p>
                    </div>
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
              <p className="font-bold mb-0.5">
                Documento: Libro del Edificio Existente (LEE)
              </p>
              <p className="text-[10px] hidden sm:block italic">
                Conforme a RD 853/2021 - Anexo I | Generación automática con
                datos de Catastro + CEE + ITE
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
                v1.2.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLEE;
