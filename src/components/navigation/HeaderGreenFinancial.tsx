import {
  Building2,
  ChartColumn,
  LucideLeaf,
  MessagesSquare,
  Shield,
  TriangleAlert,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function HeaderGreenFinancial() {
  const location = useLocation();
  const navigate = useNavigate();
  const isFinancialTwin =
    location.pathname === "/green-financial/financial-twin";
  const isGreenFianncial = location.pathname === "/green-financial";

  return (
    <header className="w-full text-white shadow-lg">
      <div className="bg-white border-b border-gray-200 px-6 sm:px-8 pt-6 pb-5 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <LucideLeaf
                className="w-6 h-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-gray-900">Financiación Verde</h2>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium whitespace-nowrap">
                  PACK BANCA
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Sistema integral de financiación sostenible
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg whitespace-nowrap">
              <TriangleAlert className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs sm:text-sm">2 Requerimientos</span>
            </div>
            <div className="text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg whitespace-nowrap">
              <span className="text-gray-500 text-xs sm:text-sm">
                Euribor 12M:
              </span>
              <span className="ml-2 text-gray-900 font-medium text-xs sm:text-sm">
                3.65%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 flex-shrink-0 overflow-x-auto">
        <div className="flex gap-1 -mb-px min-w-max">
          <button
            onClick={() => {
              navigate("/green-financial");
            }}
            className={`px-3 py-2 text-xs border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              isGreenFianncial
                ? "border-[#1e3a8a] text-[#1e3a8a]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <ChartColumn className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Radar</span>
          </button>
          <button
            onClick={() => {
              navigate("/green-financial/financial-twin");
            }}
            className={`px-3 py-2 text-xs border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              isFinancialTwin
                ? "border-[#1e3a8a] text-[#1e3a8a]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Financial Twin</span>
            <span className="sm:hidden">Twin</span>
          </button>
          <button
            className="px-3 py-2 text-xs border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900"
            disabled={true}
          >
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Data Room</span>
          </button>
          <button className="px-3 py-2 text-xs border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap border-transparent text-gray-600 hover:text-gray-900">
            <MessagesSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Requerimientos</span>
          </button>
        </div>
      </div>
    </header>
  );
}
