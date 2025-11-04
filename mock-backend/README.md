# Mock Backend para Testing 2FA

Servidor Express temporal para probar la funcionalidad 2FA con Google Authenticator.

## 🚀 Instalación Rápida

```bash
# Desde la carpeta mock-backend
npm install
npm start
```

El servidor se iniciará en `http://localhost:3000`

## 📱 Testing del Flujo 2FA

### 1. Registro Normal

```bash
# Frontend en http://localhost:5173
# 1. Ve a /register
# 2. Completa el formulario
# 3. Verás el modal con QR code
# 4. Descarga Google Authenticator en tu móvil
# 5. Escanea el QR
# 6. Introduce el código de 6 dígitos
# 7. ✅ Cuenta creada y login automático
```

### 2. Login con 2FA

```bash
# 1. Ve a /login
# 2. Introduce email y contraseña
# 3. Verás el modal pidiendo código 2FA
# 4. Abre Google Authenticator
# 5. Introduce el código actual (cambia cada 30 seg)
# 6. ✅ Acceso completo al dashboard
```

## 🔐 Endpoints Implementados

### Auth Básico
- `POST /auth/signup` - Crear usuario
- `POST /auth/login` - Validar credenciales
- `GET /auth/me` - Obtener usuario actual

### 2FA Endpoints
- `POST /auth/setup-2fa` - Generar QR y secret
  ```json
  Request: { "userId": "user_123" }
  Response: {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "otpauth://totp/...",
    "manualEntryKey": "JBSW Y3DP EHPK 3PXP"
  }
  ```

- `POST /auth/verify-2fa-setup` - Verificar primer código
  ```json
  Request: { "userId": "user_123", "token": "123456" }
  Response: { "success": true }
  ```

- `POST /auth/verify-2fa-login` - Verificar código en login
  ```json
  Request: { "email": "user@test.com", "token": "123456" }
  Response: { 
    "success": true,
    "access_token": "mock_token_..."
  }
  ```

## 📝 Usuarios de Prueba

El backend crea usuarios en memoria. Algunos ejemplos:

```javascript
// Usuario normal (rol: tecnico)
Email: test@test.com
Password: password123

// Usuario CFO (con invitación)
Email: cfo@test.com
Password: password123
```

## 🧪 Testing Manual

### Probar Setup 2FA:
```bash
curl -X POST http://localhost:3000/auth/setup-2fa \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123"}'
```

### Verificar código:
```bash
curl -X POST http://localhost:3000/auth/verify-2fa-setup \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123","token":"123456"}'
```

## 📱 Apps Google Authenticator

- **Android**: https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2
- **iOS**: https://apps.apple.com/app/google-authenticator/id388497605

## ⚠️ Notas Importantes

1. **Códigos TOTP**: Cambian cada 30 segundos
2. **Ventana de tiempo**: Acepta códigos ±60 segundos
3. **Almacenamiento**: En memoria (se pierde al reiniciar)
4. **Solo para desarrollo**: NO usar en producción

## 🔄 Reiniciar Servidor

```bash
# Si cambias algo en server.js
npm run dev  # Con nodemon (auto-reload)
```

## 🐛 Troubleshooting

### "Código inválido" siempre
- Verifica que la hora del servidor y móvil estén sincronizadas
- Los códigos TOTP dependen de la hora exacta
- Espera al siguiente código (30 segundos)

### Backend no arranca
- Verifica que el puerto 3000 esté libre
- Ejecuta: `npm install` primero

### QR no aparece
- Verifica que el frontend esté llamando a `http://localhost:3000`
- Revisa la consola del navegador
