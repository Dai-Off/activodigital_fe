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
  isSaving?: boolean;
}

const CreateBuildingStep3: React.FC<CreateBuildingStep3Props> = ({
  buildingData,
  onEditData,
  onEditLocation,
  onSaveFinal,
  isSaving = false
}) => {
  const safePhotos = Array.isArray(buildingData.photos) ? buildingData.photos : [];
  const safeMainIndex = Number.isInteger(buildingData.mainPhotoIndex) && buildingData.mainPhotoIndex >= 0
    ? buildingData.mainPhotoIndex
    : 0;
  const mainPhoto = safePhotos[safeMainIndex];
  const [mainPhotoUrl, setMainPhotoUrl] = React.useState<string | null>(null);
  
  // Crear URL del objeto de forma segura
  React.useEffect(() => {
    if (mainPhoto) {
      try {
        const url = URL.createObjectURL(mainPhoto);
        setMainPhotoUrl(url);
        
        // Limpiar URL cuando el componente se desmonte
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error creando URL del objeto:', error);
        setMainPhotoUrl(null);
      }
    } else {
      setMainPhotoUrl(null);
    }
  }, [mainPhoto]);

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

      {/* Información del edificio */}
      <div className="overflow-hidden">
        
        {/* Header de la card con foto principal */}
        {mainPhotoUrl ? (
          <div className="relative h-72 bg-gray-200">
            <img
              src={mainPhotoUrl}
              alt={`Foto principal de ${buildingData.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Error cargando imagen:', e);
                // Si hay error, mostrar placeholder
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
              onLoad={() => {
                console.log('Imagen cargada correctamente');
              }}
            />
            {/* Placeholder en caso de error */}
            <div className="hidden absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Error cargando imagen</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/20 to-transparent">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {buildingData.name}
                </h2>
                <p className="text-gray-200 drop-shadow-lg">
                  {buildingData.address}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-72 bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Sin imagen principal</p>
            </div>
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/20 to-transparent">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {buildingData.name}
                </h2>
                <p className="text-gray-200 drop-shadow-lg">
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

          {/* Galería removida según requerimiento */}

          {/* Sección de técnico asignado removida por requerimiento */}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          onClick={onEditData}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Editar Datos
        </button>
        
        <button
          onClick={onEditLocation}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Editar Ubicación
        </button>
        
        <button
          onClick={onSaveFinal}
          disabled={isSaving}
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-auto flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creando...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Crear Activo</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateBuildingStep3;