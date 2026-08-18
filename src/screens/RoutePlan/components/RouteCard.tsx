import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Polygon, LatLng } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { SavedRoute } from '../../../types/route';
import { haversineDistance } from '../../../utils/geo';
import { styles } from './RouteCard.styles';

interface RouteCardProps {
  route: SavedRoute;
  currentLocation: LatLng | null;
  onEdit: () => void;
  onDelete: () => void;
  onStart: () => void;
}

function regionForPoints(points: LatLng[]) {
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    // *1.5 dá uma margem em volta do traçado, pra ele não colar na borda
    // da miniatura — || 0.01 cobre o caso raro de todos os pontos
    // ficarem exatamente no mesmo lugar (delta zero quebraria o mapa)
    latitudeDelta: (maxLat - minLat) * 1.5 || 0.01,
    longitudeDelta: (maxLng - minLng) * 1.5 || 0.01,
  };
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

        <View style={styles.thumbnailBox}>
          <MapView
            style={styles.thumbnail}
            initialRegion={regionForPoints(route.points)}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            pointerEvents="none"
          >
            <Polygon
              coordinates={route.points}
              strokeColor="#BCFF00"
              fillColor="rgba(188, 255, 0, 0.25)"
              strokeWidth={2}
            />
          </MapView>
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
