import { useEffect, useState } from "react";
import { FinancialAnalysisService } from "~/services/financialAnalysisService";
import {
  FinancialSnapshotsService,
  type FinancialSnapshot,
} from "~/services/financialSnapshots";
import type { FinancialAnalysis } from "~/types/financialAnalysis";
import { BuildingFinancialLoading } from "./ui/dashboardLoading";
import { useParams } from "react-router-dom";
import { BuildingsApiService } from "~/services/buildingsApi";
import type { Building } from "~/types/buildings";
import { FolderX } from "lucide-react";

export function BuildingFinancial() {
  const { id: buildingId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [snapshot, setSnapshot] = useState<FinancialSnapshot | null>(null);
  const [building, setBuilding] = useState<Building | undefined>(); // Inicializado como undefined

  /**
   * Componente placeholder que muestra un skeleton durante la carga
   * o un mensaje claro si no hay datos financieros disponibles.
   */
  function BuildingFinancialPlaceholder() {
    return (
      <div className="flex-1 overflow-y-auto mt-2 pr-1">
        <div
          data-slot="card"
          className="rounded-xl border border-gray-200 p-8 bg-white flex flex-col items-center justify-center text-center space-y-3 shadow-sm"
        >
          <FolderX className="text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">
            No hay información financiera disponible
          </h3>
          <p className="text-sm text-gray-500">
            Asegúrate de que el edificio tenga al menos un *Financial Snapshot*
            asociado y que todos los datos de valoración (`price` o
            `valuePerM2`) estén completos.
          </p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => window.location.reload()} // Acción de ejemplo
          >
            Reintentar la carga
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const loadData = async () => {
      if (!buildingId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const buildingData = await BuildingsApiService.getBuildingById(
          buildingId
        );
        setBuilding(buildingData);

        if (!buildingData) {
          setAnalysis(null);
          setSnapshot(null);
          return;
        }

        const buildingPrice = buildingData.price ?? 0;

        // 1. Obtener snapshot financiero (datos crudos)
        const snapshots = await FinancialSnapshotsService.getFinancialSnapshots(
          buildingId
        );

        const currentSnapshot = snapshots[0] || null; // Tomamos el más reciente
        setSnapshot(currentSnapshot);

        // 2. Ejecutar análisis solo si hay snapshot y precio válido
        if (currentSnapshot && buildingPrice > 0) {
          const result = await FinancialAnalysisService.analyzeBuilding(
            buildingId,
            buildingData.name,
            currentSnapshot,
            buildingPrice
          );
          setAnalysis(result);
        } else {
          setAnalysis(null); // No se puede analizar si faltan datos clave
        }
      } catch (error) {
        console.error("Error loading financial data:", error);
        setAnalysis(null);
        setSnapshot(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [buildingId]);

  if (loading) return <BuildingFinancialLoading />;

  if (!building || !analysis || !snapshot)
    return <BuildingFinancialPlaceholder />;

  const buildingPrice = building.price ?? 0;
  const { metrics } = analysis;

  // Cálculos derivados para la UI
  const totalDebt = snapshot.principal_pendiente_eur || 0;
  const ltv = buildingPrice > 0 ? (totalDebt / buildingPrice) * 100 : 0;
  const monthlyExpenses = (snapshot.opex_total_anual_eur || 0) / 12;
  const commonExpenses = (snapshot.opex_otros_anual_eur || 0) / 12; // Aproximación para gastos comunes

  const formatCurrency = (val: number | null | undefined) =>
    val
      ? `€${val.toLocaleString("es-ES", { maximumFractionDigits: 0 })}`
      : "€0";

  return (
    <div className="flex-1 overflow-y-auto mt-2 pr-1">
      <div className="space-y-3">
        {/* KPI Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Valor Activo */}
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-50">
                <svg
                  className="lucide lucide-building w-4 h-4 text-blue-600"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M12 6h.01" />
                  <path d="M16 10h.01" />
                  <path d="M16 14h.01" />
                  <path d="M16 6h.01" />
                  <path d="M8 10h.01" />
                  <path d="M8 14h.01" />
                  <path d="M8 6h.01" />
                  <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                </svg>
              </div>
              <h4 className="text-xs">Valor del Activo</h4>
            </div>
            <div className="text-lg">{formatCurrency(metrics.marketValue)}</div>
            <div className="text-xs text-gray-500 mt-1">
              Tasación actualizada
            </div>
          </div>

          {/* Deuda Total */}
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-red-50">
                <svg
                  className="lucide lucide-trending-down w-4 h-4 text-red-600"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 17h6v-6" />
                  <path d="m22 17-8.5-8.5-5 5L2 7" />
                </svg>
              </div>
              <h4 className="text-xs">Deuda Total</h4>
            </div>
            <div className="text-lg text-red-600">
              {formatCurrency(totalDebt)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Hipoteca + Operativa
            </div>
          </div>

          {/* Apalancamiento (LTV) */}
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-50">
                <svg
                  className="lucide lucide-trending-up w-4 h-4 text-purple-600"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 7h6v6" />
                  <path d="m22 7-8.5 8.5-5-5L2 17" />
                </svg>
              </div>
              <h4 className="text-xs">Apalancamiento (LTV)</h4>
            </div>
            <div className="text-lg">{ltv.toFixed(2)}%</div>
            <div
              className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                ltv < 70
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {ltv < 70 ? "Saludable" : "Atención"}
            </div>
          </div>
        </div>

        {/* Deuda Hipotecaria Detalle */}
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-50">
                <svg
                  className="lucide lucide-file-text w-4 h-4 text-orange-600"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                  <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>
              </div>
              <h4 className="text-xs">Deuda Hipotecaria</h4>
            </div>
            {/* Dato no disponible en snapshot actual, se deja genérico */}
            <span className="text-xs text-gray-500">Préstamo Principal</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Principal Pendiente
              </div>
              <div className="text-sm">
                {formatCurrency(snapshot.principal_pendiente_eur)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Interés</div>
              <div className="text-sm">-- %</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Servicio Anual</div>
              <div className="text-sm">
                {formatCurrency(snapshot.servicio_deuda_anual_eur)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">DSCR</div>
              <div className="text-sm">
                {metrics.dscr ? metrics.dscr.toFixed(2) + "x" : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Gastos Mensuales */}
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-orange-50">
              <svg
                className="lucide lucide-euro w-4 h-4 text-orange-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10h12" />
                <path d="M4 14h9" />
                <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
              </svg>
            </div>
            <h4 className="text-xs">Gastos Estimados (Mensual)</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Servicio Deuda</span>
              <span className="text-xs">
                {formatCurrency((snapshot.servicio_deuda_anual_eur || 0) / 12)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Mantenimiento</span>
              <span className="text-xs">
                {formatCurrency(
                  (snapshot.opex_mantenimiento_anual_eur || 0) / 12
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Energía</span>
              <span className="text-xs">
                {formatCurrency((snapshot.opex_energia_anual_eur || 0) / 12)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Seguros</span>
              <span className="text-xs">
                {formatCurrency((snapshot.opex_seguros_anual_eur || 0) / 12)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-xs">Total Gastos Mensuales</span>
              <span className="text-sm text-orange-600">
                {formatCurrency(monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Total OPEX Anual</span>
              <span>{formatCurrency(snapshot.opex_total_anual_eur)}</span>
            </div>
          </div>
        </div>

        {/* Gastos Comunes / Unidades */}
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-green-50">
              <svg
                className="lucide lucide-users w-4 h-4 text-green-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <h4 className="text-xs">Gastos Comunes</h4>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Ocupación estimada</span>
              <span className="text-xs">
                {metrics.occupancyRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">
                Otros OPEX (Comunes)
              </span>
              <span className="text-xs">{formatCurrency(commonExpenses)}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-xs">Total Gastos Comunes Estimados</span>
              <span className="text-sm text-green-600">
                {formatCurrency(commonExpenses)}/mes
              </span>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {metrics.valueGap > 10 && (
          <div className="text-card-foreground flex flex-col gap-6 rounded-xl border p-3 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-2">
              <svg
                className="lucide lucide-triangle-alert w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              <div>
                <h4 className="text-xs text-yellow-900 mb-1">
                  Oportunidad de Mejora
                </h4>
                <div className="text-xs text-yellow-700">
                  Gap de valor detectado: {metrics.valueGap.toFixed(1)}%. <br />
                  Se recomienda revisar el plan de CAPEX.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
