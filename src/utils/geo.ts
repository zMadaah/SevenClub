import { LatLng } from 'react-native-maps';

const EARTH_RADIUS_M = 6371000;
const toRad = (deg: number) => (deg * Math.PI) / 180;

export function haversineDistance(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function totalDistance(points: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(points[i - 1], points[i]);
  }
  return total;
}

// Área aproximada (projeção equiretangular local — precisa o bastante
// pra loops do tamanho de um treino, não usar pra áreas continentais)
export function polygonArea(points: LatLng[]): number {
  if (points.length < 3) return 0;

  const lat0 = toRad(points[0].latitude);
  const xy = points.map((p) => ({
    x: toRad(p.longitude) * EARTH_RADIUS_M * Math.cos(lat0),
    y: toRad(p.latitude) * EARTH_RADIUS_M,
  }));

  let area = 0;
  for (let i = 0; i < xy.length; i++) {
    const j = (i + 1) % xy.length;
    area += xy[i].x * xy[j].y - xy[j].x * xy[i].y;
  }
  return Math.abs(area / 2);
}

// Loop é considerado "fechado" se o traçado voltou perto o suficiente
// do ponto inicial — é essa regra que ativa o preenchimento no mapa
export function isLoopClosed(points: LatLng[], toleranceMeters = 25): boolean {
  if (points.length < 3) return false;
  return haversineDistance(points[0], points[points.length - 1]) <= toleranceMeters;
}