import React from 'react';

interface RatingCircleProps {
  rating: string;
  size?: 'sm' | 'md' | 'lg';
  showLetter?: boolean;
}

const ratingColors: Record<string, string> = {
  'A': 'bg-[#00B050]',  // Verde
  'B': 'bg-[#92D050]',  // Verde claro
  'C': 'bg-[#FFC000]',  // Amarillo
  'D': 'bg-[#FF6600]',  // Naranja
  'E': 'bg-[#FF0000]',  // Rojo
  'F': 'bg-[#C00000]',  // Rojo oscuro
  'G': 'bg-[#7F7F7F]',  // Gris
};

export const RatingCircle: React.FC<RatingCircleProps> = ({ rating, size = 'md', showLetter = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div 
      className={`${ratingColors[rating] || 'bg-gray-300'} ${
        sizeClasses[size]
      } rounded-full flex items-center justify-center text-white font-bold`}
    >
      {showLetter ? rating : null}
    </div>
  );
};

export const RatingStars: React.FC<{ stars: number }> = ({ stars }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i <= stars ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};
