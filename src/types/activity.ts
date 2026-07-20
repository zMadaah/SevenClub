import { LatLng } from 'react-native-maps';

export interface CompletedActivity {
  id: string;
  name: string;
  points: LatLng[];
  distanceMeters: number;
  durationSeconds: number;
  paceLabel: string;
  loopClosed: boolean;
  captureM2: number;
  createdAt: number;
}