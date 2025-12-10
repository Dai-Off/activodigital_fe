import React from "react";
import { MoveLeftIcon, DownloadIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
  t: any;
  isMobile: boolean;
  onExport?: () => void;
}

const HeaderControls: React.FC<Props> = ({ t, isMobile, onExport }) => {
  return (
    <div className={`flex items-center justify-between ${isMobile ? "flex-col gap-4 items-stretch" : ""}`}>
      <Button className="flex items-center gap-2 text-[#1e3a8a] hover:text-blue-700 transition-colors">
        <MoveLeftIcon className="w-4 h-4" />
        <span className="text-sm">{t ? t("backToRadar", "Volver al Radar") : "Volver al Radar"}</span>
      </Button>

      <div className={`flex justify-center gap-4 ${isMobile ? "w-full justify-between" : ""}`}>
        <Button
          onClick={onExport}
          className="flex justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <DownloadIcon className="w-4 h-4" />
          {t ? t("export Analysis", "Exportar Análisis") : "Exportar Análisis"}
        </Button>
      </div>
    </div>
  );
};

export default HeaderControls;
