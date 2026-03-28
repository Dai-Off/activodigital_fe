import React, { useState, useMemo, useEffect } from 'react';
// import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Calculator, Undo, Redo, Trash2, Download, Info } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { RichTooltip } from "~/components/ui/RichTooltip";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import { ProjectParametersCard, AnnualFlowsGrid } from './FinancialInputSection';
import { BuildingSelector } from './BuildingSelector';


import { CashflowChartV2 } from './CashflowChartV2';
import { SensitivityChart } from './SensitivityChart';
import { KPIGrid } from './KPIGrid';
import { AIRecommendationsPanel } from './AIRecommendationsPanel';
import { AdvancedAnalysisModal } from './AdvancedAnalysisModal';
import { PriceEvolutionModal } from './PriceEvolutionModal';

import {
    calculateProjectKPIs,
    generateCashflowData,
    generateSensitivityData,
    generatePaybackEvolution,
    type FinancialProjectState,
    type AnnualFlow
} from '../../services/mockFinancialData';
import { generateAdvancedAnalysis } from '../../services/aiAnalysisService';
import { exportProjectToExcel } from '../../services/financialExportService';

import { type Building } from '../../services/buildingsApi';

// import { IdealistaService } from '../../services/IdealistaService';
import { MarketDataService, type MarketData } from '../../services/MarketDataService';
// import { GreenImpactControls } from './GreenImpactControls'; // Moved to KPIGrid
import { EnergyCertificatesService } from '../../services/energyCertificates';


// Helper for Energy Rating Colors
const getEnergyRatingColor = (rating: string | null) => {
    if (!rating) return "bg-slate-300 !text-slate-600";
    const r = rating.toUpperCase();
    if (['A', 'B'].includes(r)) return "bg-emerald-500";
    if (['C', 'D'].includes(r)) return "bg-yellow-500";
    if (['E'].includes(r)) return "bg-orange-500";
    return "bg-red-500"; // F, G
};

export const FinancialCalculatorV2: React.FC = () => {

    // 1. Centralized Project State
    const [project, setProject] = useState<FinancialProjectState>({
        timeHorizonYears: 4,
        initialMarketValue: 0,
        initialCapex: 0,
        discountRatePercent: 0,
        exitValue: 0,
        vacancyRatePercent: 0, // [NEW] Init
        marketYieldPercent: 5,  // [NEW] Init
        annualFlows: []
    });

    // 1.1 History State for Undo/Redo
    const [history, setHistory] = useState<FinancialProjectState[]>([]);
    const [future, setFuture] = useState<FinancialProjectState[]>([]);
    const lastSnapshot = React.useRef<FinancialProjectState>(project);

    // 1.2 Analysis Modal State (Centralized)
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

    // 1.3 Selected Building State
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const [loadingMarketData, setLoadingMarketData] = useState(false);

    // [NEW] Green Factor State
    const [energyRating, setEnergyRating] = useState<string | null>(null);
    const [greenModifiers, setGreenModifiers] = useState<{ discountRateDelta: number; exitYieldDelta: number }>({ discountRateDelta: 0, exitYieldDelta: 0 });

    // [NEW] Price Evolution Modal State
    const [isPriceEvolutionOpen, setIsPriceEvolutionOpen] = useState(false);

    // [NEW] Price Evolution Modal State Variant
    const [priceEvolutionVariant, setPriceEvolutionVariant] = useState<'idealista' | 'ine' | 'registradores'>('idealista');

    // [NEW] Registered Price State
    const [registeredPrice, setRegisteredPrice] = useState<number | null>(null);

    // [NEW] INE Price State
    const [inePrice, setInePrice] = useState<number | null>(null);

    // [NEW] Wizard Step State
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    // [NEW] Suggested Exit Value State
    const [suggestedExitValue, setSuggestedExitValue] = useState<number | null>(null);
    const [suggestedExitValueSource, setSuggestedExitValueSource] = useState<string | null>(null);

    // [NEW] Suggested Discount Rate State
    const [suggestedDiscountRate, setSuggestedDiscountRate] = useState<number | null>(null);
    const [interestRateSource, setInterestRateSource] = useState<string | null>(null);
    const RISK_PREMIUM = 2.5; // Standard risk premium as requested by user

    // Validate Analysis Readiness
    const isAnalysisReady = useMemo(() => {
        if (!project || project.annualFlows.length < project.timeHorizonYears) return false;
        // Check if the LAST year has data (Gross Income or Opex > 0)
        // User Requirement: "esperar a que el user ingrese los datos del último año"
        const lastFlow = project.annualFlows[project.timeHorizonYears - 1];
        return lastFlow && (lastFlow.grossIncome > 0 || lastFlow.opex > 0);
    }, [project.annualFlows, project.timeHorizonYears]);

    // [FIX] Keep project.energyRating in sync with the energyRating React state.
    // This handles the timing issue: the certificate fetch is async, so energyRating
    // may be set AFTER the initial setProject() call. Without this, generateAdvancedAnalysis
    // receives project.energyRating = null even though the UI badge shows the correct rating.
    useEffect(() => {
        if (project.energyRating !== energyRating) {
            setProject(prev => ({ ...prev, energyRating }));
        }
    }, [energyRating]);

    // [NEW] Derived location for price evolution chart in CFO modal
    const derivedMunicipality = useMemo(() => {
        if (selectedBuilding?.municipality) return selectedBuilding.municipality;
        if (marketData?.regionName) {
            if (marketData.regionName.includes("Madrid")) return "Madrid";
            if (marketData.regionName.includes("Barcelona")) return "Barcelona";
            if (marketData.regionName.includes("Valencia")) return "Valencia";
            if (marketData.regionName.includes("Sevilla")) return "Sevilla";
            if (marketData.regionName.includes("Málaga")) return "Málaga";
        }
        return (selectedBuilding as any)?.city || null;
    }, [selectedBuilding, marketData]);

    const derivedProvince = useMemo(() => {
        if (selectedBuilding?.province) return selectedBuilding.province;
        if (marketData?.regionName?.includes("Madrid")) return "Madrid";
        if (marketData?.regionName?.includes("Barcelona")) return "Barcelona";
        return null;
    }, [selectedBuilding, marketData]);

    // [NEW] Fetch Market Data when building changes
    useEffect(() => {
        const fetchMarketData = async () => {
            if (selectedBuilding) {
                setCurrentStep(2); // Move to Step 2 when building selected
                setLoadingMarketData(true);
                setMarketData(null);
                setRegisteredPrice(null); // Reset
                setInePrice(null); // Reset
                setSuggestedExitValue(null);
                setSuggestedExitValueSource(null);
                setEnergyRating(null); // Reset
                try {
                    // DERIVE LOCATION for INE/Idealista
                    let municipality = selectedBuilding.municipality;
                    let province = selectedBuilding.province;

                    // Fallback logic if properties missing (simulating logic from modal)
                    if (!municipality && !province) {
                        // Try to parse from address or assume Madrid for demo if applicable?
                        // For now, if we have a robust building object, these should exist.
                        if (selectedBuilding.address && selectedBuilding.address.includes("Madrid")) {
                            municipality = "Madrid";
                            province = "Madrid";
                        }
                    }

                    // 1. Fetch INE Data (Ayuntamientos)
                    if (municipality || province) {
                        try {
                            const ineData = await MarketDataService.getProjectedPriceEvolution(municipality || '', province || '');
                            // Find latest history point
                            const latestHistory = [...ineData]
                                .filter(d => d.type === 'history')
                                .sort((a, b) => b.year - a.year)[0];

                            if (latestHistory) {
                                setInePrice(latestHistory.price);
                            }
                        } catch (e) {
                            console.error("Error fetching INE price", e);
                        }
                    }

                    // PREFERRED: Fetch by ID (Direct from DB after Cron Update)
                    let data = await MarketDataService.getMarketDataByBuildingId(selectedBuilding.id);

                    // [NEW] Fetch Registered Price (Real Data from Registradores)
                    let registradoresHistory = null;
                    try {
                        registradoresHistory = await MarketDataService.getRegistradoresHistory(municipality || '', province || '');
                        if (registradoresHistory && registradoresHistory.length > 0) {
                            // Assumes history is sorted ascending by date in service
                            const historyOnly = registradoresHistory.filter(d => d.type === 'history');
                            if (historyOnly.length > 0) {
                                const latest = historyOnly[historyOnly.length - 1];
                                setRegisteredPrice(latest.price);
                            } else {
                                setRegisteredPrice(null);
                            }
                        } else {
                            setRegisteredPrice(null);
                        }
                    } catch (e) {
                        console.error("Error fetching registradores price", e);
                        setRegisteredPrice(null);
                    }

                    // FALLBACK: If no ID-based data, try address (e.g. for legacy compatibility)
                    if (!data && selectedBuilding.address) {
                        data = await MarketDataService.getMarketDataByAddress(selectedBuilding.address);
                    }

                    setMarketData(data);

                    // [NEW] Fetch Energy Rating
                    let foundRating: string | null = null;
                    try {
                        console.log("[EnergyCert] Fetching certificates for building:", selectedBuilding.id, selectedBuilding.name);
                        const certs = await EnergyCertificatesService.getByBuildingDirect(selectedBuilding.id);
                        console.log("[EnergyCert] Raw API response:", certs);
                        console.log("[EnergyCert] Certificates array:", certs?.certificates);
                        console.log("[EnergyCert] Certificates length:", certs?.certificates?.length);

                        // Find the most recent confirmed certificate
                        if (certs && certs.certificates && certs.certificates.length > 0) {
                            console.log("[EnergyCert] Looking for valid cert with rating...");
                            const validCert = certs.certificates.find(c => c.rating);
                            console.log("[EnergyCert] Valid cert found:", validCert);
                            if (validCert) {
                                foundRating = validCert.rating;
                                console.log("[EnergyCert] Rating extracted:", foundRating);
                            }
                        } else {
                            console.log("[EnergyCert] No certificates found in response");
                        }
                    } catch (e) {
                        console.error("[EnergyCert] Error fetching certificates:", e);
                    }

                    // Fallback to building property if no certificate found
                    if (!foundRating && selectedBuilding.energy_certification) {
                        console.log("[EnergyCert] Using fallback from building.energy_certification:", selectedBuilding.energy_certification);
                        foundRating = selectedBuilding.energy_certification;
                    }

                    console.log("[EnergyCert] FINAL RATING TO DISPLAY:", foundRating);

                    // [FIX] Sync the energyRating React state so the UI badge reflects the cert
                    setEnergyRating(foundRating);


                    // [DEBUG] Log full object to identify correct property
                    console.log("[FinancialCalculator] Loaded Building:", selectedBuilding);
                    console.log("[FinancialCalculator] Loaded Market Data:", data);

                    // [NEW] Update Project State with Market Logic for AI Analysis
                    // Check multiple variations for surface area
                    let surface = (selectedBuilding as any).squareMeters ||
                        (selectedBuilding as any).surface_area ||
                        (selectedBuilding as any).square_meters ||
                        0;

                    let marketPrice = data?.priceM2 || 0;

                    // Estimate surface if 0 but we have initial price and a market reference
                    if (surface === 0 && selectedBuilding.price) {
                        // Quick way to get the current latest registered price available in the closure
                        const regHistoryOnly = registradoresHistory?.filter(d => d.type === 'history') || [];
                        const currentRegPrice = regHistoryOnly.length > 0 ? regHistoryOnly[regHistoryOnly.length - 1].price : null;

                        const refPrice = marketPrice || currentRegPrice || 0;
                        if (refPrice > 0) {
                            surface = selectedBuilding.price / refPrice;
                            console.log(`[FinancialCalculator] Estimated surface area: ${surface} m²`);
                        }
                    }

                    // [DEMO] Hardcode price for "Sol Central" if no market data
                    if (selectedBuilding.name && selectedBuilding.name.includes("Sol Central")) {
                        if (!marketPrice) marketPrice = 4500; // Fallback price for demo
                    }

                    // [NEW] Compute Suggested Exit Value based on 5-year projections
                    let projectedPrice5Y = null;
                    let projectionSource = null;

                    if (registradoresHistory && registradoresHistory.length > 0) {
                        const lastProj = registradoresHistory[registradoresHistory.length - 1];
                        if (lastProj.type === 'projection') {
                            projectedPrice5Y = lastProj.price;
                            projectionSource = "transacciones reales de Registradores";
                        }
                    }

                    if (!projectedPrice5Y) {
                        try {
                            const localIneData = await MarketDataService.getProjectedPriceEvolution(municipality || '', province || '');
                            if (localIneData && localIneData.length > 0) {
                                const lastProj = localIneData[localIneData.length - 1];
                                if (lastProj.type === 'projection') {
                                    projectedPrice5Y = lastProj.price;
                                    projectionSource = "tendencia del IPVVR (INE)";
                                }
                            }
                        } catch (e) {
                            console.error("Error fetching fallback INE projection", e);
                        }
                    }

                    // Strict fallback: If no robust projection, use current market price to still provide a baseline
                    if (!projectedPrice5Y && surface > 0) {
                        const regHistoryOnly = registradoresHistory?.filter(d => d.type === 'history') || [];
                        const currentRegPrice = regHistoryOnly.length > 0 ? regHistoryOnly[regHistoryOnly.length - 1].price : null;

                        projectedPrice5Y = currentRegPrice || marketPrice || 0;
                        projectionSource = "precio actual de mercado (sin crecimiento proyectado)";
                    }

                    let calculatedSuggestedExit = null;
                    if (projectedPrice5Y && surface > 0) {
                        calculatedSuggestedExit = projectedPrice5Y * surface;
                        setSuggestedExitValue(calculatedSuggestedExit);
                        setSuggestedExitValueSource(projectionSource);
                    } else {
                        setSuggestedExitValue(null);
                        setSuggestedExitValueSource(null);
                    }

                    // [NEW] Fetch Regional Interest Rate for Discount Rate Suggestion
                    try {
                        const avgFixedRate = await MarketDataService.getRegionalInterestRate(province || municipality || '');
                        if (avgFixedRate) {
                            setSuggestedDiscountRate(avgFixedRate + RISK_PREMIUM);
                            setInterestRateSource(`${avgFixedRate.toLocaleString('es-ES', { minimumFractionDigits: 2 })}% (Tipo fijo medio en ${province || selectedBuilding.province || 'la región'})`);
                        } else {
                            // Fallback to a reasonable default if DB has no data for the region
                            const defaultRate = 3.5;
                            setSuggestedDiscountRate(defaultRate + RISK_PREMIUM);
                            setInterestRateSource(`${defaultRate.toLocaleString('es-ES', { minimumFractionDigits: 2 })}% (Promedio de mercado estimado)`);
                        }
                    } catch (e) {
                        console.error("Error fetching regional interest rate", e);
                        setSuggestedDiscountRate(6.0); // 3.5 + 2.5
                        setInterestRateSource("Promedio de mercado (estimado)");
                    }

                    // [NEW] Fetch Vacancy Rate from DB
                    let vacancyRate = 0;
                    try {
                        // Dynamic import to avoid circular dependencies if any, or just standard import usage
                        // Assuming BuildingsApiService is available
                        const { BuildingsApiService } = await import('../../services/buildingsApi');
                        const stats = await BuildingsApiService.getBuildingUnitsStats(selectedBuilding.id);

                        console.log("[FinancialCalculator] Loaded Unit Stats:", stats);

                        if (stats.totalUnits > 0) {
                            vacancyRate = parseFloat(stats.vacancyRate.toFixed(2));
                        }
                    } catch (e) {
                        console.error("Error fetching vacancy stats", e);
                    }

                    // [NEW] RESET COMPLETE STATE - Only populate building-specific data
                    // This ensures switching buildings clears all previous form data
                    setProject({
                        timeHorizonYears: 5, // Set default to 5 years so exit value aligns with projection
                        initialMarketValue: selectedBuilding.price || 0,
                        initialCapex: 0,
                        discountRatePercent: 0,
                        exitValue: calculatedSuggestedExit ? Math.round(calculatedSuggestedExit) : 0,
                        vacancyRatePercent: vacancyRate,
                        marketYieldPercent: 5,
                        marketPricePerSqm: marketPrice,
                        surfaceArea: surface,
                        energyRating: foundRating,
                        annualFlows: []
                    });

                } catch (err) {
                    console.error("Failed to load market data", err);
                } finally {
                    setLoadingMarketData(false);
                }
            } else {
                setCurrentStep(1); // Return to Step 1 if no building
                setMarketData(null);
                setInePrice(null);
                setEnergyRating(null);
                // Reset optional fields
                setProject(prev => ({
                    ...prev,
                    marketPricePerSqm: undefined,
                    surfaceArea: undefined,
                    initialMarketValue: 0, // Reset if no building selected
                    energyRating: null
                }));
            }
        };
        fetchMarketData();
    }, [selectedBuilding]);

    const handleProjectChange = (newState: FinancialProjectState, commit = false) => {
        if (commit) {
            // Check if actual changes occurred compared to last snapshot
            if (JSON.stringify(newState) !== JSON.stringify(lastSnapshot.current)) {
                setHistory(prev => [...prev, lastSnapshot.current]);
                setFuture([]);
                lastSnapshot.current = newState;
            }
        }
        setProject(newState);
    };

    const undo = () => {
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        const newHistory = history.slice(0, -1);
        setFuture(prev => [project, ...prev]);
        setProject(previous);
        setHistory(newHistory);
        lastSnapshot.current = previous;
    };

    const redo = () => {
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);
        setHistory(prev => [...prev, project]);
        setProject(next);
        setFuture(newFuture);
        lastSnapshot.current = next;
    };

    // 2. Initialize Flows Logic
    useEffect(() => {
        // Initial population
        if (project.annualFlows.length === 0) {
            const defaultRent = 0;
            const defaultOpex = 0;
            const flows: AnnualFlow[] = [];
            for (let i = 1; i <= project.timeHorizonYears; i++) {
                flows.push({
                    year: i,
                    grossIncome: defaultRent * Math.pow(1.02, i - 1),
                    opex: defaultOpex * Math.pow(1.02, i - 1),
                    capex: 0
                });
            }
            setProject(prev => ({ ...prev, annualFlows: flows }));
        }
        // Sync Length if Horizon Changes
        else if (project.annualFlows.length !== project.timeHorizonYears) {
            const currentLength = project.annualFlows.length;
            const targetLength = project.timeHorizonYears;
            let newFlows = [...project.annualFlows];

            if (currentLength < targetLength) {
                const lastFlow = newFlows[currentLength - 1] || { year: 0, grossIncome: 0, opex: 0, capex: 0 };
                for (let i = currentLength + 1; i <= targetLength; i++) {
                    newFlows.push({
                        year: i,
                        grossIncome: lastFlow.grossIncome * 1.02, // Continue trend
                        opex: lastFlow.opex * 1.02,
                        capex: 0
                    });
                }
            } else {
                newFlows = newFlows.slice(0, targetLength);
            }
            setProject(prev => ({ ...prev, annualFlows: newFlows }));
        }
    }, [project.timeHorizonYears, project.annualFlows.length]);

    // 3. Calculate KPIs
    const kpis = useMemo(() => calculateProjectKPIs(project, greenModifiers), [project, greenModifiers]);

    // 4. Chart Data
    const cashflowData = useMemo(() => generateCashflowData(project, kpis), [project, kpis]);
    const sensitivityData = useMemo(() => generateSensitivityData(project), [project]);
    const paybackData = useMemo(() => generatePaybackEvolution(project), [project]);

    // 4.1 NOI Data for Evolution Chart
    const noiData = useMemo(() => {
        const vacancyRate = (project.vacancyRatePercent || 0) / 100;
        return project.annualFlows.map(flow => {
            const effectiveGrossIncome = flow.grossIncome * (1 - vacancyRate);
            const netNoi = effectiveGrossIncome - flow.opex - flow.capex;
            return { year: flow.year, value: netNoi };
        });
    }, [project.annualFlows, project.vacancyRatePercent]);

    // 4.1.1 Advanced Analysis for Status Logic (Lifted up to share with KPIGrid)
    const advancedAnalysis = useMemo(() => {
        if (!project.annualFlows.length) return null;
        // [NEW] Disable analysis if waiting for data (Sync with Panel Logic)
        if (!isAnalysisReady) return null;

        // [FIX] Always inject the current energyRating React state into the project
        // before analysis. This ensures the analysis uses the correct rating even if
        // project.energyRating hasn't been synced yet via the useEffect.
        const projectWithRating = energyRating !== project.energyRating
            ? { ...project, energyRating }
            : project;

        return generateAdvancedAnalysis(projectWithRating, kpis);
    }, [project, kpis, isAnalysisReady, energyRating]);

    // 4.2 Yield Data for Evolution Chart
    const yieldData = useMemo(() => {
        const vacancyRate = (project.vacancyRatePercent || 0) / 100;
        const totalInvestment = project.initialMarketValue + project.initialCapex;

        if (totalInvestment === 0) return [];

        return project.annualFlows.map(flow => {
            const effectiveGrossIncome = flow.grossIncome * (1 - vacancyRate);
            const netNoi = effectiveGrossIncome - flow.opex - flow.capex;
            const yieldVal = (netNoi / totalInvestment) * 100;
            return { year: flow.year, value: yieldVal };
        });
    }, [project.annualFlows, project.vacancyRatePercent, project.initialMarketValue, project.initialCapex]);


    const handleLoadSession = (loadedState: FinancialProjectState) => {
        handleProjectChange(loadedState, true);
    };

    const handleReset = () => {
        const cleanState: FinancialProjectState = {
            timeHorizonYears: 4,
            initialMarketValue: 0,
            initialCapex: 0,
            discountRatePercent: 0,
            exitValue: 0,
            vacancyRatePercent: 0,
            marketYieldPercent: 5,
            annualFlows: []
        };
        handleProjectChange(cleanState, true);
    };

    return (
        <div className="flex flex-col h-full bg-[#f4f7f9] overflow-hidden font-inter text-slate-800">
            {selectedBuilding && (
                <div className="flex-none bg-white border-b border-slate-200 p-3 shadow-sm z-30">
                    <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-2">
                        <div className="flex items-center gap-3 order-1 flex-shrink-0">
                            <div className="p-1.5 bg-blue-600 rounded-lg shadow-blue-200 shadow-md">
                                <Calculator className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-slate-900 truncate">Calculadora Arkia</h1>
                                <p className="hidden md:block text-[10px] text-slate-500 font-medium uppercase tracking-wider">Enterprise Property Analysis</p>
                            </div>
                        </div>

                        {currentStep === 3 && (
                            <div className="flex items-center gap-2 order-2 md:order-3 ml-auto">
                                {/* Undo/Redo Container - Aligned height to 32px (h-8) to match other buttons perfectly */}
                                <div className="flex items-center h-8 px-0.5 bg-slate-50/80 rounded-md border border-slate-200/80">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[4px] text-slate-500 hover:text-blue-600 hover:bg-white" onClick={undo} disabled={history.length === 0} title="Deshacer (Ctrl+Z)">
                                        <Undo className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[4px] text-slate-500 hover:text-blue-600 hover:bg-white" onClick={redo} disabled={future.length === 0} title="Rehacer (Ctrl+Y)">
                                        <Redo className="h-4 w-4" />
                                    </Button>
                                </div>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3 border-slate-200 text-slate-600 hover:bg-slate-50" disabled={!selectedBuilding}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline ml-1.5">Limpiar</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-[400px]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esto borrará todos los datos ingresados en la sesión actual. Esta acción no se puede deshacer.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">Limpiar Todo</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <Button
                                    variant="default"
                                    size="sm"
                                    className="h-8 px-2 sm:px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
                                    onClick={() => exportProjectToExcel(project, kpis, advancedAnalysis, selectedBuilding)}
                                    disabled={!selectedBuilding}
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline ml-1.5">Exportar Excel</span>
                                    <span className="sm:hidden ml-1.5">Exportar</span>
                                </Button>
                            </div>
                        )}

                        <div className="w-full md:w-auto md:flex-1 md:max-w-md order-3 md:order-2">
                            <BuildingSelector onSelect={setSelectedBuilding} selectedId={selectedBuilding?.id} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto p-4 sm:p-5 pb-20 scrollbar-thin scrollbar-thumb-slate-200">
                {!selectedBuilding ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
                        <div className="w-full max-w-[320px] mb-8 flex items-center justify-center">
                            <img src="/logoArkia.png" alt="Arkia Logo" className="w-full h-auto object-contain drop-shadow-sm" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bienvenido</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">Comienza el análisis financiero inteligente seleccionando un activo inmobiliario.</p>

                        <div className="w-full max-w-md mx-auto">
                            <BuildingSelector onSelect={setSelectedBuilding} selectedId={undefined} />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 0. Context Bar (Building Info) */}
                        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${getEnergyRatingColor(energyRating)}`}>
                                    {energyRating || '-'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {selectedBuilding.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {selectedBuilding.address}
                                        {project.surfaceArea ? ` • ${Math.round(project.surfaceArea).toLocaleString('es-ES')} m²` : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Market Price Display - SPLIT LAYOUT */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 sm:pl-4 sm:border-l sm:border-slate-200">

                                {/* 1. Data Ayuntamientos (INE) - Clickable */}
                                <div
                                    className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                        setPriceEvolutionVariant('ine');
                                        setIsPriceEvolutionOpen(true);
                                    }}
                                    title="Ver histórico de Data Ayuntamientos"
                                >
                                    <span className="text-[10px] text-slate-500">Datos Ayuntamientos</span>
                                    <span className="text-sm font-bold text-blue-600 underline decoration-dotted decoration-blue-300 underline-offset-4">
                                        {loadingMarketData ? (
                                            <span className="loading-wave flex items-center justify-end gap-0.5">
                                                <span>.</span><span>.</span><span>.</span>
                                            </span>
                                        ) : (
                                            inePrice ? `€${inePrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/m²` : "N/A"
                                        )}
                                    </span>
                                </div>

                                {/* 2. Datos Compra Venta (Registradores) - Clickable */}
                                <div
                                    className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                        setPriceEvolutionVariant('registradores');
                                        setIsPriceEvolutionOpen(true);
                                    }}
                                    title="Ver histórico de Registradores"
                                >
                                    <span className="text-[10px] text-slate-500">Datos Compra Venta</span>
                                    <span className="text-sm font-bold text-blue-600 underline decoration-dotted decoration-blue-300 underline-offset-4">
                                        {loadingMarketData ? (
                                            <span className="loading-wave flex items-center justify-end gap-0.5">
                                                <span>.</span><span>.</span><span>.</span>
                                            </span>
                                        ) : (
                                            registeredPrice ? `€${registeredPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/m²` : "N/A"
                                        )}
                                    </span>
                                </div>

                                {/* 3. Expectativa del Mercado (Idealista) - Clickable */}
                                <div
                                    className="hidden flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                        setPriceEvolutionVariant('idealista');
                                        setIsPriceEvolutionOpen(true);
                                    }}
                                    title="Ver histórico de Idealista"
                                >
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-slate-500">Expectativa del Mercado</span>
                                        {marketData && marketData.trendAnnual && (
                                            <span className={`text-[9px] font-medium ${marketData.trendAnnual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ({marketData.trendAnnual > 0 ? '+' : ''}{marketData.trendAnnual}%)
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-blue-600 underline decoration-dotted decoration-blue-300 underline-offset-4">
                                        {loadingMarketData ? (
                                            <span className="loading-wave flex items-center justify-end gap-0.5">
                                                <span>.</span><span>.</span><span>.</span>
                                            </span>
                                        ) : (
                                            marketData ? `${marketData.priceM2.toLocaleString('es-ES')} €/m²` : "N/A"
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Price Evolution Modal */}
                            <PriceEvolutionModal
                                isOpen={isPriceEvolutionOpen}
                                onClose={setIsPriceEvolutionOpen}
                                variant={priceEvolutionVariant}
                                municipality={derivedMunicipality}
                                province={derivedProvince}
                                buildingName={selectedBuilding?.name}
                                address={selectedBuilding?.address}
                            />
                        </div>

                        {/* ROW 1: INPUTS */}
                        {currentStep >= 2 && (
                            <div className={`grid grid-cols-12 gap-4 ${currentStep === 2 ? 'justify-center' : ''}`}>

                                {/* 1. Project Parameters (Left) */}
                                {currentStep === 2 ? (
                                    <div className="col-span-12 lg:col-span-6 lg:col-start-4 w-full flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
                                        <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-6 sm:p-10 text-center relative overflow-hidden mt-8">
                                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Parámetros Iniciales</h2>
                                            <p className="text-slate-500 mb-8 max-w-md mx-auto">Confirma o ajusta los valores clave antes de desplegar la calculadora financiera.</p>

                                            <div className="space-y-6 text-left max-w-sm mx-auto">
                                                {/* Horizon */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Horizonte Temporal (Años)</label>
                                                    <input
                                                        type="number"
                                                        min={1} max={25}
                                                        value={project.timeHorizonYears}
                                                        onChange={(e) => handleProjectChange({ ...project, timeHorizonYears: parseInt(e.target.value) || 0 })}
                                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-lg outline-none"
                                                    />
                                                    <p className="text-[11px] text-slate-400 mt-1">Sugerido por defecto a 5 años según analítica de mercado.</p>
                                                </div>

                                                {/* Initial Value */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Valor Inicial del Activo (€)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium border-r border-slate-200 pr-2">€</span>
                                                        <input
                                                            type="number"
                                                            value={project.initialMarketValue}
                                                            onChange={(e) => handleProjectChange({ ...project, initialMarketValue: parseFloat(e.target.value) || 0 })}
                                                            className="w-full p-3 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-lg outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Exit Value */}
                                                <div>
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <label className="block text-sm font-semibold text-slate-700">Valor de Salida Estimado (€)</label>
                                                        <RichTooltip
                                                            trigger={<Info className="h-4 w-4 text-emerald-500 cursor-help hover:text-emerald-600 mt-0.5 flex-shrink-0" />}
                                                            title="Cálculo del Valor Sugerido"
                                                            description="El valor de salida sugerido se auto-calcula cruzando la superficie del activo con proyecciones de mercado."
                                                            goldenRule={{
                                                                label: "Fórmula Detallada:",
                                                                text: `${Math.round(project.surfaceArea || 0).toLocaleString('es-ES')} m² × ${(suggestedExitValue ? suggestedExitValue / (project.surfaceArea || 1) : 0).toLocaleString('es-ES', { maximumFractionDigits: 0 })} €/m² = ${Math.round(suggestedExitValue || 0).toLocaleString('es-ES')} €`
                                                            }}
                                                            examples={{
                                                                label: "Fuentes de Cálculo:",
                                                                items: [
                                                                    `Superficie: Tomada de los datos del edificio.`,
                                                                    `Precio/m²: Basado en ${suggestedExitValueSource || 'tendencia de la región'} para el año ${new Date().getFullYear() + project.timeHorizonYears}.`,
                                                                    "El diferencial vs el precio inicial suele deberse a que la adquisición fue a precio 'oportunidad' o fuera de mercado."
                                                                ]
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium border-r border-slate-200 pr-2">€</span>
                                                        <input
                                                            type="number"
                                                            value={project.exitValue}
                                                            onChange={(e) => handleProjectChange({ ...project, exitValue: parseFloat(e.target.value) || 0 })}
                                                            className="w-full p-3 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-lg outline-none"
                                                        />
                                                    </div>
                                                    {suggestedExitValue && (
                                                        <div className="mt-2 flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                            <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex-grow">
                                                                Sugerencia Arkia: <span className="font-bold">{(suggestedExitValue / 1000000).toLocaleString('es-ES', { maximumFractionDigits: 1 })}M €</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Discount Rate */}
                                                <div>
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <label className="block text-sm font-semibold text-slate-700">Tasa de Descuento (%)</label>
                                                        <RichTooltip
                                                            trigger={<Info className="h-4 w-4 text-blue-500 cursor-help hover:text-blue-600 mt-0.5 flex-shrink-0" />}
                                                            title="Sugerencia de Tasa de Descuento"
                                                            description="Un CFO calcula esta tasa usando el coste del capital (WACC)."
                                                            goldenRule={{
                                                                label: "Metodología Arkia:",
                                                                text: "Tipo de Interés Fijo Medio + Diferencial de Riesgo (2,50%)"
                                                            }}
                                                            examples={{
                                                                label: "Componentes del Cálculo:",
                                                                items: [
                                                                    `Interés de Referencia: ${interestRateSource || 'Dato no disponible para esta zona'}.`,
                                                                    "Diferencial: Prima de riesgo estándar del 2,50% para activos inmobiliarios.",
                                                                    suggestedDiscountRate ? `Sugerencia total: ${suggestedDiscountRate.toLocaleString('es-ES', { minimumFractionDigits: 2 })}%` : "Se recomienda usar un valor entre 5% y 8% según el activo."
                                                                ]
                                                            }}
                                                            footer="* Puedes ajustar este valor según tu perfil de riesgo específico."
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={project.discountRatePercent}
                                                            onChange={(e) => handleProjectChange({ ...project, discountRatePercent: parseFloat(e.target.value) || 0 })}
                                                            className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-lg outline-none"
                                                        />
                                                    </div>
                                                    {suggestedDiscountRate && (
                                                        <div className="mt-2 flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                            <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex-grow">
                                                                Sugerencia CFO: <span className="font-bold">{suggestedDiscountRate.toLocaleString('es-ES', { minimumFractionDigits: 2 })}%</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-10 max-w-sm mx-auto">
                                                <Button
                                                    size="lg"
                                                    className="w-full h-14 text-[16px] font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 rounded-lg"
                                                    onClick={() => setCurrentStep(3)}
                                                >
                                                    Continuar a la Calculadora
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-4 animate-in fade-in duration-300">
                                        <ProjectParametersCard
                                            projectState={project}
                                            onChange={handleProjectChange}
                                            suggestedExitValue={suggestedExitValue}
                                            suggestedExitValueSource={suggestedExitValueSource}
                                            suggestedDiscountRate={suggestedDiscountRate}
                                            interestRateSource={interestRateSource}
                                        />
                                    </div>
                                )}

                                {/* 2. Annual Flows (Middle) THIS IS STEP 3 ONLY */}
                                {currentStep === 3 && (
                                    <div className="col-span-12 lg:col-span-5 h-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex-grow overflow-x-auto">
                                            <AnnualFlowsGrid
                                                projectState={project}
                                                onChange={handleProjectChange}
                                                onLoadSession={handleLoadSession}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 3. KPIs (Right) THIS IS STEP 3 ONLY */}
                                {currentStep === 3 && (
                                    <div className="col-span-12 md:col-span-6 lg:col-span-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                        <KPIGrid
                                            kpis={kpis}
                                            paybackData={paybackData}
                                            noiData={noiData}
                                            yieldData={yieldData}
                                            businessStrategy={advancedAnalysis?.strategy?.action}
                                            onViewAnalysis={() => setIsAnalysisModalOpen(true)}
                                            energyRating={energyRating}
                                            onModifiersChange={setGreenModifiers}
                                            hasData={project.annualFlows.some(f => f.grossIncome !== 0 || f.opex !== 0 || f.capex !== 0)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ROW 2: ANALYSIS & VISUALIZATION */}
                        {currentStep === 3 && (
                            <div className="grid grid-cols-12 gap-4 !mt-[18px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                                {/* 4. Cashflow Chart (Left) */}
                                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                    <CashflowChartV2 data={cashflowData} exitValue={kpis.exitValue} />
                                </div>

                                {/* 5. AI Analyst (Middle) */}
                                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                    {isAnalysisReady ? (
                                        <AIRecommendationsPanel
                                            projectState={project}
                                            kpis={kpis}
                                            onMaximize={() => setIsAnalysisModalOpen(true)}
                                        />
                                    ) : (
                                        <div className="h-full min-h-[240px] sm:min-h-[300px] flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-lg border border-slate-200 shadow-sm text-center">
                                            <div className="p-3 bg-blue-50 rounded-full mb-3">
                                                <Calculator className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <h3 className="text-slate-600 font-medium mb-1">Análisis Pendiente</h3>
                                            <p className="text-sm text-slate-400">
                                                Complete los flujos de caja hasta el año {project.timeHorizonYears} para generar el análisis.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* 6. Sensitivity Chart (Right) */}
                                <div className="col-span-12 lg:col-span-4">
                                    <SensitivityChart
                                        data={sensitivityData}
                                        irr={kpis.irr}
                                    />
                                </div>
                            </div>
                        )}

                        {/* CENTRALIZED ADVANCED ANALYSIS MODAL */}
                        {advancedAnalysis && (
                            <AdvancedAnalysisModal
                                isOpen={isAnalysisModalOpen}
                                onClose={setIsAnalysisModalOpen}
                                analysis={advancedAnalysis}
                                cashflowData={cashflowData}
                                exitValue={kpis.exitValue}
                                municipality={derivedMunicipality}
                                province={derivedProvince}
                                buildingName={selectedBuilding?.name}
                                address={selectedBuilding?.address}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
