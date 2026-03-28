import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { RichTooltip } from "~/components/ui/RichTooltip";
import type { SensitivityPoint } from '../../services/mockFinancialData';

interface SensitivityChartProps {
    data: SensitivityPoint[];
    irr: number;
}

export const SensitivityChart: React.FC<SensitivityChartProps> = ({ data, irr }) => {

    // Custom Dot to highlight the User's current Rate
    const CustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        if (payload.isCurrent) {
            return (
                <circle cx={cx} cy={cy} r={6} stroke="none" fill="#3b82f6" />
            );
        }
        return null;
    };

    return (
        <Card className="bg-white border-none shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <CardTitle className="text-base font-semibold text-slate-900">Sensibilidad (VAN vs Tasa)</CardTitle>
                        <CardDescription className="text-xs">Impacto de la Tasa de Descuento en el Valor</CardDescription>
                    </div>
                    <RichTooltip
                        title="Análisis de Sensibilidad"
                        description="Muestra cómo varía el VAN al cambiar la tasa de descuento."
                        goldenRule={{
                            label: "Interpretación:",
                            text: "Cuanto más inclinada la curva, mayor riesgo ante cambios en la tasa. El punto donde cruza 0 es la TIR."
                        }}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 30, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="discountRate"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={(val) => `${val}%`}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={true}
                            />
                            <YAxis
                                tickFormatter={(val) => `€${(val / 1000).toFixed(0)}k`}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                                width={50}
                            />
                            <Tooltip
                                formatter={(val: number) => [`€${Math.round(val).toLocaleString()}`, 'VAN']}
                                labelFormatter={(val) => `Tasa: ${val}%`}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <ReferenceLine y={0} stroke="#94a3b8" />

                            {/* Reference Line for IRR (Where NPV = 0) */}
                            {irr > 0 && irr < 100 && (
                                <ReferenceLine x={irr} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'TIR', fill: '#10b981', fontSize: 10, position: 'top' }} />
                            )}

                            <Line
                                type="monotone"
                                dataKey="npv"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={<CustomDot />}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
