import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MyRankEntry } from '../../../types/leaderboard';
import { colors } from '../../../theme/colors';
import { styles } from './MyRankRow.styles';

interface MyRankRowProps {
  myRank: MyRankEntry;
}

export default function MyRankRow({ myRank }: MyRankRowProps) {
  return (
    <View>
      <View style={styles.divider}>
        <View style={styles.dividerPill}>
          <Text style={styles.dividerText}>MEU RANK</Text>
          <Ionicons name="chevron-down" size={12} color={colors.textOnDark} />
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.rank}>#{myRank.rank.toLocaleString('pt-BR')}</Text>
        <Text style={styles.flag}>{myRank.countryFlag}</Text>
        <Image source={{ uri: myRank.avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>Você</Text>
        <Text style={styles.value}>
          {myRank.territoryKm2.toFixed(1)} <Text style={styles.unit}>km²</Text>
        </Text>
      </View>
    </View>
  );
}
