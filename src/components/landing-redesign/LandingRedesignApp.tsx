import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/theme.css";
import "../../styles/custom.css";
import "../../styles/tw-animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importaciones de páginas del rediseño
import { Inicio } from "./pages/Inicio";
import { PlataformaEdificios } from "./pages/PlataformaEdificios";
import { PlataformaUnidades } from "./pages/PlataformaUnidades";
import { PlataformaUsuarios } from "./pages/PlataformaUsuarios";
import { PlataformaCalendario } from "./pages/PlataformaCalendario";
import { PlataformaAnalytics } from "./pages/PlataformaAnalytics";
import { PlataformaReporting } from "./pages/PlataformaReporting";
import { ActivoInformacion } from "./pages/ActivoInformacion";
import { ActivoGestionDiaria } from "./pages/ActivoGestionDiaria";
import { ActivoFinanciero } from "./pages/ActivoFinanciero";
import { ActivoSeguros } from "./pages/ActivoSeguros";
import { ActivoCalendario } from "./pages/ActivoCalendario";
import { ActivoRentas } from "./pages/ActivoRentas";
import { ActivoEnergia } from "./pages/ActivoEnergia";
import { ActivoMantenimiento } from "./pages/ActivoMantenimiento";
import { SolucionesAuditoria } from "./pages/SolucionesAuditoria";
import { AuditoriaTecnica } from "./pages/AuditoriaTecnica";
import { AuditoriaFinanciera } from "./pages/AuditoriaFinanciera";
import { SolucionesGestion } from "./pages/SolucionesGestion";
import { GestionContratos } from "./pages/GestionContratos";
import { GestionMantenimiento } from "./pages/GestionMantenimiento";
import { IAFinanciero } from "./pages/IAFinanciero";
import { IATecnico } from "./pages/IATecnico";
import { IAFinanciacionVerde } from "./pages/IAFinanciacionVerde";
import { Contacto } from "./pages/Contacto";
import { BottomNav } from "./BottomNav";
import { NavigationLayout } from "./NavigationLayout";

export default function LandingRedesignApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Derivar currentPage desde react-router
  const basePath = "";

  // Función para extraer el path actual como ID para la navegación
  const getCurrentPageFromUrl = () => {
    const path = location.pathname.replace(basePath, "");
    if (!path || path === "/" || path === "") return "inicio";

    // Convertir de /plataforma-edificios a plataforma-edificios
    return path.substring(1); // Quitar el leading slash
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPageFromUrl());

  // Sincronizar location con currentPage
  useEffect(() => {
    setCurrentPage(getCurrentPageFromUrl());
  }, [location.pathname]);

  // Manejar navegación desde componentes hijos
  const handlePageChange = (page: string) => {
    if (page === "inicio") {
      navigate("/");
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <div className="landing-redesign min-h-screen relative font-sans text-foreground bg-[#0a0a0a]">
      {/* 
        Persistent Video Background: 
        Moved from Inicio.tsx to avoid reloading on every navigation back to home.
        Its visibility is controlled by currentPage.
      */}
      <div 
        className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-500 ${
          currentPage === "inicio" ? "opacity-100" : "opacity-0 invisible"
        }`}
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
            poster="/heroBuilding.png"
          >
            <source src="/arkiaLandingVideo.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Capas oscuras para contraste (persistentes con el video) */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
      </div>

      {/* 
        Las rutas manejan el renderizado de la página en lugar del switch de App.tsx  
      */}
      <Routes>
        <Route path="/" element={<Inicio />} />

        {/* Plataforma */}
        <Route path="/plataforma" element={<PlataformaEdificios />} />
        <Route path="/plataforma-edificios" element={<PlataformaEdificios />} />
        <Route path="/plataforma-unidades" element={<PlataformaUnidades />} />
        <Route path="/plataforma-usuarios" element={<PlataformaUsuarios />} />
        <Route
          path="/plataforma-calendario"
          element={<PlataformaCalendario />}
        />
        <Route path="/plataforma-informes" element={<PlataformaReporting />} />

        {/* Activo (subcategorías de Gestión de Activos) */}
        <Route path="/activo-informacion" element={<ActivoInformacion />} />
        <Route
          path="/activo-gestion-diaria"
          element={<ActivoGestionDiaria />}
        />
        <Route path="/activo-financiero" element={<ActivoFinanciero />} />
        <Route path="/activo-seguros" element={<ActivoSeguros />} />
        <Route path="/activo-calendario" element={<ActivoCalendario />} />
        <Route path="/activo-rentas" element={<ActivoRentas />} />
        <Route path="/activo-energia" element={<ActivoEnergia />} />
        <Route path="/activo-mantenimiento" element={<ActivoMantenimiento />} />

        {/* Auditorías */}
        <Route path="/auditorias" element={<SolucionesAuditoria />} />
        <Route
          path="/auditoria-regulatoria"
          element={<SolucionesAuditoria />}
        />
        <Route path="/auditoria-tecnica" element={<AuditoriaTecnica />} />
        <Route path="/auditoria-financiera" element={<AuditoriaFinanciera />} />

        {/* Gestión */}
        <Route path="/gestion-landing" element={<SolucionesGestion />} />
        <Route path="/gestion-financiera" element={<SolucionesGestion />} />
        <Route path="/gestion-contratos" element={<GestionContratos />} />
        <Route
          path="/gestion-mantenimiento"
          element={<GestionMantenimiento />}
        />

        {/* IA */}
        <Route path="/ia" element={<PlataformaAnalytics />} />
        <Route path="/ia-energetico" element={<PlataformaAnalytics />} />
        <Route path="/ia-financiero" element={<IAFinanciero />} />
        <Route path="/ia-tecnico" element={<IATecnico />} />
        <Route path="/ia-financiacion" element={<IAFinanciacionVerde />} />

        {/* Contacto */}
        <Route path="/contacto" element={<Contacto />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Compartir el contenedor de navegación del bottom */}
      {currentPage === "inicio" ? (
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
      ) : (
        <NavigationLayout
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
