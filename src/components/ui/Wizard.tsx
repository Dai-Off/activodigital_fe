import { useTranslation } from 'react-i18next';
import React from 'react';

interface WizardStep {
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}

const Wizard: React.FC<WizardProps> = ({ 
  steps, 
  currentStep, 
  children, 
  className = ''
}) => {
  const { t } = useTranslation();
  return (
    <div className={`w-full ${className}`}>
      {/* Header con pasos */}
      <div className="mb-4 md:mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || step.isCompleted;
              const isLast = index === steps.length - 1;

              return (
                <li key={index} className="relative flex-1">
                  {/* Línea conectora */}
                  {!isLast && (
                    <div 
                      className={`absolute top-3 md:top-4 left-1/2 w-full h-0.5 
                        ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`} 
                      style={{ left: '50%' }}
                    />
                  )}

                  {/* Step indicator */}
                  <div className="relative flex flex-col items-center group">
                    <div 
                      className={`
                        flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full border-2 
                        transition-colors duration-200 z-10 bg-white
                        ${isActive 
                          ? 'border-blue-600 text-blue-600' 
                          : isCompleted
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 text-gray-500'
                        }
                      `}
                    >
                      {isCompleted && !isActive ? (
                        <svg className="w-3 h-3 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path 
                            fillRule="evenodd" 
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      ) : (
                        <span className="text-xs md:text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* Step info */}
                    <div className="mt-1 md:mt-2 text-center">
                      <p 
                        className={`text-xs md:text-sm font-medium 
                          ${isActive ? 'text-blue-600' : 'text-gray-900'}`}
                      >
                        {t(step.title, step.title)}
                      </p>
                      {step.description && (
                        <p className="hidden md:block text-xs text-gray-500">{t(step.description, step.description)}</p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
      {/* Render children or other content below steps */}
      {children}
    </div>
  );
};

export default Wizard;