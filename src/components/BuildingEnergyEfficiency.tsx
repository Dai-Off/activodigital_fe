import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "~/contexts/ToastContext";
import { BuildingsApiService, type Building } from "~/services/buildingsApi";
import {
  EnergyCertificatesService,
  type PersistedEnergyCertificate,
} from "~/services/energyCertificates";
import { BuildingEnergyEfficiencyLoading } from "./ui/dashboardLoading";

export function BuildingEnergyEfficiency() {
  // Hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useToast();

  // Estado
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState<Building | null>(null);
  const [_energyCertificates, setEnergyCertificates] = useState<
    PersistedEnergyCertificate[]
  >([]);

  // Cargar datos del edificio
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const buildingData = await BuildingsApiService.getBuildingById(id);
        setBuilding(buildingData);

        // Cargar certificados energéticos
        try {
          const certificatesData =
            await EnergyCertificatesService.getByBuilding(buildingData.id);
          setEnergyCertificates(certificatesData.certificates || []);
        } catch (error) {
          console.error("Error cargando certificados:", error);
        }

        setLoading(false);
      } catch (error) {
        showError("Error al cargar datos del edificio");
        navigate("/assets");
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate, showError]);

  // Mostrar skeleton mientras carga
  if (loading) {
    return <BuildingEnergyEfficiencyLoading />;
  }

  return (
    <div className="flex-1 overflow-hidden mt-2">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 shadow-sm relative group">
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                  title="Ver información detallada sobre eficiencia energética"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-circle-question-mark w-3 h-3 text-green-600"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-zap w-4 h-4 text-green-600"
                      aria-hidden="true"
                    >
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm">Eficiencia Energética</h2>
                    <p className="text-xs text-gray-500">
                      {building?.name || "Edificio"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-green-50 rounded border-l-2 border-green-500">
                    <p className="text-xs text-gray-600 mb-1">Clase</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs bg-yellow-500">
                        D
                      </div>
                      <div>
                        <p className="text-sm">85.42 kWh/m²·año</p>
                        <p className="text-xs text-gray-600">kWh/m²</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                    <p className="text-xs text-gray-600 mb-1">CO₂</p>
                    <p className="text-sm mb-0.5">16.74 kg CO₂eq/m²·año</p>
                    <p className="text-xs text-gray-600">kg/m²</p>
                    <div className="flex items-center gap-0.5 mt-1 text-green-600 text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-trending-down w-3 h-3"
                        aria-hidden="true"
                      >
                        <path d="M16 17h6v-6"></path>
                        <path d="m22 17-8.5-8.5-5 5L2 7"></path>
                      </svg>
                      <span>-12%</span>
                    </div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded border-l-2 border-purple-500">
                    <p className="text-xs text-gray-600 mb-1">
                      Mejora Potencial
                    </p>
                    <p className="text-sm mb-0.5">B</p>
                    <p className="text-xs text-gray-600">
                      Calificación objetivo
                    </p>
                    <div className="flex items-center gap-0.5 mt-1 text-purple-600 text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-trending-down w-3 h-3"
                        aria-hidden="true"
                      >
                        <path d="M16 17h6v-6"></path>
                        <path d="m22 17-8.5-8.5-5 5L2 7"></path>
                      </svg>
                      <span>-24 kWh/m²·año</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm relative group">
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                  title="Ver información detallada sobre cumplimiento por tipología"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-circle-question-mark w-3 h-3 text-blue-600"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </button>
                <h3 className="text-sm mb-2">Cumplimiento por Tipología</h3>
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-700">Estado</span>
                    <span className="text-xs text-gray-900">89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: "89%" }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Cumple 89% de requisitos para edificios comerciales.
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm relative group">
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-indigo-100 border border-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                  title="Ver información detallada sobre el libro del edificio"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-circle-question-mark w-3 h-3 text-indigo-600"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </button>
                <h3 className="text-sm mb-2">Libro del Edificio</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Estado</span>
                    <span className="text-green-600">Completado</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Última actualización</span>
                    <span className="text-blue-600">08/11/2024</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-gray-600">Tareas completadas</span>
                      <span className="text-gray-900">8/8</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 shadow-sm relative group">
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-amber-100 border border-amber-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                  title="Ver información detallada sobre el estado de la sección"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-circle-question-mark w-3 h-3 text-amber-600"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </button>
                <h3 className="text-sm mb-2">Estado de la Sección</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 capitalize">
                      documentacion
                    </span>
                    <span className="text-green-600">OK</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 capitalize">
                      certificados
                    </span>
                    <span className="text-green-600">OK</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 capitalize">
                      instalaciones
                    </span>
                    <span className="text-green-600">OK</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 capitalize">
                      mantenimiento
                    </span>
                    <span className="text-orange-600">Pendiente</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 capitalize">seguros</span>
                    <span className="text-green-600">OK</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 capitalize">contratos</span>
                    <span className="text-red-600">Expiring</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 capitalize">legal</span>
                    <span className="text-green-600">OK</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 capitalize">financiero</span>
                    <span className="text-green-600">OK</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-3 shadow-sm border-l-2 border-green-500 relative group">
                <button
                  className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                  title="Ver información detallada sobre oportunidades de mejora"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-circle-question-mark w-3 h-3 text-purple-600"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </button>
                <h3 className="text-sm mb-2">Oportunidades de Mejora</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">1</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-900">
                        Actualización aislamiento térmico
                      </p>
                      <p className="text-xs text-gray-600">
                        Ahorro: 15% (€3,200/año)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">2</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-900">
                        Instalación paneles solares
                      </p>
                      <p className="text-xs text-gray-600">
                        ROI: 6.5 años | Subvención: €25k
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">3</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-900">
                        Sistema gestión energética
                      </p>
                      <p className="text-xs text-gray-600">
                        Monitorización | Ahorro: 8%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">4</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-900">
                        Mejora climatización HVAC
                      </p>
                      <p className="text-xs text-gray-600">Eficiencia: +20%</p>
                    </div>
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
