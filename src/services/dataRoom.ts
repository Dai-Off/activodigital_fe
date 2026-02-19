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

  return apiFetch("/data-room/upload", {
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
  const apiBase = import.meta.env.VITE_API_BASE ?? "";
  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? "";

  const response = await fetch(
    `${apiBase}/api/data-room/dossier/${buildingId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

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
