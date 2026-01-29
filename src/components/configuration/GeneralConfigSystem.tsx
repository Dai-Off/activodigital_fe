import React, { useEffect, useMemo } from 'react';
import {
  Settings,
  Globe,
  Bell,
  Key,
  Database,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '~/contexts/LanguageContext';
import { useAuth } from '~/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ConfigItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  fullWidth?: boolean;
}

const GeneralConfigSystem: React.FC = () => {

  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  const translate = (key: string, defaultValue?: string): string => {
    return t ? t(key, defaultValue) : (defaultValue || key);
  };

  const languageOptions = [
    { label: translate('spanish'), code: 'ES' as const },
    { label: translate('english'), code: 'EN' as const },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value as any;
    if (setLanguage) {
      setLanguage(selectedCode);
    }
  };

  const menuItems: ConfigItem[] = useMemo(() => [
    {
      id: 'generalConfig',
      title: 'General',
      description: translate('timezoneAndPreferences'),
      icon: Globe, iconColor: 'text-blue-600', bgColor: 'bg-blue-100'
    },
    {
      id: 'notification',
      title: translate('notifications'),
      description: translate('manageAlertsAndNotices'),
      icon: Bell, iconColor: 'text-orange-600', bgColor: 'bg-orange-100'
    },
    {
      id: 'intregration',
      title: translate('integrations'),
      description: translate('connectWithOtherTools'),
      icon: Globe, iconColor: 'text-purple-600', bgColor: 'bg-purple-100'
    },
    {
      id: 'security',
      title: translate('security'),
      description: translate('passwordsAndAuthentication'),
      icon: Key, iconColor: 'text-red-600', bgColor: 'bg-red-100'
    },
    {
      id: 'BackUpAndRestauration',
      title: translate('backupAndRestoration'),
      description: translate('backupsAndDataRecovery'),
      icon: Database, iconColor: 'text-green-600', bgColor: 'bg-green-100', fullWidth: true
    },
  ], [language, t]);

  const navigate = useNavigate();

  return (
    <div className="max-w-[1400px] mx-auto p-3 md:p-6 space-y-3 md:space-y-4 font-sans text-gray-900">

      {/* Header Principal */}
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-2.5 bg-gray-100 rounded-lg flex-shrink-0">
            <Settings className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold">
              {translate('systemConfiguration')}
            </h2>
            <p className="text-[10px] md:text-xs text-gray-500">
              {translate('generalARKIAsettings')}
            </p>
          </div>
        </div>
      </header>

      {/* Grid de Navegación */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {menuItems.map((item) => (
          <div key={item.id} className={`${item.fullWidth ? 'sm:col-span-2' : ''}`} onClick={() => navigate(`/configuration?view=${item.id}`)}  >
            <ConfigCard item={item} />
          </div>
        ))}
      </section>

      {/* Panel de Configuración Rápida */}
      <main className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
        <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4 pb-2 md:pb-3 border-b border-gray-200">
          {translate('quickSetup')}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {/* Formulario de Preferencias */}
            <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
              <SectionTitle icon={Globe} iconColor="text-blue-600" title={translate('generalPreferences')} />
              <div className="space-y-2 mt-3">
                <div>
                  <label className="text-[10px] md:text-xs text-gray-600 mb-1 block font-medium">
                    {translate('language')}
                  </label>
                  <select
                    value={language} // Vincula el valor al estado global
                    onChange={handleLanguageChange} // Ejecuta el cambio global
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[10px] md:text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 transition-all"
                  >
                    {languageOptions.map(opt => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <SelectInput
                  label={translate('timezone')}
                  options={['Europe/Madrid (GMT+1)', 'America/New_York (GMT-5)']}
                />
                <SelectInput
                  label={translate('dateformat')}
                  options={['DD/MM/YYYY', 'YYYY-MM-DD']}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Info de Cuenta */}
            <div className="p-3 md:p-4 border border-gray-200 rounded-lg h-fit">
              <SectionTitle icon={Users} iconColor="text-purple-600" title={translate('accountInformation')} />
              <div className="space-y-1.5 mt-3">
                <DataRow label={translate('user')} value={user?.email || 'No disponible'} />
                <DataRow label={translate('plan')} value="Enterprise" valueClass="text-blue-600 font-semibold" />
                <DataRow label={translate('licenses')} value={`50 ${translate('actives')}`} />
                <DataRow label={translate('lastAccess')} value={translate('today')} />
              </div>
            </div>

            {/* Alert Banner */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
              <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-blue-900 mb-0.5">{translate('quickAccess')}</p>
                <p className="text-blue-700">
                  {translate('useSideNavigationShortcuts')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ConfigCard: React.FC<{ item: ConfigItem }> = ({ item }) => (
  <button className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 hover:border-[#1e3a8a] hover:shadow-md transition-all group outline-none focus:ring-2 focus:ring-blue-500">
    <div className="flex items-center gap-2 md:gap-3">
      <div className={`p-2 md:p-2.5 ${item.bgColor} rounded-lg flex-shrink-0 transition-colors`}>
        <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.iconColor}`} />
      </div>
      <div>
        <h3 className="text-sm md:text-base font-medium group-hover:text-[#1e3a8a]">{item.title}</h3>
        <p className="text-[10px] md:text-xs text-gray-500">{item.description}</p>
      </div>
    </div>
  </button>
);

const SectionTitle: React.FC<{ icon: LucideIcon, iconColor: string, title: string }> = ({ icon: Icon, iconColor, title }) => (
  <div className="flex items-center gap-2">
    <Icon className={`w-4 h-4 ${iconColor}`} />
    <h4 className="text-xs md:text-sm font-medium">{title}</h4>
  </div>
);

const SelectInput: React.FC<{ label: string, options: string[] }> = ({ label, options }) => (
  <div>
    <label className="text-[10px] md:text-xs text-gray-600 mb-1 block font-medium">{label}</label>
    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[10px] md:text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 transition-all">
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const DataRow: React.FC<{ label: string, value: string, valueClass?: string }> = ({ label, value, valueClass = "text-gray-900" }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
    <span className="text-[10px] md:text-xs text-gray-500">{label}</span>
    <span className={`text-[10px] md:text-xs ${valueClass}`}>{value}</span>
  </div>
);

export default GeneralConfigSystem;