import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import { useNavigation } from "~/contexts/NavigationContext";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";

interface SidebarUsersParamas {}

const SidebarEvents: React.FC<SidebarUsersParamas> = () => {
  const { setActiveSection, setActiveTab, setViewMode, setSelectedBuildingId } =
    useNavigation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState<String | null>("general");

  const handleAllUsersClick = (
    action: string,
    view: string,
    navigateTo: string
  ) => {
    setActiveSection && setActiveSection(action);
    setActiveTab && setActiveTab(action);
    setViewMode && setViewMode("list");
    setSelectedBuildingId && setSelectedBuildingId(null);
    navigate(`${navigateTo}${view ? `?view=${encodeURIComponent(view)}` : ""}`);
  };

  return (
    <>
      <nav className="py-4">
        <div className="space-y-1.5 px-3">
          <Button
            variant="ghost"
            onClick={() => (
              handleAllUsersClick("events", "general", "/events"),
              setActiveMenuItem("general")
            )}
            className={
              activeMenuItem === "general"
                ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
            }
          >
            <Calendar className="w-4 h-4" />
            <span className="flex-1 text-left truncate leadinge-relaxed">
              {t("General View", "Vista general")}
            </span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => (
              handleAllUsersClick("events", "month", "/events"),
              setActiveMenuItem("month")
            )}
            className={
              activeMenuItem === "month"
                ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
            }
          >
            <Calendar className="w-4 h-4" />
            <span className="flex-1 text-left truncate leadinge-relaxed">
              {t("Month View", "Vista mensual")}
            </span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => (
              handleAllUsersClick("events", "week", "/events"),
              setActiveMenuItem("week")
            )}
            className={
              activeMenuItem === "week"
                ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
            }
          >
            <Calendar className="w-4 h-4" />
            <span className="flex-1 text-left truncate leadinge-relaxed">
              {t("all Events", "Vista semanal")}
            </span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => (
              handleAllUsersClick("events", "maintenance", "/events"),
              setActiveMenuItem("maintenance")
            )}
            className={
              activeMenuItem === "maintenance"
                ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
            }
          >
            <Calendar className="w-4 h-4" />
            <span className="flex-1 text-left truncate leadinge-relaxed">
              {t("Maintenance ", "Mantenimientos")}
            </span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => (
              handleAllUsersClick("events", "inspections", "/events"),
              setActiveMenuItem("inspections")
            )}
            className={
              activeMenuItem === "inspections"
                ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
            }
          >
            <Calendar className="w-4 h-4" />
            <span className="flex-1 text-left truncate leadinge-relaxed">
              {t("inspections", "Inspecciones")}
            </span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => (
              handleAllUsersClick("events", "expiration", "/events"),
              setActiveMenuItem("expiration")
            )}
            className={
              activeMenuItem === "expiration"
                ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
            }
          >
            <Calendar className="w-4 h-4" />
            <span className="flex-1 text-left truncate leadinge-relaxed">
              {t("expiration", "Vencimientos")}
            </span>
          </Button>
        </div>
      </nav>
    </>
  );
};

export default SidebarEvents;
