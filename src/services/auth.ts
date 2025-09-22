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
  role: string;
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


