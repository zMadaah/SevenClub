export interface LobbyChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  text: string;
  createdAt: number;
}
