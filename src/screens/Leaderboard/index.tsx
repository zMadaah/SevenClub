import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { MOCK_GLOBAL_LEADERBOARD } from '../../services/mock/leaderboard';
import { LeaderboardEntry } from '../../types/leaderboard';
import { ActivityType } from '../../types/lobby';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type Scope = 'global' | 'country' | 'friends';

// TODO: trocar '0 seguidos' por dado real de AddFriend/services/api.ts
// assim que a relação de "quem eu sigo" existir compartilhada entre telas
const FOLLOWED_COUNT = 0;

function reRank(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.territoryKm2 - a.territoryKm2)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export default function Leaderboard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [scope, setScope] = useState<Scope>('global');

  const baseList = MOCK_GLOBAL_LEADERBOARD[activityType];

  const visibleList = useMemo(() => {
    if (scope === 'global') return baseList;
    if (scope === 'country') return reRank(baseList.filter((e) => e.countryCode === 'BR'));
    return []; // 'friends' — sem dado real ainda
  }, [baseList, scope]);

  function toggleActivityType() {
    setActivityType((prev) => (prev === 'run' ? 'ride' : 'run'));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>LEADERBOARD</Text>

        <TouchableOpacity style={styles.activityPill} onPress={toggleActivityType}>
          <MaterialCommunityIcons
            name={activityType === 'ride' ? 'bike' : 'run'}
            size={14}
            color={colors.textPrimary}
          />
          <Text style={styles.activityPillText}>
            {activityType === 'ride' ? 'Pedal' : 'Corrida'}
          </Text>
          <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.togglePill, scope === 'global' && styles.togglePillActive]}
          onPress={() => setScope('global')}
        >
          <Text style={[styles.toggleText, scope === 'global' && styles.toggleTextActive]}>
            Global
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.togglePill, scope === 'country' && styles.togglePillActive]}
          onPress={() => setScope('country')}
        >
          <Text style={[styles.toggleText, scope === 'country' && styles.toggleTextActive]}>
            País
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.togglePill, scope === 'friends' && styles.togglePillActive]}
          onPress={() => setScope('friends')}
        >
          <Text style={[styles.toggleText, scope === 'friends' && styles.toggleTextActive]}>
            Amigos
          </Text>
        </TouchableOpacity>
      </View>

      {scope === 'friends' ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={28} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Você ainda não segue ninguém</Text>
          <Text style={styles.emptyText}>
            Siga corredores para ver o ranking entre vocês aqui.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddFriend')}
          >
            <Text style={styles.emptyButtonText}>ADICIONAR AMIGOS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={visibleList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={[styles.row, item.isCurrentUser && styles.rowCurrentUser]}>
              <Text
                style={[
                  styles.rank,
                  item.rank <= 3 && styles.rankTop3,
                ]}
              >
                {item.rank}
              </Text>

              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />

              <View style={styles.rowInfo}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.isCurrentUser ? 'Você' : item.name}
                </Text>
                <Text style={styles.location}>{item.countryFlag}</Text>
              </View>

              <Text style={styles.territoryValue}>
                {item.territoryKm2.toFixed(1)} <Text style={styles.territoryUnit}>km²</Text>
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}