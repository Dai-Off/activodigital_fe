import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/theme.css";
import "./styles/custom.css";
import "./styles/tw-animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importaciones de páginas del rediseño
import { Inicio } from "./app/pages/Inicio";
import { PlataformaEdificios } from "./app/pages/PlataformaEdificios";
import { PlataformaUnidades } from "./app/pages/PlataformaUnidades";
import { PlataformaUsuarios } from "./app/pages/PlataformaUsuarios";
import { PlataformaCalendario } from "./app/pages/PlataformaCalendario";
import { PlataformaAnalytics } from "./app/pages/PlataformaAnalytics";
import { PlataformaReporting } from "./app/pages/PlataformaReporting";
import { ActivoInformacion } from "./app/pages/ActivoInformacion";
import { ActivoGestionDiaria } from "./app/pages/ActivoGestionDiaria";
import { ActivoFinanciero } from "./app/pages/ActivoFinanciero";
import { ActivoSeguros } from "./app/pages/ActivoSeguros";
import { ActivoCalendario } from "./app/pages/ActivoCalendario";
import { ActivoRentas } from "./app/pages/ActivoRentas";
import { ActivoEnergia } from "./app/pages/ActivoEnergia";
import { ActivoMantenimiento } from "./app/pages/ActivoMantenimiento";
import { SolucionesAuditoria } from "./app/pages/SolucionesAuditoria";
import { AuditoriaTecnica } from "./app/pages/AuditoriaTecnica";
import { AuditoriaFinanciera } from "./app/pages/AuditoriaFinanciera";
import { SolucionesGestion } from "./app/pages/SolucionesGestion";
import { GestionContratos } from "./app/pages/GestionContratos";
import { GestionMantenimiento } from "./app/pages/GestionMantenimiento";
import { IAFinanciero } from "./app/pages/IAFinanciero";
import { IATecnico } from "./app/pages/IATecnico";
import { IAFinanciacionVerde } from "./app/pages/IAFinanciacionVerde";
import { Contacto } from "./app/pages/Contacto";
import { BottomNav } from "./app/components/BottomNav";
import { NavigationLayout } from "./app/components/NavigationLayout";

export default function LandingRedesignApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Derivar currentPage desde react-router
  const basePath = "/landing-redesign";

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
      navigate(basePath);
    } else {
      navigate(`${basePath}/${page}`);
    }
  };

  return (
    <div className="landing-redesign min-h-screen relative font-sans text-foreground">
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
        <Route path="/plataforma-calendario" element={<PlataformaCalendario />} />
        <Route path="/plataforma-informes" element={<PlataformaReporting />} />
        
        {/* Activo (subcategorías de Gestión de Activos) */}
        <Route path="/activo-informacion" element={<ActivoInformacion />} />
        <Route path="/activo-gestion-diaria" element={<ActivoGestionDiaria />} />
        <Route path="/activo-financiero" element={<ActivoFinanciero />} />
        <Route path="/activo-seguros" element={<ActivoSeguros />} />
        <Route path="/activo-calendario" element={<ActivoCalendario />} />
        <Route path="/activo-rentas" element={<ActivoRentas />} />
        <Route path="/activo-energia" element={<ActivoEnergia />} />
        <Route path="/activo-mantenimiento" element={<ActivoMantenimiento />} />
        
        {/* Auditorías */}
        <Route path="/auditorias" element={<SolucionesAuditoria />} />
        <Route path="/auditoria-regulatoria" element={<SolucionesAuditoria />} />
        <Route path="/auditoria-tecnica" element={<AuditoriaTecnica />} />
        <Route path="/auditoria-financiera" element={<AuditoriaFinanciera />} />
        
        {/* Gestión */}
        <Route path="/gestion" element={<SolucionesGestion />} />
        <Route path="/gestion-financiera" element={<SolucionesGestion />} />
        <Route path="/gestion-contratos" element={<GestionContratos />} />
        <Route path="/gestion-mantenimiento" element={<GestionMantenimiento />} />
        
        {/* IA */}
        <Route path="/ia" element={<PlataformaAnalytics />} />
        <Route path="/ia-energetico" element={<PlataformaAnalytics />} />
        <Route path="/ia-financiero" element={<IAFinanciero />} />
        <Route path="/ia-tecnico" element={<IATecnico />} />
        <Route path="/ia-financiacion" element={<IAFinanciacionVerde />} />
        
        {/* Contacto */}
        <Route path="/contacto" element={<Contacto />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/landing-redesign" replace />} />
      </Routes>

      {/* Compartir el contenedor de navegación del bottom */}
      {currentPage === "inicio" ? (
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
      ) : (
        <NavigationLayout currentPage={currentPage} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
