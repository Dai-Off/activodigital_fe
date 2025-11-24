import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { BuildingsApiService, type Building } from "../services/buildingsApi";
import { SkeletonBase, SkeletonText } from "./ui/LoadingSystem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

type UnitStatus = "occupied" | "available" | "renovation";

interface UnitCard {
  id: string;
  name: string;
  typology: string;
  status: UnitStatus;
  tenant?: string;
  area: number;
  rent?: number;
}

const mockUnits: UnitCard[] = [
  {
    id: "A1",
    name: "Vivienda 1A",
    typology: "Residencial · 3 habitaciones",
    status: "occupied",
    tenant: "Familia Gómez",
    area: 98,
    rent: 1250,
  },
  {
    id: "3B",
    name: "Oficina 3B",
    typology: "Oficina · Planta abierta",
    status: "occupied",
    tenant: "WorkHub Partners",
    area: 132,
    rent: 1850,
  },
  {
    id: "PB-02",
    name: "Local PB-02",
    typology: "Retail de proximidad",
    status: "available",
    area: 110,
  },
];

const STATUS_STYLES: Record<UnitStatus, string> = {
  occupied: "border-green-200 bg-green-50 text-green-700",
  available: "border-blue-200 bg-blue-50 text-blue-700",
  renovation: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function BuildingUnits() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuilding = async () => {
      if (!id) return;
      try {
        const data = await BuildingsApiService.getBuildingById(id);
        setBuilding(data);
      } catch {
        setBuilding(null);
      } finally {
        setLoading(false);
      }
    };

    loadBuilding();
  }, [id]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language === "es" ? "es-ES" : "en-US", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    [i18n.language]
  );

  const units = mockUnits;
  const totalUnits = building?.numUnits ?? units.length;
  const occupiedUnits = units.filter(
    (unit) => unit.status === "occupied"
  ).length;
  const availableUnits = units.filter(
    (unit) => unit.status === "available"
  ).length;
  const renovationUnits = units.filter(
    (unit) => unit.status === "renovation"
  ).length;
  const activeUnits =
    totalUnits > 0 ? occupiedUnits : units.length ? occupiedUnits : 0;
  const occupancyRate =
    totalUnits > 0
      ? Math.round((occupiedUnits / totalUnits) * 100)
      : units.length > 0
      ? Math.round((occupiedUnits / units.length) * 100)
      : 0;

  const rentUnits = units.filter((unit) => typeof unit.rent === "number");
  const averageRent =
    rentUnits.length > 0
      ? Math.round(
          rentUnits.reduce((acc, unit) => acc + (unit.rent ?? 0), 0) /
            rentUnits.length
        )
      : null;

  const statusLabels: Record<UnitStatus, string> = {
    occupied: t("building.unitsStatus.occupied", { defaultValue: "Ocupada" }),
    available: t("building.unitsStatus.available", {
      defaultValue: "Disponible",
    }),
    renovation: t("building.unitsStatus.renovation", {
      defaultValue: "En renovación",
    }),
  };

  if (!building && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("building.unitsNotFoundTitle", {
              defaultValue: "No se pudo cargar el edificio",
            })}
          </h2>
          <p className="text-gray-600">
            {t("building.unitsNotFoundDescription", {
              defaultValue:
                "Vuelve al detalle del edificio e inténtalo de nuevo.",
            })}
          </p>
          <Button onClick={() => navigate("/activos")} variant="outline">
            {t("building.unitsBackToAssets", {
              defaultValue: "Volver a activos",
            })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {loading ? (
          <>
            <div className="flex-1">
              <SkeletonText lines={1} widths={["w-64"]} className="mb-2" />
              <SkeletonText lines={1} widths={["w-96"]} />
            </div>
            <SkeletonBase className="h-10 w-32 rounded-md" />
          </>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {t("building.unitsPageTitle", {
                  defaultValue: "Unidades del activo",
                })}{" "}
                · {building?.name}
              </h1>
              <p className="text-sm text-gray-600">
                {t("building.unitsPageSubtitle", {
                  defaultValue:
                    "Listado de unidades registradas para este edificio.",
                })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => building && navigate(`/building/${building.id}`)}
              >
                {t("building.unitsBackToDetail", {
                  defaultValue: "Volver al detalle",
                })}
              </Button>
            </div>
          </>
        )}
      </div>
      <Card>
        <CardHeader className="space-y-1">
          {loading ? (
            <>
              <SkeletonText lines={1} widths={["w-32"]} className="mb-2" />
              <SkeletonText lines={1} widths={["w-64"]} />
            </>
          ) : (
            <>
              <CardTitle className="text-lg text-gray-900">
                {t("building.unitsSummaryTitle", {
                  defaultValue: "Resumen rápido",
                })}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {t("building.unitsSummaryDescription", {
                  defaultValue:
                    "Instantánea del parque de unidades vinculadas al activo.",
                })}
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <SkeletonText lines={1} widths={["w-20"]} className="mb-2" />
                  <SkeletonText lines={1} widths={["w-16"]} className="mb-2" />
                  <SkeletonText lines={1} widths={["w-32"]} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t("building.unitsSummaryOccupancy", {
                    defaultValue: "Ocupación",
                  })}
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {totalUnits > 0 ? `${occupancyRate}%` : "—"}
                </p>
                <p className="text-xs text-gray-500">
                  {t("building.unitsSummaryOccupancyHint", {
                    defaultValue:
                      "{{occupied}} de {{total}} unidades en operación",
                    occupied: activeUnits,
                    total: totalUnits || units.length,
                  })}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t("building.unitsSummaryMix", {
                    defaultValue: "Mix de unidades",
                  })}
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {occupiedUnits}{" "}
                  {t("building.unitsSummaryOccupied", {
                    defaultValue: "ocupadas",
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {availableUnits}{" "}
                  {t("building.unitsSummaryAvailable", {
                    defaultValue: "disponibles",
                  })}{" "}
                  · {renovationUnits}{" "}
                  {t("building.unitsSummaryRenovation", {
                    defaultValue: "en obra",
                  })}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t("building.unitsSummaryAverageArea", {
                    defaultValue: "Superficie media",
                  })}
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {units.length > 0
                    ? `${Math.round(
                        units.reduce((acc, unit) => acc + unit.area, 0) /
                          units.length
                      )} m²`
                    : "—"}
                </p>
                <p className="text-xs text-gray-500">
                  {t("building.unitsSummaryAverageAreaHint", {
                    defaultValue: "Calculado sobre unidades activas",
                  })}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {t("building.unitsSummaryAvgRent", {
                    defaultValue: "Renta media",
                  })}
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {averageRent ? currencyFormatter.format(averageRent) : "—"}
                </p>
                <p className="text-xs text-gray-500">
                  {t("building.unitsSummaryAvgRentHint", {
                    defaultValue: "Solo contratos vigentes",
                  })}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {loading ? (
            <div className="space-y-1 flex-1">
              <SkeletonText lines={1} widths={["w-48"]} className="mb-2" />
              <SkeletonText lines={1} widths={["w-64"]} />
            </div>
          ) : (
            <div className="space-y-1">
              <CardTitle className="text-lg text-gray-900">
                {t("building.unitsListTitle", {
                  defaultValue: "Unidades destacadas",
                })}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {t("building.unitsListDescription", {
                  defaultValue:
                    "Ejemplo de cómo visualizaremos cada unidad cuando esté disponible la gestión completa.",
                })}
              </CardDescription>
            </div>
          )}
          {!loading && (
            <Button
              type="button"
              variant="outline"
              disabled
              className="cursor-not-allowed"
            >
              {t("building.unitsManageSoon", {
                defaultValue: "Añadir unidad (próximamente)",
              })}
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <SkeletonText
                        lines={1}
                        widths={["w-16"]}
                        className="mb-2"
                      />
                      <SkeletonText
                        lines={1}
                        widths={["w-32"]}
                        className="mb-2"
                      />
                      <SkeletonText lines={1} widths={["w-24"]} />
                    </div>
                    <SkeletonBase className="w-20 h-6 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonText lines={3} widths={["w-full"]} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            units.map((unit) => (
              <div
                key={unit.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      #{unit.id}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-gray-900">
                      {unit.name}
                    </h3>
                    <p className="text-sm text-gray-600">{unit.typology}</p>
                  </div>
                  <Badge className={STATUS_STYLES[unit.status]}>
                    {statusLabels[unit.status]}
                  </Badge>
                </div>

                <dl className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">
                      {t("building.unitsAreaLabel", {
                        defaultValue: "Superficie",
                      })}
                    </dt>
                    <dd className="font-medium text-gray-900">
                      {unit.area} m²
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">
                      {t("building.unitsTenantLabel", {
                        defaultValue: "Inquilino",
                      })}
                    </dt>
                    <dd className="font-medium text-gray-900">
                      {unit.tenant ??
                        t("building.unitsNoTenant", {
                          defaultValue: "Sin asignar",
                        })}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">
                      {t("building.unitsRentLabel", {
                        defaultValue: "Renta mensual",
                      })}
                    </dt>
                    <dd className="font-medium text-gray-900">
                      {unit.rent ? currencyFormatter.format(unit.rent) : "—"}
                    </dd>
                  </div>
                </dl>

                {unit.status === "available" && (
                  <p className="mt-3 text-xs text-blue-600">
                    {t("building.unitsAvailableHint", {
                      defaultValue:
                        "Ideal para nuevo inquilino. Puedes preparar material comercial desde la ficha.",
                    })}
                  </p>
                )}
                {unit.status === "renovation" && (
                  <p className="mt-3 text-xs text-amber-600">
                    {t("building.unitsRenovationHint", {
                      defaultValue:
                        "En fase de mejora. El cronograma de obra se mostrará aquí.",
                    })}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-500">
            {t("building.unitsCardsComingSoon", {
              defaultValue:
                "Muy pronto podrás buscar, agregar y sincronizar unidades reales directamente con tus sistemas de gestión.",
            })}
          </p>
        </div>
      </Card>
    </div>
  );
}
