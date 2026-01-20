import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Euro,
  FileText,
  House,
  User,
  Wrench,
  Activity,
  Plus,
  Upload,
  Building2,
  TrendingUp,
  Receipt,
  Droplet,
  CreditCard,
} from "lucide-react";
import { BuildingsApiService, type Building } from "../../services/buildingsApi";
import { UnitsApiService, type BuildingUnit } from "../../services/unitsApi";
import { SkeletonText, LightSkeleton } from "../ui/LoadingSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const UnitDetail: React.FC = () => {
  const { id: buildingId, unitId } = useParams<{
    id: string;
    unitId: string;
  }>();

  const [building, setBuilding] = useState<Building | null>(null);
  const [unit, setUnit] = useState<BuildingUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!buildingId || !unitId) return;
      setLoading(true);
      try {
        const [buildingData, units] = await Promise.all([
          BuildingsApiService.getBuildingById(buildingId),
          UnitsApiService.listUnits(buildingId),
        ]);
        setBuilding(buildingData);
        const found = (units || []).find((u) => u.id === unitId) || null;
        setUnit(found);
      } catch (error) {
        console.error("Error cargando detalle de unidad:", error);
        setUnit(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [buildingId, unitId]);

  const fullTitle = building
    ? `${building.name}${unit?.name ? ` - ${unit.name}` : ""}`
    : unit?.name || "Unidad";

  const statusLabel =
    unit?.status && unit.status.toLowerCase() === "ocupada"
      ? "Ocupado"
      : unit?.status && unit.status.toLowerCase() === "mantenimiento"
      ? "En Mantenimiento"
      : "Disponible";

  const statusColorClasses =
    statusLabel === "Ocupado"
      ? "bg-green-100 text-green-700"
      : statusLabel === "En Mantenimiento"
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header principal de la unidad */}
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-5 flex-shrink-0">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <House className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              {loading ? (
                <>
                  <SkeletonText
                    lines={1}
                    widths={["w-56"]}
                    className="mb-1"
                  />
                  <SkeletonText lines={1} widths={["w-40"]} />
                </>
              ) : (
                <>
                  <h1 className="text-lg md:text-2xl mb-0.5 text-gray-900">
                    {fullTitle}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500">
                    {unit ? (
                      <>
                        ID: {unit.identifier || unit.id}
                        {unit.floor && (
                          <>
                            {" "}
                            • Planta {unit.floor}
                          </>
                        )}
                      </>
                    ) : (
                      "Unidad no encontrada"
                    )}
                  </p>
                </>
              )}
            </div>
          </div>

          {!loading && unit && (
            <span
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium ${statusColorClasses}`}
            >
              {statusLabel}
            </span>
          )}
        </div>
      </div>

      {/* Tabs de secciones de la unidad */}
      <Tabs defaultValue="resumen" className="gap-2 flex-1 flex flex-col min-h-0 mt-3">
        <div className="bg-white rounded-lg shadow-sm flex-shrink-0">
          <TabsList className="flex w-full justify-start border-b border-gray-200 bg-transparent rounded-none h-auto p-0 text-muted-foreground overflow-x-auto">
            <TabsTrigger
              value="resumen"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <House className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger
              value="gestion"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <FileText className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">Gestión</span>
            </TabsTrigger>
            <TabsTrigger
              value="financiero"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <Euro className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">Financiero</span>
            </TabsTrigger>
            <TabsTrigger
              value="mantenimiento"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <Wrench className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">Mantenimiento</span>
            </TabsTrigger>
            <TabsTrigger
              value="actividad"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <Activity className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">Actividad</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenido pestaña Resumen */}
        <TabsContent
          value="resumen"
          className="flex-1 mt-3 outline-none"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Columna izquierda - skeletons de tarjetas principales */}
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText
                    lines={1}
                    widths={["w-32"]}
                    className="mb-4"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {[1, 2, 3, 4].map((i) => (
                      <SkeletonText
                        key={i}
                        lines={1}
                        widths={["w-24"]}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText
                    lines={1}
                    widths={["w-40"]}
                    className="mb-4"
                  />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <SkeletonText
                        key={i}
                        lines={1}
                        widths={["w-3/4"]}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText
                    lines={1}
                    widths={["w-32"]}
                    className="mb-4"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <LightSkeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna derecha - skeletons de paneles laterales */}
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText
                    lines={1}
                    widths={["w-40"]}
                    className="mb-3"
                  />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <LightSkeleton className="w-6 h-6 rounded-lg" />
                        <SkeletonText
                          lines={2}
                          widths={["w-32", "w-20"]}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText
                    lines={1}
                    widths={["w-32"]}
                    className="mb-3"
                  />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-2">
                        <LightSkeleton className="w-1.5 h-1.5 rounded-full mt-1.5" />
                        <SkeletonText
                          lines={2}
                          widths={["w-40", "w-24"]}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText
                    lines={1}
                    widths={["w-40"]}
                    className="mb-3"
                  />
                  <div className="p-3 border border-dashed border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <LightSkeleton className="w-6 h-6 rounded-lg" />
                      <div className="flex-1">
                        <SkeletonText
                          lines={2}
                          widths={["w-32", "w-20"]}
                        />
                      </div>
                      <LightSkeleton className="w-16 h-6 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Columna izquierda */}
              <div className="space-y-3">
                {/* Información básica */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <House className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm">Información básica</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="text-gray-900">
                        {unit?.useType || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Superficie</p>
                      <p className="text-gray-900">
                        {unit?.areaM2 ? `${unit.areaM2} m²` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Planta</p>
                      <p className="text-gray-900">{unit?.floor || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estado</p>
                      <p className="text-gray-900">{statusLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Inquilino & Contrato */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-sm">Inquilino &amp; contrato</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-xs text-gray-500">Inquilino:</span>
                      <span className="text-gray-900 text-right truncate max-w-[60%]">
                        {unit?.tenant || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-xs text-gray-500">Vencimiento:</span>
                      <span className="text-gray-900 text-right">
                        {unit?.rawData?.expirationDate || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-xs text-gray-500">Renta:</span>
                      <span className="text-lg text-green-600 text-right">
                        {unit?.rent != null
                          ? `€${unit.rent.toLocaleString()}`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resumen financiero */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm mb-3">Resumen financiero</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-xs text-gray-600">Renta mensual</p>
                      <p className="text-sm text-blue-600">
                        {unit?.rent != null
                          ? `€${unit.rent.toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-xs text-gray-600">Renta anual</p>
                      <p className="text-sm text-green-600">
                        {unit?.rent != null
                          ? `€${(unit.rent * 12).toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                    <div className="p-2 bg-cyan-50 rounded">
                      <p className="text-xs text-gray-600">Contadores/mes</p>
                      <p className="text-sm text-cyan-600">—</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-gray-600">Contadores/año</p>
                      <p className="text-sm text-purple-600">—</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-3">
                {/* Documentos principales */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm mb-3">Documentos principales</h3>
                  <div className="space-y-2 text-sm">
                    {/* Placeholder estático por ahora */}
                    {[
                      {
                        label: "Contrato arrendamiento",
                        color: "text-blue-600",
                        meta: "PDF • —",
                      },
                      {
                        label: "Certificado energético",
                        color: "text-green-600",
                        meta: "PDF • —",
                      },
                      {
                        label: "Inventario unidad",
                        color: "text-purple-600",
                        meta: "PDF • —",
                      },
                    ].map((doc) => (
                      <div
                        key={doc.label}
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <FileText
                          className={`w-4 h-4 flex-shrink-0 ${doc.color}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-900 truncate">
                            {doc.label}
                          </p>
                          <p className="text-xs text-gray-500">{doc.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actividad reciente */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm mb-3">Actividad reciente</h3>
                  <div className="space-y-2 text-xs">
                    {/* Placeholders por ahora */}
                    {[
                      {
                        color: "bg-blue-500",
                        title: "Pago renta recibido",
                        detail: "—",
                      },
                      {
                        color: "bg-green-500",
                        title: "Mantenimiento completado",
                        detail: "—",
                      },
                      {
                        color: "bg-orange-500",
                        title: "Reparación procesada",
                        detail: "—",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-2 p-2 bg-gray-50 rounded"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${item.color} mt-1.5 flex-shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900">{item.title}</p>
                          <p className="text-gray-500">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Próximo mantenimiento */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm mb-3">Próximo mantenimiento</h3>
                  <div className="p-2 border-2 border-yellow-200 bg-yellow-50 rounded">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-900">
                          Certificación gas anual
                        </p>
                        <p className="text-xs text-gray-500">—</p>
                      </div>
                      <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs flex-shrink-0">
                        Próximo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Pestañas restantes vacías por ahora */}
        <TabsContent
          value="gestion"
          className="flex-1 mt-3 outline-none"
        >
          {loading ? (
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
                <SkeletonText
                  lines={2}
                  widths={["w-48", "w-64"]}
                  className="mb-4"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <LightSkeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
                <SkeletonText
                  lines={1}
                  widths={["w-32"]}
                  className="mb-3"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <LightSkeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <SkeletonText
                    lines={1}
                    widths={["w-40"]}
                  />
                </div>
                <div className="flex-1 p-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <SkeletonText
                      key={i}
                      lines={1}
                      widths={["w-full"]}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Encabezado gestión diaria */}
              <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-lg mb-1 text-gray-900">
                      Gestión diaria de la unidad
                    </h2>
                    <p className="text-xs text-gray-500 truncate">
                      {building && unit
                        ? `${building.name} - ${unit.name || unit.identifier || "Unidad"}`
                        : "Sin información de unidad"}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-md font-medium transition-all border bg-white text-gray-700 hover:bg-gray-50 h-9 px-2 sm:px-3 text-xs cursor-not-allowed opacity-60 flex-1 sm:flex-none"
                      disabled
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Nueva categoría</span>
                      <span className="sm:hidden">Categoría</span>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-md font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white h-9 px-2 sm:px-3 text-xs cursor-not-allowed opacity-60 flex-1 sm:flex-none"
                      disabled
                    >
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Subir documento</span>
                      <span className="sm:hidden">Subir</span>
                    </button>
                  </div>
                </div>

                {/* Métricas de documentos (placeholders 0 hasta tener datos reales) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      Total documentos
                    </p>
                    <p className="text-blue-600 text-sm">0</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Activos</p>
                    <p className="text-green-600 text-sm">0</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Pendientes</p>
                    <p className="text-yellow-600 text-sm">0</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Por vencer</p>
                    <p className="text-purple-600 text-sm">0</p>
                  </div>
                </div>
              </div>

              {/* Categorías */}
              <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
                <h3 className="text-sm mb-3">Categorías</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {[
                    {
                      label: "Financiero",
                      color: "bg-blue-100",
                      Icon: Euro,
                    },
                    {
                      label: "Arrendamiento",
                      color: "bg-green-100",
                      Icon: FileText,
                    },
                    {
                      label: "Mantenimiento",
                      color: "bg-orange-100",
                      Icon: Wrench,
                    },
                    {
                      label: "Certificaciones",
                      color: "bg-purple-100",
                      Icon: FileText,
                    },
                    {
                      label: "Comunicaciones",
                      color: "bg-pink-100",
                      Icon: Building2,
                    },
                  ].map(({ label, color, Icon }) => (
                    <div key={label} className="relative group">
                      <button
                        type="button"
                        className="w-full p-3 rounded-lg border-2 transition-all text-left border-gray-200 hover:border-gray-300 bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${color}`}>
                            <Icon className="w-5 h-5 text-gray-700" />
                          </div>
                        </div>
                        <p className="text-xs mb-1">{label}</p>
                        <p className="text-xs text-gray-500">
                          Sin documentos todavía
                        </p>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista de documentos de la unidad */}
              <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex-shrink-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Documentos de la unidad
                    </p>
                    <p className="text-xs text-gray-500">0 documentos</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center max-w-md">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Aún no hay documentos asociados a esta unidad
                    </p>
                    <p className="text-xs text-gray-500">
                      Podrás gestionar aquí contratos, facturas, certificaciones y
                      otra documentación relevante en cuanto se suban archivos
                      desde el módulo de gestión.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="financiero"
          className="flex-1 mt-3 outline-none"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText lines={1} widths={["w-32"]} className="mb-3" />
                  <div className="space-y-3">
                    <SkeletonText lines={1} widths={["w-full"]} />
                    <SkeletonText lines={1} widths={["w-full"]} />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText lines={1} widths={["w-32"]} className="mb-3" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <SkeletonText key={i} lines={1} widths={["w-full"]} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Columna izquierda */}
              <div className="space-y-3">
                {/* Resumen Financiero */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm">Resumen Financiero</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Renta Mensual</p>
                        <p className="text-base sm:text-lg text-blue-900">
                          {unit?.rent != null
                            ? `€${unit.rent.toLocaleString()}`
                            : "€0"}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {unit?.rent != null && unit?.areaM2 != null
                            ? `€${(unit.rent / unit.areaM2).toFixed(2)}/m²`
                            : "—"}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 mb-1">Renta Anual</p>
                        <p className="text-base sm:text-lg text-green-900">
                          {unit?.rent != null
                            ? `€${(unit.rent * 12).toLocaleString()}`
                            : "€0"}
                        </p>
                        <p className="text-xs text-green-600 mt-1">12 mensualidades</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-600">Renta Base</p>
                        <p className="text-sm text-gray-900">
                          {unit?.rent != null
                            ? `€${unit.rent.toLocaleString()}`
                            : "€0"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-600">IVA (21%)</p>
                        <p className="text-sm text-gray-900">
                          {unit?.rent != null
                            ? `€${Math.round(unit.rent * 0.21).toLocaleString()}`
                            : "€0"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                        <p className="text-xs text-gray-900 font-medium">Total Mensual</p>
                        <p className="text-sm text-green-600 font-semibold">
                          {unit?.rent != null
                            ? `€${Math.round(unit.rent * 1.21).toLocaleString()}`
                            : "€0"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2 bg-purple-50 rounded border border-purple-200">
                        <p className="text-xs text-purple-700">Fianza (3 meses)</p>
                        <p className="text-sm text-purple-900">
                          {unit?.rent != null
                            ? `€${(unit.rent * 3).toLocaleString()}`
                            : "€0"}
                        </p>
                      </div>
                      <div className="p-2 bg-indigo-50 rounded border border-indigo-200">
                        <p className="text-xs text-indigo-700">Ingresos Anuales</p>
                        <p className="text-sm text-indigo-900">
                          {unit?.rent != null
                            ? `€${Math.round(unit.rent * 12 * 1.21).toLocaleString()}`
                            : "€0"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desglose de Rentas */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Receipt className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-sm">Desglose de Rentas</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <p className="text-xs text-gray-700">Renta base mensual</p>
                      <p className="text-sm text-blue-700">
                        {unit?.rent != null
                          ? `€${unit.rent.toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <p className="text-xs text-gray-700">IVA (21%)</p>
                      <p className="text-sm text-gray-700">
                        {unit?.rent != null
                          ? `€${Math.round(unit.rent * 0.21).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200">
                      <p className="text-xs font-medium text-gray-700">Renta con IVA</p>
                      <p className="text-sm font-semibold text-green-700">
                        {unit?.rent != null
                          ? `€${Math.round(unit.rent * 1.21).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <p className="text-xs text-gray-700">Renta anual</p>
                      <p className="text-sm text-purple-700">
                        {unit?.rent != null
                          ? `€${(unit.rent * 12).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-indigo-50 border border-indigo-200">
                      <p className="text-xs font-medium text-gray-700">Renta anual + IVA</p>
                      <p className="text-sm font-semibold text-indigo-700">
                        {unit?.rent != null
                          ? `€${Math.round(unit.rent * 12 * 1.21).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contadores y Suministros */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                    <div className="p-1.5 bg-cyan-100 rounded-lg">
                      <Droplet className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h3 className="text-sm">Contadores y Suministros</h3>
                  </div>
                  <div className="space-y-3">
                    {/* Agua */}
                    <div className="p-3 border border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplet className="w-4 h-4 text-cyan-700" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-cyan-900">Agua</p>
                            <p className="text-sm font-semibold text-cyan-700">—</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 pl-6">
                        <div className="flex justify-between text-xs text-cyan-700">
                          <span>N° Contador:</span>
                          <span className="font-medium">—</span>
                        </div>
                        <div className="flex justify-between text-xs text-cyan-700">
                          <span>Consumo:</span>
                          <span>—</span>
                        </div>
                        <div className="flex justify-between text-xs text-cyan-700">
                          <span>Última lectura:</span>
                          <span>—</span>
                        </div>
                        <div className="flex justify-between text-xs text-cyan-800 pt-1 border-t border-cyan-200">
                          <span className="font-medium">Coste anual:</span>
                          <span className="font-semibold">—</span>
                        </div>
                      </div>
                    </div>

                    {/* IBI */}
                    <div className="p-3 border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-purple-700" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-purple-900">IBI</p>
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                Sin datos
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-purple-700">—</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 pl-6">
                        <div className="flex justify-between text-xs text-purple-700">
                          <span>Cuota anual:</span>
                          <span className="font-medium">—</span>
                        </div>
                        <div className="flex justify-between text-xs text-purple-700">
                          <span>Vencimiento:</span>
                          <span>—</span>
                        </div>
                        <div className="flex justify-between text-xs text-purple-700">
                          <span>Último pago:</span>
                          <span>—</span>
                        </div>
                      </div>
                    </div>

                    {/* Tasa de Basuras */}
                    <div className="p-3 border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-amber-700" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-amber-900">Tasa de Basuras</p>
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                Sin datos
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-amber-700">—</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 pl-6">
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>Cuota anual:</span>
                          <span className="font-medium">—</span>
                        </div>
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>Vencimiento:</span>
                          <span>—</span>
                        </div>
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>Último pago:</span>
                          <span>—</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Costes Operativos */}
                    <div className="p-4 border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Euro className="w-5 h-5 text-green-700" />
                          <p className="text-sm font-semibold text-green-900">
                            Total Costes Operativos
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div className="text-center p-2 bg-white rounded border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Mensual</p>
                          <p className="text-base sm:text-lg font-semibold text-green-800">€0</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Anual</p>
                          <p className="text-base sm:text-lg font-semibold text-green-800">€0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-3">
                {/* Historial de Pagos */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <CreditCard className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-sm">Historial de Pagos</h3>
                  </div>
                  <div className="space-y-2">
                    {unit?.rent != null ? (
                      // Placeholder: mostrar mensaje cuando no hay pagos registrados
                      <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">
                          No hay pagos registrados todavía
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          El historial de pagos aparecerá aquí cuando se registren transacciones
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">
                          No hay información de renta disponible
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Análisis de Rentabilidad */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="text-sm">Análisis de Rentabilidad</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-xs text-indigo-700 mb-2">Ingresos Anuales</p>
                      <p className="text-lg font-semibold text-indigo-900">
                        {unit?.rent != null
                          ? `€${(unit.rent * 12).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs text-red-700 mb-2">Costes Operativos Anuales</p>
                      <p className="text-lg font-semibold text-red-900">€0</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-2 border-green-300">
                      <p className="text-xs text-green-700 mb-2">Beneficio Neto Anual</p>
                      <p className="text-xl font-semibold text-green-900">
                        {unit?.rent != null
                          ? `€${(unit.rent * 12).toLocaleString()}`
                          : "€0"}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {unit?.rent != null
                          ? "Margen: 100%"
                          : "Sin datos suficientes"}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-700 mb-2">Precio por m²</p>
                      <p className="text-lg font-semibold text-purple-900">
                        {unit?.rent != null && unit?.areaM2 != null
                          ? `€${(unit.rent / unit.areaM2).toFixed(2)}/m²`
                          : "—"}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        {unit?.areaM2 != null
                          ? `Superficie: ${unit.areaM2} m²`
                          : "Superficie no disponible"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Próximos Vencimientos */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                    <div className="p-1.5 bg-yellow-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="text-sm">Próximos Vencimientos</h3>
                  </div>
                  <div className="space-y-2">
                    {unit?.rent != null ? (
                      <div className="p-2 border-2 border-yellow-200 bg-yellow-50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-yellow-900">
                            Pago renta mensual
                          </p>
                          <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs">
                            Pendiente
                          </span>
                        </div>
                        <p className="text-xs text-yellow-700">
                          {unit?.rent != null
                            ? `Próximo vencimiento - €${unit.rent.toLocaleString()}`
                            : "—"}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 border border-gray-200 rounded">
                        <p className="text-xs text-gray-500">
                          No hay información de renta disponible
                        </p>
                      </div>
                    )}
                    {unit?.rawData?.expirationDate ? (
                      <div className="p-2 border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-gray-900">
                            Vencimiento contrato
                          </p>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            Activo
                          </span>
                        </div>
                        <p className="text-xs text-gray-700">
                          {unit.rawData.expirationDate}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-gray-900">
                            Vencimiento contrato
                          </p>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            Sin datos
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">—</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="mantenimiento"
          className="flex-1 mt-3 outline-none"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText lines={1} widths={["w-40"]} className="mb-3" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <SkeletonText key={i} lines={1} widths={["w-full"]} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <SkeletonText lines={1} widths={["w-40"]} className="mb-3" />
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <SkeletonText key={i} lines={1} widths={["w-full"]} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Columna izquierda: Historial de Mantenimiento */}
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm mb-3">Historial de Mantenimiento</h3>
                  <div className="space-y-2">
                    {/* Placeholder: mostrar mensaje cuando no hay historial */}
                    <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">
                        No hay historial de mantenimiento registrado
                      </p>
                      <p className="text-xs text-gray-400">
                        Los trabajos de mantenimiento realizados aparecerán aquí
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha: Mantenimiento Programado */}
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm mb-3">Mantenimiento Programado</h3>
                  <div className="space-y-2">
                    {/* Placeholder: mostrar mensaje cuando no hay mantenimientos programados */}
                    <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">
                        No hay mantenimientos programados
                      </p>
                      <p className="text-xs text-gray-400">
                        Los mantenimientos futuros aparecerán aquí cuando se programen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="actividad"
          className="flex-1 mt-3 outline-none"
        >
          {loading ? (
            <div className="pr-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <SkeletonText lines={1} widths={["w-40"]} className="mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <SkeletonText key={i} lines={1} widths={["w-full"]} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="pr-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <Activity className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="text-sm">Registro de actividad</h3>
                </div>

                {/* Placeholder profesional mientras no haya feed de actividad real */}
                <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">
                    Aún no hay actividad registrada para esta unidad
                  </p>
                  <p className="text-xs text-gray-400">
                    Cuando se registren acciones como creación de documentos, pagos o
                    mantenimientos, aparecerán aquí de forma cronológica.
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};


