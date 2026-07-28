export interface CrewMember {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'owner' | 'member';
}

export interface Crew {
  id: string;
  name: string;
  pictureUri?: string;
  city: string;
  isPublic: boolean;
  allowPreviousImports: boolean;
  allowMemberInvitations: boolean;
  inGameChatEnabled: boolean;
  maxCrewSize: number | null;
  inviteCode: string;
  members: CrewMember[];
  createdAt: number;
}