import { apiFetch } from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface SignupPayload {
  email: string;
  password: string;
  full_name: string;
}

export async function signupRequest(payload: SignupPayload): Promise<{ message?: string; userId?: string }> {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface MeResponse {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  roleId: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function fetchMe(): Promise<MeResponse> {
  return apiFetch('/auth/me', { method: 'GET' });
}

// ===== Interfaces y servicios para 2FA con Google Authenticator =====

export interface Setup2FAResponse {
  secret: string;           // Secret para Google Authenticator
  qrCodeUrl: string;        // URL del QR code para escanear
  manualEntryKey: string;   // Clave para entrada manual si no puede escanear
}

export interface Verify2FASetupPayload {
  userId: string;
  token: string;  // Código de 6 dígitos de Google Authenticator
}

export interface Verify2FASetupResponse {
  success: boolean;
  message: string;
}

export interface Verify2FALoginPayload {
  email: string;
  token: string;  // Código de 6 dígitos
  password: string;  // Password requerido para crear sesión
}

export interface Verify2FALoginResponse {
  success: boolean;
  access_token?: string;
  message?: string;
}

// Setup inicial de 2FA después del registro
export async function setup2FA(userId: string): Promise<Setup2FAResponse> {
  return apiFetch('/auth/setup-2fa', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

// Verificar código 2FA durante setup (primera vez)
export async function verify2FASetup(payload: Verify2FASetupPayload): Promise<Verify2FASetupResponse> {
  return apiFetch('/auth/verify-2fa-setup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Verificar código 2FA durante login
export async function verify2FALogin(payload: Verify2FALoginPayload): Promise<Verify2FALoginResponse> {
  return apiFetch('/auth/verify-2fa-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Nuevas interfaces para el sistema de invitaciones
export interface ValidateInvitationResponse {
  success: boolean;
  invitation?: {
    id: string;
    email: string;
    role: string;
    buildingId: string;
    buildingName: string;
    invitedBy: string;
    expiresAt: string;
  };
}

export interface SignupWithInvitationPayload {
  email: string;
  password: string;
  full_name: string;
  invitation_token: string;
}

export interface SignupWithInvitationResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: {
      name: string;
    };
  };
}

// Validar token de invitación
export async function validateInvitation(token: string): Promise<ValidateInvitationResponse> {
  return apiFetch(`/auth/validate-invitation?token=${encodeURIComponent(token)}`, { method: 'GET' });
}

// Registro con invitación
export async function signupWithInvitation(payload: SignupWithInvitationPayload): Promise<SignupWithInvitationResponse> {
  return apiFetch('/auth/register-with-invitation', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Procesar asignaciones pendientes después del login
export async function processPendingAssignments(email: string, buildingId: string): Promise<{ success: boolean; message: string; building?: any }> {
  return apiFetch('/auth/process-pending-assignments', {
    method: 'POST',
    body: JSON.stringify({ email, buildingId }),
  });
}


