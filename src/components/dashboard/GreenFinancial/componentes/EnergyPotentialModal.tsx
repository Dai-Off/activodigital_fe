import React from "react";
import { Zap, Info, MapPin, Building2, TrendingUp, AlertCircle } from "lucide-react";
import ModalFrame from "./ModalFrame";

interface EnergyPotentialModalProps {
  active: boolean;
  onClose: () => void;
}

const EnergyPotentialModal: React.FC<EnergyPotentialModalProps> = ({ active, onClose }) => {
  return (
    <ModalFrame
      active={active}
      onClose={onClose}
      title="Metodología de Cálculo: Potencial Energético"
      subtitle="Explicación técnica basada en la normativa EPBD y CTE (España)"
      icon={<Zap className="w-4 h-4 text-white" />}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-gray-800">
        {/* Introducción */}
        <section className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              El sistema realiza una estimación técnica del potencial de mejora basándose en 
              <strong> umbrales estáticos promediados</strong> del Código Técnico de la Edificación (CTE DB-HE). 
              Esta herramienta proporciona una primera aproximación institucional para evaluar la revalorización de activos.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lógica Segmentada */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
              <MapPin className="w-4 h-4 text-blue-700" />
              1. Factores Ambientales
            </h3>
            <p className="text-xs">
              La calificación no depende solo del edificio, sino de su ubicación. Se identifica la 
              <strong> severidad climática de invierno (A-E)</strong> según la provincia. Los umbrales para una "A" 
              son más exigentes en climas fríos (E) que en cálidos (A).
            </p>

            <h3 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2 pt-2">
              <Building2 className="w-4 h-4 text-blue-700" />
              2. Uso y Tipología
            </h3>
            <p className="text-xs">
              Se aplican escalas diferenciadas para edificios <strong>Residenciales</strong> y del sector 
              <strong>Terciario</strong> (Oficinas, Comercial, Mixto), ajustándose a los patrones de consumo energético de cada uso.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
              <TrendingUp className="w-4 h-4 text-green-700" />
              3. Cálculo del Consumo
            </h3>
            <p className="text-xs">
              Se toma el consumo actual de Energía Primaria No Renovable y se proyecta la mejora:
              <br />
              <code className="bg-gray-100 px-1 py-0.5 rounded mt-1 inline-block">Nuevo Consumo = Consumo Actual * (1 - %Ahorro / 100)</code>
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex gap-2 text-amber-900 font-semibold mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Importante: Simulación de Ahorro</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                Si no se ha cargado un estudio específico de ahorro en el <strong>Snapshot Financiero</strong>, 
                el sistema aplica automáticamente un <strong>30% de ahorro estándar</strong> por defecto para la simulación inicial.
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de Datos */}
        <div className="pt-2">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Fuentes de Información</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="p-2 border">Dato de Entrada</th>
                  <th className="p-2 border">Origen Profesional</th>
                  <th className="p-2 border">Acción del Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border font-medium">Consumo Actual</td>
                  <td className="p-2 border">Certificado de Eficiencia Energética</td>
                  <td className="p-2 border">Extrae el valor en kWh/m²·año cargado.</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 border font-medium">Ubicación</td>
                  <td className="p-2 border">Provincia del Activo</td>
                  <td className="p-2 border">Define la Zona Climática según el CTE.</td>
                </tr>
                <tr>
                  <td className="p-2 border font-medium">Tipología de Uso</td>
                  <td className="p-2 border">Catastro / Registro Propiedad</td>
                  <td className="p-2 border">Asigna la escala Residencial o Terciaria.</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 border font-medium">Objetivo de Ahorro</td>
                  <td className="p-2 border">Auditoría o Valor Estándar (30%)</td>
                  <td className="p-2 border">Calcula el nuevo umbral letra tras ahorro.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie del contenido */}
        <p className="text-[10px] text-gray-500 italic pt-2">
          * Nota: Mejoras inferiores al 5% no se consideran significativas para un cambio de letra en esta simulación.
        </p>
      </div>
    </ModalFrame>
  );
};

export default EnergyPotentialModal;
