import React, { useMemo } from 'react';
import { t } from "i18next";
import { Globe } from 'lucide-react';

// --- Interfaces ---
interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  isConnected: boolean;
}

const IntegrationsSettings: React.FC = () => {
  // Datos de las integraciones
  const integrations: Integration[] = useMemo(() => [
    { id: '1', name: 'Google Drive', category: t('Storage', 'Almacenamiento'), description: t('Document synchronization', 'Sincronización de documentos'), isConnected: true },
    { id: '2', name: 'Dropbox', category: t('Storage', 'Almacenamiento'), description: t('File backup', 'Backup de archivos'), isConnected: false },
    { id: '3', name: 'Microsoft 365', category: t('Productivity', 'Productividad'), description: t('Office integration', 'Integración de Office'), isConnected: true },
    { id: '4', name: 'Slack', category: t('Communication', 'Comunicación'), description: t('Real-time notifications', 'Notificaciones en tiempo real'), isConnected: false },
    { id: '5', name: 'Zapier', category: t('Automation', 'Automatización'), description: t('Automated workflows', 'Flujos de trabajo automatizados'), isConnected: false },
    { id: '6', name: 'Trello', category: t('Management', 'Gestión'), description: t('Task management', 'Gestión de tareas'), isConnected: false },
    { id: '7', name: 'Asana', category: t('Management', 'Gestión'), description: t('Project tracking', 'Seguimiento de proyectos'), isConnected: false },
    { id: '8', name: 'OneDrive', category: t('Storage', 'Almacenamiento'), description: t('Cloud storage', 'Almacenamiento en la nube'), isConnected: true },
    { id: '9', name: 'Mailchimp', category: t('Marketing', 'Marketing'), description: t('Email campaigns', 'Campañas de email'), isConnected: false },
    { id: '10', name: 'QuickBooks', category: t('Accounting', 'Contabilidad'), description: t('Financial management', 'Gestión financiera'), isConnected: false },
  ], []);

  // Contadores dinámicos
  const activeCount = integrations.filter(i => i.isConnected).length;
  const categoriesCount = new Set(integrations.map(i => i.category)).size;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Globe className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{t('Integrations', 'Integraciones')}</h2>
            <p className="text-xs text-gray-500">{t('Connect ARKIA with other tools', 'Conecta ARKIA con otras herramientas')}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StatCard label={t('Active', 'Activas')} value={activeCount} bgColor="bg-green-50" textColor="text-green-600" />
        <StatCard label={t('Available', 'Disponibles')} value={integrations.length} bgColor="bg-gray-50" textColor="text-gray-600" />
        <StatCard label={t('Categories', 'Categorías')} value={categoriesCount} bgColor="bg-blue-50" textColor="text-blue-600" />
      </div>

      {/* Listado de Integraciones */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {integrations.map((item) => (
          <IntegrationRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

// --- Sub-componentes ---

const StatCard: React.FC<{ label: string; value: number; bgColor: string; textColor: string }> = ({ label, value, bgColor, textColor }) => (
  <div className={`p-3 ${bgColor} rounded-lg`}>
    <p className="text-xs text-gray-600 mb-1">{label}</p>
    <p className={`text-lg font-bold ${textColor}`}>{value}</p>
  </div>
);

const IntegrationRow: React.FC<{ item: Integration }> = ({ item }) => (
  <div className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors group">
    <div className="flex items-center gap-3 flex-1">
      <div className={`p-2 rounded-lg ${item.isConnected ? 'bg-green-50' : 'bg-gray-50'}`}>
        <Globe className={`w-4 h-4 ${item.isConnected ? 'text-green-600' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-bold text-gray-900">{item.name}</p>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] uppercase tracking-wider font-medium">
            {item.category}
          </span>
        </div>
        <p className="text-xs text-gray-500">{item.description}</p>
      </div>
      <div className="hidden md:block text-xs mr-4">
        {item.isConnected ? (
          <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-medium">
            {t('Connected', 'Conectado')}
          </span>
        ) : (
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 font-medium">
            {t('Not connected', 'No conectado')}
          </span>
        )}
      </div>
    </div>
    
    {item.isConnected ? (
      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
        {t('Disconnect', 'Desconectar')}
      </button>
    ) : (
      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1e3a8a] text-white hover:bg-blue-800 transition-colors shadow-sm">
        {t('Connect', 'Conectar')}
      </button>
    )}
  </div>
);

export default IntegrationsSettings;