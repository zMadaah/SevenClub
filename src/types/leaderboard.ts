import { ActivityType } from './lobby';

export type Scope = 'area' | 'country' | 'crew' | 'friends';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string;
  countryFlag: string;
  countryCode: string;
  territoryKm2: number;
  activityType: ActivityType;
}

// O "seu rank" nunca faz parte da lista de concorrentes — é um dado
// separado, sempre visível, mesmo com o resto da lista ficando fosco
// atrás de uma futura assinatura Pro
export interface MyRankEntry {
  rank: number;
  name: string;
  avatarUrl: string;
  countryFlag: string;
  territoryKm2: number;
}