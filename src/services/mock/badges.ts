import { Badge, BadgeUnlock, BadgeWithStatus } from '../../types/badge';
import { CURRENT_SEASON } from './seasons';

// Catálogo de insígnias — evergreen, o mesmo em qualquer temporada
export const BADGE_CATALOG: Badge[] = [
  {
    id: 'b1',
    name: 'Primeira Corrida',
    description: 'Complete sua primeira atividade no Seven Club.',
    icon: 'walk',
    iconLib: 'ionicons',
  },
  {
    id: 'b2',
    name: 'Primeiro Território',
    description: 'Feche seu primeiro loop e capture território pela primeira vez.',
    icon: 'flag-variant',
    iconLib: 'mci',
  },
  {
    id: 'b3',
    name: 'Ladrão de Território',
    description: 'Roube território de um rival pela primeira vez.',
    icon: 'sword-cross',
    iconLib: 'mci',
  },
  {
    id: 'b4',
    name: 'Fundador de Crew',
    description: 'Crie seu próprio crew e chame a galera.',
    icon: 'account-group',
    iconLib: 'mci',
  },
  {
    id: 'b5',
    name: 'Sequência de 7 Dias',
    description: 'Registre atividade por 7 dias seguidos.',
    icon: 'fire',
    iconLib: 'mci',
  },
  {
    id: 'b6',
    name: 'Top 100 Global',
    description: 'Alcance o top 100 do ranking global.',
    icon: 'trophy',
    iconLib: 'ionicons',
  },
  // A partir daqui: catálogo pedido, ainda SEM critério real de
  // desbloqueio no backend (ver nota em getBadgeStatuses/AllBadges —
  // aparecem marcados como "Em breve", não "Bloqueada").
  {
    id: 'b7',
    name: 'Primeiros 7 KM',
    description: 'Complete uma atividade de pelo menos 7 km.',
    icon: 'run',
    iconLib: 'mci',
  },
  {
    id: 'b8',
    name: 'Primeiros 10 KM',
    description: 'Complete uma atividade de pelo menos 10 km.',
    icon: 'run-fast',
    iconLib: 'mci',
  },
  {
    id: 'b9',
    name: 'Primeira Meia Maratona',
    description: 'Complete uma atividade de pelo menos 21,1 km.',
    icon: 'map-marker-distance',
    iconLib: 'mci',
  },
  {
    id: 'b10',
    name: 'Primeira Maratona',
    description: 'Complete uma atividade de pelo menos 42,2 km.',
    icon: 'trophy-award',
    iconLib: 'mci',
  },
  {
    id: 'b11',
    name: 'Recorde Pessoal',
    description: 'Bata seu próprio recorde de ritmo numa atividade.',
    icon: 'chart-line',
    iconLib: 'mci',
  },
  {
    id: 'b12',
    name: 'Sequência de 15 Dias',
    description: 'Registre atividade por 15 dias seguidos.',
    icon: 'fire',
    iconLib: 'mci',
  },
  {
    id: 'b13',
    name: 'Sequência de 30 Dias',
    description: 'Registre atividade por 30 dias seguidos.',
    icon: 'fire',
    iconLib: 'mci',
  },
  {
    id: 'b14',
    name: '100 Atividades',
    description: 'Registre 100 atividades ao longo da temporada.',
    icon: 'numeric-100-box',
    iconLib: 'mci',
  },
  {
    id: 'b15',
    name: '250 Atividades',
    description: 'Registre 250 atividades ao longo da temporada.',
    icon: 'checkbox-multiple-marked',
    iconLib: 'mci',
  },
  {
    id: 'b16',
    name: '500 Atividades',
    description: 'Registre 500 atividades ao longo da temporada.',
    icon: 'checkbox-multiple-marked',
    iconLib: 'mci',
  },
  {
    id: 'b17',
    name: '750 Atividades',
    description: 'Registre 750 atividades ao longo da temporada.',
    icon: 'checkbox-multiple-marked',
    iconLib: 'mci',
  },
  {
    id: 'b18',
    name: '1000 Atividades',
    description: 'Registre 1000 atividades ao longo da temporada.',
    icon: 'checkbox-multiple-marked',
    iconLib: 'mci',
  },
  {
    id: 'b19',
    name: 'Corredor Mais Rápido',
    description: 'Tenha o melhor ritmo médio do ranking global.',
    icon: 'speedometer',
    iconLib: 'mci',
  },
  {
    id: 'b20',
    name: 'Rei/Rainha de Território',
    description: 'Tenha o maior território do ranking global.',
    icon: 'crown',
    iconLib: 'mci',
  },
  // Ideias extras, encaixadas na mecânica que o app já tem (território,
  // rivais, corrida x pedal, tempo de conta) — mesmo status das acima,
  // catálogo pronto, detecção real fica pra quando decidirmos priorizar.
  {
    id: 'b21',
    name: 'Primeira Pedalada',
    description: 'Complete sua primeira atividade de pedal no Seven Club.',
    icon: 'bicycle',
    iconLib: 'ionicons',
  },
  {
    id: 'b22',
    name: '100 KM Percorridos',
    description: 'Acumule 100 km percorridos ao longo da temporada.',
    icon: 'road-variant',
    iconLib: 'mci',
  },
  {
    id: 'b23',
    name: '500 KM Percorridos',
    description: 'Acumule 500 km percorridos ao longo da temporada.',
    icon: 'road-variant',
    iconLib: 'mci',
  },
  {
    id: 'b24',
    name: '1000 KM Percorridos',
    description: 'Acumule 1000 km percorridos ao longo da temporada.',
    icon: 'road-variant',
    iconLib: 'mci',
  },
  {
    id: 'b25',
    name: 'Aniversário Seven Club',
    description: 'Complete 1 ano de conta no Seven Club.',
    icon: 'cake-variant',
    iconLib: 'mci',
  },
  {
    id: 'b26',
    name: 'Padrinho',
    description: 'Indique 5 amigos que se cadastrem usando seu código.',
    icon: 'account-multiple-plus',
    iconLib: 'mci',
  },
  {
    id: 'b27',
    name: 'Sobrevivente',
    description: 'Segure o mesmo território por 30 dias sem perder pra ninguém.',
    icon: 'shield-check',
    iconLib: 'mci',
  },
  {
    id: 'b28',
    name: 'Madrugador',
    description: 'Registre uma atividade iniciada antes das 6h da manhã.',
    icon: 'weather-sunset-up',
    iconLib: 'mci',
  },
];

// Ids que já têm critério real de desbloqueio (ver badges.service.ts no
// backend). Os que vieram depois entraram só no catálogo visual — ainda
// não têm regra nenhuma decidindo quando desbloqueiam.
export const IMPLEMENTED_BADGE_IDS = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'];

// TODO: trocar por chamada real em services/api.ts assim que existir.
// Só guarda o que foi desbloqueado NA TEMPORADA ATUAL — numa temporada
// nova, esse array volta vazio (mesmo que o usuário já tenha conquistado
// antes, em outra temporada), e é isso que reinicia a conquista.
export const MOCK_BADGE_UNLOCKS: BadgeUnlock[] = [
  { badgeId: 'b1', seasonId: CURRENT_SEASON.id, unlockedAtLabel: '20 Jul 2026' },
];

// Combina catálogo + desbloqueios de uma temporada específica — é essa
// função (e não os dados soltos) que a UI deve consumir, pra já ficar
// pronta pra troca de temporada sem precisar mudar nada na tela
export function getBadgesWithStatus(
  seasonId: string = CURRENT_SEASON.id,
  catalog: Badge[] = BADGE_CATALOG,
  unlocks: BadgeUnlock[] = MOCK_BADGE_UNLOCKS
): BadgeWithStatus[] {
  return catalog.map((badge) => {
    const unlock = unlocks.find((u) => u.badgeId === badge.id && u.seasonId === seasonId);
    return {
      ...badge,
      unlocked: Boolean(unlock),
      unlockedAtLabel: unlock?.unlockedAtLabel,
    };
  });
}
