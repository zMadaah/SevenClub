import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ActivitySummary } from '../../../types/activity';
import { colors } from '../../../theme/colors';
import { styles } from './ActivityCard.styles';

interface ActivityCardProps {
  item: ActivitySummary;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatCapture(captureM2: number): string {
  if (captureM2 <= 0) return '—';
  if (captureM2 >= 10000) return `${(captureM2 / 1_000_000).toFixed(2)} km²`;
  return `${Math.round(captureM2)} m²`;
}

// Versão simplificada do card: o antigo esperava ActivityFeedItem (carrossel
// de frames de rota, curtidas, nome/avatar de outro corredor) — dados de
// feed social que não existem em CompletedActivity, que é só a atividade
// da própria pessoa. Sem trajetória aqui de propósito: a listagem
// (GET /activities) não devolve os pontos de GPS, só o resumo.
export default function ActivityCard({ item }: ActivityCardProps) {
  const dateLabel = new Date(item.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons
            name={item.activityType === 'ride' ? 'bike' : 'run'}
            size={16}
            color={colors.richBlack}
          />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.date}>{dateLabel}</Text>
        </View>

        {!item.loopClosed && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>sem captura</Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>distância</Text>
          <Text style={styles.statValue}>{(item.distanceMeters / 1000).toFixed(2)} km</Text>
        </View>

        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>duração</Text>
          <Text style={styles.statValue}>{formatDuration(item.durationSeconds)}</Text>
        </View>

        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>pace</Text>
          <Text style={styles.statValue}>{item.paceLabel}</Text>
        </View>

        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>captura</Text>
          <Text style={styles.statValue}>{formatCapture(item.captureM2)}</Text>
        </View>
      </View>
    </View>
  );
}
