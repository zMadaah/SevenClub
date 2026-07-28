import { RivalEntry } from '../../types/rival';
import { ActivityType } from '../../types/lobby';

// TODO: trocar por chamada real em services/api.ts assim que existir.
// Cores reaproveitam a paleta de "Minha cor" do EditProfile — cada rival
// aparece com a cor que ele mesmo escolheu no perfil dele.
export const YOUR_COLOR = '#BCFF00';

export const MOCK_RIVALS: Record<ActivityType, RivalEntry[]> = {
  run: [
    { id: 'riv1', name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', color: '#1D9E75', yourTerritoryKm2: 9.2, yourSteals: 4, rivalTerritoryKm2: 3, rivalSteals: 4, activityType: 'run' },
    { id: 'riv2', name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', color: '#378ADD', yourTerritoryKm2: 6.4, yourSteals: 8, rivalTerritoryKm2: 2, rivalSteals: 3, activityType: 'run' },
    { id: 'riv3', name: 'Julia Prado', avatarUrl: 'https://i.pravatar.cc/200?img=47', color: '#BA7517', yourTerritoryKm2: 3.3, yourSteals: 3, rivalTerritoryKm2: 4.8, rivalSteals: 2, activityType: 'run' },
    { id: 'riv4', name: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/200?img=15', color: '#7F77DD', yourTerritoryKm2: 1.6, yourSteals: 2, rivalTerritoryKm2: 2.8, rivalSteals: 2, activityType: 'run' },
  ],
  ride: [
    { id: 'riv5', name: 'Lucas Ferreira', avatarUrl: 'https://i.pravatar.cc/200?img=12', color: '#378ADD', yourTerritoryKm2: 5.0, yourSteals: 5, rivalTerritoryKm2: 1.5, rivalSteals: 2, activityType: 'ride' },
    { id: 'riv6', name: 'Marina Alves', avatarUrl: 'https://i.pravatar.cc/200?img=32', color: '#1D9E75', yourTerritoryKm2: 2.0, yourSteals: 2, rivalTerritoryKm2: 3.5, rivalSteals: 3, activityType: 'ride' },
  ],
};