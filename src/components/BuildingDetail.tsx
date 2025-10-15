import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { BuildingsApiService } from '../services/buildingsApi';
import type { Building, BuildingImage } from '../services/buildingsApi';
import ImageManager from './ui/ImageManager';
import { extractCertificateData, mapAIResponseToReviewData, checkCertificateExtractorHealth } from '../services/certificateExtractor';
import { EnergyCertificatesService, type PersistedEnergyCertificate } from '../services/energyCertificates';
import { uploadCertificateImage } from '../services/certificateUpload';
import { getLatestRating, getLatestCO2Emissions, getRatingStars } from '../utils/energyCalculations';
import { PageLoader, useLoadingState } from './ui/LoadingSystem';
import FileUpload from './ui/FileUpload';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { RatingCircle, RatingStars } from './RatingCircle';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getBookByBuilding, type DigitalBook } from '../services/digitalbook';
import { getESGScore, getESGLabelColor, type ESGResponse } from '../services/esg';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

ChartJS.register(ArcElement, Tooltip, Legend);

const BuildingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { showError, showSuccess } = useToast();
  
  const [building, setBuilding] = useState<Building | null>(null);
  const { loading, startLoading, stopLoading } = useLoadingState(true);
  const [digitalBook, setDigitalBook] = useState<DigitalBook | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<'select' | 'review'>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiServiceAvailable, setAiServiceAvailable] = useState<boolean | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [energyCertificates, setEnergyCertificates] = useState<PersistedEnergyCertificate[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedCertificateForView, setSelectedCertificateForView] = useState<PersistedEnergyCertificate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<PersistedEnergyCertificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [esgData, setEsgData] = useState<ESGResponse | null>(null);

  // Función para cargar datos ESG
  const loadESGData = async () => {
    if (!building?.id || user?.role !== 'tecnico') return;
    
    try {
      const esgResponse = await getESGScore(building.id);
      setEsgData(esgResponse);
    } catch (error) {
      setEsgData(null);
    }
  };

  // Funciones de paginación
  const totalPages = Math.ceil(energyCertificates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCertificates = energyCertificates.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para abrir modal de confirmación de eliminación
  const handleDeleteCertificate = (certificate: PersistedEnergyCertificate) => {
    setCertificateToDelete(certificate);
    setDeleteModalOpen(true);
  };

  // Función para confirmar eliminación
  const confirmDeleteCertificate = async () => {
    if (!certificateToDelete) return;

    setIsDeleting(true);
    try {
      await EnergyCertificatesService.deleteCertificate(certificateToDelete.id);
      showSuccess('Certificado eliminado correctamente');
      // Recargar la lista de certificados
      await loadEnergyCertificates();
      // Cerrar modal
      setDeleteModalOpen(false);
      setCertificateToDelete(null);
    } catch (error) {
      showError('Error al eliminar el certificado');
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para cancelar eliminación
  const cancelDeleteCertificate = () => {
    setDeleteModalOpen(false);
    setCertificateToDelete(null);
  };

  // Función helper para obtener clases CSS del rating energético según escala oficial española
  const getRatingClasses = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-600 text-white border-green-600'; // Verde vibrante (más eficiente)
      case 'B': return 'bg-green-500 text-white border-green-500'; // Verde medio
      case 'C': return 'bg-yellow-400 text-white border-yellow-400'; // Amarillo verdoso/chartreuse
      case 'D': return 'bg-yellow-300 text-white border-yellow-300'; // Amarillo claro
      case 'E': return 'bg-orange-500 text-white border-orange-500'; // Naranja
      case 'F': return 'bg-red-500 text-white border-red-500'; // Rojo anaranjado oscuro
      case 'G': return 'bg-red-600 text-white border-red-600'; // Rojo prominente (menos eficiente)
      default: return 'border-gray-200 text-gray-800 bg-gray-50';
    }
  };

  const [reviewData, setReviewData] = useState({
    rating: '' as '' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G',
    primaryEnergyKwhPerM2Year: '' as string | number,
    emissionsKgCo2PerM2Year: '' as string | number,
    certificateNumber: '',
    scope: 'building' as 'building' | 'dwelling' | 'commercial_unit',
    issuerName: '',
    issueDate: '',
    expiryDate: '',
    propertyReference: '',
    notes: '',
    // Campos de imagen
    imageUrl: '',
    imageFilename: '',
    imageUploadedAt: '',
  });

  // Función para cargar certificados energéticos reales del backend
  const loadEnergyCertificates = async () => {
    if (!building?.id) return;
    
    try {
      const certificatesData = await EnergyCertificatesService.getByBuilding(building.id);
      setEnergyCertificates(certificatesData.certificates || []);
    } catch (error) {
      // Mantener estado vacío en caso de error - no mostrar error al usuario en esta carga inicial
    }
  };

  useEffect(() => {
    const loadBuilding = async () => {
      if (!id) return;

      try {
        startLoading();
        const buildingData = await BuildingsApiService.getBuildingById(id);
        setBuilding(buildingData);
        // Cargar estado del libro digital (si existe)
        try {
          const book = await getBookByBuilding(id);
          setDigitalBook(book);
        } catch (e) {
          setDigitalBook(null);
        }
        
        // Cargar certificados energéticos del edificio - ahora buildingData.id está disponible
        const certificatesData = await EnergyCertificatesService.getByBuilding(buildingData.id);
        setEnergyCertificates(certificatesData.certificates || []);
        
        // Cargar datos ESG para mostrar indicadores de datos faltantes (solo para técnicos)
        if (user?.role === 'tecnico') {
          await loadESGData();
        }
        
        // Activar mapa después de cargar datos
        setTimeout(() => setMapReady(true), 500);
        stopLoading();
        
      } catch (error) {
        showError('Error al cargar edificio', 'No se pudo cargar la información del edificio');
        navigate('/activos');
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

  // Resetear página cuando cambien los certificados
  useEffect(() => {
    setCurrentPage(1);
  }, [energyCertificates.length]);

  // Cargar datos ESG cuando el componente se monta
  useEffect(() => {
    if (user?.role === 'tecnico' && building?.id) {
      loadESGData();
    }
  }, [user?.role, building?.id]);

  // Recargar datos ESG cuando el usuario regrese del libro digital
  useEffect(() => {
    const handleFocus = () => {
      if (user?.role === 'tecnico') {
        loadESGData();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && user?.role === 'tecnico') {
        loadESGData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.role, building?.id]);

  // Bloquear scroll de fondo cuando la modal está abierta
  useEffect(() => {
    if (isUploadModalOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isUploadModalOpen]);

  const handleCreateDigitalBook = async () => {
    if (!building?.id) return;
    
    try {
      startLoading();
      // Importar la función desde el servicio
      const { getOrCreateBookForBuilding } = await import('../services/digitalbook');
      
      // Crear el libro en el backend
      const createdBook = await getOrCreateBookForBuilding(building.id);
      
      // Actualizar el estado local
      setDigitalBook(createdBook);
      
      // Navegar al hub
      navigate(`/libro-digital/hub/${building.id}`, {
        state: {
          buildingId: building.id,
          buildingName: building.name,
          isNewBook: true
        }
      });
      
      stopLoading();
    } catch (error) {
      showError('Error al crear el libro digital');
      stopLoading();
    }
  };

  const handleViewDigitalBook = () => {
    if (!building?.id) return;
    navigate(`/libro-digital/hub/${building.id}`, {
      state: {
        buildingId: building.id,
        buildingName: building.name,
        isNewBook: false
      }
    });
  };

  const handleOpenUpload = () => {
    setSelectedFile(null);
    setSelectedFileUrl(null);
    setUploadStep('select');
    setIsUploadModalOpen(true);
  };

  const handleCloseUpload = () => {
    setIsUploadModalOpen(false);
    setUploadStep('select');
    setSelectedFile(null);
    if (selectedFileUrl) {
      try { URL.revokeObjectURL(selectedFileUrl); } catch {}
    }
    setSelectedFileUrl(null);
    setCurrentSessionId(null);
    setReviewData({
      rating: '' as '' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G',
      primaryEnergyKwhPerM2Year: '' as string | number,
      emissionsKgCo2PerM2Year: '' as string | number,
      certificateNumber: '',
      scope: 'building' as 'building' | 'dwelling' | 'commercial_unit',
      issuerName: '',
      issueDate: '',
      expiryDate: '',
      propertyReference: '',
      notes: '',
      imageUrl: '',
      imageFilename: '',
      imageUploadedAt: '',
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
        showError('Servicio de IA no disponible', 'El servicio de extracción de certificados no está disponible en este momento.');
        return;
      }

      // 1. Subir imagen del certificado a Supabase Storage
      const uploadResult = await uploadCertificateImage(selectedFile, building.id);
      if (!uploadResult.success || !uploadResult.image) {
        throw new Error(uploadResult.error || 'Error subiendo imagen del certificado');
      }

      // 2. Crear sesión simple en el backend con información de la imagen
      const session = await EnergyCertificatesService.createSimpleSession(building.id);
      setCurrentSessionId(session.id);

      // 3. Extraer datos con IA
      const aiResponse = await extractCertificateData(selectedFile);
      const mappedData = mapAIResponseToReviewData(aiResponse);
      
      // 4. Actualizar sesión con datos extraídos por IA e información de la imagen
      const extractedData = {
        rating: { value: aiResponse.rating_letter as any, confidence: 0.95, source: 'AI OCR' },
        primaryEnergyKwhPerM2Year: { value: aiResponse.energy_consumption_kwh_m2y, confidence: 0.95, source: 'AI OCR' },
        emissionsKgCo2PerM2Year: { value: aiResponse.co2_emissions_kg_m2y, confidence: 0.95, source: 'AI OCR' },
        certificateNumber: { value: aiResponse.registry_code, confidence: 0.95, source: 'AI OCR' },
        scope: { value: 'building' as any, confidence: 0.95, source: 'AI OCR' },
        issuerName: { value: aiResponse.normative, confidence: 0.95, source: 'AI OCR' },
        issueDate: { value: aiResponse.registry_date, confidence: 0.95, source: 'AI OCR' },
        expiryDate: { value: aiResponse.valid_until, confidence: 0.95, source: 'AI OCR' },
        propertyReference: { value: aiResponse.cadastral_reference, confidence: 0.95, source: 'AI OCR' },
        notes: { value: mappedData.notes ?? null, confidence: 0.95, source: 'AI OCR' },
        // Información de la imagen almacenada
        imageUrl: { value: uploadResult.image.url, confidence: 1.0, source: 'Supabase Storage' },
        imageFilename: { value: uploadResult.image.filename, confidence: 1.0, source: 'Supabase Storage' },
      };

      await EnergyCertificatesService.updateWithAIData(session.id, extractedData);
      
      // 5. Actualizar datos de revisión para el usuario
      setReviewData({
        rating: (mappedData.rating as any) ?? '',
        primaryEnergyKwhPerM2Year: mappedData.primaryEnergyKwhPerM2Year ?? '',
        emissionsKgCo2PerM2Year: mappedData.emissionsKgCo2PerM2Year ?? '',
        certificateNumber: mappedData.certificateNumber ?? '',
        scope: mappedData.scope ?? 'building',
        issuerName: mappedData.issuerName ?? '',
        issueDate: mappedData.issueDate ?? '',
        expiryDate: mappedData.expiryDate ?? '',
        propertyReference: mappedData.propertyReference ?? '',
        notes: mappedData.notes ?? '',
        // Incluir información de la imagen
        imageUrl: uploadResult.image.url,
        imageFilename: uploadResult.image.filename,
        imageUploadedAt: uploadResult.image.uploadedAt.toISOString(),
      });
      setUploadStep('review');
      
      showSuccess('Datos extraídos', 'La imagen del certificado se ha guardado y los datos han sido extraídos automáticamente. Revisa y ajusta si es necesario.');
      
    } catch (error) {
      showError('Error al procesar certificado', error instanceof Error ? error.message : 'Error desconocido al procesar el certificado');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleBackToUpload = () => {
    setUploadStep('select');
  };

  const handleConfirmAndSave = async () => {
    if (!currentSessionId) {
      showError('Error de sesión', 'No se encontró la sesión de certificado. Por favor, vuelve a subir el archivo.');
      return;
    }

    try {
      // Validar campos requeridos antes de enviar
      if (!reviewData.rating || !reviewData.certificateNumber || !reviewData.issuerName || 
          !reviewData.issueDate || !reviewData.expiryDate) {
        showError('Campos requeridos', 'Por favor completa todos los campos obligatorios antes de guardar.');
        return;
      }

      // Preparar datos finales con los tipos correctos
      const finalData = {
        rating: (reviewData.rating || undefined) as any,
        primaryEnergyKwhPerM2Year:
          typeof reviewData.primaryEnergyKwhPerM2Year === 'string'
            ? parseFloat(reviewData.primaryEnergyKwhPerM2Year || '0')
            : reviewData.primaryEnergyKwhPerM2Year,
        emissionsKgCo2PerM2Year:
          typeof reviewData.emissionsKgCo2PerM2Year === 'string'
            ? parseFloat(reviewData.emissionsKgCo2PerM2Year || '0')
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
      const confirmedCertificate = await EnergyCertificatesService.confirmCertificate(
        currentSessionId,
        finalData
      );
      
      showSuccess('Certificado guardado', `Certificado ${confirmedCertificate.certificateNumber} guardado correctamente.`);
      
      // Recargar la lista de certificados para mostrar el nuevo
      await loadEnergyCertificates();
      
      // Limpiar estado y cerrar modal
      setCurrentSessionId(null);
      setReviewData({
        rating: '' as '' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G',
        primaryEnergyKwhPerM2Year: '' as string | number,
        emissionsKgCo2PerM2Year: '' as string | number,
        certificateNumber: '',
        scope: 'building' as 'building' | 'dwelling' | 'commercial_unit',
        issuerName: '',
        issueDate: '',
        expiryDate: '',
        propertyReference: '',
        notes: '',
        // Limpiar campos de imagen
        imageUrl: '',
        imageFilename: '',
        imageUploadedAt: '',
      });
      handleCloseUpload();
      
    } catch (error) {
      showError('Error al guardar', error instanceof Error ? error.message : 'Error desconocido al guardar el certificado');
    }
  };

  // Manejar actualización de imágenes
  const handleImagesUpdated = (updatedImages: BuildingImage[]) => {
    if (building) {
      setBuilding({
        ...building,
        images: updatedImages
      });
    }
  };

  // (eliminado) funciones antiguas sin uso

  if (loading) {
    return <PageLoader message="Cargando edificio..." />;
  }

  if (!building) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Edificio no encontrado</h2>
          <p className="text-gray-600 mb-4">El edificio que buscas no existe o no tienes permisos para verlo.</p>
          <button
            onClick={() => navigate('/activos')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver a Activos
          </button>
        </div>
      </div>
    );
  }


  // Datos para el gráfico de dona
  const chartData = {
    labels: ["Completadas", "En progreso", "Programadas", "Vencidas"],
    datasets: [
      {
        data: [24, 8, 12, 3],
        backgroundColor: [
          "#10B981", // green-500
          "#3B82F6", // blue-500
          "#F59E0B", // yellow-500
          "#EF4444", // red-500
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
    },
  };

  const mainImage = building.images?.find(img => img.isMain) || building.images?.[0];
  const currentImage = building.images?.[currentImageIndex] || mainImage;

  return (
    <div className="max-w-full py-8">
      {/* Botón superior eliminado por petición: se deja solo el de la sección */}

      {/* Building Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4" style={{animation: 'fadeInUp 0.6s ease-out 0.1s both'}}>
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-12 lg:col-span-8">
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{building.name}</h2>
            <p className="text-gray-600 text-sm mt-0.5">{building.address} • Ref. Cat: {building.cadastralReference || '1234567890'}</p>

            {/* Meta compacta */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">Año construcción</span>
                <span className="font-medium text-gray-900">{building.constructionYear || '1953'}</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-200" />
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">Plantas</span>
                <span className="font-medium text-gray-900">{building.numFloors || '45'}</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-200" />
              <div className="flex items-baseline gap-2">
                <span className="text-gray-500">Unidades</span>
                <span className="font-medium text-gray-900">{building.numUnits || '550'}</span>
              </div>
            </div>

            {/* KPIs compactos */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-200 p-3">
                <span className="block text-xs text-gray-500">Rating energético-ambiental</span>
                <div className="mt-1.5 flex items-center gap-2">
                  {energyCertificates.length === 0 ? (
                    <>
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">
                        ?
                      </div>
                      <span className="text-xs text-gray-500">
                        {user?.role === 'tecnico' 
                          ? 'Sin certificados registrados' 
                          : 'Técnico aún no ha subido certificados'
                        }
                      </span>
                    </>
                  ) : (
                    <>
                      <RatingCircle rating={getLatestRating(energyCertificates)} size="sm" />
                      <RatingStars stars={getRatingStars(getLatestRating(energyCertificates))} />
                    </>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <span className="block text-xs text-gray-500">Huella de carbono</span>
                <div className="mt-1.5 flex items-center gap-2">
                  {energyCertificates.length === 0 ? (
                    <>
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">
                        ?
                      </div>
                      <span className="text-xs text-gray-500">
                        {user?.role === 'tecnico' 
                          ? 'Sin certificados registrados' 
                          : 'Técnico aún no ha subido certificados'
                        }
                      </span>
                    </>
                  ) : (
                    <p className="font-medium text-gray-900">
                      {getLatestCO2Emissions(energyCertificates)} kg CO₂eq/m²·año
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <span className="block text-xs text-gray-500">Acceso a financiación</span>
                <span className="inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full border border-green-200 text-green-800 bg-green-50">Alta</span>
              </div>
            </div>

            {/* Bloques adicionales en la misma card */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cumplimiento por tipología */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Cumplimiento por tipología</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Terciario</span>
                        <span className="font-medium text-gray-900">81%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '81%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Libro del Edificio Digital (estado) */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Libro del Edificio Digital</h4>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const total = digitalBook?.sections?.length ?? 0;
                      const done = digitalBook?.sections?.filter(s => s.complete).length ?? 0;
                      const statusLabel = done === 0 && total === 0 ? 'Pendiente' : (done === total && total > 0 ? 'Completo' : 'En progreso');
                      const statusCls = done === total && total > 0
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : (done === 0 && total === 0 ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-blue-100 text-blue-700 border-blue-200');
                      return (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusCls}`}>
                          {statusLabel}
                        </span>
                      );
                    })()}
                    <span className="text-xs text-gray-500">
                      {digitalBook ? `Actualizado ${new Date(digitalBook.updatedAt).toLocaleDateString('es-ES')}` : 'Sin crear'}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Completado</span>
                      <span className="font-medium text-gray-900">
                        {digitalBook ? `${digitalBook.sections.filter(s => s.complete).length}/${digitalBook.sections.length}` : '0/8'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-l-full" style={{ width: digitalBook ? `${Math.round((digitalBook.sections.filter(s => s.complete).length / (digitalBook.sections.length || 1)) * 100)}%` : '0%' }} />
                    </div>
                  </div>
                </div>

                {/* Progreso de secciones + Estado por sección */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Estado por sección</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-green-200 bg-green-50 text-green-800 text-center">OK</div>
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-center">Pendiente</div>
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-red-200 bg-red-50 text-red-800 text-center">Vence</div>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Instalaciones</span><span className="font-medium text-green-700">OK</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Certificados</span><span className="font-medium text-yellow-700">Pendiente</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Mantenimiento</span><span className="font-medium text-green-700">OK</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Inspecciones</span><span className="font-medium text-red-700">Vence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:self-stretch">
            <div className="relative group h-80 lg:h-[500px]">
              {/* Imagen principal */}
              <img 
                src={currentImage?.url || "/image.png"} 
                alt={building.name} 
                className="w-full h-full object-cover rounded-lg" 
              />
              
              {/* Botón para gestionar imágenes */}
              {hasPermission('canCreateBuildings') && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setShowImageManager(true)}
                    className="p-2 bg-white bg-opacity-90 rounded-lg shadow-sm hover:bg-opacity-100 transition-colors"
                    title="Gestionar imágenes"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Navegación de imágenes (solo si hay más de una) */}
              {building.images && building.images.length > 1 && (
                <>
                  {/* Botón anterior */}
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? building.images!.length - 1 : prev - 1
                    )}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                    title="Imagen anterior"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Botón siguiente */}
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === building.images!.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                    title="Imagen siguiente"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Contador de imágenes */}
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-1 text-xs font-medium text-white bg-black bg-opacity-50 rounded">
                      {currentImageIndex + 1} / {building.images.length}
                    </span>
                  </div>
                  
                  {/* Indicadores de puntos */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {building.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white bg-opacity-50'
                        }`}
                        title={`Ver imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Libro Digital Button */}
      <div className="mb-4" style={{animation: 'fadeInUp 0.6s ease-out 0.15s both'}}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Libro Digital del Edificio</h3>
              <p className="text-blue-100 mb-4">
                {user?.role === 'propietario' ? (
                  digitalBook 
                    ? 'Accede a toda la documentación técnica, certificados y normativas del edificio'
                    : 'El técnico estará trabajando para crear el libro digital. En cuanto esté listo podrás verlo accediendo aquí'
                ) : (
                  digitalBook 
                    ? 'Accede a toda la documentación técnica, certificados y normativas del edificio'
                    : 'Crea el libro digital con información técnica detallada, certificados y normativas'
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <span className={`w-2 h-2 rounded-full ${digitalBook ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                <span>
                  {digitalBook 
                    ? `${Math.round((digitalBook.sections.filter(s => s.complete).length/(digitalBook.sections.length||1))*100)}% completado • Actualizado ${new Date(digitalBook.updatedAt).toLocaleDateString('es-ES')}`
                    : user?.role === 'propietario' 
                      ? (building.technicianEmail 
                          ? `Técnico asignado: ${building.technicianEmail}` 
                          : 'Sin técnico asignado aún')
                      : 'Sin libro digital • Listo para crear'
                  }
                </span>
              </div>
            </div>
            <div className="ml-6">
              {(() => {
                // Propietario solo puede VER el libro digital
                if (user?.role === 'propietario') {
                  if (digitalBook) {
                    return (
                      <button
                        onClick={handleViewDigitalBook}
                        className="inline-flex items-center px-4 py-2.5 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Libro Digital
                      </button>
                    );
                  } else {
                    return (
                      <button
                        disabled
                        className="inline-flex items-center px-4 py-2.5 bg-gray-200 text-gray-500 font-medium rounded-md cursor-not-allowed shadow-sm"
                        title="El técnico debe crear el libro digital"
                      >
                        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Esperando creación
                      </button>
                    );
                  }
                }

                // Técnico y otros roles: pueden crear/editar/ver
                const total = digitalBook?.sections?.length ?? 0;
                const done = digitalBook?.sections?.filter(s => s.complete).length ?? 0;
                const hasAny = total > 0;
                const allDone = hasAny && done === total;
                const label = !hasAny ? 'Crear Libro Digital' : (allDone ? 'Ver Libro Digital' : 'Continuar creando');
                const onClick = !hasAny ? handleCreateDigitalBook : handleViewDigitalBook;
                return (
                  <button
                    onClick={onClick}
                    className="inline-flex items-center px-4 py-2.5 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {label}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* ESG Data Status Indicator - Solo para Técnicos */}
      {user?.role === 'tecnico' && (
        <div className="mb-6" style={{animation: 'fadeInUp 0.6s ease-out 0.2s both'}}>
          {esgData?.status === 'incomplete' ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Datos ESG incompletos
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Pendiente
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Para calcular el score ESG, faltan algunos datos críticos. Completa la información en el Libro Digital para obtener un análisis completo.
                  </p>
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">Datos faltantes ({esgData.missingData.length}):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {esgData.missingData.map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                        >
                          <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Datos ESG completos
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completado
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    ¡Excelente! Todos los datos ESG están completos. El sistema puede calcular el score ESG correctamente.
                  </p>
                  {esgData?.data && (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700">Score ESG calculado:</div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill={getESGLabelColor(esgData.data.label)}
                            className="w-6 h-6"
                            style={{ filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15))' }}
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">{esgData.data.label}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Score: {esgData.data.total}/100
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Financial Overview - Solo para Propietarios */}
      {user?.role === 'propietario' && (
        <div className="mb-4" style={{animation: 'fadeInUp 0.6s ease-out 0.15s both'}}>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Análisis Financiero del Activo</h3>
                <p className="text-gray-600 mb-4">
                  Información financiera detallada para la toma de decisiones de inversión
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Valor Actual</span>
                    <span className="text-xl font-bold text-gray-900">€{(building.price || 0).toLocaleString('es-ES')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Inversión Requerida</span>
                    <span className="text-xl font-bold text-blue-900">€{(building.rehabilitationCost || 0).toLocaleString('es-ES')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Valor Potencial</span>
                    <span className="text-xl font-bold text-green-900">€{(building.potentialValue || 0).toLocaleString('es-ES')}</span>
                  </div>
                </div>
              </div>
              <div className="ml-6 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <span className="text-gray-500 text-sm block">ROI Estimado</span>
                  <span className="text-3xl font-bold text-green-600">
                    {building.rehabilitationCost && building.potentialValue && building.price && 
                     building.rehabilitationCost > 0 && building.potentialValue > 0 && building.price > 0
                      ? `+${(((building.potentialValue - building.price - building.rehabilitationCost) / (building.price + building.rehabilitationCost)) * 100).toFixed(1)}%`
                      : '0.0%'
                    }
                  </span>
                  <span className="text-gray-500 text-xs block mt-1">Retorno de inversión</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Certificados energéticos - listado (mock) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm flex flex-col" style={{animation: 'fadeInUp 0.6s ease-out 0.55s both', minHeight: '372px'}}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900 tracking-tight">Certificados energéticos</h3>
            <p className="text-sm text-gray-600">Listado de certificados cargados y sus datos</p>
          </div>
          {user?.role === 'tecnico' && (
            <button
              onClick={handleOpenUpload}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo certificado
            </button>
          )}
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="py-2.5 pr-4 font-medium">N° certificado</th>
                <th className="py-2.5 pr-4 font-medium">Rating</th>
                <th className="py-2.5 pr-4 font-medium">Energía (kWh/m²·año)</th>
                <th className="py-2.5 pr-4 font-medium">Emisiones (kgCO₂/m²·año)</th>
                <th className="py-2.5 pr-4 font-medium">Ámbito</th>
                <th className="py-2.5 pr-4 font-medium">Emisión</th>
                <th className="py-2.5 pr-4 font-medium">Vencimiento</th>
                <th className="py-2.5 pr-4 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody>
                  {energyCertificates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Sin certificados energéticos</p>
                        <p className="text-gray-400 text-sm">
                          {user?.role === 'tecnico' 
                            ? 'Suba el primer certificado usando el botón superior' 
                            : 'El técnico asignado puede subir certificados energéticos para este edificio'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {currentCertificates.map((c) => (
                    <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50/60 cursor-pointer" onClick={() => setSelectedCertificateForView(c)}>
                      <td className="py-3.5 pr-4 font-medium text-gray-900">{c.certificateNumber}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-sm text-sm font-bold ${getRatingClasses(c.rating)}`}>
                          {c.rating}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">{c.primaryEnergyKwhPerM2Year}</td>
                      <td className="py-3.5 pr-4">{c.emissionsKgCo2PerM2Year}</td>
                      <td className="py-3.5 pr-4 capitalize">{c.scope === 'building' ? 'Edificio' : c.scope === 'dwelling' ? 'Vivienda' : 'Local'}</td>
                      <td className="py-3.5 pr-4">{new Date(c.issueDate).toLocaleDateString('es-ES')}</td>
                      <td className="py-3.5 pr-4">{new Date(c.expiryDate).toLocaleDateString('es-ES')}</td>
                      <td className="py-3.5 pr-4">
                        {user?.role === 'tecnico' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCertificate(c);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded"
                            title="Eliminar certificado"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Filas vacías para mantener altura consistente */}
                  {Array.from({ length: Math.max(0, itemsPerPage - currentCertificates.length) }).map((_, index) => (
                    <tr key={`empty-${index}`} className="border-t border-gray-100">
                      <td colSpan={8} className="py-3.5">&nbsp;</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {energyCertificates.length > itemsPerPage && (
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1} a {Math.min(endIndex, energyCertificates.length)} de {energyCertificates.length} certificados
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {/* Números de página */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.6s both'}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan de Mantenimiento</h3>
          <div className="relative h-48">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.7s both'}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Certificado CEE renovado</p>
                <p className="text-xs text-gray-500">Hace 2 días</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Mantenimiento HVAC completado</p>
                <p className="text-xs text-gray-500">Hace 1 semana</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Inspección de ascensor programada</p>
                <p className="text-xs text-gray-500">En 3 días</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Incidencia en sistema PCI</p>
                <p className="text-xs text-gray-500">Hace 5 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location and Valuation Grid */}
      <div className={`grid grid-cols-1 gap-6 mt-6 ${user?.role === 'propietario' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
        {/* Map */}
        <div className={`${user?.role === 'propietario' ? 'lg:col-span-2' : 'lg:col-span-1'} bg-white rounded-xl border border-gray-200 p-6`} style={{animation: 'fadeInUp 0.6s ease-out 0.75s both'}}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación del Edificio</h3>
          <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
            {mapReady ? (
              <MapContainer
                center={[40.424167, -3.711944]} // Coordenadas del Hotel RIU PLAZA España, Madrid
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[40.424167, -3.711944]}>
                <Popup>
                  <div className="text-center">
                    <strong>Hotel RIU PLAZA España</strong><br/>
                    Calle Gran Vía, 84, 28013 Madrid<br/>
                    España<br/>
                    <div className="mt-2 text-sm text-gray-600">
                      <div>📞 +34 919 193 393</div>
                      <div>✉️ reservas@riu.com</div>
                      <div>🌐 www.riu.com</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Cargando mapa...</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Municipio:</span>
              <p className="font-medium text-gray-900">Madrid</p>
            </div>
            <div>
              <span className="text-gray-500">Provincia:</span>
              <p className="font-medium text-gray-900">Madrid</p>
            </div>
            <div>
              <span className="text-gray-500">Coordenadas:</span>
              <p className="font-mono text-xs text-gray-700">40.424167, -3.711944</p>
            </div>
            <div>
              <span className="text-gray-500">Código postal:</span>
              <p className="font-medium text-gray-900">28013</p>
            </div>
          </div>
        </div>

        {/* Property Valuation - Solo para Propietarios */}
        {user?.role === 'propietario' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.8s both'}}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Valoración del Inmueble</h3>
            <div className="space-y-6">
              {/* Valor Total */}
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Valor Total Estimado</p>
                <p className="text-3xl font-bold text-green-600">
                  {building.price ? `€${building.price.toLocaleString('es-ES')}` : '€4,890,000'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Actualizado: Sep 2025</p>
              </div>

            {/* Campos Financieros - Solo para Propietarios */}
            {user?.role === 'propietario' && (building.rehabilitationCost || building.potentialValue) && (
              <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">Análisis Financiero</h4>
                {building.rehabilitationCost && building.rehabilitationCost > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-sm text-blue-700">Coste rehabilitación:</span>
                    <span className="font-medium text-blue-900">€{building.rehabilitationCost.toLocaleString('es-ES')}</span>
                  </div>
                )}
                {building.potentialValue && building.potentialValue > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-sm text-blue-700">Valor potencial:</span>
                    <span className="font-medium text-blue-900">€{building.potentialValue.toLocaleString('es-ES')}</span>
                  </div>
                )}
                {building.rehabilitationCost && building.potentialValue && building.rehabilitationCost > 0 && building.potentialValue > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-blue-700">ROI estimado:</span>
                    <span className="font-medium text-green-600">
                      +{(((building.potentialValue - (building.price || 0) - building.rehabilitationCost) / ((building.price || 0) + building.rehabilitationCost)) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}

              {/* Desglose */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Valor por m²:</span>
                  <span className="font-medium text-gray-900">€1,996/m²</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Valor por vivienda:</span>
                  <span className="font-medium text-gray-900">€203,750</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Variación anual:</span>
                  <span className="font-medium text-green-600">+5.2%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Última tasación:</span>
                  <span className="font-medium text-gray-900">Jun 2025</span>
                </div>
              </div>

              {/* Estado del mercado */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  <span className="text-sm font-medium text-blue-900">Mercado Local</span>
                </div>
                <p className="text-xs text-blue-700">Tendencia alcista en zona residencial de Zierbena</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alerts Section */}
      <div className="mt-6">
        <div className="bg-white rounded-xl border border-gray-200" style={{animation: 'fadeInUp 0.6s ease-out 0.8s both'}}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Alertas y Próximos Vencimientos</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <div>
                    <p className="font-medium text-red-900">Revisión ascensor vence en 15 días</p>
                    <p className="text-sm text-red-700">Industria • Ascensor Principal</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">Programar</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-900">Mantenimiento RITE trimestral</p>
                    <p className="text-sm text-yellow-700">Sistema HVAC • Zona común</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">Ver detalles</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"/>
                  </svg>
                  <div>
                    <p className="font-medium text-blue-900">Actualización manual de uso</p>
                    <p className="text-sm text-blue-700">Documentación • Sistema eléctrico</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Revisar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animaciones */}
      <style>
        {`
          @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      {/* Modal de Carga (solo imagen) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseUpload} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {uploadStep === 'select' ? 'Cargar certificado energético' : 'Revisar datos extraídos'}
              </h3>
              <button onClick={handleCloseUpload} className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {uploadStep === 'select' ? (
              <div className="p-6 overflow-y-auto">
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  acceptedTypes={["image/*"]}
                  multiple={false}
                  maxFiles={1}
                  maxSizeInMB={10}
                  label="Subir imagen del certificado"
                  description="Arrastra una imagen o haz clic para seleccionar"
                />

                {/* Estado del servicio de IA */}
                {aiServiceAvailable !== null && (
                  <div className="mt-3 p-3 rounded-lg border text-sm">
                    {aiServiceAvailable ? (
                      <div className="flex items-center text-green-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Servicio de IA disponible - Los datos se extraerán automáticamente
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Servicio de IA no disponible - Los datos deberán introducirse manualmente
                      </div>
                    )}
                  </div>
                )}

                {selectedFile && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Imagen seleccionada</h4>
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                      <span className="truncate mr-2">{selectedFile.name}</span>
                      <span className="text-gray-500 text-xs">{(selectedFile.size / (1024*1024)).toFixed(1)}MB</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                {/* Previsualización */}
                <div>
                  {selectedFileUrl ? (
                    <img src={selectedFileUrl} alt="Previsualización certificado" className="w-full max-h-[60vh] object-contain rounded-lg border border-gray-200" />
                  ) : (
                    <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      Sin previsualización
                    </div>
                  )}
                </div>
                {/* Datos extraídos (editables) */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Datos detectados (puedes editar)</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Rating</label>
                        <select
                          value={reviewData.rating}
                          onChange={e => setReviewData(v => ({ ...v, rating: e.target.value as any }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="">-</option>
                          {['A','B','C','D','E','F','G'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Ámbito</label>
                        <select
                          value={reviewData.scope}
                          onChange={e => setReviewData(v => ({ ...v, scope: e.target.value as any }))}
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
                        <label className="block text-xs text-gray-500 mb-1">Energía primaria kWh/m²·año</label>
                        <input
                          type="number"
                          value={reviewData.primaryEnergyKwhPerM2Year}
                          onChange={e => setReviewData(v => ({ ...v, primaryEnergyKwhPerM2Year: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Emisiones kgCO₂/m²·año</label>
                        <input
                          type="number"
                          value={reviewData.emissionsKgCo2PerM2Year}
                          onChange={e => setReviewData(v => ({ ...v, emissionsKgCo2PerM2Year: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nº de certificado</label>
                      <input
                        type="text"
                        value={reviewData.certificateNumber}
                        onChange={e => setReviewData(v => ({ ...v, certificateNumber: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Fecha emisión</label>
                        <input
                          type="date"
                          value={reviewData.issueDate}
                          onChange={e => setReviewData(v => ({ ...v, issueDate: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Fecha vencimiento</label>
                        <input
                          type="date"
                          value={reviewData.expiryDate}
                          onChange={e => setReviewData(v => ({ ...v, expiryDate: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Referencia catastral</label>
                      <input
                        type="text"
                        value={reviewData.propertyReference}
                        onChange={e => setReviewData(v => ({ ...v, propertyReference: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Notas</label>
                      <textarea
                        value={reviewData.notes}
                        onChange={e => setReviewData(v => ({ ...v, notes: e.target.value }))}
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
                onClick={uploadStep === 'select' ? handleCloseUpload : handleBackToUpload}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isProcessingAI}
              >
                {uploadStep === 'select' ? 'Cancelar' : 'Volver'}
              </button>
              {uploadStep === 'select' ? (
                <button
                  onClick={handleContinueToReview}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedFile || isProcessingAI}
                >
                  {isProcessingAI ? 'Procesando...' : 'Continuar'}
                </button>
              ) : (
                <button
                  onClick={handleConfirmAndSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Confirmar y guardar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestión de imágenes */}
      {showImageManager && building && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowImageManager(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Gestionar imágenes de {building.name}
              </h3>
              <button 
                onClick={() => setShowImageManager(false)} 
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedCertificateForView(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Certificado Energético #{selectedCertificateForView.certificateNumber}
              </h3>
              <button 
                onClick={() => setSelectedCertificateForView(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
              {/* Imagen del certificado */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Documento original</h4>
                {(selectedCertificateForView.imageUrl || selectedCertificateForView.sourceDocumentUrl || reviewData.imageUrl) ? (
                  <img 
                    src={selectedCertificateForView.imageUrl || selectedCertificateForView.sourceDocumentUrl || reviewData.imageUrl} 
                    alt="Certificado energético" 
                    className="w-full max-h-[60vh] object-contain rounded-lg border border-gray-200" 
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    Imagen no disponible
                  </div>
                )}
                {selectedCertificateForView.imageFilename && (
                  <p className="text-xs text-gray-500 mt-2">
                    Archivo: {selectedCertificateForView.imageFilename}
                  </p>
                )}
              </div>

              {/* Datos del certificado (solo lectura) */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Información del certificado</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Rating energético</label>
                      <div className={`inline-flex items-center px-2 py-1 rounded-sm text-sm font-bold ${getRatingClasses(selectedCertificateForView.rating)}`}>
                        {selectedCertificateForView.rating}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ámbito</label>
                      <p className="text-sm text-gray-900 capitalize">
                        {selectedCertificateForView.scope === 'building' ? 'Edificio' : 
                         selectedCertificateForView.scope === 'dwelling' ? 'Vivienda' : 'Local'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Energía primaria kWh/m²·año</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedCertificateForView.primaryEnergyKwhPerM2Year}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Emisiones kgCO₂/m²·año</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedCertificateForView.emissionsKgCo2PerM2Year}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nº de certificado</label>
                    <p className="text-sm text-gray-900">{selectedCertificateForView.certificateNumber}</p>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Organismo certificador</label>
                    <p className="text-sm text-gray-900">{selectedCertificateForView.issuerName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fecha de emisión</label>
                      <p className="text-sm text-gray-900">{new Date(selectedCertificateForView.issueDate).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Fecha de vencimiento</label>
                      <p className="text-sm text-gray-900">{new Date(selectedCertificateForView.expiryDate).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>

                  {selectedCertificateForView.propertyReference && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Referencia catastral</label>
                      <p className="text-sm text-gray-900">{selectedCertificateForView.propertyReference}</p>
                    </div>
                  )}

                  {selectedCertificateForView.notes && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Notas</label>
                      <p className="text-sm text-gray-900">{selectedCertificateForView.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <label className="block mb-1">Fecha de carga</label>
                        <p>{new Date(selectedCertificateForView.createdAt).toLocaleDateString('es-ES')}</p>
                      </div>
                      <div>
                        <label className="block mb-1">Última actualización</label>
                        <p>{new Date(selectedCertificateForView.updatedAt).toLocaleDateString('es-ES')}</p>
                      </div>
                      {selectedCertificateForView.imageUploadedAt && (
                        <div className="col-span-2">
                          <label className="block mb-1">Imagen subida</label>
                          <p>{new Date(selectedCertificateForView.imageUploadedAt).toLocaleDateString('es-ES')}</p>
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
          <div className="absolute inset-0 bg-black/40" onClick={cancelDeleteCertificate} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Eliminar certificado</h3>
                  <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  ¿Estás seguro de que quieres eliminar el certificado energético?
                </p>
                {certificateToDelete && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900">N° {certificateToDelete.certificateNumber}</p>
                    <p className="text-xs text-gray-500">
                      Rating: {certificateToDelete.rating} • {certificateToDelete.scope === 'building' ? 'Edificio' : certificateToDelete.scope === 'dwelling' ? 'Vivienda' : 'Local'}
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
                      ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteCertificate}
                  disabled={isDeleting}
                  className={`px-4 py-2 text-sm font-medium text-white border border-red-600 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                    isDeleting 
                      ? 'bg-red-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
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