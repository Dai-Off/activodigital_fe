import React, { useMemo } from 'react';
import { t } from "i18next";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  FileText, 
  type LucideIcon 
} from 'lucide-react';

interface NotificationOption {
  label: string;
  defaultChecked?: boolean;
}

interface NotificationSectionProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  options: NotificationOption[];
}

const NotificationSettings: React.FC = () => {
  const emailOptions = useMemo(() => [
    { label: t('Upcoming expirations (30 days)', 'Vencimientos próximos (30 días)'), defaultChecked: true },
    { label: t('Scheduled maintenance', 'Mantenimientos programados'), defaultChecked: true },
    { label: t('New documents', 'Nuevos documentos'), defaultChecked: false },
    { label: t('System updates', 'Actualizaciones del sistema'), defaultChecked: true },
    { label: t('Weekly reports', 'Informes semanales'), defaultChecked: true },
    { label: t('Compliance alerts', 'Alertas de cumplimiento'), defaultChecked: true },
    { label: t('Contract changes', 'Cambios en contratos'), defaultChecked: false },
  ], []);

  const pushOptions = useMemo(() => [
    { label: t('Urgent alerts', 'Alertas urgentes'), defaultChecked: true },
    { label: t('Daily reminders', 'Recordatorios diarios'), defaultChecked: true },
    { label: t('Important updates', 'Actualizaciones importantes'), defaultChecked: true },
    { label: t('Calendar events', 'Eventos del calendario'), defaultChecked: false },
  ], []);

  const summaryOptions = useMemo(() => [
    { label: t('Daily summary', 'Resumen diario'), defaultChecked: true },
    { label: t('Weekly summary', 'Resumen semanal'), defaultChecked: true },
    { label: t('Monthly summary', 'Resumen mensual'), defaultChecked: true },
  ], []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 font-sans text-gray-900">
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-200">
        <div className="p-2 bg-[#1e3a8a]/10 rounded-lg">
          <Bell className="w-6 h-6 text-[#1e3a8a]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('Notifications', 'Notificaciones')}</h2>
          <p className="text-sm text-gray-500">
            {t('Manage system alerts and notices', 'Gestiona alertas y avisos del sistema')}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <NotificationSection 
          title={t('Email Alerts', 'Alertas por Email')} 
          icon={Mail} 
          iconColor="text-[#1e3a8a]" 
          options={emailOptions} 
        />

        <NotificationSection 
          title={t('Push Notifications', 'Notificaciones Push')} 
          icon={Smartphone} 
          iconColor="text-orange-600" 
          options={pushOptions} 
        />

        <div className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">{t('Notification Schedule', 'Horario de Notificaciones')}</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput label={t('Start time', 'Hora de inicio')} defaultValue="08:00" />
              <TimeInput label={t('End time', 'Hora de fin')} defaultValue="20:00" />
            </div>
            <CheckboxItem label={t('Notifications on weekends', 'Notificaciones en fines de semana')} />
          </div>
        </div>

        <NotificationSection 
          title={t('Periodic Summaries', 'Resúmenes Periódicos')} 
          icon={FileText} 
          iconColor="text-green-600" 
          options={summaryOptions} 
        />
      </div>
    </div>
  );
};

const NotificationSection: React.FC<NotificationSectionProps> = ({ title, icon: Icon, iconColor, options }) => (
  <div className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-4">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-1">
      {options.map((opt, index) => (
        <CheckboxItem key={index} label={opt.label} defaultChecked={opt.defaultChecked} />
      ))}
    </div>
  </div>
);

const CheckboxItem: React.FC<{ label: string; defaultChecked?: boolean }> = ({ label, defaultChecked }) => (
  <label className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded transition-colors cursor-pointer group">
    <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    <input 
      type="checkbox" 
      defaultChecked={defaultChecked}
      className="rounded w-5 h-5 border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a] cursor-pointer" 
    />
  </label>
);

const TimeInput: React.FC<{ label: string; defaultValue: string }> = ({ label, defaultValue }) => (
  <div>
    <label className="text-sm text-gray-600 mb-2 block">{label}</label>
    <input 
      type="time" 
      defaultValue={defaultValue}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all" 
    />
  </div>
);

export default NotificationSettings;