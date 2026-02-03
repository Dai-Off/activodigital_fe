// src/components/buildings/CreateBuildingStep1.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BuildingsApiService } from '../../services/buildingsApi';

// Type from the wizard
import type { BuildingStep1Data } from './CreateBuildingWizard';

interface CreateBuildingStep1Props {
  onNext: (data: BuildingStep1Data) => void;
  onCancel?: () => void;
  onSaveDraft: (data: BuildingStep1Data) => void;
  initialData?: Partial<BuildingStep1Data>;
}

const CreateBuildingStep1: React.FC<CreateBuildingStep1Props> = ({
  onNext,
  onCancel,
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
      newErrors.name = t('nameRequired');
    }

    if (!formData.constructionYear) {
      newErrors.constructionYear = t('constructionYearRequired');
    } else {
      const year = Number.parseInt(formData.constructionYear, 10);
      if (Number.isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.constructionYear = t(
          'validYear',
          { currentYear }
        );
      }
    }

    if (!formData.typology) {
      newErrors.typology = t('typologyRequired');
    }

    if (!formData.floors) {
      newErrors.floors = t('floorsRequired');
    } else {
      const floors = Number.parseInt(formData.floors, 10);
      if (Number.isNaN(floors) || floors < 1 || floors > 100) {
        newErrors.floors = t('validFloors');
      }
    }


    if (formData.price?.trim()) {
      const price = Number.parseFloat(formData.price);
      if (Number.isNaN(price) || price < 0) {
        newErrors.price = t('validPrice');
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.technicianEmail?.trim() && !emailRegex.test(formData.technicianEmail)) {
      newErrors.technicianEmail = t('email');
    }

    if (formData.cfoEmail?.trim() && !emailRegex.test(formData.cfoEmail)) {
      newErrors.cfoEmail = t('email');
    }

    if (formData.propietarioEmail?.trim() && !emailRegex.test(formData.propietarioEmail)) {
      newErrors.propietarioEmail = t('email');
    }

    if (formData.squareMeters?.trim()) {
      const v = Number.parseFloat(formData.squareMeters);
      if (Number.isNaN(v) || v < 0) {
        newErrors.squareMeters = t('validSurface');
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
      setErrors({ name: t('draftNameRequired') });
    }
  };

  // ---------- JSX ----------
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('createBuilding')}
        </h1>
        <p className="text-gray-600">
          {t('completeBasicInfo')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        {/* Building name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('buildingName')}
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder={t('buildingNamePlaceholder')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Cadastral Reference */}
        <div>
          <label htmlFor="cadastralReference" className="block text-sm font-medium text-gray-700 mb-2">
            {t('catastralReference')}
          </label>
          <input
            id="cadastralReference"
            type="text"
            value={formData.cadastralReference || ''}
            onChange={e => handleInputChange('cadastralReference', e.target.value)}
            placeholder={t('catastralReferencePlaceholder')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.cadastralReference ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.cadastralReference && (
            <p className="mt-1 text-sm text-red-600">{errors.cadastralReference}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {t('catastralReferenceHelper')}
          </p>
        </div>

        {/* Construction year */}
        <div>
          <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700 mb-2">
            {t('constructionYear')}
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
            {t('typology')}
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
            <option value="">{t('selectTypology')}</option>
            <option value="residential">{t('residential')}</option>
            <option value="mixed">{t('mixed')}</option>
            <option value="commercial">{t('commercial')}</option>
          </select>
          {errors.typology && <p className="mt-1 text-sm text-red-600">{errors.typology}</p>}
        </div>

        {/* Floors */}
        <div>
          <label htmlFor="floors" className="block text-sm font-medium text-gray-700 mb-2">
            {t('numFloors')}
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

        {/* Price & Surface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              {t('assetPrice')}
            </label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={e => handleInputChange('price', e.target.value)}
              placeholder={t('pricePlaceholder')}
              min={0}
              step="1000"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {t('assetPriceHelper')}
            </p>
          </div>

          <div>
            <label htmlFor="squareMeters" className="block text-sm font-medium text-gray-700 mb-2">
              {t('surface')}
            </label>
            <input
              id="squareMeters"
              type="number"
              value={formData.squareMeters}
              onChange={e => handleInputChange('squareMeters', e.target.value)}
              placeholder={t('surfacePlaceholder')}
              min={0}
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.squareMeters ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.squareMeters && <p className="mt-1 text-sm text-red-600">{errors.squareMeters}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {t('surfaceHelper')}
            </p>
          </div>

          {/* Technician email */}
          <div>
            <label htmlFor="technicianEmail" className="block text-sm font-medium text-gray-700 mb-2">
              {t('technicianEmail')}
            </label>
            <input
              id="technicianEmail"
              type="email"
              value={formData.technicianEmail}
              onChange={e => handleInputChange('technicianEmail', e.target.value)}
              placeholder={t('technicianEmailPlaceholder')}
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
              {t('technicianEmailHelper')}
            </p>
          </div>

          {/* CFO email */}
          <div>
            <label htmlFor="cfoEmail" className="block text-sm font-medium text-gray-700 mb-2">
              {t('cfoEmail')}
            </label>
            <input
              id="cfoEmail"
              type="email"
              value={formData.cfoEmail}
              onChange={e => handleInputChange('cfoEmail', e.target.value)}
              placeholder={t('cfoEmailPlaceholder')}
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
              {t('cfoEmailHelper')}
            </p>
          </div>

          {/* Propietario email */}
          <div>
            <label htmlFor="propietarioEmail" className="block text-sm font-medium text-gray-700 mb-2">
              {t('propietarioEmail')}
            </label>
            <input
              id="propietarioEmail"
              type="email"
              value={formData.propietarioEmail}
              onChange={e => handleInputChange('propietarioEmail', e.target.value)}
              placeholder={t('propietarioEmailPlaceholder')}
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
              {t('propietarioEmailHelper')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('back')}
            </button>
          )}
          
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('saveDraft')}
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
            {isValidating ? t('validating') : t('next')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBuildingStep1;
