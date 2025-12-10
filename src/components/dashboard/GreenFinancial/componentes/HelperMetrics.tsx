import { BookOpenIcon, CalculatorIcon, CircleAlertIcon, LightbulbIcon } from "lucide-react"

const HelperMetrics = () => {

    return (
        <div className="absolute top-10 right-2 bg-white border-2 border-blue-300 rounded-lg shadow-xl p-4 w-[400px] max-h-[500px] overflow-y-auto z-20 text-left">
            <div className="mb-3 pb-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Métricas de Retorno Institucionales</h3>
                <p className="text-xs text-gray-600">Investment Returns - Institutional Real Estate Metrics</p>
            </div>

            <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                    <CalculatorIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"/>
                    <div className="flex-1">
                        <p className="text-xs font-mono text-gray-900">IRR = TIR Flujos; CoC = Cashflow/Equity; EM = Valor Exit/Equity; YoC = NOI/Total Cost</p>
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <p className="text-xs text-gray-700 leading-relaxed">Métricas estándar de retorno usadas por fondos institucionales para evaluar inversiones inmobiliarias. IRR mide rentabilidad anualizada total, Cash-on-Cash el retorno efectivo anual sobre equity, Equity Multiple el multiplicador de capital a salida, y Yield-on-Cost la rentabilidad sobre coste total. Todas las métricas mejoran significativamente con financiación verde vs estándar.</p>
            </div>

            <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <BookOpenIcon className="w-3 h-3" />
                    Desglose de Componentes
                </h4>
                <div className="space-y-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">IRR (TIR) Target</span>
                            <span className="text-xs font-semibold text-blue-600">18.5%</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">Tasa Interna de Retorno a 5 años. Fondos Value-Add buscan 12-18% IRR. Este proyecto supera umbrales institucionales.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">Cash on Cash Return</span>
                            <span className="text-xs font-semibold text-blue-600">5.8%</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">Cashflow anual/Equity invertido. La bonificación verde añade +1.2pp vs financiación estándar.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">Equity Multiple</span>
                            <span className="text-xs font-semibold text-blue-600">2.6x</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">Múltiplo de retorno total sobre equity a exit (Year 5). EM &gt;2.0x es excelente para Value-Add.</p>
                    </div>
                </div>
            </div>

            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                    <CircleAlertIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-amber-900 mb-1">Normativa Aplicable</h4>
                        <p className="text-xs text-amber-800 leading-relaxed">Métricas conforme INREV Guidelines y GRESB reporting standards para fondos inmobiliarios institucionales.</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3">
                <div className="flex items-start gap-2">
                    <LightbulbIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            Ejemplo Práctico<span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Aplicado</span>
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">Con equity invertido de 6.82M€, el proyecto genera IRR del 18.5% y Cash-on-Cash del 5.8%. La financiación verde bonifica tipos en 50 bps, mejorando todos los retornos.</p>
                    </div>
                </div>
            </div>

            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                    <LightbulbIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-green-900 mb-1">💡 Consejo ARKIA</h4>
                        <p className="text-xs text-green-800 leading-relaxed">La financiación verde mejora TODOS los KPIs de retorno: reduce el coste de deuda (-50bps), aumenta el valor del activo (Green Premium), y mejora el cashflow (ahorro OPEX energético). Un proyecto que apenas alcanzaba 12% IRR estándar puede llegar a 14-15% con estructura verde optimizada.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HelperMetrics