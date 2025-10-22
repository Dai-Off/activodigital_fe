// src/components/buildings/CreateBuildingStep3.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

// ---- Leaflet icon fix (guard for SSR) ----
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

interface BuildingSummaryData {
  // General data
  name: string;
  address: string;
  constructionYear: string;
  typology: 'residential' | 'mixed' | 'commercial';
  floors: string;
  units: string;
  price: string;
  technicianEmail: string;
  cfoEmail: string;

  // Financial
  rehabilitationCost: string;
  potentialValue: string;
  squareMeters: string;

  // Location / photos
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
  isSaving = false,
}) => {
  const { t, i18n } = useTranslation();

  const safePhotos = Array.isArray(buildingData.photos) ? buildingData.photos : [];
  const safeMainIndex =
    Number.isInteger(buildingData.mainPhotoIndex) && buildingData.mainPhotoIndex >= 0
      ? buildingData.mainPhotoIndex
      : 0;
  const mainPhoto = safePhotos[safeMainIndex];
  const [mainPhotoUrl, setMainPhotoUrl] = React.useState<string | undefined>(undefined);

  // Locale-aware number / currency format
  const locale = (i18n.language || document.documentElement.lang || navigator.language || 'en').toString();
  const fmtCurrency = (n: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const fmtNumber = (n: number, opts?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locale, opts).format(n);

  // Create object URL safely
  React.useEffect(() => {
    if (mainPhoto) {
      try {
        const url = URL.createObjectURL(mainPhoto);
        setMainPhotoUrl(url);
        return () => URL.revokeObjectURL(url);
      } catch {
        setMainPhotoUrl(undefined);
      }
    } else {
      setMainPhotoUrl(undefined);
    }
  }, [mainPhoto]);

  // i18n label for typology
  const getTypologyLabel = (typology: string) => {
    switch (typology) {
      case 'residential':
        return t('digitalbook.options.residential', 'Residencial');
      case 'mixed':
        return t('digitalbook.options.mixed', 'Mixto');
      case 'commercial':
        return t('digitalbook.options.commercial', 'Comercial');
      default:
        return typology;
    }
  };

  const priceText =
    buildingData.price?.trim()
      ? fmtCurrency(parseFloat(buildingData.price))
      : t('common.notSpecified', 'No especificado');

  const rehabText =
    buildingData.rehabilitationCost?.trim()
      ? fmtCurrency(parseFloat(buildingData.rehabilitationCost))
      : t('common.notSpecified', 'No especificado');

  const potentialText =
    buildingData.potentialValue?.trim()
      ? fmtCurrency(parseFloat(buildingData.potentialValue))
      : t('common.notSpecified', 'No especificado');

  const surfaceText =
    buildingData.squareMeters?.trim()
      ? `${fmtNumber(parseFloat(buildingData.squareMeters), {
          maximumFractionDigits: 2,
        })} m²`
      : t('common.notSpecified', 'No especificado');

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('buildingWizard.assetSummary', 'Resumen del activo')}
        </h1>
        <p className="text-gray-600">
          {t('buildingWizard.reviewBeforeCreating', 'Revisa los datos antes de crear el activo.')}
        </p>
      </div>

      {/* Card with main photo */}
      <div className="overflow-hidden">
        {mainPhotoUrl ? (
          <div className="relative h-72 bg-gray-200">
            <img
              src={mainPhotoUrl}
              alt={`${t('buildingWizard.mainPhotoOf', 'Foto principal de')} ${buildingData.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback placeholder if image fails */}
            <div className="hidden absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  {t('buildingWizard.imageLoadError', 'Error cargando la imagen')}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/20 to-transparent">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {buildingData.name}
                </h2>
                <p className="text-gray-200 drop-shadow-lg">{buildingData.address}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-72 bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                {t('buildingWizard.noMainPhoto', 'Sin foto principal')}
              </p>
            </div>
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/20 to-transparent">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {buildingData.name}
                </h2>
                <p className="text-gray-200 drop-shadow-lg">{buildingData.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left: General info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('buildingWizard.generalInfo', 'Información general')}
                </h3>
                <button
                  onClick={onEditData}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('buildings.editDataButton', 'Editar datos')}
                </button>
              </div>

              <div className="space-y-3">
                <Row
                  label={t('buildings.fields.name', 'Nombre')}
                  value={buildingData.name}
                />
                <Row
                  label={t('buildings.fields.constructionYear', 'Año de construcción')}
                  value={buildingData.constructionYear}
                />
                <Row
                  label={t('buildings.fields.typology', 'Tipología')}
                  value={getTypologyLabel(buildingData.typology)}
                />
                <Row
                  label={t('buildings.fields.numFloors', 'Número de plantas')}
                  value={buildingData.floors}
                />
                <Row
                  label={t('buildings.fields.numUnits', 'Número de unidades')}
                  value={buildingData.units}
                />
                <Row
                  label={t('buildings.fields.assetPrice', 'Precio del activo')}
                  value={priceText}
                />
                <Row
                  label={t('buildings.fields.technicianEmail', 'Email del técnico')}
                  value={buildingData.technicianEmail || t('common.unassigned', 'Sin asignar')}
                />
                <Row
                  label={t('buildings.fields.cfoEmail', 'Email del CFO')}
                  value={buildingData.cfoEmail || t('common.unassigned', 'Sin asignar')}
                />
                <Row
                  label={t('buildings.fields.rehabilitationCost', 'Coste de rehabilitación')}
                  value={rehabText}
                />
                <Row
                  label={t('buildings.fields.potentialValue', 'Valor potencial')}
                  value={potentialText}
                />
                <Row
                  label={t('buildings.fields.surface', 'Superficie')}
                  value={surfaceText}
                />

                <div className="py-2">
                  <span className="text-sm font-medium text-gray-600 block mb-2">
                    {t('buildings.address', 'Dirección')}:
                  </span>
                  <p className="text-sm text-gray-900">{buildingData.address}</p>
                </div>
              </div>
            </div>

            {/* Right: Mini map */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('building.location', 'Ubicación del edificio')}
                </h3>
                <button
                  onClick={onEditLocation}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('buildings.editLocationButton', 'Editar ubicación')}
                </button>
              </div>

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
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[buildingData.latitude, buildingData.longitude]} />
                </MapContainer>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                <p>
                  {t('maps.latitude', 'Latitud')}: {buildingData.latitude.toFixed(6)}
                </p>
                <p>
                  {t('maps.longitude', 'Longitud')}: {buildingData.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          onClick={onEditData}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('buildings.editDataButton', 'Editar datos')}
        </button>

        <button
          onClick={onEditLocation}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('buildings.editLocationButton', 'Editar ubicación')}
        </button>

        <button
          onClick={onSaveFinal}
          disabled={isSaving}
          className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-auto flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t('buildings.creating', 'Creando...')}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t('buildings.createAsset', 'Crear activo')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Small presentational row component
const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <span className="text-sm text-gray-900 text-right ml-4">{value}</span>
  </div>
);

export default CreateBuildingStep3;
