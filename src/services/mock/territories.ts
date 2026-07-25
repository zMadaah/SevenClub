import { TerritoryEntry } from '../../types/territory';
import { ActivityType } from '../../types/lobby';

const SPEED_SAMPLES = [
  { distanceKm: 0.0, value: 0 },
  { distanceKm: 0.1, value: 26 },
  { distanceKm: 0.2, value: 18 },
  { distanceKm: 0.3, value: 25 },
  { distanceKm: 0.45, value: 27 },
  { distanceKm: 0.55, value: 25 },
  { distanceKm: 0.65, value: 36 },
  { distanceKm: 0.75, value: 30 },
  { distanceKm: 0.85, value: 40 },
  { distanceKm: 0.9, value: 25 },
  { distanceKm: 0.95, value: 8 },
  { distanceKm: 1.05, value: 35 },
  { distanceKm: 1.2, value: 35 },
  { distanceKm: 1.3, value: 30 },
  { distanceKm: 1.4, value: 20 },
  { distanceKm: 1.5, value: 37 },
  { distanceKm: 1.6, value: 30 },
  { distanceKm: 1.7, value: 26 },
  { distanceKm: 1.8, value: 31 },
  { distanceKm: 1.9, value: 28 },
  { distanceKm: 2.0, value: 39 },
  { distanceKm: 2.1, value: 32 },
];

const ELEVATION_SAMPLES = [
  { distanceKm: 0.0, value: 1114 },
  { distanceKm: 0.15, value: 1116 },
  { distanceKm: 0.65, value: 1116 },
  { distanceKm: 0.75, value: 1090 },
  { distanceKm: 0.9, value: 1088 },
  { distanceKm: 1.05, value: 1082 },
  { distanceKm: 1.2, value: 1079 },
  { distanceKm: 1.4, value: 1078 },
  { distanceKm: 1.55, value: 1080 },
  { distanceKm: 1.65, value: 1101 },
  { distanceKm: 1.75, value: 1095 },
  { distanceKm: 1.85, value: 1097 },
  { distanceKm: 2.0, value: 1096 },
  { distanceKm: 2.1, value: 1109 },
];

export const MOCK_TERRITORIES: Record<ActivityType, TerritoryEntry[]> = {
  ride: [
    {
      id: 't1',
      points: [
        { latitude: -15.798, longitude: -48.038 },
        { latitude: -15.793, longitude: -48.028 },
        { latitude: -15.803, longitude: -48.019 },
        { latitude: -15.811, longitude: -48.029 },
      ],
      captureM2: 200000,
      activityName: 'Afternoon Ride',
      activityDescription: 'Resumo teste',
      rankInGroup: 1,
      activityType: 'ride',
      capturedAtLabel: 'Seg, 20 Jul 15:27',
      runnerName: 'Fernanda Pinheiro',
      runnerAvatarUrl: 'https://i.pravatar.cc/200?img=10',
      location: 'Brasília, Brasil',
      countryFlag: '🇧🇷',
      countryRank: 59,
      globalRank: 8549,
      distanceKm: 2.1,
      durationLabel: '04:21',
      avgSpeedKmh: 28.9,
      maxSpeedKmh: 35.6,
      elevationGainM: 36,
      elevationLossM: 40,
      speedSamples: SPEED_SAMPLES,
      elevationSamples: ELEVATION_SAMPLES,
      likes: 0,
      comments: 0,
    },
  ],
  run: [],
};

export const MOCK_USER_TERRITORY_COLOR = '#7F77DD';