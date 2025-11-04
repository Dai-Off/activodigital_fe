/**
 * Mock Backend para Testing 2FA
 * Servidor Express temporal con endpoints simulados
 * Puerto: 3000
 */

const express = require('express');
const cors = require('cors');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging de todas las peticiones
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Almacenamiento en memoria (temporal para testing)
const users = new Map();
const sessions = new Map();

// Utilidades
const generateToken = (email) => {
  return `mock_token_${Buffer.from(email).toString('base64')}_${Date.now()}`;
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock Backend 2FA running' });
});

// ===== AUTH ENDPOINTS =====

// Login (solo email/password, sin 2FA todavía)
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('📧 Login attempt:', email);
  
  const user = users.get(email);
  
  if (!user) {
    return res.status(401).json({ 
      message: 'Usuario no encontrado. Debes registrarte primero.' 
    });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ 
      message: 'Contraseña incorrecta' 
    });
  }
  
  // NO devolver access_token todavía, primero debe verificar 2FA
  console.log('✅ Credenciales válidas, esperando 2FA...');
  
  res.json({ 
    message: 'Credenciales válidas. Verifica código 2FA.',
    requiresTwoFactor: true 
  });
});

// Signup (registro normal)
app.post('/auth/signup', (req, res) => {
  const { email, password, full_name } = req.body;
  
  console.log('📝 Signup attempt:', email);
  
  if (users.has(email)) {
    return res.status(400).json({ 
      message: 'El usuario ya existe' 
    });
  }
  
  // Crear usuario sin 2FA configurado todavía
  const userId = `user_${Date.now()}`;
  users.set(email, {
    id: userId,
    email,
    password,
    fullName: full_name,
    role: { name: 'tecnico' },
    twoFactorEnabled: false,
    twoFactorSecret: null
  });
  
  console.log('✅ Usuario creado:', userId);
  
  res.json({ 
    message: 'Usuario creado. Configure 2FA para continuar.',
    userId 
  });
});

// Signup con invitación
app.post('/auth/signup-with-invitation', (req, res) => {
  const { email, password, full_name, invitation_token } = req.body;
  
  console.log('📨 Signup with invitation:', email);
  
  // Simular validación de invitación
  const userId = `user_${Date.now()}`;
  const role = invitation_token.includes('cfo') ? 'cfo' : 'tecnico';
  
  users.set(email, {
    id: userId,
    email,
    password,
    fullName: full_name,
    role: { name: role },
    twoFactorEnabled: false,
    twoFactorSecret: null
  });
  
  console.log('✅ Usuario creado con invitación:', userId, 'Rol:', role);
  
  res.json({
    access_token: generateToken(email),
    user: {
      id: userId,
      email,
      fullName: full_name,
      role: { name: role }
    }
  });
});

// Get current user
app.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Extraer email del token mock
  const emailMatch = token.match(/mock_token_([A-Za-z0-9+/=]+)_/);
  if (!emailMatch) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  
  const email = Buffer.from(emailMatch[1], 'base64').toString();
  const user = users.get(email);
  
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  
  res.json({
    id: user.id,
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    roleId: 'role_1',
    role: user.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

// ===== 2FA ENDPOINTS =====

// Setup 2FA - Generar QR code
app.post('/auth/setup-2fa', async (req, res) => {
  const { userId } = req.body;
  
  console.log('🔐 Setup 2FA para usuario:', userId);
  
  // Buscar usuario por ID
  const user = Array.from(users.values()).find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ 
      message: 'Usuario no encontrado' 
    });
  }
  
  // Generar secret usando speakeasy
  const secret = speakeasy.generateSecret({
    name: `Activo Digital (${user.email})`,
    issuer: 'Activo Digital'
  });
  
  // Guardar secret en el usuario
  user.twoFactorSecret = secret.base32;
  
  // Generar QR code URL
  const qrCodeUrl = secret.otpauth_url;
  
  // Generar imagen QR (opcional, ya lo hace el frontend)
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl);
  } catch (err) {
    console.error('Error generando QR:', err);
  }
  
  console.log('✅ 2FA secret generado para:', user.email);
  console.log('📱 Secret:', secret.base32);
  
  res.json({
    secret: secret.base32,
    qrCodeUrl: qrCodeUrl,
    manualEntryKey: secret.base32.match(/.{1,4}/g).join(' '), // Formato legible
    qrCodeDataUrl // Por si quieres usarlo
  });
});

// Verify 2FA Setup - Primera verificación durante registro
app.post('/auth/verify-2fa-setup', (req, res) => {
  const { userId, token } = req.body;
  
  console.log('🔍 Verificando setup 2FA para:', userId, 'Token:', token);
  
  // Buscar usuario por ID
  const user = Array.from(users.values()).find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'Usuario no encontrado' 
    });
  }
  
  if (!user.twoFactorSecret) {
    return res.status(400).json({ 
      success: false,
      message: '2FA no configurado todavía' 
    });
  }
  
  // Verificar token con speakeasy
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 2 // Permitir 2 códigos antes/después (60 segundos de ventana)
  });
  
  if (verified) {
    user.twoFactorEnabled = true;
    console.log('✅ 2FA verificado y habilitado para:', user.email);
    
    res.json({
      success: true,
      message: '2FA configurado correctamente'
    });
  } else {
    console.log('❌ Token 2FA inválido para:', user.email);
    
    res.status(400).json({
      success: false,
      message: 'Código inválido. Verifica el código en Google Authenticator.'
    });
  }
});

// Verify 2FA Login - Verificación en cada login
app.post('/auth/verify-2fa-login', (req, res) => {
  const { email, token } = req.body;
  
  console.log('🔐 Verificando 2FA login para:', email, 'Token:', token);
  
  const user = users.get(email);
  
  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'Usuario no encontrado' 
    });
  }
  
  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    return res.status(400).json({ 
      success: false,
      message: '2FA no está configurado para este usuario' 
    });
  }
  
  // Verificar token con speakeasy
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 2
  });
  
  if (verified) {
    const accessToken = generateToken(email);
    console.log('✅ 2FA login verificado para:', user.email);
    
    res.json({
      success: true,
      access_token: accessToken,
      message: 'Login exitoso'
    });
  } else {
    console.log('❌ Token 2FA inválido para login:', user.email);
    
    res.status(400).json({
      success: false,
      message: 'Código inválido. Intenta nuevamente.'
    });
  }
});

// ===== OTROS ENDPOINTS NECESARIOS =====

// Validar invitación
app.get('/auth/validate-invitation', (req, res) => {
  const token = req.query.token;
  
  console.log('📨 Validando invitación:', token);
  
  // Mock: siempre válida
  res.json({
    success: true,
    invitation: {
      id: 'inv_123',
      email: 'tecnico@ejemplo.com',
      role: token.includes('cfo') ? 'cfo' : 'tecnico',
      buildingId: 'building_123',
      buildingName: 'Torre Central',
      invitedBy: 'admin@ejemplo.com',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  });
});

// Dashboard stats (mock)
app.get('/dashboard/stats', (req, res) => {
  res.json({
    totalValue: 5000000,
    totalAssets: 12,
    completedBooks: 8,
    pendingBooks: 4,
    totalSurfaceArea: 15000,
    averageEnergyClass: 'B',
    completionPercentage: 67
  });
});

// Edificios (mock)
app.get('/edificios', (req, res) => {
  res.json([]);
});

// Notificaciones (mock)
app.get('/notifications/unread-count', (req, res) => {
  res.json({ count: 0 });
});

app.get('/notifications', (req, res) => {
  res.json([]);
});

// ===== START SERVER =====

app.listen(PORT, () => {
  console.log('\n🚀 Mock Backend 2FA iniciado');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log('\n📋 Endpoints disponibles:');
  console.log('   POST /auth/signup');
  console.log('   POST /auth/login');
  console.log('   POST /auth/setup-2fa');
  console.log('   POST /auth/verify-2fa-setup');
  console.log('   POST /auth/verify-2fa-login');
  console.log('   GET  /auth/me');
  console.log('\n💡 Usuarios registrados:', users.size);
  console.log('\n⏳ Esperando peticiones...\n');
});
