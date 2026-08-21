import { LatLng } from '../utils/geo';
import { SavedRoute } from '../types/route';
import { CompletedActivity, ActivitySummary } from '../types/activity';
import { ActivityStats } from '../types/stats';
import { ActivityHistory } from '../types/history';
import { FeedPost } from '../types/post';
import { Comment } from '../types/comment';
import { LeaderboardEntry, MyRankEntry } from '../types/leaderboard';
import { Lobby } from '../types/lobby';
import { NotificationPreferences } from '../types/notificationPreference';
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
  // Só manda Content-Type: application/json quando existe corpo de
  // verdade. Sem essa checagem, toda chamada sem body (seguir, curtir,
  // bloquear, sair de lobby, resgatar desafio...) mandava o cabeçalho
  // dizendo "isso é JSON" com corpo vazio — o Fastify recusa isso com
  // FST_ERR_CTP_EMPTY_JSON_BODY antes até de chegar na rota.
  const hasBody = options.body !== undefined && options.body !== null;
  const headers: Record<string, string> = {
    ...(hasBody && !isFormData ? { 'Content-Type': 'application/json' } : {}),
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

export interface ProgressSummary {
  level: number;
  exp: number;
  expTarget: number;
  territoryM2: number;
  territoryBestM2: number;
  rivalsCount: number;
  rivalsBeating: number;
  season: { id: string; number: number; name: string; startsAt: string; endsAt: string } | null;
}

export interface BadgeStatus {
  id: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface ChallengeStatus {
  id: string;
  xp: number;
  completed: boolean;
  claimed: boolean;
  progress?: number;
  target?: number;
}

export interface RivalEntryApi {
  id: string;
  name: string;
  avatarUrl: string;
  color: string;
  yourTerritoryKm2: number;
  yourSteals: number;
  rivalTerritoryKm2: number;
  rivalSteals: number;
  activityType: 'run' | 'ride';
}

export interface TerritoryCellView {
  h3Index: string;
  ownerId: string;
  ownerName: string;
  ownerColor: string;
  isMine: boolean;
  boundary: { latitude: number; longitude: number }[];
}

export interface LobbyChatMessageApi {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  text: string;
  createdAt: string;
}

export interface LobbyInput {
  name: string;
  pictureUri?: string;
  allowPreviousImports: boolean;
  allowMemberInvitations: boolean;
  inGameChatEnabled: boolean;
  maxLobbySize: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
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

export interface MyProfile {
  id: string;
  email: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  profileColor: string | null;
  location: string | null;
  countryCode: string | null;
  phone: string | null;
  profileVisibility: 'public' | 'followers';
  mapVisibility: 'everyone' | 'crew' | 'nobody';
  referralCode: string | null;
  referredBy: string | null;
  featuredBadgeId: string | null;
  anonymousMode: boolean;
  totalDistanceKm: number;
  totalTerritoryKm2: number;
  rivalCount: number;
  createdAt: string;
}

// O backend devolve as colunas cruas do Postgres — snake_case
// (display_name, avatar_url...). Sem esse normalizador, `authFetch<MyProfile>`
// é só um cast de TypeScript (não converte nada em tempo de execução), e
// todo `profile.displayName`/`profile.avatarUrl` no app fica sempre
// `undefined` mesmo com a API respondendo 200 certinho — foi exatamente
// esse o bug: Profile mostrando "..." e EditProfile carregando os campos
// em branco, não por falha de rede, por formato.
interface RawMyProfile {
  id: string;
  email: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  date_of_birth: string | null;
  gender: string | null;
  profile_color: string | null;
  location: string | null;
  country_code: string | null;
  phone: string | null;
  profile_visibility: 'public' | 'followers';
  map_visibility: 'everyone' | 'crew' | 'nobody';
  referral_code: string | null;
  referred_by: string | null;
  featured_badge_id: string | null;
  anonymous_mode: boolean;
  total_distance_km: number | string;
  total_territory_km2: number | string;
  rival_count: number;
  created_at: string;
}

function normalizeProfile(raw: RawMyProfile): MyProfile {
  return {
    id: raw.id,
    email: raw.email,
    displayName: raw.display_name,
    firstName: raw.first_name,
    lastName: raw.last_name,
    avatarUrl: raw.avatar_url,
    bio: raw.bio,
    dateOfBirth: raw.date_of_birth,
    gender: raw.gender,
    profileColor: raw.profile_color,
    location: raw.location,
    countryCode: raw.country_code,
    phone: raw.phone,
    profileVisibility: raw.profile_visibility,
    mapVisibility: raw.map_visibility,
    referralCode: raw.referral_code,
    referredBy: raw.referred_by,
    featuredBadgeId: raw.featured_badge_id,
    anonymousMode: raw.anonymous_mode,
    totalDistanceKm: Number(raw.total_distance_km),
    totalTerritoryKm2: Number(raw.total_territory_km2),
    rivalCount: raw.rival_count,
    createdAt: raw.created_at,
  };
}

export const authApi = {
  me: (authFetch: AuthFetch) => authFetch<RawMyProfile>('/auth/me').then(normalizeProfile),

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

  getFollowCounts: (authFetch: AuthFetch) =>
    authFetch<{ followingCount: number; followersCount: number }>('/follows/counts'),

  registerPushToken: (authFetch: AuthFetch, token: string) =>
    authFetch<void>('/notifications/register-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  getTerritoryCells: (
    authFetch: AuthFetch,
    activityType: 'run' | 'ride',
    bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
  ) =>
    authFetch<TerritoryCellView[]>(
      `/territory/cells?activityType=${activityType}&minLat=${bounds.minLat}&maxLat=${bounds.maxLat}&minLng=${bounds.minLng}&maxLng=${bounds.maxLng}`
    ),

  // --- Chat de lobby --------------------------------------------------------

  getLobbyMessages: (authFetch: AuthFetch, lobbyId: string) =>
    authFetch<LobbyChatMessageApi[]>(`/lobbies/${lobbyId}/messages`),

  sendLobbyMessage: (authFetch: AuthFetch, lobbyId: string, text: string) =>
    authFetch<LobbyChatMessageApi>(`/lobbies/${lobbyId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  // --- Preferências de notificação -------------------------------------
  // Isto só guarda o que a pessoa quer receber — o envio de verdade
  // (push notification quando alguém curte, comenta, rouba território
  // etc.) precisa de infraestrutura própria (registro de token Expo +
  // gatilho por evento) que ainda não existe.

  getNotificationPreferences: (authFetch: AuthFetch) =>
    authFetch<NotificationPreferences>('/notifications/preferences'),

  updateNotificationPreferences: (authFetch: AuthFetch, patch: Partial<NotificationPreferences>) =>
    authFetch<NotificationPreferences>('/notifications/preferences', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  // --- Ranking -------------------------------------------------------------

  getLeaderboard: (
    authFetch: AuthFetch,
    scope: 'country' | 'area' | 'friends' | 'lobby',
    activityType: 'run' | 'ride',
    lobbyId?: string
  ) =>
    authFetch<LeaderboardResponse>(
      `/leaderboard?scope=${scope}&activityType=${activityType}${lobbyId ? `&lobbyId=${lobbyId}` : ''}`
    ),

  // --- Perfil ----------------------------------------------------------------

  updateMyProfile: (
    authFetch: AuthFetch,
    input: {
      displayName?: string;
      firstName?: string;
      lastName?: string;
      bio?: string;
      avatarUrl?: string;
      location?: string;
      countryCode?: string;
      dateOfBirth?: string;
      gender?: string;
      profileColor?: string;
      profileVisibility?: 'public' | 'followers';
      mapVisibility?: 'everyone' | 'crew' | 'nobody';
      featuredBadgeId?: string | null;
      anonymousMode?: boolean;
    }
  ) => authFetch<RawMyProfile>('/auth/me', { method: 'PATCH', body: JSON.stringify(input) }).then(normalizeProfile),

  deleteMyData: (authFetch: AuthFetch) => authFetch<void>('/auth/me/data', { method: 'DELETE' }),

  // --- Bloqueio de usuários -------------------------------------------------

  listBlockedUsers: (authFetch: AuthFetch) =>
    authFetch<{ id: string; name: string; avatarUrl: string }[]>('/blocked-users'),

  blockUser: (authFetch: AuthFetch, userId: string) =>
    authFetch<void>(`/blocked-users/${userId}`, { method: 'POST' }),

  unblockUser: (authFetch: AuthFetch, userId: string) =>
    authFetch<void>(`/blocked-users/${userId}`, { method: 'DELETE' }),

  // --- Indicação -------------------------------------------------------------

  getMyReferralInfo: (authFetch: AuthFetch) =>
    authFetch<{ referralCode: string | null; referredCount: number }>('/referrals/me'),

  redeemReferralCode: (authFetch: AuthFetch, code: string) =>
    authFetch<void>('/referrals/redeem', { method: 'POST', body: JSON.stringify({ code }) }),

  // --- Suporte -----------------------------------------------------------

  listSupportMessages: (authFetch: AuthFetch) =>
    authFetch<
      { id: string; ticketId: string; sender: 'user' | 'staff'; text: string; createdAt: string }[]
    >('/support/messages'),

  sendSupportMessage: (authFetch: AuthFetch, text: string) =>
    authFetch<{ id: string; ticketId: string; sender: 'user' | 'staff'; text: string; createdAt: string }>(
      '/support/messages',
      { method: 'POST', body: JSON.stringify({ text }) }
    ),

  // --- Progresso (nível/XP, insígnias, desafios, rivais) --------------------

  getProgressSummary: (authFetch: AuthFetch, activityType: 'run' | 'ride') =>
    authFetch<ProgressSummary>(`/progress/summary?activityType=${activityType}`),

  getBadgeStatuses: (authFetch: AuthFetch) => authFetch<BadgeStatus[]>('/badges/status'),

  getChallengeStatuses: (authFetch: AuthFetch) =>
    authFetch<ChallengeStatus[]>('/challenges/status'),

  claimChallenge: (authFetch: AuthFetch, challengeId: string) =>
    authFetch<void>(`/challenges/${challengeId}/claim`, { method: 'POST' }),

  getRivals: (authFetch: AuthFetch, activityType: 'run' | 'ride') =>
    authFetch<RivalEntryApi[]>(`/rivals?activityType=${activityType}`),

  // --- Lobbies (jogo privado) ----------------------------------------------

  listMyLobbies: (authFetch: AuthFetch) => authFetch<Lobby[]>('/lobbies/mine'),

  createLobby: (authFetch: AuthFetch, payload: LobbyInput) =>
    authFetch<Lobby>('/lobbies', { method: 'POST', body: JSON.stringify(payload) }),

  updateLobby: (authFetch: AuthFetch, lobbyId: string, payload: LobbyInput) =>
    authFetch<Lobby>(`/lobbies/${lobbyId}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  deleteLobby: (authFetch: AuthFetch, lobbyId: string) =>
    authFetch<void>(`/lobbies/${lobbyId}`, { method: 'DELETE' }),

  joinLobby: (authFetch: AuthFetch, code: string) =>
    authFetch<Lobby>('/lobbies/join', { method: 'POST', body: JSON.stringify({ code }) }),

  leaveLobby: (authFetch: AuthFetch, lobbyId: string) =>
    authFetch<void>(`/lobbies/${lobbyId}/leave`, { method: 'POST' }),

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
