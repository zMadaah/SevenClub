import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Map, Camera, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { Feature, Polygon as GeoJSONPolygon } from 'geojson';
import { Ionicons } from '@expo/vector-icons';

import { SavedRoute } from '../../../types/route';
import { LatLng, haversineDistance } from '../../../utils/geo';
import { MAP_STYLE_URL } from '../../../config/mapStyle';
import { styles } from './RouteCard.styles';

interface RouteCardProps {
  route: SavedRoute;
  currentLocation: LatLng | null;
  onEdit: () => void;
  onDelete: () => void;
  onStart: () => void;
}

// Limites (não mais "region com delta") que enquadram o traçado na
// miniatura — formato [west, south, east, north], que é o que o
// MapLibre espera pra `bounds`.
function boundsForPoints(points: LatLng[]): [number, number, number, number] {
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return [minLng, minLat, maxLng, maxLat];
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} M`;
  return `${(meters / 1000).toFixed(1)} KM`;
}

function formatCreatedAt(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function RouteCard({ route, currentLocation, onEdit, onDelete, onStart }: RouteCardProps) {
  const awayMeters = currentLocation ? haversineDistance(currentLocation, route.points[0]) : null;

  const routeFeature: Feature<GeoJSONPolygon> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [route.points.map((p) => [p.longitude, p.latitude] as [number, number])],
    },
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {route.name}
          </Text>
          <Text style={styles.createdAt}>Criada em {formatCreatedAt(route.createdAt)}</Text>

          <Text style={styles.distanceValue}>{(route.distanceMeters / 1000).toFixed(2)} km</Text>
          {awayMeters !== null && (
            <Text style={styles.awayValue}>{formatDistance(awayMeters)} de distância</Text>
          )}
        </View>

        <View style={styles.thumbnailBox} pointerEvents="none">
          <Map style={styles.thumbnail} mapStyle={MAP_STYLE_URL} dragPan={false} touchZoom={false}>
            <Camera
              initialViewState={{
                bounds: boundsForPoints(route.points),
                padding: { top: 12, bottom: 12, left: 12, right: 12 },
              }}
            />

            <GeoJSONSource id={`route-${route.id}`} data={routeFeature}>
              <Layer
                id={`route-${route.id}-fill`}
                type="fill"
                style={{ fillColor: 'rgba(188, 255, 0, 0.25)' }}
              />
              <Layer
                id={`route-${route.id}-stroke`}
                type="line"
                style={{ lineColor: '#BCFF00', lineWidth: 2 }}
              />
            </GeoJSONSource>
          </Map>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={18} color="#D85A30" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.iconButton}>
          <Ionicons name="pencil-outline" size={18} color="#061414" />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>COMEÇAR</Text>
          <Ionicons name="chevron-forward" size={14} color="#061414" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
