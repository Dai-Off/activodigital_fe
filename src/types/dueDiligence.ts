/**
 * Tipos para el análisis de Due Diligence del CFO
 */

export type RecommendationType = 'mantener' | 'mejorar' | 'vender';

export interface DueDiligenceScore {
  overall: number; // 0-100
  financial: number; // 0-100
  operational: number; // 0-100
  technical: number; // 0-100
  market: number; // 0-100
}

export interface DueDiligenceMetrics {
  // Métricas financieras
  roi: number | null;
  noi: number | null; // Net Operating Income
  capRate: number | null; // Capitalization Rate
  dscr: number | null;
  occupancyRate: number; // Porcentaje de ocupación
  
  // Métricas operacionales
  opexRatio: number | null; // OPEX / Ingresos
  energyEfficiency: string | null; // Rating energético
  maintenanceScore: number; // 0-100
  
  // Métricas de mercado
  marketValue: number;
  estimatedValue: number;
  valueGap: number; // Diferencia porcentual
  daysOnMarket: number | null;
  
  // Riesgos
  concentrationRisk: number; // 0-100
  documentationRisk: number; // 0-100
  debtRisk: number; // 0-100
}

export interface DueDiligenceRecommendation {
  type: RecommendationType;
  confidence: number; // 0-100
  reasoning: string[];
  actionItems: ActionItem[];
  financialImpact: FinancialImpact;
  timeline: string;
}

export interface ActionItem {
  id: string;
  title: string;
  priority: 'alta' | 'media' | 'baja';
  category: 'financiero' | 'operacional' | 'técnico' | 'legal';
  estimatedCost?: number;
  estimatedDuration?: string;
  status: 'pendiente' | 'en_progreso' | 'completado';
}

export interface FinancialImpact {
  currentValue: number;
  projectedValue: number;
  investmentRequired: number;
  expectedReturn: number;
  paybackPeriod: number; // meses
  irr: number | null; // Internal Rate of Return
}

export interface DueDiligenceAnalysis {
  buildingId: string;
  buildingName: string;
  analysisDate: string;
  scores: DueDiligenceScore;
  metrics: DueDiligenceMetrics;
  recommendation: DueDiligenceRecommendation;
  chartData: ChartData;
}

export interface ChartData {
  scoreRadar: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  
  financialTrend: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  };
  
  riskDistribution: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

export interface DueDiligenceFilters {
  timeRange: '3m' | '6m' | '12m' | '24m';
  includeProjections: boolean;
  riskTolerance: 'conservador' | 'moderado' | 'agresivo';
}

