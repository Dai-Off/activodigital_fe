import { t } from "i18next";
import { LucideActivity, LucideChartColumn, LucideHouse } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function SidebarDashboard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const menuItems = [
    {
      id: "main",
      label: t("main"),
      Icon: LucideHouse,
      route: "/dashboard",
    },
    {
      id: "stats",
      label: t("statistics"),
      Icon: LucideChartColumn,
      route: "/dashboard/statistics",
    },
    {
      id: "activity",
      label: t("recentActivity"),
      Icon: LucideActivity,
      route: "/dashboard/activity",
    },
  ];

  return (
    <div className="space-y-1.5 px-3">
      {menuItems.map((item) => {
        const isActive = pathname === item.route;

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
              // El evento onClick actualiza el estado
              onClick={() => {
                navigate(item.route);
              }}
            >
              {/* El color del ícono también cambia */}
              <item.Icon
                className={`w-4 h-4 ${
                  isActive ? "text-white" : "text-gray-00"
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
