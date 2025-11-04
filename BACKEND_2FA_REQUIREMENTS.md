# 🔐 Requisitos de Backend para 2FA

## 📋 **Resumen**
Se ha implementado autenticación de dos factores (2FA) obligatoria usando Google Authenticator (TOTP estándar) para todos los usuarios independientemente del rol.

---

## 🔧 **Dependencias del Backend**

```bash
npm install speakeasy qrcode
```

- **speakeasy**: Generación y verificación de códigos TOTP
- **qrcode**: Generación de códigos QR para configuración inicial

---

## 📡 **Endpoints a Implementar**

### **1. POST /auth/signup**

**Descripción:** Registro de usuario (sin asignar access_token todavía)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Juan Pérez"
}
```

**Response (200):**
```json
{
  "message": "Usuario creado. Configure 2FA para continuar.",
  "userId": "user_12345"
}
```

**Response (400):**
```json
{
  "message": "El usuario ya existe"
}
```

**Notas:**
- NO devolver `access_token` en este endpoint
- El usuario debe configurar 2FA antes de obtener acceso completo
- Agregar columnas a la tabla `users`:
  - `two_factor_secret` (VARCHAR 255) - Secret de TOTP (encriptado)
  - `two_factor_enabled` (BOOLEAN) - Default: false

---

### **2. POST /auth/setup-2fa**

**Descripción:** Genera secret TOTP y QR code para configurar Google Authenticator

**Request Body:**
```json
{
  "userId": "user_12345"
}
```

**Response (200):**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "otpauth://totp/Activo%20Digital%20(user@example.com)?secret=JBSWY3DPEHPK3PXP&issuer=Activo%20Digital",
  "manualEntryKey": "JBSW Y3DP EHPK 3PXP"
}
```

**Lógica del Backend:**
```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generar secret
const secret = speakeasy.generateSecret({
  name: `Activo Digital (${user.email})`,
  issuer: 'Activo Digital'
});

// Guardar secret en DB (encriptado)
await User.update(userId, {
  two_factor_secret: encrypt(secret.base32)
});

// Generar QR URL
const qrCodeUrl = secret.otpauth_url;

// Formato legible para entrada manual
const manualEntryKey = secret.base32.match(/.{1,4}/g).join(' ');

return {
  secret: secret.base32,
  qrCodeUrl,
  manualEntryKey
};
```

---

### **3. POST /auth/verify-2fa-setup**

**Descripción:** Verifica el código 2FA durante la configuración inicial

**Request Body:**
```json
{
  "userId": "user_12345",
  "token": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "2FA configurado correctamente"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Código inválido. Verifica el código en Google Authenticator."
}
```

**Lógica del Backend:**
```javascript
const speakeasy = require('speakeasy');

// Obtener secret del usuario (desencriptado)
const user = await User.findById(userId);
const secret = decrypt(user.two_factor_secret);

// Verificar token con ventana de ±60 segundos
const verified = speakeasy.totp.verify({
  secret: secret,
  encoding: 'base32',
  token: token,
  window: 2 // Permite 2 códigos antes/después
});

if (verified) {
  // Activar 2FA para el usuario
  await User.update(userId, {
    two_factor_enabled: true
  });
  
  return { success: true, message: '2FA configurado correctamente' };
} else {
  return { success: false, message: 'Código inválido' };
}
```

---

### **4. POST /auth/login**

**Descripción:** Login con email/password (sin 2FA todavía)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Credenciales válidas. Verifica código 2FA.",
  "requiresTwoFactor": true
}
```

**Response (401):**
```json
{
  "message": "Credenciales incorrectas"
}
```

**Notas:**
- NO devolver `access_token` todavía
- El frontend mostrará el modal 2FA después de esta respuesta

---

### **5. POST /auth/verify-2fa-login**

**Descripción:** Verifica el código 2FA durante el login y devuelve el access_token

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login exitoso"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Código 2FA inválido"
}
```

**Lógica del Backend:**
```javascript
const speakeasy = require('speakeasy');

// Obtener usuario por email
const user = await User.findByEmail(email);

// Verificar que tenga 2FA habilitado
if (!user.two_factor_enabled) {
  return { success: false, message: '2FA no configurado' };
}

// Obtener secret (desencriptado)
const secret = decrypt(user.two_factor_secret);

// Verificar token
const verified = speakeasy.totp.verify({
  secret: secret,
  encoding: 'base32',
  token: token,
  window: 2
});

if (verified) {
  // Generar JWT access_token
  const access_token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return { 
    success: true, 
    access_token,
    message: 'Login exitoso'
  };
} else {
  return { 
    success: false, 
    message: 'Código 2FA inválido' 
  };
}
```

---

### **6. POST /auth/signup-with-invitation**

**Descripción:** Registro con invitación (para roles CFO/Técnico)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Juan Pérez",
  "invitation_token": "invite_token_xyz"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "fullName": "Juan Pérez",
    "role": {
      "name": "cfo"
    }
  }
}
```

**Notas:**
- Este endpoint crea el usuario Y devuelve un access_token temporal
- El frontend luego pedirá configurar 2FA con el mismo flujo
- El rol se obtiene del token de invitación

---

## 🗄️ **Cambios en Base de Datos**

### **Tabla `users`**

Agregar columnas:

```sql
ALTER TABLE users ADD COLUMN two_factor_secret VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false;
```

**Notas de Seguridad:**
- ⚠️ **IMPORTANTE:** Encriptar `two_factor_secret` antes de guardarlo
- Usar AES-256 o similar
- Nunca almacenar en texto plano
- Desencriptar solo cuando se necesite verificar el código

---

## 🔐 **Seguridad**

### **Encriptación del Secret**

```javascript
const crypto = require('crypto');

// Encriptar
function encrypt(text) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Desencriptar
function decrypt(encrypted) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### **Variables de Entorno**

```env
ENCRYPTION_KEY=your-very-secure-encryption-key-here
JWT_SECRET=your-jwt-secret-here
```

---

## 🧪 **Testing**

### **Endpoint de Salud (opcional pero recomendado)**

```javascript
GET /health

Response:
{
  "status": "ok",
  "message": "Backend running",
  "timestamp": "2025-11-04T11:30:00Z"
}
```

### **Flujo Completo de Testing**

1. **Registro:**
   ```bash
   POST /auth/signup
   → userId
   ```

2. **Setup 2FA:**
   ```bash
   POST /auth/setup-2fa { userId }
   → qrCodeUrl, secret
   ```

3. **Escanear QR con Google Authenticator**

4. **Verificar Setup:**
   ```bash
   POST /auth/verify-2fa-setup { userId, token }
   → success: true
   ```

5. **Login con 2FA:**
   ```bash
   POST /auth/verify-2fa-login { email, token }
   → access_token
   ```

6. **Obtener perfil:**
   ```bash
   GET /auth/me
   Headers: { Authorization: "Bearer {access_token}" }
   → user data
   ```

---

## 📱 **Información sobre Google Authenticator**

- **Algoritmo:** TOTP (Time-based One-Time Password)
- **Estándar:** RFC 6238
- **Período:** 30 segundos (código nuevo cada 30s)
- **Dígitos:** 6
- **Window:** ±2 períodos (permite ±60 segundos de desincronización)

---

## ✅ **Checklist de Implementación**

Backend:
- [ ] Instalar dependencias: `speakeasy` y `qrcode`
- [ ] Agregar columnas `two_factor_secret` y `two_factor_enabled` a tabla `users`
- [ ] Implementar encriptación para secrets
- [ ] Crear endpoint `POST /auth/setup-2fa`
- [ ] Crear endpoint `POST /auth/verify-2fa-setup`
- [ ] Modificar endpoint `POST /auth/login` (no devolver token todavía)
- [ ] Crear endpoint `POST /auth/verify-2fa-login`
- [ ] Actualizar endpoint `POST /auth/signup` (devolver userId)
- [ ] Probar con Google Authenticator real

Frontend:
- [x] Componente de registro con modal 2FA
- [x] Componente de login con verificación 2FA
- [x] Servicios de API para 2FA
- [x] Traducciones (ES/EN)
- [x] Estilos y UX

---

## 🚀 **Deployment**

### **Variables de Entorno en Producción**

```env
# Backend
ENCRYPTION_KEY=generate-a-secure-random-key-here
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-database-connection

# Frontend (.env.production)
VITE_API_BASE=https://activodigital-be.fly.dev
```

### **Comandos de Deploy**

Frontend:
```bash
npm run build
fly deploy
```

Backend:
```bash
# Asegurarse de tener las variables de entorno configuradas
fly secrets set ENCRYPTION_KEY=xxx JWT_SECRET=xxx
fly deploy
```

---

## 📞 **Soporte**

Si hay dudas durante la implementación:
1. Revisar el código del mock backend en `mock-backend/server.js` (si aún lo tienes)
2. Consultar documentación de speakeasy: https://github.com/speakeasyjs/speakeasy
3. RFC 6238 (TOTP): https://tools.ietf.org/html/rfc6238

---

**Fecha de creación:** 4 de noviembre, 2025  
**Versión:** 1.0  
**Branch:** feature/two-factor
