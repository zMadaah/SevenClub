// Tipo próprio — desacoplado de qualquer biblioteca de mapa específica.
// Antes vinha de 'react-native-maps'; a migração pro MapLibre não deveria
// obrigar todo tipo/util que só lida com coordenadas a saber qual lib de
// mapa está em uso por trás.
export interface LatLng {
  latitude: number;
  longitude: number;
}

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

const toDeg = (rad: number) => (rad * 180) / Math.PI;

// Direção (0-360°) de A para B — usado pra apontar a câmera "pra frente"
// durante o replay/sobrevoo do recap
export function bearingBetween(a: LatLng, b: LatLng): number {
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export interface PathState {
  current: LatLng;
  heading: number;
  revealedPoints: LatLng[];
}

// Dado um progresso de 0 a 1, calcula: a posição exata ao longo do
// caminho (interpolada por distância percorrida, não por índice — assim
// a velocidade do "voo" fica constante mesmo com pontos irregulares),
// a direção pra onde a câmera deve apontar, e o trecho já percorrido
// (pra desenhar a linha progressivamente)
export function getPathState(points: LatLng[], progress: number): PathState {
  const clamped = Math.min(Math.max(progress, 0), 1);

  if (points.length < 2) {
    return { current: points[0], heading: 0, revealedPoints: points };
  }

  const cumulative: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    cumulative.push(cumulative[i - 1] + haversineDistance(points[i - 1], points[i]));
  }
  const total = cumulative[cumulative.length - 1];
  const targetDistance = total * clamped;

  let segmentIndex = 0;
  while (
    segmentIndex < cumulative.length - 2 &&
    cumulative[segmentIndex + 1] < targetDistance
  ) {
    segmentIndex++;
  }

  const segStart = points[segmentIndex];
  const segEnd = points[segmentIndex + 1] ?? segStart;
  const segStartDist = cumulative[segmentIndex];
  const segLength = haversineDistance(segStart, segEnd) || 1;
  const segProgress = Math.min(Math.max((targetDistance - segStartDist) / segLength, 0), 1);

  const current: LatLng = {
    latitude: segStart.latitude + (segEnd.latitude - segStart.latitude) * segProgress,
    longitude: segStart.longitude + (segEnd.longitude - segStart.longitude) * segProgress,
  };

  return {
    current,
    heading: bearingBetween(segStart, segEnd),
    revealedPoints: [...points.slice(0, segmentIndex + 1), current],
  };
}