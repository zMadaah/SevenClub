import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Lobby } from '../types/lobby';
import { useAuth } from './AuthContext';
import { authApi } from '../services/api';

interface MyLobbiesContextValue {
  lobbies: Lobby[];
  loading: boolean;
  refreshLobbies: () => Promise<void>;
  addLobby: (lobby: Lobby) => void;
  updateLobby: (lobby: Lobby) => void;
  deleteLobby: (lobbyId: string) => void;
}

const MyLobbiesContext = createContext<MyLobbiesContextValue | undefined>(undefined);

export function MyLobbiesProvider({ children }: { children: ReactNode }) {
  const { authFetch, isAuthenticated } = useAuth();
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshLobbies = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const result = await authApi.listMyLobbies(authFetch);
      setLobbies(result);
    } finally {
      setLoading(false);
    }
  }, [authFetch, isAuthenticated]);

  function addLobby(lobby: Lobby) {
    setLobbies((prev) => [lobby, ...prev]);
  }

  function updateLobby(lobby: Lobby) {
    setLobbies((prev) => prev.map((l) => (l.id === lobby.id ? lobby : l)));
  }

  function deleteLobby(lobbyId: string) {
    setLobbies((prev) => prev.filter((l) => l.id !== lobbyId));
  }

  return (
    <MyLobbiesContext.Provider
      value={{ lobbies, loading, refreshLobbies, addLobby, updateLobby, deleteLobby }}
    >
      {children}
    </MyLobbiesContext.Provider>
  );
}

export function useMyLobbies() {
  const context = useContext(MyLobbiesContext);
  if (!context) {
    throw new Error('useMyLobbies precisa estar dentro de um MyLobbiesProvider');
  }
  return context;
}
