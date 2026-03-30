import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import type { FinancialKPIs } from '../../services/mockFinancialData';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "~/components/ui/dialog";

import { GreenImpactControls } from './GreenImpactControls';

interface KPIGridProps {
    kpis: FinancialKPIs;
    paybackData?: { year: number; value: number }[];
    noiData?: { year: number; value: number }[];
    yieldData?: { year: number; value: number }[];
    businessStrategy?: 'REHABILITAR' | 'VENDER' | 'MANTENER';
    onViewAnalysis?: () => void;
    // [NEW] Green Factor Props
    energyRating?: string | null;
    onModifiersChange?: (modifiers: { discountRateDelta: number; exitYieldDelta: number }) => void;
    // [NEW] Has Data Flag
    hasData?: boolean;
}

export const KPIGrid: React.FC<KPIGridProps> = ({
    kpis,
    paybackData = [],
    noiData = [],
    yieldData = [],
    businessStrategy: _businessStrategy,
    onViewAnalysis: _onViewAnalysis,
    energyRating,
    onModifiersChange,
    hasData = true // Default to true if not provided
}) => {
    const [isPaybackModalOpen, setIsPaybackModalOpen] = useState(false);
    const [isNOIModalOpen, setIsNOIModalOpen] = useState(false);
    const [isYieldModalOpen, setIsYieldModalOpen] = useState(false);
    // Info explanation modals
    const [isIRRInfoOpen, setIsIRRInfoOpen] = useState(false);
    const [isNPVInfoOpen, setIsNPVInfoOpen] = useState(false);
    const [isPaybackInfoOpen, setIsPaybackInfoOpen] = useState(false);
    const [isNOIInfoOpen, setIsNOIInfoOpen] = useState(false);
    const [isYieldInfoOpen, setIsYieldInfoOpen] = useState(false);



    // ... existing getValueStyle ...
    const getValueStyle = (value: number) => {
        if (!hasData) return {
            bg: "bg-slate-50",
            border: "border-slate-200",
            text: "text-slate-400",
            label: "text-slate-400",
            subtext: "text-slate-400",
            icon: "text-slate-300"
        };

        const isPositive = value >= 0;
        if (isPositive) {
            return {
                bg: "bg-blue-50",
                border: "border-blue-100",
                text: "text-blue-900",
                label: "text-blue-800",
                subtext: "text-blue-700",
                icon: "text-blue-400 hover:text-blue-600"
            };
        } else {
            return {
                bg: "bg-red-50",
                border: "border-red-100",
                text: "text-red-900",
                label: "text-red-800",
                subtext: "text-red-700",
                icon: "text-red-400 hover:text-red-600"
            };
        }
    };

    const styleNPV = getValueStyle(kpis.npv);

    const getIRRStyle = (irr: number) => {
        if (!hasData) return {
            bg: "bg-slate-50 border-slate-200",
            border: "border-slate-300",
            text: "text-slate-400",
            label: "text-slate-400",
            subtext: "text-slate-400",
            icon: "text-slate-300"
        };

        if (irr > 15) {
            return {
                bg: "bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-100 border-emerald-200", // Stronger gradient
                border: "border-emerald-300",
                text: "text-emerald-800",
                label: "text-emerald-900",
                subtext: "text-emerald-700",
                icon: "text-emerald-600 hover:text-emerald-800"
            };
        } else if (irr >= 10) {
            return {
                bg: "bg-gradient-to-br from-amber-100 via-amber-50 to-amber-100 border-amber-200",
                border: "border-amber-300",
                text: "text-amber-800",
                label: "text-amber-900",
                subtext: "text-amber-700",
                icon: "text-amber-600 hover:text-amber-800"
            };
        } else {
            return {
                bg: "bg-gradient-to-br from-red-100 via-red-50 to-red-100 border-red-200",
                border: "border-red-300",
                text: "text-red-800",
                label: "text-red-900",
                subtext: "text-red-700",
                icon: "text-red-600 hover:text-red-800"
            };
        }
    };

    const styleIRR = getIRRStyle(kpis.irr);

    // Calculate Gradient Offset for Payback Chart
    const gradientOffset = () => {
        if (!paybackData || paybackData.length === 0) return 0;

        const dataMax = Math.max(...paybackData.map((i) => i.value));
        const dataMin = Math.min(...paybackData.map((i) => i.value));

        if (dataMax <= 0) return 0;
        if (dataMin >= 0) return 1;

        return dataMax / (dataMax - dataMin);
    };

    const off = gradientOffset();

    return (
        <>
            <Card className="bg-white border-none shadow-sm">
                <CardHeader className="pt-3 pb-0 px-3 sm:px-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-slate-400" />
                            <CardTitle className="text-sm font-semibold text-slate-800">KPIs Estimados</CardTitle>
                        </div>

                        {/* BUSINESS HEALTH INDICATOR BAR (HIDDEN) */}
                        {/* {strategyStyle && (
                            <div
                                className={`w-full h-8 relative rounded-md overflow-hidden shadow-inner bg-slate-100 mt-1 transition-opacity ${(strategyStyle as any).showDot === false
                                    ? 'cursor-default opacity-80'
                                    : 'cursor-pointer hover:opacity-90'
                                    }`}
                                onClick={() => {
                                    if ((strategyStyle as any).showDot !== false) {
                                        onViewAnalysis?.();
                                    }
                                }}
                                title={(strategyStyle as any).showDot === false ? "Esperando datos..." : "Ver análisis detallado"}
                            >
                                <div className={`absolute inset-0 ${strategyStyle.bg} opacity-100 flex items-center justify-center transition-colors duration-500`}>
                                    <div className="flex items-center gap-2 animate-pulse">
                                        {(strategyStyle as any).showDot !== false && (
                                            <span className={`w-2 h-2 rounded-full bg-white opacity-80 animate-ping`}></span>
                                        )}
                                        <span className={`${strategyStyle.text} text-xs font-bold tracking-wider uppercase drop-shadow-sm`}>
                                            {strategyStyle.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )} */}
                    </div>
                </CardHeader>
                <CardContent className="py-0 px-3 sm:px-4 pb-3 sm:pb-4">
                    {/* TOP ROW: HERO METRICS (TIR & VAN) */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* 1. IRR */}
                        <div className={`p-3 sm:p-4 rounded-xl border-2 relative shadow-sm ${styleIRR.bg} ${styleIRR.border}`}>
                            <div className="absolute top-3 right-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsIRRInfoOpen(true); }}
                                    className={`h-4 w-4 cursor-pointer transition-opacity hover:opacity-80 ${styleIRR.icon}`}
                                    title="¿Cómo se calcula?"
                                >
                                    <Info className="h-4 w-4" />
                                </button>
                            </div>
                            <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${styleIRR.label}`}>TIR (IRR)</p>
                            <div className="flex items-baseline space-x-2">
                                <span className={`text-xl font-black ${styleIRR.text}`}>
                                    {hasData ? `${kpis.irr.toFixed(1)}%` : '--'}
                                </span>
                            </div>
                            <p className={`text-xs mt-1 font-medium ${styleIRR.subtext}`}>
                                Rentabilidad Anual
                            </p>
                        </div>

                        {/* 2. NPV */}
                        <div className={`p-3 sm:p-4 rounded-xl border-2 relative shadow-sm ${styleNPV.bg} ${styleNPV.border}`}>
                            <div className="absolute top-3 right-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsNPVInfoOpen(true); }}
                                    className={`h-4 w-4 cursor-pointer transition-opacity hover:opacity-80 ${styleNPV.icon}`}
                                    title="¿Cómo se calcula?"
                                >
                                    <Info className="h-4 w-4" />
                                </button>
                            </div>
                            <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${styleNPV.label}`}>VAN (NPV)</p>
                            <div className="flex items-baseline space-x-2">
                                <span className={`text-xl font-black ${styleNPV.text}`}>
                                    {hasData ? `€${kpis.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '--'}
                                </span>
                            </div>
                            <p className={`text-xs mt-1 font-medium ${styleNPV.subtext}`}>
                                Valor Presente
                            </p>
                        </div>
                    </div>

                    {/* BOTTOM ROW: SECONDARY METRICS (Payback, NOI, Yield) */}
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        {/* 3. Payback */}
                        <div
                            className="p-2 rounded-lg bg-slate-50 border border-slate-200 relative cursor-pointer hover:bg-slate-100 transition-colors select-none text-center"
                            onClick={() => { if (hasData && paybackData.length > 0) setIsPaybackModalOpen(true); }}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsPaybackInfoOpen(true); }}
                                className="h-3 w-3 absolute top-1 right-1 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                                title="¿Cómo se calcula?"
                            >
                                <Info className="h-3 w-3" />
                            </button>
                            <p className="text-[10px] font-bold uppercase text-slate-500 mb-0.5">Payback</p>
                            <div className="flex justify-center items-baseline gap-1">
                                <span className="text-lg font-bold text-slate-700">
                                    {hasData ? kpis.paybackYears.toFixed(1) : '--'}
                                </span>
                                {hasData && <span className="text-[10px] text-slate-500">Años</span>}
                            </div>
                        </div>

                        {/* 4. NOI (Projected) */}
                        <div
                            className={`p-2 rounded-lg border text-center relative cursor-pointer transition-colors select-none ${hasData ? 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100' : 'bg-slate-50 border-slate-200'}`}
                            onClick={() => { if (hasData && noiData.length > 0) setIsNOIModalOpen(true); }}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsNOIInfoOpen(true); }}
                                className={`h-3 w-3 absolute top-1 right-1 cursor-pointer transition-colors ${hasData ? 'text-emerald-400 hover:text-emerald-600' : 'text-slate-300'}`}
                                title="¿Cómo se calcula?"
                            >
                                <Info className="h-3 w-3" />
                            </button>
                            <p className={`text-[10px] font-bold uppercase mb-0.5 ${hasData ? 'text-emerald-700' : 'text-slate-500'}`}>NOI (Neto)</p>
                            <span className={`text-lg font-bold ${hasData ? 'text-emerald-800' : 'text-slate-400'}`}>
                                {hasData ? `€${kpis.noiProjected.toLocaleString(undefined, { maximumFractionDigits: 0, notation: 'compact' })}` : '--'}
                            </span>
                        </div>

                        {/* 5. Yield (Cap Rate) */}
                        <div
                            className={`p-2 rounded-lg border text-center relative cursor-pointer transition-colors select-none ${!hasData ? 'bg-slate-50 border-slate-200' : kpis.yieldOnCost < (kpis.marketYieldPercent || 0) ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' : 'bg-blue-50 border-blue-100 hover:bg-blue-100'}`}
                            onClick={() => { if (hasData && yieldData.length > 0) setIsYieldModalOpen(true); }}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsYieldInfoOpen(true); }}
                                className={`h-3 w-3 absolute top-1 right-1 cursor-pointer transition-colors ${hasData ? 'text-slate-400 hover:text-slate-600' : 'text-slate-300'}`}
                                title="¿Cómo se calcula?"
                            >
                                <Info className="h-3 w-3" />
                            </button>
                            <p className={`text-[10px] font-bold uppercase mb-0.5 ${!hasData ? 'text-slate-500' : kpis.yieldOnCost < (kpis.marketYieldPercent || 0) ? 'text-amber-700' : 'text-blue-700'}`}>
                                Yield
                            </p>
                            <div className="flex justify-center items-baseline gap-0.5">
                                <span className={`text-lg font-bold ${!hasData ? 'text-slate-400' : kpis.yieldOnCost < (kpis.marketYieldPercent || 0) ? 'text-amber-800' : 'text-blue-800'}`}>
                                    {hasData ? `${kpis.yieldOnCost.toFixed(1)}%` : '--'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* [NEW] Green Impact Controls (Bottom of Card) */}
                    {energyRating && onModifiersChange && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                            <GreenImpactControls
                                energyRating={energyRating}
                                onModifiersChange={onModifiersChange}
                                disabled={kpis.yieldOnCost === 0 && kpis.noiProjected === 0}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isPaybackModalOpen} onOpenChange={setIsPaybackModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Evolución del Payback</DialogTitle>
                        <DialogDescription>
                            Evolución del flujo de caja acumulado a lo largo del tiempo hasta la recuperación de la inversión.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={paybackData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`}
                                    tick={{ fontSize: 12, fill: '#64748B' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <RechartsTooltip
                                    formatter={(value: number) => [`€${value.toLocaleString()}`, 'Acumulado']}
                                    labelFormatter={(label) => `Año ${label}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <ReferenceLine y={0} stroke="#94a3b8" />
                                <defs>
                                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={off} stopColor="#3b82f6" stopOpacity={1} />
                                        <stop offset={off} stopColor="#ef4444" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="url(#splitColor)"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </DialogContent>
            </Dialog>
            {/* NEW NOI EVOLUTION MODAL */}
            <Dialog open={isNOIModalOpen} onOpenChange={setIsNOIModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Evolución del NOI (Net Operating Income)</DialogTitle>
                        <DialogDescription>
                            Proyección del ingreso operativo neto anual a lo largo del horizonte de inversión.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={noiData}
                                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    formatter={(value: number) => [`€${value.toLocaleString()}`, 'NOI Neto']}
                                    labelFormatter={(label) => `Año ${label}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <ReferenceLine y={0} stroke="#94a3b8" />
                                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#10b981", stroke: "#fff" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </DialogContent>
            </Dialog>
            {/* NEW YIELD EVOLUTION MODAL */}
            <Dialog open={isYieldModalOpen} onOpenChange={setIsYieldModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Evolución del Yield (Rentabilidad)</DialogTitle>
                        <DialogDescription>
                            Evolución de la rentabilidad anual sobre el costo (Yield on Cost) a lo largo del tiempo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={yieldData}
                                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={(val) => `${val.toFixed(1)}%`} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    formatter={(value: number) => [`${value.toFixed(2)}%`, 'Yield']}
                                    labelFormatter={(label) => `Año ${label}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <ReferenceLine y={0} stroke="#94a3b8" />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#3b82f6", stroke: "#fff" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </DialogContent>
            </Dialog>
            {/* IRR INFO MODAL */}
            <Dialog open={isIRRInfoOpen} onOpenChange={setIsIRRInfoOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">TIR — Tasa Interna de Retorno</DialogTitle>
                        <DialogDescription>Cómo se calcula en esta calculadora</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-slate-700 overflow-y-auto max-h-[70vh] pr-1">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="font-semibold text-slate-800 mb-1">¿Qué es?</p>
                            <p>La TIR es la tasa de descuento que hace que el VAN sea igual a cero. Representa la rentabilidad anual promedio que genera la inversión durante todo el horizonte temporal.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Fórmula conceptual:</p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 font-mono text-xs text-blue-900">
                                0 = -CAPEX₀ + Σ [NOI_t / (1 + TIR)^t] + [Valor_Salida / (1 + TIR)^n]
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Datos que usa la calculadora:</p>
                            <ul className="space-y-1 list-disc pl-5 text-slate-600">
                                <li><span className="font-medium text-slate-800">CAPEX Inicial (I₀):</span> La inversión de entrada.</li>
                                <li><span className="font-medium text-slate-800">NOI anual:</span> Ingresos Brutos − OPEX − Vacancia, para cada año.</li>
                                <li><span className="font-medium text-slate-800">Valor de Salida (Vₙ):</span> Precio de venta estimado al final del horizonte.</li>
                                <li><span className="font-medium text-slate-800">Horizonte Temporal (n):</span> Número de años del análisis.</li>
                            </ul>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                            <p className="font-semibold text-indigo-800 mb-2">📐 Benchmarks del sector inmobiliario:</p>
                            <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-bold text-indigo-700">&lt; 8%</p>
                                    <p className="text-slate-500 mt-0.5">Bajo riesgo<br />(residencial prime)</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-bold text-amber-600">8–15%</p>
                                    <p className="text-slate-500 mt-0.5">Rango típico<br />(value-add)</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-bold text-emerald-600">&gt; 15%</p>
                                    <p className="text-slate-500 mt-0.5">Excelente<br />(oportunístico)</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 italic">
                            💡 <span className="font-medium not-italic text-slate-700">Ejemplo real:</span> Un edificio de oficinas en Madrid comprado por €2M, con rentas netas de €120k/año y vendido a €2.8M en 10 años, genera una TIR aproximada del 9–10%. Un proyecto de rehabilitación con la misma compra pero rentas mejoradas a €180k/año puede alcanzar TIRs del 14–18%.
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <p className="font-semibold text-emerald-800 mb-1">Interpretación:</p>
                            <p className="text-emerald-700">Si TIR &gt; Tasa de Descuento (k) → el proyecto crea valor. En inmobiliario, la tasa de descuento suele ser el coste de capital o el WACC del fondo (típicamente 6–10%).</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* NPV INFO MODAL */}
            <Dialog open={isNPVInfoOpen} onOpenChange={setIsNPVInfoOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">VAN — Valor Actual Neto</DialogTitle>
                        <DialogDescription>Cómo se calcula en esta calculadora</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-slate-700 overflow-y-auto max-h-[70vh] pr-1">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="font-semibold text-slate-800 mb-1">¿Qué es?</p>
                            <p>El VAN mide el beneficio neto total de la inversión en euros de hoy, descontando todos los flujos futuros a la tasa de descuento (k) que tú defines. Es la métrica definitiva de creación de valor.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Fórmula:</p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 font-mono text-xs text-blue-900">
                                VAN = -CAPEX₀ + Σ [NOI_t / (1 + k)^t] + [Valor_Salida / (1 + k)^n]
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Datos que usa la calculadora:</p>
                            <ul className="space-y-1 list-disc pl-5 text-slate-600">
                                <li><span className="font-medium text-slate-800">CAPEX Inicial (I₀):</span> La inversión de entrada (sale negativo).</li>
                                <li><span className="font-medium text-slate-800">NOI anual:</span> Ingresos Brutos − OPEX − Vacancia.</li>
                                <li><span className="font-medium text-slate-800">Tasa de Descuento (k):</span> Tu coste de oportunidad del capital.</li>
                                <li><span className="font-medium text-slate-800">Valor de Salida (Vₙ):</span> Precio de venta estimado al final.</li>
                            </ul>
                        </div>
                        <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 italic">
                            💡 <span className="font-medium not-italic text-slate-700">Contexto inmobiliario:</span> En un fondo de real estate, el VAN positivo indica que el activo supera el hurdle rate del fondo. Si el VAN es €300k sobre una inversión de €2M, significa que el proyecto genera un 15% más de valor que simplemente invertir ese dinero a la tasa de descuento. Los fondos core suelen usar k = 5–7%; los value-add, k = 8–12%.
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="font-semibold text-blue-800 mb-1">Interpretación:</p>
                            <p className="text-blue-700">VAN &gt; 0 → La inversión genera más valor del que cuesta. VAN &lt; 0 → Destruye valor a esa tasa de descuento. <span className="font-medium">Cambia la tasa de descuento en el Análisis de Sensibilidad para ver cómo varía.</span></p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* PAYBACK INFO MODAL */}
            <Dialog open={isPaybackInfoOpen} onOpenChange={setIsPaybackInfoOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Payback — Período de Recuperación</DialogTitle>
                        <DialogDescription>Cómo se calcula en esta calculadora</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-slate-700 overflow-y-auto max-h-[70vh] pr-1">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="font-semibold text-slate-800 mb-1">¿Qué es?</p>
                            <p>El Payback es el número de años que tarda la inversión en recuperarse, es decir, cuando el flujo de caja acumulado (rentas netas) iguala el capital invertido.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Cálculo:</p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 font-mono text-xs text-blue-900">
                                Flujo Acumulado_t = -CAPEX₀ + Σ NOI_t (hasta año t)
                                <br />
                                Payback = año en que Flujo Acumulado ≥ 0
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Datos que usa la calculadora:</p>
                            <ul className="space-y-1 list-disc pl-5 text-slate-600">
                                <li><span className="font-medium text-slate-800">CAPEX Inicial:</span> Inversión de partida (negativo).</li>
                                <li><span className="font-medium text-slate-800">NOI anual:</span> Flujo de caja neto de cada año (Ingresos − OPEX − CAPEX recurrente).</li>
                            </ul>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                            <p className="font-semibold text-indigo-800 mb-2">📐 Benchmarks del sector inmobiliario:</p>
                            <div className="grid grid-cols-3 gap-2 text-xs text-center">
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-bold text-emerald-600">&lt; 10 años</p>
                                    <p className="text-slate-500 mt-0.5">Excelente<br />(alta renta)</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-bold text-amber-600">10–15 años</p>
                                    <p className="text-slate-500 mt-0.5">Típico<br />(residencial)</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-bold text-red-500">&gt; 20 años</p>
                                    <p className="text-slate-500 mt-0.5">Largo plazo<br />(patrimonio)</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 italic">
                            💡 <span className="font-medium not-italic text-slate-700">Contexto inmobiliario:</span> Un edificio residencial en Barcelona con yield del 4% tiene un Payback simple de ~25 años solo por rentas. Si el horizonte de salida es 10 años, el Payback real incluye la plusvalía de la venta, acortándolo significativamente. Los inversores value-add buscan Paybacks de 7–12 años.
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="font-semibold text-amber-800 mb-1">Nota importante:</p>
                            <p className="text-amber-700">El Payback no descuenta el valor del dinero en el tiempo. Es un indicador de liquidez y riesgo, no de rentabilidad. Haz click en la tarjeta para ver la curva de recuperación.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* NOI INFO MODAL */}
            <Dialog open={isNOIInfoOpen} onOpenChange={setIsNOIInfoOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">NOI — Net Operating Income</DialogTitle>
                        <DialogDescription>Cómo se calcula en esta calculadora</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-slate-700 overflow-y-auto max-h-[70vh] pr-1">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="font-semibold text-slate-800 mb-1">¿Qué es?</p>
                            <p>El NOI es el ingreso operativo neto anual del activo: lo que genera el edificio después de pagar todos los gastos operativos, pero <span className="font-medium">antes de financiación, amortizaciones e impuestos</span>. Es la métrica universal del sector para valorar activos.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Fórmula:</p>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 font-mono text-xs text-emerald-900 space-y-1">
                                <p>EGI = Ingresos Brutos × (1 − Tasa Vacancia)</p>
                                <p>NOI = EGI − OPEX</p>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Datos que usa la calculadora:</p>
                            <ul className="space-y-1 list-disc pl-5 text-slate-600">
                                <li><span className="font-medium text-slate-800">Ingresos Brutos:</span> Renta anual potencial (columna "Ingresos" de la tabla).</li>
                                <li><span className="font-medium text-slate-800">Tasa Vacancia:</span> % de tiempo sin inquilino (reduce los ingresos).</li>
                                <li><span className="font-medium text-slate-800">OPEX:</span> Gastos operativos anuales (columna "OPEX" de la tabla).</li>
                            </ul>
                        </div>
                        <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 italic">
                            💡 <span className="font-medium not-italic text-slate-700">Contexto inmobiliario:</span> El NOI es la base de la valoración por capitalización de rentas. Un edificio de oficinas con NOI de €200k/año y un Cap Rate de mercado del 5% valdría €4M (NOI / Cap Rate). Por eso mejorar el NOI —subiendo rentas o reduciendo OPEX— es la palanca principal de creación de valor en estrategias value-add.
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <p className="font-semibold text-emerald-800 mb-1">El valor mostrado:</p>
                            <p className="text-emerald-700">Es el NOI proyectado del último año del horizonte temporal. Haz click en la tarjeta para ver la evolución anual y detectar si las rentas crecen de forma sostenida.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* YIELD INFO MODAL */}
            <Dialog open={isYieldInfoOpen} onOpenChange={setIsYieldInfoOpen}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Yield — Rentabilidad sobre Coste</DialogTitle>
                        <DialogDescription>Cómo se calcula en esta calculadora</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-slate-700 overflow-y-auto max-h-[70vh] pr-1">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <p className="font-semibold text-slate-800 mb-1">¿Qué es?</p>
                            <p>El Yield on Cost (o Cap Rate implícito) mide qué porcentaje del capital invertido genera el activo en forma de NOI anual. Es el equivalente inmobiliario del "dividendo yield" y la métrica más usada para comparar activos entre sí.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Fórmula:</p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 font-mono text-xs text-blue-900">
                                Yield on Cost = NOI_año1 / CAPEX_Total × 100
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 mb-2">Datos que usa la calculadora:</p>
                            <ul className="space-y-1 list-disc pl-5 text-slate-600">
                                <li><span className="font-medium text-slate-800">NOI año 1:</span> Ingreso operativo neto del primer año.</li>
                                <li><span className="font-medium text-slate-800">CAPEX Total:</span> Valor del activo + CAPEX inicial.</li>
                                <li><span className="font-medium text-slate-800">Yield de Mercado ({kpis.marketYieldPercent}%):</span> Referencia del mercado para comparar.</li>
                            </ul>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                            <p className="font-semibold text-indigo-800 mb-2">📐 Yields típicos por tipo de activo (España):</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-medium text-slate-700">Residencial prime</p>
                                    <p className="text-indigo-600 font-bold">2.5 – 4%</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-medium text-slate-700">Oficinas CBD</p>
                                    <p className="text-indigo-600 font-bold">4 – 5.5%</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-medium text-slate-700">Retail high street</p>
                                    <p className="text-indigo-600 font-bold">3.5 – 5%</p>
                                </div>
                                <div className="bg-white rounded p-2 border border-indigo-100">
                                    <p className="font-medium text-slate-700">Logístico / Industrial</p>
                                    <p className="text-indigo-600 font-bold">5 – 7%</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-600 italic">
                            💡 <span className="font-medium not-italic text-slate-700">Contexto inmobiliario:</span> El "spread" entre tu Yield on Cost y el Yield de mercado determina si estás comprando caro o barato. Si tu Yield on Cost es 6% y el mercado está al 5%, tienes un spread positivo de 100 bps: el activo genera más de lo que el mercado exige, señal de buena compra o de potencial de revalorización.
                        </div>
                        <div className={`rounded-lg p-3 border ${kpis.yieldOnCost < (kpis.marketYieldPercent || 0) ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                            <p className={`font-semibold mb-1 ${kpis.yieldOnCost < (kpis.marketYieldPercent || 0) ? 'text-amber-800' : 'text-blue-800'}`}>Interpretación:</p>
                            <p className={kpis.yieldOnCost < (kpis.marketYieldPercent || 0) ? 'text-amber-700' : 'text-blue-700'}>
                                {kpis.yieldOnCost < (kpis.marketYieldPercent || 0)
                                    ? `Tu Yield (${kpis.yieldOnCost.toFixed(1)}%) está por debajo del mercado (${kpis.marketYieldPercent}%). El activo puede estar sobrevalorado o tener margen de mejora en rentas.`
                                    : `Tu Yield (${kpis.yieldOnCost.toFixed(1)}%) supera el mercado (${kpis.marketYieldPercent}%). El activo genera buena rentabilidad operativa.`
                                }
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
