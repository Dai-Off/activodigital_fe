import {
  Activity,
  Building2,
  Calendar,
  Euro,
  FileText,
  Shield,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useNavigation } from "~/contexts/NavigationContext";

export function GeneralView() {
  interface MenuItem {
    id: string;
    label: string;
    Icon: typeof Building2; // Tipo correcto para iconos de Lucide
    route: string; // La ruta con el placeholder :id
  }
  const navigate = useNavigate();
  const { setActiveSection, setActiveTab, setViewMode } = useNavigation();
  const { pathname } = useLocation();
  const { id: buildingId } = useParams<{ id: string }>();
  const menuItems: MenuItem[] = [
    {
      id: "buildingGeneralView",
      label: "Vista General",
      Icon: Building2,
      route: "/building/:id/general-view",
    },
    {
      id: "buildingFinancial",
      label: "Financiero",
      Icon: Wallet,
      route: "/building/:id/general-view/financial",
    },
    {
      id: "buildingInsurance",
      label: "Seguros",
      Icon: Shield,
      route: "/building/:id/general-view/insurance",
    },
    {
      id: "buildingCalendar",
      label: "Calendario de acciones",
      Icon: Calendar,
      route: "/building/:id/general-view/calendar",
    },
    {
      id: "buildingRent",
      label: "Rentas",
      Icon: Euro,
      route: "/building/:id/general-view/rent",
    },
    {
      id: "buildingEnergyEfficiency",
      label: "Eficiencia Energética",
      Icon: Zap,
      route: "/building/:id/general-view/energy-efficiency",
    },
    {
      id: "buildingCertificates",
      label: "Certificados",
      Icon: FileText,
      route: "/building/:id/general-view/certificates",
    },
    {
      id: "buildingMaintenance",
      label: "Mantenimiento",
      Icon: Wrench,
      route: "/building/:id/general-view/maintenance",
    },
    {
      id: "buildingActivity",
      label: "Actividad",
      Icon: Activity,
      route: "/building/:id/general-view/activity",
    },
  ];
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-gray-100 border-none border-b px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0">
        {menuItems.map((item) => {
          const resolvedRoute = item.route.replace(":id", buildingId || "");
          const isActive = pathname === resolvedRoute;

          const buttonClasses = `
              flex items-center gap-2 px-4 h-9 rounded-md transition-colors whitespace-nowrap text-sm
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `;

          return (
            <div className="mb-1" key={item.id}>
              <button
                className={buttonClasses.trim()}
                onClick={() => {
                  setActiveSection(item.id);
                  setViewMode("detail");
                  setActiveTab(item.id);
                  navigate(resolvedRoute);
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
      <Outlet />
    </div>
  );
}
