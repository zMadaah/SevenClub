export type ChatSender = 'user' | 'support';

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  createdAt: number;
}