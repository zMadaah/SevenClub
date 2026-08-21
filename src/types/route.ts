import { LatLng } from '../utils/geo';

export interface SavedRoute {
  id: string;
  name: string;
  points: LatLng[];
  distanceMeters: number;
  captureM2: number;
  createdAt: number;
}