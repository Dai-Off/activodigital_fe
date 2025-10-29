/**
 * Componente de Gráficos para Due Diligence
 * Visualiza scores, tendencias y distribución de riesgo
 */

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale, ArcElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Radar, Line, Doughnut } from 'react-chartjs-2';
import { AlertTriangle, Zap, Check } from 'lucide-react';
import type { ChartData } from '../../../types/dueDiligence';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  chartData: ChartData;
}

export function DueDiligenceCharts({ chartData }: Props) {
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          showLabelBackdrop: false,
          display: false,
          backdropColor: 'transparent',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
          lineWidth: 1,
          drawOnChartArea: true,
        },
        pointLabels: {
          color: '#64748B',
          font: {
            size: 12,
            weight: 500,
          },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
          lineWidth: 1,
        },
        angleLines: {
          color: 'rgba(148, 163, 184, 0.15)',
          lineWidth: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        padding: 12,
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(91, 141, 239, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Score: ${context.parsed.r}/100`;
          },
          title: function(context: any) {
            return context[0].label;
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          padding: 16,
          font: {
            size: 12,
            weight: 500,
          },
          color: '#64748B',
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        padding: 12,
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(91, 141, 239, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        titleFont: {
          size: 13,
          weight: 600,
        },
        bodyFont: {
          size: 12,
          weight: 500,
        },
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: €${context.parsed.y.toLocaleString('es-ES')}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
            weight: 500,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
            weight: 500,
          },
          callback: function(value: any) {
            return '€' + value.toLocaleString('es-ES');
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart - Scores por Categoría */}
      <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E293B' }}>Análisis por Categoría</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          <div className="w-full max-w-[280px]">
            <Radar data={chartData.scoreRadar} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* Line Chart - Tendencia Financiera */}
      <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1E293B' }}>Tendencia Financiera</h3>
        <div className="h-[300px]">
          <Line data={chartData.financialTrend} options={lineOptions} />
        </div>
      </div>

      {/* Distribución de Riesgo - Rediseñada Minimalista */}
      <div className="lg:col-span-2">
        <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
          <h3 className="text-sm font-semibold mb-6 uppercase tracking-wider" style={{ color: '#1E293B' }}>Análisis de Riesgos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {chartData.riskDistribution.labels.map((label, index) => {
              const value = chartData.riskDistribution.datasets[0].data[index];
              
              // Determinar nivel de riesgo con colores sutiles
              const getRiskLevel = (val: number) => {
                if (val >= 70) return { 
                  text: 'Alto', 
                  color: 'text-gray-900', 
                  bg: 'bg-gray-50', 
                  border: 'border-gray-200',
                  barColor: 'bg-blue-600',
                  Icon: AlertTriangle,
                  message: 'Requiere atención'
                };
                if (val >= 40) return { 
                  text: 'Medio', 
                  color: 'text-gray-700', 
                  bg: 'bg-gray-50', 
                  border: 'border-gray-200',
                  barColor: 'bg-blue-600',
                  Icon: Zap,
                  message: 'Monitoreo recomendado'
                };
                return { 
                  text: 'Bajo', 
                  color: 'text-gray-600', 
                  bg: 'bg-gray-50', 
                  border: 'border-gray-200',
                  barColor: 'bg-blue-600',
                  Icon: Check,
                  message: 'Nivel aceptable'
                };
              };
              
              const riskLevel = getRiskLevel(value);
              
              return (
                <div 
                  key={label} 
                  className="rounded-xl p-5 hover:shadow-sm transition-all duration-200 border"
                  style={{ backgroundColor: '#F8F9FD', borderColor: 'rgba(91, 141, 239, 0.08)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1" style={{ color: '#1E293B' }}>{label}</p>
                      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                        Riesgo {riskLevel.text}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center" style={{ borderColor: 'rgba(91, 141, 239, 0.08)' }}>
                      <span className="text-lg font-bold" style={{ color: '#1E293B' }}>
                        {Math.round(value)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Barra de progreso minimalista */}
                  <div className="space-y-2">
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E0EDFF' }}>
                      <div 
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#64748B' }}>
                      {(() => {
                        const IconComponent = riskLevel.Icon;
                        return <IconComponent className="w-3.5 h-3.5 text-blue-600" />;
                      })()}
                      {riskLevel.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

