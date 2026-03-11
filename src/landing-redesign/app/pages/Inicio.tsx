import { motion } from "motion/react";
import arkiaLogo from "@/assets/ed148c592d76c633034c6d909cc9b5b1fc07449d.png";

export function Inicio() {
  return (
    <div className="h-screen overflow-hidden bg-white relative">
      {/* Hero Section */}
      <section className="relative h-full flex items-center justify-center bg-[#0a0a0a]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Video: Escalado para eliminar marcos negros completamente */}
          <div className="absolute inset-0 z-0 pointer-events-none">
             <iframe
               className="absolute top-1/2 left-1/2 min-w-[100vw] min-h-[100vh] w-[177.77vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2 scale-[1.5]"
               src="https://www.youtube.com/embed/JtedVugvanc?autoplay=1&mute=1&controls=0&loop=1&playlist=JtedVugvanc&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&vq=hd1080&playsinline=1"
               allow="autoplay; encrypted-media"
               title="Background Video"
             />
          </div>

          {/* Capa oscura para contraste */}
          <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 pointer-events-none" />
        </div>

        {/* Logo ARKIA - Real logo image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-8 left-8 z-50"
        >
          <img 
            src={arkiaLogo} 
            alt="ARKIA - Análisis Estructural Inteligente" 
            className="h-16 w-auto md:h-20 drop-shadow-[0_0_25px_rgba(14,165,233,0.3)]"
          />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-white mb-8">
              <span className="block text-xl md:text-2xl mb-3 text-white/80 font-light tracking-widest uppercase">Gestión Integral de</span>
              <span className="block text-4xl md:text-6xl font-medium tracking-tight">Edificios</span>
            </h1>

            <div className="w-16 h-[1px] bg-[#0ea5e9]/50 mx-auto mb-8"></div>

            <p className="text-white/80 text-base md:text-xl font-light tracking-wide max-w-xl mx-auto leading-relaxed">
              Plataforma unificada de auditoría técnica, financiera y regulatoria impulsada por <span className="text-[#0ea5e9]">Inteligencia Artificial</span>.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}