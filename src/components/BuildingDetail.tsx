import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { BuildingsApiService } from "../services/buildingsApi";
import type { Building, BuildingImage } from "../services/buildingsApi";
import ImageManager from "./ui/ImageManager";
import {
  extractCertificateData,
  mapAIResponseToReviewData,
  checkCertificateExtractorHealth,
} from "../services/certificateExtractor";
import {
  EnergyCertificatesService,
  type PersistedEnergyCertificate,
} from "../services/energyCertificates";
import { uploadCertificateImage } from "../services/certificateUpload";
import { useLoadingState } from "./ui/LoadingSystem";
import FileUpload from "./ui/FileUpload";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getBookByBuilding,
  getOrCreateBookForBuilding,
  type DigitalBook,
} from "../services/digitalbook";
import {
  FileCheck2,
  Building as BuildingIcon,
  Zap,
  Wrench,
  Activity,
  ChevronLeft,
  ChevronRight,
  MapPin,
  AlertTriangle,
  Clock,
  Info,
  Trash2,
} from "lucide-react";
import {
  calculateESGScore,
  getESGScore,
  getESGLabelColor,
  type ESGResponse,
} from "../services/esg";
import { FinancialSnapshotsService } from "../services/financialSnapshots";
import { UnitsApiService, type BuildingUnit } from "../services/unitsApi";

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

ChartJS.register(ArcElement, Tooltip, Legend);

const BuildingDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [building, setBuilding] = useState<Building | null>(null);
  const { loading, startLoading, stopLoading } = useLoadingState(true);
  const [digitalBook, setDigitalBook] = useState<DigitalBook | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<"select" | "review">("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiServiceAvailable, setAiServiceAvailable] = useState<boolean | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [energyCertificates, setEnergyCertificates] = useState<
    PersistedEnergyCertificate[]
  >([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedCertificateForView, setSelectedCertificateForView] =
    useState<PersistedEnergyCertificate | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] =
    useState<PersistedEnergyCertificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [esgData, setEsgData] = useState<ESGResponse | null>(null);
  const [esgLoading, setEsgLoading] = useState(false);
  const [hasFinancialData, setHasFinancialData] = useState<boolean | null>(
    null
  );
  const [units, setUnits] = useState<BuildingUnit[]>([]);

  // Función para confirmar eliminación
  const confirmDeleteCertificate = async () => {
    if (!certificateToDelete) return;

    setIsDeleting(true);
    try {
      await EnergyCertificatesService.deleteCertificate(certificateToDelete.id);
      showSuccess("Certificado eliminado correctamente");
      // Recargar la lista de certificados
      await loadEnergyCertificates();
      // Recalcular ESG después de eliminar certificado
      await loadESGData();
      // Cerrar modales
      setDeleteModalOpen(false);
      setCertificateToDelete(null);
      setSelectedCertificateForView(null);
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
    // No cerramos el modal de vista, solo el de confirmación
  };

  // Función helper para obtener clases CSS del rating energético según escala oficial española
  const getRatingClasses = (rating: string) => {
    switch (rating) {
      case "A":
        return "bg-green-600 text-white border-green-600"; // Verde vibrante (más eficiente)
      case "B":
        return "bg-green-500 text-white border-green-500"; // Verde medio
      case "C":
        return "bg-yellow-400 text-white border-yellow-400"; // Amarillo verdoso/chartreuse
      case "D":
        return "bg-yellow-300 text-white border-yellow-300"; // Amarillo claro
      case "E":
        return "bg-orange-500 text-white border-orange-500"; // Naranja
      case "F":
        return "bg-red-500 text-white border-red-500"; // Rojo anaranjado oscuro
      case "G":
        return "bg-red-600 text-white border-red-600"; // Rojo prominente (menos eficiente)
      default:
        return "border-gray-200 text-gray-800 bg-gray-50";
    }
  };

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
    // Campos de imagen
    imageUrl: "",
    imageFilename: "",
    imageUploadedAt: "",
  });

  // Función para cargar certificados energéticos reales del backend
  const loadEnergyCertificates = async () => {
    if (!building?.id) return;

    try {
      const certificatesData = await EnergyCertificatesService.getByBuilding(
        building.id
      );
      setEnergyCertificates(certificatesData.certificates || []);
    } catch (error) {
      // Mantener estado vacío en caso de error - no mostrar error al usuario en esta carga inicial
    }
  };

  // Función para cargar datos ESG
  const loadESGData = async () => {
    const buildingId = building?.id || id;
    if (!buildingId) return;

    setEsgLoading(true);
    try {
      // Intentar calcular ESG (esto devuelve completo o incompleto)
      const esgResponse = await calculateESGScore(buildingId);
      setEsgData(esgResponse);
    } catch (error) {
      console.error("Error cargando ESG:", error);
      // Si falla, intentar obtener el score guardado
      try {
        const savedESG = await getESGScore(buildingId);
        setEsgData(savedESG);
      } catch {
        setEsgData(null);
      }
    } finally {
      setEsgLoading(false);
    }
  };

  useEffect(() => {
    const loadBuilding = async () => {
      if (!id) return;

      try {
        startLoading();
        const buildingData = await BuildingsApiService.getBuildingById(id);
        setBuilding(buildingData);
        // Cargar estado del libro del edificio (si existe)
        try {
          const book = await getBookByBuilding(id);
          setDigitalBook(book);
        } catch (e) {
          setDigitalBook(null);
        }

        // Cargar certificados energéticos del edificio - ahora buildingData.id está disponible
        const certificatesData = await EnergyCertificatesService.getByBuilding(
          buildingData.id
        );
        setEnergyCertificates(certificatesData.certificates || []);

        // Cargar datos financieros
        try {
          const snapshots =
            await FinancialSnapshotsService.getFinancialSnapshots(
              buildingData.id
            );
          setHasFinancialData(snapshots && snapshots.length > 0);
        } catch (error) {
          console.error("Error cargando datos financieros:", error);
          setHasFinancialData(false);
        }

        // Cargar unidades del edificio
        try {
          const unitsData = await UnitsApiService.listUnits(buildingData.id);
          setUnits(unitsData || []);
        } catch (error) {
          console.error("Error cargando unidades:", error);
          setUnits([]);
        }

        // Cargar datos ESG para este edificio específico
        setEsgLoading(true);
        try {
          const esgResponse = await calculateESGScore(buildingData.id);
          setEsgData(esgResponse);
        } catch (error) {
          console.error("Error cargando ESG:", error);
          try {
            const savedESG = await getESGScore(buildingData.id);
            setEsgData(savedESG);
          } catch {
            setEsgData(null);
          }
        } finally {
          setEsgLoading(false);
        }

        stopLoading();
      } catch (error) {
        showError(
          "Error al cargar edificio",
          "No se pudo cargar la información del edificio"
        );
        navigate("/assets");
        stopLoading();
      }
    };

    loadBuilding();
  }, [id, navigate, showError]);

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

  // Bloquear scroll de fondo cuando la modal está abierta
  useEffect(() => {
    if (isUploadModalOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isUploadModalOpen]);

  const handleCreateDigitalBook = async () => {
    if (!building?.id) return;

    try {
      startLoading();
      // Crear el libro en el backend
      const createdBook = await getOrCreateBookForBuilding(building.id);

      // Actualizar el estado local
      setDigitalBook(createdBook);

      // Navegar al hub
      navigate(`/digital-book/hub/${building.id}`, {
        state: {
          buildingId: building.id,
          buildingName: building.name,
          isNewBook: true,
        },
      });

      stopLoading();
    } catch (error) {
      showError("Error al crear el libro del edificio");
      stopLoading();
    }
  };

  const handleViewDigitalBook = () => {
    if (!building?.id) return;
    navigate(`/digital-book/hub/${building.id}`, {
      state: {
        buildingId: building.id,
        buildingName: building.name,
        isNewBook: false,
      },
    });
  };

  // Función para manejar la navegación a datos financieros
  const handleFinancialData = () => {
    if (!building?.id) return;
    // Si hay datos, navegar al dashboard para ver los datos en cards
    // Si no hay datos, navegar al formulario para cargar datos
    if (hasFinancialData) {
      navigate(`/cfo-due-diligence/${building.id}`);
    } else {
      // Navegar al formulario para cargar datos financieros
      navigate(`/cfo-intake/${building.id}`);
    }
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
    // Solo una imagen
    const file = files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
    }
  };

  const handleContinueToReview = async () => {
    if (!selectedFile || !building?.id) return;

    try {
      setIsProcessingAI(true);

      // Verificar si el servicio de IA está disponible
      if (aiServiceAvailable === false) {
        showError(
          "Servicio de IA no disponible",
          "El servicio de extracción de certificados no está disponible en este momento."
        );
        return;
      }

      // 1. Subir imagen del certificado a Supabase Storage
      const uploadResult = await uploadCertificateImage(
        selectedFile,
        building.id
      );
      if (!uploadResult.success || !uploadResult.image) {
        throw new Error(
          uploadResult.error || "Error subiendo imagen del certificado"
        );
      }

      // 2. Crear sesión simple en el backend con información de la imagen
      const session = await EnergyCertificatesService.createSimpleSession(
        building.id
      );
      setCurrentSessionId(session.id);

      // 3. Extraer datos con IA
      const aiResponse = await extractCertificateData(selectedFile);
      const mappedData = mapAIResponseToReviewData(aiResponse);

      // 4. Actualizar sesión con datos extraídos por IA e información de la imagen
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
        // Información de la imagen almacenada
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

      // 5. Actualizar datos de revisión para el usuario
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
        // Incluir información de la imagen
        imageUrl: uploadResult.image.url,
        imageFilename: uploadResult.image.filename,
        imageUploadedAt: uploadResult.image.uploadedAt.toISOString(),
      });
      setUploadStep("review");

      showSuccess(
        "Datos extraídos",
        "La imagen del certificado se ha guardado y los datos han sido extraídos automáticamente. Revisa y ajusta si es necesario."
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
      // Validar campos requeridos antes de enviar
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

      // Preparar datos finales con los tipos correctos
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
        // Incluir información de la imagen almacenada
        imageUrl: reviewData.imageUrl || undefined,
        imageFilename: reviewData.imageFilename || undefined,
        imageUploadedAt: reviewData.imageUploadedAt || undefined,
      };

      // Confirmar certificado en el backend
      const confirmedCertificate =
        await EnergyCertificatesService.confirmCertificate(
          currentSessionId,
          finalData
        );

      showSuccess(
        "Certificado guardado",
        `Certificado ${confirmedCertificate.certificateNumber} guardado correctamente.`
      );

      // Recargar la lista de certificados para mostrar el nuevo
      await loadEnergyCertificates();

      // Recalcular ESG después de agregar certificado
      await loadESGData();

      // Limpiar estado y cerrar modal
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
        // Limpiar campos de imagen
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

  // Manejar actualización de imágenes
  const handleImagesUpdated = (updatedImages: BuildingImage[]) => {
    if (building) {
      setBuilding({
        ...building,
        images: updatedImages,
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        {/* Skeleton para las pestañas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 flex-1 rounded-md bg-gray-100 animate-pulse"
            />
          ))}
        </div>

        {/* Skeleton para el contenido - Layout similar al diseño */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            {/* Skeleton Info básica */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
                <div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-5 w-10 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Skeleton Libro del Edificio */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Skeleton Ubicación */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-48 relative overflow-hidden flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-200 rounded-full animate-pulse" />
              </div>
              <div className="mt-3 space-y-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            {/* Skeleton Galería de imágenes */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="relative w-full aspect-[4/3] bg-gray-200 animate-pulse" />
            </div>

            {/* Skeleton Banner Libro */}
            <div className="bg-blue-600 rounded-lg p-5">
              <div className="h-4 w-32 bg-blue-500 rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-blue-500 rounded animate-pulse mb-1" />
              <div className="h-3 w-40 bg-blue-500 rounded animate-pulse" />
            </div>

            {/* Skeleton Banner Datos Financieros */}
            <div className="bg-blue-600 rounded-lg p-5">
              <div className="h-4 w-32 bg-blue-500 rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-blue-500 rounded animate-pulse mb-1" />
              <div className="h-3 w-40 bg-blue-500 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center bg-white rounded-lg shadow-sm p-6 max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("digitalbook.fields.buildingNotFound", {
              defaultValue: "Building not found",
            })}
          </h2>
          <p className="text-gray-600 mb-4">
            {t("digitalbook.fields.buildingNotFoundOrNoPermissions", {
              defaultValue:
                "Building not found or you do not have permission to view it.",
            })}
          </p>
          <button
            onClick={() => navigate("/assets")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t("assetsList", { defaultValue: "Back to Assets" })}
          </button>
        </div>
      </div>
    );
  }

  // Si el activeTab es 'dashboard', cambiar a 'todos' por defecto
  const currentTab = activeTab === "dashboard" ? "todos" : activeTab;

  const tabs = [
    {
      id: "todos",
      label: t("generalView", "Vista General"),
      icon: BuildingIcon,
    },
    {
      id: "eficiencia",
      label: t("energyEfficiency", "Eficiencia Energética"),
      icon: Zap,
    },
    {
      id: "certificados",
      label: t("certificates", "Certificados"),
      icon: FileCheck2,
    },
    {
      id: "mantenimiento",
      label: t("maintenance", "Mantenimiento"),
      icon: Wrench,
    },
    { id: "actividad", label: t("activity", "Actividad"), icon: Activity },
  ];

  const totalDigitalSections = digitalBook?.sections?.length ?? 0;
  const completedDigitalSections =
    digitalBook?.sections?.filter((section) => section.complete).length ?? 0;

  // Función para extraer información de ubicación de la dirección
  const parseAddressInfo = (address: string) => {
    if (!address) return { city: null, province: null, postalCode: null };

    // Intentar extraer información común de direcciones españolas
    const addressLower = address.toLowerCase();

    // Detectar Madrid (más común)
    if (
      addressLower.includes("castellana") ||
      addressLower.includes("gran vía") ||
      addressLower.includes("madrid")
    ) {
      // Extraer código postal si está en la dirección
      const postalMatch = address.match(/\b(28\d{3})\b/);
      const postalCode = postalMatch ? postalMatch[1] : null;

      return {
        city: "Madrid",
        province: "Madrid",
        postalCode:
          postalCode ||
          (addressLower.includes("castellana") ? "28046" : "28013"),
      };
    }

    // Detectar Barcelona
    if (
      addressLower.includes("barcelona") ||
      addressLower.includes("passeig") ||
      addressLower.includes("rambla")
    ) {
      const postalMatch = address.match(/\b(08\d{3})\b/);
      return {
        city: "Barcelona",
        province: "Barcelona",
        postalCode: postalMatch ? postalMatch[1] : "08001",
      };
    }

    // Detectar Valencia
    if (addressLower.includes("valencia")) {
      const postalMatch = address.match(/\b(46\d{3})\b/);
      return {
        city: "Valencia",
        province: "Valencia",
        postalCode: postalMatch ? postalMatch[1] : "46001",
      };
    }

    // Detectar Sevilla
    if (addressLower.includes("sevilla") || addressLower.includes("seville")) {
      const postalMatch = address.match(/\b(41\d{3})\b/);
      return {
        city: "Sevilla",
        province: "Sevilla",
        postalCode: postalMatch ? postalMatch[1] : "41001",
      };
    }

    // Por defecto, intentar extraer código postal
    const postalMatch = address.match(/\b(\d{5})\b/);

    return {
      city: null,
      province: null,
      postalCode: postalMatch ? postalMatch[1] : null,
    };
  };

  // Calcular porcentaje de ocupación basado en unidades ocupadas
  // Una unidad está ocupada SOLO si:
  // 1. Tiene status="ocupada" (case-insensitive) - NO cuenta "disponible", "available", "mantenimiento", etc.
  // 2. Y/O tiene tenant (no vacío) - PERO solo si el status NO es explícitamente "disponible" o "available"
  const occupancyPercentage = useMemo(() => {
    if (!units || units.length === 0) {
      return 0;
    }
    
    const totalUnits = units.length;
    let occupiedCount = 0;

    console.log("🔍 [OCUPACIÓN] ===== INICIO CÁLCULO =====");
    console.log(`📊 Total unidades: ${totalUnits}`);
    
    for (const unit of units) {
      const statusStr = unit.status ? String(unit.status).trim() : "";
      const statusLower = statusStr.toLowerCase();
      
      // Verificar si el status es explícitamente "ocupada" o "occupied"
      const isStatusOccupied = statusLower === "ocupada" || statusLower === "occupied";
      
      // Verificar si el status es explícitamente "disponible" o "available"
      const isStatusAvailable = statusLower === "disponible" || statusLower === "available";
      
      const tenantStr = unit.tenant ? String(unit.tenant).trim() : "";
      const hasTenant = tenantStr.length > 0;
      
      // Una unidad está ocupada si:
      // - Tiene status="ocupada" O
      // - Tiene tenant Y el status NO es "disponible"/"available"
      const isOccupied = isStatusOccupied || (hasTenant && !isStatusAvailable);
      
      console.log(`\n🏢 Unidad: ${unit.name || unit.identifier || 'Sin nombre'}`);
      console.log(`   - Status original: "${unit.status}"`);
      console.log(`   - Status lower: "${statusLower}"`);
      console.log(`   - isStatusOccupied (ocupada/occupied): ${isStatusOccupied}`);
      console.log(`   - isStatusAvailable (disponible/available): ${isStatusAvailable}`);
      console.log(`   - Tenant: "${tenantStr}"`);
      console.log(`   - hasTenant: ${hasTenant}`);
      console.log(`   - Lógica: isStatusOccupied (${isStatusOccupied}) || (hasTenant (${hasTenant}) && !isStatusAvailable (${!isStatusAvailable}))`);
      console.log(`   - ✅ RESULTADO: ${isOccupied ? 'OCUPADA' : 'NO OCUPADA'}`);
      
      if (isOccupied) {
        occupiedCount++;
      }
    }

    const percentage = totalUnits > 0 ? (occupiedCount / totalUnits) * 100 : 0;
    console.log(`\n📈 RESULTADO FINAL: ${occupiedCount}/${totalUnits} = ${Math.round(percentage)}%`);
    console.log("🔍 [OCUPACIÓN] ===== FIN CÁLCULO =====\n");
    
    return Math.round(percentage);
  }, [units]);

  // Contar unidades ocupadas para mostrar en el ratio
  const occupiedCount = useMemo(() => {
    if (!units || units.length === 0) return 0;
    
    let count = 0;
    for (const unit of units) {
      const statusStr = unit.status ? String(unit.status).trim() : "";
      const statusLower = statusStr.toLowerCase();
      
      const isStatusOccupied = statusLower === "ocupada" || statusLower === "occupied";
      const isStatusAvailable = statusLower === "disponible" || statusLower === "available";
      
      const tenantStr = unit.tenant ? String(unit.tenant).trim() : "";
      const hasTenant = tenantStr.length > 0;
      
      const isOccupied = isStatusOccupied || (hasTenant && !isStatusAvailable);
      
      if (isOccupied) {
        count++;
      }
    }
    return count;
  }, [units]);

  // Preparar imágenes del edificio - filtrar duplicados y URLs vacías
  const buildingImages = useMemo(() => {
    if (!building.images || building.images.length === 0) {
      return ["/image.png"];
    }
    
    // Filtrar imágenes con URLs válidas y eliminar duplicados
    const validUrls = building.images
      .map((img) => img?.url)
      .filter((url) => url && url.trim() !== '');
    
    // Eliminar duplicados manteniendo el orden
    const uniqueUrls = Array.from(new Set(validUrls));
    
    return uniqueUrls.length > 0 ? uniqueUrls : ["/image.png"];
  }, [building.images]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % buildingImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + buildingImages.length) % buildingImages.length
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Título del edificio */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          {building.name}
        </h1>
        {building.address && (
          <p className="text-sm text-gray-600 mt-1">{building.address}</p>
        )}
      </div>

      {/* Menú de pestañas horizontales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={`flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 rounded-md text-xs md:text-sm transition-all whitespace-nowrap ${
                currentTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido según pestaña activa */}
      {currentTab === "todos" && (
        <div className="space-y-6">
          {/* SECCIÓN SUPERIOR: Info básica + Galería de imágenes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Izquierda: Información básica */}
            <div className="space-y-4">
              {/* Datos básicos */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="text-sm mb-4">
                  {t("buildingInfo", "Información del edificio")}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">
                      {t("constructionYear", "Año de construcción")}
                    </p>
                    <p className="text-gray-900">
                      {building.constructionYear || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">
                      {t("floors", "Plantas")}
                    </p>
                    <p className="text-gray-900">{building.numFloors || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">
                      {t("units", "Unidades")}
                    </p>
                    <p className="text-gray-900">{building.numUnits || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Libro del Edificio */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="text-sm mb-3">
                  {t("buildingBook", "Libro del Edificio")}
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {t("pending", "Pendientes")}
                    </span>
                    <span className="text-gray-900">
                      {digitalBook
                        ? totalDigitalSections - completedDigitalSections
                        : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {t("completed", "Completados")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">
                        {digitalBook
                          ? `${completedDigitalSections}/${totalDigitalSections}`
                          : "0/0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicación del edificio */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="text-sm mb-4">
                  {t("buildingLocation", "Ubicación del edificio")}
                </h3>
                {(() => {
                  const locationInfo = building
                    ? parseAddressInfo(building.address)
                    : { city: null, province: null, postalCode: null };

                  return building.lat && building.lng ? (
                    <>
                      <div className="h-48 rounded-lg overflow-hidden border border-gray-200 mb-3">
                        <MapContainer
                          center={[building.lat, building.lng]}
                          zoom={16}
                          style={{ height: "100%", width: "100%" }}
                          zoomControl={false}
                          dragging={false}
                          touchZoom={false}
                          doubleClickZoom={false}
                          scrollWheelZoom={false}
                          boxZoom={false}
                          keyboard={false}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          />
                          <Marker position={[building.lat, building.lng]}>
                            <Popup>
                              <div className="text-center">
                                <strong>{building.name}</strong>
                                <br />
                                {building.address || "Sin dirección"}
                              </div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {t("address", "Dirección")}
                          </span>
                          <span className="text-gray-900">
                            {building.address || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {t("municipality", "Municipio")}
                          </span>
                          <span className="text-gray-900">
                            {locationInfo.city || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {t("province", "Provincia")}
                          </span>
                          <span className="text-gray-900">
                            {locationInfo.province || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {t("postalCode", "Código postal")}
                          </span>
                          <span className="text-gray-900">
                            {locationInfo.postalCode || "—"}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg h-48 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 left-0 w-full h-full">
                            {/* Grid pattern */}
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundImage:
                                  "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
                                backgroundSize: "20px 20px",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
                          <MapPin className="w-12 h-12 text-blue-600" />
                          <span className="text-sm text-blue-700">
                            {building.address || "Sin dirección"}
                          </span>
                        </div>
                        <button className="absolute top-3 right-3 bg-white rounded-md p-2 shadow-sm hover:bg-gray-50">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {t("address", "Dirección")}
                          </span>
                          <span className="text-gray-900">
                            {building.address || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {t("municipality", "Municipio")}
                          </span>
                          <span className="text-gray-900">
                            {locationInfo.city || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {t("province", "Provincia")}
                          </span>
                          <span className="text-gray-900">
                            {locationInfo.province || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {t("postalCode", "Código postal")}
                          </span>
                          <span className="text-gray-900">
                            {locationInfo.postalCode || "—"}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Derecha: Galería de imágenes + Banner del Libro */}
            <div className="space-y-4">
              {/* Galería de imágenes */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                  <img
                    key={`${building.id}-img-${currentImageIndex}-${buildingImages[currentImageIndex]?.substring(0, 30)}`}
                    src={buildingImages[currentImageIndex] || "/image.png"}
                    alt={`${building.name} - Imagen ${currentImageIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Controles del carrusel */}
                  {buildingImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Indicadores */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {buildingImages.map((url, index) => (
                          <button
                            key={`${building.id}-indicator-${index}-${url?.substring(0, 20)}`}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Banner Libro del Edificio */}
              <div className="bg-blue-600 text-white rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm mb-2">
                      {t("buildingBook", "Libro del Edificio")}
                    </h3>
                    <p className="text-sm text-blue-100 mb-1">
                      {digitalBook
                        ? t("buildingBookReady", "Libro digital disponible")
                        : t(
                            "technicianWillCreate",
                            "El técnico creará el libro del edificio"
                          )}
                    </p>
                    {building.technicianEmail && (
                      <p className="text-xs text-blue-200">
                        {t("assignedTechnician", "Técnico asignado")}:{" "}
                        {building.technicianEmail}
                      </p>
                    )}
                  </div>
                  {!digitalBook && (
                    <button
                      onClick={handleCreateDigitalBook}
                      className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      + {t("waitingCreation", "Esperando creación")}
                    </button>
                  )}
                  {digitalBook && (
                    <button
                      onClick={handleViewDigitalBook}
                      className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      {t("viewDigitalBook", "Ver Libro")}
                    </button>
                  )}
                </div>
              </div>

              {/* Banner Datos Financieros */}
              <div className="bg-blue-600 text-white rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm mb-2">
                      {t("financialData", "Datos Financieros")}
                    </h3>
                    <p className="text-sm text-blue-100 mb-1">
                      {hasFinancialData
                        ? t(
                            "financialDataAvailable",
                            "Datos financieros disponibles"
                          )
                        : t(
                            "financialDataNotAvailable",
                            "No hay datos financieros cargados"
                          )}
                    </p>
                    {building.cfoEmail && (
                      <p className="text-xs text-blue-200">
                        {t("assignedCFO", "CFO asignado")}: {building.cfoEmail}
                      </p>
                    )}
                    {!building.cfoEmail && (
                      <p className="text-xs text-blue-200">
                        {hasFinancialData
                          ? t(
                              "viewFinancialAnalysis",
                              "Ver análisis financiero y métricas"
                            )
                          : t(
                              "loadFinancialData",
                              "Cargar datos financieros del edificio"
                            )}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleFinancialData}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    {hasFinancialData
                      ? t("viewAnalysis", "Ver Análisis")
                      : t("loadFinancialData", "Cargar Datos")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña EFICIENCIA ENERGÉTICA */}
      {currentTab === "eficiencia" && (
        <div className="space-y-6">
          {/* Datos del certificado energético */}
          {energyCertificates.length > 0 ? (
            (() => {
              // Obtener el certificado más reciente
              const latestCertificate = energyCertificates.sort(
                (a, b) =>
                  new Date(b.issueDate).getTime() -
                  new Date(a.issueDate).getTime()
              )[0];

              // Calcular emisiones totales anuales (si tenemos superficie del edificio)
              const buildingArea = building?.squareMeters || 0;
              const totalAnnualEmissions =
                buildingArea > 0
                  ? (
                      (latestCertificate.emissionsKgCo2PerM2Year *
                        buildingArea) /
                      1000
                    ).toFixed(2)
                  : null;
              const totalAnnualConsumption =
                buildingArea > 0
                  ? (
                      latestCertificate.primaryEnergyKwhPerM2Year * buildingArea
                    ).toFixed(0)
                  : null;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Clase energética */}
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h3 className="text-sm mb-4">
                      {t("energyClass2", "Clase energética")}
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-lg text-3xl font-bold ${getRatingClasses(
                          latestCertificate.rating
                        )}`}
                      >
                        {latestCertificate.rating}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t("certificateNumber", "Nº Certificado")}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {latestCertificate.certificateNumber}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {t("issueDate", "Fecha emisión")}:{" "}
                          {new Date(
                            latestCertificate.issueDate
                          ).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t(
                            "primaryEnergyConsumption",
                            "Consumo de energía primaria"
                          )}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {latestCertificate.primaryEnergyKwhPerM2Year}{" "}
                          <span className="text-sm font-normal text-gray-600">
                            kWh/m²·año
                          </span>
                        </p>
                        {totalAnnualConsumption && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t("totalAnnual", "Total anual")}:{" "}
                            {totalAnnualConsumption} kWh
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t("co2Emissions", "Emisiones de CO₂")}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {latestCertificate.emissionsKgCo2PerM2Year}{" "}
                          <span className="text-sm font-normal text-gray-600">
                            kg CO₂/m²·año
                          </span>
                        </p>
                        {totalAnnualEmissions && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t("totalAnnual", "Total anual")}:{" "}
                            {totalAnnualEmissions} t CO₂
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Huella de carbono */}
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h3 className="text-sm mb-4">
                      {t("carbonFootprint", "Huella de carbono")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {t("emissionsPerM2", "Emisiones por m²")}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {latestCertificate.emissionsKgCo2PerM2Year}{" "}
                          <span className="text-sm font-normal text-gray-600">
                            kg CO₂/m²·año
                          </span>
                        </p>
                      </div>
                      {totalAnnualEmissions && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {t(
                              "totalAnnualEmissions",
                              "Emisiones anuales totales"
                            )}
                          </p>
                          <p className="text-xl font-semibold text-gray-900">
                            {totalAnnualEmissions}{" "}
                            <span className="text-sm font-normal text-gray-600">
                              t CO₂/año
                            </span>
                          </p>
                        </div>
                      )}
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">
                          {t("scope", "Ámbito")}
                        </p>
                        <p className="text-sm text-gray-900 capitalize">
                          {latestCertificate.scope === "building"
                            ? t("building", "Edificio")
                            : latestCertificate.scope === "dwelling"
                            ? t("dwelling", "Vivienda")
                            : t("commercialUnit", "Local")}
                        </p>
                        {latestCertificate.expiryDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            {t("expiryDate", "Válido hasta")}:{" "}
                            {new Date(
                              latestCertificate.expiryDate
                            ).toLocaleDateString("es-ES")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clase energética */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="text-sm mb-4">
                  {t("energyClass2", "Clase energética")}
                </h3>
                <div className="text-sm text-gray-500">
                  {t("buildingNotCertified", "Edificio no certificado")}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    {t("whenCertified", "Cuando esté certificado se mostrará:")}
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                    <li>
                      {t("energyCertification2", "Certificación energética")}
                    </li>
                    <li>
                      {t(
                        "primaryEnergyConsumption",
                        "Consumo de energía primaria"
                      )}
                    </li>
                    <li>{t("co2Emissions", "Emisiones de CO₂")}</li>
                  </ul>
                </div>
              </div>

              {/* Huella de carbono */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="text-sm mb-4">
                  {t("carbonFootprint", "Huella de carbono")}
                </h3>
                <div className="text-sm text-gray-500">
                  {t("buildingNotCertified", "Edificio no certificado")}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    {t(
                      "infoAvailableAfterCert",
                      "Información disponible tras certificación"
                    )}
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                    <li>
                      {t("totalAnnualEmissions", "Emisiones anuales totales")}
                    </li>
                    <li>{t("emissionsPerM2", "Emisiones por m²")}</li>
                    <li>
                      {t(
                        "comparisonSimilar",
                        "Comparación con edificios similares"
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Card de ESG */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-sm mb-4">
              {t("esgCalculation", "Cálculo ESG")}
            </h3>

            {esgLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : esgData?.status === "complete" && esgData.data ? (
              <div className="space-y-4">
                {/* Score ESG con estrella */}
                <div className="flex items-center justify-center gap-4 py-4">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={getESGLabelColor(esgData.data.label)}
                      className="w-16 h-16"
                      style={{
                        filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))",
                      }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-lg font-bold text-gray-900 mt-2">
                      {esgData.data.label}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {esgData.data.total}/100
                    </span>
                  </div>
                </div>

                {/* Desglose por categorías */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("environmental", "Ambiental")}
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {esgData.data.environmental.normalized.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400">/100</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("social", "Social")}
                    </p>
                    <p className="text-lg font-semibold text-blue-600">
                      {esgData.data.social.normalized.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400">/100</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("governance", "Gobernanza")}
                    </p>
                    <p className="text-lg font-semibold text-purple-600">
                      {esgData.data.governance.normalized.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400">/100</p>
                  </div>
                </div>
              </div>
            ) : esgData?.status === "incomplete" ? (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-yellow-900 mb-2">
                        {t(
                          "esgIncomplete",
                          "Datos incompletos para calcular ESG"
                        )}
                      </h4>
                      <p className="text-xs text-yellow-800 mb-3">
                        {esgData.message ||
                          t(
                            "esgIncompleteMessage",
                            "Faltan algunos datos para poder calcular el score ESG."
                          )}
                      </p>
                      <div>
                        <p className="text-xs font-medium text-yellow-900 mb-2">
                          {t("missingFields", "Campos que faltan:")}
                        </p>
                        <ul className="space-y-1">
                          {esgData.missingData.map((field, index) => (
                            <li
                              key={index}
                              className="text-xs text-yellow-800 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
                              {field}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={loadESGData}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("recalculateESG", "Recalcular ESG")}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">
                  {t(
                    "esgCalculationDescription",
                    "El cálculo ESG se realiza automáticamente basándose en los datos del certificado energético y otras métricas del edificio."
                  )}
                </p>
                <button
                  onClick={loadESGData}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("calculateESG", "Calcular ESG")}
                </button>
              </div>
            )}
          </div>

          {/* Ocupación del edificio */}
          <div className="bg-white rounded-lg p-5 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-600 mb-5">
              {t("buildingOccupancy", "Ocupación del Activo")}
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">
                {occupancyPercentage}%
              </span>
              <span className="text-base font-medium text-gray-500">
                {occupancyPercentage === 100
                  ? "ocupado"
                  : occupancyPercentage > 0
                  ? "parcialmente ocupado"
                  : "disponible"}
              </span>
            </div>
            {units.length > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                ({occupiedCount}/{units.length})
              </p>
            )}
            {units.length > 0 ? (
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    occupancyPercentage === 100
                      ? "bg-green-500"
                      : occupancyPercentage > 0
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                  }`}
                  style={{ width: `${occupancyPercentage}%` }}
                ></div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {t("noUnitsData", "No hay datos de unidades disponibles")}
              </p>
            )}
          </div>

          {/* Estado de certificación */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 lg:col-span-2">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm mb-1 text-gray-900">
                  {t(
                    "energyCertInfo",
                    "Información sobre certificación energética"
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(
                    "energyCertInfoText",
                    "La certificación energética es obligatoria para edificios existentes en determinadas circunstancias."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña CERTIFICADOS */}
      {currentTab === "certificados" && (
        <div className="space-y-6">
          {/* Certificados energéticos */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm">
                  {t("energyCertificates", "Certificados energéticos")}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {t("certificatesList", "Lista de certificados registrados")}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(true);
                  checkCertificateExtractorHealth().then(setAiServiceAvailable);
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                {t("uploadCertificate", "Cargar Certificado")}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs text-gray-600 pb-3">
                      {t("certificateNumber", "Nº Certificado")}
                    </th>
                    <th className="text-left text-xs text-gray-600 pb-3">
                      {t("rating", "Rating")}
                    </th>
                    <th className="text-left text-xs text-gray-600 pb-3">
                      {t("energyConsumption", "Consumo energético")}
                    </th>
                    <th className="text-left text-xs text-gray-600 pb-3">
                      {t("emissions", "Emisiones")}
                    </th>
                    <th className="text-left text-xs text-gray-600 pb-3">
                      {t("scope", "Ámbito")}
                    </th>
                    <th className="text-left text-xs text-gray-600 pb-3">
                      {t("issueDate", "Fecha emisión")}
                    </th>
                    <th className="text-left text-xs text-gray-600 pb-3">
                      {t("expirationDate", "Fecha vencimiento")}
                    </th>
                    <th className="text-left text-xs text-gray-600 pb-3">
                      {t("actions", "Acciones")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {energyCertificates.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center">
                        <div className="text-gray-400 text-sm">
                          {t("noCertificates", "No hay certificados")}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {t(
                            "canUploadCertificates",
                            "Puedes subir certificados"
                          )}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    energyCertificates.map((cert) => (
                      <tr
                        key={cert.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCertificateForView(cert)}
                      >
                        <td className="py-3 text-sm text-gray-900">
                          {cert.certificateNumber}
                        </td>
                        <td className="py-3 text-sm">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-sm text-sm font-bold ${getRatingClasses(
                              cert.rating
                            )}`}
                          >
                            {cert.rating}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-900">
                          {cert.primaryEnergyKwhPerM2Year}
                        </td>
                        <td className="py-3 text-sm text-gray-900">
                          {cert.emissionsKgCo2PerM2Year}
                        </td>
                        <td className="py-3 text-sm text-gray-900 capitalize">
                          {cert.scope}
                        </td>
                        <td className="py-3 text-sm text-gray-900">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-sm text-gray-900">
                          {new Date(cert.expiryDate).toLocaleDateString()}
                        </td>
                        <td
                          className="py-3 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setCertificateToDelete(cert);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t(
                              "deleteCertificate",
                              "Eliminar certificado"
                            )}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Estado de la sección */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-sm mb-3">
              {t("sectionStatus", "Estado de la sección")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {t("installations", "Instalaciones")}
                </span>
                <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs">
                  {t("ok", "OK")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {t("certificates", "Certificados")}
                </span>
                <span className="px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs">
                  {t("pending", "Pendiente")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {t("maintenance", "Mantenimiento")}
                </span>
                <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs">
                  {t("ok", "OK")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {t("inspections", "Inspecciones")}
                </span>
                <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs">
                  {t("expiring", "Por vencer")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña MANTENIMIENTO */}
      {currentTab === "mantenimiento" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan de mantenimiento */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-sm mb-4">
              {t("maintenancePlan", "Plan de mantenimiento")}
            </h3>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="20"
                    strokeDasharray="150.8 351.7"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray="100.5 401.9"
                    strokeDashoffset="-150.8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="20"
                    strokeDasharray="75.4 426.5"
                    strokeDashoffset="-251.3"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeDasharray="75.4 426.5"
                    strokeDashoffset="-326.7"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">
                  {t("completedPercentage", "Completado")} (30%)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">
                  {t("inProgressPercentage", "En progreso")} (20%)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-600">
                  {t("scheduledPercentage", "Programado")} (15%)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">
                  {t("overduePercentage", "Vencido")} (15%)
                </span>
              </div>
            </div>
          </div>

          {/* Alertas y próximos vencimientos */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-sm mb-4">
              {t("alertsUpcoming", "Alertas y próximos vencimientos")}
            </h3>
            <div className="space-y-3">
              {/* Alerta urgente */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {t("elevatorReview", "Revisión ascensor")}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {t("mainElevator", "Ascensor principal")}
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 whitespace-nowrap">
                    {t("schedule", "Programar")}
                  </button>
                </div>
              </div>

              {/* Alerta advertencia */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {t("riteMaintenance", "Mantenimiento RITE")}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {t("hvacSystem", "Sistema HVAC")}
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs hover:bg-amber-700 whitespace-nowrap">
                    {t("viewDetails", "Ver detalles")}
                  </button>
                </div>
              </div>

              {/* Alerta info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {t("manualUpdate", "Actualización manual")}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {t("electricalSystem", "Sistema eléctrico")}
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 whitespace-nowrap">
                    {t("review", "Revisar")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña ACTIVIDAD */}
      {currentTab === "actividad" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividad reciente */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-sm mb-4">
              {t("recent Activity", "Actividad Reciente")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {t("ceeRenewed", "CEE renovado")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t("daysAgo", "Hace 2 días")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {t("hvacCompleted", "Mantenimiento HVAC completado")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t("weekAgo", "Hace 1 semana")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {t("elevatorInspection", "Inspección ascensor")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t("twoWeeksAgo", "Hace 2 semanas")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {t("icaDpli", "ICA/DPLI")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t("twoMonthsAgo", "Hace 2 meses")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {t("documentationUpdate", "Actualización documentación")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t("threeMonthsAgo", "Hace 3 meses")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de actividad */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h3 className="text-sm mb-4">
              {t("activitySummary", "Resumen de actividad")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {t("tasksCompleted", "Tareas completadas")}
                </span>
                <span className="text-lg text-gray-900">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {t("tasksPending", "Tareas pendientes")}
                </span>
                <span className="text-lg text-orange-600">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {t("activeAlerts", "Alertas activas")}
                </span>
                <span className="text-lg text-red-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {t("lastUpdate", "Última actualización")}
                </span>
                <span className="text-sm text-gray-900">
                  {t("twoDaysAgo", "Hace 2 días")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}

      {/* Modal de Carga (solo imagen) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseUpload}
            onKeyDown={(e) => e.key === 'Escape' && handleCloseUpload()}
            role="button"
            tabIndex={0}
            aria-label="Cerrar modal"
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {uploadStep === "select"
                  ? t("uploadEnergyCertificate", {
                      defaultValue: "Cargar certificado energético",
                    })
                  : t("reviewExtractedData", {
                      defaultValue: "Revisar datos extraídos",
                    })}
              </h3>
              <button
                onClick={handleCloseUpload}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {uploadStep === "select" ? (
              <div className="p-6 overflow-y-auto">
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  acceptedTypes={["image/*"]}
                  multiple={false}
                  maxFiles={1}
                  maxSizeInMB={10}
                  label={t("uploadCertificateImage", {
                    defaultValue: "Subir imagen del certificado",
                  })}
                  description={t("dragOrClickToSelect", {
                    defaultValue:
                      "Arrastra una imagen o haz clic para seleccionar",
                  })}
                />

                {/* Estado del servicio de IA */}
                {aiServiceAvailable !== null && (
                  <div className="mt-3 p-3 rounded-lg border text-sm">
                    {aiServiceAvailable ? (
                      <div className="flex items-center text-green-700">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {t("aiServiceAvailable", {
                          defaultValue:
                            "Servicio de IA disponible - Los datos se extraerán automáticamente",
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-700">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        {t("aiServiceUnavailable", {
                          defaultValue:
                            "Servicio de IA no disponible - Los datos deberán introducirse manualmente",
                        })}
                      </div>
                    )}
                  </div>
                )}

                {selectedFile && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t("selectedImage", {
                        defaultValue: "Imagen seleccionada",
                      })}
                    </h4>
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                      <span className="truncate mr-2">{selectedFile.name}</span>
                      <span className="text-gray-500 text-xs">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)}MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                {/* Previsualización */}
                <div>
                  {selectedFileUrl ? (
                    <img
                      src={selectedFileUrl}
                      alt="Previsualización certificado"
                      className="w-full max-h-[60vh] object-contain rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      Sin previsualización
                    </div>
                  )}
                </div>
                {/* Datos extraídos (editables) */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    {t("detectedDataEditable", {
                      defaultValue: "Datos detectados (puedes editar)",
                    })}
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {t("rating", { defaultValue: "Rating" })}
                        </label>
                        <select
                          value={reviewData.rating}
                          onChange={(e) =>
                            setReviewData((v) => ({
                              ...v,
                              rating: e.target.value as any,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="">-</option>
                          {["A", "B", "C", "D", "E", "F", "G"].map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {t("scope", { defaultValue: "Ámbito" })}
                        </label>
                        <select
                          value={reviewData.scope}
                          onChange={(e) =>
                            setReviewData((v) => ({
                              ...v,
                              scope: e.target.value as any,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="building">Edificio</option>
                          <option value="dwelling">Vivienda</option>
                          <option value="commercial_unit">Local</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {t("primaryEnergyKwh", {
                            defaultValue: "Energía primaria kWh/m²·año",
                          })}
                        </label>
                        <input
                          type="number"
                          value={reviewData.primaryEnergyKwhPerM2Year}
                          onChange={(e) =>
                            setReviewData((v) => ({
                              ...v,
                              primaryEnergyKwhPerM2Year: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {t("emissionsKg", {
                            defaultValue: "Emisiones kgCO₂/m²·año",
                          })}
                        </label>
                        <input
                          type="number"
                          value={reviewData.emissionsKgCo2PerM2Year}
                          onChange={(e) =>
                            setReviewData((v) => ({
                              ...v,
                              emissionsKgCo2PerM2Year: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("certificateNumber", {
                          defaultValue: "Nº de certificado",
                        })}
                      </label>
                      <input
                        type="text"
                        value={reviewData.certificateNumber}
                        onChange={(e) =>
                          setReviewData((v) => ({
                            ...v,
                            certificateNumber: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {t("issueDate", { defaultValue: "Fecha emisión" })}
                        </label>
                        <input
                          type="date"
                          value={reviewData.issueDate}
                          onChange={(e) =>
                            setReviewData((v) => ({
                              ...v,
                              issueDate: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          {t("expiryDate", {
                            defaultValue: "Fecha vencimiento",
                          })}
                        </label>
                        <input
                          type="date"
                          value={reviewData.expiryDate}
                          onChange={(e) =>
                            setReviewData((v) => ({
                              ...v,
                              expiryDate: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("cadastralRef", {
                          defaultValue: "Referencia catastral",
                        })}
                      </label>
                      <input
                        type="text"
                        value={reviewData.propertyReference}
                        onChange={(e) =>
                          setReviewData((v) => ({
                            ...v,
                            propertyReference: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("notes", { defaultValue: "Notas" })}
                      </label>
                      <textarea
                        value={reviewData.notes}
                        onChange={(e) =>
                          setReviewData((v) => ({
                            ...v,
                            notes: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={
                  uploadStep === "select"
                    ? handleCloseUpload
                    : handleBackToUpload
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isProcessingAI}
              >
                {uploadStep === "select"
                  ? t("cancel", { defaultValue: "Cancelar" })
                  : t("back", { defaultValue: "Volver" })}
              </button>
              {uploadStep === "select" ? (
                <button
                  onClick={handleContinueToReview}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedFile || isProcessingAI}
                >
                  {isProcessingAI
                    ? t("processing", { defaultValue: "Procesando..." })
                    : t("continue", { defaultValue: "Continuar" })}
                </button>
              ) : (
                <button
                  onClick={handleConfirmAndSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {t("confirmAndSave", { defaultValue: "Confirmar y guardar" })}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestión de imágenes */}
      {showImageManager && building && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowImageManager(false)}
            onKeyDown={(e) => e.key === 'Escape' && setShowImageManager(false)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar modal"
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("manageImagesOf", { defaultValue: "Gestionar imágenes de" })}{" "}
                {building.name}
              </h3>
              <button
                onClick={() => setShowImageManager(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <ImageManager
                buildingId={building.id}
                existingImages={building.images || []}
                onImagesUpdated={handleImagesUpdated}
                maxImages={10}
                allowMainImageSelection={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de vista de certificado energético */}
      {selectedCertificateForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedCertificateForView(null)}
            onKeyDown={(e) => e.key === 'Escape' && setSelectedCertificateForView(null)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar modal"
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("energyCertificate", {
                  defaultValue: "Certificado Energético",
                })}{" "}
                #{selectedCertificateForView.certificateNumber}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCertificateToDelete(selectedCertificateForView);
                    setDeleteModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("delete", "Eliminar")}
                </button>
                <button
                  onClick={() => setSelectedCertificateForView(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
              {/* Imagen del certificado */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {t("originalDocument", {
                    defaultValue: "Documento original",
                  })}
                </h4>
                {selectedCertificateForView.imageUrl ||
                selectedCertificateForView.sourceDocumentUrl ||
                reviewData.imageUrl ? (
                  <img
                    src={
                      selectedCertificateForView.imageUrl ||
                      selectedCertificateForView.sourceDocumentUrl ||
                      reviewData.imageUrl
                    }
                    alt="Certificado energético"
                    className="w-full max-h-[60vh] object-contain rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    {t("imageNotAvailable", {
                      defaultValue: "Imagen no disponible",
                    })}
                  </div>
                )}
                {selectedCertificateForView.imageFilename && (
                  <p className="text-xs text-gray-500 mt-2">
                    {t("file", { defaultValue: "Archivo:" })}{" "}
                    {selectedCertificateForView.imageFilename}
                  </p>
                )}
              </div>

              {/* Datos del certificado (solo lectura) */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {t("certificateInfo", {
                    defaultValue: "Información del certificado",
                  })}
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("energyRating", {
                          defaultValue: "Rating energético",
                        })}
                      </label>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-sm text-sm font-bold ${getRatingClasses(
                          selectedCertificateForView.rating
                        )}`}
                      >
                        {selectedCertificateForView.rating}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("scope", { defaultValue: "Ámbito" })}
                      </label>
                      <p className="text-sm text-gray-900 capitalize">
                        {selectedCertificateForView.scope === "building"
                          ? "Edificio"
                          : selectedCertificateForView.scope === "dwelling"
                          ? "Vivienda"
                          : "Local"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("primaryEnergyKwh", {
                          defaultValue: "Energía primaria kWh/m²·año",
                        })}
                      </label>
                      <p className="text-sm text-gray-900 capitalize">
                        {selectedCertificateForView.primaryEnergyKwhPerM2Year}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("emissionsKg", {
                          defaultValue: "Emisiones kgCO₂/m²·año",
                        })}
                      </label>
                      <p className="text-sm text-gray-900 capitalize">
                        {selectedCertificateForView.emissionsKgCo2PerM2Year}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {t("certificateNumber", {
                        defaultValue: "Nº de certificado",
                      })}
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificateForView.certificateNumber}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {t("issuer", { defaultValue: "Organismo certificador" })}
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedCertificateForView.issuerName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("issueDate", { defaultValue: "Fecha de emisión" })}
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedCertificateForView.issueDate
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("expiryDate", {
                          defaultValue: "Fecha de vencimiento",
                        })}
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedCertificateForView.expiryDate
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>

                  {selectedCertificateForView.propertyReference && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("cadastralRef", {
                          defaultValue: "Referencia catastral",
                        })}
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCertificateForView.propertyReference}
                      </p>
                    </div>
                  )}

                  {selectedCertificateForView.notes && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        {t("notes", { defaultValue: "Notas" })}
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCertificateForView.notes}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <label className="block mb-1">
                          {t("uploadDate", { defaultValue: "Fecha de carga" })}
                        </label>
                        <p>
                          {new Date(
                            selectedCertificateForView.createdAt
                          ).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div>
                        <label className="block mb-1">
                          {t("lastUpdate", {
                            defaultValue: "Última actualización",
                          })}
                        </label>
                        <p>
                          {new Date(
                            selectedCertificateForView.updatedAt
                          ).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      {selectedCertificateForView.imageUploadedAt && (
                        <div className="col-span-2">
                          <label className="block mb-1">
                            {t("imageUploaded", {
                              defaultValue: "Imagen subida",
                            })}
                          </label>
                          <p>
                            {new Date(
                              selectedCertificateForView.imageUploadedAt
                            ).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cancelDeleteCertificate}
            onKeyDown={(e) => e.key === 'Escape' && cancelDeleteCertificate()}
            role="button"
            tabIndex={0}
            aria-label="Cerrar modal"
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("deleteCertificate", {
                      defaultValue: "Eliminar certificado",
                    })}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("actionCannotBeUndone", {
                      defaultValue: "Esta acción no se puede deshacer",
                    })}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  {t("confirmDeleteCertificate", {
                    defaultValue:
                      "¿Estás seguro de que quieres eliminar el certificado energético?",
                  })}
                </p>
                {certificateToDelete && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">
                      {t("certificateNumber", { defaultValue: "N°" })}{" "}
                      {certificateToDelete.certificateNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("rating", { defaultValue: "Rating:" })}{" "}
                      {certificateToDelete.rating} •{" "}
                      {certificateToDelete.scope === "building"
                        ? t("building", { defaultValue: "Edificio" })
                        : certificateToDelete.scope === "dwelling"
                        ? t("dwelling", { defaultValue: "Vivienda" })
                        : t("commercialUnit", { defaultValue: "Local" })}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={cancelDeleteCertificate}
                  disabled={isDeleting}
                  className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition-colors duration-200 ${
                    isDeleting
                      ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  {t("cancel", { defaultValue: "Cancelar" })}
                </button>
                <button
                  onClick={confirmDeleteCertificate}
                  disabled={isDeleting}
                  className={`px-4 py-2 text-sm font-medium text-white border border-red-600 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                    isDeleting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t("deleting", { defaultValue: "Eliminando..." })}
                    </>
                  ) : (
                    t("delete", { defaultValue: "Eliminar" })
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingDetail;
