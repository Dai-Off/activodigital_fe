export type ScenarioType = 'passive' | 'balanced' | 'active';

export interface FinancialKPIs {
    noiCurrent: number;
    noiProjected: number;
    roi: number;
    paybackYears: number;
    totalCost: number;
    subsidies: number;
    netCapex: number;
    currentValue: number;
    potentialValue: number;
    exitValue: number;
    yieldOnCost: number;
    npv: number;
    irr: number;
    annualDebtService: number;
    costOfEquity: number;
    potentialGrossIncome: number;
    annualExpenses: number;
    greenFinancingAmount: number;
    marketYieldPercent?: number; // [NEW] Context for UI comparison
}

export type CashflowDataPoint = {
    year: number;
    operationalCashflow: number;
    capitalCashflow: number;
    totalCashflow: number;
    cumulativeCashflow: number;
    expensesFlow: number;
};

// --- NEW INTERFACES ---

export interface AnnualFlow {
    year: number;
    grossIncome: number;
    opex: number;
    capex: number;
}

export interface FinancialProjectState {
    timeHorizonYears: number;
    initialMarketValue: number;
    initialCapex: number;
    discountRatePercent: number;
    exitValue: number;
    vacancyRatePercent: number;
    marketYieldPercent: number; // [NEW] For bidirectional calc
    marketPricePerSqm?: number; // [NEW] From Supabase for Method C
    surfaceArea?: number; // [NEW] For Method C
    energyRating?: string | null; // [NEW] EPBD Risk Analysis
    annualFlows: AnnualFlow[];
}

export const SCENARIOS: Record<ScenarioType, any> = {
    passive: { id: 'passive', label: 'Pasivo', capex: 60000, vacancyRate: 5, marketYield: 4.5 },
    balanced: { id: 'balanced', label: 'Equilibrado', capex: 180000, vacancyRate: 10, marketYield: 5.5 },
    active: { id: 'active', label: 'Activo', capex: 350000, vacancyRate: 15, marketYield: 6.5 },
};

export const calculateIRR = (cashFlows: number[], guess = 0.1): number => {
    const maxIterations = 1000;
    const precision = 1e-7;
    let rate = guess;

    // Check if all cashflows are effectively zero
    if (cashFlows.every(val => Math.abs(val) < 1e-5)) return 0;

    // Safety check: specific to this case where guess is far from negative reality
    // If simple sum < 0, maybe start with negative guess
    const sumFlows = cashFlows.reduce((a, b) => a + b, 0);
    if (sumFlows < 0) rate = -0.2;

    for (let i = 0; i < maxIterations; i++) {
        // Clamp rate to valid range for (1+r)^t
        if (rate <= -1) rate = -0.9999;

        let npv = 0;
        let dNpv = 0;
        for (let t = 0; t < cashFlows.length; t++) {
            const factor = Math.pow(1 + rate, t);
            npv += cashFlows[t] / factor;
            dNpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
        }

        if (Math.abs(npv) < precision) return rate;
        if (Math.abs(dNpv) < precision) break;

        const newRate = rate - npv / dNpv;

        if (Math.abs(newRate - rate) < precision) return newRate;
        rate = newRate;
    }

    // Fallback if no convergence
    return rate;
};

// --- CORE CALCULATION LOGIC ---

export interface KPIModifiers {
    discountRateDelta?: number; // e.g. -0.5
    exitYieldDelta?: number;    // e.g. -0.25 (Yield compression)
}

export const calculateProjectKPIs = (project: FinancialProjectState, modifiers?: KPIModifiers): FinancialKPIs => {
    const {
        timeHorizonYears,
        initialMarketValue,
        initialCapex,
        discountRatePercent,
        exitValue: userExitValue,
        vacancyRatePercent = 0, // Default to 0 if undefined
        marketYieldPercent = 5 // Default 5%
    } = project;

    // Apply Modifiers
    const discountRateAdjustment = modifiers?.discountRateDelta || 0;
    const yieldAdjustment = modifiers?.exitYieldDelta || 0;

    const discountRate = Math.max(0, (discountRatePercent + discountRateAdjustment) / 100);
    const vacancyRate = vacancyRatePercent / 100;
    const marketYield = Math.max(0.01, (marketYieldPercent + yieldAdjustment) / 100); // Avoid 0 devision

    // [FIX] Initial Investment = Market Value + Initial CAPEX
    // This represents the "Day 1" cash outflow.
    const initialInvestment = initialMarketValue + initialCapex;

    // --- 1. Cashflow Generation ---
    const cashFlowStream: number[] = [-initialInvestment]; // Year 0
    let cumulativeDiscountedCashflow = -initialInvestment;
    let totalNOI = 0;
    let potentialGrossIncomeTotal = 0; // For tracking purposes

    // Generate annual Net Cash Flows
    const annualCashFlows = project.annualFlows.map(flow => {
        // [UPDATE] Apply Vacancy Rate to Gross Income
        // Effective Income = Gross Income * (1 - Vacancy)
        const effectiveGrossIncome = flow.grossIncome * (1 - vacancyRate);

        // [UPDATE] "NOI Neto" as requested: Deduct Capex from the Flow? 
        // Standard Real Estate NOI = Gross - OPEX. 
        // Net Cash Flow = NOI - CAPEX (Recurring).
        // The user asked for "Analysis" where we use NOI for Valuation, but CashFlow for IRR.
        // Let's keep NOI = Gross - Opex for standard metrics, but calculate NetFlow separately.

        // However, the previous code mixed them. Let's separate if possible, or stick to Net Flow for simplicity in this function.
        // Let's define NOI strictly as Operating Income.
        const noiOperating = effectiveGrossIncome - flow.opex;

        // Net Cash Flow includes Recurring Capex
        const netFlow = noiOperating - flow.capex;

        totalNOI += noiOperating; // Sum of Operating NOI
        potentialGrossIncomeTotal += flow.grossIncome;

        // Return Net Flow for the stream
        return netFlow;
    });

    for (let t = 1; t <= timeHorizonYears; t++) {
        const netFlow = annualCashFlows[t - 1] || 0; // annualCashFlows is 0-indexed for year 1, 2...
        cashFlowStream.push(netFlow);

        const discountFactor = 1 / Math.pow(1 + discountRate, t);
        cumulativeDiscountedCashflow += netFlow * discountFactor;
    }

    // Terminal Value
    // Terminal Value
    // const exitYieldDecimal = exitYieldPercent / 100 || 0.05;
    // const exitValue = lastNOI / exitYieldDecimal;
    // const exitValue = userExitValue; // Use user input directly

    // Add Exit Value to stream for IRR
    // Note: cashFlowStream[0] is Initial Investment (Year 0)
    // cashFlowStream[1] is Year 1... cashFlowStream[timeHorizonYears] is Year N

    // --- 2. Bidirectional Exit Value Logic ---
    // Rule: If userExitValue is 0, we calculate it using Market Yield on LAST YEAR'S NOI
    // But we need Last Year's NOI first.
    // Let's get the NOI from the last flow we generated
    const lastFlow = project.annualFlows.find(f => f.year === timeHorizonYears) || { grossIncome: 0, opex: 0 };
    const lastEffectiveIncome = lastFlow.grossIncome * (1 - vacancyRate);
    const lastNOI = lastEffectiveIncome - lastFlow.opex;

    let finalExitValue = userExitValue;
    if (userExitValue === 0 && marketYield > 0) {
        finalExitValue = lastNOI / marketYield;
    }

    // Discount TV
    cumulativeDiscountedCashflow += finalExitValue * (1 / Math.pow(1 + discountRate, timeHorizonYears));

    const npv = cumulativeDiscountedCashflow;

    // Safety for IRR: If horizon is short (<5) and exitValue is 0, we might want to return 0 or -100 to show 'Error' state?
    // But for now, we just let the math happen. The UI will handle the warning.
    // Recalculate IRR with the correct finalExitValue
    // We need to reconstruct the stream if exit value changed
    const finalCashStream = [...cashFlowStream];
    // Add Exit Value to the last year's flow
    if (finalCashStream.length > timeHorizonYears) {
        finalCashStream[timeHorizonYears] += finalExitValue;
    } else {
        // Should catch unlikely case
        finalCashStream.push(finalExitValue);
    }
    const irr = calculateIRR(finalCashStream) * 100;

    // Payback (Nominal)
    // Payback (Nominal) - STRICTLY UNDISCOUNTED
    let cumulativeNominal = -initialInvestment;
    let paybackYears = 0;
    let paybackFound = false;

    // Handle case where initial investment is 0 (Payback is immediate/0)
    if (initialInvestment === 0) {
        paybackYears = 0;
        paybackFound = true;
    }

    // We must iterate year by year using the cashFlowStream logic but ignoring discounts
    // cashFlowStream[0] is -initialInvestment.
    // cashFlowStream[t] for t=1..N is (Gross - Opex - Capex).
    // Note: cashFlowStream array ALREADY has Exit Value added to Year N (line 132 or 135).
    // BUT Payback logic often excludes Exit Value if we want "Operating Payback", but user request implies comprehensive.
    // However, usually Payback is about operating recovery. But if Exit Value is a massive inflow, it definitely affects payback if not recovered before.
    // User request: "Si la inversión no se recupera dentro del horizonte, devuelve 'No alcanzado'"
    // This implies we check up to N.

    if (!paybackFound) {
        for (let t = 1; t <= timeHorizonYears; t++) {
            // Reconstruct flow to ensure we know what we are adding. 
            // We can reuse cashFlowStream[t] because we constructed it as Net Flow (+ Exit Value in last year).
            // WARNING: IRR calc modified cashFlowStream[timeHorizonYears] to include ExitValue.
            // If we want SIMPLE payback from operations, we might want to exclude Exit Value?
            // User says: "El valor de salida... Solo se suma una vez... Solo en el último año... nunca como ingreso recurrente".
            // Usually Payback includes all cash flows. So including Exit Value at year N is correct if the asset is sold.

            let flowVal = cashFlowStream[t];

            // [FIX] Include Exit Value in Payback Calculation (Recovered at exit)
            if (t === timeHorizonYears) {
                flowVal += finalExitValue;
            }
            const prev = cumulativeNominal;
            cumulativeNominal += flowVal;

            if (cumulativeNominal >= 0 && !paybackFound) {
                // Found it between t-1 and t
                // Fraction needed = amount still negative at t-1 / cash flow at t
                // Amount still negative is abs(prev)
                const needed = Math.abs(prev);
                // Avoid division by zero
                const fraction = flowVal !== 0 ? needed / flowVal : 0;
                paybackYears = (t - 1) + fraction;
                paybackFound = true;
            }
        }
    }

    // If we finished the loop and still negative
    if (!paybackFound) {
        // If cumulativeNominal is still negative after Year N (including Exit Value), then it's truly not reached.
        paybackYears = 999; // Sentinel for "Infinity" or "Not Reached" to be handled by UI
    }

    // NOI Current (Year 1)
    // [UPDATE] Apply Vacancy to Year 1 as well
    const firstYearFlow = project.annualFlows[0] || { grossIncome: 0, opex: 0 };
    const noiCurrent = (firstYearFlow.grossIncome * (1 - vacancyRate)) - firstYearFlow.opex - firstYearFlow.capex;

    // NOI Projected (Average or Last Year?) -> Let's use Average NOI
    const avgNOI = totalNOI / project.annualFlows.length;

    return {
        noiCurrent,
        noiProjected: avgNOI,
        roi: 0,
        paybackYears,
        totalCost: initialInvestment,
        subsidies: 0,
        netCapex: initialCapex,
        currentValue: initialMarketValue,
        potentialValue: finalExitValue,
        exitValue: finalExitValue,
        yieldOnCost: initialInvestment !== 0 ? (avgNOI / initialInvestment) * 100 : 0, // Yield on Cost (Entry)
        npv,
        irr,
        annualDebtService: 0,
        costOfEquity: discountRatePercent,
        potentialGrossIncome: 0,
        annualExpenses: 0,
        greenFinancingAmount: 0,
        marketYieldPercent
    };
};

export const generateCashflowData = (
    project: FinancialProjectState,
    kpis: FinancialKPIs
): CashflowDataPoint[] => {
    const data: CashflowDataPoint[] = [];
    const currentYear = new Date().getFullYear();
    const { timeHorizonYears, initialMarketValue, initialCapex, annualFlows } = project;
    const initialInvestment = initialMarketValue + initialCapex;

    data.push({
        year: currentYear,
        operationalCashflow: 0,
        capitalCashflow: -initialInvestment,
        totalCashflow: -initialInvestment,
        cumulativeCashflow: -initialInvestment,
        expensesFlow: 0
    });

    let cumulative = -initialInvestment;
    const k = project.discountRatePercent / 100;

    for (let t = 1; t <= timeHorizonYears; t++) {
        const year = currentYear + t;
        const flow = annualFlows.find(f => f.year === t) || { year: t, grossIncome: 0, opex: 0, capex: 0 };

        const operationalNet = flow.grossIncome - flow.opex;
        const capitalFlow = -flow.capex;

        let totalYearFlow = operationalNet + capitalFlow;
        if (t === timeHorizonYears) {
            totalYearFlow += kpis.exitValue;
        }

        const discountFactor = 1 / Math.pow(1 + k, t);
        cumulative += totalYearFlow * discountFactor;

        data.push({
            year: year,
            operationalCashflow: operationalNet,
            capitalCashflow: t === timeHorizonYears ? (kpis.exitValue - flow.capex) : -flow.capex,
            totalCashflow: totalYearFlow,
            cumulativeCashflow: cumulative,
            expensesFlow: -flow.opex
        });
    }

    return data;
};

export interface SensitivityPoint {
    discountRate: number;
    npv: number;
    isCurrent: boolean;
}

export const generateSensitivityData = (
    project: FinancialProjectState
): SensitivityPoint[] => {
    const points: SensitivityPoint[] = [];
    const baseRate = project.discountRatePercent;
    const minRate = Math.max(1, baseRate - 10);
    const maxRate = baseRate + 10;

    const {
        timeHorizonYears,
        initialMarketValue, // [FIX] Need this
        initialCapex,
        exitValue: userExitValue,
        annualFlows
    } = project;

    const initialInvestment = initialMarketValue + initialCapex; // [FIX]

    for (let r = minRate; r <= maxRate; r += 0.5) {
        const k = r / 100;
        let npv = -initialInvestment;

        for (let t = 1; t <= timeHorizonYears; t++) {
            const flow = annualFlows.find(f => f.year === t) || { year: t, grossIncome: 0, opex: 0, capex: 0 };
            const netFlow = flow.grossIncome - flow.opex - flow.capex;
            npv += netFlow / Math.pow(1 + k, t);
        }

        // Terminal Value - Use User Input
        const exitValue = userExitValue;

        npv += exitValue / Math.pow(1 + k, timeHorizonYears);

        points.push({
            discountRate: r,
            npv: npv,
            isCurrent: Math.abs(r - baseRate) < 0.25
        });
    }
    return points;
};

export const generatePaybackEvolution = (project: FinancialProjectState): { year: number, value: number }[] => {
    const { timeHorizonYears, initialMarketValue, initialCapex, annualFlows, exitValue } = project;
    const initialInvestment = initialMarketValue + initialCapex;
    const evolution: { year: number, value: number }[] = [];

    // Year 0
    let cumulative = -initialInvestment;
    evolution.push({ year: 0, value: cumulative });

    for (let t = 1; t <= timeHorizonYears; t++) {
        const flow = annualFlows.find(f => f.year === t) || { year: t, grossIncome: 0, opex: 0, capex: 0 };
        const netFlow = flow.grossIncome - flow.opex - flow.capex;

        // Add net flow
        cumulative += netFlow;

        // At the last year, include Exit Value?
        // Payback "usually" focuses on operating, but if we included it in calculation before, we include it here.
        // The user said "evolution until reaching recovery".
        // If we strictly follow the previous logic (where we iterated up to N), we include it if it's the last year?
        // Previous logic in calculateProjectKPIs iterated t=1..N.
        // In generateCashflowData, we add exitValue at t=N.
        // Let's mirror that behavior for consistency.
        if (t === timeHorizonYears) {
            cumulative += exitValue;
        }

        evolution.push({ year: t, value: cumulative });
    }

    return evolution;
};
