# 📝 Resumen de Cambios - Frontend 2FA

## 🎯 **Objetivo**
Implementar autenticación de dos factores (2FA) obligatoria usando Google Authenticator para todos los usuarios.

---

## 📦 **Nuevas Dependencias**

```json
{
  "dependencies": {
    "react-qr-code": "^2.0.15"
  }
}
```

**Instalación:**
```bash
npm install react-qr-code
```

---

## 📂 **Archivos Modificados**

### **1. `src/services/auth.ts`**

**Nuevas funciones agregadas:**

```typescript
// Setup 2FA - Genera QR code
export async function setup2FA(userId: string): Promise<{
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}> {
  return apiFetch('/auth/setup-2fa', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

// Verificar 2FA durante setup
export async function verify2FASetup(payload: {
  userId: string;
  token: string;
}): Promise<{ success: boolean; message?: string }> {
  return apiFetch('/auth/verify-2fa-setup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Verificar 2FA durante login
export async function verify2FALogin(payload: {
  email: string;
  token: string;
}): Promise<{ 
  success: boolean; 
  access_token?: string; 
  message?: string 
}> {
  return apiFetch('/auth/verify-2fa-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
```

**Tipos actualizados:**
```typescript
// Ahora signupRequest devuelve userId
export async function signupRequest(payload: SignupPayload): Promise<{ 
  message?: string; 
  userId?: string 
}> {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
```

---

### **2. `src/components/Register.tsx`**

**Cambios principales:**

✅ **Nuevos estados:**
```typescript
const [show2FASetup, setShow2FASetup] = useState(false);
const [qrCodeUrl, setQrCodeUrl] = useState('');
const [manualEntryKey, setManualEntryKey] = useState('');
const [twoFactorCode, setTwoFactorCode] = useState('');
const [verifying2FA, setVerifying2FA] = useState(false);
const [error2FA, setError2FA] = useState('');
const [showManualEntry, setShowManualEntry] = useState(false);
const [tempUserId, setTempUserId] = useState('');
```

✅ **Flujo modificado:**
1. Usuario completa formulario de registro
2. Backend crea cuenta y devuelve `userId`
3. Frontend llama a `setup2FA(userId)` y obtiene QR
4. Muestra modal con QR code
5. Usuario escanea con Google Authenticator
6. Usuario introduce código de 6 dígitos
7. Frontend verifica código con `verify2FASetup()`
8. Si es válido, hace login automático con `verify2FALogin()`
9. Redirige al dashboard según rol

✅ **Modal 2FA agregado:**
- Diseño en 3 pasos (Descargar app → Escanear QR → Verificar código)
- Opción de entrada manual del secret
- Función copiar al portapapeles
- Validación del código de 6 dígitos
- Fondo blanco (`bg-white bg-opacity-95`)

---

### **3. `src/components/Login.tsx`**

**Cambios principales:**

✅ **Nuevos estados:**
```typescript
const [show2FAVerification, setShow2FAVerification] = useState(false);
const [twoFactorCode, setTwoFactorCode] = useState('');
const [verifying2FA, setVerifying2FA] = useState(false);
const [error2FA, setError2FA] = useState('');
const [tempEmail, setTempEmail] = useState('');
```

✅ **Flujo modificado:**
1. Usuario introduce email + password
2. Backend valida credenciales (sin devolver token)
3. Frontend muestra modal 2FA
4. Usuario abre Google Authenticator
5. Usuario introduce código actual
6. Frontend verifica con `verify2FALogin()`
7. Si es válido, recibe `access_token`
8. Guarda token y redirige al dashboard

✅ **Modal 2FA integrado:**
- Aparece después de validar credenciales
- Campo numérico para código de 6 dígitos
- Botón de volver (cancelar)
- Integrado en el mismo formulario (sin overlay oscuro)

---

### **4. `src/components/RegisterWithInvitation.tsx`**

**Cambios principales:**

✅ Mismo flujo que `Register.tsx`
✅ Modal 2FA idéntico
✅ Preserva el rol de la invitación
✅ Usa `verify2FALogin()` después de verificar el setup

---

### **5. `src/i18n.ts`**

**Nuevas traducciones agregadas:**

```typescript
// Español
setup2FATitle: 'Configura tu autenticación de dos factores',
setup2FADescription: 'Para mayor seguridad, configura Google Authenticator...',
setup2FAStep1: 'Descarga Google Authenticator en tu móvil',
setup2FAStep2: 'Escanea este código QR con la aplicación',
setup2FAStep3: 'Introduce el código de 6 dígitos que aparece',
downloadGoogleAuth: 'Descargar para Android o iOS',
cannotScanQR: '¿No puedes escanear el QR?',
manualEntry: 'Entrada manual',
manualEntryInstructions: 'Introduce esta clave manualmente...',
copyKey: 'Copiar',
keyCopied: 'Clave copiada',
enter2FACode: 'Introduce tu código de autenticación',
enter2FACodeDesc: 'Abre Google Authenticator y escribe el código...',
codeFromAuthenticator: 'Código de 6 dígitos',
verifying2FA: 'Verificando código...',
verifyCode: 'Verificar código',
invalid2FACode: 'Código inválido. Intenta nuevamente.',
invalid2FACodeLength: 'El código debe tener 6 dígitos',

// Inglés (traducciones equivalentes)
```

---

### **6. `index.html`**

**Cambio:**
```html
<!-- Antes -->
<link rel="icon" type="image/svg+xml" href="/vite.svg" />

<!-- Ahora -->
<link rel="icon" type="image/png" href="/favicon.png" />
```

**Archivo agregado:**
- `public/favicon.png` - Nuevo favicon con diseño de cuadrícula azul

---

## 🎨 **Diseño y UX**

### **Estilo del Modal 2FA:**
- Fondo: `bg-white bg-opacity-95 backdrop-blur-sm`
- Border radius: `rounded-2xl`
- Padding: `p-8`
- Sombra: `shadow-xl`
- Borde: `border border-gray-200`
- Animación: `animate-fadeInUp`

### **Colores:**
- Paso 1 (Descargar): `bg-blue-50 border-blue-100`
- Paso 2 (Escanear): `bg-gray-50 border-gray-200`
- Paso 3 (Verificar): `bg-green-50 border-green-100`

### **Iconos:**
- Lock icon (2FA): Verde con fondo `bg-green-50`
- Números de pasos: Círculos azules con texto blanco

---

## 🔄 **Flujos Completos**

### **Registro Normal:**
```
/register
  ↓
Completar formulario
  ↓
POST /auth/signup → userId
  ↓
POST /auth/setup-2fa → QR code
  ↓
Mostrar modal con QR
  ↓
Usuario escanea con Google Auth
  ↓
POST /auth/verify-2fa-setup → success
  ↓
POST /auth/verify-2fa-login → access_token
  ↓
Guardar token + fetchMe()
  ↓
Redirigir a /activos o /cfo-dashboard
```

### **Registro con Invitación:**
```
/auth/register?token=invite_xxx
  ↓
POST /auth/signup-with-invitation → userId
  ↓
POST /auth/setup-2fa → QR code
  ↓
Modal 2FA (mismo flujo)
  ↓
POST /auth/verify-2fa-setup + verify-2fa-login
  ↓
Redirigir según rol (CFO/Técnico)
```

### **Login:**
```
/login
  ↓
Email + Password
  ↓
POST /auth/login → requiresTwoFactor: true
  ↓
Mostrar modal 2FA
  ↓
Usuario abre Google Auth
  ↓
POST /auth/verify-2fa-login → access_token
  ↓
Guardar token + fetchMe()
  ↓
Redirigir según rol
```

---

## 🧪 **Testing**

### **Casos de Prueba:**

✅ **Registro normal:**
1. Completar formulario
2. Ver QR code
3. Escanear con Google Auth
4. Introducir código válido
5. Login automático exitoso

✅ **Registro con invitación:**
1. Usar link con token
2. Completar formulario
3. Setup 2FA
4. Verificar rol correcto (CFO/Técnico)

✅ **Login:**
1. Email + password
2. Ver modal 2FA
3. Introducir código de Google Auth
4. Acceso exitoso

✅ **Validaciones:**
1. Código debe ser 6 dígitos
2. Solo números
3. Error si código inválido
4. Opción de entrada manual funciona
5. Copiar clave funciona

✅ **UX:**
1. Fondo blanco en modales
2. Animaciones suaves
3. Textos guía claros
4. Traducciones ES/EN
5. Responsive en móvil

---

## 🚀 **Deploy**

### **Variables de Entorno:**

**Desarrollo (ya no necesarias):**
```bash
# .env.local (ELIMINADO)
VITE_API_BASE=http://localhost:3000
```

**Producción:**
```bash
# .env.production
VITE_API_BASE=https://activodigital-be.fly.dev
```

### **Build:**
```bash
npm run build
```

### **Deploy a Fly.io:**
```bash
fly deploy
```

---

## 📋 **Checklist Pre-Deploy**

Frontend:
- [x] Dependencia `react-qr-code` instalada
- [x] Modal 2FA en Register.tsx
- [x] Modal 2FA en Login.tsx
- [x] Modal 2FA en RegisterWithInvitation.tsx
- [x] Servicios 2FA en auth.ts
- [x] Traducciones ES/EN
- [x] Favicon actualizado
- [x] `.env.local` eliminado
- [x] Mock backend eliminado
- [ ] Variable VITE_API_BASE apunta a producción

Backend (pendiente):
- [ ] Instalar speakeasy y qrcode
- [ ] Agregar columnas a tabla users
- [ ] Implementar endpoints 2FA
- [ ] Encriptar secrets
- [ ] Testing con Google Auth real
- [ ] Deploy a producción

---

## 📞 **Documentación para Backend**

Consultar: `BACKEND_2FA_REQUIREMENTS.md`

---

**Branch:** `feature/two-factor`  
**Fecha:** 4 de noviembre, 2025  
**Estado:** ✅ Frontend completo, esperando backend
