import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import type { AdvancedAIAnalysisResult } from '../../services/aiAnalysisService';
import { Target, TrendingUp, AlertOctagon, ShieldAlert, ArrowRightCircle, Loader2, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CashflowChartV2 } from './CashflowChartV2';
import { PriceEvolutionChart } from './PriceEvolutionChart';
import { MarketDataService } from '../../services/MarketDataService';
import type { CashflowDataPoint } from '../../services/mockFinancialData';

interface AdvancedAnalysisModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    analysis: AdvancedAIAnalysisResult | null;
    cashflowData: CashflowDataPoint[];
    exitValue: number;
    // [NEW] Location props for price evolution chart
    municipality?: string | null;
    province?: string | null;
    buildingName?: string | null;
    address?: string | null;
}

export const AdvancedAnalysisModal: React.FC<AdvancedAnalysisModalProps> = ({ isOpen, onClose, analysis, cashflowData, exitValue, municipality, province, buildingName, address }) => {
    if (!analysis) return null;

    const { valuation, risks } = analysis;

    // [NEW] INE Price Evolution State
    const [priceData, setPriceData] = useState<any[]>([]);
    const [priceLoading, setPriceLoading] = useState(false);

    useEffect(() => {
        if (isOpen && (municipality || province)) {
            setPriceLoading(true);
            MarketDataService.getProjectedPriceEvolution(municipality || '', province || '')
                .then(data => setPriceData(data))
                .catch(() => setPriceData([]))
                .finally(() => setPriceLoading(false));
        } else {
            setPriceData([]);
        }
    }, [isOpen, municipality, province]);

    const getRiskColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Target className="h-6 w-6 text-indigo-600" />
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            Informe Estratégico (CFO Advisor)
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        Diagnóstico avanzado basado en metodología Suárez & Normativa EPBD.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">

                    {/* 1. STORY TELLING NARRATIVE */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                            <ArrowRightCircle className="h-4 w-4" />
                            Diagnóstico
                        </h3>
                        <p className="text-lg font-medium text-slate-800 leading-relaxed italic">
                            "{analysis.storyTelling}"
                        </p>
                    </div>

                    {/* 2. STRATEGIC PATHS (3 OPTIONS) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {analysis.strategicPaths && Object.values(analysis.strategicPaths).map((path, idx) => {
                            const isRecommended = path.isRecommended;
                            return (
                                <Card key={idx} className={`border-2 ${isRecommended ? 'border-primary ring-2 ring-primary/20 shadow-lg scale-105 z-10' : 'border-slate-100 opacity-80 hover:opacity-100'}`}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant={isRecommended ? "default" : "outline"} className="mb-2">
                                                {isRecommended ? 'RECOMENDADO' : 'ALTERNATIVA'}
                                            </Badge>
                                            <span className="text-xs font-bold text-slate-400">Score: {path.score}/100</span>
                                        </div>
                                        <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-600">
                                            {path.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <h4 className={`text-xl font-extrabold mb-2 ${isRecommended ? 'text-primary' : 'text-slate-800'}`}>
                                            {path.action}
                                        </h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {path.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* 3. SCENARIO COMPARISON (Evidence) */}
                    {analysis.comparison && (
                        <Card className="bg-slate-50 border-slate-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                                    Evidencia: Impacto Financiero
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Escenario Base</p>
                                        <p className="text-xl font-bold text-slate-700">{analysis.comparison.baselineIRR.toFixed(2)}% <span className="text-xs font-normal text-slate-400">TIR</span></p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Escenario Actual</p>
                                        <p className="text-xl font-bold text-emerald-700">{analysis.comparison.currentIRR.toFixed(2)}% <span className="text-xs font-normal text-slate-400">TIR</span></p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Delta</p>
                                        <p className={`text-xl font-bold ${analysis.comparison.irrDelta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {analysis.comparison.irrDelta > 0 ? '+' : ''}{analysis.comparison.irrDelta.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* [NEW] FCF Trajectory Evidence */}
                    {analysis.cashFlowTrajectory && (
                        <Card className="bg-slate-50 border-slate-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                                    Evidencia: Trayectoria del Flujo de Caja Libre (FCF)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
                                    {analysis.cashFlowTrajectory.map((item, idx) => (
                                        <div key={idx} className={`p-2 rounded border flex flex-col items-center justify-center text-center ${idx === analysis.cashFlowTrajectory!.length - 1 ? 'bg-emerald-50 border-emerald-200 col-span-2 lg:col-span-1 ring-1 ring-emerald-100' : 'bg-white border-slate-100'}`}>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{item.year}</p>
                                            <p className={`font-bold text-sm ${idx === analysis.cashFlowTrajectory!.length - 1 ? 'text-emerald-700' : 'text-slate-700'}`}>
                                                €{item.amount >= 1000000 ? (item.amount / 1000000).toFixed(2) + 'M' : (item.amount / 1000).toFixed(0) + 'k'}
                                            </p>
                                            {item.label && <span className="text-[9px] text-emerald-600 font-medium px-1 rounded bg-emerald-100/50 mt-1">{item.label}</span>}
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-blue-50/80 p-3 rounded-lg text-xs text-blue-800 border border-blue-100 flex gap-2 items-start">
                                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
                                    <p>
                                        <span className="font-bold">Justificación:</span> Es necesario visualizar la estabilidad operativa previa a la venta para validar la calidad de la TIR.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}



                    {/* [NEW] INE PRICE EVOLUTION CHART */}
                    {(municipality || province) && (
                        <Card className="bg-white border-slate-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BarChart2 className="h-5 w-5 text-blue-600" />
                                    Tendencia de Precio de Mercado
                                    {municipality && (
                                        <span className="text-blue-600 font-bold ml-1">{municipality}</span>
                                    )}
                                </CardTitle>
                                {(buildingName || address) && (
                                    <div className="flex flex-col text-xs text-slate-500 mt-1">
                                        {buildingName && <span className="font-semibold text-slate-700">{buildingName}</span>}
                                        {address && <span>{address}</span>}
                                    </div>
                                )}
                                <p className="text-xs text-slate-400 mt-1">Histórico de precios por metro cuadrado (Fuente: INE/Ayuntamientos).</p>
                            </CardHeader>
                            <CardContent>
                                {priceLoading ? (
                                    <div className="flex items-center justify-center h-[300px] gap-2 text-slate-400">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span className="text-sm">Cargando datos de mercado...</span>
                                    </div>
                                ) : priceData.length > 0 ? (
                                    <PriceEvolutionChart data={priceData} variant="ine" />
                                ) : (
                                    <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
                                        No hay datos de evolución de precio disponibles para esta ubicación.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* [NEW] EMBEDDED CASH FLOW CHART */}
                    <Card className="bg-white border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                Proyección Visual de Flujos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full">
                                <CashflowChartV2 data={cashflowData} exitValue={exitValue} hideControls={true} />
                            </div>
                            <p className="text-xs text-slate-500 mt-2 italic text-center">
                                Gráfico interactivo de evolución de caja (Operativo vs. Salida).
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 4. VALUATION */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Target className="h-5 w-5 text-blue-600" />
                                    Valoración Financiera (Método Dinámico)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-start pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900">{valuation.methodA.name}</p>
                                        <p className="text-xs text-slate-500">{valuation.methodA.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-2xl text-slate-900">
                                            {typeof valuation.methodA.value === 'number'
                                                ? `€${valuation.methodA.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                                                : valuation.methodA.value}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1">Valor Presente Neto (NPV) + Valor Residual</p>
                                    </div>
                                </div>
                                {analysis.totalExitYearCashflow && (
                                    <div className="flex justify-between items-start pb-3 border-b border-slate-100 last:border-0 last:pb-0 pt-3">
                                        <div>
                                            <p className="font-semibold text-sm text-emerald-800">Retorno Total Año de Salida</p>
                                            <p className="text-xs text-emerald-600">Flujo Operativo + Valor de Venta</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-2xl text-emerald-700">
                                                €{analysis.totalExitYearCashflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </span>
                                            <p className="text-[10px] text-emerald-500 mt-1">Gran Retorno Capital (Año N)</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 3. RISK RADAR */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                                    Radar de Riesgos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {risks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                                        <Target className="h-10 w-10 mb-2 opacity-20" />
                                        <p className="text-sm">No se detectaron riesgos críticos.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {risks.map((risk, idx) => (
                                            <div key={idx} className={`p-3 rounded-lg border flex items-start gap-3 ${getRiskColor(risk.severity)}`}>
                                                <AlertOctagon className="h-5 w-5 shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="bg-white/50 border-black/10 text-[10px] h-5">
                                                            {risk.category}
                                                        </Badge>
                                                        <span className="font-bold text-sm">{risk.label}</span>
                                                    </div>
                                                    <p className="text-xs leading-relaxed opacity-90">
                                                        {risk.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};
