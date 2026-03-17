import {
  ChartColumn,
  CircleCheck,
  Clock,
  Download,
  LucideCircleQuestionMark,
  Search,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MetricTooltip from "./componentes/MetricTooltip";
import { FinancialGreenService } from "~/services/GreenFinancialServices";
import {
  BuildingsApiService,
  getBuildingTypologyLabel,
} from "~/services/buildingsApi";
import type { Building } from "~/services/buildingsApi";
import { exportToPdf } from "./componentes/exportarData";
import EnergyPotentialModal from "./componentes/EnergyPotentialModal";
import IRRExplanationModal from "./componentes/IRRExplanationModal";
import CoCExplanationModal from "./componentes/CoCExplanationModal";
import { formatMoneyShort, getEnergyRatingColorClass } from "~/lib/utils";
import {
  SkeletonCardsHeader,
  SkeletonOpportunityTableBody,
} from "~/components/ui/LoadingSystem";
import type { BuildingImage } from "~/services/buildingsApi";
import useHeaderContext from "~/contexts/HeaderContext";

interface SectionHelpersRadar {
  TotalActivos: boolean;
  CAPEXTotal: boolean;
  ValorCreado: boolean;
  TIRPromedio: boolean;
}

export interface FinancialSnapshotSummary {
  total_activos: number; // El número total de FinancialSnapshots
  capex_total: number; // Suma de todos los campos 'capex.total'
  valor_creado: number; // Suma de todos los campos 'green_premium.valor'
  tir_promedio: number | null; // El promedio de todos los campos 'tir.valor', o null si no hay datos
  bankReady: number | null; // El total de activos en estado 'Bank-Ready'
}

export interface RegistroTable {
  id?: string;
  activo: string;
  direccion: string;
  tipo: string;
  building_id: string;
  estado_actual: string;

  potencial: Potencial;

  tir: TIR;

  cash_on_cash: CashOnCash;

  capex: CAPEX;

  subvencion: Subvencion;

  green_premium: GreenPremium;

  plazo: string;
  images: BuildingImage[];

  taxonomia: Taxonomia;

  estado: Estado;
}

export interface Potencial {
  letra: string;
  variacion: string;
  is_simulated?: boolean;
}

export interface TIR {
  valor: number;
  plazo: string;
}

export interface CashOnCash {
  valor: string;
  multiplicador: string;
}

export interface CAPEX {
  total: number;
  descripcion: string;
  estimated?: number;
}

export interface Subvencion {
  valor: number;
  porcentaje: number;
}

export interface GreenPremium {
  valor: number;
  roi: number;
}

export interface Taxonomia {
  porcentaje: number;
}

export interface Estado {
  etiqueta: string;
  score: number;
  pendientes?: string;
}

/** Convierte un edificio sin financial snapshot en un RegistroTable con valores por defecto */
function buildingToRegistroTable(building: Building): RegistroTable {
  return {
    activo: building.name,
    direccion: building.address || "-",
    tipo: getBuildingTypologyLabel(building.typology),
    building_id: building.id,
    estado_actual: "-",
    potencial: { letra: "-", variacion: "0" },
    tir: { valor: 0, plazo: "-" },
    cash_on_cash: { valor: "-", multiplicador: "-" },
    capex: { total: 0, descripcion: "Sin datos" },
    subvencion: { valor: 0, porcentaje: 0 },
    green_premium: { valor: 0, roi: 0 },
    plazo: "-",
    images: building.images ?? [],
    taxonomia: { porcentaje: 0 },
    estado: { etiqueta: "Pendiente", score: 0, pendientes: "Crear snapshot" },
  };
}

function BuildingOpportunityRow({ data }: { data: RegistroTable[] }) {
  if (!data || data.length === 0) {
    return null;
  }
  const navigate = useNavigate();
  const { selectedBuildingId } = useHeaderContext();

  return (
    <>
      {data &&
        data.length > 0 &&
        data.map((value, idx) => (
          <tr
            key={idx}
            className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors ${selectedBuildingId === value.building_id ? "bg-blue-100" : ""}`}
            onClick={() => {
              navigate(
                `/green-financial/building/${value.building_id}/financial-twin`,
              );
            }}
          >
            <td className="px-3 py-3 w-[180px] max-w-[180px]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={
                      value?.images?.find((v) => v?.isMain)?.url ||
                      value?.images[0]?.url ||
                      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"
                    }
                    alt={value?.activo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-gray-900 truncate">
                    {value?.activo || "-"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {value?.direccion || "-"}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`${value.estado_actual && value.estado_actual !== "-" ? getEnergyRatingColorClass(value.estado_actual) : "bg-gray-200 text-gray-600"} px-2 py-1 rounded text-xs w-8 text-center`}
                >
                  {value.estado_actual || "-"}
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`${value.potencial?.letra && value.potencial.letra !== "-" ? getEnergyRatingColorClass(value.potencial.letra) + " text-white" : "bg-gray-200 text-gray-600"} px-2 py-1 rounded text-xs w-8 text-center`}
                >
                  {value.potencial?.letra || "-"}
                </div>
                <div className="text-xs text-gray-600">
                  {value.potencial?.letra &&
                  value.potencial.letra !== "-" &&
                  value.potencial?.variacion != null &&
                  value.potencial.variacion !== "0"
                    ? `${value.potencial.variacion}% ${value.potencial.is_simulated ? "est." : ""}`
                    : "-"}
                </div>
                {value.estado_actual !== "-" &&
                  value.potencial?.letra !== "-" &&
                  value.estado_actual === value.potencial?.letra &&
                  Number(value.potencial?.variacion) >= 15 && (
                    <div
                      className="text-[10px] text-green-700 font-medium bg-green-100 px-1.5 py-0.5 rounded-sm mt-0.5"
                      title="Ahorro energético significativo pero que no alcanza el umbral de la siguiente letra."
                    >
                      Mantiene clasificación
                    </div>
                  )}
              </div>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="text-sm text-[#1e3a8a]">
                {value.tir?.valor ?? 0}%
              </div>
              <div className="text-xs text-gray-500">
                {value.tir?.plazo && value.tir.plazo !== "-"
                  ? value.tir.plazo
                  : "-"}
              </div>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="text-sm text-emerald-700">
                {value.cash_on_cash?.valor != null &&
                value.cash_on_cash.valor !== "-" &&
                value.cash_on_cash.valor !== "0"
                  ? `${value.cash_on_cash.valor}%`
                  : "0%"}
              </div>
              <div className="text-xs text-gray-500">
                {value.cash_on_cash?.multiplicador &&
                value.cash_on_cash.multiplicador !== "-"
                  ? `${value.cash_on_cash.multiplicador}x`
                  : "-"}
              </div>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="text-sm text-gray-900">
                {value.capex?.total != null && value.capex.total !== 0
                  ? `${formatMoneyShort(value.capex.total)}€`
                  : "-"}
              </div>
              <div className="text-xs text-gray-500">
                {value.capex?.descripcion &&
                value.capex.descripcion !== "Sin datos"
                  ? value.capex.descripcion
                  : "-"}
              </div>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="text-sm text-green-600">
                {value.subvencion?.valor != null && value.subvencion.valor !== 0
                  ? `${formatMoneyShort(value.subvencion.valor)}€`
                  : "-"}
              </div>
              <div className="text-xs text-gray-500">
                {value.subvencion?.porcentaje != null &&
                value.subvencion.porcentaje !== 0
                  ? `${value.subvencion.porcentaje}% CAPEX`
                  : "-"}
              </div>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="text-sm text-green-700">
                {value.green_premium?.valor != null &&
                value.green_premium.valor !== 0
                  ? `${formatMoneyShort(value.green_premium.valor)}€`
                  : "-"}
              </div>
              <div className="text-xs text-gray-500">
                {value.green_premium?.roi != null &&
                value.green_premium.roi !== 0
                  ? `${value.green_premium.roi}% ROI`
                  : "-"}
              </div>
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {value.plazo && value.plazo !== "-" ? value.plazo : "-"}
                </span>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-col items-center gap-1">
                <div className="text-sm text-gray-900">
                  {value.taxonomia?.porcentaje != null &&
                  value.taxonomia.porcentaje !== 0
                    ? `${value.taxonomia.porcentaje}%`
                    : "-"}
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-green-600"
                    style={{ width: `${value.taxonomia?.porcentaje ?? 0}%` }}
                  />
                </div>
              </div>
            </td>
            <td className="px-4 py-3 min-w-[110px]">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
                    value?.estado?.etiqueta === "Bank-Ready"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {value?.estado?.etiqueta === "Bank-Ready" ? (
                    <CircleCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  ) : (
                    <TriangleAlert className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                  <span>{value?.estado?.etiqueta || "-"}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {value?.estado?.etiqueta === "Bank-Ready"
                    ? value?.estado?.score != null
                      ? `${value.estado.score}%`
                      : "-"
                    : value?.estado?.pendientes || "-"}
                </div>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
}

interface StatusIParams {
  helpStatus: SectionHelpersRadar;
  setHelpStatus: React.Dispatch<React.SetStateAction<SectionHelpersRadar>>;
  summary: FinancialSnapshotSummary;
}

const CardsHeader = ({ helpStatus, setHelpStatus, summary }: StatusIParams) => {
  const handleToggle = (
    e: React.MouseEvent<HTMLButtonElement>, // Tipamos el evento de clic
    key: keyof SectionHelpersRadar,
  ) => {
    e.stopPropagation(); // <--- LA CLAVE ES ESTA LÍNEA
    setHelpStatus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
        <button
          onClick={(e) => handleToggle(e, "TotalActivos")}
          className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border-blue-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10"
        >
          <LucideCircleQuestionMark className="w-3 h-3 text-blue-600" />
        </button>

        {helpStatus?.TotalActivos && (
          <MetricTooltip
            borderColor="blue"
            size={50}
            text={`Edificios en cartera. ${summary?.bankReady} están Bank-Ready con documentación completa.`}
          />
        )}
        <p className="text-sm text-gray-600 mb-1">Total Activos</p>
        <p className="text-2xl text-[#1e3a8a] mb-1">{summary?.total_activos}</p>
        <p className="text-xs text-gray-500">{summary?.bankReady} Bank-Ready</p>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
        <button
          onClick={(e) => handleToggle(e, "CAPEXTotal")}
          className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border-orange-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10"
        >
          <LucideCircleQuestionMark className="w-3 h-3 text-orange-600" />
        </button>
        {helpStatus?.CAPEXTotal && (
          <MetricTooltip
            size={50}
            borderColor="orange"
            text="Inversión total para todas las rehabilitaciones energéticas de la cartera."
          />
        )}
        <p className="text-sm text-gray-600 mb-1">CAPEX Total</p>
        <p className="text-2xl text-orange-600 mb-1">
          {formatMoneyShort(summary?.capex_total)}€
        </p>
        <p className="text-xs text-gray-500">Inversión necesaria</p>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
        <button
          onClick={(e) => handleToggle(e, "ValorCreado")}
          className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10"
        >
          <LucideCircleQuestionMark className="w-3 h-3 text-green-600" />
          {helpStatus?.ValorCreado && (
            <MetricTooltip
              borderColor="green"
              text="Green Premium total. Valor creado por mejoras ESG en toda la cartera."
            />
          )}
        </button>
        <p className="text-sm text-gray-600 mb-1">Valor Creado</p>
        <p className="text-2xl text-green-600 mb-1">
          {formatMoneyShort(summary?.valor_creado)}€
        </p>
        <p className="text-xs text-gray-500">Green Premium total</p>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
        <button
          onClick={(e) => handleToggle(e, "TIRPromedio")}
          className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-purple-100 border-purple-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10"
        >
          <LucideCircleQuestionMark className="w-3 h-3 text-purple-600" />
        </button>
        {helpStatus?.TIRPromedio && (
          <MetricTooltip
            size={50}
            borderColor="purple"
            text="TIR promedio ponderada de la cartera a 5 años. Métrica institucional clave."
          />
        )}
        <p className="text-sm text-gray-600 mb-1">TIR Promedio</p>
        <p className="text-2xl text-purple-600 mb-1">
          {summary?.tir_promedio}%
        </p>
        <p className="text-xs text-gray-500">Retorno anualizado</p>
      </div>
    </>
  );
};

export function OpportunityRadar() {
  const [helpStatus, setHelpStatus] = useState<SectionHelpersRadar>({
    CAPEXTotal: false,
    TIRPromedio: false,
    TotalActivos: false,
    ValorCreado: false,
  });

  const [isPotentialModalOpen, setIsPotentialModalOpen] = useState(false);
  const [isIRRModalOpen, setIsIRRModalOpen] = useState(false);
  const [isCoCModalOpen, setIsCoCModalOpen] = useState(false);

  const [dataOriginal, setDataOriginal] = useState<RegistroTable[]>([]);
  const [summary, setSummary] = useState<FinancialSnapshotSummary>({
    bankReady: 0,
    capex_total: 0,
    tir_promedio: 0,
    total_activos: 0,
    valor_creado: 0,
  });

  const handleExport = () => {
    exportToPdf(dataFiltrada, summary, "Radar_Oportunidades_Filtro.pdf");
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "bank" | "pendientes">(
    "todos",
  );
  const [dataFiltrada, setDataFiltrada] = useState<RegistroTable[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [buildings, snapshots, summaryFromApi] = await Promise.all([
          BuildingsApiService.getAllBuildings(),
          FinancialGreenService.getAll(),
          FinancialGreenService.getsumary(),
        ]);

        const snapshotByBuildingId = new Map<string, RegistroTable>();
        for (const s of snapshots ?? []) {
          const bid = s.building_id;
          if (bid) snapshotByBuildingId.set(bid, s);
        }

        const merged: RegistroTable[] = buildings.map((b) => {
          const snapshot = snapshotByBuildingId.get(b.id);
          // Si el backend ya nos da el snapshot (real o virtual), lo usamos directamente
          if (snapshot) {
            return {
              ...snapshot,
              estado_actual: snapshot.estado_actual || "-", // El backend ya calcula esto
            };
          }
          // Fallback de seguridad (no debería ocurrir con el nuevo backend)
          return buildingToRegistroTable(b);
        });

        setDataOriginal(merged);
        setDataFiltrada(merged);
        setSummary({ ...summaryFromApi, total_activos: merged.length });
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const coincideBusqueda = (registro: RegistroTable, termino: string) => {
    const texto = JSON.stringify(registro).toLowerCase();
    return texto.includes(termino.toLowerCase());
  };

  const aplicarProcesamiento = useCallback(() => {
    let datos = [...dataOriginal];

    if (filter === "bank") {
      datos = datos?.filter((r) => r?.estado?.etiqueta === "Bank-Ready");
    }
    if (filter === "pendientes") {
      datos = datos?.filter((r) => r?.estado?.etiqueta !== "Bank-Ready");
    }

    if (search.trim() !== "") {
      datos = datos.filter((r) => coincideBusqueda(r, search));
    }

    setDataFiltrada(datos);
  }, [dataOriginal, filter, search]);

  useEffect(() => {
    aplicarProcesamiento();
  }, [aplicarProcesamiento]);

  const aplicarFiltroEstado = (tipo: "todos" | "bank" | "pendientes") => {
    setFilter(tipo);
    if (tipo === "todos") {
      setDataFiltrada(dataOriginal);
      return;
    }

    if (tipo === "bank") {
      setDataFiltrada(
        dataOriginal?.filter((r) => r?.estado?.etiqueta === "Bank-Ready"),
      );
      return;
    }

    if (tipo === "pendientes") {
      setDataFiltrada(
        dataOriginal?.filter((r) => r?.estado?.etiqueta !== "Bank-Ready"),
      );
      return;
    }
  };

  const ordenar = (tipo: string) => {
    const copia = [...dataFiltrada];

    switch (tipo) {
      case "irr":
        copia.sort((a, b) => b.tir.valor - a.tir.valor);
        break;

      case "capex":
        copia.sort((a, b) => a.capex.total - b.capex.total);
        break;

      case "bankability":
        copia.sort((a, b) => b.green_premium.valor - a.green_premium.valor);
        break;

      case "name":
        copia.sort((a, b) => a.activo.localeCompare(b.activo));
        break;
    }

    setDataFiltrada(copia);
  };

  const closeAllHelpers = () => {
    setHelpStatus({
      CAPEXTotal: false,
      TIRPromedio: false,
      TotalActivos: false,
      ValorCreado: false,
    });
  };

  const pendientes = summary?.total_activos - (summary?.bankReady || 0);

  return (
    <div
      onClick={closeAllHelpers}
      onKeyDown={(e) => e.key === "Escape" && closeAllHelpers()}
      role="presentation"
      className="max-w-[1800px] mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white p-3 rounded-xl shadow-lg">
            <ChartColumn className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl text-gray-900">Radar de Oportunidades</h1>
            <p className="text-sm text-gray-600">
              Análisis de cartera para financiación verde institucional
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Exportar Cartera
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {loading ? (
          <SkeletonCardsHeader />
        ) : (
          <CardsHeader
            helpStatus={helpStatus}
            setHelpStatus={setHelpStatus}
            summary={summary}
          />
        )}
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Buscar edificio..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => aplicarFiltroEstado("todos")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === "todos"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({dataOriginal?.length})
            </button>
            <button
              onClick={() => aplicarFiltroEstado("bank")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === "bank"
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Bank-Ready ({summary?.bankReady})
            </button>
            <button
              onClick={() => aplicarFiltroEstado("pendientes")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === "pendientes"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pendientes ({pendientes})
            </button>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            onChange={(e) => ordenar(e.target.value)}
          >
            <option value="irr">Mayor TIR</option>
            <option value="capex">Menor CAPEX</option>
            <option value="bankability">Mayor Bankability</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-xs text-gray-700 w-[180px]">
                  Activo
                </th>
                <th className="px-4 py-3 text-center text-xs text-gray-700">
                  Actual
                </th>
                <th className="px-4 py-3 text-center text-xs text-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <span>Potencial</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPotentialModalOpen(true);
                      }}
                      className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                      title="Haz clic para ver la metodología del cálculo"
                    >
                      <LucideCircleQuestionMark className="w-3 h-3 text-blue-600" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs text-gray-700">
                  <div className="flex items-center justify-end gap-1">
                    <span>TIR</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsIRRModalOpen(true);
                      }}
                      className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                      title="Haz clic para ver la metodología del cálculo"
                    >
                      <LucideCircleQuestionMark className="w-3 h-3 text-blue-600" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs text-gray-700">
                  <div className="flex items-center justify-end gap-1">
                    <span>Cash on Cash</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCoCModalOpen(true);
                      }}
                      className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                      title="Haz clic para ver la metodología del cálculo"
                    >
                      <LucideCircleQuestionMark className="w-3 h-3 text-emerald-600" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs text-gray-700">
                  CAPEX
                </th>
                <th className="px-4 py-3 text-right text-xs text-gray-700">
                  Subvención
                </th>
                <th className="px-4 py-3 text-right text-xs text-gray-700">
                  Green Premium
                </th>
                <th className="px-4 py-3 text-center text-xs text-gray-700">
                  Plazo
                </th>
                <th className="px-4 py-3 text-center text-xs text-gray-700">
                  Taxonomía
                </th>
                <th className="px-4 py-3 text-center text-xs text-gray-700 min-w-[110px]">
                  Estado
                </th>
              </tr>
            </thead>
            {loading ? (
              <SkeletonOpportunityTableBody rows={5} />
            ) : (
              <tbody>
                <BuildingOpportunityRow data={dataFiltrada} />
              </tbody>
            )}
          </table>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4">
        <h3 className="text-sm text-gray-700 mb-3">Leyenda</h3>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-gray-600">TIR:</span>
            <span className="text-gray-900 ml-1">
              Tasa Interna de Retorno proyectada a 5 años
            </span>
          </div>
          <div>
            <span className="text-gray-600">Cash on Cash:</span>
            <span className="text-gray-900 ml-1">
              Rentabilidad anual del equity después de deuda
            </span>
          </div>
          <div>
            <span className="text-gray-600">Green Premium:</span>
            <span className="text-gray-900 ml-1">
              Valor creado por mejoras ESG
            </span>
          </div>
        </div>
      </div>

      <EnergyPotentialModal
        active={isPotentialModalOpen}
        onClose={() => setIsPotentialModalOpen(false)}
      />

      <IRRExplanationModal
        active={isIRRModalOpen}
        onClose={() => setIsIRRModalOpen(false)}
      />

      <CoCExplanationModal
        active={isCoCModalOpen}
        onClose={() => setIsCoCModalOpen(false)}
      />
    </div>
  );
}
