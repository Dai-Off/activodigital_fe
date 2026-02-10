// src/components/units/CreateUnitManual.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export interface UnitFormData {
  id?: string; // ID temporal para identificar unidades en la lista
  name: string;
  typology: string;
  area: string;
  floor?: string;
  door?: string;
  tenant?: string;
  monthlyRent?: string;
  status?: 'occupied' | 'available' | 'maintenance';
  expirationDate?: string;
}

interface CreateUnitManualProps {
  onNext: (data: UnitFormData[]) => void;
  onCancel?: () => void;
  onSaveDraft?: (data: UnitFormData[]) => void;
  initialData?: UnitFormData[];
}

const CreateUnitManual: React.FC<CreateUnitManualProps> = ({
  onNext,
  onCancel,
  onSaveDraft,
  initialData = [],
}) => {
  const { t } = useTranslation();

  const [units, setUnits] = useState<UnitFormData[]>(initialData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentUnit, setCurrentUnit] = useState<UnitFormData>({
    name: '',
    typology: '',
    area: '',
    floor: '',
    door: '',
    tenant: '',
    monthlyRent: '',
    status: 'available',
    expirationDate: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UnitFormData, string>>>({});
  const [unitErrors, setUnitErrors] = useState<Record<number, Partial<Record<keyof UnitFormData, string>>>>({});
  // Mostrar u ocultar el formulario de alta. Si venimos de Catastro con datos iniciales,
  // empezamos mostrando solo la lista de unidades para que funcione como pantalla de revisión.
  const [showForm, setShowForm] = useState(initialData.length === 0);

  const generateId = () => `unit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleInputChange = (field: keyof UnitFormData, value: string) => {
    setCurrentUnit(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateUnit = (unit: UnitFormData): Partial<Record<keyof UnitFormData, string>> => {
    const newErrors: Partial<Record<keyof UnitFormData, string>> = {};

    if (!unit.name.trim()) {
      newErrors.name = t('units.errors.nameRequired', 'El nombre o número de la unidad es obligatorio');
    }

    if (!unit.typology) {
      newErrors.typology = t('units.errors.typologyRequired', 'La tipología es obligatoria');
    }

    if (!unit.area.trim()) {
      newErrors.area = t('units.errors.areaRequired', 'La superficie es obligatoria');
    } else {
      const areaNum = parseFloat(unit.area);
      if (isNaN(areaNum) || areaNum <= 0) {
        newErrors.area = t('units.errors.areaInvalid', 'La superficie debe ser un número mayor a 0');
      }
    }

    if (unit.monthlyRent && unit.monthlyRent.trim()) {
      const rentNum = parseFloat(unit.monthlyRent);
      if (isNaN(rentNum) || rentNum < 0) {
        newErrors.monthlyRent = t('units.errors.rentInvalid', 'La renta mensual debe ser un número válido');
      }
    }

    return newErrors;
  };

  const handleAddUnit = () => {
    const validationErrors = validateUnit(currentUnit);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newUnit: UnitFormData = {
      ...currentUnit,
      id: generateId(),
    };

    setUnits(prev => [...prev, newUnit]);
    setCurrentUnit({
      name: '',
      typology: '',
      area: '',
      floor: '',
      door: '',
      tenant: '',
      monthlyRent: '',
      status: 'available',
      expirationDate: '',
    });
    setErrors({});
  };

  const handleEditUnit = (index: number) => {
    setEditingIndex(index);
    setCurrentUnit(units[index]);
    setErrors({});
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const validationErrors = validateUnit(currentUnit);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedUnits = [...units];
    updatedUnits[editingIndex] = { ...currentUnit, id: units[editingIndex].id };
    setUnits(updatedUnits);
    setEditingIndex(null);
    setCurrentUnit({
      name: '',
      typology: '',
      area: '',
      floor: '',
      door: '',
      tenant: '',
      monthlyRent: '',
      status: 'available',
      expirationDate: '',
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setCurrentUnit({
      name: '',
      typology: '',
      area: '',
      floor: '',
      door: '',
      tenant: '',
      monthlyRent: '',
      status: 'available',
      expirationDate: '',
    });
    setErrors({});
  };

  const handleDeleteUnit = (index: number) => {
    setUnits(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      handleCancelEdit();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const validateAllUnits = (): boolean => {
    const allErrors: Record<number, Partial<Record<keyof UnitFormData, string>>> = {};
    let hasErrors = false;

    units.forEach((unit, index) => {
      const unitValidationErrors = validateUnit(unit);
      if (Object.keys(unitValidationErrors).length > 0) {
        allErrors[index] = unitValidationErrors;
        hasErrors = true;
      }
    });

    setUnitErrors(allErrors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (units.length === 0) {
      setErrors({
        name: t('units.errors.atLeastOneRequired', 'Debes agregar al menos una unidad'),
      });
      return;
    }

    if (!validateAllUnits()) {
      return;
    }

    onNext(units);
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(units);
    }
  };

  const isEditing = editingIndex !== null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('units.createUnits', 'Crear Unidades')}
        </h1>
        <p className="text-gray-600">
          {t('units.completeBasicInfoMultiple', 'Agrega una o más unidades. Puedes agregar múltiples unidades a la vez.')}
        </p>
      </div>

      {/* Botón para alternar entre revisión y creación cuando ya hay unidades */}
      {units.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setShowForm(prev => !prev)}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showForm
              ? t('units.hideForm', 'Ocultar formulario')
              : t('units.showForm', 'Agregar / editar unidades manualmente')}
          </button>
        </div>
      )}

      {/* Formulario para agregar/editar unidad */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isEditing 
              ? t('units.editUnit', 'Editar Unidad')
              : t('units.addNewUnit', 'Agregar Nueva Unidad')
            }
          </h2>

          <form onSubmit={e => { e.preventDefault(); isEditing ? handleSaveEdit() : handleAddUnit(); }} className="space-y-6">
          {/* Unit name/number */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t('units.fields.name', 'Nombre o número de unidad')} *
            </label>
            <input
              id="name"
              type="text"
              value={currentUnit.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder={t('units.placeholders.name', 'Ej.: 1A, 2B, Local 1')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Typology */}
          <div>
            <label htmlFor="typology" className="block text-sm font-medium text-gray-700 mb-2">
              {t('units.fields.typology', 'Tipología')} *
            </label>
            <select
              id="typology"
              value={currentUnit.typology}
              onChange={e => handleInputChange('typology', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.typology ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">{t('units.placeholders.selectTypology', 'Selecciona una tipología')}</option>
              <option value="apartment">{t('units.options.apartment', 'Apartamento')}</option>
              <option value="local">{t('units.options.local', 'Local Comercial')}</option>
              <option value="office">{t('units.options.office', 'Oficina')}</option>
              <option value="parking">{t('units.options.parking', 'Plaza de Garaje')}</option>
              <option value="storage">{t('units.options.storage', 'Trastero')}</option>
              <option value="other">{t('units.options.other', 'Otro')}</option>
            </select>
            {errors.typology && <p className="mt-1 text-sm text-red-600">{errors.typology}</p>}
          </div>

          {/* Area, Floor, Door */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                {t('units.fields.area', 'Superficie (m²)')} *
              </label>
              <input
                id="area"
                type="number"
                value={currentUnit.area}
                onChange={e => handleInputChange('area', e.target.value)}
                placeholder="50.5"
                min={0}
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.area ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
            </div>

            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">
                {t('units.fields.floor', 'Planta')}
              </label>
              <input
                id="floor"
                type="text"
                value={currentUnit.floor}
                onChange={e => handleInputChange('floor', e.target.value)}
                placeholder={t('units.placeholders.floor', 'Ej.: 1, Bajo, Sótano')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="door" className="block text-sm font-medium text-gray-700 mb-2">
                {t('units.fields.door', 'Puerta')}
              </label>
              <input
                id="door"
                type="text"
                value={currentUnit.door}
                onChange={e => handleInputChange('door', e.target.value)}
                placeholder={t('units.placeholders.door', 'Ej.: A, 1, Izq')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tenant & Monthly Rent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tenant" className="block text-sm font-medium text-gray-700 mb-2">
                {t('units.fields.tenant', 'Inquilino')}
              </label>
              <input
                id="tenant"
                type="text"
                value={currentUnit.tenant}
                onChange={e => handleInputChange('tenant', e.target.value)}
                placeholder={t('units.placeholders.tenant', 'Nombre del inquilino')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 mb-2">
                {t('units.fields.monthlyRent', 'Renta (€)')}
              </label>
              <input
                id="monthlyRent"
                type="number"
                value={currentUnit.monthlyRent}
                onChange={e => handleInputChange('monthlyRent', e.target.value)}
                placeholder="800"
                min={0}
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.monthlyRent ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.monthlyRent && <p className="mt-1 text-sm text-red-600">{errors.monthlyRent}</p>}
            </div>
          </div>

          {/* Status & Expiration Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                {t('units.fields.status', 'Estado')}
              </label>
              <select
                id="status"
                value={currentUnit.status}
                onChange={e => handleInputChange('status', e.target.value as 'occupied' | 'available' | 'maintenance')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">{t('units.status.available', 'Disponible')}</option>
                <option value="occupied">{t('units.status.occupied', 'Ocupada')}</option>
                <option value="maintenance">{t('units.status.maintenance', 'En Mantenimiento')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                {t('units.fields.expirationDate', 'Fecha de Vencimiento')}
              </label>
              <input
                id="expirationDate"
                type="date"
                value={currentUnit.expirationDate}
                onChange={e => handleInputChange('expirationDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

            {/* Botones de acción del formulario */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {t('common.cancel', 'Cancelar')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 ml-auto"
                  >
                    <Check className="w-4 h-4" />
                    {t('common.save', 'Guardar')}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 ml-auto"
                >
                  <Plus className="w-4 h-4" />
                  {t('units.addUnit', 'Agregar Unidad')}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Lista de unidades agregadas */}
      {units.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('units.unitsList', 'Unidades Agregadas')} ({units.length})
            </h2>
          </div>

          <div className="space-y-3">
            {units.map((unit, index) => {
              const unitError = unitErrors[index];
              const hasError = unitError && Object.keys(unitError).length > 0;

              return (
                <div
                  key={unit.id || index}
                  className={`p-4 border rounded-lg ${
                    hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{unit.name || t('units.unnamed', 'Sin nombre')}</h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {unit.typology ? t(`units.options.${unit.typology}`, unit.typology) : '-'}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {unit.area ? `${unit.area} m²` : '-'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {unit.floor && (
                          <span>{t('units.fields.floor', 'Planta')}: {unit.floor}</span>
                        )}
                        {unit.door && (
                          <span className="ml-3">{t('units.fields.door', 'Puerta')}: {unit.door}</span>
                        )}
                        {unit.tenant && (
                          <div>{t('units.fields.tenant', 'Inquilino')}: {unit.tenant}</div>
                        )}
                        {unit.monthlyRent && (
                          <div>{t('units.fields.monthlyRent', 'Renta')}: €{unit.monthlyRent}</div>
                        )}
                      </div>
                      {hasError && (
                        <div className="mt-2 text-sm text-red-600">
                          {Object.values(unitError).map((error, i) => (
                            <p key={i}>{error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => handleEditUnit(index)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t('common.edit', 'Editar')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUnit(index)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('common.delete', 'Eliminar')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common.back', 'Volver')}
          </button>
        )}
        
        {onSaveDraft && (
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common.saveDraft', 'Guardar borrador')}
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={units.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('common.continue', 'Continuar')} ({units.length})
        </button>
      </div>
    </div>
  );
};

export default CreateUnitManual;
