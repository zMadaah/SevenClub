import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lobby } from '../types/lobby';

interface ActiveLobbyContextValue {
  activeLobby: Lobby | null;
  setActiveLobby: (lobby: Lobby | null) => void;
}

const ActiveLobbyContext = createContext<ActiveLobbyContextValue | undefined>(undefined);

export function ActiveLobbyProvider({ children }: { children: ReactNode }) {
  const [activeLobby, setActiveLobby] = useState<Lobby | null>(null);

  return (
    <ActiveLobbyContext.Provider value={{ activeLobby, setActiveLobby }}>
      {children}
    </ActiveLobbyContext.Provider>
  );
}

export function useActiveLobby() {
  const context = useContext(ActiveLobbyContext);
  if (!context) {
    throw new Error('useActiveLobby precisa estar dentro de um ActiveLobbyProvider');
  }
  return context;
}