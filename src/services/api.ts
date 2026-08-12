import { LatLng } from 'react-native-maps';

// EXPO_PUBLIC_* fica embutido no bundle em tempo de build — é assim que o
// Expo expõe env vars pro código do cliente. Configure no .env (raiz do
// projeto, ver .env.example) ou no app.json / eas.json por ambiente.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Requisição "crua" — usada tanto pelas chamadas públicas (login, signup)
// quanto, com um token, pelas autenticadas. O AuthContext usa isso
// diretamente pra poder controlar o retry com refresh token em caso de 401.
export async function request<T = any>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique sua internet.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? 'Algo deu errado. Tente novamente.');
  }

  return data as T;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
}

export interface Point {
  latitude: number;
  longitude: number;
}

export const api = {
  // --- Cadastro em 3 etapas ---------------------------------------------
  signupStart: (name: string, email: string, phone: string) =>
    request<{ signupId: string; expiresInSeconds: number; devCode?: string }>('/auth/signup/start', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone }),
    }),

  signupResend: (signupId: string) =>
    request<{ expiresInSeconds: number; devCode?: string }>('/auth/signup/resend', {
      method: 'POST',
      body: JSON.stringify({ signupId }),
    }),

  signupVerifyCode: (signupId: string, code: string) =>
    request<{ verified: true }>('/auth/signup/verify-code', {
      method: 'POST',
      body: JSON.stringify({ signupId, code }),
    }),

  signupSetPassword: (signupId: string, password: string) =>
    request<AuthSession>('/auth/signup/set-password', {
      method: 'POST',
      body: JSON.stringify({ signupId, password }),
    }),

  // --- Recuperação de senha ----------------------------------------------
  passwordResetStart: (method: 'email' | 'phone', contact: string) =>
    request<{ resetId: string; expiresInSeconds: number; devCode?: string }>('/auth/password-reset/start', {
      method: 'POST',
      body: JSON.stringify({ method, contact }),
    }),

  passwordResetResend: (resetId: string) =>
    request<{ expiresInSeconds: number; devCode?: string }>('/auth/password-reset/resend', {
      method: 'POST',
      body: JSON.stringify({ resetId }),
    }),

  passwordResetVerifyCode: (resetId: string, code: string) =>
    request<{ verified: true }>('/auth/password-reset/verify-code', {
      method: 'POST',
      body: JSON.stringify({ resetId, code }),
    }),

  passwordResetComplete: (resetId: string, password: string) =>
    request<{ success: true }>('/auth/password-reset/complete', {
      method: 'POST',
      body: JSON.stringify({ resetId, password }),
    }),

  // --- Sessão --------------------------------------------------------------
  login: (email: string, password: string) =>
    request<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  refresh: (refreshToken: string) =>
    request<AuthSession>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken: string) =>
    request<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  // --- Rotas autenticadas abaixo exigem um `authFetch` (ver AuthContext) --
  // Feitas como funções que recebem o token pra poderem ser chamadas tanto
  // pelo authFetch (que já cuida do refresh automático) quanto isoladamente.
  me: (token: string) => request<any>('/auth/me', { method: 'GET' }, token),

  createActivity: (
    token: string,
    payload: {
      name: string;
      activityType: 'run' | 'ride';
      points: Point[] | LatLng[];
      startedAt: string;
      endedAt: string;
    }
  ) => request<any>('/activities', { method: 'POST', body: JSON.stringify(payload) }, token),

  listActivities: (token: string) => request<any[]>('/activities', { method: 'GET' }, token),

  getActivity: (token: string, id: string) => request<any>(`/activities/${id}`, { method: 'GET' }, token),

  listTerritory: (token: string, activityType: 'run' | 'ride') =>
    request<any[]>(`/territory?activityType=${activityType}`, { method: 'GET' }, token),

  myStats: (token: string, activityType: 'run' | 'ride') =>
    request<any>(`/stats/me?activityType=${activityType}`, { method: 'GET' }, token),

  createRoute: (token: string, payload: { name: string; points: Point[] | LatLng[] }) =>
    request<any>('/routes', { method: 'POST', body: JSON.stringify(payload) }, token),

  listRoutes: (token: string) => request<any[]>('/routes', { method: 'GET' }, token),

  deleteRoute: (token: string, id: string) => request<void>(`/routes/${id}`, { method: 'DELETE' }, token),
};
