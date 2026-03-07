import React, { useState, useEffect } from "react";
import {
  Settings,
  Clock,
  Calendar,
  SquareCheckBig,
  Wrench,
  Upload,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { Building } from "~/services/buildingsApi";
import type { GestionDocument } from "~/services/gestionDocuments";
import {
  listGestionDocuments,
  uploadGestionDocument,
  extractMemoriaCalidadesData,
} from "~/services/gestionDocuments";
import ModalFrame from "./ModalFrame";

interface ModalCalidadesProps {
  active: boolean;
  setActive: (value: boolean) => void;
  buildingData?: Building | null;
}

/* ─── Especificaciones técnicas esperadas ────────────────────────────── */
const SPEC_ITEMS = [
  { key: "sate", emoji: "🏠", label: "SATE - Aislamiento térmico" },
  { key: "ventanas", emoji: "🪟", label: "Ventanas - PVC bajo emisivo" },
  { key: "calefaccion", emoji: "🔥", label: "Calefacción - Aerotermia" },
  { key: "fotovoltaica", emoji: "☀️", label: "Fotovoltaica - Paneles solares" },
  { key: "griferia", emoji: "💧", label: "Grifería - Bajo consumo agua" },
  { key: "acabados", emoji: "🎨", label: "Acabados - Sin COVs" },
];

const CATEGORIA_TECNICA = "technical";

/* ─── Pasos del timeline ─────────────────────────────────────────────── */
const TIMELINE_STEPS = [
  { label: "Cargada", number: 1 },
  { label: "Validada", number: 2 },
  { label: "Confirmada", number: 3 },
];

const ModalCalidades: React.FC<ModalCalidadesProps> = ({
  active,
  setActive,
  buildingData,
}) => {
  const [docs, setDocs] = useState<GestionDocument[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados para subida
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [simulatedStep, setSimulatedStep] = useState(-1);

  const buildingId = buildingData?.id;
  const subtitulo = buildingData?.address ?? null;

  useEffect(() => {
    if (!active || !buildingId) {
      setDocs([]);
      setShowUpload(false);
      setSelectedFile(null);
      setSimulatedStep(-1);
      return;
    }
    setLoading(true);
    listGestionDocuments(buildingId)
      .then((all) => {
        const tecnicos = all.filter(
          (d) =>
            d.category === CATEGORIA_TECNICA ||
            d.category?.toLowerCase().includes("technical") ||
            d.category?.toLowerCase().includes("técnic"),
        );
        setDocs(tecnicos);
      })
      .catch(() => {
        setDocs([]);
      })
      .finally(() => setLoading(false));
  }, [active, buildingId]);

  /* ── Checklist: marcar ítems ─────────────────────────────────────── */
  let checkedCount = 0;
  let checklistPercent = 0;
  const matchedSpecs = new Set<string>();

  if (docs.length > 0) {
    // Si hay documentos, intentamos sacar el checklist de la metadata del más reciente
    const latestDoc = docs[0];
    const aiChecklist = latestDoc.metadata?.checklist;

    if (aiChecklist) {
      SPEC_ITEMS.forEach((spec) => {
        if (aiChecklist[spec.key]) {
          matchedSpecs.add(spec.key);
        }
      });
    }

    checkedCount = matchedSpecs.size;
    checklistPercent =
      SPEC_ITEMS.length > 0
        ? Math.round((checkedCount / SPEC_ITEMS.length) * 100)
        : 0;
  }

  /* ── Derivar paso del timeline ─────────────────────────────────────── */
  const realStepIndex = docs.length > 0 ? 2 : -1;
  const currentStepIndex = simulatedStep >= 0 ? simulatedStep : realStepIndex;

  const handleSubir = () => {
    setShowUpload(true);
  };

  const handleCancelUpload = () => {
    setShowUpload(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || !buildingId) return;
    setIsUploading(true);
    setSimulatedStep(0); // Paso 1: Cargada (visual)

    try {
      // Cerramos el modal de subida inmediatamente para ver el progreso en el modal principal
      setShowUpload(false);

      // 1) Procesar con IA PRIMERO (Análisis)
      // Usamos el archivo directamente para la IA
      const aiData = await extractMemoriaCalidadesData(selectedFile);

      setSimulatedStep(1); // Paso 2: Validada (IA terminó con éxito)

      // 2) Si la IA fue exitosa, subir documento de forma permanente con sus metadatos
      const res = await uploadGestionDocument(
        selectedFile,
        buildingId,
        "technical",
        "system",
        aiData, // Pasamos los resultados de la IA para que se guarden en 'metadata'
      );

      if (!res.success) {
        throw new Error(res.error || "Error al guardar el documento.");
      }

      // 3) Actualizar estado local
      if (res.document) {
        // Asegurarnos de que el doc local tenga la metadata para el checklist
        const fullDoc = {
          ...res.document,
          metadata: aiData,
        };
        setDocs((prev) => [fullDoc, ...prev]);
      }

      setSelectedFile(null); // Limpiar archivo seleccionado solo tras éxito

      // 4) Finalizar
      setTimeout(() => {
        setSimulatedStep(2); // Paso 3: Confirmada
        setIsUploading(false);
      }, 1000);
    } catch (err: any) {
      console.error("Error en el proceso de carga/validación:", err);
      setIsUploading(false);
      setSimulatedStep(-1); // Estado de error en el timeline
      alert(
        err?.message ||
          "Error al procesar el documento. Por favor, asegúrate de que es un PDF válido.",
      );
      // NO limpiamos selectedFile aquí por si el usuario quiere reintentar tras el error
    }
  };

  const Skeleton = () => (
    <div className="space-y-4 animate-pulse">
      {/* Timeline Skeleton */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="h-2 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
      {/* Checklist Skeleton */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex justify-between mb-4">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-10"></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-9 bg-gray-100 rounded-lg border border-gray-200"
            ></div>
          ))}
        </div>
      </div>
      {/* Actions Skeleton */}
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  );

  return (
    <ModalFrame
      active={active}
      onClose={() => setActive(false)}
      icon={<Settings className="w-4 h-4 text-white" aria-hidden />}
      title="Gestor de Estado - Memoria de Calidades"
      subtitle={subtitulo}
      maxWidth="4xl"
    >
      <div className="relative">
        {loading ? (
          <Skeleton />
        ) : (
          <div className="space-y-3">
            {/* ── Timeline del Proceso ───────────────────────────── */}
            <div className="border border-gray-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" aria-hidden />
                Timeline del Proceso
              </h3>
              <div className="relative">
                {/* Línea horizontal conectora */}
                <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-300" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isReached = currentStepIndex >= idx;
                    return (
                      <div
                        key={step.label}
                        className="relative flex flex-col items-center"
                      >
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shadow transition-all ${
                            isReached
                              ? "bg-emerald-50 border-emerald-500"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <span
                            className={`text-xs font-bold ${
                              isReached ? "text-emerald-700" : "text-gray-400"
                            }`}
                          >
                            {step.number}
                          </span>
                        </div>
                        <div className="mt-3 text-center">
                          <p
                            className={`text-xs font-bold ${
                              isReached ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${
                              isReached ? "text-emerald-600" : "text-gray-400"
                            }`}
                          >
                            {isReached ? "Completado" : "Pendiente"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Checklist de Especificaciones Técnicas ──────────── */}
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <SquareCheckBig
                    className="w-4 h-4 text-emerald-600"
                    aria-hidden
                  />
                  Checklist de Especificaciones Técnicas
                </h3>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-gray-700">
                    {checkedCount}/{SPEC_ITEMS.length}
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all"
                      style={{ width: `${checklistPercent}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    {checklistPercent}%
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SPEC_ITEMS.map((spec) => {
                  const isMatched = matchedSpecs.has(spec.key);
                  return (
                    <div
                      key={spec.key}
                      className={`border rounded-lg p-2 ${isMatched ? "bg-emerald-50 border-emerald-300" : "bg-gray-50 border-gray-300"}`}
                    >
                      <div className="flex items-center gap-2">
                        {isMatched ? (
                          <CheckCircle2
                            className="w-4 h-4 text-emerald-600 flex-shrink-0"
                            aria-hidden
                          />
                        ) : (
                          <Clock
                            className="w-4 h-4 text-gray-400 flex-shrink-0"
                            aria-hidden
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-medium truncate ${isMatched ? "text-emerald-900" : "text-gray-900"}`}
                          >
                            {spec.emoji} {spec.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Acciones Disponibles ────────────────────────────── */}
            <div className="border border-gray-200 rounded-lg p-3">
              <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-600" aria-hidden />
                Acciones Disponibles
              </h3>
              <button
                type="button"
                onClick={handleSubir}
                className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden />
                <span>Cargar Memoria de Calidades</span>
              </button>
            </div>

            {/* ── Info – Documento protagonista para el banco ─────── */}
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info
                  className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                  aria-hidden
                />
                <div className="text-xs text-amber-900">
                  <p className="font-bold mb-1">
                    📋 Documento protagonista para el banco
                  </p>
                  <p>
                    La Memoria de Calidades es el{" "}
                    <strong>documento clave</strong> que el tasador y el banco
                    necesitan para validar que la rehabilitación cumple con los
                    criterios de <strong>Préstamo Verde</strong> y Taxonomía EU.
                    Asegúrate de que esté confirmada antes de enviar al banco.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Overlay Modal de Subida ────────────────────────── */}
        {showUpload && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-xs border border-gray-200">
              <h3 className="font-bold text-sm mb-3">
                Subir Tu Memoria de Calidades
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <Upload
                  className="w-10 h-10 text-gray-400 mx-auto mb-2"
                  aria-hidden="true"
                />
                <p className="text-xs text-gray-600 mb-2">
                  {selectedFile
                    ? selectedFile.name
                    : "Arrastra aquí el PDF o haz clic para seleccionar"}
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload-memoria"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload-memoria"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer inline-block text-xs font-medium"
                >
                  Seleccionar Archivo
                </label>
              </div>
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
                <p className="text-[11px] text-blue-900">
                  <strong>🤖 La IA validará automáticamente:</strong>{" "}
                  Cumplimiento Taxonomía EU, especificaciones técnicas, y
                  criterios DNSH
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCancelUpload}
                  disabled={isUploading}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={!selectedFile || isUploading}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium disabled:opacity-50"
                >
                  {isUploading ? "Procesando con IA..." : "Subir y Validar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalFrame>
  );
};

export default ModalCalidades;
