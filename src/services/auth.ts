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

export async function signupRequest(payload: SignupPayload): Promise<{ message?: string }> {
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


