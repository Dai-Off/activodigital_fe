/**
 * Componente de Métricas KPI para Due Diligence
 * Muestra las métricas clave del análisis
 */

import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import type { DueDiligenceMetrics } from '../../../types/dueDiligence';

interface Props {
  metrics: DueDiligenceMetrics;
}

export function DueDiligenceMetrics({ metrics }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return '-';
    return `${value.toFixed(2)}%`;
  };

  const kpis = [
    {
      label: 'ROI Anual',
      value: metrics.roi !== null ? formatPercent(metrics.roi) : '-',
      icon: TrendingUp,
      trend: metrics.roi && metrics.roi > 5 ? 'up' : 'down',
      color: metrics.roi && metrics.roi > 5 ? 'green' : 'red',
    },
    {
      label: 'Cap Rate',
      value: metrics.capRate !== null ? formatPercent(metrics.capRate) : '-',
      icon: DollarSign,
      trend: metrics.capRate && metrics.capRate > 6 ? 'up' : 'neutral',
      color: metrics.capRate && metrics.capRate > 6 ? 'green' : 'yellow',
    },
    {
      label: 'NOI Anual',
      value: metrics.noi !== null ? formatCurrency(metrics.noi) : '-',
      icon: Activity,
      trend: metrics.noi && metrics.noi > 0 ? 'up' : 'down',
      color: metrics.noi && metrics.noi > 0 ? 'green' : 'red',
    },
    {
      label: 'DSCR',
      value: metrics.dscr !== null ? metrics.dscr.toFixed(2) : '-',
      icon: metrics.dscr && metrics.dscr < 1.15 ? AlertTriangle : Activity,
      trend: metrics.dscr && metrics.dscr > 1.25 ? 'up' : 'down',
      color: metrics.dscr && metrics.dscr > 1.25 ? 'green' : 'red',
    },
    {
      label: 'Ocupación',
      value: `${metrics.occupancyRate.toFixed(1)}%`,
      icon: TrendingUp,
      trend: metrics.occupancyRate > 85 ? 'up' : 'down',
      color: metrics.occupancyRate > 85 ? 'green' : 'yellow',
    },
    {
      label: 'OPEX Ratio',
      value: metrics.opexRatio !== null ? formatPercent(metrics.opexRatio) : '-',
      icon: metrics.opexRatio && metrics.opexRatio > 40 ? AlertTriangle : Activity,
      trend: metrics.opexRatio && metrics.opexRatio < 40 ? 'up' : 'down',
      color: metrics.opexRatio && metrics.opexRatio < 40 ? 'green' : 'red',
    },
  ];

  const getIconColor = () => {
    return 'text-blue-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200"
            style={{ borderColor: 'rgba(91, 141, 239, 0.08)' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>{kpi.label}</p>
                <p className="text-2xl font-bold" style={{ color: '#1E293B' }}>{kpi.value}</p>
              </div>
              <div className="p-2 rounded-lg border" style={{ backgroundColor: '#E0EDFF', borderColor: 'rgba(91, 141, 239, 0.15)' }}>
                <Icon className={`w-5 h-5 ${getIconColor()}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

