import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CircleCheckBig,
  CircleHelp,
  FileText,
  Lightbulb,
  Scale,
  Sparkles,
  TriangleAlert,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import BuildingRegulatoryAuditSkeleton from "./BuildingRegulatoryAuditSkeleton";
import { regulatoryAuditApi } from "../services/regulatoryAudit";
import { type RegulatoryAuditResult } from "../types/regulatoryAudit";

export default function BuildingRegulatoryAudit() {
  const { id: buildingId } = useParams<{ id: string }>();
  const [data, setData] = useState<RegulatoryAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!buildingId) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await regulatoryAuditApi.getRegulatoryAudit(buildingId);
        setData(result);
      } catch (err) {
        console.error("Error fetching regulatory audit:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [buildingId]);

  if (isLoading || !data) {
    return <BuildingRegulatoryAuditSkeleton />;
  }

  const { current_state, target_state, gap_analysis, mevs, certificates, normatives, summary } =
    data;

  return (
    <div className="h-full flex flex-col gap-3 md:gap-4">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 md:p-6 text-white shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 bg-white/20 rounded-xl flex-shrink-0">
            <Scale className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl truncate">
              Auditoría Regulatoria
            </h1>
            <p className="text-xs md:text-sm text-purple-100 hidden sm:block truncate">
              Cumplimiento Directiva EPBD y Certificación Energética Europea
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
              <CircleCheckBig
                className="w-4 h-4 md:w-6 md:h-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Normativas
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">
            {summary.normatives_compliant}/{summary.normatives_total}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Cumplidas
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
              <Sparkles
                className="w-4 h-4 md:w-6 md:h-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                MEVs
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">
            {summary.mevs_implemented}/{summary.mevs_total}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Implementadas
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg">
              <FileText
                className="w-4 h-4 md:w-6 md:h-6 text-purple-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Certificados
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">
            {summary.certificates_active}/{summary.certificates_total}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
            Vigentes
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-5 hover:shadow-md transition-all">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg">
              <TriangleAlert
                className="w-4 h-4 md:w-6 md:h-6 text-orange-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm text-gray-600 truncate">
                Auditorías
              </span>
            </div>
          </div>
          <div className="text-lg md:text-2xl text-gray-900">
            {summary.pending_audits_count}
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 truncate">
            {summary.pending_audits_text}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 flex-shrink-0">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full bg-white hover:bg-purple-100 border border-purple-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Ver explicación detallada del estado actual"
                aria-label="Ver explicación detallada del estado actual"
              >
                <CircleHelp
                  className="w-3 h-3 text-purple-600"
                  aria-hidden="true"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[60vw] w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0">
              <DialogHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 px-8 pt-6 pb-5 border-b">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                    <Scale className="w-5 h-5 text-purple-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="font-semibold text-lg">Estado Actual del Edificio</DialogTitle>
                    <DialogDescription className="text-xs text-gray-500 mt-1">Certificación Energética y Consumos Vigentes</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-8 py-5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm mb-2">¿Qué información proporciona esta sección?</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">Esta sección muestra la situación actual del edificio según su último certificado de eficiencia energética vigente. La certificación energética es un documento oficial que califica el consumo de energía y las emisiones de CO₂ del edificio en una escala de A (más eficiente) a G (menos eficiente).</p>
                  </div>
                  <div>
                    <h3 className="text-sm mb-3">Conceptos Clave Explicados</h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-600">1</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Clase Energética Actual</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">La clase energética del edificio se determina mediante una metodología oficial (CE3X, HULC o CERMA) que evalúa: envolvente térmica, sistemas de climatización, iluminación, agua caliente sanitaria y energías renovables. El certificado tiene validez de 10 años y es obligatorio para venta o alquiler de inmuebles según el Real Decreto 390/2021.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-600">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Consumo Energético (kWh/m²·año)</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Representa la energía primaria no renovable que consume el edificio anualmente por metro cuadrado construido. Incluye electricidad, gas natural, gasóleo y otras fuentes energéticas. Este valor se calcula mediante simulación energética que considera: características constructivas del edificio, instalaciones térmicas, zona climática, y orientación del inmueble.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-600">3</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Emisiones de CO₂ (kg CO₂eq/m²·año)</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Cantidad de dióxido de carbono equivalente emitido anualmente por metro cuadrado debido al consumo energético del edificio. Se calcula aplicando factores de emisión oficiales a cada fuente de energía utilizada. Las emisiones de CO₂ son el principal indicador de impacto ambiental del edificio y están directamente relacionadas con la contribución al cambio climático.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-600">4</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Origen de los Datos</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Los valores provienen del certificado de eficiencia energética vigente, emitido por técnico competente (arquitecto, ingeniero o técnico certificador). El certificado debe estar registrado en el organismo autonómico correspondiente y es verificable mediante el código alfanumérico único asignado. Los datos se actualizan cuando se realiza rehabilitación significativa o cada 10 años máximo.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg shadow-sm p-4 bg-gray-50 border-dashed border-2">
                    <h4 className="text-xs mb-2 flex items-center gap-2">
                      <Info className="w-3 h-3 text-gray-600" aria-hidden="true" />
                      Fuentes de Datos y Referencias Legales
                    </h4>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Certificado de eficiencia energética vigente registrado</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Real Decreto 390/2021 sobre procedimiento de certificación</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Facturas energéticas reales (electricidad y gas último año)</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Base de datos IDAE de factores de emisión de CO₂ por fuente</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-8 py-4 border-t flex-shrink-0 bg-gray-50">
                <DialogClose asChild>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border bg-background hover:bg-accent hover:text-accent-foreground py-2 px-6 h-9 text-xs">
                    Cerrar
                  </button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-sm md:text-base">Estado Actual</h3>
            <span className="px-2 md:px-3 py-1 rounded-full text-xs flex-shrink-0 bg-orange-100 text-orange-700">
              Clase {current_state.energy_class}
            </span>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Consumo energético:
              </div>
              <div className="text-lg md:text-xl">
                {current_state.consumption_kwh_m2_year || "--"} kWh/m
                <sup>2</sup>·año
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Emisiones CO₂:</div>
              <div className="text-lg md:text-xl">
                {current_state.emissions_kg_co2_m2_year || "--"} kg CO
                <sub>2</sub>eq/m<sup>2</sup>·año
              </div>
            </div>
            {current_state.heating_demand !== undefined && current_state.heating_demand !== null && (
              <div>
                <div className="text-xs text-gray-600 mb-1">Demanda Calefacción:</div>
                <div className="text-lg md:text-xl">
                  {current_state.heating_demand} kWh/m<sup>2</sup>·año
                </div>
              </div>
            )}
            {current_state.cooling_demand !== undefined && current_state.cooling_demand !== null && (
              <div>
                <div className="text-xs text-gray-600 mb-1">Demanda Refrigeración:</div>
                <div className="text-lg md:text-xl">
                  {current_state.cooling_demand} kWh/m<sup>2</sup>·año
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Ver explicación detallada de la Directiva EPBD 2030"
                aria-label="Ver explicación detallada de la Directiva EPBD 2030"
              >
                <CircleHelp className="w-3 h-3 text-blue-600" aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[60vw] w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0">
              <DialogHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 px-8 pt-6 pb-5 border-b">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                    <Scale className="w-5 h-5 text-purple-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="font-semibold text-lg">Directiva EPBD 2030 - Objetivo Obligatorio</DialogTitle>
                    <DialogDescription className="text-xs text-gray-500 mt-1">Requisitos de la Normativa Europea sobre Eficiencia Energética</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-8 py-5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm mb-2">¿Qué información proporciona esta sección?</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">La Directiva EPBD (Energy Performance of Buildings Directive) es la normativa europea que establece requisitos mínimos de eficiencia energética para edificios. La revisión de 2024 (Directiva UE 2024/1275) introduce objetivos obligatorios progresivos que todos los edificios no residenciales de la UE deben cumplir.</p>
                  </div>
                  <div>
                    <h3 className="text-sm mb-3">Conceptos Clave Explicados</h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-600">1</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">EPBD 2030: Clase D Mínima Obligatoria</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Todos los edificios no residenciales (oficinas, comercios, hoteles, etc.) deberán alcanzar mínimo clase D para el 31 de diciembre de 2029. Edificios que no cumplan tendrán: prohibición de nuevos contratos de alquiler o venta, imposibilidad de refinanciación bancaria, pérdida de seguros estándar, y sanciones administrativas de 300-6.000€ según Ley 8/2013. Es el deadline crítico más inmediato.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-600">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Consumo Objetivo: ≤65 kWh/m²·año</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Para alcanzar clase D, el consumo de energía primaria no renovable debe reducirse hasta máximo 65 kWh/m²·año (puede variar ligeramente según zona climática). Este objetivo implica mejoras en: aislamiento térmico de fachadas y cubiertas, sustitución de ventanas ineficientes, renovación de sistemas de climatización, e instalación de equipos eficientes de iluminación y ACS.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-600">3</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Emisiones Objetivo: ≤12 kg CO₂eq/m²·año</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Límite máximo de emisiones de CO₂ equivalente para cumplir requisitos EPBD. Se logra mediante: reducción del consumo energético global, electrificación de instalaciones (sustitución gas/gasóleo por electricidad), instalación de energías renovables (fotovoltaica, solar térmica, aerotermia), y contratación de energía 100% renovable certificada con garantías de origen.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-600">4</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Calendario de Implementación Progresivo</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">EPBD 2027: prohibición clase F-G. EPBD 2030: clase D obligatoria. EPBD 2033: clase C recomendada. EPBD 2040: posible clase B obligatoria. EPBD 2050: neutralidad climática (clase A). Cada fase endurece requisitos progresivamente. Actuar temprano evita saturación de proveedores, aprovecha subvenciones limitadas temporalmente, y maximiza período de retorno de inversión.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg shadow-sm p-4 bg-gray-50 border-dashed border-2">
                    <h4 className="text-xs mb-2 flex items-center gap-2">
                      <Info className="w-3 h-3 text-gray-600" aria-hidden="true" />
                      Fuentes de Datos y Referencias Legales
                    </h4>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Directiva (UE) 2024/1275 del Parlamento Europeo y del Consejo</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Plan Nacional Integrado de Energía y Clima (PNIEC) 2021-2030</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Transposición española: Real Decreto 390/2021 (actualizado)</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Guías técnicas IDAE sobre implementación EPBD en España</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-8 py-4 border-t flex-shrink-0 bg-gray-50">
                <DialogClose asChild>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border bg-background hover:bg-accent hover:text-accent-foreground py-2 px-6 h-9 text-xs">
                    Cerrar
                  </button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <h3 className="text-sm md:text-base">
              Directiva EPBD 2030 Objetivo
            </h3>
            <span className="px-2 md:px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 flex-shrink-0">
              Objetivo {target_state.target_class}
            </span>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Consumo objetivo:
              </div>
              <div className="text-lg md:text-xl">
                {target_state.target_consumption} kWh/m<sup>2</sup>·año
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Emisiones objetivo:
              </div>
              <div className="text-lg md:text-xl">
                {target_state.target_emissions} kg CO<sub>2</sub>eq/m
                <sup>2</sup>·año
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto pr-1">
        <div className="space-y-2 md:space-y-3">
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full bg-white hover:bg-orange-100 border border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                title="Ver explicación detallada del análisis de brechas"
                aria-label="Ver explicación detallada del análisis de brechas"
              >
                <CircleHelp
                  className="w-3 h-3 text-orange-600"
                  aria-hidden="true"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[60vw] w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0">
              <DialogHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 px-8 pt-6 pb-5 border-b">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-50 border border-orange-200">
                    <Scale className="w-5 h-5 text-orange-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="font-semibold text-lg">Análisis de Brechas (Gap Analysis)</DialogTitle>
                    <DialogDescription className="text-xs text-gray-500 mt-1">Evaluación de la Distancia entre Situación Actual y Objetivo</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-8 py-5">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm mb-2">¿Qué información proporciona esta sección?</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">El análisis de brechas cuantifica la diferencia entre el estado actual del edificio y los requisitos EPBD 2030. Identifica exactamente cuánto debe reducirse el consumo energético y las emisiones de CO₂ para cumplir la normativa, permitiendo dimensionar las intervenciones necesarias y su coste asociado.</p>
                  </div>
                  <div>
                    <h3 className="text-sm mb-3">Conceptos Clave Explicados</h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-orange-600">1</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">¿Qué es el Gap de Consumo?</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Es la diferencia en kWh/m²·año entre el consumo actual del edificio y el objetivo EPBD. Por ejemplo, si el edificio consume 85 kWh/m²·año y el objetivo es 65, el gap es +20 kWh/m²·año que debe eliminarse. Un gap positivo indica incumplimiento y necesidad de actuación. Cada kWh/m²·año representa aproximadamente 1.2-1.5€/m²·año en coste energético y 0.25-0.30 kg CO₂/m²·año en emisiones.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-orange-600">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">¿Qué es el Gap de Emisiones?</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Diferencia en kg CO₂eq/m²·año entre las emisiones actuales y el límite EPBD. Si el edificio emite 16.74 kg/m² y el límite es 12, el gap es +4.74 kg/m². Este gap se reduce mediante: disminución del consumo energético global (mejoras de eficiencia), cambio de fuentes energéticas más limpias (electrificación), generación renovable in-situ (fotovoltaica), y contratación electricidad verde certificada.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-orange-600">3</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Barras de Progreso hacia Cumplimiento</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">Las barras visuales muestran el porcentaje de cumplimiento actual. Si la barra está al 76% (ejemplo: 65/85), significa que el edificio ya cumple el 76% del objetivo y falta un 24% para alcanzarlo. Cuanto más corta la brecha, menor es la inversión necesaria. Edificios con barra &gt;90% pueden cumplir con intervenciones ligeras (iluminación LED, optimización HVAC). Barras &lt;70% requieren rehabilitación profunda (envolvente, renovables).</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-orange-600">4</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs mb-1.5">Implicaciones del Gap Analysis</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">El gap determina: (1) Urgencia de actuación - gaps grandes requieren más tiempo de ejecución, (2) Presupuesto necesario - cada kWh/m² de reducción cuesta aprox. 80-120€/m² según medida, (3) Complejidad técnica - gaps &gt;30% suelen requerir actuación envolvente térmica, (4) Timeline de obra - rehabilitaciones complejas necesitan 12-18 meses. El análisis permite priorizar actuaciones con mejor ratio coste/reducción.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg shadow-sm p-4 bg-gray-50 border-dashed border-2">
                    <h4 className="text-xs mb-2 flex items-center gap-2">
                      <Info className="w-3 h-3 text-gray-600" aria-hidden="true" />
                      Fuentes de Datos y Referencias Legales
                    </h4>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Certificado energético actual vs. límites EPBD oficiales</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Simulación CE3X/HULC del edificio en estado actual</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Documento técnico "Estrategia a largo plazo" del Ministerio</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>Benchmarking con edificios similares que han alcanzado objetivos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-8 py-4 border-t flex-shrink-0 bg-gray-50">
                <DialogClose asChild>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border bg-background hover:bg-accent hover:text-accent-foreground py-2 px-6 h-9 text-xs">
                    Cerrar
                  </button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
            <h3 className="text-sm md:text-base mb-4">
              Análisis de Brechas (Gap Analysis)
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {gap_analysis.consumption_gap > 0 ? (
                      <TriangleAlert
                        className="w-4 h-4 text-orange-600"
                        aria-hidden="true"
                      />
                    ) : current_state.consumption_kwh_m2_year > 0 ? (
                      <CircleCheckBig
                        className="w-4 h-4 text-green-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <CircleHelp
                        className="w-4 h-4 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-xs">Consumo energético</span>
                  </div>
                  <span
                    className={`text-xs ${
                      gap_analysis.consumption_gap > 0
                        ? "text-orange-600"
                        : current_state.consumption_kwh_m2_year > 0
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {gap_analysis.consumption_gap > 0
                      ? `+${gap_analysis.consumption_gap}`
                      : current_state.consumption_kwh_m2_year > 0
                        ? "Cumple el objetivo"
                        : "Faltan datos"}{" "}
                    {gap_analysis.consumption_gap > 0 && "kWh/m²·año"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${gap_analysis.consumption_gap > 0 ? "bg-orange-500" : "bg-green-500"}`}
                    style={{
                      width: `${gap_analysis.consumption_progress_percent}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Actual: {current_state.consumption_kwh_m2_year || "--"}{" "}
                  kWh/m²·año → Objetivo: {target_state.target_consumption}{" "}
                  kWh/m²·año
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {gap_analysis.emissions_gap > 0 ? (
                      <TriangleAlert
                        className="w-4 h-4 text-orange-600"
                        aria-hidden="true"
                      />
                    ) : current_state.emissions_kg_co2_m2_year > 0 ? (
                      <CircleCheckBig
                        className="w-4 h-4 text-green-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <CircleHelp
                        className="w-4 h-4 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-xs">Emisiones de CO₂</span>
                  </div>
                  <span
                    className={`text-xs ${
                      gap_analysis.emissions_gap > 0
                        ? "text-orange-600"
                        : current_state.emissions_kg_co2_m2_year > 0
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {gap_analysis.emissions_gap > 0
                      ? `+${gap_analysis.emissions_gap}`
                      : current_state.emissions_kg_co2_m2_year > 0
                        ? "Cumple el objetivo"
                        : "Faltan datos"}{" "}
                    {gap_analysis.emissions_gap > 0 && "kg CO₂eq/m²·año"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${gap_analysis.emissions_gap > 0 ? "bg-orange-500" : "bg-green-500"}`}
                    style={{
                      width: `${gap_analysis.emissions_progress_percent}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Actual: {current_state.emissions_kg_co2_m2_year || "--"} kg
                  CO₂eq/m²·año → Objetivo: {target_state.target_emissions} kg
                  CO₂eq/m²·año
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full bg-white hover:bg-blue-100 border border-blue-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Ver explicación detallada de la normativa aplicable"
                  aria-label="Ver explicación detallada de la normativa aplicable"
                >
                  <CircleHelp className="w-3 h-3 text-blue-600" aria-hidden="true" />
                </button>
              </DialogTrigger>
              <DialogContent className="md:max-w-[60vw] w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="flex flex-col gap-2 text-center sm:text-left flex-shrink-0 px-8 pt-6 pb-5 border-b">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                      <Scale className="w-5 h-5 text-purple-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="font-semibold text-lg">Normativa Aplicable</DialogTitle>
                      <DialogDescription className="text-xs text-gray-500 mt-1">Marco Legal y Regulatorio de Eficiencia Energética de Edificios</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-8 py-5">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm mb-2">¿Qué información proporciona esta sección?</h3>
                      <p className="text-xs text-gray-700 leading-relaxed">Conjunto de directivas europeas, leyes nacionales, reales decretos y normas técnicas que establecen requisitos, procedimientos y sanciones relacionados con la eficiencia energética de edificios en España. El cumplimiento es obligatorio y verificable mediante inspecciones administrativas.</p>
                    </div>
                    <div>
                      <h3 className="text-sm mb-3">Conceptos Clave Explicados</h3>
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-purple-600">1</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs mb-1.5">Directiva (UE) 2024/1275 - EPBD IV (Refundición)</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Norma europea de máximo nivel que establece: (1) Objetivos obligatorios progresivos 2027/2030/2033, (2) Metodología común de certificación energética, (3) Requisitos mínimos de eficiencia para edificios nuevos y rehabilitados, (4) Estrategia de renovación de edificios a largo plazo, (5) Sistemas de inspección periódica de instalaciones térmicas. Los Estados miembros deben trasponerla a legislación nacional antes del 29 de mayo de 2026. España está en proceso de actualización del RD 390/2021.</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-purple-600">2</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs mb-1.5">Real Decreto 390/2021 (Certificación Energética)</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Normativa española que regula: (1) Procedimiento oficial de certificación (programas CE3X, HULC, CERMA), (2) Contenido mínimo del certificado y etiqueta energética, (3) Validez del certificado (10 años o hasta reforma significativa), (4) Obligación de exhibición en venta/alquiler, (5) Registro autonómico obligatorio, (6) Sanciones por incumplimiento (300-6.000€). Sustituye al anterior RD 235/2013 actualizando metodología y requisitos según EPBD.</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-purple-600">3</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs mb-1.5">Ley 7/2021 de Cambio Climático y Transición Energética</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Marco legal español para neutralidad climática 2050. Establece: (1) Reducción 23% emisiones GEI para 2030 (respecto 1990), (2) 42% energías renovables en consumo final 2030, (3) Renovación 300.000 viviendas/año hasta 2030, (4) Obligación de instalación renovables en edificios nuevos y reformas importantes, (5) Prohibición nuevas calderas combustibles fósiles desde 2040. Afecta directamente a edificios comerciales por objetivos sectoriales.</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-purple-600">4</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xs mb-1.5">Régimen Sancionador y Consecuencias Legales</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Incumplimientos sancionables según Ley 8/2013: (1) No tener certificado válido: 300-600€, (2) No exhibir etiqueta en venta/alquiler: 300-600€, (3) Falsedad datos certificado: 600-1.000€, (4) Ejercicio certificación sin habilitación: 1.000-6.000€. Adicionalmente desde 2027: (5) Operar edificio clase F-G: inhabilitación comercial, (6) No cumplir EPBD 2030: sanciones administrativas + responsabilidad penal administradores por incumplimiento normativo.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg shadow-sm p-4 bg-gray-50 border-dashed border-2">
                      <h4 className="text-xs mb-2 flex items-center gap-2">
                        <Info className="w-3 h-3 text-gray-600" aria-hidden="true" />
                        Fuentes de Datos y Referencias Legales
                      </h4>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span>Diario Oficial UE (DOUE) - Publicación Directiva 2024/1275</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span>Boletín Oficial del Estado (BOE) - RD 390/2021 y Ley 7/2021</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span>Portal IDAE: normativa actualizada y guías interpretación</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span>Jurisprudencia administrativa: sentencias sanciones por incumplimiento</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-8 py-4 border-t flex-shrink-0 bg-gray-50">
                  <DialogClose asChild>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border bg-background hover:bg-accent hover:text-accent-foreground py-2 px-6 h-9 text-xs">
                      Cerrar
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            <h3 className="text-sm md:text-base mb-3">Normativa Aplicable</h3>
            <div className="space-y-2">
              {normatives.filter((norm) => norm.status !== 'compliant').length > 0 ? (
                normatives
                  .filter((norm) => norm.status !== 'compliant')
                  .map((norm) => (
                    <div
                      key={norm.id}
                      className={`flex items-start gap-2 p-3 rounded-lg ${
                        norm.status === 'partial' ? 'bg-orange-50' : 'bg-red-50'
                      }`}
                    >
                      <TriangleAlert
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          norm.status === 'partial'
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <div
                          className={`text-xs font-semibold ${
                            norm.status === 'partial'
                              ? 'text-orange-900'
                              : 'text-red-900'
                          }`}
                        >
                          {norm.title}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            norm.status === 'partial'
                              ? 'text-orange-700'
                              : 'text-red-700'
                          }`}
                        >
                          {norm.description}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-100 translate-y-1">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <CircleCheckBig
                      className="w-5 h-5 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-green-900">
                      Excelente cumplimiento
                    </div>
                    <div className="text-[11px] text-green-700 mt-0.5">
                      El edificio cumple con toda la normativa aplicable actual
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 relative group">
            <h3 className="text-sm md:text-base mb-3 font-medium">
              Documentación Regulatoria Clave
            </h3>
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className={`flex items-start gap-2 p-3 rounded-lg border ${
                    cert.status === "valid"
                      ? "bg-green-50 border-green-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  {cert.status === "valid" ? (
                    <CircleCheckBig
                      className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <TriangleAlert
                      className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div
                        className={`text-xs font-semibold ${
                          cert.status === "valid"
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        {cert.title}
                      </div>
                      {cert.uploaded_at && (
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                          {new Date(cert.uploaded_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        cert.status === "valid"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {cert.description}
                    </div>
                    {cert.status === "missing" && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-[10px] py-0.5 px-1.5 bg-red-100 text-red-600 rounded">
                          Documento no detectado
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base">
                MEVs - Medidas de Eficiencia de Vivienda
              </h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                RD 390/2021
              </span>
            </div>
            <div className="space-y-3">
              {mevs.map((mev) => (
                <div
                  key={mev.id}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      {mev.status === "implementada" && (
                        <CircleCheckBig
                          className="w-4 h-4 text-green-600 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      {mev.status === "parcial" && (
                        <CircleCheckBig
                          className="w-4 h-4 text-orange-600 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      {mev.status === "no_implementada" && (
                        <TriangleAlert
                          className="w-4 h-4 text-red-600 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <div className="text-xs mb-1">
                          {mev.code}: {mev.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {mev.description}
                        </div>
                      </div>
                    </div>
                    {mev.status === "implementada" && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded whitespace-nowrap">
                        Implementada
                      </span>
                    )}
                    {mev.status === "parcial" && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded whitespace-nowrap">
                        Parcial
                      </span>
                    )}
                    {mev.status === "no_implementada" && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded whitespace-nowrap">
                        No implementada
                      </span>
                    )}
                  </div>
                  <div className="mt-2 bg-gray-50 rounded p-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-600">Estado actual</div>
                        <div
                          className={
                            mev.status === "implementada"
                              ? "text-green-600"
                              : mev.status === "parcial"
                                ? "text-orange-600"
                                : "text-red-600"
                          }
                        >
                          {mev.current_state}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">
                          {mev.status === "implementada"
                            ? "Ahorro logrado"
                            : "Ahorro potencial"}
                        </div>
                        <div>{mev.potential_savings} kWh/m²·año</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Reducción CO₂</div>
                        <div>{mev.potential_co2_reduction} kg/m²·año</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">
                    Implementadas
                  </div>
                  <div className="text-xl text-green-600">
                    {summary.mevs_implemented}
                  </div>
                  <div className="text-xs text-gray-500">
                    de {summary.mevs_total} MEVs
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="text-xs text-gray-600 mb-1">Parciales</div>
                  <div className="text-xl text-orange-600">
                    {summary.mevs_partial}
                  </div>
                  <div className="text-xs text-gray-500">Requieren mejora</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">Pendientes</div>
                  <div className="text-xl text-red-600">
                    {summary.mevs_pending}
                  </div>
                  <div className="text-xs text-gray-500">No implementadas</div>
                </div>
              </div>
              <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-900 mb-1">
                  Potencial de Mejora Total
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <div className="text-xs text-blue-700">
                      Ahorro energético posible
                    </div>
                    <div className="text-sm text-blue-900">
                      {summary.total_potential_savings}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-700">
                      Reducción CO₂ posible
                    </div>
                    <div className="text-sm text-blue-900">
                      {summary.total_potential_co2_reduction}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb
                className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1">
                <h4 className="text-sm text-purple-900 mb-2">
                  Recomendación IA - Cumplimiento Normativo
                </h4>
                <p className="text-xs text-purple-700 mb-3">
                  Para alcanzar los objetivos EPBD 2030, se requiere reducir el
                  consumo en {gap_analysis.consumption_gap} kWh/m²·año y las
                  emisiones en {gap_analysis.emissions_gap} kg CO₂eq/m²·año. Se
                  recomienda priorizar intervenciones en envolvente térmica y
                  sistemas HVAC según la auditoría técnica.
                </p>
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="text-xs text-purple-900 mb-2">
                    Acciones prioritarias:
                  </div>
                  <ul className="space-y-1 text-xs text-purple-700">
                    <li>• Realizar auditoría energética completa (IEE)</li>
                    <li>• Actualizar certificado energético antes de 2025</li>
                    <li>• Planificar inversiones en mejoras antes de 2027</li>
                    <li>
                      • Considerar financiación europea (PREE, NextGeneration
                      EU)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
