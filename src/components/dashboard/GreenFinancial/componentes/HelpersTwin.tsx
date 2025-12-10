import { X, CircleAlert, CircleCheck, Calendar, ExternalLink, Clock, Info } from 'lucide-react';

interface HelpersTwinProps {
    active: boolean;
    setActive: (active: boolean) => void;
}

const HelpersTwin = ({ active, setActive }: HelpersTwinProps) => {
    if (!active) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-90 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setActive(false);
                }
            }}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                
                <div className="bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl mb-1">Subvenciones y Ayudas Disponibles</h2>
                            <p className="text-sm text-blue-100">Total disponible: 1.78M€</p>
                        </div>
                        {/* Botón de Cierre */}
                        <button 
                            onClick={() => setActive(false)}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                            aria-label="Cerrar modal"
                        >
                            <X className="w-6 h-6" aria-hidden="true" />
                        </button>
                    </div>
                    
                    {/* Tarjetas de Métricas Clave */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-xs text-blue-100 mb-1">Ayudas Disponibles</div>
                            <div className="text-2xl">5</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-xs text-blue-100 mb-1">Próximas a Cerrar</div>
                            <div className="text-2xl flex items-center gap-2">
                                1
                                <CircleAlert className="w-5 h-5 text-orange-300" aria-hidden="true" />
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                            <div className="text-xs text-blue-100 mb-1">Total Acumulable</div>
                            <div className="text-2xl">1.78M€</div>
                        </div>
                    </div>
                </div>

                {/* --- CONTENIDO PRINCIPAL: Lista de Ayudas --- */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">

                        {/* Ayuda 1: PREE-5000 */}
                        <div className="border-2 rounded-xl p-5 transition-all border-green-300 bg-green-50">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg text-gray-900">PREE-5000 Rehabilitación Energética</h3>
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <CircleCheck className="w-3 h-3" aria-hidden="true" />
                                            Disponible
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Next Generation EU - IDAE</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl text-blue-600 mb-1">300k€</div>
                                    <div className="text-xs text-gray-600">20% del coste</div>
                                </div>
                            </div>
                            <button className="w-full text-sm text-blue-600 hover:text-blue-700 mb-3 text-left">
                                ▶ Ver requisitos y documentación
                            </button>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-300 mt-3">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" aria-hidden="true" />
                                        <span>Plazo: 31/12/2024</span>
                                    </div>
                                </div>
                                <a href="https://www.idae.es/ayudas-y-financiacion/para-rehabilitacion-de-edificios" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline">
                                    <span>Más información</span>
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                            </div>
                        </div>

                        {/* Ayuda 2: Deducción IRPF */}
                        <div className="border-2 rounded-xl p-5 transition-all border-green-300 bg-green-50">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg text-gray-900">Deducción IRPF 60% Rehabilitación</h3>
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <CircleCheck className="w-3 h-3" aria-hidden="true" />
                                            Disponible
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Ley 10/2022 - Agencia Tributaria</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl text-blue-600 mb-1">900k€</div>
                                    <div className="text-xs text-gray-600">60% del coste</div>
                                </div>
                            </div>
                            <button className="w-full text-sm text-blue-600 hover:text-blue-700 mb-3 text-left">
                                ▶ Ver requisitos y documentación
                            </button>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-300 mt-3">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" aria-hidden="true" />
                                        <span>Plazo: 31/12/2024</span>
                                    </div>
                                </div>
                                <a href="https://sede.agenciatributaria.gob.es/deducciones-mejora-eficiencia-energetica" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline">
                                    <span>Más información</span>
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                        
                        {/* Ayuda 3: Bonificación IBI */}
                        <div className="border-2 rounded-xl p-5 transition-all border-green-300 bg-green-50">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg text-gray-900">Bonificación IBI Municipal (50%)</h3>
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <CircleCheck className="w-3 h-3" aria-hidden="true" />
                                            Disponible
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Ordenanza Fiscal Municipal</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl text-blue-600 mb-1">60k€</div>
                                    <div className="text-xs text-gray-600">50% del coste</div>
                                </div>
                            </div>
                            <button className="w-full text-sm text-blue-600 hover:text-blue-700 mb-3 text-left">
                                ▶ Ver requisitos y documentación
                            </button>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-300 mt-3">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" aria-hidden="true" />
                                        <span>Plazo: Permanente</span>
                                    </div>
                                </div>
                                <a href="https://www.madrid.es/tramites/bonificacion-ibi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline">
                                    <span>Más información</span>
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                        
                        {/* Ayuda 4: Bonificación ICIO */}
                        <div className="border-2 rounded-xl p-5 transition-all border-green-300 bg-green-50">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg text-gray-900">Bonificación ICIO (95%)</h3>
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <CircleCheck className="w-3 h-3" aria-hidden="true" />
                                            Disponible
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Ordenanza Fiscal Municipal</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl text-blue-600 mb-1">71k€</div>
                                    <div className="text-xs text-gray-600">95% del coste</div>
                                </div>
                            </div>
                            <button className="w-full text-sm text-blue-600 hover:text-blue-700 mb-3 text-left">
                                ▶ Ver requisitos y documentación
                            </button>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-300 mt-3">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" aria-hidden="true" />
                                        <span>Plazo: Permanente</span>
                                    </div>
                                </div>
                                <a href="https://www.madrid.es/tramites/icio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline">
                                    <span>Más información</span>
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                            </div>
                        </div>

                        {/* Ayuda 5: PRTR C2 (Cierra pronto) */}
                        <div className="border-2 rounded-xl p-5 transition-all border-orange-300 bg-orange-50">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg text-gray-900">PRTR C2 - Programa de Rehabilitación</h3>
                                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <Clock className="w-3 h-3" aria-hidden="true" />
                                            Cierra pronto
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Plan de Recuperación - Ministerio Transportes</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-2xl text-blue-600 mb-1">450k€</div>
                                    <div className="text-xs text-gray-600">30% del coste</div>
                                </div>
                            </div>
                            <button className="w-full text-sm text-blue-600 hover:text-blue-700 mb-3 text-left">
                                ▶ Ver requisitos y documentación
                            </button>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-300 mt-3">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" aria-hidden="true" />
                                        <span>Plazo: 30/06/2025</span>
                                    </div>
                                </div>
                                <a href="https://www.mitma.gob.es/programa-prtr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline">
                                    <span>Más información</span>
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                        
                        {/* Ayuda 6: ICO Crédito (Financiación) */}
                        <div className="border-2 rounded-xl p-5 transition-all border-green-300 bg-green-50">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg text-gray-900">ICO Crédito Verde (Financiación)</h3>
                                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                            <CircleCheck className="w-3 h-3" aria-hidden="true" />
                                            Disponible
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Línea ICO - Financiación preferente</p>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-sm text-gray-600">Financiación<br/>preferente</div>
                                </div>
                            </div>
                            <button className="w-full text-sm text-blue-600 hover:text-blue-700 mb-3 text-left">
                                ▶ Ver requisitos y documentación
                            </button>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-300 mt-3">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" aria-hidden="true" />
                                        <span>Plazo: Permanente</span>
                                    </div>
                                </div>
                                <a href="https://www.ico.es/lineas-ico-empresas-y-emprendedores" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline">
                                    <span>Más información</span>
                                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                </a>
                            </div>
                        </div>

                    </div>
                    
                    {/* Nota Importante de Acumulabilidad */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            <div>
                                <h4 className="text-sm text-gray-900 mb-2">Nota Importante</h4>
                                <p className="text-xs text-gray-700">
                                    Las subvenciones y deducciones fiscales son **acumulables** en la mayoría de casos. 
                                    Total máximo financiable: <strong className="text-blue-600">1.78M€</strong> 
                                    (118.8% del CAPEX de 1.5M€)
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- FOOTER: Botón de Cierre --- */}
                <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
                    <button 
                        onClick={() => setActive(false)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HelpersTwin;