import { ActivityType } from './lobby';

export interface RivalEntry {
  id: string;
  name: string;
  avatarUrl: string;
  color: string;
  yourTerritoryKm2: number;
  yourSteals: number;
  rivalTerritoryKm2: number;
  rivalSteals: number;
  activityType: ActivityType;
}