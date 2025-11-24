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

  try {
    const navigation = useNavigation();
    if (navigation) {
      activeModule = navigation.activeModule;
      activeSection = navigation.activeSection;
      selectedBuildingId = navigation.selectedBuildingId;
      setSelectedBuildingId = navigation.setSelectedBuildingId;
    }
  } catch (error) {
    console.error("Error en useNavigation:", error);
    // Valores por defecto ya establecidos arriba
  }

  // Detectar si estamos en una ruta de detalle de edificio
  const isBuildingDetail =
    location.pathname.startsWith("/edificio/") && params.id;

  // Sincronizar selectedBuildingId con la URL
  React.useEffect(() => {
    if (setSelectedBuildingId) {
      if (isBuildingDetail && params.id && selectedBuildingId !== params.id) {
        setSelectedBuildingId(params.id);
      } else if (!isBuildingDetail && selectedBuildingId) {
        // Si salimos de la vista de detalle, limpiar el ID seleccionado
        // pero solo si no estamos navegando a otra ruta de edificio
        if (!location.pathname.startsWith("/edificio/")) {
          setSelectedBuildingId(null);
        }
      }
    }
  }, [
    isBuildingDetail,
    params.id,
    selectedBuildingId,
    setSelectedBuildingId,
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
  const modulesWithSecondaryNav = ["edificios", "inicio", "usuarios"];
  // Mostrar SecondaryNav siempre en el módulo de edificios, incluso en detalle
  const showSecondaryNav = modulesWithSecondaryNav.includes(activeModule);

  try {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <Sidebar />
          </ErrorBoundary>
          {showSecondaryNav && (
            <ErrorBoundary>
              <SecondaryNav />
            </ErrorBoundary>
          )}

          <div
            className={`
            ${showSecondaryNav ? "lg:ml-80" : "lg:ml-16 md:ml-16"} 
            ml-0
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
  } catch (error) {
    console.error("Error crítico en NewLayoutContent:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-2">
            Error al cargar la aplicación
          </h2>
          <p className="text-gray-600 mb-4">
            Por favor, recarga la página o contacta con soporte.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }
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
