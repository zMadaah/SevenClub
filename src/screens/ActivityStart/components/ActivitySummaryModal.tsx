import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polygon, Polyline, LatLng } from 'react-native-maps';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import ShareableActivityCard from './ShareableActivityCard';
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
  activityType: 'run' | 'ride';
  onChangeActivityName: (text: string) => void;
  saving: boolean;
  saved: boolean;
  onFinish: () => void;
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
  activityType,
  onChangeActivityName,
  saving,
  saved,
  onFinish,
}: ActivitySummaryModalProps) {
  const mapRef = useRef<MapView>(null);
  const cardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

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

  async function handleShareCard() {
    setSharing(true);
    try {
      const uri = await captureRef(cardRef, { format: 'png', quality: 0.95 });
      const canShareFile = await Sharing.isAvailableAsync();

      if (canShareFile) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png' });
      } else {
        // Aparelho sem suporte ao compartilhamento de arquivo (raro) —
        // cai pro compartilhamento de texto simples como alternativa
        await Share.share({
          message: `Acabei de ${activityType === 'run' ? 'correr' : 'pedalar'} ${km} km no Seven Club!`,
        });
      }
    } catch {
      Alert.alert('Não foi possível compartilhar', 'Tenta novamente em alguns instantes.');
    } finally {
      setSharing(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={saved ? onFinish : onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {saved ? (
            <>
              <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark-circle" size={56} color="#1D9E75" />
              </View>

              <Text style={styles.successTitle}>Atividade salva!</Text>
              <Text style={styles.successSubtitle}>
                Já apareceu no seu feed — quer compartilhar em outro lugar também?
              </Text>

              <ShareableActivityCard
                ref={cardRef}
                activityType={activityType}
                activityName={activityName}
                distanceKm={km}
                durationLabel={durationLabel}
                paceLabel={paceLabel}
                captureM2={loopClosed ? captureM2 : null}
              />

              <TouchableOpacity
                style={[styles.shareButton, sharing && styles.saveButtonDisabled]}
                onPress={handleShareCard}
                disabled={sharing}
              >
                <Ionicons name="share-social" size={16} color="#061414" />
                <Text style={styles.shareButtonText}>
                  {sharing ? 'PREPARANDO...' : 'COMPARTILHAR'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.finishButton} onPress={onFinish}>
                <Text style={styles.finishButtonText}>CONCLUIR</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
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
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}