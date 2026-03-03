import {
  TrendingUp,
  Info,
  DollarSign,
  PieChart,
  Target,
  AlertCircle,
  Calculator,
} from "lucide-react";
import { Link } from "react-router-dom";
import ModalFrame from "./ModalFrame";

interface CoCExplanationModalProps {
  active: boolean;
  onClose: () => void;
}

const CoCExplanationModal: React.FC<CoCExplanationModalProps> = ({
  active,
  onClose,
}) => {
  return (
    <ModalFrame
      active={active}
      onClose={onClose}
      title="Metodología de Cálculo: Cash on Cash y Equity Multiple"
      subtitle="Explicación financiera de la rentabilidad sobre los fondos propios"
      icon={<TrendingUp className="w-4 h-4 text-white" />}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-gray-800">
        {/* Introducción */}
        <section className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              El <strong>Cash on Cash (CoC)</strong> mide el rendimiento del
              flujo de caja de una inversión inmobiliaria respecto al efectivo
              total desembolsado de fondos propios (Equity).
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lógica Segmentada */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
              <PieChart className="w-4 h-4 text-emerald-700" />
              1. Cash on Cash Yield (Anual)
            </h3>
            <p className="text-xs">
              Muestra qué porcentaje en liquidez te rinde tu inversión cada año
              tras el pago del servicio de deuda.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2 text-blue-900 font-semibold mb-1">
                <Calculator className="w-4 h-4" />
                <span className="text-xs">Fórmula Cash on Cash Yield</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-tight">
                <strong>
                  (NOI - Servicio de Deuda Anual) / Equity Invertido
                </strong>
              </p>
            </div>

            <p className="text-xs">
              Donde el <em>Equity Invertido</em> es la Inversión Inicial (Precio
              + CAPEX) restando el importe financiado por Préstamo.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
              <Target className="w-4 h-4 text-emerald-700" />
              2. Equity Multiple (Multiplicador)
            </h3>
            <p className="text-xs">
              Refleja cuánto capital total (líquido) se recupera en proporción a
              los fondos propios invertidos a lo largo de 5 años.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2 text-blue-900 font-semibold mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Flujos de Caja Retenidos</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-tight">
                Se calcula acumulando todos los{" "}
                <strong>Flujos de Caja Netos Post-Deuda Positivos</strong>{" "}
                (incluida la venta final) y dividiendo sobre el{" "}
                <strong>Total de Salidas de Caja de Equity</strong>. Ej: 2.0x
                significa que doblas tu capital invertido inicialmente.
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-amber-800">
            Si no hay{" "}
            <strong>Flujo de Caja después del servicio de deuda</strong>, el
            Yield del Cash on Cash será <strong>0%</strong>. Si el proyecto se
            financia por completo (0 Equity), esta métrica perderá su validez
            natural.
          </p>
        </div>
      </div>
    </ModalFrame>
  );
};

export default CoCExplanationModal;
