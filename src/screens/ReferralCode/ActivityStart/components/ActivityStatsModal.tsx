import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ActivityStatsModal.styles';

interface ActivityStatsModalProps {
  visible: boolean;
  distanceMeters: number;
  durationLabel: string;
  paceLabel: string;
  isPaused: boolean;
}

export default function ActivityStatsModal({
  visible,
  distanceMeters,
  durationLabel,
  paceLabel,
  isPaused,
}: ActivityStatsModalProps) {
  if (!visible) return null;

  const km = (distanceMeters / 1000).toFixed(2);

  return (
    <View style={styles.card} pointerEvents="none">
      {isPaused && (
        <View style={styles.pausedBadge}>
          <Text style={styles.pausedBadgeText}>PAUSADO</Text>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>distância</Text>
          <Text style={styles.statValue}>{km}</Text>
          <Text style={styles.statUnit}>km</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>duração</Text>
          <Text style={styles.statValue}>{durationLabel}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>pace</Text>
          <Text style={styles.statValue}>{paceLabel}</Text>
          <Text style={styles.statUnit}>km</Text>
        </View>
      </View>
    </View>
  );
}