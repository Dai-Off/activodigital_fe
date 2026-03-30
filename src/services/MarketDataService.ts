import { calcuSupabaseClient } from '../lib/calcuSupabaseClient';

export interface MarketData {
    regionName: string;
    priceM2: number;
    trendAnnual: number | null;
    source: string;
    date: string;
}

export class MarketDataService {

    /**
     * Tries to find market data for a specific building by ID (Most reliable).
     * @param buildingId The ID of the building in Supabase.
     */
    static async getMarketDataByBuildingId(buildingId: string): Promise<MarketData | null> {
        if (!buildingId) return null;

        try {
            // CALL BACKEND API to ensure On-Demand Scraping Logic triggers
            // We use the same backend URL structure inferred from other services or relative path if proxied.
            // Assuming the frontend has a way to call the backend. 
            // If running locally, it might be localhost:3000. 
            // Ideally, we use an environment variable for API_URL.

            // For now, let's try to fetch from the backend endpoint we just created.
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/edificios/${buildingId}/market-price`);

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.price) {
                    return {
                        regionName: "Ubicación del Edificio", // We might want to fetch the address name too?
                        priceM2: data.price,
                        trendAnnual: null,
                        source: data.source || 'Idealista (On-Demand)',
                        date: new Date().toISOString()
                    };
                }
            }
        } catch (e) {
            console.error("[MARKET DATA] Error fetching from Backend API:", e);
        }

        // Fallback: Try reading from Supabase directly in case API fails or is offline?
        // Or just return null as the API handles the logic now.
        return null;
    }

    /**
     * Tries to find a matching region for the given address and returns the latest market data.
     * @param address The plain text address of the building.
     */
    static async getMarketDataByAddress(address: string): Promise<MarketData | null> {
        if (!address) return null;

        // NEW LOGIC: Read from DB (precios_m2_idealista or buildings table)
        // Since the Cron Job updates the 'buildings' or 'precios_m2_idealista' table,
        // we should query the most recent data stored there.

        // Strategy: 
        // 1. We assume the Cron Job updates the 'buildings' table 'market_price_m2' field.
        // 2. However, this method takes an 'address' string, not a building ID.
        // 3. So we should find the building by address or find the region.

        // For compliance with the user request "run once at week... maintain updated Valor... instead to call apify every time",
        // we essentially treat the DB as the source (cached).

        // Let's fallback to searching the 'buildings' table directly for this address to get the price.
        try {
            const { data: buildingData, error: _error } = await calcuSupabaseClient
                .from('buildings')
                .select('market_price_m2, last_price_update')
                .eq('address', address) // Exact match might be tricky, but let's try
                .single();

            if (buildingData && buildingData.market_price_m2) {
                return {
                    regionName: address, // Or derive from address
                    priceM2: buildingData.market_price_m2,
                    trendAnnual: null,
                    source: 'Cron Updated (Apify)',
                    date: buildingData.last_price_update || new Date().toISOString()
                };
            }
        } catch (e) {
            // Ignore match error
        }

        // 2. Fallback to Region Price History (Legaxy DB) if building specific price is missing
        // (Keeping as backup if Cron hasn't run yet)

        let bestMatchRegion = null;
        try {
            const { data: regions } = await calcuSupabaseClient.from('regions').select('*');
            if (regions) {
                const normalized = address.toLowerCase();
                const matches = regions.filter(r => normalized.includes(r.name.toLowerCase()));
                if (matches.length > 0) bestMatchRegion = matches.sort((a, b) => b.name.length - a.name.length)[0];
            }

            if (bestMatchRegion) {
                const { data: priceHistory } = await calcuSupabaseClient
                    .from('precios_m2_idealista')
                    .select('*')
                    .eq('region_id', bestMatchRegion.id)
                    .order('date', { ascending: false })
                    .limit(1)
                    .single();

                if (priceHistory) {
                    return {
                        regionName: bestMatchRegion.name,
                        priceM2: Number(priceHistory.price),
                        trendAnnual: priceHistory.trend_annual,
                        source: priceHistory.source,
                        date: priceHistory.date
                    };
                }
            }
        } catch (e) {
            console.error("DB Fallback error", e);
        }

        return null;
    }

    /**
     * Retrieves historical price evolution for a given municipality or province.
     * Tries municipality first, falls back to province if insufficient data.
     * @param municipio Name of the municipality
     * @param provincia Name of the province
     */
    static async getHistoricalEvolution(municipio: string, provincia: string): Promise<{
        year: number;
        quarter: number;
        price_under_5_years: number | null;
        price_over_5_years: number | null;
        price_total?: number | null;
    }[]> {
        if (!municipio && !provincia) return [];

        try {
            // Helper function to fetch data
            const fetchData = async (filterColumn: string, filterValue: string) => {
                const { data, error } = await calcuSupabaseClient
                    .from('precios_m2_ine')
                    .select('anio, trimestre, precio_m2_hasta_5_anos, precio_m2_mas_5_anos, precio_m2_total')
                    .eq(filterColumn, filterValue)
                    .order('anio', { ascending: true })
                    .order('trimestre', { ascending: true });

                if (error) throw error;
                return data || [];
            };

            // 1. Try Municipality
            let results: any[] = [];
            if (municipio) {
                results = await fetchData('municipio', municipio);
            }

            // 2. Fallback to Province if insufficient data (< 20 points = 5 years * 4 quarters)
            if (results.length < 20 && provincia) {
                console.log(`[MarketData] Insufficient data for municipality '${municipio}' (${results.length}), falling back to province '${provincia}'.`);

                const provinceData = await calcuSupabaseClient
                    .from('precios_m2_ine')
                    .select('anio, trimestre, precio_m2_hasta_5_anos, precio_m2_mas_5_anos, precio_m2_total')
                    .eq('provincia', provincia);

                if (provinceData.data && provinceData.data.length > 0) {
                    // Aggregate by Quarter
                    const aggregated: Record<string, { count: number, sumUnder5: number, sumOver5: number, year: number, q: number }> = {};

                    provinceData.data.forEach(row => {
                        const key = `${row.anio}-${row.trimestre}`;
                        if (!aggregated[key]) {
                            aggregated[key] = { count: 0, sumUnder5: 0, sumOver5: 0, year: row.anio, q: row.trimestre };
                        }

                        // Check for valid numbers
                        if (row.precio_m2_hasta_5_anos) {
                            aggregated[key].sumUnder5 += Number(row.precio_m2_hasta_5_anos);
                        }
                        if (row.precio_m2_mas_5_anos) {
                            aggregated[key].sumOver5 += Number(row.precio_m2_mas_5_anos);
                        }
                        aggregated[key].count++;
                    });

                    results = Object.values(aggregated).map(item => ({
                        anio: item.year,
                        trimestre: item.q,
                        precio_m2_hasta_5_anos: item.count ? item.sumUnder5 / item.count : 0,
                        precio_m2_mas_5_anos: item.count ? item.sumOver5 / item.count : 0
                    })).sort((a, b) => (a.anio - b.anio) || (a.trimestre - b.trimestre));
                }
            }

            return results.map(r => ({
                year: r.anio,
                quarter: r.trimestre,
                price_under_5_years: r.precio_m2_hasta_5_anos || null,
                price_over_5_years: r.precio_m2_mas_5_anos || null,
                price_total: r.precio_m2_total || null
            }));

        } catch (e) {
            console.error("[MARKET DATA] Error fetching history:", e);
            return [];
        }
    }

    /**
     * Tries to find the latest "registered" price (Valor Compra-Venta) for a given municipality or province.
     * This typically comes from "Registradores" or similar official sources.
     * @param municipio Municipality name
     * @param provincia Province name
     */
    static async getRegisteredPrice(municipio: string, provincia: string): Promise<number | null> {
        if (!municipio && !provincia) return null;

        try {
            // 1. Find Region ID (Reusing logic from getIdealistaHistory)
            let regionId = null;

            if (municipio) {
                const { data: regionData } = await calcuSupabaseClient
                    .from('regions')
                    .select('id, name')
                    .ilike('name', municipio)
                    .limit(1)
                    .single();
                if (regionData) regionId = regionData.id;
            }

            if (!regionId && provincia) {
                const { data: regionData } = await calcuSupabaseClient
                    .from('regions')
                    .select('id, name')
                    .ilike('name', provincia)
                    .limit(1)
                    .single();
                if (regionData) regionId = regionData.id;
            }

            if (!regionId) return null;

            // 2. Fetch Price from precios_m2_registradores
            // Columns: general, nueva, usada. We use 'general' as the average.
            const { data, error: _error } = await calcuSupabaseClient
                .from('precios_m2_registradores')
                .select('general')
                .eq('region_id', regionId)
                .order('year', { ascending: false })
                .order('trimestre', { ascending: false })
                .limit(1)
                .single();

            if (data && data.general) {
                return Number(data.general);
            }

        } catch (e) {
            console.warn("[MarketData] Failed to fetch registered price:", e);
        }

        return null;
    }

    /**
     * Retrieves historical price evolution from 'Idealista' (precios_m2_idealista).
     * @param municipio Municipality name
     * @param provincia Province name
     */
    static async getIdealistaHistory(municipio: string, provincia: string): Promise<any[]> {
        if (!municipio && !provincia) return [];

        try {
            // 1. Find Region ID
            // We need to match the name in 'regions' table.
            // Try Municipality first, then Province.
            let regionId = null;

            if (municipio) {
                const { data: regionData } = await calcuSupabaseClient
                    .from('regions')
                    .select('id, name')
                    .ilike('name', municipio) // Case insensitive match
                    .limit(1)
                    .single();

                if (regionData) {
                    regionId = regionData.id;
                }
            }

            if (!regionId && provincia) {
                // Fallback to Province
                const { data: regionData } = await calcuSupabaseClient
                    .from('regions')
                    .select('id, name')
                    .ilike('name', provincia)
                    .limit(1)
                    .single();
                if (regionData) {
                    regionId = regionData.id;
                    console.log(`[MarketData] Municipality '${municipio}' not found in regions, using province '${provincia}'`);
                }
            }

            if (!regionId) {
                console.warn(`[MarketData] Region not found for '${municipio}' or '${provincia}'`);
                return [];
            }

            // 2. Fetch History
            const { data: history } = await calcuSupabaseClient
                .from('precios_m2_idealista')
                .select('*')
                .eq('region_id', regionId)
                .order('date', { ascending: true }); // Oldest first for chart

            if (!history || history.length === 0) return [];

            // 3. Transform to Chart Format
            // We need year/quarter for the chart X-Axis matching.
            return history.map(item => {
                const d = new Date(item.date);
                return {
                    year: d.getFullYear(),
                    quarter: Math.ceil((d.getMonth() + 1) / 3),
                    price: Number(item.price),
                    source: 'Idealista'
                };
            });

        } catch (e) {
            console.error("[MARKET DATA] Error fetching Idealista history:", e);
            return [];
        }
    }


    /**
     * Retrieves annual price history and generates a 3-year projection based on linear regression.
     * @param municipio Municipality name
     * @param provincia Province name (fallback)
     */
    static async getProjectedPriceEvolution(municipio: string, provincia: string): Promise<{ year: number; price: number; type: 'history' | 'projection'; }[]> {
        if (!municipio && !provincia) return [];

        try {
            // 1. Fetch Quarterly Data (Reusable logic)
            // We reuse getHistoricalEvolution but we need the raw data to aggregate manually if needed, 
            // or we can use the result of getHistoricalEvolution and average it.
            // getHistoricalEvolution returns { year, quarter, price_under_5, price_over_5 }
            const quarterlyData = await this.getHistoricalEvolution(municipio, provincia);

            if (quarterlyData.length === 0) return [];

            // 2. Aggregate by Year (Annual Average of available quarters)
            const annualData: { year: number; price: number }[] = [];
            const yearlySums: Record<number, { sum: number, count: number }> = {};

            quarterlyData.forEach(q => {
                let p = 0;
                let c = 0;

                // Use total price if available (covers 2005-2010 data which lacks breakdown)
                if (q.price_total) {
                    p = q.price_total;
                    c = 1;
                } else if (q.price_under_5_years && q.price_over_5_years) {
                    p = (q.price_under_5_years + q.price_over_5_years) / 2;
                    c = 1;
                } else if (q.price_under_5_years) {
                    p = q.price_under_5_years;
                    c = 1;
                } else if (q.price_over_5_years) {
                    p = q.price_over_5_years;
                    c = 1;
                }

                if (c > 0) {
                    if (!yearlySums[q.year]) yearlySums[q.year] = { sum: 0, count: 0 };
                    yearlySums[q.year].sum += p;
                    yearlySums[q.year].count += 1;
                }
            });

            const sortedYears = Object.keys(yearlySums).map(Number).sort((a, b) => a - b);

            sortedYears.forEach(y => {
                annualData.push({
                    year: y,
                    price: yearlySums[y].sum / yearlySums[y].count
                });
            });

            // Prepare return with history
            const result: { year: number; price: number; type: 'history' | 'projection' }[] = annualData.map(d => ({
                year: d.year,
                price: d.price,
                type: 'history' as const
            }));

            // Regression Logic
            if (annualData.length >= 2) {
                // Take last 5 years max
                const regressionSet = annualData.slice(-5);

                // Simple Linear Regression: y = mx + b
                const n = regressionSet.length;
                let sumX = 0;
                let sumY = 0;
                let sumXY = 0;
                let sumXX = 0;

                regressionSet.forEach(d => {
                    sumX += d.year;
                    sumY += d.price;
                    sumXY += d.year * d.price;
                    sumXX += d.year * d.year;
                });

                const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);


                // Calculate CAGR / Percentage Growth implied by slope relative to last price
                const lastYear = regressionSet[regressionSet.length - 1];
                const growthRate = slope / lastYear.price;

                // Capping Rule: If growth > 4%, cap to 3%
                let finalSlope = slope;
                if (growthRate > 0.04) {
                    finalSlope = lastYear.price * 0.03; // Enforce 3% growth slope
                }

                // Project next 5 years
                const lastHistoryYear = lastYear.year;
                for (let i = 1; i <= 5; i++) {
                    const futureYear = lastHistoryYear + i;
                    // Use regression line or just apply slope from last actual point? 
                    // To ensure visual continuity (no jump) and respect the capped slope,
                    // we project starting from the last actual price.
                    // Formula: P(t) = P(last) + slope * (t - last_t)

                    const projectedPrice = lastYear.price + (finalSlope * i);

                    result.push({
                        year: futureYear,
                        price: projectedPrice,
                        type: 'projection'
                    });
                }
            }

            return result;

        } catch (e) {
            console.error("[MARKET DATA] Error generating projection:", e);
            return [];
        }
    }

    /**
     * Retrieves historical price evolution from 'Registradores' (precios_m2_registradores).
     * Uses 'usada' column for price.
     * @param municipio Municipality name
     * @param provincia Province name
     */
    static async getRegistradoresHistory(municipio: string, provincia: string): Promise<{ year: number; quarter: number; price: number; source: string; type: 'history' | 'projection'; }[]> {
        if (!municipio && !provincia) return [];

        try {
            // 1. Find Region ID (Reusing logic)
            // Ideally we should extract this to a private helper method 'findRegionId'
            let regionId = null;

            if (municipio) {
                const { data: regionData } = await calcuSupabaseClient
                    .from('regions')
                    .select('id, name')
                    .ilike('name', municipio)
                    .limit(1)
                    .single();
                if (regionData) regionId = regionData.id;
            }

            if (!regionId && provincia) {
                const { data: regionData } = await calcuSupabaseClient
                    .from('regions')
                    .select('id, name')
                    .ilike('name', provincia)
                    .limit(1)
                    .single();
                if (regionData) regionId = regionData.id;
            }

            if (!regionId) {
                console.warn(`[MarketData] Region not found for '${municipio}' or '${provincia}' (Registradores)`);
                return [];
            }

            // 2. Fetch History
            const { data: history } = await calcuSupabaseClient
                .from('precios_m2_registradores')
                .select('*')
                .eq('region_id', regionId)
                .order('year', { ascending: true })
                .order('trimestre', { ascending: true });

            if (!history || history.length === 0) return [];

            // 3. Transform to Chart Format
            const mappedHistory = history.map(item => ({
                year: item.year,
                quarter: item.trimestre,
                price: Number(item.usada), // Use 'usada' as requested
                source: 'Registradores',
                type: 'history' as const
            }));

            // 4. Projection Logic (Linear Regression on last 5 years / 20 quarters)
            const result: { year: number; quarter: number; price: number; source: string; type: 'history' | 'projection' }[] = [...mappedHistory];

            if (mappedHistory.length >= 4) { // Need at least a year of data to project safely
                // Take last 20 quarters max (5 years)
                const regressionSet = mappedHistory.slice(-20);

                // We need a continuous X axis for regression. 
                // Let's use a simple index relative to the start of the regression set.
                // Or better, convert Year/Quarter to a continuous value: Year + (Quarter-1)/4

                const n = regressionSet.length;
                let sumX = 0;
                let sumY = 0;
                let sumXY = 0;
                let sumXX = 0;

                const baseTime = regressionSet[0].year + (regressionSet[0].quarter - 1) * 0.25;

                regressionSet.forEach(d => {
                    const t = d.year + (d.quarter - 1) * 0.25 - baseTime; // Relative time from start of set
                    sumX += t;
                    sumY += d.price;
                    sumXY += t * d.price;
                    sumXX += t * t;
                });

                const denominator = (n * sumXX - sumX * sumX);
                if (denominator !== 0) {
                    const slope = (n * sumXY - sumX * sumY) / denominator;


                    let finalSlope = slope;
                    const lastPrice = regressionSet[regressionSet.length - 1].price;
                    const maxGrowthRate = 0.04; // 4% cap
                    if ((slope / lastPrice) > maxGrowthRate) {
                        finalSlope = lastPrice * 0.03; // Cap at 3% growth per year
                    }

                    // Project next 5 years (20 quarters)
                    const lastItem = mappedHistory[mappedHistory.length - 1];
                    let currentYear = lastItem.year;
                    let currentQuarter = lastItem.quarter;

                    for (let i = 1; i <= 20; i++) {
                        // Advance Quarter
                        currentQuarter++;
                        if (currentQuarter > 4) {
                            currentQuarter = 1;
                            currentYear++;
                        }

                        // Calculate new price based on slope from LAST KNOWN point
                        // Price = LastPrice + Slope * (TimeDelta in Years)
                        // Each step is 0.25 years
                        const timeDelta = i * 0.25;
                        const projectedPrice = lastItem.price + (finalSlope * timeDelta);

                        result.push({
                            year: currentYear,
                            quarter: currentQuarter,
                            price: projectedPrice,
                            source: 'Registradores (Proyección)',
                            type: 'projection' as const
                        });
                    }
                }
            }

            return result;

        } catch (e) {
            console.error("[MARKET DATA] Error fetching Registradores history:", e);
            return [];
        }
    }

    // Retrieves the latest average interest rate for a given province or autonomous community.
    // @param province Province name
    static async getRegionalInterestRate(province: string): Promise<number | null> {
        try {
            // First, get the geo_id for the province
            const { data: geoData, error: geoError } = await calcuSupabaseClient
                .from('dim_geography')
                .select('id')
                .ilike('name', `%${province}%`)
                .eq('level', 'provincia')
                .single();

            if (geoError || !geoData) {
                console.warn(`[MARKET DATA] Geo ID not found for province: ${province}`);
                return null;
            }

            // Fetch the latest mortgage market data for this geo_id
            const { data, error } = await calcuSupabaseClient
                .from('fact_mortgage_market')
                .select('interest_rate_fixed, period_year, period_quarter')
                .eq('geo_id', geoData.id)
                .order('period_year', { ascending: false })
                .order('period_quarter', { ascending: false })
                .limit(1)
                .single();

            if (error || !data) {
                console.warn(`[MARKET DATA] Mortgage data not found for geo_id: ${geoData.id}`);
                return null;
            }

            return data.interest_rate_fixed ? Number(data.interest_rate_fixed) : null;
        } catch (error) {
            console.error('[MARKET DATA] Error in getRegionalInterestRate:', error);
            return null;
        }
    }
}
