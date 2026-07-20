import { FeedPost } from '../../types/post';

export const MOCK_FEED: FeedPost[] = [
  {
    id: '1',
    runner: {
      id: 'r1',
      name: 'Marina Alves',
      avatarUrl: 'https://i.pravatar.cc/200?img=32',
      level: 12,
      location: 'Brasília, Brasil',
      countryFlag: '🇧🇷',
    },
    createdAt: '2 horas atrás',
    title: 'Corrida da manhã',
    caption: 'Peguei o pôr do sol saindo, valeu acordar cedo hoje.',
    photos: [
      'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800',
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    ],
    distanceKm: 8.24,
    durationLabel: '0:48:12',
    avgPaceLabel: '5:51',
    territoryKm2: 2.1,
    likes: 94,
    comments: 6,
  },
  {
    id: '2',
    runner: {
      id: 'r2',
      name: 'Lucas Ferreira',
      avatarUrl: 'https://i.pravatar.cc/200?img=12',
      level: 8,
      location: 'Asa Norte, Brasília',
      countryFlag: '🇧🇷',
    },
    createdAt: '5 horas atrás',
    title: 'Pedal de domingo',
    photos: ['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800'],
    distanceKm: 24.5,
    durationLabel: '1:12:40',
    avgPaceLabel: '2:58',
    territoryKm2: 3.4,
    likes: 58,
    comments: 2,
  },
];