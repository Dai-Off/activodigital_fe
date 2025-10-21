import { useTranslation } from 'react-i18next';

export default function Documentos() {
  const { t } = useTranslation();
  return (
    <div className="section animate-fadeInUp">
  <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">{t('documents', 'Repositorio Documental')}</h2>
      <div className="flex justify-between items-center mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M16 16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
            <polyline points="22 2 22 8 16 8" />
          </svg>
          <span>{t('uploadDocument', 'Subir documento')}</span>
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>{t('allCategories', 'Todas las categorías')}</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>{t('allSystems', 'Todos los sistemas')}</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>{t('signatureStatus', 'Estado de firma')}</option>
          </select>
          <div className="relative">
            <input type="text" placeholder={t('searchDocuments', 'Buscar documentos...')} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-4">{t('document', 'Documento')}</div>
            <div className="col-span-2">{t('category', 'Categoría')}</div>
            <div className="col-span-2">{t('system', 'Sistema')}</div>
            <div className="col-span-2">{t('date', 'Fecha')}</div>
            <div className="col-span-1">Estado</div>
            <div className="col-span-1">Acciones</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {/* Manual HVAC Sistema Principal */}
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Manual HVAC Sistema Principal</p>
                  <p className="text-sm text-gray-500">Version 2.1</p>
                </div>
              </div>
              <div className="col-span-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">Manual</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">HVAC</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">15/03/2024</span>
              </div>
              <div className="col-span-1">
                <span className="inline-flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </span>
              </div>
              <div className="col-span-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Certificado Eficiencia Energética */}
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Certificado Eficiencia Energética</p>
                  <p className="text-sm text-gray-500">CEE-2024-001</p>
                </div>
              </div>
              <div className="col-span-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md">Certificado</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">General</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">01/04/2024</span>
              </div>
              <div className="col-span-1">
                <span className="inline-flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </span>
              </div>
              <div className="col-span-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Planos As-Built Estructura */}
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 flex items-center space-x-3">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Planos As-Built Estructura</p>
                  <p className="text-sm text-gray-500">EST-AB-2024.dwg</p>
                </div>
              </div>
              <div className="col-span-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-md">As-Built</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">Estructura</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">20/02/2024</span>
              </div>
              <div className="col-span-1">
                <span className="inline-flex items-center space-x-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                </span>
              </div>
              <div className="col-span-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
