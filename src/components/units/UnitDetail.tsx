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
import { UnitGestion } from "./UnitGestion";
import { useLanguage } from "~/contexts/LanguageContext";

export const UnitDetail: React.FC = () => {
  const { id: buildingId, unitId } = useParams<{
    id: string;
    unitId: string;
  }>();

  const { t } = useLanguage();
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
      ? t("occupied")
      : unit?.status && unit.status.toLowerCase() === "mantenimiento"
      ? t("maintenanceUnit")
      : t("available");

  const statusColorClasses =
    statusLabel === t("occupied")
      ? "bg-green-100 text-green-700"
      : statusLabel === t("maintenanceUnit")
      ? "bg-orange-100 text-orange-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="h-full flex flex-col gap-3">
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
                      t("unitNotFound")
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
              <span className="hidden sm:inline">{t("summary")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="gestion"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <FileText className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">{t("gestion")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="financiero"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <Euro className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">{t("financial")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="mantenimiento"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <Wrench className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">{t("maintenance")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="actividad"
              className="inline-flex h-[calc(100%-1px)] flex-1 md:flex-none items-center justify-center gap-1.5 border font-medium whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-3 md:px-4 py-2.5 text-xs md:text-sm text-foreground min-w-fit"
            >
              <Activity className="w-4 h-4 md:mr-2" />
              <span className="hidden sm:inline">{t("activity")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
                    <h3 className="text-sm">{t("basicInfo")}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">{t("type")}</p>
                      <p className="text-gray-900">
                        {unit?.useType || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("surface")}</p>
                      <p className="text-gray-900">
                        {unit?.areaM2 ? `${unit.areaM2} m²` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("floor")}</p>
                      <p className="text-gray-900">{unit?.floor || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t("status")}</p>
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
                    <h3 className="text-sm">{t('tenant')} &amp; {t("contract")}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-xs text-gray-500">{t("tenant")}:</span>
                      <span className="text-gray-900 text-right truncate max-w-[60%]">
                        {unit?.tenant || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-xs text-gray-500">{t("expiration")}:</span>
                      <span className="text-gray-900 text-right">
                        {unit?.rawData?.expirationDate || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-xs text-gray-500">{t("rent")}:</span>
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
                  <h3 className="text-sm mb-3">{t("financialSummary")} </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-xs text-gray-600">{t("rent")}/{t("month")}</p>
                      <p className="text-sm text-blue-600">
                        {unit?.rent != null
                          ? `€${unit.rent.toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-xs text-gray-600">{`${t("rent")} ${t("annual")}`}</p>
                      <p className="text-sm text-green-600">
                        {unit?.rent != null
                          ? `€${(unit.rent * 12).toLocaleString()}`
                          : "—"}
                      </p>
                    </div>
                    <div className="p-2 bg-cyan-50 rounded">
                      <p className="text-xs text-gray-600">{t("counters")}/{t("month")}</p>
                      <p className="text-sm text-cyan-600">—</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <p className="text-xs text-gray-600">{t("counters")}/{t("year")}</p>
                      <p className="text-sm text-purple-600">—</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-3">
                {/* Documentos principales */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm mb-3">{t("documentsMain")}</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      {
                        label: t("leaseContract"),
                        color: "text-blue-600",
                        meta: "PDF • —",
                      },
                      {
                        label: t("energyCertificate"),
                        color: "text-green-600",
                        meta: "PDF • —",
                      },
                      {
                        label: t("unitInventory"),
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
                  <h3 className="text-sm mb-3">{t("recentActivity")}</h3>
                  <div className="space-y-2 text-xs">
                    {[
                      {
                        color: "bg-blue-500",
                        title: t("rentReceived"),
                        detail: "—",
                      },
                      {
                        color: "bg-green-500",
                        title: t("maintenanceCompleted"),
                        detail: "—",
                      },
                      {
                        color: "bg-orange-500",
                        title: t("repairProcessed"),
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
                  <h3 className="text-sm mb-3">{t("next")} {t("mantenimiento")}</h3>
                  <div className="p-2 border-2 border-yellow-200 bg-yellow-50 rounded">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-900">
                          {t("nextMaintenance")}
                        </p>
                        <p className="text-xs text-gray-500">—</p>
                      </div>
                      <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs flex-shrink-0">
                        {t("next")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Pestaña de Gestión */}
        <TabsContent
          value="gestion"
          className="flex-1 mt-3 outline-none"
        >
          {buildingId && unitId ? (
            <UnitGestion
              buildingId={buildingId}
              unitId={unitId}
              building={building}
              unit={unit}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-sm text-gray-500">
                {t("unitNotIdentified")}
              </p>
              <p className="text-sm text-gray-500">
                {t("unitNotIdentifiedDesc")}
              </p>
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
                    <h3 className="text-sm">{t("financialSummary")}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">{t("monthlyRent")}</p>
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
                        <p className="text-xs text-green-700 mb-1">{t("rent") + " " + t("annual")}</p>
                        <p className="text-base sm:text-lg text-green-900">
                          {unit?.rent != null
                            ? `€${(unit.rent * 12).toLocaleString()}`
                            : "€0"}
                        </p>
                        <p className="text-xs text-green-600 mt-1">12 {t("mensualidades")}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-600">{t("rent") + " " + t("base")}</p>
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
                        <p className="text-xs text-gray-900 font-medium">{t("totalMonthly")}</p>
                        <p className="text-sm text-green-600 font-semibold">
                          {unit?.rent != null
                            ? `€${Math.round(unit.rent * 1.21).toLocaleString()}`
                            : "€0"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2 bg-purple-50 rounded border border-purple-200">
                        <p className="text-xs text-purple-700">{t("deposit") + " (" + t("months") + ")"}</p>
                        <p className="text-sm text-purple-900">
                          {unit?.rent != null
                            ? `€${(unit.rent * 3).toLocaleString()}`
                            : "€0"}
                        </p>
                      </div>
                      <div className="p-2 bg-indigo-50 rounded border border-indigo-200">
                        <p className="text-xs text-indigo-700">{t("annual") + " " + t("income")}</p>
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
                    <h3 className="text-sm">{t("rentBreakdown")}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <p className="text-xs text-gray-700">{t("rent") + " " + t("base")}</p>
                      <p className="text-sm text-blue-700">
                        {unit?.rent != null
                          ? `€${unit.rent.toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <p className="text-xs text-gray-700">{t("IVA")} (21%)</p>
                      <p className="text-sm text-gray-700">
                        {unit?.rent != null
                          ? `€${Math.round(unit.rent * 0.21).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200">
                      <p className="text-xs font-medium text-gray-700">{t("rent")} {t("with")} {t("IVA")}</p>
                      <p className="text-sm font-semibold text-green-700">
                        {unit?.rent != null
                          ? `€${Math.round(unit.rent * 1.21).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <p className="text-xs text-gray-700">{t("annualRent")}</p>
                      <p className="text-sm text-purple-700">
                        {unit?.rent != null
                          ? `€${(unit.rent * 12).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-indigo-50 border border-indigo-200">
                      <p className="text-xs font-medium text-gray-700">{t("annualRent")} + {t("IVA")}</p>
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
                    <h3 className="text-sm">{t("countersAndSupplies")}</h3>
                  </div>
                  <div className="space-y-3">
                    {/* Agua */}
                    <div className="p-3 border border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplet className="w-4 h-4 text-cyan-700" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-cyan-900">{t("water")}</p>
                            <p className="text-sm font-semibold text-cyan-700">—</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 pl-6">
                        <div className="flex justify-between text-xs text-cyan-700">
                          <span>{t("counterNumber")}:</span>
                          <span className="font-medium">—</span>
                        </div>
                        <div className="flex justify-between text-xs text-cyan-700">
                          <span>{t("consumption")}:</span>
                          <span>—</span>
                        </div>
                        <div className="flex justify-between text-xs text-cyan-700">
                          <span>{t("lastReading")}:</span>
                          <span>—</span>
                        </div>
                        <div className="flex justify-between text-xs text-cyan-800 pt-1 border-t border-cyan-200">
                          <span className="font-medium">{t("annualCost")}:</span>
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
                              <p className="text-xs font-medium text-purple-900">{t("ibi")}</p>
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                {t("noData")}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-purple-700">—</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 pl-6">
                        <div className="flex justify-between text-xs text-purple-700">
                          <span>{t("annualCost")}:</span>
                          <span className="font-medium">—</span>
                        </div>
                        <div className="flex justify-between text-xs text-purple-700">
                          <span>{t("expiration")}:</span>
                          <span>—</span>
                        </div>
                        <div className="flex justify-between text-xs text-purple-700">
                          <span>{t("lastPayment")}:</span>
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
                              <p className="text-xs font-medium text-amber-900">{t("trashCollection")}</p>
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                {t("noData")}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-amber-700">—</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 pl-6">
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>{t("annualCost")}:</span>
                          <span className="font-medium">—</span>
                        </div>
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>{t("expiration")}:</span>
                          <span>—</span>
                        </div>
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>{t("lastPayment")}:</span>
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
                            {t("totalOperatingCosts")}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div className="text-center p-2 bg-white rounded border border-green-200">
                          <p className="text-xs text-green-700 mb-1">{t("monthly")}</p>
                          <p className="text-base sm:text-lg font-semibold text-green-800">€0</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded border border-green-200">
                          <p className="text-xs text-green-700 mb-1">{t("annual")}</p>
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
                    <h3 className="text-sm">{t("historyPayments")}</h3>
                  </div>
                  <div className="space-y-2">
                    {unit?.rent != null ? (
                      // Placeholder: mostrar mensaje cuando no hay pagos registrados
                      <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">
                          {t("noPaymentsRegistered")}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {t("historyPaymentsAppears")}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500">
                          {t("noRentInformation")}
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
                    <h3 className="text-sm">{t("profitAnalysis")}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-xs text-indigo-700 mb-2">{t("profitAnalysisIncome")}</p>
                      <p className="text-lg font-semibold text-indigo-900">
                        {unit?.rent != null
                          ? `€${(unit.rent * 12).toLocaleString()}`
                          : "€0"}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs text-red-700 mb-2">{t("profitAnalysisExpenses")}</p>
                      <p className="text-lg font-semibold text-red-900">€0</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-2 border-green-300">
                      <p className="text-xs text-green-700 mb-2">{t("profitAnalysisProfit")}</p>
                      <p className="text-xl font-semibold text-green-900">
                        {unit?.rent != null
                          ? `€${(unit.rent * 12).toLocaleString()}`
                          : "€0"}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {unit?.rent != null
                          ? `${t("margin")}: 100%`
                          : `${t("noData")}`}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-700 mb-2">{t("profitAnalysisProfitDesc")}</p>
                      <p className="text-lg font-semibold text-purple-900">
                        {unit?.rent != null && unit?.areaM2 != null
                          ? `€${(unit.rent / unit.areaM2).toFixed(2)}/m²`
                          : "—"}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        {unit?.areaM2 != null
                          ? `${t("surface")}: ${unit.areaM2} m²`
                          : t("noData")}
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
                    <h3 className="text-sm">{t("nextPayments")}</h3>
                  </div>
                  <div className="space-y-2">
                    {unit?.rent != null ? (
                      <div className="p-2 border-2 border-yellow-200 bg-yellow-50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-yellow-900">
                            {t("monthlyPayment")}
                          </p>
                          <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs">
                            {t("pending")}
                          </span>
                        </div>
                        <p className="text-xs text-yellow-700">
                          {unit?.rent != null
                            ? `${t("nextPayment")} - €${unit.rent.toLocaleString()}`
                            : "—"}
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 border border-gray-200 rounded">
                        <p className="text-xs text-gray-500">
                          {t("noRentInformation")}
                        </p>
                      </div>
                    )}
                    {unit?.rawData?.expirationDate ? (
                      <div className="p-2 border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-gray-900">
                            {t("contractExpiration")}
                          </p>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {t("active")}
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
                            {t("contractExpiration")}
                          </p>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {t("noData")}
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
                  <h3 className="text-sm mb-3">{t("maintenanceHistory")}</h3>
                  <div className="space-y-2">
                    {/* Placeholder: mostrar mensaje cuando no hay historial */}
                    <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">
                        {t("noMaintenanceHistory")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("noMaintenanceHistoryDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha: Mantenimiento Programado */}
              <div className="space-y-3">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-sm mb-3">{t("scheduledMaintenance")}</h3>
                  <div className="space-y-2">
                    {/* Placeholder: mostrar mensaje cuando no hay mantenimientos programados */}
                    <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">
                        {t("noScheduledMaintenance")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("noScheduledMaintenanceDesc")}
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
                  <h3 className="text-sm">{t("activityRegister")}</h3>
                </div>

                {/* Placeholder profesional mientras no haya feed de actividad real */}
                <div className="p-4 text-center border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">
                    {t("noActivityRegistered")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t("noActivityRegisteredDesc")}
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


