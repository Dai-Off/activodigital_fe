import { CircleQuestionMarkIcon, TrendingUpIcon } from "lucide-react";
import { useState } from "react";

interface HelpersI {
    greenPremiunTotal: boolean,
    yield: boolean,
    ahorro: boolean,
    greenRentPremium: boolean,
    ROI: boolean,
}


const DesgloseGreenPremium = () => {
    const [helper, setHelper] = useState<HelpersI>({
        greenPremiunTotal: false,
        ROI: false,
        greenRentPremium: false,
        yield: false,
        ahorro: false,
    })

    return (
        <div className="border-t-2 border-gray-200 pt-6 space-y-4">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl p-5 relative tooltip-container group">
                <button onClick={() => setHelper((prev) => ({...prev, greenPremiunTotal: !helper?.greenPremiunTotal}))} className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-green-100 border-green-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                    <CircleQuestionMarkIcon className="w-3 h-3 text-green-600" />
                </button>
                {helper?.greenPremiunTotal && <div className="absolute top-10 right-2 bg-white border-2 border-green-300 rounded-lg shadow-xl p-4 w-80 z-20 text-left"><p className="text-xs text-gray-700">Green Premium: Incremento total de valor del activo por certificación verde. Suma de 3 componentes: (1) Yield Compression, (2) OPEX Savings capitalizados, (3) Rent Premium. Verificable en estudios JLL, CBRE, Knight Frank.</p></div>}
                <div className="text-sm text-gray-700 mb-2">Green Premium Total</div>
                <div className="text-3xl font-bold text-green-700 mb-1">2.43M€</div>
                <div className="text-xs text-gray-600">Incremento de valor por certificación verde</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative tooltip-container group">
                <button onClick={() => setHelper((prev) => ({...prev, yield: !helper?.yield}))}
                 className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-blue-100 border-blue-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                    <CircleQuestionMarkIcon className="w-3 h-3 text-blue-600" />
                </button>
                {helper?.yield && <div className="absolute top-10 right-2 bg-white border-2 border-blue-300 rounded-lg shadow-xl p-4 w-80 z-20 text-left"><p className="text-xs text-gray-700">Yield Compression (Compresión Cap Rate): Edificios clase A se valoran a menor cap rate que clase G. Compresión de 50 bps significa que el NOI se capitaliza a tasa menor, aumentando el valor. Ejemplo: 100k€ NOI a 5.0% cap = 2.0M€; a 4.5% cap = 2.22M€ (+11%). Datos JLL, CBRE.</p></div>}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                        <h4 className="text-sm font-semibold text-gray-900">Yield Compression</h4>
                    </div>
                    <span className="text-sm font-bold text-blue-700">0.09M€</span>
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex items-center justify-between">
                        <span>Exit Yield Standard:</span>
                        <span className="font-medium">3.71%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Exit Yield Green:</span>
                        <span className="font-medium text-green-600">3.21%</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-blue-200 pt-2">
                        <span className="font-semibold">Compresión:</span>
                        <span className="font-semibold text-blue-700">- bps</span>
                    </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 bg-white rounded-lg p-2">💡 Los edificios clase A tienen menores tasas de descuento (cap rates) que los clase G. La compresión de&nbsp; bps añade valor al capitalizar el NOI a menor yield.</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 relative tooltip-container group">
                <button onClick={() => setHelper((prev) => ({...prev, ahorro: !helper?.ahorro}))}
                 className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-orange-100 border-orange-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                    <CircleQuestionMarkIcon className="w-3 h-3 text-orange-600" />
                </button>
                {helper?.ahorro && <div className="absolute top-10 right-2 bg-white border-2 border-orange-300 rounded-lg shadow-xl p-4 w-80 z-20 text-left"><p className="text-xs text-gray-700">OPEX Savings Capitalizado: El ahorro energético anual se capitaliza a 15 años (valor presente). Reducción verificable en facturas. Ejemplo: ahorrar 28k€/año durante 15 años a tasa 4% = 311k€ VP. Este valor es PERMANENTE y verificable post-obra.</p></div>}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                        <h4 className="text-sm font-semibold text-gray-900">Ahorro OPEX Capitalizado</h4>
                    </div>
                    <span className="text-sm font-bold text-orange-700">0.57M€</span>
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex items-center justify-between">
                        <span>OPEX Actual:</span>
                        <span className="font-medium">227k€/año</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>OPEX Post-Reforma:</span>
                        <span className="font-medium text-green-600">189k€/año</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-orange-200 pt-2">
                        <span className="font-semibold">Ahorro Anual:</span>
                        <span className="font-semibold text-orange-700">-38k€/año</span>
                    </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 bg-white rounded-lg p-2">💡 La reducción de 50% en consumo energético ahorra 38k€/año. Capitalizado a 15 años VP (tasa 4%), suma 0.57M€ de valor.</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 relative tooltip-container group">
                <button onClick={() => setHelper((prev) => ({...prev, greenRentPremium: !helper?.greenRentPremium}))}
                 className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-purple-100 border-purple-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                    <CircleQuestionMarkIcon className="w-3 h-3 text-purple-600" />
                </button>
               {helper?.greenRentPremium &&  <div className="absolute top-10 right-2 bg-white border-2 border-purple-300 rounded-lg shadow-xl p-4 w-80 z-20 text-left"><p className="text-xs text-gray-700">Green Rent Premium: Edificios certificados A consiguen rentas 10-15% superiores vs clase G. Inquilinos corporativos (Google, Amazon, bancos) pagan premium por cumplir objetivos ESG. Datos Knight Frank, CBRE Global Tenant Survey. Premium sostenido a largo plazo.</p></div>}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                        <h4 className="text-sm font-semibold text-gray-900">Green Rent Premium</h4>
                    </div>
                    <span className="text-sm font-bold text-purple-700">2.59M€</span>
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex items-center justify-between">
                        <span>Rentas Actuales:</span>
                        <span className="font-medium">864k€/año</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Rentas Post-Reforma:</span>
                        <span className="font-medium text-green-600">1080k€/año</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-purple-200 pt-2">
                        <span className="font-semibold">Premium:</span>
                        <span className="font-semibold text-purple-700">+216k€/año</span>
                    </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 bg-white rounded-lg p-2">💡 Edificios certificados A consiguen rentas 10-15% superiores vs clase G. Corporaciones ESG-compliant pagan premium por espacios eficientes y certificados.</div>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-green-300 rounded-xl p-5 relative tooltip-container group">
                <button onClick={() => setHelper((prev) => ({...prev, ROI: !helper?.ROI}))}
                 className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-emerald-100 border-emerald-200 border group-hover:opacity-100 transition-opacity shadow-sm z-10">
                    <CircleQuestionMarkIcon className="w-3 h-3 text-emerald-600" />
                </button>
               {helper?.ROI && <div className="absolute top-10 right-2 bg-white border-2 border-emerald-300 rounded-lg shadow-xl p-4 w-80 z-20 text-left"><p className="text-xs text-gray-700">ROI sobre CAPEX: Retorno total sobre inversión en rehabilitación. Mide cuánto valor se crea por cada euro invertido. ROI &gt;150% significa que cada 1€ invertido genera 1.50€ de valor adicional. Combina los 3 componentes anteriores vs CAPEX total.</p></div>}
                <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <TrendingUpIcon className="w-4 h-4 text-green-600" />
                    ROI sobre Inversión Total (CAPEX)
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-gray-600 mb-1">CAPEX Total:</div>
                        <div className="text-xl font-bold text-gray-900">1.35M€</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-600 mb-1">Valor Creado:</div>
                        <div className="text-xl font-bold text-green-700">3.25M€</div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-300">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">ROI sobre CAPEX:</span>
                        <span className="text-2xl font-bold text-green-700">240.5%</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">Por cada 1€ invertido en rehabilitación, se crean 2.40€ de valor adicional.</div>
                </div>
            </div>
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                <div className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info w-3 h-3" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                    ¿Por qué este valor es real y verificable?
                </div>
                <div className="text-xs text-blue-800 space-y-1">
                    <div>• <strong>Yield Compression</strong>: Documentado en estudios JLL, CBRE (edificios clase A tienen cap rates -50 a -75 bps vs clase G)</div>
                    <div>• <strong>OPEX Savings</strong>: Verificable en facturas energéticas. Reducción 50% PED = ahorro lineal en €/kWh</div>
                    <div>• <strong>Rent Premium</strong>: Datos de mercado (Knight Frank Green Premium Report): certificados A consiguen +10-15% renta vs clase G</div>
                </div>
            </div>
        </div>
    )
}

export default DesgloseGreenPremium;