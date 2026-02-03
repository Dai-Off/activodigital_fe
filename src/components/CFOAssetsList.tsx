import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { BuildingCarousel } from "../components/BuildingCarousel";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

import {
  BuildingsApiService,
  formatBuildingValue,
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

import { getLatestRating } from "../utils/energyCalculations";
import { getBookByBuilding, type DigitalBook } from "../services/digitalbook";
import { getESGScore, type ESGResponse } from "../services/esg";

import AssetsSearchBar, { type SearchFilters } from "./ui/AssetsSearchBar";
import { Card } from "./ui/card";

/* -------------------------- Utils de presentaciÃ³n -------------------------- */
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
        <span className="font-medium">{start}</span>â€“
        <span className="font-medium">{end}</span>{" "}
        {t("of", { defaultValue: "de" })}{" "}
        <span className="font-medium">{total}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="page-size">
          {t("pageSize", { defaultValue: "TamaÃ±o de pÃ¡gina" })}
        </label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
          aria-label={t("pageSize", { defaultValue: "TamaÃ±o de pÃ¡gina" })}
          title={t("pageSize", { defaultValue: "TamaÃ±o de pÃ¡gina" })}
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} {t("perPage", { defaultValue: "/pÃ¡gina" })}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            className="rounded-md border border-gray-200 bg-white p-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => go(1)}
            disabled={page === 1}
            title={t("firstPage", { defaultValue: "Primera pÃ¡gina" })}
            aria-label={t("firstPage", { defaultValue: "Primera pÃ¡gina" })}
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
            {t("page", { defaultValue: "PÃ¡gina" })}{" "}
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
            title={t("lastPage", { defaultValue: "Ãšltima pÃ¡gina" })}
            aria-label={t("lastPage", { defaultValue: "Ãšltima pÃ¡gina" })}
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

/* ------------------------- Componentes de Indicadores ------------------------- */

// Componente para el indicador CEE (Certificado de Eficiencia EnergÃ©tica)
/*
function _CEERatingIndicator({
  building,
  certificates,
}: {
  building: Building;
  certificates: PersistedEnergyCertificate[];
}) {
  const buildingCerts = certificates.filter((cert) => cert.buildingId === building.id);

  if (buildingCerts.length === 0) {
    return <span className="text-sm text-gray-400">-</span>;
  }

  const rating = getLatestRating(buildingCerts);

  const color = getCEEColor(rating);

  return (
    <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center`}>
      <span className="text-xs font-medium text-white">{rating}</span>
    </div>
  );
}
*/

// Componente para el indicador ESG
/*
function _ESGScoreIndicator({
  building,
  esgData,
}: {
  building: Building;
  esgData: Map<string, ESGResponse>;
}) {
  const esg = esgData.get(building.id);

  if (!esg) return <span className="text-sm text-gray-400">-</span>;
  if (esg.status === 'incomplete') return <span className="text-sm text-gray-400">-</span>;
  if (esg.status === 'complete' && !esg.data) return <span className="text-sm text-gray-400">-</span>;

  const label = esg.data!.label;
  const color = getESGLabelColor(label);

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={color}
        className="w-6 h-6"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15))' }}
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
  );
}
*/

// Componente para el indicador de metros cuadrados
/*
function _SquareMetersIndicator({ building }: { building: Building }) {
  if (building.squareMeters && building.squareMeters > 0) {
    const formattedArea = building.squareMeters.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return <span className="text-sm font-medium text-gray-900">{formattedArea}</span>;
  }
  return <span className="text-sm text-gray-400">-</span>;
}
*/

// Componente para mostrar el estado del edificio (incluye â€œCompletadoâ€ si el libro estÃ¡ completo)
/*
function _BuildingStatusIndicator({
  building,
  digitalBooks,
}: {
  building: Building;
  digitalBooks: Map<string, DigitalBook>;
}) {
  const totalSections = 8;
  const book = digitalBooks.get(building.id);
  const completedSections = book?.progress || 0;

  const { t } = useTranslation();

  if (completedSections === totalSections) {
    return (
      <span className="text-sm font-medium text-green-600">
        {t('completed', { defaultValue: 'Completado' })} {completedSections}/{totalSections}
      </span>
    );
  }

  const statusLabel = (() => {
    switch (building.status) {
      case 'draft':
        return t('pending', { defaultValue: 'Pendiente' });
      case 'ready_book':
        return t('ready', { defaultValue: 'Listo' });
      case 'with_book':
        return t('inProgress', { defaultValue: 'En curso' });
      default:
        // fallback a etiqueta calculada por el servicio
        const lbl = getBuildingStatusLabel(building.status);
        return t(lbl, { defaultValue: lbl });
    }
  })();

  return (
    <span className="text-sm text-gray-900">
      {statusLabel} {completedSections}/{totalSections}
    </span>
  );
}

/* --------------------------------- PÃ¡gina --------------------------------- */
export default function CFOAssetsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

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

  // Estados para certificados energÃ©ticos, libros digitales y ESG
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

  // Filtros de bÃºsqueda y ordenamiento
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    sortField: "name",
    sortOrder: "asc",
    statusFilter: [],
    energyClassFilter: [],
    typologyFilter: [],
    occupationFilter: [],
    complianceFilter: [],
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
            const [certsResponse, book, esgScore] = await Promise.all([
              EnergyCertificatesService.getByBuilding(building.id).catch(
                () => ({
                  sessions: [],
                  certificates: [],
                })
              ),
              getBookByBuilding(building.id),
              getESGScore(building.id).catch(() => null),
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

  // Aplicar filtros y ordenamiento
  const filteredAndSortedBuildings = useMemo(() => {
    let result = [...buildings];

    // Ordenar por fecha de creaciÃ³n descendente (mÃ¡s recientes primero)
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Filtro de bÃºsqueda por texto (Soporta etiquetas localizadas)
    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      result = result.filter((building) => {
        // 1. Campos bÃ¡sicos
        const matchesBasic =
          building.name.toLowerCase().includes(term) ||
          building.address.toLowerCase().includes(term) ||
          building.cadastralReference?.toLowerCase().includes(term);
        if (matchesBasic) return true;

        // 2. TipologÃ­a (Localizada ES/EN)
        const typologies = {
          residential: { es: "residencial", en: "residential" },
          commercial: { es: "comercial", en: "commercial" },
          mixed: { es: "mixto", en: "mixed" },
        };
        const typ = typologies[building.typology as keyof typeof typologies];
        if (typ && (typ.es.includes(term) || typ.en.includes(term))) return true;

        // 3. Clase EnergÃ©tica (BÃºsqueda exacta de letra A-G)
        const certs = energyCertificates.filter(
          (c) => c.buildingId === building.id
        );
        const rating =
          certs.length > 0 ? getLatestRating(certs).toLowerCase().trim() : "";
        if (rating === term) return true;

        // 4. Cumplimiento (Basado en ESG Label)
        const esg = esgScores.get(building.id);
        const esgLabel =
          esg?.status === "complete" && esg.data?.label
            ? esg.data.label.toLowerCase()
            : "";

        const complianceTerms = {
          high: { es: "alto", en: "high" },
          medium: { es: "medio", en: "medium" },
          low: { es: "bajo", en: "low" },
        };

        let complianceLevel = "";
        if (["a", "b"].includes(esgLabel)) complianceLevel = "high";
        else if (["c", "d"].includes(esgLabel)) complianceLevel = "medium";
        else if (["e", "f", "g"].includes(esgLabel)) complianceLevel = "low";

        if (complianceLevel) {
          const ct =
            complianceTerms[complianceLevel as keyof typeof complianceTerms];
          if (ct.es.includes(term) || ct.en.includes(term)) return true;
        }

        return false;
      });
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

    // Filtro por clase energÃ©tica
    if (searchFilters.energyClassFilter.length > 0) {
      result = result.filter((building) => {
        const certs = energyCertificates.filter(
          (cert) => cert.buildingId === building.id
        );
        if (certs.length === 0) return false;
        const rating = getLatestRating(certs);
        return searchFilters.energyClassFilter.includes(rating.trim());
      });
    }

    // Filtro por TipologÃ­a
    if (searchFilters.typologyFilter.length > 0) {
      result = result.filter((building) =>
        searchFilters.typologyFilter.includes(building.typology)
      );
    }

    // Filtro por OcupaciÃ³n (Simulado con "Operativo" ya que estÃ¡ hardcoded en la vista)
    if (searchFilters.occupationFilter.length > 0) {
      result = result.filter((_building) => {
        // Asumimos que todos son "operativos" por ahora, como en la vista
        if (searchFilters.occupationFilter.includes("operative")) return true;
        return false;
      });
    }

    // Filtro por Cumplimiento (EstimaciÃ³n basada en ESG Label)
    if (searchFilters.complianceFilter.length > 0) {
      result = result.filter((building) => {
        const esg = esgScores.get(building.id);
        const label =
          esg?.status === "complete" && esg.data?.label ? esg.data.label : "Z";
        const high = ["A", "B"];
        const medium = ["C", "D"];
        const low = ["E", "F", "G"];

        if (
          searchFilters.complianceFilter.includes("high") &&
          high.includes(label)
        )
          return true;
        if (
          searchFilters.complianceFilter.includes("medium") &&
          medium.includes(label)
        )
          return true;
        if (
          searchFilters.complianceFilter.includes("low") &&
          low.includes(label)
        )
          return true;

        return false;
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

  const totalAssignedAssets = useMemo(() => {
    if (!user?.email) {
      return buildings.length;
    }

    const normalizedEmail = user.email.toLowerCase();

    return buildings.filter(
      (building) => building.cfoEmail?.toLowerCase() === normalizedEmail
    ).length;
  }, [buildings, user?.email]);

  // al cambiar tamaÃ±o, volver a pÃ¡g. 1
  const handlePageSizeChange = (s: number) => {
    setPageSize(s);
    setPage(1);
  };

  // Al cambiar filtros, volver a pÃ¡gina 1
  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="pt-2 pb-8 max-w-full">
        {/* Botones de acción - Todos los roles pueden crear edificios */}
        <div className="flex justify-end gap-3 mb-6">
          <Link
            to="/building/create"
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
          </Link>
        </div>

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
                  {t("roles.cfo", { defaultValue: "cfo" })}
                </span>
              </div>

              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                {/* Left Section */}
                <div className="flex-1 w-full lg:pr-6">
                  {/* Main Metrics - CFO Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4">
                    {/* 1. Valor total estimado de cartera */}
                    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">
                        {formatBuildingValue(
                          dashboardStats.totalValue ||
                            buildings.reduce(
                              (sum, b) => sum + (b.price || 0),
                              0
                            )
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {t("cfo.indicator.portfolioValue", {
                          defaultValue: "Valor total cartera",
                        })}
                      </div>
                    </div>
                    {/* 2. ROI promedio */}
                    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                        -
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {t("cfo.indicator.avgROI", {
                          defaultValue: "ROI promedio",
                        })}
                      </div>
                    </div>
                    {/* 3. Coste rehabilitación */}
                    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                        -
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {t("cfo.indicator.rehabCost", {
                          defaultValue: "Coste rehabilitación",
                        })}
                      </div>
                    </div>
                    {/* 4. TIR promedio */}
                    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 shadow-sm text-center">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                        -
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {t("cfo.indicator.avgIRR", {
                          defaultValue: "TIR promedio",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Separator Line */}
                  <div className="border-t border-gray-200 mb-4" />

                  {/* Performance Details - CFO */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-xs sm:text-sm text-gray-500 mb-2">
                        {t("cfo.indicator.greenRating", {
                          defaultValue: "% rating verde (A-B-C)",
                        })}
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        {/* Calcular % de activos con rating A, B o C */}
                        {(() => {
                          const ratingCount = buildings.filter((b) => {
                            const bCerts = energyCertificates.filter(
                              (c) => c.buildingId === b.id
                            );
                            const rating =
                              bCerts.length > 0
                                ? getLatestRating(bCerts)
                                : null;
                            return rating && ["A", "B", "C"].includes(rating);
                          }).length;
                          const percentage =
                            buildings.length > 0
                              ? Math.round(
                                  (ratingCount / buildings.length) * 100
                                )
                              : 0;
                          return `${percentage}%`;
                        })()}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-xs sm:text-sm text-gray-500 mb-2">
                        {t("cfo.indicator.avgPayback", {
                          defaultValue: "Payback promedio",
                        })}
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        -{" "}
                        <span className="text-sm font-normal text-gray-500">
                          {t("years", { defaultValue: "años" })}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-xs sm:text-sm text-gray-500 mb-2">
                        {t("cfo.indicator.assignedAssets", {
                          defaultValue: "Activos asignados",
                        })}
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        {totalAssignedAssets}
                      </div>
                    </div>
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
                        strokeDasharray={`${(() => {
                          const ratingCount = buildings.filter((b) => {
                            const bCerts = energyCertificates.filter(
                              (c) => c.buildingId === b.id
                            );
                            const rating =
                              bCerts.length > 0
                                ? getLatestRating(bCerts)
                                : null;
                            return rating && ["A", "B", "C"].includes(rating);
                          }).length;
                          const percentage =
                            buildings.length > 0
                              ? Math.round(
                                  (ratingCount / buildings.length) * 100
                                )
                              : 0;
                          return percentage;
                        })()}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-base sm:text-lg lg:text-xl font-bold text-green-500">
                          {(() => {
                            const ratingCount = buildings.filter((b) => {
                              const bCerts = energyCertificates.filter(
                                (c) => c.buildingId === b.id
                              );
                              const rating =
                                bCerts.length > 0
                                  ? getLatestRating(bCerts)
                                  : null;
                              return rating && ["A", "B", "C"].includes(rating);
                            }).length;
                            const percentage =
                              buildings.length > 0
                                ? Math.round(
                                    (ratingCount / buildings.length) * 100
                                  )
                                : 0;
                            return `${percentage}%`;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center max-w-[140px] sm:max-w-[160px]">
                    <div className="text-xs sm:text-sm text-gray-500 leading-tight">
                      {t("cfo.indicator.greenRatingShort", {
                        defaultValue: "% rating verde",
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

        {/* Barra de bÃºsqueda y filtros */}
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
                const ceeCerts = energyCertificates.filter(
                  (cert) => cert.buildingId === building.id
                );
                const ceeRating =
                  ceeCerts.length > 0 ? getLatestRating(ceeCerts) : "-";

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
                      onClick={() => navigate(`/cfo-intake/${building.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter")
                          navigate(`/cfo-intake/${building.id}`);
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

                        {/* Info Grid - CFO Specific Fields */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          {/* Valor actual */}
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              {t("cfo.card.currentValue", {
                                defaultValue: "Valor actual (€)",
                              })}
                            </p>
                            <p className="text-sm sm:text-lg font-medium text-gray-900 truncate">
                              {formatBuildingValue(building.price)}
                            </p>
                          </div>
                          {/* Coste rehabilitación */}
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              {t("cfo.card.rehabCost", {
                                defaultValue: "Coste rehab. (€)",
                              })}
                            </p>
                            <p className="text-sm sm:text-lg font-medium text-gray-900">
                              -
                            </p>
                          </div>
                          {/* ROI estimado */}
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 mb-1">
                              {t("cfo.card.estimatedROI", {
                                defaultValue: "ROI estimado (%)",
                              })}
                            </p>
                            <p className="text-sm sm:text-lg font-medium text-gray-900">
                              -
                            </p>
                          </div>
                        </div>

                        {/* Rating y Estado financiero */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4">
                          {/* Rating energético */}
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500">
                              {t("cfo.card.energyRating", {
                                defaultValue: "Rating energético",
                              })}
                              :
                            </p>
                            <div className="w-8 h-8 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-gray-900 text-sm font-medium">
                              {ceeRating}
                            </div>
                          </div>
                          {/* Estado financiero */}
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500">
                              {t("cfo.card.financialStatus", {
                                defaultValue: "Estado financiero",
                              })}
                              :
                            </p>
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3 h-3 rounded-full bg-orange-500"
                                title="Indefinido"
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {t("cfo.card.undefined", {
                                  defaultValue: "Indefinido",
                                })}
                              </span>
                            </div>
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
                {t("noAssetsYet", { defaultValue: "No tienes activos aún" })}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("createFirstAsset", {
                  defaultValue:
                    "Comienza creando tu primer activo para gestionar tu cartera.",
                })}
              </p>
              <Link
                to="/building/create"
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

        {/* Barra de paginaciÃ³n */}
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
