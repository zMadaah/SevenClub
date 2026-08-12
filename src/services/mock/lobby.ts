import { Lobby } from '../../types/lobby';
import { CURRENT_USER_ID } from '../../constants/currentUser';

// TODO: mock só pra visualização/teste — remover quando o fluxo real
// de criar/entrar em lobby estiver conectado a um backend de verdade.
//
// "TESTE 2" é seu (creatorId = você) — abre a tela de admin ao tocar na
// engrenagem. "Grupo da Manhã" é do Rafael — abre a tela de participante
// (só participantes + sair), pra dar pra testar as duas visões.
export const MOCK_MY_LOBBIES: Lobby[] = [
  {
    id: 'mock-lobby-1',
    name: 'TESTE 2',
    pictureUri: undefined,
    creatorId: CURRENT_USER_ID,
    allowPreviousImports: true,
    allowMemberInvitations: false,
    inGameChatEnabled: true,
    maxLobbySize: null,
    inviteCode: 'AB3KZQ',
    members: [
      { id: 'r1', name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32' },
      { id: 'r2', name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12' },
      { id: 'r3', name: 'Julia Prado', avatarUrl: 'https://i.pravatar.cc/200?img=47' },
    ],
    createdAt: Date.now(),
  },
  {
    id: 'mock-lobby-2',
    name: 'Grupo da Manhã',
    pictureUri: undefined,
    creatorId: 'r4',
    allowPreviousImports: true,
    allowMemberInvitations: true,
    inGameChatEnabled: true,
    maxLobbySize: 10,
    inviteCode: 'PL9X2R',
    members: [
      { id: 'r4', name: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/200?img=15' },
    ],
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
];

export const MOCK_ACTIVE_LOBBY: Lobby = MOCK_MY_LOBBIES[0];
