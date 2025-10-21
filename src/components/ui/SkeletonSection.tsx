import React from 'react';

interface SkeletonSectionProps {
  title: string;
  description: string;
  isCompleted?: boolean;
}

const SkeletonSection: React.FC<SkeletonSectionProps> = ({ title, description, isCompleted = false }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Icono skeleton */}
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isCompleted ? 'bg-green-100' : 'bg-gray-100 animate-pulse'
        }`}>
          {isCompleted ? (
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          )}
        </div>
      </div>

      {/* Contenido skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium truncate ${
              isCompleted ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {title}
            </h3>
            <p className={`text-xs mt-1 truncate ${
              isCompleted ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {description}
            </p>
          </div>
          
          {/* Estado skeleton */}
          <div className="flex-shrink-0 ml-4">
            {isCompleted ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completada
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Actualizando...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonSection;
