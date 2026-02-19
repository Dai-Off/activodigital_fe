import {
  Building2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  Download,
  Info,
  LucideAward,
  LucideScale,
  LucideWrench,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { DataRoomExportService } from "~/services/dataRoomExport";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect, useCallback } from "react";
import DocumentItem from "./componentes/DocumentItem";
// import { useNavigation } from "~/contexts/NavigationContext";
import {
  fetchDataRoomAudit,
  uploadDataRoomFile,
  downloadDossierPdf,
} from "~/services/dataRoom";
import { toast } from "sonner";

const DataRoom = () => {
  const { t } = useTranslation();
  // TODO: reemplazar por selectedBuildingId dinámico cuando el selector de OpportunityRadar esté integrado
  // const { selectedBuildingId } = useNavigation();
  const selectedBuildingId = "9614dbd4-2ee3-4ed1-bfb3-b2431f27f58c";
  const [auditData, setAuditData] = useState<Record<string, any>>({});
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [isDownloadingDossier, setIsDownloadingDossier] = useState(false);

  interface Category {
    id: string;
    name: string;
    icon: typeof Building2;
    guide: string;
    color: string;
    mandatory: number;
    verified: number;
    optional: number;
    subcategories: number;
  }

  interface Document {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    type: "mandatory" | "optional";
    status: "verified" | "pending" | "rejected";
  }

  // Definición base de categorías (sin conteos)
  const categoryDefs = [
    {
      id: "technical",
      name: t("dataRoom.technicalDocs"),
      icon: LucideWrench,
      guide: t("dataRoom.guideTechnical"),
      color: "blue",
    },
    {
      id: "legal",
      name: t("dataRoom.legalDocs"),
      icon: LucideScale,
      guide: t("dataRoom.guideLegal"),
      color: "purple",
    },
    {
      id: "financial",
      name: t("dataRoom.financialDocs"),
      icon: LucideAward,
      guide: t("dataRoom.guideFinancial"),
      color: "green",
    },
    {
      id: "fiscal",
      name: t("dataRoom.fiscalDocs"),
      icon: LucideAward,
      guide: t("dataRoom.guideFiscal"),
      color: "orange",
    },
  ];

  const documents: Document[] = [
    {
      id: "escritura_constitucion",
      name: "Escritura de constitución de la sociedad",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estatutos_sociales",
      name: "Estatutos sociales vigentes (última versión actualizada)",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cif_registro_mercantil",
      name: "CIF y registro mercantil",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "composicion_accionarial",
      name: "Composición accionarial actualizada (últimos 5 años)",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "optional",
      status: "pending",
    },
    {
      id: "poderes_representacion",
      name: "Poderes de representación vigentes",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "actas_consejo_administracion",
      name: "Actas del Consejo de Administración (últimos 3 años)",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "optional",
      status: "pending",
    },
    {
      id: "actas_juntas_generales",
      name: "Actas de Juntas Generales (últimos 3 años)",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "optional",
      status: "pending",
    },
    {
      id: "registro_ubo",
      name: "Registro de administradores y beneficiarios finales (UBO)",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_operaciones_vinculadas",
      name: "Declaración de operaciones vinculadas",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "optional",
      status: "pending",
    },
    {
      id: "organigrama_corporativo",
      name: "Organigrama corporativo actualizado",
      category: "legal",
      subcategory: "Constitución y gobernanza",
      type: "optional",
      status: "pending",
    },
    {
      id: "escritura_compraventa",
      name: "Escritura pública de compraventa del inmueble",
      category: "legal",
      subcategory: "Propiedad del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "nota_simple",
      name: "Nota simple registral actualizada (máx. 3 meses)",
      category: "legal",
      subcategory: "Propiedad del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificado_dominio_cargas",
      name: "Certificado de dominio y cargas",
      category: "legal",
      subcategory: "Propiedad del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "titulo_propiedad_completo",
      name: "Título de propiedad completo con trazabilidad",
      category: "legal",
      subcategory: "Propiedad del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "obra_nueva_division_horizontal",
      name: "Declaración de obra nueva y división horizontal",
      category: "legal",
      subcategory: "Propiedad del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "libro_edificio_legal",
      name: "Libro del edificio completo",
      category: "legal",
      subcategory: "Propiedad del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "reglamento_regimen_interior",
      name: "Reglamento de régimen interior (si aplica comunidad)",
      category: "legal",
      subcategory: "Propiedad del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "actas_comunidad_propietarios",
      name: "Actas de la comunidad de propietores (últimos 5 años)",
      category: "legal",
      subcategory: "Propiedad del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "certificado_aeat",
      name: "Certificado de estar al corriente con AEAT",
      category: "fiscal",
      subcategory: "Compliance y regulatorio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificado_ss",
      name: "Certificado de estar al corriente con Seguridad Social",
      category: "fiscal",
      subcategory: "Compliance y regulatorio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaraciones_fiscales_3_ejercicios",
      name: "Declaraciones fiscales (últimos 3 ejercicios): IVA, IS, IRPF",
      category: "fiscal",
      subcategory: "Compliance y regulatorio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificado_deudas_ayuntamiento",
      name: "Certificado de no tener deudas con ayuntamiento",
      category: "fiscal",
      subcategory: "Compliance y regulatorio",
      type: "optional",
      status: "pending",
    },
    {
      id: "certificado_blanqueo_capitales",
      name: "Certificado prevención blanqueo de capitales",
      category: "legal",
      subcategory: "Compliance y regulatorio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "politica_compliance",
      name: "Política de compliance y prevención de delitos",
      category: "legal",
      subcategory: "Compliance y regulatorio",
      type: "optional",
      status: "pending",
    },
    {
      id: "registro_sanciones",
      name: "Registro de sanciones y procedimientos administrativos",
      category: "legal",
      subcategory: "Compliance y regulatorio",
      type: "optional",
      status: "pending",
    },
    {
      id: "certificado_no_concursal",
      name: "Certificado de no estar en situación concursal",
      category: "legal",
      subcategory: "Compliance y regulatorio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "proyecto_basico_ejecucion",
      name: "Proyecto básico y de ejecución completo",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "licencia_obra_actividad",
      name: "Licencia de obra y actividad",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificado_final_obra",
      name: "Certificado final de obra",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cedula_habitabilidad",
      name: "Cédula de habitabilidad",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "licencia_primera_occupacion",
      name: "Licencia de primera ocupación (si edificio nuevo)",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "planos_as_built",
      name: "Planos as-built completos (arquitectura, instalaciones)",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "memoria_constructiva",
      name: "Memoria constructiva detallada",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "calculo_estructuras",
      name: "Cálculo de estructuras firmado por técnico competente",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "libro_edificio_mantenimiento",
      name: "Libro del edificio con mantenimiento actualizado",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "proyecto_instalaciones_electricas",
      name: "Proyecto de instalaciones eléctricas (baja tensión)",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "optional",
      status: "pending",
    },
    {
      id: "proyecto_basico_ejecucion_1",
      name: "Proyecto básico y de ejecución completo",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "licencia_obra_actividad_1",
      name: "Licencia de obra y actividad",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificado_final_obra_1",
      name: "Certificado final de obra",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cedula_habitabilidad_1",
      name: "Cédula de habitabilidad",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "licencia_primera_occupacion_1",
      name: "Licencia de primera ocupación (si edificio nuevo)",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "planos_as_built_1",
      name: "Planos as-built completos (arquitectura, instalaciones)",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "memoria_constructiva_1",
      name: "Memoria constructiva detallada",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "calculo_estructuras_1",
      name: "Cálculo de estructuras firmado por técnico competente",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "libro_edificio_mantenimiento_1",
      name: "Libro del edificio con mantenimiento actualizado",
      category: "technical",
      subcategory: "Proyecto y construcción",
      type: "optional",
      status: "pending",
    },
    {
      id: "proyecto_instalaciones_electricas_1",
      name: "Proyecto de instalaciones eléctricas (baja tensión)",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "optional",
      status: "pending",
    },
    {
      id: "boletines_electricos_certificados",
      name: "Boletines eléctricos y certificados de instalador autorizado",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "proyecto_instalaciones_termicas",
      name: "Proyecto de instalaciones térmicas (calefacción/climatización)",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "optional",
      status: "pending",
    },
    {
      id: "certificados_rite_registro_industria",
      name: "Certificados RITE y registro en Industria",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "proyecto_instalaciones_fontaneria_saneamiento",
      name: "Proyecto de instalaciones de fontanería y saneamiento",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "optional",
      status: "pending",
    },
    {
      id: "legionela_protocolo_analiticas",
      name: "Legionela: protocolo y analíticas (último año)",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "instalaciones_proteccion_contra_incendios_rip",
      name: "Instalaciones de protección contra incendios (RIPCI)",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "mantenimiento_ascensores_ultimo_ano",
      name: "Certificados de mantenimiento de ascensores (último año)",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cee_vigente",
      name: "Certificado de eficiencia energética (CEE) vigente",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "auditoria_energetica_epbd",
      name: "Auditoría energética según EPBD (si >500m²)",
      category: "technical",
      subcategory: "Instalaciones y sistemas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "ite_vigente",
      name: "ITE (Inspección Técnica del Edificio) vigente",
      category: "technical",
      subcategory: "Inspecciones técnicas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "iee_completo",
      name: "Informe de evaluación del edificio (IEE) completo",
      category: "technical",
      subcategory: "Inspecciones técnicas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "inspeccion_fachadas",
      name: "Inspección de fachadas y elementos estructurales",
      category: "technical",
      subcategory: "Inspecciones técnicas",
      type: "optional",
      status: "pending",
    },
    {
      id: "inspeccion_cubiertas",
      name: "Inspección de cubiertas e impermeabilizaciones",
      category: "technical",
      subcategory: "Inspecciones técnicas",
      type: "optional",
      status: "pending",
    },
    {
      id: "informe_patologias",
      name: "Informe de patologías estructurales (solo si existen)",
      category: "technical",
      subcategory: "Inspecciones técnicas",
      type: "optional",
      status: "pending",
    },
    {
      id: "estudio_geotecnico",
      name: "Estudio geotécnico del terreno (solo si edificio nuevo)",
      category: "technical",
      subcategory: "Inspecciones técnicas",
      type: "optional",
      status: "pending",
    },
    {
      id: "resistencia_fuego",
      name: "Certificado de resistencia al fuego de elementos constructivos",
      category: "technical",
      subcategory: "Inspecciones técnicas",
      type: "optional",
      status: "pending",
    },
    {
      id: "inspeccion_electricas",
      name: "Inspección de instalaciones eléctricas (cada 5 años si >edificio antiguo)",
      category: "technical",
      subcategory: "Inspecciones técnicas",
      type: "optional",
      status: "pending",
    },
    {
      id: "cee_registrado",
      name: "Certificado de Eficiencia Energética (CEE) registrado",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "etiqueta_energetica",
      name: "Etiqueta energética vigente",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "auditoria_energetica_completa",
      name: "Auditoría energética EPBD completa",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "mejoras_energeticas",
      name: "Informe de mejoras energéticas recomendadas",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "emisiones_co2",
      name: "Cálculo de emisiones de CO2 (actual y proyectado)",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "demanda_energetica",
      name: "Estudio de demanda energética (kWh/m²·año)",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "balance_termico",
      name: "Balance térmico del edificio",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "optional",
      status: "pending",
    },
    {
      id: "envolvente_termica",
      name: "Análisis de la envolvente térmica",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "optional",
      status: "pending",
    },
    {
      id: "puentes_termicos",
      name: "Estudio de puentes térmicos",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "optional",
      status: "pending",
    },
    {
      id: "blower_door_test",
      name: "Test de infiltraciones (Blower Door Test)",
      category: "technical",
      subcategory: "Certificación energética EPBD",
      type: "optional",
      status: "pending",
    },
    {
      id: "alineacion_taxonomia_eu",
      name: "Informe de alineación con Taxonomía Europea",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_dnsh",
      name: "Análisis DNSH (Do No Significant Harm)",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificacion_ambiental_extra",
      name: "Certificación LEED / BREEAM / VERDE (si existe)",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "optional",
      status: "pending",
    },
    {
      id: "plan_descarbonizacion",
      name: "Plan de descarbonización del edificio",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estrategia_net_zero",
      name: "Estrategia Net Zero 2030/2050",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "inventario_gei",
      name: "Inventario de gases de efecto invernadero (GEI)",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_ciclo_vida",
      name: "Análisis de ciclo de vida (ACV) del edificio",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "optional",
      status: "pending",
    },
    {
      id: "gestion_residuos_construccion",
      name: "Certificado de gestión de residuos de construcción",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "optional",
      status: "pending",
    },
    {
      id: "plan_economia_circular",
      name: "Plan de economía circular",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "optional",
      status: "pending",
    },
    {
      id: "estudio_biodiversidad",
      name: "Estudio de biodiversidad y espacios verdes",
      category: "technical",
      subcategory: "Sostenibilidad y taxonomía EU",
      type: "optional",
      status: "pending",
    },
    {
      id: "iso_14001",
      name: "Certificación ISO 14001 (gestión ambiental)",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "optional",
      status: "pending",
    },
    {
      id: "iso_50001",
      name: "Certificación ISO 50001 (gestión energética)",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "optional",
      status: "pending",
    },
    {
      id: "auditoria_calidad_aire",
      name: "Auditoría de calidad del aire interior",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "optional",
      status: "pending",
    },
    {
      id: "certificado_well",
      name: "Certificado WELL Building Standard (si aplica)",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "optional",
      status: "pending",
    },
    {
      id: "confort_termico_luminico",
      name: "Análisis de confort térmico y lumínico",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "optional",
      status: "pending",
    },
    {
      id: "mediciones_acusticas",
      name: "Mediciones acústicas y certificado de aislamiento",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "optional",
      status: "pending",
    },
    {
      id: "ausencia_amianto",
      name: "Certificado de ausencia de amianto",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "informe_radon",
      name: "Informe de radón (si zona de riesgo)",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_agua",
      name: "Análisis de agua (calidad y legionela)",
      category: "technical",
      subcategory: "Certificaciones ambientales",
      type: "optional",
      status: "pending",
    },
    {
      id: "cuentas_anuales_auditadas",
      name: "Cuentas anuales auditadas (últimos 3 ejercicios)",
      category: "financial",
      subcategory: "Estados financieros",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "balance_situacion",
      name: "Balance de situación detallado",
      category: "financial",
      subcategory: "Estados financieros",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cuenta_de_perdidas_y_ganancias",
      name: "Cuenta de pérdidas y ganancias",
      category: "financial",
      subcategory: "Estados financieros",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estado_cambios_patrimonio_neto",
      name: "Estado de cambios en el patrimonio neto",
      category: "financial",
      subcategory: "Estados financieros",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estado_flujos_efectivo_cash_flow",
      name: "Estado de flujos de efectivo (cash flow)",
      category: "financial",
      subcategory: "Estados financieros",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "memoria_contable_completa",
      name: "Memoria contable completa",
      category: "financial",
      subcategory: "Estados financieros",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "auditoria_externa_3_anos",
      name: "Informe de auditoría externa (últimos 3 años)",
      category: "financial",
      subcategory: "Estados financieros",
      type: "optional",
      status: "pending",
    },
    {
      id: "declaraciones_fiscales_is_iva",
      name: "Declaraciones fiscales completas (IS, IVA)",
      category: "fiscal",
      subcategory: "Estados financieros",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "libro_mayor_y_diario_contable",
      name: "Libro mayor y diario contable",
      category: "financial",
      subcategory: "Estados financieros",
      type: "optional",
      status: "pending",
    },
    {
      id: "valoracion_actualizada_inmueble_tasacion_6_me",
      name: "Valoración actualizada del inmueble (tasación <6 meses)",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "informe_rent_roll_ingresos_arrendamiento",
      name: "Informe de rent roll (ingresos por arrendamiento)",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_rentabilidad_roi_tir_van",
      name: "Análisis de rentabilidad (ROI, TIR, VAN)",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "proyeccion_ingresos_gastos_5_10_anos",
      name: "Proyección de ingresos y gastos (5-10 años)",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_de_sensibilidad_financiera",
      name: "Análisis de sensibilidad financiera",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "optional",
      status: "pending",
    },
    {
      id: "estudio_de_viabilidad_economica",
      name: "Estudio de viabilidad económica",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_punto_equilibrio_break_even",
      name: "Análisis de punto de equilibrio (break-even)",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "optional",
      status: "pending",
    },
    {
      id: "calculo_ratios_financieros_ltv_dscr_icr",
      name: "Cálculo de ratios financieros (LTV, DSCR, ICR)",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "desglose_de_gastos_operativos_opex",
      name: "Desglose de gastos operativos (OPEX)",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "planificacion_de_inversiones_capex",
      name: "Planificación de inversiones (CAPEX)",
      category: "financial",
      subcategory: "Análisis financiero del activo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "detalle_de_toda_la_deuda_existente",
      name: "Detalle de toda la deuda existente",
      category: "financial",
      subcategory: "Deuda y financiación actual",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "contratos_prestamos_lineas_credito_vigentes",
      name: "Contratos de préstamos y líneas de crédito vigentes",
      category: "financial",
      subcategory: "Deuda y financiación actual",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "calendario_amortizaciones_vencimientos",
      name: "Calendario de amortizaciones y vencimientos",
      category: "financial",
      subcategory: "Deuda y financiación actual",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "garantias_otorgadas_hipotecas_avales_prendas",
      name: "Garantías otorgadas (hipotecas, avales, prendas)",
      category: "financial",
      subcategory: "Deuda y financiación actual",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "rating_crediticio_si_disponible",
      name: "Rating crediticio (si disponible)",
      category: "financial",
      subcategory: "Deuda y financiación actual",
      type: "optional",
      status: "pending",
    },
    {
      id: "historial_pagos_cumplimiento_covenants",
      name: "Historial de pagos y cumplimiento de covenants",
      category: "financial",
      subcategory: "Deuda y financiación actual",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_situacion_financiera_neta",
      name: "Declaración de situación financiera neta",
      category: "financial",
      subcategory: "Deuda y financiación actual",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificado_bancario_saldos_operaciones",
      name: "Certificado bancario de saldos y operaciones",
      category: "financial",
      subcategory: "Deuda y financiación actual",
      type: "optional",
      status: "pending",
    },
    {
      id: "informe_ejecutivo_auditoria_energetica",
      name: "Informe ejecutivo de auditoría energética",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "inventario_consumos_energeticos_ultimos_3_ano",
      name: "Inventario de consumos energéticos (últimos 3 años)",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_de_instalaciones_termicas",
      name: "Análisis de instalaciones térmicas",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_de_envolvente_termica",
      name: "Análisis de envolvente térmica",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "termografias_infrarrojas_edificio",
      name: "Termografías infrarrojas del edificio",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "optional",
      status: "pending",
    },
    {
      id: "mediciones_infiltraciones_aire",
      name: "Mediciones de infiltraciones de aire",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "optional",
      status: "pending",
    },
    {
      id: "estudio_de_sistemas_de_iluminacion",
      name: "Estudio de sistemas de iluminación",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_de_equipos_consumidores",
      name: "Análisis de equipos consumidores",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "optional",
      status: "pending",
    },
    {
      id: "propuesta_mejoras_energeticas_jerarquizadas",
      name: "Propuesta de mejoras energéticas jerarquizadas",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_coste_beneficio_cada_mejora",
      name: "Análisis coste-beneficio de cada mejora",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "simulacion_energetica_dinamica",
      name: "Simulación energética dinámica",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "optional",
      status: "pending",
    },
    {
      id: "proyeccion_ahorro_energetico_kwh",
      name: "Proyección de ahorro energético (kWh y €)",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estimacion_reduccion_emisiones_co2",
      name: "Estimación de reducción de emisiones CO2",
      category: "technical",
      subcategory: "Auditoría energética EPBD completa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estado_conservacion_general",
      name: "Informe de estado de conservación general",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "evaluacion_estructural",
      name: "Evaluación estructural (cimentación, pilares, forjados)",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estado_fachadas",
      name: "Estado de fachadas y cerramientos",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estado_cubiertas",
      name: "Estado de cubiertas e impermeabilizaciones",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "evaluacion_instalaciones_vida_util",
      name: "Evaluación de instalaciones (vida útil restante)",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "deteccion_patologias",
      name: "Detección de patologías (humedades, grietas, fisuras)",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "accesibilidad_universal",
      name: "Estudio de accesibilidad universal",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "cumplimiento_cte",
      name: "Cumplimiento CTE (Código Técnico de la Edificación)",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "plan_mantenimiento_preventivo",
      name: "Plan de mantenimiento preventivo",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "presupuesto_reparaciones",
      name: "Presupuesto de reparaciones necesarias",
      category: "technical",
      subcategory: "Auditoría técnica del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "informe_legal_completo_del_inmueble",
      name: "Informe legal completo del inmueble",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "comprobacion_de_cargas_y_gravamenes",
      name: "Comprobación de cargas y gravámenes",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "verificacion_licencias_permisos",
      name: "Verificación de licencias y permisos",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cumplimiento_normativa_urbanistica",
      name: "Cumplimiento normativa urbanística",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "revision_contratos_arrendamiento",
      name: "Revisión de contratos de arrendamiento",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "verificacion_de_servidumbres",
      name: "Verificación de servidumbres",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_litigios_reclamaciones",
      name: "Análisis de litigios y reclamaciones",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "optional",
      status: "pending",
    },
    {
      id: "revision_de_seguros_contratados",
      name: "Revisión de seguros contratados",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "verificacion_compliance_regulatorio",
      name: "Verificación de compliance regulatorio",
      category: "legal",
      subcategory: "Due diligence técnico-legal",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_conformidad_epbd_2024",
      name: "Declaración de conformidad con EPBD 2024",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificado_eficiencia_energetica_minimo_clas",
      name: "Certificado de eficiencia energética (mínimo clase D)",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "auditoria_energetica_obligatoria_si_500m",
      name: "Auditoría energética obligatoria (si >500m²)",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "plan_mejora_hasta_clase_b_antes_2030",
      name: "Plan de mejora hasta clase B antes de 2030",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "roadmap_descarbonizacion_hasta_2050",
      name: "Roadmap de descarbonización hasta 2050",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "justificacion_exenciones_si_aplica",
      name: "Justificación de exenciones (si aplica)",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "optional",
      status: "pending",
    },
    {
      id: "informe_integracion_renovables",
      name: "Informe de integración de renovables",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estrategia_eliminacion_combustibles_fosiles",
      name: "Estrategia de eliminación de combustibles fósiles",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "smart_readiness_indicator_sri_edificio",
      name: "Smart readiness indicator (SRI) del edificio",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "optional",
      status: "pending",
    },
    {
      id: "plan_instalacion_puntos_recarga_ve",
      name: "Plan de instalación de puntos de recarga VE",
      category: "technical",
      subcategory: "Cumplimiento EPBD",
      type: "optional",
      status: "pending",
    },
    {
      id: "informe_elegibilidad_taxonomia_eu",
      name: "Informe de elegibilidad Taxonomía EU",
      category: "technical",
      subcategory: "Taxonomía europea de actividades sostenibles",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "verificacion_criterios_tecnicos_seleccion",
      name: "Verificación de criterios técnicos de selección",
      category: "technical",
      subcategory: "Taxonomía europea de actividades sostenibles",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "verificacion_salvaguardas_minimas_sociales",
      name: "Verificación de salvaguardas mínimas sociales",
      category: "technical",
      subcategory: "Taxonomía europea de actividades sostenibles",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "informe_alineacion_reglamento_ue_2020_852",
      name: "Informe de alineación con Reglamento (UE) 2020/852",
      category: "technical",
      subcategory: "Taxonomía europea de actividades sostenibles",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificacion_auditor_independiente",
      name: "Certificación de auditor independiente",
      category: "technical",
      subcategory: "Taxonomía europea de actividades sostenibles",
      type: "optional",
      status: "pending",
    },
    {
      id: "declaracion_sfdr_sustainable_finance_disclosu",
      name: "Declaración SFDR (Sustainable Finance Disclosure)",
      category: "technical",
      subcategory: "Regulación financiera sostenible",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "reporte_principales_impactos_adversos_pai",
      name: "Reporte de principales impactos adversos (PAI)",
      category: "technical",
      subcategory: "Regulación financiera sostenible",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "alineacion_eu_green_bond_standard",
      name: "Alineación con EU Green Bond Standard",
      category: "technical",
      subcategory: "Regulación financiera sostenible",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cumplimiento_green_loan_principles_lma",
      name: "Cumplimiento de Green Loan Principles (LMA)",
      category: "technical",
      subcategory: "Regulación financiera sostenible",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "kpis_sostenibilidad_para_sustainability_linke",
      name: "KPIs de sostenibilidad para sustainability-linked loan",
      category: "technical",
      subcategory: "Regulación financiera sostenible",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "informe_de_second_party_opinion_spo",
      name: "Informe de Second Party Opinion (SPO)",
      category: "technical",
      subcategory: "Regulación financiera sostenible",
      type: "optional",
      status: "pending",
    },
    {
      id: "plan_de_reporting_esg_continuo",
      name: "Plan de reporting ESG continuo",
      category: "technical",
      subcategory: "Regulación financiera sostenible",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "contratos_alquiler_vigentes_todos_inquilinos",
      name: "Contratos de alquiler vigentes (todos los inquilinos)",
      category: "legal",
      subcategory: "Contratos de arrendamiento",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "fianzas_depositadas_y_avales",
      name: "Fianzas depositadas y avales",
      category: "legal",
      subcategory: "Contratos de arrendamiento",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "rent_roll_actualizado_vencimientos",
      name: "Rent roll actualizado con vencimientos",
      category: "legal",
      subcategory: "Contratos de arrendamiento",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "historial_de_impagos_ultimos_5_anos",
      name: "Historial de impagos (últimos 5 años)",
      category: "legal",
      subcategory: "Contratos de arrendamiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "comunicaciones_inquilinos_ultimos_2_anos",
      name: "Comunicaciones con inquilinos (últimos 2 años)",
      category: "legal",
      subcategory: "Contratos de arrendamiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "acuerdos_modificacion_o_renovacion",
      name: "Acuerdos de modificación o renovación",
      category: "legal",
      subcategory: "Contratos de arrendamiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "cesiones_de_contrato_autorizadas",
      name: "Cesiones de contrato autorizadas",
      category: "legal",
      subcategory: "Contratos de arrendamiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "garantias_adicionales_contratadas",
      name: "Garantías adicionales contratadas",
      category: "legal",
      subcategory: "Contratos de arrendamiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "contrato_mantenimiento_integral_edificio",
      name: "Contrato de mantenimiento integral del edificio",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "contrato_de_limpieza_y_conservacion",
      name: "Contrato de limpieza y conservación",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "contrato_de_seguridad_y_vigilancia",
      name: "Contrato de seguridad y vigilancia",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "contrato_de_gestion_de_residuos",
      name: "Contrato de gestión de residuos",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "mantenimiento_instalaciones_termicas_climatiz",
      name: "Mantenimiento de instalaciones térmicas (climatización)",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "mantenimiento_de_ascensores",
      name: "Mantenimiento de ascensores",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "mantenimiento_instalaciones_electricas",
      name: "Mantenimiento de instalaciones eléctricas",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "control_de_legionela_y_plagas",
      name: "Control de legionela y plagas",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "jardineria_y_zonas_comunes",
      name: "Jardinería y zonas comunes",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "suministros_agua_luz_gas_telecomunicaciones",
      name: "Suministros (agua, luz, gas, telecomunicaciones)",
      category: "legal",
      subcategory: "Contratos de servicios y mantenimiento",
      type: "optional",
      status: "pending",
    },
    {
      id: "contratos_empresas_constructoras_si_obra_curs",
      name: "Contratos con empresas constructoras (si obra en curso)",
      category: "legal",
      subcategory: "Contratos de obra y proveedores",
      type: "optional",
      status: "pending",
    },
    {
      id: "garantias_decenales_construccion_si_edificio",
      name: "Garantías decenales de construcción (si edificio < 10 años)",
      category: "legal",
      subcategory: "Contratos de obra y proveedores",
      type: "optional",
      status: "pending",
    },
    {
      id: "seguros_danos_materiales_durante_obra",
      name: "Seguros de daños materiales durante obra",
      category: "legal",
      subcategory: "Contratos de obra y proveedores",
      type: "optional",
      status: "pending",
    },
    {
      id: "contratos_proveedores_materiales",
      name: "Contratos con proveedores de materiales",
      category: "legal",
      subcategory: "Contratos de obra y proveedores",
      type: "optional",
      status: "pending",
    },
    {
      id: "acuerdos_ingenierias_consultoras",
      name: "Acuerdos con ingenierías y consultoras",
      category: "legal",
      subcategory: "Contratos de obra y proveedores",
      type: "optional",
      status: "pending",
    },
    {
      id: "contratos_arquitectos_tecnicos",
      name: "Contratos con arquitectos y técnicos",
      category: "legal",
      subcategory: "Contratos de obra y proveedores",
      type: "optional",
      status: "pending",
    },
    {
      id: "polizas_responsabilidad_civil_profesional",
      name: "Pólizas de responsabilidad civil profesional",
      category: "legal",
      subcategory: "Contratos de obra y proveedores",
      type: "optional",
      status: "pending",
    },
    {
      id: "acuerdos_de_financiacion_existentes",
      name: "Acuerdos de financiación existentes",
      category: "legal",
      subcategory: "Otros acuerdos relevantes",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "contratos_asesoramiento_legal_fiscal_tecnico",
      name: "Contratos de asesoramiento (legal, fiscal, técnico)",
      category: "legal",
      subcategory: "Otros acuerdos relevantes",
      type: "optional",
      status: "pending",
    },
    {
      id: "acuerdos_joint_venture_o_colaboracion",
      name: "Acuerdos de joint venture o colaboración",
      category: "legal",
      subcategory: "Otros acuerdos relevantes",
      type: "optional",
      status: "pending",
    },
    {
      id: "contratos_gestion_activos_property_management",
      name: "Contratos de gestión de activos (property management)",
      category: "legal",
      subcategory: "Otros acuerdos relevantes",
      type: "optional",
      status: "pending",
    },
    {
      id: "contratos_de_comercializacion",
      name: "Contratos de comercialización",
      category: "legal",
      subcategory: "Otros acuerdos relevantes",
      type: "optional",
      status: "pending",
    },
    {
      id: "acuerdos_de_confidencialidad_ndas",
      name: "Acuerdos de confidencialidad (NDAs)",
      category: "legal",
      subcategory: "Otros acuerdos relevantes",
      type: "optional",
      status: "pending",
    },
    {
      id: "poliza_seguro_multirriesgo_inmueble",
      name: "Póliza de seguro multirriesgo del inmueble",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "seguro_danos_materiales_incendio_agua_explosi",
      name: "Seguro de daños materiales (incendio, agua, explosión)",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "seguro_responsabilidad_civil_general",
      name: "Seguro de responsabilidad civil general",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "seguro_perdida_rentas_siniestro",
      name: "Seguro de pérdida de rentas por siniestro",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "seguro_todo_riesgo_construccion_si_obra",
      name: "Seguro de todo riesgo construcción (si obra)",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "seguro_decenal_danos_si_edificio_10_anos",
      name: "Seguro decenal de daños (si edificio < 10 años)",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "seguro_de_contenido_y_equipamiento",
      name: "Seguro de contenido y equipamiento",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "coberturas_especificas_inundacion_terremoto_e",
      name: "Coberturas específicas (inundación, terremoto, etc.)",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "certificados_pago_primas_corriente",
      name: "Certificados de pago de primas (al corriente)",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "historial_siniestros_ultimos_5_anos",
      name: "Historial de siniestros (últimos 5 años)",
      category: "legal",
      subcategory: "Seguros del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "garantias_bancarias_otorgadas",
      name: "Garantías bancarias otorgadas",
      category: "legal",
      subcategory: "Garantías y avales",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "avales_de_cumplimiento_de_contratos",
      name: "Avales de cumplimiento de contratos",
      category: "legal",
      subcategory: "Garantías y avales",
      type: "optional",
      status: "pending",
    },
    {
      id: "fianzas_depositadas_ante_organismos_publicos",
      name: "Fianzas depositadas ante organismos públicos",
      category: "legal",
      subcategory: "Garantías y avales",
      type: "optional",
      status: "pending",
    },
    {
      id: "garantias_constructoras_obras_recientes",
      name: "Garantías constructoras (obras recientes)",
      category: "legal",
      subcategory: "Garantías y avales",
      type: "optional",
      status: "pending",
    },
    {
      id: "garantias_proveedores_fabricantes",
      name: "Garantías de proveedores y fabricantes",
      category: "legal",
      subcategory: "Garantías y avales",
      type: "optional",
      status: "pending",
    },
    {
      id: "retenciones_garantia_contratos",
      name: "Retenciones de garantía en contratos",
      category: "legal",
      subcategory: "Garantías y avales",
      type: "optional",
      status: "pending",
    },
    {
      id: "memoria_tecnica_proyecto_rehabilitacion",
      name: "Memoria técnica del proyecto de rehabilitación",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "planos_intervencion_arquitectura_e_instalacio",
      name: "Planos de intervención (arquitectura e instalaciones)",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "presupuesto_detallado_partidas_certificado",
      name: "Presupuesto detallado por partidas (certificado)",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "mediciones_y_valoraciones",
      name: "Mediciones y valoraciones",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "plan_ejecucion_cronograma_gantt",
      name: "Plan de ejecución y cronograma (GANTT)",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "estudios_de_seguridad_y_salud",
      name: "Estudios de seguridad y salud",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "optional",
      status: "pending",
    },
    {
      id: "gestion_de_residuos_de_construccion",
      name: "Gestión de residuos de construcción",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "optional",
      status: "pending",
    },
    {
      id: "permisos_y_licencias_necesarias",
      name: "Permisos y licencias necesarias",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_responsable_de_obras",
      name: "Declaración responsable de obras",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "optional",
      status: "pending",
    },
    {
      id: "seguros_de_la_obra",
      name: "Seguros de la obra",
      category: "technical",
      subcategory: "Proyecto de rehabilitación energética",
      type: "optional",
      status: "pending",
    },
    {
      id: "listado_priorizado_medidas_mejora",
      name: "Listado priorizado de medidas de mejora",
      category: "technical",
      subcategory: "Propuesta de mejoras energéticas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "coste_estimado_por_mejora",
      name: "Coste estimado por mejora",
      category: "technical",
      subcategory: "Propuesta de mejoras energéticas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "ahorro_energetico_proyectado_kwh_ano",
      name: "Ahorro energético proyectado (kWh/año)",
      category: "technical",
      subcategory: "Propuesta de mejoras energéticas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "ahorro_economico_proyectado_ano",
      name: "Ahorro económico proyectado (€/año)",
      category: "technical",
      subcategory: "Propuesta de mejoras energéticas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "reduccion_de_emisiones_co2_ton_ano",
      name: "Reducción de emisiones CO2 (ton/año)",
      category: "technical",
      subcategory: "Propuesta de mejoras energéticas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "periodo_retorno_inversion_payback",
      name: "Periodo de retorno de inversión (payback)",
      category: "technical",
      subcategory: "Propuesta de mejoras energéticas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "salto_calificacion_energetica_esperado",
      name: "Salto de calificación energética esperado",
      category: "technical",
      subcategory: "Propuesta de mejoras energéticas",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "plan_de_inversion_capex_total",
      name: "Plan de inversión (CAPEX) total",
      category: "technical",
      subcategory: "Análisis de viabilidad del CAPEX",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "desglose_por_fases_y_anualidades",
      name: "Desglose por fases y anualidades",
      category: "technical",
      subcategory: "Análisis de viabilidad del CAPEX",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "fuentes_de_financiacion_previstas",
      name: "Fuentes de financiación previstas",
      category: "technical",
      subcategory: "Análisis de viabilidad del CAPEX",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "sensibilidad_variaciones_costes",
      name: "Sensibilidad a variaciones de costes",
      category: "technical",
      subcategory: "Análisis de viabilidad del CAPEX",
      type: "optional",
      status: "pending",
    },
    {
      id: "impacto_en_valoracion_del_inmueble",
      name: "Impacto en valoración del inmueble",
      category: "technical",
      subcategory: "Análisis de viabilidad del CAPEX",
      type: "optional",
      status: "pending",
    },
    {
      id: "incremento_renta_potencial_post_reforma",
      name: "Incremento de renta potencial post-reforma",
      category: "technical",
      subcategory: "Análisis de viabilidad del CAPEX",
      type: "optional",
      status: "pending",
    },
    {
      id: "cumplimiento_de_epbd_y_taxonomia_eu",
      name: "Cumplimiento de EPBD y Taxonomía EU",
      category: "technical",
      subcategory: "Análisis de viabilidad del CAPEX",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "ficha_completa_del_edificio",
      name: "Ficha completa del edificio",
      category: "technical",
      subcategory: "Libro del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "instrucciones_uso_mantenimiento",
      name: "Instrucciones de uso y mantenimiento",
      category: "technical",
      subcategory: "Libro del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "manual_de_usuario_del_edificio",
      name: "Manual de usuario del edificio",
      category: "technical",
      subcategory: "Libro del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "registro_intervenciones_reparaciones",
      name: "Registro de intervenciones y reparaciones",
      category: "technical",
      subcategory: "Libro del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "planificacion_mantenimiento_preventivo",
      name: "Planificación de mantenimiento preventivo",
      category: "technical",
      subcategory: "Libro del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "garantias_equipos_e_instalaciones",
      name: "Garantías de equipos e instalaciones",
      category: "technical",
      subcategory: "Libro del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "manuales_tecnicos_de_equipos",
      name: "Manuales técnicos de equipos",
      category: "technical",
      subcategory: "Libro del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "esquemas_unifilares_planos_instalaciones",
      name: "Esquemas unifilares y planos de instalaciones",
      category: "technical",
      subcategory: "Libro del edificio",
      type: "optional",
      status: "pending",
    },
    {
      id: "plan_mantenimiento_preventivo_anual",
      name: "Plan de mantenimiento preventivo anual",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "optional",
      status: "pending",
    },
    {
      id: "registro_mantenimientos_realizados_3_anos",
      name: "Registro de mantenimientos realizados (3 años)",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "optional",
      status: "pending",
    },
    {
      id: "partes_de_trabajo_e_incidencias",
      name: "Partes de trabajo e incidencias",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "optional",
      status: "pending",
    },
    {
      id: "consumos_energeticos_monitorizados",
      name: "Consumos energéticos monitorizados",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "facturas_suministros_ultimos_3_anos",
      name: "Facturas de suministros (últimos 3 años)",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "gestion_de_residuos_y_reciclaje",
      name: "Gestión de residuos y reciclaje",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "optional",
      status: "pending",
    },
    {
      id: "control_de_accesos_y_seguridad",
      name: "Control de accesos y seguridad",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "optional",
      status: "pending",
    },
    {
      id: "protocolos_de_emergencia",
      name: "Protocolos de emergencia",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "optional",
      status: "pending",
    },
    {
      id: "planes_de_contingencia",
      name: "Planes de contingencia",
      category: "technical",
      subcategory: "Gestión operativa",
      type: "optional",
      status: "pending",
    },
    {
      id: "indicadores_desempeno_kpis_edificio",
      name: "Indicadores de desempeño (KPIs) del edificio",
      category: "technical",
      subcategory: "Facility management",
      type: "optional",
      status: "pending",
    },
    {
      id: "benchmarking_edificios_similares",
      name: "Benchmarking con edificios similares",
      category: "technical",
      subcategory: "Facility management",
      type: "optional",
      status: "pending",
    },
    {
      id: "satisfaccion_de_inquilinos_usuarios",
      name: "Satisfacción de inquilinos/usuarios",
      category: "technical",
      subcategory: "Facility management",
      type: "optional",
      status: "pending",
    },
    {
      id: "tasa_de_ocupacion_historica",
      name: "Tasa de ocupación histórica",
      category: "technical",
      subcategory: "Facility management",
      type: "optional",
      status: "pending",
    },
    {
      id: "gestion_de_espacios_y_optimizacion",
      name: "Gestión de espacios y optimización",
      category: "technical",
      subcategory: "Facility management",
      type: "optional",
      status: "pending",
    },
    {
      id: "reporting_operativo_mensual_trimestral",
      name: "Reporting operativo mensual/trimestral",
      category: "technical",
      subcategory: "Facility management",
      type: "optional",
      status: "pending",
    },
    {
      id: "tasacion_oficial_sociedad_homologada_6_meses",
      name: "Tasación oficial por sociedad homologada (< 6 meses)",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "metodologia_de_valoracion_utilizada",
      name: "Metodología de valoración utilizada",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "comparables_mercado_transacciones_similares",
      name: "Comparables de mercado (transacciones similares)",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "optional",
      status: "pending",
    },
    {
      id: "valor_de_mercado_actual",
      name: "Valor de mercado actual",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "valor_de_reposicion_reconstruccion",
      name: "Valor de reposición/reconstrucción",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "optional",
      status: "pending",
    },
    {
      id: "valor_residual_del_suelo",
      name: "Valor residual del suelo",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "optional",
      status: "pending",
    },
    {
      id: "valoracion_metodo_capitalizacion_rentas",
      name: "Valoración por método de capitalización de rentas",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "optional",
      status: "pending",
    },
    {
      id: "valoracion_post_rehabilitacion_proyectada",
      name: "Valoración post-rehabilitación proyectada",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_del_highest_and_best_use",
      name: "Análisis del highest and best use",
      category: "financial",
      subcategory: "Valoración del inmueble",
      type: "optional",
      status: "pending",
    },
    {
      id: "estudio_de_mercado_de_la_zona",
      name: "Estudio de mercado de la zona",
      category: "financial",
      subcategory: "Análisis de mercado inmobiliario",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_de_oferta_y_demanda_local",
      name: "Análisis de oferta y demanda local",
      category: "financial",
      subcategory: "Análisis de mercado inmobiliario",
      type: "optional",
      status: "pending",
    },
    {
      id: "evolucion_precios_venta_ultimos_5_anos",
      name: "Evolución de precios de venta (últimos 5 años)",
      category: "financial",
      subcategory: "Análisis de mercado inmobiliario",
      type: "optional",
      status: "pending",
    },
    {
      id: "evolucion_rentas_alquiler_ultimos_5_anos",
      name: "Evolución de rentas de alquiler (últimos 5 años)",
      category: "financial",
      subcategory: "Análisis de mercado inmobiliario",
      type: "optional",
      status: "pending",
    },
    {
      id: "yields_mercado_zona_tipologia",
      name: "Yields de mercado por zona y tipología",
      category: "financial",
      subcategory: "Análisis de mercado inmobiliario",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_de_competidores_directos",
      name: "Análisis de competidores directos",
      category: "financial",
      subcategory: "Análisis de mercado inmobiliario",
      type: "optional",
      status: "pending",
    },
    {
      id: "proyeccion_crecimiento_mercado",
      name: "Proyección de crecimiento del mercado",
      category: "financial",
      subcategory: "Análisis de mercado inmobiliario",
      type: "optional",
      status: "pending",
    },
    {
      id: "factores_riesgo_mercado_local",
      name: "Factores de riesgo del mercado local",
      category: "financial",
      subcategory: "Análisis de mercado inmobiliario",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_dafo_fortalezas_debilidades_oportuni",
      name: "Análisis DAFO (fortalezas, debilidades, oportunidades, amenazas)",
      category: "financial",
      subcategory: "Posicionamiento estratégico",
      type: "optional",
      status: "pending",
    },
    {
      id: "ventajas_competitivas_del_activo",
      name: "Ventajas competitivas del activo",
      category: "financial",
      subcategory: "Posicionamiento estratégico",
      type: "optional",
      status: "pending",
    },
    {
      id: "estrategia_valor_anadido_value_add",
      name: "Estrategia de valor añadido (value-add)",
      category: "financial",
      subcategory: "Posicionamiento estratégico",
      type: "optional",
      status: "pending",
    },
    {
      id: "plan_reposicionamiento_mercado",
      name: "Plan de reposicionamiento en el mercado",
      category: "financial",
      subcategory: "Posicionamiento estratégico",
      type: "optional",
      status: "pending",
    },
    {
      id: "estrategia_de_comercializacion",
      name: "Estrategia de comercialización",
      category: "financial",
      subcategory: "Posicionamiento estratégico",
      type: "optional",
      status: "pending",
    },
    {
      id: "target_de_inquilinos_compradores",
      name: "Target de inquilinos/compradores",
      category: "financial",
      subcategory: "Posicionamiento estratégico",
      type: "optional",
      status: "pending",
    },
    {
      id: "ficha_urbanistica_del_inmueble",
      name: "Ficha urbanística del inmueble",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "plan_general_ordenacion_urbana_pgou",
      name: "Plan General de Ordenación Urbana (PGOU)",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "optional",
      status: "pending",
    },
    {
      id: "clasificacion_del_suelo",
      name: "Clasificación del suelo",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "calificacion_urbanistica",
      name: "Calificación urbanística",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "condiciones_de_edificabilidad",
      name: "Condiciones de edificabilidad",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "optional",
      status: "pending",
    },
    {
      id: "coeficientes_ocupacion_edificabilidad",
      name: "Coeficientes de ocupación y edificabilidad",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "optional",
      status: "pending",
    },
    {
      id: "alturas_maximas_permitidas",
      name: "Alturas máximas permitidas",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "optional",
      status: "pending",
    },
    {
      id: "retranqueos_y_alineaciones",
      name: "Retranqueos y alineaciones",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "optional",
      status: "pending",
    },
    {
      id: "uso_permitido_del_inmueble",
      name: "Uso permitido del inmueble",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cargas_urbanisticas_pendientes",
      name: "Cargas urbanísticas pendientes",
      category: "legal",
      subcategory: "Normativa urbanística aplicable",
      type: "optional",
      status: "pending",
    },
    {
      id: "licencia_urbanistica_obra_mayor_si_aplica",
      name: "Licencia urbanística de obra mayor (si aplica)",
      category: "legal",
      subcategory: "Licencias y permisos",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "licencia_de_actividad_vigente",
      name: "Licencia de actividad vigente",
      category: "legal",
      subcategory: "Licencias y permisos",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "licencia_de_apertura",
      name: "Licencia de apertura",
      category: "legal",
      subcategory: "Licencias y permisos",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_responsable_si_aplica",
      name: "Declaración responsable (si aplica)",
      category: "legal",
      subcategory: "Licencias y permisos",
      type: "optional",
      status: "pending",
    },
    {
      id: "comunicacion_previa_obras_menores",
      name: "Comunicación previa obras menores",
      category: "legal",
      subcategory: "Licencias y permisos",
      type: "optional",
      status: "pending",
    },
    {
      id: "autorizacion_comunidad_propietarios",
      name: "Autorización de la comunidad de propietarios",
      category: "legal",
      subcategory: "Licencias y permisos",
      type: "optional",
      status: "pending",
    },
    {
      id: "permisos_ocupacion_via_publica_si_necesario",
      name: "Permisos de ocupación de vía pública (si necesario)",
      category: "legal",
      subcategory: "Licencias y permisos",
      type: "optional",
      status: "pending",
    },
    {
      id: "autorizaciones_patrimoniales_edificio_catalog",
      name: "Autorizaciones patrimoniales (edificio catalogado)",
      category: "legal",
      subcategory: "Licencias y permisos",
      type: "optional",
      status: "pending",
    },
    {
      id: "declaracion_catalogacion_si_aplica",
      name: "Declaración de catalogación (si aplica)",
      category: "legal",
      subcategory: "Protección y catalogación",
      type: "optional",
      status: "pending",
    },
    {
      id: "nivel_de_proteccion_patrimonial",
      name: "Nivel de protección patrimonial",
      category: "legal",
      subcategory: "Protección y catalogación",
      type: "optional",
      status: "pending",
    },
    {
      id: "elementos_protegidos_del_edificio",
      name: "Elementos protegidos del edificio",
      category: "legal",
      subcategory: "Protección y catalogación",
      type: "optional",
      status: "pending",
    },
    {
      id: "condiciones_intervencion_edificio_protegido",
      name: "Condiciones de intervención en edificio protegido",
      category: "legal",
      subcategory: "Protección y catalogación",
      type: "optional",
      status: "pending",
    },
    {
      id: "autorizaciones_especiales_patrimonio",
      name: "Autorizaciones especiales de patrimonio",
      category: "legal",
      subcategory: "Protección y catalogación",
      type: "optional",
      status: "pending",
    },
    {
      id: "fase_i_environmental_site_assessment_esa",
      name: "Fase I: Environmental Site Assessment (ESA)",
      category: "technical",
      subcategory: "Estudio de contaminación",
      type: "optional",
      status: "pending",
    },
    {
      id: "fase_ii_analisis_suelos_aguas_subterraneas_si",
      name: "Fase II: Análisis de suelos y aguas subterráneas (si necesario)",
      category: "technical",
      subcategory: "Estudio de contaminación",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_de_presencia_de_pcbs",
      name: "Análisis de presencia de PCBs",
      category: "technical",
      subcategory: "Estudio de contaminación",
      type: "optional",
      status: "pending",
    },
    {
      id: "estudio_de_radon_zonas_de_riesgo",
      name: "Estudio de radón (zonas de riesgo)",
      category: "technical",
      subcategory: "Estudio de contaminación",
      type: "optional",
      status: "pending",
    },
    {
      id: "evaluacion_calidad_aire_interior",
      name: "Evaluación de calidad del aire interior",
      category: "technical",
      subcategory: "Estudio de contaminación",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_de_contaminacion_acustica",
      name: "Análisis de contaminación acústica",
      category: "technical",
      subcategory: "Estudio de contaminación",
      type: "optional",
      status: "pending",
    },
    {
      id: "evaluacion_cem_campos_electromagneticos",
      name: "Evaluación de CEM (campos electromagnéticos)",
      category: "technical",
      subcategory: "Estudio de contaminación",
      type: "optional",
      status: "pending",
    },
    {
      id: "plan_gestion_residuos_peligrosos",
      name: "Plan de gestión de residuos peligrosos",
      category: "technical",
      subcategory: "Gestión ambiental",
      type: "optional",
      status: "pending",
    },
    {
      id: "certificados_de_gestion_de_residuos",
      name: "Certificados de gestión de residuos",
      category: "technical",
      subcategory: "Gestión ambiental",
      type: "optional",
      status: "pending",
    },
    {
      id: "autorizaciones_ambientales",
      name: "Autorizaciones ambientales",
      category: "technical",
      subcategory: "Gestión ambiental",
      type: "optional",
      status: "pending",
    },
    {
      id: "control_de_emisiones_atmosfericas",
      name: "Control de emisiones atmosféricas",
      category: "technical",
      subcategory: "Gestión ambiental",
      type: "optional",
      status: "pending",
    },
    {
      id: "gestion_de_aguas_residuales",
      name: "Gestión de aguas residuales",
      category: "technical",
      subcategory: "Gestión ambiental",
      type: "optional",
      status: "pending",
    },
    {
      id: "registro_de_productores_de_residuos",
      name: "Registro de productores de residuos",
      category: "technical",
      subcategory: "Gestión ambiental",
      type: "optional",
      status: "pending",
    },
    {
      id: "resumen_ejecutivo_del_business_case",
      name: "Resumen ejecutivo del business case",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "supuestos_del_modelo_financiero",
      name: "Supuestos del modelo financiero",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "proyeccion_de_ingresos_5_10_anos",
      name: "Proyección de ingresos (5-10 años)",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "proyeccion_gastos_operativos_opex",
      name: "Proyección de gastos operativos (OPEX)",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "proyeccion_de_inversiones_capex",
      name: "Proyección de inversiones (CAPEX)",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cash_flow_proyectado_completo",
      name: "Cash flow proyectado completo",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "cuenta_de_resultados_previsional",
      name: "Cuenta de resultados previsional",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "balance_previsional",
      name: "Balance previsional",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "optional",
      status: "pending",
    },
    {
      id: "calculo_de_ratios_financieros_clave",
      name: "Cálculo de ratios financieros clave",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_de_sensibilidad_escenarios",
      name: "Análisis de sensibilidad (escenarios)",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "optional",
      status: "pending",
    },
    {
      id: "analisis_de_riesgos_y_mitigacion",
      name: "Análisis de riesgos y mitigación",
      category: "financial",
      subcategory: "Modelo financiero completo",
      type: "optional",
      status: "pending",
    },
    {
      id: "estructura_financiacion_propuesta",
      name: "Estructura de financiación propuesta",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "importe_solicitado_destino_fondos",
      name: "Importe solicitado y destino de fondos",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "plazo_de_amortizacion_propuesto",
      name: "Plazo de amortización propuesto",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "garantias_ofrecidas",
      name: "Garantías ofrecidas",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "covenants_financieros_propuestos",
      name: "Covenants financieros propuestos",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "justificacion_de_elegibilidad_verde",
      name: "Justificación de elegibilidad verde",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "framework_de_bonos_prestamos_verdes",
      name: "Framework de bonos/préstamos verdes",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "kpis_de_sostenibilidad",
      name: "KPIs de sostenibilidad",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "plan_de_reporting_esg",
      name: "Plan de reporting ESG",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "compromiso_de_verificacion_externa",
      name: "Compromiso de verificación externa",
      category: "financial",
      subcategory: "Análisis de financiación verde",
      type: "optional",
      status: "pending",
    },
    {
      id: "retorno_de_inversion_roi_proyectado",
      name: "Retorno de inversión (ROI) proyectado",
      category: "financial",
      subcategory: "ROI y rentabilidad",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "tasa_interna_de_retorno_tir",
      name: "Tasa interna de retorno (TIR)",
      category: "financial",
      subcategory: "ROI y rentabilidad",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "valor_actual_neto_van",
      name: "Valor actual neto (VAN)",
      category: "financial",
      subcategory: "ROI y rentabilidad",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "payback_period_periodo_recuperacion",
      name: "Payback period (periodo de recuperación)",
      category: "financial",
      subcategory: "ROI y rentabilidad",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "analisis_de_creacion_de_valor",
      name: "Análisis de creación de valor",
      category: "financial",
      subcategory: "ROI y rentabilidad",
      type: "optional",
      status: "pending",
    },
    {
      id: "impacto_en_noi_net_operating_income",
      name: "Impacto en NOI (Net Operating Income)",
      category: "financial",
      subcategory: "ROI y rentabilidad",
      type: "optional",
      status: "pending",
    },
    {
      id: "impacto_en_valoracion_del_activo",
      name: "Impacto en valoración del activo",
      category: "financial",
      subcategory: "ROI y rentabilidad",
      type: "optional",
      status: "pending",
    },
    {
      id: "exit_strategy_valoracion_salida",
      name: "Exit strategy y valoración de salida",
      category: "financial",
      subcategory: "ROI y rentabilidad",
      type: "optional",
      status: "pending",
    },
    {
      id: "formulario_kyc_know_your_client_completo",
      name: "Formulario KYC (Know Your Client) completo",
      category: "financial",
      subcategory: "KYC y compliance bancario",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_beneficiarios_finales_ubo",
      name: "Declaración de beneficiarios finales (UBO)",
      category: "financial",
      subcategory: "KYC y compliance bancario",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_de_origen_de_fondos",
      name: "Declaración de origen de fondos",
      category: "financial",
      subcategory: "KYC y compliance bancario",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "certificado_no_ser_pep_persona_politicamente",
      name: "Certificado de no ser PEP (Persona Políticamente Expuesta)",
      category: "financial",
      subcategory: "KYC y compliance bancario",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_fatca_y_crs",
      name: "Declaración FATCA y CRS",
      category: "financial",
      subcategory: "KYC y compliance bancario",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "autorizaciones_para_consulta_cirbe",
      name: "Autorizaciones para consulta CIRBE",
      category: "financial",
      subcategory: "KYC y compliance bancario",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "consentimiento_tratamiento_datos_gdpr",
      name: "Consentimiento tratamiento de datos (GDPR)",
      category: "financial",
      subcategory: "KYC y compliance bancario",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "carta_de_intenciones_loi_firmada",
      name: "Carta de intenciones / LOI firmada",
      category: "financial",
      subcategory: "Información complementaria",
      type: "optional",
      status: "pending",
    },
    {
      id: "declaracion_veracidad_informacion",
      name: "Declaración de veracidad de la información",
      category: "financial",
      subcategory: "Información complementaria",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "declaracion_solvencia_situacion_financiera",
      name: "Declaración de solvencia y situación financiera",
      category: "financial",
      subcategory: "Información complementaria",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "referencias_bancarias_y_comerciales",
      name: "Referencias bancarias y comerciales",
      category: "financial",
      subcategory: "Información complementaria",
      type: "optional",
      status: "pending",
    },
    {
      id: "cv_de_equipo_gestor_promotor",
      name: "CV de equipo gestor / promotor",
      category: "financial",
      subcategory: "Información complementaria",
      type: "optional",
      status: "pending",
    },
    {
      id: "track_record_de_proyectos_similares",
      name: "Track record de proyectos similares",
      category: "financial",
      subcategory: "Información complementaria",
      type: "optional",
      status: "pending",
    },
    {
      id: "declaracion_operaciones_relacionadas",
      name: "Declaración de operaciones relacionadas",
      category: "financial",
      subcategory: "Información complementaria",
      type: "optional",
      status: "pending",
    },
    {
      id: "green_finance_framework",
      name: "Green Finance Framework",
      category: "financial",
      subcategory: "Documentos específicos green finance",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "allocacion_fondos_proyectos_elegibles",
      name: "Allocación de fondos a proyectos elegibles",
      category: "financial",
      subcategory: "Documentos específicos green finance",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "impact_reporting_template",
      name: "Impact reporting template",
      category: "financial",
      subcategory: "Documentos específicos green finance",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "compromiso_de_reporting_periodico",
      name: "Compromiso de reporting periódico",
      category: "financial",
      subcategory: "Documentos específicos green finance",
      type: "mandatory",
      status: "pending",
    },
    {
      id: "external_review_second_party_opinion",
      name: "External review (Second Party Opinion)",
      category: "financial",
      subcategory: "Documentos específicos green finance",
      type: "optional",
      status: "pending",
    },
    {
      id: "plan_verificacion_post_desembolso",
      name: "Plan de verificación post-desembolso",
      category: "financial",
      subcategory: "Documentos específicos green finance",
      type: "optional",
      status: "pending",
    },
  ];

  const loadAuditData = useCallback(async () => {
    if (!selectedBuildingId) return;
    setIsLoadingAudit(true);
    try {
      const data = await fetchDataRoomAudit(selectedBuildingId);
      console.log("Raw Audit Data:", data);
      const auditMap = (data || []).reduce((acc: any, audit: any) => {
        // Try both camelCase and snake_case just in case
        const key = audit.checklist_id || audit.checklistId;
        if (key) {
          acc[key] = audit;
        }
        return acc;
      }, {});
      console.log("Audit Map:", auditMap);
      setAuditData(auditMap);
    } catch (error) {
      console.error("Error loading audit data:", error);
    } finally {
      setIsLoadingAudit(false);
    }
  }, [selectedBuildingId, setIsLoadingAudit, setAuditData]);

  useEffect(() => {
    loadAuditData();
  }, [loadAuditData]);

  const handleUpload = async (checklistId: string, file: File) => {
    if (!selectedBuildingId) {
      toast.error(
        t("dataRoom.errors.noBuildingSelected") ||
          "Seleccione un edificio primero",
      );
      return;
    }

    const toastId = toast.loading(
      t("dataRoom.uploading") || "Subiendo archivo...",
    );

    try {
      await uploadDataRoomFile(selectedBuildingId, checklistId, file);
      toast.success(
        t("dataRoom.uploadSuccess") || "Archivo subido correctamente",
        { id: toastId },
      );
      loadAuditData();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error.message ||
          t("dataRoom.uploadError") ||
          "Error al subir el archivo",
        { id: toastId },
      );
    }
  };

  // Mapear el estado del documento basado en los datos de auditoría
  const getDocumentStatus = (
    docId: string,
  ): "verified" | "pending" | "rejected" => {
    const audit = auditData[docId];
    // console.log(`Checking status for ${docId}:`, audit);
    if (!audit) return "pending";
    if (
      audit.status === "uploaded" ||
      audit.status === "verified" ||
      audit.status === "review" ||
      audit.status === "acepted" || // Handle typo from backend/manual entry
      audit.status === "accepted"
    )
      return "verified";
    if (audit.status === "rejected" || audit.status === "failed")
      return "rejected";
    return "pending";
  };

  // Conteos dinámicos calculados desde el array documents
  const categories: Category[] = categoryDefs.map((cat) => {
    const catDocs = documents.filter((doc) => doc.category === cat.id);
    const mandatoryCount = catDocs.filter((d) => d.type === "mandatory").length;
    const optionalCount = catDocs.filter((d) => d.type === "optional").length;
    const subcategoriesCount = new Set(catDocs.map((d) => d.subcategory)).size;
    return {
      ...cat,
      mandatory: mandatoryCount,
      verified: 0,
      optional: optionalCount,
      subcategories: subcategoriesCount,
    };
  });

  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories[0],
  );

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(categories.find((category) => category.id === id)!);
    setOpenSubcategories([]);
  };

  // Estado para controlar qué subcategorías están abiertas
  const [openSubcategories, setOpenSubcategories] = useState<string[]>([]);

  const toggleSubcategory = (subcategory: string) => {
    setOpenSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory],
    );
  };

  // Agrupar documentos por subcategoría según la categoría seleccionada
  const groupedDocuments = useMemo(() => {
    const filtered = documents.filter(
      (doc) => doc.category === selectedCategory.id,
    );
    const groups: Record<string, Document[]> = {};
    filtered.forEach((doc) => {
      if (!groups[doc.subcategory]) {
        groups[doc.subcategory] = [];
      }
      groups[doc.subcategory].push(doc);
    });
    return groups;
  }, [selectedCategory.id]);

  // Mapa de nombre de subcategoría (español) a clave de traducción
  const subcategoryKeyMap: Record<string, string> = {
    "Constitución y gobernanza": "constitucionGobernanza",
    "Propiedad del edificio": "propiedadEdificio",
    "Compliance y regulatorio": "complianceRegulatorio",
    "Proyecto y construcción": "proyectoConstruccion",
    "Instalaciones y sistemas": "instalacionesSistemas",
    "Inspecciones técnicas": "inspeccionesTecnicas",
    "Certificación energética EPBD": "certificacionEnergeticaEPBD",
    "Sostenibilidad y taxonomía EU": "sostenibilidadTaxonomiaEU",
    "Certificaciones ambientales": "certificacionesAmbientales",
    "Auditoría energética EPBD completa": "auditoriaEnergeticaEPBD",
    "Auditoría técnica del edificio": "auditoriaTecnicaEdificio",
    "Cumplimiento EPBD": "cumplimientoEPBD",
    "Taxonomía europea de actividades sostenibles": "taxonomiaEuropea",
    "Regulación financiera sostenible": "regulacionFinancieraSostenible",
    "Due diligence técnico-legal": "dueDiligenceTecnicoLegal",
    "Contratos de arrendamiento": "contratosArrendamiento",
    "Contratos de servicios y mantenimiento": "contratosServiciosMantenimiento",
    "Contratos de obra y proveedores": "contratosObraProveedores",
    "Otros acuerdos relevantes": "otrosAcuerdos",
    "Seguros del edificio": "segurosEdificio",
    "Garantías y avales": "garantiasAvales",
    "Estados financieros": "estadosFinancieros",
    "Análisis financiero del activo": "analisisFinancieroActivo",
    "Deuda y financiación actual": "deudaFinanciacionActual",
    "Valoración del inmueble": "valoracionInmueble",
    "Análisis de mercado inmobiliario": "analisisMercadoInmobiliario",
    "Posicionamiento estratégico": "posicionamientoEstrategico",
    "Modelo financiero completo": "modeloFinancieroCompleto",
    "Análisis de financiación verde": "analisisFinanciacionVerde",
    "ROI y rentabilidad": "roiRentabilidad",
    "KYC y compliance bancario": "kycComplianceBancario",
    "Información complementaria": "informacionComplementaria",
    "Documentos específicos green finance": "documentosGreenFinance",
    "Proyecto de rehabilitación energética": "proyectoRehabilitacionEnergetica",
    "Propuesta de mejoras energéticas": "propuestaMejorasEnergeticas",
    "Análisis de viabilidad del CAPEX": "analisisViabilidadCAPEX",
    "Libro del edificio": "libroEdificio",
    "Gestión operativa": "gestionOperativa",
    "Facility management": "facilityManagement",
    "Estudio de contaminación": "estudioContaminacion",
    "Gestión ambiental": "gestionAmbiental",
    "Normativa urbanística aplicable": "normativaUrbanistica",
    "Licencias y permisos": "licenciasPermisos",
    "Protección y catalogación": "proteccionCatalogacion",
  };

  // Función para obtener el nombre traducido de una subcategoría
  const getSubcategoryName = (rawName: string): string => {
    const key = subcategoryKeyMap[rawName];
    if (key) {
      return t(`dataRoom.subcategories.${key}`);
    }
    return rawName; // Fallback al nombre original
  };

  // Mapa de categoría a clave de notas
  const notesKeyMap: Record<string, string> = {
    technical: "notesTechnical",
    legal: "notesLegal",
    financial: "notesFinancial",
    fiscal: "notesFiscal",
  };

  const handleDownloadChecklist = () => {
    const categoryKeyMap: Record<string, string> = {
      technical: "technicalDocs",
      legal: "legalDocs",
      financial: "financialDocs",
      fiscal: "fiscalDocs",
    };

    const filteredDocuments = documents
      .filter((doc) => doc.category === selectedCategory.id)
      // Enriquecer con el status real de auditData
      .map((doc) => ({
        ...doc,
        status: getDocumentStatus(doc.id), // verified | pending | rejected
      }));

    DataRoomExportService.exportChecklist(filteredDocuments, {
      translateSubcategory: getSubcategoryName,
      translateCategory: (catId: string) =>
        t(`dataRoom.${categoryKeyMap[catId]}`) || catId,
      translateType: (type: string) =>
        type === "mandatory"
          ? t("dataRoom.obligatory")
          : t("dataRoom.optionalLabel"),
      translateStatus: (status: string) =>
        t(`dataRoom.${status}Status`) || status,
      fileName: `Checklist_${selectedCategory.name}_${new Date().toISOString().split("T")[0]}`,
    });
  };

  // ─── Métricas globales calculadas desde auditData ───────────────────────
  const mandatoryDocs = documents.filter((d) => d.type === "mandatory");
  const totalDocs = documents.length;

  const verifiedStatuses = new Set([
    "uploaded",
    "verified",
    "review",
    "acepted",
    "accepted",
  ]);
  const rejectedStatuses = new Set(["rejected", "failed"]);

  const verifiedCount = Object.values(auditData).filter((a: any) =>
    verifiedStatuses.has(a.status),
  ).length;

  const rejectedCount = Object.values(auditData).filter((a: any) =>
    rejectedStatuses.has(a.status),
  ).length;

  const pendingCount = totalDocs - verifiedCount - rejectedCount;

  const mandatoryVerifiedCount = mandatoryDocs.filter((d) => {
    const audit = auditData[d.id];
    return audit && verifiedStatuses.has(audit.status);
  }).length;

  const dossierPercentage =
    mandatoryDocs.length > 0
      ? Math.round((mandatoryVerifiedCount / mandatoryDocs.length) * 100)
      : 0;
  // DEMO: indica si una categoría tiene algún documento processándose actualmente
  const categoryHasUploading = (categoryId: string): boolean =>
    documents
      .filter((d) => d.category === categoryId)
      .some((d) => auditData[d.id]?.status === "processing");
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div>
      <div className="hidden md:flex items-center justify-end gap-3 md:gap-4">
        <div className="text-left md:text-right">
          <div className="text-[10px] md:text-xs text-gray-900">
            {t("dataRoom.dossierCompletion")}
          </div>
          <div className="text-base md:text-lg text-[#1e3a8a]">
            {dossierPercentage}%
          </div>
        </div>
        <button
          disabled={isDownloadingDossier}
          onClick={async () => {
            setIsDownloadingDossier(true);
            try {
              await downloadDossierPdf(selectedBuildingId!);
            } catch (err: any) {
              toast.error(err.message || "Error al descargar el dossier");
            } finally {
              setIsDownloadingDossier(false);
            }
          }}
          className="px-3 md:px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download
            className={`lucide lucide-download w-3 h-3 md:w-4 md:h-4 ${isDownloadingDossier ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">
            {isDownloadingDossier
              ? "Generando..."
              : t("dataRoom.downloadDossier")}
          </span>
          <span className="sm:hidden">{t("dataRoom.download")}</span>
        </button>
      </div>
      <div className="hidden md:block bg-[#1e3a8a] text-white rounded-lg p-3 my-3 md:p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm mb-0.5 truncate">
              {t("dataRoom.title")}
            </h1>
            <p className="text-[10px] md:text-xs text-blue-200 truncate">
              {t("dataRoom.subtitle")}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-2 md:p-4">
          <p className="text-[10px] md:text-sm text-gray-600 mb-0.5 md:mb-1">
            {t("dataRoom.totalDocs")}
          </p>
          <p className="text-lg md:text-2xl text-[#1e3a8a]">{totalDocs}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-green-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <CircleCheck
              className="w-3 h-3 md:w-4 md:h-4 text-green-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.verified")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-green-600">{verifiedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-orange-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <Clock
              className="w-3 h-3 md:w-4 md:h-4 text-orange-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.review")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-orange-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-gray-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <TriangleAlert
              className="w-3 h-3 md:w-4 md:h-4 text-gray-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.pending")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-gray-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-red-200 p-2 md:p-4">
          <div className="flex items-center gap-1 md:gap-2 mb-0.5 md:mb-1">
            <CircleAlert
              className="w-3 h-3 md:w-4 md:h-4 text-red-600"
              aria-hidden="true"
            />
            <p className="text-[10px] md:text-sm text-gray-600">
              {t("dataRoom.obligatory")}
            </p>
          </div>
          <p className="text-lg md:text-2xl text-red-600">{rejectedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow border-2 border-[#1e3a8a] p-2 md:hidden">
          <p className="text-[10px] text-gray-600 mb-0.5">
            {t("dataRoom.completion")}
          </p>
          <p className="text-lg text-[#1e3a8a]">{dossierPercentage}%</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 my-3 md:my-6 p-3 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <button
            className={
              "p-2 md:p-4 rounded-lg transition-all text-left border-2 " +
              (selectedCategory.id === "technical"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200")
            }
            onClick={() => handleCategorySelect("technical")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                <LucideWrench className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-xs md:text-sm text-gray-900 truncate">
                    {t("dataRoom.technicalDocs")}
                  </div>
                  {/* DEMO: indicador de subida activa */}
                  {categoryHasUploading("technical") && (
                    <span
                      className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0"
                      title="Procesando..."
                    />
                  )}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[0].mandatory +
                    categories[0].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-blue-600"
                style={{
                  width: `${(categories[0].verified / (categories[0].mandatory + categories[0].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[0].verified,
                total: categories[0].mandatory + categories[0].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "legal"
                ? "border-purple-600 bg-purple-50"
                : "border-gray-200 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("legal")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                <LucideScale className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-xs md:text-sm text-gray-900 truncate">
                    {t("dataRoom.legalDocs")}
                  </div>
                  {categoryHasUploading("legal") && (
                    <span
                      className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0"
                      title="Procesando..."
                    />
                  )}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[1].mandatory +
                    categories[1].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-purple-600"
                style={{
                  width: `${(categories[1].verified / (categories[1].mandatory + categories[1].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[1].verified,
                total: categories[1].mandatory + categories[1].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "financial"
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("financial")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                <LucideAward className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="text-xs md:text-sm text-gray-900 truncate">
                    {t("dataRoom.financialDocs")}
                  </div>
                  {categoryHasUploading("financial") && (
                    <span
                      className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0"
                      title="Procesando..."
                    />
                  )}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[2].mandatory +
                    categories[2].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-green-600"
                style={{
                  width: `${(categories[2].verified / (categories[2].mandatory + categories[2].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[2].verified,
                total: categories[2].mandatory + categories[2].optional,
              })}
            </div>
          </button>
          <button
            className={
              "p-2 md:p-4 rounded-lg border-2 transition-all text-left " +
              (selectedCategory.id === "fiscal"
                ? "border-orange-600 bg-orange-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50")
            }
            onClick={() => handleCategorySelect("fiscal")}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 min-w-0">
              <div className="p-1.5 md:p-2 rounded-lg bg-orange-100 text-orange-600 flex-shrink-0">
                <LucideAward className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs md:text-sm text-gray-900 truncate">
                  {t("dataRoom.fiscalDocs")}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">
                  {categories[3].mandatory +
                    categories[3].optional +
                    " " +
                    t("dataRoom.docsCount")}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div
                className="h-1.5 md:h-2 rounded-full bg-orange-600"
                style={{
                  width: `${(categories[3].verified / (categories[3].mandatory + categories[3].optional)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-[10px] md:text-xs text-gray-600 mt-1">
              {t("dataRoom.verifCount", {
                verif: categories[3].verified,
                total: categories[3].mandatory + categories[3].optional,
              })}
            </div>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 lg:h-[950px]">
        <div className="lg:col-span-8 min-h-0">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div
                  className={`p-2 md:p-3 rounded-lg bg-${selectedCategory.color}-100 text-${selectedCategory.color}-600 flex-shrink-0`}
                >
                  <selectedCategory.icon />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm md:text-lg text-gray-900 truncate">
                    {selectedCategory.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {t("dataRoom.verifDocsStatus", {
                      verif: selectedCategory.verified,
                      total:
                        selectedCategory.mandatory + selectedCategory.optional,
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-2 border-dashed rounded-xl p-4 md:p-8 mb-4 md:mb-6 transition-all border-gray-300 hover:border-gray-400 hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                <Upload
                  className="lucide lucide-upload w-8 h-8 md:w-12 md:h-12 text-gray-400"
                  aria-hidden="true"
                />
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-900 mb-0.5 md:mb-1">
                    <span className="hidden sm:inline">
                      {t("dataRoom.dragAndDrop")}
                    </span>
                    <span className="sm:hidden">
                      {t("dataRoom.dragAndDropShort")}
                    </span>
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-600">
                    {t("dataRoom.fileLimits")}
                  </p>
                </div>
                <button className="px-3 md:px-4 py-1.5 md:py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm">
                  {t("dataRoom.selectFiles")}
                </button>
              </div>
            </div>
            <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto min-h-0 pr-1">
              {isLoadingAudit ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                documents
                  .filter(
                    (doc) =>
                      doc.category === selectedCategory.id &&
                      doc.type === "mandatory",
                  )
                  .map((doc) => (
                    <DocumentItem
                      key={doc.id}
                      id={doc.id}
                      title={doc.name}
                      description={getSubcategoryName(doc.subcategory)}
                      status={getDocumentStatus(doc.id)}
                      isObligatory={true}
                      onUpload={(file) => handleUpload(doc.id, file)}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 min-h-0 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 md:p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm text-gray-900 mb-0.5">
                      {t("dataRoom.guideTitle")}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {selectedCategory.guide}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl text-blue-600">
                      {selectedCategory.mandatory + selectedCategory.optional}
                    </div>
                    <div className="text-xs text-gray-600">
                      {t("dataRoom.totalDocuments")}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.obligatoryItems")}
                    </div>
                    <div className="text-xl text-red-600">
                      {selectedCategory.mandatory}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.optionalItems")}
                    </div>
                    <div className="text-xl text-gray-600">
                      {selectedCategory.optional}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">
                      {t("dataRoom.categoriesCount")}
                    </div>
                    <div className="text-xl text-blue-600">
                      {Object.keys(groupedDocuments).length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(groupedDocuments).map(
                  ([subcategoryName, docs]) => {
                    const mandatoryCount = docs.filter(
                      (d) => d.type === "mandatory",
                    ).length;
                    const isOpen = openSubcategories.includes(subcategoryName);
                    return (
                      <div
                        key={subcategoryName}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSubcategory(subcategoryName)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {isOpen ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                            <div className="text-left">
                              <h4 className="text-sm text-gray-900 mb-0.5">
                                {getSubcategoryName(subcategoryName)}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs text-gray-600">
                                {docs.length}{" "}
                                {t("dataRoom.docsCount", {
                                  count: docs.length,
                                })}
                              </div>
                              <div className="text-xs text-red-600">
                                {mandatoryCount} {t("dataRoom.obligatoryItems")}
                              </div>
                            </div>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-3 space-y-2">
                            {docs.map((doc, idx) => (
                              <DocumentItem
                                key={doc.id || idx}
                                id={doc.id}
                                title={doc.name}
                                description={getSubcategoryName(
                                  doc.subcategory,
                                )}
                                status={getDocumentStatus(doc.id)}
                                isObligatory={doc.type === "mandatory"}
                                onUpload={(file) => handleUpload(doc.id, file)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Download
                    className="lucide lucide-download w-6 h-6 text-green-600 mt-1 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-900 mb-2">
                      {t("dataRoom.downloadChecklistTitle")}
                    </h4>
                    <p className="text-xs text-gray-700 mb-3">
                      {t("dataRoom.downloadChecklistDesc")}
                    </p>
                    <button
                      onClick={handleDownloadChecklist}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <Download
                        className="lucide lucide-download w-4 h-4"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        {t("dataRoom.downloadChecklistBtn", {
                          category: selectedCategory.name,
                        })}
                      </span>
                      <span className="sm:hidden">
                        {t("dataRoom.download")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm text-gray-900 mb-2">
                      {t(`dataRoom.${notesKeyMap[selectedCategory.id]}.title`)}
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>
                        •{" "}
                        <strong>
                          {t(
                            `dataRoom.${notesKeyMap[selectedCategory.id]}.note1Label`,
                          )}
                          :
                        </strong>{" "}
                        {t(
                          `dataRoom.${notesKeyMap[selectedCategory.id]}.note1`,
                        )}
                      </li>
                      <li>
                        •{" "}
                        <strong>
                          {t(
                            `dataRoom.${notesKeyMap[selectedCategory.id]}.note2Label`,
                          )}
                          :
                        </strong>{" "}
                        {t(
                          `dataRoom.${notesKeyMap[selectedCategory.id]}.note2`,
                        )}
                      </li>
                      <li>
                        •{" "}
                        <strong>
                          {t(
                            `dataRoom.${notesKeyMap[selectedCategory.id]}.note3Label`,
                          )}
                          :
                        </strong>{" "}
                        {t(
                          `dataRoom.${notesKeyMap[selectedCategory.id]}.note3`,
                        )}
                      </li>
                      <li>
                        •{" "}
                        <strong>
                          {t(
                            `dataRoom.${notesKeyMap[selectedCategory.id]}.note4Label`,
                          )}
                          :
                        </strong>{" "}
                        {t(
                          `dataRoom.${notesKeyMap[selectedCategory.id]}.note4`,
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRoom;
