import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../navigation/types';
import {
  MOCK_WORLD_LEADERBOARD,
  MOCK_AREA_LEADERBOARD,
  MOCK_MY_RANK,
  USER_COUNTRY_NAME,
  USER_COUNTRY_CODE,
} from '../../services/mock/leaderboard';
import { LeaderboardEntry, Scope } from '../../types/leaderboard';
import { ActivityType } from '../../types/lobby';
import { colors } from '../../theme/colors';
import { styles } from './styles';

import PodiumSpot from './components/PodiumSpot';
import LeaderboardRow from './components/LeaderboardRow';
import MyRankRow from './components/MyRankRow';

function reRank(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.territoryKm2 - a.territoryKm2)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export default function Leaderboard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [scope, setScope] = useState<Scope>('world');

  const worldList = MOCK_WORLD_LEADERBOARD[activityType];
  const areaList = MOCK_AREA_LEADERBOARD[activityType];

  const visibleList = useMemo(() => {
    if (scope === 'world') return worldList;
    if (scope === 'area') return areaList;
    if (scope === 'country') return reRank(worldList.filter((e) => e.countryCode === USER_COUNTRY_CODE));
    return []; // 'friends' — sem dado real ainda
  }, [worldList, areaList, scope]);

  const topThree = visibleList.slice(0, 3);
  const rest = visibleList.slice(3);
  const maxValue = topThree[0]?.territoryKm2 ?? 1;

  const myRank = scope !== 'friends' ? MOCK_MY_RANK[activityType][scope] : null;

  function toggleActivityType() {
    setActivityType((prev) => (prev === 'run' ? 'ride' : 'run'));
  }

  const SCOPE_TABS: { value: Scope; label: string }[] = [
    { value: 'area', label: 'Área' },
    { value: 'country', label: USER_COUNTRY_NAME },
    { value: 'world', label: 'Mundo' },
    { value: 'friends', label: 'Amigos' },
  ];

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

      <View style={styles.scopeRow}>
        {SCOPE_TABS.map((tab) => {
          const active = tab.value === scope;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.scopePill, active && styles.scopePillActive]}
              onPress={() => setScope(tab.value)}
            >
              <Text style={[styles.scopeText, active && styles.scopeTextActive]} numberOfLines={1}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + insets.bottom }]}
        >
          {topThree.length === 3 && (
            <View style={styles.podiumRow}>
              <PodiumSpot entry={topThree[1]} place={2} maxValue={maxValue} />
              <PodiumSpot entry={topThree[0]} place={1} maxValue={maxValue} />
              <PodiumSpot entry={topThree[2]} place={3} maxValue={maxValue} />
            </View>
          )}

          <View style={styles.listCard}>
            {topThree.map((entry) => (
              <LeaderboardRow key={entry.id} entry={entry} />
            ))}

            {rest.length > 0 && (
              <View style={styles.blurWrapper}>
                <View pointerEvents="none">
                  {rest.map((entry) => (
                    <LeaderboardRow key={entry.id} entry={entry} />
                  ))}
                </View>

                {/* Camada sólida — não depende de nenhum módulo nativo, sempre funciona */}
                <View style={styles.blurScrim} pointerEvents="none" />

                <View style={styles.blurLabel} pointerEvents="none">
                  <Ionicons name="lock-closed" size={18} color={colors.textPrimary} />
                  <Text style={styles.blurText}>Assine o Pro para ver o ranking completo</Text>
                </View>
              </View>
            )}
          </View>

          {myRank && <MyRankRow myRank={myRank} />}
        </ScrollView>
      )}
    </View>
  );
}