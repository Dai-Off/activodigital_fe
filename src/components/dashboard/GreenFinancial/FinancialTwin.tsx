import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  TriangleAlert,
} from "lucide-react";

import { useIsMobile } from "~/components/ui/use-mobile";

/* Componentes ya existentes en tu repo (los dejo como import) */
import HelpersTwin from "./componentes/HelpersTwin";
import ModalFinancial from "./componentes/ModalFinancial";
import HeroCard from "./HeroCard";
import RightColumn from "./RightColumn";

import LeftColumn from "./LeftColumn";
import HeaderControls from "./componentes/HeaderControls";
import FooterAction from "./componentes/FooterAction";
import { BuildingsApiService, type Building } from "~/services/buildingsApi";
import { useParams } from "react-router-dom";
import { HeroCardSkeleton } from "~/components/ui/LoadingSystem";

interface SectionI {
  validationInfo: boolean;
  showHelpers: boolean;
  showCostes: boolean;
  showGreenPremium: boolean;
}

interface DNSHInterface {
  useWater: boolean;
  economyCircly: boolean;
  polution: boolean;
  biodiversity: boolean;
  adaptation: boolean;
}

export interface HelpMetricas {
  General: boolean;
  CashFlow: boolean;
  TIR: boolean;
  CashOnCash: boolean;
  Equity: boolean;
  YieldOnCost: boolean;
  LTVVerde: boolean;
  DSCRProyectado: boolean;
}

const FinancialTwin: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [financialTwin, setFinancialTwin] = useState<boolean>(false);

  const [metricHelp, setMetricHelp] = useState<HelpMetricas>({
    General: false,
    CashOnCash: false,
    DSCRProyectado: false,
    Equity: false,
    LTVVerde: false,
    TIR: false,
    YieldOnCost: false,
    CashFlow: false,
  });

  const [showDNSH, setShowDNSH] = useState<DNSHInterface>({
    useWater: false,
    adaptation: false,
    biodiversity: false,
    economyCircly: false,
    polution: false,
  });

  const [showSection, setShowSection] = useState<SectionI>({
    validationInfo: false,
    showHelpers: false,
    showCostes: false,
    showGreenPremium: false,
  });

  const cardBase = "bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6";

  const { buildingId } = useParams<{ buildingId: string }>();

  const [buildingData, setBuildingData] = useState<Building | null>(null);
  const [bankReadyProgress] = useState<{
    completed: number;
    total: number;
    percent: number;
  } | null>(null);

  useEffect(() => {
    if (buildingId) {
      BuildingsApiService.getBuildingById(buildingId).then((res) => {
        setBuildingData(res);
      });
    } else {
      setBuildingData(null);
    }
  }, [buildingId]);


  return (
    <div>
      <HelpersTwin
        active={showSection.showHelpers}
        setActive={(value) => setShowSection((prev) => ({ ...prev, showHelpers: value }))}
      />

      <ModalFinancial active={financialTwin} setActive={(value) => setFinancialTwin(value)} />

      <div style={{ marginTop: "-90px" }}>
        <div className="max-w-[1800px] mx-auto space-y-6 px-4 md:px-0">
          <HeaderControls
            t={t}
            isMobile={isMobile}
            onExport={() => {
              return null
            }}
          />

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:flex">
              <div
                className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-white border border-gray-200 rounded-lg"
                role="status"
                aria-label={
                  bankReadyProgress
                    ? `Progreso de documentación Bank-Ready: ${bankReadyProgress.completed} de ${bankReadyProgress.total} requisitos completados, ${bankReadyProgress.percent} por ciento`
                    : "Sin datos de Bank-Ready"
                }
              >
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div
                    className={`w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-white flex-shrink-0 ${bankReadyProgress ? (bankReadyProgress.percent >= 100 ? "bg-green-500" : "bg-red-500") : "bg-gray-400"}`}
                    aria-hidden="true"
                  >
                    <TriangleAlert className="w-3 h-3 md:w-3.5 md:h-3.5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[9px] md:text-[10px] text-gray-600 leading-tight">Bank-Ready</div>
                    <div className={`text-[10px] md:text-xs leading-tight ${bankReadyProgress ? "text-red-600" : "text-gray-500"}`}>
                      {bankReadyProgress ? `${bankReadyProgress.completed}/${bankReadyProgress.total} • ${bankReadyProgress.percent}%` : "-"}
                    </div>
                  </div>
                </div>
                <div className="w-12 md:w-24">
                  <div
                    className="w-full bg-gray-200 rounded-full h-1 md:h-1.5 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={bankReadyProgress?.percent ?? 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Barra de progreso"
                  >
                    <div
                      className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${bankReadyProgress ? (bankReadyProgress.percent >= 100 ? "bg-green-500" : "bg-red-500") : "bg-gray-400"}`}
                      style={{ width: bankReadyProgress ? `${bankReadyProgress.percent}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs relative focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 whitespace-nowrap"
              title="Libro del Edificio Existente (Opcional)"
              aria-label="Abrir generador del Libro del Edificio Existente"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Generador LEE</span>
            </button>
            <button
              type="button"
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs relative focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 whitespace-nowrap"
              title="Memoria de Calidades"
              aria-label="Abrir gestor de Memoria de Calidades"
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span>Memoria de Calidades</span>
            </button>
            <button
              type="button"
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs relative focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 whitespace-nowrap"
              title="Licencia/Declaración Responsable"
              aria-label="Abrir detector de Licencia o Declaración Responsable"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Licencia/DR</span>
            </button>
            <div
              className="hidden md:block w-px h-6 bg-gray-300"
              role="separator"
              aria-orientation="vertical"
            />
            <button
              type="button"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:ring-offset-2 whitespace-nowrap"
              aria-label="Exportar análisis financiero completo"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Exportar Análisis</span>
            </button>
          </div>

          {buildingData ? (
            <HeroCard buildingData={buildingData} alignmentScore={92} />
          ) : (
            <HeroCardSkeleton />
          )}

          {isMobile ? (
            /* Mobile: Left stacked then right stacked (handled inside LeftColumn when isMobile true) */
            <div>
              <LeftColumn
                cardBase={cardBase}
                showSection={showSection}
                setShowSection={setShowSection}
                showDNSH={showDNSH}
                setShowDNSH={setShowDNSH}
              />

              <RightColumn
                cardBase={cardBase}
                metricHelp={metricHelp}
                setMetricHelp={setMetricHelp}
              />
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-6">
              <div className="col-span-3 space-y-4">
                <LeftColumn
                  cardBase={cardBase}
                  showSection={showSection}
                  setShowSection={setShowSection}
                  showDNSH={showDNSH}
                  setShowDNSH={setShowDNSH}
                />
              </div>

              <div className="col-span-2 space-y-4">
                <RightColumn
                  cardBase={cardBase}
                  metricHelp={metricHelp}
                  setMetricHelp={setMetricHelp}
                />
              </div>
            </div>
          )}

          <FooterAction onOpen={() => setFinancialTwin(true)} />
        </div>
      </div>
    </div>
  );
};

export default FinancialTwin;
