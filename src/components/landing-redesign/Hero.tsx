import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section id="inicio" ref={ref} className="relative h-screen w-full overflow-hidden snap-start">
      {/* Full-screen Background Image with Parallax */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </motion.div>

      {/* Logo Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-12 left-12 z-20"
      >
        <div className="text-white text-3xl font-bold tracking-tighter">
          ARKIA
        </div>
        <div className="text-white/60 text-xs uppercase tracking-[0.3em] mt-1">
          Asset Intelligence
        </div>
      </motion.div>

      {/* Centered Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-center max-w-6xl"
        >
          {/* Main Heading */}
          <h1 className="text-white text-7xl md:text-[10rem] font-light mb-8 tracking-tighter leading-[0.9]">
            Inteligencia
            <br />
            <span className="font-semibold">Artificial</span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-white/90 text-xl md:text-3xl font-light tracking-wide"
          >
            para la Gestión de Activos Inmobiliarios
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}