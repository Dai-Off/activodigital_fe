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

const CATEGORIA_TECNICA = "technical";

const ModalCalidades: React.FC<ModalCalidadesProps> = ({ active, setActive, buildingData }) => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<GestionDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

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
            d.category?.toLowerCase().includes("técnic")
        );
        setDocs(tecnicos);
      })
      .catch((err) => {
        setError(err?.message ?? "Error al cargar documentos");
        setDocs([]);
      })
      .finally(() => setLoading(false));
  }, [active, buildingId]);

  const totalDocs = docs.length;
  const tieneDocumentacion = totalDocs > 0;

  const handleGenerar = () => {
    setGenerating(true);
    // TODO: integración API generación ARKIA
    setTimeout(() => setGenerating(false), 1500);
  };

  const handleSubir = () => {
    setActive(false);
    if (buildingId) {
      navigate(`/building/${buildingId}/gestion`);
    }
  };

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
        {/* Estado - derivado de documentos API */}
        <div className="border rounded-lg p-3 bg-gray-50 border-gray-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <Clock className="w-5 h-5 text-gray-600" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              {loading ? (
                <>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Cargando…</h3>
                  <p className="text-xs text-gray-700">Obteniendo datos de documentación</p>
                </>
              ) : error ? (
                <>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Error</h3>
                  <p className="text-xs text-gray-700">{error}</p>
                </>
              ) : tieneDocumentacion ? (
                <>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Documentación técnica disponible
                  </h3>
                  <p className="text-xs text-gray-700">
                    {totalDocs} documento{totalDocs !== 1 ? "s" : ""} en esta categoría
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Pendiente de cargar</h3>
                  <p className="text-xs text-gray-700">
                    No hay documentación técnica asociada. Sube documentos desde Gestión.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Timeline - no hay API de seguimiento */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" aria-hidden />
            Timeline del Proceso
          </h3>
          <div className="text-xs text-gray-500 py-2">
            No hay datos de seguimiento disponibles.
          </div>
        </div>

        {/* Checklist - documentos técnicos desde API */}
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <SquareCheckBig className="w-4 h-4 text-emerald-600" aria-hidden />
              Documentación Técnica
            </h3>
            {!loading && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700">
                  {totalDocs} documento{totalDocs !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
          {loading ? (
            <div className="text-xs text-gray-500 py-2">Cargando…</div>
          ) : docs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-2 bg-gray-50 border-gray-300"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden />
                    <p className="text-xs font-medium text-gray-900 truncate" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 py-2 bg-gray-50 rounded-lg px-3">
              No hay documentos técnicos. Añade documentación desde Gestión.
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-emerald-600" aria-hidden />
            Acciones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleGenerar}
              disabled={generating}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow text-xs font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wrench className="w-3.5 h-3.5" aria-hidden />
              <span className="hidden md:inline">
                {generating ? "Generando…" : "Generar con ARKIA (Automático)"}
              </span>
              <span className="md:hidden">{generating ? "…" : "Generar ARKIA"}</span>
            </button>
            <button
              type="button"
              onClick={handleSubir}
              className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden />
              <span className="hidden sm:inline">Subir Memoria Propia</span>
              <span className="sm:hidden">Subir</span>
            </button>
          </div>
        </div>

        {/* Info - texto informativo sobre el documento */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" aria-hidden />
            <div className="text-xs text-amber-900">
              <p className="font-bold mb-1">Documento clave para el banco</p>
              <p>
                La Memoria de Calidades es el documento que el tasador y el banco necesitan para
                validar que la rehabilitación cumple con los criterios de Préstamo Verde y
                Taxonomía EU. Asegúrate de tenerla confirmada antes de enviar al banco.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ModalCalidades;
