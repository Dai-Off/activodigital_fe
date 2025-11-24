import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BuildingsApiService, type Building } from '../services/buildingsApi';
import { Badge } from './ui/badge';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { useLoadingState, SkeletonBase, SkeletonText } from './ui/LoadingSystem';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb, 
  Zap,
  Home,
  Wrench,
  TrendingUp,
  Info
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'red' | 'yellow' | 'green';
  category: 'energetico' | 'estructural' | 'normativo' | 'financiero';
  changes: string[];
  estimatedCost?: number;
  estimatedTime?: string;
}

interface EBPDCompliance {
  complies: boolean;
  score: number;
  currentRating: string;
  targetRating: string;
  mainIssues: string[];
  recommendations: Recommendation[];
}

export default function BuildingAnalysisGeneral() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loading, startLoading, stopLoading } = useLoadingState(true);
  const [building, setBuilding] = useState<Building | null>(null);
  
  // Datos hardcodeados por ahora
  const [complianceData] = useState<EBPDCompliance>({
    complies: false,
    score: 45,
    currentRating: 'E',
    targetRating: 'C',
    mainIssues: [
      'El edificio no cumple con los requisitos mínimos de eficiencia energética de la EBPD',
      'La clase energética actual (E) está por debajo del umbral requerido (C)',
      'Falta de aislamiento térmico adecuado en fachadas y cubierta',
      'Sistema de calefacción obsoleto con baja eficiencia',
    ],
    recommendations: [
      {
        id: '1',
        title: 'Mejora del aislamiento térmico',
        description: 'Instalación de aislamiento en fachadas y cubierta para reducir pérdidas de calor',
        priority: 'red',
        category: 'energetico',
        changes: [
          'Aplicar SATE (Sistema de Aislamiento Térmico por el Exterior) en fachadas',
          'Mejorar aislamiento en cubierta con lana mineral de 10cm',
          'Sustituir carpinterías por ventanas de doble acristalamiento con rotura de puente térmico'
        ],
        estimatedCost: 85000,
        estimatedTime: '3-4 meses'
      },
      {
        id: '2',
        title: 'Renovación del sistema de calefacción',
        description: 'Sustitución de caldera antigua por sistema de alta eficiencia energética',
        priority: 'red',
        category: 'energetico',
        changes: [
          'Instalar caldera de condensación de alta eficiencia',
          'Implementar sistema de regulación y control inteligente',
          'Optimizar distribución de radiadores'
        ],
        estimatedCost: 25000,
        estimatedTime: '1-2 meses'
      },
      {
        id: '3',
        title: 'Instalación de energías renovables',
        description: 'Integración de paneles solares para generación de energía limpia',
        priority: 'yellow',
        category: 'energetico',
        changes: [
          'Instalar paneles fotovoltaicos en cubierta (20kW)',
          'Sistema de gestión de energía inteligente',
          'Conexión a red con compensación de excedentes'
        ],
        estimatedCost: 35000,
        estimatedTime: '2-3 meses'
      },
      {
        id: '4',
        title: 'Mejora de la ventilación',
        description: 'Sistema de ventilación mecánica con recuperación de calor',
        priority: 'yellow',
        category: 'energetico',
        changes: [
          'Instalar sistema de ventilación de doble flujo',
          'Recuperador de calor para optimizar eficiencia',
          'Filtros de alta calidad para mejorar calidad del aire'
        ],
        estimatedCost: 18000,
        estimatedTime: '1 mes'
      },
      {
        id: '5',
        title: 'Optimización de iluminación',
        description: 'Sustitución de iluminación convencional por LED de alta eficiencia',
        priority: 'green',
        category: 'energetico',
        changes: [
          'Reemplazar todas las luminarias por tecnología LED',
          'Instalar sensores de presencia en zonas comunes',
          'Sistema de regulación automática según luz natural'
        ],
        estimatedCost: 12000,
        estimatedTime: '2-3 semanas'
      },
      {
        id: '6',
        title: 'Certificación y documentación',
        description: 'Actualizar certificado energético y documentación técnica',
        priority: 'green',
        category: 'normativo',
        changes: [
          'Realizar nueva certificación energética tras mejoras',
          'Actualizar documentación técnica del edificio',
          'Registrar mejoras en base de datos oficial'
        ],
        estimatedCost: 2000,
        estimatedTime: '2 semanas'
      }
    ]
  });

  useEffect(() => {
    if (id) {
      loadBuilding();
    }
  }, [id]);

  const loadBuilding = async () => {
    if (!id) return;
    startLoading();
    try {
      const data = await BuildingsApiService.getBuildingById(id);
      setBuilding(data);
    } catch (error) {
      console.error('Error loading building:', error);
    } finally {
      stopLoading();
    }
  };

  const getPriorityConfig = (priority: 'red' | 'yellow' | 'green') => {
    switch (priority) {
      case 'red':
        return {
          color: 'bg-red-500',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: XCircle,
          label: 'Urgente'
        };
      case 'yellow':
        return {
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: AlertTriangle,
          label: 'Importante'
        };
      case 'green':
        return {
          color: 'bg-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: CheckCircle2,
          label: 'Recomendado'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energetico':
        return <Zap className="w-4 h-4" />;
      case 'estructural':
        return <Home className="w-4 h-4" />;
      case 'normativo':
        return <Info className="w-4 h-4" />;
      case 'financiero':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Skeleton de carga
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="mb-6 space-y-2">
          <SkeletonBase className="h-8 w-64" />
          <SkeletonBase className="h-4 w-48" />
        </div>

        {/* Estado de Cumplimiento Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2 flex-1">
              <SkeletonBase className="h-6 w-64" />
              <SkeletonBase className="h-4 w-96" />
            </div>
            <SkeletonBase className="h-8 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <SkeletonBase className="h-4 w-24 mb-2" />
                <SkeletonBase className="h-8 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de Recomendaciones Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-2 mb-6">
            <SkeletonBase className="h-6 w-48" />
            <SkeletonBase className="h-4 w-72" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <SkeletonBase className="h-4 w-20 mb-2" />
                <SkeletonBase className="h-8 w-12" />
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <SkeletonBase className="h-4 w-32 mb-2" />
            <SkeletonBase className="h-8 w-40" />
          </div>
        </div>

        {/* Recomendaciones Skeleton */}
        <div className="space-y-4">
          <SkeletonBase className="h-6 w-64" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <SkeletonBase className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <SkeletonBase className="h-6 w-48" />
                    <SkeletonBase className="h-5 w-20 rounded-full" />
                  </div>
                  <SkeletonBase className="h-4 w-full" />
                  <SkeletonBase className="h-4 w-3/4" />
                </div>
              </div>
              <div className="space-y-3">
                <SkeletonBase className="h-4 w-32" />
                <SkeletonText lines={3} widths={['w-full', 'w-5/6', 'w-4/6']} />
                <div className="flex gap-4 pt-2 border-t border-gray-200">
                  <SkeletonBase className="h-4 w-32" />
                  <SkeletonBase className="h-4 w-28" />
                  <SkeletonBase className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Edificio no encontrado</div>
      </div>
    );
  }

  const totalCost = complianceData.recommendations.reduce((sum, rec) => sum + (rec.estimatedCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{building.name}</h1>
        <p className="text-sm text-gray-500">Análisis General - Cumplimiento EBPD</p>
      </div>

      {/* Estado de Cumplimiento */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Estado de Cumplimiento EBPD</h2>
            <p className="text-sm text-gray-600">
              Evaluación del cumplimiento de la Directiva de Eficiencia Energética de Edificios
            </p>
          </div>
          <Badge 
            className={`text-sm font-semibold px-4 py-2 ${
              complianceData.complies 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {complianceData.complies ? 'CUMPLE' : 'NO CUMPLE'}
          </Badge>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Puntuación Actual</p>
              <p className="text-3xl font-bold text-gray-900">{complianceData.score}/100</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Clase Energética Actual</p>
              <p className="text-3xl font-bold text-gray-900">{complianceData.currentRating}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Clase Objetivo</p>
              <p className="text-3xl font-bold text-green-600">{complianceData.targetRating}</p>
            </div>
          </div>

          {!complianceData.complies && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>El edificio no cumple con los requisitos EBPD</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {complianceData.mainIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Resumen de Recomendaciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-gray-700" />
            Plan de Mejoras Recomendado
          </h2>
          <p className="text-sm text-gray-600">
            Recomendaciones priorizadas para alcanzar el cumplimiento EBPD
          </p>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-red-800">Urgentes</span>
              </div>
              <p className="text-2xl font-bold text-red-900">
                {complianceData.recommendations.filter(r => r.priority === 'red').length}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-yellow-800">Importantes</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">
                {complianceData.recommendations.filter(r => r.priority === 'yellow').length}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-800">Recomendadas</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {complianceData.recommendations.filter(r => r.priority === 'green').length}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-1">Inversión Total Estimada</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* Lista de Recomendaciones */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recomendaciones Detalladas</h2>
        
        {complianceData.recommendations.map((recommendation) => {
          const config = getPriorityConfig(recommendation.priority);
          const Icon = config.icon;
          
          return (
            <div key={recommendation.id} className={`bg-white rounded-lg shadow-sm border-2 ${config.borderColor} p-6`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`${config.color} rounded-full p-2 text-white flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                    <Badge className={`${config.bgColor} ${config.textColor} ${config.borderColor} border text-xs font-medium`}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{recommendation.description}</p>
                </div>
              </div>
              <div>
                <div className="space-y-4">
                  {/* Cambios necesarios */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      Cambios Necesarios
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-6">
                      {recommendation.changes.map((change, index) => (
                        <li key={index}>{change}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Información adicional */}
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-200">
                    {recommendation.estimatedCost && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Coste estimado:</span> {formatCurrency(recommendation.estimatedCost)}
                        </span>
                      </div>
                    )}
                    {recommendation.estimatedTime && (
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Tiempo estimado:</span> {recommendation.estimatedTime}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(recommendation.category)}
                      <span className="text-sm text-gray-600 capitalize">
                        {recommendation.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

