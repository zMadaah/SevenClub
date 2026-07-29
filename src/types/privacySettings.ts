export type MapVisibility = 'everyone' | 'crew' | 'nobody';
export type ProfileVisibility = 'public' | 'followers' | 'private';

export interface BlockedUser {
  id: string;
  name: string;
  avatarUrl: string;
}
