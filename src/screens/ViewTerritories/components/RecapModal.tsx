import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Map, Camera, GeoJSONSource, Layer, CameraRef } from '@maplibre/maplibre-react-native';
import type { Feature, LineString } from 'geojson';

import { MAP_STYLE_URL_DARK } from '../../../config/mapStyle';
import { getPathState } from '../../../utils/geo';
import { formatDuration } from '../../../utils/time';
import { TerritoryEntry } from '../../../types/territory';
import { colors } from '../../../theme/colors';
import { styles } from './RecapModal.styles';

interface RecapModalProps {
  visible: boolean;
  onClose: () => void;
  territory: TerritoryEntry;
}

// Duração do "voo" em si — sempre a mesma, independente de quanto tempo
// a atividade real durou (igual ao Strava: é uma prévia rápida, não
// playback em tempo real).
const ANIMATION_DURATION_MS = 9000;
const TICK_MS = 100;

function parseDurationToSeconds(label: string): number {
  const parts = label.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export default function RecapModal({ visible, onClose, territory }: RecapModalProps) {
  const cameraRef = useRef<CameraRef>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);

  const totalSeconds = useMemo(
    () => parseDurationToSeconds(territory.durationLabel),
    [territory.durationLabel]
  );

  function clearTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startTimer() {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + TICK_MS / ANIMATION_DURATION_MS;
        if (next >= 1) {
          clearTimer();
          setPlaying(false);
          setFinished(true);
          return 1;
        }
        return next;
      });
    }, TICK_MS);
  }

  useEffect(() => {
    if (visible) {
      setProgress(0);
      setPlaying(true);
      setFinished(false);
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [visible]);

  const pathState = useMemo(
    () => getPathState(territory.points, progress),
    [territory.points, progress]
  );

  // heading (react-native-maps) → bearing (MapLibre), mesmo conceito
  useEffect(() => {
    if (!visible || finished) return;
    cameraRef.current?.easeTo({
      center: [pathState.current.longitude, pathState.current.latitude],
      pitch: 60,
      bearing: pathState.heading,
      zoom: 17,
      duration: TICK_MS,
    });
  }, [pathState, visible, finished]);

  function handleTogglePlay() {
    if (finished) {
      setProgress(0);
      setFinished(false);
      setPlaying(true);
      startTimer();
      return;
    }
    if (playing) {
      clearTimer();
      setPlaying(false);
    } else {
      startTimer();
      setPlaying(true);
    }
  }

  async function handleShare() {
    try {
      const captureLabel =
        territory.captureM2 >= 10000
          ? `${(territory.captureM2 / 1000000).toFixed(1)} km²`
          : `${Math.round(territory.captureM2)} m²`;

      await Share.share({
        message: `Confira meu recap de "${territory.activityName}" — ${territory.distanceKm.toFixed(
          2
        )} km e ${captureLabel} de território capturado no Seven Club.`,
      });
    } catch {
      // usuário cancelou o share sheet — não é um erro real
    }
  }

  const distanceSoFar = territory.distanceKm * progress;
  const secondsSoFar = totalSeconds * progress;

  const revealedFeature: Feature<LineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: pathState.revealedPoints.map((p) => [p.longitude, p.latitude] as [number, number]),
    },
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Map
          style={styles.map}
          mapStyle={MAP_STYLE_URL_DARK}
          dragPan={false}
          touchZoom={false}
          touchRotate={false}
          touchPitch={false}
        >
          <Camera
            ref={cameraRef}
            initialViewState={{
              center: [territory.points[0].longitude, territory.points[0].latitude],
              zoom: 17,
            }}
          />

          <GeoJSONSource id="recap-track" data={revealedFeature}>
            <Layer id="recap-track-line" type="line" style={{ lineColor: colors.accent, lineWidth: 4 }} />
          </GeoJSONSource>
        </Map>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={22} color={colors.ceilingWhite} />
        </TouchableOpacity>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        {!finished ? (
          <View style={styles.statsBar}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>distância</Text>
              <Text style={styles.statValue}>{distanceSoFar.toFixed(2)} km</Text>
            </View>

            <TouchableOpacity style={styles.playButton} onPress={handleTogglePlay}>
              <Ionicons name={playing ? 'pause' : 'play'} size={20} color={colors.richBlack} />
            </TouchableOpacity>

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>tempo</Text>
              <Text style={styles.statValue}>{formatDuration(Math.round(secondsSoFar))}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.shareCard}>
            <Text style={styles.shareTitle}>{territory.activityName}</Text>

            <View style={styles.shareStatsRow}>
              <View style={styles.shareStatBlock}>
                <Text style={styles.shareStatLabel}>distância</Text>
                <Text style={styles.shareStatValue}>{territory.distanceKm.toFixed(2)} km</Text>
              </View>

              <View style={styles.shareStatBlock}>
                <Text style={styles.shareStatLabel}>duração</Text>
                <Text style={styles.shareStatValue}>{territory.durationLabel}</Text>
              </View>

              <View style={styles.shareStatBlock}>
                <Text style={styles.shareStatLabel}>território</Text>
                <Text style={styles.shareStatValue}>
                  {territory.captureM2 >= 10000
                    ? `${(territory.captureM2 / 1000000).toFixed(1)} km²`
                    : `${Math.round(territory.captureM2)} m²`}
                </Text>
              </View>
            </View>

            <View style={styles.shareButtonsRow}>
              <TouchableOpacity style={styles.replayButton} onPress={handleTogglePlay}>
                <Ionicons name="refresh" size={16} color={colors.textPrimary} />
                <Text style={styles.replayButtonText}>VER DE NOVO</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Ionicons name="share-social" size={16} color={colors.richBlack} />
                <Text style={styles.shareButtonText}>COMPARTILHAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
