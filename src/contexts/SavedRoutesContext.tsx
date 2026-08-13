import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SavedRoute } from '../types/route';
import { useAuth } from './AuthContext';
import { authApi } from '../services/api';

interface SavedRoutesContextValue {
  savedRoutes: SavedRoute[];
  loading: boolean;
  // Busca a lista de novo na API. Chamada pela tela ao abrir "Minhas rotas"
  // — não busca sozinho no boot do app, porque o SavedRoutesProvider monta
  // antes da sessão terminar de restaurar (ver AuthContext).
  refreshRoutes: () => Promise<void>;
  addRoute: (name: string, points: SavedRoute['points']) => Promise<SavedRoute>;
  removeRoute: (id: string) => Promise<void>;
}

const SavedRoutesContext = createContext<SavedRoutesContextValue | undefined>(undefined);

export function SavedRoutesProvider({ children }: { children: ReactNode }) {
  const { authFetch, isAuthenticated } = useAuth();
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshRoutes = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const routes = await authApi.listRoutes(authFetch);
      setSavedRoutes(routes);
    } finally {
      setLoading(false);
    }
  }, [authFetch, isAuthenticated]);

  const addRoute = useCallback(
    async (name: string, points: SavedRoute['points']) => {
      const route = await authApi.createRoute(authFetch, { name, points });
      setSavedRoutes((prev) => [route, ...prev]);
      return route;
    },
    [authFetch]
  );

  const removeRoute = useCallback(
    async (id: string) => {
      await authApi.deleteRoute(authFetch, id);
      setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
    },
    [authFetch]
  );

  return (
    <SavedRoutesContext.Provider value={{ savedRoutes, loading, refreshRoutes, addRoute, removeRoute }}>
      {children}
    </SavedRoutesContext.Provider>
  );
}

export function useSavedRoutes() {
  const context = useContext(SavedRoutesContext);
  if (!context) {
    throw new Error('useSavedRoutes precisa estar dentro de um SavedRoutesProvider');
  }
  return context;
}
