import { useLocation } from "react-router-dom";
import { SidebarDashboard } from "./SidebarDashboard";
import { SidebarAssets } from "./SidebarAssets";
import SidebarUsers from "./SidebarUsers";
import SidebarEvents from "./SideberEvents";

export function SecondaryNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const segments = currentPath.substring(1).split("/");
  const pathName = segments[0].toLowerCase();

  /* Objeto en donde se colocará el componente que quieres que se cargue en el 
      Sidebar secundario según la ruta ejem: nombreRuta: <TuComponente/>
  */
  const components: any = {
    dashboard: <SidebarDashboard />,
    assets: <SidebarAssets />,
    edificio: <SidebarAssets />, // Mostrar lista de activos también en rutas de edificio
    users: <SidebarUsers />,
    events: <SidebarEvents />
  };

  // Si estamos en una ruta de edificio o relacionada con edificios, mostrar AssetsComponent
  const isBuildingRoute =
    currentPath.startsWith("/building/") ||
    currentPath.startsWith("/digital-book") ||
    currentPath.startsWith("/cfo-intake");

  const componentToShow = isBuildingRoute ? (
    <SidebarAssets />
  ) : (
    components[pathName]
  );

  // AssetsComponent tiene su propio contenedor, así que no necesitamos el contenedor del SecondaryNav
  const isAssetsComponent = isBuildingRoute || pathName === "assets";

  if (isAssetsComponent) {
    // AssetsComponent se renderiza con su propio contenedor
    return componentToShow || null;
  }

  // Para otros componentes (como DashboardComponent), usar el contenedor del SecondaryNav
  // Oculto completamente en mobile (solo visible desde lg en adelante)
  return (
    <div className="hidden lg:block fixed lg:left-16 top-[88px] lg:w-64 h-[calc(100vh-88px)] bg-white border-r border-gray-200 overflow-y-auto shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <nav className="py-4">{componentToShow}</nav>
    </div>
  );
}
