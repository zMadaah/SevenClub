import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { LeaderboardEntry } from '../../../types/leaderboard';
import { colors } from '../../../theme/colors';
import { styles } from './LeaderboardRow.styles';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export default function LeaderboardRow({ entry }: LeaderboardRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>#{entry.rank}</Text>

      <Text style={styles.flag}>{entry.countryFlag}</Text>

      {entry.rank === 1 ? (
        <MaterialCommunityIcons name="crown" size={16} color={colors.accent} style={styles.medal} />
      ) : entry.rank <= 3 ? (
        <MaterialCommunityIcons name="medal" size={16} color={colors.laurelLeaf} style={styles.medal} />
      ) : null}

      <Image source={{ uri: entry.avatarUrl }} style={styles.avatar} />

      <Text style={styles.name} numberOfLines={1}>
        {entry.name}
      </Text>

      <Text style={styles.value}>
        {entry.territoryKm2.toFixed(1)} <Text style={styles.unit}>km²</Text>
      </Text>
    </View>
  );
}
