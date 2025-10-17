import React, { useState } from 'react';
import { BuildingsApiService } from '../../services/buildingsApi';

// Import BuildingStep1Data from CreateBuildingWizard
import type { BuildingStep1Data } from './CreateBuildingWizard';

interface CreateBuildingStep1Props {
  onNext: (data: BuildingStep1Data) => void;
  onSaveDraft: (data: BuildingStep1Data) => void;
  initialData?: Partial<BuildingStep1Data>;
}

const CreateBuildingStep1: React.FC<CreateBuildingStep1Props> = ({
  onNext,
  onSaveDraft,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<BuildingStep1Data>({
    name: initialData.name || '',
    address: '', // address is not used in step 1, but required by type, so set as empty
    constructionYear: initialData.constructionYear || '',
    typology: initialData.typology || '',
    floors: initialData.floors || '',
    units: initialData.units || '',
    price: initialData.price || '',
    technicianEmail: initialData.technicianEmail || '',
    cfoEmail: initialData.cfoEmail || '',
    rehabilitationCost: initialData.rehabilitationCost || '',
    potentialValue: initialData.potentialValue || '',
    squareMeters: initialData.squareMeters || ''
  });
  // Estado para loading y error de geocodificación

  const [errors, setErrors] = useState<Partial<BuildingStep1Data>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    technician?: string;
    cfo?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BuildingStep1Data> = {};

    // Nombre obligatorio
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del edificio es obligatorio';
    }


    // Año de construcción - validar formato
    if (!formData.constructionYear) {
      newErrors.constructionYear = 'El año de construcción es obligatorio';
    } else {
      const year = parseInt(formData.constructionYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.constructionYear = `Ingresa un año válido (1800-${currentYear})`;
      }
    }

    // Tipología obligatoria
    if (!formData.typology) {
      newErrors.typology = 'Selecciona una tipología' as any;
    }

    // Número de plantas - validar que sea número positivo
    if (!formData.floors) {
      newErrors.floors = 'El número de plantas es obligatorio';
    } else {
      const floors = parseInt(formData.floors);
      if (isNaN(floors) || floors < 1 || floors > 100) {
        newErrors.floors = 'Ingresa un número válido de plantas (1-100)';
      }
    }

    // Número de unidades - validar que sea número positivo
    if (!formData.units) {
      newErrors.units = 'El número de unidades es obligatorio';
    } else {
      const units = parseInt(formData.units);
      if (isNaN(units) || units < 1 || units > 1000) {
        newErrors.units = 'Ingresa un número válido de unidades (1-1000)';
      }
    }

    // Precio - opcional pero si se proporciona debe ser válido
    if (formData.price && formData.price.trim()) {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = 'Ingresa un precio válido';
      }
    }

    // Email del técnico - opcional pero si se proporciona debe ser válido
    if (formData.technicianEmail && formData.technicianEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.technicianEmail)) {
        newErrors.technicianEmail = 'Ingresa un email válido';
      }
    }

    // Email del CFO - opcional pero si se proporciona debe ser válido
    if (formData.cfoEmail && formData.cfoEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.cfoEmail)) {
        newErrors.cfoEmail = 'Ingresa un email válido';
      }
    }

    // Coste de rehabilitación - opcional pero si se proporciona debe ser válido
    if (formData.rehabilitationCost && formData.rehabilitationCost.trim()) {
      const cost = parseFloat(formData.rehabilitationCost);
      if (isNaN(cost) || cost < 0) {
        newErrors.rehabilitationCost = 'Ingresa un coste válido';
      }
    }

    // Valor potencial - opcional pero si se proporciona debe ser válido
    if (formData.potentialValue && formData.potentialValue.trim()) {
      const value = parseFloat(formData.potentialValue);
      if (isNaN(value) || value < 0) {
        newErrors.potentialValue = 'Ingresa un valor válido';
      }
    }

    // Metros cuadrados - opcional pero si se proporciona debe ser válido
    if (formData.squareMeters && formData.squareMeters.trim()) {
      const meters = parseFloat(formData.squareMeters);
      if (isNaN(meters) || meters < 0) {
        newErrors.squareMeters = 'Ingresa una superficie válida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BuildingStep1Data, value: string) => {
    setFormData((prev: BuildingStep1Data) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev: Partial<BuildingStep1Data>) => ({ ...prev, [field]: undefined }));
    }
    // Limpiar errores de validación específicos cuando se modifican los emails
    if ((field === 'technicianEmail' && validationErrors.technician) || 
        (field === 'cfoEmail' && validationErrors.cfo)) {
      setValidationErrors(prev => ({
        ...prev,
        [field === 'technicianEmail' ? 'technician' : 'cfo']: undefined
      }));
    }
  };

  const handleNext = async () => {
    // Primero validar el formulario básico
    if (!validateForm()) {
      return;
    }

    // Si hay emails de técnico o CFO, validar con el backend
    if (formData.technicianEmail || formData.cfoEmail) {
      setIsValidating(true);
      setValidationErrors({}); // Limpiar errores previos
      
      try {
        const validationResponse = await BuildingsApiService.validateUserAssignments({
          technicianEmail: formData.technicianEmail || undefined,
          cfoEmail: formData.cfoEmail || undefined
        });

        // Verificar si hay errores de validación
        if (!validationResponse.overallValid) {
          const newValidationErrors: { technician?: string; cfo?: string } = {};
          
          if (!validationResponse.technicianValidation.isValid && validationResponse.technicianValidation.errors.technician) {
            newValidationErrors.technician = validationResponse.technicianValidation.errors.technician;
          }
          
          if (!validationResponse.cfoValidation.isValid && validationResponse.cfoValidation.errors.cfo) {
            newValidationErrors.cfo = validationResponse.cfoValidation.errors.cfo;
          }
          
          setValidationErrors(newValidationErrors);
          setIsValidating(false);
          return; // No avanzar si hay errores
        }
      } catch (error) {
        console.error('Error validando asignaciones:', error);
        // En caso de error de red, permitir continuar (validación del backend como respaldo)
        console.warn('No se pudo validar las asignaciones, continuando...');
      } finally {
        setIsValidating(false);
      }
    }

    // Si todas las validaciones pasaron, avanzar al siguiente paso
    const { address, ...rest } = formData;
    onNext({ ...rest } as BuildingStep1Data);
  };

  const handleSaveDraft = () => {
    // Para borrador, solo validamos que tenga al menos el nombre
    if (formData.name.trim()) {
      const { address, ...rest } = formData;
      onSaveDraft({ ...rest } as BuildingStep1Data);
    } else {
      setErrors({ name: 'El nombre es necesario para guardar el borrador' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Crear Edificio - Datos Generales
        </h1>
        <p className="text-gray-600">
          Completa la información básica del edificio para comenzar.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Nombre del edificio */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del edificio *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ej: Torre Central, Residencial Los Olivos..."
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>



        {/* Año de construcción */}
        <div>
          <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700 mb-2">
            Año de construcción *
          </label>
          <input
            type="number"
            id="constructionYear"
            value={formData.constructionYear}
            onChange={(e) => handleInputChange('constructionYear', e.target.value)}
            placeholder="2020"
            min="1800"
            max={new Date().getFullYear()}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.constructionYear ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.constructionYear && (
            <p className="mt-1 text-sm text-red-600">{errors.constructionYear}</p>
          )}
        </div>

        {/* Tipología */}
        <div>
          <label htmlFor="typology" className="block text-sm font-medium text-gray-700 mb-2">
            Tipología *
          </label>
          <select
            id="typology"
            value={formData.typology}
            onChange={(e) => handleInputChange('typology', e.target.value as any)}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.typology ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona una tipología</option>
            <option value="residential">Residencial</option>
            <option value="mixed">Mixto</option>
            <option value="commercial">Comercial</option>
          </select>
          {errors.typology && (
            <p className="mt-1 text-sm text-red-600">{errors.typology}</p>
          )}
        </div>

        {/* Grid para plantas y unidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Número de plantas */}
          <div>
            <label htmlFor="floors" className="block text-sm font-medium text-gray-700 mb-2">
              Número de plantas *
            </label>
            <input
              type="number"
              id="floors"
              value={formData.floors}
              onChange={(e) => handleInputChange('floors', e.target.value)}
              placeholder="5"
              min="1"
              max="100"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.floors ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.floors && (
              <p className="mt-1 text-sm text-red-600">{errors.floors}</p>
            )}
          </div>

          {/* Número de unidades */}
          <div>
            <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-2">
              Número de unidades *
            </label>
            <input
              type="number"
              id="units"
              value={formData.units}
              onChange={(e) => handleInputChange('units', e.target.value)}
              placeholder="20"
              min="1"
              max="1000"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.units ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.units && (
              <p className="mt-1 text-sm text-red-600">{errors.units}</p>
            )}
          </div>
        </div>

        {/* Grid para precio y email del técnico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Precio del activo (€)
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="250000"
              min="0"
              step="1000"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Opcional. Valor estimado del activo</p>
          </div>

          {/* Email del técnico */}
          <div>
            <label htmlFor="technicianEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email del técnico asignado
            </label>
            <input
              type="email"
              id="technicianEmail"
              value={formData.technicianEmail}
              onChange={(e) => handleInputChange('technicianEmail', e.target.value)}
              placeholder="tecnico@ejemplo.com"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.technicianEmail || validationErrors.technician ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.technicianEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.technicianEmail}</p>
            )}
            {validationErrors.technician && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.technician}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Opcional. El técnico podrá gestionar los libros digitales</p>
          </div>

          {/* Email del CFO */}
          <div>
            <label htmlFor="cfoEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email del CFO asignado
            </label>
            <input
              type="email"
              id="cfoEmail"
              value={formData.cfoEmail}
              onChange={(e) => handleInputChange('cfoEmail', e.target.value)}
              placeholder="cfo@ejemplo.com"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cfoEmail || validationErrors.cfo ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.cfoEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.cfoEmail}</p>
            )}
            {validationErrors.cfo && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.cfo}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Opcional. El CFO podrá acceder a información financiera del edificio</p>
          </div>
        </div>

        {/* Sección de datos financieros */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información Financiera
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Campos opcionales que pueden completarse más adelante según la información disponible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coste de rehabilitación */}
            <div>
              <label htmlFor="rehabilitationCost" className="block text-sm font-medium text-gray-700 mb-2">
                Coste de Rehabilitación (€)
              </label>
              <input
                type="number"
                id="rehabilitationCost"
                value={formData.rehabilitationCost}
                onChange={(e) => handleInputChange('rehabilitationCost', e.target.value)}
                placeholder="125000"
                min="0"
                step="1000"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.rehabilitationCost ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.rehabilitationCost && (
                <p className="mt-1 text-sm text-red-600">{errors.rehabilitationCost}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Opcional. Coste estimado para rehabilitar el edificio</p>
            </div>

            {/* Valor potencial */}
            <div>
              <label htmlFor="potentialValue" className="block text-sm font-medium text-gray-700 mb-2">
                Valor Potencial (€)
              </label>
              <input
                type="number"
                id="potentialValue"
                value={formData.potentialValue}
                onChange={(e) => handleInputChange('potentialValue', e.target.value)}
                placeholder="950000"
                min="0"
                step="1000"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.potentialValue ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.potentialValue && (
                <p className="mt-1 text-sm text-red-600">{errors.potentialValue}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Opcional. Valor estimado tras rehabilitación o mejoras</p>
            </div>

            {/* Metros cuadrados */}
            <div>
              <label htmlFor="squareMeters" className="block text-sm font-medium text-gray-700 mb-2">
                Superficie (m²)
              </label>
              <input
                type="number"
                id="squareMeters"
                value={formData.squareMeters}
                onChange={(e) => handleInputChange('squareMeters', e.target.value)}
                placeholder="500.50"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.squareMeters ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.squareMeters && (
                <p className="mt-1 text-sm text-red-600">{errors.squareMeters}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Opcional. Superficie total del edificio en metros cuadrados</p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isValidating}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isValidating && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isValidating ? 'Validando...' : 'Siguiente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBuildingStep1;