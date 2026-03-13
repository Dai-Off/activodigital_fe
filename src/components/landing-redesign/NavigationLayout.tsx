import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { navItems } from "./BottomNav";
import type { NavItem, SubItem } from "./BottomNav";

interface NavigationLayoutProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function NavigationLayout({ currentPage, onPageChange }: NavigationLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close menu when page changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPage]);

  // Si estamos en home, no mostramos nada (el BottomNav se encarga)
  if (currentPage === "inicio") return null;

  return (
    <>
      {/* 1. Botón Volver a Inicio (Superior Izquierda) */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-[200] w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-[#0ea5e9] hover:border-[#0ea5e9] transition-all duration-300 shadow-lg group"
        onClick={() => onPageChange("inicio")}
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
      </motion.button>

      {/* 2. Botón Menú Hamburguesa (Superior Derecha) */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`fixed top-4 right-4 md:top-8 md:right-8 z-[200] w-10 h-10 md:w-12 md:h-12 backdrop-blur-md border rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isMenuOpen 
            ? "bg-transparent border-transparent text-white" 
            : "bg-black/40 border-white/20 text-white hover:bg-[#0ea5e9] hover:border-[#0ea5e9]"
        }`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* 3. Overlay / Drawer de Navegación */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Panel Lateral Derecho */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#171717] z-[160] shadow-2xl overflow-y-auto border-l border-white/5"
            >
              <div className="p-6 pt-20 md:p-12 md:pt-24">
                <div className="mb-8 border-b border-white/10 pb-8">
                   <div className="text-3xl font-light text-white">ARKIA</div>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => (
                    <DrawerItem 
                      key={item.id} 
                      item={item} 
                      currentPage={currentPage} 
                      onNavigate={onPageChange} 
                    />
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/10">
                   <p className="text-xs text-white/40 leading-relaxed">
                     &copy; 2026 ARKIA Real Estate Intelligence.<br/>
                     Sistema de Gestión Integral para Fondos de Inversión.
                   </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Componente recursivo para los items del menú lateral
function DrawerItem({ item, currentPage, onNavigate }: { item: NavItem | SubItem, currentPage: string, onNavigate: (page: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.subItems && item.subItems.length > 0;
  const isActive = currentPage === item.id || currentPage.startsWith(item.id + "-");

  // Auto-expandir si un hijo está activo
  useEffect(() => {
    if (isActive && hasChildren) {
      setIsExpanded(true);
    }
  }, [isActive, hasChildren]);

  return (
    <div className="mb-1">
      <div 
        className={`group flex items-center justify-between py-3 px-4 rounded-lg cursor-pointer transition-colors ${
          isActive && !hasChildren ? "bg-[#0ea5e9] text-white shadow-md" : "hover:bg-white/10 text-white/80 hover:text-white"
        }`}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          } else {
            onNavigate(item.id);
          }
        }}
      >
        <span className={`text-lg ${isActive && !hasChildren ? "font-medium" : "font-light"}`}>
          {item.label}
        </span>
        {hasChildren && (
          <span className={`transition-colors text-white/40`}>
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-6 border-l-2 border-[#0ea5e9]/30 ml-4 space-y-1 mt-1"
          >
            {item.subItems!.map((subItem) => (
              <DrawerItem 
                key={subItem.id} 
                item={subItem} 
                currentPage={currentPage} 
                onNavigate={onNavigate} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}