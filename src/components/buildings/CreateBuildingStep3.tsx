import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BuildingSummaryData {
  // Datos generales
  name: string;
  address: string;
  constructionYear: string;
  typology: 'residential' | 'mixed' | 'commercial';
  floors: string;
  units: string;
  price: string;
  technicianEmail: string;
  // Ubicación y fotos
  latitude: number;
  longitude: number;
  photos: File[];
  mainPhotoIndex: number;
}

interface CreateBuildingStep3Props {
  buildingData: BuildingSummaryData;
  onEditData: () => void;
  onEditLocation: () => void;
  onGoToDigitalBook: () => void;
  onSaveFinal: () => void;
}

const CreateBuildingStep3: React.FC<CreateBuildingStep3Props> = ({
  buildingData,
  onEditData,
  onEditLocation,
  onGoToDigitalBook,
  onSaveFinal
}) => {
  const mainPhoto = buildingData.photos[buildingData.mainPhotoIndex];
  const mainPhotoUrl = mainPhoto ? URL.createObjectURL(mainPhoto) : null;

  const getTypologyLabel = (typology: string) => {
    const labels = {
      'residential': 'Residencial',
      'mixed': 'Mixto',
      'commercial': 'Comercial'
    };
    return labels[typology as keyof typeof labels] || typology;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Resumen del Edificio
        </h1>
        <p className="text-gray-600">
          Revisa toda la información antes de proceder al Libro Digital.
        </p>
      </div>

      {/* Card principal con toda la información */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header de la card con foto principal */}
        {mainPhotoUrl && (
          <div className="relative h-64 bg-gray-200">
            <img
              src={mainPhotoUrl}
              alt={`Foto principal de ${buildingData.name}`}
              className="w-full h-full object-cover"
              onLoad={() => URL.revokeObjectURL(mainPhotoUrl)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {buildingData.name}
                </h2>
                <p className="text-gray-200">
                  {buildingData.address}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Sección de datos generales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Panel izquierdo: Información del edificio */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Información General
                </h3>
                <button
                  onClick={onEditData}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Editar datos
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Nombre:</span>
                  <span className="text-sm text-gray-900">{buildingData.name}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Año construcción:</span>
                  <span className="text-sm text-gray-900">{buildingData.constructionYear}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Tipología:</span>
                  <span className="text-sm text-gray-900">{getTypologyLabel(buildingData.typology)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Plantas:</span>
                  <span className="text-sm text-gray-900">{buildingData.floors}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Unidades:</span>
                  <span className="text-sm text-gray-900">{buildingData.units}</span>
                </div>
                
                <div className="py-2">
                  <span className="text-sm font-medium text-gray-600 block mb-2">Dirección:</span>
                  <p className="text-sm text-gray-900">{buildingData.address}</p>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Precio:</span>
                  <span className="text-sm text-gray-900">{Number(buildingData.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Email del técnico:</span>
                  <span className="text-sm text-gray-900">{buildingData.technicianEmail}</span>
                </div>
              </div>
            </div>

            {/* Panel derecho: Mapa */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ubicación
                </h3>
                <button
                  onClick={onEditLocation}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Editar ubicación
                </button>
              </div>

              {/* Mini mapa */}
              <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                <MapContainer
                  center={[buildingData.latitude, buildingData.longitude]}
                  zoom={16}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  dragging={false}
                  touchZoom={false}
                  doubleClickZoom={false}
                  scrollWheelZoom={false}
                  boxZoom={false}
                  keyboard={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[buildingData.latitude, buildingData.longitude]} />
                </MapContainer>
              </div>

              {/* Coordenadas */}
              <div className="mt-2 text-sm text-gray-500">
                <p>Lat: {buildingData.latitude.toFixed(6)}</p>
                <p>Lng: {buildingData.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>

          {/* Sección de fotos adicionales */}
          {buildingData.photos.length > 1 && (
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Fotos adicionales ({buildingData.photos.length - 1})
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {buildingData.photos.map((photo, index) => {
                  // Saltar la foto principal
                  if (index === buildingData.mainPhotoIndex) return null;
                  
                  const photoUrl = URL.createObjectURL(photo);
                  
                  return (
                    <div key={index} className="relative group">
                      <img
                        src={photoUrl}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        onLoad={() => URL.revokeObjectURL(photoUrl)}
                      />
                      
                      {/* Overlay con información */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {photo.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Estado del edificio */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Edificio creado exitosamente
                </h3>
                <p className="text-green-600">
                  Todos los datos han sido registrados correctamente.
                </p>
              </div>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">
              ¿Qué sigue ahora?
            </h4>
            <p className="text-sm text-blue-800 mb-3">
              Para completar la gestión del edificio, necesitas crear el Libro Digital 
              con información técnica detallada, certificados, mantenimiento y más.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>El Libro Digital consta de 8 secciones que puedes completar manualmente o importar desde PDF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          onClick={onSaveFinal}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Finalizar más tarde
        </button>
        
        <button
          onClick={onGoToDigitalBook}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto flex items-center gap-2"
        >
          <span>Ir al Libro Digital</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CreateBuildingStep3;