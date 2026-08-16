import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polygon, Polyline, LatLng } from 'react-native-maps';

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
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (visible && points.length > 1) {
      const timeout = setTimeout(() => {
        mapRef.current?.fitToCoordinates(points, {
          edgePadding: { top: 30, right: 30, bottom: 30, left: 30 },
          animated: false,
        });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [visible, points]);

  const km = (distanceMeters / 1000).toFixed(2);
  const canSave = activityName.trim().length > 0 && !saving;

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
            {points.length > 1 && (
              <MapView
                ref={mapRef}
                style={styles.mapPreviewInner}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                initialRegion={{
                  latitude: points[0].latitude,
                  longitude: points[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                {loopClosed ? (
                  <Polygon
                    coordinates={points}
                    fillColor="rgba(188, 255, 0, 0.25)"
                    strokeColor="#BCFF00"
                    strokeWidth={3}
                  />
                ) : (
                  <Polyline coordinates={points} strokeColor="#BCFF00" strokeWidth={4} />
                )}
              </MapView>
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