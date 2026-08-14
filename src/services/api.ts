import { LatLng } from 'react-native-maps';
import { SavedRoute } from '../types/route';
import { CompletedActivity, ActivitySummary } from '../types/activity';
import { ActivityStats } from '../types/stats';
import { ActivityHistory } from '../types/history';
import { FeedPost } from '../types/post';
import { Comment } from '../types/comment';
import { LeaderboardEntry, MyRankEntry } from '../types/leaderboard';
import { formatRelativeTime } from '../utils/time';

// EXPO_PUBLIC_* fica embutido no bundle em tempo de build — é assim que o
// Expo expõe env vars pro código do cliente. Configure no .env (raiz do
// projeto, ver .env.example) ou no app.json / eas.json por ambiente.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
    // Necessário porque o Babel/Metro transpila classes que estendem Error
    // de um jeito que quebra a cadeia de protótipos — sem isso,
    // `err instanceof ApiError` pode dar false mesmo pra um ApiError de
    // verdade, e todo catch cai no fallback genérico em vez de mostrar o
    // erro real que a API mandou.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const REQUEST_TIMEOUT_MS = 15000;

// Requisição "crua" — usada tanto pelas chamadas públicas (login, signup)
// quanto, com um token, pelas autenticadas. O AuthContext usa isso
// diretamente pra poder controlar o retry com refresh token em caso de 401.
export async function request<T = any>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers, signal: controller.signal });
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new ApiError(
        0,
        `Servidor não respondeu em ${REQUEST_TIMEOUT_MS / 1000}s. Verifique se a API está rodando e se o EXPO_PUBLIC_API_URL no .env aponta pro IP certo.`
      );
    }
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique sua internet.');
  } finally {
    clearTimeout(timeoutId);
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
};

// --- Rotas autenticadas -----------------------------------------------------
// Recebem o `authFetch` do AuthContext (useAuth()) em vez de um token cru:
// authFetch já injeta o Authorization header e, se o access token tiver
// vencido (401), renova com o refresh token e repete a chamada sozinho.
export type AuthFetch = <T = any>(path: string, options?: RequestInit) => Promise<T>;

interface RawActivitySummary {
  id: string;
  name: string;
  activityType: 'run' | 'ride';
  distanceMeters: number;
  durationSeconds: number;
  paceLabel: string;
  loopClosed: boolean;
  captureM2: number;
  createdAt: string;
}

interface RawCompletedActivity extends RawActivitySummary {
  points: Point[];
}

function normalizeActivitySummary(raw: RawActivitySummary): ActivitySummary {
  return { ...raw, createdAt: new Date(raw.createdAt).getTime() };
}

function normalizeCompletedActivity(raw: RawCompletedActivity): CompletedActivity {
  return { ...raw, createdAt: new Date(raw.createdAt).getTime() };
}

interface RawFeedPost {
  id: string;
  runner: {
    id: string;
    name: string;
    avatarUrl: string;
    level: number;
    location: string;
    countryFlag: string;
  };
  createdAt: string;
  title?: string;
  caption?: string;
  photos: string[];
  distanceKm?: number;
  durationLabel?: string;
  avgPaceLabel?: string;
  territoryKm2?: number;
  globalRank?: number;
  likes: number;
  comments: number;
  likedByMe: boolean;
  activityType: 'run' | 'ride';
  isGroup: boolean;
  isFollowing: boolean;
}

function normalizeFeedPost(raw: RawFeedPost): FeedPost {
  return { ...raw, createdAt: formatRelativeTime(raw.createdAt) };
}

interface RawComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  text: string;
  createdAt: string;
  parentCommentId?: string;
}

function normalizeComment(raw: RawComment): Comment {
  const { createdAt, ...rest } = raw;
  return { ...rest, createdAtLabel: formatRelativeTime(createdAt) };
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  myRank: MyRankEntry | null;
}

export interface UserSearchResult {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  location: string;
  countryFlag: string;
  isFollowing: boolean;
}

interface RawSavedRoute {
  id: string;
  name: string;
  points: Point[];
  distanceMeters: number;
  captureM2: number;
  createdAt: string;
}

// A API devolve created_at como string ISO (timestamptz do Postgres); o
// tipo SavedRoute do app espera number (Date.now()-like). Normaliza aqui,
// num único lugar, em vez de espalhar essa conversão pelas telas.
function normalizeSavedRoute(raw: RawSavedRoute): SavedRoute {
  return { ...raw, createdAt: new Date(raw.createdAt).getTime() };
}

export const authApi = {
  me: (authFetch: AuthFetch) => authFetch<any>('/auth/me'),

  createActivity: (
    authFetch: AuthFetch,
    payload: {
      name: string;
      activityType: 'run' | 'ride';
      points: Point[] | LatLng[];
      startedAt: string;
      endedAt: string;
    }
  ) =>
    authFetch<RawCompletedActivity>('/activities', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(normalizeCompletedActivity),

  listActivities: (authFetch: AuthFetch) =>
    authFetch<RawActivitySummary[]>('/activities').then((items) => items.map(normalizeActivitySummary)),

  getActivity: (authFetch: AuthFetch, id: string) =>
    authFetch<RawCompletedActivity>(`/activities/${id}`).then(normalizeCompletedActivity),

  listTerritory: (authFetch: AuthFetch, activityType: 'run' | 'ride') =>
    authFetch<any[]>(`/territory?activityType=${activityType}`),

  myStats: (authFetch: AuthFetch, activityType: 'run' | 'ride') =>
    authFetch<ActivityStats>(`/stats/me?activityType=${activityType}`),

  myHistory: (authFetch: AuthFetch, activityType: 'run' | 'ride') =>
    authFetch<ActivityHistory>(`/stats/history?activityType=${activityType}`),

  createRoute: (authFetch: AuthFetch, payload: { name: string; points: Point[] | LatLng[] }) =>
    authFetch<RawSavedRoute>('/routes', { method: 'POST', body: JSON.stringify(payload) }).then(
      normalizeSavedRoute
    ),

  listRoutes: (authFetch: AuthFetch) =>
    authFetch<RawSavedRoute[]>('/routes').then((routes) => routes.map(normalizeSavedRoute)),

  deleteRoute: (authFetch: AuthFetch, id: string) => authFetch<void>(`/routes/${id}`, { method: 'DELETE' }),

  // --- Social: feed, curtidas, comentários -------------------------------

  listFeed: (authFetch: AuthFetch, scope: 'explore' | 'following' | 'groups', activityType: 'run' | 'ride' | 'all') =>
    authFetch<RawFeedPost[]>(`/posts?scope=${scope}&activityType=${activityType}`).then((posts) =>
      posts.map(normalizeFeedPost)
    ),

  createPost: (
    authFetch: AuthFetch,
    payload: { activityId?: string; title?: string; caption?: string; photoUrls: string[] }
  ) => authFetch<{ id: string }>('/posts', { method: 'POST', body: JSON.stringify(payload) }),

  deletePost: (authFetch: AuthFetch, postId: string) =>
    authFetch<void>(`/posts/${postId}`, { method: 'DELETE' }),

  likePost: (authFetch: AuthFetch, postId: string) =>
    authFetch<void>(`/posts/${postId}/like`, { method: 'POST' }),

  unlikePost: (authFetch: AuthFetch, postId: string) =>
    authFetch<void>(`/posts/${postId}/like`, { method: 'DELETE' }),

  listComments: (authFetch: AuthFetch, postId: string) =>
    authFetch<RawComment[]>(`/posts/${postId}/comments`).then((comments) => comments.map(normalizeComment)),

  addComment: (authFetch: AuthFetch, postId: string, text: string, parentCommentId?: string) =>
    authFetch<RawComment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text, parentCommentId }),
    }).then(normalizeComment),

  deleteComment: (authFetch: AuthFetch, postId: string, commentId: string) =>
    authFetch<void>(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),

  // --- Social: seguir / buscar usuários -----------------------------------

  followUser: (authFetch: AuthFetch, userId: string) =>
    authFetch<void>(`/follows/${userId}`, { method: 'POST' }),

  unfollowUser: (authFetch: AuthFetch, userId: string) =>
    authFetch<void>(`/follows/${userId}`, { method: 'DELETE' }),

  searchUsers: (authFetch: AuthFetch, term: string) =>
    authFetch<UserSearchResult[]>(`/users/search?q=${encodeURIComponent(term)}`),

  // --- Ranking -------------------------------------------------------------

  getLeaderboard: (
    authFetch: AuthFetch,
    scope: 'country' | 'area' | 'friends',
    activityType: 'run' | 'ride'
  ) => authFetch<LeaderboardResponse>(`/leaderboard?scope=${scope}&activityType=${activityType}`),

  // --- Perfil ----------------------------------------------------------------

  updateMyProfile: (
    authFetch: AuthFetch,
    input: { displayName?: string; bio?: string; avatarUrl?: string; location?: string; countryCode?: string }
  ) => authFetch<any>('/auth/me', { method: 'PATCH', body: JSON.stringify(input) }),

  // --- Upload (dev/homolog — ver aviso em uploads.routes.ts no backend) --

  uploadPhoto: async (authFetch: AuthFetch, localUri: string): Promise<string> => {
    const form = new FormData();
    const filename = localUri.split('/').pop() ?? 'photo.jpg';
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeType = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';

    // React Native aceita esse formato de objeto (uri/name/type) no lugar
    // de um File/Blob de verdade — é a forma padrão do fetch com
    // multipart no RN.
    form.append('file', { uri: localUri, name: filename, type: mimeType } as any);

    const { url } = await authFetch<{ url: string }>('/uploads', {
      method: 'POST',
      body: form,
    });

    return url;
  },
};
