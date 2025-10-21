# Guía de Internacionalización con react-i18next

## 🌍 Configuración actual

La aplicación está configurada con `react-i18next` y soporta 3 idiomas:
- **Español (es)** - Idioma por defecto
- **Inglés (en)**
- **Alemán (de)**

## 📦 Instalación y Setup

Ya está instalado en el proyecto. El archivo de configuración es `src/i18n.ts`.

### Inicialización en la app

En `src/main.tsx`:
```tsx
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
);
```

## 🎯 Uso Básico en Componentes

### 1. Importar el hook
```tsx
import { useTranslation } from 'react-i18next';
```

### 2. Usar en el componente
```tsx
export default function MiComponente() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 3. Con valores por defecto (fallback)
```tsx
<h1>{t('welcome', 'Bienvenido')}</h1>
```

## 🔑 Estructura de Claves

### Claves simples
```tsx
{t('welcome')} // → "Bienvenido"
{t('error')} // → "Error"
```

### Claves anidadas (usando punto)
```tsx
{t('dashboard.completed')} // → "Completado"
{t('footer.help')} // → "¿Necesitas ayuda?"
{t('landing.platformTitle')} // → "Plataforma Gestión..."
```

### Interpolación de variables
```tsx
{t('userMessagesUnread', { name: 'Juan', count: 5 })}
// → "Hola Juan, tienes 5 mensaje(s) sin leer."
```

### Pluralización
```tsx
// En el i18n.ts:
{
  "message_one": "Tienes {{count}} mensaje",
  "message_other": "Tienes {{count}} mensajes"
}

// En el componente:
{t('message', { count: 1 })} // → "Tienes 1 mensaje"
{t('message', { count: 5 })} // → "Tienes 5 mensajes"
```

## 📝 Componente Trans para HTML complejo

Cuando necesitas incluir HTML o componentes dentro del texto:

```tsx
import { Trans } from 'react-i18next';

<Trans i18nKey="userMessagesUnread" count={count}>
  Hola <strong title={t('nameTitle')}>{{name}}</strong>, 
  tienes {{count}} mensaje(s) sin leer. 
  <Link to="/msgs">Ir a mensajes</Link>.
</Trans>
```

## 🗂️ Claves Disponibles

### Generales
- `welcome`, `success`, `error`, `warning`, `info`
- `name`, `value`, `date`, `status`
- `loading`, `comingSoon`

### Dashboard
- `dashboard.completed`, `dashboard.inProgress`
- `dashboard.scheduled`, `dashboard.expired`
- `dashboard.financingAccess`, `dashboard.high`
- `dashboard.digitalBuildingBook`
- `dashboard.installations`, `dashboard.certificates`
- `dashboard.maintenance`, `dashboard.inspections`

### Landing
- `landing.platformForBuildings`
- `landing.platformTitle`, `landing.platformDesc`
- `landing.financialRating`
- `landing.investmentSimulator`
- `landing.smartEnvironmentalFootprint`

### Footer
- `footer.help`, `footer.assistant`
- `footer.product`, `footer.assets`
- `footer.documentation`, `footer.maintenance`

### Assets
- `myAssets`, `assignedAssets`
- `createBuilding`, `assetsList`
- `noAssetsYet`, `noAssignedAssets`
- `createFirstAsset`, `contactAdmin`

### Navegación y Paginación
- `showing`, `of`, `page`, `pageSize`, `perPage`
- `firstPage`, `previous`, `next`, `lastPage`

### Estados
- `completed`, `pending`, `ready`, `inProgress`

### Documentos
- `documentManagement`, `uploadDocument`
- `allCategories`, `allSystems`
- `searchDocuments`, `document`, `category`

### Autenticación
- `login`, `register`, `loginTitle`, `loginSubtitle`
- `invalidInvitation`, `invitedTitle`
- `registerNormally`, `registerSubtitle`

### Calendario
- `daySun`, `dayMon`, `dayTue`, `dayWed`, `dayThu`, `dayFri`, `daySat`

### Edificios
- `buildingName`, `buildingAddress`
- `yearBuilt`, `surface`, `rooms`
- `energyRating`, `carbonFootprint`

## 🛠️ Cambiar idioma

### Con el componente LanguageSwitcher
```tsx
import LanguageSwitcher from './components/LanguageSwitcher';

<LanguageSwitcher />
```

### Programáticamente
```tsx
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();

// Cambiar a español
i18n.changeLanguage('es');

// Cambiar a inglés
i18n.changeLanguage('en');

// Cambiar a alemán
i18n.changeLanguage('de');
```

## ✅ Buenas Prácticas

### 1. **Siempre usa claves descriptivas**
```tsx
// ❌ Mal
{t('text1')}

// ✅ Bien
{t('welcomeMessage')}
{t('dashboard.completed')}
```

### 2. **Agrupa claves relacionadas**
```tsx
// ✅ Buena estructura
dashboard: {
  completed: 'Completado',
  inProgress: 'En progreso',
  scheduled: 'Programado'
}
```

### 3. **Usa valores por defecto en desarrollo**
```tsx
{t('nuevaClave', 'Texto por defecto')}
```

### 4. **Mantén consistencia entre idiomas**
Todas las claves deben existir en los 3 idiomas (es, en, de).

### 5. **Para textos con HTML, usa Trans**
```tsx
// ❌ Evita esto
<div dangerouslySetInnerHTML={{ __html: t('htmlText') }} />

// ✅ Mejor usa Trans
<Trans i18nKey="htmlText">
  Texto con <strong>negrita</strong>
</Trans>
```

## 📋 Checklist al agregar nuevas traducciones

- [ ] Agregar clave en español (`es.translation`)
- [ ] Agregar clave en inglés (`en.translation`)
- [ ] Agregar clave en alemán (`de.translation`)
- [ ] Verificar que la clave esté en la estructura correcta
- [ ] Probar con los 3 idiomas
- [ ] Compilar sin errores: `yarn tsc --noEmit src/i18n.ts`

## 🔍 Debugging

### Ver idioma actual
```tsx
const { i18n } = useTranslation();
console.log('Idioma actual:', i18n.language);
```

### Ver todas las traducciones cargadas
```tsx
console.log('Recursos:', i18n.store.data);
```

### Detectar claves faltantes
Si ves el nombre de la clave en lugar de la traducción, significa que falta en el idioma actual:
```tsx
// Si ves "dashboard.newKey" en pantalla
// → Falta agregar esa clave al idioma actual
```

## 🚀 Comandos Útiles

```bash
# Verificar sintaxis del i18n.ts
yarn tsc --noEmit src/i18n.ts

# Compilar proyecto completo
yarn build

# Ejecutar en desarrollo
yarn dev
```

## 📚 Recursos

- [Documentación oficial react-i18next](https://react.i18next.com/)
- [i18next documentation](https://www.i18next.com/)
- [Archivo de configuración: src/i18n.ts](./src/i18n.ts)
