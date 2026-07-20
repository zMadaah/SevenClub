import { NotificationItem } from '../../types/notification';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', category: 'territory', title: 'Lucas tomou seu trecho', subtitle: 'Asa Norte', timeAgo: '12 min', read: false },
  { id: '2', category: 'territory', title: 'Você recuperou um trecho', subtitle: 'Av. Ipiranga', timeAgo: '2 h', read: false },
  { id: '3', category: 'invite', title: 'Convite para lobby', subtitle: 'Marina te convidou para "Galera da Asa Norte"', timeAgo: '3 h', read: false },
  { id: '4', category: 'community', title: 'Novo seguidor', subtitle: 'Rafael Souza começou a seguir você', timeAgo: '5 h', read: true },
  { id: '5', category: 'community', title: 'Curtida na sua atividade', subtitle: 'Julia curtiu "Corrida da manhã"', timeAgo: '1 d', read: true },
  { id: '6', category: 'sevenclub', title: 'Bem-vindo ao Seven Club', subtitle: 'Confira os desafios da semana', timeAgo: '2 d', read: true },
];