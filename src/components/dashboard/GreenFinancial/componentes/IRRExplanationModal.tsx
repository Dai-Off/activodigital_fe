import { TrendingUp, Info, DollarSign, PieChart, ArrowUpRight, AlertCircle, Calendar, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import ModalFrame from "./ModalFrame";

interface IRRExplanationModalProps {
  active: boolean;
  onClose: () => void;
}

const IRRExplanationModal: React.FC<IRRExplanationModalProps> = ({ active, onClose }) => {
  return (
    <ModalFrame
      active={active}
      onClose={onClose}
      title="Metodología de Cálculo: TIR (Internal Rate of Return)"
      subtitle="Explicación financiera para el análisis de inversión a 5 años"
      icon={<TrendingUp className="w-4 h-4 text-white" />}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-gray-800">
        {/* Introducción */}
        <section className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              La <strong>TIR (Tasa Interna de Retorno)</strong> representa la rentabilidad anualizada esperada de la inversión. 
              El sistema utiliza un modelo de <strong>Flujos de Caja Descontados (DCF)</strong> a un horizonte de 5 años.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lógica Segmentada */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
              <Calendar className="w-4 h-4 text-purple-700" />
              1. Horizonte Temporal
            </h3>
            <p className="text-xs">
              Se proyectan flujos de caja durante <strong>5 años</strong>, considerando la operación anual y un evento final de desinversión o revalorización en el quinto año.
            </p>

            <h3 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2 pt-2">
              <PieChart className="w-4 h-4 text-purple-700" />
              2. Flujo Operativo (NOI)
            </h3>
            <p className="text-xs">
              Calculado como <strong>Ingresos Brutos - OPEX</strong>. El sistema utiliza los datos cargados en el Snapshot Financiero para determinar el flujo neto anual que genera el edificio.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
              <ArrowUpRight className="w-4 h-4 text-green-700" />
              3. Evento de Salida
            </h3>
            <p className="text-xs">
              En el Año 5 se suma el valor de reventa. Este se calcula aplicando un <strong>Exit Cap Rate</strong> sobre el NOI o mediante una tasa de revalorización anual sobre el valor total invertido.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2 text-blue-900 font-semibold mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Inversión Inicial (Año 0)</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-tight">
                Se computa como la suma del <strong>Precio de Adquisición</strong> más el <strong>CAPEX de Rehabilitación</strong> estimado. Toda la inversión se considera desembolsada al inicio del proyecto.
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de Inputs */}
        <div className="pt-2">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Variables Clave del Modelo</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="p-2 border">Variable</th>
                  <th className="p-2 border">Origen de Datos</th>
                  <th className="p-2 border">Impacto Financiero</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border font-medium">Capex de Rehabilitación</td>
                  <td className="p-2 border">Presupuesto Técnico</td>
                  <td className="p-2 border">Reduce flujo inicial (TIR) pero aumenta valor de salida.</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 border font-medium">Deuda / Apalancamiento</td>
                  <td className="p-2 border">Snapshot Financiero</td>
                  <td className="p-2 border">Permite calcular la TIR del Equity (Levered IRR).</td>
                </tr>
                <tr>
                  <td className="p-2 border font-medium">Exit Cap Rate</td>
                  <td className="p-2 border">Mercado / Tipo de Activo</td>
                  <td className="p-2 border">Determina el valor de perpetuidad al final del ciclo.</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 border font-medium">Crecimiento de Rentas</td>
                  <td className="p-2 border">Cláusulas de Indexación</td>
                  <td className="p-2 border">Mejora el NOI proyectado año a año.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mensaje de Error */}
        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-amber-800">
            Si el activo no cuenta con <strong>Precio de Adquisición</strong> o <strong>Ingresos Brutos</strong>, el sistema no podrá realizar la proyección y mostrará el aviso de "Falta INFO financiera".
          </p>
        </div>
        {/* Nota Calculadora Personalizada */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mt-4">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-900">
              ¿Deseas realizar un análisis más profundo? Puedes utilizar nuestra{" "}
              <Link 
                to="/cfo-simulation" 
                className="font-bold underline cursor-pointer hover:text-blue-700 transition-colors"
                onClick={onClose}
              >
                Calculadora Financiera
              </Link>{" "}
              para modelar escenarios personalizados y ajustar cada variable de tu inversión.
            </p>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
};

export default IRRExplanationModal;
