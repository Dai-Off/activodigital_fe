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
import MetricTooltip from "./componentes/MetricTooltip";
import { FinancialGreenService } from "~/services/GreenFinancialServices";
import { exportToPdf } from "./componentes/exportarData";

interface SectionHelpersRadar {
  TotalActivos: boolean,
  CAPEXTotal: boolean,
  ValorCreado: boolean,
  TIRPromedio: boolean,
}

export interface RegistroTable {
  id?: string,
  activo: string;
  direccion: string;
  tipo: string;

  estado_actual: string;

  potencial: Potencial;

  tir: TIR;

  cash_on_cash: CashOnCash;

  capex: CAPEX;

  subvencion: Subvencion;

  green_premium: GreenPremium;

  plazo: string;

  taxonomia: Taxonomia;

  estado: Estado;
}

export interface Potencial {
  letra: string;
  variacion: string;
}

export interface TIR {
  valor: string;
  plazo: string;
}

export interface CashOnCash {
  valor: string;
  multiplicador: string;
}

export interface CAPEX {
  total: string;
  descripcion: string;
}

export interface Subvencion {
  valor: string;
  porcentaje: string;
}

export interface GreenPremium {
  valor: string;
  roi: string;
}

export interface Taxonomia {
  porcentaje: string;
}

export interface Estado {
  etiqueta: string;
  score: string;
  pendientes?: string;
}

function BuildingOpportunityRow({ data }: { data: RegistroTable[] }) {
  return (
    <>
      {data.map((value, idx) => (
        <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"
                  alt="Plaza Shopping"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm text-gray-900">{value?.activo}</div>
                <div className="text-xs text-gray-500">
                  {value.direccion}
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="text-xs text-gray-700">{value.tipo}</span>
          </td>
          <td className="px-4 py-3">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs w-8 text-center">
                {value.estado_actual}
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-green-600 text-white px-2 py-1 rounded text-xs w-8 text-center">
                {value.potencial.letra}
              </div>
              <div className="text-xs text-green-600">{value.potencial.variacion}</div>
            </div>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="text-sm text-[#1e3a8a]">{value.tir.valor}</div>
            <div className="text-xs text-gray-500">{value.tir.plazo}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="text-sm text-emerald-700">{value.cash_on_cash.valor}</div>
            <div className="text-xs text-gray-500">{value.cash_on_cash.multiplicador} mult.</div>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="text-sm text-gray-900">{value.capex.total}€</div>
            <div className="text-xs text-gray-500">{value.capex.descripcion}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="text-sm text-green-600">{value.subvencion.valor}€</div>
            <div className="text-xs text-gray-500">{value.subvencion.porcentaje}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="text-sm text-green-700">{value.green_premium.valor}€</div>
            <div className="text-xs text-gray-500">{value.green_premium.roi}</div>
          </td>
          <td className="px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-700">{value.plazo}</span>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="flex flex-col items-center gap-1">
              <div className="text-sm text-gray-900">{value.taxonomia.porcentaje}</div>
              <div className="w-16 bg-gray-200 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-green-600"
                  style={{ width: value.taxonomia.porcentaje }}
                ></div>
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="flex flex-col items-center gap-1">
              <div className={`flex items-center gap-1 px-2 py-1  ${value?.estado?.etiqueta === "Bank-Ready" ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} rounded text-xs`}>
                {value?.estado.etiqueta === "Bank-Ready" ? (<CircleCheck className="w-3 h-3" />) : (<TriangleAlert className="w-3 h-3" />)}
                {value.estado.etiqueta}
              </div>
              <div className="text-xs text-gray-500">{value?.estado?.etiqueta === "Bank-Ready" ? value?.estado?.score : value?.estado?.pendientes}</div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

interface StatusIParams {
  helpStatus: SectionHelpersRadar,
  setHelpStatus: React.Dispatch<React.SetStateAction<SectionHelpersRadar>>,
  carterBuild: number
}

const CardsHeader = ({ helpStatus, setHelpStatus, carterBuild }: StatusIParams) => {
  const handleToggle = (
    e: React.MouseEvent<HTMLButtonElement>, // Tipamos el evento de clic
    key: keyof SectionHelpersRadar
  ) => {
    e.stopPropagation(); // <--- LA CLAVE ES ESTA LÍNEA
    setHelpStatus((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container" >
        <button onClick={(e) => handleToggle(e, 'TotalActivos')} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border-blue-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
          <LucideCircleQuestionMark className="w-3 h-3 text-blue-600" />
        </button>

        {helpStatus?.TotalActivos && (
          <MetricTooltip
            borderColor="blue"
            size={50}
            // ! TODO número va dinamico
            text={`Edificios en cartera. ${carterBuild} están Bank-Ready con documentación completa.`}
          />
        )}
        <p className="text-sm text-gray-600 mb-1">Total Activos</p>
        <p className="text-2xl text-[#1e3a8a] mb-1">13</p>
        <p className="text-xs text-gray-500">9 Bank-Ready</p>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
        <button onClick={(e) => handleToggle(e, 'CAPEXTotal')} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border-orange-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
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
        <p className="text-2xl text-orange-600 mb-1">16.1M€</p>
        <p className="text-xs text-gray-500">Inversión necesaria</p>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
        <button onClick={(e) => handleToggle(e, 'ValorCreado')} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
          <LucideCircleQuestionMark className="w-3 h-3 text-green-600" />
          {helpStatus?.ValorCreado && (
            <MetricTooltip
              borderColor="green"
              text="Green Premium total. Valor creado por mejoras ESG en toda la cartera."
            />
          )}
        </button>
        <p className="text-sm text-gray-600 mb-1">Valor Creado</p>
        <p className="text-2xl text-green-600 mb-1">29M€</p>
        <p className="text-xs text-gray-500">Green Premium total</p>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
        <button onClick={(e) => handleToggle(e, 'TIRPromedio')} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-purple-100 border-purple-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
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
        <p className="text-2xl text-purple-600 mb-1">18.5%</p>
        <p className="text-xs text-gray-500">Retorno anualizado</p>
      </div>
    </>
  )
}


export function OpportunityRadar() {

  const [helpStatus, setHelpStatus] = useState<SectionHelpersRadar>({
    CAPEXTotal: false,
    TIRPromedio: false,
    TotalActivos: false,
    ValorCreado: false
  })

  const handleExport = () => {
    exportToPdf(dataFiltrada, "Radar_Oportunidades_Filtro.pdf");
  };

  const [dataOriginal, setDataOriginal] = useState<RegistroTable[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"todos" | "bank" | "pendientes">("todos");
  const [dataFiltrada, setDataFiltrada] = useState<RegistroTable[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await FinancialGreenService.getAll();
        setDataOriginal(datos);
        setDataFiltrada(datos);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
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
      datos = datos.filter((r) => r.estado.etiqueta === "Bank-Ready");
    }
    if (filter === "pendientes") {
      datos = datos.filter((r) => r.estado.etiqueta !== "Bank-Ready");
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
    setFilter(tipo)
    if (tipo === "todos") {
      setDataFiltrada(dataOriginal);
      return;
    }

    if (tipo === "bank") {
      setDataFiltrada(dataOriginal.filter((r) => r.estado.etiqueta === "Bank-Ready"));
      return;
    }

    if (tipo === "pendientes") {
      setDataFiltrada(dataOriginal.filter((r) => r.estado.etiqueta !== "Bank-Ready"));
      return;
    }

  };

  const parsePercent = (val: string) => parseFloat(val.replace("%", ""));

  const parseMoney = (val: string) =>
    parseFloat(val.replace("+", "").replace("M", "").replace("€", "").replace("k", "")) *
    (val.includes("M") ? 1_000_000 : val.includes("k") ? 1_000 : 1);

  const ordenar = (tipo: string) => {
    const copia = [...dataFiltrada];

    switch (tipo) {
      case "irr":
        copia.sort((a, b) => parsePercent(b.tir.valor) - parsePercent(a.tir.valor));
        break;

      case "capex":
        copia.sort((a, b) => parseMoney(a.capex.total) - parseMoney(b.capex.total));
        break;

      case "bankability":
        copia.sort(
          (a, b) => parseMoney(b.green_premium.valor) - parseMoney(a.green_premium.valor)
        );
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
      ValorCreado: false
    });
  };



  return (
    <div onClick={closeAllHelpers} className="max-w-[1800px] mx-auto space-y-6">
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
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          <Download className="w-4 h-4" />
          Exportar Cartera
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <CardsHeader carterBuild={9} helpStatus={helpStatus} setHelpStatus={setHelpStatus} />
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
            <button onClick={() => aplicarFiltroEstado("todos")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === 'todos' ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Todos ({dataOriginal?.length})
            </button>
            <button onClick={() => aplicarFiltroEstado("bank")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === 'bank' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Bank-Ready ({dataOriginal.filter((d) => (d.estado.etiqueta === "Bank-Ready"))?.length})
            </button>
            <button onClick={() => aplicarFiltroEstado("pendientes")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === 'pendientes' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Pendientes ({dataOriginal.filter((d) => (d.estado.etiqueta !== "Bank-Ready"))?.length})
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
                <th className="px-4 py-3 text-left text-xs text-gray-700">
                  Activo
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-700">
                  Tipo
                </th>
                <th className="px-4 py-3 text-center text-xs text-gray-700">
                  Estado Actual
                </th>
                <th className="px-4 py-3 text-center text-xs text-gray-700">
                  Potencial
                </th>
                <th className="px-4 py-3 text-right text-xs text-gray-700">
                  TIR
                </th>
                <th className="px-4 py-3 text-right text-xs text-gray-700">
                  Cash on Cash
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
                <th className="px-4 py-3 text-center text-xs text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              <BuildingOpportunityRow data={dataFiltrada} />
            </tbody>
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
    </div>
  );
}
