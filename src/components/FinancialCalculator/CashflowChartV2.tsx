import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import type { CashflowDataPoint } from '../../services/mockFinancialData';

interface CashflowChartV2Props {
    data: CashflowDataPoint[];
    exitValue: number;
    hideControls?: boolean;
}

export const CashflowChartV2: React.FC<CashflowChartV2Props> = ({ data, exitValue, hideControls = false }) => {
    const [viewMode, setViewMode] = useState<'full' | 'operating'>('full');

    // Process data to match the requested visualization
    // Blue Bar: Free Cash Flow (Total Net Flow)
    // Yellow Line: Operational Cash Flow (NOI)
    // Red Line: CAPEX (Investment)
    const processedData = data
        .filter(d => viewMode === 'full' || d.year > new Date().getFullYear()) // Filter out Year 0 (current year) in operating mode
        .map(d => {
            const isLastYear = d.year === Math.max(...data.map(p => p.year));

            // Base: The total flow per Mock Data includes Exit Value in the last year
            let fullTotal = d.totalCashflow;

            // Decompose
            let exitComponent = 0;
            let operatingComponent = fullTotal;

            if (isLastYear) {
                // If it's the last year, we separate the Exit Value
                exitComponent = exitValue;
                operatingComponent = fullTotal - exitValue;
            }

            // Apply View Mode Filters
            if (viewMode === 'operating') {
                // In operating mode, we hide the exit separation
                // But we ALSO want to hide the exit value amount entirely
                exitComponent = 0;
                // operatingComponent remains as (Total - Exit) which is correct for "Operating View"
            }

            return {
                ...d,
                // Stacked Bar Components
                barOperational: operatingComponent,
                barExit: exitComponent,

                // Line Data (Unchanged logic)
                operatingCashFlow: d.operationalCashflow,
                // For Capex line: In operating mode we might want to ensure we don't show the exit-related capital flow if any
                // The mock data logic for capitalCashflow at year N was (Exit - Capex).
                // If we want just Capex, we should probably take 'flow.capex' from source, but we only have processed data.
                // processedData[N].capitalCashflow = Exit - Capex.
                // So Capex = Exit - capitalCashflow. (If positive? Mock data says capital is usually negative for opex/capex)
                // Let's stick to simple Math.abs but if viewMode is operating, we strip exit if present?
                // Actually, let's keep the yellow/red lines as "Reference" lines unchanged for now unless requested.
                // The User asked for the BAR to be stacked.
                capexLine: Math.abs(d.capitalCashflow - (viewMode === 'operating' && isLastYear ? exitValue : 0)),
                displayLabel: d.year === new Date().getFullYear() ? 'Inicial' : d.year.toString()
            };
        });

    return (
        <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <CardTitle className="text-base font-semibold text-slate-900">Evolución de Flujo de Caja</CardTitle>
                        <CardDescription className="text-xs">Free Cash Flow (Barras) vs Operativo y Capex (Líneas)</CardDescription>
                    </div>
                    {!hideControls && (
                        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                            <Switch
                                id="view-mode"
                                checked={viewMode === 'operating'}
                                onCheckedChange={(checked) => setViewMode(checked ? 'operating' : 'full')}
                                className="scale-75 data-[state=checked]:bg-blue-600"
                            />
                            <Label htmlFor="view-mode" className="text-[10px] font-medium text-slate-600 cursor-pointer select-none">
                                Vista Operativa
                            </Label>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={processedData}
                            margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
                        >
                            <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="displayLabel"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 11 }}
                                interval="preserveStartEnd"
                                padding={{ left: 20, right: 20 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 11 }}
                                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                            />
                            <RechartsTooltip
                                formatter={(value: number, name: string) => {
                                    const valStr = `€${Math.round(value).toLocaleString()}`;
                                    if (name === 'barOperational') return [valStr, 'Flujo Operativo (Neto)'];
                                    if (name === 'barExit') return [valStr, 'Valor de Salida (Reversión)'];
                                    if (name === 'operatingCashFlow') return [valStr, 'NOI (Operativo)'];
                                    if (name === 'capexLine') return [valStr, 'CAPEX'];
                                    return [valStr, name];
                                }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px', marginTop: '10px', fontSize: '10px' }}
                                verticalAlign="bottom"
                                align="center"
                            />
                            <ReferenceLine y={0} stroke="#94a3b8" />

                            {/* Stacked Bar 1: Operational Flow (Blue/Red) */}
                            <Bar
                                dataKey="barOperational"
                                name="Flujo Operativo (Neto)"
                                stackId="a"
                                fill="#3b82f6"
                                barSize={20}
                                radius={[2, 2, 2, 2]} // Rounded
                            >
                                {processedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.barOperational < 0 ? '#ef4444' : '#3b82f6'} />
                                ))}
                            </Bar>

                            {/* Stacked Bar 2: Exit Value (Gold/Green) */}
                            <Bar
                                dataKey="barExit"
                                name="Valor de Salida"
                                stackId="a"
                                fill="#10b981" // Emerald Green for "Money in" / Exit
                                barSize={20}
                                radius={[2, 2, 0, 0]} // Top rounded
                            />

                            {/* Yellow Line: Operating CF */}
                            <Line
                                type="monotone"
                                dataKey="operatingCashFlow"
                                name="Cash Flow Operativo"
                                stroke="#facc15"
                                strokeWidth={3}
                                dot={{ r: 3, fill: '#facc15' }}
                            />

                            {/* Red Line: CAPEX */}
                            <Line
                                type="step"
                                dataKey="capexLine"
                                name="CAPEX"
                                stroke="#b91c1c"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                            />

                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
