import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FileText,
  Sparkles,
  Upload,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { type Building, BuildingsApiService } from "~/services/buildingsApi";
import {
  type PersistedEnergyCertificate,
  EnergyCertificatesService,
} from "~/services/energyCertificates";
import {
  extractCertificateData,
  mapAIResponseToReviewData,
  checkCertificateExtractorHealth,
} from "~/services/certificateExtractor";
import { uploadCertificateImage } from "~/services/certificateUpload";
import { getTimeRemaining } from "~/utils/getTimeRemaining";
import { BuildingCertificatesLoading } from "./ui/dashboardLoading";
import FileUpload from "./ui/FileUpload";
import { useToast } from "~/contexts/ToastContext";

export function BuildingCertificates() {
  const { id: buildingId } = useParams<{ id: string }>();
  const { showError, showSuccess } = useToast();

  const [certificates, setCertificates] = useState<
    PersistedEnergyCertificate[] | undefined
  >();
  const [building, setBuilding] = useState<Building | null>();
  const [loading, setLoading] = useState(true);

  // Estados para gestión de certificados
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<"select" | "review">("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiServiceAvailable, setAiServiceAvailable] = useState<boolean | null>(
    null
  );
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] =
    useState<PersistedEnergyCertificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [reviewData, setReviewData] = useState({
    rating: "" as "" | "A" | "B" | "C" | "D" | "E" | "F" | "G",
    primaryEnergyKwhPerM2Year: "" as string | number,
    emissionsKgCo2PerM2Year: "" as string | number,
    certificateNumber: "",
    scope: "building" as "building" | "dwelling" | "commercial_unit",
    issuerName: "",
    issueDate: "",
    expiryDate: "",
    propertyReference: "",
    notes: "",
    imageUrl: "",
    imageFilename: "",
    imageUploadedAt: "",
  });

  const loadEnergyCertificates = async () => {
    if (!buildingId) return;

    try {
      const certificatesData = await EnergyCertificatesService.getByBuilding(
        buildingId
      );
      setCertificates(certificatesData.certificates || []);
    } catch (error) {
      // Mantener estado vacío en caso de error
    }
  };

  // Función para confirmar eliminación
  const confirmDeleteCertificate = async () => {
    if (!certificateToDelete) return;

    setIsDeleting(true);
    try {
      await EnergyCertificatesService.deleteCertificate(certificateToDelete.id);
      showSuccess("Certificado eliminado correctamente");
      await loadEnergyCertificates();
      setDeleteModalOpen(false);
      setCertificateToDelete(null);
    } catch (error) {
      showError("Error al eliminar el certificado");
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para cancelar eliminación
  const cancelDeleteCertificate = () => {
    setDeleteModalOpen(false);
    setCertificateToDelete(null);
  };

  const handleCloseUpload = () => {
    setIsUploadModalOpen(false);
    setUploadStep("select");
    setSelectedFile(null);
    if (selectedFileUrl) {
      try {
        URL.revokeObjectURL(selectedFileUrl);
      } catch {}
    }
    setSelectedFileUrl(null);
    setCurrentSessionId(null);
    setReviewData({
      rating: "" as "" | "A" | "B" | "C" | "D" | "E" | "F" | "G",
      primaryEnergyKwhPerM2Year: "" as string | number,
      emissionsKgCo2PerM2Year: "" as string | number,
      certificateNumber: "",
      scope: "building" as "building" | "dwelling" | "commercial_unit",
      issuerName: "",
      issueDate: "",
      expiryDate: "",
      propertyReference: "",
      notes: "",
      imageUrl: "",
      imageFilename: "",
      imageUploadedAt: "",
    });
  };

  const handleFilesSelected = (files: File[]) => {
    const file = files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
    }
  };

  const handleContinueToReview = async () => {
    if (!selectedFile || !buildingId) return;

    try {
      setIsProcessingAI(true);

      if (aiServiceAvailable === false) {
        showError(
          "Servicio de IA no disponible",
          "El servicio de extracción de certificados no está disponible en este momento."
        );
        return;
      }

      // 1. Subir imagen del certificado
      const uploadResult = await uploadCertificateImage(
        selectedFile,
        buildingId
      );
      if (!uploadResult.success || !uploadResult.image) {
        throw new Error(
          uploadResult.error || "Error subiendo imagen del certificado"
        );
      }

      // 2. Crear sesión en el backend
      const session = await EnergyCertificatesService.createSimpleSession(
        buildingId
      );
      setCurrentSessionId(session.id);

      // 3. Extraer datos con IA
      const aiResponse = await extractCertificateData(selectedFile);
      const mappedData = mapAIResponseToReviewData(aiResponse);

      // 4. Actualizar sesión con datos extraídos
      const extractedData = {
        rating: {
          value: aiResponse.rating_letter as any,
          confidence: 0.95,
          source: "AI OCR",
        },
        primaryEnergyKwhPerM2Year: {
          value: aiResponse.energy_consumption_kwh_m2y,
          confidence: 0.95,
          source: "AI OCR",
        },
        emissionsKgCo2PerM2Year: {
          value: aiResponse.co2_emissions_kg_m2y,
          confidence: 0.95,
          source: "AI OCR",
        },
        certificateNumber: {
          value: aiResponse.registry_code,
          confidence: 0.95,
          source: "AI OCR",
        },
        scope: { value: "building" as any, confidence: 0.95, source: "AI OCR" },
        issuerName: {
          value: aiResponse.normative,
          confidence: 0.95,
          source: "AI OCR",
        },
        issueDate: {
          value: aiResponse.registry_date,
          confidence: 0.95,
          source: "AI OCR",
        },
        expiryDate: {
          value: aiResponse.valid_until,
          confidence: 0.95,
          source: "AI OCR",
        },
        propertyReference: {
          value: aiResponse.cadastral_reference,
          confidence: 0.95,
          source: "AI OCR",
        },
        notes: {
          value: mappedData.notes ?? null,
          confidence: 0.95,
          source: "AI OCR",
        },
        imageUrl: {
          value: uploadResult.image.url,
          confidence: 1.0,
          source: "Supabase Storage",
        },
        imageFilename: {
          value: uploadResult.image.filename,
          confidence: 1.0,
          source: "Supabase Storage",
        },
      };

      await EnergyCertificatesService.updateWithAIData(
        session.id,
        extractedData
      );

      // 5. Actualizar datos de revisión
      setReviewData({
        rating: (mappedData.rating as any) ?? "",
        primaryEnergyKwhPerM2Year: mappedData.primaryEnergyKwhPerM2Year ?? "",
        emissionsKgCo2PerM2Year: mappedData.emissionsKgCo2PerM2Year ?? "",
        certificateNumber: mappedData.certificateNumber ?? "",
        scope: mappedData.scope ?? "building",
        issuerName: mappedData.issuerName ?? "",
        issueDate: mappedData.issueDate ?? "",
        expiryDate: mappedData.expiryDate ?? "",
        propertyReference: mappedData.propertyReference ?? "",
        notes: mappedData.notes ?? "",
        imageUrl: uploadResult.image.url,
        imageFilename: uploadResult.image.filename,
        imageUploadedAt: uploadResult.image.uploadedAt.toISOString(),
      });
      setUploadStep("review");

      showSuccess(
        "Datos extraídos",
        "La imagen del certificado se ha guardado y los datos han sido extraídos automáticamente."
      );
    } catch (error) {
      showError(
        "Error al procesar certificado",
        error instanceof Error
          ? error.message
          : "Error desconocido al procesar el certificado"
      );
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleBackToUpload = () => {
    setUploadStep("select");
  };

  const handleConfirmAndSave = async () => {
    if (!currentSessionId) {
      showError(
        "Error de sesión",
        "No se encontró la sesión de certificado. Por favor, vuelve a subir el archivo."
      );
      return;
    }

    try {
      // Validar campos requeridos
      if (
        !reviewData.rating ||
        !reviewData.certificateNumber ||
        !reviewData.issuerName ||
        !reviewData.issueDate ||
        !reviewData.expiryDate
      ) {
        showError(
          "Campos requeridos",
          "Por favor completa todos los campos obligatorios antes de guardar."
        );
        return;
      }

      // Preparar datos finales
      const finalData = {
        rating: (reviewData.rating || undefined) as any,
        primaryEnergyKwhPerM2Year:
          typeof reviewData.primaryEnergyKwhPerM2Year === "string"
            ? parseFloat(reviewData.primaryEnergyKwhPerM2Year || "0")
            : reviewData.primaryEnergyKwhPerM2Year,
        emissionsKgCo2PerM2Year:
          typeof reviewData.emissionsKgCo2PerM2Year === "string"
            ? parseFloat(reviewData.emissionsKgCo2PerM2Year || "0")
            : reviewData.emissionsKgCo2PerM2Year,
        certificateNumber: reviewData.certificateNumber || undefined,
        scope: reviewData.scope as any,
        issuerName: reviewData.issuerName || undefined,
        issueDate: reviewData.issueDate || undefined,
        expiryDate: reviewData.expiryDate || undefined,
        propertyReference: reviewData.propertyReference || undefined,
        notes: reviewData.notes || undefined,
        imageUrl: reviewData.imageUrl || undefined,
        imageFilename: reviewData.imageFilename || undefined,
        imageUploadedAt: reviewData.imageUploadedAt || undefined,
      };

      // Confirmar certificado
      const confirmedCertificate =
        await EnergyCertificatesService.confirmCertificate(
          currentSessionId,
          finalData
        );

      showSuccess(
        "Certificado guardado",
        `Certificado ${confirmedCertificate.certificateNumber} guardado correctamente.`
      );

      // Recargar certificados
      await loadEnergyCertificates();

      // Limpiar estado
      setCurrentSessionId(null);
      setReviewData({
        rating: "" as "" | "A" | "B" | "C" | "D" | "E" | "F" | "G",
        primaryEnergyKwhPerM2Year: "" as string | number,
        emissionsKgCo2PerM2Year: "" as string | number,
        certificateNumber: "",
        scope: "building" as "building" | "dwelling" | "commercial_unit",
        issuerName: "",
        issueDate: "",
        expiryDate: "",
        propertyReference: "",
        notes: "",
        imageUrl: "",
        imageFilename: "",
        imageUploadedAt: "",
      });
      handleCloseUpload();
    } catch (error) {
      showError(
        "Error al guardar",
        error instanceof Error
          ? error.message
          : "Error desconocido al guardar el certificado"
      );
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    BuildingsApiService.getBuildingById(buildingId || "").then((data) =>
      setBuilding(data)
    );
    EnergyCertificatesService.getByBuilding(buildingId || "")
      .then((data) => setCertificates(data.certificates))
      .finally(() => setLoading(false));
  }, [buildingId]);

  // Verificar disponibilidad del servicio de IA
  useEffect(() => {
    const checkAIService = async () => {
      try {
        const isAvailable = await checkCertificateExtractorHealth();
        setAiServiceAvailable(isAvailable);
      } catch (error) {
        setAiServiceAvailable(false);
      }
    };

    checkAIService();
  }, []);

  // Bloquear scroll cuando modal está abierto
  useEffect(() => {
    if (isUploadModalOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isUploadModalOpen]);

  if (loading) {
    return <BuildingCertificatesLoading />;
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="flex-1 overflow-hidden mt-2">
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-2">
              {/* Encabezado y Botón */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm mb-0.5">Certificados Energéticos</h2>
                    <p className="text-xs text-gray-500">
                      {building?.name || "Cargando nombre del edificio..."}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex text-white items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs h-8"
                  >
                    <Upload className="w-3 h-3 mr-1.5" />
                    Cargar Certificado
                  </button>
                </div>
              </div>

              {/* Contenedor de No Data */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="relative w-full overflow-x-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b border-gray-200">
                      <tr className="border-b border-gray-200">
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Tipo
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Calificación
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Emisiones
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Emisión
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Vencimiento
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 text-xs text-gray-400">
                      <tr className="border-b border-gray-100">
                        <td className="p-2 py-3">Certificado Energético</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">Sin Datos</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-2 py-3">Inspección Técnica</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">Sin Datos</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-b-lg">
                  <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg text-gray-700 mb-2">
                    No hay certificados registrados.
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Sube el Certificado Energético y la ITE para comenzar a
                    gestionar los vencimientos y la IA de análisis.
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 mx-auto bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    Cargar Documentos Ahora
                  </button>
                </div>
              </div>

              {/* Placeholder de Análisis IA */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-purple-200 rounded">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-purple-600 mb-2">
                        IA • Análisis de eficiencia energética
                      </p>
                      <div className="space-y-2 text-gray-500">
                        <p className="text-sm leading-relaxed">
                          • La IA espera los datos del Certificado Energético
                          para generar el análisis.
                        </p>
                        <p className="text-sm leading-relaxed">
                          • Una vez cargado, verás recomendaciones de mejora,
                          comparación de consumo y riesgo de caducidad.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Upload */}
        {isUploadModalOpen && (
          <UploadModal
            uploadStep={uploadStep}
            selectedFile={selectedFile}
            selectedFileUrl={selectedFileUrl}
            isProcessingAI={isProcessingAI}
            reviewData={reviewData}
            setReviewData={setReviewData}
            handleCloseUpload={handleCloseUpload}
            handleFilesSelected={handleFilesSelected}
            handleContinueToReview={handleContinueToReview}
            handleBackToUpload={handleBackToUpload}
            handleConfirmAndSave={handleConfirmAndSave}
          />
        )}
      </div>
    );
  }

  interface CertificateProps {
    certificate: PersistedEnergyCertificate;
  }

  function CertificatesComponent({ certificate }: CertificateProps) {
    const colorRating = {
      A: "bg-green-500",
      B: "bg-green-500",
      C: "bg-amber-500",
      D: "bg-amber-500",
      E: "bg-red-500",
      F: "bg-red-500",
      G: "bg-red-500",
      ND: "bg-red-500",
    };

    let issueDateFormat = certificate.issueDate.replaceAll("-", "/");
    let expiryDateFormat = certificate.expiryDate.replaceAll("-", "/");

    let TimeRemaining = getTimeRemaining(expiryDateFormat);

    return (
      <>
        <td className="p-2 align-middle whitespace-nowrap py-2">
          <div
            className={`w-7 h-7 ${
              colorRating[certificate.rating]
            } rounded flex items-center justify-center text-white text-xs`}
          >
            {certificate.rating}
          </div>
        </td>
        <td className="p-2 align-middle whitespace-nowrap py-2">
          {certificate.emissionsKgCo2PerM2Year} kg CO₂eq/m²·año
        </td>
        <td className="p-2 align-middle whitespace-nowrap py-2">
          {issueDateFormat}
        </td>
        <td className="p-2 align-middle whitespace-nowrap py-2">
          {expiryDateFormat}
        </td>
        <td className="p-2 align-middle whitespace-nowrap py-2">
          <span
            className={`inline-flex px-2 py-0.5 rounded text-xs ${
              TimeRemaining === "Ha vencido"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            } `}
          >
            {TimeRemaining === "Ha vencido" ? "Vencido" : "Vigente"}
          </span>
        </td>
      </>
    );
  }

  return (
    <div className="flex-1 overflow-hidden mt-2">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm mb-0.5">Certificados Energéticos</h2>
                  <p className="text-xs text-gray-500">{building?.name}</p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex text-white items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs h-8"
                >
                  <Upload className="w-3 h-3 mr-1.5" />
                  Cargar Certificado
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative w-full overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b border-gray-200">
                    <tr className="hover:bg-muted/50 border-b border-gray-200 transition-colors">
                      <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-xs py-2">
                        Tipo
                      </th>
                      <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-xs py-2">
                        Calificación
                      </th>
                      <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-xs py-2">
                        Emisiones
                      </th>
                      <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-xs py-2">
                        Fecha de emisión
                      </th>
                      <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-xs py-2">
                        Fecha de Vencimiento
                      </th>
                      <th className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-xs py-2">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    <tr className="hover:bg-muted/50 border-b border-gray-200 transition-colors text-xs">
                      <td className="p-2 align-middle whitespace-nowrap py-2">
                        Certificado Energético
                      </td>
                      {certificates.map((certificate) => {
                        return (
                          <CertificatesComponent
                            key={certificate.id}
                            certificate={certificate}
                          />
                        );
                      })}
                    </tr>
                    <tr className="hover:bg-muted/50 border-b transition-colors text-xs">
                      <td className="p-2 align-middle whitespace-nowrap py-2">
                        Inspección Técnica
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap py-2">
                        <span className="text-gray-500">-</span>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap py-2">
                        -
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap py-2">
                        15/03/2024
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap py-2">
                        15/03/2029
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap py-2">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                          Vigente
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-purple-200 rounded">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-purple-600 mb-2">
                      IA • Análisis de eficiencia energética
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-purple-900 leading-relaxed">
                        • Tu consumo de 85.42 kWh/m²·año está 15% por debajo de
                        la media (100.5 kWh/m²·año)
                      </p>
                      <p className="text-sm text-purple-900 leading-relaxed">
                        • Estás cerca de calificación A+ (&lt;80 kWh/m²·año).
                        Con mejoras en aislamiento podrías alcanzarla
                      </p>
                      <p className="text-sm text-purple-900 leading-relaxed">
                        • El certificado válido hasta 13/07/2030. Renovar
                        anticipadamente podría aprovechar nuevas normativas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Upload */}
      {isUploadModalOpen && (
        <UploadModal
          uploadStep={uploadStep}
          selectedFile={selectedFile}
          selectedFileUrl={selectedFileUrl}
          isProcessingAI={isProcessingAI}
          reviewData={reviewData}
          setReviewData={setReviewData}
          handleCloseUpload={handleCloseUpload}
          handleFilesSelected={handleFilesSelected}
          handleContinueToReview={handleContinueToReview}
          handleBackToUpload={handleBackToUpload}
          handleConfirmAndSave={handleConfirmAndSave}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deleteModalOpen && (
        <DeleteConfirmationModal
          isDeleting={isDeleting}
          certificateToDelete={certificateToDelete}
          confirmDeleteCertificate={confirmDeleteCertificate}
          cancelDeleteCertificate={cancelDeleteCertificate}
        />
      )}
    </div>
  );
}

// Componente Modal de Upload
interface UploadModalProps {
  uploadStep: "select" | "review";
  selectedFile: File | null;
  selectedFileUrl: string | null;
  isProcessingAI: boolean;
  reviewData: any;
  setReviewData: (data: any) => void;
  handleCloseUpload: () => void;
  handleFilesSelected: (files: File[]) => void;
  handleContinueToReview: () => void;
  handleBackToUpload: () => void;
  handleConfirmAndSave: () => void;
}

function UploadModal({
  uploadStep,
  selectedFile,
  selectedFileUrl,
  isProcessingAI,
  reviewData,
  setReviewData,
  handleCloseUpload,
  handleFilesSelected,
  handleContinueToReview,
  handleBackToUpload,
  handleConfirmAndSave,
}: UploadModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleCloseUpload}
        onKeyDown={(e) => e.key === "Escape" && handleCloseUpload()}
        role="button"
        tabIndex={0}
        aria-label="Cerrar modal"
      />
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {uploadStep === "select"
                ? "Subir Certificado Energético"
                : "Revisar Datos Extraídos"}
            </h2>
            <button
              onClick={handleCloseUpload}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {uploadStep === "select" ? (
            <div>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                acceptedTypes={["image/*", "application/pdf"]}
                multiple={false}
                maxFiles={1}
                label="Arrastra el certificado energético aquí o haz clic para seleccionar"
              />

              {selectedFile && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                  {selectedFileUrl && (
                    <img
                      src={selectedFileUrl}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseUpload}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleContinueToReview}
                  disabled={!selectedFile || isProcessingAI}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isProcessingAI ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Procesando con IA...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calificación Energética *
                  </label>
                  <select
                    value={reviewData.rating}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, rating: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Certificado *
                  </label>
                  <input
                    type="text"
                    value={reviewData.certificateNumber}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        certificateNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consumo Energético (kWh/m²·año)
                  </label>
                  <input
                    type="number"
                    value={reviewData.primaryEnergyKwhPerM2Year}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        primaryEnergyKwhPerM2Year: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emisiones (kg CO₂/m²·año)
                  </label>
                  <input
                    type="number"
                    value={reviewData.emissionsKgCo2PerM2Year}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        emissionsKgCo2PerM2Year: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emisor *
                  </label>
                  <input
                    type="text"
                    value={reviewData.issuerName}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        issuerName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Emisión *
                  </label>
                  <input
                    type="date"
                    value={reviewData.issueDate}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        issueDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    value={reviewData.expiryDate}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referencia Catastral
                  </label>
                  <input
                    type="text"
                    value={reviewData.propertyReference}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        propertyReference: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={reviewData.notes}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <button
                  onClick={handleBackToUpload}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Volver
                </button>
                <button
                  onClick={handleConfirmAndSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar Certificado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente Modal de Confirmación de Eliminación
interface DeleteConfirmationModalProps {
  isDeleting: boolean;
  certificateToDelete: PersistedEnergyCertificate | null;
  confirmDeleteCertificate: () => void;
  cancelDeleteCertificate: () => void;
}

function DeleteConfirmationModal({
  isDeleting,
  certificateToDelete,
  confirmDeleteCertificate,
  cancelDeleteCertificate,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={cancelDeleteCertificate}
        onKeyDown={(e) => e.key === "Escape" && cancelDeleteCertificate()}
        role="button"
        tabIndex={0}
        aria-label="Cerrar modal"
      />
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar Eliminación
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar el certificado{" "}
              {certificateToDelete?.certificateNumber}? Esta acción no se puede
              deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDeleteCertificate}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteCertificate}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
