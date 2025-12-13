import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { type InsurancePolicy } from "~/types/insurance";
import { insuranceApiService } from "~/services/insurance";

export function BuildingInsurance() {
  // 1. Obtener el ID del edificio de la URL (igual que en tu ejemplo)
  const { id: buildingId } = useParams<{ id: string }>();

  // 2. Definir estados para los datos y la carga
  const [policies, setPolicies] = useState<InsurancePolicy[] | undefined>();
  const [loading, setLoading] = useState(true);
  // const [building, setBuilding] = useState<Building | null>(); // Opcional si necesitas info del edificio

  useEffect(() => {
    if (!buildingId) {
      setLoading(false);
      return;
    }

    // BuildingsApiService.getBuildingById(buildingId).then((data) =>
    //   setBuilding(data)
    // );

    // 3. Llamar al servicio para obtener las pólizas del edificio
    insuranceApiService
      .getBuildingInsurances(buildingId)
      .then((data) => {
        // La respuesta del servicio es { data: policies[], count: number }
        setPolicies(data.data);
      })
      .catch((error) => {
        console.error("Error al cargar seguros:", error);
        setPolicies(undefined); // En caso de error, dejamos el array indefinido o vacío
      })
      .finally(() => {
        setLoading(false);
      });
  }, [buildingId]);

  if (loading) {
    return <div>Cargando pólizas de seguro...</div>;
  }

  if (!policies || policies.length === 0) {
    return (
      <div>No se han encontrado pólizas de seguro para este edificio.</div>
    );
  }

  console.log(policies);

  return (
    <div className="flex-1 overflow-y-auto mt-2 pr-1">
      <div className="space-y-3">
        <div
          data-slot="card"
          className="flex flex-col gap-6 rounded-xl border  p-4 bg-[#1e3a8a] text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg border border-white/20">
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
                  className="lucide lucide-shield w-6 h-6 text-white"
                  aria-hidden="true"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg">Gestión de Seguros del Inmueble</h3>
                <p className="text-sm text-white/80 mt-1">
                  3 pólizas activas • Prima total anual: €30,500
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm shadow-lg">
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
                className="lucide lucide-upload w-4 h-4"
                aria-hidden="true"
              >
                <path d="M12 3v12"></path>
                <path d="m17 8-5-5-5 5"></path>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              </svg>
              Analizar Nueva Póliza
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div
            data-slot="card"
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver información detallada sobre la cobertura del edificio"
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
            <div className="flex items-center gap-2 mb-2">
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
                className="lucide lucide-building w-4 h-4 text-blue-600"
                aria-hidden="true"
              >
                <path d="M12 10h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M12 6h.01"></path>
                <path d="M16 10h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M16 6h.01"></path>
                <path d="M8 10h.01"></path>
                <path d="M8 14h.01"></path>
                <path d="M8 6h.01"></path>
                <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path>
                <rect x="4" y="2" width="16" height="20" rx="2"></rect>
              </svg>
              <h4 className="text-xs text-gray-600">Cobertura Edificio</h4>
            </div>
            <div className="text-lg">€4.500.000</div>
            <div className="text-xs text-gray-500 mt-1">Valor asegurado</div>
          </div>
          <div
            data-slot="card"
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border border-green-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver información detallada sobre la responsabilidad civil"
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
            <div className="flex items-center gap-2 mb-2">
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
                className="lucide lucide-shield w-4 h-4 text-green-600"
                aria-hidden="true"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              </svg>
              <h4 className="text-xs text-gray-600">Resp. Civil</h4>
            </div>
            <div className="text-lg">€3.000.000</div>
            <div className="text-xs text-gray-500 mt-1">Límite máximo</div>
          </div>
          <div
            data-slot="card"
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver información detallada sobre la prima total"
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
                className="lucide lucide-circle-question-mark w-3 h-3 text-orange-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
            <div className="flex items-center gap-2 mb-2">
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
                className="lucide lucide-euro w-4 h-4 text-orange-600"
                aria-hidden="true"
              >
                <path d="M4 10h12"></path>
                <path d="M4 14h9"></path>
                <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"></path>
              </svg>
              <h4 className="text-xs text-gray-600">Prima Total</h4>
            </div>
            <div className="text-lg">€30,500</div>
            <div className="text-xs text-gray-500 mt-1">Anual</div>
          </div>
          <div
            data-slot="card"
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group"
          >
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              title="Ver información detallada sobre el estado de las pólizas"
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
            <div className="flex items-center gap-2 mb-2">
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
                className="lucide lucide-calendar w-4 h-4 text-purple-600"
                aria-hidden="true"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <h4 className="text-xs text-gray-600">Estado</h4>
            </div>
            <div className="text-xs px-2 py-1 rounded-full inline-block border bg-green-100 text-green-700 border-green-200">
              ✓ Vigente
            </div>
            <div className="text-xs text-gray-500 mt-1">Todas las pólizas</div>
          </div>
        </div>
        <div
          data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
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
                  className="lucide lucide-building w-5 h-5 text-blue-600"
                  aria-hidden="true"
                >
                  <path d="M12 10h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M12 6h.01"></path>
                  <path d="M16 10h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M8 10h.01"></path>
                  <path d="M8 14h.01"></path>
                  <path d="M8 6h.01"></path>
                  <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"></path>
                  <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                </svg>
              </div>
              <div>
                <h4 className="text-sm">Seguro Multirriesgo del Edificio</h4>
                <p className="text-xs text-gray-500">Póliza: MRE-2025-789456</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Prima anual</div>
              <div className="text-sm">€22.200</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Aseguradora</div>
              <div className="text-sm">Mapfre Empresas</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Vigencia</div>
              <div className="text-sm">01/01/2025 - 31/12/2025</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Estado</div>
              <div className="text-xs px-2 py-1 rounded-full inline-block border bg-green-100 text-green-700 border-green-200">
                Vigente
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3 mb-3">
            <h5 className="text-xs mb-3 flex items-center gap-2">
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
                className="lucide lucide-circle-check w-4 h-4 text-green-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Coberturas Incluidas
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    className="lucide lucide-flame w-3 h-3 text-orange-600"
                    aria-hidden="true"
                  >
                    <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"></path>
                  </svg>
                  <span className="text-xs">Continente (edificio)</span>
                </div>
                <div className="text-sm ml-5">€4.500.000</div>
                <div className="text-xs text-gray-500 ml-5">
                  Incendio, explosión, rayo
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    className="lucide lucide-file-text w-3 h-3 text-blue-600"
                    aria-hidden="true"
                  >
                    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                    <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <span className="text-xs">Contenido</span>
                </div>
                <div className="text-sm ml-5">€350.000</div>
                <div className="text-xs text-gray-500 ml-5">
                  Mobiliario y equipamiento
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    className="lucide lucide-droplets w-3 h-3 text-cyan-600"
                    aria-hidden="true"
                  >
                    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
                  </svg>
                  <span className="text-xs">Daños por agua</span>
                </div>
                <div className="text-sm ml-5">Incluido en continente</div>
                <div className="text-xs text-gray-500 ml-5">
                  Roturas, filtraciones
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    className="lucide lucide-euro w-3 h-3 text-green-600"
                    aria-hidden="true"
                  >
                    <path d="M4 10h12"></path>
                    <path d="M4 14h9"></path>
                    <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"></path>
                  </svg>
                  <span className="text-xs">Pérdida de rentas</span>
                </div>
                <div className="text-sm ml-5">€180.000</div>
                <div className="text-xs text-gray-500 ml-5">Hasta 12 meses</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    className="lucide lucide-zap w-3 h-3 text-yellow-600"
                    aria-hidden="true"
                  >
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                  </svg>
                  <span className="text-xs">Daños eléctricos</span>
                </div>
                <div className="text-sm ml-5">€50,000</div>
                <div className="text-xs text-gray-500 ml-5">
                  Sobretensión, cortocircuito
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    className="lucide lucide-wind w-3 h-3 text-gray-600"
                    aria-hidden="true"
                  >
                    <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
                    <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
                    <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
                  </svg>
                  <span className="text-xs">Fenómenos atmosféricos</span>
                </div>
                <div className="text-sm ml-5">Incluido en continente</div>
                <div className="text-xs text-gray-500 ml-5">
                  Viento, granizo, nieve
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    className="lucide lucide-shield w-3 h-3 text-purple-600"
                    aria-hidden="true"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  </svg>
                  <span className="text-xs">Robo y vandalismo</span>
                </div>
                <div className="text-sm ml-5">€100,000</div>
                <div className="text-xs text-gray-500 ml-5">
                  Con franquicia €150
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                    className="lucide lucide-users w-3 h-3 text-indigo-600"
                    aria-hidden="true"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-xs">Resp. Civil incluida</span>
                </div>
                <div className="text-sm ml-5">€2.000.000</div>
                <div className="text-xs text-gray-500 ml-5">RC arrendador</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <h5 className="text-xs mb-2 flex items-center gap-2 text-red-600">
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
                className="lucide lucide-circle-x w-4 h-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
              </svg>
              Franquicias Aplicables
            </h5>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-red-50 rounded p-2 border border-red-200">
                <span className="text-gray-600">General:</span>{" "}
                <span className="text-red-700">€600</span>
              </div>
              <div className="bg-red-50 rounded p-2 border border-red-200">
                <span className="text-gray-600">Daños agua:</span>{" "}
                <span className="text-red-700">€300</span>
              </div>
              <div className="bg-red-50 rounded p-2 border border-red-200">
                <span className="text-gray-600">Robo:</span>{" "}
                <span className="text-red-700">€150</span>
              </div>
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
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
                  className="lucide lucide-shield w-5 h-5 text-green-600"
                  aria-hidden="true"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-sm">
                  Seguro de Responsabilidad Civil Adicional
                </h4>
                <p className="text-xs text-gray-500">Póliza: RC-2025-123789</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Prima anual</div>
              <div className="text-sm">€3800</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Aseguradora</div>
              <div className="text-sm">AXA Seguros</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Vigencia</div>
              <div className="text-sm">15/03/2025 - 14/03/2025</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Pago</div>
              <div className="text-sm">Trimestral</div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <h5 className="text-xs mb-3 flex items-center gap-2">
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
                className="lucide lucide-circle-check w-4 h-4 text-green-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Coberturas RC
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">RC General</span>
                <span className="text-sm">€3.000.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Daños materiales</span>
                <span className="text-sm">€500.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  Lesiones personales
                </span>
                <span className="text-sm">€2.500.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Defensa jurídica</span>
                <span className="text-sm">€50.000</span>
              </div>
            </div>
            <div className="mt-3 bg-green-50 rounded-lg p-2 border border-green-200">
              <p className="text-xs text-green-900">
                ✓ Sin franquicia • Cobertura mundial • Incluye litigios
              </p>
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
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
                  className="lucide lucide-euro w-5 h-5 text-orange-600"
                  aria-hidden="true"
                >
                  <path d="M4 10h12"></path>
                  <path d="M4 14h9"></path>
                  <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-sm">Seguro de Impago de Rentas</h4>
                <p className="text-xs text-gray-500">Póliza: IR-2025-456123</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Prima anual</div>
              <div className="text-sm">€4500</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Aseguradora</div>
              <div className="text-sm">Solunion</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Vigencia</div>
              <div className="text-sm">01/06/2025 - 31/05/2025</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600 mb-1">Pago</div>
              <div className="text-sm">Mensual</div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <h5 className="text-xs mb-3 flex items-center gap-2">
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
                className="lucide lucide-circle-check w-4 h-4 text-orange-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Coberturas Impago
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  Rentas impagadas cubiertas
                </span>
                <span className="text-sm">12 meses</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  Gastos jurídicos (desahucio)
                </span>
                <span className="text-sm">€6000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  Daños en la propiedad
                </span>
                <span className="text-sm">€3000</span>
              </div>
            </div>
          </div>
        </div>
        <div
          data-slot="card"
          className="text-card-foreground flex flex-col gap-6 rounded-xl border p-3 bg-yellow-50 border-yellow-200"
        >
          <div className="flex items-start gap-2">
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
              className="lucide lucide-triangle-alert w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <div>
              <h4 className="text-xs text-yellow-900 mb-2">
                Recordatorios de Seguros
              </h4>
              <div className="space-y-1 text-xs text-yellow-700">
                <div>• Renovación Multirriesgo en 365 días (31/12/2025)</div>
                <div>• Próximo pago trimestral RC: 15/03/2025 - €950</div>
                <div>
                  • Actualizar tasación edificio antes de renovación anual
                </div>
                <div>• Revisar inventario de contenidos asegurados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
