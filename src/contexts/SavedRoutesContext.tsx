import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SavedRoute } from '../types/route';

interface SavedRoutesContextValue {
  savedRoutes: SavedRoute[];
  addRoute: (route: SavedRoute) => void;
  removeRoute: (id: string) => void;
}

const SavedRoutesContext = createContext<SavedRoutesContextValue | undefined>(undefined);

export function SavedRoutesProvider({ children }: { children: ReactNode }) {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);

  function addRoute(route: SavedRoute) {
    setSavedRoutes((prev) => [route, ...prev]);
  }

  function removeRoute(id: string) {
    setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <SavedRoutesContext.Provider value={{ savedRoutes, addRoute, removeRoute }}>
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