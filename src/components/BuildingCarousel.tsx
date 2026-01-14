import React, { useState, useEffect, useMemo } from "react";

export const BuildingCarousel: React.FC<{ images?: string[]; name: string }> = ({ images = [], name }) => {
  const fallback = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80';
  
  // Filtrar imágenes duplicadas y vacías, y agregar key única basada en la URL
  const validImages = useMemo(() => {
    if (images.length === 0) return [fallback];
    
    // Filtrar URLs vacías, null o undefined
    const filtered = images.filter((url) => url && url.trim() !== '');
    
    // Eliminar duplicados manteniendo el orden
    const unique = Array.from(new Set(filtered));
    
    return unique.length > 0 ? unique : [fallback];
  }, [images]);
  
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Resetear índice cuando cambian las imágenes
  useEffect(() => {
    setCurrent(0);
  }, [validImages.length]);

  useEffect(() => {
    if (!hovered || validImages.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % validImages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [hovered, validImages.length]);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  // Generar key única para la imagen basada en la URL y el índice
  const currentImageUrl = validImages[current];
  const imageKey = `${name}-${current}-${currentImageUrl?.substring(0, 50)}`;

  return (
    <div
      className="w-full h-full min-h-[224px] flex items-stretch justify-center bg-gray-900 rounded-l-2xl overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img 
        key={imageKey}
        src={currentImageUrl} 
        alt={`${name} - Imagen ${current + 1}`} 
        className="object-cover w-full h-full transition-all duration-500"
        loading="lazy"
      />
      {validImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {validImages.map((url, idx) => (
            <span
              key={`${name}-indicator-${idx}-${url?.substring(0, 20)}`}
              className={`h-1.5 rounded-full transition-all ${idx === current ? "bg-white w-6" : "bg-white/60 w-1.5"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
