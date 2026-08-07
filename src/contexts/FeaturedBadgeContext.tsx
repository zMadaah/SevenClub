import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FeaturedBadgeContextValue {
  featuredBadgeId: string | null;
  setFeaturedBadgeId: (id: string | null) => void;
}

const FeaturedBadgeContext = createContext<FeaturedBadgeContextValue | undefined>(undefined);

export function FeaturedBadgeProvider({ children }: { children: ReactNode }) {
  const [featuredBadgeId, setFeaturedBadgeId] = useState<string | null>(null);

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
