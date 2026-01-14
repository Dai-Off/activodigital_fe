// src/components/buildings/CreateBuildingFromCatastro.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, AlertCircle, Loader2, Hash, MapPin, Navigation } from 'lucide-react';
import { CatastroApiService, type Provincia, type Municipio, type Via, type CatastroBuildingData } from '../../services/catastroApi';
import type { BuildingStep1Data } from './CreateBuildingWizard';
import { SupportContactModal } from '../SupportContactModal';

interface CreateBuildingFromCatastroProps {
  onDataLoaded: (data: BuildingStep1Data, coordinates?: { lat: number; lng: number }) => void;
  onCancel: () => void;
}

type SearchMethod = 'rc' | 'address' | 'coordinates';

const CreateBuildingFromCatastro: React.FC<CreateBuildingFromCatastroProps> = ({
  onDataLoaded,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('rc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Estados para búsqueda por RC
  const [rc, setRc] = useState('');

  // Estados para búsqueda por dirección
  const [provinces, setProvinces] = useState<Provincia[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipio[]>([]);
  const [streets, setStreets] = useState<Via[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [streetType, setStreetType] = useState('');
  const [streetName, setStreetName] = useState('');
  const [number, setNumber] = useState('');
  const [escalera, setEscalera] = useState('');
  const [planta, setPlanta] = useState('');
  const [puerta, setPuerta] = useState('');

  // Estados para búsqueda por coordenadas
  const [coordX, setCoordX] = useState('');
  const [coordY, setCoordY] = useState('');

  // Estados para datos adicionales después de cargar
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [catastroDataLoaded, setCatastroDataLoaded] = useState<CatastroBuildingData | null>(null);
  const [additionalData, setAdditionalData] = useState({
    name: '',
    price: '',
    technicianEmail: '',
    cfoEmail: '',
    propietarioEmail: '',
  });

  // Cargar provincias al montar
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provs = await CatastroApiService.getProvinces();
        setProvinces(provs);
      } catch (err) {
        console.error('Error cargando provincias:', err);
      }
    };
    loadProvinces();
  }, []);

  // Cargar municipios cuando se selecciona una provincia
  useEffect(() => {
    if (selectedProvince) {
      const loadMunicipalities = async () => {
        try {
          const munis = await CatastroApiService.getMunicipalities(selectedProvince);
          setMunicipalities(munis);
          setSelectedMunicipality('');
          setStreets([]);
        } catch (err) {
          console.error('Error cargando municipios:', err);
          setMunicipalities([]);
        }
      };
      loadMunicipalities();
    } else {
      setMunicipalities([]);
      setSelectedMunicipality('');
    }
  }, [selectedProvince]);

  // Cargar vías cuando se selecciona un municipio
  useEffect(() => {
    if (selectedProvince && selectedMunicipality) {
      const loadStreets = async () => {
        try {
          const vias = await CatastroApiService.getStreets(
            selectedProvince,
            selectedMunicipality,
            streetName || undefined,
            streetType || undefined
          );
          setStreets(vias);
        } catch (err) {
          console.error('Error cargando vías:', err);
          setStreets([]);
        }
      };
      // Debounce para evitar demasiadas peticiones
      const timer = setTimeout(loadStreets, 500);
      return () => clearTimeout(timer);
    } else {
      setStreets([]);
    }
  }, [selectedProvince, selectedMunicipality, streetName, streetType]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let inmueble;

      if (searchMethod === 'rc') {
        const trimmedRc = rc.trim();
        if (!trimmedRc) {
          setError('El código catastral es obligatorio.\n\nPor favor, ingresa el código completo del edificio. Puedes encontrarlo en:\n• Escrituras de propiedad\n• Recibos del IBI (Impuesto de Bienes Inmuebles)\n• Certificados catastrales');
          setIsLoading(false);
          return;
        }
        
        inmueble = await CatastroApiService.getBuildingByRC(trimmedRc);
      } else if (searchMethod === 'address') {
        const missingFields: string[] = [];
        if (!selectedProvince) missingFields.push('Provincia');
        if (!selectedMunicipality) missingFields.push('Municipio');
        if (!selectedStreet) missingFields.push('Vía');
        if (!number) missingFields.push('Número');
        
        if (missingFields.length > 0) {
          setError(`Faltan campos obligatorios para realizar la búsqueda:\n\n${missingFields.map(field => `• ${field}`).join('\n')}\n\nPor favor, completa todos los campos marcados con asterisco (*) para continuar.`);
          setIsLoading(false);
          return;
        }
        const via = streets.find(v => v.codigo === selectedStreet);
        inmueble = await CatastroApiService.getBuildingByAddress(
          selectedProvince,
          selectedMunicipality,
          via?.nombre || '',
          via?.tipoVia || '',
          number,
          escalera || undefined,
          planta || undefined,
          puerta || undefined
        );
      } else {
        // coordinates
        const missingCoords: string[] = [];
        if (!coordX || coordX.trim() === '') missingCoords.push('Longitud (X)');
        if (!coordY || coordY.trim() === '') missingCoords.push('Latitud (Y)');
        
        if (missingCoords.length > 0) {
          setError(`Faltan coordenadas obligatorias:\n\n${missingCoords.map(coord => `• ${coord}`).join('\n')}\n\nLas coordenadas deben ser números válidos en formato decimal.\n💡 Ejemplo: Longitud: -3.7038, Latitud: 40.4168`);
          setIsLoading(false);
          return;
        }
        
        // Validar que sean números
        const coordXNum = parseFloat(coordX.trim());
        const coordYNum = parseFloat(coordY.trim());
        
        if (isNaN(coordXNum) || isNaN(coordYNum)) {
          setError('Las coordenadas deben ser números válidos.\n\nPor favor, verifica que hayas ingresado valores numéricos en formato decimal.\n💡 Ejemplo válido: Longitud: -3.7038, Latitud: 40.4168');
          setIsLoading(false);
          return;
        }
        
        inmueble = await CatastroApiService.getBuildingByCoordinates(coordXNum, coordYNum);
      }

      // Mapear los datos (ahora es async porque puede geocodificar)
      const catastroData = await CatastroApiService.mapToBuildingData(inmueble);

      // Guardar los datos y mostrar formulario adicional
      setCatastroDataLoaded(catastroData);
      // Inicializar los datos adicionales (nombre vacío, se usará placeholder)
      setAdditionalData({
        name: '',
        price: '',
        technicianEmail: '',
        cfoEmail: '',
        propietarioEmail: '',
      });
      setShowAdditionalFields(true);
      } catch (err) {
      // Manejar errores de manera más amigable - siempre en español
      let errorMessage = 'No se pudo obtener la información del edificio. Por favor, inténtalo de nuevo.';
      
      if (err instanceof Error) {
        const message = err.message;
        
        // Si el mensaje ya está en español y es descriptivo, usarlo
        if (message && !message.includes('Cannot read') && 
            !message.includes('null') && 
            !message.includes('undefined') &&
            !message.includes('TypeError') &&
            !message.includes('ReferenceError') &&
            !message.includes('reading')) {
          errorMessage = message;
        }
        // Si es un error técnico, usar mensaje genérico con alternativas
      } else if (typeof err === 'string') {
        // Solo usar si no contiene errores técnicos en inglés
        if (!err.includes('Cannot read') && 
            !err.includes('null') && 
            !err.includes('undefined')) {
          errorMessage = err;
        }
      }
      
      // Si el mensaje es genérico, agregar más contexto según el método de búsqueda
      if (errorMessage === 'No se pudo obtener la información del edificio. Por favor, inténtalo de nuevo.') {
        if (searchMethod === 'rc') {
          errorMessage = 'No se pudo obtener la información del edificio con el código catastral ingresado.\n\nTe sugerimos:\n• Verificar que el código esté completo y correcto\n• Intentar buscar por dirección si conoces la ubicación\n• Contactar con soporte si el problema persiste';
        } else if (searchMethod === 'address') {
          errorMessage = 'No se pudo obtener la información del edificio con la dirección ingresada.\n\nTe sugerimos:\n• Verificar que todos los datos de la dirección sean correctos\n• Intentar buscar por código catastral si lo conoces\n• Verificar la ortografía de la calle y número';
        } else {
          errorMessage = 'No se pudo obtener la información del edificio con las coordenadas ingresadas.\n\nTe sugerimos:\n• Verificar que las coordenadas sean correctas\n• Verificar que estén en el sistema de referencia adecuado\n• Intentar buscar por dirección o código catastral';
        }
      }
      
      setError(errorMessage);
      // Log técnico solo en consola para desarrolladores
      console.error('Error técnico al buscar en catastro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  const handleContinueWithAdditionalData = () => {
    if (!catastroDataLoaded) return;

    // Usar el nombre del formulario, o si está vacío, usar la dirección por defecto
    const buildingName = additionalData.name.trim() || catastroDataLoaded.address || t('buildings.newBuilding', 'Nuevo Edificio');

    // Convertir al formato BuildingStep1Data con los datos adicionales
    const buildingData: BuildingStep1Data = {
      name: buildingName,
      address: catastroDataLoaded.address || '',
      constructionYear: catastroDataLoaded.constructionYear?.toString() || '',
      typology: catastroDataLoaded.typology || '',
      floors: catastroDataLoaded.numFloors?.toString() || '',
      units: catastroDataLoaded.numUnits?.toString() || '',
      price: additionalData.price,
      technicianEmail: additionalData.technicianEmail,
      cfoEmail: additionalData.cfoEmail,
      propietarioEmail: additionalData.propietarioEmail,
      squareMeters: catastroDataLoaded.squareMeters?.toString() || '',
    };

    // Pasar coordenadas si están disponibles y válidas
    const coordinates = 
      catastroDataLoaded.lat != null && 
      catastroDataLoaded.lng != null && 
      catastroDataLoaded.lat !== 0 && 
      catastroDataLoaded.lng !== 0 &&
      catastroDataLoaded.lat >= -90 && 
      catastroDataLoaded.lat <= 90 &&
      catastroDataLoaded.lng >= -180 && 
      catastroDataLoaded.lng <= 180
        ? { lat: catastroDataLoaded.lat, lng: catastroDataLoaded.lng }
        : undefined;

    onDataLoaded(buildingData, coordinates);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('buildingWizard.loadFromCatastro', 'Cargar desde Catastro')}
        </h1>
        <p className="text-gray-600">
          {t(
            'buildingWizard.loadFromCatastroDesc',
            'Busca el edificio usando uno de los métodos disponibles'
          )}
        </p>
      </div>

      {/* Selector de método */}
      <div className="mb-4 md:mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('buildingWizard.searchMethod', 'Método de búsqueda')}
        </label>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchMethod('rc');
              setError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 md:py-2 rounded-lg border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              searchMethod === 'rc'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <Hash className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">{t('buildingWizard.searchByRC', 'Por Código Catastral')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMethod('address');
              setError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 md:py-2 rounded-lg border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              searchMethod === 'address'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">{t('buildingWizard.searchByAddress', 'Por Dirección')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMethod('coordinates');
              setError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 md:py-2 rounded-lg border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              searchMethod === 'coordinates'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <Navigation className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">{t('buildingWizard.searchByCoords', 'Por Coordenadas')}</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        {/* Búsqueda por Código Catastral */}
        {searchMethod === 'rc' && (
          <div>
            <label htmlFor="rc" className="block text-sm font-medium text-gray-700 mb-2">
              {t('buildingWizard.catastralCode', 'Código Catastral (RC)')} *
            </label>
            <input
              id="rc"
              type="text"
              value={rc}
              onChange={(e) => {
                setRc(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('buildingWizard.rcPlaceholder', 'Ej: 1249023VK4714G0001FH')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Búsqueda por Dirección */}
        {searchMethod === 'address' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('buildingWizard.province', 'Provincia')} *
                </label>
                <select
                  id="province"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">{t('common.select', 'Seleccionar...')}</option>
                  {provinces.map((p) => (
                    <option key={p.codigo} value={p.codigo}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('buildingWizard.municipality', 'Municipio')} *
                </label>
                <select
                  id="municipality"
                  value={selectedMunicipality}
                  onChange={(e) => {
                    setSelectedMunicipality(e.target.value);
                    setSelectedStreet('');
                    setError(null);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading || !selectedProvince}
                >
                  <option value="">{t('common.select', 'Seleccionar...')}</option>
                  {municipalities.map((m) => (
                    <option key={m.codigo} value={m.codigo}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="streetType" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('buildingWizard.streetType', 'Tipo de Vía')}
                </label>
                <input
                  id="streetType"
                  type="text"
                  value={streetType}
                  onChange={(e) => {
                    setStreetType(e.target.value);
                    setError(null);
                  }}
                  placeholder={t('buildingWizard.streetTypePlaceholder', 'Ej: CL, AV, PL')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading || !selectedMunicipality}
                />
              </div>

              <div>
                <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('buildingWizard.streetName', 'Nombre de Vía')}
                </label>
                <input
                  id="streetName"
                  type="text"
                  value={streetName}
                  onChange={(e) => {
                    setStreetName(e.target.value);
                    setError(null);
                  }}
                  placeholder={t('buildingWizard.streetNamePlaceholder', 'Ej: Alcalá')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading || !selectedMunicipality}
                />
              </div>
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildingWizard.street', 'Vía')} *
              </label>
              <select
                id="street"
                value={selectedStreet}
                onChange={(e) => {
                  setSelectedStreet(e.target.value);
                  setError(null);
                }}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading || !selectedMunicipality}
              >
                <option value="">{t('common.select', 'Seleccionar...')}</option>
                {streets.map((s) => (
                  <option key={s.codigo} value={s.codigo}>
                    {s.tipoVia ? `${s.tipoVia} ` : ''}{s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('buildingWizard.number', 'Número')} *
                </label>
                <input
                  id="number"
                  type="text"
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                    setError(null);
                  }}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="escalera" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('buildingWizard.escalera', 'Escalera')}
                </label>
                <input
                  id="escalera"
                  type="text"
                  value={escalera}
                  onChange={(e) => {
                    setEscalera(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="planta" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('buildingWizard.planta', 'Planta')}
                </label>
                <input
                  id="planta"
                  type="text"
                  value={planta}
                  onChange={(e) => {
                    setPlanta(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="puerta" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('buildingWizard.puerta', 'Puerta')}
                </label>
                <input
                  id="puerta"
                  type="text"
                  value={puerta}
                  onChange={(e) => {
                    setPuerta(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}

        {/* Búsqueda por Coordenadas */}
        {searchMethod === 'coordinates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="coordX" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildingWizard.longitude', 'Longitud (X)')} *
              </label>
              <input
                id="coordX"
                type="text"
                value={coordX}
                onChange={(e) => {
                  setCoordX(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder={t('buildingWizard.longitudePlaceholder', 'Ej: -3.697444')}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="coordY" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildingWizard.latitude', 'Latitud (Y)')} *
              </label>
              <input
                id="coordY"
                type="text"
                value={coordY}
                onChange={(e) => {
                  setCoordY(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder={t('buildingWizard.latitudePlaceholder', 'Ej: 40.418773')}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-900 mb-2">
                {t('buildingWizard.errorTitle', 'Error al buscar el edificio')}
              </p>
              <div className="text-sm text-red-800 leading-relaxed whitespace-pre-line space-y-1.5">
                {error.split('\n').map((line, index) => {
                  // Detectar líneas que son consejos o sugerencias
                  const isTip = line.includes('💡') || line.includes('Consejo');
                  const isList = line.trim().startsWith('•');
                  const isSubtitle = line.includes(':') && !line.includes('•') && !isTip;
                  const hasSupportLink = line.includes('Contactar con soporte') || line.includes('contactar con soporte');
                  
                  if (isTip) {
                    return (
                      <p key={index} className="text-xs text-red-700 mt-3 pt-2 border-t border-red-200 font-medium bg-red-100/50 p-2 rounded">
                        {line}
                      </p>
                    );
                  }
                  
                  if (isSubtitle && index > 0) {
                    return (
                      <p key={index} className="font-semibold text-red-900 mt-2 first:mt-0">
                        {line}
                      </p>
                    );
                  }
                  
                  if (hasSupportLink) {
                    // Dividir la línea para separar el texto del enlace
                    const parts = line.split(/(Contactar con soporte|contactar con soporte)/i);
                    return (
                      <p key={index} className="ml-4 text-red-700">
                        {parts.map((part, partIndex) => {
                          if (part.match(/Contactar con soporte/i)) {
                            return (
                              <button
                                key={partIndex}
                                type="button"
                                onClick={() => setIsSupportModalOpen(true)}
                                className="text-blue-600 hover:text-blue-700 underline font-medium"
                              >
                                {part}
                              </button>
                            );
                          }
                          return <span key={partIndex}>{part}</span>;
                        })}
                      </p>
                    );
                  }
                  
                  if (isList) {
                    return (
                      <p key={index} className="ml-4 text-red-700">
                        {line}
                      </p>
                    );
                  }
                  
                  return (
                    <p key={index} className={index === 0 ? 'text-red-900 font-medium' : 'text-red-700'}>
                      {line}
                    </p>
                  );
                })}
              </div>
              
              {/* Mostrar ayuda adicional solo si el error no incluye consejos específicos */}
              {searchMethod === 'rc' && !error.includes('💡') && !error.includes('Consejo') && (
                <div className="mt-3 pt-3 border-t border-red-200 bg-red-100/30 p-3 rounded">
                  <p className="text-xs font-medium text-red-800 mb-1">💡 Consejos útiles:</p>
                  <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc">
                    <li>El código catastral suele tener entre 14 y 20 caracteres</li>
                    <li>Asegúrate de copiarlo completo sin espacios ni guiones</li>
                    <li>Puedes encontrarlo en escrituras, recibos del IBI o certificados catastrales</li>
                  </ul>
                </div>
              )}
              
              {searchMethod === 'address' && !error.includes('💡') && !error.includes('Consejo') && (
                <div className="mt-3 pt-3 border-t border-red-200 bg-red-100/30 p-3 rounded">
                  <p className="text-xs font-medium text-red-800 mb-1">💡 Consejos útiles:</p>
                  <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc">
                    <li>Verifica la ortografía del nombre de la calle</li>
                    <li>Intenta buscar sin especificar escalera, planta o puerta</li>
                    <li>Confirma que el tipo de vía sea correcto (Calle, Avenida, Plaza, etc.)</li>
                  </ul>
                </div>
              )}
              
              {searchMethod === 'coordinates' && !error.includes('💡') && !error.includes('Consejo') && (
                <div className="mt-3 pt-3 border-t border-red-200 bg-red-100/30 p-3 rounded">
                  <p className="text-xs font-medium text-red-800 mb-1">💡 Consejos útiles:</p>
                  <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc">
                    <li>Las coordenadas deben estar en el sistema de referencia ETRS89 o WGS84</li>
                    <li>Para España: Longitud (X) entre -10 y 5, Latitud (Y) entre 35 y 44</li>
                    <li>Usa formato decimal, por ejemplo: -3.7038 para longitud</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </form>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('common.back', 'Volver')}
        </button>

        <button
          type="button"
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:ml-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('common.loading', 'Cargando...')}</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{t('common.search', 'Buscar')}</span>
            </>
          )}
        </button>
      </div>

      {/* Formulario de datos adicionales después de cargar desde catastro */}
      {showAdditionalFields && catastroDataLoaded && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('buildingWizard.additionalData', 'Datos adicionales')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('buildingWizard.additionalDataDesc', 'Completa los siguientes campos opcionales antes de continuar')}
            </p>
          </div>

          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildings.fields.name', 'Nombre del edificio')}
              </label>
              <input
                id="name"
                type="text"
                value={additionalData.name}
                onChange={(e) => setAdditionalData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={catastroDataLoaded?.address || t('buildings.placeholders.name', 'Nombre del edificio')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('buildingWizard.nameHelper', 'Si no se completa, se usará la dirección por defecto.')}
              </p>
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildings.fields.price', 'Precio del activo')}
              </label>
              <input
                id="price"
                type="number"
                value={additionalData.price}
                onChange={(e) => setAdditionalData(prev => ({ ...prev, price: e.target.value }))}
                placeholder={t('buildings.placeholders.price', '250000')}
                min={0}
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('buildings.helpers.price', 'Opcional. Precio de compra o valoración del activo.')}
              </p>
            </div>

            {/* Email del técnico */}
            <div>
              <label htmlFor="technicianEmail" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildings.fields.technicianEmail', 'Email del técnico')}
              </label>
              <input
                id="technicianEmail"
                type="email"
                value={additionalData.technicianEmail}
                onChange={(e) => setAdditionalData(prev => ({ ...prev, technicianEmail: e.target.value }))}
                placeholder={t('buildings.placeholders.technicianEmail', 'tecnico@ejemplo.com')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('buildings.helpers.technicianEmail', 'Opcional. Asignará el rol de Técnico al usuario.')}
              </p>
            </div>

            {/* Email del CFO */}
            <div>
              <label htmlFor="cfoEmail" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildings.fields.cfoEmail', 'Email del CFO')}
              </label>
              <input
                id="cfoEmail"
                type="email"
                value={additionalData.cfoEmail}
                onChange={(e) => setAdditionalData(prev => ({ ...prev, cfoEmail: e.target.value }))}
                placeholder={t('buildings.placeholders.cfoEmail', 'cfo@ejemplo.com')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('buildings.helpers.cfoEmail', 'Opcional. Asignará el rol de CFO al usuario.')}
              </p>
            </div>

            {/* Email del propietario */}
            <div>
              <label htmlFor="propietarioEmail" className="block text-sm font-medium text-gray-700 mb-2">
                {t('buildings.fields.propietarioEmail', 'Email del propietario')}
              </label>
              <input
                id="propietarioEmail"
                type="email"
                value={additionalData.propietarioEmail}
                onChange={(e) => setAdditionalData(prev => ({ ...prev, propietarioEmail: e.target.value }))}
                placeholder={t('buildings.placeholders.propietarioEmail', 'propietario@ejemplo.com')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('buildings.helpers.propietarioEmail', 'Opcional. Asignará el rol de Propietario al usuario.')}
              </p>
            </div>
          </div>

          {/* Botones de acción para datos adicionales */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowAdditionalFields(false);
                setCatastroDataLoaded(null);
                setAdditionalData({ name: '', price: '', technicianEmail: '', cfoEmail: '', propietarioEmail: '' });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('common.back', 'Volver')}
            </button>

            <button
              type="button"
              onClick={handleContinueWithAdditionalData}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 sm:ml-auto"
            >
              <span>{t('common.continue', 'Continuar')}</span>
            </button>
          </div>
        </div>
      )}

      <SupportContactModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        initialCategory="technical"
        initialSubject={t('buildings.catastroError', 'Problema al buscar edificio en Catastro')}
        context={`Create Building from Catastro - ${window.location.href} - Search Method: ${searchMethod}`}
      />
    </div>
  );
};

export default CreateBuildingFromCatastro;
