import { LeaderboardEntry, MyRankEntry } from '../../types/leaderboard';
import { ActivityType } from '../../types/lobby';

// TODO: trocar por chamada real em services/api.ts assim que existir.
// Pool de corredores individuais — não é mais exibido como aba própria
// ("Mundo" virou "Crew"), mas continua servindo de fonte pra filtrar a
// aba "País" (top corredores do Brasil).
export const MOCK_COUNTRY_POOL: Record<ActivityType, LeaderboardEntry[]> = {
  run: [
    { id: 'g1', rank: 1, name: 'Kenji Watanabe', avatarUrl: 'https://i.pravatar.cc/200?img=51', countryFlag: '🇯🇵', countryCode: 'JP', territoryKm2: 41.2, distanceKm: 144.2, activityType: 'run' },
    { id: 'g2', rank: 2, name: 'Amara Okafor', avatarUrl: 'https://i.pravatar.cc/200?img=48', countryFlag: '🇳🇬', countryCode: 'NG', territoryKm2: 38.7, distanceKm: 135.5, activityType: 'run' },
    { id: 'g3', rank: 3, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 35.9, distanceKm: 125.6, activityType: 'run' },
    { id: 'g4', rank: 4, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 30.4, distanceKm: 106.4, activityType: 'run' },
    { id: 'g5', rank: 5, name: 'Sofia Marín', avatarUrl: 'https://i.pravatar.cc/200?img=45', countryFlag: '🇦🇷', countryCode: 'AR', territoryKm2: 27.8, distanceKm: 97.3, activityType: 'run' },
    { id: 'g6', rank: 6, name: 'Julia Prado', avatarUrl: 'https://i.pravatar.cc/200?img=47', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 22.1, distanceKm: 77.4, activityType: 'run' },
    { id: 'g7', rank: 7, name: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/200?img=15', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 19.6, distanceKm: 68.6, activityType: 'run' },
  ],
  ride: [
    { id: 'gr1', rank: 1, name: 'Jonas Bergström', avatarUrl: 'https://i.pravatar.cc/200?img=53', countryFlag: '🇸🇪', countryCode: 'SE', territoryKm2: 52.3, distanceKm: 183.0, activityType: 'ride' },
    { id: 'gr2', rank: 2, name: 'Camila Rojas', avatarUrl: 'https://i.pravatar.cc/200?img=44', countryFlag: '🇨🇱', countryCode: 'CL', territoryKm2: 47.5, distanceKm: 166.2, activityType: 'ride' },
    { id: 'gr3', rank: 3, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 40.1, distanceKm: 140.3, activityType: 'ride' },
    { id: 'gr4', rank: 4, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 33.8, distanceKm: 118.3, activityType: 'ride' },
  ],
};

// Ranking de crews — soma o território de todos os membros de cada crew.
// Substitui a antiga aba "Mundo".
export const MOCK_CREW_LEADERBOARD: Record<ActivityType, LeaderboardEntry[]> = {
  run: [
    { id: 'c1', rank: 1, name: 'Correndo Juntos SP', avatarUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 312.4, distanceKm: 1093.4, activityType: 'run' },
    { id: 'c2', rank: 2, name: 'Crew Asa Norte', avatarUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=200', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 268.9, distanceKm: 941.1, activityType: 'run' },
    { id: 'c3', rank: 3, name: 'Trilheiros do Ibirapuera', avatarUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 201.7, distanceKm: 705.9, activityType: 'run' },
    { id: 'c4', rank: 4, name: 'Rota Livre RJ', avatarUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 156.2, distanceKm: 546.7, activityType: 'run' },
    { id: 'c5', rank: 5, name: 'Bora Correr POA', avatarUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 98.5, distanceKm: 344.8, activityType: 'run' },
  ],
  ride: [
    { id: 'cr1', rank: 1, name: 'Pedal Coletivo BH', avatarUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=200', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 402.1, distanceKm: 1407.4, activityType: 'ride' },
    { id: 'cr2', rank: 2, name: 'Rota Livre RJ', avatarUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 355.6, distanceKm: 1244.6, activityType: 'ride' },
    { id: 'cr3', rank: 3, name: 'Correndo Juntos SP', avatarUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 289.3, distanceKm: 1012.6, activityType: 'ride' },
  ],
};

// Ranking do bairro/região — universo bem menor, só quem treina perto
export const MOCK_AREA_LEADERBOARD: Record<ActivityType, LeaderboardEntry[]> = {
  run: [
    { id: 'a1', rank: 1, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 4.8, distanceKm: 16.8, activityType: 'run' },
    { id: 'a2', rank: 2, name: 'Julia Prado', avatarUrl: 'https://i.pravatar.cc/200?img=47', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 3.9, distanceKm: 13.7, activityType: 'run' },
    { id: 'a3', rank: 3, name: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/200?img=15', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 2.6, distanceKm: 9.1, activityType: 'run' },
    { id: 'a4', rank: 4, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 1.9, distanceKm: 6.6, activityType: 'run' },
  ],
  ride: [
    { id: 'ar1', rank: 1, name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 3.1, distanceKm: 10.8, activityType: 'ride' },
    { id: 'ar2', rank: 2, name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', countryFlag: '🇧🇷', countryCode: 'BR', territoryKm2: 2.4, distanceKm: 8.4, activityType: 'ride' },
  ],
};

// Nome do país exibido na aba — na vida real viria do perfil/GPS do usuário
export const USER_COUNTRY_NAME = 'Brasil';
export const USER_COUNTRY_CODE = 'BR';

// "Seu rank" pessoal — sempre visível, independente de blur/paywall.
// Não tem mais chave 'world': essa aba agora é sobre crews, não sobre
// você como indivíduo.
export const MOCK_MY_RANK: Record<ActivityType, Record<'country' | 'area', MyRankEntry>> = {
  run: {
    country: { rank: 118, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
    area: { rank: 6, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
  },
  ride: {
    country: { rank: 52, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
    area: { rank: 3, name: 'João Cruz', avatarUrl: 'https://i.pravatar.cc/200?img=10', countryFlag: '🇧🇷', territoryKm2: 0 },
  },
};

// Posição do SEU CREW no ranking de crews — só faz sentido mostrar se o
// usuário estiver de fato em um crew (ActiveCrewContext). Nome/foto vêm
// do crew real; só o número de rank é mock.
export const MOCK_MY_CREW_RANK: Record<ActivityType, number> = {
  run: 34,
  ride: 61,
};