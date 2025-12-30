import { createContext, useContext, useState, type ReactNode } from "react";

interface NavigationState {
  module: string;
  tab: string;
  section: string;
}

interface NavigationContextType {
  activeModule: string;
  setActiveModule: (module: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedBuildingId: string | null;
  setSelectedBuildingId: (id: string | null) => void;
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;
  viewMode: "list" | "detail";
  setViewMode: (mode: "list" | "detail") => void;
  navigationHistory: NavigationState[];
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeModule, setActiveModule] = useState(() => {
    const segments = location.pathname.substring(1).split("/");
    const firstSegment = segments[0];

    // Mapeo centralizado de rutas que pertenecen al módulo de activos
    const assetRelatedPaths = [
      "building",
      "assets",
      "digital-book",
      "cfo-intake",
      "cfo-due-diligence",
      "cfo-simulation",
    ];

    if (assetRelatedPaths.includes(firstSegment)) return "assets";
    return firstSegment || "dashboard";
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>(
    [{ module: "dashboard", tab: "dashboard", section: "dashboard" }]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSetActiveModule = (module: string) => {
    setActiveModule(module);
    addToHistory({ module, tab: activeTab, section: activeSection });
  };

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    addToHistory({ module: activeModule, tab, section: activeSection });
  };

  const handleSetActiveSection = (section: string) => {
    setActiveSection(section);
    addToHistory({ module: activeModule, tab: activeTab, section });
  };

  const addToHistory = (state: NavigationState) => {
    const newHistory = navigationHistory.slice(0, currentIndex + 1);
    newHistory.push(state);
    setNavigationHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const state = navigationHistory[newIndex];
      setCurrentIndex(newIndex);
      setActiveModule(state.module);
      setActiveTab(state.tab);
      setActiveSection(state.section);
    }
  };

  const goForward = () => {
    if (currentIndex < navigationHistory.length - 1) {
      const newIndex = currentIndex + 1;
      const state = navigationHistory[newIndex];
      setCurrentIndex(newIndex);
      setActiveModule(state.module);
      setActiveTab(state.tab);
      setActiveSection(state.section);
    }
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < navigationHistory.length - 1;

  return (
    <NavigationContext.Provider
      value={{
        activeModule,
        setActiveModule: handleSetActiveModule,
        activeTab,
        setActiveTab: handleSetActiveTab,
        activeSection,
        setActiveSection: handleSetActiveSection,
        selectedBuildingId,
        setSelectedBuildingId,
        selectedUnitId,
        setSelectedUnitId,
        viewMode,
        setViewMode,
        navigationHistory,
        canGoBack,
        canGoForward,
        goBack,
        goForward,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
