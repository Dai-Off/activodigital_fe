import { Building2, ChartColumn, LucideLeaf, LucideShield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function HeaderGreenFinancial() {
  const location = useLocation();
  const isFinancialTwin = location.pathname === "/green-financial/financial-twin";
  const isGreenFianncial = location.pathname === "/green-financial";
  
  return (
    <header className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <section className="flex items-center gap-3" aria-labelledby="gf-branding-title">
          <span className="bg-white/10 backdrop-blur-sm p-2 rounded-lg" aria-hidden="true">
            <LucideLeaf className="w-6 h-6" aria-hidden="true" focusable="false" />
          </span>
          <div>
            <h1 id="gf-branding-title" className="text-xl flex items-center gap-2">
              Financiación Verde{' '}
              <span className="text-xs bg-green-500 px-2 py-0.5 rounded">
                PACK BANCA
              </span>
            </h1>
            <p className="text-xs text-blue-100">
              Deal Room • Green Financing Platform
            </p>
          </div>
        </section>
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Markets Open</span>
            </div>
            <div className="text-xs text-blue-100 mt-0.5">
              EU Taxonomy Active
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-right">
            <div className="text-xs text-blue-100">Euribor 12M</div>
            <div className="text-sm">3.65%</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 border-t border-white/20 pt-3">
        <Link to="/green-financial" className={`px-4 py-2 rounded-lg text-sm transition-all ${isGreenFianncial ? 'bg-white text-[#1e3a8a] shadow-lg': 'bg-white/10 hover:bg-white/20 text-white'}`}>
          <div className="flex items-center gap-2">
            <ChartColumn className="w-4 h-4" aria-hidden="true" focusable="false" />
            <span>Radar de Oportunidades</span>
          </div>
        </Link>
        <Link to="/green-financial/financial-twin" className={`px-4 py-2 rounded-lg text-sm transition-all ${isFinancialTwin ? 'bg-white text-[#1e3a8a] shadow-lg': 'bg-white/10 hover:bg-white/20 text-white'}`}>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" aria-hidden="true" focusable="false" />
            <span>Financial Twin</span>
          </div>
        </Link>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg text-sm transition-all bg-white/10 hover:bg-white/20 text-white`}
          disabled={true}
          aria-label="Data Room"
          aria-disabled="true"
        >
          <div className="flex items-center gap-2">
            <LucideShield className="w-4 h-4" aria-hidden="true" focusable="false" />
            <span>Data Room</span>
          </div>
        </button>
      </div>
    </header>
  );
}
