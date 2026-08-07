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
];

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
