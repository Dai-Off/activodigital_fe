import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles,
  Globe,
  Bell,
  ChevronRight as ChevronRightIcon,
  Settings,
  LogOut,
  UserCircle,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useNavigation } from "../../contexts/NavigationContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  BuildingsApiService,
  type Building,
} from "../../services/buildingsApi";
import { toast } from "sonner";
import { MobileNav } from "./MobileNav";
import { AIAssistant } from "../AIAssistant";
import { useNotifications } from "~/contexts/NotificationContext";
import { formatofechaCorta } from "~/utils/fechas";
import { timeAgo } from "~/utils/timeAgo";
import { getTimeRemaining } from "~/utils/getTimeRemaining";

export function AppHeader() {
  let goBack = () => {},
    goForward = () => {},
    canGoBack = false,
    canGoForward = false;
  let viewMode: "list" | "detail" = "list";
  let selectedBuildingId: string | null = null;
  let setSelectedBuildingId: ((id: string | null) => void) | null = null;
  let setViewMode: ((mode: "list" | "detail") => void) | null = null;
  let setActiveSection: ((section: string) => void) | null = null;
  let setActiveTab: ((tab: string) => void) | null = null;

  try {
    const navigation = useNavigation();
    goBack = navigation.goBack;
    goForward = navigation.goForward;
    canGoBack = navigation.canGoBack;
    canGoForward = navigation.canGoForward;
    viewMode = navigation.viewMode;
    selectedBuildingId = navigation.selectedBuildingId;
    setSelectedBuildingId = navigation.setSelectedBuildingId;
    setViewMode = navigation.setViewMode;
    setActiveSection = navigation.setActiveSection;
    setActiveTab = navigation.setActiveTab;
  } catch (error) {
    console.error("Error en AppHeader useNavigation:", error);
  }

  let language = "ES";
  let setLanguage: ((lang: "ES" | "EN" | "FR" | "DE" | "PT") => void) | null =
    null;
  let t: ((key: string, defaultValue?: string) => string) | null = null;

  try {
    const langContext = useLanguage();
    language = langContext.language;
    setLanguage = langContext.setLanguage;
    t = langContext.t;
  } catch (error) {
    console.error("Error en AppHeader useLanguage:", error);
    t = (key: string, defaultValue?: string) => defaultValue || key;
  }

  let user = null;
  let logout: (() => void) | null = null;

  try {
    const auth = useAuth();
    user = auth.user;
    logout = auth.logout;
  } catch (error) {
    console.error("Error en AppHeader useAuth:", error);
  }

  const navigate = useNavigate();

  // Helper para traducciones que siempre retorna un string
  const translate = (key: string, defaultValue?: string): string => {
    if (t) {
      return t(key, defaultValue);
    }
    return defaultValue || key;
  };

  const location = useLocation();

  const pathSegments = useMemo(() => {
    return location.pathname.split("/").filter(Boolean);
  }, [location.pathname]);

  // Función para obtener la etiqueta traducida de un segmento de ruta
  const getBreadcrumbLabel = (segment: string) => {
    if (segment === selectedBuildingId && selectedBuildingName) {
      return selectedBuildingName;
    }

    switch (segment) {
      case "dashboard":
        return translate("dashboard", "Dashboard");
      case "statistics":
        return translate("statistics", "Estadísticas");
      case "activity":
        return translate("activity", "Actividad");
      case "assets":
        return translate("assets", "Activos");
      case "users":
        return translate("users", "Usuarios");
      case "events":
        return translate("events", "Eventos");
      case "green-financial":
        return translate("greenFinancial", "Financiación Verde");
      case "financial-twin":
        return translate("financialTwin", "Gemelo Financiero");
      case "cfo-due-diligence":
        return translate("cfoDueDiligence", "CFO Due Diligence");
      case "cfo-simulation":
        return translate("cfoSimulation", "Simulación CFO");
      case "building":
        return translate("buildings", "Edificios");
      case "general-view":
        return translate("generalView", "Vista General");
      case "financial":
        return translate("financial", "Financiero");
      case "insurance":
        return translate("insurance", "Seguros");
      case "calendar":
        return translate("calendar", "Calendario");
      case "rent":
        return translate("rent", "Rentas");
      case "energy-efficiency":
        return translate("energyEfficiency", "Eficiencia Energética");
      case "certificates":
        return translate("certificates", "Certificados");
      case "maintenance":
        return translate("maintenance", "Mantenimiento");
      case "gestion":
        return translate("gestion", "Gestión");
      case "analysis-general":
        return translate("generalAnalysis", "Análisis General");
      case "hub":
        return translate("digitalBook", "Libro Digital");
      case "digital-book":
        return translate("digitalBook", "Libro Digital");
      default:
        return (
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
        );
    }
  };

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [searchResults, setSearchResults] = useState<Building[]>([]);
  const [selectedBuildingName, setSelectedBuildingName] = useState<
    string | null
  >(null);

  const translatorRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Buscar edificios cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim()) {
      BuildingsApiService.getAllBuildings()
        .then((buildings) => {
          const filtered = buildings
            .filter(
              (building) =>
                building.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                building.address
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                building.id.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5);
          setSearchResults(filtered);
        })
        .catch(() => setSearchResults([]));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Cargar nombre del edificio cuando cambia selectedBuildingId
  useEffect(() => {
    if (selectedBuildingId && viewMode === "detail") {
      BuildingsApiService.getBuildingById(selectedBuildingId)
        .then((building) => {
          setSelectedBuildingName(building.name);
        })
        .catch(() => {
          setSelectedBuildingName(null);
        });
    } else {
      setSelectedBuildingName(null);
    }
  }, [selectedBuildingId, viewMode]);

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        navigate("/login");
        toast.success(
          translate("sessionClosed", "Sesión cerrada correctamente")
        );
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    setShowUserMenu(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        translatorRef.current &&
        !translatorRef.current.contains(event.target as Node)
      ) {
        setShowTranslator(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (
      showTranslator ||
      showNotifications ||
      showSearchResults ||
      showUserMenu
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTranslator, showNotifications, showSearchResults, showUserMenu]);

  // Mostrar notificaciones
  const {
    refreshUnreadCount,
    UnreadNotifications,
    unreadCount,
    unreadNotifications,
  } = useNotifications();
  const [buildingNames, setBuildingNames] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    refreshUnreadCount();
    UnreadNotifications();
  }, [refreshUnreadCount, UnreadNotifications]);

  useEffect(() => {
    const fetchBuildingNames = async () => {
      if (unreadNotifications.length === 0) return;

      const uniqueIds = [
        ...new Set(unreadNotifications.map((n) => n.buildingId)),
      ];

      const idsToFetch = uniqueIds.filter((id) => !buildingNames[id]);

      if (idsToFetch.length === 0) return;

      try {
        const promises = idsToFetch.map((id) =>
          BuildingsApiService.getBuildingById(id).catch(() => null)
        );

        const buildings = await Promise.all(promises);

        const newNames: Record<string, string> = {};
        buildings.forEach((b) => {
          if (b) newNames[b.id] = b.name;
        });

        // Combinar con los anteriores
        setBuildingNames((prev) => ({ ...prev, ...newNames }));
      } catch (error) {
        console.error("Error cargando nombres de edificios", error);
      }
    };

    fetchBuildingNames();
  }, [unreadNotifications]);

  const handleSearchResultClick = (buildingId: string) => {
    if (setSelectedBuildingId) setSelectedBuildingId(buildingId);
    if (setViewMode) setViewMode("detail");
    if (setActiveSection) setActiveSection("todos");
    if (setActiveTab) setActiveTab("todos");
    setSearchTerm("");
    setShowSearchResults(false);
    navigate(`/building/${buildingId}/general-view`);
  };
  const handleBackToList = () => {
    if (setSelectedBuildingId) setSelectedBuildingId(null);
    if (setViewMode) setViewMode("list");
    if (setActiveSection) setActiveSection("dashboard");
    if (setActiveTab) setActiveTab("dashboard");
    navigate("/dashboard");
  };

  // Componente local para renderizar las notificaciones
  function Notification({
    type,
    title,
    buildingName,
    date,
    expiration,
  }: {
    type: string;
    title: string;
    buildingName: string | undefined;
    date: string;
    expiration?: string;
  }) {
    date = formatofechaCorta(date.toString());
    date = timeAgo(date);
    if (expiration) {
      expiration = getTimeRemaining(expiration);
    }
    const ColorType: any = {
      manteinance: "bg-purple-600",
      building: "bg-blue-600",
      financial: "bg-orange-600",
      documents: "bg-green-600",
      expiration: "bg-yellow-600",
      renewal: "bg-green-600",
    };
    return (
      <div className="p-3 hover:bg-gray-50 cursor-pointer">
        <div className="flex gap-3">
          <div
            className={`w-2 h-2 ${ColorType[type]} rounded-full mt-1.5 flex-shrink-0`}
          ></div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">{title}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              {buildingName} {expiration ? `- ${expiration}` : ""}
            </p>
            <p className="text-xs text-gray-400 mt-1">{date}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 md:left-16 left-0 right-0 z-20">
      <div className="px-3 md:px-6 py-3 md:py-1.5">
        <div className="flex items-center justify-between gap-2 md:gap-0">
          {/* Left Side: Mobile Menu, Logo and Search */}
          <div className="flex items-center gap-2 md:gap-6 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileNav(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={handleBackToList}
              className="text-xl md:text-2xl hover:text-blue-600 transition-colors cursor-pointer flex-shrink-0 font-bold"
            >
              ARKIA
            </button>

            {/* Global Search */}
            <div className="relative flex-1 md:flex-initial" ref={searchRef}>
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={translate("search", "Buscar edificios...")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-80 focus:outline-none focus:border-blue-500"
              />

              {/* Search Results Dropdown */}
              {showSearchResults &&
                searchTerm.trim() &&
                searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                    <div className="py-2">
                      <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                        {translate("buildingsFound", "Edificios encontrados")} (
                        {searchResults.length})
                      </div>
                      {searchResults.map((building) => (
                        <button
                          key={building.id}
                          onClick={() => handleSearchResultClick(building.id)}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                        >
                          <div className="text-sm text-gray-900">
                            {building.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {building.address ||
                              translate("noAddress", "Sin dirección")}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Right Side: AI Assistant, Translator, Notifications, User and Navigation */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="flex items-center justify-center gap-2 px-2 md:px-4 py-2 h-9 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              title={translate("aiAssistant", "Asistente IA")}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm hidden md:inline whitespace-nowrap">
                {translate("aiAssistant", "Asistente IA")}
              </span>
            </button>

            {/* Notifications Button */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                }}
                className="relative flex items-center justify-center px-2 md:px-3 py-2 h-9 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                title={translate("notifications", "Notificaciones")}
              >
                <Bell className="w-4 h-4 flex-shrink-0" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-80 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm text-gray-900">
                        {translate("notifications", "Notificaciones")}
                      </h3>
                    </div>
                  </div>
                  {/* <div className="p-6 text-center text-sm text-gray-500">
                    No hay notificaciones
                  </div> */}
                  {/* Contenedor de las notificaciones */}
                  {unreadNotifications.map((not) => {
                    console.log(not.expiration);
                    if (not.expiration) {
                      return (
                        <Notification
                          key={not.id}
                          buildingName={buildingNames[not.buildingId]}
                          date={not.created_at}
                          title={not.title}
                          type={not.type}
                          expiration={not.expiration}
                        />
                      );
                    }
                    return (
                      <Notification
                        key={not.id}
                        buildingName={buildingNames[not.buildingId]}
                        date={not.created_at}
                        title={not.title}
                        type={not.type}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Language Translator Button */}
            <div className="relative hidden md:block" ref={translatorRef}>
              <button
                onClick={() => setShowTranslator(!showTranslator)}
                className="flex items-center justify-center gap-2 px-4 py-2 h-9 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                title={translate("selectLanguage", "Seleccionar idioma")}
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">{language}</span>
              </button>

              {/* Language Dropdown */}
              {showTranslator && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-3 py-2">
                      {translate("selectLanguage", "Seleccionar idioma")}
                    </p>
                    {[
                      { code: "ES" as const, name: "Español", flag: "🇪🇸" },
                      { code: "EN" as const, name: "English", flag: "🇬🇧" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          // Cambiar idioma (el contexto maneja i18n y localStorage)
                          if (setLanguage) setLanguage(lang.code);
                          setShowTranslator(false);
                          toast.success(
                            `${translate(
                              "languageChangedTo",
                              "Idioma cambiado a"
                            )} ${lang.name}`
                          );
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm ${
                          language === lang.code
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {language === lang.code && (
                          <span className="ml-auto text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center justify-center gap-2 px-2 md:px-3 py-2 h-9 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-all"
                >
                  <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-700 hidden lg:inline whitespace-nowrap truncate max-w-[150px]">
                    {user.email || translate("userArkia", "Usuario ARKIA")}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400 hidden md:inline flex-shrink-0" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                          {user.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="text-sm truncate">
                            {user.email ||
                              translate("userArkia", "Usuario ARKIA")}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.role || "Usuario"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          toast.info(translate("profile", "Mi perfil"));
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700"
                      >
                        <UserCircle className="w-4 h-4" />
                        <span>{translate("profile", "Mi perfil")}</span>
                      </button>
                      <button
                        onClick={() => {
                          toast.info(translate("settings", "Configuración"));
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-700"
                      >
                        <Settings className="w-4 h-4" />
                        <span>{translate("settings", "Configuración")}</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-red-50 text-sm text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{translate("logout", "Cerrar sesión")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                className={`p-1.5 rounded ${
                  canGoBack
                    ? "hover:bg-gray-100"
                    : "opacity-30 cursor-not-allowed"
                }`}
                title={translate("back", "Volver")}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={goForward}
                disabled={!canGoForward}
                className={`p-1.5 rounded ${
                  canGoForward
                    ? "hover:bg-gray-100"
                    : "opacity-30 cursor-not-allowed"
                }`}
                title={translate("forward", "Avanzar")}
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Breadcrumb */}
      <div className="px-3 md:px-6 py-2.5 md:py-1.5 bg-gray-50 border-t border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap min-w-max">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-blue-600 transition-colors leading-tight"
          >
            ARKIA
          </button>

          {pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            const label = getBreadcrumbLabel(segment);

            return (
              <Fragment key={url}>
                <ChevronRightIcon className="w-3 md:w-4 h-3 md:h-4 text-gray-400 flex-shrink-0" />
                {isLast ? (
                  <span className="text-gray-900 font-medium leading-tight">
                    {label}
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(url)}
                    className="text-gray-600 hover:text-blue-600 transition-colors leading-tight"
                  >
                    {label}
                  </button>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={showMobileNav}
        onClose={() => setShowMobileNav(false)}
      />

      {/* AI Assistant Panel */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />
    </header>
  );
}
