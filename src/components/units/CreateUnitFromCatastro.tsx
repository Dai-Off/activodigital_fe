// src/components/units/CreateUnitFromCatastro.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Search, AlertCircle, Loader2, MapPin, ChevronDown, Hash } from 'lucide-react';
import { SupportContactModal } from '../SupportContactModal';
import { CatastroApiService, type CatastroAddressParams, fetchCatastroUnitsXmlByAddress, fetchCatastroUnitsXmlByRC, type Municipio, type Provincia, type Via } from '../../services/catastroApi';
import { parseCatastroUnitsFromXml, type FrontendUnit } from '../../utils/catastroUnits';


const STREET_TYPES = [
  { label: 'Calle', value: 'CL' },
  { label: 'Avenida', value: 'AV' },
  { label: 'Paseo', value: 'PS' },
  { label: 'Plaza', value: 'PZ' },
  { label: 'Carretera', value: 'CT' },
  { label: 'Camino', value: 'CM' },
  { label: 'Ronda', value: 'RD' },
  { label: 'Travesía', value: 'TR' },
  { label: 'Pasaje', value: 'PJ' },
  { label: 'Urbanización', value: 'UR' },
  { label: 'Polígono', value: 'PL' },
  { label: 'Glorieta', value: 'GL' },
  { label: 'Rambla', value: 'RB' },
  { label: 'Vía', value: 'VI' },
  { label: 'Lugar', value: 'LG' },
  { label: 'Urbanización', value: 'UR' },
  { label: 'Caserío', value: 'CR' },
  { label: 'Núcleo', value: 'NU' },
  { label: 'Parque Industrial', value: 'PI' },
];

interface AutocompleteFieldProps {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  loading?: boolean;
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled,
  error,
  loading
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync searchTerm with initial value label
  useEffect(() => {
    const selectedOption = options.find(opt => opt.id === value);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else if (!value) {
      setSearchTerm('');
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset searchTerm to the selected value's label if not finished
        const selectedOption = options.find(opt => opt.id === value);
        setSearchTerm(selectedOption ? selectedOption.label : '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, options]);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            // If clearing the input, clear the selection
            if (!e.target.value) {
              onChange('');
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${disabled ? 'bg-gray-50' : 'bg-white'}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto py-1 animate-in fade-in zoom-in duration-100">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors text-sm ${
                  opt.id === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                }`}
                onClick={() => {
                  onChange(opt.id);
                  setSearchTerm(opt.label);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 italic">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CreateUnitFromCatastroProps {
  onUnitsCreated: (units: FrontendUnit[]) => void;
  onCancel: () => void;
  // Permite saltar directamente a la creación manual cuando el usuario lo prefiera
  onGoManual: () => void;
}

type SearchMethod = 'rc' | 'address';

const CreateUnitFromCatastro: React.FC<CreateUnitFromCatastroProps> = ({
  onUnitsCreated,
  onCancel,
  onGoManual,
}) => {
  const { t } = useTranslation();
  const { id: buildingId } = useParams<{ id: string }>();
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('address');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Estado para búsqueda por RC
  const [rc, setRc] = useState('');

  // Estado para selects dependientes (provincia → municipio)
  const [provinces, setProvinces] = useState<Provincia[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipio[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');

  // Estados para búsqueda de calle
  const [streets, setStreets] = useState<Via[]>([]);
  const [selectedStreet, setSelectedStreet] = useState('');
  const [streetType, setStreetType] = useState('');
  const [streetName, setStreetName] = useState('');

  const [numero, setNumero] = useState('');
  const [bloque, setBloque] = useState('');
  const [escalera, setEscalera] = useState('');
  const [planta, setPlanta] = useState('');
  const [puerta, setPuerta] = useState('');

  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);

  // Cargar provincias al montar el componente
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const data = await CatastroApiService.getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error('Error cargando provincias de Catastro:', err);
        setError(
          'No se pudieron cargar las provincias desde Catastro. ' +
            'Por favor, vuelve a intentarlo en unos minutos o contacta con soporte si el problema persiste.'
        );
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  const handleProvinceChange = async (value: string) => {
    setSelectedProvince(value);
    setSelectedMunicipality('');
    setMunicipalities([]);
    setStreets([]);
    setSelectedStreet('');
    setStreetType('');
    setStreetName('');
    setError(null);

    if (!value) return;

    setIsLoadingMunicipalities(true);
    try {
      const data = await CatastroApiService.getMunicipalities(value);
      setMunicipalities(data);
    } catch (err) {
      console.error('Error cargando municipios de Catastro:', err);
      setError(
        'No se pudieron cargar los municipios para la provincia seleccionada. ' +
          'Intenta seleccionar de nuevo la provincia o prueba más tarde.'
      );
    } finally {
      setIsLoadingMunicipalities(false);
    }
  };

  const handleMunicipalityChange = async (value: string) => {
    setSelectedMunicipality(value);
    setStreets([]);
    setSelectedStreet('');
    setStreetType('');
    setStreetName('');
    setError(null);

    if (!selectedProvince || !value) return;
  };

  // Cargar vías cuando se selecciona un municipio y se escribe algo
  useEffect(() => {
    if (selectedProvince && selectedMunicipality && streetName.length >= 2 && streetType) {
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

  const buildAddressParams = (): CatastroAddressParams | null => {
    const province = provinces.find((p) => p.codigo === selectedProvince);
    const municipality = municipalities.find((m) => m.nombreMunicipio === selectedMunicipality);
    
    // Obtener detalles de la vía seleccionada
    const via = streets.find(v => v.codigoVia === selectedStreet);

    if (!province || !municipality || !selectedStreet || !via || !numero.trim()) {
      setError(
        'La provincia, el municipio, la vía y el número son obligatorios. ' +
          'Por favor, revisa que todos esos campos estén correctamente rellenados.'
      );
      return null;
    }

    return {
      provincia: province.nombre,
      municipio: municipality.nombreMunicipio,
      siglaVia: via.tipoVia || streetType, // Fallback al tipo seleccionado si no viene en el vía
      calle: via.nombreVia,
      numero: numero.trim(),
      bloque: bloque.trim() || undefined,
      escalera: escalera.trim() || undefined,
      planta: planta.trim() || undefined,
      puerta: puerta.trim() || undefined,
    };
  };

  const handleSearchError = (err: any, method: SearchMethod) => {
    let errorMessage = 'No se pudo obtener la información desde Catastro. Por favor, inténtalo de nuevo.';
    
    if (err instanceof Error) {
      const message = err.message;
      if (message && !message.includes('Cannot read') && 
          !message.includes('null') && 
          !message.includes('undefined') &&
          !message.includes('TypeError') &&
          !message.includes('ReferenceError') &&
          !message.includes('reading')) {
        errorMessage = message;
      }
    } else if (typeof err === 'string') {
      if (!err.includes('Cannot read') && 
          !err.includes('null') && 
          !err.includes('undefined')) {
        errorMessage = err;
      }
    }

    if (
      errorMessage ===
      'No se pudo obtener la información desde Catastro. Por favor, inténtalo de nuevo.'
    ) {
      if (method === 'address') {
        errorMessage =
          'No se pudo obtener la información desde Catastro para la dirección indicada.\n\n' +
          'Te sugerimos:\n' +
          '• Verificar que la dirección esté completa y sea correcta\n' +
          '• Probar sin especificar bloque, escalera, planta o puerta\n' +
          '• Contactar con soporte si el problema persiste';
      } else {
        errorMessage =
          'No se pudo obtener la información desde Catastro para la referencia catastral indicada.\n\n' +
          'Te sugerimos:\n' +
          '• Verificar que el código catastral sea correcto y esté completo\n' +
          '• Intentar buscar por dirección si el problema persiste\n' +
          '• Contactar con soporte si el problema persiste';
      }
    }
    
    setError(errorMessage);
  };

  const handleSearch = async () => {
    if (!buildingId) {
      setError('No se ha especificado el edificio');
      return;
    }

    let xml = '';

    if (searchMethod === 'address') {
      const params = buildAddressParams();
      if (!params) return;

      setIsLoading(true);
      setError(null);

      try {
        xml = await fetchCatastroUnitsXmlByAddress(params);
      } catch (err: any) {
        handleSearchError(err, 'address');
        setIsLoading(false);
        return;
      }
    } else {
      const trimmedRc = rc.trim();
      if (!trimmedRc) {
        setError('El código catastral es obligatorio.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        xml = await fetchCatastroUnitsXmlByRC(trimmedRc);
      } catch (err: any) {
        handleSearchError(err, 'rc');
        setIsLoading(false);
        return;
      }
    }

    try {
      const units = parseCatastroUnitsFromXml(xml);

      if (!units || units.length === 0) {
        setError(
          'No se encontraron unidades en Catastro.\n\n' +
            'Esto suele deberse a que los datos no coinciden exactamente con los registros de Catastro o a que el inmueble no tiene unidades constructivas publicadas.\n\n' +
            'Prueba con otro método de búsqueda o crea las unidades manualmente.'
        );
        return;
      }

      // Llamar al callback con las unidades creadas
      onUnitsCreated(units);
    } catch (err: any) {
      handleSearchError(err, searchMethod);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 bg-blue-50 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('unitWizard.loadFromCatastro', 'Cargar desde Catastro')}
            </h1>
            <p className="text-gray-600">
              {t(
                'unitWizard.loadFromCatastroDesc',
                'Selecciona la dirección del edificio para importar automáticamente sus unidades desde Catastro. Podrás revisarlas y ajustarlas antes de guardarlas.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Selector de método */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('searchMethod', 'Método de búsqueda')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchMethod('rc');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              searchMethod === 'rc'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span className="text-sm font-medium">{t('searchByRC', 'Por Código Catastral')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMethod('address');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              searchMethod === 'address'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{t('searchByAddress', 'Por Dirección')}</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {searchMethod === 'rc' ? (
          /* Búsqueda por RC */
          <div className="space-y-4">
            <div>
              <label htmlFor="rc" className="block text-sm font-medium text-gray-700 mb-2">
                {t('catastralCode', 'Código Catastral (RC)')} *
              </label>
              <input
                id="rc"
                type="text"
                value={rc}
                onChange={(e) => {
                  setRc(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) handleSearch();
                }}
                placeholder={t('catastralReferencePlaceholder', 'Ej: 1234567VK1234A0001WX')}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-gray-500">
                Usa el código de 14 o 20 caracteres del inmueble.
              </p>
            </div>
          </div>
        ) : (
          /* Búsqueda por Dirección */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Provincia */}
          <AutocompleteField
            label="Provincia *"
            value={selectedProvince}
            options={provinces.map(p => ({ id: p.codigo, label: p.nombre }))}
            onChange={handleProvinceChange}
            placeholder={isLoadingProvinces ? 'Cargando provincias…' : 'Selecciona una provincia'}
            disabled={isLoading || isLoadingProvinces}
          />

          {/* Municipio */}
          <AutocompleteField
            label="Municipio *"
            value={selectedMunicipality}
            options={municipalities.map(m => ({ id: m.nombreMunicipio, label: m.nombreMunicipio }))}
            onChange={handleMunicipalityChange}
            placeholder={!selectedProvince ? 'Selecciona primero una provincia' : isLoadingMunicipalities ? 'Cargando municipios…' : 'Selecciona un municipio'}
            disabled={!selectedProvince || isLoading || isLoadingMunicipalities}
          />

        </div>

        {/* Tipo de vía + Nombre de calle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AutocompleteField
            label="Tipo de Calle"
            value={streetType}
            options={STREET_TYPES.map(st => ({ id: st.value, label: st.label }))}
            onChange={(val) => {
              setStreetType(val);
              setError(null);
            }}
            placeholder="Ej: Calle"
            disabled={isLoading || !selectedMunicipality}
          />

          <div>
            <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Calle
            </label>
            <input
              id="streetName"
              type="text"
              value={streetName}
              onChange={(e) => {
                setStreetName(e.target.value);
                setError(null);
              }}
              placeholder="Ej: Alcalá"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading || !selectedMunicipality}
            />
          </div>
        </div>

        {/* Vía (Selection) */}
        <AutocompleteField
          label="Calle *"
          value={selectedStreet}
          options={streets.map(s => ({ 
            id: s.codigoVia, 
            label: `${s.tipoVia ? s.tipoVia + ' ' : ''}${s.nombreVia}` 
          }))}
          onChange={(val) => {
            setSelectedStreet(val);
            setError(null);
          }}
          placeholder="Selecciona una calle"
          disabled={isLoading || !selectedMunicipality}
          loading={isLoading && streets.length === 0 && streetName.length >= 2}
        />

        {/* Número + Opcionales */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de portal *
            </label>
            <input
              type="text"
              value={numero}
              onChange={(e) => {
                setNumero(e.target.value);
                setError(null);
              }}
              placeholder="Ej.: 10"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bloque
            </label>
            <input
              type="text"
              value={bloque}
              onChange={(e) => setBloque(e.target.value)}
              placeholder="Ej.: 1"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escalera
            </label>
            <input
              type="text"
              value={escalera}
              onChange={(e) => setEscalera(e.target.value)}
              placeholder="Ej.: A"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planta
            </label>
            <input
              type="text"
              value={planta}
              onChange={(e) => setPlanta(e.target.value)}
              placeholder="Ej.: 1, 02, BJ"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puerta
            </label>
            <input
              type="text"
              value={puerta}
              onChange={(e) => setPuerta(e.target.value)}
              placeholder="Ej.: A, B, 1"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
            </div>
          </>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-900 mb-2">
                {t('unitWizard.errorTitle', 'Error al buscar la unidad')}
              </p>
              <div className="text-sm text-red-800 leading-relaxed whitespace-pre-line space-y-1.5">
                {error.split('\n').map((line, index) => {
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
              
              {!error.includes('💡') && !error.includes('Consejo') && (
                <div className="mt-3 pt-3 border-t border-red-200 bg-red-100/30 p-3 rounded">
                  <p className="text-xs font-medium text-red-800 mb-1">💡 Consejos útiles:</p>
                  <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc">
                    <li>Verifica que provincia, municipio, tipo de vía, nombre de la calle y número coinciden con los datos oficiales del catastro.</li>
                    <li>Si has rellenado bloque, escalera, planta o puerta, prueba a buscar solo con la dirección básica (sin esos campos opcionales).</li>
                    <li>Es posible que el edificio no tenga las unidades constructivas publicadas en Catastro. En ese caso, crea las unidades manualmente desde el asistente.</li>
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

        {error && (
          <button
            type="button"
            onClick={onGoManual}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('units.createUnitsManually', 'Crear unidades manualmente')}
          </button>
        )}
      </div>

      <SupportContactModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        initialCategory="technical"
        initialSubject={t('units.catastroError', 'Problema al buscar unidad en Catastro')}
        context={`Create Unit from Catastro - ${window.location.href}`}
      />
    </div>
  );
};

export default CreateUnitFromCatastro;

