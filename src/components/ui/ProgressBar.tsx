import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showNumbers?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  label, 
  showNumbers = true,
  className = '',
  size = 'md'
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header con label y números */}
      {(label || showNumbers) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showNumbers && (
            <span className="text-sm text-gray-500">
              {current} de {total}
            </span>
          )}
        </div>
      )}
      
      {/* Barra de progreso */}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className="bg-blue-600 rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${percentage}%`,
            height: '100%'
          }}
        />
      </div>
      
      {/* Porcentaje */}
      <div className="mt-1 text-right">
        <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;