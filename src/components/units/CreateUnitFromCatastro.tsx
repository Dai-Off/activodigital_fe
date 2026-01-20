// src/components/units/CreateUnitFromCatastro.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { SupportContactModal } from '../SupportContactModal';
import { UnitsApiService } from '../../services/unitsApi';

interface CreateUnitFromCatastroProps {
  onUnitsCreated: (units: any[]) => void;
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
  const [cadastralCode, setCadastralCode] = useState('');

  const handleSearch = async () => {
    if (!buildingId) {
      setError('No se ha especificado el edificio');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const trimmedCode = cadastralCode.trim();
      if (!trimmedCode) {
        setError('El código catastral es obligatorio.\n\nPor favor, ingresa el código completo del edificio. Puedes encontrarlo en:\n• Escrituras de propiedad\n• Recibos del IBI (Impuesto de Bienes Inmuebles)\n• Certificados catastrales');
        setIsLoading(false);
        return;
      }
      
      // Llamar al endpoint del backend para importar unidades desde catastro
      const units = await UnitsApiService.importFromCatastro(buildingId, trimmedCode);
      
      if (!units || units.length === 0) {
        setError('No se encontraron unidades en el catastro para el código ingresado.\n\nPosibles causas:\n• El código catastral no corresponde a un edificio con unidades registradas\n• El código es incorrecto o incompleto\n• El inmueble no tiene unidades constructivas en el catastro');
        setIsLoading(false);
        return;
      }

      // Llamar al callback con las unidades creadas
      onUnitsCreated(units);
    } catch (err: any) {
      let errorMessage = 'No se pudo obtener la información desde catastro. Por favor, inténtalo de nuevo.';
      
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

      // Manejar errores HTTP específicos
      if (err?.status === 400) {
        errorMessage = 'El código catastral ingresado no es válido.\n\nPor favor, verifica:\n• Que el código tenga entre 14 y 20 caracteres\n• Que no contenga espacios ni símbolos especiales\n• Que hayas copiado el código completo';
      } else if (err?.status === 404) {
        errorMessage = 'No se encontró ningún inmueble con el código catastral ingresado.\n\nPosibles causas:\n• El código catastral es incorrecto o incompleto\n• El inmueble no está registrado en el catastro\n• El código corresponde a un terreno u otro tipo de bien\n\n💡 Consejo: Verifica el código en documentos oficiales como escrituras o recibos del IBI.';
      } else if (err?.status === 500) {
        errorMessage = 'El servicio de catastro está experimentando problemas técnicos en este momento.\n\nPor favor, inténtalo de nuevo en unos minutos.';
      }
      
      if (errorMessage === 'No se pudo obtener la información desde catastro. Por favor, inténtalo de nuevo.') {
        errorMessage = 'No se pudo obtener la información desde catastro con el código ingresado.\n\nTe sugerimos:\n• Verificar que el código esté completo y correcto\n• Contactar con soporte si el problema persiste';
      }
      
      setError(errorMessage);
      console.error('Error técnico al buscar unidades en catastro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('unitWizard.loadFromCatastro', 'Cargar desde Catastro')}
        </h1>
        <p className="text-gray-600">
          {t(
            'unitWizard.loadFromCatastroDesc',
            'Ingresa el código catastral del edificio para importar automáticamente todas sus unidades desde catastro'
          )}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        {/* Búsqueda por Código Catastral */}
        <div>
          <label htmlFor="cadastralCode" className="block text-sm font-medium text-gray-700 mb-2">
            {t('unitWizard.cadastralCode', 'Código Catastral')} *
          </label>
          <input
            id="cadastralCode"
            type="text"
            value={cadastralCode}
            onChange={(e) => {
              setCadastralCode(e.target.value);
              setError(null);
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('unitWizard.cadastralCodePlaceholder', 'Ej: 1249023VK4714G0001FH')}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
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

