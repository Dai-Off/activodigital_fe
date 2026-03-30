import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Info, TrendingUp } from 'lucide-react';
import { RichTooltip } from "~/components/ui/RichTooltip";
import type { FinancialProjectState, AnnualFlow } from '../../services/mockFinancialData';
import { CalculationSessionManager } from './CalculationSessionManager';

export interface FinancialSubComponentProps {
    projectState: FinancialProjectState;
    onChange: (newState: FinancialProjectState, commit?: boolean) => void;
    // Optional helpers if passed from parent, otherwise we implement local wrappers if needed
    onUpdateFlow?: (year: number, field: keyof AnnualFlow, value: number) => void;
    suggestedExitValue?: number | null;
    suggestedExitValueSource?: string | null;
    suggestedDiscountRate?: number | null;
    interestRateSource?: string | null;
    onLoadSession?: (loadedProject: FinancialProjectState) => void;
}

export const ProjectParametersCard: React.FC<FinancialSubComponentProps> = ({
    projectState,
    onChange,
    suggestedExitValue,
    suggestedExitValueSource,
    suggestedDiscountRate,
    interestRateSource
}) => {

    const updateField = (field: keyof FinancialProjectState, value: any, commit = false) => {
        onChange({ ...projectState, [field]: value }, commit);
    };

    return (
        <Card className="border border-blue-800 shadow-[0_10px_25px_rgba(0,0,0,0.1)] bg-blue-900 text-white rounded-2xl overflow-hidden">
            <CardHeader className="py-5 bg-blue-950/30 border-b border-blue-800/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
                    <Info className="h-4 w-4" /> Parámetros
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-6 pt-0">

                {/* Horizon */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-blue-200 text-sm font-medium">Horizonte Temporal</Label>
                        <span className="text-sm font-bold bg-blue-500/30 text-blue-100 px-3 py-1 rounded-lg border border-blue-600/30">
                            {projectState.timeHorizonYears} Años
                        </span>
                    </div>
                    <Slider
                        value={[projectState.timeHorizonYears]}
                        min={2}
                        max={25}
                        step={1}
                        onValueChange={(val) => updateField('timeHorizonYears', val[0], false)}
                        onValueCommit={(val) => updateField('timeHorizonYears', val[0], true)}
                        className="py-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Initial Value */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-blue-200">Valor Activo ($I_0$)</Label>
                        <Input
                            type="number"
                            value={projectState.initialMarketValue}
                            onChange={(e) => updateField('initialMarketValue', Number(e.target.value), false)}
                            onBlur={(e) => updateField('initialMarketValue', Number(e.target.value), true)}
                            onFocus={(e) => e.target.select()}
                            className="bg-blue-950/50 border-blue-700 text-white h-10 text-sm rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all font-medium"
                        />
                    </div>
                    {/* Initial CAPEX */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1 mb-1">
                            <Label className="text-xs font-medium text-blue-200">CAPEX Inicial</Label>
                            <RichTooltip
                                title="CAPEX (Capital Expenditure)"
                                description="Dinero gastado para comprar, mejorar o extender la vida útil."
                                goldenRule={{
                                    label: "Regla de Oro:",
                                    text: "¿Aumenta el valor del edificio o su vida útil? -> ES CAPEX"
                                }}
                                examples={{
                                    label: "EJEMPLOS:",
                                    items: [
                                        <><span className="font-medium text-slate-800">Adquisición:</span> Precio de compra.</>,
                                        <><span className="font-medium text-slate-800">Rehabilitación:</span> SATE, Cubierta, Refuerzo.</>,
                                        <><span className="font-medium text-slate-800">Instalaciones:</span> Nuevos ascensores, HVAC.</>
                                    ]
                                }}
                                footer="* No resta del NOI (Operativo), pero sí del Cash Flow (Caja)."
                            />
                        </div>
                        <Input
                            type="number"
                            value={projectState.initialCapex}
                            onChange={(e) => updateField('initialCapex', Number(e.target.value), false)}
                            onBlur={(e) => updateField('initialCapex', Number(e.target.value), true)}
                            onFocus={(e) => e.target.select()}
                            className="bg-blue-950/50 border-blue-700 text-white h-10 text-sm rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all font-medium"
                        />
                    </div>

                    {/* Discount Rate */}
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-blue-200">Tasa Descuento (k)</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={projectState.discountRatePercent}
                                onChange={(e) => updateField('discountRatePercent', Number(e.target.value), false)}
                                onBlur={(e) => updateField('discountRatePercent', Number(e.target.value), true)}
                                onFocus={(e) => e.target.select()}
                                className="bg-blue-950/50 border-blue-700 text-white h-10 text-sm rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all font-medium pr-8"
                                step={0.1}
                            />
                            <span className="absolute right-4 top-2.5 text-xs text-blue-300 pointer-events-none">%</span>
                        </div>
                    </div>

                    {/* Vacancy Rate */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1 mb-1">
                            <Label className="text-xs font-medium text-blue-200">Tasa Vacancia</Label>
                            <RichTooltip
                                title="Tasa de Vacancia"
                                description="Porcentaje de tiempo o espacio que el activo permanece sin inquilinos."
                                goldenRule={{
                                    label: "Regla de Oro:",
                                    text: "¿Cuánto tiempo estará vacío? -> Afecta directamente al EGI."
                                }}
                                examples={{
                                    label: "EJEMPLOS:",
                                    items: [
                                        "5% (Estándar residencial)",
                                        "10-15% (Oficinas zona secundaria)"
                                    ]
                                }}
                                footer="* Reduce los Ingresos Brutos Potenciales."
                            />
                        </div>
                        <div className="relative">
                            <Input
                                type="number"
                                value={projectState.vacancyRatePercent || 0}
                                onChange={(e) => updateField('vacancyRatePercent', Number(e.target.value), false)}
                                onBlur={(e) => updateField('vacancyRatePercent', Number(e.target.value), true)}
                                onFocus={(e) => e.target.select()}
                                className="bg-blue-950/50 border-blue-700 text-white h-10 text-sm rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all font-medium pr-8"
                                min={0}
                                max={100}
                            />
                            <span className="absolute right-4 top-2.5 text-xs text-blue-300 pointer-events-none">%</span>
                        </div>
                    </div>

                    {/* Exit Value */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1 mb-1">
                            <Label className="text-xs font-medium text-blue-200">Valor Salida ($V_n$)</Label>
                            <RichTooltip
                                title="Valor de Salida"
                                description="Precio estimado de venta del activo al finalizar el horizonte temporal."
                                goldenRule={{
                                    label: "Regla de Oro:",
                                    text: "¿Por cuánto lo venderás en el año N?"
                                }}
                                examples={{
                                    label: "EJEMPLOS:",
                                    items: [
                                        "Calculado por Cap Rate de Salida",
                                        "Exit Yield sobre NOI del año (n+1)"
                                    ]
                                }}
                                footer="* Dejar en 0 para cálculo automático (Market Yield 5%)."
                            />
                        </div>
                        <Input
                            type="number"
                            value={projectState.exitValue}
                            onChange={(e) => updateField('exitValue', Number(e.target.value), false)}
                            onBlur={(e) => updateField('exitValue', Number(e.target.value), true)}
                            onFocus={(e) => e.target.select()}
                            placeholder={(projectState.exitValue === 0) ? "Auto (calc)" : ""}
                            className={`bg-blue-950/50 border-blue-700 text-white h-10 text-sm rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all font-medium ${projectState.exitValue === 0 ? 'text-blue-300 italic' : ''}`}
                        />
                    </div>

                    {/* Full Width Suggested Value Row */}
                    {(suggestedExitValue || suggestedDiscountRate) && (
                        <div className="col-span-2 mt-2 space-y-3">
                            {suggestedExitValue && (
                                <div className="flex items-start gap-3 p-4 bg-blue-800/40 rounded-xl border border-blue-600/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <RichTooltip
                                        trigger={<Info className="h-5 w-5 text-blue-400 cursor-help hover:text-blue-300 mt-0.5 flex-shrink-0" />}
                                        title="Cálculo del Valor Sugerido"
                                        description="El valor de salida sugerido se auto-calcula cruzando la superficie del activo con proyecciones de mercado."
                                        goldenRule={{
                                            label: "Fórmula Detallada:",
                                            text: `${Math.round(projectState.surfaceArea || 0).toLocaleString('es-ES')} m² × ${(suggestedExitValue / (projectState.surfaceArea || 1)).toLocaleString('es-ES', { maximumFractionDigits: 0 })} €/m² = ${Math.round(suggestedExitValue).toLocaleString('es-ES')} €`
                                        }}
                                        examples={{
                                            label: "Contexto del Diferencial:",
                                            items: [
                                                "El Valor Inicial suele ser el precio de adquisición (que puede estar por debajo de mercado).",
                                                `La proyección utiliza métricas reales de la zona (${suggestedExitValueSource || 'tendencia de la región'}).`,
                                                "Por esto, el Valor de Salida puede ser significativamente mayor si el activo se adquirió a un precio de 'oportunidad' y se proyecta a valor de mercado."
                                            ]
                                        }}
                                        footer="* Puedes sobrescribir este valor manualmente en el campo de arriba."
                                    />
                                    <div className="flex-grow">
                                        <p className="text-sm text-blue-100 leading-tight">
                                            Valor Salida: <span className="font-bold text-lg text-white">{(suggestedExitValue / 1000000).toLocaleString('es-ES', { maximumFractionDigits: 1 })}M €</span>
                                        </p>
                                        <p className="text-xs text-blue-300 mt-1">
                                            Basado en {suggestedExitValueSource || 'tendencia de la región'} a {projectState.timeHorizonYears} años
                                        </p>
                                    </div>
                                </div>
                            )}

                            {suggestedDiscountRate && (
                                <div className="flex items-start gap-3 p-4 bg-blue-800/40 rounded-xl border border-blue-600/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <RichTooltip
                                        trigger={<Info className="h-5 w-5 text-blue-400 cursor-help hover:text-blue-300 mt-0.5 flex-shrink-0" />}
                                        title="Sugerencia de Tasa de Descuento"
                                        description="Un CFO calcula esta tasa usando el coste del capital (WACC)."
                                        goldenRule={{
                                            label: "Metodología Arkia:",
                                            text: "Tipo de Interés Fijo Medio + Diferencial de Riesgo (2,50%)"
                                        }}
                                        examples={{
                                            label: "Componentes del Cálculo:",
                                            items: [
                                                `Interés de Referencia: ${interestRateSource || 'Dato no disponible'}.`,
                                                "Diferencial: Prima de riesgo estándar del 2,50% para activos inmobiliarios.",
                                                `Sugerencia total: ${suggestedDiscountRate.toLocaleString('es-ES', { minimumFractionDigits: 2 })}%`
                                            ]
                                        }}
                                        footer="* Sugerencia de CFO para la rentabilidad exigida."
                                    />
                                    <div className="flex-grow">
                                        <p className="text-sm text-blue-100 leading-tight">
                                            Tasa Descuento: <span className="font-bold text-lg text-white">{suggestedDiscountRate.toLocaleString('es-ES', { minimumFractionDigits: 2 })}%</span>
                                        </p>
                                        <p className="text-xs text-blue-300 mt-1">
                                            Calculada vía WACC (Ref: {interestRateSource || 'Mercado'})
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </CardContent>
        </Card >
    );
};

export const AnnualFlowsGrid: React.FC<FinancialSubComponentProps> = ({ projectState, onChange, onUpdateFlow, onLoadSession }) => {

    // Local state for IPC
    const [ipcRate, setIpcRate] = useState(2);

    // Internal handlers/fallbacks if parent doesn't provide them
    const handleUpdateFlow = onUpdateFlow || ((year, field, value, commit = false) => {
        const newFlows = projectState.annualFlows.map(f => {
            if (f.year === year) {
                return { ...f, [field]: value };
            }
            return f;
        });
        onChange({ ...projectState, annualFlows: newFlows }, commit);
    });

    const applyIPC = () => {
        const newFlows = [...projectState.annualFlows];
        for (let i = 1; i < newFlows.length; i++) {
            // Apply compounding growth only to Income (Rent Indexation)
            const prevIncome = Number(newFlows[i - 1].grossIncome);

            newFlows[i] = {
                ...newFlows[i],
                grossIncome: prevIncome * (1 + ipcRate / 100)
            };
        }
        onChange({ ...projectState, annualFlows: newFlows }, true); // Explicitly commit IPC application
    };

    return (
        <Card className="border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.05)] bg-white rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="py-4 px-5 bg-slate-50 border-b border-slate-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Flujos de Caja</CardTitle>
                        {onLoadSession && (
                            <div className="-my-1 relative z-10">
                                <CalculationSessionManager
                                    currentProjectState={projectState}
                                    onLoadSession={onLoadSession}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                            <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">IPC %</span>
                            <Input
                                type="number"
                                value={ipcRate}
                                onChange={(e) => setIpcRate(Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                className="h-4 w-10 text-[10px] border-none p-0 focus-visible:ring-0 text-right"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-6 text-[10px] px-2" onClick={applyIPC}>
                            <TrendingUp className="h-3 w-3 mr-1" /> Aplicar
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent sticky top-0 bg-white shadow-sm z-10 border-b border-slate-100">
                            <TableHead className="w-[40px] text-center text-xs font-bold py-1.5 text-slate-700 h-8">Año</TableHead>
                            <TableHead className="text-xs font-bold py-1.5 w-[90px] text-center text-slate-700 h-8">Ingresos</TableHead>
                            <TableHead className="text-xs font-bold py-1.5 w-[90px] text-center text-slate-700 h-8">
                                <div className="flex items-center justify-center gap-1">
                                    OPEX
                                    OPEX
                                    <RichTooltip
                                        trigger={<Info className="h-3 w-3 text-slate-400 cursor-help hover:text-slate-600" />}
                                        title="OPEX (Operational Expenditure)"
                                        description="Dinero necesario para el funcionamiento diario."
                                        goldenRule={{
                                            label: "Regla de Oro:",
                                            text: "¿Es necesario para mantenerlo tal como está hoy? -> ES OPEX"
                                        }}
                                        examples={{
                                            label: "EJEMPLOS:",
                                            items: [
                                                "Mantenimiento (Pintura, reparaciones)",
                                                "Impuestos (IBI, Tasas)",
                                                "Seguros y Suministros comunes",
                                                "Property Management"
                                            ]
                                        }}
                                        footer="* Se resta de los ingresos para calcular el NOI."
                                    />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-bold py-1.5 w-[90px] text-center text-slate-700 h-8">
                                <div className="flex items-center justify-center gap-1">
                                    CAPEX
                                    <RichTooltip
                                        trigger={<Info className="h-3 w-3 text-slate-400 cursor-help hover:text-slate-600" />}
                                        title="CAPEX Recurrente"
                                        description="Inversión para mejoras o reemplazo de grandes componentes."
                                        goldenRule={{
                                            label: "Diferencia con Mantenimiento:",
                                            text: "Cambiar una caldera entera es CAPEX. Repararla es OPEX."
                                        }}
                                        footer="* Se resta tras el NOI para obtener el Flujo de Caja Neto."
                                    />
                                </div>
                            </TableHead>
                            <TableHead className="text-xs font-bold text-right py-1.5 text-slate-700 h-8 px-2">NOI Neto</TableHead>
                            <TableHead className="text-xs font-bold text-right py-1.5 text-slate-700 h-8 px-2">Neto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projectState.annualFlows.map((flow) => {
                            const net = flow.grossIncome - flow.opex - flow.capex;
                            const isNegative = net < 0;
                            return (
                                <TableRow key={flow.year} className="hover:bg-slate-50 border-b border-slate-50 last:border-0">
                                    <TableCell className="font-medium text-center py-0.5 px-0 h-7 text-[10px] text-slate-500">{flow.year}</TableCell>
                                    <TableCell className="py-0.5 px-1 h-7">
                                        <Input
                                            type="number"
                                            value={flow.grossIncome || ''}
                                            onChange={(e) => handleUpdateFlow(flow.year, 'grossIncome', Number(e.target.value), false)}
                                            onBlur={(e) => handleUpdateFlow(flow.year, 'grossIncome', Number(e.target.value), true)}
                                            onFocus={(e) => e.target.select()}
                                            className="h-5 text-[10px] text-right px-1 w-full bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                                        />
                                    </TableCell>
                                    <TableCell className="py-0.5 px-1 h-7">
                                        <Input
                                            type="number"
                                            value={flow.opex || ''}
                                            onChange={(e) => handleUpdateFlow(flow.year, 'opex', Number(e.target.value), false)}
                                            onBlur={(e) => handleUpdateFlow(flow.year, 'opex', Number(e.target.value), true)}
                                            onFocus={(e) => e.target.select()}
                                            className="h-5 text-[10px] text-right px-1 w-full text-red-600 bg-red-50/30 border-red-100 focus:bg-white transition-colors"
                                        />
                                    </TableCell>
                                    <TableCell className="py-0.5 px-1 h-7">
                                        <Input
                                            type="number"
                                            value={flow.capex || ''}
                                            onChange={(e) => handleUpdateFlow(flow.year, 'capex', Number(e.target.value), false)}
                                            onBlur={(e) => handleUpdateFlow(flow.year, 'capex', Number(e.target.value), true)}
                                            onFocus={(e) => e.target.select()}
                                            className="h-5 text-[10px] text-right px-1 w-full text-amber-600 bg-amber-50/30 border-amber-100 focus:bg-white transition-colors"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right text-xs font-bold py-0.5 px-2 h-7 text-blue-600">
                                        {(flow.grossIncome - flow.opex).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                                    </TableCell>
                                    <TableCell className={`text-right text-xs font-bold py-0.5 px-2 h-7 ${isNegative ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {net.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};

// Legacy Export maintained for compatibility but uses new components
export const FinancialInputSection: React.FC<FinancialSubComponentProps & { className?: string }> = (props) => {
    const { projectState, onChange } = props;

    // Resize flows side effect (moved from original)
    useEffect(() => {
        const currentLength = projectState.annualFlows.length;
        const targetLength = projectState.timeHorizonYears;

        if (currentLength !== targetLength) {
            let newFlows = [...projectState.annualFlows];
            if (currentLength < targetLength) {
                const lastFlow = newFlows[currentLength - 1] || { year: 0, grossIncome: 0, opex: 0, capex: 0 };
                for (let i = currentLength + 1; i <= targetLength; i++) {
                    newFlows.push({
                        year: i,
                        grossIncome: lastFlow.grossIncome,
                        opex: lastFlow.opex,
                        capex: 0
                    });
                }
            } else {
                newFlows = newFlows.slice(0, targetLength);
            }
            props.onChange({ ...projectState, annualFlows: newFlows });
        }
    }, [projectState.timeHorizonYears]); // Depend primarily on length mismatch, but useEffect needs dependency

    return (
        <div className={`space-y-6 ${props.className}`}>
            <ProjectParametersCard projectState={projectState} onChange={onChange} />
            <AnnualFlowsGrid projectState={projectState} onChange={onChange} />
        </div>
    );
};
