/**
 * Servicio de análisis financiero
 * Por ahora simula datos, luego se integrará con IA
 */

import type { FinancialSnapshot } from './financialSnapshots';
import type {
  FinancialAnalysis,
  FinancialAnalysisScore,
  FinancialAnalysisMetrics,
  FinancialAnalysisRecommendation,
  RecommendationType,
  ChartData,
  ActionItem,
} from '../types/financialAnalysis';

export class FinancialAnalysisService {
  /**
   * Analiza un edificio basándose en sus datos financieros
   */
  static async analyzeBuilding(
    buildingId: string,
    buildingName: string,
    financialData: FinancialSnapshot | null,
    buildingValue: number
  ): Promise<FinancialAnalysis> {
    // Calcular métricas
    const metrics = this.calculateMetrics(financialData, buildingValue);
    
    // Calcular scores
    const scores = this.calculateScores(metrics, financialData);
    
    // Generar recomendación
    const recommendation = this.generateRecommendation(scores, metrics, financialData);
    
    // Generar datos para charts
    const chartData = this.generateChartData(scores, metrics);
    
    return {
      buildingId,
      buildingName,
      analysisDate: new Date().toISOString(),
      scores,
      metrics,
      recommendation,
      chartData,
    };
  }

  /**
   * Calcula métricas clave del edificio
   */
  private static calculateMetrics(
    data: FinancialSnapshot | null,
    buildingValue: number
  ): FinancialAnalysisMetrics {
    if (!data) {
      return this.getEmptyMetrics(buildingValue);
    }

    const ingresos = data.ingresos_brutos_anuales_eur;
    const opex = data.opex_total_anual_eur;
    const noi = ingresos - opex;
    const capRate = buildingValue > 0 ? (noi / buildingValue) * 100 : null;
    const roi = buildingValue > 0 ? ((noi - (buildingValue * 0.02)) / buildingValue) * 100 : null;
    const opexRatio = ingresos > 0 ? (opex / ingresos) * 100 : null;
    
    // Calcular scores de riesgo
    const concentrationRisk = data.concentracion_top1_pct_noi * 100;
    const documentationRisk = this.calculateDocumentationRisk(data);
    const debtRisk = this.calculateDebtRisk(data);
    
    // Calcular score de mantenimiento
    const maintenanceScore = this.calculateMaintenanceScore(data);
    
    // Calcular tasa de ocupación (simulada por ahora)
    const occupancyRate = 85 + Math.random() * 10; // 85-95%
    
    // Valor estimado post-mejoras
    const rehabCost = data.capex_rehab_estimado_eur || 0;
    const estimatedValue = buildingValue + rehabCost * 1.5;
    const valueGap = buildingValue > 0 ? ((estimatedValue - buildingValue) / buildingValue) * 100 : 0;

    return {
      roi,
      noi,
      capRate,
      dscr: data.dscr ?? null,
      occupancyRate,
      opexRatio,
      energyEfficiency: null, // Se puede obtener de energy certificates
      maintenanceScore,
      marketValue: buildingValue,
      estimatedValue,
      valueGap,
      daysOnMarket: data.meta?.dom_dias || null,
      concentrationRisk,
      documentationRisk,
      debtRisk,
    };
  }

  /**
   * Calcula scores por categoría
   */
  private static calculateScores(
    metrics: FinancialAnalysisMetrics,
    data: FinancialSnapshot | null
  ): FinancialAnalysisScore {
    // Score financiero (basado en ROI, Cap Rate, NOI)
    const financialScore = this.calculateFinancialScore(metrics);
    
    // Score operacional (basado en OPEX ratio, ocupación, mantenimiento)
    const operationalScore = this.calculateOperationalScore(metrics);
    
    // Score técnico (basado en documentación, mantenimiento, eficiencia energética)
    const technicalScore = this.calculateTechnicalScore(metrics, data);
    
    // Score de mercado (basado en valor, gap, días en mercado)
    const marketScore = this.calculateMarketScore(metrics);
    
    // Score general (promedio ponderado)
    const overall = (
      financialScore * 0.35 +
      operationalScore * 0.25 +
      technicalScore * 0.20 +
      marketScore * 0.20
    );

    return {
      overall: Math.round(overall),
      financial: Math.round(financialScore),
      operational: Math.round(operationalScore),
      technical: Math.round(technicalScore),
      market: Math.round(marketScore),
    };
  }

  /**
   * Genera recomendación basada en análisis
   */
  private static generateRecommendation(
    scores: FinancialAnalysisScore,
    metrics: FinancialAnalysisMetrics,
    data: FinancialSnapshot | null
  ): FinancialAnalysisRecommendation {
    const { overall, financial, technical } = scores;
    
    // Determinar tipo de recomendación
    let type: RecommendationType;
    let confidence: number;
    
    if (overall >= 75 && financial >= 70) {
      type = 'mantener';
      confidence = overall;
    } else if (overall >= 50 && metrics.valueGap > 15) {
      type = 'mejorar';
      confidence = 70 + (technical / 10);
    } else {
      type = 'vender';
      confidence = 100 - overall;
    }
    
    // Generar razonamientos
    const reasoning = this.generateReasoning(type, scores, metrics);
    
    // Generar acciones recomendadas
    const actionItems = this.generateActionItems(type, metrics, data);
    
    // Calcular impacto financiero
    const financialImpact = this.calculateFinancialImpact(type, metrics, data);
    
    // Timeline estimado
    const timeline = type === 'mantener' ? 'Continuo' : type === 'mejorar' ? '6-12 meses' : '3-6 meses';

    return {
      type,
      confidence: Math.round(confidence),
      reasoning,
      actionItems,
      financialImpact,
      timeline,
    };
  }

  /**
   * Genera datos para visualización
   */
  private static generateChartData(
    scores: FinancialAnalysisScore,
    metrics: FinancialAnalysisMetrics
  ): ChartData {
    return {
      scoreRadar: {
        labels: ['Financiero', 'Operacional', 'Técnico', 'Mercado'],
        datasets: [
          {
            label: 'Score Actual',
            data: [scores.financial, scores.operational, scores.technical, scores.market],
            backgroundColor: 'rgba(91, 141, 239, 0.15)',
            borderColor: '#5B8DEF',
            borderWidth: 2,
          } as any,
        ],
      },
      
      financialTrend: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            label: 'NOI (€)',
            data: this.generateTrendData(metrics.noi || 0, 6),
            borderColor: '#4ECCA3',
            backgroundColor: 'rgba(78, 204, 163, 0.08)',
            fill: true,
            tension: 0.5,
          } as any,
          {
            label: 'OPEX (€)',
            data: this.generateTrendData(metrics.opexRatio || 0, 6, -1),
            borderColor: '#5B8DEF',
            backgroundColor: 'rgba(91, 141, 239, 0.08)',
            fill: true,
            tension: 0.5,
          } as any,
        ],
      },
      
      riskDistribution: {
        labels: ['Concentración', 'Documentación', 'Deuda'],
        datasets: [
          {
            label: 'Nivel de Riesgo',
            data: [metrics.concentrationRisk, metrics.documentationRisk, metrics.debtRisk],
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(59, 130, 246, 0.8)',
            ],
          },
        ],
      },
    };
  }

  // ============ MÉTODOS AUXILIARES ============

  private static getEmptyMetrics(buildingValue: number): FinancialAnalysisMetrics {
    return {
      roi: null,
      noi: null,
      capRate: null,
      dscr: null,
      occupancyRate: 0,
      opexRatio: null,
      energyEfficiency: null,
      maintenanceScore: 0,
      marketValue: buildingValue,
      estimatedValue: buildingValue,
      valueGap: 0,
      daysOnMarket: null,
      concentrationRisk: 0,
      documentationRisk: 100,
      debtRisk: 0,
    };
  }

  private static calculateFinancialScore(metrics: FinancialAnalysisMetrics): number {
    let score = 50; // Base
    
    if (metrics.roi && metrics.roi > 5) score += 20;
    if (metrics.capRate && metrics.capRate > 6) score += 15;
    if (metrics.noi && metrics.noi > 0) score += 15;
    if (metrics.dscr && metrics.dscr > 1.25) score += 10;
    
    return Math.min(100, score);
  }

  private static calculateOperationalScore(metrics: FinancialAnalysisMetrics): number {
    let score = 40;
    
    if (metrics.occupancyRate > 85) score += 25;
    if (metrics.opexRatio && metrics.opexRatio < 40) score += 20;
    if (metrics.maintenanceScore > 70) score += 15;
    
    return Math.min(100, score);
  }

  private static calculateTechnicalScore(_metrics: FinancialAnalysisMetrics, data: FinancialSnapshot | null): number {
    let score = 30;
    
    if (data?.meta?.libro_edificio_estado === 'completo') score += 25;
    if (data?.meta?.ite_iee_estado === 'ok') score += 20;
    if (data?.meta?.mantenimientos_criticos_ok) score += 25;
    
    return Math.min(100, score);
  }

  private static calculateMarketScore(metrics: FinancialAnalysisMetrics): number {
    let score = 50;
    
    if (metrics.valueGap > 20) score += 30;
    else if (metrics.valueGap > 10) score += 15;
    
    if (metrics.daysOnMarket && metrics.daysOnMarket < 180) score += 20;
    
    return Math.min(100, score);
  }

  private static calculateDocumentationRisk(data: FinancialSnapshot): number {
    let risk = 0;
    
    if (data.meta?.libro_edificio_estado !== 'completo') risk += 35;
    if (data.meta?.ite_iee_estado !== 'ok') risk += 35;
    if (!data.meta?.mantenimientos_criticos_ok) risk += 30;
    
    return Math.min(100, risk);
  }

  private static calculateDebtRisk(data: FinancialSnapshot): number {
    if (!data.dscr) return 0;
    
    if (data.dscr < 1) return 90;
    if (data.dscr < 1.15) return 60;
    if (data.dscr < 1.25) return 30;
    return 10;
  }

  private static calculateMaintenanceScore(data: FinancialSnapshot): number {
    let score = 50;
    
    if (data.meta?.mantenimientos_criticos_ok) score += 30;
    if (data.opex_mantenimiento_anual_eur) {
      const maintenanceRatio = data.opex_mantenimiento_anual_eur / data.opex_total_anual_eur;
      if (maintenanceRatio > 0.15) score += 20;
    }
    
    return Math.min(100, score);
  }

  private static generateReasoning(
    type: RecommendationType,
    scores: FinancialAnalysisScore,
    metrics: FinancialAnalysisMetrics
  ): string[] {
    const reasons: string[] = [];
    
    if (type === 'mantener') {
      if (scores.financial >= 70) reasons.push('Métricas financieras sólidas con ROI positivo');
      if (metrics.occupancyRate > 85) reasons.push('Alta tasa de ocupación que indica demanda estable');
      if (scores.technical >= 70) reasons.push('Documentación completa y mantenimiento al día');
      if (metrics.concentrationRisk < 50) reasons.push('Riesgo de concentración bajo, ingresos diversificados');
    } else if (type === 'mejorar') {
      if (metrics.valueGap > 15) reasons.push(`Potencial de revalorización del ${metrics.valueGap.toFixed(1)}%`);
      if (scores.technical < 70) reasons.push('Oportunidades de mejora en documentación y mantenimiento');
      if (metrics.opexRatio && metrics.opexRatio > 40) reasons.push('OPEX elevado con margen de optimización');
      reasons.push('Inversión en mejoras podría incrementar significativamente el valor');
    } else {
      if (scores.overall < 50) reasons.push('Score general bajo indica problemas estructurales');
      if (metrics.roi && metrics.roi < 3) reasons.push('ROI por debajo del mercado, activo poco rentable');
      if (metrics.debtRisk > 60) reasons.push('Riesgo de deuda elevado que compromete la viabilidad');
      if (metrics.concentrationRisk > 70) reasons.push('Alta concentración de ingresos representa riesgo significativo');
    }
    
    return reasons;
  }

  private static generateActionItems(
    type: RecommendationType,
    _metrics: FinancialAnalysisMetrics,
    data: FinancialSnapshot | null
  ): ActionItem[] {
    const actions: ActionItem[] = [];
    
    if (type === 'mantener') {
      actions.push({
        id: '1',
        title: 'Mantener contratos de arrendamiento actuales',
        priority: 'media',
        category: 'operacional',
        estimatedDuration: 'Continuo',
        status: 'en_progreso',
      });
      actions.push({
        id: '2',
        title: 'Revisar y optimizar OPEX trimestralmente',
        priority: 'media',
        category: 'financiero',
        estimatedDuration: 'Trimestral',
        status: 'pendiente',
      });
    } else if (type === 'mejorar') {
      if (data?.meta?.libro_edificio_estado !== 'completo') {
        actions.push({
          id: '1',
          title: 'Completar libro del edificio',
          priority: 'alta',
          category: 'técnico',
          estimatedCost: 5000,
          estimatedDuration: '2 meses',
          status: 'pendiente',
        });
      }
      
      if (data?.capex_rehab_estimado_eur) {
        actions.push({
          id: '2',
          title: 'Ejecutar plan de rehabilitación energética',
          priority: 'alta',
          category: 'técnico',
          estimatedCost: data.capex_rehab_estimado_eur,
          estimatedDuration: '6-8 meses',
          status: 'pendiente',
        });
      }
      
      actions.push({
        id: '3',
        title: 'Negociar contratos de servicios para reducir OPEX',
        priority: 'media',
        category: 'operacional',
        estimatedCost: 0,
        estimatedDuration: '3 meses',
        status: 'pendiente',
      });
    } else {
      actions.push({
        id: '1',
        title: 'Preparar documentación para venta',
        priority: 'alta',
        category: 'legal',
        estimatedCost: 10000,
        estimatedDuration: '1 mes',
        status: 'pendiente',
      });
      actions.push({
        id: '2',
        title: 'Contratar agente inmobiliario especializado',
        priority: 'alta',
        category: 'operacional',
        estimatedDuration: '2 semanas',
        status: 'pendiente',
      });
      actions.push({
        id: '3',
        title: 'Realizar valoración independiente del activo',
        priority: 'alta',
        category: 'financiero',
        estimatedCost: 3000,
        estimatedDuration: '3 semanas',
        status: 'pendiente',
      });
    }
    
    return actions;
  }

  private static calculateFinancialImpact(
    type: RecommendationType,
    metrics: FinancialAnalysisMetrics,
    data: FinancialSnapshot | null
  ) {
    const currentValue = metrics.marketValue;
    let projectedValue = currentValue;
    let investmentRequired = 0;
    let expectedReturn = 0;
    let paybackPeriod = 0;
    let irr = null;
    
    if (type === 'mantener') {
      projectedValue = currentValue * 1.03; // 3% anual
      investmentRequired = currentValue * 0.02; // 2% mantenimiento
      expectedReturn = metrics.noi || 0;
      paybackPeriod = 12;
      irr = metrics.roi ? metrics.roi / 12 : null;
    } else if (type === 'mejorar') {
      investmentRequired = data?.capex_rehab_estimado_eur || currentValue * 0.15;
      projectedValue = metrics.estimatedValue;
      expectedReturn = projectedValue - currentValue - investmentRequired;
      paybackPeriod = investmentRequired > 0 ? Math.round((investmentRequired / (metrics.noi || 1)) * 12) : 0;
      irr = expectedReturn > 0 ? (expectedReturn / investmentRequired) * 100 / 2 : null;
    } else {
      projectedValue = currentValue * 0.95; // Descuento por venta rápida
      investmentRequired = currentValue * 0.03; // Costos de venta
      expectedReturn = projectedValue - investmentRequired;
      paybackPeriod = 6;
    }
    
    return {
      currentValue,
      projectedValue,
      investmentRequired,
      expectedReturn,
      paybackPeriod,
      irr,
    };
  }

  private static generateTrendData(baseValue: number, months: number, direction: number = 1): number[] {
    const data: number[] = [];
    for (let i = 0; i < months; i++) {
      const variance = (Math.random() - 0.5) * baseValue * 0.1;
      const trend = direction * (baseValue * 0.02 * i);
      data.push(Math.max(0, baseValue + trend + variance));
    }
    return data;
  }
}

