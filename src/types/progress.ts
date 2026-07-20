export type ChallengeIcon = 'watch' | 'friend' | 'profile';

export interface Challenge {
  id: string;
  title: string;
  xp: number;
  icon: ChallengeIcon;
  claimed: boolean;
}

export interface CompetitionEntry {
  id: string;
  label: string;
  imageUrl: string;
}