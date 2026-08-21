import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Map, Camera, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { Feature, LineString, Polygon as GeoJSONPolygon } from 'geojson';

import { LatLng } from '../../../utils/geo';
import { MAP_STYLE_URL } from '../../../config/mapStyle';
import { styles } from './ActivitySummaryModal.styles';

interface ActivitySummaryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  points: LatLng[];
  distanceMeters: number;
  durationLabel: string;
  paceLabel: string;
  loopClosed: boolean;
  captureM2: number;
  activityName: string;
  onChangeActivityName: (text: string) => void;
  saving: boolean;
}

function boundsForPoints(points: LatLng[]): [number, number, number, number] {
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
}

export default function ActivitySummaryModal({
  visible,
  onClose,
  onSave,
  points,
  distanceMeters,
  durationLabel,
  paceLabel,
  loopClosed,
  captureM2,
  activityName,
  onChangeActivityName,
  saving,
}: ActivitySummaryModalProps) {
  const km = (distanceMeters / 1000).toFixed(2);
  const canSave = activityName.trim().length > 0 && !saving;

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

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Resumo da atividade</Text>
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
                    padding: { top: 30, right: 30, bottom: 30, left: 30 },
                  }}
                />

                <GeoJSONSource id="activity-track" data={trackFeature}>
                  {loopClosed ? (
                    <>
                      <Layer id="activity-track-fill" type="fill" style={{ fillColor: 'rgba(188, 255, 0, 0.25)' }} />
                      <Layer id="activity-track-stroke" type="line" style={{ lineColor: '#BCFF00', lineWidth: 3 }} />
                    </>
                  ) : (
                    <Layer id="activity-track-line" type="line" style={{ lineColor: '#BCFF00', lineWidth: 4 }} />
                  )}
                </GeoJSONSource>
              </Map>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>distância</Text>
              <Text style={styles.statValue}>
                {km} <Text style={styles.statUnit}>km</Text>
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>duração</Text>
              <Text style={styles.statValue}>{durationLabel}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>pace</Text>
              <Text style={styles.statValue}>
                {paceLabel} <Text style={styles.statUnit}>/km</Text>
              </Text>
            </View>
          </View>

          <View style={styles.territoryRow}>
            <Ionicons
              name={loopClosed ? 'flag' : 'information-circle-outline'}
              size={16}
              color={loopClosed ? '#1D9E75' : '#999'}
            />
            <Text style={styles.territoryText}>
              {loopClosed
                ? `${Math.round(captureM2)} m² de território capturado`
                : 'circuito não fechou em loop — sem território capturado'}
            </Text>
          </View>

          <Text style={styles.subtitle}>Nome da atividade</Text>
          <TextInput
            style={styles.input}
            placeholder="ex.: Corrida da manhã"
            placeholderTextColor="#96998C"
            value={activityName}
            onChangeText={onChangeActivityName}
          />

          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            disabled={!canSave}
            onPress={onSave}
          >
            <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
              {saving ? 'SALVANDO...' : 'SALVAR ATIVIDADE'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
