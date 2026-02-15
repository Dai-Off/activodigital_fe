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
import ErrorBoundary from "./ErrorBoundary";
import { HeaderGreenFinancial } from "./navigation/HeaderGreenFinancial";

function NewLayoutContent() {
  const location = useLocation();
  const params = useParams<{ id?: string }>();

  // Intentar obtener navegación, con valores por defecto si falla
  let activeModule = "dashboard";
  let activeSection = "dashboard";
  let selectedBuildingId: string | null = null;
  let setSelectedBuildingId: ((id: string | null) => void) | null = null;
  let setActiveModule: ((module: string) => void) | null = null;
  let setActiveSection: ((section: string) => void) | null = null;

  try {
    const navigation = useNavigation();
    if (navigation) {
      activeModule = navigation.activeModule;
      activeSection = navigation.activeSection;
      selectedBuildingId = navigation.selectedBuildingId;
      setSelectedBuildingId = navigation.setSelectedBuildingId;
      setActiveModule = navigation.setActiveModule;
      setActiveSection = navigation.setActiveSection;
    }
  } catch (error) {
    console.error("Error en useNavigation:", error);
    // Valores por defecto ya establecidos arriba
  }

  // Detectar si estamos en una ruta de detalle de edificio
  const isBuildingDetail =
    location.pathname.startsWith("/building/") && params.id;

  // Sincronizar selectedBuildingId y activeModule con la URL
  React.useEffect(() => {
    // Si estamos en una ruta de edificio o relacionada, establecer el módulo activo
    const isBuildingRelatedPath =
      location.pathname.startsWith("/building/") ||
      location.pathname.startsWith("/digital-book") ||
      location.pathname.startsWith("/cfo-intake") ||
      location.pathname.startsWith("/cfo-due-diligence") ||
      location.pathname.startsWith("/cfo-simulation") ||
      location.pathname === "/assets";

    // if (isBuildingRelatedPath && setActiveModule) {
    //   if (activeModule !== "edificios") {
    //     setActiveModule("edificios");
    //   }
    // }

    if (setSelectedBuildingId) {
      // Extraer buildingId de diferentes tipos de rutas
      let buildingIdFromPath: string | null = null;

      if (isBuildingDetail && params.id) {
        buildingIdFromPath = params.id;
      } else if (location.pathname.startsWith("/digital-book/hub/")) {
        // Ruta: /digital-book/hub/:buildingId
        const match = location.pathname.match(/\/digital-book\/hub\/([^/]+)/);
        buildingIdFromPath = match ? match[1] : null;
      } else if (location.pathname.startsWith("/digital-book/section/")) {
        // Ruta: /digital-book/section/:buildingId/:sectionId
        const match = location.pathname.match(
          /\/digital-book\/section\/([^/]+)/,
        );
        buildingIdFromPath = match ? match[1] : null;
      } else if (location.pathname.startsWith("/cfo-intake/")) {
        // Ruta: /cfo-intake/:buildingId
        const match = location.pathname.match(/\/cfo-intake\/([^/]+)/);
        buildingIdFromPath = match ? match[1] : null;
      } else if (
        location.pathname.startsWith("/building/") &&
        location.pathname.includes("/analysis-general")
      ) {
        // Ruta: /building/:id/analysis-general
        const match = location.pathname.match(
          /\/building\/([^/]+)\/analysis-general/,
        );
        buildingIdFromPath = match ? match[1] : null;
      } else if (location.pathname.startsWith("/cfo-due-diligence/")) {
        // Ruta: /cfo-due-diligence/:buildingId
        const match = location.pathname.match(/\/cfo-due-diligence\/([^/]+)/);
        buildingIdFromPath = match ? match[1] : null;
      }

      if (buildingIdFromPath && selectedBuildingId !== buildingIdFromPath) {
        setSelectedBuildingId(buildingIdFromPath);
      } else if (
        !buildingIdFromPath &&
        selectedBuildingId &&
        !isBuildingRelatedPath
      ) {
        // Si salimos de todas las rutas relacionadas con edificios, limpiar el ID seleccionado
        setSelectedBuildingId(null);
      }
    }

    // Detectar y actualizar activeSection según la ruta
    if (setActiveSection) {
      if (location.pathname.includes("/analysis-general")) {
        if (activeSection !== "analisis") {
          setActiveSection("analisis");
        }
      } else if (location.pathname.includes("/general-view")) {
        // === NUEVA LÓGICA: Sincronizar la nueva vista ===
        if (activeSection !== "general-view") {
          setActiveSection("general-view");
        }
      } else if (location.pathname.includes("/gestion")) {
        // Ruta de gestión
        if (activeSection !== "gestion") {
          setActiveSection("gestion");
        }
      } else if (
        location.pathname.startsWith("/building/") &&
        !location.pathname.includes("/analysis-general") &&
        !location.pathname.includes("/units") &&
        !location.pathname.includes("/documents") &&
        !location.pathname.includes("/gestion")
      ) {
        // Ruta de detalle de edificio (vista general o general-view)
        // Ahora /building/:id redirige a /building/:id/general-view
        if (
          activeSection !== "general-view" &&
          location.pathname.includes("/general-view")
        ) {
          setActiveSection("general-view");
        } else if (
          activeSection !== "todos" &&
          !location.pathname.includes("/general-view")
        ) {
          // Mantener compatibilidad con otras rutas de building que no sean general-view
          setActiveSection("todos");
        }
      }
    }
  }, [
    isBuildingDetail,
    params.id,
    selectedBuildingId,
    setSelectedBuildingId,
    setActiveModule,
    setActiveSection,
    activeModule,
    activeSection,
    location.pathname,
  ]);

  // Determinar qué mostrar según el estado de navegación
  const renderContent = () => {
    // Si estamos en una ruta específica que necesita su propio componente, usar Outlet
    if (
      location.pathname.startsWith("/digital-book") ||
      location.pathname.startsWith("/cfo-intake") ||
      location.pathname.startsWith("/cfo-due-diligence") ||
      location.pathname.startsWith("/cfo-simulation") ||
      location.pathname.startsWith("/cfo-dashboard") ||
      location.pathname.startsWith("/users") ||
      location.pathname.startsWith("/events") ||
      location.pathname.startsWith("/buildings/crear") ||
      location.pathname.startsWith("/mantenimiento") ||
      location.pathname.startsWith("/cumplimiento") ||
      (location.pathname.startsWith("/building/") &&
        (location.pathname.includes("/unidades") ||
          location.pathname.includes("/documentacion") ||
          location.pathname.includes("/analysis-general")))
    ) {
      return <Outlet />;
    }

    // Si estamos en /building/:id (redirige a /building/:id/general-view), usar Outlet
    if (isBuildingDetail) {
      return <Outlet />;
    }

    // Por defecto, usar Outlet para todas las rutas (incluyendo /assets)
    // Esto permite que el router maneje qué componente renderizar
    return <Outlet />;
  };

  // Módulos que requieren menú secundario
  const modulesWithSecondaryNav = ["assets", "dashboard", "users", "events"];
  // Mostrar SecondaryNav siempre en el módulo de edificios, incluso en detalle
  // También mostrar si estamos en una ruta de edificio (por si activeModule no está sincronizado)
  // Incluir rutas relacionadas con edificios: digital-book, cfo-intake, etc.
  const isBuildingRelatedRoute =
    location.pathname.startsWith("/building/") ||
    location.pathname.startsWith("/digital-book") ||
    location.pathname.startsWith("/users") ||
    location.pathname.startsWith("/configuration") ||
    location.pathname.startsWith("/events") ||
    location.pathname.startsWith("/cfo-intake") ||
    location.pathname.startsWith("/cfo-due-diligence") ||
    location.pathname.startsWith("/cfo-simulation") ||
    location.pathname.startsWith("/cfo-dashboard") ||
    location.pathname === "/assets";

  const showSecondaryNav =
    modulesWithSecondaryNav.includes(activeModule) || isBuildingRelatedRoute;

  // La sidebar SIEMPRE debe renderizarse, sin condiciones
  console.log(
    "NewLayout renderizando, ruta:",
    location.pathname,
    "showSecondaryNav:",
    showSecondaryNav,
  );

  console.log(location.pathname);
  return (
    <ErrorBoundary>
      <div
        className="min-h-screen bg-gray-50"
        style={{ overflowX: "visible", position: "relative" }}
      >
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
            ml-0 md:ml-0
            relative
          `}
        >
          <ErrorBoundary>
            {location.pathname === "/green-financial" ||
            location.pathname === "/green-financial/financial-twin" ||
            location.pathname === "/green-financial/data-room" ? (
              <HeaderGreenFinancial />
            ) : (
              <AppHeader />
            )}
          </ErrorBoundary>

          <main
            className={
              location.pathname.startsWith("/green-financial")
                ? `
              px-3 md:px-6 lg:px-8 xl:px-12
              py-3 md:py-4 
              max-w-[1920px] mx-auto
            `
                : location.pathname === "/expired" ||
                    location.pathname.startsWith("/expired/")
                  ? `
              px-2 md:px-4 lg:px-6
              py-6 md:py-8
              max-w-none
              pt-[140px] md:pt-[104px]
            `
                  : `
              px-3 md:px-6 lg:px-8 xl:px-12
              py-3 md:py-4 
              max-w-[1920px] mx-auto
              mt-[100px] md:mt-[100px]
            `
            }
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
