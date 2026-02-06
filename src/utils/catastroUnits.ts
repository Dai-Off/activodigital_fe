// src/utils/catastroUnits.ts
//
// Utilidades para mapear el XML devuelto por Catastro (Consulta_DNPLOC)
// a un modelo de unidades entendible por el frontend.

export interface FrontendUnit {
  name: string;
  identifier: string;
  floor: string | null;
  areaM2: number | null;
  useType: string | null;
}

export function parseCatastroUnitsFromXml(xml: string): FrontendUnit[] {
  if (!xml || typeof xml !== 'string') {
    return [];
  }

  let doc: Document;
  try {
    const parser = new DOMParser();
    doc = parser.parseFromString(xml, 'text/xml');

    const parserError = doc.getElementsByTagName('parsererror')[0];
    if (parserError) {
      console.error('Error al parsear XML de Catastro:', parserError.textContent);
      return [];
    }
  } catch (error) {
    console.error('Error al inicializar DOMParser para XML de Catastro:', error);
    return [];
  }

  const CAT_NS = 'http://www.catastro.meh.es/';

  // Intento 1: Buscar 'rcdnp' (Formato de Consulta_DNPLOC / Por Dirección)
  const rcdnpNodes = Array.from(doc.getElementsByTagNameNS(CAT_NS, 'rcdnp'));
  if (rcdnpNodes.length > 0) {
    return rcdnpNodes.map((node, index) => mapRcdnpNodeToUnit(node, index));
  }

  // Intento 2: Buscar 'cons' (Formato de Consulta_DNPRC / Por RC)
  const consNodes = Array.from(doc.getElementsByTagNameNS(CAT_NS, 'cons'));
  if (consNodes.length > 0) {
    return consNodes.map((node, index) => mapConsNodeToUnit(node, index));
  }

  // Fallback sin Namespace
  const fallbackRcdnp = Array.from(doc.getElementsByTagName('rcdnp'));
  if (fallbackRcdnp.length > 0) {
    return fallbackRcdnp.map((node, index) => mapRcdnpNodeToUnit(node, index));
  }

  const fallbackCons = Array.from(doc.getElementsByTagName('cons'));
  if (fallbackCons.length > 0) {
    return fallbackCons.map((node, index) => mapConsNodeToUnit(node, index));
  }

  return [];
}

/**
 * Mapea un nodo 'rcdnp' (Consulta_DNPLOC) a FrontendUnit
 */
function mapRcdnpNodeToUnit(node: Element, index: number): FrontendUnit {
  const getTextIn = (parent: Element | null, tag: string): string | null => {
    if (!parent) return null;
    const el = parent.getElementsByTagName(tag)[0] as Element | undefined;
    const text = el?.textContent?.trim() ?? '';
    return text.length > 0 ? text : null;
  };

  const loint = node.getElementsByTagName('loint')[0] as Element | undefined;
  const pt = getTextIn(loint ?? null, 'pt');
  const pu = getTextIn(loint ?? null, 'pu');

  const debi = node.getElementsByTagName('debi')[0] as Element | undefined;
  const luso = getTextIn(debi ?? null, 'luso');
  const sfcRaw = getTextIn(debi ?? null, 'sfc');

  let areaM2: number | null = null;
  if (sfcRaw) {
    const normalized = sfcRaw.replace(',', '.').replace(/[^\d.]/g, '');
    const parsed = parseFloat(normalized);
    areaM2 = Number.isFinite(parsed) ? parsed : null;
  }

  const identifierParts = [pt, pu].filter(Boolean);
  const identifier = identifierParts.length > 0 ? identifierParts.join('-') : `UC-${index + 1}`;
  const nameBase = luso || 'Unidad';
  const name = `${nameBase} ${identifier}`;

  return { name, identifier, floor: pt, areaM2, useType: luso };
}

/**
 * Mapea un nodo 'cons' (Consulta_DNPRC) a FrontendUnit
 */
function mapConsNodeToUnit(node: Element, index: number): FrontendUnit {
  const getTextIn = (parent: Element | null, tag: string): string | null => {
    if (!parent) return null;
    const el = parent.getElementsByTagName(tag)[0] as Element | undefined;
    const text = el?.textContent?.trim() ?? '';
    return text.length > 0 ? text : null;
  };

  // En 'cons', la info de planta/puerta suele estar en dt > lourb > loint
  const loint = node.getElementsByTagName('loint')[0] as Element | undefined;
  const pt = getTextIn(loint ?? null, 'pt');
  const pu = getTextIn(loint ?? null, 'pu');

  // El tipo de uso suele estar en lcd o dtip
  const lcd = getTextIn(node, 'lcd');
  const dtip = getTextIn(node, 'dtip');
  const finalUse = dtip || lcd || 'Construcción';

  // La superficie suele estar en dfcons > stl
  const dfcons = node.getElementsByTagName('dfcons')[0] as Element | undefined;
  const stlRaw = getTextIn(dfcons ?? null, 'stl');

  let areaM2: number | null = null;
  if (stlRaw) {
    const normalized = stlRaw.replace(',', '.').replace(/[^\d.]/g, '');
    const parsed = parseFloat(normalized);
    areaM2 = Number.isFinite(parsed) ? parsed : null;
  }

  const identifierParts = [pt, pu].filter(Boolean);
  const identifier = identifierParts.length > 0 ? identifierParts.join('-') : `UC-${index + 1}`;
  const name = `${finalUse} ${identifier}`;

  return { name, identifier, floor: pt, areaM2, useType: finalUse };
}

