export interface CurrentFinancialState {
  marketValue: number;
  roiPct: number | null;
  noi: number | null;
  capRatePct: number | null;
  
  // Métricas secundarias
  squareMeters: number | null;
  pricePerSqm: number | null;
  rentPerSqmPerMonth: number | null;
  occupancyPct: number | null;
}

export interface ImprovementCost {
  category: string;
  description: string;
  estimatedCost: number;
}

export interface PostImprovementScenario {
  totalInvestment: number;
  investmentBreakdown: ImprovementCost[];
  
  revaluationPct: number;
  futureValue: number;
  valueIncrease: number;
  
  paybackMonths: number | null;
  netProfit: number;
  projectRoiPct: number | null;
  
  annualEnergySavings: number;
  noiIncrease: number;
  newCapRatePct: number | null;
}

export interface InvestmentScenario {
  id: number;
  name: string;
  description: string;
  investment: number;
  futureValue: number;
  annualSavings: number;
  epbdClass: string;
  roiPct: number | null;
  paybackYears: number | null;
  isOptimal: boolean;
  pros: string[];
  cons: string[];
}

export interface FinancialAuditResult {
  buildingId: string;
  address?: string;
  currentState: CurrentFinancialState;
  postImprovementScenario: PostImprovementScenario;
  scenarios: InvestmentScenario[];
  
  dataCompleteness: {
    hasFinancialSnapshot: boolean;
    hasEnergyImprovements: boolean;
    hasBuildingPrice: boolean;
    completenessScore: number;
  };
  
  recommendations: string[];
  calculatedAt: string;
}

export interface FinancialAuditResponse {
  data: FinancialAuditResult;
  message?: string;
}
