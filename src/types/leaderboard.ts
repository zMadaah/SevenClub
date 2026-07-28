import { ActivityType } from './lobby';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string;
  countryFlag: string;
  countryCode: string;
  territoryKm2: number;
  activityType: ActivityType;
  isCurrentUser?: boolean;
}