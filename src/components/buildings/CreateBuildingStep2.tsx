import React, { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FileUpload from '../ui/FileUpload';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  latitude: number;
  longitude: number;
  photos: File[];
  mainPhotoIndex: number;
}

interface CreateBuildingStep2Props {
  onNext: (data: LocationData) => void;
  onPrevious: () => void;
  onSaveDraft: (data: Partial<LocationData>) => void;
  initialData?: Partial<LocationData>;
  buildingName: string;
}

// Componente para manejar clicks en el mapa
const LocationPicker: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const CreateBuildingStep2: React.FC<CreateBuildingStep2Props> = ({
  onNext,
  onPrevious,
  onSaveDraft,
  initialData = {},
  buildingName
}) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    initialData.latitude && initialData.longitude
      ? { lat: initialData.latitude, lng: initialData.longitude }
      : null
  );
  
  const [photos, setPhotos] = useState<File[]>(initialData.photos || []);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(initialData.mainPhotoIndex || 0);
  const [errors, setErrors] = useState<{ location?: string; photos?: string }>({});
  
  const mapRef = useRef<L.Map | null>(null);

  // Función para manejar la selección de ubicación
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setLocation({ lat, lng });
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: undefined }));
    }
  }, [errors.location]);

  // Función para manejar la subida de fotos
  const handlePhotosSelected = (newFiles: File[]) => {
    setPhotos(newFiles);
    if (errors.photos) {
      setErrors(prev => ({ ...prev, photos: undefined }));
    }
  };

  // Función para establecer foto principal
  const handleSetMainPhoto = (index: number) => {
    setMainPhotoIndex(index);
  };

  // Función para eliminar foto
  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    
    // Ajustar el índice de foto principal si es necesario
    if (index === mainPhotoIndex) {
      setMainPhotoIndex(0);
    } else if (index < mainPhotoIndex) {
      setMainPhotoIndex(mainPhotoIndex - 1);
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: { location?: string; photos?: string } = {};

    if (!location) {
      newErrors.location = 'Debes seleccionar una ubicación en el mapa';
    }

    if (photos.length === 0) {
      newErrors.photos = 'Debes subir al menos una foto del edificio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar siguiente paso
  const handleNext = () => {
    if (validateForm() && location) {
      const data: LocationData = {
        latitude: location.lat,
        longitude: location.lng,
        photos,
        mainPhotoIndex
      };
      onNext(data);
    }
  };

  // Manejar guardar borrador
  const handleSaveDraft = () => {
    const data: Partial<LocationData> = {};
    
    if (location) {
      data.latitude = location.lat;
      data.longitude = location.lng;
    }
    
    if (photos.length > 0) {
      data.photos = photos;
      data.mainPhotoIndex = mainPhotoIndex;
    }

    onSaveDraft(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {buildingName} - Ubicación y Fotos
        </h1>
        <p className="text-gray-600">
          Marca la ubicación del edificio en el mapa y sube las fotos correspondientes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel izquierdo: Mapa */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Ubicación del Edificio *
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Haz clic en el mapa para marcar la ubicación exacta del edificio.
            </p>
          </div>

          {/* Mapa */}
          <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-300">
            <MapContainer
              center={location || [40.4168, -3.7038]} // Madrid por defecto
              zoom={location ? 16 : 10}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <LocationPicker onLocationSelect={handleLocationSelect} />
              
              {location && (
                <Marker position={[location.lat, location.lng]} />
              )}
            </MapContainer>
          </div>

          {/* Info de coordenadas */}
          {location && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Ubicación seleccionada:</strong><br />
                Latitud: {location.lat.toFixed(6)}<br />
                Longitud: {location.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Error de ubicación */}
          {errors.location && (
            <p className="mt-2 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Panel derecho: Fotos */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Fotos del Edificio *
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Sube fotos del edificio. La primera será la foto principal.
            </p>
          </div>

          {/* Subida de archivos */}
          {photos.length < 10 && (
            <FileUpload
              onFilesSelected={handlePhotosSelected}
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxFiles={10}
              maxSizeInMB={5}
              label="Subir fotos"
              description="Arrastra fotos aquí o haz clic para seleccionar"
              className="mb-6"
            />
          )}

          {/* Error de fotos */}
          {errors.photos && (
            <p className="mb-4 text-sm text-red-600">{errors.photos}</p>
          )}

          {/* Preview de fotos */}
          {photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                Fotos subidas ({photos.length}/10)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => {
                  const photoUrl = URL.createObjectURL(photo);
                  const isMain = index === mainPhotoIndex;
                  
                  return (
                    <div key={index} className="relative group">
                      <div 
                        className={`relative rounded-lg overflow-hidden border-2 ${
                          isMain ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={photoUrl}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover"
                          onLoad={() => URL.revokeObjectURL(photoUrl)}
                        />
                        
                        {/* Badge de foto principal */}
                        {isMain && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded">
                              Principal
                            </span>
                          </div>
                        )}
                        
                        {/* Botones de acción */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetMainPhoto(index)}
                              className="p-1 text-white bg-black bg-opacity-50 rounded hover:bg-opacity-70"
                              title="Establecer como principal"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="p-1 text-white bg-red-500 bg-opacity-70 rounded hover:bg-opacity-90"
                            title="Eliminar foto"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Nombre del archivo */}
                      <p className="mt-1 text-xs text-gray-500 truncate">
                        {photo.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-8 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Anterior
        </button>
        
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
          Guardar y continuar
        </button>
      </div>
    </div>
  );
};

export default CreateBuildingStep2;