import { Season } from '../../types/season';

// TODO: trocar por chamada real em services/api.ts assim que existir —
// quem decide quando uma temporada começa/termina é o backend, o app só
// reflete qual está ativa agora.
export const CURRENT_SEASON: Season = {
  id: 's1',
  number: 1,
  name: 'Temporada 1',
  startDateLabel: '1 Jul 2026',
  endDateLabel: '30 Set 2026',
};
