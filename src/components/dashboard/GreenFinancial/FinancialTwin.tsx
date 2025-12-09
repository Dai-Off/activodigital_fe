import React, { useState } from "react";
import {
    ArrowUpRightIcon,
    AwardIcon,
    ChartColumnIcon,
    ChevronDownIcon,
    CircleCheckIcon,
    CircleQuestionMarkIcon,
    DollarSignIcon,
    DownloadIcon,
    DropletIcon,
    FileTextIcon,
    InfoIcon,
    LinkIcon,
    MoveLeftIcon,
    PiggyBankIcon,
    RecycleIcon,
    SendIcon,
    ShieldIcon,
    WindIcon,
    WrenchIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import HelpersTwin from "./componentes/HelpersTwin";
import DesgloseGreenPremium from "./componentes/DesgloseGreenPremium";
import HelperMetrics from "./componentes/HelperMetrics";
import HelperCashFlow from "./componentes/HelperCashFlow";
import MetricTooltip from "./componentes/MetricTooltip";
import ModalFinancial from "./componentes/ModalFinancial";
import DesgloseCostRehabilit from "./componentes/DesgloseCostRehabilit";
import { useIsMobile } from "~/components/ui/use-mobile";

interface SectionI {
    validationInfo: boolean;
    showHelpers: boolean;
    showCostes: boolean;
    showGreenPremium: boolean;
}

interface DNSHInterface {
    useWater: boolean;
    economyCircly: boolean;
    polution: boolean;
    biodiversity: boolean;
    adaptation: boolean;
}

interface helpMetricasI {
    General: boolean;
    CashFlow: boolean;
    TIR: boolean;
    CashOnCash: boolean;
    Equity: boolean;
    YieldOnCost: boolean;
    LTVVerde: boolean;
    DSCRProyectado: boolean;
}

const FinancialTwin: React.FC = () => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [financialTwin, setFinancialTwin] = useState<boolean>(false);

    const [metricHelp, setMetricHelp] = useState<helpMetricasI>({
        General: false,
        CashOnCash: false,
        DSCRProyectado: false,
        Equity: false,
        LTVVerde: false,
        TIR: false,
        YieldOnCost: false,
        CashFlow: false,
    });

    const [showDNSH, setShowDNSH] = useState<DNSHInterface>({
        useWater: false,
        adaptation: false,
        biodiversity: false,
        economyCircly: false,
        polution: false,
    });

    const [showSection, setShowSection] = useState<SectionI>({
        validationInfo: false,
        showHelpers: false,
        showCostes: false,
        showGreenPremium: false,
    });

    const cardBase = "bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6";

    return (
        <>
            <HelpersTwin
                active={showSection.showHelpers}
                setActive={(value) => setShowSection((prev) => ({ ...prev, showHelpers: value }))}
            />

            <ModalFinancial active={financialTwin} setActive={(value) => setFinancialTwin(value)} />

            <div style={{ marginTop: "-90px" }}>
                <div className="max-w-[1800px] mx-auto space-y-6 px-4 md:px-0">
                    <div className={`flex items-center justify-between ${isMobile ? "flex-col gap-4 items-stretch" : ""}`}>
                        <Button className="flex items-center gap-2 text-[#1e3a8a] hover:text-blue-700 transition-colors">
                            <MoveLeftIcon className="w-4 h-4" />
                            <span className="text-sm">{t("backToRadar", "Volver al Radar")}</span>
                        </Button>
                        <div className={`flex justify-center gap-4 ${isMobile ? "w-full justify-between" : ""}`}>
                            <Button className="flex justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                <DownloadIcon className="w-4 h-4" />
                                {t("export Analysis", "Exportar Análisis")}
                            </Button>
                        </div>
                    </div>

                    <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"
                            alt="Plaza Shopping"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h2 className="text-2xl mb-1">Plaza Shopping</h2>
                            <p className="text-sm text-gray-200">Carretera de Miraflores, Colmenar Viejo</p>
                        </div>
                        <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
                            <span className="flex items-center gap-2">
                                <CircleCheckIcon className="w-4 h-4" />
                                {t("TAXONOMY ALIGNED", "TAXONOMÍA ALINEADA")} (92%)
                            </span>
                        </div>
                    </div>

                    {!isMobile ? (
                        <div className="grid grid-cols-5 gap-6">
                            <div className="col-span-3 space-y-4">
                                <div className={`${cardBase} relative tooltip-container min-h-[800px] flex flex-col`}>
                                    <Button className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-emerald-100 border-emerald-200 border opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                        <CircleQuestionMarkIcon className="w-3 h-3 text-emerald-600" />
                                    </Button>
                                    <h3 className="text-lg mb-6 flex items-center gap-2 text-[#1e3a8a]">
                                        <ShieldIcon className="w-4 h-4" />
                                        Validación Taxonomía UE (Reglamento 2020/852)
                                    </h3>

                                    <div className="mb-6 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 rounded-xl p-5 shadow-md">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="bg-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold">92%</div>
                                                        <div className="text-xs">Aligned</div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-green-900 mb-1">
                                                        Validación Taxonomía UE (Reglamento 2020/852)
                                                    </h4>
                                                    <p className="text-xs text-gray-700">
                                                        Tu edificio alcanza <strong>92% de alineación</strong> con la Taxonomía Europea para actividades sostenibles.
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => setShowSection((prev) => ({ ...prev, validationInfo: !showSection?.validationInfo }))}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex-shrink-0"
                                            >
                                                {!showSection?.validationInfo ? "Más información" : "Menos info..."}
                                                <ChevronDownIcon className="w-5 h-4" />
                                            </Button>
                                        </div>

                                        {showSection?.validationInfo && (
                                            <div className="mt-5 pt-5 border-t-2 border-green-200">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h5 className="text-sm font-semibold text-green-900 mb-2">
                                                            ¿Por qué estás al 92% de Alineación Taxonomía?
                                                        </h5>
                                                        <p className="text-xs text-gray-700 leading-relaxed">
                                                            La <strong>Taxonomía UE</strong> es el sistema de clasificación más riguroso del mundo para actividades sostenibles. Tu edificio alcanza <strong>92% de alineación</strong> porque cumple la mayoría de criterios técnicos del Reglamento 2020/852.
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                                <span className="text-gray-700">Contribución Sustancial (Mitigación Climática)</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-semibold text-green-700">50%</span>
                                                                <span className="text-green-600">✓ PASS</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 ml-4 mb-2">
                                                            Reducción de energía primaria. Umbral mínimo: ≥30%. Tu proyecto: <strong>50%</strong>(185→93 kWh/m²·año).
                                                        </div>

                                                        <div className="border-t border-green-200 pt-2 mt-2">
                                                            <div className="text-xs font-semibold text-gray-800 mb-2">DNSH - No Causar Daño Significativo (6 criterios):</div>
                                                        </div>

                                                        <div className="flex items-center justify-between text-xs ml-4">
                                                            <div className="flex items-center gap-2">
                                                                <DropletIcon className="w-3 h-3 text-blue-600" />
                                                                <span className="text-gray-700">Uso Sostenible del Agua</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-semibold text-green-600">100%</span>
                                                                <CircleCheckIcon className="w-3 h-3 text-green-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 ml-10">Sistema recuperación aguas pluviales + sanitarios eficientes.</div>

                                                        <div className="flex items-center justify-between text-xs ml-4">
                                                            <div className="flex items-center gap-2">
                                                                <RecycleIcon className="w-3 h-3 text-green-600" />
                                                                <span className="text-gray-700">Economía Circular</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-semibold text-green-600">100%</span>
                                                                <CircleCheckIcon className="w-3 h-3 text-green-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 ml-10">Plan gestión residuos: &gt; 70% reciclado/reutilizado.</div>

                                                        <div className="flex items-center justify-between text-xs ml-4">
                                                            <div className="flex items-center gap-2">
                                                                <WindIcon className="w-3 h-3 text-purple-600" />
                                                                <span className="text-gray-700">Prevención Polución</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-semibold text-green-600">100%</span>
                                                                <CircleCheckIcon className="w-3 h-3 text-green-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 ml-10">Sin amianto ni materiales peligrosos (APQ verificado).</div>

                                                        <div className="flex items-center justify-between text-xs ml-4">
                                                            <div className="flex items-center gap-2">
                                                                <DropletIcon className="w-3 h-3 text-green-700" />
                                                                <span className="text-gray-700">Biodiversidad y Ecosistemas</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-semibold text-green-600">100%</span>
                                                                <CircleCheckIcon className="w-3 h-3 text-green-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 ml-10">Ubicación fuera de zonas protegidas Natura 2000.</div>

                                                        <div className="flex items-center justify-between text-xs ml-4">
                                                            <div className="flex items-center gap-2">
                                                                <ShieldIcon className="w-3 h-3 text-blue-700" />
                                                                <span className="text-gray-700">Adaptación Cambio Climático</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-semibold text-green-600">100%</span>
                                                                <CircleCheckIcon className="w-3 h-3 text-green-600" />
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 ml-10">Análisis riesgos climáticos (inundación, olas de calor) completado.</div>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-3 border-2 border-green-300">
                                                        <div className="text-xs font-semibold text-gray-800 mb-2">📊 Cálculo de tu 92%:</div>
                                                        <div className="space-y-1 text-xs text-gray-700">
                                                            <div className="flex justify-between">
                                                                <span>• Contribución Sustancial (obligatorio):</span>
                                                                <span className="font-semibold text-green-700">✓ PASS (peso 40%)</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>• DNSH Agua:</span>
                                                                <span className="font-semibold text-green-700">✓ (peso 10%)</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>• DNSH Circular:</span>
                                                                <span className="font-semibold text-green-700">✓ (peso 10%)</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>• DNSH Polución:</span>
                                                                <span className="font-semibold text-green-700">✓ (peso 10%)</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>• DNSH Biodiversidad:</span>
                                                                <span className="font-semibold text-green-700">✓ (peso 10%)</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>• DNSH Adaptación:</span>
                                                                <span className="font-semibold text-green-700">✓ (peso 10%)</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>• Garantías Sociales Mínimas:</span>
                                                                <span className="font-semibold text-green-700">✓ (peso 10%)</span>
                                                            </div>
                                                            <div className="border-t border-gray-300 my-2"></div>
                                                            <div className="flex justify-between text-sm font-bold">
                                                                <span>ALINEACIÓN TOTAL:</span>
                                                                <span className="text-green-700">92%</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg p-3">
                                                        <div className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1">
                                                            <DollarSignIcon className="w-3 h-3" />
                                                            Impacto de tu 92% en Financiación:
                                                        </div>
                                                        <ul className="text-xs text-blue-800 space-y-1 ml-4">
                                                            <li>✓ <strong>Bonificación -50 bps</strong> en tipo interés (Santander Green Finance)</li>
                                                            <li>✓ Elegible para <strong>Green Bonds</strong> institucionales (≥85% requerido)</li>
                                                            <li>✓ Acceso a <strong>líneas BEI</strong> (Banco Europeo Inversiones) con garantías UE</li>
                                                            <li>✓ Reporting SFDR simplificado para fondos ESG (Art. 8 y 9)</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="bg-green-100 p-2 rounded-lg">
                                                <CircleCheckIcon className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm text-gray-900">Objetivo 1: Mitigación Cambio Climático</h4>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-700">Reducción Energía Primaria</span>
                                                        <span className="text-sm text-green-700">50% (≥30% ✓)</span>
                                                    </div>
                                                    <div className="w-full bg-green-200 rounded-full h-2">
                                                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "83.3333%" }}></div>
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-2">Simulación: 185 → 93 kWh/m²·año</div>
                                                    <Button className="text-xs text-[#1e3a8a] hover:underline flex items-center gap-1">
                                                        <ChartColumnIcon className="w-4 h-4" />
                                                        Ver Simulación Energética Completa
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t-2 border-gray-200 pt-6">
                                        <h4 className="text-sm mb-4 text-gray-900">DNSH - No Causar Daño Significativo</h4>
                                        <div className="space-y-3">
                                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                                        <DropletIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs text-gray-900">Uso Sostenible del Agua</span>
                                                            <div className="flex items-center gap-2">
                                                                <CircleCheckIcon className="w-5 h-5 text-green-600" />
                                                                <Button className="focus:outline-none" onClick={() => setShowDNSH((prev) => ({ ...prev, useWater: !showDNSH?.useWater }))}>
                                                                    <InfoIcon className={`w-3 h-3 text-gray-${showDNSH.useWater ? "900" : "400"}`} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-700">Instalación de sistemas de bajo consumo de agua</p>
                                                        {showDNSH?.useWater && (
                                                            <div className="mt-3 pt-3 border-t border-gray-300 bg-white rounded-lg p-3">
                                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                                    Criterio DNSH: Instalación de sistemas de bajo consumo (sanitarios, grifería) y recuperación aguas pluviales para riego/limpieza. Umbral: reducción ≥30% vs estándar. Fuente: Memoria Técnica Proyecto.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                                        <RecycleIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs text-gray-900">Economía Circular</span>
                                                            <div className="flex items-center gap-2">
                                                                <CircleCheckIcon className="w-5 h-5 text-green-600" />
                                                                <Button className="focus:outline-none" onClick={() => setShowDNSH((prev) => ({ ...prev, economyCircly: !showDNSH?.economyCircly }))}>
                                                                    <InfoIcon className={`w-3 h-3 text-gray-${showDNSH.economyCircly ? "900" : "400"}`} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-700">Plan de gestión de residuos conforme RD 105/2008</p>
                                                        {showDNSH?.economyCircly && (
                                                            <div className="mt-3 pt-3 border-t border-gray-300 bg-white rounded-lg p-3">
                                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                                    Criterio DNSH: Plan de Gestión de Residuos construcción con &gt;70% reciclado/reutilizado. Obligatorio RD 105/2008. Fuente: Proyecto Básico.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                                        <WindIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs text-gray-900">Prevención de la Polución</span>
                                                            <div className="flex items-center gap-2">
                                                                <CircleCheckIcon className="w-5 h-5 text-green-600" />
                                                                <Button className="focus:outline-none" onClick={() => setShowDNSH((prev) => ({ ...prev, polution: !showDNSH?.polution }))}>
                                                                    <InfoIcon className={`w-3 h-3 text-gray-${showDNSH.polution ? "900" : "400"}`} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-700">Materiales sin sustancias peligrosas</p>
                                                        {showDNSH?.polution && (
                                                            <div className="mt-3 pt-3 border-t border-gray-300 bg-white rounded-lg p-3">
                                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                                    Criterio DNSH: Ausencia de amianto y materiales peligrosos (pinturas, disolventes). Verificación APQ (Almacenamiento Productos Químicos). Fuente: Catastro + Inspección.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                                        <DropletIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs text-gray-900">Biodiversidad y Ecosistemas</span>
                                                            <div className="flex items-center gap-2">
                                                                <CircleCheckIcon className="w-5 h-5 text-green-600" />
                                                                <Button className="focus:outline-none" onClick={() => setShowDNSH((prev) => ({ ...prev, biodiversity: !showDNSH?.biodiversity }))}>
                                                                    <InfoIcon className={`w-3 h-3 text-gray-${showDNSH.biodiversity ? "900" : "400"}`} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-700">Edificio urbano, no afecta hábitats protegidos</p>
                                                        {showDNSH?.biodiversity && (
                                                            <div className="mt-3 pt-3 border-t border-gray-300 bg-white rounded-lg p-3">
                                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                                    Criterio DNSH: Ubicación fuera de zonas Natura 2000 y áreas protegidas. Verificación automática con API MITECO. Fuente: Geolocalización + MITECO.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                                        <ShieldIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs text-gray-900">Adaptación al Cambio Climático</span>
                                                            <div className="flex items-center gap-2">
                                                                <CircleCheckIcon className="w-5 h-5 text-green-600" />
                                                                <Button className="focus:outline-none" onClick={() => setShowDNSH((prev) => ({ ...prev, adaptation: !showDNSH?.adaptation }))}>
                                                                    <InfoIcon className={`w-3 h-3 text-gray-${showDNSH.adaptation ? "900" : "400"}`} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-700">Análisis de riesgos climáticos realizado</p>
                                                        {showDNSH?.adaptation && (
                                                            <div className="mt-3 pt-3 border-t border-gray-300 bg-white rounded-lg p-3">
                                                                <p className="text-xs text-gray-700 leading-relaxed">
                                                                    Criterio DNSH: Análisis de riesgos climáticos físicos (inundación, olas de calor, sequía). Medidas de resiliencia implementadas. Fuente: Estudio Riesgos Climáticos.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${cardBase}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 p-3 rounded-lg">
                                                <AwardIcon className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg text-[#1e3a8a]">Subvenciones y Ayudas Públicas</h3>
                                                <p className="text-sm text-gray-600">Total máximo financiable: <strong className="text-purple-600">1.33M€</strong> (89% del CAPEX)</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setShowSection((prev) => ({ ...prev, showHelpers: true }))}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg flex items-center gap-2"
                                        >
                                            <AwardIcon className="w-5 h-5" />
                                            Ver Todas las Ayudas (6)
                                        </Button>
                                    </div>
                                </div>

                                <div className={`${cardBase}`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-3 rounded-lg">
                                                <WrenchIcon className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg text-[#1e3a8a]">Desglose Costes Rehabilitación</h3>
                                                <p className="text-sm text-gray-600">Presupuesto detallado por partidas desde APIs construcción</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setShowSection((prev) => ({ ...prev, showCostes: !showSection?.showCostes }))}
                                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg flex items-center gap-2"
                                        >
                                            <WrenchIcon className="w-6 h-6" />
                                            Ver Desglose Completo
                                        </Button>
                                    </div>
                                    {showSection?.showCostes && <DesgloseCostRehabilit />}
                                </div>

                                <div className={`${cardBase} relative tooltip-container`}>
                                    <Button className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                        <CircleQuestionMarkIcon className="w-3 h-3 text-green-600" />
                                    </Button>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-3 rounded-lg">
                                                <CircleQuestionMarkIcon className="w-3 h-3 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg text-[#1e3a8a]">Desglose Green Premium</h3>
                                                <p className="text-sm text-gray-600">Componentes que aportan valor al edificio</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setShowSection((prev) => ({ ...prev, showGreenPremium: !showSection?.showGreenPremium }))}
                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center gap-2"
                                        >
                                            <CircleCheckIcon className="w-5 h-5" />
                                            Ver Desglose Completo
                                        </Button>
                                    </div>
                                    {showSection?.showGreenPremium && <DesgloseGreenPremium />}
                                </div>
                            </div>

                            <div className="col-span-2 space-y-4">
                                <div className={`${cardBase}`}>
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
                                            <div className="text-xs text-gray-600">Total rehabilitación energética integral</div>
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
                                            <div className="mt-2 text-xs text-gray-600">LTV Verde: % sobre valor futuro post-reforma</div>
                                        </div>

                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <div className="text-xs font-semibold text-gray-800 mb-3">Fuentes de Capital:</div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-700">• Deuda Senior Verde:</span>
                                                    <span className="font-semibold text-purple-700">9.65M€</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-700">• Subvenciones Next Gen:</span>
                                                    <span className="font-semibold text-green-700">0.27M€</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-gray-700">• Equity / Sponsor:</span>
                                                    <span className="font-semibold text-blue-700">-8.57M€</span>
                                                </div>
                                                <div className="border-t border-purple-300 pt-2 mt-2 flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-gray-800">Total:</span>
                                                    <span className="font-semibold text-purple-900">1.35M€</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="text-xs font-semibold text-gray-800 mb-2">Exit Strategy (5 años):</div>
                                            <div className="space-y-1 text-xs text-gray-700">
                                                <div>• <strong>Refinanciación</strong> a LTV estándar 65%</div>
                                                <div>• <strong>Venta</strong> a valor post-reforma: 17.55M€</div>
                                                <div>• Equity Multiple: <strong className="text-amber-700">2.57x</strong></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${cardBase}`}>
                                    <h3 className="text-lg mb-4 flex items-center gap-2 text-[#1e3a8a]">
                                        <LinkIcon className="w-5 h-5" />
                                        Cadena de Evidencia Documental
                                    </h3>
                                    <p className="text-xs text-gray-600 mb-4">Trazabilidad completa de documentos que soportan cada criterio de la Taxonomía UE</p>
                                    <div className="space-y-2">
                                        {[
                                            { title: "CEE Oficial", note: "→ Reducción 42% energética" },
                                            { title: "Memoria Técnica", note: "→ DNSH Agua Sostenible" },
                                            { title: "Proyecto Básico", note: "→ Economía Circular (70% reciclaje)" },
                                            { title: "Catastro + APQ", note: "→ Ausencia Amianto" },
                                            { title: "MITECO API", note: "→ Biodiversidad verificada" },
                                            { title: "Análisis Riesgos Climáticos", note: "→ Adaptación climática" },
                                        ].map((doc) => (
                                            <div key={doc.title} className="flex items-center gap-2 py-2 px-3 bg-green-50 border border-green-200 rounded-lg">
                                                <FileTextIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <span className="text-xs font-medium text-gray-900">{doc.title}</span>
                                                    <span className="text-xs text-gray-600 ml-2">{doc.note}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`${cardBase} relative tooltip-container group`}>
                                    <Button onClick={() => setMetricHelp((prev) => ({ ...prev, General: !metricHelp?.General }))} className="absolute top-1 right-1 rounded-full bg-white border-blue-200 border z-10">
                                        <CircleQuestionMarkIcon className="w-3 h-3 text-blue-600" />
                                    </Button>
                                    {metricHelp?.General && <HelperMetrics />}

                                    <h3 className="text-lg mb-4 flex items-center gap-2 text-[#1e3a8a]">
                                        <ChartColumnIcon className="w-5 h-5" />
                                        Métricas de Retorno
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 relative tooltip-container group">
                                            <button onClick={() => setMetricHelp((prev) => ({ ...prev, TIR: !metricHelp?.TIR }))} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border-blue-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                                <CircleQuestionMarkIcon className="w-2 h-2 text-blue-600" />
                                            </button>
                                            {metricHelp?.TIR && <MetricTooltip borderColor="blue" text="TIR (IRR): Tasa Interna de Retorno anualizada. Fondos Value-Add buscan 12-18%. Verde añade +150-200bps vs estándar." />}
                                            <div className="text-xs text-gray-600 mb-1">TIR (IRR) Institucional</div>
                                            <div className="text-3xl font-bold text-[#1e3a8a] mb-1">18.5%</div>
                                            <div className="text-xs text-gray-600">A 5 años - Value Add</div>
                                        </div>

                                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4 relative tooltip-container group">
                                            <button onClick={() => setMetricHelp((prev) => ({ ...prev, CashOnCash: !metricHelp?.CashOnCash }))} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-emerald-100 border-emerald-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                                <CircleQuestionMarkIcon className="w-3 h-3 text-emerald-600" />
                                            </button>
                                            {metricHelp?.CashOnCash && <MetricTooltip borderColor="emerald" text="Cash-on-Cash: Retorno anual efectivo sobre equity. Métrica clave para fondos. Verde mejora +2-3pp por menor servicio deuda." />}
                                            <div className="text-xs text-gray-600 mb-1">Cash on Cash Return</div>
                                            <div className="flex items-center gap-2"><div className="text-2xl font-bold text-emerald-700">5.8%</div><div className="text-xs text-gray-500 line-through">2.3%</div></div>
                                            <div className="text-xs text-emerald-600 mt-1">Bonificación Verde: +3.5pp</div>
                                        </div>

                                        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 relative tooltip-container group">
                                            <button onClick={() => setMetricHelp((prev) => ({ ...prev, Equity: !metricHelp?.Equity }))} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-indigo-100 border-indigo-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                                <CircleQuestionMarkIcon className="w-3 h-3 text-emerald-600" />
                                            </button>
                                            {metricHelp?.Equity && <MetricTooltip borderColor="indigo" text="Equity Multiple: Múltiplo de retorno total sobre capital invertido a exit. EM >2.0x es excelente para Value-Add institucional." />}
                                            <div className="text-xs text-gray-600 mb-1">Equity Multiple</div>
                                            <div className="text-3xl font-bold text-indigo-700 mb-1">2.6x</div>
                                            <div className="text-xs text-gray-600">Multiplicador de Capital a 5 años</div>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 relative tooltip-container group">
                                            <button onClick={() => setMetricHelp((prev) => ({ ...prev, YieldOnCost: !metricHelp?.YieldOnCost }))} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                                <CircleQuestionMarkIcon className="w-3 h-3 text-emerald-600" />
                                            </button>
                                            {metricHelp?.YieldOnCost && <MetricTooltip borderColor="green" text="Yield on Cost: Rentabilidad sobre coste total (NOI/CAPEX+Valor). Mide eficiencia de la inversión total en generar rentas." />}
                                            <div className="text-xs text-gray-600 mb-1">Yield on Cost (YoC)</div>
                                            <div className="flex items-center gap-2"><div className="text-2xl font-bold text-green-700">5.4%</div><div className="text-xs text-gray-500">vs 4.2% Actual</div></div>
                                            <div className="text-xs text-green-600 mt-1">+1.2pp post-reforma</div>
                                        </div>

                                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 relative tooltip-container group">
                                            <button onClick={() => setMetricHelp((prev) => ({ ...prev, LTVVerde: !metricHelp?.LTVVerde }))} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border-orange-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                                <CircleQuestionMarkIcon className="w-3 h-3 text-orange-600" />
                                            </button>
                                            {metricHelp?.LTVVerde && <MetricTooltip borderColor="orange" text="LTV Verde: Loan-to-Value bonificado. Bancos prestan hasta 80% vs 70% estándar en proyectos Taxonomy-Aligned. Menor equity requerido." />}
                                            <div className="text-xs text-gray-600 mb-1">LTV Verde</div>
                                            <div className="text-2xl font-bold text-orange-700 mb-1">55%</div>
                                            <div className="text-xs text-gray-600">Préstamo: 9.65M€</div>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 relative tooltip-container group">
                                            <button onClick={() => setMetricHelp((prev) => ({ ...prev, DSCRProyectado: !metricHelp?.DSCRProyectado }))} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                                <CircleQuestionMarkIcon className="w-3 h-3 text-emerald-600" />
                                            </button>
                                            {metricHelp?.DSCRProyectado && <MetricTooltip borderColor="green" text="DSCR: Debt Service Coverage Ratio. Mide veces que NOI cubre servicio deuda. Bancos requieren >1.25x. Verde mejora DSCR por menor tipo interés." />}
                                            <div className="text-xs text-gray-600 mb-1">DSCR Proyectado</div>
                                            <div className="text-2xl font-bold text-green-700 mb-1">1.79x</div>
                                            <div className="text-xs text-gray-600">Cobertura excelente</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${cardBase} relative tooltip-container group`}>
                                    <button onClick={() => setMetricHelp((prev) => ({ ...prev, CashFlow: !metricHelp?.CashFlow }))} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                        <CircleQuestionMarkIcon className="w-3 h-3 text-emerald-600" />
                                    </button>
                                    {metricHelp?.CashFlow && <HelperCashFlow />}

                                    <h3 className="text-lg mb-4 flex items-center gap-2 text-[#1e3a8a]">
                                        <PiggyBankIcon className="w-5 h-5" />
                                        Cash Flow (NOI)
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
                                            <div className="text-xs text-gray-600 mb-1">NOI Actual</div>
                                            <div className="text-xl font-bold text-gray-700">637k€</div>
                                            <div className="text-xs text-gray-500">anual</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3">
                                            <div className="text-xs text-gray-600 mb-1">NOI Proyectado</div>
                                            <div className="text-xl font-bold text-green-700">891k€</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <ArrowUpRightIcon className="w-3 h-3 text-green-600" />
                                                <span className="text-xs text-green-600">+39.8%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                                        <div className="text-xs text-gray-700 mb-2">Desglose Impacto:</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Rentas Proyectadas:</span>
                                            <span className="text-xs font-medium text-green-700">1080k€</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600">OPEX Proyectado:</span>
                                            <span className="text-xs font-medium text-gray-900">-189k€</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-blue-200 pt-2">
                                            <span className="text-xs text-green-600">Ahorro Energético:</span>
                                            <span className="text-xs font-medium text-green-700">+38k€/año</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // MOBILE LAYOUT (isMobile === true)
                        <div className="flex flex-col gap-4">
                            <div className="w-full">
                                <div className={`${cardBase} min-h-[auto]`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg flex items-center gap-2 text-[#1e3a8a]">
                                            <ShieldIcon className="w-4 h-4" />
                                            Validación Taxonomía UE
                                        </h3>
                                        <Button onClick={() => setShowSection((prev) => ({ ...prev, validationInfo: !showSection?.validationInfo }))} className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg">
                                            {!showSection?.validationInfo ? "Más info" : "Menos info"}
                                        </Button>
                                    </div>

                                    <div className="mb-4 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 rounded-xl p-4 shadow-md">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
                                                <div className="text-center">
                                                    <div className="text-xl font-bold">92%</div>
                                                    <div className="text-[10px]">Aligned</div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-green-900 mb-1 text-sm">Validación Taxonomía UE</h4>
                                                <p className="text-xs text-gray-700">Tu edificio alcanza <strong>92% de alineación</strong>.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {showSection?.validationInfo && (
                                        <div className="space-y-3">
                                            <div className="text-xs text-gray-700">
                                                La Taxonomía UE es el sistema de clasificación más riguroso del mundo para actividades sostenibles...
                                            </div>

                                            <div className="space-y-2">
                                                {[
                                                    { key: "useWater", icon: <DropletIcon className="w-4 h-4 text-blue-600" />, title: "Uso Sostenible del Agua", state: showDNSH.useWater, toggle: () => setShowDNSH((p) => ({ ...p, useWater: !p.useWater })) },
                                                    { key: "economyCircly", icon: <RecycleIcon className="w-4 h-4 text-green-600" />, title: "Economía Circular", state: showDNSH.economyCircly, toggle: () => setShowDNSH((p) => ({ ...p, economyCircly: !p.economyCircly })) },
                                                    { key: "polution", icon: <WindIcon className="w-4 h-4 text-purple-600" />, title: "Prevención Polución", state: showDNSH.polution, toggle: () => setShowDNSH((p) => ({ ...p, polution: !p.polution })) },
                                                    { key: "biodiversity", icon: <DropletIcon className="w-4 h-4 text-green-700" />, title: "Biodiversidad", state: showDNSH.biodiversity, toggle: () => setShowDNSH((p) => ({ ...p, biodiversity: !p.biodiversity })) },
                                                    { key: "adaptation", icon: <ShieldIcon className="w-4 h-4 text-blue-700" />, title: "Adaptación", state: showDNSH.adaptation, toggle: () => setShowDNSH((p) => ({ ...p, adaptation: !p.adaptation })) },
                                                ].map((item: any) => (
                                                    <div key={item.key} className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                {item.icon}
                                                                <span className="text-xs text-gray-900">{item.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-green-600">100%</span>
                                                                <Button className="p-0" onClick={item.toggle}>
                                                                    <InfoIcon className={`w-4 h-4 text-gray-${item.state ? "900" : "400"}`} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        {item.state && <div className="mt-2 text-xs text-gray-700">Detalle del criterio...</div>}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-white rounded-lg p-3 border-2 border-green-300">
                                                <div className="text-xs font-semibold text-gray-800 mb-2">📊 Cálculo de tu 92%:</div>
                                                <div className="text-xs text-gray-700 space-y-1">
                                                    <div className="flex justify-between"><span>Contribución Sustancial:</span><span className="font-semibold text-green-700">✓ PASS (40%)</span></div>
                                                    <div className="flex justify-between"><span>DNSH Agua:</span><span className="font-semibold text-green-700">✓ (10%)</span></div>
                                                    <div className="flex justify-between"><span>...otros criterios</span><span className="font-semibold text-green-700">✓</span></div>
                                                    <div className="border-t border-gray-300 my-2"></div>
                                                    <div className="flex justify-between font-bold"><span>ALINEACIÓN TOTAL:</span><span className="text-green-700">92%</span></div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg p-3 text-xs">
                                                <div className="font-semibold text-blue-900 mb-1">Impacto de tu 92% en Financiación:</div>
                                                <ul className="pl-4 space-y-1">
                                                    <li>• Bonificación -50 bps en tipo interés</li>
                                                    <li>• Elegible para Green Bonds (≥85%)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={`${cardBase}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 p-3 rounded-lg"><AwardIcon className="w-6 h-6 text-purple-600" /></div>
                                            <div>
                                                <h3 className="text-base text-[#1e3a8a]">Subvenciones y Ayudas Públicas</h3>
                                                <p className="text-xs text-gray-600">Total máximo financiable: <strong className="text-purple-600">1.33M€</strong></p>
                                            </div>
                                        </div>
                                        <Button onClick={() => setShowSection((prev) => ({ ...prev, showHelpers: true }))} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm">
                                            Ver Ayudas (6)
                                        </Button>
                                    </div>
                                </div>

                                <div className={`${cardBase}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-3 rounded-lg"><WrenchIcon className="w-6 h-6 text-orange-600" /></div>
                                            <div>
                                                <h3 className="text-base text-[#1e3a8a]">Desglose Costes Rehabilitación</h3>
                                                <p className="text-xs text-gray-600">Detalle por partidas</p>
                                            </div>
                                        </div>
                                        <Button onClick={() => setShowSection((prev) => ({ ...prev, showCostes: !showSection?.showCostes }))} className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg text-sm">
                                            {showSection?.showCostes ? "Ocultar" : "Ver Desglose"}
                                        </Button>
                                    </div>
                                    {showSection?.showCostes && <DesgloseCostRehabilit />}
                                </div>

                                <div className={`${cardBase}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-3 rounded-lg"><CircleQuestionMarkIcon className="w-3 h-3 text-green-600" /></div>
                                            <div>
                                                <h3 className="text-base text-[#1e3a8a]">Desglose Green Premium</h3>
                                                <p className="text-xs text-gray-600">Componentes que aportan valor</p>
                                            </div>
                                        </div>
                                        <Button onClick={() => setShowSection((prev) => ({ ...prev, showGreenPremium: !showSection?.showGreenPremium }))} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm">
                                            {showSection?.showGreenPremium ? "Ocultar" : "Ver"}
                                        </Button>
                                    </div>
                                    {showSection?.showGreenPremium && <DesgloseGreenPremium />}
                                </div>

                                <div className={`${cardBase}`}>
                                    <h3 className="text-lg mb-3 flex items-center gap-2 text-[#1e3a8a]"><DollarSignIcon className="w-5 h-5" />Estructuración</h3>
                                    <div className="space-y-3">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                                            <div className="flex items-center justify-between"><span>Investment Size (CAPEX)</span><strong>1.35M€</strong></div>
                                            <div className="text-xs text-gray-600">Rehabilitación integral</div>
                                        </div>
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs">
                                            <div className="flex items-center justify-between"><span>Fuentes de Capital</span><strong>Ver</strong></div>
                                            <div className="text-xs text-gray-600">Deuda Senior, Subvenciones, Equity</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${cardBase}`}>
                                    <h3 className="text-lg mb-3 flex items-center gap-2 text-[#1e3a8a]"><LinkIcon className="w-5 h-5" />Cadena Documental</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="py-2 px-2 bg-green-50 border border-green-200 rounded-lg text-xs">CEE Oficial <div className="text-[10px] text-gray-600">→ Reducción 42%</div></div>
                                        <div className="py-2 px-2 bg-green-50 border border-green-200 rounded-lg text-xs">Memoria Técnica <div className="text-[10px] text-gray-600">→ DNSH Agua</div></div>
                                        <div className="py-2 px-2 bg-green-50 border border-green-200 rounded-lg text-xs">Proyecto Básico <div className="text-[10px] text-gray-600">→ Economía Circular</div></div>
                                        <div className="py-2 px-2 bg-green-50 border border-green-200 rounded-lg text-xs">Catastro + APQ <div className="text-[10px] text-gray-600">→ Ausencia Amianto</div></div>
                                    </div>
                                </div>

                                <div className={`${cardBase}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg flex items-center gap-2 text-[#1e3a8a]"><ChartColumnIcon className="w-5 h-5" />Métricas</h3>
                                        <Button onClick={() => setMetricHelp((p) => ({ ...p, General: !p.General }))} className="px-3 py-1 rounded-full bg-white border">?</Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-2 text-xs">
                                            <div className="font-semibold">TIR</div>
                                            <div className="text-lg font-bold">18.5%</div>
                                            <div className="text-[11px] text-gray-600">5 años</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-2 text-xs">
                                            <div className="font-semibold">Cash on Cash</div>
                                            <div className="text-lg font-bold text-emerald-700">5.8%</div>
                                            <div className="text-[11px] text-gray-600">Bonif. Verde +3.5pp</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-2 text-xs">
                                            <div className="font-semibold">Equity Multiple</div>
                                            <div className="text-lg font-bold">2.6x</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-2 text-xs">
                                            <div className="font-semibold">Yield on Cost</div>
                                            <div className="text-lg font-bold text-green-700">5.4%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${cardBase}`}>
                                    <h3 className="text-lg mb-3 flex items-center gap-2 text-[#1e3a8a]"><PiggyBankIcon className="w-5 h-5" />Cash Flow</h3>
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
                            </div>
                        </div>
                    )}

                    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
                        <button
                            onClick={() => setFinancialTwin(true)}
                            className="pointer-events-auto px-8 py-4 rounded-xl shadow-2xl text-lg flex items-center gap-3 transition-all bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white hover:shadow-xl hover:scale-105"
                        >
                            <SendIcon className="w-6 h-6" />
                            Solicitar Financiación a Partners
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FinancialTwin;
