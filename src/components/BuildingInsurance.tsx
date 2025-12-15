import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { type InsurancePolicy } from "~/types/insurance";
import { insuranceApiService } from "~/services/insurance";
import { BuildingInsuranceLoading } from "./ui/dashboardLoading";
import {
  Building,
  Shield,
  Euro,
  Calendar,
  FileText,
  Zap,
  Droplets,
  Wind,
  Flame,
  Users,
  CircleCheck,
  CircleX,
  Hammer,
  Upload,
  TriangleAlert,
} from "lucide-react";

// --- 1. HELPERS GLOBALES ---

const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCurrency = (amount: number) => {
  return "€" + formatNumber(amount);
};

const formatMoney = (val: number) => "€" + formatNumber(val);

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("es-ES");
};

// --- 2. CONFIGURACIÓN VISUAL ---

const COVERAGE_CONFIG: Record<
  string,
  {
    label: string;
    description: string;
    icon: any;
    formatAmount?: (val: number) => string;
  }
> = {
  // Multirriesgo / Generales
  fire: {
    label: "Continente (edificio)",
    description: "Incendio, explosión, rayo",
    icon: Flame,
  },
  earthquake: {
    label: "Sismo / Terremoto",
    description: "Daños estructurales",
    icon: Hammer,
  },
  contents: {
    label: "Contenido",
    description: "Mobiliario y equipamiento",
    icon: FileText,
  },
  water_damage: {
    label: "Daños por agua",
    description: "Roturas, filtraciones",
    icon: Droplets,
    formatAmount: (val) =>
      val === 0 ? "Incluido en continente" : formatCurrency(val),
  },
  rent_loss: {
    label: "Pérdida de rentas",
    description: "Hasta 12 meses",
    icon: Euro,
  },
  electrical: {
    label: "Daños eléctricos",
    description: "Sobretensión, cortocircuito",
    icon: Zap,
  },
  weather: {
    label: "Fenómenos atmosféricos",
    description: "Viento, granizo, nieve",
    icon: Wind,
    formatAmount: (val) =>
      val === 0 ? "Incluido en continente" : formatCurrency(val),
  },
  glass_breakage: {
    label: "Rotura de cristales",
    description: "Lunas y espejos",
    icon: Wind,
  },
  theft: {
    label: "Robo y vandalismo",
    description: "Con franquicia €150",
    icon: Shield,
  },
  rc_included: {
    label: "Resp. Civil incluida",
    description: "RC arrendador",
    icon: Users,
  },
  civil_liability: {
    label: "Responsabilidad Civil",
    description: "Cobertura general",
    icon: Users,
  },

  // RC Adicional / Impago
  rc_general: { label: "RC General", description: "", icon: null },
  rc_material: { label: "Daños materiales", description: "", icon: null },
  rc_personal: { label: "Lesiones personales", description: "", icon: null },
  rc_defense: { label: "Defensa jurídica", description: "", icon: null },
  rent_default: {
    label: "Rentas impagadas cubiertas",
    description: "",
    icon: null,
    formatAmount: () => "12 meses",
  },
  legal_fees: {
    label: "Gastos jurídicos (desahucio)",
    description: "",
    icon: null,
  },
  property_damage: {
    label: "Daños en la propiedad",
    description: "",
    icon: null,
  },
};

// --- 3. SUB-COMPONENTE DE TARJETA ---

function InsurancePolicyCard({ policy }: { policy: InsurancePolicy }) {
  // 1. DETECCIÓN DE TIPO MÁS ROBUSTA (Español e Inglés/Keys)
  const typeLower = policy.coverageType?.toLowerCase() || "";

  // Configuración por defecto
  let theme = {
    color: "gray",
    bgIcon: "bg-gray-50",
    textIcon: "text-gray-600",
    icon: FileText,
    title: policy.coverageType || "Póliza de Seguro",
    checkColor: "text-gray-600",
    isGrid: true,
  };

  // Lógica de asignación de iconos y colores
  // A. MULTIRRIESGO (Edificio)
  if (
    typeLower.includes("multirriesgo") ||
    typeLower.includes("edificio") ||
    typeLower.includes("all_risk") ||
    typeLower.includes("fire")
  ) {
    theme = {
      color: "blue",
      bgIcon: "bg-blue-50",
      textIcon: "text-blue-600",
      icon: Building,
      title: "Seguro Multirriesgo del Edificio",
      checkColor: "text-green-600",
      isGrid: true,
    };
  }
  // B. RESPONSABILIDAD CIVIL
  else if (
    typeLower.includes("rc") ||
    typeLower.includes("civil") ||
    typeLower.includes("liability")
  ) {
    theme = {
      color: "green",
      bgIcon: "bg-green-50",
      textIcon: "text-green-600",
      icon: Shield,
      title: "Seguro de Responsabilidad Civil Adicional",
      checkColor: "text-green-600",
      isGrid: false,
    };
  }
  // C. IMPAGO DE RENTAS
  else if (
    typeLower.includes("impago") ||
    typeLower.includes("rentas") ||
    typeLower.includes("rent") ||
    typeLower.includes("default")
  ) {
    theme = {
      color: "orange",
      bgIcon: "bg-orange-50",
      textIcon: "text-orange-600",
      icon: Euro,
      title: "Seguro de Impago de Rentas",
      checkColor: "text-orange-600",
      isGrid: false,
    };
  }

  const MainIcon = theme.icon;

  // Preparar lista de coberturas
  const coverages = Object.entries(policy.coverageDetails)
    .filter(([_, item]) => item && item.covered)
    .map(([key, item]) => {
      const config = COVERAGE_CONFIG[key] || {
        label: key, // Fallback: usa la key si no hay config
        description: "",
        icon: CircleCheck,
      };
      const displayAmount = config.formatAmount
        ? config.formatAmount(item!.amount)
        : formatCurrency(item!.amount);
      return { key, ...item, config, displayAmount };
    });

  // Preparar lista de franquicias
  const deductibles = Object.entries(policy.coverageDetails)
    .filter(([_, item]) => item && item.deductible && item.deductible > 0)
    .map(([key, item]) => ({
      label:
        key === "fire"
          ? "General"
          : COVERAGE_CONFIG[key]?.label.split(" ")[0] || key,
      amount: item!.deductible,
    }));

  return (
    <div
      data-slot="card"
      className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-4"
    >
      {/* Header Tarjeta */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${theme.bgIcon} rounded-lg`}>
            <MainIcon className={`w-5 h-5 ${theme.textIcon}`} />
          </div>
          <div>
            <h4 className="text-sm ">{theme.title}</h4>
            <p className="text-xs text-gray-500">
              Póliza: {policy.policyNumber}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Prima anual</div>
          <div className="text-sm">{formatCurrency(policy.annualPremium)}</div>
        </div>
      </div>

      {/* Info Básica */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Aseguradora</div>
          <div className="text-sm">{policy.insurer}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Vigencia</div>
          <div className="text-sm truncate">
            {formatDate(policy.issueDate)} - {formatDate(policy.expirationDate)}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Estado</div>
          <div
            className={`text-xs px-2 py-1 rounded-full inline-block border w-fit ${
              policy.status === "active"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            {policy.status === "active" ? "Vigente" : policy.status}
          </div>
        </div>
      </div>

      {/* Sección Coberturas */}
      <div className="border-t border-gray-200 pt-3">
        <h5 className="text-xs mb-3 flex items-center gap-2 ">
          <CircleCheck className={`w-4 h-4 ${theme.checkColor}`} />
          {theme.title.includes("Impago")
            ? "Coberturas Impago"
            : theme.title.includes("Responsabilidad")
            ? "Coberturas RC"
            : "Coberturas Incluidas"}
        </h5>

        <div
          className={
            theme.isGrid ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-2"
          }
        >
          {coverages.map((cov) => {
            const Icon = cov.config.icon;

            // Diseño Lista (RC / Impago)
            if (!theme.isGrid) {
              return (
                <div
                  key={cov.key}
                  className="flex justify-between items-center"
                >
                  <span className="text-xs text-gray-600">
                    {cov.config.label}
                  </span>
                  <span className="text-sm">{cov.displayAmount}</span>
                </div>
              );
            }

            // Diseño Grid (Multirriesgo)
            return (
              <div key={cov.key}>
                <div className="flex items-center gap-2 mb-1">
                  {Icon && <Icon className={`w-3 h-3 ${theme.textIcon}`} />}
                  <span className="text-xs text-gray-700">
                    {cov.config.label}
                  </span>
                </div>
                <div className="text-sm ml-5">{cov.displayAmount}</div>
                {cov.config.description && (
                  <div className="text-xs text-gray-500 ml-5">
                    {cov.config.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nota especial para RC Adicional */}
        {theme.title.includes("Responsabilidad Civil") && (
          <div className="mt-3 bg-green-50 rounded-lg p-2 border border-green-200">
            <p className="text-xs text-green-900">
              ✓ Sin franquicia • Cobertura mundial • Incluye litigios
            </p>
          </div>
        )}
      </div>

      {/* Sección Franquicias */}
      {deductibles.length > 0 && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <h5 className="text-xs mb-2 flex items-center gap-2 text-red-600 ">
            <CircleX className="w-4 h-4" />
            Franquicias Aplicables
          </h5>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {deductibles.map((d, i) => (
              <div
                key={i}
                className="bg-red-50 rounded p-2 border border-red-200"
              >
                <span className="text-gray-600">{d.label}:</span>{" "}
                <span className="text-red-700">
                  {formatCurrency(d.amount!)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- 4. COMPONENTE PRINCIPAL (BuildingInsurance) ---

export function BuildingInsurance() {
  const { id: buildingId } = useParams<{ id: string }>();
  const [policies, setPolicies] = useState<InsurancePolicy[] | undefined>();
  const [loading, setLoading] = useState(true);

  // Estados calculados para los KPIs
  const [kpiData, setKpiData] = useState({
    totalPremium: 0,
    buildingCoverage: 0,
    liabilityCoverage: 0,
    activePoliciesCount: 0,
  });

  useEffect(() => {
    if (!buildingId) {
      setLoading(false);
      return;
    }

    insuranceApiService
      .getBuildingInsurances(buildingId)
      .then((data) => {
        const loadedPolicies = data.data;
        setPolicies(loadedPolicies);

        // --- CÁLCULO DE KPIs ---
        let totalPrem = 0;
        let bldCov = 0;
        let liabCov = 0;
        let activeCount = 0;

        loadedPolicies.forEach((p) => {
          totalPrem += p.annualPremium || 0;
          if (p.status === "active") activeCount++;

          // Continente (proxy 'fire')
          if (
            p.coverageDetails.fire?.covered &&
            p.coverageDetails.fire.amount
          ) {
            bldCov += p.coverageDetails.fire.amount;
          }

          // RC
          if (
            p.coverageDetails.civil_liability?.covered &&
            p.coverageDetails.civil_liability.amount
          ) {
            liabCov += p.coverageDetails.civil_liability.amount;
          }
          // Sumar RC adicional
          if (
            p.coverageDetails.rc_general?.covered &&
            p.coverageDetails.rc_general.amount
          ) {
            liabCov += p.coverageDetails.rc_general.amount;
          }
        });

        setKpiData({
          totalPremium: totalPrem,
          buildingCoverage: bldCov,
          liabilityCoverage: liabCov,
          activePoliciesCount: activeCount,
        });
      })
      .catch((error) => {
        console.error("Error al cargar seguros:", error);
        setPolicies(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [buildingId]);

  if (loading) {
    return <BuildingInsuranceLoading />;
  }

  // Empty State
  if (!policies || policies.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto mt-2 pr-1">
        <div className="space-y-3">
          {/* Header Empty */}
          <div
            data-slot="card"
            className="flex flex-col gap-6 rounded-xl border p-4 bg-[#1e3a8a] text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                  <Shield className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg">Gestión de Seguros del Inmueble</h3>
                  <p className="text-sm text-white/80 mt-1">
                    0 pólizas activas • Es hora de asegurar este edificio.
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm shadow-lg">
                <Upload className="w-4 h-4" />
                Cargar Primera Póliza
              </button>
            </div>
          </div>

          {/* KPIs Vacíos */}
          <div className="grid grid-cols-4 gap-2">
            <div
              data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs text-gray-600">Cobertura Edificio</h4>
              </div>
              <div className="text-lg text-gray-400">€0</div>
              <div className="text-xs text-gray-500 mt-1">Valor asegurado</div>
            </div>
            {/* ... Resto de KPIs vacíos ... */}
            <div
              data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <h4 className="text-xs text-gray-600">Resp. Civil</h4>
              </div>
              <div className="text-lg text-gray-400">€0</div>
              <div className="text-xs text-gray-500 mt-1">Límite máximo</div>
            </div>
            <div
              data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <Euro className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs text-gray-600">Prima Total</h4>
              </div>
              <div className="text-lg text-gray-400">€0</div>
              <div className="text-xs text-gray-500 mt-1">Anual</div>
            </div>
            <div
              data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs text-gray-600">Estado</h4>
              </div>
              <div className="text-xs px-2 py-1 rounded-full inline-block border bg-red-100 text-red-700 border-red-200">
                ✖️ No Asegurado
              </div>
              <div className="text-xs text-gray-500 mt-1">
                No hay pólizas registradas
              </div>
            </div>
          </div>

          <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-xl mt-4">
            <Shield className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg text-gray-700 mb-2">
              No hay pólizas de seguro registradas.
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Sube la primera póliza para gestionar las coberturas.
            </p>
            <button className="flex items-center gap-2 px-6 py-2 mx-auto bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md">
              <Upload className="w-4 h-4" /> Comenzar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- CONTENIDO PRINCIPAL ---
  return (
    <div className="flex-1 overflow-y-auto mt-2 pr-1">
      <div className="space-y-3">
        {/* Encabezado */}
        <div
          data-slot="card"
          className="flex flex-col gap-6 rounded-xl border p-4 bg-[#1e3a8a] text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg border border-white/20">
                <Shield className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg">Gestión de Seguros del Inmueble</h3>
                <p className="text-sm text-white/80 mt-1">
                  {kpiData.activePoliciesCount} pólizas activas • Prima total
                  anual: {formatMoney(kpiData.totalPremium)}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm shadow-lg ">
              <Upload className="w-4 h-4" aria-hidden="true" />
              Analizar Nueva Póliza
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs text-gray-600">Cobertura Edificio</h4>
            </div>
            <div className="text-lg ">
              {formatMoney(kpiData.buildingCoverage)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Valor asegurado</div>
          </div>
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600" />
              <h4 className="text-xs text-gray-600">Resp. Civil</h4>
            </div>
            <div className="text-lg ">
              {formatMoney(kpiData.liabilityCoverage)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Límite máximo</div>
          </div>
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="w-4 h-4 text-orange-600" />
              <h4 className="text-xs text-gray-600">Prima Total</h4>
            </div>
            <div className="text-lg ">{formatMoney(kpiData.totalPremium)}</div>
            <div className="text-xs text-gray-500 mt-1">Anual</div>
          </div>
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 p-3 relative group">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs text-gray-600">Estado</h4>
            </div>
            <div className="text-xs px-2 py-1 rounded-full inline-block border bg-green-100 text-green-700 border-green-200  w-fit">
              ✓ Vigente
            </div>
            <div className="text-xs text-gray-500 mt-1">Todas las pólizas</div>
          </div>
        </div>

        {/* Lista de Pólizas Modular */}
        <div className="space-y-3">
          {policies.map((policy) => (
            <InsurancePolicyCard key={policy.id} policy={policy} />
          ))}
        </div>

        {/* Recordatorios */}
        <div
          data-slot="card"
          className="text-card-foreground flex flex-col gap-6 rounded-xl border p-3 bg-yellow-50 border-yellow-200"
        >
          <div className="flex items-start gap-2">
            <TriangleAlert className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs text-yellow-900 mb-2 ">
                Recordatorios de Seguros
              </h4>
              <div className="space-y-1 text-xs text-yellow-700">
                <div>• Renovación Multirriesgo en 365 días (31/12/2025)</div>
                <div>• Próximo pago trimestral RC: 15/03/2025 - €950</div>
                <div>
                  • Actualizar tasación edificio antes de renovación anual
                </div>
                <div>• Revisar inventario de contenidos asegurados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
