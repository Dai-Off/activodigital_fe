//import { LucideActivity, LucideChartColumn, LucideHouse } from "lucide-react";
//import { useState } from "react";
//import { useNavigation } from "../../contexts/NavigationContext";
//import { useLanguage } from "../../contexts/LanguageContext";
//import { useNavigate } from "react-router-dom";
// import {
//   BuildingsApiService,
//   type Building,
// } from "../../services/buildingsApi";
// import { SkeletonSidebarBuildings } from "../ui/LoadingSystem";

import { useLocation } from "react-router-dom";
import { DashboardComponent } from "./DashboardComponent";

export function SecondaryNav() {
  //const { t } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;
  const segments = currentPath.substring(1).split("/");
  const pathName = segments[0].toLowerCase();
  const components: any = {
    dashboard: <DashboardComponent />,
  };

  return (
    <div className="hidden lg:block fixed lg:left-16 top-[88px] lg:w-64 md:w-48 h-[calc(100vh-88px)] bg-white border-r border-gray-200 overflow-y-auto shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <nav className="py-4">{components[pathName]}</nav>
    </div>
  );
}
