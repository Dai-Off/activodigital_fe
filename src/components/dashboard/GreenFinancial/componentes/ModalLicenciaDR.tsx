import React, { useState } from "react";
import { Shield, MapPin, Zap, Clock, CircleCheck, Info } from "lucide-react";
import type { Building } from "~/services/buildingsApi";
import ModalFrame from "./ModalFrame";

interface ModalLicenciaDRProps {
  active: boolean;
  setActive: (value: boolean) => void;
  buildingData?: Building | null;
}

const ModalLicenciaDR: React.FC<ModalLicenciaDRProps> = ({ active, setActive, buildingData }) => {
  const [verProcedimiento, setVerProcedimiento] = useState(false);

  const ubicacion =
    buildingData?.addressData?.municipality ?? buildingData?.addressData?.province ?? null;
  const pem = buildingData?.rehabilitationCost;
  const costeEstimado =
    pem != null && pem > 0
      ? `${(pem * 0.004).toLocaleString("es-ES", { maximumFractionDigits: 0 })} € (≈0.4% sobre PEM)`
      : null;

  return (
    <ModalFrame
      active={active}
      onClose={() => setActive(false)}
      icon={<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" aria-hidden />}
      title="Detector de Licencia / Declaración Responsable"
      subtitle="Análisis automático de requisitos administrativos"
      maxWidth="5xl"
    >
      <div className="border rounded-lg p-2.5 sm:p-3 bg-green-50 border-green-300">
          <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg border bg-green-100 text-green-800 border-green-300">
                <Shield className="w-5 h-5 text-green-700" aria-hidden />
              </div>
              <div>
                <h3 className="text-sm font-bold text-green-700">
                  Declaración Responsable (DR)
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

          <div className="bg-white rounded-lg p-3 border-2 border-gray-200 mb-3">
            <p className="text-xs text-gray-700">
              Para obras de rehabilitación energética en fachadas, cubiertas e instalaciones sin
              afectar estructura ni aumentar volumen edificable.
            </p>
          </div>

          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 mb-3">
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
            className="w-full flex items-center justify-between px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-3 text-xs font-semibold"
          >
            <span className="text-gray-700">
              {verProcedimiento
                ? "Ocultar"
                : "Ver Documentación y Procedimiento Completo"}
            </span>
            <Info className="w-4 h-4 text-gray-600" aria-hidden />
          </button>

          {verProcedimiento && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
              Consulta la documentación requerida y el procedimiento en el ayuntamiento de{" "}
              {ubicacion ?? "tu municipio"}.
            </div>
          )}
        </div>
    </ModalFrame>
  );
};

export default ModalLicenciaDR;
