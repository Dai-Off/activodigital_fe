import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { BuildingsApiService } from '../services/buildingsApi';
import type { Building, BuildingImage } from '../services/buildingsApi';
import ImageManager from './ui/ImageManager';
import { extractCertificateData, mapAIResponseToReviewData, checkCertificateExtractorHealth } from '../services/certificateExtractor';
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
  const [hasDigitalBook] = useState(false); // TODO: Conectar con API real
  const [mapReady, setMapReady] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<'select' | 'review'>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiServiceAvailable, setAiServiceAvailable] = useState<boolean | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
  });

  // Certificados energéticos (mock - solo UI)
  const energyCertificates = [
    {
      id: 'cee-001',
      rating: 'B' as 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G',
      primary: 85.42, // kWh/m²·año
      emissions: 16.74, // kgCO₂/m²·año
      number: 'PRV/0006867706/03/2025',
      scope: 'building' as 'building' | 'dwelling' | 'commercial_unit',
      issueDate: '2025-07-13',
      expiryDate: '2035-07-13',
    },
    {
      id: 'cee-002',
      rating: 'C' as 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G',
      primary: 102.1,
      emissions: 22.3,
      number: 'PRV/0001234567/05/2024',
      scope: 'building' as 'building' | 'dwelling' | 'commercial_unit',
      issueDate: '2024-05-10',
      expiryDate: '2034-05-10',
    },
  ];

  useEffect(() => {
    const loadBuilding = async () => {
      if (!id) return;

      try {
        startLoading();
        const buildingData = await BuildingsApiService.getBuildingById(id);
        setBuilding(buildingData);
        
        // Activar mapa después de cargar datos
        setTimeout(() => setMapReady(true), 500);
        stopLoading();
        
      } catch (error) {
        console.error('Error loading building:', error);
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
        console.warn('AI service check failed:', error);
        setAiServiceAvailable(false);
      }
    };

    checkAIService();
  }, []);

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

  const handleCreateDigitalBook = () => {
    navigate(`/libro-digital/hub`, {
      state: {
        buildingId: building?.id,
        buildingName: building?.name,
        isNewBook: true
      }
    });
  };

  const handleViewDigitalBook = () => {
    navigate(`/libro-digital/hub`, {
      state: {
        buildingId: building?.id,
        buildingName: building?.name,
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
    if (!selectedFile) return;

    try {
      setIsProcessingAI(true);
      
      // Verificar si el servicio de IA está disponible
      if (aiServiceAvailable === false) {
        showError('Servicio de IA no disponible', 'El servicio de extracción de certificados no está disponible en este momento.');
        return;
      }

      // Extraer datos con IA
      const aiResponse = await extractCertificateData(selectedFile);
      const mappedData = mapAIResponseToReviewData(aiResponse);
      
      // Actualizar datos de revisión (asegurando defaults)
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
      });
      setUploadStep('review');
      
      showSuccess('Datos extraídos', 'Los datos del certificado han sido extraídos automáticamente. Revisa y ajusta si es necesario.');
      
    } catch (error) {
      console.error('Error processing certificate:', error);
      showError('Error al procesar certificado', error instanceof Error ? error.message : 'Error desconocido al procesar el certificado');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleBackToUpload = () => {
    setUploadStep('select');
  };

  const handleConfirmAndSave = () => {
    // TODO: Implementar guardado en backend
    showSuccess('Certificado guardado', 'El certificado energético ha sido guardado correctamente.');
    handleCloseUpload();
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

  // SVGs para iconos
  const icons = {
    shieldCheck: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.01 12.01 0 002.944 12c.047 1.47 1.076 2.767 2.784 3.737C7.882 17.567 9.8 18 12 18s4.118-.433 6.272-1.263c1.708-.97 2.737-2.267 2.784-3.737a12.01 12.01 0 00-.047-6.056z"/>
      </svg>
    ),
    clock: (
      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    wrench: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.053 4.19a8.977 8.977 0 011.894 0M10 21v-2a4 4 0 014-4V5a4 4 0 014-4h2a2 2 0 012 2v16a2 2 0 01-2 2h-2a4 4 0 01-4-4v-2a4 4 0 01-4 4H4a2 2 0 01-2-2V3a2 2 0 012-2h2a4 4 0 014 4v12a4 4 0 014 4v2a2 2 0 01-2 2h-2z"/>
      </svg>
    ),
    alertCircle: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <RatingCircle rating="A" size="sm" />
                  <RatingStars stars={5} />
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <span className="block text-xs text-gray-500">Huella de carbono</span>
                <p className="mt-1 font-medium text-gray-900">12.5 kg CO₂eq/m²·año</p>
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
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      hasDigitalBook 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {hasDigitalBook ? 'Publicado' : 'Pendiente'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {hasDigitalBook ? 'Versión 1.2 • Actualizado Sep 2025' : 'Sin crear'}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Completado</span>
                      <span className="font-medium text-gray-900">
                        {hasDigitalBook ? '6/8' : '0/8'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-l-full" style={{ width: hasDigitalBook ? '75%' : '0%' }} />
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
            <div className="relative group h-full min-h-[400px]">
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
                {user?.role === 'tenedor' ? (
                  hasDigitalBook 
                    ? 'Accede a toda la documentación técnica, certificados y normativas del edificio'
                    : 'El técnico estará trabajando para crear el libro digital. En cuanto esté listo podrás verlo accediendo aquí'
                ) : (
                  hasDigitalBook 
                    ? 'Accede a toda la documentación técnica, certificados y normativas del edificio'
                    : 'Crea el libro digital con información técnica detallada, certificados y normativas'
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <span className={`w-2 h-2 rounded-full ${hasDigitalBook ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                <span>
                  {hasDigitalBook 
                    ? '92% completado • Versión 1.2.0 • Actualizado 2025-09-01'
                    : user?.role === 'tenedor' 
                      ? (building.technicianEmail 
                          ? `Técnico asignado: ${building.technicianEmail}` 
                          : 'Sin técnico asignado aún')
                      : 'Sin libro digital • Listo para crear'
                  }
                </span>
              </div>
            </div>
            <div className="ml-6">
              {hasDigitalBook ? (
                <button
                  onClick={handleViewDigitalBook}
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  {user?.role === 'tenedor' ? 'Ver Libro Digital' : 'Ver Libro Digital'}
                </button>
              ) : (
                user?.role === 'tenedor' ? (
                  <button
                    disabled
                    className="inline-flex items-center px-6 py-3 bg-white/20 text-blue-100 font-semibold rounded-lg cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    En desarrollo
                  </button>
                ) : (
                  hasPermission('canManageDigitalBooks') && (
                    <button
                      onClick={handleCreateDigitalBook}
                      className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Crear Libro Digital
                    </button>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview - Solo para Tenedores */}
      {user?.role === 'tenedor' && (
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

      {/* Status Cards */}
      <div className="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.2s both'}}>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">{icons.shieldCheck}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Cumplimiento Legal</h3>
              <p className="text-2xl font-semibold text-gray-900">95%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.3s both'}}>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">{icons.clock}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Próximas Caducidades</h3>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.4s both'}}>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">{icons.wrench}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Tareas Mantenimiento</h3>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.5s both'}}>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">{icons.alertCircle}</div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Incidencias Abiertas</h3>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificados energéticos - listado (mock) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm" style={{animation: 'fadeInUp 0.6s ease-out 0.55s both'}}>
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
        <div className="overflow-x-auto">
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
              </tr>
            </thead>
            <tbody>
              {energyCertificates.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                  <td className="py-3.5 pr-4 font-medium text-gray-900">{c.number}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${c.rating <= 'C' ? 'border-green-200 text-green-800 bg-green-50' : 'border-gray-200 text-gray-800 bg-gray-50'}`}>
                      {c.rating}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">{c.primary}</td>
                  <td className="py-3.5 pr-4">{c.emissions}</td>
                  <td className="py-3.5 pr-4 capitalize">{c.scope === 'building' ? 'Edificio' : c.scope === 'dwelling' ? 'Vivienda' : 'Local'}</td>
                  <td className="py-3.5 pr-4">{new Date(c.issueDate).toLocaleDateString('es-ES')}</td>
                  <td className="py-3.5 pr-4">{new Date(c.expiryDate).toLocaleDateString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6" style={{animation: 'fadeInUp 0.6s ease-out 0.75s both'}}>
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

        {/* Property Valuation */}
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

            {/* Campos Financieros */}
            {(building.rehabilitationCost || building.potentialValue) && (
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
    </div>
  );
};

export default BuildingDetail;