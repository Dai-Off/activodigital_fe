import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ChevronDown } from 'lucide-react';
import {
  CatastroApiService,
  type Provincia,
  type Municipio,
  type Via,
} from '../../services/catastroApi';
import type { BuildingAddressData, BuildingLocationValue } from '../../types/location';

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
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedOption = options.find((opt) => opt.id === value);
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
        const selectedOption = options.find((opt) => opt.id === value);
        setSearchTerm(selectedOption ? selectedOption.label : '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, options]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
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
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
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

interface BuildingLocationFormProps {
  initialValue?: BuildingAddressData;
  onConfirm: (value: BuildingLocationValue) => void;
  onCancel: () => void;
}

const BuildingLocationForm: React.FC<BuildingLocationFormProps> = ({
  initialValue,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

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

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingStreets, setLoadingStreets] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar provincias al montar
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const provs = await CatastroApiService.getProvinces();
        setProvinces(provs);
      } catch (err) {
        console.error('Error cargando provincias:', err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Cargar municipios cuando se selecciona una provincia
  useEffect(() => {
    if (!selectedProvince) {
      setMunicipalities([]);
      setSelectedMunicipality('');
      return;
    }

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
  }, [selectedProvince]);

  // Cargar vías cuando se selecciona municipio y se escribe algo
  useEffect(() => {
    if (selectedProvince && selectedMunicipality && streetName.length >= 2 && streetType) {
      const loadStreets = async () => {
        setLoadingStreets(true);
        try {
          const vias = await CatastroApiService.getStreets(
            selectedProvince,
            selectedMunicipality,
            streetName || undefined,
            streetType || undefined,
          );
          setStreets(vias);
        } catch (err) {
          console.error('Error cargando vías:', err);
          setStreets([]);
        } finally {
          setLoadingStreets(false);
        }
      };

      const timer = setTimeout(loadStreets, 500);
      return () => clearTimeout(timer);
    } else {
      setStreets([]);
    }
  }, [selectedProvince, selectedMunicipality, streetName, streetType]);

  // Prefill simple desde initialValue (campos directos)
  useEffect(() => {
    if (!initialValue) return;
    if (initialValue.streetType) setStreetType(initialValue.streetType);
    if (initialValue.streetName) setStreetName(initialValue.streetName);
    if (initialValue.number) setNumber(initialValue.number);
    if (initialValue.stair) setEscalera(initialValue.stair);
    if (initialValue.floor) setPlanta(initialValue.floor);
    if (initialValue.door) setPuerta(initialValue.door);
  }, [initialValue]);

  const handleSubmit = async () => {
    const missingFields: string[] = [];
    if (!selectedProvince) missingFields.push(t('province', 'Provincia'));
    if (!selectedMunicipality) missingFields.push(t('municipality', 'Municipio'));
    if (!selectedStreet) missingFields.push(t('street', 'Vía'));
    if (!number.trim()) missingFields.push(t('number', 'Número de portal'));

    if (missingFields.length > 0) {
      setError(
        `${t(
          'missingAddressFieldsTitle',
          'Faltan campos obligatorios para completar la dirección:',
        )}\n\n${missingFields.map((f) => `• ${f}`).join('\n')}`,
      );
      return;
    }

    setError(null);
    setSubmitLoading(true);

    try {
      const provinceObj = provinces.find((p) => p.codigo === selectedProvince);
      const municipalityObj = municipalities.find(
        (m) => m.nombreMunicipio === selectedMunicipality,
      );
      const via = streets.find((v) => v.codigoVia === selectedStreet);

      const provinceName = provinceObj?.nombre ?? initialValue?.province ?? '';
      const municipalityName = municipalityObj?.nombreMunicipio ?? initialValue?.municipality ?? '';
      const viaLabel = via
        ? `${via.tipoVia ? via.tipoVia + ' ' : ''}${via.nombreVia}`
        : `${streetType ? streetType + ' ' : ''}${streetName}`.trim();

      const parts = [viaLabel, number.trim(), municipalityName, provinceName].filter(Boolean);
      const fullAddress = parts.join(', ');

      const base: BuildingLocationValue = {
        fullAddress,
        province: provinceName || undefined,
        municipality: municipalityName || undefined,
        streetType: via?.tipoVia || streetType || undefined,
        streetName: via?.nombreVia || streetName || undefined,
        number: number.trim() || undefined,
        stair: escalera || undefined,
        floor: planta || undefined,
        door: puerta || undefined,
        postalCode: initialValue?.postalCode,
        country: initialValue?.country || 'España',
        extra: {
          ...(initialValue?.extra || {}),
          provinceCode: provinceObj?.codigo ?? initialValue?.extra?.provinceCode,
          municipalityCode:
            municipalityObj?.codigoMunicipioIne ?? initialValue?.extra?.municipalityCode,
          streetCode: via?.codigoVia ?? initialValue?.extra?.streetCode,
        },
      };

      const geo = await CatastroApiService.geocodeAddress(base.fullAddress);
      if (geo) {
        base.lat = geo.lat;
        base.lng = geo.lng;
      }

      onConfirm(base);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Encabezado del bloque */}
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {t(
            'buildingLocation.addressFormTitle',
            'Selecciona la ubicación por provincia y municipio',
          )}
        </p>
        <p className="mt-1 text-xs text-gray-500 max-w-xl">
          {t(
            'buildingLocation.addressFormSubtitle',
            'Empieza por la provincia y el municipio, luego filtra el tipo de vía y el nombre hasta encontrar la calle exacta. Después indica el número de portal y, si aplica, escalera, planta y puerta.',
          )}
        </p>
        <p className="mt-2 text-[11px] text-gray-400">
          {t('buildingLocation.requiredHint', 'Los campos obligatorios están marcados con *')}
        </p>
      </div>

      {/* Provincia / Municipio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <AutocompleteField
          label={t('province', 'Provincia') + ' *'}
          value={selectedProvince}
          options={provinces.map((p) => ({ id: p.codigo, label: p.nombre }))}
          onChange={(val) => {
            setSelectedProvince(val);
            setError(null);
          }}
          placeholder={t('select', 'Selecciona')}
          disabled={loadingProvinces}
          error={!!error}
        />

        <AutocompleteField
          label={t('municipality', 'Municipio') + ' *'}
          value={selectedMunicipality}
          options={municipalities.map((m) => ({
            id: m.nombreMunicipio,
            label: m.nombreMunicipio,
          }))}
          onChange={(val) => {
            setSelectedMunicipality(val);
            setSelectedStreet('');
            setError(null);
          }}
          placeholder={t('select', 'Selecciona')}
          disabled={!selectedProvince}
          error={!!error}
        />
      </div>

      {/* Tipo de vía / Nombre de la vía */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <AutocompleteField
          label={t('streetType', 'Tipo de Vía')}
          value={streetType}
          options={STREET_TYPES.map((st) => ({ id: st.value, label: st.label }))}
          onChange={(val) => {
            setStreetType(val);
            setError(null);
          }}
          placeholder={t('streetTypePlaceholder', 'Ej: Calle')}
          disabled={!selectedMunicipality}
          error={!!error}
        />

        <div>
          <label
            htmlFor="streetName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t('streetName', 'Nombre de Vía')}
          </label>
          <input
            id="streetName"
            type="text"
            value={streetName}
            onChange={(e) => {
              setStreetName(e.target.value);
              setError(null);
            }}
            placeholder={t('streetNamePlaceholder', 'Ej: Alcalá')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!selectedMunicipality}
          />
        </div>
      </div>

      {/* Vía concreta */}
      <div className="pt-1">
        <AutocompleteField
          label={t('street', 'Vía') + ' *'}
          value={selectedStreet}
          options={streets.map((s) => ({
            id: s.codigoVia,
            label: `${s.tipoVia ? s.tipoVia + ' ' : ''}${s.nombreVia}`,
          }))}
          onChange={(val) => {
            setSelectedStreet(val);
            setError(null);
          }}
          placeholder={t('select', 'Selecciona')}
          disabled={!selectedMunicipality}
          error={!!error}
          loading={loadingStreets && streets.length === 0 && streetName.length >= 2}
        />
      </div>

      {/* Detalle del portal */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-4 md:px-4 md:py-4">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">
          {t('buildingLocation.portalDetails', 'Detalles del portal')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div>
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap"
          >
            {t('buildingLocation.portalNumber', 'N.º portal *')}
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
          />
          </div>

          <div>
          <label htmlFor="escalera" className="block text-sm font-medium text-gray-700 mb-2">
            {t('escalera', 'Escalera')}
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
          />
          </div>

          <div>
          <label htmlFor="planta" className="block text-sm font-medium text-gray-700 mb-2">
            {t('planta', 'Planta')}
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
          />
          </div>

          <div>
          <label htmlFor="puerta" className="block text-sm font-medium text-gray-700 mb-2">
            {t('puerta', 'Puerta')}
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
          />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 whitespace-pre-line shadow-sm">
          {error}
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-100 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('common.cancel', 'Cancelar')}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>
            {t('confirmAddress', 'Confirmar dirección')}
          </span>
        </button>
      </div>
    </div>
  );
};

export default BuildingLocationForm;


