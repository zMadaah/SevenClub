import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Image as SvgImage, Path, ClipPath, Defs } from 'react-native-svg';

import { LeaderboardEntry } from '../../../types/leaderboard';
import { colors } from '../../../theme/colors';
import { styles } from './PodiumSpot.styles';

interface PodiumSpotProps {
  entry: LeaderboardEntry;
  place: 1 | 2 | 3;
  maxValue: number;
}

const SHIELD_PATH = 'M4 4 H68 V42 Q68 64 36 76 Q4 64 4 42 Z';

const BAR_MIN_HEIGHT = 60;
const BAR_MAX_HEIGHT = 140;

// Cada posição do pódio tem sua própria cor de barra — reaproveitando
// tokens que já existem no theme, sem introduzir hex novo
const PLACE_COLORS: Record<1 | 2 | 3, string> = {
  1: colors.accent,
  2: colors.secondary,
  3: colors.thirdy,
};

export default function PodiumSpot({ entry, place, maxValue }: PodiumSpotProps) {
  const barHeight =
    BAR_MIN_HEIGHT + (BAR_MAX_HEIGHT - BAR_MIN_HEIGHT) * (entry.territoryKm2 / (maxValue || 1));

  return (
    <View style={[styles.container, place === 1 && styles.containerFirst]}>
      <View style={styles.avatarWrapper}>
        <Svg width={72} height={80} viewBox="0 0 72 80">
          <Defs>
            <ClipPath id={`clip-podium-${entry.id}`}>
              <Path d={SHIELD_PATH} />
            </ClipPath>
          </Defs>
          <SvgImage
            href={{ uri: entry.avatarUrl }}
            width={72}
            height={80}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#clip-podium-${entry.id})`}
          />
          <Path d={SHIELD_PATH} fill="none" stroke={colors.accent} strokeWidth={3} />
        </Svg>

        <View style={[styles.rankBadge, place === 1 && styles.rankBadgeCrown]}>
          {place === 1 ? (
            <MaterialCommunityIcons name="crown" size={14} color={colors.richBlack} />
          ) : (
            <Text style={styles.rankBadgeText}>{place}</Text>
          )}
        </View>
      </View>

      <View style={styles.nameRow}>
        <Text style={styles.flag}>{entry.countryFlag}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {entry.name}
        </Text>
      </View>

      <Text style={styles.value}>{entry.territoryKm2.toFixed(1)}km²</Text>

      <View style={[styles.bar, { height: barHeight, backgroundColor: PLACE_COLORS[place] }]} />
    </View>
  );
}