import {
  ArrowRight,
  Building2,
  Calendar,
  CircleCheckBig,
  Clock,
  FileText,
  LucideArrowUpRight,
  TriangleAlert,
  Users,
  Zap,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

export function PanelPrincipal() {
  const { t } = useLanguage();
  const stats = {
    totalAssets: 5,
  };
  return (
    <div className="space-y-6">
      {/* Layout Principal */}
      {/* 4 KPIs superiores */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                {t("Total Buildings", "Total Edificios")}
              </p>
              <p className="text-2xl mb-0.5">{stats.totalAssets}</p>
              <div className="flex items-center gap-0.5 text-xs text-green-600">
                <LucideArrowUpRight className="w-3 h-3"></LucideArrowUpRight>
                <span>+2 este mes</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600"></Building2>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                {t("Compliance", "Cumplimiento")}
              </p>
              <p className="text-2xl mb-0.5">{stats.totalAssets}%</p>
              <div className="flex items-center gap-0.5 text-xs text-green-600">
                <LucideArrowUpRight className="w-3 h-3"></LucideArrowUpRight>
                <span>+5% vs. anterior</span>
              </div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CircleCheckBig className="w-5 h-5 text-green-600"></CircleCheckBig>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                {t("Pending Alerts", "Alertas Pendientes")}
              </p>
              <p className="text-2xl mb-0.5">{stats.totalAssets}</p>
              <div className="flex items-center gap-0.5 text-xs text-red-600">
                <LucideArrowUpRight className="w-3 h-3"></LucideArrowUpRight>
                <span>3 urgentes</span>
              </div>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <TriangleAlert className="w-5 h-5 text-orange-600"></TriangleAlert>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">
                {t("Completed Books", "Libros Completos")}
              </p>
              <p className="text-2xl mb-0.5">{stats.totalAssets}</p>
              <div className="flex items-center gap-0.5 text-xs text-blue-600">
                <span>58% completado</span>
              </div>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600"></FileText>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque KPIs inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-3 min-h-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm">Alertas Urgentes</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                Ver todas
              </button>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-100 rounded">
                <div className="p-1.5 bg-red-100 rounded flex-shrink-0">
                  <TriangleAlert className="w-4 h-4 text-red-600"></TriangleAlert>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs mb-0.5">
                        Inspección de ascensores vence en 5 días
                      </p>
                      <p className="text-xs text-gray-600">
                        Plaza Shopping - Requiere acción
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded flex-shrink-0">
                      URGENTE
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-100 rounded">
                <div className="p-1.5 bg-orange-100 rounded flex-shrink-0">
                  <Clock className="w-4 h-4 text-orange-600"></Clock>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs mb-0.5">
                        Mantenimiento HVAC programado
                      </p>
                      <p className="text-xs text-gray-600">
                        Edificio Central - 15/11/2025
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-orange-600 text-white rounded flex-shrink-0">
                      PRÓXIMO
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-100 rounded">
                <div className="p-1.5 bg-yellow-100 rounded flex-shrink-0">
                  <FileText className="w-4 h-4 text-yellow-600"></FileText>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs mb-0.5">
                        Certificado energético por renovar
                      </p>
                      <p className="text-xs text-gray-600">
                        Torre Norte - Vence en 60 días
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-yellow-600 text-white rounded flex-shrink-0">
                      PENDIENTE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 className="text-sm">Rendimiento por Edificio</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                Ver todas
              </button>
            </div>
            <div className="p-3 overflow-y-auto" style={{ maxHeight: "320px" }}>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Plaza Shopping</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Comercial
                      </span>
                    </div>
                    <span className="text-xs">89%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "89%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Torre Norte</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Residencial
                      </span>
                    </div>
                    <span className="text-xs">92%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Edificio Central</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Mixto
                      </span>
                    </div>
                    <span className="text-xs">76%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "76%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Residencial Vista Alegre</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Residencial
                      </span>
                    </div>
                    <span className="text-xs">95%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">
                        Oficinas Parque Empresarial
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Comercial
                      </span>
                    </div>
                    <span className="text-xs">98%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "98%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Edificio Sol</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Residencial
                      </span>
                    </div>
                    <span className="text-xs">58%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "58%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Torre Empresarial Azca</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Comercial
                      </span>
                    </div>
                    <span className="text-xs">45%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">
                        Residencial Jardines del Sur
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Residencial
                      </span>
                    </div>
                    <span className="text-xs">100%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">
                        Centro Comercial Gran Vía Plaza
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Comercial
                      </span>
                    </div>
                    <span className="text-xs">72%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Edificio Retiro</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Mixto
                      </span>
                    </div>
                    <span className="text-xs">86%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "86%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Residencial Parque Norte</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Residencial
                      </span>
                    </div>
                    <span className="text-xs">69%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "69%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">Business Hub Pozuelo</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        Comercial
                      </span>
                    </div>
                    <span className="text-xs">100%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 min-h-0">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-3 text-white flex-shrink-0">
            <h3 className="text-sm mb-2 opacity-90">Resumen del Sistema</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-blue-400/30">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 opacity-80"></Zap>
                  <span className="text-xs">Eficiencia Energética</span>
                </div>
                <span className="text-sm">A</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-blue-400/30">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 opacity-80"></Users>
                  <span className="text-xs">Ocupación Media</span>
                </div>
                <span className="text-sm">95%</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-blue-400/30">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 opacity-80"></FileText>
                  <span className="text-xs">Docs. Pendientes</span>
                </div>
                <span className="text-sm">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 opacity-80"></Calendar>
                  <span className="text-xs">Próximos eventos</span>
                </div>
                <span className="text-sm">12</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
            <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-sm">Actividad Reciente</h3>
            </div>
            <div className="p-3 flex-1 overflow-auto">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-blue-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs mb-0.5">
                      Certificado energético actualizado
                    </p>
                    <p className="text-xs text-gray-500">Plaza Shopping</p>
                    <p className="text-xs text-gray-400 mt-0.5">Hace 2h</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-green-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs mb-0.5">Mantenimiento completado</p>
                    <p className="text-xs text-gray-500">Torre Norte</p>
                    <p className="text-xs text-gray-400 mt-0.5">Hace 5h</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-orange-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs mb-0.5">Nueva alerta generada</p>
                    <p className="text-xs text-gray-500">Edificio Central</p>
                    <p className="text-xs text-gray-400 mt-0.5">Hace 1d</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
            <div className="px-3 py-2 border-b border-gray-100">
              <h3 className="text-sm">Acciones Rápidas</h3>
            </div>
            <div className="p-3 space-y-1.5">
              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors border border-gray-200 group">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-blue-600"></Building2>
                  <span className="text-xs text-gray-900">Nuevo Edificio</span>
                </div>

                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors"></ArrowRight>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors border border-gray-200 group">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-blue-600"></FileText>
                  <span className="text-xs text-gray-900">Generar Informe</span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors"></ArrowRight>
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors border border-gray-200 group">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600"></Calendar>
                  <span className="text-xs text-gray-900">
                    Programar Inspección
                  </span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors"></ArrowRight>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
