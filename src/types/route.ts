import { LatLng } from 'react-native-maps';

export interface SavedRoute {
  id: string;
  name: string;
  points: LatLng[];
  distanceMeters: number;
  captureM2: number;
  createdAt: number;
}