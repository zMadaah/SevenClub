import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { authApi } from '../services/api';

interface FeaturedBadgeContextValue {
  featuredBadgeId: string | null;
  setFeaturedBadgeId: (id: string | null) => void;
}

const FeaturedBadgeContext = createContext<FeaturedBadgeContextValue | undefined>(undefined);

export function FeaturedBadgeProvider({ children }: { children: ReactNode }) {
  const { authFetch, isAuthenticated } = useAuth();
  const [featuredBadgeId, setFeaturedBadgeIdState] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    authApi
      .me(authFetch)
      .then((profile) => setFeaturedBadgeIdState(profile.featuredBadgeId))
      .catch(() => {});
  }, [authFetch, isAuthenticated]);

  const setFeaturedBadgeId = useCallback(
    (id: string | null) => {
      const previous = featuredBadgeId;
      setFeaturedBadgeIdState(id); // otimista — a tela reage na hora
      authApi.updateMyProfile(authFetch, { featuredBadgeId: id }).catch(() => {
        setFeaturedBadgeIdState(previous); // desfaz se a API recusar
      });
    },
    [authFetch, featuredBadgeId]
  );

  return (
    <FeaturedBadgeContext.Provider value={{ featuredBadgeId, setFeaturedBadgeId }}>
      {children}
    </FeaturedBadgeContext.Provider>
  );
}

export function useFeaturedBadge() {
  const context = useContext(FeaturedBadgeContext);
  if (!context) {
    throw new Error('useFeaturedBadge precisa estar dentro de um FeaturedBadgeProvider');
  }
  return context;
}
