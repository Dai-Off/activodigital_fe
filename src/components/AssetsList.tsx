import { Badge } from "./ui/badge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  MapPin,
  Check,
  X,
  CircleCheck,
  RefreshCw,
  MinusCircle,
} from "lucide-react";
import { BuildingCarousel } from "../components/BuildingCarousel";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateBuildingMethodSelection from "./buildings/CreateBuildingMethodSelection";

import {
  BuildingsApiService,
  formatBuildingValue,
  // getBuildingStatusLabel,
  getBuildingTypologyLabel,
} from "../services/buildingsApi";
import type { Building, DashboardStats } from "../services/buildingsApi";

import {
  SkeletonBuildingList,
  SkeletonDashboardSummary,
  useLoadingState,
} from "./ui/LoadingSystem";

import {
  EnergyCertificatesService,
  type PersistedEnergyCertificate,
} from "../services/energyCertificates";

import { getLatestRating, getCEEColor } from "../utils/energyCalculations";
import { getBookByBuilding, type DigitalBook } from "../services/digitalbook";
import {
  calculateESGScore,
  // getESGLabelColor,
  getESGColorFromScore,
  type ESGResponse,
} from "../services/esg";

import AssetsSearchBar, { type SearchFilters } from "./ui/AssetsSearchBar";
import { Card } from "./ui/card";

/* -------------------------- Utils de presentación -------------------------- */
function getCityAndDistrict(address: string): string {
  if (!address) return "";

  const parts = address.split(",").map((part) => part.trim());

  const comunidadIndex = parts.findIndex((part) =>
    part.includes("Comunidad de Madrid")
  );
  if (comunidadIndex > 1) {
    const city = parts[comunidadIndex - 1];
    const district = parts[comunidadIndex - 2];
    return `${city}, ${district}`;
  }

  if (parts.length >= 3) {
    const postalCodeIndex = parts.findIndex((part) => /^\d{5}$/.test(part));
    if (postalCodeIndex > 1) {
      const city = parts[postalCodeIndex - 1];
      const district = parts[postalCodeIndex - 2];
      return `${city}, ${district}`;
    }
  }

  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${
      parts[parts.length - 3] || parts[parts.length - 1]
    }`;
  }

  return address.length > 20 ? `${address.substring(0, 20)}...` : address;
}

function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: {
  page: number; // 1-based
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  pageSizeOptions?: number[];
}) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3">
      <div className="text-xs text-gray-600">
        {t("showing", { defaultValue: "Mostrando" })}{" "}
        <span className="font-medium">{start}</span>–
        <span className="font-medium">{end}</span>{" "}
        {t("of", { defaultValue: "de" })}{" "}
        <span className="font-medium">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="page-size">
          {t("pageSize", { defaultValue: "Tamaño de página" })}
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
          aria-label={t("pageSize", { defaultValue: "Tamaño de página" })}
          title={t("pageSize", { defaultValue: "Tamaño de página" })}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} {t("perPage", { defaultValue: "/página" })}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(1)}
            disabled={page === 1}
            title={t("firstPage", { defaultValue: "Primera página" })}
            aria-label={t("firstPage", { defaultValue: "Primera página" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
          </button>
          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(page - 1)}
            disabled={page === 1}
            title={t("previous", { defaultValue: "Anterior" })}
            aria-label={t("previous", { defaultValue: "Anterior" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <span className="px-2 text-xs text-gray-600">
            {t("page", { defaultValue: "Página" })}{" "}
            <span className="font-medium">{page}</span> / {totalPages}
          </span>

          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(page + 1)}
            disabled={page === totalPages}
            title={t("next", { defaultValue: "Siguiente" })}
            aria-label={t("next", { defaultValue: "Siguiente" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(totalPages)}
            disabled={page === totalPages}
            title={t("lastPage", { defaultValue: "Última página" })}
            aria-label={t("lastPage", { defaultValue: "Última página" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m13 17 5-5-5-5" />
              <path d="m6 17 5-5-5-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Página --------------------------------- */
export default function AssetsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );

  const { loading, error, startLoading, stopLoading } = useLoadingState(true);
  const {
    loading: statsLoading,
    startLoading: startStatsLoading,
    stopLoading: stopStatsLoading,
  } = useLoadingState(true);

  // Estados para certificados energéticos, libros digitales y ESG
  const [energyCertificates, setEnergyCertificates] = useState<
    PersistedEnergyCertificate[]
  >([]);
  const [digitalBooks, setDigitalBooks] = useState<Map<string, DigitalBook>>(
    new Map()
  );
  const [esgScores, setEsgScores] = useState<Map<string, ESGResponse>>(
    new Map()
  );

  // Paginado (cliente)
  const [page, setPage] = useState(1); // 1-based
  const [pageSize, setPageSize] = useState(10);

  // Filtros de búsqueda y ordenamiento
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    sortField: "name",
    sortOrder: "asc",
    statusFilter: [],
    energyClassFilter: [],
  });

  useEffect(() => {
    let mounted = true;

    const loadAllData = async () => {
      if (!user || authLoading) return;

      try {
        startLoading();
        startStatsLoading();

        // Cargar edificios y stats primero
        const [buildingsData, statsData] = await Promise.all([
          BuildingsApiService.getAllBuildings(),
          BuildingsApiService.getDashboardStats(),
        ]);

        if (!mounted) return;

        setBuildings(buildingsData);
        setDashboardStats(statsData);

        // Cargar certificados, libros digitales y ESG para todos los edificios en paralelo
        const certsAndBooksPromises = buildingsData.map(async (building) => {
          try {
            // Todos los roles pueden calcular ESG
            const esgFunction = calculateESGScore;

            const [certsResponse, book, esgScore] = await Promise.all([
              EnergyCertificatesService.getByBuilding(building.id).catch(
                () => ({
                  sessions: [],
                  certificates: [],
                })
              ),
              getBookByBuilding(building.id),
              esgFunction(building.id).catch(() => null),
            ]);

            return {
              buildingId: building.id,
              certificates: (certsResponse as any).certificates || [],
              book,
              esgScore,
            };
          } catch {
            return {
              buildingId: building.id,
              certificates: [],
              book: null,
              esgScore: null,
            };
          }
        });

        const results = await Promise.all(certsAndBooksPromises);

        // Consolidar certificados, libros y ESG
        const allCertificates: PersistedEnergyCertificate[] = [];
        const booksMap = new Map<string, DigitalBook>();
        const esgMap = new Map<string, ESGResponse>();

        results.forEach((result) => {
          allCertificates.push(...result.certificates);
          if (result.book) booksMap.set(result.buildingId, result.book);
          if (result.esgScore) esgMap.set(result.buildingId, result.esgScore);
        });

        if (mounted) {
          setEnergyCertificates(allCertificates);
          setDigitalBooks(booksMap);
          setEsgScores(esgMap);
          setDashboardStats(statsData);
          stopLoading();
          stopStatsLoading();
        }
      } catch (err) {
        if (mounted) {
          // Algunos hooks personalizados aceptan mensaje en stopLoading; si el tuyo no, reemplaza por setError si aplica.
          stopLoading(
            err instanceof Error ? err.message : "Error cargando datos"
          );
          stopStatsLoading();
        }
      }
    };

    loadAllData();

    return () => {
      mounted = false;
    };
  }, [
    user,
    authLoading,
    startLoading,
    stopLoading,
    startStatsLoading,
    stopStatsLoading,
  ]);

  // Calcular emisiones totales de CO₂ en el frontend
  const calculatedTotalEmissions = useMemo(() => {
    if (!buildings.length || !energyCertificates.length) return 0;

    let totalEmissions = 0;

    buildings.forEach((building) => {
      const cert = energyCertificates.find((c) => c.buildingId === building.id);

      if (
        cert &&
        cert.emissionsKgCo2PerM2Year &&
        cert.emissionsKgCo2PerM2Year > 0
      ) {
        const surfaceArea =
          building.squareMeters || (building.numUnits || 0) * 70;
        const buildingEmissions =
          (cert.emissionsKgCo2PerM2Year * surfaceArea) / 1000;
        totalEmissions += buildingEmissions;
      }
    });

    return Math.round(totalEmissions);
  }, [buildings, energyCertificates]);

  // Aplicar filtros y ordenamiento
  const filteredAndSortedBuildings = useMemo(() => {
    let result = [...buildings];

    // Ordenar por fecha de creación descendente (más recientes primero)
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Filtro de búsqueda por texto
    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      result = result.filter(
        (building) =>
          building.name.toLowerCase().includes(term) ||
          building.address.toLowerCase().includes(term) ||
          building.cadastralReference?.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (searchFilters.statusFilter.length > 0) {
      result = result.filter((building) => {
        const book = digitalBooks.get(building.id);
        const completedSections = book?.progress || 0;

        if (
          completedSections === 8 &&
          searchFilters.statusFilter.includes("completed")
        ) {
          return true;
        }

        return searchFilters.statusFilter.includes(building.status);
      });
    }

    // Filtro por clase energética
    if (searchFilters.energyClassFilter.length > 0) {
      result = result.filter((building) => {
        const certs = energyCertificates.filter(
          (cert) => cert.buildingId === building.id
        );
        if (certs.length === 0) return false;
        const rating = getLatestRating(certs);
        return searchFilters.energyClassFilter.includes(rating);
      });
    }

    // Ordenamiento
    result.sort((a, b) => {
      let comparison = 0;

      switch (searchFilters.sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "value":
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case "status": {
          const bookA = digitalBooks.get(a.id);
          const bookB = digitalBooks.get(b.id);
          const progressA = bookA?.progress || 0;
          const progressB = bookB?.progress || 0;
          comparison = progressA - progressB;
          break;
        }
        case "energyClass": {
          const certsA = energyCertificates.filter(
            (cert) => cert.buildingId === a.id
          );
          const certsB = energyCertificates.filter(
            (cert) => cert.buildingId === b.id
          );
          const ratingA = certsA.length > 0 ? getLatestRating(certsA) : "Z";
          const ratingB = certsB.length > 0 ? getLatestRating(certsB) : "Z";
          comparison = ratingA.localeCompare(ratingB);
          break;
        }
        case "esgScore": {
          const esgA = esgScores.get(a.id);
          const esgB = esgScores.get(b.id);
          const labelA =
            esgA?.status === "complete" && esgA.data?.label
              ? esgA.data.label
              : "Z";
          const labelB =
            esgB?.status === "complete" && esgB.data?.label
              ? esgB.data.label
              : "Z";
          comparison = labelA.localeCompare(labelB);
          break;
        }
        case "squareMeters":
          comparison = (a.squareMeters || 0) - (b.squareMeters || 0);
          break;
      }

      return searchFilters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [buildings, searchFilters, digitalBooks, energyCertificates, esgScores]);

  // Recalcular vista paginada
  const total = filteredAndSortedBuildings.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredAndSortedBuildings.slice(start, start + pageSize);
  }, [filteredAndSortedBuildings, pageSize, safePage]);

  // al cambiar tamaño, volver a pág. 1
  const handlePageSizeChange = (s: number) => {
    setPageSize(s);
    setPage(1);
  };

  // Al cambiar filtros, volver a página 1
  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="pt-2 pb-8 max-w-full">
        {/* Botones de acción - Todos los roles pueden crear edificios */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("createBuilding", { defaultValue: "Crear Edificio" })}
          </button>
        </div>

        {/* Modal de selección de método */}
        <CreateBuildingMethodSelection
          isOpen={isCreateModalOpen}
          onSelectMethod={(method) => {
            setIsCreateModalOpen(false);
            navigate("/building/create", { state: { method } });
          }}
          onClose={() => setIsCreateModalOpen(false)}
        />

        <div
          className="mb-8"
          style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
        >
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-yellow-800">
                  {t("userDataLoadWarning", {
                    defaultValue:
                      "No se pudieron cargar los datos del usuario, pero puedes continuar navegando.",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Dashboard Summary Card */}
          {user &&
          !authLoading &&
          !loading &&
          !statsLoading &&
          dashboardStats ? (
            <div
              className="bg-white border border-gray-200 rounded-xl p-6 mb-6"
              style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
            >
              {/* User Profile Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 20a6.5 6.5 0 0113 0" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">
                      {t("welcome", { defaultValue: "Bienvenido" })}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.fullName}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-md text-xs font-medium text-gray-600 bg-gray-100 uppercase">
                  {t(`roles.${user.role}`, { defaultValue: user.role })}
                </span>
              </div>

              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                {/* Left Section */}
                <div className="flex-1 w-full lg:pr-6">
                  {/* Main Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4">
                    {user?.role === "propietario" ? (
                      <>
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">
                            {formatBuildingValue(dashboardStats.totalValue)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {t("totalValue", { defaultValue: "Valor total" })}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {dashboardStats.totalAssets}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {t("assets", { defaultValue: "Activos" })}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {dashboardStats.totalSurfaceArea.toLocaleString()}{" "}
                            m²
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {t("totalSurface", {
                              defaultValue: "Superficie total",
                            })}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {(
                              dashboardStats.totalEmissions ??
                              calculatedTotalEmissions
                            ).toLocaleString()}{" "}
                            <span className="text-sm sm:text-base">
                              tCO₂ eq
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {t("annualEmissions", {
                              defaultValue: "Emisiones anuales",
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {dashboardStats.totalAssets}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                            {t("assignedBuildings", {
                              defaultValue: "Edificios asignados",
                            })}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {dashboardStats.completedBooks}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                            {t("completedBooks", {
                              defaultValue: "Libros completados",
                            })}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {dashboardStats.pendingBooks}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {t("pendingBooks", { defaultValue: "Pendientes" })}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                            {dashboardStats.totalSurfaceArea.toLocaleString()}{" "}
                            m²
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                            {t("totalSurface", {
                              defaultValue: "Superficie total",
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Separator Line */}
                  <div className="border-t border-gray-200 mb-4" />

                  {/* Performance Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user?.role === "propietario" ? (
                      <>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">
                            {t("averageEnergyClass", {
                              defaultValue: "Clase energética promedio",
                            })}
                          </div>
                          <div className="flex items-center justify-center">
                            {dashboardStats.averageEnergyClass ? (
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${getCEEColor(
                                  dashboardStats.averageEnergyClass
                                )}`}
                              >
                                <span className="text-sm sm:text-base font-bold text-white">
                                  {dashboardStats.averageEnergyClass}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-400">
                                -
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">
                            {t("averageESGScore", {
                              defaultValue: "ESG Score medio",
                            })}
                          </div>
                          <div className="flex flex-col items-center justify-center gap-1">
                            {dashboardStats.averageESGScore ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={getESGColorFromScore(
                                    dashboardStats.averageESGScore
                                  )}
                                  className="w-8 h-8 sm:w-10 sm:h-10"
                                  style={{
                                    filter:
                                      "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15))",
                                  }}
                                  aria-hidden="true"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-700">
                                  {dashboardStats.averageESGScore}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-400">
                                -
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center sm:col-span-2 lg:col-span-1">
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">
                            {t("completedDigitalBook", {
                              defaultValue: "Libros completados",
                            })}
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {dashboardStats.completedBooks}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              {t("of", { defaultValue: "de" })}{" "}
                              {dashboardStats.totalAssets}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">
                            {t("mostCommonTypology", {
                              defaultValue: "Tipología más común",
                            })}
                          </div>
                          <div className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2">
                            {dashboardStats.mostCommonTypology
                              ? getBuildingTypologyLabel(
                                  dashboardStats.mostCommonTypology as any
                                )
                              : "N/A"}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">
                            {t("averageUnits", {
                              defaultValue: "Promedio unidades",
                            })}
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {dashboardStats.averageUnitsPerBuilding}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-xs sm:text-sm text-gray-500 mb-2">
                            {t("averageAge", { defaultValue: "Edad promedio" })}
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {dashboardStats.averageBuildingAge}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              {t("years", { defaultValue: "años" })}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Section - Progress Chart */}
                <div className="flex flex-col items-center justify-center w-full lg:w-auto mt-6 lg:mt-0">
                  <div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-3"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={`${
                          user?.role === "propietario"
                            ? dashboardStats.greenFinancingEligiblePercentage
                            : dashboardStats.completionPercentage
                        }, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-base sm:text-lg lg:text-xl font-bold text-green-500">
                          {user?.role === "propietario"
                            ? `${dashboardStats.greenFinancingEligiblePercentage}%`
                            : `${dashboardStats.completionPercentage}%`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center max-w-[140px] sm:max-w-[160px]">
                    <div className="text-xs sm:text-sm text-gray-500 leading-tight">
                      {user?.role === "propietario"
                        ? t("greenFinancingEligible", {
                            defaultValue:
                              "% cartera apta para financiación verde",
                          })
                        : t("completedDigitalBooksPercent", {
                            defaultValue: "% libros digitales completados",
                          })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <SkeletonDashboardSummary />
          )}
        </div>

        {/* Barra de búsqueda y filtros */}
        <AssetsSearchBar
          onFiltersChange={handleFiltersChange}
          totalResults={total}
          isLoading={loading}
        />

        {/* Assets List - Card Layout */}
        <div
          className="bg-white rounded-xl border border-gray-200 p-6 max-w-full"
          style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("assetsList", { defaultValue: "Listado de Activos" })}
          </h3>
          {loading ? (
            <SkeletonBuildingList />
          ) : paginated.length > 0 ? (
            <div className="flex flex-col gap-6">
              {paginated.map((building, index) => {
                const book = digitalBooks.get(building.id);
                const completedSections = book?.progress || 0;
                const totalSections = 8;
                const ceeCerts = energyCertificates.filter(
                  (cert) => cert.buildingId === building.id
                );
                const ceeRating =
                  ceeCerts.length > 0 ? getLatestRating(ceeCerts) : "-";
                const esg = esgScores.get(building.id);
                const esgScore =
                  esg?.status === "complete" && esg.data
                    ? esg.data.total
                    : null;
                /* const mainImage = building.images?.find(img => img.isMain) || building.images?.[0]; */
                /* const _imageUrl = mainImage?.url || 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80'; */
                // Estado badge color
                const getEstadoBadgeClassName = (estado: string) => {
                  if (
                    estado === t("operational", { defaultValue: "Operativo" })
                  ) {
                    return "bg-green-500/20 text-green-400 border border-green-500/50";
                  }
                  if (
                    estado ===
                    t("inRemodeling", { defaultValue: "En remodelación" })
                  ) {
                    return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50";
                  }
                  return "bg-gray-700 text-gray-400 border border-gray-600";
                };
                return (
                  <motion.div
                    key={building.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card
                      className="bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col sm:flex-row sm:h-[280px] lg:h-[224px]"
                      onClick={() => navigate(`/building/${building.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter")
                          navigate(`/building/${building.id}`);
                      }}
                    >
                      {/* Image Carousel */}
                      <div className="w-full h-48 sm:w-64 sm:h-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-800">
                        <BuildingCarousel
                          images={building.images?.map((img) => img.url) ?? []}
                          name={building.name}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-8 px-4 pb-4 sm:p-6 flex flex-col justify-between min-h-0">
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                            {building.name}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm line-clamp-1">
                              {getCityAndDistrict(building.address)}
                            </span>
                          </div>
                        </div>

                        {/* Info Grid - Responsive layout */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              {t("value", { defaultValue: "Valor" })}
                            </p>
                            <p className="text-sm sm:text-lg font-medium text-gray-900 truncate">
                              {formatBuildingValue(building.price)}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              {t("squareMeters", {
                                defaultValue: "Superficie",
                              })}
                            </p>
                            <p className="text-sm sm:text-lg font-medium text-gray-900">
                              {building.squareMeters
                                ? `${building.squareMeters} m²`
                                : "-"}
                            </p>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs text-gray-500 mb-1">
                              {t("status", { defaultValue: "Estado" })}
                            </p>
                            <Badge
                              className={
                                getEstadoBadgeClassName(
                                  t("operational", {
                                    defaultValue: "Operativo",
                                  })
                                ) + " flex items-center gap-1 sm:gap-2 text-xs"
                              }
                            >
                              {(() => {
                                const estado = t("operational", {
                                  defaultValue: "Operativo",
                                });
                                if (estado === "Operativo") {
                                  return (
                                    <CircleCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                                  );
                                }
                                if (estado === "En remodelación") {
                                  return (
                                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                                  );
                                }
                                return (
                                  <MinusCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                                );
                              })()}
                              <span className="truncate">
                                {t("operational", {
                                  defaultValue: "Operativo",
                                })}
                              </span>
                            </Badge>
                          </div>
                          <div className="col-span-1">
                            <p className="text-xs text-gray-500 mb-1">
                              {t("energyCertificate", {
                                defaultValue: "Cert. Energética",
                              })}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-gray-900 text-xs sm:text-sm font-medium">
                                {ceeRating}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ESG and Digital Book - Bottom section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                          <div className="flex-1 w-full sm:w-auto">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">
                                ESG Score
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {esgScore !== null ? `${esgScore}/100` : "-"}
                              </span>
                            </div>
                            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${esgScore ?? 0}%` }}
                                transition={{
                                  duration: 0.6,
                                  delay: 0.3 + index * 0.16,
                                }}
                                className="absolute inset-y-0 left-0 bg-cyan-500 rounded-full"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-500 hidden sm:block">
                              {t("digitalBook", {
                                defaultValue: "Libro del Edificio",
                              })}
                            </span>
                            <span className="text-xs text-gray-500 sm:hidden">
                              {t("digitalBook", { defaultValue: "Libro" })}
                            </span>
                            {completedSections === totalSections ? (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 border border-green-300 rounded-lg flex items-center justify-center">
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center">
                                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {user?.role === "propietario"
                  ? t("noAssetsYet", { defaultValue: "No tienes activos aún" })
                  : t("noAssignedAssets", {
                      defaultValue: "No tienes activos asignados",
                    })}
              </h3>
              <p className="text-gray-600 mb-4">
                {user?.role === "propietario"
                  ? t("createFirstAsset", {
                      defaultValue:
                        "Comienza creando tu primer activo para gestionar tu cartera.",
                    })
                  : t("contactAdmin", {
                      defaultValue:
                        "Contacta con tu administrador para que te asigne activos.",
                    })}
              </p>
              <Link
                to="/buildings/crear"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t("createFirstAssetBtn", {
                  defaultValue: "Crear primer activo",
                })}
              </Link>
            </div>
          )}
        </div>

        {/* Barra de paginación */}
        {!loading && total > 0 && (
          <PaginationBar
            page={safePage}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>

      {/* Animaciones simples */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Line clamp utilities for text truncation */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        
        /* Smooth scrolling for mobile cards */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
