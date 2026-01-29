// src/components/units/CreateUnitFromCatastro.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Search, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { SupportContactModal } from '../SupportContactModal';
import { CatastroApiService, type CatastroAddressParams, fetchCatastroUnitsXmlByAddress, type Municipio, type Provincia } from '../../services/catastroApi';
import { parseCatastroUnitsFromXml, type FrontendUnit } from '../../utils/catastroUnits';

interface CreateUnitFromCatastroProps {
  onUnitsCreated: (units: FrontendUnit[]) => void;
  onCancel: () => void;
}

const CreateUnitFromCatastro: React.FC<CreateUnitFromCatastroProps> = ({
  onUnitsCreated,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { id: buildingId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Estado para selects dependientes (provincia → municipio)
  const [provinces, setProvinces] = useState<Provincia[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipio[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');

  // Inputs manuales para tipo de vía (siglaVia) y nombre de calle
  const [siglaVia, setSiglaVia] = useState<string>('');
  const [calle, setCalle] = useState<string>('');

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
    setSiglaVia('');
    setCalle('');
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
    setSiglaVia('');
    setCalle('');
    setError(null);

    if (!selectedProvince || !value) return;
  };

  const buildAddressParams = (): CatastroAddressParams | null => {
    const province = provinces.find((p) => p.codigo === selectedProvince);
    const municipality = municipalities.find((m) => m.codigo === selectedMunicipality);

    if (!province || !municipality || !siglaVia.trim() || !calle.trim() || !numero.trim()) {
      setError(
        'La provincia, el municipio, el tipo de vía, el nombre de la calle y el número son obligatorios. ' +
          'Por favor, revisa que todos esos campos estén correctamente rellenados.'
      );
      return null;
    }

    return {
      provincia: province.nombre,
      municipio: municipality.nombre,
      siglaVia: siglaVia.trim(),
      calle: calle.trim(),
      numero: numero.trim(),
      bloque: bloque.trim() || undefined,
      escalera: escalera.trim() || undefined,
      planta: planta.trim() || undefined,
      puerta: puerta.trim() || undefined,
    };
  };

  const handleSearch = async () => {
    if (!buildingId) {
      setError('No se ha especificado el edificio');
      return;
    }

    const params = buildAddressParams();
    if (!params) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Llamar al endpoint del backend para obtener el XML de unidades
      const xml = await fetchCatastroUnitsXmlByAddress(params);
      const units = parseCatastroUnitsFromXml(xml);

      if (!units || units.length === 0) {
        setError(
          'No se encontraron unidades en Catastro para la dirección indicada.\n\n' +
            'Posibles causas:\n' +
            '• La dirección no está registrada correctamente en el catastro\n' +
            '• El número de calle es incorrecto o no existe\n' +
            '• Los datos de bloque, escalera, planta o puerta no coinciden\n' +
            '• El inmueble no tiene unidades constructivas registradas'
        );
        setIsLoading(false);
        return;
      }

      // Llamar al callback con las unidades creadas
      onUnitsCreated(units);
    } catch (err: any) {
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
        errorMessage =
          'No se pudo obtener la información desde Catastro para la dirección indicada.\n\n' +
          'Te sugerimos:\n' +
          '• Verificar que la dirección esté completa y sea correcta\n' +
          '• Probar sin especificar bloque, escalera, planta o puerta\n' +
          '• Contactar con soporte si el problema persiste';
      }
      
      setError(errorMessage);
      console.error('Error técnico al buscar unidades en catastro:', err);
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

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Selección de dirección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Provincia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provincia *
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading || isLoadingProvinces}
            >
              <option value="">
                {isLoadingProvinces ? 'Cargando provincias…' : 'Selecciona una provincia'}
              </option>
              {provinces.map((prov) => (
                <option key={prov.codigo} value={prov.codigo}>
                  {prov.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Municipio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Municipio *
            </label>
            <select
              value={selectedMunicipality}
              onChange={(e) => handleMunicipalityChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedProvince || isLoading || isLoadingMunicipalities}
            >
              <option value="">
                {!selectedProvince
                  ? 'Selecciona primero una provincia'
                  : isLoadingMunicipalities
                  ? 'Cargando municipios…'
                  : 'Selecciona un municipio'}
              </option>
              {municipalities.map((mun) => (
                <option key={mun.codigo} value={mun.codigo}>
                  {mun.nombre}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Tipo de vía + Nombre de calle + Número */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de vía (sigla) *
            </label>
            <input
              type="text"
              value={siglaVia}
              onChange={(e) => {
                setSiglaVia(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="Ej.: CL, AV, PZ"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading || !selectedMunicipality}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la calle *
            </label>
            <input
              type="text"
              value={calle}
              onChange={(e) => {
                setCalle(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="Ej.: GOYA, ALCALA"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading || !selectedMunicipality}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número *
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
        </div>

        {/* Datos opcionales: bloque/escalera/planta/puerta */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <li>El código catastral de la unidad suele tener entre 14 y 20 caracteres</li>
                    <li>Asegúrate de copiarlo completo sin espacios ni guiones</li>
                    <li>Puedes encontrarlo en escrituras, recibos del IBI o certificados catastrales</li>
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

