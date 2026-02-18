import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_PREFIX = "edificio_pending_jobs_";
const DEFAULT_POLLING_INTERVAL_MS = 12000;

export interface PendingJobMeta {
  jobId: string;
  buildingId: string;
  documentFilename: string;
}

export interface JobStatusResult {
  status: "queued" | "processing" | "completed" | "failed";
  error_message?: string | null;
  [key: string]: unknown;
}

export interface UseProcessingJobPollingOptions<TJob extends JobStatusResult> {
  /** Tipo de job (ej: 'invoice', 'certificate') para la clave de sessionStorage */
  jobType: string;
  buildingId: string | undefined;
  /** Función que obtiene el estado del job (ej: getInvoiceJob, getCertificateJob) */
  getJobStatus: (jobId: string) => Promise<TJob>;
  /** Se llama cuando el job pasa a completed (aquí puedes mostrar toast y abrir modal) */
  onCompleted: (job: TJob, meta: PendingJobMeta) => void;
  /** Se llama cuando el job pasa a failed (aquí puedes mostrar toast de error) */
  onFailed?: (job: TJob, meta: PendingJobMeta) => void;
  /** Intervalo de polling en ms */
  pollingIntervalMs?: number;
}

function loadPendingFromStorage(jobType: string): PendingJobMeta[] {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${jobType}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePendingToStorage(jobType: string, list: PendingJobMeta[]): void {
  sessionStorage.setItem(`${STORAGE_PREFIX}${jobType}`, JSON.stringify(list));
}

/**
 * Hook reutilizable para procesamiento asíncrono con cola (facturas, certificados, etc.).
 * Mantiene una lista de jobs pendientes en sessionStorage, hace polling y ejecuta callbacks
 * al completar o fallar.
 *
 * Uso para facturas: jobType 'invoice', getJobStatus = getInvoiceJob, onCompleted abre modal.
 *
 * Uso para certificado energético (cuando tengas cola async de certificados):
 *   jobType: 'certificate',
 *   buildingId,
 *   getJobStatus: getCertificateJob,  // API que devuelva { status, ...datos }
 *   onCompleted: (job, meta) => { showInfo(...); openCertificateReviewModal(job); },
 *   onFailed: (job) => showError(...),
 *   addPendingJob(job_id, buildingId, docName) al encolar.
 */
export function useProcessingJobPolling<TJob extends JobStatusResult>(
  options: UseProcessingJobPollingOptions<TJob>
) {
  const {
    jobType,
    buildingId,
    getJobStatus,
    onCompleted,
    onFailed,
    pollingIntervalMs = DEFAULT_POLLING_INTERVAL_MS,
  } = options;

  const [pendingJobs, setPendingJobs] = useState<PendingJobMeta[]>(() =>
    loadPendingFromStorage(jobType)
  );

  const onCompletedRef = useRef(onCompleted);
  const onFailedRef = useRef(onFailed);
  onCompletedRef.current = onCompleted;
  onFailedRef.current = onFailed;

  const addPendingJob = useCallback(
    (jobId: string, buildingIdValue: string, documentFilename: string) => {
      const meta: PendingJobMeta = { jobId, buildingId: buildingIdValue, documentFilename };
      setPendingJobs((prev) => {
        const next = [...prev, meta];
        savePendingToStorage(jobType, next);
        return next;
      });
    },
    [jobType]
  );

  const removePendingJob = useCallback(
    (jobId: string) => {
      setPendingJobs((prev) => {
        const next = prev.filter((p) => p.jobId !== jobId);
        savePendingToStorage(jobType, next);
        return next;
      });
    },
    [jobType]
  );

  useEffect(() => {
    if (!buildingId) return;
    const forThisBuilding = pendingJobs.filter((p) => p.buildingId === buildingId);
    if (forThisBuilding.length === 0) return;

    const checkPending = async () => {
      const list = [...forThisBuilding];
      for (const meta of list) {
        try {
          const job = await getJobStatus(meta.jobId);
          if (job.status === "completed") {
            onCompletedRef.current(job, meta);
            removePendingJob(meta.jobId);
            return;
          }
          if (job.status === "failed") {
            onFailedRef.current?.(job, meta);
            removePendingJob(meta.jobId);
          }
        } catch {
          // ignorar errores de red en polling
        }
      }
    };

    const t = setInterval(checkPending, pollingIntervalMs);
    checkPending();
    return () => clearInterval(t);
  }, [buildingId, pendingJobs, getJobStatus, removePendingJob, pollingIntervalMs]);

  return { pendingJobs, addPendingJob, removePendingJob };
}
