export interface LobbyMember {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Lobby {
  id: string;
  name: string;
  pictureUri?: string;
  allowPreviousImports: boolean;
  allowMemberInvitations: boolean;
  inGameChatEnabled: boolean;
  maxLobbySize: number | null;
  inviteCode: string;
  members: LobbyMember[];
  createdAt: number;
}