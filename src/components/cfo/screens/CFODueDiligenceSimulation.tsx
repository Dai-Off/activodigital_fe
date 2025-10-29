/**
 * Simulación de Due Diligence
 * Permite al CFO probar diferentes escenarios sin guardar en BD
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { DueDiligenceService } from '../../../services/dueDiligenceAnalysis';
import type { FinancialSnapshot } from '../../../services/financialSnapshots';
import type { DueDiligenceAnalysis } from '../../../types/dueDiligence';

// Componentes de visualización
import { DueDiligenceMetrics } from '../due-diligence/DueDiligenceMetrics';
import { DueDiligenceCharts } from '../due-diligence/DueDiligenceCharts';
import { DueDiligenceRecommendationComponent } from '../due-diligence/DueDiligenceRecommendation';

interface SimulationData {
  // Valor del edificio (necesario para el análisis)
  buildingValue: number;
  buildingName: string;

  // 1. Precio & Mercado
  eur_m2_ref_p50?: number | null;
  dom_dias?: number | null;

  // 2. Ingresos
  ingresos_brutos_anuales_eur: number;
  otros_ingresos_anuales_eur?: number | null;
  walt_meses: number;
  concentracion_top1_pct_noi: number;
  indexacion_ok?: boolean | null;
  mora_pct_12m?: number | null;

  // 3. OPEX
  opex_total_anual_eur: number;
  opex_energia_anual_eur: number;
  opex_mantenimiento_anual_eur?: number | null;

  // 4. Documentación
  libro_edificio_estado: 'completo' | 'parcial' | 'faltante';
  ite_iee_estado: 'ok' | 'pendiente' | 'no_aplica';
  mantenimientos_criticos_ok: boolean;
  planos_estado?: 'ok' | 'faltante' | null;

  // 5. Deuda
  dscr?: number | null;
  penalidad_prepago_alta?: boolean | null;

  // 6. Rehabilitación
  capex_rehab_estimado_eur?: number | null;
  ahorro_energia_pct_estimado?: number | null;
}

export default function CFODueDiligenceSimulation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DueDiligenceAnalysis | null>(null);

  const [formData, setFormData] = useState<SimulationData>({
    buildingValue: 1500000,
    buildingName: 'Edificio Simulado',
    ingresos_brutos_anuales_eur: 0,
    walt_meses: 0,
    concentracion_top1_pct_noi: 0,
    opex_total_anual_eur: 0,
    opex_energia_anual_eur: 0,
    libro_edificio_estado: 'faltante',
    ite_iee_estado: 'no_aplica',
    mantenimientos_criticos_ok: false,
  });

  const sections = [
    { id: 1, name: 'Precio & Mercado' },
    { id: 2, name: 'Ingresos (últimos 12m)' },
    { id: 3, name: 'OPEX (últimos 12m)' },
    { id: 4, name: 'Documentación' },
    { id: 5, name: 'Deuda (si aplica)' },
    { id: 6, name: 'Rehabilitación' },
  ];

  const handleInputChange = (field: keyof SimulationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExecuteAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      // Convertir datos del formulario al formato FinancialSnapshot
      const financialData: FinancialSnapshot = {
        building_id: 'simulation',
        period_start: new Date().toISOString().split('T')[0],
        period_end: new Date().toISOString().split('T')[0],
        currency: 'EUR',
        ingresos_brutos_anuales_eur: formData.ingresos_brutos_anuales_eur,
        otros_ingresos_anuales_eur: formData.otros_ingresos_anuales_eur ?? null,
        walt_meses: formData.walt_meses,
        concentracion_top1_pct_noi: formData.concentracion_top1_pct_noi / 100,
        indexacion_ok: formData.indexacion_ok ?? null,
        mora_pct_12m: formData.mora_pct_12m ? formData.mora_pct_12m / 100 : null,
        opex_total_anual_eur: formData.opex_total_anual_eur,
        opex_energia_anual_eur: formData.opex_energia_anual_eur,
        opex_mantenimiento_anual_eur: formData.opex_mantenimiento_anual_eur ?? null,
        dscr: formData.dscr ?? null,
        penalidad_prepago_alta: formData.penalidad_prepago_alta ?? null,
        capex_rehab_estimado_eur: formData.capex_rehab_estimado_eur ?? null,
        ahorro_energia_pct_estimado: formData.ahorro_energia_pct_estimado ?? null,
        meta: {
          libro_edificio_estado: formData.libro_edificio_estado,
          ite_iee_estado: formData.ite_iee_estado,
          mantenimientos_criticos_ok: formData.mantenimientos_criticos_ok,
          planos_estado: formData.planos_estado ?? undefined,
          eur_m2_ref_p50: formData.eur_m2_ref_p50 ?? undefined,
          dom_dias: formData.dom_dias ?? undefined,
        },
      };

      // Ejecutar análisis
      const result = await DueDiligenceService.analyzeBuilding(
        'simulation',
        formData.buildingName,
        financialData,
        formData.buildingValue
      );

      setAnalysis(result);
    } catch (error) {
      console.error('Error ejecutando análisis:', error);
      alert('Error al ejecutar el análisis. Por favor, revisa los datos ingresados.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Edificio <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.buildingName}
                onChange={(e) => handleInputChange('buildingName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor del Edificio (€) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Valor estimado del activo para cálculos</p>
              <input
                type="number"
                min="0"
                value={formData.buildingValue || ''}
                onChange={(e) => handleInputChange('buildingValue', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de referencia por m² (Percentil 50)
              </label>
              <input
                type="number"
                min="0"
                value={formData.eur_m2_ref_p50 || ''}
                onChange={(e) => handleInputChange('eur_m2_ref_p50', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días en Mercado (DOM)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={formData.dom_dias || ''}
                onChange={(e) => handleInputChange('dom_dias', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingresos Brutos Anuales (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.ingresos_brutos_anuales_eur || ''}
                onChange={(e) => handleInputChange('ingresos_brutos_anuales_eur', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otros Ingresos Anuales (€)
              </label>
              <input
                type="number"
                min="0"
                value={formData.otros_ingresos_anuales_eur || ''}
                onChange={(e) => handleInputChange('otros_ingresos_anuales_eur', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WALT (meses) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.walt_meses || ''}
                onChange={(e) => handleInputChange('walt_meses', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concentración Top Inquilino (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.concentracion_top1_pct_noi || ''}
                onChange={(e) => handleInputChange('concentracion_top1_pct_noi', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.indexacion_ok || false}
                onChange={(e) => handleInputChange('indexacion_ok', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Cláusula de Indexación Activa
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Impagos 12m (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.mora_pct_12m || ''}
                onChange={(e) => handleInputChange('mora_pct_12m', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gastos Operativos Totales Anuales (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.opex_total_anual_eur || ''}
                onChange={(e) => handleInputChange('opex_total_anual_eur', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gastos Energéticos Anuales (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.opex_energia_anual_eur || ''}
                onChange={(e) => handleInputChange('opex_energia_anual_eur', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gastos de Mantenimiento Anuales (€)
              </label>
              <input
                type="number"
                min="0"
                value={formData.opex_mantenimiento_anual_eur || ''}
                onChange={(e) => handleInputChange('opex_mantenimiento_anual_eur', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Libro del Edificio <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.libro_edificio_estado}
                onChange={(e) => handleInputChange('libro_edificio_estado', e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="completo">Completo</option>
                <option value="parcial">Incompleto</option>
                <option value="faltante">No disponible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ITE/IEE Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.ite_iee_estado}
                onChange={(e) => handleInputChange('ite_iee_estado', e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="ok">Vigente y Aprobado</option>
                <option value="pendiente">Pendiente de Renovación</option>
                <option value="no_aplica">No Aplica</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.mantenimientos_criticos_ok || false}
                onChange={(e) => handleInputChange('mantenimientos_criticos_ok', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Mantenimientos Críticos al Día
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de Planos
              </label>
              <select
                value={formData.planos_estado || ''}
                onChange={(e) => handleInputChange('planos_estado', e.target.value || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar estado...</option>
                <option value="ok">Disponible</option>
                <option value="faltante">No Disponible</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DSCR
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.dscr || ''}
                onChange={(e) => handleInputChange('dscr', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.penalidad_prepago_alta || false}
                onChange={(e) => handleInputChange('penalidad_prepago_alta', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Penalización Prepago Alta
              </label>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inversión Estimada Rehabilitación (€)
              </label>
              <input
                type="number"
                min="0"
                value={formData.capex_rehab_estimado_eur || ''}
                onChange={(e) => handleInputChange('capex_rehab_estimado_eur', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ahorro Energía Estimado (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.ahorro_energia_pct_estimado || ''}
                onChange={(e) => handleInputChange('ahorro_energia_pct_estimado', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const { scores, metrics, recommendation } = analysis || {};

  return (
    <div className="min-h-screen bg-gray-50 py-6 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/cfo-dashboard')}
            className="inline-flex items-center gap-2 mb-4 text-sm transition-colors"
            style={{ color: '#64748B' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1E293B'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#1E293B' }}>
              Simulación de Due Diligence
            </h1>
            <p className="text-sm" style={{ color: '#64748B' }}>
              Prueba diferentes escenarios y observa cómo cambia el análisis en tiempo real
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:sticky lg:top-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
              {/* Navegación de secciones */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {section.id}. {section.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenido de la sección */}
              <div className="mb-4 sm:mb-6">
                {renderSectionContent()}
              </div>

              {/* Botón ejecutar */}
              <button
                onClick={handleExecuteAnalysis}
                disabled={isAnalyzing}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  'Ejecutar Análisis'
                )}
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-2">
            {isAnalyzing ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 flex items-center justify-center" style={{ borderColor: 'rgba(91, 141, 239, 0.08)' }}>
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="font-medium" style={{ color: '#64748B' }}>Ejecutando análisis...</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="space-y-6">
                {/* Header con scores */}
                <div className="bg-white rounded-xl shadow-sm border p-6" style={{ borderColor: 'rgba(91, 141, 239, 0.08)', boxShadow: '0 1px 8px rgba(91, 141, 239, 0.06)' }}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#1E293B' }}>
                        {formData.buildingName}
                      </h2>
                      <p className="text-xs sm:text-sm mt-1" style={{ color: '#64748B' }}>
                        Análisis Simulado • {new Date(analysis.analysisDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="text-center sm:text-right flex-shrink-0">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>Score General</p>
                      <div className="text-4xl sm:text-5xl font-bold text-blue-600">
                        {scores?.overall || 0}
                      </div>
                      <span className="text-lg sm:text-xl" style={{ color: '#94A3B8' }}>/100</span>
                    </div>
                  </div>
                </div>

                {/* Métricas */}
                {metrics && <DueDiligenceMetrics metrics={metrics} />}

                {/* Gráficos */}
                {analysis.chartData && <DueDiligenceCharts chartData={analysis.chartData} />}

                {/* Recomendación */}
                {recommendation && <DueDiligenceRecommendationComponent recommendation={recommendation} />}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center" style={{ borderColor: 'rgba(91, 141, 239, 0.08)' }}>
                <p className="text-gray-500">Completa el formulario y ejecuta el análisis para ver los resultados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
