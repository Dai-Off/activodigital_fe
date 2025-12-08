import {
  ChartColumn,
  CircleCheck,
  Clock,
  Download,
  LucideCircleQuestionMark,
  Search,
} from "lucide-react";

export function OpportunityRadar() {
  interface BuildingOpportunity {
    img: string;
    name: string;
    address: string;
    type: string;
    actualState: string;
    potential: string;
    tir: string;
    cashoncash: string;
    subvencion: string;
    "green-premium": string;
    plazo: string;
    taxonomía: string;
    state: string;
  }

  function BuildingOpportunity() {
    return (
      <tr className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors">
        <td className="px-4 py-3 text-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-[#1e3a8a] rounded focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer"
          />
        </td>
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
              <div className="text-sm text-gray-900">Plaza Shopping</div>
              <div className="text-xs text-gray-500">
                Carretera de Miraflores, Colmenar Viejo
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-xs text-gray-700">Comercial</span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs w-8 text-center">
              D
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs w-8 text-center">
              A
            </div>
            <div className="text-xs text-green-600">-50%</div>
          </div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="text-sm text-[#1e3a8a]">18.5%</div>
          <div className="text-xs text-gray-500">a 5 años</div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="text-sm text-emerald-700">11.5%</div>
          <div className="text-xs text-gray-500">2.4x mult.</div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="text-sm text-gray-900">1.35M€</div>
          <div className="text-xs text-gray-500">Inversión Total</div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="text-sm text-green-600">270k€</div>
          <div className="text-xs text-gray-500">20% CAPEX</div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="text-sm text-green-700">+2.43M€</div>
          <div className="text-xs text-gray-500">180% ROI</div>
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-700">8m</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="text-sm text-gray-900">90%</div>
            <div className="w-16 bg-gray-200 rounded-full h-1">
              <div
                className="h-1 rounded-full bg-green-600"
                style={{ width: "90%" }}
              ></div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              <CircleCheck className="w-3 h-3" />
              Bank-Ready
            </div>
            <div className="text-xs text-gray-500">92% score</div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto space-y-6">
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
        <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          <Download className="w-4 h-4" />
          Exportar Cartera
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
          <button className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border-blue-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
            <LucideCircleQuestionMark className="w-3 h-3 text-blue-600" />
          </button>
          <p className="text-sm text-gray-600 mb-1">Total Activos</p>
          <p className="text-2xl text-[#1e3a8a] mb-1">13</p>
          <p className="text-xs text-gray-500">9 Bank-Ready</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
          <button className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border-orange-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
            <LucideCircleQuestionMark className="w-3 h-3 text-orange-600" />
          </button>
          <p className="text-sm text-gray-600 mb-1">CAPEX Total</p>
          <p className="text-2xl text-orange-600 mb-1">16.1M€</p>
          <p className="text-xs text-gray-500">Inversión necesaria</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
          <button className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
            <LucideCircleQuestionMark className="w-3 h-3 text-green-600" />
          </button>
          <p className="text-sm text-gray-600 mb-1">Valor Creado</p>
          <p className="text-2xl text-green-600 mb-1">29.0M€</p>
          <p className="text-xs text-gray-500">Green Premium total</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4 relative group tooltip-container">
          <button className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-purple-100 border-purple-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
            <LucideCircleQuestionMark className="w-3 h-3 text-purple-600" />
          </button>
          <p className="text-sm text-gray-600 mb-1">TIR Promedio</p>
          <p className="text-2xl text-purple-600 mb-1">18.5%</p>
          <p className="text-xs text-gray-500">Retorno anualizado</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar edificio..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg text-sm transition-colors bg-[#1e3a8a] text-white">
              Todos (13)
            </button>
            <button className="px-4 py-2 rounded-lg text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
              Bank-Ready (9)
            </button>
            <button className="px-4 py-2 rounded-lg text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200">
              Pendientes (4)
            </button>
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]">
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
                <th className="px-4 py-3 text-center text-xs text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#1e3a8a] rounded focus:ring-2 focus:ring-[#1e3a8a] cursor-pointer"
                  />
                </th>
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
              <BuildingOpportunity />
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
