import { t } from "i18next";
import { ChartColumn } from "lucide-react";
import { useNavigation } from "../../contexts/NavigationContext";
import { REPORT_CATEGORIES } from "../../constants/reports";

export function SidebarReports() {
  const { activeSection, setActiveSection } = useNavigation();
  
  const menuItems = [
    {
      id: "all",
      label: t("allReports", "Todos los informes"),
      Icon: ChartColumn,
    },
    {
      id: "energy",
      label: t("energyEfficiency", "Eficiencia Energética"),
      Icon: REPORT_CATEGORIES.energy.icon,
    },
    {
      id: "financial",
      label: t("financial", "Financiero"),
      Icon: REPORT_CATEGORIES.financial.icon,
    },
    {
      id: "compliance",
      label: t("compliance", "Cumplimiento"),
      Icon: REPORT_CATEGORIES.compliance.icon,
    },
    {
      id: "maintenance",
      label: t("maintenance", "Mantenimiento"),
      Icon: REPORT_CATEGORIES.maintenance.icon,
    },
    {
      id: "occupancy",
      label: t("occupancy", "Ocupación"),
      Icon: REPORT_CATEGORIES.occupancy.icon,
    },
  ];

  return (
    <div className="space-y-1.5 px-3">
      {menuItems.map((item) => {
        const isActive = activeSection === item.id;

        const buttonClasses = `
              w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50"
              }
            `;

        return (
          <div className="mb-1" key={item.id}>
            <button
              className={buttonClasses.trim()}
              onClick={() => {
                if (setActiveSection) setActiveSection(item.id);
              }}
            >
              <item.Icon
                className={`w-4 h-4 ${
                  isActive ? "text-white" : "text-gray-700"
                }`}
              />
              <span className="flex-1 text-left leading-relaxed">
                {item.label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
