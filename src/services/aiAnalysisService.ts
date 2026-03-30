import {
    calculateProjectKPIs,
    type FinancialProjectState,
    type FinancialKPIs
} from './mockFinancialData';

export interface ValuationMethod {
    name: string;
    value: number | string;
    description: string;
}

export interface RiskFactor {
    category: 'Regulatorio' | 'Financiero' | 'Rentabilidad';
    severity: 'low' | 'medium' | 'high';
    label: string;
    description: string;
}

export interface StrategicRecommendation {
    action: 'REHABILITAR' | 'VENDER' | 'MANTENER';
    title: string;
    description: string;
    argument: string; // The "Brown Discount" or "Green Premium" argument
}

export interface ScenarioComparison {
    baselineIRR: number;
    currentIRR: number;
    irrDelta: number;
    baselineNPV: number;
    currentNPV: number;
    npvDelta: number;
    isGreenPremium: boolean;
}

export interface StrategicPaths {
    sell: StrategicPathOption;
    hold: StrategicPathOption;
    rehab: StrategicPathOption;
}

export interface StrategicPathOption {
    action: 'REHABILITAR' | 'VENDER' | 'MANTENER';
    score: number; // 0-100
    title: string;
    description: string;
    isRecommended: boolean;
}

export interface AdvancedAIAnalysisResult {
    diagnosis: string;
    valuation: {
        methodA: ValuationMethod; // Dynamic DCF
        methodB?: ValuationMethod; // Market Cap (Optional/Deprecated)
        methodC?: ValuationMethod; // Physical (Optional/Deprecated)
    };
    risks: RiskFactor[];
    strategy: StrategicRecommendation;
    summary: string[]; // For the small card view
    comparison?: ScenarioComparison; // New Comparative Data
    strategicPaths: StrategicPaths; // [NEW] 3-Way Path
    storyTelling: string; // [NEW] Narrative
    totalExitYearCashflow?: number; // [NEW] Explicit Cash Flow + Terminal Value
    cashFlowTrajectory?: { year: number | string; amount: number; label: string }[]; // [NEW] FCF Evidence
}

// Helper: Create "Do Nothing" Scenario (No Capex, No Green Modifiers)
const generateBaselineScenario = (project: FinancialProjectState): FinancialProjectState => {
    return {
        ...project,
        initialCapex: 0, // No Rehab
        annualFlows: project.annualFlows.map(f => ({
            ...f,
            capex: 0, // No recurring capex related to the project (assumption)
            // Ideally we should also revert Rents to "Original" if we had that info, 
            // but for now we assume User Input Rents are "Post-Rehab" if Capex > 0.
            // A true baseline would require "Pre-Rehab Rents". 
            // PROVISIONAL: We assume Baseline Rents are 15% lower if Current has CAPEX.
            grossIncome: project.initialCapex > 0 ? f.grossIncome * 0.85 : f.grossIncome
        }))
    };
};

export const generateAdvancedAnalysis = (
    project: FinancialProjectState,
    kpis: FinancialKPIs
): AdvancedAIAnalysisResult => {

    const {
        annualFlows,
        initialMarketValue,
        initialCapex,
        vacancyRatePercent,

    } = project;

    // --- 0. SCENARIO COMPARISON (Analysis 1) ---
    // Generate Baseline (Do Nothing)
    const baselineProject = generateBaselineScenario(project);
    // Calc Baseline KPIs (Standard Discount, Standard Yield)
    const baselineKPIs = calculateProjectKPIs(baselineProject);

    // Calc Current KPIs (With Green Modifiers if applicable)
    // We assume the 'kpis' passed in ALREADY have the modifiers applied from the UI/Hook.

    const comparison: ScenarioComparison = {
        baselineIRR: baselineKPIs.irr,
        currentIRR: kpis.irr,
        irrDelta: kpis.irr - baselineKPIs.irr,
        baselineNPV: baselineKPIs.npv,
        currentNPV: kpis.npv,
        npvDelta: kpis.npv - baselineKPIs.npv,
        isGreenPremium: (kpis.irr > baselineKPIs.irr) && (initialCapex > 0)
    };

    // --- 1. TRIANGULATED VALUATION ---

    // Method A: Dynamic (DCF + Exit Value) - Actually represented by Initial Investment for comparison?
    // Or we assume the Calculated PV of flows is the "Dynamic Value".
    // Let's use NPV + Initial Investment as the "Value to you" (Present Value of flows).
    // Formula: PV of flows + PV of Exit.
    // Ensure we use the same definition as the User's "Expected Value".
    // Actually, NPV = PV(Flows) - InitialInvestment. So, PV(Flows) = NPV + InitialInvestment.
    const dynamicValue = kpis.npv + (initialMarketValue + initialCapex);

    // Unused methods removed to clean lint warnings
    // const firstYearNOI = ...
    // const marketCapValue = ...
    // let physicalValue = ... 

    const valuation = {
        methodA: {
            name: "Método A (Dinámico)",
            value: dynamicValue,
            description: "Valor Presente de Flujos Futuros (DCF) + Valor Terminal."
        }
    };

    // --- 2. RISK ANALYSIS (Financial, Regulatory, Profitability) ---
    const risks: RiskFactor[] = [];

    // 2.1 Volatility Logic Refined
    // Volatility is only a critical risk if it involves DROPS > 10% (Destabilizing)
    // If it's unstable growth, it's a management challenge but not necessarily a "Sell" signal.
    let isDestabilizing = false;
    for (let i = 1; i < annualFlows.length; i++) {
        const prev = annualFlows[i - 1].grossIncome;
        const curr = annualFlows[i].grossIncome;
        const growth = prev > 0 ? (curr - prev) / prev : 0;

        // Only flag negatives larger than 10% as Critical Instability
        if (growth < -0.10) {
            isDestabilizing = true;
            break;
        }
    }

    // Check for ANY volatility for the risk list (informational), but separate decision logic
    let isVolatile = false;
    for (let i = 1; i < annualFlows.length; i++) {
        const prev = annualFlows[i - 1].grossIncome;
        const curr = annualFlows[i].grossIncome;
        const growth = prev > 0 ? (curr - prev) / prev : 0;
        if (Math.abs(growth) > 0.10) {
            isVolatile = true;
            break;
        }
    }

    if (isVolatile) {
        risks.push({
            category: 'Financiero',
            severity: isDestabilizing ? 'high' : 'medium',
            label: isDestabilizing ? 'Caída de Ingresos >10%' : 'Volatilidad Operativa Warning',
            description: isDestabilizing
                ? 'Se detectan caídas severas en flujos de caja. Riesgo de insolvencia operativa.'
                : 'Variaciones significativas en ingresos. Requiere gestión activa.'
        });
    }

    // [NEW] 10% Deviation Alert (Static Capability)
    risks.push({
        category: 'Financiero',
        severity: 'low',
        label: 'Monitorización Activa (Regla 10%)',
        description: 'El sistema activará alertas automáticas si los flujos reales futuros se desvían >10% de esta proyección.'
    });

    // 2.2 Regulatory Risk (EPBD / Brown Discount) - REAL IMPLEMENTATION
    // EU EPBD Directive Targets (approximate for logic):
    // 2030: Residential -> Class E
    // 2033: Residential -> Class D
    // G & F are High Risk (Stranded Assets)

    // Check if we have real data
    const rating = project.energyRating ? project.energyRating.toUpperCase() : null;
    let isEPBDRisk = false;

    if (rating) {
        // Real Data Logic
        const highRiskRatings = ['G', 'F'];
        const mediumRiskRatings = ['E'];

        if (highRiskRatings.includes(rating)) {
            // Check if we are REHABILITATING (Capex > 0)
            if (initialCapex === 0) {
                isEPBDRisk = true;
                risks.push({
                    category: 'Regulatorio',
                    severity: 'high',
                    label: `Riesgo EPBD Crítico (Clase ${rating})`,
                    description: `El activo tiene calificación ${rating}. Sin rehabilitación, sufre "Brown Discount" (+Prima Riesgo) y liquidez reducida.`
                });
            } else {
                // Rehabilitating... assume improvement
                risks.push({
                    category: 'Regulatorio',
                    severity: 'low',
                    label: `Mitigación EPBD (En curso)`,
                    description: `La inversión en rehabilitación (CAPEX) mitiga el riesgo de obsolescencia regulatoria.`
                });
            }
        } else if (mediumRiskRatings.includes(rating)) {
            if (initialCapex === 0) {
                risks.push({
                    category: 'Regulatorio',
                    severity: 'medium',
                    label: `Riesgo EPBD Medio (Clase ${rating})`,
                    description: `Objetivo 2033 (Clase D) en riesgo. Considere CAPEX a medio plazo.`
                });
            }
        }
    } else {
        // Fallback Heuristic
        const totalCapex = annualFlows.reduce((acc, f) => acc + f.capex, 0) + initialCapex;
        const isLowCapex = totalCapex < (initialMarketValue * 0.05);
        const isHighVacancy = vacancyRatePercent > 10;

        if (isLowCapex && isHighVacancy) {
            isEPBDRisk = true;
            risks.push({
                category: 'Regulatorio',
                severity: 'high',
                label: 'Riesgo Activo Varado (Estimado)',
                description: 'Sin certificación conocida + baja inversión + alta vacancia = Riesgo de obsolescencia.'
            });
        }
    }

    // 2.3 Profitability (TIR < 10%)
    if (kpis.irr < 10) {
        risks.push({
            category: 'Rentabilidad',
            severity: kpis.irr < 5 ? 'high' : 'medium',
            label: 'TIR No Atractiva (<10%)',
            description: `La TIR proyectada (${kpis.irr.toFixed(1)}%) es inferior al umbral del 10% exigido por inversores institucionales.`
        });
    }


    // --- 3. STRATEGY GENERATION (3-Way Path) ---
    // We evaluate ALL 3 paths and assign a "Suitability Score" (0-100) and an Argument.

    // Path 1: REHABILITAR (Value Add)
    // Suitability based on: Green Premium potential, EPBD mitigation needs, Regulatory Pressure.
    let rehabScore = 50; // Base
    let rehabArg = "";
    if (comparison.isGreenPremium && comparison.irrDelta > 2) {
        rehabScore += 30;
        rehabArg = "Alta creación de valor detectada. La rehabilitación incrementa significativamente la TIR y el valor de salida.";
    } else if (comparison.isGreenPremium) {
        rehabScore += 15;
        rehabArg = "Genera valor moderado, pero optimiza la liquidez del activo.";
    } else {
        rehabScore -= 10;
        rehabArg = "El coste de la rehabilitación no se justifica por el incremento de rentas/valor a corto plazo.";
    }

    if (isEPBDRisk) {
        rehabScore += 25; // Critical to fix risk
        rehabArg += " Imprescindible para mitigar riesgo regulatorio EPBD.";
    }

    // Path 2: VENDER (Exit)
    // Suitability based on: Low IRR, High Risk (that Rehab doesn't fix or is too expensive), Market Yield suppression.
    let sellScore = 50;
    let sellArg = "";
    if (kpis.irr < 8) {
        sellScore += 20;
        sellArg = "La rentabilidad actual es inferior al coste de oportunidad del capital.";
    } else if (kpis.irr > 15) {
        sellScore += 10; // Good time to sell high? Maybe, but usually Hold is better.
        sellArg = "Se podría capitalizar la plusvalía actual, aunque el flujo de caja es excelente.";
    }

    if (isDestabilizing) {
        sellScore += 25;
        sellArg += " La volatilidad operativa sugiere reducir exposición a este activo.";
    }

    if (isEPBDRisk && comparison.irrDelta < 0) {
        sellScore += 30;
        sellArg += " El CAPEX necesario destruye valor; mejor rotar el activo antes de que se materialice el 'Brown Discount'.";
    }

    // Path 3: MANTENER (Hold)
    // Suitability based on: High IRR, Stable Flows, No critical EPBD risk.
    let holdScore = 50;
    let holdArg = "";
    if (kpis.irr > 10) {
        holdScore += 20;
        holdArg = "El activo genera un Cash-on-Cash saludable.";
    } else if (kpis.irr > 15) {
        holdScore += 30;
        holdArg = "Activo 'Vaca Lechera'. Maximizar rentas mientras dure la tendencia.";
    }

    if (isEPBDRisk) {
        holdScore -= 20; // Risky to just hold without fixing
        holdArg += " Riesgo regulatorio creciente hace peligroso el mantenimiento pasivo.";
    } else {
        holdScore += 10; // Low maintenance
        holdArg += " Sin urgencias regulatorias ni operativas.";
    }

    // Normalize Scores to pick "Recommended"
    const maxScore = Math.max(rehabScore, sellScore, holdScore);
    let recommendation: 'REHABILITAR' | 'VENDER' | 'MANTENER' = 'MANTENER';

    if (rehabScore === maxScore) recommendation = 'REHABILITAR';
    if (sellScore === maxScore) recommendation = 'VENDER';
    if (holdScore === maxScore && !isEPBDRisk) recommendation = 'MANTENER'; // Tie-breaker preference

    const strategicPaths: StrategicPaths = {
        sell: {
            action: 'VENDER',
            score: sellScore,
            title: 'Rotación',
            description: sellArg || "Considerar venta si aparecen mejores oportunidades.",
            isRecommended: recommendation === 'VENDER'
        },
        hold: {
            action: 'MANTENER',
            score: holdScore,
            title: 'Gestión',
            description: holdArg || "Mantener operación estándar.",
            isRecommended: recommendation === 'MANTENER'
        },
        rehab: {
            action: 'REHABILITAR',
            score: rehabScore,
            title: 'Inversión',
            description: rehabArg || "Solo si es estríctamente necesario.",
            isRecommended: recommendation === 'REHABILITAR'
        }
    };

    // --- Story Telling: Rich, per-building narrative ---
    const fmt = (n: number) => `€${Math.round(n).toLocaleString('es-ES')}`;
    const pct = (n: number) => `${n.toFixed(1)}%`;

    const totalInvestment = initialMarketValue + initialCapex;
    const firstFlow = annualFlows[0] || { grossIncome: 0, opex: 0, capex: 0 };
    const noi1 = firstFlow.grossIncome - firstFlow.opex;
    const avgNoi = annualFlows.length
        ? annualFlows.reduce((s, f) => s + (f.grossIncome - f.opex), 0) / annualFlows.length
        : 0;
    const lastFlow = annualFlows[annualFlows.length - 1] || { grossIncome: 0, opex: 0 };
    const exitYearCashflow = kpis.exitValue + (lastFlow.grossIncome - lastFlow.opex);
    const yieldOnCost = totalInvestment > 0 ? (noi1 / totalInvestment) * 100 : 0;

    // Sentence 1: Asset overview
    const s1 = `Activo con inversión total de ${fmt(totalInvestment)}${initialCapex > 0 ? ` (precio ${fmt(initialMarketValue)} + CAPEX ${fmt(initialCapex)})` : ''}, calificación energética ${rating || 'no disponible'} y una TIR proyectada del ${pct(kpis.irr)}.`;

    // Sentence 2: Operational profitability
    const s2 = `El NOI del primer año es ${fmt(noi1)} (NOI promedio ${fmt(avgNoi)}), con una tasa de vacancia del ${pct(vacancyRatePercent)} y un Yield sobre la inversión del ${pct(yieldOnCost)}.`;

    // Sentence 3: NPV & value creation
    const s3 = kpis.npv > 0
        ? `El VAN del proyecto es ${fmt(kpis.npv)}, lo que confirma que el activo genera valor por encima del coste de capital.`
        : `El VAN del proyecto es ${fmt(kpis.npv)}, señal de que los flujos actuales no superan el coste de capital al descuento aplicado.`;

    // Sentence 4: Rehab / Green Premium
    const s4 = comparison.isGreenPremium && comparison.irrDelta > 0
        ? `La rehabilitación genera un Green Premium real: +${pct(comparison.irrDelta)} de TIR adicional frente al escenario sin inversión (${pct(comparison.baselineIRR)} → ${pct(comparison.currentIRR)}).`
        : initialCapex > 0
            ? `El CAPEX invertido (${fmt(initialCapex)}) no genera Green Premium apreciable en este horizonte; la TIR baja ${pct(Math.abs(comparison.irrDelta))} frente al escenario base.`
            : `Sin CAPEX de rehabilitación planificado. La TIR base del ${pct(kpis.irr)} se sostiene en los flujos operativos actuales.`;

    // Sentence 5: Regulatory risk
    const s5 = rating
        ? isEPBDRisk
            ? `La calificación ${rating} sitúa al activo en zona de riesgo regulatorio EPBD (Directiva Europea). Sin intervención, el 'Brown Discount' puede erosionar el valor de salida.`
            : `La calificación ${rating} no genera presión regulatoria inmediata bajo la Directiva EPBD vigente.`
        : `Sin certificado energético registrado; el riesgo regulatorio EPBD se evalúa por heurística (vacancia + capex).`;

    // Sentence 6: Exit year projection
    const s6 = `En el año de salida se proyecta un retorno total de ${fmt(exitYearCashflow)} (operativo + valor de desinversión de ${fmt(kpis.exitValue)}).`;

    // Sentence 7: strategy
    const s7 = recommendation === 'VENDER'
        ? `Conclusión: la estrategia óptima es la ROTACIÓN del activo, dado el deterioro operativo o la baja eficiencia del CAPEX requerido.`
        : recommendation === 'REHABILITAR'
            ? `Conclusión: la estrategia óptima es la INVERSIÓN (Score ${rehabScore}/100); la rehabilitación eleva rentas, mitiga riesgo regulatorio y maximiza el valor de salida.`
            : `Conclusión: la estrategia óptima es la GESTIÓN patrimonial (Hold, Score ${holdScore}/100); los flujos son estables y no hay urgencias regulatorias ni operativas que justifiquen desinversión.`;

    const storyTelling = [s1, s2, s3, s4, s5, s6, s7].join(' ');

    // Construct the legacy 'strategy' object
    const mainStrategy = strategicPaths[recommendation === 'REHABILITAR' ? 'rehab' : (recommendation === 'VENDER' ? 'sell' : 'hold')];

    const strategy: StrategicRecommendation = {
        action: recommendation,
        title: `ESTRATEGIA RECOMENDADA: ${recommendation}`,
        description: mainStrategy.description,
        argument: storyTelling
    };

    // Populate summaryList for the small card view
    const summaryList: string[] = []; // Init [FIXED]
    if (recommendation === 'REHABILITAR') {
        summaryList.push("Oportunidad de Green Premium.");
        summaryList.push("Mitigación de riesgo regulatorio.");
    } else if (recommendation === 'VENDER') {
        summaryList.push("Rentabilidad inferior al objetivo.");
        summaryList.push("Riesgo de pérdida de valor.");
    } else {
        summaryList.push("Flujos de caja estables.");
        summaryList.push("Perfil de riesgo bajo.");
    }

    // Main Diagnosis Text
    const diagnosis = `TIR ${kpis.irr.toFixed(1)}%. ${recommendation} es la opción óptima (Score: ${maxScore}/100).`;

    // Generate Cash Flow Trajectory for Evidence Section
    const cashFlowTrajectory = annualFlows.map((flow, index) => {
        const isLast = index === annualFlows.length - 1;
        const operationalNet = flow.grossIncome - flow.opex; // NOI
        // FCF = NOI - Capex. (Assuming flow.capex is the annual capex)
        // Note: initialCapex is Year 0, not included here.
        const fcf = operationalNet - flow.capex;

        if (isLast) {
            return {
                year: `Año ${flow.year} (Salida)`,
                amount: fcf + kpis.exitValue,
                label: 'Operación + Venta'
            };
        }
        return {
            year: `Año ${flow.year}`,
            amount: fcf,
            label: ''
        };
    });

    return {
        diagnosis,
        valuation,
        risks,
        strategy,
        summary: summaryList,
        comparison,
        strategicPaths,
        storyTelling,
        totalExitYearCashflow: kpis.exitValue + (annualFlows[annualFlows.length - 1]?.grossIncome - annualFlows[annualFlows.length - 1]?.opex || 0),
        cashFlowTrajectory
    };
};
