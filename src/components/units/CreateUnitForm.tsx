// src/components/units/CreateUnitForm.tsx
// Formulario simple para crear unidades manualmente

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import { UnitsApiService } from '../../services/unitsApi';
import { useToast } from '../../contexts/ToastContext';

const CreateUnitForm: React.FC = () => {
  const { id: buildingId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    floor: '',
    areaM2: '',
    useType: '',
    status: 'available',
    rooms: '',
    baths: '',
    rent: '',
    tenant: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buildingId) {
      showError('Error', 'No se pudo identificar el edificio');
      return;
    }

    if (!formData.name.trim()) {
      showError('Error', 'El nombre de la unidad es obligatorio');
      return;
    }

    setIsSubmitting(true);

    try {
      const unitPayload = {
        name: formData.name.trim(),
        identifier: formData.identifier.trim() || null,
        floor: formData.floor.trim() || null,
        areaM2: formData.areaM2 ? parseFloat(formData.areaM2) : null,
        useType: formData.useType.trim() || null,
        status: formData.status,
        rooms: formData.rooms ? parseInt(formData.rooms, 10) : null,
        baths: formData.baths ? parseInt(formData.baths, 10) : null,
        rent: formData.rent ? parseFloat(formData.rent) : null,
        tenant: formData.tenant.trim() || null,
      };

      await UnitsApiService.upsertUnits(buildingId, [unitPayload]);

      showSuccess(
        'Unidad creada',
        'La unidad se ha creado correctamente'
      );

      navigate(`/building/${buildingId}/unidades`);
    } catch (error: any) {
      showError(
        'Error al crear unidad',
        error?.message || 'No se pudo crear la unidad. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button
                onClick={() => navigate(`/building/${buildingId}/unidades`)}
                className="hover:text-blue-600 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Unidades
              </button>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-900 font-medium">Crear Unidad</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Crear Nueva Unidad
          </h1>
          <p className="text-gray-600">
            Completa la información de la unidad que deseas agregar al edificio
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Información básica */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la unidad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Piso 1º A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                    Identificador
                  </label>
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Ej: 01-A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                    Planta
                  </label>
                  <input
                    type="text"
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="Ej: 01, PB, -1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="areaM2" className="block text-sm font-medium text-gray-700 mb-1">
                    Superficie (m²)
                  </label>
                  <input
                    type="number"
                    id="areaM2"
                    name="areaM2"
                    value={formData.areaM2}
                    onChange={handleChange}
                    placeholder="Ej: 85.5"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="useType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de uso
                  </label>
                  <input
                    type="text"
                    id="useType"
                    name="useType"
                    value={formData.useType}
                    onChange={handleChange}
                    placeholder="Ej: Vivienda, Local, Oficina"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Características */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Características
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Habitaciones
                  </label>
                  <input
                    type="number"
                    id="rooms"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    placeholder="Ej: 3"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="baths" className="block text-sm font-medium text-gray-700 mb-1">
                    Baños
                  </label>
                  <input
                    type="number"
                    id="baths"
                    name="baths"
                    value={formData.baths}
                    onChange={handleChange}
                    placeholder="Ej: 2"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="available">Disponible</option>
                    <option value="rented">Alquilada</option>
                    <option value="sold">Vendida</option>
                    <option value="maintenance">En mantenimiento</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información de alquiler */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Alquiler (opcional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rent" className="block text-sm font-medium text-gray-700 mb-1">
                    Renta mensual (€)
                  </label>
                  <input
                    type="number"
                    id="rent"
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                    placeholder="Ej: 850"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="tenant" className="block text-sm font-medium text-gray-700 mb-1">
                    Inquilino
                  </label>
                  <input
                    type="text"
                    id="tenant"
                    name="tenant"
                    value={formData.tenant}
                    onChange={handleChange}
                    placeholder="Nombre del inquilino"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/building/${buildingId}/unidades`)}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Crear Unidad
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUnitForm;

