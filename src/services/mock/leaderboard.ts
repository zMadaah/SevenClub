import { LeaderboardEntry, MyRankEntry } from '../../types/leaderboard';
import { ActivityType } from '../../types/lobby';

// TODO: trocar por chamada real em services/api.ts assim que existir.
// Ranking mundial — o usuário logado NÃO entra nessa lista (com 0 km²,
// ele não apareceria de verdade no topo global). O "seu rank" dele vive
// separado, em MOCK_MY_RANK.
export const MOCK_WORLD_LEADERBOARD: Record<ActivityType, LeaderboardEntry[]> = {
  run: [
    { id: 'g1', rank: 1, name: 'Kenji Watanabe', avatarUrl: 'https://i.pravatar.cc/200?img=51', countryFlag: '🇯🇵', countryCode: 'JP', territoryKm2: 41.2, activityType: 'run' },
    { id: 'g2', rank: 2, name: 'Amara Okafor', avatarUrl: 'https://i.pravatar.cc/200?img=48', countryFlag: '🇳🇬', countryCode: 'NG', territoryKm2: 38.7, activityType: 'run' },
    { id: 'g3', rank: 3, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 35.9, activityType: 'run' },
    { id: 'g4', rank: 4, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 30.4, activityType: 'run' },
    { id: 'g5', rank: 5, name: 'Sofia Marín', avatarUrl: 'https://i.pravatar.cc/200?img=45', countryFlag: '🇦🇷', countryCode: 'AR', territoryKm2: 27.8, activityType: 'run' },
    { id: 'g6', rank: 6, name: 'Julia Prado', avatarUrl: 'https://i.pravatar.cc/200?img=47', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 22.1, activityType: 'run' },
    { id: 'g7', rank: 7, name: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/200?img=15', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 19.6, activityType: 'run' },
  ],
  ride: [
    { id: 'gr1', rank: 1, name: 'Jonas Bergström', avatarUrl: 'https://i.pravatar.cc/200?img=53', countryFlag: '🇸🇪', countryCode: 'SE', territoryKm2: 52.3, activityType: 'ride' },
    { id: 'gr2', rank: 2, name: 'Camila Rojas', avatarUrl: 'https://i.pravatar.cc/200?img=44', countryFlag: '🇨🇱', countryCode: 'CL', territoryKm2: 47.5, activityType: 'ride' },
    { id: 'gr3', rank: 3, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 40.1, activityType: 'ride' },
    { id: 'gr4', rank: 4, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 33.8, activityType: 'ride' },
  ],
};

// Ranking do bairro/região — universo bem menor, só quem treina perto
export const MOCK_AREA_LEADERBOARD: Record<ActivityType, LeaderboardEntry[]> = {
  run: [
    { id: 'a1', rank: 1, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 4.8, activityType: 'run' },
    { id: 'a2', rank: 2, name: 'Julia Prado', avatarUrl: 'https://i.pravatar.cc/200?img=47', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 3.9, activityType: 'run' },
    { id: 'a3', rank: 3, name: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/200?img=15', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 2.6, activityType: 'run' },
    { id: 'a4', rank: 4, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 1.9, activityType: 'run' },
  ],
  ride: [
    { id: 'ar1', rank: 1, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 3.1, activityType: 'ride' },
    { id: 'ar2', rank: 2, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 2.4, activityType: 'ride' },
  ],
};

// Nome do país exibido na aba — na vida real viria do perfil/GPS do usuário
export const USER_COUNTRY_NAME = 'Brasil';
export const USER_COUNTRY_CODE = 'BR';

// "Seu rank" — sempre visível, independente de blur/paywall, calculado
// separado da lista de concorrentes visíveis (que é só uma amostra do topo)
export const MOCK_MY_RANK: Record<ActivityType, Record<'world' | 'country' | 'area', MyRankEntry>> = {
  run: {
    world: { rank: 2054, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
    country: { rank: 118, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
    area: { rank: 6, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
  },
  ride: {
    world: { rank: 941, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
    country: { rank: 52, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
    area: { rank: 3, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
  },
};