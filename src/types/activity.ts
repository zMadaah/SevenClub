import { LatLng } from 'react-native-maps';
import { ActivityType } from './lobby';

export interface CompletedActivity {
  id: string;
  name: string;
  activityType: ActivityType;
  points: LatLng[];
  distanceMeters: number;
  durationSeconds: number;
  paceLabel: string;
  loopClosed: boolean;
  captureM2: number;
  createdAt: number;
}

// GET /activities (lista) não devolve a trajetória de cada item — isso
// evitaria uma resposta enorme pra uma tela que só precisa dos números.
// O trajeto completo só vem em GET /activities/:id (ver services/api.ts).
export type ActivitySummary = Omit<CompletedActivity, 'points'>;