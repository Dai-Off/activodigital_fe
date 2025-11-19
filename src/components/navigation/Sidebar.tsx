import { Building2, Home, House } from "lucide-react";
import { useNavigation } from "../../contexts/NavigationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const navigate = useNavigate();

  let activeModule = "edificios";
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
  ];

  const handleModuleChange = (moduleId: string) => {
    if (setActiveModule) setActiveModule(moduleId);
    if (setSelectedBuildingId) setSelectedBuildingId(null);

    // Establecer sección y tab predeterminados según el módulo
    switch (moduleId) {
      case "inicio":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/activos");
        break;
      case "edificios":
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
        if (setViewMode) setViewMode("list");
        navigate("/activos");
        break;
      default:
        if (setActiveSection) setActiveSection("dashboard");
        if (setActiveTab) setActiveTab("dashboard");
    }
  };

  const handleLogoClick = () => {
    if (setSelectedBuildingId) setSelectedBuildingId(null);
    if (setActiveModule) setActiveModule("edificios");
    if (setActiveSection) setActiveSection("dashboard");
    if (setActiveTab) setActiveTab("dashboard");
    if (setViewMode) setViewMode("list");
    navigate("/activos");
  };

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-16 bg-[#1e3a8a] flex-col items-center py-6 gap-6 z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
