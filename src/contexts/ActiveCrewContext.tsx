import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Crew } from '../types/crew';

interface ActiveCrewContextValue {
  activeCrew: Crew | null;
  setActiveCrew: (crew: Crew | null) => void;
}

const ActiveCrewContext = createContext<ActiveCrewContextValue | undefined>(undefined);

export function ActiveCrewProvider({ children }: { children: ReactNode }) {
  const [activeCrew, setActiveCrew] = useState<Crew | null>(null);

  return (
    <ActiveCrewContext.Provider value={{ activeCrew, setActiveCrew }}>
      {children}
    </ActiveCrewContext.Provider>
  );
}

export function useActiveCrew() {
  const context = useContext(ActiveCrewContext);
  if (!context) {
    throw new Error('useActiveCrew precisa estar dentro de um ActiveCrewProvider');
  }
  return context;
}