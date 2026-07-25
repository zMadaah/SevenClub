import { LatLng } from 'react-native-maps';
import { ActivityType } from './lobby';

export interface ActivityFeedItem {
  id: string;
  runnerName: string;
  runnerAvatarUrl: string;
  levelBadge: string;
  createdAtLabel: string;
  activityType: ActivityType;
  location: string;
  countryFlag: string;
  title: string;
  description?: string;
  routeFrames: LatLng[][];
  loopClosed: boolean;
  distanceKm: number;
  durationLabel: string;
  avgSpeedKmh: number;
}