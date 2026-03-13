import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export interface SubItem {
  id: string;
  label: string;
  subItems?: SubItem[];
}

export interface NavItem {
  id: string;
  label: string;
  subItems?: SubItem[];
}

export const navItems: NavItem[] = [
  { id: "inicio", label: "Inicio" },
  {
    id: "plataforma",
    label: "Plataforma",
    subItems: [
      { 
        id: "plataforma-edificios", 
        label: "Gestión de Activos",
        subItems: [
          { id: "activo-informacion", label: "Información General" },
          { id: "activo-gestion-diaria", label: "Gestión Diaria (DMS)" },
          { id: "activo-financiero", label: "Financiero" },
          { id: "activo-seguros", label: "Seguros" },
          { id: "activo-calendario", label: "Calendario" },
          { id: "activo-rentas", label: "Rentas" },
          { id: "activo-energia", label: "Eficiencia Energética" },
          { id: "activo-mantenimiento", label: "Mantenimiento" },
        ]
      },
      { id: "plataforma-unidades", label: "Gestión de Unidades" },
      { id: "plataforma-usuarios", label: "Gestión de Usuarios" },
      { id: "plataforma-calendario", label: "Calendario" },
      { id: "plataforma-informes", label: "Informes" },
    ],
  },
  {
    id: "auditorias",
    label: "Auditorías",
    subItems: [
      { id: "auditoria-regulatoria", label: "Regulatoria EPBD" },
      { id: "auditoria-tecnica", label: "Técnica (Libro Edificio)" },
      { id: "auditoria-financiera", label: "Financiera con ROI" },
    ],
  },
  {
    id: "ia",
    label: "IA",
    subItems: [
      { id: "ia-energetico", label: "Análisis Energético" },
      { id: "ia-financiero", label: "Análisis Financiero" },
      { id: "ia-tecnico", label: "Análisis Técnico" },
      { id: "ia-financiacion", label: "Financiación Verde" },
    ],
  },
  { id: "contacto", label: "Contacto" },
];

interface BottomNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="md:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </motion.button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-x-0 bottom-0 max-h-[85vh] bg-[#171717] z-[160] rounded-t-2xl overflow-y-auto border-t border-white/10"
            >
              <div className="p-6 pt-4">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
                <div className="text-2xl font-light text-white mb-6">ARKIA</div>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <MobileNavItem
                      key={item.id}
                      item={item}
                      currentPage={currentPage}
                      onNavigate={(id) => { onPageChange(id); setMobileMenuOpen(false); }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Bottom Nav */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="hidden md:block fixed bottom-0 left-0 right-0 z-[100] bg-transparent border-t border-white/10"
      >
        <div className="max-w-[1600px] mx-auto px-12 flex items-center justify-between h-24">
          {navItems.map((item) => {
            const isActive = currentPage.startsWith(item.id);
            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => item.subItems && setHoveredItem(item.id)}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setHoveredSubItem(null);
                }}
              >
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`relative text-sm uppercase tracking-[0.2em] transition-colors duration-300 py-2 px-4 ${
                    isActive ? "text-[#0ea5e9] font-semibold" : "text-white/60 hover:text-[#0ea5e9]"
                  }`}
                >
                  {item.label}

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0ea5e9]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>

                {/* Submenu Level 1 */}
                <AnimatePresence>
                  {item.subItems && isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-6 z-[110]">
                      {/* El pb-6 crea un puente invisible para que el mouse no pierda el hover al subir */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl min-w-[260px] rounded-sm overflow-visible relative"
                      >
                        {item.subItems.map((subItem) => {
                          const isSubActive = currentPage === subItem.id || currentPage.startsWith(subItem.id);
                          const hasNestedItems = subItem.subItems && subItem.subItems.length > 0;
                          const isSubHovered = hoveredSubItem === subItem.id;
                          
                          return (
                            <div 
                              key={subItem.id}
                              className="relative group"
                              onMouseEnter={() => hasNestedItems && setHoveredSubItem(subItem.id)}
                              onMouseLeave={() => !hasNestedItems && setHoveredSubItem(null)} // Mantener si hay nested
                            >
                              <button
                                onClick={() => onPageChange(subItem.id)}
                                className={`w-full text-center px-6 py-4 text-sm transition-colors duration-200 border-b border-white/10 last:border-b-0 flex items-center justify-center relative ${
                                  isSubActive
                                    ? "bg-[#0ea5e9]/20 text-[#0ea5e9] border-l-2 border-l-[#0ea5e9]"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                <span>{subItem.label}</span>
                                {hasNestedItems && (
                                  <span className={`absolute right-4 transition-transform duration-200 text-[#0ea5e9] ${isSubHovered ? "rotate-90" : ""}`}>
                                    <ChevronRight size={14} />
                                  </span>
                                )}
                              </button>

                              {/* Submenu Level 2 (Inline Accordion) */}
                              <AnimatePresence>
                                {hasNestedItems && isSubHovered && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden bg-black/20"
                                  >
                                    {subItem.subItems!.map((nestedItem) => {
                                      const isNestedActive = currentPage === nestedItem.id;
                                      return (
                                        <button
                                          key={nestedItem.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onPageChange(nestedItem.id);
                                            setHoveredItem(null); 
                                          }}
                                          className={`w-full text-center px-6 py-3 text-xs uppercase tracking-wider transition-colors duration-200 border-b border-white/5 last:border-b-0 block ${
                                            isNestedActive
                                              ? "text-[#0ea5e9] font-semibold bg-[#0ea5e9]/10"
                                              : "text-white/60 hover:text-[#0ea5e9] hover:bg-white/5"
                                          }`}
                                        >
                                          {nestedItem.label}
                                        </button>
                                      );
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}

function MobileNavItem({ item, currentPage, onNavigate }: { item: NavItem | SubItem; currentPage: string; onNavigate: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.subItems && item.subItems.length > 0;
  const isActive = currentPage === item.id || currentPage.startsWith(item.id + "-");

  return (
    <div>
      <button
        className={`w-full flex items-center justify-between py-3 px-4 rounded-lg text-left ${
          isActive && !hasChildren ? "bg-[#0ea5e9] text-white" : "text-white/80"
        }`}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          else onNavigate(item.id);
        }}
      >
        <span className="text-base">{item.label}</span>
        {hasChildren && (
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
          />
        )}
      </button>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4 ml-4 border-l-2 border-[#0ea5e9]/30 space-y-1 mt-1"
          >
            {item.subItems!.map((sub) => (
              <MobileNavItem key={sub.id} item={sub} currentPage={currentPage} onNavigate={onNavigate} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}