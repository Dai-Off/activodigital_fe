/**
 * Dashboard Principal de Análisis Financiero para CFO
 * Orquesta todos los componentes y maneja el estado
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, AlertCircle, Loader2, Euro, Settings, Wrench, FileText, Plus } from 'lucide-react';

// Servicios
import { BuildingsApiService } from '../../../services/buildingsApi';
import { FinancialSnapshotsService } from '../../../services/financialSnapshots';
import { FinancialAnalysisService } from '../../../services/financialAnalysisService';

// Componentes
import { FinancialAnalysisMetrics } from '../financial-analysis/FinancialAnalysisMetrics';
import { FinancialAnalysisCharts } from '../financial-analysis/FinancialAnalysisCharts';
import { FinancialAnalysisRecommendationComponent } from '../financial-analysis/FinancialAnalysisRecommendation';

// Tipos
import type { FinancialAnalysis } from '../../../types/financialAnalysis';

export default function CFOFinancialAnalysisDashboard() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNoData, setHasNoData] = useState(false);
  const [buildingName, setBuildingName] = useState<string>('');

  useEffect(() => {
    loadAnalysis();
  }, [buildingId]);

  const loadAnalysis = async () => {
    if (!buildingId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Cargar datos del edificio
      const building = await BuildingsApiService.getBuildingById(buildingId);
      setBuildingName(building.name);

      // Cargar datos financieros
      let financialData = null;
      let noData = false;
      try {
        const snapshots = await FinancialSnapshotsService.getFinancialSnapshots(buildingId);
        if (snapshots && snapshots.length > 0) {
          financialData = snapshots[0];
          // Verificar si realmente tiene datos válidos
          const hasValidData = financialData.ingresos_brutos_anuales_eur > 0 || 
            financialData.opex_total_anual_eur > 0 ||
            financialData.walt_meses > 0;
          if (!hasValidData) {
            noData = true;
          }
        } else {
          noData = true;
        }
      } catch (err) {
        console.warn('No hay datos financieros disponibles:', err);
        noData = true;
      }

      if (noData) {
        setHasNoData(true);
        setAnalysis(null);
        setIsLoading(false);
        return;
      }

      setHasNoData(false);

      // Realizar análisis
      const analysisResult = await FinancialAnalysisService.analyzeBuilding(
        buildingId,
        building.name,
        financialData,
        building.price || 0
      );

      setAnalysis(analysisResult);
    } catch (err: any) {
      console.error('Error loading analysis:', err);
      setError(err.message || 'Error al cargar el análisis');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="font-medium" style={{ color: '#64748B' }}>Analizando activo...</p>
          <p className="text-sm mt-2" style={{ color: '#94A3B8' }}>Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  // Estado cuando no hay datos financieros
  if (hasNoData && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E0EDFF' }}>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#1E293B' }}>
                    {buildingName}
                  </h1>
                  <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                    Análisis Financiero
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estado vacío */}
          <div className="bg-white border rounded-xl shadow-sm p-8 sm:p-12 text-center" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#E0EDFF' }}>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: '#1E293B' }}>
                No hay datos financieros
              </h2>
              <p className="text-sm sm:text-base mb-6" style={{ color: '#64748B' }}>
                Para realizar un análisis financiero, primero necesitas cargar los datos financieros del activo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate(`/cfo-intake/${buildingId}`)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Cargar Datos Financieros
                </button>
                <button
                  onClick={() => navigate('/cfo-simulation')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Probar Simulación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[60vh]">
          <div className="bg-white border rounded-xl shadow-sm p-8 max-w-md text-center" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1E293B' }}>Error al cargar análisis</h2>
            <p className="mb-6" style={{ color: '#64748B' }}>{error || 'No se pudo completar el análisis'}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={loadAnalysis}
                className="px-4 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { scores, metrics, recommendation } = analysis;

  return (
    <div className="min-h-screen bg-gray-50 py-6 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header Mejorado */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E0EDFF' }}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl font-bold truncate" style={{ color: '#1E293B' }}>
                      {analysis.buildingName}
                    </h1>
                    <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: '#64748B' }}>
                      Análisis Financiero • {new Date(analysis.analysisDate).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Score General - Minimalista */}
              <div className="rounded-xl p-4 sm:p-5 border shadow-sm flex-shrink-0 w-full sm:w-auto" style={{ backgroundColor: '#F8F9FD', borderColor: 'rgba(91, 141, 239, 0.08)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3" style={{ color: '#64748B' }}>Score General</p>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-blue-600">
                    {scores.overall}
                  </span>
                  <span className="text-lg sm:text-xl" style={{ color: '#94A3B8' }}>/100</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold border text-blue-600" style={{ backgroundColor: '#E0EDFF', borderColor: 'rgba(91, 141, 239, 0.15)' }}>
                  {scores.overall >= 75 ? 'Excelente' : scores.overall >= 50 ? 'Aceptable' : 'Atención'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scores por Categoría - Compactos y Modernos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Financiero', value: scores.financial, Icon: Euro },
            { label: 'Operacional', value: scores.operational, Icon: Settings },
            { label: 'Técnico', value: scores.technical, Icon: Wrench },
            { label: 'Mercado', value: scores.market, Icon: TrendingUp },
          ].map((item) => (
            <div key={item.label} className="bg-white border rounded-xl p-3 sm:p-4 hover:shadow-md transition-all duration-200" style={{ borderColor: 'rgba(91, 141, 239, 0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E0EDFF' }}>
                  <item.Icon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border text-blue-600" style={{ backgroundColor: '#E0EDFF', borderColor: 'rgba(91, 141, 239, 0.15)' }}>
                  {item.value}
                </span>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>{item.label}</p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E0EDFF' }}>
                <div 
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Recomendación */}
        <div className="mb-6">
          <FinancialAnalysisRecommendationComponent recommendation={recommendation} />
        </div>

        {/* Métricas KPI */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Métricas Clave</h2>
          <FinancialAnalysisMetrics metrics={metrics} />
        </div>

        {/* Gráficos */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#1E293B' }}>Análisis Visual</h2>
          <FinancialAnalysisCharts chartData={analysis.chartData} />
        </div>

        {/* Botón de Regenerar Análisis */}
        <div className="flex justify-center mt-8">
          <button
            onClick={loadAnalysis}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors shadow-sm hover:bg-blue-700"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Regenerar Análisis</span>
          </button>
        </div>
      </div>
    </div>
  );
}

