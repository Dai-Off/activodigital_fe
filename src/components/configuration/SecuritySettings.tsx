import React, { useMemo } from 'react';
import { t } from "i18next";
import { 
  Key, 
  Shield, 
  Monitor, 
  AlertTriangle, 
  CheckCircle2,
} from 'lucide-react';

// --- Interfaces ---
interface Session {
  id: string;
  device: string;
  location: string;
  time: string;
  ip: string;
  isCurrent?: boolean;
}

interface SecurityEvent {
  id: string;
  title: string;
  date: string;
  type: 'success' | 'warning' | 'error';
}

const SecuritySettings: React.FC = () => {
  const activeSessions: Session[] = useMemo(() => [
    { id: '1', device: 'Chrome - Windows 10', location: 'Madrid, España', time: t('Now', 'Ahora'), ip: '192.168.1.1', isCurrent: true },
    { id: '2', device: 'Safari - iPhone 14', location: 'Madrid, España', time: t('2h ago', 'Hace 2h'), ip: '192.168.1.45' },
    { id: '3', device: 'Firefox - macOS', location: 'Barcelona, España', time: t('1d ago', 'Hace 1d'), ip: '10.0.0.23' },
  ], []);

  const securityEvents: SecurityEvent[] = useMemo(() => [
    { id: 'e1', title: t('Successful login', 'Inicio de sesión exitoso'), date: '14/11/2025 09:15 - Chrome, Madrid', type: 'success' },
    { id: 'e2', title: t('Password updated', 'Contraseña actualizada'), date: '12/11/2025 14:30', type: 'success' },
    { id: 'e3', title: t('Failed login attempt', 'Intento de inicio fallido'), date: '10/11/2025 22:45 - ' + t('Unknown location', 'Ubicación desconocida'), type: 'warning' },
  ], []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 font-sans text-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="p-2 bg-red-100 rounded-lg">
          <Key className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-base font-bold">{t('Security', 'Seguridad')}</h2>
          <p className="text-xs text-gray-500">{t('Security and access configuration', 'Configuración de seguridad y acceso')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Cambiar Contraseña */}
        <section className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">{t('Change Password', 'Cambiar Contraseña')}</h3>
          <div className="space-y-3">
            <PasswordField label={t('Current password', 'Contraseña actual')} />
            <PasswordField label={t('New password', 'Nueva contraseña')} />
            <PasswordField label={t('Confirm password', 'Confirmar contraseña')} />
            <div className="pt-1">
              <button className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-800 text-xs transition-colors">
                {t('Update Password', 'Actualizar Contraseña')}
              </button>
            </div>
          </div>
        </section>

        {/* 2FA */}
        <section className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-600" />
            <h3 className="text-sm font-semibold">{t('Two-Factor Authentication (2FA)', 'Autenticación de Dos Factores (2FA)')}</h3>
          </div>
          <div className="space-y-1">
            <SecurityToggle label={t('Enable 2FA', 'Activar 2FA')} />
            <SecurityToggle label={t('Require on every login', 'Requerir en cada inicio de sesión')} />
            <SecurityToggle label={t('Remember trusted devices', 'Recordar dispositivos confiables')} defaultChecked />
          </div>
        </section>

        {/* Sesiones Activas */}
        <section className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{t('Active Sessions', 'Sesiones Activas')}</h3>
            <button className="text-xs text-red-600 hover:underline font-medium">{t('Close all', 'Cerrar todas')}</button>
          </div>
          <div className="space-y-2">
            {activeSessions.map(session => (
              <SessionItem key={session.id} session={session} />
            ))}
          </div>
        </section>

        {/* Preferencias */}
        <section className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">{t('Security Preferences', 'Preferencias de Seguridad')}</h3>
          <div className="space-y-1">
            <SecurityToggle label={t('Notify suspicious logins', 'Notificar inicios de sesión sospechosos')} defaultChecked />
            <SecurityToggle label={t('Notify password changes', 'Notificar cambios de contraseña')} defaultChecked />
            <SecurityToggle label={t('Auto logout (30 min inactivity)', 'Cerrar sesión automáticamente (30 min inactividad)')} defaultChecked />
            <SecurityToggle label={t('Require password for critical actions', 'Requerir contraseña para acciones críticas')} defaultChecked />
          </div>
        </section>

        {/* Logs de Eventos */}
        <section className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">{t('Recent Security Events', 'Eventos de Seguridad Recientes')}</h3>
          <div className="space-y-3">
            {securityEvents.map(event => (
              <EventLogItem key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Sub-componentes ---

const PasswordField: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <label className="text-[10px] md:text-xs text-gray-600 mb-1 block font-medium">{label}</label>
    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
  </div>
);

const SecurityToggle: React.FC<{ label: string; defaultChecked?: boolean }> = ({ label, defaultChecked }) => (
  <label className="flex items-center justify-between py-1.5 cursor-pointer group">
    <span className="text-xs text-gray-700 group-hover:text-gray-900">{label}</span>
    <input type="checkbox" defaultChecked={defaultChecked} className="rounded w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer" />
  </label>
);

const SessionItem: React.FC<{ session: Session }> = ({ session }) => (
  <div className="p-3 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
    <div className="flex items-start justify-between">
      <div className="flex gap-3">
        <div className="p-2 bg-white rounded-md border border-gray-200">
          <Monitor className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-900 mb-0.5">{session.device}</p>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span>{session.location}</span>
            <span>•</span>
            <span>{session.time}</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">IP: {session.ip}</p>
        </div>
      </div>
      {session.isCurrent ? (
        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-wider border border-green-100">
          {t('Current', 'Actual')}
        </span>
      ) : (
        <button className="text-[10px] font-bold text-red-600 hover:bg-red-50 px-2 py-0.5 rounded transition-colors">
          {t('Terminate', 'Cerrar')}
        </button>
      )}
    </div>
  </div>
);

const EventLogItem: React.FC<{ event: SecurityEvent }> = ({ event }) => (
  <div className="flex items-start gap-3 py-1">
    {event.type === 'success' ? (
      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
    )}
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-900">{event.title}</p>
      <p className="text-[10px] text-gray-500">{event.date}</p>
    </div>
  </div>
);

export default SecuritySettings;