import { t } from "i18next";
import { ChartColumn } from "lucide-react";
import { useNavigation } from "../../contexts/NavigationContext";

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
      Icon: ChartColumn,
    },
    {
      id: "financial",
      label: t("financial", "Financiero"),
      Icon: ChartColumn,
    },
    {
      id: "compliance",
      label: t("compliance", "Cumplimiento"),
      Icon: ChartColumn,
    },
    {
      id: "maintenance",
      label: t("maintenance", "Mantenimiento"),
      Icon: ChartColumn,
    },
    {
      id: "occupancy",
      label: t("occupancy", "Ocupación"),
      Icon: ChartColumn,
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
              <ChartColumn
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
