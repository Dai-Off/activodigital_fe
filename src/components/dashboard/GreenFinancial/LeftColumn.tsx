import React from "react";
import { ShieldIcon, RecycleIcon, WindIcon, DropletIcon, ShieldIcon as ShieldIcon2, AwardIcon, WrenchIcon, CircleQuestionMarkIcon } from "lucide-react";
import DNSHItem from "./DNSHItem";
import DesgloseCostRehabilit from "./componentes/DesgloseCostRehabilit"; // tu componente existente
import DesgloseGreenPremium from "./componentes/DesgloseGreenPremium"; // tu componente existente
import { Button } from "~/components/ui/button";

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

interface Props {
  cardBase: string;
  showSection: SectionI;
  setShowSection: React.Dispatch<React.SetStateAction<SectionI>>;
  showDNSH: DNSHInterface;
  setShowDNSH: React.Dispatch<React.SetStateAction<DNSHInterface>>;
}

const LeftColumn: React.FC<Props> = ({
  cardBase,
  showSection,
  setShowSection,
  showDNSH,
  setShowDNSH,
}) => {
  return (
    <>
      <div id="taxonomia-ue" className={`${cardBase} relative tooltip-container min-h-[320px] flex flex-col`}>
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
                <p className="text-xs text-gray-700">Tu edificio alcanza <strong>92% de alineación</strong>.</p>
              </div>
            </div>

            <Button
              onClick={() => setShowSection((prev) => ({ ...prev, validationInfo: !showSection?.validationInfo }))}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex-shrink-0"
            >
              {showSection?.validationInfo ? "Menos info...": "Más información"}
            </Button>
          </div>

          {showSection?.validationInfo && (
            <div className="mt-5 pt-5 border-t-2 border-green-200 space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-green-900 mb-2">¿Por qué estás al 92%?</h5>
                <p className="text-xs text-gray-700 leading-relaxed">
                  La Taxonomía UE es el sistema de clasificación más riguroso ... (texto resumido para ejemplo)
                </p>
              </div>

              <div className="space-y-2">
                {/* DNSH list */}
                <div className="text-xs font-semibold text-gray-800 mb-2">DNSH - No Causar Daño Significativo (6 criterios):</div>

                <DNSHItem
                  icon={<DropletIcon className="w-5 h-5 text-blue-600" />}
                  title="Uso Sostenible del Agua"
                  short="Instalación de sistemas de bajo consumo de agua"
                  expandedText="Criterio DNSH: Instalación de sistemas de bajo consumo (sanitarios, grifería) y recuperación aguas pluviales..."
                  isOpen={showDNSH.useWater}
                  onToggle={() => setShowDNSH((p) => ({ ...p, useWater: !p.useWater }))}
                />

                <DNSHItem
                  icon={<RecycleIcon className="w-5 h-5 text-green-600" />}
                  title="Economía Circular"
                  short="Plan de gestión de residuos conforme RD 105/2008"
                  expandedText="Criterio DNSH: Plan de Gestión de Residuos construcción con >70% reciclado..."
                  isOpen={showDNSH.economyCircly}
                  onToggle={() => setShowDNSH((p) => ({ ...p, economyCircly: !p.economyCircly }))}
                />

                <DNSHItem
                  icon={<WindIcon className="w-5 h-5 text-purple-600" />}
                  title="Prevención de la Polución"
                  short="Materiales sin sustancias peligrosas"
                  expandedText="Criterio DNSH: Ausencia de amianto y materiales peligrosos..."
                  isOpen={showDNSH.polution}
                  onToggle={() => setShowDNSH((p) => ({ ...p, polution: !p.polution }))}
                />

                <DNSHItem
                  icon={<DropletIcon className="w-5 h-5 text-green-700" />}
                  title="Biodiversidad y Ecosistemas"
                  short="Edificio urbano, no afecta hábitats protegidos"
                  expandedText="Criterio DNSH: Ubicación fuera de zonas Natura 2000..."
                  isOpen={showDNSH.biodiversity}
                  onToggle={() => setShowDNSH((p) => ({ ...p, biodiversity: !p.biodiversity }))}
                />

                <DNSHItem
                  icon={<ShieldIcon2 className="w-5 h-5 text-blue-700" />}
                  title="Adaptación al Cambio Climático"
                  short="Análisis de riesgos climáticos realizado"
                  expandedText="Criterio DNSH: Análisis de riesgos climáticos físicos..."
                  isOpen={showDNSH.adaptation}
                  onToggle={() => setShowDNSH((p) => ({ ...p, adaptation: !p.adaptation }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Subvenciones */}
        <div className={`${cardBase}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <AwardIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg text-[#1e3a8a]">Subvenciones y Ayudas Públicas</h3>
                <p className="text-sm text-gray-600">Total máximo financiable: <strong className="text-purple-600">1.33M€</strong></p>
              </div>
            </div>

            <Button onClick={() => setShowSection((prev) => ({ ...prev, showHelpers: true }))} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg">
              Ver Todas las Ayudas (6)
            </Button>
          </div>
        </div>

        {/* Costes */}
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

            <Button onClick={() => setShowSection((prev) => ({ ...prev, showCostes: !showSection?.showCostes }))} className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg">
              {showSection?.showCostes ? "Ocultar" : "Ver Desglose"}
            </Button>
          </div>

          {showSection?.showCostes && <DesgloseCostRehabilit />}
        </div>

        {/* Green Premium */}
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

            <Button onClick={() => setShowSection((prev) => ({ ...prev, showGreenPremium: !showSection?.showGreenPremium }))} className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg">
              {showSection?.showGreenPremium ? "Ocultar" : "Ver Desglose"}
            </Button>
          </div>

          {showSection?.showGreenPremium && <DesgloseGreenPremium />}
        </div>
    </>
  );
};

export default LeftColumn;
