import { BookOpenIcon, CalculatorIcon, CircleAlertIcon, LightbulbIcon } from "lucide-react"

const HelperCashFlow = () => {
    return (
        <div className="absolute top-10 right-2 bg-white border-2 border-green-300 rounded-lg shadow-xl p-4 w-[400px] max-h-[500px] overflow-y-auto z-20 text-left">

            <div className="mb-3 pb-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">NOI - Net Operating Income</h3>
                <p className="text-xs text-gray-600">Real Estate Cash Flow Metric</p>
            </div>

            <div className="bg-green-50 border border-green-300 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                    <CalculatorIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"/>
                    <div className="flex-1">
                        <p className="text-xs font-mono text-gray-900">
                            NOI = Rentas Brutas - OPEX (sin servicio deuda ni amortización)
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <p className="text-xs text-gray-700 leading-relaxed">
                    El NOI (Net Operating Income) es la métrica fundamental en RE institucional para medir cash flow operativo puro del activo, antes de financiación. Mide la capacidad intrínseca del edificio de generar caja. El **NOI proyectado post-obra** mejora por dos palancas: (1) Incremento rentas (**green premium**), (2) Reducción OPEX (**ahorro energético**). Es la base para valorar activos (Cap Rate = NOI/Valor).
                </p>
            </div>

            <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <BookOpenIcon className="w-3 h-3" />
                    Desglose de Componentes
                </h4>
                <div className="space-y-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">Rentas Proyectadas Post-Obra</span>
                            <span className="text-xs font-semibold text-green-600">1080k€</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Rentas actuales + Green Rent Premium (10-15%). Edificios certificados A consiguen premium sostenido vs competencia clase G.
                        </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">OPEX Proyectado</span>
                            <span className="text-xs font-semibold text-green-600">-189k€</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Costes operativos (limpieza, seguridad, gestión). Reducido vs actual por menor gasto energético.
                        </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">Ahorro Energético Neto</span>
                            <span className="text-xs font-semibold text-green-600">+38k€/año</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Reducción 42% consumo energía = menor OPEX permanente. Este ahorro cae directo a NOI.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                    <CircleAlertIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-amber-900 mb-1">Normativa Aplicable</h4>
                        <p className="text-xs text-amber-800 leading-relaxed">
                            NOI conforme IFRS 16 y estándares EPRA (European Public Real Estate Association) para reporting inmobiliario institucional.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
                <div className="flex items-start gap-2">
                    <LightbulbIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            Ejemplo Práctico
                            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">Aplicado</span>
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            NOI actual 637k€/año mejora a 891k€ (+39.8%) post-obra. Este incremento de **254k€/año** se capitaliza en el valor del edificio, multiplicándolo por cap rate objetivo (5.5%).
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                    <LightbulbIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-green-900 mb-1">💡 Consejo ARKIA</h4>
                        <p className="text-xs text-green-800 leading-relaxed">
                            El NOI mejorado es la clave del **Value Creation en Value-Add**. Cada **10k€ adicionales de NOI** añaden **~200k€ de valor** (asumiendo cap rate 5%). La combinación de rent premium + ahorro OPEX hace que el NOI verde sea especialmente resiliente en ciclos bajistas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HelperCashFlow