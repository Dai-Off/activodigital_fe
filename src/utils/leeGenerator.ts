import jsPDF from "jspdf";
import type { Building } from "~/services/buildingsApi";

export interface LeeCeeInfo {
  rating: string;
  kwh: number;
}

export interface LeeIteInfo {
  name: string;
  issueDate: string;
  expiryDate?: string;
  statusLabel: string;
}

export interface LeeGenerationParams {
  building: Building;
  cee?: LeeCeeInfo | null;
  ite?: LeeIteInfo | null;
}

export interface LeeScenario {
  id: "minimo" | "intermedio" | "optimo";
  name: string;
  description: string;
  capex: number | null;
  savingsPercent: number | null;
  savingsKwhYear: number | null;
  savingsEuroYear: number | null;
  simplePaybackYears: number | null;
}
const formatTypology = (t?: string) => {
  if (!t) return null;
  const map: Record<string, string> = {
    residential: "Residencial Colectivo",
    mixed: "Mixto",
    commercial: "Terciario",
  };
  return map[t] || t;
};

function addTextBlock(
  pdf: jsPDF,
  text: string,
  options: { fontSize?: number; bold?: boolean } = {},
  state: { y: number; margin: number },
) {
  const { fontSize = 11, bold = false } = options;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFontSize(fontSize);
  pdf.setFont("helvetica", bold ? "bold" : "normal");

  const lines = pdf.splitTextToSize(text, pageWidth - 2 * state.margin);
  for (const line of lines as string[]) {
    if (state.y > pageHeight - state.margin) {
      pdf.addPage();
      state.y = state.margin;
    }
    pdf.text(line, state.margin, state.y);
    state.y += fontSize * 0.4;
  }
  state.y += 3;
}

export function buildLeeScenarios(params: LeeGenerationParams): LeeScenario[] {
  const { building, cee } = params;

  const area =
    typeof building.squareMeters === "number" ? building.squareMeters : null;

  // Coste base de rehabilitación (si no hay dato, estimación simple por m²)
  const baseCapexFull =
    typeof building.rehabilitationCost === "number" &&
    building.rehabilitationCost > 0
      ? building.rehabilitationCost
      : area
        ? area * 400 // 400 €/m² como orden de magnitud para rehabilitación profunda
        : 0;

  const baseEnergyKwhYear = cee && area && cee.kwh > 0 ? cee.kwh * area : null;

  const pricePerKwh = 0.2; // €/kWh aproximado

  const defs: Array<{
    id: LeeScenario["id"];
    name: string;
    description: string;
    capexFactor: number;
    savingsPercent: number;
  }> = [
    {
      id: "minimo",
      name: "Escenario mínimo (obligatorio)",
      description:
        "Actuaciones indispensables para corregir deficiencias graves y cumplir requisitos básicos de seguridad y habitabilidad.",
      capexFactor: 0.5,
      savingsPercent: 15,
    },
    {
      id: "intermedio",
      name: "Escenario intermedio",
      description:
        "Paquete equilibrado que combina corrección de deficiencias con mejoras de eficiencia con payback razonable.",
      capexFactor: 0.9,
      savingsPercent: 30,
    },
    {
      id: "optimo",
      name: "Escenario óptimo",
      description:
        "Rehabilitación integral orientada a maximizar la reducción de demanda y la elegibilidad para financiación verde.",
      capexFactor: 1.2,
      savingsPercent: 50,
    },
  ];

  return defs.map((def) => {
    const capex =
      baseCapexFull && baseCapexFull > 0
        ? baseCapexFull * def.capexFactor
        : null;

    const savingsPercent = baseEnergyKwhYear ? def.savingsPercent : null;

    const savingsKwhYear =
      baseEnergyKwhYear && savingsPercent != null
        ? (baseEnergyKwhYear * savingsPercent) / 100
        : null;

    const savingsEuroYear =
      savingsKwhYear != null ? savingsKwhYear * pricePerKwh : null;

    let simplePaybackYears: number | null = null;
    if (capex && savingsEuroYear && savingsEuroYear > 0) {
      const raw = capex / savingsEuroYear;
      simplePaybackYears = Number.isFinite(raw) ? raw : null;
    }

    return {
      id: def.id,
      name: def.name,
      description: def.description,
      capex,
      savingsPercent,
      savingsKwhYear,
      savingsEuroYear,
      simplePaybackYears,
    };
  });
}

export async function generateLeePdf(
  params: LeeGenerationParams,
): Promise<void> {
  const { building, cee, ite } = params;

  const pdf = new jsPDF("p", "mm", "a4");
  const margin = 20;
  let y = margin;
  const state = { y, margin };

  const now = new Date();

  // Título
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    "Libro del Edificio Existente (LEE)",
    pdf.internal.pageSize.getWidth() / 2,
    state.y,
    {
      align: "center",
    },
  );
  state.y += 10;

  // Subtítulo / edificio
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    building.name || "Edificio sin nombre",
    pdf.internal.pageSize.getWidth() / 2,
    state.y,
    {
      align: "center",
    },
  );
  state.y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `Generado el ${now.toLocaleDateString("es-ES")} a las ${now.toLocaleTimeString("es-ES")}`,
    pdf.internal.pageSize.getWidth() / 2,
    state.y,
    { align: "center" },
  );
  state.y += 10;

  // Bloque I - Datos generales
  addTextBlock(
    pdf,
    "BLOQUE I · Documentación general",
    { fontSize: 14, bold: true },
    state,
  );

  const identificativos: string[] = [];
  if (building.address) identificativos.push(`Dirección: ${building.address}`);
  if (building.cadastralReference)
    identificativos.push(`Ref. catastral: ${building.cadastralReference}`);
  if (building.addressData?.municipality)
    identificativos.push(`Municipio: ${building.addressData.municipality}`);
  if (building.addressData?.province)
    identificativos.push(`Provincia: ${building.addressData.province}`);
  if (
    typeof building.constructionYear === "number" &&
    building.constructionYear > 0
  )
    identificativos.push(`Año de construcción: ${building.constructionYear}`);
  if (typeof building.squareMeters === "number" && building.squareMeters > 0)
    identificativos.push(
      `Superficie: ${building.squareMeters.toLocaleString("es-ES")} m²`,
    );
  if (typeof building.numUnits === "number" && building.numUnits > 0)
    identificativos.push(`Nº de viviendas/unidades: ${building.numUnits}`);
  const uso = formatTypology(building.typology);
  if (uso) identificativos.push(`Uso: ${uso}`);

  const urbanisticos: string[] = [];
  if (building.customData?.calificacion)
    urbanisticos.push(`Calificación: ${building.customData.calificacion}`);
  if (building.customData?.proteccion)
    urbanisticos.push(`Protección: ${building.customData.proteccion}`);
  if (building.customData?.ordenanza)
    urbanisticos.push(`Ordenanza: ${building.customData.ordenanza}`);
  if (building.customData?.edificabilidad != null)
    urbanisticos.push(
      `Edificabilidad: ${building.customData.edificabilidad} m²/m²`,
    );

  const titularidad: string[] = [];
  if (building.customData?.regimen)
    titularidad.push(`Régimen: ${building.customData.regimen}`);
  if (building.customData?.cif)
    titularidad.push(`CIF: ${building.customData.cif}`);
  if (building.customData?.presidente)
    titularidad.push(`Presidente: ${building.customData.presidente}`);
  if (building.customData?.administrador)
    titularidad.push(`Administrador: ${building.customData.administrador}`);

  const hasBloqueI =
    identificativos.length > 0 ||
    urbanisticos.length > 0 ||
    titularidad.length > 0;

  if (hasBloqueI) {
    addTextBlock(
      pdf,
      identificativos.length
        ? `1.1 Datos identificativos\n- ${identificativos.join("\n- ")}`
        : "1.1 Datos identificativos\nSin datos disponibles en la ficha del edificio.",
      { fontSize: 11 },
      state,
    );

    addTextBlock(
      pdf,
      urbanisticos.length
        ? `1.2 Datos urbanísticos\n- ${urbanisticos.join("\n- ")}`
        : "1.2 Datos urbanísticos\nSin datos específicos. Completar con planeamiento y fichas urbanísticas municipales.",
      { fontSize: 11 },
      state,
    );

    addTextBlock(
      pdf,
      titularidad.length
        ? `1.3 Titularidad y representación\n- ${titularidad.join("\n- ")}`
        : "1.3 Titularidad y representación\nSin datos específicos. Completar con escrituras, contratos y datos de comunidad.",
      { fontSize: 11 },
      state,
    );
  } else {
    addTextBlock(
      pdf,
      "No se ha encontrado información general cargada para este edificio. Por favor, complete la ficha del activo para generar este apartado.",
      { fontSize: 11 },
      state,
    );
  }

  // Bloque II - Diagnóstico (resumen de CEE + ITE)
  addTextBlock(
    pdf,
    "BLOQUE II · Diagnóstico",
    { fontSize: 14, bold: true },
    state,
  );

  const hasBloqueII =
    !!cee ||
    !!ite ||
    !!building.customData?.actuaciones_urgentes ||
    !!building.customData?.consumoEnergia ||
    !!building.customData?.emisiones;

  if (hasBloqueII) {
    const fuente: string[] = [];
    fuente.push("2.1 Fuentes de información utilizadas:");

    if (building.cadastralReference) {
      fuente.push(`- Catastro: referencia ${building.cadastralReference}.`);
    } else {
      fuente.push("- Catastro: sin referencia catastral vinculada.");
    }

    if (cee) {
      const ceeLinea = [`- Certificado energético: clase ${cee.rating}`];
      if (cee.kwh > 0) {
        ceeLinea.push(
          `, consumo ${cee.kwh.toLocaleString("es-ES")} kWh/m²·año.`,
        );
      }
      fuente.push(ceeLinea.join(""));
    } else {
      fuente.push(
        "- Certificado energético: no se ha encontrado ningún certificado vinculado.",
      );
    }

    if (ite) {
      const partes: string[] = [`- Informe ITE: ${ite.name}`];
      partes.push(`, estado ${ite.statusLabel.toLowerCase()}`);
      if (ite.issueDate) partes.push(`, emitido el ${ite.issueDate}`);
      if (ite.expiryDate) partes.push(`, con vencimiento ${ite.expiryDate}`);
      partes.push(".");
      fuente.push(partes.join(""));
    } else {
      fuente.push(
        "- Informe ITE: no se ha encontrado ningún documento con ITE en la Gestión del activo.",
      );
    }

    if (
      building.customData?.actuaciones_urgentes ||
      building.customData?.coste_reparaciones
    ) {
      fuente.push("\n2.1.bis Actuaciones urgentes detectadas:");
      if (building.customData?.actuaciones_urgentes) {
        fuente.push(`- Detalle: ${building.customData.actuaciones_urgentes}`);
      }
      if (building.customData?.coste_reparaciones) {
        fuente.push(
          `- Coste estimado de reparaciones: ${building.customData.coste_reparaciones} k€ (IVA no incluido).`,
        );
      }
    }

    addTextBlock(pdf, fuente.join("\n"), { fontSize: 11 }, state);

    const energetico: string[] = ["2.2 Comportamiento energético (detalle)"];

    const rating = cee?.rating || "---";
    const consumoKwh = cee?.kwh ?? building.customData?.consumoEnergia;
    const emisiones = building.customData?.emisiones;
    const demandaCal = building.customData?.demandaCalefaccion;
    const demandaRef = building.customData?.demandaRefrigeracion;
    const costeActual = building.customData?.costeEnergetico;

    energetico.push(`- Calificación de eficiencia energética: Clase ${rating}`);

    if (consumoKwh != null) {
      energetico.push(
        `- Consumo de energía primaria: ${consumoKwh.toLocaleString("es-ES")} kWh/m²·año`,
      );
    }
    if (emisiones != null) {
      energetico.push(`- Emisiones de CO2: ${emisiones} kgCO2/m²·año`);
    }
    if (demandaCal != null) {
      energetico.push(`- Demanda de calefacción: ${demandaCal} kWh/m²·año`);
    }
    if (demandaRef != null) {
      energetico.push(`- Demanda de refrigeración: ${demandaRef} kWh/m²·año`);
    }
    if (costeActual != null) {
      energetico.push(
        `- Estimación de coste energético actual: ${costeActual} k€/año`,
      );
    }

    addTextBlock(pdf, energetico.join("\n"), { fontSize: 11 }, state);
  } else {
    addTextBlock(
      pdf,
      "No se dispone de diagnóstico técnico (ITE/CEE) ni datos de comportamiento energético para este activo. Se recomienda realizar las inspecciones y certificaciones correspondientes.",
      { fontSize: 11 },
      state,
    );
  }

  // Bloque III - Plan de actuaciones (marco básico)
  addTextBlock(
    pdf,
    "BLOQUE III · Plan de actuaciones",
    { fontSize: 14, bold: true },
    state,
  );

  const scenarios = buildLeeScenarios(params);
  const hasBloqueIII = scenarios.some(
    (s) => s.savingsPercent != null && s.savingsPercent > 0,
  );

  if (hasBloqueIII) {
    const eurFormatter = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
    const numFormatter = new Intl.NumberFormat("es-ES", {
      maximumFractionDigits: 1,
    });

    scenarios.forEach((scenario, index) => {
      const prefix = `3.${index + 1} ${scenario.name}\n`;
      const lines: string[] = [scenario.description];

      if (scenario.capex != null) {
        lines.push(
          `Inversión estimada: ${eurFormatter.format(scenario.capex)}.`,
        );
      }

      if (scenario.savingsPercent != null) {
        let ahorroLinea = `Ahorro energético estimado: ~${scenario.savingsPercent.toFixed(
          0,
        )}%`;
        if (scenario.savingsKwhYear != null) {
          ahorroLinea += ` (~${numFormatter.format(
            scenario.savingsKwhYear,
          )} kWh/año).`;
        } else {
          ahorroLinea += ".";
        }
        lines.push(ahorroLinea);
      }

      if (scenario.savingsEuroYear != null) {
        lines.push(
          `Ahorro económico aproximado: ${eurFormatter.format(
            scenario.savingsEuroYear,
          )}/año.`,
        );
      }

      if (scenario.simplePaybackYears != null) {
        lines.push(
          `Payback simple estimado: ~${numFormatter.format(
            scenario.simplePaybackYears,
          )} años.`,
        );
      }

      addTextBlock(pdf, prefix + lines.join("\n"), { fontSize: 11 }, state);
    });
  } else {
    addTextBlock(
      pdf,
      "No se han podido estimar escenarios de actuación por falta de datos base (Superficie o CEE). Complete el Diagnóstico del Bloque II para obtener el plan de actuaciones.",
      { fontSize: 11 },
      state,
    );
  }

  // Pie de página
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    "Documento generado automáticamente como borrador. Validar contenido antes de su uso oficial.",
    margin,
    pageHeight - 10,
  );

  const safeName = (building.name || "edificio").replace(/[^\w\d-_]+/g, "_");
  pdf.save(`LEE_${safeName}.pdf`);
}
