import { ActivityType } from './lobby';

export interface RunnerSummary {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  location: string;
  countryFlag: string;
}

export interface FeedPost {
  id: string;
  runner: RunnerSummary;
  createdAt: string;
  title: string;
  caption?: string;
  photos: string[];
  distanceKm: number;
  durationLabel: string;
  avgPaceLabel: string;
  territoryKm2?: number;
  likes: number;
  comments: number;
  activityType: ActivityType;
  isGroup: boolean;
  isFollowing: boolean;
}