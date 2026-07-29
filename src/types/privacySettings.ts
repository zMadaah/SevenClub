export type MapVisibility = 'everyone' | 'crew' | 'nobody';
export type ProfileVisibility = 'public' | 'followers' ;

export interface BlockedUser {
  id: string;
  name: string;
  avatarUrl: string;
}
