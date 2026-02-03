import { 
  Building2, 
  House, 
  LucideLeaf, 
  Users, 
  Calendar, 
  ChartColumn, 
  FolderOpen, 
  Folder, 
  Settings, 
  MessageCircle,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigation } from "../../contexts/NavigationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Debug: verificar que la sidebar se renderiza
  console.log("Sidebar renderizado");

  let activeModule = "inicio";
  let setActiveModule: ((module: string) => void) | null = null;
  let setActiveSection: ((section: string) => void) | null = null;
  let setActiveTab: ((tab: string) => void) | null = null;
  let setViewMode: ((mode: "list" | "detail") => void) | null = null;
  let setSelectedBuildingId: ((id: string | null) => void) | null = null;

  try {
    const navigation = useNavigation();
    activeModule = navigation.activeModule;
    setActiveModule = navigation.setActiveModule;
    setActiveSection = navigation.setActiveSection;
    setActiveTab = navigation.setActiveTab;
    setViewMode = navigation.setViewMode;
    setSelectedBuildingId = navigation.setSelectedBuildingId;
  } catch (error) {
    console.error("Error en Sidebar useNavigation:", error);
  }

  let t: ((key: string, defaultValue?: string) => string) | null = null;
  try {
    const langContext = useLanguage();
    t = langContext.t;
  } catch (error) {
    console.error("Error en Sidebar useLanguage:", error);
    t = (key: string, defaultValue?: string) => defaultValue || key;
  }

  // Cerrar sidebar en mobile cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileOpen && !target.closest('[data-sidebar="true"]') && !target.closest('[data-hamburger="true"]')) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevenir scroll del body cuando el sidebar está abierto
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  /* Listado en donde se crean los iconos para navegar en el Sidebar principal */

  const menuItems = [
    {
      id: "dashboard",
      icon: House,
      label: t ? t("home", "Panel") : "Panel",
    },
    {
      id: "assets",
      icon: Building2,
      label: t ? t("buildings", "Edificios") : "Edificios",
    },
    {
      id: "users",
      icon: Users,
      label: t ? t("users", "Usuarios") : "Usuarios",
    },
    {
      id: "events",
      icon: Calendar,
      label: t ? t("events", "Calendario") : "Calendario",
    },
    {
      id: "reports",
      icon: ChartColumn,
      label: t ? t("reports", "Informes") : "Informes",
      route: "/dashboard/activity", // Placeholder route
    },
    {
      id: "gestion",
      icon: FolderOpen,
      label: t ? t("generalManagement", "Gestión General") : "Gestión General",
      route: "/gestion",
    },
    {
      id: "green-financial",
      icon: LucideLeaf,
      label: t
        ? t("green-financial", "Financiación Verde")
        : "Financiación Verde",
    },
    {
      id: "archive",
      icon: Folder,
      label: t ? t("archive", "Archivo") : "Archivo",
      route: "/assets", // Placeholder route
    },
    {
      id: "settings",
      icon: Settings,
      label: t ? t("settings", "Configuración") : "Configuración",
      route: "/configuration", // Placeholder route
    },
    {
      id: "expired",
      icon: Folder,
      label: t ? t("archive", "Archivo") : "Archivo",
    },
  ];

  const handleModuleChange = (moduleId: string, route?: string) => {
    if (setActiveModule) setActiveModule(moduleId);
    if (setSelectedBuildingId) setSelectedBuildingId(null);
    
    // Cerrar sidebar en mobile después de hacer click
    setIsMobileOpen(false);
    
    // Si hay una ruta específica, usarla
    if (route) {
      navigate(route);
      return;
    }
    
    // Establecer sección y tab predeterminados según el módulo
    switch (moduleId) {
      case "dashboard":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/dashboard");
        break;
      case "users":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/users");
        break;
      case "events":
        if (setActiveSection) setActiveSection("events");
        if (setActiveTab) setActiveTab("events");
        if (setViewMode) setViewMode("list");
        navigate("/events");
        break;
      case "assets":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/assets");
        break;
      case "green-financial":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/green-financial");
        break;
      case "expired":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/expired");
        break;
      case "reports":
        if (setActiveSection) setActiveSection("activity");
        if (setActiveTab) setActiveTab("activity");
        if (setViewMode) setViewMode("list");
        navigate("/dashboard/activity");
        break;
      case "gestion":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/gestion");
        break;
      case "archive":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/assets");
        break;
      case "settings":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/configuration");
        break;
      default:
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
    }
  };

  const handleLogoClick = () => {
    if (setActiveModule) setActiveModule("inicio");
    if (setActiveSection) setActiveSection("dashboard");
    if (setActiveTab) setActiveTab("dashboard");
    if (setViewMode) setViewMode("list");
    navigate("/dashboard");
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Overlay para cerrar sidebar en mobile */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-400/20 backdrop-blur-sm z-40">
          {/* Botón X - Solo visible cuando el sidebar está abierto */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
            aria-label="Toggle menu"
            data-hamburger="true"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Botón Hamburguesa - Solo visible cuando el sidebar está cerrado */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
          aria-label="Toggle menu"
          data-hamburger="true"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-screen w-64 md:w-16 bg-[#1e3a8a] flex flex-col py-6 gap-6 z-50
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        `}
        data-sidebar="true"
      >
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 mx-auto hover:bg-blue-50 transition-all cursor-pointer"
          title={
            t
              ? t("backToDashboard", "Volver al dashboard")
              : "Volver al dashboard"
          }
        >
          <Building2 className="w-6 h-6 text-[#1e3a8a]" />
        </button>

        {/* Título y subtítulo - Solo visible en mobile */}
        <div className="md:hidden px-4 mb-2">
          <h2 className="text-white text-lg font-semibold">ARKIA</h2>
          <p className="text-blue-200 text-sm">{t("managementInmobiliaria")}</p>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-2 md:gap-4 w-full md:items-center px-2 md:px-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleModuleChange(item.id, item.route)}
                className={`
                  flex items-center gap-3 px-4 md:px-0 py-3 md:w-12 md:h-12 rounded-lg 
                  transition-all md:justify-center
                  ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-blue-200 hover:bg-blue-800 hover:text-white"
                  }
                `}
                title={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="md:hidden text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Botón Colaboración - Solo visible en mobile */}
        <div className="md:hidden px-2 mt-auto">
          <button
            className="relative flex items-center gap-3 px-4 py-3 w-full rounded-lg text-blue-200 hover:bg-blue-800 hover:text-white transition-all"
            onClick={() => {
              // Placeholder para colaboración
              setIsMobileOpen(false);
            }}
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm">{t("collaboration")}</span>
            <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              11
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
