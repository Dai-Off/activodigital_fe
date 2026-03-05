import { useState, useCallback, useRef } from "react";
import type { Building } from "../services/buildingsApi";
import type { FinancialSnapshot } from "../services/financialSnapshots";
import type { PersistedEnergyCertificate } from "../services/energyCertificates";
import { BuildingsApiService } from "../services/buildingsApi";
import { FinancialSnapshotsService } from "../services/financialSnapshots";
import { EnergyCertificatesService } from "../services/energyCertificates";

type FieldSource = "building" | "snapshot" | "certificate";

interface SaveResult {
  success: boolean;
  errors: string[];
}

/**
 * Calcula las diferencias entre el draft y la versión original,
 * devolviendo solo las claves que cambiaron.
 */
function objectDiff<T extends Record<string, any>>(
  original: T,
  draft: T,
): Partial<T> {
  const diff: Partial<T> = {};
  for (const key of Object.keys(draft) as Array<keyof T>) {
    const orig = original[key];
    const curr = draft[key];
    // Para objetos (como addressData), comparar stringified
    if (typeof curr === "object" && curr !== null) {
      if (JSON.stringify(orig) !== JSON.stringify(curr)) {
        diff[key] = curr;
      }
    } else if (orig !== curr) {
      diff[key] = curr;
    }
  }
  return diff;
}

export function useAssetEdit(
  building: Building | null,
  snapshot: FinancialSnapshot | null,
  certificate: PersistedEnergyCertificate | null,
  onSaveSuccess: () => void,
) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Drafts editables — contienen los valores en edición
  const [buildingDraft, setBuildingDraft] = useState<Record<string, any>>({});
  const [snapshotDraft, setSnapshotDraft] = useState<Record<string, any>>({});
  const [certificateDraft, setCertificateDraft] = useState<Record<string, any>>(
    {},
  );

  // Referencias a los datos originales al momento de entrar en edición
  const originalBuilding = useRef<Record<string, any>>({});
  const originalSnapshot = useRef<Record<string, any>>({});
  const originalCertificate = useRef<Record<string, any>>({});

  const startEditing = useCallback(() => {
    const bDraft: Record<string, any> = {
      name: building?.name ?? "",
      cadastralReference: building?.cadastralReference ?? "",
      address: building?.address ?? "",
      addressData: { ...(building?.addressData ?? {}) },
      lat: building?.lat ?? "",
      lng: building?.lng ?? "",
      typology: building?.typology ?? "",
      constructionYear: building?.constructionYear ?? "",
      numUnits: building?.numUnits ?? "",
      numFloors: building?.numFloors ?? "",
      squareMeters: building?.squareMeters ?? "",
      price: building?.price ?? "",
      potentialValue: building?.potentialValue ?? "",
      status: building?.status ?? "",
    };
    setBuildingDraft(bDraft);
    originalBuilding.current = JSON.parse(JSON.stringify(bDraft));

    const sDraft: Record<string, any> = {
      ingresos_brutos_anuales_eur: snapshot?.ingresos_brutos_anuales_eur ?? "",
      opex_seguros_anual_eur: snapshot?.opex_seguros_anual_eur ?? "",
      opex_energia_anual_eur: snapshot?.opex_energia_anual_eur ?? "",
      opex_mantenimiento_anual_eur:
        snapshot?.opex_mantenimiento_anual_eur ?? "",
      opex_otros_anual_eur: snapshot?.opex_otros_anual_eur ?? "",
    };
    setSnapshotDraft(sDraft);
    originalSnapshot.current = JSON.parse(JSON.stringify(sDraft));

    const cDraft: Record<string, any> = {
      rating: certificate?.rating ?? "",
      primaryEnergyKwhPerM2Year: certificate?.primaryEnergyKwhPerM2Year ?? "",
      emissionsKgCo2PerM2Year: certificate?.emissionsKgCo2PerM2Year ?? "",
      issueDate: certificate?.issueDate ?? "",
      expiryDate: certificate?.expiryDate ?? "",
    };
    setCertificateDraft(cDraft);
    originalCertificate.current = JSON.parse(JSON.stringify(cDraft));

    setErrors([]);
    setIsEditing(true);
  }, [building, snapshot, certificate]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setErrors([]);
  }, []);

  const handleFieldChange = useCallback((fieldKey: string, value: any) => {
    // fieldKey format: "building.name", "snapshot.opex_energia_anual_eur", "certificate.rating"
    const [source, ...rest] = fieldKey.split(".") as [FieldSource, ...string[]];
    const key = rest.join(".");

    switch (source) {
      case "building":
        setBuildingDraft((prev) => {
          // Support nested keys like "addressData.municipality"
          if (key.startsWith("addressData.")) {
            const subKey = key.replace("addressData.", "");
            return {
              ...prev,
              addressData: { ...prev.addressData, [subKey]: value },
            };
          }
          return { ...prev, [key]: value };
        });
        break;
      case "snapshot":
        setSnapshotDraft((prev) => ({ ...prev, [key]: value }));
        break;
      case "certificate":
        setCertificateDraft((prev) => ({ ...prev, [key]: value }));
        break;
    }
  }, []);

  /**
   * Valor actual del campo: durante edición toma del draft, si no del original.
   */
  const getFieldValue = useCallback(
    (fieldKey: string): any => {
      const [source, ...rest] = fieldKey.split(".") as [
        FieldSource,
        ...string[],
      ];
      const key = rest.join(".");

      if (isEditing) {
        const draft =
          source === "building"
            ? buildingDraft
            : source === "snapshot"
              ? snapshotDraft
              : certificateDraft;

        if (source === "building" && key.startsWith("addressData.")) {
          const subKey = key.replace("addressData.", "");
          return draft.addressData?.[subKey] ?? "";
        }
        return draft[key] ?? "";
      }

      // Modo lectura: devolver del dato original
      switch (source) {
        case "building":
          if (key.startsWith("addressData.")) {
            const subKey = key.replace("addressData.", "");
            return (building?.addressData as any)?.[subKey];
          }
          return (building as any)?.[key];
        case "snapshot":
          return (snapshot as any)?.[key];
        case "certificate":
          return (certificate as any)?.[key];
        default:
          return undefined;
      }
    },
    [
      isEditing,
      building,
      snapshot,
      certificate,
      buildingDraft,
      snapshotDraft,
      certificateDraft,
    ],
  );

  const saveChanges = useCallback(async (): Promise<SaveResult> => {
    if (!building) return { success: false, errors: ["No hay edificio"] };

    setSaving(true);
    setErrors([]);
    const saveErrors: string[] = [];

    // Calcular diffs
    const bDiff = objectDiff(originalBuilding.current, buildingDraft);
    const sDiff = objectDiff(originalSnapshot.current, snapshotDraft);
    const cDiff = objectDiff(originalCertificate.current, certificateDraft);

    const hasBuildingChanges = Object.keys(bDiff).length > 0;
    const hasSnapshotChanges = Object.keys(sDiff).length > 0;
    const hasCertificateChanges = Object.keys(cDiff).length > 0;

    if (!hasBuildingChanges && !hasSnapshotChanges && !hasCertificateChanges) {
      setIsEditing(false);
      setSaving(false);
      return { success: true, errors: [] };
    }

    const promises: Promise<void>[] = [];

    if (hasBuildingChanges) {
      promises.push(
        BuildingsApiService.updateBuilding(building.id, bDiff as any)
          .then(() => {})
          .catch((err) => {
            saveErrors.push(
              `Error al guardar edificio: ${err.message || "Error desconocido"}`,
            );
          }),
      );
    }

    if (hasSnapshotChanges && snapshot?.id) {
      promises.push(
        FinancialSnapshotsService.updateFinancialSnapshot(
          snapshot.id,
          sDiff as any,
        )
          .then(() => {})
          .catch((err) => {
            saveErrors.push(
              `Error al guardar datos financieros: ${err.message || "Error desconocido"}`,
            );
          }),
      );
    }

    if (hasCertificateChanges && certificate?.id) {
      promises.push(
        EnergyCertificatesService.updateCertificate(
          certificate.id,
          cDiff as any,
        )
          .then(() => {})
          .catch((err) => {
            saveErrors.push(
              `Error al guardar certificado energético: ${err.message || "Error desconocido"}`,
            );
          }),
      );
    }

    await Promise.all(promises);

    setSaving(false);

    if (saveErrors.length > 0) {
      setErrors(saveErrors);
      return { success: false, errors: saveErrors };
    }

    setIsEditing(false);
    onSaveSuccess();
    return { success: true, errors: [] };
  }, [
    building,
    snapshot,
    certificate,
    buildingDraft,
    snapshotDraft,
    certificateDraft,
    onSaveSuccess,
  ]);

  return {
    isEditing,
    saving,
    errors,
    startEditing,
    cancelEditing,
    handleFieldChange,
    getFieldValue,
    saveChanges,
  };
}
