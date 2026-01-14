import React, { useMemo } from 'react';
import { t } from "i18next";
import { Database } from 'lucide-react';

// --- Interfaces ---
interface BackupEntry {
  id: string;
  date: string;
  size: string;
  type: string; // t('Full', 'Completo')
  method: string; // t('Automatic', 'Automático') | t('Manual', 'Manual')
}

const BackupSettings: React.FC = () => {
  // Datos de las copias de seguridad memorizados
  const recentBackups: BackupEntry[] = useMemo(() => [
    { id: 'b1', date: '14/11/2025 03:00', size: '2.5 GB', type: t('Full', 'Completo'), method: t('Automatic', 'Automático') },
    { id: 'b2', date: '13/11/2025 03:00', size: '2.4 GB', type: t('Full', 'Completo'), method: t('Automatic', 'Automático') },
    { id: 'b3', date: '12/11/2025 03:00', size: '2.4 GB', type: t('Full', 'Completo'), method: t('Automatic', 'Automático') },
    { id: 'b4', date: '11/11/2025 03:00', size: '2.4 GB', type: t('Full', 'Completo'), method: t('Automatic', 'Automático') },
    { id: 'b5', date: '10/11/2025 14:30', size: '2.3 GB', type: t('Full', 'Completo'), method: t('Manual', 'Manual') },
    { id: 'b6', date: '10/11/2025 03:00', size: '2.3 GB', type: t('Full', 'Completo'), method: t('Automatic', 'Automático') },
    { id: 'b7', date: '09/11/2025 03:00', size: '2.3 GB', type: t('Full', 'Completo'), method: t('Automatic', 'Automático') },
    { id: 'b8', date: '08/11/2025 03:00', size: '2.2 GB', type: t('Full', 'Completo'), method: t('Automatic', 'Automático') },
  ], []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 font-sans text-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="p-2 bg-green-100 rounded-lg">
          <Database className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-base font-bold">{t('Backup & Restoration', 'Backup y Restauración')}</h2>
          <p className="text-xs text-gray-500">{t('Manage your data backups', 'Gestiona copias de seguridad de tus datos')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatBox label={t('Last Backup', 'Última Copia')} value="14/11/2025 03:00" bgColor="bg-green-50" textColor="text-green-600" />
          <StatBox label={t('Used Space', 'Espacio Usado')} value="19.8 GB" bgColor="bg-blue-50" textColor="text-blue-600" />
          <StatBox label={t('Total Backups', 'Total Copias')} value="8" bgColor="bg-purple-50" textColor="text-purple-600" />
        </div>

        {/* Configuración */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">{t('Backup Configuration', 'Configuración de Backup')}</h3>
          <div className="space-y-2">
            <ToggleItem label={t('Daily automatic backup', 'Backup automático diario')} />
            <ToggleItem label={t('Notify upon completion', 'Notificar al completar')} />
            <ToggleItem label={t('Compress backups', 'Comprimir backups')} defaultChecked />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">
                  {t('Scheduled time', 'Hora programada')}
                </label>
                <input type="time" defaultValue="03:00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">
                  {t('Retention (days)', 'Retención (días)')}
                </label>
                <input type="number" defaultValue="30" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Listado de Copias */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{t('Recent Backups', 'Copias Recientes')}</h3>
            <button className="px-3 py-1.5 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-800 text-xs transition-colors shadow-sm font-medium">
              {t('Create Manual Backup', 'Crear Backup Manual')}
            </button>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {recentBackups.map((backup) => (
              <BackupRow key={backup.id} backup={backup} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-componentes ---

const StatBox: React.FC<{ label: string; value: string; bgColor: string; textColor: string }> = ({ label, value, bgColor, textColor }) => (
  <div className={`p-3 ${bgColor} rounded-lg border border-transparent`}>
    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-600 mb-1">{label}</p>
    <p className={`text-xs font-bold ${textColor}`}>{value}</p>
  </div>
);

const ToggleItem: React.FC<{ label: string; defaultChecked?: boolean }> = ({ label, defaultChecked }) => (
  <label className="flex items-center justify-between py-1.5 cursor-pointer group">
    <span className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    <input type="checkbox" defaultChecked={defaultChecked} className="rounded w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" />
  </label>
);

const BackupRow: React.FC<{ backup: BackupEntry }> = ({ backup }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
    <div className="flex items-center gap-3 flex-1">
      <div className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
        <Database className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-900">{backup.date}</p>
        <div className="flex items-center gap-2 mt-0.5 text-[10px]">
          <span className="text-gray-500 font-medium">{backup.size}</span>
          <span className="text-gray-300">•</span>
          <span className="text-green-600 font-bold uppercase tracking-tighter">{backup.type}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 italic">{backup.method}</span>
        </div>
      </div>
    </div>
    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
      {t('Restore', 'Restaurar')}
    </button>
  </div>
);

export default BackupSettings;