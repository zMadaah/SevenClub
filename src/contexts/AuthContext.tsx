import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, request, ApiError, AuthSession } from '../services/api';
import { decodeJwtUserId } from '../utils/jwt';

const ACCESS_TOKEN_KEY = 'sevenclub_access_token';
const REFRESH_TOKEN_KEY = 'sevenclub_refresh_token';

interface AuthContextValue {
  isAuthenticated: boolean;
  // id do usuário logado, lido direto do JWT — null enquanto não há
  // sessão. Útil pra telas decidirem "isso é meu?" sem outra chamada de rede.
  userId: string | null;
  // true enquanto tenta restaurar a sessão salva ao abrir o app — a tela
  // de navegação usa isso pra não piscar a tela de Login antes de saber
  // se já tem uma sessão válida guardada
  isRestoring: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithTokens: (tokens: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
  // Pra chamadas autenticadas (activities, territory, stats, routes):
  // injeta o access token atual e, se a API responder 401 (token vencido),
  // tenta renovar com o refresh token e repete a chamada uma vez.
  authFetch: <T = any>(path: string, options?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Tokens ficam numa ref, não em state: são lidos por authFetch a
  // qualquer momento sem precisar re-renderizar nada quando mudam.
  const accessTokenRef = useRef<string | null>(null);
  const refreshTokenRef = useRef<string | null>(null);

  const persistTokens = useCallback(async (session: AuthSession) => {
    accessTokenRef.current = session.accessToken;
    refreshTokenRef.current = session.refreshToken;
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken);
    setUserId(decodeJwtUserId(session.accessToken));
    setIsAuthenticated(true);
  }, []);

  const clearTokens = useCallback(async () => {
    accessTokenRef.current = null;
    refreshTokenRef.current = null;
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setUserId(null);
    setIsAuthenticated(false);
  }, []);

  // Ao abrir o app: se tem refresh token salvo, renova direto (o access
  // token dura só 15 min e provavelmente já venceu desde a última vez que
  // o app foi usado) em vez de tentar usar um access token velho.
  useEffect(() => {
    (async () => {
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!storedRefreshToken) {
        setIsRestoring(false);
        return;
      }
      try {
        const session = await api.refresh(storedRefreshToken);
        await persistTokens(session);
      } catch {
        await clearTokens();
      } finally {
        setIsRestoring(false);
      }
    })();
  }, [persistTokens, clearTokens]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const session = await api.login(email, password);
      await persistTokens(session);
    },
    [persistTokens]
  );

  const signInWithTokens = useCallback(
    async (session: AuthSession) => {
      await persistTokens(session);
    },
    [persistTokens]
  );

  const signOut = useCallback(async () => {
    if (refreshTokenRef.current) {
      try {
        await api.logout(refreshTokenRef.current);
      } catch {
        // best-effort: mesmo se a chamada falhar (ex: sem internet),
        // limpa a sessão local — a pessoa não pode ficar presa logada
      }
    }
    await clearTokens();
  }, [clearTokens]);

  const authFetch = useCallback(
    async <T = any,>(path: string, options: RequestInit = {}): Promise<T> => {
      if (!accessTokenRef.current) {
        throw new ApiError(401, 'Sessão não iniciada.');
      }

      try {
        return await request<T>(path, options, accessTokenRef.current);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401 && refreshTokenRef.current) {
          const session = await api.refresh(refreshTokenRef.current);
          await persistTokens(session);
          return request<T>(path, options, session.accessToken);
        }
        throw err;
      }
    },
    [persistTokens]
  );

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userId, isRestoring, signIn, signInWithTokens, signOut, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro de um AuthProvider');
  }
  return context;
}
