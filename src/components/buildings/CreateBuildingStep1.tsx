// src/components/buildings/CreateBuildingStep1.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BuildingsApiService } from '../../services/buildingsApi';

// Type from the wizard
import type { BuildingStep1Data } from './CreateBuildingWizard';

interface CreateBuildingStep1Props {
  onNext: (data: BuildingStep1Data) => void;
  onSaveDraft: (data: BuildingStep1Data) => void;
  initialData?: Partial<BuildingStep1Data>;
}

const CreateBuildingStep1: React.FC<CreateBuildingStep1Props> = ({
  onNext,
  onSaveDraft,
  initialData = {},
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<BuildingStep1Data>({
    name: initialData.name || '',
    address: '', // not used in step 1
    constructionYear: initialData.constructionYear || '',
    typology: initialData.typology || '',
    floors: initialData.floors || '',
    units: initialData.units || '',
    price: initialData.price || '',
    technicianEmail: initialData.technicianEmail || '',
    cfoEmail: initialData.cfoEmail || '',
    propietarioEmail: initialData.propietarioEmail || '',
    rehabilitationCost: initialData.rehabilitationCost || '',
    potentialValue: initialData.potentialValue || '',
    squareMeters: initialData.squareMeters || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BuildingStep1Data, string>>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ technician?: string; cfo?: string; propietario?: string }>(
    {}
  );

  // ---------- Local validation ----------
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BuildingStep1Data, string>> = {};
    const currentYear = new Date().getFullYear();

    if (!formData.name.trim()) {
      newErrors.name = t('buildings.validation.nameRequired', 'El nombre del edificio es obligatorio');
    }

    if (!formData.constructionYear) {
      newErrors.constructionYear = t(
        'buildings.validation.constructionYearRequired',
        'El año de construcción es obligatorio'
      );
    } else {
      const year = Number.parseInt(formData.constructionYear, 10);
      if (Number.isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.constructionYear = t(
          'buildings.validation.validYear',
          'Ingresa un año válido (1800-{{currentYear}})',
          { currentYear }
        );
      }
    }

    if (!formData.typology) {
      newErrors.typology = t('buildings.validation.typologyRequired', 'Selecciona una tipología');
    }

    if (!formData.floors) {
      newErrors.floors = t('buildings.validation.floorsRequired', 'El número de plantas es obligatorio');
    } else {
      const floors = Number.parseInt(formData.floors, 10);
      if (Number.isNaN(floors) || floors < 1 || floors > 100) {
        newErrors.floors = t(
          'buildings.validation.validFloors',
          'Ingresa un número válido de plantas (1-100)'
        );
      }
    }

    if (!formData.units) {
      newErrors.units = t('buildings.validation.unitsRequired', 'El número de unidades es obligatorio');
    } else {
      const units = Number.parseInt(formData.units, 10);
      if (Number.isNaN(units) || units < 1 || units > 1000) {
        newErrors.units = t(
          'buildings.validation.validUnits',
          'Ingresa un número válido de unidades (1-1000)'
        );
      }
    }

    if (formData.price?.trim()) {
      const price = Number.parseFloat(formData.price);
      if (Number.isNaN(price) || price < 0) {
        newErrors.price = t('buildings.validation.validPrice', 'Ingresa un precio válido');
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.technicianEmail?.trim() && !emailRegex.test(formData.technicianEmail)) {
      newErrors.technicianEmail = t('common.validation.email', 'Ingresa un correo válido');
    }

    if (formData.cfoEmail?.trim() && !emailRegex.test(formData.cfoEmail)) {
      newErrors.cfoEmail = t('common.validation.email', 'Ingresa un correo válido');
    }

    if (formData.propietarioEmail?.trim() && !emailRegex.test(formData.propietarioEmail)) {
      newErrors.propietarioEmail = t('common.validation.email', 'Ingresa un correo válido');
    }

    if (formData.rehabilitationCost?.trim()) {
      const v = Number.parseFloat(formData.rehabilitationCost);
      if (Number.isNaN(v) || v < 0) {
        newErrors.rehabilitationCost = t('buildings.validation.validCost', 'Costo inválido');
      }
    }

    if (formData.potentialValue?.trim()) {
      const v = Number.parseFloat(formData.potentialValue);
      if (Number.isNaN(v) || v < 0) {
        newErrors.potentialValue = t('buildings.validation.validValue', 'Valor inválido');
      }
    }

    if (formData.squareMeters?.trim()) {
      const v = Number.parseFloat(formData.squareMeters);
      if (Number.isNaN(v) || v < 0) {
        newErrors.squareMeters = t('buildings.validation.validSurface', 'Superficie inválida');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Handlers ----------
  const handleInputChange = (field: keyof BuildingStep1Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if ((field === 'technicianEmail' && validationErrors.technician) ||
        (field === 'cfoEmail' && validationErrors.cfo) ||
        (field === 'propietarioEmail' && validationErrors.propietario)) {
      setValidationErrors(prev => ({
        ...prev,
        [field === 'technicianEmail' ? 'technician' : 
         field === 'cfoEmail' ? 'cfo' : 'propietario']: undefined,
      }));
    }
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    if (formData.technicianEmail || formData.cfoEmail || formData.propietarioEmail) {
      setIsValidating(true);
      setValidationErrors({});

      try {
        const res = await BuildingsApiService.validateUserAssignments({
          technicianEmail: formData.technicianEmail || undefined,
          cfoEmail: formData.cfoEmail || undefined,
          propietarioEmail: formData.propietarioEmail || undefined,
        });

        if (!res.overallValid) {
          const newValErrs: { technician?: string; cfo?: string; propietario?: string } = {};
          if (!res.technicianValidation.isValid && res.technicianValidation.errors.technician) {
            newValErrs.technician = res.technicianValidation.errors.technician;
          }
          if (!res.cfoValidation.isValid && res.cfoValidation.errors.cfo) {
            newValErrs.cfo = res.cfoValidation.errors.cfo;
          }
          if (!res.propietarioValidation?.isValid && res.propietarioValidation?.errors.propietario) {
            newValErrs.propietario = res.propietarioValidation.errors.propietario;
          }
          setValidationErrors(newValErrs);
          setIsValidating(false);
          return;
        }
      } catch {
        // If network/backend validation fails, allow moving forward — server will re-validate.
      } finally {
        setIsValidating(false);
      }
    }

    const { address, ...rest } = formData;
    onNext({ ...rest } as BuildingStep1Data);
  };

  const handleSaveDraft = () => {
    if (formData.name.trim()) {
      const { address, ...rest } = formData;
      onSaveDraft({ ...rest } as BuildingStep1Data);
    } else {
      setErrors({ name: t('buildings.validation.draftNameRequired', 'El borrador requiere un nombre') });
    }
  };

  // ---------- JSX ----------
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('buildings.createBuilding', 'Crear Edificio')}
        </h1>
        <p className="text-gray-600">
          {t('buildings.completeBasicInfo', 'Completa la información básica para continuar')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        {/* Building name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('buildings.fields.name', 'Nombre del edificio')} *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder={t('buildings.placeholders.name', 'Ej.: Torre Central')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Construction year */}
        <div>
          <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700 mb-2">
            {t('buildings.fields.constructionYear', 'Año de construcción')} *
          </label>
          <input
            id="constructionYear"
            type="number"
            value={formData.constructionYear}
            onChange={e => handleInputChange('constructionYear', e.target.value)}
            placeholder={`${currentYear}`}
            min={1800}
            max={currentYear}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.constructionYear ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.constructionYear && (
            <p className="mt-1 text-sm text-red-600">{errors.constructionYear}</p>
          )}
        </div>

        {/* Typology */}
        <div>
          <label htmlFor="typology" className="block text-sm font-medium text-gray-700 mb-2">
            {t('buildings.fields.typology', 'Tipología')} *
          </label>
          <select
            id="typology"
            value={formData.typology}
            onChange={e => {
              const value = e.target.value as '' | 'residential' | 'mixed' | 'commercial';
              handleInputChange('typology', value);
            }}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.typology ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">{t('buildings.placeholders.selectTypology', 'Selecciona una tipología')}</option>
            <option value="residential">{t('digitalbook.options.residential', 'Residencial')}</option>
            <option value="mixed">{t('digitalbook.options.mixed', 'Mixto')}</option>
            <option value="commercial">{t('digitalbook.options.commercial', 'Comercial')}</option>
          </select>
          {errors.typology && <p className="mt-1 text-sm text-red-600">{errors.typology}</p>}
        </div>

        {/* Floors & Units */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="floors" className="block text-sm font-medium text-gray-700 mb-2">
              {t('buildings.fields.numFloors', 'Número de plantas')} *
            </label>
            <input
              id="floors"
              type="number"
              value={formData.floors}
              onChange={e => handleInputChange('floors', e.target.value)}
              placeholder="5"
              min={1}
              max={100}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.floors ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.floors && <p className="mt-1 text-sm text-red-600">{errors.floors}</p>}
          </div>

          <div>
            <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-2">
              {t('buildings.fields.numUnits', 'Número de unidades')} *
            </label>
            <input
              id="units"
              type="number"
              value={formData.units}
              onChange={e => handleInputChange('units', e.target.value)}
              placeholder="20"
              min={1}
              max={1000}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.units ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.units && <p className="mt-1 text-sm text-red-600">{errors.units}</p>}
          </div>
        </div>

        {/* Price & Surface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              {t('buildings.fields.assetPrice', 'Precio del activo')}
            </label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={e => handleInputChange('price', e.target.value)}
              placeholder={t('buildings.placeholders.price', '250000')}
              min={0}
              step="1000"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {t('buildings.helpers.assetPrice', 'Opcional. Solo informativo para análisis financiero.')}
            </p>
          </div>

          <div>
            <label htmlFor="squareMeters" className="block text-sm font-medium text-gray-700 mb-2">
              {t('buildings.fields.surface', 'Superficie (m²)')}
            </label>
            <input
              id="squareMeters"
              type="number"
              value={formData.squareMeters}
              onChange={e => handleInputChange('squareMeters', e.target.value)}
              placeholder={t('buildings.placeholders.surface', '500.50')}
              min={0}
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.squareMeters ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.squareMeters && <p className="mt-1 text-sm text-red-600">{errors.squareMeters}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {t('buildings.helpers.surface', 'Opcional. Superficie total del edificio.')}
            </p>
          </div>

          {/* Technician email */}
          <div>
            <label htmlFor="technicianEmail" className="block text-sm font-medium text-gray-700 mb-2">
              {t('buildings.fields.technicianEmail', 'Email del técnico')}
            </label>
            <input
              id="technicianEmail"
              type="email"
              value={formData.technicianEmail}
              onChange={e => handleInputChange('technicianEmail', e.target.value)}
              placeholder={t('buildings.placeholders.technicianEmail', 'tecnico@ejemplo.com')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.technicianEmail || validationErrors.technician ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors.technicianEmail || validationErrors.technician) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.technicianEmail || validationErrors.technician}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {t('buildings.helpers.technicianEmail', 'Opcional. Asignará el rol de Técnico al usuario.')}
            </p>
          </div>

          {/* CFO email */}
          <div>
            <label htmlFor="cfoEmail" className="block text-sm font-medium text-gray-700 mb-2">
              {t('buildings.fields.cfoEmail', 'Email del CFO')}
            </label>
            <input
              id="cfoEmail"
              type="email"
              value={formData.cfoEmail}
              onChange={e => handleInputChange('cfoEmail', e.target.value)}
              placeholder={t('buildings.placeholders.cfoEmail', 'cfo@ejemplo.com')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cfoEmail || validationErrors.cfo ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors.cfoEmail || validationErrors.cfo) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cfoEmail || validationErrors.cfo}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {t('buildings.helpers.cfoEmail', 'Opcional. Asignará el rol de CFO al usuario.')}
            </p>
          </div>

          {/* Propietario email */}
          <div>
            <label htmlFor="propietarioEmail" className="block text-sm font-medium text-gray-700 mb-2">
              {t('buildings.fields.propietarioEmail', 'Email del propietario')}
            </label>
            <input
              id="propietarioEmail"
              type="email"
              value={formData.propietarioEmail}
              onChange={e => handleInputChange('propietarioEmail', e.target.value)}
              placeholder={t('buildings.placeholders.propietarioEmail', 'propietario@ejemplo.com')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.propietarioEmail || validationErrors.propietario ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors.propietarioEmail || validationErrors.propietario) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.propietarioEmail || validationErrors.propietario}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {t('buildings.helpers.propietarioEmail', 'Opcional. Asignará el rol de Propietario al usuario.')}
            </p>
          </div>
        </div>

        {/* Financial section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('buildings.sections.financialInfo', 'Información financiera')}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {t(
              'buildings.sections.financialInfoDesc',
              'Estos datos ayudan a estimar el ROI y el valor potencial. Son opcionales.'
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="rehabilitationCost" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildings.fields.rehabilitationCost', 'Coste de rehabilitación')}
              </label>
              <input
                id="rehabilitationCost"
                type="number"
                value={formData.rehabilitationCost}
                onChange={e => handleInputChange('rehabilitationCost', e.target.value)}
                placeholder={t('buildings.placeholders.rehabilitationCost', '125000')}
                min={0}
                step="1000"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.rehabilitationCost ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.rehabilitationCost && (
                <p className="mt-1 text-sm text-red-600">{errors.rehabilitationCost}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {t('buildings.helpers.rehabilitationCost', 'Estimado de inversión en mejoras.')}
              </p>
            </div>

            <div>
              <label htmlFor="potentialValue" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildings.fields.potentialValue', 'Valor potencial')}
              </label>
              <input
                id="potentialValue"
                type="number"
                value={formData.potentialValue}
                onChange={e => handleInputChange('potentialValue', e.target.value)}
                placeholder={t('buildings.placeholders.potentialValue', '950000')}
                min={0}
                step="1000"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.potentialValue ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.potentialValue && (
                <p className="mt-1 text-sm text-red-600">{errors.potentialValue}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {t('buildings.helpers.potentialValue', 'Valor estimado después de rehabilitar.')}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('common.saveDraft', 'Guardar borrador')}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isValidating}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isValidating && (
              <span
                aria-hidden="true"
                className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            )}
            {isValidating ? t('common.validating', 'Validando...') : t('common.next', 'Siguiente')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBuildingStep1;
