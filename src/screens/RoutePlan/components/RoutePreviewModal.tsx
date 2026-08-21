import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Map, Camera, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { Feature, LineString, Polygon as GeoJSONPolygon } from 'geojson';

import { LatLng } from '../../../utils/geo';
import { MAP_STYLE_URL } from '../../../config/mapStyle';
import { styles } from './RoutePreviewModal.styles';

interface Runner {
  id: string;
  avatarUrl: string;
}

interface RoutePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  points: LatLng[];
  distanceMeters: number;
  captureM2: number;
  loopClosed: boolean;
  routeName: string;
  onChangeRouteName: (text: string) => void;
  onSave: () => void;
  saving: boolean;
  nearbyRunners?: Runner[];
}

const MOCK_RUNNERS: Runner[] = [
  { id: '1', avatarUrl: 'https://i.pravatar.cc/200?img=12' },
  { id: '2', avatarUrl: 'https://i.pravatar.cc/200?img=32' },
  { id: '3', avatarUrl: 'https://i.pravatar.cc/200?img=47' },
];

function boundsForPoints(points: LatLng[]): [number, number, number, number] {
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
}

export default function RoutePreviewModal({
  visible,
  onClose,
  points,
  distanceMeters,
  captureM2,
  loopClosed,
  routeName,
  onChangeRouteName,
  onSave,
  saving,
  nearbyRunners = MOCK_RUNNERS,
}: RoutePreviewModalProps) {
  const trackFeature: Feature<GeoJSONPolygon | LineString> | null =
    points.length > 1
      ? {
          type: 'Feature',
          properties: {},
          geometry: loopClosed
            ? { type: 'Polygon', coordinates: [points.map((p) => [p.longitude, p.latitude] as [number, number])] }
            : { type: 'LineString', coordinates: points.map((p) => [p.longitude, p.latitude] as [number, number]) },
        }
      : null;

  const km = (distanceMeters / 1000).toFixed(2);
  const captureLabel = captureM2 >= 10000 ? (captureM2 / 1000000).toFixed(2) : Math.round(captureM2).toString();
  const captureUnit = captureM2 >= 10000 ? 'km²' : 'm²';
  const canSave = routeName.trim().length > 0 && !saving;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>prévia da rota</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <View style={styles.mapPreview}>
            {trackFeature && (
              <Map
                style={styles.mapPreviewInner}
                mapStyle={MAP_STYLE_URL}
                dragPan={false}
                touchZoom={false}
                touchRotate={false}
                touchPitch={false}
              >
                <Camera
                  initialViewState={{
                    bounds: boundsForPoints(points),
                    padding: { top: 40, right: 40, bottom: 40, left: 40 },
                  }}
                />

                <GeoJSONSource id="route-preview-track" data={trackFeature}>
                  {loopClosed ? (
                    <>
                      <Layer id="route-preview-fill" type="fill" style={{ fillColor: 'rgba(188, 255, 0, 0.3)' }} />
                      <Layer id="route-preview-stroke" type="line" style={{ lineColor: '#7FBF00', lineWidth: 3 }} />
                    </>
                  ) : (
                    <Layer id="route-preview-line" type="line" style={{ lineColor: '#7FBF00', lineWidth: 4 }} />
                  )}
                </GeoJSONSource>
              </Map>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>distância</Text>
              <Text style={styles.statValue}>
                {km}<Text style={styles.statUnit}>km</Text>
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>captura estimada</Text>
              <Text style={styles.statValue}>
                {captureLabel}<Text style={styles.statUnit}>{captureUnit}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.block}>
            <View style={styles.runnersHeader}>
              <Ionicons name="people-outline" size={16} color="#111" />
              <Text style={styles.subtitle}>corredores nesta área</Text>
            </View>

            <View style={styles.runnersRow}>
              {nearbyRunners.slice(0, 6).map((runner) => (
                <Image key={runner.id} source={{ uri: runner.avatarUrl }} style={styles.runnerAvatar} />
              ))}
            </View>

            <Text style={styles.runnersCaption}>
              Se você correr essa rota agora, pode capturar parte do território deles.
            </Text>
          </View>

          <Text style={styles.disclaimer}>
            A prévia é uma estimativa. Os resultados reais podem variar conforme o estado do
            jogo no momento da sua atividade.
          </Text>

          <View style={styles.routeNameHeader}>
            <Text style={styles.subtitle}>nome da rota</Text>
            <Text style={styles.requiredTag}>obrigatório</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="ex.: Volta da manhã, Circuito do parque"
            placeholderTextColor="#999"
            value={routeName}
            onChangeText={onChangeRouteName}
          />

          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            disabled={!canSave}
            onPress={onSave}
          >
            <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
              {saving ? 'SALVANDO...' : 'SALVAR ROTA'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}