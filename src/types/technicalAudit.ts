export interface TechnicalTask {
  id: string;
  category: 'maintenance' | 'safety' | 'energy' | 'documentation' | 'compliance';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  relatedData?: string;
}

export interface EnergyImprovement {
  id: string;
  type: 'insulation' | 'heating' | 'lighting' | 'windows' | 'renewable' | 'hvac';
  title: string;
  description: string;
  estimatedSavingsKwhPerM2: number;
  priority: 'high' | 'medium' | 'low';
  estimatedCost?: number;
  estimatedRoi?: number;
  estimatedCo2Reduction?: number;
}

export interface TechnicalAuditSummary {
  totalTasks: number;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
  recommendedImprovements: number;
  totalInvestment?: number;
  totalAnnualSavings?: number;
  totalCo2Reduction?: number;
  roiAggregated?: number;
}

export interface TechnicalAuditResult {
  isComplete: boolean;
  missingData?: string[];
  completionPercentage: number;
  tasks: TechnicalTask[];
  energyImprovements: EnergyImprovement[];
  potentialSavingsKwhPerM2: number;
  esgResult: any | null; // using any to avoid importing full ESG types frontend side, unless needed
  summary: TechnicalAuditSummary;
}

export interface TechnicalAuditResponse {
  data: TechnicalAuditResult;
  message?: string;
}
