import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// Utilidad debounce simple
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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
  address: string;
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
  const [address, setAddress] = useState<string>("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
   // Centrar el mapa automáticamente cuando cambia location
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.flyTo([location.lat, location.lng], 16, { animate: true });
    }
  }, [location]);

  // Buscar lat/lng por dirección usando Nominatim (botón buscar)
  const handleGeocode = async () => {
    if (!address.trim()) {
      setLocation(null);
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        setLocation(null);
        setGeoError('No se encontró la ubicación.');
      }
    } catch (err) {
      setLocation(null);
      setGeoError('Error buscando la ubicación.');
    } finally {
      setGeoLoading(false);
    }
  };

  // Autocompletado: buscar sugerencias mientras se escribe
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await resp.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };
  // Debounced version
  const debouncedFetchSuggestions = React.useRef(debounce(fetchSuggestions, 400)).current;

  useEffect(() => {
    if (address.trim() && !hasSelectedSuggestion) {
      debouncedFetchSuggestions(address);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [address, debouncedFetchSuggestions, hasSelectedSuggestion]);

  // Al seleccionar una sugerencia
  const handleSuggestionSelect = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setAddress(suggestion.display_name);
    setLocation({ lat, lng });
    setSuggestions([]);
    setShowSuggestions(false);
    setHasSelectedSuggestion(true);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16, { animate: true });
    }
  };
  
  const [photos, setPhotos] = useState<File[]>(initialData.photos?.slice(0, 5) || []);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(initialData.mainPhotoIndex || 0);
  const [errors, setErrors] = useState<{ location?: string; photos?: string }>({});
  
  // Función para manejar la selección de ubicación
  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
    setLocation({ lat, lng });
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: undefined }));
    }
    // Reverse geocoding para actualizar el input de dirección
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await resp.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch {}
  }, [errors.location]);

  // Función para manejar la subida de fotos
  const handlePhotosSelected = (newFiles: File[]) => {
    // Calcular cuántas fotos podemos agregar sin exceder el límite de 5
    const availableSlots = 5 - photos.length;
    if (availableSlots <= 0) {
      return; // No se pueden agregar más fotos
    }
    
    const filesToAdd = newFiles.slice(0, availableSlots);
    const updatedPhotos = [...photos, ...filesToAdd];
    setPhotos(updatedPhotos);
    
    // Ajustar el índice de foto principal si es necesario
    if (updatedPhotos.length > 0 && mainPhotoIndex >= updatedPhotos.length) {
      setMainPhotoIndex(0);
    }
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
    if (newPhotos.length === 0) {
      setMainPhotoIndex(0);
    } else if (index === mainPhotoIndex) {
      // Si eliminamos la foto principal, establecer la primera disponible como principal
      setMainPhotoIndex(0);
    } else if (index < mainPhotoIndex) {
      setMainPhotoIndex(mainPhotoIndex - 1);
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: { location?: string; photos?: string } = {};

    if (!location) {
      newErrors.location = t('buildings.locationRequired');
    }

    // Fotos opcionales, máximo 5
    if (photos.length > 5) {
      newErrors.photos = t('buildings.maxPhotos', 'Máximo 5 fotos');
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
        address: address.trim(),
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
    
    if (address.trim()) {
      data.address = address.trim();
    }
      setGeoError(t('addressRequired', 'La dirección es obligatoria'));
    if (photos.length > 0) {
      data.photos = photos;
      data.mainPhotoIndex = mainPhotoIndex;
    }

    onSaveDraft(data);
  };

  // Cerrar el dropdown si el input pierde el foco y no se está haciendo click en una sugerencia
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('ul')
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {buildingName} - {t('buildings.locationAndPhotos')}
        </h1>
        <p className="text-gray-600">
          {t('buildings.markLocationAndUpload', 'Marca la ubicación del edificio en el mapa y sube las fotos correspondientes.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel izquierdo: Dirección y Mapa */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t('buildings.buildingLocation', 'Ubicación del Edificio')} *
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('buildings.searchOrClickMap', 'Puedes buscar la ubicación escribiendo la dirección o haciendo clic en el mapa.')}
            </p>
          </div>

          {/* Input de dirección y botón buscar */}
          <div className="relative mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                  setHasSelectedSuggestion(false);
                }}
                onFocus={() => address.trim() && setShowSuggestions(true)}
                placeholder={t('buildings.addressPlaceholder', 'Ej: Calle Mayor 123, Madrid')}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                autoComplete="off"
                ref={inputRef}
              />
              <button
                type="button"
                onClick={handleGeocode}
                disabled={geoLoading || !address.trim()}
                className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {geoLoading ? t('buildings.searching') : t('buildings.search')}
              </button>
            </div>
            {/* Dropdown de sugerencias sobre el mapa */}
            {showSuggestions && (
              <ul className="absolute left-0 top-full w-full bg-white border border-blue-400 rounded-lg shadow-2xl mt-1 max-h-56 overflow-auto" style={{zIndex: 9999}}>
                {suggestions.length === 0 && address.trim() && (
                  <li className="px-3 py-2 text-gray-500 text-sm select-none">{t('buildings.noResults', 'No se encontraron resultados')}</li>
                )}
                {suggestions.map((s) => (
                  <li
                    key={s.place_id}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                    onMouseDown={() => handleSuggestionSelect(s)}
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {geoError && (
            <p className="mt-1 text-sm text-red-600">{geoError}</p>
          )}

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
                <Marker
                  key={`${location.lat},${location.lng}`}
                  position={[location.lat, location.lng]}
                >
                  {address.trim() && (
                    <Popup>
                      {address}
                    </Popup>
                  )}
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Info de coordenadas */}
          {location && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>{t('buildings.selectedLocation', 'Ubicación seleccionada')}:</strong><br />
                {address && (
                  <span className="block font-semibold text-green-900 mb-1">{address}</span>
                )}
                {t('buildings.latitude', 'Latitud')}: {location.lat.toFixed(6)}<br />
                {t('buildings.longitude', 'Longitud')}: {location.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Error de ubicación */}
          {errors.location && (
            <p className="mt-2 text-sm text-red-600">{t('buildings.locationRequired')}</p>
          )}
        </div>

        {/* Panel derecho: Fotos */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t('buildings.buildingPhotos', 'Fotos del Edificio')} *
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('buildings.uploadPhotosDesc', 'Sube fotos del edificio. La primera será la foto principal.')}
            </p>
          </div>

          {/* Subida de archivos */}
          {photos.length < 5 && (
            <FileUpload
              onFilesSelected={handlePhotosSelected}
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxFiles={5 - photos.length}
              maxSizeInMB={5}
              label={t('buildings.uploadPhotos', 'Subir fotos')}
              description={t('buildings.dragPhotosOrClick', 'Arrastra fotos aquí o haz clic para seleccionar ({{remaining}} restantes)', { remaining: 5 - photos.length })}
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
                {t('buildings.uploadedPhotos', 'Fotos subidas')} ({photos.length}/5)
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
                              {t('buildings.mainPhoto')}
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
                              title={t('buildings.setAsMain')}
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
                            title={t('buildings.remove')}
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
          {t('buildings.previous')}
        </button>
        
        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('buildings.saveDraft')}
        </button>
        
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto"
        >
          {t('buildings.saveAndContinue', 'Guardar y continuar')}
        </button>
      </div>
    </div>
  );
};

export default CreateBuildingStep2;