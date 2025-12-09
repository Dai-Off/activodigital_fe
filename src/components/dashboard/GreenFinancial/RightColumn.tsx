import React from "react";
import {
    DollarSignIcon,
    FileTextIcon,
    ChartColumnIcon,
    PiggyBankIcon,
    CircleQuestionMarkIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import HelperMetrics from "./componentes/HelperMetrics";
import MetricTooltip from "./componentes/MetricTooltip";
// import MetricTooltip from "./MetricTooltip";
// import HelperMetrics from "./HelperMetrics";

interface Props {
    cardBase: string;
    metricHelp: any;
    setMetricHelp: any;
    isMobile?: boolean;
}

const RightColumn: React.FC<Props> = ({ cardBase, metricHelp, setMetricHelp }) => {
    return (
        <>
            {/* ---------------------------------------------------------------------- */}
            {/* 1. ESTRUCTURACIÓN DE LA OPERACIÓN */}
            {/* ---------------------------------------------------------------------- */}
            <div className={cardBase}>
                <h3 className="text-lg mb-4 flex items-center gap-2 text-[#1e3a8a]">
                    <DollarSignIcon className="w-5 h-5" />
                    Estructuración de la Operación
                </h3>

                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-700">Investment Size (CAPEX)</span>
                            <span className="text-sm font-semibold text-blue-900">1.35M€</span>
                        </div>
                        <div className="text-xs text-gray-600">
                            Total rehabilitación energética integral
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-xs text-gray-700 mb-2">Equity / Debt Split</div>

                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 bg-green-200 rounded-full h-3 overflow-hidden">
                                <div className="bg-green-600 h-3"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <span className="text-green-700 font-semibold">NaN% Equity</span>
                            <span className="text-gray-600">% Deuda Verde</span>
                        </div>

                        <div className="mt-2 text-xs text-gray-600">
                            LTV Verde: % sobre valor futuro post-reforma
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-800 mb-3">Fuentes de Capital:</div>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span>• Deuda Senior Verde:</span>
                                <span className="font-semibold text-purple-700">9.65M€</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>• Subvenciones Next Gen:</span>
                                <span className="font-semibold text-green-700">0.27M€</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>• Equity / Sponsor:</span>
                                <span className="font-semibold text-blue-700">-8.57M€</span>
                            </div>

                            <div className="border-t border-purple-300 pt-2 mt-2 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-800">Total:</span>
                                <span className="font-semibold text-purple-900">1.35M€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------------------------------------------------------------- */}
            {/* 2. CADENA DOCUMENTAL */}
            {/* ---------------------------------------------------------------------- */}

            <div className={cardBase}>
                <h3 className="text-lg mb-4 flex items-center gap-2 text-[#1e3a8a]">
                    <FileTextIcon className="w-5 h-5" />
                    Cadena de Evidencia Documental
                </h3>

                <p className="text-xs text-gray-600 mb-4">
                    Trazabilidad completa de documentos que soportan cada criterio
                </p>

                <div className="space-y-2">
                    {[
                        { title: "CEE Oficial", note: "→ Reducción 42% energética" },
                        { title: "Memoria Técnica", note: "→ DNSH Agua Sostenible" },
                        { title: "Proyecto Básico", note: "→ Economía Circular (70% reciclaje)" },
                        { title: "Catastro + APQ", note: "→ Ausencia Amianto" },
                        { title: "MITECO API", note: "→ Biodiversidad verificada" },
                        { title: "Análisis Riesgos Climáticos", note: "→ Adaptación climática" },
                    ].map((doc) => (
                        <div
                            key={doc.title}
                            className="flex items-center gap-2 py-2 px-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                            <FileTextIcon className="w-4 h-4 text-green-600 flex-shrink-0" />

                            <div className="flex-1">
                                <span className="text-xs font-medium text-gray-900">
                                    {doc.title}
                                </span>
                                <span className="text-xs text-gray-600 ml-2">{doc.note}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------------------------------------------------------------------- */}
            {/* 3. MÉTRICAS DE RETORNO (CON TODOS LOS TOOLTIPS RESTAURADOS) */}
            {/* ---------------------------------------------------------------------- */}

            <div className={`${cardBase} relative tooltip-container group`}>
                {/* BOTÓN GENERAL */}
                <Button
                    onClick={() =>
                        setMetricHelp((prev: any) => ({
                            ...prev,
                            General: !prev?.General,
                        }))
                    }
                    className="absolute top-1 right-1 rounded-full bg-white border-blue-200 border z-10"
                >
                    <CircleQuestionMarkIcon className="w-3 h-3 text-blue-600" />
                </Button>

                {/* TOOLTIP GENERAL */}
                {metricHelp?.General && <HelperMetrics />}

                <h3 className="text-lg mb-4 flex items-center gap-2 text-[#1e3a8a]">
                    <ChartColumnIcon className="w-5 h-5" />
                    Métricas de Retorno
                </h3>

                {/* GRID MÉTRICAS */}
                <div className="space-y-3">

                    {/* TIR */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 relative">
                        <button
                            onClick={() =>
                                setMetricHelp((prev: any) => ({
                                    ...prev,
                                    TIR: !prev?.TIR,
                                }))
                            }
                            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border-blue-200 border shadow-sm z-10"
                        >
                            <CircleQuestionMarkIcon className="w-3 h-3 text-blue-600" />
                        </button>

                        {metricHelp?.TIR && (
                            <MetricTooltip
                                borderColor="blue"
                                text="TIR (IRR): Tasa Interna de Retorno anualizada. Fondos Value-Add buscan 12-18%. Verde añade +150-200bps vs estándar."
                            />
                        )}

                        <div className="text-xs text-gray-600 mb-1">TIR (IRR) Institucional</div>
                        <div className="text-3xl font-bold text-[#1e3a8a] mb-1">18.5%</div>
                        <div className="text-xs text-gray-600">A 5 años - Value Add</div>
                    </div>

                    {/* CASH ON CASH */}
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4 relative">
                        <button
                            onClick={() =>
                                setMetricHelp((prev: any) => ({
                                    ...prev,
                                    CashOnCash: !prev?.CashOnCash,
                                }))
                            }
                            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-emerald-100 border-emerald-200 border shadow-sm z-10"
                        >
                            <CircleQuestionMarkIcon className="w-3 h-3 text-emerald-600" />
                        </button>

                        {metricHelp?.CashOnCash && (
                            <MetricTooltip
                                borderColor="emerald"
                                text="Cash-on-Cash: Retorno anual efectivo sobre equity. Verde mejora +2-3pp por menor servicio deuda."
                            />
                        )}

                        <div className="text-xs text-gray-600 mb-1">Cash on Cash Return</div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-emerald-700">5.8%</div>
                            <div className="text-xs text-gray-500 line-through">2.3%</div>
                        </div>
                        <div className="text-xs text-emerald-600 mt-1">Bonificación Verde: +3.5pp</div>
                    </div>

                    {/* EQUITY MULTIPLE */}
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 relative">
                        <button
                            onClick={() =>
                                setMetricHelp((prev: any) => ({
                                    ...prev,
                                    Equity: !prev?.Equity,
                                }))
                            }
                            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-indigo-100 border-indigo-200 border shadow-sm z-10"
                        >
                            <CircleQuestionMarkIcon className="w-3 h-3 text-indigo-600" />
                        </button>

                        {metricHelp?.Equity && (
                            <MetricTooltip
                                borderColor="indigo"
                                text="Equity Multiple: Múltiplo de retorno total sobre capital invertido. EM >2.0x es excelente."
                            />
                        )}

                        <div className="text-xs text-gray-600 mb-1">Equity Multiple</div>
                        <div className="text-3xl font-bold text-indigo-700 mb-1">2.6x</div>
                        <div className="text-xs text-gray-600">Multiplicador de Capital a 5 años</div>
                    </div>

                    {/* YIELD ON COST */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 relative">
                        <button
                            onClick={() =>
                                setMetricHelp((prev: any) => ({
                                    ...prev,
                                    YieldOnCost: !prev?.YieldOnCost,
                                }))
                            }
                            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border shadow-sm z-10"
                        >
                            <CircleQuestionMarkIcon className="w-3 h-3 text-green-600" />
                        </button>

                        {metricHelp?.YieldOnCost && (
                            <MetricTooltip
                                borderColor="green"
                                text="Yield on Cost: Rentabilidad sobre coste total. Mide eficiencia del CAPEX."
                            />
                        )}

                        <div className="text-xs text-gray-600 mb-1">Yield on Cost (YoC)</div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-green-700">5.4%</div>
                            <div className="text-xs text-gray-500">vs 4.2% Actual</div>
                        </div>
                        <div className="text-xs text-green-600 mt-1">+1.2pp post-reforma</div>
                    </div>

                    {/* LTV VERDE */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 relative">
                        <button
                            onClick={() =>
                                setMetricHelp((prev: any) => ({
                                    ...prev,
                                    LTVVerde: !prev?.LTVVerde,
                                }))
                            }
                            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border-orange-200 border shadow-sm z-10"
                        >
                            <CircleQuestionMarkIcon className="w-3 h-3 text-orange-600" />
                        </button>

                        {metricHelp?.LTVVerde && (
                            <MetricTooltip
                                borderColor="orange"
                                text="LTV Verde: Loan-to-Value bonificado. Bancos prestan más en proyectos taxonomy-aligned."
                            />
                        )}

                        <div className="text-xs text-gray-600 mb-1">LTV Verde</div>
                        <div className="text-2xl font-bold text-orange-700 mb-1">55%</div>
                        <div className="text-xs text-gray-600">Préstamo: 9.65M€</div>
                    </div>

                    {/* DSCR PROYECTADO */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 relative">
                        <button
                            onClick={() =>
                                setMetricHelp((prev: any) => ({
                                    ...prev,
                                    DSCRProyectado: !prev?.DSCRProyectado,
                                }))
                            }
                            className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border shadow-sm z-10"
                        >
                            <CircleQuestionMarkIcon className="w-3 h-3 text-green-600" />
                        </button>

                        {metricHelp?.DSCRProyectado && (
                            <MetricTooltip
                                borderColor="green"
                                text="DSCR: veces que NOI cubre servicio deuda. Fondos exigen >1.25x."
                            />
                        )}

                        <div className="text-xs text-gray-600 mb-1">DSCR Proyectado</div>
                        <div className="text-2xl font-bold text-green-700 mb-1">1.79x</div>
                        <div className="text-xs text-gray-600">Cobertura excelente</div>
                    </div>
                </div>
            </div>

            {/* ---------------------------------------------------------------------- */}
            {/* 4. CASH FLOW */}
            {/* ---------------------------------------------------------------------- */}

            <div className={cardBase}>
                <h3 className="text-lg mb-3 flex items-center gap-2 text-[#5f6986]">
                    <PiggyBankIcon className="w-5 h-5" />
                    Cash Flow
                </h3>

                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg p-2 bg-gray-50 text-xs">
                        <div className="text-[12px]">NOI Actual</div>
                        <div className="text-lg font-bold">637k€</div>
                        <div className="text-[11px] text-gray-500">anual</div>
                    </div>

                    <div className="rounded-lg p-2 bg-green-50 text-xs">
                        <div className="text-[12px]">NOI Proyectado</div>
                        <div className="text-lg font-bold text-green-700">891k€</div>
                        <div className="text-[11px] text-green-600">+39.8%</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RightColumn;
