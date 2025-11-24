import { Building2, House, Users } from "lucide-react";
import { useNavigation } from "../../contexts/NavigationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();

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

  /* Listado en donde se crean los iconos para navegar en el Sidebar principal */

  const menuItems = [
    {
      id: "inicio",
      icon: House,
      label: t ? t("home", "Inicio") : "Inicio",
    },
    {
      id: "edificios",
      icon: Building2,
      label: t ? t("buildings", "Edificios") : "Edificios",
    },
    {
      id: "usuarios",
      icon: Users,
      label: t ? t("users", "Usuarios") : "Usuarios",
    },
  ];

  const handleModuleChange = (moduleId: string) => {
    if (setActiveModule) setActiveModule(moduleId);
    if (setSelectedBuildingId) setSelectedBuildingId(null);
    console.log(moduleId, "hola");
    // Establecer sección y tab predeterminados según el módulo
    switch (moduleId) {
      case "inicio":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/dashboard");
        break;
      case "usuarios":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/users");
        break;
      case "edificios":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/assets");
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
  };

  return (
    <div
      className="flex fixed left-0 top-0 h-screen w-16 bg-[#1e3a8a] flex-col items-center py-6 gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{
        display: "flex",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10000,
        visibility: "visible",
        opacity: 1,
        width: "64px",
        height: "100vh",
        pointerEvents: "auto",
      }}
      data-sidebar="true"
    >
      {/* Logo */}
      <button
        onClick={handleLogoClick}
        className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 hover:bg-blue-50 transition-all cursor-pointer"
        title={
          t
            ? t("backToDashboard", "Volver al dashboard")
            : "Volver al dashboard"
        }
      >
        <Building2 className="w-6 h-6 text-[#1e3a8a]" />
      </button>

      {/* Menu Items */}
      <div className="flex flex-col gap-4 w-full items-center">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleModuleChange(item.id)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
