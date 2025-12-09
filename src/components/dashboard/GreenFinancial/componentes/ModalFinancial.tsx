import { CircleAlertIcon, CircleCheckIcon, SendIcon, XIcon } from "lucide-react";

interface HelpersTwinProps {
    active: boolean;
    setActive: (active: boolean) => void;
}

interface FinancialMetrics {
    response: string;
    success: string;
    ltv: string;
    range: string;
    successTone?: string;
}

interface FinancialEntity {
    id: string;
    emoji: string;
    name: string;
    subtitle: string;
    programs: string[];
    metrics: FinancialMetrics;
    selected?: boolean;
}

const FinancialEntityCard = ({ entity }: { entity: FinancialEntity }) => {
    const { emoji, name, subtitle, programs, metrics, selected } = entity;
    const baseClasses = "relative p-4 rounded-xl border-2 transition-all text-left";
    const selectedClasses = selected ? "border-[#1e3a8a] bg-blue-50 shadow-lg" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md";

    return (
        <button className={`${baseClasses} ${selectedClasses}`}>
            {selected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                    <CircleCheckIcon className="w-4 h-4 text-white" />
                </div>
            )}

            <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{emoji}</div>
                <div className="flex-1">
                    <div className="text-sm text-gray-900">{name}</div>
                    <div className="text-xs text-gray-500">{subtitle}</div>
                </div>
            </div>

            <div className="mb-3">
                {programs.map((program) => (
                    <div key={program} className="text-xs text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded mr-1 mb-1">
                        {program}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Respuesta:</span><span className="text-gray-900 ml-1">{metrics.response}</span></div>
                <div><span className="text-gray-500">Éxito:</span><span className={`ml-1 ${metrics.successTone ?? "text-blue-600"}`}>{metrics.success}</span></div>
                <div><span className="text-gray-500">LTV Max:</span><span className="text-gray-900 ml-1">{metrics.ltv}</span></div>
                <div><span className="text-gray-500">Rango:</span><span className="text-gray-900 ml-1">{metrics.range}</span></div>
            </div>
        </button>
    );
};

const ModalFinancial = ({ active, setActive }: HelpersTwinProps) => {
    if (!active) return null;

    const financialEntities: FinancialEntity[] = [
        {
            id: "santander",
            emoji: "🏦",
            name: "Banco Santander",
            subtitle: "Residencial y Terciario",
            programs: ["Línea Verde Empresas", "Hipoteca Verde"],
            metrics: { response: "5d", success: "85%", ltv: "70%", range: "0.5-50M€", successTone: "text-green-600" },
            selected: true,
        },
        {
            id: "bbva",
            emoji: "🏦",
            name: "BBVA",
            subtitle: "Todos los sectores",
            programs: ["Préstamo Sostenible", "Línea ICO Verde"],
            metrics: { response: "7d", success: "80%", ltv: "65%", range: "0.3-30M€", successTone: "text-blue-600" },
            selected: true,
        },
        {
            id: "caixabank",
            emoji: "🏦",
            name: "CaixaBank",
            subtitle: "Residencial",
            programs: ["Eco-Préstamo", "Línea Verde PYME"],
            metrics: { response: "6d", success: "82%", ltv: "70%", range: "0.3-25M€", successTone: "text-blue-600" },
        },
        {
            id: "eif",
            emoji: "🇪🇺",
            name: "European Investment Fund (EIF)",
            subtitle: "Proyectos de alto impacto",
            programs: ["Green Guarantee", "InvestEU"],
            metrics: { response: "15d", success: "75%", ltv: "80%", range: "1.0-100M€", successTone: "text-blue-600" },
            selected: true,
        },
        {
            id: "triodos",
            emoji: "🌱",
            name: "Triodos Bank",
            subtitle: "Proyectos sostenibles certificados",
            programs: ["Financiación Sostenible"],
            metrics: { response: "10d", success: "90%", ltv: "60%", range: "0.5-15M€", successTone: "text-green-600" },
        },
        {
            id: "ico",
            emoji: "🏛️",
            name: "ICO - Instituto de Crédito Oficial",
            subtitle: "PYME y rehabilitación",
            programs: ["Línea ICO Empresas y Emprendedores", "Línea Verde"],
            metrics: { response: "12d", success: "88%", ltv: "75%", range: "0.2-50M€", successTone: "text-green-600" },
        },
    ];

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-90 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <SendIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl">Solicitar Financiación</h2>
                            <p className="text-sm text-blue-100">Plaza Shopping</p>
                        </div>
                    </div>
                    <button onClick={() => setActive(false)} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                        <CircleAlertIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm text-blue-900 mb-1">¿Cómo funciona?</h4>
                            <p className="text-sm text-blue-700">Selecciona las entidades financieras a las que quieres enviar el dossier **Bank-Ready**. El documento incluye toda la documentación técnica, financiera y de taxonomía necesaria para la valoración. Las entidades contactarán directamente contigo en 5-15 días laborables.</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg text-gray-900 mb-4">Selecciona entidades financieras (3 seleccionadas)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {financialEntities.map((entity) => (
                                <FinancialEntityCard key={entity.id} entity={entity} />
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                        <h4 className="text-sm text-green-900 mb-2">Resumen del envío</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-xs text-green-600">Entidades</div>
                                <div className="text-lg text-green-900">3</div>
                            </div>
                            <div>
                                <div className="text-xs text-green-600">Respuesta estimada</div>
                                <div className="text-lg text-green-900">5-15 días</div>
                            </div>
                            <div>
                                <div className="text-xs text-green-600">Tasa de éxito promedio</div>
                                <div className="text-lg text-green-900">80%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
                    <button onClick={() => setActive(false)} className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
                    <button className="px-8 py-3 rounded-xl transition-all flex items-center gap-2 bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white hover:shadow-lg">
                        <SendIcon className="w-5 h-5" />
                        <span>Enviar a 3 entidades</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalFinancial;