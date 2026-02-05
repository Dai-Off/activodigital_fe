import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useIsMobile } from "~/components/ui/use-mobile";

/* Componentes ya existentes en tu repo (los dejo como import) */
import HelpersTwin from "./componentes/HelpersTwin";
import ModalFinancial from "./componentes/ModalFinancial";
import HeroCard from "./HeroCard";
import RightColumn from "./RightColumn";

import LeftColumn from "./LeftColumn";
import HeaderControls from "./componentes/HeaderControls";
import FooterAction from "./componentes/FooterAction";
import useHeaderContext from "~/contexts/HeaderContext";
import { BuildingsApiService, type Building } from "~/services/buildingsApi";
import { useLocation } from "react-router-dom";
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

  const { selectedBuildingId } = useHeaderContext();

  const [buildingData, setBuildingData] = useState<Building | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (selectedBuildingId && location.pathname.includes("financial-twin")) {
      BuildingsApiService.getBuildingById(selectedBuildingId).then((res) => {
        setBuildingData(res);
      });
    }
  }, [selectedBuildingId, location])


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
