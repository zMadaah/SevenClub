export interface FollowSuggestion {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export const MOCK_FOLLOW_SUGGESTIONS: FollowSuggestion[] = [
  {
    id: 'f1',
    name: 'João Guilherme',
    role: 'Fundador do app',
    avatarUrl: 'https://i.pravatar.cc/300?img=33',
  },
  {
    id: 'f2',
    name: 'Marina Alves',
    role: 'Top corredora da semana',
    avatarUrl: 'https://i.pravatar.cc/300?img=32',
  },
];