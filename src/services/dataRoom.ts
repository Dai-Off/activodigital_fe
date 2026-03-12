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
 * Sube hasta 5 archivos al Data Room para clasificación automática por IA.
 * No requiere checklistId: la IA detecta el tipo de documento.
 */
export async function uploadDataRoomBatch(buildingId: string, files: File[]) {
  const formData = new FormData();
  formData.append("buildingId", buildingId);
  files.forEach((file) => formData.append("files", file));

  return apiFetch("/data-room/upload-batch", {
    method: "POST",
    body: formData,
  });
}

/**
 * Obtiene los jobs de procesamiento batch de un edificio.
 */
export async function fetchBatchJobs(buildingId: string) {
  const response = await apiFetch(`/data-room/batch-jobs/${buildingId}`);
  return response.data;
}

/**
 * Clasifica manualmente un documento batch asignándole un checklistId.
 */
export async function classifyBatchJob(jobId: string, checklistId: string) {
  return apiFetch("/data-room/classify-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId, checklistId }),
  });
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
