import React, { useState } from 'react';

interface BuildingFormData {
  name: string;
  address: string;
  cadastralReference: string;
  constructionYear: string;
  typology: 'residential' | 'mixed' | 'commercial' | '';
  floors: string;
  units: string;
  price: string;
  technicianEmail: string;
}

interface CreateBuildingStep1Props {
  onNext: (data: BuildingFormData) => void;
  onSaveDraft: (data: BuildingFormData) => void;
  initialData?: Partial<BuildingFormData>;
}

const CreateBuildingStep1: React.FC<CreateBuildingStep1Props> = ({
  onNext,
  onSaveDraft,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<BuildingFormData>({
    name: initialData.name || '',
    address: initialData.address || '',
    cadastralReference: initialData.cadastralReference || '',
    constructionYear: initialData.constructionYear || '',
    typology: initialData.typology || '',
    floors: initialData.floors || '',
    units: initialData.units || '',
    price: initialData.price || '',
    technicianEmail: initialData.technicianEmail || '',
  });

  const [errors, setErrors] = useState<Partial<BuildingFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BuildingFormData> = {};

    // Nombre obligatorio
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del edificio es obligatorio';
    }

    // Dirección obligatoria
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
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

    // Precio obligatorio y debe ser número positivo
    if (!formData.price) {
      newErrors.price = 'El precio es obligatorio';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Ingresa un precio válido (mayor a 0)';
      }
    }

    // Email del técnico obligatorio y formato básico
    if (!formData.technicianEmail) {
      newErrors.technicianEmail = 'El email del técnico es obligatorio';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.technicianEmail)) {
      newErrors.technicianEmail = 'Ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BuildingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleSaveDraft = () => {
    // Para borrador, solo validamos que tenga al menos el nombre
    if (formData.name.trim()) {
      onSaveDraft(formData);
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

        {/* Dirección */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Dirección / Referencia catastral *
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Dirección completa, referencias catastrales o ubicación..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.address ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Año de construcción */}
        <div>

          {/* Referencia Catastral (opcional) */}
          <div>
            <label htmlFor="cadastralReference" className="block text-sm font-medium text-gray-700 mb-2">
              Referencia catastral (opcional)
            </label>
            <input
              type="text"
              id="cadastralReference"
              value={formData.cadastralReference}
              onChange={(e) => handleInputChange('cadastralReference', e.target.value)}
              placeholder="Ej: 1234567890"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            />
          </div>
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
        {/* Precio */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Precio del edificio (€) *
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="250000"
            min="1"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Email del técnico */}
        <div>
          <label htmlFor="technicianEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email del técnico asignado *
          </label>
          <input
            type="email"
            id="technicianEmail"
            value={formData.technicianEmail}
            onChange={(e) => handleInputChange('technicianEmail', e.target.value)}
            placeholder="tecnico@ejemplo.com"
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.technicianEmail ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.technicianEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.technicianEmail}</p>
          )}
        </div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBuildingStep1;