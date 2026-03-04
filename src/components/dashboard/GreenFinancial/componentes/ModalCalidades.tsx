import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Clock,
  Calendar,
  SquareCheckBig,
  Wrench,
  Upload,
  Info,
} from "lucide-react";
import type { Building } from "~/services/buildingsApi";
import type { GestionDocument } from "~/services/gestionDocuments";
import { listGestionDocuments } from "~/services/gestionDocuments";
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
  const navigate = useNavigate();
  const [docs, setDocs] = useState<GestionDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildingId = buildingData?.id;
  const subtitulo = buildingData?.address ?? null;

  useEffect(() => {
    if (!active || !buildingId) {
      setDocs([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
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
      .catch((err) => {
        setError(err?.message ?? "Error al cargar documentos");
        setDocs([]);
      })
      .finally(() => setLoading(false));
  }, [active, buildingId]);

  /* ── Checklist: marcar ítems que tienen al menos 1 doc asociado ───── */
  const matchedSpecs = new Set<string>();
  for (const doc of docs) {
    const nameLower = (doc.fileName ?? "").toLowerCase();
    for (const spec of SPEC_ITEMS) {
      if (nameLower.includes(spec.key.toLowerCase())) {
        matchedSpecs.add(spec.key);
      }
    }
  }
  const checkedCount = matchedSpecs.size;
  const checklistPercent =
    SPEC_ITEMS.length > 0
      ? Math.round((checkedCount / SPEC_ITEMS.length) * 100)
      : 0;

  /* ── Derivar paso del timeline ─────────────────────────────────────── */
  const currentStepIndex = docs.length > 0 ? 0 : -1; // -1 = ninguno alcanzado

  const handleSubir = () => {
    setActive(false);
    if (buildingId) {
      navigate(`/building/${buildingId}/gestion`);
    }
  };

  /* ── Estado ─────────────────────────────────────────────────────────── */
  const getEstado = () => {
    if (loading)
      return { title: "Cargando…", desc: "Obteniendo datos de documentación" };
    if (error) return { title: "Error", desc: error };
    if (docs.length > 0)
      return {
        title: "Documentación técnica disponible",
        desc: `${docs.length} documento${docs.length !== 1 ? "s" : ""} en esta categoría`,
      };
    return {
      title: "Estado: Pendiente de Cargar",
      desc: "Aún no se ha cargado la Memoria de Calidades",
    };
  };
  const estado = getEstado();

  return (
    <ModalFrame
      active={active}
      onClose={() => setActive(false)}
      icon={<Settings className="w-4 h-4 text-white" aria-hidden />}
      title="Gestor de Estado - Memoria de Calidades"
      subtitle={subtitulo}
      maxWidth="4xl"
    >
      <div className="space-y-3">
        {/* ── Estado ──────────────────────────────────────────── */}
        <div className="border rounded-lg p-3 bg-gray-50 border-gray-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Clock className="w-5 h-5 text-gray-600" aria-hidden />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                {estado.title}
              </h3>
              <p className="text-xs text-gray-700">{estado.desc}</p>
            </div>
          </div>
        </div>

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
            {SPEC_ITEMS.map((spec) => (
              <div
                key={spec.key}
                className="border rounded-lg p-2 bg-gray-50 border-gray-300"
              >
                <div className="flex items-center gap-2">
                  <Clock
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {spec.emoji} {spec.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
                La Memoria de Calidades es el <strong>documento clave</strong>{" "}
                que el tasador y el banco necesitan para validar que la
                rehabilitación cumple con los criterios de{" "}
                <strong>Préstamo Verde</strong> y Taxonomía EU. Asegúrate de que
                esté confirmada antes de enviar al banco.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ModalCalidades;
