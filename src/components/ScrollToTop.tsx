import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente que hace scroll al inicio de la página cuando cambia la ruta
 * Debe estar dentro del Router para funcionar correctamente
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hacer scroll al inicio cuando cambia la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Cambiar a "smooth" si prefieres animación
    });
  }, [pathname]);

  return null;
}

