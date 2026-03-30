import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Sparkles, AlertTriangle, CheckCircle2, RefreshCw, Maximize2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { generateAdvancedAnalysis } from '../../services/aiAnalysisService';
import type { AdvancedAIAnalysisResult } from '../../services/aiAnalysisService';
import type { FinancialProjectState, FinancialKPIs } from '../../services/mockFinancialData';


interface AIRecommendationsPanelProps {
    projectState: FinancialProjectState;
    kpis: FinancialKPIs;
    onMaximize?: () => void;
}

export const AIRecommendationsPanel: React.FC<AIRecommendationsPanelProps> = ({
    projectState, kpis, onMaximize
}) => {
    const [analysis, setAnalysis] = useState<AdvancedAIAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            performAnalysis();
        }, 1000);

        return () => clearTimeout(timer);
    }, [projectState, kpis]);

    const performAnalysis = () => {
        // Basic validation before running advisor
        if ((projectState.initialMarketValue === 0 && projectState.annualFlows.length === 0) || (kpis.npv === 0 && kpis.irr === 0)) {
            setAnalysis(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Synchronous local expert system
            const result = generateAdvancedAnalysis(projectState, kpis);
            setAnalysis(result);
        } catch (err: any) {
            setError(err.message || "Error al generar análisis experto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="h-24 w-24 text-blue-600" />
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <CardTitle className="text-sm font-bold text-indigo-900">Analista Financiero IA</CardTitle>
                            <CardDescription className="text-xs text-indigo-700">Insights Financieros</CardDescription>
                        </div>
                    </div>
                    {onMaximize && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100"
                            onClick={onMaximize}
                            disabled={!analysis}
                            title="Ver Informe Detallado"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-6 text-indigo-400 gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-xs font-medium">Analizando escenario...</span>
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="py-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : analysis ? (
                    <div className="space-y-4 text-xs font-medium">

                        {/* [NEW] Scenario Comparison (Base vs Current) */}
                        {analysis.comparison && (
                            <div className="bg-white/80 p-2 rounded-lg border border-indigo-100 shadow-sm">
                                <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-1 text-[10px] uppercase tracking-wider">
                                    <Sparkles className="h-3 w-3 text-emerald-500" /> Impacto de Valor (vs. Base)
                                </h4>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-500">TIR Base</span>
                                        <span className="font-bold text-slate-700">{analysis.comparison.baselineIRR.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-500">TIR Actual</span>
                                        <span className="font-bold text-emerald-700">{analysis.comparison.currentIRR.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-500">Delta</span>
                                        <span className={`font-bold ${analysis.comparison.irrDelta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {analysis.comparison.irrDelta > 0 ? '+' : ''}{analysis.comparison.irrDelta.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                                {analysis.comparison.isGreenPremium && (
                                    <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-center font-semibold">
                                        ✨ Green Premium Detectado
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Diagnosis Summary */}
                        <div className="bg-white/60 p-3 rounded-lg border border-indigo-100">
                            <h4 className="font-semibold text-indigo-900 mb-1 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Diagnóstico
                            </h4>
                            <p className="text-slate-700 leading-relaxed line-clamp-3">
                                {analysis.diagnosis}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {/* Top Risks Summary */}
                            {analysis.risks.length > 0 && (
                                <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                                    <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Alertas ({analysis.risks.length})
                                    </h4>
                                    <ul className="space-y-1 list-disc list-inside text-red-700">
                                        {analysis.risks.slice(0, 3).map((risk, idx) => (
                                            <li key={idx} className="leading-tight truncate" title={risk.label}>
                                                {risk.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Strategy Preview */}
                            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                                <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> Estrategia Sugerida
                                </h4>
                                <p className="text-emerald-900 font-bold mb-1">
                                    {analysis.strategy.title}
                                </p>
                                <p className="text-emerald-700 leading-tight">
                                    {analysis.strategy.argument}
                                </p>
                            </div>
                        </div>

                        {onMaximize && (
                            <div className="mt-3 flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onMaximize}
                                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                >
                                    <Maximize2 className="mr-2 h-3 w-3" />
                                    Ampliar
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-slate-400 py-4 italic">
                        Complete los datos del proyecto para recibir asesoramiento experto.
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
