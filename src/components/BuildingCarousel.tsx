import React, { useState, useEffect } from "react";

export const BuildingCarousel: React.FC<{ images?: string[]; name: string }> = ({ images = [], name }) => {
  const fallback = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80';
  const validImages = images.length > 0 ? images : [fallback];
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered || validImages.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % validImages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [hovered, validImages.length]);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <div
      className="w-full h-full min-h-[224px] flex items-stretch justify-center bg-gray-900 rounded-l-2xl overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={validImages[current]} alt={name} className="object-cover w-full h-full transition-all duration-500" />
      {validImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {validImages.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${idx === current ? "bg-white w-6" : "bg-white/60 w-1.5"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
