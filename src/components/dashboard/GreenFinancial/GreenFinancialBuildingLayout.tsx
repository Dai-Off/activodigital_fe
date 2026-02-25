import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import useHeaderContext from "~/contexts/HeaderContext";

/**
 * Layout para las vistas de un edificio dentro de green-financial.
 * Sincroniza el buildingId de la URL con el contexto.
 */
export function GreenFinancialBuildingLayout() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const setSelectedBuildingId = useHeaderContext((s) => s.setSelectedBuildingId);

  useEffect(() => {
    setSelectedBuildingId(buildingId ?? null);
    return () => setSelectedBuildingId(null);
  }, [buildingId, setSelectedBuildingId]);

  return <Outlet />;
}
