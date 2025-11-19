import { LucideActivity, LucideChartColumn, LucideHouse } from "lucide-react";
import { useState } from "react";
//import { useNavigation } from "../../contexts/NavigationContext";
//import { useLanguage } from "../../contexts/LanguageContext";
//import { useNavigate } from "react-router-dom";
// import {
//   BuildingsApiService,
//   type Building,
// } from "../../services/buildingsApi";
// import { SkeletonSidebarBuildings } from "../ui/LoadingSystem";

export function SecondaryNav() {
  //const { t } = useLanguage();
  const [activeItem, setActiveItem] = useState("main");
  const menuItems = [
    { id: "main", label: "Panel Principal", Icon: LucideHouse },
    { id: "stats", label: "Estadísticas", Icon: LucideChartColumn },
    { id: "activity", label: "Actividad Reciente", Icon: LucideActivity },
  ];

  const handleClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <div className="hidden lg:block fixed lg:left-16 top-[88px] lg:w-64 md:w-48 h-[calc(100vh-88px)] bg-white border-r border-gray-200 overflow-y-auto shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <nav className="py-4">
        <div className="space-y-1.5 px-3">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;

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
                  onClick={() => handleClick(item.id)}
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
      </nav>
    </div>
  );
}
