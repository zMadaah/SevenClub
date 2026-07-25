import { LatLng } from 'react-native-maps';
import { ActivityType } from './lobby';

export interface ChartSample {
  distanceKm: number;
  value: number;
}

export interface TerritoryEntry {
  id: string;
  points: LatLng[];
  captureM2: number;
  activityName: string;
  activityDescription: string;
  rankInGroup: number;
  activityType: ActivityType;
  capturedAtLabel: string;
  runnerName: string;
  runnerAvatarUrl: string;
  location: string;
  countryFlag: string;
  countryRank: number;
  globalRank: number;
  distanceKm: number;
  durationLabel: string;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  elevationGainM: number;
  elevationLossM: number;
  speedSamples: ChartSample[];
  elevationSamples: ChartSample[];
  likes: number;
  comments: number;
}