import {
  Activity,
  Building2,
  Calendar,
  ChevronDown,
  Euro,
  FileText,
  Leaf,
  Shield,
  Wallet,
  Wrench,
  Zap,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import { useNavigation } from "~/contexts/NavigationContext";
import { useToast } from "~/contexts/ToastContext";
import { buildingService } from "~/services/buildings";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

export function GeneralView() {
  interface MenuItem {
    id: string;
    label: string;
    Icon: typeof Building2;
    route: string;
  }
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setActiveSection, setActiveTab, setViewMode, setActiveModule } =
    useNavigation();
  const [DropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const { showError, showSuccess } = useToast();
  const { pathname } = useLocation();
  const { id: buildingId } = useParams<{ id: string }>();
  const menuItems: MenuItem[] = [
    {
      id: "buildingGeneralView",
      label: t("generalView", "Vista General"),
      Icon: Building2,
      route: "/building/:id/general-view",
    },
    {
      id: "buildingFinancial",
      label: t("financial", "Financiero"),
      Icon: Wallet,
      route: "/building/:id/general-view/financial",
    },
    {
      id: "buildingInsurance",
      label: t("insurances", "Seguros"),
      Icon: Shield,
      route: "/building/:id/general-view/insurance",
    },
    {
      id: "buildingCalendar",
      label: t("calendarOfActions", "Calendario de acciones"),
      Icon: Calendar,
      route: "/building/:id/general-view/calendar",
    },
    {
      id: "buildingRent",
      label: t("rents", "Rentas"),
      Icon: Euro,
      route: "/building/:id/general-view/rent",
    },
    {
      id: "buildingEnergyEfficiency",
      label: t("energyEfficiency", "Eficiencia Energética"),
      Icon: Zap,
      route: "/building/:id/general-view/energy-efficiency",
    },
    {
      id: "buildingCertificates",
      label: t("certificates", "Certificados"),
      Icon: FileText,
      route: "/building/:id/general-view/certificates",
    },
    {
      id: "buildingMaintenance",
      label: t("maintenance", "Mantenimiento"),
      Icon: Wrench,
      route: "/building/:id/general-view/maintenance",
    },
  ];

  const currentItem =
    menuItems.find((item) => {
      const resolvedRoute = item.route.replace(":id", buildingId || "");
      return pathname === resolvedRoute;
    }) || menuItems[0];

  const CurrentIcon = currentItem.Icon;

  // Cerrar menú de acciones al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setActionsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteBuilding = async () => {
    if (!buildingId) return;
    
    try {
      await buildingService.delete(buildingId);
      showSuccess(t("buildingDeleted", "Edificio eliminado correctamente"));
      // Despachar evento para actualizar sidebar
      window.dispatchEvent(new Event('building-deleted'));
      navigate("/assets");
    } catch (error) {
      console.error("Error deleting building:", error);
      showError(t("errorDeletingBuilding", "Error al eliminar el edificio"));
    }
    setShowDeleteDialog(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 py-2 px-2 sm:py-2.5 sm:pr-4 flex-shrink-0 flex items-center justify-between gap-2">
        <div className="flex-shrink-0 min-w-0">
          <div
            onClick={() => setDropdownMenu(!DropdownMenu)}
            className="relative"
          >
            <button className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-[140px] sm:w-[200px] shadow-sm">
              {/* Current Menu Label */}
              <CurrentIcon className="w-3.5 h-3.5 text-[#1e3a8a] flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-900 flex-1 text-left truncate">
                {currentItem.label}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-500 transition-transform flex-shrink-0 ${
                  DropdownMenu ? "rotate-180" : ""
                }`}
              />
            </button>
            {/* Dropdown Menu */}
            {DropdownMenu ? (
              <div className="absolute top-full left-0 mt-1 w-[200px] sm:w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[380px] overflow-y-auto">
                {menuItems.map((item) => {
                  const resolvedRoute = item.route.replace(
                    ":id",
                    buildingId || ""
                  );
                  const isActive = pathname === resolvedRoute;

                  const buttonClasses = `
              w-full px-3 py-2.5 sm:py-2 text-xs sm:text-sm text-left  transition-colors flex items-center gap-2
              ${isActive ? "bg-blue-50" : " hover:bg-gray-50 text-gray-700"}
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
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isActive ? "text-[#1e3a8a]" : "text-gray-500"
                          }`}
                        />
                        <span className="flex-1 text-left leading-relaxed">
                          {item.label}
                        </span>
                        {isActive ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="lucide lucide-check w-3.5 h-3.5 text-[#1e3a8a] flex-shrink-0"
                            aria-hidden="true"
                          >
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                        ) : null}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => {
              navigate(`/building/${buildingId}/general-view/activity`);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 bg-white rounded-lg transition-colors shadow-sm text-gray-700 hover:bg-gray-50"
            title="Ver Actividad Reciente"
          >
            <Activity className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm hidden sm:inline">
              {t("activity", "Actividad")}
            </span>
          </button>
          <button
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors shadow-sm"
            title="Ver en Financiación Verde"
            onClick={() => {
              setActiveModule("green-financial");
              setActiveSection("dashboard");
              setActiveTab("dashboard");
              setViewMode("list");
              navigate("/green-financial");
            }}
          >
            <Leaf className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm hidden sm:inline">
              {t("greenFinancial", "Financiación Verde")}
            </span>
          </button>
          
          <div className="relative" ref={actionsMenuRef}>
            <button
              onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
              className="flex items-center justify-center p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-gray-500"
              title={t("moreOptions", "Más opciones")}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {actionsMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={() => {
                    setActionsMenuOpen(false);
                    setShowDeleteDialog(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                  {t("deleteBuilding", "Eliminar edificio")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Outlet />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteTitle", "¿Estás absolutamente seguro?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDeleteDescription", "Esta acción no se puede deshacer. Esto eliminará permanentemente el edificio y todos sus datos asociados.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel", "Cancelar")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBuilding} className="bg-red-600 hover:bg-red-700">
              {t("delete", "Eliminar")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
