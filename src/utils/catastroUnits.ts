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

  // El XML de Consulta_DNPLOC para unidades por dirección viene tipicamente como:
  // <consulta_dnp xmlns="http://www.catastro.meh.es/">
  //   <lrcdnp>
  //     <rcdnp> ... <loint><pt>..</pt><pu>..</pu></loint> ... <debi><luso>..</luso><sfc>..</sfc></debi> ... </rcdnp>
  //   </lrcdnp>
  //
  // Usamos getElementsByTagNameNS con el namespace principal de Catastro.

  const CAT_NS = 'http://www.catastro.meh.es/';

  const rcdnpNodes = Array.from(doc.getElementsByTagNameNS(CAT_NS, 'rcdnp'));
  if (rcdnpNodes.length === 0) {
    // Puede que el parser no haya reconocido el namespace; intentamos sin NS como fallback.
    const fallbackNodes = Array.from(doc.getElementsByTagName('rcdnp'));
    if (fallbackNodes.length === 0) {
      return [];
    }
    return fallbackNodes.map((node, index) => mapRcdnpNodeToUnit(node, index));
  }

  return rcdnpNodes.map((node, index) => mapRcdnpNodeToUnit(node, index));
}

function mapRcdnpNodeToUnit(node: Element, index: number): FrontendUnit {
  const getTextIn = (parent: Element | null, tag: string): string | null => {
    if (!parent) return null;
    const el = parent.getElementsByTagName(tag)[0] as Element | undefined;
    const text = el?.textContent?.trim() ?? '';
    return text.length > 0 ? text : null;
  };

  // loint contiene la localización interior: pt (planta) y pu (puerta)
  const loint = node.getElementsByTagName('loint')[0] as Element | undefined;
  const pt = getTextIn(loint ?? null, 'pt'); // planta
  const pu = getTextIn(loint ?? null, 'pu'); // puerta

  // debi contiene datos económicos / uso y superficie
  const debi = node.getElementsByTagName('debi')[0] as Element | undefined;
  const luso = getTextIn(debi ?? null, 'luso'); // uso / descripción
  const sfcRaw = getTextIn(debi ?? null, 'sfc'); // superficie construida

  let areaM2: number | null = null;
  if (sfcRaw) {
    const normalized = sfcRaw.replace(',', '.').replace(/[^\d.]/g, '');
    const parsed = parseFloat(normalized);
    areaM2 = Number.isFinite(parsed) ? parsed : null;
  }

  const identifierParts = [pt, pu].filter(Boolean);
  const identifier =
    identifierParts.length > 0 ? identifierParts.join('-') : `UC-${index + 1}`;

  const nameBase = luso || 'Unidad';
  const name = `${nameBase} ${identifier}`;

  return {
    name,
    identifier,
    floor: pt,
    areaM2,
    useType: luso,
  };
}

