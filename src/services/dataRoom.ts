import { apiFetch } from "./api";

export async function uploadDataRoomFile(
  buildingId: string,
  checklistId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("buildingId", buildingId);
  formData.append("checklistId", checklistId);

  return apiFetch("/data-room/upload-async", {
    method: "POST",
    body: formData,
  });
}

export async function fetchDataRoomAudit(buildingId: string) {
  const response = await apiFetch(`/data-room/audit/${buildingId}`);
  return response.data;
}

/**
 * Descarga el dossier PDF combinado de todos los documentos subidos de un edificio.
 * Dispara el diálogo de descarga del navegador.
 */
export async function downloadDossierPdf(buildingId: string): Promise<void> {
  const { getApiBaseUrl } = await import("./api");
  const baseUrl = await getApiBaseUrl();

  // Misma lógica de token que apiFetch
  const token =
    window.sessionStorage.getItem("access_token") ||
    window.localStorage.getItem("access_token") ||
    "";

  const response = await fetch(`${baseUrl}/data-room/dossier/${buildingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-store",
    },
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(
      errBody.error ?? `Error ${response.status} al generar el dossier`,
    );
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dossier_${buildingId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
