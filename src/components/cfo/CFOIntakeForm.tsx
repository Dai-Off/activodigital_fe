import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Edit, Plus, BarChart3, Zap } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { BuildingsApiService } from '../../services/buildingsApi';
import { FinancialSnapshotsService } from '../../services/financialSnapshots';
import { AppSpinner } from '../ui/LoadingSystem';

interface CFOIntakeData {
  // 1. Precio & Mercado (solo datos adicionales)
  eur_m2_ref_p50?: number | null;
  dom_dias?: number | null;

  // 2. Ingresos (últimos 12m)
  ingresos_brutos_anuales_eur: number;
  otros_ingresos_anuales_eur?: number | null;
  walt_meses: number;
  concentracion_top1_pct_noi: number;
  indexacion_ok?: boolean | null;
  mora_pct_12m?: number | null;

  // 3. OPEX (últimos 12m)
  opex_total_anual_eur: number;
  opex_energia_anual_eur: number;
  opex_mantenimiento_anual_eur?: number | null;

  // 4. Documentación (Semáforo)
  libro_edificio_estado: 'completo' | 'parcial' | 'faltante';
  ite_iee_estado: 'ok' | 'pendiente' | 'no_aplica';
  mantenimientos_criticos_ok: boolean;
  planos_estado?: 'ok' | 'faltante' | null;

  // 5. Deuda (si aplica)
  dscr?: number | null;
  penalidad_prepago_alta?: boolean | null;

  // 6. Rehabilitación (quick wins)
  capex_rehab_estimado_eur?: number | null;
  ahorro_energia_pct_estimado?: number | null;
  rehabilitationCost?: number | null;
  potentialValue?: number | null;
}

export default function CFOIntakeForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { buildingId } = useParams<{ buildingId: string }>();
  const { showSuccess } = useToast();

  const [activeSection, setActiveSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [building, setBuilding] = useState<any>(null);

  // Estado del formulario con valores iniciales vacíos
  // IMPORTANTE: Los porcentajes se manejan como 0-100 en el form, pero se envían como 0-1 al backend
  const [formData, setFormData] = useState<Partial<CFOIntakeData>>({
    ingresos_brutos_anuales_eur: 0,
    walt_meses: 0,
    concentracion_top1_pct_noi: 0, // Se maneja como 0-100 en UI
    opex_total_anual_eur: 0,
    opex_energia_anual_eur: 0,
    libro_edificio_estado: 'faltante',
    ite_iee_estado: 'no_aplica',
    mantenimientos_criticos_ok: false,
    rehabilitationCost: null,
    potentialValue: null,
  });

  // Cargar datos del edificio y datos financieros al montar el componente
  useEffect(() => {
    const loadData = async () => {
      if (!buildingId) return;
      
      console.log('🔄 Cargando datos iniciales para building:', buildingId);
      
      try {
        // Cargar datos del edificio
        const buildingData = await BuildingsApiService.getBuildingById(buildingId);
        setBuilding(buildingData);
        console.log('🏢 Edificio cargado:', buildingData);
        setFormData(prev => ({
          ...prev,
          rehabilitationCost:
            buildingData.rehabilitationCost !== undefined && buildingData.rehabilitationCost !== null && buildingData.rehabilitationCost !== 0
              ? buildingData.rehabilitationCost
              : null,
          potentialValue:
            buildingData.potentialValue !== undefined && buildingData.potentialValue !== null && buildingData.potentialValue !== 0
              ? buildingData.potentialValue
              : null,
        }));
        
        // Cargar datos financieros existentes
        try {
          const snapshots = await FinancialSnapshotsService.getFinancialSnapshots(buildingId);
          console.log('📊 Snapshots encontrados:', snapshots);
          
          if (snapshots && snapshots.length > 0) {
            const latestSnapshot = snapshots[0];
            console.log('✅ Datos existentes encontrados:', latestSnapshot);
            setExistingData(latestSnapshot);
            
            // Pre-llenar formulario con datos existentes (convertir ratios a porcentajes)
            setFormData({
              ingresos_brutos_anuales_eur: latestSnapshot.ingresos_brutos_anuales_eur,
              otros_ingresos_anuales_eur: latestSnapshot.otros_ingresos_anuales_eur,
              walt_meses: latestSnapshot.walt_meses,
              concentracion_top1_pct_noi: latestSnapshot.concentracion_top1_pct_noi * 100, // Convertir a porcentaje
              indexacion_ok: latestSnapshot.indexacion_ok ?? undefined,
              mora_pct_12m: latestSnapshot.mora_pct_12m ? latestSnapshot.mora_pct_12m * 100 : undefined, // Convertir a porcentaje
              opex_total_anual_eur: latestSnapshot.opex_total_anual_eur,
              opex_energia_anual_eur: latestSnapshot.opex_energia_anual_eur,
              opex_mantenimiento_anual_eur: latestSnapshot.opex_mantenimiento_anual_eur,
              libro_edificio_estado: latestSnapshot.meta?.libro_edificio_estado || 'faltante',
              ite_iee_estado: latestSnapshot.meta?.ite_iee_estado || 'no_aplica',
              mantenimientos_criticos_ok: latestSnapshot.meta?.mantenimientos_criticos_ok || false,
              planos_estado: latestSnapshot.meta?.planos_estado,
              dscr: latestSnapshot.dscr,
              penalidad_prepago_alta: latestSnapshot.penalidad_prepago_alta ?? undefined,
              capex_rehab_estimado_eur: latestSnapshot.capex_rehab_estimado_eur,
              ahorro_energia_pct_estimado: latestSnapshot.ahorro_energia_pct_estimado,
              eur_m2_ref_p50: latestSnapshot.meta?.eur_m2_ref_p50,
              dom_dias: latestSnapshot.meta?.dom_dias,
              rehabilitationCost:
                buildingData.rehabilitationCost !== undefined && buildingData.rehabilitationCost !== null && buildingData.rehabilitationCost !== 0
                  ? buildingData.rehabilitationCost
                  : null,
              potentialValue:
                buildingData.potentialValue !== undefined && buildingData.potentialValue !== null && buildingData.potentialValue !== 0
                  ? buildingData.potentialValue
                  : null,
            });
          } else {
            console.log('ℹ️ No hay datos financieros previos');
          }
        } catch (snapshotError: any) {
          console.warn('⚠️ Error al cargar snapshots (probablemente no hay permisos aún):', snapshotError.message);
          // No es un error fatal, simplemente no hay datos aún
        }
      } catch (error) {
        console.error('❌ Error cargando datos del edificio:', error);
      } finally {
        setIsLoadingData(false);
        console.log('✅ Carga inicial completada');
      }
    };

    loadData();
  }, [buildingId]);

  const sections = [
    { id: 1, name: t('cfo.intake.section1', { defaultValue: 'Precio & Mercado' }) },
    { id: 2, name: t('cfo.intake.section2', { defaultValue: 'Ingresos (últimos 12m)' }) },
    { id: 3, name: t('cfo.intake.section3', { defaultValue: 'OPEX (últimos 12m)' }) },
    { id: 4, name: t('cfo.intake.section4', { defaultValue: 'Documentación (Semáforo)' }) },
    { id: 5, name: t('cfo.intake.section5', { defaultValue: 'Deuda (si aplica)' }) },
    { id: 6, name: t('cfo.intake.section6', { defaultValue: 'Rehabilitación (quick wins)' }) },
  ];

  const handleInputChange = (field: keyof CFOIntakeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let latestBuilding = building || null;

      // Mapear datos del formulario al schema del backend
      const today = new Date();
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      
      const payload = {
        building_id: buildingId || '',
        period_start: oneYearAgo.toISOString().split('T')[0],
        period_end: today.toISOString().split('T')[0],
        currency: 'EUR' as const,
        ingresos_brutos_anuales_eur: formData.ingresos_brutos_anuales_eur || 0,
        otros_ingresos_anuales_eur: formData.otros_ingresos_anuales_eur ?? null,
        walt_meses: formData.walt_meses || 0,
        // Convertir de porcentaje (0-100) a ratio (0-1) para el backend
        concentracion_top1_pct_noi: (formData.concentracion_top1_pct_noi || 0) / 100,
        indexacion_ok: formData.indexacion_ok ?? null,
        // Convertir de porcentaje (0-100) a ratio (0-1) para el backend
        mora_pct_12m: formData.mora_pct_12m ? formData.mora_pct_12m / 100 : null,
        opex_total_anual_eur: formData.opex_total_anual_eur || 0,
        opex_energia_anual_eur: formData.opex_energia_anual_eur || 0,
        opex_mantenimiento_anual_eur: formData.opex_mantenimiento_anual_eur ?? null,
        dscr: formData.dscr ?? null,
        penalidad_prepago_alta: formData.penalidad_prepago_alta ?? null,
        capex_rehab_estimado_eur: formData.capex_rehab_estimado_eur ?? null,
        ahorro_energia_pct_estimado: formData.ahorro_energia_pct_estimado ?? null,
        // Campos de documentación - guardarlos en meta
        meta: {
          libro_edificio_estado: formData.libro_edificio_estado,
          ite_iee_estado: formData.ite_iee_estado,
          mantenimientos_criticos_ok: formData.mantenimientos_criticos_ok,
          planos_estado: formData.planos_estado ?? undefined,
          eur_m2_ref_p50: formData.eur_m2_ref_p50 ?? undefined,
          dom_dias: formData.dom_dias ?? undefined,
        }
      };

      // Actualizar campos financieros del edificio (rehabilitationCost & potentialValue)
      if (buildingId) {
        const rehabilitationCostValue =
          typeof formData.rehabilitationCost === 'number' ? formData.rehabilitationCost : undefined;
        const potentialValueValue =
          typeof formData.potentialValue === 'number' ? formData.potentialValue : undefined;

        if (rehabilitationCostValue !== undefined || potentialValueValue !== undefined) {
          const updatedBuilding = await BuildingsApiService.updateBuilding(buildingId, {
            rehabilitationCost: rehabilitationCostValue,
            potentialValue: potentialValueValue,
          });
          setBuilding(updatedBuilding);
          latestBuilding = updatedBuilding;
        }
      }

      console.log('📤 Payload para backend:', payload);
      console.log('📤 Concentración (debería estar entre 0-1):', payload.concentracion_top1_pct_noi);
      console.log('📤 Mora (debería estar entre 0-1 o null):', payload.mora_pct_12m);
      console.log('📤 Meta:', payload.meta);
      
      // Enviar datos al backend
      const response = await FinancialSnapshotsService.createFinancialSnapshot(payload);
      console.log('✅ Respuesta del backend:', response);
      
      console.log('✅ Financial snapshot guardado exitosamente');
      
      // Mostrar toast de éxito
      showSuccess('Datos guardados exitosamente', 'Los datos financieros se han actualizado correctamente');
      
      // Recargar datos y volver a modo lectura
      setIsLoadingData(true);
      try {
        const snapshots = await FinancialSnapshotsService.getFinancialSnapshots(buildingId || '');
        console.log('📊 Snapshots recargados:', snapshots);
        
        if (snapshots && snapshots.length > 0) {
          const latestSnapshot = snapshots[0];
          console.log('✅ Actualizando existingData con:', latestSnapshot);
          setExistingData(latestSnapshot);
          
          // Pre-llenar formulario con los datos actualizados (convertir ratios a porcentajes)
          setFormData({
            ingresos_brutos_anuales_eur: latestSnapshot.ingresos_brutos_anuales_eur,
            otros_ingresos_anuales_eur: latestSnapshot.otros_ingresos_anuales_eur,
            walt_meses: latestSnapshot.walt_meses,
            concentracion_top1_pct_noi: latestSnapshot.concentracion_top1_pct_noi * 100, // Convertir a porcentaje
            indexacion_ok: latestSnapshot.indexacion_ok ?? undefined,
            mora_pct_12m: latestSnapshot.mora_pct_12m ? latestSnapshot.mora_pct_12m * 100 : undefined, // Convertir a porcentaje
            opex_total_anual_eur: latestSnapshot.opex_total_anual_eur,
            opex_energia_anual_eur: latestSnapshot.opex_energia_anual_eur,
            opex_mantenimiento_anual_eur: latestSnapshot.opex_mantenimiento_anual_eur,
            libro_edificio_estado: latestSnapshot.meta?.libro_edificio_estado || 'faltante',
            ite_iee_estado: latestSnapshot.meta?.ite_iee_estado || 'no_aplica',
            mantenimientos_criticos_ok: latestSnapshot.meta?.mantenimientos_criticos_ok || false,
            planos_estado: latestSnapshot.meta?.planos_estado,
            dscr: latestSnapshot.dscr,
            penalidad_prepago_alta: latestSnapshot.penalidad_prepago_alta ?? undefined,
            capex_rehab_estimado_eur: latestSnapshot.capex_rehab_estimado_eur,
            ahorro_energia_pct_estimado: latestSnapshot.ahorro_energia_pct_estimado,
            eur_m2_ref_p50: latestSnapshot.meta?.eur_m2_ref_p50,
            dom_dias: latestSnapshot.meta?.dom_dias,
            rehabilitationCost:
              latestBuilding?.rehabilitationCost !== undefined && latestBuilding?.rehabilitationCost !== null && latestBuilding?.rehabilitationCost !== 0
                ? latestBuilding?.rehabilitationCost
                : null,
            potentialValue:
              latestBuilding?.potentialValue !== undefined && latestBuilding?.potentialValue !== null && latestBuilding?.potentialValue !== 0
                ? latestBuilding?.potentialValue
                : null,
          });
        } else {
          console.warn('⚠️ No se encontraron snapshots después de guardar');
          setFormData(prev => ({
            ...prev,
            rehabilitationCost:
              latestBuilding?.rehabilitationCost !== undefined && latestBuilding?.rehabilitationCost !== null && latestBuilding?.rehabilitationCost !== 0
                ? latestBuilding?.rehabilitationCost
                : null,
            potentialValue:
              latestBuilding?.potentialValue !== undefined && latestBuilding?.potentialValue !== null && latestBuilding?.potentialValue !== 0
                ? latestBuilding?.potentialValue
                : null,
          }));
        }
      } finally {
        setIsLoadingData(false);
        setIsEditing(false);
        console.log('🔄 Volviendo a modo lectura (isEditing=false)');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar sección de formulario
  const renderSectionContent = () => {
    switch (activeSection) {
      case 1: // Precio & Mercado (solo datos adicionales del CFO)
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de referencia por m² (Percentil 50)
              </label>
              <p className="text-xs text-gray-500 mb-2">Mediana del precio por metro cuadrado del submercado</p>
              <input
                type="number"
                min="0"
                value={formData.eur_m2_ref_p50 || ''}
                onChange={(e) => handleInputChange('eur_m2_ref_p50', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días en Mercado (DOM)
              </label>
              <p className="text-xs text-gray-500 mb-2">Tiempo promedio de permanencia en el mercado de propiedades similares</p>
              <input
                type="number"
                min="0"
                max="1000"
                value={formData.dom_dias || ''}
                onChange={(e) => handleInputChange('dom_dias', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 2: // Ingresos (últimos 12m)
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingresos Brutos Anuales (€) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Suma de todos los ingresos del último año</p>
              <input
                type="number"
                min="0"
                value={formData.ingresos_brutos_anuales_eur || ''}
                onChange={(e) => handleInputChange('ingresos_brutos_anuales_eur', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Otros Ingresos Anuales (€)
              </label>
              <p className="text-xs text-gray-500 mb-2">Ingresos adicionales no incluidos en la categoría principal</p>
              <input
                type="number"
                min="0"
                value={formData.otros_ingresos_anuales_eur || ''}
                onChange={(e) => handleInputChange('otros_ingresos_anuales_eur', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WALT - Tiempo Promedio de Arrendamiento (meses) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Weighted Average Lease Term: Duración promedio ponderada de los contratos vigentes</p>
              <input
                type="number"
                min="0"
                value={formData.walt_meses || ''}
                onChange={(e) => handleInputChange('walt_meses', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concentración de Ingresos - Top Inquilino (%) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Porcentaje del NOI generado por el principal inquilino</p>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.concentracion_top1_pct_noi || ''}
                onChange={(e) => handleInputChange('concentracion_top1_pct_noi', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.indexacion_ok || false}
                onChange={(e) => handleInputChange('indexacion_ok', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Cláusula de Indexación Activa
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Impagos - Últimos 12 Meses (%)
              </label>
              <p className="text-xs text-gray-500 mb-2">Porcentaje de ingresos perdidos por impagos</p>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.mora_pct_12m || ''}
                onChange={(e) => handleInputChange('mora_pct_12m', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 3: // OPEX (últimos 12m)
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gastos Operativos Totales Anuales (€) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Suma de todos los gastos operativos del último año</p>
              <input
                type="number"
                min="0"
                value={formData.opex_total_anual_eur || ''}
                onChange={(e) => handleInputChange('opex_total_anual_eur', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gastos Energéticos Anuales (€) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Consumo de energía y servicios públicos</p>
              <input
                type="number"
                min="0"
                value={formData.opex_energia_anual_eur || ''}
                onChange={(e) => handleInputChange('opex_energia_anual_eur', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gastos de Mantenimiento Anuales (€)
              </label>
              <p className="text-xs text-gray-500 mb-2">Reparaciones y conservación del inmueble</p>
              <input
                type="number"
                min="0"
                value={formData.opex_mantenimiento_anual_eur || ''}
                onChange={(e) => handleInputChange('opex_mantenimiento_anual_eur', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 4: // Documentación (Semáforo)
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Libro del Edificio <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.libro_edificio_estado}
                onChange={(e) => handleInputChange('libro_edificio_estado', e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="completo">Completo</option>
                <option value="parcial">Incompleto</option>
                <option value="faltante">No disponible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspección Técnica de Edificios / Informe de Evaluación <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Estado de la ITE o IEE vigente</p>
              <select
                value={formData.ite_iee_estado}
                onChange={(e) => handleInputChange('ite_iee_estado', e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="ok">Vigente y Aprobado</option>
                <option value="pendiente">Pendiente de Renovación</option>
                <option value="no_aplica">No Aplica</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.mantenimientos_criticos_ok || false}
                onChange={(e) => handleInputChange('mantenimientos_criticos_ok', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Mantenimientos Críticos al Día <span className="text-red-500">*</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de la Documentación de Planos
              </label>
              <p className="text-xs text-gray-500 mb-2">Disponibilidad de planos técnicos</p>
              <select
                value={formData.planos_estado || ''}
                onChange={(e) => handleInputChange('planos_estado', e.target.value || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar estado...</option>
                <option value="ok">Disponible</option>
                <option value="faltante">No Disponible</option>
              </select>
            </div>
          </div>
        );

      case 5: // Deuda (si aplica)
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ratio de Cobertura del Servicio de Deuda (DSCR)
              </label>
              <p className="text-xs text-gray-500 mb-2">Ratio entre NOI y servicio de deuda (útil si aplica financiación)</p>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.dscr || ''}
                onChange={(e) => handleInputChange('dscr', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.penalidad_prepago_alta || false}
                onChange={(e) => handleInputChange('penalidad_prepago_alta', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Penalización por Amortización Anticipada Elevada
              </label>
            </div>
          </div>
        );

      case 6: // Rehabilitación (quick wins)
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inversión Estimada en Rehabilitación (€)
              </label>
              <p className="text-xs text-gray-500 mb-2">Capital estimado necesario para mejoras energéticas y estructurales</p>
              <input
                type="number"
                min="0"
                value={formData.capex_rehab_estimado_eur || ''}
                onChange={(e) => handleInputChange('capex_rehab_estimado_eur', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coste de rehabilitación del edificio (€)
              </label>
              <p className="text-xs text-gray-500 mb-2">Se reflejará en la ficha del activo para todos los roles</p>
              <input
                type="number"
                min="0"
                value={formData.rehabilitationCost ?? ''}
                onChange={(e) =>
                  handleInputChange(
                    'rehabilitationCost',
                    e.target.value === '' ? null : parseFloat(e.target.value),
                  )
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reducción Estimada de Consumo Energético (%)
              </label>
              <p className="text-xs text-gray-500 mb-2">Porcentaje de ahorro energético esperado tras rehabilitación</p>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.ahorro_energia_pct_estimado || ''}
                onChange={(e) => handleInputChange('ahorro_energia_pct_estimado', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor potencial del edificio (€)
              </label>
              <p className="text-xs text-gray-500 mb-2">Proyección posterior a la rehabilitación</p>
              <input
                type="number"
                min="0"
                value={formData.potentialValue ?? ''}
                onChange={(e) =>
                  handleInputChange('potentialValue', e.target.value === '' ? null : parseFloat(e.target.value))
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Función para formatear números
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return `${value.toFixed(2)}%`;
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoadingData) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ backgroundColor: '#fdfdfd' }}>
        <div className="text-center">
          <AppSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 text-sm font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Componente para renderizar el header del edificio
  const renderBuildingHeader = () => {
    if (!building) return null;
    
    const mainImage = building.images?.[0]?.url || `https://via.placeholder.com/400x200?text=${building.name}`;
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Imagen */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <div className="relative h-40 sm:h-40 w-full sm:w-56 overflow-hidden rounded-lg border border-gray-200 shadow-md">
              <img 
                src={mainImage} 
                alt={building.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/400x200?text=${building.name}`;
                }}
              />
            </div>
          </div>
          
          {/* Información */}
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{building.name}</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">{building.address}</p>
            
            {/* Meta compacta */}
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-3 text-xs sm:text-sm">
              {building.cadastralReference && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-500">Ref. Cat:</span>
                  <span className="font-semibold text-gray-900">{building.cadastralReference}</span>
                </div>
              )}
              
              {building.constructionYear && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-500">Año:</span>
                  <span className="font-semibold text-gray-900">{building.constructionYear}</span>
                </div>
              )}
              
              {building.numFloors && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-gray-500">Plantas:</span>
                  <span className="font-semibold text-gray-900">{building.numFloors}</span>
                </div>
              )}
              
              {building.numUnits && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-gray-500">Unidades:</span>
                  <span className="font-semibold text-gray-900">{building.numUnits}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Vista de lectura (cards con datos o vacíos) - SIEMPRE SE MUESTRA PRIMERO
  if (!isEditing) {
    console.log('📋 Renderizando vista de lectura. existingData:', existingData);
    console.log('📋 Meta data:', existingData?.meta);
    
    return (
      <div className="min-h-screen bg-gray-50 py-6 overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Header del edificio */}
          {renderBuildingHeader()}
          
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-0.5 tracking-tight">
                {t('cfo.intake.title', { defaultValue: 'Datos Financieros del Activo' })}
              </h1>
              <p className="text-xs text-gray-500">
                {t('cfo.intake.description', { defaultValue: 'Complete la información financiera y operativa del activo' })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-200"
              >
                {existingData ? (
                  <>
                    <Edit className="w-4 h-4" />
                    {t('cfo.intake.edit', { defaultValue: 'Editar' })}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {t('cfo.intake.loadData', { defaultValue: 'Cargar Datos' })}
                  </>
                )}
              </button>
              <button
                onClick={() => navigate(`/cfo-due-diligence/${buildingId}`)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                Análisis Financiero
              </button>
              <button
                onClick={() => navigate('/cfo-simulation')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                Simulación
              </button>
            </div>
          </div>

          {/* Grid principal con mejores columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Columna Izquierda */}
            <div className="space-y-6">
              {/* Ingresos - Card profesional */}
              <div className="bg-white rounded-lg border border-gray-200 shadow p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-2.5 shadow-sm">
                      <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {sections[1].name}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Ingresos Brutos Anuales</p>
                    <p className="text-2xl font-bold text-gray-900">{existingData ? formatCurrency(existingData.ingresos_brutos_anuales_eur) : <span className="text-gray-400 font-normal">-</span>}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">WALT</p>
                      <p className="text-base font-semibold text-gray-900">{existingData ? `${existingData.walt_meses} meses` : <span className="text-gray-400 font-normal">-</span>}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Conc. Top Cliente</p>
                      <p className="text-base font-semibold text-gray-900">{existingData ? formatPercent(existingData.concentracion_top1_pct_noi * 100) : <span className="text-gray-400 font-normal">-</span>}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Indexación</p>
                      <p className="text-base font-semibold text-gray-900">{existingData ? (existingData.indexacion_ok ? <span className="text-emerald-600">✓ Sí</span> : <span className="text-gray-400">No</span>) : <span className="text-gray-400 font-normal">-</span>}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Mora 12m</p>
                      <p className="text-base font-semibold text-gray-900">{existingData ? formatPercent(existingData.mora_pct_12m ? existingData.mora_pct_12m * 100 : null) : <span className="text-gray-400 font-normal">-</span>}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPEX - Card profesional */}
              <div className="bg-white rounded-lg border border-gray-200 shadow p-4 hover:shadow-md transition-all duration-200">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {sections[2].name}
                </h3>
                <div className="space-y-2.5">
                  <div className="bg-white rounded-md p-3 border" style={{ borderColor: 'rgba(91, 141, 239, 0.15)' }}>
                    <p className="text-[11px] text-gray-600 mb-1">OPEX Total Anual</p>
                    <p className="text-lg font-bold text-gray-900">{existingData ? formatCurrency(existingData.opex_total_anual_eur) : '-'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white rounded-md p-3 border" style={{ borderColor: 'rgba(91, 141, 239, 0.15)' }}>
                      <p className="text-[11px] text-gray-600 mb-1">OPEX Energía</p>
                      <p className="text-base font-semibold text-gray-900">{existingData ? formatCurrency(existingData.opex_energia_anual_eur) : '-'}</p>
                    </div>
                    <div className="bg-white rounded-md p-3 border" style={{ borderColor: 'rgba(91, 141, 239, 0.15)' }}>
                      <p className="text-[11px] text-gray-600 mb-1">OPEX Mantenimiento</p>
                      <p className="text-base font-semibold text-gray-900">{existingData ? formatCurrency(existingData.opex_mantenimiento_anual_eur) : '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
              {/* Documentación - Card moderno */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {sections[3].name}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Libro Edificio</p>
                    <p className="text-lg font-bold capitalize text-gray-900">{existingData?.meta?.libro_edificio_estado || '-'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">ITE/IEE</p>
                    <p className="text-lg font-bold text-gray-900">{existingData?.meta?.ite_iee_estado || '-'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Mant. Críticos</p>
                    <p className="text-lg font-bold text-gray-900">{existingData?.meta?.mantenimientos_criticos_ok !== undefined ? (existingData.meta.mantenimientos_criticos_ok ? '✓ OK' : '✗ Pendiente') : '-'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Planos</p>
                    <p className="text-lg font-bold text-gray-900">{existingData?.meta?.planos_estado || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Rehabilitación - Card moderno */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {sections[5].name}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">CAPEX Estimado</p>
                    <p className="text-2xl font-bold text-gray-900">{existingData?.capex_rehab_estimado_eur ? formatCurrency(existingData.capex_rehab_estimado_eur) : '-'}</p>
                  </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Coste de rehabilitación (edificio)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {building?.rehabilitationCost !== undefined &&
                    building?.rehabilitationCost !== null &&
                    building?.rehabilitationCost !== 0
                      ? formatCurrency(building.rehabilitationCost)
                      : '-'}
                  </p>
              </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Ahorro Energía Estimado</p>
                    <p className="text-2xl font-bold text-gray-900">{existingData?.ahorro_energia_pct_estimado ? formatPercent(existingData.ahorro_energia_pct_estimado) : '-'}</p>
                  </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Valor potencial (edificio)</p>
                <p className="text-2xl font-bold text-gray-900">
                    {building?.potentialValue !== undefined &&
                    building?.potentialValue !== null &&
                    building?.potentialValue !== 0
                      ? formatCurrency(building.potentialValue)
                      : '-'}
                </p>
              </div>
                </div>
              </div>

              {/* Deuda - Card moderno */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {sections[4].name}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">DSCR</p>
                    <p className="text-xl font-bold text-gray-900">{existingData?.dscr ? existingData.dscr.toFixed(2) : '-'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Penal. Prepago</p>
                    <p className="text-xl font-bold text-gray-900">{existingData?.penalidad_prepago_alta !== null && existingData?.penalidad_prepago_alta !== undefined ? (existingData.penalidad_prepago_alta ? 'Alta' : 'Normal') : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header del edificio */}
        {renderBuildingHeader()}
        
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight">
            {existingData ? t('cfo.intake.editTitle', { defaultValue: 'Editar Datos Financieros del Activo' }) : t('cfo.intake.title', { defaultValue: 'Datos Financieros del Activo' })}
          </h1>
          <p className="text-sm text-gray-500">
            {t('cfo.intake.description', { defaultValue: 'Complete la información financiera y operativa del activo' })}
          </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setActiveSection(1);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {isSubmitting ? t('cfo.intake.saving', { defaultValue: 'Guardando...' }) : t('cfo.intake.save', { defaultValue: 'Guardar' })}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('cfo.intake.progress', { defaultValue: 'Progreso' })} {activeSection} / {sections.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round((activeSection / sections.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-blue-600"
              initial={{ width: `${(activeSection / sections.length) * 100}%` }}
              animate={{ width: `${(activeSection / sections.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-4 mb-4"
          >
            <div className="space-y-4">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                {sections.find(s => s.id === activeSection)?.name}
              </p>
              
              {renderSectionContent()}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveSection(Math.max(1, activeSection - 1))}
                disabled={activeSection === 1}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {t('cfo.intake.previous', { defaultValue: 'Anterior' })}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setActiveSection(1);
                }}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                {t('cfo.intake.cancel', { defaultValue: 'Cancelar' })}
              </button>
            </div>

            {activeSection < sections.length ? (
              <button
                type="button"
                onClick={() => setActiveSection(activeSection + 1)}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                {t('cfo.intake.next', { defaultValue: 'Siguiente' })}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting 
                  ? t('cfo.intake.saving', { defaultValue: 'Guardando...' })
                  : t('cfo.intake.save', { defaultValue: 'Guardar' })
                }
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

