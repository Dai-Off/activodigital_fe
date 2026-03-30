import type { FinancialProjectState, FinancialKPIs } from './mockFinancialData';
import type { AdvancedAIAnalysisResult } from './aiAnalysisService';
import type { Building } from './buildingsApi';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// ─── SHARED STYLE HELPERS ────────────────────────────────────────────────────

const COLORS = {
    darkSlate: 'FF1F2937',
    midSlate: 'FF374151',
    lightSlate: 'FFF3F4F6',
    white: 'FFFFFFFF',
    blue: 'FF1D4ED8',
    lightBlue: 'FFDBEAFE',
    emerald: 'FF065F46',
    lightGreen: 'FFD1FAE5',
    amber: 'FF92400E',
    lightAmber: 'FFFEF3C7',
    red: 'FFB91C1C',
    lightRed: 'FFFEE2E2',
    indigo: 'FF3730A3',
    lightIndigo: 'FFE0E7FF',
    gray: 'FF6B7280',
};

const makeStyle = (opts: {
    bold?: boolean;
    size?: number;
    color?: string;
    bgColor?: string;
    italic?: boolean;
    hAlign?: ExcelJS.Alignment['horizontal'];
    wrapText?: boolean;
    numFmt?: string;
}): Partial<ExcelJS.Style> => ({
    font: {
        bold: opts.bold,
        size: opts.size,
        italic: opts.italic,
        color: { argb: opts.color ?? COLORS.darkSlate },
    },
    fill: opts.bgColor
        ? { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.bgColor } }
        : undefined,
    alignment: {
        horizontal: opts.hAlign ?? 'left',
        vertical: 'middle',
        wrapText: opts.wrapText,
    },
    ...(opts.numFmt ? { numFmt: opts.numFmt } : {}),
});

const TITLE_STYLE = makeStyle({ bold: true, size: 14, color: COLORS.white, bgColor: COLORS.darkSlate, hAlign: 'center' });
const SECTION_STYLE = makeStyle({ bold: true, size: 11, color: COLORS.white, bgColor: COLORS.midSlate });
const HEADER_STYLE = makeStyle({ bold: true, size: 10, color: COLORS.darkSlate, bgColor: COLORS.lightSlate });
const LABEL_STYLE = makeStyle({ bold: true, size: 10, color: COLORS.darkSlate });
const VALUE_STYLE = makeStyle({ size: 10, color: COLORS.darkSlate });
const NOTE_STYLE = makeStyle({ size: 9, italic: true, color: COLORS.gray });

const EUR0 = '"€"#,##0';
const PCT = '0.00%';

function sectionHeader(ws: ExcelJS.Worksheet, row: number, text: string, colSpan: number) {
    ws.mergeCells(row, 1, row, colSpan);
    const cell = ws.getCell(row, 1);
    cell.value = text;
    Object.assign(cell, { style: SECTION_STYLE });
    ws.getRow(row).height = 22;
}

// ─── SHEET 1: RESUMEN EJECUTIVO ───────────────────────────────────────────────

function buildSummarySheet(
    wb: ExcelJS.Workbook,
    project: FinancialProjectState,
    kpis: FinancialKPIs,
    analysis: AdvancedAIAnalysisResult | null,
    building?: Building | null
) {
    const ws = wb.addWorksheet('1. Resumen Ejecutivo');
    ws.views = [{ showGridLines: false }];
    ws.getColumn(1).width = 36;
    ws.getColumn(2).width = 22;
    ws.getColumn(3).width = 22;
    ws.getColumn(4).width = 22;

    const vacancyRate = (project.vacancyRatePercent || 0) / 100;
    const totalInvestment = project.initialMarketValue + project.initialCapex;
    const firstFlow = project.annualFlows[0] || { grossIncome: 0, opex: 0, capex: 0 };
    const lastFlow = project.annualFlows[project.annualFlows.length - 1] || { grossIncome: 0, opex: 0, capex: 0 };
    const egi1 = firstFlow.grossIncome * (1 - vacancyRate);
    const noi1 = egi1 - firstFlow.opex;
    const egiN = lastFlow.grossIncome * (1 - vacancyRate);
    const noiN = egiN - lastFlow.opex;

    let r = 1;

    // Title
    ws.mergeCells(r, 1, r, 4);
    ws.getCell(r, 1).value = 'REPORTE FINANCIERO — ARKIA BI';
    Object.assign(ws.getCell(r, 1), { style: makeStyle({ bold: true, size: 16, color: COLORS.white, bgColor: COLORS.darkSlate, hAlign: 'center' }) });
    ws.getRow(r).height = 30;
    r++;

    ws.mergeCells(r, 1, r, 4);
    ws.getCell(r, 1).value = `Generado: ${new Date().toLocaleString('es-ES')}`;
    Object.assign(ws.getCell(r, 1), { style: makeStyle({ size: 9, italic: true, color: COLORS.gray, hAlign: 'center', bgColor: COLORS.lightSlate }) });
    r++; r++;

    // ── DATOS DEL EDIFICIO ──
    if (building) {
        sectionHeader(ws, r, '  DATOS DEL EDIFICIO', 4); r++;

        const typologyLabels: Record<string, string> = {
            residential: 'Residencial',
            mixed: 'Mixto',
            commercial: 'Comercial',
        };

        const buildingRows: [string, string | number | undefined][] = [
            ['Nombre', building.name],
            ['Dirección', building.address],
            ['Referencia Catastral', building.cadastralReference],
            ['Tipología', typologyLabels[building.typology] || building.typology],
            ['Año de Construcción', building.constructionYear],
            ['Nº Plantas', building.numFloors],
            ['Nº Unidades', building.numUnits],
            ['Municipio', building.municipality],
            ['Provincia', building.province],
            ['Código Postal', building.postalCode],
            ['Superficie (m²)', project.surfaceArea ? Math.round(project.surfaceArea) : building.squareMeters],
            ['Certificación Energética', project.energyRating || building.energy_certification || undefined],
            ['Precio de Mercado (€/m²)', building.market_price_m2],
        ];

        buildingRows.forEach(([label, value]) => {
            if (value === undefined && value !== 0) return; // skip undefined rows
            ws.getCell(r, 1).value = label;
            Object.assign(ws.getCell(r, 1), { style: LABEL_STYLE });
            const cell = ws.getCell(r, 2);
            cell.value = value ?? '—';
            if (typeof value === 'number' && label.includes('€')) {
                cell.numFmt = EUR0;
            }
            Object.assign(cell, { style: VALUE_STYLE });
            ws.getRow(r).height = 18;
            r++;
        });

        r++;
    }

    // ── PARÁMETROS DE ENTRADA ──
    sectionHeader(ws, r, '  PARÁMETROS DE ENTRADA', 4); r++;

    const params: [string, ExcelJS.CellValue, string][] = [
        ['Horizonte Temporal', project.timeHorizonYears, '0 "años"'],
        ['Valor Activo (Precio Compra)', project.initialMarketValue, EUR0],
        ['CAPEX Inicial (Rehabilitación)', project.initialCapex, EUR0],
        ['Inversión Total (Compra + CAPEX)', totalInvestment, EUR0],
        ['Tasa de Descuento (WACC / k)', project.discountRatePercent / 100, PCT],
        ['Tasa de Vacancia', vacancyRate, PCT],
        ['Yield de Mercado (Referencia)', (project.marketYieldPercent || 0) / 100, PCT],
        ['Valor de Salida (Exit Value)', kpis.exitValue, EUR0],
    ];

    params.forEach(([label, value, fmt]) => {
        ws.getCell(r, 1).value = label;
        Object.assign(ws.getCell(r, 1), { style: LABEL_STYLE });
        ws.getCell(r, 2).value = value;
        ws.getCell(r, 2).numFmt = fmt;
        Object.assign(ws.getCell(r, 2), { style: VALUE_STYLE });
        ws.getRow(r).height = 18;
        r++;
    });

    r++;

    // ── KPIs PRINCIPALES ──
    sectionHeader(ws, r, '  KPIs PRINCIPALES', 4); r++;

    // Header row
    ['Indicador', 'Valor', 'Benchmark Sector', 'Interpretación'].forEach((h, i) => {
        ws.getCell(r, i + 1).value = h;
        Object.assign(ws.getCell(r, i + 1), { style: HEADER_STYLE });
    });
    ws.getRow(r).height = 20;
    r++;

    const irrColor = kpis.irr >= 10 ? COLORS.lightGreen : kpis.irr >= 6 ? COLORS.lightAmber : COLORS.lightRed;
    const npvColor = kpis.npv > 0 ? COLORS.lightGreen : COLORS.lightRed;
    const pbColor = kpis.paybackYears < 10 ? COLORS.lightGreen : kpis.paybackYears < 15 ? COLORS.lightAmber : COLORS.lightRed;
    const yldColor = kpis.yieldOnCost >= (project.marketYieldPercent || 5) ? COLORS.lightGreen : COLORS.lightAmber;

    const kpiRows: [string, ExcelJS.CellValue, string, string, string, string][] = [
        ['TIR (Tasa Interna de Retorno)', kpis.irr / 100, PCT, '< 8% Core | 8–15% Value-Add | > 15% Oportunístico',
            kpis.irr >= 10 ? '✅ Atractiva' : kpis.irr >= 6 ? '⚠️ Moderada' : '❌ Baja', irrColor],
        ['VAN (Valor Actual Neto)', kpis.npv, EUR0, '> 0 crea valor',
            kpis.npv > 0 ? '✅ Positivo' : '❌ Destruye valor', npvColor],
        ['Payback (Recuperación)', kpis.paybackYears < 999 ? kpis.paybackYears : 'No alcanzado', '0.0 "años"',
            '< 10 excelente | 10–15 típico | > 20 largo plazo',
            kpis.paybackYears < 10 ? '✅ Excelente' : kpis.paybackYears < 15 ? '⚠️ Aceptable' : '❌ Largo', pbColor],
        ['NOI Año 1 (Neto Operativo)', noi1, EUR0, 'Base de valoración por capitalización',
            noi1 > 0 ? '✅ Positivo' : '❌ Negativo', noi1 > 0 ? COLORS.lightGreen : COLORS.lightRed],
        ['NOI Año N (Proyectado)', noiN, EUR0, 'Tendencia de crecimiento de rentas',
            noiN > noi1 ? '✅ Creciente' : '⚠️ Decreciente', noiN > noi1 ? COLORS.lightGreen : COLORS.lightAmber],
        ['Yield on Cost', kpis.yieldOnCost / 100, PCT, `Mercado: ${project.marketYieldPercent}%`,
            kpis.yieldOnCost >= (project.marketYieldPercent || 5) ? '✅ Sobre mercado' : '⚠️ Bajo mercado', yldColor],
        ['Valor DCF (Método Dinámico)', analysis?.valuation?.methodA?.value ?? kpis.npv + totalInvestment, EUR0,
            'VAN + Inversión Inicial', '—', COLORS.lightIndigo],
    ];

    kpiRows.forEach(([label, value, fmt, benchmark, interp, bg]) => {
        const bgStyle = makeStyle({ size: 10, bgColor: bg });
        ws.getCell(r, 1).value = label;
        Object.assign(ws.getCell(r, 1), { style: makeStyle({ bold: true, size: 10, bgColor: bg }) });
        ws.getCell(r, 2).value = typeof value === 'number' ? value : value;
        if (typeof value === 'number') ws.getCell(r, 2).numFmt = fmt;
        Object.assign(ws.getCell(r, 2), { style: bgStyle });
        ws.getCell(r, 3).value = benchmark;
        Object.assign(ws.getCell(r, 3), { style: makeStyle({ size: 9, italic: true, bgColor: bg, wrapText: true }) });
        ws.getCell(r, 4).value = interp;
        Object.assign(ws.getCell(r, 4), { style: makeStyle({ bold: true, size: 10, bgColor: bg, hAlign: 'center' }) });
        ws.getRow(r).height = 20;
        r++;
    });

    r++;

    // ── ESTRATEGIA IA ──
    if (analysis) {
        sectionHeader(ws, r, '  ESTRATEGIA RECOMENDADA (IA)', 4); r++;

        ws.getCell(r, 1).value = 'Recomendación:';
        Object.assign(ws.getCell(r, 1), { style: LABEL_STYLE });
        ws.mergeCells(r, 2, r, 4);
        ws.getCell(r, 2).value = analysis.strategy.title;
        Object.assign(ws.getCell(r, 2), { style: makeStyle({ bold: true, size: 11, color: COLORS.emerald }) });
        ws.getRow(r).height = 20;
        r++;

        ws.getCell(r, 1).value = 'Narrativa:';
        Object.assign(ws.getCell(r, 1), { style: LABEL_STYLE });
        ws.mergeCells(r, 2, r + 3, 4);
        ws.getCell(r, 2).value = analysis.storyTelling;
        Object.assign(ws.getCell(r, 2), { style: makeStyle({ size: 9, wrapText: true }) });
        ws.getRow(r).height = 80;
        r += 4;
    }

    // ── NOTAS ──
    r++;
    ws.mergeCells(r, 1, r, 4);
    ws.getCell(r, 1).value = '⚠️  Este reporte es una proyección financiera basada en los datos introducidos. No constituye asesoramiento de inversión.';
    Object.assign(ws.getCell(r, 1), { style: NOTE_STYLE });
}

// ─── SHEET 2: FLUJOS DE CAJA ──────────────────────────────────────────────────

function buildCashflowSheet(wb: ExcelJS.Workbook, project: FinancialProjectState, kpis: FinancialKPIs) {
    const ws = wb.addWorksheet('2. Flujos de Caja');
    ws.views = [{ showGridLines: false }];

    const colWidths = [8, 18, 18, 14, 18, 18, 18, 18, 18, 18];
    colWidths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

    const vacancyRate = (project.vacancyRatePercent || 0) / 100;
    const totalInvestment = project.initialMarketValue + project.initialCapex;

    let r = 1;

    ws.mergeCells(r, 1, r, 10);
    ws.getCell(r, 1).value = 'FLUJOS DE CAJA ANUALES — MODELO FINANCIERO DETALLADO';
    Object.assign(ws.getCell(r, 1), { style: TITLE_STYLE });
    ws.getRow(r).height = 28;
    r++; r++;

    // Column headers
    const headers = ['Año', 'Ingresos Brutos', 'EGI (Ef. Vacancia)', 'OPEX', 'CAPEX Recurrente',
        'NOI (EGI−OPEX)', 'FCF (NOI−CAPEX)', 'Flujo Total (c/Salida)', 'Flujo Acum. Nominal', 'Flujo Acum. Desc.'];
    headers.forEach((h, i) => {
        ws.getCell(r, i + 1).value = h;
        Object.assign(ws.getCell(r, i + 1), { style: HEADER_STYLE });
    });
    ws.getRow(r).height = 36;
    r++;

    // Row 0 — Initial Investment
    const row0 = ws.getRow(r);
    row0.height = 20;
    const inv0Style = makeStyle({ bold: true, size: 10, bgColor: COLORS.lightRed });
    [0, 0, 0, 0, 0, 0, 0, -totalInvestment, -totalInvestment, -totalInvestment].forEach((v, i) => {
        const cell = ws.getCell(r, i + 1);
        cell.value = i === 0 ? 0 : v;
        Object.assign(cell, { style: inv0Style });
        if (i > 0) cell.numFmt = EUR0;
    });
    ws.getCell(r, 1).value = 0;
    r++;

    let cumNominal = -totalInvestment;
    let cumDiscounted = -totalInvestment;
    const k = project.discountRatePercent / 100;

    project.annualFlows.forEach((flow, idx) => {
        const t = flow.year;
        const isLast = t === project.timeHorizonYears;
        const egi = flow.grossIncome * (1 - vacancyRate);
        const noi = egi - flow.opex;
        const fcf = noi - flow.capex;
        const totalFlow = isLast ? fcf + kpis.exitValue : fcf;
        cumNominal += totalFlow;
        const discountFactor = 1 / Math.pow(1 + k, t);
        cumDiscounted += totalFlow * discountFactor;

        const rowBg = isLast ? COLORS.lightIndigo : (idx % 2 === 0 ? COLORS.white : 'FFF8FAFC');
        const rowStyle = makeStyle({ size: 10, bgColor: rowBg });
        const boldRowStyle = makeStyle({ bold: true, size: 10, bgColor: rowBg });

        const values: ExcelJS.CellValue[] = [t, flow.grossIncome, egi, flow.opex, flow.capex, noi, fcf, totalFlow, cumNominal, cumDiscounted];
        const fmts = ['', EUR0, EUR0, EUR0, EUR0, EUR0, EUR0, EUR0, EUR0, EUR0];

        values.forEach((v, i) => {
            const cell = ws.getCell(r, i + 1);
            cell.value = v;
            Object.assign(cell, { style: i === 0 ? boldRowStyle : rowStyle });
            if (fmts[i]) cell.numFmt = fmts[i];
        });

        // Color NOI cell
        const noiCell = ws.getCell(r, 6);
        Object.assign(noiCell, { style: makeStyle({ bold: true, size: 10, bgColor: noi >= 0 ? COLORS.lightGreen : COLORS.lightRed }) });

        // Color cumulative
        const cumCell = ws.getCell(r, 9);
        Object.assign(cumCell, { style: makeStyle({ bold: true, size: 10, bgColor: cumNominal >= 0 ? COLORS.lightGreen : COLORS.lightRed }) });

        ws.getRow(r).height = 18;
        r++;
    });

    r++;

    // Totals
    sectionHeader(ws, r, '  TOTALES Y PROMEDIOS', 10); r++;

    const totalGross = project.annualFlows.reduce((s, f) => s + f.grossIncome, 0);
    const totalEGI = project.annualFlows.reduce((s, f) => s + f.grossIncome * (1 - vacancyRate), 0);
    const totalOPEX = project.annualFlows.reduce((s, f) => s + f.opex, 0);
    const totalCAPEX = project.annualFlows.reduce((s, f) => s + f.capex, 0);
    const totalNOI = project.annualFlows.reduce((s, f) => s + (f.grossIncome * (1 - vacancyRate) - f.opex), 0);
    const n = project.annualFlows.length || 1;

    const totals: [string, ExcelJS.CellValue][] = [
        ['Total Ingresos Brutos', totalGross],
        ['Total EGI (c/Vacancia)', totalEGI],
        ['Total OPEX', totalOPEX],
        ['Total CAPEX Recurrente', totalCAPEX],
        ['Total NOI', totalNOI],
        ['NOI Promedio Anual', totalNOI / n],
        ['Margen NOI Promedio (%)', totalNOI / (totalEGI || 1)],
        ['Vacancia Aplicada (%)', vacancyRate],
    ];

    totals.forEach(([label, value]) => {
        ws.getCell(r, 1).value = label;
        Object.assign(ws.getCell(r, 1), { style: LABEL_STYLE });
        const cell = ws.getCell(r, 2);
        cell.value = value;
        if (typeof value === 'number') {
            cell.numFmt = label.includes('%') ? PCT : EUR0;
        }
        Object.assign(cell, { style: VALUE_STYLE });
        ws.getRow(r).height = 18;
        r++;
    });

    r++;
    ws.mergeCells(r, 1, r, 10);
    ws.getCell(r, 1).value = 'EGI = Effective Gross Income = Ingresos Brutos × (1 − Vacancia) | NOI = EGI − OPEX | FCF = NOI − CAPEX Recurrente | Flujo Total Año N incluye Valor de Salida';
    Object.assign(ws.getCell(r, 1), { style: NOTE_STYLE });
}

// ─── SHEET 3: KPIs & SENSIBILIDAD ────────────────────────────────────────────

function buildKPISheet(wb: ExcelJS.Workbook, project: FinancialProjectState, kpis: FinancialKPIs) {
    const ws = wb.addWorksheet('3. KPIs y Sensibilidad');
    ws.views = [{ showGridLines: false }];
    ws.getColumn(1).width = 36;
    ws.getColumn(2).width = 22;
    ws.getColumn(3).width = 22;
    ws.getColumn(4).width = 22;
    ws.getColumn(5).width = 22;

    const vacancyRate = (project.vacancyRatePercent || 0) / 100;
    const totalInvestment = project.initialMarketValue + project.initialCapex;
    const firstFlow = project.annualFlows[0] || { grossIncome: 0, opex: 0, capex: 0 };
    const lastFlow = project.annualFlows[project.annualFlows.length - 1] || { grossIncome: 0, opex: 0, capex: 0 };
    const egi1 = firstFlow.grossIncome * (1 - vacancyRate);
    const noi1 = egi1 - firstFlow.opex;
    const egiN = lastFlow.grossIncome * (1 - vacancyRate);
    const noiN = egiN - lastFlow.opex;
    const avgNOI = project.annualFlows.reduce((s, f) => s + (f.grossIncome * (1 - vacancyRate) - f.opex), 0) / (project.annualFlows.length || 1);

    let r = 1;

    ws.mergeCells(r, 1, r, 5);
    ws.getCell(r, 1).value = 'KPIs FINANCIEROS Y ANÁLISIS DE SENSIBILIDAD';
    Object.assign(ws.getCell(r, 1), { style: TITLE_STYLE });
    ws.getRow(r).height = 28;
    r++; r++;

    // ── KPIs RENTABILIDAD ──
    sectionHeader(ws, r, '  RENTABILIDAD', 5); r++;

    const kpiData: [string, ExcelJS.CellValue, string, string, string][] = [
        ['TIR (Tasa Interna de Retorno)', kpis.irr / 100, PCT, '> 10%', kpis.irr >= 10 ? '✅' : kpis.irr >= 6 ? '⚠️' : '❌'],
        ['VAN (Valor Actual Neto)', kpis.npv, EUR0, '> 0', kpis.npv > 0 ? '✅' : '❌'],
        ['Payback Nominal', kpis.paybackYears < 999 ? kpis.paybackYears : 'N/A', '0.0 "años"', '< 12 años', kpis.paybackYears < 12 ? '✅' : '⚠️'],
        ['Yield on Cost (Año 1)', kpis.yieldOnCost / 100, PCT, `> ${project.marketYieldPercent}% mercado`, kpis.yieldOnCost >= (project.marketYieldPercent || 5) ? '✅' : '⚠️'],
        ['Yield de Mercado (Referencia)', (project.marketYieldPercent || 0) / 100, PCT, '—', '—'],
        ['Spread Yield (Cost vs Mercado)', (kpis.yieldOnCost - (project.marketYieldPercent || 0)) / 100, PCT, '> 0 bps favorable', (kpis.yieldOnCost - (project.marketYieldPercent || 0)) >= 0 ? '✅' : '⚠️'],
    ];

    ['Indicador', 'Valor', 'Formato', 'Objetivo', 'Estado'].forEach((h, i) => {
        ws.getCell(r, i + 1).value = h;
        Object.assign(ws.getCell(r, i + 1), { style: HEADER_STYLE });
    });
    ws.getRow(r).height = 20;
    r++;

    kpiData.forEach(([label, value, fmt, target, status]) => {
        ws.getCell(r, 1).value = label;
        Object.assign(ws.getCell(r, 1), { style: LABEL_STYLE });
        const cell = ws.getCell(r, 2);
        cell.value = typeof value === 'number' ? value : value;
        if (typeof value === 'number') cell.numFmt = fmt;
        Object.assign(cell, { style: VALUE_STYLE });
        ws.getCell(r, 3).value = fmt;
        Object.assign(ws.getCell(r, 3), { style: NOTE_STYLE });
        ws.getCell(r, 4).value = target;
        Object.assign(ws.getCell(r, 4), { style: NOTE_STYLE });
        ws.getCell(r, 5).value = status;
        Object.assign(ws.getCell(r, 5), { style: makeStyle({ bold: true, size: 11, hAlign: 'center' }) });
        ws.getRow(r).height = 18;
        r++;
    });

    r++;

    // ── NOI BREAKDOWN ──
    sectionHeader(ws, r, '  DESGLOSE NOI', 5); r++;

    const noiRows: [string, ExcelJS.CellValue, string][] = [
        ['NOI Año 1 (Operativo)', noi1, EUR0],
        ['NOI Año N (Proyectado)', noiN, EUR0],
        ['NOI Promedio Anual', avgNOI, EUR0],
        ['EGI Año 1 (c/Vacancia)', egi1, EUR0],
        ['EGI Año N (c/Vacancia)', egiN, EUR0],
        ['Vacancia Aplicada', vacancyRate, PCT],
        ['Valoración por Cap Rate (NOI1/Yield Mercado)', noi1 / ((project.marketYieldPercent || 5) / 100), EUR0],
        ['Valoración DCF (VAN + Inversión)', kpis.npv + totalInvestment, EUR0],
    ];

    noiRows.forEach(([label, value, fmt]) => {
        ws.getCell(r, 1).value = label;
        Object.assign(ws.getCell(r, 1), { style: LABEL_STYLE });
        const cell = ws.getCell(r, 2);
        cell.value = value;
        cell.numFmt = fmt;
        Object.assign(cell, { style: VALUE_STYLE });
        ws.getRow(r).height = 18;
        r++;
    });

    r++;

    // ── SENSIBILIDAD VAN ──
    sectionHeader(ws, r, '  ANÁLISIS DE SENSIBILIDAD — VAN vs. TASA DE DESCUENTO', 5); r++;

    ['Tasa Descuento (%)', 'VAN Resultante', 'vs. Base', '% Variación', 'Señal'].forEach((h, i) => {
        ws.getCell(r, i + 1).value = h;
        Object.assign(ws.getCell(r, i + 1), { style: HEADER_STYLE });
    });
    ws.getRow(r).height = 20;
    r++;

    const baseRate = project.discountRatePercent;
    const minRate = Math.max(1, baseRate - 8);
    const maxRate = baseRate + 8;
    const annualFlows = project.annualFlows;

    for (let rate = minRate; rate <= maxRate; rate += 1) {
        const k2 = rate / 100;
        let npvSens = -(project.initialMarketValue + project.initialCapex);
        annualFlows.forEach((flow, idx) => {
            const t = idx + 1;
            const egi = flow.grossIncome * (1 - vacancyRate);
            const noi = egi - flow.opex - flow.capex;
            const totalFlow = t === project.timeHorizonYears ? noi + kpis.exitValue : noi;
            npvSens += totalFlow / Math.pow(1 + k2, t);
        });

        const isBase = Math.abs(rate - baseRate) < 0.01;
        const delta = npvSens - kpis.npv;
        const pct = kpis.npv !== 0 ? delta / Math.abs(kpis.npv) : 0;
        const bg = isBase ? COLORS.lightIndigo : npvSens > 0 ? COLORS.lightGreen : COLORS.lightRed;

        const rowStyle = makeStyle({ size: 10, bgColor: bg, bold: isBase });

        ws.getCell(r, 1).value = rate / 100;
        ws.getCell(r, 1).numFmt = PCT;
        Object.assign(ws.getCell(r, 1), { style: rowStyle });

        ws.getCell(r, 2).value = npvSens;
        ws.getCell(r, 2).numFmt = EUR0;
        Object.assign(ws.getCell(r, 2), { style: rowStyle });

        ws.getCell(r, 3).value = delta;
        ws.getCell(r, 3).numFmt = EUR0;
        Object.assign(ws.getCell(r, 3), { style: rowStyle });

        ws.getCell(r, 4).value = pct;
        ws.getCell(r, 4).numFmt = PCT;
        Object.assign(ws.getCell(r, 4), { style: rowStyle });

        ws.getCell(r, 5).value = isBase ? '◀ BASE' : npvSens > 0 ? '✅' : '❌';
        Object.assign(ws.getCell(r, 5), { style: makeStyle({ bold: true, size: 10, bgColor: bg, hAlign: 'center' }) });

        ws.getRow(r).height = 18;
        r++;
    }
}

// ─── SHEET 4: ANÁLISIS ESTRATÉGICO ───────────────────────────────────────────

function buildStrategySheet(wb: ExcelJS.Workbook, analysis: AdvancedAIAnalysisResult | null, _project: FinancialProjectState, _kpis: FinancialKPIs) {
    const ws = wb.addWorksheet('4. Análisis Estratégico');
    ws.views = [{ showGridLines: false }];
    ws.getColumn(1).width = 30;
    ws.getColumn(2).width = 60;
    ws.getColumn(3).width = 20;

    let r = 1;

    ws.mergeCells(r, 1, r, 3);
    ws.getCell(r, 1).value = 'ANÁLISIS ESTRATÉGICO — DIAGNÓSTICO IA';
    Object.assign(ws.getCell(r, 1), { style: TITLE_STYLE });
    ws.getRow(r).height = 28;
    r++; r++;

    if (!analysis) {
        ws.getCell(r, 1).value = 'Sin datos de análisis. Complete los flujos de caja para generar el diagnóstico.';
        Object.assign(ws.getCell(r, 1), { style: NOTE_STYLE });
        return;
    }

    // ── NARRATIVA ──
    sectionHeader(ws, r, '  NARRATIVA DEL ACTIVO', 3); r++;

    ws.mergeCells(r, 1, r + 4, 3);
    ws.getCell(r, 1).value = analysis.storyTelling;
    Object.assign(ws.getCell(r, 1), { style: makeStyle({ size: 10, wrapText: true, bgColor: COLORS.lightBlue }) });
    ws.getRow(r).height = 100;
    r += 5; r++;

    // ── RUTAS ESTRATÉGICAS ──
    sectionHeader(ws, r, '  RUTAS ESTRATÉGICAS (3-WAY ANALYSIS)', 3); r++;

    ['Estrategia', 'Argumento', 'Score / Recomendada'].forEach((h, i) => {
        ws.getCell(r, i + 1).value = h;
        Object.assign(ws.getCell(r, i + 1), { style: HEADER_STYLE });
    });
    ws.getRow(r).height = 20;
    r++;

    const paths = [
        { label: '🔨 REHABILITAR (Value-Add)', path: analysis.strategicPaths.rehab, bg: COLORS.lightGreen },
        { label: '📦 MANTENER (Hold)', path: analysis.strategicPaths.hold, bg: COLORS.lightBlue },
        { label: '💰 VENDER (Exit)', path: analysis.strategicPaths.sell, bg: COLORS.lightAmber },
    ];

    paths.forEach(({ label, path, bg }) => {
        const isRec = path.isRecommended;
        const rowBg = isRec ? bg : COLORS.white;
        ws.getCell(r, 1).value = label + (isRec ? ' ★ RECOMENDADA' : '');
        Object.assign(ws.getCell(r, 1), { style: makeStyle({ bold: isRec, size: 10, bgColor: rowBg }) });
        ws.mergeCells(r, 2, r + 1, 2);
        ws.getCell(r, 2).value = path.description;
        Object.assign(ws.getCell(r, 2), { style: makeStyle({ size: 9, wrapText: true, bgColor: rowBg }) });
        ws.getCell(r, 3).value = `Score: ${path.score}/100${isRec ? '\n★ RECOMENDADA' : ''}`;
        Object.assign(ws.getCell(r, 3), { style: makeStyle({ bold: isRec, size: 10, hAlign: 'center', wrapText: true, bgColor: rowBg }) });
        ws.getRow(r).height = 40;
        r += 2;
    });

    r++;

    // ── FACTORES DE RIESGO ──
    sectionHeader(ws, r, '  FACTORES DE RIESGO IDENTIFICADOS', 3); r++;

    ['Categoría', 'Descripción', 'Severidad'].forEach((h, i) => {
        ws.getCell(r, i + 1).value = h;
        Object.assign(ws.getCell(r, i + 1), { style: HEADER_STYLE });
    });
    ws.getRow(r).height = 20;
    r++;

    analysis.risks.forEach(risk => {
        const bg = risk.severity === 'high' ? COLORS.lightRed : risk.severity === 'medium' ? COLORS.lightAmber : COLORS.lightGreen;
        ws.getCell(r, 1).value = `${risk.category}: ${risk.label}`;
        Object.assign(ws.getCell(r, 1), { style: makeStyle({ bold: true, size: 10, bgColor: bg }) });
        ws.getCell(r, 2).value = risk.description;
        Object.assign(ws.getCell(r, 2), { style: makeStyle({ size: 9, wrapText: true, bgColor: bg }) });
        ws.getCell(r, 3).value = risk.severity === 'high' ? '🔴 ALTO' : risk.severity === 'medium' ? '🟡 MEDIO' : '🟢 BAJO';
        Object.assign(ws.getCell(r, 3), { style: makeStyle({ bold: true, size: 10, hAlign: 'center', bgColor: bg }) });
        ws.getRow(r).height = 30;
        r++;
    });

    r++;

    // ── COMPARATIVA ESCENARIOS ──
    if (analysis.comparison) {
        sectionHeader(ws, r, '  COMPARATIVA: ESCENARIO ACTUAL vs. BASELINE (Sin CAPEX)', 3); r++;

        const comp = analysis.comparison;
        const compRows: [string, ExcelJS.CellValue, ExcelJS.CellValue][] = [
            ['TIR Baseline (Sin CAPEX)', comp.baselineIRR / 100, PCT],
            ['TIR Actual (Con CAPEX)', comp.currentIRR / 100, PCT],
            ['Delta TIR (Creación Valor)', comp.irrDelta / 100, PCT],
            ['VAN Baseline', comp.baselineNPV, EUR0],
            ['VAN Actual', comp.currentNPV, EUR0],
            ['Delta VAN', comp.npvDelta, EUR0],
            ['¿Green Premium?', comp.isGreenPremium ? 'SÍ ✅' : 'NO ❌', ''],
        ];

        compRows.forEach(([label, value, fmt]) => {
            ws.getCell(r, 1).value = label;
            Object.assign(ws.getCell(r, 1), { style: LABEL_STYLE });
            const cell = ws.getCell(r, 2);
            cell.value = value;
            if (fmt && typeof value === 'number') cell.numFmt = fmt as string;
            Object.assign(cell, { style: VALUE_STYLE });
            ws.getRow(r).height = 18;
            r++;
        });
    }

    r++;

    // ── TRAYECTORIA FCF ──
    if (analysis.cashFlowTrajectory && analysis.cashFlowTrajectory.length > 0) {
        sectionHeader(ws, r, '  TRAYECTORIA DE FLUJO DE CAJA LIBRE (FCF)', 3); r++;

        ['Período', 'FCF (€)', 'Tipo'].forEach((h, i) => {
            ws.getCell(r, i + 1).value = h;
            Object.assign(ws.getCell(r, i + 1), { style: HEADER_STYLE });
        });
        ws.getRow(r).height = 20;
        r++;

        analysis.cashFlowTrajectory.forEach(point => {
            const isExit = point.label === 'Operación + Venta';
            const bg = isExit ? COLORS.lightIndigo : point.amount >= 0 ? COLORS.lightGreen : COLORS.lightRed;
            ws.getCell(r, 1).value = point.year;
            Object.assign(ws.getCell(r, 1), { style: makeStyle({ bold: isExit, size: 10, bgColor: bg }) });
            ws.getCell(r, 2).value = point.amount;
            ws.getCell(r, 2).numFmt = EUR0;
            Object.assign(ws.getCell(r, 2), { style: makeStyle({ bold: isExit, size: 10, bgColor: bg }) });
            ws.getCell(r, 3).value = isExit ? '🏁 Salida + Operación' : '📊 Operativo';
            Object.assign(ws.getCell(r, 3), { style: makeStyle({ size: 9, bgColor: bg }) });
            ws.getRow(r).height = 18;
            r++;
        });
    }
}

// ─── MAIN EXPORT FUNCTION ─────────────────────────────────────────────────────

export const exportProjectToExcel = async (
    project: FinancialProjectState,
    kpis: FinancialKPIs,
    analysis: AdvancedAIAnalysisResult | null,
    building?: Building | null
) => {
    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Arkia BI';
        workbook.created = new Date();
        workbook.modified = new Date();

        buildSummarySheet(workbook, project, kpis, analysis, building);
        buildCashflowSheet(workbook, project, kpis);
        buildKPISheet(workbook, project, kpis);
        buildStrategySheet(workbook, analysis, project, kpis);

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `arkia_modelo_financiero_${new Date().toISOString().slice(0, 10)}.xlsx`);

    } catch (error: any) {
        console.error('Export failed:', error);
        alert(`Error al exportar Excel: ${error.message || error}`);
    }
};
