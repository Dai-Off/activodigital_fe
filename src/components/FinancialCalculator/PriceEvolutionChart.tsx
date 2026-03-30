import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface PriceEvolutionData {
    // legacy / idealista
    year: number;
    quarter?: number;
    price_under_5_years?: number | null;
    price_over_5_years?: number | null;
    price?: number | null;
    source?: string;
    // new INE projection
    type?: 'history' | 'projection';
}

interface PriceEvolutionChartProps {
    data: PriceEvolutionData[];
    variant?: 'ine' | 'idealista' | 'registradores';
}

export const PriceEvolutionChart: React.FC<PriceEvolutionChartProps> = ({ data, variant = 'ine' }) => {
    // Transform data for chart: create a "label" (e.g. "2022-Q1") and ensure numbers are valid
    // Transform data for chart
    let chartData: any[] = [];

    if (variant === 'ine') {
        // New Logic for INE Projection
        // We expect data to be { year, price, type }[]
        // We need to split into 'History' and 'Projection' series.
        // To connect them, we find the last history point and ensure the projection series starts there?
        // Or we just map them to different keys.

        chartData = data.map(item => ({
            name: item.quarter ? `${item.year}-Q${item.quarter}` : `${item.year}`,
            "Histórico": item.type === 'history' || !item.type ? item.price : null,
            "Proyección": item.type === 'projection' ? item.price : null,
            // Keep legacy keys just in case mixed data (though we shouldn't have it)
            "Menos de 5 años": item.price_under_5_years,
            "Más de 5 años": item.price_over_5_years,
            original: item
        }));

        // Fix connectivity: The last point of history should also be available to projection for smooth transition?
        // Or just render them. Recharts won't connect different keys automatically.
        // Trick: Add a point that has BOTH keys?
        // Let's find the transition point.
        let lastHistoryIndex = -1;
        for (let i = chartData.length - 1; i >= 0; i--) {
            if (chartData[i].original.type === 'history' || !chartData[i].original.type) {
                lastHistoryIndex = i;
                break;
            }
        }

        if (lastHistoryIndex !== -1 && lastHistoryIndex < chartData.length - 1) {
            // The next point is projection.
            // We can make the last history point ALSO have a "Proyección" value equal to its history value.
            chartData[lastHistoryIndex]["Proyección"] = chartData[lastHistoryIndex]["Histórico"];
        }

    } else {
        // Idealista / Registradores logic (Standard History + Potential Projection)
        const historyKey = variant === 'registradores' ? "Histórico" : "Precio m²";

        chartData = data.map(item => ({
            ...item,
            name: item.quarter ? `${item.year}-Q${item.quarter}` : `${item.year}`,
            [historyKey]: item.type === 'history' || !item.type ? item.price : null,
            "Proyección": item.type === 'projection' ? item.price : null
        }));

        // Connectivity fix for Registradores Projection
        if (variant === 'registradores') {
            let lastHistoryIndex = -1;
            for (let i = chartData.length - 1; i >= 0; i--) {
                if (chartData[i].original?.type === 'history' || chartData[i].type === 'history' || !chartData[i].type) { // Check original or mapped props
                    // Note: spread ...item puts type in root
                    lastHistoryIndex = i;
                    break;
                }
            }

            if (lastHistoryIndex !== -1 && lastHistoryIndex < chartData.length - 1) {
                chartData[lastHistoryIndex]["Proyección"] = chartData[lastHistoryIndex][historyKey];
            }
        }
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
                No hay datos disponibles para la selección actual.
            </div>
        );
    }

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fontSize: 12 }}
                        unit=" €"
                        width={60}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: number) => [`${value.toLocaleString('es-ES')} €/m²`]}
                    />
                    <Legend verticalAlign="top" height={36} />

                    {variant === 'ine' || variant === 'registradores' ? (
                        <>
                            <Line
                                type="monotone"
                                dataKey="Histórico"
                                stroke="#2563eb" // Blue-600
                                strokeWidth={3}
                                activeDot={{ r: 6 }}
                                dot={{ r: 4, strokeWidth: 0, fill: '#2563eb' }}
                                connectNulls={true}
                            />
                            <Line
                                type="monotone"
                                dataKey="Proyección"
                                stroke="#9333ea" // Purple-600 for projection
                                strokeWidth={3}
                                strokeDasharray="5 5"
                                activeDot={{ r: 6 }}
                                dot={{ r: 4, strokeWidth: 0, fill: '#9333ea' }}
                                connectNulls={true}
                            />
                        </>
                    ) : (
                        <Line
                            type="monotone"
                            dataKey="Precio m²"
                            stroke="#f59e0b" // Amber-500
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            dot={{ r: 3 }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
