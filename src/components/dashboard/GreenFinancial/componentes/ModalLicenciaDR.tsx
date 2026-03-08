import React, { useState, useEffect } from "react";
import { Shield, MapPin, Zap, Clock, CircleCheck, Info, Upload, CheckCircle2, AlertTriangle, Download, FileText, Loader2 } from "lucide-react";
import type { Building } from "~/services/buildingsApi";
import type { GestionDocument } from "~/services/gestionDocuments";
import {
  listGestionDocuments,
  uploadGestionDocument,
  extractLicenciaDRRequirements,
  extractLicenciaDRDocData,
  generateLicenciaDraft,
  updateBuildingDocMetadata
} from "~/services/gestionDocuments";
import ModalFrame from "./ModalFrame";

interface ModalLicenciaDRProps {
  active: boolean;
  setActive: (value: boolean) => void;
  buildingData?: Building | null;
}

const CATEGORY = "licenciadr";

const ModalLicenciaDR: React.FC<ModalLicenciaDRProps> = ({ active, setActive, buildingData }) => {
  const [verProcedimiento, setVerProcedimiento] = useState(false);
  const [docs, setDocs] = useState<GestionDocument[]>([]);
  const [loading, setLoading] = useState(false);

  // States for main municipal PDF
  const [isUploadingMain, setIsUploadingMain] = useState(false);

  // States for requirement docs upload
  const [uploadingReqKey, setUploadingReqKey] = useState<string | null>(null);
  const [isUploadingReq, setIsUploadingReq] = useState(false);

  // PDF Generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual data inputs state (for type 'data' requirements)
  const [manualDataInputs, setManualDataInputs] = useState<Record<string, string>>({});
  const [isSavingManualData, setIsSavingManualData] = useState(false);

  const buildingId = buildingData?.id;

  const ubicacion =
    buildingData?.addressData?.municipality ?? buildingData?.addressData?.province ?? null;
  const pem = buildingData?.rehabilitationCost;
  const costeEstimado =
    pem != null && pem > 0
      ? `${(pem * 0.004).toLocaleString("es-ES", { maximumFractionDigits: 0 })} € (≈0.4% sobre PEM)`
      : null;

  useEffect(() => {
    if (!active || !buildingId) {
      setDocs([]);
      setUploadingReqKey(null);
      setManualDataInputs({});
      return;
    }
    fetchDocs();
  }, [active, buildingId]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const all = await listGestionDocuments(buildingId!, CATEGORY);
      // Parsear metadatos si vienen como string
      const parsedDocs = all.map(d => {
        let meta: any = d.metadata;
        // Intentar parsear si es string, incluso si está doblemente encodeado
        while (typeof meta === 'string' && (meta.startsWith('{') || meta.startsWith('['))) {
          try {
            meta = JSON.parse(meta);
          } catch (e) {
            break;
          }
        }
        return { ...d, metadata: meta };
      });
      setDocs(parsedDocs);
    } catch (err) {
      setDocs([]);
    } finally {
      setLoading(false);
    }
  };

  const municipalDoc = docs.find((d) =>
    d.metadata?.is_municipal_regulation === true || 
    d.metadata?.is_municipal_regulation === "true" ||
    (d.metadata?.requirements && Array.isArray(d.metadata.requirements))
  );
  const requirements = municipalDoc?.metadata?.requirements || [];
  const summary = municipalDoc?.metadata?.summary || "";
  const workType = municipalDoc?.metadata?.work_type || "Declaración Responsable (DR)";

  // Check functions
  const checkRequirementStatus = (req: any) => {
    if (req.type === 'data') {
      if (!buildingData) return false;

      // 1. Check if it exists in manual_data of the municipal document
      const manualData = municipalDoc?.metadata?.manual_data || {};
      if (manualData[req.key]) return true;

      const lowerKey = req.key.toLowerCase();
      const lowerLabel = req.label.toLowerCase();
      const searchStr = `${lowerKey} ${lowerLabel}`;

      if (searchStr.includes("propietario") || searchStr.includes("titular")) {
        return !!buildingData.propietarioEmail;
      }
      if (searchStr.includes("ubicacion") || searchStr.includes("direccion") || searchStr.includes("localizacion")) {
        return !!buildingData.address || !!buildingData.addressData?.municipality;
      }
      if (searchStr.includes("catastral")) {
        return !!buildingData.cadastralReference;
      }
      if (searchStr.includes("presupuesto") || searchStr.includes("pem")) {
        return (buildingData.rehabilitationCost ?? 0) > 0;
      }
      // Por defecto, si es data y no sabemos qué es, no lo marcamos como OK automáticamente
      return false;
    }

    if (req.type === 'document') {
      return docs.some((d) => d.metadata?.requirementKey === req.key);
    }
    return false;
  };

  const allSatisfied = requirements.length > 0 && requirements.every(checkRequirementStatus);

  const handleUploadMunicipalPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !buildingId) return;
    const file = e.target.files[0];
    setIsUploadingMain(true);
    try {
      const aiData = await extractLicenciaDRRequirements(file);

      const res = await uploadGestionDocument(
        file,
        buildingId,
        CATEGORY,
        "system",
        {
          is_municipal_regulation: true,
          ...aiData
        }
      );

      return res;
    } catch (err: any) {
      alert("Error al procesar el PDF Municipal: " + err.message);
      return { success: false, error: err.message };
    } finally {
      setIsUploadingMain(false);
    }
  };

  const getRequirementValue = (req: any): string | null => {
    if (req.type === 'data') {
      if (!buildingData) return null;

      // 1. Manual data
      const manualData = municipalDoc?.metadata?.manual_data || {};
      if (manualData[req.key]) return manualData[req.key];

      // 2. Building data
      const lowerKey = req.key.toLowerCase();
      const lowerLabel = req.label.toLowerCase();

      if (lowerKey.includes('pem') || lowerLabel.includes('presupuesto')) {
        return buildingData.rehabilitationCost?.toString() || null;
      }
      if (lowerKey.includes('suelo') || lowerLabel.includes('superficie')) {
        return buildingData.squareMeters?.toString() || null;
      }
      if (lowerKey.includes('tecnico') || lowerLabel.includes('proyectista')) {
        return buildingData.technicianEmail || null;
      }
    }

    // 3. Document data (from AI extraction)
    const doc = docs.find((d) => d.metadata?.requirementKey === req.key);
    if (doc?.metadata?.draft_data) {
      return JSON.stringify(doc.metadata.draft_data);
    }

    return null;
  };

  const handleUploadRequirement = async (e: React.ChangeEvent<HTMLInputElement>, reqKey: string, reqLabel: string) => {
    if (!e.target.files || e.target.files.length === 0 || !buildingId) return;
    const file = e.target.files[0];

    setUploadingReqKey(reqKey);
    setIsUploadingReq(true);
    try {
      const aiData = await extractLicenciaDRDocData(file, reqLabel);

      const res = await uploadGestionDocument(
        file,
        buildingId,
        CATEGORY,
        "system",
        {
          requirementKey: reqKey,
          draft_data: aiData
        }
      );

      if (!res.success) throw new Error(res.error);

      await fetchDocs();
    } catch (err: any) {
      alert("Error adjuntando documento: " + err.message);
    } finally {
      setIsUploadingReq(false);
      setUploadingReqKey(null);
    }
  };

  const handleSaveManualData = async (reqKey: string) => {
    if (!municipalDoc?.id || !manualDataInputs[reqKey]) return;

    setIsSavingManualData(true);
    try {
      const currentMetadata = municipalDoc.metadata || {};
      const newMetadata = {
        ...currentMetadata,
        manual_data: {
          ...(currentMetadata.manual_data || {}),
          [reqKey]: manualDataInputs[reqKey]
        }
      };

      await updateBuildingDocMetadata(municipalDoc.id, newMetadata);
      await fetchDocs(); // Refresh
      // Clear local input after success
      setManualDataInputs(prev => {
        const next = { ...prev };
        delete next[reqKey];
        return next;
      });
    } catch (error) {
      console.error("Error saving manual data:", error);
    } finally {
      setIsSavingManualData(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!buildingData) return;
    setIsGenerating(true);
    try {
      const extractedData: any = {};
      
      // 1. Data from requirement documents
      docs.forEach(d => {
        if (d.metadata?.draft_data) {
          Object.assign(extractedData, d.metadata.draft_data);
        }
      });

      // 2. Manual data from municipal doc
      if (municipalDoc?.metadata?.manual_data) {
        Object.assign(extractedData, { manual_inputs: municipalDoc.metadata.manual_data });
      }

      // 3. Status summary
      const statusSummary = requirements.map((req: any) => ({
        label: req.label,
        satisfied: checkRequirementStatus(req),
        value: getRequirementValue(req)
      }));

      // 4. Collect satisfied document paths for merging
      const docPaths = requirements
        .filter((req: any) => req.type === 'document' && checkRequirementStatus(req))
        .map((req: any) => {
          const doc = docs.find(d => d.metadata?.requirementKey === req.key);
          return doc?.storagePath;
        })
        .filter(Boolean);

      const blob = await generateLicenciaDraft(buildingData, { 
        ...extractedData, 
        status_summary: statusSummary,
        doc_paths: docPaths
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Borrador_Licencia_${buildingData.address || 'Edificio'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err: any) {
      alert("Error al generar el borrador: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const Skeleton = () => (
    <div className="space-y-4 animate-pulse w-full">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="w-24 h-6 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <div className="h-12 bg-gray-100 rounded-lg border border-gray-200"></div>
        <div className="h-12 bg-gray-100 rounded-lg border border-gray-200"></div>
      </div>

      {/* Description Skeleton */}
      <div className="h-10 bg-gray-100 rounded-lg border border-gray-200"></div>

      {/* Advantage Skeleton */}
      <div className="h-16 bg-gray-100 rounded-lg border border-gray-200"></div>

      {/* Button Skeleton */}
      <div className="h-10 bg-gray-100 rounded-lg border border-gray-200"></div>
    </div>
  );

  return (
    <ModalFrame
      active={active}
      onClose={() => setActive(false)}
      icon={<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" aria-hidden />}
      title="Detector de Licencia / Declaración Responsable"
      subtitle="Análisis automático de requisitos administrativos"
      maxWidth="5xl"
    >
      <div className={`border rounded-lg p-2.5 sm:p-3 min-h-[300px] ${loading ? "bg-gray-50 border-gray-200" : "bg-green-50 border-green-300"}`}>
        {loading ? (
          <div className="flex flex-col py-6 space-y-4 w-full">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
            <Skeleton />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg border bg-green-100 text-green-800 border-green-300">
                  <Shield className="w-5 h-5 text-green-700" aria-hidden />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-green-700">
                    {workType}
                  </h3>
                  {ubicacion && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                      <MapPin className="w-3 h-3" aria-hidden />
                      <span>{ubicacion}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-3 py-1 rounded-lg text-xs border bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
                <Zap className="w-3 h-3" aria-hidden />
                <span>RECOMENDADO</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-0.5">
                  <Clock className="w-3 h-3" aria-hidden />
                  <span className="font-semibold">Plazo estimado</span>
                </div>
                <p className="text-xs font-bold text-gray-900">
                  1-2 semanas (inicio inmediato si documentación completa)
                </p>
              </div>
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-0.5">
                  <span>💰</span>
                  <span className="font-semibold">Coste estimado</span>
                </div>
                {costeEstimado ? (
                  <p className="text-xs font-bold text-gray-900">
                    Tasas: {costeEstimado}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Introduce el coste de rehabilitación (PEM) en el edificio para estimar.
                  </p>
                )}
              </div>
            </div>

            {summary && (
              <div className="bg-white rounded-lg p-3 border border-blue-200 mb-3 text-xs text-blue-800">
                <p className="font-semibold mb-1">Resumen del trámite detectado:</p>
                <p>{summary}</p>
              </div>
            )}

            <div className="bg-white rounded-lg p-3 border-2 border-gray-200 mb-3">
              <p className="text-xs text-gray-700">
                Para obras de rehabilitación energética en fachadas, cubiertas e instalaciones sin
                afectar estructura ni aumentar volumen edificable.
              </p>
            </div>

            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 mb-3 flex justify-between items-center">
              <div className="flex items-start gap-2">
                <CircleCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" aria-hidden />
                <div className="text-xs">
                  <p className="font-bold text-green-900 mb-1">Ventaja: Inicio Inmediato</p>
                  <p className="text-green-800">
                    Con Declaración Responsable puedes iniciar las obras inmediatamente tras presentar
                    la documentación. Acelera el desembolso bancario y reduce el time-to-market.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setVerProcedimiento(!verProcedimiento)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-3 text-xs font-semibold shadow-sm"
            >
              <span className="text-gray-700">
                {verProcedimiento
                  ? "Ocultar Documentación y Procedimiento"
                  : "Ver Documentación y Procedimiento Completo"}
              </span>
              <Info className="w-4 h-4 text-gray-600" aria-hidden />
            </button>

            {verProcedimiento && (
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-3 space-y-4 shadow-sm">
                <p className="text-xs text-gray-600">
                  Consulta y gestiona la documentación requerida para el ayuntamiento de{" "}
                  <span className="font-bold">{ubicacion ?? "tu municipio"}</span>.
                </p>

                {!municipalDoc ? (
                  <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg p-5 text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-700 mb-1">Cargar Requisitos del Ayuntamiento</h4>
                    <p className="text-xs text-gray-500 mb-4">Sube la ordenanza o el PDF municipal para extraer los requisitos automáticamente.</p>

                    <input
                      type="file"
                      id="municipal-pdf-upload"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleUploadMunicipalPdf}
                    />
                    <label
                      htmlFor="municipal-pdf-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      {isUploadingMain ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analizando PDF...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Cargar Requisitos (PDF)
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Requisitos Extraídos
                    </h4>
                    <div className="space-y-2">
                      {requirements.map((req: any) => {
                        const satisfied = checkRequirementStatus(req);

                        return (
                          <div
                            key={req.key}
                            className={`flex items-center justify-between p-3 rounded-lg border ${satisfied
                                ? "bg-green-50 border-green-200"
                                : "bg-white border-gray-200"
                              }`}
                          >
                            <div className="flex items-start gap-2 flex-1 min-w-0">
                              {satisfied ? (
                                <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                                </div>
                              ) : (
                                <div className="mt-0.5 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className={`text-xs font-bold ${satisfied ? "text-green-900" : "text-gray-800"}`}>
                                  {req.label}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  {req.description}
                                </p>
                              </div>
                            </div>

                            <div className="ml-3 flex-shrink-0">
                              {satisfied ? (
                                <span className="inline-flex py-1 px-2 text-[10px] font-semibold bg-green-100 text-green-800 rounded">
                                  OK
                                </span>
                              ) : req.type === 'document' ? (
                                <div>
                                  <input
                                    type="file"
                                    id={`upload-req-${req.key}`}
                                    className="hidden"
                                    onChange={(e) => handleUploadRequirement(e, req.key, req.label)}
                                  />
                                  <label
                                    htmlFor={`upload-req-${req.key}`}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-sm ${(isUploadingReq && uploadingReqKey === req.key)
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                                      }`}
                                  >
                                    {isUploadingReq && uploadingReqKey === req.key ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Subiendo...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Cargar Doc</span>
                                      </>
                                    )}
                                  </label>
                                </div>
                              ) : req.type === 'data' ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder={`Valor...`}
                                    className="w-24 px-2 py-1 text-[11px] border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    value={manualDataInputs[req.key] || ""}
                                    onChange={(e) => setManualDataInputs(prev => ({ ...prev, [req.key]: e.target.value }))}
                                  />
                                  <button
                                    onClick={() => handleSaveManualData(req.key)}
                                    disabled={!manualDataInputs[req.key] || isSavingManualData}
                                    className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 disabled:opacity-50"
                                    title="Guardar dato"
                                  >
                                    {isSavingManualData ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Upload className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="inline-flex py-1 px-2 text-[10px] font-semibold bg-orange-100 text-orange-800 rounded items-center gap-1 border border-orange-200">
                                  <AlertTriangle className="w-3 h-3" /> Dato Faltante
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {allSatisfied && (
                      <div className="mt-6 bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                        <h4 className="text-sm font-bold text-green-900 mb-1">
                          Expediente Completo
                        </h4>
                        <p className="text-xs text-green-800 mb-4">
                          Todos los requisitos han sido validados. Ya puedes generar el borrador oficial.
                        </p>
                        <button
                          onClick={handleGenerateDraft}
                          disabled={isGenerating}
                          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generando Borrador...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Generar Borrador de Licencia
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </ModalFrame>
  );
};

export default ModalLicenciaDR;
