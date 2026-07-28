import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RivalEntry } from '../../types/rival';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { styles } from './styles';

interface RivalCardProps {
  rival: RivalEntry;
  yourColor?: string;
  compact?: boolean;
}

export default function RivalCard({ rival, yourColor = colors.accent, compact = false }: RivalCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const total = rival.yourTerritoryKm2 + rival.rivalTerritoryKm2;
  const yourRatio = total > 0 ? rival.yourTerritoryKm2 / total : 0.5;
  const diff = rival.yourTerritoryKm2 - rival.rivalTerritoryKm2;
  const isWinning = diff >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.nameRow}>
        <Text style={styles.nameLeft}>Você</Text>
        <Text style={styles.nameRight}>{rival.name}</Text>
      </View>

      <View style={styles.barRow}>
        <Image source={{ uri: 'https://i.pravatar.cc/200?img=10' }} style={styles.avatar} />

        <View style={styles.barTrack}>
          <View
            style={[
              styles.barSegment,
              {
                flex: Math.max(yourRatio, 0.06),
                backgroundColor: yourColor,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              },
            ]}
          />
          <View
            style={[
              styles.barSegment,
              {
                flex: Math.max(1 - yourRatio, 0.06),
                backgroundColor: rival.color,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            ]}
          />
        </View>

        <Image source={{ uri: rival.avatarUrl }} style={styles.avatar} />
      </View>

      <View style={styles.statsRow}>
        <View>
          <Text style={styles.statValue}>{rival.yourTerritoryKm2.toFixed(1)} km²</Text>
          <Text style={styles.statLabel}>{rival.yourSteals} vezes</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.statValue}>{rival.rivalTerritoryKm2.toFixed(1)} km²</Text>
          <Text style={styles.statLabel}>{rival.rivalSteals} vezes</Text>
        </View>
      </View>

      {!compact && (
        <View style={styles.messageStrip}>
          <Text style={styles.messageText}>
            {isWinning
              ? `Você roubou ${diff.toFixed(1)} km² a mais de território`
              : `Você está ${Math.abs(diff).toFixed(1)} km² atrás`}
          </Text>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => navigation.navigate('RoutePlan')}
          >
            <Ionicons name={isWinning ? 'flag' : 'shield-outline'} size={13} color={colors.richBlack} />
            <Text style={styles.messageButtonText}>
              {isWinning ? 'AMPLIAR VANTAGEM' : 'RECONQUISTAR'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}