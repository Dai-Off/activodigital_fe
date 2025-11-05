# Arkia - Frontend

Plataforma web para la gestión digital de edificios y cumplimiento normativo.

## Tecnologías

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Deployment:** Fly.io
- **CI/CD:** GitHub Actions
- **Backend:** Node.js + Express + Supabase (repositorio separado)

## Prerrequisitos

- Node.js 20+ (recomendado 22)
- npm o yarn
- Git
- Cuenta de Fly.io (para deployment)

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd activodigital_fe
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_BASE=https:https://activodigital-be.fly.dev
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Layout.tsx      # Layout principal con navbar
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Login.tsx       # Formulario de login
│   ├── Register.tsx    # Formulario de registro
│   ├── Landing.tsx     # Página de inicio
│   └── ...             # Otros componentes
├── services/           # Servicios de API
│   ├── api.ts          # Configuración base de API
│   └── auth.ts         # Servicios de autenticación
├── App.tsx             # Componente raíz con rutas
└── main.tsx            # Punto de entrada
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con HMR
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar ESLint

## Deployment

### Configuración Automática (Recomendado)

El proyecto está configurado con GitHub Actions para deploy automático:

1. **Configurar secreto en GitHub:**
   - Ve a Settings → Secrets and variables → Actions
   - Agrega `FLY_API_TOKEN` con el token de Fly.io

2. **Deploy automático:**
   - Cada push a `main` activa el deploy automático
   - El workflow está en `.github/workflows/deploy.yml`

### Deploy Manual

```bash
# Generar token de Fly.io
fly tokens create

# Deploy manual
fly deploy
```

### Configuración de Fly.io

- **App:** edificio-digital
- **Región:** Bogotá (bog)
- **URL:** https://edificio-digital.fly.dev/

## Autenticación

El sistema usa JWT tokens manejados por el backend:

- **Login:** `POST /auth/login`
- **Registro:** `POST /auth/signup`
- **Perfil:** `GET /auth/me`
- **Logout:** Limpia tokens del localStorage/sessionStorage

### Flujo de Autenticación

1. Usuario se registra/inicia sesión
2. Token JWT se almacena en localStorage/sessionStorage
3. Token se incluye automáticamente en todas las peticiones API
4. Al hacer logout se limpian los tokens

## Styling y UI

### Tailwind CSS v4

- Configuración en `tailwind.config.js`
- PostCSS configurado en `postcss.config.js`
- Importado en `src/index.css`

### Componentes

- Diseño responsive y moderno
- Componentes reutilizables
- Consistencia visual en toda la aplicación

## Rutas de la Aplicación

- `/` - Landing page (página de inicio)
- `/login` - Formulario de login
- `/register` - Formulario de registro
- `/dashboard` - Dashboard principal (requiere autenticación)
- `/documentos` - Gestión de documentos
- `/mantenimiento` - Gestión de mantenimiento
- `/cumplimiento` - Gestión de cumplimiento
- `/unidades` - Gestión de unidades
- `/libro-digital` - Libro del edificio

## Configuración de Desarrollo

### ESLint

Configuración TypeScript estricta en `eslint.config.js`

### TypeScript

- Configuración en `tsconfig.json`
- Configuración específica para app en `tsconfig.app.json`
- Configuración para Node en `tsconfig.node.json`

### Vite

- Configuración en `vite.config.ts`
- HMR habilitado para desarrollo
- Build optimizado para producción

## Troubleshooting

### Error de Tailwind CSS v4

Si encuentras errores de PostCSS:

```bash
npm install @tailwindcss/postcss
```

### Error de Build

Si el build falla:

```bash
# Limpiar cache
npm run build -- --force

# Verificar TypeScript
npx tsc --noEmit
```

### Error de Deploy

Si el deploy falla:

1. Verificar que `fly.toml` esté configurado correctamente
2. Verificar que el token de Fly.io sea válido
3. Revisar logs: `fly logs`

## Recursos Adicionales

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Documentación de Fly.io](https://fly.io/docs/)

## Contribución

1. Crear una rama desde `develop`
2. Hacer cambios y commits descriptivos
3. Crear Pull Request a `develop`
4. Después de revisión, mergear a `main` para deploy

## Licencia

Proyecto privado de Arkia.
