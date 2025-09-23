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
  cfoEmail: string;
  
  // Campos financieros
  rehabilitationCost: string; // Coste de rehabilitación
  potentialValue: string;     // Valor potencial
  
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
  onSaveFinal: () => void;
}

const CreateBuildingStep3: React.FC<CreateBuildingStep3Props> = ({
  buildingData,
  onEditData,
  onEditLocation,
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
          Resumen del Activo
        </h1>
        <p className="text-gray-600">
          Revisa toda la información antes de crear el activo.
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
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Precio:</span>
                  <span className="text-sm text-gray-900">
                    {buildingData.price ? `€${parseInt(buildingData.price).toLocaleString('es-ES')}` : 'No especificado'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Técnico asignado:</span>
                  <span className="text-sm text-gray-900">
                    {buildingData.technicianEmail || 'Sin asignar'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">CFO asignado:</span>
                  <span className="text-sm text-gray-900">
                    {buildingData.cfoEmail || 'Sin asignar'}
                  </span>
                </div>
                
                {/* Campos financieros */}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Coste rehabilitación:</span>
                  <span className="text-sm text-gray-900">
                    {buildingData.rehabilitationCost ? `€${parseInt(buildingData.rehabilitationCost).toLocaleString('es-ES')}` : 'No especificado'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Valor potencial:</span>
                  <span className="text-sm text-gray-900">
                    {buildingData.potentialValue ? `€${parseInt(buildingData.potentialValue).toLocaleString('es-ES')}` : 'No especificado'}
                  </span>
                </div>
                
                <div className="py-2">
                  <span className="text-sm font-medium text-gray-600 block mb-2">Dirección:</span>
                  <p className="text-sm text-gray-900">{buildingData.address}</p>
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

          {/* Información sobre el técnico asignado */}
          {buildingData.technicianEmail && (
            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Técnico Asignado
                    </h3>
                    <p className="text-blue-600">
                      {buildingData.technicianEmail} podrá gestionar el libro digital de este activo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          onClick={onEditData}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Editar Datos
        </button>
        
        <button
          onClick={onEditLocation}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Editar Ubicación
        </button>
        
        <button
          onClick={onSaveFinal}
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-auto flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Crear Activo</span>
        </button>
      </div>
    </div>
  );
};

export default CreateBuildingStep3;