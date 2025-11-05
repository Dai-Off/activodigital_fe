/**
 * Componente de Recomendación Final
 * Muestra la recomendación principal y detalles del análisis
 */

import { CheckCircle, TrendingUp, AlertCircle, Euro, Calendar, Target, Clock, FileText, Settings, Wrench, Check } from 'lucide-react';
import type { FinancialAnalysisRecommendation, ActionItem } from '../../../types/financialAnalysis';

interface Props {
  recommendation: FinancialAnalysisRecommendation;
}

export function FinancialAnalysisRecommendationComponent({ recommendation }: Props) {
  const { type, confidence, reasoning, actionItems, financialImpact, timeline } = recommendation;

  const getRecommendationConfig = () => {
    switch (type) {
      case 'mantener':
        return {
          title: 'Mantener',
          icon: CheckCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          badgeColor: 'bg-green-50 text-green-800 border-green-200',
          description: 'El activo muestra métricas sólidas y genera valor consistente',
        };
      case 'mejorar':
        return {
          title: 'Mejorar',
          icon: TrendingUp,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          description: 'Oportunidades significativas de incremento de valor mediante inversión',
        };
      case 'vender':
        return {
          title: 'Vender',
          icon: AlertCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          badgeColor: 'bg-red-50 text-red-800 border-red-200',
          description: 'Recomendado desinvertir y reasignar capital a mejores oportunidades',
        };
    }
  };

  const config = getRecommendationConfig();
  const Icon = config.icon;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'media':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'baja':
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getCategoryIcon = (category: ActionItem['category']) => {
    switch (category) {
      case 'financiero':
        return <Euro className="w-4 h-4 text-blue-600" />;
      case 'operacional':
        return <Settings className="w-4 h-4 text-blue-600" />;
      case 'técnico':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'legal':
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Recomendación Principal - Mejorada */}
      <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 shadow-sm`}>
        <div className="flex items-start gap-4">
          <div className={`${config.badgeColor} p-4 rounded-xl border flex-shrink-0`}>
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#1E293B' }}>
                {config.title}
              </h2>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.badgeColor} border`}>
                Confianza: {confidence}%
              </span>
            </div>
            
            <p className="mb-4 text-sm leading-relaxed" style={{ color: '#64748B' }}>{config.description}</p>
            
            {/* Reasoning - Mejorado */}
            <div className="bg-white rounded-lg p-4 border" style={{ borderColor: 'rgba(91, 141, 239, 0.08)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#1E293B' }}>Análisis Detallado:</p>
              <ul className="space-y-2">
                {reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm" style={{ color: '#64748B' }}>
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Impacto Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl shadow-sm p-4" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Euro className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-medium" style={{ color: '#64748B' }}>Valor Actual</p>
          </div>
          <p className="text-xl font-bold" style={{ color: '#1E293B' }}>
            {formatCurrency(financialImpact.currentValue)}
          </p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-4" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-medium" style={{ color: '#64748B' }}>Valor Proyectado</p>
          </div>
          <p className="text-xl font-bold" style={{ color: '#1E293B' }}>
            {formatCurrency(financialImpact.projectedValue)}
          </p>
          <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
            +{((financialImpact.projectedValue - financialImpact.currentValue) / financialImpact.currentValue * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-4" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-medium" style={{ color: '#64748B' }}>Retorno Esperado</p>
          </div>
          <p className="text-xl font-bold" style={{ color: '#1E293B' }}>
            {formatCurrency(financialImpact.expectedReturn)}
          </p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-4" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-medium" style={{ color: '#64748B' }}>Payback</p>
          </div>
          <p className="text-xl font-bold" style={{ color: '#1E293B' }}>
            {financialImpact.paybackPeriod} meses
          </p>
        </div>
      </div>

      {/* Plan de Acción */}
      <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>Plan de Acción</h3>
          <span className="text-sm" style={{ color: '#94A3B8' }}>Timeline: {timeline}</span>
        </div>
        
        <div className="space-y-3">
          {actionItems.map((action) => (
            <div
              key={action.id}
              className="border rounded-xl p-4 hover:shadow-sm transition-all duration-200"
              style={{ borderColor: 'rgba(91, 141, 239, 0.08)', backgroundColor: '#F8F9FD' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(action.category)}
                    <h4 className="font-medium" style={{ color: '#1E293B' }}>{action.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#64748B' }}>
                    {action.estimatedCost && (
                      <span className="flex items-center gap-1.5">
                        <Euro className="w-3.5 h-3.5 text-blue-600" />
                        {formatCurrency(action.estimatedCost)}
                      </span>
                    )}
                    {action.estimatedDuration && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {action.estimatedDuration}
                      </span>
                    )}
                    <span className="text-gray-400">•</span>
                    <span className="capitalize">{action.category}</span>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded text-xs font-medium border ${
                  action.status === 'completado' ? 'bg-green-50 text-green-800 border-green-200' :
                  action.status === 'en_progreso' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {action.status === 'completado' ? 'Completado' :
                   action.status === 'en_progreso' ? 'En Progreso' :
                   'Pendiente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

