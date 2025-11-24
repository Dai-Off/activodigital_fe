import { useLocation } from "react-router-dom";
<<<<<<< HEAD
import { SidebarDashboard } from "./SidebarDashboard";
import SidebarUsers from "./SidebarUsers";
=======
import { DashboardComponent } from "./DashboardComponent";
import { AssetsComponent } from "./AssetsComponent";
>>>>>>> feature/dashboard-inicio

export function SecondaryNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const segments = currentPath.substring(1).split("/");
  const pathName = segments[0].toLowerCase();

  /* Objeto en donde se colocará el componente que quieres que se cargue en el 
      Sidebar secundario según la ruta ejem: nombreRuta: <TuComponente/>
  */
  const components: any = {
<<<<<<< HEAD
    dashboard: <SidebarDashboard />,
    users: <SidebarUsers />,
=======
    dashboard: <DashboardComponent />,
    activos: <AssetsComponent />,
>>>>>>> feature/dashboard-inicio
  };

  return (
    <div className="hidden lg:block fixed lg:left-16 top-[88px] lg:w-64 md:w-48 h-[calc(100vh-88px)] bg-white border-r border-gray-200 overflow-y-auto shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <nav className="py-4">{components[pathName]}</nav>
    </div>
  );
}
