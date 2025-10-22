import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Cookie, Settings, Shield, ChartBar, Megaphone, X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieCategoryProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  id?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const STORAGE_KEYS = {
  CONSENT: 'cookieConsent',
  CONSENT_DATE: 'cookieConsentDate',
} as const;

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const ALL_ACCEPTED_PREFERENCES: CookiePreferences = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

const CookieCategory = ({ 
  icon, 
  title, 
  subtitle, 
  description, 
  checked, 
  disabled = false,
  id,
  onCheckedChange 
}: CookieCategoryProps) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <Label htmlFor={id} className="cursor-pointer">{title}</Label>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
    <p className="text-sm text-gray-600 ml-8">{description}</p>
  </div>
);

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEYS.CONSENT);
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = useCallback((prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(prefs));
    localStorage.setItem(STORAGE_KEYS.CONSENT_DATE, new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  }, []);

  const handleAcceptAll = useCallback(() => {
    savePreferences(ALL_ACCEPTED_PREFERENCES);
  }, [savePreferences]);

  const handleAcceptNecessary = useCallback(() => {
    savePreferences(DEFAULT_PREFERENCES);
  }, [savePreferences]);

  const handleSaveCustom = useCallback(() => {
    savePreferences(preferences);
  }, [preferences, savePreferences]);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handlePreferenceChange = useCallback((key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg animate-slide-in-from-bottom">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="mb-2">Utilizamos cookies</h3>
                <p className="text-gray-600">
                  Utilizamos cookies propias y de terceros para mejorar nuestros servicios, 
                  elaborar información estadística, analizar tus hábitos de navegación e 
                  inferir grupos de interés. Además, compartimos análisis de uso web, 
                  información del dispositivo y publicidad con nuestros partners.
                </p>
                <p className="text-gray-600 mt-2">
                  Puedes aceptar todas las cookies pulsando el botón "Aceptar todas" o 
                  configurarlas o rechazar su uso clicando en "Configurar cookies".
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <a href="#" className="text-blue-600 hover:underline">
                  Política de Cookies
                </a>
                <span className="text-gray-400">•</span>
                <a href="#" className="text-blue-600 hover:underline">
                  Política de Privacidad
                </a>
                <span className="text-gray-400">•</span>
                <a href="#" className="text-blue-600 hover:underline">
                  Aviso Legal
                </a>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={handleAcceptNecessary}
              aria-label="Cerrar y aceptar solo cookies necesarias"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Button onClick={handleAcceptAll} className="bg-blue-600 hover:bg-blue-700">
              Aceptar todas
            </Button>
            <Button onClick={handleAcceptNecessary} variant="outline">
              Solo necesarias
            </Button>
            <Button onClick={handleOpenSettings} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurar cookies
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración de Cookies
            </DialogTitle>
            <DialogDescription>
              Gestiona tus preferencias de cookies. Las cookies necesarias siempre están activas 
              ya que son esenciales para el correcto funcionamiento del sitio web.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <CookieCategory
                icon={<Shield className="w-5 h-5 text-green-600" />}
                title="Cookies Necesarias"
                subtitle="Siempre activas"
                description="Estas cookies son esenciales para el funcionamiento del sitio web y no se pueden desactivar. Se utilizan para servicios como recordar tu sesión, carrito de compra y preferencias de seguridad."
                checked={true}
                disabled={true}
              />

              <Separator />

              <CookieCategory
                icon={<Settings className="w-5 h-5 text-blue-600" />}
                title="Cookies Funcionales"
                subtitle="Mejoran la funcionalidad"
                description="Permiten funciones mejoradas y personalización, como videos, chat en vivo y recordar tus preferencias de idioma o región."
                checked={preferences.functional}
                id="functional"
                onCheckedChange={(checked) => handlePreferenceChange('functional', checked)}
              />

              <Separator />

              <CookieCategory
                icon={<ChartBar className="w-5 h-5 text-purple-600" />}
                title="Cookies Analíticas"
                subtitle="Nos ayudan a mejorar"
                description="Nos ayudan a entender cómo los visitantes interactúan con el sitio web, recopilando información de forma anónima. Esto nos permite mejorar el rendimiento."
                checked={preferences.analytics}
                id="analytics"
                onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
              />

              <Separator />

              <CookieCategory
                icon={<Megaphone className="w-5 h-5 text-orange-600" />}
                title="Cookies de Marketing"
                subtitle="Publicidad personalizada"
                description="Se utilizan para rastrear visitantes en diferentes sitios web y mostrar anuncios relevantes y atractivos para cada usuario, más valiosos para editores y anunciantes."
                checked={preferences.marketing}
                id="marketing"
                onCheckedChange={(checked) => handlePreferenceChange('marketing', checked)}
              />
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2">¿Qué son las cookies?</h4>
                  <p className="text-sm text-gray-600">
                    Las cookies son pequeños archivos de texto que los sitios web que visitas 
                    colocan en tu dispositivo. Se utilizan ampliamente para hacer que los sitios 
                    web funcionen de manera más eficiente y proporcionen información a los propietarios del sitio.
                  </p>
                </div>

                <div>
                  <h4 className="mb-2">¿Cómo utilizamos las cookies?</h4>
                  <p className="text-sm text-gray-600">
                    Utilizamos cookies para diversos fines, incluyendo:
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Garantizar la seguridad y el funcionamiento del sitio</li>
                    <li>Recordar tus preferencias y configuraciones</li>
                    <li>Analizar el tráfico y el uso del sitio</li>
                    <li>Personalizar contenido y publicidad</li>
                    <li>Mejorar tu experiencia de navegación</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2">Tus derechos</h4>
                  <p className="text-sm text-gray-600">
                    Tienes derecho a acceder, rectificar y suprimir tus datos, así como otros 
                    derechos recogidos en la información adicional. Puedes consultar la información 
                    adicional y detallada sobre Protección de Datos en nuestra Política de Privacidad.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="mb-2">Información adicional</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-700">Responsable:</span>{' '}
                      <span className="text-gray-600">Tu Empresa S.L.</span>
                    </p>
                    <p>
                      <span className="text-gray-700">Finalidad:</span>{' '}
                      <span className="text-gray-600">Gestionar el consentimiento de cookies</span>
                    </p>
                    <p>
                      <span className="text-gray-700">Legitimación:</span>{' '}
                      <span className="text-gray-600">Consentimiento del interesado</span>
                    </p>
                    <p>
                      <span className="text-gray-700">Destinatarios:</span>{' '}
                      <span className="text-gray-600">No se cederán datos a terceros salvo obligación legal</span>
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleAcceptNecessary}>
              Solo necesarias
            </Button>
            <Button onClick={handleSaveCustom} className="bg-blue-600 hover:bg-blue-700">
              Guardar preferencias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}