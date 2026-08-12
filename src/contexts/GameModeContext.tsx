import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameMode } from '../Header/types';

interface GameModeContextValue {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
}

const GameModeContext = createContext<GameModeContextValue | undefined>(undefined);

export function GameModeProvider({ children }: { children: ReactNode }) {
  const [gameMode, setGameMode] = useState<GameMode>('solo');

  return (
    <GameModeContext.Provider value={{ gameMode, setGameMode }}>
      {children}
    </GameModeContext.Provider>
  );
}

export function useGameMode() {
  const context = useContext(GameModeContext);
  if (!context) {
    throw new Error('useGameMode precisa estar dentro de um GameModeProvider');
  }
  return context;
}