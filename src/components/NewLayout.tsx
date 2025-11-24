import React from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import {
  NavigationProvider,
  useNavigation,
} from "../contexts/NavigationContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Sidebar } from "./navigation/Sidebar";
import { AppHeader } from "./navigation/AppHeader";
import { SecondaryNav } from "./navigation/SecondaryNav";
import { AssetsDashboard } from "./dashboard/AssetsDashboard";
import AssetsList from "./AssetsList";
import ErrorBoundary from "./ErrorBoundary";

function NewLayoutContent() {
  const location = useLocation();
  const params = useParams<{ id?: string }>();

  // Intentar obtener navegación, con valores por defecto si falla
  let activeModule = "inicio";
  let activeSection = "dashboard";
  let selectedBuildingId: string | null = null;
  let setSelectedBuildingId: ((id: string | null) => void) | null = null;
  let setActiveModule: ((module: string) => void) | null = null;

  try {
    const navigation = useNavigation();
    if (navigation) {
      activeModule = navigation.activeModule;
      activeSection = navigation.activeSection;
      selectedBuildingId = navigation.selectedBuildingId;
      setSelectedBuildingId = navigation.setSelectedBuildingId;
      setActiveModule = navigation.setActiveModule;
    }
  } catch (error) {
    console.error("Error en useNavigation:", error);
    // Valores por defecto ya establecidos arriba
  }

  // Detectar si estamos en una ruta de detalle de edificio
  const isBuildingDetail =
    location.pathname.startsWith("/edificio/") && params.id;

  // Sincronizar selectedBuildingId y activeModule con la URL
  React.useEffect(() => {
    // Si estamos en una ruta de edificio o relacionada, establecer el módulo activo
    const isBuildingRelatedPath = 
      location.pathname.startsWith("/edificio/") || 
      location.pathname.startsWith("/libro-digital") ||
      location.pathname.startsWith("/cfo-intake") ||
      location.pathname === "/activos";
    
    if (isBuildingRelatedPath && setActiveModule) {
      if (activeModule !== "edificios") {
        setActiveModule("edificios");
      }
    }
    
    if (setSelectedBuildingId) {
      // Extraer buildingId de diferentes tipos de rutas
      let buildingIdFromPath: string | null = null;
      
      if (isBuildingDetail && params.id) {
        buildingIdFromPath = params.id;
      } else if (location.pathname.startsWith("/libro-digital/hub/")) {
        // Ruta: /libro-digital/hub/:buildingId
        const match = location.pathname.match(/\/libro-digital\/hub\/([^/]+)/);
        buildingIdFromPath = match ? match[1] : null;
      } else if (location.pathname.startsWith("/libro-digital/section/")) {
        // Ruta: /libro-digital/section/:buildingId/:sectionId
        const match = location.pathname.match(/\/libro-digital\/section\/([^/]+)/);
        buildingIdFromPath = match ? match[1] : null;
      } else if (location.pathname.startsWith("/cfo-intake/")) {
        // Ruta: /cfo-intake/:buildingId
        const match = location.pathname.match(/\/cfo-intake\/([^/]+)/);
        buildingIdFromPath = match ? match[1] : null;
      }
      
      if (buildingIdFromPath && selectedBuildingId !== buildingIdFromPath) {
        setSelectedBuildingId(buildingIdFromPath);
      } else if (!buildingIdFromPath && selectedBuildingId && !isBuildingRelatedPath) {
        // Si salimos de todas las rutas relacionadas con edificios, limpiar el ID seleccionado
        setSelectedBuildingId(null);
      }
    }
  }, [
    isBuildingDetail,
    params.id,
    selectedBuildingId,
    setSelectedBuildingId,
    setActiveModule,
    activeModule,
    location.pathname,
  ]);

  // Determinar qué mostrar según el estado de navegación
  const renderContent = () => {
    // Si estamos en una ruta específica que necesita su propio componente, usar Outlet
    if (
      location.pathname.startsWith("/libro-digital") ||
      location.pathname.startsWith("/cfo-") ||
      location.pathname.startsWith("/edificios/crear") ||
      location.pathname.startsWith("/mantenimiento") ||
      location.pathname.startsWith("/cumplimiento") ||
      (location.pathname.startsWith("/edificio/") &&
        (location.pathname.includes("/unidades") ||
          location.pathname.includes("/documentacion")))
    ) {
      return <Outlet />;
    }

    // Si estamos en /edificio/:id (vista detalle), mostrar BuildingDetail
    if (isBuildingDetail) {
      return <Outlet />;
    }

    // Si estamos en /activos o ruta raíz de activos
    if (
      location.pathname === "/activos" ||
      location.pathname === "/cfo-dashboard"
    ) {
      // Si estamos en modo dashboard, mostrar AssetsDashboard
      if (activeSection === "dashboard") {
        return <AssetsDashboard />;
      }
      // Si estamos en modo lista, mostrar AssetsList
      return <AssetsList />;
    }

    // Por defecto, usar Outlet para otras rutas
    return <Outlet />;
  };

  // Módulos que requieren menú secundario
  const modulesWithSecondaryNav = ["edificios", "inicio"];
  // Mostrar SecondaryNav siempre en el módulo de edificios, incluso en detalle
  // También mostrar si estamos en una ruta de edificio (por si activeModule no está sincronizado)
  // Incluir rutas relacionadas con edificios: libro-digital, cfo-intake, etc.
  const isBuildingRelatedRoute = 
    location.pathname.startsWith("/edificio/") || 
    location.pathname.startsWith("/libro-digital") ||
    location.pathname.startsWith("/cfo-intake") ||
    location.pathname === "/activos";
  
  const showSecondaryNav = modulesWithSecondaryNav.includes(activeModule) || 
    isBuildingRelatedRoute;

  // La sidebar SIEMPRE debe renderizarse, sin condiciones
  console.log('NewLayout renderizando, ruta:', location.pathname, 'showSecondaryNav:', showSecondaryNav);
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50" style={{ overflowX: 'visible', position: 'relative' }}>
        {/* Sidebar SIEMPRE visible - FUERA del contenedor para evitar overflow */}
        <Sidebar />
        
        {/* SecondaryNav condicional */}
        {showSecondaryNav && (
          <ErrorBoundary>
            <SecondaryNav />
          </ErrorBoundary>
        )}

        {/* Contenido principal con margen para la sidebar */}
        <div
          className={`
            ${showSecondaryNav ? "lg:ml-80" : "lg:ml-16 md:ml-16"} 
            ml-0
            relative
          `}
        >
          <ErrorBoundary>
            <AppHeader />
          </ErrorBoundary>

          <main
            className={`
              px-3 md:px-6 lg:px-8 
              py-3 md:py-4 
              max-w-[1400px] 
              pt-[140px] md:pt-[104px]
            `}
          >
            <ErrorBoundary>{renderContent()}</ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function NewLayout() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <NavigationProvider>
          <ErrorBoundary>
            <NewLayoutContent />
          </ErrorBoundary>
        </NavigationProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
