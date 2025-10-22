// src/components/buildings/CreateBuildingStep2.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FileUpload from '../ui/FileUpload';

  import type { LatLngTuple } from 'leaflet';
// --- Simple debounce ---
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// --- Fix Leaflet default icons (client-side only) ---
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

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

type NominatimSuggestion = {
  place_id: number | string;
  display_name: string;
  lat: string;
  lon: string;
};

// ---- Map click picker ----
const LocationPicker: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({
  onLocationSelect,
}) => {
  useMapEvents({
    click: (e) => onLocationSelect(e.latlng.lat, e.latlng.lng),
  });
  return null;
};

const MAX_PHOTOS = 5;

const CreateBuildingStep2: React.FC<CreateBuildingStep2Props> = ({
  onNext,
  onPrevious,
  onSaveDraft,
  initialData = {},
  buildingName,
}) => {
  const { t } = useTranslation();

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    initialData.latitude != null && initialData.longitude != null
      ? { lat: initialData.latitude, lng: initialData.longitude }
      : null
  );
  const [address, setAddress] = useState<string>(initialData.address || '');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);

  const [photos, setPhotos] = useState<File[]>(initialData.photos?.slice(0, MAX_PHOTOS) || []);
  const [mainPhotoIndex, setMainPhotoIndex] = useState(initialData.mainPhotoIndex || 0);

  const [errors, setErrors] = useState<{ location?: string; photos?: string }>({});

  // Leaflet map ref (v4 compatible: use whenCreated)
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.flyTo([location.lat, location.lng], 16, { animate: true });
    }
  }, [location]);

  // --- Geocode (search button) ---
  const handleGeocode = async () => {
    if (!address.trim()) {
      setLocation(null);
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          address
        )}`,
        { headers: { 'Accept-Language': document.documentElement.lang || 'en' } }
      );
      const data: NominatimSuggestion[] = await res.json();
      if (data?.length) {
        setLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        setLocation(null);
        setGeoError(t('maps.noLocationFound', 'No se encontró la ubicación.'));
      }
    } catch {
      setLocation(null);
      setGeoError(t('maps.searchError', 'Error buscando la ubicación.'));
    } finally {
      setGeoLoading(false);
    }
  };

  // --- Autocomplete suggestions (debounced) ---
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=8&q=${encodeURIComponent(
          query
        )}`,
        { headers: { 'Accept-Language': document.documentElement.lang || 'en' } }
      );
      const data: NominatimSuggestion[] = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };
  const debouncedFetchSuggestions = useRef(debounce(fetchSuggestions, 400)).current;

  useEffect(() => {
    if (address.trim() && !hasSelectedSuggestion) {
      debouncedFetchSuggestions(address);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [address, hasSelectedSuggestion, debouncedFetchSuggestions]);

  const handleSuggestionSelect = (s: NominatimSuggestion) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    setAddress(s.display_name);
    setLocation({ lat, lng });
    setSuggestions([]);
    setShowSuggestions(false);
    setHasSelectedSuggestion(true);
    if (mapRef.current) mapRef.current.flyTo([lat, lng], 16, { animate: true });
  };

  // --- Map click: reverse geocode to fill address ---
  const handleLocationSelect = useCallback(
    async (lat: number, lng: number) => {
      setLocation({ lat, lng });
      if (errors.location) setErrors((p) => ({ ...p, location: undefined }));
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          { headers: { 'Accept-Language': document.documentElement.lang || 'en' } }
        );
        const data = await resp.json();
        if (data?.display_name) setAddress(data.display_name);
      } catch {
        // ignore
      }
    },
    [errors.location]
  );

  // --- Photos handlers ---
  const handlePhotosSelected = (newFiles: File[]) => {
    const available = MAX_PHOTOS - photos.length;
    if (available <= 0) return;
    const filesToAdd = newFiles.slice(0, available);
    const updated = [...photos, ...filesToAdd];
    setPhotos(updated);
    if (updated.length && mainPhotoIndex >= updated.length) setMainPhotoIndex(0);
    if (errors.photos) setErrors((p) => ({ ...p, photos: undefined }));
  };

  const handleSetMainPhoto = (index: number) => setMainPhotoIndex(index);

  const handleRemovePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
    if (!next.length) setMainPhotoIndex(0);
    else if (index === mainPhotoIndex) setMainPhotoIndex(0);
    else if (index < mainPhotoIndex) setMainPhotoIndex((v) => Math.max(0, v - 1));
  };

  // --- Validation ---
  const validateForm = (): boolean => {
    const newErrs: { location?: string; photos?: string } = {};
    if (!location) newErrs.location = t('buildings.locationRequired', 'La ubicación es obligatoria');
    if (photos.length > MAX_PHOTOS) newErrs.photos = t('buildings.maxPhotos', 'Máximo {{n}} fotos', { n: MAX_PHOTOS });
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  // --- Next / Draft ---
  const handleNext = () => {
    if (!validateForm() || !location) return;
    onNext({
      latitude: location.lat,
      longitude: location.lng,
      address: address.trim(),
      photos,
      mainPhotoIndex,
    });
  };

  const handleSaveDraft = () => {
    const draft: Partial<LocationData> = {};
    if (location) {
      draft.latitude = location.lat;
      draft.longitude = location.lng;
    }
    if (address.trim()) draft.address = address.trim();
    if (photos.length) {
      draft.photos = photos;
      draft.mainPhotoIndex = mainPhotoIndex;
    }
    onSaveDraft(draft);
  };

  // --- Close suggestions on outside click ---
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('ul[data-role="suggestions"]')
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);


  const center: LatLngTuple = location
    ? [location.lat, location.lng]
    : [40.4168, -3.7038]; // Madrid default

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {buildingName} — {t('buildingWizard.locationPhotos', 'Ubicación y fotos')}
        </h1>
        <p className="text-gray-600">
          {t(
            'buildingWizard.markLocationAndUpload',
            'Marca la ubicación del edificio en el mapa y sube las fotos correspondientes.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Address + Map */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t('building.location', 'Ubicación del edificio')} *
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t(
                'buildingWizard.searchOrClickMap',
                'Puedes buscar escribiendo la dirección o haciendo clic en el mapa.'
              )}
            </p>
          </div>

          {/* Address + Search */}
          <div className="relative mb-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setHasSelectedSuggestion(false);
                }}
                onFocus={() => address.trim() && setShowSuggestions(true)}
                placeholder={t('common.addressPlaceholder', 'Ej.: Calle Mayor 123, Madrid')}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                autoComplete="off"
                aria-label={t('common.address', 'Dirección')}
              />
              <button
                type="button"
                onClick={handleGeocode}
                disabled={geoLoading || !address.trim()}
                className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                aria-busy={geoLoading}
              >
                {geoLoading ? t('common.searching', 'Buscando...') : t('common.search', 'Buscar')}
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <ul
                data-role="suggestions"
                className="absolute left-0 top-full w-full bg-white border border-blue-400 rounded-lg shadow-2xl mt-1 max-h-56 overflow-auto z-50"
              >
                {suggestions.length === 0 && address.trim() && (
                  <li className="px-3 py-2 text-gray-500 text-sm select-none">
                    {t('common.noResults', 'No se encontraron resultados')}
                  </li>
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

          {geoError && <p className="mt-1 text-sm text-red-600">{geoError}</p>}

          {/* Map */}
          <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-300">
            <MapContainer
              center={center}
              zoom={location ? 16 : 10}
              style={{ height: '100%', width: '100%' }}
              whenReady={() => {
                // Access the map instance after mount
                if (mapRef.current === null) {
                  // @ts-ignore
                  mapRef.current = (window as any).L?.map?.instance || null;
                }
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <LocationPicker onLocationSelect={handleLocationSelect} />
              {location && (
                <Marker position={[location.lat, location.lng]}>
                  {address.trim() && <Popup>{address}</Popup>}
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Selected coordinates */}
          {location && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>{t('maps.selectedLocation', 'Ubicación seleccionada')}:</strong>
                {address && (
                  <span className="block font-semibold text-green-900 mb-1">{address}</span>
                )}
                {t('maps.latitude', 'Latitud')}: {location.lat.toFixed(6)} <br />
                {t('maps.longitude', 'Longitud')}: {location.lng.toFixed(6)}
              </p>
            </div>
          )}

          {errors.location && (
            <p className="mt-2 text-sm text-red-600">
              {t('buildings.locationRequired', 'La ubicación es obligatoria')}
            </p>
          )}
        </div>

        {/* Right: Photos */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t('buildingWizard.buildingPhotos', 'Fotos del edificio')}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t(
                'buildingWizard.uploadPhotosDesc',
                'Sube fotos del edificio. Marca una como principal.'
              )}
            </p>
          </div>

          {photos.length < MAX_PHOTOS && (
            <FileUpload
              onFilesSelected={handlePhotosSelected}
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxFiles={MAX_PHOTOS - photos.length}
              maxSizeInMB={5}
              label={t('buildingWizard.uploadPhotos', 'Subir fotos')}
              description={t(
                'buildingWizard.dragPhotosOrClick',
                'Arrastra aquí o haz clic ({{remaining}} restantes)',
                { remaining: MAX_PHOTOS - photos.length }
              )}
              className="mb-6"
            />
          )}

          {errors.photos && (
            <p className="mb-4 text-sm text-red-600">{errors.photos}</p>
          )}

          {photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                {t('buildingWizard.uploadedPhotos', 'Fotos subidas')} ({photos.length}/{MAX_PHOTOS})
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => {
                  const isMain = index === mainPhotoIndex;
                  const previewUrl = URL.createObjectURL(photo);
                  return (
                    <div key={index} className="relative group">
                      <div
                        className={`relative rounded-lg overflow-hidden border-2 ${
                          isMain ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={previewUrl}
                          alt={t('buildingWizard.photoAlt', 'Foto {{n}}', { n: index + 1 })}
                          className="w-full h-32 object-cover"
                          onLoad={() => URL.revokeObjectURL(previewUrl)}
                        />

                        {isMain && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded">
                              {t('buildingWizard.mainPhoto', 'Principal')}
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetMainPhoto(index)}
                              className="p-1 text-white bg-black bg-opacity-50 rounded hover:bg-opacity-70"
                              title={t('buildingWizard.setAsMain', 'Marcar como principal')}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="p-1 text-white bg-red-500 bg-opacity-70 rounded hover:bg-opacity-90"
                            title={t('common.remove', 'Eliminar')}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 truncate">{photo.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-8 border-top border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('common.previous', 'Anterior')}
        </button>

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
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-auto"
        >
          {t('common.saveAndContinue', 'Guardar y continuar')}
        </button>
      </div>
    </div>
  );
};

export default CreateBuildingStep2;
