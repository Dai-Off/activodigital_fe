import {
    ChartColumnIcon,
    CircleAlertIcon,
    CircleCheckIcon,
    DownloadIcon,
    ExternalLinkIcon,
    InfoIcon
} from 'lucide-react';
import React from 'react';
import { useIsMobile } from '~/components/ui/use-mobile';

const DesgloseCostRehabilit: React.FC = () => {

    const isMobile = useIsMobile();

    const totalCoste = 1195905;
    const totalCosteFormatted = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(totalCoste);

    const categorias = [
        { nombre: 'Todas las categorías', partidas: 19, coste: 1196, porcentaje: 100, isTotal: true },
        { nombre: 'Envolvente Térmica', partidas: 3, coste: 359, porcentaje: 30.01 },
        { nombre: 'Instalaciones Térmicas', partidas: 3, coste: 229, porcentaje: 19.13 },
        { nombre: 'Energías Renovables', partidas: 3, coste: 225, porcentaje: 18.80 },
        { nombre: 'Gestión y Honorarios', partidas: 4, coste: 211, porcentaje: 17.64 },
        { nombre: 'Calidad Aire', partidas: 1, coste: 80, porcentaje: 6.67 },
        { nombre: 'Accesibilidad', partidas: 1, coste: 77, porcentaje: 6.43 },
        { nombre: 'Eficiencia Energética', partidas: 1, coste: 12, porcentaje: 1.00 },
        { nombre: 'Certificaciones', partidas: 3, coste: 4, porcentaje: 0.29 }
    ];

    const IconCircleCheck = (props: any) => <CircleCheckIcon className="w-4 h-4 text-green-600" {...props} />;
    const IconCircleAlert = (props: any) => <CircleAlertIcon className="w-4 h-4 text-orange-600" {...props} />;
    const IconCircleAlertRed = (props: any) => <CircleAlertIcon className="w-4 h-4 text-red-600" {...props} />;

    const partidas = [
        {
            nombre: 'SATE (Sistema Aislamiento Térmico Exterior) 12cm EPS', categoria: 'Envolvente Térmica', descripcion: 'IVE.050 - Trasdosado autoportante, sistema ETICS/SATE 12cm EPS c/revestimiento acrílico',
            medicion: 2450, unidad: 'm²', precioUnitario: 85.50, unidadPrecio: '/m²', total: 209475, fuente: 'GenPrecios', fiabilidad: 'Alta'
        },
        {
            nombre: 'Ventanas PVC doble acristalamiento 4/16/4 bajo emisivo', categoria: 'Envolvente Térmica', descripcion: 'FVC.010 - Ventana PVC perfil 70mm, Uw=1.4 W/m²K, vidrio 4/16/4 low-e',
            medicion: 320, unidad: 'm²', precioUnitario: 285.00, unidadPrecio: '/m²', total: 91200, fuente: 'CYPE', fiabilidad: 'Alta'
        },
        {
            nombre: 'Aislamiento cubierta XPS 10cm + impermeabilización', categoria: 'Envolvente Térmica', descripcion: 'QAN.020 - Aislamiento térmico cubierta XPS e=100mm + lámina asfáltica',
            medicion: 850, unidad: 'm²', precioUnitario: 68.50, unidadPrecio: '/m²', total: 58225, fuente: 'GenPrecios', fiabilidad: 'Alta'
        },
        {
            nombre: 'Sistema Aerotermia centralizado 150 kW (calefacción + ACS)', categoria: 'Instalaciones Térmicas', descripcion: 'IFI.040 - Bomba calor aire-agua aerotermia Daikin Altherma 3 (o equiv.) 150kW',
            medicion: 1, unidad: 'ud', precioUnitario: 145000.00, unidadPrecio: '/ud', total: 145000, fuente: 'Presupuesto', fiabilidad: 'Media'
        },
        {
            nombre: 'Radiadores baja temperatura aluminio con válvulas termostáticas', categoria: 'Instalaciones Térmicas', descripcion: 'IFC.010 - Radiador aluminio inyectado 600mm + válvula termostática Honeywell',
            medicion: 168, unidad: 'elemento', precioUnitario: 185.00, unidadPrecio: '/elemento', total: 31080, fuente: 'CYPE', fiabilidad: 'Alta'
        },
        {
            nombre: 'Red distribución calefacción PEX multicapa aislado', categoria: 'Instalaciones Térmicas', descripcion: 'IFT.010 - Tubería PEX-AL-PEX Ø20mm + aislamiento coquilla e=20mm',
            medicion: 1850, unidad: 'm', precioUnitario: 28.50, unidadPrecio: '/m', total: 52725, fuente: 'GenPrecios', fiabilidad: 'Media'
        },
        {
            nombre: 'Instalación fotovoltaica 120 kWp (300 paneles 400Wp)', categoria: 'Energías Renovables', descripcion: 'IEI.070 - Sistema FV 120kWp: paneles monocristalinos + inversores + estructura cubierta',
            medicion: 120, unidad: 'kWp', precioUnitario: 1150.00, unidadPrecio: '/kWp', total: 138000, fuente: 'Presupuesto', fiabilidad: 'Media'
        },
        {
            nombre: 'Sistema almacenamiento baterías litio 100 kWh', categoria: 'Energías Renovables', descripcion: 'IEI.090 - Baterías Li-ion modular 100kWh + sistema gestión energía (BMS)',
            medicion: 100, unidad: 'kWh', precioUnitario: 650.00, unidadPrecio: '/kWh', total: 65000, fuente: 'Presupuesto', fiabilidad: 'Baja'
        },
        {
            nombre: 'Apoyo solar térmica ACS - 45 m² captadores planos', categoria: 'Energías Renovables', descripcion: 'IFS.010 - Captador solar térmico plano + acumuladores + grupo hidráulico',
            medicion: 45, unidad: 'm²', precioUnitario: 485.00, unidadPrecio: '/m²', total: 21825, fuente: 'CYPE', fiabilidad: 'Alta'
        },
        {
            nombre: 'Renovación 2 ascensores con tecnología regenerativa', categoria: 'Accesibilidad', descripcion: 'EAS.010 - Ascensor eléctrico 6 personas con sistema regenerativo -30% consumo',
            medicion: 2, unidad: 'ud', precioUnitario: 38500.00, unidadPrecio: '/ud', total: 77000, fuente: 'Presupuesto', fiabilidad: 'Media'
        },
        {
            nombre: 'Renovación iluminación LED zonas comunes con sensores', categoria: 'Eficiencia Energética', descripcion: 'IEI.020 - Luminarias LED + sensores presencia + regulación daylight',
            medicion: 650, unidad: 'm²', precioUnitario: 18.50, unidadPrecio: '/m²', total: 12025, fuente: 'GenPrecios', fiabilidad: 'Alta'
        },
        {
            nombre: 'Sistema ventilación mecánica controlada (VMC) con recuperador calor', categoria: 'Calidad Aire', descripcion: 'IFV.010 - VMC doble flujo con recuperador entálpico 90% eficiencia',
            medicion: 28, unidad: 'vivienda', precioUnitario: 2850.00, unidadPrecio: '/vivienda', total: 79800, fuente: 'CYPE', fiabilidad: 'Media'
        },
        {
            nombre: 'Proyecto básico + ejecución + dirección obra', categoria: 'Gestión y Honorarios', descripcion: '6% sobre PEM - Arquitecto + aparejador',
            medicion: 1, unidad: '% PEM', precioUnitario: 78000.00, unidadPrecio: '/% PEM', total: 78000, fuente: 'Manual', fiabilidad: 'Alta'
        },
        {
            nombre: 'Licencias, tasas municipales, CEE, etc.', categoria: 'Gestión y Honorarios', descripcion: '~3.2% PEM - ICIO (bonif. 95%) + tasa urbanística + otros',
            medicion: 1, unidad: '% PEM', precioUnitario: 42000.00, unidadPrecio: '/% PEM', total: 42000, fuente: 'Manual', fiabilidad: 'Alta'
        },
        {
            nombre: 'Seguridad y salud + control calidad', categoria: 'Gestión y Honorarios', descripcion: '2% PEM - Coordinador SS + ensayos materiales',
            medicion: 1, unidad: '% PEM', precioUnitario: 26000.00, unidadPrecio: '/% PEM', total: 26000, fuente: 'Manual', fiabilidad: 'Alta'
        },
        {
            nombre: 'Imprevistos y contingencias', categoria: 'Gestión y Honorarios', descripcion: '5% PEM - Reserva para desviaciones',
            medicion: 1, unidad: '% PEM', precioUnitario: 65000.00, unidadPrecio: '/% PEM', total: 65000, fuente: 'Manual', fiabilidad: 'Media'
        },
        {
            nombre: 'Certificado Eficiencia Energética inicial', categoria: 'Certificaciones', descripcion: 'Técnico certificador homologado - Registro CCAA',
            medicion: 1, unidad: 'ud', precioUnitario: 850.00, unidadPrecio: '/ud', total: 850, fuente: 'Manual', fiabilidad: 'Alta'
        },
        {
            nombre: 'Certificado Eficiencia Energética final', categoria: 'Certificaciones', descripcion: 'CEE tras obras + visado + registro - Demuestra mejora ≥30%',
            medicion: 1, unidad: 'ud', precioUnitario: 1200.00, unidadPrecio: '/ud', total: 1200, fuente: 'Manual', fiabilidad: 'Alta'
        },
        {
            nombre: 'Informe ITE renovado post-obra', categoria: 'Certificaciones', descripcion: 'Inspección Técnica Edificios - Validez 5-10 años',
            medicion: 1, unidad: 'ud', precioUnitario: 1500.00, unidadPrecio: '/ud', total: 1500, fuente: 'Manual', fiabilidad: 'Alta'
        }
    ];

    const getFiabilidadComponent = (fiabilidad: string) => {
        let IconComponent = IconCircleCheck;
        let colorClass = "text-green-700";

        if (fiabilidad === "Media") {
            IconComponent = IconCircleAlert;
            colorClass = "text-orange-700";
        } else if (fiabilidad === "Baja") {
            IconComponent = IconCircleAlertRed;
            colorClass = "text-red-700";
        }

        return (
            <div className="flex items-center gap-1 justify-center">
                <IconComponent className={`w-4 h-4 ${colorClass}`}/>
                <span className={`text-xs ${colorClass}`}>{fiabilidad}</span>
            </div>
        );
    };

    return (
        <>
            <div className="border-t-2 border-gray-200 pt-6 space-y-4">

                {/* ------------------------------------------- */}
                {/*     HEADER ADAPTADO A MOBILE                */}
                {/* ------------------------------------------- */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">

                    <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex items-center justify-between mb-4'}`}>
                        <div>
                            <h2 className="text-2xl mb-1">Desglose de Costes Rehabilitación</h2>
                            <p className="text-sm text-blue-100">
                                Precios actualizados desde APIs de construcción profesionales
                            </p>
                        </div>

                        <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg">
                            <InfoIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Indicadores */}
                    <div className={`${isMobile ? 'grid grid-cols-1 gap-3 mt-4' : 'grid grid-cols-4 gap-4'}`}>
                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-xs text-blue-100 mb-1">Coste Total Obra</div>
                            <div className="text-3xl">1.20M€</div>
                            <div className="text-xs text-blue-200 mt-1">IVA incluido</div>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-xs text-blue-100 mb-1">PEM (Presupuesto)</div>
                            <div className="text-3xl">0.93M€</div>
                            <div className="text-xs text-blue-200 mt-1">Ejecución Material</div>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-xs text-blue-100 mb-1">Partidas</div>
                            <div className="text-3xl">19</div>
                            <div className="text-xs text-blue-200 mt-1">Total líneas</div>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                            <div className="text-xs text-blue-100 mb-1">Fuentes</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">CYPE</span>
                                <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">GenPrecios</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ------------------------------------------- */}
                {/*       CATEGORÍAS                             */}
                {/* ------------------------------------------- */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <h3 className="text-sm text-gray-900 mb-4">Distribución por Categorías</h3>

                    <div className="space-y-2">
                        {categorias.map((cat, i) => (
                            <button
                                key={i}
                                className={`w-full p-3 rounded-lg transition-all 
                                    ${cat.isTotal ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}
                                `}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {cat.isTotal && <ChartColumnIcon className="w-4 h-4 text-gray-600" />}
                                        <span className="text-sm text-gray-900">{cat.nombre}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-600">{cat.partidas} partidas</span>
                                        <span className="text-sm text-gray-900">{cat.coste}k€</span>
                                    </div>
                                </div>

                                {!cat.isTotal && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${cat.porcentaje}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-600 w-12 text-right">
                                            {cat.porcentaje.toFixed(1)}%
                                        </span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ------------------------------------------- */}
                {/*   TABLA / CARDS DE PARTIDAS (MOBILE OK)     */}
                {/* ------------------------------------------- */}
                <div className="bg-white rounded-xl shadow-sm">

                    {isMobile ? (
                        /* ----------- VISTA MÓVIL TIPO “CARDS” ----------- */
                        <div className="space-y-4 p-3">
                            {partidas.map((p, i) => {
                                const total = new Intl.NumberFormat('es-ES', {
                                    style: 'currency', currency: 'EUR', minimumFractionDigits: 0
                                }).format(p.total);

                                const unit = new Intl.NumberFormat('es-ES', {
                                    style: 'currency', currency: 'EUR'
                                }).format(p.precioUnitario);

                                return (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl shadow-sm">

                                        <div className="text-sm font-semibold text-gray-900">
                                            {p.nombre}
                                        </div>
                                        <div className="text-xs bg-gray-200 inline-block mt-1 px-2 py-1 rounded text-gray-700">
                                            {p.categoria}
                                        </div>

                                        <p className="text-xs text-gray-600 mt-2">
                                            {p.descripcion}
                                        </p>

                                        <div className="flex justify-between mt-3 text-sm">
                                            <span>{p.medicion} {p.unidad}</span>
                                            <span>{unit}/{p.unidadPrecio.replace('/', '')}</span>
                                        </div>

                                        <div className="flex justify-between mt-2">
                                            <span className="text-gray-600 text-sm">Total</span>
                                            <span className="text-sm font-semibold text-gray-900">{total}</span>
                                        </div>

                                        <div className="flex justify-between items-center mt-3">
                                            <span className={`px-2 py-1 rounded text-xs ${p.fuente === 'CYPE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : p.fuente === 'GenPrecios'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : p.fuente === 'Presupuesto'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {p.fuente}
                                            </span>

                                            {getFiabilidadComponent(p.fiabilidad)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* ----------- VISTA PC COMPLETA (TABLA) ---------- */
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs text-gray-600">Partida</th>
                                        <th className="px-4 py-3 text-center text-xs text-gray-600">Medición</th>
                                        <th className="px-4 py-3 text-right text-xs text-gray-600">Precio Unit.</th>
                                        <th className="px-4 py-3 text-right text-xs text-gray-600">Total</th>
                                        <th className="px-4 py-3 text-center text-xs text-gray-600">Fuente</th>
                                        <th className="px-4 py-3 text-center text-xs text-gray-600">Fiabilidad</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {partidas.map((p, i) => {
                                        const total = new Intl.NumberFormat('es-ES', {
                                            style: 'currency', currency: 'EUR', minimumFractionDigits: 0
                                        }).format(p.total);

                                        const unit = new Intl.NumberFormat('es-ES', {
                                            style: 'currency', currency: 'EUR'
                                        }).format(p.precioUnitario);

                                        return (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-900 mb-1">{p.nombre}</div>
                                                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 inline-block rounded">
                                                        {p.categoria}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 italic">{p.descripcion}</div>
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    <div className="text-sm">{p.medicion}</div>
                                                    <div className="text-xs text-gray-600">{p.unidad}</div>
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    <div className="text-sm">{unit}</div>
                                                    <div className="text-xs text-gray-600">{p.unidadPrecio}</div>
                                                </td>

                                                <td className="px-4 py-3 text-right text-sm text-gray-900">{total}</td>

                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs ${p.fuente === 'GenPrecios'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : p.fuente === 'CYPE'
                                                                ? 'bg-green-100 text-green-700'
                                                                : p.fuente === 'Presupuesto'
                                                                    ? 'bg-purple-100 text-purple-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {p.fuente}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    {getFiabilidadComponent(p.fiabilidad)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                                    <tr>
                                        <td colSpan={3} className="px-4 py-3 text-right text-sm"><strong>TOTAL :</strong></td>
                                        <td className="px-4 py-3 text-right text-sm"><strong>{totalCosteFormatted}</strong></td>
                                        <td colSpan={2}></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>

                {/* ------------------------------------------- */}
                {/*                FOOTER                        */}
                {/* ------------------------------------------- */}
                <div className={`bg-white rounded-xl shadow-sm p-4 flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
                    <div className="flex items-center gap-3 justify-center">
                        <a
                            href="https://www.generadordeprecios.info/"
                            target="_blank"
                            className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                        >
                            <ExternalLinkIcon className="w-3 h-3" /> Generador de Precios España
                        </a>

                        {!isMobile && <span className="text-gray-300">|</span>}

                        <a
                            href="https://www.cype.es/generadordeprecios/"
                            target="_blank"
                            className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                        >
                            <ExternalLinkIcon className="w-3 h-3" /> CYPE
                        </a>
                    </div>

                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Exportar Presupuesto (Excel)
                    </button>
                </div>

            </div>
        </>
    );
};

export default DesgloseCostRehabilit;
