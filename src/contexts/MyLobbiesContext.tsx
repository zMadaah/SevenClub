import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lobby } from '../types/lobby';
import { MOCK_MY_LOBBIES } from '../services/mock/lobby';

interface MyLobbiesContextValue {
  lobbies: Lobby[];
  addLobby: (lobby: Lobby) => void;
  updateLobby: (lobby: Lobby) => void;
  deleteLobby: (lobbyId: string) => void;
}

const MyLobbiesContext = createContext<MyLobbiesContextValue | undefined>(undefined);

export function MyLobbiesProvider({ children }: { children: ReactNode }) {
  // TODO: trocar por chamada real em services/api.ts assim que existir
  const [lobbies, setLobbies] = useState<Lobby[]>(MOCK_MY_LOBBIES);

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
    <MyLobbiesContext.Provider value={{ lobbies, addLobby, updateLobby, deleteLobby }}>
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
