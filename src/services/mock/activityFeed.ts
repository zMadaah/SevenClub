import { ActivityFeedItem } from '../../types/activityFeed';

export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'a1',
    runnerName: 'Fernanda Pinheiro',
    runnerAvatarUrl: 'https://i.pravatar.cc/200?img=10',
    levelBadge: '01',
    createdAtLabel: 'Seg, 20 Jul 16:23',
    activityType: 'ride',
    location: 'Brasília, Brasil',
    countryFlag: '🇧🇷',
    title: 'Afternoon Ride',
    routeFrames: [
      [
        { latitude: -15.805, longitude: -48.045 },
        { latitude: -15.799, longitude: -48.040 },
        { latitude: -15.803, longitude: -48.033 },
        { latitude: -15.810, longitude: -48.039 },
      ],
    ],
    loopClosed: true,
    distanceKm: 1.12,
    durationLabel: '03:27',
    avgSpeedKmh: 19.4,
  },
  {
    id: 'a2',
    runnerName: 'Fernanda Pinheiro',
    runnerAvatarUrl: 'https://i.pravatar.cc/200?img=10',
    levelBadge: '01',
    createdAtLabel: 'Seg, 20 Jul 15:27',
    activityType: 'ride',
    location: 'Brasília, Brasil',
    countryFlag: '🇧🇷',
    title: 'Afternoon Ride',
    description: 'Resumo teste',
    routeFrames: [
      [
        { latitude: -15.798, longitude: -48.038 },
        { latitude: -15.793, longitude: -48.028 },
        { latitude: -15.803, longitude: -48.019 },
        { latitude: -15.811, longitude: -48.029 },
      ],
    ],
    loopClosed: true,
    distanceKm: 2.1,
    durationLabel: '04:21',
    avgSpeedKmh: 28.9,
  },
];