import { Route } from "react-router-dom";
import { AssetsDashboard } from "~/components/dashboard/AssetsDashboard";
import { ActividadReciente } from "~/components/dashboard/Inicio/RecentActivity";
import { Estadisticas } from "~/components/dashboard/Inicio/Statistics";
import { PanelPrincipal } from "~/components/dashboard/Inicio/MainPanel";
import ErrorBoundary from "~/components/ErrorBoundary";
import ProtectedRoute from "~/components/ProtectedRoute";

export const AppRouter = () => {
  return (
    /* Rutas Dashboard */
    <Route
      path="Dashboard"
      element={
        <ProtectedRoute>
          <ErrorBoundary>
            <AssetsDashboard></AssetsDashboard>
          </ErrorBoundary>
        </ProtectedRoute>
      }
    >
      <Route index element={<PanelPrincipal></PanelPrincipal>}></Route>
      <Route
        path="Estadisticas"
        element={<Estadisticas></Estadisticas>}
      ></Route>
      <Route
        path="Actividad"
        element={<ActividadReciente></ActividadReciente>}
      ></Route>
    </Route>
  );
};
