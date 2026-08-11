import { LobbyChatMessage } from '../../types/lobbyChat';
import { CURRENT_USER_ID, CURRENT_USER_NAME, CURRENT_USER_AVATAR } from '../../constants/currentUser';

const now = Date.now();
const MIN = 60 * 1000;

// TODO: mock só pra visualização/teste — some assim que existir canal
// de mensagem real (services/api.ts + realtime).
export const MOCK_LOBBY_MESSAGES: LobbyChatMessage[] = [
  {
    id: 'm1',
    senderId: 'r1',
    senderName: 'Marina Alves',
    senderAvatarUrl: 'https://i.pravatar.cc/200?img=32',
    text: 'Bora treinar amanhã de manhã?',
    createdAt: now - 20 * MIN,
  },
  {
    id: 'm2',
    senderId: CURRENT_USER_ID,
    senderName: CURRENT_USER_NAME,
    senderAvatarUrl: CURRENT_USER_AVATAR,
    text: 'Bora! Que horas?',
    createdAt: now - 18 * MIN,
  },
  {
    id: 'm3',
    senderId: 'r2',
    senderName: 'Lucas Ferreira',
    senderAvatarUrl: 'https://i.pravatar.cc/200?img=12',
    text: '6h no ponto de sempre?',
    createdAt: now - 15 * MIN,
  },
  {
    id: 'm4',
    senderId: 'r3',
    senderName: 'Julia Prado',
    senderAvatarUrl: 'https://i.pravatar.cc/200?img=47',
    text: 'Só consigo às 6:30, dá pra segurar um pouquinho?',
    createdAt: now - 10 * MIN,
  },
  {
    id: 'm5',
    senderId: CURRENT_USER_ID,
    senderName: CURRENT_USER_NAME,
    senderAvatarUrl: CURRENT_USER_AVATAR,
    text: 'Fechado, 6:30 então 👍',
    createdAt: now - 8 * MIN,
  },
];
