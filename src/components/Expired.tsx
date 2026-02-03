import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ChevronRight,
  TriangleAlert,
  CircleAlert,
  Clock,
  Shield,
  FileCheck,
  Euro,
  Wrench,
  FileText,
  Search,
  Building,
  House,
  Calendar,
} from "lucide-react";
import {
  getExpiredKpis,
  getExpiredCategories,
  getExpiredList,
  getAvailableFilters,
  type ExpiredKpis,
  type ExpiredCategory,
  type ExpiredDocument,
  type AvailableFilters,
} from "~/services/expiredApi";

export default function Expired() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<ExpiredKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ExpiredCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [documents, setDocuments] = useState<ExpiredDocument[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState<
    "mas_retrasado" | "menos_retrasado" | "mas_reciente" | "menos_reciente"
  >("mas_retrasado");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    tipos_documento: [],
    categorias: [],
    edificios: [],
  });
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    getExpiredKpis()
      .then(setKpis)
      .catch(() => setKpis(null))
      .finally(() => setLoading(false));

    getExpiredCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));

    getAvailableFilters()
      .then(setAvailableFilters)
      .catch(() =>
        setAvailableFilters({
          tipos_documento: [],
          categorias: [],
          edificios: [],
        })
      )
      .finally(() => setLoadingFilters(false));
  }, []);

  const getCategoryCount = (nombre: string) => {
    const match = categories.find((c) => c.nombre === nombre);
    return match?.cantidad ?? 0;
  };

  useEffect(() => {
    setLoadingList(true);
    getExpiredList({
      search: search || undefined,
      building_id: buildingFilter !== "all" ? buildingFilter : undefined,
      unidad: unitFilter !== "all" ? unitFilter : undefined,
      prioridad:
        priorityFilter === "all"
          ? "todas"
          : (priorityFilter as "alta" | "media" | "baja"),
      categoria: categoryFilter !== "all" ? categoryFilter : undefined,
      sort,
      page,
      limit,
    })
      .then((resp) => {
        setDocuments(resp.items || []);
        setTotal(resp.total || 0);
      })
      .catch(() => {
        setDocuments([]);
        setTotal(0);
      })
      .finally(() => setLoadingList(false));
  }, [
    search,
    buildingFilter,
    unitFilter,
    priorityFilter,
    categoryFilter,
    sort,
    page,
    limit,
  ]);

  const totalVencidos = kpis?.total_vencidos ?? 0;
  const totalLabel = `${total} ${t("of")} ${totalVencidos}`;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-t border-b border-gray-200 bg-gray-50 py-2.5 -mx-2 md:-mx-4 lg:-mx-6">
        <nav
          className="flex items-center gap-2 text-sm pl-2 md:pl-4 lg:pl-6 pr-2 md:pr-4 lg:pr-6"
          aria-label={t("breadcrumb")}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/expired")}
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors group"
              aria-label={t("goToArchive")}
            >
              <Archive className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="group-hover:underline">
                {t("archive")}
              </span>
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-gray-900 font-medium">
              <span>{t("documents")}</span>
            </div>
          </div>
        </nav>
      </div>

      <div className="px-2 md:px-4 lg:px-6 py-8 md:py-10 space-y-4 flex-1 flex flex-col min-h-0 w-full">
        <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Archive className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-gray-900 text-lg font-normal">
                {t("expireTitle")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t(
                  "expireSubtitle",
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TriangleAlert className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("expireTotal")}
                  </p>
                  <p className="text-2xl text-gray-900">
                    {loading || !kpis ? "—" : kpis.total_vencidos}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("highPriority")}
                  </p>
                  <p className="text-2xl text-gray-900">
                    {loading || !kpis ? "—" : kpis.alta_prioridad}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("mediumPriority", "Media Prioridad")}
                  </p>
                  <p className="text-2xl text-gray-900">
                    {loading || !kpis ? "—" : kpis.media_prioridad}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("avgDays", "Promedio Retraso")}
                  </p>
                  <p className="text-2xl text-gray-900">
                    {loading || !kpis ? "—" : `${kpis.dias_promedio} ${t("days", "días")}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Euro className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("totalDebt", "Coste Total")}
                  </p>
                  <p className="text-2xl text-gray-900">
                    {loading || !kpis
                      ? "—"
                      : new Intl.NumberFormat("es-ES", {
                          style: "currency",
                          currency: "EUR",
                          maximumFractionDigits: 0,
                        }).format(kpis.deuda_total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("noCoverage", "Seguros Vencidos")}
                  </p>
                  <p className="text-2xl text-gray-900">
                    {loading || !kpis ? "—" : kpis.sin_cobertura}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex-shrink-0">
          <h3 className="text-sm mb-3">
            {t("categoriesTitle", "Categorías de Vencimientos")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategoryFilter(categoryFilter === "Certificados" ? "all" : "Certificados");
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                categoryFilter === "Certificados"
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform rotate-90 ${
                  categoryFilter === "Certificados" ? "text-red-600" : "text-gray-400"
                }`} />
              </div>
              <p className={`text-sm mb-1 ${
                categoryFilter === "Certificados" ? "text-gray-900" : ""
              }`}>
                {t("categoryCertificados")}
              </p>
              <p className="text-sm text-red-600">
                {loadingCategories
                  ? "—"
                  : `${getCategoryCount("Certificados")} ${t("vencidos")}`}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategoryFilter(categoryFilter === "Contratos" ? "all" : "Contratos");
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                categoryFilter === "Contratos"
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileCheck className="w-5 h-5 text-red-600" />
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform rotate-90 ${
                  categoryFilter === "Contratos" ? "text-red-600" : "text-gray-400"
                }`} />
              </div>
              <p className={`text-sm mb-1 ${
                categoryFilter === "Contratos" ? "text-gray-900" : ""
              }`}>
                {t("categoryContratos")}
              </p>
              <p className="text-sm text-red-600">
                {loadingCategories
                  ? "—"
                  : `${getCategoryCount("Contratos")} ${t("vencidos")}`}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategoryFilter(categoryFilter === "Inspecciones" ? "all" : "Inspecciones");
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                categoryFilter === "Inspecciones"
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CircleAlert className="w-5 h-5 text-orange-600" />
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform rotate-90 ${
                  categoryFilter === "Inspecciones" ? "text-red-600" : "text-gray-400"
                }`} />
              </div>
              <p className={`text-sm mb-1 ${
                categoryFilter === "Inspecciones" ? "text-gray-900" : ""
              }`}>
                {t("categoryInspecciones")}
              </p>
              <p className="text-sm text-red-600">
                {loadingCategories
                  ? "—"
                  : `${getCategoryCount("Inspecciones")} ${t("vencidos")}`}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategoryFilter(categoryFilter === "Pagos" ? "all" : "Pagos");
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                categoryFilter === "Pagos"
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Euro className="w-5 h-5 text-red-600" />
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform rotate-90 ${
                  categoryFilter === "Pagos" ? "text-red-600" : "text-gray-400"
                }`} />
              </div>
              <p className={`text-sm mb-1 ${
                categoryFilter === "Pagos" ? "text-gray-900" : ""
              }`}>
                {t("categoryPagos")}
              </p>
              <p className="text-sm text-red-600">
                {loadingCategories
                  ? "—"
                  : `${getCategoryCount("Pagos")} ${t("vencidos")}`}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategoryFilter(categoryFilter === "Mantenimiento" ? "all" : "Mantenimiento");
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                categoryFilter === "Mantenimiento"
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Wrench className="w-5 h-5 text-yellow-600" />
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform rotate-90 ${
                  categoryFilter === "Mantenimiento" ? "text-red-600" : "text-gray-400"
                }`} />
              </div>
              <p className={`text-sm mb-1 ${
                categoryFilter === "Mantenimiento" ? "text-gray-900" : ""
              }`}>
                {t("categoryMantenimiento")}
              </p>
              <p className="text-sm text-red-600">
                {loadingCategories
                  ? "—"
                  : `${getCategoryCount("Mantenimiento")} ${t("vencidos")}`}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategoryFilter(categoryFilter === "Documentos" ? "all" : "Documentos");
              }}
              className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                categoryFilter === "Documentos"
                  ? "border-red-500 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform rotate-90 ${
                  categoryFilter === "Documentos" ? "text-red-600" : "text-gray-400"
                }`} />
              </div>
              <p className={`text-sm mb-1 ${
                categoryFilter === "Documentos" ? "text-gray-900" : ""
              }`}>
                {t("categoryDocumentos")}
              </p>
              <p className="text-sm text-red-600">
                {loadingCategories
                  ? "—"
                  : `${getCategoryCount("Documentos")} ${t("vencidos")}`}
              </p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="p-5 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder={t("searchPlaceholder")}
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 text-sm focus:ring-2 focus:ring-[#1e3a8a]"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={buildingFilter}
                    onChange={(e) => {
                      setPage(1);
                      setBuildingFilter(e.target.value);
                    }}
                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors min-w-[180px] focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none focus:border-gray-300"
                  >
                    <option value="all">
                      {t("allBuildings")}
                    </option>
                    {loadingFilters ? (
                      <option disabled>
                        {t("loading")}
                      </option>
                    ) : (
                      availableFilters.edificios.map((edificio) => (
                        <option key={edificio.id} value={edificio.id}>
                          {edificio.nombre}
                        </option>
                      ))
                    )}
                  </select>
                  <Building
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <ChevronRight
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <div className="relative">
                  <select
                    value={unitFilter}
                    onChange={(e) => {
                      setPage(1);
                      setUnitFilter(e.target.value);
                    }}
                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors min-w-[150px] focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none focus:border-gray-300"
                  >
                    <option value="all">
                      {t("allUnits")}
                    </option>
                  </select>
                  <House
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <ChevronRight
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => {
                      setPage(1);
                      setPriorityFilter(e.target.value);
                    }}
                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors min-w-[150px] focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none focus:border-gray-300"
                  >
                    <option value="all">
                      {t("allPriorities")}
                    </option>
                    <option value="alta">
                      {t("priorityHigh")}
                    </option>
                    <option value="media">
                      {t("priorityMedium")}
                    </option>
                    <option value="baja">
                      {t("priorityLow")}
                    </option>
                  </select>
                  <TriangleAlert
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <ChevronRight
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(
                        e.target
                          .value as
                          | "mas_retrasado"
                          | "menos_retrasado"
                          | "mas_reciente"
                          | "menos_reciente",
                      )
                    }
                    className="px-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white appearance-none cursor-pointer hover:border-gray-400 transition-colors focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none focus:border-gray-300"
                  >
                    <option value="mas_retrasado">
                      {t("sortMostDelayed")}
                    </option>
                    <option value="menos_retrasado">
                      {t("sortLeastDelayed")}
                    </option>
                    <option value="mas_reciente">
                      {t("sortNewest")}
                    </option>
                    <option value="menos_reciente">
                      {t("sortOldest")}
                    </option>
                  </select>
                  <ChevronRight
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 whitespace-nowrap">
                {totalLabel}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loadingList ? (
              <div className="text-xs text-gray-500">
                {t("loadingList")}
              </div>
            ) : documents.length === 0 ? (
              <div className="text-xs text-gray-500">
                {t("emptyList")}
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const prioridad = doc.prioridad_calculada || "media";
                  const prioridadLabel =
                    prioridad === "alta"
                      ? t("priorityHigh")
                      : prioridad === "media"
                        ? t("priorityMedium")
                        : t("priorityLow");
                  const borderColor =
                    prioridad === "alta"
                      ? "border-l-red-500"
                      : prioridad === "media"
                        ? "border-l-orange-500"
                        : "border-l-yellow-500";
                  const containerBg =
                    prioridad === "alta"
                      ? "bg-red-50"
                      : prioridad === "media"
                        ? "bg-orange-50"
                        : "bg-yellow-50";
                  const diasLabel =
                    doc.dias_vencido && doc.dias_vencido > 0
                      ? t("expiredDaysAgo", {
                          days: doc.dias_vencido,
                        })
                      : null;
                  const contenido = doc.contenido_extraido || {};
                  const resumen = contenido.resumen || "";
                  const categoria =
                    contenido.categoria || doc.tipo_documento || "";
                  const vigencia = contenido.vigencia || "";
                  const consecuencia = contenido.consecuencia || "";
                  const importe = contenido.importe || "";

                  return (
                    <div
                      key={doc.id}
                      className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer border-l-4 ${borderColor} ${containerBg}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                            <Shield className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-sm truncate">
                                {doc.tipo_documento}
                              </h3>
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 text-xs bg-red-100 text-red-700">
                                {prioridadLabel}
                              </span>
                              {diasLabel && (
                                <span className="flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs bg-red-100 text-red-700">
                                  {diasLabel}
                                </span>
                              )}
                            </div>
                            {resumen && (
                              <p className="text-xs text-gray-600 mb-2">
                                {resumen}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                              {doc.building_name && (
                                <>
                                  <span>{doc.building_name}</span>
                                  <span>•</span>
                                </>
                              )}
                              {categoria && <span>{categoria}</span>}
                              {vigencia && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {t("vencidoEl")}{" "}
                                    {vigencia}
                                  </span>
                                </>
                              )}
                              {importe && (
                                <>
                                  <span>•</span>
                                  <span className="text-red-600">{importe}</span>
                                </>
                              )}
                            </div>
                            {consecuencia && (
                              <div className="p-2 bg-red-50 rounded border border-red-200">
                                <p className="text-xs">
                                  <span className="text-red-600">
                                    {t("consequenceLabel")}
                                  </span>
                                  <span className="text-gray-900">
                                    {consecuencia}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all text-primary-foreground rounded-md gap-1.5 h-8 px-3 text-xs bg-red-600 hover:bg-red-700"
                          >
                            {t("resolveNow")}
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground rounded-md gap-1.5 h-8 w-8 p-0"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="w-4 h-4 text-gray-600"
                              aria-hidden="true"
                            >
                              <path
                                d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

