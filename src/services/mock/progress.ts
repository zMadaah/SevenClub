import { Challenge, CompetitionEntry } from '../../types/progress';

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Conectar relógio Garmin', xp: 10, icon: 'watch', claimed: false },
  { id: 'c2', title: 'Seguir um amigo', xp: 10, icon: 'friend', claimed: false },
  { id: 'c3', title: 'Adicionar foto de perfil', xp: 10, icon: 'profile', claimed: false },
];

export const MOCK_COMPETITIONS: CompetitionEntry[] = [
  { id: 'p1', label: 'Relógio esportivo', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
  { id: 'p2', label: 'Tênis de corrida', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
  { id: 'p3', label: 'Relógio esportivo', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200' },
  { id: 'p4', label: 'Relógio esportivo', imageUrl: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?w=200' },
];