import { LeaderboardEntry } from '../../types/leaderboard';
import { ActivityType } from '../../types/lobby';

// TODO: trocar por chamada real em services/api.ts assim que existir.
// João Cruz (usuário logado) aparece com 0 km², coerente com o estado de
// "conta nova" já usado em MyStats/Progress.
export const MOCK_GLOBAL_LEADERBOARD: Record<ActivityType, LeaderboardEntry[]> = {
  run: [
    { id: 'g1', rank: 1, name: 'Kenji Watanabe', avatarUrl: 'https://i.pravatar.cc/200?img=51', countryFlag: '🇯🇵', countryCode: 'JP', territoryKm2: 41.2, activityType: 'run' },
    { id: 'g2', rank: 2, name: 'Amara Okafor', avatarUrl: 'https://i.pravatar.cc/200?img=48', countryFlag: '🇳🇬', countryCode: 'NG', territoryKm2: 38.7, activityType: 'run' },
    { id: 'g3', rank: 3, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 35.9, activityType: 'run' },
    { id: 'g4', rank: 4, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 30.4, activityType: 'run' },
    { id: 'g5', rank: 5, name: 'Sofia Marín', avatarUrl: 'https://i.pravatar.cc/200?img=45', countryFlag: '🇦🇷', countryCode: 'AR', territoryKm2: 27.8, activityType: 'run' },
    { id: 'g6', rank: 6, name: 'Julia Prado', avatarUrl: 'https://i.pravatar.cc/200?img=47', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 22.1, activityType: 'run' },
    { id: 'g7', rank: 7, name: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/200?img=15', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 19.6, activityType: 'run' },
    { id: 'g8', rank: 8, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 0, activityType: 'run', isCurrentUser: true },
  ],
  ride: [
    { id: 'gr1', rank: 1, name: 'Jonas Bergström', avatarUrl: 'https://i.pravatar.cc/200?img=53', countryFlag: '🇸🇪', countryCode: 'SE', territoryKm2: 52.3, activityType: 'ride' },
    { id: 'gr2', rank: 2, name: 'Camila Rojas', avatarUrl: 'https://i.pravatar.cc/200?img=44', countryFlag: '🇨🇱', countryCode: 'CL', territoryKm2: 47.5, activityType: 'ride' },
    { id: 'gr3', rank: 3, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 40.1, activityType: 'ride' },
    { id: 'gr4', rank: 4, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 33.8, activityType: 'ride' },
    { id: 'gr5', rank: 5, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 0, activityType: 'ride', isCurrentUser: true },
  ],
};